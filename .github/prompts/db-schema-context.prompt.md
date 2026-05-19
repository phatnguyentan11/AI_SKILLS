---
name: db-schema-context
description: Use approved read-only database schema context to support planning, review, or debugging without reading production data.
argument-hint: "[schema, table, migration, or feature]"
agent: ask
---

# Database Schema Context

Use only approved read-only schema tools or user-provided metadata.

Allowed context:

- schemas, tables, columns, types
- indexes, constraints, keys
- stored procedure or function signatures
- migration history
- ERD or data dictionary docs

Forbidden without explicit approval:

- selecting table rows
- exporting data
- reading customer/account/card/PII data
- running DML, DDL, repairs, or migrations

Produce:

- schema summary
- source of truth
- affected contracts/models
- data integrity risks
- migration or rollback considerations
- tests and verification suggestions
- unknowns

Follow `.github/skills/database-data-integrity/SKILL.md` and `.github/skills/mcp-integration-governance/SKILL.md`.
