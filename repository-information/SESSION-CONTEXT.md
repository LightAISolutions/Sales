# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-23, 02:58 → 07:13 PM EST (attended)
**Repo version:** v07.33r — two pushes on `claude/confident-ride-rrxpw3` (v07.32r, v07.33r), plus this session-context write
**Branch:** `claude/confident-ride-rrxpw3`

### What was done

**v07.32r — Megmeet dossier cut to v8** (`profiler megmeet`, run from the hand-off prompt the previous session wrote).
- **Identity verified off filings.** SZSE: 002851; 深圳麦格米特电气股份有限公司 / "Shenzhen Megmeet Electrical Co.,Ltd."; former name "…Electrical Technology Co., Ltd." Still independent.
- **Registry.** `aka[]` populated with 12 names; `megmeet-welding.com` added to `domains`.
- **Sources: 38 → 81**, each with an explicit `party`: 29 company, 20 disclosure, 32 independent — 60% first-party.
- **The nine open questions:**
  1. The SST class is still undisclosed but now bounded. Every filing and IR record from September 2024 to August 2026 was searched. One press lead (ifeng, 10 kV / 35 kV) is contradicted by the filed IR record of the call it cites.
  2. North America: batch delivery is dated H1 2026; the Q1 2026 date covers AIDC delivery generally.
  3. The company's own site places a 35,000 sq ft US manufacturing base in Richardson, Texas, and a TDLR record matches it. The filings don't list it.
  4. No AI data-centre revenue line is disclosed.
  5. FY2025 segment margins found; FY2025 R&D was RMB 1.122B.
  6. No US-entity customer is disclosed.
  7. OCP: exhibitor only.
  8. UL: marks and lab programmes, no listing number.
  9. The "#2 behind LITEON" claim traces to 2025 rumour; Soochow expects Megmeet as the **third** source.
- **New facts:** the 22 September welding minority buy-out (RMB 663.64M). The H-share A1 has had no hearing. Consensus is RMB 787M.
- **v7 errors fixed:** the "only expanding margin" claim, the "¥8.66B" consensus figure, `periodType: interim`, and Germany listed as manufacturing.
- **Reconciliation:** 13 inbound dossiers reviewed; **Delta v5→v6 and LITEON v6→v7** corrected where they carried the #2 claim as corroborated. Registry, graph, refresh calendar and refresh notes all updated.

**v07.33r — follow-through, at the developer's instruction.**
- **Briefing chapter 9.4:** a second table with seven rows — the six v8 contradictions plus the bounded 10 kV / 35 kV lead. The PDF was rebuilt (72 pages) and the colophon has an amendment note. The body is otherwise unchanged.
- **Report superseded:** the new edition is `sst-hall-edge-block-rev2--competitive--2026-09-23`. It re-pins Megmeet v8, Delta v6 and LITEON v7, corrects the margin error and closes the #2 claim. The morning edition is flipped to `superseded`.
- **Classroom:** Megmeet added to `in-hall-power` as `adjacent`, and `segment-in-hall-power` regenerated in `Classroom.gs` (v01.88g).
- **Reminder closed:** "Paste the Megmeet SST briefing prompt" moved to Completed; Active Reminders now reads `*(none)*`.
- **Rewrite prompt:** `repository-information/megmeet-briefing-rewrite-prompt.md` written for a separate rewrite session.

### Where we left off

All pushes are merged and nothing is uncommitted. Two things are open:
- **The briefing rewrite has not run yet.** The developer runs it in a fresh session from the prompt file. That session:
  - rewrites the brief for clarity and learning;
  - converts the ~590 citation tags to numbered, tier-coloured superscripts (one number per distinct source, about 89) with a new C.0 reference list;
  - applies the seven 9.4 corrections to the body.
- **`segment-power-conversion-and-rack-power-silicon` is still due.** v8 changed Megmeet's basis line, and the lesson has not been regenerated.

### Key decisions made

- **`legalName` was not added.** `name` is the schema's canonical legal-name field, and `legalName` is a variant shape the schema says to phase out.
- **v7's source labels were kept verbatim in v8.** Published reports copy citations verbatim, and relabelling broke the 23 September report's matches.
- **The superseding report changes the topic slug (`-rev2`), not the date.** Report ids are `<topic>--<type>--<date>`, and today's date was taken.
- **In-hall-power:** first withdrawn in v07.32r because it would force a Classroom regeneration, then restored in v07.33r when the developer asked for it.
- **Citation numbering is per distinct source, not per tier**, so each superscript keeps its pointer (slug and version, primer chapter, guidance pages). The developer was told how to switch to tier-only numbers.
- **The rewrite prompt corrects the body at the seven 9.4 points.** A learner shouldn't meet a wrong statement that is only corrected pages later.
- **Model names are kept out of repository files**, including the CHANGELOG prompt blockquote, where the model name is shown as `[model name withheld]`.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Repo CHANGELOG rotation is due on the next push.** The counter reads `Sections: 104/100`, and 12 of those sections are dated 2026-09-23. From 24 September all 104 are non-exempt, so the first push that day must rotate the oldest date groups until fewer than 100 remain. Deepen the clone first and SHA-enrich.
- **The Classroom GAS changelog is at `50/50`.** The next Classroom GAS bump takes it past 50 and triggers its rotation.
- **Report checker:** 5 aged-pin warnings, all on current 8 September editions (`aidc-power-conversion` ×3, `grid-scale-bess`, `named-project-bess-attach`). The drift-gated monthly Routine owns them.
- **Megmeet dates:** Q3 2026 report due by 31 October; the calendar's `nextReport` is 2026-10-30, unconfirmed. The developer starts at Megmeet on 2026-10-07.

### Recommendation for next session

- Run the Megmeet briefing rewrite. Open a fresh session at `xhigh` effort and paste everything below the line in `repository-information/megmeet-briefing-rewrite-prompt.md`. It edits only the print HTML and the PDF, runs its own fact-preservation checker and a fresh-subagent audit, and must land before the 2026-10-07 start date.

**To continue:** type `run the Megmeet briefing rewrite from repository-information/megmeet-briefing-rewrite-prompt.md`

## Previous Sessions

### Session — 2026-09-23 10:30 AM EST (Megmeet SST briefing run)

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

