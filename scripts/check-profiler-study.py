#!/usr/bin/env python3
"""Validator for study guides + the concepts registry (Phase 5).

Checks every live-site-pages/profiler-data/<slug>.study.json against the
Study Guide schema (v1 legacy and v2) and profiler-concepts.json against the
Concepts registry schema — see repository-information/PROFILER-SCHEMA.md.
{{term}} references must resolve doc-glossary-first, then the registry.

Run after any study-guide or concepts-registry write; a write without a
clean pass is incomplete (sibling rule to check-profiler-reports.py).

Usage:  python3 scripts/check-profiler-study.py
Exit:   0 clean (warnings allowed), 1 on any error.
"""
import json
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "live-site-pages" / "profiler-data"

# Study sections may use flashcards/quiz, unlike reports.
STUDY_KINDS = {"prose", "callout", "table", "proscons", "timeline", "bars",
               "flashcards", "quiz", "ledger"}
# Mirrors GD_STUDY_SEC_RE in Profiler.gs — ids outside it never sync server-side.
SEC_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TERM_RE = re.compile(r"\{\{([^}]+)\}\}")
SEC_CAP = 80  # GD_STUDY_SEC_CAP in Profiler.gs

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def strings_in(node):
    """Yield every string value a section subtree renders (matches gdSecText's
    walk closely enough for {{term}} scanning)."""
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


def load_concepts():
    """Validate profiler-concepts.json; return the lowercase term/alias map."""
    path = DATA / "profiler-concepts.json"
    if not path.exists():
        err("concepts: profiler-concepts.json is missing")
        return {}, 0
    try:
        reg = json.loads(path.read_text(encoding="utf-8"))
    except ValueError as e:
        err("concepts: invalid JSON — %s" % e)
        return {}, 0
    if reg.get("schemaVersion") != 1:
        err("concepts: schemaVersion must be 1")
    concepts = reg.get("concepts")
    if not isinstance(concepts, list) or not concepts:
        err("concepts: concepts[] must be a non-empty array")
        return {}, 0
    seen_slugs, terms, slugs = set(), {}, []
    for i, c in enumerate(concepts):
        where = "concepts[%d] (%s)" % (i, c.get("slug", "?"))
        slug = c.get("slug")
        if not (isinstance(slug, str) and SLUG_RE.match(slug or "")):
            err("%s: bad or missing slug" % where)
            slug = None
        elif slug in seen_slugs:
            err("%s: duplicate slug" % where)
        if slug:
            seen_slugs.add(slug)
            slugs.append(slug)
        if not (isinstance(c.get("term"), str) and c["term"].strip()):
            err("%s: term is required" % where)
            continue
        if not (isinstance(c.get("def"), str) and c["def"].strip()):
            err("%s: def is required" % where)
        names = [c["term"]] + list(c.get("aliases") or [])
        for name in names:
            if not isinstance(name, str) or not name.strip():
                err("%s: empty term/alias" % where)
                continue
            key = name.lower()
            if key in terms and terms[key] != slug:
                err("%s: '%s' collides with concept '%s'" % (where, name, terms[key]))
            terms[key] = slug
    if slugs != sorted(slugs):
        warn("concepts: entries are not alphabetical by slug")
    lookup = {}
    for c in concepts:
        if isinstance(c.get("term"), str) and isinstance(c.get("def"), str):
            lookup[c["term"].lower()] = c["def"]
            for a in c.get("aliases") or []:
                if isinstance(a, str):
                    lookup[a.lower()] = c["def"]
    return lookup, len(concepts)


def check_cards(where, cards):
    if not isinstance(cards, list) or not cards:
        err("%s: cards[] must be a non-empty array" % where)
        return
    for j, fc in enumerate(cards):
        if not (isinstance(fc, dict) and isinstance(fc.get("q"), str)
                and isinstance(fc.get("a"), str)):
            err("%s cards[%d]: needs string q and a" % (where, j))


# Fields the guide renderer sets with textContent rather than through its
# {{term}} formatter. A marker placed in one of these is shown to the reader as
# literal braces. Every other authored field resolves markers correctly, so the
# trap is invisible while authoring — hence the check.
# (Found 2026-09-04: 18 markers across 10 guides were rendering as raw braces in
# comparison-card headings and chart sub-labels. The renderer was fixed for
# those two; these are the fields that remain plain by design.)
UNFORMATTED_FIELDS = (
    ("title", lambda s: s.get("title")),
    ("read", lambda s: s.get("read")),
)


def check_unformatted(where, sec):
    for name, get in UNFORMATTED_FIELDS:
        v = get(sec)
        if isinstance(v, str) and "{{" in v:
            err("%s: %s is rendered as plain text — a {{term}} here shows literal "
                "braces to the reader; move it into intro/ps/note" % (where, name))
    if sec.get("kind") == "timeline":
        for k, v in (sec.get("lanes") or {}).items():
            if isinstance(v, str) and "{{" in v:
                err("%s: lanes.%s is a plain-text legend label — a {{term}} here "
                    "shows literal braces to the reader" % (where, k))


def check_section(where, sec):
    kind = sec.get("kind")
    if kind not in STUDY_KINDS:
        err("%s: unknown kind '%s'" % (where, kind))
        return
    check_unformatted(where, sec)
    if kind in ("prose", "callout"):
        ps = sec.get("ps")
        if not (isinstance(ps, list) and all(isinstance(p, str) for p in ps or [])):
            err("%s: ps[] must be an array of strings" % where)
        elif not ps and not sec.get("intro"):
            err("%s: %s section has no ps and no intro" % (where, kind))
    elif kind in ("table", "ledger"):
        rows = sec.get("rows")
        if not (isinstance(rows, list) and rows and all(isinstance(r, list) for r in rows)):
            err("%s: rows[] must be a non-empty array of arrays" % where)
        if kind == "table" and not isinstance(sec.get("cols"), list):
            err("%s: table needs cols[]" % where)
    elif kind == "proscons":
        cards = sec.get("cards")
        if not (isinstance(cards, list) and cards):
            err("%s: proscons needs cards[]" % where)
        else:
            for j, c in enumerate(cards):
                if not (isinstance(c, dict) and c.get("t")
                        and isinstance(c.get("adv"), list) and isinstance(c.get("dis"), list)):
                    err("%s cards[%d]: needs t, adv[], dis[]" % (where, j))
    elif kind == "timeline":
        items = sec.get("items")
        if not (isinstance(items, list) and items):
            err("%s: timeline needs items[]" % where)
        else:
            for j, it in enumerate(items):
                if not (isinstance(it, dict) and isinstance(it.get("x"), (int, float))
                        and it.get("label")):
                    err("%s items[%d]: needs numeric x and label" % (where, j))
    elif kind == "bars":
        items = sec.get("items")
        if not (isinstance(items, list) and items):
            err("%s: bars needs items[]" % where)
        else:
            for j, it in enumerate(items):
                if not (isinstance(it, dict) and it.get("label")
                        and isinstance(it.get("v"), (int, float))):
                    err("%s items[%d]: needs label and numeric v" % (where, j))
    elif kind == "flashcards":
        check_cards(where, sec.get("cards"))
    elif kind == "quiz":
        items = sec.get("items")
        if not (isinstance(items, list) and items):
            err("%s: quiz needs items[]" % where)
        else:
            for j, it in enumerate(items):
                ok = (isinstance(it, dict) and isinstance(it.get("q"), str)
                      and isinstance(it.get("c"), list) and len(it["c"]) >= 2
                      and isinstance(it.get("a"), int) and 0 <= it["a"] < len(it["c"]))
                if not ok:
                    err("%s items[%d]: needs q, c[] (2+), and a index into c" % (where, j))


def check_guide(path, registry_slugs, concepts):
    name = path.name
    try:
        sg = json.loads(path.read_text(encoding="utf-8"))
    except ValueError as e:
        err("%s: invalid JSON — %s" % (name, e))
        return
    ver = sg.get("schemaVersion")
    if ver not in (1, 2):
        err("%s: schemaVersion must be 1 or 2 (got %r)" % (name, ver))
        return
    slug = sg.get("slug")
    if slug != name[:-len(".study.json")]:
        err("%s: slug %r does not match the filename" % (name, slug))
    if registry_slugs and slug not in registry_slugs:
        err("%s: slug %r is not in profiler-companies.json" % (name, slug))
    if slug and not (DATA / ("%s.profile.json" % slug)).exists():
        err("%s: no matching %s.profile.json" % (name, slug))
    if not (isinstance(sg.get("title"), str) and sg["title"].strip()):
        err("%s: title is required" % name)
    if not (isinstance(sg.get("lastUpdated"), str) and DATE_RE.match(sg["lastUpdated"] or "")):
        err("%s: lastUpdated must be YYYY-MM-DD" % name)
    sections = sg.get("sections")
    if not (isinstance(sections, list) and sections):
        err("%s: sections[] must be a non-empty array" % name)
        sections = []
    glossary = sg.get("glossary") or []
    doc_terms = set()
    for i, g in enumerate(glossary):
        if not (isinstance(g, dict) and isinstance(g.get("t"), str)
                and isinstance(g.get("d"), str) and g["t"].strip() and g["d"].strip()):
            err("%s glossary[%d]: needs string t and d" % (name, i))
        else:
            doc_terms.add(g["t"].lower())
    if ver == 1:
        for i, sec in enumerate(sections):
            if not (isinstance(sec, dict) and isinstance(sec.get("heading"), str)
                    and isinstance(sec.get("bullets"), list)
                    and all(isinstance(b, str) for b in sec.get("bullets") or [])):
                err("%s sections[%d]: v1 needs heading + bullets[]" % (name, i))
        warn("%s: still at schema v1 — renders via the adapter; lift when convenient" % name)
    else:
        ids = set()
        for i, sec in enumerate(sections):
            where = "%s sections[%d]" % (name, i)
            if not isinstance(sec, dict):
                err("%s: not an object" % where)
                continue
            sid = sec.get("id")
            if not (isinstance(sid, str) and SEC_ID_RE.match(sid or "")):
                err("%s: id %r must match %s" % (where, sid, SEC_ID_RE.pattern))
            elif sid in ids:
                err("%s: duplicate id '%s'" % (where, sid))
            else:
                ids.add(sid)
            if not (isinstance(sec.get("title"), str) and sec["title"].strip()):
                err("%s: title is required" % where)
            check_section(where, sec)
        n_ticks = len(sections) + (1 if sg.get("flashcards") else 0)
        if n_ticks > SEC_CAP:
            warn("%s: %d tickable sections exceeds the server progress cap (%d)"
                 % (name, n_ticks, SEC_CAP))
    if sg.get("flashcards"):
        check_cards("%s flashcards" % name, sg["flashcards"])
    # {{term}} resolution: doc glossary first, then the concepts registry.
    for i, sec in enumerate(sections):
        for s in strings_in(sec):
            for m in TERM_RE.finditer(s):
                t = m.group(1).strip().lower()
                if t not in doc_terms and t not in concepts:
                    err("%s sections[%d]: unresolved {{%s}}" % (name, i, m.group(1)))


def main():
    registry_slugs = set()
    reg_path = DATA / "profiler-companies.json"
    try:
        reg = json.loads(reg_path.read_text(encoding="utf-8"))
        registry_slugs = {c.get("slug") for c in reg.get("companies") or []}
    except (OSError, ValueError) as e:
        warn("could not read profiler-companies.json (%s) — slug membership unchecked" % e)
    concepts, n_concepts = load_concepts()
    guides = sorted(DATA.glob("*.study.json"))
    for path in guides:
        check_guide(path, registry_slugs, concepts)
    for w in warnings:
        print("WARN  %s" % w)
    for e in errors:
        print("ERROR %s" % e)
    print("checked %d study guide(s) + concepts registry (%d concepts): %d error(s), %d warning(s)"
          % (len(guides), n_concepts, len(errors), len(warnings)))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()

# Developed by: LightAISolutions
