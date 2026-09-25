#!/usr/bin/env python3
"""Assert every rule in EVENTS-SCHEMA.md §12 against the Events registry (E0).

Checks `live-site-pages/events-data/events.json` against
`events-sources.json`, `profiler-data/profiler-segments.json` and
`profiler-data/profiler-companies.json`, and walks the published `events.ics`
(built by `scripts/build-events-ics.py`) against the registry. Since E4 s1 it
also validates `profiler-segments.json` -> `seats` (the score's seat segments):
both seat keys present, every seat segment id in `segments[].id`, no
duplicate id within a seat.

  python3 scripts/check-events-registry.py              # exit 1 on any finding
  python3 scripts/check-events-registry.py --fix-past    # flip stale status only
  python3 scripts/check-events-registry.py --quiet       # findings only

`--fix-past` changes `status` and nothing else: it never edits a date, a
source or a mention, and it never promotes a row to `confirmed`.

Developed by: LightAISolutions
"""

import argparse
import datetime
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

try:
    from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
except ImportError:                                        # pragma: no cover
    ZoneInfo = None

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "live-site-pages" / "events-data"
EVENTS = DATA / "events.json"
SOURCES = DATA / "events-sources.json"
ICS = DATA / "events.ics"
PROFILER = ROOT / "live-site-pages" / "profiler-data"
SEGMENTS = PROFILER / "profiler-segments.json"

SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
KINDS = {"mega", "conference", "regional", "social", "corporate-summit", "webinar"}
STATUSES = {"confirmed", "tentative", "cancelled", "past"}
SOURCE_KINDS = {"jsonld", "ics", "html", "manual"}
FEED_KINDS = {"jsonld", "ics", "html", "manual"}
ROBOTS = {"allowed", "disallowed", "unknown"}
SPEAKERS_WIDGETS = {"swapcard", "cvent", "bizzabo", "grip"}   # roster widgets the E4 sweep skips
CADENCE = {"weekly", "monthly", "manual"}
WHERE = {"developments", "products", "specs", "sources", "strategy"}

# Hosts that may never appear as an event source, whatever the roster says
# (the §13.4 rule: never LinkedIn, never 10times, never an attendee list,
# never a Google-News feed standing in for a dead organiser).
FORBIDDEN_HOSTS = ("linkedin.com", "10times.com", "news.google.com")


class Findings:
    def __init__(self):
        self.rows = []

    def __call__(self, where, msg):
        self.rows.append((where, msg))

    def __len__(self):
        return len(self.rows)


def host_of(url):
    try:
        return (urlparse(url).hostname or "").lower().lstrip(".")
    except ValueError:
        return ""


def same_site(a, b):
    """True when two hosts are the same registrable site (www./sub. tolerated)."""
    if not a or not b:
        return False
    if a == b:
        return True
    pa, pb = a.split("."), b.split(".")
    return pa[-2:] == pb[-2:] and (a.endswith(b) or b.endswith(a) or pa[-3:] == pb[-3:])


def load(path):
    if not path.exists():
        sys.exit(f"missing {path.relative_to(ROOT)}")
    return json.loads(path.read_text(encoding="utf-8"))


def company_slugs():
    return {p.name[: -len(".profile.json")] for p in PROFILER.glob("*.profile.json")}


def segment_ids(data=None):
    data = load(SEGMENTS) if data is None else data
    return {s["id"] for s in data.get("segments", [])}


SEAT_KEYS = ("storage-seller", "aidc-power-seller")


def check_seats(segments_doc, ids, f):
    """`seats` rules (E4 s1, developer-approved 2026-09-22): both seat keys
    present, each with a non-empty `segments[]`; every id in `segments[].id`;
    no duplicate id within one seat. Returns the count of seat segment ids."""
    seats = segments_doc.get("seats")
    if not isinstance(seats, dict):
        f("profiler-segments.json:seats", "missing or not an object — the score reads its seat segments here")
        return 0
    n = 0
    for key in SEAT_KEYS:
        at = f"profiler-segments.json:seats.{key}"
        if key not in seats:
            f(at, "seat missing")
            continue
        segs = (seats[key] or {}).get("segments") if isinstance(seats[key], dict) else None
        if not isinstance(segs, list) or not segs:
            f(at, "segments[] missing or empty")
            continue
        seen = set()
        for s in segs:
            if s not in ids:
                f(at, f"segment id {s!r} is not in segments[].id")
            if s in seen:
                f(at, f"duplicate segment id {s!r} within the seat")
            seen.add(s)
            n += 1
    for key in seats:
        if key not in SEAT_KEYS:
            f(f"profiler-segments.json:seats.{key}", "unknown seat key (the score reads storage-seller and aidc-power-seller)")
    return n


def check_roster(roster, f):
    """Roster rules: keys, enums, and the no-un-probed-row rule."""
    seen = set()
    for i, row in enumerate(roster.get("sources", [])):
        key = row.get("key", f"<row {i}>")
        at = f"events-sources.json:{key}"
        if not SLUG_RE.match(row.get("key", "")):
            f(at, f"key {row.get('key')!r} does not match ^[a-z0-9][a-z0-9-]{{0,63}}$")
        if row.get("key") in seen:
            f(at, "duplicate key")
        seen.add(row.get("key"))
        for field in ("name", "url", "notes"):
            if field not in row:
                f(at, f"missing {field}")
        if row.get("feedKind") not in FEED_KINDS:
            f(at, f"feedKind {row.get('feedKind')!r} not in {sorted(FEED_KINDS)}")
        if row.get("robots") not in ROBOTS:
            f(at, f"robots {row.get('robots')!r} not in {sorted(ROBOTS)}")
        if row.get("cadence") not in CADENCE:
            f(at, f"cadence {row.get('cadence')!r} not in {sorted(CADENCE)}")
        probe = row.get("lastProbe")
        if not isinstance(probe, dict):
            f(at, "no lastProbe — every roster row must be probed live before it is written")
            continue
        for field in ("at", "status", "itemCount", "newestItem"):
            if field not in probe:
                f(at, f"lastProbe missing {field}")
        if not DATE_RE.match(str(probe.get("at", ""))):
            f(at, f"lastProbe.at {probe.get('at')!r} is not YYYY-MM-DD")
        if not isinstance(probe.get("status"), int):
            f(at, "lastProbe.status must be the integer HTTP status")
        if "blocked" in row and not str(row["blocked"]).strip():
            f(at, "blocked is present but empty — it must carry a reason and a date")
    return seen


def check_events(registry, roster, segments, companies, today, f, fix_past):
    by_key = {r.get("key"): r for r in roster.get("sources", [])}
    fixed = 0
    seen = set()

    for i, e in enumerate(registry.get("events", [])):
        slug = e.get("slug", f"<row {i}>")
        at = f"events.json:{slug}"

        if not SLUG_RE.match(e.get("slug", "")):
            f(at, f"slug {e.get('slug')!r} does not match ^[a-z0-9][a-z0-9-]{{0,63}}$")
        if e.get("slug") in seen:
            f(at, "duplicate slug — a slug is a permanent identity")
        seen.add(e.get("slug"))

        for field in ("name", "series", "organiser", "kind", "start", "end", "tz",
                      "city", "region", "country", "website", "audience", "relevance",
                      "sources", "status", "lastUpdated"):
            if field not in e:
                f(at, f"missing required field {field}")

        if e.get("kind") not in KINDS:
            f(at, f"kind {e.get('kind')!r} not in {sorted(KINDS)}")
        if e.get("status") not in STATUSES:
            f(at, f"status {e.get('status')!r} not in {sorted(STATUSES)}")

        start, end = e.get("start", ""), e.get("end", "")
        for label, value in (("start", start), ("end", end)):
            if not DATE_RE.match(str(value)):
                f(at, f"{label} {value!r} is not YYYY-MM-DD")
        if DATE_RE.match(str(start)) and DATE_RE.match(str(end)) and start > end:
            f(at, f"start {start} is after end {end}")

        tz = e.get("tz", "")
        if ZoneInfo is None:
            pass
        else:
            try:
                ZoneInfo(tz)
            except (ZoneInfoNotFoundError, ValueError, KeyError):
                f(at, f"tz {tz!r} is not a known IANA time-zone name")

        if not isinstance(e.get("relevance"), int) or not 1 <= e.get("relevance", 0) <= 5:
            f(at, f"relevance {e.get('relevance')!r} must be an integer 1-5")

        aud = e.get("audience") or []
        if not aud:
            f(at, "audience[] must carry at least one segment id")
        for seg in aud:
            if seg not in segments:
                f(at, f"audience id {seg!r} is not in profiler-segments.json")

        # speakersWidget — the roster at speakersUrl is a third-party widget
        # the sweep cannot read, so the event is exhibitor-only (2026-09-25)
        if "speakersWidget" in e:
            if e.get("speakersWidget") not in SPEAKERS_WIDGETS:
                f(at, f"speakersWidget {e.get('speakersWidget')!r} not in {sorted(SPEAKERS_WIDGETS)}")
            if not e.get("speakersUrl"):
                f(at, "speakersWidget without a speakersUrl — the flag names the page it skips")

        if not DATE_RE.match(str(e.get("lastUpdated", ""))):
            f(at, f"lastUpdated {e.get('lastUpdated')!r} is not YYYY-MM-DD")

        # --- sources -------------------------------------------------------
        srcs = e.get("sources") or []
        if not srcs:
            f(at, "sources[] must carry at least one row")
        for s in srcs:
            key, url = s.get("sourceKey"), s.get("url", "")
            if s.get("kind") not in SOURCE_KINDS:
                f(at, f"sources[].kind {s.get('kind')!r} not in {sorted(SOURCE_KINDS)}")
            if not DATE_RE.match(str(s.get("lastConfirmed", ""))):
                f(at, f"sources[{key}].lastConfirmed {s.get('lastConfirmed')!r} is not YYYY-MM-DD")
            if key not in by_key:
                f(at, f"sources[].sourceKey {key!r} is not in the roster")
                continue
            if not same_site(host_of(url), host_of(by_key[key].get("url", ""))):
                f(at, f"sources[{key}].url host {host_of(url)!r} is not the roster row's host "
                      f"{host_of(by_key[key].get('url', ''))!r}")
            if any(host_of(url).endswith(bad) for bad in FORBIDDEN_HOSTS):
                f(at, f"sources[{key}].url host {host_of(url)!r} is never an allowed event "
                      f"source (LinkedIn, 10times, Google News, attendee lists)")
        if e.get("status") == "confirmed" and not any(
                s.get("kind") != "manual" for s in srcs):
            f(at, "status is confirmed but every source is `manual` — a row is confirmed "
                  "only on an organiser page that was actually read")

        # --- mentions ------------------------------------------------------
        for m in e.get("mentions") or []:
            if m.get("slug") not in companies:
                f(at, f"mentions[].slug {m.get('slug')!r} does not resolve to a dossier")
            if m.get("where") not in WHERE:
                f(at, f"mentions[].where {m.get('where')!r} not in {sorted(WHERE)}")

        # --- past ----------------------------------------------------------
        if DATE_RE.match(str(end)) and e.get("status") != "cancelled":
            should_be_past = end < today
            is_past = e.get("status") == "past"
            if should_be_past and not is_past:
                if fix_past:
                    e["status"] = "past"
                    fixed += 1
                else:
                    f(at, f"end {end} is before today ({today}) but status is "
                          f"{e.get('status')!r} — run --fix-past")
            elif is_past and not should_be_past:
                if fix_past:
                    e["status"] = "tentative"
                    fixed += 1
                else:
                    f(at, f"status is past but end {end} is not before today ({today})")
    return fixed


UID_HOST = "events.lightaisolutions.github.io"


def check_ics(registry, f):
    """The .ics walk (E1 session 2). The published calendar is required, must
    parse as RFC 5545 text — CRLF line ends, no line over 75 octets, one
    VEVENT per `confirmed` event with UID / DTSTART / SUMMARY — and must agree
    with the registry: the UID set equals the confirmed slugs (stable
    `<slug>@` + UID_HOST), and each VEVENT's DTSTART and STATUS match its row.
    Rebuild with `python3 scripts/build-events-ics.py` after any registry write."""
    if not ICS.exists():
        f("events.ics", "missing — run python3 scripts/build-events-ics.py")
        return 0
    raw = ICS.read_bytes()
    text = raw.decode("utf-8", errors="replace")
    if b"\n" in raw and b"\r\n" not in raw:
        f("events.ics", "line ends are LF — RFC 5545 wants CRLF")
    bare = raw.replace(b"\r\n", b"").count(b"\n")
    if bare:
        f("events.ics", f"{bare} bare LF line end(s) — every line must end in CRLF")
    for n, line in enumerate(raw.split(b"\r\n"), 1):
        if len(line) > 75:
            f("events.ics", f"line {n} is {len(line)} octets — fold at 75")
            break
    # unfold RFC 5545 continuation lines before walking
    lines = re.sub(r"\r?\n[ \t]", "", text).splitlines()
    if not lines or lines[0].strip() != "BEGIN:VCALENDAR":
        f("events.ics", "does not begin with BEGIN:VCALENDAR")
    if lines and lines[-1].strip() != "END:VCALENDAR":
        f("events.ics", "does not end with END:VCALENDAR")
    if not any(l.startswith("X-WR-CALNAME:") for l in lines):
        f("events.ics", "no X-WR-CALNAME (the calendar-level name)")
    depth, count, uids = 0, 0, set()
    fields, events = {}, {}
    for n, raw_line in enumerate(lines, 1):
        line = raw_line.strip()
        if line == "BEGIN:VEVENT":
            if depth:
                f("events.ics", f"line {n}: nested BEGIN:VEVENT")
            depth, fields = 1, {}
            continue
        if line == "END:VEVENT":
            if not depth:
                f("events.ics", f"line {n}: END:VEVENT without BEGIN")
            for required in ("UID", "DTSTART", "SUMMARY"):
                if required not in fields:
                    f("events.ics", f"VEVENT ending at line {n} has no {required}")
            uid = fields.get("UID", "")
            if uid in uids:
                f("events.ics", f"VEVENT ending at line {n}: duplicate UID {uid}")
            uids.add(uid)
            events[uid] = fields
            depth, count = 0, count + 1
            continue
        if depth and ":" in line:
            name = line.split(":", 1)[0].split(";", 1)[0].upper()
            fields[name] = line.split(":", 1)[1]
    if depth:
        f("events.ics", "a VEVENT is never closed")
    # agreement with the registry
    confirmed = {e["slug"]: e for e in registry.get("events", []) if e.get("status") == "confirmed"}
    expected = {f"{slug}@{UID_HOST}" for slug in confirmed}
    for uid in sorted(expected - uids):
        f("events.ics", f"confirmed event {uid.split('@')[0]} has no VEVENT — rebuild")
    for uid in sorted(uids - expected):
        f("events.ics", f"VEVENT {uid} is not a confirmed registry event — rebuild")
    for uid in sorted(expected & uids):
        row, ve = confirmed[uid.split("@")[0]], events[uid]
        if ve.get("DTSTART") != str(row.get("start", "")).replace("-", ""):
            f("events.ics", f"{uid}: DTSTART {ve.get('DTSTART')} ≠ registry start {row.get('start')}")
        if ve.get("STATUS", "CONFIRMED") != "CONFIRMED":
            f("events.ics", f"{uid}: STATUS {ve.get('STATUS')} on a confirmed row")
    return count


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--fix-past", action="store_true",
                    help="flip stale `status` values to/from `past` and write the file back; "
                         "changes nothing else")
    ap.add_argument("--quiet", action="store_true", help="print findings only")
    args = ap.parse_args()

    registry, roster = load(EVENTS), load(SOURCES)
    for name, doc in (("events.json", registry), ("events-sources.json", roster)):
        if doc.get("schemaVersion") != 1:
            print(f"{name}: schemaVersion must be 1", file=sys.stderr)
            return 1
        if not doc.get("built"):
            print(f"{name}: missing `built`", file=sys.stderr)
            return 1

    today = datetime.date.today().isoformat()
    f = Findings()
    check_roster(roster, f)
    segments_doc = load(SEGMENTS)
    ids = segment_ids(segments_doc)
    fixed = check_events(registry, roster, ids, company_slugs(), today, f, args.fix_past)
    vevents = check_ics(registry, f)
    seat_ids = check_seats(segments_doc, ids, f)

    # orphan roster rows are a warning surface, not a finding: a blocked row is
    # kept on purpose so it is never re-proposed, even with no event citing it.
    cited = {s.get("sourceKey") for e in registry.get("events", []) for s in e.get("sources") or []}
    orphans = [r["key"] for r in roster.get("sources", []) if r["key"] not in cited]

    if args.fix_past and fixed:
        EVENTS.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
                          encoding="utf-8")

    if f:
        print(f"check-events-registry: {len(f)} finding(s)", file=sys.stderr)
        for where, msg in f.rows:
            print(f"  {where}: {msg}", file=sys.stderr)
        return 1

    if not args.quiet:
        ev = registry["events"]
        by_status = {}
        for e in ev:
            by_status[e["status"]] = by_status.get(e["status"], 0) + 1
        blocked = [r["key"] for r in roster["sources"] if "blocked" in r]
        mentions = sum(len(e.get("mentions") or []) for e in ev)
        print(f"OK  {len(ev)} events ("
              + ", ".join(f"{n} {s}" for s, n in sorted(by_status.items())) + ")")
        print(f"OK  {len(roster['sources'])} roster rows, all probed; "
              f"{len(blocked)} blocked: {', '.join(sorted(blocked))}")
        print(f"OK  {mentions} corpus mentions across "
              f"{len([e for e in ev if e.get('mentions')])} events")
        print(f"OK  events.ics parses and agrees with the registry: {vevents} VEVENT(s), "
              f"one per confirmed event")
        print(f"OK  profiler-segments.json seats: both seats present, {seat_ids} segment ids, "
              f"all in segments[].id, none duplicated within a seat")
        if orphans:
            print(f"note  {len(orphans)} roster row(s) cited by no event "
                  f"(expected for blocked rows kept so they are not re-proposed): "
                  f"{', '.join(sorted(orphans))}")
        if args.fix_past:
            print(f"--fix-past: {fixed} status value(s) changed")
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Developed by: LightAISolutions
