---
title: "How MCP Works: The Model Context Protocol Explained"
description: "MCP explained for engineers: the N×M integration problem, client/server architecture, tools/resources/prompts, stdio and HTTP transports, handshake and security."
excerpt: "The Model Context Protocol turns bespoke AI integrations into a standard interface. Here is the architecture, the three primitives, the handshake, the security model, and a working server."
seoTitle: "How MCP Works: Model Context Protocol Explained"
seoDescription: "A technical explainer on the Model Context Protocol — architecture, tools, resources, prompts, transports, lifecycle, security, and a minimal server example."
author: engineering-desk
category: mcp
tags: ["mcp", "ai-agents", "ai-apis", "anthropic", "developer-tools", "llms"]
type: analysis
publishDate: 2026-07-21
updatedDate: 2026-08-01
featured: false
editorsPick: true
trending: false
heroAlt: "Diagram-style illustration of a host application connecting to multiple protocol servers"
faq:
  - question: "What is the Model Context Protocol?"
    answer: "MCP is an open protocol that standardizes how AI applications connect to external tools and data sources. It defines a JSON-RPC interface where servers expose capabilities and clients consume them, so one integration works across every compatible AI application. Anthropic published it in late 2024 and other major vendors have since adopted it."
  - question: "What problem does MCP solve?"
    answer: "Without a standard, connecting M AI applications to N data sources requires M×N bespoke integrations, each maintained separately. MCP reduces that to M clients and N servers, so a single server written once works with every compatible host. It is the same argument that made the Language Server Protocol succeed in developer tooling."
  - question: "What are the three MCP primitives?"
    answer: "Tools are executable functions the model can invoke, resources are read-only data the application can load into context, and prompts are reusable templates a user can invoke deliberately. The distinction is about who controls invocation — model, application, or user respectively. Getting that mapping right is the main design decision when writing a server."
  - question: "What is the difference between stdio and HTTP transports?"
    answer: "The stdio transport runs the server as a local subprocess communicating over standard input and output, which is simple and requires no authentication because the process boundary is the trust boundary. The HTTP transport runs the server as a network service, supports multiple clients and remote hosting, and requires proper authorization. Use stdio for local tools and HTTP for shared or hosted services."
  - question: "Is MCP secure?"
    answer: "The protocol provides a security framework, but the trust decisions are yours. The main risks are prompt injection through tool descriptions and returned content, over-broad credentials granted to servers, and running untrusted third-party servers with access to sensitive systems. Treat an MCP server like any dependency with production access and review it accordingly."
  - question: "Do I need MCP to build an AI agent?"
    answer: "Direct function calling against a model API works fine for a single application with a fixed set of tools. MCP earns its keep when an integration will be reused across multiple applications, shared with other teams, or maintained separately from the app that consumes it. Portability is the value proposition, not capability."
  - question: "Which applications support MCP?"
    answer: "Support started with Anthropic's own clients and has since spread widely across AI assistants, IDEs, coding agents, and agent frameworks, including tools from other major model vendors. Because the protocol is open, any application can implement a client. Check the current documentation for whichever host you intend to target, since support is still expanding."
  - question: "Can one MCP server serve multiple clients?"
    answer: "A stdio server runs as a subprocess of a single host and serves that one client. An HTTP server can serve many clients concurrently, with each session tracked independently. If you need a shared team service, HTTP is the right transport."
---

The Model Context Protocol is an open standard for connecting AI applications to external tools and data. It defines a JSON-RPC interface where servers expose capabilities and clients consume them, so an integration written once works with every compatible AI application instead of just one.

Anthropic published MCP in late 2024. Adoption spread beyond Anthropic's own products quickly, including to other major model vendors, which is the outcome that turns a protocol into a standard.

## The N×M problem

Every AI application needs access to the same things: files, databases, issue trackers, documentation, internal APIs. Every one of those systems needs a wrapper that describes it to a model and executes calls against it.

Without a standard, that means M applications times N data sources bespoke integrations. Each is written separately, maintained separately, and breaks separately. Your Jira integration for one assistant does nothing for another.

MCP collapses this to M plus N. Write one Jira server; every MCP-capable host can use it. Write one client implementation in your application; every MCP server becomes available to it.

This is not a novel insight. The Language Server Protocol did exactly this for editors and language tooling, replacing a quadratic integration matrix with a linear one, and it won. MCP is the same bet applied to AI applications.

## Architecture: hosts, clients, and servers

Three roles, and the distinction between the first two trips people up.

**Host.** The AI application the user interacts with — a desktop assistant, an IDE, a coding agent, an internal tool. The host manages the model, the conversation, and the user's trust decisions.

**Client.** A connector inside the host. Each client maintains a one-to-one stateful connection with exactly one server. A host running five servers instantiates five clients. This isolation is deliberate: a server cannot see other servers' traffic, and the host controls what crosses between them.

**Server.** A program exposing capabilities over the protocol. It might wrap a database, a SaaS API, a local filesystem directory, or an internal service. Servers are typically small — a few hundred lines is common.

The important consequence of this design is that servers never talk to the model. They talk to a client, which hands data to the host, which decides what enters the model's context. The host is the policy enforcement point, which is where it belongs.

Communication uses JSON-RPC 2.0 for requests, responses, and notifications.

## The three server primitives

MCP servers expose three kinds of capability, distinguished by who decides when they are used.

### Tools — model-controlled

Executable functions the model chooses to call. Each tool has a name, a description, and a JSON Schema for its input. The model reads the descriptions and decides when a tool is relevant.

Tools are the primitive that does things: query a database, create a ticket, send a request, run a search. They can have side effects, which is why hosts typically require user approval before invocation.

Tool descriptions matter enormously. They are the entire interface the model sees. A vague description produces a tool the model calls at the wrong times or not at all.

### Resources — application-controlled

Read-only data identified by URI. A file, a database record, a documentation page, a log. Resources do not execute anything; they return content.

The distinction from tools is control. The host application decides which resources to load into context, often by presenting them to the user for selection. The model does not autonomously fetch resources.

Servers can support resource templates with URI parameters, and can notify clients when a resource changes.

### Prompts — user-controlled

Reusable templates the user invokes deliberately, typically surfaced as slash commands or menu items. A prompt takes arguments and returns a structured set of messages.

This is the least used primitive and the most underrated. It lets a server ship expertise, not just access — a code review prompt that encodes your team's standards, a triage prompt that structures an incident writeup.

| Primitive | Controlled by | Purpose | Side effects |
|---|---|---|---|
| Tools | The model | Perform actions, fetch dynamic data | Yes, typically |
| Resources | The host application | Supply context as readable content | No |
| Prompts | The user | Invoke a structured workflow | No |

There are also client-side primitives that flow the other direction: sampling lets a server request a model completion through the client, roots let the client tell a server which filesystem or URI boundaries it may operate within, and elicitation lets a server request additional input from the user. Support for these varies by host.

## Transports

MCP defines how messages move separately from what they mean.

**stdio.** The host launches the server as a subprocess and exchanges newline-delimited JSON-RPC messages over standard input and output. There is no network, no port, and no authentication layer, because the process boundary is the trust boundary — the server runs as the user who launched it, with that user's permissions.

This is the right choice for local tools: filesystem access, local databases, developer utilities. It is simple and it is what most MCP servers use.

**Streamable HTTP.** The server runs as a network service exposing a single endpoint that accepts POSTed JSON-RPC messages and can stream responses back using server-sent events when needed. This supports remote hosting, multiple concurrent clients, and session management.

HTTP transport requires real authorization. The specification builds on OAuth 2.1 patterns for this. If your server is reachable over a network, treat it as a public API surface, because it is one.

An earlier HTTP+SSE transport has been superseded by streamable HTTP; new servers should use the current one.

## Lifecycle and handshake

Every connection follows the same sequence.

**Initialize.** The client sends an `initialize` request declaring the protocol version it supports, its capabilities, and its identity. The server responds with the version it will use, its own capabilities, and its identity. Capability negotiation here is what lets the protocol evolve without breaking older implementations — each side only uses features the other advertised.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": { "roots": { "listChanged": true }, "sampling": {} },
    "clientInfo": { "name": "example-host", "version": "1.4.0" }
  }
}
```

**Initialized.** The client sends an `initialized` notification confirming it is ready. Only now may normal operation begin.

**Operation.** The client discovers what is available — `tools/list`, `resources/list`, `prompts/list` — and then invokes as needed: `tools/call`, `resources/read`, `prompts/get`. Servers may send notifications when their capability lists change, so clients should re-list rather than caching indefinitely.

**Shutdown.** For stdio, the client closes the input stream and the subprocess exits. For HTTP, the client closes the session.

## A minimal server

The official Python SDK makes a working server short. This one exposes all three primitives over a hypothetical release-notes system.

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("changelog")


@mcp.tool()
def search_releases(query: str, limit: int = 10) -> list[dict]:
    """Search release notes by keyword.

    Use this when the user asks what changed, when a feature shipped,
    or whether a specific bug was fixed. Returns matching releases
    with version, date, and a short summary.
    """
    results = release_index.search(query, limit=limit)
    return [
        {"version": r.version, "date": r.date.isoformat(), "summary": r.summary}
        for r in results
    ]


@mcp.resource("changelog://release/{version}")
def release_notes(version: str) -> str:
    """Full release notes for a specific version."""
    return release_index.get(version).body


@mcp.prompt()
def upgrade_report(from_version: str, to_version: str) -> str:
    """Draft an upgrade impact report between two versions."""
    return (
        f"Review every release between {from_version} and {to_version}. "
        "List breaking changes first, then required migration steps, "
        "then optional improvements. Cite the version each item came from. "
        "If a change has no migration note, say so explicitly."
    )


if __name__ == "__main__":
    mcp.run()
```

Note the tool docstring. It describes when to use the tool, not just what it does, because that is the decision the model has to make. This is the highest-leverage text in the entire server.

A host registers the server through configuration:

```json
{
  "mcpServers": {
    "changelog": {
      "command": "python",
      "args": ["-m", "changelog_server"],
      "env": { "RELEASE_DB_URL": "postgres://localhost/releases" }
    }
  }
}
```

## Security considerations

MCP hands models the ability to act on real systems. The protocol gives you a framework; the trust decisions are yours.

**Prompt injection through tool content.** Anything a tool returns enters the model's context. If a tool fetches a web page, reads an email, or queries a user-writable database, an attacker who controls that content can attempt to issue instructions to the model. This is an actively exploited class of vulnerability, not a theoretical one. Treat all tool output as untrusted input.

**Malicious tool descriptions.** Descriptions are also model-visible text. A hostile server can embed instructions in a description. This is why installing a third-party MCP server is equivalent to installing a dependency with production access — read the code or do not run it.

**Over-broad credentials.** A server given a database connection string can do anything that connection permits. Provision least-privilege credentials scoped to what the server actually needs, and prefer read-only wherever possible.

**The confused deputy problem.** A server holding credentials on behalf of a user can be induced to act with those credentials on someone else's instruction. Verify that the requesting identity is authorized for each action rather than assuming the connection implies authority.

**Token passthrough.** Do not accept a token issued for another service and forward it. Servers should validate that tokens were issued for them.

**Human approval on side effects.** Hosts should require confirmation before invoking tools that write, send, delete, or spend. Do not build a server that assumes the host will protect the user; make destructive operations explicit and separately named so approval is meaningful.

Our broader coverage of [AI security risks](/articles/ai-security-risks/) goes deeper on the injection surface.

## When to use MCP, and when not to

Use MCP when an integration will be consumed by more than one application, shared across teams, or maintained on a different schedule than the app using it. Portability is the value.

Skip it when you have one application with a fixed set of tools and no plans to reuse them. Direct function calling against a model API is fewer moving parts and easier to debug. A protocol you do not need is a layer of indirection you have to maintain.

MCP is also not a retrieval system. It is transport and interface. If your problem is finding the right document among a million, you still need [retrieval-augmented generation](/articles/what-is-rag/) — MCP is how the agent reaches your retrieval service, not the retrieval itself.

## Key takeaways

MCP standardizes AI-to-system integration the way LSP standardized editor tooling, converting an M×N problem into M plus N. Hosts contain clients, clients connect one-to-one with servers, and servers never talk to the model directly.

Three server primitives map to three controllers: tools for the model, resources for the application, prompts for the user. Getting that mapping right is the main design decision.

Use stdio for local servers and streamable HTTP with real authorization for anything networked. Negotiate capabilities at initialize and re-list rather than caching.

Security is where MCP deployments go wrong. Tool output is untrusted input, third-party servers are dependencies with production access, and credentials should be scoped to the minimum.

For how this fits into agent architecture, see our review of the [best AI agents](/articles/best-ai-agents/) and the [Claude Code guide](/articles/claude-code-guide/). More coverage at [/category/mcp/](/category/mcp/).
