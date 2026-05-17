# `.github/` — GitHub conventions

GitHub-specific configuration: CI workflows, issue and PR templates, CODEOWNERS, and Dependabot. Read AGENTS.md and `.agents/references/repo-structure.md` first if you are adding new GitHub config — those govern how the layer fits with the rest of the agent surface.

## Files

| File / directory                     | Purpose                                                                                             |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `workflows/ci.yml`                   | Runs `npm run qa` on every push to `main` and every pull request. Sets stub Supabase env for build. |
| `workflows/e2e.yml`                  | Runs `npm run test:e2e` (Playwright chromium + webkit) on every pull request; uploads HTML report.  |
| `workflows/slack-release-notify.yml` | On push to `main`, posts the version and recent commits to Slack. Skipped silently without webhook. |
| `ISSUE_TEMPLATE/bug_report.md`       | Bug report stencil with repro / expected / environment / logs sections.                             |
| `ISSUE_TEMPLATE/feature_request.md`  | Feature request stencil with problem / proposed solution / alternatives sections.                   |
| `PULL_REQUEST_TEMPLATE.md`           | Pull request stencil with QA checklist (`npm run qa`, `qa:visual`, `qa:strict`), screenshots, etc.  |
| `CODEOWNERS`                         | Owner of every file. Currently `@Jailsom-Nogueira` for the whole template.                          |
| `dependabot.yml`                     | Weekly dependency updates for npm (grouped: types, next, testing, linting) and GitHub Actions.      |

## When this directory triggers

- **Push to `main`** → `ci.yml` (always) and `slack-release-notify.yml` (skipped without `SLACK_WEBHOOK_URL` secret).
- **Pull request opened or updated** → `ci.yml` and `e2e.yml`.
- **Issue created** → user picks one of the `ISSUE_TEMPLATE/*` stencils.
- **Pull request opened** → `PULL_REQUEST_TEMPLATE.md` is prefilled into the description.
- **Weekly** → Dependabot opens grouped PRs for npm and GitHub Actions updates.
- **Anyone reads or proposes changes** → CODEOWNERS requires the listed owners to review.

## Required secrets

| Secret              | Used by                              | Required? | If absent                             |
| ------------------- | ------------------------------------ | --------- | ------------------------------------- |
| `SLACK_WEBHOOK_URL` | `workflows/slack-release-notify.yml` | Optional  | Workflow logs "skipping" and exits 0. |

Other GitHub secrets (Vercel deploy hook, npm publish token, etc.) belong to the generated app, not this template.

## How to extend

- **New CI gate** → first add it to `scripts/qa-loop.sh` so it runs locally too, then it already runs in CI via `ci.yml` (which just calls `npm run qa`). Do not add ad-hoc steps to `ci.yml` that bypass the local QA loop.
- **New workflow that is not part of QA** → add `workflows/<name>.yml`. Document the trigger, required secrets, and behavior-when-secret-absent here.
- **New issue type** → add `ISSUE_TEMPLATE/<name>.md` with YAML frontmatter (`name`, `about`, `labels`).
- **New repo owner / team** → edit `CODEOWNERS`. Path-specific lines override the catch-all.
- **New dependency group for Dependabot** → add a `groups:` entry in `dependabot.yml` so related updates batch into one PR.

## When templating a new app

After generating a project from this template, update at least:

- `CODEOWNERS` — replace `@Jailsom-Nogueira` with your owner / team.
- `dependabot.yml` `open-pull-requests-limit` — adjust if your team prefers fewer/more concurrent PRs.
- `workflows/slack-release-notify.yml` — keep, replace, or remove depending on whether you use Slack.

## References

- GitHub Actions docs: https://docs.github.com/en/actions
- CODEOWNERS docs: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- Dependabot docs: https://docs.github.com/en/code-security/dependabot
