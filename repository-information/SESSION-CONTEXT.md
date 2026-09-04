# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-04 04:28 PM EST
**Repo version:** v04.56r (no bump — this session made no code or data change; one housekeeping commit `Remember session context`)
**Branch:** `claude/profiler-coverage-phase-b-3jimh8`
**Model:** Fable 5.1 (this session), used only for planning — no dossier, guide or module was authored, so no §8 row and no §2 note changed.

### What was done

- **Audited `PROFILER-COVERAGE-PLAN.md` §8 against the filesystem.** Every row matches the files on `main`: 20 of 65 new companies landed (A1–A4 · B1–B2 · C1, C2, C3, C11), 4 of 30 guide passes (Vertiv, Schneider, Siemens Energy revisions + the Narada backfill). Register §6: G2, G3, G4, G5, G8, G9 closed; G7 Partial (CoolIT); G10 Open (DNV, S&L); G6 Open (guidance module); G11/G12 standing.
- **Recommended a Fable-first action plan** (in chat, 04:20 PM EST): no Fable xhigh work remains; the Phase B remainder (24 companies) runs on Fable 5.1 High as eight sessions **F1–F8**, reordered so register closers and the most opaque subjects go first — F1 DNV · Sargent & Lundy · CoolIT (closes G10 + G7, first `advisor` chip, re-check and flip both rows in-session) · F2 Fluidstack · Nscale · Anthropic · F3 Aypa · Spearmint · Intersect · F4 Invenergy · Gridstor · Available Power · F5 esVolta · Strata · Hunt · F6 MGX · Excelsior Energy Capital · X-energy (first `investor` chips; Excelsior moved here from B6, B10 split in two) · F7 Compass · EdgeCore · PowerHouse · F8 Fermi America · Tract · Prime Data Centers · **F9** the Xcel head-to-head (the active reminder) as the leftover-credit filler. Opus 5 xhigh afterwards: G6 module first, then C4–C10, C12, the 26 backfills, then Phase D. **§8 and §4 were NOT edited** — the regrouping is a chat recommendation; the F1 session should note it in §4 when it flips its rows.
- **Wrote the paste-ready prompt for the Xcel head-to-head** (in chat, this turn) — Fable 5.1 High, dossier-only, written blind to the Opus version, reported by section with every difference classed *same-fact-different-treatment* vs *search luck*, verdict into §2's confidence note, §8 `xcel-energy` row flipped, reminder moved to Completed (developer authorised the completion by commissioning the session on 2026-09-04).

### Where we left off

Nothing is in flight. Working tree clean, branch at `origin/main` plus this commit. The developer's Fable window (~14 h from 04:19 PM EST 2026-09-04) is open and unspent; the intended order is the Xcel head-to-head first (developer's choice, ahead of F1), then F1–F8.

### Key decisions and findings

- **Baseline facts for the head-to-head, verified this session:** `xcel-energy.profile.json` on `main` is byte-identical to commit `2652d30` (v04.46r), profileVersion 1, schema 7, 101 sources, 6 relationships, 13 decision makers, 7 strategyRead judgments; **never archived** (no `archive/xcel-energy.*` entry), so the Fable re-run is a normal revision — v1 goes to `archive/xcel-energy.profile.v1.json` with an archive-index entry and the new file is profileVersion 2. `xcel-energy.study.json` stays untouched — the comparison is dossier-only.
- **Write-blind rule (added to the prompt, not in the reminder):** the Fable session must not open the Opus dossier until its own v2 is written, or the comparison measures editing rather than authoring.
- **The head-to-head verdict has a consequence beyond the reminder:** if Fable High is materially better on the (a)-class evidence, Oncor and AEP (the other two B2 Opus substitutions) become Fable make-good candidates; if not, §2 can send the rest of Phase B to Opus without regret.
- CHANGELOG counter 73/100 — no archive rotation due during the remaining program.

### Active context

- Branch `claude/profiler-coverage-phase-b-3jimh8`; repo version **v04.56r**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md` still carries the one active reminder (Xcel head-to-head) — it is the spec for the next session and is closed by that session, not this one.
- Still owed elsewhere: G6 guidance module (Opus 5 xhigh), Phase B F1–F8, Phase C C4–C10 + C12, 26 guide backfills, Phase D.

### Recommendation for next session

- **Run the Xcel Energy head-to-head as a fresh Fable 5.1 High session using the paste-ready prompt written in chat on 2026-09-04 at 04:26 PM EST** (spec: the active reminder in `REMINDERS.md`; baseline commit `2652d30`; archive v1, write v2 blind, report by section, weight same-fact-different-treatment differences only, verdict into §2's confidence note, flip the §8 `xcel-energy` row, move the reminder to Completed). Then proceed to F1 (DNV · Sargent & Lundy · CoolIT) with the F1 prompt from the same chat.
**To continue:** type `run the Xcel Energy head-to-head on Fable 5.1 High`

## Previous Sessions

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

