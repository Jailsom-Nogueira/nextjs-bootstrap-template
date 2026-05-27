# QA-in-loop — the iron rule

## 1. The Iron Rule

**A task is not done until the relevant QA loop exits 0.**

- Every task: `npm run qa`.
- UI/browser-facing changes: `npm run qa:visual` in addition to `npm run qa`.
- PR/release readiness: `npm run qa:strict`.

No exceptions. Not "almost done". Not "tests pass locally but I haven't run typecheck". Not "I'll fix the lint thing in a follow-up". The relevant exit code 0 is the line between done and not-done. Everything before that is in-progress.

## 2. The loop protocol

The loop is deliberately mechanical so an agent can execute it without judgment calls:

1. Run `npm run qa`.
2. If it exits 0 and this is not a UI/browser-facing task — you're done. Commit.
3. If this is UI/browser-facing, run `npm run qa:visual`; fix and re-run until it exits 0.
4. If a gate exits non-zero — read the FIRST failing gate's output block (the script stops at the first failure on purpose, so there's only one).
5. Identify the root cause. READ the error carefully. Don't pattern-match on a similar error you've seen before.
6. Apply the MINIMAL fix that addresses the root cause. No drive-by refactors.
7. Re-run the relevant command. Go back to step 2.

**Loop guards:**

- If the SAME gate fails 3 iterations in a row with DIFFERENT errors, stop. You're probably chasing symptoms instead of fixing the cause. Reassess.
- **Hard cap: 10 iterations per task.** If you hit it, write a blocker plan to `.plans/YYYY-MM-DD-qa-blocker-<slug>.html` (see §6).

## 3. Order of gates (cheapest → most expensive — DO NOT REORDER)

```text
format:check → text-hygiene → plan-format → mcp-sync → lint → typecheck → test → build → e2e (strict) → bundle-budget (strict) → qa:visual (strict/UI)
```

Reasons for the order:

- `format:check`, `text-hygiene`, `plan-format`, `mcp-sync`, and `lint` are cheap; fix them first or you'll pay for slow re-runs.
- `text-hygiene` catches decorative emoji/symbol drift in tracked text before it reaches agent-facing docs or command output.
- `plan-format` catches implementation plans that drift back to Markdown or import app design-system CSS.
- `typecheck` catches the bulk of refactor breakage.
- `test` runs the unit suite — fast, deterministic.
- `build` is the expensive one; only worth running when the cheaper gates are clean.
- `test:e2e`, `bundle-budget`, and `qa:visual` are strict gates because they need a working build/browser stack.

DO NOT reorder these to "get to the failing test faster". The order is a contract.

## 4. Common failure modes and first-pass fixes

| Gate          | Most common cause                                                                           | Fix                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| format:check  | Prettier hasn't been run                                                                    | `npm run format` then re-run                                                            |
| text-hygiene  | Decorative emoji/symbols in tracked text                                                    | Replace symbols with plain words such as PASS, FAIL, Warning, Good, Bad, directory      |
| plan-format   | Implementation plan written as Markdown or missing HTML plan markers                        | Use `.plans/templates/plan.html`; keep embedded CSS and Plan Document System markers    |
| mcp-sync      | `.mcp.json` and `.cursor/mcp.json` drift                                                    | Copy the canonical root `.mcp.json` to `.cursor/mcp.json`, then re-run                  |
| lint          | New ESLint rule violation                                                                   | READ the rule message, fix the code (NEVER `eslint-disable` — `eslint-comments/no-use`) |
| typecheck     | Missing type / wrong type / API drift                                                       | Fix types; NEVER use `any` (rule #1 in AGENTS.md)                                       |
| test          | Logic regression                                                                            | Fix the code, not the test (unless the test was wrong — justify in commit message)      |
| build         | Server/client boundary mistake, env access                                                  | Read the error carefully; pushing `'use client'` UP a tree is almost always wrong       |
| test:e2e      | Selector or auth seed drift                                                                 | Run locally with `npm run test:e2e -- --debug`; check selectors + auth fixture          |
| bundle-budget | Eager import of a heavy dependency or unavailable Next size output                          | `npm run analyze`; lazy-load heavy modules or document the diagnostic skip              |
| qa:visual     | Console warning/error, hydration mismatch, serious/critical axe violation, responsive issue | Inspect screenshots in `.agent-cache/visual-qa/`, fix root cause, re-run                |

## 5. Anti-patterns — NEVER do these to make the loop pass

These are high-temptation shortcuts. All of them are bugs disguised as fixes:

- `// eslint-disable-next-line` — banned by `eslint-comments/no-use`.
- Cast to `any` — banned.
- `// @ts-expect-error` without a 10+ char description — banned by `ban-ts-comment`.
- Mark a failing test `.skip()` / `.todo()` — hiding evidence.
- Add `if (process.env.NODE_ENV === 'test') { return mock }` branches in production code.
- Comment out the failing line and pretend nothing happened.
- Lower `BUNDLE_BUDGET_KB` instead of fixing the regression.
- `git commit --no-verify` to bypass pre-commit. The ONLY legitimate use of `--no-verify` in this repo is inside the `npm run push` script for the auto-generated changelog commit.

## 6. Escalation — when to stop and write a blocker plan

If after 5 iterations the SAME gate is still failing with the SAME root error, you are stuck. Continuing will not help. Stop and write:

```text
.plans/YYYY-MM-DD-qa-blocker-<slug>.html
```

The plan must contain:

1. The failing gate name + exact error message.
2. What you tried (every attempt, in order).
3. Why each attempt failed.
4. What information you'd need to proceed (env var? upstream fix? project owner clarification?).
5. Your best current hypothesis about the root cause.

Then exit the loop. The blocker plan is the deliverable.

## 7. Multi-agent handoff

When a parent agent delegates work to a subagent, the parent MUST require in the task contract:

> Return only after `npm run qa` exits 0 (and `npm run qa:visual` exits 0 for UI/browser-facing work), OR after writing a blocker plan to `.plans/`.

Subagents MUST include the final QA summary table in their return message. A subagent that returns without proof of a green QA loop is returning incomplete work, and the parent should send it back.

## 8. CI parity

`npm run qa` runs exactly what CI runs. `npm run qa:strict` is the pre-PR/pre-release superset. If local and CI diverge, fix the scripts/workflows rather than papering over the divergence with retries.
