# `.codex/` — Codex Cloud sandbox bootstrap

[Codex Cloud](https://platform.openai.com/docs/codex) runs an OpenAI coding agent inside a fresh container per session. Before the agent works, Codex Cloud executes `.codex/setup.sh` to install dependencies, browsers, and run a quick sanity gate.

This is a **bootstrap layer**, not a rules layer. Rules and procedures live in `AGENTS.md` and `.agents/`. The Codex agent (running inside the container) reads `AGENTS.md` the same way every other agent does.

## Files

| File       | Purpose                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| `setup.sh` | Runs in the Codex Cloud container: `npm ci`, installs Playwright Chromium, then runs `npm run qa` once. |

`setup.sh` is the entry point Codex Cloud invokes automatically on container startup.

## How it ties to the canonical hub

The setup script does not contain rules. It installs the environment so the agent can run AGENTS.md's QA loop (`npm run qa`, `npm run qa:strict`). The QA loop itself is owned by `.agents/rules/qa-loop.md` and `.agents/workflows/qa-loop.md`.

## How to extend

- Add to `setup.sh` only when the container truly needs more bootstrapping (new system dependency, new browser, new prefetch). Keep it idempotent and fail-fast (`set -euo pipefail`).
- Per-tool agent instructions for Codex are not needed here — AGENTS.md is enough.

## Local equivalent

When working locally instead of in Codex Cloud, run the same steps the script runs:

```bash
npm ci
npx playwright install --with-deps chromium
npm run qa
```

## References

- Codex Cloud docs: https://platform.openai.com/docs/codex
