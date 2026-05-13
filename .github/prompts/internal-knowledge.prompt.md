---
name: internal-knowledge
description: Query or curate approved internal knowledge sources such as coding standards, architecture docs, old project references, and onboarding material.
argument-hint: "[question or source set]"
agent: ask
---

# Internal Knowledge

Use approved project docs, `.github/copilot/references/`, Azure Wiki, or NotebookLM-style source summaries.

Before answering:

- identify source names or locations
- verify the source is approved for AI use
- classify sensitivity
- avoid secrets, customer data, raw logs, credentials, and restricted identifiers

Answer with:

- source-backed facts
- citations or source names
- assumptions
- recommendation
- codebase follow-up if needed
- docs update needed

If the source is not approved or classification is unknown, stop and ask for source approval or sanitized excerpts.

Follow `.github/copilot/internal-knowledge-playbook.md` and `.github/skills/internal-knowledge-governance/SKILL.md`.
