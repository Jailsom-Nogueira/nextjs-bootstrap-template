# `.clinerules/` — Cline base rules

[Cline](https://github.com/cline/cline) is a VS Code agent that reads `.clinerules/` for project-scoped instructions. This repo keeps the directory **intentionally minimal**: one file that points back to `AGENTS.md` (the canonical routing hub) so Cline behaves consistently with every other agent on the project.

## Files

| File         | Purpose                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| `00-base.md` | Tells Cline to read AGENTS.md before every task. No content duplicated. |

A sibling file `.clineignore` at the repo root controls which files Cline can read; it is not part of this directory.

## How it ties to the canonical hub

Cline loads `00-base.md` and is then told to read `AGENTS.md`. AGENTS.md routes the agent to the right `.agents/rules/*`, `.agents/references/*`, and `.agents/workflows/*` files for the task at hand. If this directory and AGENTS.md disagree, AGENTS.md wins and the adapter should be patched.

## How to extend

- New numeric-prefixed file (`10-…`, `20-…`) **only** for instructions that Cline must always read first AND that cannot fit anywhere in AGENTS.md or `.agents/rules/*`. The bar is high: prefer canonical files.
- Do not paste rule content here. Pasting risks drift with `.agents/rules/`.

## References

- Cline docs: https://docs.cline.bot
