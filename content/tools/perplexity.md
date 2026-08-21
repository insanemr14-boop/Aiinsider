---
name: "Perplexity"
tagline: "An answer engine that cites its sources, built to replace exploratory search rather than chat"
description: "Perplexity combines live web retrieval with language models to return sourced answers instead of link lists. Its Spaces, file upload and research modes make it a working tool for analysts rather than a general assistant."
seoTitle: "Perplexity Review: Answer Engine Features and Pricing Shape"
seoDescription: "A review of Perplexity: cited answers, deep research mode, Spaces, file uploads, the API, pricing tier shape and where its citations still need checking."
vendor: "Perplexity AI"
website: "https://www.perplexity.ai"
docs: "https://docs.perplexity.ai"
category: "Search & Research"
pricing: "freemium"
priceNote: "Free tier; paid individual, team and enterprise plans; separate API billing"
rating: 4.5
features: ["Cited answers", "Deep research mode", "Spaces", "File upload", "Focus filters", "Search API", "Model choice"]
pros:
  - "Inline citations make verification part of the workflow instead of an afterthought"
  - "Deep research mode compiles multi-source briefs that would take an analyst most of an hour"
  - "Focus filters restrict retrieval to academic, community or finance sources for cleaner results"
  - "The search API exposes the same retrieval layer for building grounded applications"
cons:
  - "Citations sometimes support the general claim but not the specific sentence attached to them"
  - "Source quality depends entirely on what ranks — SEO-optimized content can outweigh better material"
  - "Weaker than general assistants at drafting, coding and open-ended reasoning"
bestFor: "Analysts, researchers and writers who need fast, sourced answers on current topics and are willing to verify the citations."
relatedArticle: "perplexity-review"
featured: true
updatedDate: 2026-07-24
---

Perplexity's product decision was to treat citation as a first-class output rather than a compliance feature. That single choice changes how the tool gets used: because sources sit next to each claim, checking is cheap, and the answer becomes a starting point for verification instead of something you either trust or discard.

## Why that is a different product from a chatbot with browsing

Every major assistant can search the web now, and the difference is architectural rather than cosmetic. Perplexity retrieves first and generates from what it retrieved; a chat model with a browsing tool generates and reaches for the web when it decides it needs to.

The consequence is grounding. Perplexity's answers are constrained by the documents it pulled, so the failure mode is "the sources were bad" rather than "the model invented something". That is a much more tractable failure, because it is visible — you can see what it read.

It also means the interface is built for the workflow that follows. Sources are listed, hoverable, and organised. Follow-up questions inherit the retrieved context. The output is shaped like research rather than like conversation.

## Where the value concentrates

Deep research mode is the strongest feature. Give it a question that requires reading a dozen sources — a competitive scan, a regulatory change, a technical landscape review — and it returns a structured brief with the sources attached. That compresses a real chunk of analyst time, and the output is a document rather than a chat log.

Focus filters restrict retrieval to academic papers, community discussion, or finance sources. Narrowing the corpus before generating is a blunt instrument and a very effective one — an answer built from papers is a different answer from one built from whatever ranks.

Spaces collect sources, files and conversations around an ongoing topic, which is what turns the tool from a lookup into a workspace.

File upload closes the loop: ask questions across your own documents and the live web in the same query.

## The failure mode worth internalising

Citations are attached at the level of the answer, not always the sentence. A specific figure can appear sourced when the linked page does not contain it — the citation supports the surrounding claim, and the number came from somewhere else or from nowhere.

Spot-check anything you intend to publish or act on. The tool makes verification cheap; it does not perform it.

The second caveat is corpus quality. Retrieval surfaces what ranks, and what ranks is increasingly optimised content rather than good content. On commercial topics especially, Perplexity will confidently synthesise a consensus assembled from marketing pages.

And it is weaker than general assistants at drafting, coding and open-ended reasoning. It is a research instrument, not a replacement for one.

## Pricing

Free tier with limited use of the stronger modes, then paid individual, team and enterprise plans. The search API is billed separately and exposes the same retrieval layer for building grounded applications, which is an underused route for developers who want citations in their own product.

For anyone whose job involves answering factual questions daily, the paid tier is straightforward. For occasional use the free tier is genuinely serviceable.

## Who should choose it

Analysts, researchers, journalists and writers who need fast sourced answers on current topics and will verify the citations.

People who want one assistant for everything should use [ChatGPT](/tools/chatgpt/). People whose research runs over their own document set rather than the live web will get more from [NotebookLM](/tools/notebooklm/), which grounds strictly in what you upload.

Our detailed write-up is at [Perplexity review](/articles/perplexity-review/).
