# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-05 09:22 PM EST
**Repo version:** v04.78r — one push commit this session (`0b30312`, merged to `main`), plus this housekeeping commit
**Branch:** `claude/phase-b-closeout-verify-rx201s` (rebased onto `origin/main` after the merge)
**Model:** Fable 5.1 High — **Phase B closeout**: bookkeeping and verification only, no dossier or guide work, no `Profiler.html`, `Profiler.gs`, `Scraper.gs` or family-map change.

### What was done

- **`CLASSROOM-CURRICULUM-PLAN.md` §6 re-run in full (G1–G12) against the corpus** — files by slug, guide section ids, the eight `guidanceDocs_()` ids — with a dated v04.78r verdict in every row. **One status change: G10 `Partial v04.58r` → `Closed v04.78r`** on the register's own definition of Partial (its one stated ask, a module revision *or* one IE-firm dossier, is satisfied twice by `dnv` and `sargent-lundy`; insurance/brokers were never an ask — residual recorded in the row). G1–G5, G7–G9 re-confirmed closed (G8 over-satisfied: `oklo` + `x-energy`); **G6 stays Open and structural** (no interconnection module among eight; "Order 2023" nowhere in the corpus); G11, G12 re-affirmed. Intro sentence dates the Phase B re-run; Standings rewritten (eight closed · one open · two standing; Scheduled bucket empty); trail count six; one append-only paragraph "Where the register stands after Phase B (re-run 2026-09-05, v04.78r)".
- **`PROFILER-COVERAGE-PLAN.md` marks Phase B complete**: §1 dated counts paragraph + delta table (136 dossiers · 110 guides · 8 projects · 1,012 edges (749 curated) · 922 concepts · 8 modules · 4 reports vs the v04.39r baseline 89 / 62 / 8 / 490 / 112 / 7 / 4; roster tags supplier 54 · developer 28 · ipp 21 · epc 12 · integrator 10 · hyperscaler 8 · neocloud 7 · gc 6 · utility 6 · advisor 2 · investor 2); §4 "Phase B complete" note under Regrouping (B1–B2, F1–F8 with versions; B2 on Opus 5 xhigh, F5 on Fable 5.1 Medium); §7 bullet handing the `Colocation & Cloud Capacity` peer-family split (`renewables-developer`, keyed on the `developer · ipp` pairing) to **X3 as a decision**, with three loose threads (CoreWeave's Elk Grove Village lease missing from `coreweave`; `plus-power`'s Sierra Estrella line unconfirmed; Tract's PUCN decision due 8 Sept 2026); §9.5 row 2 done.
- **Verified**: all 29 §8 B rows carry versions in both columns and no §4 hypothesis wording; calendar Phase B rows all present (7 public with nextReport/confirmed/source/watch[], 22 private `cadence: "quarterly"`); **Fermi's 2026-11-12 stays `confirmed: false`** — EDGAR (CIK 2071778) has no Q3-date 8-K (post-Q2 filings: 31 Aug officer 8-K, 2 Sept shareholder-nomination 8-K) and `investor.fermiamerica.com/events-presentations` returned HTTP 403; row untouched.
- **Checkers at v04.78r, all exit 0**: registry 0/136 updated · graph 1,012 edges unchanged · study 0/0 · relationships 0 findings (14 suppressed) · crossrefs 0 candidates (7 suppressed, 20 scopes over the cap) · **reports 35 aged-pin warnings** across three reports (X3, not re-pinned).
- CHANGELOG **95/100**; no rotation.

### Where we left off

Nothing is in flight. Working tree clean. **Program state: 47 of 65 new companies, 4 of 30 guide passes. Phases A and B complete and closed out; the §6 register is dated at v04.78r.** The Phase C paste-in prompt for C5 (ENGIE North America · AES Clean Energy · RWE Clean Energy, Opus 5 xhigh) was handed to the developer in this session's chat.

- **Remaining, in §9.5 order:** C5 · C6 · C7 · C8 · C9 · C10 · C12 (Opus 5 xhigh), then the 26 guide backfills (6 sessions), then X3, then Phase D.
- **CHANGELOG rotation will fire in the Phase C dossier block, not the guide block** — 95/100 now, so the sixth push from here (around C10/C12) crosses 100. The §7 "CHANGELOG capacity" bullet still reads 86/100 as of v04.69r; refresh it when a session touches §7.

### Key decisions and findings

- **G10 closed rather than held**: Partial means "premise moved, stated asks not done"; the ask was done twice. The insurance seat (property, delay-in-start-up, warranty wraps) is still untaught — no insurer/broker slug, "delay-in-start-up" in no guide — and is a **new** row if the developer wants it, structural like G6.
- **G6 is the register's only commissioning ask** and is blocked on a developer-supplied document (`industry guidance:` command), not on any model or Phase C session.
- **Nothing in Phase C is a register closer** — the Scheduled bucket is empty; C5–C12 are ecosystem coverage. Every §5 row is still a hypothesis to be rewritten with a verdict (C1–C3 and C11 shipped without one; C4 and B5 went nought for three).
- **Peer family**: C5's `developer · ipp` storage owners will join the same `Colocation & Cloud Capacity` family the F3–F5 owners sit in; the split is X3's decision — dossier sessions must not touch the family map.

### Active context

- Branch `claude/phase-b-closeout-verify-rx201s`; repo version **v04.78r**; CHANGELOG **95/100** — 5 pushes of headroom.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders. `TODO.md`: no items.
- Checker state at v04.78r: registry sync clean · study clean · relationships exit 0 (14 accepts) · crossrefs exit 0 (8 accepts) · reports exit 0 with 35 aged pins (X3) · roles not run.

### Recommendation for next session

- **Run Phase C session C5 on Opus 5 xhigh — ENGIE North America, AES Clean Energy, RWE Clean Energy (`developer · ipp`, §8 rows at `—`/`—`), dossier + study guide each, the four after-write checkers plus crossrefs, calendar rows per `.claude/rules/profiler-app.md` Scheduled Refreshes, README tree entries, flip the §8 rows and rewrite the §5 C5 row with premise verdicts. One push commit.** The paste-in prompt was handed over in the v04.78r closeout session's chat; the §7 template in `PROFILER-COVERAGE-PLAN.md` regenerates it.
**To continue:** type `run Phase C session C5 on Opus 5 xhigh`

## Previous Sessions

### Session — Phase B F8, Fermi America · Tract · Prime Data Centers (Fable 5.1 High)
**Date:** 2026-09-05 08:47 PM EST
**Repo version:** v04.77r — one push commit this session (`8ed8487`, merged to `main`), plus this housekeeping commit
**Branch:** `claude/phase-b-f8-profiler-setw9a` (rebased onto `origin/main` after the merge)
**Model:** Fable 5.1 High — Phase B session **F8**: Fermi America · Tract · Prime Data Centers (AIDC developers) — **the last Fable session of Phase B; all 29 Phase B companies are now covered.** Six research subagents (two per company), dossiers, guides, lesson plans, step 7 reconciliation, all in one push commit. Context compacted once mid-session (after the concept-registration step) and recovered without loss.

### What was done

- **Three dossiers** (schema v7, profileVersion 1, intel-briefing, category `developer`): `fermi-america` (132 sources, 52% first-party, 7 relationships; `ownership.type: public`, Nasdaq Global Select + LSE: FRMI), `tract` (150, 33%, 8; private), `prime-data-centers` (171, 30%, 8; private). 36 company-published headshots (execs 630 across 89 companies — one harvested Prime portrait was orphaned and removed). Tract's and Prime's company pages were read from dated Wayback captures (live sites block automated fetches) and cited at the canonical URLs with the capture date in the label.
- **Three schema v2 guides + lesson plans**: Fermi (the generation-first campus — gas turbines and a COL behind the fence, time-to-power as the product), Tract (the developer's developer — the land value ladder, project bonds, who decides the price of power), Prime (recapitalising a build-to-suit pipeline — five rounds, a 7.5% bond on a neocloud lease, phantom equity). 27 shared concepts registered (922 total); one alias collision (`bridging power` vs `bridge-power`) caught before registration.
- **Step 7 reconciliation**: `xcel-energy` v3 (Fermi `customer` edge — SPS ESA up to 200 MW; edge context records the 10-K restatement of first power to H2 2026); `lambda` v5 (Prime `supplier` edge — 21 MW of LAX01; Prime's Lambda release registered). Every `\bFermi\b`, `\bTract\b`, `\bPrime\b`, Amarillo, Matador and HyperGrid hit classified (recorded in the v04.77r CHANGELOG entry). `plus-power`'s Sierra Estrella "adjacent Prime campus" line left as written — SRP's release does not name Prime and the Plus Power microsite is JS-rendered.
- **Calendar rows** (97): Fermi `nextReport: 2026-11-12`, `confirmed: false` (cadence inference — IR events page empty on 5 Sept; Q1/Q2 2026 reported 14 May / 13 Aug); Tract and Prime `cadence: "quarterly"`.
- **Checkers at v04.77r**: registry sync clean (136 companies) · study 0 errors / 0 warnings (110 guides, 922 concepts) · relationships exit 0, **0 new accepts** (14 unchanged; no `investor`/`portfolio` edges) · crossrefs exit 0, 0 new candidates (one Tract `productsAndServices` scope at 2,877 chars over the cap, listed as not examined) · Playwright: all five dossiers zero page errors (lambda's guide has no `{{term}}` spans — the `.gd-term` wait timing out there is expected).
- **Bookkeeping**: §8 rows flipped `B8 → F8` with every premise verdict; F8 entry in the calibration log (0/0/0/0/0); README tree (+3 profiles, +3 guides, +3 study-prep folders, +2 archive lines, execs count); CHANGELOG **94/100**.

### Where we left off

Nothing is in flight. Working tree clean, branch rebased onto `origin/main`. **Program state: 47 of 65 new companies, 4 of 30 guide passes. Phase B is complete** (F1–F8 all landed; B1–B2 utilities ran earlier under §2 substitutions). The Phase B closeout paste-in prompt was handed to the developer in this session's chat.

- **Next action is the Phase B closeout** — the §7 "Register checks" obligation: re-run the `CLASSROOM-CURRICULUM-PLAN.md` §6 gap register in full against the corpus and date it (as the Phase A close did at v04.44r), plus the coverage-plan bookkeeping that marks Phase B done.
- **Opus remaining after that:** C5–C10, C12, 26 guide backfills, X3, then Phase D.

### Key decisions and findings

- **Premise verdicts (§4 → §8 Closes):** all three B8 clauses **held with corrections**. "Amarillo multi-GW behind-the-fence campus" — Project Matador is in Carson County beside Pantex on a 99-year Texas Tech ground lease; up to 11 GW expandable to ~17 GW planned, 6 GW of gas TCEQ-permitted, four AP1000s at the NRC, ~1.5 GW of turbines landed, **nothing energised** (first 210 MW due July 2027); one binding-but-conditional tenant (TensorWave, 222 MW). "Land-and-power entitlement developer" — Tract sells shovel-ready parcels and does not build, but **no third-party sale is on the record** (only intra-group sales to Fleet's Storey County SPVs; USD 3.8bn + 4.6bn of notes). "Hyperscale build-to-suit" — Prime's most common model, but the named tenants are **neoclouds** (CoreWeave ~USD 2.2bn Elk Grove Village, Lambda Vernon); ~151 MW operating against a "4+ GW" pipeline.
- **Fermi stays `developer`, not `developer · ipp`** — generation is captive to the campus and passed through to tenants, not sold into a market; reason written in §8, registry matches.
- **Ownership → calendar row type:** Fermi public (brief's Nasdaq expectation held); Tract private (Tract Capital Management, no listed parent); Prime private (Data Realty Holding Corp., Macquarie/Ares joint control per EC M.11843, no listed parent).
- **Brief corrections:** Tract HQ Denver (not Reno), no Georgia park, no Eloy; Prime HQ Dallas, parent is Data Realty (no "Prime Group"), no NoVA/Kansas City/Denton site; Fermi HQ moved to Dallas per the 31 Aug 2026 8-K; "HyperGrid" is a trademark, not a domain.
- **No project pins** — Project Matador, the Tract parks and Avondale stayed in prose (no second dossier ready to pin); `profiler-projects.json`, Scraper.gs and Profiler.html untouched (page stays v01.82w).
- **Loose threads for later revisions:** CoreWeave's dossier does not carry the Elk Grove Village lease (one-sided on Prime's side); Tract's PUCN decision on two temporary gas plants is due **8 Sept 2026**; Fermi's Q3 date is unconfirmed.
- **Peer group:** F6, F7 and F8 all noted that `Colocation & Cloud Capacity` mixes generation-first, powered-land and build-to-suit developers with merchant battery developers; family map unchanged by instruction — a candidate item for the closeout or X3, not for a dossier session.
- **Environment:** Wayback-read company pages need the canonical-URL citation convention (so first-party share stays honest); concept registration must run from the repo root (relative paths); the harness pattern from F6/F7 held.

### Active context

- Branch `claude/phase-b-f8-profiler-setw9a`; repo version **v04.77r**; CHANGELOG **94/100** — 6 pushes of headroom.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders. `TODO.md`: no items.
- Checker state at v04.77r: registry sync clean · study clean · relationships exit 0 (14 accepts) · crossrefs exit 0 (8 accepts) · reports not re-run (X3 re-pins) · roles not run.

### Recommendation for next session

- **Run the Phase B closeout on Fable 5.1 High — the §7 "Register checks" obligation: re-run all twelve `CLASSROOM-CURRICULUM-PLAN.md` §6 rows against the corpus (files by slug, guide section titles, `guidanceDocs_()` ids — not against the rows' own text), append a dated "Where the register stands after Phase B" trail paragraph and refresh the Standings, then mark Phase B complete in `PROFILER-COVERAGE-PLAN.md` (§4 header/Regrouping note, §9.5 run-order row 2, the §1-style counts) and carry the peer-family observation into a §7 bullet for X3.** One push commit; no dossier work.
**To continue:** type `run the Phase B closeout on Fable 5.1 High`

### Session — Phase B F7, Compass Datacenters · EdgeCore · PowerHouse Data Centers (Fable 5.1 High)
**Date:** 2026-09-05 07:27 PM EST
**Repo version:** v04.76r — three push commits this session (`a560905` v04.74r F7, `df0ef87` v04.75r, `de70a93` v04.76r; all merged to `main`), plus this housekeeping commit
**Branch:** `claude/phase-b-f7-aidc-landlords-3h01nd` (rebased onto `origin/main` after each merge)
**Model:** Fable 5.1 High — Phase B session **F7**: Compass Datacenters · EdgeCore Digital Infrastructure · PowerHouse Data Centers (the AIDC landlords), then two follow-up fixes to the `mccarthy` dossier. Six research subagents (two per company), dossiers, guides, lesson plans, step 7 reconciliation, all in one push commit; context compacted once, just before that commit.

Developed by: LightAISolutions
