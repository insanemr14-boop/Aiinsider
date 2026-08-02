---
name: "Perplexity Deep Research"
tagline: "Multi-step research agent that runs dozens of searches and returns a cited report instead of an answer."
description: "Deep Research is Perplexity's long-running research mode. Given a question, it decomposes the topic, runs iterative web searches, reads sources, and produces a structured report with inline citations. The value is not raw answer quality but the audit trail: every claim links back to a retrievable source you can check."
seoTitle: "Perplexity Deep Research Review: Cited Research Agent"
seoDescription: "Perplexity Deep Research runs iterative searches and returns cited reports. How the agent loop works, citation quality, export options, and known weaknesses."
vendor: "Perplexity"
website: "https://www.perplexity.ai"
docs: "https://docs.perplexity.ai"
category: "Research Agents"
runtime: "cloud"
mcpSupport: false
autonomy: "autonomous"
pricing: "freemium"
priceNote: "Limited free runs per day; paid individual and enterprise tiers raise the quota."
rating: 4.4
features:
  - "Iterative multi-query search"
  - "Inline source citations"
  - "Structured report output"
  - "Export to PDF and Markdown"
  - "Follow-up questioning"
  - "Focus modes by source type"
pros:
  - "Citations are inline and checkable, which makes the output auditable rather than merely plausible"
  - "Handles breadth well — surfaces sources a single search session would likely miss"
  - "Report structure is consistent enough to drop into a working document with light editing"
cons:
  - "Source quality filtering is uneven; SEO content sometimes outranks primary material"
  - "Synthesis can flatten genuine disagreement between sources into false consensus"
  - "No access to paywalled journals or internal documents, which limits depth on specialist topics"
bestFor: "Analysts and writers who need a broad, cited first pass on an unfamiliar topic in minutes rather than hours."
relatedArticle: "perplexity-review"
featured: true
updatedDate: 2026-07-21
---

Deep Research is an agent loop wrapped around a search engine. The model plans sub-questions, issues queries, reads results, notices gaps, and queries again — repeating until it judges coverage sufficient. Only then does it write.

That loop is why the output differs in kind from a single-shot answer. A chat response reflects one retrieval pass; a research run reflects many, with later queries shaped by what earlier ones returned. The report inherits the shape of the investigation.

The honest limitation is source discrimination. The agent is good at finding material and weaker at judging which material deserves weight, so a well-optimized blog post can end up cited beside a regulatory filing. Treat the output as a mapped territory with a bibliography, not as a finished piece of analysis — then verify the claims that matter. Our [Perplexity review](/articles/perplexity-review/) covers the wider product.
