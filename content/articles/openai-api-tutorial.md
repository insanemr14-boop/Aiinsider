---
title: "OpenAI API Tutorial: From First Request to Production"
description: "A hands-on OpenAI API tutorial covering authentication, streaming, structured outputs, tool calling, embeddings, retries, cost control and a production checklist."
excerpt: "Everything between your first API call and a service you can put in front of users: key handling, streaming, structured outputs, tool calling, retries and token accounting."
seoTitle: "OpenAI API Tutorial: Python and JavaScript Examples"
seoDescription: "Learn the OpenAI API hands-on: auth, streaming, structured outputs, function calling, embeddings, backoff retries and cost control, with runnable code."
author: engineering-desk
category: ai-apis
tags: ["ai-apis", "openai", "python", "javascript", "ai-engineering", "structured-outputs"]
type: guide
publishDate: 2026-07-16
featured: false
editorsPick: false
trending: false
heroAlt: "Terminal and code editor panels showing an API request and a streaming response"
faq:
  - question: "How do I store an OpenAI API key safely?"
    answer: "Keep the key in an environment variable or a secrets manager, never in source control and never in client-side code. Any key shipped to a browser or mobile app should be treated as public, so browser applications must call your own backend, which holds the key and enforces authentication and rate limits."
  - question: "What is the difference between the Responses API and Chat Completions?"
    answer: "Chat Completions is the long-standing message-in, message-out interface that most third-party tooling targets. The Responses API is the newer interface designed around multi-step interactions, built-in tools and server-side state, and it is the better starting point for new applications."
  - question: "How do I get guaranteed valid JSON from the API?"
    answer: "Use structured outputs with a schema rather than asking for JSON in the prompt. The API constrains token generation to match the schema, so the response parses and conforms to your field and enum definitions by construction rather than by luck."
  - question: "What is the right retry strategy for API errors?"
    answer: "Retry rate limit errors and server-side errors with exponential backoff and random jitter, and do not retry client errors such as malformed requests or authentication failures. The official SDKs retry a small number of times automatically, so configure that limit rather than writing your own loop unless you need custom behavior."
  - question: "How do I reduce API costs?"
    answer: "Route each task to the smallest model that passes your evaluation, cap output length explicitly, structure prompts so the stable prefix is cacheable, and move any workload that tolerates delay to the batch endpoint. Measuring cost per request in production usually reveals that a handful of endpoints account for most of the spend."
  - question: "What is prompt caching and how do I use it?"
    answer: "Prompt caching reuses computation for a repeated prompt prefix and bills those cached input tokens at a lower rate. It applies automatically to sufficiently long prompts, so the practical work is keeping your system prompt and few-shot examples byte-identical and placing all variable content after them."
  - question: "Should I count tokens before sending a request?"
    answer: "Counting tokens client-side is useful for enforcing context limits, chunking documents and estimating cost before a call. For accounting, use the usage object returned with each response, since it reflects what you were actually billed including cached and reasoning tokens."
  - question: "Can I use the same code with other model providers?"
    answer: "Many providers and local servers expose an OpenAI-compatible endpoint, so switching often requires only changing the base URL and model name. Compatibility is usually complete for basic chat and embeddings but partial for structured outputs, tool calling and streaming event shapes, so verify those paths rather than assuming."
---

This tutorial takes you from an empty project to an API integration you would be comfortable putting in front of users. It covers authentication, the first request, streaming, structured outputs, tool calling, embeddings, retries, cost control and the checks worth running before you ship.

Examples are Python unless noted, with a JavaScript streaming example included. Model names change frequently — check the models endpoint rather than copying identifiers from any tutorial, including this one.

## Setup and your first request

### Key handling

Install the SDK and set your key as an environment variable. The client reads `OPENAI_API_KEY` automatically.

```bash
pip install openai
export OPENAI_API_KEY="sk-..."
```

Five rules for keys, in order of how often they are broken:

**Never commit a key.** Use a `.env` file that is in `.gitignore`, or a secrets manager. Add a pre-commit secret scanner; this failure mode is common and expensive.

**Never ship a key to a client.** A key in a browser bundle or a mobile binary is public. Browser and mobile apps must call your backend, which holds the key and enforces its own authentication, quotas and abuse limits.

**Scope keys per project and environment.** Separate keys for development, staging and production, with separate spend limits, so a runaway loop in development cannot exhaust the production budget.

**Rotate on any suspicion.** Revocation is immediate and cheap. Deliberation is not.

**Set spend limits at the account level.** This is the only backstop that works when everything else fails.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
    timeout=30.0,      # fail fast rather than hanging a request thread
    max_retries=3,     # SDK-level retries with backoff, see below
)
```

Setting an explicit timeout matters more than it looks. The default is generous, and a hung upstream call with no timeout will exhaust your worker pool long before it surfaces as an API problem.

### Making the call

The Responses API is the current interface and the right default for new work. Chat Completions remains supported and is what most third-party tooling targets.

```python
response = client.responses.create(
    model="gpt-5-mini",
    input="Explain the difference between a bi-encoder and a cross-encoder in two sentences.",
)

print(response.output_text)
print(response.usage.input_tokens, response.usage.output_tokens)
```

For multi-turn conversations, pass a list of messages. The API is stateless by default: you resend the conversation each turn, which is why context grows and cost grows with it.

```python
messages = [
    {"role": "system", "content": "You are a concise technical assistant. Answer in under 80 words."},
    {"role": "user", "content": "When should I use a reranker?"},
]

response = client.responses.create(model="gpt-5-mini", input=messages)

messages.append({"role": "assistant", "content": response.output_text})
messages.append({"role": "user", "content": "What latency cost does that add?"})
```

Two parameters worth setting explicitly on every call. `max_output_tokens` caps runaway generations, which is both a cost control and a protection against a model that decides to write an essay. Temperature controls randomness — low values for extraction and classification, higher for creative work. Leave it at the default until you have evidence you need to change it.

The system message is where durable behavior belongs. Our [prompt engineering guide](/articles/prompt-engineering-guide/) covers what to put there and why the split from the user message matters for caching and safety.

## Streaming

For anything user-facing, stream. Time to first token is what users perceive as speed, and a streamed response feels several times faster than the same response delivered whole.

```python
with client.responses.stream(
    model="gpt-5-mini",
    input="Summarize the tradeoffs of HNSW versus IVF indexes.",
) as stream:
    for event in stream:
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)
        elif event.type == "response.error":
            raise RuntimeError(event.error)

    final = stream.get_final_response()
    print(f"\n\ntokens: {final.usage.total_tokens}")
```

The stream is a sequence of typed events, not just text fragments. Handle the delta event for display and the completion event for usage accounting, and ignore the rest until you need them.

JavaScript, with the same pattern:

```javascript
import OpenAI from "openai";

const client = new OpenAI(); // reads process.env.OPENAI_API_KEY

const stream = await client.responses.create({
  model: "gpt-5-mini",
  input: "Explain reciprocal rank fusion briefly.",
  stream: true,
});

for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta);
  } else if (event.type === "response.completed") {
    console.log(`\ntokens: ${event.response.usage.total_tokens}`);
  }
}
```

To stream to a browser, relay the events from your backend over server-sent events. Do not proxy the raw upstream stream — you want your own error handling, your own auth check, and the ability to cut a stream off when a user disconnects, which otherwise leaves you paying for tokens nobody reads.

## Structured outputs

Asking for JSON in the prompt produces valid JSON most of the time. Structured outputs make it valid by construction, because the API constrains token selection to the schema during generation.

```python
from pydantic import BaseModel, Field
from typing import Literal

class Extraction(BaseModel):
    company: str
    role: str
    seniority: Literal["junior", "mid", "senior", "lead", "unknown"]
    remote: bool
    salary_currency: str | None = Field(description="ISO 4217 code, null if unstated")

response = client.responses.parse(
    model="gpt-5-mini",
    input=[
        {"role": "system", "content": "Extract structured fields from job postings. Use 'unknown' rather than guessing."},
        {"role": "user", "content": posting_text},
    ],
    text_format=Extraction,
)

job = response.output_parsed     # a validated Extraction instance
print(job.company, job.seniority)
```

Schema design decides how well this works:

- Use enums for closed value sets. This removes near-miss values entirely.
- Keep the schema flat. Deeply nested structures are followed less reliably.
- Give every field a descriptive name and, where ambiguous, a description. The schema is part of the prompt.
- Provide an explicit path for uncertainty — a nullable field or an `"unknown"` enum member — so the model has somewhere to put low confidence instead of inventing a value.
- Put reasoning fields *before* decision fields. Generation is left to right, so a rationale written after a verdict is rationalization, not reasoning.

Structured output guarantees the shape, not the truth. A schema-valid response can still be wrong, so validate values against business rules separately.

## Tool calling

Tool calling lets the model request that your code run a function and hand back the result. The model never executes anything; it emits a structured request, you execute it, and you return the output.

```python
tools = [{
    "type": "function",
    "name": "get_order_status",
    "description": "Look up the current status of a customer order by its id.",
    "parameters": {
        "type": "object",
        "properties": {
            "order_id": {"type": "string", "description": "Order id, format ORD-000000"},
        },
        "required": ["order_id"],
        "additionalProperties": False,
    },
    "strict": True,
}]

conversation = [{"role": "user", "content": "Where is order ORD-004821?"}]

response = client.responses.create(
    model="gpt-5-mini",
    input=conversation,
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        args = json.loads(item.arguments)
        result = get_order_status(**args)          # your real function

        conversation += [
            item,
            {"type": "function_call_output",
             "call_id": item.call_id,
             "output": json.dumps(result)},
        ]

final = client.responses.create(model="gpt-5-mini", input=conversation, tools=tools)
print(final.output_text)
```

Practical guidance from production use:

**Tool descriptions are prompts.** The description and the parameter descriptions are how the model decides whether and how to call the tool. Vague descriptions cause wrong-tool selection more often than anything else.

**Keep the tool count manageable.** Selection accuracy degrades as the list grows. Past roughly a dozen tools, group them behind a router or split them by task.

**Set `strict: true`.** It enforces the parameter schema the same way structured outputs enforce response schemas.

**Never trust arguments.** The model can emit a syntactically valid `order_id` for an order belonging to someone else. Authorization checks belong in your function, applied against the authenticated user, not in the prompt.

**Loop with a hard limit.** Multi-step tool use is a loop, and a loop with a model in it needs a maximum iteration count and a wall-clock budget.

**Return errors as data.** A tool that raises should return a structured error the model can read and react to, not crash the request.

For sharing tool definitions across applications rather than redefining them per integration, see [how MCP works](/articles/how-mcp-works/).

## Embeddings

Embeddings convert text to vectors for search, clustering and classification. The API is simple; the operational details matter.

```python
resp = client.embeddings.create(
    model="text-embedding-3-small",
    input=[chunk["text"] for chunk in batch],   # batch, don't loop
    dimensions=512,                             # truncate to cut storage cost
)

vectors = [d.embedding for d in resp.data]
```

Four things to get right:

**Batch your requests.** Sending many inputs in one call is dramatically faster and cheaper in overhead than one call per document. Respect the per-request input limits and chunk accordingly.

**Use the same model for documents and queries.** Vectors from different models are not comparable. Changing embedding models means re-embedding the entire corpus, so record the model identifier alongside every stored vector.

**Consider reduced dimensions.** These models support truncation with graceful quality loss, which cuts storage and search cost meaningfully. Test the reduction against your retrieval evaluation set rather than assuming.

**Normalize if your store expects it.** Cosine similarity and inner product give identical rankings on unit-length vectors, and inner product is cheaper.

Where to put the vectors, and how to retrieve from them well, is covered in [vector databases explained](/articles/vector-databases-explained/).

## Error handling and retries

Four failure classes, with different correct responses.

| Error | Cause | Retry? |
|---|---|---|
| `AuthenticationError` (401) | Invalid or revoked key | No — fix configuration |
| `BadRequestError` (400) | Malformed request, context too long, policy violation | No — fix the request |
| `RateLimitError` (429) | Request or token rate exceeded, or quota exhausted | Yes, with backoff |
| `APITimeoutError` / `APIConnectionError` | Network or timeout | Yes, with backoff |
| `InternalServerError` (5xx) | Upstream fault | Yes, with backoff |

The SDK retries the retryable classes automatically with exponential backoff. Configure `max_retries` on the client and reach for a custom loop only when you need behavior the SDK does not provide — such as falling back to a different model.

```python
import random, time
from openai import RateLimitError, APIStatusError, APIConnectionError

def call_with_fallback(messages, primary="gpt-5", fallback="gpt-5-mini", attempts=5):
    delay = 1.0
    for attempt in range(attempts):
        model = primary if attempt < 2 else fallback
        try:
            return client.responses.create(model=model, input=messages)
        except (RateLimitError, APIConnectionError):
            pass
        except APIStatusError as exc:
            if exc.status_code < 500:
                raise                      # client error: retrying will not help
        time.sleep(delay + random.uniform(0, delay))   # jitter avoids thundering herd
        delay = min(delay * 2, 30.0)
    raise RuntimeError("exhausted retries")
```

Two details do most of the work. Jitter prevents synchronized clients from retrying in lockstep and re-creating the spike that caused the rate limit. And degrading to a smaller model rather than failing keeps the service available during a capacity event, usually at acceptable quality.

Beyond retries, put a circuit breaker in front of the provider so a sustained outage fails fast instead of queueing, and make requests idempotent where a duplicate would cause a side effect.

## Token accounting and cost control

Every response reports what you used. Log it.

```python
u = response.usage
log.info(
    "llm_call",
    extra={
        "model": response.model,
        "input_tokens": u.input_tokens,
        "cached_tokens": getattr(u.input_tokens_details, "cached_tokens", 0),
        "output_tokens": u.output_tokens,
        "prompt_version": PROMPT_VERSION,
        "endpoint": "triage",
    },
)
```

Logging model, prompt version and endpoint alongside token counts is what makes cost attributable later. Without it you know your total bill and nothing about where it goes.

Levers that actually reduce spend, in order of typical impact:

**Route to the smallest adequate model.** Most production traffic is classification, extraction, routing and summarization, all of which small models handle well. Reserve the largest model for the requests that measurably need it. Build the routing decision on evaluation results, not intuition.

**Exploit prompt caching.** Repeated prompt prefixes above a threshold length are cached and billed at a reduced rate automatically. To benefit, keep the system prompt and few-shot examples byte-identical and place every variable element after them. A timestamp or a user id near the top of the prompt defeats the cache entirely — an easy and expensive mistake.

**Cap output.** Set `max_output_tokens`. Output tokens are billed at a higher rate than input tokens, and unbounded generation is the most common source of surprise cost.

**Use the batch endpoint for anything asynchronous.** Bulk classification, backfills, embedding a corpus and offline evaluation all tolerate a completion window and cost substantially less through batch processing.

**Trim context.** Resending an entire conversation every turn is the default and it is quadratic. Summarize older turns, or keep a rolling window plus a running summary.

**Watch reasoning tokens.** On reasoning models, internal reasoning is billed as output even though you never see it, and effort settings change that volume considerably. Measure the difference on your workload before choosing a setting.

Counting tokens locally with a tokenizer library is useful for enforcing limits and chunking documents before you call. For billing accuracy, trust the usage object.

## Working with other providers

Many providers and local servers implement an OpenAI-compatible endpoint, so switching frequently means changing two values:

```python
local = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

resp = local.responses.create(model="qwen3:8b", input="Hello")
```

Compatibility is generally complete for basic chat and embeddings and partial for structured outputs, tool calling and streaming event shapes. Test those paths explicitly. Running open-weight models behind the same interface is a practical hedge against pricing and availability risk — see [top open source LLMs](/articles/top-open-source-llms/) for the model and serving options.

## Production checklist

Before this goes in front of users:

- [ ] Keys in a secrets manager, never in the repo, never in client code, spend limits set
- [ ] Explicit timeout and retry configuration on the client
- [ ] Exponential backoff with jitter, plus a circuit breaker for sustained failures
- [ ] A model fallback path for capacity events
- [ ] `max_output_tokens` set on every call
- [ ] Structured outputs with schemas anywhere the response is parsed
- [ ] Authorization enforced inside tool implementations, not in the prompt
- [ ] Iteration and wall-clock limits on any tool-calling loop
- [ ] Untrusted content delimited and labeled as data, with output validated before use
- [ ] Token usage logged per request with model, prompt version and endpoint
- [ ] Per-user rate limiting on your own endpoint, independent of provider limits
- [ ] Streaming for user-facing responses, with cancellation on disconnect
- [ ] An evaluation suite that runs before any prompt or model change
- [ ] Alerting on error rate, p95 latency and cost per hour
- [ ] Content moderation on both input and output where the surface is public

The security items are not optional for anything handling untrusted input — [AI security risks](/articles/ai-security-risks/) covers the threat model, of which prompt injection through tool results and retrieved documents is the most commonly underestimated.

## The bottom line

The API surface is small: create a response, stream it, constrain it with a schema, give the model tools, embed text. A weekend gets you fluent in all of it.

The work that separates a prototype from a production service is elsewhere — key hygiene, timeouts, backoff with jitter, model fallback, cost attribution per endpoint, authorization inside tools, and an evaluation suite that runs before every change. Build those in from the start; retrofitting them after an incident is how most teams end up doing it.

More in the [AI APIs category](/category/ai-apis/).
