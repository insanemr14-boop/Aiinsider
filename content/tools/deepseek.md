---
name: "DeepSeek"
tagline: "Open-weight reasoning models with a free chat interface and unusually cheap API access"
description: "DeepSeek publishes open-weight language models alongside a free consumer chat app and a low-cost API. It is the default reference point for teams that want strong reasoning performance without proprietary model pricing or hosting lock-in."
seoTitle: "DeepSeek Review: Open-Weight Models, Chat App and API"
seoDescription: "A review of DeepSeek: open-weight reasoning models, free chat access, cheap API pricing, self-hosting options and the data governance questions to ask."
vendor: "DeepSeek"
website: "https://www.deepseek.com"
docs: "https://api-docs.deepseek.com"
category: "Chat Assistants"
pricing: "freemium"
priceNote: "Free chat app; usage-based API; open weights self-hostable"
rating: 4.0
features: ["Open weights", "Reasoning mode", "Free web chat", "Low-cost API", "Self-hostable", "Strong code performance"]
pros:
  - "Open weights let you self-host, fine-tune and audit rather than renting a black box"
  - "API pricing is dramatically below the proprietary frontier labs for comparable tasks"
  - "Reasoning traces are exposed, which helps with debugging prompts and evaluating answers"
  - "Free web chat removes any cost barrier to evaluation"
cons:
  - "Hosted service is subject to Chinese jurisdiction, which blocks it in many enterprise procurement reviews"
  - "Tooling, connectors and enterprise admin features are far thinner than Western incumbents"
  - "Self-hosting the larger models requires serious GPU capacity, so 'free' is misleading at scale"
  - "Content restrictions on politically sensitive topics are visible in the hosted app"
bestFor: "Teams that want frontier-adjacent reasoning at low cost, and engineers who need weights they can host, inspect or fine-tune themselves."
relatedArticle: "top-open-source-llms"
featured: false
updatedDate: 2026-07-05
---

DeepSeek changed the pricing conversation more than the capability conversation. By publishing competitive open-weight reasoning models, it made "we will just pay frontier API rates" a decision that now needs justifying rather than assuming.

For engineering teams the practical question is deployment. Using the hosted API is trivial and cheap, but routes data through infrastructure many compliance teams will not approve. Self-hosting the weights removes that objection and replaces it with a capacity problem: the larger variants need meaningful GPU allocation, and inference engineering is not free labor.

The middle path most enterprises take is running DeepSeek weights through a Western inference provider, keeping the cost advantage and the auditability while satisfying data residency requirements. Evaluate that option before dismissing the models on jurisdiction alone.
