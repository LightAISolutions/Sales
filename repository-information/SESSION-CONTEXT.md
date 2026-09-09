# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-09 02:54:52 AM EST
**Repo version:** v05.26r — **two push commits** on `claude/elegant-clarke-etxlwc` (v05.26r landed and merged; this session-context commit is the second). Two commits because the first push merged and the branch was deleted before the second — the sanctioned multi-commit case
**Branch:** `claude/elegant-clarke-etxlwc`
**Model:** Opus 5 xhigh — **S3 P3 · group `E1a` (Stem)**, then the P4 paste-in prompt

### What was done

1. **P3 shipped (v05.26r).** `stem` (90 sources, 80% first-party) with a 16-section study guide and a nine-module lesson plan. `software-and-optimization` went 16 members / 1 incumbent / 1 challenger → **17 / 2 / 1**; Stem also took `storage-developers-and-ipps` · **adjacent** on its consolidated DevCo storage-origination joint ventures. Fourteen shared concepts registered (1,311 → 1,325) and six company-published headshots downloaded
2. **The §8 premise held but its basis did not.** `incumbent` is right — on **solar and hybrid asset-performance management** (38.3 GW under management, $62.4m ARR), **not** on storage bidding, where the fleet has been flat at 1.7–1.8 GWh for two years. Stem appears on **none** of the 2024 Guidehouse VPP / Grid DERMS / grid-edge DERMS leaderboards nor S&P Global's 2026 Tier 1 list; Modo Energy's 2025 directory quantifies six peers and not Stem. Its only ranking is Guidehouse's **2022** first place for AlsoEnergy; its only contemporary recognition is **The smarter E AWARD 2026** for PowerTrack EMS
3. **A date error found in Stem's own FY2025 10-K.** The filing dates the Athena → PowerTrack Optimizer rebrand to "September 2024"; the press release is datelined **5 September 2025**, says "today announced", launches the refreshed site "live on Sept. 5", and quotes a CEO appointed in January 2025. Resolved against the filing, with the three grounds recorded in the dossier
4. **Two of my own research-brief premises were wrong and the agents corrected them** — there was no 2024 restatement (an in-period $38.7m variable-consideration reduction plus a $104.1m bad-debt charge; ICFR effective, no material weakness), and there is no going-concern qualification at either filing

### Where we left off

All work committed, pushed and merged. The **P4 paste-in prompt was handed to the developer in chat** and is reproduced in the recommendation below — the next session is a fresh Opus 5 xhigh session, not a continuation of this one.

### Key decisions and findings

- **The reachability probe was wrong for this session, and the §7 rule caught it.** `check-source-reachability.py` reported `sec.gov` and `data.sec.gov` **BLOCKED**, but a direct probe with a declared non-personal User-Agent returned **200** on EDGAR company search, filing indexes and full 10-K/10-Q documents — and the entire first-party financial record came from them. The roster's verdict bounded the roster's URL, not the filing route. **`businesswire.com` is genuinely blocked** (403 on three attempts) and every affected citation was substituted with the identical release on `investors.stem.com`, which is a better tier anyway
- **The corpus reconciliation changed nothing, deliberately, and the reasoning is on the record.** Six inbound files reviewed. `dnv` and `kwh-analytics` both name **"Also Energy"** — Stem's own subsidiary since February 2022 — as an independent competitor platform. Those claims are **accurate as written** (alsoenergy.com still resolves), so neither dossier was revised; the alias went into `aka[]` instead, so the next reconciliation finds the link by search rather than by luck. `sungrow` was a false positive ("Stem Cell Grid-Forming" is Sungrow's own technology name)
- **Two incidental changes were made and reverted before committing.** I had reformatted `profiler-concepts.json` and `profiler-companies.json` from indent 2 to indent 1 (a 22,000-line spurious diff) and re-sorted the registry — which is **appended-at-end** by convention, not sorted. Both restored. **For future sessions: match each JSON file's existing indent, and append new registry entries at the end.**
- **A pacing lesson for dossier sessions:** the first-party agent returned **last** (14m 47s against 10m 16s) and invalidated more of the already-written draft than the third-party agent did — a missing product line, the rebrand date, the debt structure and three executives. Wait for the first-party report before merging anything

### Active context

- **Repo version** `v05.26r`; CHANGELOG at **92/100** sections — rotation due at 100, so roughly **eight pushes of headroom**, i.e. around the end of the remaining S3 sessions
- **S3 progress: 4 of 10 sessions** (P1, P2, V1, P3 done). Remaining order: **P4 → P5 → P6 → V2 → V3 → V4**
- **Segments at the floor:** compute-and-the-rack, insurance-and-risk-transfer, assurance, software-and-optimization (on the letter). **Held:** `software-and-optimization`'s landscape, on V2 — and P3 sharpened why it will stay hard: **both** of its incumbents reach the segment from an adjacent business (FlexGen from integration, Stem from solar APM), so every pure-play merchant optimizer is on the private side
- **The `software-and-optimization` segment lesson is flagged DUE for regeneration** by `check-classroom-curriculum.py --strict`. Not run here — §7 assigns the generator to an S1/developer session
- **Dated re-check triggers now live in §8 rows:** `novonix` on **2026-09-14** (Nasdaq minimum-bid cure deadline), `intertek` on **court sanction** (Q4 2026 – Q1 2027, then delisting), `habitat-energy` **quarterly** while Quinbrook's sale process runs. Stem's own calendar row carries `nextReport` **2026-11-04**, unconfirmed
- **Offered and not taken** (needs developer approval, carried from last session): adding `aka[]` to the `Profiler.html` roster search haystack (~line 2202, currently `(c.name + ' ' + c.slug)`), narrowed to names-only by explicit developer directive 2026-08-30. Would require a page version bump. P3 made the case slightly stronger — Stem's fourteen aliases include PowerTrack, Athena and AlsoEnergy, none of which the roster can currently find
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **S3 P4 — group `E3a` (UL Solutions · Intertek) on Opus 5 xhigh**, as a fresh session using the paste-in prompt handed over in chat. It is position 5 in the reordered sequence and is **deepening, not unblocking** — `assurance` was cleared by V1 at v05.21r, so P4 takes it from 4 members / 2 incumbents to 6 / 4. The reason to run it now rather than later is **Intertek**: its shareholder-approved take-private by Isotope Bidco (EQT X, ADIA/Luxinva, Mubadala) at £61.077 per share was approved 98.72% on 2026-08-06 and completes **on court sanction in Q4 2026 – Q1 2027**, so running it sooner records a clean signed-but-not-closed deal rather than one straddling the sanction date. Both §8 identity cells were checked on 2026-09-09 and both carry traps the session must use — UL Solutions is a **controlled company** (ULSE Inc. holds 123,755,000 Class B shares and the majority of voting power) whose December 2025 offering was a **selling-stockholder secondary** that raised the company nothing, and "UL" must never be grepped bare because three distinct UL entities exist

**To continue:** type `continue with your recommendation`

## Previous Sessions

### Session — 2026-09-09 01:49:21 AM EST (v05.25r)

**Date:** 2026-09-09 01:49:21 AM EST
**Repo version:** v05.25r — **three push commits** on `claude/upbeat-meitner-mphsur` (v05.22r, v05.23r, v05.24r landed; v05.25r is this one). Multiple commits because each push merged and the branch was deleted before the next — the sanctioned multi-commit case
**Branch:** `claude/upbeat-meitner-mphsur`
**Model:** Opus 5 xhigh — **S3 P2 · group `E2a` (Marsh McLennan · Aon)**, then three developer follow-ups: the stale-identity fix, the naming question, and the S3 reorder

### What was done

1. **P2 shipped (v05.22r).** `marsh-mclennan` (121 sources, 50% first-party) and `aon` (100 sources, 41%) with study guides; `insurance-and-risk-transfer` went 1 · 0 · 1 → **3 · 2 · 1, at the floor**, making three of four blocked landscapes writable
2. **The naming question resolved structurally (v05.23r)**, not by picking a label. Added `companies[].aka[]` to the registry (schemaVersion 3), a "Naming and renames" section to `PROFILER-SCHEMA.md` with a grep-based collision test, and **Profiler Command step 1a — mandatory identity verification before research**
3. **All sixteen unauthored Phase E companies identity-checked as a batch (v05.24r)** by two parallel agents. **Ten carried something wrong, dead or missing.** Each §8 row's `Checked` cell now records the result; the preamble states what was verified and that a batch check resets the clock rather than retiring step 1a
4. **§10.4 reordered (v05.25r, this commit)** — the public and private lanes no longer interleave

### Where we left off

All work committed and pushed. The **P3 paste-in prompt was handed to the developer in chat** and is reproduced in the recommendation below — the next session is a fresh Opus 5 xhigh session, not a continuation of this one.

### Key decisions made

- **Display name stays "Marsh McLennan."** "Marsh" fails the collision test twice (Clearway's Marsh Landing plant, Entergy's CEO Drew Marsh). The label was never the systematic risk — the risk is reconciliation grepping a display name and missing inbound claims, which `aka[]` fixes. Measured: grepping `Marsh McLennan` returns **2** dossiers, the `aka[]` set returns **6**, and the extras include `dnv`, which carries the most important inbound claim
- **The S3 lanes are de-interleaved on budget, not arithmetic** (developer directive, weekly Fable at 96% consumed against 13% of all-models). Four Opus sessions run first (P3 → P4 → P5 → P6), then three Fable (V2 → V3 → V4). The dependency check cleared it: **V2 is the only remaining session that gates anything**
- **Identity verification is per-company at authoring, and a batch check does not retire it.** Written into the §8 preamble explicitly, because a `Checked` cell dated 2026-09-09 is evidence about that day only
- **A correction the developer should know I made mid-session:** I twice referred to Habitat Energy · Gridmatic as "V1". It is **V2**; V1 was kWh Analytics · CSA Group and shipped 2026-09-08. The plan file was always correct

### Active context

- **Repo version** `v05.25r`; CHANGELOG at **91/100** sections — rotation due in ~9 pushes, i.e. around the last of the seven remaining S3 sessions
- **S3 progress: 3 of 10 sessions** (P1, P2, V1 done). Remaining order: **P3 → P4 → P5 → P6 → V2 → V3 → V4**
- **Segments at the floor:** compute-and-the-rack, insurance-and-risk-transfer, assurance. **Held:** `software-and-optimization` — needs both P3 and V2
- **Three dated re-check triggers now live in §8 rows:** `novonix` on **2026-09-14** (Nasdaq minimum-bid cure deadline), `intertek` on **court sanction** (Q4 2026 – Q1 2027, then delisting), `habitat-energy` **quarterly** while Quinbrook's sale process runs
- **Two numeric scale traps** recorded in §8: Stem's 1-for-20 reverse split (2025-06-23) and Novonix's 1:4 → 1:40 ADS ratio change (2026-08-27) — pre-date per-share figures are off by 20× and 10×
- **P5's alternates are no longer interchangeable:** ICL is out (US LFP project cancelled 2025-11-11), Syrah is at-risk and pre-commercial, Westwater alone is clean
- **Offered and not taken** (needs developer approval): adding `aka[]` to the `Profiler.html` roster search haystack (~line 2202, currently `(c.name + ' ' + c.slug)`), narrowed to names-only by explicit developer directive 2026-08-30. Would require a page version bump
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **S3 P3 — group `E1a` (Stem) on Opus 5 xhigh**, as a fresh session using the paste-in prompt below. It is position 4 in the reordered sequence and the first half of the last held landscape. Two things the §8 row now carries that the session must use: Stem's **1-for-20 reverse split (2025-06-23)** makes every pre-split per-share figure stale by 20×, and its HQ is **Houston**, not the Bay Area. Note that P3 alone does **not** unblock `software-and-optimization` — the landscape is held for both halves of E1 and V2 is the other one

**To continue:** type `continue with your recommendation`
