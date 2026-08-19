// @ts-check
import { defineConfig } from 'astro/config';
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
  site: 'https://aiinsider.dpdns.org',
  output: 'static',

  build: {
    // Emit `/articles/slug/index.html` so URLs stay clean and stable.
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  // The sitemap is hand-built at src/pages/sitemap.xml.ts rather than generated
  // by @astrojs/sitemap: one clean /sitemap.xml URL, real per-item lastmod
  // dates instead of a build timestamp, and noindex paginated pages excluded.
  integrations: [mdx()],

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
