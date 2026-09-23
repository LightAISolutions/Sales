# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-23 03:15 AM EST (the session ran ~02:40 → 03:15 AM EST)
**Repo version:** v07.25r — one push on `claude/compassionate-ritchie-q8bgj1` (E5 session 2), plus a second push for this session-context write and the X brief
**Branch:** `claude/compassionate-ritchie-q8bgj1`
**Model:** Opus 5 (E5 session 2 — the post-event checklist, the ROI line and the `events plan` command; **E5 is Done**)

### What was done

- **E5 session 2 landed, closing E5** (`Network.gs` v01.17g · `Events.gs` v01.09g · `Events.html` v01.10w; §11's E5 row → **Done**; §13.19 written — the X brief with its paste-in prompt):
  - `Network.gs`: `nop=interaction`'s read leg widened with **`eventSlug=`** — the live contacts whose `Source Event` is the slug (with `accountName`, the account's `stage` at read time and **one** `mailable` boolean instead of the two consent columns) and the `meeting` Interactions on the slug, each carrying an inferred `held` (a later `note` / `email-out` on the same contact within 14 days) and the developer's explicit `mark`. Both derived on Network's side — a boolean and a three-value word are strictly less data than the rows behind them. Mark rows are excluded from the touches that feed the inference, or a "not held" mark would read as a later touch and invert itself. `NW_PEER_INTERACTION_KINDS` gained `note` for the mark write; the two mark phrases are mirrored byte for byte in `Events.gs` and the mirror is asserted
  - `Events.gs`: `eop=postevent` (the checklist + the ROI line written **once** into the event's `Plans` row; `not_over` before the day after `end`; the booth accounts from the score run once with the past slug's signals kept via a new `extraSlug` argument — no dossier read, no agenda, no Overpass), `eop=posteventmark` (the verdict as a `note` Interaction with the `mt-` id as evidence; an explicit mark beats the inference both ways; refreshes the row over one read-leg call, never a second score), `eop=plannarrative` (the Drive URL onto the row; the audit carries a flag, never the URL), and the score's seventh term **`priorRoi`** — `min(1, (cards + 3·held + 5·moves) / 40)` from an earlier edition of the same series, seeded at 0.05
  - `Events.html`: the **Post-event** section at the top of the Plan tab once today > `end`, with Mark held / not held per meeting, the follow-up link, the ROI line as recorded, a Narrative link field, and **Copy plan as JSON**
  - The **`events plan <event>` command rule** in `.claude/rules/events-app.md` + its CLAUDE.md pointer, and the **first narrative plan** for **RE+ 2026** at `repository-information/plans/re-plus-2026-narrative-plan.md` and in the developer's Drive
- **A real bug caught by a sibling harness**: the new past-slug filter kept rows with an **empty** event slug (a docket, a press quote) when no extra slug was named. `check-events-signals.js` failed on it; fixed with an explicit guard and an assertion added
- `scripts/check-events-plan.js` **100 → 151 checks**; `verify-events-roles.py` gained a post-event pass (screenshot `events-postevent.png`, 390×844, zero page errors); `check-events-score.js` / `check-events-signals.js` updated for the seventh term; `check-network-schema.py`'s audit allow-list gained two count keys
- `EVENTS-SCHEMA.md` §5 / §6 / §8 / §10 and `NETWORK-SCHEMA.md` §8 updated; CHANGELOG `Sections: 96/100`

### Where we left off

**The developer's live check is next** (reported, not asserted): redeploy Events (`v01.09g`) and Network (`v01.17g`), open a **past** starred event's Plan tab, read the checklist and the ROI line, mark one meeting held and find the note on that contact in Network, then press **Copy plan as JSON** and paste it back with `events plan <slug>` for a real narrative plan (the RE+ one was written from the public half only). **Then X** with the §13.19 paste-in prompt — Fable 5.1 xhigh, decide before building.

### Open findings carried forward

- **`Network.html` has no hash router**, so the checklist's `Network.html#drafts?sourceEvent=<slug>` deep link opens the app without pre-filtering. The page says so beside the link; a small Network-side route would close it — left out rather than widen this session into `Network.html`
- **The four live-state brackets in the §13.18 prompt were pasted unfilled**, so E5 session 1's live check remains unconfirmed by a session. This is now the second prompt in a row where that happened
- **`scripts/check-guidance-migration.js` fails on clean `origin/main`** ("expected 9 modules, got 28") — pre-existing, unrelated to this session, and nobody has picked it up
- `check-classroom-pipeline.py` reports P1 findings against any non-Classroom diff; by its own docstring it is "the judge a C2 pipeline run is held to", so that is correct behaviour and not a defect
- The ROI line is **written once** and only a *mark* refreshes it — cards scanned after the first close-out open never raise the recorded `cards`. Faithful to the brief; worth revisiting if it bites
- Carried from E5 s1: no booth numbers on the day plan (an E4 parser follow-up); only two registry rows carry `hours[]`; a plan build costs the full score and the close-out costs another
- From E4: RE+ 2026's roster is a Swapcard widget (`no_roster_found`); GlobeNewswire's feed unverified until a live sweep is read
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- **`lost` is not a stage move** although `NW_STAGES` orders it past `prospecting` — a terminal negative would let a show that produced only losses read as productive in next year's prior. `EV_ROI_STAGES_MOVED` is an explicit list and the departure is documented in `EVENTS-SCHEMA.md` §6
- **`held` and `mark` are computed on Network's side**, not shipped as rows — the minimum-necessary reading of D9, and the only way the checklist counts cards *and* meetings without a second op
- **Copy plan as JSON sits in the plan head as well as the Post-event section.** The brief placed it only in the close-out, but the narrative plan is most use *before* a show — and the brief's own step 4 asks for a plan for RE+ 2026, which is upcoming and has no Post-event section
- **Network's audit rows stay counts-only** — the slug was dropped from `peer_interaction_event_read` to match the app's own convention; the Events side already audits it
- The narrative plan was written from the **public half** because no JSON was pasted, and says so throughout rather than guessing at booths

### Active context

- **Repo version v07.25r.** `CHANGELOG.md` `Sections: 96/100` — no rotation due until 100
- **Live versions:** `Events.html` v01.10w · `Events.gs` v01.09g · `Network.html` v01.24w · `Network.gs` v01.17g · `Scraper.gs` v02.22g
- **D13's deferral condition is met** — all 58 rows of `events-sources.json` carry a `lastProbe` dated 2026-09-21, so X is runnable
- **Reminders still open** (developer's own — untouched): close out "Repo access denied" and rebuild the committing Routines (**C2 fires today, Wed 2026-09-23 04:00 PDT**); the Megmeet briefing before 2026-10-07 — **the Network/Events build is now down to X, so its sequencing condition is nearly met**
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **X** with the §13.19 paste-in prompt on Fable 5.1 xhigh — it is D16's last row, it is a decision before it is a build, and a reasoned "no" closes it just as completely as a build does.
- **To continue:** type `run X from §13.19`

## Previous Sessions

### Session — 2026-09-23 02:20 AM EST (E5 session 1, v07.24r)

**Date:** 2026-09-23 02:20 AM EST (the session ran ~01:53 → 02:25 AM EST)
**Repo version:** v07.24r — one push on `claude/focused-gauss-6h8jcd` (E5 session 1 + this session-context write, one commit)
**Branch:** `claude/focused-gauss-6h8jcd`
**Model:** Fable 5.1 (E5 session 1 — the deterministic plan: booth list, sessions, day plan and meetings; **E5 is In progress — session 1 done**)

### What was done

- **E5 session 1 landed** (`Events.gs` v01.08g · `Events.html` v01.09w · `Network.gs` v01.16g; §11's E5 row → In progress — session 1 done; §13.18 written — the E5 session-2 brief with its paste-in prompt): `eop=plan` (session GET, behind `recommend`) for one starred event — the score run once with its rows kept (`evRecommend_(sess, true)`) → the booth list ranked by the score's account term × strongest signal + a per-account segment term with the `Tuning` weights, the *why* line verbatim from the served dossier (`strategyRead[0]`, else the newest development headline; top 15; never Profiler's exec), the sessions from the agenda page (read once, cached six hours; kept for a seat-segment title, a Network-contact speaker or a dossier decision maker), the day plan (a frame per day from `hours[]` or the default 09:00–17:00 said so; sessions and meetings fixed, ranked visits 30 min × 6 a day, open slots ≥ 30 min), the venues (one Overpass POST, cached per slug in a script property 30 days, a failure empty + one audit row + uncached), the meetings (`Meetings` tab, `mt-` ids). `eop=plancontacts` (the pick list), `eop=planmeeting` (the `meeting` Interaction written first over Network's new `nop=interaction` POST leg — the mt- id as evidence, one line, never the note — then the `Meetings` row, the invite answered as RFC 5545 text with UTC `DTSTART` from the event's zone), `eop=planunbook` (the row removed, the Interaction kept). `Network.gs`: `nop=interaction` — GET the live contacts under an account (id · name · title · role), POST rows through the same `nwInteractionAdd_`, seven per-row rejections by index. `Events.html`: the Details | Plan strip on the sheet, the Plan tab fetched once and never polled, Book a meeting on an open slot with the `.ics` download, Unbook, Rebuild
- `scripts/check-events-plan.js` (100 checks, two VMs, zero live calls); `verify-events-roles.py` gained the plan pass (the strip, the booths, a booking with the `.ics` downloaded and read back, Unbook) — ALL CHECKS PASSED at 390 × 844, zero page errors; every sibling harness passes; `check-readme-tree.py` 0 findings
- `EVENTS-SCHEMA.md` §3 / §5 / §8 / §9 / §10 / §12 and `NETWORK-SCHEMA.md` §8 / §14 updated; CHANGELOG `Sections: 95/100`

### Where we left off

**The developer's live check is next** (reported, not asserted): redeploy Events (`?action=api&op=deploy` → `Already up to date (v01.08g)`) and Network (`v01.16g`), open a starred event's sheet → **Plan** tab, judge the top five booths line by line (the *why* line, the stage, the terms), book one meeting on an open slot and find it on the contact in Network (a `meeting` touch whose evidence is the mt- id) and in the downloaded `.ics` (DTSTART in UTC — the calendar shows it in the event's local time). **The four N4 s2 brackets and this session's four brackets were both left unfilled** in the prompts — do both live checks together. **Then E5 session 2** with the §13.18 paste-in prompt (given in chat at the close of this session) — Opus 5 xhigh.

### Open findings carried forward

- **No booth numbers on the day plan** — the E4 exhibitor parsers keep company names only; the visits are ordered by rank. A parser that stores the booth (Map Your Show's JSON carries it) is a small E4 follow-up, not E5's
- **The `Plans` tab is still unused** — the brief's "new Plans tab with p- ids" was superseded by the `Meetings` tab E1 created (mt- ids); `Plans` waits for session 2's ROI line and narrative link
- Only two registry rows carry `hours[]` — most plans run on the default frame until E0's next verification fills them
- A plan build costs the full score (up to 41 Network calls) plus the agenda, the dossiers and Overpass on first open — 10–30 s; the tab says "Building the plan…" and never polls
- An unbook leaves the `meeting` Interaction in Network (D15: the record); the developer deletes it there if the meeting never happened
- A booking made while Network was not configured has no interaction id — the meetings list says "not recorded in Network"
- From N4 s2: the `.docx` carries no `styles.xml`; a promote needs a Profiler sign-in in the same browser; the map draws the list as filtered
- From E4: the Scraper roster carries no FERC eLibrary RSS; RE+ 2026's roster is a Swapcard widget; GlobeNewswire's feed unverified until a live sweep is read
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- The bookings live in the **`Meetings` tab** (§5, `mt-` ids) that E1 already created, not the brief's "new `Plans` tab with `p-` ids"; the mt- id is the Interaction's evidence and the ICS UID's stem
- `nop=interaction` is **two legs on one op** (the `nop=signals` pattern) — the read leg is the pick list, so the session's one bridge widening stays one op; `eop=plancontacts` is the page's way to it
- The meeting invite carries **UTC `DTSTART` / `DTEND`** computed from the event's zone instead of `DTSTART;TZID` + a hand-rolled `VTIMEZONE` (§9 amended as built)
- The venue cache is a **per-slug script property** `EV_PLAN_VENUES:<slug>` for 30 days (the brief's decision over §10's CacheService 7 days); a failed Overpass answer is never cached
- The agenda page is read once per plan build and cached six hours in `CacheService` — the sweep and the plan each read it on their own cadence (never twice in one run)
- The ranked visits take the morning (30 min × 6) so the afternoon stays open for meetings; open slots under 30 minutes are not offered
- The two regex-literal conventions hold: `\x22` for quotes inside the plan block's regexes (the shared extractor reads a quote inside a regex as a string opener)

### Active context

- **Repo version v07.24r.** `CHANGELOG.md` `Sections: 95/100` — no rotation due
- **Live versions:** `Events.html` v01.09w · `Events.gs` v01.08g · `Network.html` v01.24w · `Network.gs` v01.16g · `Scraper.gs` v02.22g
- **Reminders still open** (developer's own — untouched): close out "Repo access denied"; the Megmeet briefing after the Network/Events build, before 2026-10-07 (the build now stands at E5 s2 + X + Q remaining)
- **A parallel branch `claude/adoring-brown-mvddj2` was on the remote during this session** — not this session's; check `git ls-remote` before pushing
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Do the live check first (redeploy both apps, a starred event's Plan tab, the top five booths line by line, one meeting booked and found on the contact in Network and in the `.ics`), then run E5 session 2 with the §13.18 paste-in prompt on Opus 5 xhigh — its four bracketed live-state fields filled from that check.
- **To continue:** type `run E5 session 2 from §13.18`
