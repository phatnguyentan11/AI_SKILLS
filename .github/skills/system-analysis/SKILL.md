---
name: system-analysis
description: Use before planning, implementation, review, debugging, or code explanation to understand architecture, flows, dependencies, and blast radius.
---

# System Analysis

## When To Use

Use before changing or explaining non-trivial code.

For deeper reference material, use `.github/copilot/references/analysis-debug-review-patterns.md`.

## Process

1. Read available docs and relevant source.
2. Map entry point, layers, data flow, business logic, integrations, and side effects.
3. Identify blast radius across code, tests, configs, docs, data, jobs, queues, APIs, and UI.
4. List unknowns and assumptions.
5. Recommend plan inputs, not code, until plan is reviewed.

## Output

- System context
- Flow map
- Business rules
- Affected files
- Risks and unknowns
- Plan recommendations
