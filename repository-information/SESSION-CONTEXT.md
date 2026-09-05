# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-05 06:02 PM EST
**Repo version:** v04.73r — one push commit this session (`d229ff9`, merged to `main`), plus this housekeeping commit
**Branch:** `claude/phase-b-f6-profiler-20aamw` (rebased onto `origin/main` after the merge)
**Model:** Fable 5.1 High — Phase B session **F6**: MGX · Excelsior Energy Capital · X-energy — the first dossiers behind the `investor` chip. Two research subagents per company (six total, 60/57 · 67/64 · 85/66 sources), dossiers, guides, lesson plans, step 7 reconciliation, all in one push commit.

### What was done

- **Three dossiers** (schema v7, profileVersion 1, intel-briefing): `mgx` (`investor`; 103 sources, 42% first-party, 11 relationships), `excelsior-energy-capital` (`investor · developer`; 108 sources, 55%, 8 relationships), `x-energy` (`supplier`; 139 sources, 62%, 7 relationships; `ownership.type: public`, NASDAQ: XE). 39 company-published headshots (execs 548 across 83 companies).
- **Three schema v2 guides + lesson plans**: MGX (the money behind the money — sovereign funds, fund/platform/JV/direct stake, sizing an investor with no numbers, why labs take Gulf money, circular financing, export controls and CFIUS); Excelsior (the fund above the platform — closed-end fund calendar, Form D/ADV, own/operate/develop, battery reservation agreements and the domestic-content bonus, EV/EBITDA on the Enel sale, the green tariff); X-energy (the fuel is the reactor — TRISO as containment, 750°C as product, continuous refuelling, the HALEU chain, Part 50 on an 18-month clock, the ring around a vendor that owns no plant, an order book of options, going public on cost share). 44 shared concepts registered (855 total). None repeats Oklo, Aypa, GridStor, Anthropic or Dominion.
- **Step 7 reconciliation — eleven older dossiers revised and archived** (kiewit v7, oklo v2, openai v5, aligned v5, anthropic v2, amazon v7, talen-energy v2, black-veatch v7, sargent-lundy v2, fluence v8, lg-energy-solution v6). The kiewit and oklo dossiers carried a wrong negative finding on X-energy (Kiewit Nuclear Solutions is in the Cascade Nuclear Partners JV since October 2025) — corrected. Every inbound edge's URL was registered in the same edit.
- **Checkers**: registry sync clean (130 companies) · study 0 errors (104 guides) · relationships exit 0 with **4 accepts** (`mgx`/`openai`, `aligned`/`mgx`, `anthropic`/`mgx`, `amazon`/`x-energy` — all the `investor` ↔ `portfolio` enum gap; 14 accept entries total, 6 of them the enum gap) · crossrefs exit 0 with 2 accepted open questions · graph 942 edges.
- **Investor chip visual check** (Playwright, Profiler v01.82w, unchanged): roster chip `investor 2`, `.ov-tag.investor` = `#b18cf2` as declared, Compare "Investor" alone for MGX and "Investor / Colocation & Cloud Capacity" when Excelsior (also `developer`) is picked first — the family map as designed; artefact recorded in §7.
- **Bookkeeping**: three calendar rows (91) — `x-energy` carries `nextReport: 2026-11-13` (unconfirmed) because it is public; §8 rows flipped `B6/B10 → F6` with premise verdicts in Closes; §7 investor bullet rewritten; F6 entry in the calibration log; README tree (+3 profiles, +3 guides, +3 study-prep folders, +11 archive lines); CHANGELOG **90/100**.

### Where we left off

Nothing is in flight. Working tree clean, branch rebased onto `origin/main`. **Program state: 41 of 65 new companies, 4 of 30 guide passes.** The F7 paste-in prompt was handed to the developer in this session's chat (regenerate from §4 row B7 and §7 if lost).

- **Next action is F7** on Fable 5.1 High — Compass Datacenters · EdgeCore Digital Infrastructure · PowerHouse Data Centers (`developer`, AIDC developers).
- **Fable remaining:** F7 · F8 (High). **Opus remaining:** C5–C10, C12, 26 guide backfills, X3.

### Key decisions and findings

- **Premise verdicts (§4 → §8 Closes):** Excelsior — Fluence 2.2 GWh customer **held**, but signed 30 July 2024 (December 2024 is LG's separate 7.5 GWh deal) and no recipient project or delivery is named; `developer` holds only via the wholly-owned Lydian platform. MGX — Aligned **held** (direct co-owner since 21 July 2026), Stargate **held narrowly** (named initial funder, contribution unconfirmed, later releases omit MGX), "10 dossiers" **did not hold**: 12 files match `\bMGX\b`, 8 are NVIDIA's MGX rack architecture, 4 name the fund. X-energy — Amazon SMR partner **held** on every element; brief corrections: public since 24 April 2026, Series D USD 700m closed November 2025 led by Jane Street.
- **Enum gap evidence, not fixed:** six accept-list entries now exist only because `portfolio` is absent from `relationships[].type`. Recorded in the calibration log for the schema decision; not adopted.
- **`developer` spans two spaces:** the `Colocation & Cloud Capacity` peer family treats data-centre developers and renewable/storage developers (F3–F5's `developer · ipp`) as one space. A `renewables-developer` family split is a visible option; noted in §7, not done.
- **Writer discipline that made the checker trivial:** the dossier builders asserted every relationship/policy/development URL was an exact member of `sources[]` before writing (0 unregistered-source findings), and a scratchpad URL index refused any URL the agents had not fetched (0 unmatched across three dossiers).
- **Environment:** mgx.ae pages are ~15 MB (curl, not WebFetch; `/en/` paths redirect); excelsiorenergycapital.com redirects to excelsiorcapital.com; Business Wire, WAM, openai.com, centrica.com, investors.x-energy.com, federalregister.gov unreadable — mirrors used and cited; Python `playwright` and `pillow` needed `pip install`; the harness-created remote branch was already swept by the workflow at push time (ls-remote empty), so push-once held.

### Active context

- Branch `claude/phase-b-f6-profiler-20aamw`; repo version **v04.73r**; CHANGELOG **90/100** — 10 pushes of headroom.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders. `TODO.md`: no items.
- Checker state at v04.73r: registry sync clean · study clean · relationships exit 0 (14 accepts) · crossrefs exit 0 (8 accepts) · reports not re-run (X3 re-pins) · roles not run.

### Recommendation for next session

- **Run F7 on Fable 5.1 High — `profiler` + `profiler prep` for Compass Datacenters, EdgeCore Digital Infrastructure and PowerHouse Data Centers (`developer`, AIDC developers), then the four after-write scripts, three calendar rows, README tree entries and the §8 flips.** Corpus mentions to reconcile in step 7: Compass in `southern-company`; EdgeCore in `hitt`, `holder-construction`, `mccarthy`; PowerHouse none under `\bPowerHouse\b` (also grep `\bPowerhouse\b` and `Joliet`).
**To continue:** type `run F7 on Fable 5.1 High`

## Previous Sessions

### Session — Phase X item X2, relationships checker cleared to exit 0 (Fable 5.1 Medium)
**Date:** 2026-09-05 04:43 PM EST
**Repo version:** v04.72r — one push commit this session, plus this housekeeping commit
**Branch:** `claude/profiler-relationships-x2-r0d1pm` (pushed at `d24e339`, merged to `main`, rebased after)
**Model:** Fable 5.1 Medium — Phase X item **X2**: cleared all 134 findings of `scripts/check-profiler-relationships.py`. It now **exits 0**. No research; bookkeeping and bounded adjudication only, by instruction.

### What was done

- **15 reciprocal-type findings adjudicated:** 10 accepted with written reasons in `repository-information/profiler-relationships-accepted.json` (`microsoft`/`openai`, `google`/`terawulf`, `byd`/`tesla`, `byd`/`sinexcel`, `delta-electronics`/`infineon`, `dpr`/`openai`, `amazon`/`mainspring-energy`, `blattner`/`quanta-services`, `eolian`/`jupiter-power`, `mitsubishi-power`/`prevalon`); 5 `type`s corrected — `kiewit`→`bechtel` `other`→`competitor`, `nvidia`→`flex`/`infineon`/`liteon`/`megmeet` `supplier`→`partner` (the cited source is NVIDIA's own 800 VDC *partner* list; the vendor side was right).
- **119 unregistered-source findings cleared:** **104** were truncated prefixes of a URL the dossier had already registered (clipped mid-slug at ~100 chars, or missing `.html` / `/`) — string substitution; **15** genuinely absent URLs registered into `sources[]` with label and date, all inbound edges written by step-7 reconciliation when `oklo` / `mccarthy` / `trane-technologies` / `hitt` / `talen-energy` landed. 0 URL findings accepted.
- **49 dossiers revised and archived** (profileVersion +1, lastUpdated 2026-09-05); registry synced (47 rows), graph rebuilt (903 edges), archive-index and README tree updated (also fixed 3 missing + 3 duplicate archive lines).
- **§9.4 X2 row flipped to `Done — v04.72r`.** Adjudication log added to `PROFILER-CROSSREF-CALIBRATION.md` → Relationships checker.

### Where we left off

Nothing is in flight. Working tree clean, branch rebased onto `origin/main`. **Program state unchanged — 38 of 65 new companies, 4 of 30 guide passes.** S2 is closed; every future profile write is guarded by the checker. The F6 paste-in prompt was handed to the developer in this session's chat.

- **Next action is F6** on Fable 5.1 High — MGX · Excelsior Energy Capital · X-energy, the first dossiers behind the `investor` chip.
- **Fable remaining:** F6 · F7 · F8 (High). **Opus remaining:** C5–C10, C12, 26 guide backfills, X3.

### Key decisions and findings

- **Two writer patterns explain all 119 URL findings**, recorded in the calibration log as candidate step-7 wording: never clip a relationship `source` string (substitute the registered URL), and when reconciliation adds an edge to an *older* dossier, register the cited URL in that dossier's `sources[]` in the same edit. Not adopted as a rule this session — bookkeeping only.
- **Enum gap recorded, not fixed:** `portfolio` (inverse of `investor`) and parent/subsidiary are absent from the `type` enum; `amazon`/`mainspring-energy` and `blattner`/`quanta-services` sit on the accept list with the gap written out. **F6 will write the first `investor` edges** — expect their reciprocals to report until the enum grows or the pairs are accepted.
- **Counterparty newsrooms tier `independent` under the domain rule, and that is correct** — no `party` override was set on any of the 15 registrations.
- **Report pins aged 31 → 34** (warning-only; X3 re-pins). `check-profiler-crossrefs.py` surfaced no new candidate.
- **One prose touch beyond `type` and `sources[]`:** the `kiewit`→`bechtel` note got a three-word prefix so it supports the corrected type.

### Active context

- Branch `claude/profiler-relationships-x2-r0d1pm`; repo version **v04.72r**; CHANGELOG **89/100** — 11 pushes of headroom.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders. `TODO.md`: no items.
- Checker state at v04.72r: registry sync clean · study clean · reports 0 errors / 34 aged pins · crossrefs exit 0 · **relationships exit 0 (10 accept-list entries)** · roles not run (no Playwright in the container).

### Recommendation for next session

- **Run F6 on Fable 5.1 High — `profiler` + `profiler prep` for MGX, Excelsior Energy Capital and X-energy, the first dossiers behind the `investor` chip, with a visual check of the chip label, `.ov-tag` colour and the compare peer group, then the four after-write scripts and the §8 row flips.** S2 is closed, the checker guards every new `relationships[]` edge, and the remaining Fable work is all dossier research.
**To continue:** type `run F6 on Fable 5.1 High`

Developed by: LightAISolutions
