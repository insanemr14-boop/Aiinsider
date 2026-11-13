---
title: "Claude Fable 5.2 and Mythos 5.2: What Anthropic Launched and What It Costs"
description: "Anthropic released Claude Fable 5.2 and Claude Mythos 5.2 on 9 November 2026. Here is what changed: lower API pricing, faster output, who gets access, and how to read the benchmark claims."
excerpt: "Anthropic's new top-tier models arrive with a 20% price cut and faster output. Fable 5.2 is the public model; Mythos 5.2 is restricted to approved organizations."
seoTitle: "Claude Fable 5.2 and Mythos 5.2: Pricing, Access, Benchmarks"
seoDescription: "Claude Fable 5.2 and Mythos 5.2 launched 9 November 2026. Pricing drops to $8/$40 per million tokens. What changed, who gets access, and what the benchmarks mean."
author: editorial-team
category: anthropic
tags: ["anthropic", "claude", "claude-fable", "claude-mythos", "llms", "ai-news", "model-release"]
type: news
publishDate: 2026-11-13
featured: false
editorsPick: false
trending: true
heroAlt: "Abstract artwork representing a new large language model release"
faq:
  - question: "When were Claude Fable 5.2 and Mythos 5.2 released?"
    answer: "Anthropic announced both models on 9 November 2026. Fable 5.2 became available the same day in the Claude apps for paid plans and through the API."
  - question: "What is the difference between Claude Fable 5.2 and Claude Mythos 5.2?"
    answer: "They share the same underlying model. Fable 5.2 is the generally available version and ships with additional safety classifiers that filter some biology and cybersecurity requests. Mythos 5.2 is offered without those measures, and only to organizations Anthropic has approved."
  - question: "How much does Claude Fable 5.2 cost through the API?"
    answer: "Reported launch pricing is $8 per million input tokens and $40 per million output tokens, down from $10 and $50 for Fable 5.1. Check Anthropic's pricing page before budgeting, because prices and discounts change."
  - question: "Is Claude Fable 5.2 better than GPT-6 for coding?"
    answer: "Anthropic reports a higher score than OpenAI's GPT-6 Astra on the FrontierSWE v2 software engineering benchmark. That is a vendor-reported result on one benchmark. The reliable test is running both models on your own repository and tasks."
  - question: "Do I need to change my code to use Fable 5.2?"
    answer: "If you call the API with a pinned model ID, you need to switch to the new ID, claude-fable-5-2. Re-run your evaluation set before moving production traffic, since output style and tool-calling behavior can shift between versions."
---

Anthropic released two new models on 9 November 2026: **Claude Fable 5.2** and **Claude Mythos 5.2**. The headline for most teams is not a new capability but a price and speed change at the top of the range, together with a clearer split between the model anyone can use and the one reserved for vetted organizations.

This article sticks to what Anthropic and multiple outlets have reported, and flags where a number is the company's own claim.

## What did Anthropic announce?

Two models that share one underlying system:

- **Claude Fable 5.2** is the generally available model. It is offered in the Claude apps on the Pro, Max, Ultra, Team and Enterprise plans, and to developers through the API and the major cloud marketplaces. The API model ID is `claude-fable-5-2`.
- **Claude Mythos 5.2** is the same model without some of the safety measures applied to Fable, and is limited to organizations Anthropic has approved.

Anthropic describes the pair as built for difficult technical work, with improvements in coding, reasoning and vision.

## Why are there two versions of the same model?

The split is about dual-use risk. Fable 5.2 ships with additional classifiers that filter requests in areas such as biology and cybersecurity, where a highly capable model could give meaningful help to someone trying to cause harm. Mythos 5.2 drops those restrictions for organizations with a verified need, such as security teams doing defensive research.

For most readers this changes nothing in practice. If you are building a product, writing code or doing analysis, Fable 5.2 is the model you will use. The split matters mainly if your work sits inside the filtered domains, in which case expect some refusals on Fable and an application process for Mythos.

## What does Fable 5.2 cost?

Reported launch pricing for the API:

| | Fable 5.1 | Fable 5.2 |
|---|---|---|
| Input, per million tokens | $10 | $8 |
| Output, per million tokens | $50 | $40 |

That is a 20% cut on both sides. Anthropic also says output is up to 30% faster than the 5.1 generation.

A lower unit price does not automatically mean a lower bill. As we covered in our [AI trends analysis](/articles/ai-trends-2026/), reasoning-heavy workloads consume far more tokens per task than they did a year ago. Measure cost per completed task before and after you switch, not cost per token.

## How should you read the benchmark claims?

Anthropic reports that Fable 5.2 scored 69.9% on FrontierSWE v2, a software engineering evaluation, against 62.3% for its own Claude Opus 5.5 and 65.5% for OpenAI's GPT-6 Astra. The company also says the model resolved two previously open problems in theoretical physics.

Treat both as vendor-reported until independent groups replicate them. Three points are worth keeping in mind:

1. **Benchmarks measure the benchmark.** A seven-point lead on a public coding suite tells you little about your codebase, your test coverage or your review process.
2. **Launch-day numbers are chosen by the vendor.** Every lab publishes the comparisons that flatter its model.
3. **External testing did happen.** Anthropic says outside evaluators, including METR and a government AI security institute, tested the model before release. That is a safety review, not a performance audit.

If coding is your use case, our comparison of the [best AI coding assistants](/articles/best-ai-coding-assistants/) explains how to run a fair evaluation on your own work.

## What should you do now?

- **API users:** add `claude-fable-5-2` to your evaluation harness and compare it with your current model on real tasks. Move traffic only after the results hold.
- **Claude app users on paid plans:** the model should already appear in the model picker. No action is needed.
- **Teams choosing between vendors:** this release narrows the price gap at the top end. Revisit any decision you made on cost alone. Our [Claude vs ChatGPT comparison](/articles/claude-vs-chatgpt/) covers the non-price factors.
- **Security and biology researchers:** expect Fable to decline some requests. Ask Anthropic about Mythos access if your organization qualifies.

## Sources

- [Claude Fable 5.2 product page, Anthropic](https://www.anthropic.com/claude/fable)
- [Anthropic Launches Claude Fable 5.2 and Mythos 5.2, MacRumors](https://www.macrumors.com/2026/11/09/anthropic-launches-claude-fable-5-2/)
- [Anthropic launches Claude Fable 5.2 and Mythos 5.2 at lower prices, Resultsense](https://www.resultsense.com/news/2026-11-10-claude-fable-mythos-5-2-launch/)
