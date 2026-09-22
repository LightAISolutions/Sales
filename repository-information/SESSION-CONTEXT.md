# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-22 09:27:50 AM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v07.16r
**Branch:** a scheduled fresh session (Profiler earnings desk, `trig_01HkrwpCULei8Gje6RGqcp1B`, fired 2026-09-22T13:09:04Z)

### What was done

- Refreshed the NOVONIX (`novonix`) dossier to `profileVersion` 2, v1 archived — the sole due row on the earnings-desk queue (`nextReport` 2026-09-14, a Nasdaq minimum-bid-price compliance deadline). The cure deadline passed with the outcome **unconfirmed by any primary source**; a Yorkville amortisation event triggered 2026-09-10 (US$7.0m redemption due 2026-09-21, payment unconfirmed); a non-binding ACP Technologies MOU (2026-09-16); Panasonic C-sample feedback — 12 of 14 parameters met; a 2026-09-18 closure claim publicly denied by the CEO. 8 new sources; registered-office discrepancy resolved (v07.16r)
- `profiler-companies.json` re-synced (`srcTotal` 69 → 76), `profiler-graph.json` rebuilt (1,482 edges), `archive-index.json` updated (v07.16r)
- `profiler-refresh-calendar.json` — the `novonix` row returned to the quarterly cadence: `nextReport` → 2026-10-29, `confirmed: false`, `watch[]` rewritten (v07.16r)

### Where we left off

All changes committed and merged to main. **This run is the evidence the open "Repo access denied" reminder was waiting on** — the repository-attached earnings desk cloned, researched, committed and pushed successfully, which is the first time a scheduled run has landed a commit in this repo. The reminder's follow-on work (deleting the old control-arm desk, then rebuilding the four committing Routines — **C2 first, before it fires Wednesday 2026-09-23 04:00 PDT**) is still open and is the developer's call.

### Active context

- **Repo version v07.16r.** `CHANGELOG.md` `Sections: 87/100` — no rotation due
- **Reminders still open:** close out the "Repo access denied" issue (the evidence is now in — see above); the Megmeet briefing prompt runs after the Network/Events build, before 2026-10-07
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run E3 from the design plan's §13.11 — unchanged from the E2 session's recommendation, which this automated run did not displace.
- **To continue:** type `run E3 from §13.11`

## Previous Sessions
### Session — 2026-09-22 07:40:08 AM EST (E2, v07.15r)


**Date:** 2026-09-22 07:40:08 AM EST (the session ran ~07:24 → 07:50 AM EST)
**Repo version:** v07.15r — one push (this commit) on `claude/dazzling-edison-hia1w7` restarted from `origin/main` at `ee52d79d`; the session-context write rides in the same commit.
**Branch:** `claude/dazzling-edison-hia1w7`
**Model:** Fable 5.1 High (E2 brief, §13.10, one session)

### What was done

**E2 — the poller and `events sync` (§13.10, all six steps); §11's E2 row now reads Done.** `Events.gs` v01.04g / `Events.html` v01.05w.

- **`Events.gs`**: the weekly no-AI poller `evPollRun_` (trigger handler `evPollTick`; `eop=installpoller` idempotent — Monday 06:00 America/New_York; `eop=pollnow`), the roster and the registry read once per run from their Pages URLs, `evPollSkipReason_` keeping blocked / manual / html / robots-disallowed rows from ever being fetched, a 15 s per-source allowance against a 270 s run budget, the JSON-LD reader (`evParseJsonLd_`) and the RFC 5545 walker (`evParseIcs_` — reads `build-events-ics.py`'s own output), the §1 slug reproduced, the match (`evMatchRegistry_`) and the six diffs (`evDiffItem_`) as `Proposed` rows deduplicated on (Source Key, Event Slug, Change, After) whatever their status, a failed source one `Polls` row + one audit row and no proposal; `eop=proposed` / `decide` / `applied` behind `roster`; the `Polls` tab
- **`Events.html`**: the admin-only **Proposed** tab — the poller card (Install poller, Poll now, Refresh, the last outcome per source), the approved set as the sync JSON (Copy as JSON, Mark applied with the version), the rows grouped by source with Before → After and Approve / Reject; loaded on open, never polled
- **`.claude/rules/events-app.md`** — the `events sync` command (registered in CLAUDE.md); **`scripts/check-events-poller.js`** — 63 checks, zero live calls; **`scripts/verify-events-roles.py`** — the E2 pass, ALL CHECKS PASSED, zero page errors
- **Docs**: `EVENTS-SCHEMA.md` §5 / §7 / §12; the design plan's §11 E2 row Done and §13.11 (the E3 brief + paste-in prompt); README; changelogs

### Where we left off

**The first live cycle is the developer's** (reported, not asserted): redeploy `Events.gs` (v01.04g), open the Proposed tab, tap **Install poller** (the first `ScriptApp.newTrigger` asks for the script's own authorisation — accept in the editor if the panel reports a scope error, then tap again), tap **Poll now**, approve one row, copy the JSON and run `events sync` in a fresh session. **E3 is next — §13.11**: `eop=recommend`, `Tuning`, the Recommended pill and the *why* panel, `scripts/check-events-score.js`. The paste-in prompt for E3 was given in chat at the close of this session.

### Key decisions made

- **The trigger handler is a public wrapper** (`evPollTick`) — a time-driven trigger cannot target a `_` function; `installpoller` removes triggers on either name so an older install is never doubled
- **`robots: disallowed` joins the never-fetched set** — the E0 roster note on COMPUTEX demanded it; the schema's blocked / manual rule alone would have fetched it
- **Dedup covers every existing row, whatever its status** — a rejected proposal must not come back next Monday, so the key is read over the whole tab, not the pending rows
- **A cancelled edition yields only the `cancelled` diff** — its dates and venue are moot once the organiser has cancelled
- **`new-edition` / `new-event` rows are proposed `tentative` with nothing invented** — the poller seeds `series` / `organiser` / `kind` / `tz` from the previous edition for a new edition and leaves `audience` / `relevance` to the session; a new event carries only what the feed said
- **The sandbox extractor cannot see through a quote inside a regex literal** — the `ld+json` regex uses `\x22` / `\x27` for the two quote marks so `check-events-poller.js`'s brace walk stays honest
- **A write's status survives the panel reload** — the panel is rebuilt from the fresh `eop=proposed` answer, so the outcome is written by id after the reload (`evReloadWith`); the verifier caught the blank line

### Active context

- **Repo version v07.15r.** `CHANGELOG.md` `Sections: 86/100` — no rotation due
- **Playwright** is `pip install playwright` + the pre-installed Chromium at `/opt/pw-browsers`. Per-container
- **Reminders still open:** close out the "Repo access denied" issue after Monday's two earnings-desk runs (C2 must be rebuilt before Wednesday 2026-09-23 04:00 PDT); the Megmeet briefing prompt runs after the Network/Events build, before 2026-10-07
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run E3 from §13.11: `eop=recommend` with the six §6 terms, `Tuning` seeded once, the Recommended pill and the *why* panel, `scripts/check-events-score.js`, the verifier pass; flip §11's E3 row to Done and write the E4 brief as §13.12. Fable 5.1 High, one push. Before it, run the first live poller cycle so the E3 session can read a real `Proposed` queue if it wants one.
- **To continue:** type `run E3 from §13.11`

