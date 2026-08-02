---
title: "Agent Trace Failure Analysis"
description: "Reads an agent execution trace to find the first step where reasoning went wrong, then maps the failure to a class and a specific prompt or tool fix."
seoTitle: "Debug AI Agent Runs From Execution Traces"
seoDescription: "A prompt that analyzes agent traces to locate the first divergent step, classify the failure mode, and propose a targeted prompt, tool, or scaffolding fix."
category: "Agents"
prompt: |
  You are debugging an autonomous agent run. Your goal is to find the earliest
  point of divergence, not the most visible symptom.

  ## Inputs
  Agent system prompt:
  {{SYSTEM_PROMPT}}

  Tools the agent had:
  {{TOOL_DEFINITIONS}}

  Execution trace (steps, tool calls, arguments, results, model reasoning):
  {{TRACE}}

  What should have happened:
  {{EXPECTED_BEHAVIOR}}

  ## Analysis

  ### 1. Divergence point
  Identify the first step where the run departed from {{EXPECTED_BEHAVIOR}}.
  Quote that step. Everything after it is downstream consequence, not
  independent evidence — say so explicitly.

  ### 2. Failure class
  Assign one primary class:
  - MISREAD_TASK: misinterpreted the request from the start
  - TOOL_SELECTION: chose the wrong tool for a correctly understood goal
  - TOOL_ARGUMENTS: right tool, malformed or wrong arguments
  - RESULT_INTERPRETATION: misread what a tool returned
  - PREMATURE_STOP: concluded before the goal was met
  - NO_STOP: kept going past a satisfied goal, or looped
  - CONTEXT_LOSS: forgot or contradicted something established earlier
  - HALLUCINATED_CAPABILITY: assumed a tool or permission it did not have
  - INJECTION: followed instructions embedded in tool output or user data

  ### 3. Cause attribution
  Attribute the failure to exactly one layer, and justify it:
  - PROMPT: the system prompt did not specify this case
  - TOOL_DESIGN: the tool description or schema misled the model
  - SCAFFOLDING: no retry, guard, validation, or state mechanism existed
  - MODEL: the specification was clear and the model still failed

  ### 4. Fix
  Propose the minimal change at that layer. If PROMPT, write the exact text to
  add and say where. If TOOL_DESIGN, write the revised description or schema.
  If SCAFFOLDING, describe the check and where it runs in the loop.

  ### 5. Regression test
  Write the test case that would catch this failure: input, assertion, and
  what a pass looks like.

  ## Constraints
  - Do not attribute to MODEL unless you can show the prompt and tools
    unambiguously specified the correct behavior. This is the last resort.
  - Do not propose adding a rule that duplicates one already in
    {{SYSTEM_PROMPT}}. Quote the existing rule and explain why it failed instead.
  - Do not suggest a larger model as a fix.
  - Do not analyze steps before the divergence point except to establish that
    they were correct.
variables: ["SYSTEM_PROMPT", "TOOL_DEFINITIONS", "TRACE", "EXPECTED_BEHAVIOR"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "Two constraints do the heavy lifting. Anchoring on the earliest divergence prevents the common error of debugging the loudest downstream symptom, which in agent traces is usually several steps removed from the cause. Making MODEL the last-resort attribution, gated on proof that the specification was unambiguous, counteracts the reflex to blame capability — most agent failures are underspecified prompts or misleading tool descriptions, and both are fixable."
exampleOutput: |
  ### 1. Divergence point
  Step 4: `search_orders(customer_id="unknown")`. The agent had the email
  address but never resolved it to an ID. Steps 5-11 are consequences of this
  and carry no independent diagnostic weight.

  ### 2. Failure class
  HALLUCINATED_CAPABILITY — the agent assumed `search_orders` accepts a
  sentinel value and would fall back to a fuzzy lookup. It does not.

  ### 3. Cause attribution
  TOOL_DESIGN. The description reads "search for a customer's orders", which
  implies flexible lookup. The schema requires an exact `customer_id`, and
  nothing states that a lookup step must come first.

  ### 4. Fix
  Revise the tool description to: "Return orders for one customer. Requires an
  exact customer_id from `lookup_customer`. Does not accept emails, names, or
  placeholders; unknown IDs return an empty list, not an error."
  The empty-list detail matters — the silent empty result is why the agent
  never noticed the mistake.

  ### 5. Regression test
  Input: a request identifying the customer by email only.
  Assertion: `lookup_customer` is called before `search_orders`, and
  `search_orders` never receives a non-ID value.
  Pass: the trace shows the lookup, then the search with a resolved ID.
tags: ["agents", "debugging", "evaluation", "observability"]
featured: false
publishDate: 2026-07-23
---

## Usage tips

Paste the full trace including the model's own reasoning tokens if your framework exposes them. The reasoning text is often where the wrong assumption is stated plainly, several steps before it produces a visible bad call.

Keep `EXPECTED_BEHAVIOR` behavioral rather than aspirational. "Should have resolved the email to a customer ID before searching" gives the analysis something to compare against. "Should have handled it correctly" does not.

## Building an eval set from this

Every run of this prompt ends with a regression test. Collect them. After a few dozen failures you have an eval suite derived entirely from real production breakage, which is a far better signal than synthetic benchmarks when you change a prompt, swap a model, or edit a tool schema.
