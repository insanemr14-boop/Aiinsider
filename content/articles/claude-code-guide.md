---
title: "Claude Code Guide: Agentic Coding in the Terminal"
description: "A practical guide to Claude Code — installation, how it reads a codebase, CLAUDE.md, permissions, subagents, hooks, MCP servers and a real feature-branch workflow."
excerpt: "Claude Code puts an agent in your terminal that can read, edit and test a real codebase. Here is how it works, how to configure it safely, and how to use it on real work."
seoTitle: "Claude Code Guide: Setup, Workflow and Safety"
seoDescription: "Learn Claude Code from install to production workflow: CLAUDE.md, permissions, subagents, hooks, MCP servers, slash commands and a feature-branch example."
author: engineering-desk
category: claude-code
tags: ["claude-code", "ai-coding", "anthropic", "agents", "mcp", "developer-tools"]
type: guide
publishDate: 2026-06-18
updatedDate: 2026-08-02
featured: false
editorsPick: true
trending: false
heroAlt: "Terminal window showing an AI coding agent editing files in a project repository"
faq:
  - question: "What is Claude Code?"
    answer: "Claude Code is a command-line coding agent from Anthropic that runs inside your terminal and operates directly on a local repository. It can search files, read code, make edits, run tests and shell commands, and use Git — all within a permission system you control."
  - question: "How is Claude Code different from an editor extension like Copilot?"
    answer: "Editor completions predict the next few lines inside the file you have open. Claude Code works at the task level: it explores the repository on its own, changes several files, runs the test suite and iterates on failures. The unit of work is a task, not a keystroke."
  - question: "What does CLAUDE.md do?"
    answer: "CLAUDE.md is a Markdown file in your project that Claude Code loads automatically at the start of a session. It carries durable project context — build commands, architecture notes, coding conventions, things to never touch — so you do not have to repeat them in every prompt."
  - question: "Is it safe to let an AI agent run shell commands in my repository?"
    answer: "It is manageable if you configure it deliberately. Run inside a Git repository with committed work, keep the default permission prompts on for writes and shell commands, allowlist only the commands you trust, and never point it at production credentials. Treat every diff as a pull request from a new contributor."
  - question: "What are subagents in Claude Code?"
    answer: "Subagents are separate, scoped agent configurations with their own instructions and tool access that the main session can delegate to. They are useful for keeping a specialized job — code review, test writing, migration analysis — in its own context window so it does not crowd out the main task."
  - question: "Do I need MCP servers to use Claude Code?"
    answer: "MCP servers are optional. They extend the agent beyond your filesystem and shell to systems like issue trackers, databases and documentation sources. Start without them, then add a server when you find yourself repeatedly copying context in by hand."
  - question: "Can Claude Code work on large codebases?"
    answer: "It can, because it does not load the whole repository into context. It searches and reads selectively, the same way a new engineer would. On large repositories the main lever is a good CLAUDE.md that tells it where things live and which directories to ignore."
---

Claude Code is a terminal-based coding agent that works directly on a local repository: it reads files, edits them, runs your tests and shell commands, and uses Git. Unlike an autocomplete extension, the unit of work is a task rather than a line, and you supervise it through a permission system rather than by accepting individual suggestions.

This guide covers installation, how the agent actually navigates a codebase, the configuration surfaces that matter (CLAUDE.md, permissions, subagents, hooks, MCP, slash commands), and a realistic workflow for shipping a feature branch.

## What does agentic terminal coding actually mean?

An agentic coding tool differs from a completion model in one structural way: it has a loop. It takes a goal, decides which tool to call, observes the result, and decides again. That loop is why it can do things a completion model cannot — run a failing test, read the stack trace, locate the offending function, patch it, and re-run.

The tools it has are deliberately boring: read a file, write a file, search with glob and grep patterns, run a shell command, fetch a URL. Almost everything useful is a composition of those primitives. When Claude Code "understands your architecture," what actually happened is a sequence of searches and reads that it chose itself.

### Why is the terminal the right surface?

The terminal already has everything a coding agent needs: the filesystem, the test runner, the linter, the package manager, Git, and your existing tooling. Putting the agent there means it inherits your environment instead of reimplementing it. It also means the agent is editor-agnostic — the same session works whether you use Vim, VS Code or an IDE.

The trade-off is that you lose the inline diff review that editor integrations give you. You compensate with Git: work on a branch, review with `git diff`, and treat the agent's output like any other contributor's patch.

## How do you install Claude Code and start a session?

Claude Code installs as a global npm package and requires a recent Node.js runtime. You authenticate once, then run it from inside a project directory. Make the first session a read-only question rather than a feature request, because the answer tells you whether the agent has oriented itself in your codebase.

```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Move into a project and start a session
cd ~/projects/payments-api
claude
```

On first run you will be asked to authenticate — either with a Claude subscription account or an Anthropic API key, depending on how your organization bills. The session then starts in the current working directory, and that directory becomes the agent's root scope.

A good first prompt is not "write me a feature." It is a read-only question that tells you how well the agent has oriented itself:

```
> Read the repo and explain the request lifecycle for POST /v1/charges.
  Name the files involved and where validation happens. Do not edit anything.
```

If the answer is accurate, your project structure is legible and you can trust it with edits. If the answer is vague, that is a signal to write a CLAUDE.md before doing anything else.

### Useful startup flags

```bash
# Start with a one-shot prompt instead of the interactive REPL
claude -p "run the test suite and summarize failures"

# Continue the most recent session in this directory
claude --continue

# Pick from previous sessions
claude --resume
```

The one-shot mode (`-p`) is the building block for scripting. It prints to stdout, so it composes with pipes and CI steps.

## How does Claude Code read a codebase?

The agent does not ingest your repository wholesale. It behaves like an engineer on their first day: list the directory, read the README and package manifest, grep for the symbol it cares about, open the two or three files that matter.

This matters for two practical reasons. First, repository size is much less of a constraint than people expect — a million-line monorepo is navigable if the naming is sane. Second, discoverability is the real bottleneck. If your business logic lives in a file called `utils2.ts`, the agent will struggle exactly where a new hire would.

### The edit model

Edits are made as targeted string replacements against a file the agent has already read, not as whole-file rewrites. That has a useful property: if the file changed underneath it, the edit fails loudly instead of silently clobbering your work. When you see the agent re-read a file before editing, that is the mechanism working.

For new files it writes the whole thing. For refactors across many files it will typically search first, then apply the same edit repeatedly, checking as it goes.

### Verification is the differentiator

The single biggest quality lever is whether the agent can verify its own work. A repository with a fast, reliable test command produces dramatically better results than one where correctness can only be checked by a human clicking through a UI.

```bash
# The kind of thing that makes an agent effective
npm run test -- --run src/billing
npm run typecheck
npm run lint
```

If those commands exist and are fast, tell the agent about them in CLAUDE.md and it will run them unprompted after each change.

## What does CLAUDE.md do?

`CLAUDE.md` is a Markdown file at the root of your repository (or in a subdirectory, for scoped context) that is loaded automatically into every session. It is the highest-leverage file in the whole setup, because it converts repeated prompt corrections into permanent behavior.

Run `/init` in a fresh session and Claude Code will explore the repository and draft one for you. Then edit it down — generated versions tend to be too long.

```markdown
# Payments API

Node 22 + TypeScript, Fastify, PostgreSQL via Drizzle. Deployed on Fly.io.

## Commands
- `npm run dev` — local server on :3000
- `npm run test` — Vitest, must pass before any commit
- `npm run typecheck` — tsc --noEmit
- `npm run db:migrate` — apply migrations

## Conventions
- No default exports.
- All money values are integer minor units. Never use floats for currency.
- Route handlers stay thin; business logic lives in `src/services/`.
- Errors: throw `AppError` subclasses, never raw strings.

## Do not touch
- `src/generated/**` — generated from the OpenAPI spec
- `migrations/**` — write new migrations, never edit existing ones
```

Keep it short and specific. Vague style advice ("write clean code") consumes context and changes nothing. Constraints that are expensive to discover — money is integer minor units, never edit old migrations — are worth their weight many times over.

You can also keep personal, uncommitted preferences in a local settings file so they do not pollute the shared repository file.

## Is it safe to let Claude Code run shell commands?

It is manageable if you configure it deliberately. Claude Code asks before it does anything consequential: by default reads are free, while writes, shell commands and network access prompt for approval. The prompt gives you three answers — allow once, allow for the rest of the session, or reject with feedback.

Manage standing rules with `/permissions`, which writes to your project or user settings:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run test:*)",
      "Bash(npm run typecheck)",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Read(**)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(git push:*)",
      "Read(./.env)",
      "Read(./secrets/**)"
    ]
  }
}
```

Allowlist the safe, repetitive commands — test, typecheck, lint, status — so you are not approving the same thing forty times. Denylist anything destructive or irreversible. Blocking `git push` in particular is a good default: it forces a human to be the one who publishes.

### What is plan mode?

Plan mode is a read-only state where the agent investigates and proposes an approach without editing anything. Use it whenever a task is ambiguous or touches something you care about. You review the plan, correct the misunderstanding while it is still cheap, and only then let it execute.

The cost of a wrong plan is one paragraph of correction. The cost of a wrong implementation across nine files is a reset.

### The rules that keep this boring

- Work inside a Git repository with everything committed before you start.
- Use a branch, always.
- Never give an agent session credentials with production write access.
- Read the diff before you commit. Every time.
- Prefer a container or dev sandbox for anything with a wide permission set.

For a broader treatment of what goes wrong when agents get too much authority, see our analysis of [AI security risks](/articles/ai-security-risks/).

## Subagents, hooks and slash commands

These three features are what turn Claude Code from a chat window into a configurable system.

### Subagents

A subagent is a named, scoped agent with its own system prompt and its own tool allowlist, invoked by the main session for a specific job. Manage them with `/agents`; they are stored as Markdown files in `.claude/agents/`.

```markdown
---
name: test-writer
description: Writes and repairs unit tests. Use after any change to src/services.
tools: Read, Grep, Glob, Edit, Write, Bash
---

Write tests in Vitest. Mirror the source file path under `test/`.
Cover the error branches, not just the happy path. Never modify files
in `src/` — if the source looks wrong, report it instead of fixing it.
```

The value is context isolation. A code review subagent can read fifty files and return three paragraphs, leaving the main session's context intact for the actual implementation work.

### Hooks

Hooks are shell commands that fire deterministically at lifecycle events — before a tool call, after one, when a session starts, when the agent stops. They are how you enforce something rather than request it.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npx prettier --write \"$CLAUDE_FILE_PATHS\"" }
        ]
      }
    ]
  }
}
```

Formatting after every edit is the canonical example. Others worth having: block writes to protected paths in a `PreToolUse` hook, or run a fast lint check on session stop so you never end a session with broken code.

### Custom slash commands

Any Markdown file in `.claude/commands/` becomes a slash command. This is the cheapest way to codify a repeated workflow.

```markdown
---
description: Prepare a PR — verify, then summarize the diff
---

Run `npm run typecheck` and `npm run test`. If either fails, fix the
failures before continuing. Then run `git diff main...HEAD` and write a
pull request description: what changed, why, and what a reviewer should
look at most carefully. Do not push.
```

Save that as `.claude/commands/pr.md` and `/pr` runs it in any session in the repository.

## Do you need MCP servers with Claude Code?

No, they are optional. The Model Context Protocol is an open standard for exposing tools and data to an AI agent through a uniform interface, and Claude Code is an MCP client, so any MCP server becomes available as tools in your session — issue trackers, databases, browser automation, documentation search.

```bash
# Add a server for this project
claude mcp add postgres -- npx -y @some/postgres-mcp-server

# List configured servers and their status
claude mcp list
```

Inside a session, `/mcp` shows connected servers and lets you authenticate ones that need OAuth.

The practical win is removing the copy-paste step. Instead of pasting a ticket description into the terminal, the agent reads the ticket. Instead of you describing a schema, it queries the information schema directly. If you want the protocol-level detail, we cover it in [how MCP works](/articles/how-mcp-works/).

Two cautions. MCP servers are third-party code running with your credentials, so vet them the way you would vet any dependency. And every connected server adds tool definitions to context — connect what you need, not everything you found.

## A realistic feature-branch workflow

Here is the shape of a session that actually ships something, rather than a demo.

**1. Start clean.**

```bash
git checkout main && git pull
git checkout -b feat/refund-partial-capture
claude
```

**2. Investigate in plan mode.** Ask for a plan before any edits:

```
> We need partial refunds against a partially captured charge. Read the
  charge and refund services and the Stripe adapter, then propose an
  implementation plan. Flag anything in the current data model that blocks it.
```

**3. Correct the plan.** This is where you earn your salary. The agent will usually be right about the mechanics and wrong about a business rule. Fix that now.

**4. Execute in slices.** Ask for the data model change first, run the migration, then the service layer, then the route, then tests. Reviewing four small diffs beats reviewing one large one.

**5. Let it verify.** With test and typecheck allowlisted, it will run them itself and iterate on failures without asking.

**6. Review properly.**

```bash
git diff main...HEAD --stat
git diff main...HEAD
```

Read it. The failure mode of agentic coding is not gibberish — it is plausible code that quietly misses a case. Look hardest at error handling, boundary conditions and anything touching money or auth.

**7. Commit and push yourself.** With `git push` denied in permissions, publishing stays a human decision.

For how this compares to editor-native agents, see our roundups of the [best AI coding assistants](/articles/best-ai-coding-assistants/) and [Cursor vs Windsurf](/articles/cursor-vs-windsurf/).

## Where it works and where it does not

Claude Code is strongest on tasks with a clear definition of done and a mechanical verifier: bug fixes with a reproducing test, mechanical refactors, test backfill, migrations, dependency upgrades, and reading unfamiliar code to explain it.

It is weakest where correctness is a matter of taste or product judgment — greenfield architecture, UI polish, anything where the requirements are actually still being discovered. In those cases use it as a fast implementer of a decision you have already made, not as the decider.

The other honest limitation is context. Long sessions degrade. When a session starts repeating itself or forgetting a constraint you set an hour ago, `/clear` and restart with a tight prompt. That is cheaper than fighting it.

## The bottom line

Claude Code rewards preparation more than prompting. The teams getting the most from it have three things: a fast test command, a short and specific CLAUDE.md, and a permission configuration that makes the safe path the default path.

Set those up once and the day-to-day loop becomes routine — branch, plan, slice, verify, review, push. Skip them and you get a fast tool producing work you cannot trust, which is worse than no tool at all.

If you are choosing between agent frameworks more broadly, our overview of the [best AI agents](/articles/best-ai-agents/) covers the wider landscape, and the [prompt engineering guide](/articles/prompt-engineering-guide/) covers how to write the task descriptions that make any of this work.
