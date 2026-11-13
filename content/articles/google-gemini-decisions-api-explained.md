---
title: "Google's Gemini Decisions API: A Model That Scores Options Instead of Writing Text"
description: "Google launched the Gemini Decisions API on 11 November 2026. It returns probability scores over fixed options rather than prose. Here is how it works, what it costs and where it fits."
excerpt: "Gemini Decision 1 answers up to 1,000 yes/no, multiple-choice or rubric questions per request and returns probabilities, not paragraphs. It targets the routing and classification steps inside agent workflows."
seoTitle: "Gemini Decisions API Explained: Pricing, Limits, Use Cases"
seoDescription: "Google's Gemini Decisions API launched 11 November 2026. How Gemini Decision 1 works, the 1,000-question limit, reported pricing, latency and when to use it."
author: engineering-desk
category: google-ai
tags: ["google-ai", "gemini", "ai-apis", "ai-agents", "classification", "ai-news"]
type: news
publishDate: 2026-11-13
featured: false
editorsPick: false
trending: true
heroAlt: "Abstract artwork representing branching decisions scored by a model"
faq:
  - question: "What is the Gemini Decisions API?"
    answer: "It is a Google API, launched in beta on 11 November 2026, that runs a model called Gemini Decision 1. Instead of generating text, it assigns probability scores to a fixed set of options you provide."
  - question: "What kinds of questions can it answer?"
    answer: "Three shapes: binary yes/no, multiple choice, and rubric-based scoring. One request can carry up to 1,000 questions over the same input."
  - question: "How much does the Gemini Decisions API cost?"
    answer: "Several outlets report $0.10 per million input tokens with no output charge. At least one outlet said pricing was not disclosed at launch, so confirm on Google's pricing page before you budget."
  - question: "Can it replace a normal LLM call?"
    answer: "Only where the answer is a choice among known options. It cannot write, summarize or explain. It is a replacement for the classification and routing calls that many teams currently send to a general-purpose model."
  - question: "Is it available on Google Cloud?"
    answer: "At launch it is in beta through the Gemini Developer API and Google AI Studio. Google Cloud support was reported as coming later."
---

Google launched the **Gemini Decisions API** on 11 November 2026. It is built on a new model, **Gemini Decision 1**, and it does something narrower than a chat model: you give it input and a fixed list of options, and it returns a probability for each option. It does not write text.

That sounds like a small product. It targets a large share of real production traffic.

## What problem does a decision model solve?

Look at what a typical agent or automation pipeline actually asks a language model. A large fraction of calls are not "write something". They are small judgments:

- Is this support ticket about billing, a bug or a feature request?
- Does this document contain personal data?
- Did the previous step succeed?
- Which of these five tools should handle the request?

Teams usually send these to a general-purpose model and then parse a word out of the response. That works, but it is slow, it costs output tokens, and it fails in annoying ways when the model adds a sentence you did not ask for.

A decision model removes the parsing problem. The output is a set of numbers, so there is nothing to parse and nothing to go off-script.

## How does the Gemini Decisions API work?

Based on Google's launch material and reporting from several outlets:

- **Question types:** binary, multiple choice, and rubric-based scoring.
- **Batching:** up to 1,000 questions in a single request, all asked about the same input.
- **Inputs:** text, images, audio, video and PDFs.
- **Context limit:** 262,144 tokens, shared across the input and all questions.
- **Output:** probability scores for each option.
- **Availability:** beta, through the Gemini Developer API and Google AI Studio. Google Cloud support is reported as coming later.

The batching is the interesting part. Asking 200 compliance questions about one contract is one request, with the document read once.

## What does it cost and how fast is it?

Reported pricing is **$0.10 per million input tokens, with output free**. One outlet reported that pricing was not disclosed alongside the launch, so treat the figure as provisional until you see it on Google's pricing page.

Google reports median latency of 50 to 100 milliseconds of model compute, or 150 to 250 milliseconds end to end. Those are the company's numbers. Measure from your own region before you design around them.

## How does it compare with the alternatives?

Google says Gemini Decision 1 beat OpenAI's competing Decisions API on seven of the nine benchmarks it tested. The independent picture is less flattering: Artificial Analysis placed it ninth of 18 models in its Decision Index at launch.

Both can be true. Vendor benchmarks are selected by the vendor, and an aggregate index weights tasks you may not care about. The practical comparison is against what you run today:

| Approach | Good at | Weak at |
|---|---|---|
| General LLM plus output parsing | Flexibility, explanations | Latency, cost, format drift |
| Fine-tuned small classifier | Speed, cost at scale | Needs training data, rigid |
| Decision API | No training, calibrated scores, batching | Fixed options only, no reasoning text |

## When should you use it?

**Good fits**

- Routing inside an agent: choosing a tool or a next step. See our guide to the [best AI agents](/articles/best-ai-agents/) for how routing fits into agent design.
- Content moderation and policy checks with a clear rubric.
- Bulk tagging of documents, tickets, calls or images.
- Guardrails: a cheap check before or after an expensive generation call.

**Poor fits**

- Anything where you need the model to explain its answer.
- Open-ended extraction, where the set of possible answers is not known in advance.
- Decisions with real consequences for a person and no human review. A probability is not a justification.

## What should you do now?

1. List the calls in your pipeline whose output is a label or a yes/no. That is your candidate traffic.
2. Build a labeled test set of a few hundred real examples.
3. Run the same set through your current approach and the Decisions API. Compare accuracy, latency and cost per thousand decisions.
4. Use the probability scores. Route low-confidence cases to a stronger model or a person instead of accepting every answer.

If you are new to calling model APIs in general, our [OpenAI API tutorial](/articles/openai-api-tutorial/) covers the basics that apply across vendors, and [Gemini vs Claude](/articles/gemini-vs-claude/) compares the two general-purpose model families.

## Sources

- [Google enters decision model market with Gemini Decisions API, SiliconANGLE](https://siliconangle.com/2026/11/11/google-enters-the-decision-model-market-with-gemini-decisions-api/)
- [Google Launches Gemini Decision 1 API For 1,000 Questions Per Call, Dataconomy](https://dataconomy.com/2026/11/12/google-launches-gemini-decision-1-api-for-1000-questions/)
- [Google's Gemini Decisions API Targets Faster, Cheaper AI Workflows, Channel Insider](https://www.channelinsider.com/ai/news-google-gemini-decisions-api-ai-agents-channel/)
