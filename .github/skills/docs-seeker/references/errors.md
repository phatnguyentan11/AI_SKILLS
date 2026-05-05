# Error Handling & Fallback Strategies

## Error Codes

**404 Not Found**
- Topic-specific URL not available
- Library not on context7.com
- llms.txt doesn't exist

**Timeout**
- Network issues
- Large repository clone
- Slow API response

**Invalid Response**
- Malformed llms.txt
- Empty content
- Invalid URLs

## Fallback Chain

### For Topic-Specific Queries

```
1. Try topic-specific URL
   https://context7.com/{library}/llms.txt?topic={keyword}
   ↓ 404
2. Try general library URL
   https://context7.com/{library}/llms.txt
   ↓ 404
3. `fetch_webpage` for llms.txt
   "[library] llms.txt site:[official domain]"
   ↓ Not found
4. Repository analysis
   Spawn `Explore` subagent on GitHub repo
```

### For General Library Queries

```
1. Try context7.com
   https://context7.com/{library}/llms.txt
   ↓ 404
2. `fetch_webpage` for llms.txt
   "[library] llms.txt"
   ↓ Not found
3. Repository analysis
   `Explore` subagent on cloned repo
   ↓ No repo
4. Research agents
   Spawn multiple `Explore` subagents (or `@research-specialist`)
```

## Timeout Handling

**Set limits:**
- `fetch_webpage`: 60s
- Repository clone: 5min
- Subagent exploration: 10min

**Fail fast:** Don't retry failed methods

## Empty Results

**If llms.txt has 0 URLs:**
→ Note in report
→ Try repository analysis
→ Check official website manually
