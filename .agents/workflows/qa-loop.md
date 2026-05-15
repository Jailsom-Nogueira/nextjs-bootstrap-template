# Workflow — QA-in-loop fix-until-green

The procedure for taking a feature/fix/refactor from "I think it's done" to "exit 0 from `npm run qa`". Pair with `.agents/rules/qa-loop.md` for the rationale; this file is the runbook.

## When to use

Every time you write or modify code in this repo. The loop is the definition of done.

## The command

```bash
npm run qa            # standard loop (format, lint, typecheck, test, build)
npm run qa:strict     # adds e2e + bundle-budget — use before PR / release
npm run qa:quiet      # only prints output of failing gates
```

## How to interpret a failure block

`qa-loop.sh` stops at the FIRST failing gate. The output of that gate is wrapped in delimiters so it's mechanically extractable:

```
===== GATE: <name> =====
<command + output>
===== END GATE: <name> (FAIL exit=<N> duration=<N>s) =====
```

The agent's job is to:

1. Grep for `===== END GATE` lines.
2. Find the one tagged `FAIL`.
3. Read the output between the matching `===== GATE: <name> =====` and its END line.
4. That's the entire failure context. Everything before it passed.

## The hard cap

Maximum 10 iterations of the loop per task. If you exceed it, you are not making progress — you are thrashing.

Stop. Write `.plans/YYYY-MM-DD-qa-blocker-<slug>.md` with:

- Failing gate
- Last error (full text)
- What you tried (numbered list, in order)
- Why each attempt failed (one line each)
- What info or upstream action would unblock you

The plan IS the deliverable when you escalate. Don't apologize for it; blockers exist.

## Handoff template (for parent → subagent)

When delegating, include this in the subagent's task spec:

```
QA contract: return only after `npm run qa` exits 0, OR after writing a
blocker plan to `.plans/YYYY-MM-DD-qa-blocker-<slug>.md`. Include the
final `===== QA SUMMARY =====` table verbatim in your return message.
```

The parent agent rejects a subagent return that doesn't include the summary table or a blocker-plan path. Non-negotiable.

## Example loop transcript (3 iterations, then green)

Iteration 1:

```
$ npm run qa
===== GATE: format:check =====
[warn] src/lib/foo.ts
[warn] Code style issues found in 1 file. Run Prettier to fix.
===== END GATE: format:check (FAIL exit=1 duration=2s) =====
```

Fix: `npm run format`.

Iteration 2:

```
$ npm run qa
===== GATE: format:check =====
All matched files use Prettier code style!
===== END GATE: format:check (PASS exit=0 duration=2s) =====
===== GATE: lint =====
src/lib/foo.ts
  3:1  error  'cn' is defined but never used  no-unused-vars
===== END GATE: lint (FAIL exit=1 duration=8s) =====
```

Fix: remove the unused import (NOT `eslint-disable`).

Iteration 3:

```
$ npm run qa
[format:check PASS, lint PASS, typecheck PASS, test PASS, build PASS]
===== QA SUMMARY =====
All gates passed. ✅
```

Done. Commit.

## Human-driven loop (shell)

```bash
i=0
while ! npm run qa; do
  i=$((i+1))
  if [ $i -ge 10 ]; then
    echo "QA loop hit cap. Escalate — write .plans/YYYY-MM-DD-qa-blocker-<slug>.md"
    exit 1
  fi
  echo "Iteration $i failed. Apply a fix, then press Enter to re-run..."
  read -r
done
```

## Agent-driven loop (pseudocode)

```
for iteration in 1..10:
    result = run("npm run qa")
    if result.exit_code == 0:
        return SUCCESS

    failing_gate = parse_first_failing_gate(result.stdout)
    # failing_gate has: name, command, output, exit_code

    fix = analyze_root_cause_and_propose_minimal_fix(failing_gate)
    if fix is None:
        write_blocker_plan(failing_gate, attempts_so_far)
        return ESCALATE

    apply(fix)
    record_attempt(failing_gate, fix)

# Hit the cap.
write_blocker_plan(last_failing_gate, all_attempts)
return ESCALATE
```

## After exit 0

1. `git status` — make sure no unintended files are staged/unstaged.
2. Commit with Conventional Commits format.
3. Push via `npm run push` (it runs the changelog generator + the pre-push gate).

You do NOT need to re-run `npm run qa` after committing; the pre-push hook re-runs the relevant gates.
