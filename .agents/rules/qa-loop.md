# QA-in-loop — the iron rule

## 1. The Iron Rule

**A task is not done until `npm run qa` exits 0.**

No exceptions. Not "almost done". Not "tests pass locally but I haven't run typecheck". Not "I'll fix the lint thing in a follow-up". Exit code 0 from `npm run qa` is the line between done and not-done. Everything before that is in-progress.

## 2. The loop protocol

The loop is deliberately mechanical so an agent can execute it without judgment calls:

1. Run `npm run qa`.
2. If it exits 0 — you're done. Commit.
3. If it exits non-zero — read the FIRST failing gate's output block (the script stops at the first failure on purpose, so there's only one).
4. Identify the root cause. READ the error carefully. Don't pattern-match on a similar error you've seen before.
5. Apply the MINIMAL fix that addresses the root cause. No drive-by refactors.
6. Re-run `npm run qa`. Go to step 2.

**Loop guards:**

- If the SAME gate fails 3 iterations in a row with DIFFERENT errors, stop. You're probably chasing symptoms instead of fixing the cause. Reassess.
- **Hard cap: 10 iterations per task.** If you hit it, write a blocker plan to `.plans/YYYY-MM-DD-qa-blocker-<slug>.md` (see §6).

## 3. Order of gates (cheapest → most expensive — DO NOT REORDER)

```
format:check  →  lint  →  typecheck  →  test  →  build  →  e2e (strict)  →  bundle (strict)
```

Reasons for the order:

- `format:check` and `lint` are sub-second; fix them first or you'll pay for slow re-runs.
- `typecheck` is slower but catches the bulk of refactor breakage.
- `test` runs the unit suite — fast, deterministic.
- `build` is the expensive one; only worth running when the cheaper gates are clean.
- `test:e2e` and `bundle-budget` are gated behind `--strict` because they need a working build + Playwright browsers.

DO NOT reorder these to "get to the failing test faster". The order is a contract.

## 4. Common failure modes and first-pass fixes

| Gate          | Most common cause                          | Fix                                                                                     |
| ------------- | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| format:check  | Prettier hasn't been run                   | `npm run format` then re-run                                                            |
| lint          | New ESLint rule violation                  | READ the rule message, fix the code (NEVER `eslint-disable` — `eslint-comments/no-use`) |
| typecheck     | Missing type / wrong type / API drift      | Fix types; NEVER use `any` (rule #1 in AGENTS.md)                                       |
| test          | Logic regression                           | Fix the code, not the test (unless the test was wrong — justify in commit message)      |
| build         | Server/client boundary mistake, env access | Read the error carefully; pushing `'use client'` UP a tree is almost always wrong       |
| test:e2e      | Selector or auth seed drift                | Run locally with `npm run test:e2e -- --debug`; check selectors + auth fixture          |
| bundle-budget | Eager import of a heavy dep                | `npm run analyze`; lazy-load via `next/dynamic` or `lazyClient` from `@/lib/lazy`       |

## 5. Anti-patterns — NEVER do these to make the loop pass

These are the high-temptation shortcuts. All of them are bugs disguised as fixes:

- `// eslint-disable-next-line` — banned by `eslint-comments/no-use`. There is no version of this that's OK.
- Cast to `any` — banned (rule #1).
- `// @ts-expect-error` without a 10+ char description — banned by `ban-ts-comment`.
- Mark a failing test `.skip()` / `.todo()` — that's not a fix, that's hiding evidence.
- Add `if (process.env.NODE_ENV === 'test') { return mock }` branches in production code.
- Comment out the failing line and pretend nothing happened.
- Lower `BUNDLE_BUDGET_KB` instead of fixing the regression.
- `git commit --no-verify` to bypass pre-commit. The ONLY legitimate use of `--no-verify` in this repo is inside the `npm run push` script for the auto-generated changelog commit.

If you find yourself reaching for any of these, stop. The shortcut will cost more in two weeks than the proper fix costs now.

## 6. Escalation — when to stop and write a blocker plan

If after 5 iterations the SAME gate is still failing with the SAME root error, you are stuck. Continuing will not help. Stop and write:

```
.plans/YYYY-MM-DD-qa-blocker-<slug>.md
```

The plan must contain:

1. The failing gate name + exact error message.
2. What you tried (every attempt, in order).
3. Why each attempt failed.
4. What information you'd need to proceed (env var? upstream fix? clarification from Jay?).
5. Your best current hypothesis about the root cause.

Then exit the loop. The blocker plan is the deliverable.

## 7. Multi-agent handoff

When a parent agent delegates work to a subagent, the parent MUST require in the task contract:

> "Return only after `npm run qa` exits 0, OR after writing a blocker plan to `.plans/`."

Subagents MUST include the final QA summary table (from `npm run qa`) in their return message. A subagent that returns without proof of a green QA loop is returning incomplete work, and the parent should send it back.

## 8. CI parity

`npm run qa` runs EXACTLY what CI runs. If `npm run qa` is green locally, CI must be green remotely. If they diverge, that's a bug in `scripts/qa-loop.sh` or `.github/workflows/ci.yml` — fix the script, never paper over the divergence with retries or `if: always()`.
