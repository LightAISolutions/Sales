# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-23 01:20 AM EST (N4 session 2, v07.23r)

**Date:** 2026-09-23 01:20 AM EST (the session ran ~12:54 → 01:25 AM EST)
**Repo version:** v07.23r — one push on `claude/exciting-knuth-3pb083` (N4 session 2 + this session-context write, one commit)
**Branch:** `claude/exciting-knuth-3pb083`
**Model:** Fable 5.1 (N4 session 2 — the pre-meeting brief, promote to field note, the network map and the "Will be at" chips; **N4 is Done**)

### What was done

- **N4 session 2 landed** (`Network.gs` v01.15g · `Network.html` v01.24w; §11's N4 row → **Done** with both sessions' versions; §13.17 written — the E5 session-1 brief with its paste-in prompt): `nop=brief` (session GET, behind `contacts`) assembles the contact's own rows server-side — the contact minus the raw extraction and card links, the account, every Interaction newest first, the account's Signals named by Events, the warmth block, the stage — and writes the D9 disclosure row (`network_brief rows=1 ids=<c- id>`) + a `data_export` audit; the page builds a **real `.docx`** (three-part OOXML over the existing store-only zip) adding the served dossier's `strategyRead[]` and last five `recentDevelopments[]` when covered. `nop=promote` (body-POST) copies one Interaction into Profiler's intake **through Profiler's existing note op** (`action=note` · `nop=submit` at `PROFILER_INTAKE_EXEC`) as a `sourceType: contact` note with the developer's 0–100 confidence, the i- id as evidence in the text, the account's slug or `general`; the developer's own Profiler session is read by the page from the shared origin (`localStorage` `ov_note_session`) and relayed once, never stored or audited; the promotion is recorded as a `note` Interaction (`promoted:<i- id>:<intake id>` — the duplicate guard; the source row untouched). `nop=signals` gains `eventName` / `eventStart` / `events` / `eventsConfigured` from one `eop=signals` call per read, degrading to slugs. The page: the 📄 Brief button and the ⇈ Promote box on the detail, the "Will be at" chips (press quotes as "Quoted in press", filings as "Regulatory filing"), the 🕸 Map masthead card (vanilla SVG over the list payload; pan, tap-to-focus, a second tap opens the row — the tap decided on `pointerup`, because a captured pointer's click never reaches the node)
- `scripts/check-network-brief.js` (58 checks, zero live calls — it caught the empty-string confidence that rounded to 0 and passed the bound; fixed); `verify-network-roles.py` gained the chips · brief (the `.docx` unzipped and read back) · promote · map passes and the D17 grep — ALL CHECKS PASSED at 390 × 844, zero page errors; `check-scraper-people.js` extracts the three new signal helpers; every sibling harness passes; `check-readme-tree.py` 0 findings
- `NETWORK-SCHEMA.md` §8 / §11 / §12 / §14 updated; CHANGELOG `Sections: 94/100`

### Where we left off

**The developer's live check is next** (reported, not asserted): confirm the Network redeploy (`?action=api&op=deploy` → `Already up to date (v01.15g)`, else run `pullAndDeployFromGitHub` once), open a contact detail → **📄 Brief** → open the `.docx` in Word (a covered and an uncovered contact per §8's done-when), sign in to Profiler in the same browser → **⇈** on one touch → Promote at a confidence → find `note-<date>-NN` in Profiler's intake Manage panel, read the **Will be at** chips on an account with signals (the event names need `EVENTS_PEER_TOKEN` on Network and `NETWORK_PEER_TOKEN` on Events — both are set), open **🕸 Map**. **The three live-state brackets in this session's prompt were left unfilled** (the warmth chips, the reconnect list, the confirmed `.ics` row) — do both checks together. **Then E5 session 1** with the §13.17 paste-in prompt (given in chat at the close of this session); its four brackets are the brief, the promotion, the chips and the map.

### Open findings carried forward

- The `.docx` carries no `styles.xml` — headings are bold runs; Word, Pages and LibreOffice open such a package, but a corporate template will not style it. Add a styles part only if the developer asks
- A promote needs the developer signed in to Profiler in the same browser — the page reads Profiler's own `ov_note_session` key (same origin); an expired Profiler session is relayed as `profiler_session_expired` with nothing written
- The chips' event names ride Events' `eop=signals`, which round-trips through Network's peer read leg — one detail open is one Events call plus one Network peer read; with either token unset the chips show slugs
- The map draws the list **as filtered** — a contact outside the current filter is not a node; the status line says "of N (the list is filtered)"
- From N4 s1: the `.ics` DESCRIPTION is never read; do-not-contact contacts are excluded from the reconnect list; two `.gs` regex literals use `\x22` / `\x27` for quote marks (the shared extractor reads a quote inside a regex as a string opener — keep that convention)
- From E4: the Scraper roster carries no FERC eLibrary RSS; RE+ 2026's roster is a Swapcard widget; GlobeNewswire's feed unverified until a live sweep is read; no back-fill of `people[]`
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- The `promoted:<i- id>:<intake id>` marker lives on a **new `note` Interaction**, never on the source row's Evidence Link (§3 gives that column to the row's own evidence); the marker is also the duplicate guard
- The promote relays the developer's Profiler session server-side in one call (the page reads it from the shared origin) rather than posting from the page — one op, the duplicate refused before any call, the note Interaction written in the same op; the session is never stored, logged or audited
- An uncovered account promotes to the intake's `general` slug with the company named in the text; a slug not matching `NW_PEER_SLUG_RE` also falls back to `general`
- The brief is a real `.docx` (not the `.doc` HTML-in-Word of the Profiler precedent) so the verifier can unzip and read its paragraphs; built over the existing store-only zip, no library
- The map tap is decided on `pointerup` (a captured pointer's `click` lands on the svg, not the node); a drag under 6 px is a tap

### Active context

- **Repo version v07.23r.** `CHANGELOG.md` `Sections: 94/100` — no rotation due
- **Live versions:** `Network.html` v01.24w · `Network.gs` v01.15g · `Events.html` v01.08w · `Events.gs` v01.07g · `Scraper.gs` v02.22g
- **Reminders still open** (developer's own — untouched): close out "Repo access denied"; the Megmeet briefing after the Network/Events build, before 2026-10-07 (the Network/Events build now stands at E5 + X + Q remaining)
- **A parallel branch `claude/adoring-brown-mvddj2` was on the remote during this session** — not this session's; check `git ls-remote` before pushing
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Do the live check first (the redeploy, one brief in Word for a covered and an uncovered contact, one promotion found in Profiler's intake, the chips on an account with signals, the map), then run E5 session 1 with the §13.17 paste-in prompt — its four bracketed live-state fields filled from Network.
- **To continue:** type `run E5 session 1 from §13.17`

Developed by: LightAISolutions
