---
title: "Business Question to Verified SQL"
description: "Converts a business question into SQL by first restating assumptions and definitions, then writing the query with a validation check the analyst can run."
seoTitle: "SQL Generation Prompt With Assumption Checking"
seoDescription: "A data analysis prompt that surfaces metric definitions and join assumptions before writing SQL, then supplies a sanity-check query to validate the result."
category: "Data Analysis"
prompt: |
  You are a senior analytics engineer. A wrong number delivered confidently is
  worse than no number, so you state your assumptions before you write SQL.

  ## Inputs
  Question: {{QUESTION}}
  Warehouse dialect: {{DIALECT}}
  Schema (tables, columns, types, keys):
  {{SCHEMA}}
  Known data caveats: {{CAVEATS}}

  ## Step 1 — Restate the question precisely
  Rewrite {{QUESTION}} as an unambiguous specification. Resolve every one of
  these explicitly, using the schema:
  - Time grain and time zone
  - The exact definition of each metric named
  - Which rows are excluded (test accounts, refunds, soft deletes, internal users)
  - Whether the answer is per entity or aggregate
  If the schema cannot settle one of these, list it under OPEN QUESTIONS and
  choose the most conservative interpretation, saying which you chose.

  ## Step 2 — Join plan
  Before writing SQL, state the join path in prose: table to table, on which
  keys, and the expected cardinality of each join. Flag any join that could
  fan out rows.

  ## Step 3 — Query
  Write the SQL in {{DIALECT}}. Use CTEs with descriptive names, one logical
  step each. Add a short comment above each CTE saying what it produces.

  ## Step 4 — Validation
  Provide a second, structurally different query that should agree with the
  first — a row count, a total that must reconcile, or a spot check on a
  single entity. State what disagreement between them would mean.

  ## Constraints
  - Use only tables and columns present in {{SCHEMA}}. Never invent a column.
  - Do not use SELECT *.
  - Do not silently drop NULLs; handle them explicitly and say how.
  - Prefer an explicit filter over an implicit inner-join filter.
  - If {{QUESTION}} cannot be answered from {{SCHEMA}}, say exactly which data
    is missing instead of approximating.
variables: ["QUESTION", "DIALECT", "SCHEMA", "CAVEATS"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "The technique is forced specification before generation. Most incorrect analytics SQL is not syntactically wrong — it answers a slightly different question than the one asked, because a definition was assumed silently. Making the model write the specification first exposes those assumptions where a human can catch them. The validation query adds self-consistency checking: two structurally different derivations that agree are much stronger evidence than one query that runs."
exampleOutput: |
  ## Step 1 — Specification
  "Monthly active users in Q2" resolves to: distinct `user_id` in
  `events` with at least one row where `event_type` in ('view','action'),
  grouped by calendar month in UTC, for 2026-04-01 through 2026-06-30.
  Excludes: users where `users.is_internal = true`, and soft-deleted users
  (`users.deleted_at is not null`).
  OPEN QUESTIONS: the schema has no test-account flag. Conservative choice —
  no test exclusion applied; the number may be slightly high.

  ## Step 2 — Join plan
  `events` (many) to `users` (one) on `user_id`. No fan-out expected because
  `users.user_id` is the primary key.

  ## Step 3 — Query
  ```sql
  -- one row per user per active month
  with active_user_months as (
    select date_trunc('month', e.occurred_at at time zone 'UTC') as month,
           e.user_id
    from events e
    join users u on u.user_id = e.user_id
    where e.event_type in ('view', 'action')
      and u.is_internal = false
      and u.deleted_at is null
      and e.occurred_at >= '2026-04-01'
      and e.occurred_at <  '2026-07-01'
    group by 1, 2
  )
  select month, count(*) as monthly_active_users
  from active_user_months
  group by 1
  order by 1;
  ```

  ## Step 4 — Validation
  Count distinct users across the whole quarter. It must be less than or equal
  to the sum of the three monthly figures. If it is greater, the month
  bucketing or the time zone handling is wrong.
tags: ["data-analysis", "sql", "analytics", "verification"]
featured: false
publishDate: 2026-07-06
---

## Usage tips

Paste the real DDL rather than a description of the schema. Column types and key constraints let the model reason about cardinality, which is where the expensive mistakes live.

Read step one before reading the SQL. If the specification is wrong, the query is wrong regardless of how good it looks, and correcting the specification is faster than debugging output.

## The caveats field

`CAVEATS` is where institutional knowledge goes: the backfill that ran twice in March, the events table that changed schema last year, the region that reports in local time. Models cannot infer these and will produce clean, plausible, wrong answers without them.
