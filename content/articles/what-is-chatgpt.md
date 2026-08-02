---
title: "What Is ChatGPT? A Complete Guide"
description: "ChatGPT explained properly: the model underneath, how the chat app differs from the API, what it does well, where it fails, and how the tiers compare."
excerpt: "A working guide to ChatGPT — what the product actually is, the model architecture behind it, the difference between the chat app and the API, and the failure modes you need to plan around."
seoTitle: "What Is ChatGPT? Complete Guide (2026)"
seoDescription: "What ChatGPT is, how the model works, chat app vs API, free vs paid tiers, memory and custom instructions, and the failure modes to watch for."
author: research-desk
category: chatgpt
tags: ["chatgpt", "openai", "llms", "generative-ai", "ai-tools"]
type: analysis
publishDate: 2026-06-11
updatedDate: 2026-07-29
featured: true
editorsPick: false
trending: true
heroAlt: "Abstract illustration of a conversational AI interface with layered text streams"
faq:
  - question: "Is ChatGPT free to use?"
    answer: "There is a free tier that covers everyday question answering, drafting, and light file work, with rate limits and access to a smaller set of models. Paid individual, team, and enterprise tiers raise those limits and unlock the more capable reasoning models plus features like larger file handling and admin controls. The free tier is enough to evaluate whether the product fits your workflow."
  - question: "What model does ChatGPT run on?"
    answer: "ChatGPT runs on OpenAI's GPT family of transformer language models, and the specific model backing the product changes as OpenAI ships new versions. The app typically offers a default general-purpose model plus one or more reasoning models that spend extra compute before answering. Because the lineup rotates frequently, check the model picker in the app rather than relying on any published list."
  - question: "What is the difference between ChatGPT and the OpenAI API?"
    answer: "ChatGPT is a consumer application with a conversation UI, memory, file uploads, and built-in tools layered on top of a model. The API gives you raw model access with no UI and no hidden system prompt, billed per token, so you control context, parameters, and orchestration yourself. Anything you build for production should target the API, not the chat app."
  - question: "Does ChatGPT know about recent events?"
    answer: "Every model has a training cutoff, after which it has no built-in knowledge of the world. ChatGPT compensates by searching the web when a question looks time-sensitive, but that behavior is not guaranteed on every turn. For anything where recency matters, ask explicitly for sources and check them."
  - question: "Why does ChatGPT make things up?"
    answer: "The model generates the most plausible next token given the context, and plausibility is not the same as truth. When it lacks grounding for a specific fact — a citation, a statute, an API signature — it will still produce fluent output that looks correct. Retrieval, tool calls, and explicit source requests reduce the rate but do not eliminate it."
  - question: "Does ChatGPT remember previous conversations?"
    answer: "Paid and free tiers offer a memory feature that carries selected details across sessions, and you can inspect, edit, or delete what it has stored. Memory is separate from the context window, which only holds the current conversation. If consistency matters, put the durable instructions in custom instructions rather than relying on memory to pick them up."
  - question: "Is ChatGPT safe to use with company data?"
    answer: "Consumer tiers and business tiers have different data handling defaults, and the business and enterprise tiers are the ones designed for company use with administrative controls and non-training guarantees. Review the specific terms for the tier you are on before pasting anything sensitive. For regulated data, treat the chat app as out of scope and use the API under a reviewed agreement."
---

ChatGPT is a conversational application built on top of OpenAI's GPT family of large language models. You type; a model predicts a response token by token; a layer of product features — memory, file uploads, web search, code execution — makes that prediction loop useful for real work. It launched publicly on November 30, 2022 and became the reference point against which every other AI assistant is now measured.

That framing matters, because most confusion about ChatGPT comes from conflating the product with the model. They are different things, they change on different schedules, and they behave differently.

## The model underneath

ChatGPT is powered by transformer-based language models. The architecture does one thing: given a sequence of tokens, predict a probability distribution over the next token. Repeat, sampling from that distribution, and you get text.

Training happens in two broad phases.

**Pretraining** exposes the model to an enormous corpus of text and teaches it to predict continuations. This is where the model acquires grammar, world knowledge, code syntax, and the statistical shape of reasoning. It is also where the knowledge cutoff comes from — the model knows what was in that corpus and nothing after it.

**Post-training** shapes the raw predictor into an assistant. Supervised fine-tuning on curated demonstrations teaches the model to follow instructions. Reinforcement learning from human and AI feedback pushes it toward responses people rate as helpful, honest, and harmless. Most of what you perceive as ChatGPT's "personality" is post-training, not pretraining.

### Reasoning models versus general models

The model picker in ChatGPT usually offers at least two classes of model. General-purpose models answer immediately and are tuned for speed and conversational fluency. Reasoning models spend additional compute before responding, generating intermediate reasoning that is partially or fully hidden from you, and are meaningfully better at math, multi-step logic, and hard debugging.

The tradeoff is latency and cost. A reasoning model can take tens of seconds on a problem a general model answers in two. Use the reasoning models when the answer has a verifiable right and wrong; use the fast models for drafting, summarizing, and brainstorming.

The specific model names rotate every few months. Any article that hard-codes them goes stale fast, so treat the model picker in the app as the source of truth.

## Chat interface versus the API

This is the distinction that trips up most teams evaluating ChatGPT for production.

The **chat app** is a full product. It injects a system prompt you never see, manages your conversation history, decides when to invoke web search or code execution, applies memory, and enforces per-tier rate limits. Its behavior can change without notice because OpenAI ships product updates continuously.

The **API** is raw model access. You send messages, you get a completion, you pay per input and output token. There is no hidden system prompt, no memory, no automatic tool invocation. You supply the system prompt, you manage conversation state, you decide which tools to expose and when to call them.

| Dimension | ChatGPT app | OpenAI API |
|---|---|---|
| Pricing model | Flat subscription tiers | Metered per token |
| System prompt | Hidden, OpenAI-controlled | Yours, fully visible |
| Conversation state | Managed for you | You store and resend it |
| Model version | Selected from a rotating picker | Pinned to a version string |
| Tools | Built in (search, code, files) | You define and wire them |
| Reproducibility | Low — product updates change behavior | High — pinned versions |
| Right for | Individual work, exploration | Products, pipelines, automation |

In code, an API call is explicit about everything the app hides — the system prompt, the model version, and the full message history you choose to send:

```python
from openai import OpenAI

client = OpenAI()  # reads OPENAI_API_KEY from the environment

response = client.responses.create(
    model="<current-model-id>",  # pin a specific version; the lineup rotates
    input=[
        {"role": "system", "content": "Answer only from the supplied context. "
                                      "If the context is insufficient, say so."},
        {"role": "user", "content": user_question},
    ],
)

print(response.output_text)
```

The practical rule: if a human is reading every output, the app is fine. If code is consuming the output, use the API. Our [OpenAI API tutorial](/articles/openai-api-tutorial/) covers the implementation side in detail.

## What ChatGPT is genuinely good at

Being specific here is more useful than a general endorsement.

**Transformation over generation.** Give it source material and ask it to reshape that material — summarize, restructure, translate, convert a transcript into meeting notes, turn a spec into a test plan. The source constrains the output and dramatically reduces hallucination.

**First drafts of structured writing.** Emails, documentation outlines, release notes, job descriptions, SQL queries against a schema you paste in. It gets you to 70 percent in seconds, which is where the value is; the last 30 percent is yours.

**Explaining unfamiliar material.** Paste a dense paper section, an unfamiliar codebase file, or a legal clause and ask for a plain-language explanation with the jargon defined. This is one of the highest-reliability uses because you can sanity-check the explanation against the source in front of you.

**Code at the function and file level.** Writing a parser, converting between formats, explaining a stack trace, generating boilerplate. Dedicated tools do better on repository-scale work — see our roundup of the [best AI coding assistants](/articles/best-ai-coding-assistants/) — but for a self-contained snippet the chat interface is fast and effective.

**Adversarial review.** Ask it to argue against your plan, list the assumptions you have not tested, or find the weakest paragraph in your draft. Critique is a genuinely strong mode because it does not require the model to be right about facts, only to be a competent skeptic.

## Where it falls down

**Hallucination.** The model produces the most plausible continuation, and plausible is not the same as true. It will invent citations, API methods, case law, and statistics with complete confidence. This is not a bug that will be patched away; it is a property of probabilistic text generation. Grounding — retrieval, tool calls, pasted source documents — reduces the rate substantially, which is why [retrieval-augmented generation](/articles/what-is-rag/) matters for any serious deployment.

**Stale knowledge.** Anything after the training cutoff is unknown unless the model searches for it. The app often does search, but not always, and it does not reliably announce when it has not. Ask for sources when recency matters.

**Arithmetic and precise counting.** Language models are unreliable at exact arithmetic on long numbers and at tasks like counting characters. The code execution tool fixes this when it fires. It does not always fire.

**Long-document fidelity.** Given a very long input, models attend unevenly across it. Detail in the middle of a large document gets lost more often than detail at the start or end. Chunking and asking targeted questions beats dumping 200 pages and asking for "anything important."

**Sycophancy.** Post-training optimizes partly for responses people like, and people like agreement. Push back on a correct answer and the model may cave. Never treat "it agreed with me" as evidence you were right.

**Non-determinism.** The same prompt can produce different answers. For workflows that need consistency, that is a design constraint, not a quirk to ignore.

## Free versus paid tiers

OpenAI structures access as a free tier, individual paid tiers, and business tiers. Specific names and limits change often enough that exact figures date quickly, so here is the durable shape of the ladder.

| Tier | Who it is for | What changes |
|---|---|---|
| Free | Casual and evaluation use | Access to a default model, lower rate limits, limited advanced tooling |
| Individual paid | Regular daily users | Higher limits, access to reasoning models, fuller tool access |
| Higher individual paid | Heavy or professional users | Highest limits, priority access to newest and most expensive models |
| Team / Business | Small teams | Shared workspace, admin controls, business data handling terms |
| Enterprise | Large organizations | SSO, compliance controls, custom retention, negotiated terms |

Two things are worth knowing regardless of tier. First, the free tier is a real product, not a crippled demo — it is enough to decide whether ChatGPT belongs in your workflow. Second, data handling defaults differ between consumer and business tiers, and that difference, not the rate limits, is usually what determines whether a company can adopt it. Check the terms for your specific tier before pasting anything you would not email to a stranger.

If you are assembling a stack on zero budget, our guide to the [best free AI tools](/articles/best-free-ai-tools/) covers what you can do without a subscription.

## Memory, custom instructions, and projects

Three features control what the model knows about you before you type anything.

**Custom instructions** are a persistent block of text prepended to your conversations. This is the highest-leverage setting in the entire product and most people never open it. Use it for durable facts: your role, your stack, your writing preferences, output formats you want by default, and things you never want it to do. "Do not open responses with a restatement of my question" and "always show units" are worth more than a hundred clever prompts.

**Memory** lets the model save details across sessions on its own initiative. It is convenient and occasionally annoying, because it can carry a one-off preference forward indefinitely. You can view, edit, and delete stored memories, and you should audit them periodically. Anything you actually depend on belongs in custom instructions, where it is explicit.

**Projects** group conversations and files under a shared instruction set. This is the right container for ongoing work — a codebase, a book, a research thread — because the context and the instructions stay scoped instead of leaking into unrelated chats.

Memory is not the context window. The context window is how much text the model can attend to in the current conversation. Memory is a small set of retrieved facts injected into it.

## Practical usage patterns

**Front-load context, then ask.** Paste the material first, state the constraints, then ask the question. Models weight recent instructions heavily, so the question should come last.

**State the output shape.** "Return a markdown table with columns X, Y, Z" beats hoping. For anything downstream of the model, specify the format explicitly.

**Use one thread per task.** Long meandering threads accumulate contradictory instructions and degrade. Start fresh when the topic changes.

**Ask for the reasoning, then verify the conclusion.** For anything consequential, "show your work" gives you something checkable. A confident conclusion with no visible path is the hardest kind of error to catch.

**Make it search when it matters.** Explicitly say "search the web and cite sources" for anything time-sensitive. Then open the links.

**Never accept numbers on trust.** Any figure the model produces without a cited source should be treated as a guess until you verify it.

Prompt structure has a measurable effect on output quality; our [prompt engineering guide](/articles/prompt-engineering-guide/) covers the patterns that hold up across models.

## How it fits against the alternatives

ChatGPT is no longer the only serious general assistant. Anthropic's Claude, Google's Gemini, and several strong open-weight models cover overlapping ground, and the gaps between the frontier offerings are narrower than marketing suggests. Differences show up in writing style, long-context behavior, tool ecosystems, and safety posture more than in raw capability on common tasks.

The honest advice is to test two assistants on your actual work for a week rather than reading comparisons. That said, our [Claude vs ChatGPT](/articles/claude-vs-chatgpt/) breakdown covers where the two diverge in practice.

## The bottom line

ChatGPT is a general-purpose text transformer with a good product wrapped around it. It is excellent at reshaping material you supply, drafting structured writing, explaining unfamiliar content, and acting as a fast critic. It is unreliable at facts it has not been given, arithmetic, recency, and any task where you cannot check the answer.

Treat it as a capable, fast, occasionally overconfident collaborator whose output you always review. Set custom instructions once. Ground it with source material whenever you can. Use the API, not the app, for anything a machine will consume. Under those constraints it is one of the highest-return tools available; outside them it will eventually embarrass you.
