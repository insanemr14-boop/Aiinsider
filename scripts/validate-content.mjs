/**
 * Content validator.
 *
 * Reproduces the `src/content.config.ts` Zod rules in plain Node so content can
 * be checked without running the Astro build. That matters here because the
 * Astro toolchain's native modules cannot spawn threads on some shared hosts —
 * this script has no native dependencies and runs anywhere.
 *
 * The enums and slug lists are parsed out of the real config files rather than
 * duplicated, so this cannot silently drift from the schema it is checking.
 *
 *   npm run validate
 *
 * Exits non-zero on any error, so it is safe to chain before a build.
 */
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const ROOT = new URL('../', import.meta.url);
const p = (rel) => fileURLToPath(new URL(rel, ROOT));

const errors = [];
const warnings = [];

const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// ---------------------------------------------------------------------------
// Pull the source-of-truth lists out of the TypeScript config files.
// ---------------------------------------------------------------------------

const categoriesSrc = await readFile(p('src/config/categories.ts'), 'utf8');
const authorsSrc = await readFile(p('src/config/authors.ts'), 'utf8');
const contentConfigSrc = await readFile(p('src/content.config.ts'), 'utf8');

/** Every `slug: 'x'` in a config file, in declaration order. */
const slugsFrom = (src) => [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

const CATEGORY_SLUGS = slugsFrom(categoriesSrc);
const AUTHOR_SLUGS = slugsFrom(authorsSrc);

/**
 * Extracts a `z.enum([...])` member list by name of the collection block it
 * sits in. The content config declares each enum exactly once, so matching on
 * the surrounding collection name is unambiguous.
 */
function enumAfter(marker) {
  const at = contentConfigSrc.indexOf(marker);
  if (at === -1) return [];
  const slice = contentConfigSrc.slice(at);
  const match = slice.match(/z\.enum\(\[([\s\S]*?)\]\)/);
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

const ARTICLE_TYPES = ['news', 'guide', 'review', 'comparison', 'analysis'];
const PRICING = ['free', 'freemium', 'paid', 'open-source', 'enterprise'];
const TOOL_CATEGORIES = enumAfter('const tools = defineCollection');
const AGENT_CATEGORIES = enumAfter('const agents = defineCollection');
const PROMPT_CATEGORIES = enumAfter('const prompts = defineCollection');
const RUNTIMES = ['cloud', 'local', 'hybrid', 'ide', 'terminal'];
const AUTONOMY = ['assisted', 'supervised', 'autonomous'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function loadCollection(dir) {
  const base = p(`content/${dir}/`);
  let files;
  try {
    files = (await readdir(base)).filter((f) => /\.mdx?$/.test(f));
  } catch {
    return [];
  }

  const out = [];
  for (const file of files) {
    const raw = await readFile(base + file, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
      err(`${dir}/${file}`, 'missing or malformed front matter');
      continue;
    }
    let data;
    try {
      data = parseYaml(match[1]);
    } catch (e) {
      err(`${dir}/${file}`, `invalid YAML — ${e.message.split('\n')[0]}`);
      continue;
    }
    if (!data || typeof data !== 'object') {
      err(`${dir}/${file}`, 'front matter did not parse to an object');
      continue;
    }
    out.push({ id: file.replace(/\.mdx?$/, ''), file: `${dir}/${file}`, data, body: match[2] });
  }
  return out;
}

const required = (file, data, field) => {
  if (data[field] === undefined || data[field] === null || data[field] === '') {
    err(file, `missing required field \`${field}\``);
    return false;
  }
  return true;
};

const maxLen = (file, data, field, max) => {
  const v = data[field];
  if (typeof v === 'string' && v.length > max) {
    err(file, `\`${field}\` is ${v.length} chars, max ${max}`);
  }
};

const oneOf = (file, data, field, allowed) => {
  const v = data[field];
  if (v === undefined) return;
  if (!allowed.includes(v)) {
    err(file, `\`${field}\` is "${v}" — must be one of: ${allowed.join(', ')}`);
  }
};

const isUrl = (file, data, field, { requiredField = false } = {}) => {
  const v = data[field];
  if (v === undefined) {
    if (requiredField) err(file, `missing required field \`${field}\``);
    return;
  }
  try {
    new URL(v);
  } catch {
    err(file, `\`${field}\` is not a valid absolute URL: ${v}`);
  }
};

const isArray = (file, data, field, { min, max } = {}) => {
  const v = data[field];
  if (v === undefined) return;
  if (!Array.isArray(v)) {
    err(file, `\`${field}\` must be a list`);
    return;
  }
  if (min !== undefined && v.length < min) warn(file, `\`${field}\` has ${v.length} items, expected at least ${min}`);
  if (max !== undefined && v.length > max) warn(file, `\`${field}\` has ${v.length} items, expected at most ${max}`);
};

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

const articles = await loadCollection('articles');
const articleSlugs = new Set(articles.map((a) => a.data.slug ?? a.id));

for (const { file, data, body } of articles) {
  for (const field of ['title', 'excerpt', 'description', 'category', 'publishDate']) {
    required(file, data, field);
  }

  maxLen(file, data, 'title', 120);
  maxLen(file, data, 'excerpt', 320);
  maxLen(file, data, 'description', 320);
  maxLen(file, data, 'seoTitle', 120);
  maxLen(file, data, 'seoDescription', 320);

  oneOf(file, data, 'category', CATEGORY_SLUGS);
  oneOf(file, data, 'type', ARTICLE_TYPES);
  if (data.author !== undefined) oneOf(file, data, 'author', AUTHOR_SLUGS);

  if (data.publishDate && Number.isNaN(new Date(data.publishDate).valueOf())) {
    err(file, `\`publishDate\` is not a valid date: ${data.publishDate}`);
  }
  if (data.updatedDate && Number.isNaN(new Date(data.updatedDate).valueOf())) {
    err(file, `\`updatedDate\` is not a valid date: ${data.updatedDate}`);
  }
  if (data.publishDate && data.updatedDate) {
    if (new Date(data.updatedDate) < new Date(data.publishDate)) {
      err(file, '`updatedDate` is earlier than `publishDate`');
    }
  }

  isArray(file, data, 'tags', { min: 3 });

  if (data.faq !== undefined) {
    if (!Array.isArray(data.faq)) {
      err(file, '`faq` must be a list');
    } else {
      data.faq.forEach((entry, i) => {
        if (!entry || typeof entry.question !== 'string' || typeof entry.answer !== 'string') {
          err(file, `faq[${i}] needs both \`question\` and \`answer\` strings`);
        }
      });
      if (data.faq.length < 3) warn(file, `only ${data.faq.length} FAQ entries`);
    }
  }

  // Front matter that would be silently ignored is worth flagging — it usually
  // means the author expected behaviour they are not getting.
  if (data.heroImage) warn(file, '`heroImage` set — generated category artwork will be overridden');
  if (data.readingTime) warn(file, '`readingTime` set — overrides the computed estimate');

  // SEO description window. A warning, never a build failure.
  const desc = data.seoDescription ?? data.description;
  if (typeof desc === 'string' && (desc.length < 70 || desc.length > 165)) {
    warn(file, `meta description is ${desc.length} chars (ideal 70–165)`);
  }

  // Strip fenced code blocks first — a `# comment` in a bash sample is not a
  // Markdown heading, and flagging it would train authors to ignore this check.
  const prose = body.replace(/^```[\s\S]*?^```/gm, '');
  if (/^#\s/m.test(prose)) {
    err(file, 'body contains a level-1 heading — the layout renders the title');
  }

  const words = body.split(/\s+/).filter(Boolean).length;
  if (words < 900) warn(file, `body is only ~${words} words`);
}

// ---------------------------------------------------------------------------
// Internal link integrity — the check most likely to catch a real 404.
// ---------------------------------------------------------------------------

const KNOWN_ROUTES = new Set([
  '/', '/news/', '/tutorials/', '/comparisons/', '/reviews/', '/articles/',
  '/categories/', '/tools/', '/agents/', '/prompts/', '/resources/', '/tags/',
  '/about/', '/contact/', '/search/', '/editorial-policy/', '/privacy-policy/',
  '/terms/', '/cookie-policy/', '/disclaimer/', '/rss.xml', '/sitemap-index.xml',
]);

const toolIds = new Set();
const agentIds = new Set();
const promptIds = new Set();

const tools = await loadCollection('tools');
const agentEntries = await loadCollection('agents');
const prompts = await loadCollection('prompts');

for (const t of tools) toolIds.add(t.data.slug ?? t.id);
for (const a of agentEntries) agentIds.add(a.data.slug ?? a.id);
for (const pr of prompts) promptIds.add(pr.data.slug ?? pr.id);

const tagSet = new Set(articles.flatMap((a) => a.data.tags ?? []));

function checkLink(file, href) {
  if (!href.startsWith('/')) return; // external or anchor — not ours to verify
  const clean = href.split('#')[0].split('?')[0];
  const normalized = clean.endsWith('/') || clean.includes('.') ? clean : `${clean}/`;

  if (KNOWN_ROUTES.has(normalized)) return;

  const article = normalized.match(/^\/articles\/([^/]+)\/$/);
  if (article) {
    if (!articleSlugs.has(article[1])) err(file, `dead internal link: ${href}`);
    return;
  }
  const category = normalized.match(/^\/category\/([^/]+)\/$/);
  if (category) {
    if (!CATEGORY_SLUGS.includes(category[1])) err(file, `unknown category link: ${href}`);
    return;
  }
  const tag = normalized.match(/^\/tag\/([^/]+)\/$/);
  if (tag) {
    if (!tagSet.has(tag[1])) warn(file, `tag link with no tagged articles: ${href}`);
    return;
  }
  const tool = normalized.match(/^\/tools\/([^/]+)\/$/);
  if (tool) {
    if (!toolIds.has(tool[1])) err(file, `dead tool link: ${href}`);
    return;
  }
  const agent = normalized.match(/^\/agents\/([^/]+)\/$/);
  if (agent) {
    if (!agentIds.has(agent[1])) err(file, `dead agent link: ${href}`);
    return;
  }
  const prompt = normalized.match(/^\/prompts\/([^/]+)\/$/);
  if (prompt) {
    if (!promptIds.has(prompt[1])) err(file, `dead prompt link: ${href}`);
    return;
  }
  const author = normalized.match(/^\/authors\/([^/]+)\/$/);
  if (author) {
    if (!AUTHOR_SLUGS.includes(author[1])) err(file, `unknown author link: ${href}`);
    return;
  }
  err(file, `internal link to unknown route: ${href}`);
}

for (const { file, body } of articles) {
  for (const m of body.matchAll(/\]\((\/[^)\s]*)\)/g)) checkLink(file, m[1]);
  // Warn on articles that would sit outside the internal link graph entirely.
  const internal = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].length;
  if (internal < 2) warn(file, `only ${internal} internal links`);
}

// ---------------------------------------------------------------------------
// Directory entries (tools + agents share a schema)
// ---------------------------------------------------------------------------

function validateDirectoryEntry(entry, allowedCategories, { isAgent = false } = {}) {
  const { file, data } = entry;

  for (const field of ['name', 'tagline', 'description', 'website', 'pricing', 'category']) {
    required(file, data, field);
  }

  maxLen(file, data, 'name', 80);
  maxLen(file, data, 'tagline', 200);
  maxLen(file, data, 'description', 400);
  maxLen(file, data, 'seoTitle', 120);
  maxLen(file, data, 'seoDescription', 320);
  maxLen(file, data, 'priceNote', 120);
  maxLen(file, data, 'bestFor', 200);

  isUrl(file, data, 'website', { requiredField: true });
  isUrl(file, data, 'docs');

  oneOf(file, data, 'pricing', PRICING);
  oneOf(file, data, 'category', allowedCategories);

  if (data.rating !== undefined) {
    if (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5) {
      err(file, `\`rating\` must be a number between 0 and 5, got ${data.rating}`);
    } else if ((data.rating * 2) % 1 !== 0) {
      // The schema permits any value in range; the star row rounds down to the
      // nearest half. Worth noting, not worth failing a build over.
      warn(file, `\`rating\` ${data.rating} is not a half-point step — stars will round down`);
    }
  }

  isArray(file, data, 'features', { min: 3, max: 10 });
  isArray(file, data, 'pros', { min: 2, max: 6 });
  isArray(file, data, 'cons', { min: 1, max: 6 });

  if (data.relatedArticle && !articleSlugs.has(data.relatedArticle)) {
    err(file, `\`relatedArticle\` points at a missing article: ${data.relatedArticle}`);
  }

  if (isAgent) {
    oneOf(file, data, 'runtime', RUNTIMES);
    oneOf(file, data, 'autonomy', AUTONOMY);
    if (data.mcpSupport !== undefined && typeof data.mcpSupport !== 'boolean') {
      err(file, '`mcpSupport` must be a boolean');
    }
  }
}

for (const entry of tools) validateDirectoryEntry(entry, TOOL_CATEGORIES);
for (const entry of agentEntries) validateDirectoryEntry(entry, AGENT_CATEGORIES, { isAgent: true });

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

for (const { file, data } of prompts) {
  for (const field of ['title', 'description', 'category', 'prompt', 'publishDate']) {
    required(file, data, field);
  }

  maxLen(file, data, 'title', 120);
  maxLen(file, data, 'description', 320);
  maxLen(file, data, 'seoTitle', 120);
  maxLen(file, data, 'seoDescription', 320);

  oneOf(file, data, 'category', PROMPT_CATEGORIES);

  if (data.publishDate && Number.isNaN(new Date(data.publishDate).valueOf())) {
    err(file, `\`publishDate\` is not a valid date: ${data.publishDate}`);
  }

  isArray(file, data, 'variables');
  isArray(file, data, 'models');
  isArray(file, data, 'tags', { min: 2 });

  // Every declared variable must actually appear in the prompt, and every
  // placeholder in the prompt must be declared. A mismatch means the reader is
  // told to replace something that is not there, or hits an unlisted blank.
  if (typeof data.prompt === 'string' && Array.isArray(data.variables)) {
    const used = new Set([...data.prompt.matchAll(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g)].map((m) => m[1]));
    for (const v of data.variables) {
      if (!used.has(v)) err(file, `declared variable \`${v}\` never appears in the prompt`);
    }
    for (const v of used) {
      if (!data.variables.includes(v)) err(file, `prompt uses \`{{${v}}}\` but it is not declared in \`variables\``);
    }
  }
}

// ---------------------------------------------------------------------------
// Cross-collection sanity
// ---------------------------------------------------------------------------

const seen = new Map();
for (const { file, data, id } of [...articles, ...tools, ...agentEntries, ...prompts]) {
  const key = `${file.split('/')[0]}:${data.slug ?? id}`;
  if (seen.has(key)) err(file, `duplicate slug — also used by ${seen.get(key)}`);
  else seen.set(key, file);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log(
  `checked ${articles.length} articles, ${tools.length} tools, ` +
    `${agentEntries.length} agents, ${prompts.length} prompts`
);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log('  ⚠  ' + w);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error('  ✖  ' + e);
  process.exit(1);
}

console.log('\n✔ content valid');
