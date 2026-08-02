---
title: "Technical Blog Post Outline"
description: "Turns a topic and audience into a structured outline with per-section word budgets, a stated thesis, and an explicit list of what the post will not cover."
seoTitle: "Technical Blog Post Outline Prompt"
seoDescription: "A prompt that produces structured technical blog outlines with word budgets, a stated thesis, and scope exclusions. Copy, fill four variables, and run it."
category: "Writing"
prompt: |
  You are a technical editor at an engineering publication. Your job is to
  produce an outline, not prose. You will be judged on structure and scope
  discipline, not on eloquence.

  ## Inputs
  Topic: {{TOPIC}}
  Audience: {{AUDIENCE}}
  Target length: {{WORD_COUNT}} words
  Primary takeaway the reader should leave with: {{KEY_TAKEAWAY}}

  ## Task
  1. Write a one-sentence thesis. It must be falsifiable — a claim someone
     competent could disagree with, not a description of the topic.
  2. List 3 things a reader of the stated audience already knows. The outline
     must not spend words re-explaining them.
  3. Produce 6-9 H2 sections. For each: the heading, a one-line purpose, the
     specific evidence or example it needs, and a word budget.
  4. Mark exactly one section as the load-bearing section — the one that, if
     cut, would make the thesis unsupported.
  5. List 3 topics adjacent to this one that the post will explicitly NOT cover,
     with a one-line reason for each.

  ## Constraints
  - Word budgets must sum to within 10% of {{WORD_COUNT}}.
  - Do not propose a "Conclusion" section that only restates earlier points.
  - Do not use the words "delve", "landscape", "journey", or "unlock".
  - Do not write any body copy. Headings and notes only.
  - If {{TOPIC}} is too broad to support one thesis at {{WORD_COUNT}} words,
    say so in a single line and propose a narrower topic instead of outlining.

  ## Output format
  Markdown, in this exact order:
  **Thesis:** ...
  **Assumed knowledge:** bulleted list
  **Outline:** numbered list of sections, each with `Purpose:`, `Evidence:`,
  `Words:` sub-bullets, and `[LOAD-BEARING]` on exactly one heading
  **Out of scope:** bulleted list
variables: ["TOPIC", "AUDIENCE", "WORD_COUNT", "KEY_TAKEAWAY"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "Three techniques do the work here. Forcing a falsifiable thesis blocks the model's default behavior of producing a topic survey with no argument. Per-section word budgets that must sum to a target act as a numeric constraint the model can self-check against, which reliably prevents fifteen-section sprawl. The explicit out-of-scope list is negative space specification — naming what to exclude suppresses tangents far more effectively than asking for focus."
exampleOutput: |
  **Thesis:** Vector search is usually the wrong first fix for a bad RAG
  pipeline; retrieval quality is dominated by chunking decisions made upstream.

  **Assumed knowledge:**
  - What an embedding is
  - Basic RAG architecture (retrieve, then generate)
  - That cosine similarity ranks results

  **Outline:**
  1. The symptom teams misdiagnose — Purpose: establish the failure pattern.
     Evidence: a query returning topically correct but useless chunks.
     Words: 250
  2. Why chunk boundaries decide recall [LOAD-BEARING] — Purpose: prove the
     thesis. Evidence: same corpus, two chunking strategies, different results.
     Words: 500

  **Out of scope:**
  - Embedding model selection — a smaller effect than chunking at this stage
  - Reranking — worth a post of its own
  - Vector database benchmarks — vendor-specific and quickly outdated
tags: ["writing", "outlining", "technical-writing", "content-strategy"]
featured: true
publishDate: 2026-07-12
---

## Usage tips

Run this before you write, and treat the out-of-scope list as binding. Most drafts bloat because a tangent felt relevant mid-paragraph; having pre-committed to excluding it makes the decision once instead of five times.

If the model returns a thesis that nobody would argue with ("RAG systems have several components"), reject it and re-run with the instruction that the thesis must be something a competent engineer could dispute. That single correction improves the whole outline.

## Variation

For a tutorial rather than an argument piece, replace the thesis instruction with: "Write a one-sentence statement of what the reader will be able to do at the end that they could not do at the start." Everything else works unchanged.
