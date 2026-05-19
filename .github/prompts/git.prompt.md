---
name: git
description: Prepare commit, push, or pull request steps.
argument-hint: "[commit, push, pr, or status]"
agent: ask
---

# Git

Review the intended changes before suggesting git actions.

Output:

- changed-file summary
- risk or missing verification
- conventional commit message
- exact `git` or `gh` commands

Do not include AI attribution. Do not push, merge, or create a PR unless the user asks.

Follow `.github/copilot-instructions.md` and `.github/copilot/manual-tooling-guide.md`.
