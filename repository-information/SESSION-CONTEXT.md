# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-22 07:15:53 AM EST (the session ran ~06:53 → 07:25 AM EST)
**Repo version:** v07.14r — one push (this commit) on `claude/amazing-hypatia-06t8r5` restarted from `origin/main` at `47d83190`; the session-context write rides in the same commit.
**Branch:** `claude/amazing-hypatia-06t8r5`
**Model:** Fable 5.1 High (N3 brief, §13.9, session 2 of two)

### What was done

**N3 session 2 — the exports, the drafts and the QR card (§13.9 steps 5–8); §11's N3 row now reads Done.** `Network.gs` v01.10g / `Network.html` v01.19w.

- **`Network.gs`**: `nwExportOp_` gathers once (`nwExportRows_`) and answers `csv` · `xlsx` (`nwExportXlsx_`, the Receipts temp-spreadsheet path, Contacts / Accounts / Interactions) · `vcard` (`nwVcard_`, hand-rolled 3.0, `cards[]` + `vcf`); `nop=mailings` / `nop=drafts` / `nop=draftstatus` (D15 — the app never sends; sent = an `email-out` Interaction with the d- id as evidence); `nop=mycard` on the Profiles row (Title · Phone columns added)
- **`Network.html`**: the Export menu with the "include card image" tick (the PHOTO spliced client-side from the user's own Drive, folded at 75 octets), `nwZip` (store-only zip) for the per-contact vCards and the `.eml` bundle, the follow-up drafts panel (recipients → template → review list edited in place → `.eml` / CSV / `.txt` / Copy / `mailto:` → Mark sent / Discard), the Drafts and My card masthead pills, the My card panel and the full-screen QR from `nwQrMatrix` (byte mode, v1–10, level M, no library)
- **`scripts/verify-network-roles.py`**: the session-2 stub ops and tests — ALL CHECKS PASSED, zero page errors; the page's QR matrix equals python-qrcode's at the same version and mask; the D15 grep over the served page and the `.gs` PROJECT region
- **Docs**: `NETWORK-SCHEMA.md` §3 / §10 / §11 / §12 / §14; the design plan's §11 N3 row Done and §13.10 (the E2 brief + paste-in prompt); `check-network-schema.py` allow-list; README; changelogs

### Where we left off

**E2 is next — §13.10**: the weekly no-AI poller in `Events.gs`, the admin `Proposed` panel on `Events.html`, the `events sync` session command in a new `.claude/rules/events-app.md`, `eop=installpoller`, and `scripts/check-events-poller.js`. The paste-in prompt for E2 was given in chat at the close of this session. **Reported, not asserted**: the vCard bundle importing on iOS / Android Contacts and the QR resolving on a second phone — the developer's live check after redeploying Network.gs (v01.10g) and opening My card.

### Key decisions made

- **The vCard PHOTO is spliced by the page, not the server** — the card front lives in the user's own Drive under `drive.file`, which `DriveApp` cannot read, so the page fetches it with its own token and folds the base64 at 75 octets; the server's vCard is complete without it
- **The template's `sendHipaaEmail` (MailApp) stays** — it is the auth template's security-alert helper outside the PROJECT region (Chesterton's fence, [PC-TEMPLATE-PROP] #19); the D15 assertion is scoped to the served page and the `.gs` PROJECT region, and the schema says so
- **A named template is saved on render, an unnamed one is still a Mailings row** — every render writes the Mailings row (template + list filter) so drafts group by mailing; only named rows appear as saved templates
- **Audit expressions must read as counts to the checker** — `saved: (!tplRow && name) ? 1 : 0` was flagged for the identifier `name`; the count is computed into `savedCount` first
- **The QR encoder is proven, not eyeballed** — the verifier compares the page's matrix against python-qrcode at the same version and mask (skipped gracefully when the library is absent)

### Active context

- **Repo version v07.14r.** `CHANGELOG.md` `Sections: 85/100` — no rotation due
- **Playwright** is `pip install playwright` + the pre-installed Chromium at `/opt/pw-browsers`; `pip install qrcode` enables the QR cross-check. Per-container
- **Reminders still open:** close out the "Repo access denied" issue after Monday's two earnings-desk runs (C2 must be rebuilt before Wednesday 2026-09-23 04:00 PDT); the Megmeet briefing prompt runs after the Network/Events build, before 2026-10-07
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run E2 from §13.10: the poller, the `Proposed` panel, `events sync` and the Node harness; flip §11's E2 row to Done and write the E3 brief as §13.11. Fable 5.1 High, one push. Before it, check `Events.config.json` carries a real `DEPLOYMENT_ID` / `SPREADSHEET_ID`.
- **To continue:** type `run E2 from §13.10`

Developed by: LightAISolutions
