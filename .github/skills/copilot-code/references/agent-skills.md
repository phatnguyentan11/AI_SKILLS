# Agent Skills in VS Code

Agent skills are folders of instructions, scripts, and resources that Copilot loads automatically when relevant to the task.

## Skill Locations

| Scope | Location |
|---|---|
| Project | `.github/skills/<skill-name>/SKILL.md` |
| Project (Claude) | `.claude/skills/<skill-name>/SKILL.md` |
| Project (generic) | `.agents/skills/<skill-name>/SKILL.md` |
| Personal | `~/.copilot/skills/<skill-name>/SKILL.md` |

## Skill Structure

```
.github/skills/
└── my-skill/
    ├── SKILL.md           # Required entrypoint
    ├── scripts/           # Executable scripts
    ├── references/        # Documentation files
    └── assets/            # Templates, config examples
```

## SKILL.md Format

```markdown
---
name: my-skill                          # Required: kebab-case, matches directory name
description: "What it does and WHEN    # Required: Copilot reads this to decide when to load
  Copilot should use it."
# allowed-tools: [shell]               # Optional: pre-approve tools (caution with shell/bash)
# license: MIT                         # Optional
# metadata:                            # Optional: provenance tracking
#   source-repo: owner/repo
#   version: v1.0.0
---

# Skill Instructions

Write instructions for Copilot to follow when this skill is active.
Reference scripts or resources in this directory by relative path.
```

## Key Rules

- Directory name must be **lowercase, hyphen-separated**
- `SKILL.md` must be **uppercase**
- `name` in frontmatter must match directory name
- Description is critical — Copilot uses it to decide when to activate the skill

## Writing Effective Descriptions

**Good** — specific trigger criteria:
```yaml
description: "Use when debugging ASP.NET Core applications. Activate for 500 errors,
  exception analysis, middleware diagnostics, or DI resolution failures."
```

**Bad** — too vague:
```yaml
description: "Helps with debugging"
```

## Skills with Scripts

```
.github/skills/dotnet-format/
├── SKILL.md
└── format.sh
```

`SKILL.md`:
```markdown
---
name: dotnet-format
description: Format C# files after editing. Use when asked to format code.
allowed-tools: [shell]
---

Run `format.sh` from this skill's directory, passing the file path as argument:
./format.sh <file-path>
```

> **Warning**: Only add `allowed-tools: [shell]` for trusted, reviewed scripts. Omitting shell forces confirmation before running terminal commands.

## Skills vs Custom Instructions vs Prompt Files

| Feature | When to use |
|---|---|
| **Custom instructions** | Broad rules applying to every interaction (coding standards) |
| **Agent skills** | Detailed, task-specific knowledge loaded only when needed |
| **Prompt files** | One-off manual tasks triggered by the user |

## Managing Skills with GitHub CLI

```bash
# Search skills
gh skill search dotnet

# Preview before installing
gh skill preview github/awesome-copilot dotnet-format

# Install a skill
gh skill install github/awesome-copilot dotnet-format

# Install for specific agent
gh skill install github/awesome-copilot ci-debug --agent copilot --scope project

# Update all skills
gh skill update --all

# Publish your skills
gh skill publish
```

CLI requires GitHub CLI v2.90.0+. `gh skill` is in public preview.

## Community Skills

- Browse: https://awesome-copilot.github.com/skills/
- Install from: `github/awesome-copilot` repository
- Anthropic collection: `anthropics/skills` repository
