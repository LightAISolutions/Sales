# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-12 06:17:31 PM EST
**Repo version:** v05.38r — **two push commits** on `claude/focused-pascal-ks3o2e` (v05.37r Heron Power dossier + guide; v05.38r primer update, Crusoe/Intersect revisions, S3 evaluation, this remember-session), the first merged before the second was pushed
**Branch:** `claude/focused-pascal-ks3o2e`
**Model:** Fable 5.1 Medium as the orchestrator; the two research subagents inherited it (32 first-party + 58 third-party sources, ~19 minutes wall-clock, no cap hit — the weekly Fable allowance had reset)

### What was done

1. **v05.37r — Heron Power dossier (`heron-power`, profileVersion 1, 52 sources, 37% first-party) and study guide (13 sections) + eight-module lesson plan**, six new concepts (cascaded H-bridge, dual active bridge, medium-frequency transformer, transformer-rectifier unit, hall-edge block, overload), registry/calendar/segments entries (challenger on `power-conversion-and-rack-power-silicon`, adjacent on `in-hall-power`), graph rebuild, and a new §8 Phase E row **E8**. All six checkers clean; rendered in Playwright (sign-in wall bypassed in a scratch copy with `_e = ''` and the `analyst` role in localStorage — the repo page was untouched)
2. **The first premise check resolved:** 4.2 MW is the 800 V DC data-center configuration (Blueprint ×3; product page "800V Power: 4.2MW", 45 °C) and 5 MW is the solar/storage DC-to-MV inverter configuration of the same platform (product page, 50 °C, 98.6%); the Aug/Sep 2026 releases use the round solar figure. No company document states both; none of nine outlets noticed
3. **v05.38r — SST primer revised and the PDF rebuilt (38 pages)**: chapter 7.3 Heron entry, positioning-matrix row, judgment 8.1, five new sources [134]–[138] (the dossier is a REPO source), closing note cites corpus v05.37r. **Crusoe → v6 and Intersect Power → v2** each gained a one-sided `heron-power` supplier relationship (announced; LOI 2025-06 / CEO endorsement 2026-02) with its source; v5 and v1 archived; the `named-project-bess-attach` report's Crusoe pin re-verified at v6; README archive entries added (including the previously missing `crusoe.profile.v4.json`)
4. **S3 evaluated** (§10.5 dated note added): **seven of ten unchanged**; V2 · E1b is the sole remaining gate; the Fable allowance has reset, so V2 runs next and alone; paste-in prompt handed to the developer (also below)

### Where we left off

Both pushes merged in order (the v05.37r auto-merge landed before v05.38r was pushed). Nothing in flight. Heron Power is fully in the corpus; the `aidc-power-conversion` report's next edition can now pin it and drop its primer-only framing.

### Key decisions and findings

- **Identity facts the plan and primer could not carry:** legal name Heron Power Electronics Company (Form D: "Heron Power Electronics Co", former name Accelerate Power Co., Delaware, 2024; the company's own legal pages say "Heron Power, Inc." — all in `aka[]`); HQ Scotts Valley (Santa Cruz County), not the Bay Area; factory 850 Jarvis Drive, Morgan Hill; USD 60M J.P. Morgan / TriplePoint credit facility + Kirkhorn board seat (2026-09-10); LG Energy Solution Vertech collaboration (June 2026); data centers ≈ one third of current business (TechCrunch)
- **Environment:** `sec.gov`/`data.sec.gov` still 403, but **`efts.sec.gov` full-text search answers** and both Form D XMLs were retrieved through it — a route worth reusing for US private subjects; `www.globenewswire.com` fails at TCP level (Wayback mirrors, cite originals)
- **Formatting rule re-learned the hard way:** `profiler-segments.json`, the refresh calendar, `archive-index.json` and some dossiers (e.g. `crusoe`) are written at `indent=1`; the registry and most dossiers at `indent=2`; always `ensure_ascii=False`; never re-sort the roster (it is append-ordered). A first pass produced 10,000-line diffs before this was caught — check `git diff --stat` before staging
- **Primer chapter 7.3's "the two documents disagree" line was replaced**, not merely annotated, since the resolution is now first-party sourced
- **Model call held:** Fable 5.1 Medium was sufficient for a thin-record private subject; the premise checks were prompt-driven, as §2 predicted

### Active context

- **Repo version** `v05.38r`; **CHANGELOG at 91/100** total, 11 dated 2026-09-12 and exempt → ~80 non-exempt; no rotation inside any Fable session
- **S3: 7 of 10.** Remaining, in order: **V2 · `E1b` (Habitat Energy · Gridmatic)** — the sole landscape gate — then **V3 · `E5` (Grid United · Pattern Energy)**, then **V4 · `E4b+E6b` (Mitra Chem · Cornex)**; all Fable 5.1 High. Identity corrections for all six are already in their §8 rows (Habitat is Quinbrook-owned and for sale; Gridmatic HQ is Houston; Mitra Chem's legal name is Mitra Future Technologies, Inc.; Cornex is 楚能新能源, not 中比新能源)
- **Page versions (unchanged):** Profiler `v01.86w`, Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Still awaiting developer approval (§10.5 item D):** `aka[]` in the `Profiler.html` roster search haystack (~line 2202); Heron added eight more aliases the roster cannot find
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **S3 V2 · E1b (Habitat Energy · Gridmatic) on Fable 5.1 High** as a fresh session — the only unfinished item that blocks a segment lesson (`software-and-optimization`); dossier + study guide for both in one push commit, segments assigned with a `basis` line each, both §8 rows rewritten, then V3 only if the Fable pool recovers enough for two.

**To continue:** paste the V2 prompt below into a new Fable 5.1 High session (the same text was handed to the developer in the v05.38r response):

```text
Picking up from my last session, run Phase E of repository-information/PROFILER-COVERAGE-PLAN.md on
Fable 5.1 High as a fresh session: S3 V2 · E1b — Habitat Energy, Gridmatic.
READ FIRST: repository-information/SESSION-CONTEXT.md; PROFILER-COVERAGE-PLAN.md §2, §7, §10.3–10.5 and the two
E1b rows in §8 (both carry identity corrections from 2026-09-09 — Habitat Energy Limited is a Quinbrook
Infrastructure Partners subsidiary under a live sale process; Gridmatic is private, HQ Houston, operating
entities Gridmatic Rosa LLC and Gridmatic Equisetum LLC); .claude/rules/profiler-app.md (Profiler Command incl.
step 1a identity verification and step 7 corpus reconciliation, Profiler Prep Command, Scheduled Refreshes);
repository-information/PROFILER-SCHEMA.md; repository-information/PROFILER-STYLES.md (active style: intel-briefing).
THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7, profileVersion 1,
category supplier per the §8 rows) and study guide (schema v2) — then the registry sync, the graph build, the study
validator, the relationships and crossrefs checkers, a calendar row each (Habitat: quarterly cadence with the
Quinbrook sale as the first watch item; Gridmatic: quarterly), README tree entries, and flip both §8 rows.
Then assign each company's segments and roles in live-site-pages/profiler-data/profiler-segments.json with a
basis line per PROFILER-SCHEMA.md → Segments registry (the §8 Segment · role cell — software-and-optimization ·
challenger for both — is a hypothesis: write what the dossier supports), and rewrite the §8 Phase E rows.
THE §8 ROW IS A HYPOTHESIS, NOT A BRIEF: treat every claim in its `Why` cell as unverified, re-run step 1a on both
identities (Habitat's sale may have signed or closed since 2026-09-09), and rewrite that cell plus the `Checked`
column with what you actually found before you commit.
SESSION NOTES: this is the sole remaining S3 landscape gate — landing both companies unblocks the
software-and-optimization landscape for S2. Before Stage 2 research run python3 scripts/check-source-reachability.py
and probe Companies House (find-and-update.company-information.service.gov.uk) for Habitat; sec.gov is blocked
from this environment but efts.sec.gov full-text search answers for any Form D. One push commit; do not start V3 in
this session. JSON formatting: profiler-segments.json and the refresh calendar are indent=1, the registry indent=2,
always ensure_ascii=False, never re-sort the roster — check git diff --stat before staging.
VERIFY: sync-profiler-registry.py --check clean, check-profiler-study.py clean, check-profiler-relationships.py and
check-profiler-crossrefs.py clean, the dossiers and guides render (Playwright; the sign-in wall can be bypassed in a
scratch copy with `var _e = ''` and localStorage ov_note_role = 'analyst' — never edit the repo's Profiler.html for
this), zero page errors. Normal Pre-Commit and Pre-Push checklists; push on a claude/* branch.
```

## Previous Sessions

### Session — 2026-09-12 05:16:08 PM EST (v05.36r)

**Date:** 2026-09-12 05:16:08 PM EST
**Repo version:** v05.36r — **one push commit** on `claude/festive-cori-b9nt85` (v05.35r → v05.36r), merged; this remember-session commit follows on the same branch after a rebase onto the merged `main`
**Branch:** `claude/festive-cori-b9nt85`
**Model:** Fable 5.1 as the orchestrator; the four research subagents ran on **Opus 5** after the first four runs on Fable 5.1 terminated on the usage cap (the session spanned 2026-09-11 evening to 2026-09-12 afternoon)

### What was done

1. **v05.36r — the Solid-State Transformers educational primer.** A 38-page PDF (`repository-information/SOLID-STATE-TRANSFORMERS-PRIMER.pdf`) with 10 chapters, 14 figures, 9 tables and 133 numbered sources tagged FIRST-PARTY / SECONDARY / REPO, plus its HTML source (`sst-primer-print.html`), a figures directory (`sst-primer-figures/`, 4 hand-drawn SVG schematics + 10 matplotlib charts) and two build scripts (`scripts/build-sst-primer-figures.py`, `scripts/build-sst-primer-pdf.mjs`). Delivered to the developer as a downloadable file and committed
2. **CHANGELOG rotation fired on schedule** — the 2026-09-03 date group (**13 sections, v04.35r–v04.47r**) moved to the archive with SHA enrichment (13 of 13 resolved after `git fetch --unshallow`). Active file now **`Sections: 89/100`**. A first pass caught only 12 of the 13 because the grep pattern skipped v04.40r–v04.45r's neighbours; v04.47r was moved in a second pass before the commit
3. **Answered the model question for the Heron Power dossier** (research response, nothing committed): **Fable 5.1 Medium**, falling back to **Opus 5 xhigh** if the weekly Fable allowance has not reset — not High. Reasoning is §2 of `PROFILER-COVERAGE-PLAN.md`: effort buys reading depth, not care; Heron has no long filings to read; the budget is tight (yesterday's Fable agents died on the cap); the primer already holds the six first-party Heron documents

### Where we left off

The v05.36r push merged (auto-merge run landed `bda21bb Update last-processed-commit.sha to 83fcdda`). This remember-session commit is the only thing after it. Nothing is in flight. **Heron Power still has no Profiler dossier** and no §8 ledger row — the primer covers it from first-party sources only.

### Key decisions and findings

- **The primer pins five findings the corpus previously carried secondhand:** (1) NVIDIA's Oct 2025 white paper specifies **single-ended 800 V DC** (POS/RTN/PE) and explicitly rejects OCP's ±400 V bipolar bus for lack of three-pole DC breakers — the rack accepts either; (2) NVIDIA rates the **MV rectifier and the SST at the same 98.5%+**, so "up to 5% efficiency / 45% copper" is an architecture-vs-legacy-AC claim from the Oct 2025 blog, not an SST-vs-TRU claim; (3) the **Aug 2026 execution paper held in the repo** (`industry-guidance/sources/nvidia-800vdc-white-paper-2026-08.pdf`) names **three TRU families for the first Option C block, including Zhonhen's Panama Architecture (p. 22)**, and attaches "toward 2029" specifically to the next-generation 34.5 kV-direct SST — confirming the competitive report's framing first-hand; (4) the **GE Vernova dossier's hyperscaler commitment to buy 1,000 SSTs from 2027** if spec is met is the tier's most important commercial datapoint; (5) the **US gating item is the DC arc-flash model** — NFPA FPRF's Phase 1 is focused on 800 Vdc data centers, sponsored by Siemens/Schneider/Eaton/ABB/Mersen, "around three years" — a ~2029 deliverable against a 2027 Kyber ship date
- **Two rendering rules for the Chromium PDF pipeline, now commented in the script and stylesheet:** page margins must be declared in the stylesheet's `@page` rule, not passed to `Page.printToPDF` — with `preferCSSPageSize:true`, passing both made a page-spanning table's repeated `<thead>` overprint the running header; and long prose belongs in `<figcaption>`, not SVG `<text>` (a false alarm worth remembering: SVG text appeared to vanish in headless screenshots only because `--window-size` includes ~80 px of browser chrome that crops the viewport — the PDF renderer was never affected)
- **Research provenance discipline:** four aggregator domains the agents judged AI-generated (`mgrid.org`, `enkiai.com`, `gridreadiness.com`, `hiitio.com`) are cited only twice, both flagged secondary and corroborated; domains that refuse automated retrieval (opencompute.org, nerc.com HTML, ferc.gov, se.com, eaton.com press) are named in the Sources chapter
- **Developer branding applied to generated SVGs:** the figure script appends `<!-- Developed by: LightAISolutions -->` after each chart's root element; the PDF is binary and carries none, matching the existing AIDC PDFs
- **Heron Power model choice — Fable 5.1 Medium** (see item 3 above). By §2's letter a private thin-record subject is a High subject, but §2's own evidence (Xcel head-to-head: Opus's only clear edge was 10-K reading depth; F5: Medium caught all three premises) and the budget make Medium the better call; Opus 5 xhigh is the §2-sanctioned fallback when the Fable cap binds, recorded in the §8 Model column as B2 did

### Active context

- **Repo version** `v05.36r`; **CHANGELOG at 89/100** — no rotation due until it climbs back to 100 non-exempt. The clone was **unshallowed this session** (1,104 commits), so SHA enrichment resolves without a deepen step for the rest of the session only; the next session starts shallow again
- **S3: still 7 of 10** — untouched this session. Remaining: **V2 · `E1b` (Habitat Energy · Gridmatic)**, **V3 · `E5` (Grid United · Pattern Energy)**, **V4 · `E4b+E6b` (Mitra Chem · Cornex)**, all Fable 5.1 High per the plan; V2 is the sole remaining landscape gate
- **Primer follow-ups not yet actioned:** the 2026-09-08 `aidc-power-conversion` report cites StorageReview for Option A/B/C — it could be re-pointed at the repo's own Aug 2026 NVIDIA paper on its next edition; the primer's SolarEdge/Infineon SST entry rests on an aggregator and would be better anchored on a SolarEdge press release
- **Page versions (unchanged this session):** Profiler `v01.86w`, Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Still awaiting developer approval (§10.5 item D, offered seven sessions running):** adding `aka[]` to the `Profiler.html` roster search haystack (~line 2202, currently `(c.name + ' ' + c.slug)`), narrowed to names-only by explicit directive 2026-08-30
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Create the **Heron Power dossier and study guide on Fable 5.1 Medium** as a fresh session (Opus 5 xhigh only if the Fable allowance has not reset, recorded as a §2 substitution): it is the only startup on NVIDIA's facility-tier 800 VDC roster, the US-relevant candidate for the first 34.5 kV SST energisation, absent from the corpus that both the `aidc-power-conversion` report and the new primer draw on, and the primer's chapter 7.3 plus sources 22 and 97–101 already hold its six first-party documents. Add a new §8 ledger row (no Phase E row exists for it) and make the 4.2 MW (blueprint) versus 5 MW (Aug 2026 factory release) rating discrepancy the first premise check.

**To continue:** paste the §7 template with `Fable 5.1 Medium as a fresh session: Heron Power`

Developed by: LightAISolutions
