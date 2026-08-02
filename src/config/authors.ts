/**
 * Editorial bylines.
 *
 * These are *editorial desks* (organisational authorship) rather than invented
 * individual journalists. That is deliberate: fabricated author personas with
 * invented credentials are exactly what search quality raters and readers
 * penalise, and Schema.org supports Organization as a valid `author`.
 *
 * BEFORE LAUNCH: replace these with the real people writing the articles.
 * Named human authors with verifiable credentials materially improve E-E-A-T.
 * The `type` field switches the JSON-LD between Person and Organization.
 */

export interface Author {
  slug: string;
  name: string;
  type: 'Person' | 'Organization';
  /** One-line role shown under the byline. */
  role: string;
  bio: string;
  /** Two-letter monogram rendered in the avatar when no image is supplied. */
  initials: string;
  accent: string;
  avatar?: string;
  url?: string;
  social?: { twitter?: string; linkedin?: string; github?: string };
}

export const AUTHORS: Author[] = [
  {
    slug: 'editorial-team',
    name: 'AIInsider Editorial',
    type: 'Organization',
    role: 'Editorial Desk',
    initials: 'AI',
    accent: '#6366F1',
    bio: 'The AIInsider editorial desk covers the AI industry end to end — model releases, product launches and the analysis that separates a genuine capability shift from a press cycle. Every article is checked against our editorial policy before publication.',
  },
  {
    slug: 'research-desk',
    name: 'AIInsider Research',
    type: 'Organization',
    role: 'Model & Research Desk',
    initials: 'RD',
    accent: '#8B5CF6',
    bio: 'The research desk tracks the frontier labs and the open-weight ecosystem — architectures, training methods, benchmark claims and what the papers actually support.',
  },
  {
    slug: 'engineering-desk',
    name: 'AIInsider Engineering',
    type: 'Organization',
    role: 'Applied Engineering Desk',
    initials: 'ED',
    accent: '#0EA5E9',
    bio: 'The engineering desk builds with these tools daily — agents, RAG pipelines, MCP servers and AI coding assistants — and writes up what survives contact with a production codebase.',
  },
  {
    slug: 'reviews-desk',
    name: 'AIInsider Reviews',
    type: 'Organization',
    role: 'Tools & Reviews Desk',
    initials: 'RV',
    accent: '#10B981',
    bio: 'The reviews desk evaluates AI tools hands-on against consistent criteria, publishes the limitations alongside the strengths, and takes no payment for coverage.',
  },
];

const AUTHOR_MAP = new Map(AUTHORS.map((a) => [a.slug, a]));

export function getAuthor(slug: string): Author | undefined {
  return AUTHOR_MAP.get(slug);
}

/** Never throws during build — unknown slugs fall back to the editorial desk. */
export function getAuthorOrFallback(slug: string): Author {
  return AUTHOR_MAP.get(slug) ?? AUTHORS[0];
}

export const AUTHOR_SLUGS = AUTHORS.map((a) => a.slug);
