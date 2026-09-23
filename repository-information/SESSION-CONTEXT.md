# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-23 (the run: 07:36 → 10:30 AM EST, unattended; a short attended tail to 2:40 PM EST for the v8 hand-off)
**Repo version:** v07.31r — three pushes on `claude/fervent-lovelace-sk1c5s` (v07.29r, v07.30r, v07.31r)
**Branch:** `claude/fervent-lovelace-sk1c5s`

### What was done

**The Megmeet SST onboarding briefing ran end to end, unattended, from §6 of `repository-information/megmeet-briefing-prompt.md`.** All three deliverables shipped.

- **D1 — `live-site-pages/profiler-data/reports/sst-hall-edge-block--competitive--2026-09-23.report.json`** (v07.29r, push 1). A Profiler competitive report on the SST and medium-voltage hall-edge block, dossiers only, cut on the axis the 8 September AIDC edition could not score: **the service-voltage class each vendor has actually specified**. Eighteen dossiers, 46 citations copied verbatim from their `sources[]`, eight key judgments, ten limitations, eight gaps. Builds on and does **not** supersede the 8 September edition. `check-profiler-reports.py` clean.
- **D2 — `repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** (v07.30r push 2, corrected in v07.31r push 3). **71 pages, 14 figures, five parts plus a four-part appendix**, on the SST primer's print skin. Source `megmeet-sst-briefing-print.html`; figures from `scripts/build-megmeet-sst-briefing-figures.py`; PDF from `scripts/build-megmeet-sst-briefing-pdf.mjs` (Chromium over DevTools, running header and page numbers).
- **D3 — `repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`** (v07.31r, push 3). Seven drill widgets, data inlined byte for byte, no network, zero console errors under Playwright. Also published as a **private Claude artifact**: https://claude.ai/artifact/D8zZrSo8Y88XPrbThLEFMx
- **`megmeet-sst-briefing-data.json`** is the single source for every plotted or displayed number — **215 tagged records**, each carrying one of six fixed tags. The figures read it and the companion inlines it, so the two cannot drift.

### The finding the document exists to carry

The hall-edge contest is not being decided on efficiency — every serious vendor claims 98.5% and none publishes the boundary, and NVIDIA rates the transformer-rectifier unit and the SST identically. It is being decided on **disclosed service-voltage class** and **disclosed commerce**. On that test the field inverts: the only SST a filing describes as supplying the market stops at 13.8 kV; the best-specified 34.5 kV designs belong to venture balance sheets and have not shipped; the only orderable solid-state MV product from an incumbent is a UPS; nobody holds a UL listing for the 800 V DC bus. **Megmeet's own SST class is genuinely `undisclosed`** — zero kV mentions across 38 pinned dossier sources and a four-filing scan — while its rack-and-sidecar chain is published, shipping and growing 60.92%.

### Where we left off

**The run is complete and all three pushes merged.** Nothing is pending. Phase F's audit (a fresh subagent against the twelve-line rubric) returned 35 findings; all 35 were worked and the PDF rebuilt. The rubric re-check passes on every line.

After the run the developer asked for a **paste-in prompt for a fresh session to cut Megmeet dossier v8**, rather than running it in this session. That prompt was written and handed over in chat; its substance is the Recommendation below. Nothing else is outstanding.

### Key decisions made

- **Archive rotation was not performed**, three times, because the rule tests the **non-exempt** section count with the current day exempt: 92 non-exempt against a trigger of 100. The plan's summary said rotation falls due at 100 raw; the rule won, and the reasoning is in the colophon and in each CHANGELOG section.
- **The reader's hearsay** about NVIDIA/Oracle engineering contact steered chapter 8's depth and nothing else. It is boxed once, labelled unverified, and cited nowhere.
- **`undisclosed` is a finding, not a hedge** — applied to Megmeet exactly as to Amperesand, GE Vernova, Hitachi Energy, Vertiv, Schneider and Sinexcel.
- **The older Megmeet prep files were not edited.** Chapter 9.4 lists eleven things dossier v7 now contradicts in them and changes nothing.
- **No model identifier appears in any repository artefact** — the colophon records effort and run window instead.

### Active context

- Toggles unchanged: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off
- CHANGELOG counter `Sections: 102/100`, 92 non-exempt — **rotation fires on the next push that is not same-day**
- Two pre-existing `check-profiler-reports.py` warnings on other reports (aged pins on `grid-scale-bess` and `named-project-bess-attach`) — untouched by this run

### Recommendation for next session

- Run **`profiler megmeet`** to cut **dossier v8** (v7 is dated 2026-09-08, 38 sources) **before Megmeet's Q3 2026 report lands at the CSRC statutory deadline on 31 October**. It is a revision: archive v7, then work the nine open questions the briefing's chapter 16 named as unclosable from the then-current record — above all **the SST's service-voltage class** (zero kV mentions across all 38 pinned sources and a four-filing scan) and **what Q1 2026 "volume delivery to North American majors" actually consisted of** (which contradicts the August interview brief's "North America is greenfield").

Three things a fresh session will not know and must be told:

- **`aka[]` and `legalName` are both null on v7.** `aka[]` is the input to the Profiler Command's step-7 reconciliation grep, so it must be populated first — 麦格米特 · Shenzhen Megmeet Electrical Co., Ltd. · Megmeet Welding · Megmeet USA.
- **Not one of v7's 38 sources carries a `party` field**, although the registry reports 58% first-party. Stage 1 is genuinely under-served: exhaust megmeet.com, megmeet-welding.com, the IR archive and cninfo before any third-party source, and set `party` on every entry.
- **Thirteen other dossiers mention Megmeet** with word boundaries — delta-electronics, dg-matrix, flex, huawei-digital-power, infineon, liteon, nvidia, power-electronics, sinexcel, sungrow, vertiv, vicor, zhonhen. A normal step-7 reconciliation load, not the NVIDIA-scale case that has to be deferred.

The September study-prep files — the briefing PDF, its print HTML, the companion, the data file and the 23 September competitive report — are **dated documents and are not edited**. If v8 contradicts them, say so and let the developer decide.

**To continue:** type `profiler megmeet`

## Previous Sessions

### Session — 2026-09-23 07:35 AM EST (planning)

**Date:** 2026-09-23 07:35 AM EST (the session ran ~07:15 → 07:35 AM EST)
**Repo version:** v07.28r — one push on `claude/busy-hawking-cfdvqk` (the v2 briefing plan), plus a second push for this session-context write
**Branch:** `claude/busy-hawking-cfdvqk`
**Model:** Fable 5.1 (a **planning** session — nothing was built or researched beyond the plan itself)

### What was done

- **The Megmeet SST briefing plan was rewritten as v2** (v07.28r) at `repository-information/megmeet-briefing-prompt.md` (110 → 383 lines). The developer widened the deferred v1 scope to: the SST in its entirety (term system, lineage and adjacent technologies), the 800 V DC value case from every player's perspective, limitations and who is working them, **who is testing at which service voltage (34.5 kV vs 12.47/13.8 kV)**, the adoption obstacles including **operation and maintenance**, Megmeet against its competitors on SST **and** in its six adjacent business units, what NVIDIA's and Oracle's engineering programmes will ask (the developer's "Megmeet is talking to their engineers" is **unverified hearsay** — the plan rules it may steer emphasis and is never stated or cited), figures/tables/timelines throughout, interactive widgets, and one downloadable PDF — all as an **overnight unattended run** in one new session
- **The corpus finding that shaped everything:** a 20,000-word, 14-figure SST primer already exists (`SOLID-STATE-TRANSFORMERS-PRIMER.pdf` / `sst-primer-print.html`, v05.36r–v05.38r, 2026-09-12) with its own matplotlib figure script and Chromium-CDP PDF script. The plan **extends it and cites its figure numbers** rather than rebuilding it. Its thin spot is O&M (one mention of maintenance); its watch-list of 12 September is the first thing the run updates
- **Pre-flight run today, results in §0:** `profiler-queue.py --quarterly --tier core` → `dueCount: 0`; the SST four at v1/v2 dated 2026-09-12 → 09-19; Megmeet v7 (2026-09-08); Oracle v5 (2026-09-21) and NVIDIA v10 carry **no SST content** (that material is in the NVIDIA guidance module and the primer); `aidc-power-conversion--competitive--2026-09-08` still `current`; **Megmeet's own SST discloses no voltage class anywhere**; matplotlib and Playwright absent from a fresh container; CHANGELOG counter one push from rotation
- **§2 the ask-by-ask delta** (ten rows: covered where / missing what / corpus or web) · **§3 deliverables** — D1 a Profiler competitive report on the SST hall-edge contest (dossiers-only, builds on and does not supersede the 2026-09-08 edition); D2 `study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf` from print HTML on the primer's skin (`mmsst-fig-` figures, copies of the primer's two build scripts); D3 `megmeet-sst-briefing-companion.html` with seven prioritised widgets (ship ≥5), Playwright-tested from `file://`; a shared `megmeet-sst-briefing-data.json` as the single source for every plotted number; the brief's five-part table of contents and minimum figure set
- **§4 the model recommendation — Opus 5 `xhigh`, one session, subagents on the same model.** Reasons: the repo's Xcel head-to-head (Opus deeper on long first-party documents; judgments inconclusive; Fable narrowly ahead only on sourcing discipline — which the citation-tier rule and the rubric enforce model-independently); half Fable's price and none of the Fable weekly sub-allocation; `xhigh` is the level the repo's Opus evidence was built at; `max` buys nothing the checkers do not; overnight makes latency free. Set aside with reasons: Fable 5.1, Sonnet 5 (offered only as the Phase B subagent cost lever), Opus 5.5, `max`, a two-session split. Estimate stated as judgment: 3–5 hours, ~4–6× v1's spend (~$120–250 API-equivalent)
- **§5 the run:** phases 0 (pre-flight) · A (corpus read into two scratchpad ledgers) · B (five bounded web subagents: pilots by kV class; obstacles/O&M/standards/policy; NVIDIA + Oracle programmes; adjacent-BU competitors; Megmeet's own SST) · C (D1, **push 1**) · D (data → figures → brief chapter by chapter → PDF with proof PNGs, **push 2**) · E (companion) · F (a fresh subagent audits the PDF against a **twelve-line rubric**, fixes, README tree, CHANGELOG, remember session, **push 3**); failure handling decided in advance
- **§6 the paste-in prompt** (also handed over in chat at 07:30), **§7 a resume prompt** for a dead container, **§8 the developer's night-of checklist**
- Housekeeping: v07.28r CHANGELOG section (counter **99/100**), README timestamp and tree description; **`REMINDERS.md` untouched** (developer-owned — its v1 budget line "~35–50 minutes and ~$25–40" is now superseded by §4)

### Where we left off

**The plan is on `main`; the briefing itself has NOT been run.** The developer has the prompt (chat, and §6 of the plan file) and the model/effort recommendation. The next action is theirs: a **new session on Claude Opus 5 at `xhigh`**, paste §6, walk away for 3–5 hours. Nothing from this session is pending.

### Key decisions made

- **Extend the primer, do not rebuild it** — the brief summarises each primer chapter in a page and cites its figures; new figures only where the primer has none
- **HTML-first PDF** on the primer's skin, not the Markdown study-prep renderer (`build-study-prep-pdf.mjs` has no image support) — and **not Classroom** (personal job context is not public-safe, and the C2 gate surface is the wrong cost for a one-off study document)
- **Everything personal stays under `repository-information/study-prep/megmeet/`**; only D1 is public Pages data and it is dossiers-only by construction. The existing interview brief, lesson plan and study guide are **not edited** — the brief lists what dossier v7 now contradicts in them
- **One data file feeds both the figures and the widgets**, byte-identical, so they cannot drift
- **Three checkpoint pushes** so a container dying at 3 AM loses at most one phase (allowed: each push after the prior one has merged)
- **Opus 5 over Fable 5.1** for an unattended run; **`xhigh` over `max` and `high`**; Sonnet 5 only as an optional subagent lever
- **The hearsay rule** for the NVIDIA/Oracle chapter mirrors the Report Command's field-notes rule: steers emphasis, never stated, never cited

### Active context

- **Repo version v07.28r.** `CHANGELOG.md` **`Sections: 99/100`** — **archive rotation falls due on the next push that takes the counter to 100** (changelogs.md: "reaches 100"), i.e. the overnight run's first push unless another push comes first; unshallow first, SHA enrichment mandatory
- **Live versions unchanged:** `Classroom.gs` v01.87g · `Classroom.html` v01.16w · `Events.html` v01.11w · `Events.gs` v01.09g · `Network.html` v01.24w · `Network.gs` v01.17g · `Scraper.gs` v02.22g · `Profiler.html` v01.91w. **No `.gs` changed — no redeploy needed**
- **The Routine fleet is six, all enabled** (verified 2026-09-23 06:06); the rebuilt C2 Classroom weekly fired today at 11:07Z — **its first report has not been read**
- **One reminder remains active** — the Megmeet SST briefing before Wednesday 2026-10-07. Sequencing condition met (X closed D16 at v07.27r); pre-flight done today; the plan is v2
- **Toolchain in a fresh container:** Node 22 and Chromium (`/opt/pw-browsers`) present; **`pip install matplotlib playwright` needed** — never `playwright install`
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Start a **new session on Claude Opus 5 at effort `xhigh`** and paste §6 of `repository-information/megmeet-briefing-prompt.md` — the plan is complete, the corpus is fresh as of today, and the 2026-10-07 start date leaves two weeks for a second pass if the Phase F audit turns up gaps. Check the usage meter first; if the run happens after 2026-10-01, glance at `reports/reports-index.json` for a newer AIDC power-conversion edition.
- **To continue:** type `run the Megmeet briefing from §6 of megmeet-briefing-prompt.md`
