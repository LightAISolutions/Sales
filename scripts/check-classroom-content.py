#!/usr/bin/env python3
"""Validator for the Classroom app's lessons, tracks, and provenance stamps.

Parses every clLesson<Name>_() / clTrack<Name>_() strict-JSON literal out of
googleAppsScripts/Classroom/Classroom.gs and validates both schemas — see
repository-information/CLASSROOM-SCHEMA.md (the single source of truth).
Stamps are checked against the prefix table read from the .gs itself
(CL_PROVENANCE_REF_KINDS / CL_PROVENANCE_STRICTNESS), so this script cannot
drift from the code it validates. It then loads the PROJECT region into Node
and asserts the stamp → gate truth table (clStampKinds_ → clGateForProvenance_
→ clLessonVisible_ per tier, plus per-tier index filtering) against fixtures.

Run after any lesson, track, or stamp write; a write without a clean pass is
incomplete (sibling rule to check-profiler-study.py / check-profiler-reports.py).

Usage:  python3 scripts/check-classroom-content.py
Exit:   0 clean (warnings allowed), 1 on any error.
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GS = ROOT / "googleAppsScripts" / "Classroom" / "Classroom.gs"

SECTION_KINDS = {"prose", "callout", "table", "proscons", "timeline", "bars",
                 "flashcards", "quiz", "ledger"}
LANES = {"Technology Foundations", "The AI Data-Center Wave", "Market Access & Bankability"}
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")            # CL_ID_RE
REF_RE = re.compile(r"^([a-z]+):([A-Za-z0-9][A-Za-z0-9._-]{0,127})$")  # CL_REF_RE
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
CITE_TOKEN = re.compile(r"\[c:[^\]]+\]")

errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def read_gs():
    try:
        return GS.read_text(encoding="utf-8")
    except OSError as e:
        err("cannot read %s — %s" % (GS, e))
        return ""


def js_map(src, name):
    """Read a flat {'k': 'v', ...} object literal (string values) out of the .gs."""
    m = re.search(r"^var %s = \{(.*?)\};" % re.escape(name), src, re.S | re.M)
    if not m:
        err("%s: `var %s = {…}` not found" % (GS.name, name))
        return {}
    return dict(re.findall(r"'([a-z]+)':\s*'([a-z]+)'", m.group(1)))


def js_list(src, name):
    m = re.search(r"^var %s = \[(.*?)\];" % re.escape(name), src, re.M)
    if not m:
        err("%s: `var %s = […]` not found" % (GS.name, name))
        return []
    return re.findall(r"'([a-z]+)'", m.group(1))


def js_number(src, name):
    m = re.search(r"^var %s = (\d+);" % re.escape(name), src, re.M)
    return int(m.group(1)) if m else None


def literal_after_return(chunk):
    """Brace-match the object literal following the first `return {` in chunk."""
    start = chunk.find("return {")
    if start < 0:
        return None
    i = start + len("return ")
    depth, in_str, esc = 0, False, False
    for j in range(i, len(chunk)):
        c = chunk[j]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
            continue
        if c == '"':
            in_str = True
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return chunk[i:j + 1]
    return None


def parse_literals(src, prefix):
    """{function name: parsed JSON} for every `function <prefix><Name>_() {`."""
    out = {}
    for m in re.finditer(r"^function (%s[A-Z]\w*_)\(\) \{" % prefix, src, re.M):
        name = m.group(1)
        lit = literal_after_return(src[m.end():])
        if lit is None:
            err("%s(): no `return {…}` object literal found" % name)
            continue
        try:
            out[name] = json.loads(lit)
        except ValueError as e:
            err("%s(): literal is not strict JSON — %s" % (name, e))
    return out


def registered(src, registry):
    """Function names listed in `function <registry>() { return [ ... ]; }`."""
    m = re.search(r"^function %s\(\) \{\s*return\s*\[(.*?)\]" % re.escape(registry), src, re.S | re.M)
    if not m:
        err("%s(): registry function not found" % registry)
        return []
    return re.findall(r"(cl(?:Lesson|Track)[A-Z]\w*_)\(\)", m.group(1))

def check_stamp(lesson, tag, ref_kinds, strictness):
    prov = lesson.get("provenance")
    inputs = prov.get("inputs") if isinstance(prov, dict) else None
    if not (isinstance(inputs, list) and inputs):
        err("%s: provenance.inputs[] must be a non-empty array" % tag)
        return
    for i, inp in enumerate(inputs):
        where = "%s: provenance.inputs[%d]" % (tag, i)
        if not isinstance(inp, dict):
            err("%s must be an object" % where); continue
        ref, kind = inp.get("ref"), inp.get("kind")
        m = REF_RE.match(ref) if isinstance(ref, str) else None
        if not m:
            err("%s: ref %r does not match <prefix>:<id>" % (where, ref)); continue
        expected = ref_kinds.get(m.group(1))
        if not expected:
            err("%s: unknown ref prefix %r (no 'note:' by design — notes never become content)"
                % (where, m.group(1)))
        elif kind != expected:
            err("%s: kind %r but prefix %r carries %r — the stamp must match, never gate down"
                % (where, kind, m.group(1), expected))
        elif expected not in strictness:
            err("%s: kind %r is not in CL_PROVENANCE_STRICTNESS" % (where, expected))
        d = inp.get("date")
        if d is None:
            warn("%s: no date pin — freshness deltas cannot detect drift for this input" % where)
        elif not (isinstance(d, str) and DATE_RE.match(d)):
            err("%s: date must be YYYY-MM-DD" % where)


def check_sections(secs, tag):
    if not (isinstance(secs, list) and secs):
        err("%s: sections[] must be a non-empty array" % tag)
        return
    seen = set()
    for i, sec in enumerate(secs):
        where = "%s: sections[%d]" % (tag, i)
        if not isinstance(sec, dict):
            err("%s must be an object" % where); continue
        sid = sec.get("id")
        if not (isinstance(sid, str) and ID_RE.match(sid)):
            err("%s: id %r fails the id rules" % (where, sid))
        elif sid in seen:
            err("%s: duplicate section id %r" % (where, sid))
        seen.add(sid)
        if sec.get("kind") not in SECTION_KINDS:
            err("%s: kind %r not in %s" % (where, sec.get("kind"), sorted(SECTION_KINDS)))
        if not isinstance(sec.get("title"), str) or not sec.get("title").strip():
            err("%s: title required" % where)
        for text in strings_in(sec):
            if CITE_TOKEN.search(text):
                err("%s: [c:id] citation tokens are not allowed — the stamp is the sourcing" % where)
                break


def strings_in(node):
    if isinstance(node, str):
        yield node
    elif isinstance(node, list):
        for x in node:
            yield from strings_in(x)
    elif isinstance(node, dict):
        for k, v in node.items():
            if k in ("id", "kind"):
                continue
            yield from strings_in(v)


def check_lesson(lesson, tag, ref_kinds, strictness, schema_ver):
    for f in ("schemaVersion", "id", "title", "short", "group", "updated", "reviewBy",
              "provenance", "sections"):
        if f not in lesson:
            err("%s: missing required field %r" % (tag, f))
    if lesson.get("schemaVersion") != schema_ver:
        err("%s: schemaVersion must be %s" % (tag, schema_ver))
    if not (isinstance(lesson.get("id"), str) and ID_RE.match(lesson.get("id") or "")):
        err("%s: id fails the id rules" % tag)
    ltype = lesson.get("type", "module")
    if ltype not in ("module", "briefing"):
        err("%s: type must be module or briefing" % tag)
    if ltype == "briefing":
        if not (isinstance(lesson.get("edition"), str) and DATE_RE.match(lesson["edition"])):
            err("%s: briefing lessons require edition YYYY-MM-DD" % tag)
        if not str(lesson.get("id", "")).startswith("briefing-"):
            warn("%s: briefing ids conventionally start with 'briefing-'" % tag)
    elif "edition" in lesson:
        err("%s: edition is for briefings only" % tag)
    if isinstance(lesson.get("short"), str) and len(lesson["short"]) > 160:
        warn("%s: short exceeds 160 chars" % tag)
    if lesson.get("group") not in LANES:
        warn("%s: group %r is not an established lane %s" % (tag, lesson.get("group"), sorted(LANES)))
    for f in ("updated", "reviewBy"):
        v = lesson.get(f)
        if v is not None and not (isinstance(v, str) and DATE_RE.match(v)):
            err("%s: %s must be YYYY-MM-DD" % (tag, f))
    for i, r in enumerate(lesson.get("revisions") or []):
        if not (isinstance(r, dict) and DATE_RE.match(str(r.get("date", ""))) and r.get("note")):
            err("%s: revisions[%d] needs date + note" % (tag, i))
        elif not isinstance(r.get("changed", []), list):
            err("%s: revisions[%d].changed must be an array of section ids" % (tag, i))
    for i, g in enumerate(lesson.get("glossary") or []):
        if not (isinstance(g, dict) and g.get("t") and g.get("d")):
            err("%s: glossary[%d] needs t + d" % (tag, i))
    if len(lesson.get("tiles") or []) > 4:
        warn("%s: more than four tiles" % tag)
    check_stamp(lesson, tag, ref_kinds, strictness)
    check_sections(lesson.get("sections"), tag)


def check_track(track, tag, lessons_by_id, schema_ver):
    for f in ("schemaVersion", "id", "title", "short", "group", "updated", "lessons"):
        if f not in track:
            err("%s: missing required field %r" % (tag, f))
    if track.get("schemaVersion") != schema_ver:
        err("%s: schemaVersion must be %s" % (tag, schema_ver))
    if not (isinstance(track.get("id"), str) and ID_RE.match(track.get("id") or "")):
        err("%s: id fails the id rules" % tag)
    if track.get("group") not in LANES:
        warn("%s: group %r is not an established lane" % (tag, track.get("group")))
    v = track.get("updated")
    if v is not None and not (isinstance(v, str) and DATE_RE.match(v)):
        err("%s: updated must be YYYY-MM-DD" % tag)
    ids = track.get("lessons")
    if not (isinstance(ids, list) and ids):
        err("%s: lessons[] must be a non-empty array of lesson ids" % tag)
        return
    seen = set()
    for lid in ids:
        if lid in seen:
            err("%s: duplicate lesson id %r" % (tag, lid))
        seen.add(lid)
        l = lessons_by_id.get(lid)
        if l is None:
            err("%s: lesson %r is not registered" % (tag, lid))
        elif l.get("type", "module") != "module":
            err("%s: lesson %r is a briefing — tracks list modules only" % (tag, lid))
    for pid in track.get("prereqs") or []:
        if not isinstance(pid, str):
            err("%s: prereqs must be track ids" % tag)


def check_prereq_cycles(tracks_by_id):
    state = {}

    def visit(tid, path):
        if state.get(tid) == 1:
            err("prereq cycle: %s" % " → ".join(path + [tid])); return
        if state.get(tid) == 2 or tid not in tracks_by_id:
            return
        state[tid] = 1
        for pid in tracks_by_id[tid].get("prereqs") or []:
            if pid not in tracks_by_id:
                err("track %r: prereq %r is not registered" % (tid, pid))
            else:
                visit(pid, path + [tid])
        state[tid] = 2

    for tid in tracks_by_id:
        visit(tid, [])

# ── Gate truth table ─────────────────────────────────────────────────────────
# The PROJECT region between the first `// PROJECT START` and `// PROJECT END`
# is pure logic (no Apps Script services) once auditLog is stubbed, so Node can
# run it as-is. Fixtures cover every fold outcome and every fail-closed path.

def sess(role, admin=False):
    return {"role": role, "permissions": ["admin"] if admin else []}


FIXTURES = {
    "public-only": {"provenance": {"inputs": [
        {"kind": "public", "ref": "profile:sungrow"}, {"kind": "public", "ref": "study:sungrow"},
        {"kind": "public", "ref": "graph:profiler-graph"}]}},
    "public-plus-guidance": {"provenance": {"inputs": [
        {"kind": "public", "ref": "profile:sungrow"},
        {"kind": "guidance", "ref": "guidance:bess-tech-fundamentals-2026-08"}]}},
    "corpus": {"provenance": {"inputs": [{"kind": "briefing", "ref": "corpus:abc123"}]}},
    "guidance-plus-briefing": {"provenance": {"inputs": [
        {"kind": "guidance", "ref": "guidance:x"}, {"kind": "briefing", "ref": "briefing:briefing-2026-09-01"}]}},
    "public-plus-report": {"provenance": {"inputs": [
        {"kind": "public", "ref": "concepts:profiler-concepts"},
        {"kind": "report", "ref": "report:bess-suppliers--competitive--2026-08-30"}]}},
    "note-ref": {"provenance": {"inputs": [
        {"kind": "public", "ref": "profile:sungrow"}, {"kind": "public", "ref": "note:2026-08-01-1"}]}},
    "kind-prefix-mismatch": {"provenance": {"inputs": [{"kind": "public", "ref": "report:some-report"}]}},
    "kind-upgraded-mismatch": {"provenance": {"inputs": [{"kind": "report", "ref": "profile:sungrow"}]}},
    "unknown-kind": {"provenance": {"inputs": [{"kind": "secret", "ref": "profile:sungrow"}]}},
    "empty-inputs": {"provenance": {"inputs": []}},
    "missing-provenance": {"id": "x"},
    "inputs-not-array": {"provenance": {"inputs": {"kind": "public", "ref": "profile:sungrow"}}},
    "bad-ref-shape": {"provenance": {"inputs": [{"kind": "public", "ref": "profile"}]}},
}
EXPECTED_GATE = {
    "public-only": "tracks", "public-plus-guidance": "guidance", "corpus": "briefing",
    "guidance-plus-briefing": "briefing", "public-plus-report": "reports",
    "note-ref": "", "kind-prefix-mismatch": "", "kind-upgraded-mismatch": "", "unknown-kind": "",
    "empty-inputs": "", "missing-provenance": "", "inputs-not-array": "", "bad-ref-shape": "",
}
TIERS = {"admin": sess("admin"), "admin-by-permission": sess("viewer", admin=True),
         "contributor": sess("contributor"), "analyst": sess("analyst"),
         "viewer": sess("viewer"), "unknown-role": sess("guest")}
# Which tiers may read each fold outcome.
READS = {"tracks": {"admin", "admin-by-permission", "contributor", "analyst"},
         "guidance": {"admin", "admin-by-permission", "contributor"},
         "briefing": {"admin", "admin-by-permission", "contributor"},
         "reports": {"admin", "admin-by-permission"},
         "": set()}

HARNESS = r"""
var __audit = [];
function auditLog(ev, user, result, details) { __audit.push({ result: result, details: details }); }
var RBAC_DEFAULT_ROLE = 'viewer';
%(region)s
var FX = %(fixtures)s, TIERS = %(tiers)s, out = { gate: {}, visible: {}, index: {} };
Object.keys(FX).forEach(function(k) {
  out.gate[k] = clLessonGate_(FX[k]);
  out.visible[k] = {};
  Object.keys(TIERS).forEach(function(t) { out.visible[k][t] = clLessonVisible_(TIERS[t], FX[k]); });
});
// Index filtering with a stand-in registry: later declarations override.
function clLessons_() { return [
  { id: 'l-pub', title: 'P', provenance: FX['public-only'].provenance, sections: [{id:'a'}] },
  { id: 'l-gd',  title: 'G', provenance: FX['public-plus-guidance'].provenance, sections: [] },
  { id: 'l-rep', title: 'R', provenance: FX['public-plus-report'].provenance, sections: [] },
  { id: 'l-bad', title: 'B', provenance: FX['note-ref'].provenance, sections: [] },
  { id: 'b-1', type: 'briefing', edition: '2026-09-01', title: 'W', provenance: FX['corpus'].provenance, sections: [] }
]; }
function clTracks_() { return [
  { id: 't-mixed', title: 'M', lessons: ['l-pub', 'l-gd', 'l-rep', 'l-bad', 'ghost'] },
  { id: 't-admin', title: 'A', lessons: ['l-rep'] }
]; }
Object.keys(TIERS).forEach(function(t) {
  var ix = { tracks: clTrackIndexFor_(TIERS[t]), lessons: clLessonIndexFor_(TIERS[t]) };
  out.index[t] = { tracks: ix.tracks.map(function(x) { return x.id + ':' + x.lessons.map(function(l){return l.id;}).join(',') + '/' + x.withheld; }),
                   lessons: ix.lessons.map(function(l) { return l.id; }),
                   cards: ix.lessons.map(function(l) { return Object.keys(l).sort().join(','); }) };
});
var forbidden = 0;
try { clRequireLesson_(TIERS['analyst'], clStampKinds_(FX['public-plus-guidance']), 't'); } catch (e) { forbidden += /CLASSROOM_FORBIDDEN/.test(String(e.message)) ? 1 : 0; }
try { clRequireLesson_(TIERS['admin'], clStampKinds_(FX['note-ref']), 't'); } catch (e) { forbidden += /CLASSROOM_FORBIDDEN/.test(String(e.message)) ? 1 : 0; }
try { clRequire_(TIERS['viewer'], 'tracks', 't'); } catch (e) { forbidden += /CLASSROOM_FORBIDDEN/.test(String(e.message)) ? 1 : 0; }
out.forbidden = forbidden; out.audited = __audit.map(function(a) { return a.result; });
process.stdout.write(JSON.stringify(out));
"""

EXPECTED_INDEX = {
    "admin":               {"tracks": ["t-mixed:l-pub,l-gd,l-rep/2", "t-admin:l-rep/0"], "lessons": ["l-pub", "l-gd", "l-rep", "b-1"]},
    "admin-by-permission": {"tracks": ["t-mixed:l-pub,l-gd,l-rep/2", "t-admin:l-rep/0"], "lessons": ["l-pub", "l-gd", "l-rep", "b-1"]},
    "contributor":         {"tracks": ["t-mixed:l-pub,l-gd/3"], "lessons": ["l-pub", "l-gd", "b-1"]},
    "analyst":             {"tracks": ["t-mixed:l-pub/4"], "lessons": ["l-pub"]},
    "viewer":              {"tracks": [], "lessons": []},
    "unknown-role":        {"tracks": [], "lessons": []},
}
CARD_KEYS = "edition,gate,group,id,kinds,reviewBy,revised,sections,short,title,type,updated"


def run_gate_truth_table(src):
    m = re.search(r"^// PROJECT START.*?\n(.*?)^// PROJECT END", src, re.S | re.M)
    if not m:
        err("gate test: PROJECT region not found in %s" % GS.name); return
    js = HARNESS % {"region": m.group(1), "fixtures": json.dumps(FIXTURES), "tiers": json.dumps(TIERS)}
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(js); path = f.name
    try:
        res = subprocess.run(["node", path], capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired) as e:
        err("gate test: node did not run — %s" % e); return
    if res.returncode != 0:
        err("gate test: node failed — %s" % res.stderr.strip()[:400]); return
    out = json.loads(res.stdout)
    for k, want in EXPECTED_GATE.items():
        got = out["gate"].get(k)
        if got != want:
            err("gate test: %s folded to %r, expected %r" % (k, got, want))
        for t in TIERS:
            exp = t in READS[want]
            if out["visible"][k].get(t) != exp:
                err("gate test: %s visible to %s = %r, expected %r" % (k, t, out["visible"][k].get(t), exp))
    for t, want in EXPECTED_INDEX.items():
        got = out["index"][t]
        if got["tracks"] != want["tracks"] or got["lessons"] != want["lessons"]:
            err("gate test: index for %s = %s, expected %s" % (t, {"tracks": got["tracks"], "lessons": got["lessons"]}, want))
        for keys in got["cards"]:
            if keys != CARD_KEYS:
                err("gate test: card keys for %s = %s (sections must never leak into a card)" % (t, keys))
    if out["forbidden"] != 3:
        err("gate test: expected 3 CLASSROOM_FORBIDDEN throws, got %s" % out["forbidden"])
    for want in ("classroom_capability_denied", "classroom_bad_provenance", "classroom_not_admitted"):
        if want not in out["audited"]:
            err("gate test: denial %r was not audit-logged" % want)
    return len(EXPECTED_GATE) * (1 + len(TIERS)) + len(EXPECTED_INDEX)

def main():
    src = read_gs()
    if not src:
        return finish(0, 0, 0)
    ref_kinds = js_map(src, "CL_PROVENANCE_REF_KINDS")
    strictness = js_list(src, "CL_PROVENANCE_STRICTNESS")
    caps = js_map(src, "CL_PROVENANCE_CAPS")
    for k in ref_kinds.values():
        if k not in strictness:
            err("CL_PROVENANCE_REF_KINDS carries kind %r that CL_PROVENANCE_STRICTNESS lacks" % k)
    for k in strictness:
        if k not in caps:
            err("CL_PROVENANCE_STRICTNESS kind %r has no CL_PROVENANCE_CAPS entry" % k)
    if "note" in ref_kinds or "note" in caps:
        err("a 'note' provenance exists — field notes never become content")
    lesson_ver = js_number(src, "CL_LESSON_SCHEMA_VERSION")
    track_ver = js_number(src, "CL_TRACK_SCHEMA_VERSION")
    if lesson_ver is None or track_ver is None:
        err("schema version constants not found")

    lessons = parse_literals(src, "clLesson")
    tracks = parse_literals(src, "clTrack")
    reg_l = registered(src, "clLessons_")
    reg_t = registered(src, "clTracks_")
    for fn in lessons:
        if fn not in reg_l:
            err("%s() is defined but not registered in clLessons_()" % fn)
    for fn in reg_l:
        if fn not in lessons:
            err("clLessons_() registers %s() which is not defined" % fn)
    for fn in tracks:
        if fn not in reg_t:
            err("%s() is defined but not registered in clTracks_()" % fn)
    for fn in reg_t:
        if fn not in tracks:
            err("clTracks_() registers %s() which is not defined" % fn)

    lessons_by_id, tracks_by_id = {}, {}
    for fn, l in lessons.items():
        tag = "%s()" % fn
        check_lesson(l, tag, ref_kinds, strictness, lesson_ver)
        lid = l.get("id")
        if lid in lessons_by_id:
            err("%s: duplicate lesson id %r" % (tag, lid))
        lessons_by_id[lid] = l
    for fn, t in tracks.items():
        tag = "%s()" % fn
        check_track(t, tag, lessons_by_id, track_ver)
        tid = t.get("id")
        if tid in tracks_by_id:
            err("%s: duplicate track id %r" % (tag, tid))
        tracks_by_id[tid] = t
    check_prereq_cycles(tracks_by_id)
    cases = run_gate_truth_table(src) or 0
    return finish(len(lessons), len(tracks), cases)


def finish(n_lessons, n_tracks, cases):
    for w in warnings:
        print("WARN  %s" % w)
    for e in errors:
        print("ERROR %s" % e)
    print("check-classroom-content: %d lesson(s), %d track(s), %d gate case(s) — %d error(s), %d warning(s)"
          % (n_lessons, n_tracks, cases, len(errors), len(warnings)))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

# Developed by: LightAISolutions
