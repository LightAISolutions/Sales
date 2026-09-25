# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 101/100`

## [Unreleased]

*(No changes yet)*

## [v07.49r] — 2026-09-25 06:08:32 AM EST

> **Prompt:** "add the learned-text box to Promote"

### Added

#### `Network.html` (v01.25w)

- **A required "What did you learn?" box in the ⇈ Promote box.** It is a textarea of up to 3,000 characters (`NW_PROMOTE_LEARNED_MAX`), focused when the box opens, and it comes before the confidence field. The page collapses whitespace, refuses an empty or over-long entry before any request, and sends the text as `learned` on `nop=promote`. The box goes read-only once promoted.
  - **Why:** Network has no free-text touch. Every History row's summary is machine-written ("Card scanned", "Meeting at …"), so a promotion sent Profiler's intake the fact of a touch and never the intel.

#### `Network.gs` (v01.18g)

- **`nop=promote` takes `learned`.** It is required, whitespace-collapsed and at most 3,000 characters; the new refusals are `learned_required` and `learned_too_long` (with `max`), both raised before any call.
  - **`nwPromoteText_`** now opens the note with the learned text, then ` — Context: ` and the unchanged context paragraph (kind, person, account, day, summary, `[Network interaction <i- id> · evidence · event]`), still capped at 4,000.
  - **The recording `note` Interaction's Summary** gains `: <excerpt>`, the first 300 characters (`NW_PROMOTE_EXCERPT_MAX`, cut with …), so the intel is visible in Network's History too.
  - **The audit is unchanged:** ids and a flag only, never the text.

### Changed

- **`repository-information/NETWORK-SCHEMA.md`**: the `nop=promote` contract (the `learned` field, the note's order, the Summary excerpt, the two refusals) and the checker line (60 checks).
- **`scripts/check-network-brief.js`**: the learned text is required, bounded and leads the note, and its excerpt is in the Summary. 58 → 60 checks, all passing.
- **`scripts/verify-network-roles.py`**: the Promote pass refuses an empty box with nothing posted, then checks that the whitespace-collapsed text rides the post. Passes.

## [v07.48r] — 2026-09-25 05:59:25 AM EST

> **Prompt:** "6.4 - see attached screenshot. Mark held seems to have worked, but produced something garbled called "c-1fa85fymc4iaj". What is that. Fix it. 6.2 - What's the point of promoting a contact interaction into a field note in Profiler if I can't input any information to the field note?"

### Fixed

#### `Events.html` (v01.13w)

- **After Mark held / not held, the post-event meeting row showed the raw contact ID (`c-1fa85fymc4iaj`) in place of the name, and dropped the account.** `eop=posteventmark` returns `meetings` from `evPostMeetings_` without running `evPlanMeetingNames_`, which `eop=postevent` does. `evPostMark` replaced the cached list wholesale, and the renderer falls back to `contactId` when `contactName` is empty. `evPostMark` now carries `contactName` and `accountName` across from the list already on screen, matched by meeting id. That costs no extra Network reads per mark. Verified headless against a mocked backend whose mark answer has no names: the row reads "Austin York · Acme · … HELD".

## [v07.47r] — 2026-09-25 05:21:48 AM EST

> **Prompt:** "6.2: See attached screenshot. Step 4) Before or after pressing "Promote", I never had a "note" box to input notes in. 6.3: I confirm that booking a meeting works as intended. 6.4: I booked a meeting on ACP's first day (9/22), but it doesn't show up in the "After the show" section. After I refresh the page and reopen the ACP event -> Plan tab, it keeps saying it's counting the cards and stuff but never shows a result. 6.5: I have sucessfully added my Events calendar to my Google calendar and can see the events. I will check events sync later. 7.3: I see a green badge "weekly sweep installed" and the line below reads "Last swept 2026-09-23 * 11 events * 1 signal found * 1 written * 0 updated * 1 page failed." See attached screenshot."

### Fixed

#### `Events.html` (v01.12w)

- **The Plan tab's "After the show" close-out could stay on "Counting the cards…" forever.** The `eop=postevent` and `eop=plan` load callbacks repainted the Plan box they were started from, and did nothing if that box was gone. Two things rebuild the sheet while a load is in flight: returning to the tab (the `visibilitychange` → `evAfterWrite` → `evOpenSheet` path) and closing and reopening the event. Either one detached the box while the cached state still read `loading`, so the new box drew "Counting…" and never sent a request of its own. A new `evRepaintPlan(e)` repaints whichever `#ev-plan` box is on screen when the answer lands, provided the sheet is still on that event and the Plan tab is still selected. Reproduced and verified headless against a mocked backend: before the fix, a reopen during a 3-second load stayed on "Counting…" indefinitely; after it, the close-out fills in when the answer arrives.

## [v07.46r] — 2026-09-24 08:47:30 PM EST

> **Prompt:** "Per the attached screenshot and my open action items Priority 1 list, profiler Habitat Energy and profiler Gridmatic."

### Changed

- **Habitat Energy dossier refreshed to profileVersion 2; v1 archived.** The Quinbrook sale is unchanged: no buyer, bidder, signing, completion or withdrawal is on the record through 2026-09-24. New Project Media's 17 March report is still the only public source.
  - **FY2025 accounts not yet filed.** Neither Habitat Energy Limited nor its parent had filed by 2026-09-24; both are due 30 September. The summary, financials commentary, collection gaps and indicators now say so.
  - **New development (19 May 2026):** a PSC07 and a PSC08 correct the control register above the parent, Renewable and Grid Services Limited. This is not a transfer: Habitat's own PSC and its board are unchanged.
  - **New development (17 July 2026):** General Counsel Jason Dillingham joined the leadership page.
  - **Evidence re-weighted.** Quinbrook's "Operational & Expanding" status page has not been modified since 29 August 2025, so key judgment 2 now treats it as weak evidence. The judgment now rests on the Companies House record.
  - **Other edits:** decision makers gain Dillingham and Chief People Officer Lois Stamps; the ownership line is re-dated; three Companies House sources added (75 in total).
- **Gridmatic dossier refreshed to profileVersion 2; v1 archived.** The raise is still only anticipated. No Gridmatic Inc. Form D, named investor or credit facility exists; the EDGAR full-text index was checked on 2026-09-24 and holds Form Ds as late as 2026-09-23. The Capital Markets posting describing "upcoming debt and equity raises" is still live.
  - **Ownership now reads "founder-led", not "founder-owned".** The posting refers to "existing investors" and "board packages", every posting offers a stock-option loan programme, and a named angel invested before 2022.
  - **Retail revenue claim added:** "on track to hit $100 million in revenue this year" (company LinkedIn, 18 Aug 2026). This is the first revenue figure the company has published, and it is unaudited.
  - **Amperical ERCOT data updated (to 24 Jul):** Endurance Park ranks 11th of 312; Cross Trails moves from 43rd to 38th. The scheduling entity carries "2 sites, 110 MW".
  - **Cross Trails loan waivers.** Energy Vault's lenders waived Cross Trails' debt-service-coverage defaults for Q1 and Q2 2026 (8-K of 1 July; Q2 10-Q). Neither filing names Gridmatic.
  - **Other new developments:** the CCO's 16 September Energy-Storage.news interview, and the March 2026 Ohio residential add-on licence amendment.
  - **Other edits:** VP Finance Yojna Verma added (no CFO is named); strategy read, collection gaps and indicators revised; 7 sources added (77 in total).
- **Registry, calendar and notes.**
  - `profiler-companies.json`: Gridmatic tagline revised; the sync script reconciled `lastUpdated` and source counts for both companies (Habitat 75 sources, 63% first-party; Gridmatic 77, 40%).
  - `profiler-refresh-calendar.json`: `lastRefreshed` moved to 2026-09-24 for both rows. Both stay `watch` tier.
  - `profiler-refresh-notes.json`: watch items updated. Habitat's second watch item flags that the 1 October sweep skips it, so the FY2025 accounts must be folded in by hand once filed.
  - `profiler-graph.json`: rebuilt.
- **Verification.**
  - `sync-profiler-registry.py --check` and `check-profiler-relationships.py`: 0 findings.
  - `check-profiler-crossrefs.py`: 0 candidates.
  - `check-profiler-study.py`: 0 errors.
  - Inbound reconciliation: five substantive mentions across the Fluence, Hunt Energy Network, Stem and Tesla dossiers reviewed, 0 changed.
  - Segment memberships re-read and unchanged: Habitat is challenger in software and optimisation; Gridmatic is challenger there and adjacent in storage developers and IPPs.

## [v07.45r] — 2026-09-24 08:15:30 PM EST

> **Prompt:** "continue with your recommendation"

### Fixed

- **`acp-recharge-2026` flipped to `past`** — ACP RECHARGE 2026 (22–24 Sep, Aurora CO) ended on 24 Sep, and the registry gate failed once its UTC date rolled to 25 Sep.
  - `check-events-registry.py --fix-past` changed that row's `status` and nothing else.
  - `events.ics` was rebuilt: 68 confirmed VEVENTs, down from 69. The only content change is ACP's dropped VEVENT; the rest of the diff is regenerated DTSTAMPs.
  - Verified: `check-events-registry.py` exits 0 (102 events: 68 confirmed, 6 past, 28 tentative), and `extract-corpus-events.py --check` reports `mentions[]` current.
  - Data-only: no page, GAS or schema change.

## [v07.44r] — 2026-09-24 08:11:01 PM EST

> **Prompt:** "continue with your recommendation"

### Fixed

- **Events Sync hand-off order** (`.claude/rules/events-app.md` step 8). The v07.42r hand-off told the developer to "mark 7 applied, reject 9", which the panel cannot do. **Mark applied** stamps every approved row at once, and an applied row can no longer be rejected (`already_applied`). All 16 rows ended up stamped `applied`.
  - **The rule now requires the order the panel supports:** switch skipped rows to Reject first, then click Mark applied.
  - **It also records the fallback:** a row that was stamped by mistake can only be relabelled in the spreadsheet, and the poller's dedup is unaffected by it.
  - **`EVENTS-SCHEMA.md` §7** carries the same one-line ordering note.
  - **Nothing else changed:** no page, GAS or data file.

## [v07.43r] — 2026-09-24 07:55:58 PM EST

> **Prompt:** "Run python3 scripts/extract-corpus-events.py to refresh the stale mentions[] in events.json, confirm with check-events-registry.py (exit 0) and --check, and push it as a data-only commit. It feeds the score's corpusSalience term, and it has been stale since the recent dossier revisions."

### Fixed

- **`events.json` `mentions[]` refreshed from the dossier corpus** — `scripts/extract-corpus-events.py` rewrote the derived index. Only the Megmeet dossier had drifted, which dates to its v8 cut (v07.32r):
  - `computex-2027` loses `megmeet` / `strategy`. The dossier's strategy read no longer names Computex.
  - `ai-infra-summit-2027` gains `megmeet` / `sources`.
  - Totals are unchanged: 256 mention rows across 33 corpus events. The score's `corpusSalience` term reads the corrected counts on the next page load.
  - Verified: `extract-corpus-events.py --check` went from exit 1 to "OK: mentions[] current", and `check-events-registry.py` exits 0 (102 events, 69 confirmed, 256 mentions across 32 events, `events.ics` agrees). This is a data-only change: no page, GAS or schema file touched.

## [v07.42r] — 2026-09-24 07:50:01 PM EST

> **Prompt:** "Picking up from my open action items review, I want to sync my Events registry. Run events sync with the following JSON:
>
> ```json
> {
>   "schemaVersion": 1,
>   "exported": "2026-09-24T23:39:44.059Z",
>   "proposals": [
>     {
>       "id": "pr-011alu3fbhzxh",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2026",
>       "change": "new-edition",
>       "before": {
>         "end": "2027-09-02",
>         "slug": "ai-infra-summit-2027",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "city": "Santa Clara",
>         "country": "US",
>         "end": "2026-09-17",
>         "kind": "conference",
>         "name": "AI Infra Summit 2026",
>         "organiser": "Kisaco Research",
>         "region": "CA",
>         "series": "AI Infra Summit",
>         "slug": "ai-infra-summit-2026",
>         "sources": [
>           {
>             "kind": "jsonld",
>             "lastConfirmed": "",
>             "sourceKey": "ai-infra-summit",
>             "url": "https://www.ai-infra-summit.com"
>           }
>         ],
>         "start": "2026-09-15",
>         "status": "tentative",
>         "tz": "America/Los_Angeles",
>         "venue": "Santa Clara Convention Center",
>         "website": "https://www.ai-infra-summit.com"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-22T20:56:52.474Z"
>     },
>     {
>       "id": "pr-0wf4qdswu9qm4",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2027",
>       "change": "moved-dates",
>       "before": {
>         "end": "2027-09-02",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "end": "2026-09-17",
>         "start": "2026-09-15"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-24T20:55:35.146Z"
>     },
>     {
>       "id": "pr-1ifa3czd71l9h",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "San Jose",
>         "venue": "San Jose McEnery Convention Center"
>       },
>       "after": {
>         "city": "5001 Great America Parkway, Santa Clara, CA 95054, United States",
>         "venue": "Santa Clara Convention Center"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-24T20:55:34.788Z"
>     },
>     {
>       "id": "pr-01iw6y3n1ltpd",
>       "sourceKey": "datacloud-usa",
>       "slug": "datacloud-usa-2027",
>       "change": "moved-dates",
>       "before": {
>         "end": "2027-09-02",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "end": "2027-09-02",
>         "start": "2027-08-30"
>       },
>       "evidenceUrl": "https://www.datacloud-usa.com/",
>       "seenAt": "2026-09-22T20:49:06.174Z",
>       "decidedAt": "2026-09-24T20:55:43.747Z"
>     },
>     {
>       "id": "pr-0r71bryoebnp2",
>       "sourceKey": "datacloud-usa",
>       "slug": "datacloud-usa-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "Austin",
>         "venue": "Fairmont Austin"
>       },
>       "after": {
>         "city": "304 E Cesar Chavez St, Austin, Texas, 78701, United Kingdom",
>         "venue": "Austin Marriott Downtown"
>       },
>       "evidenceUrl": "https://www.datacloud-usa.com/",
>       "seenAt": "2026-09-22T20:49:06.174Z",
>       "decidedAt": "2026-09-24T20:55:41.098Z"
>     },
>     {
>       "id": "pr-2f8kg1rgvynrk",
>       "sourceKey": "esig-events",
>       "slug": "esig-large-loads-workshop-2026",
>       "change": "changed-url",
>       "before": {
>         "website": "https://www.esig.energy/events/"
>       },
>       "after": {
>         "website": "https://www.esig.energy/event/esig-large-loads-workshop/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:56:15.848Z"
>     },
>     {
>       "id": "pr-174qj4to6col2",
>       "sourceKey": "esig-events",
>       "slug": "webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-01",
>         "name": "Webinar: Stability and Dynamics Studies of DERs in Weak Distribution Systems: Best Practices for EMT Studies and Utility Applications",
>         "slug": "webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/webinar-stability-and-dynamics-studies-of-ders-in-weak-distribution-systems-best-practices-for-emt-studies-and-utility-applications/"
>           }
>         ],
>         "start": "2026-10-01",
>         "status": "tentative",
>         "website": "https://www.esig.energy/event/webinar-stability-and-dynamics-studies-of-ders-in-weak-distribution-systems-best-practices-for-emt-studies-and-utility-applications/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:57:41.179Z"
>     },
>     {
>       "id": "pr-0imzbnq3kfo98",
>       "sourceKey": "esig-events",
>       "slug": "webinar-a-quantitative-assessment-of-the-impacts-of-large-loads",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-15",
>         "name": "Webinar: A Quantitative Assessment of the Impacts of Large Loads on Electricity Rate",
>         "slug": "webinar-a-quantitative-assessment-of-the-impacts-of-large-loads",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/webinar-a-quantitative-assessment-of-the-impacts-of-large-loads-on-electricity-rate/"
>           }
>         ],
>         "start": "2026-10-15",
>         "status": "tentative",
>         "website": "https://www.esig.energy/event/webinar-a-quantitative-assessment-of-the-impacts-of-large-loads-on-electricity-rate/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:57:39.101Z"
>     },
>     {
>       "id": "pr-2xy3g1xojf4wm",
>       "sourceKey": "esig-events",
>       "slug": "fall-technical-workshop-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "city": "Reston",
>         "country": "United States",
>         "end": "2026-10-29",
>         "name": "2026 Fall Technical Workshop",
>         "region": "VA",
>         "slug": "fall-technical-workshop-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/2026-fall-technical-workshop/"
>           }
>         ],
>         "start": "2026-10-26",
>         "status": "tentative",
>         "venue": "Hyatt Regency Reston, VA",
>         "website": "https://www.esig.energy/event/2026-fall-technical-workshop/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:56:54.181Z"
>     },
>     {
>       "id": "pr-1fwilm8tj67sn",
>       "sourceKey": "imasons-events",
>       "slug": "imasons-at-yotta-2026",
>       "change": "changed-url",
>       "before": {
>         "website": "https://imasons.org/events/"
>       },
>       "after": {
>         "website": "https://imasons.org/activity/2026-28-09_yotta-2026/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:58:04.031Z"
>     },
>     {
>       "id": "pr-10w2gwwavrkfb",
>       "sourceKey": "imasons-events",
>       "slug": "imasons-cascadia-local-chapter-the-digital-frontier-building-the",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-15",
>         "name": "iMasons Cascadia Local Chapter | The Digital Frontier: Building the Infrastructure of Tomorrow",
>         "slug": "imasons-cascadia-local-chapter-the-digital-frontier-building-the",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "imasons-events",
>             "url": "https://imasons.org/activity/2026-10-15_digitalfrontier_cas/"
>           }
>         ],
>         "start": "2026-10-15",
>         "status": "tentative",
>         "website": "https://imasons.org/activity/2026-10-15_digitalfrontier_cas/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:58:34.714Z"
>     },
>     {
>       "id": "pr-1rz0m71444icd",
>       "sourceKey": "imasons-events",
>       "slug": "data-center-energy-industry-update-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-11-02",
>         "name": "Data Center Energy Industry Update",
>         "slug": "data-center-energy-industry-update-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "imasons-events",
>             "url": "https://imasons.org/activity/2026-11-02_datacenterenergyindustryupdate_tx/"
>           }
>         ],
>         "start": "2026-11-02",
>         "status": "tentative",
>         "website": "https://imasons.org/activity/2026-11-02_datacenterenergyindustryupdate_tx/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:57:42.089Z"
>     },
>     {
>       "id": "pr-2wpsbsoc5z7j5",
>       "sourceKey": "informa-battery-show",
>       "slug": "the-battery-show-north-america-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "city": "Detroit",
>         "country": "US",
>         "end": "2026-10-15",
>         "name": "The Battery Show North America",
>         "slug": "the-battery-show-north-america-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "informa-battery-show",
>             "url": "https://www.thebatteryshow.com/"
>           }
>         ],
>         "start": "2026-10-12",
>         "status": "tentative",
>         "venue": "Huntington Place",
>         "website": "https://www.thebatteryshow.com/"
>       },
>       "evidenceUrl": "https://www.thebatteryshow.com/en/home.html",
>       "seenAt": "2026-09-22T20:50:09.948Z",
>       "decidedAt": "2026-09-24T20:58:44.533Z"
>     },
>     {
>       "id": "pr-19f00es616r74",
>       "sourceKey": "informa-data-center-world",
>       "slug": "data-center-world-2027",
>       "change": "changed-url",
>       "before": {
>         "website": "https://www.datacenterworld.com/"
>       },
>       "after": {
>         "website": "https://datacenterworld.com/"
>       },
>       "evidenceUrl": "https://www.datacenterworld.com/",
>       "seenAt": "2026-09-22T20:50:13.570Z",
>       "decidedAt": "2026-09-24T20:58:45.815Z"
>     },
>     {
>       "id": "pr-0bywe4src8ygp",
>       "sourceKey": "mwc-barcelona",
>       "slug": "mwc-barcelona-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "Barcelona",
>         "venue": "Fira Gran Via"
>       },
>       "after": {
>         "city": "Fira Gran Via, Av. Joan Carles I, 64 08908 L'Hospitalet de Llobregat Barcelona",
>         "venue": "Fira Gran Via, Barcelona, Spain"
>       },
>       "evidenceUrl": "https://www.mwcbarcelona.com/",
>       "seenAt": "2026-09-22T20:50:18.044Z",
>       "decidedAt": "2026-09-24T20:58:50.558Z"
>     },
>     {
>       "id": "pr-0gt5wnjye4xvd",
>       "sourceKey": "yotta-event",
>       "slug": "yotta-2026",
>       "change": "changed-venue",
>       "before": {
>         "city": "Las Vegas",
>         "venue": "Caesars Forum"
>       },
>       "after": {
>         "city": "Las Vegas",
>         "venue": "Yotta 2026"
>       },
>       "evidenceUrl": "https://www.yotta-event.com/",
>       "seenAt": "2026-09-22T20:50:22.007Z",
>       "decidedAt": "2026-09-24T20:58:48.048Z"
>     }
>   ],
>   "polls": [
>     {
>       "sourceKey": "ai-infra-summit",
>       "ranAt": "2026-09-22T20:48:51.918Z",
>       "status": "200",
>       "items": 2,
>       "newest": "2026-09-15T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "clarion-powergen",
>       "ranAt": "2026-09-22T20:49:05.599Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-01-18T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "datacloud-usa",
>       "ranAt": "2026-09-22T20:49:06.174Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-08-30T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "esig-events",
>       "ranAt": "2026-09-22T20:49:12.076Z",
>       "status": "200",
>       "items": 12,
>       "newest": "2027-01-26T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "imasons-events",
>       "ranAt": "2026-09-22T20:49:41.817Z",
>       "status": "200",
>       "items": 12,
>       "newest": "2026-11-12T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-battery-show",
>       "ranAt": "2026-09-22T20:50:09.948Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2026-10-12T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-data-center-world",
>       "ranAt": "2026-09-22T20:50:13.570Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-05-24T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-distributech",
>       "ranAt": "2026-09-22T20:50:17.382Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-03-01T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "mwc-barcelona",
>       "ranAt": "2026-09-22T20:50:18.044Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-03-01T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "yotta-event",
>       "ranAt": "2026-09-22T20:50:22.007Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2026-09-28T07:00:00.000Z"
>     }
>   ]
> }
> ```
> "

The first `events sync` to reach the registry. Of the 16 proposals the developer approved in the Proposed tab, **7 were applied and 9 were skipped** at the developer's choice. The skipped rows are poller misreads (listed below), and the registry checker could not have caught them, because it checks only for duplicate slugs. All 10 polled roster rows had their `lastProbe` advanced. No app file changed, so no page or GAS version bump.

### Changed

#### `live-site-pages/events-data/events.json`
- **`datacloud-usa-2027`**:
  - Start moved from 31 Aug to **30 Aug 2027**, the organiser's JSON-LD start, which includes the pre-event day the row's tierNote already names (`pr-01iw6y3n1ltpd`).
  - Venue **Fairmont Austin → Austin Marriott Downtown** (`pr-0r71bryoebnp2`). `city` stays "Austin", because the poller wrote a street address ending "United Kingdom". `venueLatLng` was removed because it pinned the old venue; the next E0 verification pass should set it again.
- **Three website updates**: `esig-large-loads-workshop-2026` → the workshop's own ESIG page (`pr-2f8kg1rgvynrk`), `imasons-at-yotta-2026` → its iMasons activity page (`pr-1fwilm8tj67sn`), `data-center-world-2027` → `datacenterworld.com` without the `www` (`pr-19f00es616r74`).
- **Two new ESIG webinars, both tentative**. The session read their evidence pages on 2026-09-24: both are online on WebEx, 4–5 PM ET, organised by ESIG.
  - `webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut` (1 Oct): DER stability and EMT studies. Audience: grid equipment, utilities, software. Relevance 2 (`pr-174qj4to6col2`).
  - `webinar-a-quantitative-assessment-of-the-impacts-of-large-loads` (15 Oct): how large loads move electricity rates. Audience: utilities, AIDC developers, hyperscalers. Relevance 3 (`pr-0imzbnq3kfo98`).
- On every applied row: `lastUpdated` 2026-09-24, and the matching source's `lastConfirmed` set to 2026-09-22 (the poll date).
- `uptime-network-americas-fall-2026` flipped from tentative to **past** through the checker's own `--fix-past`, which changes only status. It ended 23 Sep, and it was the only finding the gate reported before the sync.

#### `live-site-pages/events-data/events-sources.json`
- `lastProbe` advanced to the 2026-09-22 poll on 10 roster rows (all HTTP 200): ai-infra-summit, clarion-powergen, datacloud-usa, esig-events, imasons-events, informa-battery-show, informa-data-center-world, informa-distributech, mwc-barcelona, yotta-event. No row was added, unblocked or re-kinded.

#### `live-site-pages/events-data/events.ics`
- Rebuilt: 69 confirmed of 102 events.

### Skipped — reject these in the Proposed panel
- `pr-011alu3fbhzxh` (new-edition `ai-infra-summit-2026`), `pr-0wf4qdswu9qm4` (moved-dates) and `pr-1ifa3czd71l9h` (changed-venue) on `ai-infra-summit-2027`. The organiser page's JSON-LD still carries the finished Sep 15–17 2026 Santa Clara edition. The poller read it as a new edition whose *previous* edition is 2027, and as a move of the 2027 row back to 2026 dates and the 2026 venue, with a street address in `city`.
- `pr-0bywe4src8ygp` (`mwc-barcelona-2027`): the venue is unchanged; the proposal only puts a street address in `city`.
- `pr-0gt5wnjye4xvd` (`yotta-2026`): the proposed venue "Yotta 2026" is the event's own name.
- Four duplicates of existing rows under new slugs:
  - `pr-2wpsbsoc5z7j5` duplicates `battery-show-na-2026`.
  - `pr-2xy3g1xojf4wm` duplicates `esig-fall-technical-workshop-2026`.
  - `pr-10w2gwwavrkfb` duplicates `imasons-cascadia-digital-frontier-2026`.
  - `pr-1rz0m71444icd` duplicates `imasons-texas-energy-update-2026-11`.

### Verified
- `scripts/check-events-registry.py` exit 0: 102 events (69 confirmed, 5 past, 28 tentative), 58 roster rows, 256 mentions across 32 events; the ICS agrees with the registry.
- `mentions[]` is byte-identical to before the sync. `extract-corpus-events.py --check` reports the file stale **on `main` before this sync as well**, from recent dossier edits. This command never writes `mentions[]`, so that refresh is left to its own script.

## [v07.41r] — 2026-09-24 06:55:02 PM EST

> **Prompt:** "Verify and close out the attached three facts that are still unverified" *(with a screenshot of the three facts flagged at v07.40r: AEP's "six of eight" tariff states against its 30 Jul release's five; Narada's H1 2026 collapse not yet in its v4 dossier; the Trane dossier's policyExposure[1] reading the EPA 2030 relief too broadly)*

All three facts flagged at v07.40r were verified against primary sources and closed. AEP needed no change. Trane and Narada were revised, and the corrections were carried into the two Guidance landscape modules and two segment lessons that repeated them.

### Verified — no change

- **AEP "six of eight"** — both figures are right at their own dates. The 30 Jul 2026 Q2 earnings deck (p. 8) says five of the eight states; the "Aug & Sep 2026 Investor Meetings" handout (p. 7, and the p. 12 table) says six, after Michigan approved in between, with Oklahoma (PSO) and SWEPCO Texas still pending. Every repo mention already dates "six" to the August handout. The matching bullet in the cooling-recheck reminder is struck through as closed.

### Changed

#### `live-site-pages/profiler-data/trane-technologies.profile.json` — profileVersion 1 → 2 (v1 archived)
- **policyExposure[1]** (EPA Technology Transitions rule) corrected from Federal Register 2026-10387 and 40 CFR 84.54 as amended. The 2030 extension covers only chillers and process refrigeration of **100 lb charge or less used in semiconductor manufacturing**; every other industrial process chiller keeps 1 Jan 2026 or 1 Jan 2028. Data-centre, IT-equipment and computer-room cooling keeps its **700-GWP limit from 1 Jan 2027**. The amendments were published 26 May but took effect **27 July 2026**, so `effectiveDate` is corrected too.
- The exposure's conclusion is reversed for data centres: the applied line keeps its near-term forced-transition catalyst. strategyRead #5 and the 26 May development entry are corrected to match, each marked as a v2 correction.
- Two primary sources added: the Federal Register PDF and the eCFR section.

#### `live-site-pages/profiler-data/narada.profile.json` — profileVersion 4 → 5 (v4 archived)
- The **H1 2026 interim** (filed 29 Aug on cninfo) added as its own financial period, read first-hand:
  - Revenue RMB 1.699B (−56.7%). Grid storage RMB 183.8M (−80.6%, gross margin −31.6%), comms and data-centre storage RMB 1.044B (−44.8%, gross margin −4.0%), recycling RMB 470.7M (−56.7%).
  - Net loss RMB 1.111B.
  - Equity attributable to shareholders RMB 290.2M (−79.5%), and total equity RMB 25.1M after negative minority interests. Liabilities are 99.8% of assets.
  - Cash RMB 465.3M, of which about RMB 409.6M is frozen.
  - The court had still not accepted the reorganisation petition.
- **strategyRead[1] revised and its confidence lowered from High to Moderate**: the comms/DC segment grew through FY2025 but not through H1 2026. strategyRead[0], strategyRead[2], the summary, the commentary and a new 29 Aug development updated. No USD overlay is stored for the interim, because no citable FX basis was established.

#### `googleAppsScripts/Classroom/Classroom.gs` — v01.90g → v01.91g
- **`landscape-cells-and-chemistry-2026-09`** (updated → 2026-09-24) and **`landscape-in-hall-power-2026-09`** — every "the segment grew through the collapse" claim is corrected (five passages across indicators, bets, the group-three paragraph and the claims ledgers). The Narada ledger rows are re-pinned at v5 and a dated revision note is added. `reviewBy` is unchanged in both.
- **`segment-in-hall-power`** and **`segment-cooling`** regenerated. These were the only two segments whose sections changed ("what-moved" gains Narada's H1 event; "the-fence" reads Trane's corrected EPA entry). The other pin-only segments were left alone under G3.

#### Other files
- `repository-information/industry-guidance/landscape-cells-and-chemistry-analysis.md` and `landscape-in-hall-power-analysis.md` — mirrored corrections and revision notes. The in-hall-power "flagged, not changed" Narada item is struck through as closed.
- `repository-information/CLASSROOM-CURRICULUM-PLAN.md` — inline correction on the §10.6 cooling-row history that carried the same broad EPA reading and the 26 May date.
- `profiler-companies.json` synced; `profiler-graph.json` rebuilt.
- Profiler checks: relationship checker 0 findings; cross-reference checker 0 candidates. Inbound reconciliation: 3 dossiers mention Narada, none with a financial claim, 0 changed. No other dossier cites the EPA rule.

## [v07.40r] — 2026-09-24 05:34:30 PM EST

> **Prompt:** "Recheck four Classroom Industry Guidance landscape modules whose reviewBy dates fall this week. Read first: .claude/rules/industry-guidance.md (especially the Freshness discipline section and step 7's render recipe), .claude/rules/classroom-app.md, repository-information/CLASSROOM-SCHEMA.md and repository-information/C5-SALES-SIMULATIONS-DESIGN.md §3, §6 and §12. The modules, in guidanceDocs_() in googleAppsScripts/Classroom/Classroom.gs, below the // CONTENT END fence: 1. landscape-cooling-2026-09: reviewBy 2026-09-28 2. landscape-neoclouds-2026-09: reviewBy 2026-09-30 3. landscape-utilities-2026-09: reviewBy 2026-10-01 4. landscape-in-hall-power-2026-09: reviewBy 2026-10-01 For each module: (a) List its dated gates and load-bearing claims: regulatory dates, tariffs, market shares, deployment calendars, capacity numbers, named programmes. (b) Re-check every claim whose gate has passed or is close, using targeted web research against primary sources. Also check which covered dossiers (live-site-pages/profiler-data/<slug>.profile.json) have been revised since the module's `updated` date. (c) Update content that has gone stale. Keep the content-scope rule: the landscape-* modules are the approved exception that may name companies. Bump `updated` and set a new `reviewBy` from the module's next dated gate. A module that is still accurate gets a refreshed `reviewBy` only. Never change a module id. For landscape-in-hall-power specifically: the OCP Solid State Transformer (SST) Specification, Revision 0.3.0 (Google, Microsoft and NVIDIA; effective 22 June 2026; announced by OCP 11 August 2026) is summarised first-hand in repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html, chapter 3.5 and Appendix E. Check the module against it: - two SKUs: 13.8 kV at 5 MW, and 34.5 kV at 5 or 10 MW - 800 V DC unipolar output - at least 98% efficiency from 50–100% load, power-train losses only - recommended overload of 120% for 5 s and 150% for 150 ms - an SST coupled with storage defined as an MV UPS - Modbus TCP/IP as the only communications requirement - BIL of at least 110 kV at 13.8 kV and 150–200 kV at 34.5 kV - the compliance list, with no UL 9540 The source PDF is not in the repo. Cite the specification itself, never the briefing, and state nothing about it beyond what chapter 3.5 records. Rehearsal scenarios: this is an attended developer session, so under design D6 you may re-judge scenario beats. Before editing each landscape, list the type:"scenario" lessons whose provenance names it as a guidance:landscape-* input. Read them off Classroom.gs using the check-classroom-content.py loader (parse_literals(src, 'clLesson')), not from memory. After editing, for every landscape whose `updated` moved: - re-judge each resting scenario's beats against the revised facts - revise the scenario where a beat no longer holds, or re-stamp its pin where it still holds - keep every scenario's `reviewBy` no later than its landscape's new `reviewBy` Two scenarios fall due this week regardless and need the same review: scenario-neoclouds-discovery (9/30) and the three utilities scenarios (10/1). The "6 · Rehearsal coverage" block of check-classroom-curriculum.py must show nothing left under "landscape moved under it" for these four modules. If build-classroom-segments.py --check then shows section changes caused by these edits, regenerate those segments in the same push per G3. Leave pin-only segments alone. Verify, all must pass: - node --check on a .js copy of Classroom.gs - node scripts/check-gas-inner-scripts.js - python3 scripts/check-classroom-content.py (0 errors, no new warnings) - python3 scripts/check-classroom-curriculum.py --strict - python3 scripts/check-classroom-pipeline.py --base origin/main (if it reports P3, meet the gateDigest refresh obligation in classroom-app.md) - python3 scripts/check-readme-tree.py - a Playwright render of each edited module at Classroom.html#guidance/<id> with zero page errors (pip install playwright; use the pre-installed Chromium; never run playwright install) Bookkeeping: bump Classroom.gs VERSION and live-site-pages/gs-versions/Classroomgs.version.txt. Add a generic Classroomgs.changelog.md entry that never names an analysed document. Add a CHANGELOG entry, bump the repo version and update the README timestamp. Use the normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main. Run git fetch --unshallow origin main first. The C2 pipeline Routine fires Wednesday 2026-09-30 11:00 UTC, so push well before it and check git ls-remote first. One push. Close with a per-module verdict table (current / updated / needs deeper refresh), the scenarios you re-judged and what changed in each, and anything left for me."

All four landscape modules due this week were re-verified against primary sources. Four parallel research passes were run, and every changed fact was re-read first-hand before it went in. All four modules were updated. The four scenarios resting on the two modules that carry them were re-judged, and every beat's correct answer holds. Segment lessons pin no guidance input, so `build-classroom-segments.py --check` is unchanged at 13 pin-only and 0 with section changes, and nothing was regenerated.

### Changed

#### `googleAppsScripts/Classroom/Classroom.gs` — guidance modules (below the fence)
- **`landscape-cooling-2026-09`** — `updated` 2026-09-17 → 2026-09-24; `reviewBy` **stays 2026-09-28**, because the CoolIT launch gate is still ahead.
  - The CDU ladder now leads with Schneider's 3.5 MW WCDU (23 Sep), so the adjacent member sits above two of four incumbents, not three.
  - The refrigerant row is narrowed to semiconductor chillers of 100 lb or less for 2030, plus the data-centre 700-GWP limit from 1 Jan 2027 (EPA).
  - The Texas freeze is widened to the 21 Sep TCEQ permit halt.
  - The Ecolab date is now 27 Oct.
  - Delta and LITEON tags are moved to v6 and v7.
- **`landscape-neoclouds-2026-09`** — `updated` 2026-09-16 → 2026-09-24; `reviewBy` **stays 2026-09-30**, because Fluidstack's accounts are not filed. This module needs a deeper refresh.
  - The rating basis is rewritten to ClusterMAX 3.0 (23 Sep): Nebius is Platinum beside CoreWeave, Crusoe drops to Bronze, and Fluidstack and Nscale are Unavailable.
  - Nscale's S-1 (18 Sep) moves the revenue-disclosure count to 3 of 7, confirms the Anthropic contract at up to about USD 44.6 bn, and puts about 1 GW of 1.37 GW at owned sites.
  - Fluidstack names its end customer.
  - IREN is re-pinned at v5.
- **`landscape-utilities-2026-09`** — `updated` 2026-09-14 → 2026-09-24; `reviewBy` 2026-10-01 → **2027-01-01**. The Alabama statute is confirmed, so the date moves to the next effective date.
  - The Texas behind-the-meter asymmetry is corrected for the 21 Sep permit halt, with a new indicator row for the 19 Oct TCEQ update.
  - Merger dates are attributed to Virginia (17 Nov) and South Carolina (8 Dec; 29 Jan order).
- **`landscape-in-hall-power-2026-09`** — `updated` 2026-09-15 → 2026-09-24; `reviewBy` 2026-10-01 → **2026-10-31**, because Samsung SDI's start is month-level.
  - Adds the OCP SST Specification Rev. 0.3.0 in one paragraph, one indicator row and seven ledger rows, each citing the specification.
  - Flex's revenue claim is corrected from its Form 10.
  - Delta is moved to v6.

#### `googleAppsScripts/Classroom/Classroom.gs` — rehearsal scenarios (developer session, design D6)
- **`scenario-neoclouds-discovery`** — changed: `the-room`, `beat-3`, `claims-ledger`, `what-the-record-does-not-say`. The end user is now named by the counterparty itself, the disclosure count is 3 of 7, and beat 3's day count is made date-stable. Pin: `guidance:landscape-neoclouds-2026-09` 2026-09-16 → 2026-09-24. `reviewBy` stays 2026-09-30.
- **`scenario-utilities-objection`** — changed: `what-the-record-says`, `beat-3`, `claims-ledger`. The merger calendar is corrected. Pin: `guidance:landscape-utilities-2026-09` 2026-09-14 → 2026-09-24. `reviewBy` stays 2026-10-01.
- **`scenario-utilities-discovery`** — changed: none. It is re-judged and re-stamped only. Pin 2026-09-14 → 2026-09-24. `reviewBy` 2026-10-01 → 2026-11-03.
- **`scenario-utilities-discovery-aidc`** — changed: `the-position`, `beat-2`, `claims-ledger`. The Texas premise is corrected, and beat 2's answer holds. Pin 2026-09-14 → 2026-09-24. `reviewBy` 2026-10-01 → 2026-12-10.

#### `repository-information/industry-guidance/landscape-{cooling,neoclouds,utilities,in-hall-power}-analysis.md`
- A revision section on each records what moved, the source, and what was flagged but not changed.

#### Versions
- Classroom GAS v01.89g → v01.90g (`Classroom.gs` `VERSION` and `Classroomgs.version.txt`), with generic `Classroomgs.changelog.md` lines.

### Notes
- **Checkers:**
  - `check-classroom-content.py`: 71 lessons / 8 tracks / 220 gate cases — 0 errors, 0 warnings.
  - `check-classroom-curriculum.py --strict`: no structural findings; 0 scenarios whose landscape moved under them; due-for-review 10 → 6.
  - `node --check`: clean.
  - `check-gas-inner-scripts.js`: all blocks parse.
  - `check-readme-tree.py`: 0 findings.
  - Playwright render of all four modules: 0 page errors.
- **`check-classroom-pipeline.py --base origin/main`** reports P1, P2, P10 and P13 only. All are expected on a developer commit: the four analysis files are outside the committer's write set, the modules sit below the fence, the caps bind the unattended committer, and D6 reserves scenario revisions for exactly this session. **No P3, so `gateDigest` is untouched.**

## [v07.39r] — 2026-09-24 05:05:10 PM EST

> **Prompt:** "[attached: Powering_the_Next_Era_of_AI_-_How_Google_Microsoft_and_NVIDIA_Are_Standardizing_and_Accelereating_the_Industry_Transition_to_LVDC.pdf] [attached: OCP_SST_Design_Specification_v0.3_FINAL.pdf] Per the Priority 1 list: 1. See attached for the OCP LVDC SST Spec v03 and the accompanying press release that announced it. Now that you have the spec, make sure to update my Megmeet SST Briefing accordingly and output a downloadable copy for me to read. Highlight all the changes made. Then, give me a prompt to paste into a new Opus 5.5 Medium or High session to recheck the 3 Classroom landscape modules."

The Megmeet SST briefing is updated from the OCP SST Specification, Revision 0.3.0, and OCP's announcement of 11 August 2026. The developer supplied both on 24 September; `opencompute.org` had refused them to this environment. Both were read in full, figures included. Every change in the briefing is highlighted in place, and a new Appendix E indexes them. The PDF goes from 76 to 84 pages.

### Changed

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html` and the rebuilt `MEGMEET-SST-BRIEFING.pdf` (76 → 84 pages)
- **New chapter 3.5, "What the OCP specification actually says"** — the scope (an MV SST coupled with storage functions as an MV UPS); a fifteen-row requirements table with what each row asks of a vendor; what Revision 0.3.0 leaves TBD; what the announcement adds; and an analysis box on what it changes for Megmeet.
- **Corrected second-hand claims** (old text struck through beside the new):
  - The specification's title, dates and authors: *Solid State Transformer (SST) Specification — Medium Voltage to 800 VDC Power Conversion Platform*, effective 22 June 2026, announced 11 August 2026. The first edition had "LVDC SST Specification, July 2026".
  - "More than 80 manufacturers building to it" is corrected to the announcement's wording: more than 80 partners developing 800 VDC-compatible infrastructure.
  - Chapter 8, NVIDIA question 13: the specification names Modbus TCP/IP.
  - Chapter 8, NVIDIA question 15: the specification does set harmonic and power-factor requirements (IEEE 519, IEC 61800-3 C4, IEC 61000-6-2/-4).
  - Week-one question 9 is rewritten around commenting on Revision 0.4.
  - Chapter 16.4 marks the OCP block as resolved.
  - The glossary entry, the flashcard and the chapter 1 term row are rewritten.
- **Added from the specification**:
  - Two SKUs: 13.8 kV at 5 MW, and 34.5 kV at 5 or 10 MW.
  - At least 98% efficiency between 50% and 100% load, counting power-train losses only.
  - Recommended overload of 120% for 5 s and 150% for 150 ms.
  - BIL of at least 110 kV at 13.8 kV and 150–200 kV at 34.5 kV.
  - 800 V DC unipolar output; IT ground floating or high-resistance grounded.
  - A cap of 10 mF of DC-link capacitance per 4 MW.
  - Siting in conditioned grey space or outdoors, NEMA 3R, with a 15+ year design life.
  - The ride-through bands and the state machine.
  - The compliance list, which includes no UL 9540.
  - These are placed on the cover, in I.1, I.2 (twenty-three numbers become twenty-seven), chapters 1, 3, 5, 6, 7, 8 and 13–16.
- **Two new items in chapter 16.3:** the specification plots ERCOT's NOGRR 282 curve with different corner points from the briefing's web-sourced test, and the specification carries three different dates.
- **New Spec citation tier**, references 85–89. They are appended rather than renumbering the document. New highlight CSS: `mark.chg`, `del.chg`, `tr.chg`, `.chg-block`.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`
- The same stale statements are corrected in `obstacles`, `timelines`, `terms`, `weekOne` and `calendar`, and the `dontSay` ±400 V row gains a note.
- Three OCP numbers are added to `numbersToKnow`, a `SPEC` entry is added to `tierVocabulary`, and there is a new `updated` field.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/`
- `mmsst-fig-calendar.svg` (M2) and `mmsst-fig-timelines.svg` (M11) are regenerated from the data file. The other twelve came out identical apart from timestamps and clip ids, and were left as they were.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`
- The data file is re-inlined byte-identically. `tierClass()` learns the `SPEC` prefix, with a matching `.t.s` colour, so Spec tags do not render as analysis.

#### `README.md`
- The `Last updated:` line and the briefing PDF's page count in the tree.

### Notes

- **Neither source PDF is stored in the repository.** The briefing's references 85–89 name them, and chapter 3.5 records what they say.
- **Verification:**
  - Every scripted replacement matched exactly once.
  - The PDF was built with `node scripts/build-megmeet-sst-briefing-pdf.mjs`, and the cover, I.2, I.4, figure M2, 3.5 (both pages), the chapter 8 question table and Appendix E were rendered and read.
  - The companion loads headless from `file://` with no console errors.
- **Not changed:** the chapter 6 ledger and figures M6, M7 and M12 record what vendors have *shown*, and the specification changes none of that. Megmeet's class stays undisclosed.

## [v07.38r] — 2026-09-24 09:08:52 AM EST

> **Prompt:** "[Scheduled Routine \"Profiler earnings desk\", fired 2026-09-24.] STEP 0 — clone, prove push works, before any research. Then: read repository-information/profiler-refresh-calendar.json as the queue. DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run, oldest nextReport first. For each: (1) verify the report actually published, (2) run the Profiler Command end to end including news triage against the Scraper corpus (`CORPUS_TOKEN` supplied in the Routine prompt only, never written to the repo), (3) advance the row's nextReport/confirmed/source/lastRefreshed/watch[]. Also: for any row that is unconfirmed and whose nextReport is within seven days, confirm the date and update the row — that is calendar work, not a refresh, and does not count against the cap. Land one commit per run under the repo's normal Pre-Commit/Pre-Push checklists. Never create/update/delete a Routine or trigger. If nothing is due, stand down."

### Changed

#### `repository-information/profiler-refresh-calendar.json`
- **No row is due.** Read all 177 rows (92 `nextReport`, 85 `cadence`); none of the 92 public rows has `nextReport` on or before 2026-09-23, so no dossier refresh ran and the three-row cap was not exercised.
- **`intertek` confirmed** (the one row unconfirmed with `nextReport` within seven days — 2026-10-01, six days out). This is calendar work, not a refresh: per the row's own note in `profiler-refresh-notes.json`, 2026-10-01 is not an earnings date but the opening of the watch-window for the EQT/ADIA/Mubadala scheme's court-sanction hearing (expected Q4 2026 or Q1 2027, with no fixed date). Verified via web search (Investegate RNS coverage, Reuters/TradingView, SWFInstitute) that the scheme timetable is unchanged since the row was last touched — shareholders approved the scheme 2026-08-06 (~98.7% of votes), court sanction is still pending with completion still guided to Q4 2026/Q1 2027, and no sanction/suspension/delisting announcement has landed. `confirmed` false → true, `lastRefreshed` 2026-09-09 → 2026-09-24. `nextReport` unchanged (still the correct window-open date). No dossier written — none was due.
- **`updated`** 2026-09-23 → 2026-09-24.

### Notes

- **Stand-down accounting**: 177 rows read, 0 taken for refresh (cap of 3 not exercised), 1 row re-confirmed via calendar work, 0 rows re-dated. The earliest `nextReport` in the queue is now `intertek` (2026-10-01), but that date is a watch-window open, not an earnings report — the next actual report due is `abb`, `nextReport` 2026-10-20.

## [v07.37r] — 2026-09-23 10:37:40 PM EST

> **Prompt:** Regenerate the five Classroom segments whose content changed (power-conversion-and-rack-power-silicon, cells-and-chemistry, storage-integrators-and-containers, grid-equipment, hyperscalers-and-ai-labs) and leave the 13 date-only ones alone. Archive old sections of the repo CHANGELOG and the Classroom GAS changelog in the same push.

This closes the regeneration item left open at v07.36r. `build-classroom-segments.py --check` read 18 of 19 segments due, 5 with section changes and 13 pin-only. The five were regenerated, and `--check` now reads 13 due, all pin-only. Both changelogs were rotated in the same push.

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs` v01.88g → v01.89g** — five segment lessons regenerated with `build-classroom-segments.py --segment <id>` (generation date 2026-09-23). Each appends one `revisions[]` entry, and its `changed[]` is exactly the set of differing sections:
  - **`segment-power-conversion-and-rack-power-silicon`** — changed: `the-players`, `what-moved`, `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:delta-electronics` 2026-09-04→2026-09-23, `profile:liteon` 2026-09-05→2026-09-23, `profile:megmeet` 2026-09-08→2026-09-23. This carries the Megmeet v8 basis-line change that v07.33r left due.
  - **`segment-cells-and-chemistry`** — changed: `what-moved`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:novonix` 2026-09-09→2026-09-22.
  - **`segment-storage-integrators-and-containers`** — changed: `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-21→2026-09-23.
  - **`segment-grid-equipment`** — changed: `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23.
  - **`segment-hyperscalers-and-ai-labs`** — changed: `what-moved`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:oracle` 2026-08-30→2026-09-21.
  - No track changed.
- **The 13 pin-only segments were left alone:** bridge-and-on-site-generation, clean-firm-and-nuclear, cooling, compute-and-the-rack, epc-and-construction, storage-developers-and-ipps, aidc-developers-and-landlords, neoclouds, utilities, capital, assurance, software-and-optimization and insurance-and-risk-transfer. Their inputs moved but no section differs, so G3 keeps both their text and their pins.
- **`live-site-pages/gs-versions/Classroomgs.version.txt`** → `|v01.89g|`, with a generic entry in `Classroomgs.changelog.md`.
- **`README.md`** — the `Last updated:` line and the Classroom GAS version display (synced by `check-readme-tree.py --fix`).

### Notes

- **Archive rotation — both changelogs, at the developer's instruction.** Neither was strictly triggered at 2026-09-23 EST: the repo CHANGELOG had 108 sections with 16 exempt as today's, so 92 non-exempt, and the Classroom GAS changelog had 51 with 2 exempt, so 49. Both were rotated anyway, because the prompt asked for it and the repo CHANGELOG would trigger at the first push after midnight. Each rotation moved exactly one whole date group, the oldest, and left both files below their caps even once today's sections lose their exemption:
  - **`CHANGELOG.md` → `CHANGELOG-archive.md`:** the 2026-09-17 group, 19 sections (`v06.30r`–`v06.48r`). `Sections: 107/100` → `89/100`.
  - **`Classroomgs.changelog.md` → `Classroomgs.changelog-archive.md`:** the 2026-09-15 group, 10 sections (`v01.39g`–`v01.48g`). `Sections: 50/50` → `41/50`.
  - **SHA enrichment:** 29 of 29 resolved on the deepened clone, and none are marked `[SHA unavailable]`. Each file keeps its existing link style: an 8-character short SHA in the repo archive and 7 characters in the GAS archive. Post-rotation verification (`grep '^## \[v' … | grep -v '— \['`) is empty for both archives.
- **Checks:**
  - `build-classroom-segments.py --check`: 13 due, 0 with section changes, 13 pin-only.
  - `check-classroom-content.py`: 71 lessons, 8 tracks, 220 gate cases, 0 errors, 0 warnings.
  - `check-classroom-pipeline.py --selftest`: 15 fixtures, 0 failures.
  - `check-classroom-pipeline.py --base origin/main`: no P3 finding, so `gateDigest` is unchanged. P10 reports 5 revised lessons against the cap of 3, which binds only unattended pipeline runs, and segment lessons are regenerated by developer sessions by design.
  - `node --check` passes, `check-gas-inner-scripts.js` passes (106 inner script blocks), `check-classroom-curriculum.py` has no structural findings, and `check-readme-tree.py` reports 0 findings.

## [v07.36r] — 2026-09-23 09:28:35 PM EST

> **Prompt:** fix the looks-wrong list. Do your own independent research and/or cross-check to determine a conclusion. If you cannot make the call, explain the context and decision to me and I will decide.

The v07.34r rewrite listed six things in the Megmeet SST briefing that looked wrong but left them alone. Each was checked against the primer, the document's own tables, git history or the primary sources, and all six were decided and fixed. None needed the developer's call. The PDF stays at 76 pages with 84 numbered references.

### Fixed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`**
  - **Chapter 7 intro.** It named one owned unsolved obstacle, but its own table has two. The sentence now names both: FERC for the interconnection queue and the NFPA Fire Protection Research Foundation for the DC arc-flash model.
  - **Chapter 16.2.** The bullet saying the NC State / NYPA / EPRI 1 MW feeder voltage was undisclosed is removed. NC State's releases of 18 August give only "up to 1 MW", but POWER Magazine of 8 September, which the primer cites, reports a live 13.2 kV feeder.
  - **Chapter 16.4 box.** It said chapter 7's newsletter-sourced claims were "marked low confidence where they appear". Git history shows no such marking in any version, and the NEC Article 706 "100 V DC default" it warned about appears nowhere in the document. The box now says what can be said: the claims cannot be told apart one by one, so check a web-sourced standards claim against the standard before quoting it.
  - **I.3 item 2.** Primer 7.3 names eight SST developers, so calling Novos Power the "sixth" name was wrong. The heading drops the ordinal and a new first sentence lists the eight.
  - **Appendix D.** The D.3 PDF row and the colophon statistics now say which moment each page count describes: 69 at the first build, 71 after the audit pass, 72 after the v8 amendment and 76 after the rewrite. A follow-up note records the six corrections.
  - **Chapter 9.4.** The note above the v8 table no longer says the data file still lists "the US".
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`**
  - Watchlist item 2's headline drops "fifth". Its "was" field now lists primer 7.3's full roster.
  - The footprint objection answer now matches dossier v8: manufacturing in China and Thailand, contract manufacturing in India, R&D in Germany, and a Richardson base that only the company's website describes.
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`** — the data file is inlined again, byte-identically.
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/mmsst-fig-watchlist-delta.svg`** — Figure M1 is regenerated with the new headline. The other thirteen figures regenerated identically and were left as they were.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages.

### Notes

- **Scope.** The v07.34r prompt put the data file, the companion and the figures out of bounds for the rewrite. This prompt asked for the looks-wrong list to be fixed, and item 6 sits in the data file.
- **Archive rotation is not due.** The counter reads `107/100`, but 15 sections carry today's date, leaving 92 non-exempt.

## [v07.35r] — 2026-09-23 08:57:20 PM EST

> **Prompt:** *(no new prompt — this version works the fresh-subagent audit that the v07.34r prompt required; that prompt is quoted in full under v07.34r)*

The fresh audit of the Megmeet SST briefing rewrite returned fifteen findings. Most sat in the dossier-v8 corrections. All fifteen were worked: fourteen fixed and one verified correct. The PDF stays at 76 pages with 84 numbered references.

### Fixed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`**
  - **Chapter 13, first objection.** The FCC Covered List sentences carry their web number again. The v8 rewrite had left them in front of a dossier-v8 number, which made them read as v8's. The Dallas-lab and San Jose sentence is also cited to the web again.
  - **Chapter 9.3.** The unsourced lead "larger than the filings show" becomes "the website and the filings differ". The closing line no longer merges the website's 35,000 sq ft base and the licensed 39,200 sq ft renovation into one site.
  - **Chapter 16.2.** The US-plant item keeps its original question: whether the November 2024 plant, the Richardson base and the Dallas lab are the same thing. It no longer implies the plant is the Richardson base, and it restores the caveat that capacity and timeline are unpublished.
  - **Week-one question 6.** The GB300/ODM fact is attributed again to the Goldman Sachs note relayed by Sina, with "neither named".
  - **Chapter 14.** "The story is settled, and it is wrong" becomes "the question is now closed, and the record does not support the story".
  - **Chapter 9.4.** The note above the v8 table now says two things were not rewritten: the first table is annotated rather than changed, and the data file still lists "the US" among the manufacturing locations.
  - **Smaller fixes:**
    - 9.2's added "read from the grid down" is dropped;
    - the Power Brick gloss is dropped;
    - the 6.2 analysis passage carries its gold A;
    - I.2's NOGRR row is back to "meets it by design";
    - question 13 no longer calls DMTF a protocol;
    - chapter 2's EV-charging order is explicit again.
  - **Chapter 10, Heron row.** Megmeet's "manufacturing base across five countries" contradicted the corrected footprint. It is now six bases, five in China and one in Thailand, citing v8.
  - **Appendix D.** The rewrite note lists every extension of the v8 corrections and the one attribution change: the 60.92% growth now belongs to the power-products segment. It also records that figure captions carry numbers and summarises the audit.
  - **Cover.** "overnight" is restored.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages.

### Notes

- **Verified, not changed:** audit finding 7. The chapter 1 walkthrough's DAB/CLLC/MFT bullet cites primer figure 4, which sits in §3.1 and whose caption states exactly that stage.
- **Archive rotation is not due.** The counter reads `106/100`, but 14 sections carry today's date, leaving 92 non-exempt.

## [v07.34r] — 2026-09-23 08:50:50 PM EST

> **Prompt:** "Rewrite the Megmeet SST onboarding briefing for clarity and learning, and convert its citation tags to numbered, colour-coded superscripts. This is an editing pass on a finished document: no new research, no new facts, no lost facts.
>
> ## What you are editing
> - Source: repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html (about 1,030 lines, 72 printed pages, five parts plus appendices A–D).
> - Output: the same file, rebuilt to repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf with `node scripts/build-megmeet-sst-briefing-pdf.mjs` (and `--png` for proof pages).
> - Context, read before you start: repository-information/megmeet-briefing-prompt.md (why the document exists and who it is for), chapter 9.4 in full, Appendix C, and Appendix D (the colophon, which records the design decisions you must not undo by accident).
> - Pre-flight check: chapter 9.4 must contain a second table headed "What dossier v8 records". If it does not, the evening-of-23-September amendment has not reached main. Stop and say so.
>
> ## Who reads it, and what "better" means
> The reader is the developer: a new Senior Sales Manager for SST solutions at Megmeet, starting 2026-10-07. The goal is to learn the technology and the market well enough to hold an engineering conversation, not to skim.
> - Explaining a concept thoroughly beats being concise. Cut words that carry nothing: throat-clearing, repeated caveats, stacked qualifiers, sentences that restate the previous one. Never cut a step in an explanation. If a paragraph assumes something the reader has not been taught yet, add the missing step. Define every term the first time it appears, even when the glossary also has it.
> - Write like a careful human expert explaining to a colleague. Vary sentence length. Use concrete nouns and active verbs. Use a plain-language analogy where it genuinely helps, then give the precise statement. Avoid stock phrasing, chains of em-dashes, bold on every other clause, and rhetorical triplets. Keep technical precision: units, voltage classes, standards numbers and dates stay exact.
> - Keep the structure. Keep the parts, the chapter numbers, the figure numbers and the table columns. A table may be split or a paragraph turned into a list if that is clearer, but no chapter moves and no figure is dropped.
> - Scripted language stays scripted. "The sentence to say it in" (chapter 1) and "the one sentence" (chapter 10) are sales lines. Tighten them, but they must stay sayable aloud.
>
> ## The citation change — from tags to numbered superscripts
> Today every factual sentence ends in a bracketed tag such as <span class="t w">[WEB, verified 2026-09-23]</span> or <span class="t d">[DOSSIER megmeet v7]</span>. There are about 590 tags but only about 89 distinct strings; 245 of the 590 are the identical WEB tag. Replace them as follows.
> 1. One number per distinct source string. Every distinct tag string becomes one numbered reference: [DOSSIER megmeet v7] is one number, [PRIMER ch.6.1] another, [GUIDANCE nvidia-800vdc p17–21] another, [WEB, verified 2026-09-23] another. Number them in order of first appearance in the document, starting at 1. Do not split the WEB tag into per-URL numbers unless the sentence-to-URL mapping is already certain from the text: Appendix C lists the URLs, but which sentence used which URL was not recorded, and a guessed mapping is worse than a shared number.
> 2. The in-text marker is a superscript number coloured by tier, placed after the sentence's final punctuation, for example <sup class="c d">7</sup>. Keep today's five tier colours exactly (.t.p, .t.d, .t.g, .t.r, .t.w map to --s1…--s5). Define sup.c rules that reuse those variables, so the colour still tells the reader the tier at a glance.
> 3. Analysis is not a source, so it gets no number. An inline [ANALYSIS] becomes a gold superscript A (<sup class="c a">A</sup>). The labelled analysis boxes (.an) stay exactly as they are.
> 4. The rule stays one source per sentence. Every factual sentence still carries exactly one superscript. The one relaxation: a table cell or list item drawn wholly from one source carries one superscript at its end, which is already the document's convention for its wide tables.
> 5. Replace the citation-contract table on the "Read this first" page with a short legend: what a superscript number means, the five tier colours each with a one-line description of the tier, the gold A, and a pointer to the numbered list.
> 6. Add the numbered reference list as a new first section of Appendix C, "C.0 Numbered references". Give one row per number with the number (in its tier colour), the tier, and the full pointer: slug and version, chapter or figure, page range, or "web research of 23 September — see the URL list below". Keep the existing tier-grouped URL list under it.
> 7. Out of scope for renumbering: megmeet-sst-briefing-data.json and megmeet-sst-briefing-companion.html keep their tag strings, because the companion inlines the data file byte for byte. Figure captions that say "Composed from megmeet-sst-briefing-data.json" stay as they are.
>
> ## One content change, and only one
> Chapter 9.4's second table lists seven places where Megmeet dossier v8 contradicts the body: week-one question 6, chapter 16.3, the consensus figure, chapter 13's footprint line, chapter 9.3's US-entity paragraph, chapter 14 and question 10 on the LITEON story, and Appendix D.2's 10 kV / 35 kV note.
> Correct the body at each of those places so it reads true, and cite dossier v8 there. Keep both 9.4 tables as the record of what changed and when. Update the sentence above the second table that says the body "has not been changed to match", because after this pass that is no longer true. Apart from those corrections, every fact, number, date, name and source stays as it is. If you find something else that looks wrong, list it in your summary. Do not fix it.
>
> ## How to work
> - Go chapter by chapter, reading each one whole before editing it. Use targeted edits, never a whole-file rewrite, and follow the repository's Incremental Writing rule.
> - Before the first edit, copy the original HTML to your scratchpad. Write a small checker there, not in the repository, that compares the original with the edited file:
>   - every number token (digits with their units and signs) that exists in the original still exists in the edited file, except where the 9.4 corrections deliberately change one;
>   - every distinct original tag string maps to exactly one reference number;
>   - every superscript number resolves to a row in C.0, and every row in C.0 is used;
>   - no sentence ends a factual claim without a superscript or an analysis marker.
>   Run it after every chapter and fix what it reports before moving on.
> - Proof the PDF by looking at it. Build with --png and read every proof page. Then build the PDF and read the pages for the legend, the first chapter, chapter 9, and C.0. Report the page count before and after.
> - Get a fresh audit. When the rewrite is complete, give a fresh subagent no drafting context. Have it compare the original and the rewritten HTML chapter by chapter for three things: a fact that changed, a caveat or limitation that was dropped, and a concept explanation that got harder to follow. Work every finding.
> - Update Appendix D. Add a short note that the document was rewritten for clarity and its citations renumbered on the date of the run. Say what changed in the citation system and what did not. Do not name any AI model anywhere in the document; the colophon records effort and run window only, as it does now.
> - Commit and push under the repository's normal Pre-Commit and Pre-Push checklists. That means a repo CHANGELOG entry and a repo version bump. The study-prep files are not deployed, so there are no page or GAS version bumps.
>
> ## Do not touch
> - Any Profiler dossier, report, registry or segment file.
> - The data file, the companion, the figure script and the figures.
> - The older prep documents: the interview brief, the lesson plan and the study guide.
>
> ## Report at the end
> - Page count before and after, and the number of references in C.0.
> - The chapters where an explanation was expanded rather than cut, with one line each on why.
> - Anything you found that looks wrong but left alone.
> - The audit's findings and what you did with each."

The Megmeet SST onboarding briefing is rewritten for clarity and learning. Its 588 bracketed tier tags are now numbered, tier-coloured superscripts resolved in a new Appendix C.0, and the body is corrected at every place dossier v8 contradicts it. The PDF goes from 72 to 76 pages. The fresh-subagent audit is running against this version; its findings will be worked in the next push.

### Changed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`** — an editing pass, with no new research.
  - **Clarity.** Every term is defined at first use, long sentences are split, and repeated caveats are cut.
  - **Expanded explanations:**
    - chapter 1 gains a four-step walk through one SST, from primer figure 4;
    - I.2 explains the transformer equation and the I = P ÷ V arithmetic behind 18.5 kA;
    - chapter 6.2 works one cell count through the primer's own assumptions (0.935 kV per cell, 31.0 kV phase peak, 35 cells per phase).
  - **Structure.** Parts, chapter numbers, figure numbers and table columns are unchanged. Three paragraphs became lists: the cheat-sheet points, the rack ladder, and 5.5's advantages.
  - **Citations.** One number per distinct source string, 84 in all, numbered by first appearance, with `sup.c` rules reusing `--s1…--s5`.
    - All web research shares one number.
    - Inline `[ANALYSIS]` becomes a gold `A`. This also fixes two tags that carried the web colour.
    - The citation-contract table becomes a source legend.
    - Appendix C gains C.0, generated from the same mapping as the superscripts.
  - **Dossier v8 corrections**, each citing v8:
    - chapter 9.3's US footprint (the Richardson base);
    - chapter 13's footprint answer and its "never infer a class" cell;
    - chapter 14's LITEON row;
    - week-one questions 6 and 10;
    - 16.2's US-plant item and 16.3's greenfield contradiction, now marked resolved;
    - chapter 9.1's contrary-source box and D.2's 10 kV / 35 kV note.
    - Both 9.4 tables stay as the record. The two first-table rows that v8 revised are marked, and the sentence above the second table now says the body was corrected.
  - **Appendices.** A and B are regenerated from the rewritten chapter 1, so all three copies of the term system match.
    - Appendix C's dossier list adds `liteon v7` and `megmeet v8`, which were already cited in 9.4.
    - Appendix D gains a rewrite note, and D.2's pointers to the old citation-contract page are updated.
  - **Cover.** The footer is no longer absolutely positioned, because the longer BLUF overlapped it.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages. The `--png` proofs were read page by page.
- **`README.md`** — the tree descriptions for the briefing PDF (page count) and its source (the citation form) are updated.

### Notes

- **Not touched:** the data file, the companion, the figure script and the figures (their captions keep the original tag strings), the Profiler data, and the older prep documents.
- **Checker (scratchpad only)** compares the original and the edited HTML: number tokens, the tag → number mapping, C.0 coverage and uncited sentences. It is clean. The two number-token exceptions are formatting only (`342 x` → `342 ×`, and `native-800` reworded).
- **Archive rotation is not due.** The counter reads `105/100`, but 13 sections carry today's date, leaving 92 non-exempt.

## [v07.33r] — 2026-09-23 06:59:05 PM EST

> **Prompt:** "[Image attached: the briefing's "The Citation Contract" page — the five colour-coded source tiers (PRIMER, DOSSIER, GUIDANCE, REPORT, WEB) and the ANALYSIS label]
> I want all of the six contradictions to be reflected in briefing chapter 9.4 and want you to issue a superseding edition of the 9/23 report. I also want you to push the in-hall-power adjacent membership by regenerating segment-in-hall-power in Classroom.gs. I also want you to remove the reminder to "paste the Megmeet SST briefing prompt".
>
> Also, I want you to review the entire Megmeet SST brief with [model name withheld] and rewrite anything that could be more concise or clearer since I heard [model name withheld] writes the most like a human. I also want you to simply number the attached Citation sources and add the superscript number after the cited statement. That way, we can cut down on repeated letters and shorten the overall report. It also looks cleaner. I like the color-coded sources though, so keep that. While you are evaluating how to rewrite parts of the report, keep in mind that I will be the one reading the report and my goal is to learn, so write concisely but prioritize explaining concepts thoroughly over concision. I would like this review/rewrite task to be in a separate [model name withheld] session, so give me a prompt to paste into a new [model name withheld] session and recommend an effort level for me to set [model name withheld] to."

Follow-through on dossier v8. Chapter 9.4 of the briefing now records the six contradictions, the 23 September report is superseded by a second edition, Megmeet's `in-hall-power` adjacent membership is restored with its Classroom lesson regenerated, the briefing reminder is closed, and a paste-in prompt is written for a separate clarity-and-citation rewrite of the briefing.

### Added

- **`live-site-pages/profiler-data/reports/sst-hall-edge-block-rev2--competitive--2026-09-23.report.json`** — the superseding edition.
  - The id changes the topic slug rather than the date, because today's date already names the morning edition and the id format is `<topic>--<type>--<date>`.
  - It re-pins Megmeet v8, Delta Electronics v6 and LITEON v7; the other fifteen pins are unchanged.
  - A new first section, "What changed since the morning edition", lists the changes.
  - Key judgement 3 (Megmeet's class) now rests on the full filing search and bounds the 10 kV / 35 kV press lead against the filed IR record.
  - Key judgement 4 corrects "the only segment with an expanding gross margin" to "the only one of the three largest", and replaces the contested number-two account with its rumour origin and the third-source estimate.
  - Key judgement 8 adds the Richardson base.
  - The Megmeet rows in the class and Asia-set tables are updated, and the Megmeet section gains the company's own two-to-three-year SST timing.
  - 13 citations added (c47–c59), copied verbatim from Megmeet v8's `sources[]`, for 59 in total.
- **`repository-information/megmeet-briefing-rewrite-prompt.md`** — the prompt for the separate rewrite session:
  - clarity-first editing for a reader who is learning;
  - one number per distinct citation source (about 89), shown as tier-coloured superscripts, with a gold `A` for inline analysis;
  - a new C.0 numbered reference list, and a legend replacing the citation-contract table;
  - the dossier-v8 corrections applied to the body;
  - a scratchpad fact-preservation checker, PNG proofing and a fresh-subagent audit.
  
  The file names no model.

### Changed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`** and the rebuilt **`MEGMEET-SST-BRIEFING.pdf`** (71 → 72 pages):
  - Chapter 9.4 is retitled "What the dossier now contradicts — v7 in the older prep documents, v8 in this briefing" and gains a second table of seven rows:
    1. The Q1 2026 date covers AIDC delivery generally; North America's batch delivery is H1 2026.
    2. The greenfield-versus-Q1 tension resolves: volume, but no named reference win.
    3. Consensus is RMB 787M, not 832M.
    4. Chapter 13's footprint line overclaims: manufacturing is in China and Thailand, with contract manufacturing in India and R&D in Germany.
    5. The US base is located in Richardson, Texas, but not in the filings.
    6. The LITEON story is closed as rumour, with Megmeet a prospective third source.
    7. The D.2 10 kV / 35 kV lead is now read and bounded.
  - The colophon gains a dated amendment note. The body is otherwise unchanged; the rewrite session applies the corrections to it.
  - The data file and the companion are not touched.
- **`live-site-pages/profiler-data/reports/reports-index.json`** — the new edition is added as `current`, and the morning edition is flipped to `superseded`.
- **`live-site-pages/profiler-data/profiler-segments.json`** — Megmeet is restored to `in-hall-power` as `adjacent`. The basis is the storage-compensation layer named in the H1 2026 interim: BBU and capacitor shelves, and a DC-centre BESS. The registry mirror is synced.
- **`googleAppsScripts/Classroom/Classroom.gs` v01.87g → v01.88g** — `segment-in-hall-power` regenerated with `build-classroom-segments.py --segment in-hall-power`. Seven sections changed: players, connections, numbers, fence, where-it-sits, what-moved and read-next. `power-conversion-and-rack-power-silicon` is still due from the v8 basis-line change and was left for a separate regeneration.
- **`repository-information/REMINDERS.md`** — "Paste the Megmeet SST briefing prompt" moved to Completed Reminders at the developer's instruction; Active Reminders is now `*(none)*`.
- **`README.md`** — tree entries added for the rev2 report and the rewrite prompt; the Classroom GAS version display is updated.

### Notes

- **Checks:**
  - `check-profiler-reports.py`: 0 errors. The morning edition's three aged-pin warnings are gone now that it is superseded.
  - `check-classroom-content.py`: 0 errors.
  - `check-classroom-pipeline.py --selftest`: 15 of 15 pass.
  - Gate digest: `check-classroom-pipeline.py --base origin/main` shows no P3 finding, so `gateDigest` is unchanged. Its P1 write-set findings bind only unattended pipeline runs, not a developer session.
  - `node --check` and `check-gas-inner-scripts.js` pass, and the Profiler registry, relationship and cross-reference checks are clean.
- **Prompt blockquote:** the model name in the prompt is replaced with `[model name withheld]`, because this environment forbids model identifiers in repository files. Everything else is verbatim.
- **Archive rotation not performed:** 92 non-exempt sections, and today's are exempt. The Classroom GAS changelog reaches `50/50`, which matches the Profiler page changelog's precedent of rotating only when it exceeds 50.

## [v07.32r] — 2026-09-23 03:51:59 PM EST

> **Prompt:** "profiler Megmeet
>
> This is a **revision**, not a new profile: `live-site-pages/profiler-data/megmeet.profile.json` is at
> profileVersion 7, dated 2026-09-08, 38 sources. Cut **v8**. Follow the Profiler Command in
> `.claude/rules/profiler-app.md` end to end — archive v7 first, then research, write, register, sync,
> reconcile. Read `repository-information/PROFILER-SCHEMA.md` before writing.
>
> WHY NOW: Megmeet's Q3 2026 report is due at the CSRC statutory deadline **by 31 October 2026**. Cut v8
> before it lands so the delta is legible when it does, and so the September briefing's open questions are
> carried into the dossier rather than living only in a study-prep document.
>
> IDENTITY FIRST (step 1a — do not skip, and do not take these from the registry row):
> - Ticker/exchange: the registry says `SZSE: 002851`. Confirm off a filing cover or an exchange notice
>   dated within twelve months.
> - Legal name vs operating brand: v7's `name` field carries both the English and the native-script name
>   but `legalName` is **null**. Establish the registered legal name and set it.
> - `aka[]` is **null** and must be populated before step 7's reconciliation grep, which consumes it.
>   At minimum: 麦格米特 · Shenzhen Megmeet Electrical Co., Ltd. · Megmeet Welding (megmeet-welding.com) ·
>   Megmeet USA. Add any others you establish.
> - Still independent? Check for any transaction in the last eighteen months, and specifically the status
>   of the **pending Hong Kong listing** — v7 records it as pending and it may have moved.
>
> THE OPEN QUESTIONS TO GO AT. These are the holes the 23 September onboarding briefing named as
> unclosable from the then-current record. Each is a research target, not an assumption — if the record is
> still silent, record the silence and bound it:
> 1. **The SST's service-voltage class.** Zero "kV" mentions across all 38 sources pinned in v7 and zero
>    hits in a four-filing text scan (FY2025 annual, H1 2026 interim, two IR records) for kV, 千伏 or 中压.
>    The converter is described only as "grid HV input to 800 V DC", and the most recent filing narrowed
>    the efficiency claim to *expected*. This is the single most valuable fact in the dossier.
> 2. **What Q1 2026 "volume delivery to North American majors" actually consisted of, and who they were.**
>    v7 records it; the August 2026 interview brief says North America is greenfield with no reference win.
>    Both statements are in the corpus and they are not obviously reconcilable.
> 3. **Whether the US plant Megmeet confirmed in November 2024 is the Dallas facility.** The company
>    confirmed a US factory and never named location, capacity or timeline. The Dallas *laboratory*
>    (360 kW active, 1.5 MW roadmap, June 2026) is separately and firmly evidenced by Megmeet's own
>    English release — the two are not confirmed to be the same thing.
> 4. **Any AI-data-centre revenue line at any granularity.** None is disclosed; the power-products group
>    is the closest published proxy (+60.92% to RMB 1.841bn in H1 2026 at a 25.06% gross margin).
> 5. **FY2025 gross margin by segment beyond the appliance line**, and **absolute R&D spend** for FY2025
>    and H1 2026. Neither was located.
> 6. **Any named US customer for any product line.** None located. (Ericsson, Cisco, Juniper, Arista and
>    Accton are recorded as buying Megmeet power — establish whether any is a *US-entity* relationship.)
> 7. **OCP membership and any role in the LVDC SST specification work.** Not found, but opencompute.org
>    returned HTTP 403 to every attempt, so this is an unverified negative rather than a confirmed one.
>    If the host is reachable from your session, settle it.
> 8. **Any UL or ETL listing number for a data-centre product.** None disclosed; the company claims UL,
>    TÜV and CNAS *laboratory accreditations*, which are an in-house testing credential and not a listed
>    product. Do not let the two be conflated in the prose.
> 9. **The "displaced LITEON as the number-two NVIDIA power-shelf source" claim.** No supporting source was
>    located, the company has never claimed it, and two research houses covering the same market in
>    mid-2026 name Delta and LITEON without mentioning Megmeet. If v8 finds nothing either, say so
>    explicitly rather than omitting it.
>
> SOURCING:
> - Run `python3 scripts/check-source-reachability.py` before planning Stage 2.
> - **v7 has zero sources marked first-party** (`party` is absent on all 38) even though the registry
>   reports 58% first-party. Stage 1 is therefore genuinely under-served: exhaust megmeet.com,
>   megmeet-welding.com, the IR archive, cninfo filings and the product/datasheet pages before any
>   third-party source, and set `party` on every entry so the registry's coverage line means something.
> - Two parallel general-purpose subagents (A first-party, B third-party), ~50–70 evaluated sources.
>
> RECONCILIATION (step 7 — 13 other dossiers mention Megmeet with word boundaries):
> delta-electronics · dg-matrix · flex · huawei-digital-power · infineon · liteon · nvidia ·
> power-electronics · sinexcel · sungrow · vertiv · vicor · zhonhen. Read each hit, classify it, and act.
> Then run `check-profiler-crossrefs.py`, `sync-profiler-registry.py`, `build-profiler-graph.py` and
> `check-profiler-relationships.py`. Re-read the segment membership
> (`power-conversion-and-rack-power-silicon`, role `challenger`) against the revised `ecosystemRole` and
> product lines and move it if the record moved.
>
> DO NOT EDIT the September study-prep files — `MEGMEET-SST-BRIEFING.pdf`, its print HTML, the companion,
> the data file, or `sst-hall-edge-block--competitive--2026-09-23.report.json`. They are dated documents.
> If v8 contradicts any of them, say so in your response summary and let me decide; the briefing's
> chapter 9.4 is where that list belongs, not in this commit.
>
> Normal Pre-Commit and Pre-Push checklists. Note that the repo CHANGELOG counter is at 102/100 with 92
> non-exempt — **archive rotation fires on the first push that is not dated 23 September**, so expect to
> perform it, SHA-enriched, and deepen the clone first with `git fetch --unshallow origin main`."

Megmeet dossier cut to **profileVersion 8** under the Profiler Command, ahead of the Q3 2026 report due by 31 October. Two parallel research agents (A first-party, B third-party) evaluated about 100 sources; v8 cites 81, each with an explicit `party` (29 company · 20 disclosure · 32 independent — 60% first-party). Reconciliation revised the Delta Electronics and LITEON dossiers, where the "Megmeet displaced LITEON at #2" claim had been carried as corroborated.

### Changed

#### `live-site-pages/profiler-data/megmeet.profile.json` — v7 → v8 (v7 archived)

- **Identity verified off filings dated within twelve months.** SZSE: 002851 from the H1 2026 interim cover; registered names 深圳麦格米特电气股份有限公司 / "Shenzhen Megmeet Electrical Co.,Ltd." from the FY2025 annual report and the HKEX A1; former name "Shenzhen Megmeet Electrical Technology Co., Ltd." The legal name stays in `name` — the schema's canonical field, which the renderer already treats as the legal line when it differs from `shortName` — rather than adding the `legalName` variant shape the schema says to normalise away
- **Still independent.** No merger or sale. On **22 September 2026** the board agreed to buy the 46.30% minority of Shenzhen Megmeet Welding Technology for RMB 663.64M cash (announcement 2026-085). The **H-share A1** (filed 26 June; Huatai International and Citi; CICC HK and CMBI added 8 July) has **no hearing and no CSRC filing notice** on record as of 23 September
- **The nine open questions:**
  1. **SST voltage class — still undisclosed, now bounded.** No kV figure appears in any filing, IR record, product page (neither site has an SST page) or the April 2026 brochure. The efficiency wording went from an unqualified "超98.5%" (FY2025 annual) to "expected" (HKEX A1, H1 interim), and the SST is 预研 / 研发中. One press lead, ifeng (1 July 2026), reports "国内10kV/海外35kV" and attributes it to the 20 May call, but **the exchange-filed record of that call contains no kV**. In August the company said SST demand will not ramp for 1–2 years and that sales for 2–3 years will come from existing products
  2. **North America — the v7 wording was imprecise.** The interim dates the start of AIDC batch delivery to Q1 2026 **across its customer chain**. The North America sentence is separate: batch delivery to "部分北美大客户" in **H1 2026**, and by the 29 April annual-report date. No customer is named (NDA). The company says it was **late on GB200** with limited orders and won GB300 batch orders; Goldman (via Sina) says the first GB300 order ran through a US-headquartered ODM. That reconciles the two corpus statements: there is volume but no named reference win
  3. **US plant — located, but not in the filings.** The company's own About pages place a 35,000 sq ft "U.S. manufacturing base" in the Fujitsu Industrial Park in Richardson, Texas, and a Texas TDLR record shows a 39,200 sq ft Megmeet renovation at 2821 Telecom Parkway, Richardson (2024). The HKEX A1 lists six manufacturing bases and none in the US, and the Dallas lab release does not say it is on the same site
  4. **AI-data-centre revenue — none disclosed.** The closest statement is the August IR record: data-centre and network power grew most within the +60.92%
  5. **Found.** FY2025 segment gross margins are appliance controls 22.24% · power 22.33% · NEV 15.30% · automation 27.96% · equipment 38.51% · connection 5.06%. R&D was RMB 1,122.34M in FY2025 and RMB 621.38M in H1 2026 (the latter was already in v7)
  6. **No US-entity customer relationship is disclosed.** The Ericsson/Cisco/Juniper/Arista/Accton list originates in the company's periodic reports and its reply to the exchange inquiry, with no entity or geography given
  7. **OCP — exhibitor only.** The company exhibited at OCP Summit 2024 and 2025 and describes its products as "aligned with ORv3". Membership remains unverifiable because opencompute.org and web.archive.org both returned 403
  8. **UL — marks and lab programmes only.** The datasheets carry UL marks. UL-WTDP and UL-CTF are in-house lab programmes and stay separate from product listings in the prose. No UL or ETL file number is published for any data-centre product
  9. **The "#2 behind LITEON" claim is not supported, and v8 says so explicitly.** It traces to two early-2025 pieces that label it rumour (Sohu 2025-02-10; 产业家 2025-03-13). The company deflected the question in December 2024. Soochow (April 2026) expects Megmeet to be the **third** NVL72 PSU source, and the "~41% Delta" figure appears in no source
- **NVIDIA status sharpened:** the exchange inquiry reply defines it as a place on NVIDIA's recommended list to its downstream customers; NVIDIA's October 2025 post puts Megmeet in power-system components, not in the data-centre power-systems tier where the SST vendors sit
- **Errors in v7 corrected:**
  - The summary said power products was "the only segment with an expanding gross margin". Three of six expanded; it is the only one of the **three largest** to do so
  - The FY2024 commentary carried "~¥8.66B" FY2026 consensus. Current consensus is RMB 787M (15 institutions, 同花顺, 23 Sept), not the RMB 832M v7 recorded
  - The H1 period type `interim` is not a schema value and is now `half`
  - The footprint claim that manufacturing covers Germany is removed. Germany is R&D, and India is contract manufacturing
- **Rewritten in intel-briefing style:** products (FY2025 and H1 2026 segment margins, the three-layer AIDC framing, the welding buy-out); 24 recent developments (+9 new); technical specs (a new SST-status group and a new DC-DC brick group); leadership (shareholdings; Zhang Zhi as COO; Han Longfei as power-BG CTO); financials; strategy read (five judgments, with rank, SST, US footprint and H2 weighting); relationships (NVIDIA, LITEON and Delta re-sourced; Infineon, Vertiv and Zhonhen added); policy exposure (the filed tariff mitigation is Thailand)
- **Sources: 38 → 81**, with `party` on every entry. All 38 v7 URLs are kept with their v7 labels and dates, because the 23 September report copies them verbatim

#### Corpus reconciliation (Profiler Command step 7)

- **13 inbound dossiers reviewed and 2 changed.** The alias grep over the new `aka[]` found no additional dossiers
- **`delta-electronics.profile.json` v5 → v6 (v5 archived):** `ecosystemRole`, `strategyRead[2]` and the Megmeet relationship no longer carry the #2 claim as "directionally corroborated". They now state its rumour origin and Soochow's third-source estimate, with sources added
- **`liteon.profile.json` v6 → v7 (v6 archived):** the same correction to `ecosystemRole`, `strategyRead[2]` and the Megmeet relationship
- The other 11 mentions are roster, tier or contrast statements that v8 leaves accurate, so they are unchanged

#### Registry, segments, calendar

- **`profiler-companies.json`:** Megmeet gains `aka[]` (12 names: 麦格米特 · 深圳麦格米特电气股份有限公司 · Shenzhen Megmeet Electrical · Shenzhen Megmeet Electrical Technology · 麦米电气 · Megmeet Welding · Megmeet Welding Technology · 麦格米特焊接 · MEGMEET USA · Megmeet USA · Altatronic · MEGMEET), `megmeet-welding.com` in `domains`, and a new tagline. Sync: srcTotal 38 → 81, srcFirstPct 58 → 60; Delta 16 → 20 sources; LITEON 15 → 19
- **`profiler-segments.json`:** the `power-conversion-and-rack-power-silicon` membership stays `challenger`, now on the v8 basis line
  - An `in-hall-power` adjacent membership (BBU and capacitor shelves, DC-centre BESS) was drafted and then withdrawn. It would have required regenerating the `segment-in-hall-power` literal in `Classroom.gs`, and that is left for the developer to decide
- **`profiler-graph.json`** rebuilt (1482 edges, 1108 curated)
- **Refresh calendar:** megmeet, delta-electronics and liteon set to `lastRefreshed` 2026-09-23. Megmeet's `nextReport` stays 2026-10-30, unconfirmed: no appointment date is on record, and Q3 2025 was published 2025-10-30
- **Refresh notes:** Megmeet's watch list rewritten around v8's open items

#### `README.md`

- Archive entries added to the tree for `delta-electronics.profile.v5.json`, `liteon.profile.v6.json` and `megmeet.profile.v7.json`, plus the missing `megmeet.profile.v6.json`, which was on disk but absent from the tree

### Notes

- **Checks:** `check-profiler-crossrefs.py` 0 candidates · `check-profiler-relationships.py` 0 findings · `sync-profiler-registry.py --check` in sync, calendar in bijection · `check-classroom-content.py` 0 errors · `check-profiler-study.py` 0/0 · `check-profiler-reports.py` 0 errors (the six new warnings are the expected aged-pin notices on the 8 and 23 September reports)
- **Source reachability:** the SEC hosts, opencompute.org, web.archive.org and UL Product iQ returned 403, and szse.cn failed TLS; cninfo and hkexnews answered. A null from a blocked host bounds that host only
- **Archive rotation not performed:** 92 non-exempt sections against a trigger of 100. This push is dated 23 September, so today's sections are exempt
- **The September study-prep files and the 23 September report were not edited.** The contradictions v8 introduces are listed in the session summary for the developer

## [v07.31r] — 2026-09-23 10:28:38 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phases E and F of the Megmeet SST onboarding briefing run: **D3, the study companion**, and the **audit pass**. A fresh subagent with none of the drafting context audited the finished PDF against the plan's twelve-line rubric and returned thirty-five findings. All thirty-five were worked, the PDF and the figures were rebuilt, and every checker re-run. This closes the run.

### Added

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`

- **The study companion: seven drill widgets in one self-contained file** — a conversion-chain explorer that adds up the published stage losses and says why the totals are not an efficiency delta; a service-voltage and cell-count calculator; a loss-chain comparator that **refuses to subtract two figures whose boundaries differ** and says so; a competitor map with four filters and a Megmeet-against-X card; a programme timeline on a date slider; a Leitner flashcard deck over the twenty-six terms and twenty-three numbers, kept in `localStorage` inside try/catch and working without it; and an objection drill.
- **The data file is inlined byte for byte**, so the companion and the briefing's fourteen figures cannot disagree. No CDN, no network call of any kind, no external `src` or `href` — it opens from `file://`. Playwright-tested: every widget driven, **zero console errors, warnings, or failed requests**, screenshots kept in the session scratchpad.

### Fixed

*Thirty-five audit findings. The five that changed what the document says:*

- **"The only expanding gross margin in the company" was false on the document's own data.** Three of Megmeet's six segments expanded their gross margin in H1 2026 — power products 22.2→25.06, magnetics 5.1→8.79 and intelligent equipment 36.0→39.67 — and two pages in Part IV said so in words while the claim was repeated five times elsewhere. It now reads *the only one of the three largest segments to expand*, in the data file and in every instance.
- **The NC State / NYPA / EPRI unit was filed as class-undisclosed when the primer states its class.** The primer gives a 1 MVA unit on a **13.2 kV** feeder, June 2026, 15 kV SiC MOSFETs, energised more than ten times — so the strongest field evidence in the document was sitting in the undisclosed block with its evidence tier reading `undisclosed`, and the `field pilot` tier was empty across the whole ledger. It is now a ledger row at 13.2 kV / 1 MVA / `field pilot`, the ledger is regenerated from the data in the sort order its own intro claims, and the counts that depended on it are corrected.
- **Three figures asserted per-row sourcing they did not print.** The perspective matrix, the calendar and the business-group board now render each row's tier tags, in the tier's colour, exactly as the data file stores them. The perspective matrix was resized so that it and its caption fit one printed page — its caption had been orphaned onto the next page.
- **Part V's scope note promised a tier tag on every fact inside an answer**, which chapters 13 and 15 did not do. The note now states the convention actually used — a fact that appears only in Part V carries its tag there, a fact restated from Parts I–IV carries it where it is established — and the one fact that appeared only in Part V was tagged.
- **The cell-count multiplier appeared as 2.5×, 2.3× and 2.7× on one page.** The primer's 2.5× is the round number for the class step; the counts computed on the primer's own assumptions give 2.3× from 13.8 kV and 2.7× from 12.47 kV. All three are now stated together with which is which, and the week-one question repeats the range rather than the round number.

*And thirty more, including:* the cover's bottom-line-up-front carried fourteen untagged factual sentences on the page that promises every factual sentence carries a tier, and is now tagged sentence by sentence with its judgement moved into a labelled analysis block; four dossier versions listed in Appendix C were never cited and are now separated from the seventeen that are; the line-frequency transformer's efficiency was printed reversed and a point low as "99.0–98.5%"; "eight of the sixteen vendors share two cells" was seven of seventeen; "nine obstacles have no visible owner" was eight of the ten unsolved, with the family split restated; the lineage matrix promised ten scored attributes and scores nine; the calendar listed a quarter out of chronological order; the objection script implied US manufacturing that chapter 9 says is not claimed; the side rack borrowed the sidecar's 1 MW rating; a Heron dossier tag was covering an NVIDIA guidance fact and a single primer tag was covering four sources; a certification cost estimate named no source; `[ANALYSIS]` was used inline without being declared in the citation contract; and the colophon mis-located the hearsay box and overstated what the proof pages covered.

### Changed

#### `README.md`

- Tree entry for the study companion. `check-readme-tree.py` clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation is still not due.** The counter reads `Sections: 102/100` and nine sections carry today's date: 92 non-exempt against a trigger of 100, unchanged across all three pushes in this run.
- The companion is also published as a **private Claude artifact**; the repository file remains the source of truth.
- One CSS bug is worth recording because it was invisible: the companion's widget-panel class was `.w`, which collided with the WEB tier class `.t.w` and set `display:none` on **every** `[WEB, verified …]` tag on the page. The panel class is now `.panel`, and the Playwright test asserts that no tier tag is hidden by CSS.

## [v07.30r] — 2026-09-23 09:27:04 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phase D of the same run: **D2, the sixty-nine-page onboarding briefing PDF**, its source HTML, the data file every figure reads from, fourteen new figures and the two build scripts. The `--png` proof pages were rendered and read page by page before the PDF was called done, and eight defects they exposed were fixed — the largest being a term table blown off the page by an unbreakable URL inside a tier tag. The study companion (D3) and the Phase F audit follow in the next push.

### Added

#### `repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`

- **Sixty-nine pages in five parts with fourteen figures**, on the SST primer's print skin with a running header and page numbers. Part I is the cheat sheet, the twenty-three numbers, the five things that moved since the primer's 12 September watch-list and the calendar to day one; Part II is the technology (the term system, lineage and adjacency, what NVIDIA specifies, the value case as a perspective matrix, and limitations with a mitigation, an owner and a status word); Part III is the market (the pilot-and-test ledger with the 34.5 kV argument in cells and BIL, twenty-five obstacles each with a named owner, and what NVIDIA's and Oracle's engineers will actually ask); Part IV is Megmeet against the field; Part V is the sales layer, analysis throughout, ending with the ten week-one questions ranked by decision leverage and everything that could not be determined named rather than smoothed over.
- **A citation contract enforced sentence by sentence.** Every factual sentence carries exactly one of `[DOSSIER <slug> v<n>]`, `[PRIMER ch.x / fig.n]`, `[REPORT 2026-09-08]`, `[GUIDANCE nvidia-800vdc p<n>]` or `[WEB, verified 2026-09-23]`, or sits inside a block labelled analysis. The reader's hearsay about NVIDIA and Oracle engineering contact is boxed once on the contents page, labelled unverified, and cited nowhere.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`

- **The single source for every number in a figure or a widget** — 214 tagged records across the class ledger, the cell-count arithmetic, the business mix, twenty-five obstacles, two programme timelines, the watch-list delta, the conversion chains, the competitor map, the six business groups, twenty-six terms, ten perspectives, the lineage matrix, seven objections, ten things not to say, the ten week-one questions, the calendar and twenty-three numbers to know. Written before the figures and before the companion so the two cannot drift.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/`

- **Fourteen figures, `mmsst-fig-` prefixed**, generated from the data file on the primer's palette (re-validated against the dataviz skill's six checks on the white print surface — all six pass). No primer figure was copied; where one exists it is referenced by number.

#### `scripts/build-megmeet-sst-briefing-figures.py` and `scripts/build-megmeet-sst-briefing-pdf.mjs`

- Copies of the primer's two build scripts with the paths, the figure prefix and the DevTools port changed. The figure script's one structural difference is that it reads the data file rather than carrying numbers inline.

### Fixed

- **A term table was silently blown off the page by a URL inside a tier tag.** Four tags in chapter 1 carried a full source URL, which has no break opportunity, so the table's minimum width exceeded the page and the fourth column rendered off-paper while the rows grew to half a page each. URLs were moved to Appendix C (all forty-seven were already listed there), `overflow-wrap` was added as a safety net for every table cell, and the status chips were pinned `nowrap` so the net could not break them mid-word instead.
- **Every blended tier tag was split.** Eighty-five tags in the data file and twelve sites in the document carried two tiers; each now carries one tag per sentence, and the two scripted columns — *the sentence to say it in* in chapter 1 and *the one sentence* in chapter 10 — are labelled analysis in their chapter rather than tagged per cell. The convention for the wide reference tables is stated on the contents page.
- **Six figure defects the proof pages exposed**: text overrunning both panels of the watch-list figure; the day-one rule drawn through the next row's heading in the calendar; the class guides crossing the value labels of the 10–13 kV vendors in the class ledger; the 34.5 kV usage note truncated mid-word in the voltage ladder; a falling-margin label printed on top of its own start marker in the business-mix panel; and the two programme lanes bottom-aligned instead of top-aligned in the timelines.
- **A fourteenth figure had been generated and never placed.** The published-chain-loss chart is now Figure M4 in chapter 3, where the efficiency boundary argument is made, and the figures that followed it were renumbered.

### Changed

#### `README.md`

- Tree entries for the PDF, the source HTML, the data file, the figures directory with all fourteen SVGs listed individually, and the two build scripts. `check-readme-tree.py` is clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation was evaluated again and is still not due.** The counter now reads `Sections: 101/100`, but the threshold tests the **non-exempt** count and nine sections carry today's date: 92 non-exempt, unchanged from the previous push and below the trigger. Scenario A in the rotation examples.
- The model identifier was removed from the briefing's colophon; repository artefacts carry the effort and the run window, not the model name.

## [v07.29r] — 2026-09-23 08:03:13 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phase C of the Megmeet SST onboarding briefing run: **D1, the Profiler competitive report on the solid-state-transformer and medium-voltage hall-edge block**, authored from covered dossiers only and cut on the axis the 8 September AIDC edition could not score — the service-voltage class each vendor has actually specified. Eighteen dossiers in scope, 46 citations copied verbatim from their `sources[]`, `check-profiler-reports.py` clean. Phases 0, A and B (pre-flight, the corpus read into two scratchpad ledgers, and five bounded web-research subagents) ran before it; the briefing PDF and the study companion follow in later pushes.

### Added

#### `live-site-pages/profiler-data/reports/sst-hall-edge-block--competitive--2026-09-23.report.json`

- **A competitive report scoring eighteen vendors on disclosed service-voltage class** — `megmeet`, the four venture SST vendors (`heron-power`, `amperesand`, `dg-matrix`, `novos-power`), the Asia-headquartered set (`sungrow`, `zhonhen`, `sinexcel`, `delta-electronics`, `liteon`), the incumbents that have declared an 800 V DC position (`abb`, `ge-vernova`, `eaton`, `schneider-electric`, `vertiv`, `hitachi-energy`, `siemens-energy`) and the silicon layer (`infineon`). It **builds on and does not supersede** `aidc-power-conversion--competitive--2026-09-08`: different cut, different question, both current.
- **The finding the cut exists to expose** — the commercial leader and the specification leader are different companies, and the class is why. The only covered vendor a filing describes as supplying an MV-to-800 V DC solid-state transformer is specified 10–13.8 kV and stops there; the two most completely specified 34.5 kV-class products belong to the two smallest balance sheets in the report and neither has shipped; the only orderable solid-state medium-voltage product from an incumbent is a UPS, not a transformer; and the one venture vendor shipping hardware ships a 480 V AC skid whose own datasheet reads 96–97% peak, two to three points below its platform claim.
- **Megmeet's row is the report's own subject and it reads `undisclosed`** — across the thirty-eight sources pinned in its dossier no kV figure appears anywhere for its solid-state transformer. Its disclosed position is the rack and the sidecar (which converts 380–480 VAC, not medium voltage), where the H1 2026 interim measures the power-products group growing 60.92% at the company's only expanding gross margin. The report states the competitive risk as structural rather than commercial: the block above the rack may consolidate before Megmeet's converter has a class to quote.
- **Eight confidence-tagged key judgments, seven sections** (a what-this-adds prose section, the service-voltage class table, the venture-set table, the Asia-set table, a normalized-revenue bars figure and a labelled analysis section on Megmeet's position), **seven indicators** and **ten limitations**, in the registry's active `intel-briefing` style.
- **The honesty block carries eight gaps**, led by Megmeet's undisclosed class and by the fact that the four venture vendors closest to the block carry no normalized revenue at all — so the scale chart omits precisely the companies whose products are nearest to it. That is stated as the finding rather than left as a hole.

### Changed

#### `live-site-pages/profiler-data/reports/reports-index.json`

- Registered the new report newest-first as `current`. No `supersedes` and no status flip on any existing entry — this edition does not replace one.

#### `README.md`

- Tree entry for the new report, and the **missing entry for `aidc-power-conversion--competitive--2026-09-08.report.json`** restored — the current AIDC edition had never been listed, only its superseded 2026-08-29 predecessor. `check-readme-tree.py` is clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation was evaluated and is not due.** The counter reads `Sections: 100/100`, but the threshold in `CHANGELOG-archive.md` steps 1–3 tests the **non-exempt** count, and 8 of the 100 sections carry today's date (2026-09-23) and are exempt: 92 non-exempt is below the trigger. This is Scenario A in the rotation examples — a total at or above 100 does not by itself rotate. The clone was deepened at session start regardless, so a rotation on a later push in this run will resolve its SHAs.
- No Profiler page bump: report JSONs and the index are data-only, so the Profiler page is an indirect affect ([PC-HTML-VERSION] #2 does not fire).

## [v07.28r] — 2026-09-23 07:30:03 AM EST

> **Prompt:** "I want to run the Megmeet SST briefing overnight and wake up to a very robust comprehensive downloadable PDF that carefully considered what information I should know prior to starting a job as their "Senior Sales Manager - SST Solutions". I heard that they are in active communication with NVIDIA and Oracle's engineering teams, so I need to understand SSTs in their entirety: technical terminology, comparison with previous and adjacent technology, value in 800Vdc power infrastructure (shown from different players' perspectives), limitations and what relevant players are doing about it, which players are testing SSTs (preferably 34.5kVac instead of 12.47kVac), what obstacles are blocking its adoption (technical limitations, infrastructure issues, operation & maintenance issues, etc.), and anything else you can think of. I also want to have a good understanding of Megmeet's competitors and how we compare to them (specifically on SSTs, but I also want to know our relative positions in adjacent business units too). I want you to use as many tables, graphs, timelines, charts, diagrams, pictures, and other mechanisms to ensure I properly understand and can memorize this information. If you think interactive widgets would be useful for me to understand a specific concept, feel free to build it and present the widget(s) to me in whichever format you think would be most convenient for me. Fold this context in with the original briefing plan and carefully consider how to plan, execute, and check a comprehensive report for me - I will want you to give me a prompt to paste into a new session. Also consider which AI model and effort level I should use to generate the most cost effective report with practical usefulness and recommend it to me with reasoning. Then, give me the prompt with recommended model/effort level."

The Megmeet SST onboarding briefing plan rewritten as **v2** — the developer's widened scope folded into the deferred v1 prompt: a pre-flight run today, a corpus inventory, an ask-by-ask delta, the deliverables, a model and effort recommendation (Opus 5 `xhigh`, with the alternatives set aside and why), a phased overnight run with three checkpoint pushes and a twelve-line check rubric, the paste-in prompt, a resume prompt and a night-of checklist. Nothing was built or researched beyond the plan; the reminder in `REMINDERS.md` is untouched (developer-owned — its v1 budget line is now superseded by the plan's §4).

### Changed

#### `repository-information/megmeet-briefing-prompt.md`

- **§0 Pre-flight results as of 2026-09-23** — both v1 checks run while writing: the quarterly core queue reads `dueCount: 0`; the SST four are at v1/v2 dated 2026-09-12 → 09-19; Megmeet is v7 (2026-09-08); Oracle v5 (2026-09-21) and NVIDIA v10 carry no SST content (that material lives in the NVIDIA guidance module and the primer); `aidc-power-conversion--competitive--2026-09-08` is still `current`; matplotlib and Playwright are absent from a fresh container; the CHANGELOG counter is one push from the rotation threshold, so the rotation falls due during the overnight run.
- **§1 What the repo already holds** — the 20,000-word, 14-figure SST primer (v05.36r–v05.38r, 2026-09-12) is the technical spine the run extends rather than rebuilds; the 2026-09-08 report, the NVIDIA guidance module, the Megmeet dossier / study guide / interview brief / lesson plan (the last three five dossier versions stale), the SST four's 34.5 kV material (Heron ×12, DG Matrix ×17, Amperesand ×10, Novos ×2; Megmeet's own SST discloses no voltage class), and why neither the Markdown PDF renderer (no image support) nor Classroom (public-safety and the C2 gate surface) is used.
- **§2 The delta** — ten rows, one per ask: the term system with memorisation tables; the lineage and adjacency matrix; the value-by-perspective matrix; limitation → mitigation → who → status; the pilot-and-test ledger by service-voltage class with the 34.5 kV argument and an explicit *undisclosed* rule; the O&M, standards, utility-acceptance and procurement obstacles (the primer's thin spot — one mention of maintenance, none of spares or MTBF); the SST competitor matrix plus the adjacent-BU position table; the NVIDIA / Oracle engineering chapter with the hearsay rule; the figure and widget mechanisms; the "anything else" row.
- **§3 Deliverables** — D1 the Profiler competitive report (dossiers-only, public Pages data, builds on and does not supersede the 2026-09-08 edition); D2 the PDF from a print-HTML source on the primer's skin with `mmsst-fig-` figures and copies of the primer's two build scripts under `study-prep/megmeet/`; D3 the self-contained study companion with seven prioritised widgets, Playwright-tested from `file://`; the shared data file as the single source for every plotted number; the brief's five-part table of contents and the minimum figure set.
- **§4 Model and effort** — Opus 5 `xhigh`, one session, subagents on the same model: the repo's Xcel head-to-head (reading depth is where Opus led), the citation-tier rule and the rubric as the discipline mechanism, half Fable's per-token price and none of the Fable weekly sub-allocation, `xhigh` over `high` and `max`, latency free overnight; Fable 5.1, Sonnet 5 (offered as the Phase B subagent cost lever), Opus 5.5, effort `max` and a two-session split set aside with reasons; a ~3–5 hour, ~$120–250 API-equivalent estimate stated as judgment, not measurement.
- **§5 The run** — phases 0 · A (corpus read into two scratchpad ledgers) · B (five bounded web subagents) · C (D1, push 1) · D (data file → figures → brief chapter by chapter → PDF with proof pages, push 2) · E (companion) · F (a fresh subagent audits the PDF against the twelve-line rubric, push 3); failure handling decided in advance for a stuck branch, a failed PDF build, missing matplotlib, blocked hosts, context pressure and a dead container.
- **§6 The paste-in prompt** (new session, Opus 5, `xhigh`), **§7 the resume prompt**, **§8 the developer's night-of checklist**.

#### `README.md`

- The tree description of `megmeet-briefing-prompt.md` now describes the v2 run plan; timestamp and repo version.

## [v07.27r] — 2026-09-23 06:45:15 AM EST

> **Prompt:** "Run X — the Classroom hook — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.19 is the brief (follow its reading list in order; decide before you build, and the written decision is the deliverable either way), §3's D13 and D16 the design, repository-information/CLASSROOM-SCHEMA.md (the ref-prefix table and the stamp-fixes-the-gate section) and .claude/rules/classroom-app.md (the stamp rule, the freshness pins, the content fence, the gateDigest obligation) the shapes, and repository-information/EVENTS-SCHEMA.md §3 / §11 for what the public registry carries and what is never taught from it. E5 is Done in §11 (v07.25r; Events.gs v01.09g, Events.html v01.10w, Network.gs v01.17g) and D13's deferral condition is met — verify it yourself in live-site-pages/events-data/events-sources.json rather than taking the brief's word. Decide whether an event:<slug> provenance prefix earns its gate-surface cost; a reasoned no that names what would change the answer is a complete X. If yes: event: 'public' in CL_PROVENANCE_REF_KINDS, the CLASSROOM-SCHEMA.md mirror and a recomputed gateDigest in one commit, plus the first pre-event briefing lesson inside the content fence, folding to tracks or guidance and never briefing. Never a contact: prefix, never a Network signal or contact as an input, never a registry count as a taught fact, never a fabricated input, never an edit to check-classroom-pipeline.py or its fixtures. Write the decision and the date into §11's X row and §3's D13 row either way, and say what remains outside this plan once X closes — it is D16's last row. Verify with check-classroom-content.py, check-classroom-curriculum.py, check-classroom-pipeline.py, check-events-plan.js, check-events-registry.py and check-readme-tree.py. Bump per [PC-GS-VERSION] #1 with a changelog entry naming nothing gated; CHANGELOG entry; README tree if a file is added. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first — a shallow clone writes a wrong provenance pin that no checker can see; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then remember session."

X — the Classroom hook (design plan §3 D13, §13.19): **decided no.** Nothing built, no gate surface touched, no GAS bump, no file added. **D16's build order is complete** — Gate → N0 → Q0 → N1 → N2 → E0–E1 → B → N3 → E2–E3 → E4 → N4 → E5 → X, every row Done or decided.

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`

- **§3 D13** carries the decision: `event:` declined, not deferred again; `contact:` stays never. One-line reasoning with a pointer to the §11 row.
- **§11's X row** flipped from *Proposed — deferred behind E0 stability* to **Decided — no, v07.27r, 2026-09-23**: the deferral condition as verified (below), the three reasons, the four reopen conditions, the statement that D16's order is complete, and what remains outside it (R and Q inside the ledger; the E0 verification pass for `hours[]` / `venueLatLng` / `agendaUrl`, the `Network.html` hash router, `check-guidance-migration.js` and the Megmeet briefing outside the plan).

#### `repository-information/CLASSROOM-SCHEMA.md`

- One paragraph after the *no `note:` prefix* rule recording that there is no `event:` prefix either — declined at X with the date, the reason and the pointer to the reopen conditions — so the absence is a decision on the record rather than an omission a later session re-proposes. The prefix table itself is untouched and still mirrors `CL_PROVENANCE_REF_KINDS` byte for byte.

#### `repository-information/EVENTS-SCHEMA.md`

- §11's D13 sentence updated from *stays deferred until the registry has survived one poller cycle* to *declined at X (2026-09-23)*, pointing at the design plan's reopen conditions.

### Notes

- **The deferral condition, verified on the live file.** All 58 rows of `events-sources.json` carry `lastProbe.at = 2026-09-21`, but `git log` shows the roster written once (v06.95r, E0) and never since — those stamps are E0's own build-time probes, not the poller's. `events.json` has been touched only by E4 session 2's manual agenda rows (v07.20r). The poller's first live cycle ran (33 `Proposed` rows pending at E3's start) and no `events sync` has ever applied a diff, so the registry has stood under one poller cycle rather than survived a change from one. Recorded because the brief's evidence is not what it looks like; it did not decide X.
- **Why no, in three lines.** The pre-event briefing already exists as E5's `events plan <event>` narrative, private half included, and its public half is dossier material Classroom already stamps as `profile:` / `study:`. The fact with teaching value — who exhibits — is a Network `Signals` row that never crosses, and `mentions[]` is not attendance; what a registry row adds on its own is calendar, not mechanism, and expires with the edition, which a permanent `tracks` lesson cannot. The true cost of a tenth prefix is the map + mirror + `gateDigest` **plus** a G7 resolution rule (else every weekly run freezes the lesson as unknown), the committer contract's "exactly the nine prefixes", and the P11 guard in `check-classroom-pipeline.py` whose prefix tuple is hard-coded to the nine and which X may not edit; P4 would fire on the adding commit itself.
- **What would change the answer:** a series-level evergreen lesson once `hours[]` (2 of 96 upcoming rows), `editions[]` and the agenda structure are filled; a G7 resolution rule for `event:` written first; one applied `events sync` cycle; or the developer asking for it.
- **R's stated blocker has evidence:** the Profiler earnings desk Routine's 2026-09-22 fire committed v07.16r, so a scheduled Routine has landed a commit; the rebuilt C2 Routine's first fire on 2026-09-23 11:07Z is the next proof to read. R's row is the developer's to flip.
- **Checkers, all on the untouched code:** `check-classroom-content.py` 71 lessons · 8 tracks · 220 gate cases, 0 errors / 0 warnings; `check-classroom-curriculum.py` no structural findings; `check-classroom-pipeline.py --base origin/main` nothing to judge and `--selftest` 15 / 0; `check-events-plan.js` 151 / 0; `check-events-registry.py` OK; `check-readme-tree.py` 22 displays match, 0 findings.

## [v07.26r] — 2026-09-23 05:58:28 AM EST

> **Prompt:** "Picking up from my last session, before I continue on to run phase X, I noticed that I did not fill in the brackets when I pasted the prompt to run E5 session 2. See attached screenshots for what I see in two different starred events' "Plan" tab. I also noticed that when I toggle on the "Starred" filter, it does filter out non-starred events, but does not fill in the button blue - Fix that." (with five screenshots: the Plan tab of `acp-recharge-2026` and `ocp-global-summit-2026`, and the filter card with the Starred pill and the Starred count ringed)

### Fixed

#### `live-site-pages/Events.html`

- The filter pills never repainted their pressed state after a press. `evRender()` rebuilds the agenda and the counts but deliberately leaves the filters card alone — rebuilding it would drop the segment row's horizontal scroll position and the `data-busy` flag an in-flight score fetch sets — and `aria-pressed` is the whole of what paints a pill accent-filled (`.ev-pill[aria-pressed="true"]`). E3's **Recommended** and E4's **Signals only** each set their own pill by hand and so looked right; **★ Starred** and the three option rows never got that treatment and filtered while reading `false`. New `evSyncPills()` re-derives every filter pill's `aria-pressed` from `_evFilters` / `_evRecMode` in place, called at the top of `evRender()`. The two hand-set calls stay — they are the immediate feedback before their fetch returns, including the rollback on a failed one
- A second, latent bug from the same root cause: `evPillRow()` captured `current` at build time, and since the card is built once that snapshot never moved — so pressing an option pill a second time re-picked the same value instead of clearing it, and only **All** could undo a choice. The row now takes the `_evFilters` key and reads the live value for both the pressed state and the un-toggle; each pill carries `data-ev-val` for the sync to match on

#### `scripts/verify-events-roles.py`

- A filter-pill pass in the phone section, after the star round-trip: **★ Starred** presses to `aria-pressed="true"` with a computed background that differs from an untouched pill's and the agenda down to the one starred row, presses again to clear; a **Kind** pill paints pressed with `_evFilters.kind` agreeing with its `data-ev-val`, and a second press clears it back to **All**. The assertion is on the paint, not the attribute alone, because the attribute is only a proxy for what the developer sees. Verified both ways: with `evSyncPills()` commented out it fails with `pressed: 'false'`, the untouched background and `rows: 1` — the reported symptom exactly — and passes with it restored

### Notes

- The two starred events in the screenshots (`acp-recharge-2026`, `ocp-global-summit-2026`) show `0 booths · 0 sessions · 0 venues` because **neither registry row carries `venueLatLng`, `agendaUrl` or `hours[]`**, and no Network signal names either slug. Registry coverage across the 96 upcoming rows: `venueLatLng` 26, `agendaUrl` 16, `hours[]` 2. Every empty line in the Plan tab names the input it is missing, so the tab is rendering a thin row faithfully rather than failing. No code change — recorded so the next enrichment pass has the counts
- `ocp-global-summit-2026` carries nine Profiler `mentions[]` and still lists no booths: booths come only from `rec.signalsBySlug[slug]` — Network attendance signals — and a dossier mention is not attendance evidence (D9 / D16). Behaving as designed

## [v07.25r] — 2026-09-23 03:09:19 AM EST

> **Prompt:** "Run E5 session 2 — the post-event checklist, the ROI line and the events plan command — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.18 is the brief (follow its reading list in order, then its five build steps exactly; this closes E5), §5.6 item (5), §5.4 and §3's D9 / D12 / D15 / D16 the design, repository-information/EVENTS-SCHEMA.md §5 / §6 / §8 / §10 and repository-information/NETWORK-SCHEMA.md §3 / §8 / §10 the shapes. E5 session 1 is done in §11 (v07.24r; Events.gs v01.08g, Events.html v01.09w, Network.gs v01.16g). Live state you cannot see from the repo: the Plan tab [did / did not] open on a starred event, the top five booths [did / did not] read sensibly line by line, one meeting [was / was not] found on the contact in Network and [was / was not] in the downloaded ICS. Build the eventSlug= widening of nop=interaction's read leg in Network.gs, eop=postevent / eop=posteventmark / eop=plannarrative and the priorRoi term in Events.gs (the ROI line written once into the event's Plans row), the Post-event section with Copy plan as JSON on the Plan tab in Events.html, the events plan <event> command rule in .claude/rules/events-app.md with its CLAUDE.md pointer, and write the first narrative plan from the JSON I paste (to Drive if the connector is attached, else as text); extend scripts/check-events-plan.js and the verifier's pass. No in-app AI, no Places API, no new Profiler op, never a gmail.* scope, no second score; the session never calls any app. Verify with the E5 session-1 list and grep the served pages and both .gs for maps.googleapis, places, GmailApp, CalendarApp and linkedin.com. Bump Events.gs / Events.html / Network.gs per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree; EVENTS-SCHEMA.md §5 / §6 / §8 / §10 and NETWORK-SCHEMA.md §8; flip §11's E5 row to Done with the versions. Then hand off in chat: redeploy, open a past event's Plan tab, read the checklist and the ROI line, mark one meeting held, copy the plan JSON and paste it back for the narrative. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for X, and remember session."

E5 session 2 — the post-event close-out, the ROI line and the `events plan <event>` command. **E5 is Done.**

### Added

#### `googleAppsScripts/Network/Network.gs` (v01.16g → v01.17g)

- `nop=interaction`'s read leg widened with **`eventSlug=`** — the live contacts whose `Source Event` is that slug (with their account name, the account's stage at read time, and **one** `mailable` boolean rather than the two consent columns) and the `meeting` Interactions on the slug. One call answers everything the close-out counts, so Events needs no second op
- Each meeting row carries an inferred `held` (a later `note` / `email-out` touch on the same contact within 14 days) and the developer's explicit `mark`, both computed on Network's side because a boolean and a three-value word are strictly less data than the rows behind them. Mark rows are excluded from the touches that feed the inference — otherwise a "not held" mark reads as a later touch and inverts its own verdict
- `NW_PEER_INTERACTION_KINDS` gains `note` for that mark write; the two mark phrases are mirrored byte for byte in `Events.gs` and the mirror is asserted by the harness

#### `googleAppsScripts/Events/Events.gs` (v01.08g → v01.09g)

- **`eop=postevent&slug=`** — the checklist (cards, meetings booked, held and still unconfirmed, the follow-up count over D9's consent rule and its relative deep link) and the **ROI line** `{ cards, meetingsBooked, meetingsHeld, stageMoves }`, written **once** into the event's `Plans` row and re-read on later opens. Allowed only from the day after `end`; `not_over` before that, with the end date and today said
- **`eop=posteventmark`** — `held ∈ yes · no` written as a `note` Interaction with the `mt-` id as evidence; an explicit mark beats the inference in both directions, the newest wins, and the `Plans` row's meetings are refreshed over one read-leg call rather than a second score
- **`eop=plannarrative`** — the narrative plan's Drive URL onto the `Plans` row. The audit row carries the plan id and a flag, never the URL
- The score's seventh term **`priorRoi`**: what an *earlier edition of the same series* returned, `min(1, (cards + 3·held + 5·moves) / 40)`, seeded into `Tuning` at 0.05 so nothing reorders until there is a year of data. `lost` is deliberately not a stage move although the enum orders it past `prospecting` — a terminal negative would inflate next year's prior
- `evRecommend_` gained an `extraSlug` argument so one past event's signals survive the upcoming filter; the booth accounts for the ROI come from those rows with no dossier read, no agenda and no Overpass

#### `live-site-pages/Events.html` (v01.09w → v01.10w)

- The **Post-event** section at the top of the Plan tab once today is past the event's end: the checklist, Mark held / not held per meeting, the follow-up link, the ROI line as recorded, and a Narrative plan link field
- **Copy plan as JSON** — the whole plan plus the close-out, for the `events plan` command. Placed in the plan head **as well as** the Post-event section: the narrative plan is most use *before* a show, and an upcoming plan has no Post-event section to carry the pill

#### Rules and docs

- The **`events plan <event>` command** in `.claude/rules/events-app.md` with its CLAUDE.md pointer — the Plan tab's JSON in, a one-page narrative brief per event day out, to Drive when the connector is attached and otherwise as text. Its never-list: no app call, no spreadsheet read, no peer token, no invented booth or contact, and a plan built from pasted JSON is never committed
- The first narrative plan, for **RE+ 2026**, at `repository-information/plans/re-plus-2026-narrative-plan.md` — written with no JSON pasted, so from the registry row and nine served dossiers only, with every gap named as a gap

### Fixed

- `evRecommend_`'s new past-slug filter kept rows with an **empty** event slug (a docket, a press quote) when no extra slug was named. Caught by `check-events-signals.js` before it left the session

### Changed

- `scripts/check-events-plan.js` → 151 checks (from 100): the widened read leg, `not_over`, the four checklist counts, the ROI row written once and re-read, both mark directions, `priorRoi` 0.275 hand-computed, the empty-slug guard, and the greps over the widened leg
- `scripts/verify-events-roles.py` gained a post-event pass at phone width — screenshot `events-postevent.png`
- `scripts/check-events-score.js` and `scripts/check-events-signals.js` updated for the seventh term
- `repository-information/EVENTS-SCHEMA.md` §5 / §6 / §8 / §10 and `repository-information/NETWORK-SCHEMA.md` §8; §11's E5 row flipped to **Done**

### Known gaps

- `Network.html` has **no hash router**, so the checklist's `Network.html#drafts?sourceEvent=<slug>` deep link opens the app without pre-filtering the list. The page says so beside the link; a small Network-side route would close it, and it was left out rather than widen this session into `Network.html`
- The developer's four live-state brackets in the §13.18 prompt were pasted unfilled, so E5 session 1's live check is **unconfirmed by this session**

## [v07.24r] — 2026-09-23 02:19:54 AM EST

> **Prompt:** "Run E5 session 1 — the deterministic plan: booth list, sessions, day plan and meetings — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.17 is the brief (follow its reading list in order, then its five build steps exactly; session 2 — the post-event checklist, the ROI line and the events plan command — is not this session), §5.6 items (1)–(4), §5.4, §5.5 and §3's D4 / D9 / D12 / D15 / D16 the design, repository-information/EVENTS-SCHEMA.md §3 / §6 / §8 / §9 and repository-information/NETWORK-SCHEMA.md §3 / §8 the shapes. N4 is Done in §11 (v07.23r; Network.gs v01.15g, Network.html v01.24w) and E4 is Done (Events.gs v01.07g, Events.html v01.08w). Live state you cannot see from the repo: one brief [did / did not] open in Word, one promoted interaction [was / was not] found in Profiler's intake, the chips [did / did not] name the events on an account with signals, and the map [did / did not] open. Build eop=plan, eop=planmeeting and eop=planunbook in Events.gs (the booth list ranked by the score's own account and segment terms with a verbatim dossier line read from the served JSON, the sessions filter, the day plan with open slots and Overpass venues within 600 m cached per event — Overpass only, never Places; a booked meeting written as a meeting Interaction over a new Network far-side leg and answered as an ICS download), nop=interaction in Network.gs (peer POST behind NETWORK_PEER_TOKEN, the write leg's shape, never a body), the Plan tab on the event sheet in Events.html; scripts/check-events-plan.js on the two-VM idiom with zero live calls; the verifier's plan pass. No narrative plan, no events plan command, no post-event checklist, no Places API, no new Profiler op, never a gmail.* scope; the session never calls any app. Verify with the E4 list plus node scripts/check-events-plan.js, node scripts/check-network-brief.js and node scripts/check-network-warmth.js, and grep the served pages and both .gs for maps.googleapis, places, GmailApp, CalendarApp and linkedin.com. Bump Events.gs / Events.html / Network.gs per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; EVENTS-SCHEMA.md §3 / §8 / §10 and NETWORK-SCHEMA.md §8; flip §11's E5 row to In progress — session 1 with the versions and write the session-2 brief as §13.18. Then hand off in chat: redeploy Events and Network, open a starred event's Plan tab, judge the top five booths line by line, book one meeting and find it on the contact in Network and in the downloaded ICS. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for E5 session 2, and remember session."

### Added
- **E5 session 1 — the deterministic plan: the booth list, the sessions, the day plan and meetings** (design plan §5.6 items 1–4, D4 / D9 / D12 / D15; §11's E5 row flipped to **In progress — session 1** with the versions; the session-2 brief written as §13.18 with its paste-in prompt). `Events.gs` v01.08g: `eop=plan` (session GET, behind `recommend`) for one **starred** event — `evRecommend_(sess, true)` run once with its signal rows and account map kept (never a second score) → the **booth list** (`evPlanBooths_`: one row per account with a plan-kind signal on the event — a docket or press quote names no event — ranked `accountPresence × stageWeight × strongest confidence + segmentFit × |account.segments ∩ audience| / |audience|` with the Tuning weights, the stage on the row, every signal with its person and `contactId`; the *why* line lifted verbatim from the served `<slug>.profile.json` — `strategyRead[0]`, else the newest `recentDevelopments[].headline` — read over `UrlFetchApp` from the Pages site for the top `EV_PLAN_DOSSIER_MAX` = 15 booths, never Profiler's exec; the dossier's `decisionMakers[]` kept for the filter), the **sessions** (`evParseSessions_` over the agenda page — JSON-LD `Event` / `subEvent[]` with `startDate` / `performer` / `location`, else HTML session blocks with a heading, a time and the roster parser for the speakers — read once and cached six hours in `CacheService`; `evPlanSessionsFilter_` keeps a title naming a seat segment the event serves, a speaker who is a Network contact (a signal row carrying `contactId`), or a speaker who is a dossier decision maker, with the reason on the row), the **day plan** (`evPlanDays_`: one frame per event day from the registry's `hours[]` — `EV_PLAN_DEFAULT_HOURS` 09:00–17:00 and `hoursSource: 'default'` when the row carries none; the booked meetings and the timed sessions fixed, the ranked visits placed in rank order into the earliest free time at `EV_PLAN_VISIT_MIN` = 30 minutes, `EV_PLAN_VISITS_PER_DAY` = 6, the open slots ≥ 30 minutes between them; no booth numbers — the E4 exhibitor parsers keep names only), the **venues** (`evPlanVenues_`: one Overpass POST per event — cafés · restaurants · bars · hotels within 600 m of `venueLatLng`, normalised to `{ name, kind, lat, lng, distanceM }` by distance, ≤ 40 — cached in the script property `EV_PLAN_VENUES:<slug>` for 30 days; a failed, non-2xx or unparseable answer is an empty list, one `events_plan_venues_failed` audit row and **not** cached) and the **meetings** (the owner's `Meetings` rows on the event, the contact named through one pick-list read per account). `eop=plancontacts` — the pick list over Network's new read leg. `eop=planmeeting` (body-POST): `slug` · `contactId` · `accountId` · `date` (a day of the event) · `start` / `end` (`HH:MM`, ≤ 240 min) · `place` · `note` · `contactName` / `accountName` — the `meeting` Interaction written **first** over `nop=interaction` (the mt- id as evidence, the event slug, a one-line summary — never the note), a rejected row books nothing; then the `Meetings` row (Start / End as wall time, `ICS UID` = `<mt- id>@events.<host>`, the i- id in `Network Interaction ID`); the invite answered as RFC 5545 text — `DTSTART` / `DTEND` in UTC from the event's zone (`evLocalToUtc_` over `Utilities.formatDate`, DST-checked), folded at 75 octets, CRLF. `eop=planunbook` removes the row and leaves the Interaction (D15: it is the record). `not_configured` degrades every read and write: the plan answers without booths, a booking writes the row with no interaction id and says so. Audit rows: the slug, ids and counts. `Network.gs` v01.16g: **`nop=interaction`** — two legs on one op behind `NETWORK_PEER_TOKEN` (the session's one widening): GET with `accountId` → the live contacts under one of the owner's accounts (`id` · `name` · `title` · `role`); POST `{ owner, interactions:[ { contactId, accountId?, kind ∈ meeting · calendar, date, summary, evidence, eventSlug? } ] }` → `{ written, rejected:[ { index, reason } ], ids:[] }` through the same `nwInteractionAdd_` every session op uses — `bad_contact_id` · `contact_not_found` (deleted, another owner's) · `account_mismatch` · `bad_kind` · `bad_date` · `summary_required` (collapsed to one line, ≤ 500 — never a body) · `bad_evidence` (an Events `mt-` / `pl-` id or an `https?://` URL) · `bad_slug`; `nwPeerJsonBody_` takes the field name. `Events.html` v01.09w: the **Details | Plan** strip on the sheet (the `recommend` capability's, like the why panel), the Plan tab fetched once per open and never polled — the booths with rank, stage chip, the two terms, the verbatim line and its source, the signal chips linking their evidence; the sessions with their why chips; a day card per event day with the frame (default hours said so) and the timeline (visits, sessions, meetings, open slots); the venues with OpenStreetMap links (a link — no tiles fetched) and the venue itself; the meetings list; **Book a meeting** under an open slot (the account — booths first, then every scored account; the contact from `eop=plancontacts`; the times inside the slot; a place; one line) → `eop=planmeeting`, the `.ics` downloaded from the answer, the meeting fixed on the timeline with the slot split locally; Unbook → `eop=planunbook`; Rebuild refetches
- `scripts/check-events-plan.js` — the two-VM harness (Events' real plan functions in one context, Network's real `nwPeerAccounts_` / `nwPeerSignals_` / `nwPeerInteraction_` with `nwInteractionAdd_` in another, the peer URL routed between them; Overpass, the Pages files, two served dossiers and the agenda page as fixtures): 100 checks, zero live calls — the booth ranking against hand-computed values with the dossier line verbatim, the three session matches and the drop, the frames and open slots, three venues within 600 m and the fourth dropped, the venue cache read with zero fetches and a failure uncached, a booking's Interaction / row / ICS `DTSTART`, unbook, the six token-boundary cases flat `denied`, the write leg's seven rejections by index, `not_configured` degrading, the D12 / D15 greps
- `scripts/verify-events-roles.py` — the plan pass (the strip, one `eop=plan`, five booths with verbatim lines and stage chips, the sessions' why chips, the day cards with open slots, three OpenStreetMap links, a booking through the form with one `eop=plancontacts`, the `.ics` downloaded and read back, the meeting fixed with the slot split, Unbook); ALL CHECKS PASSED at 390 × 844, zero page errors

### Changed
- `evRecommend_` takes a `keep` flag that attaches `signalsBySlug` / `accountsById` to its answer (the plan's input; the page's `eop=recommend` never passes it) and its signal rows now carry `contactId`
- `EVENTS-SCHEMA.md` §3 (hours), §5 (Meetings as built), §8 (the E5 session ops), §10 (venues and the plan as built), §12 (the harness); `NETWORK-SCHEMA.md` §8 (`nop=interaction`), §14 (the harness); `README.md` tree (the harness, the verifier's pass, the three versions)

#### `Events.html` — v01.09w

##### Added
- The Plan tab on the event sheet: booths, sessions, the day plan with open slots, nearby venues, Book a meeting and Unbook

#### `Events.gs` — v01.08g

##### Added
- `eop=plan` · `eop=plancontacts` · `eop=planmeeting` · `eop=planunbook`

#### `Network.gs` — v01.16g

##### Added
- `nop=interaction` — the pick-list read and the meeting write behind the peer token

## [v07.23r] — 2026-09-23 01:20:11 AM EST

> **Prompt:** "Run N4 session 2 — the pre-meeting brief, promote to field note, the network map and the "will be at" chips — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.16 is the brief (follow its reading list in order, then its five build steps exactly; this closes N4), §4.4's last four bullets and §3's D4 / D9 / D15 / D16 the design, repository-information/NETWORK-SCHEMA.md §3 / §5 / §8 / §11 / §12 the shapes. N4 session 1 is done in §11 (v07.22r; Network.gs v01.14g, Network.html v01.23w). Live state you cannot see from the repo: the warmth chips [did / did not] read sensibly against three known contacts, the reconnect list [did / did not] open, and one .ics row [was / was not] confirmed as a calendar touch. Build nop=brief and nop=promote in Network.gs (the brief assembled server-side from the contact's own rows — the dossier pieces fetched by the page as N2 does; promote one-way into Profiler's existing intake path as sourceType: contact with the developer's confidence, never a dossier edit), the event names on the "will be at" read over Events' eop=signals, the 📄 Brief .docx export, the ⇈ Promote action, the "Will be at" chips and the Network map (vanilla SVG over the list payload) in Network.html; scripts/check-network-brief.js on the sandbox idiom with zero live calls; the verifier's four passes. No E5, no Routine, no new scope, no new Profiler op, never a gmail.* scope; the session never calls any app. Verify with the N4 session 1 list plus node scripts/check-network-brief.js, and grep the served page and the .gs for GmailApp, CalendarApp, gmail. and linkedin.com. Bump Network.gs / Network.html per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; NETWORK-SCHEMA.md §8 / §11; flip §11's N4 row to Done with both sessions' versions and write the next brief as §13.17. Then hand off in chat: redeploy Network, export one brief and open it in Word, promote one interaction and find it in Profiler's intake, read the chips on an account with signals, open the map. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for whatever §11 says is next, and remember session."

### Added
- **N4 session 2 — the pre-meeting brief, promote to field note, the network map and the "Will be at" chips** (design plan §4.4's last four bullets, D4 / D9 / D15 / D16; §11's N4 row flipped to **Done** with both sessions' versions; the E5 session-1 brief written as §13.17 with its paste-in prompt). `Network.gs` v01.15g: `nop=brief` (session GET, behind `contacts`) assembles one contact's own rows server-side — the contact minus the raw extraction and the card links, its account, every Interaction newest first, the account's live Signals named by Events, the warmth block, the stage — writes the D9 disclosure row through `recordDisclosure` (`network_brief rows=1 ids=<c- id>`) and a `data_export` audit of ids and counts; `nop=promote` (body-POST, behind `contacts`) copies one Interaction into Profiler's intake **through Profiler's existing note op** (`action=note` · `nop=submit`, `PROFILER_INTAKE_EXEC` from `Profiler.config.json`'s `DEPLOYMENT_ID`) as a `sourceType: contact` note with the developer's 0–100 confidence and the i- id (plus the row's own evidence and event) in the note text, the account's slug or `general` — the developer's own Profiler session read by the page from the shared origin (`ov_note_session`) and relayed once, never stored or audited; the promotion is recorded as a `note` Interaction on the contact whose Evidence Link is `promoted:<i- id>:<intake id>` (§3 keeps the source row's Evidence Link for its own evidence), which is also the duplicate guard; refusals by name before any call (`bad_interaction_id`, `bad_confidence` — the empty string caught by the harness, `profiler_session_required`, `not_found`, `deleted`, `duplicate`, `view_only`) and Profiler's relayed (`profiler_session_expired`, `profiler_admin_only`, `profiler_rejected`, `upstream_*`); the session read `nop=signals` gains `eventName` / `eventStart` per row and an `events` map + `eventsConfigured` from **one** `eop=signals` call per read (only when a row names an event; not_configured or an HTML answer degrades to slugs). `Network.html` v01.24w: the **📄 Brief** button on the contact detail → a real `.docx` (three-part OOXML over the existing store-only zip: the heading, the warmth line, Contact, Account, Timeline, Will be at, the served dossier's `strategyRead[]` and last five `recentDevelopments[]` when covered — read as N2 does, never written — and Pipeline stage); the **⇈ Promote** affordance on every History touch with a 0–100 confidence box that refuses without a Profiler sign-in and links to Profiler; the **"Will be at" chips** (one per event with Events' name and start, the kinds and confidences, the evidence links and a link into Events; "Quoted in press" and "Regulatory filing" for the no-event rows — the `press —` / `?` labels retired); the **🕸 Map** masthead card — vanilla SVG over the list payload already on the page (accounts on a ring, contacts fanned at their account, source events at the centre; account–contact and contact–event edges; drag to pan, tap to focus with the rest dimmed, a second tap on a contact opens its row; the tap decided on `pointerup` because the captured pointer's click never reaches the node)
- `scripts/check-network-brief.js` — the sandbox harness (the real `nwBriefOp_`, `nwPromoteOp_` with `nwProfilerIntake_`, `nwSignalsOp_` with `nwSignalRows_` / `nwSignalEvents_` / `nwEventsProxy_`; `UrlFetchApp` routed to an in-memory Events stub and a Profiler stub, any other call counted as escaped): 58 checks, zero live calls — see its header
- `scripts/verify-network-roles.py` — the chips · brief · promote · map passes (the two chips named by Events with the press quote as "Quoted in press"; the `.docx` download unzipped and its paragraphs read back — every section, the RE+ 2026 chip, the scan, the served `abb` dossier's developments; promote refused without a Profiler sign-in then posted with the i- id · confidence 80 · the session and the note interaction recorded; the map's node count per type against the list payload, focus, the second tap opening the row); the D17 grep on the served page; `network-map.png` — ALL CHECKS PASSED at 390 × 844, zero page errors

### Changed
- `scripts/check-scraper-people.js`: extracts the three signal helpers and `nwEventsProxy_` that `nwSignalsOp_` now calls (zero calls still — the press-quote rows name no event)
- `NETWORK-SCHEMA.md` §8 (`nop=signals` widened; `nop=brief`; `nop=promote`), §11 (the brief export), §12 (the two new audits), §14 (the harness); `README.md` tree (the harness, the verifier's passes, the Network versions)

## [v07.22r] — 2026-09-23 12:41:01 AM EST

> **Prompt:** "Run N4 session 1 — warmth, the reconnect list and the import panel — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.15 is the brief (follow its reading list in order, then its five build steps exactly; session 2 is not this session), §4.4's first two bullets and §3's D15 / D9 the design, repository-information/NETWORK-SCHEMA.md §3 / §4 / §5 / §12 the shapes. E4 is Done in §11 (v07.21r; Network.gs v01.13g, Network.html v01.22w, Events.gs v01.07g, Events.html v01.08w, Scraper.gs v02.22g). Live state you cannot see from the repo: NETWORK_CORPUS_TOKEN [is / is not] set in both projects, and one article's people [did / did not] read on an account in Network with one accepted. Build the warmth score and the cadence table in Network.gs (computed, never stored; carried on the list row beside lastTouch and on the detail), nop=reconnect, the server-side .ics / CSV parse → proposal list → nop=importconfirm writing only the ticked rows as email-in / email-out / calendar Interactions with the developer's own reference as evidence — no Gmail or Calendar scope, no trigger, no consent prompt; the Warmth chip and sort, the Reconnect card and the Import touches panel in Network.html; scripts/check-network-warmth.js on the sandbox idiom with zero live calls; the verifier's three passes. No E5, no Routine, no new scope, never a gmail.* scope; the session never calls any app. Verify with the E4 session 3 list plus node scripts/check-network-warmth.js, and grep the served page and the .gs for GmailApp, CalendarApp, gmail. and linkedin.com. Bump Network.gs / Network.html per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; NETWORK-SCHEMA.md §5; flip §11's N4 row to In progress — session 1 with the versions and write the session-2 brief as §13.16. Then hand off in chat: redeploy Network, read the warmth chips against three contacts you know, open Reconnect, paste one .ics and confirm one row. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push."

### Added
- **N4 session 1 — warmth, the reconnect list and the import panel** (design plan §4.4's first two bullets, D15 / D9; §11's N4 row flipped to **In progress — session 1 done** with the versions; the session-2 brief written as §13.16 with its paste-in prompt). Warmth and cadence are computed on every read and stored nowhere — `NETWORK-SCHEMA.md` §5 rewritten as built (the kind weights, the 90-day half-life, hot ≥ 2 · warm ≥ 0.75 · cool ≥ 0.2, the cadence table per role × relationship, the reconnect list, the import panel's request / answer / refusal shapes); §12 names the three ops' audit keys; §14 the new checker
- `scripts/check-network-warmth.js` — the sandbox harness (the real warmth and cadence helpers, the list op's single touch pass, `nwListOp_` / `nwGetOp_`, `nwReconnectOp_`, the `.ics` and CSV parsers, `nwImportOp_` / `nwImportConfirmOp_` with the real `nwInteractionAdd_` in one VM context): warmth against hand-computed values and every band edge, every cadence cell, warmth on the row and the detail from one read and stored in no tab, the reconnect order and its exclusions, the parsers on fixtures, a proposal that writes nothing with the unmatched address never written, a confirm that writes only the ticked rows with the reference · ref as evidence and refuses the rest per row, the duplicate on a re-confirm, no mail or calendar scope in the PROJECT region or the page, the page's byte-for-byte mirror of the legend constants — 66 checks, zero live calls; README tree entry
- `scripts/verify-network-roles.py` — the warmth · reconnect · import passes (the chip on every row, the Warmth sort hottest first without a request, the detail's cadence and lapse, the Reconnect card most overdue first and its Draft into the drafts flow, a pasted `.ics` → one matched and one unmatched proposal → only the ticked row confirmed with the reference); the D15 grep now names `CalendarApp` and the calendar scopes; two screenshots

### Changed
- `scripts/check-network-schema.py`: `matched` · `unmatched` join the audit-detail allow-list (counts — the checker still refuses an address, a name, a line or the reference)
- The verifier's N3 s1 sort test expects the Warmth sort live (it asserted the disabled placeholder until now)

#### `Network.gs` — v01.14g

##### Added
- `NW_WARMTH_WEIGHTS` · `NW_WARMTH_HALF_LIFE_DAYS` · `NW_WARMTH_BANDS` · `NW_CADENCE_DAYS` (§5; the only tuning surface, not a tab); `nwWarmth_` / `nwWarmthBand_` / `nwCadenceDays_` / `nwWarmthDetail_`; `nwTouchPass_` — one read of the Interactions tab answers `lastTouch` AND warmth (`nwLastTouch_` delegates to it; the export op still reads it)
- `nop=list` rows carry `warmth` + `warmthBand` beside `lastTouch`; `nop=get` answers the `warmth` block (score, band, last touch, cadence, since, overdue)
- `nop=reconnect` — the contacts past their cadence, most overdue first, the minimum row plus the lapse; do-not-contact rows left out; capped at 200; audit counts only
- `nop=import` (body-POST) — the pasted `.ics` (unfolded, VEVENT · UID · SUMMARY · DTSTART · ATTENDEE / ORGANIZER `mailto:`; DESCRIPTION never read) or CSV (RFC 4180, a header matched by name, a direction column, a Message-ID column, tab-separated accepted) parsed server-side, matched to live contacts by email, answered as a proposal list with the unmatched addresses and the already-recorded rows marked — nothing written; `nop=importconfirm` (body-POST) — the ticked rows judged per row and written as `email-in` / `email-out` / `calendar` Interactions with the developer's reference (· the UID or Message-ID) as Evidence Link and the one line as Summary; a write scope required

#### `Network.html` — v01.23w

##### Added
- The warmth chip on every list row and on the detail (with the cadence and the lapse) — the legend from `NW_WARMTH_WEIGHTS` / `NW_WARMTH_HALF_LIFE_DAYS` / `NW_WARMTH_BANDS` mirrored from the `.gs`; the Warmth sort switched on (hottest first)
- The 🔥 **Reconnect** masthead card — the lapsed contacts with the lapse and the cadence, Draft per row and for the ticked into the N3 drafts flow
- The ⇪ **Import touches** masthead panel — format select, the paste, the reference, Propose → the proposal list (a checkbox and a kind select per matched row, unmatched rows shown greyed with the reason) → Record the ticked touches → the list refreshes

## [v07.21r] — 2026-09-22 11:02:50 PM EST

> **Prompt:** "Run E4 session 3 — the Scraper-side `people[]` extraction, the `cop=people` route and Network's proxy — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.14 is the brief (follow its reading list in order, then its five build steps exactly; E4 closes with this session), §3's D17 and D9 and §5.5.1 row 5 the design, `repository-information/NETWORK-SCHEMA.md` §3 / §8 / §9 the shapes. E4 sessions 1 and 2 are done in §11 (v07.20r; `Events.gs` v01.07g, `Events.html` v01.08w, `Network.gs` v01.12g, `Network.html` v01.21w) — the sweep, its six kinds, the manual form, the docket watch and `scripts/check-events-signals.js` (103 checks) exist; extend, do not fork. Live state you cannot see from the repo: both peer tokens are set, the weekly sweep [is / is not] installed, the first live sweep's Signals now answer read [paste the status line here], and the newsroom and docket rows [did / did not] show on an account in Network. Build `people[]` in the Scraper's summarisation schema and stored items (no second model call, no backfill), the `cop=people&slug=&since=` far side behind a new `NETWORK_CORPUS_TOKEN` (`nwHandlePeer_`'s token idiom; never `CORPUS_TOKEN`, never Profiler's proxy), Network's `nwPeopleProxy_` behind `signals`, the account detail's "People in the press" list with an Accept step that writes a `press-quote` signal at 0.7 with `Evidence URL = corpus:<key>` and `Source = scraper` (the write leg gains a `corpus:` branch for that kind only), and `scripts/check-scraper-people.js` on the two-VM idiom with zero live calls. No plans (E5), no discovery Routine (R), no new scope, never widen an existing peer token — the new token is set by hand in both projects and never committed; the session never calls any app. Verify with the E4 session 2 list plus `scripts/verify-network-roles.py`, and grep the served pages and the `.gs` files for `linkedin.com`, `10times` and `attendee`. Bump every `.gs` and page touched per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no token, account or person; CHANGELOG entry; `NETWORK-SCHEMA.md` §8 / §9; flip §11's E4 row to Done with the versions and write the next brief as §13.15. Then hand off in chat: set the new token in both projects, redeploy Scraper and Network, summarise one article, read its people on the account and accept one. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; parallel sessions push, so check `git ls-remote` before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for whatever §11 says is next, and remember session."

### Added
- **E4 session 3 — the people route** (design plan D17, catalogue §5.5.1 row 5; §11's E4 row flipped to **Done** with the three sessions' versions; the N4 session-1 brief written as §13.15 with its paste-in prompt): the Scraper names the people its summarise pass reads, the `cop=people` route answers them behind a **third token namespace**, Network reads them through its own proxy and the developer accepts each one as a `press-quote` signal
- `scripts/check-scraper-people.js` — the two-VM harness (Scraper's real far side in one context, Network's real proxy, people ops and write leg in the other, the Network fetch routed into the Scraper context): **62 checks**, zero live calls
- `NETWORK-SCHEMA.md` §8 (the write leg's `corpus:` branch, the empty slug for `press-quote`, the person in the press-quote upsert key, `Source = scraper`; the session ops `nop=people` and `nop=peopleaccept`), §9 (the route as built — `since`, the default window, no back-fill, the `accepted` flag, the accept step's row) and §14 (the new harness)

### Changed
- **No back-fill** (the brief's decision over D17's "one-time admin job"): only items summarised from `Scraper.gs` v02.22g onward carry people; older items are never re-read and never answered on the route
- `scripts/check-peer-bridge.js` / `scripts/check-events-signals.js`: the Network context extracts the upsert-key helper and the name key it uses, and the corpus-key constant; both still pass (61 · 103 checks)
- `scripts/check-network-schema.py`: `items` · `people` · `covered` join the audit-detail allow-list (counts and a flag — the checker still refuses a name, a slug or a key); `scripts/verify-network-roles.py`: the people pass — read on demand only, the two-person list with the accepted one ticked, Accept posting the key and the person, the "Will be at" line re-read once, the uncovered account's line; ALL CHECKS PASSED at 390 × 844

#### `Scraper.gs` — v02.22g

##### Added
- `people[]` in the summarise call's output schema (`SCRAPER_PEOPLE_MAX` = 5 per item; role ∈ quoted · author · named; name, title, company, one-phrase context) — the same single model call, a few output tokens more, **no second call**; `scPeopleParse_` shapes and bounds the reply, `scSignalsMerge_` stores it as `ppl` in the item's Signals blob beside `evt` and `figs`
- `scHandlePeople_` / `scPeopleScan_` — `cop=people&slug=&since=[&limit=]` behind `NETWORK_CORPUS_TOKEN` (`SCRAPER_NETWORK_CORPUS_TOKEN_PROP`; the property trimmed, sub-16 refuses, every boundary case flat `denied` with zero reads, nothing audited on a refusal): rows whose blob carries `ppl`, the slug's rows, `since` honoured, one row per article key, corpus-only rows counted, ≤ 200; the audit row carries the slug, the window and counts

##### Changed
- `scHandleCorpus_`: `cop=people` is routed to the new gate **before** the `CORPUS_TOKEN` check — Profiler's token never opens it and the Network token never reaches `timeline` or `candidates`
- `SCRAPER_SIGNALS_CELL_MAX` 1500 → 2500 so the people list fits the blob in the common case; `scSignalsJson_`'s drop order gains `ppl` after `figs`

#### `Network.gs` — v01.13g

##### Added
- `NW_CORPUS_TOKEN_PROP` (`NETWORK_CORPUS_TOKEN`), `SCRAPER_CORPUS_EXEC` (the Scraper config's deployment), `NW_CORPUS_KEY_RE`, `NW_PRESS_QUOTE_CONFIDENCE` = 0.7, `NW_PEOPLE_DEFAULT_DAYS` = 90
- `nwPeopleProxy_` — `nwEventsProxy_` (and so `guidanceMentionsProxy_`) verbatim with the Scraper URL and the corpus token: `not_configured` under 16 characters with no fetch, `upstream_http_<code>`, `upstream_unreachable`, `upstream_not_json` with a snippet
- `nop=people` (session GET, behind `signals`) — the account's slug names the route; an uncovered account answers `covered:false` with no fetch; each person carries `accepted` and its signal id when the Signals tab already holds the row; audit: the account id and counts
- `nop=peopleaccept` (behind `signals`) — one `press-quote` row through the bridge's own upsert with `Source = scraper`: 0.7, `corpus:<key>`, the person's name and title, no event slug, the item's date as First Seen, the context as the note, `Contact ID` set when a live contact at that account has the same name; `read_only_scope` on a view-only share; `nwScopedAccount_` resolves the account inside the session's scope
- `nwSignalKey_` — the upsert key adds the person's name key for `press-quote` only (one article quotes several people at one account; each is its own row)

##### Changed
- `nwPeerSignalsWrite_`: a `source` argument (`events` by default, `scraper` from the accept step — never from the body); the empty `eventSlug` accepted for `docket` **and** `press-quote`; `corpus:<key>` evidence accepted for `press-quote` only (`evidence_required` on any other kind); a press quote with no person is `person_required`; the audit op names the writer

#### `Network.html` — v01.22w

##### Added
- **People in the press** on the account detail — read on a tap (never on the detail open, never a poll): per article the title, outlet, date and link; per person the name, title, company, role and context with **Accept**, or the tick when already accepted; an uncovered account's line says the route needs a dossier slug; the error text names a missing token, an unreachable corpus or a non-JSON answer
- Accept → `nop=peopleaccept`, the row flips to accepted, the status line says whether the person matched a contact, and the "Will be at" line re-reads in place (`nwSignalsFill`, split out of `nwSignalsLine`)

##### Changed
- The "Will be at" line labels a press quote `press` instead of `?` when the row has no event

## [v07.20r] — 2026-09-22 10:38:40 PM EST

> **Prompt:** "Run E4 session 2 — newsroom pages, agendas and the FERC docket watch — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.13 is the brief (follow its reading list in order, then its five build steps exactly; session 3 is not this session), §5.5 and the §5.5.1 catalogue rows 4 · 6 · 7 the design, `repository-information/EVENTS-SCHEMA.md` §3 / §8 and `repository-information/NETWORK-SCHEMA.md` §3 / §8 the shapes. E4 session 1 is done in §11 (v07.19r; `Events.gs` v01.06g, `Events.html` v01.07w, `Network.gs` v01.11g, `Network.html` v01.21w) — the sweep `evSignalsRun_`, its parsers and matcher, the manual form, the "Signals only" pill and `scripts/check-events-signals.js` exist; extend them, do not fork them. Live state you cannot see from the repo: both peer tokens are set, the weekly sweep [is / is not] installed and the first live sweep's Signals now answer read [paste the status line here]. Build the monthly newsroom / "meet us at" read per target account over the Account row's Newsroom URL (`kind = newsroom`, 0.7), the agenda read at `agendaUrl` with the roster parser reused (`kind = agenda`, 0.9, the person), recordings by manual link as the brief decides, and the FERC eLibrary RSS watch per utility / IPP account over the Scraper roster's existing feed (`kind = docket`, 0.7, no event slug — check Network's slug rule and the score's indifference); each with a fixture and a harness section in `scripts/check-events-signals.js`; the verifier only if the sheet's form gains a kind. No Scraper `people[]` or `cop=people` (session 3), no plans (E5), no discovery Routine (R), no Swapcard API; no new scope; never widen a peer token — the session never calls the app. Verify with the E4 session 1 list plus `scripts/verify-network-roles.py` if Network changes, and grep the served page and the `.gs` for `linkedin.com`, `10times` and `attendee`. Bump `Events.gs` (and `Events.html` / `Network.gs` only if touched) per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no token, account or person; CHANGELOG entry; `EVENTS-SCHEMA.md` §8; flip §11's E4 row to In progress — session 2 with the versions and write the session-3 brief as §13.14. Then hand off in chat: redeploy, Signals now, read the newsroom and docket rows on an account in Network. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; parallel sessions push, so check `git ls-remote` before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for E4 session 3, and remember session."

### Added
- **E4 session 2 — newsroom pages, agendas and the docket watch** (design plan §5.5, catalogue §5.5.1 rows 4 · 6 · 7; §11's E4 row flipped to In progress — session 2; the session-3 brief written as §13.14 with its paste-in prompt) on session 1's run, never a fork
- `EVENTS-SCHEMA.md` §8: the session-2 paragraph (the monthly newsroom read and its `EV_SIGNALS_NEWSROOM` skip state, the agenda read, recordings as manual `agenda` rows, the docket watch over the Federal Register FERC feed with no event slug, the run answer's new fields); §3's `agendaUrl` note. `NETWORK-SCHEMA.md` §3 (`Newsroom URL` carried on `nop=accounts`; `Event Slug` empty for a `docket` row), §8 (`newsroomUrl?` on the accounts answer; the empty-slug rule for `docket` only; the upsert refreshing Confidence / Note)
- `scripts/check-events-signals.js` grew from 76 to **103 checks**: a newsroom page naming a show by its edition name and another by its series with the year nearby, a 404 page audited without an account id and retried, the monthly skip (read today → skipped; aged 33 days → read again, rows updated never duplicated), customer and supplier pages never read, an agenda page and the same-URL skip, the Federal Register FERC feed (the URL asserted equal to the Scraper roster's `fedreg-ferc` row) with two watched filers, an unwatched filer and a non-filer, the docket rows through Network's real write leg with the empty slug and `bad_slug` on every other kind, the score ignoring them, `nop=accounts` carrying `newsroomUrl` only when set, the recording rows and their `Recording:` note

### Changed
- **The docket source is the Federal Register's FERC feed, not a FERC eLibrary RSS** — the Scraper roster carries none: FERC's own site is retired there as `blocked` (a browser challenge no server-side reader passes) and the roster's FERC row is the Federal Register feed, where an order or notice takes legal effect and whose item titles name the filer. Live-probed from the session (never the app): 200, 129 items, empty descriptions. Recorded in §11 and §13.14
- `verify-events-roles.py`: the signal form's kinds are `linkedin-manual` · `registrant-mail` · `agenda`
- `live-site-pages/events-data/events.json` / `events.ics`: two iMasons rows that ended 2026-09-22 flipped to `past` by `check-events-registry.py --fix-past` (the checker's own remedy; today is 2026-09-23 UTC) and the `.ics` rebuilt — 69 confirmed of 100

#### `Events.gs` — v01.07g

##### Added
- `evSweepNewsrooms_` / `evParseNewsroom_` / `evNewsroomState_` · `evNewsroomSave_` · `evNewsroomFresh_` (row 4): per `target` account with `newsroomUrl`, read unless read within `EV_NEWSROOM_DAYS` = 28 (the day parked per account id in `EV_NEWSROOM_READ_PROP`), the page text (scripts and styles stripped) matched on each target event's name, or its series with the edition's year within `EV_NEWSROOM_NEAR` = 400 characters → `newsroom` 0.7, the page as evidence, the person the page names (the roster parser over the same page); a failed page one audit row with no account id, retried next run
- `evSweepEvent_`: the agenda at `agendaUrl` through `evParseSpeakers_` → `agenda` 0.9 with the person; `same_as_speakers` when it equals the roster URL
- `EV_DOCKET_FEEDS` (the Scraper roster's `fedreg-ferc` URL), `EV_DOCKET_SEGMENT_RE`, `evDocketSegments_` (the docket segment ids found by name in `profiler-segments.json` — never hard-coded), `evSweepDockets_` (once per run, reported in `feeds[]`), `evMatchDockets_` (every watched account with a docket segment named in an item's title or text → `docket` 0.7, the item link, `eventSlug` empty)
- `EV_SIGNAL_CONFIDENCE` gains `newsroom` 0.7 · `agenda` 0.9 · `docket` 0.7; `EV_SIGNAL_MANUAL_KINDS` gains `agenda` — `evSignalManual_` prefixes the note with `Recording:` on that kind (a note already starting with "Recording" is kept; no line → `Recording`)

##### Changed
- `evSignalsRun_`: the newsroom sweep after the press match, the docket watch after it (event-independent), `pages` / `pagesFailed` counting the agenda and newsroom reads, `newsrooms{}` and `dockets{}` on the answer, `newsrooms` · `newsroomsSkipped` · `dockets` in the parked `EV_SIGNALS_LAST` and the run's audit counts

#### `Events.html` — v01.08w

##### Added
- The signal form's third kind, "Recording of a talk you watched"; the form's note and the link placeholder mention it

#### `Network.gs` — v01.12g

##### Changed
- `nwPeerAccounts_`: `newsroomUrl` on the row when it is an `https?://` value
- `nwPeerSignalsWrite_`: an empty `eventSlug` is accepted for `kind = docket` only; a malformed slug on `docket`, or an empty slug on any other kind, is still `bad_slug`

## [v07.19r] — 2026-09-22 07:50:15 PM EST

> **Prompt:** "Run E4 session 1 — the attendance signals — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.12 is the brief (follow its reading list in order, then session 1's five build steps exactly; sessions 2 and 3 are not this session), §5.5 and the §5.5.1 catalogue the design, `repository-information/NETWORK-SCHEMA.md` §3 / §8 and `repository-information/EVENTS-SCHEMA.md` §3 / §6 / §8 the shapes. B (v07.10r), E2 (v07.15r) and E3 (v07.18r; `Events.html` v01.06w, `Events.gs` v01.05g) are Done in §11. Live state you cannot see from the repo: both peer tokens are set on the live deployments, the developer confirmed the `seats` lists in `profiler-segments.json` on 2026-09-22, and `relevancePrior` in the live `Tuning` tab is 0.2 (the repo's seed stays 0.05 — it only seeds an empty tab). Build the weekly sweep in `Events.gs` (`evSignalsRun_` over every starred event plus the top ten recommended — the Map Your Show and a2z exhibitor parsers, the speaker roster from JSON-LD `performer` or HTML, the three newswire RSS feeds keyword-watched per target / customer / partner account, every hit matched to a Network account by its normalised name and written over the bridge's existing write leg with kind, confidence, evidence URL and `firstSeen`; `eop=installsignals` idempotent, `eop=signalsnow`; a failed page one audit row and nothing else), the manual signal form on the sheet's owner block in `Events.html` (account, kind ∈ linkedin-manual · registrant-mail, URL, one line, a rated confidence — the same write leg), the "Signals only" pill switched on over the cached score's `why.accounts[]` (no new op), the sweep controls and a last-swept line on the poller card, `scripts/check-events-signals.js` (a Node sandbox harness: fixture directory, speaker and RSS pages, the matcher, the three kinds and their confidences, the upsert's written-then-updated on a re-run, a LinkedIn URL never fetched and an attendee list never fetched, the admin refusals with zero fetches; zero live calls) and the verifier's signals pass. Two developer-approved extras ride this session (2026-09-22): (a) the poller's past-date guard — `evPollSource_`'s item loop proposes `new-event` / `new-edition` items whose dates have already passed; skip them and add a harness case to `scripts/check-events-poller.js`; (b) extend `scripts/check-events-registry.py` to validate `profiler-segments.json` → `seats`: both keys `storage-seller` and `aidc-power-seller` present, every `segments[]` id present in `segments[].id`, no duplicates within a seat. No newsroom pages, agendas or FERC (session 2), no Scraper `people[]` or `cop=people` (session 3), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with `node --check` on a `.js` copy of `Events.gs`, `scripts/check-gas-inner-scripts.js`, `node scripts/check-events-signals.js`, `node scripts/check-events-score.js`, `node scripts/check-peer-bridge.js`, `node scripts/check-events-poller.js`, `python3 scripts/check-events-registry.py`, `python3 scripts/check-readme-tree.py` and `scripts/verify-events-roles.py` (zero page errors at phone width; Playwright is `pip install playwright` with the pre-installed Chromium, no `playwright install`), and grep the served page and the `.gs` for `linkedin.com`, `10times` and `attendee`. Bump `Events.html` / `Events.gs` per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, account or person; CHANGELOG entry; README tree entries; `EVENTS-SCHEMA.md` §8; flip §11's E4 row to In progress — session 1 with the versions, note the two extras there, and write the session-2 brief as §13.13. Then hand off in chat: redeploy, Install signals, Signals now, open RE+ 2026 and read its accounts, add one manual signal and find it on the contact in Network. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; the C2 Routine fires Wednesday 2026-09-23 11:00 UTC and parallel sessions push, so check `git ls-remote` before pushing. The CHANGELOG stands at `Sections: 89/100` — read the live counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E4 session 2, and remember session."

### Added
- **E4 session 1 — attendance signals** (design plan §5.5, catalogue §5.5.1 rows 1 · 2 · 3 · 11 · 13; §11's E4 row flipped to In progress — session 1; the session-2 brief written as §13.13 with its paste-in prompt). `scripts/check-events-signals.js` — 76 checks, zero live calls: the real sweep, parsers, matcher and manual-signal functions of `Events.gs` in one VM context with stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService` / `ScriptApp`, and Network's **real** `nwPeerSignalsWrite_` / `nwPeerSignalsRead_` / `nwPeerAccounts_` in a second context that the peer URL routes into
- `EVENTS-SCHEMA.md` §8 "The E4 session ops" (`eop=installsignals` · `signalsnow` · `signal`, the run's answer shape, the parked `EV_SIGNALS_LAST` state), §5's `Signals` row amended, §12's checker entry; `NETWORK-SCHEMA.md` §8 (the `linkedin-manual` exemption, the person on the read leg, the session `nop=signals` GET); README tree entry for the new harness
- **Developer-approved extra (b):** `scripts/check-events-registry.py` validates `profiler-segments.json` → `seats` — both seat keys present with a non-empty `segments[]`, every id in `segments[].id`, no duplicate within a seat, no unknown seat key; proved to exit 1 on tampered copies

### Changed
- **Developer-approved extra (a):** the poller's past-date guard — `evPollSource_` skips a `new-event` / `new-edition` whose `after` dates have already passed, counted as `pastSkipped` on the source and the run; `scripts/check-events-poller.js` gains the case (two past 2025 rows in the JSON-LD fixture, never queued; 67 checks) and the panel's `signals` state assertion
- Live probes from the session (organiser and newswire pages, never the app): the Map Your Show 8_0 gallery is a client-side app whose exhibitors come from the site's own JSON proxy (`…/ajax/remote-proxy.cfm?action=search&searchtype=exhibitorgallery`), which answers with the `X-Requested-With: XMLHttpRequest` header alone — RE+ 2026 returned all 1,214 exhibitors in one call; RE+'s speakers page is a Swapcard iframe widget (no server-rendered names); PR Newswire's all-releases feed answers RSS; Business Wire's "home" channel answers an error document while the all-news channel `rss=G1QFDERJXkJeEFpRXg==` (found by probing the channel parameter) answers 812 items; GlobeNewswire could not be reached from the session's egress and is landed unverified — the run reports every feed's status
- `verify-events-roles.py`: the stub answers `netaccounts` · `signal` · `installsignals` · `signalsnow` and carries `signals` on `proposed`; the probe expects the enabled pill; a signals pass (the form fills from one `eop=netaccounts`, writes the typed row through `eop=signal` and clears; the pill narrows the agenda to the signalled event over the cached score with ≤ 1 fetch; the sweep card's Install signals / Signals now reach the stub; screenshots `events-signals.png` / `events-signals-card.png`); `verify-network-roles.py`'s stub answers `nop=signals` so the detail line renders — both ALL CHECKS PASSED, zero page errors at 390 × 844

#### `Events.gs` — v01.06g

##### Added
- The E4 block: `evSignalsRun_` (trigger handler `evSignalsTick`; `eop=installsignals` idempotent — every trigger on either name deleted, one weekly **Tuesday 06:00 America/New_York** trigger created; `eop=signalsnow` as the admin who pressed it, that owner only; the trigger sweeps every owner with a `Stars` row as `signals`): targets `evSignalsTargets_` (upcoming starred events + the top `EV_SIGNALS_TOP_N` of `evRecommend_` as the owner, starred first, deduplicated); per event `evSweepEvent_` — `evExhibitorSource_` rewrites a Map Your Show gallery URL to its JSON proxy with the XHR header and routes an a2z host to the page, any other host `unknown_host` and never fetched; `evParseMysExhibitors_` (`hit[].fields.exhname_t`, or the gallery's `card-Title` elements from an HTML fixture; a broken body throws `mys_not_json`), `evParseA2zExhibitors_`, `evParseSpeakers_` (JSON-LD `performer[]` and `Person` nodes with `worksFor` · `affiliation` · `jobTitle` via `evCollectPersons_`, else HTML speaker cards: name · title · company or "Title at Company"); once per run `evSweepFeeds_` over `EV_NEWSWIRE_FEEDS` and `evMatchPress_` (`EV_NEWSWIRE_CUE_RE` + the account key + the event's name or series key, whole-word containment via `evTextHasKey_`); the matcher `evNormaliseCompany_` (`nwNormaliseCompany_` byte for byte — `EV_LEGAL_SUFFIX_RE` mirrored) and `evAccountKeys_` (name + Profiler slug as words), `evSignalsMatcher_` over target · customer · partner; `evSignalsWrite_` in batches of `EV_SIGNALS_BATCH` over the bridge's write leg; a failed page or feed one audit row (`events_signals_page_failed` / `events_signals_feed_failed`), the poller's budgets, `stopped` on overrun; the counts parked in `EV_SIGNALS_LAST` (`evSignalsState_`, answered on `eop=proposed` as `signals`)
- `eop=signal` (`evSignalManual_`): the manual path — `bad_account_id` · `bad_slug` · `bad_kind` (only `linkedin-manual` · `registrant-mail`) · `evidence_required` · `bad_confidence` before any write, `note` collapsed to one line, optional `personName` / `personTitle`, Network's per-row rejections relayed, `not_configured` passed through; audit the kind and counts only
- `evStripTags_` reads any entity the decoder does not name as a space

##### Changed
- `evPollSource_`: the past-date guard (extra a) — `res.pastSkipped`, summed onto the run
- `evRecommend_` / `evScoreEvent_`: the signal read carries `personName` / `personTitle` when present, and the strongest signal's person rides `why.accounts[].signal`; `evPeerSignals_` passes the person through
- `handleEventsOp_`: `installsignals` · `signalsnow` · `signal` behind the `signals` capability

#### `Events.html` — v01.07w

##### Added
- The manual signal form `evSignalForm` on the sheet's owner block (`#ev-sigform`: `#ev-sig-account` from `eop=netaccounts` fetched once per session via `evLoadNetAccounts`, `#ev-sig-kind`, `#ev-sig-url`, `#ev-sig-note`, `#ev-sig-conf` defaulting to 0.8, `#ev-sig-add` → `evApiBody('signal', …)`; the form disables itself with the connect-Network line on `not_configured`; a saved row clears the fields, refetches the score and repaints the sheet's why)
- The "Signals only" pill switched on (`#ev-f-signals`, `evSignalsToggle` / `evHasSignal` over the cached `why.accounts[]`, one `eop=recommend` when nothing is cached, `evSignalsStatusLine`); `evMatches` honours `_evFilters.signals`; `evAfterWrite` refetches while the filter is on
- `evPaintWhy` names the person (`.ev-why-person`) where the signal carries one
- `evSignalsCard` on the Proposed tab (`#ev-sigcard`: the sweep's badge, `#ev-sig-install` / `#ev-sig-now` through `evPollButton` with a per-card status id, `#ev-sig-last`); `evPollButton` takes an optional status id
- `evErrText` texts for `bad_account_id` · `bad_kind` · `evidence_required` · `bad_confidence` · `linkedin_not_fetched` · `account_not_found` · `upstream_*`

#### `Network.gs` — v01.11g

##### Added
- `nwSignalsOp_` — `nop=signals` (session GET, after `validateSessionForData` + `nwRequire_(sess, 'signals')`): `accountId`, or `contactId` resolved to its account; the owner-scoped live rows, newest `Last Seen` first, with `note` and the person where present; audit ids and counts only

##### Changed
- `nwPeerSignalsWrite_`: a LinkedIn host is accepted when `kind === 'linkedin-manual'` (it rejected every kind before — the manual path could not have landed); `nwPeerSignalsRead_` carries `personName` / `personTitle` when non-empty

#### `Network.html` — v01.21w

##### Added
- `nwSignalsLine` — one "Will be at" `dt` / `dd` on the account detail (after Contacts) and the contact detail (after History), read through `nwApi('signals', …)` when the detail opens; each signal with its slug, kind, confidence, the person and the evidence link; `not_configured` / errors as text, never a throw

## [v07.18r] — 2026-09-22 05:29:45 PM EST

> **Prompt:** "Run E3 — the recommendation score — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.11 is the brief (follow its reading list in order, then its five build steps exactly), §5.4 the design, repository-information/EVENTS-SCHEMA.md §5 / §6 / §8 the shapes. B (v07.10r) and E2 (v07.15r; Events.html v01.05w, Events.gs v01.04g) are Done in §11, and E2's first live cycle has run — the weekly trigger is installed and the Proposed queue holds 33 pending rows. Do not touch the poller, the queue or events.json. Build eop=recommend in Events.gs (the six §6 terms computed server-side from Network's scored accounts and their signals over the bridge, the seat segments from profiler-segments.json, mentions[] and the owner's stars; Tuning seeded once with the default weights and a regions row and read on every score; notConfigured degrades, never fails; audit counts only), the Recommended pill and score chips on the agenda and the why panel on the sheet in Events.html (fetched on demand — no poll), scripts/check-events-score.js (a Node sandbox harness proving every term against hand-computed values, a weight change reordering, the not_configured degrade and the non-admin refusal with zero live calls) and the verifier's Recommended pass. No attendance sweeps (E4), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, node scripts/check-events-score.js, node scripts/check-peer-bridge.js, node scripts/check-events-poller.js, python3 scripts/check-events-registry.py, python3 scripts/check-readme-tree.py and scripts/verify-events-roles.py (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token or account; CHANGELOG entry; README tree entries; EVENTS-SCHEMA.md §5 and §6; flip §11's E3 row to Done with the versions and write the E4 brief as §13.12. Then hand off in chat: redeploy, press Recommended, judge the top five line by line, change a weight and press again. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The repo stands at v07.17r and the CHANGELOG at Sections: 88/100 — read the live counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E4 session 1, and remember session."

### Added
- **`Events.gs` v01.05g — `eop=recommend`, the recommendation score (E3, design plan §5.4; `EVENTS-SCHEMA.md` §6).** `evRecommend_` scores every upcoming registry row (`status` ∉ cancelled · past, not yet over) server-side from bridge data — Network's scored accounts once over `evNetworkProxy_('accounts')`, each account's signals over the `nop=signals` read leg capped at 40 (`EV_SCORE_SIGNAL_CAP`, `signalsCapped` says when it stopped), the seats' segment sets from `profiler-segments.json` → `seats` and the dossier `lastUpdated` dates from `profiler-companies.json` (both fetched from the Pages site through `evPagesJson_`), `mentions[]` from the row, the owner's registered / attended Stars for the conflict term. `evScoreEvent_` computes the six terms exactly as §6 writes them — `segmentFit` by audience share, `accountPresence` as Σ stageWeight × confidence capped at 1 with one account counted once at its strongest signal (`EV_STAGE_WEIGHT`; customer / partner / channel 0.5 at any stage), `corpusSalience` with a 12-month half-life over the newest mentioning dossier, `proximity` 1 / 0.5 / 0 from the `Tuning` `regions` row and the registry-derived country set, `conflict` −1 on an overlapping starred registered / attended event **other than the event's own star**, `relevancePrior` = relevance / 5 — and `score = Σ weight × term` to two decimals (never −0), sorted by score then slug. The answer carries the weights, the regions, `defaulted[]`, `seeded`, `notConfigured`, the counts and per event the terms and a `why` (segments matched, accounts by name with stage / stage weight / signal / evidence URL, mention slugs, conflicting starred slugs). Behind the `recommend` capability; audit counts only
- **`Events.gs` v01.05g — `evTuning_`: the `Tuning` tab seeded once and read on every score.** An empty tab receives the six §6 weight rows and a `regions` row (empty by default), each with a Note; a weight that is not a finite number in 0..1, or a term row deleted by hand, falls back to its default and is named under `defaulted[]`; a partially edited tab is never re-seeded. Editing a cell and pressing Recommended again reorders the list — no deploy
- **`Events.gs` v01.05g — degrades, never fails.** A `not_configured` Network side zeroes `accountPresence`, sets `notConfigured: true` and still computes every other term; any other upstream failure is named in `networkError` with the same degrade; an unreadable segments or companies file zeroes its term and is named under `unavailable[]`
- **`Events.html` v01.06w — the Recommended pill and the score chips (E3).** A **Recommended** pill on the Mine row (admin, `recommend` capability): every press fetches `eop=recommend` once and the agenda re-renders as one ranked "Recommended" section — a rank and a score chip on every scored row, the month-in-view label reading Recommended, the status line reporting the ranking (accounts and signals read, or "Network not connected — scored without your accounts", any defaulted weight, any unreadable file); pressing again restores the month groups without a request. Fetched on demand only (D14): on the pill, on a sheet opened before any score, on return to the tab and after a star write while ranked — never polled
- **`Events.html` v01.06w — the *why* panel on the sheet** replaces the E1/B placeholder line: the score and its rank, the six terms as one bar each with its weight and signed contribution (the conflict bar in the gold), the accounts with a signal by name — relationship, stage, stage weight, signal kind, confidence and the evidence link — the segments matched in the developer's seats, the dossiers that name the show as Profiler chips, the starred conflicts as links that open that event, and a Tuning line naming the tab, the preferred regions and any defaulted weight; a `notConfigured` answer paints the "connect Network" line at the top and the terms that do not need Network below it
- **`live-site-pages/profiler-data/profiler-segments.json` — a `seats` block** (`storage-seller` · `aidc-power-seller`, each `{ label, segments[], basis }`, the buyer segments per `C5-SALES-SIMULATIONS-DESIGN.md` §9's inventory). The file carried no seat → segment mapping before, and design plan §12.6 requires the score to read the seats' segments from this file at run time, never from a copy in Events — so the mapping now lives where the plan says it does. Documented in `PROFILER-SCHEMA.md` → Segments registry
- **`scripts/check-events-score.js`** — the E3 sandbox harness (the `check-peer-bridge.js` idiom): the real scoring functions of `Events.gs` in one VM context with stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService`, a fixture registry, segments and companies files and a stubbed Network far side. 70 checks: every term against a hand-computed value on three fixture events and the score to two decimals; the seed once; a weight change reordering; a malformed, an out-of-range and a deleted weight row each defaulted and named; ties broken on slug and no −0; `not_configured` and a sub-16 property degrading with no network fetch; an unreachable Network side named; the 40-account cap; a 503 on the segments file zeroing `segmentFit` and named; `recommend` refused to an analyst with zero fetches and zero tab opens; no audit row carrying an account name, id or token. Zero live calls
- **`scripts/verify-events-roles.py` — the Recommended pass** (§13.11 step 5): the stub answers `eop=recommend` with three scored upcoming events in reverse date order; the pill issues exactly one request, the agenda re-orders into one "Recommended" section with `0.91 / 0.77 / 0.42` chips and ranks 1–3, the label reads Recommended, the top event's *why* leads with the score, six bars with weights and widths following the terms, the stub account with its stage, signal and evidence link, the segments, mention chips and the starred conflict, and unpressing restores the month groups without a request. Screenshot `events-recommended.png`. ALL CHECKS PASSED, zero page errors at 390 × 844

### Changed
- **`EVENTS-SCHEMA.md`** — §5 the `Tuning` row now states the seeded defaults, the `regions` row and the fallback rule; §6 rewritten around the implementation: the seat source (`seats`), one-account-once at its strongest signal, the stage-weight table's edge rows (`channel`, a target past `none`), the calendar-month decay from the dossiers' `lastUpdated`, the derived same-country rule, the self-exclusion on conflict, the 40-account cap, the answer shape and the degrade rules; §12 registers `check-events-score.js`
- **`PROFILER-SCHEMA.md`** — Segments registry: the `seats` row
- **`NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's E3 row flipped to **Done — v07.18r** with the versions and what landed; **§13.12 written** — the E4 brief (three sessions per §5.5.1: session 1 the exhibitor and speaker diffs, the newswire RSS and the manual path; session 2 newsroom pages, agendas and the FERC docket watch; session 3 the Scraper-side `people[]` and the `cop=people` route) with the paste-in prompt for session 1
- **README tree** — the Events entry carries `v01.06w` · `v01.05g` and the E3 line; `check-events-score.js` added under scripts; the verifier's description carries the Recommended pass

### Notes
- **Every verifier green:** `node --check` on the `.js` copy of `Events.gs`; `check-gas-inner-scripts.js` (11 files, 106 blocks); `check-events-score.js` 70/70; `check-peer-bridge.js` and `check-events-poller.js` unchanged and green; `check-events-registry.py` OK; `check-readme-tree.py` 0 findings; `verify-events-roles.py` ALL CHECKS PASSED with the new pass, zero page errors
- **Not touched, as instructed:** the poller, the Proposed queue, `events.json`; no attendance sweep, no plans, no discovery Routine; neither peer token widened; the session never called the app
- **Session context** written in the same commit (the "remember session" of this prompt) so the session stays at one push

## [v07.17r] — 2026-09-22 04:20:59 PM EST

> **Prompt:** "Before I start on E3, I want to close a couple open items:\n\n* I can confirm that \"My Card\" works as intended on Network.\n* When I try to export 2 cards in a vCard bundle (.vcf) with card images included, it works on my PC, but fails on my phone. On my phone, it looks like it's about to ask me to log into my Gmail to verify permissions, but then it quickly switches back to Network and then shows an \"Aw Snap\" error (see attached screenshot). What's going on? Fix it.\n* What should I set \"NW_POSTAL_ADDRESS\" to in my Network Apps Script?\n* How do I redeploy Events.gs from the Apps Script editor?" *(two screenshots attached: the previous session's close-out, and Chrome's "Aw, Snap!" page on Android at the moment of the crash)*

### Fixed
- **`Network.html` v01.20w — the vCard PHOTO splice crashed the mobile renderer (the reported "Aw, Snap!").** Root cause is `nwVcardFold`, not the Drive consent flash the symptom suggested: the original folded by re-slicing a shrinking `line` (`line = ' ' + line.slice(75)`), so every pass had to flatten the cons string the previous pass built — quadratic in the line's length. Property lines are short and were never affected; a PHOTO line is not. The stored card front is the 2,000 px capture (~600 KB), whose base64 is a ~800 KB single line, i.e. ~11,000 passes: **measured at 18.3 s and multiple GB of allocation churn per card on desktop-class V8**, which desktop Chrome absorbs and a phone renderer answers with an OOM kill. Two cards doubled it. `nwVcardFold` is now flat — it indexes the source string and `join`s once — verified byte-for-byte identical to the old output for every length 0–1,200 and at 200,000 chars, and **1,679× faster** on the 800 KB line (18,329 ms → 10.9 ms). A `PROJECT OVERRIDE` comment records why it must not be written back as a loop
- **`Network.html` v01.20w — the front is no longer base64-encoded at capture size.** `nwCardFrontBytes` (raw `arrayBuffer` → `nwBytesToB64`) is replaced by `nwCardFrontPhoto`: fetch as a Blob, `createImageBitmap` → canvas at `NW_VCARD_PHOTO_MAX` 720 px / `NW_VCARD_PHOTO_Q` 0.8, and base64 taken straight out of `toDataURL` — the full-size bytes are never turned into a string, and the canvas backing store is released before it is held. Typical PHOTO line ~40–90 KB (0.2 ms to fold). Falls back to the undecoded bytes only where `createImageBitmap` is absent or the image will not decode, and only under `NW_VCARD_PHOTO_RAW_MAX` (512 KB). Contacts on iOS and Android render the PHOTO at avatar size either way, and oversized PHOTO values are a known iOS import failure, so this is a fidelity-neutral fix
- **`Network.html` v01.20w — `nwBytesToB64` batches at 8 KB, not 32 KB.** `String.fromCharCode.apply` spreads its batch onto the call stack; 32,768 arguments is close enough to the engine limit to fail on a mobile renderer under memory pressure. Also builds through an array rather than `+=`

### Changed
- **`Network.html` v01.20w — the export reports progress through the photo fetches** (`Adding the card image N of M…`), which are serial and were silent
- **`NETWORK-SCHEMA.md` §11** — the PHOTO row records the 720 px re-encode; the N3 s2 paragraph names `nwCardFrontPhoto` and states the fold's flat-form requirement as a rule rather than an implementation detail

### Notes
- **No `Network.gs` change and no redeploy needed** — the PHOTO splice is entirely page-side by design (the card front lives in the developer's own Drive under `drive.file`, which the script cannot read), so the fix ships with the Pages deploy
- **The Gmail-permission flash the report describes is not the fault** and is unchanged: `nwDriveToken` calls the GIS token client with `prompt: ''`, which on an already-granted account opens and closes an auth window without interaction. On Android Chrome that window is full-screen for a moment. The crash followed it because the fold ran immediately after the token returned
- `scripts/verify-network-roles.py` — ALL CHECKS PASSED, zero page errors, 55 requests on the admin+s1+s2 pass, with the PHOTO splice exercised; `check-gas-inner-scripts.js`, `check-network-schema.py` and `check-readme-tree.py` clean; every inline `<script>` in the page re-checked with `node --check`

## [v07.16r] — 2026-09-22 09:27:50 AM EST

> **Prompt:** "[Scheduled Routine \"Profiler earnings desk\", trig_01HkrwpCULei8Gje6RGqcp1B, fired 2026-09-22T13:09:04Z.] STEP 0 — CLONE, THEN PROVE YOU CAN PUSH, BEFORE ANY RESEARCH. This Routine fires into a session with NO repository source. On 2026-09-16 a run completed a full IREN/Jinko/Oracle refresh, committed it locally as a378a96, and was DENIED on push — every minute of that work was thrown away. Do not repeat it. Establish the push path first, while it still costs nothing. [clone + unshallow + dry-run push probe steps, then:] You are a fresh session in the LightAISolutions/Sales repo, running the Profiler earnings desk. Read repository-information/profiler-refresh-calendar.json. It is the queue. DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run, oldest nextReport first. Anything left over is due again tomorrow — do not exceed the cap. For each row you take: 1. Verify the report actually published (the row's source names where to look). If it has not, re-date the row with the real date, set confirmed accordingly, and move on — write no dossier. 2. Run the Profiler Command in .claude/rules/profiler-app.md end to end, INCLUDING the news triage step in \"News Triage — Scraper Corpus Bridge\". Use the row's watch[] as the research priorities. CORPUS_TOKEN: [REDACTED — never committed to a public repo, per the prompt's own instruction]. 3. Advance the row: new nextReport (researched), confirmed, source, lastRefreshed, and refresh watch[] where the picture moved. Also: for any row that is unconfirmed and whose nextReport is within seven days, confirm the date and update the row. That is calendar work, not a refresh, and does not count against the cap. Land one commit per run under the repo's normal Pre-Commit / Pre-Push checklists. NEVER write the corpus token into any file, commit message, CHANGELOG entry or pushed artifact — the repo is public via Pages. It belongs in this prompt only. NEVER create, update or delete a Routine/trigger. The calendar is the only schedule. If you find yourself wanting to arm a follow-up, write the date into the row instead. IF NOTHING IS DUE: stand down. [reporting requirements omitted here, satisfied in-session]"

### Changed
- **Refreshed the NOVONIX (`novonix`) dossier to `profileVersion` 2** (v1 archived to `live-site-pages/profiler-data/archive/novonix.profile.v1.json`) — the sole due row on the Profiler earnings desk queue (`nextReport` 2026-09-14, a Nasdaq minimum-bid-price compliance deadline, not an earnings date). Verified via two parallel research subagents (first-party SEC EDGAR + IR sources, third-party trade press/market-data corroboration) plus the Scraper news corpus: the 2026-09-14 Nasdaq cure deadline passed with the compliance outcome still **unconfirmed by any primary source** as of 2026-09-22 (price data makes mechanical compliance likely but is explicitly not treated as a substitute for a Nasdaq determination); a Yorkville funding-agreement amortisation event triggered 2026-09-10 (ASX VWAP below the A$0.12 floor), obligating a US$7.0m redemption due 2026-09-21 whose payment is not yet independently confirmed; a non-binding MOU with ACP Technologies, LLC (2026-09-16) for a domestic pitch-coated synthetic graphite anode material; interim customer (Panasonic) testing feedback on the June C-sample (2026-09-10): 12 of 14 specification parameters met; and a 2026-09-18 anonymous-source closure claim publicly denied by CEO Mike O'Kronley as "unequivocally false" after the company confirmed dismissing a contractor. Resolved the registered-office address discrepancy flagged in the prior version (71 Eagle Street confirmed current; 66 Eagle Street was stale third-party LEI data). Added 8 new sources; updated `strategyRead` (Yorkville mechanism, collection gaps, indicators to watch), `policyExposure` (Nasdaq regime), and the `panasonic` relationship entry accordingly
- **`profiler-companies.json`** — `novonix` registry entry re-synced via `sync-profiler-registry.py` (`lastUpdated` → 2026-09-22, `srcTotal` 69 → 76) and tagline updated to reflect the Yorkville amortisation event and the still-unresolved Nasdaq deadline
- **`profiler-data/profiler-graph.json`** — rebuilt via `build-profiler-graph.py` (1,482 edges, 1,107 curated)
- **`profiler-data/archive/archive-index.json`** — `novonix` entry added (v1 archived 2026-09-22)
- **`profiler-refresh-notes.json`** / **`profiler-refresh-calendar.json`** — `novonix` row converted from the one-time Nasdaq-deadline date to the ordinary quarterly-activities cadence per the row's own prior instruction: `nextReport` → 2026-10-29 (Q3-2026 quarterly activities report, inferred from the established cadence, `confirmed: false`), `lastRefreshed` → 2026-09-22; `source` and `watch[]` rewritten to record the still-open Nasdaq determination and Yorkville-payment-confirmation items, the two new watch items (ACP Technologies MOU, the closure-rumor denial), and the resolved registered-office item

## [v07.15r] — 2026-09-22 07:40:08 AM EST

> **Prompt:** "Run E2 — the poller and events sync — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.10 is the brief (follow its reading list in order, then its six build steps exactly), §5.3 the design, repository-information/EVENTS-SCHEMA.md §1 / §3 / §4 / §7 the shapes. E0 (v06.95r), E1 (v07.08r), B (v07.10r) and N3 (v07.14r; Events.html v01.04w, Events.gs v01.03g) are Done in §11. Build the weekly no-AI poller in Events.gs (evPollRun_ — the roster and the registry read from their Pages URLs with UrlFetchApp, JSON-LD and ICS sources only, blocked and manual rows never fetched, the six diff kinds written as Proposed rows deduplicated on source · slug · change · after, a failed source an audit row and nothing else), the admin Proposed panel on Events.html (Approve / Reject through eop=decide, Approved → copy as JSON, Mark applied, the Polls tab's last outcome per source, eop=installpoller idempotent), the events sync session command in a new .claude/rules/events-app.md (apply the approved JSON to events.json, advance lastConfirmed and the roster's lastProbe, rebuild events.ics, gate on check-events-registry.py exit 0, list the pr- ids to stamp), and scripts/check-events-poller.js, a Node sandbox harness proving the six diff kinds, the zero-row re-run, the never-fetched rows and the admin refusals with zero live calls. No score (E3), no signals (E4), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, node scripts/check-events-poller.js, python3 scripts/check-events-registry.py, python3 scripts/check-readme-tree.py and scripts/verify-events-roles.py (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, spreadsheet id or trigger id; CHANGELOG entry; README tree entries; EVENTS-SCHEMA.md §5 and §7; register the rules file in CLAUDE.md; flip §11's E2 row to Done with the versions and write the E3 brief as §13.11. Then hand off in chat: redeploy, Install poller, Poll now, approve a row, run events sync in a fresh session. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 85/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E3, and remember session."

### Added
- **E2 — the poller and `events sync` (design plan §5.3; §13.10 all six steps; §11's E2 row → Done).** `Events.gs` v01.04g / `Events.html` v01.05w
- **`Events.gs` — the poller** (`evPollRun_`, the block after the bridge): the roster (`EV_ROSTER_URL`) and the registry read once per run from their Pages URLs with `UrlFetchApp` (never a GitHub host); `evPollSkipReason_` keeps every `blocked`, `cadence: manual`, `html` / `manual`-feed, `robots: disallowed` or non-http row from ever being fetched; per source `muteHttpExceptions` + `followRedirects` + a try/catch, a 15-second allowance against a 270-second run budget that stops cleanly before a source that could overrun it (`EV_POLL_SOURCE_BUDGET_MS` / `EV_POLL_TOTAL_BUDGET_MS`), a 2 MB body cap; **JSON-LD** — every `<script type="application/ld+json">` block parsed on its own, arrays / `@graph` / `subEvent` walked, `@type` `Event` or any `…Event` subtype, `eventStatus` `EventCancelled`, the local date from the first ten characters of `startDate` / `endDate`, venue · city · region · country from the `Place` (`evParseJsonLd_`); **ICS** — a minimal RFC 5545 walker (`evParseIcs_`: unfold, `VALUE=DATE` exclusive `DTEND` moved back a day, `TZID` date-times keep their date, `SUMMARY` / `LOCATION` / `URL` / `UID` / `STATUS`, the four text escapes) that accepts what `evVevent()` and `build-events-ics.py` emit; the §1 slug reproduced (`evDeriveSlug_` — the series base plus the year, a year already in the name not doubled); the match (`evMatchRegistry_`: derived slug → same name or URL among the rows citing the key → same series base in another year → new) and the six diffs (`evDiffItem_`: `cancelled` · `moved-dates` · `changed-venue` · `changed-url` · `new-edition` with the §3 row seeded from the previous edition · `new-event` with nothing invented), Before · After as canonical JSON, deduplicated on (Source Key, Event Slug, Change, After) over every existing row whatever its status (`evProposedKeys_`); a failed or non-2xx source writes no proposal — one `Polls` row and one `events_poll_source_failed` audit row (status only); the run audit row counts only
- **`Events.gs` — the ops** (`action=events`, behind `evRequire_(sess, 'roster')`): `eop=proposed` (pending + approved rows with parsed Before / After, counts by status, the newest `Polls` row per source, whether the trigger is installed), `eop=decide` (`approved` / `rejected`, Decided At; reversible until applied — `already_applied` after), `eop=applied` (comma ids + `vXX.XXr` → `applied` with Applied In; a non-approved id skipped as `not_approved`), `eop=pollnow` (the same walk, audited as the admin), `eop=installpoller` (idempotent — every trigger on `evPollTick` or `evPollRun_` deleted, one weekly Monday 06:00 America/New_York created; the handler is the public `evPollTick()` because a time-driven trigger cannot target a `_` function); `Polls` (Source Key · Ran At · Status · Items · Newest Start) added to `EV_TABS`
- **`Events.html` — the Proposed tab** (admin · `roster`; a third tab in the strip, painted only for the admitted tier): the poller card (trigger state badge, Install poller, Poll now, Refresh, the status line, the last outcome per source with a failed status marked), the approved set as the `events sync` JSON (`evSyncJson` — `schemaVersion` 1 · `proposals[]` · `polls[]` — in a field for copying by hand and behind Copy as JSON, the version box and Mark applied → `eop=applied`, the queue counts), the pending and approved rows grouped by source with Before → After (`evDiffList`), Approve / Reject → `eop=decide`, the evidence link; loaded when the tab is opened, on Refresh and after every write — never polled (D14); a write's status survives the reload that follows it (`evReloadWith`)
- **`.claude/rules/events-app.md`** — the `events sync` session command (path-scoped to `Events.html` / `Events.gs` / `events-data/**` / `EVENTS-SCHEMA.md`, user-triggered by "events sync"): the input shape, the nine-step procedure (unshallow → read → apply per change kind → advance the roster's `lastProbe` → sort and stamp → `build-events-ics.py` → `check-events-registry.py` exit 0 as the gate, reverted on a finding → the `pr-` ids and the version to stamp → commit under the checklists), the never-list, the first-live-cycle hand-off; registered in CLAUDE.md as `## Events Sync Command` and in the Reference Files table
- **`scripts/check-events-poller.js`** — the Node sandbox harness: the real poller functions of `Events.gs` under stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService` / `ScriptApp` / `Utilities`, a fixture registry and roster served from the stub, one JSON-LD page (an Organization block, an array block, a `@graph` with a subtype and a cancellation, a broken block), one ICS feed built by `build-events-ics.py`'s own `calendar()`, a blocked, a manual, an html, a robots-disallowed and a 403 row — **63 checks**: the readers on their own, the six diff kinds one row each with the right Before · After, the zero-row re-run through `evPollTick`, the never-fetched rows, the 403's one `Polls` row + one audit row + no proposal, the five ops refused to an analyst with zero fetches and zero tab opens, decide / applied / already_applied, `installpoller` idempotent (a stale trigger on the old name removed), zero live calls
- **`scripts/verify-events-roles.py`** — the E2 pass on the admin's page against a stateful stub (`PROPOSED_STUB` / `POLLS_STUB`, `eop=proposed` / `decide` / `applied` / `pollnow` / `installpoller`): the tab is admin-only (a turned-away tier has neither the tab nor the panel), opening it issues exactly one `eop=proposed`, the rows group by source with Before → After, Approve reaches `decide` and the panel refreshes, the JSON field parses back to the approved rows and the polls, a bad version is refused on the page, Mark applied stamps both rows and the empty state appears, Install poller and Poll now reach the stub — ALL CHECKS PASSED, zero page errors at 390 × 844; screenshot `events-proposed.png`
- **`repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's E2 row flipped to **Done** (v07.15r, the versions, the first live cycle reported not asserted); **§13.11 written**: the E3 brief (the score, `Tuning`, `eop=recommend`, the Recommended pill and the *why* panel, `scripts/check-events-score.js`, the verifier pass) and its paste-in prompt

### Changed
- **`repository-information/EVENTS-SCHEMA.md`** — §5 gains the `Polls` tab; §7 now records the poller (the never-fetched set, the budget, the two readers, the match, the six diffs, the dedup, the failure path), the five ops and their shapes, the trigger handler, the sync JSON, and the command's apply rules; §12 lists `check-events-poller.js`
- **`CLAUDE.md`** — `## Events Sync Command` section after Industry Guidance; `.claude/rules/events-app.md` in the Reference Files table
- **`README.md`** — `Events.html` v01.05w · v01.04g with the E2 description; `events-app.md` under `.claude/rules/`; `check-events-poller.js` under `scripts/`; the verifier's entry extended
- **`repository-information/SESSION-CONTEXT.md`** — remember session
## [v07.14r] — 2026-09-22 07:15:53 AM EST

> **Prompt:** "Run N3 session 2 — the exports, the drafts and the QR card — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.9 is the brief (steps 5–8 only — session 1's steps 1–4 landed at v07.13r and §11's N3 row reads In progress — session 1), §4.3 the design, repository-information/NETWORK-SCHEMA.md §3 (the Drafts and Mailings tabs and NW_DRAFT_STATUS already exist), §10 / §11 (the hand-off and export formats), §12 / §13 the shapes, and the code you extend: Network.gs nwExportOp_ (session 1's nop=export with format=csv — add xlsx through the Receipts temp-spreadsheet path with Contacts / Accounts / Interactions sheets and vcard hand-rolled, per contact and as one .vcf bundle, PHOTO;ENCODING=b;TYPE=JPEG from the card front only when the user ticks "include card image", base64 folded at 75 octets; every export keeps the D9 do-not-contact exclusion and the recordDisclosure row), nwBulkOp_ / nwListOp_ (the shapes to match), nwInteractionAdd_ (the email-out row a sent draft writes); Network.html nwBar (session 1's action bar — the CSV button becomes an Export menu with the "include card image" tick, the disabled Mailing button becomes Start a mailing), nwEditCard / nwReviewSection (the editor idiom), nwDownloadText (the download helper). Build (6) the follow-up drafts per D15: pick recipients from the selection (Do Not Contact excluded, Consent Marketing = no excluded) → a saved template from the Mailings tab (name, subject, body) or one written now with {{first}}, {{company}}, {{metAt}}, {{lastTopic}} → nop=drafts renders one editable draft per recipient into the Drafts tab (status = draft) → a review list edited in place → hand off by .eml bundle (one RFC 5322 file per draft, From typed once and kept in localStorage, an unsubscribe line and a postal address in the default template), one-column CSV / .txt, per-draft copy (subject + body), or mailto: → nop=draftstatus marks sent (writes the email-out Interaction with the d- id as evidence, sets Sent At) or discarded; the app never sends — no MailApp, GmailApp or Gmail scope anywhere, and the verifier greps the served page and the .gs to assert it. (7) The "My card" panel: the developer's own vCard from the Profiles row, rendered as a QR full-screen — run grep -rn "qrcode\|QRCode\|qr-" live-site-pages/*.html first and reuse an inline generator if one exists, else a minimal byte-mode encoder (version ≤ 10, level M) in the page, no library. (8) scripts/verify-network-roles.py: the vCard bundle parses under a minimal BEGIN:VCARD walker with N / FN / EMAIL per contact, a three-recipient mailing renders three drafts, one edited draft round-trips, marking sent writes the email-out Interaction the stub records, the .eml has From / To / Subject and a body, the QR panel renders a canvas or SVG with a non-trivial module count; zero page errors at 390 × 844. No warmth, no reconnect list, no import panel (N4); no new OAuth scope; never widen a peer token. Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-network-schema.py (extend ALLOWED_KEYS only with count / id keys), python3 scripts/check-readme-tree.py and the verifier (Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Network.html / Network.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, template body or address; CHANGELOG entry; README tree descriptions; flip §11's N3 row to Done with the versions and write the E2 brief as §13.10 before closing. The iOS / Android vCard import and the second-phone QR check are reported in the hand-off, not asserted. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 84/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E2, and remember session."

### Added
- **`Network.gs` v01.10g** — `nwExportOp_` gathers the selection once (`nwExportRows_`: scope, the D9 do-not-contact exclusion, no Raw Extraction) and answers `format=csv` (unchanged), `xlsx` (`nwExportXlsx_` — the Receipts temp-spreadsheet path: Contacts / Accounts / Interactions sheets, JSON columns flattened to `email1…3` / `phone1…3`, Drive links left out, exported through the Drive endpoint, trashed, base64) and `vcard` (`nwVcard_` — hand-rolled 3.0: N / FN / ORG / TITLE / EMAIL;TYPE / TEL;TYPE / ADR / URL / X-SOCIALPROFILE / NOTE / CATEGORIES / REV / UID, RFC 2426 escaping, `nwVcardFold_` at 75 octets; `cards[]` + the `vcf` bundle); every format writes the disclosure row through `recordDisclosure` and audits counts. `nop=mailings` (templates · open drafts · the me fields), `nop=drafts` (`nwDraftsOp_` — a saved template or subject + body, `nwMerge_` over the ten merge fields incl. `{{lastTopic}}` from `nwLastInteraction_` and `{{myAddress}}` from the `NW_POSTAL_ADDRESS` property, one Mailings row per render with the list filter, one Drafts row per recipient, `skipped[]` with `do_not_contact` / `no_consent` / `no_email` / `not_found` / `deleted` / `duplicate` / `bad_id`), `nop=draftstatus` (`draft` = an edit, `sent` = the `email-out` Interaction through `nwInteractionAdd_` with the d- id as evidence + Sent At, `discarded`; `already_sent` afterwards), `nop=mycard` (GET / `set=1` on the Profiles row — Title and Phone columns added to `NW_TABS.profiles`, the header-upgrade idiom appends them). D15 held: no `MailApp` / `GmailApp` / Gmail scope anywhere in the PROJECT region
- **`Network.html` v01.19w** — the bar's CSV button becomes an Export menu (CSV · Excel · vCard bundle · vCards one per contact as a zip · the "include card image" tick — `nwBulkExport`, `nwCardFrontBytes` fetching the front with the user's own drive.file token, `nwVcardWithPhoto` splicing `PHOTO;ENCODING=b;TYPE=JPEG` folded at 75 octets), `nwZip` (a hand-rolled store-only zip with CRC-32) and `nwDownloadBlob`; "Start a mailing" enabled → the follow-up drafts panel (`nwMailPanel` / `nwMailOpen` / `nwMailRender` — recipients from the selection, saved templates + the default template with the unsubscribe line and `{{myAddress}}`, merge-field chips, `nwDraftsPaint` / `nwDraftBlock` edited in place with Save edit, Copy, Mail app (`mailto:`, Copy fallback over 1,800 characters), Mark sent after a confirm that says nothing is sent, Discard; the hand-off row — `.eml` bundle (`nwEmlText`: From / To / Subject (RFC 2047) / Date / MIME-Version / Content-Type / X-Unsent, the From kept in `localStorage`), CSV, `.txt`); the masthead pills Drafts and My card (`nwPillsMount`, admin only); the My card panel (`nwMyCardPanel` — name · title · company · phone through `nop=mycard`, the QR preview) and the full-screen QR overlay; `nwQrMatrix` — a byte-mode QR encoder, versions 1–10 at level M, GF(256) Reed–Solomon, the eight masks scored, format and version information — and `nwQrSvg`; the repo had only QR decoders (`grep -rn "qrcode\|QRCode\|qr-" live-site-pages/*.html`), so no generator was reused
- **`scripts/verify-network-roles.py`** — the stub answers `nop=export` for all three formats, `nop=mailings`, `nop=drafts`, `nop=draftstatus` and `nop=mycard`, and the Drive stub serves a card front for `alt=media`; tests for the vCard bundle under a minimal `BEGIN:VCARD` walker (N / FN / EMAIL per card), the PHOTO splice (one Drive fetch, base64 of the stub JPEG, every line ≤ 75 octets), the per-contact zip, the `.xlsx` bytes, a three-recipient mailing → three drafts with no `{{` left and the template saved, one edited draft round-trip, `mailto:` and Copy, the `.eml` bundle (three RFC 5322 files with From / To / Subject and a body) and the `.txt`, Mark sent → the `email-out` Interaction with the d- id as evidence, Discard, the Drafts pill, My card → the QR (the preview and the full-screen SVG ≥ 29 × 29 modules, the page's matrix equal to python-qrcode's at the same version and mask when importable), and the D15 grep of the served page and the `.gs` PROJECT region; the session-1 CSV test opens the Export menu first; ALL CHECKS PASSED, zero page errors at 390 × 844. Screenshots `network-export-menu.png`, `network-drafts.png`, `network-my-card-qr.png`
- **`repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's N3 row flipped to **Done** (v07.13r + v07.14r, the versions, the iOS / Android import and the second-phone QR reported not asserted); **§13.10 written**: the E2 brief (the poller, the `Proposed` panel, `events sync` in a new `.claude/rules/events-app.md`, `eop=installpoller`, `scripts/check-events-poller.js`) and its paste-in prompt

### Changed
- **`repository-information/NETWORK-SCHEMA.md`** — §3 Profiles gains Title · Phone; §10 the three drafts ops, the `.eml` headers and the zip, the template's out-of-region `sendHipaaEmail` noted; §11 the export op's three formats and the QR encoder; §12 the s2 audit keys; §14 the verifier's s2 scope
- **`scripts/check-network-schema.py`** — `ALLOWED_KEYS` + `mailingId`, `draftId`, `skipped`, `saved`, `sent`, `discarded`, `edited`, `templates` (ids and counts only)
- **`README.md`** — `Network.html` v01.19w · v01.10g with the session-2 description; the verifier's entry
- **`repository-information/SESSION-CONTEXT.md`** — remember session

## [v07.13r] — 2026-09-22 06:46:16 AM EST

> **Prompt:** "Run N3 session 1 — the list, the filters and the bulk actions — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.9 is the brief (follow its reading list in order, then session 1's steps 1–4 exactly; session 2's steps 5–8 are a second session), §4.3 the design, repository-information/NETWORK-SCHEMA.md §3 / §4 / §12 / §13 the shapes. N2 (v06.94r) and B (v07.10r, proven live 2026-09-22 with both peer tokens set; Network.html is now v01.17w after two Source Event default fixes at v07.11r–v07.12r, Network.gs v01.08g) are Done in §11. Generalise the Receipts History card into the Contacts list with search, the eight filters, the four sorts (lastTouch computed server-side once per list, the only widening of the list payload) and per-row expand to the existing detail; add multi-select with a sticky action bar — tag, set relationship / stage, export selection (CSV now; the other formats are session 2), start a mailing (session 2), soft-delete — with nop=bulk validating per row and answering rejected[] like B's signals upsert; extend scripts/verify-network-roles.py for the filters, a two-row tag and the sort flip. No warmth, no reconnect list, no import panel (N4); no new OAuth scope; never widen a peer token. Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-network-schema.py (extend ALLOWED_KEYS only with count / id keys, as N2 and B did), python3 scripts/check-readme-tree.py and the verifier (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Network.html / Network.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries; CHANGELOG entry; README tree descriptions; leave §11's N3 row In progress — session 1 with the versions. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 83/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for N3 session 2, and remember session."

### Added
- **N3 session 1 — the list, the filters and the bulk actions (design plan §4.3; §13.9 steps 1–4; §11's N3 row → In progress — session 1).** `Network.gs` v01.09g / `Network.html` v01.18w. The Receipts History card generalised into the Contacts list; session 2 (exports beyond CSV, the drafts flow, the QR card) is the next session
- **`Network.gs` — `nwListOp_` replaces the inline list branch**: search over name, title, account name and every email (`q`); the eight filters (`relationship`, `stage`, `role`, `segment` against the account's Segment IDs, `event` against Source Event, `tag`, `from` / `to` on Met Date, `consent`), applied server-side because the columns they read (Emails, Tags, Consent Marketing) are picked by `nwListRows_` under `_`-prefixed keys and **dropped before the answer** — the list payload widens by exactly one field, `lastTouch`, the newest Interaction `Date` per contact from one read of the tab (`nwLastTouch_`), per §12; an off-list enum or a malformed date answers `bad_filter`, never a silently ignored filter; `total` and `filtered` ride on the response so the page can read "2 of 5"; the audit row carries matched / total / accounts / a filtered flag
- **`nop=bulk`** (`nwBulkOp_`, body-POST, ≤ 500 ids): `op=tag` appends a lowercase tag to each contact's Tags (already there → `unchanged`; 20 already → `too_many_tags`); `op=account` sets `relationship` and / or `stage` on the selected contacts' accounts, each account validated once through `nwAccountFromPayload_` (the D5 rule — `STAGE_NEEDS_TARGET_OR_CUSTOMER` refuses that account, never applied half-way; a relationship moved off Target / Customer with no stage asked for resets the stage to None as the editor does) and memoised across its contacts. Every id is judged on its own — `bad_id`, `duplicate`, `not_found` (an unowned row answers not-found, never forbidden), `deleted`, `account_not_found`, the validator's word — and answered in `rejected[]` with its reason, the shape of B's signals upsert; `applied` / `unchanged` / `accounts` are counts; `bumpDataRev()` only when something was written
- **`nop=export`** (`nwExportOp_`, `format=csv` — `.xlsx` and vCard are session 2): the selection's ids (or, with none, every live contact in scope) as RFC 4180 text — every field quoted, CRLF rows, 24 columns (`NW_CSV_COLUMNS`) including the account's name / relationship / stage and Last Touch; a Do Not Contact row is left out (D9) and Raw Extraction never exported; **a disclosure row is written through the template's `recordDisclosure`** naming the op, the row count and the ids (never a field), and the audit row carries `rows` / `excluded` / `ids`. The page prepends the UTF-8 BOM when it builds the download
- **`Network.html` — the list tools** (`nwListTools`): the search box (Enter or Search; the request carries `q=`), the Filters drawer (collapsed until opened, its state kept across refreshes; the hint reads "2 on: role, consent"; relationship / stage / role / consent from `NW_ENUMS`, segment from `profiler-segments.json` through `nwSegments()`, source event with a `datalist` of the events on the rows shown, tag, met from / to; Apply and Clear), the sort strip (Last touch · Name · Company · Warmth — Warmth present and disabled until N4; a key starts in its natural order, newest first or A → Z, and the flip button reverses it; sorting is the page's over what every row carries, so a sort issues no request) and the select-all box. `nwContactRow` gains a checkbox (its click never opens the detail) and the `last touch` line; the count tile reads "N of total · contacts match" while a filter is on; an empty filtered list says so instead of "No contacts yet"
- **The action bar** (`nwBar`, one element fixed to the bottom of the screen, opened by the first tick): "N selected · Clear"; **Tag** (an inline form → `nwBulkTag`), **Relationship** (relationship + stage selects with "keep" options and the D5 gate mirrored — `NW_STAGE_RELS` pins the stage to None off Target / Customer → `nwBulkAccount`), **CSV** (`nwBulkExportCsv` → `nop=export` → `nwDownloadText` with the BOM), **Mailing** (disabled — session 2), **Delete** (`nwBulkDelete`: a confirm naming the count, then the existing `nop=delete` one request per row). Rejected rows are read back as "2 rejected: a stage needs a Target or Customer relationship ×2". The selection is a map pruned to the rows shown on every paint; `nwSelectSync` updates the boxes in place so an open detail stays open while the selection changes; every write refreshes the list (D14) and clears the selection
- **`scripts/verify-network-roles.py`**: the stub's `nop=list` applies the search and the eight filters as `nwListOp_` does and carries `lastTouch` / `total` / `filtered`, and answers `nop=bulk` (per-row `rejected[]`) and `nop=export` (the CSV); the tests drive the search ("1 of 5", `q=` on the request), the drawer (role; role + consent with the hint; segment; source event; tag; Clear), the sort (Name A → Z, the flip reverses it, no request issued, Warmth disabled), the multi-select (two rows ticked while a third's detail stays open), the two-row tag through `nop=bulk`, a stage alone on two Partner accounts refused per row then Target · Discovery on both (the bar's gate pins the stage for a Supplier), a real CSV download (BOM, header, two CRLF rows) and a bulk delete after a confirm naming the count; zero page errors at 390 × 844; screenshots `network-list-filters.png` and `network-list-bar.png`. ALL CHECKS PASSED
- `scripts/check-network-schema.py`: the audit-key allow-list gains five count / flag keys (`total`, `filtered`, `applied`, `unchanged`, `excluded`); exit 0 — 23 `auditLog` calls in the PROJECT region

### Changed
- `NETWORK-EVENTS-DESIGN-PLAN.md` §11: the N3 row → **In progress — session 1** with the versions; `NETWORK-SCHEMA.md` §12 records the N3 list widening, the bulk audit shape and the export disclosure row
- README tree: `Network.html` (v01.18w · v01.09g) description gains N3 s1; `verify-network-roles.py` and `check-network-schema.py` descriptions extended

### Fixed
- **A mid-session finding on the version pair.** With the page's `<meta build-version>` bumped and `Networkhtml.version.txt` not yet, the page's first-load staleness check reloaded once and the aborted list request fell back to GET — the verifier's "exactly one list request" caught it. Both files were bumped together, as [PC-HTML-VERSION] #2 requires; nothing in the page changed

## [v07.12r] — 2026-09-22 06:05:50 AM EST

> **Prompt:** "I see the "Starred today - tap to use" pill underneath "Save Changes". Is that the most logical place to put that? What is it supposed to do or mean?"

### Fixed
- **`Network.html` v01.17w — the Source Event row lands under its field.** `nwSourceEventDefault` appended the row to the form when the `nop=eventstoday` answer arrived, and by then `nwEditCard` had already re-inserted the Save / Cancel actions as the form's last child, so the row rendered below the buttons (the developer's screenshot). `nwReviewSection` now passes the Where-and-when grid as an anchor and the row is inserted directly after it; the `.nw-evdef` rule drops the `grid-column` span (the editor is not a grid) for a plain block with a bottom margin

## [v07.11r] — 2026-09-22 05:56:25 AM EST

> **Prompt:** "pills read v01.08g and v01.03g. However, I am confused about how Step 4: the live check is supposed to happen. I starred an event in Events whose dates include today, but am not sure what to do in Network. Should I click on one of my saved contacts or do I have to scan a new card? If I must scan a new card, that seems illogical and I would like you to resolve that. If my understanding is completely wrong, then give me step by step instructions on what to do here."

### Fixed
- **`Network.html` v01.16w — the Source Event default no longer fills a saved contact's editor.** The developer's question exposed a real flaw in v07.10r: `nwEditCard` serves both a held (freshly scanned) card and a saved contact opened from its detail (`opts.host`), and `nwReviewSection` runs the same default for both — so editing an old contact whose Source event was empty would have had it silently filled with today's show. `nwEditCard` now stamps `form.dataset.saved` when it opens with a host, and `nwSourceEventDefault` reads it: a fresh scan keeps the prefill (one event) / pills (several); a saved contact's editor always gets the offer row ("Starred today — tap to use") with one pill per event and never a fill. This also gives the live check a path that needs no new card: open any saved contact → Edit → the row appears under Source event

### Notes
- Verified with `node scripts/check-gas-inner-scripts.js`, `python3 scripts/check-readme-tree.py` and `scripts/verify-network-roles.py` (the stub still answers `not_configured`, so the editor flow is unchanged); the bridge harness is untouched (no `.gs` change)

## [v07.10r] — 2026-09-22 05:05:03 AM EST

> **Prompt:** "tabs are there, run B from §13.8"

### Added
- **B — the bridge (design plan §6; §13.8 the brief; §11's B row flips to Done).** `Network.gs` v01.08g / `Network.html` v01.15w / `Events.gs` v01.03g / `Events.html` v01.04w. The first private server-to-server route in the program, built as copies of `Profiler.gs` `guidanceMentionsProxy_()` and Classroom's `clHandleGuidancePeer_()`
- **The far sides** — `Network.gs` `nwHandlePeer_` (`?action=peer&t=<NETWORK_PEER_TOKEN>&nop=accounts|signals`) and `Events.gs` `evHandlePeer_` (`?action=peer&t=<EVENTS_PEER_TOKEN>&eop=today|starred|signals`), dispatched in both `doGet` and `doPost` **before** session validation. The property is `.trim()`-ed on read; every one of the six token-boundary cases (property unset, sub-16-character property, `t` absent, `t` empty, wrong token, unknown op) answers the same flat `{ success:false, error:'denied' }` with zero spreadsheet reads — the tab handle is opened only after the token has matched. **`not_configured` is the calling side's word** (its own property under 16 characters), exactly as Classroom's far side reasons: the two refusals are identical on purpose so a probe cannot tell an unconfigured project from a wrong guess. A throw inside an op is answered as JSON `peer_failed` rather than Apps Script's HTML exception page
- **The four ops.** `nop=accounts` (GET): live Accounts with `relationship` ∈ target · customer · partner · channel, scoped to the `owner` as `resolveOwnerSet_` scopes a signed-in user's own rows — id, name, slug, relationship, stage, segments, tags; no contacts, emails, notes, HQ, and the owner column is not echoed. `nop=signals`: **POST with a JSON body** upserts on (`accountId`, `eventSlug`, `kind`, `evidenceUrl`) — a re-run refreshes `Last Seen` / `Confidence` / `Note` instead of duplicating; `kind` against `NW_SIGNAL_KINDS`, the account must be live and the owner's, a LinkedIn or `lnkd.in` evidence host is `linkedin_not_fetched`, rows are written `Source = events` with `s-` ids; per-row indexed `rejected[]`, one bad row never fails the batch; **GET with `accountId`** is the read leg Events' read-through proxies. `eop=today` / `eop=starred`: the owner's Stars joined to the public registry — `Events.gs` fetches `https://lightaisolutions.github.io/Sales/events-data/events.json` once per execution with `UrlFetchApp` (derived from `EMBED_PAGE_URL`; never a GitHub API host), today decided in **each event's own `tz`** via `Utilities.formatDate`; `eop=signals` relays Network's read leg for one account with each row's name and start attached
- **The near sides** — `nwEventsProxy_(eop, params)` and `evNetworkProxy_(nop, params, body)`, `guidanceMentionsProxy_` verbatim with the peer's `/exec` pasted as a constant from the peer's `.config.json` (`EVENTS_PEER_EXEC`, `NETWORK_PEER_EXEC`): `not_configured` under 16 characters, `muteHttpExceptions` with `upstream_http_<code>`, `upstream_unreachable` on a throw, and `upstream_not_json` with a 160-character snippet for an exception page served as HTML at HTTP 200; a `body` on Events' side makes a JSON POST. Called only past the user's own door: `nop=eventstoday` in `handleNetworkOp_` after `validateSessionForData` + `nwRequire_`, `eop=netaccounts` in `handleEventsOp_` after `evRequire_(sess, 'recommend')` (E3's input, wired server-side now)
- **The first use — `Network.html`**: the review section's Source Event field defaults from `nop=eventstoday` (one request per page load, made only when a review section opens — never on load, never polled): prefilled when exactly one starred event is on today, a pill row when several, untouched when none or while not configured; a value already typed is never overwritten; N1's free-text field stays as the fallback and the override. `Events.html`: the one-line "Connect Network to score by account" placeholder on the sheet that E3 replaces, no request of its own; both pages' error text knows `not_configured`
- **`scripts/check-peer-bridge.js`** — a Node sandbox harness over both `.gs` files (the `check-guidance-migration.js` idiom: the real functions lifted by name into two isolated VM contexts with stubbed `PropertiesService`, `SpreadsheetApp` (an in-memory spreadsheet), `UrlFetchApp`, `Utilities`, `Session`): **61 checks, exit 0** — for each far side the six boundary cases (plus no parameters at all) return flat `denied` with zero `openById` and zero `fetch` and nothing audited; a correct token reaches the op; the accounts filter, the signals upsert (written 1 → updated 1, the five rejection reasons indexed, `Source = events`, `First Seen` kept), the read leg, `eop=today` / `starred` over the **committed registry** with the calendar pinned to 2026-09-22, `eop=signals` joined; both near sides map a sub-16 property to `not_configured`, HTML-at-200 to `upstream_not_json` with a snippet, a non-200 to `upstream_http_<code>`, a throw to `upstream_unreachable`, and the JSON POST leg carries the body; no audit row carries the token. The function extractor skips comments (an apostrophe in a comment had ended a "string") and the constant extractor allows a trailing `//` comment
- `scripts/check-network-schema.py`: the audit-key allow-list gains the bridge's five count/flag keys (`written`, `updated`, `rejected`, `events`, `ok`); `scripts/verify-network-roles.py`'s stub answers `nop=eventstoday` as the real backend does while the tokens are unset (`not_configured`), so the editor flow is unchanged
- `NETWORK-EVENTS-DESIGN-PLAN.md`: §11's B row → **Done**; **§13.9 the N3 brief** (two sessions: the list, filters and bulk actions, then exports, drafts and the QR card) with its paste-in prompt

### Notes
- **REPO-ARCHITECTURE.md unchanged** — the flowchart draws no GAS-to-GAS edge for the existing Profiler → Classroom guidance route either, so the bridge adds none
- **Hand-off (the developer's):** set `NETWORK_PEER_TOKEN` and `EVENTS_PEER_TOKEN` to one random 16+ character value each, the same value in **both** projects' Script Properties (never committed, never quoted back); the merge's `Deploy Network` / `Deploy Events` steps pull both scripts (a deployment that predates its first webhook still needs Manage deployments → Edit → New version once); then star an event dated today and open the scan card's editor

## [v07.09r] — 2026-09-22 04:14:18 AM EST

> **Prompt:** "record the Events ids:
> SPREADSHEET_ID=<1MhaF8mdVyOljcswv_vwJ82ZW4Co-U9UHNXG39i5tCOw>
> DEPLOYMENT_ID=<AKfycbyI_SRS7Q3msirnY_UDx6Dz0jK75Onr9P0yocHGovnuIQlpHLIiSmvrpeyruhP3QaG_EQ>"

### Changed
- **Events is deployed — the two ids are recorded the N0 way.** `googleAppsScripts/Events/Events.config.json` now carries the real `SPREADSHEET_ID` and `DEPLOYMENT_ID` (the angle brackets in the prompt were delimiters, not part of the values), synced per [PC-GAS-CONFIG] #14: `Events.gs` v01.02g (`SPREADSHEET_ID` / `DEPLOYMENT_ID` vars — `ensureEventsTabs_()` no longer throws `SPREADSHEET_NOT_CONFIGURED`, and `registerSelfProject()` now writes the real deployment URL into the Global ACL), `Events.html` v01.03w (`var _e` is the reversed-then-base64 `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`, so the GAS iframe mounts and the Stars ops reach the backend). The `Deploy Events` workflow step reads the id from the config at merge time — no workflow edit — so this push's merge fires the first self-update webhook against the live deployment
- README tree: the Events page line reads v01.03w · v01.02g
- **B (the bridge, §13.8) is unblocked** — its brief stops on placeholder ids; both are real from this push

### Notes
- The N0 bootstrap lesson still applies: the code deployed by hand before this push cannot repoint its own deployment on the first webhook run — if the merge's `Deploy Events` step warns "self-update unconfirmed", do Manage deployments → Edit → New version once by hand, then later merges self-update
- §13.7 step 8 (the real-phone Calendar / `.ics` check) remains the developer's to report; nothing in this push asserts it

## [v07.08r] — 2026-09-22 02:00:16 AM EST

> **Prompt:** "Before I run E1 session 2, give me step by step instructions on how to deploy Events and get the two ids that you will ask me for in session 2.
>
> Run E1 session 2 — the published calendar and the phone pass — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.7 is the brief (steps 5–8 only — session 1's steps 1–4 landed at v07.07r and §11's E1 row reads In progress — session 1), §5.3 the design, repository-information/EVENTS-SCHEMA.md §9 and §12 the shapes, and live-site-pages/Events.html / googleAppsScripts/Events/Events.gs the code you extend (the evIcs() / evVevent() functions are the per-event RFC 5545 text; the published file must be byte-compatible with them). Build: (5) scripts/build-events-ics.py writing live-site-pages/events-data/events.ics — every confirmed event, X-WR-CALNAME: BESS/AIDC events, the same stable UID:<slug>@events.lightaisolutions.github.io, 75-octet folding, CRLF — run it, wire the .ics walk into scripts/check-events-registry.py (exit 0), and add a Subscribe pill on the masthead offering the webcal:// URL of the published file with a copy fallback; (6) the read-only day-plan tab as a timeline of the starred events on a chosen day (E5 fills it); (7) the Playwright pass at 390 × 844 in scripts/verify-events-roles.py — the month header sticks, the agenda scrolls past a month boundary and the header changes, the sheet opens and closes, a star round-trips through the stub, one event's ICS text parses (a minimal VEVENT walker), the Google Calendar href carries dates= / ctz=, screenshots of month / agenda / detail, zero page errors; (8) the real-phone Calendar / .ics check is reported in the hand-off, not asserted. Keep the Network UI family; no poller, score, signals, plans or bridge. If Events.config.json still carries YOUR_SPREADSHEET_ID / YOUR_DEPLOYMENT_ID, ask me for both before the phone pass and record them the N0 way ([PC-GAS-CONFIG] #14 syncs the .gs and the page's _e); if they are real, leave them. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, the verifier and the registry checker. Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries; CHANGELOG entry, README tree entries for events.ics and build-events-ics.py; flip §11's E1 row to Done with the versions and write the B brief as §13.8. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG rotated at v07.07r (Sections: 78/100) — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for B, and remember session."

### Added
- **E1 session 2 — the published calendar and the phone pass** (§13.7 steps 5–8; §11's E1 row flips to **Done**). `Events.html` v01.02w; `Events.gs` untouched at v01.01g (no server change in steps 5–8 — the brief's own rule is "bump only files you edit")
- **`scripts/build-events-ics.py`** → `live-site-pages/events-data/events.ics`: every `confirmed` registry event (72 of 100) as one RFC 5545 `VEVENT`, byte-compatible with the page's `evIcs()` / `evVevent()` — the same header lines (`PRODID`, `METHOD:PUBLISH`, `X-WR-CALNAME: BESS/AIDC events`), field order, `\\ \; \, \n` escaping, 75-octet folding (74 on a continuation line), CRLF, stable `UID:<slug>@events.lightaisolutions.github.io`; `DTSTAMP` is the build time (`--stamp` fixes it), `--check` exits 1 when the file is stale against `events.json`. Rebuilt by `events sync` (E2) after every registry write
- **`.gitattributes`: `*.ics -text`** — the repo normalises every text file to LF on commit, which would have silently turned the calendar's CRLF into LF in the blob; the rule keeps the bytes as written (`git ls-files --eol` reads `attr/-text`)
- **`Events.html` — the Subscribe pill** on the masthead (admitted tier only): a card offering the published file as a `webcal://` URL derived from the page's own location (a relative path on the same Pages site — never a GitHub host, [PC-PRIVATE-REPO] #18), a Copy button through the clipboard with the URL in a read-only field as the by-hand fallback (Android's Google Calendar has no `webcal` handler — it wants the URL pasted under *From URL* on the web), a one-time download of the whole file, and the how-to line
- **`Events.html` — the Day plan tab** (`Agenda | Day plan` strip above the counts): a read-only timeline of the starred events spanning a chosen day — a date picker, a Today pill, a scrolling strip of the upcoming starred days, and per entry the venue's `hours[]` for that date where the registry has them (else *All day*), *day N of M*, name with the attending badge, venue · place · kind, the note; tap opens the sheet. Empty states for "nothing starred on this day" and "nothing starred yet"; the footnote says E5 fills it. The masthead's month label follows the chosen day while the tab shows
- **`scripts/verify-events-roles.py` — the phone pass** at 390 × 844 for the admin, after session 1's checks: the month header sticks (`position: sticky`, pinned at its declared top, its month name clear of the template's fixed user pill) while its tallest month scrolls; scrolling past the boundary into the second month changes the month-in-view label; the sheet opens for the first confirmed upcoming event and Escape closes it; the Google Calendar href is the `action=TEMPLATE` URL with `dates=` / `ctz=`; that event's `evIcs()` text parses under a minimal VEVENT walker in the verifier (CRLF, ≤ 75 octets per line, UID / DTSTART / DTEND / SUMMARY) with DTSTART / DTEND equal to the href's `dates=`; its `evVevent()` block is **byte-identical** (DTSTAMP aside) to the block for that UID in the published `events.ics`; a star **round-trips through a stateful stub** (the stub now parses the POST body and holds a Stars set: `eop=star` → the refetched `eop=list` carries it → the row lights and the Starred count reads 1 → the Day plan lists it on its first day → `eop=unstar` clears it); the Subscribe pill offers the `webcal://` URL of the published file, Copy leaves a status line, the `http://` twin of the URL serves `BEGIN:VCALENDAR` with `X-WR-CALNAME` and parses; screenshots `events-month.png`, `events-agenda.png`, `events-detail.png`, `events-dayplan.png`; zero page errors. Requests are recorded as `events:<eop>` so the session-1 "exactly one list request on load" assertion still holds
- **`NETWORK-EVENTS-DESIGN-PLAN.md` §13.8** — the paste-in brief and prompt for **B, the bridge**: the far sides in both `.gs` files as copies of `guidanceMentionsProxy_()`'s far side (six token-boundary cases → flat `denied` with zero reads, `not_configured` under 16 characters, before session validation), the four ops, the near-side proxies with the `upstream_not_json` distinction, the scan card's Source Event defaulting from `eop=today`, and a Node sandbox harness `scripts/check-peer-bridge.js`; it stops and asks for the two Events ids if they are still placeholders

### Changed
- **`scripts/check-events-registry.py` — the `.ics` walk is live**: the published file is now required (missing is a finding), must end every line in CRLF with none over 75 octets, carry `X-WR-CALNAME`, one `VEVENT` per confirmed event with UID / DTSTART / SUMMARY, its UID set equal to the confirmed slugs, and each `VEVENT`'s DTSTART / STATUS matching its row. Exit 0 on the committed files: 100 events, 58 roster rows, 256 mentions, 72 VEVENTs
- **`Events.html` — the sticky month header** now carries 40px of paper as top padding so it pins at the top with the month name clear of the template's fixed user pill and no row shows through beside the pill (the first phone-pass screenshot had the header hidden under the pill)
- README tree: the Events page line (v01.02w, the session-2 features), `events-data/events.ics`, `scripts/build-events-ics.py`, and the refreshed descriptions of `check-events-registry.py` and `verify-events-roles.py`

### Fixed
- **`Events.html` `evIcsEscape()`** wrote a bare `;` for a semicolon — the JS literal `'\;'` is just `';'` — so a name or description with a semicolon was not RFC 5545-escaped and would not have matched the builder's output; now `'\;'`. The Playwright byte-identity check would have caught the first such row

### Notes
- **`SPREADSHEET_ID` / `DEPLOYMENT_ID` are still placeholders** — the session ran unattended and the developer's ids were not to hand, so [PC-GAS-CONFIG] #14 had nothing to sync; the step-by-step deploy instructions were given in chat (the N0 list from v07.07r's Notes, expanded), and the ids are recorded on the next push. The Deploy Events workflow step no-ops until then; the live page shows the calendar, the Subscribe pill and the day plan with "Stars are not connected yet"
- **The real-phone check (§13.7 step 8) is reported, not asserted**: once deployed — the agenda opens at today's month; a starred event shows ★ on its row and in the Starred count and appears on the Day plan for its dates; the Calendar link opens Google Calendar prefilled with the dates and the event's time zone; the per-event `.ics` imports; Subscribe on an iPhone opens the Calendar subscription dialog for `webcal://lightaisolutions.github.io/Sales/events-data/events.ics`, and on the web Google Calendar's *From URL* accepts the same URL with `https://`
- **Verification this push**: `node --check` on the `.gs` copy and on the page's extracted PROJECT script clean; `scripts/check-gas-inner-scripts.js` — 11 files, 106 inner scripts parse; `python3 scripts/check-readme-tree.py` — 12 page + 10 GAS displays match; `scripts/verify-events-roles.py` — ALL CHECKS PASSED (three runs: the first surfaced the pill overlap and an oversized footnote, both fixed); `python3 scripts/check-events-registry.py` — exit 0 with the `.ics` walk; `scripts/build-events-ics.py --check` — current
- **CHANGELOG counter** 78 → 79/100 — no rotation due

## [v07.07r] — 2026-09-22 01:08:08 AM EST

> **Prompt:** "Run E1 session 1 — Events scaffold + calendar — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.7 is the brief (follow its reading list in order, then session 1's four build steps exactly — do NOT start session 2's steps 5–8: the published events.ics, the day-plan tab and the phone pass are the next session's), §5.3 the design, and repository-information/EVENTS-SCHEMA.md §1, §2, §3, §5, §9, §12 the shapes. E0 is Done and merged — events-data/events.json (100 events), events-sources.json (58 probed rows) and scripts/check-events-registry.py are on main and the checker exits 0; re-run it at session start to confirm rather than trusting this line. Scaffold Events.html / Events.gs with scripts/setup-gas-project.sh the way N0 did for Network (auth, hipaa, own spreadsheet, PWA manifest with the manifest-src 'self' override on both CSP tags, no service worker, the admin-only door on both sides per D7 with all four tier keys kept, HEARTBEAT_INTERVAL 600 s, no data poll per D14, quotaProbe_ + op=quota inherited from the shared template region), ensureEventsTabs_() for all five §5 tabs (Stars · Plans · Meetings · Proposed · Tuning — create all five now so E2–E5 edit against them, write only Stars in E1), eop=list / eop=star / eop=unstar / eop=note in the PROJECT regions only, then the vanilla agenda scroller over the public registry — fetched by relative URL, never a GitHub endpoint (PC-PRIVATE-REPO #18) — the filter pills with "signals only" present but disabled and noted "from E4", the detail sheet with mentions[] chips deep-linking Profiler.html#<slug>, Add-to-Google-Calendar and the per-event .ics per §9 byte for byte. Not FullCalendar. Keep the Network UI family (paper-and-ink, pill rows, two-half control rows, no ids or confidence numbers on a card); no poller or events sync (E2), no score (E3), no signals (E4), no plans (E5), no bridge (B) — no EVENTS_PEER_TOKEN and no peer ops. Two things E0 learned that the agenda must not paper over: 27 of the 100 rows are `tentative` and 11 of those are from organisers that block non-browser clients permanently, so surface status in the sheet rather than implying every row is firm; and several rows carry an empty city because the organiser publishes none, so the row renderer must tolerate empty city/region/venue without printing a stray separator. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-events-roles.py (mirror verify-network-roles.py; admin admitted, the other three tiers turned away with zero requests, zero page errors at phone width) and python3 scripts/check-events-registry.py (exit 0; the .ics walk stays dormant until session 2 publishes the file). CHANGELOG entry, README tree entries, REPO-ARCHITECTURE.md plus the per-environment diagram the setup script adds; set §11's E1 row to *In progress — session 1* with the versions and write nothing new in §13 (session 2 flips the row to Done and writes the B brief as §13.8) — then hand off in chat what to check on the phone: the agenda at today's month, a starred event, the Calendar link prefilled. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. Current state: the repo is at v07.06r and parallel sessions have been pushing, so restart from origin/main and check git ls-remote before pushing. The repo CHANGELOG stands at Sections: 102/100 with one section dated 2026-09-22 — that is 101 non-exempt against the 100 trigger, so ROTATION IS DUE on your push commit: the oldest date group is 2026-09-16 with 25 sections, rotating it leaves 77 raw / 76 non-exempt and one rotation suffices. Re-derive that arithmetic yourself at session start (the exempt group changes at midnight EST) and deepen the clone before any SHA lookup — the sections due are the oldest and are exactly the ones beyond a shallow horizon. One push.
>
> Then, give me a prompt to paste into a new session (recommend model/effort) to continue the action plan, then remember session."

### Added

#### `live-site-pages/Events.html` — v01.01w
- **E1 session 1 scaffold of the Events app** (design plan §13.7 steps 1–4; §5.3). Generated by `scripts/setup-gas-project.sh` from the auth template (`hipaa` preset, `ACL_PAGE_NAME: Events`, `PORTAL_ICON: 📅`, the fleet `CLIENT_ID`; `SPREADSHEET_ID` and `DEPLOYMENT_ID` left as placeholders — see Notes); ten files created, GAS Projects table row, README tree entries, REPO-ARCHITECTURE nodes, `diagrams/Events-diagram.md` and the `Deploy Events` workflow step registered by the script. The fleet Master ACL id `1kG2K…UvE` set by hand in `Events.gs` and `Events.config.json` (Setup GAS Project Command step 3 — the Global ACL config the script defaults from still carries its placeholder)
- **PWA**: `events.webmanifest` on the `network.webmanifest` shape (`id` / `start_url` / `scope` = `./Events.html`, `display: standalone`), `images/events-icon-192.png` + `-512.png` (Pillow-drawn calendar leaf on the app's navy, `any maskable` on the 512), `<link rel="manifest">`, `theme-color`, `apple-touch-icon` and the standalone metas; the **`manifest-src 'self'` PROJECT OVERRIDE on both CSP tags** (template ships `'none'`); `worker-src 'none'` stays — no service worker (D2)
- **The door, client half (D7 — admin-only)**: `EV_ROLE_CAPS` with all four tier keys (admin holds `calendar` · `recommend` · `plans` · `signals` · `roster` · `tuning`, the other three empty — EVENTS-SCHEMA.md §2), `evRole()` / `evPreviewRole()` / `evEffectiveRole()` / `evCan()` / `evAdmitted()` with only-subtracting `?as=` preview semantics; `evRenderDenied()` paints the turned-away card for non-admin tiers **before any request is issued** — neither the registry nor the stars are fetched for a denied tier
- **The agenda scroller (§5.3 — vanilla, not FullCalendar)**: the page fetches `events-data/events.json` by **relative URL** (plus `profiler-segments.json` and `profiler-companies.json` for display labels only, both optional) and renders `status ≠ past` rows in start order grouped month → day under a `position: sticky` month header, with an `IntersectionObserver` naming the month in view in the masthead and a **Today** pill that scrolls to the current day group; past editions sit behind a "Show N past" fold at the bottom; rows carry name · dates · place · kind with a star toggle — **no ids, no relevance or confidence numbers on a card**. `evPlace()` joins only the parts an organiser publishes, so the 18 rows with an empty city (31 with no region, 68 with no venue) print no stray separator; a webinar with no place reads "Online". A `tentative` row says so on the row and on the sheet
- **Filters** as pills across two-half control rows: kind (the registry enum), region (the state codes carrying ≥ 3 events, from the registry itself, plus "Abroad"), audience segment (from `profiler-segments.json`, a horizontally scrolling pill strip), **★ Starred**, and **"Signals only" present but disabled with the "from E4" note**; a counts strip (upcoming · starred · tentative)
- **The detail sheet** (a bottom sheet on a phone, a centred card on a desk): organiser, venue, where, the status badge (`Tentative — not yet confirmed by the organiser` for the 27 rows E0 could not verify, eleven of them from organisers that block non-browser clients permanently), the kind and series badges, `tierNote` (highlighted for a tentative row), website / registration / exhibitor list / agenda / speakers / floor-plan links where published, the audience segments by name, **`mentions[]` as chips deep-linking `Profiler.html#<slug>`** (company names from the registry, one chip per dossier), and the `sources[]` line with `kind` · `lastConfirmed` · `lastUpdated`; Escape and the backdrop close it
- **Add to Google Calendar** — the §9 template URL (`action=TEMPLATE` · `text` · `dates=<start>/<end+1>` · `location` · `details` · `ctz=<tz>`) — and **Download .ics**: one hand-rolled RFC 5545 `VEVENT` per event, byte for byte per §9 (`UID:<slug>@events.lightaisolutions.github.io`, all-day `DTSTART;VALUE=DATE` / exclusive `DTEND`, `SUMMARY`, `LOCATION`, `URL`, `DESCRIPTION` of organiser · kind · tierNote · registration URL, `CATEGORIES` of segment ids, `STATUS` from the row, `DTSTAMP` / `LAST-MODIFIED`, calendar-level `X-WR-CALNAME: BESS/AIDC events`), `\\` `\;` `\,` `\n` escaping, **folding at 75 octets** (multi-byte characters never split), CRLF line ends, served as a `blob:` download named `<slug>.ics`
- **Stars, attending and notes** on the sheet and the row: `evToggleStar()` over `eop=star` / `eop=unstar`, the **Attending** select (`planning` · `registered` · `attended` · `skipped`) and the **Note** field written through `eop=note` — all body-POST via `evApiBody()` (the Network `nwApiBody` idiom, three attempts, then the GET mirror since a note fits a URL); `evApi()` over `_gasPost` for `eop=list`; before the backend is deployed the calendar still renders and the stars report "not connected yet" instead of an error
- **D14 intervals** in `HTML_CONFIG`: `HEARTBEAT_INTERVAL: 600000`, `DATA_POLL_INTERVAL: 0` with a PROJECT OVERRIDE note — the owner's rows refresh on load, on `visibilitychange` and after every write (`evAfterWrite()`); the registry is never refetched in-session (the version poll reloads the page on a deploy) — paired with the `.gs` per [PC-SESSION-SYNC] #20

#### `googleAppsScripts/Events/Events.gs` — v01.01g
- **The door, server half**: `EV_ROLE_CAPS`, `evRoleOf_` / `evAdmitted_` (`role === 'admin'`) / `evCan_` / `evRequire_` on the Network pattern — every turned-away tier writes a `security_alert` audit row carrying op name and tier only
- **Enums and ids (EVENTS-SCHEMA.md §1, §5)**: `EV_ATTENDING`, `EV_SLUG_RE`, `EV_ID_RE` (`^(st|pl|mt|pr)-[0-9a-z]{13}$`), `evRandomBase36_()` (SHA-256 over `Utilities.getUuid()`, first 8 bytes → 13 base36 digits) and `evNewId_(prefix, takenIds)` collision-checked against the tab — never a slug, a name or a date
- **Tabs**: `ensureEventsTabs_()` creating **all five §5 tabs now** — `Stars` · `Plans` · `Meetings` · `Proposed` (§7 columns) · `Tuning` — plus `Shares` and `Profiles`, exactly the schema's columns in order (`EV_TABS`), frozen row 1, in-place header upgrade; E1 writes only `Stars`
- **Ownership**: `getShareScope_`, `resolveOwnerScope_`, `resolveOwnerSet_` and the not-found-not-forbidden convention copied verbatim from `Network.gs` / `Receipts.gs` (the D7 widening path; `Shares` has no UI in v1)
- **Ops**: `handleEventsOp_()` (`action=events`) wired into `doPost` and the `doGet` `action=api` mirror — `eop=list` answers the owner's `Stars` rows as id · slug · attending · note · updatedAt through `evListRows_()` (the note rides on the list row because the sheet shows it and a per-open detail op would cost an execution each time under D14; nothing about people is in this app); `eop=star` creates the row (Attending defaults to `planning`) or sets Attending, `eop=unstar` deletes it (no `Deleted At` on `Stars` — a star is not a record about a person), `eop=note` writes Note and/or Attending and stars an unstarred event; the slug validated against `EV_SLUG_RE` (never against the registry — the page owns that), Attending enum-validated, the note trimmed to 2,000 characters; audit rows carry the star id, the slug and counts only
- **`op=quota` and `op=aclhealth`** ported verbatim from `Network.gs` (the region N0 defined and Q0 rolled to every project) so `scripts/check-quota.sh` and `scripts/check-acl-health.sh` enrol the project; `PROJECT_OVERRIDES.HEARTBEAT_INTERVAL: 600` (paired with the `.html`)
- **Not built, by design**: no `EVENTS_PEER_TOKEN`, no peer ops, no poller, no `events sync`, no score, no signals, no plans — E2–E5 and B

#### `scripts/verify-events-roles.py`
- The four-tier door check on the `verify-network-roles.py` shape: serves `live-site-pages/`, seeds the page-scoped session the way `saveSession()` writes it, gives the page a stub base URL and answers the fetch transport's load-time heartbeat, then asserts per tier — admin: the agenda over the served registry with exactly one `eop=list` request and exactly one registry fetch, the sticky month header, the month-in-view label, the filter card with the disabled "Signals only (from E4)" pill, no stray separator on any row, the sheet opening on a row tap with the Google Calendar `dates=` / `ctz=` href and the `.ics` download and closing on Escape; contributor / analyst / viewer: the turned-away card, **zero** data requests and **no registry fetch**; `?as=viewer` on admin turns away, `?as=admin` on viewer gains nothing; zero page errors. Phone-width (390 × 844) screenshots per tier plus the detail sheet. **Passes** (99 rows rendered for the admin — the registry's 100 less the one `past` row behind the fold)

#### `live-site-pages/events.webmanifest`, `live-site-pages/images/events-icon-192.png`, `events-icon-512.png`
- The PWA manifest and icons described above

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11: **E1 → In progress — session 1, v07.07r** (what landed, the two placeholder ids, and the four session-2 steps still to run). Nothing new written in §13 — session 2 flips the row to Done and writes the B brief as §13.8

#### `repository-information/REPO-ARCHITECTURE.md`
- Flowchart: `EVENTS_PAGE` and `GAS_EVENTS` nodes and their five edges (added by the setup script); the Flowchart's mermaid.live URL regenerated and decompression-verified (9,569 chars). The file carries no `<details>` copy blocks, so none was mirrored; the per-environment diagram row for `Events-diagram.md` added by the script

#### `README.md`
- Tree: the Events page entry's description, `events.webmanifest`, `scripts/verify-events-roles.py`; version displays Events v01.01w · v01.01g (`check-readme-tree.py`: 0 findings); `Last updated` and `Repo version` refreshed

#### `.claude/rules/gas-scripts.md`, `.github/workflows/auto-merge-claude.yml`
- The Events row in the GAS Projects table and the `Deploy Events` webhook step — both by the setup script; the deploy step no-ops until `DEPLOYMENT_ID` is real

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten at the close of E0 (v06.95r, merged; the repo has since advanced to v07.06r beside it), recording that E1's prerequisite is satisfied and that the CHANGELOG now sits at 101 non-exempt sections with a 25-section 2026-09-16 group due to rotate on the next versioned push; the parallel Opus 5 routines session moved to Previous Sessions and the N2 entry dropped under the two-session cap *(carried from `[Unreleased]` — the "Remember session context" push that wrote it had no version bump)*

### Notes
- **Setup script input** (§13.7 step 1): `PROJECT_ENVIRONMENT_NAME: Events`, auth + `hipaa`, the fleet `CLIENT_ID`, `ACL_PAGE_NAME: Events`. **`SPREADSHEET_ID` and `DEPLOYMENT_ID` are placeholders** — unlike N0, where the developer supplied the spreadsheet id up front, this session was run unattended with no id to hand, so the "own spreadsheet" is the developer's next step: create it (or through the `gas-project-creator` page), paste its id into `Events.config.json` and `Events.gs`, deploy, and record `DEPLOYMENT_ID` the N0 way ([PC-GAS-CONFIG] #14 syncs the `.gs` and the page's `_e`). Until then `ensureEventsTabs_()` throws `SPREADSHEET_NOT_CONFIGURED` and the page says so beside a working calendar
- **Deploy hand-off** (the N0 steps, verbatim for Events): (1) create the Apps Script project and paste `Events.gs`; (2) Project Settings → show `appsscript.json` and set it from `.claude/rules/gas-scripts-reference.md` §"Setup Steps"; (3) link the GCP project and enable the Apps Script API; (4) Deploy → New deployment → Web app → execute as me, access Anyone; (5) record `DEPLOYMENT_ID` and `SPREADSHEET_ID` in `googleAppsScripts/Events/Events.config.json` and sync per [PC-GAS-CONFIG] #14; (6) set `GITHUB_TOKEN` in Script Properties; (7) run any function from the editor and tick every consent checkbox; (8) load `Events.html` once so `registerSelfProject()` creates the `Events` column in the Master ACL's Access tab, tick TRUE for your row, run `clearAllAccessCache`; (9) the N0 bootstrap lesson: code pasted before the deployment exists cannot repoint its own deployment on the first webhook run — Manage deployments → Edit → New version once, by hand
- **What to check on the phone** once deployed: the agenda opens at today's month with the month named in the masthead; a starred event shows ★ on its row and in the Starred pill's count; the Calendar link opens Google Calendar prefilled with the dates and the event's time zone; the `.ics` imports
- **Verification this push**: `node --check` on the `.gs` copy clean; `scripts/check-gas-inner-scripts.js` — 11 files, 106 inner scripts parse; both inline `<script>` blocks of `Events.html` parse; `scripts/check-readme-tree.py` 0 findings; `scripts/verify-events-roles.py` all checks pass with zero page errors (served over localhost at 390 × 844); `scripts/check-events-registry.py` exit 0 (100 events, 58 roster rows; the `.ics` walk stays dormant until session 2 publishes the file)
- **Rotation fired.** 102 sections before this push with one dated today → 101 non-exempt against the 100 trigger; the oldest date group, **2026-09-16 (25 sections, v06.05r–v06.29r)**, moved to `CHANGELOG-archive.md` with all 25 SHAs resolved after the clone was deepened at session start (1,536 commits); 78 raw / 76 non-exempt remain — one rotation sufficed

## [v07.06r] — 2026-09-22 12:08:08 AM EST

> **Prompt:** "fix P9"

### Fixed

#### `scripts/check-classroom-pipeline.py` — the P9 fixture broke on the pipeline’s first watermark advance
- **`--selftest` went 15 fixtures / 1 failure the moment C2 landed its first commit**, and the cause was the fixture, not the check. `mutate_p9` derived its briefing id straight from the ledger: `"briefing-%s" % coveredThrough`. P9’s per-briefing checks key on `new` — the briefings at head absent from base — so once `70a0c488` advanced `coveredThrough` to **2026-09-21**, a date that now carries a **real** `briefing-2026-09-21`, the fixture’s lesson stopped being new. P9’s branch never executed and P5/P7 fired on the section mismatch instead.
- **The fixture had never been wrong before because `lastRun` was `null`** — no run had ever moved the watermark, so the derivation had never landed on an occupied date.
- **Fixed the date derivation, not the assertion.** The fixture only needs to be *at or behind* the watermark, never exactly on it, so it now walks back to a briefing-free date (`2026-09-20` today) under a bounded loop that raises a named `AssertionError` rather than looping forever. Loosening what P9 expects would have retired the check instead of repairing it.
- **Checked whether this was a class rather than an instance:** `mutate_p9` is the only fixture that reads live ledger state, so a targeted fix is the right scope.

### Verified

- `--selftest`: **15 fixture(s), 0 failure(s)** — `ok P9  a briefing at or behind the watermark`, and the positive fixture plus P1–P8 and P10–P13 all still pass.
- C2’s own gates: `check-classroom-content.py` 0 errors / 0 warnings, `node --check`, `check-gas-inner-scripts.js` — all clean, so Wednesday’s run is unaffected.
- `check-classroom-pipeline.py --base origin/main` reports P1 against this working tree, which is **correct**: a developer session edited a path the committer may never touch (§3). A pipeline run diffs its own changes against a `main` that already carries this commit and will not see it — the same shape as the `.github/last-processed-commit.sha` artefact seen while auditing `70a0c488`.

**No rotation:** 102 raw but 78 non-exempt (24 sections dated 2026-09-21 EST).

## [v07.05r] — 2026-09-21 11:16:23 PM EST

> **Prompt:** "I have rebuilt all my routines; verify them and then delete the old ones."

### Added

#### `repository-information/routine-prompts-archive.md` (new)
- **Verbatim prompt text of the four agent-created Routines, archived immediately before deleting them.** A Routine prompt has no export and no version history — delete the Routine and the text is gone.
- **Written because a pre-delete check found the claim "the 21 companies’ priorities live on in `watch[]`" was only mostly true.** All 21 do carry a non-empty `watch[]`, and most match the old prompt almost verbatim, but `crusoe` had been summarised to three short phrases, dropping Abilene, the ~900 MW Microsoft deal, GE Vernova, Bergen and Form Energy. Deleting without archiving would have lost that detail irreversibly.
- **Credential-guarded.** The four prompts were machine-scanned before writing and the written file independently re-scanned; the earnings desk is excluded because its prompt carries a real corpus token and the repo is public via Pages. The first scan fired on C2’s `CORPUS TOKEN: none is supplied` — a false positive, confirmed by inspection and by the absence of any key-shaped run, and the guard was narrowed rather than dropped.

### Verified

#### All ten Routines audited against the live API before any deletion
- Five rebuilt Routines confirmed `created_via: http_api` with the right cron, model and **zero connectors on every one**: earnings desk (weekdays), C2 (Wed, Opus 5), Industry Guidance (quarterly 15th, Opus 5), quarterly check (quarterly 1st, Sonnet 5), opportunity report (monthly 1st, Sonnet 5).
- **The ACL health check is `meta_mcp` and must not be deleted** — it is read-only, never pushes, and was deliberately never rebuilt. `created_via` alone is therefore not a safe delete filter; the rule is `meta_mcp` **minus** the ACL check.
- The repository attachment itself remains unverifiable from the API — `sources` reads empty even on Routines that have demonstrably committed (v06.70r). The **Runs with** card is still the only reliable check.

## [v07.04r] — 2026-09-21 06:26:05 PM EST

> **Prompt:** "make the --check fix. Then, recommend me to either start the three remaining rebuilds now or wait and why."

### Changed

#### `scripts/build-classroom-segments.py`
- **`--check` now separates the two kinds of due.** The 2026-09-21 pipeline run reported 16 of 19 segments due; **15 were `sections differing: none`** — pure pin churn from one rebuilt `profiler-graph`, with a real workload of one. That is a 1:15 signal-to-noise ratio that does not self-clear, and it is the same false-staleness class CLAUDE.md already documents for shallow clones, arriving through a different door.
- Output now groups **section changes — real work** separately from **pin-only**, and the summary carries both counts.
- **Strictly additive, because the format is a contract between two scripts.** `check-classroom-curriculum.py` line 539 parses the summary with `r"(\d+)\s+segment\(s\),\s*(\d+)\s+due"`, so the leading clause is unchanged and the new counts are appended after it; each per-segment line keeps its exact historical wording, which CLAUDE.md quotes. Verified end-to-end: the regex still matches (19, 16) and the consumer renders the new grouping verbatim.
- **What did not change:** what counts as due, the exit code (1 when any are due), and the generation path — confirmed with `--dry-run` leaving `Classroom.gs` untouched. The split is reporting only; `G3` already declines to revise a segment whose sections do not differ, so the behaviour was right and only the report was misleading.

### Fixed

#### A finding the pipeline could not act on itself
- The run that surfaced this closed with *"type `continue with your recommendation`"*, but **`scripts/` appears zero times in the committer contract’s §3 write set, which is closed.** A pipeline run editing the generator would be a P1 violation. Recorded because the report reads as actionable inside that session and is not — a fix here needs a developer session.

### Verified

#### The 2026-09-21 pipeline commit `70a0c488`, audited independently
- Merged to `main`; **7 changed paths, all inside §3**; nothing forbidden touched (no `SESSION-CONTEXT.md`, no `REMINDERS.md`/`TODO.md`, no `Classroom.html`, nothing under `profiler-data/`); ledger watermark advanced off `null`; content checker 0 errors / 0 warnings; pipeline checker **0 findings against the pipeline commit alone**.
- A P1 seen on a first pass was an artefact of testing against current `main`, which includes the auto-merge workflow’s own `.github/last-processed-commit.sha` bookkeeping commit — not the run’s write.

**No rotation:** 100 raw but **79 non-exempt** (21 sections dated 2026-09-21 EST are same-day exempt), and the trigger is 100 non-exempt. The counter reading `100/100` is expected and is not a rotation signal on its own.

## [v07.03r] — 2026-09-21 06:04:03 PM EST

> **Prompt:** "You are one run of the Classroom curriculum pipeline (C2) in LightAISolutions/Sales. Nobody is watching this session and you cannot ask anyone anything. READ FIRST: `repository-information/CLASSROOM-COMMITTER-CONTRACT.md`, `repository-information/CLASSROOM-SCHEMA.md`, `.claude/rules/classroom-app.md`. Then run the contract's own pre-flight (§5.1) — repo identity, a clean tree, a fresh `claude/classroom-pipeline-<YYYY-MM-DD>` branch off a just-fetched `origin/main`, a green `check-classroom-content.py` baseline with its warning count recorded, the gate-surface digest matching the ledger's `gateDigest`, and schema versions still v1/v1. CORPUS TOKEN: <no corpus token> — per §5.1 step 5, skip corpus reads entirely; refresh only from the Pages-served and repo-resident layers, and do not author a briefing from memory in their place. BUDGET: 45 minutes wall-clock and 120 assistant turns. BEFORE COMMITTING, and again immediately before `git commit`, all of these must pass: `check-classroom-content.py` (zero errors, no new warnings), `check-classroom-pipeline.py --base origin/main` (zero findings), `node --check` on a `.js` copy of `Classroom.gs`, and `node scripts/check-gas-inner-scripts.js`. END THE RUN with the §5.4 report verbatim."

### Added

- **briefing-2026-09-21** (tracks) — the first registered briefing edition: eight dated developments across three refreshed dossiers, covering Oracle's Q1 FY2027 print and its restructuring, the Project Jupiter renewable procurement and generation mix, the HPE networking agreement with warrants, IREN's Sweetwater Hub clearing into ERCOT Batch Zero Base Load, and Jinko's Middle East ESS distribution agreement and proposed holding-company rename; inputs: profile:oracle@2026-09-21, profile:iren@2026-09-21, profile:jinko@2026-09-21. All-public stamp, so the edition folds to `tracks` — the analyst-visible public-only edition. `reviewBy` 2026-10-21, the Jinko AGM, which is the nearest dated gate among the items.

### Changed

- **segment-neoclouds** (tracks, unchanged) — IREN's latest normalized annual revenue moved from FY2025 $501m to FY2026 $707m, and the segment timeline picked up the Sweetwater ERCOT item; changed sections: the-numbers, what-moved; inputs re-pinned: profile:iren 2026-08-30→2026-09-21, graph:profiler-graph 2026-09-19→2026-09-21.
- **segment-aidc-developers-and-landlords** (tracks, unchanged) — the same IREN figure moved in this segment's numbers table, its curated edges changed with the graph rebuild, and the timeline picked up Sweetwater; changed sections: the-numbers, what-moved, who-is-connected; inputs re-pinned: profile:iren 2026-08-30→2026-09-21, graph:profiler-graph 2026-09-19→2026-09-21.
- **segment-storage-integrators-and-containers** (tracks, unchanged) — Jinko's policy-exposure row moved and the timeline picked up the Middle East agreement and the proposed rename; changed sections: the-fence, what-moved; inputs re-pinned: profile:jinko 2026-09-05→2026-09-21, graph:profiler-graph 2026-09-19→2026-09-21.

All three revisions were produced by `scripts/build-classroom-segments.py --segment <id>`, the repo's own segment generator, so `revisions[].changed[]` is the generator's differs set rather than a hand-named one.

### Notes

```
CLASSROOM PIPELINE — 2026-09-21 — COMMIT
Covered through: 2026-09-01 → 2026-09-21
Sources seen: 317 fetched · 299 unchanged · 18 moved · 0 unknown
Wrote: briefing-2026-09-21 (tracks) — 8 qualifying items across 3 sources, bar is 3/2; segment-neoclouds (tracks) — IREN normalized revenue FY2025 $501m → FY2026 $707m; segment-aidc-developers-and-landlords (tracks) — same IREN figure plus curated-edge changes; segment-storage-integrators-and-containers (tracks) — Jinko policy exposure moved
Skipped at caps: segment-hyperscalers-and-ai-labs — due on profile:oracle 2026-08-30→2026-09-21, sections differing: what-moved only
Frozen (unknown source): none
Blocked by: —
Needs the developer: 15 segment lessons are due on graph:profiler-graph 2026-09-19→2026-09-21 with "sections differing: none" — left untouched, pins included, per G3; they will re-present next run
Needs the developer: the corpus layer was not read this run (no token supplied), so no corpus: ref was written and no corpus item counted toward the briefing bar
```

Checkers: `check-classroom-content.py` 71 lessons, 8 tracks, 220 gate cases — 0 errors, 0 warnings (baseline 0/0). `check-classroom-pipeline.py --base origin/main` — 0 findings. `node --check` on a `.js` copy of `Classroom.gs` — clean. `node scripts/check-gas-inner-scripts.js` — clean.

Classroom.gs VERSION v01.86g → v01.87g.

## [v07.02r] — 2026-09-21 05:36:22 PM EST

> **Prompt:** "Regarding coverage, I approve of your fix and appreciate that the sweet prompt now reads tiers instead of specific companies so that widening coverage does not force me to rebuild the Routines every time. If I wanted to refresh the relevant dossiers now, how much work would that be?\n\nRegarding the cache levers, is there any way you can automate the process? If not and I need to do some manual work, then give me step by step instructions on what to do."

### Changed

#### `repository-information/profiler-refresh-calendar.json` — 384,240 → 21,576 bytes (−94%)
- **Asked whether lever 1 could be automated, measured the file instead of answering, and found the lever did not need a prompt at all.** `watch` was **66.4%** of the calendar and `source` **31.6%** — **98% between them** — while the queue logic (due-date comparison, tier selection, the cap of three) reads neither. The scheduling fields are ~7 KB of values.
- Payload moved to the new `profiler-refresh-notes.json`; the calendar went to **21,576 bytes and 1,069 lines**, back under the Read tool’s 2,000-line default. **The truncation bug is now retired structurally rather than by instruction.**
- **This makes lever 1 automatic.** A prompt cannot be edited after its Routine is created, so a lever living in a prompt cannot reach an already-rebuilt Routine; a lever living in the data reaches every Routine on its next fire. **The rebuilt earnings desk gets ~94% of the saving with nothing done to it.**
- Verified non-destructive: 177 rows in and out, 177 note entries, every field round-trips byte-for-byte.

### Added

#### `repository-information/profiler-refresh-notes.json` (new)
- Per-company `source` and `watch`, keyed by slug, one entry per calendar row. `profiler-queue.py` joins it per-slug onto the due rows so a run never loads the 369 KB payload whole.

#### `scripts/sync-profiler-registry.py`
- The non-empty check on `source`/`watch` followed them into the notes file, plus a **two-way bijection check** between calendar rows and note entries. Both directions were tested by deliberately breaking them and confirming the checker fires; it is back to 0 findings.

#### `repository-information/PROFILER-SCHEMA.md`
- New **Refresh notes** section; `companies[].tier` documented on the calendar (the field the sweep now selects on); `source`/`watch` rows moved across.

### Fixed

#### Stale figures left behind by the split
- Every "~384 KB / 2,573 lines" claim in `profiler-app.md`, `ROUTINES-OPERATIONS.md`, `profiler-queue.py` and the README tree corrected, and the warning re-pointed at the file that is now the large one. **The general rule was recorded with it: before writing a prompt instruction to work around a file, measure the file — a data fix outlives every prompt that would have worked around it.**

## [v07.01r] — 2026-09-21 04:43:23 PM EST

> **Prompt:** "Regarding the Edit shortcut, I successfully clicked "Edit" on "Classroom curriculum pipeline (C2) - weekly", but there was no interactable repositories field. Thus, the shortcut doesn't functionally work.\n\nRegarding the Routines and AI model, you mentioned that the Profiler earnings desk only goes through 3 companies and the Profiler quarterly check only reads 21 dossiers and refreshes those that move. However, my current Profiler has 177 dossiers. Shouldn't my routines cover all of them? Even if not all of them, I would like you to consider which dossiers are important from Megmeet's point of view (I will most likely join them as a "Senior Sales Manager - SST Solutions" soon) and make sure these relevant dossiers are updated. Also, I would like you to specify Opus 5 as the AI model for Industry Guidance Quarterly and Classroom C2 pipeline as you recommended.\n\nRegarding the cache-read cost, I would like to apply both lever 1 and 2. However, I am not sure how to implement them myself. Can you implement both yourself?\n\nRegarding deleting the old desk, I would like you to delete the old desk that failed earlier today and keep the new desk that successfully pushed. I give permission.\n\nI will tackle rebuilding the Routines afterwards."

### Added

#### `scripts/profiler-queue.py` (new)
- **Lever 1, implemented as a script rather than an inline snippet so it is testable and version-controlled.** `--desk` returns the ≤3 due earnings rows oldest-first, carry-over, the unconfirmed-within-7-days set and the counts the stand-down report quotes; `--quarterly [--tier core|watch]` returns cadence rows past their tier interval. **5,075 bytes against the calendar’s 384,240** — a 76× reduction in what enters a run’s context. Carries an explicit sandbox fallback for the “Code from External” denial observed 2026-09-16.

#### `repository-information/ROUTINES-OPERATIONS.md` (new)
- **Lever 2.** The `## Scheduled Refreshes` section was **186 of `profiler-app.md`’s 347 lines** — Routine wiring, repo-access post-mortems, the A/B proof, cost and model analysis, rebuild prompts. All developer-session material that **no run consumes and every run re-read on every turn**. Moved here; `profiler-app.md` drops **82,893 → 51,571 bytes (−38%)**, leaving a pointer plus the only two facts a run needs.
- Both rebuild prompts rewritten against the script and the tiers, ready to paste.

#### `repository-information/profiler-refresh-calendar.json`
- **A `tier` on every cadence row: 52 `core` (90-day sweep), 33 `watch` (180-day), 0 untiered.** Verified non-destructive — 177 rows before and after, no pre-existing field altered.

### Fixed

#### Coverage — 64 of 177 dossiers were covered by no Routine at all
- **The earnings desk covers the 92 public rows; the quarterly sweep named 21 companies inline; that left 64 cadence rows (36% of the corpus) with no refresh path.** Worst segments: `storage-developers-and-ipps` 26 of 34 uncovered, `aidc-developers-and-landlords` 12 of 30.
- **31 of the 64 sit in Megmeet-adjacent segments**, including the four closest SST peers — `amperesand`, `dg-matrix`, `heron-power`, `novos-power` — all refreshed by hand in named developer sessions on 2026-09-12/19, which is the evidence the gap was being absorbed manually rather than noticed.
- **Root cause was the hardcoded list, not the cadence**: a company list inside a Routine prompt cannot be diffed against the corpus and cannot be edited after a rebuild. Coverage is now read from calendar tiers, so it changes by commit.

#### `repository-information/ROUTINES-OPERATIONS.md`
- **Resolved the v07.00r amendment against a live re-test: the documentation is wrong and the original 2026-09-16 finding stands.** Edit opens without an interactable repositories field; the **Runs with** card shows only environment and model. **Rebuild is mandatory**, and this is not to be re-litigated from the docs a third time.

### Changed

#### Routine configuration (API state, not repo files)
- `Classroom curriculum pipeline (C2)` and `Industry Guidance quarterly review` set to **`claude-opus-5`** per the v07.00r analysis.
- **Old earnings desk `trig_01UyH77BMKJnxzBUZJ11ej6A` deleted** on explicit developer permission — created 2026-09-02, no repository, every run ~30s, no commit ever. The repo-attached desk created 2026-09-19 is retained.

## [v07.00r] — 2026-09-21 03:39:15 PM EST

> **Prompt:** "A few questions:\n- How difficult to execute are my routines? You mentioned that they are currently using the default model which is sonnet 5. Evaluate if sonnet 5 is capable enough for my routines. If not, recommend me a different model to use and why. \n- the biggest expense in my last earnings desk run was cache reading. Is there any way to reduce that?\n- I want to delete the old non-functional earnings desk routines, but am worried I will delete the wrong one. Can you give me a link to the old desk to be deleted? Make things as easy as possible. \n\nThen, give me step by step instructions on how to rebuild C2 and my other routines, if needed."

### Changed

#### `.claude/rules/profiler-app.md`
- **Model selection per Routine, decided on evidence rather than on task difficulty.** Every failure in the 2026-09-16→21 saga was infrastructural, not a run reasoning badly — so the default stays. The test that earns an upgrade is narrow: **can a checker see the failure?** `check-classroom-content.py` and `check-classroom-pipeline.py` verify structure only and cannot tell a real freshness pin from a fabricated one, so a structurally perfect lesson with an invented input passes every gate. **Opus 5 for C2 and the Industry Guidance review; Sonnet 5 for the earnings desk, ACL check, opportunity report and quarterly sweep.**
- **Priced the alternatives on the 2026-09-21 run's real token mix.** Sonnet 5 $13.76 · Opus 5 $34.39 · Fable 5.1 $36.61 · Haiku 4.5 disqualified by arithmetic (200K context against runs of 335K and 361K). Two non-obvious results recorded: **Fable 5.1 lands only 6% above Opus 5**, not the 2× its headline price implies, because its cache reads are $0.25/MTok against Opus 5's $0.50; and C2 on Opus 5 costs ≈$42/month of plan allowance.
- **Reframed the cache-read line and then found the thing actually worth cutting.** 42.9M cache-read tokens billed $8.58 but would bill $85.79 uncached — the cache saved $77 and dominating a long run is what it looks like working. The quantity behind it is the lever: **the 384,240-byte / ~96,000-token refresh calendar is read whole to act on one due row worth ~1,300 tokens**, costing ≈$2.46 a run (~29% of the cache-read bill). Added a tested extraction snippet returning 5,075 bytes instead of 384,240.
- **Found a latent correctness bug while measuring it:** the calendar is **2,573 lines against the Read tool's 2,000-line default**, so a plain Read silently truncates the tail of the queue.
- **Named this file's own cost honestly** — 74,675 bytes at the time of writing, seven edits during this investigation, ≈$1.64 a run in per-turn re-reads alongside CLAUDE.md and PROFILER-SCHEMA.md, with a split proposed for when it next grows.

### Fixed

#### `.claude/rules/profiler-app.md`
- **Corrected the "a Routine's repository can never be edited, it must be recreated" claim, which the current documentation contradicts.** `code.claude.com/docs/en/routines` states that **Edit** changes "the name, prompt, **repositories**, environment, connectors, or any of the routine's triggers." The 2026-09-16 observation predates that reading by five days and looked in the "Runs with" card rather than the menu beside the routine's name. **Four rebuilds were about to be recommended on the strength of a claim that may no longer hold** — the amendment requires a two-minute re-test first, and records `/schedule update` in a local terminal as a second editing surface the MCP tools do not expose. What stands: `create_trigger`/`update_trigger` carry no repository parameter, so no session here can attach one by any means.
- **Corrected the v06.19r `fire_trigger` "prompt-injection refusal" post-mortem.** It was a build behaviour, not an anomaly: before v2.1.213 a fired prompt arrived framed as an untrusted background notification and could be refused. Both the refusal and the compliance were correct for their builds. Retiring the diagnostic was still right; the recorded reason was not.

### Added

#### `.claude/rules/profiler-app.md`
- Two operational facts not previously recorded: Routines carry a **daily per-account run cap** separate from subscription limits (so a duplicate left enabled spends cap as well as allowance), and a lapsed GitHub connection makes a Routine **skip runs for 72 hours and then disable itself** — a second, independent cause of "no repository access" to rule out before re-deriving the whole diagnosis.
- The documented canonical Routines URL, `claude.ai/code/routines`.

## [v06.99r] — 2026-09-21 03:18:20 PM EST

> Also, is it using up any of my weekly Fable usage limit?

### Changed

#### `.claude/rules/profiler-app.md`
- **No — and the reason is worth writing down, because "weekly Fable limit" is not the shape the limit actually has.** Verified on the run's own session record rather than inferred: the 2026-09-21 earnings-desk run shows `last_served_model: "claude-sonnet-5"`. All five committing Routines carry `"model": ""`, so a fired session takes the platform default and not whatever model the developer happens to be authoring in.
- **Fable has no separate weekly bucket.** Per Anthropic's help centre, Fable models *"draw from your plan's regular weekly usage limits and use them faster than other Claude models"*; on Max *"you can use up to 50% of your weekly usage limits on Fable models at no extra cost,"* after which Fable alone moves to usage credits while the rest of the weekly limit stays spendable elsewhere. A desk run therefore spends the **shared weekly all-model limit and none of the Fable half**.
- **Recorded the scheduling consequence, which points the opposite way from intuition:** interactive authoring sessions over 2026-09-19..21 valued at **$27-$179 each** against the desk's $14, and the only `seven_day` / `allowed_warning` rate-limit state in this account's session data sat on a **Fable 5.1 interactive session**, never on a scheduled run. Thinning the desk cadence would not protect Fable headroom. The actionable corollary is the inverse: **pinning a Routine to Fable would start drawing the 50% sub-allocation** - leave a Routine's model unset unless there is a reason.

## [v06.98r] — 2026-09-21 03:05:14 PM EST

> A successful run costs $14? Where does that come out from? My claude console balance?

### Changed

#### `.claude/rules/profiler-app.md`
- **v06.97r's "$14 a run" was true but readable as money out of pocket, which it is not. Corrected.** `get_session`'s `usage.cost_usd` is the **API list-price valuation of the tokens consumed**, not a charge against a balance. Verified rather than assumed: the 2026-09-21 run's 42,896,504 cache-read + 1,072,155 cache-write + 557,346 input + 138,201 output tokens at Claude Sonnet 5 rates ($2.00 / $10.00 per MTok, cache write 1.25×, cache read 0.1×) compute to **$13.76 against a reported $13.86 — 0.75% apart**, which identifies the field beyond reasonable doubt.
- **On a Pro or Max plan that value is drawn from the plan allocation, not billed.** Limits are shared across Claude and Claude Code on a five-hour session window plus a weekly cap; Claude Code uses plan allocation only, and API credits are opt-in requiring explicit consent — so a scheduled Routine never silently spends money. The same run's `rate_limit_info` recorded **`isUsingOverage: false`**, confirming it independently.
- **The scheduling-relevant line, added: cache reads were 62% of the cost** ($8.58 of $13.76, on 42.9M tokens) — the agentic loop re-reading its context every turn. Five committing Routines consume **plan allowance in five-hour windows shared with interactive work**, which is the real constraint to plan around, not a dollar figure.

### Notes

- **Why this correction was worth a version.** The distinction changes a decision that is live right now: four Routines are still to be rebuilt, and "five scheduled jobs at $14 each" reads very differently as a monthly invoice than as consumption of a shared five-hour allowance. Sources: [Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan), [Manage usage credits for paid Claude plans](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans).

## [v06.97r] — 2026-09-21 12:04:57 PM EST

> *(Scheduled check-in, fired by the Routine armed at v06.70r: "Monday's two earnings-desk runs should both be finished by now. Close out the 'Repo access denied' issue.")*

### Fixed

- **THE "REPO ACCESS DENIED" ISSUE IS CLOSED. THE REBUILD WORKS, AND A CONTROLLED A/B PROVED IT.** Both desks were deliberately left live for one Monday firing, identical in every respect except the attached repository. The OLD desk (`trig_01UyH77BMKJnxzBUZJ11ej6A`, no repository) fired 13:05:18Z and stood down in **33 seconds** — 48,101 context tokens, 1,200 output tokens, $0.11, no commit. The NEW desk (`trig_01HkrwpCULei8Gje6RGqcp1B`, `LightAISolutions/Sales` attached) fired 13:15:53Z and landed **`cdfafb36` — v06.96r, 13 files, +2,020 lines**: IREN, JinkoSolar and Oracle refreshed, archived at v4 / v5 / v4, registry and graph updated. **That is the first commit a scheduled run has ever landed in this repository.**
- **THE MECHANISM IS VISIBLE IN THE SESSION RECORDS, not merely inferred.** The old run's `session_context` carries **neither `sources` nor `outcomes`**; the new run's carries `sources: [{git_repository: …/Sales}]` and `outcomes: [{… branches: ["claude/funny-shannon-0mrb4f"]}]` — exactly the shape an interactive session has, and exactly what has been missing from every fired session since August. It appears only because the repository was selected on the New routine form.
- **The queue moved as designed.** `profiler-refresh-calendar.json` `updated` 2026-09-13 → 2026-09-21, four rows due → **one**: `iren` (due 2026-08-27) and `jinko` (2026-08-27) and `oracle` (2026-09-10) taken oldest-first, `novonix` (2026-09-14) correctly left for the next run by the cap of three. `iren` and `jinko` had been overdue since 27 August.

### Changed

#### `.claude/rules/profiler-app.md`
- **The A/B recorded as a table beside the 2026-09-18 "cannot push" finding it confirms**, with both sessions' `session_context`, durations, token counts, costs and outcomes, so the proof sits next to the claim rather than in a changelog entry alone.
- **The real cost of a working run recorded: about $14 and a quarter of the context window** for three companies, against eleven cents for each of the 34-second runs that did nothing. **The cheap runs were the broken ones** — a line worth keeping, because cost is the one signal that looked healthy throughout the failure.

### Notes

- **The old earnings desk can now be deleted.** It has served both purposes it was kept for: fallback, and control arm. Left for the developer to do — deletion loses its run history and is assumed irreversible, so it is not something a session should do unasked.
- **C2 is the next rebuild and it fires Wednesday 2026-09-23 04:00 PDT.** Then the two Routines due 1 October and Industry Guidance on 15 October. The ACL health check stays as it is — read-only, working, nothing to gain.
- **The reminder in `REMINDERS.md` is deliberately NOT marked complete.** It is the developer's note; per the User-Owned Content rule a session surfaces and answers it but does not close it.
- **No rotation needed** — another session rotated the archive over the weekend, so the counter stands at **93 raw / 78 non-exempt** against a 100 trigger with fifteen sections dated 2026-09-21 EST.

## [v06.96r] — 2026-09-21 09:28:13 AM EST

> **Prompt:** "[Profiler earnings desk Routine, scheduled fire] STEP 0 — clone, prove push works, before any research. Then: read repository-information/profiler-refresh-calendar.json as the queue. DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run, oldest nextReport first. For each: (1) verify the report actually published, (2) run the Profiler Command end to end including the news-triage step against the Scraper corpus (token supplied in the Routine prompt only, never written to the repo), (3) advance the row's nextReport/confirmed/source/lastRefreshed/watch[]. Also confirm any unconfirmed row due within seven days. Land one commit per run under the repo's normal Pre-Commit/Pre-Push checklists. Never create/update/delete a Routine or trigger. If nothing is due, stand down with no commit."

### Fixed

#### Scheduled Routines — the earnings desk landed a commit for the first time
- **The push path held this run.** `git clone` + `git push --dry-run` both succeeded before any research began, confirming the 2026-09-18 finding (Routine recreated with the repository attached at creation) is holding — the desk has now gone clone→research→commit→push clean, closing the loop that failed 7-for-7 in August and again on 2026-09-16 (`a378a96`, unrecoverable) and 2026-09-18 (34-second stand-down, no repo access).

### Changed

#### `live-site-pages/profiler-data/iren.profile.json` — profileVersion 4 → 5
- **FY2026 annual results (fiscal year ended 2026-06-30) added** — confirmed published 2026-08-27 via IREN's own wire release, corroborated by GlobeNewswire/StockTitan/Barchart/TradingView (sec.gov/data.sec.gov 403-blocked from this network for the whole session, per `check-source-reachability.py`; the 10-K itself was not read directly, and the dossier says so). Revenue $707.0M (+41% YoY; mining $578.2M / AI Cloud $128.8M) — a 2.2% miss vs the $722.9M consensus already on file. Net loss $702.6M (including $638.8M of non-cash Bitcoin-hardware impairment) vs FY2025's $86.9M profit; diluted loss per share -$2.06 against the -$1.57 consensus — a wider miss than revenue. Adj. EBITDA $245.7M. Cash $5.9B unrestricted + $1.7B restricted (~$7.6B total, now final, not preliminary). $4B contracted 2026 ARR (largely sold out) / $1B operating ARR as of Aug 26. New named customers disclosed: Cohere, Prometheus, Fal AI, Higgsfield AI, plus an unnamed "leading frontier AI lab" — none are covered companies, so no new `relationships[]` entries. Management gave the first hard mining-exit date: "effectively decommissioned" by end of December 2026
- **Two new `recentDevelopments[]` entries**: Sweetwater's 2GW hub conditionally entering ERCOT Batch Zero as Base Load (2026-09-08, still no named tenant) and the PUCT's approval of a 765kV transmission route benefiting Sweetwater (2026-09-01, Oncor targeting 2028-2029). `strategyRead[]` bullets on the mining exit and the FY26 miss updated with the confirmed figures. 5 new `sources[]`, chronological
- **Honest gaps recorded rather than guessed**: no updated Bitcoin EH/s hashrate found anywhere in the FY26 release (last published figure remains October 2025); convertible-note tranche breakdown inside the 10-K itself not independently re-verified (the ~$6.3B total stands, consistent with the prior derived estimate); FY26-close GPU fleet unit count not disclosed

#### `live-site-pages/profiler-data/jinko.profile.json` — profileVersion 5 → 6
- **Q2/H1 2026 results added** — confirmed published 2026-08-26 via JinkoSolar's own PRNewswire release. Q2: revenue RMB 12.36B/$1.82B (-31.3% YoY, +0.9% QoQ); gross margin **4.2%, down from Q1's 8.3%** — a reversal, not the continued recovery the prior dossier version was tracking; net loss RMB 697.3M/$102.8M; module shipments 15.96 GW. H1: revenue RMB 24.61B/$3.63B; net loss RMB 1.16B/$171.1M; 29.6 GW modules; 3.1 GWh ESS shipped. **FY2026 module guidance cut to 60-70 GW** (from 75-85 GW)
- **Rebranding proposal verified, NOT yet effective** — board proposed renaming to "Jinko Holdings Limited" (晶科控股有限公司) on 2026-09-09, pending a shareholder vote at the 2026-10-21 AGM; ticker JKS unaffected. Recorded as a `corporate` recentDevelopment with an explicit pending-vote flag — `name`/`shortName` intentionally left unchanged per the schema's rename rules until the vote actually happens. Registry `aka[]` (`profiler-companies.json`, "jinko" entry) gained "Jinko Holdings Limited" / "Jinko Holdings" / 晶科控股有限公司 plus other existing-name variants for the step-7 reconciliation grep; collision test on "Jinko Holdings" returned zero corpus hits
- **CEO change found and incorporated**: founder Li Xiande stepped down as JinkoSolar Holding CEO 2026-08-26 (remains Chairman); Wei "Dimi" Du succeeded him — `decisionMakers[]` updated, new `leadership` recentDevelopment added
- **FEOC exposure found and incorporated**: the Jacksonville, FL plant's 75.1% stake was sold to FH JKV Holdings (~$191.5M, closed 2026-05-31, deconsolidated 2026-06-01) under FEOC 25%-ownership-threshold pressure — new `policyExposure` entry added, AD/CVD mitigation text updated accordingly
- **Also**: SunGiga G2/IES Middle East ESS distribution deal (2026-09-10, BNEF Tier-1 status now 10 consecutive quarters); Tiger Neo 5.0 mass production noted (25.91% efficiency, >700W) as the platform's next step

#### `live-site-pages/profiler-data/oracle.profile.json` — profileVersion 4 → 5
- **Q1 FY2027 results added** (quarter ended 2026-08-31) — confirmed published 2026-09-10, matching the calendar's mid-September tracker estimate. Revenue $19.3B (+30% YoY, beat ~$19.14B consensus); OCI infrastructure revenue $7.4B (+121% YoY); total cloud $11.6B (+62%). **RPO $664B, up only +$26B sequentially versus +$85B the prior quarter** — the backlog-growth deceleration the calendar's watch item was tracking, addressed as a new `strategyRead[]` bullet rather than a resolved question, since FCF and capex held at similar order of magnitude to FY2026's run rate (FCF -$5.4B on capex $28.5B). GAAP EPS $1.56 (beat); FY2027 guidance held (gross capex $90-95B, net cash capex <=$70B)
- **The ~$40B financing-form watch item**: evidence points equity-first — the $20B ATM equity program was reported completed during the quarter, no new bond issuance found in the window, and Oracle's own February guidance said it didn't expect further CY2026 bond issuance. No evidence found that it's asset-secured; recorded at moderate confidence, not asserted as certain
- **5 new `recentDevelopments[]` entries**: the 2026 Restructuring Plan supplemented ~$700M (total ~$2.8B, 2026-09-14); the Oracle/OpenAI Project Jupiter (NM) solar push to counter community pushback plus an emissions dashboard and $1M carbon-capture commitment (2026-09-11); the Q1 FY2027 release itself (2026-09-10); a 2GW New Mexico renewable-capacity RFP (2026-09-08); and an expanded HPE partnership for OCI fabric networking under which HPE reportedly received Oracle warrants (2026-09-04)
- **Step-7 full cross-dossier reconciliation deliberately NOT attempted** — Oracle remains in the 40+-inbound-mention class per the calendar's explicit scope note, deferred as a session of its own

#### `live-site-pages/profiler-data/archive/` and registry
- Three archived snapshots added (`iren.profile.v4.json`, `jinko.profile.v5.json`, `oracle.profile.v4.json`) with matching `archive-index.json` entries. `sync-profiler-registry.py` reconciled all three roster entries (`lastUpdated`, `srcTotal`, `srcFirstPct`); `build-profiler-graph.py` regenerated the ecosystem graph (1,482 edges); `check-profiler-relationships.py` and `check-profiler-crossrefs.py` both ran clean (0 findings across 440 examined pairs, corpus-wide). Manual step-7 grep-and-read reconciliation for IREN (8 inbound files) and Jinko (3 inbound files) found only peer-comparison mentions, no contradicted claims — segment memberships in `profiler-segments.json` checked against the revised `ecosystemRole` for all three companies and found still consistent, no reassignment needed

#### `repository-information/profiler-refresh-calendar.json`
- All three rows advanced: `iren` → nextReport 2026-11-05 (tracker estimate off IREN's own Q1 FY2026 precedent, not company-confirmed), `jinko` → nextReport 2026-11-10 (tracker estimate, prior quarters reported at inconsistent lags), `oracle` → nextReport 2026-12-10 (tracker estimate off Oracle's own ~3-month filing cadence). `lastRefreshed` set to 2026-09-21 on all three; `watch[]` rewritten around each company's actual post-refresh open questions. `novonix` (nextReport 2026-09-14) left untouched — over the three-row cap this run, due again tomorrow

### Notes

- **News triage ran against the Scraper corpus for all three companies** — 50 (IREN) / 16 (Jinko) / 26 (Oracle) scored items pulled since each dossier's prior `lastUpdated`, each promoted item verified against its underlying article/press release before being written into a dossier rather than taken on headline/score alone

## [v06.95r] — 2026-09-21 07:50:53 AM EST

> **Prompt:** "Run E0 — the Events registry and source roster — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.4 is the brief (follow its reading list in order, then its five steps exactly — the corpus pass first, then the organiser-page research, the live-probed roster, the checker, the files), §5.1–5.2 and Appendix A the design and the 64-row seed calendar, and repository-information/EVENTS-SCHEMA.md §1, §3, §4, §11, §12 the shapes. This is research and data, not app code: create live-site-pages/events-data/events.json and events-sources.json, scripts/extract-corpus-events.py and scripts/check-events-registry.py, and nothing under Events.html / Events.gs (that is E1). Every event is `confirmed` only on an organiser page you read this session (WebFetch); a row you could not read stays `tentative` with the third-party listing as its `manual` source and a note. Probe every roster row live before writing it, the .claude/rules/scraper-sources.md way (curl status, JSON-LD Event or VEVENT count, newest item, robots), and record a Cloudflare challenge as `blocked: "<reason> <date>"` — keep the row, never try another URL or User-Agent; 10times, DCD, OCP and Enlit are known blocked and hand-maintained. Never add LinkedIn, 10times, a Google-News feed or an attendee list as a source. All 31 corpus events must end with ≥ 1 mentions[] entry; target ≥ 60 events; the checker must exit 0 on the files you commit. Current state: the repo is at v06.94r, N2 is Done (§11), and the E1 brief already exists as §13.7 — so ignore §13.4's closing line about writing E1 as §13.6: write nothing new in §13, only flip §11's E0 row to Done with the version and the counts (verified on the organiser's page, still tentative, blocked sources with reasons). README tree entries for the new events-data/ folder, both files and both scripts; mirror profiler-data/'s treatment in REPO-ARCHITECTURE.md if it appears there; CHANGELOG entry naming those same counts. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG stands at Sections: 90/100 — no rotation is due (90 < 100). One push — or two if the roster runs as its own Fable 5.1 Medium session per §13.4 step 3."

### Added

#### `live-site-pages/events-data/events.json`
- **The public Events registry — 100 events: 72 `confirmed`, 27 `tentative`, 1 `past`.** One row per edition per `EVENTS-SCHEMA.md` §3 — slug, series, organiser, kind, `start`/`end`, IANA `tz`, city/region/country, venue and `venueLatLng` where the organiser publishes one, website plus registration / exhibitor-list / agenda / speakers / floor-plan URLs, `audience[]` segment ids from `profiler-segments.json`, `relevance` 1–5, a `tierNote`, show-floor `hours[]` where published, and `editions[]` for the prior year
- **`confirmed` means an organiser page was read this session** — 72 rows clear that bar, plus the one `past` row (NAATBatt 2026) which was organiser-read before the checker flipped its status. The other 27 stay `tentative`, each with a `manual` source and a `tierNote` saying exactly why: eleven because the organiser blocks non-browser clients, the rest because the organiser has published no dates for that edition. **No row is ever `confirmed` on a third-party listing**
- **Sub-mega and social tiers the dossier corpus never names** are now carried: nine iMasons chapter socials and webinars, seven Bisnow one-day regionals, four GCPA rows, eleven Infocast conferences, and the two ESIG workshops
- **Appendix A caveats resolved.** The DCD>Connect New York 2027 date conflict stands unresolved *by design* and is recorded as such — Clocate's JSON-LD (read this session) gives 17–18 Mar 2027 at the New York Marriott Marquis, a second mirrored listing gives 17–18 May, and DCD's own page is Cloudflare-blocked, so both are written into the `tierNote` and the row is `tentative`. NAATBatt's weakly-sourced Aug 1–5 2027 row is **dropped**: the organiser publishes only the Feb 9–12 2026 edition and no 2027 dates. From the "not yet dated for 2027" list, **Wood Mackenzie North American Power & Renewables (Apr 28–29 2027, Omni Interlocken, Denver) and Datacloud USA (Aug 31–Sep 2 2027, Fairmont Austin) are now dated and confirmed**; Solar & Storage Live USA, DCD Silicon Valley/Dallas, Bisnow DICE South/West and Uptime 2027 remain undated
- **Three seed-calendar errors corrected against the organiser**: ACP Siting + Permitting and ACP PEAK are two events (Apr 13–15 and Apr 15–17 2027), not one Apr 13–17 row; Energy Storage Summit USA 2027 moves to the Renaissance Dallas at Plano Legacy West (the seed's Hilton Lincoln Centre was the 2026 venue); and six rows the seed calendar could only source third-party — GTC 2027, InterBattery 2027, CIGRE Grid of the Future 2026, IEEE PES General Meeting 2027, The Battery Show Europe 2027 and AWS re:Invent 2026 — are now read from the organiser's own page

#### `live-site-pages/events-data/events-sources.json`
- **The source roster — 58 rows, every one probed live before it was written** (HTTP status, `Event`/`VEVENT` count, newest item, and `robots.txt` evaluated for the fetched path), the `.claude/rules/scraper-sources.md` discipline verbatim
- **11 live JSON-LD feeds** the E2 poller can read: The Battery Show NA, DISTRIBUTECH, Data Center World, POWERGEN, Yotta, MWC Barcelona, Datacloud USA, AI Infra Summit, Clocate — and two the seed calendar did not know about, **iMasons (11 `Event` objects) and ESIG (12)**, which between them carry the entire sub-mega and social tier
- **24 blocked rows, each kept with its reason and date so it is never re-proposed**: `cloudflare-challenge` on OCP, DCD, Enlit, 10times, SEMI/SEMICON West and Gartner; `403-akamai-non-browser` on CERAWeek; `403-datadome` on Reuters Events; `403-azure-waf` on GCPA and NAATBatt; `no-feed` on Uptime Institute (its `/events` path 302s off-site to google.com), Hannover Messe, Microsoft Ignite, EEI, NARUC and Hot Chips; and 404 / 503 / DNS failures on Solar & Storage Live, SNEC, CIBF, ESIE, IDEE Shenzhen, Battery Japan and AMD. No alternative URL or browser User-Agent was tried on any of them
- **COMPUTEX is on the roster with `robots: disallowed`** for the fetched path — the row records that the poller must skip it and the registry entry is hand-maintained
- **The 10times row exists only as a never-re-propose marker.** It is cited by no event and never may be: `check-events-registry.py` rejects any event source whose host is LinkedIn, 10times or Google News

#### `scripts/extract-corpus-events.py`
- Walks all 177 dossiers' `recentDevelopments[]`, `productsAndServices[]`, `technicalSpecs[]`, `strategyRead[]` and `sources[]` against a table of **33 corpus events** (one regex and one target edition per row), emitting **256 `mentions[]` rows across 90 dossiers onto 32 registry rows** — every corpus event ends with at least one mention (`ees Europe` and `The smarter E` resolve to the same edition, which is why 33 keys land on 32 rows)
- Idempotent — rewrites every `mentions[]` from scratch each run; `--check` fails when the file is stale and `--report` prints the per-event table. Seeds a `tentative` row for any table event with no registry row, so a new corpus event is never silently dropped
- The table documents what was **checked and rejected** as not being events: `SNE Research` (a research firm, 9 files), an `ESIG` report, `Data Center Frontier` the publication, the `Uptime Institute M&O Stamp` certification, `Supercomputing centres` as a noun phrase, and the `OCP-Ready` / `Open Rack Wide` specifications

#### `scripts/check-events-registry.py`
- Implements every assertion in `EVENTS-SCHEMA.md` §12 — slug rule and uniqueness, `start` ≤ `end`, IANA `tz` resolved through `zoneinfo`, `audience[]` ids present in `profiler-segments.json`, every `sources[].sourceKey` in the roster **with its URL host matching that roster row**, every `mentions[].slug` resolving to a dossier, `lastUpdated` and ≥ 1 source with `lastConfirmed` on every row, no roster row without a `lastProbe`, and `status = past` iff `end` < today. `--fix-past` flips `status` and nothing else
- Two assertions beyond the schema, both earned this session: a `confirmed` row must carry at least one source whose `kind` is not `manual` (a listing can never confirm), and no event source may have a LinkedIn, 10times or Google-News host
- A minimal RFC 5545 `VEVENT` walker runs over `events.ics` when E1 publishes one — unfolding continuation lines and requiring `UID`, `DTSTART` and `SUMMARY` per event with no duplicate `UID`. An absent file is not a finding
- Exits 0 on the files committed here

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11's **E0 row flipped to Done** with the version and all three count sets the brief asks for — verified on the organiser's page, still tentative, and every blocked source with its reason. Nothing new written in §13: E0's brief closes by asking for an E1 brief as §13.6, but N2 already wrote E1 as §13.7, so that line is stale and was not acted on

#### `README.md`
- Structure-tree entries for the new `live-site-pages/events-data/` folder and both its files, and for both new scripts (`extract-corpus-events.py` placed beside `check-events-registry.py` rather than alphabetically, matching how the Scripts group is organised by subsystem)

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten at the close of N2 (v06.94r; the phone check pending; E0 next with its prompt handed over in chat); the earlier entry moved to Previous Sessions under the two-session cap

## [v06.94r] — 2026-09-21 06:47:37 AM EST

> **Prompt:** "Run N2 — accounts and the corpus attachment — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.6 is the brief (follow its reading list in order, then its five build steps exactly), §4.1 and D4 the design, and repository-information/NETWORK-SCHEMA.md §3 (Accounts), §4, §12, §13 the shapes. N1 is done (v06.90r; Network.html v01.10w, Network.gs v01.05g): every saved contact already has an Account, the review card already resolves the company against the public registry and the D5 stage rule is enforced on both sides — build the Accounts surface, nop=account, the Profiler.html#<slug> deep links, the propose-a-dossier hook and the on-the-record check against decisionMakers[] on top of that, in the PROJECT regions of Network.gs and Network.html only. Keep every UI rule N1 set (no ids or confidence numbers on a card, the pill rows, the two-half control rows, the paper-and-ink family) and never touch the IndexedDB name, version or pending store. List ops stay minimum-necessary (§12); audit rows carry ids and counts only; the dossier file is fetched only when a detail opens. Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-network-roles.py (zero page errors at phone width) and scripts/check-network-schema.py (exit 0). Page + GAS bumps with changelogs, CHANGELOG entry, flip §11's N2 row to Done with the versions and write the E1 brief as §13.7 (or the next free number) before closing — then hand off in chat what to check on the phone: an account row for every company saved from the 20 cards, the Profiler link on a covered one, the profiler <Company> line copied from an uncovered one, and the on-the-record title for any contact who is in a dossier's decision-makers. Do not touch Events, the bridge (B), the list's filters or exports (N3), or any interval (Q). Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG stands at Sections: 86/100 with eight sections dated 2026-09-21 EST — no rotation is due on any later date either (86 < 100), so expect none. One push."

### Added

#### `googleAppsScripts/Network/Network.gs` — v01.07g
- **N2 — `nop=account`** (body-POST, `nwAccountOp_`): edits one owned Account row through `nwAccountFullFromPayload_` — the save-path validator (`nwAccountFromPayload_`: relationship / stage enums, the D5 `STAGE_NEEDS_TARGET_OR_CUSTOMER` rule, the slug shape) plus `Tags`, `Newsroom URL` (a bare host prefixed `https://`) and `Notes`; the row is rewritten with `Updated At`, a rename rewrites `Normalised Name` and is refused with `account_name_taken` when another live account of the owner holds the key; audit row `{ accountId, renamed, tags: <count> }`
- **The list op's one widening** (§12): `contactCount` per account, counted server-side from the live contacts already in the payload — tags, HQ, notes and the newsroom URL stay detail-only
- **`nop=get` on an `a-` id** answers the live contacts beneath the account (`contacts[] { id, name, title, role }`); `nwAccountPublic_` now carries `newsroomUrl`

#### `live-site-pages/Network.html` — v01.14w
- **The Accounts card** under the Contacts list (`nwAccountsCard` / `nwAccountRow`): one row per live account — name · relationship · stage · contact count, the `Profiler ↗` link on the row when covered, Delete → Restore on the side; tap → `nwAccountDetail` (`nop=get` with the `a-` id): relationship, the dossier link or the propose state, segments as registry labels, tags, HQ, newsroom, notes, the contacts beneath, **Edit** and **Propose a dossier**. The card's own status line (`nwAcctStatus`, kept across the post-write re-render like the Contacts card's) shows the `account_has_contacts` refusal with its count — nothing cascades
- **`nwAccountBlock`** — the account block lifted out of `nwReviewSection` (covered / uncovered chip, the Profiler link checkbox, the relationship + stage two-half row under the D5 `gateStage`, the segments) and shared: the review card calls it as before; `nwEditAccount` calls it in full (name, tags, HQ, newsroom URL, notes) and writes back through `nop=account`; an unlinked account is offered the registry match for its name
- **The Profiler deep link** (`nwProfilerHref` → relative `Profiler.html#<slug>`, same origin) on the account row, the account detail and the contact detail's account line (`nwAccountLine`); segments as their labels from `profiler-segments.json` (`nwSegments`, fetched once like the companies file)
- **Propose a dossier** (D4, `nwProposeDossier`): the exact `profiler <Company Name>` line copied to the clipboard when the browser allows and always shown in a selectable `<code>` line; the account marked `dossier-proposed` through `nop=account`. Nothing is generated in-app
- **The on-the-record check** (`nwRecordCheck`): for a contact at a covered account, `profiler-data/<slug>.profile.json` is fetched only when the detail opens (cached per slug for the page's lifetime — never on the list paint) and the contact's romanised name is compared with `decisionMakers[].name` through `nwNameKey` (the client mirror of `nwNameKey_`); a match shows "On the record as <title> — Profiler, <source or dossier date>", and a differing card title is a note under it, never written anywhere
- **§6 folder rename on the next save** (`nwFolderRenameIfDrifted` in `nwEnsureAccountFolder`): one `files.get` for the folder's name, one `files.update` when it drifted from `nwSafeFolderName(accountName)` — a Tidy or an account edit that renamed the company now renames its Drive folder when the next card is filed there; soft on any Drive error

### Changed

#### `scripts/check-network-schema.py`
- Asserts the D5 validator is reached by **both** write paths — `op === 'save'` → `nwSaveOp_` and `op === 'account'` → `nwAccountOp_` must each call the function that throws `STAGE_NEEDS_TARGET_OR_CUSTOMER` (directly or through `nwAccountFullFromPayload_`); `renamed` (a flag) and `tags` (a count) join the audit-row allow-list

#### `scripts/verify-network-roles.py`
- The stub answers `nop=account`, `nop=get` for an `a-` id (with the contacts beneath), `contactCount` on the list and the `account_has_contacts` refusal with its count; the probe reports the Accounts card and every turned-away tier asserts its absence; the accounts round-trip — rows read name · relationship · stage · count, the `Profiler.html#abb` href on the covered row, no dossier fetched on the list paint, the account detail with its contacts and the segment label, Edit flipping Acme to `partner` with the stage select disabled and reset to `none` and the `nop=account` payload asserted, the on-the-record line from the **served** `abb.profile.json` (a real covered slug, the shipped shape) with the differing-title note, the `profiler Acme Energy` line and the `dossier-proposed` tag, the refusal with the count leaving the rows untouched; two new screenshots. Clipboard permission granted to the stub origin (best-effort)

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11 N2 row → **Done — v06.94r**; **§13.7 written** — the E1 brief (Events scaffold + calendar, two sessions, E0 as a stated prerequisite) and its paste-in prompt

#### `repository-information/NETWORK-SCHEMA.md`
- §3: the `dossier-proposed` tag and the Accounts-card edit of `Newsroom URL` recorded; §12: `contactCount` named as the list op's one widening and the `a-` detail's contacts; §14: the checker's both-paths assertion

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten at the close of the previous session (four pushes v06.90r–v06.93r; Tidy confirmed working on the phone; N2 next); the earlier entry moved to Previous Sessions under the two-session cap

#### `README.md`
- Display v01.14w / v01.07g; the two checkers' descriptions carry N2

### Notes
- Still 2026-09-21 EST — 90 sections, twelve dated today and exempt; no rotation. CHANGELOG `Sections: 78/100` → `90/100`
- The brief's numbers were a session behind: the repo stood at v06.93r (`Network.html` v01.13w, `Network.gs` v01.06g, CHANGELOG 89/100) when N2 started, not v06.90r / v01.10w / v01.05g / 86 — nothing in the build depended on them

## [v06.93r] — 2026-09-21 06:25:15 AM EST

> **Prompt:** "I tapped "Tidy titles and companies" and nothing happened. Fix it."

### Fixed

#### `live-site-pages/Network.html` — v01.13w
- **Tidy gave no feedback where the developer was looking.** `nwTidySaved` reported only through `nwCaptureStatus` (the capture card's line at the top of the page — off-screen from the Contacts card on a phone) and called `nwAfterWrite()` only after the whole run, which takes 30–60 s against the real backend at one `nop=get` (+ one `nop=update`) per contact; from the list, nothing visibly changed. Now: the pill (`#nw-tidy-btn`) reads "Tidying N of M…" and is marked busy while it runs; a status line inside the Contacts card (`#nw-list-status`, `nwListStatus`, kept in `_nwListStatus` so it survives the list re-render — built directly into the new card rather than looked up, because the card is not in the DOM yet when it is assembled) carries progress and the result, including "everything was already in the standard form"; each changed row re-cases in place as its update lands (`nwRowRecase`); the per-contact work is wrapped so an exception or a failed `get` / `update` is counted and named in the result instead of ending the run silently

### Changed

#### `scripts/verify-network-roles.py`
- The Tidy round-trip now asserts the result line inside the Contacts card (shown, ok-styled) and the button back at its label; a timeout on that wait reports the two status texts and the last page errors

#### `README.md`
- Display v01.13w

### Notes
- Still 2026-09-21 EST — 89 sections, eleven dated today and exempt; no rotation. CHANGELOG `Sections: 78/100` → `89/100`
- Verified: `check-gas-inner-scripts.js`, `check-readme-tree.py` (0 findings), `verify-network-roles.py` (all checks passed), `check-network-schema.py` (exit 0). `Network.gs` untouched

## [v06.92r] — 2026-09-21 05:53:43 AM EST

> **Prompt:** "A few changes to the saved contacts that I want you to remember and use for new entries:
>
> * Justin Garver:
>    * VICE PRESIDENT, PRE-CONSTRUCTION -> VP, Pre-Construction
> * David Jeon:
>    * Vice President -> VP
> * Ryan De La Cruz:
>    * Vice President -> VP
> * Rubin Sidhu, Ph.D.:
>    * Director of Onshore Renewables -> Director, Onshore Renewables
> * Keith Allen:
>    * Senior Manager -> Sr. Manager
> * Mark Christensen:
>    * DIRECTOR, STORAGE ENGINEERING -> Director, Storage Engineering
>    * AVANTUS -> Avantus (apply this change to all "AVANTUS" employees)
> * David Olmos:
>    * SR. MANAGER, STORAGE ENGINEERING -> Sr. Manager, Storage Engineering
> * Austin York:
>    * DEVELOPMENT COORDINATOR -> Development Coordinator
>    * Jupiter POWER -> Jupiter Power
> * Chris Page:
>    * CYPRESS CREEK RENEWABLES -> Cypress Creek Renewables
> * Randi Tveitaraas Jack:
>    * DEPUTY DIRECTOR -> Deputy Director
> * Kamran Moradi, Ph.D.:
>    * SR. DIRECTOR, STORAGE ENGINEERING -> Sr. Director, Storage Engineering
> * Brian Grummel, Ph.D.:
>    * SR. DIRECTOR, STORAGE ENGINEERING -> Sr. Director, Storage Engineering
> * Mohammed S. Alrai:
>    * RAI ENERGY -> RAI Energy"

### Added

#### `live-site-pages/Network.html` — v01.12w
- **Tidy saved contacts** (`nwTidySaved`): a pill at the top of the Contacts card runs the standardisation over every saved row — `nop=get` → `nwRecFromRow` → `nwResolveCard` (registry casing) → `nwTidyNames` → `nop=update` only when title / department / company moved — and reports "N of M changed" with the first changes named. The spreadsheet is not reachable from a session, so this is how the fourteen corrections land on the phone (and how any later rule change reaches rows saved before it)
- `NW_CASE_FIXES` carries the developer's ruled-on words (`rai` → `RAI`); `NW_RANK_OF_RE` turns "<rank> of <dept>" into "<rank>, <dept>" for Director / Manager / VP / EVP / Coordinator / Engineer / Analyst / Specialist / Lead / Supervisor / Officer (with Sr. / Deputy / Assistant / Associate / Executive prefixes) — "Head of IT" and "Chief of Staff" are untouched. All fourteen of the developer's cases assert in Node and in the verifier

### Changed

#### `scripts/verify-network-roles.py`
- The developer's fifteen cases (the fourteen plus the two "of" exceptions) asserted; a Tidy round-trip (a row seeded with "SR. DIRECTOR, STORAGE ENGINEERING" re-cased through one `nop=update`); the two earlier expectations that carried "of" updated to the comma form

#### `repository-information/NETWORK-SCHEMA.md`
- §3 Contacts: the display-casing rule for Title / Department / Account Name recorded with a pointer to `nwStdField` and the remembered word list

#### `README.md`
- Tree: `Network.html` description; display v01.12w

### Notes
- Still 2026-09-21 EST — 88 sections, ten dated today and exempt; no rotation. CHANGELOG `Sections: 78/100` → `88/100`
- Verified: `check-gas-inner-scripts.js`, `check-readme-tree.py` (0 findings), `verify-network-roles.py` (all checks passed, 0 page errors), `check-network-schema.py` (exit 0). `Network.gs` untouched

## [v06.91r] — 2026-09-21 05:39:58 AM EST

> **Prompt:** "Standardize titles, departments, and company names to first-letter-capitalized-rest-not unless the titles are of a C-suite or reasonably-assumed to be a 3-letter acronym. If a title is Vice President or VP, standardize to VP. If a title is Executive Vice President or EVP, standardize to EVP. If a title has Senior in it, standardize to Sr. Also, allow me to edit saved contacts."

### Added

#### `googleAppsScripts/Network/Network.gs` — v01.06g
- `nop=update` (`nwUpdateOp_`, body-POST): the save validators (`nwContactFromPayload_` / `nwAccountFromPayload_`, enums + the D5 stage rule) on an existing owned row, rewritten in place with its id, `Raw Extraction`, `Created At`, `Deleted At` and (when the payload carries none) its card links kept; the account re-resolved through `nwAccountResolve_`; an `account-change` Interaction with the previous `a-` id when the employer differs (D4). No dedupe on an update. Audit `{ contactId, accountId, accountCreated, accountChanged }`; dispatcher case

#### `live-site-pages/Network.html` — v01.11w
- **`nwStdField(s, isTitle)`** — the standardisation rule for titles, departments and company names: word-wise First-letter caps, rest lower; kept in capitals: a C-suite title (`NW_CSUITE`), a listed abbreviation (`NW_ACRONYMS` — VP, EVP, IT, HR, EMEA, LLC, R&D …), in a mixed-case string any 2–4-letter capital token, in an ALL-CAPS string a 2–4-letter token with no vowel (TSMC) or a lone ≤3-letter name (ABB); a token already in mixed case (McKinsey, iPhone) left as printed; `NW_CASE_FIXES` for GmbH / LLC / Ltd / Inc / PhD; connector words (of, and, for, de, von …) lower unless leading; parentheses never touched. `nwTitleAbbrev` on titles first: Executive Vice President → EVP, Senior Vice President / SVP → Sr. VP, Vice President / V.P. → VP, Senior / Sr → Sr.  Applied through `nwTidyNames` (extraction, held-card load, Retry) and on the editor's title / department / company fields; a company resolved to the registry takes the registry's `name` casing (`nwResolveCard`)
- **Edit a saved contact**: the row detail gains an **Edit** pill; `nwRecFromRow` builds the editor's record from the `nop=get` response (`saved: true`, review block pre-filled from the contact and its account); `nwEditCard` takes `{ host, onSave }` so the same form mounts inside the row detail and submits through `nwUpdateContact` → `nop=update` → `nwAfterWrite()`; `nwPendingSave` ignores a saved record so nothing is written to IndexedDB

### Changed

#### `scripts/verify-network-roles.py`
- The stub answers `nop=update` (row rewritten, account re-resolved, `accountChanged`); after delete → restore: 17 `nwStdField` cases asserted, then the saved-row Edit — editor pre-filled (name, company, role, stage, source event), title set to "senior vice president, grid" and role to champion, the `nop=update` payload carries `Sr. VP, Grid` / `champion` / the met date, the row re-renders with the new title, no held record written; the merge-sheet assertion now accepts several differing fields as long as every checked radio is the new card

#### `scripts/check-network-schema.py`
- `accountChanged` added to the audit-key allow-list (a flag)

#### `README.md`
- Tree: `Network.html` description extended (standardisation, edit-in-place); displays v01.11w · v01.06g

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11 N1 row and §13.6 prompt: versions advanced to v01.11w / v01.06g, v06.91r

### Notes
- Still 2026-09-21 EST — 87 sections, nine dated today and exempt, 78 non-exempt; no rotation. CHANGELOG `Sections: 78/100` → `87/100`
- Verified: `node --check` on the `.gs` copy, `check-gas-inner-scripts.js`, `check-readme-tree.py` (0 findings), `verify-network-roles.py` (all checks passed, 0 page errors), `check-network-schema.py` (exit 0)

## [v06.90r] — 2026-09-21 05:01:07 AM EST

> **Prompt:** "Run N1 session 2 — review, dedupe, save — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.5's Session 2 paragraph (steps 6–10) is the brief, §4.2 the pipeline, and repository-information/NETWORK-SCHEMA.md §1, §3, §4, §6, §7 (dedupe paragraph), §12, §13 and §14 the shapes and the checker spec. Read first, in this order: the plan's §3 (D4, D5, D8, D9, D14), the Network.gs PROJECT region as it stands after session 1 (nwExtractOp_, nop=newid, handleNetworkOp_, nwNewId_, nwNormaliseCompany_, nwFoldersGet_ / nwFoldersSet_ with its accounts map, nwListRows_, the enum lists), the Network.html PROJECT region (nwProcessPair, the IndexedDB pending store and its record shape — id, extraction in the §7 shape with confidence{}, viaQr, sides, frontLink, backLink, driveError, createdAt, dismissed{}, edited — nwRenderStrip, nwEditCard / NW_EDIT_FIELDS, nwDeleteCard, nwApiBody, nwUploadPair, nwEnsureFolders, _nwFolders, nwCapName, nwAfterWrite), then in Receipts.gs saveReceipt and in Receipts.html the review card only for the select idiom. Session 1's UI decisions stand: no c- id and no confidence numbers shown on a card, no "missing field" cues, names ALL CAPS or all-lower become First-letter caps and mixed case is never touched, the Front / Back / Edit / Delete pill row, and the two-half control rows. The developer scanned 20 real cards (three Chinese-script, two two-sided) into v01.09w; they are held in that phone's IndexedDB pending store with their photos in Drive Network App/_inbox/. Do not change the IndexedDB name or version and do not drop or rewrite pending — session 2's save reads exactly those records.
>
> Build, in the PROJECT regions of Network.gs and Network.html only: (6) the review card on the existing editor — add role from NW_ENUMS.role, the account block (company name pre-filled from extraction.company, relationship defaulting to target, stage: none, the D5 rule that stage may leave none only for target · customer), Source Event free text, Met Date defaulting to the record's createdAt date, Consent Marketing defaulting to unknown, Do Not Contact off, the low-confidence outline reusing the existing note/nwUnclearFields, Retry extraction (re-runs nop=extract with the same c- id from the held base64 if still present, else from the Drive files via the user's token) and Swap front / back; a Save pill on every held card and a Save all for the stack. (7) Company resolution against live-site-pages/profiler-companies.json (name / aka[] / domains[], one public fetch cached page-lifetime) proposing the slug and pre-filling Segment IDs from the registry's segments[]; otherwise a new local Account keyed by nwNormaliseCompany_; the developer confirms in the account block. (8) nwFindDuplicate_ server-side on normalised email → E.164 phone → normalised name + Account, answered before the write so the client can offer merge field-by-field (newest wins by default, both card pairs kept, the absorbed c- id recorded in a merge Interaction) — never a silent reject, never a bare "save anyway". (9) nop=save (body-POST — Raw Extraction carries the model response): validate every enum against the flat lists and the D5 stage rule, write the Contact + the new-or-existing Account + one scan Interaction; then browser-side move the two Drive files from _inbox/ to <Company>/ (files.update with addParents / removeParents; the per-Account folder created on first save and parked through setfolders accounts), write the new links back, delete the pending record, and call nwAfterWrite() (D14). The list rows then need a row surface: name · title · company, tap for the full row (nop=get), soft delete with one-tap restore (nop=delete / nop=restore set and clear Deleted At); an Account with live Contacts cannot be deleted (account_has_contacts). Audit rows carry ids and counts only (§12). (10) scripts/check-network-schema.py per §14 — the three enum mirrors identical to the schema's lists, every test id matching NW_ID_RE, no id-generating function taking a name or a date, every auditLog( details argument built from ids and counts only — plus a README tree entry for it; extend scripts/verify-network-roles.py with a save round-trip against the stub (the review card, a duplicate offering merge, the Drive move requests in order, the pending record gone, the list row present, delete → restore).
>
> Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-network-roles.py (zero page errors at phone width) and scripts/check-network-schema.py (exit 0). Page + GAS bumps with changelogs, CHANGELOG entry, flip §11's N1 row to Done with the versions, and write the N2 brief as §13.6 (or §13.7 if E0 has taken 13.6 by then) before closing — then hand off in chat: which of the 20 held cards to save first (a two-sided one, a Chinese-script one, then the pair of Avantus cards that share a title and must NOT merge), and what "done when" looks like in the Contacts list and the Drive tree. Do not touch Events, the list's filters or exports (N3), accounts beyond what save needs (N2), or any interval (Q). Session-1 lessons that still apply: GEMINI_API_KEY is set on the Network project and the drive.file consent has been given once; Android kills the browser tab when memory is low while the camera is open, so test on the gallery path first. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG stands at Sections: 85/100 with seven sections dated 2026-09-21 EST — no rotation is due on any later date either (85 < 100), so expect none. One push per session.
>
> Then, give me a prompt to paste into a new session (with recommended model/effort) to continue the action plan, then remember session."

### Added

#### `googleAppsScripts/Network/Network.gs` — v01.05g
- **The write path (N1 session 2, §4.2 steps 8–9).** `nop=dupcheck` — `nwFindDuplicate_` on normalised email → E.164 phone (`nwPhoneKey_`) → normalised name (`nwNameKey_`, romanised part only) + Account, scoped to the owner set, soft-deleted rows excluded, answered BEFORE any write with the matching contact in full; `nop=save` (body-POST, `Raw Extraction` from the body) — `nwContactFromPayload_` / `nwAccountFromPayload_` validate every enum against the flat lists and refuse a stage other than `none` unless the relationship is `target` · `customer` (`STAGE_NEEDS_TARGET_OR_CUSTOMER`, D5), `nwAccountResolve_` reuses an owned Account by id or by `Normalised Name` and otherwise mints an `a-` row, then the Contact row + one `scan` Interaction; `mergeInto=<c-id>` folds the card into the existing contact (survivor keeps its id; a `merge` Interaction carries the absorbed `c-` id as Evidence Link and the card pair that did not win the row in its Summary — both pairs kept; an `account-change` Interaction when the employer differs); `distinct=<c-id>` is the developer's considered "two people" after seeing the match — any other duplicate refuses with the row (`error: 'duplicate'`), never silently; `nop=links` writes the post-move Drive links back (to the row, or to the scan Interaction when the older pair kept the row); `nop=get` returns the full row + account + interactions (soft-deleted rows still answer, so Restore can show); `nop=delete` / `nop=restore` set and clear `Deleted At`, an Account with live Contacts refusing with `account_has_contacts` + count. All audit rows ids and counts only (§12)
- Sheet helpers `nwSheetRead_` / `nwRowObj_` / `nwFindRow_` / `nwOwned_` / `nwWriteRow_` (header-keyed rows), `nwContactPublic_` / `nwAccountPublic_` (the §3 JSON columns parsed), `nwEmailKey_` / `nwPhoneKey_` / `nwNameKey_` / `nwDomainOf_`; dispatcher cases for the six ops

#### `live-site-pages/Network.html` — v01.10w
- **Review card on the existing editor (step 6):** `nwReviewSection` appends role (`NW_ENUMS.role`), the account block (company from the extraction, the "In the Profiler record as …" / "Not in the Profiler record" chip, the link-to-record checkbox, relationship defaulting to `target`, stage `none` with `gateStage` disabling the select outside `target` · `customer`, segment ids), source event, met date (from the record's `createdAt`), consent (`unknown`), do-not-contact, notes; choices persist as `rec.review` on the held record (`nwReviewOf` supplies the defaults) and show in the strip detail. Low-confidence inputs carry `.nw-low` from the same `nwUnclearFields` reading as the note. **Retry** (`nwRetryExtraction` — `nop=extract` with the same `c-` id from `_nwHeldB64` when this tab scanned the card, else the two files read back from Drive with the user's token) and **Swap** (`nwSwapSides` — links and held base64 swapped, files renamed best-effort) join the pill row with **Save**; a **Save all** bar over the stack (`nwSaveAll`, in `createdAt` order, a card needing a merge decision is left open and the run goes on)
- **Company resolution (step 7):** `nwRegistry` fetches `profiler-data/profiler-companies.json` once per page (relative URL — never a GitHub API endpoint) into name/aka and domain indexes; `nwResolveCompany` matches the normalised name (`nwNormaliseCompany`, the client mirror of `nwNormaliseCompany_`) then the card's domain and its parents; `nwExistingAccount` reuses an owned Account from the list payload (its relationship / stage / slug win); `nwResolveCard` caches per company+domain key
- **Save (steps 8–9):** `nwSaveCard` → `nop=dupcheck` → the merge sheet (`nwMergeSheet`: one row per differing field, radios with the new card checked by default, unchanged fields listed once, **Merge into …** / **Keep as a separate contact** / Cancel; emails and phones unioned on merge) or `nop=save` → `nwFileCard` moves both files browser-side (`nwEnsureAccountFolder` creates `<Company>/` under `Network App/` on first save and parks it through `nop=setfolders` `accounts`; `nwDriveMove` = `files.update` with `addParents` / `removeParents`) → `nop=links` → the pending record deleted → `nwAfterWrite()`. A Drive failure after the rows are written is soft (the contact is saved, the status says the photos stayed in `_inbox/`)
- **List rows:** `nwContactRow` — name · title · company (accounts joined from the list payload into `_nwAccountsById`), tap → `nwRowDetail` fetches `nop=get` and shows every field, the account line with slug, photo links and the history; **Delete** → `nop=delete` marks the row struck through with **Restore** → `nop=restore`; rows sorted newest-updated first
- CSS for the review selects and date input, the covered chip, the low-confidence outline, the second pill row, the Save-all bar, the merge sheet and the list-row detail

#### `scripts/check-network-schema.py` (new)
- The §14 checker: the six §4 enums (relationship, stage, role, interaction kind, signal kind, consent — plus draft status and signal source) byte-identical across `NETWORK-SCHEMA.md`, the `Network.gs` flat lists and the `Network.html` `NW_ENUMS` map with the schema's labels; the D5 stage rule mirrored on both sides (`NW_STAGE_RELATIONSHIPS`, `gateStage`, the server's refusal); every id literal in `verify-network-roles.py` and in itself matching `NW_ID_RE`; `nwNewId_` / `nwRandomBase36_` taking no name / email / company / date and every `nwNewId_(` call passing a one-letter prefix literal; every `auditLog(` in the PROJECT region with a `details` argument built from ids and counts only — a lexical check with an allow-list of keys, a forbidden-identifier list, id/count shapes (`.id`, `.length`, `nwFieldCount_(…)`, `? 1 : 0`) stripped first, and a bare identifier traced to its assignments in the same function. Exit 1 on any finding; negative-tested against `name: c.fullName`, `raw` and a traced `details[...] = name`

### Changed

#### `scripts/verify-network-roles.py`
- The GAS stub keeps state (contacts, accounts, folders, the body-POST log) and answers `nop=dupcheck` (a match on email), `nop=save` (the D5 refusal, account reuse, merge), `nop=links`, `nop=get`, `nop=delete` / `nop=restore`; the Drive stub answers the `PATCH … addParents=` move and the `<Company>` folder creation. After the session-1 checks: registry resolution (`ABB Ltd` and `new.global.abb` → `abb`, `Advanced Micro Devices, Inc.` → `amd`, `Acme Energy` → none), the review block's defaults (role other, target, stage none and enabled, consent unknown, DNC off, met date today, the actions row last), the D5 gate on `partner`, the choices persisted and shown, Retry issuing a fresh extract, Save with the request order asserted (`dupcheck`, `save`, then folder → setfolders → move → links → list), the payload (role, source event, consent, met date, account name / relationship / stage, empty slug, `raw` carrying `confidence`), the pending store empty, the account folder parked, the list row name · title · company, tap → `nop=get` detail, delete → restore, the merge sheet on a same-email card (`network-save-merge.png`) with Merge sending `mergeInto=` and the second card's two sides moved, Keep-separate sending `distinct=`, Save all filing two seeded cards, and the held-card delete on a seeded record

#### `README.md`
- Tree: `check-network-schema.py` entry; `verify-network-roles.py` and `Network.html` descriptions extended for session 2; Network displays v01.10w · v01.05g

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11: the N1 row flipped to **Done — v06.90r** with the versions and the done-when as it stands (the 20-card round-trip runs on the phone after this push); §13.6 written — the paste-in brief and prompt for N2 (accounts and the corpus attachment)

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for this run; the prior entry moved to Previous Sessions under the two-session cap

### Notes
- Still 2026-09-21 EST — 86 sections, eight dated today and exempt, 78 non-exempt; no rotation. CHANGELOG `Sections: 78/100` → `86/100`. On any later EST date all 86 are non-exempt and still under the trigger
- Verified: `node --check` on the `.gs` copy, `check-gas-inner-scripts.js` (96 blocks clean), `check-readme-tree.py` (0 findings), `verify-network-roles.py` (all checks passed, 0 page errors at 390 × 844), `check-network-schema.py` (exit 0)

## [v06.89r] — 2026-09-21 04:38:22 AM EST

> **Prompt:** "I scanned 20 cards into Network. Give me a prompt to paste into a new session (recommend model/effort) to run N1 session 2, then remember session."

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **The paste-in prompt for N1 session 2** (Fable 5.1 High, with the rationale that session 1 over-delivered an editor, notes, delete, rescan, the batch toggle and the name rule, so the review card builds on that editor), verbatim, as a block under §13.5 after session 1's: the reading list against the code as it now stands, the IndexedDB `pending` record shape and the instruction never to drop it (the developer's 20 cards are in it), steps 6–10 restated with the session-1 UI decisions that stand, Save / Save all, `nop=get`, the verification train including `check-network-schema.py` and the verifier's save round-trip, the §11 flip and the N2 brief as §13.6 / §13.7, the hand-off to write, the session-1 lessons, and the CHANGELOG state (85 sections, no rotation due on any later date)

### Changed

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for the N1 session-1 run (seven pushes v06.82r–v06.88r, the first rotation, the live card run, the UX rules the developer set); recommendation: paste the N1 session-2 prompt. The prior entry moved to Previous Sessions under the two-session cap

### Notes
- Still 2026-09-21 EST — 85 sections, seven exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `85/100`. On any later EST date all 85 are non-exempt and still under the trigger

## [v06.88r] — 2026-09-21 04:12:37 AM EST

> **Prompt:** "A few more changes:

* change "one-sided" and "two-sided" from a side-by-side format to a stacked format with "one-" and "two-" on top of "sided"; Format the "Front", "Back", "One-sided", and "Two-sided" buttons to take up the the left half of the row with the "Scan" and "Choose Photos" buttons also being the same size taking up the right half of the row. 
* move the "Extract" and "Clear" buttons above the "One-sided", "Two-sided", and "Choose Photos" buttons."

### Changed

#### `live-site-pages/Network.html` — v01.09w
- Capture-card control rows are two-column grids (`1fr 1fr`, `align-items: stretch`): Front / Back and Scan on the first row, Extract / Clear on the second, One- / Two-sided and Choose photos on the third — each toggle fills the left half as a two-cell grid, each button the right half at the same size (selectors scoped under `#nw-capture` to outrank the base `.nw-seg` inline-flex rule)
- The sides toggle renders stacked: "One-" / "Two-" over a small "sided" (`aria-label` keeps the full word for screen readers)
- Extract / Clear now sit above the sides + Choose photos row

#### `scripts/verify-network-roles.py`
- Asserts the row order (scan, extract, sides), that the two halves of the top row measure the same width and height, and that the sides buttons are stacked

### Notes
- Still 2026-09-21 EST — 84 sections, six exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `84/100`

## [v06.87r] — 2026-09-21 04:03:50 AM EST

> **Prompt:** "If a scanned card shows fully capitalized names like MOHAMMED S. ALRAI, then change that to a standard first-letter-capitalized-rest-not standard. However, do not automatically change anything other than these two use cases (fully capitalized and fully uncapitalized)."

### Changed

#### `live-site-pages/Network.html` — v01.08w
- `nwCapName` now handles exactly two cases: a name whose letters are ALL upper-case or all lower-case (judged on the romanised part, parentheses excluded) becomes First-letter-capitalised, the rest lower-cased, with a capital after each space, hyphen, apostrophe or period ("MOHAMMED S. ALRAI" → "Mohammed S. Alrai", "austin york" → "Austin York", "MARY-ANNE LEE" → "Mary-Anne Lee"); any mixed-case name is returned untouched ("Kamran Moradi, PhD", "Ronald McDonald"); a parenthesised native script is never changed. Applied on receipt, on edit and once to held cards, as before

#### `scripts/verify-network-roles.py`
- Seven `nwCapName` cases asserted in the page context: both conversions, mixed-case pass-through, hyphen and apostrophe handling, and the native-script parenthesis

### Notes
- Still 2026-09-21 EST — 83 sections, five exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `83/100`

## [v06.86r] — 2026-09-21 03:59:29 AM EST

> **Prompt:** "For all contact entries, make sure the first letter of both first and last names are capitalized even if the card isn't. Also, dont show any reminders for missing information anymore because there is too much variance in business cards. However, if a scanned picture is unclear somewhere, pop up a notification for me to either rescan or manually input the missing information. Also, for mass uploading contacts, make sure to give me a toggle between one- or two-sided cards, similar to the one  between front and back of a photograph. Rename "photograph" with "scan" and move the button to the right of the "front/back" toggle. In its original spot, that's where I want the "one/two" sided toggle. Also, give me the option to delete saved contacts."

### Added

#### `live-site-pages/Network.html` — v01.07w
- **Name capitalisation** (`nwCapName` / `nwTidyNames`): the first letter of every word in `fullName`, `firstName`, `lastName` (and after a hyphen or apostrophe) is upper-cased on receipt from the extraction, on an edit, and once for held cards at mount; nothing else in the name is touched, so "McDonald", "PhD" and a native script in parentheses survive
- **"Unclear in the scan" notification** on a held card, one per field read below `NW_CONFIDENCE_FLOOR`: **Rescan** (confirm → `nwDeleteCard(rec, true)` removes the held record and its Drive photos, resets the pair to Front and opens the camera), **Enter manually** (the editor on that field) and **Looks right**; the filed status says which fields looked unclear instead of the plain green signal
- **One-sided / Two-sided toggle for batches** (`_nwBatchSides`, `nwSetBatchSides`) in the slot Photograph used to occupy: a two-sided batch pairs consecutive photos (front, back, …) into one card each, an odd last photo is a front alone; `NW_MAX_BATCH` now counts cards
- **Delete on every held card** (`nwDeleteCard`): confirm, remove the strip and the IndexedDB record, and best-effort `DELETE /drive/v3/files/<id>` for each photo with the user's own `drive.file` token (`nwDriveIdFromLink` parses the id from the stored link; `nwDriveFetch` accepts a 204)

### Changed

#### `live-site-pages/Network.html` — v01.07w
- Photograph renamed **📷 Scan** and moved beside the Front / Back toggle (`.nw-toprow`); the batch button is now "🖼 Choose photos" (the 15-card cap is in its tooltip and the status line)
- The "Missing: …" cue and `nwMissingFields` are removed — cards vary too much for an absent field to mean anything

#### `scripts/verify-network-roles.py`
- The stub returns a lower-case, punctuated name and the assertions check it is capitalised ("Jane O’Doe-Smith"), no Missing cue, the sides toggle and Scan beside the side toggle, the unclear note with its Rescan button, Enter manually opening the editor, and the delete round-trip (dialog accepted, strip and record gone, a Drive DELETE issued; the Drive stub answers 204)

### Notes
- Still 2026-09-21 EST — 82 sections, four exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `82/100`
- Delete and Rescan act on held cards (nothing is in the spreadsheet yet); session 2's `nop=delete` soft-deletes saved rows per NETWORK-SCHEMA.md §13

## [v06.85r] — 2026-09-21 03:36:02 AM EST

> **Prompt:** "Rename "front photo" and "back photo" to "front" and "back", respectively and resize the buttons as needed so that they are all on the same row. Also, hide "one side" and "two sides". The existence of the front and back pictures will tell me how many sides the card has."

### Changed

#### `live-site-pages/Network.html` — v01.06w
- Held-card pills relabelled **Front** / **Back**; `.nw-strip-photos` is now a no-wrap row with each pill `flex: 1 1 0`, so Front, Back and ✎ Edit share one row at phone width (the Edit pill takes the same rule with an ink colour instead of its own)
- The meta line drops "one side / two sides" — the pills say it; "from QR" and "edited" remain

#### `scripts/verify-network-roles.py`
- Strip assertion follows the relabel and checks the side count is gone

### Notes
- Still 2026-09-21 EST — 81 sections, three exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `81/100`

## [v06.84r] — 2026-09-21 03:30:03 AM EST

> **Prompt:** "Hide each contact's identifier and the low-confidence list either. Instead, give me a removeable note that asks me to check a low-confidence source and an option to edit the contacts after they are saved. That way, I can manually add the low-confidence information and remove the reminder. If one card didn't successfully extract a field (ie: website) that other cards did, I want to see that this contact is missing that information field, so I can try to make it up."

### Added

#### `live-site-pages/Network.html` — v01.05w
- **Removable "check" notes** on a held card: one per field the model read with confidence below `NW_CONFIDENCE_FLOOR` ("Check the website against the card — it was read with low confidence"), each with **Fix** (opens the editor on that field) and **Looks right** (dismisses it — `rec.dismissed[field]`, confidence set to 1, persisted to the IndexedDB `pending` record so it stays gone after a reload)
- **"Missing: …" line** (`nwMissingFields`): fields empty on this card that at least one other held card carries, with **Add** opening the editor on the first of them; repainted for every held card after any edit, since an added field changes what counts as usual for the stack
- **Inline editor** (`nwEditCard`, `NW_EDIT_FIELDS`): name, title, company, department, emails, phones, address, website, LinkedIn on every held card (✎ Edit, or from a note); emails and phones as comma-separated text keeping the kinds already read; an edited field becomes confidence 1 and its note clears; the record is written back to IndexedDB (`nwPendingSave`) and flagged `edited`. Nothing leaves the phone — the same form becomes session 2's review card ahead of `nop=save`

### Changed

#### `live-site-pages/Network.html` — v01.05w
- The strip no longer shows the `c-` id or the raw `check:` list (both stay in the record); the meta line reads sides · from QR · edited · held on this phone; `nwRenderStrip` replaces an existing strip in place, keeping its open state

#### `scripts/verify-network-roles.py`
- The stub now returns a low-confidence website; the drain scenario asserts no id and no `check:` on the strip, exactly one check note, Fix focusing the website input, and after a save no note, no editor, the "edited" flag, the new phone on the strip and the updated record in IndexedDB (`network-capture-edited.png`)

### Notes
- Prompted after the first live card showed `c-09zfk101vmaah · check: website` under the name. Still 2026-09-21 EST — 80 sections, two exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `80/100`
- Editing a held card is session 2's step 6 pulled forward at the developer's request; dedupe, company resolution and `nop=save` (steps 7–9) remain session 2's

## [v06.83r] — 2026-09-21 03:17:50 AM EST

> **Prompt:** "Ok, closing the other open apps resolved that issue. I want to be able to clearly see the progress so create a visible, easy to understand progress bat and status. When a card is successfully filled away, give a clear signal to continue scanning. Also, I want to be able to easily choose to view the original picture for all filed cards. Currently, I have no way to interact with the saved contacts."

### Added

#### `live-site-pages/Network.html` — v01.04w
- **A four-step progress bar** (Id → Upload → Read → Filed) under the capture buttons, driven by the pipeline: `nwProcessPair` now reports a step with every status (`onStatus(text, level, step)`), `nwCaptureStatus` forwards it to `nwProgressSet`, and the batch and the queue drain title the bar with "card *i* of *n*"; a failure turns the bar red at the step it stopped, Clear hides it
- **The "go on" signal** (`nwCaptureDone`): a green bold "✓ Filed — ready for the next card. Tap Photograph." line, a short vibration where the phone allows it, and a two-beat green pulse on the Photograph button; the batch summary and the drain end the same way
- **Photo links on every held card**: `nwRenderStrip` adds "🖼 Front photo" / "🖼 Back photo" pills opening the Drive links the upload returned (new tab, `noopener`), or a "photos not filed — retried on save" note when Drive was skipped
- **Tap a name for the fields read**: the strip head toggles a definition list of every extracted field (name, title, company, department, emails, phones, address, website, LinkedIn, other, languages, capture time), with fields below `NW_CONFIDENCE_FLOOR` in the low-confidence colour — view only; editing and saving are session 2's review card

### Changed

#### `scripts/verify-network-roles.py`
- Asserts the idle progress bar for admin, and after the drain the green Filed signal on both bar and status, one photo link and at least four detail rows on the strip; taps the strip and checks it opens (`network-capture-detail.png`)

### Notes
- Prompted by the first live card (v01.03w / v01.04g on the phone, one side, filed in Drive, `check: website`): the pipeline worked but showed its progress as one line of text
- **"No way to interact with the saved contacts" — nothing is saved yet.** A strip is a card held on the phone after extraction; the Contacts list stays at 0 until session 2's `nop=save`. This pass makes held cards viewable (photos, fields), not editable
- **First rotation on the new EST day**: 104 sections, none exempt (today's is the new one), 104 non-exempt ≥ 100 → the 2026-09-15 date group (26 sections, v05.79r–v06.04r) moved to `CHANGELOG-archive.md` with SHA enrichment on every header (26 of 26 resolved on the deep clone; v05.90r's push commit carries no version prefix and was matched by its 04:43 timestamp). 79 sections remain, 78 non-exempt. CHANGELOG `Sections: 78/100` → `79/100`

## [v06.82r] — 2026-09-20 09:55:33 PM EST

> **Prompt:** "Run N1 session 1 — capture and extraction — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.5 is the brief (follow its reading list in order, then steps 1–5 of Session 1 exactly; do not start session 2's steps 6–10 — the review card, dedupe, save and the schema checker are the next session's), §4.2 is the pipeline it implements, and repository-information/NETWORK-SCHEMA.md §1, §3, §6, §7, §12, §13 are the shapes you build against. D6 is Gemini only (the Receipts geminiExtractFromBase64_ idiom with the §7 responseSchema, GEMINI_API_KEY from this project's Script Properties, no second vendor), D8 opaque ids (nop=newid mints the c- id before upload so the filename is opaque from the first byte), D9 the privacy posture (audit rows carry the c- id and a field count only — never a card field), D14 no data poll (fetch on load, on visibilitychange, after writes; nwAfterWrite() is the refresh). Build in the PROJECT regions of Network.gs and Network.html only — never edit a TEMPLATE region. Verify with node --check on a .js copy of Network.gs (Node refuses the .gs extension), scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-network-roles.py (the capture card present for admin, absent for the other three tiers, at phone width, zero page errors) and served Playwright screenshots of the capture card with a queued count. Page + GAS bumps with changelogs, CHANGELOG entry, no §11 flip (N1 closes at session 2) — then write my hand-off in chat: the GEMINI_API_KEY Script Property to set, the drive.file consent the first upload will ask for, and what to photograph for the session-2 done-when (20 real cards, three Chinese-script, two two-sided). Do not touch Events, the list's filters or exports (N3), accounts beyond what capture needs (N2), or any interval (Q). Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG stands at Sections: 103/100 with seven sections dated 2026-09-20 EST exempt (96 non-exempt): if your push lands on 2026-09-21 EST or later, the exemption lifts and 103 non-exempt is over the 100 trigger, so the oldest date group (2026-09-15) rotates into the archive with SHA enrichment on every header — read the counter and CHANGELOG-archive.md §"Rotation Logic" before assuming otherwise. One push."

### Added

#### `googleAppsScripts/Network/Network.gs` — v01.04g
- **N1 session 1 — extraction (D6 Gemini only, NETWORK-SCHEMA.md §7).** `GEMINI_MODEL` / `GEMINI_FALLBACK_MODEL` pinned as in Receipts; `nwExtractionSchema_()` is the §7 `responseSchema` verbatim (`fullName … languages[], rawText, confidence{}` with the seven confidence keys required); `NW_EXTRACTION_PROMPT` carries the §7 rules (romanise CJK and keep the native script in parentheses, a second image is the back of the same card, never invent a field, honest per-field confidence); `nwExtractFromBase64_(frontB64, backB64, mime)` is `geminiExtractFromBase64_` with both images as `inline_data` parts in one call, the key from this project's `GEMINI_API_KEY` Script Property, the three-leg retry plan (primary, primary after 2 s, fallback after 1 s) and an error that is a code only (`gemini_http_<n>`, `gemini_parse_failed`, `gemini_key_missing`) so it can be audited
- `nwNormaliseExtraction_(raw, qr)` coerces the answer into the §7 shape (kinds validated against `NW_EMAIL_KINDS` / `NW_PHONE_KINDS`, confidence clamped 0–1, absent → 0) and merges QR-decoded fields over the model's with confidence 1; `nwFieldCount_()` is the only per-extraction number an audit row may carry
- `nop=newid` (D8: mints the `c-` id through `nwNewId_` before the upload so the Drive filename is opaque from the first byte; `c` prefix only) and `nop=extract` (`nwExtractOp_`: body-POST only, `contactId` validated against `NW_ID_RE`, both images ≤ 7,000,000 chars, MD5-digest cache of the pair for 600 s, audit rows `network_extract` / `network_extract_failed` carrying `{ contactId, fields, sides }` / `{ contactId, error }` — never a card field, §12) on `handleNetworkOp_`

#### `live-site-pages/Network.html` — v01.03w
- **The capture card** (`nwCaptureMount`, admin only — the inputs never enter the DOM for a turned-away tier): the Receipts inputs (`capture="environment"` single, `multiple` batch of `NW_MAX_BATCH` = 15) behind two buttons, a Front / Back segmented toggle that stages a pair (`_nwPair`) with thumbnails and flips to Back after the front is captured, Extract / Clear, a status line and the queued count with a "send now" link; `nwCompressImage` unchanged at 2,000 px / 0.82
- **IndexedDB offline queue** (`nw-capture` db, stores `queue` + `pending`, no Worker): when `navigator.onLine` is false the compressed pair is queued and the count shows on the card; `nwQueueDrain()` runs on `online` (and once on mount) through the same `nwProcessPair` pipeline, oldest first, deleting each record only after success and stopping at the first failure; `pending` holds extracted-but-unsaved cards across a reload for session 2's review card
- **Own-Drive upload** with the user's `drive.file` token from a separate token client (`NW_DRIVE_SCOPE`; the sign-in scope is untouched, so the first upload asks the consent once): `nwEnsureFolders` creates `Network App/` and `_inbox/` browser-side on first use and parks the ids through `nop=setfolders` (read back from the list payload on load, `nop=folders` on demand), `nwUploadPair` files `<c-id>-front.jpg` / `-back.jpg` by multipart upload; a Drive failure is soft — the extraction still runs and the pending record remembers `driveError`
- **QR decode** with `BarcodeDetector` where present (`nwQrDecode` → `nwParseQr`: vCard FN/N/ORG/TITLE/EMAIL/TEL/ADR/URL, or a bare URL), merged before the model call; a vCard naming the person with an email or phone (`nwQrSufficient`) fills the card without a model round-trip (`nwQrExtraction`, confidence 1 on carried fields, 0 elsewhere)
- `nwApiBody()` — the `_gasPostBody` idiom (form-urlencoded body, three attempts, no GET fallback) for `nop=extract`; `nwProcessPair` orders newid → upload → QR-or-extract → pending → strip, spacing model calls ≥ 6.5 s in a batch or drain; `nwRenderStrip` shows the name / title · company / id · sides · Drive filed / "check:" fields below `NW_CONFIDENCE_FLOOR`
- `nwLoadList` keeps the capture card and re-renders only `#nw-listwrap`, and reads `folders` from the list payload into `_nwFolders`; `nwEnsureFolders` calls `nwAfterWrite()` after `setfolders` (D14)

### Changed

#### `scripts/verify-network-roles.py`
- Asserts the capture card (card, both inputs, the toggle, a queued count of 0) for admin and its absence for contributor / analyst / viewer; a new scenario takes the context offline, stages a canvas-generated card photo, taps Extract and checks the queue reads 1 with no request issued (`network-capture-queued.png`), then reconnects and checks the drain mints the id before the Drive upload, the strip renders and the count returns to 0 (`network-capture-extracted.png`); the GAS stub answers `nop=newid` / `folders` / `setfolders` and a body-POST `nop=extract`, and a Drive stub answers folder creation and the multipart upload

### Notes
- Still 2026-09-20 EST at the push (09:55 PM) — 104 sections, eight exempt, 96 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `104/100`. The first push dated 2026-09-21 EST or later rotates the 2026-09-15 date group (unshallow first)
- §11's N1 row is unchanged (Proposed) — it flips at the close of session 2, which also writes the N2 brief as §13.6

## [v06.81r] — 2026-09-20 09:14:47 PM EST

> **Prompt:** "give me a prompt to paste into the next session (with recommended AI model/effort level) in the action plan, then remember session."

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **The paste-in prompt for N1 session 1** (Fable 5.1 High, with the model/effort rationale and the note that E0 can run beside it), verbatim, as a block under §13.5: steps 1–5 of the brief only, the D6/D8/D9/D14 constraints restated, the verification train, the hand-off to write in chat, and the rotation state the push will meet

### Changed

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for the Q0 session (v06.79r rollout, v06.80r probe table, this push); recommendation: paste the N1 session-1 prompt. The prior entry moved to Previous Sessions under the two-session cap

#### `README.md`
- `Last updated` and `Repo version` refreshed

### Notes

- Still 2026-09-20 EST — 103 sections, seven exempt, 96 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `103/100`.

## [v06.80r] — 2026-09-20 09:11:43 PM EST

> **Prompt:** *(same Q0 prompt as v06.79r — the post-merge step: "after the merge, run `bash scripts/check-quota.sh` and paste its table into the CHANGELOG entry's Notes")*

### Changed

#### `repository-information/CHANGELOG.md`
- The v06.79r section's Notes now carry the first `check-quota.sh` table: six deployed projects answered on their new GAS versions, three placeholder-id projects skipped, 27 executions today (Network 26, Profiler 1) against 20,000/day

#### `README.md`
- `Last updated` and `Repo version` refreshed

### Notes

- Q0 is complete end to end: op rolled out, script verified live, §11 row Done. Still 2026-09-20 EST — 102 sections, six exempt, 96 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `102/100`.

## [v06.79r] — 2026-09-20 09:06:03 PM EST

> **Prompt:** "Run Q0 — the quota-counter rollout — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §3 row D14 and the §8 Q0 row are the whole spec. Read first `nwQuotaProbe_()` and the two `op=quota` dispatch lines beside `op=aclhealth` in `googleAppsScripts/Network/Network.gs` `doGet` (the source of truth — copy it, do not redesign it), the `op=aclhealth` dispatch in `Receipts.gs` `doGet` as the precedent for where a PROJECT-marked unauthenticated probe sits inside the AUTH `doGet`, `scripts/check-acl-health.sh` (the probe-script shape to follow, including how it discovers projects from the `.gs` files and skips `YOUR_DEPLOYMENT_ID` projects), and `.claude/rules/gas-scripts.md` §"Template vs Project Code Separation". Then, in **one commit**: (1) copy the function into the eight existing projects — Classroom, Globalacl, MasterACL, Profiler, Receipts, Scraper, Testauthgas1, Testauthhtml1 (`Claspdeploytest` has no config and is not a project) — as `quotaProbe_()` with the same body and comment, and rename Network's `nwQuotaProbe_` to `quotaProbe_` so all nine read identically for Q's grep; it depends only on template globals (`SPREADSHEET_ID`, `AUTH_CONFIG`, `ACL_PAGE_NAME`, `VERSION`, `getEpochCache`) that every auth project has, and every one of the eight already runs with `ENABLE_AUDIT_LOG` on (the two `standard`-preset projects, Classroom and Profiler, override it on), so no preset changes; (2) add the `if (action === 'api' && op === 'quota')` dispatch beside `op=deploy` in each `doGet`, marked `// PROJECT:` exactly as Network's is; (3) write `scripts/check-quota.sh` on the `check-acl-health.sh` shape — one row per deployed project (`page`, `gasVersion`, `date`, `executions`, the top three `byEvent` keys), a total across the fleet against the 20,000/day account quota, `audit_log_disabled` / `spreadsheet_not_configured` surfaced as warnings not failures, exit 0 healthy / 1 any probe unreachable / 2 nothing probed; (4) nine GAS bumps with nine GAS changelog entries (user-facing: "a daily execution counter the operator can read"), no page bumps (no HTML changes), README tree entry for the script, CHANGELOG entry, flip §11's Q0 row to Done with the version. Verify with `node --check` on every `.gs` copy and `scripts/check-gas-inner-scripts.js`; after the merge, run `bash scripts/check-quota.sh` and paste its table into the CHANGELOG entry's Notes (the three placeholder-id projects — Globalacl, Testauthgas1, Testauthhtml1 — never deploy, so their copies are repo-only bookkeeping and the script skips them; the deployed six plus Network answer). Do not touch `Events` (E1 inherits the op from the shared template region when it is scaffolded), do not change any interval (that is Q), do not add auth to the probe (counts only, never a user or a details cell — the trust model is `aclhealth`'s). Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first. The repo CHANGELOG stands at `Sections: 78/100` with four sections dated 2026-09-20 EST exempt: **if your push lands on 2026-09-21 EST or later, 100 non-exempt reaches the 100 trigger and the oldest date group rotates** into the archive with SHA enrichment on every header — read the counter and `CHANGELOG-archive.md` §"Rotation Logic" before assuming otherwise."

### Added

#### `scripts/check-quota.sh`
- **Fleet execution-quota probe** on the `check-acl-health.sh` shape: discovers every project whose `doGet` dispatches `op=quota`, skips the placeholder-id projects, prints one row per deployed project (page, GAS version, date, executions, top three `byEvent` keys) and a fleet total against the 20,000/day account quota. `audit_log_disabled` / `spreadsheet_not_configured` are warnings; an empty or non-JSON body (or `audit_log_unreadable`) is a failure. Exit 0 healthy / 1 any probe unreachable / 2 nothing probed. README tree entry added

#### `googleAppsScripts/*` — Classroom, Globalacl, MasterACL, Profiler, Receipts, Scraper, Testauthgas1, Testauthhtml1
- **`quotaProbe_()` + the `op=quota` dispatch** copied verbatim from `Network.gs` into all eight (same body, same comment; the dispatch sits beside `op=deploy` — after `op=aclhealth` in Profiler and Receipts — marked `// PROJECT:` exactly as Network's). The function lives in each file's first PROJECT region (after `aclHealthProbe_` where one exists). It depends only on template globals every auth project has; no preset changes (all eight already run `ENABLE_AUDIT_LOG` on). GAS bumps: Classroom v01.86g, Globalacl v01.09g, MasterACL v01.15g, Profiler v01.40g, Receipts v01.30g, Scraper v02.21g, Testauthgas1 v01.08g, Testauthhtml1 v01.08g — one page/GAS changelog entry each

### Changed

#### `googleAppsScripts/Network/Network.gs`
- `nwQuotaProbe_` renamed to `quotaProbe_` so all nine copies read identically for Q's grep (v01.03g)

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11 Q0 row flipped to **Done — v06.79r**

#### `README.md`
- `check-quota.sh` tree entry; nine GAS version displays; `Last updated` and `Repo version` refreshed

### Notes

- **No page bumps** — no HTML changed. Events is untouched (E1 inherits the op from the shared template region); no interval changed (that is Q); the probe carries no auth (counts only, never a user or a details cell — aclhealth's trust model).
- **Verified** with `node --check` on all nine `.gs` copies (copied to `.js` in the scratchpad, since Node refuses the `.gs` extension), `scripts/check-gas-inner-scripts.js` (10 files, 96 inner blocks clean) and `scripts/check-readme-tree.py` (0 findings).
- **The three placeholder-id projects** — Globalacl, Testauthgas1, Testauthhtml1 — never deploy, so their copies are repo-only bookkeeping and the script skips them; the deployed six plus Network answer. The first `bash scripts/check-quota.sh` table lands in the follow-up push once this merge has deployed the nine scripts.
- **First `bash scripts/check-quota.sh` run, after the merge deployed the nine scripts** (2026-09-20 09:10:55 PM EDT, exit 0) — every deployed project answers on its new GAS version, which is the deploy confirmation:

  ```
          page          gas      date       executions  top events
    OK    Classroom     v01.86g  2026-09-20          0  -
    SKIP  globalacl     not deployed (no deployment id)
    OK    MasterACL     v01.15g  2026-09-20          0  -
    OK    Network       v01.03g  2026-09-20         26  security_alert 12, data_read 8, login_success 3
    OK    Profiler      v01.40g  2026-09-20          1  security_alert 1
    OK    Receipts      v01.30g  2026-09-20          0  -
    OK    Scraper       v02.21g  2026-09-20          0  -
    SKIP  testauthgas1  not deployed (no deployment id)
    SKIP  testauthhtml1 not deployed (no deployment id)

  TOTAL — 27 execution(s) today across 6 probed project(s) = 0% of the 20000/day account quota.
  ```
- **No rotation fired.** The push lands on 2026-09-20 EST: 101 sections total, five dated today exempt, 96 non-exempt → below the 100 trigger. The first push dated 2026-09-21 EST or later rotates the oldest date group (2026-09-15). CHANGELOG `Sections: 78/100` → `101/100`.

## [v06.78r] — 2026-09-20 08:53:15 PM EST

> **Prompt:** "ive signed into Network.html once more - see screenshot. Give me a prompt to paste into a new Fable 5.1 Medium session to start Q0, then remember session." — and, mid-turn: "Upon checking the overall Network and Events plan, I noticed Q0 is supposed to be the last phase of the plan. Evaluate the plan again and give me a prompt to paste that is confirmed to be the next step."

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **The paste-in prompt for the Q0 session** (Fable 5.1 Medium), verbatim, as a block under §13.3 beside the N0 prompt: copy `nwQuotaProbe_()` + the `op=quota` dispatch into the eight existing projects as `quotaProbe_()` (Network renamed to match — nine GAS bumps), `scripts/check-quota.sh` on the `check-acl-health.sh` shape, the placeholder-id projects skipped by the script, the CHANGELOG rotation the push will trigger on 2026-09-21 EST or later, and the do-nots (no Events, no interval change, no auth on the probe)

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11 N0 row: the live done-when closed 2026-09-20 — deployed `AKfycbxu…c0_U8`, admin signed in, `op=deploy` → `Already up to date (v01.02g)`, `op=aclhealth` → `acl_ok`, `op=quota` answering, `check-acl-health.sh` lists Network; the bootstrap lesson for E1 recorded (Manage deployments → Edit → New version once, by hand)

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for the N0 session (v06.76r scaffold, v06.77r deployment id, the live verification, this push); recommendation: paste the Q0 prompt. The prior entry moved to Previous Sessions under the two-session cap

#### `README.md`
- `Last updated` and `Repo version` refreshed

### Notes
- **Order confirmed against the plan (the developer asked whether Q0 is the last phase):** it is not — there are two quota phases. **Q0** (the counter rollout) follows N0 in D16's decided sequence (§3 line "Gate → N0 → **Q0** → N1 …"), in §8's Q0 row, in §9 and in §11 ("after N0"); **Q** (the quota *review*) is the final phase, "after E5" in §8 and §11. No reordering was made; the Q0 prompt is the confirmed next step
- **Live probe results this session (no push):** `op=quota` reported 23 executions on 2026-09-20 including 12 `security_alert` rows — most plausibly `data_access_expired_session` retries during the redeploy window; the developer may confirm in the `SessionAuditLog` Details column. `grace: NOT armed` on Network arms on the next sign-in against v01.02g (the developer has since signed in once more)
- **§13 numbering collision for the next brief-writer:** the N1 brief reserves §13.6 for N2 and the E0 brief reserves §13.6 for E1 — first writer takes 13.6, the other 13.7
- **No rotation — but at capacity.** 100 sections, four dated 2026-09-20 EST exempt → 96 non-exempt against the 100 trigger; counter `Sections: 78/100`. The first push dated 2026-09-21 EST or later finds 100 non-exempt and rotates the oldest date group

## [v06.77r] — 2026-09-20 08:38:53 PM EST

> **Prompt:** "set Network DEPLOYMENT_ID to AKfycbxuayBnl0pM0upSFEoqUkaW4bbXbVCKGKeGVdcgKiBM5FBj_ykQn30BINHyJMvc0_U8"

### Changed

#### `googleAppsScripts/Network/Network.config.json`
- `DEPLOYMENT_ID` set to the developer's first Web-app deployment (`AKfycbxu…c0_U8`) — the workflow's `Deploy Network` step now fires the self-update webhook on every `Network.gs` merge

#### `googleAppsScripts/Network/Network.gs` — v01.02g
- `DEPLOYMENT_ID` synced from the config per [PC-GAS-CONFIG] #14

#### `live-site-pages/Network.html` — v01.02w
- `var _e` set to the base64 of the reversed `/exec` URL (decoded and round-trip-checked), so the page now creates its GAS iframe and the fetch transport has a base URL; sign-in reaches the live backend

#### `README.md`
- Network version displays v01.02w · v01.02g; `Last updated` and `Repo version` refreshed

### Notes
- **Deploy hand-off status**: Part A (project, manifest, GCP link, `GITHUB_TOKEN`, grant — `diagnoseAuthorization` reported all seven declared scopes granted, nothing outstanding) and Part B (deployment + this sync) are done. **Next for the developer — Part C**: once this merges, load `Network.html` once so `registerSelfProject()` creates the `Network` column in the Master ACL Access tab, tick TRUE on your row (role `admin`), run `clearAllAccessCache` from the editor, then sign in; the first admin list call creates the eight tabs. Then Part D: `?action=api&op=deploy` → `Already up to date (v01.02g)`, `op=aclhealth` → `acl_ok`, `op=quota`, `bash scripts/check-acl-health.sh`
- **The webhook's first real run is this merge**: `Network.gs` changed, so the `Deploy Network` step calls `doPost(action=deploy)` against the new id and the live script pulls v01.02g from `main` — the GET probe above confirms it
- **No rotation.** 99 sections, four dated today (exempt) → 95 non-exempt against the 100 trigger

## [v06.76r] — 2026-09-20 12:56:34 AM EST

> **Prompt:** "Run N0 — the Network scaffold — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md. Read the plan's §3 (every decision row is decided — D7 admin-only, D14 no data poll, D1 the Profiler "Ecosystem" relabel), §8 (the N0 and Q0 rows) and §13.3 (the N0 brief — follow its eight steps exactly, in order), then repository-information/NETWORK-SCHEMA.md in full, and the reading list §13.3 opens with. Do not build capture, extraction or the list (that is N1); do not scaffold Events (E1); do not touch Scraper. Before running scripts/setup-gas-project.sh, ask me for the values only I hold — SPREADSHEET_ID, CLIENT_ID, and whether the Global ACL default for MASTER_ACL_SPREADSHEET_ID is right — then run it once; every other key in the JSON is fixed by §13.3 step 1. Build the PWA files with the manifest-src 'self' override on both CSP tags, the admin-only door on both sides and scripts/verify-network-roles.py, ensureNetworkTabs_() with exactly the NETWORK-SCHEMA.md §3 columns and the §4 enum mirrors, NW_ID_RE / nwNewId_, the folder ops, the D14 intervals (600 s heartbeat, no data poll — both .gs and .html per [PC-SESSION-SYNC] #20) and the op=quota API, and the Profiler "Ecosystem" relabel with its Profiler page bump, page changelog and a clean scripts/verify-profiler-roles.py run. Verify with node --check on the .gs copy, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, and served Playwright screenshots (scripts/playwright-harness.py) of admin's empty list and the three turned-away cards at phone width with zero page errors. End by writing my deploy hand-off steps in chat (§13.3 step 7), flipping §11's N0 row to Done with the version, and writing the N1 brief as §13.5 of the plan — then one push. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG rotated at v06.75r — read its Sections: counter before assuming anything about rotation."

### Added

#### `live-site-pages/Network.html` — v01.01w
- **N0 scaffold of the Network app** (design plan §13.3, all eight steps). Generated by `scripts/setup-gas-project.sh` from the auth template (`hipaa` preset, `ACL_PAGE_NAME: Network`, `PORTAL_ICON: 📇`, the developer's `SPREADSHEET_ID` `1YjY3…ptBiQ`, the fleet `CLIENT_ID`, the fleet Master ACL `1kG2K…UvE` passed explicitly because the Global ACL config the script would default from still carries its placeholder); ten files created, GAS Projects table row, README tree entries, REPO-ARCHITECTURE nodes and the `Deploy Network` workflow step registered by the script
- **PWA**: `network.webmanifest` on the `receipts.webmanifest` shape (`id` / `start_url` / `scope` = `./Network.html`, `display: standalone`), `images/network-icon-192.png` + `-512.png` (Pillow-drawn card glyph on the app's navy, `any maskable` on the 512), `<link rel="manifest">`, `theme-color`, `apple-touch-icon` and the standalone metas; the **`manifest-src 'self'` PROJECT OVERRIDE on both CSP tags** (template ships `'none'`); `worker-src 'none'` stays — no service worker (D2)
- **The door, client half (D7 — admin-only)**: `NW_ROLE_CAPS` with all four tier keys (admin holds `contacts` · `accounts` · `profiler` · `signals` · `drafts` · `export` · `purge`, the other three empty), `nwRole()` / `nwPreviewRole()` / `nwEffectiveRole()` / `nwCan()` / `nwAdmitted()` with only-subtracting `?as=` preview semantics; `nwRenderDenied()` paints the turned-away card for non-admin tiers **before any request is issued** (`nwLoadList` is never reached); the grouped `NW_ENUMS` map with display labels mirroring NETWORK-SCHEMA.md §4
- **Surface**: masthead (`#nw-header`, the Classroom/Profiler editorial family, 62 px top margin to clear the template's fixed user pill on a phone), `#nw-backdrop` above the template's GAS iframe, `nwApi()` over `_gasPost` (`action=network` with the `op=network` GET mirror), `nwLoadList()` rendering contact/account counts and the empty list, `nwAfterWrite()` and a `visibilitychange` refetch (D14 — no data poll), the `showApp` wrapper mounting `nwAppMount()`
- **D14 intervals** in `HTML_CONFIG`: `HEARTBEAT_INTERVAL: 600000`, `DATA_POLL_INTERVAL: 0` with a PROJECT OVERRIDE note (the template declares the poll interval but never arms a timer from it; nothing may) — paired with the `.gs` per [PC-SESSION-SYNC] #20

#### `googleAppsScripts/Network/Network.gs` — v01.01g
- **The door, server half**: `NW_ROLE_CAPS`, `nwRoleOf_` / `nwAdmitted_` (`role === 'admin'`) / `nwCan_` / `nwRequire_` on the Classroom pattern — every turned-away tier writes a `security_alert` audit row carrying op name and tier only
- **Enums (D5)**: the flat lists `NW_RELATIONSHIPS`, `NW_STAGES`, `NW_ROLES`, `NW_INTERACTION_KINDS`, `NW_SIGNAL_KINDS` (+ consent, draft status, signal source, and `NW_STAGE_RELATIONSHIPS` for the D5 validator rule), byte-identical to NETWORK-SCHEMA.md §4
- **Ids (D8)**: `NW_ID_RE` (`^[acisdm]-[0-9a-z]{13}$`), `nwRandomBase36_()` (SHA-256 over `Utilities.getUuid()`, first 8 bytes → 13 base36 digits by 64-bit long division), `nwNewId_(prefix, takenIds)` collision-checked against the tab — never a name, never a date
- **Tabs**: `ensureNetworkTabs_()` creating `Accounts` · `Contacts` · `Interactions` · `Signals` · `Mailings` · `Drafts` · `Shares` · `Profiles` with exactly the §3 columns in order (`NW_TABS`), frozen row 1, in-place header upgrade; `nwNormaliseCompany_()` (the §3 dedupe key)
- **Folder registry**: `PROP_NW_FOLDERS` with `nwFoldersGet_` / `nwFoldersSet_` (`root`, `inbox`, `accounts{}` map, id-shape checked) — the Profiler `recfolders` precedent, exposed as `nop=folders` / `nop=setfolders`
- **Ownership**: `getShareScope_`, `resolveOwnerScope_`, `resolveOwnerSet_` and the not-found-not-forbidden convention copied verbatim from `Receipts.gs` (the D7 widening path; `Shares` has no UI in v1)
- **Ops**: `handleNetworkOp_()` (`action=network`, `nop=list|folders|setfolders`) wired into `doPost` and the `doGet` `action=api` fallback; `nop=list` returns the minimum-necessary subset via `nwListRows_()` with soft-deleted rows filtered and an audit row of counts only
- **`?action=api&op=quota` (D14)**: `nwQuotaProbe_()` — today's `SessionAuditLog` rows (EST) grouped by event, `{ success, date, tz, executions, byEvent }`, counts only, 60 s cache, bounded 5,000-row read; **this is the op Q0 copies into the other eight projects**. `op=aclhealth` ported beside it so `scripts/check-acl-health.sh` enrols the project automatically
- **D14 intervals**: `PROJECT_OVERRIDES.HEARTBEAT_INTERVAL: 600` (paired with the `.html`)

#### `scripts/verify-network-roles.py`
- The four-tier door check on the `verify-profiler-roles.py` shape: serves `live-site-pages/`, seeds the page-scoped session the way `saveSession()` writes it, gives the page a stub base URL and answers the fetch transport's load-time heartbeat, then asserts per tier — admin: the empty list and exactly one `nop=list` request; contributor / analyst / viewer: the turned-away card and **zero** data requests; `?as=viewer` on admin turns away, `?as=admin` on viewer gains nothing; zero page errors. Phone-width (390 × 844) screenshots per tier. **Passes.**

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **§13.5 — the N1 brief** (capture → extraction → review → save, two Fable 5.1 High sessions), written at the close of N0 per the Classroom rule

### Changed

#### `live-site-pages/Profiler.html` — v01.91w
- **D1 relabel**: the `#network` explorer heading `'Ecosystem Network'` → `'Ecosystem'` and the denied-view sentence to match; the `network` capability key, the `#network` hash and the masthead button are untouched. `scripts/verify-profiler-roles.py`'s deep-link label `'ecosystem network'` → `'ecosystem'`; the 13 × 4 matrix is unchanged and every tier's deep-link assertion passes

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11: **N0 → Done — v06.76r** (what landed; the live-page checks — sign-in, `DEPLOYMENT_ID`, the webhook GET probe — wait on the developer's deploy); Q0's row now names `nwQuotaProbe_()` as the source to copy

#### `repository-information/REPO-ARCHITECTURE.md`
- Flowchart: `NETWORK_PAGE` and `GAS_NETWORK` nodes and their five edges (added by the setup script); the Flowchart's mermaid.live URL regenerated and decompression-verified (9,178 chars). The file carries no `<details>` copy blocks, so none was mirrored

#### `README.md`
- Tree: `network.webmanifest`, `scripts/verify-network-roles.py`, the Network page entry's description; version displays Profiler v01.91w, Network v01.01w · v01.01g (`check-readme-tree.py`: 0 findings); `Last updated` and `Repo version` refreshed

### Notes
- **Setup script input** (§13.3 step 1): the developer supplied `SPREADSHEET_ID` = `1YjY3XMXDGwhW4U-lf3aKxGTJz5JvMyQcdCyVWdptBiQ`, chose the fleet `CLIENT_ID`, and confirmed the fleet Master ACL id after the session found that `globalacl.config.json`'s own `MASTER_ACL_SPREADSHEET_ID` is still `YOUR_MASTER_ACL_SPREADSHEET_ID` — the script's Global ACL auto-default therefore resolves to nothing and the id had to be passed explicitly. Both generated files carry the real id (Setup GAS Project Command step 3 verified)
- **Deploy hand-off** (§13.3 step 7), for the developer: (1) create the Apps Script project and paste `Network.gs`; (2) Project Settings → show `appsscript.json` and set it from `.claude/rules/gas-scripts-reference.md` §"Setup Steps" (includes `script.scriptapp`); (3) link the GCP project and enable the Apps Script API and the Google Drive API on it; (4) Deploy → New deployment → Web app → execute as me, access Anyone; (5) paste the deployment id into `googleAppsScripts/Network/Network.config.json` `DEPLOYMENT_ID` and sync per [PC-GAS-CONFIG] #14 (the `.gs` `DEPLOYMENT_ID` and the page's `var _e` = base64 of the reversed `/exec` URL); (6) set `GITHUB_TOKEN` in Script Properties; (7) run any function from the editor, open the consent screen as the script account and **tick every checkbox** (a partial grant reproduces the Receipts v02.59r outage); (8) load `Network.html` once so `registerSelfProject()` creates the `Network` column in the Master ACL's Access tab, tick TRUE for your row, then run `clearAllAccessCache` from the editor; (9) verify: sign in on the live page, `curl -sL "https://script.google.com/macros/s/<ID>/exec?action=api&op=deploy" --max-time 90` answers `Already up to date (v01.01g)`, `?action=api&op=quota` answers today's counts, `?action=api&op=aclhealth` answers `acl_ok`, and `bash scripts/check-acl-health.sh` now lists Network
- **Verification this push**: `node --check` on the `.gs` copy clean; `scripts/check-gas-inner-scripts.js` — 10 files, all inner scripts parse; both inline `<script>` blocks of `Network.html` parse; `scripts/check-readme-tree.py` 0 findings; `scripts/playwright-harness.py Network Profiler` 2/2 pass (file://); `scripts/verify-network-roles.py` all checks pass with zero page errors (served over localhost at 390 × 844); `scripts/verify-profiler-roles.py` — matrix unchanged, deep-link denials pass; its two **guidance-progress isolation** failures (`admin tick did not persist`) reproduce identically on an untouched `origin/main` worktree, so they are pre-existing (the guidance hub moved to Classroom in C3 and `gdSetProgress` no longer persists on Profiler) and outside N0
- **Pre-existing template oddity noticed, not touched** (Chesterton's fence): `doPost`'s `action=getData` route calls `processDataPoll()`, which no project defines — the route is dead in every project and no page calls it; N0 sets `DATA_POLL_INTERVAL: 0` and arms nothing
- **No rotation.** 98 sections, three dated today (exempt) → 95 non-exempt against the 100 trigger. Profiler's page changelog reached `Sections: 50/50` with today's section exempt (49 non-exempt against a 50 trigger) — no rotation there either

## [v06.75r] — 2026-09-20 12:26:53 AM EST

> **Prompt:** "give me a prompt to paste into a Fable 5.1 High session to run N0, then remember session."

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **The paste-in prompt for the N0 session** (Fable 5.1 High), verbatim, as a block under the §13.3 brief — the §13.2 precedent: it points the session at §3, §8, §13.3 and `NETWORK-SCHEMA.md`, names the three values only the developer holds (`SPREADSHEET_ID`, `CLIENT_ID`, the Master ACL default) to ask for before the setup script runs, forbids N1/E1/Scraper work, lists the verification set (`node --check`, `check-gas-inner-scripts.js`, `check-readme-tree.py`, served Playwright screenshots of the four tier states), and ends with the deploy hand-off, the §11 flip and the N1 brief as §13.5

### Changed

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for the two-push gate session (v06.74r the gate, v06.75r this push): decisions, the D15 → N4 consequence, the schemas, the rotation, the values N0 will ask for; recommendation: paste the §13.3 N0 prompt. The prior entry moved to Previous Sessions under the two-session cap

#### `README.md`
- `Last updated` and `Repo version` refreshed

### Notes

- **Archive rotation fired.** This push lands on **2026-09-20 EST**, so the eighteen sections dated 2026-09-19 stopped being exempt: 116 non-exempt against the 100 trigger → the **2026-09-14 date group (v05.59r–v05.78r, 20 sections)** moved to `CHANGELOG-archive.md` with a commit SHA appended to every header (20 of 20 resolved on the unshallowed clone; post-rotation grep clean) → 96 non-exempt, below the trigger. Counter `Sections: 78/100`.
- **No page, GAS script, diagram or rule changed.**

## [v06.74r] — 2026-09-19 11:55:37 PM EST

> **Prompt:** "Start the NE0 design gate for Network + Events. Read `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md` in full, then follow §13 (the brief) and §13.1 (the step-by-step) exactly. Six rows are settled and are not re-opened: D1 (Profiler's explorer becomes "Ecosystem" in N0), D3 (people private in Drive, the event registry public on Pages), D10 (hybrid corpus + Opus 5 xhigh research sources), D11 (the full §5.5.1 signal-source catalogue, quoted-people extraction included), D13 (`event:` prefix deferred, `contact:` never), D15 (in-app editable drafts exported or copied to any mail client — the apps never send). Walk the remaining eleven with me one row at a time in §13.1's order — D4, D5, D7, D8, D9, D6, D2, D14, D17, D12, D16 — recommendation first in two sentences, one alternative only where a real trade-off exists, then stop and wait for my answer before the next row; my silence on a row means "as recommended". Then settle the §12 questions each decision touches (I will tell you whether a Google Cloud project with billing exists and whether Gemini or Claude may process card PII), write `NETWORK-SCHEMA.md` and `EVENTS-SCHEMA.md` with exactly the contents §13.1 steps 4–5 list (skeleton + Edits, never a single large Write), write the N0 and E0 paste-in briefs as §13.3 and §13.4 of the plan, flip §11's NE0 row to Done with the version, and push once. Do not scaffold either app in this session. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`. The repo CHANGELOG stands at 98 non-exempt sections against a 100 trigger: if your push lands on 2026-09-20 EST or later (`TZ=America/New_York date`), it rotates the 2026-09-14 date group (20 sections) into the archive with SHA enrichment on every header — run `git fetch --unshallow origin main` first."

### Added

#### `repository-information/NETWORK-SCHEMA.md`
- **New — the Network app's single source of truth**, written at the gate as skeleton + sectional appends: the public/private line stated once; opaque id rules (`a-` `c-` `i-` `s-` `d-` `m-` + 13 base36 characters, `NW_ID_RE`); the admin-only access model with `NW_ROLE_CAPS` keeping all four tier keys; the `Accounts` / `Contacts` / `Interactions` / `Signals` / `Mailings` / `Drafts` / `Shares` / `Profiles` tabs with every column typed; the D5 enums with display labels (flat server lists + the grouped `NW_ENUMS` client map, the Receipts idiom) and the `stage`-only-for-`target`/`customer` validator rule; computed warmth weights and reconnect cadences; the own-Drive `Network App/_inbox/` → `<Company>/` layout; the Gemini-only card-extraction `responseSchema` with per-field `confidence{}`; the `nop=accounts` / `nop=signals` peer-op request and response shapes with the upsert key and the LinkedIn-host rejection; the Scraper `cop=people` route behind `NETWORK_CORPUS_TOKEN`; the D15 drafts flow with merge fields and the four hand-off formats; CSV/`.xlsx`/vCard 3.0 mappings; the audit-row rule (ids and counts, never a card field) and disclosure rows; soft delete, restore and browser-side purge; the checkers

#### `repository-information/EVENTS-SCHEMA.md`
- **New — the Events app's single source of truth**: the public/private line; slug and source-key rules; the admin-only access model (`EV_ROLE_CAPS`); the `events.json` registry row with every field typed and the `kind` / `status` enums; the `events-sources.json` roster row with the probe record and the `blocked` reason; the `Stars` / `Plans` / `Meetings` / `Proposed` / `Tuning` tabs; the E3 score terms with default weights (segment fit 0.35 · account presence 0.35 · corpus salience 0.15 · proximity 0.10 · conflict −0.25 · relevance prior 0.05; both seats weigh equally per §12.6); the `Proposed` diff row and the `events sync` contract; the `eop=today|starred|signals` peer ops; the RFC 5545 ICS and Add-to-Google-Calendar mappings; Overpass venues with the Places option; the corpus-count corollary; the checker assertions

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **§3 — every row now reads as a decision (header "approved 2026-09-20").** The eleven open rows were walked one at a time in §13.1's order and recorded: D4, D8, D16, D17 approved as recommended; **D7 overridden by the developer — both apps start admin-only** (the four tier keys stay in the caps maps as the widening path; §12.4 settled: no team layer); **D6 decided Gemini-only** (no Claude Haiku leg, no `ANTHROPIC_API_KEY`; §12.1: Gemini may process card PII); **D12 with Overpass venues** instead of Places (§12.5: no billed Google Cloud project); **D14 tightened to no data poll** in either app plus a new **Q0** Fable Medium session that rolls the `op=quota` counter to the eight existing projects (§12.2: consumer account until Q); D5 refined (single-valued `relationship` + Account `Tags`, the `stage` validator rule); D9 made precise (`unknown` consent allowed for the two D15 mail occasions); D2 with the no-service-worker offline limit recorded
- **D15 consequence recorded** — the reading surfaced that D15's "no `gmail.*` scope anywhere" collided with §4.4's `GmailApp`/`CalendarApp` sweep, which would also have read the *script* account's mailbox rather than the developer's work account; N4's touches are now **import-only** (`.ics` / sent-mail CSV, confirmed row by row). §4.4, §8 N3 and N4 done-whens, §9 N3/N4, and §10 precondition 3 scrubbed of the stale send/scope text; §5.6 and §8 E5 now say Overpass
- **§8** N0 and E0 rows cite `NETWORK-SCHEMA.md` / `EVENTS-SCHEMA.md` by name; **Q0** row added; E1 carries the RE+ 2026 (2026-11-16) date target; session count ≈ 24
- **§11** NE0 row flipped to **Done — v06.74r, 2026-09-20**; N0 and E0 rows to Open with their brief pointers; Q0 row added
- **§12** — all eight questions marked settled with the answer given at the gate
- **§13.1** carries a ran-on status line; **§13.3 (N0 brief)** and **§13.4 (E0 brief)** written as paste-in blocks — N0: the setup-script JSON, the PWA files and CSP override, the admin-only door and verifier, the tab bootstrap, the D14 intervals and `op=quota`, the D1 relabel lines, the deploy hand-off and done-when; E0: the corpus extraction script, Appendix A as input, the organiser-page verification rule, the `scraper-sources.md` probe procedure with the known blocked sources, the checker, the files and the done-when

#### `README.md`
- Structure tree: `EVENTS-SCHEMA.md` and `NETWORK-SCHEMA.md` entries added; the `NETWORK-EVENTS-DESIGN-PLAN.md` description updated to the decided state. `Last updated` and `Repo version` refreshed

### Notes

- **No rotation.** This push lands on **2026-09-19 EST**: 116 raw / 98 non-exempt against the 100 trigger (eighteen same-day sections exempt). The first push dated 2026-09-20 EST or later rotates the 2026-09-14 date group (20 sections).
- **No page, GAS script, diagram or rule changed.** Neither app was scaffolded (the brief forbids it); the Profiler "Ecosystem" relabel and every Scraper change are N0 / E4 work. `scripts/check-readme-tree.py` reports 0 findings.

## [v06.73r] — 2026-09-19 09:53:18 PM EST

> A few changes to the plan:
>
> * Regarding when either app would send mail, you said Version 1 creates Gmail drafts, but I would almost always send emails from my work email (regardless of which company I work for at the moment). Therefore, I want Version 1 to create email drafts for each recipient that I can modify in the app and then either export or copy/paste to a 3rd party app (could be Outlook or anything else). 
> * Regarding finding target contacts without Linkedin, I approve and want you to include everything in your list, especially your recommended quoted-people extraction over Scraper's articles.
>
>
> Give me a prompt to paste into a new Fable 5.1 xhigh session to start §13.1 and walk the eleven remaining decisions with me, then remember session.

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **D15 DECIDED — the apps never send and never touch Gmail.** The developer mails from a work account that changes with the employer, so v1 renders one editable draft per recipient in-app (merge fields from the contact and account rows) and hands off by `.eml` bundle, one-column CSV/`.txt`, per-draft copy-to-clipboard, or a `mailto:` link; marking a draft sent writes the `email-out` interaction. No `gmail.*` scope, no `MailApp`, no Gmail API in either app. §4.3's mailing bullet rewritten to match.
- **D11 APPROVED AND WIDENED to a thirteen-row signal-source catalogue (§5.5.1)** — exhibitor directories, speaker rosters, newswire RSS, newsroom/"meet us at" pages, the quoted-people extraction over Scraper's articles, agendas and recordings, FERC/PUC dockets, SEC filings, association directories, per-person Google News RSS, registrant mail, the corpus's own 1,479 decision makers, and the manual-only LinkedIn/X/attendee-list path — each with what it yields, how it is read, and its phase.
- **D17 added — the people route.** Scraper's summarisation schema gains `people[] { name, title, company, role, context }` at near-zero extra spend; the corpus route gains `cop=people&slug=&since=`; Network reads it through its own proxy behind a new `NETWORK_CORPUS_TOKEN` (a third token namespace — routing through Profiler's proxy rejected as a back-door widening of `CORPUS_TOKEN`). Bridge table gains the Scraper → Network row.
- **E4 grew to three sessions** (directory/roster/newswire/manual; newsrooms/agendas/FERC; the Scraper-side extraction and route); ≈ 23 sessions total. §11's NE0 row now lists six settled rows and the eleven the gate walks — D2, D4, D5, D6, D7, D8, D9, D12, D14, D16, D17. §13.1 updated to the same list.
- **§13.2 — the paste-in prompt for the gate session**, verbatim, so it survives the chat.

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for this three-push design session; the prior entry moved to Previous Sessions under the two-session cap. Recommendation: open a Fable 5.1 xhigh session and paste §13.2.

#### `README.md`
- `Last updated` and `Repo version` refreshed.

### Notes

- **No rotation.** This push lands on **2026-09-19 EST**: 115 raw / **98 non-exempt** against a 100 trigger with **seventeen** same-day sections, counter `Sections: 78/100`. The first push dated 2026-09-20 EST or later rotates the 2026-09-14 date group (20 sections).
- **No page, GAS script, diagram or rule changed.** Every Scraper change D17 names (`people[]`, `cop=people`) is a proposal for E4 session 3, not an edit made here.

## [v06.72r] — 2026-09-19 09:07:42 PM EST

> Regarding the headline recommendations:
>
> * "Keep the names, and treat 'Network' as a known collision" - I want to resolve the collision by renaming Profiler's Network to Ecosystem. 
> * "The decisive architectural fork is public versus private." - I agree that everything about people should be private and lives in Drive, whereas the event registry lives on Pages. 
> * "Network is account-centric, not card-centric." - I'm not 100% sure I can visualize what you mean. Can you expand on this? How does everything work together across accounts, and specifically, in the Network app?
> * "Mass email should leave your own mailbox." - I don't anticipate either Network nor Events will have to send out mass emails like Scraper. Under which circumstances do you foresee these apps needing to send out mass emails?
> * "Events sources are a hybrid of the corpus and research." - I approve this plan. Recommend me some ways you can search for my target contacts if Linkedin is blocked off. 
> * "Model rule, applied." - Give me the action plan in a table. 
> * "Classroom hook: deferred, narrow, and one-directional." - I approve your decision.
>
>
> You recommended me to paste the §13 brief from NETWORK-EVENTS-DESIGN-PLAN.md, and hold the NE0 gate: walk the sixteen decisions one at a time, then have that session write the two schema skeletons and the N0 and E0 briefs. I want to see that plan in detail before I continue in a new session.

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **FOUR GATE DECISIONS PRE-SETTLED BY THE DEVELOPER, RECORDED IN THE ROWS THEY BELONG TO.** D1 amended: the collision is resolved by renaming Profiler's explorer to **"Ecosystem"** — the heading, the denied-view sentence and the `verify-profiler-roles.py` label assertion change together in N0; the `network` capability key and the `#network` hash stay. D3 (people private in Drive, event registry public on Pages), D10 (hybrid corpus + Opus research sources) and D13 (`event:` prefix deferred, `contact:` never) approved as recommended. §11's NE0 row says the gate now walks the remaining eleven.
- **D15 AMENDED — drafts, not sends.** Asked when either app would ever send mail like Scraper, the honest answer is: never a digest; only post-event follow-up (one note per card scanned at a show, 20–60 at a time) and a few reconnect nudges a week. v1 therefore creates **Gmail drafts** per recipient through `gmail.compose` with the merge fields filled, and the developer sends from Gmail. The browser-side send path stays an off-by-default N3 option; `MailApp` stays ruled out.
- **§13.1 — the NE0 session step by step**, written before it runs at the developer's request: seven steps with outputs and a 60–90 minute budget — restate the settled rows, walk the eleven open rows in a stated order (account model and taxonomy first, build order last), settle the §12 questions each decision touches, write `NETWORK-SCHEMA.md` and `EVENTS-SCHEMA.md` with their exact contents listed, write the N0 and E0 briefs, one push. What the developer brings is listed, so silence on a row means "as recommended".

#### `README.md`
- Tree description for the plan updated; `Last updated` and `Repo version` refreshed.

### Notes

- **Answered in chat, not in the file, because they are explanation rather than decision:** the account-centric model walked through with one scanned card; the legally clean ways to find target contacts without LinkedIn, including a new idea — a *quoted-people* extraction over the trade press Scraper already ingests; the action plan as a table.
- **No rotation.** This push lands on **2026-09-19 EST**: 114 raw / **98 non-exempt** against a 100 trigger with **sixteen** same-day sections, counter `Sections: 78/100`. The first push dated 2026-09-20 EST or later rotates the 2026-09-14 date group (20 sections).
- **No page, GAS script, diagram or rule changed.** The Profiler relabel is a decision recorded here and executed in N0 with its own page-version train, not in this housekeeping push.

## [v06.71r] — 2026-09-19 08:47:39 PM EST

> I want to create two more apps that will be integrated into my current app ecosystem (Scraper, Profiler, and Classroom) called:
>
> 1. Network - At its foundation, I want to create something similar to my Receipts app, but for business cards. I want to be able to scan other professionals' business cards, save the image to my Google Drive (auto sorted by company name) and the data to a Google Sheets repository, display and manipulate the data in the PWA-ified Network app (filterable, exportable, mass-emailable, etc.). I would like you to look into what other features apps with similar business functions have and recommend them to me. I want the base app to have all the features that other similar apps do. Then, I want to build on top of that. Compared to the other ecosystem apps, I would like Network to function as a more personalized app that tracks certain contacts (decision maker, point of contact, etc.) of certain companies (customer, partner, supplier, targets, etc.) and work with my other unbuilt-but-planned Events app to recommend me shows to attend to chase down targets that may have announced their personal or company's intention to attend via Linkedin or other public news/social media source. I would welcome your ideas on how to improve in this direction.
> 2. Events - I want this to be an industry-wide events tracker/planner that will have its own source list (similar to Scraper), either based on the enormous amount of industry information that exists in this repository or through robust independent research via Fable 5.1 Medium/High/Xhigh (give me your recommendation), and features that recommend relevant industry events (from huge well-known conventions to smaller corporate summits to networking socials and more) to me, track events that I "star" or "favorite" on a scrollable calendar display with all relevant details (location, dates, times, general info, and more), create plans for me (with recommended exhibitor booths to visit, sessions to attend, & why, recommended day plans (with open spaces for me to schedule meetings that include recommendations for nearby places to meet at [cafes, lounges, etc.]), and more). This app should also work with Network as described above.
>
>
> The above are my general design ideas about how I want Network and Events to function and work together with Scraper, Profiler, and Classroom in the app ecosystem. I want Network and Events to also get access to the information contained in Scraper and Profiler and potentially eventually work with Classroom to teach users something (no need to force it if there's no genuinely valuable information to teach). Consider my ideas as a foundation, think deeply, and recommend me a long-term action plan (similar to the recently closed Profiler & Classroom update plan) to build out Network and Events with recommended AI model/effort level for every phase. I am choosing to use Fable 5.1 High for this first strategic design session; Feel free to recommend me upgrade to Xhigh or more if you think it's necessary.

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **THE NETWORK + EVENTS DESIGN PROPOSAL — the input to a design gate, not yet an approved spec.** Written on Fable 5.1 High from four research passes: a full read of the Receipts scan → own-Drive → Sheets → PWA pattern (`Receipts.html` / `Receipts.gs`, `setup-gas-project.sh`), the Profiler data model and surfaces (`OV_ROLE_CAPS`, the reserved `#network` route, `guidanceMentionsProxy_` as the peer-route template), the Scraper roster and corpus route, the Classroom gate surface (`CL_PROVENANCE_REF_KINDS`, P3/P4), the Routines lessons, and two web passes — fifteen card-scanner/personal-CRM apps and eighteen event-platform/event-data products, with a live probe of the organiser sites (JSON-LD `Event` on The Battery Show, DISTRIBUTECH, Data Center World, POWERGEN, Yotta, Intersolar; bot walls on 10times, DCD, OCP, Enlit).
- **§1 ground truth measured, not recalled**: 177 dossiers, 1,479 `decisionMakers[]` with no contact field, no first-person axis anywhere in the corpus, 31 events named in free text with no registry, zero events sources in Scraper, ten GAS projects on one 20,000-execution/day consumer account once both apps exist.
- **§3 sixteen gate decisions, each with a recommendation and the reason** — the decisive one is D3: everything about people is private (Drive + the app's spreadsheet behind the Master ACL, the M3 field-notes architecture) while the event registry is public on Pages (`live-site-pages/events-data/`). Also: keep the names and relabel Profiler's explorer "Ecosystem Graph" (D1); account-centric model with Accounts → Contacts → Cards → Interactions and a Profiler slug at the account (D4); `stage` aligned to the C5 enum (D5); Gemini `responseSchema` primary with Claude Haiku fallback and per-field confidence (D6); admitted tiers admin + contributor for Network, + analyst for Events (D7); opaque ids and soft delete (D8); consent / do-not-contact / minimum-necessary / disclosure rows (D9); a hybrid three-layer events source strategy with Opus 5 xhigh for the registry research (D10); a legally clean signal stack with LinkedIn entering by hand only (D11); deterministic plans in-app and a session-authored `events plan` narrative (D12); an `event:` Classroom prefix deferred and a `contact:` prefix never (D13); heartbeat 600 s and no data poll on Events (D14); **mass email sent from the browser as the developer through the Gmail API with the user's own `gmail.send` token — the own-Drive pattern applied to mail** (D15); build order with Network first because the bridge and the recommendation score read its account tags (D16).
- **§4–§6 the two designs and the bridge**: Network's five tabs, the capture pipeline with front/back pairs and an IndexedDB offline queue, `Network App/<Company>/` auto-sort via an `_inbox` move on save, dedupe-and-merge, exports (`.xlsx`, CSV, hand-rolled vCard), relationship intelligence (computed warmth, reconnect cadences, opt-in Gmail/Calendar sweep, pre-meeting brief on the `ovRelWordExport` precedent, on-the-record check against `decisionMakers[]`, promote-to-field-note); Events' public registry shape modelled on `profiler-projects.json`, a probed source roster under the `scraper-sources.md` discipline, a vanilla agenda scroller (FullCalendar rejected on the CSP nonce problem), a no-AI weekly poller that proposes into Sheets because a fired session cannot push, an explainable recommendation score, attendance signals with evidence URL + first-seen, and day plans with open slots and Places venues. Two new peer tokens (`NETWORK_PEER_TOKEN`, `EVENTS_PEER_TOKEN`) with the corpus token deliberately not widened.
- **§7–§9 the model rule applied and a 22-session phase plan** (NE0 · N0–N4 · E0–E5 · B · X · R · Q): Fable 5.1 xhigh exactly twice (the gate and the Classroom decision), Opus 5 xhigh for the registry research and the narrative plan command, Fable 5.1 High for every code session (reading depth across the template files), Fable 5.1 Medium for roster bookkeeping and the quota review. The developer's question about this session's effort is answered in §7: High was right for a proposal; the gate is the session to run at xhigh.
- **§10–§13**: critical path (NE0 → N0 → N1 → N2 → B → E3 → E4 → E5) with E0 in a parallel Opus lane; preconditions in the order they bite (the gate, Monday's earnings-desk proof before any Routine, keys and scopes, the two tokens, the quota counter, the weekly Fable cap); an all-"Proposed" status ledger; eight open questions (PII processors, consumer vs Workspace, the relabel, team scope, Places billing, seats, the registry's public line, gate effort); the paste-in brief for NE0; and **Appendix A, the 64-row seed event calendar for 2026-Q4 → 2027** with organiser, dates (V/U), tier, relevance, exhibitor/speaker-list availability and feed type.

### Changed

#### `README.md`
- Tree entry for `NETWORK-EVENTS-DESIGN-PLAN.md` under `repository-information/`; `Last updated` and `Repo version` refreshed.

### Notes

- **Two things a reader of the plan should not mistake for decisions.** The 64-row calendar's (U) rows are third-party listings until E0 reads the organiser's page, and the per-1,000-card extraction costs are computed from published token rules, not measured.
- **No page, GAS script, diagram or rule changed.** The plan is a `repository-information/` document; `REPO-ARCHITECTURE.md` does not list plan documents, so no diagram edit applies.
- **No rotation.** This push lands on **2026-09-19 EST**: 113 raw / **98 non-exempt** against a 100 trigger with **fifteen** same-day sections, counter `Sections: 78/100`. The first push dated 2026-09-20 EST or later rotates the 2026-09-14 date group (20 sections) — the clone is already deepened.

## [v06.70r] — 2026-09-19 07:32:58 PM EST

> See attached screenshot for what my NEW Profiler earnings desk looks like after I copied the instructions over.

### Fixed

- **THE REBUILT EARNINGS DESK IS LIVE WITH THE REPOSITORY ATTACHED — the fix the whole week has been chasing.** `trig_01HkrwpCULei8Gje6RGqcp1B`, created in the UI 2026-09-19 23:24 UTC, prompt saved 23:29 UTC. Verified against the API: prompt complete and matching the old Routine line for line (opening, STEP 0 a–e, the `add_repo` warning, the body, the corpus token, the closing REPORT line), `mcp_connections: []` so **none of the five default connectors came along**, cron `0 13 * * 1-5`, push + email, `model: ""` (Default), `next_run_at` 2026-09-21T13:08:01Z. The repository chip `LightAISolutions/Sales` is visible in the editor and in the detail page's **Runs with** card.
- **THE OLD ROUTINE IS DELIBERATELY LEFT LIVE THROUGH MONDAY, AS A CONTROLLED A/B.** `trig_01UyH77BMKJnxzBUZJ11ej6A` fires at 13:03:56Z and the new one at 13:08:01Z — old first, four minutes clear, and the old one dies at the dry-run push in ~34 seconds without touching the queue, so there is no collision. **The only difference between the two is the attached repository**, which makes Monday the cleanest possible proof of the diagnosis rather than merely a hopeful run.

### Changed

#### `.claude/rules/profiler-app.md`
- **THE REBUILD'S PRICE, RECORDED BECAUSE IT WAS DISCOVERED THE HARD WAY: a UI-created Routine can never be edited by an agent again.** The new Routine carries `created_via: "http_api"` and `update_trigger` refuses it — *"Agents can only update routines they created (via create_trigger)."* A Routine's own session may still set `enabled=false`; nothing else. **For every rebuilt Routine this retires the entire apparatus this repo built around `update_trigger`** — the C3 session 3 rule, design §12 item 2, and the three-session (rr66)/(rr68)/(rr69) sequence that landed one approved prompt amendment on 2026-09-19. A prompt change becomes a developer pasting into the UI. Still the right trade — a Routine that cannot push is useless whoever may edit it, and amendments are occasional while runs are daily — but it applies to all five committing Routines and should be taken knowingly.
- **TWO API FIELDS THAT LOOK LIKE THEY ANSWER "IS A REPOSITORY ATTACHED" AND DO NOT.** `derived_state.folders_state` reads `FOLDERS_STATE_NONE` and `folders` reads `[]` on a Routine whose repository is demonstrably attached; `session_request.config.sources` is simply absent from a UI-created record rather than present-and-empty. **Neither is evidence.** The only reliable check is the **Runs with** card in the UI. That misreading was made in this session and is corrected here before it hardens into a rule.

### Notes

- **The plan to have an agent fill the prompt failed, and the fallback cost one paste.** v06.69r's approach was: developer creates an empty shell, agent writes the 4,455-character prompt in by API so the corpus token never passes through a file or a clipboard. `update_trigger` refused it for the reason above. The developer copied the Instructions field from the old Routine instead — which keeps the token inside the UI just as well, and is the method the rebuild guide should have led with.
- **Still to do:** delete the old Routine after Monday's comparison, then rebuild the four remaining committing Routines. The ACL health check is read-only, works today, and needs no rebuild.

## [v06.69r] — 2026-09-19 07:12:53 PM EST

> Check whether the earnings desk landed its commit. I believe I saw a phone notification telling me that it failed because it didn't have access to my Sales repository.

### Fixed

- **SETTLED: A ROUTINE-FIRED SESSION CAN CLONE BUT CANNOT PUSH — THE QUESTION LEFT OPEN AT v06.18r IS ANSWERED, AND THE ANSWER IS NO.** The earnings desk fired Thursday 17 and Friday 18 September with the corrected STEP 0 and **landed no commit**. Friday's run telemetry: **34 seconds, 47,441 context tokens, 1,315 output tokens, $0.11**, `status_bucket: REVIEW_READY`. The token count proves it **cloned** — a session with no checkout spends near-zero, and the repo-less runs that preceded STEP 0 all did — while 34 seconds proves it **stopped at the dry-run push** rather than researching. `profiler-refresh-calendar.json` is untouched at `updated: 2026-09-13`, with `iren` (2026-08-27), `jinko` (2026-08-27), `oracle` (2026-09-10) and `novonix` (2026-09-14) still due. The developer's push notification said the run failed for lack of access to the repository, which matches exactly.
- **THE TWO HALVES OF REPOSITORY ACCESS ARE SEPARABLE, AND ONLY ONE IS REACHABLE FROM A PROMPT.** `git clone` over the session's git proxy authenticates for **READ**; **WRITE is denied**, and no instruction written into a Routine prompt can grant it. That is the single fact that explains the whole week: the read-only ACL detector has run green every day since 2026-09-16 (it clones, probes and reports), while every committing Routine lands nothing. `create_trigger` cannot attach a source, `update_trigger` cannot add one, and the claude.ai repository picker exists only on the New routine creation form — so **recreating each committing Routine with `LightAISolutions/Sales` selected is now the only remaining fix, and it is mandatory rather than optional.**
- **STEP 0 STILL EARNED ITS PLACE, AND THE TWO RUNS MEASURE EXACTLY WHAT IT BOUGHT.** On 2026-09-16 the same Routine spent about an hour researching IREN, Jinko and Oracle, committed locally as `a378a96`, hit the denial at the last step, and lost all of it with the queue left in the dark. On 2026-09-18 it spent **34 seconds and eleven cents**, wrote nothing, advanced no row, and reported why. **STEP 0 did not fix the access problem and was never capable of fixing it; what it fixed is the cost and the silence of the failure.** Keep it after the rebuild for that reason alone — it is what makes a future loss of write access cheap and loud instead of expensive and invisible.

### Changed

#### `.claude/rules/profiler-app.md`
- **"Scheduled Refreshes" updated with the settled finding** — the clone/push split, the two runs' measured cost as the evidence, and the upgrade of recreate-with-repo-attached from optional cleanup to a requirement for every committing Routine. The "never create a Routine and assume it can reach the repo" paragraph now says so inline.

### Notes

- **The queue lost nothing across three failed cycles.** Four rows remain due and the desk will take the three oldest on its first healthy run. Every failure since 2026-09-16 has been a clean stand-down; the only casualty in the whole episode is the research inside `a378a96`, lost before STEP 0 existed.
- **Sep 19 is a Saturday** (`date -d` verified), and the desk's cron is `0 13 * * 1-5`, so today was not a missed run — the next firing is Monday 2026-09-21.
- **One Routine was amended by another session today** (`Industry Guidance quarterly review`, 2026-09-19 20:30 UTC, for the C5 rehearsal scenarios) and it **preserved STEP 0 intact** — worth recording, because a later editor dropping that block is the failure mode the rebuild guide warns about.
- **No rotation.** 111 raw / **98 non-exempt** against a 100 trigger, counter `Sections: 78/100`, with **thirteen** sections dated 2026-09-19 EST. This is the closest the non-exempt count has come to the trigger; the next push dated 2026-09-20 or later almost certainly rotates.

## [v06.68r] — 2026-09-19 06:55:09 PM EST

> **Prompt:** "continue with your recommendation"

### Fixed

- **`reading-the-graph` taught a corpus count the graph had already falsified — the first genuine contradiction found in this three-session arc, and one (rr70)'s audit missed — (rr72).** Section `what-an-edge-is` taught *"At the last build there were **1,260 edges** across the corpus."* The figure was **correct when authored** (commits `c582f11e` and `5687fe99`, both 2026-09-08, carried exactly 1,260) and a **later build the same day** (`78cfaf6c`) took it to 1,283; the graph holds **1,481** today. G3's sentence writes itself — *section `what-an-edge-is` teaches 1,260 edges; `graph:profiler-graph` now says 1,481* — so the lesson is revised. The section **no longer quotes a running total at all**: it states the scale and tells the reader to read the live figure off the graph's own `built` snapshot, which is a better lesson than the number was and cannot go stale. `graph:profiler-graph` re-pinned 2026-09-08 → **2026-09-19**, read off `built` this run (G2); the other five inputs keep their pins because the revision did not draw on them. `updated` → 2026-09-19; `reviewBy` 2027-03-08 unchanged (no new dated gate); one `revisions[]` entry appended with `changed: ["what-an-edge-is"]`.
- **The `tiles[0]` entry carried the same superseded `1,260`** and is corrected in the same commit. The committer is forbidden to touch `tiles[]` and is told to report a contradicted tile under `Needs the developer` — this is the developer session that rule defers to.
- **A correction to (rr70):** it read the graph diff, checked **the edges the lessons quote**, and concluded "no contradiction" — never checking the sentence *about* the corpus. A diff-reading pass structurally cannot catch a claim about a file's **shape** rather than its rows. Everything else (rr70) said about the graph was re-measured this run and stands: `fluidstack↔terawulf` 23 cross-mentions and `last` 2026-08-05, `fluidstack↔hut-8` `last` 2026-02-25, `hut-8↔terawulf` five undated mentions, TeraWulf's five curated relationships — **all byte-stable at pin and today.**

### Changed

- **The stale count is 13 → 12.** `reading-the-graph` leaves the list because its pin was **earned** by a revision, not cleared by a rule — which is the outcome the whole layer is for.
- **`PROFILER-SCHEMA.md` → "Registry revision signals"** gains the standing answer on why `graph:` gets no rule, plus the corollary for authors: **do not teach a corpus-wide count** — state the scale and point at the file's own `built` snapshot.
- **Records:** `CLASSROOM-CURRICULUM-PLAN.md` §10.6 **(rr72)** with the register advanced to **(rr73)**; `INTEGRATED-REMEDIATION-PLAN.md` seventh revision of the closing note.
- Classroom GAS **v01.84g → v01.85g**, `Classroomgs.version.txt` and a generic `Classroomgs.changelog.md` entry; the README tree's Classroom GAS display updated to match.

### Notes

- **The recommendation this session was sent to implement was wrong, and the evidence that killed it came from implementing it.** (rr71)(d) queued an edge-keyed sibling of `source_revision_only()` — edges keyed on `(a, b)`, a new edge additive because a new pair says nothing about an existing pair, `evid[]` compared order-insensitively — and predicted it would take 13 to 11. The design question was asked **before** the code was written: *does any pinned lesson enumerate the graph rather than quoting individual edges?* One does. **An additive edge rule would have cleared the single graph pin that was genuinely stale.** That is the exact false negative `source_revision_only()` was built to refuse, reached from the other direction.
- **The standing finding: a derived aggregate's own size is a claim, so a wholesale-regenerated file has no cheap "unchanged" state.** A rule that additionally required the edge count to hold would never fire — the graph gains edges on nearly every `profiler <Company>` run. **`graph:` gets no source-side rule, and that is the answer rather than a deferral.** Its pins stay in the stale list and are closed by reading, which is the correct cost for a file whose every build is a new document.
- **The other two graph pins were swept for the same class of claim and carry none.** Every figure in `where-bess-plugs-in` and `the-campus-as-a-power-project` is a project or dossier fact (210 engines, 330/245 MW, 2.8 GWh, 5 GW, 474 GW), never a graph statistic — so they stay pinned and stale with nothing to revise.
- **What the arc looks like closed.** Session one proved eighteen stale pins were noise and wrote the disproof by hand; session two taught the checker to see five of them as noise by construction; this one found that the thing none of that machinery could articulate — a pin whose *sentence* nobody had read — was a real error being taught to learners. **The staleness report was right to keep pointing at the graph.**
- **Checker results:** `check-classroom-content.py` **70 lessons / 8 tracks / 220 gate cases — 0 errors / 0 warnings**; `check-classroom-curriculum.py` **no structural findings**, **12 stale / 37 additions-only / 5 migration-only**, 0 of 19 segments due, coverage 14 of 14, 0 scenarios on moved landscapes; `check-classroom-pipeline.py --selftest` **15 fixtures / 0 failures**; `check-classroom-pipeline.py --base origin/main` **9 paths changed, 3 findings, all P1** (`CLASSROOM-CURRICULUM-PLAN.md`, `INTEGRATED-REMEDIATION-PLAN.md`, `PROFILER-SCHEMA.md` — outside the committer's write set, expected for a developer session). **Everything else passes on a diff that genuinely revises a lesson**: P2 the content fence, P3 the gate digest, P5 surviving ids, P6 the derived gate, **P7 the pin move and the single appended revision**, **P8 `changed[]` == the sections that differ**, P10 the caps (1 revised, cap 3), P11 the generic public changelog and P12 the `VERSION` / version-file pair — the first time in this arc those assertions have judged a real revision rather than an empty diff; `node --check` on a `.js` copy of `Classroom.gs` clean; `check-gas-inner-scripts.js` 9 files / 86 inner blocks; `check-readme-tree.py` **0 findings**.

## [v06.67r] — 2026-09-19 06:26:54 PM EST

> **Prompt:** "continue with your recommendation"

### Added

- **`source_revision_only()` in `scripts/check-classroom-curriculum.py` — the dated-source sibling of (rr69)'s `registry_additive_only()`, and the remedy (rr70) named — (rr71).** For a `profile:`/`study:` pin it reads the source as it stood at the pin (`git show <last commit on or before the pin>:<path>`) and clears the move **only** when every difference is provably claim-free: a metadata field (`schemaVersion` / `lastUpdated` / `profileVersion`); a field that was **empty at the pin** (`null`, `""`, `[]`, `{}`, absent — there was nothing there for the lesson to draw on, so populating it is an addition); a **citation repaired from a strict prefix of itself** (`source`, `url`, `linkedin`, `photo`, `website`); or a **new entry in an identity-keyed list where a new entry cannot rewrite an existing claim** (`sources`, `relationships`, `policyExposure`, `decisionMakers`, `productsAndServices`, `technicalSpecs`). Helpers `_benign()` and `_empty()` and the three policy constants carry the reasoning in comments.
- **A `SCHEMA MIGRATION ONLY` report line in section 3**, mirroring the additions-only line: the cleared pins are named with their refs, excluded from the stale count, and never re-pinned. **No pin was written and G2 is untouched** — re-pinning still requires a session that actually re-read the source.
- **A second amendment to `PROFILER-SCHEMA.md` → "Registry revision signals"**, stating the dated-source rule, the four clear-conditions, what is deliberately not additive and why, and the measured before/after.

### Changed

- **The stale count is 18 → 13** (37 additions-only, **5 migration-only**), with `no structural findings`. The five that cleared are pure schema v6 → v7 migrations: `profile:voltagrid`, `profile:proenergy`, `profile:mainspring-energy`, `profile:stack-infrastructure`, `profile:on-energy`. The five that stayed each appended something real — `enchanted-rock` a corroboration sentence on a spec band's `value`, `kiewit` a re-typed `bechtel` relationship (`other` → `competitor`) with a rewritten note, `bloom-energy` three `recentDevelopments` and a `strategyRead` judgement, and `study:vertiv` twelve new `sections[]`.
- **Records:** `CLASSROOM-CURRICULUM-PLAN.md` §10.6 **(rr71)** with the register advanced to **(rr72)**; `INTEGRATED-REMEDIATION-PLAN.md` sixth revision of the closing note; `PROFILER-SCHEMA.md` as above.

### Fixed

- **A malformed pin no longer clears itself.** `--before=<unparseable>T23:59:59` makes git fall back to "now", which resolves to today's blob and compares the source against itself — `source_revision_only()` now refuses any pin that fails `DATE_RE` before it runs git. Caught by a negative test written against the new function, not by review.
- **A missing blank line before the `## [v06.66r]` header**, introduced by the previous push's programmatic insertion, restored.

### Notes

- **(rr70)'s "roughly 2" estimate was wrong — the real number is 13, and the gap is the finding.** That estimate was made from a human read of *which dossiers had actually contradicted something* (none had); the checker can only clear what it can **prove** claim-free. The difference is not a shortfall to be tuned away: `recentDevelopments`, `strategyRead` and a study guide's `sections[]` are deliberately **not** additive here even though the registry rule clears additions without hesitation, because a registry entry is a self-contained definition while **a development, a judgement or a section appended to a dossier CAN supersede one a lesson taught** — "the order was cancelled" is an append. A missed contradiction is silent and permanent; an over-report costs one read. **13 is the designed number.**
- **A latent gap in `registry_additive_only()` is reported, not silently patched.** It has the identical malformed-pin behaviour (`registry_additive_only(base, path, "not-a-date", {})` returns `True`). No caller can reach it — section 3 only enters that branch when `live > pin`, which a malformed pin fails on string comparison — and it is pre-existing code this session was not asked to touch. It is a one-line `DATE_RE` guard whenever the developer wants it.
- **`graph:profiler-graph` is deliberately still uncovered.** The three surviving graph pins have the same shape and (rr70) already did the analysis — 991 / 198 / 52 edges added, none removed, and nothing semantically rewritten at the 2026-09-08 or 2026-09-13 pins — so two of the three would clear under an edge-keyed sibling. It is not built here because the graph is **derived**: `built` is a build timestamp rather than a revision date, the file is regenerated wholesale on every `profiler <Company>` run, and its `evid[]` arrays are re-emitted in fresh order each time, so an edge-level rule needs order-insensitive comparison and its own justification for what "unchanged" means.
- **No content corpus change.** `googleAppsScripts/Classroom/Classroom.gs`, `Classroomgs.version.txt` and `Classroomgs.changelog.md` are byte-identical to `origin/main` — no lesson literal, no pin, no `updated`, no `revisions[]`, no `type: "scenario"` literal (D6/P13), no GAS version bump, no page bump. No fixture or threshold was edited; the only script touched is the health report itself, which is a report (`exit 0` by default), not a gate.
- **Checker results:** `check-classroom-curriculum.py` **no structural findings**, **13 stale / 37 additions-only / 5 migration-only**, 0 of 19 segments due, coverage 14 of 14, 0 scenarios on moved landscapes; `check-classroom-content.py` **70 lessons / 8 tracks / 220 gate cases — 0 errors / 0 warnings**; `check-classroom-pipeline.py --selftest` **15 fixtures / 0 failures**; `check-classroom-pipeline.py --base origin/main` **7 paths changed, 4 findings, all P1** — `CLASSROOM-CURRICULUM-PLAN.md`, `INTEGRATED-REMEDIATION-PLAN.md`, `PROFILER-SCHEMA.md` and `scripts/check-classroom-curriculum.py` are outside the unattended committer's closed write set, which is expected and correct for a developer session; the other three paths (`CHANGELOG.md`, `repository.version.txt`, `README.md`) are inside it and pass, and **no P2–P13 assertion fires at all** because no lesson literal moved; `node --check` on a `.js` copy of `Classroom.gs` clean; `check-gas-inner-scripts.js` 9 files / 86 inner blocks; `check-readme-tree.py` **0 findings**.
- **Negative tests run against the new function** (all must return False, and do): an unknown ref prefix, a nonexistent slug, an empty ident, a pin predating the file, a malformed pin, an unresolvable base revision. Plus `_benign()` unit checks over identical values, an empty-at-pin value, a repaired truncation, a changed figure, a different citation and appended prose on a non-citation field.

## [v06.66r] — 2026-09-19 05:16:31 PM EST

> **Prompt:** "Run the stale-pin refresh session in LightAISolutions/Sales on Opus 5 xhigh, as a fresh session on your assigned claude/* branch. CONTEXT. At v06.65r (2026-09-19) the staleness rule was amended (rr69): a commit-date move on an undated registry is a signal, not a verdict, so pure registry additions no longer report as stale. That took the count from 55 to 18. The 18 that remain are REAL — each one is a source that was removed, rewritten, or genuinely revised since the lesson pinned it. This session clears them. It is the last open item on the Profiler & Classroom programme. READ FIRST: CLAUDE.md; .claude/rules/classroom-app.md (especially G2 \"read before re-pin\" and the provenance stamp rules); repository-information/CLASSROOM-SCHEMA.md. STEP 0. git fetch --unshallow origin main || true — BEFORE any --check, any git log date and any pin read. […] For EACH lesson, in this order: 1. READ every moved source in full […] 2. DECIDE whether the lesson's text is still true against what you just read. […] 3. If the text moved: revise the lesson, then re-pin ONLY the inputs the revision actually drew on […] 4. If the text did NOT move: re-pin anyway, to the date you read — but ONLY because you read it this run. Record in the CHANGELOG which lessons were re-pinned without a text change and why […] 5. NEVER write a pin date you did not read off a fetched document. […] For the three concepts: pins — […] Diff the registry at 2026-08-31 against today, find the entries that were REMOVED or REWRITTEN (the leakage-inductance alias removal is one), and check whether each affected lesson actually uses those terms. That is the whole question. CAPS AND GATES. This is a developer session, so P10's 3-revised-lesson cap does not bind you […] Do not touch any type:\"scenario\" literal (D6/P13). Do not edit any checker, fixture or threshold. BEFORE COMMITTING: […] CLOSE WITH: a per-lesson table […] If the count does not reach 0, name every survivor and say why it survived; a pin you could not honestly re-pin is a correct outcome, not a failure."

### Changed

- **The 18-pin refresh backlog is CLOSED — audited and disproved rather than cleared, with no pin written — (rr70).** Every moved source was fetched and read in full this run: eight dossiers, one study guide, `profiler-concepts.json` at all four of its pin dates, and `profiler-graph.json` at all three of its. **All eighteen are non-contradictions.** The brief's premise — "each one is a source that was removed, rewritten, or genuinely revised" — does not survive the read: the **2026-09-05/06 wave was a schema v6 → v7 migration**, not a content revision. Across `voltagrid`, `proenergy`, `enchanted-rock`, `mainspring-energy`, `kiewit`, `bloom-energy`, `stack-infrastructure` and `on-energy` the movement is truncated `source` URLs repaired, the new `via` / `project` typing fields populated, and `policyExposure` blocks written where the field had been `null`; `recentDevelopments`, `technicalSpecs`, `summary` and `strategyRead` are byte-identical on seven of the eight. Only `bloom-energy` carries genuinely new material — three Brookfield AI-Fund related-party-revenue developments plus a new `strategyRead` — and that is a financing-structure finding touching nothing `bridge-power` took from it.
- **`study:vertiv` grew 6 sections → 18 with zero changed and zero removed.** The twelve new sections are UPS product material, and the guide's own new opening section states it deliberately does **not** repeat the double-conversion / eco-mode / hold-up physics, naming Eaton's guide as where that lives — which is the input `the-aidc-power-chain` already carries. Novelty under G3, never a contradiction; `heat-is-the-constraint` took only the six cooling sections, which are byte-identical.
- **`concepts:profiler-concepts` went 44 → 1,477 entries with ZERO removals and EXACTLY ONE rewrite at any pin date: `ups`** — broadened from "a battery-backed power stage" to "a power stage backed by stored energy — a battery string or a spinning flywheel". Of the five lessons it staled, four (`cell-to-container`, `duration-and-degradation`, `spec-sheet-decoded`, `heat-is-the-constraint`) contain **zero** occurrences of UPS, uninterruptible, flywheel or rotary; the fifth, `the-aidc-power-chain`, already teaches `"Stored energy — UPS batteries or flywheels"` in its `outage-choreography` table and never renders `{{UPS}}` as a tooltip. **The registry caught up to the lesson, not the reverse.**
- **`graph:profiler-graph` added 991 / 198 / 52 edges at the three pin dates and removed none.** Of the 131 edges reported as rewritten against the 2026-09-02 pin, **109 carry only the same truncated-`source` repair**, the bulk of the rest is `evid[]` growth and reordering, and roughly a dozen are genuine curated re-typings (`bechtel↔kiewit` `other`→`competitor`, `catl↔zhonhen`, `hithium↔sungrow`, `liteon`/`megmeet` `supplier`→`partner`) — **none of which appears in any pinned lesson.** The two edges `where-bess-plugs-in` actually quotes are `crusoe↔on-energy` (URL repair only — `type`, `via`, `note`, `context`, `scale` identical) and `tesla↔xai` (byte-identical). The single edge reported as rewritten against the 2026-09-08 pin, `galaxy-digital↔hut-8`, is pure key and array reordering with no semantic delta at all; against the 2026-09-13 pin nothing changed.

### Fixed

- **A correction to (rr69): the concepts modification that kept five pins stale is `ups`, not a `leakage-inductance` alias removal.** Measured at all four concepts pin dates (2026-08-31, 2026-09-03, 2026-09-07, 2026-09-13): removals are **`none`** at every one, and `leakage-inductance` is an *addition* — no entry carried a `leakage` alias on 2026-08-31, so there was no alias to remove. (rr69)'s conclusion and its checker are unaffected and behaving exactly as designed; only the worked example it cited as "the strongest evidence available that it is not simply suppressing the signal" is misattributed, and a reader who goes looking for that removal will not find it. `ups` serves the same evidentiary purpose and is real.

### Notes

- **The brief asked for a re-pin-anyway; G3 forbids it in those words; the developer chose G3.** The brief's step 4 read *"if the text did NOT move: re-pin anyway, to the date you read"*. `.claude/rules/classroom-app.md` G3 names that exact move and refuses it: *"A source that moved without contradicting anything leaves the lesson untouched — pin included … that repetition is the intended idempotence, not a defect to fix by advancing the pin 'to keep it current'."* Because all eighteen are non-contradictions this was the whole session rather than an edge case, and it is not separable — **P7 forces an `updated` bump and a `revisions[]` entry with `changed: []` on any lesson whose pin moves**, so a re-pin would have written nine revisions asserting a re-authoring that did not happen. Three options were put to the developer (honour G3 and commit the audit; re-pin under the brief and accept nine G3 violations plus the P10 cap breach; amend G3 with a "verified-unchanged re-pin" clause as a sibling to (rr69)'s additions-only carve-out) and **the developer chose to honour G3**.
- **Per-lesson result — nine lessons, eighteen pins, zero text changes, zero pins moved.** Every date below was read off the body of a document fetched this run (G2): `profile:`/`study:` from the fetched JSON's own `lastUpdated`, `graph:` from the file's `built` field, `concepts:` from `git log -1 --format=%cs` on the registry.

| Lesson | Pins that moved | Sources read (live date) | Text changed | Pins re-pinned |
|---|---|---|---|---|
| `bridge-power` | 7 | `profile:voltagrid` 2026-09-06 · `profile:proenergy` 2026-09-05 · `profile:enchanted-rock` 2026-09-05 · `profile:mainspring-energy` 2026-09-05 · `profile:kiewit` 2026-09-05 · `profile:bloom-energy` 2026-09-06 · `profile:stack-infrastructure` 2026-09-06 | **no** | 0 |
| `the-aidc-power-chain` | 2 | `study:vertiv` 2026-09-04 · `concepts:profiler-concepts` 2026-09-19 | **no** | 0 |
| `heat-is-the-constraint` | 2 | `study:vertiv` 2026-09-04 · `concepts:profiler-concepts` 2026-09-19 | **no** | 0 |
| `where-bess-plugs-in` | 2 | `profile:on-energy` 2026-09-05 · `graph:profiler-graph` 2026-09-19 | **no** | 0 |
| `reading-the-graph` | 1 | `graph:profiler-graph` 2026-09-19 | **no** | 0 |
| `the-campus-as-a-power-project` | 1 | `graph:profiler-graph` 2026-09-19 | **no** | 0 |
| `cell-to-container` | 1 | `concepts:profiler-concepts` 2026-09-19 | **no** | 0 |
| `duration-and-degradation` | 1 | `concepts:profiler-concepts` 2026-09-19 | **no** | 0 |
| `spec-sheet-decoded` | 1 | `concepts:profiler-concepts` 2026-09-19 | **no** | 0 |

- **Stale count before 18, after 18 — every one a survivor, and every one for the same reason.** The source moved; nothing it says contradicts what the lesson teaches; G3 therefore leaves the pin where it is. `--strict` will keep reporting all eighteen on every future run, which G3 calls the intended idempotence. The disproof above exists so that the next reader audits it rather than repeating the half-hour of dossier diffing it cost.
- **The root cause (rr70) names and does not fix: a schema migration and a content revision are indistinguishable at the `lastUpdated` level.** A dossier that only had its truncated URLs repaired advertises the same freshness signal as one that changed a figure. That is (rr69)'s problem one layer up, with the same available remedy — compare a dossier's content-bearing fields at the pin against today and report a migration-only move separately, the way additions-only registry moves are already reported. Not made here: the brief forbade touching a checker, and the audit-only path was the one chosen.
- **Nothing in the content corpus was touched.** `googleAppsScripts/Classroom/Classroom.gs` is byte-identical to `origin/main` — **no lesson literal, no `provenance.inputs[].date`, no `updated`, no `revisions[]`, no `type: "scenario"` literal (D6/P13), no GAS `VERSION` bump, no `Classroomgs.version.txt` bump and no page/GAS changelog entry.** No checker, fixture or threshold was edited. The clone was deepened with `git fetch --unshallow origin main` before the first `--check`, pin read or `git log` date, per the CLAUDE.md precondition.
- **Checker results:** `check-classroom-content.py` **70 lessons / 8 tracks / 220 gate cases — 0 errors / 0 warnings**; `check-classroom-curriculum.py --strict` **no structural findings**, 18 stale / 37 additions-only, 0 of 19 segments due, coverage 14 of 14, 0 scenarios on moved landscapes; `check-classroom-pipeline.py --selftest` **15 fixtures / 0 failures**; `check-classroom-pipeline.py --base origin/main` **5 paths changed, 2 findings, both P1** — `CLASSROOM-CURRICULUM-PLAN.md` and `INTEGRATED-REMEDIATION-PLAN.md` are outside the unattended committer's closed write set, which is expected and correct for a developer session and is the direct analogue of the P10 finding the brief anticipated for a re-pin run; the other three paths (`CHANGELOG.md`, `repository.version.txt`, `README.md`) are inside it and pass, and **no P2–P13 assertion fires at all** because no lesson literal moved; `node --check` on a `.js` copy of `Classroom.gs` clean; `check-gas-inner-scripts.js` 9 files / 86 inner blocks all parsing; `check-readme-tree.py` **0 findings** (10 page + 8 GAS version displays matching).

## [v06.65r] — 2026-09-19 04:39:04 PM EST

> **Prompt:** "I approve updating the prompt of the \"Industry Guidance quarterly review\" Routine (trig_01CrhxzfBV6uKQNKpUXLLMSZ) in place, changing the prompt field only, to exactly the 34-line amended text in the §12 annex of C5-SALES-SIMULATIONS-DESIGN.md. Do not change the cron, the name, or the model, and do not delete and recreate the Routine. Read the prompt back afterwards and confirm it matches the annex character for character. On the second question: (rr56) is taken — re-cut the eleven earlier scenarios' answer positions in its own separate session. (rr59), the roster hash change, is not taken. […] Change what counts as stale […] Refresh the 15 content pins. If this is the only open item left from the overall Profiler & Classroom update plan, then give me a prompt to paste into a new session."

### Changed

- **The quarterly guidance review Routine is AMENDED IN PLACE, and design §12 item 2 — the programme's last open action item — is CLOSED.** The developer's approval arrived as their own sentence in session rather than in a brief's `[DEVELOPER: …]` slot, which satisfies the C3 session 3 rule on its own terms: the rule requires explicit approval *in the session that makes the change*, and never required a particular vessel for it. `update_trigger` was called once on `trig_01CrhxzfBV6uKQNKpUXLLMSZ` with **`prompt` only**, carrying the 34-line block extracted programmatically from the `C5-SALES-SIMULATIONS-DESIGN.md` §12 annex (lines 307–340; **7,917 characters with the trailing newline, 7,916 as the JSON string** — reproducing (rr68)'s one-character convention gap exactly, which is itself evidence the extraction was faithful). Read back through an independent `list_triggers`: **cron `0 13 15 1,4,7,10 *`, name, model, `next_run_at` 2026-10-15T13:00:20Z, enabled, and never-fired all unchanged**; `updated_at` moved 2026-09-16 → 2026-09-19T20:30:23Z and is the only field besides the prompt that moved. Nothing was deleted, recreated, re-scheduled or re-modelled. **Step 3a is now live**: when the review revises a `landscape-*` module it will read the scenarios stamped on it off `Classroom.gs` and report them under `Needs a developer session — scenarios on revised landscapes` — and revise none of them, as design D6 and pipeline assertion P13 require.
- **The staleness rule is amended: a commit-date move is a signal, not a verdict — (rr69).** `check-classroom-curriculum.py` reported **55 stale pins**, of which **37 were a single signal**: `concepts:profiler-concepts` plus four `project:` refs moving because new dossiers had registered new entries. The C2b commit-date rule cannot distinguish an addition from a rewrite, so every `profiler <Company>` run re-staled the hand-authored corpus wholesale and the count measured how fast the corpus grew rather than what needed a developer's attention. The checker now qualifies the signal: it reads each registry as it stood at the pin (`git show <last commit on or before the pin>:<path>`) and compares entry-by-entry on `slug`. Every pinned entry still present and byte-identical → **ADDITIONS ONLY**, printed on its own line and excluded from the count; any entry removed or rewritten → stale exactly as before; **anything unprovable → stale**, so the check can only ever remove a finding it has positively disproved, never add one. Measured after: **18 stale, 37 additions-only**. Five `concepts` pins correctly stayed stale — the same day's `leakage-inductance` alias removal was a modification, and the check caught it unprompted.
- **`profiler-concepts.json` / `profiler-projects.json` pins are unchanged and G2 is untouched.** No pin was written. Re-pinning still requires a session that actually re-read the source; this changes only which movements are reported as needing one.

### Added

- **`registry_additive_only()` and `_registry_entries()`** in `scripts/check-classroom-curriculum.py`, with the reasoning in the docstring: a lesson's `{{term}}` spans resolve against the entries it pinned, so vocabulary the lesson never used cannot change a word it says.

### Notes

- **Developer decisions taken this push:** **(rr56) TAKEN** — the answer-position re-cut of the eleven earlier scenarios, to run as its own session (the strong move sits at option index 1 in 31 of 42 beats and no checker can see it). **(rr59) NOT TAKEN** — the roster hash stays `clDrillHash_(basis)`, `CLASSROOM-CURRICULUM-PLAN.md` §10.8's amendment stays PROPOSED, and all 314 id→hash pairs are untouched. **(rr22)** — the stranded footer — is left as found, unchanged and still the developer's convention call.
- **Records written:** `PROFILER-SCHEMA.md` ("Registry revision signals" — the amendment and its three outcomes), `C5-SALES-SIMULATIONS-DESIGN.md` §12 item 2 (APPLIED/CLOSED with the read-back evidence), `CLASSROOM-CURRICULUM-PLAN.md` §10.6 **(rr69)** and the register advanced to **(rr70)**, `INTEGRATED-REMEDIATION-PLAN.md` closing note (fourth revision — no open action item remains), and `.claude/rules/industry-guidance.md` (the Freshness-discipline sentence that (rr68) correctly refused to write while the Routine lacked the prompt — it now has it).
- **Checker results:** `check-classroom-curriculum.py --strict` **no structural findings**, 18 stale / 37 additions-only, 0 of 19 segments due, coverage 14 of 14; `check-classroom-content.py` **70 lessons / 8 tracks / 220 gate cases, 0 / 0**; `check-classroom-pipeline.py --selftest` **15 fixtures / 0 failures**; `check-profiler-reports.py` 0 / 0; `sync-profiler-registry.py --check` 0 of 177; `check-readme-tree.py` 0 findings. **No `Classroom.gs` change in this push**, so no GAS version bump and no page bump — the content corpus is byte-identical.
- **CHANGELOG arithmetic:** 107 raw / 98 non-exempt (nine sections carry today's EST date); `Classroomgs.changelog.md` untouched at 46. Neither rotates.

## [v06.64r] — 2026-09-19 03:52:07 PM EST

> **Prompt:** "run the segment regeneration pass, then give me step-by-step instructions on how to write the approval sentence."

### Changed

- **Segment regeneration pass** — `scripts/build-classroom-segments.py --all`, a developer run under curriculum plan §10.4's "cleared in a single developer run whenever convenient". **17 of 19 segment lessons written; `--check` 17 due → 0 due.** The two already-current segments (`power-conversion-and-rack-power-silicon`, `in-hall-power`, regenerated earlier on 2026-09-19 by v06.62r and v06.63r) produced **identical bytes and were not written**, confirming the generator's determinism contract — `--all` is a no-op on an unchanged segment rather than a forced rewrite.
- **Three of the seventeen carried real content drift, not pin dates** — `storage-integrators-and-containers`, `grid-equipment` and `bridge-and-on-site-generation` each reported `sections differing: who-is-connected`, and the change is **DG Matrix entering their connection tables**: the v06.62r session regenerated only its own two segments, so the graph rebuild that added DG Matrix's edges (1,468) left three other segments listing connections that no longer matched the graph. The remaining fourteen were pin-date only (`concepts:profiler-concepts` and `graph:profiler-graph` 2026-09-13 → 2026-09-19, `sections differing: none`).
- **Why this was worth a session rather than a wait** — a standing backlog is not cosmetic: at v05.62r twelve stale segment lessons were failing the content checker's membership assertion at two errors each, so every Classroom commit proved itself against a 24-error baseline. Clearing to 0 restores a zero baseline against which the next real error is visible.

#### `Classroom.gs` — v01.84g

##### Changed

- Curriculum refreshed — every market-structure lesson across the value chain brought up to date with the latest company coverage; three now show a recently covered company in their connection tables (`Classroomgs.changelog.md` 46/50; `Classroomgs.version.txt` |v01.84g|)

### Notes

- **Clone depth** — `git fetch --unshallow origin main` was run before any `--check` or pin read (1,432 commits). The 17-due reading is therefore genuine and not the shallow-clone artifact CLAUDE.md documents, where a boundary commit makes every per-file `git log` return the boundary's date.
- **Rotation arithmetic** — `CHANGELOG.md` 106 raw / 98 non-exempt against a 100 trigger (eight sections carry today's EST date and are exempt); `Classroomgs.changelog.md` 46 raw / 41 non-exempt against 50. Neither rotates. The first push on a later EST day rotates the 2026-09-14 group of twenty.

## [v06.63r] — 2026-09-19 07:19:47 AM EST

> **Prompt:** "profiler novos-power and profiler prep novos-power"

### Added

- **Novos Power dossier (profileVersion 1)** — `live-site-pages/profiler-data/novos-power.profile.json`, schema v7, `intel-briefing` style. Identity verified first (step 1a): **Novos Power Inc.**, Delaware stock corporation, California foreign registration B20250375580 filed 2025-11-07 (bizprofile.net CA SOS mirror — bizfileonline and OpenCorporates blocked; sec.gov/data.sec.gov blocked per `check-source-reachability.py`, efts.sec.gov full-text search answered with **no Form D**); principal office 6386 Alvarado Court S, Suite 200, San Diego (a professional building near SDSU, not an incubator address), mailing/agent address Palo Alto; private, independent, no ticker; co-founders Susan Linwood (CEO, Stanford GSB 2024, prior company ChargePodX) and Chris Mi (CTO, SDSU Distinguished Professor). Two parallel `general-purpose` research subagents — first-party 35 URLs (the four Wix pages, sitemap, eight LinkedIn company posts with dates decoded from activity IDs, YouTube oEmbed, the CTO's SDSU and seminar pages, SDSU AI x Energy Summit pages), third-party ~45 (SemiAnalysis, FedTech/PR Newswire, Connect Foundation/SDIC, LACI cohorts 10–12, three NVIDIA 800 VDC lists, twelve 2026 SST roundups, Google Patents/FreePatentsOnline, efts.sec.gov). What the corpus knew from SemiAnalysis alone ("direct MV-to-800VDC SST with 50% smaller footprint", "peak efficiencies over 98%") checks out as the company's briefing relayed by the analyst — the acknowledgments thank the company — and the "50%" wording traces to a BigGo summary of the piece, not to the text read. **Findings:** one product on the record (VASST) and it exists as claims only — no datasheet, topology, cell count, unit rating, certification target, delivery date, customer, pilot, round, investor or patent (Google Patents: zero filings assigned to Novos Power, none by the CTO on a transformer or air gap); the input range is stated three ways (13–48 kV site, 35 kV July post; 1–50 MW post vs "up to 10 MW" tagline), and 48 kV lies above UL 2877's 38 kV ceiling (UL scope statement fetched); the "DOE/NASA-funded" lineage is the CTO's portfolio (DOE GATE Center, NASA ULI eVTOL grant, CEC battery grants), not an SST project; "incubated by LACI" matches LACI's Cohort 10 entry for **ChargePodX** (the CEO's prior company, whose blurb already carries the MV-AC-to-DC pitch), not any Novos cohort; the Google and Silicon Valley AI Summit awards have no organiser page; Novos is absent from every NVIDIA list and every 2026 SST roundup except SemiAnalysis. One product line, 16 claimed-spec rows, 13 developments (2025-06-17 → 2026-07-02), 7 confidence-tagged key judgments + indicators, 3 competitor relationships (heron-power, amperesand, dg-matrix — SemiAnalysis as source), 2 policy exposures (UL 2877/1741/IEEE 1547; the FedTech defense channel), 4 decision makers (no company-published photos exist — initials avatars), 38 sources (first-party share 8% — the company publishes almost nothing; the dossier says so).
- **Novos Power study guide (schema v2)** — `live-site-pages/profiler-data/novos-power.study.json`, 11 sections: reluctance and the air gap, what a variable gap could do (labelled as the guide's reading — the company has disclosed no mechanism), the load-step arithmetic behind "1000x faster" (table), air cooling at 13–48 kV as an insulation-coordination problem, the technology-readiness ladder for a pre-product company (table), where VASST would slot in, the industry map, the clock (timeline), 12 concept flashcards, 6-item quiz. Cross-refers to the Heron Power guide (cascaded-cell physics), the Amperesand guide (SiC, availability, charging) and the DG Matrix guide (multi-port topology, pulse loads, datasheet literacy, certification) instead of repeating them.
- **Novos Power lesson plan** — `repository-information/study-prep/novos-power/novos-power-lesson-plan.md` (not deployed), eight modules + pacing + sources.
- **Seven concepts registered** in `profiler-concepts.json`: `air-gap`, `control-bandwidth`, `insulation-coordination` (aliases BIL / basic insulation level), `leakage-inductance`, `magnetizing-inductance`, `reluctance`, `technology-readiness-level` (alias TRL) — registry now 1,477 concepts (the alias "stray inductance" was dropped from `leakage-inductance` because `parasitic-inductance` already owns it).
- **Registry, calendar, segments** — `profiler-companies.json` entry (supplier; `aka[]` Novos Power Inc. / Novos Power, Inc. / NovosPower / VASST / Variable Airgap Solid State Transformer / Variable Air Gap Solid-State Transformer; `domains[]` novospower.com); `profiler-refresh-calendar.json` quarterly-cadence row with seven watch items (round/Form D, patent publication from 2027, first hardware evidence, a named pilot, roster placement, certification target and full-time signals, a Chesterton list of the four claims not to import); `profiler-segments.json` membership: `power-conversion-and-rack-power-silicon` **challenger** (basis cites the dossier's `ecosystemRole`; no adjacency — the dossier supports no in-hall, charging or storage product line).

### Changed

- **Corpus reconciliation (step 7)** — the display name and all six `aka[]` entries grepped across every dossier, study guide, lesson plan and `Classroom.gs`: **1 inbound mention** (`amperesand.profile.json`, the 2026-05-26 SemiAnalysis development naming Novos Power in the SST vendor set) — accurate against the new research, **0 dossiers changed**. `check-profiler-crossrefs.py` 440 pairs, 0 candidates.
- **Segment lesson regenerated** (`scripts/build-classroom-segments.py --segment power-conversion-and-rack-power-silicon`): `segment-power-conversion-and-rack-power-silicon` now lists Novos Power in its player table, connections and self-test (changed sections per the generator: read-next, the-fence, the-numbers, the-players, who-is-connected; `profile:novos-power` pinned 2026-09-19).
- **Graph rebuilt** — `profiler-graph.json` 1,481 edges (1,107 curated), 4,318 evidence items; registry synced (`novos-power` srcTotal 38, srcFirstPct 8, segments mirrored).
- **README.md** — tree entries for the two Novos Power data files and the `study-prep/novos-power/` curriculum; Classroom GAS display v01.82g → v01.83g (`check-readme-tree.py --fix`); `Last updated` timestamp.

#### `Classroom.gs` — v01.83g

##### Changed

- Curriculum updated — a market-structure lesson now lists a newly covered company in its segment roster, connections and self-test (`Classroomgs.changelog.md` 45/50; `Classroomgs.version.txt` |v01.83g|)

### Notes

- **Checker results:** `sync-profiler-registry.py` 1 entry updated then `--check` 0 drift, roster/calendar bijection 0 findings; `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates; `check-profiler-study.py` 177 guides + 1,477 concepts, 0/0; `check-classroom-content.py` 70 lessons / 8 tracks / 220 gate cases, 0 errors 0 warnings; `check-classroom-pipeline.py --base origin/main` 10 paths, 9 findings — P1 developer paths (expected) and **P7 ×1** (`updated` did not advance on the regenerated segment lesson — the same-day-regeneration artifact recorded at v06.62r: this lesson was regenerated three times on 2026-09-19; no P3); `--selftest` 15 fixtures / 0 failures; `node --check` OK; `check-gas-inner-scripts.js` 9 files / 86 blocks clean; `check-readme-tree.py` 10 page + 8 GAS displays, 0 findings.
- **CHANGELOG arithmetic:** pushed on 2026-09-19 EST beside v06.57r–v06.62r, so seven sections are exempt today — **105 raw / 98 non-exempt**, no rotation; counter `105/100`. The first push on a later EST day rotates the 2026-09-14 group of twenty.

## [v06.62r] — 2026-09-19 06:22:13 AM EST

> **Prompt:** "profiler and profiler prep dg-matrix. To be clear, I want a dossier + study guide for DG Matrix.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md (Latest Session — the Amperesand run at v06.61r is the template for this one); .claude/rules/profiler-app.md (Profiler Command steps 1–10, esp. 1a identity verification, 5 segments, 7 corpus reconciliation; Profiler Prep Command); repository-information/PROFILER-SCHEMA.md; repository-information/PROFILER-STYLES.md (active style: intel-briefing); .claude/rules/classroom-app.md (segment lessons regenerate when a segment's members move).
>
> UNSHALLOW THE CLONE FIRST — git fetch --unshallow origin main. Read repository.version.txt (v06.61r) for the version to bump from. Run python3 scripts/check-source-reachability.py before planning Stage 2 (sec.gov and data.sec.gov were blocked at v06.61r; efts.sec.gov full-text search answered; businesswire.com returned 403 — read releases from verbatim syndications).
>
> IDENTITY FIRST (step 1a): confirm legal name and HQ (DG Matrix, Raleigh, North Carolina), that it is still independent, CEO and ticker/none, from a dated primary source. What the corpus currently says from trade press only: USD 60M Series A February 2026 led by Engine Ventures with ABB and Mitsubishi Heavy Industries as investors; "first company shipping commercial multiport SST"; named on NVIDIA's GTC 2026 800 VDC roster and in NVIDIA's MGX ecosystem; SemiAnalysis lists it at 98.5%. Verify every one of those before using it.
>
> RESEARCH: two parallel general-purpose subagents — Agent A first-party (dgmatrix.com product/datasheet/news pages, its own releases, its "Insights" posts including the June 2026 "Solid State Transformers Could Reshape AI Infrastructure" piece), Agent B third-party (trade press, SemiAnalysis, mgrid.org, Heatmap, TechCrunch, Canary Media, NVIDIA rosters, any SEC Form D via efts.sec.gov, ABB/MHI investor statements). Products and specs are the priority section: the multiport SST (Power Router?) — input kV, outputs, MW per unit, cell architecture, SiC devices, efficiency, cooling, certifications (UL 2877/1741 status), lead time, shipped/energised units and named customers.
>
> WRITE, one push commit: dg-matrix.profile.json v1 (schema v7, intel-briefing); dg-matrix.study.json (schema v2) + repository-information/study-prep/dg-matrix/dg-matrix-lesson-plan.md — cross-refer to the Heron Power guide (cascaded-cell physics) and the Amperesand guide (silicon carbide, availability, charging) rather than repeating them; own the multiport / multi-input topology and whatever DG Matrix's record uniquely teaches. Registry entry with aka[] and domains[]; quarterly refresh-calendar row; segments: power-conversion-and-rack-power-silicon (role per its dossier) plus any adjacency the dossier supports; relationships[] to covered slugs (heron-power, amperesand, abb, nvidia, eaton, mitsubishi-power/mitsubishi-electric only if the source names the right entity); company-published headshots only. Then: sync-profiler-registry.py, build-profiler-graph.py, check-profiler-relationships.py, check-profiler-crossrefs.py, check-profiler-study.py.
>
> CORPUS RECONCILIATION (step 7): grep every other dossier and study guide for DG Matrix and its aka[] — expect hits in heron-power, amperesand, their study guides and the power-conversion segment lesson — read each and revise the other dossier (archive + profileVersion +1) only where the new research contradicts it; report the counts reviewed and changed.
>
> EXPECT THE CLASSROOM CASCADE: adding a member to a segment fails check-classroom-content.py until you run python3 scripts/build-classroom-segments.py --segment <id> for each segment it joined; bump Classroom.gs VERSION v01.81g → v01.82g and Classroomgs.version.txt together, add a generic section to Classroomgs.changelog.md (43/50 — no rotation due), update the README Classroom GAS display, then check-classroom-content.py (0 errors), check-classroom-pipeline.py --base origin/main (P1 developer paths only, no P3) and --selftest (15/0), node --check on a .js copy, node scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py.
>
> CHANGELOG arithmetic: CHANGELOG.md 103 raw / 98 non-exempt at v06.61r with five sections dated 2026-09-19 — if you push on a later EST day, the 2026-09-14 group of twenty rotates (SHA enrichment, detach the footer first). Normal Pre-Commit and Pre-Push checklists; one push commit; git ls-remote before pushing; end every commit message with the two attribution lines this repo's recent commits carry. Then give me a prompt to paste into a new Fable 5.1 session for the next company, then remember session."

### Added

- **DG Matrix dossier (profileVersion 1)** — `live-site-pages/profiler-data/dg-matrix.profile.json`, schema v7, `intel-briefing` style. Identity verified first (step 1a): DG Matrix Inc., Delaware (SEC CIK 0002059108, Form D 2025-03-06 and 2026-03-04 via efts.sec.gov — metadata only, sec.gov/data.sec.gov blocked per `check-source-reachability.py`); HQ **Morrisville, NC** (951 Aviation Parkway, per the site footer and the Series A dateline — the corpus's "Raleigh" is the metro / registered-agent address, "Cary" the Form D business address); private, independent, no ticker; CEO Haroon Inam. Of the four trade-press claims the brief listed: the USD 60M Series A (Engine Ventures; ABB, MHI, Helios, Fine Structure, MCJ, Sabancı) **verified** from the release and ABB's own 2025 seed release; "first company shipping commercial multiport SST" **partially verified** — company boilerplate, independents say "pre-certification units shipping", no named energised site; **NVIDIA GTC 2026 roster — not verified**: no NVIDIA-published page (May 2025, Oct 2025, Aug 2026 blogs, GTC 2026 press kit, all read) names DG Matrix — only Power Electronics News' list citing "Nvidia's list"; MGX membership rests on the company's releases; SemiAnalysis **verified** as "claims up to 98.5%". Research by two parallel `general-purpose` subagents — Agent 1 first-party (62 sources incl. both Interport Flex spec sheets and nine whitepaper PDFs from the r2.dev asset store; businesswire.com 403 → Yahoo Finance syndications) and Agent 2 third-party (78 sources, 64 read). 84 `sources[]` (first-party share 44%), four product lines (Cell-MV medium-voltage skid dated "2028+" on the CFO's roadmap, Cell-LV pulse-load sidecar, the shipping six-port Interport Flex 200/400 kVA, the fleet-charging Dispenser), 51 banded spec rows (both datasheets verbatim — 96–97% peak efficiency against the "up to 98.5%" platform claim — plus the family tiers and the PEN founder-interview design rows), 23 `recentDevelopments[]` (2025-03 → 2026-09), 7 confidence-tagged key judgments + indicators, 13 `relationships[]` (abb investor, infineon supplier, nvidia other, heron-power / amperesand / eaton / ge-vernova / delta-electronics / hitachi-energy competitors, southern-company via PowerSecure and flexgen partners, schneider-electric and vertiv lineage), 4 `policyExposure[]` entries (UL 1741/2877 certification gap, Section 232, FEOC/domestic content with the reported Lahore footprint, FERC large-load orders), 10 decision makers with eight company-published headshots (`images/execs/dg-matrix-{inam,bhattacharya,wanger,thakkar,singh,sopher,stiller,vlatkovic}.jpg`). MHI's stake is Mitsubishi Heavy Industries, Ltd. — not linked to the `mitsubishi-power` slug, per the brief's "only if the source names the right entity".
- **DG Matrix study guide (schema v2)** — `live-site-pages/profiler-data/dg-matrix.study.json`, 13 sections: ports not windings (the multi-active bridge), power-routing arithmetic (table), 480 V versus 34.5 kV input, GPU pulse loads and the sidecar, reading a converter datasheet (table), the certification path, the behind-the-meter block, where the products slot in, the industry map, the clock (timeline), 12 concept flashcards, 6-item quiz. Cross-refers to the Heron Power guide (cascaded-cell physics) and the Amperesand guide (SiC, availability, charging) instead of repeating them.
- **DG Matrix lesson plan** — `repository-information/study-prep/dg-matrix/dg-matrix-lesson-plan.md` (not deployed), eight modules + pacing + sources.
- **Five concepts registered** in `profiler-concepts.json`: `mgx`, `multi-active-bridge`, `multi-port-sst` (alias "power router"), `pulse-load`, `ul-2877` — registry now 1,470 concepts.
- **Registry, calendar, segments** — `profiler-companies.json` entry (supplier; `aka[]` DG Matrix Inc. / DGMatrix / Interport / Interport 360 / Power Router / Power SideCar / Power Bridge; `domains[]` dgmatrix.com and its r2.dev asset host); `profiler-refresh-calendar.json` quarterly-cadence row with seven watch items; `profiler-segments.json` memberships: `power-conversion-and-rack-power-silicon` **challenger**, `in-hall-power` **adjacent** (basis lines cite the dossier's `ecosystemRole` and the Cell-LV sidecar).

### Changed

- **Corpus reconciliation (step 7)** — 21 inbound mentions of DG Matrix and its aliases reviewed across 5 files (amperesand dossier 15, heron-power dossier 2, both study guides 3, amperesand lesson plan 1); **1 dossier changed**: `amperesand.profile.json` → **profileVersion 2** (v1 archived to `archive/amperesand.profile.v1.json`, `archive-index.json` updated). Three fields had placed DG Matrix on NVIDIA's own October 2025 / GTC 2026 / August 2026 rosters — the 2026-08-11 development headline, key judgment 1 and the `nvidia` relationship context — corrected to: NVIDIA's October 2025 roster names ABB, Eaton, GE Vernova, Heron Power, Hitachi Energy, Mitsubishi Electric, Schneider Electric, Siemens and Vertiv; the August 2026 post names no vendors; DG Matrix and Delta appear only in Power Electronics News' GTC list. A reciprocal `dg-matrix` competitor relationship added. Heron Power's two mentions (competitor list; "ABB also backs DG Matrix") and the study guides' "no shipped fleets" line are accurate and untouched.
- **Segment lessons regenerated** (`scripts/build-classroom-segments.py --segment …`): `segment-power-conversion-and-rack-power-silicon` and `segment-in-hall-power` now list DG Matrix in their player tables, connections and self-tests (changed sections per the generator: read-next, the-fence, the-numbers, the-players, what-moved, who-is-connected, and where-it-sits for in-hall power); `concepts:profiler-concepts` pin 2026-09-13 → 2026-09-19.
- **Graph rebuilt** — `profiler-graph.json` 1,468 edges (1,104 curated), 4,278 evidence items; registry synced (`dg-matrix` srcTotal 84, srcFirstPct 44, segments mirrored).
- **README.md** — tree entries for the two DG Matrix data files, the archived Amperesand v1, and the `study-prep/dg-matrix/` curriculum; Classroom GAS display v01.81g → v01.82g; `Last updated` timestamp.

#### `Classroom.gs` — v01.82g

##### Changed

- Curriculum updated — two market-structure lessons now list a newly covered company in their segment rosters, connections and self-tests (`Classroomgs.changelog.md` 44/50; `Classroomgs.version.txt` |v01.82g|)

### Notes

- **Checker results:** `sync-profiler-registry.py` 0 drift, roster/calendar bijection 0 findings; `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates; `check-profiler-study.py` 176 guides + 1,470 concepts, 0/0; `check-classroom-content.py` 70 lessons / 8 tracks / 220 gate cases, 0 errors 0 warnings; `check-classroom-pipeline.py --base origin/main` 25 paths, 21 findings — P1 ×19 (developer paths outside the committer's write set, expected) and **P7 ×2** (`updated` did not advance on the two regenerated segment lessons — a same-day-regeneration artifact: v06.61r regenerated both earlier on 2026-09-19, so the generator's date is unchanged; no P3); `--selftest` 15 fixtures / 0 failures; `node --check` OK; `check-gas-inner-scripts.js` 9 files / 86 blocks clean; `check-readme-tree.py` 10 page + 8 GAS displays, 0 findings.
- **CHANGELOG arithmetic:** pushed on 2026-09-19 EST beside v06.57r–v06.61r, so six sections are exempt today — **104 raw / 98 non-exempt**, no rotation; counter `104/100`. The first push on a later EST day rotates the 2026-09-14 group of twenty.

## [v06.61r] — 2026-09-19 05:37:35 AM EST

> **Prompt:** "profiler and profiler prep Amperesand. Just to confirm, I want the Profiler dossier as well as the study guide."

### Added

- **Amperesand dossier (profileVersion 1)** — `live-site-pages/profiler-data/amperesand.profile.json`, schema v7, `intel-briefing` style. Identity verified first (step 1a): Amperesand Pte. Ltd. (UEN 202318356C, incorporated 2023-05-11, Singapore) with US subsidiary Amperesand Inc. (Delaware, 2024-12-06); private, independent, no transaction found; CEO is Brian Dow on every dated source from 2025-10-31 (the January 2025 CEO Gary Lawrence left unannounced). Research by two parallel `general-purpose` subagents — Agent 1 first-party (24 company-channel sources; businesswire.com returned 403 so releases were read from verbatim syndications) and Agent 2 third-party (~38 sources; EDGAR reachable via efts.sec.gov with zero Amperesand filings; sec.gov/data.sec.gov blocked per `check-source-reachability.py`). 63 `sources[]`, three product lines (800 V DC AI-factory SST, megawatt/port charging configuration, storage/grid Gen 5), 27-row banded spec table plus a development-lineage table, 17 `recentDevelopments[]` (2025-08 → 2026-09), 6 confidence-tagged key judgments + indicators, 11 `relationships[]` (nvidia, heron-power, liteon, eaton, abb, hitachi-energy, ge-vernova, delta-electronics, schneider-electric, infineon, tesla), 4 `policyExposure[]` entries (Nevada GOED abatements, Section 232 transformer tariffs, UL 2877/1741 certification gap, EU shore-power mandate), 8 decision makers with four company-published headshots (`images/execs/amperesand-{dow,joyner,reznik,bouchet}.jpg`).
- **Amperesand study guide (schema v2)** — `live-site-pages/profiler-data/amperesand.study.json`, 12 sections: the SST as a platform, silicon carbide device classes and cell count (table), megawatt charging and port electrification, five-nines availability arithmetic, bidirectional storage, the 34.5 kV-to-800 V DC hall edge (table), where the products slot in, the industry map, the clock (timeline), 12 concept flashcards, 6-item quiz. Deliberately does not repeat the Heron Power guide's SST physics; cross-refers to it.
- **Amperesand lesson plan** — `repository-information/study-prep/amperesand/amperesand-lesson-plan.md` (not deployed), eight modules + pacing + sources.
- **Five concepts registered** in `profiler-concepts.json`: `availability` (five nines, uptime), `mcs` (Megawatt Charging System, SAE J3271), `partial-discharge`, `shore-power` (cold ironing, OPS), `v2g` (bidirectional charging) — registry now 1,465 concepts.
- **Registry, calendar, segments** — `profiler-companies.json` entry (supplier; `aka[]` Amperesand Inc. / Pte Ltd / SST; `domains[]` amperesand.io, amperesand.com); `profiler-refresh-calendar.json` quarterly-cadence row with seven watch items; `profiler-segments.json` memberships: `power-conversion-and-rack-power-silicon` **challenger**, `in-hall-power` **adjacent** (basis lines cite the dossier's `ecosystemRole` and the UPS-replacement claim).

### Changed

- **`Classroom.gs` v01.80g → v01.81g** — `segment-power-conversion-and-rack-power-silicon` and `segment-in-hall-power` regenerated by `build-classroom-segments.py` (the new member moved the-players, who-is-connected, the-numbers, what-moved, the-fence, read-next, check-yourself; `graph:profiler-graph` re-pinned 2026-09-13 → 2026-09-19; `profile:amperesand` added @2026-09-19). `Classroomgs.version.txt` and the README GAS display follow.
- **`Classroomgs.changelog.md` rotated** — 50 non-exempt sections reached the 50 trigger, so the 2026-09-14 date group (nine sections, v01.30g–v01.38g) moved to `Classroomgs.changelog-archive.md` with SHA enrichment (v05.61r 04a9e26 … v05.78r e0035f8); footer detached first and re-attached; counter `Sections: 43/50` after the new v01.81g section. Post-rotation grep: zero unenriched headers.
- **README** — tree entries for the two data files and the study-prep directory; exec-photo count line corrected to the measured 770 images across 121 companies; Classroom GAS display v01.81g.
- **Graph rebuilt** (`profiler-graph.json`, 1,444 edges / 1,091 curated) and registry synced (`srcTotal` 63, `srcFirstPct` 10 — low because the company's own releases were readable only as wire syndications and its site has five pages; `kpiNorm` false).

### Notes

- **Corpus reconciliation (step 7):** inbound mentions of `Amperesand` and its `aka[]` — 1 dossier (`heron-power`, positioning names it among same-layer competitors) and 1 study guide (`heron-power.study.json`, "startups … hold specifications and factories but no shipped fleets"; timeline "DG Matrix and Amperesand announce capacity"). Both read and both accurate against the new research; 0 changed. `vicor` matched the earlier case-insensitive grep on "amperes", not the company. `check-profiler-crossrefs.py` 0 candidates (10 suppressed); `check-profiler-relationships.py` 0 findings; `check-profiler-study.py` 0/0; `sync-profiler-registry.py` roster/calendar in bijection.
- **Unreconciled figures stated as such in the dossier:** unit rating 4–10 / 5–10 / 6+ / up to 10 MW; lifetime 15+ / 20 / 20–30 years; enclosure IP55 vs IP65; lead time ~22 vs sub-25 weeks; headline claims 10×/80% (Nov 2025) vs 5×/50% (Aug 2026). The USD 30M June 2026 round is third-party only (DealStreetAsia, Hyphen Partners; N47 Services ~USD 13.5M) — recorded with that provenance.
- **Classroom verification:** `check-classroom-content.py` 70 / 8 / 220, 0 errors; `check-classroom-pipeline.py --base origin/main` P1 developer-path findings only, no P3 (gate surface untouched); `--selftest` 15 / 0; `node --check` and `check-gas-inner-scripts.js` clean. `build-classroom-segments.py --check` reports the other seventeen segments due on the graph pin with `sections differing: none` — regenerated deliberately for the two segments whose membership moved, not the seventeen whose only moved input is the graph date.
- **CHANGELOG arithmetic:** 103 raw / 98 non-exempt (five sections dated 2026-09-19), no rotation.
- Field notes: none supplied (the log lives in Drive); the dossier and prep were authored without note context, as the rules provide for an unattended read.

## [v06.60r] — 2026-09-19 05:02:31 AM EST

> **Prompt:** "Run the quarterly-review-Routine APPLY session (design §12 item 2) on Fable 5.1 High as a fresh session. At v06.59r (2026-09-19) the decision session read trig_01CrhxzfBV6uKQNKpUXLLMSZ, quoted its prompt verbatim into C5-SALES-SIMULATIONS-DESIGN.md's §12 annex, drafted the amended prompt there (34 lines / 7,917 chars — a new step 3a that lists, never revises, the scenarios stamped on each revised landscape), proved both of its reads, and STOPPED because the approval slot was blank — (rr66)–(rr67). [DEVELOPER: write here, in your own words, that you approve the in-place change to that Routine's prompt exactly as drafted in the §12 annex. Without this sentence the session must re-read the Routine, confirm the annex still matches it, and STOP without calling update_trigger.] [DEVELOPER: state whether (rr59) — roster hash role + '||' + basis, §10.8 — or (rr56) — re-cutting the eleven earlier scenarios' answer positions — is taken; either is its own session, not this one.]
>
> READ FIRST: repository-information/SESSION-CONTEXT.md (Latest Session); C5-SALES-SIMULATIONS-DESIGN.md §12 item 2 AND its §12 annex (both prompts verbatim); CLASSROOM-CURRICULUM-PLAN.md §10.6 (rr60), (rr66)–(rr67) — you continue at (rr68); INTEGRATED-REMEDIATION-PLAN.md §7 closing note and "The trap in item 6" (the C3 session 3 rule); .claude/rules/industry-guidance.md.
>
> UNSHALLOW THE CLONE FIRST — git fetch --unshallow origin main. Read repository.version.txt (v06.59r) for the version to bump from. Restart your claude/* branch from origin/main; after the auto-merge merges, git fetch --prune origin.
>
> CAPTURE A PRISTINE HEAD BASELINE BEFORE ANY EDIT — expect check-classroom-content.py 0 / 0 at 70 / 8 / 220, module assertion 28; --selftest 15 / 0; build-classroom-segments.py --check 19 / 0; check-readme-tree.py 10 + 8 / 0; --strict no structural findings, 28 stale pins across 51 hand-authored lessons, review items due re-derived on the day, coverage 14 of 14, moved-landscape 0, decks 2,615 / 2,929 and 3,139 / 3,453 against 6000. Measure, do not carry.
>
> THE WORK, one push commit, no .gs and no page: (1) list_triggers — confirm the Routine's live prompt is character-for-character the annex's "prompt as it stands" text and that it has still never fired; if it differs, STOP and report the diff. (2) ONLY with the approval sentence above: update_trigger with trigger_id trig_01CrhxzfBV6uKQNKpUXLLMSZ and prompt = the annex's amended text, and NO other field — never cron, name, model or enabled. (3) Read it back with list_triggers; compare character for character against the annex; confirm same id, same cron 0 13 15 1,4,7,10 *, still enabled, next_run_at still 2026-10-15T13:00Z, run history intact (none). (4) Record it: design §12 item 2 ("APPLIED <date> at vXX.XXr"), the annex header (drop "NOT APPLIED"), §10.6 at (rr68), the IRP closing note (three decisions remain: (rr56), (rr59), the footer), .claude/rules/industry-guidance.md's Freshness-discipline paragraph (add that the Routine now lists scenarios on revised landscapes). Re-derive the rooms-inside-six-weeks count on the day. CHANGELOG.md is at 101 raw / 98 non-exempt: on any EST day after 2026-09-19 your section makes it 99 non-exempt — still under the threshold, so NO rotation unless you count 100 on the day; test the non-exempt count (archive step 1), never the counter. No public changelog line.
>
> DO NOT: author or revise any lesson, module, track or scenario; touch Classroom.gs, Classroom.html, Profiler.gs, Profiler.html or Scraper.gs; change the Routine's schedule, name, model or enabled state; fire the Routine; re-cut the eleven scenarios (rr56); apply the roster-hash amendment (rr59); regenerate any segment.
>
> VERIFY: check-classroom-content.py (220 must not move); check-classroom-pipeline.py --selftest and --base origin/main (P1 on developer paths only — no P2, no P3); check-classroom-curriculum.py --strict; build-classroom-segments.py --check 0 → 0; check-readme-tree.py. Forecast zero Deploy steps; read the job log's "All GAS deploys confirmed the merged version (or none were due)" line.
>
> Normal Pre-Commit and Pre-Push checklists; one push commit; git ls-remote before each push; end every commit message with the two attribution lines this repo's recent commits carry. Findings register at (rr67); continue at (rr68). Then give me a prompt to paste into a new Fable 5.1 session (with recommended effort level) to continue the action plan, then remember session."

### Changed

- **THE QUARTERLY-REVIEW-ROUTINE APPLY SESSION — RE-READ, PROVED UNCHANGED, NOT APPLIED. Fable 5.1 High, one session, one push, no `.gs`, no page, nothing authored, no Routine field touched.** The apply brief's two bracketed `[DEVELOPER: …]` slots — the approval sentence the C3 session 3 rule requires in the session that changes a live Routine, and the (rr59)/(rr56) answer — arrived a second time as their own placeholder text, and a placeholder is "not taken" ((rr62), (rr66)). The brief's fallback for that case governed: `trig_01CrhxzfBV6uKQNKpUXLLMSZ` was read through `list_triggers`, its live `prompt` compared by `json.load` against the design annex's *as it stands* fenced block — **equal, character for character** (27 lines / 4,823 characters; the annex's 4,824 and 7,917 count the fenced block's trailing newline) — no `last_run` and no `last_fired_at` (never fired), `updated_at` 2026-09-16, `next_run_at` 2026-10-15T13:00:20Z, cron `0 13 15 1,4,7,10 *`, enabled. **`update_trigger` was not called.** Nothing was fired, re-scheduled, renamed or re-modelled.
- **`C5-SALES-SIMULATIONS-DESIGN.md`** — §12 item 2 gains a RE-READ / STILL NOT APPLIED record at v06.60r ((rr68)); the annex header keeps NOT APPLIED and notes the re-verification. The annex's two prompt blocks are untouched.
- **`CLASSROOM-CURRICULUM-PLAN.md`** — §10.6 gains **(rr68)**: both slots blank again, the character-for-character proof and its one-character counting convention, the Freshness-discipline edit deliberately not made, and the re-derivation of (rr60)'s count — where a naive first-occurrence regex over `Classroom.gs` returned 19 landscapes with false dates silently (utilities read 2026-12-10, assurance 2027-01-01) before the health script's own `guidance_modules()` parser gave the 28-module truth: five rooms inclusive of 2026-10-31, four strict, unchanged from (rr66). §11's findings line records the session and moves the label to **(rr69)**.
- **`INTEGRATED-REMEDIATION-PLAN.md`** — the §7 closing note's item 2 bullet records the second stop; a third revision of the recommendation (still four decisions open, item 2 still one sentence from applied, the sentence now asked for twice); the findings-register line moves to (rr68) / (rr69).
- **Deliberately unchanged:** `.claude/rules/industry-guidance.md` — the Freshness-discipline sentence the apply brief prescribes would describe a prompt the Routine does not have. `Classroom.gs`, `Classroom.html`, `Profiler.gs`, `Profiler.html`, `Scraper.gs`: untouched.

### Notes

- **Baselines measured at pristine HEAD before any edit and again after, every one matching the brief:** content checker 0 / 0 at 70 / 8 / 220, module assertion 28; `--selftest` 15 / 0; `--base origin/main` nothing to judge at HEAD and P1 on the developer paths only after the edits; `build-classroom-segments.py --check` 19 / 0; `check-readme-tree.py` 10 + 8, 0 findings; `--strict` no structural findings, 28 stale pins across 51 hand-authored lessons, 9 review items due (five scenario lessons + four modules), coverage 14 of 14 with both seats 7 of 7, moved-landscape 0 (ninth consecutive push), pools study 2,169 + lesson 533 + roster 314, decks 2,615 / 2,929 and 3,139 / 3,453 against 6,000.
- **Changelog arithmetic re-counted on the day:** this push landed on 2026-09-19 EST, the same day as v06.57r–v06.59r, so this section is exempt beside those three — **102 raw / 98 non-exempt**, no rotation; the counter reads `102/100` above capacity as archive step 3 allows; **the first push after the day boundary rotates the 2026-09-14 group of twenty sections**. `Classroomgs.changelog.md` untouched at 51 raw / 50 non-exempt.
- **Deploy: zero `Deploy <Project>` steps forecast** — no `.gs` in the diff; the job log's "All GAS deploys confirmed the merged version (or none were due)" line is the record. Classroom stays at v01.80g (deployment 93, 93/200), Scraper v02.20g (165/200), page v01.16w.

## [v06.59r] — 2026-09-19 03:39:30 AM EST

> **Prompt:** "Run the quarterly-review-Routine decision session (design §12 item 2) on Fable 5.1 High as a fresh session. The drill-account-cap decision closed at v06.58r (2026-09-19): CL_DRILL_ACCOUNT_CAP 3,000 → 6,000, Classroom GAS v01.80g deployed (deployment 93, 93/200), the health script printing per-tier decks against the cap, findings (rr61)–(rr65) written. Four decisions remain open and this session takes the only one with a date on it: the quarterly guidance review Routine trig_01CrhxzfBV6uKQNKpUXLLMSZ (cron 0 13 15 1,4,7,10 *, next firing 2026-10-15 13:00 UTC, never yet fired) walks guidanceDocs_() and says nothing about the scenarios stamped on the landscapes it revises; three utilities rooms and the neoclouds room rest on landscapes whose reviewBy dates (2026-10-01 / 2026-09-30) pass two weeks BEFORE that first firing, and scenario-assurance-discovery's on 2026-10-31 — (rr60). [DEVELOPER: state here, in your own words, that you approve an in-place change to that Routine's prompt — the C3 session 3 rule requires explicit approval in the session that makes it. Without that sentence the session must read the Routine, draft the new prompt into the design doc, and STOP without calling update_trigger.] [DEVELOPER: also state whether (rr59) — the roster hash amendment role + '||' + basis, §10.8 — or (rr56) — re-cutting the eleven earlier scenarios' answer positions — is taken; either is its own session, not this one.]
>
> READ FIRST: repository-information/SESSION-CONTEXT.md (Latest Session); C5-SALES-SIMULATIONS-DESIGN.md §12 item 2 and the C3 session 3 rule on Routine changes; CLASSROOM-CURRICULUM-PLAN.md §10.6 findings (rr57)–(rr65) — you continue at (rr66) — and §11's ledger (scenario → landscape → reviewBy); INTEGRATED-REMEDIATION-PLAN.md's §7 closing note ("After C5 — what is left on the programme") and §7.59's STATUS AT CLOSE block; .claude/rules/classroom-app.md; .claude/rules/industry-guidance.md (the Routine's prompt walks the guidance corpus).
>
> UNSHALLOW THE CLONE FIRST — git fetch --unshallow origin main before any measurement. Read repository.version.txt for the version to bump from. Restart your claude/* branch from origin/main; after the auto-merge workflow merges, use git fetch --prune origin.
>
> CAPTURE A PRISTINE HEAD BASELINE BEFORE ANY EDIT — expect check-classroom-content.py 0 / 0 at 70 lessons / 8 tracks / 220 gate cases, module assertion 28; --selftest 15 / 0; build-classroom-segments.py --check 19 / 0; check-readme-tree.py 10 + 8 / 0; --strict no structural findings, 28 stale pins across 51 hand-authored lessons, review items due re-derived on the day, coverage 14 of 14, moved-landscape 0, pools study 2,169 + lesson 533 + roster 314, decks 2,615 / 2,929 and 3,139 / 3,453 against CL_DRILL_ACCOUNT_CAP 6000. Measure, do not carry.
>
> THE WORK, one push commit, no .gs and no page: (1) read the Routine with list_triggers and quote its current prompt verbatim into the design doc before changing anything; (2) draft the amended prompt — the same guidance walk plus: for every landscape it revises, list the scenarios whose provenance stamp names that landscape (read them off Classroom.gs, never a hard-coded list) and report them as needing a developer session, since the pipeline never revises a scenario; (3) ONLY with the developer's approval sentence above, apply it with update_trigger (prompt only — never the cron, name or model) and read it back; (4) record the change (or the drafted-but-not-applied state) in C5-SALES-SIMULATIONS-DESIGN.md §12 item 2, the IRP closing note's decision list (three remain, or four), and §10.6 at (rr66); re-derive the "four rooms inside six weeks" count on the day rather than carrying (rr60)'s. Repo CHANGELOG.md is at 100 raw / 98 non-exempt: on any day after 2026-09-19 EST your section makes it 100 non-exempt, WHICH ROTATES the oldest date group — read CHANGELOG-archive.md step 1, deepen the clone first, detach the footer first (rr15/rr22), dry-run into a copy, read the seams. No public changelog line (no .gs, no page). Classroomgs.changelog.md is untouched at 51 raw / 50 non-exempt — the next GAS push on a later day rotates it, and that is not you.
>
> DO NOT: author or revise any lesson, module, track or scenario; touch Classroom.gs, Classroom.html, Profiler.gs, Profiler.html or Scraper.gs; change the Routine's schedule, name or model; re-cut the eleven scenarios (rr56); apply the roster-hash amendment (rr59); regenerate any segment; fire the Routine.
>
> VERIFY: check-classroom-content.py (220 must not move); check-classroom-pipeline.py --selftest and --base origin/main (P1 on developer paths only — no P2, no P3, since the .gs is untouched); check-classroom-curriculum.py --strict; build-classroom-segments.py --check 0 → 0; check-readme-tree.py before committing. Forecast zero Deploy steps and read the job log's "All GAS deploys confirmed the merged version (or none were due)" line rather than carrying the forecast.
>
> Normal Pre-Commit and Pre-Push checklists; one push commit; git ls-remote before each push; end every commit message with the two attribution lines this repo's recent commits carry. The findings register is at (rr65); continue at (rr66). Then give me a prompt to paste into a new Fable 5.1 session (with recommended effort level) to continue the action plan, then remember session."

### Changed

- **THE QUARTERLY-REVIEW-ROUTINE DECISION — READ, DRAFTED, NOT APPLIED. Fable 5.1 High, one session, one push, no `.gs`, no page, nothing authored.** The brief's two bracketed `[DEVELOPER: …]` slots — the approval sentence the C3 session 3 rule requires in the session that changes a live Routine, and the (rr59)/(rr56) answer — were pasted blank, and a blank is "not taken" ((rr62)): `trig_01CrhxzfBV6uKQNKpUXLLMSZ` was read through `list_triggers` (cron `0 13 15 1,4,7,10 *`, `next_run_at` 2026-10-15T13:00:20Z, `updated_at` 2026-09-16, **never fired**), its prompt quoted verbatim, the amendment drafted, and **`update_trigger` was not called** — the cron, name and model were never candidates. 70 lessons, 8 tracks, 220 gate cases and the module assertion at 28 did not move; `Classroom.gs` is byte-identical to `origin/main`; the pipeline checker reported P1 on the three developer paths and nothing else. Findings **(rr66)–(rr67)** written into `CLASSROOM-CURRICULUM-PLAN.md` §10.6; **the register continues at (rr68)**.
- **`C5-SALES-SIMULATIONS-DESIGN.md` — §12 item 2 records the read-and-drafted state, and a new §12 annex carries the Routine's current prompt verbatim (27 lines, 4,824 characters) and the amended prompt verbatim (34 lines, 7,917 characters) — the exact text a later session passes as `prompt` to `update_trigger` once the developer's sentence is in its brief.** The amendment is three edits: the header parenthetical, a new **step 3a** between the guidance walk's steps 3 and 4, and the closing line. Step 3a makes the run, for every `landscape-*` module it edits, read the scenarios whose provenance stamp names that landscape **off `Classroom.gs` through the content checker's own parser** (a pasted one-liner — never a list carried in the prompt, which would go stale at the next authored room), confirm after the edit that the health script's §6 `landscape moved under it` line names exactly those scenarios, never edit or re-stamp a scenario (design D6 / P13), report the checker's scenario-outlives-landscape warning rather than fix it, and list every affected room in the closing block under `Needs a developer session — scenarios on revised landscapes` (a re-dated-only landscape lists none; an empty list is stated as one). The annex also carries the on-the-day fold of fourteen stamps to nine landscapes with every `reviewBy`, and what applying the amendment does not change — the first firing stays at 2026-10-15.
- **`CLASSROOM-CURRICULUM-PLAN.md` — §10.6 gains (rr66) and (rr67); §11's findings line records the session and moves the label to (rr68).** (rr66): both slots blank, read and drafted, and (rr60)'s count re-derived rather than carried — **five** rooms rest on landscapes reviewing on or before 2026-10-31 (utilities ×3 at 2026-10-01, neoclouds at 2026-09-30, assurance at 2026-10-31), **four** strictly before, and three further landscapes inside the window (cooling 2026-09-28, in-hall-power 2026-10-01, grid-equipment 2026-10-31) carry no room at all. (rr67): the draft's two reads were proved on the day — the one-liner returns fourteen rows, and the moved-landscape line, which had read 0 on eight consecutive pushes because no landscape has been revised since C5, printed exactly the three utilities rooms when `landscape-utilities-2026-09`'s `updated` was bumped 2026-09-14 → 2026-09-20 in the working copy (restored, `git status` clean); a first attempt with a 600-character window found no `updated` at all, (rr64)'s lesson again.
- **`INTEGRATED-REMEDIATION-PLAN.md` — the §7 closing note's item 2 bullet records the read-and-drafted state; the recommendation paragraph gains a v06.59r revision (still four decisions open, item 2 now one approval sentence from applied, the next session the one that applies it); the findings-register line moves to (rr67) / (rr68).** §7.59's STATUS AT CLOSE block and the stranded footer at line 1927 are as they were.

### Notes

- **Baselines measured at HEAD before any edit, every one matching the brief, and re-measured after:** content checker 0 / 0 at 70 / 8 / 220, module assertion 28; `--selftest` 15 / 0; `--base origin/main` P1 ×3 on the developer paths only, no P2, no P3; `build-classroom-segments.py --check` 19 / 0 before and after; `check-readme-tree.py` 10 + 8, 0 findings; `--strict` no structural findings, 28 stale pins across 51 hand-authored lessons, 9 review items due (five scenario lessons + four modules), coverage 14 of 14 with both seats 7 of 7, moved-landscape list 0, pools study 2,169 + lesson 533 + roster 314, decks 2,615 / 2,929 and 3,139 / 3,453 against 6,000.
- **Changelog arithmetic re-counted on the day:** the brief's rotation forecast was conditioned on *any day after 2026-09-19 EST*, and this push landed on 2026-09-19 at 03:39 AM EST — so this section is exempt beside v06.57r's and v06.58r's: **101 raw / 98 non-exempt**, no rotation, the counter reading `101/100` above capacity as archive step 3 allows; **the first push after the day boundary rotates the 2026-09-14 group of twenty sections**. `Classroomgs.changelog.md` untouched at 51 raw / 50 non-exempt — the next GAS push on a later day rotates it, not this one.
- **Deploy: zero `Deploy <Project>` steps forecast** — no `.gs` in the diff; the job log's "All GAS deploys confirmed the merged version (or none were due)" line is the record. Classroom stays at v01.80g (deployment 93, 93/200), Scraper at v02.20g (165/200, the tight one), page v01.16w.
- **The Routine was not fired, not re-scheduled, not renamed.** Its first firing on 2026-10-15 13:00 UTC is unchanged and, until the amendment is applied, will walk `guidanceDocs_()` with the prompt it has — after the utilities and neoclouds review dates and before the assurance one.

## [v06.58r] — 2026-09-19 02:29:14 AM EST

> **Prompt:** "Run the drill-account-cap decision session on Fable 5.1 High as a fresh session. §7.59's carried-items row RAN at v06.57r (2026-09-19) and is closable: item (i) done (the three denial-audit assertions in run_gate_truth_table() run, 217 → 220 gate cases), item (iv) confirmed done at v06.52r, items (ii) and (iii) put to the developer as (rr58) and (rr59). The developer has taken (rr58): raise CL_DRILL_ACCOUNT_CAP from 3,000 to 6,000. [DEVELOPER: also state here whether (rr59) — the roster hash amendment role + '||' + basis in CLASSROOM-CURRICULUM-PLAN.md §10.8 — is taken; if it is, it rides this same GAS push.]
>
> READ FIRST: repository-information/SESSION-CONTEXT.md (Latest Session); CLASSROOM-CURRICULUM-PLAN.md §10.6 findings (rr57)–(rr60) — you continue at (rr61) — and §10.8's PROPOSED AMENDMENT block; CLASSROOM-SCHEMA.md's drill section (the cap paragraph now states the measured numbers); INTEGRATED-REMEDIATION-PLAN.md §7.59's STATUS AT CLOSE block and the §7 closing note; .claude/rules/classroom-app.md; CLASSROOM-COMMITTER-CONTRACT.md §3.1; .claude/rules/changelog-security.md before the public GAS changelog line.
>
> UNSHALLOW THE CLONE FIRST — git fetch --unshallow origin main before any measurement. Read repository.version.txt for the version to bump from. Restart your claude/* branch from origin/main; after the auto-merge workflow merges, use git fetch --prune origin.
>
> CAPTURE A PRISTINE HEAD BASELINE BEFORE ANY EDIT — expect check-classroom-content.py 0 / 0 at 70 lessons / 8 tracks / 220 gate cases, module assertion 28; --selftest 15 / 0; build-classroom-segments.py --check 19 / 0; check-readme-tree.py 10 + 8 / 0; --strict no structural findings, 28 stale pins across 51 hand-authored lessons, review items due re-derived on the day, coverage 14 of 14, moved-landscape 0, pools study 2,169 + lesson 533 + roster 314. Measure, do not carry.
>
> THE WORK, one push commit. (1) Classroom.gs: var CL_DRILL_ACCOUNT_CAP = 3000 → 6000, comment updated to say it is a guard again at roughly 1.7× the largest deck measured (3,453) — that is the ONLY .gs line for (rr58); it is outside the content fence and not a GATE_SYMBOLS member, so P3 must not fire. If (rr59) is taken: one line in clDrillRosterItems_ — the hash input becomes role + '||' + basis — plus the hashIsBasis truth-table assertion in check-classroom-content.py, which asserts the OLD formula and must be re-pointed at the new one; expect the roster probe to show every one of the 314 id→hash pairs MOVED, the opposite acceptance test from every push so far, and say so with the count. (2) scripts/check-classroom-curriculum.py, §4 Drill pool size: replace total drillable today 2702 (CL_DRILL_ACCOUNT_CAP 3000) with per-tier deck totals against the cap — analyst and contributor+, each with and without the roster deck — so the printed comparison is one a real account can hit; the guidance items (gc/gq) are enumerated from guidanceDocs_() sections of kind flashcards/quiz, the same walk clDrillGuidanceItems_ does. Expect 2,615 / 2,929 and 3,139 / 3,453 and state that the health script's figures agree with the ops-path figures in (rr58). (3) CLASSROOM-SCHEMA.md: the cap paragraph's constant and recommendation sentence updated; §10.8's amendment block marked APPLIED or left PROPOSED per the developer's answer; §10.6 findings continue at (rr61). (4) GAS bump v01.79g → v01.80g in Classroom.gs and live-site-pages/gs-versions/Classroomgs.version.txt, the README tree GAS display, a GENERIC public line in Classroomgs.changelog.md ("drill scheduling capacity increased"; never a constant name) — that file is 50 raw / 43 non-exempt, so re-count today's date group before concluding no rotation (rr55). Repo CHANGELOG.md is at 99/100 with 98 non-exempt: your section takes it to 100 raw / 99 non-exempt, which does NOT rotate — read CHANGELOG-archive.md step 1 rather than the counter.
>
> DO NOT: author or revise any lesson, module, track or scenario; touch Classroom.html; change the quarterly review Routine (design §12 item 2 is the developer's approval, separately); re-cut the eleven scenarios (rr56); touch Profiler.gs, Profiler.html or Scraper.gs; regenerate any segment; sweep a date across Classroom.gs.
>
> VERIFY: node --check on a .js copy of Classroom.gs; scripts/check-gas-inner-scripts.js; check-classroom-content.py (220 must not move unless you re-point an assertion, and then decompose); check-classroom-pipeline.py --selftest and --base origin/main (P1 on developer paths and P2 outside the fence are expected for this row; P3 is not — decompose per symbol before refreshing anything); check-classroom-curriculum.py --strict; build-classroom-segments.py --check 0 → 0; check-readme-tree.py before committing. Then the tier test from the real handleClassroomOp_ path: analyst cop=index byte-identical base → head at 42,708 bytes, all fourteen scenarios ROLE_DENIED to an analyst, mechanism pools 446 / 970 identical as id→hash pairs, and the roster deck 314 cards with pairs identical (cap only) or ALL moved (hash amendment taken). The prior session's harness stubs the transport at UrlFetchApp to the repo's own profiler-data/ and declares SPREADSHEET_ID empty; give it a self-test that prints 70 lessons / 14 scenarios / 28 modules before believing any number (ll1).
>
> THE DEPLOY: forecast exactly one Deploy Classroom step and 93/200 against the measured 92/200 at v06.56r (v06.57r fired zero steps); read the job log's deploy confirmed line rather than carrying the forecast. Scraper 165/200 with 35 left is the tight one and is not yours.
>
> Normal Pre-Commit and Pre-Push checklists; one push commit; git ls-remote before each push; end every commit message with the two attribution lines this repo's recent commits carry. The findings register is at (rr60); continue at (rr61). Then give me a prompt to paste into a new Fable 5.1 session (with recommended effort level) to continue the action plan, then remember session."

### Changed

- **THE DRILL ACCOUNT CAP DECISION — TAKEN, RAISED, AND EXERCISED. Fable 5.1 High, one session, one push, no content authored.** `CL_DRILL_ACCOUNT_CAP` **3,000 → 6,000** (Classroom GAS **v01.79g → v01.80g**), the developer taking curriculum plan §10.6 (rr58). 70 lessons, 8 tracks, 220 gate cases and the module assertion at 28 did not move; the pipeline checker reported P1 on the four developer paths and P2 for the one line outside the fence (both its base and head sides), and **no P3** (the constant is not a gate symbol). Findings **(rr61)–(rr65)** written into `CLASSROOM-CURRICULUM-PLAN.md` §10.6; the register continues at **(rr66)**.
- **`googleAppsScripts/Classroom/Classroom.gs` — `var CL_DRILL_ACCOUNT_CAP = 6000;`, the only `.gs` line, with its comment saying the cap counts BOTH decks and is a guard again at ~1.7× the largest deck measured (3,453, contributor + roster deck, 2026-09-19).** Exercised through the real `cop=grade` on an in-memory drill tab rather than asserted from the constant ((rr61)): a contributor who has graded every mechanism card once (3,139 rows) grading a first roster card returns `DRILL_FULL` at base and **succeeds at head**; with the tab filled to exactly 6,000 rows a new card is `DRILL_FULL` again and a known card still grades. `VERSION` v01.80g; `live-site-pages/gs-versions/Classroomgs.version.txt` `|v01.80g|`; the README tree's GAS display to match.
- **`scripts/check-classroom-curriculum.py` §4 — the composite `total drillable today 2702 (CL_DRILL_ACCOUNT_CAP 3000)` is replaced by each tier's deck against the cap, with and without the roster deck: analyst 2,615 / 2,929 and contributor+ 3,139 / 3,453 (lesson 533 + guidance 437 + study 2,169), the same figures the ops path reports in (rr58); `--strict` now flags a deck the cap would refuse** — proved by running it with the constant temporarily at 3,000 (exactly one finding: contributor+ 3,139 exceeds 3,000, the last 139 first grades) and at 6,000 (none). New helpers `js_role_caps()` (reads `CL_ROLE_CAPS` out of the `.gs`) and `guidance_drill_items()` (the `clDrillGuidanceItems_` walk over the registered `guidanceDoc<Name>_()` literals' `flashcards`/`quiz` sections under the same id rule); the lesson half folds each non-scenario lesson's gate through `gate_of` against each role's capabilities. The first draft printed 2,702 back because its registry regex did not survive the comment lines inside `guidanceDocs_()` — fixed, and a registry that cannot be found is now reported on its own line rather than counted as zero ((rr64)).
- **`CLASSROOM-SCHEMA.md` — the cap paragraph now reads 6,000, records that it bound at 3,000 with the measured decks and what was refused, and points at the health script's per-tier line.** **`CLASSROOM-CURRICULUM-PLAN.md`** — §10.6 gains (rr61)–(rr65) and its register pointer moves to (rr66); §10.9's drill-pool bullet records the per-tier line; **§10.8's roster-hash amendment is left PROPOSED** — the brief's placeholder for the developer's (rr59) answer was pasted blank, read as not taken ((rr62)), and the roster probe held at 314 cards / 314 distinct hashes / **0 of 314 pairs moved**, a seventh consecutive push. **`INTEGRATED-REMEDIATION-PLAN.md`** — §7.59's heading and STATUS AT CLOSE block record item (ii) as taken at v06.58r; the §7 closing note's recommendation line now counts **four** open decisions (design §12 item 2, (rr56), the roster hash, the stranded footer) and the register pointer reads (rr65) / (rr66).

### Notes

- **Tier test from the real `handleClassroomOp_` path, harness self-test 70 lessons / 14 scenarios / 28 modules first, 1,750 fetches** (transport stubbed to the repo's own `profiler-data/`): analyst `cop=index` **byte-identical base → head at 42,892 bytes** (not the 42,708 three briefs carried — (rr65): the absolute is harness-shaped, the identity is the test), contributor 57,564 and admin 57,558 identical too; all fourteen scenarios `ROLE_DENIED` to an analyst, served to contributor and admin; mechanism pools **446 / 970** with every id→hash pair identical; roster deck 314 with pairs identical; roster flag off → `{enabled:false}`, on → pool 314, draw 10.
- **Baselines measured at HEAD before any edit, every one matching the brief:** content checker 0 / 0 at 70 / 8 / 220, module assertion 28; `--selftest` 15 / 0; `build-classroom-segments.py --check` 19 / 0 before and after; `check-readme-tree.py` 10 + 8, 0 findings; `--strict` no structural findings, 28 stale pins across 51 hand-authored lessons, 9 review items due, coverage 14 of 14 with both seats 7 of 7, moved-landscape list 0, pools study 2,169 + lesson 533 + roster 314. `node --check` clean on a `.js` copy; `check-gas-inner-scripts.js` 9 files / 86 blocks clean.
- **Changelog arithmetic re-counted on the day ((rr63)):** `CHANGELOG.md` **100 raw / 98 non-exempt** after this section — v06.57r's section is dated today and exempt beside this one — so no rotation; the counter reads `100/100` at capacity and **the first push after the day boundary rotates**. `Classroomgs.changelog.md` **51 raw / 50 non-exempt** after this section against a rule that rotates when the non-exempt count exceeds 50 — no rotation today; **the next GAS push on a later day rotates it** (the 2026-09-15 group, ten sections). `Profilerhtml.changelog.md` 49, not this session's file.
- **Deploy: exactly one `Deploy Classroom` step forecast, 93/200 against the measured 92/200 at v06.56r** — the job log's `deploy confirmed` line is the record, not this forecast. Scraper 165/200 with 35 left remains the tight one and was not touched.

## [v06.57r] — 2026-09-19 02:02:43 AM EST

> **Prompt:** "Run INTEGRATED-REMEDIATION-PLAN.md §7.59's carried-items row on Fable 5.1 High as a fresh session. C5 CLOSED AT v06.56r (2026-09-18) — fourteen scenarios over nine buyer segments, both seats at seven of seven, the corpus at seventy lessons across eight tracks, §11's ledger and the coverage block both at 14 of 14, §7.3 order 9 and §6 at CLOSED, and design §12's eight developer calls each recorded in writing. There is no C5 row left. §7.59's row and the Q plan clock (~2026-12, reports only) are all that remain on the programme.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md (Latest Session); INTEGRATED-REMEDIATION-PLAN.md §7.59 (your brief — THE FOUR ITEMS, sharpest first), the unnumbered closing note at the end of §7 ("After C5 — what is left on the programme"), §7.3 orders 8 and 9, and §6; CLASSROOM-CURRICULUM-PLAN.md §10.6's findings register through (rr56) — you continue at (rr57) — plus §10.8 (the roster deck, because item (iii) is an amendment to it) and §10.9 (the health script, because item (iv) is an edit to it); CLASSROOM-SCHEMA.md's drill section (item (ii) contradicts a paragraph in it); .claude/rules/classroom-app.md; CLASSROOM-COMMITTER-CONTRACT.md §3.1; .claude/rules/changelog-security.md before any public changelog line.
>
> UNSHALLOW THE CLONE FIRST — git fetch --unshallow origin main before any measurement, pin read, --check run, or git log -1 --format=%cs date. Read repository-information/repository.version.txt for the version to bump from, not this prompt. Restart your claude/* branch from origin/main first; after the auto-merge workflow merges, use git fetch --prune origin rather than git fetch origin main, because it adds a [skip ci] SHA-tracker commit.
>
> CAPTURE A PRISTINE HEAD BASELINE BEFORE ANY EDIT. Expect check-classroom-content.py 0 / 0 at 70 lessons / 8 tracks / 217 gate cases with the module assertion at 28; --selftest 15 / 0; build-classroom-segments.py --check 19 / 0; check-readme-tree.py 10 + 8 with 0 findings; --strict with no structural findings, 28 stale pins across 51 hand-authored lessons, 9 review items due, coverage 14 of 14 (both seats 7 of 7), moved-landscape list 0, drill pools study 2,169 + lesson 533 + roster 314 for a drillable total of 2,702 and 42 scenario beats across 14 scenarios not drillable. Measure them yourself — do not carry these numbers.
>
> ITEM (i) IS YOURS AND IT IS THE REASON THIS SESSION EXISTS. In scripts/check-classroom-content.py, run_gate_truth_table() ends `return (len(EXPECTED_GATE) * (1 + len(TIERS))) + len(EXPECTED_INDEX) + cases` at line 1626, and BELOW that return sit three checks that the classroom_capability_denied / classroom_bad_provenance / classroom_not_admitted denials were audit-logged. They are unreachable and always have been, so the audit-trail half of the gate truth table is unverified while the report reads as covering it — re-verified as still open on 2026-09-18. Make them run. EXPECT THEM TO FAIL; that is the point, and it is why this wants its own commit. THE GATE-CASE COUNT IS COMPUTED, NOT LITERAL, so moving these assertions may move 217 — decompose the delta per symbol before you accept it, and say in the CHANGELOG what the new number is made of. If the assertions pass immediately, prove they can fail by mutating the audit path in a copy before you believe them (rr13/ll1).
>
> THE OTHER THREE, AND TWO OF THEM ARE THE DEVELOPER'S. (ii) CL_DRILL_ACCOUNT_CAP is 3,000 and has been binding since C3 session 3 — re-measure a contributor's actual deck today from the real server path rather than carrying the old arithmetic, and bring the developer the number plus a recommendation; CLASSROOM-SCHEMA.md still calls the cap "headroom rather than a limit" against "~2,050 items", which is stale. DO NOT raise the constant yourself. (iii) The roster hash keys on the basis text, so a row whose role moves while its basis does not keeps its schedule — a §10.8 spec amendment; propose it, do not apply it. (iv) The (rr17) health-script adjacency READS AS ALREADY DONE at v06.52r: the script now prints "28 stale pin(s) across 51 hand-authored lesson(s) — segment lessons are NOT counted here" and follows it with the generator's due-count under its own labelled heading. CONFIRM THAT AGAINST §7.59's TEXT AND MARK IT DONE rather than re-doing it.
>
> ALSO PUT TWO DECISIONS TO THE DEVELOPER IN YOUR CLOSING BLOCK, with the measurements behind them. Design §12 item 2 — the quarterly guidance review Routine (trig_01CrhxzfBV6uKQNKpUXLLMSZ) should re-read every scenario stamped on a landscape it revises; it is an in-place prompt change requiring explicit approval, never delete-and-recreate, and four of the fourteen rooms rest on landscapes whose review dates fall inside the next six weeks. DO NOT CHANGE IT YOURSELF. And (rr56) — across the eleven scenarios from C5 sessions 1–4 the answer index is 1 in 29 of 33 beats and 3 in none; session 5's nine were permuted onto three positions including the unused fourth, taking the library to 0:3 · 1:31 · 2:5 · 3:3 across 42 beats. Re-cutting the eleven is mechanical (permute the options, renumber each rationale so the strong move's paragraph leads and the rest follow ascending) but it revises built lessons, so it is the developer's call.
>
> VERIFY: node --check on a .js copy of Classroom.gs; scripts/check-gas-inner-scripts.js; check-classroom-content.py with the gate-case delta decomposed; check-classroom-pipeline.py --selftest and --base origin/main (P1 on the developer paths is expected; a P2 or P3 means you touched the server or a gate symbol — decompose before refreshing anything); check-classroom-curriculum.py --strict; build-classroom-segments.py --check 0 → 0; check-readme-tree.py before committing. Then the tier test from the real handleClassroomOp_ path: the analyst cop=index byte-identical base → head, all fourteen scenarios still ROLE_DENIED to an analyst, and the drill pools 446 / 970 / 314 compared as id→hash PAIRS, not as a set and a multiset separately (rr20). Your session authors no content, so the lesson count must stay at 70 and both decks must not move.
>
> MAKE EVERY CHECK PRINT ITS DENOMINATOR, TRACE THE WHOLE PATH, TEST THE INSTRUMENT, AND DECOMPOSE A SIGNAL BEFORE YOU BELIEVE IT. (ll1): a harness states a number you can verify independently, then you disbelieve everything else until it is right — two stubs produced plausible uniform zeros in session 5 and were caught only that way. (rr17): read the denominator, not only the count. (rr37)/(rr49)/(rr55): a brief can forecast a count, a date or a file state that its own instruction or the governing rule does not produce — re-derive on the day and write what is true. (rr16): grep both plan files for (rr56) before you write (rr57).
>
> DO NOT: author or revise any lesson, module, track, guidance module or scenario; touch Classroom.html unless you find a rendering defect; raise CL_DRILL_ACCOUNT_CAP; change the quarterly review Routine; re-cut the eleven earlier scenarios' answer positions; fix the contract's clStudyNext_ wording silently (rr26); touch Profiler.gs, Profiler.html or Scraper.gs; regenerate any segment or hand-edit a segment-* literal. And NEVER sweep a date across Classroom.gs with a blanket find-and-replace — it holds twenty-eight independently dated guidance modules and seventy lessons.
>
> THE DEPLOY: the §7.19 order. Read Pages first (the gs-versions/*.txt files are static) and the workflow's own deploy confirmed lines from the job log; probe ?op=deploy only if those disagree. v06.56r's job log reads Updated to v01.79g (deployment 92) | 92/200, so 92/200 with 108 left is MEASURED. If you touch Classroom.gs, forecast exactly one Deploy Classroom step and 93/200, then read the log. Scraper 165/200 with 35 left is the tight one and is not yours.
>
> THE CHANGELOG ARITHMETIC — RE-COUNT ON THE DAY, AND READ THE RULE'S BASIS RATHER THAN THE COUNTER. After v06.56r: CHANGELOG.md 98 raw against a 100 trigger, counter Sections: 98/100. Classroomgs.changelog.md reads 50/50 in its counter but the rotation threshold is tested against the NON-EXEMPT count — 43 on the day session 5 ran — so check today's date group before concluding anything (rr55). Profilerhtml.changelog.md 49 and one section from its own rotation; not your file. TZ=America/New_York date '+%Y-%m-%d' beats the harness banner. When you rotate: (rr15)/(rr22) — detach the footer first, check the main file's last line afterwards, dry-run into a copy, read the seams, run the post-rotation grep. tail -1 every file your commit touches.
>
> Normal Pre-Commit and Pre-Push checklists; one push commit; git ls-remote before each push. End every commit message with the two attribution lines this repo's recent commits carry (Co-Authored-By: and Claude-Session:). The findings register is at (rr56); continue at (rr57).
>
> AFTER THIS SESSION the three denial-audit assertions either run and pass or run and have surfaced real failures in the audit path, item (iv) is confirmed done, items (ii) and (iii) are in front of the developer with numbers behind them, and the programme carries only the Q plan clock plus whatever those two decisions become. Say in your handover whether §7.59's row can be closed or whether item (i) opened work of its own.
>
> Then, give me a prompt to paste into a new Fable 5.1 session (with recommended effort level) to continue the action plan, then remember session."

### Changed

- **§7.59'S CARRIED-ITEMS ROW RAN — ONE SESSION, ONE PUSH, NO CONTENT, AND THE ROW CAN BE CLOSED.** Fable 5.1 High. `Classroom.gs` is byte-identical to `origin/main`; 70 lessons, 8 tracks and the module assertion at 28 did not move; both decks unmoved (mechanism 446 / 970, roster 314, every id→hash **pair** identical base → head); the analyst `cop=index` byte-identical at **42,708 bytes**, all fourteen scenarios `ROLE_DENIED` to an analyst and served to a contributor and an admin. Item (i) done, item (iv) confirmed done, items (ii) and (iii) put to the developer with measurements — findings **(rr57)–(rr60)** in `CLASSROOM-CURRICULUM-PLAN.md` §10.6; the register continues at **(rr61)**.
- **`scripts/check-classroom-content.py` — the three denial-audit assertions in `run_gate_truth_table()` now execute (item (i), (rr57)).** They sat below the function's `return` from C1 until this commit and had never run, so the audit-trail half of the gate truth table was unverified while the report counted it. Moved above the return and counted one gate case each: **217 → 220 gate cases**, decomposed as 14 fixtures × (1 fold + 6 tiers) = 98, + 6 index tiers = 104, + `cases` **113 → 116** — the three assertions and nothing else. **They passed immediately**, so the instrument was tested before the pass was believed: **seven mutations** of the audit path in copies of `Classroom.gs` (each of the three `auditLog` calls deleted; the capability detail dropped; the operation name blanked; one result string swapped for another; one denial logged twice) — **7 of 7 caught, each by exactly one error**. The assertions were tightened in the moving: the harness captures the audit entries pushed *during each fail-closed call* (`__deny`) rather than reading the run-wide list, and asserts exactly one entry per denial with the operation name (`gate-t`), the capability (`guidance`) and the role; every failure message prints how many entries were logged during the call and what they were. Measured: the run-wide list holds exactly 3 entries at HEAD, all from the gate calls, so the old `want in out["audited"]` form would also have passed — the audit path was never broken, only never verified. `check-classroom-pipeline.py --base origin/main`: **P1** on the checker path alone (expected for a developer session), no P2, no P3; `--selftest` 15 / 0.
- **`CLASSROOM-SCHEMA.md` — the `CL_DRILL_ACCOUNT_CAP` paragraph now states the measured deck sizes and that the cap binds (item (ii), (rr58)); the constant is untouched.** Re-measured from the real `handleClassroomOp_` path with the transport stubbed to the repo's own `profiler-data/` (1,050 fetches; harness self-test 70 lessons / 14 scenarios / 28 modules): a contributor's mechanism deck is **3,139** (`lc` 253 + `lq` 280 + `gc` 275 + `gq` 162 + `sf` 766 + `ss` 1,403), **3,453** with the roster deck on; an analyst's 2,615 / 2,929. The cap is tested against the account's **whole** row set — both decks share the tab and the check runs before the deck split — so the roster's 314 count against the same 3,000. `stats.pool` from the drill op agrees. Recommendation to the developer: **6,000**, plus a per-tier deck line in the health script, whose `total drillable today 2702 (CL_DRILL_ACCOUNT_CAP 3000)` is a figure no tier's deck equals (it omits the 437 guidance items and the 314 roster cards).
- **`CLASSROOM-CURRICULUM-PLAN.md` §10.8 — the roster-hash amendment written as a proposal, not applied (item (iii), (rr59)).** Hash `role + '||' + basis` so a role moving without its basis re-introduces the card; measured at proposal 314 cards / 314 distinct hashes / pairs unchanged across six consecutive pushes, the role-only case never yet observed; cost stated — the formula is unversioned, so all 314 cards re-key at once for every account that has graded any. **§10.9** records that the (rr17) adjacency fix (item (iv)) landed at **v06.52r** (caf01f9, C5 session 1) — confirmed against §7.59's text and not re-done. **§11**'s findings pointer extended.
- **`INTEGRATED-REMEDIATION-PLAN.md` §7.59 carries its status at close, and the §7 closing note is revised.** The row can be closed; item (i) opened no work of its own. What remains on the programme is five developer decisions and the Q plan clock: design §12 item 2 (the quarterly review Routine `trig_01CrhxzfBV6uKQNKpUXLLMSZ` — read, not changed: cron `0 13 15 1,4,7,10 *`, **next firing 2026-10-15 13:00 UTC, never yet fired**, and its prompt says nothing about scenarios; four rooms rest on landscapes reviewing by 2026-10-01 and a fifth on 2026-10-31 — (rr60)), (rr56) (re-cutting the eleven earlier scenarios' answer positions), the cap (rr58), the hash (rr59) and the stranded footer at line 1927 ((rr22), left as found).

### Notes

- **No rotation on any changelog, and no public changelog line — the commit touches no `.gs` and no page.** `CHANGELOG.md` **99 raw / 98 non-exempt** against a 100 trigger (one section dated today); `Classroomgs.changelog.md` untouched at 50 raw / 43 non-exempt; `Profilerhtml.changelog.md` 49, not this row's file. **Deploy: zero `Deploy` steps forecast** — `Classroom.gs` is unchanged, so the Classroom counter stays at the measured **92/200 with 108 left**; a zero-step deploy is the correct outcome.
- **Baselines measured at HEAD before any edit**, every one matching the brief's forecast: content checker 0 / 0 at 70 / 8 / **217**, module assertion 28; `--selftest` 15 / 0; `build-classroom-segments.py --check` 19 / 0 before and after; `check-readme-tree.py` 10 + 8, 0 findings; `--strict` no structural findings, 28 stale pins across 51 hand-authored lessons, 9 review items due, coverage 14 of 14 with both seats 7 of 7, moved-landscape list 0, drill pools study 2,169 + lesson 533 + roster 314, 42 scenario beats across 14 scenarios not drillable.

## [v06.56r] — 2026-09-18 11:38:22 PM EST

> **Prompt:** "Run C5 session 5 — three scenarios, and C5 closes — on Opus 5 xhigh as a fresh session. **C5 SESSION 4 LANDED AT v06.55r (2026-09-18) WITH NO CODE IN THE COMMIT**, §11 reads **11 of 14**, the corpus stands at **sixty-seven lessons across eight tracks**, `--check` at 0, the roster deck at 314 cards, and the Rehearsal library covers nine buyer segments. **You write no code** — you author §11 rows 12, 13 and 14 **and you close C5**. The design's eleven decisions still stand as written unless the developer has amended one; **recording each of design §12's eight calls as taken or explicitly deferred is your commit's job** (design §11 done-when item 9), and item 2 (the quarterly review Routine) is the developer's, update-in-place with approval only. […the full paste-in brief of `INTEGRATED-REMEDIATION-PLAN.md` §7.64, verbatim: READ FIRST (including §4's `id` rule, because row 13 is the first scenario to need the `-aidc` suffix, and the instruction to open `scenario-capital-objection` and `scenario-neoclouds-discovery` in the rendered app), UNSHALLOW THE CLONE FIRST with the `stargate` / `river-bend-campus` slugs to re-verify (rr39), THE WORK (six numbered items), VERIFY, THE RENDER HARNESS — PATCH THE PROTOTYPE, AND ROUTE THE TRANSPORT, ROW 12 IS AN OBJECTION ROOM AGAINST A PARTY THAT PRICES RATHER THAN BUYS AND ROWS 13 AND 14 ARE GATEKEEPER DISCOVERY ROOMS, THE CONTENT RULES THAT NO CHECKER SEES, AND READ (rr49) AND (rr50) BEFORE YOU SET ANY reviewBy, the denominator/instrument/decompose paragraph with (ll1)/(rr2)/(rr9)/(rr16)/(rr17)/(rr46)/(rr47)/(rr48)/(rr51), DO NOT, THE DEPLOY, THE CHANGELOG ARITHMETIC — RE-COUNT ON THE DAY AND YOU ARE THE SESSION THAT ROTATES, the checklist paragraph, and AFTER THIS SESSION C5 IS CLOSED…] Then, give me a prompt to paste into a new session (with recommended AI model & effort level) to continue the action plan, then remember session."

### Added

- **C5 SESSION 5 — THE LAST THREE SCENARIOS, NO CODE, AND C5 IS CLOSED.** `INTEGRATED-REMEDIATION-PLAN.md` §7.64, Opus 5 xhigh, one push. Corpus **67 → 70 lessons**, 8 tracks unchanged, **`CLASSROOM-CURRICULUM-PLAN.md` §11's ledger reads 14 of 14** with both seats at **7 of 7**. The commit contains no server function, no page, no checker and no track — a `Classroom.gs` content diff of **1,140 insertions and exactly 2 deletions** (the `VERSION` line and the registry's last entry gaining a comma), plus five documents, one version file and a README display. **The pure-authoring signature held for a fourth consecutive session**: 217 gate cases unmoved, module assertion 28, `--selftest` 15 / 0, `gateDigest` untouched, both decks identical pair by pair, analyst index byte-identical.
- **`scenario-insurance-and-risk-transfer-objection`** (`guidance`) — the storage seller at an RFP, opposite the buyer's insurance broker, which **neither buys the battery, nor sets the rate, nor pays the loss**: it works for the buyer, is paid by commission out of the premium, and what it controls is the submission. The objection is a stated insurer requirement — separation between enclosures, independent grid routing — with **no code named behind it**: seven of the firm's own documents across four of its own web properties spanning 2021 to 2026 name no certification body or standard at all, its analysts rate that structural at **high confidence**, and the certifier's dossier records the same absence independently from the other side. Inputs: `profile:marsh-mclennan@2026-09-09` (v1), `guidance:landscape-insurance-and-risk-transfer-2026-09@2026-09-17`. Ten sections, three beats, **19 ledger rows**, `reviewBy` **2026-12-31** — the landscape's bound, because the dossier's only two future day-level dates are an executive compensation vesting date in 2027 and a note maturing in 2036, and its one bearing indicator is month-level and expressly marked unconfirmed.
- **`scenario-utilities-discovery-aidc`** (`guidance`) — the **first scenario to need design §4's `-aidc` suffix**, and the AIDC power seller's prospecting room at the utility that is the gatekeeper of a campus's power. The room is a seam: the counterparty's large-load tariff ladder is approved in **six of the eight states** it has filed in and **governs none of the campus the seller came about**, which sits under a state statute with letters of agreement only, inside a market batch process **paused in August 2026** on a governor's audit directive with a verification report due 10 December 2026. Inputs: `profile:aep@2026-09-03` (v1), `guidance:landscape-utilities-2026-09@2026-09-14`, `project:stargate@2026-09-06`. Ten sections, three beats, **17 ledger rows**, `reviewBy` **2026-10-01** — the landscape's bound, because the nearest gate in its own ledger falls after it; it therefore ships inside its own 30-day horizon with a gold chip on day one, which is design §6's predicted and accepted outcome.
- **`scenario-hyperscalers-and-ai-labs-discovery`** (`guidance`) — the AIDC power seller in discovery with a buyer that is **three different customers at once**: it owns a development platform outright and holds the scope at one campus, pays the full cost of a first-of-kind installation that a utility owns and delivers under that utility's tariff at a second, and signs a per-building recognition agreement about a third party's rent at a third, holding no procurement standing at all. The sharpest fact for this seat is that the group reports **energy-equipment backstops in a different footnote from the lease programme**, and its own dossier warns that a reader who goes to the guarantees footnote for one finds the other. Inputs: `profile:google@2026-09-07` (v9), `guidance:landscape-hyperscalers-and-ai-labs-2026-09@2026-09-16`, `project:river-bend-campus@2026-09-06`. Ten sections, three beats, **20 ledger rows**, `reviewBy` **2026-12-31** — the bound again, because neither the dossier nor the module's indicator table carries a future day-level date anywhere.
- **Three rooms now touch River Bend from three sides and the facts agree across them** — the landlord's room at session 2, the tenant of record's at session 4, and the guarantor's here: 245 MW of critical IT on 330 MW of utility capacity, a fifteen-year triple-net lease worth USD 7.0bn over the base term, no dollar cap disclosed anywhere, no warrants given, and an end user that is not a party to the lease.

### Changed

- **C5 IS CLOSED — `INTEGRATED-REMEDIATION-PLAN.md` §7.3 order 9 and §6 both flipped to CLOSED** with the measured numbers, and all nine of design §11's done-when criteria are met: fourteen scenarios registered inside the content fence with a `guidance` fold; 0 / 0 at 70 lessons / 8 tracks / 217 gate cases with the module assertion at 28; `--selftest` 15 / 0 with P13 in the table and `gateDigest` unchanged; fourteen Rehearsal cards for a contributor and an admin and zero for an analyst, with `cop=lesson` ROLE_DENIED on all fourteen from the real `handleClassroomOp_` path; both decks unmoved as id→hash pairs; the analyst index byte-identical base → head; the coverage block at 14 of 14 with an empty moved-landscape list; the schema, contract and rules amendments landed at session 1; and design §12's eight developer calls each recorded in writing.
- **`C5-SALES-SIMULATIONS-DESIGN.md` §12 — all eight developer calls recorded**, which is done-when item 9 and could only be done by the closing session. Seven are **deferred with the default taken** and each records what the five sessions actually did: the eleven decisions ran unamended; C6 got nothing added; K3 was not built and D7 held on every push; the `stage` vocabulary used five of its six values with **`post-award` never used**, and (rr40)'s card now prints *Discovery · Discovery* on four of fourteen rows; the public changelog named no counterparty; the `clStudyNext_` wording in the contract and the rules file is still uncorrected and still the developer's; and no fifteenth scenario was authored. **Item 2 — the quarterly guidance review Routine — is deferred pending the developer's explicit approval and is the one answer still wanted**, with the recommendation written out: an in-place prompt change so that revising a landscape re-reads every scenario stamped on it.
- **`CLASSROOM-CURRICULUM-PLAN.md` §11** — rows 12–14 flipped to v06.56r, the heading moved to **14 OF 14 BUILT — C5 CLOSED**, a session-5 line added, and the findings pointer extended to (rr52)–(rr56) continuing at (rr57). **`CLASSROOM-SCHEMA.md`**'s Scenario lessons heading now records the layer complete at fourteen; its "planned, not built" pointer was already gone (replaced at session 1) and the grep confirming that is recorded rather than assumed.
- **The strong move's position is now distributed in the three new rooms, and the skew across the older eleven is recorded** — (rr56). Measured across sessions 1–4: the answer index is **1 in 29 of 33 beats**, and **no beat in the library had ever used the fourth slot**. This session's nine were first drafted at index 0 in all nine; they were permuted onto three positions including that unused one and each rationale renumbered to the corpus convention, taking the library to **0:3 · 1:31 · 2:5 · 3:3** across 42 beats. The eleven earlier scenarios are left as built — revising them is a developer call, recorded in the handover.
- **`INTEGRATED-REMEDIATION-PLAN.md` §7.64 marked SPENT, and no §7.65 written.** In its place an unnumbered closing note says what a next session is *for*: §7.59's carried-items row is the only substantive backlog item, and its item (i) was **re-verified as genuinely still open** — the three denial-audit assertions still sit below the `return` in `run_gate_truth_table()` and have never executed, so the audit-trail half of the gate truth table is unverified while the report reads as covering it. Item (iv) reads as already done at v06.52r and should be confirmed rather than re-done.

### Fixed

- **A nested-emphasis defect in one table cell, caught only after the check that was supposed to find it was itself rewritten.** The first emphasis checker stripped well-formed spans in a loop, which cannot detect nesting — the inner span strips first and the outer then looks clean — and it passed a deliberately nested fixture. Rewritten to test each `**…**` span for an inner `*` and each `*…*` span for an inner `**`, it immediately found a real one in a `what-the-record-says` heading. `clFmt`'s bold rule is `\*\*([^*]+)\*\*`, so a nested span renders as literal asterisks.
- **An untraced-number defect in the third room**, caught by the whole-lesson pass rather than by the per-row one: two figures in a `what-the-record-does-not-say` item had no ledger claim carrying them. A ledger row for the reconciliation gap was added, taking that room to 20 rows.
- **Two render/tier harness stubs that failed silently and plausibly** — (ll1) again. The tier harness lacked a stub for the denial path's audit call, so every `cop=lesson` returned an error string that was not `ROLE_DENIED` and all fourteen scenarios read as *not denied* when all fourteen were in fact denied; and the deck comparison treated an id→item **map** as an array. Both were caught because the harness prints `clLessons_().length` first and the number was right while everything downstream was wrong.

### Notes

- **ALL THREE §9 PREMISES WERE WRONG AGAIN — (rr52), (rr53), (rr54) — MAKING TEN RE-DERIVATIONS IN TEN ROWS.** Row 12's put the broker in a seat the whole segment says no broker occupies (*the broker prices*) and built on a standard the counterparty has **never named**, an absence attested twice independently. Row 13's was **true of the counterparty's system and false at the project the same row pins** — a new failure kind, alongside (rr48)'s wrong tense. Row 14's proposed the **same invented qualified-vendor mechanism** the design had already had measured absent for this segment at (rr42), and described one of the buyer's three modes as its model.
- **THE BRIEF SAID THIS SESSION ROTATES THE GAS CHANGELOG, AND THE ROTATION RULE SAYS OTHERWISE — (rr55).** The counter `Sections: 49/50` is the **raw** count; the rotation procedure tests the **non-exempt** count, which excludes today's sections. Measured on the day: 49 raw, **6 dated 2026-09-18**, so **43 non-exempt before and 43 after**. 43 ≤ 50, so **no rotation was due**, and rotating would have moved the 2026-09-14 date group of nine sections for nothing. `CHANGELOG.md` stands at **98** against a 100 trigger.
- **ON THE DAY, `landscape-utilities-2026-09` IS DUE AND NOT OVERDUE.** Its `reviewBy` is **2026-10-01** and this session ran on **2026-09-18** — thirteen days early. Row 13 is bounded by it and ships inside its own 30-day horizon; the review list now reads **9 items**, counted rather than taken from the brief. (rr49) applied a second time: the brief's dated forecasts are forecasts.
- **VERIFICATION, AND THE INSTRUMENT WAS PROVED BEFORE IT WAS BELIEVED.** **56 ledger rows, 84 addresses and 136 distinctive numbers** resolved programmatically against the fetched documents with **0 failures**, plus a whole-lesson pass finding **0 untraced numbers** across the three rooms. The verifier was then proved by injecting **15 fault classes** into copies — a wrong number, an out-of-range index, a wrong `profileVersion`, a wrong stamp pin, a `reviewBy` past the bound, a named person, italic-inside-bold, bold-inside-italic, an untraced number, an authored quotation mark, an unresolvable `{{term}}`, an overstated absence, a bad module section, a bad profile field and a wrong project slug — and **all 15 were caught**. Zero persons named across 1,448 full names, zero attributed quotations, zero authored quotation marks.
- **RENDER AND TIER.** All ten sections of each of the three rendered in order (plus the page's own glossary block), **all nine beats clicked with a deliberately wrong option** so that the page marks the clicked one wrong and the answer right — which proves `a` points where the literal says rather than merely that some button turns green; `why` 1,825–2,059 chars with zero literal asterisks, the section-level `note` on all nine, zero `{{` or `[c:` tokens, zero page errors. Analyst `cop=index` **byte-identical at 42,708 bytes**; contributor and admin delta **added 3, removed 0, changed 0**; pools **446 / 970** and roster **314** with every id→hash pair identical.
- **Both `project:` slugs re-verified against the registry before either stamp was written** — (rr39)'s lesson applied — and both pinned **2026-09-06** off an unshallowed clone (1,400 commits).
- *Recorded, not acted on:* the `utilities` segment registry's basis line for this counterparty reads *eight commission-approved large-load tariffs*, where the dossier and the company's own handout say approval in **six of the eight states filed**. A roster basis line is a reading too.

## [v06.55r] — 2026-09-18 08:00:53 PM EST

> **Prompt:** "Run C5 session 4 — three scenarios, all three gatekeeper rooms — on Opus 5 xhigh as a fresh session. **C5 SESSION 3 LANDED AT v06.54r (2026-09-18) WITH NO CODE IN THE COMMIT**, §11 reads **8 of 14**, the corpus stands at **sixty-four lessons across eight tracks**, `--check` at 0, the roster deck at 314 cards, and the Rehearsal library covers six buyer segments with both modes for three of them. **You write no code** — you author §11 rows 9, 10 and 11. The design's eleven decisions still stand as written unless the developer has amended one; none of design §12's eight calls has been taken, and item 2 (the quarterly review Routine re-reading scenarios stamped on a revised landscape) is the developer's, update-in-place with approval only. […the full paste-in brief of `INTEGRATED-REMEDIATION-PLAN.md` §7.63, verbatim: READ FIRST (with §5 row 3 twice, because two of three rows are `discovery` mode), UNSHALLOW THE CLONE FIRST, THE WORK (five numbered items), VERIFY, THE RENDER HARNESS — PATCH THE PROTOTYPE AND ROUTE THE TRANSPORT, ALL THREE OF YOUR ROOMS ARE GATEKEEPER ROOMS SO DRAFT what-the-record-does-not-say FIRST, THE CONTENT RULES THAT NO CHECKER SEES, AND READ (rr45) BEFORE YOU SET ANY reviewBy, the denominator/instrument/decompose paragraph with (ll1)/(rr2)/(rr9)/(rr16)/(rr17)/(rr41)/(rr42)/(rr43)/(rr37), DO NOT, THE DEPLOY, THE CHANGELOG ARITHMETIC, the checklist paragraph, and AFTER THIS SESSION…] Then, give me a prompt to paste into a new session (with recommended AI model & effort level) to continue the action plan, then remember session."

### Added

- **C5 SESSION 4 — THREE SCENARIOS, NO CODE, AND THE PURE-AUTHORING SHAPE HOLDING FOR A THIRD SESSION.** `INTEGRATED-REMEDIATION-PLAN.md` §7.63, Opus 5 xhigh, one push. Corpus **64 → 67 lessons**, 8 tracks unchanged, **`CLASSROOM-CURRICULUM-PLAN.md` §11's ledger reads 11 of 14** (storage-seller 6 of 7, aidc-power-seller 5 of 7). The commit contains no server function, no page, no checker and no track — a `Classroom.gs` content diff plus `var VERSION`, four documents, one version file and a README display. All three rooms are **gatekeeper rooms**, where the counterparty sits between a vendor and a signature rather than signing itself.
- **`scenario-capital-objection`** (`guidance`) — the storage seller in a negotiation with the infrastructure fund that has agreed to buy the platform it sells to, and which does not buy equipment: the fund's own file says vendors reach it through its portfolio companies, the word *battery* appears once in the whole dossier as an asset class, and the acquisition is **signed and not closed**. What the desk controls instead of a purchase order is the approved-vendor file and the definition of what the asset is worth on exit. Inputs: `profile:brookfield@2026-09-06` (v2), `guidance:landscape-capital-2026-09@2026-09-16`, `profile:aypa-power@2026-09-06` (v2). Ten sections, three beats, **22 ledger rows**, `reviewBy` **2026-10-14** — affiliate special meetings that change the entity names behind the transaction, and **the first review date in C5 governed by a scenario's own ledger rather than by its landscape's bound**.
- **`scenario-assurance-discovery`** (`guidance`) — the same seat on a shortlist, in front of the engineering firm that holds both the owner's-engineer and the independent-engineer seat and will not volunteer which one it is in: the market's description of the second seat is that it is selected by the lender and paid by the developer. The room turns on the firm's own four-pillar storage due-diligence method, reviewed as one integrated scope, and on a warranty warning conditioned on operating limits. Inputs: `profile:sargent-lundy@2026-09-05` (v2), `guidance:landscape-assurance-2026-09@2026-09-17`. Ten sections, three beats, **22 ledger rows**, `reviewBy` **2026-10-31** — the landscape's own bound, because the dossier carries no future day-level date at all, with the reason recorded as an analysis row.
- **`scenario-neoclouds-discovery`** (`guidance`) — the AI-data-centre power seller's first substantive call with a counterparty of record at six sites who owns almost none of them: at one campus the landlord pays for the generators and the substation, and at another the company's own project site says it is paying for all of the energy infrastructure. The room is the split, and the close is that the guarantor standing behind every lease is not on risk during construction. Inputs: `profile:fluidstack@2026-09-06` (v2), `guidance:landscape-neoclouds-2026-09@2026-09-16`. Ten sections, three beats, **19 ledger rows**, `reviewBy` **2026-09-30** — where the nearest gate in the ledger and the landscape's bound are the same date read off the same document. **The first `challenger` counterparty since session 2.**
- **Findings (rr46)–(rr51)** in `CLASSROOM-CURRICULUM-PLAN.md` §10.6; the register continues at **(rr52)**.
- **`INTEGRATED-REMEDIATION-PLAN.md` §7.64** — the paste-in brief for C5 session 5 (§11 rows 12, 13, 14: `marsh-mclennan` objection, `aep` discovery, `google` discovery), **the session that closes C5**, written in both halves with its closing checklist: §7.3 order 9 and §6 to CLOSED, the coverage block to 14 of 14, any remaining "planned, not built" pointer removed, each of design §12's eight developer calls recorded as taken or deferred, and `Classroomgs.changelog.md` rotated at its cap.

### Changed

- **`CLASSROOM-CURRICULUM-PLAN.md` §11** — rows 9, 10 and 11 flipped to `v06.55r`, the heading to **11 OF 14 BUILT**, a session-4 paragraph added, and the findings pointer moved to (rr52).
- **`INTEGRATED-REMEDIATION-PLAN.md`** — §7.63 marked **SPENT**, §6's C5 row and §7.3 order 9 moved to **11 of 14 / 4 done**, both naming §7.64 as the session that closes C5.
- **Classroom GAS v01.77g → v01.78g**, its version file, the public GAS changelog (generic line, no counterparty named — P11) and the README tree GAS display.

### Fixed

- **Three design §9 premises corrected against the record before a word was authored** — (rr46), (rr47), (rr48) — which makes **seven re-derivations in seven rows**. Row 9's three named questions (*warranty backing, the IE report, the counterparty's credit*) have **no address at all** in the counterparty's dossier: seven separate term searches each returned zero. Row 10's list named a degradation curve, a named edition and a test report, none of which the dossier contains — and the dossier **positively records the absence**, which turned out to be a better room than the premise proposed. Row 11's premise was **right about the shape and wrong about the tense**: the counterparty stopped being only a lessee in July 2026, and the same file carries both answers to who buys the power equipment, split by site.
- **The brief's own dated forecast corrected rather than repeated** — (rr49). §7.63 stated that one segment landscape's review date *"is probably past when you run"* and instructed this session to write in the changelog that the module is **overdue**. It is not: the date is **2026-09-30** and the session ran on **2026-09-18**, twelve days ahead of it. The module is **due within the 30-day horizon, not overdue**, and the dictated sentence would have been false.
- **The person-name scanner's surname pass corrected with a traced stoplist** — (rr51). It produced 21 findings and zero true positives; six ordinary English words are the last capitalised token of a real `decisionMakers[]` entry elsewhere in the corpus, and one is an artefact of a board **list** stored in a `name` field. Each was traced to its source before exclusion, and the full-name pass — the load-bearing one — excludes nothing.

### Verified

- **Content checker 0 errors / 0 warnings at 67 lessons, 8 tracks, 217 gate cases**, module assertion **28** — **the gate-case count did not move**, the pure-authoring signature now measured three consecutive sessions.
- **`--base origin/main` signature as forecast:** P13 ×3 and P10 on the content edit, P1 on the developer paths, and **no P2, P3, P5, P6, P7 or P8** — `gateDigest` untouched. `--selftest` **15 / 0**; `build-classroom-segments.py --check` 19 segments, 0 due; `check-readme-tree.py` 10 page + 8 GAS displays, 0 findings.
- **Health script:** no structural findings, **28 stale pins across a hand-authored denominator moving 45 → 48** (the count did not move, the denominator did), coverage **11 of 14**, the "landscape moved under it" list **0**, scenario beats **33 across 11 scenarios** and still not drillable, drillable total still **2,702**, and the review-due list at **8** — counted on the day rather than taken from the brief.
- **Tier test from the real `handleClassroomOp_` path:** analyst `cop=index` **byte-identical** base → head; the contributor and admin delta decomposing to **exactly the three new cards, 0 removed and 0 changed**; all **eleven** scenarios served to a contributor and an admin and `ROLE_DENIED` to an analyst on `cop=lesson`; drill pools **446 / 970 / 314** with every id→hash pair identical.
- **Ledger verification, with the instrument proved before it was believed:** **63 ledger rows, 99 addresses and 101 distinctive numbers resolved programmatically against the fetched records, 0 failures**; five injected fault classes (a wrong number, an out-of-range index, a wrong profile version, a wrong stamp pin and a review date past the bound) each caught; and a whole-lesson pass confirming **0 untraced numbers** anywhere in the three rooms.
- **Content rules no checker sees:** **1,448 full names and 1,268 surnames** scanned from every dossier's `decisionMakers[]` with **zero persons named**; zero attributed quotations, zero authored quotation marks, zero nested emphasis, zero `[c:` tokens, and every `{{term}}` resolving to a local glossary entry.
- **Render:** all ten sections of each of the three, **all nine beats clicked**, `why` 1,688–2,084 characters with **zero literal asterisks**, the section-level `note` on all nine, zero `{{` or `[c:` tokens in `#cl-app`, zero page errors, and two beats read in the image.
- **No rotation on any changelog.** `CHANGELOG.md` **97** against a 100 trigger, counter `Sections: 78/100`; `Classroomgs.changelog.md` **49** against a cap of 50 — **session 5 reaches 50 exactly and rotates**; `Classroomhtml.changelog.md` **16**. **`Profilerhtml.changelog.md` 49 / 49 — one section from its own rotation and not this row's file.**

## [v06.54r] — 2026-09-18 04:30:22 PM EST

> **Prompt:** "Run C5 session 3 — three scenarios, the first two set at named projects — on Opus 5 xhigh as a fresh session. **C5 SESSION 2 LANDED AT v06.53r (2026-09-18) WITH NO CODE IN THE COMMIT**, §11 reads **5 of 14**, the corpus stands at **sixty-one lessons across eight tracks**, `--check` at 0, the roster deck at 314 cards, and the Rehearsal library carries both modes for the two principal buyer classes. **You write no code** — you author §11 rows 6, 7 and 8. The design's eleven decisions still stand as written unless the developer has amended one; **none of design §12's eight calls has been taken**, and item 2 (the quarterly review Routine re-reading scenarios stamped on a revised landscape) is the developer's, update-in-place with approval only. […the full paste-in brief of `INTEGRATED-REMEDIATION-PLAN.md` §7.62, verbatim: READ FIRST, UNSHALLOW THE CLONE FIRST, THE WORK (five numbered items), VERIFY, THE RENDER HARNESS, THE CONTENT RULES THAT NO CHECKER SEES, the denominator/instrument/decompose paragraph with (ll1)/(rr2)/(rr9)/(rr16)/(rr17)/(rr35)/(rr38)/(rr39)/(rr37), DO NOT, THE DEPLOY, THE CHANGELOG ARITHMETIC, the checklist paragraph, and AFTER THIS SESSION…] Then, give me a prompt to paste into a new session (with recommended AI model & effort level) to continue the action plan, then remember session."

### Added

- **C5 SESSION 3 — THREE SCENARIOS, NO CODE, AND THE PURE-AUTHORING SHAPE HOLDING FOR A SECOND SESSION.** `INTEGRATED-REMEDIATION-PLAN.md` §7.62, Opus 5 xhigh, one push. Corpus **61 → 64 lessons**, 8 tracks unchanged, **`CLASSROOM-CURRICULUM-PLAN.md` §11's ledger reads 8 of 14** (storage-seller 4 of 7, aidc-power-seller 4 of 7). The commit contains no server function, no page, no checker and no track — a `Classroom.gs` content diff plus `var VERSION`, four documents, one version file and a README display: **1,131 insertions and exactly 2 deletions in the `.gs`**, both of them the VERSION line and the registry's last entry gaining a comma.
- **`scenario-utilities-discovery`** (`guidance`) — the storage seller's prospecting work on the Southeast's regulated gatekeeper, before any meeting exists: three lanes buy the same equipment (owned-and-operated under the utility's own supply agreements, purchased power where the counterparty picks the hardware, and a 500 MW solicitation a developer bids), the owned lane is larger than the solicited one by an order of magnitude, and the buyer's own file says the purchasing decisions were taken a year or more before the certificate. Inputs: `profile:southern-company@2026-09-05` (v2), `guidance:landscape-utilities-2026-09@2026-09-14`. Ten sections, three beats, **18 ledger rows (12 fact / 6 analysis)**, `reviewBy` **2026-10-01** — an Alabama statute's effective date, which is also the landscape's own review date, so it ships inside its 30-day horizon with a gold chip on day one. The first `prospecting`-stage room in the library.
- **`scenario-hyperscalers-and-ai-labs-objection`** (`guidance`) — the AI-data-centre power seller on a shortlist at the Hyperion campus, against the segment's characteristic answer: every battery attached to this buyer's load sits on somebody else's balance sheet, three of them inside a utility package whose megawatts the buyer does not publish and one owned by a pipeline company and tolled — and the campus itself is held in an eighty-twenty joint venture with third-party debt and a residual guarantee. The exception is in the same record and dated. Inputs: `profile:meta@2026-09-06` (v9), `guidance:landscape-hyperscalers-and-ai-labs-2026-09@2026-09-16`, `project:hyperion@2026-09-06`. Ten sections, three beats, **18 ledger rows (12 fact / 6 analysis)**, `reviewBy` **2026-12-31** — the landscape's own, because the segment carries no future day-level date.
- **`scenario-epc-and-construction-objection`** (`guidance`) — the same seat in a negotiation over two Lighthouse buildings carrying a combined 468 MW inside a fifty-fifty joint venture, where the package was specified at preconstruction and bought open-book, and where the segment's own measurement is that the builder usually does not hold the purchase order at all. Inputs: `profile:turner-construction@2026-09-06` (v8), `guidance:landscape-epc-and-construction-2026-09@2026-09-16`, `project:lighthouse@2026-09-06`. Ten sections, three beats, **18 ledger rows (10 fact / 8 analysis)**, `reviewBy` **2027-03-16** — the landscape's own bound, because the ledger's only future dated gate falls beyond it, with the reason recorded as a ledger row.
- **Both `project:` pins read 2026-09-06 off an unshallowed clone**, and both slugs were verified against `profiler-projects.json` before either stamp was written — (rr39) applied rather than repeated.
- **Findings (rr41)–(rr45)** in `CLASSROOM-CURRICULUM-PLAN.md` §10.6; the register continues at **(rr46)**.
- **`INTEGRATED-REMEDIATION-PLAN.md` §7.63** — the paste-in brief for C5 session 4 (§11 rows 9, 10, 11: `brookfield` objection, `sargent-lundy` discovery, `fluidstack` discovery), written in **both halves**.

### Changed

- **`CLASSROOM-CURRICULUM-PLAN.md` §11** — rows 6, 7 and 8 flipped to `v06.54r`, the heading to **8 OF 14 BUILT**, a session-3 paragraph added, and the findings pointer advanced to (rr46).
- **`INTEGRATED-REMEDIATION-PLAN.md`** — §7.62 marked **SPENT**, §6's C5 row and §7.3 order 9 moved to **8 of 14 / 3 done**, both naming §7.63 as next.
- **Classroom GAS v01.76g → v01.77g**, its version file, the public GAS changelog (generic lines, no counterparty named — P11) and the README tree GAS display.

### Fixed

- **Three design §9 premises corrected against the record before a word was authored** — (rr41), (rr42), (rr43). Row 6's *before an RFP exists* is false in both halves (two solicitations were live; the room is the lane count). Row 7's *qualified-vendor set* appears nowhere in `meta` v9 and could not have been ledgered, while the same file carries the dated counter-example to the objection it supports. Row 8's *guaranteed maximum price* is absent from `turner-construction` v8, whose model is open-book sourcing at preconstruction — and *the codes* is absent by construction, because that dossier is the only one of the three with no `policyExposure[]` at all. **Six re-derivations in six rows.**
- **One ledger address corrected before commit** by the verification script rather than by eye: a campus's acreage and completion year were cited to two fields that did not contain them, and the `recentDevelopments[]` entry that does was added to the row.

### Verified

- **Content checker 0 errors / 0 warnings at 64 lessons, 8 tracks, 217 gate cases**, module assertion **28** — **the gate-case count did not move**, the pure-authoring signature measured for a second consecutive session. `--selftest` **15 fixtures / 0 failures**. `build-classroom-segments.py --check` **19 segments, 0 due**. `check-readme-tree.py` 10 page + 8 GAS displays, 0 findings. `node --check` and `check-gas-inner-scripts.js` clean.
- **`--base origin/main` signature as forecast:** P1 on the developer paths, P12 until the version file was bumped, P13 ×3 and P10 — and **no P2, P3, P5, P6, P7 or P8**, so `gateDigest` is untouched.
- **Health script `--strict`:** no structural findings, **28 stale pins across 45 hand-authored lessons** (the count held while the denominator moved 42 → 45), coverage **8 of 14**, moved-landscape list **0**, review list **6** — the five carried plus `scenario-utilities-discovery` at 2026-10-01, counted rather than taken from the brief.
- **Tier test from the real `handleClassroomOp_` path:** the analyst `cop=index` **byte-identical** base → head; the contributor delta decomposing to exactly the three new cards and nothing else; all **eight** scenarios `ROLE_DENIED` to an analyst on `cop=lesson` and served to a contributor; drill pools **446 / 970** and the roster deck **314** with **every id→hash pair identical**.
- **Ledger verified programmatically:** **54 rows, 91 addresses and 205 distinctive numbers resolved against the fetched documents, 0 failures**, plus all eight stamp pins and all three `reviewBy` bounds re-checked. **Zero persons named** (1,447 full names and 1,295 surnames from every dossier's `decisionMakers[]` scanned), zero attributed quotations, zero scare quotes and zero nested emphasis.
- **Rendered in the real page** from fixtures generated by the real server path: all ten sections of each of the three, **all nine beats clicked**, `why` 1,393–1,597 characters with **zero literal asterisks**, the section-level `note` rendering on all nine, zero `{{` or `[c:` tokens in `#cl-app`, and zero page errors.
- **No rotation on any changelog.** `CHANGELOG.md` **96** against a 100 trigger, counter `Sections: 78/100`; `Classroomgs.changelog.md` **48** against a cap of 50; `Classroomhtml.changelog.md` **16**. **`Profilerhtml.changelog.md` 49 / 49 — one section from its own rotation and not this row's file.**

## [v06.53r] — 2026-09-18 02:39:03 PM EST

> **Prompt:** "Run C5 session 2 — three scenarios against machinery that already exists — on Opus 5 xhigh as a fresh session. **C5 SESSION 1 LANDED AT v06.52r (2026-09-18): the machinery is built and proved by mutation**, §11 reads **2 of 14**, the corpus stands at **fifty-eight lessons across eight tracks**, `--check` at 0, the roster deck at 314 cards, and the Rehearsal library carries one scenario per seat. **You write no code** — you author §11 rows 3, 4 and 5. The design's eleven decisions still stand as written unless the developer has amended one; **none of design §12's eight calls has been taken**, and item 2 (the quarterly review Routine re-reading scenarios stamped on a revised landscape) is the developer's, update-in-place with approval only. […the full paste-in brief of `INTEGRATED-REMEDIATION-PLAN.md` §7.61, verbatim: READ FIRST, UNSHALLOW THE CLONE FIRST, THE WORK (five numbered items), VERIFY, THE RENDER HARNESS, THE CONTENT RULES THAT NO CHECKER SEES, the denominator/instrument/decompose paragraph with (ll1)/(rr36)/(rr2)/(rr9)/(rr16)/(rr32)/(rr33)/(rr34)/(rr35), DO NOT, THE DEPLOY, THE CHANGELOG ARITHMETIC, the checklist paragraph, and AFTER THIS SESSION…] Then, give me a prompt to paste into a new Opus 5 xhigh session to continue the action plan, then remember session."

### Added

- **C5 SESSION 2 — THREE SCENARIOS, NO CODE, AND THE PURE-AUTHORING SHAPE PROVED.** `INTEGRATED-REMEDIATION-PLAN.md` §7.61, Opus 5 xhigh, one push. Corpus **58 → 61 lessons**, 8 tracks unchanged, **§11's ledger reads 5 of 14** (storage-seller 3 of 7, aidc-power-seller 2 of 7). The commit contains no server function, no page, no checker and no track — a `Classroom.gs` content diff plus `var VERSION`, four documents, two version files and a README display.
- **`scenario-storage-developers-and-ipps-discovery`** (`guidance`) — the storage seller's first meeting with a merchant ERCOT owner that is four-for-four with one integrator, has no named offtaker anywhere in its file, no sponsor, and two permitted projects in a second market whose equipment the regulator's own record says is not yet selected. Inputs: `profile:spearmint-energy@2026-09-05` (v1), `guidance:landscape-storage-developers-and-ipps-2026-09@2026-09-14`. Ten sections, three beats, **20 ledger rows (12 fact / 8 analysis)**, `reviewBy` **2027-01-01** — the material-assistance ratio step, which is also the landscape's own review date.
- **`scenario-utilities-objection`** (`guidance`) — the storage seller in a supplier-qualification meeting two weeks before a regulated franchise's annual purchase solicitation issues, where the objection is a standard rather than a preference: the commission decides what may be recovered, and the buyer's last clean-energy petition asked for two storage projects and was allowed one. Inputs: `profile:dominion-energy@2026-09-03` (v1), `guidance:landscape-utilities-2026-09@2026-09-14`. Ten sections, three beats, **16 ledger rows (10 fact / 6 analysis)**, `reviewBy` **2026-10-01**.
- **`scenario-aidc-developers-and-landlords-discovery`** (`guidance`) — the AI-data-centre power seller in a first meeting on a financed, under-construction campus where the landlord is the only party in the room and the lease has three signatures against four actors, with a buffering statement made about the company's *other* campus on a different grid. Inputs: `profile:hut-8@2026-09-06` (v2), `guidance:landscape-aidc-developers-and-landlords-2026-09@2026-09-15`, `project:river-bend-campus@2026-09-06` (last commit on the base revision, unshallowed clone). Ten sections, three beats, **18 ledger rows (10 fact / 8 analysis)**, `reviewBy` **2026-12-10** — the grid operator's audit report, bounded by the landscape's own 2026-12-15.
- **Both modes now exist for the two principal buyer classes**, and the first `discovery`-mode scenarios exercise design §5's two mode-dependent rows for the first time: `the-position` carries what the record does *not* settle in the order a good conversation would take it, and `what-the-record-does-not-say` is the question list rather than the assert-nothing list.

### Changed

- **`repository-information/CLASSROOM-CURRICULUM-PLAN.md` §11** — rows 3, 4 and 5 flipped to **v06.53r**, the heading from "NOT BUILT" to "5 OF 14 BUILT", a session-2 line recording the three `reviewBy` dates and the one mechanism-lesson substitution, and the findings pointer moved to **(rr41)**.
- **`repository-information/INTEGRATED-REMEDIATION-PLAN.md`** — §6 and §7.3 order 9 moved to "5 of 14, three Opus sessions left, the next briefed in §7.62"; §7.61 marked **SPENT**; **§7.62 written in both halves** — the brief for session 3 (rows 6, 7, 8: `southern-company` discovery, `meta` objection, `turner-construction` objection), the first two of which are project-set rooms whose `project:` pins must be dated off an unshallowed clone.
- **Classroom GAS v01.75g → v01.76g**, `Classroomgs.version.txt` to match, a generic public changelog entry naming no counterparty, and the README tree GAS display. **The page stays at v01.16w** — nine beats and three full renders found no rendering defect, so design §7's "sessions 2–5 touch the page only if one is found" holds.

### Notes

- **Measured, with every denominator.** `check-classroom-content.py` **0 errors / 0 warnings at 61 lessons / 8 tracks / 217 gate cases** — the gate-case count is **unchanged**, which is the pure-authoring signature: it is computed as `(14 × 7) + 6 + 113` and moves only when a fixture or an assertion is added. Module assertion **28 — untouched**. `--selftest` **15 / 0**. `--strict`: no structural findings, **28 stale pins** with the hand-authored denominator moving **39 → 42**, coverage **5 of 14**, moved-landscape list **0**. `build-classroom-segments.py --check` **0 → 0**. `check-readme-tree.py` **10 page + 8 GAS, 0 findings**.
- **The tier test, from the real `handleClassroomOp_` path, instrument first (ll1).** The harness printed `clLessons_().length` = **61** at head and **58** at base before any other number was read. Contributor, admin and admin-by-permission: **61 index ids each, all five scenario cards, `cop=lesson` OK on all five**. Analyst: **48 ids, zero scenario cards, `ROLE_DENIED` on all five**, and its `cop=index` payload **byte-identical base → head**. Viewer: denied on both. The contributor and admin deltas were **decomposed (rr2)**: strip exactly the three new cards from head and the payload is byte-identical to base. Drill pools **970** (contributor and admin) / **446** (analyst) and the roster deck **314**, with **every id→hash pair identical** base → head at every tier (rr20), and **zero items from any scenario at any tier**.
- **Read in a real browser, every beat of all three.** Playwright against the real page and the real `.gs` region, transport stubbed at `_gasPost` with a fixture map generated by running `handleClassroomOp_` in Node: all ten sections render in order for each scenario, **all nine beats show exactly four options**, clicking a losing option marks it `wrong` and reveals the intended answer as `right` in every one, the rationale renders at 1,313–1,462 characters with **zero literal asterisks**, the **section-level `note` renders on all nine** (rr32), the ledgers render at 5,777–6,695 characters, and there are **zero `{{` or `[c:` tokens** anywhere in the rendered app. Zero page errors.
- **Content discipline, verified rather than asserted.** All **54** ledger addresses resolved programmatically — profile slug, `profileVersion`, field name, array index, project slug and the `fact`/`analysis` tail — **0 failures**; and then **every distinctive number in every `fact` claim was checked against the text of the field it cites — 70 numbers, 0 misses.** **Zero persons named** (all 37 `decisionMakers[]` names across the three dossiers were scanned for, as full names and as surnames; only titles appear), **zero attributed quotations** beyond five short phrases the dossiers themselves quote and the ledger rows say so, **zero `[c:id]` tokens**, and the renderer-accurate micro-markup check clean. Two scare-quoted phrases the author had written were converted to italics before commit, because a reader cannot distinguish an author's device from an attributed quotation and D4 turns on that distinction.
- **Checker signature on this push:** **P1 ×2** (the two plan documents), **P12** (until the version file was bumped), **P13 ×3** and **P10** (three new lessons against a cap of 1 — P10 counts a scenario as a module, (rr36)). **No P2, no P3, no P5, no P6, no P7, no P8** — the forecast for a session that touches no server function, met exactly. `gateDigest` unchanged at `sha256:3d09700026d2…`.
- **The utilities scenario ships with an amber chip on day one, by design and not by accident.** Its `reviewBy` of 2026-10-01 is simultaneously the nearest dated gate in its own ledger (the counterparty's annual purchase solicitation issues that day) and the landscape's own review date, so the checker's "later than the landscape's" warning is silent and the health script's review list correctly reads **5 items due** rather than 4. Design §6 predicted this outcome in terms; §7.61's VERIFY line forecast 4 — **(rr37)**.
- **Findings (rr37)–(rr40)** written into `CLASSROOM-CURRICULUM-PLAN.md` §10.6: a brief can forecast a count that the same brief's own instruction moves; design §9 row 4's "IRP → CPCN → RFP" conflates the purchase lane with the build-and-own lane, and the difference is what beat 1 turns on; "four parties" is four actors and three signatures, and the project slug the brief named is not the one the registry carries; and the four-tile rule prints the same word twice on a `discovery` scenario at the `discovery` stage, which four of the nine remaining rows will also do — recorded rather than fixed, because the tile order and the stage vocabulary are the developer's §12 item 5.


## [v06.52r] — 2026-09-18 05:40:30 AM EST

> **Prompt:** "Run C5 session 1 — the machinery and the first two scenarios — on Opus 5 xhigh as a fresh session. **THE FABLE 5.1 xhigh C5 DESIGN SESSION HAS RUN (v06.51r, 2026-09-18)**: the design is `repository-information/C5-SALES-SIMULATIONS-DESIGN.md`, the ledger you flip is `CLASSROOM-CURRICULUM-PLAN.md` §11, and the corpus stands at **fifty-six lessons across eight tracks**, `--check` at 0, the roster deck at 314 cards. **The design's eleven decisions are proposed, not approved — if the developer has amended any of them, apply the amendment; if they have said nothing, proceed on them as written (design §13's last paragraph says how to adapt if D3, D6 or D10 is overturned mid-session).** §7.59's carried-items row is still open and is not yours; the two rows do not block each other. […the full paste-in brief of `INTEGRATED-REMEDIATION-PLAN.md` §7.60, verbatim: READ FIRST, UNSHALLOW THE CLONE FIRST, THE WORK (nine numbered items), VERIFY, THE RENDER HARNESS, THE CONTENT RULES THAT NO CHECKER SEES, the denominator/instrument/decompose paragraph, DO NOT, THE DEPLOY, THE CHANGELOG ARITHMETIC, the checklist paragraph, and AFTER THIS SESSION…] Then, give me a prompt to paste into a new Opus 5 xhigh session to continue the action plan, then remember session."

### Added

- **C5 SESSION 1 — THE SIMULATION LAYER EXISTS, AND THE ASSERTION THAT KEEPS IT OUT OF THE DECKS IS PROVED BY MUTATION.** `INTEGRATED-REMEDIATION-PLAN.md` §7.60, Opus 5 xhigh, one push. A **scenario** is now a first-class lesson kind: `type: "scenario"` with a required five-field `scenario` block (`mode` · `seat` · `segment` · `counterparty` · `stage`), ten fixed section ids, three `quiz` beats, a claims ledger, **no `CL_LESSON_SCHEMA_VERSION` bump** (design D2 — additive fields only, and a bump would have `BLOCKED` every pipeline run through contract §5.1 step 4). Corpus **56 → 58 lessons**, 8 tracks unchanged, **§11's ledger reads 2 of 14**.
- **`scenario-storage-developers-and-ipps-objection`** (`guidance`) — the storage seller, second on a two-vendor shortlist, against an incumbency of one supplier across the fleet under twenty-year service agreements, a fence the buyer's own record has not answered, and a signed-but-unclosed change of control. Inputs: `profile:aypa-power@2026-09-06` (v2), `guidance:landscape-storage-developers-and-ipps-2026-09@2026-09-14`, `profile:canadian-solar@2026-09-06` (v4). Ten sections, three beats, **17 ledger rows (11 fact / 6 analysis)**, `reviewBy` **2027-01-01** — the material-assistance ratio step, which is also the landscape's own review date.
- **`scenario-aidc-developers-and-landlords-objection`** (`guidance`) — the AI-data-centre power seller, in an RFP at a landlord whose campus has published a zero-emission commitment naming battery storage and named **no supplier against it** anywhere in its record. Inputs: `profile:vantage@2026-09-06` (v9), `guidance:landscape-aidc-developers-and-landlords-2026-09@2026-09-15`, `project:lighthouse@2026-09-06` (last commit on the base revision, unshallowed clone). Ten sections, three beats, **19 ledger rows (12 fact / 7 analysis)**, `reviewBy` **2026-12-15** — bounded by the landscape's own, since a scenario cannot outlive the judgment it rests on.
- **`scripts/check-classroom-content.py` — the scenario is checked end to end.** The `type` enum widens; the five-field block is validated against its three enums, `profiler-segments.json` (segment registered; counterparty an `incumbent` or `challenger` member) and the profile files; `SCENARIO_SECTION_IDS` fixes the ten ids and their kinds; each beat must carry `intro`, exactly one item, exactly four choices, an in-range `a`, a non-empty `why` and a **section-level `note`**; the stamp must carry `profile:<counterparty>` and a registered `guidance:landscape-<segment>-YYYY-MM`, may carry no `report:`/`corpus:`/`briefing:` ref, and **the computed fold must equal `guidance`**; `reviewBy` later than the landscape's warns. `gate_of` — the Python copy of the server's fold — now lives here as the single copy, and the health script imports it rather than keeping its own.
- **The truth table gained a scenario and the D7 assertion.** A new `scenario-stamp` fixture folds to `guidance`; a scenario lesson with the ten section ids joins the index registry, and one carrying **both** drillable section kinds joins the drill registry. Asserted per tier: the fold and its six visibilities, the ten section ids admitted by `clProgressValid_` for the tiers that read it and nothing for those that do not, **zero drill items from a scenario at every tier**, and — the control that makes that zero a measurement rather than an empty set — the same fixture **visible** to those tiers with a **non-empty** pool (ll1). Card keys are now asserted per lesson: `scenario` present on the scenario's card and **absent from every other card**.
- **`scripts/check-classroom-pipeline.py` — P13, scenario discipline.** A pipeline diff that **adds** a `type: scenario` literal, **changes** one in any byte, or **removes** one fails. Byte-level rather than meaning-level, because unlike P8 there is no honest revision this could be half of. Two negative fixtures (one authors a scenario, one revises one written into the base), taking `--selftest` from **13 to 15 fixtures, 0 failures**.
- **`scripts/check-classroom-curriculum.py` — "6 · Rehearsal coverage".** Per seat and buyer segment against §11's fourteen ledger ids read out of the plan itself, plus the "landscape moved under it" list — any scenario whose landscape `updated` is later than its pin, which is the human-refresh trigger the no-pipeline-authoring rule depends on. Reads **2 of 14** (storage-seller 1 of 7, aidc-power-seller 1 of 7) with an empty moved-list.
- **`Classroom.html` — the Rehearsal library.** A `🎭 Rehearsal` masthead slot behind `clCan('guidance')` (**no new capability** — the stamp is the gate and a parallel gate is forbidden), `#rehearse` grouping the cards seat → segment with a sentence per seat from curriculum plan §10.10, `#rehearse/<id>` rendering through `clRenderLesson` unchanged with a back link to the library, a `.cl-badge.scenario` type strip, the `Scenario · <mode> · <counterparty>` header case, and a third index partition so a scenario no longer lands among the loose modules.

### Changed

- **`clDrillLessonItems_` skips `type: scenario`** — one line, design D7. Every scenario is about one named counterparty and the mechanism deck's contract is "never company trivia".
- **`clLessonCard_` emits the `scenario` block, conditionally** — see (rr30). The design said the server change was one line; its own library spec needs seat, segment, mode, counterparty and stage on the card, and `clLessonCard_` emitted none of them. The field is emitted **only when present**, so no other card's bytes move and the analyst-index invariant holds.
- **`repository-information/classroom-pipeline-ledger.json`** — `gateDigest` refreshed `sha256:f568052fa2fb…` → `sha256:3d09700026d2…` in the same commit as the change that moved it, per the developer obligation in `.claude/rules/classroom-app.md`. **Decomposed first (rr9): exactly 1 of the 32 `GATE_SYMBOLS` moved** — `clLessonCard_` — and the other 31 are byte-identical. `coveredThrough` and `lastRun` untouched.
- **`CLASSROOM-SCHEMA.md`** — the "planned, not built" pointer is gone, replaced by a built **Scenario lessons** section: the block's rows, the fixed sections and kinds, the beat shape with the `note`-is-a-section-field rule, the stamp-fixes-the-gate rule, and a fourth bullet in the content contract saying a scenario drills nothing. The `type` row now reads `module · briefing · scenario`.
- **`CLASSROOM-COMMITTER-CONTRACT.md`** — §3.1 permitted edit 1 gains "never a `type: scenario` literal"; §4.4 gains "a scenario literal is never touched by the committer"; §7 gains the **P13** row; the counts move to thirteen assertions and fifteen fixtures; and the "Planned at the C5 design gate" note becomes "Settled at C5 session 1 — in force", carrying forward the one thing that is still the developer's: §4.4's `clStudyNext_` wording, which (rr26) showed is wrong and which this session did **not** fix silently.
- **`.claude/rules/classroom-app.md`** — the P13 row in the assertion table, a scenario bullet in the content contract, and the two assertion counts.
- **`CLASSROOM-CURRICULUM-PLAN.md` §11** — rows 1 and 2 flipped to **v06.52r**, the machinery line flipped with its two recorded departures from the design, and the findings pointer moved to (rr37).

### Notes

- **Measured, with every denominator.** `check-classroom-content.py` **0 errors / 0 warnings at 58 lessons / 8 tracks / 217 gate cases**, module assertion **28 — untouched**. The gate-case count moved **192 → 217** and decomposes as `(len(EXPECTED_GATE) 14 × (1 + len(TIERS) 6)) + len(EXPECTED_INDEX) 6 + cases 113` = **98 + 6 + 113**: **+7** for the new fixture (its fold plus six per-tier visibilities) and **+18** in `cases` (6 scenario-tickable, 6 drill-zero, 6 (ll1) positive controls). `--selftest` **15 / 0**. `--strict`: no structural findings, **28 stale pins across 39 hand-authored lessons**, **4 items due**, coverage **2 of 14**. `build-classroom-segments.py --check` **0 → 0**. `check-readme-tree.py` **10 page + 8 GAS, 0 findings** (run with `--fix` for the two Classroom displays, then re-verified clean).
- **The D7 mutation fired, with no survivor.** Removing the one-line exclusion made the checker fail on three tiers with **two items each** (`lq:…:beat-1:0` and `lc:…:f-scn:0`); restoring it returned 0 errors. No second guard, so (rr13) did not apply — and the positive control proves the fixture was readable with a non-empty pool, so the zero is a measurement.
- **The tier test, from the real `handleClassroomOp_` path.** Contributor, admin and admin-by-permission: **58 index ids each, both scenario cards, `cop=lesson` OK on both**. Analyst: **48 ids, zero scenario cards, `ROLE_DENIED` on both**, and its `cop=index` payload **byte-identical base → head**. Viewer: nothing, as before. **Zero stray `scenario` keys on any non-scenario card at any tier.** Drill: mechanism **970** (contributor and admin) / **446** (analyst) — identical to base — with **zero items from a scenario at every tier**; roster **314** with every id→hash pair identical (rr20). The admin and contributor index deltas were **decomposed (rr2)**: strip the two scenario cards from head and the payload is byte-identical to base, so nothing else moved.
- **Read in a real browser, and it found a defect no checker could.** Playwright against the real page and the real `.gs` region, transport stubbed at `_gasPost`: the library, both scenarios end to end, every beat clicked open to read the rendered `why` and `note`, **zero page errors**. The `note` on all six beats had been written inside `items[0]`, where the schema allows it and the renderer never looks — invisible in JSON, in every checker and in the diff. Fixed on all six and turned into two assertions (rr32).
- **Checker signature on this push:** **P1** (five developer paths), **P2** (the two server functions, both below `// CONTENT END` — fired **by construction** for a session the brief itself told to edit `clDrillLessonItems_`; the brief's "no P2" forecast was wrong, (rr31)), **P3** (the gate surface moved, decomposed to one symbol and refreshed), **P10** (two new lessons against a cap of 1 — P10 counts a scenario as a module, unreachable in a real run because P13 refuses first, (rr36)), and **P13 ×2** — the assertion working exactly as forecast. **No P5, P6, P7, P8 or P12.**
- **Findings (rr30)–(rr36)** written into `CLASSROOM-CURRICULUM-PLAN.md` §10.6: the card had to carry the block and the analyst invariant is why it is conditional; a brief can forecast "no P2" while mandating an edit that fires it; `note` is a section field; **(rr29)'s parenthetical is wrong** — the AIDC landscape names *both* seats, so row 2 was written straight off its own play; the health report's drill total silently stopped matching the server's; **the design's "four-way GC bench" is three GC entities on four buildings**, per the counterparty's own dossier, and the correction is what beat 3 turns on; and two harness stubs produced uniform, plausible, wrong zeros in one session.
- **Content discipline, verified rather than asserted.** All **25** `fact`-row field references resolved programmatically against the fetched dossiers at the stated `profileVersion` — **0 failures**. **Zero persons named** (both dossiers' `decisionMakers[]` names were scanned for; only titles appear), **zero quotations**, **zero `[c:id]` tokens**, and the renderer-accurate micro-markup check clean. The ledgers run 17 and 19 rows against the design's "eight to fifteen" — **deliberate**: the binding rule is that every premise in sections 1–3 has an address, and trimming would have removed addresses, not prose.
- **Versions and deploy.** `repository.version.txt` **v06.51r → v06.52r**; `Classroom.gs` `VERSION` and `Classroomgs.version.txt` **v01.74g → v01.75g**; `Classroomhtml.version.txt` and the page's `<meta build-version>` **v01.15w → v01.16w**. Forecast: **exactly one `Deploy Classroom` step**, taking the counter from a measured **87/200** to **88/200** — to be confirmed from the job log rather than taken. Scraper (165/200) and Profiler untouched.
- **No rotation on any changelog.** This push lands on **2026-09-18 EST**, so that day's sections stay exempt: `CHANGELOG.md` **94 raw / 90 non-exempt** against a 100 trigger with **four** same-day sections, counter `Sections: 78/100`; `Classroomgs.changelog.md` **46 raw / 43 non-exempt** against a cap of 50; `Classroomhtml.changelog.md` **16 / 14**. **`Profilerhtml.changelog.md` 49 / 49 — one section from its own rotation and not this row's file.** Both public changelog entries are generic and name no counterparty, no lesson title and no ref (P11 passed).
- **§7.61 written in both halves** — C5 session 2, rows 3, 4 and 5 (`spearmint-energy` discovery, `dominion-energy` objection, `hut-8` discovery), as pure authoring against machinery that exists: **58 → 61 lessons, the gate-case count unchanged at 217, coverage 2 → 5 of 14**, and **none of design §12's eight developer calls taken as of this push**.

## [v06.51r] — 2026-09-18 04:14:39 AM EST

> **Prompt:** "Picking up from my last session, run the Fable 5.1 xhigh C5 design session — it is the only thing unblocking five Opus sessions."

### Added

#### `repository-information/C5-SALES-SIMULATIONS-DESIGN.md`

- **THE C5 DESIGN GATE — SALES SIMULATIONS — RAN ON FABLE 5.1 xhigh, AND THE OPUS LANE IS UNBLOCKED.** `INTEGRATED-REMEDIATION-PLAN.md` §7.3 order 9's one design session, briefed by §7.59 as the single highest-value next action. Fourteen sections: what C5 is and is not (§1); the corpus measured on the day (§2 — 174 dossiers, **147 with `policyExposure[]` / 596 entries**, **1,362 relationships / 62 project-pinned** on nine projects, 19 landscapes, 19 segments / 314 memberships, nine buyer segments for the two seats); **eleven decisions, each with what it rejects and what it costs** (§3); the schema (§4); the ten-section template (§5); the stamp, gate and review-date rule (§6); the Rehearsal surface and the one server change (§7); the checker extensions (§8); a **fourteen-scenario inventory over nine buyer segments and two seats** with premises and counterparties (§9); a worked example against `aypa-power` v2 and the developers landscape (§10); done-when (§11); the developer's open calls (§12); the five-session plan (§13); findings (rr23)–(rr29) (§14)
- **The decisions, in one line each — all PROPOSED for the developer's approval before authoring session 1.** D1 a lesson with `type: "scenario"` inside the content fence (not a prefix-only module, not a third content family, not a guidance module); D2 additive, **no `CL_LESSON_SCHEMA_VERSION` bump** (a bump would `BLOCKED` every pipeline run at contract §5.1 step 4); D3 **contributor by construction** — the stamp must carry the segment's landscape so the fold is `guidance`, no `report:` input, never analyst, never admin-only; D4 the customer-language rule for G12 — paraphrased positions the record supports, no quotations unless the dossier quotes, **the counterparty is a role, never a person**; D5 fact and analysis separate in the ledger; D6 **the unattended pipeline never authors or revises a scenario** (P13); D7 no drill items; D8 never a track member or study-next target; D9 ten fixed section ids with three `quiz` beats; D10 fourteen scenarios, unit = buyer segment × seat × mode; D11 all five sessions on Opus 5 xhigh including session 1's machinery
- **Nothing built.** No lesson, track, module, dossier, guide, report, checker, page or `.gs` touched; `Classroom.gs` and `Classroom.html` unchanged, so no page or GAS bump and **zero `Deploy` steps** forecast for this push

### Changed

#### `repository-information/CLASSROOM-CURRICULUM-PLAN.md`

- **§11 added — the simulation layer's ledger**: the fourteen scenario rows (id · seat · segment · mode · proposed counterparty · session · built), the machinery line, the flip rule, the done-when in short; **§10.1** one sentence naming the rehearsal as the third cross-cutting feed (designed, not built); **§10.6** findings **(rr23)–(rr29)** — the unit is not "per segment" (nine of nineteen segments are buyers), `IMPROVEMENT-PLAN.md` §5's admin-only premise inverted under measurement and its counts are stale by more than double, the schema-bump assumption versus the schema's own rule 2 and the `BLOCKED` pre-flight that decided it, `clStudyNext_` walks tracks only while two developer files say registry-then-tracks, `clRenderIndex` already partitions by `type`, project-pinned relationships concentrate 45 of 62 on three projects, the seat split is explicit in six of nineteen landscapes; **§9** one revision-log row

#### `repository-information/INTEGRATED-REMEDIATION-PLAN.md`

- **§6 C5 row → Design Done — v06.51r; authoring OPEN, 0 of 14**; **§7.3 order 9** rewritten to say the design has run and what it decided; **§7.60 written in both halves** — the paste-in brief for C5 session 1 (the machinery through three checkers, the one-line drill exclusion, the Rehearsal library, the contract/schema/rules amendments, and §11 rows 1–2: `aypa-power` objection and `vantage` objection), with the measured baselines, the mutation acceptance test, the deploy counter (87/200 → forecast 88) and the changelog arithmetic. §7.59's carried-items row stays open and is not blocked by C5. The stranded `Developed by:` footer at line 1927 **(rr22)** was left exactly as found — the developer's convention call

#### `repository-information/CLASSROOM-SCHEMA.md` · `repository-information/CLASSROOM-COMMITTER-CONTRACT.md`

- A **"planned, not built"** blockquote above the content contract pointing at the design's §4 (the third `type`, the five-field block, no bump — the `type` row widens when session 1 lands); a **"Planned at the C5 design gate — not yet in force"** note at the end of the contract naming the three edits session 1 makes (§3.1 item 1, §4.4, §7 P13) and confirming §5.1 step 4 is unaffected

#### `README.md`

- Tree entry for `C5-SALES-SIMULATIONS-DESIGN.md` (alphabetical, before `CHANGELOG.md`); the `CLASSROOM-CURRICULUM-PLAN.md` description now names §11; `Last updated:` and repo version
- **Verification, all measured before and after with nothing moving:** `check-classroom-content.py` **0 errors / 0 warnings at 56 lessons / 8 tracks / 192 gate cases**, module assertion 28; `check-classroom-curriculum.py --strict` no structural findings, 28 stale pins, 4 review items due; `check-classroom-pipeline.py --selftest` 13 / 0 and `--base origin/main` P1 on the plan documents only — **no P3**, `gateDigest` untouched; `build-classroom-segments.py --check` **0 due**; `check-readme-tree.py` 10 page + 8 GAS displays, 0 findings; `tail -1` on every touched file. **No changelog rotation** — `CHANGELOG.md` **93 raw / 90 non-exempt** on 2026-09-18 EST against a 100 trigger, counter `Sections: 78/100`; no page or GAS changelog touched

## [v06.50r] — 2026-09-18 02:13:44 AM EST

> Run the segment-lesson regeneration pass on Opus 5 xhigh as a fresh session. K2 IS CLOSED at v06.49r and Phase 4 is CLOSED at 26 of 26 — the corpus stands at fifty-six lessons across eight tracks with a second, opt-in deck of 314 company cards beside the mechanism deck. This is the static maintenance pass: one --all run of scripts/build-classroom-segments.py over the nine due segments, which clears 28 stale (planned) renders and takes --check from 9 to 0. It authors no lesson, no track, no guidance module, no dossier and no report; it writes only generated literals; it touches no gate symbol. WHY THIS AND NOT C5 OR THE Q CLOCK: C5 opens with a design session which the standing model rule puts on Fable 5.1 xhigh, and the Q plan clock is next due ~2026-12. AND THE TIMING IS THE REAL ARGUMENT, SO RE-MEASURE IT FIRST — the roster deck reads the-players directly and its content hash is the basis text, so a regeneration that moves a player row's basis re-introduces that card; measured at v06.49r the nine due segments differ on read-next and what-is-bought-and-on-what ONLY, so a regeneration today moves ZERO roster cards, and that window closes at the next dossier push. Confirm it in one command before running anything and read the sections differing list rather than the count. UNSHALLOW THE CLONE FIRST — §8 item 2 and G2 make git log -1 --format=%cs the PIN SOURCE, so the generator itself writes a wrong date off a shallow clone. RE-DERIVE WHAT THE PASS CLEARS, DO NOT CARRY IT. THE WORK — one push commit: (1) --check before anything and forecast the after-number from the parsed generator; (2) run the regeneration with --today; (3) DO NOT hand-edit a single generated literal; (4) DO NOT move the module assertion (28), the lesson count (56) or the gate-case count (192); (5) leave gateDigest EXACTLY as K2 set it — NEVER P3; (6) confirm --check reads 0 after, with both halves of the forecast checked; (7) mark the pass done against §10.4 and §7.57's item (xx) and write the findings block continuing at (rr16); (8) write §7.59 in the same commit, editing BOTH halves. Expect P1 on the developer paths, P8 on the sections whose JSON differs, and P10 on the revised-lesson cap — nine revisions against a cap of three, expected and accepted. THE ACCEPTANCE TEST IS THE ROSTER DECK STILL HOLDING 314 CARDS WITH THE SAME 314 IDS, MEASURED — compare the id sets and the hash multiset, not just the count, and re-measure both queues with the pool size beside them. MAKE EVERY CHECK PRINT ITS DENOMINATOR, TRACE THE WHOLE PATH, TEST THE INSTRUMENT, AND DECOMPOSE A SIGNAL BEFORE YOU BELIEVE IT. THE CHANGELOG ARITHMETIC — RE-COUNT ON THE DAY. Then, give me a prompt to paste into a new Opus 5 xhigh session to continue the action plan, then remember session.

### Changed

#### `googleAppsScripts/Classroom/Classroom.gs`

- **THE SEGMENT-LESSON REGENERATION PASS (`CLASSROOM-CURRICULUM-PLAN.md` §10.4) — `build-classroom-segments.py --check` READS 0 FOR THE FIRST TIME SINCE THE GENERATOR WAS BUILT AT v05.17r.** One `--all --today 2026-09-18` run. **Nine lessons rewritten, not nineteen** — `segment-cells-and-chemistry`, `segment-storage-integrators-and-containers`, `segment-power-conversion-and-rack-power-silicon`, `segment-storage-developers-and-ipps`, `segment-hyperscalers-and-ai-labs`, `segment-utilities`, `segment-capital`, `segment-assurance`, `segment-insurance-and-risk-transfer`. **Not one generated literal was hand-edited**, and no registry, dossier or template was touched
- **THE 28 STALE `(planned)` RENDERS ARE GONE — 28 → 0, re-derived from the corpus rather than carried.** 28 renders across 9 segment lessons over 12 distinct titles, all twelve of them built lessons, per segment `storage-developers-and-ipps` 6 · `cells-and-chemistry` 4 · `storage-integrators-and-containers` 4 · `assurance` 3 · `capital` 3 · `insurance-and-risk-transfer` 3 · `power-conversion-and-rack-power-silicon` 2 · `utilities` 2 · `hyperscalers-and-ai-labs` 1 — matching §7.58's figures exactly. The nine leaking segments are **byte-for-byte** the nine `--check` reported as due, so **(qq1)'s invariant survives the clearing as well as the accumulation**
- **`updated` moved on nine lessons, not nineteen, and the generator wrote every one of them.** `reviewBy` moved on **only four of the nine** — the four sitting on §10.3's `updated + 6 months` default (`assurance`, `insurance-and-risk-transfer`, `power-conversion-and-rack-power-silicon`, `storage-developers-and-ipps`); the other five are pinned to a future policy `effectiveDate` and correctly held. **No pin moved on any lesson** — `--check` reported `inputs moved: none` for all nine before the run and the generator's own log confirmed `no pin moved` nine times, so every revision note reads *"regenerated: registry or graph content moved with no pin change"*
- **Nine `revisions[]` entries appended, `changed[]` written by the generator and verified against the real differing-section set on all nine (P8-OK ×9).** `read-next` in all nine; `what-is-bought-and-on-what` in six of them. `gateDigest` untouched at `sha256:f568052fa2fb…`, `coveredThrough` and `lastRun` untouched
- `var VERSION` **v01.73g → v01.74g**

### Fixed

#### `repository-information/CLASSROOM-CURRICULUM-PLAN.md`

- **(rr15) WAS WRITTEN INTO §7.58 BUT NEVER INTO §10.6's FINDINGS REGISTER, WHICH ENDED AT (rr14) — (rr16).** `SESSION-CONTEXT.md` asserts *"findings (rr7)–(rr15) written"*; eight of the nine landed. Repaired in place so the register is contiguous before `(rr16)` opens on top of it
- §10.4 marked **CLEARED**; §10.6's findings register continued at **(rr16)–(rr21)**

#### `repository-information/INTEGRATED-REMEDIATION-PLAN.md`

- §7.58 marked **SPENT**; §7.57's open item **(xx)** closed; **§7.59 written in both halves** — the next run's brief

## [v06.49r] — 2026-09-18 01:37:44 AM EST

> Build K2 — the opt-in roster deck — on Opus 5 xhigh as a fresh session. PHASE 4 IS CLOSED at 26 of 26 and every track in the plan is complete at fifty-six lessons across eight tracks. K2 is the next open item and it is 1–2 sessions. It authors no lesson, no guidance module, no dossier and no report, it regenerates no segment, and it creates no track. IT IS A CODE ROW, NOT A CONTENT ROW — the first in the Classroom programme since S1 — so the checker signature changes and the acceptance test is the drill queue rather than a render. WHY K2 AND NOT THE OTHER TWO: C5 opens with a DESIGN session which belongs on Fable 5.1 xhigh, and the Q plan clock is next due ~2026-12. RE-DERIVE THE CARD COUNT BEFORE YOU DESIGN ANYTHING — §10.8 was written against S0's 283 memberships; establish the real number yourself in one command. THE ONE CAVEAT ON K2 IS ALREADY MEASURED AWAY, AND YOU SHOULD RE-MEASURE IT: the nine due segments differ on read-next and what-is-bought-and-on-what ONLY. THE WORK — one push commit: (1) enumerate rc:<segment-id>:<slug> items server-side from the segment-* lessons the session may read (clLessonVisible_), one per the-players row, front "Company — which segment, and which role?", back the segment name, the role and the basis line, CONTENT HASH = THE BASIS TEXT; (2) serve them on their own ops — cop=drill&deck=roster, with cop=grade recognising the rc: prefix and validating it against the same enumeration it served — with CL_ROSTER_SESSION_CAP 20 and CL_ROSTER_NEW_CAP 10, the same two sheet tabs, and an opt-in rosterDeck flag in the progress property store, DEFAULT OFF; (3) THE MECHANISM QUEUE MUST NEVER CONTAIN AN rc: ITEM — assert it in a test, not in a comment; (4) add the page-side toggle and the second queue; (5) DO NOT move the module assertion (28) or the lesson count (56); (6) regenerate NOTHING, --check must still read 9 after; (7) flip §7.3's and §6's K2 rows, mark §10.8 built, and write the findings block continuing at (rr7); (8) write §7.58 in the same commit, editing BOTH halves. P3 IS NOT NOISE ON THIS ROW — expect P1 on the developer paths and be ready for P3; refresh gateDigest if it fires and leave coveredThrough and lastRun alone. THE ACCEPTANCE TEST IS THE TWO QUEUES, MEASURED, NOT A SCREENSHOT — with the flag OFF cop=drill must return ZERO rc: items for every tier, asserted on the COUNT; with it ON an ANALYST must be able to drill the roster deck. Measure base against head and demand that both the rendered character count AND the PROJECT byte count MOVE. MAKE EVERY CHECK PRINT ITS DENOMINATOR, TRACE THE WHOLE PATH, TEST THE INSTRUMENT, AND DECOMPOSE A SIGNAL BEFORE YOU BELIEVE IT — NEVER REPORT A DELTA YOU HAVE NOT DECOMPOSED. THE CHANGELOG ARITHMETIC — RE-COUNT ON THE DAY, AND EXPECT TO BE THE ROTATOR. Then, give me a prompt to paste into a new Opus 5 xhigh session to continue the action plan, then remember session.

### Added

#### `googleAppsScripts/Classroom/Classroom.gs`

- **K2 — the roster deck (`CLASSROOM-CURRICULUM-PLAN.md` §10.8), the first CODE row in the Classroom programme since S1 and the first since v05.53r that authors no JSON literal inside the content fence.** A **second, opt-in deck of 314 company cards** beside the mechanism deck: `clDrillRosterItems_()` enumerates `rc:<lessonId>:<dossierSlug>` one per `the-players` row from the `segment-*` lessons the session may read (`clLessonVisible_`), front *"Company — which segment, and which role?"*, back the segment title, the role and the `basis` line, and the **content hash is the basis text alone** as §10.8 fixes it
- **THE CARD COUNT WAS RE-DERIVED AND §10.8's OWN ARITHMETIC WAS TWO GENERATIONS STALE — (rr7).** The spec says **283** (the S0 registry's memberships); the built tables carry **314 rows across nineteen segment lessons**, verified in one pass that also proved every row is 4 columns wide, every lesson holds exactly one `the-players` section at index 3, all 314 dossier slugs are valid, all 314 company cells are `**bold**`, **no basis line contains an asterisk**, and the 314 `rc:` ids are **distinct with zero collisions**. Roles decompose 122 incumbent / 80 challenger / 112 adjacent = 314
- **`CL_ROSTER_SESSION_CAP` 20, `CL_ROSTER_NEW_CAP` 10, `CL_ROSTER_PREF_PROP_PREFIX`, `CL_ROSTER_ID_RE`, `CL_ROSTER_ID_PREFIX`.** `clDrillQueue_` gained `sessionCap` / `newCap` arguments defaulting to the mechanism constants, so one scheduling policy serves both decks and no second copy exists to drift
- **THE ID NAMESPACES ARE SEPARATED BY THE PRE-EXISTING REGEX, NOT BY CONVENTION — (rr8).** `CL_DRILL_ID_RE` requires a trailing `:<n>` index and an `rc:` id ends in a dossier slug, so **not one of the 314 ids matches it** (measured, 0 of 314): the pre-K2 `cop=grade` guard refuses every roster id on its own, and the roster branch had to be added explicitly rather than inherited by accident
- **`clDrillStateForDeck_()` — the two decks share the two sheet tabs but NOT the daily new-card budget.** Opting in would otherwise halve the mechanism deck's introduction rate. For any account holding no `rc:` rows the split returns the map unchanged, so **no account that existed before K2 sees its mechanism queue move** — asserted rather than asserted-in-prose
- **`clRosterEnabled_()` / `clRosterSetEnabled_()` — opt-in per account, DEFAULT OFF, its own key in the progress property store rather than a member of the progress map**, because `clProgressVisible_` filters that map to readable lesson and module ids and would drop a preference key on every read. Turning it off **deletes** the key, so "off" has one representation
- **`clDrillRosterAllowed_()` — the single derivation both `cop=drill&deck=roster` and `cop=grade` authorise against**, carrying the opt-in check itself so "validated against the same enumeration it served" and "refused because the deck is off" are one fact rather than two that can disagree
- **Ops: `cop=drill&deck=roster`, `cop=rosterdeck&on=1|0`, and `cop=grade` recognising the `rc:` prefix.** An unrecognised `deck` value returns `UNKNOWN_DECK` rather than falling through to the mechanism deck. The mechanism `cop=drill` response gained `deck` and a `roster` summary so one op at mount populates both landing cards
- **Columns are resolved by HEADER NAME, not by position.** §10.3 fixes the order and all nineteen tables agree today, but a deck keyed on position would mis-label 314 cards in silence if that order moved, and no checker reads this file. A table missing a column is skipped whole rather than emitted mis-keyed

#### `live-site-pages/Classroom.html`

- **The opt-in toggle, the second landing card and the `#drill/roster` route.** `clRenderRosterCard()` renders below the drill card (what is falling due outranks an optional second deck); `clRosterSync()` / `clRosterToggle()`; `clShowDrill(deck)` is deck-aware and **resyncs whenever the loaded queue belongs to the other deck** rather than only when it is empty, so arriving from the other route cannot paint the wrong cards; the drill card's source line gained a `Roster · <company> · <segment lesson>` branch linking to the dossier and to the player table; grading credits the right deck's counters

#### `scripts/check-classroom-content.py`

- **The content contract's line — "the mechanism queue never contains an `rc:` item" — is now a TEST, not a comment.** Gate cases **142 → 192**, decomposed exactly: 6 tiers × 6 per-tier assertions + 10 opt-in assertions + 4 deck-split assertions = 50. Five fixture shapes: a public segment lesson, a gated one, a **non-segment lesson carrying a the-players-shaped table**, one with **reordered columns**, and one **missing a column**. Both directions are asserted on COUNTS with the pool size beside them, because a zero from an empty pool is indistinguishable from a zero from a working separation
- **The lesson count stayed at 56 and the module assertion at 28** — K2 authors neither

### Changed

#### `repository-information/classroom-pipeline-ledger.json`

- **`gateDigest` refreshed** `sha256:2e04ae8849fa` → `sha256:f568052fa2fb`; `coveredThrough` and `lastRun` untouched

### Fixed

- Nothing — no defect was closed by this row. Three were **recorded** (see below) and none is K2's to fix

### Notes

- **THE K2 CAVEAT WAS RE-MEASURED AND HOLDS.** §7's ordering table calls K2 low priority until the segment lessons are regenerated. `--check` still reports **9 of 19 due**, and **all nine differ on `read-next` and/or `what-is-bought-and-on-what` only — `the-players`, the deck's whole source, is never among the differing sections.** `--check` **HELD at 9 → 9**; nothing was regenerated
- **THE GATE-DIGEST DELTA WAS DECOMPOSED BEFORE THE DIGEST WAS REFRESHED — (rr9), which is (rr2)'s discipline on a new signal.** P3 fired, as §7.57 forecast. Of the **32** `GATE_SYMBOLS`, **exactly one moved**: `handleClassroomOp_`, 5,294 → 8,601 characters (**+3,307**). Reverting **only that symbol** in the head source reproduces the base digest `sha256:2e04ae8849fa` **byte for byte**, so nothing in the access matrix, the provenance fold, the stamp reader, the per-tier views, the progress store or the two schema-version constants contributed. The headline "the gate surface changed" is true and says nothing about *which* gate; the answer is the one symbol a new op parameter cannot avoid
- **THE OP-RESPONSE DELTA WAS DECOMPOSED TOO, AND `cop=index` DID NOT MOVE BY A BYTE.** Base against head over the real `handleClassroomOp_` in one process, all four tiers: `cop=index` is **byte-identical** at every tier (analyst **45,625 bytes**, contributor 52,713, admin 52,707, viewer 60), and `cop=drill` moved **+46 wire bytes per admitted tier** — exactly `,"deck":"mechanism"` (19) plus `,"roster":{"enabled":false}` (27), ×3 admitted tiers = **+138** on the wire. **Dropping only those two keys reproduces the base response byte for byte.** The viewer's `ROLE_DENIED` is unchanged at 60 bytes
- **THE ACCEPTANCE TEST, MEASURED THROUGH THE REAL SERVING PATH.** Flag **OFF**: `cop=drill` returns **0** `rc:` items for every tier against live pools of **970** (admin, contributor) and **446** (analyst) — asserted on the count with the pool beside it, since a zero from a crashed op looks identical to a zero from a working gate. `cop=drill&deck=roster` returns **0 served / pool 0**. An unknown `deck` returns `UNKNOWN_DECK`; an `rc:` grade with the flag off returns `ITEM_DENIED`. Flag **ON for an ANALYST**: pool **314**, **10** served (the new cap, not the session cap — all 314 are fresh), every id `rc:`-prefixed, a real grade returns SM-2 state `ivl 1 / due +1 day`, a malformed id `BAD_ITEM`, an unknown company `ITEM_DENIED`, and **both sheet tabs carry the row with the `rc:` prefix separating it**. With the flag ON the mechanism deck still returns **0** `rc:` items, and after a roster grade the mechanism queue reports **known 0** — the roster row never entered the mechanism state
- **THE PROJECT REGION AND THE RENDER BOTH MOVED.** PROJECT region **3,979,225 → 3,992,980 characters** / **3,999,876 → 4,013,693 bytes** (+13,755 chars, +13,817 bytes); the whole file 4,362,617 → 4,376,434 bytes. The roster drill view renders **327 characters** where it rendered nothing before, and the mechanism view **885**
- **THE CARRIED-FORWARD BYTE FIGURE WAS A CHARACTER COUNT — (rr10).** §7.57 records row 26's PROJECT region as "3,930,651 to 3,979,280 **bytes**". `origin/main`'s region measures **3,979,225 characters** and **3,999,876 bytes** — so the carried figure is within 55 of the *character* count and 20,651 short of the byte count, because this file is dense with em-dashes and `›`. A session that compares its byte reading against the handover's "byte" figure sees a spurious +20k. Both units are stated above and in §7.58 so the next comparison has a like-for-like baseline
- **`CL_DRILL_ACCOUNT_CAP` IS ALREADY BINDING AND K2 DID NOT MAKE IT SO — (rr11), RECORDED NOT FIXED.** The cap is **3,000** state rows per account and `CLASSROOM-SCHEMA.md` calls it "headroom rather than a limit" against "~2,050 items". Measured today: the study and lesson pools total **2,702** and the guidance half adds **437** (275 `gc:` + 162 `gq:`), so a contributor's mechanism deck alone is **3,139 — 139 over the cap before the roster deck exists.** K2's 314 take the gap from 139 to 453. So the headline "opting into the roster deck pushes an account past the cap" is **false**: the cap was crossed when guidance joined the pool at C3 session 3, and the schema's headroom note is two generations stale. Raising it is a decision for the developer and is **not** bundled here
- **A pre-existing dead-code block in the content checker — (rr12), RECORDED NOT FIXED.** `run_gate_truth_table()` ends `return (…) + cases`, and **three audit assertions sit below that return**, so the `classroom_capability_denied` / `classroom_bad_provenance` / `classroom_not_admitted` audit-log checks have never run. Unreachable, pre-existing, and outside K2's scope under Chesterton's Fence — enabling them may surface real failures and wants its own commit
- **A SINGLE-MUTATION TEST CAN READ AS A HOLE WHEN THE CODE HAS TWO GUARDS — (rr13).** Eight mutations were run against the new assertions: leaking `rc:` into the mechanism pool fired 5 errors, defaulting the flag on 6, resolving columns by position 7, dropping the asterisk strip 2, hashing `q+a` instead of the basis 1, removing the deck split 2, and changing the caps 1. Removing the `segment-` prefix filter fired **zero** — which read as a gap and is not one: `CL_ROSTER_ID_RE` independently requires the prefix. Removing **both** guards fires 5. The way to tell a redundant guard from an untested one is to remove both
- **THE RENDER HARNESS'S OWN THREE FAILURES WERE ALL THE INSTRUMENT — (rr14), (oo6)/(rr6) three times in one harness.** Playwright could not be installed this session (`pypi.org` timed out, `registry.npmjs.org` returned **503**), so the page half was measured by loading the page's **real** `// PROJECT START … // PROJECT END` region and the `.gs`'s real region into **one** Node process with a 60-line DOM shim, stubbing the transport at `_gasPost` so the page's own `clApi` still runs. Its first three readings all looked like page defects and were all shim gaps: **no `nextSibling`/`firstChild`** (the roster card appeared *above* the drill card), **no `#cl-app`** (the whole drill view rendered empty), and **a role-less session stub** (`clAdmitted()` read analyst as viewer, so `clRoute()` returned early and the route table looked dead). Each was fixed in the shim and **no page code changed**
- **Rotation on BOTH files — the deferral recorded at v06.48r lapsed exactly as predicted.** `TZ=America/New_York date` read **2026-09-18 01:37 AM EST**, so the nineteen 2026-09-17 sections stopped being exempt. `CHANGELOG.md`: 117 raw / **116 non-exempt** against a 100 trigger → rotated the **2026-09-10 (3)**, **2026-09-12 (8)** and **2026-09-13 (15)** date groups, **26 sections**, leaving **90** non-exempt. `Classroomgs.changelog.md`: 60 raw / **59 non-exempt** against a cap of 50 → rotated **2026-09-03 (3)**, **2026-09-07 (1)**, **2026-09-08 (2)** and **2026-09-13 (10)**, **16 sections**, leaving **43**. Clone deepened to 1,372 commits first; every rotated header SHA-enriched; the mandatory post-rotation grep run on both archives. `Scrapergs.changelog.md` **41** and `Profilerhtml.changelog.md` **49** are under their caps and neither is this row's
- **Checkers.** `check-classroom-content.py` **0 errors / 0 warnings at 56 lessons / 8 tracks**, gate cases **142 → 192**, module assertion **28** — both frozen numbers unchanged. `check-classroom-curriculum.py --strict` no structural findings, 28 stale pins, 4 items due (unchanged; `landscape-cooling-2026-09` overdue **by design**) — and its **own K2 detector, written at S1, flipped from "K2 not built — no roster caps in Classroom.gs" to "CL_ROSTER_SESSION_CAP 20"** without the checker being touched. `check-classroom-pipeline.py --selftest` 13 fixtures / 0 failures; `--base origin/main` **P1** on the developer paths, **P2** outside the fence (a code row by construction) and **P3**, with the actionable worktree-digest finding cleared by the refresh. `build-classroom-segments.py --check` **9 → 9**. `node --check`, `check-gas-inner-scripts.js` (86 blocks) and `check-readme-tree.py` (10 page + 8 GAS displays, **0 findings** — run before committing, so the one-bump GAS drift that fired on the previous two rows did not fire here) all clean

Developed by: LightAISolutions
