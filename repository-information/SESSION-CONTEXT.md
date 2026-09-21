# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-21 06:30:03 AM EST
**Repo version:** v06.93r — four pushes this session, all on `claude/youthful-ride-75oah0` restarted from `origin/main` before each: `96f04a5` v06.90r (N1 session 2 — review, dedupe, save), `39dc362` v06.91r (title / department / company standardisation + edit saved contacts), `44cacfb` v06.92r (the developer's fourteen casing calls + the Tidy pill), `1a3a6a0` v06.93r (Tidy feedback fix)
**Branch:** `claude/youthful-ride-75oah0`
**Model:** Fable 5.1 (N1 session 2 brief, then three follow-ups)

### What was done

**N1 is Done and used: the 20 cards are saved, corrected and tidied on the phone.**

- **v06.90r — N1 session 2** (`Network.gs` v01.05g, `Network.html` v01.10w): `nop=dupcheck` (`nwFindDuplicate_` email → E.164 phone → romanised name + Account, answered before the write), `nop=save` (enum + D5 stage validation, new-or-existing Account, Contact + `scan` Interaction; `mergeInto=` with a `merge` Interaction carrying the absorbed `c-` id and the non-winning card pair; `distinct=` the considered keep-separate; any other duplicate refuses with the row), `nop=links`, `nop=get`, `nop=delete` / `nop=restore` (`account_has_contacts`). Page: review block on the editor (role, account block with registry resolution and the `gateStage` D5 rule, source event, met date, consent, DNC), Retry / Swap, Save + Save all, merge sheet, browser-side Drive move `_inbox/` → `<Company>/` parked through `setfolders`, list rows with `nop=get` detail and delete / restore. `scripts/check-network-schema.py` (§14) new; verifier's save round-trip. Plan §11 N1 → Done; §13.6 N2 brief written.
- **v06.91r** (v01.11w / v01.06g): `nwStdField` / `nwTitleAbbrev` — titles, departments, company names word-wise First-letter caps, C-suite and acronyms kept, Vice President → VP, Executive Vice President → EVP, Senior → Sr.; registry casing wins for a covered company; **edit a saved contact** from its row (`nwRecFromRow` → shared editor → `nop=update`, `account-change` Interaction on a move).
- **v06.92r** (v01.12w): the developer's fourteen corrections encoded as rule — `NW_RANK_OF_RE` ("Director of X" → "Director, X" for rank titles; Head / Chief keep "of"), `NW_CASE_FIXES.rai` → RAI; **✨ Tidy titles & companies** on the Contacts card (`nwTidySaved`: `nop=get` → rule → `nop=update` per changed row). Rule recorded in `NETWORK-SCHEMA.md` §3.
- **v06.93r** (v01.13w): Tidy's feedback moved into the Contacts card (`#nw-list-status`, `_nwListStatus` across re-renders, built into the card directly), the pill counts "Tidying N of M…", rows re-case as they land, failures counted and named. **The developer confirmed Tidy works as intended on the phone.**

### Where we left off

**N1 closed for real: 20 contacts saved with the corrected titles and companies.** Next is **N2** (§13.6 of `NETWORK-EVENTS-DESIGN-PLAN.md`) — the Accounts surface, `nop=account`, `Profiler.html#<slug>` deep links, the propose-a-dossier hook, the on-the-record check against `decisionMakers[]`. E0 (§13.4, Opus 5 xhigh) can run beside it on another branch. The `Avantus` Drive folder still carries the pre-tidy name `AVANTUS` (a folder rename on account rename is on N2's list, step 1).

### Key decisions made

- **Duplicate handling has three outcomes and no fourth**: Merge (survivor keeps its id), Keep as a separate contact (`distinct=<declined id>`, only after seeing the match), Cancel. Never a bare "save anyway".
- **Both card pairs are kept on a merge** — the non-winning pair goes into the `merge` Interaction's Summary (or the scan Interaction's Evidence Link via `nop=links` `interactionId`).
- **Casing is a page-side rule, not a server one** — `nwStdField` runs at extraction, on load, on Retry, on edit, and over saved rows through Tidy. Words the developer rules on go in `NW_CASE_FIXES` (never a per-row special case); a rank followed by "of" takes the comma form; "Sr." carries the period; the comma form also applies to VP ("VP, Business Development").
- **Corrections to saved data are made from the page** (Tidy / Edit), because the spreadsheet is not reachable from a session.
- **Registry fetch is relative** (`profiler-data/profiler-companies.json`), never a GitHub endpoint; offline every company is local.
- Session-1 UI rules kept: no ids / confidence numbers on a card, no missing-field cues, the name-case rule, the pill rows, the two-half control rows.

### Active context

- **Repo version v06.93r.** `CHANGELOG.md` at `Sections: 89/100`, eleven dated 2026-09-21 — 78 non-exempt today, 89 on any later date: **no rotation due**. Archive at 504 sections.
- Network page changelog `Sections: 13/50`, GAS `6/50`. Verifier: `scripts/verify-network-roles.py` (door, capture, queue/drain, notes/edit, review, save, merge, keep-separate, Save all, delete/restore, standardisation cases incl. the developer's fourteen, saved-row edit, Tidy) — all passing at 390 × 844; `scripts/check-network-schema.py` exit 0. `pip install playwright` needed in a fresh container; Chromium under `/opt/pw-browsers`.
- **Live and exercised on the phone:** save, merge sheet, the Drive move, list rows, Edit, Tidy. **Not yet exercised live:** Retry from Drive read-back, Swap, delete → restore on a real row.
- **Pre-existing, not this session's:** `verify-profiler-roles.py`'s guidance-progress check fails identically on `origin/main`; the template's `action=getData` route calls an undefined `processDataPoll()`.
- **§13 numbering:** N2 brief is §13.6 (versions inside it read v06.91r / v01.11w / v01.06g — still accurate for the GAS; the page is at v01.13w); N2 writes the E1 brief as §13.7 or the next free number.
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged and gates phase R only.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open a Fable 5.1 High session and paste the N2 prompt block under §13.6 of `NETWORK-EVENTS-DESIGN-PLAN.md`** — the Accounts surface with edit and the folder rename, `nop=account`, the `Profiler.html#<slug>` deep links, the propose-a-dossier hook and the on-the-record check; its done-when runs against the 20 saved contacts and their accounts.
- **To continue:** type `run N2`

## Previous Sessions

**Date:** 2026-09-21 05:01:07 AM EST
**Repo version:** v06.93r — four pushes this session (`44cacfb` v06.92r, then this v01.13w Tidy-feedback fix) (`96f04a5` v06.90r the session-2 build, `39dc362` v06.91r titles / departments / company standardised + saved contacts editable, this one — the developer's fourteen casing calls encoded, the Tidy pill), on `claude/youthful-ride-75oah0` (restarted from `origin/main` f1abee3)
**Branch:** `claude/youthful-ride-75oah0`
**Model:** Fable 5.1 (N1 session 2 brief)

### What was done

**N1 session 2 — review, dedupe, save — built and verified against the stub; N1 flipped to Done (v06.90r).**

- **`Network.gs` v01.05g** — the write path in the PROJECT region: `nop=dupcheck` (`nwFindDuplicate_`: normalised email → E.164 phone → romanised-name + Account, answered before the write with the full matching row), `nop=save` (body-POST; enum + D5 stage validation, `nwAccountResolve_` new-or-existing Account, Contact row, `scan` Interaction; `mergeInto=` folds into the survivor with a `merge` Interaction carrying the absorbed `c-` id and the non-winning card pair; `distinct=` is the considered "two people"; any other duplicate refuses with the row), `nop=links` (post-move Drive links back to the row or the scan Interaction), `nop=get`, `nop=delete` / `nop=restore` (`account_has_contacts` + count). Audit rows ids and counts only.
- **`Network.html` v01.10w** — the review block on the existing editor (`nwReviewSection`: role, account block with the covered/uncovered chip and the D5 `gateStage`, source event, met date from `createdAt`, consent, DNC, notes → `rec.review`), Retry (`_nwHeldB64` or Drive read-back) and Swap pills, Save + Save all, registry resolution (`nwRegistry` / `nwResolveCompany` over `profiler-data/profiler-companies.json`, `nwExistingAccount` from the list payload), `nwSaveCard` → dupcheck → merge sheet (`nwMergeSheet`) or save → `nwFileCard` (account folder created + parked via `setfolders`, `nwDriveMove` addParents/removeParents) → links → pending deleted → `nwAfterWrite()`; list rows name · title · company, `nwRowDetail` (`nop=get`), delete → restore.
- **`scripts/check-network-schema.py`** (new, §14) — enum mirrors, D5 mirror, test ids, id generation, audit-row lexical check; exit 0. **`scripts/verify-network-roles.py`** extended with the stateful stub and the full save round-trip (order asserted: dupcheck, save, folder → setfolders → move → links → list; merge sheet, keep-separate, Save all, delete/restore). All checks pass at 390 × 844 with zero page errors.
- **v06.91r (v01.11w / v01.06g)** — `nwStdField` standardises titles, departments and company names (First-letter caps; C-suite and acronyms kept; Vice President → VP, Executive Vice President → EVP, Senior → Sr.; registry name wins for a covered company); a saved contact is editable from its row through `nop=update` (account re-resolved, `account-change` Interaction on a move).
- **v06.92r (v01.12w)** — the developer's corrections to the first saved contacts encoded as rule (`NW_RANK_OF_RE` "Director of X" → "Director, X"; `NW_CASE_FIXES.rai` → RAI) and **Tidy titles & companies** on the Contacts card re-cases every saved row through `nop=get` → `nop=update`. The 20 cards ARE saved on the phone now (the developer listed the contacts by name).
- Plan §11 N1 row → Done; §13.6 written — the N2 brief + paste-in prompt (Fable 5.1 High). README tree entry for the checker; CHANGELOG `Sections: 86/100`, no rotation.

### Where we left off

**The 20 cards are saved** (the developer corrected fourteen titles / companies by name at v06.92r). Tidy was tapped at v01.12w and "nothing happened" (feedback was off-screen; fixed at v01.13w with in-card progress). Next on the phone: tap **✨ Tidy titles & companies** once more so the rule lands on the rows saved before it (Avantus, RAI Energy, the Director/Sr. Director titles). N2 (§13.6) is next; E0 (§13.4) can still run beside it.

### Key decisions made

- **Duplicate handling has three outcomes and no fourth**: Merge (survivor keeps its id), Keep as a separate contact (`distinct=<the declined id>` — only after seeing the match), or Cancel. The server refuses any other duplicate with the row; the stub and the real path agree.
- **Both card pairs are kept on a merge** by putting the pair that did not win the row into the `merge` Interaction's Summary (and the scan Interaction's Evidence Link when the older pair keeps the row via `nop=links` `interactionId`).
- **The company folder name** is the Account name with filesystem-unsafe characters replaced by `-`; its id is parked under `setfolders.accounts[<a-id>]` and read back from the list payload.
- **Registry fetch is relative** (`profiler-data/profiler-companies.json`) — public Pages, never a GitHub endpoint ([PC-PRIVATE-REPO] #18); offline it resolves to "no registry" and every company is local.
- **Retry uses the in-tab base64 when this tab scanned the card**, else reads the two files back from Drive with the user's `drive.file` token — the pending record shape is unchanged (no base64 stored).
- Session-1 UI rules kept: no ids / confidence numbers on a card, no missing-field cues, the name-case rule, the pill rows.

### Active context

- **Repo version v06.93r.** `CHANGELOG.md` at `Sections: 89/100`, eleven dated 2026-09-21 — 78 non-exempt today, 89 on any later date: **no rotation due**. Archive at 504 sections.
- Network page changelog `Sections: 13/50`, GAS `6/50`. Screenshots in `.playwright-screenshots/` (`network-save-list.png`, `network-save-merge.png`). `pip install playwright` is needed in a fresh container; Chromium under `/opt/pw-browsers`.
- **Untested live:** the real Drive `files.update` move, `nop=save` against the real spreadsheet (first rows ever written to `Contacts` / `Accounts` / `Interactions`), the registry fetch from Pages. The stub exercised the request order and payloads only.
- **Pre-existing, not this session's:** `verify-profiler-roles.py`'s guidance-progress check fails identically on `origin/main`; the template's `action=getData` route calls an undefined `processDataPoll()`.
- **§13 numbering:** N2 brief is §13.6; N2 writes the E1 brief as §13.7 (or the next free number if E0 adds one).
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged and gates phase R only.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Tap Tidy titles & companies once on the phone, then open a Fable 5.1 High session and paste the N2 prompt block under §13.6 of `NETWORK-EVENTS-DESIGN-PLAN.md`** — the Accounts surface, `nop=account`, the `Profiler.html#<slug>` deep links, the propose-a-dossier hook and the on-the-record check. If a save misbehaves on the phone, bring the status line text and the card's state (held / saved / photos moved) to a session before N2.
- **To continue:** type `run N2`

Developed by: LightAISolutions
