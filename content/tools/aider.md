---
name: "Aider"
tagline: "Open-source terminal pair programmer that edits your repo and commits its own changes"
description: "Aider is an open-source command-line coding assistant that maps your repository, applies edits as git commits and works with almost any model backend. It is the reference tool for developers who want agentic coding without vendor lock-in."
seoTitle: "Aider Review: Open-Source Terminal AI Coding Assistant"
seoDescription: "A review of Aider: repo mapping, git-native commits, bring-your-own-model support, cost control, and the rough edges of an open-source coding agent."
vendor: "Aider (open source)"
website: "https://aider.chat"
docs: "https://aider.chat/docs/"
category: "Coding"
pricing: "open-source"
priceNote: "Free and open source; you pay only for the model API you connect"
rating: 4.0
features: ["Git-native commits", "Repository map", "Bring your own model", "Local model support", "Voice input", "Watch mode"]
pros:
  - "Every change lands as a git commit with a message, so review and rollback use tools you already trust"
  - "Model-agnostic — connect a frontier API, a cheap provider or a locally hosted open-weight model"
  - "No subscription and no seat licensing; cost is exactly your token spend"
  - "Repository map gives the model structural context without uploading the whole codebase"
cons:
  - "Command-line only, with a learning curve that deters developers who expect a GUI"
  - "You own configuration, model routing and cost control — there is no support contract"
  - "Multi-file agentic work needs more hand-holding than commercial AI editors"
bestFor: "Developers comfortable in the terminal who want an auditable, model-agnostic coding assistant with no vendor relationship."
relatedArticle: "best-ai-coding-assistants"
featured: false
updatedDate: 2026-06-28
---

Aider is what a coding agent looks like when nobody is trying to sell you a subscription. It is a terminal program, it is open source, it speaks to whatever model you point it at, and it treats Git as the substrate rather than as an afterthought.

## Git as the interface

Every change Aider makes lands as a commit. Not a staged diff waiting for approval, not a proposal in a side panel — a commit, with a message describing what it did.

This sounds like a small design choice and is actually the central one. It means undo is `git reset`, review is `git diff`, and history is the audit log. It means an agent session that goes wrong is recoverable with tools you already trust, rather than with the tool's own bookkeeping. And it means Aider composes with everything downstream: your hooks, your CI, your branch protection.

Teams that have been burned by agents making sweeping unreviewable changes tend to find this reassuring in a way that is hard to appreciate before the first bad session.

## Model independence is the other half

Aider is not tied to a vendor. Connect it to a frontier API, a cheaper mid-tier model, or a local model served on your own hardware, and switch when the economics or the requirements change.

Two situations make this decisive. The first is regulated or sensitive work, where source code cannot leave the network — Aider plus a self-hosted model is one of the few genuinely viable agentic options. The second is cost control: routing routine mechanical edits to a cheap model and reserving an expensive one for the hard problems is straightforward here and impossible in a closed product.

The repository map deserves a mention too. Rather than dumping files into context, Aider builds a compact structural summary of the codebase and sends that, which keeps token use sane on repositories large enough that naive context-stuffing would be unaffordable.

## The cost of no product team

The interface is a terminal. There is no diff viewer, no click-to-approve, no visual indication of what the agent is about to touch beyond what it tells you. For developers who live in the shell this is fine or better than fine. For everyone else it is a wall.

Configuration is likewise a text file and a set of flags rather than a settings pane, and the good defaults are the ones you discover after reading the documentation properly. There is a real setup cost before the tool is doing its best work.

Capability also tracks the model you attach. Aider with a weak model is a weak agent, and the tool does not compensate. Evaluations of "Aider" that do not name the model behind it are not telling you anything useful.

## What it costs

The tool is free and open source. You pay only for model API usage, which is the honest version of a pricing page.

That makes the total cost entirely dependent on your choices: a frontier model on a large repository is not cheap, a mid-tier model on scoped tasks is very cheap, and a local model on hardware you already own is free at the margin. For individuals and small teams this frequently works out well below a seat-priced competitor. For a large organisation, the absence of centralised seat management and policy controls is a genuine administrative cost that offsets some of the saving.

## Who it is for

Developers comfortable in a terminal who want control over model choice, cost and history. Teams with a hard requirement that code stays on their infrastructure. Anyone who wants to understand what an agent is doing rather than trust a UI to summarise it.

Everyone else is better served by [Cursor](/tools/cursor/) if they want an editor, [Claude Code](/tools/claude-code/) if they want a polished terminal agent and do not need model portability, or [GitHub Copilot](/tools/github-copilot/) if institutional simplicity matters most. See [best AI coding assistants](/articles/best-ai-coding-assistants/) for the full field.
