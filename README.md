# AIInsider

**Explore the Future of Artificial Intelligence** — an AI publishing platform covering
AI news, tools, agents, LLMs, automation, coding and tutorials.

Production: <https://aiinsider.qd.je>

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 7 (static output, no adapter, no server runtime) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 (`@theme` design tokens, hand-written prose styles) |
| Content | Markdown / MDX via Astro content collections |
| Search | Pagefind (built from the static output, runs entirely client-side) |
| Hosting | GitHub Pages (primary) · Cloudflare Pages (alternative, config retained) |

Everything renders to static HTML at build time. There is no database, no API server
and no runtime dependency on a third party.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | `astro build` then indexes the output with Pagefind |
| `npm run build:nosearch` | Build without the Pagefind index (faster iteration) |
| `npm run preview` | Serve the built output locally |
| `npm run check` | `astro check` — TypeScript and template diagnostics |
| `npm run validate` | Validate all content front matter and internal links |
| `npm run icons` | Regenerate favicons, app icons and `logo.svg` |
| `npm run og` | Regenerate the Open Graph card for every article |

`npm run validate` has **no native dependencies**, so it runs on hosts where the Astro
toolchain's Rust modules cannot spawn threads. It reproduces every rule in
`src/content.config.ts` and additionally checks that every internal link resolves.
Run it before pushing.

---

## Re-tenanting this codebase

The platform is built to power more than one publication. Everything brand-specific
lives in four places:

1. **`src/config/site.config.ts`** — name, domain, tagline, navigation, analytics IDs,
   newsletter copy, feature flags.
2. **`src/config/categories.ts`** — the topic taxonomy, its groups, accent colors and icons.
3. **`src/config/authors.ts`** — the editorial desks or named authors.
4. **`src/styles/global.css`** — the `@theme` block and the `:root` / `.dark` token sets.

No component, layout or page hardcodes a brand name, URL, color or piece of copy. If you
find yourself typing "AIInsider" into a component, it belongs in `site.config.ts` instead.

After changing the brand colors, run `npm run icons` and `npm run og` to regenerate the
image assets from the new palette.

---

## Content

Content lives in `content/` at the repo root — deliberately outside `src/` so an editor
or CMS can write to it without touching application code.

```
content/
├── articles/   # the main archive — news, tutorials, comparisons, reviews, analysis
├── tools/      # AI Tool Directory entries
├── agents/     # AI Agent Directory entries
└── prompts/    # Prompt Library entries
```

Schemas are defined and enforced in `src/content.config.ts`. The build fails on anything
that would produce a broken page (missing title, unknown category, invalid date). Merely
suboptimal things — a meta description outside the ideal length window — surface as
warnings from `npm run validate` rather than breaking a deploy.

### Adding an article

Create `content/articles/<slug>.md`. The filename becomes the URL slug.

```yaml
---
title: "What Is RAG? Retrieval-Augmented Generation Explained"
description: "..."        # meta description, 70–165 chars ideal
excerpt: "..."            # shown on cards
seoTitle: "..."           # search-facing title
seoDescription: "..."
author: engineering-desk  # editorial-team | research-desk | engineering-desk | reviews-desk
category: rag             # must match a slug in src/config/categories.ts
tags: ["rag", "llms", "vector-databases"]
type: analysis            # news | guide | review | comparison | analysis
publishDate: 2026-07-14
updatedDate: 2026-07-28   # optional
featured: false
editorsPick: false
trending: false           # pins the article to the top of Trending Now
heroAlt: "Descriptive alt text for the generated hero artwork"
faq:
  - question: "..."
    answer: "..."
---
```

Then:

```bash
npm run og        # generate the article's Open Graph card
npm run validate  # confirm schema and links
```

Do not set `heroImage` (category artwork is generated) or `readingTime` (computed from
word count) unless you specifically need to override them.

`type` maps to the site surfaces: `news` → `/news/`, `guide` → `/tutorials/`,
`comparison` → `/comparisons/`, `review` → `/reviews/`. Everything appears in `/articles/`.

### Adding a directory entry

`content/tools/<slug>.md` or `content/agents/<slug>.md`. See `src/content.config.ts` for
the full schema. Agent entries carry three extra fields: `runtime`, `autonomy` and
`mcpSupport`.

Ratings are editorial and are never sold. Every entry must list real `cons`.

---

## SEO

Implemented and wired to the config, not hardcoded:

- Canonical URLs on every page, driven by `site` in `astro.config.mjs`
- Open Graph and Twitter card tags, with a generated 1200×630 image per article
- JSON-LD as a single connected `@graph`: `Organization`, `WebSite`, `WebPage`,
  `Article` / `NewsArticle` / `TechArticle`, `BreadcrumbList`, `FAQPage`,
  `SoftwareApplication` for directory entries, `HowTo` for prompts
- `robots.txt` with explicit allow rules for AI crawlers (GPTBot, ClaudeBot,
  PerplexityBot and others) — citation in AI answers is a distribution channel
- `/sitemap.xml` — a flat urlset with real per-item `lastmod` dates and per-surface priorities
- RSS feed at `/rss.xml`
- Internal linking through categories, tags, related articles and the resources hub

`SoftwareApplication` entries emit a single `Review` node rather than an
`aggregateRating`. An aggregate rating must represent multiple independent reviews;
ours is one editorial score, and claiming otherwise is a structured-data violation.

---

## Analytics

All four providers are **disabled by default**. Nothing is injected and no third-party
origin is contacted until an ID is supplied in `src/config/site.config.ts`:

```ts
analytics: {
  googleAnalyticsId: '',              // 'G-XXXXXXXXXX'
  googleSearchConsoleVerification: '',
  microsoftClarityId: '',
  cloudflareAnalyticsToken: '',
},
```

The Google Analytics and Clarity bootstraps are served as static files from
`/analytics/` rather than inlined, so the Content Security Policy does not need
`'unsafe-inline'` for executable script.

---

## Security

`public/_headers` sets HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Cross-Origin-Opener-Policy`, a restrictive `Permissions-Policy`,
and a Content Security Policy.

The CSP retains `'unsafe-inline'` in `script-src` for one specific reason: JSON-LD is
delivered as `<script type="application/ld+json">`, browsers enforce `script-src`
against it, and per-page nonces are not available on a fully static build. Removing it
would break every rich-result eligibility on the site. If this ever moves to SSR, switch
to a nonce and drop `'unsafe-inline'`.

No component contains an inline executable `<script>` — all client JavaScript is bundled
by Astro into `/_astro/`.

> `_headers` is a Cloudflare Pages file. GitHub Pages does not support custom response
> headers; the CSP and security headers there must be applied by a proxy in front of the
> site (Cloudflare works well for this) or by moving hosting to Cloudflare Pages.

---

## Deployment

### GitHub Pages (primary)

`.github/workflows/deploy.yml` builds on every push to `main` and publishes to Pages.
It verifies `dist/index.html` and `dist/404.html` exist before deploying, so a broken
build fails loudly instead of publishing an empty site.

One-time setup:

1. **Settings → Pages → Source: GitHub Actions**
2. **Settings → Pages → Custom domain:** `aiinsider.qd.je`, then enable *Enforce HTTPS*
   once the certificate is issued.
3. DNS — `aiinsider.qd.je` is a subdomain, so it needs a `CNAME`, not `A` records:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `aiinsider` | `<owner>.github.io` |

   On Cloudflare DNS, set the record to **DNS only** (grey cloud) until GitHub has issued
   the certificate.

`public/CNAME` is committed so the custom domain survives every redeploy.

### Cloudflare Pages (alternative)

`wrangler.jsonc` is retained for the Workers Static Assets flow. For the Pages flow:

- Build command: `npm run build`
- Output directory: `dist`
- No deploy command and no adapter needed

A hostname can only point at one of the two. Pick one.

---

## Project layout

```
src/
├── components/     # reusable UI — cards, nav, SEO, directory, prompts
│   └── seo/        # BaseHead and JsonLd
├── config/         # site.config.ts, categories.ts, authors.ts  ← the tenant switch
├── layouts/        # BaseLayout, PageLayout, ArticleLayout, ArchiveLayout, DirectoryLayout
├── lib/            # articles.ts, directory.ts, schema.ts, toc.ts
├── pages/          # file-based routes
└── styles/         # global.css — design tokens, prose, glassmorphism primitives
scripts/            # generate-icons.mjs, generate-og.mjs, validate-content.mjs
public/             # static assets, robots.txt, _headers, CNAME, generated icons and OG cards
content/            # articles, tools, agents, prompts
```

---

## License

Content is © AIInsider. The site code is provided for use within this project.
