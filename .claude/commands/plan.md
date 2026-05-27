---
description: Convert an existing spec into an implementation plan at .plans/<date>-<slug>.html
argument-hint: <spec-path>
---

You are converting a spec into a concrete implementation plan. `$ARGUMENTS` is the path to the spec.

1. Read AGENTS.md and the task-type index — load every rule file relevant to this work.
2. Read `.agents/references/artifact-layers.md` to confirm this belongs as an implementation plan.
3. Read the spec end-to-end.
4. Read `.plans/templates/plan.html` to load the standalone HTML/CSS plan structure and Plan Document System.
5. Produce `.plans/<YYYY-MM-DD>-<slug>.html` (slug derived from spec filename) with embedded CSS and:
   - File-level decomposition: files to create / modify / delete, each with one-line purpose.
   - Ordered slices (S/M/L effort, dependency arrows). Each slice ships independently green.
   - Schema changes: migration filenames + RLS notes.
   - Tests to write: unit (vitest) + e2e (playwright).
   - Performance considerations (which Web Vitals could regress).
   - A11y / i18n considerations.
   - Security considerations (RLS, env vars, CSP impact).
   - Rollout plan.
   - Risks + mitigations.
   - Verification list: `npm run qa`, `npm run qa:visual` for UI/browser work, and `npm run qa:strict` before PR/release.
   - Definition of done.
   - The `data-plan-document` and `data-plan-design-system="plan-document-system"` markers from the template.

**Do NOT start coding until the plan is approved by the user.** Present the plan summary inline and ask: "Approve to start execution?"

After approval, work slice-by-slice, run the relevant QA loop after each slice, and check off completed items in the plan file as you go.
