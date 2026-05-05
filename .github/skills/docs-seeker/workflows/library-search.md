# General Library Documentation Search

**Use when:** User asks about entire library/framework

**Speed:** ⚡⚡ Moderate (30-60s)
**Token usage:** 🟡 Medium
**Accuracy:** 📚 Comprehensive

## Trigger Patterns

- "Documentation for [LIBRARY]"
- "[LIBRARY] getting started"
- "How to use [LIBRARY]"
- "[LIBRARY] API reference"

## Workflow (Script-First)

```bash
# STEP 1: Execute detect-topic.js script
node scripts/detect-topic.js "<user query>"
# Returns: {"isTopicSpecific": false} for general queries

# STEP 2: Execute fetch-docs.js script (handles URL construction)
node scripts/fetch-docs.js "<user query>"
# Script constructs context7.com URL automatically
# Script handles GitHub/website URL patterns
# Returns: llms.txt content with 5-20+ URLs

# STEP 3: Execute analyze-llms-txt.js script
# Windows PowerShell:
Get-Content llms.txt | node scripts/analyze-llms-txt.js -
# POSIX shell:
# cat llms.txt | node scripts/analyze-llms-txt.js -
# Groups URLs: critical, important, supplementary
# Recommends: agent distribution strategy
# Returns: {totalUrls, grouped, distribution}

# STEP 4: Spawn `Explore` subagents (via `runSubagent`) per script recommendation
# - 1-3 URLs: Single agent or direct `fetch_webpage`
# - 4-10 URLs: 3-5 `Explore` subagents in parallel
# - 11+ URLs: 7 subagents or phased approach

# STEP 5: Aggregate and present
# Synthesize findings: installation, concepts, API, examples
```

## Examples

**Astro framework:**
```bash
# Execute scripts (no manual URL construction)
node scripts/detect-topic.js "Documentation for Astro"
# {"isTopicSpecific": false}

node scripts/fetch-docs.js "Documentation for Astro"
# Script fetches: context7.com/withastro/astro/llms.txt
# Returns: llms.txt with 8 URLs

Get-Content llms.txt | node scripts/analyze-llms-txt.js -
# {totalUrls: 8, distribution: "3-agents", grouped: {...}}

# Spawn 3 `Explore` subagents in parallel (via `runSubagent`):
# Agent 1: Getting started, installation, setup
# Agent 2: Core concepts, components, layouts
# Agent 3: Configuration, API reference

# Aggregate and present comprehensive report
```

## Agent Distribution

**1-3 URLs:** Single agent
**4-10 URLs:** 3-5 agents (2-3 URLs each)
**11-20 URLs:** 7 agents (balanced)
**21+ URLs:** Two-phase (critical first, then important)

## Known Libraries

- Next.js: `vercel/next.js`
- Astro: `withastro/astro`
- Remix: `remix-run/remix`
- shadcn/ui: `shadcn-ui/ui`
- Better Auth: `better-auth/better-auth`

## Fallback

Scripts handle fallback automatically:
1. `fetch-docs.js` tries context7.com
2. If 404, script suggests fetching `https://<official-site>/llms.txt` via `fetch_webpage`
3. If still unavailable: invoke `@research-specialist` (or spawn `Explore` subagents) to gather docs from official site, blog posts, tutorials.
