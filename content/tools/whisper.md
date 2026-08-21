---
name: "Whisper"
tagline: "OpenAI's open-source speech recognition model, the default for self-hosted transcription"
description: "Whisper is an open-source automatic speech recognition model that transcribes and translates audio across many languages. Released under a permissive license, it can run locally or through hosted APIs and anchors most open transcription pipelines."
seoTitle: "Whisper Review: Open-Source Speech Recognition for Developers"
seoDescription: "A review of OpenAI Whisper: multilingual transcription accuracy, local deployment, optimized runtimes, licensing, and its diarization and latency limitations."
vendor: "OpenAI"
website: "https://github.com/openai/whisper"
docs: "https://platform.openai.com/docs/guides/speech-to-text"
category: "Voice & Audio"
pricing: "open-source"
priceNote: "Free under a permissive license; hosted API billed per minute of audio"
rating: 4.0
features: ["Multilingual transcription", "Speech translation", "Timestamped output", "Runs locally", "Permissive license", "Optimized runtimes"]
pros:
  - "Runs entirely on your own hardware, which resolves most audio privacy and residency concerns"
  - "Accuracy on accented and noisy speech holds up better than most open alternatives"
  - "Optimized reimplementations deliver large speedups on modest hardware"
  - "Permissive licensing allows commercial deployment without negotiation"
cons:
  - "No built-in speaker diarization, so multi-speaker transcripts need a second tool"
  - "Batch-oriented by design; real-time streaming requires additional engineering"
  - "Hallucinated text on silence and background noise is a known and persistent failure mode"
  - "Deploying it well means owning inference infrastructure and evaluation yourself"
bestFor: "Engineering teams that need accurate transcription without sending audio to a third party, and anyone building on-premise speech pipelines."
relatedArticle: "top-open-source-llms"
featured: false
updatedDate: 2026-06-18
---

Whisper is the rare piece of AI infrastructure that arrived, worked, and then quietly became the assumption underneath an entire layer of products. A large fraction of the transcription features you use are Whisper with a different logo.

## Why it displaced everything before it

Speech recognition before Whisper was a per-vendor, per-language, per-accent negotiation with accuracy that fell apart on anything but clean studio audio in a standard accent.

Whisper was trained on a very large and very messy multilingual corpus, and the result is robustness rather than peak accuracy on ideal input. It handles background noise, accents outside the training centre of gravity, code-switching mid-sentence, and audio recorded on a phone in a room with a fan. Commercial systems of the era were more accurate on clean input and much worse on everything else.

It also handles ninety-odd languages in one model, and translates to English directly. For anyone who had previously maintained a per-language pipeline, that consolidation alone was worth the migration.

## Free is doing real work here

The model is open under a permissive licence. You can run it on a laptop, on a server, on a phone with a quantised variant, and the marginal cost of a transcript is compute you already own.

That changes what gets built. Transcribing every support call, every meeting, every lecture, every archived recording is a decision about disk space rather than a budget line. Applications that were uneconomic at per-minute API pricing became obvious.

The ecosystem has extended it considerably: optimised implementations that run many times faster than the reference, speaker diarisation bolted on top, streaming variants for real-time use, and fine-tunes for specific domains.

## Where it fails, and how it fails

The failure mode is the important part. Whisper does not degrade into gibberish when confused — it hallucinates fluent, plausible text. Silence, music, crosstalk and very noisy passages can produce confident sentences that were never spoken.

For a searchable archive this is a minor annoyance. For medical, legal or compliance transcription it is a serious risk, because the output looks exactly as reliable as the correct parts. Voice activity detection before transcription mitigates it substantially and is not optional for high-stakes use.

Speaker diarisation is not included. Whisper tells you what was said, not who said it, and multi-speaker recordings need a separate model in the pipeline.

Real-time use requires work. The reference model is built for batch processing of complete files; streaming is a community solution rather than a native capability.

Timestamp precision at word level is approximate, which matters if you are cutting video to the transcript.

## Cost

Free under a permissive licence for self-hosting. The hosted API is billed per minute of audio and is cheap enough that for low volumes the engineering time to self-host is not worth saving.

The crossover is volume plus privacy. High volume favours self-hosting on economics; sensitive audio favours it regardless of economics.

## Who should use it

Anyone transcribing at volume, product teams adding speech input, researchers processing recorded material, and organisations that cannot send audio to a third party.

Teams that need synthesis rather than recognition want [ElevenLabs](/tools/elevenlabs/). Teams that want transcription bundled into a research workflow rather than as infrastructure should look at [NotebookLM](/tools/notebooklm/).

Whisper features in our survey of open models at [top open source LLMs](/articles/top-open-source-llms/).
