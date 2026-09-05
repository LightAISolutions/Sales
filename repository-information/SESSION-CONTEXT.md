# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-05 01:50 PM EST
**Repo version:** v04.64r (bumped on the push commit `8b91c94`; C4 itself shipped at v04.63r in commit `710034c`, which merged mid-session)
**Branch:** `claude/phase-c4-profiler-session-rwzxo5` (rebased onto `origin/main` at `b44d0f9` after the v04.63r merge, before the v04.64r edits)
**Model:** Opus 5 xhigh — Phase C session C4 (Talen Energy · Vistra · NRG Energy), then an unplanned cross-dossier reconciliation pass the C4 research forced.

### What was done

- **C4 shipped at v04.63r** — three `ipp` dossiers (schema v7, profileVersion 1, intel-briefing) + three schema v2 study guides + three lesson plans. Sources 81 / 81 / 72 (first-party 51 / 37 / 33 percent); relationships 7 / 13 / 7; developments 21 / 20 / 20; decision makers 13 / 11 / 12; 19 headshots. 25 shared concepts registered (811 total). Registry sync (127), graph rebuild (903 edges, 678 curated), study checker (101 guides) and the Playwright render all clean. Three **researched** calendar rows, not `cadence: "quarterly"`. §8 rows flipped to `v1 · v04.63r` / `✓ · v04.63r`. CHANGELOG 80/100.
- **All three C4 premises were wrong and are corrected** in the summaries, judgments and README descriptions, same as B5/F5 before it.
- **Expectations honesty was applied literally.** No full-year analyst consensus exists for FY2024/FY2025 for Talen or Vistra on any reachable host, so those periods are **guidance-benchmarked and say so** in `result`/`commentary`. NRG's only FY2025 consensus is nine months stale and is labelled as such. `ir.talenenergy.com` and `investors.nrg.com` are WAF-blocked (503/403); press releases were recovered from SEC 8-K exhibits and the block recorded as a collection gap.
- **v04.64r reconciled the existing corpus against the three new dossiers.** C4 landed into a corpus that already carried ~30 inbound mentions of Talen, Vistra and NRG. Nothing had ever checked whether those mentions still held. Four did not:
  - `invenergy` v1 → v2 — grouped NRG with Vistra and Talen as "contracting existing fleets to data centres". NRG's model is customer-funded **new build** under a Project Development Agreement with GE Vernova and Kiewit's TIC for up to 5.4 GW. Separated, GE Vernova release sourced.
  - `meta` v6 → v7 — "Vistra (2.1 GW + 433 MW uprates)" in two places. Vistra discloses **2,176 MW** operating (Perry 1,268 + Davis-Besse 908) plus 433 MW of uprates, **2,609 MW total**. Both corrected.
  - `terawulf` v4 → v5 — the Nautilus exit carried "~$92M / 3.4x MOIC"; Talen's own release states **$85M cash plus selected physical assets**. Both figures now stated with an explicit note that no source reconciles them.
  - `burns-mcdonnell` v4 → v5 — the open Moss Landing adjacency question closed and dated. Phase I (300 MW, engineered by Fluence, built by Luminant) is the unit that burned; B&McD's engagements are Phase II (100 MW) and Phase III (350 MW). A `vistra` relationship and the NS Energy project record added.
- **Added mandatory step 7 to the Profiler Command** in `.claude/rules/profiler-app.md` — "Reconcile the corpus against the new dossier". Word-boundary grep every other dossier for the new company, skip exec-career mentions, then the four-way disposition: contradicted → revise the **other** dossier with archive + `profileVersion` bump; differing figures → state both and say nothing reconciles them; open question the new research answers → close and date it; accurate → leave alone. Report counts reviewed and changed. Batch requests / Standard treatment / Commit-push renumbered 8 / 9 / 10.

### Where we left off

Nothing is in flight. Working tree clean; `8b91c94` pushed and merging. Program state: **38 of 65 new companies done, 4 of 30 guide passes done.**

- **Opus 5 xhigh remaining:** C5 (ENGIE North America · AES Clean Energy · RWE Clean Energy), C6, C7, C8, C9, C10, C12 — 18 companies over 7 sessions — plus **26 guide backfills**.
- **Fable 5.1 remaining:** F6 (MGX · Excelsior Energy Capital · X-energy — first `investor` chips with data), F7 (Compass · EdgeCore · PowerHouse), F8 (Fermi America · Tract · Prime Data Centers).
- **Classroom register:** G6 open (wants a guidance module via `industry guidance:` plus a developer-supplied document); G10 Partial; G11 deferred; G12 by design.
- **Not started, and now the developer's stated priority:** `scripts/check-profiler-crossrefs.py` and the retroactive sweep of the pre-existing cross-dossier pairs. See the recommendation below.

### Key decisions and findings

- **The corpus has a structural blind spot no checker covered.** `sync-profiler-registry.py`, `build-profiler-graph.py` and `check-profiler-study.py` all validate a dossier against *itself* or against the registry. None asks whether **two dossiers assert contradictory facts about the same thing**. Step 7 closes this going forward by rule; it does not touch the backlog.
- **The backlog was measured this session.** 127 dossiers, **1.79M tokens** of corpus, **870–1,130 distinct cross-dossier pairs** (the count is matcher-dependent — a suffix-stripping tokenizer gives 870, the looser earlier matcher gave 1,126). **5,719 mention occurrences.** Distribution is sharply concentrated: **top 10 targets = 39% of pairs, top 25 = 65%**; 11 of 79 targets have only 1–2 inbound. NVIDIA 56, Tesla 51, Microsoft 46, Siemens Energy 39, GE Vernova 29, Vertiv 26, OpenAI 25, Eaton 24, Oracle 23, Fluence 23.
- **Field distribution decides the checker's scope.** On a 1,378-mention sample: `relationships` 297, `sources` 295, `productsAndServices` 225, `recentDevelopments` 207, `technicalSpecs` 84, `strategyRead` 80, `decisionMakers` 58, `ecosystemRole` 39, `summary` 32, `policyExposure` 31, `financials` 18. **`sources` and `decisionMakers` are 26% of the surface and are pure noise** — source titles and exec career history. **78% of mentions contain a digit**, so a naive numeric-conflict detector has enormous surface and will drown in false positives unless scoped.
- **The `meta` case is the checker's hardest calibration target.** 2,176 MW and 2.1 GW are numerically **equal**; a unit-normalizing comparator says "no conflict" and misses the drift, because the drift was the **omitted 433 MW of uprates**, not a wrong number. Any checker that only compares normalized magnitudes would have scored 3 of 4 known cases, not 4.
- **A model upgrade is not the fix for accuracy, and this session is the second data point.** C4's premises were caught because the prompt told the agents to check them — the same reason F5's were. What was missing in both cases was a **rule**, not reasoning depth. The one thing that went wrong this session that a better model would not have fixed was the absence of a cross-dossier gate.
- **I over-called one of the four items and corrected it mid-session.** I first described the Burns & McDonnell / Vistra Moss Landing item as two dossiers contradicting each other. They did not — B&McD plausibly worked both Phase II and the Phase III expansion, and `vistra.profile.json` had already recorded both correctly. It was an **open question**, not a contradiction. This is the exact failure mode the retroactive sweep must be protected against: over-calling rewrites accurate dossiers.
- **I also mis-stated a diagnosis earlier in the session and corrected it publicly.** I claimed §5's Phase C descriptions "were written from corpus mentions rather than from filings." Selection was corpus-driven, but the descriptive claims mostly appear nowhere in the corpus — the accurate diagnosis is **unattributed market knowledge written from memory at plan-approval time**.

### Active context

- Branch `claude/phase-c4-profiler-session-rwzxo5`; repo version **v04.64r**; CHANGELOG **81/100**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry **127** companies; concepts **811**; study guides **101**; graph **903 edges (678 curated)**; archive index **237 entries across 95 slugs**; calendar 88 rows.
- Scratchpad tooling that survives as a recipe: `urlcheck.py` (URL-index gate), `c4-render-check.py` (Playwright harness — threaded HTTP server, `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, GAS stub for `script.google.com`, `.ov-sources ol li` for source counts, `.gd-term` resolved against `gdGlossMap` **not** `e.title`).
- **Model recommendation recorded for the developer's next two jobs:** build `scripts/check-profiler-crossrefs.py` on **Opus 5 xhigh** (one-time durable artifact, adversarial false-positive design problem, four ground-truth cases to calibrate against); run the retroactive sweep on **Fable 5.1 High** (high-volume shallow adjudication where §2 already records Fable as better at hedging and relationship discipline — the anti-over-calling property the sweep needs most). Not Medium for either.

### Recommendation for next session

- **Build `scripts/check-profiler-crossrefs.py` as a fresh Opus 5 xhigh session, using the paste-ready prompt written in chat on 2026-09-05 at ~01:50 PM EST** — it is the only one of the four proposed follow-ups that both makes step 7 verifiable instead of self-reported and reaches the 870–1,130-pair pre-existing backlog, and it must exist and be tuned to a measured false-positive rate **before** any retroactive sweep starts, or the sweep burns its budget adjudicating noise. The session must end with the checker's FP rate measured on a sample and with all four known-drift cases scored against their pre-fix revisions in `archive/`.
**To continue:** type `build the cross-reference checker on Opus 5 xhigh`

## Previous Sessions

### Session — Phase B F5 (Fable 5.1 Medium)

**Date:** 2026-09-05 04:05 AM EST
**Repo version:** v04.62r (bumped this session on the F5 push commit `b735830`; this entry is the housekeeping commit `Remember session context`)
**Branch:** `claude/fable-5-1-medium-phase-b-f5-bll92b` (the v04.62r push merged and the branch was swept; rebased onto `origin/main` at `5cfd6fe` before this commit)
**Model:** Fable 5.1 Medium — Phase B session F5 (esVolta · Strata Clean Energy · Hunt Energy Network). The developer switched to **Opus 5 xhigh** at the bookkeeping tail, so F5 measures Medium on the research and authoring only.

### What was done

- **Three `developer · ipp` dossiers (schema v7, profileVersion 1, intel-briefing) + three schema v2 study guides + three lesson plans in one push commit.** Sources 108 / 103 / 87 (first-party 31 / 50 / 32 percent); relationships 4 / 11 / 7, all resolving; policy regimes 3 / 3 / 4; 22 headshots (Strata 10, esVolta 7, Hunt 5). 18 shared concepts registered (786 total); registry sync (124), graph rebuild (865 edges, 653 curated), study checker (98 guides) and the Playwright render of every tab and guide all clean; three quarterly calendar rows (85); §8 rows flipped to `B5 → F5 … v1 · v04.62r | ✓ · v04.62r`; execs recount 490 across 77; CHANGELOG 79/100.
- **Every URL asserted programmatically** (`scratchpad/urlcheck.py`, the F4 recipe) — 0 unmatched per dossier (139 / 140 / 119 URLs).
- **All three B5 premises were wrong and are corrected in the summaries and judgments.** "Contracted and merchant mid-size BESS owners across CAISO, PJM and ERCOT" holds for none of them. **esVolta**: Generate Capital portfolio company whose sponsor mandated **Barclays and Truist for its sale** (Infralogic, 5 June 2026); CAISO + ERCOT + WECC expanding to SPP and MISO, **never PJM**; 490 MW / 980 MWh operating in ERCOT behind "a hedge in place with a confidential commodity market participant"; the January 2025 Captona deal was **USD 243 million of preferred equity including ITC-transfer proceeds, not a sale**; Generate acquired it **July 2022, not 2023**. **Strata**: **founder-owned, no sponsor** ("100% privately held company owned by our founders"; Blackstone's 2021 USD 150 million was **credit**, per its own CFO); an **originate-contract-and-sell** model — Scatter Wash to CIP (Sept 2024), White Tank to GridStor (Sept 2025), Ventura to Capital Dynamics then Arevon — keeping Justice, Inland Empire (70 MW / 280 MWh, PG&E RA) and about 1 GW of owned **solar**; **no owned battery in ERCOT or PJM**, Arizona sits in APS territory outside any ISO. **Hunt Energy Network**: Hunt-family-owned with **Manulife as JV equity partner** (USD 225 million 2021 + USD 250 million 2024), **ERCOT-only, 100 percent merchant, sub-10 MW** (32 distribution-connected 9.9 MW units + the 100 MW / 200 MWh Fort Duncan), traded by its **own Level 4 QSE (TraDER)**; the Caterpillar 1 GW agreement is the **parent's**, not HEN's.
- **Evaluated the developer's action plan** (the screenshot from the v04.57r era) against current state and wrote a paste-ready **Opus 5 xhigh prompt for session C4** in chat at ~04:10 AM EST.

### Where we left off

Nothing is in flight. Working tree clean after this commit. Program state: **35 of 65 new companies done, 4 of 30 guide passes done.**

- **Fable 5.1 High/Medium remaining:** F6 (MGX · Excelsior Energy Capital · X-energy — first `investor` chips with data, include the visual check), F7 (Compass · EdgeCore · PowerHouse), F8 (Fermi America · Tract · Prime Data Centers). F9 (the Xcel head-to-head) was **completed at v04.57r** and its reminder is closed.
- **Opus 5 xhigh remaining:** C4 (Talen · Vistra · NRG), C5, C6, C7, C8, C9, C10, C12 — 21 companies over 8 sessions — plus **26 guide backfills** (the 3 revisions and the Narada backfill landed at v04.51r).
- **Classroom register:** G1–G5, G7 (v04.58r), G8, G9 closed; **G10 Partial** (v04.58r); **G6 open** and is the one Opus item that is not a dossier (it wants a guidance module via the `industry guidance:` command and a developer-supplied document); G11 deferred, G12 by design.

### Key decisions and findings

- **Fable 5.1 Medium passed its measured test — none of the three tripwires fired.** Third-party agents fetched 105 / 81 / 85 URLs against a 50 floor; each carried an explicit unverified list (13–16 flagged items) and kept snippets out of the fetched-URL lists, and the Hunt agent pulled ten PUCT Interchange PDFs with `curl` when WebFetch returned 503; judgments are confidence-tagged with stated bases and several name disconfirming evidence. **Caveat: the measurement covers research and authoring only** — the model switched at the bookkeeping tail. Both the Strata and Hunt third-party agents exhausted the 200-call search budget mid-task, which is a capacity signal rather than a quality one.
- **`profiler-companies.json` is appended in session order, not sorted.** Sorting it produced a 518-line diff over 121 pre-existing entries; the append convention was restored and only the three new entries appended (58-line diff). **`profiler-concepts.json` IS alphabetical by slug** and the schema requires it.
- **The §5 guide-backfill rationale is now stale.** It says "Twenty-seven backfills, IPPs first because the BESS buyer side has no guides at all." The buyer side now has **nine** guides (aypa-power, spearmint-energy, intersect-power, invenergy, gridstor, available-power, esvolta, strata-clean-energy, hunt-energy-network), so the nine IPP backfills are less urgent and easier to differentiate than when the plan was written.
- **Measure corpus demand with word boundaries and case sensitivity.** `grep -il "Talen"` returns 17 dossiers because it matches "talent"; `grep -lE '\bTalen\b'` returns 4. Corrected demand for uncovered Phase C names: Blackstone 14, Macquarie 12, Digital Realty 10, NRG 8, Power Electronics 8, Brookfield 8, CyrusOne 7, Vistra 5, Recurrent Energy 5, Talen 4.
- **A CDN-refused headshot is skipped, not sourced elsewhere** — esVolta's chief commercial officer renders an initials avatar because `static.wixstatic.com` returns Forbidden for that one file.
- **Strata's president may have moved**: Bob Schaffeld is quoted as President through May 2025 but sits on the advisory board on the September 2026 leadership page; no release records the change and the dossier states both.
- Environment unchanged from F4: threaded HTTP server, `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, `about:blank` before each dossier, `.ov-sources ol li` for the source count, Business Wire and archive.org 403.

### Active context

- Branch `claude/fable-5-1-medium-phase-b-f5-bll92b`; repo version **v04.62r**; CHANGELOG **79/100** (about 17 sessions left in the program, so rotation stays unlikely but the headroom is no longer generous).
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders (the Xcel head-to-head reminder was completed 2026-09-04).
- Registry 124 companies; concepts 786; calendar 85 rows; study guides 98; execs 490 images across 77 companies.

### Recommendation for next session

- **Run Phase C session C4 (Talen Energy · Vistra · NRG Energy) as a fresh Opus 5 xhigh session using the paste-ready prompt written in chat on 2026-09-05 at ~04:10 AM EST** — three public IPP dossiers plus study guides, which is where the Opus thread was left off in plan order after C11 (v04.52r), is the strongest Opus fit left in the plan (three companies with 10-Ks, earnings calls and investor decks, the reading depth the v04.57r head-to-head found Opus better at), and unlocks the Phase D `clean-firm-power` lesson (C4 + C11).
**To continue:** type `run C4 on Opus 5 xhigh`

Developed by: LightAISolutions
