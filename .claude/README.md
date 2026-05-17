# `.claude/` — Claude Code project memory and slash commands

Claude Code-specific configuration. Claude Code reads two layers in this repo:

1. **`CLAUDE.md`** at the repo root — its project memory file. That file `@`-imports `AGENTS.md`, which is the canonical hub.
2. **`.claude/commands/*.md`** — project-scoped slash commands (`/qa`, `/plan`, `/spec`, etc.).

This directory only contains the slash commands. Persistent project memory lives in `CLAUDE.md` at the root, not here.

## Slash commands

| Command           | File                         | Purpose                                                                                        |
| ----------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `/component`      | `commands/component.md`      | Scaffold a new shadcn component with i18n, a11y, types extracted, and a colocated test.        |
| `/migration`      | `commands/migration.md`      | Generate a Supabase SQL migration following repo conventions (RLS, idempotent, rollback note). |
| `/plan`           | `commands/plan.md`           | Convert an existing spec at `.docs/specs/<…>.md` into an implementation plan at `.plans/`.     |
| `/prompt-context` | `commands/prompt-context.md` | Run `npm run prompt:context` and return the snapshot ready to paste into a chat UI.            |
| `/qa`             | `commands/qa.md`             | Run the fix-until-green QA loop following `.agents/workflows/qa-loop.md`.                      |
| `/spec`           | `commands/spec.md`           | Create a feature spec at `.docs/specs/<YYYY-MM-DD>-<slug>.md` from the canonical template.     |

## How it ties to the canonical hub

Slash commands are **thin entrypoints**. They should load AGENTS.md, the relevant `.agents/rules/*`, `.agents/references/*`, or `.agents/workflows/*` files, and follow those procedures. They must not restate procedure content here. If a command disagrees with AGENTS.md or with the canonical files, AGENTS.md wins and the command should be patched.

## How to extend

- New slash command → add `commands/<name>.md` with a `description` frontmatter field; the body should be a short procedure that loads the relevant canonical files and runs them.
- Project memory changes → patch `CLAUDE.md` at the root, not here.

## References

- Claude Code slash commands docs: https://docs.anthropic.com/en/docs/claude-code/slash-commands
- Claude Code memory docs: https://docs.anthropic.com/en/docs/claude-code/memory
