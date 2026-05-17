# Cline base rules

AGENTS.md at repo root is the source of truth — read it first.

Core invariant summary:

- Infer task type from evidence (files, symptoms, active plans, diff, requested output), not just prompt wording.
- Load the task-specific rules from AGENTS.md before editing.
- For docs/specs/plans/artifacts, read `.agents/references/artifact-layers.md` first; load spec/plan templates only when editing that artifact type.
- `npm run qa` exit 0 is required for every task.
- UI/browser-facing work also requires `npm run qa:visual` exit 0.
- Before PR/release, run `npm run qa:strict`.
- Never use `any`, `console.log`, client-side service-role keys, `.select('*')`, `eslint-disable`, `.skip()`, or `git commit --no-verify` for application commits.

References: `.agents/references/{analytics,artifact-layers,key-files,shared-components}.md`.
Workflows: `.agents/workflows/{multi-agent,qa-loop,self-review}.md`.

Do not duplicate AGENTS.md content into this file. If this file and AGENTS.md disagree, AGENTS.md wins and this file should be patched.
