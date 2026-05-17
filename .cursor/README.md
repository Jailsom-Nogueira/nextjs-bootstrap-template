# `.cursor/` — Cursor IDE project configuration

[Cursor](https://cursor.com) reads `.cursor/` for project-scoped MCP servers and auto-attaching rule files. This directory follows the **thin-adapter rule**: it tells Cursor which files matter and which canonical rules to load from `.agents/rules/*`. It does not duplicate rule content.

If this directory and AGENTS.md disagree, AGENTS.md wins and the adapter should be patched.

## Files

| File                     | Purpose                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `mcp.json`               | Cursor MCP server list (Supabase RO, Playwright, Context7). Byte-identical to `.mcp.json` at the repo root.               |
| `rules/00-base.mdc`      | `alwaysApply: true`. Points Cursor at AGENTS.md.                                                                          |
| `rules/10-nextjs.mdc`    | `globs: src/app/**, src/components/**, src/proxy.ts, next.config.ts`. Points at `.agents/rules/performance.md` etc.       |
| `rules/20-supabase.mdc`  | `globs: src/supabase/**, src/app/api/**, src/lib/auth/**, supabase/migrations/**`. Points at `.agents/rules/supabase.md`. |
| `rules/30-tests.mdc`     | `globs: src/**/*.test.{ts,tsx}, e2e/**/*.spec.ts, vitest/playwright configs`. Points at the QA loop files.                |
| `rules/40-a11y-i18n.mdc` | `globs: src/app/**, src/components/**, messages/**`. Points at `.agents/rules/accessibility.md` etc.                      |

## MCP configuration

[Cursor docs](https://cursor.com/docs/mcp) — Cursor reads only `.cursor/mcp.json` for project MCP servers. Claude Code and Codex CLI read `.mcp.json` at the repo root. Both files must hold the same JSON, and the `mcp-sync` QA gate (`npm run check:mcp-sync`) enforces this. To change MCP servers:

```bash
# Edit the canonical file
$EDITOR .mcp.json

# Mirror to .cursor/
cp .mcp.json .cursor/mcp.json

# Verify
npm run check:mcp-sync
```

## Cursor rules — auto-attach by glob

Each `.mdc` file in `rules/` has frontmatter:

```yaml
description: <short purpose>
globs:
  - <glob patterns Cursor uses to decide when to auto-load this rule>
alwaysApply: true | false
```

Cursor loads `00-base.mdc` on every task (`alwaysApply: true`). Other files auto-attach when the user opens or edits a file matching their globs. The bodies are short pointers to the canonical `.agents/rules/*` files — Cursor will follow those.

## How to extend

- New surface that needs auto-attached rules → add `.cursor/rules/<NN-name>.mdc` with `globs:` and a body that points to the canonical rules.
- Do not paste rule content. The canonical files own it.
- New MCP server → edit `.mcp.json`, then `cp .mcp.json .cursor/mcp.json`. The `mcp-sync` gate will fail loudly if you forget.

## References

- Cursor docs (MCP): https://cursor.com/docs/mcp
- Cursor docs (rules): https://cursor.com/docs/rules
