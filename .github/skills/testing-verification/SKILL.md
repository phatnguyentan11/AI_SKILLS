---
name: testing-verification
description: Use after code changes, before completion claims, when tests fail, when coverage is questioned, or when verification commands must be identified.
---

# Testing Verification

## When To Use

Use after every implementation and before declaring completion.

## Rules

- Find commands from package scripts, README, CI, and local docs.
- Run or request the narrowest meaningful check first.
- Broaden checks for shared behavior or high-risk changes.
- Do not weaken tests, fake data, mock internals, or bypass failures to pass.
- Report commands, results, unrun checks, and residual risk.

## Required Evidence

- Compile/typecheck result when applicable
- Lint result when applicable
- Unit/integration/e2e result when applicable
- Targeted regression test for bugs
- Security or dependency check for sensitive changes

