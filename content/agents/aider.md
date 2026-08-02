---
name: "Aider"
tagline: "Open-source terminal pair programmer that maps your repository and commits every change to git."
description: "Aider is a command-line coding agent that builds a repository map, sends only the relevant context to the model, and commits each accepted edit as its own git commit. It is model-agnostic, so you can point it at a frontier API or a locally hosted open-weights model. The git-per-edit design makes rollback trivial."
seoTitle: "Aider Review: Open-Source Terminal Coding Agent"
seoDescription: "Aider is an open-source CLI coding agent with a repo map and git-per-edit commits. Model flexibility, local LLM support, workflow, and the trade-offs involved."
vendor: "Open source"
website: "https://aider.chat"
docs: "https://aider.chat/docs/"
category: "Coding Agents"
runtime: "terminal"
mcpSupport: false
autonomy: "assisted"
pricing: "open-source"
priceNote: "Free and open source; you pay only for whatever model API you point it at."
rating: 4.2
features:
  - "Repository map for context"
  - "Automatic git commit per edit"
  - "Bring-your-own model"
  - "Local open-weights support"
  - "Voice and image input"
  - "Linting and test hooks"
pros:
  - "Every edit lands as its own commit, so undoing a bad suggestion is a single git command"
  - "Model-agnostic design avoids vendor lock-in and works with locally hosted models"
  - "Repository map keeps context costs down on projects too large to send wholesale"
cons:
  - "Assisted rather than autonomous — it expects you to steer file selection and sequencing"
  - "No first-party MCP integration, so external tools need separate wiring"
  - "Quality tracks the model you choose, which makes results inconsistent across setups"
bestFor: "Developers who want a scriptable, model-agnostic coding agent with git-native safety and no vendor lock-in."
relatedArticle: "best-ai-coding-assistants"
featured: false
updatedDate: 2026-06-28
---

Aider's most useful idea is the repository map. Rather than stuffing whole files into context, it builds a condensed structural view — signatures, class names, call relationships — and uses it to decide what actually needs to be sent. On a large project that is the difference between a workable prompt and an expensive one.

The second idea is git as the undo stack. Each accepted change is committed with a generated message, so the transcript of an agent session is also a reviewable history. If the third edit was wrong, you reset to the second.

Where it fits: engineers who want control over model choice and cost, teams evaluating [open-source LLMs](/articles/top-open-source-llms/) for coding work, and anyone who needs a coding agent that runs entirely on self-hosted infrastructure. It asks more of the operator than a hosted product does, and rewards that with transparency.
