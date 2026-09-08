#!/usr/bin/env python3
"""Classroom curriculum health report — CLASSROOM-CURRICULUM-PLAN.md §10.9 (S1).

A REPORT, not a gate: exit 0 by default; `--strict` exits 1 on the structural
findings only. It reads Classroom.gs through the content checker's parser,
profiler-segments.json, the registries and the guidance module list, and prints:

  1. Lessons per lane and per track, with the gate distribution per lane
     (tracks / guidance / briefing / reports) — the analyst-visible share as a number
  2. Segment coverage against the floor rule — per segment: members, incumbents,
     challengers, floor met, segment lesson present, landscape module present.
     Strict: a landscape on a below-floor segment; a registered segment with no
     lesson; a member slug with no profile. `unassigned[]` is reported, not strict
  3. Stale pins — per lesson, inputs whose live date is later than the pin (the
     pipeline's candidate list made visible); for segment-* lessons this is
     "regeneration due", read from build-classroom-segments.py --check
  4. Drill pool size — sf · ss · lc · lq · rc against their caps
  5. Review dates — every lesson and module whose reviewBy is within 30 days or passed

Usage:  python3 scripts/check-classroom-curriculum.py [--strict] [--today YYYY-MM-DD] [--base origin/main]
"""
import argparse
import datetime as dt
import glob
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "live-site-pages" / "profiler-data"
GS = ROOT / "googleAppsScripts" / "Classroom" / "Classroom.gs"
PROFILER_GS = ROOT / "googleAppsScripts" / "Profiler" / "Profiler.gs"
SEGMENTS = DATA / "profiler-segments.json"
REPORTS_INDEX = DATA / "reports" / "reports-index.json"
GENERATOR = ROOT / "scripts" / "build-classroom-segments.py"
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
UNDATED_LAYERS = {"project": "live-site-pages/profiler-data/profiler-projects.json",
                  "concepts": "live-site-pages/profiler-data/profiler-concepts.json"}

strict_findings, notes = [], []


def strict(msg):
    strict_findings.append(msg)


def load_checker():
    spec = importlib.util.spec_from_file_location("ccc", ROOT / "scripts" / "check-classroom-content.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def git_date(base, rel):
    for rev in (base, "HEAD"):
        try:
            out = subprocess.run(["git", "log", "-1", "--format=%cs", rev, "--", rel], cwd=ROOT,
                                 capture_output=True, text=True, timeout=30)
        except (OSError, subprocess.TimeoutExpired):
            return ""
        if out.returncode == 0 and DATE_RE.match(out.stdout.strip()):
            return out.stdout.strip()
    return ""


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


def guidance_modules():
    """id → {updated, reviewBy, group, file} for every guidanceDoc<Name>_()
    literal, wherever it lives (Profiler.gs until C3, Classroom.gs after). The
    four keys sit at the top of each strict-JSON literal, so a bounded regex
    window after the function head reads them without parsing the whole file."""
    out = {}
    for path in (PROFILER_GS, GS):
        try:
            src = path.read_text(encoding="utf-8")
        except OSError:
            continue
        for m in re.finditer(r"^function guidanceDoc[A-Z]\w*_\(\) \{", src, re.M):
            window = src[m.end():m.end() + 3000]
            mid = re.search(r'"id":\s*"([a-z0-9][a-z0-9-]*)"', window)
            if not mid:
                continue
            upd = re.search(r'"updated":\s*"(\d{4}-\d{2}-\d{2})"', window)
            rev = re.search(r'"reviewBy":\s*"(\d{4}-\d{2}-\d{2})"', window)
            grp = re.search(r'"group":\s*"([^"]+)"', window)
            out.setdefault(mid.group(1), {"updated": upd.group(1) if upd else "",
                                          "reviewBy": rev.group(1) if rev else "",
                                          "group": grp.group(1) if grp else "", "file": path.name})
    return out


def gate_of(lesson, ref_kinds, caps, strictness):
    kinds = []
    for i in (lesson.get("provenance") or {}).get("inputs") or []:
        ref = str(i.get("ref", "")) if isinstance(i, dict) else ""
        k = ref_kinds.get(ref.split(":", 1)[0]) if ":" in ref else None
        if not k or i.get("kind") != k:
            return "(denied)"
        kinds.append(k)
    if not kinds:
        return "(denied)"
    top = max(kinds, key=lambda k: strictness.index(k) if k in strictness else -1)
    return caps.get(top, "(denied)")


def live_date(ref, base, cache):
    """The source's live revision date, read off the source itself (G2) — or ''."""
    if ref in cache:
        return cache[ref]
    prefix, _, ident = ref.partition(":")
    d = ""
    if prefix in ("profile", "study"):
        obj = read_json(DATA / ("%s.%s.json" % (ident, prefix)))
        d = str((obj or {}).get("lastUpdated") or "")
    elif prefix == "graph":
        d = str((read_json(DATA / "profiler-graph.json") or {}).get("built") or "")
    elif prefix in UNDATED_LAYERS:
        d = git_date(base, UNDATED_LAYERS[prefix])
    elif prefix == "guidance":
        d = guidance_modules().get(ident, {}).get("updated", "")
    elif prefix == "report":
        obj = read_json(DATA / "reports" / ("%s.report.json" % ident))
        d = str((obj or {}).get("generated") or "")
    cache[ref] = d if DATE_RE.match(d) else ""
    return cache[ref]


def floor_met(seg):
    roles = [m.get("role") for m in seg.get("members") or []]
    return len(roles) >= 3 and "incumbent" in roles and "challenger" in roles


def main():
    ap = argparse.ArgumentParser(description="Classroom curriculum health report (§10.9)")
    ap.add_argument("--strict", action="store_true", help="exit 1 on structural findings")
    ap.add_argument("--today", default=None, help="YYYY-MM-DD (default: today, EST)")
    ap.add_argument("--base", default="origin/main", help="revision for the undated layers' commit dates")
    args = ap.parse_args()
    if args.today:
        today = args.today
    else:
        import zoneinfo
        today = dt.datetime.now(zoneinfo.ZoneInfo("America/New_York")).strftime("%Y-%m-%d")
    horizon = (dt.date.fromisoformat(today) + dt.timedelta(days=30)).isoformat()

    ccc = load_checker()
    src = GS.read_text(encoding="utf-8")
    lessons = ccc.parse_literals(src, "clLesson")
    tracks = ccc.parse_literals(src, "clTrack")
    if ccc.errors:
        print("Classroom.gs literals do not parse — run check-classroom-content.py first:")
        for e in ccc.errors[:5]:
            print("  " + e)
        return 1
    ref_kinds = ccc.js_map(src, "CL_PROVENANCE_REF_KINDS")
    caps = ccc.js_map(src, "CL_PROVENANCE_CAPS")
    strictness = ccc.js_list(src, "CL_PROVENANCE_STRICTNESS")
    by_id = {l["id"]: l for l in lessons.values()}
    track_order = [tracks[fn] for fn in ccc.registered(src, "clTracks_") if fn in tracks]
    lesson_order = [lessons[fn] for fn in ccc.registered(src, "clLessons_") if fn in lessons]
    modules = guidance_modules()
    seg_reg = read_json(SEGMENTS) or {"segments": [], "unassigned": []}

    print("check-classroom-curriculum — %s" % today)
    print("=" * 72)

    # 1 · Lessons per lane and per track, gate distribution per lane
    print("\n1 · Lessons per lane and per track")
    lanes, in_track = {}, set()
    for l in lesson_order:
        lanes.setdefault(l.get("group") or "(none)", []).append(l)
    for t in track_order:
        in_track |= set(t.get("lessons") or [])
    for lane, ls in lanes.items():
        gates = {}
        for l in ls:
            g = gate_of(l, ref_kinds, caps, strictness)
            gates[g] = gates.get(g, 0) + 1
        analyst = gates.get("tracks", 0)
        print("  %-30s %2d lesson(s)  analyst-visible %d/%d  gates: %s" % (
            lane, len(ls), analyst, len(ls), ", ".join("%s %d" % kv for kv in sorted(gates.items()))))
        for t in [t for t in track_order if (t.get("group") or "(none)") == lane]:
            ids = t.get("lessons") or []
            print("    track %-34s %2d lesson(s)%s" % (t["id"], len(ids),
                  ("  prereqs: " + ", ".join(t.get("prereqs") or [])) if t.get("prereqs") else ""))
    loose = [l["id"] for l in lesson_order if l["id"] not in in_track and l.get("type", "module") == "module"]
    if loose:
        print("  modules registered in no track: " + ", ".join(loose))
    briefs = [l["id"] for l in lesson_order if l.get("type") == "briefing"]
    print("  briefings: %d%s" % (len(briefs), (" (latest %s)" % briefs[-1]) if briefs else ""))

    # 2 · Segment coverage vs the floor
    print("\n2 · Segment coverage against the floor rule")
    print("  %-42s %3s %3s %3s  %-5s %-6s %s" % ("segment", "mem", "inc", "cha", "floor", "lesson", "landscape"))
    landscapes = {}
    for mid in modules:
        m = re.match(r"^landscape-([a-z0-9-]+)-\d{4}-\d{2}$", mid)
        if m:
            landscapes.setdefault(m.group(1), []).append(mid)
    seg_ids = set()
    for s in seg_reg.get("segments") or []:
        seg_ids.add(s["id"])
        mem = s.get("members") or []
        inc = sum(1 for m in mem if m.get("role") == "incumbent")
        cha = sum(1 for m in mem if m.get("role") == "challenger")
        met = floor_met(s)
        has_lesson = ("segment-%s" % s["id"]) in by_id
        land = landscapes.get(s["id"], [])
        print("  %-42s %3d %3d %3d  %-5s %-6s %s" % (s["id"], len(mem), inc, cha, "yes" if met else "NO",
                                                     "yes" if has_lesson else "NONE", ", ".join(land) or "—"))
        if not has_lesson:
            strict("segment %s has no segment lesson — run build-classroom-segments.py" % s["id"])
        if land and not met:
            strict("segment %s carries landscape %s but is below the floor" % (s["id"], ", ".join(land)))
        for m in mem:
            if not (DATA / ("%s.profile.json" % m.get("slug"))).exists():
                strict("segment %s: member %r has no profile file" % (s["id"], m.get("slug")))
    stray = [lid for lid in by_id if lid.startswith("segment-") and lid[len("segment-"):] not in seg_ids]
    for lid in stray:
        print("  lesson %s has no segment in the registry" % lid)
    for u in seg_reg.get("unassigned") or []:
        print("  unassigned: %s — %s" % (u.get("slug"), u.get("reason")))
    for sid, mids in landscapes.items():
        if sid not in seg_ids:
            print("  landscape %s names no registered segment" % ", ".join(mids))

    # 3 · Stale pins
    print("\n3 · Stale pins (live date later than the pin)")
    cache, stale_n = {}, 0
    for l in lesson_order:
        if l["id"].startswith("segment-"):
            continue
        for i in (l.get("provenance") or {}).get("inputs") or []:
            ref, pin = str(i.get("ref", "")), str(i.get("date") or "")
            live = live_date(ref, args.base, cache)
            if not live:
                if ref.split(":")[0] in ("corpus", "briefing"):
                    continue
                print("  %-36s %-44s live date unknown" % (l["id"], ref))
            elif pin and live > pin:
                stale_n += 1
                print("  %-36s %-44s pin %s → live %s" % (l["id"], ref, pin, live))
    print("  %d stale pin(s) on the hand-authored lessons" % stale_n)
    try:
        gen = subprocess.run([sys.executable, str(GENERATOR), "--check", "--base", args.base],
                             cwd=ROOT, capture_output=True, text=True, timeout=300)
        print("  Segment lessons due for regeneration:")
        for line in gen.stdout.strip().splitlines():
            print("    " + line)
    except (OSError, subprocess.TimeoutExpired) as e:
        print("  generator --check did not run: %s" % e)

    # 4 · Drill pool size
    print("\n4 · Drill pool size")
    lc = lq = rc = 0
    for l in lesson_order:
        for s in l.get("sections") or []:
            if s.get("kind") == "flashcards":
                lc += len(s.get("cards") or [])
            elif s.get("kind") == "quiz":
                lq += len(s.get("items") or [])
            if l["id"].startswith("segment-") and s.get("id") == "the-players":
                rc += sum(1 for r in s.get("rows") or [] if isinstance(r, list) and len(r) > 1 and r[1] != "—")
    sf = ss = 0
    for path in glob.glob(str(DATA / "*.study.json")):
        g = read_json(path) or {}
        sf += len(g.get("flashcards") or [])
        for s in g.get("sections") or []:
            if isinstance(s, dict) and s.get("kind") == "flashcards":
                ss += len(s.get("cards") or [])
    inv_cap = ccc.js_number(src, "CL_DRILL_INV_CAP")
    acct_cap = ccc.js_number(src, "CL_DRILL_ACCOUNT_CAP")
    roster_cap = ccc.js_number(src, "CL_ROSTER_SESSION_CAP")
    print("  study pool  sf %d + ss %d = %d  (CL_DRILL_INV_CAP %s)" % (sf, ss, sf + ss, inv_cap))
    print("  lesson pool lc %d + lq %d = %d" % (lc, lq, lc + lq))
    print("  roster deck rc %d player rows across segment lessons  (%s)" % (
        rc, "K2 not built — no roster caps in Classroom.gs" if roster_cap is None else "CL_ROSTER_SESSION_CAP %s" % roster_cap))
    print("  total drillable today %d  (CL_DRILL_ACCOUNT_CAP %s)" % (sf + ss + lc + lq, acct_cap))
    if inv_cap is not None and sf + ss > inv_cap:
        strict("study pool %d exceeds CL_DRILL_INV_CAP %d — the cap silently truncates the pool" % (sf + ss, inv_cap))

    # 5 · Review dates
    print("\n5 · Review dates within 30 days or passed (today %s, horizon %s)" % (today, horizon))
    due = 0
    for l in lesson_order:
        rb = str(l.get("reviewBy") or "")
        if rb and rb <= horizon:
            due += 1
            print("  lesson  %-40s reviewBy %s%s" % (l["id"], rb, "  PASSED" if rb < today else ""))
    for mid, m in sorted(modules.items()):
        rb = m.get("reviewBy") or ""
        if rb and rb <= horizon:
            due += 1
            print("  module  %-40s reviewBy %s%s" % (mid, rb, "  PASSED" if rb < today else ""))
    print("  %d item(s) due for review" % due)

    print("\n" + "=" * 72)
    if strict_findings:
        print("STRICT findings (%d):" % len(strict_findings))
        for f in strict_findings:
            print("  " + f)
    else:
        print("no structural findings")
    return 1 if (args.strict and strict_findings) else 0


if __name__ == "__main__":
    sys.exit(main())

# Developed by: LightAISolutions
