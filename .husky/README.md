# `.husky/` — Git hooks

[Husky](https://typicode.github.io/husky/) installs Git hooks from this directory. Hooks run automatically on commit / push and act as the **last-line local gate** before code leaves the developer's machine.

If you disable a hook to push faster, you are off-spec.

## Files

| Hook         | When it runs                    | What it does                                                                                            |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `commit-msg` | After commit message is entered | Runs `commitlint --edit "$1"` against `commitlint.config.mjs`. Enforces Conventional Commits.           |
| `pre-commit` | Before commit is finalized      | Runs `lint-staged`. See `package.json` `lint-staged` config for the exact glob → command map.           |
| `pre-push`   | Before push is sent             | Runs `tsc --noEmit`, then **blocks the push** unless `CHANGELOG_GENERATED=1` is set in the environment. |

The `_` directory is Husky's internal scaffolding (gitignored runtime). Do not edit it.

## The pre-push gate

`pre-push` blocks `git push` with this message when `CHANGELOG_GENERATED` is not set:

```text
Direct 'git push' is blocked. Run 'npm run push' to auto-generate the changelog and push.
   Emergency bypass: HUSKY=0 git push --no-verify (don't.)
```

This forces every push through `npm run push`, which runs `scripts/generate-changelog.ts` to prepend a dated CHANGELOG block and bump the patch version before pushing. The gate exists because:

- CHANGELOG must reflect the actual diff at push time, not at some earlier branch state.
- Patch-version bumps must be atomic with the changelog entry.
- A merge from `main` into a feature branch needs to re-run the changelog generator.

**Never** disable husky to skip this gate in normal workflow. The bypasses (`HUSKY=0`, `--no-verify`) exist only for irrecoverable emergencies (corrupted hooks, broken Node install).

## How to add a new hook

1. Create `.husky/<hook-name>` (executable, no extension). Use a Git hook name from `git help hooks`.
2. Make it executable: `chmod +x .husky/<hook-name>`.
3. First line should NOT be `#!/usr/bin/env sh` — Husky v9+ runs hook files directly.
4. Keep hook scripts short. If logic grows past 10 lines, move it to `scripts/<name>.sh` and call from the hook.
5. Update this README's "Files" table.

## How to extend pre-commit lint-staged

The `pre-commit` hook delegates to `lint-staged`. Edit the `lint-staged` block in `package.json` to add new glob → command pairs. Do not edit the hook file directly for routine changes.

## Conventions

- **Hooks must be idempotent.** Running `pre-commit` twice in a row should not produce different results.
- **Hooks must be fast.** Anything over ~5s on a small commit will train developers to bypass them.
- **Hooks fail loud.** Print one clear line about what failed and how to fix.
- **Hook scripts mirror QA gates.** What husky enforces locally, `scripts/qa-loop.sh` and CI re-enforce remotely.

## References

- Husky docs: https://typicode.github.io/husky/
- `commitlint.config.mjs` — Conventional Commits rules.
- `package.json` `lint-staged` — file-glob → command map.
- `scripts/generate-changelog.ts` — backs `npm run push`.
- `.agents/rules/qa-loop.md` — fail-loud / fail-fast philosophy that hooks share.
