---
name: "n8n"
tagline: "Source-available workflow automation platform with AI agent nodes and self-hosting as a first-class option."
description: "n8n is a node-based automation tool where an AI agent is one node type among hundreds of integrations. That combination matters: the agent can call the same connectors the deterministic parts of your workflow use. It can be self-hosted on your own infrastructure, which makes it viable where cloud automation tools are not."
seoTitle: "n8n Review: Self-Hostable Workflow Automation With AI Agents"
seoDescription: "n8n combines node-based automation with AI agent nodes and self-hosting. Integration breadth, MCP support, hybrid deterministic design, and its rough edges."
vendor: "n8n"
website: "https://n8n.io"
docs: "https://docs.n8n.io"
category: "Workflow Agents"
runtime: "hybrid"
mcpSupport: true
autonomy: "supervised"
pricing: "freemium"
priceNote: "Free self-hosted community edition; paid cloud plans and enterprise licensing available."
rating: 4.5
features:
  - "Visual node workflow editor"
  - "AI agent and tool nodes"
  - "Hundreds of app integrations"
  - "MCP client and server nodes"
  - "Self-hosting via Docker"
  - "Custom JavaScript nodes"
  - "Webhook and schedule triggers"
pros:
  - "Mixes deterministic steps with agentic ones, so you only pay for reasoning where it helps"
  - "Self-hosting keeps regulated data inside your own network"
  - "Escape hatch to raw code exists whenever the visual nodes run out of expressiveness"
cons:
  - "Visual editor becomes hard to read once a workflow passes a few dozen nodes"
  - "Self-hosting means you own upgrades, scaling, and backups"
  - "Licensing is source-available rather than fully open source, which restricts some commercial uses"
bestFor: "Operations and engineering teams automating business processes that need self-hosting and selective AI reasoning."
relatedArticle: "ai-automation-for-business"
featured: true
updatedDate: 2026-07-22
---

The useful insight in n8n is that most business automation should not be agentic. Fetching a record, formatting a field, and posting to an endpoint are deterministic steps that a model would only make slower, more expensive, and less reliable. n8n lets you keep those as plain nodes and drop an agent node in at the one point where judgment is genuinely required — classifying an inbound message, extracting fields from unstructured text, deciding a route.

Because the agent node can be handed the same integrations as the rest of the canvas, tool wiring is configuration rather than code. MCP nodes extend that further, letting workflows consume external tool servers or expose n8n workflows as tools to other agents.

Where it fits: internal operations, data plumbing between SaaS systems, and regulated environments where a self-hosted deployment is a requirement rather than a preference. See [AI automation for business](/articles/ai-automation-for-business/) for how to choose which steps deserve a model at all.
