---
description: Create a feature spec at .docs/specs/<date>-<slug>.md using the spec template.
argument-hint: <slug-and-one-line-description>
---

You are creating a new feature spec for the user. Follow this exact procedure.

1. Read AGENTS.md so the spec respects project conventions.
2. Read `.agents/references/artifact-layers.md` to confirm the request belongs as a spec and not as a plan, runbook, ADR, concept doc, or implementation task.
3. If it is a spec, read `.docs/templates/spec.md` to load the canonical template structure.
4. Inspect any mentioned files or active plans before asking questions.
5. Ask focused clarification only when ambiguity changes artifact type, scope, side effects, or acceptance criteria. Clarify:
   - Concrete user story (who, what, why).
   - Scope boundaries (what's in, what's explicitly out).
   - Success criteria (how do we know it's done?).
   - Data model deltas (new tables/columns?).
   - Surface area (which routes/components?).
6. Once you have enough context, write the file to `.docs/specs/<YYYY-MM-DD>-<slug>.md` using today's date and a kebab-case slug derived from `$ARGUMENTS`.
7. Fill every section of the template — no `TODO`s left behind unless explicitly captured under "Open questions".
8. Acceptance criteria must be numbered and testable (Given/When/Then style).
9. Cross-link any related plans, ADRs, or rule files.

**Do NOT write code in this step.** A spec is requirements + design intent only. The implementation comes from `/plan` followed by execution.

After writing, summarize: file path, status (Draft), and the top open questions before `/plan` is run.
