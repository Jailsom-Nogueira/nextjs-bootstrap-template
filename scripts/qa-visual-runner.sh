#!/usr/bin/env bash
# scripts/qa-visual-runner.sh
#
# Boots `next dev`, waits for /api/health, then runs `scripts/visual-qa.ts`.
# Always tears the dev server down on exit (trap), even on Ctrl-C.
#
# Exit code = visual-qa.ts's exit code (0 = green, 1 = at least one row failed).
#
# Reuses a running dev server if port 3000 is already serving the app.

set -euo pipefail

PORT="${PORT:-3000}"
BASE_URL="http://localhost:${PORT}"
LOG_FILE="/tmp/qa-visual-devserver.log"
PID_FILE="/tmp/qa-visual-devserver.pid"

STARTED_BY_US=0

cleanup() {
  if [ "$STARTED_BY_US" = "1" ] && [ -f "$PID_FILE" ]; then
    local pid
    pid="$(cat "$PID_FILE" 2>/dev/null || echo "")"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      sleep 1
      kill -9 "$pid" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
}
trap cleanup EXIT INT TERM

probe() {
  curl -sf -o /dev/null -m 2 "$BASE_URL/api/health"
}

if probe; then
  echo "qa-visual: reusing dev server already on $BASE_URL"
else
  echo "qa-visual: starting dev server (log: $LOG_FILE)"
  rm -f "$LOG_FILE" "$PID_FILE"
  # shellcheck disable=SC2024
  nohup npm run dev > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
  STARTED_BY_US=1

  echo -n "qa-visual: waiting for $BASE_URL/api/health "
  for _ in $(seq 1 60); do
    if probe; then
      echo " up."
      break
    fi
    echo -n "."
    sleep 1
  done
  if ! probe; then
    echo
    echo "qa-visual: dev server failed to come up. Last 40 lines of log:"
    tail -n 40 "$LOG_FILE" || true
    exit 1
  fi
fi

VISUAL_QA_BASE_URL="$BASE_URL" npx tsx scripts/visual-qa.ts
