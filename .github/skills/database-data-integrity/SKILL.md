---
name: database-data-integrity
description: Use for database schemas, migrations, queries, indexes, transactions, data repair, reporting, backups, and persistence logic.
---

# Database Data Integrity

## When To Use

Use when changing persisted data, queries, migrations, indexes, reporting, or transaction boundaries.

For deeper reference material, use `.github/copilot/references/dotnet-data-integration-patterns.md` after reading the actual codebase.

## Rules

- Identify source of truth and affected data.
- Require rollback notes for migrations.
- Use transactions where partial writes can corrupt state.
- Handle retries, duplicate events, race conditions, and stale reads.
- Avoid destructive changes without explicit approval.
- Do not use production data in prompts, tests, fixtures, or docs.
- Verify with safe read-only inspection before write operations.
- Document data model and operational changes.
