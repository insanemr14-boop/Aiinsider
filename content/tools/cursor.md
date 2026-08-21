---
name: "Cursor"
tagline: "A VS Code fork rebuilt around AI editing, with codebase-wide context and multi-file agents"
description: "Cursor is an AI-native code editor forked from VS Code, adding codebase indexing, inline editing, and an agent mode that plans and applies multi-file changes. It keeps the VS Code extension ecosystem while replacing the editing model."
seoTitle: "Cursor Review: AI Code Editor Features, Pricing and Limits"
seoDescription: "A review of Cursor: codebase indexing, agent mode, multi-file edits, VS Code compatibility, pricing tier shape, and where its context handling breaks down."
vendor: "Anysphere"
website: "https://cursor.com"
docs: "https://docs.cursor.com"
category: "Coding"
pricing: "freemium"
priceNote: "Free tier; paid individual and team plans; usage-based overages"
rating: 4.5
features: ["Codebase indexing", "Agent mode", "Multi-file edits", "Inline edit", "Tab completion", "Rules files", "Model choice"]
pros:
  - "Codebase-wide retrieval means suggestions reflect your actual conventions, not generic patterns"
  - "Agent mode handles multi-file refactors end to end with a reviewable diff"
  - "Full VS Code extension and keybinding compatibility keeps migration cost near zero"
  - "Model selection is exposed, so you can route cheap tasks and expensive reasoning differently"
cons:
  - "Usage-based pricing above the included quota makes monthly cost hard to forecast"
  - "Index quality degrades on very large monorepos, producing confidently wrong context"
  - "Rapid release cadence occasionally ships regressions into a tool people depend on daily"
bestFor: "Professional developers working in established codebases who want AI editing without leaving a VS Code-compatible environment."
relatedArticle: "cursor-vs-windsurf"
featured: true
updatedDate: 2026-07-25
---

Cursor's insight was that AI coding assistance is an editor problem, not a plugin problem. Autocomplete extensions bolt suggestions onto an interface designed for typing; Cursor rebuilt the interaction model around describing a change and reviewing a diff.

## How the codebase index changes the output

The index is what separates Cursor from a chat window with your file pasted into it. Before generating, the editor retrieves the files most likely to matter — the module you are editing, its tests, the interfaces it implements, recent related changes. The model therefore writes in your idioms: your error-handling convention, your naming, your preferred way of wiring dependencies, rather than the average of everything in its training data.

On a greenfield project this is a modest convenience. On a mature repository with ten years of accumulated convention, it is the whole product. The difference shows up within an hour of real use: generic assistants suggest code that works and looks foreign, Cursor suggests code that a reviewer would not flag.

## The three modes, and when each is right

Tab completion is the low-stakes surface — inline, multi-line, and aware of what you just edited. It is the mode that produces the smallest wins most reliably.

Inline edit (Cmd+K) is for a scoped change you can describe in a sentence: convert this to async, extract this into a helper, add the missing error branch. Because the scope is a selection, the blast radius is bounded and the review is trivial.

Agent mode is where the leverage and the risk both live. It plans across files, writes, runs commands, and iterates. Given a well-specified task with a fast test loop, it produces genuinely reviewable work. Given a vague one, it produces a large diff touching files you did not expect, and the review cost exceeds what you saved.

The practical rule: the more autonomy you grant, the more precisely the task must be specified. Agent mode rewards a written spec and punishes a hunch.

## Where retrieval quality falls off

The failure mode worth internalising is silent. On very large monorepos, retrieval starts surfacing the wrong context — a similarly named module from an unrelated service, an old implementation that still compiles. The model then generates a confident, coherent change built on a false premise. Nothing errors. The diff looks plausible.

Mitigations that work: reference files explicitly with `@` rather than trusting automatic retrieval on unfamiliar code, keep `.cursorrules` current so conventions are stated rather than inferred, and treat any agent diff that touches more files than you expected as a signal to re-read rather than approve.

## What it actually costs

The headline seat price is not the number to plan around. Cursor's pricing carries a usage-based component, and agent mode consumes it quickly — long-context requests against a large repository are expensive, and a developer who lives in agent mode can post several times the base seat cost.

This is not a criticism of the pricing, which is honest about the mechanism, but it is a budgeting trap. Run a two-week pilot with the engineers most likely to be heavy users, read the actual usage numbers, and forecast from those. Teams that extrapolate from the seat price get an unpleasant surprise in month two.

## Who should look elsewhere

Developers who are happy in their current editor and want a modest lift will get most of the benefit from [GitHub Copilot](/tools/github-copilot/) at lower cost and zero migration. Teams that work primarily in the terminal, or that want the agent driving the test runner rather than the editor, will find [Claude Code](/tools/claude-code/) a better shape. Anyone whose constraint is regulatory — code that cannot leave the building — needs a self-hosted model, which rules out the hosted editors entirely.

For the direct comparison against its closest competitor, see our [Cursor vs Windsurf](/articles/cursor-vs-windsurf/) breakdown.
