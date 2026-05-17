# `.agents/references/` — lookup material, not rules

Reference catalogs and lookup tables that AGENTS.md or rule files point to. Read on demand for the task at hand; do not pre-load.

These files are **not rules**. They map territory (artifact taxonomy, important paths, component inventory, event catalog) so agents do not have to re-discover it every session.

## Files

| File                   | What it contains                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `artifact-layers.md`   | Where to put specs, plans, docs, runbooks, ADRs, concepts, and local artifacts. Task inference too. |
| `key-files.md`         | Map of the most important source/config files with a one-line purpose each.                         |
| `shared-components.md` | Inventory of shadcn primitives and shared UI components with their paths.                           |
| `analytics.md`         | Event catalog: name, where it fires, properties, PII scrubbing.                                     |

## When to load

- Creating, editing, moving, or archiving a durable artifact (spec, plan, doc) → `artifact-layers.md` first.
- Looking for "where does X live" → `key-files.md`.
- Building a new UI surface → `shared-components.md` before reinventing primitives.
- Adding analytics events or auditing instrumentation → `analytics.md`.

## How to add a new reference

1. Confirm the content is lookup material, not a rule. If it must be obeyed, it goes to `.agents/rules/` instead.
2. Add `<topic>.md` here.
3. Register it in AGENTS.md's "References and workflows" section.
4. Cross-link from any rule or workflow file that would benefit from it.

## Cross-links

- AGENTS.md (root) — primary entry.
- `.agents/rules/*` may point here for lookup tables.
- `.agents/workflows/*` may point here for inventories used in procedures.
- `.docs/templates/spec.md` and `.plans/templates/plan.md` reference `artifact-layers.md` for the artifact-layer decision.
