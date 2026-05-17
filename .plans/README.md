# .plans/

Active project plans live here. **One markdown file per plan.**

## Naming

`YYYY-MM-DD-slug.md` — date is the start date, slug is kebab-case.

## Template

Start from `.plans/templates/plan.md`. The Claude Code slash command `/plan <spec-path>` scaffolds one automatically from a spec.

Before writing or moving a plan, read `.agents/references/artifact-layers.md` so active plans, archived plans, specs, runbooks, and concept docs stay separated.

## Lifecycle

1. Draft the plan in `.plans/2026-05-15-my-feature.md`.
2. Iterate as work progresses; check off slices and verification items.
3. When the plan is **completed or superseded**, MOVE (don't delete) it to `.plans/archived/` so the history survives.

## What belongs here

- Multi-step refactors or feature builds.
- Anything where the "how" needs review before code lands.
- Migration playbooks.
- QA blocker plans: `YYYY-MM-DD-qa-blocker-<slug>.md` when the `npm run qa` loop exceeds 10 iterations.

## What doesn't

- Bug fixes (just open a PR).
- One-line changes.
- Documentation about how the system works — that's `.docs/`.
- Specs (requirements + acceptance) — those live in `.docs/specs/` (template at `.docs/templates/spec.md`).
