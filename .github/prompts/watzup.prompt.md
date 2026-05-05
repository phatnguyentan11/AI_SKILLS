---
name: watzup
agent: agent
description: Review recent changes and provide a detailed summary of the current branch
argument-hint: Optionally specify branch name or number of recent commits to review
---

Review my current branch and the most recent commits.

Provide a detailed summary of all changes, including what was modified, added, or removed. Analyze the overall impact and quality of the changes.

```bash
git log --oneline -20
git diff main...HEAD --stat
```

**IMPORTANT**: **Do not** start implementing anything.
**IMPORTANT**: Focus on what changed and whether it aligns with the implementation plan in `./plans/`.
