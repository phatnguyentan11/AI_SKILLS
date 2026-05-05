---
name: debug
agent: agent
description: Debug and diagnose a bug or failing behavior with systematic root-cause analysis
argument-hint: Describe the bug, error message, or unexpected behavior
---

**Issue to debug:**
```
${input:issue}
```

## Workflow

1. Use the `@debugger` agent to investigate the issue via systematic root-cause analysis.
2. Activate the `debugging` skill from `.github/skills/debugging/` before starting.
3. Follow the four-phase process: **Observe → Hypothesize → Verify → Fix**.
4. Trace the call stack backwards from the symptom to the root cause.
5. After identifying the root cause, implement the minimal fix.
6. Delegate to `@tester` to verify the fix does not introduce regressions.

**IMPORTANT**: Do NOT guess or apply random fixes — investigate root cause first.
**IMPORTANT**: Mark any unresolved questions at the end of the report.
