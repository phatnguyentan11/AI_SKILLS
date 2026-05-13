# Copilot Reference Knowledge

Purpose: hold deeper, sanitized reference material for Copilot retrieval.

## Why References Are Here, Not Inside Skills

The old package used `skills/<skill>/references/` for long-form supporting docs. This package keeps `.github/skills/*/SKILL.md` short and governance-safe, then places deeper material under `.github/copilot/references/`.

This is intentional:

- skills stay lightweight and clear about when to trigger
- reference docs remain RAG-friendly for `#codebase` and workspace retrieval
- no shell scripts, package manifests, hooks, `.env` samples, or automation are promoted into skills
- project-specific names, local paths, secrets, and internal identifiers are not copied
- banking-grade gates in `.github/copilot-instructions.md` remain the source of truth

## Migration Status

| Old reference area | New location or decision |
| --- | --- |
| Planning references | `.github/copilot/workflow-playbook.md`, `.github/prompts/plan.prompt.md`, `.github/skills/planning-governance/SKILL.md` |
| Codebase understanding | `.github/copilot/codebase-analysis-playbook.md`, `.github/copilot/references/analysis-debug-review-patterns.md` |
| Backend and ASP.NET patterns | `.github/instructions/aspnet-core.instructions.md`, `.github/copilot/references/aspnet-core-service-patterns.md` |
| Database and integration patterns | `.github/skills/database-data-integrity/SKILL.md`, `.github/copilot/references/dotnet-data-integration-patterns.md` |
| Debugging and review references | `.github/copilot/references/analysis-debug-review-patterns.md`, `.github/agents/debugger.agent.md`, `.github/agents/code-reviewer.agent.md` |
| Copilot customization references | `.github/copilot/copilot-architecture.md`, `.github/copilot/official-docs-snapshot.md` |
| DevOps, docs-seeker, sequential-thinking scripts | Not copied raw. Replaced with manual guidance and governance-safe Markdown only. |

## Use Rule

Use these references after the critical gates:

1. Read any provided old/reference project first.
2. Analyze the current target codebase.
3. Use these references only where they match the real codebase.
4. If reference guidance conflicts with actual code, follow actual code unless it creates security, privacy, data integrity, or compliance risk.

## Retrieval Keywords

Copilot references, migrated references, RAG knowledge base, sanitized reference docs, ASP.NET Core patterns, data integration patterns, debugging patterns, code review patterns, banking governance.
