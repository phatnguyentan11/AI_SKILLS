# Copilot Package Knowledge Base

This directory belongs inside the standalone `.github/` Copilot package. It contains explanatory knowledge for Copilot and maintainers. Active runtime files live in sibling folders:

- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`
- `.github/prompts/*.prompt.md`
- `.github/agents/*.agent.md`
- `.github/skills/*/SKILL.md`
- `.github/hooks/pre-push`
- `.github/scripts/pre-push-governance-check.ps1`
- `.github/docs/*.md`
- `.github/docs/ai-project-presentation.html`

## Start Here

- [Copilot Architecture](copilot-architecture.md): package layout and placement rules.
- [Banking Grade Engineering](banking-grade-engineering.md): regulated financial-services delivery policy.
- [Workflow Playbook](workflow-playbook.md): planning, implementation, verification, review, docs, and release flow.
- [Codebase Analysis Playbook](codebase-analysis-playbook.md): system analysis, code explanation, business logic, and blast-radius workflow.
- [Azure DevOps MCP Playbook](azure-devops-mcp-playbook.md): approved `dev.azure.com` work item, repo, wiki, and pipeline context.
- [Internal Knowledge Playbook](internal-knowledge-playbook.md): NotebookLM-style and private knowledge governance.
- [Deep Research Playbook](deep-research-playbook.md): evidence-backed architecture and library research.
- [Reference Knowledge](references/README.md): sanitized deeper references migrated from the old package.
- [Curated Skills Index](skills-index.md): promoted safe Copilot skills and excluded categories.
- [Manual Tooling Guide](manual-tooling-guide.md): terminal, MCP, browser, database, GitHub CLI, and fallback rules.
- [Prompt Catalog](prompt-catalog.md): reusable prompt files.
- [Agent Catalog](agent-catalog.md): custom agent profiles.
- [Official Docs Snapshot](official-docs-snapshot.md): official documentation references and assumptions.
- [Copilot Project Assessment](copilot-project-assessment.md): current assessment and hardening roadmap.

## Package Rule

This `.github/` folder must be movable into another repository without requiring any external folders. Do not add references to local source folders outside `.github/`.

## Retrieval Keywords

GitHub Copilot package, standalone `.github`, custom instructions, prompt files, custom agents, agent skills, reference knowledge, system analysis, codebase reading, business logic, banking-grade engineering, regulated finance, docs base, governance, MCP, Azure DevOps, internal knowledge, deep research, `#codebase`.
