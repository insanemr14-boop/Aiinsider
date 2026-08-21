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

DeepSeek's contribution to the field was not a feature. It was a price, and a demonstration that the price was achievable — which forced a repricing across the industry that has not reversed.

## What the cost difference actually means

API pricing an order of magnitude below comparable frontier models does not just make existing workloads cheaper. It makes different workloads possible.

Applications that were uneconomic at frontier pricing — classifying every support ticket, summarising every document in an archive, running an evaluation over a large corpus, generating per-user content at scale — become straightforward. The interesting projects unlocked by DeepSeek are mostly not "the same thing, cheaper" but "the thing nobody built because the arithmetic did not work".

The reasoning models compound this. Chain-of-thought reasoning is expensive by construction, because the model generates a great deal of intermediate text you never see. At DeepSeek's pricing, reasoning becomes affordable for routine work rather than reserved for the hard cases.

## Open weights change the risk profile

Several DeepSeek models ship with open weights under permissive terms. That matters for two distinct reasons, and teams often conflate them.

The first is sovereignty. You can run the model on your own hardware, which means data never leaves your network and no vendor can deprecate the model you built on. For regulated industries and for anyone who has been burned by an API sunset, this is the whole argument.

The second is cost at volume. Above a certain sustained throughput, self-hosting beats per-token billing — though the crossover point is higher than most teams estimate once GPU capacity, engineering time and idle utilisation are counted honestly.

## The parts that need saying plainly

The hosted service is operated in China and subject to Chinese law and content regulation. For a substantial set of organisations that is a categorical block regardless of everything else on this page, and it should be settled before any technical evaluation rather than after.

The self-hosted route removes the data-residency concern entirely — the weights do not phone home — but it does not remove the content-moderation behaviour trained into the model, which remains observable on politically sensitive topics. Evaluate the model on your actual prompts rather than assuming the alignment matches a Western-trained equivalent.

English output quality is good but not frontier. On careful long-form writing and on subtle instruction-following it trails the leaders noticeably. On code, mathematics and structured reasoning the gap is much smaller and sometimes absent.

Documentation and tooling are thinner than the established vendors', and the ecosystem of integrations, while growing fast, still assumes you are comfortable filling gaps yourself.

## Pricing

The consumer chat app is free. The API is usage-based at a fraction of frontier pricing, with further discounts for cache hits. Open weights are free to download and run, with cost shifting entirely to infrastructure.

For prototyping and for high-volume batch work, this is close to unbeatable. For latency-sensitive interactive products, benchmark the hosted API from your actual region before committing — throughput and response times vary more than the leaders'.

## Who should use it

Teams with volume-driven economics, anyone building on open weights for sovereignty or portability reasons, and developers prototyping who do not want a bill.

Teams with a hard constraint against Chinese-operated services should self-host or look at other open-weight families. Teams whose output quality requirement is writing rather than reasoning should pay for [Claude](/tools/claude/) or [ChatGPT](/tools/chatgpt/) and treat the cost as the price of the register.

Our survey of the open-weight landscape is at [top open source LLMs](/articles/top-open-source-llms/).
