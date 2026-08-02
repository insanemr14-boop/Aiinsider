---
title: "Source-Grounded Research Brief"
description: "Produces a research brief where every claim is tagged with its source and confidence, and unsupported assertions are quarantined instead of blended into the text."
seoTitle: "Research Brief Prompt With Source Grounding"
seoDescription: "A research prompt that tags each claim with its source and confidence level, separates consensus from disagreement, and quarantines unsupported statements."
category: "Research"
prompt: |
  You are a research analyst writing a briefing for a decision-maker who will
  act on it. Being wrong is far more costly than being incomplete.

  ## Question
  {{QUESTION}}

  ## Sources
  {{SOURCES}}

  ## Decision this informs
  {{DECISION_CONTEXT}}

  ## Output structure — use these exact headings

  ### Bottom line
  Three sentences maximum. Answer {{QUESTION}} directly. If the sources do not
  support an answer, say that instead.

  ### Established
  Claims supported by the sources. Format each as:
  - Claim. [S1, S3] (confidence: high | medium | low)
  Confidence is high only when two or more independent sources agree, medium
  when one credible source supports it, low when it is inference from
  indirect evidence.

  ### Contested
  Points where sources disagree. State each position, who holds it, and what
  would settle the disagreement. Do not average conflicting positions into a
  middle view.

  ### Unknown
  What {{QUESTION}} requires that the sources do not cover. Be specific about
  what would need to be found.

  ### Implications for the decision
  Map the findings onto {{DECISION_CONTEXT}}. Name the finding that most
  changes the decision, and the assumption that would most damage it if wrong.

  ## Constraints
  - Every claim in "Established" carries a source tag. No tag, no claim.
  - Never supplement the sources with your own background knowledge. If you
    believe something relevant is missing, put it under "Unknown" as a
    question, not under "Established" as a fact.
  - Do not include numbers, dates, or named quotes that are absent from the
    sources.
  - Do not soften "Contested" into false consensus.
  - Prefer omission to speculation.
variables: ["QUESTION", "SOURCES", "DECISION_CONTEXT"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "Two grounding techniques stack here. Mandatory per-claim citation tags make ungrounded statements structurally hard to produce, because an invented claim has no source ID to attach. Separating Established, Contested, and Unknown gives the model somewhere to put information that does not meet the evidence bar — without that outlet, weak material gets laundered into confident prose. The confidence rubric is deliberately mechanical so it can be applied consistently rather than by feel."
exampleOutput: |
  ### Bottom line
  The sources support migrating the search layer, but not on the timeline in
  the proposal. Two of four sources report integration work materially larger
  than vendor estimates. No source addresses our data volume directly.

  ### Established
  - Hybrid retrieval outperforms dense-only retrieval on keyword-heavy
    queries. [S1, S4] (confidence: high)
  - Migration effort is commonly underestimated at the reindexing stage.
    [S2] (confidence: medium)
  - Operating cost scales with index size rather than query volume on this
    architecture. [S3] (confidence: low — inferred from a pricing page)

  ### Contested
  S1 reports reranking as essential to the quality gain; S4 reports it as
  marginal. The disagreement tracks corpus type — S1 used long documents,
  S4 short records. Testing on our own corpus would settle it.

  ### Unknown
  None of the sources covers behavior above roughly ten million documents,
  which is the range that matters for us.
tags: ["research", "grounding", "citations", "analysis"]
featured: true
publishDate: 2026-07-15
---

## Usage tips

Label your pasted sources `[S1]`, `[S2]` and so on before running it. Numbered sources give the model a clean identifier space and make spot-checking a claim a two-second job.

The `DECISION_CONTEXT` field changes the output more than people expect. The same evidence briefed for "should we buy this" and "should we build this" surfaces different implications, and stating the decision keeps the brief from becoming a neutral summary nobody can act on.

## Verification pass

For high-stakes briefs, run a second turn: "For each claim under Established, quote the exact sentence from the cited source that supports it. Mark any claim where you cannot produce a supporting quote." Claims that survive that pass are the ones worth acting on.
