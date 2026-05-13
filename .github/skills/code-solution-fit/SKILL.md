---
name: code-solution-fit
description: Use when proposing or implementing code so the solution follows existing codebase patterns instead of inventing a parallel architecture.
---

# Code Solution Fit

## When To Use

Use before writing or changing code.

## Rules

- Base solution on existing codebase structure, naming, response types, error patterns, configuration, logging, and tests.
- Prefer modifying existing files over creating replacement files.
- Do not introduce new architecture unless the plan justifies it and the user approves.
- Do not skip layers.
- Do not create helpers, abstractions, interfaces, or parameters without current need.
- Follow existing conventions even if generic examples differ, unless security or data integrity would be harmed.

## Output

- Existing pattern found
- Proposed change location
- Why it fits
- Risks if pattern is not followed

