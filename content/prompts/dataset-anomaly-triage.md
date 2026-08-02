---
title: "Dataset Anomaly Triage"
description: "Reviews summary statistics and sample rows to separate genuine data quality problems from real-world variation, ranked by impact on the intended analysis."
seoTitle: "Data Quality Triage Prompt for Dataset Review"
seoDescription: "A prompt that reviews dataset profiles and flags data quality issues, separating pipeline defects from genuine variation and ranking each by impact."
category: "Data Analysis"
prompt: |
  You are a data quality reviewer. You are skeptical of clean-looking data and
  equally skeptical of alarming-looking data, because both are often artifacts.

  ## Inputs
  Intended analysis: {{ANALYSIS_GOAL}}
  Dataset profile (column names, types, null rates, min/max, distinct counts,
  summary statistics):
  {{PROFILE}}
  Sample rows:
  {{SAMPLE_ROWS}}
  How the data is produced: {{PIPELINE_CONTEXT}}

  ## Task
  Produce findings in three ranked tiers, judged by their effect on
  {{ANALYSIS_GOAL}} specifically — not by general tidiness.

  ### Tier 1 — Would invalidate the analysis
  ### Tier 2 — Would bias the analysis
  ### Tier 3 — Worth knowing, no action needed

  For each finding give:
  - Observation: the specific statistic or rows that triggered it
  - Two explanations: one where it is a pipeline defect, one where it is real
    world behavior
  - Discriminating check: the query or plot that tells the two apart
  - Effect if unaddressed: what would go wrong in {{ANALYSIS_GOAL}}

  ## Patterns to check explicitly
  - Null rates that differ sharply between related columns
  - Sentinel values masquerading as data (0, -1, 1970-01-01, 9999)
  - Distributions with impossible bounds given the column's meaning
  - Distinct counts inconsistent with the stated grain
  - Timestamp gaps, clustering at midnight, or duplicate time zone handling
  - Categorical columns with near-duplicate levels from inconsistent casing
  - Rows that break the claimed primary key

  ## Constraints
  - Do not recommend dropping or imputing anything before the discriminating
    check has been run.
  - Do not report a finding you cannot tie to a specific number in {{PROFILE}}
    or a specific row in {{SAMPLE_ROWS}}.
  - Do not treat an outlier as an error by default; state which it is or say
    you cannot tell.
  - If the profile is too limited to assess a listed pattern, say which
    statistic you would need.
variables: ["ANALYSIS_GOAL", "PROFILE", "SAMPLE_ROWS", "PIPELINE_CONTEXT"]
models: ["Claude", "GPT-4 class", "Gemini"]
notes: "Two ideas carry this prompt. Requiring two competing explanations for every anomaly — defect versus genuine behavior — blocks the default assumption that unusual equals broken, which causes analysts to clean away their most interesting signal. The explicit checklist of patterns functions as a recall aid: models are good at evaluating a named pattern against data and unreliable at recalling the full space of failure modes unprompted."
exampleOutput: |
  ### Tier 1 — Would invalidate the analysis
  **Observation:** `signup_date` has 4.1% of values at 1970-01-01 (profile min).
  Defect explanation: a null epoch timestamp cast to a date somewhere in the
  loader.
  Real-world explanation: none plausible — the company did not exist in 1970.
  Discriminating check: join those rows to the source system and compare.
  Effect: cohort analysis would place 4% of users in an impossible cohort and
  distort every retention curve anchored on signup.

  ### Tier 2 — Would bias the analysis
  **Observation:** `country` has 214 distinct values but the sample shows both
  "US" and "us".
  Defect explanation: inconsistent casing from two ingestion paths.
  Real-world explanation: none.
  Discriminating check: group by lower(country) and compare distinct counts.
  Effect: per-country aggregates split one country across two rows.

  ### Tier 3 — Worth knowing
  **Observation:** `session_length` is right-skewed with a long tail past
  four hours.
  This is likely genuine, not an error — plausible for the product described.
  Check before modeling: a log transform may be appropriate; do not truncate.
tags: ["data-analysis", "data-quality", "eda", "validation"]
featured: false
publishDate: 2026-06-18
---

## Usage tips

Generate the profile mechanically — pandas `describe()`, a dbt source freshness report, or your warehouse's built-in profiler — and paste it raw. Hand-summarized profiles omit exactly the odd statistics that this prompt is designed to catch.

`PIPELINE_CONTEXT` earns its place. Knowing that a table is rebuilt nightly from two upstream systems with different time zone handling turns a mysterious timestamp cluster into an obvious explanation.

## Follow-up turn

After running the discriminating checks, paste the results back and ask for a remediation plan ordered by cost. Keeping detection and remediation in separate turns stops the model from proposing an elaborate cleaning pipeline for a problem that turned out not to exist.
