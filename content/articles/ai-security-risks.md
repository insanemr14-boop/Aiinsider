---
title: "AI Security Risks: Prompt Injection, Agents and Real Controls"
description: "A defensive analysis of AI security risks — prompt injection, data exfiltration via tools, agent blast radius, MCP supply chain, data poisoning and PII leakage — plus controls that work."
excerpt: "The security model of an LLM application is different from a web application's, and most teams are still applying the old one. Here are the real risk classes and the controls that reduce them."
seoTitle: "AI Security Risks and Controls That Actually Work"
seoDescription: "Prompt injection, agent blast radius, MCP supply chain risk and PII leakage — the AI security risks that matter and the defensive controls that reduce them."
author: editorial-team
category: ai-security
tags: ["ai-security", "prompt-injection", "ai-agents", "mcp", "llm-security", "data-privacy"]
type: analysis
publishDate: 2026-07-08
updatedDate: 2026-07-30
featured: false
editorsPick: true
trending: true
heroAlt: "Layered security shield diagram representing controls around an AI agent system"
faq:
  - question: "What is prompt injection?"
    answer: "Prompt injection is an attack where instructions embedded in content the model processes are interpreted as commands from the operator. It works because a language model sees system instructions, user input and retrieved data as one undifferentiated token stream, with no structural boundary between trusted and untrusted text."
  - question: "What is the difference between direct and indirect prompt injection?"
    answer: "Direct injection comes from the person talking to the system, who is trying to override its instructions. Indirect injection comes from content the system reads on their behalf — a web page, a document, an email, a code comment — which means the attacker never has to interact with your application at all."
  - question: "Can prompt injection be fixed with better prompting?"
    answer: "Instructional defenses such as telling the model to ignore embedded commands raise the cost of an attack but do not eliminate it. Because the underlying cause is architectural, durable mitigation comes from limiting what the model is permitted to do rather than from persuading it to behave."
  - question: "What is agent blast radius?"
    answer: "Blast radius is the total set of actions and data an agent can reach when something goes wrong, whether through an attack, a misunderstanding or a model error. An agent with broad credentials and no approval gates has a blast radius equal to those credentials, which is why least privilege matters more for agents than for chat interfaces."
  - question: "Are MCP servers a security risk?"
    answer: "An MCP server is third-party code that runs with your credentials and can inject text directly into a model's context. That combination means it should be reviewed like a dependency with production access — pinned versions, source review, scoped tokens and monitoring — rather than installed casually."
  - question: "How do you stop an AI system leaking customer data?"
    answer: "Layer three controls. Minimize what enters context in the first place through redaction and field-level filtering, restrict retrieval to what the requesting user is authorized to see, and scan outbound content before it reaches an external destination such as a webhook, email or web request."
  - question: "Does a human approval step actually help?"
    answer: "It helps when it is placed on irreversible actions and when the reviewer is shown enough context to make a real decision. Approval gates on every routine step produce fatigue and rubber-stamping, which is why the gate should be scarce, specific and informative."
  - question: "What is the single most effective AI security control?"
    answer: "Least privilege applied to tools and credentials. Most serious AI incidents are not exotic model exploits — they are ordinary authorization failures where a system was given more access than its task required, and an attacker or an error used all of it."
---

The security model of an LLM application differs from a web application's in one decisive way: there is no reliable boundary between instructions and data. Every piece of text a model processes — system prompt, user message, retrieved document, tool output — arrives as the same kind of token, and the model decides for itself what looks like a command.

That single property generates most of the risk classes below. This is defensive material: it describes what goes wrong and what reduces it, without providing attack tooling.

## The structural problem

Traditional application security depends on separating code from input. Parameterized SQL queries work because the database is told, structurally, which part is the query and which part is the value. There is no equivalent construct for a language model.

Techniques exist to signal provenance — delimiters, role tags, instruction hierarchies that train models to weight system instructions above retrieved content — and they measurably raise the cost of an attack. None of them is a boundary in the sense that a prepared statement is a boundary. Treat them as defense in depth, not as a fix.

The correct design assumption is therefore: **anything in the model's context may influence its behavior, and any tool the model can call may be called with attacker-influenced arguments.** Everything else follows from that.

## Prompt injection

### Direct injection

Direct injection is the user attempting to override the operator's instructions — to reveal a system prompt, to bypass a policy, or to reach a capability the interface was not meant to expose. It is the most discussed variety and usually the least damaging, because the attacker is acting under their own account with their own permissions.

The real cost of direct injection is usually reputational or contractual: a support assistant coaxed into making a commitment the business will not honor, or a public-facing bot induced to produce content that embarrasses the brand.

### Indirect injection

Indirect injection is the serious one. Here the malicious instruction lives in content the system retrieves on a legitimate user's behalf — a web page it summarizes, a PDF in a knowledge base, a code comment in a dependency, an email in an inbox it has been asked to triage, an issue description in a ticket tracker.

Three properties make it dangerous. The attacker never touches your application, so perimeter controls see nothing unusual. The injected instruction executes with the *victim's* privileges, not the attacker's. And the content can be planted long before it is read, which makes the timeline of an incident hard to reconstruct.

Indirect injection is why an agent that both reads untrusted content and holds meaningful credentials is a fundamentally risky configuration, independent of how well it is prompted.

### What actually reduces it

Provenance tracking helps: tag content by trust level as it enters context, and make tool permissions depend on that tag. If a session has ingested untrusted external content, downgrade what it can do afterwards — a pattern sometimes described as taint tracking for context.

Structural separation helps: process untrusted content in a session that has no tool access at all, and pass only a validated, schema-constrained summary into the privileged session. The untrusted text never meets the credentials.

## Data exfiltration through tool use

Exfiltration is where injection converts into loss. A model cannot leak data on its own; it needs an outbound channel, and tools are the channel.

The channels that matter in practice:

- **Network fetch.** Any tool that retrieves a URL can carry data in the URL itself.
- **Rendered content.** Markdown images and links in a chat interface cause the client to make a request, which means a rendered response can transmit data without the user clicking anything.
- **Write-capable integrations.** Sending an email, posting a comment, creating a ticket, writing to a shared document — all move data out of the trust boundary.
- **Code execution.** Any sandbox with network egress is a general-purpose exfiltration path.

The controls are unglamorous and effective. Deny network egress by default in execution sandboxes and allowlist the specific hosts a workload needs. Strip or refuse to auto-load remote images in rendered model output. Constrain URL-fetching tools to an allowlist rather than the open internet. Log every outbound call with its full argument set so an incident can be reconstructed.

## The agent blast radius problem

A chat model that answers wrongly produces a wrong answer. An agent that reasons wrongly takes actions — and it takes them at machine speed, in sequence, before anyone reads a log line.

Blast radius is the set of everything an agent can reach. It is defined by three things: the credentials it holds, the tools it can call, and how many steps it can take without a human checkpoint. Most organizations size all three for convenience during a pilot and never revisit them when the pilot becomes production.

Two failure modes deserve separate attention.

**Compounding error.** Multi-step autonomy multiplies small failure probabilities. A step that is reliable in isolation becomes unreliable across a long chain, and an early misunderstanding propagates into every subsequent action.

**Confused deputy.** The agent is a trusted component acting for a less-trusted requester. If it does not carry the requester's authorization down into each tool call, it will happily perform actions the requester could never perform directly. Agent identity should be distinct from user identity, and tool calls should be authorized against the *user's* permissions, not the agent's service account.

Practical sizing rules: separate credentials per agent, scoped to the narrowest task; read and write separated into different tools with different permissions; a hard step limit with escalation to a human on exceeding it; and mandatory approval on anything irreversible — payments, deletions, external communications, permission changes, production deploys.

Our [Claude Code guide](/articles/claude-code-guide/) walks through what this configuration looks like for a coding agent specifically, and the [best AI agents](/articles/best-ai-agents/) roundup covers how different frameworks expose these controls.

## Supply chain risk in models and MCP servers

### Model provenance

Downloading weights from a public hub is a supply chain decision. Risks include serialization formats that execute code on load, models that have been fine-tuned to behave differently on specific trigger inputs, typosquatted repository names, and licensing that does not permit your intended use.

Reasonable hygiene: prefer safe tensor serialization formats over pickle-based ones, pin to specific commits rather than moving tags, verify checksums, mirror approved weights into internal storage, and evaluate a model on your own held-out set before it reaches production.

### MCP servers

The Model Context Protocol standardizes how tools and data reach an agent, and its adoption has been fast enough that server ecosystems now resemble early package registries — abundant, useful and largely unreviewed.

An MCP server occupies an unusually privileged position. It runs locally or in your infrastructure, it typically holds API credentials for the system it fronts, and its tool descriptions and outputs are injected directly into the model's context. That last property is the one teams miss: a malicious or compromised server can influence agent behavior through the text it returns, not just through the actions it performs.

Treat MCP servers as production dependencies. Review the source of anything you install. Pin versions and re-review on upgrade, because tool definitions can change silently between releases. Scope the credentials you hand them to the minimum. Run untrusted servers in a container with restricted egress. And keep an inventory — most organizations cannot currently list which servers their developers have connected. Our explainer on [how MCP works](/articles/how-mcp-works/) covers the protocol mechanics in detail.

## Training data poisoning and model integrity

Poisoning attacks corrupt behavior by manipulating what a model learns. The threat model varies sharply by deployment.

For frontier pretrained models, large-scale poisoning is difficult but the attack surface is enormous, since pretraining corpora include broad web crawls that anyone can write to. Research has repeatedly shown that a small number of well-placed documents can implant narrow behaviors, which is a sobering result given corpus sizes.

For your own fine-tuning and retrieval systems the risk is more immediate and more actionable. If you fine-tune on user-generated content, support tickets or scraped sources, you have a poisoning channel. If your RAG index ingests documents that users can upload, you have both a poisoning and an indirect injection channel in the same pipeline.

Controls: curate and version fine-tuning datasets with provenance metadata, apply anomaly detection to training data, hold out a clean evaluation set that never enters training, and gate the ingestion path into retrieval indexes with the same scrutiny you would apply to code.

## PII leakage

Personal data escapes AI systems through more paths than most threat models account for:

- **Prompt inclusion.** Full records pasted into context when three fields would do.
- **Retrieval over-scope.** An index that ignores per-user access control, so a query surfaces documents the requester cannot legitimately see.
- **Logging.** Prompt and completion logs, kept for debugging, that quietly become the largest unprotected store of customer data in the company.
- **Memory features.** Persistent memory that carries information from one user's session into another context.
- **Third-party training.** Consumer-tier services whose terms permit using submitted content to improve models.

Minimization is the highest-leverage control. Most prompts contain far more personal data than the task requires; passing an identifier and a small set of fields instead of a whole record removes the exposure rather than protecting it. After that: enforce authorization at retrieval time rather than filtering afterward, redact before logging, set aggressive log retention, and confirm the data-use terms of every tier you deploy on. Consumer and enterprise tiers of the same product frequently differ on this point.

## The controls that actually help

| Risk | Primary control | Supporting controls |
|---|---|---|
| Direct prompt injection | Output validation against a schema | Instruction hierarchy, refusal policies, rate limiting |
| Indirect prompt injection | No tools in sessions that read untrusted content | Provenance tagging, capability downgrade after ingestion, human approval on actions |
| Data exfiltration via tools | Egress allowlisting on every network-capable tool | Block auto-loaded remote images, full outbound call logging, DLP scan on outbound content |
| Agent blast radius | Least privilege per agent, scoped short-lived credentials | Step limits, approval gates on irreversible actions, read/write tool separation, kill switch |
| MCP and model supply chain | Source review and version pinning | Containment with restricted egress, credential scoping, server inventory, checksum verification |
| Training data poisoning | Curated and versioned datasets with provenance | Clean held-out evaluation set, ingestion gating, anomaly detection |
| PII leakage | Data minimization before context assembly | Authorization enforced at retrieval, redaction before logging, short retention, enterprise data terms |
| Excessive autonomy | Human approval on irreversible operations | Simulation or dry-run mode, transaction limits, staged rollout |

Four principles run through that table.

**Least privilege is the load-bearing control.** Most real incidents are authorization failures wearing an AI costume. If the agent could not have done the damaging thing, the injection does not matter.

**Allowlisting beats denylisting.** You cannot enumerate every dangerous command, host or file path. You can enumerate the permitted ones, and that list is usually short.

**Approval gates must be scarce to work.** A reviewer who approves forty prompts a day approves the forty-first without reading it. Place gates only on irreversible actions, and show the reviewer the actual arguments and expected effect.

**Sandboxing bounds what you failed to anticipate.** Containers with no credentials, no persistent storage and no egress turn an unknown failure into a contained one. This is the control that covers the attacks nobody has published yet.

## Building a program, not a checklist

Start with an inventory. Most organizations cannot answer basic questions: which AI systems are in production, what credentials each holds, what tools each can call, which MCP servers developers have connected. You cannot secure an estate you have not enumerated.

Then classify by blast radius rather than by model. A system with read-only access to public documentation needs light governance. A system with write access to customer records needs the full control set. Applying uniform process to both produces theater on one side and gaps on the other.

Add adversarial testing to your evaluation suite. Injection attempts, over-scoped retrieval probes and tool misuse cases belong in CI alongside functional tests, and they should be re-run on every model or prompt change, because behavior shifts between versions in ways that are not announced.

Finally, log for reconstruction. When something goes wrong you will need the full prompt, the retrieved context, the tool calls with arguments, and the outputs. Logs designed for debugging latency will not answer the question you actually have.

## The bottom line

AI security is mostly not a new discipline. It is authorization, input validation, supply chain hygiene and egress control applied to a component that is non-deterministic and cannot be trusted to distinguish instructions from data.

The uncomfortable conclusion is that prompt injection has no complete fix, and designs that depend on the model behaving correctly under adversarial input are unsound. The workable posture is to assume the model can be influenced and constrain what that influence can reach — narrow credentials, allowlisted tools and egress, approval on irreversible actions, sandboxes around the rest.

Teams that size permissions for a demo and never revisit them are carrying the most risk right now. For the broader context on how agentic deployment is changing, see our analysis of [AI trends in 2026](/articles/ai-trends-2026/), and the [ai-security category](/category/ai-security/) for ongoing coverage.
