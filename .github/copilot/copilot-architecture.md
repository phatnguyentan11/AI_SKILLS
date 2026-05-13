# Copilot Architecture

Purpose: define the standalone `.github/` package layout for GitHub Copilot customization.

## Active Copilot Files

| Layer | Location | Purpose |
| --- | --- | --- |
| Repository instructions | `.github/copilot-instructions.md` | Always-on project rules and banking gates |
| File/task instructions | `.github/instructions/**/*.instructions.md` | Conditional rules for paths, file types, or task domains |
| Prompt files | `.github/prompts/**/*.prompt.md` | Reusable slash-command style workflows |
| Custom agents | `.github/agents/**/*.agent.md` | Persistent personas such as planner, tester, reviewer, security reviewer |
| Agent skills | `.github/skills/*/SKILL.md` | Curated domain capabilities, reviewed for governance |
| Manual workflows | `.github/workflows/**/*.yml` | Manual-only governance checks for build, test, lint, secret scan, SAST, and dependency audit |

## Supporting Files

| Layer | Location | Purpose |
| --- | --- | --- |
| Copilot knowledge base | `.github/copilot/**/*.md` | RAG-friendly guidance for workspace retrieval |
| Reference knowledge | `.github/copilot/references/**/*.md` | Sanitized deeper guidance migrated from reference packages |
| Package docs base | `.github/docs/**/*.md` | Delivery log, changelog, current package docs |

## Placement Rules

- Put always-on rules in `.github/copilot-instructions.md`.
- Put path-specific or task-specific rules in `.github/instructions/*.instructions.md`.
- Put reusable workflows in `.github/prompts/*.prompt.md`.
- Put persistent role/persona behavior in `.github/agents/*.agent.md`.
- Put reviewed, safe, reusable capabilities in `.github/skills/<skill>/SKILL.md`.
- Put manual-only GitHub Actions governance checks in `.github/workflows/*.yml`.
- Put explanatory docs, catalogs, and assessment in `.github/copilot/`.
- Put long-form sanitized references in `.github/copilot/references/`, not inside skill folders.
- Put package delivery documentation in `.github/docs/`.

## Independence Rules

- This `.github/` folder must not depend on external local folders.
- Do not reference removed source folders, legacy drafts, or repo-root docs.
- Do not copy shell scripts, generated assets, credentials, or tool-specific automation into skills unless separately audited.
- Skills should be Markdown-only unless a bank-approved owner explicitly accepts tool/script risk.

## Current Structure

```text
.github/
  copilot-instructions.md
  instructions/
  prompts/
  agents/
  skills/
  workflows/
  copilot/
    references/
  docs/
```

## Retrieval Keywords

Copilot architecture, standalone `.github`, instructions files, prompt files, custom agents, agent skills, banking-grade engineering, docs base, RAG knowledge base.
