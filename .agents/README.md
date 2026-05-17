# `.agents/` — canonical modular rules

This directory holds the **tool-agnostic, canonical** rules, references, workflows, and skills that AGENTS.md cross-links. Every other agent-config directory (`.cursor/`, `.claude/`, `.clinerules/`, `.codex/`) and every per-tool stub file (`CLAUDE.md`, `GEMINI.md`, `CONVENTIONS.md`) are **thin adapters that point here** — they do not duplicate this content.

If two files disagree, `.agents/` and AGENTS.md win; patch the adapter.

## Structure

| Subfolder     | Purpose                                                                                     | Index                  |
| ------------- | ------------------------------------------------------------------------------------------- | ---------------------- |
| `rules/`      | Mandatory operational rules per domain (styling, security, supabase, accessibility, …).     | `rules/README.md`      |
| `references/` | Lookup material: artifact taxonomy, path maps, component catalogs, event catalogs.          | `references/README.md` |
| `workflows/`  | Step-by-step procedures: QA loop, multi-agent handoff, self-review.                         | `workflows/README.md`  |
| `skills/`     | Universal agent skill stubs installed via `npx skills add …`. Locked in `skills-lock.json`. | `skills/README.md`     |

## How to use this directory

1. **Start at AGENTS.md** at the repo root — it is the routing hub.
2. AGENTS.md tells you which `rules/`, `references/`, or `workflows/` files to load for the current task surface.
3. Read only what the task router lists. Do not pre-load everything.
4. Treat `references/` as lookup-on-demand, not always-on rules.
5. Treat `workflows/` as procedures to follow at specific moments (QA, handoff, pre-completion review).

## How to extend

- New domain rule → add `.agents/rules/<topic>.md`, register it in the AGENTS.md task router and rule catalog.
- New lookup catalog → add `.agents/references/<topic>.md`, register it in AGENTS.md.
- New procedure → add `.agents/workflows/<topic>.md`, register it in AGENTS.md.
- Long-form teaching → goes to `CONCEPTS.md`, not here.
- Human quickstart / stack → goes to `README.md` at the repo root, not here.

## Cross-agent surface

These files load this directory:

- `AGENTS.md` (root) — primary hub.
- `CLAUDE.md` (root) — imports AGENTS.md for Claude Code.
- `GEMINI.md` (root) — points back to AGENTS.md for Gemini.
- `.cursor/rules/00-base.mdc` — Cursor entry; downstream cursor rules are thin pointers into `.agents/rules/*`.
- `.clinerules/00-base.md` — Cline entry pointing back to AGENTS.md.
- `.aider.conf.yml` — Aider reads AGENTS.md.
- `.codex/setup.sh` — Codex Cloud bootstrap; runs `npm run qa` which enforces these rules in CI.
