# Workflow — QA-in-loop fix-until-green

Runbook for taking a feature/fix/refactor from "I think it's done" to a relevant QA loop exit 0. Pair with `.agents/rules/qa-loop.md` for the rationale.

## When to use

Every time you write or modify code in this repo. The loop is the definition of done.

## Commands

```bash
npm run qa            # standard loop: format, text, plan format, mcp sync, lint, typecheck, test, build
npm run qa:visual     # UI/browser QA: dev server, screenshots, console, axe, themes, viewports
npm run qa:strict     # pre-PR/release: qa + e2e + bundle-budget + qa:visual
npm run qa:quiet      # only prints output of failing gates
```

## How to interpret a failure block

`qa-loop.sh` stops at the FIRST failing gate. The output of that gate is wrapped in delimiters:

```text
===== GATE: <name> =====
<command + output>
===== END GATE: <name> (FAIL exit=<N> duration=<N>s) =====
```

The agent's job is to:

1. Find the first `FAIL` gate.
2. Read the output between the matching `===== GATE` and END line.
3. Fix the root cause with the smallest safe change.
4. Re-run the same QA command.

## Visual QA

For UI/browser-facing changes, `npm run qa` is necessary but not sufficient. Run `npm run qa:visual` and inspect failures plus screenshots under `.agent-cache/visual-qa/`.

## The hard cap

Maximum 10 iterations of the loop per task. If you exceed it, stop and write `.plans/YYYY-MM-DD-qa-blocker-<slug>.html` with:

- Failing gate
- Last error (full text)
- What you tried (numbered list, in order)
- Why each attempt failed
- What info or upstream action would unblock you

The plan IS the deliverable when you escalate.

## Handoff template (parent → subagent)

```text
QA contract: return only after `npm run qa` exits 0. If the task is UI/browser-facing, also return only after `npm run qa:visual` exits 0. Before PR/release, run `npm run qa:strict`. If blocked, write `.plans/YYYY-MM-DD-qa-blocker-<slug>.html`. Include the final QA summary table verbatim.
```

The parent agent rejects a subagent return that lacks the summary table, visual-QA evidence for UI work, or a blocker-plan path.

## After exit 0

1. `git status` — make sure no unintended files are staged/unstaged.
2. Commit with Conventional Commits format.
3. Push via `npm run push` only when a remote/upstream exists and release is intended.
