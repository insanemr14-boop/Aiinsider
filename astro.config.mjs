// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

/**
 * Astro configuration.
 *
 * Output is fully static so the host — GitHub Pages or Cloudflare Pages —
 * serves pre-rendered HTML with no adapter and no server runtime. `site`
 * drives canonical URLs, the sitemap and RSS, so it must match the production
 * domain exactly. Changing it without changing `SITE.url` in
 * `src/config/site.config.ts` would emit mismatched canonicals.
 */
export default defineConfig({
  site: 'https://aiinsider.qd.je',
  output: 'static',

  build: {
    // Emit `/articles/slug/index.html` so URLs stay clean and stable.
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        // Search results and API stubs carry no index value.
        !page.includes('/search') && !page.includes('/api/'),
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        // Home page.
        if (/\/\/[^/]+\/$/.test(item.url)) {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        // Top-level hubs — the pages that should be recrawled most often.
        if (
          /\/(news|tutorials|comparisons|reviews|articles|categories|tools|agents|prompts|resources)\/$/.test(
            item.url
          )
        ) {
          return { ...item, priority: 0.9, changefreq: 'daily' };
        }
        if (item.url.includes('/articles/')) return { ...item, priority: 0.8 };
        // Directory detail pages carry real standalone search intent.
        if (item.url.includes('/tools/') || item.url.includes('/agents/')) {
          return { ...item, priority: 0.75, changefreq: 'weekly' };
        }
        if (item.url.includes('/prompts/')) return { ...item, priority: 0.7 };
        if (item.url.includes('/category/')) return { ...item, priority: 0.7 };
        if (item.url.includes('/tag/')) return { ...item, priority: 0.4 };
        return { ...item, priority: 0.5 };
      },
    }),
  ],

  markdown: {
    shikiConfig: {
      // Dual themes let code blocks follow the site's light/dark switch
      // without shipping a second stylesheet.
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    build: { cssCodeSplit: true },
  },
});
