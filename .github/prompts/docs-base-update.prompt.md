---
name: docs-base-update
description: Update the project docs base after a feature, fix, migration, or operational change.
argument-hint: "[completed change]"
agent: agent
---

# Docs Base Update

Use `#codebase` to inspect current docs and implementation.

Update `.github/docs/` after the change:

- `.github/docs/project-docs-base.md` for current behavior and setup
- `.github/docs/project-changelog.md` for dated change history
- `.github/docs/feature-delivery-log.md` for evidence, checks, risks, and follow-ups
- architecture, API, security, or runbook docs if affected

Keep docs factual and aligned with actual code. Include verification commands and unrun checks.

Follow `.github/copilot-instructions.md` and `.github/copilot/banking-grade-engineering.md`.
