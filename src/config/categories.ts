/**
 * Category taxonomy for this publication.
 *
 * `group` clusters categories on the /categories grid page.
 * `accent` is a Tailwind-compatible CSS colour used for the category chip and
 * the generated hero artwork, so every category is visually distinguishable
 * without shipping a single raster image.
 *
 * Swap this whole file when re-tenanting the platform to another vertical.
 */

export interface Category {
  slug: string;
  name: string;
  /** Shown on the category archive page and used as its meta description. */
  description: string;
  group: 'Foundations' | 'Models & Labs' | 'Building' | 'Applied AI';
  accent: string;
  /** Inline SVG path data (24x24 viewBox) for the category icon. */
  icon: string;
}

const ICONS = {
  spark: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',
  news: 'M4 5h13v14H4zM17 9h3v8a2 2 0 0 1-3 2M7 8h7M7 12h7M7 16h4',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8V20M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8V20M12 4v16',
  gem: 'm12 3 8 6-8 12L4 9l8-6Zm0 0-4 6h8l-4-6Zm-8 6h16',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5 5-2Z',
  atom: 'M12 12a1 1 0 1 0 .01 0M12 3c4.5 0 8 4 8 9s-3.5 9-8 9-8-4-8-9 3.5-9 8-9ZM4.2 7.5c2.2-3.9 7.3-5.3 11.3-3s5.6 7.4 3.4 11.3M19.8 7.5c-2.2-3.9-7.3-5.3-11.3-3s-5.6 7.4-3.4 11.3',
  compass2: 'M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm4 0h8M12 8v8',
  infinity: 'M7 9a3 3 0 1 0 0 6c2.5 0 3-3 5-3s2.5 3 5 3a3 3 0 1 0 0-6c-2.5 0-3 3-5 3s-2.5-3-5-3Z',
  wind: 'M3 8h10a3 3 0 1 0-3-3M3 12h14a3 3 0 1 1-3 3M3 16h8a2.5 2.5 0 1 1-2.5 2.5',
  whale: 'M3 12c3 0 4-4 8-4s5 4 9 4c-1 5-5 7-9 7s-7-2-8-7Zm5-1h.01',
  code: 'm8 6-6 6 6 6M16 6l6 6-6 6',
  cursor: 'm5 3 14 7-6 2-2 6-6-15Z',
  copilot: 'M4 11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Zm5 2v2m6-2v2M9 4a3 3 0 0 1 6 0',
  surf: 'M3 17c3 0 3-2 6-2s3 2 6 2 3-2 6-2M4 13c2-6 7-9 15-9-1 5-4 9-9 10',
  terminal: 'm4 5 6 7-6 7M13 19h7',
  bot: 'M8 4h8v3H8zM5 7h14v11H5zM9 12h.01M15 12h.01M9 16h6M3 11h2m14 0h2',
  plug: 'M9 3v6m6-6v6M6 9h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V9Zm6 15v-3',
  pen: 'm4 20 1-5L16 4l4 4L9 19l-5 1Zm11-15 4 4',
  palette: 'M12 3a9 9 0 1 0 0 18c1.7 0 2-1 2-2s-.8-2 .5-2H17a4 4 0 0 0 4-4c0-5-4-8-9-8Zm-4 6h.01M8 14h.01M12 7h.01M16 9h.01',
  stack: 'M4 8h16M4 12h16M4 16h16M7 4v16',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 5 5',
  database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6m16 6c0 1.7-3.6 3-8 3s-8-1.3-8-3',
  gears: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-6v3m0 12v3M5.6 5.6l2.2 2.2m8.4 8.4 2.2 2.2M3 12h3m12 0h3M5.6 18.4l2.2-2.2m8.4-8.4 2.2-2.2',
  blocks: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  api: 'M7 8H5a3 3 0 0 0 0 6h2m10-6h2a3 3 0 0 1 0 6h-2M9 11h6',
  graph: 'M4 19V5m0 14h16M8 15l4-5 3 3 5-7',
  shield: 'M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z',
  scale: 'M12 4v16M6 8h12M6 8l-3 6h6zM18 8l-3 6h6zM8 20h8',
  image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M8.5 9a1 1 0 1 0 .01 0',
  film: 'M3 5h18v14H3zM7 5v14m10-14v14M3 9h4m10 0h4M3 15h4m10 0h4',
  mic: 'M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3ZM6 12a6 6 0 0 0 12 0M12 18v3',
  robot: 'M7 8h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3Zm2 4h.01M15 12h.01M12 4v4M9 20l-2 2m10-2 2 2',
  cpu: 'M7 7h10v10H7zM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3',
} as const;

export const CATEGORIES: Category[] = [
  // ---------- Foundations ----------
  { slug: 'artificial-intelligence', name: 'Artificial Intelligence', group: 'Foundations', accent: '#6366F1', icon: ICONS.spark,
    description: 'The core concepts behind modern AI — what these systems can genuinely do, how they are built and where the real limits sit.' },
  { slug: 'ai-news', name: 'AI News', group: 'Foundations', accent: '#8B5CF6', icon: ICONS.news,
    description: 'Model launches, research releases, funding rounds and policy shifts — the AI stories that actually change what you can build.' },
  { slug: 'llms', name: 'LLMs', group: 'Foundations', accent: '#7C3AED', icon: ICONS.brain,
    description: 'How large language models work — tokenisation, context windows, attention, training and the behaviours that follow from the architecture.' },
  { slug: 'machine-learning', name: 'Machine Learning', group: 'Foundations', accent: '#4F46E5', icon: ICONS.graph,
    description: 'Machine learning fundamentals — training, evaluation, overfitting, embeddings and the maths that underpins every model you use.' },
  { slug: 'generative-ai', name: 'Generative AI', group: 'Foundations', accent: '#A855F7', icon: ICONS.palette,
    description: 'Generative systems across text, image, audio and video — how they produce output and what separates a demo from a product.' },
  { slug: 'prompt-engineering', name: 'Prompt Engineering', group: 'Foundations', accent: '#D946EF', icon: ICONS.pen,
    description: 'Prompt design that survives contact with production — structure, examples, evaluation and the patterns that reliably improve output.' },
  { slug: 'ai-ethics', name: 'AI Ethics', group: 'Foundations', accent: '#64748B', icon: ICONS.scale,
    description: 'Bias, transparency, consent, labour and accountability — the governance questions that arrive with every AI deployment.' },

  // ---------- Models & Labs ----------
  { slug: 'openai', name: 'OpenAI', group: 'Models & Labs', accent: '#10B981', icon: ICONS.atom,
    description: 'OpenAI models, APIs and product decisions — GPT releases, tooling changes and what they mean for people building on the platform.' },
  { slug: 'anthropic', name: 'Anthropic', group: 'Models & Labs', accent: '#D97706', icon: ICONS.compass,
    description: 'Anthropic research, the Claude model family and the safety-first design choices that shape how these models behave.' },
  { slug: 'chatgpt', name: 'ChatGPT', group: 'Models & Labs', accent: '#059669', icon: ICONS.chat,
    description: 'ChatGPT features, limitations and practical workflows — getting consistently useful results out of the most widely used AI product.' },
  { slug: 'claude', name: 'Claude', group: 'Models & Labs', accent: '#EA580C', icon: ICONS.compass2,
    description: 'Claude models in practice — long-context work, tool use, coding performance and where Claude outperforms the alternatives.' },
  { slug: 'gemini', name: 'Gemini', group: 'Models & Labs', accent: '#3B82F6', icon: ICONS.gem,
    description: 'Google Gemini across the model family — multimodal capability, context handling and integration with the wider Google stack.' },
  { slug: 'google-ai', name: 'Google AI', group: 'Models & Labs', accent: '#2563EB', icon: ICONS.atom,
    description: 'Google DeepMind research, Vertex AI, and how Google ships AI across Search, Workspace and Cloud.' },
  { slug: 'perplexity', name: 'Perplexity', group: 'Models & Labs', accent: '#0EA5E9', icon: ICONS.search,
    description: 'Perplexity and AI-native search — citation quality, research workflows and how answer engines change information discovery.' },
  { slug: 'meta-ai', name: 'Meta AI', group: 'Models & Labs', accent: '#1D4ED8', icon: ICONS.infinity,
    description: 'Meta AI research and the Llama family — open-weight releases and their effect on the wider model ecosystem.' },
  { slug: 'mistral', name: 'Mistral', group: 'Models & Labs', accent: '#F97316', icon: ICONS.wind,
    description: 'Mistral models and the European open-weight scene — efficient architectures, mixture-of-experts and self-hosting economics.' },
  { slug: 'deepseek', name: 'DeepSeek', group: 'Models & Labs', accent: '#0891B2', icon: ICONS.whale,
    description: 'DeepSeek releases and the reasoning-model wave — training efficiency, benchmark results and open-weight availability.' },
  { slug: 'open-source-llms', name: 'Open Source LLMs', group: 'Models & Labs', accent: '#16A34A', icon: ICONS.stack,
    description: 'Open-weight models you can actually run — licensing reality, hardware requirements and where they close the gap on frontier models.' },

  // ---------- Building ----------
  { slug: 'ai-agents', name: 'AI Agents', group: 'Building', accent: '#8B5CF6', icon: ICONS.bot,
    description: 'Agentic systems that plan, call tools and act — architectures, failure modes and what it takes to make them reliable.' },
  { slug: 'mcp', name: 'MCP', group: 'Building', accent: '#7C3AED', icon: ICONS.plug,
    description: 'The Model Context Protocol — how tools, resources and prompts are exposed to AI clients through one open standard.' },
  { slug: 'ai-coding', name: 'AI Coding', group: 'Building', accent: '#0EA5E9', icon: ICONS.code,
    description: 'AI-assisted software development — where these tools genuinely accelerate work, and the review discipline they demand.' },
  { slug: 'cursor', name: 'Cursor', group: 'Building', accent: '#0284C7', icon: ICONS.cursor,
    description: 'Cursor as an AI-first editor — codebase indexing, agent mode, rules files and how it fits an existing workflow.' },
  { slug: 'github-copilot', name: 'GitHub Copilot', group: 'Building', accent: '#475569', icon: ICONS.copilot,
    description: 'GitHub Copilot across completions, chat and agents — enterprise controls, model choice and measurable developer impact.' },
  { slug: 'windsurf', name: 'Windsurf', group: 'Building', accent: '#14B8A6', icon: ICONS.surf,
    description: 'Windsurf and its agentic editing model — Cascade flows, context handling and where it diverges from other AI editors.' },
  { slug: 'claude-code', name: 'Claude Code', group: 'Building', accent: '#D97706', icon: ICONS.terminal,
    description: 'Claude Code in the terminal — agentic coding, subagents, hooks, MCP servers and repeatable engineering workflows.' },
  { slug: 'rag', name: 'RAG', group: 'Building', accent: '#F59E0B', icon: ICONS.stack,
    description: 'Retrieval-augmented generation — chunking, embeddings, reranking, evaluation and why most RAG systems fail on retrieval, not generation.' },
  { slug: 'vector-databases', name: 'Vector Databases', group: 'Building', accent: '#CA8A04', icon: ICONS.database,
    description: 'Vector search infrastructure — index types, hybrid search, filtering, scaling and choosing between managed and embedded options.' },
  { slug: 'ai-apis', name: 'AI APIs', group: 'Building', accent: '#22D3EE', icon: ICONS.api,
    description: 'Working with model APIs — authentication, streaming, tool calling, caching, rate limits and controlling token spend.' },

  // ---------- Applied AI ----------
  { slug: 'automation', name: 'Automation', group: 'Applied AI', accent: '#10B981', icon: ICONS.gears,
    description: 'AI-driven automation for real operations — where to apply it, how to keep a human in the loop and what it actually saves.' },
  { slug: 'no-code-ai', name: 'No-Code AI', group: 'Applied AI', accent: '#22C55E', icon: ICONS.blocks,
    description: 'Building AI workflows without writing code — visual builders, integration platforms and the ceiling you eventually hit.' },
  { slug: 'ai-security', name: 'AI Security', group: 'Applied AI', accent: '#EF4444', icon: ICONS.shield,
    description: 'Securing AI systems — prompt injection, data exfiltration, model supply chain and the controls that limit agentic blast radius.' },
  { slug: 'image-generation', name: 'Image Generation', group: 'Applied AI', accent: '#EC4899', icon: ICONS.image,
    description: 'AI image models in practice — prompt control, consistency, editing workflows, licensing and production-quality output.' },
  { slug: 'video-generation', name: 'Video Generation', group: 'Applied AI', accent: '#F43F5E', icon: ICONS.film,
    description: 'AI video generation — model capabilities, shot control, cost per second and where it fits a real production pipeline.' },
  { slug: 'voice-ai', name: 'Voice AI', group: 'Applied AI', accent: '#A855F7', icon: ICONS.mic,
    description: 'Speech synthesis, transcription and real-time voice agents — latency budgets, cloning ethics and deployment architecture.' },
  { slug: 'robotics', name: 'Robotics', group: 'Applied AI', accent: '#64748B', icon: ICONS.robot,
    description: 'Embodied AI and robotics — vision-language-action models, simulation-to-real transfer and where physical AI genuinely stands.' },
];

/** Fast lookup by slug. */
const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return CATEGORY_MAP.get(slug);
}

/**
 * Always returns a renderable category. Unknown slugs degrade to a neutral
 * placeholder rather than throwing during the build.
 */
export function getCategoryOrFallback(slug: string): Category {
  return (
    CATEGORY_MAP.get(slug) ?? {
      slug,
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: `Articles filed under ${slug.replace(/-/g, ' ')}.`,
      group: 'Foundations',
      accent: '#6366F1',
      icon: ICONS.spark,
    }
  );
}

export const CATEGORY_GROUPS = [
  'Foundations',
  'Models & Labs',
  'Building',
  'Applied AI',
] as const;

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
