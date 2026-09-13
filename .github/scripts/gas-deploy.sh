#!/usr/bin/env bash
# Shared GAS self-update caller for .github/workflows/auto-merge-claude.yml.
#
# WHY THIS IS ONE SCRIPT AND NOT EIGHT COPIES OF TWELVE LINES
# Response verification and the GET fallback were added to four of the eight
# Deploy steps and never reached the other four, so Testauthgas1, Testauthhtml1,
# Globalacl and MasterACL sat on `curl … || true` — no check, no fallback, no
# report — for months. Eight copies drift. One caller cannot.
#
# WHAT IT ASSERTS, AND WHY THAT IS THE WHOLE POINT
# pullAndDeployFromGitHub() returns "Updated to <v>" on a real deploy and
# "Already up to date (<v>)" when the running deployment's VERSION already
# matches what it read from GitHub. The workflow used to accept EITHER string
# with ANY version in it. That cannot distinguish a real deploy from a stale
# read of the .gs off the GitHub contents API, which would report the OLD
# version as current and pass. So the version in the answer must now equal the
# version in the commit being deployed. Anything else is a failure.
#
# EXIT CODE IS DELIBERATELY 0 ON FAILURE
# "Delete branch" and "Sweep stale claude branches" are gated on success(), so
# failing here would leave the claude/* branch alive and block the next push
# under push-once enforcement. Failures are recorded to $FAILFILE and the
# "Fail the run if any GAS deploy was unconfirmed" step at the end of the job
# turns the run red after cleanup has happened.
#
# Usage: bash .github/scripts/gas-deploy.sh <ProjectName> <DeploymentId> <path/to/project.gs>
set -uo pipefail

NAME="${1:?project name required}"
DEPLOYMENT_ID="${2:?deployment id required}"
GS_PATH="${3:?path to .gs required}"
FAILFILE="${RUNNER_TEMP:-/tmp}/gas-deploy-failures"

WANT=$(sed -n 's/^var VERSION *= *"\([^"]*\)".*/\1/p' "$GS_PATH" | head -1)
if [ -z "$WANT" ]; then
  echo "::error title=$NAME deploy::No VERSION constant found in $GS_PATH — refusing to report a deploy that cannot be verified."
  echo "$NAME (no VERSION constant in $GS_PATH)" >> "$FAILFILE"
  exit 0
fi

BASE="https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec"

confirm() {
  case "$1" in
    *"Updated to $WANT"*|*"Already up to date ($WANT)"*) return 0 ;;
  esac
  return 1
}

# GET FIRST. Measured on runs #558 and #561: the POST leg's response is never
# readable by the runner (Google's 302 drops it), so it printed "POST deploy
# unconfirmed" every single time — even on the runs where it HAD deployed. It
# cost 8-13s per project per run to learn nothing. The GET route returns the
# function's actual return string. POST is kept as a fallback rather than
# deleted because it has been observed to complete the deploy on its own.
RESP=$(curl -sL "$BASE?action=api&op=deploy" --max-time 120 2>/dev/null || echo "")
LEG=GET
if ! confirm "$RESP"; then
  echo "$NAME: GET did not confirm $WANT — trying POST fallback"
  RESP=$(curl -sL -X POST "$BASE" -d "action=deploy" --max-time 120 2>/dev/null || echo "")
  LEG=POST
fi

if confirm "$RESP"; then
  echo "$NAME deploy confirmed ($LEG): $RESP"
  # Version-ceiling gauge. The success string carries "N/200"; Apps Script caps a
  # project at 200 versions, and past that pullAndDeployFromGitHub() returns
  # DEPLOY HALTED and the live app silently stops advancing.
  USED=$(printf '%s' "$RESP" | sed -n 's|.*[^0-9]\([0-9][0-9]*\)/200.*|\1|p' | head -1)
  if [ -n "$USED" ] && printf '%s' "$USED" | grep -qE '^[0-9]+$' && [ "$USED" -ge 170 ]; then
    echo "::warning title=$NAME version ceiling::$USED/200 Apps Script versions used. At 200 the deploy stops advancing the live app. Free up versions in the editor."
  fi
  exit 0
fi

echo "::error title=$NAME GAS self-update FAILED::Expected $WANT; neither GET nor POST confirmed it. Run pullAndDeployFromGitHub() in the Apps Script editor, then check line 1. Response head: $(printf '%s' "$RESP" | head -c 300)"
echo "$NAME (expected $WANT)" >> "$FAILFILE"
exit 0

# Developed by: LightAISolutions
