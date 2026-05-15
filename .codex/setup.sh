#!/usr/bin/env bash
set -euo pipefail
echo "▶ Installing dependencies…"
npm ci --no-audit --no-fund
echo "▶ Installing Playwright browsers (chromium only for speed)…"
npx playwright install --with-deps chromium
echo "▶ Verifying env…"
[ -f .env.local ] || echo "⚠ .env.local not present; copy from .env.example and fill in."
echo "▶ Quick QA…"
npm run qa
echo "✅ Codex setup complete."
