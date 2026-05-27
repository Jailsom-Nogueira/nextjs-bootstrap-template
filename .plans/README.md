# .plans/

Active project plans live here. **One standalone HTML/CSS file per plan.** The README stays Markdown because it documents the folder; the plans themselves are browser-readable HTML.

## Naming

`YYYY-MM-DD-slug.html` — date is the start date, slug is kebab-case.

## Template

Start from `.plans/templates/plan.html`. The Claude Code slash command `/plan <spec-path>` scaffolds one automatically from a spec.

Before writing or moving a plan, read `.agents/references/artifact-layers.md` so active plans, archived plans, specs, runbooks, and concept docs stay separated.

## Plan document design system

Plans use the self-contained Plan Document System embedded in `.plans/templates/plan.html`. Keep all CSS in the plan file, use only `--plan-*` tokens, and do not import or mirror the application design system. This makes plans easy for humans to read without coupling future projects to this template's visual choices.

## Lifecycle

1. Draft the plan in `.plans/2026-05-15-my-feature.html`.
2. Iterate as work progresses; check off slices and verification items.
3. When the plan is **completed or superseded**, MOVE (don't delete) it to `.plans/archived/` so the history survives.

## What belongs here

- Multi-step refactors or feature builds.
- Anything where the "how" needs review before code lands.
- Temporary migration implementation plans. Durable operational playbooks/runbooks live in `.docs/runbooks/`.
- QA blocker plans: `YYYY-MM-DD-qa-blocker-<slug>.html` when the `npm run qa` loop exceeds 10 iterations.

## What doesn't

- Bug fixes (just open a PR).
- One-line changes.
- Documentation about how the system works — that's `.docs/`.
- Specs (requirements + acceptance) — those live in `.docs/specs/` (template at `.docs/templates/spec.md`).
