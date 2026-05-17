# `.agents/skills/` — universal agent skills installed via `npx skills`

Universal agent skill stubs installed with the [universal `skills` CLI](https://github.com/vercel-labs/skills). Compatible agent tools (Amp, Antigravity, Cline, Codex, Cursor, Gemini CLI, GitHub Copilot, Kimi, OpenCode, Warp) auto-load these when a task matches the skill's triggers.

The lockfile `skills-lock.json` at the repo root pins what is installed; treat it like `package-lock.json` (commit it, do not hand-edit).

## Installed skills

| Skill           | Path                     | Purpose                                                                            |
| --------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| `agent-browser` | `agent-browser/SKILL.md` | Fast Rust CDP browser automation with accessibility-tree snapshots and `@eN` refs. |

## How to install a new skill

```bash
npx skills add <package-or-url>
```

The command writes the skill stub here and updates `skills-lock.json`. Commit both.

## How to reinstall everything (reproducibly)

```bash
npx skills experimental_install
```

Reads `skills-lock.json` and restores every pinned skill into this directory.

## How to remove a skill

```bash
npx skills remove <name>
```

Updates the lockfile and deletes the stub. Commit both.

## Cross-links

- `skills-lock.json` (repo root) — lockfile. Always in sync with this directory.
- AGENTS.md (root) lists this directory under "Tool-specific adapters / Cross-agent surface".
- These stubs are skills, not rules. Rules belong in `.agents/rules/`.

## References

- Universal skills package: https://www.npmjs.com/package/skills
- agent-browser skill: https://github.com/vercel-labs/agent-browser
