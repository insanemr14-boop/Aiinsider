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

## Why the map matters more than it sounds

Context is the binding constraint on every coding agent. Send too little and the model invents an interface that does not exist; send too much and you pay for tokens that contribute nothing while diluting the signal the model needs.

The repository map is a principled answer: give the model a structural index of the whole project, let it identify which files are actually relevant, then send those in full. It approximates how an engineer navigates an unfamiliar codebase — skim the shape, open the two files that matter — rather than reading everything.

The practical effect is that Aider stays affordable on repositories where naive context-stuffing would not be, and stays accurate on repositories large enough that the relevant file is not the one you had open.

## Git as the undo stack

Each accepted change is committed with a generated message, so the transcript of an agent session is also a reviewable history. If the third edit was wrong, you reset to the second.

This is a stronger guarantee than it appears. Most agent tools maintain their own notion of what changed and expect you to trust it. Aider's state is Git's state, which means every tool you already use for reviewing, reverting and bisecting works unmodified — and an agent session that went badly is recoverable with a command you already know rather than with the tool's own recovery flow.

It also makes agent work auditable in a way that satisfies people who need to ask what changed and why. The answer is the log.

## Model independence as an agent property

Most agents are a product with a model behind it. Aider is a loop you attach a model to, and that changes what is possible.

Route cheap mechanical edits to a small model and hard reasoning to a frontier one. Run entirely against a self-hosted model when source code cannot leave the network — which makes Aider one of very few agentic options viable in genuinely restricted environments. Switch when a better or cheaper model appears, without waiting for a vendor to adopt it.

The trade is that capability tracks the model. Aider with a weak model is a weak agent, and the harness does not compensate. Any evaluation that does not name the model behind it is not measuring Aider.

## The operator cost

The autonomy level is assisted rather than autonomous: it proposes, you accept, and the interface is a terminal rather than a diff viewer. There is no MCP support, so tool use beyond editing and running commands is not part of the model.

Configuration is a file and a set of flags, and the good defaults are discovered by reading the documentation rather than by clicking through a settings pane. There is real setup cost before the tool is doing its best work.

## Where it fits

Engineers who want control over model choice and cost, teams evaluating [open-source LLMs](/articles/top-open-source-llms/) for coding work, and anyone who needs a coding agent that runs entirely on self-hosted infrastructure.

Teams wanting a richer tool surface and MCP integrations should look at [Claude Code](/agents/claude-code/). Teams wanting an editor rather than a terminal want [Cursor Agent](/agents/cursor-agent/). Aider asks more of the operator than a hosted product does, and rewards that with transparency.

The broader field is compared in [best AI coding assistants](/articles/best-ai-coding-assistants/).
