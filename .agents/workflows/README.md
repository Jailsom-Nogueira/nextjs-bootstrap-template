# `.agents/workflows/` — repeatable procedures

Step-by-step procedures agents follow at specific moments. These files own the **how**; rules own the **what** and **why**.

## Files

| File             | When to run                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `qa-loop.md`     | Every repo-changing task. The fix-until-green runbook. Pair with `.agents/rules/qa-loop.md`. |
| `self-review.md` | Before declaring any task complete. Code, verification, artifacts, security checklist.       |
| `multi-agent.md` | When delegating work to a subagent or receiving subagent output. Handoff contract.           |

## Conventions

- Procedures, not rules. A workflow lists steps; the corresponding rule explains the invariants and anti-patterns.
- Pair each workflow with at most one rule file (when both exist). Example: `workflows/qa-loop.md` (the runbook) + `rules/qa-loop.md` (the iron rule + anti-patterns).
- Hard caps and escalation paths belong here, not in rules.

## How to add a new workflow

1. Confirm the procedure repeats often enough to be worth a standing document. One-off plans go to `.plans/`, not here.
2. Add `<topic>.md` with the literal steps.
3. Register it in AGENTS.md's "References and workflows" section.
4. If a rule already exists for the same topic, link them mutually.

## Cross-links

- AGENTS.md (root) — primary entry.
- `.agents/rules/qa-loop.md` ↔ `workflows/qa-loop.md`.
- `.agents/workflows/self-review.md` is invoked from AGENTS.md's "Completion contract".
- `.agents/workflows/multi-agent.md` is invoked when a parent agent uses `delegate_task` or similar.
