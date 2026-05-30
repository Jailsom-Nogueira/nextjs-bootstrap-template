# Optional retrieval & code-intelligence tooling

> **Status: suggestions, not requirements.** None of this ships wired-in. The
> repo works fully without it. Adopt a section only if it earns its keep for your
> team. Each tool below is **local / per-developer** — it is deliberately NOT a
> committed repo artifact, so nothing here blocks CI or a fresh clone.

This template already enforces one piece of documentation integrity in-repo:
`npm run check:doc-refs` (the `check-doc-references.mjs` gate) fails the build if a
core doc references a repo file that no longer exists. That covers **dead file
paths deterministically**. The tools below are optional layers on top, for teams
that want richer code navigation and semantic retrieval over their own docs.

---

## 1. GitNexus — code-graph for change-safety (optional)

[GitNexus](https://github.com/looptech-ai/understand-quickly) builds a queryable
graph of your codebase (symbols, call edges, routes, impact). It is useful for
"who calls this / what breaks if I change it" before risky edits, and it can be
exposed to agents over MCP.

**When it's worth it:** medium-to-large codebases where blast-radius analysis is
slow by grep alone, and agent-heavy workflows that benefit from `gitnexus_impact`
before refactors.

**When to skip:** small/early repos where `search_files` + `tsc` + tests already
make impact obvious. Don't add tooling that costs more than it saves.

### Suggested setup (per-developer, local)

```bash
# One-off full index with semantic embeddings (local ONNX, no API key, no cost):
npx gitnexus@latest analyze --embeddings --skip-agents-md
```

- `--embeddings` enables semantic code search (off by default; the classic
  failure mode is an index with structure but no vectors).
- `--skip-agents-md` is important: without it, `analyze` rewrites a stats block
  into `AGENTS.md`/`CLAUDE.md` and dirties your worktree on every run.

### Keeping it fresh (the part most setups miss)

A stale code-graph gives **false confidence** — worse than no graph. Keep it
current with a **local, untracked** git hook that re-indexes after HEAD moves.
Because the repo can be pushed from multiple machines, this hook must live
per-clone (each developer opts in), NOT be committed:

```sh
# .git/hooks/post-commit  (or a husky post-commit you add to .git/info/exclude)
# Backgrounded so commits never block; incremental analyze is fast after the
# first full pass. Guard with a lock so rapid commits don't stack.
( npx gitnexus@latest analyze --embeddings --skip-agents-md >/dev/null 2>&1 & )
```

Do NOT use a machine cron for this — cron is host-local and won't travel with the
repo to other machines. A git hook fires wherever the commit happens.

### Exposing to agents (optional)

Add a GitNexus MCP server to your agent client's MCP config (e.g. `.mcp.json`)
so agents can call `gitnexus_query` / `gitnexus_impact`. Keep the index fresh
(above) or the answers drift.

---

## 2. QMD — local semantic retrieval over your docs (optional)

[QMD](https://github.com/) (or any equivalent local markdown-RAG tool) indexes a
repo's markdown into a searchable, embeddings-backed store so agents can ask
"what's our rule for X" and get the canonical answer instead of guessing.

**When it's worth it:** repos with substantial `.agents/**`, `.docs/**`, and
plan/runbook corpora that agents should consult before acting.

**When to skip:** small doc sets an agent can just read directly.

### Two gotchas worth knowing up front

1. **Dotfolders are skipped by default.** Most indexers ignore `.`-prefixed
   directories — which means your canonical `.agents/**` guidance is invisible to
   retrieval unless you opt it in. Fix: add `.agents` as its own indexed root (a
   separate collection pointed _at_ the `.agents` directory), and make any change
   watcher's ignore-list allow `.agents` through.
2. **Index config and the index DB are per-machine.** They are NOT repo
   artifacts. Each developer/machine that wants retrieval sets it up locally; the
   only thing that belongs in the repo is documentation that the setup exists
   (this file).

### Pairing with the in-repo guard

`check:doc-refs` keeps **paths** honest in-repo for everyone. QMD adds **semantic
recall** locally. Together: the guard prevents dead-reference drift from being
committed; QMD lets agents actually find the (now-trustworthy) docs. Neither
replaces the other.

---

## What stays in-repo vs local

| Concern                           | Where it lives                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Dead-doc-reference guard          | **In-repo** — `scripts/check-doc-references.mjs`, run in `npm run check` / `qa` |
| Self-review doc-update discipline | **In-repo** — `.agents/workflows/self-review.md`                                |
| GitNexus index + freshness hook   | **Local / per-developer** — `.gitnexus/`, `.git/hooks/*` (untracked)            |
| QMD index + collection config     | **Local / per-machine** — outside the repo                                      |

Rule of thumb: anything that must be true for **every** clone and CI run belongs
in-repo and in a gate. Anything that's a personal productivity layer stays local
and opt-in — documented here so adopters know it's available.
