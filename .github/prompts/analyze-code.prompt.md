---
name: analyze-code
description: Analyze existing code, architecture, dependencies, business logic, and blast radius before planning or implementation.
argument-hint: "[feature, bug, file, flow, or question]"
agent: ask
---

# Analyze Code

Use `#codebase` to inspect relevant files and docs.

Analyze:

- current architecture and layer ownership
- request or execution flow
- business rules and invariants
- data contracts and side effects
- dependencies, integrations, queues, jobs, database calls
- risk and blast radius
- tests and docs affected

Do not implement. Produce plan inputs and unresolved questions.

Follow `.github/copilot-instructions.md` and `.github/copilot/codebase-analysis-playbook.md`.

