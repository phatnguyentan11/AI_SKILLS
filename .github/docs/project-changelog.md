# Project Changelog

## 2026-05-13

- Added `Notebook Task Analyst` agent for document-heavy tasks that start from NotebookLM briefs, source citations, and internal knowledge summaries before planner handoff.
- Replaced the manual GitHub Actions governance workflow with a local pre-push warning hook and auditable PowerShell script.
- Removed `.github/docs/docs.html` because the package now uses the Markdown developer guide and the single-file presentation as the primary onboarding documentation.
- Added `.github/docs/ai-project-developer-guide.md`, a Vietnamese Markdown onboarding guide for developers covering the AI vision, codebase analysis, trace flows, Plan -> Implement -> Review workflow, Azure DevOps MCP, internal knowledge, and Deep Research.
- Redesigned `.github/docs/ai-project-presentation.html` as a single-file developer guide/presentation with Tailwind layout, Prism code highlighting, Lucide icons, Inter font, Mermaid diagrams, callouts, responsive sidebar navigation, and step-by-step workflow sections.
- Added Azure DevOps MCP governance for `dev.azure.com` work item, repo, wiki, and pipeline context.
- Added internal knowledge governance for NotebookLM-style private docs, coding conventions, and sanitized old project references.
- Added Deep Research governance for source-backed library and architecture research with ADR-ready outputs.
- Added prompts for Azure DevOps intake, database schema context, internal knowledge, deep research, and architecture research.
- Added Knowledge Curator and Research Architect agents.
- Added MCP and knowledge source registry templates.
- Added local pre-push governance checks for package validation, secret pattern scanning, and conditional .NET restore/build/format/test/dependency audit.
- Removed out-of-scope payment-specific and web-frontend-specific Copilot assets and catalog references.
- Replaced generic npm verification examples with repository-accurate `.github` package verification commands.
- Added system-analysis focus based on trusted reference package:
  - codebase reading before planning
  - code explanation prompts
  - business logic and logic-check prompts
  - codebase-fit solution rules
  - ASP.NET Core and dotnet testing governance
  - system analyst custom agent
- Added plan approval gate before implementation.
- Promoted reference/old-project-first comparison into the critical banking gates and delivery workflow.
- Added sanitized `.github/copilot/references/` knowledge so old skill references are represented without copying unsafe scripts or project-specific local material.
- Converted the Copilot base into a standalone `.github/` package.
- Moved explanatory knowledge into `.github/copilot/`.
- Moved docs base into `.github/docs/`.
- Removed package references to external local folders.
- Replaced migration-only skill with curated Copilot skills.
- Added banking-grade engineering gates:
  - plan before dev
  - line-by-line review
  - security/privacy/data controls
  - rollback notes
  - verification evidence
  - docs base update after every feature
