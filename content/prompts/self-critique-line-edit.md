---
title: "Self-Critique Line Edit Pass"
description: "A two-phase editing prompt: the model first diagnoses concrete problems in your draft against named criteria, then rewrites only the passages it flagged."
seoTitle: "Self-Critique Line Editing Prompt for AI Writing"
seoDescription: "An editing prompt that forces critique before rewriting, so the model fixes named problems instead of rewriting your voice away. Includes the criteria list."
category: "Writing"
prompt: |
  You are a line editor. You will work in two phases and must not begin
  phase two until phase one is complete.

  ## Draft
  {{DRAFT}}

  ## Voice to preserve
  {{VOICE_NOTES}}

  ## Phase 1 — Diagnose
  Read the draft and produce a numbered list of specific problems. For each
  problem give: the exact quoted text, the category, and one sentence on why
  it fails. Use only these categories:
  - BURIED: the point arrives after throat-clearing
  - VAGUE: an abstract claim where a concrete noun or number belongs
  - PADDING: words that carry no information
  - UNSUPPORTED: an assertion the draft never backs up
  - RHYTHM: consecutive sentences of near-identical length or structure
  - HEDGE: qualifiers that drain a claim without adding accuracy

  Find between 5 and 12 problems. If the draft genuinely has fewer, say so
  rather than inventing issues.

  ## Phase 2 — Repair
  Rewrite ONLY the passages you quoted in phase 1. Present each as:
  Before: (original)
  After: (revision)
  Why: (one line)

  ## Constraints
  - Do not rewrite passages you did not flag.
  - Do not change the argument, add claims, or introduce facts not in the draft.
  - Preserve the voice described in {{VOICE_NOTES}}; if a fix would flatten that
    voice, flag it and leave the text alone.
  - Never replace a specific detail with a general one.
  - Do not output a full clean version of the draft.
variables: ["DRAFT", "VOICE_NOTES"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "This is a self-critique loop with a fixed diagnostic taxonomy. Asking a model to 'improve' a draft produces homogenized prose because it optimizes toward its own default register. Forcing an explicit critique pass first, with a closed category list, converts a vague aesthetic task into a classification task the model does well — and restricting phase two to the flagged spans is what preserves your voice everywhere else."
exampleOutput: |
  ## Phase 1 — Diagnose
  1. "In the modern data landscape, organizations are increasingly finding
     that..." — PADDING. Eleven words before the sentence begins.
  2. "significantly improved performance" — VAGUE. No baseline, no metric,
     no magnitude.
  3. "It could be argued that this may sometimes be a factor" — HEDGE. Three
     qualifiers stacked on one weak claim.

  ## Phase 2 — Repair
  Before: In the modern data landscape, organizations are increasingly
  finding that query latency matters.
  After: Query latency matters.
  Why: The preamble carried no information the next sentence did not.

  Before: significantly improved performance
  After: cut p99 latency roughly in half
  Why: Replaced an abstraction with the measured effect.
tags: ["writing", "editing", "self-critique", "revision"]
featured: false
publishDate: 2026-06-25
---

## Usage tips

Paste a draft of under about 1,200 words. Beyond that, models start sampling rather than reading closely, and the diagnosis gets thin toward the end. Split long pieces by section.

Fill `VOICE_NOTES` with concrete rules, not adjectives. "Short sentences, no semicolons, first person plural, occasional sentence fragments for emphasis" works. "Punchy and conversational" does not.

## Why two phases beat one

A single-pass edit request gives the model no reason to justify its changes, so it rewrites everything and you lose the ability to audit what happened. Diagnosis-then-repair produces a diff you can accept or reject item by item — and rejecting item three does not disturb items one and two.
