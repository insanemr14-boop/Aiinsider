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

## Why iteration produces a different artefact

A chat response reflects one retrieval pass. Whatever the first query returned is what the answer is made of, and if the useful material used different vocabulary, it is simply absent.

A research run reflects many passes, with later queries shaped by what earlier ones returned. The agent discovers the domain's actual terminology partway through and searches again with it, notices that two sources contradict and looks for a third, finds a reference to a document it has not read and goes to read it.

The report inherits the shape of that investigation, which is why the output differs in kind rather than in length. It reads like something assembled by someone who spent an hour on the topic, because structurally that is what happened.

Citation density is the other differentiator. Perplexity's whole product thesis is sources next to claims, and Deep Research carries that through — the resulting report is verifiable at a granularity most research agents do not attempt.

## The honest limitation

The agent is good at finding material and weaker at judging which material deserves weight, so a well-optimised blog post can end up cited beside a regulatory filing. Nothing in the output distinguishes them; both appear as numbered sources.

On commercial topics this is a serious distortion, because the material that ranks for commercial queries is overwhelmingly produced by parties with an interest in the answer. A research run on "best X for Y" assembles a consensus from vendor content and affiliate reviews and presents it with the same confidence as a run on a scientific question.

Treat the output as a mapped territory with a bibliography, not as a finished piece of analysis — then verify the claims that matter. The tool makes that verification unusually cheap, which is the correct division of labour, but it does not perform it.

The second limitation is that the agent decides when coverage is sufficient, and it is not always right. Runs sometimes terminate satisfied on topics where an expert would know a whole literature was missed. There is no signal for "I did not find the important thing", because by construction it does not know.

## Access and cost

Limited free runs per day, with paid individual and enterprise tiers raising the quota. Because each run is expensive to produce — many queries, much reading — the quotas are meaningfully restrictive rather than nominal, and heavy research use hits them.

The practical pattern is to use ordinary search for questions with a single answer and reserve research runs for questions that genuinely require synthesis across many sources. Spending a run on something a single query would have answered is the main way the quota gets wasted.

## Where it fits

Competitive scans, regulatory and market landscape work, technical due diligence, and any question where the answer is a synthesis rather than a fact. Particularly strong where you intend to check the citations, because they are there to check.

For scoping work where you want to confirm the agent understood the question first, [Gemini Deep Research](/agents/gemini-deep-research/) surfaces an editable plan. For research over your own documents rather than the web, a corpus-bound tool is the right choice.

Our [Perplexity review](/articles/perplexity-review/) covers the wider product.
