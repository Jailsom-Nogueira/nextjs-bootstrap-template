# .docs/

Technical and product documentation. **One markdown file per topic.**

## Suggested layout

- `architecture/` — high-level system design, sequence diagrams, data model.
- `runbooks/` — operational guides: how to roll back, how to rotate keys, how to restore from backup.
- `decisions/` — Architecture Decision Records (ADRs). One file per decision, immutable once accepted.
- `product/` — product specs, user research, feature briefs.

Cross-link from `AGENTS.md` when an agent needs to discover the file for a task.

## What doesn't belong

- Active project plans — those live in `.plans/`.
- Changelog — auto-generated in `/CHANGELOG.md` by `npm run push`.
- Code comments — put rationale next to the code when it's local.
