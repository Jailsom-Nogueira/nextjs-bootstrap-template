---
description: Convert an existing spec into an implementation plan at .plans/<date>-<slug>.md
argument-hint: <spec-path>
---

You are converting a spec into a concrete implementation plan. `$ARGUMENTS` is the path to the spec.

1. Read the spec end-to-end.
2. Read `.plans/templates/plan.md` to load the plan structure.
3. Read AGENTS.md and the task-type index — load EVERY rule file relevant to this work.
4. Produce `.plans/<YYYY-MM-DD>-<slug>.md` (slug derived from spec filename) with:
   - File-level decomposition: files to create / modify / delete, each with one-line purpose.
   - Ordered slices (S/M/L effort, dependency arrows). Each slice ships independently green.
   - Schema changes: migration filenames + RLS notes.
   - Tests to write: unit (vitest) + e2e (playwright).
   - Performance considerations (which Web Vitals could regress).
   - A11y / i18n considerations.
   - Security considerations (RLS, env vars, CSP impact).
   - Rollout plan.
   - Risks + mitigations.
   - Verification list (`npm run qa` exit 0 + any manual checks).
   - Definition of done.

**Do NOT start coding until the plan is approved by the user.** Present the plan summary inline and ask: "Approve to start execution?"

After approval, work slice-by-slice, run `npm run qa` after each slice, and check off completed items in the plan file as you go.
