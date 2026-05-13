---
name: internal-knowledge-governance
description: Use when ingesting, curating, or querying internal docs, coding conventions, old project references, onboarding material, or private knowledge bases.
---

# Internal Knowledge Governance

## When To Use

Use for NotebookLM-style notebooks, private RAG sources, internal docs, old project migration, and knowledge-base updates.

## Rules

- Register approved sources with owner, classification, scope, and review cadence.
- Use enterprise-approved accounts and storage.
- Keep notebooks or knowledge collections project-specific.
- Sanitize old project material before reuse.
- Never ingest secrets, customer data, account data, card data, raw production logs, credentials, or restricted identifiers.
- Require citations or source names in answers.
- Separate source-backed facts from assumptions.
- Update docs base when reusable knowledge is added to `.github/copilot/references/`.

## Output

- Sources used
- Classification
- Sanitization status
- Answer or summary
- Citations/source references
- Assumptions
- Follow-ups

