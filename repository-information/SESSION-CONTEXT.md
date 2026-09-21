# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-21 05:01:07 AM EST
**Repo version:** v06.90r — one push this session, on `claude/youthful-ride-75oah0` (restarted from `origin/main` f1abee3)
**Branch:** `claude/youthful-ride-75oah0`
**Model:** Fable 5.1 (N1 session 2 brief)

### What was done

**N1 session 2 — review, dedupe, save — built and verified against the stub; N1 flipped to Done (v06.90r).**

- **`Network.gs` v01.05g** — the write path in the PROJECT region: `nop=dupcheck` (`nwFindDuplicate_`: normalised email → E.164 phone → romanised-name + Account, answered before the write with the full matching row), `nop=save` (body-POST; enum + D5 stage validation, `nwAccountResolve_` new-or-existing Account, Contact row, `scan` Interaction; `mergeInto=` folds into the survivor with a `merge` Interaction carrying the absorbed `c-` id and the non-winning card pair; `distinct=` is the considered "two people"; any other duplicate refuses with the row), `nop=links` (post-move Drive links back to the row or the scan Interaction), `nop=get`, `nop=delete` / `nop=restore` (`account_has_contacts` + count). Audit rows ids and counts only.
- **`Network.html` v01.10w** — the review block on the existing editor (`nwReviewSection`: role, account block with the covered/uncovered chip and the D5 `gateStage`, source event, met date from `createdAt`, consent, DNC, notes → `rec.review`), Retry (`_nwHeldB64` or Drive read-back) and Swap pills, Save + Save all, registry resolution (`nwRegistry` / `nwResolveCompany` over `profiler-data/profiler-companies.json`, `nwExistingAccount` from the list payload), `nwSaveCard` → dupcheck → merge sheet (`nwMergeSheet`) or save → `nwFileCard` (account folder created + parked via `setfolders`, `nwDriveMove` addParents/removeParents) → links → pending deleted → `nwAfterWrite()`; list rows name · title · company, `nwRowDetail` (`nop=get`), delete → restore.
- **`scripts/check-network-schema.py`** (new, §14) — enum mirrors, D5 mirror, test ids, id generation, audit-row lexical check; exit 0. **`scripts/verify-network-roles.py`** extended with the stateful stub and the full save round-trip (order asserted: dupcheck, save, folder → setfolders → move → links → list; merge sheet, keep-separate, Save all, delete/restore). All checks pass at 390 × 844 with zero page errors.
- Plan §11 N1 row → Done; §13.6 written — the N2 brief + paste-in prompt (Fable 5.1 High). README tree entry for the checker; CHANGELOG `Sections: 86/100`, no rotation.

### Where we left off

**The 20 held cards have NOT yet been saved on the phone** — that is the developer's next action after this push deploys (v01.10w auto-refreshes the page; the `pending` store was not touched). Hand-off order given in chat: a two-sided card first (Save → check the Drive move of both sides), a Chinese-script one (romanised name + native script in parentheses, Retry if the read is poor), then the two Avantus cards (same title, different names/emails → no merge sheet; if one appears, use **Keep as a separate contact**). Then **Save all** for the rest. N2 (§13.6) is next; E0 (§13.4) can still run beside it.

### Key decisions made

- **Duplicate handling has three outcomes and no fourth**: Merge (survivor keeps its id), Keep as a separate contact (`distinct=<the declined id>` — only after seeing the match), or Cancel. The server refuses any other duplicate with the row; the stub and the real path agree.
- **Both card pairs are kept on a merge** by putting the pair that did not win the row into the `merge` Interaction's Summary (and the scan Interaction's Evidence Link when the older pair keeps the row via `nop=links` `interactionId`).
- **The company folder name** is the Account name with filesystem-unsafe characters replaced by `-`; its id is parked under `setfolders.accounts[<a-id>]` and read back from the list payload.
- **Registry fetch is relative** (`profiler-data/profiler-companies.json`) — public Pages, never a GitHub endpoint ([PC-PRIVATE-REPO] #18); offline it resolves to "no registry" and every company is local.
- **Retry uses the in-tab base64 when this tab scanned the card**, else reads the two files back from Drive with the user's `drive.file` token — the pending record shape is unchanged (no base64 stored).
- Session-1 UI rules kept: no ids / confidence numbers on a card, no missing-field cues, the name-case rule, the pill rows.

### Active context

- **Repo version v06.90r.** `CHANGELOG.md` at `Sections: 86/100`, eight dated 2026-09-21 — 78 non-exempt today, 86 on any later date: **no rotation due**. Archive at 504 sections.
- Network page changelog `Sections: 10/50`, GAS `5/50`. Screenshots in `.playwright-screenshots/` (`network-save-list.png`, `network-save-merge.png`). `pip install playwright` is needed in a fresh container; Chromium under `/opt/pw-browsers`.
- **Untested live:** the real Drive `files.update` move, `nop=save` against the real spreadsheet (first rows ever written to `Contacts` / `Accounts` / `Interactions`), the registry fetch from Pages. The stub exercised the request order and payloads only.
- **Pre-existing, not this session's:** `verify-profiler-roles.py`'s guidance-progress check fails identically on `origin/main`; the template's `action=getData` route calls an undefined `processDataPoll()`.
- **§13 numbering:** N2 brief is §13.6; N2 writes the E1 brief as §13.7 (or the next free number if E0 adds one).
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged and gates phase R only.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Save the 20 held cards on the phone first (two-sided → Chinese-script → the Avantus pair → Save all), then open a Fable 5.1 High session and paste the N2 prompt block under §13.6 of `NETWORK-EVENTS-DESIGN-PLAN.md`** — the Accounts surface, `nop=account`, the `Profiler.html#<slug>` deep links, the propose-a-dossier hook and the on-the-record check. If a save misbehaves on the phone, bring the status line text and the card's state (held / saved / photos moved) to a session before N2.
- **To continue:** type `run N2`

## Previous Sessions

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

Developed by: LightAISolutions
