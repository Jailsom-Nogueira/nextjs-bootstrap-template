---
description: Create a feature spec at .docs/specs/<date>-<slug>.md using the spec template.
argument-hint: <slug-and-one-line-description>
---

You are creating a new feature spec for the user. Follow this exact procedure.

1. Read `.docs/templates/spec.md` to load the canonical template structure.
2. Read AGENTS.md so the spec respects project conventions.
3. If the user's request is vague, ASK clarifying questions before writing anything. Specifically clarify:
   - Concrete user story (who, what, why).
   - Scope boundaries (what's IN, what's explicitly OUT).
   - Success criteria (how do we know it's done?).
   - Data model deltas (new tables/columns?).
   - Surface area (which routes/components?).
4. Once you have enough context, write the file to `.docs/specs/<YYYY-MM-DD>-<slug>.md` using today's date and a kebab-case slug derived from `$ARGUMENTS`.
5. Fill EVERY section of the template — no `TODO`s left behind unless explicitly captured under "Open questions".
6. Acceptance criteria MUST be numbered and testable (Given/When/Then style).
7. Cross-link any related plans, ADRs, or rule files.

**Do NOT write code in this step.** A spec is requirements + design intent only. The implementation comes from `/plan` followed by execution.

After writing, summarize: file path, status (Draft), and the top 3 open questions for the user to resolve before `/plan` is run.
