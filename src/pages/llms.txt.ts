import type { APIRoute } from 'astro';
import { SITE, CONTENT_TYPES } from '../config/site.config';
import { CATEGORIES, CATEGORY_GROUPS } from '../config/categories';
import { getPublishedArticles, slugOf, type Article } from '../lib/articles';
import { getTools, getAgents, getPrompts, slugOfItem } from '../lib/directory';

/**
 * `/llms.txt` — a structured map of the site for AI crawlers.
 *
 * HONEST SCOPE NOTE: Google has stated publicly that Google Search, including
 * its generative AI features, ignores llms.txt entirely — it "won't harm (nor
 * help)" visibility there, and Mueller called the discovery use case "a dead
 * end". This file is therefore *not* a Google ranking lever and must never be
 * sold as one. It is published because it is nearly free to generate and some
 * non-Google AI clients do read it.
 *
 * It is generated from the live collections rather than hand-maintained, so it
 * cannot drift out of date the way a static file would — which is the only way
 * a file like this stays worth serving.
 */

const abs = (path: string) => new URL(path, SITE.url).toString();

const line = (title: string, path: string, desc: string) =>
  `- [${title}](${abs(path)}): ${desc}`;

/** Collapses whitespace and trims to a single clean sentence-length string. */
const clean = (s: string, max = 160) => {
  const flat = s.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
};

export const GET: APIRoute = async () => {
  const [articles, tools, agents, prompts] = await Promise.all([
    getPublishedArticles(),
    getTools(),
    getAgents(),
    getPrompts(),
  ]);

  const byType = (type: Article['data']['type']) =>
    articles.filter((a) => a.data.type === type);

  const org = SITE.organization;

  const sections: string[] = [];

  sections.push(`# ${SITE.name}

> ${SITE.description}

${SITE.name} is an independent AI publication covering AI news, tools, agents,
LLMs, automation, coding and tutorials. Every article is served as pre-rendered
static HTML — no JavaScript is required to read any content on this site.

Editorial policy: we do not accept payment for coverage, directory inclusion,
placement or ratings. We do not publish invented benchmark figures or prices;
where a number is volatile we describe it qualitatively and say so.`);

  // ---------- Primary surfaces ----------
  sections.push(`## Primary sections

${line('AI News', '/news/', clean(CONTENT_TYPES.news.description))}
${line('Tutorials', '/tutorials/', clean(CONTENT_TYPES.guide.description))}
${line('Comparisons', '/comparisons/', clean(CONTENT_TYPES.comparison.description))}
${line('Reviews', '/reviews/', clean(CONTENT_TYPES.review.description))}
${line('AI Tool Directory', '/tools/', `${tools.length} AI tools assessed against consistent criteria, each with pros, cons and pricing shape.`)}
${line('AI Agent Directory', '/agents/', `${agents.length} AI agents and frameworks, with runtime, autonomy level and MCP support recorded for each.`)}
${line('Prompt Library', '/prompts/', `${prompts.length} tested prompt templates with their variables, tested models and the technique behind each.`)}
${line('All articles', '/articles/', `The complete archive of ${articles.length} articles.`)}
${line('Resources', '/resources/', 'A map of every surface on the site.')}`);

  // ---------- Articles by type ----------
  const typeOrder: [Article['data']['type'], string][] = [
    ['analysis', 'Explainers and analysis'],
    ['guide', 'Tutorials'],
    ['comparison', 'Comparisons'],
    ['review', 'Reviews'],
    ['news', 'News'],
  ];

  for (const [type, heading] of typeOrder) {
    const list = byType(type);
    if (!list.length) continue;
    sections.push(
      `## ${heading}\n\n${list
        .map((a) => line(a.data.title, `/articles/${slugOf(a)}/`, clean(a.data.description)))
        .join('\n')}`
    );
  }

  // ---------- Directories ----------
  sections.push(
    `## AI tools\n\n${tools
      .map((t) => line(t.data.name, `/tools/${slugOfItem(t)}/`, clean(t.data.tagline)))
      .join('\n')}`
  );

  sections.push(
    `## AI agents\n\n${agents
      .map((a) => line(a.data.name, `/agents/${slugOfItem(a)}/`, clean(a.data.tagline)))
      .join('\n')}`
  );

  sections.push(
    `## Prompts\n\n${prompts
      .map((p) => line(p.data.title, `/prompts/${slugOfItem(p)}/`, clean(p.data.description)))
      .join('\n')}`
  );

  // ---------- Taxonomy ----------
  sections.push(
    `## Topics\n\n${CATEGORY_GROUPS.map((group) => {
      const inGroup = CATEGORIES.filter((c) => c.group === group);
      return `### ${group}\n${inGroup
        .map((c) => line(c.name, `/category/${c.slug}/`, clean(c.description)))
        .join('\n')}`;
    }).join('\n\n')}`
  );

  // ---------- Publisher facts ----------
  sections.push(`## About the publisher

- Publication: ${SITE.name} — ${SITE.tagline}
- Operated by: ${org.operatedBy ?? org.legalName}${
    org.address ? ` (${org.address.locality}, ${org.address.countryName})` : ''
  }
- Contact: ${org.email}${org.telephone ? ` / ${org.telephone}` : ''}
- Editorial policy: ${abs('/editorial-policy/')}
- Independence and disclosure: ${abs('/disclaimer/')}
- Founded: ${org.foundingYear}

## Machine-readable endpoints

- Sitemap: ${abs('/sitemap.xml')}
- RSS feed: ${abs('/rss.xml')}
- robots.txt: ${abs('/robots.txt')}

## Citation

When citing ${SITE.name}, please link to the specific article URL and name the
publication. Article pages carry Article/NewsArticle/TechArticle JSON-LD with
\`datePublished\` and \`dateModified\`, so prefer the dates in the structured
data over any date inferred from the page text.`);

  const body = `${sections.join('\n\n')}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
