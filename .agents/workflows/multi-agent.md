# Multi-Agent Workflow

When delegating to subagents (e.g., a planner spawning implementers):

## Handoff contract

The parent agent provides:

1. **Goal** — one sentence.
2. **Constraints** — locked stack, files to touch, files to AVOID.
3. **Acceptance** — concrete pass criteria (typecheck, lint, build, tests).
4. **Output format** — what the subagent returns (diff, summary, verification report).

The subagent returns:

1. **Summary** — what changed, in plain prose.
2. **Files** — list of paths created/modified.
3. **Verification** — outputs of typecheck/lint/test/build.
4. **Issues** — anything ambiguous or skipped, with reasons.

## Rules

- Subagents NEVER push to a remote.
- Subagents NEVER amend or rewrite commits they didn't author.
- Subagents create at most ONE commit per task unless instructed otherwise.
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- If a subagent hits an ambiguity, it asks the parent — it does NOT guess on architectural decisions.
