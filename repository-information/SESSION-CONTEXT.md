# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-21 04:38:22 AM EST
**Repo version:** v06.89r — seven pushes this session (`ee6a82b` v06.82r the N1 session-1 build, `14003f5` v06.83r, `e75c5e8` v06.84r, `ad698c6` v06.85r, `f6edad9` v06.86r, `3b0ea8a` v06.87r, `c06546e` v06.88r the UX passes while the developer scanned, this one), all on `claude/epic-dirac-gbh9bk`, restarted from `origin/main` before each
**Branch:** `claude/epic-dirac-gbh9bk`
**Model:** Fable 5.1 (N1 session 1 brief)

### What was done

**N1 session 1 — capture → extraction — built, live, and used: 20 real cards scanned.**

- **v06.82r** — `Network.gs` v01.04g: `nop=newid` (opaque `c-` id before upload, D8), `nop=extract` (`nwExtractFromBase64_` on the Receipts Gemini idiom with the §7 `responseSchema`, both sides as `inline_data` parts, three-leg retry, `GEMINI_API_KEY` from Script Properties, digest cache, audit rows with id + field count + side count only). `Network.html` v01.03w: capture card (single + batch of 15, front/back pair), IndexedDB offline queue drained on `online`, own-Drive upload into `Network App/_inbox/` with a separate `drive.file` token client, BarcodeDetector QR merge, body-POST transport (`nwApiBody`). Verifier: capture card admin-only, offline capture queues (1) and drains.
- **v06.83r–v06.88r (v01.04w → v01.09w)** — while the developer scanned: four-step progress bar + green "ready for the next card" signal; Front / Back photo links and tap-to-expand field detail; the `c-` id and `check:` list hidden; removable "unclear in the scan" notes (Rescan / Enter manually / Looks right) and an inline editor writing back to the held record; "Missing" cues added then removed at the developer's request; name-case rule (ALL CAPS / all-lower → First-letter caps, mixed case untouched, parentheses never); One-/Two-sided batch toggle (pairs consecutive photos); Photograph → Scan beside Front/Back; Delete on every held card (record + Drive photos); control rows as equal halves with Extract/Clear above the sides row.
- **v06.83r also fired the first CHANGELOG rotation on the new EST day** — the 2026-09-15 date group (26 sections, v05.79r–v06.04r) archived with SHA enrichment (v05.90r's push commit has no version prefix; matched by its 04:43 timestamp).
- **Live**: `GEMINI_API_KEY` set on the Network project by the developer; the first card read and filed (Rai Energy); the Android "low memory" tab kill diagnosed (close background apps / gallery path); 20 cards now held in the phone's IndexedDB `pending` store with photos in `_inbox/`.
- **v06.89r** — the N1 session-2 paste-in prompt written under §13.5 (Fable 5.1 High); this session context.

### Where we left off

**N1 session 1 closed; session 2 (review, dedupe, save, checker, §11 flip, N2 brief) is next** — paste the block under §13.5. §11's N1 row stays *Proposed* until session 2. E0 (§13.4) can still run beside it.

### Key decisions made

- **Held cards live in IndexedDB `pending` until save** (record shape in §13.5's session-2 prompt); session 2 must not rename the db or drop the store — the developer's 20 cards are in it.
- **Drive access is a second token client in the PROJECT region** (`NW_DRIVE_SCOPE`), not a change to the template's sign-in scope; the first upload asks the consent once per tab.
- **Folder ids come from the list payload on load**; `nop=folders` only on demand, so the admin's first paint stays at exactly one request (the verifier asserts it).
- **Drive upload failure is soft** — extraction runs, `driveError` is kept on the record for save to retry.
- **UX rules the developer set** (keep in session 2): no id / confidence numbers on a card; no missing-field cues; names rule two-case only; Rescan removes the held card and its photos; Delete confirms.
- The QR vCard path (`nwQrSufficient` → no model call) is unexercised on a real card so far.

### Active context

- **Repo version v06.89r.** `CHANGELOG.md` at `Sections: 85/100`, seven dated 2026-09-21 — 78 non-exempt today, 85 on any later date: **no rotation due**. Archive at 504 sections.
- Network page changelog `Sections: 9/50`, GAS `4/50`. Verifier: `scripts/verify-network-roles.py` (door + capture + queue/drain + note/edit/delete round-trips; five screenshots in `.playwright-screenshots/`). `pip install playwright` is needed in a fresh container; Chromium is under `/opt/pw-browsers`.
- **Pre-existing, not this session's:** `verify-profiler-roles.py`'s guidance-progress check fails identically on `origin/main`; the template's `action=getData` route calls an undefined `processDataPoll()` (dead route).
- **§13 numbering:** N1 session 2 writes the N2 brief as §13.6 (or §13.7 if E0 took 13.6 first).
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged and gates phase R only.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open a Fable 5.1 High session and paste the N1 session-2 prompt block under §13.5 of `NETWORK-EVENTS-DESIGN-PLAN.md`** — the review card on the existing editor, company resolution, `nwFindDuplicate_` with merge, `nop=save` with the browser-side Drive move, soft delete / restore, `check-network-schema.py`, the §11 flip and the N2 brief — and save the 20 held cards as its done-when.
- **To continue:** type `run N1 session 2`

## Previous Sessions

**Date:** 2026-09-20 09:14:47 PM EST
**Repo version:** v06.81r — three pushes this session (`5798119` v06.79r the rollout, `59e29c9` v06.80r the probe table, this one), all on `claude/amazing-archimedes-kp0rh7`, restarted from `origin/main` before each
**Branch:** `claude/amazing-archimedes-kp0rh7`
**Model:** Fable 5.1 Medium

### What was done

**Q0 — the quota-counter rollout — done end to end, §11 row flipped.**

- **v06.79r** — `quotaProbe_()` + the `op=quota` dispatch copied verbatim from `Network.gs` into Classroom, Globalacl, MasterACL, Profiler, Receipts, Scraper, Testauthgas1, Testauthhtml1 (function in each file's first PROJECT region, after `aclHealthProbe_` where one exists; dispatch beside `op=deploy`, after `op=aclhealth` in Profiler/Receipts, marked `// PROJECT:`); Network's `nwQuotaProbe_` renamed to match. Nine GAS bumps (Classroom v01.86g, Globalacl v01.09g, MasterACL v01.15g, Network v01.03g, Profiler v01.40g, Receipts v01.30g, Scraper v02.21g, Testauthgas1 v01.08g, Testauthhtml1 v01.08g) with nine changelog entries; `scripts/check-quota.sh` on the `check-acl-health.sh` shape; README tree entry.
- **v06.80r** — first live `check-quota.sh` run after the merge, pasted into the v06.79r Notes: six deployed projects answered **on their new GAS versions** (deploy confirmed), three placeholder-id projects skipped, 27 executions today (Network 26, Profiler 1) = 0% of 20,000/day, exit 0.
- **v06.81r** — the N1 session-1 paste-in prompt written under §13.5 (Fable 5.1 High); this session context.

### Where we left off

**Q0 closed; next is N1 session 1 on Fable 5.1 High** — paste the block under §13.5. E0 (§13.4, Opus 5 xhigh) can run beside it. After N1 session 2: N2, then E0–E1 must be in before the bridge B. Dated target from D16: N1 and E1 live before RE+ 2026 opens on 2026-11-16.

### Key decisions made

- **The nine copies keep Network's comment verbatim** (including "defined once here and copied … by Q0") — the brief said same body and same comment, and Q's grep depends on identical text.
- **`audit_log_unreadable` counts as a failure in `check-quota.sh`**, not a warning — only `audit_log_disabled` / `spreadsheet_not_configured` are warnings per the brief; a live counter that cannot read its own log is the fault Q needs to see.
- **Two pushes were unavoidable for Q0**: the probe table could only be taken after the merge deployed the nine scripts.

### Active context

- **Repo version v06.81r.** `CHANGELOG.md` at `Sections: 103/100` — seven sections dated 2026-09-20 EST exempt, 96 non-exempt; **the first push dated 2026-09-21 EST or later rotates the 2026-09-15 date group** (SHA enrichment; unshallow first).
- Profiler's page changelog is at `Sections: 50/50` (its 2026-09-20 section exempt) — its next page bump on a later date rotates its oldest group.
- **`bash scripts/check-quota.sh`** is the fleet counter; run it by hand any day. Nothing schedules it yet — a daily Routine for it is Q's call.
- **Pre-existing, not this session's:** `verify-profiler-roles.py`'s guidance-progress isolation check fails identically on `origin/main`; the template's `action=getData` route calls an undefined `processDataPoll()` in every project (dead route).
- **§13 numbering:** N1 session 2 writes the N2 brief as §13.6; E0's brief reserves §13.6 for E1 — whichever writes first takes 13.6, the other 13.7.
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged and gates phase R only.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open a Fable 5.1 High session and paste the N1 session-1 prompt block under §13.5 of `NETWORK-EVENTS-DESIGN-PLAN.md`** — capture inputs with the front/back toggle, the IndexedDB offline queue, own-Drive upload into `Network App/_inbox/` with `nop=newid` ids, `nwExtractFromBase64_` on the Gemini `responseSchema` idiom, QR decode — and let it write the session-2 prompt at its close.
- **To continue:** type `run N1 session 1`

Developed by: LightAISolutions
