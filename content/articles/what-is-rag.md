---
title: "What Is RAG? Retrieval-Augmented Generation Explained"
description: "How retrieval-augmented generation works end to end — chunking, embedding, hybrid search, reranking — and why most RAG systems fail at retrieval, not generation."
excerpt: "RAG puts the right documents in the model's context at query time. The generation half is mostly solved; the retrieval half is where nearly every production system breaks."
seoTitle: "What Is RAG? Retrieval-Augmented Generation Explained"
seoDescription: "A technical explanation of RAG: the full pipeline, chunking strategies, hybrid search, reranking, evaluation methodology, and when to fine-tune instead."
author: engineering-desk
category: rag
tags: ["rag", "vector-databases", "embeddings", "llms", "retrieval", "ai-engineering"]
type: analysis
publishDate: 2026-06-25
updatedDate: 2026-08-02
featured: false
editorsPick: true
trending: false
heroAlt: "Diagram-style illustration of documents flowing through an index into a language model context window"
faq:
  - question: "What does RAG stand for?"
    answer: "RAG stands for retrieval-augmented generation. The system searches a corpus for passages relevant to the user's question, inserts those passages into the model's prompt, and asks the model to answer using them."
  - question: "Does a large context window make RAG unnecessary?"
    answer: "Long context changes the economics of RAG but does not remove the need for it. Most corpora are far larger than any context window, cost and latency scale with tokens processed, and models attend less reliably to material buried in the middle of a very long prompt, so selecting the right material still matters."
  - question: "Why do RAG systems return wrong answers?"
    answer: "The overwhelming majority of failures are retrieval failures: the passage containing the answer never reached the model. Chunk boundaries splitting an answer in half, vocabulary mismatch between question and document, and a top-k cutoff that is too small account for most of them."
  - question: "What is hybrid search in RAG?"
    answer: "Hybrid search runs a keyword algorithm such as BM25 alongside dense vector similarity and merges the two result lists. It exists because embeddings are unreliable on exact identifiers, rare terms, error codes and product names, which is precisely where keyword search excels."
  - question: "What is a reranker and do I need one?"
    answer: "A reranker is a cross-encoder that scores each candidate passage jointly with the query rather than comparing precomputed vectors. Retrieving fifty candidates cheaply and reranking to the best five is usually the single largest quality improvement available for a modest latency cost."
  - question: "How should I evaluate a RAG system?"
    answer: "Evaluate retrieval and generation separately, because a single end-to-end score hides where the failure is. Measure recall at k and rank quality against a labeled question-to-passage set for retrieval, then measure groundedness and citation accuracy for generation."
  - question: "Should I fine-tune instead of using RAG?"
    answer: "Fine-tuning changes how a model behaves; retrieval changes what it knows. Use fine-tuning for output format, tone, domain vocabulary, classification behavior and cost reduction, and use retrieval for facts that change or that must be cited."
  - question: "What chunk size works best for RAG?"
    answer: "A few hundred tokens with modest overlap is a reasonable starting point, but the better answer is to chunk on document structure — sections, headings, list items — so that each chunk is a coherent unit. Test chunk size against your own evaluation set, because it interacts strongly with your embedding model and reranker."
---

Retrieval-augmented generation is the practice of searching a corpus at query time and placing the relevant passages into a language model's prompt before it answers. It exists because model weights are a poor place to store facts that change, that belong to you, or that need a citation.

The concept takes a paragraph to explain and a quarter to get right. Almost all of that difficulty sits in retrieval, not generation.

## Why does RAG exist?

A language model's knowledge is frozen at its training cutoff, compressed lossily into weights, and unattributable. Those three properties cause four concrete problems — staleness, private data, attribution and access control — and RAG addresses all four by searching a corpus at query time and placing the relevant passages in the prompt.

Taking those problems in turn.

**Staleness.** Anything after the cutoff is unknown. Retraining to add facts is absurdly expensive and does not scale to a corpus that changes daily.

**Private data.** Your contracts, tickets, wiki and codebase were not in the training set and should not be. RAG is the mechanism for using them without sending them through a training run.

**Attribution.** A regulated or high-stakes answer needs a source the user can check. A model reciting from weights cannot reliably tell you where a fact came from. A model quoting a retrieved passage can.

**Access control.** Knowledge baked into weights cannot be permission-scoped. Knowledge in an index can be filtered per user at query time, which is usually the deciding argument in enterprise deployments.

There is a fifth benefit that gets less attention: grounding reduces fabrication. A model asked to answer from supplied text, and instructed to say when the text does not contain the answer, hallucinates substantially less than one answering from memory.

### Does a large context window make RAG unnecessary?

No. Long context changes the economics of RAG without removing the need for it: corpora are larger than context windows by orders of magnitude, cost and latency scale with tokens processed, and models attend less reliably to material buried in the middle of a very long prompt.

Every context window expansion prompts the claim that RAG is obsolete. It is not, for three reasons.

Corpora are larger than context windows by orders of magnitude, and that ratio is not closing. Cost and latency scale with tokens processed, so stuffing a million tokens into every request to answer a question that needs two paragraphs is indefensible economically. And attention quality is not uniform — models retrieve less reliably from the middle of very long inputs than from the beginning or end.

Long context does change the design. It makes larger chunks viable, reduces the pressure to retrieve exactly the right passage, and enables approaches that put whole documents in context once a cheap filter has narrowed the candidate set. It removes the need for aggressive compression, not the need for selection.

## What are the stages of a RAG pipeline?

Seven stages: ingest and parse, chunk, embed, index, retrieve, rerank, and generate. Failures cluster in the middle, because chunking, embedding and retrieval together decide whether the passage containing the answer ever reaches the model — and nothing downstream can recover from a miss.

### 1. Ingest and parse

Get source material into clean text with structure preserved. This is unglamorous and it is where a startling share of RAG quality is lost.

PDFs are the main offender. A naive text extraction turns a two-column layout into interleaved nonsense and flattens tables into unreadable strings. Headers and footers repeat on every page and pollute every chunk. Scanned documents need OCR. Modern document parsers — layout-aware models that emit structured Markdown with headings and tables intact — are worth the extra cost, because everything downstream inherits this stage's errors.

Preserve metadata while you are here: source, title, section path, author, date, permissions. You will need every one of these for filtering.

### 2. Chunk

Split documents into retrievable units. Covered in detail below.

### 3. Embed

Convert each chunk to a vector with an embedding model. The vector encodes meaning such that semantically similar text lands nearby in the space.

Embedding model choice matters more than most teams assume. Test candidates on your own domain — a model that leads general benchmarks may do poorly on legal, medical or code text. Dimensionality is a real cost driver at scale, and several current models support truncating dimensions with graceful quality loss, which is a useful lever.

The critical operational rule: the same model must embed both documents and queries, and changing the embedding model means re-embedding the entire corpus.

### 4. Index

Store the vectors in a structure supporting fast approximate nearest neighbor search, alongside the original text and metadata. Our companion piece on [vector databases](/articles/vector-databases-explained/) covers index types and their tradeoffs; for RAG purposes what matters is that the index supports metadata filtering and, ideally, keyword search in the same query.

### 5. Retrieve

Given a query, fetch candidate chunks. Best practice is hybrid: dense vector similarity plus a keyword algorithm, results merged.

### 6. Rerank

Score the candidates properly and keep the best few. This is the highest-leverage optional stage.

### 7. Generate

Build a prompt containing the passages, the question and instructions on how to use them, then call the model. Require citations. Instruct the model to state when the context is insufficient rather than filling the gap.

```python
SYSTEM = """You answer questions using only the provided context.

Rules:
- Cite the source id in square brackets after each claim, e.g. [doc_12].
- If the context does not contain the answer, say exactly:
  "The provided sources do not contain this information."
- Never use knowledge outside the context, even if you are confident.
- Quote figures and identifiers exactly as they appear."""

def build_prompt(question: str, passages: list[dict]) -> list[dict]:
    context = "\n\n".join(
        f"[{p['id']}] source: {p['source']} | section: {p['section']}\n{p['text']}"
        for p in passages
    )
    return [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": f"<context>\n{context}\n</context>\n\nQuestion: {question}"},
    ]
```

Two details in that prompt do disproportionate work: an exact refusal string, which makes "no answer found" measurable rather than a judgment call, and the instruction to quote identifiers verbatim, which prevents the model from smoothing a part number into something plausible.

## How should you chunk documents for RAG?

Chunk on the document's own structure — headings, sections, list items, function definitions — capped at a few hundred tokens, with contextual prefixes added at ingest, small-to-big retrieval, and a hard rule that tables and code blocks are never split. Chunking determines what can be retrieved at all: if the answer spans a boundary, no retrieval method will find it intact.

**Fixed-size with overlap** splits every N tokens with a small overlap. Trivial to implement, and it will cut sentences, tables and code blocks in half. Acceptable as a baseline, rarely the right final answer.

**Recursive character splitting** tries a hierarchy of separators — paragraph breaks, then line breaks, then sentences — falling back only as needed. A better default and what most frameworks use.

**Structural chunking** splits on the document's own structure: Markdown headings, HTML sections, list items, function definitions in code. This is the highest-value change most teams can make, because a section is already a coherent semantic unit written by a human. It requires the parsing stage to have preserved structure, which is why parsing quality compounds.

**Semantic chunking** computes embeddings for consecutive sentences and splits where similarity drops, finding topic boundaries empirically. Elegant, more expensive, and in practice often no better than good structural chunking.

### Strategies that go beyond splitting

**Small-to-big / parent document** indexes small precise chunks for matching but returns the larger enclosing section to the model. This decouples retrieval granularity from generation granularity and is one of the most reliable quality wins available.

**Contextual chunk augmentation** prepends a short generated description of where the chunk sits in its document — the document title, the section, what the chunk is about — before embedding. It solves the pronoun problem, where a chunk saying "it increased by twelve percent" is unretrievable because nothing in it names the subject. The cost is one cheap model call per chunk at ingest time, paid once.

## What is hybrid search in RAG?

Hybrid search runs a keyword algorithm such as BM25 alongside dense vector similarity and merges the two result lists, usually with reciprocal rank fusion. It exists because dense embeddings capture meaning but blur exact tokens — identifiers, error codes, product names, acronyms — which is precisely where keyword search excels.

Dense embeddings capture meaning and are unreliable on exact tokens. Ask for error code `E-4471` and a vector search will happily return passages about similar-looking codes, because in embedding space they are all approximately "an error code."

Keyword search handles that case exactly. BM25 scores documents on term frequency against inverse document frequency, which makes rare terms — identifiers, product names, acronyms, function names — highly discriminative. Precisely the terms embeddings blur.

Running both and fusing the results is standard. Reciprocal rank fusion is the usual method because it needs no score normalization between two incomparable scales:

```python
def reciprocal_rank_fusion(runs: list[list[str]], k: int = 60) -> list[str]:
    """Merge ranked id lists from multiple retrievers."""
    scores: dict[str, float] = {}
    for run in runs:
        for rank, doc_id in enumerate(run):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)
    return sorted(scores, key=scores.get, reverse=True)

candidates = reciprocal_rank_fusion([
    vector_search(query, limit=50),
    bm25_search(query, limit=50),
])
```

Query handling is the other half. Users write short, ambiguous, conversational queries; documents are written in formal prose. Three transformations close that gap.

**Query rewriting** resolves references against conversation history, turning "what about the second one" into a standalone question. Mandatory for any multi-turn interface.

**Multi-query expansion** generates several paraphrases of the question, retrieves for each, and fuses. Cheap insurance against a single unlucky phrasing.

**Decomposition** splits a compound question into sub-questions retrieved independently. Necessary for anything comparative.

### What is a reranker and do you need one?

A reranker is a cross-encoder that feeds the query and each candidate passage through a model together, producing a far more accurate relevance score than comparing precomputed vectors. Retrieve fifty to a hundred candidates cheaply, rerank, and keep the top five to ten. For most systems this is the single largest quality improvement available for the effort.

Retrieval uses a bi-encoder: query and document are embedded separately, so their vectors are computed without reference to each other. That is what makes precomputation and fast search possible, and it is also why the ranking is coarse.

A cross-encoder reranker feeds the query and each candidate through a model together, producing a far more accurate relevance score at a cost that only makes sense on a shortlist. Retrieve fifty to a hundred candidates cheaply, rerank, keep the top five to ten.

For most systems this is the single largest quality improvement available for the effort, and it is more valuable than upgrading the generation model.

## Why do RAG systems return wrong answers?

The overwhelming majority of failures are retrieval failures: the passage containing the answer was never in the context. When a RAG system gives a wrong answer, the instinct is to blame the model or rewrite the prompt, but log what was actually retrieved and the picture usually changes. Chunk boundaries, vocabulary mismatch and a top-k cutoff that is too small account for most of them.

The recurring causes:

**Chunk boundaries.** The answer spans a split. The question asks about a condition stated in one chunk and its exception stated in the next.

**Vocabulary mismatch.** The user asks about "time off"; the policy document says "annual leave entitlement." Dense retrieval handles this better than keyword search but not perfectly, particularly for internal jargon and acronyms.

**Diluted chunk vectors.** A long chunk covering five topics produces one vector that is the average of five things and close to none of them.

**Top-k too small.** Recall at five may be mediocre while recall at fifty is excellent. If you are not reranking, you are forced to choose a small k, which forces a recall ceiling.

**Missing metadata filters.** The correct answer exists, but so do three superseded versions of the same document, and the retriever cannot tell them apart because nobody indexed a date or status field.

**Aggregation questions.** "How many customers are on the enterprise plan?" cannot be answered by retrieving k passages. Counting, summing and comparing across a whole corpus is a database query, not a similarity search. Route these elsewhere rather than pretending retrieval can serve them.

**Parsing damage.** The answer was in a table that the PDF extractor destroyed at ingest, months earlier.

### How do you diagnose a retrieval failure?

The diagnostic discipline is simple and rarely followed: before touching the prompt, check whether the gold passage was in the retrieved set. If it was not, the generation model is irrelevant. If it was and the answer was still wrong, then you have a generation problem — and those are comparatively easy to fix with the techniques in our [prompt engineering guide](/articles/prompt-engineering-guide/).

## How should you evaluate a RAG system?

Evaluate retrieval and generation separately against a labeled set of real questions. Measure recall at k, MRR and nDCG for retrieval; measure groundedness, citation accuracy, answer relevance and appropriate refusal for generation. You cannot improve what you do not measure, and a single end-to-end quality score tells you nothing about where to work.

### Build a labeled set

Collect fifty to a few hundred real questions. For each, identify the passage or passages that actually contain the answer. This is tedious and it is the foundation for everything else.

Bootstrapping helps: have a model read each chunk and generate a question that chunk answers, giving you question-to-passage pairs for free. Human review is still needed, because generated questions tend to be lexically similar to their source and therefore too easy.

### Measure retrieval separately

- **Recall@k** — fraction of questions where a correct passage appears in the top k. The most important number in the system.
- **MRR** — how high the first correct passage ranks.
- **nDCG** — rank quality when multiple passages are relevant with different degrees of usefulness.

Track recall at several values of k. A large gap between recall@5 and recall@50 means a reranker will pay for itself immediately.

### Measure generation separately

Given known-correct context, evaluate:

- **Groundedness** — is every claim supported by the supplied passages?
- **Citation accuracy** — do the cited ids actually contain the cited claims?
- **Answer relevance** — does it address the question asked?
- **Appropriate refusal** — does it decline when the context genuinely lacks the answer? Test this explicitly with questions whose answers are absent from the corpus. Systems that never refuse are fabricating.

Model-as-judge scoring works acceptably for these dimensions if you calibrate it against human labels on a sample first, and if the judge sees the same context the generator saw.

### Watch the operational metrics

Retrieval latency, end-to-end latency, tokens per request and cost per answer belong on the same dashboard as quality. A configuration that improves accuracy slightly while tripling latency is often the wrong trade.

## Should you fine-tune instead of using RAG?

Only for the things retrieval cannot do. Fine-tune for consistent output structure, a house tone, unusual domain syntax, classification behavior at high volume, or a small model distilled onto one narrow task. Use retrieval for facts that change, need citations, or are permission-scoped. The distinction is durable: **fine-tuning changes behavior, retrieval changes knowledge.**

Fine-tune when you need consistent output structure that prompting achieves unreliably, a specific tone or house style, comprehension of unusual domain syntax such as an internal query language, classification behavior at high volume, or a small model distilled to match a large model's performance on one narrow task at much lower cost.

Use retrieval when facts change, when answers need citations, when content is user-specific or permission-scoped, or when the corpus is large relative to what any training run could usefully absorb.

Fine-tuning to inject facts is the common mistake. It is expensive, it does not produce citations, updating requires retraining, and the model will still confidently interpolate between things it half-learned.

The two compose well: fine-tune a small model to follow your grounded-answering format precisely, then feed it retrieved context. That combination often beats a much larger general model on both quality and cost.

## Agentic retrieval

The frontier of the field treats retrieval as a tool the model can call repeatedly rather than a fixed pre-step. The model decides whether to search, formulates its own queries, evaluates whether the results answered the question, and searches again with a different framing if not.

This handles multi-hop questions that single-shot retrieval cannot, at the cost of latency, unpredictability and much harder evaluation. Standardized tool interfaces make it practical to expose several corpora and structured data sources to the same agent — see [how MCP works](/articles/how-mcp-works/) for the protocol layer, and our roundup of the [best AI agents](/articles/best-ai-agents/) for what is shipping.

Single-shot RAG with hybrid search and a reranker remains the right default. Add agentic loops when you have evidence that your questions require multiple hops.

## Key takeaways

RAG exists because weights are the wrong storage medium for facts that change, belong to someone, or need a citation. Long context adjusts the design without eliminating the need.

Spend your effort on retrieval. Parse documents properly, chunk on structure, add context to chunks at ingest, run hybrid search, and rerank. Those five changes account for most of the distance between a demo and a system people trust.

Measure retrieval and generation separately against a labeled set. Without that, every change is a guess, and RAG systems are unusually good at hiding retrieval failures behind fluent prose.

More in the [RAG category](/category/rag/) and our practical walkthrough of the [OpenAI API](/articles/openai-api-tutorial/).
