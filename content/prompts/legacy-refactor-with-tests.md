---
title: "Legacy Refactor With a Test Harness First"
description: "Forces the model to characterize existing behavior with tests before touching any code, so refactors preserve behavior instead of quietly changing it."
seoTitle: "Legacy Code Refactor Prompt: Tests Before Changes"
seoDescription: "A refactoring prompt that writes characterization tests first, then refactors in small verified steps. Prevents silent behavior changes in legacy code."
category: "Coding"
prompt: |
  You are refactoring legacy code. The existing behavior — including its
  quirks — is the specification. You may not change it.

  ## Code
  {{CODE}}

  ## Stack and test framework
  {{STACK}}

  ## Refactor goal
  {{GOAL}}

  ## Procedure — follow in order, do not skip ahead

  ### Step 1: Behavior inventory
  List every observable behavior of this code: return values by input class,
  side effects, exceptions thrown, mutations of arguments, and I/O. Include
  behaviors that look like bugs. Mark those [SUSPECTED BUG] but do not fix them.

  ### Step 2: Characterization tests
  Write tests in {{STACK}} that pin the behaviors from step 1 — including the
  suspected bugs. These tests must pass against the current code unchanged.
  Cover: typical input, empty input, boundary values, and each error path.

  ### Step 3: Refactor plan
  Break {{GOAL}} into an ordered list of steps, each one small enough that the
  step 2 tests still pass afterward. State what each step changes and what
  could break.

  ### Step 4: Execute step one only
  Apply the first step from your plan. Show the resulting code. Then state
  which characterization tests exercise the changed lines.

  ## Constraints
  - Do not change observable behavior, including behavior you believe is wrong.
  - Do not rename anything in the public interface.
  - Do not introduce a new dependency without saying why no existing one works.
  - Do not perform steps 2, 3 or 4 out of order.
  - If the code has a behavior you cannot determine without running it, say so
    explicitly instead of guessing.
variables: ["CODE", "STACK", "GOAL"]
models: ["Claude", "GPT-4 class"]
notes: "This is task decomposition with a verification gate. Asked to refactor directly, models produce cleaner code that behaves differently — usually by 'fixing' edge cases callers depend on. Requiring a behavior inventory and characterization tests first creates an executable definition of correctness before any edit, and the [SUSPECTED BUG] marker gives the model somewhere to put its improvement instinct without acting on it."
exampleOutput: |
  ## Step 1: Behavior inventory
  - Returns `None` for empty input (not an empty list)
  - Mutates the `config` dict passed in — adds a `_normalized` key
  - Raises `KeyError`, not `ValueError`, on a missing `region` field
  - [SUSPECTED BUG] Whitespace-only names pass validation and are stored as-is

  ## Step 2: Characterization tests
  ```python
  def test_empty_input_returns_none():
      assert normalize([], {}) is None

  def test_mutates_config_argument():
      cfg = {}
      normalize([{"region": "eu"}], cfg)
      assert "_normalized" in cfg  # pins existing behavior

  def test_whitespace_name_is_accepted():
      # Characterizes suspected bug; do not fix in this refactor.
      out = normalize([{"region": "eu", "name": "   "}], {})
      assert out[0]["name"] == "   "
  ```

  ## Step 3: Refactor plan
  1. Extract the region lookup into a helper. Risk: none, pure move.
  2. Replace nested conditionals with early returns. Risk: alters which
     branch handles the missing-region case.
tags: ["coding", "refactoring", "testing", "legacy-code"]
featured: false
publishDate: 2026-06-22
---

## Usage tips

Run the generated tests against the untouched original before letting the model proceed. Any failure means the behavior inventory was wrong, and continuing would refactor against a false specification.

Keep `CODE` under a few hundred lines. Behavior inventories get shallow on large inputs, and a shallow inventory is worse than none because it looks complete.

## Why the bug marker matters

Without an explicit place to record suspected bugs, models fix them inline and describe it as cleanup. That produces a diff mixing behavior changes with structural ones, which is exactly the diff nobody can review. Capturing bugs as annotations turns them into a follow-up ticket instead.
