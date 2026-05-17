# Artifact layers + task inference

Use this when the task creates, edits, moves, archives, links to, or delivers a durable project artifact.

The user prompt does **not** need to name the task type. Infer the task from the affected surface, files, symptoms, active plan, and requested output.

## First move: classify from evidence

Before loading templates or editing files:

1. Inspect any mentioned file/path, current `git status`, latest plan/spec, and reported error/symptom.
2. Identify every affected surface: code, UI, data, auth, API, analytics, tests, docs, spec, plan, runbook, artifact, security, release, or QA.
3. Load the smallest safe union of rules for those surfaces.
4. If ambiguity changes the artifact type or side effects, ask one focused question.
5. If ambiguity does not change the rules/files to inspect, choose the safest default and continue.

Examples:

| Prompt shape                                    | Infer as                   | Load                                                    |
| ----------------------------------------------- | -------------------------- | ------------------------------------------------------- |
| "update this doc" with a `.docs/specs/*` path   | spec edit                  | this file + `.docs/templates/spec.md`                   |
| "continue" with active `.plans/*`               | plan-driven implementation | this file + active plan + task-specific code rules      |
| "put this in the right place"                   | artifact-layer decision    | this file first, then the chosen layer's template/rules |
| "make this reusable" with an HTML/report output | local artifact + docs      | this file; if visual, use browser verification          |
| "archive this" / "done with this plan"          | plan archival              | this file + `.plans/README.md`                          |
| "explain the concept"                           | concept doc                | `CONCEPTS.md`, not AGENTS.md                            |
| "the page is ugly/broken"                       | UI bug, not docs           | styling → responsiveness → accessibility → visual QA    |

## Layers and ownership

| Layer                 | Purpose                                 | Put here                                       | Do not put here                                 |
| --------------------- | --------------------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `AGENTS.md`           | terse agent rules hub / source of truth | invariant rules, task index, pointers          | long explanations, daily notes, project history |
| `.agents/rules/`      | mandatory operational rules             | compact do/don't rules agents must follow      | examples that belong in templates or concepts   |
| `.agents/references/` | lookup material                         | maps, catalogs, artifact taxonomy, inventories | rules that must always be obeyed                |
| `.agents/workflows/`  | procedures                              | QA loop, handoff, review flow                  | product requirements                            |
| `CONCEPTS.md`         | long-form teaching                      | what/why/how/common mistakes                   | hard rules that agents must scan fast           |
| `README.md`           | human entrypoint                        | quick start, repo map, onboarding              | implementation plans or volatile task state     |
| `.docs/specs/`        | durable product/technical specs         | problem, scope, acceptance criteria            | step-by-step implementation tasks               |
| `.plans/`             | active implementation plans             | slices, files touched, verification            | permanent product truth after completion        |
| `.plans/archived/`    | completed/superseded plans              | historical plan records                        | active work                                     |
| `.docs/architecture/` | architecture docs/diagrams              | topology, flows, boundaries                    | open task lists                                 |
| `.docs/decisions/`    | ADRs                                    | decision, alternatives, consequences           | broad specs or implementation checklists        |
| `.docs/runbooks/`     | operations recipes                      | diagnose/recover/operate steps                 | product requirements                            |
| `.docs/product/`      | product docs                            | feature behavior, user-facing rules            | coding standards                                |
| `CHANGELOG.md`        | generated release history               | generated entries from `npm run push`          | manual edits                                    |
| Per-agent stubs       | adapters for individual tools           | thin imports/pointers to AGENTS.md             | canonical rules or duplicated task indexes      |
| `.claude/commands/`   | slash-command workflows                 | short prompts that load AGENTS and artifacts   | project requirements or long-form docs          |
| `.agents/skills/`     | universal skill stubs                   | installed skill entrypoints                    | lockfile data or project rules                  |
| `skills-lock.json`    | universal skills lockfile               | pinned installed skill metadata                | hand-written guidance                           |

## Spec vs plan decision

- **Spec** = what/why/acceptance. Use when defining product behavior, API surface, data model, or user outcomes.
- **Plan** = how/order/files/verification. Use after a spec exists or when executing a known change.
- **Doc/runbook** = durable knowledge for future operators or developers.
- **Concept** = teaching/explanation for humans who do not yet know the pattern.

Conditional reads:

- Creating or editing a spec → read `.docs/templates/spec.md`.
- Creating or editing a plan → read `.plans/templates/plan.md`.
- Translating a spec into a plan → read both templates.
- Only moving/archiving a plan → read `.plans/README.md`; do not read spec template unless spec content changes.
- Code-only task with no durable artifact changes → do not read spec/plan templates.

## Local artifact storage

- Ephemeral generated reports/prototypes → `.agent-cache/artifacts/<slug>/`.
- Durable reviewed docs/prototypes → `.docs/` with README or spec cross-link.
- Never put generated review artifacts in `public/` unless the application must serve them.

## Local HTML / visual artifact delivery

When creating a standalone HTML/report/prototype artifact:

1. Write the file to a stable path.
2. Verify it parses and opens.
3. Prefer opening it directly for the user via browser automation or OS scripting.
4. If a clickable URL is needed, serve over localhost with `python3 -m http.server <port> --bind 127.0.0.1` and open the browser yourself.
5. Do **not** treat a printed path or generated URL as proof of delivery. Verify with the intended renderer first.
6. Report both the local file path and the verified browser URL when a server is running.

## Anti-patterns

- Putting every new fact into `AGENTS.md` because "agents read it first".
- Reading both spec and plan templates for every docs task.
- Treating "continue" as unclassifiable; inspect active plans and recent commits.
- Treating "this is ugly" as a generic bug; it is a UI/a11y/responsiveness task until proven otherwise.
- Delivering a generated artifact by printing its path and assuming it opened or rendered correctly.
- Deleting completed plans instead of moving them to `.plans/archived/`.
