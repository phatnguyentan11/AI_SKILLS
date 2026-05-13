---
name: test
description: Find, run, and analyze verification commands.
argument-hint: "[scope]"
agent: agent
---

# Test

Use `#codebase` to find package scripts, CI config, README commands, and relevant test files.

Output:

- recommended narrow command
- recommended broader command if needed
- expected success signal
- analysis of failures
- root-cause fix recommendations

Prefer real tests. Do not suggest bypassing failures.

Follow `.github/copilot-instructions.md` and `.github/copilot/workflow-playbook.md`.
