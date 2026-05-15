---
description: Run `npm run qa` in a loop, fix the first failing gate, repeat until exit 0. Hard cap 10 iterations.
---

Execute the QA loop until it exits 0. Follow this procedure precisely.

1. Run `npm run qa`.
2. If exit code is 0 — report "✅ Green on iteration N" with total wall time and stop.
3. If non-zero — identify the FIRST failing gate from output (format → lint → typecheck → test → build, cheapest first).
4. Read `.agents/rules/qa-loop.md` for the anti-patterns. Forbidden fixes:
   - `eslint-disable` / `@ts-expect-error` / `@ts-ignore` without ticket justification.
   - Changing types to `any` or casting away the error.
   - `.skip()` / `.todo()` on a failing test.
   - Commenting out failing code.
   - `--no-verify` on the commit.
5. Apply the MINIMAL root-cause fix. Re-run `npm run qa`.
6. Repeat from step 2. Track iteration count.

**Hard cap: 10 iterations.** If you reach the cap without green, STOP. Write `.plans/<YYYY-MM-DD>-qa-blocker-<slug>.md` summarizing:

- Which gate is failing.
- What you've tried.
- Hypothesis for the root cause.
- Question for the user.

Then surface the blocker to the user and wait for input. Do NOT bypass the gate.
