---
title: "Case Study to Cold Outbound Sequence"
description: "Turns one customer case study into a four-email outbound sequence where each message uses a different angle and no email repeats the previous ask."
seoTitle: "Cold Email Sequence Prompt Built From a Case Study"
seoDescription: "A prompt that converts a customer case study into a four-touch outbound sequence, each email using a distinct angle with escalating specificity and clear asks."
category: "Marketing"
prompt: |
  You are a demand generation writer. You write cold emails a busy person
  would actually finish reading.

  ## Inputs
  Case study (the only source of outcomes you may cite):
  {{CASE_STUDY}}

  Target prospect: {{PROSPECT_ROLE}} at {{PROSPECT_COMPANY_TYPE}}
  Trigger or signal that makes now relevant: {{TRIGGER}}
  Sender: {{SENDER_ROLE}}

  ## Step 1 — Extract
  From the case study, pull:
  - The situation before (in the customer's terms, not yours)
  - The specific thing that changed
  - The outcome, exactly as stated — do not round, extrapolate, or embellish
  - One detail that makes the story feel real rather than generic

  ## Step 2 — Sequence
  Write 4 emails. Each has a distinct job. Do not repeat an angle.
  - Email 1 (day 0): the trigger. Under 90 words. One question as the ask.
  - Email 2 (day 3): the case study, compressed to three sentences. Ask is a
    specific yes/no.
  - Email 3 (day 7): a contrarian observation about how teams like theirs
    usually approach this, and why it stalls. No ask beyond a reply.
  - Email 4 (day 14): a one-line close that makes it easy to say no.

  For each, output: subject line (under 6 words), body, and the single ask.

  ## Constraints
  - Never state a metric, name, or outcome that is not in {{CASE_STUDY}}.
  - No email may exceed 120 words.
  - Do not open with "I hope this finds you well", "I came across", "I noticed
    you", or any compliment about their company.
  - No paragraph longer than 2 sentences.
  - Do not use the words "solution", "leverage", "synergy", "circle back",
    "touch base", or "quick call" more than zero times.
  - Every email must be readable and sensible on its own, since most
    recipients see only one.
variables: ["CASE_STUDY", "PROSPECT_ROLE", "PROSPECT_COMPANY_TYPE", "TRIGGER", "SENDER_ROLE"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "This uses role differentiation across a sequence: assigning each email a distinct job and a distinct ask prevents the standard failure where messages two through four are polite restatements of message one. The extraction step is a grounding gate — pulling the verifiable facts out before drafting keeps invented metrics from creeping in, which is the most common and most damaging error in AI-written outbound."
exampleOutput: |
  ## Extracted
  Before: three analysts spent the first week of every month reconciling
  numbers by hand.
  Change: reconciliation moved to an automated nightly job.
  Outcome (as stated): month-end close moved from nine days to four.
  Real detail: they kept the manual process running in parallel for two
  cycles before trusting it.

  ## Email 1 — day 0
  Subject: Your Q3 close
  Body: You just posted a controller role — usually means close is taking
  longer than it should.
  Most teams add people to a close problem before they change the process.
  Is your close currently over a week?
  Ask: one question, yes or no.

  ## Email 2 — day 3
  Subject: Nine days to four
  Body: A finance team your size had three analysts reconciling by hand every
  month. They automated the nightly reconciliation and close went from nine
  days to four.
  They ran both processes in parallel for two cycles first, which is the part
  most people skip.
  Worth a look at how they sequenced it?
tags: ["marketing", "outbound", "email", "sales-copy"]
featured: false
publishDate: 2026-06-20
---

## Usage tips

Paste the whole case study, including the boring operational details. The "real detail" the extraction step pulls out — running both processes in parallel, the internal skeptic, the thing that went wrong first — is what makes email two read as reporting rather than advertising.

`TRIGGER` should be an observable event: a job posting, a funding announcement, a product launch, a regulatory deadline. Without one, email one has no reason to exist and the sequence starts weak.

## On the word limits

The 120-word ceiling is doing real work. Models write long by default, and long cold emails do not get read. If output runs over, reply "Email 3 is 140 words. Cut to 100 without losing the contrarian observation" rather than rewriting it yourself.
