# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-22 12:29:48 AM EST
**Repo version:** v07.06r — ten pushes this session on `claude/repo-access-denied-339rna`, rebased onto `origin/main` before each: `66f18297` v06.97r, `2cd6348b` v06.98r, `1ed61dc0` v06.99r, `4f9fca6c` v07.00r, `e7ed2c5e` + `c347b37e` v07.01r, `ea5f52f7` v07.02r, `afb26ada` v07.04r, `814c7281` v07.05r, `38c8da9d` v07.06r. `70a0c488` v07.03r is **not mine** — it is the Classroom C2 pipeline's own first commit.
**Branch:** `claude/repo-access-denied-339rna`
**Model:** Opus 5

### What was done

**The "Repo access denied" issue is closed, and the whole Routine fleet is rebuilt and proven.**

- **Root cause**: `create_trigger` has no `sources` parameter, so every agent-created Routine fired into a session with no checkout and could never push. Proved by a controlled A/B on 2026-09-21 — two live earnings desks, identical but for the attached repository: the old one 33s / $0.11 / no commit, the new one ~14m / $13.86 / commit `cdfafb36` with 13 files and +2,020 lines.
- **The UI's Edit form does NOT expose repositories**, despite the current documentation saying it does. Re-tested by the developer on C2: Edit opens, no repositories field, and **Runs with** shows only environment and model. Rebuild is mandatory; recorded so it is not re-litigated from the docs a third time.
- **All five committing Routines rebuilt** (developer, via the claude.ai form) with `LightAISolutions/Sales` attached and **zero connectors**. C2 and Industry Guidance set to **Opus 5**; the two Profiler ones to **Sonnet 5**. The ACL health check is read-only and was deliberately **not** rebuilt.
- **Four old `meta_mcp` copies deleted** — after archiving their prompts verbatim to `repository-information/routine-prompts-archive.md`, because a pre-delete check found `crusoe`'s research priorities had only partly survived the move into `watch[]`.
- **Coverage gap found and closed**: 64 of 177 dossiers (36%) were covered by no Routine at all, 31 of them in Megmeet-adjacent segments including the four SST peers. Root cause was the hardcoded 21-company list in the sweep prompt. Every cadence row now carries a `tier` — 52 `core` (90d), 33 `watch` (180d), 0 untiered — and the sweep reads tiers, so coverage changes by commit.
- **Both cache levers implemented, and lever 1 made automatic.** Measured where the calendar's bytes were: `watch` 66.4% + `source` 31.6% = 98%, none of it read by the queue logic. Split to `profiler-refresh-notes.json`; the calendar went **384,240 → 21,576 bytes (−94%)** and 2,573 → 1,069 lines, back under the Read tool's 2,000-line default. Lever 2 split 186 lines out of `profiler-app.md` (**−38%**). Net ≈ **−$2.49/run on the desk, ~$55/month**.
- **Two checker fixes**: `build-classroom-segments.py --check` now separates real work from pin churn (was 16 due with 15 pin-only), and the P9 fixture in `check-classroom-pipeline.py` was repaired — it derived its briefing id from `coveredThrough` and collided with the real briefing the moment the pipeline's first commit advanced the watermark. `--selftest` back to **15 fixtures / 0 failures**.
- **C2 landed its first-ever commit** (`70a0c488`), audited independently: 7 paths all inside contract §3, nothing forbidden touched, ledger watermark advanced off `null`, all gates clean.

### Where we left off

Everything is committed, pushed and merged. The repo is green: all four C2 gates pass, `--selftest` is 15/0, `check-readme-tree.py` is 0 findings, `sync-profiler-registry.py` is 0 findings. Six Routines live, all enabled, all with zero connectors.

**The Megmeet briefing was deliberately deferred** — the developer wants it after the Network and Events build plan and closer to the 2026-10-07 start date. The prompt is preserved at `repository-information/megmeet-briefing-prompt.md` and a reminder is in `REMINDERS.md`.

### Key decisions made

- **Sonnet 5 stays the default for Routines; Opus 5 only where a checker cannot see the failure.** Every failure in the saga was infrastructural, not a run reasoning badly. C2 and Industry Guidance write curriculum whose correctness a structural checker cannot verify — a fabricated provenance pin passes every gate — so they get Opus 5. Haiku is disqualified by arithmetic (200K context vs runs of 335K and 361K). Fable is wrong for unattended work because it alone draws the 50% weekly sub-allocation.
- **`usage.cost_usd` is API list-price valuation, not a balance charge** — verified by reconstruction to 0.75%. Drawn from plan allocation; `isUsingOverage: false`.
- **Before writing a prompt instruction to work around a file, measure the file.** A data fix outlives every prompt that would have worked around it — and a prompt cannot be edited after its Routine is created.
- **`created_via` alone is not a safe delete filter** — the ACL check is `meta_mcp` and must survive. The rule is `meta_mcp` minus the ACL check.
- **The API's `sources` field is not evidence of repository attachment** — it reads empty even on Routines that have demonstrably committed. The **Runs with** card is the only reliable check (v06.70r trap, held again).

### Active context

- **Branch:** `claude/repo-access-denied-339rna` · **repo version** v07.06r · CHANGELOG `Sections: 102/100` raw but **78 non-exempt** (24 dated 2026-09-21 EST) — a counter reading over 100 is expected here and is **not** a rotation signal.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Routines (6, all enabled, all zero connectors):** earnings desk weekdays 13:00Z (default model) · C2 Wednesdays 11:00Z (Opus 5) · quarterly check 1 Jan/Apr/Jul/Oct 13:00Z (Sonnet 5) · opportunity report 1st monthly 17:00Z (Sonnet 5) · Industry Guidance 15 Jan/Apr/Jul/Oct 13:00Z (Opus 5) · ACL health check daily 10:00Z.
- **Open, none blocking:** (1) the Megmeet briefing, deferred by choice; (2) the sweep lag — core rows come due **2026-11-27** but the sweep next fires **2027-01-01**, a 35-day gap, and a monthly cadence with the tier gate would close it cheaply; (3) Receipts' ACL grace snapshot may still be unarmed — the daily ACL run reports it as a warning, and one successful Receipts sign-in arms it.
- **Reminders:** the 2026-09-19 repo-access reminder is now fully satisfied by this session's work but was **left open deliberately** — it is developer-owned and only the developer closes it.

### Recommendation for next session

- **Resume the Network and Events build** — E0 is done (`events.json`, `events-sources.json`, the checker, 73 events), so E1 is next, with its brief already written as §13.7 of `NETWORK-EVENTS-DESIGN-PLAN.md`. That is the developer's stated priority, and the Megmeet briefing is explicitly queued behind it.
- **To continue:** type `run E1`

## Previous Sessions

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
