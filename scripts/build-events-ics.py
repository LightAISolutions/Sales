#!/usr/bin/env python3
"""Build the published calendar — live-site-pages/events-data/events.ics — from the registry.

E1 session 2 (NETWORK-EVENTS-DESIGN-PLAN.md §13.7 step 5; EVENTS-SCHEMA.md §9).
Every `confirmed` row of `events-data/events.json` becomes one VEVENT, and the
text is byte-compatible with the per-event `.ics` the page writes: the same
header lines as `evIcs()` in Events.html and, per event, the same field order,
escaping, 75-octet folding and CRLF line ends as `evVevent()`. UIDs are
`<slug>@events.lightaisolutions.github.io` — stable across rebuilds so a
calendar that subscribed once updates instead of duplicating.

The file is served beside the page (a relative fetch — never a GitHub host)
and offered on the masthead as a `webcal://` subscription.

  python3 scripts/build-events-ics.py                 # write events.ics
  python3 scripts/build-events-ics.py --check         # exit 1 when events.ics is stale (DTSTAMP ignored)
  python3 scripts/build-events-ics.py --stamp 20260922T060000Z   # fixed DTSTAMP (reproducible build)

`scripts/check-events-registry.py` walks the published file against the
registry after every write; `events sync` (E2) rebuilds it.

Developed by: LightAISolutions
"""

import argparse
import datetime
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "live-site-pages" / "events-data"
EVENTS = DATA / "events.json"
ICS = DATA / "events.ics"

# Mirrors of the page-side constants (Events.html, PROJECT region) — keep the
# two in step: the published file must read exactly as the per-event download.
UID_HOST = "events.lightaisolutions.github.io"
PRODID = "-//LightAISolutions//Events//EN"
CALNAME = "BESS/AIDC events"
KIND_LABELS = {"mega": "Mega", "conference": "Conference", "regional": "Regional", "social": "Social",
               "corporate-summit": "Corporate summit", "webinar": "Webinar"}
STATUS_ICS = {"cancelled": "CANCELLED", "tentative": "TENTATIVE"}


def ics_escape(s):
    """RFC 5545 §3.3.11 text escaping — the same four replacements as evIcsEscape()."""
    s = "" if s is None else str(s)
    return (s.replace("\\", "\\\\").replace(";", "\;").replace(",", "\\,")
             .replace("\r\n", "\\n").replace("\n", "\\n"))


def ics_date(s):
    return str(s or "").replace("-", "")


def add_days(s, n):
    try:
        d = datetime.date.fromisoformat(str(s))
    except ValueError:
        return str(s)
    return (d + datetime.timedelta(days=n)).isoformat()


def fold(line):
    """Fold at 75 OCTETS (not characters); a continuation line starts with one
    space and so carries 74 octets of content. Multi-byte characters are never
    split — the walk is per code point, as evIcsFold() keeps surrogate pairs."""
    out, cur, cur_bytes = [], "", 0
    for ch in line:
        n = len(ch.encode("utf-8"))
        limit = 74 if out else 75
        if cur_bytes + n > limit:
            out.append(cur)
            cur, cur_bytes = ch, n
        else:
            cur += ch
            cur_bytes += n
    out.append(cur)
    return "\r\n".join((" " if i else "") + l for i, l in enumerate(out))


def description(e):
    parts = [e.get("organiser") or "", KIND_LABELS.get(e.get("kind"), e.get("kind") or "")]
    if e.get("tierNote"):
        parts.append(e["tierNote"])
    if e.get("registrationUrl"):
        parts.append("Register: " + e["registrationUrl"])
    return "\n".join(p for p in parts if p)


def location(e):
    return ", ".join(p for p in (e.get("venue"), e.get("city"), e.get("region"), e.get("country")) if p)


def vevent(e, stamp):
    lines = [
        "BEGIN:VEVENT",
        "UID:" + e["slug"] + "@" + UID_HOST,
        "DTSTAMP:" + stamp,
        "LAST-MODIFIED:" + ics_date(e.get("lastUpdated") or e.get("start")) + "T000000Z",
        "DTSTART;VALUE=DATE:" + ics_date(e.get("start")),
        "DTEND;VALUE=DATE:" + ics_date(add_days(e.get("end") or e.get("start"), 1)),
        "SUMMARY:" + ics_escape(e.get("name")),
        "LOCATION:" + ics_escape(location(e)),
        "URL:" + str(e.get("website") or ""),
        "DESCRIPTION:" + ics_escape(description(e)),
        "CATEGORIES:" + ",".join(ics_escape(a) for a in (e.get("audience") or [])),
        "STATUS:" + STATUS_ICS.get(e.get("status"), "CONFIRMED"),
        "END:VEVENT",
    ]
    return "\r\n".join(fold(l) for l in lines)


def calendar(events, stamp):
    head = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:" + PRODID, "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
            "X-WR-CALNAME:" + ics_escape(CALNAME)]
    body = "\r\n".join(fold(l) for l in head)
    for e in events:
        body += "\r\n" + vevent(e, stamp)
    return body + "\r\nEND:VCALENDAR\r\n"


def published_events(registry):
    rows = [e for e in registry.get("events", []) if e.get("status") == "confirmed"]
    rows.sort(key=lambda e: (e.get("start", ""), e.get("slug", "")))
    return rows


def without_stamp(text):
    return "\r\n".join(l for l in text.split("\r\n") if not l.startswith("DTSTAMP:"))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--check", action="store_true", help="compare events.ics to a fresh build (DTSTAMP ignored); exit 1 when stale")
    ap.add_argument("--stamp", help="DTSTAMP to write (YYYYMMDDTHHMMSSZ); default is now (UTC)")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    if not EVENTS.exists():
        sys.exit(f"missing {EVENTS.relative_to(ROOT)}")
    registry = json.loads(EVENTS.read_text(encoding="utf-8"))
    stamp = args.stamp or datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    rows = published_events(registry)
    text = calendar(rows, stamp)

    if args.check:
        if not ICS.exists():
            print(f"build-events-ics --check: {ICS.relative_to(ROOT)} is missing — run the builder", file=sys.stderr)
            return 1
        current = ICS.read_bytes().decode("utf-8")
        if without_stamp(current) != without_stamp(text):
            print(f"build-events-ics --check: {ICS.relative_to(ROOT)} is stale against events.json — run the builder",
                  file=sys.stderr)
            return 1
        if not args.quiet:
            print(f"OK  events.ics is current: {len(rows)} confirmed events")
        return 0

    ICS.write_bytes(text.encode("utf-8"))
    if not args.quiet:
        longest = max(len(l.encode("utf-8")) for l in text.split("\r\n"))
        print(f"wrote {ICS.relative_to(ROOT)}: {len(rows)} confirmed of {len(registry.get('events', []))} events, "
              f"{len(text.encode('utf-8'))} bytes, longest line {longest} octets, DTSTAMP {stamp}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Developed by: LightAISolutions
