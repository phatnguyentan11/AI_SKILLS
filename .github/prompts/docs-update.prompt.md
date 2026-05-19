---
name: docs-update
description: Update documentation after code, setup, architecture, or behavior changes.
argument-hint: "[change or scope]"
agent: agent
---

# Docs Update

Use `#codebase` to find existing docs before editing.

Update relevant docs, including the docs base:

- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- README
- setup guide
- architecture notes
- roadmap
- changelog
- code standards
- troubleshooting

After every feature, fix, migration, or operational change, record:

- what changed
- why it changed
- verification evidence
- security/privacy/data impact
- rollback notes
- residual risk and follow-ups

Keep docs concise, accurate, dated where useful, and cross-linked.

Follow `.github/copilot-instructions.md`, `.github/copilot/workflow-playbook.md`, and `.github/copilot/banking-grade-engineering.md`.
