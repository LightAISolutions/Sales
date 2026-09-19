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
  4. Drill pool size — sf · ss · lc · lq · rc against their caps, and each tier's
     deck (with and without the roster deck) against CL_DRILL_ACCOUNT_CAP
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


_CCC = None


def load_checker():
    """The content checker, loaded once — it is both this report's parser and,
    since C5 session 1, the single Python copy of the stamp → gate fold."""
    global _CCC
    if _CCC is None:
        spec = importlib.util.spec_from_file_location("ccc", ROOT / "scripts" / "check-classroom-content.py")
        _CCC = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(_CCC)
    return _CCC


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


def _registry_entries(text):
    """slug → entry for an undated registry blob, or None if it will not parse.
    Both undated registries are {schemaVersion, <name>: [{slug, …}]}."""
    try:
        obj = json.loads(text)
    except (ValueError, TypeError):
        return None
    if not isinstance(obj, dict):
        return None
    for key, val in obj.items():
        if key != "schemaVersion" and isinstance(val, list):
            out = {}
            for e in val:
                if isinstance(e, dict) and e.get("slug"):
                    out[e["slug"]] = json.dumps(e, sort_keys=True)
            return out
    return None


def registry_additive_only(base, rel, pin, cache):
    """True when every entry the registry carried at `pin` is still present today
    and unchanged — so the only movement since the pin is NEW entries.

    Why this is not staleness (rr69).  A lesson's pin on an undated registry is a
    claim about the entries it actually drew on: the {{term}} spans it renders
    resolve against those entries.  Adding vocabulary the lesson never used cannot
    change a word the lesson says, so a pure addition leaves every such claim true.
    Removing an entry or rewriting one CAN — a definition the lesson leaned on may
    now read differently — so either is real staleness and this returns False.

    Conservative by construction: any failure to prove additivity (a blob that
    will not parse, a commit that cannot be resolved, a shallow clone with no
    history at the pin) returns False and the pin stays stale.  The check can only
    ever remove a finding it has positively disproved.
    """
    key = (rel, pin)
    if key in cache:
        return cache[key]
    cache[key] = False
    now = _registry_entries((ROOT / rel).read_text(encoding="utf-8")) if (ROOT / rel).exists() else None
    if now is None:
        return False
    try:
        rev = subprocess.run(["git", "log", "-1", "--format=%H",
                              "--before=%sT23:59:59" % pin, base, "--", rel],
                             cwd=ROOT, capture_output=True, text=True, timeout=30)
        if rev.returncode != 0 or not rev.stdout.strip():
            return False
        blob = subprocess.run(["git", "show", "%s:%s" % (rev.stdout.strip(), rel)],
                              cwd=ROOT, capture_output=True, text=True, timeout=30)
        if blob.returncode != 0:
            return False
    except (OSError, subprocess.TimeoutExpired):
        return False
    then = _registry_entries(blob.stdout)
    if then is None:
        return False
    cache[key] = all(slug in now and now[slug] == body for slug, body in then.items())
    return cache[key]


# ── (rr71) A dossier that only MIGRATED is not a dossier that was REVISED ──
# Fields whose movement says nothing about any claim.
_META_FIELDS = {"schemaVersion", "lastUpdated", "profileVersion"}
# Fields whose values are citation pointers: one that grew back from a strict
# prefix of itself was a truncation being repaired, not a different source.
_URLISH = {"source", "url", "linkedin", "photo", "website"}
# Identity-keyed lists where a NEW entry cannot rewrite an existing claim — a
# new counterparty, regime, person, product line or spec block says nothing
# about the ones already there.  `recentDevelopments` and `strategyRead` are
# deliberately ABSENT: a development or a judgement appended later CAN
# supersede one a lesson taught, and clearing that is the false negative this
# whole layer exists to prevent.
_ADDITIVE_LISTS = {"sources": ("label",), "relationships": ("slug",),
                   "policyExposure": ("regime",), "decisionMakers": ("name",),
                   "productsAndServices": ("name",), "technicalSpecs": ("product",)}


def _empty(v):
    return v is None or v == "" or v == [] or v == {}


def _benign(then, now, field=""):
    """True when `then` → `now` cannot have changed a claim: identical, absent
    at the pin, or a citation string repaired from a strict prefix of itself."""
    if then == now:
        return True
    if _empty(then):
        return True                       # nothing was there to be drawn on
    if isinstance(then, str) and isinstance(now, str) and field in _URLISH:
        return now.startswith(then)       # a repaired truncation
    if isinstance(then, dict) and isinstance(now, dict):
        return all(_benign(v, now.get(k), k) for k, v in then.items())
    return False


def source_revision_only(base, ref, pin, cache):
    """True when a `profile:`/`study:` source has moved since `pin` by
    MIGRATION only — and False whenever that cannot be proved.

    Why this is not staleness (rr71).  The 2026-09-05/06 schema v6 → v7 wave
    moved dossiers' `lastUpdated` without changing a word any lesson had drawn
    on: truncated `source` URLs were repaired, the new `via` / `project`
    typings were populated, and `policyExposure` blocks were written where the
    field had been null.  A dossier's own `lastUpdated` cannot tell that apart
    from a revised figure, so every lesson pinned to one went stale on a
    migration — measured 2026-09-19 at v06.66r, where all eighteen reported
    stale pins turned out to be non-contradictions and (rr70) had to disprove
    them by hand.

    This reads the source as it stood at the pin and clears the move only when
    EVERY difference is provably claim-free: a metadata field, a field that was
    empty at the pin (nothing was there for the lesson to draw on), a citation
    repaired from a strict prefix of itself, or a new entry in one of
    `_ADDITIVE_LISTS`.  Everything else — a rewritten entry, a changed figure,
    a new `recentDevelopments` item, a new `strategyRead` judgement, a study
    guide's new `sections[]` — leaves the pin stale.

    Conservative by construction, like registry_additive_only(): a blob that
    will not parse, a commit that cannot be resolved, a shape not recognised,
    a shallow clone with no history at the pin — all return False.  The check
    can only ever remove a finding it has positively disproved.
    """
    key = (ref, pin)
    if key in cache:
        return cache[key]
    cache[key] = False
    # A pin git cannot parse makes `--before` fall back to "now", which would
    # resolve to today's blob and clear the pin against itself.  Refuse it.
    if not DATE_RE.match(pin or ""):
        return False
    prefix, _, ident = ref.partition(":")
    if prefix not in ("profile", "study") or not ident:
        return False
    rel = "live-site-pages/profiler-data/%s.%s.json" % (ident, prefix)
    now = read_json(ROOT / rel)
    if not isinstance(now, dict):
        return False
    try:
        rev = subprocess.run(["git", "log", "-1", "--format=%H",
                              "--before=%sT23:59:59" % pin, base, "--", rel],
                             cwd=ROOT, capture_output=True, text=True, timeout=30)
        if rev.returncode != 0 or not rev.stdout.strip():
            return False
        blob = subprocess.run(["git", "show", "%s:%s" % (rev.stdout.strip(), rel)],
                              cwd=ROOT, capture_output=True, text=True, timeout=30)
        if blob.returncode != 0:
            return False
        then = json.loads(blob.stdout)
    except (OSError, subprocess.TimeoutExpired, ValueError, TypeError):
        return False
    if not isinstance(then, dict):
        return False
    for field, tv in then.items():
        if field in _META_FIELDS:
            continue
        nv = now.get(field)
        if field in _ADDITIVE_LISTS and isinstance(tv, list):
            if not isinstance(nv, list):
                return False
            idf = _ADDITIVE_LISTS[field]
            live = {tuple(str(e.get(f, "")) for f in idf): e
                    for e in nv if isinstance(e, dict)}
            for e in tv:
                if not isinstance(e, dict):
                    return False
                match = live.get(tuple(str(e.get(f, "")) for f in idf))
                if match is None or not _benign(e, match):
                    return False
            continue
        if not _benign(tv, nv, field):
            return False
    cache[key] = True
    return True


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


def scenario_ledger():
    """The C5 ledger of CLASSROOM-CURRICULUM-PLAN.md §11 — the planned fourteen.

    Read from the plan rather than hard-coded here, so the coverage block below
    measures against what the ledger actually says and cannot drift from it.
    Returns [(n, id, seat, segment, mode, counterparty, session)], or [] if the
    section is absent (the block then reports the absence rather than a zero).
    """
    try:
        txt = (ROOT / "repository-information" / "CLASSROOM-CURRICULUM-PLAN.md").read_text(encoding="utf-8")
    except OSError:
        return []
    m = re.search(r"^## 11 .*?$(.*?)(?=^## |\Z)", txt, re.S | re.M)
    if not m:
        return []
    rows = []
    for line in m.group(1).splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")] if line.strip().startswith("|") else []
        if len(cells) < 8 or not cells[0].isdigit():
            continue
        unq = lambda s: s.strip("`* ")
        rows.append((int(cells[0]), unq(cells[1]), unq(cells[2]), unq(cells[3]),
                     unq(cells[4]), unq(cells[5]), unq(cells[6])))
    return rows


def gate_of(lesson, ref_kinds, caps, strictness):
    """The server's fold — imported from the content checker so there is exactly
    one Python copy of the derivation (C5 session 1; it used to be duplicated
    here and the two could have disagreed about what a stamp means)."""
    return load_checker().gate_of(lesson, ref_kinds, caps, strictness)


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


def js_role_caps(src):
    """role → [capability, …] from `var CL_ROLE_CAPS = {…};` — the access matrix
    the server folds a lesson's gate against (clCan_), read out of the .gs."""
    m = re.search(r"^var CL_ROLE_CAPS = \{(.*?)^\};", src, re.S | re.M)
    if not m:
        return {}
    return {role: re.findall(r"'([a-z]+)'", body)
            for role, body in re.findall(r"(\w+):\s*\[([^\]]*)\]", m.group(1))}


def guidance_drill_items(src):
    """(gc, gq), or None when the registry is not found: the guidance items
    clDrillGuidanceItems_ enumerates — every
    registered guidanceDoc<Name>_() module's sections of kind `flashcards`
    (cards with a `q`) and `quiz` (items with a `q`), under the same id rule the
    server applies (a module or section id CL_DRILL_SECTION_ID_RE would reject
    never enters the pool). The same walk, so the count is the server's."""
    ccc = load_checker()
    # The registry body carries comment lines between its brace and `return [`,
    # so the match runs from the function head to the list's closing bracket and
    # the comment lines are dropped before the names are read. A registry that
    # cannot be found is reported as None, never as an empty walk: a zero here
    # would print a contributor deck that equals no real deck (rr64).
    m = re.search(r"^function guidanceDocs_\(\) \{(.*?)\];", src, re.S | re.M)
    if not m:
        return None
    body = "\n".join(ln for ln in m.group(1).splitlines() if not ln.strip().startswith("//"))
    registered = set(re.findall(r"(guidanceDoc[A-Z]\w*_)\(\)", body))
    id_ok = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")
    gc = gq = 0
    for fn, doc in ccc.parse_literals(src, "guidanceDoc").items():
        if fn not in registered or not id_ok.match(str(doc.get("id") or "")):
            continue
        for s in doc.get("sections") or []:
            if not isinstance(s, dict) or not id_ok.match(str(s.get("id") or "")):
                continue
            if s.get("kind") == "flashcards":
                gc += sum(1 for c in s.get("cards") or [] if isinstance(c, dict) and c.get("q"))
            elif s.get("kind") == "quiz":
                gq += sum(1 for it in s.get("items") or [] if isinstance(it, dict) and it.get("q"))
    return gc, gq


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
    add_cache, additive = {}, []
    mig_cache, migrated = {}, []
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
                # (rr69) An undated registry that has only GAINED entries since
                # the pin cannot have invalidated this lesson — see
                # registry_additive_only().  Reported below, not counted here.
                kind = ref.split(":")[0]
                if kind in UNDATED_LAYERS and registry_additive_only(
                        args.base, UNDATED_LAYERS[kind], pin, add_cache):
                    additive.append((l["id"], ref, pin, live))
                    continue
                # (rr71) A dated source whose every difference since the pin is
                # a schema migration — a repaired citation, a field that was
                # empty, a new entry in an additive list — has not moved a
                # claim either.  See source_revision_only().
                if kind in ("profile", "study") and source_revision_only(
                        args.base, ref, pin, mig_cache):
                    migrated.append((l["id"], ref, pin, live))
                    continue
                stale_n += 1
                print("  %-36s %-44s pin %s → live %s" % (l["id"], ref, pin, live))
    hand = [l for l in lesson_order if not l["id"].startswith("segment-")]
    print("  %d stale pin(s) across %d hand-authored lesson(s) — segment lessons are NOT "
          "counted here" % (stale_n, len(hand)))
    if additive:
        refs = sorted({a[1] for a in additive})
        print("  %d pin(s) on %d registry/registries moved by ADDITIONS ONLY — not stale, "
              "nothing to do (rr69): %s" % (len(additive), len(refs), ", ".join(refs)))
        print("     every entry these lessons pinned is still present and unchanged; "
              "the registry only gained new ones. Re-pinning them would assert a "
              "re-read that did not happen (G2).")
    if migrated:
        refs = sorted({m[1] for m in migrated})
        print("  %d pin(s) on %d dated source(s) moved by SCHEMA MIGRATION ONLY — not "
              "stale, nothing to do (rr71): %s" % (len(migrated), len(refs), ", ".join(refs)))
        print("     every claim these lessons pinned reads back identically; the source "
              "moved only by a repaired citation, a field that was empty at the pin, or "
              "a new entry that cannot rewrite an existing one. Re-pinning them would "
              "assert a re-read that did not happen (G2).")
    # (rr17): this total and the generator's due count below are DISJOINT
    # numbers four lines apart, and two consecutive briefs read them as one.
    # The label was already right; the adjacency misled. Both now carry a
    # denominator and the line between them says they do not add up.
    try:
        gen = subprocess.run([sys.executable, str(GENERATOR), "--check", "--base", args.base],
                             cwd=ROOT, capture_output=True, text=True, timeout=300)
        out = gen.stdout.strip()
        print("  Segment lessons due for regeneration (a SEPARATE count — the generated "
              "lessons, whose pins the line above excludes):")
        for line in out.splitlines():
            print("    " + line)
        m = re.search(r"(\d+)\s+segment\(s\),\s*(\d+)\s+due", out)
        if m:
            print("  %s of %s segment lesson(s) due for regeneration — not addable to the "
                  "%d stale pin(s) above" % (m.group(2), m.group(1), stale_n))
    except (OSError, subprocess.TimeoutExpired) as e:
        print("  generator --check did not run: %s" % e)

    # 4 · Drill pool size
    print("\n4 · Drill pool size")
    lc = lq = rc = 0
    scn_lq = 0
    for l in lesson_order:
        # C5 / design D7: clDrillLessonItems_ skips type: scenario, so a
        # scenario's three quiz beats are NOT drillable. Counting them here
        # would report a pool six items larger than the one the server serves —
        # the same class of defect as (rr17): a number that looks like the
        # drill pool and is not it.
        if l.get("type") == "scenario":
            for s in l.get("sections") or []:
                if s.get("kind") == "quiz":
                    scn_lq += len(s.get("items") or [])
            continue
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
    if scn_lq:
        print("  scenario beats %d quiz item(s) across %d scenario(s) — NOT drillable and "
              "not in the total below (design D7)"
              % (scn_lq, sum(1 for l in lesson_order if l.get("type") == "scenario")))
    print("  roster deck rc %d player rows across segment lessons  (%s)" % (
        rc, "K2 not built — no roster caps in Classroom.gs" if roster_cap is None else "CL_ROSTER_SESSION_CAP %s" % roster_cap))
    if inv_cap is not None and sf + ss > inv_cap:
        strict("study pool %d exceeds CL_DRILL_INV_CAP %d — the cap silently truncates the pool" % (sf + ss, inv_cap))
    # Each tier's DECK against CL_DRILL_ACCOUNT_CAP (v06.58r — (rr58), (rr61)).
    # The cap is tested against an account's WHOLE row set — both decks share
    # the tab and the check runs before the deck split, so a never-graded item's
    # first grade past it returns DRILL_FULL — and the only comparison a real
    # account can hit is its own deck: the lesson items its tier may read (the
    # clLessonVisible_ fold, gate_of above), the guidance items contributor+
    # holds, the public study items every tier holds, and the roster deck when
    # opted in. The composite this block printed before v06.58r (sf + ss + lc +
    # lq) equalled no tier's deck: it omitted the guidance items every
    # contributor+ deck carries and the roster cards the cap counts, and read
    # UNDER the cap while the contributor deck was OVER it (rr17, rr58).
    gitems = guidance_drill_items(src)
    if gitems is None:
        print("  guidance items: guidanceDocs_() registry NOT found — guidance items are not counted below")
    gc, gq = gitems or (0, 0)
    role_caps = js_role_caps(src)
    tier_lesson = {}
    for l in lesson_order:
        if l.get("type") == "scenario":
            continue
        g = gate_of(l, ref_kinds, caps, strictness)
        n_items = sum(len(s.get("cards") or []) if s.get("kind") == "flashcards"
                      else len(s.get("items") or []) if s.get("kind") == "quiz" else 0
                      for s in l.get("sections") or [])
        for role, rcaps in role_caps.items():
            if g in rcaps:
                tier_lesson[role] = tier_lesson.get(role, 0) + n_items
    decks = []
    for role in [r for r in ("analyst", "contributor", "admin") if "tracks" in role_caps.get(r, [])]:
        guidance = gc + gq if "guidance" in role_caps[role] else 0
        lesson_n = tier_lesson.get(role, 0)
        parts = "lesson %d + %sstudy %d" % (lesson_n, ("guidance %d + " % guidance) if guidance else "", sf + ss)
        decks.append((role, lesson_n + guidance + sf + ss, parts))
    if len(decks) >= 2 and decks[-1][1:] == decks[-2][1:]:
        decks = decks[:-2] + [("contributor+", decks[-2][1], decks[-2][2])]
    print("  deck totals against CL_DRILL_ACCOUNT_CAP %s — the cap counts BOTH decks, one row set per account; "
          "a first grade past it returns DRILL_FULL" % acct_cap)
    for role, mech, parts in decks:
        print("    %-13s %4d mechanism deck (%s)  ·  %4d with the roster deck" % (role, mech, parts, mech + rc))
        if acct_cap is not None:
            if mech > acct_cap:
                strict("%s mechanism deck %d exceeds CL_DRILL_ACCOUNT_CAP %d — the cap refuses the last %d first grades (DRILL_FULL)"
                       % (role, mech, acct_cap, mech - acct_cap))
            elif mech + rc > acct_cap:
                strict("%s deck %d with the roster deck exceeds CL_DRILL_ACCOUNT_CAP %d — an opted-in account is refused the last %d first grades (DRILL_FULL)"
                       % (role, mech + rc, acct_cap, mech + rc - acct_cap))

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

    # 6 · Rehearsal coverage (C5) — the ledger of CLASSROOM-CURRICULUM-PLAN.md
    # §11 against what clLessons_() actually registers, per seat and per buyer
    # segment. Scenarios are hand-authored, so section 3 above already covers
    # their dossier pins with no change; what it does NOT cover is the pin most
    # likely to move under them — the landscape module their stamp must carry,
    # which the quarterly guidance review revises on its own clock. That is the
    # "landscape moved under it" list, and it is the human-refresh trigger the
    # no-pipeline-authoring rule (design D6 / P13) relies on.
    print("\n6 · Rehearsal coverage (C5 — CLASSROOM-CURRICULUM-PLAN.md §11)")
    planned = scenario_ledger()
    built = [l for l in lesson_order if l.get("type") == "scenario"]
    by_lid = {l["id"]: l for l in built}
    if not planned:
        print("  §11's ledger could not be read — coverage is reported against the "
              "registry alone: %d scenario(s) registered" % len(built))
    else:
        seats = []
        for row in planned:
            if row[2] not in seats:
                seats.append(row[2])
        for seat in seats:
            rows = [r for r in planned if r[2] == seat]
            have = sum(1 for r in rows if r[1] in by_lid)
            print("  %-18s %d of %d" % (seat, have, len(rows)))
            segs = []
            for r in rows:
                if r[3] not in segs:
                    segs.append(r[3])
            for sid in segs:
                srows = [r for r in rows if r[3] == sid]
                modes = " · ".join("%s %s" % (r[4], "yes" if r[1] in by_lid else "—")
                                   for r in srows)
                print("    %-40s %s" % (sid, modes))
        print("  %d of %d scenario(s) registered" % (len(by_lid), len(planned)))
        stray = sorted(set(by_lid) - {r[1] for r in planned})
        for s in stray:
            print("  registered but not in §11's ledger: %s" % s)
    # The landscape each scenario is stamped on, pin vs live
    moved = 0
    for l in built:
        for i in (l.get("provenance") or {}).get("inputs") or []:
            ref, pin = str(i.get("ref", "")), str(i.get("date") or "")
            if not ref.startswith("guidance:landscape-"):
                continue
            live = modules.get(ref.split(":", 1)[1], {}).get("updated", "")
            if live and pin and live > pin:
                moved += 1
                print("  landscape moved under it: %-38s %s pin %s → live %s"
                      % (l["id"], ref.split(":", 1)[1], pin, live))
    print("  %d scenario(s) whose landscape has moved since the pin — each needs a "
          "developer session (the pipeline never revises a scenario)" % moved)

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
