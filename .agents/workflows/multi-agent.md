# Multi-Agent Workflow

Use when delegating to subagents or receiving their work.

## Handoff contract

The parent agent provides:

1. **Goal** — one sentence.
2. **Context** — relevant paths, active plan/spec, constraints, and files to avoid.
3. **Task classification** — expected surfaces and rule files to load. If unsure, instruct the child to infer from AGENTS.md and `.agents/references/artifact-layers.md`.
4. **Acceptance** — concrete pass criteria (`npm run qa`, `npm run qa:visual` for UI, `npm run qa:strict` for PR/release).
5. **Output format** — diff summary, files touched, verification report, blocker path if blocked.

The subagent returns:

1. **Summary** — what changed, in plain prose.
2. **Files** — paths created/modified/deleted.
3. **Verification** — final QA summary table and visual-QA evidence when relevant.
4. **Issues** — anything ambiguous, skipped, or blocked, with reasons.

## Rules

- Subagents never push to a remote.
- Subagents never amend or rewrite commits they didn't author.
- Subagents create at most one commit per task unless instructed otherwise.
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- If ambiguity changes artifact type, side effects, or user-visible behavior, ask the parent. Otherwise infer the safest default from AGENTS.md and continue.
- For standalone HTML/report/prototype artifacts, the subagent must verify in a browser or serve via localhost and return both verified URL and file path.
