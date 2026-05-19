---
name: explain-code
description: Explain existing code, business flow, and logic using repository context.
argument-hint: "[file, symbol, flow, or feature]"
agent: ask
---

# Explain Code

Use `#codebase` and referenced files to explain the code.

Output:

- what the code does
- where the request/data enters
- main branches and business rules
- dependencies and side effects
- error handling and logging
- security/privacy/data concerns
- tests or docs that describe it

Do not rewrite code unless explicitly asked.

Follow `.github/copilot-instructions.md`.

