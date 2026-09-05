# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-04 10:12 PM EST
**Repo version:** v04.59r (bumped this session on the F2 push commit `911f8e0`; this entry is the housekeeping commit `Remember session context`)
**Branch:** `claude/fable-phase-b-f2-sf0i80` (the v04.59r push merged and the branch was swept; rebased onto `origin/main` at `4634e10` before this commit)
**Model:** Fable 5.1 High — Phase B session F2 (Fluidstack · Nscale · Anthropic).

### What was done

- **Three dossiers (schema v7, profileVersion 1, intel-briefing) + three schema v2 study guides + three lesson plans in one push commit.** `fluidstack` and `nscale` under `neocloud`, `anthropic` under `hyperscaler` — the first frontier-lab dossier. Sources 136 / 126 / 149 (first-party 47 / 51 / 56 percent); relationships 9 / 9 / 13, all resolving; 31 headshots (none for Fluidstack — no leadership page with photos exists); 46 shared concepts registered (tenant-of-record and lease vocabulary, anchored-neocloud financing, the buyer-side compute-contract terms). Registry sync (115), graph rebuild (785 edges), study checker (89 guides, 684 concepts) and the Playwright render of every dossier tab and every guide all clean; three quarterly calendar rows (76).
- **Every URL asserted programmatically.** `scratchpad/urlindex.py` built a URL index from the six agent reports (plus session-fetched pages and other covered dossiers' sources as a second tier) and every sources[], relationships[], policyExposure[] and recentDevelopments[] URL was checked against it before assembly — 0 unmatched per dossier. The F1 lesson, applied.
- **Premises re-verified as dated facts and recorded, not smoothed:** the 401 MW / 20-year Anthropic lease is at Justified (Hawesville, KY), direct with TeraWulf, no Fluidstack entity; Microsoft walked from Nscale's 1.35 GW Monarch LOI (Semafor) and the Anthropic 460 MW / about USD 45bn contract there is press-reported and unconfirmed by either party (`announced`); OpenAI's Stargate Norway LOI was replaced by Microsoft and Stargate UK is paused; Fluidstack's USD 1.5bn round at USD 18bn is unannounced by the company; its 1 GW France campus was withdrawn in March 2026.
- **§8 rows flipped to `B9 → F2 … v1 · v04.59r | ✓ · v04.59r`.** CLASSROOM-CURRICULUM-PLAN.md §6 untouched (F2 closes no register row). README execs line recounted from the files by registry slug: **407 images across 69 companies** — the prior 68 baseline was one high (67 by the same method), so the count moved by one company fewer than the two added.
- **Wrote the paste-ready F3 prompt** (Aypa Power · Spearmint Energy · Intersect Power) in chat at ~10:15 PM EST.

### Where we left off

Nothing is in flight. Working tree clean after this commit. F3–F8 remain on Fable 5.1 High; the G6 guidance module (Opus 5 xhigh), Phase C C4–C10 + C12, 26 guide backfills and Phase D are unchanged.

### Key decisions and findings

- **The URL index is the assembly gate, not a post-check.** Build `<slug>-{a,b}.md` reports that each end in `## ALL URLS`, index them, and have the assembler refuse any URL not in the index; cite a source from another covered dossier's sources[] (corpus tier) rather than from memory when a release times out or 404s.
- **Reported contract values stay `announced` with the reporter named.** The Nscale–Anthropic Monarch terms and the Lambda contract are the two largest unconfirmed numbers in the three dossiers; each calendar row's first watch item is their confirmation.
- **A subsidiary's parent domains count as first-party** (schema rule) — Anthropic's registry domains include claude.com and its CDN; Fluidstack's include the project-site domains.
- **Six agents died on an HTTP 429 usage limit mid-run** and were resumed by SendMessage with context intact after the user's reset — resume rather than respawn; the reports were complete. The stall cost ~1h 25m; net of it F2 ran ~72 minutes against a 90m estimate.
- **`json.dump(indent=2, ensure_ascii=False)` matches the calendar file's formatting** (46-line diff for three rows); the concepts file is the same.
- **Environment re-confirmed:** Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; threaded HTTP server + GAS stub as admin + accounts.google.com fulfilled empty; `f2-render-check.py` (per-slug tabs incl. Relationships, sources count, `{{`, then `#ov-study-btn` and `.gd-term` data-terms against concepts + glossary) is the working harness — dry-run it on a known-good slug first. Shell cwd resets to the repo root after every Bash call; tool output above ~30 KB persists to a file; foreground sleep is blocked (Monitor tool).

### Active context

- Branch `claude/fable-phase-b-f2-sf0i80`; repo version **v04.59r**; CHANGELOG 76/100.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry 115 companies; concepts 684; calendar 76 rows; execs 407 images across 69 companies.

### Recommendation for next session

- **Run F3 (Aypa Power · Spearmint Energy · Intersect Power) as a fresh Fable 5.1 High session using the paste-ready prompt written in chat on 2026-09-04 at ~10:15 PM EST** — three `developer · ipp` dossiers + three guides on the BESS-developer buyer side, with the Aypa (Blackstone → Brookfield), Intersect (Google-owned) and Spearmint ownership premises re-verified first, §8 rows flipped to `B3 → F3`, one push commit.
**To continue:** type `run F3 on Fable 5.1 High`
