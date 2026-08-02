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

Aider is the tool that proves how much of the AI coding experience is packaging. The core loop — build a map of the repo, send relevant context, apply a diff, commit it — is straightforward, and doing it in the open makes the mechanics legible in a way commercial editors do not.

The git integration is the part worth copying. Because each accepted change is a real commit, reviewing an agent session is just reading history, and undoing a bad run is a revert. That is a materially better audit story than editors that mutate your working tree and ask you to sort it out.

It is not a drop-in replacement for a commercial AI IDE. There is no index tuned on your monorepo, no support escalation and no polished onboarding. What there is instead is control: your model, your data path, your costs, and source you can read when something behaves oddly.
