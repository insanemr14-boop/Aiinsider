---
title: "Rigorous Pull Request Review"
description: "A code review prompt that separates correctness bugs from style opinions, rates severity, and refuses to comment on anything outside the diff."
seoTitle: "AI Pull Request Review Prompt for Code Diffs"
seoDescription: "A structured code review prompt that ranks findings by severity, separates bugs from preferences, and stays scoped to the diff. Works on any language."
category: "Coding"
prompt: |
  You are a senior engineer reviewing a pull request. You are thorough about
  correctness and restrained about taste.

  ## Context
  Language and framework: {{STACK}}
  What this change is supposed to do: {{INTENT}}
  Relevant conventions or constraints: {{CONVENTIONS}}

  ## Diff
  {{DIFF}}

  ## Review procedure
  Work through these passes in order and report each separately.

  1. INTENT CHECK — Does the diff do what {{INTENT}} says? Name any behavior
     the diff introduces that the stated intent does not cover.
  2. CORRECTNESS — Logic errors, off-by-one, null and empty cases, incorrect
     error handling, race conditions, resource leaks, unhandled failure paths.
  3. INTERFACE — Breaking changes to public signatures, backward compatibility,
     migration needs.
  4. SECURITY — Injection surfaces, authorization gaps, secret handling, unsafe
     deserialization, unvalidated input crossing a trust boundary.
  5. TESTS — What behavior in this diff is untested? Name specific missing cases.
  6. STYLE — Only violations of {{CONVENTIONS}}. Nothing else.

  ## Severity scale
  Tag every finding: BLOCKER, MAJOR, MINOR, or NIT.
  BLOCKER means the change is wrong or unsafe to merge.
  NIT means you would not mention it if you were busy.

  ## Constraints
  - Cite a file and line for every finding. No finding without a location.
  - Do not comment on code outside the diff unless the diff breaks it — and if
    it does, say exactly how.
  - Do not suggest refactors that are not required by this change.
  - Do not restate what the code does. Assume the author knows.
  - If a pass finds nothing, write "No findings." and move on. Do not pad.
  - End with one line: APPROVE, APPROVE WITH COMMENTS, or REQUEST CHANGES.
variables: ["STACK", "INTENT", "CONVENTIONS", "DIFF"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "The core technique is decomposition into ordered passes, which stops the model from mixing a naming quibble into the same list as a race condition. The severity taxonomy forces a judgment call on every finding, which is what makes the output triageable. The 'no finding without a file and line' rule is a grounding constraint — it makes vague hallucinated concerns structurally impossible to express, since a fabricated issue has no location to cite."
exampleOutput: |
  ## 1. Intent check
  The diff also changes the default retry count from 3 to 5, which the stated
  intent does not mention. Intentional?

  ## 2. Correctness
  - **MAJOR** `sync/worker.go:142` — The error from `tx.Commit()` is assigned
    to `_`. A failed commit is silently treated as success.
  - **MINOR** `sync/worker.go:88` — `items[0]` is read before the length check
    on line 91. Empty input panics.

  ## 3. Interface
  No findings.

  ## 4. Security
  - **BLOCKER** `api/handler.go:57` — `orgID` comes from the request body, not
    the session. Any authenticated user can read another org's records.

  ## 5. Tests
  No test covers the empty-input path at `worker.go:88` or the cross-org case
  at `handler.go:57`.

  ## 6. Style
  No findings.

  **REQUEST CHANGES**
tags: ["coding", "code-review", "pull-request", "quality"]
featured: true
publishDate: 2026-07-09
---

## Usage tips

Paste the unified diff, not whole files. Reviews degrade quickly when the model has to locate the change itself, and full-file context invites unrelated refactor suggestions.

`CONVENTIONS` is the highest-leverage variable. Leave it empty and pass 6 fills with generic style opinions; fill it with your actual linter rules and naming conventions and pass 6 becomes useful.

## Adapting it

For security-critical services, promote pass 4 to run first and require that it enumerate trust boundaries crossed by the diff before listing findings. For a team new to a codebase, add a pass 0 asking the model to state its understanding of the affected module — a wrong summary there tells you the rest of the review is unreliable.
