---
name: "n8n"
tagline: "Source-available workflow automation with native AI agent nodes and self-hosting"
description: "n8n is a node-based automation platform that connects APIs, databases and AI models into executable workflows. Its self-hosting option and code-friendly nodes make it the usual choice for technical teams building AI-driven automation."
seoTitle: "n8n Review: Self-Hosted AI Workflow Automation"
seoDescription: "A review of n8n: node-based workflows, AI agent nodes, self-hosting, code steps, licensing shape and the operational burden of running it yourself."
vendor: "n8n"
website: "https://n8n.io"
docs: "https://docs.n8n.io"
category: "Automation"
pricing: "freemium"
priceNote: "Self-host free under a fair-code license; paid cloud plans by execution volume"
rating: 4.5
features: ["Visual workflow builder", "AI agent nodes", "Self-hosting", "JavaScript and Python steps", "Hundreds of integrations", "Webhooks", "Error workflows"]
pros:
  - "Self-hosting keeps credentials and business data inside your own infrastructure"
  - "Code nodes mean you are never blocked when the visual builder cannot express something"
  - "AI agent and vector store nodes make retrieval and tool-calling workflows straightforward to assemble"
  - "Execution-based pricing on cloud is far cheaper than per-task competitors at volume"
cons:
  - "Steeper learning curve than consumer automation tools — it assumes API literacy"
  - "Self-hosting shifts upgrades, monitoring and reliability onto your team"
  - "The fair-code license is not OSI open source, which some procurement teams flag"
  - "Complex workflows become hard to debug and version without disciplined conventions"
bestFor: "Technical teams automating internal processes with AI in the loop, especially where data residency rules out hosted-only platforms."
relatedArticle: "ai-automation-for-business"
featured: false
updatedDate: 2026-07-26
---

n8n has become the default automation layer for AI work in engineering-led organizations, and the reason is control. Workflows run on your infrastructure, credentials stay in your vault, and when the visual abstraction runs out you drop into JavaScript or Python rather than filing a feature request.

## The escape hatch is the feature

Every visual automation tool eventually meets a requirement its node library does not cover. The difference between them is what happens next.

In a closed platform, you file a request and wait, or you build a fragile workaround out of the primitives you have. In n8n you write a Code node, do the thing, and carry on. Arbitrary HTTP requests to any API, arbitrary transformation logic, arbitrary branching — the visual layer is a convenience over a general-purpose runtime rather than a cage.

That single property is why engineering teams tolerate the operational cost. The tool never becomes the reason something is impossible.

## The AI nodes moved it into a different category

Agent nodes with tool-calling, vector store connectors, embedding nodes, structured output parsing and memory make it possible to build a retrieval pipeline or a triage agent as a workflow — with the same observability, error handling and retry semantics as any other automation.

That framing is underrated. An agent built as an n8n workflow is inspectable: you can see which node failed, what data it received, and what it returned. An agent built as an opaque service is a log file and a guess. For anything running in production against real customers, the difference in debuggability is worth more than raw capability.

Common shapes that work well: inbound email or ticket triage with classification and routing, document ingestion into a vector store on a schedule, retrieval-augmented answering over an internal corpus, and scheduled research and summarisation jobs.

## The operational cost is real

Someone owns upgrades, monitoring, and the debugging of a forty-node workflow that fails intermittently at 3am. Self-hosting is not free; it is a trade of licence cost for engineering time, and teams that do not staff it end up with an unmaintained automation layer holding up business processes.

The teams that succeed treat workflows as code: version controlled, reviewed, and separated by environment, with a staging instance that is not the production one. The teams that struggle treat them as things clicked together in a browser by whoever needed them, and discover eighteen months later that nobody knows what half of them do or which credentials they hold.

Complexity also degrades the visual advantage. Small workflows are clearer as diagrams than as code. Large ones are not, and past a certain size the canvas becomes harder to reason about than the equivalent script would have been.

## Licence and pricing

Self-hosting is free under a fair-code licence — not OSI open source, and the distinction matters if you intend to offer n8n itself as a service. Read the terms if your use is anything other than internal.

Paid cloud plans are billed by execution volume, which removes the operational burden and reintroduces a cost that scales with success. Enterprise tiers add SSO, environments and support.

The usual sequence is prototype on cloud, move to self-hosted when volume or data policy demands it.

## Who should choose it

Engineering-led teams that want automation without vendor lock-in, organisations with data-residency requirements, and anyone building AI workflows that need to be observable in production.

Teams without engineering capacity, or whose priority is breadth of pre-built integrations over control, should use [Zapier](/tools/zapier/).

Our practical guide to the wider space is at [AI automation for business](/articles/ai-automation-for-business/).
