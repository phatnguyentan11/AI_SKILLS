---
name: "GitHub Copilot Knowledge Base"
description: "Rules for maintaining the repository's Copilot customization docs."
applyTo: ".github/copilot/**/*.md,.github/docs/**/*.md,.github/prompts/**/*.prompt.md,.github/agents/**/*.agent.md,.github/skills/**/SKILL.md,.github/instructions/**/*.instructions.md"
---

# GitHub Copilot Knowledge Base Instructions

- Follow the architecture in `.github/copilot/copilot-architecture.md`.
- Keep `.github/copilot/` and `.github/docs/` explanatory; keep `.github/prompts`, `.github/agents`, `.github/instructions`, and `.github/skills` executable by Copilot.
- Use descriptive, keyword-rich filenames and headings.
- Keep sections short and self-contained.
- Prefer tables for mappings, prompt catalogs, and role catalogs.
- Link related docs with relative Markdown links.
- When a tool cannot run inside Copilot, provide manual steps for `/terminal`, VS Code terminal, GitHub UI, GitHub CLI, or enabled MCP tools.
- Keep this package independent. Do not reference local folders outside `.github/`.
- Avoid conflicts with `.github/copilot-instructions.md`; repository-wide instructions remain the source of truth.
