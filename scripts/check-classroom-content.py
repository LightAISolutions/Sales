#!/usr/bin/env python3
"""Validator for the Classroom app's lessons, tracks, and provenance stamps.

Parses every clLesson<Name>_() / clTrack<Name>_() strict-JSON literal out of
googleAppsScripts/Classroom/Classroom.gs and validates both schemas — see
repository-information/CLASSROOM-SCHEMA.md (the single source of truth).
Stamps are checked against the prefix table read from the .gs itself
(CL_PROVENANCE_REF_KINDS / CL_PROVENANCE_STRICTNESS), so this script cannot
drift from the code it validates. Every literal must sit inside the
`// CONTENT START` … `// CONTENT END` fence (CLASSROOM-COMMITTER-CONTRACT.md
§3.1) — the region an unattended pipeline run may write. It then loads the PROJECT region into Node
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
CONCEPTS = ROOT / "live-site-pages" / "profiler-data" / "profiler-concepts.json"
SEGMENTS = ROOT / "live-site-pages" / "profiler-data" / "profiler-segments.json"
SEGMENT_SECTION_IDS = ["the-segment", "where-it-sits", "what-is-bought-and-on-what", "the-players",
                       "the-numbers", "who-is-connected", "what-moved", "the-fence", "read-next",
                       "check-yourself"]   # build-classroom-segments.py SECTION_IDS — fixed for life

# ── C5 · the scenario (simulation) layer ─────────────────────────────────────
# C5-SALES-SIMULATIONS-DESIGN.md §4/§5. The ten ids are fixed for life for the
# same reason the segment layer's are: progress keys on lesson id + section id,
# and a scenario's ten ticks are its completion record. Kinds are fixed too —
# the three `quiz` beats are the decision mechanic (D9) and the checker asserts
# the per-beat shape below, because "four real options with a rationale that
# addresses all four" is the only thing separating a rehearsal from a quiz.
SCENARIO_SECTION_IDS = ["the-room", "what-the-record-says", "the-position",
                        "beat-1", "beat-2", "beat-3", "the-mechanism-behind-it",
                        "debrief", "claims-ledger", "what-the-record-does-not-say"]
SCENARIO_SECTION_KINDS = {"the-room": "callout", "what-the-record-says": "table",
                          "the-position": "prose", "beat-1": "quiz", "beat-2": "quiz",
                          "beat-3": "quiz", "the-mechanism-behind-it": "callout",
                          "debrief": "table", "claims-ledger": "ledger",
                          "what-the-record-does-not-say": "callout"}
SCENARIO_BEATS = ["beat-1", "beat-2", "beat-3"]
SCENARIO_FIELDS = ("mode", "seat", "segment", "counterparty", "stage")
SCENARIO_MODES = ("objection", "discovery")
SCENARIO_SEATS = ("storage-seller", "aidc-power-seller")   # curriculum plan §10.10
SCENARIO_STAGES = ("prospecting", "discovery", "rfp", "shortlist", "negotiation", "post-award")
SCENARIO_TILE_VS = ["across the table", "the segment", "the exercise", "where in the sale"]
SCENARIO_LANE = "The Value Chain"
PROFILE_DIR = ROOT / "live-site-pages" / "profiler-data"

SECTION_KINDS = {"prose", "callout", "table", "proscons", "timeline", "bars",
                 "flashcards", "quiz", "ledger"}
LANES = {"Technology Foundations", "The AI Data-Center Wave", "Market Access & Bankability",
         "The Value Chain"}   # the fourth lane — the segment layer (curriculum plan §10.5, S1)
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")            # CL_ID_RE
REF_RE = re.compile(r"^([a-z]+):([A-Za-z0-9][A-Za-z0-9._-]{0,127})$")  # CL_REF_RE
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
CITE_TOKEN = re.compile(r"\[c:[^\]]+\]")
TERM_TOKEN = re.compile(r"\{\{([^}]+)\}\}")

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


def public_terms():
    """Lowercased terms + aliases from the public concepts registry.

    {{term}} tooltips resolve the lesson's own glossary first, then this
    registry (CLASSROOM-SCHEMA.md, sections[]). A term in neither renders as a
    dotted span with no tooltip behind it — visible to a reader, invisible in
    review — so check_terms below warns on it. Returns None when the registry
    cannot be read, which disables the check rather than failing the run.
    """
    try:
        reg = json.loads(CONCEPTS.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        warn("cannot read %s — {{term}} coverage not checked" % CONCEPTS.name)
        return None
    out = set()
    for c in reg.get("concepts") or []:
        if not (isinstance(c, dict) and c.get("term")):
            continue
        out.add(str(c["term"]).lower())
        for a in c.get("aliases") or []:
            out.add(str(a).lower())
    return out


def check_terms(lesson, tag, public):
    if public is None:
        return
    local = {str(g.get("t", "")).lower() for g in (lesson.get("glossary") or []) if isinstance(g, dict)}
    seen = set()
    for text in strings_in(lesson.get("sections") or []):
        for t in TERM_TOKEN.findall(text):
            k = t.lower()
            if k in seen or k in local or k in public:
                continue
            seen.add(k)
            warn("%s: {{%s}} resolves to no definition — add it to the lesson glossary "
                 "or to profiler-concepts.json, or drop the braces" % (tag, t))


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


def check_fence(src):
    """The content fence — `// CONTENT START` … `// CONTENT END` in Classroom.gs.

    CLASSROOM-COMMITTER-CONTRACT.md §3.1 makes the fence the unattended
    pipeline's write set inside this file, and check-classroom-pipeline.py (P2)
    asserts a pipeline diff stays inside it. That assertion is only worth
    anything if every lesson and track literal actually lives there: a literal
    defined below // CONTENT END could never be revised by a run without
    tripping P2, and a *new* one written there would sit in the frozen gate
    region. So the fence is checked here, on every state, not only on a diff.
    """
    starts = [m.start() for m in re.finditer(r"^// CONTENT START\b", src, re.M)]
    ends = [m.start() for m in re.finditer(r"^// CONTENT END\b", src, re.M)]
    if len(starts) != 1 or len(ends) != 1:
        err("content fence: expected exactly one `// CONTENT START` and one "
            "`// CONTENT END` in %s, found %d and %d" % (GS.name, len(starts), len(ends)))
        return
    a, b = starts[0], ends[0]
    if a >= b:
        err("content fence: `// CONTENT END` precedes `// CONTENT START`")
        return
    for m in re.finditer(r"^function (cl(?:Lesson|Track)[A-Z]\w*_)\(\) \{", src, re.M):
        if not (a < m.start() < b):
            err("%s() is defined outside the content fence — every lesson and "
                "track literal belongs between // CONTENT START and // CONTENT END"
                % m.group(1))
    for reg in ("clLessons_", "clTracks_"):
        m = re.search(r"^function %s\(\) \{" % reg, src, re.M)
        if m and not (a < m.start() < b):
            err("%s() is defined outside the content fence" % reg)


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


# ── Micro-markup: only what the renderer actually formats ────────────────────
# `clFmt` in Classroom.html resolves **bold** with /\*\*([^*]+)\*\*/g — a class
# that CANNOT contain an asterisk — then *italic* with /\*([^*\n]+)\*/g. So an
# italic nested inside a bold never matches, the italic pass chews the string,
# and LITERAL ASTERISKS render to the reader. Nothing else catches it: the
# schema is valid, the terms resolve, and `node --check` sees good JSON. It is
# visible only in a screenshot, which is how it was found (v05.55r).
#
# The scope below is deliberately narrow and mirrors the renderer call site by
# call site, because most content reaches the DOM through clEl()'s textContent
# where an asterisk is a literal character. Two traps this encodes:
#   * `provenance.inputs[].note` is an authoring aid and is NEVER rendered, so
#     "P=V*I" there is multiplication, not broken markup;
#   * `timeline` items are formatted but `bars` items are not, though both use
#     `label`/`sub` — so the walk has to be kind-aware, not field-name-aware.
FMT_BY_KIND = {
    "prose":      (("ps",), ()),
    "callout":    (("ps",), ()),
    "table":      (("cols",), ("rows",)),
    "ledger":     ((), ("rows",)),
    "proscons":   ((), ("cards.adv", "cards.dis")),
    "timeline":   ((), ("items.label", "items.sub")),
    "flashcards": ((), ("cards.q", "cards.a")),
    "quiz":       ((), ("items.q", "items.why", "items.c")),
}


def fmt_strings(sec):
    """Yield (path, text) for exactly the strings Classroom.html sends to clFmt()."""
    kind = sec.get("kind")
    for f in ("intro", "note", "sales"):            # every kind, when present
        if isinstance(sec.get(f), str):
            yield f, sec[f]
    flat, nested = FMT_BY_KIND.get(kind, ((), ()))
    for f in flat:                                   # list of strings
        for i, s in enumerate(sec.get(f) or []):
            if isinstance(s, str):
                yield "%s[%d]" % (f, i), s
    for spec in nested:
        outer, _, inner = spec.partition(".")
        for i, row in enumerate(sec.get(outer) or []):
            if inner:                                # list of dicts
                if not isinstance(row, dict):
                    continue
                v = row.get(inner)
                if isinstance(v, str):
                    yield "%s[%d].%s" % (outer, i, inner), v
                elif isinstance(v, list):            # e.g. quiz choices, adv/dis
                    for j, s in enumerate(v):
                        if isinstance(s, str):
                            yield "%s[%d].%s[%d]" % (outer, i, inner, j), s
            else:                                    # table rows: list of lists
                for j, cell in enumerate(row if isinstance(row, list) else []):
                    if isinstance(cell, str):
                        yield "%s[%d][%d]" % (outer, i, j), cell


def cl_fmt(s):
    """The two substitutions Classroom.html's clFmt() applies, in its order."""
    t = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    return re.sub(r"\*([^*\n]+)\*", r"<em>\1</em>", t)


def check_markup(doc, tag):
    for sec in doc.get("sections") or []:
        if not isinstance(sec, dict):
            continue
        for path, text in fmt_strings(sec):
            if "*" in cl_fmt(text):
                err("%s: section %r %s leaves a literal '*' after clFmt — nested "
                    "emphasis (**a *b* c**) never matches the bold regex and renders "
                    "asterisks to the reader; use one level of emphasis"
                    % (tag, sec.get("id"), path))


# ── The mirror: fields the renderer prints, and never formats ────────────────
# The check above covers everything that reaches clFmt. This one covers the
# other half of the same hazard, pointing the opposite way: most content reaches
# the DOM through clEl()'s textContent or a createTextNode, where `{{term}}`,
# `**bold**` and `*italic*` are not markup at all — they are characters, and the
# braces or asterisks are printed to the reader. Nothing else catches it either:
# the JSON is valid, the term resolves in the registry, and clFmt never sees the
# string. Found in a screenshot at v05.57r (a proscons card's `t`), and nine
# occurrences had already shipped across four lessons when this check was added.
#
# The scope mirrors the renderer call site by call site, exactly as FMT_BY_KIND
# does, and the two tables are complements rather than opposites — a `timeline`
# item's `label` is formatted while a `bars` item's is printed, and a `timeline`
# item's lane *value* is printed while the item beside it is formatted. So both
# walks have to be kind-aware. `provenance.inputs[].note` is in NEITHER table:
# it is an authoring aid that is never rendered at all, which is why the string
# "{{...}} tooltips" sits safely in one today.
PLAIN_BY_KIND = {
    "proscons": ("cards.t", "cards.meta"),   # clProsCons: clEl('div', 't'|'m', …)
    "timeline": ("lanes.*",),                # clTimeline: createTextNode(lanes[k])
    "bars":     ("items.label", "items.sub"),# clBars: createTextNode / .textContent
}

# Document-level fields printed as text: the lesson or track card and header
# (clEl('h2'|'h3'|'div', …)), the tile grid, the glossary grid, and a revision
# note, which reaches the DOM through createTextNode beside its date.
PLAIN_DOC_FIELDS = ("title", "short")
PLAIN_DOC_LISTS = (("tiles", ("k", "v", "sub")),
                   ("glossary", ("t", "d")),
                   ("revisions", ("note",)))

# Only the complete forms, because only those are silent: an unpaired asterisk
# prints an asterisk in a formatted field too, so it is not evidence of a field
# in the wrong table.
MICRO_MARKUP = re.compile(r"\{\{[^{}]+\}\}|\*\*[^*]+\*\*|\*[^*\n]+\*")


def plain_strings(doc):
    """Yield (path, text) for the strings Classroom.html prints as textContent."""
    for f in PLAIN_DOC_FIELDS:
        if isinstance(doc.get(f), str):
            yield f, doc[f]
    for name, keys in PLAIN_DOC_LISTS:
        for i, row in enumerate(doc.get(name) or []):
            if not isinstance(row, dict):
                continue
            for k in keys:
                if isinstance(row.get(k), str):
                    yield "%s[%d].%s" % (name, i, k), row[k]
    for sec in doc.get("sections") or []:
        if not isinstance(sec, dict):
            continue
        sid = sec.get("id")
        for f in ("title", "read"):                   # every kind's own header
            if isinstance(sec.get(f), str):
                yield "section %r %s" % (sid, f), sec[f]
        for spec in PLAIN_BY_KIND.get(sec.get("kind"), ()):
            outer, _, inner = spec.partition(".")
            node = sec.get(outer)
            if inner == "*":                          # timeline lanes: a dict
                for k, v in (node or {}).items() if isinstance(node, dict) else ():
                    if isinstance(v, str):
                        yield "section %r %s.%s" % (sid, outer, k), v
                continue
            for i, row in enumerate(node or []):
                if isinstance(row, dict) and isinstance(row.get(inner), str):
                    yield "section %r %s[%d].%s" % (sid, outer, i, inner), row[inner]


def check_plain_markup(doc, tag):
    for path, text in plain_strings(doc):
        m = MICRO_MARKUP.search(text)
        if m:
            err("%s: %s carries micro-markup %r in a field the renderer prints as "
                "text rather than sending to clFmt — the braces or asterisks reach "
                "the reader literally; write it as plain words"
                % (tag, path, m.group(0)))


def check_lesson(lesson, tag, ref_kinds, strictness, schema_ver, public):
    for f in ("schemaVersion", "id", "title", "short", "group", "updated", "reviewBy",
              "provenance", "sections"):
        if f not in lesson:
            err("%s: missing required field %r" % (tag, f))
    if lesson.get("schemaVersion") != schema_ver:
        err("%s: schemaVersion must be %s" % (tag, schema_ver))
    if not (isinstance(lesson.get("id"), str) and ID_RE.match(lesson.get("id") or "")):
        err("%s: id fails the id rules" % tag)
    ltype = lesson.get("type", "module")
    if ltype not in ("module", "briefing", "scenario"):
        err("%s: type must be module, briefing or scenario" % tag)
    if ltype == "briefing":
        if not (isinstance(lesson.get("edition"), str) and DATE_RE.match(lesson["edition"])):
            err("%s: briefing lessons require edition YYYY-MM-DD" % tag)
        if not str(lesson.get("id", "")).startswith("briefing-"):
            warn("%s: briefing ids conventionally start with 'briefing-'" % tag)
    elif "edition" in lesson:
        err("%s: edition is for briefings only" % tag)
    if ltype != "scenario" and "scenario" in lesson:
        err("%s: a `scenario` block is for type: scenario only" % tag)
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
    check_terms(lesson, tag, public)
    check_markup(lesson, tag)
    check_plain_markup(lesson, tag)


def check_track(track, tag, lessons_by_id, schema_ver):
    for f in ("schemaVersion", "id", "title", "short", "group", "updated", "lessons"):
        if f not in track:
            err("%s: missing required field %r" % (tag, f))
    check_plain_markup(track, tag)
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
            err("%s: lesson %r is a %s — tracks list modules only"
                % (tag, lid, l.get("type")))
    for pid in track.get("prereqs") or []:
        if not isinstance(pid, str):
            err("%s: prereqs must be track ids" % tag)


def gate_of(lesson, ref_kinds, caps, strictness):
    """The server's fold, in Python — `clStampKinds_` then `clGateForProvenance_`.

    The single Python copy of the derivation: check-classroom-curriculum.py
    imports this module and uses this function rather than keeping its own, so
    the health report and this checker can never disagree about what a stamp
    means. The authority is still the .gs — every constant below is read out of
    it (CL_PROVENANCE_REF_KINDS / _CAPS / _STRICTNESS) rather than written here,
    and the truth table runs the real region in Node beside this.
    Returns the capability name, or '(denied)' for a stamp that fails closed.
    """
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


def guidance_module_dates(src):
    """id → {updated, reviewBy} for every guidanceDoc<Name>_() literal in the .gs.

    The four keys sit at the top of each strict-JSON literal, so a bounded
    window after the function head reads them without parsing the whole file —
    the same reader check-classroom-curriculum.py uses, kept local because a
    scenario's gate depends on its landscape module being REGISTERED, which is
    a fact about this file.
    """
    out = {}
    for m in re.finditer(r"^function guidanceDoc[A-Z]\w*_\(\) \{", src, re.M):
        window = src[m.end():m.end() + 3000]
        mid = re.search(r'"id":\s*"([a-z0-9][a-z0-9-]*)"', window)
        if not mid:
            continue
        upd = re.search(r'"updated":\s*"(\d{4}-\d{2}-\d{2})"', window)
        rev = re.search(r'"reviewBy":\s*"(\d{4}-\d{2}-\d{2})"', window)
        out.setdefault(mid.group(1), {"updated": upd.group(1) if upd else "",
                                      "reviewBy": rev.group(1) if rev else ""})
    return out


def check_scenario_lessons(lessons_by_id, src, ref_kinds, caps, strictness):
    """C5 scenarios — the shape, the two registries, and the gate.

    Everything a scenario IS, its five-field `scenario` block says in a form two
    registries can answer: the seat and mode and stage against their enums, the
    segment against profiler-segments.json, the counterparty against that
    segment's own roster AND against the profile file the stamp must pin. The
    gate is NOT stored — it is computed from the stamp exactly as the server
    computes it, and a scenario whose fold is not `guidance` is an authoring
    defect rather than a gate option (design D3/§6): a fold of `tracks` means
    the landscape input was lost, `reports` means a report was gained.
    """
    reg = None
    try:
        reg = json.loads(SEGMENTS.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        if any(l.get("type") == "scenario" for l in lessons_by_id.values()):
            err("cannot read %s (%s) — scenarios cannot be checked" % (SEGMENTS.name, e))
        return
    by_seg = {s["id"]: s for s in reg.get("segments") or []}
    modules = guidance_module_dates(src)
    for lid, lesson in sorted(lessons_by_id.items(), key=lambda kv: str(kv[0])):
        if lesson.get("type") != "scenario":
            continue
        tag = "scenario %s" % lid
        sc = lesson.get("scenario")
        if not isinstance(sc, dict):
            err("%s: type is scenario, so a `scenario` block is required" % tag)
            continue
        extra = sorted(set(sc) - set(SCENARIO_FIELDS))
        missing = [f for f in SCENARIO_FIELDS if not isinstance(sc.get(f), str) or not sc[f]]
        if missing:
            err("%s: scenario block is missing %s" % (tag, missing))
        if extra:
            err("%s: scenario block carries unknown field(s) %s — the five of design §4 "
                "and nothing else" % (tag, extra))
        if sc.get("mode") not in SCENARIO_MODES:
            err("%s: scenario.mode %r not in %s" % (tag, sc.get("mode"), list(SCENARIO_MODES)))
        if sc.get("seat") not in SCENARIO_SEATS:
            err("%s: scenario.seat %r not in %s (curriculum plan §10.10)"
                % (tag, sc.get("seat"), list(SCENARIO_SEATS)))
        if sc.get("stage") not in SCENARIO_STAGES:
            err("%s: scenario.stage %r not in %s" % (tag, sc.get("stage"), list(SCENARIO_STAGES)))
        seg = by_seg.get(str(sc.get("segment")))
        if seg is None:
            err("%s: scenario.segment %r is not a registered segment in %s"
                % (tag, sc.get("segment"), SEGMENTS.name))
        else:
            cp = str(sc.get("counterparty"))
            roles = {m["slug"]: m.get("role") for m in seg.get("members") or []}
            if cp not in roles:
                err("%s: counterparty %r is not a member of segment %r"
                    % (tag, cp, seg["id"]))
            elif roles[cp] not in ("incumbent", "challenger"):
                err("%s: counterparty %r is %r in segment %r — a counterparty is the desk "
                    "that signs, so only an incumbent or a challenger"
                    % (tag, cp, roles[cp], seg["id"]))
            if not (PROFILE_DIR / ("%s.profile.json" % cp)).exists():
                err("%s: counterparty %r has no profile file — every fact row rests on it"
                    % (tag, cp))
            if isinstance(lesson.get("short"), str) and cp:
                if cp.replace("-", " ").split()[0] not in lesson["short"].lower():
                    warn("%s: short does not name the counterparty — a library card is read "
                         "without opening it (design §4); short is %r" % (tag, lesson["short"]))
        if lesson.get("group") != SCENARIO_LANE:
            warn("%s: group %r — a scenario is keyed to a segment, so its lane is %r"
                 % (tag, lesson.get("group"), SCENARIO_LANE))
        tiles = lesson.get("tiles") or []
        if len(tiles) != 4:
            err("%s: exactly four tiles required, got %d" % (tag, len(tiles)))
        else:
            got_vs = [str(t.get("v")) for t in tiles if isinstance(t, dict)]
            if got_vs != SCENARIO_TILE_VS:
                err("%s: tile `v` values must be %s in order, got %s"
                    % (tag, SCENARIO_TILE_VS, got_vs))
        # ── Sections: ten ids, in order, with the kinds design §5 fixes ──────
        secs = [s for s in lesson.get("sections") or [] if isinstance(s, dict)]
        ids = [s.get("id") for s in secs]
        if ids != SCENARIO_SECTION_IDS:
            err("%s: sections must be exactly %s in order, got %s"
                % (tag, SCENARIO_SECTION_IDS, ids))
        for s in secs:
            want = SCENARIO_SECTION_KINDS.get(str(s.get("id")))
            if want and s.get("kind") != want:
                err("%s: section %r must be kind %r, got %r"
                    % (tag, s.get("id"), want, s.get("kind")))
            if s.get("kind") == "flashcards":
                err("%s: section %r is `flashcards` — a scenario's only drillable-looking "
                    "sections are its three beats, and even those never enter a deck (D7)"
                    % (tag, s.get("id")))
        # ── The beats: one item, four options, an answer, a rationale ────────
        for bid in SCENARIO_BEATS:
            b = next((s for s in secs if s.get("id") == bid), None)
            if b is None:
                continue
            if not (isinstance(b.get("intro"), str) and b["intro"].strip()):
                err("%s: %s needs an `intro` — it carries the counterparty's line for the beat"
                    % (tag, bid))
            # `note` is a SECTION field — the renderer prints it as .cl-note after
            # the item. Written inside items[0] it is valid JSON, passes every
            # other check, and is never shown to anybody; found in the render at
            # C5 session 1, on all six beats, and turned into this assertion so
            # the next session cannot repeat it.
            if not (isinstance(b.get("note"), str) and b["note"].strip()):
                err("%s: %s needs a section-level `note` — it carries the conversation "
                    "forward on the assumption the strong move was taken, and a `note` "
                    "written inside items[] renders nowhere" % (tag, bid))
            if isinstance(b.get("items"), list) and b["items"] and isinstance(b["items"][0], dict) \
                    and "note" in b["items"][0]:
                err("%s: %s carries `note` inside items[0] — the renderer only prints a "
                    "section-level note, so that text reaches no reader" % (tag, bid))
            items = b.get("items")
            if not (isinstance(items, list) and len(items) == 1):
                err("%s: %s must carry exactly one item, got %s"
                    % (tag, bid, len(items) if isinstance(items, list) else items))
                continue
            it = items[0]
            if not isinstance(it, dict):
                err("%s: %s items[0] must be an object" % (tag, bid)); continue
            choices = it.get("c")
            if not (isinstance(choices, list) and len(choices) == 4):
                err("%s: %s must offer exactly four options, got %s"
                    % (tag, bid, len(choices) if isinstance(choices, list) else choices))
            a = it.get("a")
            if not (isinstance(a, int) and not isinstance(a, bool)
                    and isinstance(choices, list) and 0 <= a < len(choices)):
                err("%s: %s `a` must index its own options, got %r" % (tag, bid, a))
            if not (isinstance(it.get("why"), str) and it["why"].strip()):
                err("%s: %s needs a `why` — and it must address all four options" % (tag, bid))
            if not (isinstance(it.get("q"), str) and it["q"].strip()):
                err("%s: %s needs a `q` — the situation question" % (tag, bid))
        # ── The stamp, and the gate it must compute to ───────────────────────
        refs = [str(i.get("ref", "")) for i in (lesson.get("provenance") or {}).get("inputs") or []
                if isinstance(i, dict)]
        cp = str(sc.get("counterparty") or "")
        if cp and ("profile:%s" % cp) not in refs:
            err("%s: the stamp must carry profile:%s — it is where every fact row comes from"
                % (tag, cp))
        want_pfx = "guidance:landscape-%s-" % sc.get("segment")
        lands = [r for r in refs if r.startswith(want_pfx)]
        if not lands:
            err("%s: the stamp must carry a `%sYYYY-MM` input — the landscape is where the "
                "strong move and the counterparty's posture come from, and it is what makes "
                "the fold `guidance` (design D3)" % (tag, want_pfx))
        for r in lands:
            mid = r.split(":", 1)[1]
            if mid not in modules:
                err("%s: stamp names %r, which guidanceDocs_() does not register" % (tag, r))
        for bad in ("report:", "corpus:", "briefing:"):
            for r in refs:
                if r.startswith(bad):
                    err("%s: stamp carries %r — a scenario needs no ranking and is not "
                        "week-bound; `%s` is forbidden (design §6)" % (tag, r, bad[:-1]))
        fold = gate_of(lesson, ref_kinds, caps, strictness)
        if fold != "guidance":
            err("%s: the stamp folds to %r, not 'guidance' — a fold of 'tracks' means the "
                "landscape input was lost, 'reports' means a report was gained; both are "
                "authoring defects, not gate options (design §6)" % (tag, fold))
        # ── reviewBy: a scenario cannot outlive the judgment it rests on ─────
        rb = str(lesson.get("reviewBy") or "")
        for r in lands:
            lrb = modules.get(r.split(":", 1)[1], {}).get("reviewBy") or ""
            if rb and lrb and rb > lrb:
                warn("%s: reviewBy %s is later than %s's own %s — a scenario cannot outlive "
                     "the judgment it rests on (design §6)" % (tag, rb, r.split(':', 1)[1], lrb))


def check_segment_lessons(lessons_by_id):
    """A generated `segment-<id>` lesson that drifted from its registry is an
    error (CLASSROOM-CURRICULUM-PLAN.md §10.9): the ten section ids present in
    order, its `profile:` inputs equal to the registry's member set for that
    segment exactly, and the-players rows equal to the members. The generator
    (scripts/build-classroom-segments.py) is the only thing that writes these
    literals — a hand edit, a stale regeneration or a registry change without a
    rerun all land here. Registered segments with no lesson yet are the health
    script's finding, not this checker's."""
    try:
        reg = json.loads(SEGMENTS.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        if any(str(k).startswith("segment-") for k in lessons_by_id):
            err("cannot read %s (%s) — segment lessons cannot be checked" % (SEGMENTS.name, e))
        return
    by_id = {s["id"]: s for s in reg.get("segments") or []}
    for lid, lesson in sorted(lessons_by_id.items(), key=lambda kv: str(kv[0])):
        if not str(lid).startswith("segment-"):
            continue
        tag = "segment lesson %s" % lid
        seg = by_id.get(str(lid)[len("segment-"):])
        if seg is None:
            err("%s: no segment with that id in %s — a retired segment's lesson stays, but its "
                "registry entry must too" % (tag, SEGMENTS.name))
            continue
        ids = [s.get("id") for s in lesson.get("sections") or [] if isinstance(s, dict)]
        if ids != SEGMENT_SECTION_IDS:
            err("%s: sections must be exactly %s in order, got %s" % (tag, SEGMENT_SECTION_IDS, ids))
        members = sorted(m["slug"] for m in seg.get("members") or [])
        refs = sorted(str(i.get("ref", ""))[len("profile:"):]
                      for i in (lesson.get("provenance") or {}).get("inputs") or []
                      if isinstance(i, dict) and str(i.get("ref", "")).startswith("profile:"))
        if refs != members:
            err("%s: profile: inputs %s do not equal the registry's members %s — regenerate "
                "(python3 scripts/build-classroom-segments.py --segment %s)" % (tag, refs, members, seg["id"]))
        players = next((s for s in lesson.get("sections") or []
                        if isinstance(s, dict) and s.get("id") == "the-players"), None)
        rows = players.get("rows") if isinstance(players, dict) else None
        if isinstance(rows, list):
            slugs = sorted(str(r[1]) for r in rows if isinstance(r, list) and len(r) >= 3 and r[1] != "—")
            roles = {str(r[1]): str(r[2]) for r in rows if isinstance(r, list) and len(r) >= 3}
            if slugs != members:
                err("%s: the-players rows %s do not equal the registry's members %s" % (tag, slugs, members))
            for m in seg.get("members") or []:
                if roles.get(m["slug"]) not in (None, m.get("role")):
                    err("%s: the-players gives %s role %r, the registry says %r"
                        % (tag, m["slug"], roles.get(m["slug"]), m.get("role")))
        else:
            err("%s: the-players table has no rows[]" % tag)
        if lesson.get("group") != "The Value Chain":
            err("%s: group must be 'The Value Chain'" % tag)
        kinds = {str(i.get("kind")) for i in (lesson.get("provenance") or {}).get("inputs") or [] if isinstance(i, dict)}
        if kinds - {"public"}:
            err("%s: a segment lesson's inputs are all public (found %s) — judgment belongs in the landscape module"
                % (tag, sorted(kinds - {"public"})))


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
    # C5: the stamp every scenario carries by construction — the counterparty's
    # dossier and its segment's landscape. It folds to `guidance`, which is what
    # makes a scenario contributor+ without a capability of its own (design D3).
    "scenario-stamp": {"provenance": {"inputs": [
        {"kind": "public", "ref": "profile:aypa-power"},
        {"kind": "guidance", "ref": "guidance:landscape-storage-developers-and-ipps-2026-09"}]}},
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
    "public-only": "tracks", "public-plus-guidance": "guidance",
    "scenario-stamp": "guidance", "corpus": "briefing",
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
function dataAuditLog() {}
var RBAC_DEFAULT_ROLE = 'viewer';
// The progress store is the only part of the region that touches Apps Script
// services; stubbing them keeps the whole region runnable in Node.
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
var FX = %(fixtures)s, TIERS = %(tiers)s, out = { gate: {}, visible: {}, index: {} };
Object.keys(FX).forEach(function(k) {
  out.gate[k] = clLessonGate_(FX[k]);
  out.visible[k] = {};
  Object.keys(TIERS).forEach(function(t) { out.visible[k][t] = clLessonVisible_(TIERS[t], FX[k]); });
});
// Index filtering with a stand-in registry: later declarations override.
function clLessons_() { return [
  { id: 'l-pub', title: 'P', provenance: FX['public-only'].provenance, sections: [{id:'a'},{id:'b'}] },
  { id: 'l-gd',  title: 'G', provenance: FX['public-plus-guidance'].provenance, sections: [{id:'a'},{id:'b'}] },
  { id: 'l-rep', title: 'R', provenance: FX['public-plus-report'].provenance, sections: [{id:'a'}] },
  { id: 'l-bad', title: 'B', provenance: FX['note-ref'].provenance, sections: [{id:'a'}] },
  { id: 'b-1', type: 'briefing', edition: '2026-09-01', title: 'W', provenance: FX['corpus'].provenance, sections: [{id:'a'}] },
  // C5: a scenario, registered in no track, carrying its ten fixed section ids.
  { id: 'l-scn', type: 'scenario', title: 'S', provenance: FX['scenario-stamp'].provenance,
    scenario: { mode: 'objection', seat: 'storage-seller', segment: 'seg-x',
                counterparty: 'cp-x', stage: 'shortlist' },
    sections: %(scnSections)s }
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
// ── Progress ops: progress is never a weaker gate than reading ──────────
out.tickable = {};
out.scenarioTickable = {};
Object.keys(TIERS).forEach(function(t) {
  var sess = { role: TIERS[t].role, permissions: TIERS[t].permissions, email: t + '@example.com' };
  var v = clProgressValid_(sess);
  out.tickable[t] = Object.keys(v).sort();
  // C5: the ten section ids named, not merely the lesson id — a scenario's
  // completion record IS its ten ticks, so the admitted set is the assertion.
  out.scenarioTickable[t] = v['l-scn'] ? Object.keys(v['l-scn']).sort() : null;
});
// C3 session 3: guidance modules are tickable and drillable here, behind the
// `guidance` capability rather than a lesson's provenance stamp. Emit the
// registry so the tier expectations below can be built from the real ids, and
// so a lesson id colliding with a module id is caught rather than silently
// letting one doc's sections validate the other's ticks.
out.guidanceIds = guidanceDocs_().map(function(d) { return d.id; }).sort();
var EM = 'shared@example.com';
var asContrib = { role: 'contributor', permissions: [], email: EM };
var asAnalyst = { role: 'analyst', permissions: [], email: EM };
out.progress = {
  // A tier that cannot read the lesson cannot tick it.
  analystTicksGuidance: clProgressWrite_({ role: 'analyst', permissions: [], email: 'a@example.com' },
                                         { id: 'l-gd', sec: 'a', done: '1' }),
  // A section id that does not exist is not storable either.
  contribTicksGhostSection: clProgressWrite_(asContrib, { id: 'l-pub', sec: 'ghost', done: '1' }),
  // The real write, then the same account seen at a lower tier.
  contribTicksGuidance: clProgressWrite_(asContrib, { id: 'l-gd', sec: 'a', done: '1' }),
  readAsContrib: null, readAsAnalyst: null, rawKept: null, afterUntick: null
};
out.progress.readAsContrib = clProgressRead_(asContrib);
out.progress.readAsAnalyst = clProgressRead_(asAnalyst);
out.progress.rawKept = JSON.parse(__props['cl_progress:' + EM] || '{}');
clProgressWrite_(asContrib, { id: 'l-gd', sec: 'a', done: '0' });
out.progress.afterUntick = clProgressRead_(asContrib);
// A session with no usable email cannot write at all.
out.progress.anon = clProgressWrite_({ role: 'admin', permissions: [], email: 'unvalidated' },
                                     { id: 'l-pub', sec: 'a', done: '1' });

// ── Drill: the pool is never a weaker gate than reading ─────────────────
// The drill's item pool is derived from clLessonVisible_, so a tier that
// cannot open a lesson must not be able to drill its cards or learn their
// ids. Re-point the stand-in registry at lessons that actually carry
// drillable sections, then enumerate per tier.
var __clLessonsOrig = clLessons_;
clLessons_ = function() { return [
  { id: 'l-pub', title: 'P', provenance: FX['public-only'].provenance, sections: [
    { id: 'f1', kind: 'flashcards', cards: [ { q: 'pub q1', a: 'pub a1' }, { q: 'pub q2', a: 'pub a2' } ] },
    { id: 'z1', kind: 'quiz', items: [ { q: 'pub quiz', c: ['x','y'], a: 1, why: 'because' } ] }
  ] },
  { id: 'l-gd', title: 'G', provenance: FX['public-plus-guidance'].provenance, sections: [
    { id: 'f2', kind: 'flashcards', cards: [ { q: 'gd q1', a: 'gd a1' } ] }
  ] },
  { id: 'l-rep', title: 'R', provenance: FX['public-plus-report'].provenance, sections: [
    { id: 'f3', kind: 'flashcards', cards: [ { q: 'rep q1', a: 'rep a1' } ] }
  ] },
  // C5 / D7: a scenario carrying BOTH drillable section kinds, readable by the
  // same tiers as l-gd. If clDrillLessonItems_ stopped skipping scenarios, this
  // fixture would contribute lq:l-scn:beat-1:0 and lc:l-scn:f-scn:0 — which is
  // what makes the zero below a measurement rather than an empty set (ll1).
  { id: 'l-scn', type: 'scenario', title: 'S', provenance: FX['scenario-stamp'].provenance,
    scenario: { mode: 'objection', seat: 'storage-seller', segment: 'seg-x',
                counterparty: 'cp-x', stage: 'shortlist' },
    sections: [
      { id: 'beat-1', kind: 'quiz', items: [ { q: 'scn q', c: ['w','x','y','z'], a: 1, why: 'because' } ] },
      { id: 'f-scn', kind: 'flashcards', cards: [ { q: 'scn c1', a: 'scn a1' } ] }
    ] }
]; };
out.drill = {};
out.drillScenario = {};
Object.keys(TIERS).forEach(function(t) {
  var ids = Object.keys(clDrillLessonItems_(TIERS[t])).sort();
  out.drill[t] = ids;
  out.drillScenario[t] = {
    n: ids.filter(function(i) { return i.split(':')[1] === 'l-scn'; }).length,
    pool: ids.length,
    visible: clLessonVisible_(TIERS[t], { provenance: FX['scenario-stamp'].provenance })
  };
});
// The guidance half of the pool: ids only (the modules are real, so the count
// is large), plus the prefixes, which is what the gate assertion needs.
out.drillGuidance = {};
Object.keys(TIERS).forEach(function(t) {
  var ids = Object.keys(clDrillGuidanceItems_(TIERS[t]));
  var pfx = {};
  ids.forEach(function(i) { pfx[i.split(':')[0]] = true; });
  out.drillGuidance[t] = { n: ids.length, prefixes: Object.keys(pfx).sort(),
                           gradable: ids.every(function(i) { return CL_DRILL_ID_RE.test(i); }),
                           docs: ids.map(function(i) { return i.split(':')[1]; })
                                    .filter(function(v, k, a) { return a.indexOf(v) === k; }).sort() };
});
// ── The roster deck (K2): opt-in, separate, and never in the other queue ──
// Two invariants, both asserted on COUNTS rather than on the absence of an
// error, because an enumeration that silently returned nothing would satisfy
// any test written the other way round (curriculum plan §10.8; (ll1)).
//
// The fixture registry carries five shapes on purpose: a PUBLIC segment
// lesson, a GATED one (no real segment lesson is gated — every stamp folds to
// `tracks` — but the invariant under test is that clLessonVisible_ governs the
// roster pool exactly as it governs the mechanism pool, so the gate needs a
// fixture to bite on), a NON-segment lesson carrying a the-players-shaped
// table (the id-prefix filter must exclude it, or a hand-authored mechanism
// lesson could inject company cards into the deck that is supposed to be the
// only place they live), a segment whose COLUMNS ARE REORDERED (the deck
// resolves them by header name, so a card must come out with the company and
// the role in the right fields rather than swapped), and one MISSING a column
// (skipped whole rather than emitted mis-keyed).
var __clLessonsPreRoster = clLessons_;
var __rcCols = ['Company', 'Dossier', 'Role', "Basis (the dossier's own line)"];
clLessons_ = function() { return [
  { id: 'segment-pub-seg', title: 'Public segment', provenance: FX['public-only'].provenance,
    sections: [ { id: 'the-players', kind: 'table', cols: __rcCols, rows: [
      ['**Alpha Co**', 'alpha-co', 'incumbent', 'ecosystemRole: the first basis line'],
      ['**Beta Co**', 'beta-co', 'challenger', 'ecosystemRole: the second basis line'] ] } ] },
  { id: 'segment-gated-seg', title: 'Gated segment', provenance: FX['public-plus-guidance'].provenance,
    sections: [ { id: 'the-players', kind: 'table', cols: __rcCols, rows: [
      ['**Gamma Co**', 'gamma-co', 'adjacent', 'ecosystemRole: the gated basis line'] ] } ] },
  { id: 'l-not-a-segment', title: 'Not a segment', provenance: FX['public-only'].provenance,
    sections: [ { id: 'the-players', kind: 'table', cols: __rcCols, rows: [
        ['**Delta Co**', 'delta-co', 'incumbent', 'ecosystemRole: must never be drawn'] ] },
      { id: 'f1', kind: 'flashcards', cards: [ { q: 'mech q', a: 'mech a' } ] } ] },
  { id: 'segment-reordered', title: 'Reordered segment', provenance: FX['public-only'].provenance,
    sections: [ { id: 'the-players', kind: 'table',
      cols: ['Role', "Basis (the dossier's own line)", 'Company', 'Dossier'], rows: [
      ['incumbent', 'ecosystemRole: the reordered basis line', '**Epsilon Co**', 'epsilon-co'] ] } ] },
  { id: 'segment-missing-col', title: 'Missing column', provenance: FX['public-only'].provenance,
    sections: [ { id: 'the-players', kind: 'table', cols: ['Company', 'Role'], rows: [
      ['**Zeta Co**', 'incumbent'] ] } ] }
]; };
out.roster = {};
Object.keys(TIERS).forEach(function(t) {
  var sess = { role: TIERS[t].role, permissions: TIERS[t].permissions, email: 'rc-' + t + '@example.com' };
  var ids = Object.keys(clDrillRosterItems_(sess)).sort();
  // The flag is untouched for this account, so the OPT-IN derivation — the one
  // both ops authorise against — must be empty however large the enumeration.
  var allowedOff = Object.keys(clDrillRosterAllowed_(sess)).length;
  var mech = Object.keys(clDrillAllowed_(sess));
  out.roster[t] = {
    n: ids.length, ids: ids,
    allRosterRe: ids.every(function(i) { return CL_ROSTER_ID_RE.test(i); }),
    anyDrillRe: ids.filter(function(i) { return CL_DRILL_ID_RE.test(i); }).length,
    allowedOff: allowedOff,
    mechPool: mech.length,
    mechRc: mech.filter(function(i) { return i.indexOf(CL_ROSTER_ID_PREFIX) === 0; }).length
  };
});
// Opting in is per account and reaches ANALYST, the tier the deck exists for:
// every segment lesson is public, so an analyst can read the player tables and
// must therefore be able to drill them.
var rcAn = { role: 'analyst', permissions: [], email: 'rc-on@example.com' };
out.rosterOn = { before: Object.keys(clDrillRosterAllowed_(rcAn)).length };
out.rosterOn.set = clRosterSetEnabled_(rcAn, true);
out.rosterOn.enabled = clRosterEnabled_(rcAn);
var rcPool = clDrillRosterAllowed_(rcAn);
out.rosterOn.after = Object.keys(rcPool).length;
// Opting in must not widen the MECHANISM pool by one item.
out.rosterOn.mechRc = Object.keys(clDrillAllowed_(rcAn))
  .filter(function(i) { return i.indexOf(CL_ROSTER_ID_PREFIX) === 0; }).length;
// Header-name resolution: the reordered table's card must carry the company in
// q and the role in a, not the other way round.
out.rosterOn.reordered = rcPool['rc:segment-reordered:epsilon-co'] || null;
// The emphasis the generator puts on the company cell must be off the question:
// the drill card reaches the DOM through textContent, where `**` is literal.
out.rosterOn.anyAsterisk = Object.keys(rcPool)
  .filter(function(i) { return rcPool[i].q.indexOf('*') >= 0; }).length;
// The content hash is the BASIS TEXT and nothing else (§10.8).
out.rosterOn.hashIsBasis = clDrillHash_('ecosystemRole: the reordered basis line') ===
  (out.rosterOn.reordered && out.rosterOn.reordered.hash);
// Opting back out leaves no residue — "off" has one representation.
clRosterSetEnabled_(rcAn, false);
out.rosterOn.afterOff = Object.keys(clDrillRosterAllowed_(rcAn)).length;
out.rosterOn.caps = { session: CL_ROSTER_SESSION_CAP, newCap: CL_ROSTER_NEW_CAP };
// The two decks share the two sheet tabs but NOT the daily new-card budget.
// A state map holding rc: rows must leave the mechanism queue's budget whole,
// which is what makes "no account that existed before K2 sees its mechanism
// queue move" a measurement rather than a claim.
var rcState = { 'lc:l-x:f1:0': { due: '2026-01-01', hash: 'h', seen: '2026-09-18', reps: 1 },
                'rc:segment-pub-seg:alpha-co': { due: '2026-01-01', hash: 'h', seen: '2026-09-18', reps: 1 },
                'rc:segment-pub-seg:beta-co': { due: '2026-01-01', hash: 'h', seen: '2026-09-18', reps: 1 } };
out.rosterSplit = {
  mech: Object.keys(clDrillStateForDeck_(rcState, false)).sort(),
  roster: Object.keys(clDrillStateForDeck_(rcState, true)).sort(),
  // Three rows introduced today, two of them roster: the mechanism deck must
  // see ONE against its cap, and the roster deck TWO against its own.
  mechRoom: clDrillQueue_({ 'n1': { hash: 'x' }, 'n2': { hash: 'x' } },
                          clDrillStateForDeck_(rcState, false), '2026-09-18').queue.length,
  rosterRoom: clDrillQueue_({ 'n1': { hash: 'x' }, 'n2': { hash: 'x' } },
                            clDrillStateForDeck_(rcState, true), '2026-09-18',
                            CL_ROSTER_SESSION_CAP, CL_ROSTER_NEW_CAP).queue.length
};
clLessons_ = __clLessonsPreRoster;
clLessons_ = __clLessonsOrig;   // restore: study-next below asserts against the original registry
// Study-item containment: a real slug validates, a bogus one does not, and
// the registry fetch is stubbed so the checker never touches the network.
// The study pool is built server-side from the public guides (v01.10g), so
// there is no client inventory to validate. What still must hold is that the
// pool is capped and that a network failure degrades to lesson items only
// rather than throwing. UrlFetchApp is stubbed rather than reached.
UrlFetchApp = { fetch: function() { throw new Error('offline'); },
                fetchAll: function() { return []; } };
CacheService = { getScriptCache: function() { return {
  get: function() { return null; }, put: function() {} }; } };
out.drillStudy = { offline: Object.keys(clDrillStudyItems_()).length,
                   cap: CL_DRILL_INV_CAP };

// ── Study-next: the pointer walks registry order and never names a lesson
// the tier cannot read. The stand-in track lists a readable lesson, a gated
// one, and a ghost id, so the skip-don't-stop rule is exercised.
var nx = {};
Object.keys(TIERS).forEach(function(t) {
  var sess = { role: TIERS[t].role, permissions: TIERS[t].permissions, email: 'nx-' + t + '@example.com' };
  nx[t] = { fresh: clStudyNext_(sess, {}) };
});
// An analyst has finished the only lesson it can read: the pointer must be
// null rather than falling through to the guidance-gated lesson behind it.
var nxAnalyst = { role: 'analyst', permissions: [], email: 'nx2@example.com' };
nx.analystDone = clStudyNext_(nxAnalyst, { 'l-pub': { a: true, b: true } });
// A contributor in the same state advances past the finished lesson to the
// next readable one rather than stopping.
var nxContrib = { role: 'contributor', permissions: [], email: 'nx3@example.com' };
nx.contribAdvances = clStudyNext_(nxContrib, { 'l-pub': { a: true, b: true } });
nx.contribMidLesson = clStudyNext_(nxContrib, { 'l-pub': { a: true } });
out.next = nx;

// ── The three fail-closed paths, and their audit trail ─────────────────
// Each denial is captured as the audit entries pushed DURING its own call —
// not read off the run-wide __audit list — so a denial logged by some other
// path in this harness (progress, drill) can never stand in for the one the
// gate is supposed to write (§7.59 item (i), (rr12)).
var forbidden = 0, denials = {};
function __deny(label, fn) {
  var before = __audit.length;
  try { fn(); } catch (e) { forbidden += /CLASSROOM_FORBIDDEN/.test(String(e.message)) ? 1 : 0; }
  denials[label] = __audit.slice(before);
}
__deny('classroom_capability_denied', function() { clRequireLesson_(TIERS['analyst'], clStampKinds_(FX['public-plus-guidance']), 'gate-t'); });
__deny('classroom_bad_provenance',    function() { clRequireLesson_(TIERS['admin'], clStampKinds_(FX['note-ref']), 'gate-t'); });
__deny('classroom_not_admitted',      function() { clRequire_(TIERS['viewer'], 'tracks', 'gate-t'); });
out.forbidden = forbidden; out.denials = denials;
out.audited = __audit.map(function(a) { return a.result; });
process.stdout.write(JSON.stringify(out));
"""

EXPECTED_INDEX = {
    "admin":               {"tracks": ["t-mixed:l-pub,l-gd,l-rep/2", "t-admin:l-rep/0"], "lessons": ["l-pub", "l-gd", "l-rep", "b-1", "l-scn"]},
    "admin-by-permission": {"tracks": ["t-mixed:l-pub,l-gd,l-rep/2", "t-admin:l-rep/0"], "lessons": ["l-pub", "l-gd", "l-rep", "b-1", "l-scn"]},
    "contributor":         {"tracks": ["t-mixed:l-pub,l-gd/3"], "lessons": ["l-pub", "l-gd", "b-1", "l-scn"]},
    "analyst":             {"tracks": ["t-mixed:l-pub/4"], "lessons": ["l-pub"]},
    "viewer":              {"tracks": [], "lessons": []},
    "unknown-role":        {"tracks": [], "lessons": []},
}
CARD_KEYS = "edition,gate,group,id,kinds,reviewBy,revised,sections,short,title,type,updated"
# C5: `scenario` is emitted on a scenario's card ONLY — the Rehearsal library
# groups seat → segment and shows mode · counterparty · stage off the same
# cop=index payload, and a card that carried the key unconditionally would move
# every other card's bytes, breaking the "analyst index byte-identical" test a
# gated registration is supposed to pass. The paired assertion below therefore
# checks BOTH directions: present on the scenario, absent everywhere else.
SCENARIO_CARD_KEYS = "edition,gate,group,id,kinds,reviewBy,revised,scenario,sections,short,title,type,updated"


def run_gate_truth_table(src, lesson_ids=()):
    m = re.search(r"^// PROJECT START.*?\n(.*?)^// PROJECT END", src, re.S | re.M)
    if not m:
        err("gate test: PROJECT region not found in %s" % GS.name); return
    js = HARNESS % {"region": m.group(1), "fixtures": json.dumps(FIXTURES), "tiers": json.dumps(TIERS),
                    "scnSections": json.dumps([{"id": s} for s in SCENARIO_SECTION_IDS])}
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
        for lid, keys in zip(got["lessons"], got["cards"]):
            want_keys = SCENARIO_CARD_KEYS if lid == "l-scn" else CARD_KEYS
            if keys != want_keys:
                err("gate test: card keys for %s/%s = %s, expected %s (sections must never "
                    "leak into a card; `scenario` appears on a scenario's card and on no other)"
                    % (t, lid, keys, want_keys))
    if out["forbidden"] != 3:
        err("gate test: expected 3 CLASSROOM_FORBIDDEN throws, got %s" % out["forbidden"])

    # Progress: a tier may tick exactly the lessons it may read, plus — since
    # C3 session 3 — every guidance module, when it holds the `guidance`
    # capability. Same invariant, one more surface: progress is never a weaker
    # gate than reading, and a module is read behind exactly that capability.
    gids = out.get("guidanceIds") or []
    cases = 1
    # Hard-coded on purpose: it catches a module silently dropped from (or
    # doubled into) `guidanceDocs_()`, which deriving the count from the same
    # function could not. Bump it in the commit that registers a module —
    # 9 at C3 session 3, 10 since S2 session 1 added the first landscape,
    # 11 since S2 session 2 added the second (cells and chemistry),
    # 12 since S2 session 3 added the third (storage developers and IPPs),
    # 13 since S2 session 4 added the fourth (utilities) — the first landscape
    # over a segment an earlier module already partly covered, so it is also
    # the first whose registration puts TWO modules on the same franchises;
    # they split process from parties rather than duplicating, and the header
    # comment above guidanceDocLandscapeUtilities_() records the split,
    # 14 since S2 session 5 added the fifth (power conversion and rack-power
    # silicon) — where the overlap is no longer partial: nvidia-800vdc-2026-08
    # covers the ARCHITECTURE of the exact layer that segment is defined as, so
    # the split had to be written before the module and is the sharpest of the
    # five. THREE registered modules now bear on this one segment (the 800 VDC
    # architecture, and the two policy modules that own its manufacturing-
    # location buying criterion), which is the first time that has happened and
    # the reason the header comment above guidanceDocLandscapePowerConversion_()
    # enumerates the six things it deliberately does NOT carry — a later
    # revision that imports any of them collapses the split this count guards.
    # 15 since S2 session 6 added the sixth (AIDC developers and landlords) —
    # where the fourth neighbour is not a module at all. `the-campus-as-a-power
    # -project` is a PUBLIC mechanism lesson built on nine of that segment's own
    # members, so the split crosses an ACCESS TIER as well as a subject: the
    # lesson is analyst-visible and the module is contributor-only. The line
    # taken is that the lesson teaches the test and the module applies it to
    # named parties, and the header comment above
    # guidanceDocLandscapeAidcDevelopersAndLandlords_() enumerates NINE
    # omissions across all four neighbours rather than six across one.
    # 16 at S2 session 7 (landscape-in-hall-power-2026-09), which raised the
    # neighbour count again: ELEVEN bear on that segment - SIX of them public
    # mechanism lessons and five modules, one of which is another LANDSCAPE, so
    # the split is drawn on the registry's own role assignment (eight members
    # sit in both segments and five carry a different role in each). Its header
    # comment enumerates NINETEEN omissions across all eleven.
    # 17 at S2 session 8 (landscape-grid-equipment-2026-09), where the split
    # runs in THREE directions for the first time. Its nearest neighbour,
    # grid-equipment-shortage-2026-09, is a module about that segment's OWN
    # scarcity and its first buying criterion IS that scarcity - so the line is
    # the calendar as a market condition there against who holds which slot
    # here, and that module pre-declared the handoff in its own buyer callout.
    # It is also the FIRST segment with a built landscape on BOTH sides of it
    # in the chain (positions 3 and 5), and both splits are role inversions
    # pointing in OPPOSITE directions, which is why the header comment above
    # guidanceDocLandscapeGridEquipment_() enumerates THIRTY-FIVE omissions
    # across six neighbours rather than nineteen across eleven: fewer
    # neighbours, deeper overlap per neighbour.
    # 18 at S2 session 9 (landscape-bridge-and-on-site-generation-2026-09,
    # 2026-09-15): the FIRST segment two of whose three READ_NEXT mechanism
    # lessons are already built, so 10.6 (t)'s pre-declaration fires across
    # four whole sections of two public lessons rather than on one tile or one
    # callout - and the lesson's own three-ways-out-of-a-queue taxonomy maps
    # ONE-FOR-ONE onto the segment's five challengers. It also has SIX built
    # landscape neighbours, a record, with a BIMODAL inversion rate (in-hall
    # power 6 of 6, grid equipment 0 of 3).
    # 19 at S2 session 10 (landscape-clean-firm-and-nuclear-2026-09,
    # 2026-09-16), where the split was drawn by a lesson that DOES NOT EXIST
    # YET: a built public lesson hands the physics off by name to
    # clean-firm-power, curriculum plan 7 row 16, unbuilt - so the material it
    # declined is held by nobody and the module names the gap rather than
    # filling it. Its other finding was an instrument: with an EMPTY registry
    # notes field, the lopsided roster was answered by measurement instead -
    # eleven of eleven adjacents ranked elsewhere, uniformly demoted INTO the
    # segment, which reads as the segment being a PRODUCT other industries
    # make rather than a LAYER they sell into.
    # 20 at S2 session 11 (landscape-hyperscalers-and-ai-labs-2026-09,
    # 2026-09-16): the SMALLEST segment any landscape has covered (eight
    # members against a previous smallest of fourteen) and the FIRST CLOSED
    # one - zero adjacents AND not one member ranked in any other segment, one
    # of only two closed segments in the taxonomy. The closure disables two
    # standing instruments rather than merely being unusual: session 10's
    # adjacency instrument is computed over adjacents and there are none, and
    # the role-inversion comparisons of sessions 7, 8 and 9 need shared
    # members, of which this segment has EXACTLY ZERO with all ten built
    # landscapes. It also has SIX of six buying criteria with no taught owner,
    # and structurally - the three lessons READ_NEXT maps to it appear in NO
    # CRITERION_LEXICON entry, so the generator's intersection is empty by
    # construction. Eleven neighbours, tying session 7's record, with
    # NINETEEN omissions enumerated in its header comment.
    # 21 at S2 session 12 (landscape-neoclouds-2026-09, 2026-09-16): the most
    # LOPSIDED roster any landscape has covered - seven members, ONE incumbent
    # and SIX challengers, zero adjacents - so who-dominates is a section about
    # a single company's basis and each-players-bet is seven rows in which six
    # attack one position. Three findings. First, the incumbency basis is a
    # THIRD-PARTY OPERATIONAL RATING covering six of the seven, in which the
    # incumbent holds the only top tier across both cycles - while it is first
    # on neither contracted power nor growth, so the role is measuring
    # LEGIBILITY (four of seven publish no revenue at all). Second, the ONE
    # built landscape sharing members with it inverts 2 of 4 - the first
    # INTERMEDIATE inversion rate, and it decomposes on a finer line than
    # developer-against-tenant: the two that hold the same role in both SELL
    # campus capacity to others, while of the two that invert one owns three
    # campuses but builds them for its own load and the other owns almost
    # nothing - so the rate sorts on whether a member's campus position is a
    # business it SELLS or a book it merely HAS, which is a sharper cut than
    # the segment's own third buying criterion along the same axis. Third, a NEW
    # mechanism for an empty criterion intersection: unlike sessions 8, 10 and
    # 11, every one of the five criteria DOES hit a CRITERION_LEXICON key -
    # but not one of the matching lessons is in this segment's READ_NEXT, so
    # the mapped set and the keyword-matching set are DISJOINT and the dash
    # row is largely a keyword artefact rather than a curriculum hole. Its
    # header comment enumerates TWENTY-THREE omissions across eight
    # neighbours, the heaviest of which is the public Value Chain LANE OPENER
    # that uses this segment's own credit chain as its worked example.
    # 24 at S2 session 15 (2026-09-17), landscape-cooling-2026-09 - the
    # FIFTEENTH landscape. Its brief proposed the segment was "two markets
    # wearing one name" and the GRAPH REJECTED IT: 26 edges among the eleven,
    # 36 of 39 typings competitor, and the competitor subgraph is ONE
    # component of ten whose only cut vertex detaches a single leaf. What
    # replaced it is that two independent rankings place the SAME firm first
    # and fifth - ABI Research on thermal management against Global Market
    # Insights on chillers - and BOTH members' dossiers give the same reason
    # independently, neither citing the other: they are strong at different
    # points in one chain. So the segment is ONE CHAIN MEASURED AT TWO POINTS,
    # which also explains its structural signature: 17 of 22 memberships
    # elsewhere invert, sorted perfectly by role, with NO member ranked at the
    # top here ranked higher anywhere else and NO adjacent here ranked lower
    # anywhere else - (aa2) and (ee3) firing together in opposite directions
    # for the first time. 10.6 (t) fired in a FOURTH shape: both READ_NEXT
    # lessons are public, own all six criteria, and name NONE of the eleven -
    # a boundary enacted rather than declared, visible only as a measurement
    # of what was not written.
    # S2 runs one landscape per segment in the INTEGRATED-REMEDIATION-PLAN.md
    # 7.3 sales-value order, so this number rises by one per S2 session and
    # the session that forgets it is stopped here rather than in review.
    # 27 -> 28 at S2 session 19 (landscape-assurance-2026-09), which is the
    # NINETEENTH landscape and the last: S2 is closed, so this number stops
    # rising with S2 and moves next only when some other session registers a
    # module. 10.6 (t) fired across TWO neighbours of different kinds at once -
    # a public mechanism lesson and a contributor landscape module - and the
    # landscape module had already named this segment as where its own gap is
    # filled, so the split was written before the module was.
    if len(gids) != 28:
        err("progress test: guidanceDocs_() registers %d module(s), expected 28" % len(gids))
    cases += 1
    clash = sorted(set(gids) & set(lesson_ids))
    if clash:
        err("registry test: %s is registered as BOTH a lesson and a guidance module — "
            "they share the progress and drill namespaces, so one doc's sections "
            "would validate the other's ticks" % clash)
    for t, want in EXPECTED_INDEX.items():
        got = out["tickable"].get(t)
        cases += 1
        exp = sorted(want["lessons"] + (gids if t in READS["guidance"] else []))
        if got != exp:
            err("progress test: %s may tick %s, but may read %s — progress must not be a weaker gate"
                % (t, got, exp))
    # C5: the scenario's TEN section ids are admitted for the tiers that read it
    # and nothing at all for the tiers that do not. Named rather than counted,
    # because ten ticks are the whole of a scenario's completion record.
    st = out.get("scenarioTickable") or {}
    for t in EXPECTED_INDEX:
        cases += 1
        want_secs = sorted(SCENARIO_SECTION_IDS) if t in READS["guidance"] else None
        if st.get(t) != want_secs:
            err("progress test: %s may tick %s of scenario l-scn, expected %s"
                % (t, st.get(t), want_secs))
    pr = out["progress"]

    # A completed section stores its COMPLETION DATE ('YYYY-MM-DD') as of
    # Classroom v01.08g; legacy `true` still reads as done, dateless. These
    # two shapes are what "done" means now — the assertions below check
    # presence and, separately, that a NEW write is dated.
    def _done(v):
        return v is True or (isinstance(v, str) and re.match(r"^\d{4}-\d{2}-\d{2}$", v) is not None)

    checks = [
        (pr["analystTicksGuidance"].get("changed") == 0,
         "an analyst tick against a guidance-gated lesson changed %s rows (expected 0)"
         % pr["analystTicksGuidance"].get("changed")),
        ("l-gd" not in (pr["analystTicksGuidance"].get("progress") or {}),
         "a denied tick still appeared in the returned progress map"),
        (pr["contribTicksGhostSection"].get("changed") == 0,
         "a tick against a section id that does not exist was stored"),
        (pr["contribTicksGuidance"].get("changed") == 1,
         "a permitted tick changed %s rows (expected 1)" % pr["contribTicksGuidance"].get("changed")),
        (_done(pr["readAsContrib"].get("l-gd", {}).get("a")),
         "a permitted tick did not read back for the tier that made it"),
        (isinstance(pr["readAsContrib"].get("l-gd", {}).get("a"), str),
         "a tick written by this version read back as %r — new writes must "
         "carry a completion date, not a bare boolean"
         % (pr["readAsContrib"].get("l-gd", {}).get("a"),)),
        ("l-gd" not in pr["readAsAnalyst"],
         "a guidance-derived tick leaked to the same account seen as analyst"),
        (_done(pr["rawKept"].get("l-gd", {}).get("a")),
         "the stored tick was destroyed by the demotion rather than filtered"),
        ("l-gd" not in pr["afterUntick"],
         "un-ticking did not remove the section"),
        (pr["anon"].get("error") == "NO_ACCOUNT",
         "a session without a usable email was allowed to write progress"),
    ]
    for ok, msg in checks:
        cases += 1
        if not ok:
            err("progress test: " + msg)

    # Drill: the item pool is never a weaker gate than reading. The pool is
    # derived from clLessonVisible_, so a tier's drillable ids must reference
    # only lessons that tier may open — otherwise a card, or merely its id,
    # leaks material the reader is gated out of.
    dr = out["drill"]
    for tier, want in EXPECTED_INDEX.items():
        readable = set(want["lessons"])
        cases += 1
        leaked = [i for i in dr.get(tier, [])
                  if i.split(":")[1] not in readable]
        if leaked:
            err("drill gate: %s can drill %s, which belong to lessons it cannot read (%s)"
                % (tier, leaked, sorted(readable)))
    # Positive control: a tier that CAN read a lesson gets its cards, so the
    # test above cannot pass merely by the pool being empty.
    cases += 1
    if not dr.get("admin"):
        err("drill gate: admin drew an empty drill pool — the gate test proves nothing")
    cases += 1
    if "lq:l-pub:z1:0" not in dr.get("admin", []):
        err("drill: quiz items are not being enumerated (expected lq:l-pub:z1:0 for admin)")

    # ── C5 / D7: NO SCENARIO EVER ENTERS A DECK ─────────────────────────────
    # Every scenario is company-specific and the mechanism deck's contract is
    # "never company trivia", so clDrillLessonItems_ skips type: scenario. The
    # assertion is a ZERO, and a zero proves nothing on its own — so the second
    # loop below is the positive control that makes it a measurement: the same
    # fixture must be READABLE by the tier and the tier's pool must be NON-EMPTY
    # ((ll1)). Remove the one-line skip in clDrillLessonItems_ and this fires
    # with lq:l-scn:beat-1:0 and lc:l-scn:f-scn:0; if it does not, look for a
    # second guard before concluding the assertion has a hole ((rr13)).
    ds = out.get("drillScenario") or {}
    for tier in EXPECTED_INDEX:
        row = ds.get(tier) or {}
        cases += 1
        if row.get("n"):
            err("drill gate: %s drew %d item(s) from a type: scenario lesson — a scenario "
                "never enters the mechanism deck (design D7)" % (tier, row.get("n")))
    for tier in EXPECTED_INDEX:
        row = ds.get(tier) or {}
        cases += 1
        if tier in READS["guidance"] and not (row.get("visible") and row.get("pool")):
            err("drill gate: the scenario fixture is visible=%r to %s with a pool of %s — the "
                "zero above is then an empty set rather than a working exclusion ((ll1))"
                % (row.get("visible"), tier, row.get("pool")))

    # The guidance half of the pool, on the same rule: a tier without the
    # `guidance` capability must draw nothing from it — not a card, not an id.
    dg = out.get("drillGuidance") or {}
    for tier in EXPECTED_INDEX:
        row = dg.get(tier) or {}
        cases += 1
        if tier in READS["guidance"]:
            if not row.get("n"):
                err("drill gate: %s draws no guidance items — the gate test proves nothing" % tier)
            if not row.get("gradable"):
                err("drill gate: %s was served guidance ids CL_DRILL_ID_RE rejects, so cop=grade "
                    "would refuse what cop=drill served" % tier)
            stray = sorted(set(row.get("prefixes") or []) - {"gc", "gq"})
            if stray:
                err("drill gate: guidance items carry prefixes %s, expected only gc/gq" % stray)
            stray_docs = sorted(set(row.get("docs") or []) - set(gids))
            if stray_docs:
                err("drill gate: guidance items reference %s, which are not registered modules" % stray_docs)
        elif row.get("n"):
            err("drill gate: %s drew %d guidance item(s) without the guidance capability"
                % (tier, row.get("n")))

    # The roster deck (K2, curriculum plan §10.8): opt-in, separate, and
    # NEVER in the mechanism queue. Asserted on COUNTS in both directions,
    # because a roster enumeration that silently returned nothing would satisfy
    # a test written as "no rc: item appears" and prove nothing at all ((ll1)).
    #
    # Fixture expectations, from the five shapes the harness registers: a
    # public segment lesson (2 rows), a gated one (1), a NON-segment lesson
    # carrying a the-players-shaped table (must contribute 0), a segment whose
    # columns are reordered (1, resolved by header name), and one missing a
    # column (0, skipped whole rather than emitted mis-keyed).
    RC_PUBLIC = ["rc:segment-pub-seg:alpha-co", "rc:segment-pub-seg:beta-co",
                 "rc:segment-reordered:epsilon-co"]
    RC_GATED = ["rc:segment-gated-seg:gamma-co"]
    rc = out.get("roster") or {}
    for tier in EXPECTED_INDEX:
        row = rc.get(tier) or {}
        want = []
        if tier in READS["tracks"]:
            want += RC_PUBLIC
        if tier in READS["guidance"]:
            want += RC_GATED
        cases += 1
        if row.get("ids") != sorted(want):
            err("roster deck: %s enumerates %s, expected %s — the pool is derived from "
                "clLessonVisible_, so it must be exactly the segment lessons the tier may read"
                % (tier, row.get("ids"), sorted(want)))
        cases += 1
        if not row.get("allRosterRe"):
            err("roster deck: %s was served rc: ids CL_ROSTER_ID_RE rejects, so cop=grade "
                "would refuse what cop=drill served" % tier)
        # The namespaces are separated by the EXISTING regex, not by convention:
        # CL_DRILL_ID_RE requires a trailing :<n> index and an rc: id ends in a
        # dossier slug. If that ever stopped holding, the mechanism grade path
        # would start accepting roster ids without anyone editing it.
        cases += 1
        if row.get("anyDrillRe"):
            err("roster deck: %d rc: id(s) for %s also match CL_DRILL_ID_RE — the two "
                "id namespaces have stopped being disjoint" % (row.get("anyDrillRe"), tier))
        # Default OFF: the derivation both ops authorise against is empty until
        # the account opts in, however large the enumeration behind it.
        cases += 1
        if row.get("allowedOff") != 0:
            err("roster deck: %s drew %s item(s) from clDrillRosterAllowed_ without opting in "
                "— the deck must be off by default" % (tier, row.get("allowedOff")))
        # THE INVARIANT THE CONTENT CONTRACT NAMES: the mechanism queue never
        # contains an rc: item. Counted, with the pool size beside it so a zero
        # from an empty pool cannot pass as a zero from a working separation.
        cases += 1
        if row.get("mechRc"):
            err("roster deck: the mechanism pool for %s carries %d rc: item(s) — the "
                "mechanism queue must never contain one" % (tier, row.get("mechRc")))
        cases += 1
        if tier in READS["tracks"] and not row.get("mechPool"):
            err("roster deck: the mechanism pool for %s is empty, so the "
                "'no rc: item' assertion above proves nothing" % tier)
    ro = out.get("rosterOn") or {}
    rc_checks = [
        (ro.get("before") == 0, "an account drew %s roster item(s) before opting in" % ro.get("before")),
        (ro.get("set", {}).get("success") is True, "opting in failed: %r" % (ro.get("set"),)),
        (ro.get("enabled") is True, "the opt-in flag did not read back as set"),
        # An ANALYST is the tier the deck is designed to reach: every segment
        # lesson is public, so an analyst reads the player tables and must be
        # able to drill them.
        (ro.get("after") == len(RC_PUBLIC),
         "an opted-in analyst drew %s roster item(s), expected %d" % (ro.get("after"), len(RC_PUBLIC))),
        (ro.get("mechRc") == 0,
         "opting in put %s rc: item(s) into the mechanism pool" % ro.get("mechRc")),
        (ro.get("afterOff") == 0, "opting back out left %s item(s) drillable" % ro.get("afterOff")),
        (ro.get("caps") == {"session": 20, "newCap": 10},
         "the roster caps are %r, expected CL_ROSTER_SESSION_CAP 20 / CL_ROSTER_NEW_CAP 10" % (ro.get("caps"),)),
        # Header-name resolution: the reordered table must not swap fields.
        ((ro.get("reordered") or {}).get("company") == "Epsilon Co"
         and (ro.get("reordered") or {}).get("role") == "incumbent",
         "a table whose columns are reordered produced %r — the columns are resolved "
         "by header name precisely so this cannot happen silently" % (ro.get("reordered"),)),
        (ro.get("anyAsterisk") == 0,
         "%s roster question(s) still carry a literal asterisk — the drill card reaches "
         "the DOM through textContent, where ** does not render as emphasis" % ro.get("anyAsterisk")),
        (ro.get("hashIsBasis") is True,
         "the roster content hash is not the basis text alone, which §10.8 fixes it as"),
    ]
    for ok, msg in rc_checks:
        cases += 1
        if not ok:
            err("roster deck: " + msg)
    # The two decks share the two sheet tabs and must NOT share the daily
    # new-card budget. Three rows were introduced today, two of them roster:
    # the mechanism deck sees one against CL_DRILL_NEW_CAP and the roster deck
    # two against CL_ROSTER_NEW_CAP, so each deck has its own room left.
    rs = out.get("rosterSplit") or {}
    split_checks = [
        (rs.get("mech") == ["lc:l-x:f1:0"],
         "the mechanism half of a mixed state map is %r" % (rs.get("mech"),)),
        (rs.get("roster") == ["rc:segment-pub-seg:alpha-co", "rc:segment-pub-seg:beta-co"],
         "the roster half of a mixed state map is %r" % (rs.get("roster"),)),
        (rs.get("mechRoom") == 2,
         "two roster rows introduced today cost the mechanism deck %s of its 2 new slots "
         "— opting into the roster deck must not shrink the mechanism deck's budget"
         % (2 - (rs.get("mechRoom") or 0))),
        (rs.get("rosterRoom") == 2,
         "the roster deck drew %s new item(s) with 2 of its own rows introduced today" % rs.get("rosterRoom")),
    ]
    for ok, msg in split_checks:
        cases += 1
        if not ok:
            err("roster deck: " + msg)

    ds = out["drillStudy"]
    cases += 1
    if ds["offline"] != 0:
        err("drill study pool: an unreachable registry should yield no study items, got %d"
            % ds["offline"])
    cases += 1
    if ds["cap"] > 2400:
        err("drill study pool: the build cap is %d, above the documented 2400" % ds["cap"])

    # Study-next: never points a tier at a lesson it cannot read.
    nx = out["next"]
    for t, want_lessons in ((k, set(v["lessons"])) for k, v in EXPECTED_INDEX.items()):
        got = nx[t]["fresh"]
        cases += 1
        if want_lessons and (got is None or got["lesson"] not in want_lessons):
            err("study-next: %s was pointed at %r, which is not among the lessons it may read (%s)"
                % (t, got and got["lesson"], sorted(want_lessons)))
        if not want_lessons and got is not None:
            err("study-next: %s may read nothing but was pointed at %r" % (t, got["lesson"]))
    nx_checks = [
        (nx["admin"]["fresh"]["lesson"] == "l-pub",
         "a fresh account is not pointed at the first lesson of the first track"),
        (nx["admin"]["fresh"]["section"] == "a" and nx["admin"]["fresh"]["started"] is False,
         "a fresh pointer does not start at the first section, or claims to be resumed"),
        (nx["analystDone"] is None,
         "an analyst that finished its only readable lesson was pointed at a gated one"),
        (nx["contribAdvances"] is not None and nx["contribAdvances"]["lesson"] == "l-gd",
         "a contributor did not advance past a finished lesson to the next readable one"),
        (nx["contribMidLesson"]["section"] == "b" and nx["contribMidLesson"]["started"] is True,
         "a part-finished lesson does not resume at its first unticked section"),
    ]
    for ok, msg in nx_checks:
        cases += 1
        if not ok:
            err("study-next: " + msg)
    # The audit-trail half of the truth table: every fail-closed path writes a
    # security_alert naming the denial, the operation and (for a capability
    # denial) the capability it refused. These three checks sat BELOW the
    # `return` on the last line of this function from C1 until v06.57r and had
    # never executed — the report counted the gate cases while the audit half
    # went unverified (§7.59 item (i), (rr12)). They now run, one gate case
    # each, and each is asserted against the entries logged during its own
    # call, with the denominator printed when it fails.
    DENIAL_DETAILS = {
        "classroom_capability_denied": {"operation": "gate-t", "capability": "guidance", "role": "analyst"},
        "classroom_bad_provenance":    {"operation": "gate-t"},
        "classroom_not_admitted":      {"operation": "gate-t", "role": "viewer"},
    }
    denials = out.get("denials") or {}
    for want, details in DENIAL_DETAILS.items():
        cases += 1
        logged = denials.get(want) or []
        hits = [a for a in logged if a.get("result") == want]
        if len(hits) != 1:
            err("gate test: denial %r was audit-logged %d time(s) during its own call, expected exactly 1 "
                "(%d entr%s logged during the call: %s)"
                % (want, len(hits), len(logged), "y" if len(logged) == 1 else "ies",
                   [a.get("result") for a in logged]))
            continue
        got = hits[0].get("details") or {}
        bad = {k: got.get(k) for k, v in details.items() if got.get(k) != v}
        if bad:
            err("gate test: denial %r was audit-logged with details %s, expected %s"
                % (want, bad, {k: details[k] for k in bad}))
    return (len(EXPECTED_GATE) * (1 + len(TIERS))) + len(EXPECTED_INDEX) + cases

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

    check_fence(src)
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

    public = public_terms()
    lessons_by_id, tracks_by_id = {}, {}
    for fn, l in lessons.items():
        tag = "%s()" % fn
        check_lesson(l, tag, ref_kinds, strictness, lesson_ver, public)
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
    check_segment_lessons(lessons_by_id)
    check_scenario_lessons(lessons_by_id, src, ref_kinds, caps, strictness)
    # Guidance modules live below the // CONTENT END fence and are not lessons,
    # so nothing else here validates them — but Classroom.html renders them
    # through the SAME cl* engine, so they carry the identical markup hazard.
    # Only the two markup checks are applied; their schema is the guidance
    # rules', not this checker's. `guidanceDocs_()` (the plural registry) returns calls
    # rather than a JSON literal, so the parser skips it on its own.
    for fn, doc in parse_literals(src, "guidanceDoc").items():
        check_markup(doc, "%s()" % fn)
        check_plain_markup(doc, "%s()" % fn)
    cases = run_gate_truth_table(src, list(lessons_by_id)) or 0
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
