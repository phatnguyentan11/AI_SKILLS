---
name: architecture-research
description: Compare architecture options and produce an ADR-ready recommendation for banking-grade systems.
argument-hint: "[architecture decision]"
agent: agent
---

# Architecture Research

Use this prompt for decisions such as modular monolith vs microservices, sync vs async integration, database-per-service vs shared database, queue technology choice, caching strategy, or observability architecture.

Research and compare:

- current codebase constraints
- business workflow impact
- data ownership and transaction boundaries
- security and compliance impact
- reliability and operability
- migration and rollback complexity
- testability and developer experience
- cost and runtime complexity

Output:

- decision context
- options considered
- comparison matrix
- recommended option
- rejected options and why
- ADR draft
- rollout plan
- verification and monitoring
- residual risk

Follow `.github/copilot/deep-research-playbook.md`, `.github/copilot/codebase-analysis-playbook.md`, and `.github/copilot/banking-grade-engineering.md`.
