import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS } from './config/categories';
import { AUTHOR_SLUGS } from './config/authors';

/**
 * Content collections.
 *
 * All content lives in `content/` at the repo root (not under `src/`) so an
 * external CMS or editorial workflow can write to it without touching
 * application code.
 *
 * Validation philosophy: fail the build on anything that would produce a
 * *broken page* (missing title, unknown category, bad date). Warn — via
 * `npm run seo:check` — on anything that is merely *suboptimal* (a meta
 * description outside the ideal 70-160 character window). A publication should
 * not lose a deploy because a description ran three characters long.
 */
const articles = defineCollection({
  loader: glob({ base: './content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1).max(120),
    slug: z.string().optional(),
    excerpt: z.string().min(1).max(320),
    description: z.string().min(1).max(320),

    seoTitle: z.string().max(120).optional(),
    seoDescription: z.string().max(320).optional(),

    author: z
      .string()
      .refine((s) => AUTHOR_SLUGS.includes(s), {
        message: `author must be one of: ${AUTHOR_SLUGS.join(', ')}`,
      })
      .default('editorial-team'),

    category: z.string().refine((s) => CATEGORY_SLUGS.includes(s), {
      message: `category must be one of: ${CATEGORY_SLUGS.join(', ')}`,
    }),

    tags: z.array(z.string()).default([]),

    type: z
      .enum(['news', 'guide', 'review', 'comparison', 'analysis'])
      .default('analysis'),

    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    featured: z.boolean().default(false),
    editorsPick: z.boolean().default(false),
    trending: z.boolean().default(false),
    draft: z.boolean().default(false),

    /** Optional raster hero. Omit to use the generated category artwork. */
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),

    /** Optional manual override; computed from word count when absent. */
    readingTime: z.number().positive().optional(),

    /** Rendered as an FAQ block and as FAQPage JSON-LD. */
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
  }),
});

/**
 * Shared shape for directory entries (tools and agents). Both render through
 * the same card and detail templates, so they must stay structurally
 * identical — only the taxonomy differs.
 */
const directoryEntry = {
  name: z.string().min(1).max(80),
  slug: z.string().optional(),
  /** One-line positioning statement used on cards and in meta descriptions. */
  tagline: z.string().min(1).max(200),
  description: z.string().min(1).max(400),

  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().max(320).optional(),

  /** Vendor or maintainer. */
  vendor: z.string().default('Independent'),
  website: z.string().url(),
  docs: z.string().url().optional(),

  pricing: z.enum(['free', 'freemium', 'paid', 'open-source', 'enterprise']),
  /** Human-readable price note, e.g. "Free tier; $20/mo Pro". */
  priceNote: z.string().max(120).optional(),

  /** Editorial score out of 5, in half-point steps. Omit for unrated entries. */
  rating: z.number().min(0).max(5).optional(),

  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  /** Short capability labels rendered as chips. */
  features: z.array(z.string()).default([]),
  bestFor: z.string().max(200).optional(),

  /** Slug of a related article, if we have published one. */
  relatedArticle: z.string().optional(),

  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  updatedDate: z.coerce.date().optional(),
};

const tools = defineCollection({
  loader: glob({ base: './content/tools', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...directoryEntry,
    /** Tool directory taxonomy — drives the filter chips on /tools. */
    category: z.enum([
      'Chat Assistants',
      'Coding',
      'Search & Research',
      'Image',
      'Video',
      'Voice & Audio',
      'Automation',
      'Data & RAG',
      'Productivity',
    ]),
  }),
});

const agents = defineCollection({
  loader: glob({ base: './content/agents', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...directoryEntry,
    /** Agent directory taxonomy — drives the filter chips on /agents. */
    category: z.enum([
      'Coding Agents',
      'Research Agents',
      'Browser Agents',
      'Agent Frameworks',
      'Workflow Agents',
      'Customer Agents',
    ]),
    /** Where the agent runs. Surfaced as a chip on the card. */
    runtime: z.enum(['cloud', 'local', 'hybrid', 'ide', 'terminal']).default('cloud'),
    /** Whether the agent speaks the Model Context Protocol. */
    mcpSupport: z.boolean().default(false),
    /** Degree of human oversight the agent is designed for. */
    autonomy: z.enum(['assisted', 'supervised', 'autonomous']).default('supervised'),
  }),
});

/**
 * Prompt library. Prompts are short and highly structured, so they are stored
 * entirely in front matter — the Markdown body is optional commentary.
 */
const prompts = defineCollection({
  loader: glob({ base: './content/prompts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1).max(120),
    slug: z.string().optional(),
    description: z.string().min(1).max(320),

    seoTitle: z.string().max(120).optional(),
    seoDescription: z.string().max(320).optional(),

    category: z.enum([
      'Writing',
      'Coding',
      'Research',
      'Marketing',
      'Data Analysis',
      'Productivity',
      'Agents',
      'Image',
    ]),

    /** The prompt text itself, rendered in a copyable block. */
    prompt: z.string().min(1),
    /** Placeholders the user is expected to replace, e.g. ['TOPIC', 'TONE']. */
    variables: z.array(z.string()).default([]),
    /** Models this prompt has been tested against. */
    models: z.array(z.string()).default([]),
    /** Optional worked example of the prompt's output. */
    exampleOutput: z.string().optional(),
    /** Why this prompt works — shown under the prompt block. */
    notes: z.string().optional(),

    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    publishDate: z.coerce.date(),
  }),
});

export const collections = { articles, tools, agents, prompts };
