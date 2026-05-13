# Official Docs Snapshot

Reviewed on 2026-05-13.

## Confirmed From Official Docs

- Repository-wide custom instructions use `.github/copilot-instructions.md`.
- Path-specific custom instructions use `.github/instructions/**/*.instructions.md` with optional YAML frontmatter and `applyTo` glob patterns.
- VS Code prompt files use `.github/prompts/**/*.prompt.md` and are invoked manually like slash commands.
- Repository-level custom agents use `.github/agents` and Markdown agent profiles.
- Project agent skills can live in `.github/skills/<skill-name>/SKILL.md`.
- Agent skills also work with Copilot cloud agent, GitHub Copilot CLI, and VS Code agent mode.
- Copilot can use MCP for external tools and data. If MCP is unavailable, provide manual fallback steps.
- Custom instructions can stack. Avoid conflicts because all relevant instructions can be provided together.
- Copilot code review can use repository custom instructions, but review contexts have a custom-instruction size limit; place the most important review rules near the start of `.github/copilot-instructions.md`.
- GitHub's official Copilot homepage positions Copilot as an enterprise workflow assistant across IDEs, GitHub, terminal, project tools, chat apps, and MCP servers, with governance controls for organizations.
- The `github/awesome-copilot` repository demonstrates a broad customization ecosystem: agents, instructions, skills, hooks, workflows, plugins, and docs.

## Official Sources

- Repository custom instructions: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
- Repository instructions in IDEs: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide
- Copilot CLI custom instructions: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
- VS Code custom instructions: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- VS Code prompt files: https://code.visualstudio.com/docs/copilot/customization/prompt-files
- VS Code custom agents: https://code.visualstudio.com/docs/copilot/customization/custom-agents
- GitHub custom agents concept: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents
- Copilot agent skills: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
- Adding agent skills: https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/add-skills
- Model Context Protocol: https://docs.github.com/en/copilot/concepts/context/copilot-extensions
- Building Copilot Extensions: https://docs.github.com/en/copilot/building-copilot-extensions/about-building-copilot-extensions
- Copilot code review: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review
- GitHub Copilot homepage: https://github.com/features/copilot
- Awesome GitHub Copilot: https://github.com/github/awesome-copilot

## Architecture Decision

Use `.github/` as the complete standalone package. Keep safety gates at the top of `.github/copilot-instructions.md`, keep executable Copilot resources in standard `.github` subfolders, and keep explanatory knowledge in `.github/copilot/`.

## Retrieval Keywords

official docs, custom instructions, prompt files, custom agents, agent skills, Copilot CLI, VS Code Copilot, MCP, repository instructions, standalone `.github`.

