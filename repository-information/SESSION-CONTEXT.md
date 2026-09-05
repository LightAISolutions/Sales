# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions


**Date:** 2026-09-05 02:52 AM EST
**Repo version:** v04.61r (bumped this session on the F4 push commit `5a3497c`; this entry is the housekeeping commit `Remember session context`)
**Branch:** `claude/fable-phase-b-f4-802vt2` (the v04.61r push merged and the branch was swept; rebased onto `origin/main` at `ecd9dbb` before this commit)
**Model:** Fable 5.1 High — Phase B session F4 (Invenergy · GridStor · Available Power).

### What was done

- **Three `developer · ipp` dossiers (schema v7, profileVersion 1, intel-briefing) + three schema v2 study guides + three lesson plans in one push commit.** Sources 134 / 97 / 42 (first-party 55 / 44 / 26 percent — Available Power's is low because its own storage pages are gone and the record is partner releases); relationships 14 / 6 / 2, all resolving; 35 headshots (Invenergy 16, GridStor 14, Available Power 5 company-published low-poly portrait renders); 38 shared concepts registered (owner-and-financier vocabulary: managing member, economic ownership, infrastructure fund, fund life, LP/GP, asset manager, sponsor-created platform, merchant transmission, converter station, OATT, loan guarantee, conditional commitment, eminent domain, easement, farmdown, virtual PPA, EAPA, revenue swap, distributed generation resource, DSP, site lease, turnkey EPC, project marketplace, CEQA, CCA, Chapter 381). Registry sync (121), graph rebuild (837 edges), study checker (95 guides, 768 concepts) and the Playwright render of every tab and guide all clean; three quarterly calendar rows (82); §8 rows flipped to `B4 → F4 … v1 · v04.61r | ✓ · v04.61r`; execs recount 468 across 74; CHANGELOG 78/100.
- **Every URL asserted programmatically** (`scratchpad/urlcheck.py` — report index from the six `## ALL URLS` lists plus a corpus tier) — 0 unmatched per dossier (193 / 135 / 67 URLs); it caught one truncated Cleanview path and one source filed under the wrong company.
- **Premises re-verified and corrected, not smoothed:** Invenergy is **#2 by development pipeline** on Cleanview (41,328 MW behind NextEra's 68,229) — 'largest privately held' is company and Blackstone language with no ranking behind it; ownership is CDPQ (52.4% economic of Invenergy Renewables LLC since 2018), Blackstone Infrastructure (about USD 4bn, 2022–2023) and management as managing member, gas in Invenergy Clean Power LLC 50/50 with InfraBridge, no 2024–2026 change; no battery supplier is named anywhere. GridStor is **contracted, not merchant** (SCE 17-yr RA, APS 20-yr toll, a Fortune 500 toll, an Axpo revenue swap), multi-market (CA/TX/AZ/OK/CO), Portland-based, owned by 'a fund managed by Goldman Sachs Asset Management' (trade press: Horizon Energy Storage) that **created** the company in 2021. Available Power is **Texas-only, develop-and-sell at NTP** of 9.9 MW batteries with Linxon as turnkey EPC, no sponsor named, nothing operating on any tracker, and a parent (Available Infrastructure, Tysons Corner) that pivoted to edge-AI in July 2025; the storage record is silent since March 2024; the 'Sungrow' in the 2024 ESN article is a caption about another company.
- **Six agents died on the HTTP 429 session limit** ~25 minutes in and were resumed by SendMessage after the 06:00 UTC reset with context intact (the F2 lesson); the stall cost ~2h 15m, net work ~1h 13m against a 90m estimate.
- **Evaluated Fable 5.1 Medium vs High for F5–F8 and wrote the paste-ready F5 prompt** (esVolta · Strata Clean Energy · Hunt Energy Network) in chat at ~02:55 AM EST.

### Where we left off

Nothing is in flight. Working tree clean after this commit. F5–F8 remain (see the model decision below); the G6 guidance module (Opus 5 xhigh), Phase C C4–C10 + C12, 26 guide backfills, the F9 Xcel head-to-head and Phase D are unchanged.

### Key decisions and findings

- **Model for F5–F8: run F5 on Fable 5.1 Medium as a measured test, with tripwires.** Anthropic's Fable 5.1 docs (released 1 September 2026) say Low or Medium effort matches or beats Fable 5 at High at much lower cost, that the 5.1-over-5 gains are widest at higher effort, and that the one documented lower-effort regression is the model answering from memory instead of searching — the research agents' failure mode, which the URL-index gate structurally catches. The binding constraint on this program has been the cap (two 429 stalls in four sessions). If F5's agents return fewer URLs (<50 per third-party agent), lean on snippets, or the judgments read as summaries, switch F6–F8 back to High; either way record the effort actually used in the §8 Model column (`Fable 5.1 High → Medium`) per the §2 substitution rule. The claim that the reset was update-driven is unverified — the 06:00 UTC reset is the ordinary session-limit reset.
- **The render harness needs two fixes** now in `scratchpad/f4-render-check.py`: `page.goto('about:blank')` before each dossier (the study-guide overlay otherwise intercepts the next dossier's tab clicks) and a `try/catch` around the localStorage init script (`about:blank` denies it). The sources count reads `.ov-sources ol li`, not `#ov-main ol li` (the numbered judgments leak in).
- **Timeline sections use lane keys `gen` / `deploy` / `eco`** (`GD_LANE_COLORS`); other keys render grey. Registry `hq` strings are free-form; `City, ST, USA` was used.
- **The URL-index corpus tier only sees dossiers already on disk** — write all three profiles before relying on cross-citation; `urlcheck.py` excludes the slug being checked.
- **Analyst supplier attributions are `announced` with the reporter named** (Enerdatics' SolBank 3.0 at White Tank); interconnection adjacencies to a covered utility are `other` (Xcel's Riverdale substation, AEP's Closner); exec alumni links stay in prose (Tony Song ex-Invenergy, Chris Taylor ex-Google).
- **Company-published portrait renders count as company photos** (Available Power's low-poly set) — used, not skipped.

### Active context

- Branch `claude/fable-phase-b-f4-802vt2`; repo version **v04.61r**; CHANGELOG 78/100.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry 121 companies; concepts 768; calendar 82 rows; execs 468 images across 74 companies.

### Recommendation for next session

- **Run F5 (esVolta · Strata Clean Energy · Hunt Energy Network) as a fresh Fable 5.1 Medium session using the paste-ready prompt written in chat on 2026-09-05 at ~02:55 AM EST** — three `developer · ipp` dossiers + three guides, the B5 premises ("contracted and merchant mid-size BESS owners across CAISO, PJM and ERCOT") re-verified first, §8 rows flipped to `B5 → F5` with the effort level recorded, one push commit (v04.61r → v04.62r); fall back to High on the tripwires above.
**To continue:** type `run F5 on Fable 5.1 Medium`

