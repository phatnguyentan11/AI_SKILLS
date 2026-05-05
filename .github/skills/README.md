# Agent Skills — `myss-tools`

Modular knowledge packs auto-loaded by GitHub Copilot (VS Code, May 2026 spec) when their `description` matches the user task. See [`agent_skills_spec.md`](./agent_skills_spec.md) for the file-format spec.

## Layout

Each skill is a folder containing at minimum a `SKILL.md` with YAML frontmatter (`name`, `description`). Optional: `scripts/`, `references/`, `assets/`, `workflows/`.

## Skills in this repo

| Skill | Purpose |
|-------|---------|
| `backend-development` | ASP.NET Core / .NET 8 backend patterns |
| `code-review` | Self-review checklist + reception etiquette |
| `common` | Shared cross-cutting conventions |
| `copilot-code` | Reference docs for Copilot customization (instructions, agents, hooks, MCP) |
| `csharp-async` | Async/await patterns, `ConfigureAwait`, cancellation |
| `csharp-xunit` | xUnit + FluentAssertions test patterns |
| `databases` | PostgreSQL, Redis, Dapper guidelines |
| `debugging` | Diagnosis workflow for runtime issues |
| `devops` | Docker, CI/CD, deployment notes |
| `docs-seeker` | llms.txt-based library doc discovery (Node scripts) |
| `dotnet-best-practices` | General .NET 8 idioms |
| `ef-core` | EF Core query/migration patterns (legacy code only) |
| `planning` | Plan-file authoring workflow |
| `problem-solving` | Generic root-cause + decomposition |
| `research` | Multi-source research methodology |
| `sequential-thinking` | Structured stepwise reasoning |
| `template-skill` | Boilerplate for new skills |

## Adding a new skill

1. Copy `template-skill/` to `<your-skill-name>/`.
2. Edit `SKILL.md` frontmatter (`name`, `description`) — see [`agent_skills_spec.md`](./agent_skills_spec.md).
3. (Optional) Add `scripts/`, `references/`, dependency manifests.
4. Reference the skill from [`../copilot-instructions.md`](../copilot-instructions.md) Skills Catalog if it should be discoverable globally.

## Dependencies

Most skills are pure Markdown. Skills with executable scripts (`docs-seeker`, `sequential-thinking`) bundle their own `package.json`. See [`INSTALLATION.md`](./INSTALLATION.md) for setup.
