#!/usr/bin/env bash
#
# check-quota.sh
#
# Probes the unauthenticated execution counter (?action=api&op=quota) on every
# GAS project that exposes one and prints one row per deployed project — the
# page, its GAS version, the counter's date, today's execution count and the
# top three event types — then a fleet total against the 20,000/day quota of
# the single consumer account every project runs under.
#
# Why this exists: design plan D14 (NETWORK-EVENTS-DESIGN-PLAN.md) puts ten
# projects on one 20,000-execution/day account. Each project's counter reads
# its own SessionAuditLog tab; only the sum says how close the account is. Q
# reads a month of these rows before deciding whether to move to Workspace.
#
# Same shape and trust model as check-acl-health.sh: runs OUTSIDE Google, the
# probed set is DISCOVERED from the .gs files (any project whose doGet
# dispatches op=quota is picked up automatically), and projects whose config
# still carries the YOUR_DEPLOYMENT_ID placeholder are skipped — they never
# deploy, so their copy of the op is repo-only bookkeeping.
#
# audit_log_disabled and spreadsheet_not_configured are WARNINGS, not failures:
# the deployment answered, it just has nothing to count. An empty or non-JSON
# body is a failure — the probe is unauthenticated and always answers when the
# deployment is alive, so silence means the deployment is unreachable. A probe
# that answers audit_log_unreadable is counted as a failure too: the counter
# is live but cannot read its own log, which is the fault Q needs to know about.
#
# Usage:  bash scripts/check-quota.sh [project ...]
# Exit:   0 = every probed project answered with a count (warnings allowed)
#         1 = at least one probe unreachable (or its log unreadable)
#         2 = nothing could be probed at all (not a pass — silence is the
#             outcome this script exists to avoid)

set -uo pipefail
cd "$(dirname "$0")/.." || exit 2

PLACEHOLDER="YOUR_DEPLOYMENT_ID"
TIMEOUT="${QUOTA_TIMEOUT:-90}"
DAILY_QUOTA=20000
want=("$@")
probed=0
failed=0
warned=0
total=0

# Renders one probe result as a table row. Exit 0 counted, 3 warning (answered
# but nothing to count), 1 failure. Prints the execution count on a second line
# prefixed with "#" so the caller can sum it without re-parsing.
PARSE='
import json, sys
name, raw = sys.argv[1], sys.argv[2].strip()
try:
    d = json.loads(raw)
except Exception:
    print("  FAIL  %-13s %-8s %-10s %10s  no JSON from the deployment: %s" % (name, "?", "?", "?", raw[:70] or "<empty response>"))
    raise SystemExit(1)
page = d.get("page") or name
ver = d.get("gasVersion", "?")
date = d.get("date", "?")
if d.get("success"):
    by = d.get("byEvent") or {}
    top = ", ".join("%s %d" % (k, v) for k, v in sorted(by.items(), key=lambda kv: (-kv[1], kv[0]))[:3]) or "-"
    n = int(d.get("executions") or 0)
    flag = "  (truncated)" if d.get("truncated") else ""
    print("  OK    %-13s %-8s %-10s %10d  %s%s" % (page, ver, date, n, top, flag))
    print("#%d" % n)
    raise SystemExit(0)
err = d.get("error", "?")
if err in ("audit_log_disabled", "spreadsheet_not_configured"):
    print("  WARN  %-13s %-8s %-10s %10s  %s" % (page, ver, date, "-", err))
    raise SystemExit(3)
print("  FAIL  %-13s %-8s %-10s %10s  %s" % (page, ver, date, "-", err))
det = (d.get("detail") or "").strip()
if det:
    print("        %s" % det)
raise SystemExit(1)
'

# Probe one project and print a single table row for it.
probe_one() {
  local name="$1" cfg="$2" id body out rc
  id=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('DEPLOYMENT_ID') or '')" "$cfg" 2>/dev/null)
  if [ -z "$id" ] || [ "$id" = "$PLACEHOLDER" ]; then
    printf '  SKIP  %-13s not deployed (no deployment id)\n' "$name"
    return
  fi

  probed=$((probed + 1))
  body=$(curl -sL --max-time "$TIMEOUT" \
    "https://script.google.com/macros/s/$id/exec?action=api&op=quota" 2>/dev/null)

  out=$(python3 -c "$PARSE" "$name" "$body"); rc=$?
  printf '%s\n' "$out" | grep -v '^#'
  case $rc in
    0) total=$((total + $(printf '%s\n' "$out" | grep '^#' | tr -d '#'))) ;;
    1) failed=$((failed + 1)) ;;
    3) warned=$((warned + 1)) ;;
  esac
}

echo "Execution quota — $(TZ=America/New_York date '+%Y-%m-%d %I:%M:%S %p %Z')"
printf '  %-5s %-13s %-8s %-10s %10s  %s\n' "" "page" "gas" "date" "executions" "top events"

# Discover the projects that actually serve the probe.
for gs in googleAppsScripts/*/*.gs; do
  grep -q "op=quota\|'quota'" "$gs" || continue
  dir=$(dirname "$gs")
  name=$(basename "$gs" .gs)
  cfg="$dir/$name.config.json"
  [ -f "$cfg" ] || { printf '  SKIP  %-13s no config file\n' "$name"; continue; }

  if [ ${#want[@]} -gt 0 ]; then
    match=0
    for w in "${want[@]}"; do
      [ "${w,,}" = "${name,,}" ] && match=1
    done
    [ $match -eq 1 ] || continue
  fi
  probe_one "$name" "$cfg"
done

if [ "$probed" -eq 0 ]; then
  echo "NOTHING PROBED — no deployed project serves op=quota."
  echo "This is not a pass. Either the probe has not been added to any deployed"
  echo "project, or the config files lost their deployment ids."
  exit 2
fi

pct=$(( total * 100 / DAILY_QUOTA ))
echo
echo "TOTAL — $total execution(s) today across $probed probed project(s) = ${pct}% of the $DAILY_QUOTA/day account quota."

if [ "$failed" -gt 0 ]; then
  echo
  echo "UNREACHABLE — $failed of $probed project(s) did not answer with a count."
  echo "The total above is a floor, not the account's real usage."
  exit 1
fi

if [ "$warned" -gt 0 ]; then
  echo
  echo "$warned project(s) answered but had nothing to count (audit log off or no"
  echo "spreadsheet configured) — their executions are not in the total."
fi

exit 0

# Developed by: LightAISolutions
