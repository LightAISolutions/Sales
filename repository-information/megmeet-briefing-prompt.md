# Megmeet SST onboarding briefing — the run plan and the paste-in prompt (v2)

*v1 was written 2026-09-22 as a deferred paste-in prompt (report + text brief, Opus 5 xhigh,
~35–50 minutes). **v2, 2026-09-23,** folds in the developer's widened scope — the solid-state
transformer in its entirety, the 800 V DC value case from every player's perspective, the
limitations and who is working on them, who is testing at which service voltage (34.5 kV
against 12.47/13.8 kV), the adoption obstacles including operation and maintenance, Megmeet
against its competitors on SST **and** in its adjacent business units, tables / charts /
timelines / diagrams throughout, interactive widgets where they teach, and a downloadable PDF
robust enough to study from. It is written to be run **overnight, unattended, in one new
session**, with the developer waking up to the PDF.*

**Start date:** Senior Sales Manager — SST Solutions at Megmeet, **Wednesday 2026-10-07**
(weekday verified with `date -d`). **Sequencing condition met:** the Network / Events build
closed with X on 2026-09-23 (v07.27r), so this is the next thing to run. v1 of this file is in
git history at v07.19r–v07.27r if the narrower prompt is ever wanted again.

**The paste-in prompt is §6. The model and effort recommendation is §4. Read §1–§3 first if you
want to know why the prompt asks for what it asks for.**

---

## 0 · Pre-flight results, as of 2026-09-23 07:15 AM EST

Both v1 pre-flight checks were run while writing this file. Re-run them the night of the run
only if it happens **after 2026-10-01** (the Profiler monthly drift check fires then and may
supersede the report this run builds on).

| Check | Result on 2026-09-23 | What it means for the run |
|---|---|---|
| Dossier freshness — `python3 scripts/profiler-queue.py --quarterly --tier core` | `dueCount: 0` across 85 cadence rows | Nothing is due; no refresh before the run |
| The SST four — `lastUpdated` / `profileVersion` | amperesand v2 · 2026-09-19 (63 sources) · dg-matrix v1 · 2026-09-19 (84) · heron-power v1 · 2026-09-12 (52) · novos-power v1 · 2026-09-19 (38) | All inside the fresh tier (≤45 d); they are the heart of the brief and they are current |
| Megmeet — `megmeet.profile.json` | v7 · 2026-09-08 · 38 sources · carries the H1 2026 interim (2026-08-27) | Fresh; do **not** re-run `profiler Megmeet` inside the briefing session — keep D1 dossiers-only and put web finds in D2 |
| Oracle / NVIDIA dossiers | oracle v5 · 2026-09-21 · 24 sources (Stargate ×27, Abilene ×19, "800 V" ×5, SST ×0) · nvidia v10 · 2026-09-06 · 23 sources (Kyber ×16, SST ×0) | The NVIDIA SST material lives in the Industry Guidance module and the primer, not the NVIDIA dossier; Oracle's dossier has no SST content at all — both are web-research targets (§2 row 8) |
| Newer AIDC power-conversion report? — `reports/reports-index.json` | `aidc-power-conversion--competitive--2026-09-08` is still `current` (supersedes 2026-08-29) | Build on it, as v1 said; re-check only if running after 2026-10-01 |
| Incumbents' dossiers | abb v7 · hitachi-energy v5 · siemens-energy v7 · ge-vernova v6 · eaton v8 · schneider-electric v9 · vertiv v9 · delta-electronics v5 · liteon v6 · sungrow v9 · zhonhen v8 · sinexcel v8 · infineon v1 · vicor v2 — all 2026-09-04 → 09-08 | Fresh |
| Not covered by any dossier | Enphase, SolarEdge (cited by the primer from the web), Megmeet's non-AIDC competitors (Topband, H&T, Inovance and peers) | These are web-only in D2, tagged as such |
| Toolchain in a fresh container | Node v22 ✓ · Chromium under `/opt/pw-browsers` ✓ · **matplotlib ✗** (`pip install matplotlib` first) · Playwright ✗ (`pip install playwright` only — never `playwright install`) | The prompt says so |
| `CHANGELOG.md` counter | `Sections: 98/100` before this file's push (99 after it) | **Archive rotation falls due during the overnight run** — on the push that takes the counter to 100 (changelogs.md: "reaches 100"). Unshallow first; SHA enrichment is mandatory |

---

## 1 · What the repo already holds — build on it, do not rebuild it

The single most important fact for the run: **a 20,000-word SST primer with 14 figures already
exists.** The briefing must extend it and point into it, not re-derive it.

| Asset | What it covers | Vintage | How the run uses it |
|---|---|---|---|
| `repository-information/SOLID-STATE-TRANSFORMERS-PRIMER.pdf` (source `sst-primer-print.html`, figures `sst-primer-figures/`, scripts `build-sst-primer-figures.py` + `build-sst-primer-pdf.mjs`) | 10 chapters: why 800 V DC · inside an SST stage by stage (ISOP, CHB, DAB, MFT, cell count vs service voltage) · SST vs TRU and NVIDIA's Gen 1–4 staging · technical limitations (overload, faults, insulation, reliability, cost/standards) · US infrastructure limits (grid queue, transformer lead times, the **voltage ladder with 34.5 kV**, NERC ride-through, codes, sites, economics) · the players layer by layer · positioning matrix and a dated watch-list · glossary · sources | v05.36r → v05.38r, 2026-09-12 (before the Novos Power, Amperesand v2 and DG Matrix dossiers landed 2026-09-19) | **The technical spine.** The brief summarizes each primer chapter in a page and cites the primer's figure numbers; new figures only where the primer has none. Its watch-list (§8.2) is the first thing to update: what has moved since 12 September |
| `live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-08.report.json` — *AIDC Power Conversion — The 800 VDC Race* | 15 vendors across four layers; the "TRU now, SST later" frame; key judgments that retire "the SST roster is still forming" (Sungrow's filing-level supply claim), that the Megmeet-displaced-LITEON story is unsourced, that no company discloses an audited AIDC power-conversion revenue line | 2026-09-08, `current` | D1 builds on it and says where it supersedes or contradicts it; the "no NVIDIA share table exists" finding is carried into D2 verbatim |
| `repository-information/industry-guidance/nvidia-800vdc-analysis.md` | NVIDIA's August 2026 execution paper: Gen 1 → 4 rack roadmap; Options A / B / C and the MV direct-conversion next-gen; TRU vs SST and the Panama name-check; AC vs DC fault behaviour; grounding schemes; protection zones; SSCBs; certification; a page-referenced claims ledger and a "what the paper does not say" guardrail list | Aug 2026 | The NVIDIA half of §2 row 8; the claims ledger is the citation source for every NVIDIA date and option |
| `megmeet.profile.json` v7 + `megmeet.study.json` (2026-08-07, 15 flashcards) + `study-prep/megmeet/megmeet-interview-brief.md` (2026-08-14, written from dossier **v2**) + `megmeet-lesson-plan.md` | The six business units with FY2025 revenue shares; the full grid-to-GPU chain incl. the SST spec (">98.5 %, grid HV input → 800 V DC" — **no service-voltage class disclosed**); the Dallas lab; the strategy read; the objection set; the FCC inverter-rule analysis; a vocabulary and a twelve-question self-test | Dossier fresh; the study guide and the interview brief are **five dossier versions stale** | The brief opens with what the older prep documents now get wrong; the interview brief's objection and say/don't-say format is the precedent for Part V |
| The SST four + the China-HQ SST vendors: `amperesand`, `dg-matrix`, `heron-power`, `novos-power`, `sungrow`, `zhonhen`, `sinexcel` | 34.5 kV material already in the dossiers: Heron ×12 mentions, DG Matrix ×17, Amperesand ×10, Novos ×2; Sungrow at 10 / 13.8 / 35 / 69 kV; ABB at 34.5 kV ×8; **Megmeet: no voltage class anywhere** | 2026-09-07 → 09-19 | The pilot-and-test ledger (§2 row 5) starts from these; the web fills the buyer, utility and date columns |
| `scripts/build-study-prep-pdf.mjs` | Markdown → PDF in the `bloomberg` skin, with a `DOCS` registry (the two Megmeet prep PDFs were built with it) | — | **Not used for D2** — it has no image support; a figure-heavy brief is authored as print HTML like the primer |
| Classroom lessons (`ac-versus-dc-faults`, `dc-fault-engineering`, `four-deployment-options`, `forty-eight-volts`, `a-fault-walks-the-chain`, `block-architecture` …) | Teaching versions of the same mechanisms | — | Reference only. **The briefing stays out of Classroom** — its content is personal job context (not public-safe) and the C2 gate surface (provenance stamps, pins, the content fence, three checkers) is the wrong cost for a one-off study document |

---

## 2 · The delta — what the run has to add, ask by ask

Each row is one of the developer's 2026-09-23 asks, where the corpus already answers it, what is
missing, and where the missing part comes from. **Corpus** = dossiers, the primer, the report,
the guidance modules (cited as `[DOSSIER <slug> v<n>]` / `[PRIMER ch.x]` / `[REPORT 2026-09-08]`
/ `[GUIDANCE nvidia-800vdc]`). **Web** = new research in the session, cited `[WEB, verified
<date>]`. Never blended in one sentence.

| # | The ask | Already covered | What is missing | Source |
|---|---|---|---|---|
| 1 | SST technical terminology, in its entirety | Primer ch.3 (stage-by-stage) and ch.9 glossary (~40 terms) | A **term system**, not a list: families (topology · devices · magnetics · control · protection · grid interface · standards), each term with the one-line definition, the number to remember, and the sentence a buyer's engineer would say it in. Memorization tables and a flashcard deck | Corpus first; web only for terms the primer lacks (e.g. MMC, LLC vs CLLC vs DAB trade-offs, PD inception, cosmic-ray derating, SSCB, SiC vs Si-IGBT vs GaN at MV) |
| 2 | Comparison with previous and adjacent technology | Primer ch.2 (the AC hall), ch.4 (SST vs transformer-rectifier unit), fig. 3 (the three chains), fig. 8 (chain losses) | A **lineage and adjacency matrix**: line-frequency transformer · LFT + rectifier (TRU, incl. Zhonhen's Panama) · MV UPS (ABB's solid-state MV UPS is not an SST) · hybrid LFT + solid-state breaker · MVDC collection · the SST proper (ISOP CHB + DAB) · what SSTs borrow from MV drives, STATCOMs and traction (the real lineage of most vendors). Rows: efficiency · footprint · overload/inrush · fault behaviour · isolation · controllability · cost · maturity · standards path · who sells it | Corpus + web |
| 3 | Value in 800 V DC infrastructure **from different players' perspectives** | Primer ch.2 gives NVIDIA's copper and staging argument; ch.7 gives the vendors' positions; the report gives the layer contest | A **perspective matrix**, one column per player type — NVIDIA · Oracle / OCI · the other hyperscalers · neoclouds · colo developers and landlords · utilities · EPCs · incumbent hall vendors (Vertiv, Eaton, Schneider, ABB) · silicon (Infineon, Vicor) · Megmeet — each with: what 800 V DC buys them, what an SST adds on top of a TRU, what they lose, what they would need to see before specifying one. Sourced where a player has said it; labelled analysis where inferred | Corpus (dossiers' strategy reads, the NVIDIA module, the report) + web for player statements the dossiers lack |
| 4 | Limitations and what relevant players are doing about them | Primer ch.5 (overload, faults, insulation/PD, reliability, cost/standards) | A **limitation → mitigation → who → status** table, one row per limitation, with the vendor or body working it (e.g. DC arc-flash → NFPA FPRF; ride-through → NERC CLO standards; PD at 34.5 kV → device/insulation vendors; overload → BBU/supercap on the DC bus; cell failure → redundancy/bypass) and a status word from a fixed set: *unsolved · lab · pilot · product · standardised* | Corpus + web |
| 5 | Which players are testing SSTs, **preferably at 34.5 kV rather than 12.47 kV** | Primer ch.6.1 (the US voltage ladder and why the service class sets the product), ch.7, §8.2 watch-list; the dossiers' kV mentions (§1) | The **pilot-and-test ledger**: vendor × unit (MW, kV class, output) × buyer × host utility / feeder × site × date × evidence tier (*announced · lab demo · factory test · field pilot · supplying · undisclosed*) × source. Then the explicit argument for **why 34.5 kV is the class that matters** for gigawatt campuses (Texas, Southeast, Mid-Atlantic), what it costs in cells and BIL over 13.8 kV (primer fig. 5 and 11), and which vendors have shown a 34.5 kV-class unit at all. Where a vendor has not disclosed a class, the cell reads *undisclosed* — including Megmeet's own SST | Dossiers first (Heron, DG Matrix, Amperesand, Novos, Sungrow, ABB); web for buyer/utility programmes (EPRI, DOE, utility pilots, hyperscaler test sites, Sungrow's supply claims, GE Vernova's hyperscaler milestone, SolarEdge/Infineon, Enphase, Siemens, Hitachi, Mitsubishi, Delta, Vertiv, Eaton, Schneider, Huawei, TBEA) |
| 6 | Obstacles blocking adoption — technical, infrastructure, **operation & maintenance**, other | Primer ch.5 (technical) and ch.6 (grid, supply chain, ride-through, codes, sites, economics/workforce). **O&M is the thin spot — one mention of "maintenance", none of spares, MTBF or technicians** | An **O&M and operability chapter**: field-serviceability of a multi-cell converter (hot-swap cells, bypass, spares strategy, mean time to repair vs an oil transformer's 40-year life), failure modes and monitoring, firmware and cyber (a transformer that takes updates), warranty and insurance/bankability, listing and standards (UL/IEC for MV power conversion, NEC/NFPA 70E DC arc-flash, IEEE 519 harmonics), utility acceptance of a power-electronic load at the service point, technician skills, plus procurement and policy (Buy American / FEOC / tariffs / the FCC action). Each obstacle with "who is doing what about it" | Web-heavy; corpus for policy (the §154 / FCC / EU-2027 material in the dossiers and the China policy module) |
| 7 | Megmeet's competitors and how we compare — **on SST, and in the adjacent business units** | The interview brief (dossier v2) and dossier v7: the six segments with revenue shares and the named rivals (Delta ~41 %, LITEON, AcBel, Chicony, Advanced Energy in server power; Topband, H&T in appliance controls); the report's layer scoring | (a) An **SST competitor matrix** — Megmeet vs each of: Sungrow, Delta, Heron, DG Matrix, Amperesand, Novos, Zhonhen, Sinexcel, Huawei, ABB, Hitachi Energy, GE Vernova, Eaton, Schneider, Vertiv, Siemens, SolarEdge/Infineon, Enphase — on topology, kV class, MW, output, efficiency claim, availability date, disclosed order/pilot, US sellability, HQ. (b) An **adjacent-BU position table** — one row per Megmeet segment (server PSU / power shelves · sidecar & BBU · appliance controls · NEV & rail · industrial automation · intelligent equipment · precision connection) with the top competitors and Megmeet's relative position, evidence-tagged. Most non-AIDC rivals have no dossier | Corpus for AIDC rivals; web for Topband, H&T, Inovance, Zhongshan Broad-Ocean, CRRC Times, Delta/Siemens automation, Jasic/Lincoln/ESAB welding, Great Wall/AcBel/Chicony/Advanced Energy PSUs and the like |
| 8 | NVIDIA and Oracle engineering engagement — "what should I know before talking to their engineers" | The NVIDIA module (Gen 1–4, Options A/B/C, the fault/grounding/protection/cert material); the Oracle dossier (Stargate / Abilene, no power-architecture content) | For each: **what their programme specifies today, on what clock, and what their engineers will ask an SST vendor** — reference designs, test and qualification paths, the certification list, the interface points (grounding scheme, fault current, ride-through, telemetry), and the questions to have answers ready for. **The developer's report that Megmeet is "in active communication with NVIDIA and Oracle engineering teams" is unverified hearsay: it may steer emphasis, it is never stated as fact, and nothing is sourced to it** (the same rule the Profiler Report Command applies to field notes) | The NVIDIA module + web (NVIDIA 800 V DC ecosystem pages and the execution paper's public text); Oracle / OCI power-architecture statements, Stargate site power designs, OCI's published vendor and test engagements — web |
| 9 | Tables, graphs, timelines, charts, diagrams, pictures — and interactive widgets — so the material can be memorised | The primer's 14 figures and its build pipeline (matplotlib SVG + inline SVG diagrams → Chromium PDF with running header/footer and page numbers) | ~12 new figures (§3), every table designed to be read in ten seconds, a printed flashcard deck and cheat sheet, and a **study companion** — one self-contained HTML file with the widgets, fed from the same data file as the figures so they cannot drift | The primer's scripts as the template; the `dataviz` skill before the first chart |
| 10 | "Anything else you can think of" | — | The five things that moved since the primer's 12 September watch-list · a dated calendar to day one and the first 90 days · the policy and supply-chain page from v1 · the sales layer from v1 (objections, what not to say, week-one questions, gaps) · a colophon recording the pre-flight, the assumptions the unattended run made, the model and the build | Corpus + web |

---

## 3 · Deliverables and where they live

Everything personal stays under `repository-information/` (never deployed). Only D1 is public
Pages data, and D1 carries no personal context by construction (dossiers-only).

| | Deliverable | Path | Notes |
|---|---|---|---|
| **D1** | The Profiler competitive report on the SST / medium-voltage hall-edge contest — Megmeet's competitive position | `live-site-pages/profiler-data/reports/sst-hall-edge-block--competitive--<YYYY-MM-DD>.report.json` + its `reports-index.json` entry | Exactly per the Profiler Report Command (`.claude/rules/profiler-app.md`): dossiers-only, citations copied verbatim from dossier `sources[]`, `coverage` block with per-company pins and `gaps[]`, active style, `supersedes` only if it truly supersedes (it does **not** supersede the 2026-09-08 report — different scope; it *builds on* it), `python3 scripts/check-profiler-reports.py` clean. Scope: `megmeet amperesand dg-matrix heron-power novos-power sungrow delta-electronics liteon zhonhen sinexcel hitachi-energy abb siemens-energy ge-vernova eaton schneider-electric vertiv infineon` — adjust with a stated rationale. Data-only: no Profiler page bump; Profiler is an indirect affect |
| **D2** | The onboarding briefing — the PDF | Source `repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html` → output `repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`; figures in `repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/` (basenames prefixed `mmsst-fig-` — [PC-UNIQUE-FILES] #17 forbids a second `fig-timeline.svg`); primer figures reused **by relative reference**, not copied | Authored as print HTML on the primer's skin (copy `sst-primer-print.html`'s CSS, running header/footer and figure/table conventions). Built by `scripts/build-megmeet-sst-briefing-pdf.mjs` (a copy of `build-sst-primer-pdf.mjs` with the paths changed and its own DevTools port) with `--png` proof pages that the session **looks at** before calling the PDF done |
| **D3** | The study companion — the widgets | `repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html` (one file, no CDN, works offline) reading `repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json` (inlined at build time so the file opens from disk) | Widgets, in priority order — ship at least five: (1) **conversion-chain explorer** — AC hall / TRU hall / SST hall side by side, click a stage for what it does, its loss, and what the SST removes; (2) **service-voltage and cell-count calculator** — 12.47 / 13.8 / 24.9 / 34.5 kV × SiC device class → cells per phase, BIL class, the primer's derating assumptions shown, with the "why 34.5 kV" note; (3) **loss-chain comparator** — the published chains with their boundaries, so two vendors' percentages are never compared without them; (4) **competitor map** — filter by layer / HQ region / SST status / kV class / disclosed order, with a Megmeet-vs-X compare card; (5) **timeline** — NVIDIA Gen 1–4 and Options A/B/C against vendor availability and pilot dates, with a slider; (6) **flashcards** — the term system and the numbers to know, spaced repetition in `localStorage` (wrapped in try/catch), plus a self-test; (7) **objection drill** — buyer objection → reveal the strongest honest answer. Tested with Playwright (`pip install playwright`; Chromium is preinstalled — never `playwright install`): loads from `file://`, zero console errors, every widget responds to input, screenshots kept in the scratchpad. If the Artifact tool is available, also publish the companion as a **private** artifact and put the link in the final message — the repo file stays the source of truth |
| **Data** | The single source for every plotted or displayed number | `repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json` | Written **before** the figure script and the companion: every number carries its `source` tag (`DOSSIER <slug> v<n>` / `PRIMER fig.<n>` / `REPORT 2026-09-08` / `WEB <url> verified <date>` / `ANALYSIS`). `scripts/build-megmeet-sst-briefing-figures.py` (a copy of `build-sst-primer-figures.py` — same validated palette, do not re-tint) reads it; the companion inlines it. A check at the end asserts the figure data and the companion data are byte-identical |
| **Bookkeeping** | README tree entries for every new file (`python3 scripts/check-readme-tree.py`); `Developed by: LightAISolutions` last line on every new file; CHANGELOG entries; **archive rotation on the push that reaches 100**; `SESSION-CONTEXT.md` via "remember session" at the end so the morning session inherits the state; the PDF and the companion sent as files in the final message where the harness offers a file-send tool | The existing `megmeet-interview-brief.md`, `megmeet-lesson-plan.md` and `megmeet.study.json` are **not edited** — they are dated documents; the brief states what in them the v7 dossier now contradicts |

**The brief's table of contents** (the session may re-order, not drop):

- **Part I — Read this first.** The one-page cheat sheet · the twelve numbers to know · the five things that moved since the primer's 12 September watch-list · the calendar to 2026-10-07 and the first 90 days
- **Part II — The technology in its entirety** (each chapter summarises the primer's chapter in a page, cites its figure numbers, then adds what §2 says is missing). 1 The term system · 2 Lineage and adjacent technologies (the matrix) · 3 Where an SST sits in NVIDIA's 800 V DC (Gen 1–4, Options A/B/C, what it replaces) · 4 The value case by perspective (the matrix) · 5 Limitations → mitigation → who → status
- **Part III — The market.** 6 The pilot-and-test ledger and the 34.5 kV argument · 7 Obstacles to adoption (technical · infrastructure · O&M · standards and listing · utility acceptance · procurement and policy), each with who is doing what · 8 NVIDIA and Oracle: what their programmes specify and what their engineers will ask (hearsay boxed and labelled)
- **Part IV — Megmeet and the competition.** 9 Megmeet's SST and 800 V DC chain — disclosed vs undisclosed (the kV class is undisclosed; say so) · 10 The SST competitor matrix, Megmeet against each · 11 The six business units and the relative position in each · 12 Policy and supply chain (FCC inverter action, §154, tariffs, the EU 2027 phase-out, FEOC)
- **Part V — The sales layer (all labelled analysis).** 13 The objections a US data-centre buyer raises about a China-headquartered SST vendor and the strongest honest answer to each · 14 What not to say in the first month · 15 The ten week-one questions, ranked by how much the answer changes the picture · 16 Everything the run could not determine — the gaps, named
- **Appendix.** Glossary (the term system, alphabetical) · the printed flashcard deck · sources by tier · colophon (pre-flight, assumptions, model, build, page count)

**New figures, minimum set** (each with a caption that names the source and the boundary or
denominator): lineage/adjacency matrix as a heat table · perspective matrix · limitation-status
board · the pilot ledger as a timeline-by-kV-class chart · the US service-voltage map by region
with the campuses that matter · the obstacle stack (technical / infrastructure / O&M / policy)
· NVIDIA + Oracle programme timelines side by side · Megmeet's revenue-mix and growth-by-segment
bars · the SST competitor positioning map (kV class × availability × HQ) · the adjacent-BU
position ladder · a "what changed since 12 September" delta chart · the first-90-days calendar.

---

## 4 · Model and effort — the recommendation

**Run it on Claude Opus 5 (`claude-opus-5`) at effort `xhigh`, in one new session, with the
research subagents left on the same model.** Reasoning, in the order it matters:

1. **The work is reading depth on a corpus the repo already holds, plus production.** The
   technical spine is a 20,000-word primer; the market layer is 25 dossiers of 14–136 sources
   each, one report and one guidance module; the rest is HTML, matplotlib, a DevTools PDF build
   and a widget file. The repo's own head-to-head (Xcel Energy, 2026-09-04, recorded in
   `PROFILER-COVERAGE-PLAN.md` §2) found Opus 5 xhigh **materially deeper on long first-party
   documents** than Fable 5.1 High, inconclusive on judgments, and Fable narrowly better only
   on relationship and sourcing discipline. The rule the repo drew from it — *effort buys depth
   of reading, not care* — points at Opus for this shape of task.
2. **The discipline gap is closed by the prompt, not the model.** The two-tier citation rule
   (`[DOSSIER]` / `[WEB, verified]`, never blended), the *undisclosed* cell rule, the hearsay
   rule, and the Phase F rubric (§5) are the mechanisms that stop an estimate being laundered
   into a fact. They are model-independent and they are what the run is checked against.
3. **Price and the weekly limit.** Opus 5 is $5 / $25 per million input / output tokens
   against Fable 5.1's $10 / $50 (the `claude-api` skill's pricing table, cached 2026-06-24) —
   half the rate — and it does not draw the 50 % weekly Fable sub-allocation that the
   interactive authoring sessions live on. An unattended overnight run is the worst place to
   spend the Fable half: nobody is there to steer it, so the marginal judgment quality buys
   nothing that the rubric does not already enforce.
4. **`xhigh`, not `high` and not `max`.** This is a long-horizon agentic run with the full
   spec given up front, which is exactly the case Anthropic's effort guidance names for
   `high`/`xhigh`; `xhigh` is the Claude Code default and the level every Opus 5 dossier batch
   in this repo was authored at, so the evidence base applies. `max` is for correctness over
   cost on hard problems with no external check — here the checkers, the proof PNGs and the
   rubric carry correctness. Going down to `high` would save perhaps a fifth of the cost and
   give back reading depth on the filings and utility documents the pilot ledger needs.
5. **Overnight means latency is free.** Fast mode (2× the price for speed) is pointless; a
   single long session is fine; the container stays alive while the turn is running.

**Alternatives considered and set aside**

| Option | Why not, for this run |
|---|---|
| Fable 5.1 xhigh / High | Narrow, unproven edge on judgment prose; 2× the price; draws the Fable sub-allocation; the judgment-heavy sections (Part V) are labelled analysis and are the smallest part of the document |
| Sonnet 5 ($2 / $10) | Cheapest by far, but the repo has no evidence of it on dossier-grade synthesis, and the one deliverable with an external deadline is the wrong place to run the first test. A defensible cost lever if the developer wants it: run the **Phase B web-research subagents** on Sonnet 5 (`model: sonnet` on the Agent call) and keep the main thread on Opus — roughly a third off the bill for shallower reading of the sources those subagents find |
| Opus 5.5 | "Launching — use only when the user names it" in the skill's model table; default effort `medium` unless set; no evidence in this repo. Not for an unattended deadline run |
| Effort `max` | Correctness here is carried by external checks; `max` buys thinking the run cannot use |
| Two sessions (research, then production) | Loses the corpus context between them for no benefit; the phase pushes in §5 already checkpoint the work durably |

**Cost and time estimate (judgment, not measurement — the repo has never metered a session).**
v1 budgeted 35–50 minutes and ~$25–40 of plan allowance at API-equivalent rates for roughly a
quarter of this scope with no figures, PDF or widgets. v2 is a **~3–5 hour unattended run**
(three push cycles each waiting a few minutes for the auto-merge workflow) and roughly
**four to six times v1's spend — call it $120–250 API-equivalent**, the bulk of it cached
context re-reads across several hundred tool calls rather than output. On the plan that is a
large slice of a week's Opus allowance and none of the Fable one; check the usage meter before
starting and do not run it the same night as another heavy Opus job.

---

## 5 · The run — plan, execute, check

The run is phased so that (a) the main thread reads the corpus once and delegates the web,
(b) work is pushed at three durable checkpoints — a container that dies at 3 AM loses at most
one phase, and (c) the last phase is a check pass with a rubric, not a victory lap. Every
push follows the normal Pre-Commit and Pre-Push checklists; pushing more than once per session
is the allowed exception when the prior push has already merged (`git ls-remote` shows the
branch gone). **No AskUserQuestion, no plan mode** — the run is unattended; ambiguities are
resolved with a stated assumption and recorded in the colophon.

| Phase | Wall clock | What happens | Output / checkpoint |
|---|---|---|---|
| **0 · Pre-flight** | ~10 min | Session Start Checklist; `git fetch --unshallow origin main`; read this file end to end; re-run the §0 checks only if the date is past 2026-10-01; `pip install matplotlib playwright`; confirm Chromium under `/opt/pw-browsers`; read the live `CHANGELOG.md` counter and note which push will reach 100; write the chapter outline, figure list and widget list to the scratchpad as the working plan | Nothing committed |
| **A · Corpus read** (main thread) | ~30–40 min | The primer in full (source HTML — it is the text the PDF was made from); the 2026-09-08 report's judgments, gaps and indicators; the NVIDIA module's claims ledger and guardrail list; Megmeet v7 + study guide + interview brief + lesson plan; the SST-relevant sections of the SST four, Sungrow, Zhonhen, Sinexcel, ABB, GE Vernova, Delta, Vertiv, Eaton, Schneider, Hitachi, Siemens, Infineon, Vicor, Huawei; Oracle v5 and NVIDIA v10. Build two scratchpad files: the *known* ledger (fact · source tag) and the *gaps to research* list, one line per §2 row | The two ledgers |
| **B · Web research** (parallel subagents, bounded) | ~40–60 min | Five subagents, each with its question list, the citation rule, a hard cap on pages, and a required return shape (finding · URL · verified date · confidence · which §2 row it serves): **B1** pilots and tests by kV class (vendor, buyer, host utility, site, MW, date, evidence tier), incl. utility and EPRI/DOE programmes and hyperscaler test sites; **B2** O&M, standards, listing, utility acceptance, insurance/bankability, procurement and policy obstacles, with who is working each; **B3** NVIDIA's and Oracle/OCI's power programmes as their engineers would present them — specs, test/qualification paths, certification, timelines, published vendor engagements; **B4** Megmeet's adjacent-BU competitors and relative position, segment by segment; **B5** everything public on Megmeet's own SST and 800 V DC chain (product pages, exhibitions, the Dallas lab, patents, tenders, Chinese-language sources, the H1 2026 interim's wording) — with the kV class as the first question. Findings that contradict a dossier are flagged, not silently preferred | The research ledger, merged into the *known* ledger with tags |
| **C · D1, the report** | ~30 min | Author per the Profiler Report Command from dossiers only; register in the index; `python3 scripts/check-profiler-reports.py` clean | **Push 1** — the report and its index entry (a CHANGELOG entry; this may be the push that reaches 100 — rotate if so) |
| **D · D2, the brief** | ~60–90 min | Write `megmeet-sst-briefing-data.json` first (every number, tagged). Copy and adapt the primer's figure script → the new SVGs (load the `dataviz` skill first; keep the validated palette). Copy the primer's print HTML skin; write the brief **chapter by chapter with the Incremental Writing gate** (skeleton ≤50 lines, then Edits of ≤200 lines each — the primer source is 650 lines and ~20,000 words; this document will be of the same order). Copy and adapt the PDF script; build; render the `--png` proof pages and **look at them**: figure legibility, table overflow, orphaned headings, the running header, page numbers. Fix and rebuild until clean | **Push 2** — source, figures, scripts, PDF, README tree entries |
| **E · D3, the companion** | ~40–60 min | Build the companion from the same data file (inlined); Playwright: open from `file://`, assert zero console errors, drive each widget once, screenshot each; fix; assert the inlined data equals the data file | Local commit (folds into push 3) |
| **F · Check pass** | ~30–40 min | A **fresh subagent audits the PDF text** against the rubric below and returns a findings list; the main thread fixes every finding, rebuilds the PDF, re-runs the checkers; then README tree, CHANGELOG, `remember session`, the final message with the file cards and the ten things to read first | **Push 3** — the companion, the fixes, the session context |

**The Phase F rubric — every line answered with evidence, in the colophon:**

1. Every factual sentence carries exactly one tier tag (`[DOSSIER <slug> v<n>]`, `[PRIMER
   ch.x / fig.n]`, `[REPORT 2026-09-08]`, `[GUIDANCE nvidia-800vdc]`, `[WEB, verified
   YYYY-MM-DD]`) or is inside a block labelled **analysis**. Report the counts per tier and the
   count of untagged factual sentences (must be zero).
2. No sentence blends a dossier claim with a web claim. No estimate is stated as a fact — every
   trade or brokerage figure names its source and the source's incentive (the report's rule).
3. Every table with a status column uses the fixed vocabularies from §2 rows 4 and 5, and
   every cell a vendor has not disclosed reads *undisclosed* — Megmeet's SST service-voltage
   class included, unless Phase B5 found it (then cite it).
4. The 34.5 kV question is answered per vendor in one table, and the "why 34.5 kV" argument
   is made in numbers (cells per phase, BIL class, which US campuses are served at that class).
5. The NVIDIA and Oracle chapter states only what the record supports; the developer's
   hearsay appears once, boxed, labelled unverified, and nothing cites it.
6. Every figure has a caption naming its source and its boundary or denominator; every
   number in a figure is in the data file with a source tag; figure data and companion data
   are byte-identical.
7. Part V is labelled analysis throughout; the ten week-one questions are ranked with the
   ranking criterion stated; the gaps list names everything the run could not determine.
8. The five older prep documents' contradictions with dossier v7 are listed (the study guide
   of 2026-08-07, the interview brief of 2026-08-14, the lesson plan, the v1 prompt's
   assumptions, the primer's 12 September watch-list) — nothing is silently corrected.
9. The PDF opens, the table of contents resolves, no figure is cut, no table overflows the
   margin, the running header and page numbers are present; page count recorded.
10. The companion opens from disk with zero console errors and at least five widgets respond;
    screenshots kept; the artifact link (if published) is in the final message.
11. `check-profiler-reports.py`, `check-readme-tree.py` and (if a study file was touched,
    which it should not be) `check-profiler-study.py` are clean; every new file ends with
    the branding line; every new basename is unique repo-wide.
12. The colophon records: the pre-flight results, every assumption made in the developer's
    absence, the model and effort, the build commands, the page count, the run's wall-clock.

**Failure handling, decided in advance.** *Stuck branch* (ls-remote non-empty after the
retries): do not re-push; keep committing locally, retry at the next checkpoint, and if it is
still stuck at the end, say so in the final message with the branch name — the developer
re-pushes in the morning. *Chromium or the PDF build fails:* fix the script, never hand-write
the PDF, never skip the proof PNGs. *matplotlib missing:* `pip install matplotlib`. *A web
host blocks the subagent:* record the outlet and move on; never fabricate the finding. *Context
pressure in the main thread:* the phase ledgers in the scratchpad are the working memory —
re-read them rather than the corpus. *The container dies:* the resume prompt in §7 picks up
from the last push.

---

## 6 · The paste-in prompt

**New session · Claude Opus 5 · effort `xhigh`** (set both in the session's model picker before
pasting). Paste everything inside the block, unchanged.

```text
Run the Megmeet SST onboarding briefing — the v2 plan in
repository-information/megmeet-briefing-prompt.md. Read that file end to end first:
§2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the
checkpoint pushes and the Phase F rubric you will be checked against. This is an
unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity
with a stated assumption and record it in the colophon.

CONTEXT: I start at Megmeet as "Senior Sales Manager — SST Solutions" on Wednesday
2026-10-07. I have heard, unverified, that Megmeet is in active communication with
NVIDIA's and Oracle's engineering teams — treat that as hearsay that may steer
emphasis and is never stated as fact or cited. I want to wake up to one downloadable
PDF I can study from, plus a study companion with interactive widgets, that together
make me credible on solid-state transformers in their entirety and on where Megmeet
stands against everyone else.

READ FIRST (Phase A — the corpus; do not rebuild what already exists):
- repository-information/sst-primer-print.html — the 20,000-word SST primer (PDF:
  SOLID-STATE-TRANSFORMERS-PRIMER.pdf, 2026-09-12). It is the technical spine:
  summarise each chapter in a page, cite its figure numbers, add only what §2 says
  is missing.
- live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-08.report.json
  — build on it and say explicitly where you supersede or contradict it.
- repository-information/industry-guidance/nvidia-800vdc-analysis.md — the claims
  ledger and the guardrail list for every NVIDIA date and option.
- megmeet.profile.json v7, megmeet.study.json (2026-08-07), and
  repository-information/study-prep/megmeet/megmeet-interview-brief.md (2026-08-14,
  written from dossier v2) and megmeet-lesson-plan.md — list what in the older
  documents the v7 dossier now contradicts; do not edit them.
- The dossiers: amperesand, dg-matrix, heron-power, novos-power, sungrow, zhonhen,
  sinexcel, delta-electronics, liteon, abb, hitachi-energy, siemens-energy,
  ge-vernova, eaton, schneider-electric, vertiv, infineon, vicor,
  huawei-digital-power, oracle, nvidia.

SCOPE (§2 of the plan, ask by ask): 1 the SST term system in its entirety, with
memorisation tables and a flashcard deck; 2 the lineage and adjacency matrix — LFT,
TRU including Panama, MV UPS, hybrid LFT + SSCB, MVDC, the SST proper, and what SSTs
borrow from MV drives, STATCOMs and traction; 3 the 800 V DC value case as a
perspective matrix — NVIDIA, Oracle/OCI, the other hyperscalers, neoclouds, colo
developers, utilities, EPCs, incumbent hall vendors, silicon, Megmeet — sourced where
said, labelled analysis where inferred; 4 limitation → mitigation → who → status;
5 the pilot-and-test ledger with the service-voltage class per unit and the explicit
34.5 kV vs 12.47/13.8 kV argument made in numbers — "undisclosed" wherever a vendor
has not said, Megmeet's own SST included; 6 the obstacles to adoption — technical,
infrastructure, operation and maintenance, standards and listing, utility
acceptance, procurement and policy — each with who is doing what about it;
7 Megmeet against each SST competitor, and Megmeet's relative position in each of
its six business units; 8 what NVIDIA's and Oracle's engineering programmes specify,
on what clock, and what their engineers will ask an SST vendor; 9 figures, tables,
timelines and widgets throughout so I can memorise it; 10 the five things that moved
since the primer's 12 September watch-list, the calendar to day one and the first
90 days, the policy and supply-chain page, and the sales layer.

DELIVERABLES (§3):
D1 — profiler report competitive: solid-state transformers and the medium-voltage
hall-edge block — Megmeet's competitive position. Exactly per the Profiler Report
Command in .claude/rules/profiler-app.md: dossiers-only, citations copied verbatim
from dossier sources[], coverage block with per-company pins and gaps[], active
style, index entry, python3 scripts/check-profiler-reports.py clean. Scope the
eighteen slugs in §3 or state why not. It builds on the 2026-09-08 report; it does
not supersede it.
D2 — repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf, rendered
from megmeet-sst-briefing-print.html on the primer's skin by a copy of
scripts/build-sst-primer-pdf.mjs; figures rendered from
megmeet-sst-briefing-data.json by a copy of scripts/build-sst-primer-figures.py
(same validated palette; load the dataviz skill first; figure basenames prefixed
mmsst-fig-); the primer's own figures reused by relative reference, never copied.
Table of contents as §3 lists it — Parts I to V and the appendix — and at least the
twelve figures §3 names. Look at the --png proof pages before calling the PDF done.
D3 — megmeet-sst-briefing-companion.html, one self-contained file with the data
inlined, at least five of the seven widgets in §3, Playwright-tested from file://
with zero console errors; publish it as a private artifact too if the Artifact tool
is available, and put the link in the final message.

HARD RULES: every factual sentence carries exactly one tier tag —
[DOSSIER <slug> v<n>], [PRIMER ch.x / fig.n], [REPORT 2026-09-08],
[GUIDANCE nvidia-800vdc] or [WEB, verified YYYY-MM-DD] — or sits inside a block
labelled analysis. Never blend tiers in one sentence. Never launder an estimate into
a fact: name the source and its incentive. Status columns use the fixed vocabularies
in §2 rows 4 and 5. Every figure caption names its source and its boundary or
denominator. Every number in a figure or a widget lives in the data file with its
tag, and the figure data and the companion data must be byte-identical. Nothing is
cited to my hearsay. Part V is analysis throughout. End with the ten week-one
questions ranked and everything you could not determine named, not smoothed over.

PHASES AND PUSHES (§5): 0 pre-flight — Session Start Checklist, git fetch
--unshallow origin main, pip install matplotlib playwright (never playwright
install; Chromium is preinstalled), read the live CHANGELOG counter: archive
rotation is due on the push that reaches 100, SHA-enriched → A corpus read into two
scratchpad ledgers → B five bounded web subagents (B1 pilots and tests by kV class;
B2 obstacles, O&M, standards, utility acceptance, procurement and policy; B3 NVIDIA
and Oracle/OCI programmes; B4 Megmeet's adjacent-BU competitors; B5 everything
public on Megmeet's own SST, kV class first) → C author D1, push 1 → D write the
data file, then the figures, then the brief chapter by chapter, then the PDF, push 2
→ E build and test D3 → F a fresh subagent audits the PDF against the twelve-line
rubric in §5 and you fix everything it finds, then README tree entries for every new
file (check-readme-tree.py clean), CHANGELOG, remember session, push 3. Normal
Session Start, Pre-Commit and Pre-Push checklists on the claude/* branch; check
git ls-remote before every push and never re-push into a stuck branch — keep
committing locally and say so at the end. Incremental Writing gate on every file:
a skeleton, then Edits of at most 200 lines. Developed by: LightAISolutions as the
last line of every new file; every new basename unique repo-wide; the existing
Megmeet prep files and the study guide are not edited.

FINAL MESSAGE: where the PDF and the companion are (GitHub blob links and file
cards), the page count, the ten things to read first, every assumption you made in
my absence, and anything still stuck.
```

---

## 7 · The resume prompt — only if the overnight session died

```text
Resume the Megmeet SST onboarding briefing from
repository-information/megmeet-briefing-prompt.md (v2). A prior session died
mid-run. Read §3 and §5, then git log origin/main --oneline -15 to find the last
checkpoint push (push 1 = the D1 report; push 2 = the D2 PDF and its data file),
read repository-information/SESSION-CONTEXT.md if it was written, rebuild the
scratchpad ledgers from the committed data file and report rather than re-reading
the whole corpus, and continue from the first phase whose output is not on
origin/main. Same hard rules, same rubric, same pushes, same final message.
```

---

## 8 · The developer's night-of checklist

1. **A new session, Claude Opus 5, effort `xhigh`.** Not Fable — see §4.
2. **Check the usage meter.** The run is a large slice of a week's Opus allowance (§4); do not
   start it the same night as another heavy Opus job.
3. **If the date is past 2026-10-01**, the Profiler monthly drift check has fired: glance at
   `reports/reports-index.json` for a `current` AIDC power-conversion edition newer than
   2026-09-08 and, if there is one, tell the session to build on that one instead. Nothing else
   in §0 needs re-running before 2026-10-07.
4. **Paste §6 and walk away.** Expect three to five hours and three pushes; the auto-merge
   workflow lands each one on `main`.
5. **In the morning:** open `repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`
   from GitHub (or the file card in the session); download
   `megmeet-sst-briefing-companion.html` and open it in a browser; read the **colophon first**
   — it lists every assumption the run made without you, and anything that is still stuck.
6. **The reminder in `REMINDERS.md` is yours to update** — this file was rewritten without
   touching it, and its v1 budget line ("~35–50 minutes and ~$25–40") is superseded by §4.

Developed by: LightAISolutions
