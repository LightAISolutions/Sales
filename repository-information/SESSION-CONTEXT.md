# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-26 06:05 AM → 05:09 PM EST (F-I1 plus three follow-up turns; context compacted once, during F-I1's close-out)
**Repo version:** v07.68r (three pushes: v07.66r F-I1; v07.67r the Profiler bold fix, the README archive backfill and the ERCOT/PJM and DigitalBridge decisions; v07.68r the SEC contact). The cooling reminder and this save are housekeeping, with no version bump
**Branch:** `claude/nice-cannon-goad45`
**Model:** Opus 5.5 at xhigh, per the F-I1 prompt

### What was done

- **v07.66r — Phase F session F-I1**, BlackRock (with GIP, AIP and HPS) and KKR. It ran on 9/26, ahead of its 9/28–9/29 slot:
  - **Two dossiers (v1) and study guides (v2), each with an eight-module lesson plan:**
    - `blackrock`: investor. **One slug** for BlackRock, Inc. (NYSE: BLK; CIK 0002012383). GIP is Global Infrastructure Management, LLC, wholly owned and in no separate accounts, so it sits in `aka[]` with AIP, HPS, Preqin, iShares, Aladdin and the platform names. 80 sources, 11 decision makers, all with photos.
    - `kkr`: investor. KKR & Co. Inc. (NYSE: KKR). Global Atlantic (the Insurance segment), Helix, STTGDC, ContourGlobal, Zenobē, Avantus and Encavis are in `aka[]`. 76 sources, 12 decision makers, all with photos.
  - **Segments:** `capital` · incumbent for both; the roster goes from eight to ten.
  - **Calendar:** both public and quarterly. Next results `blackrock` 2026-10-13 and `kkr` 2026-10-29, each `confirmed: false` until the company announces the date.
  - **16 new concepts** (1,555 total), among them `schedule-13d`, `schedule-13g`, `index-fund`, `open-ended-fund`, `core-infrastructure`, `ferc-section-203`, `blanket-authorization`, `outside-date`, `definitive-agreement`, `transmission-company`, `private-credit`. None edited.
  - **Step 7, nothing deferred:** 28 inbound dossiers revised under the Archival Procedure for the reciprocal edge, including `microsoft` and `xai`, which lacked their AIP edge. Three carried corrections:
    - `aes-clean-energy`: Ohio approved the change of control on 17 Sep.
    - `fluence`: the same fix.
    - `jupiter-power`: a 'backed by GIP' quote no Jupiter page carries.
  - **Accepted pairs:** 10 other↔other pairs added to the relationships accept list.
  - **Guide correction:** `mgx.study.json`, one clause — AIP is *named as* Aligned's buyer; the EC names GIP's manager and MGX as the joint controllers.
  - **Report pins:** five edge-only revisions re-verified (`aep`, `meta`, `stack-infrastructure`, `xai`, `amperesand`). `fluence` v10 and `jupiter-power` v7 are left loud because their corrections are substantive.
  - **Ledger and plan:** both §11.3 rows flipped at v07.66r; `phase-f-action-plan.md`'s status line updated.
- **Premise verdicts, in brief:**
  - **BlackRock** (8 clauses: 4 held, one of them as MOUs; 2 refined; 1 reported only; 1 conflict settled):
    - Aligned — **held on the figures, refined on control**: EC M.12259 names GIM and MGX as joint controllers; AIP is not a notifying party.
    - AES — **refined**: signed 1 Mar by GIP and EQT Infrastructure VI; GIP vehicles 56.625% after closing; FERC (EC26-99) and New York pending; outside date 1 Jun 2027.
    - ALLETE 60/40 with CPP — **held**.
    - STACK Asia-Pacific — **reported only**: Bloomberg names AIP and IFM, not GIP.
    - CyrusOne — **settled**: GIP still co-owns it; no first-party source says 50:50.
    - NVIDIA compute financing — **held, as MOUs**.
  - **KKR** (6 clauses: 3 held, 3 refined): STTGDC 75%, ECP (30 Oct 2024) and the 19.9% AEP transmission stake held; CyrusOne 50% refined (split unstated); Helix refined (a company, not a fund, with commitments); EDF power solutions refined on scope ('net renewable capacity').
  - **Not in the hypotheses:** Coravel (ACS–GIP 50:50); Meta's El Paso venture (80% BlackRock funds; an exclusivity agreement, not closed); ContourGlobal's 3 GWh CATL order; Avantus's 800 MWh Fluence system; STTGDC's HVDC testbed; 65% of Sempra Infrastructure Partners, signed but not closed.
- **Verification:** registry sync, study, relationships, crossrefs and README-tree checkers clean; the reports checker's four warnings read. Playwright: 30 dossiers and three guides, zero page errors (details in the CHANGELOG).
- **v07.67r — the follow-up to the session evaluation:**
  - **Profiler v01.93w:** bold in inbound evidence excerpts, Capabilities kv rows, Policy mitigation lines and the Ecosystem explorer now renders as bold instead of literal `**`. One fragment-based helper, no `innerHTML`; an odd marker count (an excerpt cut mid-bold) is stripped. Playwright: 16 dossiers and the explorer show 0 literal markers and 0 page errors. The page changelog was at its 50-section cap, so v01.43w moved to the archive with its commit link.
  - **README tree:** the 63 unlisted archive files are listed, so all 447 archived versions appear.
  - **ERCOT and PJM approved** as grid operators, in a new `grid-operator` category, as two sessions with ERCOT first (`phase-f-action-plan.md` row 21; §11.3 rows flipped to approved).
  - **DigitalBridge fallback** on row 10, which I recommended and the developer approved: if the close has not happened by Wed 10/7, move `scenario-capital-objection`'s reviewBy from 10/14 to Fri 11/6 (the landscape's own date); if not by Fri 10/30, run wave B without SoftBank and Blue Owl.
- **v07.68r — the SEC contact.** The developer supplied a contact, which goes in `SEC_USER_AGENT` in `scripts/check-source-reachability.py` and is sent to SEC hosts only; the other probed hosts keep the neutral User-Agent. The probe's verdict is **OK** for the first time since v04.91r (`sec.gov` and `data.sec.gov` 200). `profiler-app.md`, `PROFILER-SCHEMA.md` and BlackRock's refresh note now call the old 'network-keyed block' a User-Agent rejection, and every SEC request, a subagent's included, uses that string. The older 9/30 run reminder was dismissed by the developer and moved to Completed Reminders.
- **This save:** a new reminder (26 Sep 5:08 PM) — recheck the cooling module on Mon 9/28 if CoolIT's launch is public, otherwise on Wed 9/30.

### Which BlackRock and KKR platforms buy MV or DC power equipment? (the Megmeet paragraph)

Neither firm signs for equipment itself; every order is placed at a platform its funds control. **BlackRock:** no SST, 800 VDC or HVDC purchase is on record at any of its platforms. The medium-voltage and battery buyers it reaches are Aligned (with MGX), CyrusOne (with KKR), Coravel (with ACS), ALLETE and Minnesota Power, Clearway Energy Group, Eolian and Jupiter Power, plus AES once the take-private closes. The El Paso campus's design runs through Meta, not BlackRock. **KKR** has the one real DC-power door. STTGDC, 75% KKR-owned since 2 Sep, runs an HVDC testbed with LITEON and Amperesand's SST and names deployment in future Singapore data centres as its plan. The contact is STTGDC's engineering team, not KKR. KKR's battery buyers are ContourGlobal (3 GWh from CATL) and Avantus (800 MWh from Fluence). EDF power solutions North America, still pending, has a 20 GWh framework with Ford Energy, and Helix's first-look supply rights favour suppliers who are also its investors (NVIDIA, Vistra). **Net:** capital is a directory for finding buyers, and STTGDC is its one door.

### Where we left off

- **Status:** v07.66r, v07.67r and v07.68r are merged; this save is pushed at close.
- **Action plan:** rows 1, 2 and 4 of §3 are done. **F-I2** (SoftBank, SB Energy, Blue Owl) waits on the DigitalBridge close, which DigitalBridge said on 22 Sep would come within five business days (by Tue 9/29). **ERCOT and PJM** are approved for row 21: two sessions, ERCOT first, with the `grid-operator` category added in the ERCOT session.
- **Dated items:**
  - Cooling recheck on Mon 9/28 if CoolIT's launch is public, otherwise Wed 9/30 (row 3; the 26 Sep 5:08 PM reminder).
  - 9/30 Classroom run check after ~7:30 AM ET on Wed 9/30 (row 5). That reminder expects only two segment lessons due; F-H1, F-N1 and F-I1 have since made **17 due**, by design, so a longer due list in the run's report is expected.
  - Neoclouds pass + `profiler Habitat Energy` on or after Thu 10/1 (rebase first — the 10/1 Profiler Routines commit that day).
  - Dominion reframe and Classroom wave A, Fri 10/2 – Tue 10/6.
  - Megmeet start Wed 10/7.
  - Wed 10/7: if DigitalBridge has not closed, move `scenario-capital-objection`'s reviewBy to Fri 11/6 (approved; row 10). Nothing fires on its own — the first session after 10/7 applies it.
  - For the F-I1 slugs:
    - BlackRock Q3 results 13 Oct and KKR's 29 Oct, both unconfirmed.
    - KKR's EDF deal: FERC EC26-151 comments due 13 Oct.
    - KKR's controlled-company Sunset Date, no later than 31 Dec.
    - AES closing: FERC EC26-99 and New York Case 26-E-0348 (comments due 29 Sep).
    - Meta El Paso closing, and the STACK Asia-Pacific talks.
- **Stale and not yet re-authored (`Classroom.gs` untouched, by design):**
  - `landscape-capital-2026-09` was built on '4 of 8 buy nothing'. The roster is now 10, and both new incumbents buy nothing themselves and pass §11.1 only through platforms they control.
  - `scenario-capital-objection` (reviewBy 10/14) goes stale with it.
  - Classroom wave B re-authors both after F-I2.
  - The F-H1 and F-N1 drift in the neoclouds and AIDC-developers modules still waits for wave A.
  - `build-classroom-segments.py --check`: **17 due**, 15 with section changes (`capital` in eight sections) and 2 pin-only (`clean-firm-and-nuclear`, `storage-developers-and-ipps`).

### Key decisions made

- **One `blackrock` slug, not a separate GIP slug.** GIP is wholly owned, files no accounts of its own and sits inside BlackRock's single segment, and the EC calls GIM 'ultimately controlled by BlackRock'.
- **AIP gets no slug.** It is a capital partnership the EC does not name as an acquirer. Its members' edges carry it: `mgx`, `microsoft`, `nvidia` and `xai` are partners of `blackrock`.
- **Typed deal status follows the record's own word:** AES, the El Paso venture and the STACK talks are `announced`; CoolIT is `historical` for KKR.
- **Pins:** re-verified only where the change was edge-only. `fluence` v10 and `jupiter-power` v7 are left loud, with the reason written.
- **SEC contact:** the developer supplied a contact on 9/26. It lives only in `SEC_USER_AGENT` and goes only to SEC hosts, never to the other probed hosts.
- **The house-style bold stays in the dossiers.** The raw `**` that showed in inbound evidence was a renderer gap, fixed in Profiler v01.93w rather than in the data.
- **ERCOT and PJM get a new `grid-operator` category**, not the generic `other`, because the developer asked for them as grid operators. Two sessions, because ERCOT alone has 73 inbound dossiers.
- **DigitalBridge fallback date: Fri 11/6**, the date `landscape-capital-2026-09` already carries, so the scenario and its landscape are re-authored together.
- **Reminders:** the older of the two 9/30 run reminders was dismissed (moved to Completed). A new cooling reminder was added with a 9/30 fallback; the 9/24 cooling reminder is still active, because the developer did not ask to dismiss it.
- **Same-session save:** this Latest entry was extended in place rather than moved down, because it was already this session's hand-off (the F-H1 and F-N1 precedent). F-N1 stays as the Previous entry.

### Known issues

- **Unreconciled figure:** Bosque County — CyrusOne says USD 1.2bn, KKR about USD 4bn. Both sides state it.
- **Ownership splits nobody publishes:** CyrusOne (no first-party 50:50), Aligned (GIM and MGX shares), and Jupiter Power's owner, which Jupiter's own site does not name.
- **Four pin warnings:** `fluence` v10 and `jupiter-power` v7, both from this session and left loud; `jinko` v6 and `oracle` v6, pre-existing.
- **Two active cooling reminders:** the 24 Sep entry and the 26 Sep 5:08 PM entry cover the same recheck; the newer one adds the 9/30 fallback. Dismiss the older one only if the developer says so.
- **Carried over:**
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2), as before. In this sandbox `verify-profiler-roles.py` also stops early: the Python `playwright` module is not installed.
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.
  - `study-prep/zhonhen/zhonhen-interview-brief.md` still calls Panama an SST in two lines.
  - The study-guide PDF renderer is not in the repo.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 190 dossiers, 190 guides, 1,555 concepts, 1,656 graph edges (1,253 curated), 20 accepted relationship pairs; page v01.93w; the README tree lists all 447 archived versions; the reachability probe reads OK. **CHANGELOG** `Sections: 94/100`.

### Recommendation for next session

- Run the **cooling-module recheck on Mon 9/28** if CoolIT's CDU launch is public by then, otherwise on **Wed 9/30** (the 26 Sep 5:08 PM reminder; row 3 of `phase-f-action-plan.md`). `landscape-cooling-2026-09`'s reviewBy is 9/28, and it is the next dated item. F-I2 follows the DigitalBridge close, expected by 9/29.

**To continue:** type `recheck the cooling module after CoolIT`

## Previous Sessions

### Session — 2026-09-26 04:08 AM → 06:10 AM EST (F-N1 and the F-I1 prompt, v07.64r–v07.65r)

**Date:** 2026-09-26 04:08 AM → 06:10 AM EST (F-N1 and the F-I1 prompt; two attended turns; context compacted once, mid-F-N1)
**Repo version:** v07.65r (two pushes: v07.64r F-N1; v07.65r the F-I1 prompt and this save)
**Branch:** `claude/determined-curie-8zhg3t`
**Model:** Opus 5.5 at xhigh, per the developer's choice for F-N1

### What was done

- **v07.64r — Phase F session F-N1**, the neoclouds and AI-capacity builders that sign for their own campuses:
  - **Three dossiers (v1) and study guides (v2), each with a lesson plan:**
    - `firmus`: neocloud. Firmus Grid Limited, trading as Firmus Technologies; **unlisted** on 26 Sep, so its calendar row follows the private rule.
    - `humain`: neocloud, **not** hyperscaler. Legal name Future Artificial Intelligence Co.; PIF-owned.
    - `g42`: developer + neocloud. One group slug, with Khazna and Core42 in `aka[]`.
  - **Segments:**
    - `neoclouds` · challenger for all three.
    - `aidc-developers-and-landlords`: `g42` challenger (Khazna); `firmus` and `humain` **adjacent** — each builds for its own cloud and leases no shells. Firmus was hypothesised as a challenger there.
  - **Calendar:** all three private, quarterly, core, each with a source and a `watch[]` list.
  - **19 new concepts** (1,539 total), among them `power-train`, `exclusive-supply-agreement`, `work-order`, `early-contractor-involvement`, `bulk-supply-point`, `mva`, `maximum-demand`, `country-group`, `approved-recipient`, `end-use-controls`, `site-hardening`, `nvl72`, `clustermax`.
  - **13 executive photos** (5 Firmus, 8 G42), all company-published.
  - **Step 7:** eight inbound dossiers revised under the Archival Procedure for missing reciprocal edges:
    - `amd` v2, `mgx` v3, `terawulf` v8, `openai` v6, `oracle` v6, `microsoft` v5 and `nvidia` v11: edges added only.
    - `xai` v5: its 'trade reporting also cites a $3B HUMAIN investment' is closed with HUMAIN's own 18 Feb 2026 confirmation.
    - No inbound claim contradicted the new dossiers.
  - **Report pins:** `openai` and `xai` were re-verified on the named-project report.
  - **Ledger and plan:** the three §11.3 rows are flipped and `phase-f-action-plan.md`'s status line updated.
- **Premise verdicts, in one line each:**
  - Firmus: 900 MW contracted — **a sales figure**, against two operating sites. Owns its campuses — **in part** (Melbourne sits in CDC's building). 'Builds the electrical content' — **refined**: Maas Group's JLE is 'the exclusive supplier of power train units for Firmus' Australian pipeline'. Benmax — **not closed** by 26 Sep. Gunvor 1.5 GWh — **held**. IPO 22 Oct — **as reported**.
  - HUMAIN: MIS design-build — **superseded** by a 250 MW EPC under HUMAIN work orders (20 Sep). Al-Saad 1 GW by 2027 — **unreconciled** against the NYT's 250 MW. The rest held as targets or frameworks.
  - G42: Stargate UAE long-lead equipment — **held**, with no supplier or signing entity named. The A:5 move — **held, with the rider the hypothesis missed**: the named approval expires 6 Apr 2027 unless G42 and Core42 become US companies.
- **Verification:**
  - The registry sync, study, relationships, crossrefs and README-tree checkers are all clean.
  - The reports checker shows only the two pre-existing pin warnings (`jinko`, `oracle`).
  - Playwright results are in the CHANGELOG entry.
- **v07.65r — the follow-up turn:**
  - **The F-I1 paste-in prompt**, saved as **§6 of `phase-f-action-plan.md`** for Opus 5.5 xhigh (BlackRock with GIP, AIP and HPS; KKR). §3 row 4 now points to it, and the status line records it.
  - **Its reconciliation counts were measured, not copied.** A word-bounded alias grep gives BlackRock 40 raw hits, 7 of them collisions:
    - 'AIP' is also American Intelligence & Power (`caterpillar`, `rehlko`, `nscale`), Palantir's AIP (`mccarthy`) and AIP Management (`rosendin`).
    - 'GIP' is Infineon's Green Industrial Power segment.
    - 'HPS' is Prevalon's Hybrid Power Stabilizer.
    - That leaves about 33 for BlackRock and 19 for KKR. No edge to either slug exists yet, and `microsoft` does not name AIP at all.
  - **What the prompt carries:**
    - F-N1's lessons: archive-based counts, the EDGAR block, the concept-registry rule, pins left loud with a reason, the overlay-close note for Playwright.
    - A flag that the ledger's own 'ECP announced 30 Oct 2024' correction is unverified.
    - A defer-not-skim rule for BlackRock's reconciliation.
    - A Megmeet paragraph ask: which controlled platforms buy MV or DC gear, and whether capital is a door or a directory.

### Does any of the three sign for MV or DC power equipment? (the Megmeet paragraph)

None of the three has signed for an SST, 800 VDC or HVDC equipment on the record, and only Firmus names a power-equipment supplier at all (JLE for its Australian power trains; Eaton's EnergyAware platform under its UPS). The nearest thing to a DC opening is **G42's Khazna**, the group's buyer, which signed a memorandum with Siemens on 15 Sep 2026 to 'continue to progress next-generation 800 VDC power architectures'. That is engineering intent, not an award, and the one recorded conversation belongs to an incumbent. Stargate UAE's first-phase long-lead equipment is already bought, so the door is the next 800 MW, Khazna's more-than-1 GW pipeline, and any redesign the reported dispersal across the UAE forces. **HUMAIN** buys through its EPC contractor (MIS, under HUMAIN work orders) and through partners, to 'robotic, modular' lowest-total-cost designs. An SST seller has to be accepted into the design by HUMAIN and its advisers, then win the contractor's purchase order, and US chip licences, not power, pace how fast that demand arrives. **Firmus**'s Australian power train is locked to JLE, so the entries there are as a tier-2 supplier to JLE, the Wesley Vale behind-the-meter battery trial (the DC side of a backup design), and the Batam and Malaysian Vera Rubin sites, which the exclusivity does not reach. Net for an SST seller: no reference customer among the three yet; one live 800 VDC conversation, held by Siemens; and two buyers whose doors run through intermediaries.

### Where we left off

- **Status:** v07.64r is merged, and v07.65r is pushed at close; the tree is clean.
- **Next (action plan):** F-I1 (BlackRock, KKR) at xhigh, Mon 9/28 – Tue 9/29. The prompt is in **§6 of `phase-f-action-plan.md`**. BlackRock's ~33 substantive inbound dossiers make step 7 the heavy part, and the prompt allows deferring the remainder by name.
- **Dated items:**
  - CoolIT cooling recheck on or after Mon 9/28.
  - 9/30 Classroom run check after ~7:30 AM ET on Wed 9/30.
  - Neoclouds pass + `profiler Habitat Energy` on or after Thu 10/1 (rebase first — the 10/1 Profiler Routines commit that day).
  - Dominion reframe and **Classroom wave A** Fri 10/2 – Tue 10/6.
  - Megmeet start Wed 10/7.
  - Firmus prospectus 8 Oct and listing 22 Oct (reported). On listing, its calendar row moves to the public rule.
- **Stale and not yet re-authored (Classroom.gs untouched, by design):**
  - `landscape-neoclouds-2026-09`: the roster went from seven to ten (+Firmus, +HUMAIN, +G42), and `scenario-neoclouds-discovery` goes stale with it.
  - `landscape-aidc-developers-and-landlords-2026-09`, further: +G42 as a challenger, +Firmus and +HUMAIN as adjacent. This is on top of Chindata, `tract` v4, `powerhouse-data-centers` v3 and the `terawulf` v8 edge. Its two `scenario-aidc-developers-and-landlords-*` rehearsals were already stale.
  - Classroom wave A re-authors them.
  - `build-classroom-segments.py --check`: **14 due**, 12 with section changes and 2 pin-only (`capital`, from `mgx` v3; `insurance-and-risk-transfer`). `neoclouds` now differs in eight sections.

### Key decisions made

- **G42 is one group slug.** G42 controls Khazna, the BIS approval and Stargate UAE sit at group level, and the corpus uses the names interchangeably; Khazna and Core42 live in `aka[]`.
- **HUMAIN is a neocloud, not a hyperscaler.** Its own cloud is 1.1 MW; it builds capacity and lets it to others.
- **Firmus is private** until it lists; its category is neocloud.
- **§11.1 buying authority:**
  - **Firmus:** buys its own chain — it owns its connection substations, applies for its generators, and runs UPS and batteries through Synert. In Australia the power train is exclusive to JLE.
  - **HUMAIN:** owner and grid counterparty. The EPC contractor, or the partner, places the equipment orders.
  - **G42:** Khazna is the buyer; Core42 leases.
- **The `revenue-share` concept was left alone.** Its definition is BESS-optimiser-specific, so HUMAIN's guide defines 'revenue-sharing arrangement' in its own glossary rather than editing a shared entry that Classroom lessons may pin.
- **The `oracle` pin on the named-project report was left loud.** It is pinned at v4, and v5 was an earlier session's substantive refresh (summary, developments, strategy, financials) that a pin note cannot vouch for. This session's v6 only added the G42 edge and its source.

- **Same-session save:** 'remember session' extended this Latest entry in place rather than moving it down, because it was already this session's hand-off (the F-H1 precedent).

### Known issues

- **Dates to re-check, because these rows flip rather than drift:**
  - Firmus's Benmax completion (expected by end-September) and its listing.
  - HUMAIN's Aramco stake (EC-cleared, not completed).
  - G42's 6 Apr 2027 sunset, and any US vehicle.
- **One-way edges:** the new dossiers point at `eaton`, `supermicro`, `blackstone`, `coreweave`, `iren` and `amazon`, which do not point back. They show as inbound evidence in the graph and were not revised this session.
- **Two pin warnings** on the 9/8 reports (`jinko` v6, `oracle` v6), read and left loud.
- **Pre-existing:** NVIDIA's Relationships tab shows four literal `**`. They come from other dossiers' inbound curated contexts, not from this session's edges; the graph holds 127 `**` both before and after this session. Not fixed here.
- **README archive tree:** the older unlisted archive files (about 60) are still missing. This session added only its own eight.
- **Carried over:**
  - The ERCOT/PJM decision still awaits the developer.
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2).
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.
  - `study-prep/zhonhen/zhonhen-interview-brief.md` still calls Panama an SST in two lines.
  - The study-guide PDF renderer is not in the repo.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 188 dossiers, 188 guides, 1,539 concepts, 1,610 graph edges (1,217 curated). **CHANGELOG** `Sections: 91/100`.

### Recommendation for next session

- Run **F-I1 (BlackRock, KKR)** in a fresh Opus 5.5 session at **xhigh**, Mon 9/28 – Tue 9/29, using the prompt in **§6 of `repository-information/phase-f-action-plan.md`**, so both capital dossiers exist before Classroom wave B re-authors `landscape-capital-2026-09` by 10/14.

**To continue:** paste the prompt in §6 of `repository-information/phase-f-action-plan.md` into a fresh Opus 5.5 session set to xhigh
