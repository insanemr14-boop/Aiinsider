---
title: "Bullet Notes to Voice-Matched Draft"
description: "Converts rough notes into a first draft that imitates a supplied writing sample, with strict rules against inventing facts the notes do not contain."
seoTitle: "Turn Bullet Notes Into a Voice-Matched First Draft"
seoDescription: "A prompt that drafts from your rough notes in your own writing voice, using a sample for style transfer and hard rules against inventing unsupported claims."
category: "Writing"
prompt: |
  You are a ghostwriter producing a first draft from someone else's notes.
  Fidelity to their notes and their voice matters more than polish.

  ## Writing sample (imitate this voice)
  {{VOICE_SAMPLE}}

  ## Raw notes (the only permitted source of facts)
  {{NOTES}}

  ## Parameters
  Format: {{FORMAT}}
  Target length: {{LENGTH}}

  ## Step 1 — Voice analysis
  Before drafting, extract from the writing sample:
  - Average sentence length and how much it varies
  - Paragraph length in sentences
  - Person and tense
  - Three characteristic constructions or habits
  - Two things this writer never does
  Output this as a short bulleted list.

  ## Step 2 — Draft
  Write the draft in {{FORMAT}} at approximately {{LENGTH}}, applying the voice
  profile you just extracted.

  ## Step 3 — Gaps
  List every place where the notes were too thin to write from, as questions
  for the author. Do not fill these gaps yourself.

  ## Hard constraints
  - Every factual claim must trace to {{NOTES}}. Invent nothing: no statistics,
    no examples, no names, no dates, no anecdotes.
  - Where the notes are ambiguous, choose the narrower reading.
  - Do not add a motivational opener or a summarizing conclusion unless the
    voice sample contains one.
  - If a section of the notes cannot be written responsibly, write
    [GAP: what is missing] inline rather than improvising.
variables: ["VOICE_SAMPLE", "NOTES", "FORMAT", "LENGTH"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "Two techniques combine here. The voice-analysis step is explicit feature extraction before style transfer: models imitate far more accurately when made to state the pattern before applying it, because the extracted profile becomes in-context guidance for every sentence. The inline [GAP] marker is a structured refusal channel — giving the model a legal way to say 'I don't have this' is the single most effective defense against fabricated detail in ghostwriting tasks."
exampleOutput: |
  ## Voice profile
  - Sentences average 14 words, high variance; frequent 4-word sentences
  - Paragraphs of 2-3 sentences
  - First person singular, present tense
  - Habits: opens sections with a claim; uses colons to introduce lists;
    ends paragraphs on the shortest sentence
  - Never: rhetorical questions, exclamation marks

  ## Draft
  Our deploy pipeline broke for a reason nobody wrote down. The failure was
  three years old and lived in a comment. That is the whole story.

  [GAP: notes say "the incident cost us a day" — a day of what? Engineering
  time, customer downtime, or delayed release?]

  ## Questions for the author
  1. What exactly did the day of cost consist of?
  2. Was the comment the only documentation, or was there a runbook too?
tags: ["writing", "ghostwriting", "style-transfer", "drafting"]
featured: false
publishDate: 2026-07-03
---

## Usage tips

Give the voice sample at least 300 words of your actual published writing, from the same format you are asking for. A sample of tweets will not produce a good long-form voice profile.

Read the voice profile before reading the draft. If the profile is wrong, the draft will be wrong in the same way, and correcting the profile is faster than correcting prose.

## Variation

For editorial teams, replace `VOICE_SAMPLE` with your style guide plus two published articles. The extraction step then produces a house-voice profile you can reuse across writers by pasting it directly in place of step one.
