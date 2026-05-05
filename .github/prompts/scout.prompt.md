---
name: scout
agent: agent
description: Search the codebase for files relevant to a specific task
argument-hint: Describe the task or feature to search files for
---

## Purpose

Search the codebase for files needed to complete the task using fast, parallel, token-efficient searches.

## Search Task

```
${input:task}
```

## Workflow

Use the `@scout` agent to search the codebase for files needed to complete the task:
1. Analyze the task and identify key directories that likely contain relevant files.
2. Divide the codebase into logical sections and search them in parallel.
3. Synthesize the results into an organized, deduplicated file list.

**How to write reports:**
- **IMPORTANT**: Sacrifice grammar for the sake of concision when writing reports.
- **IMPORTANT**: In reports, list any unresolved questions at the end.
- Organize findings by category (core files, tests, config, etc.).
