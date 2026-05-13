# Workflow Playbook

Purpose: define the default delivery workflow for this standalone Copilot package.

## Universal Flow

1. Read `.github/copilot-instructions.md`.
2. If a reference/old project is provided, read it first and compare it with the current package/codebase.
3. Search repository context with workspace search or `#codebase`.
4. Identify affected files, tests, configs, docs, business logic, and existing patterns.
5. Create or update a plan before editing and wait for review/approval.
6. Implement the smallest durable change in existing files when practical.
7. Run or request compile/typecheck/lint/tests and targeted security checks.
8. Fix root-cause failures.
9. Review every changed line for correctness, security, privacy, data integrity, docs, and backwards compatibility.
10. Update `.github/docs/` after every feature or behavior change.
11. Summarize changed files, verification evidence, residual risk, and unrun checks.

## Planning Output

- Goal
- Non-goals
- Constraints
- Affected files
- Data, security, privacy, and operational impact
- Proposed phases
- Risks and mitigations
- Rollback or recovery notes
- Verification commands
- Docs updates
- Required approvals
- Unresolved questions

## Implementation Rules

- Follow local architecture and naming.
- Do not create duplicate replacement files.
- Keep code readable and typed.
- Handle edge cases and errors.
- Prefer composition and small modules over large files.
- Avoid speculative abstractions.

## Testing Rules

- Find test commands from package scripts, README, CI config, or docs.
- Run narrow checks first.
- Broaden checks for shared behavior.
- Do not weaken tests to pass.
- Add regression coverage for bugs.
- Report unrun checks honestly.

## Review Rules

- Lead with severity-ranked findings.
- Include file references.
- Focus on behavior, security, privacy, data loss, broken contracts, performance, and missing tests.
- For banking-grade changes, review every changed line and explicitly say which risk classes were checked.
- Do not mark work complete until critical and high findings are fixed or explicitly accepted.

## Retrieval Keywords

workflow, plan, implementation, testing, debugging, review, docs, verification, root cause, banking-grade, YAGNI, KISS, DRY.
