# Prompt Files (Slash Commands)

Prompt files are reusable `.prompt.md` files invoked manually via `/command-name` in chat. Use for one-off, repeatable tasks.

## File Location

| Scope | Location |
|---|---|
| Workspace | `.github/prompts/*.prompt.md` |
| User profile | VS Code user data |

## Format

```markdown
---
description: "Short description shown in picker"   # Optional
name: my-command                                    # Optional: defaults to filename
argument-hint: "Enter a description"               # Optional: hint shown in chat input
agent: agent                                        # Optional: ask | agent | plan | custom-agent-name
model: claude-sonnet-4-5                            # Optional: override model
tools: ['read', 'search', 'edit']                  # Optional: override tools for this prompt
---

Write your prompt instructions here in Markdown.

Reference workspace files with relative links: [standards](../../docs/code-standards.md)

Use input variables: ${input:componentName} or ${input:componentName:placeholder text}

Reference tools: use #tool:web/fetch for web access.
```

## Tool Priority

When both prompt file and custom agent define `tools`, the **prompt file's tools take precedence**.

Priority order:
1. Tools from prompt file frontmatter
2. Tools from referenced agent (`agent:` field)
3. Default tools for selected agent

## Input Variables

```markdown
---
description: Generate unit test for a class
---
Generate comprehensive xUnit tests for the class `${input:className}` in `${input:filePath:src/...}`.

Follow conventions in [testing docs](../../docs/testing.md).
```

User is prompted to fill in variables before the prompt runs.

## Invoking a Prompt

- Type `/my-command` in chat
- Run `Chat: Run Prompt` from Command Palette
- Open `.prompt.md` file → click play button in editor title

## Common Patterns

### Code generation prompt
```markdown
---
description: Scaffold a new ASP.NET Core controller
agent: agent
tools: ['edit', 'read', 'search']
---
Create a new controller for `${input:featureName}` following:
- [Controller standards](../../docs/aspnet/api-design.md)
- Route prefix: `myss-tools/api/1.0/${input:featureName:resource-name}`
- Thin controller — delegate to service layer
```

### Code review prompt
```markdown
---
description: Review recent changes for security and quality
agent: agent
tools: ['execute', 'read', 'search']
---
Review the staged or recently modified files for:
1. Security vulnerabilities (OWASP Top 10)
2. Async/await usage (no .Result or .Wait())
3. Null safety and exception handling
4. Code standards compliance per [standards](../../docs/code-standards.md)
```

### Test generation prompt
```markdown
---
description: Generate xUnit tests for a service
agent: agent
tools: ['edit', 'read', 'search']
---
Generate xUnit tests for `${input:serviceName}` following patterns in [testing guide](../../docs/testing.md).
Cover: happy path, edge cases, exception scenarios.
```
