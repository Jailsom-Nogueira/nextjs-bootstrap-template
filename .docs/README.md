# .docs/

Technical and product documentation. **One markdown file per topic.**

## Suggested layout

Start with `.agents/references/artifact-layers.md` when deciding whether something belongs here, in `.plans/`, in `CONCEPTS.md`, or in AGENTS/rules.

- `architecture.md` — high-level system design + Mermaid diagrams (file-shape doc).
- `nextjs-conventions.md` — do/don't sheet for Next.js 16 patterns in this repo.
- `repo-tree.md` — full annotated tree of every tracked file and directory.
- `optional-retrieval-tooling.md` — opt-in, per-developer suggestions (GitNexus code-graph, local doc-retrieval/RAG) layered on top of the in-repo `check:doc-refs` guard.
- `assets/` — README screenshots and rendered diagrams.
- `architecture/` — deeper system design notes, sequence diagrams.
- `runbooks/` — operational guides: how to roll back, how to rotate keys, how to restore from backup.
- `decisions/` — Architecture Decision Records (ADRs). One file per decision, immutable once accepted.
- `product/` — product docs, user research, feature briefs, durable user-facing behavior docs. Feature specs with acceptance criteria live in `specs/`.
- `specs/` — feature specifications (start from `.docs/templates/spec.md`).
- `templates/` — canonical templates for specs and similar artifacts.

Cross-link from `AGENTS.md` when an agent needs to discover the file for a task.

## What doesn't belong

- Active project plans — those live in `.plans/`.
- Changelog — auto-generated in `/CHANGELOG.md` by `npm run push`.
- Code comments — put rationale next to the code when it's local.
