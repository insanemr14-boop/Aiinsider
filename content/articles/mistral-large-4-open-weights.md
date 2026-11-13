---
title: "Mistral Large 4 Goes Open Weight: What a Trillion-Parameter Model Means for Self-Hosting"
description: "Mistral released the open weights for Mistral Large 4 on 29 October 2026. What was released, the hardware it needs, the licence terms to check, and whether self-hosting makes sense for you."
excerpt: "Mistral has published the weights for its roughly one-trillion-parameter flagship. It is the largest open-weight release from a major lab so far, and running it is not a weekend project."
seoTitle: "Mistral Large 4 Open Weights: Hardware, Licence, Benchmarks"
seoDescription: "Mistral Large 4 open weights were released 29 October 2026. Size, hardware requirements, licence caveats, reported benchmarks and when self-hosting is worth it."
author: research-desk
category: mistral
tags: ["mistral", "open-source-llms", "open-weights", "self-hosting", "llms", "ai-news"]
type: news
publishDate: 2026-11-13
featured: false
editorsPick: false
trending: false
heroAlt: "Abstract artwork representing an open-weight large language model"
faq:
  - question: "Is Mistral Large 4 open source?"
    answer: "It is open weight, which is not the same thing. The weights are downloadable, but they are released under Mistral's own licence, reported as the Mistral Ecosystem Open-Weight License. Read the licence text before any commercial use."
  - question: "How big is Mistral Large 4?"
    answer: "Roughly one trillion total parameters. It is a mixture-of-experts model, so only a fraction is active for any given token. Mistral and most outlets put that active figure at about 52 billion."
  - question: "Can I run Mistral Large 4 on my own hardware?"
    answer: "Only with data center GPUs. Reports indicate a quantized version runs on four current-generation Nvidia accelerators. It will not run on a workstation or a single consumer GPU."
  - question: "How good is Mistral Large 4 at coding?"
    answer: "Mistral calls it the best open-weight model for coding and reports about 41% on Terminal-Bench 4.0 for the release build. Independent replication was still pending at the time of writing."
  - question: "Should I self-host instead of using an API?"
    answer: "Self-host when data residency, control or very high steady volume justify the hardware and operations cost. For variable or modest workloads, the hosted API is almost always cheaper and simpler."
---

Mistral published the open weights for **Mistral Large 4** on 29 October 2026, about three weeks after the model first appeared as an API preview on 6 October. The company's nickname for it is "Le Chonk", which is fair: at roughly one trillion parameters, it is the largest open-weight release from a major lab to date.

This matters beyond Mistral. It moves the ceiling for what an organization can run entirely on its own infrastructure.

## What exactly was released?

- **Weights:** available on Hugging Face, in FP8 and NVFP4 quantized checkpoints.
- **Size:** about one trillion total parameters in a mixture-of-experts design, with roughly 52 billion active per token according to Mistral and most coverage. One outlet reported 49 billion.
- **Serving:** supported through vLLM and SGLang.
- **Cloud:** Microsoft Foundry is the first cloud provider to offer it.
- **API:** still available as a hosted service from Mistral, with one report of a price cut to $0.70 per million input tokens and $2.10 per million output tokens.

## Is "open weight" the same as open source?

No, and the difference has commercial consequences.

Open weight means you can download the model and run it. It does not tell you what you are allowed to do with it. Mistral Large 4 is released under the company's own licence, reported as the **Mistral Ecosystem Open-Weight License** and described by one outlet as a modified MIT licence.

Before you build a product on it, read the licence text for three things: whether commercial use is permitted without a separate agreement, whether there are restrictions on offering the model as a hosted service, and what attribution is required. Do not rely on a news summary, including this one, for a licensing decision.

## What hardware does it need?

A mixture-of-experts model is cheaper to run than its total parameter count suggests, because only some of the experts fire for each token. But all the weights still have to sit in memory.

Reports indicate the quantized version runs on four current-generation Nvidia data center accelerators. In practical terms:

- This is not a laptop, workstation or single-GPU model.
- You need a multi-GPU server, the networking and cooling to match, and someone who can operate an inference stack.
- Quantized checkpoints trade a little accuracy for a large memory saving. Test the quantized build on your tasks rather than assuming it matches the hosted API.

If you want open models that run on modest hardware, our roundup of the [top open-source LLMs](/articles/top-open-source-llms/) covers the smaller options.

## How good is it?

Mistral describes Large 4 as the best open-weight model for coding. The number attached to that claim is Terminal-Bench 4.0, where Mistral reports the model moved from 28.3% at the October preview to about 41% in the release build.

Two cautions. First, that is Mistral's own figure, and independent replication was still pending in the coverage we reviewed. Second, a 13-point jump between preview and release in three weeks tells you the preview was not final. It does not tell you how the model behaves on your workload.

## When does self-hosting make sense?

| Your situation | Likely answer |
|---|---|
| Regulated data that cannot leave your infrastructure | Self-host, or use a sovereign cloud deployment |
| Very high, steady token volume | Self-hosting can win on cost. Run the numbers including staff |
| Variable or modest usage | Hosted API |
| You need the model to stay fixed for audit or reproducibility | Self-host. Hosted models change underneath you |
| Small team with no infrastructure engineers | Hosted API |

The cost comparison people get wrong is utilization. A GPU server costs the same whether it is busy or idle. An API bills only for what you use. Self-hosting pays off when your hardware runs near capacity most of the day.

## What this means for the wider market

Each large open-weight release puts pressure on the price of closed models and gives enterprises a credible alternative when negotiating. It also widens the set of organizations, including governments and regulated industries, that can run a frontier-class model without sending data to a third party. Mistral has leaned on that "sovereign" positioning throughout this launch.

It also raises the security stakes. A model you host is a system you must secure: the weights, the serving endpoint and whatever tools you connect to it. Our guide to [AI security risks](/articles/ai-security-risks/) covers the controls that apply.

## Sources

- [Mistral Large 4 (Le Chonk) is now open weight, Mistral AI](https://mistral.ai/news/mistral-large-4-oss/)
- [Mistral releases open weights for Mistral Large 4, SiliconANGLE](https://siliconangle.com/2026/10/29/mistral-releases-open-weights-for-mistral-large-4-providing-sovereign-control-for-the-companys-le-chonk-ai-model/)
- [Mistral releases open weights for its 1 trillion-parameter Large 4 model, The Next Web](https://thenextweb.com/news/mistral-large-4-open-weights-release)
