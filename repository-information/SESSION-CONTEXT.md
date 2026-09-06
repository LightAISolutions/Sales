# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — Phase B F7, Compass Datacenters · EdgeCore · PowerHouse Data Centers (Fable 5.1 High)
**Date:** 2026-09-05 07:27 PM EST
**Repo version:** v04.76r — three push commits this session (`a560905` v04.74r F7, `df0ef87` v04.75r, `de70a93` v04.76r; all merged to `main`), plus this housekeeping commit
**Branch:** `claude/phase-b-f7-aidc-landlords-3h01nd` (rebased onto `origin/main` after each merge)
**Model:** Fable 5.1 High — Phase B session **F7**: Compass Datacenters · EdgeCore Digital Infrastructure · PowerHouse Data Centers (the AIDC landlords), then two follow-up fixes to the `mccarthy` dossier. Six research subagents (two per company), dossiers, guides, lesson plans, step 7 reconciliation, all in one push commit; context compacted once, just before that commit.

### What was done

- **Three dossiers** (schema v7, profileVersion 1, intel-briefing, category `developer`): `compass-datacenters` (102 sources, 42% first-party, 10 relationships), `edgecore` (107, 53%, 7), `powerhouse-data-centers` (114, 52%, 6; `ownership.type: subsidiary` of American Real Estate Partners). 46 company-published headshots (execs 594 across 86 companies). All three private or sponsor-owned → calendar `cadence: "quarterly"` (94 rows).
- **Three schema v2 guides + lesson plans**: Compass (the sponsor-owned build-to-suit developer — the case study), EdgeCore (the single-tenant campus lease from the landlord's chair — the structural chapter), PowerHouse (powered land and the utility-first campus). 40 shared concepts registered (895 total); two alias collisions resolved on first registration. None repeats aligned, vantage, qts, switch, equinix, stack-infrastructure, fluidstack or nscale.
- **Step 7 reconciliation**: `southern-company` v2 (Compass `customer` edge added, URL registered); `holder-construction` v5 (six "$1.9B contract" strings corrected — the Construction Dive figure is EdgeCore's financing, not Holder's award — and an `edgecore` `customer` edge added). `hitt` and `mccarthy` EdgeCore mentions were accurate and untouched in F7. `\bPowerhouse\b` hits in `kiewit` and `oklo` are Oklo's Aurora product, not the company; `Joliet` had no hits.
- **Follow-ups (separate pushes)**: `mccarthy` v3 — the Construction Dive source date corrected 2023-08-01 → 2024-01-10 (verified on the live page); `mccarthy` v4 — the same source's label aligned with Holder's wording, keeping the "corrects a misattribution to McCarthy" clause. Both archived (v2, v3) and indexed.
- **Checkers at v04.76r**: registry sync clean (133 companies) · study 0 errors (107 guides) · relationships exit 0 with **0 new accepts** (14 entries unchanged; no `investor` edges written) · crossrefs exit 0 with 0 new candidates (one Compass `productsAndServices` entry at 1,761 chars is over the checker's cap and listed as not examined) · graph 974 edges (727 curated) · Playwright: five touched slugs rendered with zero page errors.
- **Bookkeeping**: §8 rows flipped `B7 → F7` with premise verdicts; §7 investor bullet extended with the landlords' peer-group note; F7 entry in the calibration log (0/0/0/0); README tree (+3 profiles, +3 guides, +3 study-prep folders, +5 archive lines); CHANGELOG **93/100**.

### Where we left off

Nothing is in flight. Working tree clean, branch rebased onto `origin/main`. **Program state: 44 of 65 new companies, 4 of 30 guide passes.** The F8 paste-in prompt was handed to the developer in this session's chat (regenerate from §4 row B8, §7 and the F7 prompt pattern if lost).

- **Next action is F8** on Fable 5.1 High — Fermi America · Tract · Prime Data Centers (`developer`, AIDC developers) — the last Fable session of Phase B.
- **Fable remaining:** F8 (High). **Opus remaining:** C5–C10, C12, 26 guide backfills, X3.

### Key decisions and findings

- **Premise verdicts (§4 → §8 Closes):** the B7 cell fused three companies. "Brookfield-owned" = Compass, **held imprecisely** (co-controlled by Brookfield Infrastructure and Ontario Teachers'; KKR at asset level since Dec 2025). "1.8 GW delivered or under development on $16.1B planned" = EdgeCore's own 13 Jan 2026 wording, **held as wording** (two operating buildings; site now says 2.27+ GW / $7.4bn). "Joliet 1.8 GW campus" = Hillwood/PowerHouse, **held as a plan**: annexed 8–1 on 19 Mar 2026, ComEd transmission agreement cancelled 24 Jul 2026, litigation pending — the most volatile item before the first quarterly refresh.
- **Brief corrections:** PowerHouse's brief domains were parked or dead (real: powerhousedata.com, americanrepartners.com, joliettechnologycenter.com); HQ McLean, not Reston/Herndon; "Luke Kinney" is Luke Kipfer. EdgeCore headshots are AVIF (`pillow-avif-plugin`).
- **No project pins** — every campus stayed in prose because no relationship was ready to pin one; `profiler-projects.json`, Scraper.gs and Profiler.html untouched (page stays v01.82w).
- **Peer group reads oddly:** `Colocation & Cloud Capacity` mixes build-to-suit landlords with F3–F5 merchant storage developers. Noted in §7; family map unchanged by instruction.
- **Step 7 taught a GC-dossier rule:** general-contractor dossiers restate campus values as contract awards — verify builder/campus attributions against the landlord's own release before trusting them.
- **Environment:** harness needs `wait_until='load'` and a 90 s reload timeout (`networkidle` timed out on southern-company); the harness-created remote branch was swept by the workflow before each push, so push-once held every time; three rebases this session, one before each push commit.

### Active context

- Branch `claude/phase-b-f7-aidc-landlords-3h01nd`; repo version **v04.76r**; CHANGELOG **93/100** — 7 pushes of headroom.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders. `TODO.md`: no items.
- Checker state at v04.76r: registry sync clean · study clean · relationships exit 0 (14 accepts) · crossrefs exit 0 (8 accepts) · reports not re-run (X3 re-pins) · roles not run.

### Recommendation for next session

- **Run F8 on Fable 5.1 High — `profiler` + `profiler prep` for Fermi America, Tract and Prime Data Centers (`developer`, AIDC developers), then the four after-write scripts, three calendar rows (Fermi America is believed listed — confirm and give it a `nextReport`), README tree entries and the §8 flips.** Corpus mentions to reconcile in step 7: Fermi America in `xcel-energy` (and `\bFermi\b` in `excelsior-energy-capital` — classify); Tract in `compass-datacenters`, `hunt-energy-network`, `powerhouse-data-centers` (watch for "Tract of land"); Prime Data Centers in `lambda`, `plus-power`; Amarillo in `intersect-power`, `xcel-energy`.
**To continue:** type `run F8 on Fable 5.1 High`

Developed by: LightAISolutions
