#!/usr/bin/env bash
# Fast lane for agent inner-loops.
# Runs vitest only on files changed against origin/main when available;
# falls back to HEAD~1, then to running the full suite.
set -uo pipefail

dot=(--reporter=dot --no-coverage)

if git rev-parse --verify --quiet origin/main >/dev/null; then
  exec npx vitest run "${dot[@]}" --changed origin/main
fi

if git rev-parse --verify --quiet HEAD~1 >/dev/null; then
  exec npx vitest run "${dot[@]}" --changed HEAD~1
fi

# No git history reachable — just run everything in fast mode.
exec npx vitest run "${dot[@]}"
