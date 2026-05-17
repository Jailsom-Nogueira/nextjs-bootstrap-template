#!/usr/bin/env bash
# QA loop — runs all gates in cheapest→most-expensive order.
# Stops at the FIRST failing gate and prints the failure block clearly so an agent
# (or human) can fix it, then re-run. Exits 0 only when EVERY gate passes.
#
# Usage:
#   bash scripts/qa-loop.sh             # run once, exit on first failure
#   bash scripts/qa-loop.sh --strict    # also runs e2e + bundle-budget diagnostics + visual QA (slow)
#   bash scripts/qa-loop.sh --quiet     # only print failures
#
# Designed to be invoked from a coding-agent loop:
#   while ! bash scripts/qa-loop.sh; do
#     <agent reads stderr/stdout, applies a fix>
#   done
#
# Each gate prints a delimited block:
#   ===== GATE: <name> =====
#   <output>
#   ===== END GATE: <name> (PASS|FAIL exit=N duration=Ns) =====

set -u
set -o pipefail

# ---- args -----------------------------------------------------------------
STRICT=0
QUIET=0
for arg in "$@"; do
  case "$arg" in
    --strict) STRICT=1 ;;
    --quiet)  QUIET=1 ;;
    -h|--help)
      sed -n '2,18p' "$0"
      exit 0
      ;;
    *)
      echo "qa-loop: unknown arg '$arg' (use --strict or --quiet)" >&2
      exit 2
      ;;
  esac
done

# ---- colors (only on a TTY) -----------------------------------------------
if [ -t 1 ] && command -v tput >/dev/null 2>&1 && [ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]; then
  C_RED=$(tput setaf 1); C_GREEN=$(tput setaf 2); C_YELLOW=$(tput setaf 3)
  C_BLUE=$(tput setaf 4); C_BOLD=$(tput bold); C_RESET=$(tput sgr0)
else
  C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_BOLD=""; C_RESET=""
fi

# ---- state ----------------------------------------------------------------
declare -a GATE_NAMES=()
declare -a GATE_STATUS=()
declare -a GATE_TIMES=()
declare -a GATE_EXITS=()
FIRST_FAIL_NAME=""
FIRST_FAIL_EXIT=0

# ---- helpers --------------------------------------------------------------
log() {
  if [ "$QUIET" -eq 0 ]; then
    printf '%s\n' "$*"
  fi
}

log_always() {
  printf '%s\n' "$*"
}

run_gate() {
  local name="$1"; shift
  local cmd_label="$1"; shift
  # remaining args are the command + its args

  local start_ts end_ts dur tmpfile exit_code
  start_ts=$(date +%s)
  tmpfile=$(mktemp -t qa-loop-XXXXXX)

  log ""
  log "${C_BLUE}===== GATE: ${name} =====${C_RESET}"
  log "${C_BOLD}\$ ${cmd_label}${C_RESET}"

  # Run, capturing combined output to tmpfile and (in non-quiet) streaming live.
  if [ "$QUIET" -eq 1 ]; then
    "$@" >"$tmpfile" 2>&1
    exit_code=$?
  else
    "$@" 2>&1 | tee "$tmpfile"
    exit_code=${PIPESTATUS[0]}
  fi

  end_ts=$(date +%s)
  dur=$((end_ts - start_ts))

  GATE_NAMES+=("$name")
  GATE_TIMES+=("$dur")
  GATE_EXITS+=("$exit_code")

  if [ "$exit_code" -eq 0 ]; then
    GATE_STATUS+=("PASS")
    log "${C_GREEN}===== END GATE: ${name} (PASS exit=0 duration=${dur}s) =====${C_RESET}"
    rm -f "$tmpfile"
    return 0
  fi

  GATE_STATUS+=("FAIL")
  FIRST_FAIL_NAME="$name"
  FIRST_FAIL_EXIT=$exit_code

  # If we were quiet, dump the captured output now so the fixer can see it.
  if [ "$QUIET" -eq 1 ]; then
    log_always ""
    log_always "${C_BLUE}===== GATE: ${name} (output) =====${C_RESET}"
    cat "$tmpfile"
  fi
  log_always "${C_RED}===== END GATE: ${name} (FAIL exit=${exit_code} duration=${dur}s) =====${C_RESET}"
  rm -f "$tmpfile"
  return "$exit_code"
}

print_skip() {
  local name="$1"; local why="$2"
  GATE_NAMES+=("$name")
  GATE_STATUS+=("SKIP")
  GATE_TIMES+=(0)
  GATE_EXITS+=(0)
  log ""
  log "${C_YELLOW}===== GATE: ${name} (SKIPPED — ${why}) =====${C_RESET}"
}

print_summary() {
  local total="${#GATE_NAMES[@]}"
  local i
  log_always ""
  log_always "${C_BOLD}===== QA SUMMARY =====${C_RESET}"
  printf '%-22s %-6s %-10s %s\n' "GATE" "STATUS" "DURATION" "EXIT"
  printf '%-22s %-6s %-10s %s\n' "----" "------" "--------" "----"
  for ((i = 0; i < total; i++)); do
    local status="${GATE_STATUS[$i]}"
    local color="$C_RESET"
    case "$status" in
      PASS) color="$C_GREEN" ;;
      FAIL) color="$C_RED" ;;
      SKIP) color="$C_YELLOW" ;;
    esac
    printf '%-22s %s%-6s%s %-10s %s\n' \
      "${GATE_NAMES[$i]}" \
      "$color" "$status" "$C_RESET" \
      "${GATE_TIMES[$i]}s" \
      "${GATE_EXITS[$i]}"
  done
  if [ -n "$FIRST_FAIL_NAME" ]; then
    log_always ""
    log_always "${C_RED}${C_BOLD}First failing gate: ${FIRST_FAIL_NAME} (exit=${FIRST_FAIL_EXIT})${C_RESET}"
    log_always "Fix the root cause, then re-run: ${C_BOLD}npm run qa${C_RESET}"
    log_always "See .agents/rules/qa-loop.md for the protocol."
  else
    log_always ""
    log_always "${C_GREEN}${C_BOLD}All gates passed. ✅${C_RESET}"
  fi
}

# ---- env for the build gate ----------------------------------------------
export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://stub.supabase.co}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-stub_anon_key_for_build}"
export SKIP_ENV_VALIDATION="${SKIP_ENV_VALIDATION:-1}"

# ---- pre-flight: clean stale build log -----------------------------------
# NOTE: must be OUTSIDE .next/ — `next build` clears .next/ at the start.
mkdir -p node_modules/.cache 2>/dev/null || true
rm -f node_modules/.cache/qa-build.log 2>/dev/null || true

# ---- the loop -------------------------------------------------------------
log "${C_BOLD}qa-loop: starting${C_RESET} (strict=${STRICT} quiet=${QUIET})"

# Gate 1: format:check
if ! run_gate "format:check" "npm run format:check" npm run format:check; then
  print_summary
  exit "$FIRST_FAIL_EXIT"
fi

# Gate 2: lint
if ! run_gate "lint" "npm run lint" npm run lint; then
  print_summary
  exit "$FIRST_FAIL_EXIT"
fi

# Gate 3: typecheck
if ! run_gate "typecheck" "npm run typecheck" npm run typecheck; then
  print_summary
  exit "$FIRST_FAIL_EXIT"
fi

# Gate 4: test
if ! run_gate "test" "npm run test" npm run test; then
  print_summary
  exit "$FIRST_FAIL_EXIT"
fi

# Gate 5: build (tee output to node_modules/.cache/qa-build.log so the bundle-budget gate can parse it)
build_start=$(date +%s)
log ""
log "${C_BLUE}===== GATE: build =====${C_RESET}"
log "${C_BOLD}\$ npm run build${C_RESET}"
mkdir -p node_modules/.cache 2>/dev/null || true
if [ "$QUIET" -eq 1 ]; then
  npm run build >node_modules/.cache/qa-build.log 2>&1
  build_exit=$?
else
  npm run build 2>&1 | tee node_modules/.cache/qa-build.log
  build_exit=${PIPESTATUS[0]}
fi
build_end=$(date +%s)
build_dur=$((build_end - build_start))
GATE_NAMES+=("build")
GATE_TIMES+=("$build_dur")
GATE_EXITS+=("$build_exit")
if [ "$build_exit" -ne 0 ]; then
  GATE_STATUS+=("FAIL")
  FIRST_FAIL_NAME="build"
  FIRST_FAIL_EXIT="$build_exit"
  if [ "$QUIET" -eq 1 ]; then
    log_always ""
    log_always "${C_BLUE}===== GATE: build (output) =====${C_RESET}"
    cat node_modules/.cache/qa-build.log
  fi
  log_always "${C_RED}===== END GATE: build (FAIL exit=${build_exit} duration=${build_dur}s) =====${C_RESET}"
  print_summary
  exit "$build_exit"
fi
GATE_STATUS+=("PASS")
log "${C_GREEN}===== END GATE: build (PASS exit=0 duration=${build_dur}s) =====${C_RESET}"

# ---- strict-only gates ---------------------------------------------------
if [ "$STRICT" -eq 1 ]; then
  # Gate 6: test:e2e
  if ! run_gate "test:e2e" "npm run test:e2e" npm run test:e2e; then
    print_summary
    exit "$FIRST_FAIL_EXIT"
  fi

  # Gate 7: bundle-budget
  if ! run_gate "bundle-budget" "node scripts/check-bundle-budget.mjs" node scripts/check-bundle-budget.mjs; then
    print_summary
    exit "$FIRST_FAIL_EXIT"
  fi

  # Gate 8: qa:visual (browser-side QA — boots dev server, screenshots, console, axe-core)
  if ! run_gate "qa:visual" "npm run qa:visual" npm run qa:visual; then
    print_summary
    exit "$FIRST_FAIL_EXIT"
  fi
else
  print_skip "test:e2e"      "not --strict (run with: npm run qa:strict)"
  print_skip "bundle-budget" "not --strict (run with: npm run qa:strict)"
  print_skip "qa:visual"     "not --strict (run with: npm run qa:strict, or directly: npm run qa:visual)"
fi

print_summary
exit 0
