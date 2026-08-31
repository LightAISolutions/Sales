#!/usr/bin/env python3
"""One-shot mechanical lift of study guides from schema v1 to v2 (Phase 5).

v1: sections[]{heading, bullets[]}  →  v2: sections[]{id, title, kind: "prose",
ps: bullets} — lossless by construction (every heading becomes a title, every
bullet becomes a ps entry, order preserved). Top-level flashcards[] stay in
place (valid at v2 for continuity); lastUpdated is preserved because the
content is unchanged. Guides already at v2 are left untouched.

Section-id generation mirrors ovStudyV2 in live-site-pages/Profiler.html —
keep the two in sync, since the in-page adapter is the safety net for any
v1 file this script never saw.

Usage:  python3 scripts/lift-study-guides.py [--check]
        --check reports what would change without writing.
"""
import json
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "live-site-pages" / "profiler-data"


def sec_id(txt, n, used):
    """Kebab-case anchor id — mirrors ovStudyV2's secId in Profiler.html."""
    s = re.sub(r"[^a-z0-9]+", "-", str(txt or "").lower())
    s = re.sub(r"^[-0-9]+|-+$", "", s)[:64]
    if not s:
        s = "s%d" % (n + 1)
    base, k = s, 2
    while s in used:
        s = "%s-%d" % (base, k)
        k += 1
    used.add(s)
    return s


def lift(sg):
    """Build the v2 document from a v1 study guide. Returns (v2, stats)."""
    used = set()
    sections = []
    for n, sec in enumerate(sg.get("sections") or []):
        sections.append({
            "id": sec_id(sec.get("heading"), n, used),
            "title": sec.get("heading") or "",
            "kind": "prose",
            "ps": list(sec.get("bullets") or []),
        })
    out = {
        "schemaVersion": 2,
        "slug": sg.get("slug"),
        "title": sg.get("title"),
        "lastUpdated": sg.get("lastUpdated"),
        "sections": sections,
    }
    if sg.get("flashcards"):
        out["flashcards"] = sg["flashcards"]
    return out


def verify_lossless(v1, v2):
    """Assert nothing was dropped or reworded by the lift."""
    s1 = v1.get("sections") or []
    s2 = v2["sections"]
    assert len(s1) == len(s2), "section count changed"
    for a, b in zip(s1, s2):
        assert (a.get("heading") or "") == b["title"], "heading changed"
        assert list(a.get("bullets") or []) == b["ps"], "bullets changed"
    assert (v1.get("flashcards") or []) == (v2.get("flashcards") or []), "flashcards changed"
    for key in ("slug", "title", "lastUpdated"):
        assert v1.get(key) == v2.get(key), "%s changed" % key


def main():
    check = "--check" in sys.argv[1:]
    lifted, skipped, secs, cards = 0, 0, 0, 0
    for path in sorted(DATA.glob("*.study.json")):
        with open(path, encoding="utf-8") as f:
            sg = json.load(f)
        if sg.get("schemaVersion", 1) >= 2:
            skipped += 1
            continue
        v2 = lift(sg)
        verify_lossless(sg, v2)
        secs += len(v2["sections"])
        cards += len(v2.get("flashcards") or [])
        if not check:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(v2, f, indent=1)
                f.write("\n")
        lifted += 1
    verb = "would lift" if check else "lifted"
    print("%s %d guide(s) to v2 (%d sections, %d flashcards); %d already at v2"
          % (verb, lifted, secs, cards, skipped))


if __name__ == "__main__":
    main()

# Developed by: LightAISolutions
