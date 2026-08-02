---
title: "Top Open Source LLMs: Families, Licenses and How to Run Them"
description: "A practical survey of the leading open-weight LLM families — Llama, Mistral, Qwen, DeepSeek, Gemma and others — with honest licensing analysis and hardware guidance."
excerpt: "Llama, Mistral, Qwen, DeepSeek and Gemma dominate the open-weight landscape, but their licenses differ sharply. Here is what each family is good for, what the license actually permits, and what hardware you need."
seoTitle: "Top Open Source LLMs in 2026: Models, Licenses, Hardware"
seoDescription: "Compare the leading open-weight LLM families on capability, license terms, hardware needs and serving stack. Includes quantization and deployment guidance."
author: research-desk
category: open-source-llms
tags: ["open-source-llms", "llama", "mistral", "qwen", "deepseek", "gemma", "local-ai"]
type: review
publishDate: 2026-06-11
updatedDate: 2026-07-24
featured: false
editorsPick: true
trending: false
heroAlt: "Abstract illustration of interlocking neural network layers representing open weight model families"
faq:
  - question: "What is the difference between open source and open weights?"
    answer: "Open weights means the trained parameters are downloadable and runnable on your own hardware. Open source, in the sense the Open Source Initiative uses, additionally implies no field-of-use restrictions and enough information about training data and code to reproduce or meaningfully modify the system. Most models marketed as open source are accurately described as open weights."
  - question: "Can I use Llama models in a commercial product?"
    answer: "The Llama Community License permits commercial use for the overwhelming majority of companies, but it is a custom license rather than a standard open source one. It adds an attribution requirement, a naming convention for derivative models, an acceptable use policy, and a monthly-active-user threshold above which you must request separate terms from Meta."
  - question: "How much VRAM do I need to run a 70B model?"
    answer: "At 4-bit quantization a 70B dense model needs roughly 40 GB for weights plus headroom for the KV cache and activations, so a 48 GB card or two 24 GB cards is the practical floor. At 16-bit you are looking at more than 140 GB, which means multiple data center GPUs."
  - question: "Does quantization hurt model quality?"
    answer: "Modern 4-bit schemes such as AWQ, GPTQ and the K-quant GGUF variants lose very little on general tasks, and the loss is usually smaller than the gap between adjacent model sizes. Degradation becomes noticeable on long-context reasoning, code generation and non-English text, so test on your own workload before shipping."
  - question: "Should I use Ollama or vLLM?"
    answer: "Ollama is the right choice for local development, single-user workloads and quick experiments because it handles model downloads, quantization formats and an OpenAI-compatible endpoint with almost no configuration. vLLM is the right choice for production serving where continuous batching and paged attention give you far higher throughput per GPU."
  - question: "Are mixture-of-experts models cheaper to run?"
    answer: "Mixture-of-experts models are cheaper in compute because only a fraction of parameters activate per token, but they are not cheaper in memory because all experts must be resident. A model with hundreds of billions of total parameters and tens of billions active still needs enough VRAM or RAM to hold the whole thing."
  - question: "Can open-weight models match frontier proprietary models?"
    answer: "The gap has narrowed to months rather than years on most measurable capabilities, and the strongest open-weight reasoning and coding models are competitive with proprietary models from the prior generation. Frontier proprietary systems still tend to lead on the hardest agentic, long-horizon and multimodal tasks."
  - question: "What should I check before deploying an open-weight model?"
    answer: "Read the actual license file rather than the model card summary, confirm whether your use case triggers any user threshold or field-of-use restriction, and verify the export and data residency implications of the model's origin. Then run your own evaluation set, because public leaderboard position rarely predicts performance on a specific production task."
---

Open-weight language models are now a genuine deployment option rather than a research curiosity. The strongest families — Llama, Mistral, Qwen, DeepSeek, Gemma and a growing set of challengers — cover everything from 1B models that run on a phone to sparse mixture-of-experts systems that need a server rack. The hard part is no longer capability. It is choosing a license you can actually live with and sizing the hardware honestly.

## Open source and open weights are not the same thing

Almost every model in this article is distributed as **open weights**: the trained parameters are downloadable, you can run them on your own hardware, and you can fine-tune them. That is a meaningful freedom and it is what most teams actually need.

It is not the same as open source in the traditional sense. The Open Source Initiative's definition of open source software prohibits field-of-use restrictions, and its later definition of open source AI additionally expects sufficient information about training data, along with the training and inference code, for a competent third party to rebuild the system.

Judged against that bar, the picture changes. Models released under Apache 2.0 or MIT have genuinely open licenses but almost never publish their training data. Models with custom licenses — Llama, Gemma, some Qwen releases — are not open source at all, regardless of how they are marketed.

A small number of projects clear both bars. Allen Institute for AI's OLMo family publishes weights, training code, intermediate checkpoints and the pretraining corpus under permissive terms. EleutherAI's older Pythia suite did the same. These matter for research reproducibility even when they are not the strongest models available.

The practical takeaway: read the license file, not the blog post. "Open" in a launch announcement is a marketing word.

## The major families

### Llama (Meta)

Llama did more than any other release to make local inference mainstream, and the ecosystem effect is still its biggest advantage. Nearly every quantization tool, fine-tuning framework and serving engine treats Llama as the reference architecture, so tooling support is the deepest of any family.

Recent generations span small dense models suitable for edge deployment through to large mixture-of-experts variants aimed at data center serving. Multimodal and long-context variants are part of the line.

The license is the caveat. The Llama Community License permits broad commercial use but adds conditions no standard open source license contains: an attribution requirement, a rule that derivative model names carry the Llama prefix, a binding acceptable use policy, and a monthly-active-user threshold above which you must negotiate separate terms with Meta. That threshold is high enough to be irrelevant to almost everyone, but it is a field-of-use restriction and it disqualifies the license from being open source.

### Mistral

Mistral AI built its reputation on small models that punch above their parameter count, and that remains the family's character. The smaller dense models and the Mixtral sparse models are released under Apache 2.0 — genuinely permissive, no user thresholds, no naming rules.

The company also ships models under the Mistral Research License and the Mistral Non-Production License, which restrict use to research and evaluation. Its largest and most specialized models often land in this category, with commercial deployment requiring a paid agreement. Two Mistral models can therefore have completely different commercial implications, and the model card is where you find out which is which.

Mistral's code-oriented and reasoning-oriented releases are worth attention if you are building developer tooling. See our roundup of the [best AI coding assistants](/articles/best-ai-coding-assistants/) for how open-weight code models compare with hosted alternatives.

### Qwen (Alibaba)

Qwen is arguably the most complete open-weight family available. It spans sub-1B models to very large mixture-of-experts systems, with strong dedicated variants for code, vision-language, audio and embeddings, and unusually good multilingual coverage.

Recent Qwen generations have shipped under Apache 2.0 across the whole size range, which is a significant improvement over earlier releases where the largest and smallest checkpoints carried a custom Qwen license with its own user threshold. Check the specific checkpoint rather than assuming the family is uniform.

The breadth is the real story. If you need a small embedding model, a mid-size instruct model and a large reasoning model that all share a tokenizer and prompt format, Qwen is usually the shortest path.

### DeepSeek

DeepSeek's contribution was demonstrating that frontier-adjacent reasoning could be trained and released openly, and released under a genuinely permissive license. Its flagship mixture-of-experts models and reasoning models have been published under MIT terms, with no use restrictions attached to the weights.

DeepSeek also popularized distillation as a distribution strategy: reasoning traces from a large model used to fine-tune much smaller Llama and Qwen bases, producing compact models with disproportionately good step-by-step reasoning. Those distilled variants inherit the license of their base model, which is a licensing trap worth knowing about.

The architectural work — multi-head latent attention, aggressive sparsity, efficient training recipes — has been influential well beyond the models themselves.

### Gemma (Google)

Gemma models are derived from the same research lineage as Gemini and are optimized for the small-to-mid range where you care about quality per gigabyte. Recent generations added multimodal input and substantially longer context at sizes that still fit on a single consumer GPU.

The Gemma Terms of Use permit commercial use and redistribution but impose a prohibited use policy that must be passed through to anyone you distribute the model or derivatives to. Like Llama, it is a usable license rather than an open source one.

### gpt-oss (OpenAI)

OpenAI's open-weight release put two Apache 2.0 reasoning models into the ecosystem, sized so that the larger targets a single high-memory data center GPU and the smaller runs comfortably on consumer hardware. They shipped with low-precision quantization as the native format rather than as an afterthought, which is a meaningful signal about where deployment is heading.

### The rest of the field

Microsoft's Phi family pursues small models trained on heavily curated and synthetic data, generally under MIT terms, and is a reasonable default when you need something that runs on a laptop. Nvidia's Nemotron line takes existing open bases and applies additional alignment and efficiency work. IBM's Granite models target enterprise use with Apache 2.0 licensing and unusually thorough documentation of training data provenance.

Several Chinese labs beyond Alibaba and DeepSeek now publish large models under MIT or modified-MIT terms, including sparse systems in the trillion-total-parameter class. Falcon from TII continues to explore hybrid state-space and attention architectures. Cohere publishes weights for some models under non-commercial terms only, which makes them useful for research and useless for products.

## Comparison table

| Family | Origin | License character | Sizes available | Strongest at | Watch out for |
|---|---|---|---|---|---|
| Llama | Meta | Custom community license, commercial use allowed with conditions | Small dense to large MoE | Ecosystem and tooling depth, fine-tuning support | Naming rules, acceptable use policy, MAU threshold |
| Mistral | Mistral AI | Mixed: Apache 2.0 for many, research-only for some | Small to mid dense, sparse MoE | Quality per parameter, European data residency | License varies per checkpoint |
| Qwen | Alibaba | Largely Apache 2.0 in recent generations | Sub-1B through very large MoE | Breadth, multilingual, code and vision variants | Older checkpoints use a custom license |
| DeepSeek | DeepSeek | MIT for flagship weights | Large MoE, plus distilled small models | Reasoning, cost efficiency at scale | Distilled variants inherit base model licenses |
| Gemma | Google | Custom terms, commercial use allowed with conditions | 1B to ~30B, multimodal variants | Quality per gigabyte on a single GPU | Prohibited use policy must pass through |
| gpt-oss | OpenAI | Apache 2.0 | Consumer-scale and single-GPU data center scale | Reasoning with permissive licensing | Newer ecosystem, fewer fine-tunes |
| Phi | Microsoft | MIT | Small, laptop-class | Edge and CPU deployment | Narrower knowledge than larger models |
| OLMo | Allen Institute for AI | Apache 2.0, data and code published | Mid-size dense | Genuine reproducibility, research use | Not competitive at the frontier |

Capability rankings move every few weeks, so this table deliberately avoids scores. Treat license character and size range as the durable columns.

## Hardware requirements without the guesswork

The arithmetic is simple enough to do in your head. Multiply parameter count by bytes per parameter, then add roughly 20 to 30 percent for the KV cache, activations and framework overhead.

- 16-bit: 2 bytes per parameter. A 7B model needs about 14 GB before overhead.
- 8-bit: 1 byte per parameter. That same 7B model needs about 7 GB.
- 4-bit: roughly 0.5 bytes per parameter. About 3.5 GB.

Scaled up, a 70B model needs over 140 GB at 16-bit, around 70 GB at 8-bit, and roughly 40 GB at 4-bit. That last number is why 48 GB workstation cards and dual 24 GB consumer setups are the sweet spot for serious local inference.

Two corrections to the naive formula matter. First, long context is not free: the KV cache grows linearly with sequence length and with batch size, and at 100k tokens it can rival the weights in size. Models using grouped-query or latent attention reduce this substantially.

Second, mixture-of-experts models break the intuition that active parameters determine cost. Compute scales with active parameters, so a sparse model generates tokens quickly. Memory scales with *total* parameters, because every expert must be resident. A sparse model with a few tens of billions of active parameters can still require hundreds of gigabytes of memory.

Apple silicon is a genuine third option because unified memory means the GPU can address system RAM. A machine with 64 GB or more of unified memory runs models that would need multiple discrete GPUs, at lower token throughput but with far less complexity.

## Quantization in practice

Quantization reduces the numeric precision of weights, and sometimes activations, to shrink memory and increase throughput. The formats you will encounter:

- **GGUF** is the format used by llama.cpp and everything built on it. The K-quant variants — Q4_K_M is the usual default — balance size and quality well, and GGUF runs on CPU, Metal and GPU.
- **AWQ** and **GPTQ** are GPU-oriented post-training quantization methods that use calibration data to protect the weights that matter most. Both are well supported by production serving engines.
- **FP8** is hardware-native on recent Nvidia data center GPUs and gives near-lossless quality with a clean 2x memory reduction against 16-bit. Newer 4-bit hardware formats extend the same idea.
- **bitsandbytes** NF4 is the standard choice for QLoRA fine-tuning rather than for serving.

The practical rule: prefer 8-bit or FP8 if you have the memory, use 4-bit K-quants or AWQ when you do not, and avoid anything below 4-bit except for experimentation. Always evaluate the quantized model on your own task. Quality loss from quantization shows up first in exactly the places that are hardest to spot in casual testing — long-context recall, structured output validity and non-English fluency.

## Serving: choosing a runtime

**Ollama** is the fastest path from nothing to a working local model. It manages downloads, applies sensible defaults, and exposes an OpenAI-compatible HTTP endpoint, which means code written against the patterns in our [OpenAI API tutorial](/articles/openai-api-tutorial/) usually works against a local model with only a base URL change.

```bash
# Pull and run a quantized model locally
ollama pull qwen3:8b
ollama run qwen3:8b "Summarize the tradeoffs of 4-bit quantization."

# Same model, served on an OpenAI-compatible endpoint
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen3:8b","messages":[{"role":"user","content":"Hello"}]}'
```

**llama.cpp** is the layer Ollama sits on and the right choice when you need control or unusual hardware. It runs on CPU, on Apple Metal, on Vulkan and on CUDA, and it is the only realistic option for CPU-only deployment.

**vLLM** is the production default. Paged attention and continuous batching give it several times the throughput of naive serving under concurrent load, and it supports tensor and pipeline parallelism across GPUs, structured output constraints, and prefix caching.

```bash
# Production serving with an OpenAI-compatible API
vllm serve mistralai/Mistral-Small-Instruct \
  --quantization awq \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.90
```

**SGLang** competes with vLLM and tends to win on workloads with heavy prompt reuse thanks to its radix-tree prefix cache. **TensorRT-LLM** extracts the most performance from Nvidia hardware at the cost of a compilation step and much less flexibility. **MLX** is the Apple silicon native option.

For any agent or retrieval workload, the serving layer matters more than people expect, because those systems issue many short calls with heavily shared prefixes. Prefix caching alone can halve cost. Our guide to [retrieval-augmented generation](/articles/what-is-rag/) covers why that pattern dominates production traffic.

## How to choose

Start from constraints, not leaderboards.

If you need permissive licensing with no conditions to audit, restrict yourself to Apache 2.0 and MIT releases: Mistral's permissive checkpoints, recent Qwen, DeepSeek flagships, gpt-oss, Phi, Granite and OLMo. This removes most of the legal review burden.

If you need the deepest fine-tuning and tooling ecosystem, Llama remains the safest technical bet, provided your legal team accepts a custom license.

If you need one model family covering many modalities and sizes with a consistent interface, Qwen is the most complete.

If you are memory-constrained on a single consumer GPU, Gemma and Phi are designed for exactly that envelope.

If you need step-by-step reasoning on a budget, look at DeepSeek's models and the distilled variants, remembering that the distills carry their base model's license.

Then run your own evaluation. Public leaderboards measure aggregate ability on tasks that are almost certainly not yours, and contamination makes the gaps between similar models unreliable. A hundred examples from your actual workload, scored consistently, will tell you more than any benchmark table — the same principle we apply in our [prompt engineering guide](/articles/prompt-engineering-guide/).

## The bottom line

Open-weight models have closed most of the capability gap for mainstream tasks, and the remaining decision is about governance and infrastructure rather than raw quality. Pick a license you can defend in a review, size your hardware with the parameter-times-bytes formula rather than optimism, quantize to 4-bit or 8-bit and verify the loss on your own data, and serve with vLLM once you leave the laptop.

The field moves fast enough that any specific model recommendation ages within a quarter. The license structures, the memory arithmetic and the serving stack do not. Build against those.

Browse more coverage in the [open source LLMs category](/category/open-source-llms/).
