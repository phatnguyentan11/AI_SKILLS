---
name: plan
description: Create a concise implementation plan for a feature, bug, migration, or refactor.
argument-hint: "[goal]"
agent: plan
---

# Plan Work

Use `#codebase` to inspect relevant files before planning.

Create a plan with:

- goal
- system/codebase context
- constraints
- affected files
- business logic and data flow
- implementation phases
- risks and mitigations
- verification commands
- docs updates
- unresolved questions

Do not implement during this prompt unless the user explicitly asks.

Follow `.github/copilot-instructions.md`, `.github/copilot/workflow-playbook.md`, and `.github/copilot/codebase-analysis-playbook.md`.
