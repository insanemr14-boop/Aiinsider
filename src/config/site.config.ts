/**
 * ============================================================================
 * SITE CONFIGURATION — the single tenant switch for this codebase.
 * ============================================================================
 *
 * This platform is designed to power multiple publications from one codebase.
 * Everything brand-specific lives in this file plus `categories.ts` and
 * `authors.ts`.
 *
 * To spin up a new publication:
 *   1. Change the values in this file.
 *   2. Replace `src/config/categories.ts` with the new vertical's taxonomy.
 *   3. Replace `src/config/authors.ts` with the new editorial desks.
 *   4. Swap the brand colours in `src/styles/global.css` (@theme block).
 *   5. Point `content/` at the new content.
 *
 * No component, layout or page should ever hardcode a brand name, URL, colour
 * or piece of copy. If you find yourself doing that, add it here.
 */

export interface SiteConfig {
  name: string;
  shortName: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  locale: string;
  language: string;
  themeColor: string;
  /** Brand mark rendered in the navbar: split into two tones. */
  logo: { primary: string; accent: string };
  /** Organisation-level details used for Organization JSON-LD. */
  organization: {
    legalName: string;
    foundingYear: number;
    email: string;
    logoPath: string;
    /** The company that operates this publication, if different from the brand. */
    operatedBy?: string;
    telephone?: string;
    /** Postal address. Fields left undefined are simply omitted from the JSON-LD. */
    address?: {
      street?: string;
      locality: string;
      region?: string;
      postalCode?: string;
      /** ISO 3166-1 alpha-2. */
      country: string;
      countryName: string;
    };
    /** Freeform opening hours shown on the contact page. */
    hours?: string;
    /** Stated first-response target, shown on the contact page. */
    responseTime?: string;
  };
  social: {
    twitter?: string;
    twitterHandle?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    /** Full wa.me link, including country code. */
    whatsapp?: string;
    mastodon?: string;
    rss: string;
  };
  /**
   * Analytics placeholders. Leave empty to disable — nothing is injected and
   * no third-party origin is contacted until an ID is supplied.
   */
  analytics: {
    googleAnalyticsId: string;
    googleSearchConsoleVerification: string;
    microsoftClarityId: string;
    /** Cloudflare Web Analytics beacon token. */
    cloudflareAnalyticsToken: string;
  };
  /** Newsletter provider endpoint. Wired to `/api/newsletter` placeholder. */
  newsletter: {
    enabled: boolean;
    endpoint: string;
    heading: string;
    body: string;
    buttonLabel: string;
  };
  /** Pagination sizes per surface. */
  pagination: {
    articlesPerPage: number;
    categoryPerPage: number;
    relatedCount: number;
  };
  features: {
    search: boolean;
    comments: boolean;
    newsletter: boolean;
    themeSwitcher: boolean;
    readingProgress: boolean;
    toolDirectory: boolean;
    agentDirectory: boolean;
    promptLibrary: boolean;
  };
}

export const SITE: SiteConfig = {
  name: 'AIInsider',
  shortName: 'AIInsider',
  domain: 'aiinsider.qd.je',
  url: 'https://aiinsider.qd.je',
  tagline: 'Explore the Future of Artificial Intelligence',
  description:
    'AIInsider covers AI news, AI tools, AI agents, LLMs, automation and coding — independent analysis, hands-on tutorials and honest reviews for people who build with AI.',
  locale: 'en_US',
  language: 'en',
  themeColor: '#6366F1',

  logo: { primary: 'AI', accent: 'Insider' },

  organization: {
    legalName: 'AIInsider',
    foundingYear: 2026,
    email: 'info@riocloudsolutions.com',
    logoPath: '/logo.svg',
    operatedBy: 'RioCloud Solutions',
    telephone: '+91 75085 83782',
    address: {
      locality: 'Chandigarh',
      country: 'IN',
      countryName: 'India',
    },
    hours: 'Monday to Saturday, 9:00–19:00 IST',
    responseTime: '2–4 hours during business hours (IST)',
  },

  social: {
    github: 'https://github.com/insanemr14-boop/Aiinsider',
    linkedin: 'https://www.linkedin.com/company/rio-cloud-solutions',
    instagram: 'https://www.instagram.com/riocloud.in',
    whatsapp: 'https://wa.me/917508583782',
    rss: '/rss.xml',
  },

  // Populate these to activate the corresponding provider. Empty = disabled.
  // GA4 looks like 'G-XXXXXXXXXX'; Clarity is a 10-character project id.
  analytics: {
    googleAnalyticsId: 'G-ZD3JQTV84J',
    googleSearchConsoleVerification: 'REfhXaG6pnK53a3U7-XFJfPqEamF7fDx1AY0_a7zviM',
    microsoftClarityId: '',
    cloudflareAnalyticsToken: '',
  },

  newsletter: {
    enabled: true,
    endpoint: '/api/newsletter',
    heading: 'The AIInsider Briefing',
    body: 'The AI signal without the hype — new models, tools worth your time and what actually shipped. One email, no vendor pitches.',
    buttonLabel: 'Subscribe',
  },

  pagination: {
    articlesPerPage: 12,
    categoryPerPage: 12,
    relatedCount: 3,
  },

  features: {
    search: true,
    comments: true,
    newsletter: true,
    themeSwitcher: true,
    readingProgress: true,
    toolDirectory: true,
    agentDirectory: true,
    promptLibrary: true,
  },
};

/**
 * Primary navigation. Rendered in the navbar and the mobile drawer.
 *
 * The navbar shows the first `NAV_PRIMARY_COUNT` entries inline on desktop and
 * folds the remainder into a "More" menu, so adding a link here never breaks
 * the header layout. The mobile drawer always shows every entry.
 */
export const MAIN_NAV = [
  { label: 'News', href: '/news/' },
  { label: 'AI Tools', href: '/tools/' },
  { label: 'AI Agents', href: '/agents/' },
  { label: 'Tutorials', href: '/tutorials/' },
  { label: 'Prompt Library', href: '/prompts/' },
  { label: 'Comparisons', href: '/comparisons/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Resources', href: '/resources/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

/** How many nav entries render inline before the "More" menu takes over. */
export const NAV_PRIMARY_COUNT = 6;

/** Footer link groups. */
export const FOOTER_NAV = [
  {
    heading: 'Content',
    links: [
      { label: 'AI News', href: '/news/' },
      { label: 'Tutorials', href: '/tutorials/' },
      { label: 'Comparisons', href: '/comparisons/' },
      { label: 'Reviews', href: '/reviews/' },
      { label: 'All Articles', href: '/articles/' },
      { label: 'Categories', href: '/categories/' },
    ],
  },
  {
    heading: 'Directories',
    links: [
      { label: 'AI Tool Directory', href: '/tools/' },
      { label: 'AI Agent Directory', href: '/agents/' },
      { label: 'Prompt Library', href: '/prompts/' },
      { label: 'Resources', href: '/resources/' },
      { label: 'Trending Topics', href: '/tags/' },
    ],
  },
  {
    heading: 'Publication',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Editorial Desks', href: '/authors/' },
      { label: 'Editorial Policy', href: '/editorial-policy/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'RSS Feed', href: '/rss.xml' },
      { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Terms & Conditions', href: '/terms/' },
      { label: 'Cookie Policy', href: '/cookie-policy/' },
      { label: 'Disclaimer', href: '/disclaimer/' },
    ],
  },
] as const;

/**
 * Minimum articles an archive needs before it is worth indexing.
 *
 * Archives below the threshold are served `noindex, follow` and kept out of the
 * sitemap. They stay fully browsable and still pass link equity through to the
 * articles — they simply do not compete as landing pages while they are thin.
 *
 * The problem being solved: 35 category + 70 tag pages against 20 articles is a
 * ~5.5:1 ratio of listing pages to real content, and most of those archives wrap
 * a single post (18 categories and 47 tags hold exactly one). Indexing roughly a
 * hundred near-empty listings alongside 20 genuine articles dilutes the site's
 * content-to-noise ratio, which is precisely the pattern the helpful-content
 * system penalises.
 *
 * Raise these as the archive grows — an archive earns indexing when it reads as
 * a genuine topic hub rather than a wrapper around one post.
 *
 * Why `category: 2` and not 3: at a threshold of 3, *zero* categories qualify
 * today (the largest holds 2 articles), which would leave the entire category
 * tree noindexed and absent from the sitemap. A taxonomy with no indexable
 * members is its own bad signal. Two articles is a defensible floor — it is the
 * point where a page stops being a wrapper around one post — and categories
 * promote themselves automatically as coverage deepens.
 *
 * The underlying issue is that 35 categories is a wide taxonomy for 20 articles.
 * The durable fix is more articles per topic, not a lower threshold; revisit
 * this once the archive passes roughly 60 articles.
 */
export const INDEX_THRESHOLDS = {
  category: 2,
  tag: 4,
  author: 1,
} as const;

/**
 * Content types drive the /news, /tutorials, /reviews and /comparisons
 * surfaces. Every article declares one in its front matter.
 */
export const CONTENT_TYPES = {
  news: {
    label: 'News',
    plural: 'AI News',
    href: '/news/',
    description:
      'Model launches, funding, research releases and policy moves — what happened in AI and why it matters.',
  },
  guide: {
    label: 'Tutorial',
    plural: 'Tutorials',
    href: '/tutorials/',
    description:
      'Step-by-step, hands-on tutorials for building with LLMs, agents, APIs and AI coding tools.',
  },
  review: {
    label: 'Review',
    plural: 'Reviews',
    href: '/reviews/',
    description:
      'Independent, hands-on reviews of AI tools and platforms — what they are genuinely good at, and where they fall down.',
  },
  comparison: {
    label: 'Comparison',
    plural: 'Comparisons',
    href: '/comparisons/',
    description:
      'Head-to-head comparisons of AI models, coding assistants and platforms, decided on evidence rather than marketing.',
  },
  analysis: {
    label: 'Analysis',
    plural: 'Analysis',
    href: '/articles/',
    description:
      'Deep explainers and technical analysis of how AI systems actually work.',
  },
} as const;

export type ContentType = keyof typeof CONTENT_TYPES;
