#!/usr/bin/env bash
#
# check-acl-health.sh
#
# Probes the unauthenticated ACL health endpoint (?action=api&op=aclhealth) on
# every GAS project that exposes one, and reports whether sign-in can actually
# read the Master ACL right now.
#
# Why this exists: three separate sign-in outages were all discovered the same
# way — a developer hitting a wall. Each was the same account-level fault (a
# lapsed `https://www.googleapis.com/auth/spreadsheets` grant makes
# SpreadsheetApp.openById throw for every caller), so it takes down every auth
# app at once and stays down until someone re-consents in Google. A schedule can
# catch that; a person opening an app cannot catch it any earlier than the
# moment it has already cost them.
#
# Deliberately runs OUTSIDE Google. A GAS-side time-driven check would sit in
# the same account whose grant keeps lapsing — the one failure domain a monitor
# must not share with what it monitors.
#
# The probed set is DISCOVERED, not hardcoded: any project whose .gs dispatches
# op=aclhealth is picked up automatically, so adding the probe to another
# project enrolls it here with no edit to this file.
#
# Usage:  bash scripts/check-acl-health.sh [project ...]
# Exit:   0 = every probed project healthy
#         1 = at least one project unhealthy
#         2 = nothing could be probed at all (a failure worth investigating,
#             not a pass — silence is the outcome this script exists to avoid)

set -uo pipefail
cd "$(dirname "$0")/.." || exit 2

PLACEHOLDER="YOUR_DEPLOYMENT_ID"
TIMEOUT="${ACL_HEALTH_TIMEOUT:-90}"
want=("$@")
probed=0
failed=0
warned=0

# Renders one probe result. Exit 0 healthy, 1 unhealthy, 3 healthy but the
# last-known-good snapshot is not armed (sign-in works, the safety net does not).
PARSE='
import json, sys
name, raw = sys.argv[1], sys.argv[2].strip()
try:
    d = json.loads(raw)
except Exception:
    print("  FAIL %-12s no JSON from the deployment: %s" % (name, raw[:90] or "<empty response>"))
    raise SystemExit(1)
g = d.get("grace") or {}
tail = ""
if g:
    tail = "  [grace: %d user(s), %ss old, %s]" % (
        g.get("users", 0), g.get("ageSec", -1),
        "armed" if g.get("usable") else "NOT armed")
if d.get("ok"):
    print("  OK   %-12s %s  %s%s" % (name, d.get("gasVersion", "?"), d.get("reason", ""), tail))
    raise SystemExit(0 if (not g or g.get("usable")) else 3)
print("  FAIL %-12s %s  stage=%s reason=%s%s" % (
    name, d.get("gasVersion", "?"), d.get("stage", "?"), d.get("reason", "?"), tail))
det = (d.get("detail") or "").strip()
if det:
    print("       %s" % det)
raise SystemExit(1)
'

# Probe one project and print a single status line for it.
probe_one() {
  local name="$1" cfg="$2" id body
  id=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('DEPLOYMENT_ID') or '')" "$cfg" 2>/dev/null)
  if [ -z "$id" ] || [ "$id" = "$PLACEHOLDER" ]; then
    printf '  SKIP %-12s not deployed (no deployment id)\n' "$name"
    return
  fi

  probed=$((probed + 1))
  body=$(curl -sL --max-time "$TIMEOUT" \
    "https://script.google.com/macros/s/$id/exec?action=api&op=aclhealth" 2>/dev/null)

  # An empty or non-JSON body is itself a failure: the probe is unauthenticated
  # and always answers when the deployment is alive, so no answer means the
  # deployment is unreachable — which blocks sign-in just as thoroughly.
  python3 -c "$PARSE" "$name" "$body"
  case $? in
    1) failed=$((failed + 1)) ;;
    3) warned=$((warned + 1)) ;;
  esac
}

echo "ACL health — $(TZ=America/New_York date '+%Y-%m-%d %I:%M:%S %p %Z')"

# Discover the projects that actually serve the probe.
for gs in googleAppsScripts/*/*.gs; do
  grep -q "op=aclhealth\|'aclhealth'" "$gs" || continue
  dir=$(dirname "$gs")
  name=$(basename "$gs" .gs)
  cfg="$dir/$name.config.json"
  [ -f "$cfg" ] || { printf '  SKIP %-12s no config file\n' "$name"; continue; }

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
  echo "NOTHING PROBED — no deployed project serves op=aclhealth."
  echo "This is not a pass. Either the probe has not been added to any deployed"
  echo "project, or the config files lost their deployment ids."
  exit 2
fi

if [ "$failed" -gt 0 ]; then
  echo
  echo "UNHEALTHY — $failed of $probed project(s) cannot read the Master ACL."
  echo "Sign-in is failing for EVERY user of the affected app(s) right now."
  echo
  echo "A reason of acl_unreachable with a permissions message is account-level:"
  echo "the script cannot call SpreadsheetApp at all, so the spreadsheet itself,"
  echo "its tabs, and its rows are all irrelevant. Repair it in Google, not here:"
  echo "  1. Apps Script editor -> Run -> diagnoseAuthorization()"
  echo "  2. Open the authorization URL it prints, in a private window signed in"
  echo "     ONLY as the script account"
  echo "  3. Approve EVERY checkbox — one unticked box reproduces this exactly"
  echo "  4. Re-run this script to confirm"
  exit 1
fi

if [ "$warned" -gt 0 ]; then
  echo
  echo "HEALTHY, with $warned warning(s): sign-in works, but a last-known-good"
  echo "snapshot is not armed, so the next outage would be a hard lockout again."
  echo "A snapshot arms itself on the next successful sign-in — if this persists,"
  echo "check that ACL_GRACE_ENABLED is still true."
fi

echo
echo "HEALTHY — $probed project(s) can read the Master ACL."

# Developed by: LightAISolutions
