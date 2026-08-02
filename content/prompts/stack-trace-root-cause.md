---
title: "Stack Trace to Root Cause Analysis"
description: "Turns an error and its stack trace into ranked hypotheses with the specific evidence that would confirm or eliminate each one, before proposing any fix."
seoTitle: "Debug Prompt: Stack Trace to Ranked Root Causes"
seoDescription: "A debugging prompt that generates competing root-cause hypotheses with disconfirming evidence for each, instead of guessing a fix from the stack trace alone."
category: "Coding"
prompt: |
  You are debugging a production issue. Your job in this response is diagnosis,
  not repair. Do not propose a fix until instructed.

  ## Evidence
  Error and stack trace:
  {{STACK_TRACE}}

  Relevant source:
  {{CODE}}

  What changed recently:
  {{RECENT_CHANGES}}

  Reproduction status:
  {{REPRO}}

  ## Task
  1. Restate what the trace proves, and separately what it only suggests. Be
     strict about the difference.
  2. Generate 4 competing hypotheses for the root cause. They must be genuinely
     different mechanisms, not restatements of each other. Include at least one
     that lies outside the frames shown in the trace — configuration, data,
     concurrency, environment, or a dependency version.
  3. For each hypothesis give:
     - Mechanism: how it would produce exactly this trace
     - Confirming evidence: what you would find if it were true
     - Disconfirming evidence: what you would find if it were false
     - Cheapest check: the fastest command, log line, or query that
       distinguishes it
  4. Rank the hypotheses by probability and say what drives your ranking.
  5. State the single check that eliminates the most hypotheses at once.

  ## Constraints
  - Do not propose code changes in this response.
  - Do not assume the trace's top frame is the cause; it is where the failure
    surfaced.
  - If the evidence is insufficient to rank, say which specific piece of
    evidence you need.
  - Never state a hypothesis without a disconfirming test. A hypothesis that
    cannot be wrong is not usable.
variables: ["STACK_TRACE", "CODE", "RECENT_CHANGES", "REPRO"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "This applies differential diagnosis. Models default to pattern-matching a trace to the most common cause and immediately writing a patch, which is fast when right and expensive when wrong. Requiring multiple competing mechanisms plus explicit disconfirming evidence for each converts guessing into hypothesis testing, and demanding one hypothesis from outside the visible frames counteracts the strong anchoring bias toward the top stack frame."
exampleOutput: |
  ## What the trace proves
  A nil map was written to inside `applyDefaults`. That is certain.

  ## What it only suggests
  That `applyDefaults` is at fault. The map is a parameter, so the nil could
  have originated anywhere upstream.

  ## Hypotheses

  **H1 — Caller passes a nil map on the config-reload path**
  Mechanism: reload constructs the struct with a literal, omitting the map.
  Confirming: the failure correlates with SIGHUP in the logs.
  Disconfirming: failures occur on instances that never reloaded.
  Cheapest check: grep reload timestamps against error timestamps.

  **H2 — Concurrent map write from the metrics goroutine [outside trace]**
  Mechanism: a second writer nils the reference during teardown.
  Confirming: reproducible under `-race`.
  Disconfirming: single-goroutine repro also fails.
  Cheapest check: run the suite with the race detector.

  ## Ranking
  H1, then H2. H1 explains the deploy-time clustering; H2 does not.

  ## Highest-information check
  Correlate error timestamps with reload events — it eliminates H1 or H3
  outright and constrains the rest.
tags: ["coding", "debugging", "root-cause", "incident-response"]
featured: false
publishDate: 2026-07-07
---

## Usage tips

Fill `RECENT_CHANGES` even when you are sure it is irrelevant. Deploy timing, config edits, and dependency bumps eliminate more hypotheses than any other input, and models weight them heavily when they are present.

Withholding the fix is the point. If you let the model patch on its first response, it commits to hypothesis one and every following turn rationalizes that commitment.

## Second turn

Once a check confirms a hypothesis, follow up with: "H2 confirmed by the race detector output below. Propose the minimal fix, the test that would have caught this, and one place the same pattern likely exists elsewhere." The diagnosis context makes that second response far more targeted than a cold fix request.
