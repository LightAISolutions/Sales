# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-21 07:23:55 AM EST
**Repo version:** v06.94r — one push this session: `a840bf6` v06.94r (N2 — accounts and the corpus attachment) on `claude/zen-heisenberg-426g6h` restarted from `origin/main`; merged to `main` (`040f6a1`)
**Branch:** `claude/zen-heisenberg-426g6h`
**Model:** Fable 5.1 (N2 brief, §13.6)

### What was done

**N2 is Done (§11 flipped, v06.94r) — `Network.gs` v01.07g, `Network.html` v01.14w.**

- **`Network.gs`**: `nop=account` (body-POST, `nwAccountOp_` → `nwAccountFullFromPayload_` = the save-path validator + Tags / Newsroom URL / Notes; a rename rewrites `Normalised Name`, refused with `account_name_taken` when another live account holds the key; audit `{ accountId, renamed, tags: count }`); the list op's one widening, `contactCount` per account; `nop=get` on an `a-` id lists the live contacts beneath; `nwAccountPublic_` carries `newsroomUrl`.
- **`Network.html`**: the **Accounts card** under Contacts (`nwAccountsCard` / `nwAccountRow` / `nwAccountDetail`; its own status line `nwAcctStatus` kept across re-renders), **Edit** through the shared `nwAccountBlock` (lifted out of `nwReviewSection`; the review card is unchanged in appearance), Delete refused with the count via `nwRowMark`, the relative `Profiler.html#<slug>` link (`nwProfilerHref`) on the row / account detail / contact account line (`nwAccountLine`), segments by label (`nwSegments` from `profiler-segments.json`), **Propose a dossier** (`nwProposeDossier`: exact `profiler <Company>` line copied + shown, `dossier-proposed` tag through `nop=account`), the **on-the-record** check (`nwRecordCheck` → `nwProfile(slug)` fetched only on detail open, `nwNameKey` mirror; title mismatch shown as a note), and `nwFolderRenameIfDrifted` inside `nwEnsureAccountFolder` (§6 rename on the next save — also repairs the `AVANTUS` folder once a card is filed under Avantus).
- **Checkers**: `check-network-schema.py` asserts the D5 validator on both `nop=save` and `nop=account` (allow-list gained `renamed`, `tags`); `verify-network-roles.py` runs the accounts round-trip against the stub and the **served** `abb.profile.json` (two new screenshots). All five checks green.
- **Docs**: plan §11 N2 → Done; **§13.7 = the E1 brief** (Events scaffold + calendar, two sessions, E0 a stated prerequisite) with its paste-in prompt; schema §3 / §12 / §14; README tree descriptions; CHANGELOG `Sections: 90/100`.
- The E0 paste-in prompt was handed to the developer in chat at the close (Opus 5 xhigh; §13.4 with its stale "write E1 as §13.6" line corrected — E1 is already §13.7).

### Where we left off

**N2 built and verified on the stub; not yet exercised on the phone.** The phone check to run at v01.14w / v01.07g: an Accounts row for every company from the 20 cards, the Profiler link on a covered account, the `profiler <Company>` line from an uncovered one, the on-the-record title for a contact in a dossier's `decisionMakers[]`, and an account Edit (relationship away from Target/Customer greys the stage). **Next phase is E0** (§13.4, Opus 5 xhigh) — the developer asked for the prompt; then E1 (§13.7).

### Key decisions made

- **The account block is one function** (`nwAccountBlock`): the review card and the account editor must never diverge; `opts.full` adds name / tags / HQ / newsroom / notes.
- **The dossier is read only when a detail opens** — never on the list paint; cached per slug (`_nwProfiles`) for the page's lifetime. Decision-maker entries carry no `source` field in any shipped profile, so the line cites the dossier's `lastUpdated`.
- **Folder rename is drift-based**: every filing does one `files.get` and renames when the name differs — stateless, so a Tidy or an edit made in another tab still lands.
- **The propose hook writes a tag, nothing else**; the clipboard is best-effort and the line is always visible.
- Meta tag and `html.version.txt` bump together — bumping the meta first caused a one-time reload that doubled the list request in the verifier (caught, fixed).

### Active context

- **Repo version v06.94r**, `CHANGELOG.md` `Sections: 90/100`, twelve dated 2026-09-21 — no rotation due. Network page changelog `14/50`, GAS `7/50`.
- `pip install playwright` needed in a fresh container; Chromium under `/opt/pw-browsers`. `verify-network-roles.py` ≈ 2 min.
- **Pre-existing, not this session's:** `verify-profiler-roles.py`'s guidance-progress check fails identically on `origin/main`; the template's `action=getData` route calls an undefined `processDataPoll()`.
- **§13 numbering:** §13.6 = N2 brief (done), **§13.7 = E1 brief**; E0's §13.4 says "write E1 as §13.6" — stale, E0 writes nothing new in §13; the next free number is §13.8 (the B brief, written by E1 session 2).
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged and gates phase R only.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open an Opus 5 xhigh session and paste the E0 prompt** (§13.4 of `NETWORK-EVENTS-DESIGN-PLAN.md`; the version handed over in chat at the close of N2, which notes E1's brief already exists as §13.7) — the registry and roster are E1's hard prerequisite.
- **To continue:** type `run E0`

## Previous Sessions

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

