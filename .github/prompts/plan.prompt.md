---
name: plan
agent: agent
description: Create a comprehensive implementation plan for a task or feature
argument-hint: Describe the feature or task to plan
---

## Your Mission

Task to plan:
```
${input:task}
```

## Workflow

- Analyze the given task and ask for more details if needed.
- Activate the `planning` skill from `.github/skills/planning/`.
- Spawn multiple `@researcher` subagents in parallel to research different relevant technical topics.
- Create a comprehensive implementation plan saved to `./plans/<feature-name>/` directory with:
  - `plan.md` — Overview, goals, risks, tech stack decisions, phase breakdown
  - `phase-1.md`, `phase-2.md`, etc. — Detailed task breakdowns per phase

## Important Notes

- **IMPORTANT**: Analyze the skills catalog at `.github/skills/*` and activate skills needed for the task.
- **IMPORTANT**: Sacrifice grammar for the sake of concision when writing reports.
- **IMPORTANT**: Ensure token efficiency while maintaining high quality.
- **IMPORTANT**: In reports, list any unresolved questions at the end.
- **IMPORTANT**: **Do not** start implementing — return the summary and file path of the plan.
