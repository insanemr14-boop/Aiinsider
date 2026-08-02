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

The codebase index is what makes that work. Because the editor retrieves relevant files before generating, suggestions inherit your existing patterns rather than generic idioms from training data. On a mature repository the difference is obvious within an hour.

Two caveats matter for team adoption. First, retrieval quality falls off on very large monorepos, and the failure mode is silent — you get a confident change built on the wrong context. Second, the usage-based component of pricing means a team of heavy agent users can post a bill several times the headline seat cost. Instrument usage during the pilot and forecast from real numbers.
