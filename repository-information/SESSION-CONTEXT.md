# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-10-04 ~09:33 PM → ~10:00 PM EST (§3 row 12's prompt — F-I3: Apollo, Ares, Stonepeak — written as §15, then this save; two attended turns, no compaction)
**Repo version:** v07.93r → v07.94r (one push; this save is a housekeeping commit, no bump)
**Branch:** `claude/happy-hawking-u7vin4`

### What was done

- **`phase-f-action-plan.md` §15** — the F-I3 paste-in prompt (Opus 5.5 xhigh), section for section on §14, also given in chat. §3 row 12 points at it (its Why cell names the two 10-K filers, Stonepeak's private record, the covered ties `apex-clean-energy` / `prime-data-centers` / `dominion-energy`, and the re-measured counts); the "Prompts for these sessions" paragraph lists §15. Landed as v07.94r (d9deeaca), merged.
- **What §15 adds over §14:** F-I2's alias rule (only uncovered controlled platforms go in `aka[]` — softbank's DataBank/Zayo in, Vantage/Switch out; covered platforms take reciprocal edges); F-I2's two process slips as rules (`$` content only via files or `<<'EOF'`; every `*.sec.gov` request through curl with `SEC_USER_AGENT`, never WebFetch — Form ADV on adviserinfo.sec.gov included); per-company identity questions tied to the dossier carrying each claim; two known corrections; today's baselines (Classroom v02.00g → v02.01g, Classroomgs 41/50, 71 lessons / 8 tracks / 220 gate cases, registry 211 → 214, `capital` 15 → up to 18); the Megmeet paragraph testing F-I2's "capital is a door only at SB Energy" against these three firms' platforms.

### Where we left off

- All work committed and merged (v07.94r). **F-I3 itself has not run** — the prompt waits in §15 for a fresh Opus 5.5 xhigh session.
- Inbound counts measured 10/4 for that session: `\bApollo\b` 14 (coolit and cipher-mining are collisions, mgx career-only), `\bAres\b` 11 (delta-electronics' "Ares Chen"), `\bStonepeak\b` 2; platform names Cologix 6, Montera 3, Stream Data Centers 2, AMPYR 1 (fluence — possibly a different AMPYR).

### Key decisions made

- **Dominion's "all-stock" line is corrected inside F-I3's step 7**, minimally from the May 2026 merger 8-K (0.8138 NextEra shares plus a pro rata share of USD 360M cash), because F-I3 revises `dominion-energy` for the Stonepeak edge anyway; its pins stay loud and the full refresh stays `profiler Dominion Energy`'s. Offered to the developer as removable (delete item (2) under TWO KNOWN CORRECTIONS before pasting); no answer yet, so it stands as written.
- **Segment hypothesis in §15:** all three `capital` · challenger, Apollo the incumbent candidate through Stream; adjacent seats only on the Quinbrook precedent (the firm itself develops or operates).

### Known issues (left to the F-I3 identity check)

- `softbank` v1 records Ares preferred equity in SB Energy; `sb-energy` v1 does not name Ares.
- `xai` v6 names neither Apollo nor Valor; `vantage` v10 does not name Ares (the row's USD 2.4B facility).
- Unverified: Montera Infrastructure's ownership, the Japan BESS platform's legal name ("Kingdom" in the row), whether fluence's AMPYR is Stonepeak's.
- Process slip this session: reminders and session context were surfaced at the end of the first response instead of its start.

### Active context

- Branch `claude/happy-hawking-u7vin4`; repo v07.94r; Classroom GAS v02.00g; Profiler page v01.93w (unchanged). Coverage 211 dossiers; `capital` 15 (9 · 3 · 3). CHANGELOG 89/100; Classroomgs 41/50, Profilergs 40/50.
- `build-classroom-segments.py --check` on 10/4: assurance, software-and-optimization and insurance-and-risk-transfer due, all pin-only.
- Weekly limit at `allowed_warning` since F-I2 (resets Sat 10/10 7:00 AM ET). Toggles unchanged (START On, BOOKENDS Off, TIMING On, END On). Reminders untouched — the Dominion reframe reminder is the developer's to dismiss (row 10 landed it at v07.91r).

### Recommendation for next session

- **Paste `phase-f-action-plan.md` §15 into a fresh Opus 5.5 xhigh session** — F-I3 (Apollo, Ares, Stonepeak): identity first (two 10-K filers, Stonepeak through Form ADV), `aka[]` on F-I2's rule before the step-7 grep, the two known corrections, segment lessons regenerated (Classroom → v02.01g), §3 row 12 flipped — so wave B (row 15, by Wed 10/14) seats the full capital roster.

**To continue:** type `run the F-I3 prompt in phase-f-action-plan.md §15` (or paste §15 directly).

## Previous Sessions

**Date:** 2026-10-04 ~07:34 PM → ~09:05 PM EST (§3 row 11: F-I2 — SoftBank, SB Energy, Blue Owl; one attended turn with one context compaction mid-reconciliation)
**Repo version:** v07.92r → v07.93r (one push)
**Branch:** `claude/awesome-ride-130y7a`
**Model:** Opus 5.5 (`claude-opus-5-5`) at xhigh, as the row asked; `get_session` exposed `usage.cost_usd` **USD 65.50** shortly before the commit; rate limit `allowed_warning` on the seven-day window, no overage, resets Sat 10/10 7:00 AM ET

### What was done

- **The gate first:** the DigitalBridge close verified from DigitalBridge's completion Form 8-K (CIK 1679688, accession 0001104659-26-112148) — merger completed 30 September 2026 at USD 16.00 a share, the parent wholly owned by SoftBank Group Overseas GK — so SoftBank's dossier was written once, with the close as fact.
- **Three dossiers** (profileVersion 1, intel-briefing), **three v2 guides** and **three lesson plans**: `softbank` (74 sources; capital incumbent), `sb-energy` (32; aidc-developers-and-landlords challenger and storage-developers-and-ipps challenger — changed from the hypothesis' adjacent), `blue-owl` (41; capital incumbent). Nine new concepts. Calendar: softbank 11/10 and blue-owl 10/29 confirmed; sb-energy a quarterly core cadence row.
- **Step 7:** 66 raw aka hits read; 29 dossiers revised with reciprocal edges; three corrected (`abb` Robotics not closed, `iren` USD 2.4bn not 2.8bn, `meta` no '$26B PIMCO'); `vantage.study.json`'s STACK line corrected; 11 report pins re-verified edge-only, `abb` ×2 and `meta` left loud.
- **Classroom:** 11 segments with section changes regenerated, 8 pin-only left; Classroom.gs v02.00g. **Plan:** §11.3 rows flipped with verdicts; §3 row 11 landed; row 15's DigitalBridge fallback retired.

### Where we left off

- All F-I2 work committed and pushed in one commit (v07.93r); the auto-merge workflow merges it.
- Nothing deferred from F-I2: every slug in the step-7 read was reconciled in full, so no slug is carried to a later session.
- **Megmeet hand-off (the row's question):** SoftBank's door is **SB Energy**, which owner-furnishes high-voltage transformers, switchgear and inverters and will equip ~8.8 GW-IT of OpenAI campuses (Milam County under construction, PORTS-Pike contracted) — a real MV/DC power-equipment buyer, gated by a CFIUS security agreement on vendors and OpenAI's consent rights over key design contracts; the PORTS gas generation and its turbines belong to another SoftBank affiliate. Through **DigitalBridge** SoftBank now owns the manager above Vantage, Switch and DataBank — each buys through its own management, so capital is a **way to find those buyers, not a door**. Blue Owl is the same: its funds own **STACK** (the door is STACK's procurement, including Jupiter for Oracle), while at Hyperion Meta specifies and at Abilene Crusoe does. Net: capital is a door only at SB Energy; everywhere else it is a directory.

### Key decisions made

- **SB Energy storage role → challenger, not adjacent.** Adjacent means 'not the company's primary business'; solar and storage produce 'substantially all' its revenue and 5.35 GWh of batteries are under construction. Recorded in §11.3 and the CHANGELOG.
- **Blue Owl → capital incumbent** (the row said 'decide on the record'): ~9 GW of data-centre capacity through STACK, 80% of Hyperion, the Abilene JV and GPU lending.
- **Lender and indirect links are typed `other`** on both sides (F-I1 precedent) — four accepts recorded (abb×softbank, blackrock×blue-owl, blue-owl×iren, blue-owl×oracle).
- **Pins:** re-verified only edge-only revisions (each mechanically checked: every pre-existing field identical to the archived copy, every cited source unchanged); substantive revisions (`abb`, `meta`) left loud.
- **README completeness:** five earlier archive files the tree had missed were listed along with this session's 29.

### Known issues

- `check-profiler-reports.py`: 7 warnings — `abb` (×2) and `meta` loud by design; `fluence`, `jinko`, `jupiter-power` and `oracle` were aged before this session and were not re-verified here.
- `check-classroom-pipeline.py` reports its unattended-committer findings (an 11-lesson regeneration against a cap of 3, same-day `updated` dates); expected for a developer regeneration session, not a gate for it.
- **Shell-expansion lesson:** two values in this session's own `sb-energy` draft were corrupted by an unquoted heredoc (`$4`, `$1` expanded) and fixed before commit. Write JSON containing `$` only through files or quoted heredocs (`<<'EOF'`).
- Process slip: one research subagent made a single WebFetch to sec.gov with the default User-Agent.
- SoftBank's OpenAI tranche figures (USD 2.2bn + 7.5bn + 22.5bn) sum to USD 32.2bn against its own USD 34.6bn cumulative at 31 March 2026; the gap is not explained in the sources read, and the dossier states SoftBank's cumulative figure.

### Active context

- Branch `claude/awesome-ride-130y7a`; repo v07.93r; Classroom GAS v02.00g; Profiler page v01.93w (unchanged).
- Coverage 211 dossiers; capital segment 15 members (9 · 3 · 3). CHANGELOG 88/100; Classroomgs and Profilergs changelogs 41/50 and 40/50.
- Toggles unchanged (START On, BOOKENDS Off, TIMING On, END On). Reminders untouched.

### Recommendation for next session

- Run §3 row 12, **F-I3 — Apollo, Ares, Stonepeak** (Opus 5.5 xhigh), with the §14 prompt as its pattern: verify identity first (two 10-K filers), populate `aka[]` before the step-7 grep, and expect the `capital` roster to reach 18 before wave B (row 15, by Wed 10/14), which now teaches the DigitalBridge close as fact.

**To continue:** type `write the F-I3 prompt` (then paste it into a fresh Opus 5.5 xhigh session).
