#!/usr/bin/env bash
set -euo pipefail

# Generate TypeScript types from the Supabase schema.
# Requires: SUPABASE_PROJECT_REF in env (or pass as arg).
# Requires: `supabase` CLI installed.

PROJECT_REF="${SUPABASE_PROJECT_REF:-${1:-}}"

if [[ -z "$PROJECT_REF" ]]; then
  echo "ERROR: SUPABASE_PROJECT_REF not set. Either export it or pass as first arg." >&2
  exit 1
fi

if ! command -v supabase >/dev/null 2>&1; then
  echo "ERROR: supabase CLI not installed. https://supabase.com/docs/guides/cli" >&2
  exit 1
fi

supabase gen types typescript --project-id "$PROJECT_REF" --schema public \
  > src/supabase/database.types.ts

echo "✓ Wrote src/supabase/database.types.ts"
