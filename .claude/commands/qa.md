---
description: Run `npm run qa` in a loop, fix the first failing gate, repeat until exit 0. Hard cap 10 iterations.
---

Execute the QA loop end-to-end following the canonical procedure.

1. Read `.agents/workflows/qa-loop.md` for the step-by-step runbook.
2. Read `.agents/rules/qa-loop.md` for the forbidden anti-patterns (`eslint-disable`, `any`, `.skip()`, `--no-verify`, etc.).
3. Apply the procedure: `npm run qa` → identify the first failing gate → apply the minimal root-cause fix → re-run.
4. Hard cap is 10 iterations. If you hit it, write `.plans/<YYYY-MM-DD>-qa-blocker-<slug>.md` per the runbook and stop.

Do not duplicate the runbook here. The canonical files own the procedure; this command is a Claude Code slash entrypoint.
