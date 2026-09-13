#!/usr/bin/env python3
"""Guard for the C3 migration window: the guidance modules must not diverge.

C3 session 1 copied the nine `guidanceDoc*_()` content functions and the three
read helpers (`guidanceDocs_`, `guidanceIndex_`, `guidanceDoc_`) from
`Profiler.gs` into `Classroom.gs`. Both copies stay live through C3 sessions
1-2, because the design requires Profiler's hub to keep serving until its slice
is cut over and `guidanceMentions_()` cannot answer without the content beside
it (PHASE6-CLASSROOM-DESIGN.md -> Phase plan -> C3 slice plan).

A duplicate is only safe while it is identical. The named risk is real and
scheduled: the bankability review (`bess-bankability-2026-08`, reviewBy
2026-10-01) sits beside C3 as order 3 of INTEGRATED-REMEDIATION-PLAN.md 7.3 and
it edits a module. A one-sided edit would look fine in both apps and then be
silently dropped when session 3 deletes Profiler's copy. This script compares
the two copies function by function and fails on any difference.

It is DELETED in C3 session 3, together with Profiler's copy of the functions.

Usage:  python3 scripts/check-guidance-parity.py
Exit:   0 when both files hold identical copies, 1 on any divergence.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROFILER = ROOT / "googleAppsScripts" / "Profiler" / "Profiler.gs"
CLASSROOM = ROOT / "googleAppsScripts" / "Classroom" / "Classroom.gs"

CONTENT = ["guidanceDocBessTech_", "guidanceDocPowerInfra_", "guidanceDocNvidia800_",
           "guidanceDocUtilityAidc_", "guidanceDocLargeLoadInterconnection_",
           "guidanceDocGridEquipment_", "guidanceDocChinaPolicy_",
           "guidanceDocBankability_", "guidanceDocEo14420_"]
HELPERS = ["guidanceDocs_", "guidanceIndex_", "guidanceDoc_"]
EXPECTED_MODULES = 9

errors = []


def extract(src, name):
    """The full source of `function <name>(...) { ... }`, brace-matched.

    String-aware so a brace inside module prose cannot end the function early —
    the modules are ~326 KB of JSON literals and they contain plenty of both.
    """
    m = re.search(r"^function %s\(" % re.escape(name), src, re.M)
    if not m:
        return None
    i = src.index("{", m.start())
    depth, j, quote = 0, src.index("{", m.start()), None
    while j < len(src):
        ch = src[j]
        if quote:
            if ch == "\\":
                j += 2
                continue
            if ch == quote:
                quote = None
        elif ch in "\"'":
            quote = ch
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return src[m.start():j + 1]
        j += 1
    return None


def main():
    try:
        prof = PROFILER.read_text(encoding="utf-8")
        cls = CLASSROOM.read_text(encoding="utf-8")
    except OSError as e:
        print("cannot read a .gs — %s" % e)
        return 1

    for name in CONTENT + HELPERS:
        a, b = extract(prof, name), extract(cls, name)
        if a is None:
            errors.append("%s: missing from Profiler.gs" % name)
            continue
        if b is None:
            errors.append("%s: missing from Classroom.gs" % name)
            continue
        if a != b:
            errors.append("%s: the two copies differ (%d bytes in Profiler.gs, %d in "
                          "Classroom.gs) — edit BOTH or neither until C3 session 3 "
                          "removes Profiler's copy" % (name, len(a), len(b)))

    # Module ids are permanent: Scraper's `guidance:<module-id>` seed sources and
    # every Classroom lesson's provenance stamp key on them.
    ids = {}
    for label, src in (("Profiler.gs", prof), ("Classroom.gs", cls)):
        reg = extract(src, "guidanceDocs_") or ""
        # The registry's own `function guidanceDocs_()` line matches the same
        # shape as its entries, so match the registered CONTENT names only.
        found = [n for n in CONTENT if re.search(r"\b%s\(\)" % re.escape(n), reg)]
        if len(found) != EXPECTED_MODULES:
            errors.append("%s: guidanceDocs_() registers %d modules, expected %d"
                          % (label, len(found), EXPECTED_MODULES))
        ids[label] = [re.search(r'"id":\s*"([^"]+)"', extract(src, n) or "").group(1)
                      for n in CONTENT if extract(src, n)
                      and re.search(r'"id":\s*"([^"]+)"', extract(src, n))]
    if ids.get("Profiler.gs") != ids.get("Classroom.gs"):
        errors.append("module ids differ between the two files: %r vs %r"
                      % (ids.get("Profiler.gs"), ids.get("Classroom.gs")))

    if errors:
        for e in errors:
            print("ERROR  %s" % e)
        print("\n%d finding(s) — the guidance copies have diverged." % len(errors))
        return 1
    print("OK  %d modules + %d helpers identical in Profiler.gs and Classroom.gs"
          % (len(CONTENT), len(HELPERS)))
    print("OK  module ids match: %s" % ", ".join(ids["Profiler.gs"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Developed by: LightAISolutions
