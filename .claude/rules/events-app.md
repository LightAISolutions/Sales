---
paths:
  - "live-site-pages/Events.html"
  - "googleAppsScripts/Events/Events.gs"
  - "live-site-pages/events-data/**"
  - "repository-information/EVENTS-SCHEMA.md"
---

# Events App — the `events sync` Command

*Path-scoped: auto-injects when working on the Events app or its data. Also user-triggered on demand — the command below fires whenever the user says **"events sync"** (or "sync events", "apply the approved proposals", "apply the events JSON"), regardless of which files are loaded. Cross-referenced from CLAUDE.md ("Events Sync Command" section). Design: `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md` §5.3 (E2); shapes: `repository-information/EVENTS-SCHEMA.md` §3, §4, §5, §7.*

## Why this is a session command

The weekly poller in `Events.gs` (`evPollRun_`, reached by the `evPollTick` trigger and by the admin's **Poll now**) reads every readable roster feed and **proposes** diffs into the private `Proposed` tab. It never writes the registry: `live-site-pages/events-data/events.json` is a repo file, a GAS trigger cannot commit, and a fired session cannot push (the Routines lesson in `profiler-app.md`). So the approved rows come back to the repo through this command, run by the developer in an interactive session, which applies them, proves the result and commits. **The session never calls the app** — no `UrlFetchApp`, no bridge token, no `curl` against the deployment; it works from the JSON the developer pastes (or reads from the spreadsheet through the Google Drive connector when that read is available — try it, report whether it worked, do not depend on it).

## The input

The Proposed tab's **Copy as JSON** button puts this on the clipboard (the same text sits in the panel's field for copying by hand):

```json
{ "schemaVersion": 1, "exported": "<ISO>",
  "proposals": [ { "id": "pr-…", "sourceKey": "…", "slug": "…", "change": "moved-dates|changed-venue|changed-url|cancelled|new-edition|new-event",
                   "before": { … }, "after": { … }, "evidenceUrl": "…", "seenAt": "<ISO>", "decidedAt": "<ISO>" } ],
  "polls": [ { "sourceKey": "…", "ranAt": "<ISO>", "status": "200", "items": 12, "newest": "YYYY-MM-DD" } ] }
```

Only `approved` rows are exported. If the developer pastes nothing and the Drive connector is attached, the Events spreadsheet's `Proposed` tab (columns per `EVENTS-SCHEMA.md` §7) can be read for rows with `Status = approved` and the `Polls` tab for the last outcome per source — the same shape results. Refuse the run (and say why) when the input has no `proposals[]`, when `schemaVersion` is not 1, or when any row's `change` is off the six-value list.

## The procedure

> **Every step, in order. A failing gate reverts the working tree for the two data files and the `.ics` — nothing is ever committed half-applied.**

1. **Pin the clone** — `git fetch --unshallow origin main || true` (the Session Start rule; the CHANGELOG and README dates read from git must not be the shallow boundary's).
2. **Read** `events.json`, `events-sources.json` and the JSON input. Build `bySlug` from the registry. For each proposal, locate the row by `slug` (for `new-edition` / `new-event` the slug must **not** exist yet; for the other four it **must**). A row that cannot be located is reported and skipped — it is not invented.
3. **Apply each row** to `events.json`, the field the `change` names and nothing else:
   - `moved-dates` → `start`, `end` from `after`
   - `changed-venue` → `venue` (and `city` when `after` carries one)
   - `changed-url` → `website`
   - `cancelled` → `status: "cancelled"`
   - `new-edition` → append `after` as a new row in the §3 shape: the poller seeded `series`, `organiser`, `kind`, `tz` from the previous edition; copy `audience[]`, `relevance`, `region`, `country` (and `venueLatLng` when the venue is unchanged) from that previous edition (the slug in `before.slug`); the new row's `editions[]` lists the **previous** edition's `{ year, start, end, city, venue }` first, followed by whatever the previous row's own `editions[]` carried; `status` stays `tentative` until an organiser page has been read in a session; `lastUpdated` = today
   - `new-event` → append `after` as a new row: `series` (the name without its year), `organiser`, `kind`, `tz`, `region`, `country`, `audience[]` (≥ 1 segment id from `profiler-segments.json`) and `relevance` (1–5) are **the session's to fill by reading the evidence URL** — never invented from the name alone; when the page cannot be read, fill what the evidence JSON carries, mark the rest with the best reading and keep `status: "tentative"`; `lastUpdated` = today
   - **Every applied row**: `lastUpdated` = today (`YYYY-MM-DD`); the `sources[]` entry whose `sourceKey` matches the proposal gets `lastConfirmed` = `seenAt`'s date (add the entry when the row does not cite that key yet — `kind` from the roster row's `feedKind`, `url` = `evidenceUrl`; the checker requires the URL's host to be the roster row's host)
   - A row that was `tentative` because its only source was `manual` and now carries a `jsonld` / `ics` source it was confirmed against may be promoted to `confirmed` **only for `moved-dates` / `changed-venue` / `changed-url` proposals** — the organiser's own feed was read. `new-edition` / `new-event` rows stay `tentative`.
4. **Advance the roster** — for every `polls[]` entry, set that roster row's `lastProbe` to `{ at: ranAt's date, status: Number(status) or 0, itemCount: items, newestItem: newest }`. Never touch `blocked`, `feedKind`, `cadence`, `robots` or `notes`; never add a roster row (that is the E0 / R procedure — probe live first, per `scraper-sources.md`).
5. **Sort and stamp** — `events.json`'s `events[]` sorted by `start` then `slug`; `built` on both files = now (ISO, UTC); 2-space indent, `ensure_ascii=False`, trailing newline (the files are written by Python — `json.dump(..., indent=2, ensure_ascii=False)`).
6. **Rebuild the calendar** — `python3 scripts/build-events-ics.py`.
7. **The gate** — `python3 scripts/check-events-registry.py` must exit **0**. On any finding: `git checkout -- live-site-pages/events-data/events.json live-site-pages/events-data/events-sources.json live-site-pages/events-data/events.ics`, print the findings and stop. Do not commit a partial apply, do not "fix" a finding by dropping a proposal silently — report which proposal caused it so the developer can reject it in the panel. `python3 scripts/extract-corpus-events.py --check` (when present) confirms `mentions[]` is untouched.
8. **Report** — in the SUMMARY, list every `pr-` id applied (and every id skipped, with the reason) and the **repo version this push becomes** (the bumped `repository.version.txt`). The developer types that version into the panel's **Mark applied** box; the app stamps the rows `applied` with it. The session does not stamp the rows — that write is the app's, through `eop=applied`.
9. **Commit and push** under the normal Pre-Commit and Pre-Push checklists: a CHANGELOG entry naming the slugs changed and the roster rows advanced (counts only for the audit; never a spreadsheet id, a token or a trigger id), the README tree untouched unless a file was added, and `[PC-HTML-VERSION] #2` / `[PC-GS-VERSION] #1` **not** fired — the app files do not change in a sync.

## What the command never does

- Never fetches an organiser page as a poll — it may read an evidence URL to fill a `new-event` row's fields, and says so in the SUMMARY with the date
- Never writes `mentions[]` (only `scripts/extract-corpus-events.py` does)
- Never adds a roster row, unblocks a blocked row or substitutes a feed
- Never calls the deployed app — no `eop=…`, no peer token; `EVENTS_PEER_TOKEN` and `NETWORK_PEER_TOKEN` are never widened for a session
- Never promotes a `new-edition` / `new-event` row to `confirmed`

## Hand-off after the first live cycle

The poller's first live run is the developer's: redeploy `Events.gs`, open the **Proposed** tab, tap **Install poller** (the first `ScriptApp.newTrigger` asks for the script's own authorisation — accept it in the Apps Script editor if the panel reports a scope error, then tap again), tap **Poll now**, approve one row, then run `events sync` in a fresh session with the copied JSON. The registry's E0 note about COMPUTEX (`robots: disallowed`) holds: the poller skips that row, and this command never writes it.

Developed by: LightAISolutions
