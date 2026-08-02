import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Directory helpers for the AI Tool and AI Agent directories, and the Prompt
 * Library.
 *
 * Tools and agents share a structural schema (see `content.config.ts`), so
 * both flow through the same card and detail templates. The helpers below are
 * generic over the two collections rather than duplicated per collection.
 */

export type Tool = CollectionEntry<'tools'>;
export type AgentEntry = CollectionEntry<'agents'>;
export type Prompt = CollectionEntry<'prompts'>;

/** The common shape both directories satisfy. */
export type DirectoryItem = Tool | AgentEntry;

/** Human labels for the `pricing` enum, used on cards and filter chips. */
export const PRICING_LABELS: Record<string, string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
  'open-source': 'Open Source',
  enterprise: 'Enterprise',
};

/** Human labels for an agent's `runtime`. */
export const RUNTIME_LABELS: Record<string, string> = {
  cloud: 'Cloud',
  local: 'Local',
  hybrid: 'Hybrid',
  ide: 'IDE',
  terminal: 'Terminal',
};

/** Human labels for an agent's `autonomy` level. */
export const AUTONOMY_LABELS: Record<string, string> = {
  assisted: 'Assisted',
  supervised: 'Supervised',
  autonomous: 'Autonomous',
};

export function slugOfItem(item: DirectoryItem | Prompt): string {
  return item.data.slug ?? item.id;
}

export function toolUrl(item: Tool): string {
  return `/tools/${slugOfItem(item)}/`;
}

export function agentUrl(item: AgentEntry): string {
  return `/agents/${slugOfItem(item)}/`;
}

export function promptUrl(item: Prompt): string {
  return `/prompts/${slugOfItem(item)}/`;
}

/**
 * Directory ordering: featured first, then by rating, then alphabetically.
 * Unrated entries sort below rated ones rather than being treated as zero,
 * so a new entry awaiting review does not land at the bottom of the page by
 * accident — it lands with its peers.
 */
function byDirectoryRank(a: DirectoryItem, b: DirectoryItem): number {
  if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
  const ra = a.data.rating ?? -1;
  const rb = b.data.rating ?? -1;
  if (ra !== rb) return rb - ra;
  return a.data.name.localeCompare(b.data.name);
}

export async function getTools(): Promise<Tool[]> {
  const all = await getCollection('tools', ({ data }) =>
    data.draft ? import.meta.env.DEV : true
  );
  return all.sort(byDirectoryRank);
}

export async function getAgents(): Promise<AgentEntry[]> {
  const all = await getCollection('agents', ({ data }) =>
    data.draft ? import.meta.env.DEV : true
  );
  return all.sort(byDirectoryRank);
}

export async function getPrompts(): Promise<Prompt[]> {
  const all = await getCollection('prompts', ({ data }) =>
    data.draft ? import.meta.env.DEV : true
  );
  return all.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
  });
}

/**
 * Groups directory items by their `category`, preserving the rank order within
 * each group. Returns an array so the template can render groups in a stable,
 * declared order rather than relying on object key ordering.
 */
export function groupByCategory<T extends DirectoryItem | Prompt>(
  items: T[]
): { category: string; items: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.data.category;
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }
  return [...groups.entries()]
    .map(([category, list]) => ({ category, items: list }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

/** Distinct categories present in a set of items, with counts. */
export function categoryFacets<T extends DirectoryItem | Prompt>(
  items: T[]
): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = item.data.category;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

/**
 * Related directory entries: same category first, then anything sharing a
 * feature chip. Always returns `limit` items where the directory is large
 * enough, so the detail page never renders a half-empty rail.
 */
export function relatedItems<T extends DirectoryItem>(
  item: T,
  all: T[],
  limit = 3
): T[] {
  const selfId = item.id;
  const features = new Set(item.data.features.map((f) => f.toLowerCase()));

  const scored = all
    .filter((c) => c.id !== selfId)
    .map((c) => {
      const sameCategory = c.data.category === item.data.category ? 3 : 0;
      const shared = c.data.features.filter((f) =>
        features.has(f.toLowerCase())
      ).length;
      return { c, score: sameCategory + shared };
    })
    .sort((x, y) => y.score - x.score);

  return scored.slice(0, limit).map((s) => s.c);
}

/**
 * Renders a 0–5 rating as filled/half/empty star states. Returning descriptors
 * rather than markup keeps the star SVG in the component where it belongs.
 */
export function starStates(rating: number): ('full' | 'half' | 'empty')[] {
  return Array.from({ length: 5 }, (_, i) => {
    const position = i + 1;
    if (rating >= position) return 'full';
    if (rating >= position - 0.5) return 'half';
    return 'empty';
  });
}
