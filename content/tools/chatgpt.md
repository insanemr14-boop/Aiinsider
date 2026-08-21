---
name: "ChatGPT"
tagline: "The general-purpose assistant that defined the category and still sets its default expectations"
description: "OpenAI's consumer-facing assistant, combining chat, web search, file analysis, image generation and voice in one interface. It is the broadest of the mainstream assistants and the one most third-party workflows assume you already use."
seoTitle: "ChatGPT Review: Features, Pricing Tiers and Limits"
seoDescription: "A practical review of ChatGPT: what the free and paid tiers actually include, where it leads other assistants, and the limits worth knowing first."
vendor: "OpenAI"
website: "https://chatgpt.com"
docs: "https://platform.openai.com/docs"
category: "Chat Assistants"
pricing: "freemium"
priceNote: "Free tier; paid individual, team and enterprise plans"
rating: 4.5
features: ["Web browsing", "Code interpreter", "Custom GPTs", "Voice mode", "Image generation", "Deep research", "Connectors"]
pros:
  - "Widest feature surface of any consumer assistant — search, code execution, files, images and voice in one place"
  - "Custom GPTs and connectors let non-developers package a workflow and share it internally"
  - "The API and the consumer product share a model family, so prototypes transfer cleanly to production"
  - "Mobile and desktop apps are genuinely good, including background voice conversations"
cons:
  - "Model naming and tier limits change often enough that guidance goes stale within months"
  - "Usage caps on the stronger reasoning models are opaque and hit heavy users mid-task"
  - "Long-context recall degrades on very large document sets compared with dedicated retrieval tooling"
bestFor: "Generalists who want one assistant covering writing, analysis, search and light coding without assembling a toolchain."
relatedArticle: "what-is-chatgpt"
featured: true
updatedDate: 2026-07-20
---

ChatGPT is the product that made the category legible to everyone else, and it still carries the advantages that come with being first: the largest ecosystem, the most third-party integrations, and a set of interface conventions that every competitor has since copied.

## What you are actually buying

The chat window is the smallest part of it. The paid product is a bundle: multiple models with different speed and reasoning trade-offs, web browsing, code execution in a sandbox, image generation, file and image understanding, voice, memory across conversations, and custom GPTs that package a system prompt and a set of files into something shareable.

That breadth is the honest reason to choose it. For a person who does not want to assemble a toolchain — who wants one subscription that handles drafting, analysis, a spreadsheet, a diagram and a quick script — nothing else is as complete in a single place.

The code interpreter is the most underrated component. Upload a messy CSV and ask a question and it writes and runs Python against the actual file rather than guessing from a sample. For analysts, that single feature justifies the subscription independently of everything else.

## Where it is genuinely strong

Breadth of task, speed of iteration, and recovery from vague instructions. Give ChatGPT an underspecified request and it produces something usable and asks a clarifying question, which is the right behaviour for exploratory work.

The ecosystem compounds this. Whatever workflow you are building, someone has written an integration, and the API that sits behind the consumer product is the most widely supported in the industry.

## Where it is weaker than the marketing implies

Long-form writing quality is a real gap. ChatGPT's default register — the confident summary, the tidy three-point structure, the closing paragraph that restates the opening — is recognisable enough that readers now identify it on sight. It can be prompted out of this, but it takes deliberate work, and competitors need less of it.

Instruction adherence over long documents degrades. Constraints given at the top of a lengthy task tend to be honoured for the first section and quietly relaxed later, which matters when the constraint was the point.

The model picker is a persistent usability problem. Multiple models with overlapping names, different capabilities and different limits, and no clear guidance about which to use when — most users pick one and never revisit, which often means using the wrong one for months.

## Pricing shape

A free tier with limited access to the better models, paid individual plans, and team and enterprise tiers that add administration, shared workspaces and data controls. API billing is separate and usage-based.

The individual paid tier is straightforward value for anyone using it daily. The enterprise decision is more nuanced and usually turns on data handling rather than capability: what is retained, what is used for training, and whether that survives your legal team's review. Get that answered before the pilot, not after.

## Who should use something else

For sustained writing and careful instruction-following on long documents, [Claude](/tools/claude/) is the better instrument. For research questions where you need sources attached to claims, [Perplexity](/tools/perplexity/) is built for the job and ChatGPT's browsing is a weaker substitute. For teams already deep in Google Workspace, [Gemini](/tools/gemini/) removes an integration problem. For cost-sensitive API work at volume, [DeepSeek](/tools/deepseek/) and other open-weight options are dramatically cheaper.

None of that makes ChatGPT the wrong default. It makes it a general-purpose tool in a market that increasingly rewards specialists — which is the ordinary fate of a product that got there first and stayed broad.

Our fuller explainer covers the model line-up and features in detail: [what is ChatGPT](/articles/what-is-chatgpt/), and the head-to-head is in [Claude vs ChatGPT](/articles/claude-vs-chatgpt/).
