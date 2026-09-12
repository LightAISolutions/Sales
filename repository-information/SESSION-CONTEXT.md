# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-10 07:12:18 AM EST (v05.35r)

**Date:** 2026-09-10 07:12:18 AM EST
**Repo version:** v05.35r — **six push commits** on `claude/adoring-euler-3a855i` (v05.30r → v05.35r), each merged before the next
**Branch:** `claude/adoring-euler-3a855i`
**Model:** Opus 5 — S3 budget review, then a chain of fixes that grew out of verifying the first one

### What was done

1. **v05.30r — the S3 action plan was evaluated against the developer's token budget, and `PROFILER-COVERAGE-PLAN.md` §10.5 was added.** S3 stands at **7 of 10**: the public lane is finished (P1–P6), the private lane is 1 of 4 (V1), and **V2, V3 and V4 are all Fable 5.1 High**
2. **v05.31r — dossier `**bold**` markers rendered as literal asterisks; fixed at the chokepoint.** `ovEl` now routes through `ovSetText` (real `<strong>` runs) and `ovPlain` strips markers from prose mined for relationship evidence
3. **v05.32r — the bold fix appeared not to work, and the cause was a deeper bug.** The page was cached; the version pill fetches `no-store` while the HTML document does not. Added a **first-load staleness check** to `Profiler.html`
4. **v05.33r — promoted to both templates and all ten pages.** The templates never had the cache-busting reload *either*, so this promoted **two dependent fixes**. Also rotated `Profilerhtml.changelog.md`
5. **v05.34r — audited the README tree's version displays.** Five of eight GAS displays were stale, each by exactly one bump. Added `scripts/check-readme-tree.py` and turned [PC-README-TREE] #7's instruction into a verification step
6. **v05.35r — wired the checker into `auto-merge-claude.yml`** as a post-merge auto-fix, and verified it on run #537

### Where we left off

All six pushes merged. The workflow step was **verified on real infrastructure** (run #537, success, step 17 of 19, ~0.23 s, `Delete branch` and `Sweep` ran after it). Nothing is in flight.

### Key decisions and findings

- **S3's blocker is budget, not arithmetic, and §10.5 records the measurement.** A Phase E session costs **~20 points of the weekly all-models allowance** (82 points across P3–P6 in sixteen hours). At **95% all-models / 96% Fable** the remainder was about a quarter of one session, and Phase E is **single-push-commit**, so a session that runs dry leaves nothing committed. **Do not start V2, V3 or V4 on a near-exhausted allowance.** Splitting V2 rescues neither the arithmetic nor the landscape gate — §10.3 holds the software landscape for the pure-play optimizers *plural*
- **All three §10.5 consolidation items were misdescribed when written, and each failed differently against the primary source.** **A** (pre-emptive CHANGELOG rotation) was **withdrawn** — it compared the raw section count against a threshold the spec tests on a **non-exempt** basis, the exact reading reconciled out at v05.01r for firing rotations early. **B** was real but **~120× understated** — recorded against `ecosystemRole` (4 occurrences, last of fourteen fields) when the true surface was **483 across 60 dossiers**, led by `strategyRead[]` at 379. **C** was **not a defect** — the EVE/HiThium inversion is an artifact of one house's half-year table against another's full-year one across a 4% gap; neither role changed. **The common cause: each had been written from a summary of the evidence rather than the evidence**
- **The `<meta build-version>` tag is now load-bearing on every page.** It was documented in three places as informational and never read; all three were amended. A page reads its own stamp on the first poll and reloads once when the version file is ahead. **Bumping `html.version.txt` without the meta tag now costs every visitor one wasted reload.** Two guards are mandatory and present: a single-attempt `sessionStorage` loop guard (the two values are bumped by hand and *can* drift) and a null-safe read
- **The workflow step is deliberately a post-merge auto-fix, not a pre-merge gate.** A blocking gate would strand a real page fix behind a wrong number in a README table. More concretely, **it must never fail**: `Delete branch` and `Sweep` are gated on `success()`, so a red step would leave the `claude/*` branch on the remote and collide with push-once enforcement on the next push. Structural findings emit `::error::` and the step still exits 0 — verified under `bash -e` across three cases
- **A rule missed five times out of eight was not unclear — it was unread.** [PC-README-TREE] #7 named both trigger rules by ID. The structural cause is that the obligation and its trigger lived in **different rules**: a session bumping a `.gs` reads [PC-GS-VERSION] #1, updates two files, and never opens #7. The fix restates the obligation **at both triggers** as well as adding the checker
- **Untested path, stated plainly:** run #537 took the "already in sync" branch, so the step's `git add` / `commit [skip ci]` / four-attempt retry-and-rebase code **has not executed on a runner**. It is copied line-for-line from the AHK step, which runs regularly, so risk is low — but low is not verified. It will exercise itself the first time a session leaves drift

### Active context

- **Repo version** `v05.35r`; **CHANGELOG at 101/100 — 98 non-exempt**, so rotation is **not** due but fires on the next push landing on a later EST day. The clone is **already unshallowed** (1,096 commits, deepened at v05.33r), so SHA enrichment will resolve
- **S3: 7 of 10.** Remaining: **V2 · `E1b` (Habitat Energy · Gridmatic)**, **V3 · `E5` (Grid United · Pattern Energy)**, **V4 · `E4b+E6b` (Mitra Chem · Cornex)** — all Fable 5.1 High. **V2 is the sole remaining gate**; V3 and V4 are pure deepening. **V4, not P6, completes the SNE H1-2026 storage-cell top twelve** — `cornex` sits 7th at 30.2 GWh
- **Page versions after this session:** Profiler `v01.86w`, Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Still awaiting developer approval (§10.5 item D, offered six sessions running):** adding `aka[]` to the `Profiler.html` roster search haystack (~line 2202, currently `(c.name + ' ' + c.slug)`), narrowed to names-only by explicit directive 2026-08-30. P5 and P6 added **79 aliases across four companies** the roster cannot find
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **S3 V2 · group `E1b` (Habitat Energy · Gridmatic) on Fable 5.1 High** as a fresh session — **but only once the weekly Fable allowance has actually reset.** It is the sole remaining gate on `software-and-optimization`, the one held landscape, and clearing it unblocks S2 on all nineteen segments. Two things shape the research: **both subjects are private optimizers whose value is inference from a thin public record** — the §2 model rule's reason for putting them on Fable — and **§10.3 holds the landscape for the pure-play optimizers plural**, so a half-session on one company may not release it. P3 sharpened why they matter: both of the segment's incumbents reach it from an adjacent business (FlexGen from integration, Stem from solar asset-performance management), so the pure-play merchant optimizers are still entirely on the private side. Check the allowance before starting — §10.5 measures a Phase E session at ~20 points and the format is all-or-nothing.

**To continue:** type `run S3 V2`


Developed by: LightAISolutions
