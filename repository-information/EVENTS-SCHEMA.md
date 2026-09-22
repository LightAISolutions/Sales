# Events App — Data Schema

**Single source of truth** for the Events app's data shapes: the public event registry and source roster on Pages, the private per-account tabs, the recommendation score and its default weights, the poller's `Proposed` diff row, the peer ops, the ICS and Add-to-Google-Calendar mappings, and the venue lookup. The design these shapes implement is `NETWORK-EVENTS-DESIGN-PLAN.md` (gate NE0 held 2026-09-19 → 20); the Network counterpart is `NETWORK-SCHEMA.md`; the registry pattern is `PROFILER-SCHEMA.md` → "Named-projects registry". Build sessions (E0–E5) edit **this file first, then the data and the code**.

**The public/private line, stated once (D3).** The **event registry** (`live-site-pages/events-data/events.json`), the **source roster** (`events-sources.json`) and the published `events.ics` are public-safe and deploy with the site, exactly as `profiler-projects.json` does — they reveal which shows the corpus tracks and nothing else. **Everything about the developer** — stars, notes, plans, meetings, attendance signals about named people, the `Proposed` queue and the `Tuning` weights — lives in Events' own spreadsheet behind the Master ACL, served only by `Events.gs`. Nothing private is ever derived into a Pages file; `mentions[]` is built from public dossiers only.

## Contents

1. Id and slug rules
2. Access model (D7)
3. The public registry — `events.json`
4. The source roster — `events-sources.json`
5. Private tabs — `Stars`, `Plans`, `Meetings`, `Proposed`, `Tuning`
6. The recommendation score (E3) — terms and default weights
7. The `Proposed` diff row and `events sync` (E2)
8. Peer ops — `eop=today|starred|signals` (the bridge)
9. ICS and Add-to-Google-Calendar mappings
10. Venues (D12 — Overpass)
11. The corpus-count corollary and what is never taught
12. Checkers

## 1 · Id and slug rules

- **Event slugs** are permanent identities: `^[a-z0-9][a-z0-9-]{0,63}$`, the series name plus the year — `re-plus-2026`, `distributech-2027`, `7x24-exchange-fall-2026`, `imasons-texas-energy-update-2026-11`. An annual show is **one slug per edition**; the `series` field ties editions together and `editions[]` on the current row lists the past ones. A slug never changes; a renamed show keeps its slug and updates `name` (the Profiler rename rule)
- **Source keys** in the roster: `^[a-z0-9][a-z0-9-]{0,63}$`, one per organiser feed — `informa-battery-show`, `7x24-exchange-ics`, `luma-imasons-austin`
- **Private row ids** are opaque and random, the Network rule (`NETWORK-SCHEMA.md` §1): `st-` Star · `pl-` Plan · `mt-` Meeting · `pr-` Proposed diff, 13 base36 characters, `EV_ID_RE`
- A Network `a-` / `c-` id in an Events row is a foreign key held only in the private tabs; it never appears in a Pages file

## 2 · Access model (D7 — decided admin-only 2026-09-20)

`EV_ROLE_CAPS` carries all four tier keys so that widening later is a map edit, but **only `admin` is admitted**; `evAdmitted_(sess)` is `role === 'admin'`, every other tier is turned away at the door with an audit entry, and `scripts/verify-events-roles.py` asserts it against the live page. The capabilities exist so the map reads the same as Network's and Classroom's: `calendar` (registry, detail, stars, notes, ICS) · `recommend` (the score and its "why" panel — names Network contacts) · `plans` (day plans, meetings, the post-event checklist) · `signals` (the E4 sweeps and the manual path) · `roster` (the source roster, the poller controls, `Proposed` approval) · `tuning` (the weights). All admin in v1. Stars, notes, plans and meetings are owner-scoped rows (the Receipts `Owner` column), which is the widening path; `Shares` and `Profiles` are created by `ensureEventsTabs_()` and have no UI in v1.

## 3 · The public registry — `live-site-pages/events-data/events.json`

`{ schemaVersion: 1, built: "<ISO>", events: [ … ] }`, events sorted by `start` then `slug`. Written by `scripts/extract-corpus-events.py` (seed rows + `mentions[]`), by the E0 research session (verification and the sub-mega tier), and afterwards only by the `events sync` command applying approved `Proposed` diffs — never by GAS.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `slug` | string | yes | Per §1 |
| `name` | string | yes | Display name for this edition ("RE+ 2026") |
| `series` | string | yes | The recurring show's name ("RE+") — the grouping key across editions |
| `organiser` | string | yes | As the organiser names itself |
| `kind` | enum | yes | `mega` · `conference` · `regional` · `social` · `corporate-summit` · `webinar` (Appendix A's tiers M · C · R · S plus the two the corpus names) |
| `start` · `end` | `YYYY-MM-DD` | yes | Local dates of the edition; one-day events have `start` = `end` |
| `tz` | IANA tz | yes | `America/Los_Angeles` … — needed for the ICS and the day plan |
| `city` · `region` · `country` | string | yes | Region is the state or province code (`NV`), country ISO 3166-1 alpha-2 |
| `venue` | string | no | Venue name as the organiser prints it |
| `venueLatLng` | `[lat, lng]` | no | Set by E0 from the organiser page or a geocode the session verifies; drives the Overpass venue lookup |
| `website` | URL | yes | The edition's own page |
| `registrationUrl` · `exhibitorListUrl` · `agendaUrl` · `speakersUrl` · `floorPlanUrl` | URL | no | Where published; the E4 diffs read `exhibitorListUrl` and `speakersUrl` |
| `audience[]` | string[] | yes | Segment ids from `profiler-segments.json` this show serves (≥ 1); the score's segment-fit input |
| `relevance` | 1–5 | yes | Appendix A's Rel column: relevance to a BESS/AIDC seller, set at E0 and revised by hand |
| `tierNote` | string | no | One line on who attends and why it matters ("vendors excluded — end users only") |
| `hours[]` | `[{ date, open, close }]` | no | Show-floor hours per day, local time `HH:MM`; the day plan's frame |
| `editions[]` | `[{ year, start, end, city, venue }]` | no | Past editions, newest first |
| `sources[]` | `[{ sourceKey, kind ∈ jsonld\|ics\|html\|manual, url, lastConfirmed }]` | yes (≥ 1) | Every row's `sourceKey` must exist in the roster; `lastConfirmed` is the date a human or the poller last read the organiser's own page |
| `mentions[]` | `[{ slug, where }]` | derived | Dossiers that name the event — `where` ∈ `developments` · `products` · `specs` · `sources` · `strategy`; **written only by `extract-corpus-events.py`**, never by hand |
| `status` | enum | yes | `confirmed` · `tentative` · `cancelled` · `past`; `past` is set by the checker when `end` < today |
| `lastUpdated` | `YYYY-MM-DD` | yes | Last revision of this row |

Appendix A's 64 rows plus the 31 corpus events are E0's input; the registry carries the union after verification. A (U)-sourced row stays `tentative` until an organiser page has been read.

## 4 · The source roster — `live-site-pages/events-data/events-sources.json`

`{ schemaVersion: 1, built, sources: [ … ] }`, one row per organiser feed or page, the `scraper-sources.md` discipline verbatim: **probe live before adding**, record every unavailable source with its reason so it is never re-proposed, never substitute a Google-News feed for a dead source.

| Field | Type | Meaning |
|---|---|---|
| `key` | string | Per §1 |
| `name` | string | Organiser or feed name |
| `url` | URL | The feed or page the poller reads |
| `feedKind` | enum | `jsonld` (an `Event` object in `<script type="application/ld+json">`) · `ics` · `html` (the poller does not parse it; hand-maintained) · `manual` |
| `robots` | enum | `allowed` · `disallowed` · `unknown` — read from `/robots.txt` at probe time for the fetched path |
| `cadence` | enum | `weekly` · `monthly` · `manual` |
| `lastProbe` | `{ at, status, itemCount, newestItem }` | The last live probe: HTTP status, how many `Event` objects or `VEVENT`s, the newest `start` seen |
| `blocked` | string | Present when the source cannot be fetched by `UrlFetchApp`: the reason (`cloudflare-challenge`, `403-non-browser`, `partner-only-tos`, `no-feed`) and the date, e.g. `"cloudflare-challenge 2026-09-20"`. A blocked row is kept, struck through in the admin roster, and its events are hand-maintained |
| `notes` | string | One line |

Known at the gate (probed 2026-09-20 in the proposal's research pass): JSON-LD present on The Battery Show NA, DISTRIBUTECH, Data Center World, POWERGEN, Yotta, Intersolar/ESNA; ICS on 7x24 Exchange, the International Battery Seminar, Luma calendars; **blocked** — 10times (Cloudflare + partner-only ToS), DCD, OCP, Enlit (403 to non-browser clients). E0 re-probes every row before writing it.

## 5 · Private tabs (`Events.gs` — `ensureEventsTabs_()`)

All owner-scoped; timestamps ISO-8601 UTC; every list op filters `Deleted At` empty where the tab has it.

| Tab | Columns |
|---|---|
| `Stars` | Star ID (`st-`) · Owner · Event Slug · Note · Attending ∈ `planning` · `registered` · `attended` · `skipped` · Created At · Updated At |
| `Plans` | Plan ID (`pl-`) · Owner · Event Slug · Day (`YYYY-MM-DD`) · Items (JSON — the ranked visits and open slots, §6 and the plan's §5.6) · Narrative Link (Drive URL of the `events plan` file, optional) · Created At · Updated At |
| `Meetings` | Meeting ID (`mt-`) · Owner · Event Slug · Contact ID (`c-`, Network) · Account ID (`a-`) · Start · End (ISO, event tz) · Place · Note · ICS UID · Network Interaction ID (the `i-` written over the bridge) · Created At |
| `Proposed` | §7 |
| `Polls` | Source Key · Ran At (ISO) · Status (the HTTP status, or the failure word `fetch_failed` / `parse_failed` / `source_threw`) · Items (`Event` objects or `VEVENT`s read) · Newest Start — **appended by the poller, one row per fetched source per run** (E2); the panel shows the newest row per source as the roster's last outcome, and `events sync` carries the same rows into the roster's `lastProbe`. Not owner-scoped — the poller has no owner |
| `Tuning` | Term · Weight · Note — one row per §6 term plus a `regions` row; created empty by E1, **seeded once by the first score** (`evTuning_`, E3) with the §6 default weights — `segmentFit` 0.35 · `accountPresence` 0.35 · `corpusSalience` 0.15 · `proximity` 0.10 · `conflict` 0.25 · `relevancePrior` 0.05 — and `regions` = `` (a comma list of preferred region codes, e.g. `TX,CA,NV`; empty scores `proximity` 0 for every event), each with a Note that says what the term measures; admin-edited in the sheet (no editor UI in v1); **read on every score**, so a change reorders the list on the next fetch without a deploy. A weight that is not a finite number in 0..1, or a term row deleted by hand, falls back to its default and is named under the answer's `defaulted[]`; a partially edited tab is never re-seeded. Not owner-scoped — one admin, one tuning |
| `Signals` | **Not an Events tab.** Attendance signals are written into **Network's** `Signals` tab over `nop=signals` (`NETWORK-SCHEMA.md` §3, §8); Events keeps no copy, and reads them back over `eop=signals` |
| `Shares` · `Profiles` | Verbatim from Receipts; dormant in v1 |

## 6 · The recommendation score (E3)

Computed **in `Events.gs`** (`evRecommend_`, `eop=recommend` behind the `recommend` capability) from data fetched over the bridge, never in the page from a public file, because the "why" panel names Network accounts. For each upcoming event — `status` ∉ `cancelled` · `past` and `end` (or `start`) not before today:

| Term | Formula | Default weight (`Tuning`) |
|---|---|---|
| `segmentFit` | `|audience ∩ seatSegments| / |audience|`, where `seatSegments` is the union of both seats' `segments[]` read from `profiler-segments.json` → `seats` at run time (§12.6: both seats weigh equally; `PROFILER-SCHEMA.md` → Segments registry). 0 when the file cannot be read (`unavailable[]` says so) | 0.35 |
| `accountPresence` | Σ over Network accounts with a live Signal for this event of `stageWeight × confidence`, capped at 1; **one account counts once, at its strongest signal**. `stageWeight`: `negotiation` / `shortlist` 1.0 · `rfp` / `discovery` 0.8 · `prospecting` 0.6 · `none` at a `target` 0.4 (a `target` at `post-award` / `won` / `lost` also 0.4) · `customer` / `partner` / `channel` any stage 0.5. A signal is live when its event is upcoming; signals are read per scored account over Network's `nop=signals` read leg, **capped at 40 accounts** per score (`signalsCapped` says when it stopped) | 0.35 |
| `corpusSalience` | `min(1, |mentions| / 8) × 0.5^(monthsSinceNewestMention / 12)` — `mentions[]` counted as distinct dossier slugs; `monthsSinceNewestMention` is the calendar months from the newest `lastUpdated` among the mentioning dossiers in `profiler-companies.json` (a mention carries no date of its own) to today; an unreadable companies file counts 0 months (no decay) and is named under `unavailable[]` | 0.15 |
| `proximity` | 1 if the event's `region` is in the developer's preferred regions (`Tuning` row `regions`), 0.5 if its `country` is the country of any preferred region (derived from the registry — the country of every event carrying a preferred region), else 0. An empty `regions` row scores 0 everywhere (the term is optional, §5.4) | 0.10 |
| `conflict` | −1 if the dates overlap **another** starred event with `Attending` ∈ `registered` · `attended` (inclusive calendar dates; the event's own star never conflicts with itself), else 0 | 0.25 (subtracted — the weight is positive, the term negative) |
| `relevancePrior` | `relevance / 5` | 0.05 |

`score = Σ weight × term`, rounded to two decimals (never −0), the list sorted by score then slug. Changing a weight in `Tuning` reorders the list on the next fetch without a deploy. The seat segments come from `profiler-segments.json` at run time, never from a copy in Events.

**The answer.** Fetched on demand only (D14 — the Recommended pill, a sheet whose score is not yet loaded, return to the tab while ranked); never polled.

```
→ action=events&eop=recommend&session=<token>
← { success:true, today, weights:{ segmentFit, accountPresence, corpusSalience, proximity, conflict, relevancePrior },
    regions:[…], defaulted:[terms that fell back], seeded:bool, notConfigured:bool, networkError?:"upstream_…",
    accounts:N, accountsRead:N, signals:N, signalsCapped:bool, seatSegments:[ids], unavailable:[…], starred:N,
    events:[ { slug, score, terms:{ the six }, why:{ segments:[ids matched], accounts:[ { id, name, stage, relationship, stageWeight,
              signal:{ kind, confidence, evidenceUrl } } ], mentions:[dossier slugs], conflicts:[starred slugs] } } ] }
```

**Degrades, never fails.** A Network side that answers `not_configured` (either peer token unset) zeroes `accountPresence`, sets `notConfigured: true` and still computes every other term — the panel paints "connect Network to score by account" and the list still ranks; any other upstream failure is named in `networkError` with the same degrade. A refused session (`ROLE_DENIED`) issues zero fetches and opens zero tabs. Audit rows carry counts only — events, accounts, signals, the flags — never an account name or id. Proved offline by `scripts/check-events-score.js` (§12).

## 7 · The `Proposed` diff row and `events sync` (E2)

The weekly no-AI poller walks the roster, fetches every `jsonld` and `ics` source, normalises each `Event` / `VEVENT` to the §3 shape, and diffs it against the registry. It **writes proposals, never the registry** — a GAS trigger cannot commit, and a fired session cannot push (the Routines lesson in `.claude/rules/profiler-app.md`).

| Column | Meaning |
|---|---|
| Proposed ID (`pr-`) | |
| Source Key | The roster row that produced it |
| Event Slug | Existing slug, or the proposed new slug for a new edition |
| Change | `new-edition` · `moved-dates` · `changed-venue` · `changed-url` · `cancelled` · `new-event` |
| Before · After | JSON of the affected fields |
| Evidence URL | The fetched page |
| Seen At | ISO |
| Status | `pending` · `approved` · `rejected` · `applied` |
| Decided At · Applied In | ISO · the repo version that applied it |

**The poller (E2, `evPollRun_` — built 2026-09-22).** The roster and the registry are read once per run from their Pages URLs (`EV_ROSTER_URL`, `EV_REGISTRY_URL` — the same site the page reads, never a GitHub host). A roster row is fetched only when `feedKind` ∈ `jsonld` · `ics`, `cadence` ≠ `manual`, no `blocked`, `robots` ≠ `disallowed` and the URL is http(s) — `evPollSkipReason_` names the reason otherwise and the row is never fetched. Per source: `UrlFetchApp` with `muteHttpExceptions`, a try/catch, a 15-second allowance counted against a 270-second run budget (the run stops cleanly before a source that could overrun it; the next weekly run starts from the top — every write is deduplicated so nothing is lost). JSON-LD: every `<script type="application/ld+json">` block parsed on its own, arrays, `@graph` and `subEvent` walked, `@type` `Event` or any `…Event` subtype, `eventStatus` `EventCancelled` read; dates are the first ten characters of `startDate` / `endDate` (the organiser's own offset → the local date). ICS: a minimal RFC 5545 walker — unfold, `DTSTART` / `DTEND` (a `VALUE=DATE` `DTEND` is exclusive and moved back a day; a `TZID` date-time keeps its date part), `SUMMARY`, `LOCATION` (venue, city, region, country by comma), `URL`, `UID`, `STATUS`; it accepts what `evVevent()` / `build-events-ics.py` emit. **The match**: the derived §1 slug exists → known; else among the rows citing this source key, the same normalised name or the same URL → known; else a row whose series base equals or contains the item's (≥ 6 characters) in a different year → a **new edition** with slug = the known slug's base + the year; else **new**. **The six diffs**: `cancelled` (feed status cancelled, registry not — the row's other fields are then moot), `moved-dates` (`start` / `end`), `changed-venue` (`venue`, `city` carried), `changed-url` (`website`), `new-edition` (Before = the previous edition's slug and dates, After = a §3 row seeded with `series` / `organiser` / `kind` / `tz` from the previous edition, `status: tentative`), `new-event` (Before `{}`, After = the normalised item as a tentative §3 row with nothing invented). Before / After are canonical JSON (sorted keys); the dedup key is (Source Key, Event Slug, Change, After) over **every** existing row whatever its status, so a decided row is never re-proposed. A failed source (a throw, a non-2xx, a parse failure) writes no proposal — one `Polls` row with the status and one audit row (`events_poll_source_failed`, counts and the status only).

**The ops** (`action=events`, all behind `evRequire_(sess, 'roster')` — admin only under D7):

```
→ eop=proposed
← { success, proposals:[ { id, sourceKey, slug, change, before, after, evidenceUrl, seenAt, status, decidedAt, appliedIn } ]   // pending + approved only
    counts:{ pending, approved, rejected, applied }, polls:[ { sourceKey, ranAt, status, items, newest } ], pollerInstalled: true|false|null }
→ eop=decide&id=pr-…&status=approved|rejected      ← { success, id, status, decidedAt }   // reversible until applied; `already_applied` after
→ eop=applied&ids=pr-…,pr-…&version=vXX.XXr        ← { success, applied:[ids], skipped:[ { id, reason:'not_approved' } ], version }
→ eop=pollnow                                      ← the run summary { ranAt, sources, fetched, skipped, failed, proposed, duplicates, stopped, results[] }
→ eop=installpoller                                ← { success, installed:true, removed:n, schedule }   // idempotent: every trigger on the handler deleted first, then one weekly, Monday 06:00 America/New_York
```

The trigger handler is the public `evPollTick()` (a time-driven trigger cannot target a `_` function); `installpoller` removes triggers on either name. The first `ScriptApp.newTrigger` needs the script's own authorisation — the hand-off says so.

**The sync JSON** (the panel's "Copy as JSON"; `.claude/rules/events-app.md` reads it): `{ schemaVersion: 1, exported, proposals: [the approved rows above minus status / appliedIn], polls: [as above] }`.

`events sync` (a session command, `.claude/rules/events-app.md`, written in E2) takes that JSON (or, when the Google Drive connector can read the Events spreadsheet, the `Proposed` tab's `approved` rows and the `Polls` tab directly — tried, reported, never depended on), applies each row to `events.json` (the field the Change names; `lastUpdated`; the matching `sources[].lastConfirmed` = Seen At's date; a `new-edition` / `new-event` row appended in the §3 shape with `status` `tentative`), advances the roster's `lastProbe` from `polls[]`, rebuilds `events.ics`, runs the checker (exit 0 is the gate — a failing apply is reverted, never committed half-way), and lists the `pr-` ids and the version for the developer to stamp with **Mark applied** — the session never calls the app. The quarterly discovery Routine (phase R) proposes `new-event` rows the same way.

## 8 · Peer ops — the bridge (`?action=peer&t=<EVENTS_PEER_TOKEN>&eop=…`)

Same far side as Network's (`NETWORK-SCHEMA.md` §8): `.trim()`-ed token, `not_configured` under 16 characters, a flat `denied` with zero reads on every token-boundary case, handled before session validation. `EVENTS_PEER_TOKEN` is set to the same value in Events' and Network's Script Properties. Network calls only after its own `validateSessionForData`.

```
→ eop=today&owner=<email>
← { success:true, today:"<YYYY-MM-DD>", events:[ { slug, name, start, end, city } ] }   // starred events whose dates contain today (event tz)

→ eop=starred&owner=<email>
← { success:true, events:[ { slug, name, start, end, city, attending } ] }

→ eop=signals&owner=<email>&accountId=<a-…>
← { success:true, signals:[ { eventSlug, name, start, kind, confidence, evidenceUrl } ] }   // Events reads them from Network first (nop=…) — this op only exists so Network's "will be at" chips need one proxy, not two
```

While either token is unset both surfaces report **not configured**: the scan card simply has no default event, the recommendation panel says "connect Network to score by account".

## 9 · ICS and Add-to-Google-Calendar mappings

Per-event `.ics` download and the published `live-site-pages/events-data/events.ics` (every `confirmed` event, rebuilt by `events sync`) are hand-rolled RFC 5545 text — no library. One `VEVENT` per event:

| ICS | Registry |
|---|---|
| `UID:` | `<slug>@events.<org>.github.io` — stable across rebuilds so re-imports update, not duplicate |
| `DTSTART;VALUE=DATE:` · `DTEND;VALUE=DATE:` | `start` · `end` + 1 day (ICS end is exclusive) — all-day events; a meeting (`Meetings` tab) uses `DTSTART;TZID=<tz>:` with a `VTIMEZONE` block |
| `SUMMARY:` | `name` |
| `LOCATION:` | `venue, city, region, country` |
| `URL:` | `website` |
| `DESCRIPTION:` | `organiser` · `kind` · `tierNote` · registration URL, `\n`-escaped |
| `CATEGORIES:` | `audience[]` segment ids |
| `STATUS:` | `CONFIRMED` · `TENTATIVE` · `CANCELLED` from `status` |
| `DTSTAMP:` · `LAST-MODIFIED:` | build time · `lastUpdated` |
| `X-WR-CALNAME:` (calendar level) | `BESS/AIDC events` |

Line folding at 75 octets, CRLF line ends, `\,` `\;` `\n` escaping. **Add to Google Calendar** links use the template URL: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=<name>&dates=<YYYYMMDD>/<YYYYMMDD+1>&location=<enc>&details=<enc>&ctz=<tz>`.

## 10 · Venues (D12 — Overpass, decided 2026-09-20; no billed GCP project)

The day plan's "nearby" list comes from **OpenStreetMap Overpass** — free, keyless, no billing account: one `UrlFetchApp` POST per starred event to `https://overpass-api.de/api/interpreter` with `[out:json][timeout:25];(node["amenity"~"cafe|restaurant|bar"](around:600,<lat>,<lng>);node["tourism"="hotel"](around:600,<lat>,<lng>););out body 40;`, normalised to `{ name, kind, lat, lng, distanceM }`, cached per event in `CacheService` for 7 days and in the `Plans` row once a plan is saved. The Overpass usage policy is honoured by the cache and a 2-request-per-second ceiling. If a billed Google Cloud project ever exists and Places' data quality is wanted, E5 adds Places Nearby Search behind a `PLACES_API_KEY` property with the same normalised shape — the plan code does not change.

## 11 · The corpus-count corollary and what is never taught

The registry's counts (how many events, how many mentions) are **never** lesson content and never a dossier fact — the corpus-wide-count corollary from `CLASSROOM-CURRICULUM-PLAN.md` applies. `mentions[]` is a derived index of where a name appears, not evidence that a company attends; attendance is only ever a Signal with an evidence URL. Under D13 the `event:` provenance prefix stays deferred until the registry has survived one poller cycle, and there is never a `contact:` prefix.

## 12 · Checkers

- `scripts/check-events-registry.py` (E0) — asserts: every slug matches the rule and is unique; `start` ≤ `end`; `tz` is a known IANA name; every `audience[]` id exists in `profiler-segments.json`; every `sources[].sourceKey` exists in the roster and `sources[].url`'s host appears on that roster row; every `mentions[].slug` resolves to a registry company; every row has `lastUpdated` and ≥ 1 `sources[]` row with `lastConfirmed`; no roster row lacks a `lastProbe`; `status = past` iff `end` < today; the `.ics` parses (a minimal `VEVENT` walker in the script). Exit 1 on any finding; `--fix-past` flips `status` only
- `scripts/extract-corpus-events.py` (E0) — walks every dossier's `recentDevelopments[]`, `productsAndServices[]`, `technicalSpecs[]`, `strategyRead[]` and `sources[]` for the known event strings (a table in the script, one row per corpus event with its regex and slug), emits `mentions[]` and a seed row per event not yet in the registry; idempotent
- `scripts/verify-events-roles.py` (E1) — the four-tier door check
- `scripts/check-events-poller.js` (E2) — the poller in a Node sandbox (stubbed `UrlFetchApp` / `SpreadsheetApp` / `ScriptApp`; the ICS fixture built by `build-events-ics.py`'s own `calendar()`): the six diff kinds one row each with the right Before · After, a second run zero rows, the blocked / manual / html / robots-disallowed rows never fetched, a 403 one `Polls` row and one audit row and no proposal, the five ops refused to a non-admin with zero reads, `installpoller` idempotent. Zero live calls
- `scripts/check-events-score.js` (E3) — the score in a Node sandbox (stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService`; a fixture registry, segments file with `seats`, companies file and Network far side): every §6 term against a hand-computed value on three fixture events and the score to two decimals, sorted by score then slug; `Tuning` seeded once and read on every score; a weight change reorders the answer; a malformed weight falls back and is named; `not_configured` degrades with `notConfigured: true` and no network fetch; the signal reads stop at the cap; `recommend` refused to a non-admin with zero fetches and zero tab opens; no audit row names an account. Zero live calls
- `node --check` on the `.gs` copy and `scripts/check-gas-inner-scripts.js`, as for every project

Developed by: LightAISolutions
