---
title: "Positioning Statement and Headline Variants"
description: "Derives a positioning statement from customer pain and competitive alternatives, then generates headline variants that each test a different message hypothesis."
seoTitle: "Positioning and Headline Testing Prompt for Marketers"
seoDescription: "A marketing prompt that builds positioning from real alternatives and pain, then writes headline variants mapped to distinct, testable message hypotheses."
category: "Marketing"
prompt: |
  You are a positioning strategist. You write claims a customer could verify,
  not adjectives.

  ## Inputs
  Product: {{PRODUCT}}
  Specific customer segment: {{SEGMENT}}
  What they do today instead: {{ALTERNATIVE}}
  The pain that makes them look for something else: {{PAIN}}
  What the product does that the alternative cannot: {{DIFFERENTIATOR}}
  Proof available: {{PROOF}}

  ## Step 1 — Positioning statement
  Complete this template with no filler:
  "For {{SEGMENT}} who [trigger situation], {{PRODUCT}} is a [category] that
  [capability]. Unlike {{ALTERNATIVE}}, it [difference that matters]."
  Then state in one line why the category label you chose is the one the
  customer already uses in their own head.

  ## Step 2 — Message hypotheses
  Write 4 distinct hypotheses about what will move this segment. Each must
  bet on a different mechanism — for example: cost of the status quo, speed
  of getting to value, risk reduction, capability that was previously
  impossible, or social proof. Name the mechanism for each.

  ## Step 3 — Headlines
  For each hypothesis write 3 headlines, 12 words or fewer, plus one
  subheadline of up to 25 words. Label each with its hypothesis number.

  ## Step 4 — Test plan
  State which hypothesis you would test first and what result would falsify it.

  ## Constraints
  - No superlatives: never write "best", "leading", "revolutionary",
    "seamless", "cutting-edge", "game-changing", "powerful".
  - Every claim must be supportable by {{PROOF}}. Do not invent metrics,
    customer counts, or outcomes.
  - Do not describe features. Describe what becomes possible.
  - Do not write headlines that would work equally well for a competitor.
    If one would, replace it.
  - Avoid questions as headlines unless the question is one the segment
    actually asks out loud.
variables: ["PRODUCT", "SEGMENT", "ALTERNATIVE", "PAIN", "DIFFERENTIATOR", "PROOF"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "The structural trick is generating along hypotheses rather than along style. Asked for ten headlines, a model produces ten rewordings of one idea, which gives you nothing to learn from a test. Forcing four distinct persuasion mechanisms first means the variants differ in substance, so results are interpretable. The banned-words list is a negative constraint that removes the model's highest-probability marketing vocabulary and pushes it toward concrete claims."
exampleOutput: |
  ## Positioning
  For compliance teams at mid-market banks who are audited quarterly,
  Ledger is a control-evidence system that assembles audit packs from the
  systems of record. Unlike shared spreadsheets and screenshot folders, it
  produces evidence with an unbroken chain back to the source system.
  Category note: these teams already say "evidence collection", not "GRC
  platform" — using their words avoids a translation step.

  ## Hypotheses
  H1 — Cost of status quo: audit prep consumes weeks of senior time
  H2 — Risk reduction: broken evidence chains cause findings
  H3 — Speed to value: first audit pack in one cycle, not one year
  H4 — Previously impossible: evidence that regenerates when data changes

  ## Headlines
  H1: "Stop rebuilding your audit pack every quarter"
  H1: "Audit prep without the two-week fire drill"
  H2: "Evidence auditors can trace to the source system"
  H4: "Audit packs that update themselves when the data does"

  ## Test plan
  Test H1 first — it targets the pain the segment volunteers unprompted.
  Falsified if it does not beat the current control on qualified signups.
tags: ["marketing", "positioning", "copywriting", "messaging"]
featured: false
publishDate: 2026-07-01
---

## Usage tips

`ALTERNATIVE` is the variable most often filled in wrong. The real alternative is usually a spreadsheet, a contractor, or doing nothing — not the competitor you benchmark against. Positioning against the wrong alternative produces copy that argues with people who are not in the room.

If the model still returns headlines that would fit a competitor, feed them back with: "Which of these would a competitor also be able to run truthfully? Replace those." That single follow-up usually removes half the list.

## On the proof field

Leave `PROOF` empty and the model invents outcomes. Fill it with what you can actually substantiate — a case study, a benchmark you ran, a customer quote — and the claims stay inside the boundary of things you can defend.
