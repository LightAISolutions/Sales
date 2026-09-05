# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-04 11:18 PM EST
**Repo version:** v04.60r (bumped this session on the F3 push commit `4507585`; this entry is the housekeeping commit `Remember session context`)
**Branch:** `claude/fable-phase-b-f3-profiler-efm1gh` (the v04.60r push merged and the branch was swept; rebased onto `origin/main` at `80a8e06` before this commit)
**Model:** Fable 5.1 High — Phase B session F3 (Aypa Power · Spearmint Energy · Intersect).

### What was done

- **Three `developer · ipp` dossiers (schema v7, profileVersion 1, intel-briefing) + three schema v2 study guides + three lesson plans in one push commit.** Sources 91 / 114 / 116 (first-party 44 / 23 / 51 percent — Spearmint's is low because Business Wire returns 403 and every release was read through mirrors); relationships 4 / 5 / 6, all resolving; 26 headshots (Intersect 7, Spearmint 19; Aypa publishes none); 46 shared concepts registered (the developer-and-financing vocabulary: development-stage ladder, queue position, NTP/COD, ready-to-build, pre-COD M&A, platform sale, tax equity and partnership flip, bridge loans, warehouse, back-leverage, revenue put, energy park, surplus interconnection, co-location net metering, Chapter 312). Registry sync (118), graph rebuild (810 edges), study checker (92 guides, 730 concepts) and the Playwright render of every tab and guide all clean; three quarterly calendar rows (79); §8 rows flipped to `B3 → F3 … v1 · v04.60r | ✓ · v04.60r`; execs recount 433 across 71.
- **Every URL asserted programmatically** (`scratchpad/urlcheck.py`: report index from the six `## ALL URLS` lists plus a corpus tier) — 0 unmatched per dossier before writing; the check caught two label typos and one parenthesised URL the first regex truncated.
- **Premises re-verified and corrected, not smoothed:** the Brookfield–Aypa sale is signed (22 July 2026, about USD 7bn EV / USD 3bn equity, Brookfield 8-K) and **not closed**; the 6.5 GW is Brookfield's figure, split by Brookfield Renewable (about 3,000 MW operating and under construction; about 3,500 MW contracted). Spearmint has **no Blackstone or any sponsor** (lender Elda River: 'controlled by Roscommon Analytics'), is develop-to-own not develop-to-sell, and its '15 GWh' is boilerplate dropped from 21 May 2026. Google **closed** the Intersect purchase on 10 March 2026 (USD 5,868m in Alphabet's Q2 10-Q), bought only the parks and team, the fleet went to IPX Power, and **there is no Wyoming campus**.
- **The brief's list of IPP guides to avoid does not exist** (plus-power, jupiter-power, key-capture-energy, eolian, arevon, terra-gen, nextera-energy-resources have dossiers but no guides — the Phase C backfills); the guides name the Classroom's tolling / ancillary / duration material and the crusoe / xai / google guides instead.
- **Wrote the paste-ready F4 prompt** (Invenergy · Gridstor · Available Power) in chat at ~11:18 PM EST.

### Where we left off

Nothing is in flight. Working tree clean after this commit. F4–F8 remain on Fable 5.1 High; the G6 guidance module (Opus 5 xhigh), Phase C C4–C10 + C12, 26 guide backfills and Phase D are unchanged.

### Key decisions and findings

- **Business Wire is 403 from this environment.** Read releases through Yahoo Finance, SFNet, 01net, Pulse 2.0, IREI, Energy Global and Batteries News mirrors, and cite the mirror; the company's `in-the-news` page gives the titles. archive.org is blocked too.
- **Keep parentheses inside URLs in the index regex** (`https?://[^\s<>\[\]"'`]+`, strip trailing punctuation) — an MPUC PDF named `Application%20(1).pdf` was truncated by the F2 pattern.
- **A design basis in a permit filing is `announced`, not a supply relationship** (Tesla Megapack 2XL in Spearmint's Minnesota applications); a competitor link from an analyst ranking cites the ranking (Modo, Enerdatics).
- **Exec-background links and JV attributions are not relationships** (Apex/NextEra alumni at Aypa; Linxon as a Hitachi Energy JV) — mention in prose, do not curate.
- **A company-hosted headshot whose filename marks a LinkedIn origin is skipped** (one Spearmint board photo).
- **Environment re-confirmed:** `pip install playwright pymupdf pillow pillow-avif-plugin` (AVIF headshots need the plugin); Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; the `f3-render-check.py` harness (threaded server, admin stub, per-slug tabs via `#ov-tab-<key>`, sources count, `{{`, `#ov-study-btn` then `.gd-term` data-terms against concepts + glossary) is the working recipe — dry-run on `fluidstack`. Six agents ran 12–17 minutes each with no 429 stall; net session time 53 minutes against a 90-minute estimate.

### Active context

- Branch `claude/fable-phase-b-f3-profiler-efm1gh`; repo version **v04.60r**; CHANGELOG 77/100.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry 118 companies; concepts 730; calendar 79 rows; execs 433 images across 71 companies.

### Recommendation for next session

- **Run F4 (Invenergy · Gridstor · Available Power) as a fresh Fable 5.1 High session using the paste-ready prompt written in chat on 2026-09-04 at ~11:18 PM EST** — three `developer · ipp` dossiers + three guides, the Invenergy ownership (Blackstone Infrastructure stake, CDPQ) and the Gridstor / Available Power sponsor premises re-verified first, §8 rows flipped to `B4 → F4`, one push commit (v04.60r → v04.61r).
**To continue:** type `run F4 on Fable 5.1 High`
