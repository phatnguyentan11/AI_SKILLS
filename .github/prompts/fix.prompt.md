---
name: fix
agent: agent
description: Analyze and fix issues (auto-detects complexity)
argument-hint: Describe the issue or paste the error message
---

**Reported Issues:**
```
${input:issues}
```

If there is a markdown implementation plan already in `./plans/`, reference it and implement the fix following the `code` prompt workflow.

Otherwise:
- Analyze the issues and ask for more details if needed.
- For **simple issues** (clear root cause, < 30 lines of changes): fix directly.
- For **complex issues** (unclear root cause, architectural impact, > 30 lines): use `@planner` agent to create a fix plan first, then use the `code` prompt to implement it.

**IMPORTANT**: Analyze skills at `.github/skills/*` and activate skills needed for the task.
**IMPORTANT**: After implementing the fix, delegate to `@tester` to verify the fix doesn't introduce regressions.
