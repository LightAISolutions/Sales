# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-19 05:42:31 AM EST
**Repo version:** v06.61r — one push, merged (auto-merge landed `afebc9d` on main; Classroom GAS v01.81g deploy step due on that merge), then this handover
**Branch:** `claude/beautiful-mayer-oxembl` — restarted from `origin/main` after the merge (`git fetch --prune origin`) for this handover

### What was done

- **Amperesand dossier + technology study guide (the Profiler Command and the Prep Command, one push).** Fable 5.1, two parallel `general-purpose` research subagents (first-party 24 sources; third-party ~38). Identity verified first: Amperesand Pte. Ltd. (UEN 202318356C, 2023-05-11) with US subsidiary Amperesand Inc. (Delaware, 2024-12-06); CEO Brian Dow on every dated source from 2025-10-31 — Gary Lawrence (appointed January 2025) left unannounced. `amperesand.profile.json` v1 (schema v7, intel-briefing): three product lines, 27-row spec table, 17 developments, 6 key judgments + indicators, 11 relationships, 4 policy exposures, 8 decision makers with four company-published headshots, 63 sources (first-party share 10% — businesswire.com 403s, so releases were read from syndications).
- **`amperesand.study.json`** (schema v2, 12 sections) and `study-prep/amperesand/amperesand-lesson-plan.md` — built as a sibling to the Heron Power guide (does not repeat its SST physics; owns silicon carbide, megawatt/port charging, five-nines arithmetic, bidirectional storage). Five concepts registered: `availability`, `mcs`, `partial-discharge`, `shore-power`, `v2g` (registry 1,465).
- **Registered:** roster entry (`aka[]`, `domains[]`), quarterly refresh-calendar row with seven watch items, segments `power-conversion-and-rack-power-silicon` challenger + `in-hall-power` adjacent; graph rebuilt; registry synced; corpus reconciliation read 2 inbound mentions (heron-power dossier + study guide), 0 changed.
- **Segment regeneration cascaded into Classroom:** the content checker fails until `segment-*` lessons match the registry, so both segments were regenerated (`build-classroom-segments.py --segment …`), Classroom.gs v01.80g → v01.81g, and `Classroomgs.changelog.md` hit its 50 non-exempt trigger — the 2026-09-14 group (nine sections, v01.30g–v01.38g) rotated to the archive with SHA links; counter `43/50`. Pipeline checker: P1 developer-path findings only, no P3; selftest 15 / 0.

### Where we left off

Everything is merged. The developer asked for a paste-ready prompt to run `profiler dg-matrix` + `profiler prep dg-matrix` in a fresh Fable 5.1 High session (given in the handover response). The four open decisions from the previous session (quarterly-review Routine amendment, (rr56), roster hash (rr59), stranded footer (rr22)) are unchanged and undated.

### Key decisions made

- **A new dossier that joins a segment regenerates that segment's lesson in the same push** — the content checker enforces it, so budget a Classroom GAS bump, a GAS changelog section, and possibly a GAS changelog rotation into every `profiler <Company>` run.
- **Unreconciled vendor figures stay unreconciled in the dossier** (4–10 / 5–10 / 6+ MW; 15+ / 20 / 20–30 years; IP55 vs IP65; the halved 10×/80% → 5×/50% claims); the June 2026 USD 30M round is recorded as third-party only.
- **Study guides for sibling companies cross-refer rather than repeat** — Amperesand's guide points at Heron Power's Modules 2–4 for the cascaded-cell physics.

### Active context

- **Repo version v06.61r** · `CHANGELOG.md` **103 raw / 98 non-exempt** (five sections dated 2026-09-19; the first push on a later EST day rotates the 2026-09-14 group of twenty) · `Classroomgs.changelog.md` 43 raw / 42 non-exempt · `Profilerhtml.changelog.md` 49.
- **GAS versions:** Classroom **v01.81g**, Scraper v02.20g, Profiler v01.39g. **Pages:** Profiler v01.90w, Classroom v01.16w.
- **Profiler corpus:** 175 dossiers; SST startups covered: heron-power, amperesand; DG Matrix not covered (mentioned in both SST guides and the power-conversion segment lesson from trade press).
- **Environment:** sec.gov and data.sec.gov blocked (efts.sec.gov full-text search answered); businesswire.com 403; the Profiler earnings desk still cannot push (Routines carry no repo source).
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Run `profiler dg-matrix` and `profiler prep dg-matrix` in one push** so the third hall-edge SST startup joins Heron Power and Amperesand — verify identity first (Raleigh, NC; USD 60M Series A February 2026 led by Engine Ventures with ABB and Mitsubishi Heavy Industries; "first company shipping commercial multiport SST"; named on NVIDIA's GTC 2026 roster), assign it to `power-conversion-and-rack-power-silicon` (regenerating that segment lesson → Classroom GAS bump), and cross-refer its study guide to the Heron and Amperesand guides instead of repeating the SST physics. Run on Fable 5.1 High.

**To continue:** type `profiler and profiler prep dg-matrix`

## Previous Sessions

**Date:** 2026-09-19 05:07:48 AM EST
**Repo version:** v06.60r — one push, merged (auto-merge run 693, ~17 s auto-merge job, **zero GAS deploy steps fired — "All GAS deploys confirmed the merged version (or none were due)"**, every Deploy step under a second, Pages deploy job skipped), then this handover
**Branch:** `claude/modest-bell-vb2pzt` — restarted from `origin/main` at session start, and again after the merge (`git fetch --prune origin`) for this handover

### What was done

- **THE QUARTERLY-REVIEW-ROUTINE APPLY SESSION (design §12 item 2) — RE-READ, PROVED UNCHANGED, NOT APPLIED. Fable 5.1 High, one session, one push, no `.gs`, no page, nothing authored, no Routine field touched.** The apply brief's two bracketed `[DEVELOPER: …]` slots — the approval sentence and the (rr59)/(rr56) answer — arrived a **second time** as their own placeholder text; a placeholder is "not taken" ((rr62), (rr66)), so the brief's own fallback governed: re-read, confirm, STOP.
- **`trig_01CrhxzfBV6uKQNKpUXLLMSZ` read through `list_triggers`** and its live `prompt` compared by `json.load` against the design annex's *as it stands* fenced block — **equal, character for character** (27 lines / 4,823 characters; the annex's 4,824 / 7,917 count the fenced block's trailing newline — same text, one counting convention apart). No `last_run`, no `last_fired_at` (**never fired**), `updated_at` 2026-09-16, `next_run_at` 2026-10-15T13:00:20Z, cron `0 13 15 1,4,7,10 *`, enabled. **`update_trigger` was not called.**
- **(rr60)'s count re-derived on the day through the health script's own `guidance_modules()` parser (28 modules):** landscapes reviewing on or before 2026-10-31 carry **five** rooms (utilities ×3 at 2026-10-01, neoclouds 2026-09-30, assurance 2026-10-31), **four** strictly before; cooling, in-hall-power and grid-equipment review inside the window with no room. A naive first-occurrence regex had first returned 19 landscapes with false dates silently — recorded in (rr68) as (rr64) a third time.
- **Recorded:** design §12 item 2 (RE-READ / STILL NOT APPLIED at v06.60r) and the annex header (keeps NOT APPLIED, notes the re-verification); `CLASSROOM-CURRICULUM-PLAN.md` §10.6 **(rr68)** and the §11 label → **(rr69)**; IRP §7 closing note (item 2 bullet, a third revision of the recommendation, register line at (rr68)/(rr69)). **`.claude/rules/industry-guidance.md` deliberately untouched** — its Freshness-discipline sentence would otherwise describe a prompt the Routine does not have.
- **CHANGELOG arithmetic re-counted:** pushed 2026-09-19 EST beside v06.57r–v06.59r, so **102 raw / 98 non-exempt**, no rotation, counter `102/100`; **the first push after the day boundary rotates the 2026-09-14 group of twenty**. `Classroomgs.changelog.md` untouched at 51 raw / 50 non-exempt.

### Where we left off

Everything is merged; Pages/GAS still serve **v01.80g / v01.16w** (zero deploy steps this push). **Four decisions remain open and the first has now been asked for twice:** design §12 item 2 is drafted verbatim in the design's §12 annex and needs a session whose brief carries the developer's approval **written in their own words in place of the `[DEVELOPER: …]` placeholder** — that session calls `update_trigger` (prompt only), reads it back with `list_triggers`, compares character for character (expect 7,916 characters by the JSON string), and records it in design §12 item 2, the annex header, §10.6 at (rr69), the IRP closing note (three remain) and the guidance rule's Freshness-discipline paragraph. Until then the Routine fires 2026-10-15 13:00 UTC with the prompt it has. (rr56), the roster hash ((rr59), §10.8 PROPOSED) and the stranded footer ((rr22)) are unchanged and undated.

### Key decisions made

- **A placeholder left in the slot is a blank slot, twice.** The session did not read the brief's surrounding intent ("APPLY session") as the approval; the C3 session 3 rule wants the sentence itself, in the session that makes the change. Nothing was fired, re-scheduled, renamed or re-modelled.
- **The rule file is not updated ahead of the Routine.** The apply brief's step (4) edit to `industry-guidance.md` was skipped because it is conditional on the amendment existing; recording a change that did not happen is drift.
- **The health script's parser is the authority for module dates.** An ad-hoc regex over `Classroom.gs` finds the id's first mention (prose or a stamp), not the module literal; `guidance_modules()` anchors on the function head. Briefs should say so rather than say "read it off the file".

### Active context

- **Repo version v06.60r** · `CHANGELOG.md` **102 raw / 98 non-exempt** (counter `102/100`; the next push on a later EST day rotates the 2026-09-14 group of twenty — read archive step 1, detach the footer first) · `Classroomgs.changelog.md` 51 raw / 50 non-exempt · `Profilerhtml.changelog.md` 49.
- **GAS versions:** Classroom **v01.80g** (deployment 93, 93/200), Scraper v02.20g (165/200 — the tight one), Profiler v01.39g. **Page:** Classroom v01.16w.
- **Baselines measured this session (pristine HEAD, and again after the edits — identical):** content checker **0 / 0 at 70 / 8 / 220**, module assertion 28; `--selftest` 15 / 0; `--base origin/main` nothing to judge at HEAD, P1 ×3 developer paths only after the edits; `--strict` no structural findings, 28 stale pins across 51 hand-authored lessons, 9 review items due (5 scenario lessons + 4 modules), coverage 14 of 14, moved-landscape 0 (ninth consecutive push), pools study 2,169 + lesson 533 + roster 314, decks 2,615 / 2,929 and 3,139 / 3,453 against 6,000; segments 19 / 0; readme tree 10 + 8 / 0.
- **The Routine, as read this session:** id `trig_01CrhxzfBV6uKQNKpUXLLMSZ`, name `Industry Guidance quarterly review`, cron `0 13 15 1,4,7,10 *`, enabled, next 2026-10-15T13:00:20Z, never fired, prompt = annex *as it stands* (4,823 chars).
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off
- **The findings register is at (rr68); the next session continues at (rr69).**

### Recommendation for next session

- **Apply the drafted amendment to the quarterly review Routine — but only after the developer has typed the approval sentence into the brief's slot in their own words, replacing the `[DEVELOPER: …]` placeholder rather than leaving it in place.** Two sessions have now stopped on the placeholder, correctly. The session reads `C5-SALES-SIMULATIONS-DESIGN.md` §12 annex, calls `update_trigger` with the annex's amended text as `prompt` and no other field, reads it back with `list_triggers`, compares character for character, and records it in design §12 item 2, the annex header, curriculum plan §10.6 at (rr69), the IRP closing note (three decisions remain) and the guidance rule's Freshness-discipline paragraph. Do it before 2026-10-15 13:00 UTC, the first firing. Run on Fable 5.1 High.

**To continue:** type `approve the quarterly review routine prompt change`

Developed by: LightAISolutions
