#!/usr/bin/env python3
"""Print only the calendar rows a Profiler Routine actually needs.

Why this exists: repository-information/profiler-refresh-calendar.json is ~384 KB
(~96,000 tokens) across 177 rows. A run acts on a handful of them. Reading the file
whole parks ~96K tokens in context for the life of the run and is re-read on every
turn, which measured at ~29% of the 2026-09-21 run's cache-read bill. It is also
2,573 lines against the Read tool's 2,000-line default, so a plain Read silently
truncates the tail of the queue.

  --desk        the earnings desk's queue: <=3 due rows oldest first, carry-over,
                the unconfirmed-within-7-days set, and the counts the stand-down
                report requires.
  --quarterly   the quarterly sweep's queue: cadence rows (no nextReport) whose
                tier is due, so coverage is a property of the DATA and not of a
                hardcoded company list inside a Routine prompt.

Developed by: LightAISolutions
"""
import argparse, datetime, json, pathlib, sys

CAL = pathlib.Path(__file__).resolve().parent.parent / "repository-information" / "profiler-refresh-calendar.json"
TIER_DAYS = {"core": 90, "watch": 180}


def load():
    with CAL.open(encoding="utf-8") as fh:
        return json.load(fh)["companies"]


def desk(rows, today):
    t, horizon = today.isoformat(), (today + datetime.timedelta(days=7)).isoformat()
    public = [r for r in rows if r.get("nextReport")]
    due = sorted((r for r in public if r["nextReport"] < t), key=lambda r: r["nextReport"])
    return {
        "mode": "desk", "today": t, "totalRows": len(rows),
        "publicRows": len(public), "quarterlyRows": len(rows) - len(public),
        "dueCount": len(due),
        "take": [r["slug"] for r in due[:3]],
        "carryOver": [r["slug"] for r in due[3:]],
        "due": due[:3],
        "unconfirmedWithin7d": [r for r in public if t <= r["nextReport"] <= horizon and not r.get("confirmed")],
        "nextUpcoming": min([r["nextReport"] for r in public if r["nextReport"] >= t] or ["-"]),
    }


def quarterly(rows, today, tier=None):
    cadence = [r for r in rows if not r.get("nextReport")]
    out, untiered = [], []
    for r in cadence:
        rt = r.get("tier")
        if rt is None:
            untiered.append(r["slug"])
            continue
        if tier and rt != tier:
            continue
        lr = r.get("lastRefreshed")
        age = (today - datetime.date.fromisoformat(lr)).days if lr else None
        if age is None or age >= TIER_DAYS.get(rt, 180):
            out.append({**r, "ageDays": age})
    out.sort(key=lambda r: (-(r["ageDays"] or 10**6), r["slug"]))
    return {
        "mode": "quarterly", "today": today.isoformat(), "tierFilter": tier,
        "cadenceRows": len(cadence), "dueCount": len(out),
        "untieredRows": untiered,
        "due": out,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--desk", action="store_true")
    g.add_argument("--quarterly", action="store_true")
    ap.add_argument("--tier", choices=sorted(TIER_DAYS), help="restrict --quarterly to one tier")
    ap.add_argument("--slugs-only", action="store_true", help="print slugs, not whole rows")
    a = ap.parse_args()
    rows, today = load(), datetime.date.today()
    res = desk(rows, today) if a.desk else quarterly(rows, today, a.tier)
    if a.slugs_only:
        res = {k: v for k, v in res.items() if k != "due"} | {"dueSlugs": [r["slug"] for r in res["due"]]}
    json.dump(res, sys.stdout, indent=1)
    print()


if __name__ == "__main__":
    main()

# Developed by: LightAISolutions
