/**
 * Generates the 1200x630 Open Graph card for every article, plus the site
 * default card.
 *
 * TEXT-FREE BY DESIGN
 * resvg (the renderer behind sharp's SVG support) resolves fonts from the host
 * system. There is no guarantee the rendering machine has a font with Latin
 * glyphs — when it does not, every character rasterises as a tofu box, which
 * looks far worse than no text at all. So the card carries brand and category
 * identity through colour and vector artwork only. The article title reaches
 * social platforms through the `og:title` meta tag, which X, LinkedIn, Slack,
 * Discord and Facebook all render alongside the image.
 *
 * WHY THIS IS A COMMITTED ARTEFACT, NOT A BUILD STEP
 * Running it during `astro build` would make the output depend on whatever the
 * CI container happens to have installed. Instead: run it locally, eyeball the
 * result, commit the PNGs. The deploy build then just serves static files.
 *
 * Run after adding an article:  npm run og
 */
import sharp from 'sharp';
import { readdir, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ARTICLES = fileURLToPath(new URL('../content/articles/', import.meta.url));
const OUT = fileURLToPath(new URL('../public/og/', import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;

const BRAND = '#6366F1';

// Mirrors src/config/categories.ts. Kept as literals rather than imported
// because this script runs outside the Astro/TypeScript pipeline.
const ACCENTS = {
  'artificial-intelligence': '#6366F1', 'ai-news': '#8B5CF6', llms: '#7C3AED',
  'machine-learning': '#4F46E5', 'generative-ai': '#A855F7',
  'prompt-engineering': '#D946EF', 'ai-ethics': '#64748B',
  openai: '#10B981', anthropic: '#D97706', chatgpt: '#059669', claude: '#EA580C',
  gemini: '#3B82F6', 'google-ai': '#2563EB', perplexity: '#0EA5E9',
  'meta-ai': '#1D4ED8', mistral: '#F97316', deepseek: '#0891B2',
  'open-source-llms': '#16A34A',
  'ai-agents': '#8B5CF6', mcp: '#7C3AED', 'ai-coding': '#0EA5E9', cursor: '#0284C7',
  'github-copilot': '#475569', windsurf: '#14B8A6', 'claude-code': '#D97706',
  rag: '#F59E0B', 'vector-databases': '#CA8A04', 'ai-apis': '#22D3EE',
  automation: '#10B981', 'no-code-ai': '#22C55E', 'ai-security': '#EF4444',
  'image-generation': '#EC4899', 'video-generation': '#F43F5E',
  'voice-ai': '#A855F7', robotics: '#64748B',
};

const ICONS = {
  'artificial-intelligence': 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',
  'ai-news': 'M4 5h13v14H4zM17 9h3v8a2 2 0 0 1-3 2M7 8h7M7 12h7M7 16h4',
  llms: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8V20M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8V20M12 4v16',
  'machine-learning': 'M4 19V5m0 14h16M8 15l4-5 3 3 5-7',
  'generative-ai': 'M12 3a9 9 0 1 0 0 18c1.7 0 2-1 2-2s-.8-2 .5-2H17a4 4 0 0 0 4-4c0-5-4-8-9-8Z',
  'prompt-engineering': 'm4 20 1-5L16 4l4 4L9 19l-5 1Zm11-15 4 4',
  'ai-ethics': 'M12 4v16M6 8h12M6 8l-3 6h6zM18 8l-3 6h6zM8 20h8',
  openai: 'M12 12a1 1 0 1 0 .01 0M12 3c4.5 0 8 4 8 9s-3.5 9-8 9-8-4-8-9 3.5-9 8-9ZM4.2 7.5c2.2-3.9 7.3-5.3 11.3-3s5.6 7.4 3.4 11.3M19.8 7.5c-2.2-3.9-7.3-5.3-11.3-3s-5.6 7.4-3.4 11.3',
  anthropic: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5 5-2Z',
  chatgpt: 'M4 5h16v11H9l-5 4V5Z',
  claude: 'M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm4 0h8M12 8v8',
  gemini: 'm12 3 8 6-8 12L4 9l8-6Zm0 0-4 6h8l-4-6Zm-8 6h16',
  'google-ai': 'M12 12a1 1 0 1 0 .01 0M12 3c4.5 0 8 4 8 9s-3.5 9-8 9-8-4-8-9 3.5-9 8-9ZM4.2 7.5c2.2-3.9 7.3-5.3 11.3-3s5.6 7.4 3.4 11.3',
  perplexity: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 5 5',
  'meta-ai': 'M7 9a3 3 0 1 0 0 6c2.5 0 3-3 5-3s2.5 3 5 3a3 3 0 1 0 0-6c-2.5 0-3 3-5 3s-2.5-3-5-3Z',
  mistral: 'M3 8h10a3 3 0 1 0-3-3M3 12h14a3 3 0 1 1-3 3M3 16h8a2.5 2.5 0 1 1-2.5 2.5',
  deepseek: 'M3 12c3 0 4-4 8-4s5 4 9 4c-1 5-5 7-9 7s-7-2-8-7Z',
  'open-source-llms': 'M4 8h16M4 12h16M4 16h16M7 4v16',
  'ai-agents': 'M8 4h8v3H8zM5 7h14v11H5zM9 12h.01M15 12h.01M9 16h6M3 11h2m14 0h2',
  mcp: 'M9 3v6m6-6v6M6 9h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V9Zm6 15v-3',
  'ai-coding': 'm8 6-6 6 6 6M16 6l6 6-6 6',
  cursor: 'm5 3 14 7-6 2-2 6-6-15Z',
  'github-copilot': 'M4 11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Zm5 2v2m6-2v2M9 4a3 3 0 0 1 6 0',
  windsurf: 'M3 17c3 0 3-2 6-2s3 2 6 2 3-2 6-2M4 13c2-6 7-9 15-9-1 5-4 9-9 10',
  'claude-code': 'm4 5 6 7-6 7M13 19h7',
  rag: 'M4 8h16M4 12h16M4 16h16M7 4v16',
  'vector-databases': 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6m16 6c0 1.7-3.6 3-8 3s-8-1.3-8-3',
  'ai-apis': 'M7 8H5a3 3 0 0 0 0 6h2m10-6h2a3 3 0 0 1 0 6h-2M9 11h6',
  automation: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-6v3m0 12v3M5.6 5.6l2.2 2.2m8.4 8.4 2.2 2.2M3 12h3m12 0h3M5.6 18.4l2.2-2.2m8.4-8.4 2.2-2.2',
  'no-code-ai': 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  'ai-security': 'M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z',
  'image-generation': 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M8.5 9a1 1 0 1 0 .01 0',
  'video-generation': 'M3 5h18v14H3zM7 5v14m10-14v14M3 9h4m10 0h4M3 15h4m10 0h4',
  'voice-ai': 'M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3ZM6 12a6 6 0 0 0 12 0M12 18v3',
  robotics: 'M7 8h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Zm2 4h.01M15 12h.01M12 4v4M9 20l-2 2m10-2 2 2',
};

/** The brand glyph, matching src/components/Logo.astro and generate-icons.mjs. */
const LOGO_GLYPH = `
    <g stroke="#ffffff" stroke-width="1.9" stroke-linecap="round" opacity="0.92">
      <path d="M10 9.5 16.5 16"/><path d="M10 16h6.5"/>
      <path d="M10 22.5 16.5 16"/><path d="M16.5 16H23"/>
    </g>
    <g fill="#ffffff">
      <circle cx="9.5" cy="9.5" r="2.2"/><circle cx="9.5" cy="16" r="2.2"/>
      <circle cx="9.5" cy="22.5" r="2.2"/><circle cx="23" cy="16" r="2.2"/>
    </g>
    <circle cx="16.5" cy="16" r="3.1" fill="#ffffff"/>
    <circle cx="16.5" cy="16" r="1.35" fill="url(#logoGrad)"/>`;

/** Minimal front-matter reader — avoids a YAML dependency for two fields. */
function readField(frontMatter, key) {
  const match = frontMatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) return null;
  return match[1].trim().replace(/^['"]|['"]$/g, '').replace(/''/g, "'");
}

function card(category, seed) {
  const accent = ACCENTS[category] ?? BRAND;
  const icon = ICONS[category] ?? ICONS['artificial-intelligence'];

  // Deterministic node placement so a given article always renders identically.
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

  const nodes = Array.from({ length: 12 }, (_, i) => {
    const v = (h >> (i * 2)) >>> 0;
    return { x: 40 + (v % 1120), y: 40 + ((v >> 6) % 550), r: 3 + ((v >> 3) % 4) };
  });

  const links = nodes
    .slice(0, -1)
    .map(
      (n, i) =>
        `<line x1="${n.x}" y1="${n.y}" x2="${nodes[i + 1].x}" y2="${nodes[i + 1].y}" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1.5"/>`
    )
    .join('');

  const dots = nodes
    .map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="#ffffff" fill-opacity="0.14"/>`)
    .join('');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#161a3a"/>
      <stop offset="100%" stop-color="#0b0f1f"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.74" cy="0.3" r="0.8">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.12" cy="0.85" r="0.6">
      <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="55%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#D946EF"/>
    </linearGradient>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="55%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#D946EF"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)"/>
  ${links}${dots}

  <rect x="0" y="0" width="${WIDTH}" height="10" fill="url(#bar)"/>
  <rect x="0" y="${HEIGHT - 10}" width="${WIDTH}" height="10" fill="url(#bar)" fill-opacity="0.45"/>

  <g transform="translate(700 150) scale(15)" opacity="0.92">
    <path d="${icon}" fill="none" stroke="${accent}" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g transform="translate(110 200) scale(7)">
    <rect x="0" y="0" width="32" height="32" rx="9" fill="url(#logoGrad)"/>
    ${LOGO_GLYPH}
  </g>
</svg>`);
}

await mkdir(OUT, { recursive: true });

const files = (await readdir(ARTICLES)).filter((f) => /\.mdx?$/.test(f));
let written = 0;

for (const file of files) {
  const raw = await readFile(ARTICLES + file, 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    console.warn('skip (no front matter):', file);
    continue;
  }

  const category = readField(fm[1], 'category');
  if (!category) {
    console.warn('skip (no category):', file);
    continue;
  }
  if (!ACCENTS[category]) {
    console.warn(`warn: unknown category "${category}" in ${file} — using brand default`);
  }

  const slug = readField(fm[1], 'slug') ?? file.replace(/\.mdx?$/, '');

  await sharp(card(category, slug))
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}${slug}.png`);

  written++;
  console.log('og:', `${slug}.png`);
}

await sharp(card('artificial-intelligence', 'aiinsider-default'))
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL('../public/og-default.png', import.meta.url)));

console.log(`\ndone — ${written} article cards + og-default.png`);
