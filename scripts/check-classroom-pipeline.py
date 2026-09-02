#!/usr/bin/env python3
"""Diff-aware validator for an unattended Classroom pipeline commit.

`check-classroom-content.py` validates a **state** — schemas, ids, stamps, the
stamp → gate truth table. This is its sibling: it validates a **change**, and
it is the judge a C2 pipeline run is held to. The contract it enforces is
`repository-information/CLASSROOM-COMMITTER-CONTRACT.md`; §7 of that document
is the assertion list below, and every assertion carries the rule it comes from.

    P1   changed paths are a subset of the write set (§3)
    P2   the Classroom.gs diff lies inside the content fence, plus VERSION (§3.1)
    P3   the gate surface is unchanged and matches the ledger's digest (§4.2 §5.1)
    P4   the stamp vocabulary is byte-identical, and carries no `note` (§4.3)
    P5   ids survive; registries and track membership are append-only (§4.4 G12)
    P6   every surviving lesson's derived gate is unchanged (G6)
    P7   pins are monotone, `updated` moves, exactly one revision appended (G1 G4 G5 G13)
    P8   `changed[]` names exactly the sections that differ (G3 G4)
    P9   a new briefing's edition, id and watermark agree (G9 G10)
    P10  blast-radius caps (§5.3 step 6)
    P11  the public GAS changelog names nothing gated (§3.2)
    P12  VERSION and Classroomgs.version.txt moved together by one step (#1)

Three guarantees cannot be checked from a diff and stay the run's own
obligation: G2 (a pin was observed on a document fetched this run), G7 (every
ref resolved), and the read-phase honesty of §5.2.

Usage
    python3 scripts/check-classroom-pipeline.py [--base origin/main] [--today YYYY-MM-DD]
    python3 scripts/check-classroom-pipeline.py --selftest

`--selftest` runs the fixtures: one positive (a well-formed pipeline commit,
which must produce no finding) and one negative per assertion, in which the
forbidden mutation is present and this checker must report that assertion.
The committer never edits this file or its fixtures (contract §2, §4.5).

Exit: 0 clean, 1 on any finding (or any failed fixture under --selftest).
"""
import argparse
import copy
import datetime
import difflib
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GS_PATH = "googleAppsScripts/Classroom/Classroom.gs"
VER_PATH = "live-site-pages/gs-versions/Classroomgs.version.txt"
GASLOG_PATH = "live-site-pages/gs-changelogs/Classroomgs.changelog.md"
LEDGER_PATH = "repository-information/classroom-pipeline-ledger.json"

# Contract §3 — closed and exhaustive. A path not here is forbidden even if a
# checklist item seems to want it; that is the point of the list.
WRITE_SET = frozenset([
    GS_PATH,
    VER_PATH,
    GASLOG_PATH,
    "live-site-pages/gs-changelogs/Classroomgs.changelog-archive.md",
    "repository-information/CHANGELOG.md",
    "repository-information/CHANGELOG-archive.md",
    "repository-information/repository.version.txt",
    "README.md",
    LEDGER_PATH,
])

# Contract §4.2 — the gate surface. Frozen for the committer, digested so that
# a change a run did not see acknowledged stops the next run rather than
# silently changing what a stamp means.
GATE_SYMBOLS = [
    # access matrix
    "CL_ROLE_CAPS", "clRoleOf_", "clAdmitted_", "clCan_", "clRequire_",
    # provenance fold
    "CL_PROVENANCE_CAPS", "CL_PROVENANCE_STRICTNESS", "clGateForProvenance_",
    "clRequireLesson_",
    # stamp reader
    "CL_PROVENANCE_REF_KINDS", "CL_ID_RE", "CL_REF_RE", "clStampKinds_",
    "clLessonGate_", "clLessonVisible_",
    # per-tier views
    "clLessonCard_", "clLessonIndexFor_", "clTrackFor_", "clTrackIndexFor_",
    "clLesson_", "clTrack_",
    # progress and study-next
    "CL_PROGRESS_PROP_PREFIX", "clProgressAcct_", "clProgressValid_",
    "clProgressRaw_", "clProgressVisible_", "clProgressRead_",
    "clProgressWrite_", "clStudyNext_",
    # transport and schema versions
    "handleClassroomOp_", "CL_LESSON_SCHEMA_VERSION", "CL_TRACK_SCHEMA_VERSION",
]

# Contract §4.3 — byte-identical, not merely equivalent.
STAMP_VOCAB = ["CL_PROVENANCE_REF_KINDS", "CL_PROVENANCE_STRICTNESS",
               "CL_PROVENANCE_CAPS"]

FENCE_START = "// CONTENT START"
FENCE_END = "// CONTENT END"
VERSION_RE = re.compile(r'^var VERSION = "(v\d\d\.\d\dg)";\s*$')
REF_RE = re.compile(r"^([a-z]+):([A-Za-z0-9][A-Za-z0-9._-]{0,127})$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
CAPS_OPEN = "tracks"     # the capability every admitted tier holds


# ── Findings ──────────────────────────────────────────────────────────────
# Every finding carries the assertion that produced it, so a run can report
# "Blocked by: <the single failing gate, verbatim>" (contract §5.4) and so the
# fixtures can assert that the *intended* assertion fired.

FINDINGS = []


def fail(code, msg):
    FINDINGS.append((code, msg))


# ── Snapshots ─────────────────────────────────────────────────────────────

class Snap(object):
    """One side of the comparison: the few files any assertion reads."""

    def __init__(self, gs="", ver="", gaslog="", ledger_text="", label=""):
        self.gs = gs
        self.ver = ver
        self.gaslog = gaslog
        self.ledger_text = ledger_text
        self.label = label
        self._lessons = None
        self._tracks = None

    @property
    def ledger(self):
        try:
            return json.loads(self.ledger_text) if self.ledger_text else None
        except ValueError:
            return None

    @property
    def lessons(self):
        """{lesson id: literal} — keyed by id, which is the permanent identity."""
        if self._lessons is None:
            self._lessons = by_id(parse_literals(self.gs, "clLesson"))
        return self._lessons

    @property
    def tracks(self):
        if self._tracks is None:
            self._tracks = by_id(parse_literals(self.gs, "clTrack"))
        return self._tracks

    def copy(self):
        return Snap(self.gs, self.ver, self.gaslog, self.ledger_text, self.label)


def git(args, cwd=ROOT):
    return subprocess.run(["git"] + args, cwd=str(cwd), capture_output=True,
                          text=True)


def git_show(rev, path):
    r = git(["show", "%s:%s" % (rev, path)])
    return r.stdout if r.returncode == 0 else ""


def read_worktree(path):
    f = ROOT / path
    try:
        return f.read_text(encoding="utf-8")
    except OSError:
        return ""


def load_base(rev):
    return Snap(git_show(rev, GS_PATH), git_show(rev, VER_PATH),
                git_show(rev, GASLOG_PATH), git_show(rev, LEDGER_PATH),
                label=rev)


def load_head():
    return Snap(read_worktree(GS_PATH), read_worktree(VER_PATH),
                read_worktree(GASLOG_PATH), read_worktree(LEDGER_PATH),
                label="worktree")


def changed_paths(rev):
    """Tracked changes against `rev`, plus untracked files — a new file the
    committer added is as much a write as an edit, and `git diff` alone
    would not see it."""
    out = set()
    r = git(["diff", "--name-only", rev])
    if r.returncode != 0:
        fail("P1", "cannot diff against %s — %s" % (rev, r.stderr.strip()[:200]))
        return out
    out.update(x for x in r.stdout.split("\n") if x.strip())
    r = git(["ls-files", "--others", "--exclude-standard"])
    out.update(x for x in r.stdout.split("\n") if x.strip())
    return out


# ── Parsing the .gs ───────────────────────────────────────────────────────
# Everything index-based below scans a *masked* copy of the source: same
# length, but comment bodies and string contents are blanked. That removes the
# whole class of bug where an apostrophe in a comment ("the account's") or a
# brace inside a string throws off brace matching, while slices still come
# from the original text so byte-identical comparisons stay byte-identical.

def mask(src):
    out = list(src)
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            j = n if j < 0 else j
            for k in range(i, j):
                out[k] = " "
            i = j
        elif c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            for k in range(i, j):
                out[k] = "\n" if src[k] == "\n" else " "
            i = j
        elif c in "'\"`":
            j, esc = i + 1, False
            while j < n:
                d = src[j]
                if esc:
                    esc = False
                elif d == "\\":
                    esc = True
                elif d == c:
                    break
                elif d == "\n" and c != "`":
                    break
                j += 1
            for k in range(i + 1, min(j, n)):
                out[k] = "\n" if src[k] == "\n" else "x"
            i = min(j, n - 1) + 1
        else:
            i += 1
    return "".join(out)


def match_brace(msrc, open_idx):
    depth = 0
    for j in range(open_idx, len(msrc)):
        if msrc[j] == "{":
            depth += 1
        elif msrc[j] == "}":
            depth -= 1
            if depth == 0:
                return j
    return None


def literal_after_return(src, msrc, at):
    """The strict-JSON object literal following the first `return {` at/after
    `at`. Returns (text, end_index) or (None, None)."""
    start = msrc.find("return {", at)
    if start < 0:
        return None, None
    i = start + len("return ")
    end = match_brace(msrc, i)
    if end is None:
        return None, None
    return src[i:end + 1], end


def parse_literals(src, prefix):
    msrc = mask(src)
    out = {}
    for m in re.finditer(r"^function (%s[A-Z]\w*_)\(\) \{" % prefix, msrc, re.M):
        lit, _ = literal_after_return(src, msrc, m.end())
        if lit is None:
            continue
        try:
            out[m.group(1)] = json.loads(lit)
        except ValueError:
            continue
    return out


def by_id(literals):
    out = {}
    for fn, obj in literals.items():
        if isinstance(obj, dict) and obj.get("id"):
            out[str(obj["id"])] = obj
    return out


def registry_order(src, registry):
    """The function names listed in clLessons_() / clTracks_(), in order."""
    msrc = mask(src)
    m = re.search(r"^function %s\(\) \{" % re.escape(registry), msrc, re.M)
    if not m:
        return None
    end = match_brace(msrc, msrc.index("{", m.end() - 1))
    if end is None:
        return None
    return re.findall(r"(cl(?:Lesson|Track)[A-Z]\w*_)\(\)", src[m.start():end])


def decl_text(src, name, msrc=None):
    """The full source text of `var NAME = …;` or `function NAME(…) {…}`.

    Statement end is found by depth on the masked copy, so a multi-line object
    literal, a regex literal, or a function body is captured whole. None when
    the symbol is absent — itself a finding at the call site.
    """
    msrc = mask(src) if msrc is None else msrc
    m = re.search(r"^function %s\(" % re.escape(name), msrc, re.M)
    if m:
        ob = msrc.find("{", m.end())
        end = match_brace(msrc, ob) if ob >= 0 else None
        return src[m.start():end + 1] if end is not None else None
    m = re.search(r"^var %s\s*=" % re.escape(name), msrc, re.M)
    if not m:
        return None
    depth = 0
    for i in range(m.end(), len(msrc)):
        c = msrc[i]
        if c in "{[(":
            depth += 1
        elif c in "}])":
            depth -= 1
        elif c == ";" and depth == 0:
            return src[m.start():i + 1]
    return None


# ── The gate surface: digest, and the gates it derives ────────────────────

def project_region(src):
    m = re.search(r"^// PROJECT START.*?\n(.*?)^// PROJECT END", src, re.S | re.M)
    return m.group(1) if m else None


def gate_digest(src):
    """sha256 of the §4.2 symbols, whitespace-normalised, in a fixed order.

    Comments are inside the digest deliberately: a change to the reasoning
    written next to the gate is exactly the kind of change a pipeline run
    should see acknowledged before it trusts what a stamp means. Refreshing
    `gateDigest` is one line in the same commit (see .claude/rules/classroom-app.md).
    """
    msrc = mask(src)
    parts, missing = [], []
    for name in GATE_SYMBOLS:
        t = decl_text(src, name, msrc)
        if t is None:
            missing.append(name)
            continue
        parts.append("%s\n%s" % (name, " ".join(t.split())))
    if missing:
        return None, missing
    h = hashlib.sha256("\n".join(parts).encode("utf-8")).hexdigest()
    return "sha256:" + h, []


HARNESS = r"""
var __audit = [];
function auditLog() {}
function dataAuditLog() {}
var RBAC_DEFAULT_ROLE = 'viewer';
var __props = {};
var PropertiesService = { getScriptProperties: function() { return {
  getProperty: function(k) { return Object.prototype.hasOwnProperty.call(__props, k) ? __props[k] : null; },
  setProperty: function(k, v) { __props[k] = String(v); },
  deleteProperty: function(k) { delete __props[k]; }
}; } };
var LockService = { getScriptLock: function() { return {
  waitLock: function() {}, releaseLock: function() {}
}; } };
%(region)s
var __out = {};
clLessons_().forEach(function(l) { __out[l.id] = clLessonGate_(l); });
console.log(JSON.stringify(__out));
"""

_GATE_CACHE = {}


def gates_for(src, label=""):
    """{lesson id: derived capability}, computed by running the snapshot's own
    PROJECT region in Node — the same technique the state checker's truth
    table uses, so the gate is never re-implemented in Python where it could
    disagree with the code that actually serves it."""
    region = project_region(src)
    if region is None:
        fail("P6", "PROJECT region not found in %s (%s)" % (GS_PATH, label))
        return None
    key = hashlib.sha256(region.encode("utf-8")).hexdigest()
    if key in _GATE_CACHE:
        return _GATE_CACHE[key]
    js = HARNESS % {"region": region}
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False,
                                     encoding="utf-8") as f:
        f.write(js)
        path = f.name
    try:
        res = subprocess.run(["node", path], capture_output=True, text=True,
                             timeout=60)
    except (OSError, subprocess.TimeoutExpired) as e:
        fail("P6", "node did not run (%s) — %s" % (label, e))
        return None
    finally:
        try:
            Path(path).unlink()
        except OSError:
            pass
    if res.returncode != 0:
        fail("P6", "node failed on the %s PROJECT region — %s"
             % (label or "loaded", res.stderr.strip()[:300]))
        return None
    try:
        out = json.loads(res.stdout)
    except ValueError:
        fail("P6", "node produced no gate map (%s)" % label)
        return None
    _GATE_CACHE[key] = out
    return out


# ── Small helpers ─────────────────────────────────────────────────────────

def ver_steps(v):
    m = re.match(r"^v(\d\d)\.(\d\d)g$", v or "")
    return int(m.group(1)) * 100 + int(m.group(2)) if m else None


def gs_version(src):
    for line in src.split("\n"):
        m = VERSION_RE.match(line)
        if m:
            return m.group(1)
    return None


def canon(obj):
    return json.dumps(obj, sort_keys=True, ensure_ascii=False)


def ws_canon(obj):
    """The object with every string's whitespace collapsed — so a reflow or a
    retyped space is not mistaken for a change of substance (G4)."""
    if isinstance(obj, str):
        return " ".join(obj.split())
    if isinstance(obj, list):
        return [ws_canon(x) for x in obj]
    if isinstance(obj, dict):
        return {k: ws_canon(v) for k, v in obj.items()}
    return obj


def sections_of(lesson):
    out = {}
    for s in lesson.get("sections") or []:
        if isinstance(s, dict) and s.get("id"):
            out[str(s["id"])] = s
    return out


def revisions_of(lesson):
    r = lesson.get("revisions")
    return r if isinstance(r, list) else []


def added_lines(base_text, head_text):
    """Only the lines head adds — what a public changelog check must read."""
    d = difflib.ndiff(base_text.split("\n"), head_text.split("\n"))
    return [ln[2:] for ln in d if ln.startswith("+ ")]


# ── P1 · P2 — the write set and the content fence ─────────────────────────

def p1_write_set(changed):
    for path in sorted(changed):
        if path not in WRITE_SET:
            fail("P1", "%s is outside the committer's write set (contract §3) — "
                       "a path not on the list is forbidden even when a checklist "
                       "item seems to want it" % path)


def fence_bounds(src, side):
    lines = src.split("\n")
    starts = [i for i, l in enumerate(lines) if l.startswith(FENCE_START)]
    ends = [i for i, l in enumerate(lines) if l.startswith(FENCE_END)]
    if len(starts) != 1 or len(ends) != 1 or starts[0] >= ends[0]:
        fail("P2", "content fence missing or malformed at %s — expected one "
                   "`%s` line before one `%s` line in %s"
             % (side, FENCE_START, FENCE_END, GS_PATH))
        return None
    return starts[0], ends[0]


def p2_fence(base, head, changed):
    if GS_PATH not in changed:
        return
    b, h = fence_bounds(base.gs, "base"), fence_bounds(head.gs, "head")
    if not b or not h:
        return
    bl, hl = base.gs.split("\n"), head.gs.split("\n")
    bver = [i for i, l in enumerate(bl) if VERSION_RE.match(l)]
    hver = [i for i, l in enumerate(hl) if VERSION_RE.match(l)]

    def ok(i, bounds, vers):
        return (bounds[0] < i < bounds[1]) or i in vers

    offenders = []
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, bl, hl).get_opcodes():
        if tag == "equal":
            continue
        for i in range(i1, i2):
            if not ok(i, b, bver):
                offenders.append(("base", i + 1, bl[i]))
        for j in range(j1, j2):
            if not ok(j, h, hver):
                offenders.append(("head", j + 1, hl[j]))
    for side, ln, text in offenders[:8]:
        fail("P2", "%s:%s:%d is outside the content fence and is not the "
                   "VERSION line — %s" % (GS_PATH, side, ln, text.strip()[:90]))
    if len(offenders) > 8:
        fail("P2", "%s: %d further lines outside the fence"
             % (GS_PATH, len(offenders) - 8))


# ── P3 · P4 — the gate surface and the stamp vocabulary ───────────────────

def p3_gate_digest(base, head):
    bd, bmissing = gate_digest(base.gs)
    hd, hmissing = gate_digest(head.gs)
    for name in hmissing:
        fail("P3", "gate-surface symbol %s is missing from head — the §4.2 "
                   "surface may not be removed or renamed" % name)
    if bd is None or hd is None:
        return
    if bd != hd:
        fail("P3", "the gate surface changed base → head (%s → %s) — the "
                   "derivation is frozen for a pipeline run (contract §4.2)"
             % (bd[:19], hd[:19]))
    for snap in (base, head):
        led = snap.ledger
        if led is None:
            fail("P3", "%s is missing or unparseable at %s — pre-flight cannot "
                       "confirm the ground has not moved" % (LEDGER_PATH, snap.label))
            continue
        got = str(led.get("gateDigest") or "")
        if got != hd:
            fail("P3", "ledger gateDigest at %s is %s but the gate surface "
                       "digests to %s — a developer session that changed the "
                       "gate must refresh it in the same commit"
                 % (snap.label, got[:19] or "(absent)", hd[:19]))


def p4_stamp_vocab(base, head):
    for name in STAMP_VOCAB:
        b, h = decl_text(base.gs, name), decl_text(head.gs, name)
        if h is None:
            fail("P4", "%s is missing from head — the stamp vocabulary may "
                       "not be removed" % name)
            continue
        if b is not None and b != h:
            fail("P4", "%s is not byte-identical base → head — a new prefix, "
                       "kind or rung is a design-gate decision (contract §4.3)"
                 % name)
        if re.search(r"\bnote\b", h):
            fail("P4", "%s mentions `note` — field notes never become a "
                       "provenance (contract §4.3)" % name)


# ── P5 · P6 — permanent identities and the derived gate ───────────────────

def p5_identities(base, head):
    for lid in sorted(base.lessons):
        if lid not in head.lessons:
            fail("P5", "lesson %r disappeared — lesson ids are permanent "
                       "(contract §4.4)" % lid)
            continue
        b, h = sections_of(base.lessons[lid]), sections_of(head.lessons[lid])
        for sid in sorted(b):
            if sid not in h:
                fail("P5", "%s: section %r was removed or renamed — "
                           "clProgressVisible_ would silently drop that tick "
                           "for every account (G12)" % (lid, sid))
    for tid in sorted(base.tracks):
        if tid not in head.tracks:
            fail("P5", "track %r disappeared — track ids are permanent" % tid)
            continue
        bl = [str(x) for x in (base.tracks[tid].get("lessons") or [])]
        hl = [str(x) for x in (head.tracks[tid].get("lessons") or [])]
        if hl[:len(bl)] != bl:
            fail("P5", "track %r: lessons[] is not append-only (%s → %s) — "
                       "a reorder moves every account's study-next pointer "
                       "without a tick changing" % (tid, bl, hl))
    for reg in ("clLessons_", "clTracks_"):
        b = registry_order(base.gs, reg)
        h = registry_order(head.gs, reg)
        if b is None or h is None:
            fail("P5", "%s(): registry not found in %s"
                 % (reg, "base" if b is None else "head"))
            continue
        if h[:len(b)] != b:
            fail("P5", "%s(): registration is not append-only — clStudyNext_ "
                       "walks registry order" % reg)


def p6_gate_invariance(base, head):
    bg = gates_for(base.gs, "base")
    hg = gates_for(head.gs, "head")
    if bg is None or hg is None:
        return
    for lid in sorted(set(bg) & set(hg)):
        if bg[lid] != hg[lid]:
            fail("P6", "lesson %r changed gate %r → %r — the gate of an "
                       "existing lesson never changes in a pipeline run, in "
                       "either direction (G6); material at a different gate "
                       "is a new lesson" % (lid, bg[lid], hg[lid]))


# ── P7 · P8 — pins, revisions, and what `changed[]` must name ─────────────

def touched(base_lesson, head_lesson):
    return canon(base_lesson) != canon(head_lesson)


def p7_pins_and_revisions(base, head):
    for lid in sorted(set(base.lessons) & set(head.lessons)):
        b, h = base.lessons[lid], head.lessons[lid]
        bins = {str(i.get("ref")): str(i.get("date") or "")
                for i in (b.get("provenance") or {}).get("inputs") or []}
        hins = {str(i.get("ref")): str(i.get("date") or "")
                for i in (h.get("provenance") or {}).get("inputs") or []}
        for ref, bd in sorted(bins.items()):
            if ref in hins and hins[ref] < bd:
                fail("P7", "%s: pin %s moved backwards %s → %s — a live date "
                           "older than the pin marks the source unknown and "
                           "freezes the lesson (G5)" % (lid, ref, bd, hins[ref]))
        for ref, hd in sorted(hins.items()):
            if not DATE_RE.match(hd):
                fail("P7", "%s: input %s has no YYYY-MM-DD pin" % (lid, ref))
            if not REF_RE.match(ref):
                fail("P7", "%s: input ref %r is malformed" % (lid, ref))

        brev, hrev = revisions_of(b), revisions_of(h)
        changed_here = touched(b, h)
        if not changed_here:
            if canon(brev) != canon(hrev):
                fail("P7", "%s: revisions[] changed on a lesson that did not"
                           % lid)
            continue

        b_no_up = {k: v for k, v in b.items() if k != "updated"}
        h_no_up = {k: v for k, v in h.items() if k != "updated"}
        if canon(b_no_up) != canon(h_no_up):
            if str(h.get("updated") or "") <= str(b.get("updated") or ""):
                fail("P7", "%s: content changed but `updated` did not advance "
                           "(%s → %s)" % (lid, b.get("updated"), h.get("updated")))
        if hrev[:len(brev)] != brev:
            fail("P7", "%s: revisions[] is not append-only" % lid)
        elif len(hrev) != len(brev) + 1:
            fail("P7", "%s: a revised lesson appends exactly one revisions[] "
                       "entry, found %d appended (G3)"
                 % (lid, len(hrev) - len(brev)))
        else:
            entry = hrev[-1] if isinstance(hrev[-1], dict) else {}
            ids = set(sections_of(h))
            for sid in entry.get("changed") or []:
                if str(sid) not in ids:
                    fail("P7", "%s: revisions[].changed[] names %r, which is "
                               "not one of the lesson's section ids" % (lid, sid))
            if not DATE_RE.match(str(entry.get("date") or "")):
                fail("P7", "%s: the appended revision has no YYYY-MM-DD date" % lid)
        rb, up = str(h.get("reviewBy") or ""), str(h.get("updated") or "")
        if rb and up and rb < up:
            fail("P7", "%s: reviewBy %s precedes updated %s — a review date "
                       "already in the past teaches nothing (G13)" % (lid, rb, up))


def p8_changed_names_what_moved(base, head):
    for lid in sorted(set(base.lessons) & set(head.lessons)):
        b, h = base.lessons[lid], head.lessons[lid]
        if not touched(b, h):
            continue
        if canon(ws_canon(b)) == canon(ws_canon(h)):
            fail("P8", "%s: the only difference is whitespace — the committer "
                       "never opens a lesson to polish it (G4)" % lid)
            continue
        bs, hs = sections_of(b), sections_of(h)
        differ = {sid for sid in set(bs) & set(hs)
                  if canon(bs[sid]) != canon(hs[sid])}
        hrev = revisions_of(h)
        named = set()
        if len(hrev) == len(revisions_of(b)) + 1 and isinstance(hrev[-1], dict):
            named = {str(x) for x in (hrev[-1].get("changed") or [])}
        for sid in sorted(differ - named):
            fail("P8", "%s: section %r differs but is not in "
                       "revisions[].changed[] — every account that completed "
                       "it must see the delta (G3, G12)" % (lid, sid))
        for sid in sorted(named - differ):
            fail("P8", "%s: revisions[].changed[] names %r, which is identical "
                       "base → head — changed[] lists meaning that moved, not "
                       "sections that were visited (G4)" % (lid, sid))


# ── P9 · P10 — the watermark and the blast radius ─────────────────────────

def briefings(snap):
    return {lid: l for lid, l in snap.lessons.items()
            if str(l.get("type") or "module") == "briefing"}


def p9_watermark(base, head, today):
    bled, hled = base.ledger or {}, head.ledger or {}
    b_cov = str(bled.get("coveredThrough") or "")
    h_cov = str(hled.get("coveredThrough") or "")
    new = sorted(set(briefings(head)) - set(base.lessons))

    if not new:
        if h_cov != b_cov:
            fail("P9", "coveredThrough moved %s → %s with no new briefing — "
                       "the watermark advances only to a new briefing's "
                       "edition (G9)" % (b_cov or "(absent)", h_cov or "(absent)"))
    if len(new) > 1:
        return          # P10 reports the cap; the checks below assume one
    for lid in new:
        ed = str(head.lessons[lid].get("edition") or "")
        if not DATE_RE.match(ed):
            fail("P9", "briefing %r has no YYYY-MM-DD `edition`" % lid)
            continue
        if not re.match(r"^briefing-%s(-\d+)?$" % re.escape(ed), lid):
            fail("P9", "briefing id %r does not name its edition — a briefing "
                       "is `briefing-<edition>` (G10, so a re-fire after a "
                       "lost push cannot double-author)" % lid)
        if b_cov and ed <= b_cov:
            fail("P9", "briefing edition %s is not later than the watermark "
                       "%s — the window is (coveredThrough, runDate] (G9)"
                 % (ed, b_cov))
        if ed > today:
            fail("P9", "briefing edition %s is later than the run date %s (G9)"
                 % (ed, today))
        if h_cov != ed:
            fail("P9", "coveredThrough at head is %s but the new briefing's "
                       "edition is %s — the ledger and the newest briefing "
                       "must agree (§6.3)" % (h_cov or "(absent)", ed))

    all_b = briefings(head)
    if all_b and h_cov:
        newest = max(str(l.get("edition") or "") for l in all_b.values())
        if newest and newest != h_cov:
            fail("P9", "coveredThrough %s is not the newest registered "
                       "briefing's edition %s (§6.3)" % (h_cov, newest))


def p10_blast_radius(base, head):
    new_lessons = sorted(set(head.lessons) - set(base.lessons))
    new_brief = [l for l in new_lessons
                 if str(head.lessons[l].get("type") or "module") == "briefing"]
    new_mod = [l for l in new_lessons if l not in new_brief]
    new_tracks = sorted(set(head.tracks) - set(base.tracks))
    revised = [lid for lid in sorted(set(base.lessons) & set(head.lessons))
               if touched(base.lessons[lid], head.lessons[lid])]
    caps = [("new briefing", new_brief, 1), ("new module", new_mod, 1),
            ("revised lesson", revised, 3), ("new track", new_tracks, 1)]
    for label, got, cap in caps:
        if len(got) > cap:
            fail("P10", "%d %ss in one run, cap is %d (%s) — a bad run should "
                        "be a small run (§5.3 step 6)"
                 % (len(got), label, cap, ", ".join(got)))
    for lid in revised:
        appended = len(revisions_of(head.lessons[lid])) - \
            len(revisions_of(base.lessons[lid]))
        if appended > 1:
            fail("P10", "%s was revised %d times in one run — no lesson is "
                        "revised twice (§5.3 step 6)" % (lid, appended))


# ── P11 · P12 — the public changelog, and the version pair ────────────────

def p11_public_changelog(base, head, changed):
    if GASLOG_PATH not in changed:
        return
    added = "\n".join(added_lines(base.gaslog, head.gaslog))
    if not added.strip():
        return
    low = added.lower()
    gates = gates_for(head.gs, "head") or {}
    for lid, lesson in sorted(head.lessons.items()):
        if gates.get(lid) == CAPS_OPEN:
            continue
        title = str(lesson.get("title") or "").strip()
        if title and title.lower() in low:
            fail("P11", "the deployed GAS changelog names %r, the title of "
                        "%s, which is gated to %r — public entries stay "
                        "generic (§3.2, changelog-security)"
                 % (title, lid, gates.get(lid) or "deny"))
    for m in re.finditer(r"\b([a-z]+):([A-Za-z0-9][A-Za-z0-9._-]{2,127})\b", added):
        if m.group(1) in ("profile", "study", "project", "graph", "concepts",
                          "guidance", "corpus", "briefing", "report"):
            fail("P11", "the deployed GAS changelog names the source %r — a "
                        "public changelog never names a corpus ref (§3.2)"
                 % m.group(0))


def p12_version_pair(base, head, changed):
    if GS_PATH not in changed:
        return
    bv, hv = gs_version(base.gs), gs_version(head.gs)
    bs, hs = ver_steps(bv), ver_steps(hv)
    if hs is None:
        fail("P12", "no `var VERSION = \"vXX.XXg\";` at head")
        return
    if bs is None:
        fail("P12", "no `var VERSION = \"vXX.XXg\";` at base")
    elif hs != bs + 1:
        fail("P12", "VERSION moved %s → %s — [PC-GS-VERSION] #1 is exactly one "
                    "step of 0.01 per push" % (bv, hv))
    want = "|%s|" % hv
    if head.ver.strip() != want:
        fail("P12", "%s is %r but VERSION is %s — the version file and the "
                    "constant must move together"
             % (VER_PATH, head.ver.strip(), hv))


# ── The run ───────────────────────────────────────────────────────────────

def run_all(base, head, changed, today):
    p1_write_set(changed)
    p2_fence(base, head, changed)
    p3_gate_digest(base, head)
    p4_stamp_vocab(base, head)
    p5_identities(base, head)
    p6_gate_invariance(base, head)
    p7_pins_and_revisions(base, head)
    p8_changed_names_what_moved(base, head)
    p9_watermark(base, head, today)
    p10_blast_radius(base, head)
    p11_public_changelog(base, head, changed)
    p12_version_pair(base, head, changed)


# ── Fixtures ──────────────────────────────────────────────────────────────
# The positive fixture is a well-formed pipeline commit built from the repo's
# real base; each negative fixture is that same commit with exactly one
# forbidden mutation, so a fixture that fires proves the assertion caught the
# mutation and not some incidental breakage. Contract §7 requires one per
# assertion, and `--selftest` fails if any of P1…P12 is left without one.

def replace_literal(gs, fn, obj):
    """Swap the strict-JSON literal a clLesson*/clTrack* function returns."""
    msrc = mask(gs)
    m = re.search(r"^function %s\(\) \{" % re.escape(fn), msrc, re.M)
    if not m:
        raise AssertionError("fixture: %s not found" % fn)
    start = msrc.find("return {", m.end()) + len("return ")
    end = match_brace(msrc, start)
    return gs[:start] + json.dumps(obj, indent=1, ensure_ascii=False) + gs[end + 1:]


def get_literal(gs, fn):
    msrc = mask(gs)
    m = re.search(r"^function %s\(\) \{" % re.escape(fn), msrc, re.M)
    lit, _ = literal_after_return(gs, msrc, m.end())
    return json.loads(lit)


def bump_version(gs, steps=1):
    v = gs_version(gs)
    n = ver_steps(v) + steps
    nv = "v%02d.%02dg" % (n // 100, n % 100)
    return gs.replace('var VERSION = "%s";' % v, 'var VERSION = "%s";' % nv, 1), nv


LESSON_FN = "clLessonCellToContainer_"
GOOD_DATE = "2026-09-10"


def good_commit(base):
    """A legitimate revision: one section's meaning moves, `changed[]` names
    it, `updated` advances, one revisions[] entry is appended, the version
    pair steps once, and the public changelog stays generic."""
    head = base.copy()
    head.label = "fixture"
    lesson = get_literal(base.gs, LESSON_FN)
    sec = lesson["sections"][0]
    sec["ps"] = ["Revised: " + sec["ps"][0]] + list(sec["ps"][1:])
    lesson["updated"] = GOOD_DATE
    lesson["revisions"] = (lesson.get("revisions") or []) + [{
        "date": GOOD_DATE,
        "note": "Re-pinned to the newer study guide; the opening claim moved.",
        "changed": [sec["id"]],
    }]
    gs = replace_literal(base.gs, LESSON_FN, lesson)
    gs, nv = bump_version(gs)
    head.gs = gs
    head.ver = "|%s|" % nv
    head.gaslog = base.gaslog + \
        "\n## [%s] — %s — v99.99r\n\n### Changed\n\n- Curriculum updated.\n" \
        % (nv, GOOD_DATE)
    changed = {GS_PATH, VER_PATH, GASLOG_PATH}
    return head, changed


def mutate_p1(base, head, changed):
    changed.add("live-site-pages/Classroom.html")   # the renderer is not the committer's


def mutate_p2(base, head, changed):
    head.gs = head.gs.replace(
        "function clLessonCard_(lesson) {",
        "function clLessonCard_(lesson) { /* pipeline touched the view layer */", 1)


def mutate_p3(base, head, changed):
    head.gs = head.gs.replace(
        "function clAdmitted_(sess) { return clRoleOf_(sess) !== 'viewer'; }",
        "function clAdmitted_(sess) { return true; }", 1)


def mutate_p4(base, head, changed):
    head.gs = head.gs.replace(
        "var CL_PROVENANCE_REF_KINDS = {",
        "var CL_PROVENANCE_REF_KINDS = {\n  'note':     'public',    // field notes", 1)


def mutate_p5(base, head, changed):
    lesson = get_literal(head.gs, LESSON_FN)
    lesson["sections"] = lesson["sections"][:-1]     # drops a section id
    head.gs = replace_literal(head.gs, LESSON_FN, lesson)


def mutate_p6(base, head, changed):
    lesson = get_literal(head.gs, LESSON_FN)
    lesson["provenance"]["inputs"].append(
        {"kind": "report", "ref": "report:aidc-market-2026-08", "date": GOOD_DATE})
    head.gs = replace_literal(head.gs, LESSON_FN, lesson)


def mutate_p7(base, head, changed):
    lesson = get_literal(head.gs, LESSON_FN)
    lesson["provenance"]["inputs"][0]["date"] = "2026-01-01"   # pin moves backwards
    head.gs = replace_literal(head.gs, LESSON_FN, lesson)


def mutate_p8(base, head, changed):
    lesson = get_literal(head.gs, LESSON_FN)
    s = lesson["sections"][1]
    s["ps"] = ["Quietly rewritten without being named."] + list(s.get("ps") or [])[1:]
    head.gs = replace_literal(head.gs, LESSON_FN, lesson)


def mutate_p9(base, head, changed):
    """A briefing dated on or before the watermark, with the ledger left behind."""
    led = json.loads(head.ledger_text)
    stale = led.get("coveredThrough") or "2026-09-01"
    lesson = {
        "schemaVersion": 1, "id": "briefing-%s" % stale, "type": "briefing",
        "edition": stale, "title": "This week", "short": "A week.",
        "group": "Technology Foundations", "updated": stale, "reviewBy": "2027-01-01",
        "provenance": {"inputs": [{"kind": "public", "ref": "study:catl",
                                   "date": "2026-08-08"}]},
        "sections": [{"id": "s1", "title": "S", "kind": "prose", "ps": ["x"]}],
    }
    head.gs = head.gs.replace(
        "function clLessons_() {",
        "function clLessonWeekly_() {\n  return %s;\n}\nfunction clLessons_() {"
        % json.dumps(lesson, indent=1, ensure_ascii=False), 1)
    head.gs = head.gs.replace("clLessonHeatConstraint_()];",
                              "clLessonHeatConstraint_(), clLessonWeekly_()];", 1)


def mutate_p10(base, head, changed):
    """A fourth revised lesson — the cap is three."""
    for fn in ("clLessonDurationDegradation_", "clLessonSpecSheet_",
               "clLessonAidcPowerChain_", "clLessonHeatConstraint_"):
        lesson = get_literal(head.gs, fn)
        lesson["sections"][0]["ps"] = ["Touched."] + \
            list(lesson["sections"][0].get("ps") or [])[1:]
        lesson["updated"] = GOOD_DATE
        lesson["revisions"] = (lesson.get("revisions") or []) + [
            {"date": GOOD_DATE, "note": "n", "changed": [lesson["sections"][0]["id"]]}]
        head.gs = replace_literal(head.gs, fn, lesson)


def mutate_p11(base, head, changed):
    title = get_literal(head.gs, "clLessonSpecSheet_")["title"]   # guidance-gated
    head.gaslog = head.gaslog + "\n- New lesson: %s.\n" % title


def mutate_p12(base, head, changed):
    head.gs, nv = bump_version(head.gs)      # a second step on top of the good one
    head.ver = "|%s|" % nv


FIXTURES = [
    ("P1", "a path outside the write set", mutate_p1),
    ("P2", "an edit outside the content fence", mutate_p2),
    ("P3", "the gate derivation altered", mutate_p3),
    ("P4", "a `note` prefix added to the stamp vocabulary", mutate_p4),
    ("P5", "a section id removed", mutate_p5),
    ("P6", "an input that raises the lesson's gate", mutate_p6),
    ("P7", "a pin moved backwards", mutate_p7),
    ("P8", "a section rewritten without being named in changed[]", mutate_p8),
    ("P9", "a briefing at or behind the watermark", mutate_p9),
    ("P10", "more revised lessons than the cap allows", mutate_p10),
    ("P11", "a gated lesson title in the deployed changelog", mutate_p11),
    ("P12", "VERSION moved two steps", mutate_p12),
]


def selftest(base, today):
    global FINDINGS
    missing = {c for c, _, _ in FIXTURES} ^ {"P%d" % i for i in range(1, 13)}
    if missing:
        print("ERROR fixtures do not cover: %s" % ", ".join(sorted(missing)))
        return 1
    failures = 0

    FINDINGS = []
    head, changed = good_commit(base)
    run_all(base, head, changed, today)
    if FINDINGS:
        failures += 1
        print("FAIL  positive fixture (a well-formed pipeline commit) reported:")
        for code, msg in FINDINGS:
            print("        %-4s %s" % (code, msg))
    else:
        print("ok    positive fixture — a well-formed pipeline commit is clean")

    for code, label, mutate in FIXTURES:
        FINDINGS = []
        head, changed = good_commit(base)
        mutate(base, head, changed)
        run_all(base, head, changed, today)
        got = {c for c, _ in FINDINGS}
        if code in got:
            extra = " (also %s)" % ",".join(sorted(got - {code})) if got - {code} else ""
            print("ok    %-4s %s%s" % (code, label, extra))
        else:
            failures += 1
            print("FAIL  %-4s %s — not reported; got %s"
                  % (code, label, ", ".join(sorted(got)) or "nothing"))
            for c, m in FINDINGS[:3]:
                print("        %-4s %s" % (c, m))
    FINDINGS = []
    print("check-classroom-pipeline --selftest: %d fixture(s), %d failure(s)"
          % (len(FIXTURES) + 1, failures))
    return 1 if failures else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--base", default="origin/main",
                    help="the revision the run branched from (default origin/main)")
    ap.add_argument("--today", default=None,
                    help="the run date, YYYY-MM-DD (default: today, UTC)")
    ap.add_argument("--selftest", action="store_true",
                    help="run the contract §7 fixtures instead of a diff")
    args = ap.parse_args()
    today = args.today or datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

    if args.selftest:
        # The fixtures are synthetic mutations of the *current* content state,
        # not of a remote revision: that keeps them reproducible on a fresh
        # clone and lets the suite run before the branch has a base to diff.
        base = load_head()
        base.label = "worktree (fixture base)"
        if not base.gs:
            print("ERROR cannot read %s" % GS_PATH)
            return 1
        return selftest(base, today)

    base = load_base(args.base)
    if not base.gs:
        print("ERROR cannot read %s at %s — is the base revision fetched?"
              % (GS_PATH, args.base))
        return 1

    head = load_head()
    changed = changed_paths(args.base)
    if not changed:
        print("check-classroom-pipeline: nothing changed against %s — nothing "
              "to judge" % args.base)
        return 0
    run_all(base, head, changed, today)
    for code, msg in FINDINGS:
        print("%-4s %s" % (code, msg))
    print("check-classroom-pipeline: %d path(s) changed against %s — %d finding(s)"
          % (len(changed), args.base, len(FINDINGS)))
    return 1 if FINDINGS else 0


if __name__ == "__main__":
    sys.exit(main())

# Developed by: LightAISolutions
