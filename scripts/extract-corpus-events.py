#!/usr/bin/env python3
"""Derive events.json `mentions[]` from the Profiler dossier corpus (E0).

Walks every `live-site-pages/profiler-data/*.profile.json` across
`recentDevelopments[]`, `productsAndServices[]`, `technicalSpecs[]`,
`strategyRead[]` and `sources[]`, matching the CORPUS_EVENTS table below.
Each match becomes one `mentions[] { slug, where }` entry on the event row
named by the table, where `slug` is the *dossier* slug (a registry company,
per EVENTS-SCHEMA.md §3) and `where` is the field it was found in.

`mentions[]` is a derived index of where a name appears — never evidence
that a company attends (EVENTS-SCHEMA.md §11). Attendance is only ever a
Signal with an evidence URL.

Idempotent: rewrites every `mentions[]` array from scratch on each run, so
running twice produces the same file. Seeds a `tentative` registry row for
any table event that has no row yet, so a new corpus event is never silently
dropped.

Usage:
  python3 scripts/extract-corpus-events.py            # rewrite mentions[] in place
  python3 scripts/extract-corpus-events.py --check    # exit 1 if the file would change
  python3 scripts/extract-corpus-events.py --report   # print the mention table

Developed by: LightAISolutions
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CORPUS_DIR = ROOT / "live-site-pages" / "profiler-data"
EVENTS_JSON = ROOT / "live-site-pages" / "events-data" / "events.json"

# The dossier fields walked, mapped to the `where` vocabulary of
# EVENTS-SCHEMA.md §3: developments · products · specs · sources · strategy.
FIELD_WHERE = {
    "recentDevelopments": "developments",
    "productsAndServices": "products",
    "technicalSpecs": "specs",
    "sources": "sources",
    "strategyRead": "strategy",
}

# ---------------------------------------------------------------------------
# The corpus event table — one row per event string the dossier corpus names.
#
#   key      internal, stable, used in --report and in error messages
#   regex    matched case-sensitively against each field's serialised text
#   slug     the registry event row the mentions attach to (the next edition
#            in the registry; a series' mentions land on its soonest row)
#
# Measured 2026-09-21 across 177 dossiers. The counts are NEVER taught and
# never a dossier fact (EVENTS-SCHEMA.md §11, the corpus-wide-count corollary).
#
# Deliberately NOT in this table, having been checked and found not to be
# events: "SNE Research" (a market-research firm, 9 files), "ESIG — <report>"
# (a standards body's publication, 1 file), "Data Center Frontier" (a trade
# publication; its *event* is Data Center Frontier Trends, matched separately),
# "Uptime Institute M&O Stamp" (a certification, not the Uptime Network event),
# "Supercomputing centres" (a noun phrase, not SC2x), "OCP-Ready" / "Open Rack
# Wide" (specifications, not the OCP Global Summit).
# ---------------------------------------------------------------------------
CORPUS_EVENTS = [
    ("dcd",                 r"\bDCD>?\s?(?:Connect|Converge|Zettastructure|Awards)?\b|DatacenterDynamics",  "dcd-connect-virginia-2026"),
    ("gtc",                 r"\bGTC\b",                                              "nvidia-gtc-2027"),
    ("intersolar",          r"\bIntersolar\b",                                       "intersolar-esna-2027"),
    ("re-plus",             r"RE\+",                                                 "re-plus-2026"),
    ("ocp-global-summit",   r"\bOCP\s+(?:Global\s+|EMEA\s+|APAC\s+|Regional\s+)?Summit\b", "ocp-global-summit-2026"),
    ("snec",                r"\bSNEC\b",                                             "snec-pv-es-2027"),
    ("bisnow",              r"\bBisnow\b",                                           "bisnow-dice-national-2027"),
    ("smarter-e",           r"\bThe\s+smarter\s+E\b|\bsmarter\s+E\s+Europe\b",       "the-smarter-e-europe-2027"),
    ("data-center-world",   r"Data\s+Cent(?:er|re)\s+World",                         "data-center-world-2027"),
    ("computex",            r"\bComputex\b",                                         "computex-2027"),
    ("ceraweek",            r"\bCERAWeek\b",                                         "ceraweek-2027"),
    ("cleanpower",          r"\bCLEANPOWER\b",                                       "cleanpower-2027"),
    ("microgrid-knowledge", r"Microgrid\s+Knowledge",                                "dcf-trends-microgrid-knowledge-2027"),
    ("imasons",             r"\biMasons\b|Infrastructure\s+Masons",                  "imasons-texas-energy-update-2026-11"),
    ("wef-davos",           r"World\s+Economic\s+Forum|\bDavos\b",                   "wef-annual-meeting-2027"),
    ("ces",                 r"\bCES\s+20\d\d\b|\bat\s+CES\b",                        "ces-2027"),
    ("distributech",        r"\bDISTRIBUTECH\b|\bDTECH\b",                           "distributech-2027"),
    ("advancing-ai",        r"Advancing\s+AI\s+20\d\d",                              "amd-advancing-ai-2027"),
    ("hot-chips",           r"Hot\s+Chips\b",                                        "hot-chips-2027"),
    ("idee-shenzhen",       r"International\s+Digital\s+Energy\s+Expo",              "idee-shenzhen-2027"),
    ("cibf",                r"\bCIBF\b",                                             "cibf-2027"),
    ("esic-beijing",        r"Energy\s+Storage\s+International\s+Conference",        "esie-beijing-2027"),
    ("naatbatt",            r"\bNAATBatt\b",                                         "naatbatt-annual-2026"),
    ("infocast",            r"\bInfocast\b",                                         "infocast-powerup-data-centers-2027"),
    ("gcpa",                r"Gulf\s+Coast\s+Power",                                 "gcpa-fall-2026"),
    ("mwc",                 r"Mobile\s+World\s+Congress|\bMWC\s+20\d\d\b",           "mwc-barcelona-2027"),
    ("ees-europe",          r"\bees\s+Europe\b",                                     "the-smarter-e-europe-2027"),
    ("open-ai-infra",       r"(?:Open\s+)?AI\s+Infra(?:structure)?\s+Summit",        "ai-infra-summit-2027"),
    ("datacloud",           r"\bDatacloud\b",                                        "datacloud-global-congress-2027"),
    ("interbattery",        r"\bInterBattery\b",                                     "interbattery-2027"),
    ("ieee-pes",            r"IEEE\s+PES\b",                                         "ieee-pes-general-meeting-2027"),
    ("powergen",            r"\bPOWERGEN\b",                                         "powergen-international-2027"),
    ("energy-storage-summit", r"Energy\s+Storage\s+Summit\b",                        "energy-storage-summit-usa-2027"),
]


def field_texts(dossier):
    """Yield (where, text) for every walked entry of one dossier."""
    for field, where in FIELD_WHERE.items():
        for entry in dossier.get(field) or []:
            if isinstance(entry, str):
                yield where, entry
            else:
                yield where, json.dumps(entry, ensure_ascii=False)


def scan_corpus():
    """Return {event_slug: [{slug, where}, ...]} and {key: file_count}."""
    compiled = [(key, re.compile(rx), slug) for key, rx, slug in CORPUS_EVENTS]
    # event_slug -> dossier_slug -> set(where)
    found = {}
    per_key_files = {key: set() for key, _, _ in CORPUS_EVENTS}

    paths = sorted(CORPUS_DIR.glob("*.profile.json"))
    if not paths:
        sys.exit(f"no dossiers found under {CORPUS_DIR}")

    for path in paths:
        dossier = json.loads(path.read_text(encoding="utf-8"))
        company = dossier.get("slug")
        if not company:
            sys.exit(f"{path.name}: dossier has no slug")
        for where, text in field_texts(dossier):
            for key, rx, event_slug in compiled:
                if rx.search(text):
                    found.setdefault(event_slug, {}).setdefault(company, set()).add(where)
                    per_key_files[key].add(company)

    mentions = {}
    for event_slug, by_company in found.items():
        rows = []
        for company in sorted(by_company):
            for where in sorted(by_company[company]):
                rows.append({"slug": company, "where": where})
        mentions[event_slug] = rows
    return mentions, {k: len(v) for k, v in per_key_files.items()}


def seed_row(event_slug):
    """A minimal tentative registry row for a corpus event with no row yet.

    Deliberately incomplete: the E0 research session fills name, dates, venue
    and sources from the organiser's own page. A seed is never `confirmed`.
    """
    return {
        "slug": event_slug,
        "name": event_slug,
        "series": event_slug,
        "organiser": "",
        "kind": "conference",
        "start": "",
        "end": "",
        "tz": "",
        "city": "",
        "region": "",
        "country": "",
        "website": "",
        "audience": [],
        "relevance": 3,
        "sources": [],
        "mentions": [],
        "status": "tentative",
        "lastUpdated": "",
        "_seeded": "corpus — needs organiser verification",
    }


def load_registry():
    if not EVENTS_JSON.exists():
        return {"schemaVersion": 1, "built": "", "events": []}
    return json.loads(EVENTS_JSON.read_text(encoding="utf-8"))


def apply_mentions(registry, mentions):
    """Rewrite every `mentions[]` from the scan; seed missing rows. Idempotent."""
    by_slug = {e["slug"]: e for e in registry.get("events", [])}
    seeded = []
    for _, _, event_slug in CORPUS_EVENTS:
        if event_slug not in by_slug:
            row = seed_row(event_slug)
            registry.setdefault("events", []).append(row)
            by_slug[event_slug] = row
            seeded.append(event_slug)
    for event in registry.get("events", []):
        rows = mentions.get(event["slug"], [])
        if rows:
            event["mentions"] = rows
        else:
            event.pop("mentions", None)
    registry["events"].sort(key=lambda e: (e.get("start") or "9999-99-99", e["slug"]))
    return seeded


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--check", action="store_true",
                    help="exit 1 if events.json would change (CI mode)")
    ap.add_argument("--report", action="store_true",
                    help="print the per-event mention counts and exit")
    args = ap.parse_args()

    mentions, per_key = scan_corpus()

    if args.report:
        width = max(len(k) for k, _, _ in CORPUS_EVENTS)
        total = 0
        for key, _, event_slug in CORPUS_EVENTS:
            rows = mentions.get(event_slug, [])
            total += len(rows)
            flag = "" if per_key[key] else "   <-- NO MENTION"
            print(f"{key:<{width}}  dossiers={per_key[key]:>3}  "
                  f"mentions={len(rows):>3}  -> {event_slug}{flag}")
        print(f"\n{len(CORPUS_EVENTS)} corpus events, "
              f"{total} mention rows across "
              f"{len(sorted({r['slug'] for rs in mentions.values() for r in rs}))} dossiers")
        missing = [k for k, n in per_key.items() if not n]
        if missing:
            print(f"\nFAIL: no corpus mention for {', '.join(missing)}")
            return 1
        return 0

    registry = load_registry()
    before = json.dumps(registry, ensure_ascii=False, sort_keys=True)
    seeded = apply_mentions(registry, mentions)
    after = json.dumps(registry, ensure_ascii=False, sort_keys=True)

    missing = [k for k, n in per_key.items() if not n]
    if missing:
        print(f"FAIL: no corpus mention for {', '.join(missing)}", file=sys.stderr)
        return 1

    if args.check:
        if before != after:
            print("FAIL: events.json is stale — run "
                  "`python3 scripts/extract-corpus-events.py`", file=sys.stderr)
            if seeded:
                print(f"       unseeded corpus events: {', '.join(seeded)}", file=sys.stderr)
            return 1
        print(f"OK: mentions[] current for {len(CORPUS_EVENTS)} corpus events")
        return 0

    EVENTS_JSON.write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    counted = sum(len(v) for v in mentions.values())
    print(f"wrote {EVENTS_JSON.relative_to(ROOT)}: {counted} mention rows "
          f"for {len(CORPUS_EVENTS)} corpus events"
          + (f"; seeded {len(seeded)} row(s): {', '.join(seeded)}" if seeded else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Developed by: LightAISolutions
