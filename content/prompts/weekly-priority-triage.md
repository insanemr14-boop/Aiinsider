---
title: "Weekly Priority Triage Under Real Constraints"
description: "Sorts a task list against stated goals and a real hours budget, forcing explicit cuts and naming the cost of each thing that does not get done."
seoTitle: "Weekly Planning Prompt That Forces Real Trade-Offs"
seoDescription: "A prioritization prompt that fits a task list into an actual hours budget, requires explicit cuts, and names the consequence of everything you drop."
category: "Productivity"
prompt: |
  You are a chief of staff. Your job is to make the trade-offs visible, not to
  find a clever way to fit everything in.

  ## Inputs
  Goals this quarter, in priority order:
  {{GOALS}}

  Task list (everything currently on the plate):
  {{TASKS}}

  Realistic uncommitted hours this week: {{HOURS}}
  Fixed commitments already scheduled: {{FIXED_COMMITMENTS}}
  Hard deadlines: {{DEADLINES}}

  ## Task

  ### 1. Classify
  For every task, assign exactly one:
  - ADVANCES: moves a stated goal forward materially
  - MAINTAINS: keeps something from degrading, advances nothing
  - EXTERNAL: someone else's priority you have accepted
  - UNCLEAR: you cannot tell what it serves from the description
  Say which goal an ADVANCES task serves. A task that serves no listed goal
  cannot be ADVANCES, however urgent it feels.

  ### 2. Estimate
  Give each task an hours estimate. Where the description is too vague to
  estimate, mark it NEEDS SCOPING and treat scoping as a 15-minute task.

  ### 3. Fit
  Fill {{HOURS}} with tasks in priority order. Stop when the budget is gone.
  Show the running total.

  ### 4. The cut list
  Everything below the line. For each, state in one line what happens if it
  does not get done this week. Be specific: "nothing" is a valid and useful
  answer.

  ### 5. One question
  Ask the single question whose answer would most change this plan.

  ## Constraints
  - Do not exceed {{HOURS}}. Do not suggest working longer.
  - Do not propose delegating unless the input names someone to delegate to.
  - Do not recommend a productivity system, tool, or technique.
  - Reserve at least 20% of {{HOURS}} as unallocated. Weeks do not go to plan.
  - If {{DEADLINES}} cannot all be met within {{HOURS}}, say so in the first
    line of your response, before anything else.
variables: ["GOALS", "TASKS", "HOURS", "FIXED_COMMITMENTS", "DEADLINES"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "The constraint that makes this work is a hard hours budget with mandatory slack. Without a numeric ceiling, models produce prioritized lists where everything still appears doable, which is the failure mode of every prioritization framework applied loosely. Requiring a consequence statement for each cut item converts an implicit decision into an explicit one — and the items whose consequence is genuinely 'nothing' are the finding worth acting on."
exampleOutput: |
  Two of three deadlines fit in 22 hours. The compliance review does not.
  Decide now whether to move it or drop something below.

  ### Classification
  | Task | Class | Serves | Est. |
  |---|---|---|---|
  | Finish migration runbook | ADVANCES | Goal 1 | 4h |
  | Reply to vendor security questionnaire | EXTERNAL | — | 3h |
  | Refactor the config loader | MAINTAINS | — | 6h |
  | "Look into the caching thing" | UNCLEAR / NEEDS SCOPING | — | 0.25h |

  ### Fit (budget 22h, 4.4h reserved)
  1. Migration runbook — 4h (running total 4h)
  2. Compliance review prep — 6h (10h)
  3. Vendor questionnaire — 3h (13h)
  4. Scope the caching item — 0.25h (13.25h)
  Line drawn at 17.6h allocated.

  ### Cut list
  - Refactor the config loader — nothing happens this week. It has been
    deferred four weeks running, which suggests it is not actually needed.
  - Team offsite agenda — the offsite is in three weeks; one week of slip
    costs nothing.

  ### One question
  Is the compliance review deadline externally imposed or internally chosen?
  If internal, the whole week fits comfortably.
tags: ["productivity", "prioritization", "planning", "decision-making"]
featured: false
publishDate: 2026-06-30
---

## Usage tips

Be honest about `HOURS`. A forty-hour week has perhaps twenty uncommitted hours once meetings, reviews, and interruptions are removed. Entering forty produces a plan that fails by Wednesday and teaches you nothing.

Dump the task list raw, including the vague ones. The UNCLEAR classification is diagnostic — a list where a third of the items cannot be tied to a goal is telling you something about the quarter, not about the week.

## Running it weekly

Keep the previous week's cut list and paste it in with the new tasks. Items that appear on the cut list three weeks running with "nothing happens" as the consequence should be deleted rather than carried, and seeing them repeat is what makes that easy to admit.
