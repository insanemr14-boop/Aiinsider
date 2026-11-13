---
title: "EU AI Act: What Changes on 2 December 2026 for Generative AI"
description: "On 2 December 2026 the EU AI Act's content-marking deadline arrives for generative AI systems already on the market, and two new prohibitions take effect. A plain-language guide to who is affected."
excerpt: "The grace period for older generative AI systems to add machine-readable marking ends on 2 December 2026. Here is what the deadline covers, what was delayed, and what teams should check now."
seoTitle: "EU AI Act 2 December 2026 Deadline: Who Must Do What"
seoDescription: "The EU AI Act's 2 December 2026 deadline: content marking for older generative AI systems and two new prohibitions. What applies, what was delayed, and what to check."
author: research-desk
category: ai-news
tags: ["eu-ai-act", "ai-regulation", "ai-ethics", "generative-ai", "compliance", "ai-news"]
type: news
publishDate: 2026-11-13
featured: false
editorsPick: false
trending: true
heroAlt: "Abstract artwork representing regulation and labelled AI-generated content"
faq:
  - question: "What happens under the EU AI Act on 2 December 2026?"
    answer: "Two things, according to published commentary on the amended Act. Generative AI systems that were already on the EU market before 2 August 2026 must meet the machine-readable marking duty for their outputs, and two new prohibited practices begin to apply."
  - question: "Does the deadline apply to systems launched after August 2026?"
    answer: "No. Systems placed on the market on or after 2 August 2026 had to mark their outputs from launch. The 2 December date is a transition period for older systems only."
  - question: "Were the high-risk AI rules delayed?"
    answer: "Yes. The Digital Omnibus on AI moved the obligations for Annex III high-risk systems to 2 December 2027 and for Annex I systems to 2 August 2028."
  - question: "Does the EU AI Act apply to companies outside the EU?"
    answer: "It can. The Act applies to providers that place AI systems on the EU market and, in some cases, where the output is used in the EU, regardless of where the company is based."
  - question: "Is this article legal advice?"
    answer: "No. It is a summary of public reporting. Article numbering and exact wording should be checked against the consolidated text on EUR-Lex, and decisions should be made with qualified legal counsel."
---

The next date that matters in the EU AI Act is **2 December 2026**. It is not the start of the Act's transparency rules, which have applied since August. It is the end of a transition period for generative AI systems that were already on the market, plus the start of two new prohibitions.

This guide summarizes public reporting and legal commentary. It is not legal advice, and you should check the consolidated text on EUR-Lex before acting on any detail.

## How did we get here?

The AI Act's timeline was reshaped this year by the **Digital Omnibus on AI**, Regulation (EU) 2026/1744. It was published in the Official Journal on 24 July 2026 and entered into force on 27 July 2026.

The Omnibus did two things that matter for this deadline:

1. It **delayed the high-risk obligations**: Annex III high-risk systems to 2 December 2027, and Annex I systems to 2 August 2028.
2. It **left the transparency rules largely on schedule**, with one concession for systems already on the market.

So while much of the Act was pushed back, the rules about labelling AI-generated content were not.

## What applies from 2 December 2026?

### Machine-readable marking for older generative systems

Article 50 of the Act requires providers of generative AI systems to mark their outputs in a machine-readable way so the content can be detected as artificially generated or manipulated.

The timing splits by launch date:

| System placed on the EU market | Marking duty applies from |
|---|---|
| On or after 2 August 2026 | Launch |
| Before 2 August 2026 | 2 December 2026 |

If your generative product has been available in the EU since before August, the grace period is about to end.

### Two new prohibited practices

Commentary on the amended Act reports that two additions to the list of prohibited AI practices apply from the same date, covering AI systems used to produce non-consensual intimate imagery and child sexual abuse material.

### What is already in force

Duties on **deployers**, the organizations using AI systems rather than building them, have applied since 2 August 2026 with no transition. That includes disclosing deepfakes and certain AI-generated text published to inform the public.

## Who is affected?

- **Providers of generative AI systems** offering text, image, audio or video generation in the EU. This is the group with the 2 December marking deadline.
- **Businesses that build on someone else's model.** If you ship a product under your own name, you may be the provider of that system for the Act's purposes, even though you did not train the model. Check what marking your upstream vendor applies and whether it survives your pipeline.
- **Companies outside the EU** whose systems are placed on the EU market.
- **Deployers** publishing AI-generated or manipulated content, who already have disclosure duties.

## What should teams check now?

1. **Inventory.** List every generative feature available to EU users and the date it launched there.
2. **Marking.** For each, confirm outputs carry machine-readable marking and that it is not stripped by your own post-processing, such as image resizing, format conversion or text cleanup.
3. **Vendors.** Ask model providers in writing what marking they apply and what they commit to in their terms.
4. **Disclosure.** Confirm that user-facing disclosure for deepfakes and public-interest text is in place. That duty is already live.
5. **Records.** Keep evidence of what you implemented and when. If a regulator asks, a dated record is far better than a recollection.

Marking is a technical problem as well as a legal one. Watermarks can be fragile, and metadata is easy to remove. Treat it as an engineering requirement with tests, not a one-time setting.

## Has anyone been fined yet?

As of early November 2026, published commentary reported no announced fines under the AI Act. Enforcement capacity is still being built in member states, and the Commission has continued to publish implementing rules, including one on regulatory sandboxes reported on 12 November that gives small companies and startups free participation.

The absence of fines so far is not a signal that the rules are optional. Early enforcement under earlier EU digital laws followed the same pattern: a quiet first year, then cases.

## The wider picture

For AI builders, the practical lesson of 2026 is that the EU delayed the hardest obligations and kept the visible ones. Content transparency is the part of the Act users can see, and it is the part arriving first. Teams working on AI risk more broadly may also find our guide to [AI security risks](/articles/ai-security-risks/) useful, since the governance work overlaps.

## Sources

- [EU AI Act: what applies from 2 December 2026, CASRAI](https://casrai.org/news/eu-ai-act-2-december-2026-obligations-article-50)
- [EU AI Act Deadlines After the Digital Omnibus, Technology.org](https://www.technology.org/2026/10/13/eu-ai-act-deadlines-after-the-digital-omnibus-what-applies-from-december-2026-to-august-2028/)
- [EU rules for AI regulatory sandboxes, MLex](https://www.mlex.com/mlex/artificial-intelligence/articles/2549151)
- [AI Act standardisation, European Commission](https://digital-strategy.ec.europa.eu/en/policies/ai-act-standardisation)
