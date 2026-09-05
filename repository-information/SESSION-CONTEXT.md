# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — Phase B F6, MGX · Excelsior Energy Capital · X-energy (Fable 5.1 High)
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

Developed by: LightAISolutions
