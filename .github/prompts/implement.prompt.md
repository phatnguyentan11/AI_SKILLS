---
name: implement
description: Implement a scoped feature, fix, or existing plan.
argument-hint: "[task or plan path]"
agent: agent
---

# Implement

Use `#codebase` and an approved plan to identify the smallest durable change. If no plan exists or the developer/user has not reviewed it, stop and create the plan first.

Implementation rules:

- modify existing files directly when practical
- base the solution on existing codebase structure and patterns
- follow local architecture and naming
- avoid speculative abstractions
- handle edge cases and errors
- add or update tests when behavior changes
- update docs base in `.github/docs/` when setup, API, behavior, security, operations, or troubleshooting changes
- include rollback notes for banking-risk changes

After changes:

1. Run or provide exact verification commands.
2. Review every changed line.
3. Update docs base.
4. Report evidence, residual risk, and unrun checks.

Follow `.github/copilot-instructions.md`, `.github/copilot/workflow-playbook.md`, `.github/copilot/codebase-analysis-playbook.md`, and `.github/copilot/banking-grade-engineering.md`.
