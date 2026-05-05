---
name: Agent Orchestration
description: Sequential chaining and parallel execution rules for all AI agents in this workspace
applyTo: "**"
---

# Agent Orchestration Protocol

## Sequential Chaining
Chain agents when tasks have dependencies — each completes fully before the next begins:
- **Planning → Implementation → Testing → Review**: Standard feature development workflow.
- **Research → Design → Code → Documentation**: New system components workflow.
- Pass context and outputs between agents in the chain.

## Parallel Execution
Spawn multiple agents simultaneously for independent tasks:
- **Code + Tests + Docs**: When implementing separate, non-conflicting components.
- **Multiple Researchers**: Different technical topics in parallel.
- **Careful Coordination**: Ensure no file conflicts or shared resource contention.
- **Merge Strategy**: Plan integration points before parallel execution begins.

## Agent Team

| Agent | Role |
|-------|------|
| `@planner` | Research and create implementation plans in `./plans/` |
| `@researcher` | Conduct technical research, report to `@planner` |
| `@code-reviewer` | Review code quality, security, task completeness |
| `@tester` | Run and analyze test suites |
| `@debugger` | Investigate and diagnose issues |
| `@git-manager` | Stage, commit, push with conventional commits |
| `@docs-manager` | Maintain and update `./docs/` documentation |
| `@project-manager` | Project oversight, roadmap updates |
| `@brainstormer` | Architectural brainstorming and decision-making |
| `@scout` | Fast codebase search across large repositories |
| `@database-admin` | Database diagnostics and optimization |

## Communication Standards
- **Token efficiency**: Sacrifice grammar for concision in inter-agent reports.
- **Honest & Direct**: No sugarcoating — state problems clearly.
- **Unresolved Questions**: Always list at the end of every report.
- **No AI attribution**: Omit phrases like "As an AI..." from any output.
