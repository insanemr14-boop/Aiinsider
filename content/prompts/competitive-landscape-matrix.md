---
title: "Competitive Landscape Matrix"
description: "Builds a comparison matrix across competitors using criteria derived from buyer needs, with explicit unknowns rather than plausible-sounding filler in empty cells."
seoTitle: "Competitive Analysis Matrix Prompt for Product Teams"
seoDescription: "A research prompt that derives comparison criteria from buyer needs, fills a competitor matrix, and marks unverified cells as unknown instead of guessing."
category: "Research"
prompt: |
  You are a product analyst building a competitive matrix that a team will use
  to make a real decision. An unknown cell is useful; a confidently wrong cell
  destroys trust in the whole table.

  ## Inputs
  Category: {{CATEGORY}}
  Competitors to compare: {{COMPETITORS}}
  Buyer and their situation: {{BUYER_PROFILE}}
  Source material: {{SOURCES}}

  ## Step 1 — Derive criteria
  From {{BUYER_PROFILE}}, derive 6-8 comparison criteria. Each must be a
  decision a buyer would actually change their mind over. For each criterion,
  state the buyer need it serves in one line.
  Reject criteria that are: universally true of the category, unmeasurable, or
  vendor marketing language.

  ## Step 2 — Fill the matrix
  Produce a Markdown table: rows are criteria, columns are {{COMPETITORS}}.
  Each cell uses one of:
  - A specific factual statement, followed by [S#]
  - `UNKNOWN` where the sources do not say
  - `N/A` where the criterion does not apply to that product

  ## Step 3 — Read the matrix
  Write four short sections:
  - Where the products genuinely differ (ignore criteria where all are similar)
  - Which competitor wins for this specific buyer, and on which criteria
  - The two UNKNOWN cells that most affect the decision, and how to resolve them
  - One criterion the buyer has probably not considered but should

  ## Constraints
  - Never estimate pricing, performance figures, or dates. If the sources do
    not state it, the cell is UNKNOWN.
  - Do not write a cell in vendor marketing language. Describe capability
    behavior, not positioning.
  - Do not declare an overall winner independent of {{BUYER_PROFILE}}.
  - It is acceptable for a column to be mostly UNKNOWN. Say so plainly rather
    than padding it.
variables: ["CATEGORY", "COMPETITORS", "BUYER_PROFILE", "SOURCES"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "The key move is deriving criteria from the buyer before filling any cells. Ask for a comparison directly and the model reuses generic category dimensions that flatter whichever product it knows best. The UNKNOWN token is a structured escape hatch: a table cell is a strong completion pressure, and without a legal way to leave one empty the model fills it with plausible invention. This is the same failure mode as forced-format hallucination in extraction tasks."
exampleOutput: |
  ## Criteria
  1. Self-hosting support — buyer is in a regulated industry [need: data residency]
  2. Time to first working workflow — buyer has no dedicated platform team
  3. Audit trail granularity — buyer must evidence decisions to a regulator

  ## Matrix
  | Criterion | Product A | Product B | Product C |
  |---|---|---|---|
  | Self-hosting | Docker deployment documented [S1] | Cloud only [S2] | UNKNOWN |
  | Time to first workflow | UNKNOWN | Templates for common cases [S2] | UNKNOWN |
  | Audit trail | Per-step logs with inputs [S1] | Run-level logs only [S3] | UNKNOWN |

  ## Where they differ
  Only on deployment model and audit granularity. Everything else is
  comparable and should not drive the decision.

  ## Decisive unknowns
  Product C is unevaluable from these sources — three of three cells unknown.
  Either get a trial or drop it from the shortlist.
tags: ["research", "competitive-analysis", "product", "decision-making"]
featured: false
publishDate: 2026-06-27
---

## Usage tips

Paste real source material — documentation pages, pricing pages, changelogs — rather than relying on model memory. Competitive facts age fast, and a matrix built from training data is a matrix of last year's products.

If more than about a third of the cells come back UNKNOWN, that is the finding. It means the research is not done yet, and the honest output is more valuable than a complete-looking table.

## Extending it

Add a `WEIGHT` column where the buyer rates each criterion 1-5, then ask for a weighted read of the matrix in step 3. Making the weights explicit usually surfaces internal disagreement about priorities before the tool decision is made — which is the argument worth having first.
