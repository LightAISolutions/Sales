# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-04 04:10 PM EST
**Repo version:** v04.56r (started at v04.54r — **two** push commits this session: `58e756b` v04.55r, plus this one)
**Branch:** `claude/eloquent-cerf-horsm0`
**Model:** **Opus 5 xhigh.** This was an **Industry Guidance** session, not a Profiler session — `PROFILER-COVERAGE-PLAN.md` §2 assigns models for Profiler sessions only and §8 has no guidance-module row, so **there is no model rule to record and no §8 row was added.** That absence is the whole reason G4 was "structural".

### What was done

- **The G4 guidance module (v04.55r)** — `guidanceDocGridEquipment_()` in `Profiler.gs`, module id `grid-equipment-shortage-2026-09`, *The Grid-Equipment Shortage: GOES, Bushings, Test Bays, Lead Times*, lane **The AI Data-Center Wave**, registered in `guidanceDocs_()` immediately after `guidanceDocUtilityAidc_()` as its supply-side counterpart (`guidanceDocs_()` now returns **eight** modules). Sixteen sections, 14 glossary terms all used and all resolving, 4 `sales` notes. `reviewBy: 2027-03-31`. Plus `repository-information/industry-guidance/grid-equipment-shortage-analysis.md` (12 sections, ~60 sourced claims) and the Scraper seed `topic-grid-equipment-shortage` (Scraper GAS v01.99g → **v02.00g**; Profiler GAS v01.34g → **v01.35g**; `Profiler.html` deliberately **not** bumped — the renderer was untouched).
- **§6 bookkeeping in the same commit (v04.55r)** — all three of G4's asks re-checked against the corpus and the row flipped to **Closed v04.55r**; the Standings block rewritten from "G4 then G6" to "G6, and nothing else"; a fifth append-only trail paragraph added without rewriting any of the four earlier ones.
- **A self-correction (v04.56r)** — writing the G6 commissioning prompt meant grounding it, and the grounding found that **the v04.55r Standings text about G6 was wrong**: it said G6's sources "exist in the corpus only as fragments", which it inherited from the G6 row's own v04.44r text rather than checking the corpus. Corrected in both the Standings block and as a dated re-check parenthetical on the G6 row.

### Where we left off

Both commits are pushed and merged; the working tree is clean and the branch is at `origin/main`. The register stands at **seven closed** (G1, G2, G3, G4, G5, G8, G9), **one Partial** (G7), **two Open** (G6, G10), **two standing judgments** (G11, G12). **The commissioning backlog is G6 alone.** The paste-ready G6 commissioning prompt was delivered in chat this turn.

### Key decisions and findings

- **The "needs a source document" assumption was wrong and is now corrected in the trail.** Only two of the eight modules have an ingested source under `industry-guidance/sources/`; the other six declare what they are in a `**Provenance:**` line. This module's line reads *research-based synthesis over public sources plus already-verified internal material — neither a document ingest nor a pure internal synthesis*. **Step 1 of the Industry Guidance Command does not apply to a module like this.**
- **`reviewBy` came from the module's own nearest dated gate**, per step 10: **2027-03-31**, Siemens Energy's Charlotte plant beginning LPT production ("by early 2027"). It carries the module's central arithmetic — 24 units initially rising to 57/year at full capacity, against ~900 units/year of US demand, about 6%. Rejected alternatives (Hitachi 2028, Eaton 2027-no-month, Butler Works 2029-and-disputed, Wood Mackenzie's continuous quarterly series) are recorded in the analysis's §12.
- **"Do not invent a number" cost nine items**, all moved to *what the record does NOT say* rather than hedged into the module. The largest: **no public register of high-voltage test-bay capacity, utilisation or queue time exists anywhere**, so the bay is taught as a mechanism sourced to IEC 60076-3 (lightning impulse is a **routine** test above 72.5 kV — every unit) and IEC 60076-2 (heat run is a **type** test) with no number on the queue. Also omitted: the vendor-blog-only "bushings run up to 130 weeks", the unverifiable "single US OLTC producer", and any forecast crossover year.
- **The register's staleness failure mode caught me too, one commit after I wrote a paragraph about it.** The v04.54r session found G2 and G5 stale for four and five repo versions; I then wrote a Standings sentence about G6 from the row's text rather than the corpus. **The rule that works is mechanical: before writing anything about a row's premise, scan the corpus for it.** A `glob` over `*.study.json` section titles took about ten seconds and returned a dozen guides where the row claimed fragments.
- **G6's real shape, established by that scan.** The **state/utility half is well covered publicly** — `dominion-energy`, `aep`, `oncor`, `southern-company`, `xcel-energy`, `entergy`, plus `burns-mcdonnell` and the requester-side guides `stack-infrastructure`, `aligned`, `switch`, `amazon`, `meta`, `core-scientific`. **The genuine gap is the federal layer**: the string `"Order 2023"` appears **nowhere** in the corpus, and study-fee regimes are no one's subject.
- **Playwright harness notes still hold** and were re-confirmed: threaded HTTP server, `bypass_csp`, `add_init_script` setting `localStorage ov_note_role='admin'`, injected style hiding `#ov-authwall`, `executable_path` into `/opt/pw-browsers/chromium-*` (`playwright install` is **not** the fix). `pip install playwright` and `pip install pymupdf` were both needed in a fresh container. The module rendered at 46,785 chars of text, 0 unresolved `{{term}}` markers, 0 page errors.
- **One pre-existing failure, not caused by this work**: `playwright-harness.py Scraper` fails on a CSP image-load refusal for a `lightaisolutions.github.io` logo when served from `127.0.0.1`. `Scraper.html` was never touched.

### Active context

- Branch `claude/eloquent-cerf-horsm0`; repo version **v04.56r**; CHANGELOG counter **73/100**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- Guidance modules: **8**. Profiler GAS **v01.35g**, Scraper GAS **v02.00g**, `Profiler.html` unchanged at **v01.82w**.
- `REMINDERS.md` still carries one active reminder: the **Fable 5.1 High vs Opus 5 xhigh head-to-head on the Xcel Energy dossier** (baseline `xcel-energy.profile.json` at `v04.46r`, commit `2652d30`).
- Still owed elsewhere: Fable session **B10** (`coolit` closes G7, `dnv`/`sargent-lundy` close G10, plus `mgx`, `x-energy`) — both remaining gap rows are **scheduled**, not structural.

### Recommendation for next session

- **Commission the G6 guidance module — "Interconnection for large loads" — as a fresh Opus 5 xhigh session, briefed on the corrected split rather than on the row's own words.** It is the last structural row in the register and the only thing §6 still asks anyone to commission. Brief it to **compose against** the state-side material already in the corpus (six utility guides, `burns-mcdonnell`, and the requester-side guides) rather than restate it, and to spend its original research on the two things genuinely absent: **the federal interconnection-rule layer** (FERC Order 2023 appears nowhere in the corpus, and large loads are governed differently from generators — that distinction is the module's spine) and **study-fee and deposit regimes**. The full paste-ready prompt was written out in chat on 2026-09-04 at 04:10 PM EST; re-derive it from `.claude/rules/industry-guidance.md` steps 1–10 and §6's corrected G6 row if it is not to hand. **The session must also re-check G6 and flip the row in the same commit**, and update the Standings block — which will then read "nothing left to commission" for the first time in the register's history.
**To continue:** type `commission the G6 interconnection guidance module`

## Previous Sessions

**Date:** 2026-09-04 03:19 PM EST
**Repo version:** v04.54r (started at v04.51r — **three** push commits this session: `966da36` v04.52r, `2eeccde` v04.53r, `2d5ff01` v04.54r, plus this context write)
**Branch:** `claude/phase-c11-profiler-coverage-49yg1c`
**Model:** **Opus 5 xhigh — §2 assigns Phase C to Opus natively, so there is NO substitution to record.** The three C11 rows in §8 read plain `Opus 5 xhigh`

### What was done

- **Phase C11 (v04.52r)** — `oklo`, `trane-technologies` and `mccarthy`: three schema-v7 dossiers at profileVersion 1, three schema-v2 study guides, 145 net new shared concepts (465 → 610), 18 relationship backfills with archival, 20 exec headshots, three lesson plans, three calendar rows, README tree entries and the three §8 rows flipped. Verified with `sync-profiler-registry.py --check` (0 of 109 out of sync), `check-profiler-study.py` (0 errors / 0 warnings, 83 guides, 610 concepts), `build-profiler-graph.py` (706 edges, 534 curated) and Playwright across all three plus a control slug with zero page errors and zero unresolved `{{term}}` markers.
- **§6 bookkeeping, first pass (v04.53r)** — **G8 closed** and **G7 moved to Partial**, both dated `v04.52r`, plus a "Targeted re-run of G7 and G8" paragraph in the v04.51r form.
- **§6 full re-run (v04.54r)** — the re-run the register said was owed at the close of Phase B, run one phase late. Writing an honest standings note meant re-checking every row first, and **that found two rows sitting at Partial after the work that closes them had already landed**: **G2 closed** (the corpus holds all four gen-set OEMs — `caterpillar`, `cummins`, `rolls-royce-power-systems` and `rehlko`, Rehlko being the carved-out Kohler Energy business, against an ask of two of four) and **G5 closed, over-satisfied** (six `utility` dossiers with guides against an ask of four). G4, G6 and G10 re-checked and dated unchanged. A **Standings block** was inserted directly under the table, ahead of the four dated re-check paragraphs, sorting what is left by **scheduled** (G7, G10 — both coverage-plan §8 row B10) versus **structural** (G4, G6 — no ledger row can produce them).

### Where we left off

All three commits are pushed and merged; the working tree is clean and the branch is at `origin/main`. The register now stands at **six closed** (G1, G2, G3, G5, G8, G9), **two Partial** (G4, G7), **two Open** (G6, G10), **two standing judgments** (G11, G12). The developer asked for a paste-ready commissioning prompt for the **G4 guidance module**, which was delivered in chat this turn and is reproduced in the recommendation below.

### Key decisions and findings

- **The recommendation to "rewrite the stale commission-first paragraph" was deliberately not followed.** That paragraph is a dated record in an append-only trail; rewriting it would have made §6 lie about its own history. The real problem was the **order** a top-down reader met things in, so current standings were inserted **above** the trail and all four historical paragraphs were left untouched.
- **The register's staleness is a structural failure mode, not a one-off.** G2 and G5 sat wrong for four and five repo versions because their own text named the sessions that would close them and nobody re-ran the check afterwards. Nothing in the repo fires that check automatically.
- **A prior session's assumption about G4 was wrong and is corrected here.** The v04.51r entry said G4's module "needs a source document from the developer". It does not: **five of the seven existing guidance modules have no ingested source at all** — only `nvidia-800vdc-white-paper-2026-08.pdf` and the EO 14420 HTML/txt exist under `industry-guidance/sources/`. The other five are teaching syntheses that declare provenance in a `**Provenance:**` line (see `power-infrastructure-aidc-analysis.md`). A G4 session can be commissioned today with no upload.
- **G10 was deliberately left Open on a judgment call.** `black-veatch` is covered but as an EPC, and the row names it among the independent engineers; whether an EPC dossier can occupy the IE seat is the developer's call, not a re-check's.
- **`powell-industries`, not `powell`.** An early probe on the short slug returned a false negative that would have contradicted G4's v04.51r text.
- Six curly apostrophes written earlier in the session were normalised to straight, matching the file's 84-to-0 convention.

### Active context

- Branch `claude/phase-c11-profiler-coverage-49yg1c`; repo version **v04.54r**; CHANGELOG counter **71/100**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- Registry at **109 companies**, concepts at **610**, study guides at **83**, graph at **706 edges**.
- `REMINDERS.md` still carries one active reminder: the **Fable 5.1 High vs Opus 5 xhigh head-to-head on the Xcel Energy dossier** (baseline is `xcel-energy.profile.json` at `v04.46r`, commit `2652d30`).
- Still owed elsewhere: Fable session **B10** (`coolit` closes G7, `dnv`/`sargent-lundy` close G10, plus `mgx`, `x-energy`), and a guidance session for **G6** ("Interconnection for large loads").

### Recommendation for next session

- **Commission the G4 guidance module — "The grid-equipment shortage: GOES, bushings, test bays, lead times" — as a fresh Opus 5 xhigh session.** It is the top of the register's own restated list, it is the only remaining gap whose public sources are already in the corpus (the Siemens Energy Grid Technologies spine, `powell-industries`, plus `hitachi-energy`, `ge-vernova`, `abb`, `mitsubishi-electric`), and no scheduled Profiler session will ever close it. The full paste-ready prompt was written out in chat on 2026-09-04 at 03:19 PM EST; re-derive it from `.claude/rules/industry-guidance.md` steps 1–10 if it is not to hand. **The session must also flip §6's G4 row to Closed with a dated re-check AND update the Standings block in the same commit** — that block names G4 and G6 as the two structural rows and goes stale the moment the module lands, which is precisely the failure this session spent a commit repairing.
**To continue:** type `commission the G4 grid-equipment-shortage guidance module on Opus 5 xhigh`
