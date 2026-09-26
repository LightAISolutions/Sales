# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 94/100`

## [Unreleased]

*(No changes yet)*

## [v07.68r] — 2026-09-26 05:05:03 PM EST

> **Prompt:** "1. SEC contact: <LightAISolutions Profiler Research> <jonyang92@gmail.com>
> 2. Looks good.
> 3. I approve of your recommendation.
> 4. Good.
> 5. Keep the newer one and dismiss the older one.
> 6. Good."

The developer's answers to v07.67r: the SEC contact supplied, the DigitalBridge fallback approved, and the older 9/30 reminder dismissed.

### Fixed

- **`scripts/check-source-reachability.py` — SEC now answers.** SEC hosts get a new `SEC_USER_AGENT`, `LightAISolutions Profiler Research` plus the contact email the developer supplied for this purpose. Every other probed host keeps the neutral `USER_AGENT`, so the address goes to SEC only. The file's own rule, never to send a personal address to third-party hosts, still holds for them.
  - **Verified:** the probe's verdict is **OK** for the first time since v04.91r: `sec.gov` 200, `data.sec.gov` 200, and the ASX, LSE and NVIDIA control hosts 200.
  - The probe's 403 message no longer blames 'this network'; it points at `SEC_USER_AGENT`. The docstring carries a dated amendment.

### Changed

- **`.claude/rules/profiler-app.md`** (Profiler Command, the probe step) — records that the v04.91r 'block' was SEC refusing a `github.io` contact. Every request to `sec.gov` or `data.sec.gov`, a subagent's curl included, now sends the exact `SEC_USER_AGENT` string read from the script, and only to SEC hosts.
- **`PROFILER-SCHEMA.md`** — the disclosure-tier note carries the same correction.
- **`profiler-refresh-notes.json`** — BlackRock's access note records the fix.
- **`phase-f-action-plan.md`** — row 10's DigitalBridge fallback is marked recommended and approved: move `scenario-capital-objection`'s reviewBy to Fri 11/6 if the close has not happened by Wed 10/7, with the 10/30 backstop.
- **`REMINDERS.md`** — the 2026-09-24 09:54 PM reminder to check the 9/30 Classroom run moved to Completed Reminders, dismissed by the developer. The 2026-09-26 01:21 AM reminder covers the same check and stays active, unchanged.

### Notes

- The paste-in prompts kept 'as run' in `phase-f-action-plan.md` still mention the EDGAR block. They are records of what was sent, so they were not rewritten.
- No page changed, so no page version bump.

## [v07.67r] — 2026-09-26 04:52:03 PM EST

> **Prompt:** "1. What kind of contact address does SEC need? An email or mailing address? Give me the format to give it to you in.
> 2. I approve the small Profiler page fix. Execute.
> 3. If DigitalBridge hasn't happened by 10/7, then move the review date later. Recommend how much later.
> 4. I definitely want to cover ERCOT and PJM as grid operators as they are two of the biggest ones I am familiar with.
> 5. What are the reminders and their differences?
> 6. List the 60 older archive files in a housekeeping pass."

The follow-up to F-I1's evaluation: the approved Profiler bold fix, the README archive backfill, and the developer's decisions on ERCOT/PJM and the DigitalBridge fallback, recorded in the plans.

### Fixed

- **Profiler v01.93w — `**` now renders as bold wherever dossier prose is appended after a label.** Five paths inserted text as a raw text node, so house-style bold printed as literal asterisks:
  - the Relationships tab's 'Mentioned in X's dossier' evidence excerpts;
  - the Capabilities tab's Positioning, Sold through, Target segments and Roadmap rows;
  - the Policy tab's Mitigation lines;
  - the Ecosystem explorer's quote and tie lines.
  - All five now go through one helper, `ovAppendRich`, which reuses `ovSetText` through a document fragment: no wrapper element, no `innerHTML`. An excerpt with an odd number of markers (cut mid-bold) has them stripped rather than bolding the wrong run.
  - **Verified with Playwright:** 16 dossiers that showed literal `**` before (`blackrock`, `kkr`, `cyrusone`, `brookfield`, `macquarie`, `blackstone`, `jupiter-power`, `mgx`, `aligned`, `nvidia`, `vistra`, `compass-datacenters`, `aon`, `clearway-energy`, `eolian`, `meta`) now show none on any tab. BlackRock's evidence shows 4 bold runs, and the explorer shows 0 literal markers and 16 bold runs. Zero page errors; the page reports v01.93w.
  - `Profilerhtml.changelog.md` gains v01.93w. The file sits at its 50-section cap, so the oldest date group (v01.43w, 2026-08-27) moved to `Profilerhtml.changelog-archive.md` with its commit link (`9d8b671`), as the v07.50r rotation did.

### Changed

- **README tree — the 63 unlisted archive files are now listed**, so all 447 archived dossier versions (plus `archive-index.json`) appear. Each sits in version order beside its company's other entries, or alphabetically where the company had none. Eight long legal-name labels were shortened to the dossier's short name, two of them on existing lines (Invenergy, McCarthy). The README tree also shows Profiler at v01.93w.
- **`phase-f-action-plan.md`:**
  - **ERCOT and PJM approved** (developer, 2026-09-26) for coverage as grid operators, in a new `grid-operator` category rather than `other`. Two sessions, ERCOT first, because 73 inbound dossiers is a larger step 7 than all of F-I1. The category change (schema note, category list, Profiler page) is made in the ERCOT session. Row 21 and the note under Stage 3 are rewritten; the totals now count two grid-operator sessions.
  - **DigitalBridge fallback on row 10:** if the close has not happened by Wed 10/7, `scenario-capital-objection`'s reviewBy moves from 10/14 to **Fri 11/6**, the date `landscape-capital-2026-09` already carries, so the two are re-authored together. If it still has not closed by Fri 10/30, wave B runs without SoftBank and Blue Owl.
  - The status line records both decisions.
- **`PROFILER-COVERAGE-PLAN.md` §11** — the 'held for a developer decision' paragraph and the two held ERCOT/PJM ledger rows now read approved, with the new category.

### Notes

- **SEC contact format, from SEC's own 'Accessing EDGAR data' page:** `User-Agent: Sample Company Name AdminContact@<sample company domain>.com`. That is a name and an email address; no mailing address is asked for. Tested on 26 Sep with placeholder mailboxes: a `github.io` contact gets 403 from `data.sec.gov` and `www.sec.gov`, while `gmail.com`, `outlook.com` and `acme.com` contacts get 200. The only place the contact lives is `USER_AGENT` in `scripts/check-source-reachability.py`, which stays unchanged until the developer supplies an address.
- **DigitalBridge, as of 26 Sep:** DigitalBridge announced on Tue 22 Sep that every regulatory approval had been received and that the deal was expected to close within five business days (by Tue 9/29). Completion is not yet confirmed; the fallback applies only if it slips.
- **Reminders were not changed.** They are the developer's; the two overlapping 9/30 entries were described, not edited.
- `Classroom.gs` was not edited; the 11/6 move is conditional and dated 10/7.

## [v07.66r] — 2026-09-26 07:19:39 AM EST

> **Prompt:** "Picking up from my last session, run Phase F session F-I1 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: BlackRock (with GIP, AIP and HPS)
> and KKR — the two most-cited capital names the corpus does not yet cover. This session runs on Opus 5.5
> at xhigh. The §11.3 Model cells already read "Opus 5.5 xhigh"; keep them.
>
> WHY NOW: BlackRock is the most-cited uncovered company in the corpus, and both dossiers must exist
> before Classroom wave B re-authors landscape-capital-2026-09 and scenario-capital-objection (reviewBy
> 10/14). There is no other date gate. Do NOT run F-I2 (SoftBank, SB Energy, Blue Owl) — it waits on the
> DigitalBridge close — and do not run the 10/1 neoclouds pass or `profiler Habitat Energy`.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/phase-f-action-plan.md
> (§5 and the F-N1 outcome are the latest pattern); PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the two
> F-I1 rows of §11.3 are yours; §11.1's buying-authority test applies through the platforms each
> controls); .claude/rules/profiler-app.md (Profiler Command including step 1a identity and step 7
> reconciliation, Profiler Prep Command, Scheduled Refreshes); repository-information/PROFILER-SCHEMA.md
> (Naming and renames, Segments registry, Refresh calendar); repository-information/PROFILER-STYLES.md
> (active style). Read the blackstone, brookfield, macquarie and mgx dossiers and study guides as the
> house pattern for a capital-segment incumbent, and the aligned, cyrusone, stack-infrastructure,
> eolian, vistra and aep dossiers — they carry the platforms these two control or co-own.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Proposed slugs: blackrock, kkr. Category hypothesis:
> ["investor"] for both. Populate aka[] BEFORE the step-7 grep, including the platforms and brands the
> corpus uses: BlackRock — Global Infrastructure Partners / GIP, AI Infrastructure Partnership / AIP, HPS
> Investment Partners, BlackRock Climate Infrastructure, and any controlled developer you establish
> (Akaysha Energy is named in dnv as BlackRock's); KKR — Kohlberg Kravis Roberts, Global Atlantic, and
> its named infrastructure vehicles. Assign segments in
> live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: capital ·
> incumbent for both; the segment has eight members today). Then the registry sync, the graph build, a
> calendar row per company under the Refresh calendar rules (both are NYSE-listed — BLK and KKR — so take
> each next results date from its own IR site, and mark it unconfirmed until it is announced), README
> tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — establish each of these, do not assume it:
> - BlackRock: one slug for BlackRock, Inc. with GIP, AIP and HPS in aka[], or a separate GIP slug?
>   Decide under Naming and renames and say why — GIP is the platform that controls most of the buyers.
>   Establish when the GIP acquisition closed, AIP's current members and legal form, and whether the HPS
>   and Preqin acquisitions have closed.
> - KKR: KKR & Co. Inc.; which KKR vehicles hold its data-centre and power platforms; Global Atlantic's
>   status.
> - For both: list the platforms each controls or co-controls that sign for batteries, MV gear,
>   generation or SSTs (§11.1 test 2), with the ownership share and a source for each. An investor that
>   buys nothing itself passes the test through a platform it controls, and fails it through one it
>   merely funds.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify against first-party sources
> (10-Ks, 10-Qs and results releases from each company's own IR site, counterparties' filings and
> releases, regulator records), record a premise verdict per clause, and rewrite the cells. Run these
> checks hardest:
> - BlackRock: GIP owned since 1 Oct 2024; Aligned bought via AIP with MGX (closed 21 Jul 2026, ~$40B EV,
>   6.4 GW); the AES take-private with EQT (signed 2 Mar 2026, pending) — check who the acquirers are;
>   ALLETE co-control with CPP (closed 15 Dec 2025); Eolian (GIP-backed); exclusive talks for STACK's
>   Asia-Pacific portfolio (~1.1 GW, reported 24 Sep — a report, not a deal); the NVIDIA
>   compute-financing MOU (10 Aug). And the flagged conflict: whether GIP still holds its CyrusOne stake.
> - KKR: CyrusOne 50% with GIP (2022); STT GDC 75% (closed 2 Sep 2026); Helix Digital Infrastructure,
>   more than $10B (Jun 2026, Vistra as preferred power supplier); EDF power solutions North America,
>   $4.2B, pending (5.6 GW including storage); 19.9% of the AEP Ohio and I&M transmission companies. The
>   cell says the ECP $50B partnership was "announced 30 Oct 2024, not 2026" — that correction is itself
>   unverified; read the release and record the date it gives.
> Record the §11.1 buying-authority verdict for each, through its controlled platforms.
>
> RECONCILIATION (step 7) — measured 2026-09-26 by word-bounded alias grep. BlackRock has 40 raw hits, of
> which 7 are known collisions, not inbound: "AIP" is also American Intelligence & Power (caterpillar,
> rehlko, nscale), Palantir's AIP (mccarthy) and AIP Management (rosendin); "GIP" is Infineon's Green
> Industrial Power segment (infineon); "HPS" is Prevalon's Hybrid Power Stabilizer (prevalon). That
> leaves about 33 for BlackRock; KKR has 19. No dossier carries an edge to either slug yet. Grep again
> with the full aka[] and read every hit. Add the reciprocal edge wherever a new dossier curates a
> counterparty, revising that dossier under the Archival Procedure and re-verifying any report pin on it.
> Check microsoft, nvidia and xai for a missing AIP edge — microsoft does not name AIP at all today.
> THIS IS THE HEAVY PART. If BlackRock's reconciliation outgrows the session, land both dossiers and
> guides, reconcile KKR in full and BlackRock's controlled or co-owned platforms first, and record every
> remaining slug by name as deferred in the ledger and the SESSION-CONTEXT hand-off. Defer rather than
> skim (profiler-app.md step 7, scope note).
>
> LESSONS FROM F-H1 AND F-N1 — apply them:
> - Every counterparty named in narrative prose rests on a source in sources[], ideally its own filing.
> - A tender, an MOU, "exclusive talks" or a signed-but-not-closed deal is not a completed transaction.
>   Type each on the record's own word and state the gap. An unattributed figure is stated as unverified.
> - Count inbound hits against the pre-revision copies (the archive), so the ledger's counts are exact.
> - sec.gov and data.sec.gov were blocked from the sandbox in both prior sessions. Run
>   check-source-reachability.py first; if EDGAR is blocked, read the filings from the companies' IR
>   sites and say so in the dossier.
> - Do not edit an existing concept in profiler-concepts.json. Where a registry definition is
>   domain-specific (revenue-share is written for battery optimisers), use a guide glossary term instead.
>   Check new terms and aliases for collisions before adding them.
> - Write each lesson plan and study guide skeleton-first, then Edit (Incremental Writing, item d).
> - Re-verify a report pin on a dossier you revise only if your change is edge-only. When an earlier
>   revision was substantive, leave the pin loud and write down why.
> - If an existing study guide contradicts a verified finding, correct it minimally and record it.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The two new members make landscape-capital-2026-09
> (built on "4 of 8 buy nothing") and scenario-capital-objection (reviewBy 10/14) stale, along with any
> other segment you add them to. Record that in the CHANGELOG entry and the SESSION-CONTEXT hand-off
> (§11.2, the landscape coupling); Classroom wave B re-authors them.
>
> FOR THE MEGMEET JOB: in the SESSION-CONTEXT hand-off, write one short paragraph on which platforms these
> two control that buy medium-voltage or DC power equipment (SSTs, 800 VDC, HVDC, batteries), and whether
> capital is a door an SST seller can use or only a way to find the buyers.
>
> VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
> build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new and revised dossier and guide renders under Playwright with zero page errors
> other than the sandbox's gis_load_failed (the guide overlay closes with its ✕ button, not Escape).
> CHANGELOG rotation only if non-exempt sections reach 100. Normal Pre-Commit and Pre-Push checklists;
> one commit; push on a claude/* branch."

Phase F session F-I1: dossiers, study guides and lesson plans for **BlackRock** (with GIP, AIP and HPS) and **KKR**, the two most-cited capital names the corpus did not cover, and a step-7 reconciliation that revised 28 inbound dossiers.

### Added

- **Two schema v7 dossiers** (`profileVersion` 1, intel-briefing style), each researched by two parallel subagents under the two-stage protocol. `check-source-reachability.py` ran before Stage 2 was planned: **PARTIAL** — `sec.gov` and `data.sec.gov` blocked, the IR sites and the other probed hosts reachable. Filings were read from the companies' IR sites and from EDGAR full-text search (`efts.sec.gov`), which answers.
  - **`blackrock.profile.json`** — `categories: ["investor"]`; 80 sources (54% first-party), 22 developments, 8 product lines, 4 technical specs, 23 relationships, 11 decision makers (all with photos), 4 policy entries.
    - **Identity — one slug.** The registrant is BlackRock, Inc. (NYSE: BLK; CIK 0002012383), the holding company formed on the GIP closing date; the former BlackRock Inc. is now BlackRock Finance, Inc. GIP is Global Infrastructure Management, LLC, a wholly owned subsidiary: it files no separate accounts, BlackRock reports one segment, and the European Commission names GIM 'ultimately controlled by BlackRock'. AIP is a capital partnership that BlackRock, GIP, Microsoft and MGX launched on 17 Sep 2024 (NVIDIA and xAI joined on 19 Mar 2025, the Kuwait Investment Authority in June 2025). On Aligned, the European Commission names GIM and MGX, not AIP, as the acquirers of joint control, so AIP gets no slug of its own. HPS (closed 1 Jul 2025) and Preqin (closed 3 Mar 2025) are wholly owned. All of it sits in `aka[]`.
    - **The read:** BlackRock signs for no equipment itself. Its GIP-branded funds own or co-own Aligned (joint control with MGX, closed 21 Jul 2026), CyrusOne (with KKR), Coravel (with ACS), ALLETE and Minnesota Power (with CPP Investments), Clearway Energy Group (with TotalEnergies), Eolian and Jupiter Power, and lead the AES take-private. **A directory of buyers, not a door.**
  - **`kkr.profile.json`** — `categories: ["investor"]`; 76 sources (49% first-party), 23 developments, 7 product lines, 4 technical specs, 14 relationships, 12 decision makers (all with photos), 3 policy entries.
    - **Identity:** KKR & Co. Inc. (NYSE: KKR; CIK 0001404912). Global Atlantic has been wholly owned since 2 Jan 2024 and is reported as the Insurance segment, so it sits in `aka[]` with Helix, STTGDC, ContourGlobal, Zenobē, Avantus and Encavis. KKR is a controlled company until a Sunset Date no later than 31 Dec 2026.
    - **The read:** KKR signs for no equipment itself either, but its platforms reach every layer this corpus sells into: STTGDC (75%, completed 2 Sep 2026), CyrusOne (co-owned with GIP), Helix Digital Infrastructure (launched 11 Jun 2026), ContourGlobal and Avantus.
- **Two schema v2 study guides**, 14 sections each, with flashcards and a self-test on concepts only: `blackrock.study.json` (plus local glossary terms 'buying-authority test' and 'HSR') and `kkr.study.json` (plus 'first-look right', 'preferred power partner', 'reserved matters' and 'strategic buyer').
- **Two lesson plans** under `repository-information/study-prep/<slug>/`, eight modules each, paced to the 2026-10-07 start. Both were written skeleton-first and filled in by Edit.
- **16 new concepts** in `profiler-concepts.json` (1,555 total), each checked for term and alias collisions against the registry:
  - Funds and markets: `index-fund`, `exchange-traded-fund`, `open-ended-fund`, `core-infrastructure`, `private-credit`, `annuity`.
  - Ownership disclosure: `schedule-13d`, `schedule-13g`.
  - Deals: `consortium`, `exclusive-talks`, `definitive-agreement`, `outside-date`, `deferred-consideration`.
  - Regulation and wires: `ferc-section-203`, `blanket-authorization`, `transmission-company`.
  - No existing entry was edited.
- **23 executive photos** in `live-site-pages/images/execs/` (`blackrock-*` 11, `kkr-*` 12), all company-published leadership-page images, converted to JPEG at 600 px or less.
- **28 archive files** (one per revised dossier, below), each with an `archive-index.json` entry.
- **10 accepted relationship pairs** in `profiler-relationships-accepted.json` (20 total): the other↔other edges between the new dossiers and `amperesand`, `aon`, `edgecore`, `excelsior-energy-capital`, `fluence`, `intersect-power`, `stack-infrastructure` and `talen-energy`, each with its reason.

### Changed

- **28 inbound dossiers revised under the Archival Procedure** (step 7: the reciprocal edge for each counterparty the new dossiers curate). Each gains the edge, plus a source in `sources[]` where the edge needed a new one; no other field changed except where noted:
  - **Both new slugs:** `cyrusone` v1→v2 (investors `kkr` and `blackrock`), `nvidia` v11→v12 (partners), `stack-infrastructure` v7→v8 (other, announced; adds Bloomberg's 24 Sep report of AIP and IFM exclusive talks), `blackstone` v1→v2, `brookfield` v2→v3 and `macquarie` v1→v2 (competitors; `macquarie` adds Infrastructure Investor's 2026 ranking), `fluence` v9→v10 (other).
  - **BlackRock only:** `aligned` v7→v8, `mgx` v3→v4, `microsoft` v5→v6 and `xai` v5→v6 (AIP partners — `microsoft` and `xai` named AIP nowhere before), `clearway-energy` v1→v2, `eolian` v6→v7, `jupiter-power` v6→v7, `aes-clean-energy` v2→v3 (investor, announced), `recurrent-energy` v1→v2, `meta` v9→v10 (partner, announced — the El Paso venture), `talen-energy` v2→v3, `excelsior-energy-capital` v1→v2, `edgecore` v1→v2, `intersect-power` v2→v3, `marsh-mclennan` v1→v2 (customer).
  - **KKR only:** `vistra` v3→v4 (partner — Helix), `aep` v1→v2 (investor — the 19.9% transmission stake), `compass-datacenters` v5→v6, `coolit` v1→v2 (investor, historical), `aon` v1→v2, `amperesand` v2→v3 (other — the STTGDC testbed).
  - **Three corrections, not just edges:**
    - `aes-clean-energy` — the Ohio commission approved the change of control on 17 Sep 2026; the summary, two strategy judgments and one policy entry said it was pending. The open question of which FERC dockets apply is closed (EC26-99, EC25-12-001, EC16-77-005). One development and two sources added.
    - `fluence` — one strategy judgment corrected to match (Ohio approved; FERC and New York outstanding), with the PUCO source.
    - `jupiter-power` — the ownership text said 'backed by GIP' with a quote that no Jupiter page carries; Jupiter's site and 2026 releases name no owner. Reworded, and the GIP link now rests on BlackRock's side of the record.
- **`mgx.study.json`** — one clause corrected: it said AIP 'owns Aligned'. It now says AIP is named as Aligned's buyer, while the EU merger clearance (Case M.12259) names GIP's manager and MGX as the joint controllers — the verified finding, and what the `macquarie` guide already said. `lastUpdated` 2026-09-26.
- **`profiler-companies.json`** — 188 → 190 entries. Taglines, `aka[]` (GIP, AIP, HPS, Preqin, iShares, Aladdin and the platform and legal names for BlackRock; Global Atlantic, Helix, STTGDC, ContourGlobal, Zenobē, Avantus, Encavis and the bid vehicles for KKR) and `domains[]` were populated **before** the step-7 grep. The sync pass reconciled `srcTotal`, `srcFirstPct` and `segments`.
- **`profiler-segments.json`** — `capital`: `blackrock` and `kkr` as incumbents, each with a basis line. The roster goes from eight to ten.
- **`profiler-graph.json`** — rebuilt: 1,656 edges (1,253 curated), 4,923 evidence records.
- **`profiler-refresh-calendar.json`** — both public (NYSE), `cadence: quarterly`: `blackrock` next results **2026-10-13** and `kkr` **2026-10-29**, both `confirmed: false` until each company announces its date. **`profiler-refresh-notes.json`** — a source and a `watch[]` list per slug.
- **`report-pins-verified.json`** — five edge-only revisions re-verified: `aep` (v1→v2), `meta` (v9→v10), `stack-infrastructure` (v7→v8) and `xai` (now at v6) on `named-project-bess-attach--opportunity--2026-09-08`, and `amperesand` (v2→v3) on `sst-hall-edge-block-rev2--competitive--2026-09-23`. Every cited source is unchanged in each.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — both F-I1 rows rewritten as verified cells, with a premise verdict per clause, the inbound count and the §11.1 buying-authority answer; Model **Opus 5.5 xhigh** kept; `Checked 2026-09-26, v07.66r`; Dossier v1; Guide v2. The verdicts:
  - **BlackRock** — eight clauses: 4 held (one as MOUs), 2 refined, 1 reported only, 1 flagged conflict settled.
    - Aligned via AIP — **held on the figures, refined on control**: EC Case M.12259 names GIM and MGX as acquirers of joint control; AIP is not a notifying party.
    - AES 'signed 2 Mar' — **refined**: signed 1 Mar by GIP and EQT Infrastructure VI; GIP-managed vehicles would hold 56.625%; FERC and New York pending, outside date 1 Jun 2027.
    - STACK Asia-Pacific talks — **reported only**: Bloomberg names AIP and IFM, not GIP; no party confirmed.
    - The CyrusOne conflict — **settled: GIP still co-owns it**; no first-party source states 50:50.
  - **KKR** — six clauses: 3 held, 3 refined. CyrusOne 50% **refined** (co-ownership held, the split unstated); Helix **refined** (a company, not a fund; more than USD 10bn of *commitments*); EDF power solutions **refined on scope** (5.6 GW of 'net renewable capacity', storage not stated).
- **`phase-f-action-plan.md`** — the status line records F-I1 as landed and the capital modules as stale.
- **README.md** — tree entries for the two profile/study pairs, the two study-prep directories and the 28 archive files, plus the timestamp and repo version.
- **`SESSION-CONTEXT.md`** — a new Latest Session (the F-I1 hand-off, with the Megmeet paragraph). The F-N1 entry (v07.64r–v07.65r) moved to Previous, and the F-H1 entry (v07.62r–v07.63r) dropped under the two-session cap.

### Notes

- **Step-7 reconciliation**, grepped with the full `aka[]` against the pre-revision copies. Nothing was deferred.
  - **BlackRock: 42 raw hits.**
    - 9 are collisions: 'AIP' as American Intelligence & Power (`caterpillar`, `rehlko`, `nscale`), Palantir's AIP (`mccarthy`) and AIP Management (`rosendin`); 'GIP' as Infineon's segment; 'HPS' as Prevalon's product; and Hut 8's generic 'AI Infrastructure Partnership' headline (`anthropic`, `hut-8`), two the brief did not list.
    - 4 are career-only (`aon`, `aypa-power`, `gridstor`, `iren`).
    - 29 were read: 20 revised, 9 unchanged (`canadian-solar`, `digital-realty`, `dnv`, `galaxy-digital`, `google`, `grid-united`, `hunt-energy-network`, `rwe-clean-energy`, `trina-storage`). `microsoft` and `xai` were revised as well, for the AIP edge they lacked.
  - **KKR: 26 raw hits** (the platform names added 7 to the brief's 19). 4 are career-only (`aypa-power`, `dg-matrix`, `fermi-america`, `strata-clean-energy`). 22 were read: 13 revised, 9 unchanged (`arevon`, `bytedance`, `digital-realty`, `dnv`, `firmus`, `mgx`, `oncor`, `recurrent-energy`, `terra-gen`).
  - No inbound claim contradicted KKR's dossier. One figure is left unreconciled and stated on both sides: Bosque County, where CyrusOne says USD 1.2bn and KKR about USD 4bn.
- **§11.1 buying authority:**
  - **BlackRock, Inc. signs for nothing.** It passes only through the platforms its funds control or co-control (Aligned, CyrusOne, Coravel, ALLETE, Clearway Energy Group, Eolian, Jupiter; AES on closing). It fails through Recurrent (a minority preferred stake), EdgeCore and Intersect (lender), its index stakes, the NVIDIA MOUs and the STACK talks.
  - **KKR** passes the same way, through STTGDC, CyrusOne, ContourGlobal, Avantus and, once closed, EDF power solutions North America. ContourGlobal signed for 3 GWh of CATL batteries (10 Aug 2026) and Avantus bought an 800 MWh Fluence system (July 2026).
  - **The one DC-power programme on record** at either firm is STTGDC's HVDC testbed with LITEON and Amperesand, whose SST deployment STTGDC names as its plan for future Singapore sites. No SST, 800 VDC or HVDC purchase is on record at any BlackRock platform.
- **SEC access, a finding for the probe, not a block:** `www.sec.gov` and `data.sec.gov` return 403 to a User-Agent whose contact address sits on a `*.github.io` domain — the one `check-source-reachability.py` sends — and 200 to the same request with another contact domain. The 'network-keyed EDGAR block' recorded since v04.91r is a User-Agent rejection. The probe was **not** changed: SEC's fair-access policy wants a real, monitored contact address, which only the developer can supply.
- **Report pins left loud, with the reason:**
  - `fluence` v10 on `grid-scale-bess--competitive--2026-09-08` — this revision corrected a strategy judgment (the Ohio approval), which is substantive, so a pin note cannot vouch for it.
  - `jupiter-power` v7 on `named-project-bess-attach--opportunity--2026-09-08` — the ownership text was corrected, also substantive.
  - `jinko` and `oracle` — pre-existing.
- **Existing study guides checked for contradictions:** twelve guides name BlackRock, GIP, AIP, KKR or a KKR platform. Eleven agree with the new dossiers; `cyrusone`'s caution that BlackRock 'is not itself a CyrusOne owner' in the 'GIP-owned' sense matches the funds-managed wording of the new edge. One was corrected (below).
- **Classroom lessons now stale, by design — `Classroom.gs` was not edited:**
  - `landscape-capital-2026-09` was built on '4 of 8 buy nothing'. The `capital` roster is now 10, and both new incumbents buy nothing themselves and pass §11.1 only through platforms they control.
  - `scenario-capital-objection` (reviewBy 10/14) goes stale with it.
  - Classroom wave B re-authors both, after F-I2 adds SoftBank and Blue Owl.
  - `build-classroom-segments.py --check` now shows **17 due**: 15 with section changes (`capital` differs in eight sections) and 2 pin-only (`clean-firm-and-nuclear`, `storage-developers-and-ipps`).
- **Checkers:**
  - `sync-profiler-registry.py --check` — clean (190 in bijection, calendar included).
  - `check-profiler-study.py` — 0 errors, 0 warnings (190 guides, 1,555 concepts).
  - `check-profiler-relationships.py` — 0 findings (20 accepted pairs).
  - `check-profiler-crossrefs.py` — 0 candidates across 529 pairs.
  - `check-readme-tree.py` — 0 findings.
  - `check-profiler-reports.py` — 0 errors and four warnings, read and left loud as above.
- **Playwright:** 30 dossiers (the two new ones and the 28 revised) render on `Profiler.html` with every tab, and the `blackrock`, `kkr` and corrected `mgx` study guides open and close with the ✕ button. **Zero page errors.** The only console lines are resource failures on `script.google.com`, the GAS backend the sandbox cannot reach, the same class as `gis_load_failed`. The harness hides the auth wall and sets the admin UI role in `localStorage` so the tabs and the Study guide button are reachable.
  - **No literal `{{` or `**` in the new guides**, and none in any tab of the new dossiers except the Relationships tab's inbound evidence.
  - **Inbound evidence shows raw `**`.** The 'Mentioned in X's dossier' panel inserts each excerpt as a text node, so the house-style bold labels ('**BOTTOM LINE UP FRONT:**', '**Collection gaps:**') print literally. Rendered against a HEAD checkout, the only differences are on the Relationships tab of seven revised dossiers (`mgx` +4, `aligned` +2, `clearway-energy` +2, `cyrusone` +10, `eolian` +4, `jupiter-power` +4, `meta` +2), all excerpts of the new BlackRock and KKR text. The graph holds 390 `**` against 336 at HEAD. This renderer gap is pre-existing (NVIDIA shows the same). The house style was not changed; the fix belongs in `ovRelEvidList` in `Profiler.html`, a page change outside this session.
  - `Profiler.html` is unchanged (data-only), so there is no page version bump.
- **Not run here, as instructed:** F-I2 (SoftBank, SB Energy, Blue Owl — it waits on the DigitalBridge close), the 10/1 neoclouds pass and `profiler Habitat Energy`.
- **No rotation:** 92 sections, under the trigger.

## [v07.65r] — 2026-09-26 06:03:22 AM EST

> **Prompt:** "give me the prompt to paste into a new Opus 5.5 xhigh session to run F-I1, then remember session"

The follow-up to F-N1: the F-I1 paste-in prompt, with reconciliation counts measured on the current corpus, and the session saved.

### Added

- **`phase-f-action-plan.md` §6 — the F-I1 paste-in prompt** (BlackRock with GIP, AIP and HPS; KKR) for Opus 5.5 **xhigh**. It follows §5's F-N1 prompt:
  - **Identity:** it asks whether GIP gets its own slug or sits in BlackRock's `aka[]`, and asks for the §11.1 verdict **through each firm's controlled platforms**.
  - **Hardest checks:** it names the ledger clauses to verify first, including the flagged CyrusOne conflict. It notes that the ledger's own "ECP announced 30 Oct 2024" correction is unverified.
  - **Reconciliation counts, measured on 2026-09-26** by a word-bounded alias grep. BlackRock has 40 raw hits, 7 of them known collisions:
    - "AIP" is also American Intelligence & Power (`caterpillar`, `rehlko`, `nscale`), Palantir's AIP (`mccarthy`) and AIP Management (`rosendin`).
    - "GIP" is Infineon's Green Industrial Power segment.
    - "HPS" is Prevalon's Hybrid Power Stabilizer.
    - That leaves about 33 for BlackRock; KKR has 19. No dossier has an edge to either slug yet, and `microsoft` does not name AIP at all.
  - **A defer-not-skim rule:** if BlackRock's step 7 outgrows the session, KKR and BlackRock's controlled platforms come first, and every remaining slug is recorded by name.
  - **F-N1's lessons:**
    - Count inbound hits against the archive copies.
    - Check for the EDGAR block and read filings from IR sites.
    - Never edit an existing concept.
    - Re-verify a pin only on an edge-only change; leave a substantive one loud, with the reason written.
    - Close the guide overlay with its ✕ button under Playwright.
  - **A Megmeet paragraph ask:** which controlled platforms buy MV or DC equipment, and whether capital is a door or only a directory.

### Changed

- **`phase-f-action-plan.md`** — the status line records §6. §3 row 4 gives the measured count and points to §6.
- **`SESSION-CONTEXT.md`** — the Latest Session extended in place for v07.65r, as F-H1's save did, since it was already this session's hand-off. The recommendation now points to the §6 prompt.
- **README.md** — the action plan's tree description names all three prompts; timestamp and repo version.

### Notes

- **No dossier, guide, page, GAS script or Classroom content changed.** No rotation: 91 sections.

## [v07.64r] — 2026-09-26 05:27:31 AM EST

> **Prompt:** "Picking up from my last session, run Phase F session F-N1 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: Firmus Technologies, HUMAIN and
> G42 (Khazna) — the neoclouds and AI-capacity builders that sign for their own campuses. This session runs
> on Opus 5.5 at xhigh (the action plan suggested high; I am choosing xhigh). Write "Opus 5.5 xhigh" into
> your §11.3 Model cells.
>
> WHY NOW: §11.2 wants F-N1 landed before the 10/1 neoclouds pass, so landscape-neoclouds-2026-09 is
> re-authored once, in Classroom wave A (Fri 10/2 – Tue 10/6). Do NOT run the neoclouds pass or
> `profiler Habitat Energy` here — both wait on filings due 9/30 — and do not revise fluidstack.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/phase-f-action-plan.md;
> PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the three F-N1 rows of §11.3 are yours; §11.1's
> buying-authority test applies); .claude/rules/profiler-app.md (Profiler Command including step 1a
> identity and step 7 reconciliation, Profiler Prep Command, Scheduled Refreshes);
> repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments registry, Refresh calendar);
> repository-information/PROFILER-STYLES.md (active style). Read the coreweave, nebius, crusoe, fluidstack
> and nscale dossiers and study guides as the house pattern for a neocloud, and the mgx, xai, amd,
> terawulf, openai and oracle dossiers — they already name HUMAIN, G42, Khazna, Core42 or Stargate UAE.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Proposed slugs: firmus, humain, g42. Category hypotheses:
> firmus ["neocloud"]; humain ["neocloud"] or ["hyperscaler"]; g42 ["neocloud"], ["hyperscaler"] or
> ["developer"] — decide each on the record and say why. Populate aka[] BEFORE the step-7 grep, including
> brand and subsidiary names (Firmus: Sustainable Metal Cloud if it is Firmus's, HyperCube; G42: Group 42,
> Khazna, Core42, Stargate UAE; HUMAIN: its Arabic name if it publishes one). Assign segments in
> live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: neoclouds ·
> challenger for all three; aidc-developers-and-landlords · challenger for Firmus and for G42 if Khazna
> owns and builds its campuses). Then the registry sync, the graph build, a calendar row per company under
> the Refresh calendar rules (Firmus: public if its ASX listing has happened by your run date — the ASX is
> reachable from the sandbox — otherwise the private rule; HUMAIN and G42 private), README tree entries,
> and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — establish each of these, do not assume it:
> - Firmus: the operating and listing entity, how Sustainable Metal Cloud relates to it, which company owns
>   and builds the Australian and Malaysian campuses, and the status of the Benmax acquisition.
> - HUMAIN: its ownership (PIF), and which entity signs for data-centre power equipment — HUMAIN itself, a
>   joint venture, or a design-build contractor it appoints. Decide neocloud or hyperscaler.
> - G42: one slug for the group, or a separate one for Khazna? Decide under Naming and renames and say
>   why. Establish Khazna's and Core42's ownership, Microsoft's stake in G42, and who signs for Stargate
>   UAE's power equipment.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify against first-party sources
> (company releases, the ASX, government and regulator records, the counterparties' own filings), record a
> premise verdict per clause, and rewrite the cells. Run these checks hardest:
> - Firmus: >900 MW contracted (8 Sep 2026) with OpenAI as the Malaysian anchor; the Benmax purchase
>   (A$300M); the Gunvor 600 MW supply deal tied to 1.5 GWh of storage; the ASX IPO timing; ClusterMAX 3.0
>   Silver.
> - HUMAIN: 1.9 GW by 2030 and Al Sa'ad 1 GW phase 1 by 2027; xAI 500 MW+ and Together AI 250 MW
>   (31 Aug 2026); the design-build awards to MIS; ClusterMAX "Unavailable".
> - G42: Khazna building Stargate UAE (1 GW inside a 5 GW campus) with long-lead equipment for the first
>   200 MW procured — who procured it, and from whom; Core42 as TeraWulf's 60 MW tenant; the UAE's move to
>   Country Group A:5 (Jul 2026) and what it changed.
> For each company, record the §11.1 buying-authority verdict: does it, or a platform it controls, sign for
> batteries, MV gear, generation or SSTs?
>
> RECONCILIATION (step 7) — expected inbound: Firmus 0; HUMAIN 2 (amd, xai); G42 4 (mgx, terawulf, and
> openai and oracle through "Stargate UAE"). Known alias collisions, not inbound: hyperstrong's "HyperCube"
> is HyperStrong's own product line, and dg-matrix's "Inception" is NVIDIA's startup programme. Grep again
> with the full aka[]. Check every inbound dossier for the reciprocal edge — in F-H1 the delta-electronics
> dossier did not name a customer it had launched a product with — and where one is missing, revise that
> dossier under the Archival Procedure and re-verify any report pins on it. Check microsoft and nvidia for
> a missing G42 or HUMAIN edge too.
>
> LESSONS FROM F-H1 — apply them:
> - Every supplier, customer or partner named in narrative prose rests on a source in sources[], ideally
>   the counterparty's own filing. F-H1 had to back-source two such claims before commit.
> - A tender is not an award. An unattributed figure is stated as unverified, never as fact.
> - Write each lesson plan skeleton-first, then Edit (.claude/rules/behavioral-rules.md, Incremental
>   Writing, item d).
> - If an existing study guide contradicts a verified finding, correct it minimally and record it.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The new members make landscape-neoclouds-2026-09
> and the scenario-neoclouds-discovery rehearsal stale — and landscape-aidc-developers-and-landlords-2026-09
> further, if Firmus or G42 join that segment. Record that in the CHANGELOG entry and the SESSION-CONTEXT
> hand-off (§11.2, the landscape coupling); Classroom wave A re-authors them.
>
> FOR THE MEGMEET JOB: in the SESSION-CONTEXT hand-off, write one short paragraph on whether any of the
> three signs for medium-voltage or DC power equipment (SSTs, 800 VDC, HVDC), and what that means for an
> SST seller.
>
> VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
> build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new dossier and guide renders under Playwright with zero page errors other than the
> sandbox's gis_load_failed. CHANGELOG rotation only if non-exempt sections reach 100. Normal Pre-Commit
> and Pre-Push checklists; one commit; push on a claude/* branch."

**Phase F, session F-N1 — Firmus Technologies, HUMAIN and G42 (Khazna)** join the Profiler corpus: the neoclouds and AI-capacity builders that sign for their own campuses. There are three dossiers, each with a v2 study guide and a lesson plan, plus the reciprocal edges on the eight inbound dossiers that name them. Run on Opus 5.5 at xhigh.

### Added

- **Three schema v7 dossiers** (`profileVersion` 1, intel-briefing style), each researched by two parallel subagents under the two-stage protocol. `check-source-reachability.py` ran before Stage 2 was planned: **PARTIAL** — `sec.gov` and `data.sec.gov` are blocked; the ASX and the other probed hosts are reachable.
  - **`firmus.profile.json`** — `categories: ["neocloud"]`; 67 sources (58% first-party), 24 developments, 5 products, 7 relationships, 13 decision makers (5 with photos), 5 policy entries.
    - **Identity:** Firmus Grid Limited (ACN 638 040 534), trading as Firmus Technologies. It is **unlisted** as of 26 Sep 2026: no ASX record and no lodged prospectus. Sustainable Metal Cloud is its legacy cloud brand (smc.co is held by Firmus Metal International).
    - **Ownership of the campuses:** the South Australian campuses are 'owned and operated by Firmus'. Melbourne sits inside a CDC Data Centres facility.
    - **The power train:** Maas Group's JLE is 'the exclusive supplier of power train units for Firmus' Australian pipeline'.
  - **`humain.profile.json`** — `categories: ["neocloud"]`, decided against hyperscaler; 53 sources (28% first-party), 30 developments, 5 products, 6 relationships, 9 decision makers, 4 policy entries.
    - **Identity:** Future Artificial Intelligence Co. (شركة المستقبل للذكاء الاصطناعي), trading as HUMAIN (هيوماين). PIF-owned; Aramco's minority stake is EC-cleared but not completed.
    - **Why a neocloud:** its own cloud launched at 1.1 MW, and it builds capacity and lets it to xAI, Together AI, Adobe, Luma and an AWS 'AI Zone'.
  - **`g42.profile.json`** — `categories: ["developer", "neocloud"]`; 57 sources (56% first-party), 25 developments, 5 products, 8 relationships, 12 decision makers (8 with photos), 4 policy entries.
    - **Identity:** Group 42 Holding Ltd, kept as **one group slug** under Naming and renames. G42 controls Khazna (majority; MGX and Silver Lake are minorities), and the BIS approval and Stargate UAE sit at group level.
    - **`aka[]`:** Khazna, Core42, Stargate UAE, Presight, Space42, M42, Inception, Jais, Condor Galaxy and the legal entities.
- **Three schema v2 study guides**, each with flashcards and a self-test on concepts only:
  - `firmus.study.json` (15 sections);
  - `humain.study.json` (15 sections, plus one doc-glossary term, 'revenue-sharing arrangement', because the registry's `revenue-share` is BESS-optimiser-specific);
  - `g42.study.json` (16 sections).
- **Three lesson plans** under `repository-information/study-prep/<slug>/` — six, six and eight modules, paced to the 2026-10-07 start. Each was written skeleton-first and then filled in by Edit (the Incremental Writing gate, item d).
- **19 new concepts** in `profiler-concepts.json` (1,539 total), each checked for term and alias collisions against the registry (`EAR`, `Country Group A:5`, `prefabricated` and `standby generator` were already taken):
  - AI factory and compute: `ai-factory`, `nvl72`, `clustermax`, `gpu-as-a-service`, `immersion-cooling`.
  - Power chain: `power-train`, `bulk-supply-point`, `mva`, `maximum-demand`, `backup-generator`, `carbon-capture`, `energy-retailer`.
  - Contracts: `exclusive-supply-agreement`, `work-order`, `early-contractor-involvement`.
  - Export rules and security: `country-group`, `approved-recipient`, `end-use-controls`, `site-hardening`.
  - No existing entry was edited.
- **13 executive photos** in `live-site-pages/images/execs/`, all company-published: `firmus-*` (5) and `g42-*` (8, from G42's and Khazna's leadership pages; the webp originals were converted to jpg).
- **Eight archive files**: `amd.profile.v1`, `mgx.profile.v2`, `microsoft.profile.v4`, `nvidia.profile.v10`, `openai.profile.v5`, `oracle.profile.v5`, `terawulf.profile.v7`, `xai.profile.v4`, each with an `archive-index.json` entry.

### Changed

- **Eight inbound dossiers revised under the Archival Procedure** (step 7: the reciprocal edge for each counterparty the new dossiers name). Each gains the edge plus its source in `sources[]`; no other field changed except where noted:
  - `amd` v1→v2 — customers `humain` (the AMD–Cisco–HUMAIN joint venture, MI355X live 31 Aug 2026) and `g42`.
  - `xai` v4→v5 — supplier `humain` (announced; the '500 MW+' framework). One development read changed: 'trade reporting also cites a $3B HUMAIN investment' now records **HUMAIN's own confirmation** (18 Feb 2026) — an open question closed.
  - `mgx` v2→v3 — portfolio `g42` (the Khazna minority alongside Silver Lake, March 2025).
  - `terawulf` v7→v8 — customer `g42` (Core42's 60 MW critical IT at Lake Mariner, G42 parent guarantee).
  - `openai` v5→v6 — suppliers `g42` (Stargate UAE) and `firmus` (announced; the two Malaysian sites).
  - `oracle` v5→v6 — partner `g42` (Stargate UAE operator).
  - `microsoft` v4→v5 — portfolio `g42` (US$1.5B, April 2024) and partner `humain`.
  - `nvidia` v10→v11 — customers `humain` and `g42`, portfolio `firmus`.
- **`profiler-companies.json`** — 185 → 188 entries. Taglines, `aka[]` (brand, subsidiary, legal and Arabic names) and `domains[]` were populated **before** the step-7 grep. The sync pass reconciled `srcTotal`, `srcFirstPct` and `segments`.
- **`profiler-segments.json`**, each with a basis line:
  - `neoclouds`: all three as challengers — the roster goes from seven to ten.
  - `aidc-developers-and-landlords`: `g42` challenger (Khazna); `firmus` and `humain` **adjacent**. Both build for their own clouds and lease no shells; Firmus's hypothesis had been challenger.
- **`profiler-graph.json`** — rebuilt: 1,610 edges (1,217 curated).
- **`profiler-refresh-calendar.json`** — all three are private, `cadence: quarterly`, `tier: core`. Firmus had not listed by the run date; its reported ASX listing is 22 Oct 2026. **`profiler-refresh-notes.json`** — a source and a `watch[]` list per slug, appended without reordering the file.
- **`report-pins-verified.json`** — `openai` (v5→v6) and `xai` (v4→v5) re-verified on `named-project-bess-attach--opportunity--2026-09-08`: every cited source is unchanged, and the report neither cites the changed xAI development nor mentions HUMAIN.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the three F-N1 rows rewritten as verified cells, with a premise verdict per clause and the §11.1 buying-authority answer; Model **Opus 5.5 xhigh**; `Checked 2026-09-26, v07.64r`; Dossier v1; Guide v2. The verdicts run hardest:
  - **Firmus:**
    - More than 900 MW contracted — **held, as a sales figure**: 'across all customers', against two operating sites.
    - OpenAI as the Malaysian anchor — **held**, for two sites not yet built.
    - 'Owns its Australian campuses' — **held in part**.
    - 'Builds the electrical content' — **refined**: Benmax fabricates the mechanical and cooling modules; the electrical Power Cube is made exclusively by JLE (A$200M and A$855M work orders).
    - Benmax A$300M — **held, not closed** by 26 Sep.
    - Gunvor 600 MW tied to 1.5 GWh — **held**, exactly the energy policy's 2.5 MWh per MW.
    - IPO 22 Oct — **as reported** (a Reuters term sheet; a draft prospectus shows a '$77 million' pro-forma half-year loss).
    - ClusterMAX 3.0 Silver — **held**.
  - **HUMAIN:**
    - 1.9 GW by 2030 — **a CEO target**.
    - Al-Saad 1 GW phase 1 by 2027 — **unreconciled** against the NYT's 250 MW by the start of 2027.
    - xAI 500 MW+ — **a framework**.
    - Together AI 250 MW (31 Aug) — **held**.
    - The MIS design-build — **superseded** by a 250 MW EPC of ~SAR 8.76B, 'carried out under work orders issued by HUMAIN' (20 Sep 2026).
    - ClusterMAX 'Unavailable' — **held**.
  - **G42:**
    - Khazna builds Stargate UAE — **held**.
    - 'Long-lead equipment for the first 200 MW procured' — **held, with a precision**: the October 2025 update says the project 'has completed procurement of all long-lead equipment', naming no supplier, category or signing entity.
    - Core42 as a 60 MW TeraWulf tenant — **held**.
    - The UAE's move to A:5 — **held, with the rider the hypothesis missed**: G42 and Core42 are named approved recipients in Supplement No. 8, an approval that 'shall automatically expire on April 6, 2027' unless they 'become U.S. companies'.
- **`phase-f-action-plan.md`** — the status line records F-N1 as landed. Classroom wave A (row 7) now names F-N1 among the drift it absorbs.
- **README.md** — tree entries for the three profile/study pairs, the three study-prep directories and the eight archive files, plus the timestamp and repo version.
- **`SESSION-CONTEXT.md`** — a new Latest Session (the F-N1 hand-off, with the Megmeet paragraph). The F-H1 entry moved to Previous, and the older v07.60r–v07.61r entry dropped under the two-session cap.

### Notes

- **Step-7 reconciliation**, grepped with the full `aka[]` against the pre-revision dossiers:
  - **Firmus 0.** The only hit was `hyperstrong`'s own 'HyperCube' product line, a collision.
  - **HUMAIN 2** (`amd`, `xai`).
  - **G42 4** (`mgx`, `terawulf`, and `openai` and `oracle` via 'Stargate UAE'). `dg-matrix`'s 'Inception' is NVIDIA's startup programme, a collision.
  - **No inbound claim contradicted the new dossiers**; one open question (xAI's HUMAIN investment) was closed.
  - `microsoft` and `nvidia` named neither company before this session and now carry the edges.
  - The new dossiers' edges to `eaton`, `supermicro`, `blackstone`, `coreweave`, `iren` and `amazon` stay one-way and show as inbound evidence in the graph.
- **§11.1 buying authority:**
  - **Firmus** is the buyer of record for its own chain: it pays for and owns its connection substations, applies for its backup generation, and runs UPS and batteries on Eaton's EnergyAware platform through Synert. In Australia, though, the power train is exclusive to JLE.
  - **HUMAIN** is owner and grid counterparty (the National Grid SA agreement, 2 Sep 2026). On the MIS build the EPC contractor buys under HUMAIN-approved designs, and on partner campuses the partner buys. The Al-Saad 380/132/33 kV package (a 2,000 MVA bulk supply point) was tendered on early contractor involvement, and the reported selection is 'not a definitive construction award'.
  - **G42:** Khazna buys and Core42 leases. The Khazna–Siemens memorandum (15 Sep 2026) to 'continue to progress next-generation 800 VDC power architectures' is a memorandum, not an award.
  - **None of the three has signed for an SST, 800 VDC or HVDC equipment on the record.**
- **Existing study guides checked for contradictions:** only `mgx.study.json` names G42, Khazna or Stargate UAE, and it agrees with the new dossiers. No guide was corrected.
- **Classroom lessons now stale, by design — `Classroom.gs` was not edited:**
  - `landscape-neoclouds-2026-09`: seven members become ten.
  - `scenario-neoclouds-discovery` goes stale with it.
  - `landscape-aidc-developers-and-landlords-2026-09`, further: +`g42` as a challenger, +`firmus` and +`humain` as adjacent, on top of the F-H1 drift. Its `scenario-aidc-developers-and-landlords-*` rehearsals were already stale.
  - Classroom wave A (Fri 10/2 – Tue 10/6) re-authors them.
  - `build-classroom-segments.py --check` now shows **14 due**: 12 with section changes (`neoclouds` differs in eight sections) and 2 pin-only (`capital`, from `mgx` v3; `insurance-and-risk-transfer`).
- **Checkers:**
  - `sync-profiler-registry.py --check` — clean (188 in bijection).
  - `check-profiler-study.py` — 0 errors, 0 warnings (188 guides, 1,539 concepts).
  - `check-profiler-relationships.py` — 0 findings.
  - `check-profiler-crossrefs.py` — 0 candidates (32 over-cap scopes not examined, as before).
  - `check-readme-tree.py` — 0 findings.
  - `check-profiler-reports.py` — 0 errors and two warnings, read and left loud:
    - `jinko` — pre-existing.
    - `oracle` — now v6 against a v4 pin. The v4→v5 step was an earlier session's substantive refresh (summary, developments, strategy, financials), which a pin note cannot vouch for; this session's v6 only added the G42 edge.
- **Playwright:** 11 dossiers (the three new ones and the eight revised) render on `Profiler.html`, with every tab and the study guide, and zero real page errors. The only error is the auth wall's `gis_load_failed`, the Google Identity script the sandbox cannot fetch.
  - No literal `{{` or `**` appears in any new dossier or guide.
  - NVIDIA's Relationships tab shows four literal `**`. They are pre-existing: other dossiers' inbound curated contexts, with the graph's count unchanged at 127.
  - `Profiler.html` is unchanged (data-only), so there is no page version bump.
- **Not run here, as instructed:** the 10/1 neoclouds pass, `profiler Habitat Energy`, and any `fluidstack` revision.
- **No rotation:** 90 sections, under the trigger.

## [v07.63r] — 2026-09-26 03:20:08 AM EST

> **Prompt:** "I approve of your proposed fix for the write-size slip. Output the three new guides as downloadable PDFs. Give me a prompt to paste into a new Opus 5.5 Xhigh session for F-N1, then remember session."

The follow-up to F-H1: the approved rule fix for the write-size slip, the three new study guides as PDFs, the F-N1 paste-in prompt, and the session saved.

### Added

- **`phase-f-action-plan.md` §5 — the F-N1 paste-in prompt** (Firmus Technologies, HUMAIN, G42/Khazna) for Opus 5.5 **xhigh**; §3 had suggested high, and the developer chose xhigh. It follows §4's F-H1 prompt and carries F-H1's lessons:
  - Every counterparty named in prose rests on a source, ideally its own filing.
  - Every inbound dossier is checked for a missing reciprocal edge, and revised under the Archival Procedure where one is missing.
  - Lesson plans are written skeleton-first.
  - It names the expected inbound set (Firmus 0; HUMAIN 2 — `amd`, `xai`; G42 4 — `mgx`, `terawulf`, and `openai` and `oracle` via Stargate UAE) and two known alias collisions (`hyperstrong`'s HyperCube product line; `dg-matrix`'s NVIDIA Inception badge).
  - It asks for the §11.1 buying-authority verdict per company and a Megmeet paragraph in the hand-off.
  - A status line under the plan's title records that F-H1 has landed.

### Changed

- **`.claude/rules/behavioral-rules.md` — Incremental Writing gate, Step 1**: a new item (d) adds `study-prep/<slug>/<slug>-lesson-plan.md` (typically 60–100 lines) to the content types that must be treated as over 50 lines and written skeleton-first. This was the structural fix proposed in v07.62r, after a 75-line lesson plan was written in one call, and the developer approved it. A scan found no conflicting text.
- **`SESSION-CONTEXT.md`** — the Latest Session extended in place for v07.63r. It was already this session's F-H1 hand-off, so moving it down would have pushed out the v07.60r–v07.61r entry to make room for a duplicate. The recommendation now points at §5.
- **README.md** — the action plan's tree description names both prompts; timestamp and repo version.

### Notes

- **The PDFs are deliverables, not repo files.** `ByteDance-`, `Alibaba-Cloud-` and `Chindata-Technology-Study-Guide.pdf` (13, 15 and 11 pages) were rendered with Chromium from each `<slug>.study.json` and sent to the developer:
  - Every section kind is laid out for print.
  - The tooltip terms are underlined and defined in a closing glossary (17, 25 and 19 terms).
  - The self-test answers moved to an answer key.
  - The ByteDance timeline's intro is re-worded for its table form.
  - Checks: a text extraction found no literal `{{` or `**`, the Chinese glyphs rendered, and every page was inspected.
- **No dossier, guide, page, GAS script or Classroom content changed.** No rotation: 89 sections.

## [v07.62r] — 2026-09-26 02:50:43 AM EST

> **Prompt:** "Picking up from my last session, run Phase F session F-H1 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: ByteDance (Volcano Engine), Alibaba
> Cloud and Chindata — the China buyer side the megmeet dossier lacks. This session runs on Opus 5.5 at
> xhigh: on 2026-09-26 I decided Phase F runs on Opus 5.5, and repository-information/phase-f-action-plan.md
> supersedes the Model column of §11.2. Write "Opus 5.5 xhigh" into your §11.3 Model cells.
>
> WHY NOW: I start at Megmeet (Senior Sales Manager — SST Solutions) on Wednesday 2026-10-07. Land this
> before then, with time for me to read it.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/phase-f-action-plan.md;
> PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the three F-H1 rows of §11.3 are yours);
> .claude/rules/profiler-app.md (Profiler Command including step 1a identity and step 7 reconciliation,
> Profiler Prep Command, Scheduled Refreshes); repository-information/PROFILER-SCHEMA.md (Naming and
> renames, Segments registry, Refresh calendar); repository-information/PROFILER-STYLES.md (active style).
> Read the megmeet, zhonhen, delta-electronics and sinexcel dossiers and study guides — the supply side
> these three buyers face — and the parts of
> repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html that name Chinese buyers.
> Those are context only: cite primary sources, never the briefing.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Category hypotheses: bytedance ["hyperscaler"],
> alibaba-cloud ["hyperscaler"], chindata ["developer"]. Populate aka[] BEFORE the step-7 grep, including
> the Chinese names: ByteDance / Volcano Engine / 字节跳动 / 火山引擎; Alibaba Cloud / Alibaba Cloud
> Intelligence / Aliyun / 阿里云; Chindata / 秦淮数据 / Bridge Data Centres. Assign segments in
> live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis:
> hyperscalers-and-ai-labs · challenger for the two hyperscalers; aidc-developers-and-landlords ·
> challenger for Chindata). Then the registry sync, the graph build, a calendar row per company under the
> Refresh calendar rules (Alibaba reports publicly — research its next results date; follow the private
> rule for the others), README tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — establish each of these, do not assume it:
> - Alibaba Cloud: one slug for the cloud unit, or for Alibaba Group? Decide under Naming and renames and
>   say why.
> - ByteDance vs Volcano Engine: which entity buys data-centre power equipment.
> - Chindata: current ownership (Bain Capital's 2023 take-private and anything after it), the reported
>   Bridge Data Centres sale process (Bloomberg, 29 Jul 2026), and which entity operates Huailai.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify against first-party sources
> (Alibaba's results filings, company releases, Chinese exchange and tender records where reachable),
> record a premise verdict per clause, and rewrite the cells. Run these checks hardest:
> - ByteDance's 2026 capex: three reports differ about 2x (RMB 160B / more than RMB 200B / up to $70B).
>   State the conflict unless a primary source resolves it.
> - Alibaba's Panama (10 kV to 240 VDC) is a line-frequency transformer-rectifier, not an SST. The zhonhen
>   dossier already draws this line; keep it. Zhonhen's "~70% share" is secondary-source only.
> - Chindata at Huailai (2 Jul 2026, for Meituan; HEC and Delta; 10 kV to 800 VDC): verify that it is a
>   solid-state transformer and who supplied what.
> - ByteDance's early-2026 HVDC tender and its 800 V pilot: the named suppliers (Kehua, Zhonhen — Kehua has
>   no dossier) and whether any 800 V award is public.
>
> RECONCILIATION (step 7) — expected inbound: ByteDance 3 (mgx, narada, zhonhen), Alibaba 4 (narada,
> nscale, sungrow, zhonhen), Chindata 3 (amperesand, dg-matrix, stack-infrastructure). Grep again with the
> full aka[], including the Chinese names. Check that megmeet, zhonhen, delta-electronics and sinexcel
> agree with the new dossiers on every supplier and customer edge, and record the reciprocal types.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The three new members make
> landscape-hyperscalers-and-ai-labs-2026-09 and landscape-aidc-developers-and-landlords-2026-09 stale,
> and the scenario-hyperscalers-and-ai-labs-* and scenario-aidc-developers-and-landlords-* rehearsals with
> them. Record that in the CHANGELOG entry and the SESSION-CONTEXT hand-off (§11.2, the landscape
> coupling); Classroom wave A in the action plan re-authors them.
>
> FOR THE MEGMEET START: in the SESSION-CONTEXT hand-off, write one short paragraph on what the three
> dossiers change about the megmeet dossier's missing customer side. Do not edit the briefing files.
>
> VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
> build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new dossier and guide renders under Playwright with zero page errors. CHANGELOG
> rotation only if non-exempt sections reach 100. Normal Pre-Commit and Pre-Push checklists; one commit;
> push on a claude/* branch."

**Phase F, session F-H1 — ByteDance, Alibaba Cloud and Chindata China** join the Profiler corpus: the China buyer side the `megmeet` dossier lacks. Two hyperscalers and one wholesale landlord, each with a v2 study guide and a lesson plan, plus the reciprocal customer edges on the two supplier dossiers that sell to them (`zhonhen` v9, `delta-electronics` v7). Run on Opus 5.5 at xhigh.

### Added

- **Three schema v7 dossiers** (`profileVersion` 1, intel-briefing style), each researched by two parallel subagents under the two-stage protocol (Agent A first-party and exchange records; Agent B third-party). `check-source-reachability.py` ran before Stage 2 was planned: **PARTIAL** — `sec.gov` / `data.sec.gov` blocked, the other probed hosts reachable; the Chinese filing hosts this session needed (cninfo, SZSE, HKEXnews) were read directly.
  - **`bytedance.profile.json`** — `categories: ["hyperscaler"]`; 69 sources (35% first-party), 31 developments, 7 products, 7 relationships, 4 decision makers. Identity: one group slug; Volcano Engine (北京火山引擎科技有限公司) is the name its own campuses are bought under, so it sits in `aka[]` with 字节跳动 / 火山引擎 / 火山云 / BytePlus / Douyin / TikTok / Doubao.
  - **`alibaba-cloud.profile.json`** — `categories: ["hyperscaler"]`; 66 sources (48% first-party), 23 developments, 6 products, 6 relationships, 7 decision makers. Identity: **the cloud unit, not the Group** — on the `nextera-energy-resources` precedent: it is the only data-centre-buying part of Alibaba and a reported segment (AI Cloud and Compute Services from the June 2026 quarter). The Group names, T-Head, Qwen and 阿里云 / 阿里巴巴（中国）有限公司 are in `aka[]`.
  - **`chindata.profile.json`** — `categories: ["developer"]`; 55 sources (40% first-party), 20 developments, 6 products, 6 relationships, 7 decision makers, with a KPI overlay (`mw-energized` 799.34 MW FY2025; `mw-contracted` 886.17 MW). Identity: **Chindata China** — the operating companies Bain's WinTriX DC Group sold to an HEC-led consortium for RMB 28.0B (closed 2026-01-16; the listed HEC Technology holds 30% and is buying the rest); the IDC licence and Huailai sit with 北京秦淮数据有限公司. Bridge Data Centres, the subject of the July 2026 sale reports, is Bain's separate former international arm and appears only in `aka[]` and context.
- **Three schema v2 study guides** — `alibaba-cloud.study.json` (16 sections), `bytedance.study.json` (16), `chindata.study.json` (14) — each with flashcards and a self-test on concepts only, and **three lesson plans** under `repository-information/study-prep/<slug>/`, five or six modules each, paced to the 2026-10-07 start.
- **17 new concepts** in `profiler-concepts.json` (1,520 total): `240vdc`, `approved-vendor-list`, `billed-capacity`, `capex`, `delta-connection`, `direct-green-power`, `east-data-west-computing`, `framework-procurement`, `internet-data-center`, `line-frequency-transformer`, `maas`, `panama-power`, `phase-shifting-transformer` (disambiguated from the transmission device of the same name), `rack-power-density`, `supernode`, `token`, `wholesale-colocation`.
- **One executive photo**, `live-site-pages/images/execs/chindata-wu.jpg`, cropped from Chindata's own captioned news photo.

### Changed

- **`zhonhen.profile.json` v8 → v9** (v8 archived) — two curated customer edges, each the reciprocal of a supplier edge in a new dossier: `alibaba-cloud` (since 2017; the RMB 800M 2021 Panama framework, its contract announcement added as a source) and `bytedance` (since 2025, via precision distribution — the FY2025 annual report already cited). No other field changed.
- **`delta-electronics.profile.json` v6 → v7** (v6 archived) — two customer edges: `alibaba-cloud` (since 2019, Panama co-launch; Delta China's release added as a source) and `chindata` (since 2025-11, the Sangyuan SST; Delta Brand News added as a source). **The v6 dossier did not name Alibaba or Panama at all.** No other field changed.
- **`zhonhen.study.json`** — one bullet corrected: it called Panama's device class 'the solid-state transformer / MV rectifier sidecar'; it now says transformer-rectifier, not SST, as the `zhonhen` dossier, the new `alibaba-cloud` dossier and NVIDIA's 2026 execution paper all do. `lastUpdated` 2026-09-26.
- **`profiler-companies.json`** — 182 → 185 entries, with taglines, `aka[]` (Chinese names included) and `domains[]` populated before the step-7 grep.
- **`profiler-segments.json`** — `bytedance` and `alibaba-cloud` → `hyperscalers-and-ai-labs` · challenger; `chindata` → `aidc-developers-and-landlords` · challenger; a basis line each.
- **`profiler-graph.json`** — rebuilt, 1,583 edges (1,197 curated).
- **`profiler-refresh-calendar.json`** — `alibaba-cloud` dated 2026-11-24 (**unconfirmed**: Alibaba has not announced its September-quarter results date; the date follows its reporting pattern); `bytedance` and `chindata` private, `cadence: quarterly`, `tier: core`. **`profiler-refresh-notes.json`** — a source and a `watch[]` list per slug, inserted without reordering the file.
- **`report-pins-verified.json`** — the two current reports that pin `zhonhen` and `delta-electronics` (`aidc-power-conversion-rev2--competitive--2026-09-25`, `sst-hall-edge-block-rev2--competitive--2026-09-23`) re-verified at the new versions: every cited source is unchanged; only relationships and sources were added.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the three F-H1 rows rewritten from hypotheses into verified cells with a premise verdict per clause; Model **Opus 5.5 xhigh**; `Checked 2026-09-26, v07.62r`; Dossier v1; Guide v2. The verdicts the prompt asked to run hardest:
  - **ByteDance capex — refined, unresolved:** the spread is about **3×**, not 2× — RMB 160B (FT, 2025-12-23), more than RMB 200B (SCMP, 2026-05-09), up to US$70B total under discussion (Bloomberg, 2026-05-27); anonymous-source leaks of different scope, none confirmed. Stated as a range.
  - **ByteDance's HVDC tender and 800 V pilot — not supported:** the 30–40% HVDC share and the tens-of-MW 800 V pilot trace only to one unattributed expo post (2026-01-22); the same site said a week later the 800 V work was 'still out to tender'; 21世纪经济报道 (2026-09-22) confirms only 'first introduced'. **No 800 V or SST award is public.** Zhonhen is named in ByteDance's chain (precision distribution, not HVDC); **Kehua is not** — its filings anonymise customers.
  - **Panama — held:** a line-frequency transformer-rectifier, not an SST (Zhonhen's own description; NVIDIA's 2026 800 VDC execution paper). **Zhonhen's ~70% — unverifiable:** no filing states a share; broker estimates run from about half to above 90%.
  - **Chindata's Huailai SST — held, with a qualifier:** a true SST on its makers' functional description (SiC high-frequency conversion, 'from line frequency to high frequency', 10 kV delta-connected to 800 V DC in one step, 98.5%); Delta supplied the SST, HEC the capacitor banks, Chindata the specification and 34 tests, Meituan is the tenant; formal commercial operation 2026-07-02. 'First' holds only as **first in commercial operation** — Eaton has run an SST pilot at VNET since end-2024.
- **README.md** — tree entries for the three profile/study pairs, the three study-prep directories and the two new archive files, plus the timestamp and repo version.

### Notes

- **Step-7 reconciliation** (grepped with the full `aka[]`, Chinese names included): ByteDance 3 dossiers (`mgx`, `narada`, `zhonhen`), Alibaba Cloud 5 (`narada`, `nscale`, `sungrow`, `zhonhen`, plus `calb`'s career-history line), Chindata 3 (`amperesand`, `dg-matrix`, `stack-infrastructure`). **No inbound claim contradicted the new dossiers**; `amperesand` and `dg-matrix` say the Sangyuan SST went live in February 2026, which is a distinct milestone from the July commercial-operation date and is recorded as such. Reciprocal types recorded: supplier ↔ customer on `zhonhen` (Alibaba Cloud, ByteDance) and `delta-electronics` (Alibaba Cloud, Chindata). **`megmeet` and `sinexcel` carry no edge to any of the three, and none is warranted:** no Megmeet, Sinexcel or Kehua filing names ByteDance, Alibaba or Chindata.
- **Two supplier claims were back-sourced in the ByteDance dossier before commit:** Jinpan's own bond feasibility report (360 data-centre projects including ByteDance) and Far East's Q1 2026 report (the Volcano Engine Yangtze-Delta campus) — both read in research, added to `sources[]` so the named-supplier sentence rests on each supplier's own filing.
- **Classroom lessons now stale, by design — `Classroom.gs` was not edited:** `landscape-hyperscalers-and-ai-labs-2026-09` (two new members) and `landscape-aidc-developers-and-landlords-2026-09` (one new member, on top of the `tract` v4 and `powerhouse-data-centers` v3 drift already recorded), and with them the `scenario-hyperscalers-and-ai-labs-*` and `scenario-aidc-developers-and-landlords-*` rehearsals. `build-classroom-segments.py --check` now shows 12 segment lessons due: the two segments above with real section changes (the-players, the-numbers, who-is-connected and more), nine with only the `where-it-sits` roster count, and `insurance-and-risk-transfer` pin-only. **Classroom wave A** in `phase-f-action-plan.md` (Fri 10/2 – Tue 10/6) re-authors them.
- **Checkers:** `sync-profiler-registry.py --check` clean (roster ↔ calendar bijection holds); `check-profiler-study.py` 0 errors, 0 warnings (185 guides, 1,520 concepts); `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates (none of the new dossiers' scopes exceeds the size cap); `check-readme-tree.py` 0 findings; `check-profiler-reports.py` 0 errors and the two pre-existing warnings (`jinko` v6, `oracle` v5), read and left loud.
- **Playwright:** the three new dossiers and guides, plus the revised `zhonhen` and `delta-electronics` (dossier, Relationships tab and study guide each), render on `Profiler.html` with zero console errors and no literal `{{` or `**`; the only page error is the auth wall's `gis_load_failed`, the Google Identity script the sandbox cannot fetch — the same condition every prior session recorded. `Profiler.html` itself is unchanged (data-only), so no page version bump.
- **No rotation:** 88 sections, under the trigger.

## [v07.61r] — 2026-09-26 01:21:37 AM EST

> **Prompt:** "remind me to check the 9/30 Classroom run after it happens, then list out all the other recommended companies to add to Profiler and recommend me an action plan to implement everything. I would like to use Opus 5.5, but make sure to recommend an effort level from medium to high to xhigh. Then, give me a prompt to paste into a new Opus 5.5 session (with your recommended effort level) to start the action plan, then remember session."

The hand-off after the Classroom re-pin: a reminder for the 9/30 pipeline run, the Phase F action plan on the developer's chosen model with an effort level per session, the paste-in prompt for its first session, and the session context saved.

### Added

- **`repository-information/phase-f-action-plan.md`** (new), in four sections:
  - **§1 — every company still recommended for Profiler.** The 32 remaining Phase F companies in 11 sessions (F-H1, F-N1, F-I1, F-I2, F-U3, F-U4, F-N2, F-G1, F-I3, F-I4, F-A1), each with its slug, category and segment hypothesis, and the count of existing dossiers that name it. ERCOT and PJM are listed as held. Mitsubishi Electric is recorded as named elsewhere but not approved, and the 2026-09-25 exclusions are restated so they are not re-proposed.
  - **§2 — the effort rule.** It comes from `PROFILER-COVERAGE-PLAN.md` §2's own evidence, "effort buys depth of reading, not care":
    - **xhigh** for long first-party records, heavy reconciliation and landscape re-authoring.
    - **high** for thin-record private subjects, reframes and refresh passes.
    - **medium** for bounded adjudication.
    - A confidence note states that this is judgment, not measurement.
  - **§3 — the action plan.** 21 rows in three stages with verified weekdays, interleaving the standing reminders (CoolIT 9/28, the 9/30 run, the neoclouds and Habitat pass on 10/1, the Dominion reframe 10/2–10/6, the Megmeet report by 10/31) with four batched Classroom waves. The effort mix is 12 xhigh, 6 high and 3 medium.
    - **F-H1 is first**: the only session tied to the developer's 10/7 Megmeet start. F-N1 can fold into the 10/1 pass if it slips.
    - **Recommendation:** add ERCOT and PJM in `other` after a one-paragraph schema note. This awaits the developer's decision.
  - **§4 — the F-H1 paste-in prompt** (ByteDance, Alibaba Cloud, Chindata), for xhigh. It follows the §11.4 template, with identity checks, the four premise checks to run hardest, the expected step-7 reconciliation including Chinese aka[] names, the landscape coupling, and a Megmeet hand-off paragraph.
- **`REMINDERS.md`** — a new active reminder, **check the 9/30 Classroom pipeline run once it has happened** (after ~7:30 AM ET on Wed 2026-09-30). It is additive: the developer's 2026-09-24 reminder for the same check is untouched, and the new entry says either can be dismissed once the check is done.

### Changed

- **`PROFILER-COVERAGE-PLAN.md` §11.2** — a pointer above the table recording that its Model column is superseded by the developer's 2026-09-26 decision and by the action plan. The 2026-09-25 table itself is untouched.
- **`SESSION-CONTEXT.md`** — the Latest Session is rewritten for v07.60r and v07.61r. The previous Latest moved down, and the older entry was dropped under the two-session cap.
- **README.md** — a tree entry for the action plan, plus the timestamp and repo version.

### Notes

- **No rotation:** 87 sections, well under the trigger.
- **No page, GAS script, Classroom content or Profiler dossier changed.**

## [v07.60r] — 2026-09-26 12:00:11 AM EST

> **Prompt:** "Run a Classroom session on `LightAISolutions/Sales` to re-pin `landscape-utilities-2026-09` and the three `scenario-utilities-*` rehearsals against the eleven `utility` dossiers, folding in the check of the 9/30 Classroom pipeline run.
>
> READ FIRST, in this order: `repository-information/SESSION-CONTEXT.md` (Latest Session); `.claude/rules/classroom-app.md` (the provenance stamp, Freshness, the content contract, the `gateDigest` obligation, and "Authoring a pipeline lesson" — the G3 contradiction test); `.claude/rules/industry-guidance.md` (Freshness discipline, step 10; step 7's render recipe; the content-scope rule and its landscape exception); `repository-information/CLASSROOM-SCHEMA.md`; `repository-information/CLASSROOM-CURRICULUM-PLAN.md` §10.3–10.6 (the segment-lesson generator; the landscape module; session 4's finding (j), the split between `landscape-utilities-2026-09` and `utility-aidc-procurement-2026-08`: that module owns the procurement process, the landscape owns the parties, and the landscape carries no tariff table) and §11 (the C5 ledger; design D6); `repository-information/C5-SALES-SIMULATIONS-DESIGN.md` §3, §6 and §12; the v07.40r entry in `repository-information/CHANGELOG.md` (the precedent freshness pass on this module and these scenarios); `repository-information/industry-guidance/landscape-utilities-analysis.md` (the source of truth the module JSON mirrors); the five new dossiers at v1 (`live-site-pages/profiler-data/{duke-energy,dte-energy,wec-energy,berkshire-hathaway-energy,exelon}.profile.json`), the `utilities` and `storage-developers-and-ipps` members in `profiler-segments.json`, and the F-U1/F-U2 rows of `PROFILER-COVERAGE-PLAN.md` §11.3 (the premise verdicts). Run `git fetch --unshallow origin main` before any pin read or `--check`.
>
> PART A — THE 9/30 PIPELINE RUN (the standing reminder). Open the session of the weekly Routine "Classroom curriculum pipeline (C2) - weekly" (`trig_01TiCXzEjowZGbS7aB2e6gQS`) and read its final `CLASSROOM PIPELINE — 2026-09-30 — …` report. Expected: a `COMMIT` of a briefing (the 9/23 run stood down with 4 qualifying items across 1 source against a bar of 3/2, at `coveredThrough` 2026-09-21; the 9/24 Gridmatic and Habitat Energy refreshes should supply the second source). A `STAND-DOWN` is fine if the report explains it; a `BLOCKED —` title needs a look. Also say whether a push or email notification arrived (none came for 9/21 or 9/23; if 9/30 committed and nothing arrived, the finding is that notifications do not reach the developer even for committing runs — raise with Claude support, do not change the Routine). If the run committed, `git fetch origin main` and rebase before writing anything: its commit lives inside the `// CONTENT START` … `// CONTENT END` fence you are about to edit. Report the outcome; the reminder itself is the developer's — do not close it.
>
> PART B — THE SEGMENT LESSONS (generator only, never by hand). Run `python3 scripts/build-classroom-segments.py --check`. At v07.58r it reads `utilities` and `storage-developers-and-ipps` due with section changes (`the-players`, `the-numbers`, `the-fence`, `who-is-connected`, `what-moved`, `where-it-sits`, `read-next`, `check-yourself`) from the five added profiles, and several other segments due on `concepts:`/`graph:` pin moves. Regenerate exactly the segments the check lists with sections differing — follow the check, not this sentence — and leave pin-only segments alone (G3: regenerating them rewrites dates and nothing else). Never edit a `segment-*` lesson by hand.
>
> PART C — THE LANDSCAPE MODULE. `landscape-utilities-2026-09` lives in `guidanceDocs_()` in `googleAppsScripts/Classroom/Classroom.gs` below the fence; the analysis markdown is the source of truth and the module mirrors it. Apply the G3 test section by section — for each change, write the sentence "section `<id>` teaches X; the dossiers now say Y" — and revise only where it can be written. What is known to be stale: the tiles ("14 members on record … Six incumbent, two challenger, six adjacent — measured 14 September 2026") and `short` ("Six franchises …") — the segment now holds eleven incumbents; `who-dominates-and-on-what-basis` (six incumbents named); `each-players-bet` (add a row per new member, drawn from its `strategyRead[]` and labelled analysis — Duke's self-build storage and 80-year licences, DTE's customer-funded batteries under a special contract, WEC's bespoke-resource subscription, BHE's PPA-side plan and the 25 MW LLESA, Exelon's wires-only book and the transmission security agreement); `who-threatens` (decide from the record whether a wires-only franchise and a PPA-side one change the disintermediation read); `the-indicators` (the new dated gates: the NCUC rate orders mid-November 2026 and the expedited large-load proceeding before 2027-01-01; the MPSC decision on DTE's Google contract U-22058; WEC's Q4 2026 certificate decisions and the FERC docket ER26-3265; the PUCN's 2026 IRP and LLESA decision by 2026-12-02; the ICC's 2028–2031 grid-plan order 2026-12-15; the NJ BPU on ACE Pittsgrove about February 2027; the Oregon Supreme Court on James 2026-11-03; the PowerHouse credit clause in the Northern District of Illinois); `the-sellers-play` (the instrument-first play now spans five instruments — the minimum-demand tariff, the special contract, the bespoke subscription, the LLESA generation charge, the wires-only TSA — say what that does to "identify the instrument before the account plan"); `claims-ledger` (cite the five dossiers at v1 by section, fact against analysis, as the ledger already does for the fourteen); `what-the-record-does-not-say` (no battery or turbine OEM is named by any of the five except DTE's LG Energy Solution and Reid Gardner's BYD; PacifiCorp's Utah counterparty, PECO's tariff filing and Maryland's PC72 terms are not found). Touch `drill` and `check-yourself` only if a taught claim changed. Keep the split with `utility-aidc-procurement-2026-08`: parties, not process; no tariff table. Append a `revisions[]` entry with `changed[]`, set `updated` to the session date, and re-sort `reviewBy` from the members' nearest dated gate — it is 2027-01-01 today (Dominion's large-load class) and the new members bring earlier gates; read gates in `policyExposure[]` prose as well as `effectiveDate` (§10.6 (d)). Tier stays contributor. Mirror every change into `landscape-utilities-analysis.md` with a revision section. Then check `landscape-storage-developers-and-ipps-2026-09`: Duke, DTE, WEC and BHE became adjacents of that segment; revise it only if a taught claim (a member count, an adjacent list) is contradicted, and say either way.
>
> PART D — THE THREE REHEARSALS (developer session only; the pipeline never touches a `type: "scenario"` lesson, P13; design D6). For `scenario-utilities-objection` (Dominion), `scenario-utilities-discovery` (Southern Company) and `scenario-utilities-discovery-aidc` (AEP): re-judge every beat's correct answer against the revised landscape; re-pin `guidance:landscape-utilities-2026-09` to the module's new `updated`; put in `changed[]` only the sections whose meaning changed, with a `revisions[]` note; leave the counterparty `profile:` pins where they are unless a contradiction moves them (`dominion-energy` v1, `southern-company` v2, `aep` v1 — check the registry's current versions). Do not reframe the Dominion room in this session: "reframe the Dominion rehearsal" is its own reminder for 2026-10-02 to 2026-10-06, after the Virginia and North Carolina storage solicitation issues; if this session runs inside that window, say so and leave the reframe to its own session unless the developer says otherwise. `scenario-utilities-objection`'s `reviewBy` (2026-10-01) is that reframe's gate — leave it.
>
> PART E — VERIFY, VERSION, COMMIT, PUSH. `python3 scripts/check-classroom-content.py` (0 errors, 0 warnings); `python3 scripts/check-classroom-curriculum.py --strict` (no structural findings; 0 scenarios whose landscape moved since the pin, once re-pinned); `python3 scripts/check-classroom-pipeline.py --base origin/main` (content edits do not move the gate surface — refresh `gateDigest` in `repository-information/classroom-pipeline-ledger.json` only if P3 reports a mismatch, and leave `coveredThrough` and `lastRun` alone); `python3 scripts/build-classroom-segments.py --check` (the regenerated segments no longer due with section changes); `node --check googleAppsScripts/Classroom/Classroom.gs`; render the module and the three scenarios with industry-guidance step 7's Playwright recipe, zero page errors. Versioning per CLAUDE.md: [PC-GS-VERSION] #1 — bump `VERSION` in `Classroom.gs` (v01.91g at the time of writing) and `live-site-pages/gs-versions/Classroomgs.version.txt` together, and the README tree display (`python3 scripts/check-readme-tree.py`); [PC-PAGE-CHANGELOG] #16 — a generic line in `live-site-pages/gs-changelogs/Classroomgs.changelog.md` (public: no ids, dockets or internals); [PC-CHANGELOG] #6 — the repo CHANGELOG entry with the G3 sentences per section, the segment regenerations, the scenario re-pins and the 9/30 run outcome; **rotation:** this will be the first push dated 2026-09-26 or later, so after `git fetch --unshallow origin main` move the oldest whole date groups (2026-09-18 and 2026-09-19, 26 sections, SHA-enriched) to `CHANGELOG-archive.md` until fewer than 100 non-exempt sections remain. Normal Pre-Commit and Pre-Push checklists; one commit; push on a `claude/*` branch. The affected page is Classroom (GAS-only, so the label shows the new `g` version).
>
> NEVER: edit any Profiler dossier (the five are read-only inputs at v1); fabricate a `provenance.inputs[]` entry or use a `note:` prefix; give a scenario a `report:`, `corpus:` or `briefing:` input; author or revise a `segment-*` lesson by hand; touch the AUTH region or the gate derivation; close or edit the developer's reminders. If the Fable weekly cap binds, continue on Opus 5.5 xhigh and record the substitution in the CHANGELOG entry."

The Classroom re-pin after Phase F's five utilities. `landscape-utilities-2026-09` is revised section by section under the G3 test against the five new dossiers at v1, and its review date moves to 2 December 2026. `landscape-storage-developers-and-ipps-2026-09` gets a count-only correction, because four of the five joined that segment as adjacents. The generator regenerated the 17 segment lessons `--check` listed with section changes. All five rehearsals resting on the two landscapes were re-judged and re-pinned; every beat holds. **Part A: the 9/30 pipeline run has not happened yet** — this session ran on 25–26 September. See Notes.

### Changed

#### `googleAppsScripts/Classroom/Classroom.gs` — `landscape-utilities-2026-09` (guidance, below the fence; contributor, unchanged)
- `updated` 2026-09-24 → 2026-09-26; `reviewBy` 2027-01-01 → **2026-12-02**. Inputs: `profile:duke-energy`, `profile:dte-energy`, `profile:wec-energy`, `profile:berkshire-hathaway-energy` and `profile:exelon`, all v1 @2026-09-26; `profiler-segments.json` @ v07.58r. The fourteen original dossiers are unchanged at the versions the ledger cites.
- **The G3 sentences, one per section:**
  - **`who-dominates-and-on-what-basis`** taught "six incumbents", a playbook covering "the same franchises plus four", "Southern is the one member that buys the battery itself" and "one of five machines". The five dossiers now say the segment holds eleven franchises, the playbook covers five of them, and four of the newcomers own utility batteries (DTE naming LG Energy Solution Vertech). The five are added as variants of the five instruments, which is labelled as the module's own analysis: Duke the contract, DTE, WEC and NV Energy the customer-specific charge, Exelon the collateral. The split with `utility-aidc-procurement-2026-08` held: no tariff table, channel list or buyer map was added.
  - **`who-threatens`** taught NRG's 30,713M as "the largest figure in the segment" and Vistra's 17,738M as third. `profile:duke-energy` v1 carries 32,237M, so NRG is second and Vistra seventh of twelve (DTE states no full-year revenue). The wires-only (Exelon) and PPA-side (NV Energy) test was decided from the record: **the three routes stand**. Exelon's battery petition still arrives by route two through Invenergy. NV Energy has written route two into its plan, and Nevada's 17 September approval of 362 MW of temporary gas gives route one its first commission-approved instance.
  - **`each-players-bet`** taught eight rows. It now has thirteen: Duke, DTE, WEC, Berkshire Hathaway Energy and Exelon rows are drawn from each dossier's `strategyRead[]`, labelled as analysis, with the dossier's confidence carried.
  - **`the-indicators`** taught 76 policy entries, 64 dated, and the review date of 1 January 2027. The fence is now 103 / 85 / 1 future. Nine rows are added:
    - Florida's compliant-tariff deadline, 1 October.
    - The Oregon Supreme Court argument, 3 November.
    - North Carolina's mid-November rate orders, the expedited tariff due before 1 January, and the 31 December resource-plan order.
    - The PUCN's statutory 2 December decision.
    - The ICC grid-plan order, 15 December.
    - WEC's Q4 certificates and ER26-3265.
    - The NJ BPU decision on ACE Pittsgrove, about February 2027.
    - Michigan's U-22058, undated.
    - The PowerHouse credit clause in the Northern District of Illinois, undated.

    The sales line's ratemaking count goes from three of sixteen to eight of twenty-six.
  - **`the-sellers-play`** taught three claims that the new dossiers contradict:
    - "The six franchises … five different mechanisms": the play is now two questions, **which instrument and who owns the asset under it**, because the charge design routes the battery three ways (DTE purchase order, WEC build-transfer, NV Energy PPA).
    - "Every incumbent publishes a large number it does not believe": now "most". Exelon's 36→4 GW and NV Energy's ~22→~6 GW are added, and Duke is named as the franchise that publishes no inquiry figure.
    - "Two of the three largest revenue lines are not utilities": now one.
  - **`claims-ledger`** adds 21 rows for the five at v1, by field, and re-measures the count, revenue and fence rows. The intro now labels `strategyRead[]`/`ecosystemRole` rows as analysis and the other fields as fact, and names the module's third own claim.
  - **`what-the-record-does-not-say`**:
    - Item 1 taught "two of the six" on supplier disclosure. It now counts eleven franchises: most of the owned lane names no supplier, DTE names LG Energy Solution Vertech in its own release, and NV Energy names BYD cells for one battery. (A first draft called DTE the only incumbent naming its supplier; Xcel's Form Energy battery and Southern's Wärtsilä site were found before commit and the claim was dropped.)
    - Item 3 becomes "the Texas wires incumbent", since Exelon names its security-agreement holders.
    - Item 4 now counts eleven.
    - Item 5 records Duke's named turbine supplier (GE Vernova, 26 units) against DTE, WEC and BHE naming none.
    - Item 7 adds Nevada: approved, not delivered.
    - A new item 9 lists the newcomers' unfound items: DTE's revenue, PacifiCorp's Utah counterparty, PECO's filing, Maryland's PC72 terms and the U-22058 order.
  - **`drill`** (cards 1, 2, 3 and 7) and **`check-yourself`** (items 1, 2 and 5) carried the six-incumbent, eight-player and first-and-third claims. They are corrected; no correct answer changed.
- **Outside the sections:** `short`, tiles 1 and 4, `source.doc` and five read times are updated, and a third `revisions[]` entry is appended. The function's header comment no longer says "reviewBy is 2026-10-01", which had been stale since v07.40r.
- **Why 2 December:** it is the first dated decision in the record that fixes the terms of an instrument the module teaches — the PUCN's statutory deadline on NV Energy's 2026 IRP and the form LLESA, from `berkshire-hathaway-energy` PE[1] prose. The nearer candidates were each rejected: a filing deadline (Florida, 1 October), a hearing (Oregon, 3 November), windows and deliverables (mid-November NCUC and FERC, Illinois's 15 November IRP filing), and one date on a topic the module does not teach (DTE Gas, 1 October). A sort still returns 1 January 2027. Section 13 of the analysis file has the full reasoning.

#### `googleAppsScripts/Classroom/Classroom.gs` — `landscape-storage-developers-and-ipps-2026-09` (guidance, below the fence; contributor, unchanged)
- `updated` 2026-09-14 → 2026-09-26; `reviewBy` stays 2027-01-01, since the fence still has no future effective date. **Revised because taught counts were contradicted.** Duke, DTE, WEC and BHE joined as adjacents; adjacents carry no bet, so only counts moved:

| Where | Was | Now |
|---|---|---|
| Tiles 1 and 2, ledger row 1 | 34 members — 19 · 8 · 7 | 38 — 19 · 8 · 11 |
| Tile 2 | "no other reaches 11" | utilities reaches 11 |
| Fence, in the indicators intro, not-say item 9 and a drill card | 142 / 96 | 163 / 112, latest still 1 Sep 2026 |
| Revenue and operating-KPI carriers, ledger and not-say item 2 | 7 / 3 / 27 of 34 | 10 / 7 / 27 of 38 |
| Ownership events, seller's play and a drill card | ten of thirty-four | twelve of thirty-eight — Duke Energy Florida's Brookfield minority sale and PacifiCorp's Washington sale |
| `check-yourself` rationale | seven adjacents | eleven |

- One ledger row is added. The KPI counts are read on the latest-annual-period basis, which reproduces the 14 September figures exactly. **No adjacent list is taught, so none needed correcting.** No bet, route, gate or move changed.

#### `googleAppsScripts/Classroom/Classroom.gs` — segment lessons (inside the fence; generator only, never by hand)
- `build-classroom-segments.py --segment … --today 2026-09-26` regenerated exactly the 17 segments `--check` listed with sections differing. Every one moved `concepts:profiler-concepts` 2026-09-19 → 2026-09-26 and `graph:profiler-graph` → 2026-09-26.
  - **`utilities`** and **`storage-developers-and-ipps`** changed `the-players`, `the-numbers`, `the-fence`, `who-is-connected`, `what-moved`, `where-it-sits`, `read-next` and `check-yourself`. `utilities` added five profiles @2026-09-26 and `storage-developers-and-ipps` four, plus `gridmatic` 2026-09-12 → 2026-09-24.
  - **`aidc-developers-and-landlords`** changed `what-moved`, `where-it-sits` and `who-is-connected` (`tract` → 2026-09-26, `powerhouse-data-centers` → 2026-09-26).
  - **`software-and-optimization`** changed `what-moved` and `where-it-sits` (`gridmatic`, `habitat-energy` → 2026-09-24).
  - **`epc-and-construction`**, **`neoclouds`** and **`capital`** changed `where-it-sits` and `who-is-connected`.
  - `where-it-sits` only: `cells-and-chemistry` and `storage-integrators-and-containers` (`narada` → 2026-09-24), `power-conversion-and-rack-power-silicon`, `grid-equipment`, `in-hall-power`, `bridge-and-on-site-generation`, `clean-firm-and-nuclear`, `cooling`, `hyperscalers-and-ai-labs` and `assurance`.
- **Pin-only and left alone (G3):** `compute-and-the-rack` and `insurance-and-risk-transfer`. `--check` now reads 2 due, 0 with section changes. The content checker's four `the-players`/registry errors on `segment-utilities` and `segment-storage-developers-and-ipps` are cleared.

#### `googleAppsScripts/Classroom/Classroom.gs` — rehearsal scenarios (developer session, design D6)
- **`scenario-utilities-objection`** (Dominion; guidance, unchanged):
  - Changed: `what-the-record-does-not-say`. It taught "two of the six franchises run open storage solicitations and neither one's battery supplier is discoverable"; the landscape now counts eleven, most of whose owned lane names no supplier. The advice stands.
  - Pin `guidance:landscape-utilities-2026-09` 2026-09-24 → 2026-09-26. `reviewBy` **stays 2026-10-01**, the reframe's gate.
  - The room was not reframed: this session ran before the 2–6 October window.
- **`scenario-utilities-discovery`** (Southern):
  - Changed: `claims-ledger`. "Every incumbent … publishes a large number" becomes "most"; this buyer's 75 GW against 17 GW is unchanged.
  - Pin → 2026-09-26. `reviewBy` stays 2026-11-03.
- **`scenario-utilities-discovery-aidc`** (AEP):
  - Changed: `the-position` and `claims-ledger`. "Every incumbent" becomes "most", and the review-date row is rewritten because the landscape's bound is now nearer than this scenario's own 10 December gate.
  - Pin → 2026-09-26. `reviewBy` 2026-12-10 → **2026-12-02**.
- **`scenario-storage-developers-and-ipps-objection`** and **`scenario-storage-developers-and-ipps-discovery`**: changed none (re-judged and re-stamped). Pin `guidance:landscape-storage-developers-and-ipps-2026-09` 2026-09-14 → 2026-09-26; `reviewBy` stays 2027-01-01. Each gets its first `revisions[]` entry.
- **All fifteen beats hold.** Counterparty pins are unchanged: `dominion-energy` v1 @2026-09-03, `southern-company` v2 @2026-09-05 and `aep` v1 @2026-09-03 are the registry's current versions. `project:stargate`, `aypa-power`, `canadian-solar` and `spearmint-energy` are also unchanged.

#### `repository-information/industry-guidance/`
- **`landscape-utilities-analysis.md`** — a current-state pointer under the provenance line, and **§13, the 26 September 2026 re-pin**. It carries the segment re-measured, the G3 sentence per section, the review-date judgment with every rejected candidate, the scenarios re-judged, and what was flagged but not changed.
- **`landscape-storage-developers-and-ipps-analysis.md`** — a pointer, and **§12, the count correction**, including how the two ownership events were counted.

#### Versions
- Classroom GAS v01.91g → **v01.92g**: `Classroom.gs` `VERSION`, `Classroomgs.version.txt` and the README tree display. `Classroomgs.changelog.md` gets generic lines only.

### Notes
- **Part A — the 9/30 Classroom pipeline run.** This session ran from 11:11 PM on 25 September to the early hours of 26 September (EST), five days before that run.
  - `get_trigger` on `trig_01TiCXzEjowZGbS7aB2e6gQS` returned: enabled, cron `0 11 * * 3`, `last_fired_at` 2026-09-23T11:08Z with `last_run` SUCCEEDED (session `cse_01BrH9eZymwoEYBdFeBFYzjv`, the 9/23 stand-down), `next_run_at` **2026-09-30T11:02Z**, and notifications push and email both on.
  - **There is no 9/30 report to read, no notification to check yet, and no pipeline commit to rebase over.** `origin/main` was fetched before the push and no pipeline commit had landed.
  - The developer's reminder is untouched and stays open for its own date.
  - What the 9/30 run will find from this push: the five scenarios' landscape pins now match their landscapes, so nothing lands under *Needs the developer* for them. `coveredThrough` (2026-09-21) and `lastRun` are untouched.
- **Checkers (final run, before commit):**
  - `check-classroom-content.py`: 71 lessons / 8 tracks / 220 gate cases, **0 errors, 0 warnings**, down from 4 errors at session start.
  - `check-classroom-curriculum.py --strict`: no structural findings; **0 scenarios whose landscape moved since the pin**.
  - `build-classroom-segments.py --check`: 2 due, 0 with section changes.
  - `node --check` on a `.js` copy: clean. `check-gas-inner-scripts.js`: all 106 blocks parse. `check-readme-tree.py`: 0 findings.
  - `check-classroom-pipeline.py --selftest`: 15 fixtures, 0 failures.
  - Playwright render (industry-guidance step 7 recipe, contributor session) of both landscapes and all five rehearsals: **0 page errors**, no literal `**` or `{{` in the rendered text.
- **`check-classroom-pipeline.py --base origin/main`** reports P1, P2, P10 and P13 only, all expected on a developer commit:
  - P1: the two analysis files are outside the committer's write set.
  - P2: two guidance modules are below the fence.
  - P10: 22 revised lessons — 17 regenerated segments and 5 scenarios.
  - P13: design D6 reserves scenario revisions for a developer session.
  - **No P3, so `gateDigest` is untouched.**
- **Flagged, not changed — the brief's OEM line.** It said no battery or turbine OEM is named by any of the five except DTE's LG Energy Solution and Reid Gardner's BYD. `duke-energy` v1 names **GE Vernova** as its turbine supplier (26 units), and the module follows the dossier. The coverage plan's "no OEM" line for Duke concerns batteries.
- **Carried, not taught:** the unreconciled figures the Profiler session left loud (Oracle vs DTE storage dollars, MasTec vs BHE Greenlink, Exelon's TSA-backed GW against flat collateral, Compass Hoffman Estates), AEP's "six of eight" and Dominion's "all-stock" description (the reframe session's).
- **Also moved beneath a landscape this session did not revise:** `tract` v4 and `powerhouse-data-centers` v3 sit under `landscape-aidc-developers-and-landlords-2026-09`. No scenario on it shows as moved, because its `updated` did not change. Not examined here; a candidate for that landscape's next review.
- **Archive rotation performed — the first push dated 2026-09-26 EST.** `TZ=America/New_York date` read 2026-09-26 12:00 AM, after an explicit wait past midnight so the push could not land on 9/25. The count was 112 raw with 1 exempt (this section), so 111 non-exempt.
  - The 2026-09-18 group (8 sections, v06.49r–v06.56r) rotated, leaving 103 — still at or above the trigger.
  - The 2026-09-19 group (18 sections, v06.57r–v06.74r) rotated, leaving **85 non-exempt, below 100**.
  - All 26 are SHA-enriched from a deepened clone, and `git log --all` resolved 26 of 26. Post-rotation verification (`grep '^## \[v' CHANGELOG-archive.md | grep -v '— \['`) returns nothing.
  - The move is byte-exact: the CHANGELOG lost only the rotated tail and the archive gained only it. Two pre-existing blank-line irregularities stay where they were — the missing blank line above v07.14r (not rotated), and a doubled blank line inside the rotated v06.53r section, which moved verbatim.
  - Counter `Sections: 111/100` → **`86/100`**. `Classroomgs.changelog.md` 43/50 → 44/50; no rotation.

## [v07.59r] — 2026-09-25 11:09:11 PM EST

> **Prompt:** "give me a prompt to paste into a new session (Fable 5.1 or Opus 5.5, Medium, High, Xhigh effort) to run a Classroom session to re-pin landscape-utilities-2026-09 and the three scenario-utilities-* lessons against the eleven utility dossiers, folding it into the 9/30 Classroom run already on my reminders. Then, remember session."

The hand-off from Phase F waves 1 and 2: the Classroom session that repairs what five new `utility` dossiers made stale is now a paste-in prompt in the repo, and the session context is saved.

### Added

- **`repository-information/classroom-utilities-repin-prompt.md`** — the paste-in prompt, in five parts, for a fresh Opus 5.5 xhigh session (Fable 5.1 High acceptable) on or after Wednesday 2026-09-30 after about 7 AM ET: **A** the 9/30 C2 pipeline-run check from the standing reminder (expected outcome, the notification question, rebase-if-it-committed); **B** segment-lesson regeneration by `build-classroom-segments.py` only — at v07.58r the check reads `utilities` and `storage-developers-and-ipps` due with eight sections differing; **C** `landscape-utilities-2026-09` under the G3 contradiction test — the "14 members / six franchises" tiles, the bets table's five new rows, the new dated gates (NCUC, MPSC U-22058, WEC's Q4 dockets and ER26-3265, PUCN 2026-12-02, ICC 2026-12-15, NJ BPU ~Feb 2027, the Oregon Supreme Court, the PowerHouse credit clause), the five-instrument seller's play, the claims ledger at v1, `reviewBy` re-sorted from the nearest gate, the analysis markdown mirrored, and a G3 check of `landscape-storage-developers-and-ipps-2026-09`'s member counts; **D** the three `scenario-utilities-*` rehearsals re-judged and re-pinned under D6/P13, with the Dominion room reframe left to its own 10/2–10/6 reminder; **E** the checkers, the Playwright render, the Classroom GAS bump, the public changelog line, and the CHANGELOG archive rotation that push will owe. Recommended model and timing are stated at the top.

### Changed

- **`REMINDERS.md`** — a fold-in pointer added under the developer's 9/30 Classroom-run reminder naming the prompt file (additive; the reminder's own text is untouched).
- **`SESSION-CONTEXT.md`** — the Latest Session extended in place for this turn (repo version, the prompt file, and the recommendation now pointing at it).
- **README.md** — tree entry for the prompt file.

### Notes

- **Archive rotation not performed:** 111 sections, thirteen dated today (EST) and exempt, 98 non-exempt against a trigger of 100. The Classroom re-pin push will be the first dated 2026-09-26 or later and must rotate; the prompt says so.

## [v07.58r] — 2026-09-25 10:53:01 PM EST

> **Prompt:** "Picking up from my last session, run Phase F sessions F-U1 and F-U2 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: Duke Energy, DTE Energy and WEC
> Energy (F-U1), then Berkshire Hathaway Energy (NV Energy) and Exelon (F-U2).
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the
> five F-U1/F-U2 rows of §11.3 are yours); .claude/rules/profiler-app.md (Profiler Command including step
> 1a identity and step 7 reconciliation, Profiler Prep Command, Scheduled Refreshes);
> repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments registry, Refresh calendar);
> repository-information/PROFILER-STYLES.md (active style intel-briefing). Read the dominion-energy,
> southern-company and aep dossiers and study guides as the house pattern for a utility.
>
> TWO WAVES, TWO PUSHES — I am explicitly asking for two separate push commits:
> - Wave 1: Duke Energy, DTE Energy, WEC Energy -> commit and push.
> - Wave 2: Berkshire Hathaway Energy, Exelon -> commit and push once wave 1's branch has merged
>   (Pre-Push #5 push-once).
> If the session runs short, stop cleanly after wave 1 and hand wave 2 back to me as a prompt.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories ["utility"]) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Populate aka[] BEFORE the step-7 grep (operating utilities
> and former names: ComEd, Commonwealth Edison, PECO, BGE, Pepco, Delmarva, Atlantic City Electric; NV
> Energy, Nevada Power, Sierra Pacific, PacifiCorp, MidAmerican; Duke Energy Carolinas / Progress /
> Florida / Indiana / Ohio, Piedmont; DTE Electric; We Energies, Wisconsin Public Service). Assign segments
> in live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: `utilities` ·
> incumbent; `storage-developers-and-ipps` · adjacent only where utility-owned storage is material in the
> dossier). Then the registry sync, the graph build, a dated calendar row per company (all five file with
> the SEC — research each Q3 2026 earnings date), README tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — check at least: Brookfield's 19.7% Duke Energy Florida stake (first closing not
> confirmed); BHE is 100% Berkshire and PacifiCorp is selling its Washington operations to Portland
> General (close 2027); nothing known for DTE, WEC or Exelon — verify anyway. Proposed slugs: duke-energy,
> dte-energy, wec-energy, berkshire-hathaway-energy, exelon. Decide BHE's display name under Naming and
> renames; the precedent for a holding company taught through its lead utility is Southern Company.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify every figure against
> first-party sources (10-K and 10-Q, the Q2 2026 decks, state PUC dockets, and EEI's "Large Load Projects
> and Tariffs" list updated 11 Sep 2026), record a premise verdict per clause, and rewrite the cells.
>
> RECONCILIATION (step 7) — expected inbound: Exelon/ComEd ~19 dossiers, NV Energy/BHE/PacifiCorp ~18,
> Duke ~10, DTE ~9, WEC ~4. Known drift candidates, all agent-reported and unread:
> - powerhouse-data-centers says ComEd's Joliet TSA was lost in July; Utility Dive reported FERC rejected
>   ComEd's cancellation notice on 22 Sep 2026, leaving the dispute in federal court.
> - tract carries NV Energy's July lawsuit and a pending PUCN gas-plant decision; the PUCN reportedly
>   approved the two plants conditionally around 19 Sep 2026.
> - lg-energy-solution carries the DTE 6 GWh LGES Vertech deal — check that both sides agree.
> - DTE's Saline-linked storage is 1.4 GW in one source and 332 MW in the MPSC approval; state both unless
>   a source reconciles them.
> If BHE's or Exelon's reconciliation outgrows the session, say so and defer it per step 7's scope note.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. Five new utilities make landscape-utilities-2026-09
> (built on "six franchises") and the three scenario-utilities-* rehearsals stale; record that in the
> CHANGELOG entry and the SESSION-CONTEXT hand-off instead (§11.2, the landscape coupling).
>
> CHANGELOG: the first push dated 2026-09-26 or later must rotate. Run `git fetch --unshallow origin main`
> first, then move the oldest whole date groups with SHA enrichment until fewer than 100 non-exempt
> sections remain.
>
> VERIFY per wave: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check
> clean; build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new dossier and guide renders (Playwright) with zero page errors. If the Fable weekly
> cap binds, continue on Opus 5.5 xhigh and record the substitution in the §11.3 Model cell. Normal
> Pre-Commit and Pre-Push checklists; push on a claude/* branch."

**Phase F, wave 2 (F-U2) — Berkshire Hathaway Energy and Exelon** join the Profiler corpus as the tenth and eleventh `utility` dossiers, each with a v2 study guide and a lesson plan, as the second of the two pushes the prompt asked for (wave 1 was v07.57r). Step-7 reconciliation revised two existing dossiers — `tract` to v4 and `powerhouse-data-centers` to v3 — against the drift candidates the prompt named.

### Added

- **Two schema v7 dossiers** (`profileVersion` 1, `categories: ["utility"]`, intel-briefing style), each from two parallel subagents under the shared two-stage protocol. SEC hosts refused the sandbox throughout, and both companies' investor sites were unreadable (brkenergy.com WAF-blocked; investors.exeloncorp.com HTTP 503), so filings came from Berkshire's 10-Qs, the annualreports.com and last10k mirrors, transcripts and the 8-K mirror.
  - **`berkshire-hathaway-energy.profile.json`** — 88 sources, 40 developments, 6 products, 18 relationships, 9 decision makers, no photos (brkenergy.com blocked; nvenergy.com renders no server-side content). **Display name decided as "Berkshire Hathaway Energy"** on the Southern Company precedent — the holding company, taught through its lead utility — with NV Energy, Nevada Power, Sierra Pacific, PacifiCorp, Rocky Mountain Power, Pacific Power, MidAmerican, BHE Renewables, BHE Transmission, BHE GT&S, Northern Natural Gas, Northern Powergrid, AltaLink and CalEnergy in `aka[]`. `ownership.type` is `subsidiary` (100% Berkshire; no ticker; an SEC registrant through its debt) and `financials.type` is `private` (no EPS, no consensus, no calls).
  - **`exelon.profile.json`** — 106 sources, 41 developments, 6 products, 19 relationships, 9 decision makers; seven executive photos from exeloncorp.com (Butler, Jones, Quiniones, Innocenzo, Khouzami, Olivier, Honorable), cropped from the company's banner templates to 480 px squares. `aka[]`: ComEd, Commonwealth Edison, PECO, BGE, Pepco, Pepco Holdings, PHI, Delmarva Power, Atlantic City Electric, ACE.
- **Two schema v2 study guides** — `berkshire-hathaway-energy.study.json` and `exelon.study.json` (14 sections each, flashcards and a self-test) — and **two lesson plans** under `repository-information/study-prep/<slug>/`, five modules each.
- **13 new concepts** in `profiler-concepts.json` (1,503 total): `mobile-sierra`, `clean-transition-tariff`, `line-extension-agreement`, `load-commitment-agreement`, `price-collar`, `reliability-backstop`, `energy-imbalance-market`, `sale-leaseback`, `indexed-storage-credit`, `coal-to-gas-conversion`, `show-cause-order`, `utility-owned-generation`, `distribution-only-service`. Three drafted concepts were dropped because the checker found their terms already aliased elsewhere: `base-residual-auction` (an alias of `capacity-market`), `resource-adequacy` (of `planning-reserve-margin`) and `wires-only-utility` (of `vertically-integrated-utility`).
- **Archived dossiers:** `archive/tract.profile.v3.json` and `archive/powerhouse-data-centers.profile.v2.json`, with `archive-index.json` entries and README tree lines.

### Changed

- **`profiler-companies.json`** — 180 → 182 entries. **`profiler-segments.json`** — `berkshire-hathaway-energy`: `utilities` · incumbent and `storage-developers-and-ipps` · adjacent (the tolling counterparty on 5,405 MW of new battery PPAs plus owned Reid Gardner and Sierra Solar); `exelon`: `utilities` · incumbent only — it owns no generation or storage, and ACE's 500 MW Pittsgrove battery is a petition, to be revisited on the ~February 2027 BPU decision. **`profiler-graph.json`** — rebuilt, 1,560 edges.
- **`profiler-refresh-calendar.json`** — `berkshire-hathaway-energy` 2026-11-06 (unconfirmed; the inferred 10-Q date from the Q3 2025 pattern, Berkshire's release the Saturday after) and `exelon` 2026-11-03 (unconfirmed; tracker estimate, no company notice yet). **`profiler-refresh-notes.json`** — a source and a `watch[]` list for each.
- **`tract.profile.json` v3 → v4** — the PUCN's decision on Fleet's 362 MW of temporary gas plants, which the dossier carried as scheduled for 8 September 2026 in six places, is now the conditional approval of 17 September 2026; the Morris ComEd TSA's acceptance date corrected from "April 2026" (Tract's announcement) to 10 March 2026 (ER26-3100) in four places; two developments (the approval; Governor Lombardo's EO 2026-005) and four sources added; two relationships added — `berkshire-hathaway-energy` (NV Energy as the utility and litigant) and `exelon` (ComEd's TSA).
- **`powerhouse-data-centers.profile.json` v2 → v3** — FERC's 22 September 2026 rejection of ComEd's cancellation of the Joliet TSA, with the $1 letter-of-credit question left to the Northern District of Illinois, recorded in the technical specs, policy exposure, financial commentary and the indicator-to-watch it resolves; two developments and three sources added; an `exelon` relationship added.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the two F-U2 rows rewritten with a premise verdict per clause, `Checked 2026-09-26, v07.58r`, Dossier v1, Guide v2. The identity findings the prompt asked for:
  - **BHE:** 100% Berkshire — held. The ">9 GW contracted (Mar 2026)" clause — **superseded**: the March 2026 presentation says approximately 11,000 MW; 9 GW is the FY2024 figure. The Tract approval date refined from ~19 to 17 September; the lawsuit date held (Friday 24 July). PacifiCorp's Washington sale held ($1.9B, agreement 15 February 2026, close H1 2027). Nothing else was found to be for sale.
  - **Exelon:** independent; no re-merger reporting found. The "25 GW vs 36 GW" conflict resolved as definitional (36 GW is the refined queue of 4 + 7 + 25; 25 GW is the under-study rung). Rider DE, the PowerHouse sequence, the ACE battery and the $41.7B plan all held. Stated but unreconciled: TSA-backed load fell from ~8 GW (45% of 18) to 4 GW between Q4 2025 and Q2 2026 while collateral stayed at ~$1B — the decks were unreadable.
- **README.md** — tree entries for the two profile/study pairs, the two study-prep directories and the two archived dossiers.
- **`SESSION-CONTEXT.md`** — Latest Session written for the hand-off (Phase F waves 1 and 2 complete; the stale Classroom lessons; the remaining Phase F sessions).

### Notes

- **Step-7 reconciliation** — BHE: 20 dossiers matched by alias, 13 substantive claims read, 1 dossier changed (`tract`); the MasTec dossier's "$4.2B Greenlink West program" against BHE's $4.2B for Greenlink West and North combined is stated in the relationship context, not reconciled. Exelon: 19 dossiers matched, 12 claims read, 1 dossier changed (`powerhouse-data-centers`), with the Tract Morris date folded into the tract revision; the Compass dossier's mid-2026 Hoffman Estates energization target is stated against the July 2026 rezoning withdrawal, not reconciled. The `powerhouse` dossier's "TSA accepted 11 March" (Utility Dive's publication date) against the order date of 10 March is left as is.
- **Classroom lessons now stale, by design — hand-off item:** `landscape-utilities-2026-09` was built on "six franchises" and there are now eleven `utility` dossiers; the three `scenario-utilities-*` rehearsals cite it. `Classroom.gs` was not edited in either wave — a Profiler session never touches it. A Classroom session should re-pin the landscape and the three scenarios against the five new dossiers.
- **Checkers:** `sync-profiler-registry.py --check` clean (182 in bijection); `check-profiler-study.py` 0 errors after the three concept drops; `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates (exit 0; 32 over-cap scopes not examined, as before); `check-readme-tree.py` 0 findings; `check-profiler-reports.py` the same two pre-existing warnings (`jinko` v6 vs pinned v5; `oracle` v5 vs pinned v4), read and left loud.
- **Playwright:** both new dossiers and guides, and the revised `tract` and `powerhouse-data-centers` dossiers, render on `Profiler.html` with zero console errors and zero unresolved `{{}}` terms; the only page error is the auth-wall's `gis_load_failed`, as in wave 1. `Profiler.html` is unchanged (data-only), so no page version bump.
- **Archive rotation not performed:** 110 sections, of which twelve are dated today (EST) and exempt, leaving 98 non-exempt against a trigger of 100. This push is dated 2026-09-25 EST, so the "first push dated 2026-09-26" rotation the prompt anticipated did not fall due; the next push after midnight EST must rotate the 2026-09-18 and 2026-09-19 date groups (26 sections) — `git fetch --unshallow` first.

## [v07.57r] — 2026-09-25 10:13:13 PM EST

> **Prompt:** "Picking up from my last session, run Phase F sessions F-U1 and F-U2 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: Duke Energy, DTE Energy and WEC
> Energy (F-U1), then Berkshire Hathaway Energy (NV Energy) and Exelon (F-U2).
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the
> five F-U1/F-U2 rows of §11.3 are yours); .claude/rules/profiler-app.md (Profiler Command including step
> 1a identity and step 7 reconciliation, Profiler Prep Command, Scheduled Refreshes);
> repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments registry, Refresh calendar);
> repository-information/PROFILER-STYLES.md (active style intel-briefing). Read the dominion-energy,
> southern-company and aep dossiers and study guides as the house pattern for a utility.
>
> TWO WAVES, TWO PUSHES — I am explicitly asking for two separate push commits:
> - Wave 1: Duke Energy, DTE Energy, WEC Energy -> commit and push.
> - Wave 2: Berkshire Hathaway Energy, Exelon -> commit and push once wave 1's branch has merged
>   (Pre-Push #5 push-once).
> If the session runs short, stop cleanly after wave 1 and hand wave 2 back to me as a prompt.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories ["utility"]) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Populate aka[] BEFORE the step-7 grep (operating utilities
> and former names: ComEd, Commonwealth Edison, PECO, BGE, Pepco, Delmarva, Atlantic City Electric; NV
> Energy, Nevada Power, Sierra Pacific, PacifiCorp, MidAmerican; Duke Energy Carolinas / Progress /
> Florida / Indiana / Ohio, Piedmont; DTE Electric; We Energies, Wisconsin Public Service). Assign segments
> in live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: `utilities` ·
> incumbent; `storage-developers-and-ipps` · adjacent only where utility-owned storage is material in the
> dossier). Then the registry sync, the graph build, a dated calendar row per company (all five file with
> the SEC — research each Q3 2026 earnings date), README tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — check at least: Brookfield's 19.7% Duke Energy Florida stake (first closing not
> confirmed); BHE is 100% Berkshire and PacifiCorp is selling its Washington operations to Portland
> General (close 2027); nothing known for DTE, WEC or Exelon — verify anyway. Proposed slugs: duke-energy,
> dte-energy, wec-energy, berkshire-hathaway-energy, exelon. Decide BHE's display name under Naming and
> renames; the precedent for a holding company taught through its lead utility is Southern Company.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify every figure against
> first-party sources (10-K and 10-Q, the Q2 2026 decks, state PUC dockets, and EEI's "Large Load Projects
> and Tariffs" list updated 11 Sep 2026), record a premise verdict per clause, and rewrite the cells.
>
> RECONCILIATION (step 7) — expected inbound: Exelon/ComEd ~19 dossiers, NV Energy/BHE/PacifiCorp ~18,
> Duke ~10, DTE ~9, WEC ~4. Known drift candidates, all agent-reported and unread:
> - powerhouse-data-centers says ComEd's Joliet TSA was lost in July; Utility Dive reported FERC rejected
>   ComEd's cancellation notice on 22 Sep 2026, leaving the dispute in federal court.
> - tract carries NV Energy's July lawsuit and a pending PUCN gas-plant decision; the PUCN reportedly
>   approved the two plants conditionally around 19 Sep 2026.
> - lg-energy-solution carries the DTE 6 GWh LGES Vertech deal — check that both sides agree.
> - DTE's Saline-linked storage is 1.4 GW in one source and 332 MW in the MPSC approval; state both unless
>   a source reconciles them.
> If BHE's or Exelon's reconciliation outgrows the session, say so and defer it per step 7's scope note.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. Five new utilities make landscape-utilities-2026-09
> (built on "six franchises") and the three scenario-utilities-* rehearsals stale; record that in the
> CHANGELOG entry and the SESSION-CONTEXT hand-off instead (§11.2, the landscape coupling).
>
> CHANGELOG: the first push dated 2026-09-26 or later must rotate. Run `git fetch --unshallow origin main`
> first, then move the oldest whole date groups with SHA enrichment until fewer than 100 non-exempt
> sections remain.
>
> VERIFY per wave: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check
> clean; build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new dossier and guide renders (Playwright) with zero page errors. If the Fable weekly
> cap binds, continue on Opus 5.5 xhigh and record the substitution in the §11.3 Model cell. Normal
> Pre-Commit and Pre-Push checklists; push on a claude/* branch."

**Phase F, wave 1 (F-U1) — Duke Energy, DTE Energy and WEC Energy Group** join the Profiler corpus as the seventh, eighth and ninth `utility` dossiers, each with a v2 study guide and a lesson plan. Wave 2 (F-U2, Berkshire Hathaway Energy and Exelon) is researched but not authored — it follows in the next push once this branch has merged, exactly as the prompt asked for two pushes.

### Added

- **Three schema v7 dossiers** (`profileVersion` 1, `categories: ["utility"]`, intel-briefing style), each researched by two parallel subagents under a shared two-stage protocol (first-party filings and decks, then dockets and trade press). The SEC's own host refused the sandbox, so every filing was read from the company's investor mirror.
  - **`duke-energy.profile.json`** — 116 sources (51% first-party), 37 developments, 8 products, 13 relationships, 7 decision makers. No photos: `duke-energy.com` returns 403 to the sandbox. `aka[]`: Duke Energy Carolinas, Duke Energy Progress, Duke Energy Florida, Duke Energy Indiana, Duke Energy Ohio, Duke Energy Kentucky, Piedmont Natural Gas.
  - **`dte-energy.profile.json`** — 106 sources, 29 developments, 5 products, 9 relationships; four executive photos (Harris, Ruud, Lauer, Tomina — Paul's download failed twice on a 502, so the entry carries none). `aka[]`: DTE Electric, DTE Gas, Detroit Edison, DTE Vantage.
  - **`wec-energy.profile.json`** — 80 sources, 32 developments, 7 products, 12 relationships; five photos (Lauber, Liu, Hooper, Krueger, Garvin). `aka[]`: We Energies, Wisconsin Electric, Wisconsin Public Service, WPS, Peoples Gas, North Shore Gas, Wisconsin Gas, Michigan Gas Utilities, Minnesota Energy Resources, Bluewater, Upper Michigan Energy Resources.
- **Three schema v2 study guides** — `duke-energy.study.json` (16 sections), `dte-energy.study.json` (14), `wec-energy.study.json` (13) — each with flashcards and a self-test, and **three lesson plans** under `repository-information/study-prep/<slug>/`, five modules each, at the high-school-STEM baseline.
- **13 new concepts** in `profiler-concepts.json` (1,490 total): `special-contract`, `contested-case`, `ex-parte`, `zonal-resource-credit`, `bespoke-resource`, `minimum-transmission-charge`, `certificate-of-necessity` (the `CON` alias was dropped — it already belongs to `certificate-of-need`), `subsequent-license-renewal`, `letter-agreement`, `compressed-air-energy-storage`, `nuclear-ptc`, `equity-units`, `atm-program`.
- **Nine executive photos** under `live-site-pages/images/execs/` (`dte-energy-*`, `wec-energy-*`), company-published.

### Changed

- **`profiler-companies.json`** — 177 → 180 entries, with taglines, `aka[]` and `domains[]` populated before the step-7 grep.
- **`profiler-segments.json`** — all three assigned `utilities` · incumbent, and `storage-developers-and-ipps` · adjacent with a basis line each (Duke ~4.5 GW of utility-owned batteries by 2031; DTE 1,383 MW customer-funded storage; WEC 2,130 MW bought build-transfer from Invenergy).
- **`profiler-graph.json`** — rebuilt, 1,523 edges.
- **`profiler-refresh-calendar.json`** — three dated rows, each researched: `duke-energy` 2026-11-05 (unconfirmed, pattern), `dte-energy` 2026-10-22 (unconfirmed, pattern), `wec-energy` 2026-10-29 (confirmed). **`profiler-refresh-notes.json`** — a source and a `watch[]` list per slug.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the three F-U1 rows rewritten from hypotheses into verified cells with a premise verdict per clause, `Checked 2026-09-26, v07.57r`, Dossier v1, Guide v2. The identity findings the prompt asked for:
  - **Brookfield / Duke Energy Florida — the plan cell was wrong.** The first closing is confirmed: 2026-03-03, 9.2% for $2.8B (8-K), toward 19.7%. Piedmont's Tennessee operations were sold to Spire (closed 2026-03-31).
  - **DTE** — no stake or sale found; the Google Van Buren contract (U-22058) had no MPSC decision through 2026-09-25. The Saline storage figure is stated both ways in the dossier: 1,383 MW approved for the Oracle load, against the 332 MW the earlier corpus carried.
  - **WEC** — no stake or sale found; the VLC docket is `6630-TE-113`, not `5-UR-110`; Meta Beaver Dam is Alliant's load, not WEC's.
- **README.md** — tree entries for the three profile/study pairs and the three study-prep directories.

### Notes

- **Step-7 reconciliation** — inbound claims read against the new dossiers: Duke 8 (0 changed), DTE 6 (0 changed; the Oracle dossier's "~$300M" against DTE's "nearly $2B" is stated in the relationship context, not reconciled), WEC 4 (0 changed). No other dossier was edited, so no archive step ran. The `lg-energy-solution` DTE claim (1.5 GW / 6 GWh, $1.6B) agrees on both sides.
- **Classroom lessons now stale, by design:** `landscape-utilities-2026-09` was built on "six franchises" and there are now nine; the three `scenario-utilities-*` rehearsals cite it. `Classroom.gs` was not edited — a Profiler session never touches it — so those lessons are due for a re-pin in a Classroom session, and the SESSION-CONTEXT hand-off will say so once wave 2 lands.
- **Checkers:** `sync-profiler-registry.py --check` clean (roster ↔ calendar bijection holds); `check-profiler-study.py` 0 errors; `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates; `check-readme-tree.py` 0 findings; `check-profiler-reports.py` reports two pre-existing warnings (`jinko` v6 against pinned v5, `oracle` v5 against pinned v4), read and left loud.
- **Playwright:** all three dossiers and guides render on `Profiler.html` with zero console errors and zero unresolved `{{}}` terms; the only page error is the auth-wall's `gis_load_failed`, the Google Identity script the sandbox cannot fetch. `Profiler.html` itself is unchanged (data-only), so no page version bump.
- **Archive rotation not performed:** 109 sections, of which eleven are dated today (EST) and exempt, leaving 98 non-exempt against a trigger of 100. The wave-2 push will cross midnight EST and must rotate — the 2026-09-18 and 2026-09-19 date groups (26 sections) are the ones that go.

## [v07.56r] — 2026-09-25 08:38:39 PM EST

> **Prompt:** "I approve of adding all companies you recommended above. Give me a prompt to paste into a new Opus 5.5 or Fable 5.1 Medium, High, or Xhigh session to run the five utility-batch companies."

Recorded the developer's approval of the 2026-09-25 thin-category recommendation as **Phase F** of the Profiler coverage plan, and wrote the paste-in prompt for its first session. No dossier was written.

The recommendation came from the previous turn's research, which committed nothing:
- a word-bounded, alias-aware mention count of ~300 uncovered names across every dossier, study guide, report and `Classroom.gs`;
- four parallel web-research subagents that re-checked each candidate's identity against sources from the last twelve months. All four exhausted the session's 200-call search budget partway through.

### Added

- **`PROFILER-COVERAGE-PLAN.md` §11 — Phase F, the thin-category fill.** 37 companies in 13 sessions; the categories stood at investor 5 · utility 6 · neocloud 7 · gc 7 · advisor 8 · hyperscaler 8 of 177.
  - **§11.1 — how the list was chosen:** corpus pull, buying authority, seat fit and identity. It also lists the excluded candidates with a reason each, so they are not re-proposed: passive investors, the banks, DigitalBridge, PG&E/SCE/Sempra/CenterPoint/FirstEnergy, tenant neoclouds, and Clean Energy Associates, already covered inside `intertek`.
  - **ERCOT and PJM are held for a developer decision.** They are the two most-cited uncovered entities (73 and 37 dossiers), but they are grid operators, and adding them would mean first using the `other` category.
  - **§11.2 — sessions, order and model under the §2 rule:** utilities first, because `utilities` is the only segment in both sales seats. F-N1 is timed to the 10/1 neoclouds pass and F-H1 before the 10/7 Megmeet start. It also records the landscape coupling: new members make `landscape-utilities-2026-09`, `landscape-capital-2026-09` and `landscape-neoclouds-2026-09` stale, and a Profiler session never edits `Classroom.gs`.
  - **§11.3 — the ledger:** one row per company, with proposed slug, categories, segment-role hypothesis, model, and inbound-dossier count. The `Why` cells are marked unverified prompt material, as in §5 and §8.
  - **§11.4 — the paste-in prompt for F-U1 + F-U2:** Duke Energy, DTE Energy, WEC Energy, then Berkshire Hathaway Energy (NV Energy) and Exelon.
    - It runs as two explicitly requested pushes, on Fable 5.1 High, with Opus 5.5 xhigh as the recorded substitution.
    - It names the known drift candidates for step-7 reconciliation, and warns that the first push dated 2026-09-26 must rotate the CHANGELOG.
- **Plan intro:** now points at §11.

## [v07.55r] — 2026-09-25 07:44:52 PM EST

> **Prompt:** "I set the discovery cron in my local terminal. See attached screenshot for the run report. Let me know if this action #12R is closed or not; If not, recommend the next action. If 12R is complete, also confirm if I am completely done with all Phase A tasks."

Closed phase R (#12R). The discovery Routine exists with the repository attached, its quarterly cron is set, and its first run stood down with a full report.

### Changed

- **`NETWORK-EVENTS-DESIGN-PLAN.md` §11, R row** — now **Done**. It records:
  - the Routine as built: "Claude HQ · Sales", Sonnet 5, no connectors;
  - the cron, `CRON_TZ=America/New_York 50 8 8 3,6,9,12 *`, set with `/schedule update` in a local terminal; next fire Tue 2026-12-08;
  - the first run, a STAND-DOWN with 0 candidates and no commit, which §8 accepts;
  - its near-misses: non-US/CA sub-mega shows, and organiser pages the sandbox could not read.
- **`ROUTINES-OPERATIONS.md` → "Events discovery — quarterly"**:
  - heading changed to "live since 2026-09-25";
  - **corrected** the schedule step: the cron is set with `/schedule update` locally, not `update_trigger`;
  - new settled finding, with the verbatim refusal: an agent cannot change a UI-created Routine, schedule included, because agents can only update Routines they created;
  - an "as built" record of the trigger and its first run.

### Notes

- Phase A (#8 report refresh, #12R) is complete.
- **Archive rotation not performed:** 107 sections in total, of which nine are dated today and exempt, leaving 98 non-exempt against a trigger of 100.

## [v07.54r] — 2026-09-25 07:20:11 PM EST

> **Prompt:** "Run action #12R — draft the discovery Routine's prompt and give me step-by-step instructions to create it in the claude.ai UI (R in repository-information/NETWORK-EVENTS-DESIGN-PLAN.md).
> Read first, in this order:
>
> 1. repository-information/SESSION-CONTEXT.md → Latest Session.
> 2. `NETWORK-EVENTS-DESIGN-PLAN.md`: §5.3's Discovery Routine bullet, the R rows in §8 and §11, and the note headed "R — the developer." Its blocker, Monday's earnings-desk proof, is cleared: the desk landed the first Routine commit on 9/22 (v07.16r).
> 3. repository-information/ROUTINES-OPERATIONS.md:
>    * the current STEP 0 text — copy it verbatim, not from memory;
>    * the settled findings that a fired session can push only when the repository is attached on the "New routine" form, and that a Routine's repository cannot be edited afterwards;
>    * the 2026-09-21 model evaluation;
>    * the prompts under "The rebuild prompts", as the shape to follow.
> 4. .claude/rules/events-app.md (the Events Sync command and its never-list); repository-information/EVENTS-SCHEMA.md (the registry, the roster and the `Proposed` shape); and live-site-pages/events-data/events.json and `events-sources.json`.
>
> Settle these before drafting, and give me each answer with its reason:
>
> * Where proposals go. A fired session cannot write the Events spreadsheet's `Proposed` tab, and it must never call the deployed app or widen a peer token. Decide the repo-side queue a run writes candidates to (§8's "calendar-file-as-queue"), and how `events sync` or I promote a candidate out of it. If that file or its schema doesn't exist, create it in this session and make scripts/check-events-registry.py (or a sibling checker) validate it.
> * What counts as a candidate: the source classes; the relevance bar against the segments and the dossier corpus; dedup against `events.json`; a per-run cap; and the stand-down rule (a quiet run commits nothing and reports why).
> * Cadence and model: quarterly, with the cron written in `CRON_TZ=America/New_York` and a jittered minute. Give me the first fire date and recommend a model with the reason.
> * Budget: list my existing Routines and say whether one more fits before the #12Q quota review (~10/21).
>
> Deliverables:
>
> 1. The complete Routine prompt in one copyable block: STEP 0 verbatim, then identity, the queue, the cap, the stand-down rule and the report shape.
> 2. That prompt saved as a new subsection under "The rebuild prompts" in `ROUTINES-OPERATIONS.md`, so it can be recreated. Mark the plan's R row "prompt written — awaiting UI creation", add a CHANGELOG entry, and commit and push under the normal checklists.
> 3. Numbered, click-by-click steps for claude.ai's "New routine" form: name, prompt, repository picker (confirm the Runs with card shows `LightAISolutions/Sales` before saving), environment, model, schedule, connectors (none unless the prompt needs one), notifications, then one Run now. Check the live docs with `read_documentation` rather than memory.
> 4. What a good first run looks like (§8: it proposes at least one event and commits, or stands down with a report), and how I verify it: the session report, a commit on `main`, and the queue file.
>
> Do not create the Routine yourself. `create_trigger` cannot attach a repository, and a Routine without one cannot push.
> Done when: the prompt is committed in `ROUTINES-OPERATIONS.md`, the push has merged, and I have the UI steps."

Wrote phase R's discovery Routine prompt and built the repo-side queue it proposes into. The Routine itself is not created: that happens in the claude.ai UI, where the repository can be attached.

### Added

- **`repository-information/events-discovery-queue.json`** — the discovery queue, following the `profiler-refresh-calendar.json` "calendar-file-as-queue" pattern (§8). It starts empty. It lives outside `live-site-pages/` so that unverified candidates never deploy.
- **`EVENTS-SCHEMA.md` §7.1** — the queue's shape (`slug`, `status` pending/approved/rejected/applied, `sourceClass`, `event`, `sourceKey` plus an optional probed `rosterRow`, `evidence[]`, `corpus[]`, `why`, the decision fields), the candidate bar, and promotion.
- **`scripts/check-events-registry.py` → `check_queue()`** — validates the queue whenever the file exists:
  - slug rule and uniqueness;
  - no pending, approved or rejected candidate duplicates a registry slug, or a registry series and year;
  - an applied candidate's slug is in the registry, and it carries `appliedIn`;
  - no pending candidate starts before its `proposedAt`;
  - enums, timezone, ISO country, 1–5 relevance, segment ids and dossier slugs;
  - the roster link (an existing key, or a full probed `rosterRow`), and never `10times-listings`;
  - at least one evidence URL on the organiser's own site, and no LinkedIn, 10times or Google News host.
  - Fixture-tested: one well-formed candidate, and one candidate violating eight rules, which produced eight findings. It also caught a real duplicate (CLEANPOWER 2027 is already registered).
- **`.claude/rules/events-app.md` → "The discovery run (R) and `events sync discovery`"**:
  - **The run:** five source classes in order (corpus mention, roster organiser, covered company, trade body, grid operator/regulator). The organiser page must be read in the run. It applies the bar, writes candidates, gates on the checker, commits only when at least one candidate was written, and otherwise stands down.
  - **Promotion:** the developer names approvals and rejections. The session re-reads the organiser page and re-probes any new roster row, then appends the event by the `new-event` rule as `tentative`. It stamps the candidate `applied` and gates on the checker.
  - The file's `paths:` now include the queue.
- **`ROUTINES-OPERATIONS.md` → "Events discovery — quarterly"**, under "The rebuild prompts":
  - the full prompt: STEP 0 copied verbatim from the desk's prompt (checked byte-identical), then identity, the queue, the never-list, a cap of five, the gate, the commit rule, the stand-down and the report shape;
  - the creation settings: name, repository, environment, default model (Sonnet 5), no connectors, and the schedule `CRON_TZ=America/New_York 50 8 8 3,6,9,12 *` (first scheduled fire Tue 2026-12-08, after a Run now at creation).

### Changed

- **`NETWORK-EVENTS-DESIGN-PLAN.md`:**
  - §11's R row now reads "Prompt written — awaiting UI creation".
  - §5.3's Discovery Routine bullet is amended: the Routine reads the repo queue, not the `Proposed` tab.
  - The "R — the developer" note records that the blocker cleared at v07.16r.
- **`EVENTS-SCHEMA.md` §7 and §12** — point to §7.1.
- **`CLAUDE.md`, Events Sync Command** — names `events sync discovery`.
- **`README.md`** — tree entry for the queue file.

### Notes

- `check-events-registry.py` exits 0: 102 events, 58 roster rows, 0 queue candidates.
- **Archive rotation not performed:** 106 sections in total, of which eight are dated today and exempt, leaving 98 non-exempt against a trigger of 100.

## [v07.53r] — 2026-09-25 07:06:03 PM EST

> **Prompt:** "Remind me to re-run this report after Megmeet's Q3'26 report (due by 10/31). Refresh the Megmeet dossier first. Zhonhen and Sinexcel report by the same deadline. 
>
> Add power-electronics to scope now unless you have a good reason to wait. If you do, explain the reason to me."

Added `power-electronics` to the AIDC power-conversion report's scope as a same-day second edition. The developer's reminder for the post-Q3 re-run was recorded.

### Added

- **`live-site-pages/profiler-data/reports/aidc-power-conversion-rev2--competitive--2026-09-25.report.json`** — supersedes `aidc-power-conversion--competitive--2026-09-25`, which was published earlier the same day. Reports are immutable, so a scope change needs a new edition; the `-rev2` topic suffix follows the 9/23 SST precedent. The scope grows from 15 to 16 vendors and the citations from 60 to 66, with six new ones copied verbatim from the `power-electronics` v1 `sources[]`:
  - **New Layer 3 row, Power Electronics.** AIPCS takes medium-voltage AC to an 800 VDC bus in one enclosure: up to 3,820 kVA, 98.00% maximum including the MV transformer. It is transformer-based, so it is a TRU-now product rather than an SST. No AIPCS order, customer or input voltage class is published. About 70% of FY2025 revenue comes from the US, and a Houston plant launches production in 2026.
  - **Scale chart:** adds Power Electronics at USD 1,468M, verified against its KPI overlay.
  - **FCC paragraph amended:** the carried "reaches no covered rack-power vendor" line now adds that the newly scoped vendor *is* reached. Its dossier records that its Spanish-built, SCADA-commanded storage inverters are covered, and says nothing about AIPCS.
  - **Megmeet first-week section:** names Power Electronics as the US-footprint comparison a buyer will reach for at the hall edge.
  - **Scope, coverage, gaps, limitations and cross-reference note updated.** Mitsubishi Electric stays a named candidate for the next edition.
- **`repository-information/REMINDERS.md`** — new active reminder: re-run the report once Megmeet's Q3 2026 report is filed (due by Saturday 2026-10-31), refreshing the Megmeet dossier first. Zhonhen and Sinexcel report by the same deadline.

### Changed

- **`reports/reports-index.json`** — rev2 added as `current`; the morning 2026-09-25 edition flipped to `superseded`.
- **`README.md`** — tree entry for rev2, and the morning edition's line now reads superseded.

### Notes

- **`check-profiler-reports.py`:** 0 errors, and no warning on the new edition. The two remaining warnings are the out-of-scope aged 9/8 BESS reports.
- **Archive rotation not performed:** 105 total, of which seven are dated today and exempt, leaving 98 non-exempt against a trigger of 100.

## [v07.52r] — 2026-09-25 06:56:02 PM EST

> **Prompt:** "profiler report competitive: AIDC power conversion — refresh the 2026-09-08 edition against current dossiers (Priority 2 item #8).
>
> Context:
> - The current edition is `live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-08.report.json` ("AIDC Power Conversion — The 800 VDC Race"). `python3 scripts/check-profiler-reports.py` warns that it has aged: it pins megmeet v7, delta-electronics v5 and liteon v6, and those dossiers are now v8, v6 and v7 (all refreshed 2026-09-23). It turns "aging" on 2026-10-23 and no Routine watches it.
> - This is a re-run of a prior topic, not an edit. Reports are immutable, so write a new edition `aidc-power-conversion--competitive--<today>.report.json` with `supersedes` set to the 9/8 edition's id, and flip the old entry in `reports-index.json` to `superseded`. Follow the Profiler report command in `.claude/rules/profiler-app.md`.
> - Keep the 9/8 edition's company scope. If the preflight coverage table shows a covered company that belongs in this race but is missing, propose it in the preflight rather than widening silently.
> - Synthesize from covered dossiers only and cite their sources with provenance tiers. Do not re-research. If a dossier is stale for this report's purpose, record that in `limitations` rather than refreshing it in this session.
> - Read the two 2026-09-23 SST reports (`sst-hall-edge-block--competitive--2026-09-23` and `sst-hall-edge-block-rev2--competitive--2026-09-23`) and keep this report consistent with them where they overlap (Megmeet's position). Cross-reference them; don't duplicate them.
> - Audience: I start at Megmeet on Wednesday 2026-10-07. Write the BLUF and key judgments so they are usable in my first week.
> - Show me the preflight (type, scope, coverage table with freshness tiers), then proceed without waiting unless the scope is ambiguous.
> - Out of scope: the other two aged 9/8 reports (grid-scale-bess: Jinko v5→v6; named-project-bess-attach: Oracle v4→v5). Mention them only if the refresh changes something they depend on.
> - Heads-up for the push: `repository-information/CHANGELOG.md` sat at `Sections: 103/100` on 9/25 with 5 sections dated that day. From 9/26 onward none are exempt, so archive rotation will be due on this push (the oldest date groups, with SHA enrichment, after deepening the clone).
>
> Done when: the new edition is registered, `python3 scripts/check-profiler-reports.py` reports no warning for it, and the push has merged."

Generated the AIDC power-conversion competitive report, 2026-09-25 edition (`aidc-power-conversion--competitive--2026-09-25`), superseding the 9/8 edition. The scope stays at the same 15 vendors across four layers. Coverage is re-pinned to Megmeet v8, Delta Electronics v6 and LITEON v7; the other twelve pins are unchanged.

### Added

- **`live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-25.report.json`** — 10 key judgments, 9 sections, 9 indicators, 60 citations (31 carried from the 9/8 edition, 29 new, all copied verbatim from dossier `sources[]`). What moved:
  - **The rack order is now sourced rather than contested:** Delta, then LITEON, then Megmeet as a qualified third source. The evidence is Megmeet's own account of being late on GB200 and winning GB300 batch orders, Soochow's third-source call, TrendForce naming Delta and LITEON as the leaders, and the rumour origin of the "#2" story.
  - **Megmeet's SST is dated on its own word.** It is in pre-research, has no disclosed input class, and the company expects no volume sales for two to three years.
  - **A correction to the 9/8 reading of Sungrow:** its dossier, unchanged at v9, carries a curve of small-batch trials through 2026, batch orders from 2027 and scale from 2028, which the 9/8 edition did not report. The "shipping" wording is replaced by "productised, not yet volume".
  - **New `megmeet-first-week` section (analysis):** membership versus rank; what the H1 filing measures; how to place the SST; what the Q3 report must show against the RMB 787M consensus; the Richardson versus HKEX-proof footprint question.
  - **New `sst-crossref` section:** points to `sst-hall-edge-block-rev2--competitive--2026-09-23` for the class-by-class hall-edge comparison. It is consistent with that report on Megmeet (rack and sidecar, third source, undisclosed SST class) and does not re-score its venture SST set.
  - **Limitations corrected:** the 9/8 edition said `mitsubishi-electric` and `power-electronics` carried no dossiers. Both were covered before it was written (from 9/4 and 9/6), and Power Electronics' AIPCS is a medium-voltage-to-800 V DC unit. Both are named as next-edition scope candidates rather than added.
  - **Admin-lens overlays** on `nvidia-800vdc-2026-08` (`options`, `trusst`, `suppliers`) carried forward and updated for the third-source and Sungrow-curve findings.

### Changed

- **`reports/reports-index.json`** — the new edition was added as `current` with `overlayModules`; `aidc-power-conversion--competitive--2026-09-08` flipped to `superseded`.
- **`README.md`** — the tree gains the new report. The 9/8 edition's line now reads superseded, and the 23 September morning SST edition's line, which still said "current edition", now reads superseded by its rev2.

### Notes

- **`check-profiler-reports.py`:** 0 errors, and no warnings on the new edition. The two remaining warnings are the out-of-scope aged 9/8 BESS reports (Jinko, Oracle); nothing in this refresh touches what they depend on.
- **Archive rotation not performed.** This push is dated 25 September, so today's six sections are exempt: 104 total, 98 non-exempt against a trigger of 100. The first push dated 26 September or later will rotate the 2026-09-18 group (8 sections).

## [v07.51r] — 2026-09-25 06:39:32 PM EST

> **Prompt:** "See attached screenshot for action #11 (Scraper's Project History). Is this closed now? If not, what do I need to do? Regarding action #9b, I approve your recommendation of exhibitor-only signals. Implement it. Give me a prompt to paste into a new Opus 5.5 High session to run action #8 - Refresh the power conversion report, then remember session."

### Changed

#### `Events.gs` (v01.10g)

- **Exhibitor-only signals for widget-served speaker rosters (the developer's #9b decision).** Some registry rows' `speakersUrl` serves its roster through a third-party widget (RE+ 2026: a Swapcard iframe), which every sweep parsed as `no_roster_found`. A row may now carry `speakersWidget` (`swapcard` · `cvent` · `bizzabo` · `grip`). When it does, `evSweepEvent_` never fetches the roster page, reports `speakers:{ skipped:'widget_roster', widget }` and leaves the page out of `pages`. The exhibitor gallery, agenda and newswire legs are unchanged, `speakersUrl` stays on the row as the sheet's Speakers link, and key speakers still come in through the sheet's manual signal form. The Swapcard API was declined.

#### Registry

- **`events.json`:** `re-plus-2026` carries `"speakersWidget": "swapcard"`, and its `lastUpdated` moves to 2026-09-25.
- **`events.ics`:** rebuilt by `scripts/build-events-ics.py`. RE+'s `LAST-MODIFIED` advances, and every `DTSTAMP` takes the build time as the builder always stamps it. `--check` is OK.

#### Checkers and schema

- **`scripts/check-events-registry.py`:** `speakersWidget` must be one of the four widgets, and only on a row with a `speakersUrl` (`SPEAKERS_WIDGETS`). Exit 0.
- **`scripts/check-events-signals.js`:** the RE+ fixture carries the flag. The RE+ line reads `widget_roster` with the roster URL never fetched, and the pages count drops from 7 to 6. All checks pass.
- **`repository-information/EVENTS-SCHEMA.md`:** the `speakersWidget` row in the §3 field table, and the sweep's roster sentence.

### Notes

- **#11 (Scraper Apps Script versions):** the developer's Project History screenshot shows Version 167 current (22 Sep, the v07.21r deploy); `Scraper.gs` has not changed since. That leaves 13 versions to the 180 cleanup line and 33 to the 200 cap. No cleanup is due, and the count moves only when a push changes `Scraper.gs`.

## [v07.50r] — 2026-09-25 05:49:20 PM EST

> **Prompt:** "6.2 done - everything worked as intended. However, I want to have the ability to delete field notes in Profiler."

### Added

#### `Profiler.html` (v01.92w)

- **🗑 Delete on every note in the ⚙ → Field notes log.** The log (`ovPaintNotes`) offered Copy, Summarize and Recording but no Delete. The only delete was in a dossier's "Add a Field Note" → "Manage existing notes" list, which a `general` note, with no dossier to open, could never reach; that includes notes promoted from Network for an uncovered account. The new button confirms (naming an attached file when there is one), calls the existing `nop=delete` (`deleteFieldNote`: the same owner gate as `list`, the note removed from the Drive log and its attachment trashed, the audit carrying the id only), then drops the row locally and repaints, resetting the company filter to All when the filtered company has no notes left. A failure shows `✕ <error>` on the button and restores it. No backend change.
  - **Verified headless** against a stubbed backend: three notes, three Delete buttons; one delete sends one `nop=delete` with the note's id and leaves two rows.

### Changed

- **`Profilerhtml.changelog.md` archive rotation.** This push took it to 51 sections, 50 of them non-exempt (the 50-section page trigger). The oldest date group, `v01.42w` (2026-08-24, a single section), moved to `Profilerhtml.changelog-archive.md` with its commit link (`v02.93r` → `6a3d0b3`), leaving it at `Sections: 50/50` with 49 non-exempt.

## [v07.49r] — 2026-09-25 06:08:32 AM EST

> **Prompt:** "add the learned-text box to Promote"

### Added

#### `Network.html` (v01.25w)

- **A required "What did you learn?" box in the ⇈ Promote box.** It is a textarea of up to 3,000 characters (`NW_PROMOTE_LEARNED_MAX`), focused when the box opens, and it comes before the confidence field. The page collapses whitespace, refuses an empty or over-long entry before any request, and sends the text as `learned` on `nop=promote`. The box goes read-only once promoted.
  - **Why:** Network has no free-text touch. Every History row's summary is machine-written ("Card scanned", "Meeting at …"), so a promotion sent Profiler's intake the fact of a touch and never the intel.

#### `Network.gs` (v01.18g)

- **`nop=promote` takes `learned`.** It is required, whitespace-collapsed and at most 3,000 characters; the new refusals are `learned_required` and `learned_too_long` (with `max`), both raised before any call.
  - **`nwPromoteText_`** now opens the note with the learned text, then ` — Context: ` and the unchanged context paragraph (kind, person, account, day, summary, `[Network interaction <i- id> · evidence · event]`), still capped at 4,000.
  - **The recording `note` Interaction's Summary** gains `: <excerpt>`, the first 300 characters (`NW_PROMOTE_EXCERPT_MAX`, cut with …), so the intel is visible in Network's History too.
  - **The audit is unchanged:** ids and a flag only, never the text.

### Changed

- **`repository-information/NETWORK-SCHEMA.md`**: the `nop=promote` contract (the `learned` field, the note's order, the Summary excerpt, the two refusals) and the checker line (60 checks).
- **`scripts/check-network-brief.js`**: the learned text is required, bounded and leads the note, and its excerpt is in the Summary. 58 → 60 checks, all passing.
- **`scripts/verify-network-roles.py`**: the Promote pass refuses an empty box with nothing posted, then checks that the whitespace-collapsed text rides the post. Passes.

## [v07.48r] — 2026-09-25 05:59:25 AM EST

> **Prompt:** "6.4 - see attached screenshot. Mark held seems to have worked, but produced something garbled called "c-1fa85fymc4iaj". What is that. Fix it. 6.2 - What's the point of promoting a contact interaction into a field note in Profiler if I can't input any information to the field note?"

### Fixed

#### `Events.html` (v01.13w)

- **After Mark held / not held, the post-event meeting row showed the raw contact ID (`c-1fa85fymc4iaj`) in place of the name, and dropped the account.** `eop=posteventmark` returns `meetings` from `evPostMeetings_` without running `evPlanMeetingNames_`, which `eop=postevent` does. `evPostMark` replaced the cached list wholesale, and the renderer falls back to `contactId` when `contactName` is empty. `evPostMark` now carries `contactName` and `accountName` across from the list already on screen, matched by meeting id. That costs no extra Network reads per mark. Verified headless against a mocked backend whose mark answer has no names: the row reads "Austin York · Acme · … HELD".

## [v07.47r] — 2026-09-25 05:21:48 AM EST

> **Prompt:** "6.2: See attached screenshot. Step 4) Before or after pressing "Promote", I never had a "note" box to input notes in. 6.3: I confirm that booking a meeting works as intended. 6.4: I booked a meeting on ACP's first day (9/22), but it doesn't show up in the "After the show" section. After I refresh the page and reopen the ACP event -> Plan tab, it keeps saying it's counting the cards and stuff but never shows a result. 6.5: I have sucessfully added my Events calendar to my Google calendar and can see the events. I will check events sync later. 7.3: I see a green badge "weekly sweep installed" and the line below reads "Last swept 2026-09-23 * 11 events * 1 signal found * 1 written * 0 updated * 1 page failed." See attached screenshot."

### Fixed

#### `Events.html` (v01.12w)

- **The Plan tab's "After the show" close-out could stay on "Counting the cards…" forever.** The `eop=postevent` and `eop=plan` load callbacks repainted the Plan box they were started from, and did nothing if that box was gone. Two things rebuild the sheet while a load is in flight: returning to the tab (the `visibilitychange` → `evAfterWrite` → `evOpenSheet` path) and closing and reopening the event. Either one detached the box while the cached state still read `loading`, so the new box drew "Counting…" and never sent a request of its own. A new `evRepaintPlan(e)` repaints whichever `#ev-plan` box is on screen when the answer lands, provided the sheet is still on that event and the Plan tab is still selected. Reproduced and verified headless against a mocked backend: before the fix, a reopen during a 3-second load stayed on "Counting…" indefinitely; after it, the close-out fills in when the answer arrives.

## [v07.46r] — 2026-09-24 08:47:30 PM EST

> **Prompt:** "Per the attached screenshot and my open action items Priority 1 list, profiler Habitat Energy and profiler Gridmatic."

### Changed

- **Habitat Energy dossier refreshed to profileVersion 2; v1 archived.** The Quinbrook sale is unchanged: no buyer, bidder, signing, completion or withdrawal is on the record through 2026-09-24. New Project Media's 17 March report is still the only public source.
  - **FY2025 accounts not yet filed.** Neither Habitat Energy Limited nor its parent had filed by 2026-09-24; both are due 30 September. The summary, financials commentary, collection gaps and indicators now say so.
  - **New development (19 May 2026):** a PSC07 and a PSC08 correct the control register above the parent, Renewable and Grid Services Limited. This is not a transfer: Habitat's own PSC and its board are unchanged.
  - **New development (17 July 2026):** General Counsel Jason Dillingham joined the leadership page.
  - **Evidence re-weighted.** Quinbrook's "Operational & Expanding" status page has not been modified since 29 August 2025, so key judgment 2 now treats it as weak evidence. The judgment now rests on the Companies House record.
  - **Other edits:** decision makers gain Dillingham and Chief People Officer Lois Stamps; the ownership line is re-dated; three Companies House sources added (75 in total).
- **Gridmatic dossier refreshed to profileVersion 2; v1 archived.** The raise is still only anticipated. No Gridmatic Inc. Form D, named investor or credit facility exists; the EDGAR full-text index was checked on 2026-09-24 and holds Form Ds as late as 2026-09-23. The Capital Markets posting describing "upcoming debt and equity raises" is still live.
  - **Ownership now reads "founder-led", not "founder-owned".** The posting refers to "existing investors" and "board packages", every posting offers a stock-option loan programme, and a named angel invested before 2022.
  - **Retail revenue claim added:** "on track to hit $100 million in revenue this year" (company LinkedIn, 18 Aug 2026). This is the first revenue figure the company has published, and it is unaudited.
  - **Amperical ERCOT data updated (to 24 Jul):** Endurance Park ranks 11th of 312; Cross Trails moves from 43rd to 38th. The scheduling entity carries "2 sites, 110 MW".
  - **Cross Trails loan waivers.** Energy Vault's lenders waived Cross Trails' debt-service-coverage defaults for Q1 and Q2 2026 (8-K of 1 July; Q2 10-Q). Neither filing names Gridmatic.
  - **Other new developments:** the CCO's 16 September Energy-Storage.news interview, and the March 2026 Ohio residential add-on licence amendment.
  - **Other edits:** VP Finance Yojna Verma added (no CFO is named); strategy read, collection gaps and indicators revised; 7 sources added (77 in total).
- **Registry, calendar and notes.**
  - `profiler-companies.json`: Gridmatic tagline revised; the sync script reconciled `lastUpdated` and source counts for both companies (Habitat 75 sources, 63% first-party; Gridmatic 77, 40%).
  - `profiler-refresh-calendar.json`: `lastRefreshed` moved to 2026-09-24 for both rows. Both stay `watch` tier.
  - `profiler-refresh-notes.json`: watch items updated. Habitat's second watch item flags that the 1 October sweep skips it, so the FY2025 accounts must be folded in by hand once filed.
  - `profiler-graph.json`: rebuilt.
- **Verification.**
  - `sync-profiler-registry.py --check` and `check-profiler-relationships.py`: 0 findings.
  - `check-profiler-crossrefs.py`: 0 candidates.
  - `check-profiler-study.py`: 0 errors.
  - Inbound reconciliation: five substantive mentions across the Fluence, Hunt Energy Network, Stem and Tesla dossiers reviewed, 0 changed.
  - Segment memberships re-read and unchanged: Habitat is challenger in software and optimisation; Gridmatic is challenger there and adjacent in storage developers and IPPs.

## [v07.45r] — 2026-09-24 08:15:30 PM EST

> **Prompt:** "continue with your recommendation"

### Fixed

- **`acp-recharge-2026` flipped to `past`** — ACP RECHARGE 2026 (22–24 Sep, Aurora CO) ended on 24 Sep, and the registry gate failed once its UTC date rolled to 25 Sep.
  - `check-events-registry.py --fix-past` changed that row's `status` and nothing else.
  - `events.ics` was rebuilt: 68 confirmed VEVENTs, down from 69. The only content change is ACP's dropped VEVENT; the rest of the diff is regenerated DTSTAMPs.
  - Verified: `check-events-registry.py` exits 0 (102 events: 68 confirmed, 6 past, 28 tentative), and `extract-corpus-events.py --check` reports `mentions[]` current.
  - Data-only: no page, GAS or schema change.

## [v07.44r] — 2026-09-24 08:11:01 PM EST

> **Prompt:** "continue with your recommendation"

### Fixed

- **Events Sync hand-off order** (`.claude/rules/events-app.md` step 8). The v07.42r hand-off told the developer to "mark 7 applied, reject 9", which the panel cannot do. **Mark applied** stamps every approved row at once, and an applied row can no longer be rejected (`already_applied`). All 16 rows ended up stamped `applied`.
  - **The rule now requires the order the panel supports:** switch skipped rows to Reject first, then click Mark applied.
  - **It also records the fallback:** a row that was stamped by mistake can only be relabelled in the spreadsheet, and the poller's dedup is unaffected by it.
  - **`EVENTS-SCHEMA.md` §7** carries the same one-line ordering note.
  - **Nothing else changed:** no page, GAS or data file.

## [v07.43r] — 2026-09-24 07:55:58 PM EST

> **Prompt:** "Run python3 scripts/extract-corpus-events.py to refresh the stale mentions[] in events.json, confirm with check-events-registry.py (exit 0) and --check, and push it as a data-only commit. It feeds the score's corpusSalience term, and it has been stale since the recent dossier revisions."

### Fixed

- **`events.json` `mentions[]` refreshed from the dossier corpus** — `scripts/extract-corpus-events.py` rewrote the derived index. Only the Megmeet dossier had drifted, which dates to its v8 cut (v07.32r):
  - `computex-2027` loses `megmeet` / `strategy`. The dossier's strategy read no longer names Computex.
  - `ai-infra-summit-2027` gains `megmeet` / `sources`.
  - Totals are unchanged: 256 mention rows across 33 corpus events. The score's `corpusSalience` term reads the corrected counts on the next page load.
  - Verified: `extract-corpus-events.py --check` went from exit 1 to "OK: mentions[] current", and `check-events-registry.py` exits 0 (102 events, 69 confirmed, 256 mentions across 32 events, `events.ics` agrees). This is a data-only change: no page, GAS or schema file touched.

## [v07.42r] — 2026-09-24 07:50:01 PM EST

> **Prompt:** "Picking up from my open action items review, I want to sync my Events registry. Run events sync with the following JSON:
>
> ```json
> {
>   "schemaVersion": 1,
>   "exported": "2026-09-24T23:39:44.059Z",
>   "proposals": [
>     {
>       "id": "pr-011alu3fbhzxh",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2026",
>       "change": "new-edition",
>       "before": {
>         "end": "2027-09-02",
>         "slug": "ai-infra-summit-2027",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "city": "Santa Clara",
>         "country": "US",
>         "end": "2026-09-17",
>         "kind": "conference",
>         "name": "AI Infra Summit 2026",
>         "organiser": "Kisaco Research",
>         "region": "CA",
>         "series": "AI Infra Summit",
>         "slug": "ai-infra-summit-2026",
>         "sources": [
>           {
>             "kind": "jsonld",
>             "lastConfirmed": "",
>             "sourceKey": "ai-infra-summit",
>             "url": "https://www.ai-infra-summit.com"
>           }
>         ],
>         "start": "2026-09-15",
>         "status": "tentative",
>         "tz": "America/Los_Angeles",
>         "venue": "Santa Clara Convention Center",
>         "website": "https://www.ai-infra-summit.com"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-22T20:56:52.474Z"
>     },
>     {
>       "id": "pr-0wf4qdswu9qm4",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2027",
>       "change": "moved-dates",
>       "before": {
>         "end": "2027-09-02",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "end": "2026-09-17",
>         "start": "2026-09-15"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-24T20:55:35.146Z"
>     },
>     {
>       "id": "pr-1ifa3czd71l9h",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "San Jose",
>         "venue": "San Jose McEnery Convention Center"
>       },
>       "after": {
>         "city": "5001 Great America Parkway, Santa Clara, CA 95054, United States",
>         "venue": "Santa Clara Convention Center"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-24T20:55:34.788Z"
>     },
>     {
>       "id": "pr-01iw6y3n1ltpd",
>       "sourceKey": "datacloud-usa",
>       "slug": "datacloud-usa-2027",
>       "change": "moved-dates",
>       "before": {
>         "end": "2027-09-02",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "end": "2027-09-02",
>         "start": "2027-08-30"
>       },
>       "evidenceUrl": "https://www.datacloud-usa.com/",
>       "seenAt": "2026-09-22T20:49:06.174Z",
>       "decidedAt": "2026-09-24T20:55:43.747Z"
>     },
>     {
>       "id": "pr-0r71bryoebnp2",
>       "sourceKey": "datacloud-usa",
>       "slug": "datacloud-usa-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "Austin",
>         "venue": "Fairmont Austin"
>       },
>       "after": {
>         "city": "304 E Cesar Chavez St, Austin, Texas, 78701, United Kingdom",
>         "venue": "Austin Marriott Downtown"
>       },
>       "evidenceUrl": "https://www.datacloud-usa.com/",
>       "seenAt": "2026-09-22T20:49:06.174Z",
>       "decidedAt": "2026-09-24T20:55:41.098Z"
>     },
>     {
>       "id": "pr-2f8kg1rgvynrk",
>       "sourceKey": "esig-events",
>       "slug": "esig-large-loads-workshop-2026",
>       "change": "changed-url",
>       "before": {
>         "website": "https://www.esig.energy/events/"
>       },
>       "after": {
>         "website": "https://www.esig.energy/event/esig-large-loads-workshop/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:56:15.848Z"
>     },
>     {
>       "id": "pr-174qj4to6col2",
>       "sourceKey": "esig-events",
>       "slug": "webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-01",
>         "name": "Webinar: Stability and Dynamics Studies of DERs in Weak Distribution Systems: Best Practices for EMT Studies and Utility Applications",
>         "slug": "webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/webinar-stability-and-dynamics-studies-of-ders-in-weak-distribution-systems-best-practices-for-emt-studies-and-utility-applications/"
>           }
>         ],
>         "start": "2026-10-01",
>         "status": "tentative",
>         "website": "https://www.esig.energy/event/webinar-stability-and-dynamics-studies-of-ders-in-weak-distribution-systems-best-practices-for-emt-studies-and-utility-applications/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:57:41.179Z"
>     },
>     {
>       "id": "pr-0imzbnq3kfo98",
>       "sourceKey": "esig-events",
>       "slug": "webinar-a-quantitative-assessment-of-the-impacts-of-large-loads",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-15",
>         "name": "Webinar: A Quantitative Assessment of the Impacts of Large Loads on Electricity Rate",
>         "slug": "webinar-a-quantitative-assessment-of-the-impacts-of-large-loads",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/webinar-a-quantitative-assessment-of-the-impacts-of-large-loads-on-electricity-rate/"
>           }
>         ],
>         "start": "2026-10-15",
>         "status": "tentative",
>         "website": "https://www.esig.energy/event/webinar-a-quantitative-assessment-of-the-impacts-of-large-loads-on-electricity-rate/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:57:39.101Z"
>     },
>     {
>       "id": "pr-2xy3g1xojf4wm",
>       "sourceKey": "esig-events",
>       "slug": "fall-technical-workshop-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "city": "Reston",
>         "country": "United States",
>         "end": "2026-10-29",
>         "name": "2026 Fall Technical Workshop",
>         "region": "VA",
>         "slug": "fall-technical-workshop-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/2026-fall-technical-workshop/"
>           }
>         ],
>         "start": "2026-10-26",
>         "status": "tentative",
>         "venue": "Hyatt Regency Reston, VA",
>         "website": "https://www.esig.energy/event/2026-fall-technical-workshop/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:56:54.181Z"
>     },
>     {
>       "id": "pr-1fwilm8tj67sn",
>       "sourceKey": "imasons-events",
>       "slug": "imasons-at-yotta-2026",
>       "change": "changed-url",
>       "before": {
>         "website": "https://imasons.org/events/"
>       },
>       "after": {
>         "website": "https://imasons.org/activity/2026-28-09_yotta-2026/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:58:04.031Z"
>     },
>     {
>       "id": "pr-10w2gwwavrkfb",
>       "sourceKey": "imasons-events",
>       "slug": "imasons-cascadia-local-chapter-the-digital-frontier-building-the",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-15",
>         "name": "iMasons Cascadia Local Chapter | The Digital Frontier: Building the Infrastructure of Tomorrow",
>         "slug": "imasons-cascadia-local-chapter-the-digital-frontier-building-the",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "imasons-events",
>             "url": "https://imasons.org/activity/2026-10-15_digitalfrontier_cas/"
>           }
>         ],
>         "start": "2026-10-15",
>         "status": "tentative",
>         "website": "https://imasons.org/activity/2026-10-15_digitalfrontier_cas/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:58:34.714Z"
>     },
>     {
>       "id": "pr-1rz0m71444icd",
>       "sourceKey": "imasons-events",
>       "slug": "data-center-energy-industry-update-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-11-02",
>         "name": "Data Center Energy Industry Update",
>         "slug": "data-center-energy-industry-update-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "imasons-events",
>             "url": "https://imasons.org/activity/2026-11-02_datacenterenergyindustryupdate_tx/"
>           }
>         ],
>         "start": "2026-11-02",
>         "status": "tentative",
>         "website": "https://imasons.org/activity/2026-11-02_datacenterenergyindustryupdate_tx/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:57:42.089Z"
>     },
>     {
>       "id": "pr-2wpsbsoc5z7j5",
>       "sourceKey": "informa-battery-show",
>       "slug": "the-battery-show-north-america-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "city": "Detroit",
>         "country": "US",
>         "end": "2026-10-15",
>         "name": "The Battery Show North America",
>         "slug": "the-battery-show-north-america-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "informa-battery-show",
>             "url": "https://www.thebatteryshow.com/"
>           }
>         ],
>         "start": "2026-10-12",
>         "status": "tentative",
>         "venue": "Huntington Place",
>         "website": "https://www.thebatteryshow.com/"
>       },
>       "evidenceUrl": "https://www.thebatteryshow.com/en/home.html",
>       "seenAt": "2026-09-22T20:50:09.948Z",
>       "decidedAt": "2026-09-24T20:58:44.533Z"
>     },
>     {
>       "id": "pr-19f00es616r74",
>       "sourceKey": "informa-data-center-world",
>       "slug": "data-center-world-2027",
>       "change": "changed-url",
>       "before": {
>         "website": "https://www.datacenterworld.com/"
>       },
>       "after": {
>         "website": "https://datacenterworld.com/"
>       },
>       "evidenceUrl": "https://www.datacenterworld.com/",
>       "seenAt": "2026-09-22T20:50:13.570Z",
>       "decidedAt": "2026-09-24T20:58:45.815Z"
>     },
>     {
>       "id": "pr-0bywe4src8ygp",
>       "sourceKey": "mwc-barcelona",
>       "slug": "mwc-barcelona-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "Barcelona",
>         "venue": "Fira Gran Via"
>       },
>       "after": {
>         "city": "Fira Gran Via, Av. Joan Carles I, 64 08908 L'Hospitalet de Llobregat Barcelona",
>         "venue": "Fira Gran Via, Barcelona, Spain"
>       },
>       "evidenceUrl": "https://www.mwcbarcelona.com/",
>       "seenAt": "2026-09-22T20:50:18.044Z",
>       "decidedAt": "2026-09-24T20:58:50.558Z"
>     },
>     {
>       "id": "pr-0gt5wnjye4xvd",
>       "sourceKey": "yotta-event",
>       "slug": "yotta-2026",
>       "change": "changed-venue",
>       "before": {
>         "city": "Las Vegas",
>         "venue": "Caesars Forum"
>       },
>       "after": {
>         "city": "Las Vegas",
>         "venue": "Yotta 2026"
>       },
>       "evidenceUrl": "https://www.yotta-event.com/",
>       "seenAt": "2026-09-22T20:50:22.007Z",
>       "decidedAt": "2026-09-24T20:58:48.048Z"
>     }
>   ],
>   "polls": [
>     {
>       "sourceKey": "ai-infra-summit",
>       "ranAt": "2026-09-22T20:48:51.918Z",
>       "status": "200",
>       "items": 2,
>       "newest": "2026-09-15T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "clarion-powergen",
>       "ranAt": "2026-09-22T20:49:05.599Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-01-18T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "datacloud-usa",
>       "ranAt": "2026-09-22T20:49:06.174Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-08-30T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "esig-events",
>       "ranAt": "2026-09-22T20:49:12.076Z",
>       "status": "200",
>       "items": 12,
>       "newest": "2027-01-26T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "imasons-events",
>       "ranAt": "2026-09-22T20:49:41.817Z",
>       "status": "200",
>       "items": 12,
>       "newest": "2026-11-12T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-battery-show",
>       "ranAt": "2026-09-22T20:50:09.948Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2026-10-12T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-data-center-world",
>       "ranAt": "2026-09-22T20:50:13.570Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-05-24T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-distributech",
>       "ranAt": "2026-09-22T20:50:17.382Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-03-01T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "mwc-barcelona",
>       "ranAt": "2026-09-22T20:50:18.044Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-03-01T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "yotta-event",
>       "ranAt": "2026-09-22T20:50:22.007Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2026-09-28T07:00:00.000Z"
>     }
>   ]
> }
> ```
> "

The first `events sync` to reach the registry. Of the 16 proposals the developer approved in the Proposed tab, **7 were applied and 9 were skipped** at the developer's choice. The skipped rows are poller misreads (listed below), and the registry checker could not have caught them, because it checks only for duplicate slugs. All 10 polled roster rows had their `lastProbe` advanced. No app file changed, so no page or GAS version bump.

### Changed

#### `live-site-pages/events-data/events.json`
- **`datacloud-usa-2027`**:
  - Start moved from 31 Aug to **30 Aug 2027**, the organiser's JSON-LD start, which includes the pre-event day the row's tierNote already names (`pr-01iw6y3n1ltpd`).
  - Venue **Fairmont Austin → Austin Marriott Downtown** (`pr-0r71bryoebnp2`). `city` stays "Austin", because the poller wrote a street address ending "United Kingdom". `venueLatLng` was removed because it pinned the old venue; the next E0 verification pass should set it again.
- **Three website updates**: `esig-large-loads-workshop-2026` → the workshop's own ESIG page (`pr-2f8kg1rgvynrk`), `imasons-at-yotta-2026` → its iMasons activity page (`pr-1fwilm8tj67sn`), `data-center-world-2027` → `datacenterworld.com` without the `www` (`pr-19f00es616r74`).
- **Two new ESIG webinars, both tentative**. The session read their evidence pages on 2026-09-24: both are online on WebEx, 4–5 PM ET, organised by ESIG.
  - `webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut` (1 Oct): DER stability and EMT studies. Audience: grid equipment, utilities, software. Relevance 2 (`pr-174qj4to6col2`).
  - `webinar-a-quantitative-assessment-of-the-impacts-of-large-loads` (15 Oct): how large loads move electricity rates. Audience: utilities, AIDC developers, hyperscalers. Relevance 3 (`pr-0imzbnq3kfo98`).
- On every applied row: `lastUpdated` 2026-09-24, and the matching source's `lastConfirmed` set to 2026-09-22 (the poll date).
- `uptime-network-americas-fall-2026` flipped from tentative to **past** through the checker's own `--fix-past`, which changes only status. It ended 23 Sep, and it was the only finding the gate reported before the sync.

#### `live-site-pages/events-data/events-sources.json`
- `lastProbe` advanced to the 2026-09-22 poll on 10 roster rows (all HTTP 200): ai-infra-summit, clarion-powergen, datacloud-usa, esig-events, imasons-events, informa-battery-show, informa-data-center-world, informa-distributech, mwc-barcelona, yotta-event. No row was added, unblocked or re-kinded.

#### `live-site-pages/events-data/events.ics`
- Rebuilt: 69 confirmed of 102 events.

### Skipped — reject these in the Proposed panel
- `pr-011alu3fbhzxh` (new-edition `ai-infra-summit-2026`), `pr-0wf4qdswu9qm4` (moved-dates) and `pr-1ifa3czd71l9h` (changed-venue) on `ai-infra-summit-2027`. The organiser page's JSON-LD still carries the finished Sep 15–17 2026 Santa Clara edition. The poller read it as a new edition whose *previous* edition is 2027, and as a move of the 2027 row back to 2026 dates and the 2026 venue, with a street address in `city`.
- `pr-0bywe4src8ygp` (`mwc-barcelona-2027`): the venue is unchanged; the proposal only puts a street address in `city`.
- `pr-0gt5wnjye4xvd` (`yotta-2026`): the proposed venue "Yotta 2026" is the event's own name.
- Four duplicates of existing rows under new slugs:
  - `pr-2wpsbsoc5z7j5` duplicates `battery-show-na-2026`.
  - `pr-2xy3g1xojf4wm` duplicates `esig-fall-technical-workshop-2026`.
  - `pr-10w2gwwavrkfb` duplicates `imasons-cascadia-digital-frontier-2026`.
  - `pr-1rz0m71444icd` duplicates `imasons-texas-energy-update-2026-11`.

### Verified
- `scripts/check-events-registry.py` exit 0: 102 events (69 confirmed, 5 past, 28 tentative), 58 roster rows, 256 mentions across 32 events; the ICS agrees with the registry.
- `mentions[]` is byte-identical to before the sync. `extract-corpus-events.py --check` reports the file stale **on `main` before this sync as well**, from recent dossier edits. This command never writes `mentions[]`, so that refresh is left to its own script.

## [v07.41r] — 2026-09-24 06:55:02 PM EST

> **Prompt:** "Verify and close out the attached three facts that are still unverified" *(with a screenshot of the three facts flagged at v07.40r: AEP's "six of eight" tariff states against its 30 Jul release's five; Narada's H1 2026 collapse not yet in its v4 dossier; the Trane dossier's policyExposure[1] reading the EPA 2030 relief too broadly)*

All three facts flagged at v07.40r were verified against primary sources and closed. AEP needed no change. Trane and Narada were revised, and the corrections were carried into the two Guidance landscape modules and two segment lessons that repeated them.

### Verified — no change

- **AEP "six of eight"** — both figures are right at their own dates. The 30 Jul 2026 Q2 earnings deck (p. 8) says five of the eight states; the "Aug & Sep 2026 Investor Meetings" handout (p. 7, and the p. 12 table) says six, after Michigan approved in between, with Oklahoma (PSO) and SWEPCO Texas still pending. Every repo mention already dates "six" to the August handout. The matching bullet in the cooling-recheck reminder is struck through as closed.

### Changed

#### `live-site-pages/profiler-data/trane-technologies.profile.json` — profileVersion 1 → 2 (v1 archived)
- **policyExposure[1]** (EPA Technology Transitions rule) corrected from Federal Register 2026-10387 and 40 CFR 84.54 as amended. The 2030 extension covers only chillers and process refrigeration of **100 lb charge or less used in semiconductor manufacturing**; every other industrial process chiller keeps 1 Jan 2026 or 1 Jan 2028. Data-centre, IT-equipment and computer-room cooling keeps its **700-GWP limit from 1 Jan 2027**. The amendments were published 26 May but took effect **27 July 2026**, so `effectiveDate` is corrected too.
- The exposure's conclusion is reversed for data centres: the applied line keeps its near-term forced-transition catalyst. strategyRead #5 and the 26 May development entry are corrected to match, each marked as a v2 correction.
- Two primary sources added: the Federal Register PDF and the eCFR section.

#### `live-site-pages/profiler-data/narada.profile.json` — profileVersion 4 → 5 (v4 archived)
- The **H1 2026 interim** (filed 29 Aug on cninfo) added as its own financial period, read first-hand:
  - Revenue RMB 1.699B (−56.7%). Grid storage RMB 183.8M (−80.6%, gross margin −31.6%), comms and data-centre storage RMB 1.044B (−44.8%, gross margin −4.0%), recycling RMB 470.7M (−56.7%).
  - Net loss RMB 1.111B.
  - Equity attributable to shareholders RMB 290.2M (−79.5%), and total equity RMB 25.1M after negative minority interests. Liabilities are 99.8% of assets.
  - Cash RMB 465.3M, of which about RMB 409.6M is frozen.
  - The court had still not accepted the reorganisation petition.
- **strategyRead[1] revised and its confidence lowered from High to Moderate**: the comms/DC segment grew through FY2025 but not through H1 2026. strategyRead[0], strategyRead[2], the summary, the commentary and a new 29 Aug development updated. No USD overlay is stored for the interim, because no citable FX basis was established.

#### `googleAppsScripts/Classroom/Classroom.gs` — v01.90g → v01.91g
- **`landscape-cells-and-chemistry-2026-09`** (updated → 2026-09-24) and **`landscape-in-hall-power-2026-09`** — every "the segment grew through the collapse" claim is corrected (five passages across indicators, bets, the group-three paragraph and the claims ledgers). The Narada ledger rows are re-pinned at v5 and a dated revision note is added. `reviewBy` is unchanged in both.
- **`segment-in-hall-power`** and **`segment-cooling`** regenerated. These were the only two segments whose sections changed ("what-moved" gains Narada's H1 event; "the-fence" reads Trane's corrected EPA entry). The other pin-only segments were left alone under G3.

#### Other files
- `repository-information/industry-guidance/landscape-cells-and-chemistry-analysis.md` and `landscape-in-hall-power-analysis.md` — mirrored corrections and revision notes. The in-hall-power "flagged, not changed" Narada item is struck through as closed.
- `repository-information/CLASSROOM-CURRICULUM-PLAN.md` — inline correction on the §10.6 cooling-row history that carried the same broad EPA reading and the 26 May date.
- `profiler-companies.json` synced; `profiler-graph.json` rebuilt.
- Profiler checks: relationship checker 0 findings; cross-reference checker 0 candidates. Inbound reconciliation: 3 dossiers mention Narada, none with a financial claim, 0 changed. No other dossier cites the EPA rule.

## [v07.40r] — 2026-09-24 05:34:30 PM EST

> **Prompt:** "Recheck four Classroom Industry Guidance landscape modules whose reviewBy dates fall this week. Read first: .claude/rules/industry-guidance.md (especially the Freshness discipline section and step 7's render recipe), .claude/rules/classroom-app.md, repository-information/CLASSROOM-SCHEMA.md and repository-information/C5-SALES-SIMULATIONS-DESIGN.md §3, §6 and §12. The modules, in guidanceDocs_() in googleAppsScripts/Classroom/Classroom.gs, below the // CONTENT END fence: 1. landscape-cooling-2026-09: reviewBy 2026-09-28 2. landscape-neoclouds-2026-09: reviewBy 2026-09-30 3. landscape-utilities-2026-09: reviewBy 2026-10-01 4. landscape-in-hall-power-2026-09: reviewBy 2026-10-01 For each module: (a) List its dated gates and load-bearing claims: regulatory dates, tariffs, market shares, deployment calendars, capacity numbers, named programmes. (b) Re-check every claim whose gate has passed or is close, using targeted web research against primary sources. Also check which covered dossiers (live-site-pages/profiler-data/<slug>.profile.json) have been revised since the module's `updated` date. (c) Update content that has gone stale. Keep the content-scope rule: the landscape-* modules are the approved exception that may name companies. Bump `updated` and set a new `reviewBy` from the module's next dated gate. A module that is still accurate gets a refreshed `reviewBy` only. Never change a module id. For landscape-in-hall-power specifically: the OCP Solid State Transformer (SST) Specification, Revision 0.3.0 (Google, Microsoft and NVIDIA; effective 22 June 2026; announced by OCP 11 August 2026) is summarised first-hand in repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html, chapter 3.5 and Appendix E. Check the module against it: - two SKUs: 13.8 kV at 5 MW, and 34.5 kV at 5 or 10 MW - 800 V DC unipolar output - at least 98% efficiency from 50–100% load, power-train losses only - recommended overload of 120% for 5 s and 150% for 150 ms - an SST coupled with storage defined as an MV UPS - Modbus TCP/IP as the only communications requirement - BIL of at least 110 kV at 13.8 kV and 150–200 kV at 34.5 kV - the compliance list, with no UL 9540 The source PDF is not in the repo. Cite the specification itself, never the briefing, and state nothing about it beyond what chapter 3.5 records. Rehearsal scenarios: this is an attended developer session, so under design D6 you may re-judge scenario beats. Before editing each landscape, list the type:"scenario" lessons whose provenance names it as a guidance:landscape-* input. Read them off Classroom.gs using the check-classroom-content.py loader (parse_literals(src, 'clLesson')), not from memory. After editing, for every landscape whose `updated` moved: - re-judge each resting scenario's beats against the revised facts - revise the scenario where a beat no longer holds, or re-stamp its pin where it still holds - keep every scenario's `reviewBy` no later than its landscape's new `reviewBy` Two scenarios fall due this week regardless and need the same review: scenario-neoclouds-discovery (9/30) and the three utilities scenarios (10/1). The "6 · Rehearsal coverage" block of check-classroom-curriculum.py must show nothing left under "landscape moved under it" for these four modules. If build-classroom-segments.py --check then shows section changes caused by these edits, regenerate those segments in the same push per G3. Leave pin-only segments alone. Verify, all must pass: - node --check on a .js copy of Classroom.gs - node scripts/check-gas-inner-scripts.js - python3 scripts/check-classroom-content.py (0 errors, no new warnings) - python3 scripts/check-classroom-curriculum.py --strict - python3 scripts/check-classroom-pipeline.py --base origin/main (if it reports P3, meet the gateDigest refresh obligation in classroom-app.md) - python3 scripts/check-readme-tree.py - a Playwright render of each edited module at Classroom.html#guidance/<id> with zero page errors (pip install playwright; use the pre-installed Chromium; never run playwright install) Bookkeeping: bump Classroom.gs VERSION and live-site-pages/gs-versions/Classroomgs.version.txt. Add a generic Classroomgs.changelog.md entry that never names an analysed document. Add a CHANGELOG entry, bump the repo version and update the README timestamp. Use the normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main. Run git fetch --unshallow origin main first. The C2 pipeline Routine fires Wednesday 2026-09-30 11:00 UTC, so push well before it and check git ls-remote first. One push. Close with a per-module verdict table (current / updated / needs deeper refresh), the scenarios you re-judged and what changed in each, and anything left for me."

All four landscape modules due this week were re-verified against primary sources. Four parallel research passes were run, and every changed fact was re-read first-hand before it went in. All four modules were updated. The four scenarios resting on the two modules that carry them were re-judged, and every beat's correct answer holds. Segment lessons pin no guidance input, so `build-classroom-segments.py --check` is unchanged at 13 pin-only and 0 with section changes, and nothing was regenerated.

### Changed

#### `googleAppsScripts/Classroom/Classroom.gs` — guidance modules (below the fence)
- **`landscape-cooling-2026-09`** — `updated` 2026-09-17 → 2026-09-24; `reviewBy` **stays 2026-09-28**, because the CoolIT launch gate is still ahead.
  - The CDU ladder now leads with Schneider's 3.5 MW WCDU (23 Sep), so the adjacent member sits above two of four incumbents, not three.
  - The refrigerant row is narrowed to semiconductor chillers of 100 lb or less for 2030, plus the data-centre 700-GWP limit from 1 Jan 2027 (EPA).
  - The Texas freeze is widened to the 21 Sep TCEQ permit halt.
  - The Ecolab date is now 27 Oct.
  - Delta and LITEON tags are moved to v6 and v7.
- **`landscape-neoclouds-2026-09`** — `updated` 2026-09-16 → 2026-09-24; `reviewBy` **stays 2026-09-30**, because Fluidstack's accounts are not filed. This module needs a deeper refresh.
  - The rating basis is rewritten to ClusterMAX 3.0 (23 Sep): Nebius is Platinum beside CoreWeave, Crusoe drops to Bronze, and Fluidstack and Nscale are Unavailable.
  - Nscale's S-1 (18 Sep) moves the revenue-disclosure count to 3 of 7, confirms the Anthropic contract at up to about USD 44.6 bn, and puts about 1 GW of 1.37 GW at owned sites.
  - Fluidstack names its end customer.
  - IREN is re-pinned at v5.
- **`landscape-utilities-2026-09`** — `updated` 2026-09-14 → 2026-09-24; `reviewBy` 2026-10-01 → **2027-01-01**. The Alabama statute is confirmed, so the date moves to the next effective date.
  - The Texas behind-the-meter asymmetry is corrected for the 21 Sep permit halt, with a new indicator row for the 19 Oct TCEQ update.
  - Merger dates are attributed to Virginia (17 Nov) and South Carolina (8 Dec; 29 Jan order).
- **`landscape-in-hall-power-2026-09`** — `updated` 2026-09-15 → 2026-09-24; `reviewBy` 2026-10-01 → **2026-10-31**, because Samsung SDI's start is month-level.
  - Adds the OCP SST Specification Rev. 0.3.0 in one paragraph, one indicator row and seven ledger rows, each citing the specification.
  - Flex's revenue claim is corrected from its Form 10.
  - Delta is moved to v6.

#### `googleAppsScripts/Classroom/Classroom.gs` — rehearsal scenarios (developer session, design D6)
- **`scenario-neoclouds-discovery`** — changed: `the-room`, `beat-3`, `claims-ledger`, `what-the-record-does-not-say`. The end user is now named by the counterparty itself, the disclosure count is 3 of 7, and beat 3's day count is made date-stable. Pin: `guidance:landscape-neoclouds-2026-09` 2026-09-16 → 2026-09-24. `reviewBy` stays 2026-09-30.
- **`scenario-utilities-objection`** — changed: `what-the-record-says`, `beat-3`, `claims-ledger`. The merger calendar is corrected. Pin: `guidance:landscape-utilities-2026-09` 2026-09-14 → 2026-09-24. `reviewBy` stays 2026-10-01.
- **`scenario-utilities-discovery`** — changed: none. It is re-judged and re-stamped only. Pin 2026-09-14 → 2026-09-24. `reviewBy` 2026-10-01 → 2026-11-03.
- **`scenario-utilities-discovery-aidc`** — changed: `the-position`, `beat-2`, `claims-ledger`. The Texas premise is corrected, and beat 2's answer holds. Pin 2026-09-14 → 2026-09-24. `reviewBy` 2026-10-01 → 2026-12-10.

#### `repository-information/industry-guidance/landscape-{cooling,neoclouds,utilities,in-hall-power}-analysis.md`
- A revision section on each records what moved, the source, and what was flagged but not changed.

#### Versions
- Classroom GAS v01.89g → v01.90g (`Classroom.gs` `VERSION` and `Classroomgs.version.txt`), with generic `Classroomgs.changelog.md` lines.

### Notes
- **Checkers:**
  - `check-classroom-content.py`: 71 lessons / 8 tracks / 220 gate cases — 0 errors, 0 warnings.
  - `check-classroom-curriculum.py --strict`: no structural findings; 0 scenarios whose landscape moved under them; due-for-review 10 → 6.
  - `node --check`: clean.
  - `check-gas-inner-scripts.js`: all blocks parse.
  - `check-readme-tree.py`: 0 findings.
  - Playwright render of all four modules: 0 page errors.
- **`check-classroom-pipeline.py --base origin/main`** reports P1, P2, P10 and P13 only. All are expected on a developer commit: the four analysis files are outside the committer's write set, the modules sit below the fence, the caps bind the unattended committer, and D6 reserves scenario revisions for exactly this session. **No P3, so `gateDigest` is untouched.**

## [v07.39r] — 2026-09-24 05:05:10 PM EST

> **Prompt:** "[attached: Powering_the_Next_Era_of_AI_-_How_Google_Microsoft_and_NVIDIA_Are_Standardizing_and_Accelereating_the_Industry_Transition_to_LVDC.pdf] [attached: OCP_SST_Design_Specification_v0.3_FINAL.pdf] Per the Priority 1 list: 1. See attached for the OCP LVDC SST Spec v03 and the accompanying press release that announced it. Now that you have the spec, make sure to update my Megmeet SST Briefing accordingly and output a downloadable copy for me to read. Highlight all the changes made. Then, give me a prompt to paste into a new Opus 5.5 Medium or High session to recheck the 3 Classroom landscape modules."

The Megmeet SST briefing is updated from the OCP SST Specification, Revision 0.3.0, and OCP's announcement of 11 August 2026. The developer supplied both on 24 September; `opencompute.org` had refused them to this environment. Both were read in full, figures included. Every change in the briefing is highlighted in place, and a new Appendix E indexes them. The PDF goes from 76 to 84 pages.

### Changed

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html` and the rebuilt `MEGMEET-SST-BRIEFING.pdf` (76 → 84 pages)
- **New chapter 3.5, "What the OCP specification actually says"** — the scope (an MV SST coupled with storage functions as an MV UPS); a fifteen-row requirements table with what each row asks of a vendor; what Revision 0.3.0 leaves TBD; what the announcement adds; and an analysis box on what it changes for Megmeet.
- **Corrected second-hand claims** (old text struck through beside the new):
  - The specification's title, dates and authors: *Solid State Transformer (SST) Specification — Medium Voltage to 800 VDC Power Conversion Platform*, effective 22 June 2026, announced 11 August 2026. The first edition had "LVDC SST Specification, July 2026".
  - "More than 80 manufacturers building to it" is corrected to the announcement's wording: more than 80 partners developing 800 VDC-compatible infrastructure.
  - Chapter 8, NVIDIA question 13: the specification names Modbus TCP/IP.
  - Chapter 8, NVIDIA question 15: the specification does set harmonic and power-factor requirements (IEEE 519, IEC 61800-3 C4, IEC 61000-6-2/-4).
  - Week-one question 9 is rewritten around commenting on Revision 0.4.
  - Chapter 16.4 marks the OCP block as resolved.
  - The glossary entry, the flashcard and the chapter 1 term row are rewritten.
- **Added from the specification**:
  - Two SKUs: 13.8 kV at 5 MW, and 34.5 kV at 5 or 10 MW.
  - At least 98% efficiency between 50% and 100% load, counting power-train losses only.
  - Recommended overload of 120% for 5 s and 150% for 150 ms.
  - BIL of at least 110 kV at 13.8 kV and 150–200 kV at 34.5 kV.
  - 800 V DC unipolar output; IT ground floating or high-resistance grounded.
  - A cap of 10 mF of DC-link capacitance per 4 MW.
  - Siting in conditioned grey space or outdoors, NEMA 3R, with a 15+ year design life.
  - The ride-through bands and the state machine.
  - The compliance list, which includes no UL 9540.
  - These are placed on the cover, in I.1, I.2 (twenty-three numbers become twenty-seven), chapters 1, 3, 5, 6, 7, 8 and 13–16.
- **Two new items in chapter 16.3:** the specification plots ERCOT's NOGRR 282 curve with different corner points from the briefing's web-sourced test, and the specification carries three different dates.
- **New Spec citation tier**, references 85–89. They are appended rather than renumbering the document. New highlight CSS: `mark.chg`, `del.chg`, `tr.chg`, `.chg-block`.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`
- The same stale statements are corrected in `obstacles`, `timelines`, `terms`, `weekOne` and `calendar`, and the `dontSay` ±400 V row gains a note.
- Three OCP numbers are added to `numbersToKnow`, a `SPEC` entry is added to `tierVocabulary`, and there is a new `updated` field.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/`
- `mmsst-fig-calendar.svg` (M2) and `mmsst-fig-timelines.svg` (M11) are regenerated from the data file. The other twelve came out identical apart from timestamps and clip ids, and were left as they were.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`
- The data file is re-inlined byte-identically. `tierClass()` learns the `SPEC` prefix, with a matching `.t.s` colour, so Spec tags do not render as analysis.

#### `README.md`
- The `Last updated:` line and the briefing PDF's page count in the tree.

### Notes

- **Neither source PDF is stored in the repository.** The briefing's references 85–89 name them, and chapter 3.5 records what they say.
- **Verification:**
  - Every scripted replacement matched exactly once.
  - The PDF was built with `node scripts/build-megmeet-sst-briefing-pdf.mjs`, and the cover, I.2, I.4, figure M2, 3.5 (both pages), the chapter 8 question table and Appendix E were rendered and read.
  - The companion loads headless from `file://` with no console errors.
- **Not changed:** the chapter 6 ledger and figures M6, M7 and M12 record what vendors have *shown*, and the specification changes none of that. Megmeet's class stays undisclosed.

## [v07.38r] — 2026-09-24 09:08:52 AM EST

> **Prompt:** "[Scheduled Routine \"Profiler earnings desk\", fired 2026-09-24.] STEP 0 — clone, prove push works, before any research. Then: read repository-information/profiler-refresh-calendar.json as the queue. DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run, oldest nextReport first. For each: (1) verify the report actually published, (2) run the Profiler Command end to end including news triage against the Scraper corpus (`CORPUS_TOKEN` supplied in the Routine prompt only, never written to the repo), (3) advance the row's nextReport/confirmed/source/lastRefreshed/watch[]. Also: for any row that is unconfirmed and whose nextReport is within seven days, confirm the date and update the row — that is calendar work, not a refresh, and does not count against the cap. Land one commit per run under the repo's normal Pre-Commit/Pre-Push checklists. Never create/update/delete a Routine or trigger. If nothing is due, stand down."

### Changed

#### `repository-information/profiler-refresh-calendar.json`
- **No row is due.** Read all 177 rows (92 `nextReport`, 85 `cadence`); none of the 92 public rows has `nextReport` on or before 2026-09-23, so no dossier refresh ran and the three-row cap was not exercised.
- **`intertek` confirmed** (the one row unconfirmed with `nextReport` within seven days — 2026-10-01, six days out). This is calendar work, not a refresh: per the row's own note in `profiler-refresh-notes.json`, 2026-10-01 is not an earnings date but the opening of the watch-window for the EQT/ADIA/Mubadala scheme's court-sanction hearing (expected Q4 2026 or Q1 2027, with no fixed date). Verified via web search (Investegate RNS coverage, Reuters/TradingView, SWFInstitute) that the scheme timetable is unchanged since the row was last touched — shareholders approved the scheme 2026-08-06 (~98.7% of votes), court sanction is still pending with completion still guided to Q4 2026/Q1 2027, and no sanction/suspension/delisting announcement has landed. `confirmed` false → true, `lastRefreshed` 2026-09-09 → 2026-09-24. `nextReport` unchanged (still the correct window-open date). No dossier written — none was due.
- **`updated`** 2026-09-23 → 2026-09-24.

### Notes

- **Stand-down accounting**: 177 rows read, 0 taken for refresh (cap of 3 not exercised), 1 row re-confirmed via calendar work, 0 rows re-dated. The earliest `nextReport` in the queue is now `intertek` (2026-10-01), but that date is a watch-window open, not an earnings report — the next actual report due is `abb`, `nextReport` 2026-10-20.

## [v07.37r] — 2026-09-23 10:37:40 PM EST

> **Prompt:** Regenerate the five Classroom segments whose content changed (power-conversion-and-rack-power-silicon, cells-and-chemistry, storage-integrators-and-containers, grid-equipment, hyperscalers-and-ai-labs) and leave the 13 date-only ones alone. Archive old sections of the repo CHANGELOG and the Classroom GAS changelog in the same push.

This closes the regeneration item left open at v07.36r. `build-classroom-segments.py --check` read 18 of 19 segments due, 5 with section changes and 13 pin-only. The five were regenerated, and `--check` now reads 13 due, all pin-only. Both changelogs were rotated in the same push.

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs` v01.88g → v01.89g** — five segment lessons regenerated with `build-classroom-segments.py --segment <id>` (generation date 2026-09-23). Each appends one `revisions[]` entry, and its `changed[]` is exactly the set of differing sections:
  - **`segment-power-conversion-and-rack-power-silicon`** — changed: `the-players`, `what-moved`, `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:delta-electronics` 2026-09-04→2026-09-23, `profile:liteon` 2026-09-05→2026-09-23, `profile:megmeet` 2026-09-08→2026-09-23. This carries the Megmeet v8 basis-line change that v07.33r left due.
  - **`segment-cells-and-chemistry`** — changed: `what-moved`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:novonix` 2026-09-09→2026-09-22.
  - **`segment-storage-integrators-and-containers`** — changed: `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-21→2026-09-23.
  - **`segment-grid-equipment`** — changed: `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23.
  - **`segment-hyperscalers-and-ai-labs`** — changed: `what-moved`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:oracle` 2026-08-30→2026-09-21.
  - No track changed.
- **The 13 pin-only segments were left alone:** bridge-and-on-site-generation, clean-firm-and-nuclear, cooling, compute-and-the-rack, epc-and-construction, storage-developers-and-ipps, aidc-developers-and-landlords, neoclouds, utilities, capital, assurance, software-and-optimization and insurance-and-risk-transfer. Their inputs moved but no section differs, so G3 keeps both their text and their pins.
- **`live-site-pages/gs-versions/Classroomgs.version.txt`** → `|v01.89g|`, with a generic entry in `Classroomgs.changelog.md`.
- **`README.md`** — the `Last updated:` line and the Classroom GAS version display (synced by `check-readme-tree.py --fix`).

### Notes

- **Archive rotation — both changelogs, at the developer's instruction.** Neither was strictly triggered at 2026-09-23 EST: the repo CHANGELOG had 108 sections with 16 exempt as today's, so 92 non-exempt, and the Classroom GAS changelog had 51 with 2 exempt, so 49. Both were rotated anyway, because the prompt asked for it and the repo CHANGELOG would trigger at the first push after midnight. Each rotation moved exactly one whole date group, the oldest, and left both files below their caps even once today's sections lose their exemption:
  - **`CHANGELOG.md` → `CHANGELOG-archive.md`:** the 2026-09-17 group, 19 sections (`v06.30r`–`v06.48r`). `Sections: 107/100` → `89/100`.
  - **`Classroomgs.changelog.md` → `Classroomgs.changelog-archive.md`:** the 2026-09-15 group, 10 sections (`v01.39g`–`v01.48g`). `Sections: 50/50` → `41/50`.
  - **SHA enrichment:** 29 of 29 resolved on the deepened clone, and none are marked `[SHA unavailable]`. Each file keeps its existing link style: an 8-character short SHA in the repo archive and 7 characters in the GAS archive. Post-rotation verification (`grep '^## \[v' … | grep -v '— \['`) is empty for both archives.
- **Checks:**
  - `build-classroom-segments.py --check`: 13 due, 0 with section changes, 13 pin-only.
  - `check-classroom-content.py`: 71 lessons, 8 tracks, 220 gate cases, 0 errors, 0 warnings.
  - `check-classroom-pipeline.py --selftest`: 15 fixtures, 0 failures.
  - `check-classroom-pipeline.py --base origin/main`: no P3 finding, so `gateDigest` is unchanged. P10 reports 5 revised lessons against the cap of 3, which binds only unattended pipeline runs, and segment lessons are regenerated by developer sessions by design.
  - `node --check` passes, `check-gas-inner-scripts.js` passes (106 inner script blocks), `check-classroom-curriculum.py` has no structural findings, and `check-readme-tree.py` reports 0 findings.

## [v07.36r] — 2026-09-23 09:28:35 PM EST

> **Prompt:** fix the looks-wrong list. Do your own independent research and/or cross-check to determine a conclusion. If you cannot make the call, explain the context and decision to me and I will decide.

The v07.34r rewrite listed six things in the Megmeet SST briefing that looked wrong but left them alone. Each was checked against the primer, the document's own tables, git history or the primary sources, and all six were decided and fixed. None needed the developer's call. The PDF stays at 76 pages with 84 numbered references.

### Fixed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`**
  - **Chapter 7 intro.** It named one owned unsolved obstacle, but its own table has two. The sentence now names both: FERC for the interconnection queue and the NFPA Fire Protection Research Foundation for the DC arc-flash model.
  - **Chapter 16.2.** The bullet saying the NC State / NYPA / EPRI 1 MW feeder voltage was undisclosed is removed. NC State's releases of 18 August give only "up to 1 MW", but POWER Magazine of 8 September, which the primer cites, reports a live 13.2 kV feeder.
  - **Chapter 16.4 box.** It said chapter 7's newsletter-sourced claims were "marked low confidence where they appear". Git history shows no such marking in any version, and the NEC Article 706 "100 V DC default" it warned about appears nowhere in the document. The box now says what can be said: the claims cannot be told apart one by one, so check a web-sourced standards claim against the standard before quoting it.
  - **I.3 item 2.** Primer 7.3 names eight SST developers, so calling Novos Power the "sixth" name was wrong. The heading drops the ordinal and a new first sentence lists the eight.
  - **Appendix D.** The D.3 PDF row and the colophon statistics now say which moment each page count describes: 69 at the first build, 71 after the audit pass, 72 after the v8 amendment and 76 after the rewrite. A follow-up note records the six corrections.
  - **Chapter 9.4.** The note above the v8 table no longer says the data file still lists "the US".
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`**
  - Watchlist item 2's headline drops "fifth". Its "was" field now lists primer 7.3's full roster.
  - The footprint objection answer now matches dossier v8: manufacturing in China and Thailand, contract manufacturing in India, R&D in Germany, and a Richardson base that only the company's website describes.
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`** — the data file is inlined again, byte-identically.
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/mmsst-fig-watchlist-delta.svg`** — Figure M1 is regenerated with the new headline. The other thirteen figures regenerated identically and were left as they were.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages.

### Notes

- **Scope.** The v07.34r prompt put the data file, the companion and the figures out of bounds for the rewrite. This prompt asked for the looks-wrong list to be fixed, and item 6 sits in the data file.
- **Archive rotation is not due.** The counter reads `107/100`, but 15 sections carry today's date, leaving 92 non-exempt.

## [v07.35r] — 2026-09-23 08:57:20 PM EST

> **Prompt:** *(no new prompt — this version works the fresh-subagent audit that the v07.34r prompt required; that prompt is quoted in full under v07.34r)*

The fresh audit of the Megmeet SST briefing rewrite returned fifteen findings. Most sat in the dossier-v8 corrections. All fifteen were worked: fourteen fixed and one verified correct. The PDF stays at 76 pages with 84 numbered references.

### Fixed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`**
  - **Chapter 13, first objection.** The FCC Covered List sentences carry their web number again. The v8 rewrite had left them in front of a dossier-v8 number, which made them read as v8's. The Dallas-lab and San Jose sentence is also cited to the web again.
  - **Chapter 9.3.** The unsourced lead "larger than the filings show" becomes "the website and the filings differ". The closing line no longer merges the website's 35,000 sq ft base and the licensed 39,200 sq ft renovation into one site.
  - **Chapter 16.2.** The US-plant item keeps its original question: whether the November 2024 plant, the Richardson base and the Dallas lab are the same thing. It no longer implies the plant is the Richardson base, and it restores the caveat that capacity and timeline are unpublished.
  - **Week-one question 6.** The GB300/ODM fact is attributed again to the Goldman Sachs note relayed by Sina, with "neither named".
  - **Chapter 14.** "The story is settled, and it is wrong" becomes "the question is now closed, and the record does not support the story".
  - **Chapter 9.4.** The note above the v8 table now says two things were not rewritten: the first table is annotated rather than changed, and the data file still lists "the US" among the manufacturing locations.
  - **Smaller fixes:**
    - 9.2's added "read from the grid down" is dropped;
    - the Power Brick gloss is dropped;
    - the 6.2 analysis passage carries its gold A;
    - I.2's NOGRR row is back to "meets it by design";
    - question 13 no longer calls DMTF a protocol;
    - chapter 2's EV-charging order is explicit again.
  - **Chapter 10, Heron row.** Megmeet's "manufacturing base across five countries" contradicted the corrected footprint. It is now six bases, five in China and one in Thailand, citing v8.
  - **Appendix D.** The rewrite note lists every extension of the v8 corrections and the one attribution change: the 60.92% growth now belongs to the power-products segment. It also records that figure captions carry numbers and summarises the audit.
  - **Cover.** "overnight" is restored.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages.

### Notes

- **Verified, not changed:** audit finding 7. The chapter 1 walkthrough's DAB/CLLC/MFT bullet cites primer figure 4, which sits in §3.1 and whose caption states exactly that stage.
- **Archive rotation is not due.** The counter reads `106/100`, but 14 sections carry today's date, leaving 92 non-exempt.

## [v07.34r] — 2026-09-23 08:50:50 PM EST

> **Prompt:** "Rewrite the Megmeet SST onboarding briefing for clarity and learning, and convert its citation tags to numbered, colour-coded superscripts. This is an editing pass on a finished document: no new research, no new facts, no lost facts.
>
> ## What you are editing
> - Source: repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html (about 1,030 lines, 72 printed pages, five parts plus appendices A–D).
> - Output: the same file, rebuilt to repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf with `node scripts/build-megmeet-sst-briefing-pdf.mjs` (and `--png` for proof pages).
> - Context, read before you start: repository-information/megmeet-briefing-prompt.md (why the document exists and who it is for), chapter 9.4 in full, Appendix C, and Appendix D (the colophon, which records the design decisions you must not undo by accident).
> - Pre-flight check: chapter 9.4 must contain a second table headed "What dossier v8 records". If it does not, the evening-of-23-September amendment has not reached main. Stop and say so.
>
> ## Who reads it, and what "better" means
> The reader is the developer: a new Senior Sales Manager for SST solutions at Megmeet, starting 2026-10-07. The goal is to learn the technology and the market well enough to hold an engineering conversation, not to skim.
> - Explaining a concept thoroughly beats being concise. Cut words that carry nothing: throat-clearing, repeated caveats, stacked qualifiers, sentences that restate the previous one. Never cut a step in an explanation. If a paragraph assumes something the reader has not been taught yet, add the missing step. Define every term the first time it appears, even when the glossary also has it.
> - Write like a careful human expert explaining to a colleague. Vary sentence length. Use concrete nouns and active verbs. Use a plain-language analogy where it genuinely helps, then give the precise statement. Avoid stock phrasing, chains of em-dashes, bold on every other clause, and rhetorical triplets. Keep technical precision: units, voltage classes, standards numbers and dates stay exact.
> - Keep the structure. Keep the parts, the chapter numbers, the figure numbers and the table columns. A table may be split or a paragraph turned into a list if that is clearer, but no chapter moves and no figure is dropped.
> - Scripted language stays scripted. "The sentence to say it in" (chapter 1) and "the one sentence" (chapter 10) are sales lines. Tighten them, but they must stay sayable aloud.
>
> ## The citation change — from tags to numbered superscripts
> Today every factual sentence ends in a bracketed tag such as <span class="t w">[WEB, verified 2026-09-23]</span> or <span class="t d">[DOSSIER megmeet v7]</span>. There are about 590 tags but only about 89 distinct strings; 245 of the 590 are the identical WEB tag. Replace them as follows.
> 1. One number per distinct source string. Every distinct tag string becomes one numbered reference: [DOSSIER megmeet v7] is one number, [PRIMER ch.6.1] another, [GUIDANCE nvidia-800vdc p17–21] another, [WEB, verified 2026-09-23] another. Number them in order of first appearance in the document, starting at 1. Do not split the WEB tag into per-URL numbers unless the sentence-to-URL mapping is already certain from the text: Appendix C lists the URLs, but which sentence used which URL was not recorded, and a guessed mapping is worse than a shared number.
> 2. The in-text marker is a superscript number coloured by tier, placed after the sentence's final punctuation, for example <sup class="c d">7</sup>. Keep today's five tier colours exactly (.t.p, .t.d, .t.g, .t.r, .t.w map to --s1…--s5). Define sup.c rules that reuse those variables, so the colour still tells the reader the tier at a glance.
> 3. Analysis is not a source, so it gets no number. An inline [ANALYSIS] becomes a gold superscript A (<sup class="c a">A</sup>). The labelled analysis boxes (.an) stay exactly as they are.
> 4. The rule stays one source per sentence. Every factual sentence still carries exactly one superscript. The one relaxation: a table cell or list item drawn wholly from one source carries one superscript at its end, which is already the document's convention for its wide tables.
> 5. Replace the citation-contract table on the "Read this first" page with a short legend: what a superscript number means, the five tier colours each with a one-line description of the tier, the gold A, and a pointer to the numbered list.
> 6. Add the numbered reference list as a new first section of Appendix C, "C.0 Numbered references". Give one row per number with the number (in its tier colour), the tier, and the full pointer: slug and version, chapter or figure, page range, or "web research of 23 September — see the URL list below". Keep the existing tier-grouped URL list under it.
> 7. Out of scope for renumbering: megmeet-sst-briefing-data.json and megmeet-sst-briefing-companion.html keep their tag strings, because the companion inlines the data file byte for byte. Figure captions that say "Composed from megmeet-sst-briefing-data.json" stay as they are.
>
> ## One content change, and only one
> Chapter 9.4's second table lists seven places where Megmeet dossier v8 contradicts the body: week-one question 6, chapter 16.3, the consensus figure, chapter 13's footprint line, chapter 9.3's US-entity paragraph, chapter 14 and question 10 on the LITEON story, and Appendix D.2's 10 kV / 35 kV note.
> Correct the body at each of those places so it reads true, and cite dossier v8 there. Keep both 9.4 tables as the record of what changed and when. Update the sentence above the second table that says the body "has not been changed to match", because after this pass that is no longer true. Apart from those corrections, every fact, number, date, name and source stays as it is. If you find something else that looks wrong, list it in your summary. Do not fix it.
>
> ## How to work
> - Go chapter by chapter, reading each one whole before editing it. Use targeted edits, never a whole-file rewrite, and follow the repository's Incremental Writing rule.
> - Before the first edit, copy the original HTML to your scratchpad. Write a small checker there, not in the repository, that compares the original with the edited file:
>   - every number token (digits with their units and signs) that exists in the original still exists in the edited file, except where the 9.4 corrections deliberately change one;
>   - every distinct original tag string maps to exactly one reference number;
>   - every superscript number resolves to a row in C.0, and every row in C.0 is used;
>   - no sentence ends a factual claim without a superscript or an analysis marker.
>   Run it after every chapter and fix what it reports before moving on.
> - Proof the PDF by looking at it. Build with --png and read every proof page. Then build the PDF and read the pages for the legend, the first chapter, chapter 9, and C.0. Report the page count before and after.
> - Get a fresh audit. When the rewrite is complete, give a fresh subagent no drafting context. Have it compare the original and the rewritten HTML chapter by chapter for three things: a fact that changed, a caveat or limitation that was dropped, and a concept explanation that got harder to follow. Work every finding.
> - Update Appendix D. Add a short note that the document was rewritten for clarity and its citations renumbered on the date of the run. Say what changed in the citation system and what did not. Do not name any AI model anywhere in the document; the colophon records effort and run window only, as it does now.
> - Commit and push under the repository's normal Pre-Commit and Pre-Push checklists. That means a repo CHANGELOG entry and a repo version bump. The study-prep files are not deployed, so there are no page or GAS version bumps.
>
> ## Do not touch
> - Any Profiler dossier, report, registry or segment file.
> - The data file, the companion, the figure script and the figures.
> - The older prep documents: the interview brief, the lesson plan and the study guide.
>
> ## Report at the end
> - Page count before and after, and the number of references in C.0.
> - The chapters where an explanation was expanded rather than cut, with one line each on why.
> - Anything you found that looks wrong but left alone.
> - The audit's findings and what you did with each."

The Megmeet SST onboarding briefing is rewritten for clarity and learning. Its 588 bracketed tier tags are now numbered, tier-coloured superscripts resolved in a new Appendix C.0, and the body is corrected at every place dossier v8 contradicts it. The PDF goes from 72 to 76 pages. The fresh-subagent audit is running against this version; its findings will be worked in the next push.

### Changed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`** — an editing pass, with no new research.
  - **Clarity.** Every term is defined at first use, long sentences are split, and repeated caveats are cut.
  - **Expanded explanations:**
    - chapter 1 gains a four-step walk through one SST, from primer figure 4;
    - I.2 explains the transformer equation and the I = P ÷ V arithmetic behind 18.5 kA;
    - chapter 6.2 works one cell count through the primer's own assumptions (0.935 kV per cell, 31.0 kV phase peak, 35 cells per phase).
  - **Structure.** Parts, chapter numbers, figure numbers and table columns are unchanged. Three paragraphs became lists: the cheat-sheet points, the rack ladder, and 5.5's advantages.
  - **Citations.** One number per distinct source string, 84 in all, numbered by first appearance, with `sup.c` rules reusing `--s1…--s5`.
    - All web research shares one number.
    - Inline `[ANALYSIS]` becomes a gold `A`. This also fixes two tags that carried the web colour.
    - The citation-contract table becomes a source legend.
    - Appendix C gains C.0, generated from the same mapping as the superscripts.
  - **Dossier v8 corrections**, each citing v8:
    - chapter 9.3's US footprint (the Richardson base);
    - chapter 13's footprint answer and its "never infer a class" cell;
    - chapter 14's LITEON row;
    - week-one questions 6 and 10;
    - 16.2's US-plant item and 16.3's greenfield contradiction, now marked resolved;
    - chapter 9.1's contrary-source box and D.2's 10 kV / 35 kV note.
    - Both 9.4 tables stay as the record. The two first-table rows that v8 revised are marked, and the sentence above the second table now says the body was corrected.
  - **Appendices.** A and B are regenerated from the rewritten chapter 1, so all three copies of the term system match.
    - Appendix C's dossier list adds `liteon v7` and `megmeet v8`, which were already cited in 9.4.
    - Appendix D gains a rewrite note, and D.2's pointers to the old citation-contract page are updated.
  - **Cover.** The footer is no longer absolutely positioned, because the longer BLUF overlapped it.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages. The `--png` proofs were read page by page.
- **`README.md`** — the tree descriptions for the briefing PDF (page count) and its source (the citation form) are updated.

### Notes

- **Not touched:** the data file, the companion, the figure script and the figures (their captions keep the original tag strings), the Profiler data, and the older prep documents.
- **Checker (scratchpad only)** compares the original and the edited HTML: number tokens, the tag → number mapping, C.0 coverage and uncited sentences. It is clean. The two number-token exceptions are formatting only (`342 x` → `342 ×`, and `native-800` reworded).
- **Archive rotation is not due.** The counter reads `105/100`, but 13 sections carry today's date, leaving 92 non-exempt.

## [v07.33r] — 2026-09-23 06:59:05 PM EST

> **Prompt:** "[Image attached: the briefing's "The Citation Contract" page — the five colour-coded source tiers (PRIMER, DOSSIER, GUIDANCE, REPORT, WEB) and the ANALYSIS label]
> I want all of the six contradictions to be reflected in briefing chapter 9.4 and want you to issue a superseding edition of the 9/23 report. I also want you to push the in-hall-power adjacent membership by regenerating segment-in-hall-power in Classroom.gs. I also want you to remove the reminder to "paste the Megmeet SST briefing prompt".
>
> Also, I want you to review the entire Megmeet SST brief with [model name withheld] and rewrite anything that could be more concise or clearer since I heard [model name withheld] writes the most like a human. I also want you to simply number the attached Citation sources and add the superscript number after the cited statement. That way, we can cut down on repeated letters and shorten the overall report. It also looks cleaner. I like the color-coded sources though, so keep that. While you are evaluating how to rewrite parts of the report, keep in mind that I will be the one reading the report and my goal is to learn, so write concisely but prioritize explaining concepts thoroughly over concision. I would like this review/rewrite task to be in a separate [model name withheld] session, so give me a prompt to paste into a new [model name withheld] session and recommend an effort level for me to set [model name withheld] to."

Follow-through on dossier v8. Chapter 9.4 of the briefing now records the six contradictions, the 23 September report is superseded by a second edition, Megmeet's `in-hall-power` adjacent membership is restored with its Classroom lesson regenerated, the briefing reminder is closed, and a paste-in prompt is written for a separate clarity-and-citation rewrite of the briefing.

### Added

- **`live-site-pages/profiler-data/reports/sst-hall-edge-block-rev2--competitive--2026-09-23.report.json`** — the superseding edition.
  - The id changes the topic slug rather than the date, because today's date already names the morning edition and the id format is `<topic>--<type>--<date>`.
  - It re-pins Megmeet v8, Delta Electronics v6 and LITEON v7; the other fifteen pins are unchanged.
  - A new first section, "What changed since the morning edition", lists the changes.
  - Key judgement 3 (Megmeet's class) now rests on the full filing search and bounds the 10 kV / 35 kV press lead against the filed IR record.
  - Key judgement 4 corrects "the only segment with an expanding gross margin" to "the only one of the three largest", and replaces the contested number-two account with its rumour origin and the third-source estimate.
  - Key judgement 8 adds the Richardson base.
  - The Megmeet rows in the class and Asia-set tables are updated, and the Megmeet section gains the company's own two-to-three-year SST timing.
  - 13 citations added (c47–c59), copied verbatim from Megmeet v8's `sources[]`, for 59 in total.
- **`repository-information/megmeet-briefing-rewrite-prompt.md`** — the prompt for the separate rewrite session:
  - clarity-first editing for a reader who is learning;
  - one number per distinct citation source (about 89), shown as tier-coloured superscripts, with a gold `A` for inline analysis;
  - a new C.0 numbered reference list, and a legend replacing the citation-contract table;
  - the dossier-v8 corrections applied to the body;
  - a scratchpad fact-preservation checker, PNG proofing and a fresh-subagent audit.
  
  The file names no model.

### Changed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`** and the rebuilt **`MEGMEET-SST-BRIEFING.pdf`** (71 → 72 pages):
  - Chapter 9.4 is retitled "What the dossier now contradicts — v7 in the older prep documents, v8 in this briefing" and gains a second table of seven rows:
    1. The Q1 2026 date covers AIDC delivery generally; North America's batch delivery is H1 2026.
    2. The greenfield-versus-Q1 tension resolves: volume, but no named reference win.
    3. Consensus is RMB 787M, not 832M.
    4. Chapter 13's footprint line overclaims: manufacturing is in China and Thailand, with contract manufacturing in India and R&D in Germany.
    5. The US base is located in Richardson, Texas, but not in the filings.
    6. The LITEON story is closed as rumour, with Megmeet a prospective third source.
    7. The D.2 10 kV / 35 kV lead is now read and bounded.
  - The colophon gains a dated amendment note. The body is otherwise unchanged; the rewrite session applies the corrections to it.
  - The data file and the companion are not touched.
- **`live-site-pages/profiler-data/reports/reports-index.json`** — the new edition is added as `current`, and the morning edition is flipped to `superseded`.
- **`live-site-pages/profiler-data/profiler-segments.json`** — Megmeet is restored to `in-hall-power` as `adjacent`. The basis is the storage-compensation layer named in the H1 2026 interim: BBU and capacitor shelves, and a DC-centre BESS. The registry mirror is synced.
- **`googleAppsScripts/Classroom/Classroom.gs` v01.87g → v01.88g** — `segment-in-hall-power` regenerated with `build-classroom-segments.py --segment in-hall-power`. Seven sections changed: players, connections, numbers, fence, where-it-sits, what-moved and read-next. `power-conversion-and-rack-power-silicon` is still due from the v8 basis-line change and was left for a separate regeneration.
- **`repository-information/REMINDERS.md`** — "Paste the Megmeet SST briefing prompt" moved to Completed Reminders at the developer's instruction; Active Reminders is now `*(none)*`.
- **`README.md`** — tree entries added for the rev2 report and the rewrite prompt; the Classroom GAS version display is updated.

### Notes

- **Checks:**
  - `check-profiler-reports.py`: 0 errors. The morning edition's three aged-pin warnings are gone now that it is superseded.
  - `check-classroom-content.py`: 0 errors.
  - `check-classroom-pipeline.py --selftest`: 15 of 15 pass.
  - Gate digest: `check-classroom-pipeline.py --base origin/main` shows no P3 finding, so `gateDigest` is unchanged. Its P1 write-set findings bind only unattended pipeline runs, not a developer session.
  - `node --check` and `check-gas-inner-scripts.js` pass, and the Profiler registry, relationship and cross-reference checks are clean.
- **Prompt blockquote:** the model name in the prompt is replaced with `[model name withheld]`, because this environment forbids model identifiers in repository files. Everything else is verbatim.
- **Archive rotation not performed:** 92 non-exempt sections, and today's are exempt. The Classroom GAS changelog reaches `50/50`, which matches the Profiler page changelog's precedent of rotating only when it exceeds 50.

## [v07.32r] — 2026-09-23 03:51:59 PM EST

> **Prompt:** "profiler Megmeet
>
> This is a **revision**, not a new profile: `live-site-pages/profiler-data/megmeet.profile.json` is at
> profileVersion 7, dated 2026-09-08, 38 sources. Cut **v8**. Follow the Profiler Command in
> `.claude/rules/profiler-app.md` end to end — archive v7 first, then research, write, register, sync,
> reconcile. Read `repository-information/PROFILER-SCHEMA.md` before writing.
>
> WHY NOW: Megmeet's Q3 2026 report is due at the CSRC statutory deadline **by 31 October 2026**. Cut v8
> before it lands so the delta is legible when it does, and so the September briefing's open questions are
> carried into the dossier rather than living only in a study-prep document.
>
> IDENTITY FIRST (step 1a — do not skip, and do not take these from the registry row):
> - Ticker/exchange: the registry says `SZSE: 002851`. Confirm off a filing cover or an exchange notice
>   dated within twelve months.
> - Legal name vs operating brand: v7's `name` field carries both the English and the native-script name
>   but `legalName` is **null**. Establish the registered legal name and set it.
> - `aka[]` is **null** and must be populated before step 7's reconciliation grep, which consumes it.
>   At minimum: 麦格米特 · Shenzhen Megmeet Electrical Co., Ltd. · Megmeet Welding (megmeet-welding.com) ·
>   Megmeet USA. Add any others you establish.
> - Still independent? Check for any transaction in the last eighteen months, and specifically the status
>   of the **pending Hong Kong listing** — v7 records it as pending and it may have moved.
>
> THE OPEN QUESTIONS TO GO AT. These are the holes the 23 September onboarding briefing named as
> unclosable from the then-current record. Each is a research target, not an assumption — if the record is
> still silent, record the silence and bound it:
> 1. **The SST's service-voltage class.** Zero "kV" mentions across all 38 sources pinned in v7 and zero
>    hits in a four-filing text scan (FY2025 annual, H1 2026 interim, two IR records) for kV, 千伏 or 中压.
>    The converter is described only as "grid HV input to 800 V DC", and the most recent filing narrowed
>    the efficiency claim to *expected*. This is the single most valuable fact in the dossier.
> 2. **What Q1 2026 "volume delivery to North American majors" actually consisted of, and who they were.**
>    v7 records it; the August 2026 interview brief says North America is greenfield with no reference win.
>    Both statements are in the corpus and they are not obviously reconcilable.
> 3. **Whether the US plant Megmeet confirmed in November 2024 is the Dallas facility.** The company
>    confirmed a US factory and never named location, capacity or timeline. The Dallas *laboratory*
>    (360 kW active, 1.5 MW roadmap, June 2026) is separately and firmly evidenced by Megmeet's own
>    English release — the two are not confirmed to be the same thing.
> 4. **Any AI-data-centre revenue line at any granularity.** None is disclosed; the power-products group
>    is the closest published proxy (+60.92% to RMB 1.841bn in H1 2026 at a 25.06% gross margin).
> 5. **FY2025 gross margin by segment beyond the appliance line**, and **absolute R&D spend** for FY2025
>    and H1 2026. Neither was located.
> 6. **Any named US customer for any product line.** None located. (Ericsson, Cisco, Juniper, Arista and
>    Accton are recorded as buying Megmeet power — establish whether any is a *US-entity* relationship.)
> 7. **OCP membership and any role in the LVDC SST specification work.** Not found, but opencompute.org
>    returned HTTP 403 to every attempt, so this is an unverified negative rather than a confirmed one.
>    If the host is reachable from your session, settle it.
> 8. **Any UL or ETL listing number for a data-centre product.** None disclosed; the company claims UL,
>    TÜV and CNAS *laboratory accreditations*, which are an in-house testing credential and not a listed
>    product. Do not let the two be conflated in the prose.
> 9. **The "displaced LITEON as the number-two NVIDIA power-shelf source" claim.** No supporting source was
>    located, the company has never claimed it, and two research houses covering the same market in
>    mid-2026 name Delta and LITEON without mentioning Megmeet. If v8 finds nothing either, say so
>    explicitly rather than omitting it.
>
> SOURCING:
> - Run `python3 scripts/check-source-reachability.py` before planning Stage 2.
> - **v7 has zero sources marked first-party** (`party` is absent on all 38) even though the registry
>   reports 58% first-party. Stage 1 is therefore genuinely under-served: exhaust megmeet.com,
>   megmeet-welding.com, the IR archive, cninfo filings and the product/datasheet pages before any
>   third-party source, and set `party` on every entry so the registry's coverage line means something.
> - Two parallel general-purpose subagents (A first-party, B third-party), ~50–70 evaluated sources.
>
> RECONCILIATION (step 7 — 13 other dossiers mention Megmeet with word boundaries):
> delta-electronics · dg-matrix · flex · huawei-digital-power · infineon · liteon · nvidia ·
> power-electronics · sinexcel · sungrow · vertiv · vicor · zhonhen. Read each hit, classify it, and act.
> Then run `check-profiler-crossrefs.py`, `sync-profiler-registry.py`, `build-profiler-graph.py` and
> `check-profiler-relationships.py`. Re-read the segment membership
> (`power-conversion-and-rack-power-silicon`, role `challenger`) against the revised `ecosystemRole` and
> product lines and move it if the record moved.
>
> DO NOT EDIT the September study-prep files — `MEGMEET-SST-BRIEFING.pdf`, its print HTML, the companion,
> the data file, or `sst-hall-edge-block--competitive--2026-09-23.report.json`. They are dated documents.
> If v8 contradicts any of them, say so in your response summary and let me decide; the briefing's
> chapter 9.4 is where that list belongs, not in this commit.
>
> Normal Pre-Commit and Pre-Push checklists. Note that the repo CHANGELOG counter is at 102/100 with 92
> non-exempt — **archive rotation fires on the first push that is not dated 23 September**, so expect to
> perform it, SHA-enriched, and deepen the clone first with `git fetch --unshallow origin main`."

Megmeet dossier cut to **profileVersion 8** under the Profiler Command, ahead of the Q3 2026 report due by 31 October. Two parallel research agents (A first-party, B third-party) evaluated about 100 sources; v8 cites 81, each with an explicit `party` (29 company · 20 disclosure · 32 independent — 60% first-party). Reconciliation revised the Delta Electronics and LITEON dossiers, where the "Megmeet displaced LITEON at #2" claim had been carried as corroborated.

### Changed

#### `live-site-pages/profiler-data/megmeet.profile.json` — v7 → v8 (v7 archived)

- **Identity verified off filings dated within twelve months.** SZSE: 002851 from the H1 2026 interim cover; registered names 深圳麦格米特电气股份有限公司 / "Shenzhen Megmeet Electrical Co.,Ltd." from the FY2025 annual report and the HKEX A1; former name "Shenzhen Megmeet Electrical Technology Co., Ltd." The legal name stays in `name` — the schema's canonical field, which the renderer already treats as the legal line when it differs from `shortName` — rather than adding the `legalName` variant shape the schema says to normalise away
- **Still independent.** No merger or sale. On **22 September 2026** the board agreed to buy the 46.30% minority of Shenzhen Megmeet Welding Technology for RMB 663.64M cash (announcement 2026-085). The **H-share A1** (filed 26 June; Huatai International and Citi; CICC HK and CMBI added 8 July) has **no hearing and no CSRC filing notice** on record as of 23 September
- **The nine open questions:**
  1. **SST voltage class — still undisclosed, now bounded.** No kV figure appears in any filing, IR record, product page (neither site has an SST page) or the April 2026 brochure. The efficiency wording went from an unqualified "超98.5%" (FY2025 annual) to "expected" (HKEX A1, H1 interim), and the SST is 预研 / 研发中. One press lead, ifeng (1 July 2026), reports "国内10kV/海外35kV" and attributes it to the 20 May call, but **the exchange-filed record of that call contains no kV**. In August the company said SST demand will not ramp for 1–2 years and that sales for 2–3 years will come from existing products
  2. **North America — the v7 wording was imprecise.** The interim dates the start of AIDC batch delivery to Q1 2026 **across its customer chain**. The North America sentence is separate: batch delivery to "部分北美大客户" in **H1 2026**, and by the 29 April annual-report date. No customer is named (NDA). The company says it was **late on GB200** with limited orders and won GB300 batch orders; Goldman (via Sina) says the first GB300 order ran through a US-headquartered ODM. That reconciles the two corpus statements: there is volume but no named reference win
  3. **US plant — located, but not in the filings.** The company's own About pages place a 35,000 sq ft "U.S. manufacturing base" in the Fujitsu Industrial Park in Richardson, Texas, and a Texas TDLR record shows a 39,200 sq ft Megmeet renovation at 2821 Telecom Parkway, Richardson (2024). The HKEX A1 lists six manufacturing bases and none in the US, and the Dallas lab release does not say it is on the same site
  4. **AI-data-centre revenue — none disclosed.** The closest statement is the August IR record: data-centre and network power grew most within the +60.92%
  5. **Found.** FY2025 segment gross margins are appliance controls 22.24% · power 22.33% · NEV 15.30% · automation 27.96% · equipment 38.51% · connection 5.06%. R&D was RMB 1,122.34M in FY2025 and RMB 621.38M in H1 2026 (the latter was already in v7)
  6. **No US-entity customer relationship is disclosed.** The Ericsson/Cisco/Juniper/Arista/Accton list originates in the company's periodic reports and its reply to the exchange inquiry, with no entity or geography given
  7. **OCP — exhibitor only.** The company exhibited at OCP Summit 2024 and 2025 and describes its products as "aligned with ORv3". Membership remains unverifiable because opencompute.org and web.archive.org both returned 403
  8. **UL — marks and lab programmes only.** The datasheets carry UL marks. UL-WTDP and UL-CTF are in-house lab programmes and stay separate from product listings in the prose. No UL or ETL file number is published for any data-centre product
  9. **The "#2 behind LITEON" claim is not supported, and v8 says so explicitly.** It traces to two early-2025 pieces that label it rumour (Sohu 2025-02-10; 产业家 2025-03-13). The company deflected the question in December 2024. Soochow (April 2026) expects Megmeet to be the **third** NVL72 PSU source, and the "~41% Delta" figure appears in no source
- **NVIDIA status sharpened:** the exchange inquiry reply defines it as a place on NVIDIA's recommended list to its downstream customers; NVIDIA's October 2025 post puts Megmeet in power-system components, not in the data-centre power-systems tier where the SST vendors sit
- **Errors in v7 corrected:**
  - The summary said power products was "the only segment with an expanding gross margin". Three of six expanded; it is the only one of the **three largest** to do so
  - The FY2024 commentary carried "~¥8.66B" FY2026 consensus. Current consensus is RMB 787M (15 institutions, 同花顺, 23 Sept), not the RMB 832M v7 recorded
  - The H1 period type `interim` is not a schema value and is now `half`
  - The footprint claim that manufacturing covers Germany is removed. Germany is R&D, and India is contract manufacturing
- **Rewritten in intel-briefing style:** products (FY2025 and H1 2026 segment margins, the three-layer AIDC framing, the welding buy-out); 24 recent developments (+9 new); technical specs (a new SST-status group and a new DC-DC brick group); leadership (shareholdings; Zhang Zhi as COO; Han Longfei as power-BG CTO); financials; strategy read (five judgments, with rank, SST, US footprint and H2 weighting); relationships (NVIDIA, LITEON and Delta re-sourced; Infineon, Vertiv and Zhonhen added); policy exposure (the filed tariff mitigation is Thailand)
- **Sources: 38 → 81**, with `party` on every entry. All 38 v7 URLs are kept with their v7 labels and dates, because the 23 September report copies them verbatim

#### Corpus reconciliation (Profiler Command step 7)

- **13 inbound dossiers reviewed and 2 changed.** The alias grep over the new `aka[]` found no additional dossiers
- **`delta-electronics.profile.json` v5 → v6 (v5 archived):** `ecosystemRole`, `strategyRead[2]` and the Megmeet relationship no longer carry the #2 claim as "directionally corroborated". They now state its rumour origin and Soochow's third-source estimate, with sources added
- **`liteon.profile.json` v6 → v7 (v6 archived):** the same correction to `ecosystemRole`, `strategyRead[2]` and the Megmeet relationship
- The other 11 mentions are roster, tier or contrast statements that v8 leaves accurate, so they are unchanged

#### Registry, segments, calendar

- **`profiler-companies.json`:** Megmeet gains `aka[]` (12 names: 麦格米特 · 深圳麦格米特电气股份有限公司 · Shenzhen Megmeet Electrical · Shenzhen Megmeet Electrical Technology · 麦米电气 · Megmeet Welding · Megmeet Welding Technology · 麦格米特焊接 · MEGMEET USA · Megmeet USA · Altatronic · MEGMEET), `megmeet-welding.com` in `domains`, and a new tagline. Sync: srcTotal 38 → 81, srcFirstPct 58 → 60; Delta 16 → 20 sources; LITEON 15 → 19
- **`profiler-segments.json`:** the `power-conversion-and-rack-power-silicon` membership stays `challenger`, now on the v8 basis line
  - An `in-hall-power` adjacent membership (BBU and capacitor shelves, DC-centre BESS) was drafted and then withdrawn. It would have required regenerating the `segment-in-hall-power` literal in `Classroom.gs`, and that is left for the developer to decide
- **`profiler-graph.json`** rebuilt (1482 edges, 1108 curated)
- **Refresh calendar:** megmeet, delta-electronics and liteon set to `lastRefreshed` 2026-09-23. Megmeet's `nextReport` stays 2026-10-30, unconfirmed: no appointment date is on record, and Q3 2025 was published 2025-10-30
- **Refresh notes:** Megmeet's watch list rewritten around v8's open items

#### `README.md`

- Archive entries added to the tree for `delta-electronics.profile.v5.json`, `liteon.profile.v6.json` and `megmeet.profile.v7.json`, plus the missing `megmeet.profile.v6.json`, which was on disk but absent from the tree

### Notes

- **Checks:** `check-profiler-crossrefs.py` 0 candidates · `check-profiler-relationships.py` 0 findings · `sync-profiler-registry.py --check` in sync, calendar in bijection · `check-classroom-content.py` 0 errors · `check-profiler-study.py` 0/0 · `check-profiler-reports.py` 0 errors (the six new warnings are the expected aged-pin notices on the 8 and 23 September reports)
- **Source reachability:** the SEC hosts, opencompute.org, web.archive.org and UL Product iQ returned 403, and szse.cn failed TLS; cninfo and hkexnews answered. A null from a blocked host bounds that host only
- **Archive rotation not performed:** 92 non-exempt sections against a trigger of 100. This push is dated 23 September, so today's sections are exempt
- **The September study-prep files and the 23 September report were not edited.** The contradictions v8 introduces are listed in the session summary for the developer

## [v07.31r] — 2026-09-23 10:28:38 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phases E and F of the Megmeet SST onboarding briefing run: **D3, the study companion**, and the **audit pass**. A fresh subagent with none of the drafting context audited the finished PDF against the plan's twelve-line rubric and returned thirty-five findings. All thirty-five were worked, the PDF and the figures were rebuilt, and every checker re-run. This closes the run.

### Added

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`

- **The study companion: seven drill widgets in one self-contained file** — a conversion-chain explorer that adds up the published stage losses and says why the totals are not an efficiency delta; a service-voltage and cell-count calculator; a loss-chain comparator that **refuses to subtract two figures whose boundaries differ** and says so; a competitor map with four filters and a Megmeet-against-X card; a programme timeline on a date slider; a Leitner flashcard deck over the twenty-six terms and twenty-three numbers, kept in `localStorage` inside try/catch and working without it; and an objection drill.
- **The data file is inlined byte for byte**, so the companion and the briefing's fourteen figures cannot disagree. No CDN, no network call of any kind, no external `src` or `href` — it opens from `file://`. Playwright-tested: every widget driven, **zero console errors, warnings, or failed requests**, screenshots kept in the session scratchpad.

### Fixed

*Thirty-five audit findings. The five that changed what the document says:*

- **"The only expanding gross margin in the company" was false on the document's own data.** Three of Megmeet's six segments expanded their gross margin in H1 2026 — power products 22.2→25.06, magnetics 5.1→8.79 and intelligent equipment 36.0→39.67 — and two pages in Part IV said so in words while the claim was repeated five times elsewhere. It now reads *the only one of the three largest segments to expand*, in the data file and in every instance.
- **The NC State / NYPA / EPRI unit was filed as class-undisclosed when the primer states its class.** The primer gives a 1 MVA unit on a **13.2 kV** feeder, June 2026, 15 kV SiC MOSFETs, energised more than ten times — so the strongest field evidence in the document was sitting in the undisclosed block with its evidence tier reading `undisclosed`, and the `field pilot` tier was empty across the whole ledger. It is now a ledger row at 13.2 kV / 1 MVA / `field pilot`, the ledger is regenerated from the data in the sort order its own intro claims, and the counts that depended on it are corrected.
- **Three figures asserted per-row sourcing they did not print.** The perspective matrix, the calendar and the business-group board now render each row's tier tags, in the tier's colour, exactly as the data file stores them. The perspective matrix was resized so that it and its caption fit one printed page — its caption had been orphaned onto the next page.
- **Part V's scope note promised a tier tag on every fact inside an answer**, which chapters 13 and 15 did not do. The note now states the convention actually used — a fact that appears only in Part V carries its tag there, a fact restated from Parts I–IV carries it where it is established — and the one fact that appeared only in Part V was tagged.
- **The cell-count multiplier appeared as 2.5×, 2.3× and 2.7× on one page.** The primer's 2.5× is the round number for the class step; the counts computed on the primer's own assumptions give 2.3× from 13.8 kV and 2.7× from 12.47 kV. All three are now stated together with which is which, and the week-one question repeats the range rather than the round number.

*And thirty more, including:* the cover's bottom-line-up-front carried fourteen untagged factual sentences on the page that promises every factual sentence carries a tier, and is now tagged sentence by sentence with its judgement moved into a labelled analysis block; four dossier versions listed in Appendix C were never cited and are now separated from the seventeen that are; the line-frequency transformer's efficiency was printed reversed and a point low as "99.0–98.5%"; "eight of the sixteen vendors share two cells" was seven of seventeen; "nine obstacles have no visible owner" was eight of the ten unsolved, with the family split restated; the lineage matrix promised ten scored attributes and scores nine; the calendar listed a quarter out of chronological order; the objection script implied US manufacturing that chapter 9 says is not claimed; the side rack borrowed the sidecar's 1 MW rating; a Heron dossier tag was covering an NVIDIA guidance fact and a single primer tag was covering four sources; a certification cost estimate named no source; `[ANALYSIS]` was used inline without being declared in the citation contract; and the colophon mis-located the hearsay box and overstated what the proof pages covered.

### Changed

#### `README.md`

- Tree entry for the study companion. `check-readme-tree.py` clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation is still not due.** The counter reads `Sections: 102/100` and nine sections carry today's date: 92 non-exempt against a trigger of 100, unchanged across all three pushes in this run.
- The companion is also published as a **private Claude artifact**; the repository file remains the source of truth.
- One CSS bug is worth recording because it was invisible: the companion's widget-panel class was `.w`, which collided with the WEB tier class `.t.w` and set `display:none` on **every** `[WEB, verified …]` tag on the page. The panel class is now `.panel`, and the Playwright test asserts that no tier tag is hidden by CSS.

## [v07.30r] — 2026-09-23 09:27:04 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phase D of the same run: **D2, the sixty-nine-page onboarding briefing PDF**, its source HTML, the data file every figure reads from, fourteen new figures and the two build scripts. The `--png` proof pages were rendered and read page by page before the PDF was called done, and eight defects they exposed were fixed — the largest being a term table blown off the page by an unbreakable URL inside a tier tag. The study companion (D3) and the Phase F audit follow in the next push.

### Added

#### `repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`

- **Sixty-nine pages in five parts with fourteen figures**, on the SST primer's print skin with a running header and page numbers. Part I is the cheat sheet, the twenty-three numbers, the five things that moved since the primer's 12 September watch-list and the calendar to day one; Part II is the technology (the term system, lineage and adjacency, what NVIDIA specifies, the value case as a perspective matrix, and limitations with a mitigation, an owner and a status word); Part III is the market (the pilot-and-test ledger with the 34.5 kV argument in cells and BIL, twenty-five obstacles each with a named owner, and what NVIDIA's and Oracle's engineers will actually ask); Part IV is Megmeet against the field; Part V is the sales layer, analysis throughout, ending with the ten week-one questions ranked by decision leverage and everything that could not be determined named rather than smoothed over.
- **A citation contract enforced sentence by sentence.** Every factual sentence carries exactly one of `[DOSSIER <slug> v<n>]`, `[PRIMER ch.x / fig.n]`, `[REPORT 2026-09-08]`, `[GUIDANCE nvidia-800vdc p<n>]` or `[WEB, verified 2026-09-23]`, or sits inside a block labelled analysis. The reader's hearsay about NVIDIA and Oracle engineering contact is boxed once on the contents page, labelled unverified, and cited nowhere.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`

- **The single source for every number in a figure or a widget** — 214 tagged records across the class ledger, the cell-count arithmetic, the business mix, twenty-five obstacles, two programme timelines, the watch-list delta, the conversion chains, the competitor map, the six business groups, twenty-six terms, ten perspectives, the lineage matrix, seven objections, ten things not to say, the ten week-one questions, the calendar and twenty-three numbers to know. Written before the figures and before the companion so the two cannot drift.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/`

- **Fourteen figures, `mmsst-fig-` prefixed**, generated from the data file on the primer's palette (re-validated against the dataviz skill's six checks on the white print surface — all six pass). No primer figure was copied; where one exists it is referenced by number.

#### `scripts/build-megmeet-sst-briefing-figures.py` and `scripts/build-megmeet-sst-briefing-pdf.mjs`

- Copies of the primer's two build scripts with the paths, the figure prefix and the DevTools port changed. The figure script's one structural difference is that it reads the data file rather than carrying numbers inline.

### Fixed

- **A term table was silently blown off the page by a URL inside a tier tag.** Four tags in chapter 1 carried a full source URL, which has no break opportunity, so the table's minimum width exceeded the page and the fourth column rendered off-paper while the rows grew to half a page each. URLs were moved to Appendix C (all forty-seven were already listed there), `overflow-wrap` was added as a safety net for every table cell, and the status chips were pinned `nowrap` so the net could not break them mid-word instead.
- **Every blended tier tag was split.** Eighty-five tags in the data file and twelve sites in the document carried two tiers; each now carries one tag per sentence, and the two scripted columns — *the sentence to say it in* in chapter 1 and *the one sentence* in chapter 10 — are labelled analysis in their chapter rather than tagged per cell. The convention for the wide reference tables is stated on the contents page.
- **Six figure defects the proof pages exposed**: text overrunning both panels of the watch-list figure; the day-one rule drawn through the next row's heading in the calendar; the class guides crossing the value labels of the 10–13 kV vendors in the class ledger; the 34.5 kV usage note truncated mid-word in the voltage ladder; a falling-margin label printed on top of its own start marker in the business-mix panel; and the two programme lanes bottom-aligned instead of top-aligned in the timelines.
- **A fourteenth figure had been generated and never placed.** The published-chain-loss chart is now Figure M4 in chapter 3, where the efficiency boundary argument is made, and the figures that followed it were renumbered.

### Changed

#### `README.md`

- Tree entries for the PDF, the source HTML, the data file, the figures directory with all fourteen SVGs listed individually, and the two build scripts. `check-readme-tree.py` is clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation was evaluated again and is still not due.** The counter now reads `Sections: 101/100`, but the threshold tests the **non-exempt** count and nine sections carry today's date: 92 non-exempt, unchanged from the previous push and below the trigger. Scenario A in the rotation examples.
- The model identifier was removed from the briefing's colophon; repository artefacts carry the effort and the run window, not the model name.

## [v07.29r] — 2026-09-23 08:03:13 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phase C of the Megmeet SST onboarding briefing run: **D1, the Profiler competitive report on the solid-state-transformer and medium-voltage hall-edge block**, authored from covered dossiers only and cut on the axis the 8 September AIDC edition could not score — the service-voltage class each vendor has actually specified. Eighteen dossiers in scope, 46 citations copied verbatim from their `sources[]`, `check-profiler-reports.py` clean. Phases 0, A and B (pre-flight, the corpus read into two scratchpad ledgers, and five bounded web-research subagents) ran before it; the briefing PDF and the study companion follow in later pushes.

### Added

#### `live-site-pages/profiler-data/reports/sst-hall-edge-block--competitive--2026-09-23.report.json`

- **A competitive report scoring eighteen vendors on disclosed service-voltage class** — `megmeet`, the four venture SST vendors (`heron-power`, `amperesand`, `dg-matrix`, `novos-power`), the Asia-headquartered set (`sungrow`, `zhonhen`, `sinexcel`, `delta-electronics`, `liteon`), the incumbents that have declared an 800 V DC position (`abb`, `ge-vernova`, `eaton`, `schneider-electric`, `vertiv`, `hitachi-energy`, `siemens-energy`) and the silicon layer (`infineon`). It **builds on and does not supersede** `aidc-power-conversion--competitive--2026-09-08`: different cut, different question, both current.
- **The finding the cut exists to expose** — the commercial leader and the specification leader are different companies, and the class is why. The only covered vendor a filing describes as supplying an MV-to-800 V DC solid-state transformer is specified 10–13.8 kV and stops there; the two most completely specified 34.5 kV-class products belong to the two smallest balance sheets in the report and neither has shipped; the only orderable solid-state medium-voltage product from an incumbent is a UPS, not a transformer; and the one venture vendor shipping hardware ships a 480 V AC skid whose own datasheet reads 96–97% peak, two to three points below its platform claim.
- **Megmeet's row is the report's own subject and it reads `undisclosed`** — across the thirty-eight sources pinned in its dossier no kV figure appears anywhere for its solid-state transformer. Its disclosed position is the rack and the sidecar (which converts 380–480 VAC, not medium voltage), where the H1 2026 interim measures the power-products group growing 60.92% at the company's only expanding gross margin. The report states the competitive risk as structural rather than commercial: the block above the rack may consolidate before Megmeet's converter has a class to quote.
- **Eight confidence-tagged key judgments, seven sections** (a what-this-adds prose section, the service-voltage class table, the venture-set table, the Asia-set table, a normalized-revenue bars figure and a labelled analysis section on Megmeet's position), **seven indicators** and **ten limitations**, in the registry's active `intel-briefing` style.
- **The honesty block carries eight gaps**, led by Megmeet's undisclosed class and by the fact that the four venture vendors closest to the block carry no normalized revenue at all — so the scale chart omits precisely the companies whose products are nearest to it. That is stated as the finding rather than left as a hole.

### Changed

#### `live-site-pages/profiler-data/reports/reports-index.json`

- Registered the new report newest-first as `current`. No `supersedes` and no status flip on any existing entry — this edition does not replace one.

#### `README.md`

- Tree entry for the new report, and the **missing entry for `aidc-power-conversion--competitive--2026-09-08.report.json`** restored — the current AIDC edition had never been listed, only its superseded 2026-08-29 predecessor. `check-readme-tree.py` is clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation was evaluated and is not due.** The counter reads `Sections: 100/100`, but the threshold in `CHANGELOG-archive.md` steps 1–3 tests the **non-exempt** count, and 8 of the 100 sections carry today's date (2026-09-23) and are exempt: 92 non-exempt is below the trigger. This is Scenario A in the rotation examples — a total at or above 100 does not by itself rotate. The clone was deepened at session start regardless, so a rotation on a later push in this run will resolve its SHAs.
- No Profiler page bump: report JSONs and the index are data-only, so the Profiler page is an indirect affect ([PC-HTML-VERSION] #2 does not fire).

## [v07.28r] — 2026-09-23 07:30:03 AM EST

> **Prompt:** "I want to run the Megmeet SST briefing overnight and wake up to a very robust comprehensive downloadable PDF that carefully considered what information I should know prior to starting a job as their "Senior Sales Manager - SST Solutions". I heard that they are in active communication with NVIDIA and Oracle's engineering teams, so I need to understand SSTs in their entirety: technical terminology, comparison with previous and adjacent technology, value in 800Vdc power infrastructure (shown from different players' perspectives), limitations and what relevant players are doing about it, which players are testing SSTs (preferably 34.5kVac instead of 12.47kVac), what obstacles are blocking its adoption (technical limitations, infrastructure issues, operation & maintenance issues, etc.), and anything else you can think of. I also want to have a good understanding of Megmeet's competitors and how we compare to them (specifically on SSTs, but I also want to know our relative positions in adjacent business units too). I want you to use as many tables, graphs, timelines, charts, diagrams, pictures, and other mechanisms to ensure I properly understand and can memorize this information. If you think interactive widgets would be useful for me to understand a specific concept, feel free to build it and present the widget(s) to me in whichever format you think would be most convenient for me. Fold this context in with the original briefing plan and carefully consider how to plan, execute, and check a comprehensive report for me - I will want you to give me a prompt to paste into a new session. Also consider which AI model and effort level I should use to generate the most cost effective report with practical usefulness and recommend it to me with reasoning. Then, give me the prompt with recommended model/effort level."

The Megmeet SST onboarding briefing plan rewritten as **v2** — the developer's widened scope folded into the deferred v1 prompt: a pre-flight run today, a corpus inventory, an ask-by-ask delta, the deliverables, a model and effort recommendation (Opus 5 `xhigh`, with the alternatives set aside and why), a phased overnight run with three checkpoint pushes and a twelve-line check rubric, the paste-in prompt, a resume prompt and a night-of checklist. Nothing was built or researched beyond the plan; the reminder in `REMINDERS.md` is untouched (developer-owned — its v1 budget line is now superseded by the plan's §4).

### Changed

#### `repository-information/megmeet-briefing-prompt.md`

- **§0 Pre-flight results as of 2026-09-23** — both v1 checks run while writing: the quarterly core queue reads `dueCount: 0`; the SST four are at v1/v2 dated 2026-09-12 → 09-19; Megmeet is v7 (2026-09-08); Oracle v5 (2026-09-21) and NVIDIA v10 carry no SST content (that material lives in the NVIDIA guidance module and the primer); `aidc-power-conversion--competitive--2026-09-08` is still `current`; matplotlib and Playwright are absent from a fresh container; the CHANGELOG counter is one push from the rotation threshold, so the rotation falls due during the overnight run.
- **§1 What the repo already holds** — the 20,000-word, 14-figure SST primer (v05.36r–v05.38r, 2026-09-12) is the technical spine the run extends rather than rebuilds; the 2026-09-08 report, the NVIDIA guidance module, the Megmeet dossier / study guide / interview brief / lesson plan (the last three five dossier versions stale), the SST four's 34.5 kV material (Heron ×12, DG Matrix ×17, Amperesand ×10, Novos ×2; Megmeet's own SST discloses no voltage class), and why neither the Markdown PDF renderer (no image support) nor Classroom (public-safety and the C2 gate surface) is used.
- **§2 The delta** — ten rows, one per ask: the term system with memorisation tables; the lineage and adjacency matrix; the value-by-perspective matrix; limitation → mitigation → who → status; the pilot-and-test ledger by service-voltage class with the 34.5 kV argument and an explicit *undisclosed* rule; the O&M, standards, utility-acceptance and procurement obstacles (the primer's thin spot — one mention of maintenance, none of spares or MTBF); the SST competitor matrix plus the adjacent-BU position table; the NVIDIA / Oracle engineering chapter with the hearsay rule; the figure and widget mechanisms; the "anything else" row.
- **§3 Deliverables** — D1 the Profiler competitive report (dossiers-only, public Pages data, builds on and does not supersede the 2026-09-08 edition); D2 the PDF from a print-HTML source on the primer's skin with `mmsst-fig-` figures and copies of the primer's two build scripts under `study-prep/megmeet/`; D3 the self-contained study companion with seven prioritised widgets, Playwright-tested from `file://`; the shared data file as the single source for every plotted number; the brief's five-part table of contents and the minimum figure set.
- **§4 Model and effort** — Opus 5 `xhigh`, one session, subagents on the same model: the repo's Xcel head-to-head (reading depth is where Opus led), the citation-tier rule and the rubric as the discipline mechanism, half Fable's per-token price and none of the Fable weekly sub-allocation, `xhigh` over `high` and `max`, latency free overnight; Fable 5.1, Sonnet 5 (offered as the Phase B subagent cost lever), Opus 5.5, effort `max` and a two-session split set aside with reasons; a ~3–5 hour, ~$120–250 API-equivalent estimate stated as judgment, not measurement.
- **§5 The run** — phases 0 · A (corpus read into two scratchpad ledgers) · B (five bounded web subagents) · C (D1, push 1) · D (data file → figures → brief chapter by chapter → PDF with proof pages, push 2) · E (companion) · F (a fresh subagent audits the PDF against the twelve-line rubric, push 3); failure handling decided in advance for a stuck branch, a failed PDF build, missing matplotlib, blocked hosts, context pressure and a dead container.
- **§6 The paste-in prompt** (new session, Opus 5, `xhigh`), **§7 the resume prompt**, **§8 the developer's night-of checklist**.

#### `README.md`

- The tree description of `megmeet-briefing-prompt.md` now describes the v2 run plan; timestamp and repo version.

## [v07.27r] — 2026-09-23 06:45:15 AM EST

> **Prompt:** "Run X — the Classroom hook — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.19 is the brief (follow its reading list in order; decide before you build, and the written decision is the deliverable either way), §3's D13 and D16 the design, repository-information/CLASSROOM-SCHEMA.md (the ref-prefix table and the stamp-fixes-the-gate section) and .claude/rules/classroom-app.md (the stamp rule, the freshness pins, the content fence, the gateDigest obligation) the shapes, and repository-information/EVENTS-SCHEMA.md §3 / §11 for what the public registry carries and what is never taught from it. E5 is Done in §11 (v07.25r; Events.gs v01.09g, Events.html v01.10w, Network.gs v01.17g) and D13's deferral condition is met — verify it yourself in live-site-pages/events-data/events-sources.json rather than taking the brief's word. Decide whether an event:<slug> provenance prefix earns its gate-surface cost; a reasoned no that names what would change the answer is a complete X. If yes: event: 'public' in CL_PROVENANCE_REF_KINDS, the CLASSROOM-SCHEMA.md mirror and a recomputed gateDigest in one commit, plus the first pre-event briefing lesson inside the content fence, folding to tracks or guidance and never briefing. Never a contact: prefix, never a Network signal or contact as an input, never a registry count as a taught fact, never a fabricated input, never an edit to check-classroom-pipeline.py or its fixtures. Write the decision and the date into §11's X row and §3's D13 row either way, and say what remains outside this plan once X closes — it is D16's last row. Verify with check-classroom-content.py, check-classroom-curriculum.py, check-classroom-pipeline.py, check-events-plan.js, check-events-registry.py and check-readme-tree.py. Bump per [PC-GS-VERSION] #1 with a changelog entry naming nothing gated; CHANGELOG entry; README tree if a file is added. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first — a shallow clone writes a wrong provenance pin that no checker can see; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then remember session."

X — the Classroom hook (design plan §3 D13, §13.19): **decided no.** Nothing built, no gate surface touched, no GAS bump, no file added. **D16's build order is complete** — Gate → N0 → Q0 → N1 → N2 → E0–E1 → B → N3 → E2–E3 → E4 → N4 → E5 → X, every row Done or decided.

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`

- **§3 D13** carries the decision: `event:` declined, not deferred again; `contact:` stays never. One-line reasoning with a pointer to the §11 row.
- **§11's X row** flipped from *Proposed — deferred behind E0 stability* to **Decided — no, v07.27r, 2026-09-23**: the deferral condition as verified (below), the three reasons, the four reopen conditions, the statement that D16's order is complete, and what remains outside it (R and Q inside the ledger; the E0 verification pass for `hours[]` / `venueLatLng` / `agendaUrl`, the `Network.html` hash router, `check-guidance-migration.js` and the Megmeet briefing outside the plan).

#### `repository-information/CLASSROOM-SCHEMA.md`

- One paragraph after the *no `note:` prefix* rule recording that there is no `event:` prefix either — declined at X with the date, the reason and the pointer to the reopen conditions — so the absence is a decision on the record rather than an omission a later session re-proposes. The prefix table itself is untouched and still mirrors `CL_PROVENANCE_REF_KINDS` byte for byte.

#### `repository-information/EVENTS-SCHEMA.md`

- §11's D13 sentence updated from *stays deferred until the registry has survived one poller cycle* to *declined at X (2026-09-23)*, pointing at the design plan's reopen conditions.

### Notes

- **The deferral condition, verified on the live file.** All 58 rows of `events-sources.json` carry `lastProbe.at = 2026-09-21`, but `git log` shows the roster written once (v06.95r, E0) and never since — those stamps are E0's own build-time probes, not the poller's. `events.json` has been touched only by E4 session 2's manual agenda rows (v07.20r). The poller's first live cycle ran (33 `Proposed` rows pending at E3's start) and no `events sync` has ever applied a diff, so the registry has stood under one poller cycle rather than survived a change from one. Recorded because the brief's evidence is not what it looks like; it did not decide X.
- **Why no, in three lines.** The pre-event briefing already exists as E5's `events plan <event>` narrative, private half included, and its public half is dossier material Classroom already stamps as `profile:` / `study:`. The fact with teaching value — who exhibits — is a Network `Signals` row that never crosses, and `mentions[]` is not attendance; what a registry row adds on its own is calendar, not mechanism, and expires with the edition, which a permanent `tracks` lesson cannot. The true cost of a tenth prefix is the map + mirror + `gateDigest` **plus** a G7 resolution rule (else every weekly run freezes the lesson as unknown), the committer contract's "exactly the nine prefixes", and the P11 guard in `check-classroom-pipeline.py` whose prefix tuple is hard-coded to the nine and which X may not edit; P4 would fire on the adding commit itself.
- **What would change the answer:** a series-level evergreen lesson once `hours[]` (2 of 96 upcoming rows), `editions[]` and the agenda structure are filled; a G7 resolution rule for `event:` written first; one applied `events sync` cycle; or the developer asking for it.
- **R's stated blocker has evidence:** the Profiler earnings desk Routine's 2026-09-22 fire committed v07.16r, so a scheduled Routine has landed a commit; the rebuilt C2 Routine's first fire on 2026-09-23 11:07Z is the next proof to read. R's row is the developer's to flip.
- **Checkers, all on the untouched code:** `check-classroom-content.py` 71 lessons · 8 tracks · 220 gate cases, 0 errors / 0 warnings; `check-classroom-curriculum.py` no structural findings; `check-classroom-pipeline.py --base origin/main` nothing to judge and `--selftest` 15 / 0; `check-events-plan.js` 151 / 0; `check-events-registry.py` OK; `check-readme-tree.py` 22 displays match, 0 findings.

## [v07.26r] — 2026-09-23 05:58:28 AM EST

> **Prompt:** "Picking up from my last session, before I continue on to run phase X, I noticed that I did not fill in the brackets when I pasted the prompt to run E5 session 2. See attached screenshots for what I see in two different starred events' "Plan" tab. I also noticed that when I toggle on the "Starred" filter, it does filter out non-starred events, but does not fill in the button blue - Fix that." (with five screenshots: the Plan tab of `acp-recharge-2026` and `ocp-global-summit-2026`, and the filter card with the Starred pill and the Starred count ringed)

### Fixed

#### `live-site-pages/Events.html`

- The filter pills never repainted their pressed state after a press. `evRender()` rebuilds the agenda and the counts but deliberately leaves the filters card alone — rebuilding it would drop the segment row's horizontal scroll position and the `data-busy` flag an in-flight score fetch sets — and `aria-pressed` is the whole of what paints a pill accent-filled (`.ev-pill[aria-pressed="true"]`). E3's **Recommended** and E4's **Signals only** each set their own pill by hand and so looked right; **★ Starred** and the three option rows never got that treatment and filtered while reading `false`. New `evSyncPills()` re-derives every filter pill's `aria-pressed` from `_evFilters` / `_evRecMode` in place, called at the top of `evRender()`. The two hand-set calls stay — they are the immediate feedback before their fetch returns, including the rollback on a failed one
- A second, latent bug from the same root cause: `evPillRow()` captured `current` at build time, and since the card is built once that snapshot never moved — so pressing an option pill a second time re-picked the same value instead of clearing it, and only **All** could undo a choice. The row now takes the `_evFilters` key and reads the live value for both the pressed state and the un-toggle; each pill carries `data-ev-val` for the sync to match on

#### `scripts/verify-events-roles.py`

- A filter-pill pass in the phone section, after the star round-trip: **★ Starred** presses to `aria-pressed="true"` with a computed background that differs from an untouched pill's and the agenda down to the one starred row, presses again to clear; a **Kind** pill paints pressed with `_evFilters.kind` agreeing with its `data-ev-val`, and a second press clears it back to **All**. The assertion is on the paint, not the attribute alone, because the attribute is only a proxy for what the developer sees. Verified both ways: with `evSyncPills()` commented out it fails with `pressed: 'false'`, the untouched background and `rows: 1` — the reported symptom exactly — and passes with it restored

### Notes

- The two starred events in the screenshots (`acp-recharge-2026`, `ocp-global-summit-2026`) show `0 booths · 0 sessions · 0 venues` because **neither registry row carries `venueLatLng`, `agendaUrl` or `hours[]`**, and no Network signal names either slug. Registry coverage across the 96 upcoming rows: `venueLatLng` 26, `agendaUrl` 16, `hours[]` 2. Every empty line in the Plan tab names the input it is missing, so the tab is rendering a thin row faithfully rather than failing. No code change — recorded so the next enrichment pass has the counts
- `ocp-global-summit-2026` carries nine Profiler `mentions[]` and still lists no booths: booths come only from `rec.signalsBySlug[slug]` — Network attendance signals — and a dossier mention is not attendance evidence (D9 / D16). Behaving as designed

## [v07.25r] — 2026-09-23 03:09:19 AM EST

> **Prompt:** "Run E5 session 2 — the post-event checklist, the ROI line and the events plan command — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.18 is the brief (follow its reading list in order, then its five build steps exactly; this closes E5), §5.6 item (5), §5.4 and §3's D9 / D12 / D15 / D16 the design, repository-information/EVENTS-SCHEMA.md §5 / §6 / §8 / §10 and repository-information/NETWORK-SCHEMA.md §3 / §8 / §10 the shapes. E5 session 1 is done in §11 (v07.24r; Events.gs v01.08g, Events.html v01.09w, Network.gs v01.16g). Live state you cannot see from the repo: the Plan tab [did / did not] open on a starred event, the top five booths [did / did not] read sensibly line by line, one meeting [was / was not] found on the contact in Network and [was / was not] in the downloaded ICS. Build the eventSlug= widening of nop=interaction's read leg in Network.gs, eop=postevent / eop=posteventmark / eop=plannarrative and the priorRoi term in Events.gs (the ROI line written once into the event's Plans row), the Post-event section with Copy plan as JSON on the Plan tab in Events.html, the events plan <event> command rule in .claude/rules/events-app.md with its CLAUDE.md pointer, and write the first narrative plan from the JSON I paste (to Drive if the connector is attached, else as text); extend scripts/check-events-plan.js and the verifier's pass. No in-app AI, no Places API, no new Profiler op, never a gmail.* scope, no second score; the session never calls any app. Verify with the E5 session-1 list and grep the served pages and both .gs for maps.googleapis, places, GmailApp, CalendarApp and linkedin.com. Bump Events.gs / Events.html / Network.gs per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree; EVENTS-SCHEMA.md §5 / §6 / §8 / §10 and NETWORK-SCHEMA.md §8; flip §11's E5 row to Done with the versions. Then hand off in chat: redeploy, open a past event's Plan tab, read the checklist and the ROI line, mark one meeting held, copy the plan JSON and paste it back for the narrative. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for X, and remember session."

E5 session 2 — the post-event close-out, the ROI line and the `events plan <event>` command. **E5 is Done.**

### Added

#### `googleAppsScripts/Network/Network.gs` (v01.16g → v01.17g)

- `nop=interaction`'s read leg widened with **`eventSlug=`** — the live contacts whose `Source Event` is that slug (with their account name, the account's stage at read time, and **one** `mailable` boolean rather than the two consent columns) and the `meeting` Interactions on the slug. One call answers everything the close-out counts, so Events needs no second op
- Each meeting row carries an inferred `held` (a later `note` / `email-out` touch on the same contact within 14 days) and the developer's explicit `mark`, both computed on Network's side because a boolean and a three-value word are strictly less data than the rows behind them. Mark rows are excluded from the touches that feed the inference — otherwise a "not held" mark reads as a later touch and inverts its own verdict
- `NW_PEER_INTERACTION_KINDS` gains `note` for that mark write; the two mark phrases are mirrored byte for byte in `Events.gs` and the mirror is asserted by the harness

#### `googleAppsScripts/Events/Events.gs` (v01.08g → v01.09g)

- **`eop=postevent&slug=`** — the checklist (cards, meetings booked, held and still unconfirmed, the follow-up count over D9's consent rule and its relative deep link) and the **ROI line** `{ cards, meetingsBooked, meetingsHeld, stageMoves }`, written **once** into the event's `Plans` row and re-read on later opens. Allowed only from the day after `end`; `not_over` before that, with the end date and today said
- **`eop=posteventmark`** — `held ∈ yes · no` written as a `note` Interaction with the `mt-` id as evidence; an explicit mark beats the inference in both directions, the newest wins, and the `Plans` row's meetings are refreshed over one read-leg call rather than a second score
- **`eop=plannarrative`** — the narrative plan's Drive URL onto the `Plans` row. The audit row carries the plan id and a flag, never the URL
- The score's seventh term **`priorRoi`**: what an *earlier edition of the same series* returned, `min(1, (cards + 3·held + 5·moves) / 40)`, seeded into `Tuning` at 0.05 so nothing reorders until there is a year of data. `lost` is deliberately not a stage move although the enum orders it past `prospecting` — a terminal negative would inflate next year's prior
- `evRecommend_` gained an `extraSlug` argument so one past event's signals survive the upcoming filter; the booth accounts for the ROI come from those rows with no dossier read, no agenda and no Overpass

#### `live-site-pages/Events.html` (v01.09w → v01.10w)

- The **Post-event** section at the top of the Plan tab once today is past the event's end: the checklist, Mark held / not held per meeting, the follow-up link, the ROI line as recorded, and a Narrative plan link field
- **Copy plan as JSON** — the whole plan plus the close-out, for the `events plan` command. Placed in the plan head **as well as** the Post-event section: the narrative plan is most use *before* a show, and an upcoming plan has no Post-event section to carry the pill

#### Rules and docs

- The **`events plan <event>` command** in `.claude/rules/events-app.md` with its CLAUDE.md pointer — the Plan tab's JSON in, a one-page narrative brief per event day out, to Drive when the connector is attached and otherwise as text. Its never-list: no app call, no spreadsheet read, no peer token, no invented booth or contact, and a plan built from pasted JSON is never committed
- The first narrative plan, for **RE+ 2026**, at `repository-information/plans/re-plus-2026-narrative-plan.md` — written with no JSON pasted, so from the registry row and nine served dossiers only, with every gap named as a gap

### Fixed

- `evRecommend_`'s new past-slug filter kept rows with an **empty** event slug (a docket, a press quote) when no extra slug was named. Caught by `check-events-signals.js` before it left the session

### Changed

- `scripts/check-events-plan.js` → 151 checks (from 100): the widened read leg, `not_over`, the four checklist counts, the ROI row written once and re-read, both mark directions, `priorRoi` 0.275 hand-computed, the empty-slug guard, and the greps over the widened leg
- `scripts/verify-events-roles.py` gained a post-event pass at phone width — screenshot `events-postevent.png`
- `scripts/check-events-score.js` and `scripts/check-events-signals.js` updated for the seventh term
- `repository-information/EVENTS-SCHEMA.md` §5 / §6 / §8 / §10 and `repository-information/NETWORK-SCHEMA.md` §8; §11's E5 row flipped to **Done**

### Known gaps

- `Network.html` has **no hash router**, so the checklist's `Network.html#drafts?sourceEvent=<slug>` deep link opens the app without pre-filtering the list. The page says so beside the link; a small Network-side route would close it, and it was left out rather than widen this session into `Network.html`
- The developer's four live-state brackets in the §13.18 prompt were pasted unfilled, so E5 session 1's live check is **unconfirmed by this session**

## [v07.24r] — 2026-09-23 02:19:54 AM EST

> **Prompt:** "Run E5 session 1 — the deterministic plan: booth list, sessions, day plan and meetings — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.17 is the brief (follow its reading list in order, then its five build steps exactly; session 2 — the post-event checklist, the ROI line and the events plan command — is not this session), §5.6 items (1)–(4), §5.4, §5.5 and §3's D4 / D9 / D12 / D15 / D16 the design, repository-information/EVENTS-SCHEMA.md §3 / §6 / §8 / §9 and repository-information/NETWORK-SCHEMA.md §3 / §8 the shapes. N4 is Done in §11 (v07.23r; Network.gs v01.15g, Network.html v01.24w) and E4 is Done (Events.gs v01.07g, Events.html v01.08w). Live state you cannot see from the repo: one brief [did / did not] open in Word, one promoted interaction [was / was not] found in Profiler's intake, the chips [did / did not] name the events on an account with signals, and the map [did / did not] open. Build eop=plan, eop=planmeeting and eop=planunbook in Events.gs (the booth list ranked by the score's own account and segment terms with a verbatim dossier line read from the served JSON, the sessions filter, the day plan with open slots and Overpass venues within 600 m cached per event — Overpass only, never Places; a booked meeting written as a meeting Interaction over a new Network far-side leg and answered as an ICS download), nop=interaction in Network.gs (peer POST behind NETWORK_PEER_TOKEN, the write leg's shape, never a body), the Plan tab on the event sheet in Events.html; scripts/check-events-plan.js on the two-VM idiom with zero live calls; the verifier's plan pass. No narrative plan, no events plan command, no post-event checklist, no Places API, no new Profiler op, never a gmail.* scope; the session never calls any app. Verify with the E4 list plus node scripts/check-events-plan.js, node scripts/check-network-brief.js and node scripts/check-network-warmth.js, and grep the served pages and both .gs for maps.googleapis, places, GmailApp, CalendarApp and linkedin.com. Bump Events.gs / Events.html / Network.gs per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; EVENTS-SCHEMA.md §3 / §8 / §10 and NETWORK-SCHEMA.md §8; flip §11's E5 row to In progress — session 1 with the versions and write the session-2 brief as §13.18. Then hand off in chat: redeploy Events and Network, open a starred event's Plan tab, judge the top five booths line by line, book one meeting and find it on the contact in Network and in the downloaded ICS. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for E5 session 2, and remember session."

### Added
- **E5 session 1 — the deterministic plan: the booth list, the sessions, the day plan and meetings** (design plan §5.6 items 1–4, D4 / D9 / D12 / D15; §11's E5 row flipped to **In progress — session 1** with the versions; the session-2 brief written as §13.18 with its paste-in prompt). `Events.gs` v01.08g: `eop=plan` (session GET, behind `recommend`) for one **starred** event — `evRecommend_(sess, true)` run once with its signal rows and account map kept (never a second score) → the **booth list** (`evPlanBooths_`: one row per account with a plan-kind signal on the event — a docket or press quote names no event — ranked `accountPresence × stageWeight × strongest confidence + segmentFit × |account.segments ∩ audience| / |audience|` with the Tuning weights, the stage on the row, every signal with its person and `contactId`; the *why* line lifted verbatim from the served `<slug>.profile.json` — `strategyRead[0]`, else the newest `recentDevelopments[].headline` — read over `UrlFetchApp` from the Pages site for the top `EV_PLAN_DOSSIER_MAX` = 15 booths, never Profiler's exec; the dossier's `decisionMakers[]` kept for the filter), the **sessions** (`evParseSessions_` over the agenda page — JSON-LD `Event` / `subEvent[]` with `startDate` / `performer` / `location`, else HTML session blocks with a heading, a time and the roster parser for the speakers — read once and cached six hours in `CacheService`; `evPlanSessionsFilter_` keeps a title naming a seat segment the event serves, a speaker who is a Network contact (a signal row carrying `contactId`), or a speaker who is a dossier decision maker, with the reason on the row), the **day plan** (`evPlanDays_`: one frame per event day from the registry's `hours[]` — `EV_PLAN_DEFAULT_HOURS` 09:00–17:00 and `hoursSource: 'default'` when the row carries none; the booked meetings and the timed sessions fixed, the ranked visits placed in rank order into the earliest free time at `EV_PLAN_VISIT_MIN` = 30 minutes, `EV_PLAN_VISITS_PER_DAY` = 6, the open slots ≥ 30 minutes between them; no booth numbers — the E4 exhibitor parsers keep names only), the **venues** (`evPlanVenues_`: one Overpass POST per event — cafés · restaurants · bars · hotels within 600 m of `venueLatLng`, normalised to `{ name, kind, lat, lng, distanceM }` by distance, ≤ 40 — cached in the script property `EV_PLAN_VENUES:<slug>` for 30 days; a failed, non-2xx or unparseable answer is an empty list, one `events_plan_venues_failed` audit row and **not** cached) and the **meetings** (the owner's `Meetings` rows on the event, the contact named through one pick-list read per account). `eop=plancontacts` — the pick list over Network's new read leg. `eop=planmeeting` (body-POST): `slug` · `contactId` · `accountId` · `date` (a day of the event) · `start` / `end` (`HH:MM`, ≤ 240 min) · `place` · `note` · `contactName` / `accountName` — the `meeting` Interaction written **first** over `nop=interaction` (the mt- id as evidence, the event slug, a one-line summary — never the note), a rejected row books nothing; then the `Meetings` row (Start / End as wall time, `ICS UID` = `<mt- id>@events.<host>`, the i- id in `Network Interaction ID`); the invite answered as RFC 5545 text — `DTSTART` / `DTEND` in UTC from the event's zone (`evLocalToUtc_` over `Utilities.formatDate`, DST-checked), folded at 75 octets, CRLF. `eop=planunbook` removes the row and leaves the Interaction (D15: it is the record). `not_configured` degrades every read and write: the plan answers without booths, a booking writes the row with no interaction id and says so. Audit rows: the slug, ids and counts. `Network.gs` v01.16g: **`nop=interaction`** — two legs on one op behind `NETWORK_PEER_TOKEN` (the session's one widening): GET with `accountId` → the live contacts under one of the owner's accounts (`id` · `name` · `title` · `role`); POST `{ owner, interactions:[ { contactId, accountId?, kind ∈ meeting · calendar, date, summary, evidence, eventSlug? } ] }` → `{ written, rejected:[ { index, reason } ], ids:[] }` through the same `nwInteractionAdd_` every session op uses — `bad_contact_id` · `contact_not_found` (deleted, another owner's) · `account_mismatch` · `bad_kind` · `bad_date` · `summary_required` (collapsed to one line, ≤ 500 — never a body) · `bad_evidence` (an Events `mt-` / `pl-` id or an `https?://` URL) · `bad_slug`; `nwPeerJsonBody_` takes the field name. `Events.html` v01.09w: the **Details | Plan** strip on the sheet (the `recommend` capability's, like the why panel), the Plan tab fetched once per open and never polled — the booths with rank, stage chip, the two terms, the verbatim line and its source, the signal chips linking their evidence; the sessions with their why chips; a day card per event day with the frame (default hours said so) and the timeline (visits, sessions, meetings, open slots); the venues with OpenStreetMap links (a link — no tiles fetched) and the venue itself; the meetings list; **Book a meeting** under an open slot (the account — booths first, then every scored account; the contact from `eop=plancontacts`; the times inside the slot; a place; one line) → `eop=planmeeting`, the `.ics` downloaded from the answer, the meeting fixed on the timeline with the slot split locally; Unbook → `eop=planunbook`; Rebuild refetches
- `scripts/check-events-plan.js` — the two-VM harness (Events' real plan functions in one context, Network's real `nwPeerAccounts_` / `nwPeerSignals_` / `nwPeerInteraction_` with `nwInteractionAdd_` in another, the peer URL routed between them; Overpass, the Pages files, two served dossiers and the agenda page as fixtures): 100 checks, zero live calls — the booth ranking against hand-computed values with the dossier line verbatim, the three session matches and the drop, the frames and open slots, three venues within 600 m and the fourth dropped, the venue cache read with zero fetches and a failure uncached, a booking's Interaction / row / ICS `DTSTART`, unbook, the six token-boundary cases flat `denied`, the write leg's seven rejections by index, `not_configured` degrading, the D12 / D15 greps
- `scripts/verify-events-roles.py` — the plan pass (the strip, one `eop=plan`, five booths with verbatim lines and stage chips, the sessions' why chips, the day cards with open slots, three OpenStreetMap links, a booking through the form with one `eop=plancontacts`, the `.ics` downloaded and read back, the meeting fixed with the slot split, Unbook); ALL CHECKS PASSED at 390 × 844, zero page errors

### Changed
- `evRecommend_` takes a `keep` flag that attaches `signalsBySlug` / `accountsById` to its answer (the plan's input; the page's `eop=recommend` never passes it) and its signal rows now carry `contactId`
- `EVENTS-SCHEMA.md` §3 (hours), §5 (Meetings as built), §8 (the E5 session ops), §10 (venues and the plan as built), §12 (the harness); `NETWORK-SCHEMA.md` §8 (`nop=interaction`), §14 (the harness); `README.md` tree (the harness, the verifier's pass, the three versions)

#### `Events.html` — v01.09w

##### Added
- The Plan tab on the event sheet: booths, sessions, the day plan with open slots, nearby venues, Book a meeting and Unbook

#### `Events.gs` — v01.08g

##### Added
- `eop=plan` · `eop=plancontacts` · `eop=planmeeting` · `eop=planunbook`

#### `Network.gs` — v01.16g

##### Added
- `nop=interaction` — the pick-list read and the meeting write behind the peer token

## [v07.23r] — 2026-09-23 01:20:11 AM EST

> **Prompt:** "Run N4 session 2 — the pre-meeting brief, promote to field note, the network map and the "will be at" chips — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.16 is the brief (follow its reading list in order, then its five build steps exactly; this closes N4), §4.4's last four bullets and §3's D4 / D9 / D15 / D16 the design, repository-information/NETWORK-SCHEMA.md §3 / §5 / §8 / §11 / §12 the shapes. N4 session 1 is done in §11 (v07.22r; Network.gs v01.14g, Network.html v01.23w). Live state you cannot see from the repo: the warmth chips [did / did not] read sensibly against three known contacts, the reconnect list [did / did not] open, and one .ics row [was / was not] confirmed as a calendar touch. Build nop=brief and nop=promote in Network.gs (the brief assembled server-side from the contact's own rows — the dossier pieces fetched by the page as N2 does; promote one-way into Profiler's existing intake path as sourceType: contact with the developer's confidence, never a dossier edit), the event names on the "will be at" read over Events' eop=signals, the 📄 Brief .docx export, the ⇈ Promote action, the "Will be at" chips and the Network map (vanilla SVG over the list payload) in Network.html; scripts/check-network-brief.js on the sandbox idiom with zero live calls; the verifier's four passes. No E5, no Routine, no new scope, no new Profiler op, never a gmail.* scope; the session never calls any app. Verify with the N4 session 1 list plus node scripts/check-network-brief.js, and grep the served page and the .gs for GmailApp, CalendarApp, gmail. and linkedin.com. Bump Network.gs / Network.html per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; NETWORK-SCHEMA.md §8 / §11; flip §11's N4 row to Done with both sessions' versions and write the next brief as §13.17. Then hand off in chat: redeploy Network, export one brief and open it in Word, promote one interaction and find it in Profiler's intake, read the chips on an account with signals, open the map. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for whatever §11 says is next, and remember session."

### Added
- **N4 session 2 — the pre-meeting brief, promote to field note, the network map and the "Will be at" chips** (design plan §4.4's last four bullets, D4 / D9 / D15 / D16; §11's N4 row flipped to **Done** with both sessions' versions; the E5 session-1 brief written as §13.17 with its paste-in prompt). `Network.gs` v01.15g: `nop=brief` (session GET, behind `contacts`) assembles one contact's own rows server-side — the contact minus the raw extraction and the card links, its account, every Interaction newest first, the account's live Signals named by Events, the warmth block, the stage — writes the D9 disclosure row through `recordDisclosure` (`network_brief rows=1 ids=<c- id>`) and a `data_export` audit of ids and counts; `nop=promote` (body-POST, behind `contacts`) copies one Interaction into Profiler's intake **through Profiler's existing note op** (`action=note` · `nop=submit`, `PROFILER_INTAKE_EXEC` from `Profiler.config.json`'s `DEPLOYMENT_ID`) as a `sourceType: contact` note with the developer's 0–100 confidence and the i- id (plus the row's own evidence and event) in the note text, the account's slug or `general` — the developer's own Profiler session read by the page from the shared origin (`ov_note_session`) and relayed once, never stored or audited; the promotion is recorded as a `note` Interaction on the contact whose Evidence Link is `promoted:<i- id>:<intake id>` (§3 keeps the source row's Evidence Link for its own evidence), which is also the duplicate guard; refusals by name before any call (`bad_interaction_id`, `bad_confidence` — the empty string caught by the harness, `profiler_session_required`, `not_found`, `deleted`, `duplicate`, `view_only`) and Profiler's relayed (`profiler_session_expired`, `profiler_admin_only`, `profiler_rejected`, `upstream_*`); the session read `nop=signals` gains `eventName` / `eventStart` per row and an `events` map + `eventsConfigured` from **one** `eop=signals` call per read (only when a row names an event; not_configured or an HTML answer degrades to slugs). `Network.html` v01.24w: the **📄 Brief** button on the contact detail → a real `.docx` (three-part OOXML over the existing store-only zip: the heading, the warmth line, Contact, Account, Timeline, Will be at, the served dossier's `strategyRead[]` and last five `recentDevelopments[]` when covered — read as N2 does, never written — and Pipeline stage); the **⇈ Promote** affordance on every History touch with a 0–100 confidence box that refuses without a Profiler sign-in and links to Profiler; the **"Will be at" chips** (one per event with Events' name and start, the kinds and confidences, the evidence links and a link into Events; "Quoted in press" and "Regulatory filing" for the no-event rows — the `press —` / `?` labels retired); the **🕸 Map** masthead card — vanilla SVG over the list payload already on the page (accounts on a ring, contacts fanned at their account, source events at the centre; account–contact and contact–event edges; drag to pan, tap to focus with the rest dimmed, a second tap on a contact opens its row; the tap decided on `pointerup` because the captured pointer's click never reaches the node)
- `scripts/check-network-brief.js` — the sandbox harness (the real `nwBriefOp_`, `nwPromoteOp_` with `nwProfilerIntake_`, `nwSignalsOp_` with `nwSignalRows_` / `nwSignalEvents_` / `nwEventsProxy_`; `UrlFetchApp` routed to an in-memory Events stub and a Profiler stub, any other call counted as escaped): 58 checks, zero live calls — see its header
- `scripts/verify-network-roles.py` — the chips · brief · promote · map passes (the two chips named by Events with the press quote as "Quoted in press"; the `.docx` download unzipped and its paragraphs read back — every section, the RE+ 2026 chip, the scan, the served `abb` dossier's developments; promote refused without a Profiler sign-in then posted with the i- id · confidence 80 · the session and the note interaction recorded; the map's node count per type against the list payload, focus, the second tap opening the row); the D17 grep on the served page; `network-map.png` — ALL CHECKS PASSED at 390 × 844, zero page errors

### Changed
- `scripts/check-scraper-people.js`: extracts the three signal helpers and `nwEventsProxy_` that `nwSignalsOp_` now calls (zero calls still — the press-quote rows name no event)
- `NETWORK-SCHEMA.md` §8 (`nop=signals` widened; `nop=brief`; `nop=promote`), §11 (the brief export), §12 (the two new audits), §14 (the harness); `README.md` tree (the harness, the verifier's passes, the Network versions)

## [v07.22r] — 2026-09-23 12:41:01 AM EST

> **Prompt:** "Run N4 session 1 — warmth, the reconnect list and the import panel — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.15 is the brief (follow its reading list in order, then its five build steps exactly; session 2 is not this session), §4.4's first two bullets and §3's D15 / D9 the design, repository-information/NETWORK-SCHEMA.md §3 / §4 / §5 / §12 the shapes. E4 is Done in §11 (v07.21r; Network.gs v01.13g, Network.html v01.22w, Events.gs v01.07g, Events.html v01.08w, Scraper.gs v02.22g). Live state you cannot see from the repo: NETWORK_CORPUS_TOKEN [is / is not] set in both projects, and one article's people [did / did not] read on an account in Network with one accepted. Build the warmth score and the cadence table in Network.gs (computed, never stored; carried on the list row beside lastTouch and on the detail), nop=reconnect, the server-side .ics / CSV parse → proposal list → nop=importconfirm writing only the ticked rows as email-in / email-out / calendar Interactions with the developer's own reference as evidence — no Gmail or Calendar scope, no trigger, no consent prompt; the Warmth chip and sort, the Reconnect card and the Import touches panel in Network.html; scripts/check-network-warmth.js on the sandbox idiom with zero live calls; the verifier's three passes. No E5, no Routine, no new scope, never a gmail.* scope; the session never calls any app. Verify with the E4 session 3 list plus node scripts/check-network-warmth.js, and grep the served page and the .gs for GmailApp, CalendarApp, gmail. and linkedin.com. Bump Network.gs / Network.html per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; NETWORK-SCHEMA.md §5; flip §11's N4 row to In progress — session 1 with the versions and write the session-2 brief as §13.16. Then hand off in chat: redeploy Network, read the warmth chips against three contacts you know, open Reconnect, paste one .ics and confirm one row. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push."

### Added
- **N4 session 1 — warmth, the reconnect list and the import panel** (design plan §4.4's first two bullets, D15 / D9; §11's N4 row flipped to **In progress — session 1 done** with the versions; the session-2 brief written as §13.16 with its paste-in prompt). Warmth and cadence are computed on every read and stored nowhere — `NETWORK-SCHEMA.md` §5 rewritten as built (the kind weights, the 90-day half-life, hot ≥ 2 · warm ≥ 0.75 · cool ≥ 0.2, the cadence table per role × relationship, the reconnect list, the import panel's request / answer / refusal shapes); §12 names the three ops' audit keys; §14 the new checker
- `scripts/check-network-warmth.js` — the sandbox harness (the real warmth and cadence helpers, the list op's single touch pass, `nwListOp_` / `nwGetOp_`, `nwReconnectOp_`, the `.ics` and CSV parsers, `nwImportOp_` / `nwImportConfirmOp_` with the real `nwInteractionAdd_` in one VM context): warmth against hand-computed values and every band edge, every cadence cell, warmth on the row and the detail from one read and stored in no tab, the reconnect order and its exclusions, the parsers on fixtures, a proposal that writes nothing with the unmatched address never written, a confirm that writes only the ticked rows with the reference · ref as evidence and refuses the rest per row, the duplicate on a re-confirm, no mail or calendar scope in the PROJECT region or the page, the page's byte-for-byte mirror of the legend constants — 66 checks, zero live calls; README tree entry
- `scripts/verify-network-roles.py` — the warmth · reconnect · import passes (the chip on every row, the Warmth sort hottest first without a request, the detail's cadence and lapse, the Reconnect card most overdue first and its Draft into the drafts flow, a pasted `.ics` → one matched and one unmatched proposal → only the ticked row confirmed with the reference); the D15 grep now names `CalendarApp` and the calendar scopes; two screenshots

### Changed
- `scripts/check-network-schema.py`: `matched` · `unmatched` join the audit-detail allow-list (counts — the checker still refuses an address, a name, a line or the reference)
- The verifier's N3 s1 sort test expects the Warmth sort live (it asserted the disabled placeholder until now)

#### `Network.gs` — v01.14g

##### Added
- `NW_WARMTH_WEIGHTS` · `NW_WARMTH_HALF_LIFE_DAYS` · `NW_WARMTH_BANDS` · `NW_CADENCE_DAYS` (§5; the only tuning surface, not a tab); `nwWarmth_` / `nwWarmthBand_` / `nwCadenceDays_` / `nwWarmthDetail_`; `nwTouchPass_` — one read of the Interactions tab answers `lastTouch` AND warmth (`nwLastTouch_` delegates to it; the export op still reads it)
- `nop=list` rows carry `warmth` + `warmthBand` beside `lastTouch`; `nop=get` answers the `warmth` block (score, band, last touch, cadence, since, overdue)
- `nop=reconnect` — the contacts past their cadence, most overdue first, the minimum row plus the lapse; do-not-contact rows left out; capped at 200; audit counts only
- `nop=import` (body-POST) — the pasted `.ics` (unfolded, VEVENT · UID · SUMMARY · DTSTART · ATTENDEE / ORGANIZER `mailto:`; DESCRIPTION never read) or CSV (RFC 4180, a header matched by name, a direction column, a Message-ID column, tab-separated accepted) parsed server-side, matched to live contacts by email, answered as a proposal list with the unmatched addresses and the already-recorded rows marked — nothing written; `nop=importconfirm` (body-POST) — the ticked rows judged per row and written as `email-in` / `email-out` / `calendar` Interactions with the developer's reference (· the UID or Message-ID) as Evidence Link and the one line as Summary; a write scope required

#### `Network.html` — v01.23w

##### Added
- The warmth chip on every list row and on the detail (with the cadence and the lapse) — the legend from `NW_WARMTH_WEIGHTS` / `NW_WARMTH_HALF_LIFE_DAYS` / `NW_WARMTH_BANDS` mirrored from the `.gs`; the Warmth sort switched on (hottest first)
- The 🔥 **Reconnect** masthead card — the lapsed contacts with the lapse and the cadence, Draft per row and for the ticked into the N3 drafts flow
- The ⇪ **Import touches** masthead panel — format select, the paste, the reference, Propose → the proposal list (a checkbox and a kind select per matched row, unmatched rows shown greyed with the reason) → Record the ticked touches → the list refreshes

## [v07.21r] — 2026-09-22 11:02:50 PM EST

> **Prompt:** "Run E4 session 3 — the Scraper-side `people[]` extraction, the `cop=people` route and Network's proxy — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.14 is the brief (follow its reading list in order, then its five build steps exactly; E4 closes with this session), §3's D17 and D9 and §5.5.1 row 5 the design, `repository-information/NETWORK-SCHEMA.md` §3 / §8 / §9 the shapes. E4 sessions 1 and 2 are done in §11 (v07.20r; `Events.gs` v01.07g, `Events.html` v01.08w, `Network.gs` v01.12g, `Network.html` v01.21w) — the sweep, its six kinds, the manual form, the docket watch and `scripts/check-events-signals.js` (103 checks) exist; extend, do not fork. Live state you cannot see from the repo: both peer tokens are set, the weekly sweep [is / is not] installed, the first live sweep's Signals now answer read [paste the status line here], and the newsroom and docket rows [did / did not] show on an account in Network. Build `people[]` in the Scraper's summarisation schema and stored items (no second model call, no backfill), the `cop=people&slug=&since=` far side behind a new `NETWORK_CORPUS_TOKEN` (`nwHandlePeer_`'s token idiom; never `CORPUS_TOKEN`, never Profiler's proxy), Network's `nwPeopleProxy_` behind `signals`, the account detail's "People in the press" list with an Accept step that writes a `press-quote` signal at 0.7 with `Evidence URL = corpus:<key>` and `Source = scraper` (the write leg gains a `corpus:` branch for that kind only), and `scripts/check-scraper-people.js` on the two-VM idiom with zero live calls. No plans (E5), no discovery Routine (R), no new scope, never widen an existing peer token — the new token is set by hand in both projects and never committed; the session never calls any app. Verify with the E4 session 2 list plus `scripts/verify-network-roles.py`, and grep the served pages and the `.gs` files for `linkedin.com`, `10times` and `attendee`. Bump every `.gs` and page touched per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no token, account or person; CHANGELOG entry; `NETWORK-SCHEMA.md` §8 / §9; flip §11's E4 row to Done with the versions and write the next brief as §13.15. Then hand off in chat: set the new token in both projects, redeploy Scraper and Network, summarise one article, read its people on the account and accept one. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; parallel sessions push, so check `git ls-remote` before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for whatever §11 says is next, and remember session."

### Added
- **E4 session 3 — the people route** (design plan D17, catalogue §5.5.1 row 5; §11's E4 row flipped to **Done** with the three sessions' versions; the N4 session-1 brief written as §13.15 with its paste-in prompt): the Scraper names the people its summarise pass reads, the `cop=people` route answers them behind a **third token namespace**, Network reads them through its own proxy and the developer accepts each one as a `press-quote` signal
- `scripts/check-scraper-people.js` — the two-VM harness (Scraper's real far side in one context, Network's real proxy, people ops and write leg in the other, the Network fetch routed into the Scraper context): **62 checks**, zero live calls
- `NETWORK-SCHEMA.md` §8 (the write leg's `corpus:` branch, the empty slug for `press-quote`, the person in the press-quote upsert key, `Source = scraper`; the session ops `nop=people` and `nop=peopleaccept`), §9 (the route as built — `since`, the default window, no back-fill, the `accepted` flag, the accept step's row) and §14 (the new harness)

### Changed
- **No back-fill** (the brief's decision over D17's "one-time admin job"): only items summarised from `Scraper.gs` v02.22g onward carry people; older items are never re-read and never answered on the route
- `scripts/check-peer-bridge.js` / `scripts/check-events-signals.js`: the Network context extracts the upsert-key helper and the name key it uses, and the corpus-key constant; both still pass (61 · 103 checks)
- `scripts/check-network-schema.py`: `items` · `people` · `covered` join the audit-detail allow-list (counts and a flag — the checker still refuses a name, a slug or a key); `scripts/verify-network-roles.py`: the people pass — read on demand only, the two-person list with the accepted one ticked, Accept posting the key and the person, the "Will be at" line re-read once, the uncovered account's line; ALL CHECKS PASSED at 390 × 844

#### `Scraper.gs` — v02.22g

##### Added
- `people[]` in the summarise call's output schema (`SCRAPER_PEOPLE_MAX` = 5 per item; role ∈ quoted · author · named; name, title, company, one-phrase context) — the same single model call, a few output tokens more, **no second call**; `scPeopleParse_` shapes and bounds the reply, `scSignalsMerge_` stores it as `ppl` in the item's Signals blob beside `evt` and `figs`
- `scHandlePeople_` / `scPeopleScan_` — `cop=people&slug=&since=[&limit=]` behind `NETWORK_CORPUS_TOKEN` (`SCRAPER_NETWORK_CORPUS_TOKEN_PROP`; the property trimmed, sub-16 refuses, every boundary case flat `denied` with zero reads, nothing audited on a refusal): rows whose blob carries `ppl`, the slug's rows, `since` honoured, one row per article key, corpus-only rows counted, ≤ 200; the audit row carries the slug, the window and counts

##### Changed
- `scHandleCorpus_`: `cop=people` is routed to the new gate **before** the `CORPUS_TOKEN` check — Profiler's token never opens it and the Network token never reaches `timeline` or `candidates`
- `SCRAPER_SIGNALS_CELL_MAX` 1500 → 2500 so the people list fits the blob in the common case; `scSignalsJson_`'s drop order gains `ppl` after `figs`

#### `Network.gs` — v01.13g

##### Added
- `NW_CORPUS_TOKEN_PROP` (`NETWORK_CORPUS_TOKEN`), `SCRAPER_CORPUS_EXEC` (the Scraper config's deployment), `NW_CORPUS_KEY_RE`, `NW_PRESS_QUOTE_CONFIDENCE` = 0.7, `NW_PEOPLE_DEFAULT_DAYS` = 90
- `nwPeopleProxy_` — `nwEventsProxy_` (and so `guidanceMentionsProxy_`) verbatim with the Scraper URL and the corpus token: `not_configured` under 16 characters with no fetch, `upstream_http_<code>`, `upstream_unreachable`, `upstream_not_json` with a snippet
- `nop=people` (session GET, behind `signals`) — the account's slug names the route; an uncovered account answers `covered:false` with no fetch; each person carries `accepted` and its signal id when the Signals tab already holds the row; audit: the account id and counts
- `nop=peopleaccept` (behind `signals`) — one `press-quote` row through the bridge's own upsert with `Source = scraper`: 0.7, `corpus:<key>`, the person's name and title, no event slug, the item's date as First Seen, the context as the note, `Contact ID` set when a live contact at that account has the same name; `read_only_scope` on a view-only share; `nwScopedAccount_` resolves the account inside the session's scope
- `nwSignalKey_` — the upsert key adds the person's name key for `press-quote` only (one article quotes several people at one account; each is its own row)

##### Changed
- `nwPeerSignalsWrite_`: a `source` argument (`events` by default, `scraper` from the accept step — never from the body); the empty `eventSlug` accepted for `docket` **and** `press-quote`; `corpus:<key>` evidence accepted for `press-quote` only (`evidence_required` on any other kind); a press quote with no person is `person_required`; the audit op names the writer

#### `Network.html` — v01.22w

##### Added
- **People in the press** on the account detail — read on a tap (never on the detail open, never a poll): per article the title, outlet, date and link; per person the name, title, company, role and context with **Accept**, or the tick when already accepted; an uncovered account's line says the route needs a dossier slug; the error text names a missing token, an unreachable corpus or a non-JSON answer
- Accept → `nop=peopleaccept`, the row flips to accepted, the status line says whether the person matched a contact, and the "Will be at" line re-reads in place (`nwSignalsFill`, split out of `nwSignalsLine`)

##### Changed
- The "Will be at" line labels a press quote `press` instead of `?` when the row has no event

## [v07.20r] — 2026-09-22 10:38:40 PM EST

> **Prompt:** "Run E4 session 2 — newsroom pages, agendas and the FERC docket watch — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.13 is the brief (follow its reading list in order, then its five build steps exactly; session 3 is not this session), §5.5 and the §5.5.1 catalogue rows 4 · 6 · 7 the design, `repository-information/EVENTS-SCHEMA.md` §3 / §8 and `repository-information/NETWORK-SCHEMA.md` §3 / §8 the shapes. E4 session 1 is done in §11 (v07.19r; `Events.gs` v01.06g, `Events.html` v01.07w, `Network.gs` v01.11g, `Network.html` v01.21w) — the sweep `evSignalsRun_`, its parsers and matcher, the manual form, the "Signals only" pill and `scripts/check-events-signals.js` exist; extend them, do not fork them. Live state you cannot see from the repo: both peer tokens are set, the weekly sweep [is / is not] installed and the first live sweep's Signals now answer read [paste the status line here]. Build the monthly newsroom / "meet us at" read per target account over the Account row's Newsroom URL (`kind = newsroom`, 0.7), the agenda read at `agendaUrl` with the roster parser reused (`kind = agenda`, 0.9, the person), recordings by manual link as the brief decides, and the FERC eLibrary RSS watch per utility / IPP account over the Scraper roster's existing feed (`kind = docket`, 0.7, no event slug — check Network's slug rule and the score's indifference); each with a fixture and a harness section in `scripts/check-events-signals.js`; the verifier only if the sheet's form gains a kind. No Scraper `people[]` or `cop=people` (session 3), no plans (E5), no discovery Routine (R), no Swapcard API; no new scope; never widen a peer token — the session never calls the app. Verify with the E4 session 1 list plus `scripts/verify-network-roles.py` if Network changes, and grep the served page and the `.gs` for `linkedin.com`, `10times` and `attendee`. Bump `Events.gs` (and `Events.html` / `Network.gs` only if touched) per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no token, account or person; CHANGELOG entry; `EVENTS-SCHEMA.md` §8; flip §11's E4 row to In progress — session 2 with the versions and write the session-3 brief as §13.14. Then hand off in chat: redeploy, Signals now, read the newsroom and docket rows on an account in Network. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; parallel sessions push, so check `git ls-remote` before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for E4 session 3, and remember session."

### Added
- **E4 session 2 — newsroom pages, agendas and the docket watch** (design plan §5.5, catalogue §5.5.1 rows 4 · 6 · 7; §11's E4 row flipped to In progress — session 2; the session-3 brief written as §13.14 with its paste-in prompt) on session 1's run, never a fork
- `EVENTS-SCHEMA.md` §8: the session-2 paragraph (the monthly newsroom read and its `EV_SIGNALS_NEWSROOM` skip state, the agenda read, recordings as manual `agenda` rows, the docket watch over the Federal Register FERC feed with no event slug, the run answer's new fields); §3's `agendaUrl` note. `NETWORK-SCHEMA.md` §3 (`Newsroom URL` carried on `nop=accounts`; `Event Slug` empty for a `docket` row), §8 (`newsroomUrl?` on the accounts answer; the empty-slug rule for `docket` only; the upsert refreshing Confidence / Note)
- `scripts/check-events-signals.js` grew from 76 to **103 checks**: a newsroom page naming a show by its edition name and another by its series with the year nearby, a 404 page audited without an account id and retried, the monthly skip (read today → skipped; aged 33 days → read again, rows updated never duplicated), customer and supplier pages never read, an agenda page and the same-URL skip, the Federal Register FERC feed (the URL asserted equal to the Scraper roster's `fedreg-ferc` row) with two watched filers, an unwatched filer and a non-filer, the docket rows through Network's real write leg with the empty slug and `bad_slug` on every other kind, the score ignoring them, `nop=accounts` carrying `newsroomUrl` only when set, the recording rows and their `Recording:` note

### Changed
- **The docket source is the Federal Register's FERC feed, not a FERC eLibrary RSS** — the Scraper roster carries none: FERC's own site is retired there as `blocked` (a browser challenge no server-side reader passes) and the roster's FERC row is the Federal Register feed, where an order or notice takes legal effect and whose item titles name the filer. Live-probed from the session (never the app): 200, 129 items, empty descriptions. Recorded in §11 and §13.14
- `verify-events-roles.py`: the signal form's kinds are `linkedin-manual` · `registrant-mail` · `agenda`
- `live-site-pages/events-data/events.json` / `events.ics`: two iMasons rows that ended 2026-09-22 flipped to `past` by `check-events-registry.py --fix-past` (the checker's own remedy; today is 2026-09-23 UTC) and the `.ics` rebuilt — 69 confirmed of 100

#### `Events.gs` — v01.07g

##### Added
- `evSweepNewsrooms_` / `evParseNewsroom_` / `evNewsroomState_` · `evNewsroomSave_` · `evNewsroomFresh_` (row 4): per `target` account with `newsroomUrl`, read unless read within `EV_NEWSROOM_DAYS` = 28 (the day parked per account id in `EV_NEWSROOM_READ_PROP`), the page text (scripts and styles stripped) matched on each target event's name, or its series with the edition's year within `EV_NEWSROOM_NEAR` = 400 characters → `newsroom` 0.7, the page as evidence, the person the page names (the roster parser over the same page); a failed page one audit row with no account id, retried next run
- `evSweepEvent_`: the agenda at `agendaUrl` through `evParseSpeakers_` → `agenda` 0.9 with the person; `same_as_speakers` when it equals the roster URL
- `EV_DOCKET_FEEDS` (the Scraper roster's `fedreg-ferc` URL), `EV_DOCKET_SEGMENT_RE`, `evDocketSegments_` (the docket segment ids found by name in `profiler-segments.json` — never hard-coded), `evSweepDockets_` (once per run, reported in `feeds[]`), `evMatchDockets_` (every watched account with a docket segment named in an item's title or text → `docket` 0.7, the item link, `eventSlug` empty)
- `EV_SIGNAL_CONFIDENCE` gains `newsroom` 0.7 · `agenda` 0.9 · `docket` 0.7; `EV_SIGNAL_MANUAL_KINDS` gains `agenda` — `evSignalManual_` prefixes the note with `Recording:` on that kind (a note already starting with "Recording" is kept; no line → `Recording`)

##### Changed
- `evSignalsRun_`: the newsroom sweep after the press match, the docket watch after it (event-independent), `pages` / `pagesFailed` counting the agenda and newsroom reads, `newsrooms{}` and `dockets{}` on the answer, `newsrooms` · `newsroomsSkipped` · `dockets` in the parked `EV_SIGNALS_LAST` and the run's audit counts

#### `Events.html` — v01.08w

##### Added
- The signal form's third kind, "Recording of a talk you watched"; the form's note and the link placeholder mention it

#### `Network.gs` — v01.12g

##### Changed
- `nwPeerAccounts_`: `newsroomUrl` on the row when it is an `https?://` value
- `nwPeerSignalsWrite_`: an empty `eventSlug` is accepted for `kind = docket` only; a malformed slug on `docket`, or an empty slug on any other kind, is still `bad_slug`

## [v07.19r] — 2026-09-22 07:50:15 PM EST

> **Prompt:** "Run E4 session 1 — the attendance signals — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.12 is the brief (follow its reading list in order, then session 1's five build steps exactly; sessions 2 and 3 are not this session), §5.5 and the §5.5.1 catalogue the design, `repository-information/NETWORK-SCHEMA.md` §3 / §8 and `repository-information/EVENTS-SCHEMA.md` §3 / §6 / §8 the shapes. B (v07.10r), E2 (v07.15r) and E3 (v07.18r; `Events.html` v01.06w, `Events.gs` v01.05g) are Done in §11. Live state you cannot see from the repo: both peer tokens are set on the live deployments, the developer confirmed the `seats` lists in `profiler-segments.json` on 2026-09-22, and `relevancePrior` in the live `Tuning` tab is 0.2 (the repo's seed stays 0.05 — it only seeds an empty tab). Build the weekly sweep in `Events.gs` (`evSignalsRun_` over every starred event plus the top ten recommended — the Map Your Show and a2z exhibitor parsers, the speaker roster from JSON-LD `performer` or HTML, the three newswire RSS feeds keyword-watched per target / customer / partner account, every hit matched to a Network account by its normalised name and written over the bridge's existing write leg with kind, confidence, evidence URL and `firstSeen`; `eop=installsignals` idempotent, `eop=signalsnow`; a failed page one audit row and nothing else), the manual signal form on the sheet's owner block in `Events.html` (account, kind ∈ linkedin-manual · registrant-mail, URL, one line, a rated confidence — the same write leg), the "Signals only" pill switched on over the cached score's `why.accounts[]` (no new op), the sweep controls and a last-swept line on the poller card, `scripts/check-events-signals.js` (a Node sandbox harness: fixture directory, speaker and RSS pages, the matcher, the three kinds and their confidences, the upsert's written-then-updated on a re-run, a LinkedIn URL never fetched and an attendee list never fetched, the admin refusals with zero fetches; zero live calls) and the verifier's signals pass. Two developer-approved extras ride this session (2026-09-22): (a) the poller's past-date guard — `evPollSource_`'s item loop proposes `new-event` / `new-edition` items whose dates have already passed; skip them and add a harness case to `scripts/check-events-poller.js`; (b) extend `scripts/check-events-registry.py` to validate `profiler-segments.json` → `seats`: both keys `storage-seller` and `aidc-power-seller` present, every `segments[]` id present in `segments[].id`, no duplicates within a seat. No newsroom pages, agendas or FERC (session 2), no Scraper `people[]` or `cop=people` (session 3), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with `node --check` on a `.js` copy of `Events.gs`, `scripts/check-gas-inner-scripts.js`, `node scripts/check-events-signals.js`, `node scripts/check-events-score.js`, `node scripts/check-peer-bridge.js`, `node scripts/check-events-poller.js`, `python3 scripts/check-events-registry.py`, `python3 scripts/check-readme-tree.py` and `scripts/verify-events-roles.py` (zero page errors at phone width; Playwright is `pip install playwright` with the pre-installed Chromium, no `playwright install`), and grep the served page and the `.gs` for `linkedin.com`, `10times` and `attendee`. Bump `Events.html` / `Events.gs` per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, account or person; CHANGELOG entry; README tree entries; `EVENTS-SCHEMA.md` §8; flip §11's E4 row to In progress — session 1 with the versions, note the two extras there, and write the session-2 brief as §13.13. Then hand off in chat: redeploy, Install signals, Signals now, open RE+ 2026 and read its accounts, add one manual signal and find it on the contact in Network. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; the C2 Routine fires Wednesday 2026-09-23 11:00 UTC and parallel sessions push, so check `git ls-remote` before pushing. The CHANGELOG stands at `Sections: 89/100` — read the live counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E4 session 2, and remember session."

### Added
- **E4 session 1 — attendance signals** (design plan §5.5, catalogue §5.5.1 rows 1 · 2 · 3 · 11 · 13; §11's E4 row flipped to In progress — session 1; the session-2 brief written as §13.13 with its paste-in prompt). `scripts/check-events-signals.js` — 76 checks, zero live calls: the real sweep, parsers, matcher and manual-signal functions of `Events.gs` in one VM context with stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService` / `ScriptApp`, and Network's **real** `nwPeerSignalsWrite_` / `nwPeerSignalsRead_` / `nwPeerAccounts_` in a second context that the peer URL routes into
- `EVENTS-SCHEMA.md` §8 "The E4 session ops" (`eop=installsignals` · `signalsnow` · `signal`, the run's answer shape, the parked `EV_SIGNALS_LAST` state), §5's `Signals` row amended, §12's checker entry; `NETWORK-SCHEMA.md` §8 (the `linkedin-manual` exemption, the person on the read leg, the session `nop=signals` GET); README tree entry for the new harness
- **Developer-approved extra (b):** `scripts/check-events-registry.py` validates `profiler-segments.json` → `seats` — both seat keys present with a non-empty `segments[]`, every id in `segments[].id`, no duplicate within a seat, no unknown seat key; proved to exit 1 on tampered copies

### Changed
- **Developer-approved extra (a):** the poller's past-date guard — `evPollSource_` skips a `new-event` / `new-edition` whose `after` dates have already passed, counted as `pastSkipped` on the source and the run; `scripts/check-events-poller.js` gains the case (two past 2025 rows in the JSON-LD fixture, never queued; 67 checks) and the panel's `signals` state assertion
- Live probes from the session (organiser and newswire pages, never the app): the Map Your Show 8_0 gallery is a client-side app whose exhibitors come from the site's own JSON proxy (`…/ajax/remote-proxy.cfm?action=search&searchtype=exhibitorgallery`), which answers with the `X-Requested-With: XMLHttpRequest` header alone — RE+ 2026 returned all 1,214 exhibitors in one call; RE+'s speakers page is a Swapcard iframe widget (no server-rendered names); PR Newswire's all-releases feed answers RSS; Business Wire's "home" channel answers an error document while the all-news channel `rss=G1QFDERJXkJeEFpRXg==` (found by probing the channel parameter) answers 812 items; GlobeNewswire could not be reached from the session's egress and is landed unverified — the run reports every feed's status
- `verify-events-roles.py`: the stub answers `netaccounts` · `signal` · `installsignals` · `signalsnow` and carries `signals` on `proposed`; the probe expects the enabled pill; a signals pass (the form fills from one `eop=netaccounts`, writes the typed row through `eop=signal` and clears; the pill narrows the agenda to the signalled event over the cached score with ≤ 1 fetch; the sweep card's Install signals / Signals now reach the stub; screenshots `events-signals.png` / `events-signals-card.png`); `verify-network-roles.py`'s stub answers `nop=signals` so the detail line renders — both ALL CHECKS PASSED, zero page errors at 390 × 844

#### `Events.gs` — v01.06g

##### Added
- The E4 block: `evSignalsRun_` (trigger handler `evSignalsTick`; `eop=installsignals` idempotent — every trigger on either name deleted, one weekly **Tuesday 06:00 America/New_York** trigger created; `eop=signalsnow` as the admin who pressed it, that owner only; the trigger sweeps every owner with a `Stars` row as `signals`): targets `evSignalsTargets_` (upcoming starred events + the top `EV_SIGNALS_TOP_N` of `evRecommend_` as the owner, starred first, deduplicated); per event `evSweepEvent_` — `evExhibitorSource_` rewrites a Map Your Show gallery URL to its JSON proxy with the XHR header and routes an a2z host to the page, any other host `unknown_host` and never fetched; `evParseMysExhibitors_` (`hit[].fields.exhname_t`, or the gallery's `card-Title` elements from an HTML fixture; a broken body throws `mys_not_json`), `evParseA2zExhibitors_`, `evParseSpeakers_` (JSON-LD `performer[]` and `Person` nodes with `worksFor` · `affiliation` · `jobTitle` via `evCollectPersons_`, else HTML speaker cards: name · title · company or "Title at Company"); once per run `evSweepFeeds_` over `EV_NEWSWIRE_FEEDS` and `evMatchPress_` (`EV_NEWSWIRE_CUE_RE` + the account key + the event's name or series key, whole-word containment via `evTextHasKey_`); the matcher `evNormaliseCompany_` (`nwNormaliseCompany_` byte for byte — `EV_LEGAL_SUFFIX_RE` mirrored) and `evAccountKeys_` (name + Profiler slug as words), `evSignalsMatcher_` over target · customer · partner; `evSignalsWrite_` in batches of `EV_SIGNALS_BATCH` over the bridge's write leg; a failed page or feed one audit row (`events_signals_page_failed` / `events_signals_feed_failed`), the poller's budgets, `stopped` on overrun; the counts parked in `EV_SIGNALS_LAST` (`evSignalsState_`, answered on `eop=proposed` as `signals`)
- `eop=signal` (`evSignalManual_`): the manual path — `bad_account_id` · `bad_slug` · `bad_kind` (only `linkedin-manual` · `registrant-mail`) · `evidence_required` · `bad_confidence` before any write, `note` collapsed to one line, optional `personName` / `personTitle`, Network's per-row rejections relayed, `not_configured` passed through; audit the kind and counts only
- `evStripTags_` reads any entity the decoder does not name as a space

##### Changed
- `evPollSource_`: the past-date guard (extra a) — `res.pastSkipped`, summed onto the run
- `evRecommend_` / `evScoreEvent_`: the signal read carries `personName` / `personTitle` when present, and the strongest signal's person rides `why.accounts[].signal`; `evPeerSignals_` passes the person through
- `handleEventsOp_`: `installsignals` · `signalsnow` · `signal` behind the `signals` capability

#### `Events.html` — v01.07w

##### Added
- The manual signal form `evSignalForm` on the sheet's owner block (`#ev-sigform`: `#ev-sig-account` from `eop=netaccounts` fetched once per session via `evLoadNetAccounts`, `#ev-sig-kind`, `#ev-sig-url`, `#ev-sig-note`, `#ev-sig-conf` defaulting to 0.8, `#ev-sig-add` → `evApiBody('signal', …)`; the form disables itself with the connect-Network line on `not_configured`; a saved row clears the fields, refetches the score and repaints the sheet's why)
- The "Signals only" pill switched on (`#ev-f-signals`, `evSignalsToggle` / `evHasSignal` over the cached `why.accounts[]`, one `eop=recommend` when nothing is cached, `evSignalsStatusLine`); `evMatches` honours `_evFilters.signals`; `evAfterWrite` refetches while the filter is on
- `evPaintWhy` names the person (`.ev-why-person`) where the signal carries one
- `evSignalsCard` on the Proposed tab (`#ev-sigcard`: the sweep's badge, `#ev-sig-install` / `#ev-sig-now` through `evPollButton` with a per-card status id, `#ev-sig-last`); `evPollButton` takes an optional status id
- `evErrText` texts for `bad_account_id` · `bad_kind` · `evidence_required` · `bad_confidence` · `linkedin_not_fetched` · `account_not_found` · `upstream_*`

#### `Network.gs` — v01.11g

##### Added
- `nwSignalsOp_` — `nop=signals` (session GET, after `validateSessionForData` + `nwRequire_(sess, 'signals')`): `accountId`, or `contactId` resolved to its account; the owner-scoped live rows, newest `Last Seen` first, with `note` and the person where present; audit ids and counts only

##### Changed
- `nwPeerSignalsWrite_`: a LinkedIn host is accepted when `kind === 'linkedin-manual'` (it rejected every kind before — the manual path could not have landed); `nwPeerSignalsRead_` carries `personName` / `personTitle` when non-empty

#### `Network.html` — v01.21w

##### Added
- `nwSignalsLine` — one "Will be at" `dt` / `dd` on the account detail (after Contacts) and the contact detail (after History), read through `nwApi('signals', …)` when the detail opens; each signal with its slug, kind, confidence, the person and the evidence link; `not_configured` / errors as text, never a throw

## [v07.18r] — 2026-09-22 05:29:45 PM EST

> **Prompt:** "Run E3 — the recommendation score — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.11 is the brief (follow its reading list in order, then its five build steps exactly), §5.4 the design, repository-information/EVENTS-SCHEMA.md §5 / §6 / §8 the shapes. B (v07.10r) and E2 (v07.15r; Events.html v01.05w, Events.gs v01.04g) are Done in §11, and E2's first live cycle has run — the weekly trigger is installed and the Proposed queue holds 33 pending rows. Do not touch the poller, the queue or events.json. Build eop=recommend in Events.gs (the six §6 terms computed server-side from Network's scored accounts and their signals over the bridge, the seat segments from profiler-segments.json, mentions[] and the owner's stars; Tuning seeded once with the default weights and a regions row and read on every score; notConfigured degrades, never fails; audit counts only), the Recommended pill and score chips on the agenda and the why panel on the sheet in Events.html (fetched on demand — no poll), scripts/check-events-score.js (a Node sandbox harness proving every term against hand-computed values, a weight change reordering, the not_configured degrade and the non-admin refusal with zero live calls) and the verifier's Recommended pass. No attendance sweeps (E4), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, node scripts/check-events-score.js, node scripts/check-peer-bridge.js, node scripts/check-events-poller.js, python3 scripts/check-events-registry.py, python3 scripts/check-readme-tree.py and scripts/verify-events-roles.py (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token or account; CHANGELOG entry; README tree entries; EVENTS-SCHEMA.md §5 and §6; flip §11's E3 row to Done with the versions and write the E4 brief as §13.12. Then hand off in chat: redeploy, press Recommended, judge the top five line by line, change a weight and press again. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The repo stands at v07.17r and the CHANGELOG at Sections: 88/100 — read the live counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E4 session 1, and remember session."

### Added
- **`Events.gs` v01.05g — `eop=recommend`, the recommendation score (E3, design plan §5.4; `EVENTS-SCHEMA.md` §6).** `evRecommend_` scores every upcoming registry row (`status` ∉ cancelled · past, not yet over) server-side from bridge data — Network's scored accounts once over `evNetworkProxy_('accounts')`, each account's signals over the `nop=signals` read leg capped at 40 (`EV_SCORE_SIGNAL_CAP`, `signalsCapped` says when it stopped), the seats' segment sets from `profiler-segments.json` → `seats` and the dossier `lastUpdated` dates from `profiler-companies.json` (both fetched from the Pages site through `evPagesJson_`), `mentions[]` from the row, the owner's registered / attended Stars for the conflict term. `evScoreEvent_` computes the six terms exactly as §6 writes them — `segmentFit` by audience share, `accountPresence` as Σ stageWeight × confidence capped at 1 with one account counted once at its strongest signal (`EV_STAGE_WEIGHT`; customer / partner / channel 0.5 at any stage), `corpusSalience` with a 12-month half-life over the newest mentioning dossier, `proximity` 1 / 0.5 / 0 from the `Tuning` `regions` row and the registry-derived country set, `conflict` −1 on an overlapping starred registered / attended event **other than the event's own star**, `relevancePrior` = relevance / 5 — and `score = Σ weight × term` to two decimals (never −0), sorted by score then slug. The answer carries the weights, the regions, `defaulted[]`, `seeded`, `notConfigured`, the counts and per event the terms and a `why` (segments matched, accounts by name with stage / stage weight / signal / evidence URL, mention slugs, conflicting starred slugs). Behind the `recommend` capability; audit counts only
- **`Events.gs` v01.05g — `evTuning_`: the `Tuning` tab seeded once and read on every score.** An empty tab receives the six §6 weight rows and a `regions` row (empty by default), each with a Note; a weight that is not a finite number in 0..1, or a term row deleted by hand, falls back to its default and is named under `defaulted[]`; a partially edited tab is never re-seeded. Editing a cell and pressing Recommended again reorders the list — no deploy
- **`Events.gs` v01.05g — degrades, never fails.** A `not_configured` Network side zeroes `accountPresence`, sets `notConfigured: true` and still computes every other term; any other upstream failure is named in `networkError` with the same degrade; an unreadable segments or companies file zeroes its term and is named under `unavailable[]`
- **`Events.html` v01.06w — the Recommended pill and the score chips (E3).** A **Recommended** pill on the Mine row (admin, `recommend` capability): every press fetches `eop=recommend` once and the agenda re-renders as one ranked "Recommended" section — a rank and a score chip on every scored row, the month-in-view label reading Recommended, the status line reporting the ranking (accounts and signals read, or "Network not connected — scored without your accounts", any defaulted weight, any unreadable file); pressing again restores the month groups without a request. Fetched on demand only (D14): on the pill, on a sheet opened before any score, on return to the tab and after a star write while ranked — never polled
- **`Events.html` v01.06w — the *why* panel on the sheet** replaces the E1/B placeholder line: the score and its rank, the six terms as one bar each with its weight and signed contribution (the conflict bar in the gold), the accounts with a signal by name — relationship, stage, stage weight, signal kind, confidence and the evidence link — the segments matched in the developer's seats, the dossiers that name the show as Profiler chips, the starred conflicts as links that open that event, and a Tuning line naming the tab, the preferred regions and any defaulted weight; a `notConfigured` answer paints the "connect Network" line at the top and the terms that do not need Network below it
- **`live-site-pages/profiler-data/profiler-segments.json` — a `seats` block** (`storage-seller` · `aidc-power-seller`, each `{ label, segments[], basis }`, the buyer segments per `C5-SALES-SIMULATIONS-DESIGN.md` §9's inventory). The file carried no seat → segment mapping before, and design plan §12.6 requires the score to read the seats' segments from this file at run time, never from a copy in Events — so the mapping now lives where the plan says it does. Documented in `PROFILER-SCHEMA.md` → Segments registry
- **`scripts/check-events-score.js`** — the E3 sandbox harness (the `check-peer-bridge.js` idiom): the real scoring functions of `Events.gs` in one VM context with stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService`, a fixture registry, segments and companies files and a stubbed Network far side. 70 checks: every term against a hand-computed value on three fixture events and the score to two decimals; the seed once; a weight change reordering; a malformed, an out-of-range and a deleted weight row each defaulted and named; ties broken on slug and no −0; `not_configured` and a sub-16 property degrading with no network fetch; an unreachable Network side named; the 40-account cap; a 503 on the segments file zeroing `segmentFit` and named; `recommend` refused to an analyst with zero fetches and zero tab opens; no audit row carrying an account name, id or token. Zero live calls
- **`scripts/verify-events-roles.py` — the Recommended pass** (§13.11 step 5): the stub answers `eop=recommend` with three scored upcoming events in reverse date order; the pill issues exactly one request, the agenda re-orders into one "Recommended" section with `0.91 / 0.77 / 0.42` chips and ranks 1–3, the label reads Recommended, the top event's *why* leads with the score, six bars with weights and widths following the terms, the stub account with its stage, signal and evidence link, the segments, mention chips and the starred conflict, and unpressing restores the month groups without a request. Screenshot `events-recommended.png`. ALL CHECKS PASSED, zero page errors at 390 × 844

### Changed
- **`EVENTS-SCHEMA.md`** — §5 the `Tuning` row now states the seeded defaults, the `regions` row and the fallback rule; §6 rewritten around the implementation: the seat source (`seats`), one-account-once at its strongest signal, the stage-weight table's edge rows (`channel`, a target past `none`), the calendar-month decay from the dossiers' `lastUpdated`, the derived same-country rule, the self-exclusion on conflict, the 40-account cap, the answer shape and the degrade rules; §12 registers `check-events-score.js`
- **`PROFILER-SCHEMA.md`** — Segments registry: the `seats` row
- **`NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's E3 row flipped to **Done — v07.18r** with the versions and what landed; **§13.12 written** — the E4 brief (three sessions per §5.5.1: session 1 the exhibitor and speaker diffs, the newswire RSS and the manual path; session 2 newsroom pages, agendas and the FERC docket watch; session 3 the Scraper-side `people[]` and the `cop=people` route) with the paste-in prompt for session 1
- **README tree** — the Events entry carries `v01.06w` · `v01.05g` and the E3 line; `check-events-score.js` added under scripts; the verifier's description carries the Recommended pass

### Notes
- **Every verifier green:** `node --check` on the `.js` copy of `Events.gs`; `check-gas-inner-scripts.js` (11 files, 106 blocks); `check-events-score.js` 70/70; `check-peer-bridge.js` and `check-events-poller.js` unchanged and green; `check-events-registry.py` OK; `check-readme-tree.py` 0 findings; `verify-events-roles.py` ALL CHECKS PASSED with the new pass, zero page errors
- **Not touched, as instructed:** the poller, the Proposed queue, `events.json`; no attendance sweep, no plans, no discovery Routine; neither peer token widened; the session never called the app
- **Session context** written in the same commit (the "remember session" of this prompt) so the session stays at one push

## [v07.17r] — 2026-09-22 04:20:59 PM EST

> **Prompt:** "Before I start on E3, I want to close a couple open items:\n\n* I can confirm that \"My Card\" works as intended on Network.\n* When I try to export 2 cards in a vCard bundle (.vcf) with card images included, it works on my PC, but fails on my phone. On my phone, it looks like it's about to ask me to log into my Gmail to verify permissions, but then it quickly switches back to Network and then shows an \"Aw Snap\" error (see attached screenshot). What's going on? Fix it.\n* What should I set \"NW_POSTAL_ADDRESS\" to in my Network Apps Script?\n* How do I redeploy Events.gs from the Apps Script editor?" *(two screenshots attached: the previous session's close-out, and Chrome's "Aw, Snap!" page on Android at the moment of the crash)*

### Fixed
- **`Network.html` v01.20w — the vCard PHOTO splice crashed the mobile renderer (the reported "Aw, Snap!").** Root cause is `nwVcardFold`, not the Drive consent flash the symptom suggested: the original folded by re-slicing a shrinking `line` (`line = ' ' + line.slice(75)`), so every pass had to flatten the cons string the previous pass built — quadratic in the line's length. Property lines are short and were never affected; a PHOTO line is not. The stored card front is the 2,000 px capture (~600 KB), whose base64 is a ~800 KB single line, i.e. ~11,000 passes: **measured at 18.3 s and multiple GB of allocation churn per card on desktop-class V8**, which desktop Chrome absorbs and a phone renderer answers with an OOM kill. Two cards doubled it. `nwVcardFold` is now flat — it indexes the source string and `join`s once — verified byte-for-byte identical to the old output for every length 0–1,200 and at 200,000 chars, and **1,679× faster** on the 800 KB line (18,329 ms → 10.9 ms). A `PROJECT OVERRIDE` comment records why it must not be written back as a loop
- **`Network.html` v01.20w — the front is no longer base64-encoded at capture size.** `nwCardFrontBytes` (raw `arrayBuffer` → `nwBytesToB64`) is replaced by `nwCardFrontPhoto`: fetch as a Blob, `createImageBitmap` → canvas at `NW_VCARD_PHOTO_MAX` 720 px / `NW_VCARD_PHOTO_Q` 0.8, and base64 taken straight out of `toDataURL` — the full-size bytes are never turned into a string, and the canvas backing store is released before it is held. Typical PHOTO line ~40–90 KB (0.2 ms to fold). Falls back to the undecoded bytes only where `createImageBitmap` is absent or the image will not decode, and only under `NW_VCARD_PHOTO_RAW_MAX` (512 KB). Contacts on iOS and Android render the PHOTO at avatar size either way, and oversized PHOTO values are a known iOS import failure, so this is a fidelity-neutral fix
- **`Network.html` v01.20w — `nwBytesToB64` batches at 8 KB, not 32 KB.** `String.fromCharCode.apply` spreads its batch onto the call stack; 32,768 arguments is close enough to the engine limit to fail on a mobile renderer under memory pressure. Also builds through an array rather than `+=`

### Changed
- **`Network.html` v01.20w — the export reports progress through the photo fetches** (`Adding the card image N of M…`), which are serial and were silent
- **`NETWORK-SCHEMA.md` §11** — the PHOTO row records the 720 px re-encode; the N3 s2 paragraph names `nwCardFrontPhoto` and states the fold's flat-form requirement as a rule rather than an implementation detail

### Notes
- **No `Network.gs` change and no redeploy needed** — the PHOTO splice is entirely page-side by design (the card front lives in the developer's own Drive under `drive.file`, which the script cannot read), so the fix ships with the Pages deploy
- **The Gmail-permission flash the report describes is not the fault** and is unchanged: `nwDriveToken` calls the GIS token client with `prompt: ''`, which on an already-granted account opens and closes an auth window without interaction. On Android Chrome that window is full-screen for a moment. The crash followed it because the fold ran immediately after the token returned
- `scripts/verify-network-roles.py` — ALL CHECKS PASSED, zero page errors, 55 requests on the admin+s1+s2 pass, with the PHOTO splice exercised; `check-gas-inner-scripts.js`, `check-network-schema.py` and `check-readme-tree.py` clean; every inline `<script>` in the page re-checked with `node --check`

## [v07.16r] — 2026-09-22 09:27:50 AM EST

> **Prompt:** "[Scheduled Routine \"Profiler earnings desk\", trig_01HkrwpCULei8Gje6RGqcp1B, fired 2026-09-22T13:09:04Z.] STEP 0 — CLONE, THEN PROVE YOU CAN PUSH, BEFORE ANY RESEARCH. This Routine fires into a session with NO repository source. On 2026-09-16 a run completed a full IREN/Jinko/Oracle refresh, committed it locally as a378a96, and was DENIED on push — every minute of that work was thrown away. Do not repeat it. Establish the push path first, while it still costs nothing. [clone + unshallow + dry-run push probe steps, then:] You are a fresh session in the LightAISolutions/Sales repo, running the Profiler earnings desk. Read repository-information/profiler-refresh-calendar.json. It is the queue. DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run, oldest nextReport first. Anything left over is due again tomorrow — do not exceed the cap. For each row you take: 1. Verify the report actually published (the row's source names where to look). If it has not, re-date the row with the real date, set confirmed accordingly, and move on — write no dossier. 2. Run the Profiler Command in .claude/rules/profiler-app.md end to end, INCLUDING the news triage step in \"News Triage — Scraper Corpus Bridge\". Use the row's watch[] as the research priorities. CORPUS_TOKEN: [REDACTED — never committed to a public repo, per the prompt's own instruction]. 3. Advance the row: new nextReport (researched), confirmed, source, lastRefreshed, and refresh watch[] where the picture moved. Also: for any row that is unconfirmed and whose nextReport is within seven days, confirm the date and update the row. That is calendar work, not a refresh, and does not count against the cap. Land one commit per run under the repo's normal Pre-Commit / Pre-Push checklists. NEVER write the corpus token into any file, commit message, CHANGELOG entry or pushed artifact — the repo is public via Pages. It belongs in this prompt only. NEVER create, update or delete a Routine/trigger. The calendar is the only schedule. If you find yourself wanting to arm a follow-up, write the date into the row instead. IF NOTHING IS DUE: stand down. [reporting requirements omitted here, satisfied in-session]"

### Changed
- **Refreshed the NOVONIX (`novonix`) dossier to `profileVersion` 2** (v1 archived to `live-site-pages/profiler-data/archive/novonix.profile.v1.json`) — the sole due row on the Profiler earnings desk queue (`nextReport` 2026-09-14, a Nasdaq minimum-bid-price compliance deadline, not an earnings date). Verified via two parallel research subagents (first-party SEC EDGAR + IR sources, third-party trade press/market-data corroboration) plus the Scraper news corpus: the 2026-09-14 Nasdaq cure deadline passed with the compliance outcome still **unconfirmed by any primary source** as of 2026-09-22 (price data makes mechanical compliance likely but is explicitly not treated as a substitute for a Nasdaq determination); a Yorkville funding-agreement amortisation event triggered 2026-09-10 (ASX VWAP below the A$0.12 floor), obligating a US$7.0m redemption due 2026-09-21 whose payment is not yet independently confirmed; a non-binding MOU with ACP Technologies, LLC (2026-09-16) for a domestic pitch-coated synthetic graphite anode material; interim customer (Panasonic) testing feedback on the June C-sample (2026-09-10): 12 of 14 specification parameters met; and a 2026-09-18 anonymous-source closure claim publicly denied by CEO Mike O'Kronley as "unequivocally false" after the company confirmed dismissing a contractor. Resolved the registered-office address discrepancy flagged in the prior version (71 Eagle Street confirmed current; 66 Eagle Street was stale third-party LEI data). Added 8 new sources; updated `strategyRead` (Yorkville mechanism, collection gaps, indicators to watch), `policyExposure` (Nasdaq regime), and the `panasonic` relationship entry accordingly
- **`profiler-companies.json`** — `novonix` registry entry re-synced via `sync-profiler-registry.py` (`lastUpdated` → 2026-09-22, `srcTotal` 69 → 76) and tagline updated to reflect the Yorkville amortisation event and the still-unresolved Nasdaq deadline
- **`profiler-data/profiler-graph.json`** — rebuilt via `build-profiler-graph.py` (1,482 edges, 1,107 curated)
- **`profiler-data/archive/archive-index.json`** — `novonix` entry added (v1 archived 2026-09-22)
- **`profiler-refresh-notes.json`** / **`profiler-refresh-calendar.json`** — `novonix` row converted from the one-time Nasdaq-deadline date to the ordinary quarterly-activities cadence per the row's own prior instruction: `nextReport` → 2026-10-29 (Q3-2026 quarterly activities report, inferred from the established cadence, `confirmed: false`), `lastRefreshed` → 2026-09-22; `source` and `watch[]` rewritten to record the still-open Nasdaq determination and Yorkville-payment-confirmation items, the two new watch items (ACP Technologies MOU, the closure-rumor denial), and the resolved registered-office item

## [v07.15r] — 2026-09-22 07:40:08 AM EST

> **Prompt:** "Run E2 — the poller and events sync — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.10 is the brief (follow its reading list in order, then its six build steps exactly), §5.3 the design, repository-information/EVENTS-SCHEMA.md §1 / §3 / §4 / §7 the shapes. E0 (v06.95r), E1 (v07.08r), B (v07.10r) and N3 (v07.14r; Events.html v01.04w, Events.gs v01.03g) are Done in §11. Build the weekly no-AI poller in Events.gs (evPollRun_ — the roster and the registry read from their Pages URLs with UrlFetchApp, JSON-LD and ICS sources only, blocked and manual rows never fetched, the six diff kinds written as Proposed rows deduplicated on source · slug · change · after, a failed source an audit row and nothing else), the admin Proposed panel on Events.html (Approve / Reject through eop=decide, Approved → copy as JSON, Mark applied, the Polls tab's last outcome per source, eop=installpoller idempotent), the events sync session command in a new .claude/rules/events-app.md (apply the approved JSON to events.json, advance lastConfirmed and the roster's lastProbe, rebuild events.ics, gate on check-events-registry.py exit 0, list the pr- ids to stamp), and scripts/check-events-poller.js, a Node sandbox harness proving the six diff kinds, the zero-row re-run, the never-fetched rows and the admin refusals with zero live calls. No score (E3), no signals (E4), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, node scripts/check-events-poller.js, python3 scripts/check-events-registry.py, python3 scripts/check-readme-tree.py and scripts/verify-events-roles.py (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, spreadsheet id or trigger id; CHANGELOG entry; README tree entries; EVENTS-SCHEMA.md §5 and §7; register the rules file in CLAUDE.md; flip §11's E2 row to Done with the versions and write the E3 brief as §13.11. Then hand off in chat: redeploy, Install poller, Poll now, approve a row, run events sync in a fresh session. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 85/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E3, and remember session."

### Added
- **E2 — the poller and `events sync` (design plan §5.3; §13.10 all six steps; §11's E2 row → Done).** `Events.gs` v01.04g / `Events.html` v01.05w
- **`Events.gs` — the poller** (`evPollRun_`, the block after the bridge): the roster (`EV_ROSTER_URL`) and the registry read once per run from their Pages URLs with `UrlFetchApp` (never a GitHub host); `evPollSkipReason_` keeps every `blocked`, `cadence: manual`, `html` / `manual`-feed, `robots: disallowed` or non-http row from ever being fetched; per source `muteHttpExceptions` + `followRedirects` + a try/catch, a 15-second allowance against a 270-second run budget that stops cleanly before a source that could overrun it (`EV_POLL_SOURCE_BUDGET_MS` / `EV_POLL_TOTAL_BUDGET_MS`), a 2 MB body cap; **JSON-LD** — every `<script type="application/ld+json">` block parsed on its own, arrays / `@graph` / `subEvent` walked, `@type` `Event` or any `…Event` subtype, `eventStatus` `EventCancelled`, the local date from the first ten characters of `startDate` / `endDate`, venue · city · region · country from the `Place` (`evParseJsonLd_`); **ICS** — a minimal RFC 5545 walker (`evParseIcs_`: unfold, `VALUE=DATE` exclusive `DTEND` moved back a day, `TZID` date-times keep their date, `SUMMARY` / `LOCATION` / `URL` / `UID` / `STATUS`, the four text escapes) that accepts what `evVevent()` and `build-events-ics.py` emit; the §1 slug reproduced (`evDeriveSlug_` — the series base plus the year, a year already in the name not doubled); the match (`evMatchRegistry_`: derived slug → same name or URL among the rows citing the key → same series base in another year → new) and the six diffs (`evDiffItem_`: `cancelled` · `moved-dates` · `changed-venue` · `changed-url` · `new-edition` with the §3 row seeded from the previous edition · `new-event` with nothing invented), Before · After as canonical JSON, deduplicated on (Source Key, Event Slug, Change, After) over every existing row whatever its status (`evProposedKeys_`); a failed or non-2xx source writes no proposal — one `Polls` row and one `events_poll_source_failed` audit row (status only); the run audit row counts only
- **`Events.gs` — the ops** (`action=events`, behind `evRequire_(sess, 'roster')`): `eop=proposed` (pending + approved rows with parsed Before / After, counts by status, the newest `Polls` row per source, whether the trigger is installed), `eop=decide` (`approved` / `rejected`, Decided At; reversible until applied — `already_applied` after), `eop=applied` (comma ids + `vXX.XXr` → `applied` with Applied In; a non-approved id skipped as `not_approved`), `eop=pollnow` (the same walk, audited as the admin), `eop=installpoller` (idempotent — every trigger on `evPollTick` or `evPollRun_` deleted, one weekly Monday 06:00 America/New_York created; the handler is the public `evPollTick()` because a time-driven trigger cannot target a `_` function); `Polls` (Source Key · Ran At · Status · Items · Newest Start) added to `EV_TABS`
- **`Events.html` — the Proposed tab** (admin · `roster`; a third tab in the strip, painted only for the admitted tier): the poller card (trigger state badge, Install poller, Poll now, Refresh, the status line, the last outcome per source with a failed status marked), the approved set as the `events sync` JSON (`evSyncJson` — `schemaVersion` 1 · `proposals[]` · `polls[]` — in a field for copying by hand and behind Copy as JSON, the version box and Mark applied → `eop=applied`, the queue counts), the pending and approved rows grouped by source with Before → After (`evDiffList`), Approve / Reject → `eop=decide`, the evidence link; loaded when the tab is opened, on Refresh and after every write — never polled (D14); a write's status survives the reload that follows it (`evReloadWith`)
- **`.claude/rules/events-app.md`** — the `events sync` session command (path-scoped to `Events.html` / `Events.gs` / `events-data/**` / `EVENTS-SCHEMA.md`, user-triggered by "events sync"): the input shape, the nine-step procedure (unshallow → read → apply per change kind → advance the roster's `lastProbe` → sort and stamp → `build-events-ics.py` → `check-events-registry.py` exit 0 as the gate, reverted on a finding → the `pr-` ids and the version to stamp → commit under the checklists), the never-list, the first-live-cycle hand-off; registered in CLAUDE.md as `## Events Sync Command` and in the Reference Files table
- **`scripts/check-events-poller.js`** — the Node sandbox harness: the real poller functions of `Events.gs` under stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService` / `ScriptApp` / `Utilities`, a fixture registry and roster served from the stub, one JSON-LD page (an Organization block, an array block, a `@graph` with a subtype and a cancellation, a broken block), one ICS feed built by `build-events-ics.py`'s own `calendar()`, a blocked, a manual, an html, a robots-disallowed and a 403 row — **63 checks**: the readers on their own, the six diff kinds one row each with the right Before · After, the zero-row re-run through `evPollTick`, the never-fetched rows, the 403's one `Polls` row + one audit row + no proposal, the five ops refused to an analyst with zero fetches and zero tab opens, decide / applied / already_applied, `installpoller` idempotent (a stale trigger on the old name removed), zero live calls
- **`scripts/verify-events-roles.py`** — the E2 pass on the admin's page against a stateful stub (`PROPOSED_STUB` / `POLLS_STUB`, `eop=proposed` / `decide` / `applied` / `pollnow` / `installpoller`): the tab is admin-only (a turned-away tier has neither the tab nor the panel), opening it issues exactly one `eop=proposed`, the rows group by source with Before → After, Approve reaches `decide` and the panel refreshes, the JSON field parses back to the approved rows and the polls, a bad version is refused on the page, Mark applied stamps both rows and the empty state appears, Install poller and Poll now reach the stub — ALL CHECKS PASSED, zero page errors at 390 × 844; screenshot `events-proposed.png`
- **`repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's E2 row flipped to **Done** (v07.15r, the versions, the first live cycle reported not asserted); **§13.11 written**: the E3 brief (the score, `Tuning`, `eop=recommend`, the Recommended pill and the *why* panel, `scripts/check-events-score.js`, the verifier pass) and its paste-in prompt

### Changed
- **`repository-information/EVENTS-SCHEMA.md`** — §5 gains the `Polls` tab; §7 now records the poller (the never-fetched set, the budget, the two readers, the match, the six diffs, the dedup, the failure path), the five ops and their shapes, the trigger handler, the sync JSON, and the command's apply rules; §12 lists `check-events-poller.js`
- **`CLAUDE.md`** — `## Events Sync Command` section after Industry Guidance; `.claude/rules/events-app.md` in the Reference Files table
- **`README.md`** — `Events.html` v01.05w · v01.04g with the E2 description; `events-app.md` under `.claude/rules/`; `check-events-poller.js` under `scripts/`; the verifier's entry extended
- **`repository-information/SESSION-CONTEXT.md`** — remember session
## [v07.14r] — 2026-09-22 07:15:53 AM EST

> **Prompt:** "Run N3 session 2 — the exports, the drafts and the QR card — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.9 is the brief (steps 5–8 only — session 1's steps 1–4 landed at v07.13r and §11's N3 row reads In progress — session 1), §4.3 the design, repository-information/NETWORK-SCHEMA.md §3 (the Drafts and Mailings tabs and NW_DRAFT_STATUS already exist), §10 / §11 (the hand-off and export formats), §12 / §13 the shapes, and the code you extend: Network.gs nwExportOp_ (session 1's nop=export with format=csv — add xlsx through the Receipts temp-spreadsheet path with Contacts / Accounts / Interactions sheets and vcard hand-rolled, per contact and as one .vcf bundle, PHOTO;ENCODING=b;TYPE=JPEG from the card front only when the user ticks "include card image", base64 folded at 75 octets; every export keeps the D9 do-not-contact exclusion and the recordDisclosure row), nwBulkOp_ / nwListOp_ (the shapes to match), nwInteractionAdd_ (the email-out row a sent draft writes); Network.html nwBar (session 1's action bar — the CSV button becomes an Export menu with the "include card image" tick, the disabled Mailing button becomes Start a mailing), nwEditCard / nwReviewSection (the editor idiom), nwDownloadText (the download helper). Build (6) the follow-up drafts per D15: pick recipients from the selection (Do Not Contact excluded, Consent Marketing = no excluded) → a saved template from the Mailings tab (name, subject, body) or one written now with {{first}}, {{company}}, {{metAt}}, {{lastTopic}} → nop=drafts renders one editable draft per recipient into the Drafts tab (status = draft) → a review list edited in place → hand off by .eml bundle (one RFC 5322 file per draft, From typed once and kept in localStorage, an unsubscribe line and a postal address in the default template), one-column CSV / .txt, per-draft copy (subject + body), or mailto: → nop=draftstatus marks sent (writes the email-out Interaction with the d- id as evidence, sets Sent At) or discarded; the app never sends — no MailApp, GmailApp or Gmail scope anywhere, and the verifier greps the served page and the .gs to assert it. (7) The "My card" panel: the developer's own vCard from the Profiles row, rendered as a QR full-screen — run grep -rn "qrcode\|QRCode\|qr-" live-site-pages/*.html first and reuse an inline generator if one exists, else a minimal byte-mode encoder (version ≤ 10, level M) in the page, no library. (8) scripts/verify-network-roles.py: the vCard bundle parses under a minimal BEGIN:VCARD walker with N / FN / EMAIL per contact, a three-recipient mailing renders three drafts, one edited draft round-trips, marking sent writes the email-out Interaction the stub records, the .eml has From / To / Subject and a body, the QR panel renders a canvas or SVG with a non-trivial module count; zero page errors at 390 × 844. No warmth, no reconnect list, no import panel (N4); no new OAuth scope; never widen a peer token. Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-network-schema.py (extend ALLOWED_KEYS only with count / id keys), python3 scripts/check-readme-tree.py and the verifier (Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Network.html / Network.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, template body or address; CHANGELOG entry; README tree descriptions; flip §11's N3 row to Done with the versions and write the E2 brief as §13.10 before closing. The iOS / Android vCard import and the second-phone QR check are reported in the hand-off, not asserted. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 84/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E2, and remember session."

### Added
- **`Network.gs` v01.10g** — `nwExportOp_` gathers the selection once (`nwExportRows_`: scope, the D9 do-not-contact exclusion, no Raw Extraction) and answers `format=csv` (unchanged), `xlsx` (`nwExportXlsx_` — the Receipts temp-spreadsheet path: Contacts / Accounts / Interactions sheets, JSON columns flattened to `email1…3` / `phone1…3`, Drive links left out, exported through the Drive endpoint, trashed, base64) and `vcard` (`nwVcard_` — hand-rolled 3.0: N / FN / ORG / TITLE / EMAIL;TYPE / TEL;TYPE / ADR / URL / X-SOCIALPROFILE / NOTE / CATEGORIES / REV / UID, RFC 2426 escaping, `nwVcardFold_` at 75 octets; `cards[]` + the `vcf` bundle); every format writes the disclosure row through `recordDisclosure` and audits counts. `nop=mailings` (templates · open drafts · the me fields), `nop=drafts` (`nwDraftsOp_` — a saved template or subject + body, `nwMerge_` over the ten merge fields incl. `{{lastTopic}}` from `nwLastInteraction_` and `{{myAddress}}` from the `NW_POSTAL_ADDRESS` property, one Mailings row per render with the list filter, one Drafts row per recipient, `skipped[]` with `do_not_contact` / `no_consent` / `no_email` / `not_found` / `deleted` / `duplicate` / `bad_id`), `nop=draftstatus` (`draft` = an edit, `sent` = the `email-out` Interaction through `nwInteractionAdd_` with the d- id as evidence + Sent At, `discarded`; `already_sent` afterwards), `nop=mycard` (GET / `set=1` on the Profiles row — Title and Phone columns added to `NW_TABS.profiles`, the header-upgrade idiom appends them). D15 held: no `MailApp` / `GmailApp` / Gmail scope anywhere in the PROJECT region
- **`Network.html` v01.19w** — the bar's CSV button becomes an Export menu (CSV · Excel · vCard bundle · vCards one per contact as a zip · the "include card image" tick — `nwBulkExport`, `nwCardFrontBytes` fetching the front with the user's own drive.file token, `nwVcardWithPhoto` splicing `PHOTO;ENCODING=b;TYPE=JPEG` folded at 75 octets), `nwZip` (a hand-rolled store-only zip with CRC-32) and `nwDownloadBlob`; "Start a mailing" enabled → the follow-up drafts panel (`nwMailPanel` / `nwMailOpen` / `nwMailRender` — recipients from the selection, saved templates + the default template with the unsubscribe line and `{{myAddress}}`, merge-field chips, `nwDraftsPaint` / `nwDraftBlock` edited in place with Save edit, Copy, Mail app (`mailto:`, Copy fallback over 1,800 characters), Mark sent after a confirm that says nothing is sent, Discard; the hand-off row — `.eml` bundle (`nwEmlText`: From / To / Subject (RFC 2047) / Date / MIME-Version / Content-Type / X-Unsent, the From kept in `localStorage`), CSV, `.txt`); the masthead pills Drafts and My card (`nwPillsMount`, admin only); the My card panel (`nwMyCardPanel` — name · title · company · phone through `nop=mycard`, the QR preview) and the full-screen QR overlay; `nwQrMatrix` — a byte-mode QR encoder, versions 1–10 at level M, GF(256) Reed–Solomon, the eight masks scored, format and version information — and `nwQrSvg`; the repo had only QR decoders (`grep -rn "qrcode\|QRCode\|qr-" live-site-pages/*.html`), so no generator was reused
- **`scripts/verify-network-roles.py`** — the stub answers `nop=export` for all three formats, `nop=mailings`, `nop=drafts`, `nop=draftstatus` and `nop=mycard`, and the Drive stub serves a card front for `alt=media`; tests for the vCard bundle under a minimal `BEGIN:VCARD` walker (N / FN / EMAIL per card), the PHOTO splice (one Drive fetch, base64 of the stub JPEG, every line ≤ 75 octets), the per-contact zip, the `.xlsx` bytes, a three-recipient mailing → three drafts with no `{{` left and the template saved, one edited draft round-trip, `mailto:` and Copy, the `.eml` bundle (three RFC 5322 files with From / To / Subject and a body) and the `.txt`, Mark sent → the `email-out` Interaction with the d- id as evidence, Discard, the Drafts pill, My card → the QR (the preview and the full-screen SVG ≥ 29 × 29 modules, the page's matrix equal to python-qrcode's at the same version and mask when importable), and the D15 grep of the served page and the `.gs` PROJECT region; the session-1 CSV test opens the Export menu first; ALL CHECKS PASSED, zero page errors at 390 × 844. Screenshots `network-export-menu.png`, `network-drafts.png`, `network-my-card-qr.png`
- **`repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's N3 row flipped to **Done** (v07.13r + v07.14r, the versions, the iOS / Android import and the second-phone QR reported not asserted); **§13.10 written**: the E2 brief (the poller, the `Proposed` panel, `events sync` in a new `.claude/rules/events-app.md`, `eop=installpoller`, `scripts/check-events-poller.js`) and its paste-in prompt

### Changed
- **`repository-information/NETWORK-SCHEMA.md`** — §3 Profiles gains Title · Phone; §10 the three drafts ops, the `.eml` headers and the zip, the template's out-of-region `sendHipaaEmail` noted; §11 the export op's three formats and the QR encoder; §12 the s2 audit keys; §14 the verifier's s2 scope
- **`scripts/check-network-schema.py`** — `ALLOWED_KEYS` + `mailingId`, `draftId`, `skipped`, `saved`, `sent`, `discarded`, `edited`, `templates` (ids and counts only)
- **`README.md`** — `Network.html` v01.19w · v01.10g with the session-2 description; the verifier's entry
- **`repository-information/SESSION-CONTEXT.md`** — remember session

## [v07.13r] — 2026-09-22 06:46:16 AM EST

> **Prompt:** "Run N3 session 1 — the list, the filters and the bulk actions — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.9 is the brief (follow its reading list in order, then session 1's steps 1–4 exactly; session 2's steps 5–8 are a second session), §4.3 the design, repository-information/NETWORK-SCHEMA.md §3 / §4 / §12 / §13 the shapes. N2 (v06.94r) and B (v07.10r, proven live 2026-09-22 with both peer tokens set; Network.html is now v01.17w after two Source Event default fixes at v07.11r–v07.12r, Network.gs v01.08g) are Done in §11. Generalise the Receipts History card into the Contacts list with search, the eight filters, the four sorts (lastTouch computed server-side once per list, the only widening of the list payload) and per-row expand to the existing detail; add multi-select with a sticky action bar — tag, set relationship / stage, export selection (CSV now; the other formats are session 2), start a mailing (session 2), soft-delete — with nop=bulk validating per row and answering rejected[] like B's signals upsert; extend scripts/verify-network-roles.py for the filters, a two-row tag and the sort flip. No warmth, no reconnect list, no import panel (N4); no new OAuth scope; never widen a peer token. Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-network-schema.py (extend ALLOWED_KEYS only with count / id keys, as N2 and B did), python3 scripts/check-readme-tree.py and the verifier (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Network.html / Network.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries; CHANGELOG entry; README tree descriptions; leave §11's N3 row In progress — session 1 with the versions. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 83/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for N3 session 2, and remember session."

### Added
- **N3 session 1 — the list, the filters and the bulk actions (design plan §4.3; §13.9 steps 1–4; §11's N3 row → In progress — session 1).** `Network.gs` v01.09g / `Network.html` v01.18w. The Receipts History card generalised into the Contacts list; session 2 (exports beyond CSV, the drafts flow, the QR card) is the next session
- **`Network.gs` — `nwListOp_` replaces the inline list branch**: search over name, title, account name and every email (`q`); the eight filters (`relationship`, `stage`, `role`, `segment` against the account's Segment IDs, `event` against Source Event, `tag`, `from` / `to` on Met Date, `consent`), applied server-side because the columns they read (Emails, Tags, Consent Marketing) are picked by `nwListRows_` under `_`-prefixed keys and **dropped before the answer** — the list payload widens by exactly one field, `lastTouch`, the newest Interaction `Date` per contact from one read of the tab (`nwLastTouch_`), per §12; an off-list enum or a malformed date answers `bad_filter`, never a silently ignored filter; `total` and `filtered` ride on the response so the page can read "2 of 5"; the audit row carries matched / total / accounts / a filtered flag
- **`nop=bulk`** (`nwBulkOp_`, body-POST, ≤ 500 ids): `op=tag` appends a lowercase tag to each contact's Tags (already there → `unchanged`; 20 already → `too_many_tags`); `op=account` sets `relationship` and / or `stage` on the selected contacts' accounts, each account validated once through `nwAccountFromPayload_` (the D5 rule — `STAGE_NEEDS_TARGET_OR_CUSTOMER` refuses that account, never applied half-way; a relationship moved off Target / Customer with no stage asked for resets the stage to None as the editor does) and memoised across its contacts. Every id is judged on its own — `bad_id`, `duplicate`, `not_found` (an unowned row answers not-found, never forbidden), `deleted`, `account_not_found`, the validator's word — and answered in `rejected[]` with its reason, the shape of B's signals upsert; `applied` / `unchanged` / `accounts` are counts; `bumpDataRev()` only when something was written
- **`nop=export`** (`nwExportOp_`, `format=csv` — `.xlsx` and vCard are session 2): the selection's ids (or, with none, every live contact in scope) as RFC 4180 text — every field quoted, CRLF rows, 24 columns (`NW_CSV_COLUMNS`) including the account's name / relationship / stage and Last Touch; a Do Not Contact row is left out (D9) and Raw Extraction never exported; **a disclosure row is written through the template's `recordDisclosure`** naming the op, the row count and the ids (never a field), and the audit row carries `rows` / `excluded` / `ids`. The page prepends the UTF-8 BOM when it builds the download
- **`Network.html` — the list tools** (`nwListTools`): the search box (Enter or Search; the request carries `q=`), the Filters drawer (collapsed until opened, its state kept across refreshes; the hint reads "2 on: role, consent"; relationship / stage / role / consent from `NW_ENUMS`, segment from `profiler-segments.json` through `nwSegments()`, source event with a `datalist` of the events on the rows shown, tag, met from / to; Apply and Clear), the sort strip (Last touch · Name · Company · Warmth — Warmth present and disabled until N4; a key starts in its natural order, newest first or A → Z, and the flip button reverses it; sorting is the page's over what every row carries, so a sort issues no request) and the select-all box. `nwContactRow` gains a checkbox (its click never opens the detail) and the `last touch` line; the count tile reads "N of total · contacts match" while a filter is on; an empty filtered list says so instead of "No contacts yet"
- **The action bar** (`nwBar`, one element fixed to the bottom of the screen, opened by the first tick): "N selected · Clear"; **Tag** (an inline form → `nwBulkTag`), **Relationship** (relationship + stage selects with "keep" options and the D5 gate mirrored — `NW_STAGE_RELS` pins the stage to None off Target / Customer → `nwBulkAccount`), **CSV** (`nwBulkExportCsv` → `nop=export` → `nwDownloadText` with the BOM), **Mailing** (disabled — session 2), **Delete** (`nwBulkDelete`: a confirm naming the count, then the existing `nop=delete` one request per row). Rejected rows are read back as "2 rejected: a stage needs a Target or Customer relationship ×2". The selection is a map pruned to the rows shown on every paint; `nwSelectSync` updates the boxes in place so an open detail stays open while the selection changes; every write refreshes the list (D14) and clears the selection
- **`scripts/verify-network-roles.py`**: the stub's `nop=list` applies the search and the eight filters as `nwListOp_` does and carries `lastTouch` / `total` / `filtered`, and answers `nop=bulk` (per-row `rejected[]`) and `nop=export` (the CSV); the tests drive the search ("1 of 5", `q=` on the request), the drawer (role; role + consent with the hint; segment; source event; tag; Clear), the sort (Name A → Z, the flip reverses it, no request issued, Warmth disabled), the multi-select (two rows ticked while a third's detail stays open), the two-row tag through `nop=bulk`, a stage alone on two Partner accounts refused per row then Target · Discovery on both (the bar's gate pins the stage for a Supplier), a real CSV download (BOM, header, two CRLF rows) and a bulk delete after a confirm naming the count; zero page errors at 390 × 844; screenshots `network-list-filters.png` and `network-list-bar.png`. ALL CHECKS PASSED
- `scripts/check-network-schema.py`: the audit-key allow-list gains five count / flag keys (`total`, `filtered`, `applied`, `unchanged`, `excluded`); exit 0 — 23 `auditLog` calls in the PROJECT region

### Changed
- `NETWORK-EVENTS-DESIGN-PLAN.md` §11: the N3 row → **In progress — session 1** with the versions; `NETWORK-SCHEMA.md` §12 records the N3 list widening, the bulk audit shape and the export disclosure row
- README tree: `Network.html` (v01.18w · v01.09g) description gains N3 s1; `verify-network-roles.py` and `check-network-schema.py` descriptions extended

### Fixed
- **A mid-session finding on the version pair.** With the page's `<meta build-version>` bumped and `Networkhtml.version.txt` not yet, the page's first-load staleness check reloaded once and the aborted list request fell back to GET — the verifier's "exactly one list request" caught it. Both files were bumped together, as [PC-HTML-VERSION] #2 requires; nothing in the page changed

## [v07.12r] — 2026-09-22 06:05:50 AM EST

> **Prompt:** "I see the "Starred today - tap to use" pill underneath "Save Changes". Is that the most logical place to put that? What is it supposed to do or mean?"

### Fixed
- **`Network.html` v01.17w — the Source Event row lands under its field.** `nwSourceEventDefault` appended the row to the form when the `nop=eventstoday` answer arrived, and by then `nwEditCard` had already re-inserted the Save / Cancel actions as the form's last child, so the row rendered below the buttons (the developer's screenshot). `nwReviewSection` now passes the Where-and-when grid as an anchor and the row is inserted directly after it; the `.nw-evdef` rule drops the `grid-column` span (the editor is not a grid) for a plain block with a bottom margin

## [v07.11r] — 2026-09-22 05:56:25 AM EST

> **Prompt:** "pills read v01.08g and v01.03g. However, I am confused about how Step 4: the live check is supposed to happen. I starred an event in Events whose dates include today, but am not sure what to do in Network. Should I click on one of my saved contacts or do I have to scan a new card? If I must scan a new card, that seems illogical and I would like you to resolve that. If my understanding is completely wrong, then give me step by step instructions on what to do here."

### Fixed
- **`Network.html` v01.16w — the Source Event default no longer fills a saved contact's editor.** The developer's question exposed a real flaw in v07.10r: `nwEditCard` serves both a held (freshly scanned) card and a saved contact opened from its detail (`opts.host`), and `nwReviewSection` runs the same default for both — so editing an old contact whose Source event was empty would have had it silently filled with today's show. `nwEditCard` now stamps `form.dataset.saved` when it opens with a host, and `nwSourceEventDefault` reads it: a fresh scan keeps the prefill (one event) / pills (several); a saved contact's editor always gets the offer row ("Starred today — tap to use") with one pill per event and never a fill. This also gives the live check a path that needs no new card: open any saved contact → Edit → the row appears under Source event

### Notes
- Verified with `node scripts/check-gas-inner-scripts.js`, `python3 scripts/check-readme-tree.py` and `scripts/verify-network-roles.py` (the stub still answers `not_configured`, so the editor flow is unchanged); the bridge harness is untouched (no `.gs` change)

## [v07.10r] — 2026-09-22 05:05:03 AM EST

> **Prompt:** "tabs are there, run B from §13.8"

### Added
- **B — the bridge (design plan §6; §13.8 the brief; §11's B row flips to Done).** `Network.gs` v01.08g / `Network.html` v01.15w / `Events.gs` v01.03g / `Events.html` v01.04w. The first private server-to-server route in the program, built as copies of `Profiler.gs` `guidanceMentionsProxy_()` and Classroom's `clHandleGuidancePeer_()`
- **The far sides** — `Network.gs` `nwHandlePeer_` (`?action=peer&t=<NETWORK_PEER_TOKEN>&nop=accounts|signals`) and `Events.gs` `evHandlePeer_` (`?action=peer&t=<EVENTS_PEER_TOKEN>&eop=today|starred|signals`), dispatched in both `doGet` and `doPost` **before** session validation. The property is `.trim()`-ed on read; every one of the six token-boundary cases (property unset, sub-16-character property, `t` absent, `t` empty, wrong token, unknown op) answers the same flat `{ success:false, error:'denied' }` with zero spreadsheet reads — the tab handle is opened only after the token has matched. **`not_configured` is the calling side's word** (its own property under 16 characters), exactly as Classroom's far side reasons: the two refusals are identical on purpose so a probe cannot tell an unconfigured project from a wrong guess. A throw inside an op is answered as JSON `peer_failed` rather than Apps Script's HTML exception page
- **The four ops.** `nop=accounts` (GET): live Accounts with `relationship` ∈ target · customer · partner · channel, scoped to the `owner` as `resolveOwnerSet_` scopes a signed-in user's own rows — id, name, slug, relationship, stage, segments, tags; no contacts, emails, notes, HQ, and the owner column is not echoed. `nop=signals`: **POST with a JSON body** upserts on (`accountId`, `eventSlug`, `kind`, `evidenceUrl`) — a re-run refreshes `Last Seen` / `Confidence` / `Note` instead of duplicating; `kind` against `NW_SIGNAL_KINDS`, the account must be live and the owner's, a LinkedIn or `lnkd.in` evidence host is `linkedin_not_fetched`, rows are written `Source = events` with `s-` ids; per-row indexed `rejected[]`, one bad row never fails the batch; **GET with `accountId`** is the read leg Events' read-through proxies. `eop=today` / `eop=starred`: the owner's Stars joined to the public registry — `Events.gs` fetches `https://lightaisolutions.github.io/Sales/events-data/events.json` once per execution with `UrlFetchApp` (derived from `EMBED_PAGE_URL`; never a GitHub API host), today decided in **each event's own `tz`** via `Utilities.formatDate`; `eop=signals` relays Network's read leg for one account with each row's name and start attached
- **The near sides** — `nwEventsProxy_(eop, params)` and `evNetworkProxy_(nop, params, body)`, `guidanceMentionsProxy_` verbatim with the peer's `/exec` pasted as a constant from the peer's `.config.json` (`EVENTS_PEER_EXEC`, `NETWORK_PEER_EXEC`): `not_configured` under 16 characters, `muteHttpExceptions` with `upstream_http_<code>`, `upstream_unreachable` on a throw, and `upstream_not_json` with a 160-character snippet for an exception page served as HTML at HTTP 200; a `body` on Events' side makes a JSON POST. Called only past the user's own door: `nop=eventstoday` in `handleNetworkOp_` after `validateSessionForData` + `nwRequire_`, `eop=netaccounts` in `handleEventsOp_` after `evRequire_(sess, 'recommend')` (E3's input, wired server-side now)
- **The first use — `Network.html`**: the review section's Source Event field defaults from `nop=eventstoday` (one request per page load, made only when a review section opens — never on load, never polled): prefilled when exactly one starred event is on today, a pill row when several, untouched when none or while not configured; a value already typed is never overwritten; N1's free-text field stays as the fallback and the override. `Events.html`: the one-line "Connect Network to score by account" placeholder on the sheet that E3 replaces, no request of its own; both pages' error text knows `not_configured`
- **`scripts/check-peer-bridge.js`** — a Node sandbox harness over both `.gs` files (the `check-guidance-migration.js` idiom: the real functions lifted by name into two isolated VM contexts with stubbed `PropertiesService`, `SpreadsheetApp` (an in-memory spreadsheet), `UrlFetchApp`, `Utilities`, `Session`): **61 checks, exit 0** — for each far side the six boundary cases (plus no parameters at all) return flat `denied` with zero `openById` and zero `fetch` and nothing audited; a correct token reaches the op; the accounts filter, the signals upsert (written 1 → updated 1, the five rejection reasons indexed, `Source = events`, `First Seen` kept), the read leg, `eop=today` / `starred` over the **committed registry** with the calendar pinned to 2026-09-22, `eop=signals` joined; both near sides map a sub-16 property to `not_configured`, HTML-at-200 to `upstream_not_json` with a snippet, a non-200 to `upstream_http_<code>`, a throw to `upstream_unreachable`, and the JSON POST leg carries the body; no audit row carries the token. The function extractor skips comments (an apostrophe in a comment had ended a "string") and the constant extractor allows a trailing `//` comment
- `scripts/check-network-schema.py`: the audit-key allow-list gains the bridge's five count/flag keys (`written`, `updated`, `rejected`, `events`, `ok`); `scripts/verify-network-roles.py`'s stub answers `nop=eventstoday` as the real backend does while the tokens are unset (`not_configured`), so the editor flow is unchanged
- `NETWORK-EVENTS-DESIGN-PLAN.md`: §11's B row → **Done**; **§13.9 the N3 brief** (two sessions: the list, filters and bulk actions, then exports, drafts and the QR card) with its paste-in prompt

### Notes
- **REPO-ARCHITECTURE.md unchanged** — the flowchart draws no GAS-to-GAS edge for the existing Profiler → Classroom guidance route either, so the bridge adds none
- **Hand-off (the developer's):** set `NETWORK_PEER_TOKEN` and `EVENTS_PEER_TOKEN` to one random 16+ character value each, the same value in **both** projects' Script Properties (never committed, never quoted back); the merge's `Deploy Network` / `Deploy Events` steps pull both scripts (a deployment that predates its first webhook still needs Manage deployments → Edit → New version once); then star an event dated today and open the scan card's editor

## [v07.09r] — 2026-09-22 04:14:18 AM EST

> **Prompt:** "record the Events ids:
> SPREADSHEET_ID=<1MhaF8mdVyOljcswv_vwJ82ZW4Co-U9UHNXG39i5tCOw>
> DEPLOYMENT_ID=<AKfycbyI_SRS7Q3msirnY_UDx6Dz0jK75Onr9P0yocHGovnuIQlpHLIiSmvrpeyruhP3QaG_EQ>"

### Changed
- **Events is deployed — the two ids are recorded the N0 way.** `googleAppsScripts/Events/Events.config.json` now carries the real `SPREADSHEET_ID` and `DEPLOYMENT_ID` (the angle brackets in the prompt were delimiters, not part of the values), synced per [PC-GAS-CONFIG] #14: `Events.gs` v01.02g (`SPREADSHEET_ID` / `DEPLOYMENT_ID` vars — `ensureEventsTabs_()` no longer throws `SPREADSHEET_NOT_CONFIGURED`, and `registerSelfProject()` now writes the real deployment URL into the Global ACL), `Events.html` v01.03w (`var _e` is the reversed-then-base64 `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`, so the GAS iframe mounts and the Stars ops reach the backend). The `Deploy Events` workflow step reads the id from the config at merge time — no workflow edit — so this push's merge fires the first self-update webhook against the live deployment
- README tree: the Events page line reads v01.03w · v01.02g
- **B (the bridge, §13.8) is unblocked** — its brief stops on placeholder ids; both are real from this push

### Notes
- The N0 bootstrap lesson still applies: the code deployed by hand before this push cannot repoint its own deployment on the first webhook run — if the merge's `Deploy Events` step warns "self-update unconfirmed", do Manage deployments → Edit → New version once by hand, then later merges self-update
- §13.7 step 8 (the real-phone Calendar / `.ics` check) remains the developer's to report; nothing in this push asserts it

## [v07.08r] — 2026-09-22 02:00:16 AM EST

> **Prompt:** "Before I run E1 session 2, give me step by step instructions on how to deploy Events and get the two ids that you will ask me for in session 2.
>
> Run E1 session 2 — the published calendar and the phone pass — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.7 is the brief (steps 5–8 only — session 1's steps 1–4 landed at v07.07r and §11's E1 row reads In progress — session 1), §5.3 the design, repository-information/EVENTS-SCHEMA.md §9 and §12 the shapes, and live-site-pages/Events.html / googleAppsScripts/Events/Events.gs the code you extend (the evIcs() / evVevent() functions are the per-event RFC 5545 text; the published file must be byte-compatible with them). Build: (5) scripts/build-events-ics.py writing live-site-pages/events-data/events.ics — every confirmed event, X-WR-CALNAME: BESS/AIDC events, the same stable UID:<slug>@events.lightaisolutions.github.io, 75-octet folding, CRLF — run it, wire the .ics walk into scripts/check-events-registry.py (exit 0), and add a Subscribe pill on the masthead offering the webcal:// URL of the published file with a copy fallback; (6) the read-only day-plan tab as a timeline of the starred events on a chosen day (E5 fills it); (7) the Playwright pass at 390 × 844 in scripts/verify-events-roles.py — the month header sticks, the agenda scrolls past a month boundary and the header changes, the sheet opens and closes, a star round-trips through the stub, one event's ICS text parses (a minimal VEVENT walker), the Google Calendar href carries dates= / ctz=, screenshots of month / agenda / detail, zero page errors; (8) the real-phone Calendar / .ics check is reported in the hand-off, not asserted. Keep the Network UI family; no poller, score, signals, plans or bridge. If Events.config.json still carries YOUR_SPREADSHEET_ID / YOUR_DEPLOYMENT_ID, ask me for both before the phone pass and record them the N0 way ([PC-GAS-CONFIG] #14 syncs the .gs and the page's _e); if they are real, leave them. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, the verifier and the registry checker. Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries; CHANGELOG entry, README tree entries for events.ics and build-events-ics.py; flip §11's E1 row to Done with the versions and write the B brief as §13.8. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG rotated at v07.07r (Sections: 78/100) — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for B, and remember session."

### Added
- **E1 session 2 — the published calendar and the phone pass** (§13.7 steps 5–8; §11's E1 row flips to **Done**). `Events.html` v01.02w; `Events.gs` untouched at v01.01g (no server change in steps 5–8 — the brief's own rule is "bump only files you edit")
- **`scripts/build-events-ics.py`** → `live-site-pages/events-data/events.ics`: every `confirmed` registry event (72 of 100) as one RFC 5545 `VEVENT`, byte-compatible with the page's `evIcs()` / `evVevent()` — the same header lines (`PRODID`, `METHOD:PUBLISH`, `X-WR-CALNAME: BESS/AIDC events`), field order, `\\ \; \, \n` escaping, 75-octet folding (74 on a continuation line), CRLF, stable `UID:<slug>@events.lightaisolutions.github.io`; `DTSTAMP` is the build time (`--stamp` fixes it), `--check` exits 1 when the file is stale against `events.json`. Rebuilt by `events sync` (E2) after every registry write
- **`.gitattributes`: `*.ics -text`** — the repo normalises every text file to LF on commit, which would have silently turned the calendar's CRLF into LF in the blob; the rule keeps the bytes as written (`git ls-files --eol` reads `attr/-text`)
- **`Events.html` — the Subscribe pill** on the masthead (admitted tier only): a card offering the published file as a `webcal://` URL derived from the page's own location (a relative path on the same Pages site — never a GitHub host, [PC-PRIVATE-REPO] #18), a Copy button through the clipboard with the URL in a read-only field as the by-hand fallback (Android's Google Calendar has no `webcal` handler — it wants the URL pasted under *From URL* on the web), a one-time download of the whole file, and the how-to line
- **`Events.html` — the Day plan tab** (`Agenda | Day plan` strip above the counts): a read-only timeline of the starred events spanning a chosen day — a date picker, a Today pill, a scrolling strip of the upcoming starred days, and per entry the venue's `hours[]` for that date where the registry has them (else *All day*), *day N of M*, name with the attending badge, venue · place · kind, the note; tap opens the sheet. Empty states for "nothing starred on this day" and "nothing starred yet"; the footnote says E5 fills it. The masthead's month label follows the chosen day while the tab shows
- **`scripts/verify-events-roles.py` — the phone pass** at 390 × 844 for the admin, after session 1's checks: the month header sticks (`position: sticky`, pinned at its declared top, its month name clear of the template's fixed user pill) while its tallest month scrolls; scrolling past the boundary into the second month changes the month-in-view label; the sheet opens for the first confirmed upcoming event and Escape closes it; the Google Calendar href is the `action=TEMPLATE` URL with `dates=` / `ctz=`; that event's `evIcs()` text parses under a minimal VEVENT walker in the verifier (CRLF, ≤ 75 octets per line, UID / DTSTART / DTEND / SUMMARY) with DTSTART / DTEND equal to the href's `dates=`; its `evVevent()` block is **byte-identical** (DTSTAMP aside) to the block for that UID in the published `events.ics`; a star **round-trips through a stateful stub** (the stub now parses the POST body and holds a Stars set: `eop=star` → the refetched `eop=list` carries it → the row lights and the Starred count reads 1 → the Day plan lists it on its first day → `eop=unstar` clears it); the Subscribe pill offers the `webcal://` URL of the published file, Copy leaves a status line, the `http://` twin of the URL serves `BEGIN:VCALENDAR` with `X-WR-CALNAME` and parses; screenshots `events-month.png`, `events-agenda.png`, `events-detail.png`, `events-dayplan.png`; zero page errors. Requests are recorded as `events:<eop>` so the session-1 "exactly one list request on load" assertion still holds
- **`NETWORK-EVENTS-DESIGN-PLAN.md` §13.8** — the paste-in brief and prompt for **B, the bridge**: the far sides in both `.gs` files as copies of `guidanceMentionsProxy_()`'s far side (six token-boundary cases → flat `denied` with zero reads, `not_configured` under 16 characters, before session validation), the four ops, the near-side proxies with the `upstream_not_json` distinction, the scan card's Source Event defaulting from `eop=today`, and a Node sandbox harness `scripts/check-peer-bridge.js`; it stops and asks for the two Events ids if they are still placeholders

### Changed
- **`scripts/check-events-registry.py` — the `.ics` walk is live**: the published file is now required (missing is a finding), must end every line in CRLF with none over 75 octets, carry `X-WR-CALNAME`, one `VEVENT` per confirmed event with UID / DTSTART / SUMMARY, its UID set equal to the confirmed slugs, and each `VEVENT`'s DTSTART / STATUS matching its row. Exit 0 on the committed files: 100 events, 58 roster rows, 256 mentions, 72 VEVENTs
- **`Events.html` — the sticky month header** now carries 40px of paper as top padding so it pins at the top with the month name clear of the template's fixed user pill and no row shows through beside the pill (the first phone-pass screenshot had the header hidden under the pill)
- README tree: the Events page line (v01.02w, the session-2 features), `events-data/events.ics`, `scripts/build-events-ics.py`, and the refreshed descriptions of `check-events-registry.py` and `verify-events-roles.py`

### Fixed
- **`Events.html` `evIcsEscape()`** wrote a bare `;` for a semicolon — the JS literal `'\;'` is just `';'` — so a name or description with a semicolon was not RFC 5545-escaped and would not have matched the builder's output; now `'\;'`. The Playwright byte-identity check would have caught the first such row

### Notes
- **`SPREADSHEET_ID` / `DEPLOYMENT_ID` are still placeholders** — the session ran unattended and the developer's ids were not to hand, so [PC-GAS-CONFIG] #14 had nothing to sync; the step-by-step deploy instructions were given in chat (the N0 list from v07.07r's Notes, expanded), and the ids are recorded on the next push. The Deploy Events workflow step no-ops until then; the live page shows the calendar, the Subscribe pill and the day plan with "Stars are not connected yet"
- **The real-phone check (§13.7 step 8) is reported, not asserted**: once deployed — the agenda opens at today's month; a starred event shows ★ on its row and in the Starred count and appears on the Day plan for its dates; the Calendar link opens Google Calendar prefilled with the dates and the event's time zone; the per-event `.ics` imports; Subscribe on an iPhone opens the Calendar subscription dialog for `webcal://lightaisolutions.github.io/Sales/events-data/events.ics`, and on the web Google Calendar's *From URL* accepts the same URL with `https://`
- **Verification this push**: `node --check` on the `.gs` copy and on the page's extracted PROJECT script clean; `scripts/check-gas-inner-scripts.js` — 11 files, 106 inner scripts parse; `python3 scripts/check-readme-tree.py` — 12 page + 10 GAS displays match; `scripts/verify-events-roles.py` — ALL CHECKS PASSED (three runs: the first surfaced the pill overlap and an oversized footnote, both fixed); `python3 scripts/check-events-registry.py` — exit 0 with the `.ics` walk; `scripts/build-events-ics.py --check` — current
- **CHANGELOG counter** 78 → 79/100 — no rotation due

## [v07.07r] — 2026-09-22 01:08:08 AM EST

> **Prompt:** "Run E1 session 1 — Events scaffold + calendar — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.7 is the brief (follow its reading list in order, then session 1's four build steps exactly — do NOT start session 2's steps 5–8: the published events.ics, the day-plan tab and the phone pass are the next session's), §5.3 the design, and repository-information/EVENTS-SCHEMA.md §1, §2, §3, §5, §9, §12 the shapes. E0 is Done and merged — events-data/events.json (100 events), events-sources.json (58 probed rows) and scripts/check-events-registry.py are on main and the checker exits 0; re-run it at session start to confirm rather than trusting this line. Scaffold Events.html / Events.gs with scripts/setup-gas-project.sh the way N0 did for Network (auth, hipaa, own spreadsheet, PWA manifest with the manifest-src 'self' override on both CSP tags, no service worker, the admin-only door on both sides per D7 with all four tier keys kept, HEARTBEAT_INTERVAL 600 s, no data poll per D14, quotaProbe_ + op=quota inherited from the shared template region), ensureEventsTabs_() for all five §5 tabs (Stars · Plans · Meetings · Proposed · Tuning — create all five now so E2–E5 edit against them, write only Stars in E1), eop=list / eop=star / eop=unstar / eop=note in the PROJECT regions only, then the vanilla agenda scroller over the public registry — fetched by relative URL, never a GitHub endpoint (PC-PRIVATE-REPO #18) — the filter pills with "signals only" present but disabled and noted "from E4", the detail sheet with mentions[] chips deep-linking Profiler.html#<slug>, Add-to-Google-Calendar and the per-event .ics per §9 byte for byte. Not FullCalendar. Keep the Network UI family (paper-and-ink, pill rows, two-half control rows, no ids or confidence numbers on a card); no poller or events sync (E2), no score (E3), no signals (E4), no plans (E5), no bridge (B) — no EVENTS_PEER_TOKEN and no peer ops. Two things E0 learned that the agenda must not paper over: 27 of the 100 rows are `tentative` and 11 of those are from organisers that block non-browser clients permanently, so surface status in the sheet rather than implying every row is firm; and several rows carry an empty city because the organiser publishes none, so the row renderer must tolerate empty city/region/venue without printing a stray separator. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-events-roles.py (mirror verify-network-roles.py; admin admitted, the other three tiers turned away with zero requests, zero page errors at phone width) and python3 scripts/check-events-registry.py (exit 0; the .ics walk stays dormant until session 2 publishes the file). CHANGELOG entry, README tree entries, REPO-ARCHITECTURE.md plus the per-environment diagram the setup script adds; set §11's E1 row to *In progress — session 1* with the versions and write nothing new in §13 (session 2 flips the row to Done and writes the B brief as §13.8) — then hand off in chat what to check on the phone: the agenda at today's month, a starred event, the Calendar link prefilled. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. Current state: the repo is at v07.06r and parallel sessions have been pushing, so restart from origin/main and check git ls-remote before pushing. The repo CHANGELOG stands at Sections: 102/100 with one section dated 2026-09-22 — that is 101 non-exempt against the 100 trigger, so ROTATION IS DUE on your push commit: the oldest date group is 2026-09-16 with 25 sections, rotating it leaves 77 raw / 76 non-exempt and one rotation suffices. Re-derive that arithmetic yourself at session start (the exempt group changes at midnight EST) and deepen the clone before any SHA lookup — the sections due are the oldest and are exactly the ones beyond a shallow horizon. One push.
>
> Then, give me a prompt to paste into a new session (recommend model/effort) to continue the action plan, then remember session."

### Added

#### `live-site-pages/Events.html` — v01.01w
- **E1 session 1 scaffold of the Events app** (design plan §13.7 steps 1–4; §5.3). Generated by `scripts/setup-gas-project.sh` from the auth template (`hipaa` preset, `ACL_PAGE_NAME: Events`, `PORTAL_ICON: 📅`, the fleet `CLIENT_ID`; `SPREADSHEET_ID` and `DEPLOYMENT_ID` left as placeholders — see Notes); ten files created, GAS Projects table row, README tree entries, REPO-ARCHITECTURE nodes, `diagrams/Events-diagram.md` and the `Deploy Events` workflow step registered by the script. The fleet Master ACL id `1kG2K…UvE` set by hand in `Events.gs` and `Events.config.json` (Setup GAS Project Command step 3 — the Global ACL config the script defaults from still carries its placeholder)
- **PWA**: `events.webmanifest` on the `network.webmanifest` shape (`id` / `start_url` / `scope` = `./Events.html`, `display: standalone`), `images/events-icon-192.png` + `-512.png` (Pillow-drawn calendar leaf on the app's navy, `any maskable` on the 512), `<link rel="manifest">`, `theme-color`, `apple-touch-icon` and the standalone metas; the **`manifest-src 'self'` PROJECT OVERRIDE on both CSP tags** (template ships `'none'`); `worker-src 'none'` stays — no service worker (D2)
- **The door, client half (D7 — admin-only)**: `EV_ROLE_CAPS` with all four tier keys (admin holds `calendar` · `recommend` · `plans` · `signals` · `roster` · `tuning`, the other three empty — EVENTS-SCHEMA.md §2), `evRole()` / `evPreviewRole()` / `evEffectiveRole()` / `evCan()` / `evAdmitted()` with only-subtracting `?as=` preview semantics; `evRenderDenied()` paints the turned-away card for non-admin tiers **before any request is issued** — neither the registry nor the stars are fetched for a denied tier
- **The agenda scroller (§5.3 — vanilla, not FullCalendar)**: the page fetches `events-data/events.json` by **relative URL** (plus `profiler-segments.json` and `profiler-companies.json` for display labels only, both optional) and renders `status ≠ past` rows in start order grouped month → day under a `position: sticky` month header, with an `IntersectionObserver` naming the month in view in the masthead and a **Today** pill that scrolls to the current day group; past editions sit behind a "Show N past" fold at the bottom; rows carry name · dates · place · kind with a star toggle — **no ids, no relevance or confidence numbers on a card**. `evPlace()` joins only the parts an organiser publishes, so the 18 rows with an empty city (31 with no region, 68 with no venue) print no stray separator; a webinar with no place reads "Online". A `tentative` row says so on the row and on the sheet
- **Filters** as pills across two-half control rows: kind (the registry enum), region (the state codes carrying ≥ 3 events, from the registry itself, plus "Abroad"), audience segment (from `profiler-segments.json`, a horizontally scrolling pill strip), **★ Starred**, and **"Signals only" present but disabled with the "from E4" note**; a counts strip (upcoming · starred · tentative)
- **The detail sheet** (a bottom sheet on a phone, a centred card on a desk): organiser, venue, where, the status badge (`Tentative — not yet confirmed by the organiser` for the 27 rows E0 could not verify, eleven of them from organisers that block non-browser clients permanently), the kind and series badges, `tierNote` (highlighted for a tentative row), website / registration / exhibitor list / agenda / speakers / floor-plan links where published, the audience segments by name, **`mentions[]` as chips deep-linking `Profiler.html#<slug>`** (company names from the registry, one chip per dossier), and the `sources[]` line with `kind` · `lastConfirmed` · `lastUpdated`; Escape and the backdrop close it
- **Add to Google Calendar** — the §9 template URL (`action=TEMPLATE` · `text` · `dates=<start>/<end+1>` · `location` · `details` · `ctz=<tz>`) — and **Download .ics**: one hand-rolled RFC 5545 `VEVENT` per event, byte for byte per §9 (`UID:<slug>@events.lightaisolutions.github.io`, all-day `DTSTART;VALUE=DATE` / exclusive `DTEND`, `SUMMARY`, `LOCATION`, `URL`, `DESCRIPTION` of organiser · kind · tierNote · registration URL, `CATEGORIES` of segment ids, `STATUS` from the row, `DTSTAMP` / `LAST-MODIFIED`, calendar-level `X-WR-CALNAME: BESS/AIDC events`), `\\` `\;` `\,` `\n` escaping, **folding at 75 octets** (multi-byte characters never split), CRLF line ends, served as a `blob:` download named `<slug>.ics`
- **Stars, attending and notes** on the sheet and the row: `evToggleStar()` over `eop=star` / `eop=unstar`, the **Attending** select (`planning` · `registered` · `attended` · `skipped`) and the **Note** field written through `eop=note` — all body-POST via `evApiBody()` (the Network `nwApiBody` idiom, three attempts, then the GET mirror since a note fits a URL); `evApi()` over `_gasPost` for `eop=list`; before the backend is deployed the calendar still renders and the stars report "not connected yet" instead of an error
- **D14 intervals** in `HTML_CONFIG`: `HEARTBEAT_INTERVAL: 600000`, `DATA_POLL_INTERVAL: 0` with a PROJECT OVERRIDE note — the owner's rows refresh on load, on `visibilitychange` and after every write (`evAfterWrite()`); the registry is never refetched in-session (the version poll reloads the page on a deploy) — paired with the `.gs` per [PC-SESSION-SYNC] #20

#### `googleAppsScripts/Events/Events.gs` — v01.01g
- **The door, server half**: `EV_ROLE_CAPS`, `evRoleOf_` / `evAdmitted_` (`role === 'admin'`) / `evCan_` / `evRequire_` on the Network pattern — every turned-away tier writes a `security_alert` audit row carrying op name and tier only
- **Enums and ids (EVENTS-SCHEMA.md §1, §5)**: `EV_ATTENDING`, `EV_SLUG_RE`, `EV_ID_RE` (`^(st|pl|mt|pr)-[0-9a-z]{13}$`), `evRandomBase36_()` (SHA-256 over `Utilities.getUuid()`, first 8 bytes → 13 base36 digits) and `evNewId_(prefix, takenIds)` collision-checked against the tab — never a slug, a name or a date
- **Tabs**: `ensureEventsTabs_()` creating **all five §5 tabs now** — `Stars` · `Plans` · `Meetings` · `Proposed` (§7 columns) · `Tuning` — plus `Shares` and `Profiles`, exactly the schema's columns in order (`EV_TABS`), frozen row 1, in-place header upgrade; E1 writes only `Stars`
- **Ownership**: `getShareScope_`, `resolveOwnerScope_`, `resolveOwnerSet_` and the not-found-not-forbidden convention copied verbatim from `Network.gs` / `Receipts.gs` (the D7 widening path; `Shares` has no UI in v1)
- **Ops**: `handleEventsOp_()` (`action=events`) wired into `doPost` and the `doGet` `action=api` mirror — `eop=list` answers the owner's `Stars` rows as id · slug · attending · note · updatedAt through `evListRows_()` (the note rides on the list row because the sheet shows it and a per-open detail op would cost an execution each time under D14; nothing about people is in this app); `eop=star` creates the row (Attending defaults to `planning`) or sets Attending, `eop=unstar` deletes it (no `Deleted At` on `Stars` — a star is not a record about a person), `eop=note` writes Note and/or Attending and stars an unstarred event; the slug validated against `EV_SLUG_RE` (never against the registry — the page owns that), Attending enum-validated, the note trimmed to 2,000 characters; audit rows carry the star id, the slug and counts only
- **`op=quota` and `op=aclhealth`** ported verbatim from `Network.gs` (the region N0 defined and Q0 rolled to every project) so `scripts/check-quota.sh` and `scripts/check-acl-health.sh` enrol the project; `PROJECT_OVERRIDES.HEARTBEAT_INTERVAL: 600` (paired with the `.html`)
- **Not built, by design**: no `EVENTS_PEER_TOKEN`, no peer ops, no poller, no `events sync`, no score, no signals, no plans — E2–E5 and B

#### `scripts/verify-events-roles.py`
- The four-tier door check on the `verify-network-roles.py` shape: serves `live-site-pages/`, seeds the page-scoped session the way `saveSession()` writes it, gives the page a stub base URL and answers the fetch transport's load-time heartbeat, then asserts per tier — admin: the agenda over the served registry with exactly one `eop=list` request and exactly one registry fetch, the sticky month header, the month-in-view label, the filter card with the disabled "Signals only (from E4)" pill, no stray separator on any row, the sheet opening on a row tap with the Google Calendar `dates=` / `ctz=` href and the `.ics` download and closing on Escape; contributor / analyst / viewer: the turned-away card, **zero** data requests and **no registry fetch**; `?as=viewer` on admin turns away, `?as=admin` on viewer gains nothing; zero page errors. Phone-width (390 × 844) screenshots per tier plus the detail sheet. **Passes** (99 rows rendered for the admin — the registry's 100 less the one `past` row behind the fold)

#### `live-site-pages/events.webmanifest`, `live-site-pages/images/events-icon-192.png`, `events-icon-512.png`
- The PWA manifest and icons described above

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11: **E1 → In progress — session 1, v07.07r** (what landed, the two placeholder ids, and the four session-2 steps still to run). Nothing new written in §13 — session 2 flips the row to Done and writes the B brief as §13.8

#### `repository-information/REPO-ARCHITECTURE.md`
- Flowchart: `EVENTS_PAGE` and `GAS_EVENTS` nodes and their five edges (added by the setup script); the Flowchart's mermaid.live URL regenerated and decompression-verified (9,569 chars). The file carries no `<details>` copy blocks, so none was mirrored; the per-environment diagram row for `Events-diagram.md` added by the script

#### `README.md`
- Tree: the Events page entry's description, `events.webmanifest`, `scripts/verify-events-roles.py`; version displays Events v01.01w · v01.01g (`check-readme-tree.py`: 0 findings); `Last updated` and `Repo version` refreshed

#### `.claude/rules/gas-scripts.md`, `.github/workflows/auto-merge-claude.yml`
- The Events row in the GAS Projects table and the `Deploy Events` webhook step — both by the setup script; the deploy step no-ops until `DEPLOYMENT_ID` is real

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten at the close of E0 (v06.95r, merged; the repo has since advanced to v07.06r beside it), recording that E1's prerequisite is satisfied and that the CHANGELOG now sits at 101 non-exempt sections with a 25-section 2026-09-16 group due to rotate on the next versioned push; the parallel Opus 5 routines session moved to Previous Sessions and the N2 entry dropped under the two-session cap *(carried from `[Unreleased]` — the "Remember session context" push that wrote it had no version bump)*

### Notes
- **Setup script input** (§13.7 step 1): `PROJECT_ENVIRONMENT_NAME: Events`, auth + `hipaa`, the fleet `CLIENT_ID`, `ACL_PAGE_NAME: Events`. **`SPREADSHEET_ID` and `DEPLOYMENT_ID` are placeholders** — unlike N0, where the developer supplied the spreadsheet id up front, this session was run unattended with no id to hand, so the "own spreadsheet" is the developer's next step: create it (or through the `gas-project-creator` page), paste its id into `Events.config.json` and `Events.gs`, deploy, and record `DEPLOYMENT_ID` the N0 way ([PC-GAS-CONFIG] #14 syncs the `.gs` and the page's `_e`). Until then `ensureEventsTabs_()` throws `SPREADSHEET_NOT_CONFIGURED` and the page says so beside a working calendar
- **Deploy hand-off** (the N0 steps, verbatim for Events): (1) create the Apps Script project and paste `Events.gs`; (2) Project Settings → show `appsscript.json` and set it from `.claude/rules/gas-scripts-reference.md` §"Setup Steps"; (3) link the GCP project and enable the Apps Script API; (4) Deploy → New deployment → Web app → execute as me, access Anyone; (5) record `DEPLOYMENT_ID` and `SPREADSHEET_ID` in `googleAppsScripts/Events/Events.config.json` and sync per [PC-GAS-CONFIG] #14; (6) set `GITHUB_TOKEN` in Script Properties; (7) run any function from the editor and tick every consent checkbox; (8) load `Events.html` once so `registerSelfProject()` creates the `Events` column in the Master ACL's Access tab, tick TRUE for your row, run `clearAllAccessCache`; (9) the N0 bootstrap lesson: code pasted before the deployment exists cannot repoint its own deployment on the first webhook run — Manage deployments → Edit → New version once, by hand
- **What to check on the phone** once deployed: the agenda opens at today's month with the month named in the masthead; a starred event shows ★ on its row and in the Starred pill's count; the Calendar link opens Google Calendar prefilled with the dates and the event's time zone; the `.ics` imports
- **Verification this push**: `node --check` on the `.gs` copy clean; `scripts/check-gas-inner-scripts.js` — 11 files, 106 inner scripts parse; both inline `<script>` blocks of `Events.html` parse; `scripts/check-readme-tree.py` 0 findings; `scripts/verify-events-roles.py` all checks pass with zero page errors (served over localhost at 390 × 844); `scripts/check-events-registry.py` exit 0 (100 events, 58 roster rows; the `.ics` walk stays dormant until session 2 publishes the file)
- **Rotation fired.** 102 sections before this push with one dated today → 101 non-exempt against the 100 trigger; the oldest date group, **2026-09-16 (25 sections, v06.05r–v06.29r)**, moved to `CHANGELOG-archive.md` with all 25 SHAs resolved after the clone was deepened at session start (1,536 commits); 78 raw / 76 non-exempt remain — one rotation sufficed

## [v07.06r] — 2026-09-22 12:08:08 AM EST

> **Prompt:** "fix P9"

### Fixed

#### `scripts/check-classroom-pipeline.py` — the P9 fixture broke on the pipeline’s first watermark advance
- **`--selftest` went 15 fixtures / 1 failure the moment C2 landed its first commit**, and the cause was the fixture, not the check. `mutate_p9` derived its briefing id straight from the ledger: `"briefing-%s" % coveredThrough`. P9’s per-briefing checks key on `new` — the briefings at head absent from base — so once `70a0c488` advanced `coveredThrough` to **2026-09-21**, a date that now carries a **real** `briefing-2026-09-21`, the fixture’s lesson stopped being new. P9’s branch never executed and P5/P7 fired on the section mismatch instead.
- **The fixture had never been wrong before because `lastRun` was `null`** — no run had ever moved the watermark, so the derivation had never landed on an occupied date.
- **Fixed the date derivation, not the assertion.** The fixture only needs to be *at or behind* the watermark, never exactly on it, so it now walks back to a briefing-free date (`2026-09-20` today) under a bounded loop that raises a named `AssertionError` rather than looping forever. Loosening what P9 expects would have retired the check instead of repairing it.
- **Checked whether this was a class rather than an instance:** `mutate_p9` is the only fixture that reads live ledger state, so a targeted fix is the right scope.

### Verified

- `--selftest`: **15 fixture(s), 0 failure(s)** — `ok P9  a briefing at or behind the watermark`, and the positive fixture plus P1–P8 and P10–P13 all still pass.
- C2’s own gates: `check-classroom-content.py` 0 errors / 0 warnings, `node --check`, `check-gas-inner-scripts.js` — all clean, so Wednesday’s run is unaffected.
- `check-classroom-pipeline.py --base origin/main` reports P1 against this working tree, which is **correct**: a developer session edited a path the committer may never touch (§3). A pipeline run diffs its own changes against a `main` that already carries this commit and will not see it — the same shape as the `.github/last-processed-commit.sha` artefact seen while auditing `70a0c488`.

**No rotation:** 102 raw but 78 non-exempt (24 sections dated 2026-09-21 EST).

## [v07.05r] — 2026-09-21 11:16:23 PM EST

> **Prompt:** "I have rebuilt all my routines; verify them and then delete the old ones."

### Added

#### `repository-information/routine-prompts-archive.md` (new)
- **Verbatim prompt text of the four agent-created Routines, archived immediately before deleting them.** A Routine prompt has no export and no version history — delete the Routine and the text is gone.
- **Written because a pre-delete check found the claim "the 21 companies’ priorities live on in `watch[]`" was only mostly true.** All 21 do carry a non-empty `watch[]`, and most match the old prompt almost verbatim, but `crusoe` had been summarised to three short phrases, dropping Abilene, the ~900 MW Microsoft deal, GE Vernova, Bergen and Form Energy. Deleting without archiving would have lost that detail irreversibly.
- **Credential-guarded.** The four prompts were machine-scanned before writing and the written file independently re-scanned; the earnings desk is excluded because its prompt carries a real corpus token and the repo is public via Pages. The first scan fired on C2’s `CORPUS TOKEN: none is supplied` — a false positive, confirmed by inspection and by the absence of any key-shaped run, and the guard was narrowed rather than dropped.

### Verified

#### All ten Routines audited against the live API before any deletion
- Five rebuilt Routines confirmed `created_via: http_api` with the right cron, model and **zero connectors on every one**: earnings desk (weekdays), C2 (Wed, Opus 5), Industry Guidance (quarterly 15th, Opus 5), quarterly check (quarterly 1st, Sonnet 5), opportunity report (monthly 1st, Sonnet 5).
- **The ACL health check is `meta_mcp` and must not be deleted** — it is read-only, never pushes, and was deliberately never rebuilt. `created_via` alone is therefore not a safe delete filter; the rule is `meta_mcp` **minus** the ACL check.
- The repository attachment itself remains unverifiable from the API — `sources` reads empty even on Routines that have demonstrably committed (v06.70r). The **Runs with** card is still the only reliable check.

## [v07.04r] — 2026-09-21 06:26:05 PM EST

> **Prompt:** "make the --check fix. Then, recommend me to either start the three remaining rebuilds now or wait and why."

### Changed

#### `scripts/build-classroom-segments.py`
- **`--check` now separates the two kinds of due.** The 2026-09-21 pipeline run reported 16 of 19 segments due; **15 were `sections differing: none`** — pure pin churn from one rebuilt `profiler-graph`, with a real workload of one. That is a 1:15 signal-to-noise ratio that does not self-clear, and it is the same false-staleness class CLAUDE.md already documents for shallow clones, arriving through a different door.
- Output now groups **section changes — real work** separately from **pin-only**, and the summary carries both counts.
- **Strictly additive, because the format is a contract between two scripts.** `check-classroom-curriculum.py` line 539 parses the summary with `r"(\d+)\s+segment\(s\),\s*(\d+)\s+due"`, so the leading clause is unchanged and the new counts are appended after it; each per-segment line keeps its exact historical wording, which CLAUDE.md quotes. Verified end-to-end: the regex still matches (19, 16) and the consumer renders the new grouping verbatim.
- **What did not change:** what counts as due, the exit code (1 when any are due), and the generation path — confirmed with `--dry-run` leaving `Classroom.gs` untouched. The split is reporting only; `G3` already declines to revise a segment whose sections do not differ, so the behaviour was right and only the report was misleading.

### Fixed

#### A finding the pipeline could not act on itself
- The run that surfaced this closed with *"type `continue with your recommendation`"*, but **`scripts/` appears zero times in the committer contract’s §3 write set, which is closed.** A pipeline run editing the generator would be a P1 violation. Recorded because the report reads as actionable inside that session and is not — a fix here needs a developer session.

### Verified

#### The 2026-09-21 pipeline commit `70a0c488`, audited independently
- Merged to `main`; **7 changed paths, all inside §3**; nothing forbidden touched (no `SESSION-CONTEXT.md`, no `REMINDERS.md`/`TODO.md`, no `Classroom.html`, nothing under `profiler-data/`); ledger watermark advanced off `null`; content checker 0 errors / 0 warnings; pipeline checker **0 findings against the pipeline commit alone**.
- A P1 seen on a first pass was an artefact of testing against current `main`, which includes the auto-merge workflow’s own `.github/last-processed-commit.sha` bookkeeping commit — not the run’s write.

**No rotation:** 100 raw but **79 non-exempt** (21 sections dated 2026-09-21 EST are same-day exempt), and the trigger is 100 non-exempt. The counter reading `100/100` is expected and is not a rotation signal on its own.

## [v07.03r] — 2026-09-21 06:04:03 PM EST

> **Prompt:** "You are one run of the Classroom curriculum pipeline (C2) in LightAISolutions/Sales. Nobody is watching this session and you cannot ask anyone anything. READ FIRST: `repository-information/CLASSROOM-COMMITTER-CONTRACT.md`, `repository-information/CLASSROOM-SCHEMA.md`, `.claude/rules/classroom-app.md`. Then run the contract's own pre-flight (§5.1) — repo identity, a clean tree, a fresh `claude/classroom-pipeline-<YYYY-MM-DD>` branch off a just-fetched `origin/main`, a green `check-classroom-content.py` baseline with its warning count recorded, the gate-surface digest matching the ledger's `gateDigest`, and schema versions still v1/v1. CORPUS TOKEN: <no corpus token> — per §5.1 step 5, skip corpus reads entirely; refresh only from the Pages-served and repo-resident layers, and do not author a briefing from memory in their place. BUDGET: 45 minutes wall-clock and 120 assistant turns. BEFORE COMMITTING, and again immediately before `git commit`, all of these must pass: `check-classroom-content.py` (zero errors, no new warnings), `check-classroom-pipeline.py --base origin/main` (zero findings), `node --check` on a `.js` copy of `Classroom.gs`, and `node scripts/check-gas-inner-scripts.js`. END THE RUN with the §5.4 report verbatim."

### Added

- **briefing-2026-09-21** (tracks) — the first registered briefing edition: eight dated developments across three refreshed dossiers, covering Oracle's Q1 FY2027 print and its restructuring, the Project Jupiter renewable procurement and generation mix, the HPE networking agreement with warrants, IREN's Sweetwater Hub clearing into ERCOT Batch Zero Base Load, and Jinko's Middle East ESS distribution agreement and proposed holding-company rename; inputs: profile:oracle@2026-09-21, profile:iren@2026-09-21, profile:jinko@2026-09-21. All-public stamp, so the edition folds to `tracks` — the analyst-visible public-only edition. `reviewBy` 2026-10-21, the Jinko AGM, which is the nearest dated gate among the items.

### Changed

- **segment-neoclouds** (tracks, unchanged) — IREN's latest normalized annual revenue moved from FY2025 $501m to FY2026 $707m, and the segment timeline picked up the Sweetwater ERCOT item; changed sections: the-numbers, what-moved; inputs re-pinned: profile:iren 2026-08-30→2026-09-21, graph:profiler-graph 2026-09-19→2026-09-21.
- **segment-aidc-developers-and-landlords** (tracks, unchanged) — the same IREN figure moved in this segment's numbers table, its curated edges changed with the graph rebuild, and the timeline picked up Sweetwater; changed sections: the-numbers, what-moved, who-is-connected; inputs re-pinned: profile:iren 2026-08-30→2026-09-21, graph:profiler-graph 2026-09-19→2026-09-21.
- **segment-storage-integrators-and-containers** (tracks, unchanged) — Jinko's policy-exposure row moved and the timeline picked up the Middle East agreement and the proposed rename; changed sections: the-fence, what-moved; inputs re-pinned: profile:jinko 2026-09-05→2026-09-21, graph:profiler-graph 2026-09-19→2026-09-21.

All three revisions were produced by `scripts/build-classroom-segments.py --segment <id>`, the repo's own segment generator, so `revisions[].changed[]` is the generator's differs set rather than a hand-named one.

### Notes

```
CLASSROOM PIPELINE — 2026-09-21 — COMMIT
Covered through: 2026-09-01 → 2026-09-21
Sources seen: 317 fetched · 299 unchanged · 18 moved · 0 unknown
Wrote: briefing-2026-09-21 (tracks) — 8 qualifying items across 3 sources, bar is 3/2; segment-neoclouds (tracks) — IREN normalized revenue FY2025 $501m → FY2026 $707m; segment-aidc-developers-and-landlords (tracks) — same IREN figure plus curated-edge changes; segment-storage-integrators-and-containers (tracks) — Jinko policy exposure moved
Skipped at caps: segment-hyperscalers-and-ai-labs — due on profile:oracle 2026-08-30→2026-09-21, sections differing: what-moved only
Frozen (unknown source): none
Blocked by: —
Needs the developer: 15 segment lessons are due on graph:profiler-graph 2026-09-19→2026-09-21 with "sections differing: none" — left untouched, pins included, per G3; they will re-present next run
Needs the developer: the corpus layer was not read this run (no token supplied), so no corpus: ref was written and no corpus item counted toward the briefing bar
```

Checkers: `check-classroom-content.py` 71 lessons, 8 tracks, 220 gate cases — 0 errors, 0 warnings (baseline 0/0). `check-classroom-pipeline.py --base origin/main` — 0 findings. `node --check` on a `.js` copy of `Classroom.gs` — clean. `node scripts/check-gas-inner-scripts.js` — clean.

Classroom.gs VERSION v01.86g → v01.87g.

## [v07.02r] — 2026-09-21 05:36:22 PM EST

> **Prompt:** "Regarding coverage, I approve of your fix and appreciate that the sweet prompt now reads tiers instead of specific companies so that widening coverage does not force me to rebuild the Routines every time. If I wanted to refresh the relevant dossiers now, how much work would that be?\n\nRegarding the cache levers, is there any way you can automate the process? If not and I need to do some manual work, then give me step by step instructions on what to do."

### Changed

#### `repository-information/profiler-refresh-calendar.json` — 384,240 → 21,576 bytes (−94%)
- **Asked whether lever 1 could be automated, measured the file instead of answering, and found the lever did not need a prompt at all.** `watch` was **66.4%** of the calendar and `source` **31.6%** — **98% between them** — while the queue logic (due-date comparison, tier selection, the cap of three) reads neither. The scheduling fields are ~7 KB of values.
- Payload moved to the new `profiler-refresh-notes.json`; the calendar went to **21,576 bytes and 1,069 lines**, back under the Read tool’s 2,000-line default. **The truncation bug is now retired structurally rather than by instruction.**
- **This makes lever 1 automatic.** A prompt cannot be edited after its Routine is created, so a lever living in a prompt cannot reach an already-rebuilt Routine; a lever living in the data reaches every Routine on its next fire. **The rebuilt earnings desk gets ~94% of the saving with nothing done to it.**
- Verified non-destructive: 177 rows in and out, 177 note entries, every field round-trips byte-for-byte.

### Added

#### `repository-information/profiler-refresh-notes.json` (new)
- Per-company `source` and `watch`, keyed by slug, one entry per calendar row. `profiler-queue.py` joins it per-slug onto the due rows so a run never loads the 369 KB payload whole.

#### `scripts/sync-profiler-registry.py`
- The non-empty check on `source`/`watch` followed them into the notes file, plus a **two-way bijection check** between calendar rows and note entries. Both directions were tested by deliberately breaking them and confirming the checker fires; it is back to 0 findings.

#### `repository-information/PROFILER-SCHEMA.md`
- New **Refresh notes** section; `companies[].tier` documented on the calendar (the field the sweep now selects on); `source`/`watch` rows moved across.

### Fixed

#### Stale figures left behind by the split
- Every "~384 KB / 2,573 lines" claim in `profiler-app.md`, `ROUTINES-OPERATIONS.md`, `profiler-queue.py` and the README tree corrected, and the warning re-pointed at the file that is now the large one. **The general rule was recorded with it: before writing a prompt instruction to work around a file, measure the file — a data fix outlives every prompt that would have worked around it.**

## [v07.01r] — 2026-09-21 04:43:23 PM EST

> **Prompt:** "Regarding the Edit shortcut, I successfully clicked "Edit" on "Classroom curriculum pipeline (C2) - weekly", but there was no interactable repositories field. Thus, the shortcut doesn't functionally work.\n\nRegarding the Routines and AI model, you mentioned that the Profiler earnings desk only goes through 3 companies and the Profiler quarterly check only reads 21 dossiers and refreshes those that move. However, my current Profiler has 177 dossiers. Shouldn't my routines cover all of them? Even if not all of them, I would like you to consider which dossiers are important from Megmeet's point of view (I will most likely join them as a "Senior Sales Manager - SST Solutions" soon) and make sure these relevant dossiers are updated. Also, I would like you to specify Opus 5 as the AI model for Industry Guidance Quarterly and Classroom C2 pipeline as you recommended.\n\nRegarding the cache-read cost, I would like to apply both lever 1 and 2. However, I am not sure how to implement them myself. Can you implement both yourself?\n\nRegarding deleting the old desk, I would like you to delete the old desk that failed earlier today and keep the new desk that successfully pushed. I give permission.\n\nI will tackle rebuilding the Routines afterwards."

### Added

#### `scripts/profiler-queue.py` (new)
- **Lever 1, implemented as a script rather than an inline snippet so it is testable and version-controlled.** `--desk` returns the ≤3 due earnings rows oldest-first, carry-over, the unconfirmed-within-7-days set and the counts the stand-down report quotes; `--quarterly [--tier core|watch]` returns cadence rows past their tier interval. **5,075 bytes against the calendar’s 384,240** — a 76× reduction in what enters a run’s context. Carries an explicit sandbox fallback for the “Code from External” denial observed 2026-09-16.

#### `repository-information/ROUTINES-OPERATIONS.md` (new)
- **Lever 2.** The `## Scheduled Refreshes` section was **186 of `profiler-app.md`’s 347 lines** — Routine wiring, repo-access post-mortems, the A/B proof, cost and model analysis, rebuild prompts. All developer-session material that **no run consumes and every run re-read on every turn**. Moved here; `profiler-app.md` drops **82,893 → 51,571 bytes (−38%)**, leaving a pointer plus the only two facts a run needs.
- Both rebuild prompts rewritten against the script and the tiers, ready to paste.

#### `repository-information/profiler-refresh-calendar.json`
- **A `tier` on every cadence row: 52 `core` (90-day sweep), 33 `watch` (180-day), 0 untiered.** Verified non-destructive — 177 rows before and after, no pre-existing field altered.

### Fixed

#### Coverage — 64 of 177 dossiers were covered by no Routine at all
- **The earnings desk covers the 92 public rows; the quarterly sweep named 21 companies inline; that left 64 cadence rows (36% of the corpus) with no refresh path.** Worst segments: `storage-developers-and-ipps` 26 of 34 uncovered, `aidc-developers-and-landlords` 12 of 30.
- **31 of the 64 sit in Megmeet-adjacent segments**, including the four closest SST peers — `amperesand`, `dg-matrix`, `heron-power`, `novos-power` — all refreshed by hand in named developer sessions on 2026-09-12/19, which is the evidence the gap was being absorbed manually rather than noticed.
- **Root cause was the hardcoded list, not the cadence**: a company list inside a Routine prompt cannot be diffed against the corpus and cannot be edited after a rebuild. Coverage is now read from calendar tiers, so it changes by commit.

#### `repository-information/ROUTINES-OPERATIONS.md`
- **Resolved the v07.00r amendment against a live re-test: the documentation is wrong and the original 2026-09-16 finding stands.** Edit opens without an interactable repositories field; the **Runs with** card shows only environment and model. **Rebuild is mandatory**, and this is not to be re-litigated from the docs a third time.

### Changed

#### Routine configuration (API state, not repo files)
- `Classroom curriculum pipeline (C2)` and `Industry Guidance quarterly review` set to **`claude-opus-5`** per the v07.00r analysis.
- **Old earnings desk `trig_01UyH77BMKJnxzBUZJ11ej6A` deleted** on explicit developer permission — created 2026-09-02, no repository, every run ~30s, no commit ever. The repo-attached desk created 2026-09-19 is retained.

## [v07.00r] — 2026-09-21 03:39:15 PM EST

> **Prompt:** "A few questions:\n- How difficult to execute are my routines? You mentioned that they are currently using the default model which is sonnet 5. Evaluate if sonnet 5 is capable enough for my routines. If not, recommend me a different model to use and why. \n- the biggest expense in my last earnings desk run was cache reading. Is there any way to reduce that?\n- I want to delete the old non-functional earnings desk routines, but am worried I will delete the wrong one. Can you give me a link to the old desk to be deleted? Make things as easy as possible. \n\nThen, give me step by step instructions on how to rebuild C2 and my other routines, if needed."

### Changed

#### `.claude/rules/profiler-app.md`
- **Model selection per Routine, decided on evidence rather than on task difficulty.** Every failure in the 2026-09-16→21 saga was infrastructural, not a run reasoning badly — so the default stays. The test that earns an upgrade is narrow: **can a checker see the failure?** `check-classroom-content.py` and `check-classroom-pipeline.py` verify structure only and cannot tell a real freshness pin from a fabricated one, so a structurally perfect lesson with an invented input passes every gate. **Opus 5 for C2 and the Industry Guidance review; Sonnet 5 for the earnings desk, ACL check, opportunity report and quarterly sweep.**
- **Priced the alternatives on the 2026-09-21 run's real token mix.** Sonnet 5 $13.76 · Opus 5 $34.39 · Fable 5.1 $36.61 · Haiku 4.5 disqualified by arithmetic (200K context against runs of 335K and 361K). Two non-obvious results recorded: **Fable 5.1 lands only 6% above Opus 5**, not the 2× its headline price implies, because its cache reads are $0.25/MTok against Opus 5's $0.50; and C2 on Opus 5 costs ≈$42/month of plan allowance.
- **Reframed the cache-read line and then found the thing actually worth cutting.** 42.9M cache-read tokens billed $8.58 but would bill $85.79 uncached — the cache saved $77 and dominating a long run is what it looks like working. The quantity behind it is the lever: **the 384,240-byte / ~96,000-token refresh calendar is read whole to act on one due row worth ~1,300 tokens**, costing ≈$2.46 a run (~29% of the cache-read bill). Added a tested extraction snippet returning 5,075 bytes instead of 384,240.
- **Found a latent correctness bug while measuring it:** the calendar is **2,573 lines against the Read tool's 2,000-line default**, so a plain Read silently truncates the tail of the queue.
- **Named this file's own cost honestly** — 74,675 bytes at the time of writing, seven edits during this investigation, ≈$1.64 a run in per-turn re-reads alongside CLAUDE.md and PROFILER-SCHEMA.md, with a split proposed for when it next grows.

### Fixed

#### `.claude/rules/profiler-app.md`
- **Corrected the "a Routine's repository can never be edited, it must be recreated" claim, which the current documentation contradicts.** `code.claude.com/docs/en/routines` states that **Edit** changes "the name, prompt, **repositories**, environment, connectors, or any of the routine's triggers." The 2026-09-16 observation predates that reading by five days and looked in the "Runs with" card rather than the menu beside the routine's name. **Four rebuilds were about to be recommended on the strength of a claim that may no longer hold** — the amendment requires a two-minute re-test first, and records `/schedule update` in a local terminal as a second editing surface the MCP tools do not expose. What stands: `create_trigger`/`update_trigger` carry no repository parameter, so no session here can attach one by any means.
- **Corrected the v06.19r `fire_trigger` "prompt-injection refusal" post-mortem.** It was a build behaviour, not an anomaly: before v2.1.213 a fired prompt arrived framed as an untrusted background notification and could be refused. Both the refusal and the compliance were correct for their builds. Retiring the diagnostic was still right; the recorded reason was not.

### Added

#### `.claude/rules/profiler-app.md`
- Two operational facts not previously recorded: Routines carry a **daily per-account run cap** separate from subscription limits (so a duplicate left enabled spends cap as well as allowance), and a lapsed GitHub connection makes a Routine **skip runs for 72 hours and then disable itself** — a second, independent cause of "no repository access" to rule out before re-deriving the whole diagnosis.
- The documented canonical Routines URL, `claude.ai/code/routines`.

## [v06.99r] — 2026-09-21 03:18:20 PM EST

> Also, is it using up any of my weekly Fable usage limit?

### Changed

#### `.claude/rules/profiler-app.md`
- **No — and the reason is worth writing down, because "weekly Fable limit" is not the shape the limit actually has.** Verified on the run's own session record rather than inferred: the 2026-09-21 earnings-desk run shows `last_served_model: "claude-sonnet-5"`. All five committing Routines carry `"model": ""`, so a fired session takes the platform default and not whatever model the developer happens to be authoring in.
- **Fable has no separate weekly bucket.** Per Anthropic's help centre, Fable models *"draw from your plan's regular weekly usage limits and use them faster than other Claude models"*; on Max *"you can use up to 50% of your weekly usage limits on Fable models at no extra cost,"* after which Fable alone moves to usage credits while the rest of the weekly limit stays spendable elsewhere. A desk run therefore spends the **shared weekly all-model limit and none of the Fable half**.
- **Recorded the scheduling consequence, which points the opposite way from intuition:** interactive authoring sessions over 2026-09-19..21 valued at **$27-$179 each** against the desk's $14, and the only `seven_day` / `allowed_warning` rate-limit state in this account's session data sat on a **Fable 5.1 interactive session**, never on a scheduled run. Thinning the desk cadence would not protect Fable headroom. The actionable corollary is the inverse: **pinning a Routine to Fable would start drawing the 50% sub-allocation** - leave a Routine's model unset unless there is a reason.

## [v06.98r] — 2026-09-21 03:05:14 PM EST

> A successful run costs $14? Where does that come out from? My claude console balance?

### Changed

#### `.claude/rules/profiler-app.md`
- **v06.97r's "$14 a run" was true but readable as money out of pocket, which it is not. Corrected.** `get_session`'s `usage.cost_usd` is the **API list-price valuation of the tokens consumed**, not a charge against a balance. Verified rather than assumed: the 2026-09-21 run's 42,896,504 cache-read + 1,072,155 cache-write + 557,346 input + 138,201 output tokens at Claude Sonnet 5 rates ($2.00 / $10.00 per MTok, cache write 1.25×, cache read 0.1×) compute to **$13.76 against a reported $13.86 — 0.75% apart**, which identifies the field beyond reasonable doubt.
- **On a Pro or Max plan that value is drawn from the plan allocation, not billed.** Limits are shared across Claude and Claude Code on a five-hour session window plus a weekly cap; Claude Code uses plan allocation only, and API credits are opt-in requiring explicit consent — so a scheduled Routine never silently spends money. The same run's `rate_limit_info` recorded **`isUsingOverage: false`**, confirming it independently.
- **The scheduling-relevant line, added: cache reads were 62% of the cost** ($8.58 of $13.76, on 42.9M tokens) — the agentic loop re-reading its context every turn. Five committing Routines consume **plan allowance in five-hour windows shared with interactive work**, which is the real constraint to plan around, not a dollar figure.

### Notes

- **Why this correction was worth a version.** The distinction changes a decision that is live right now: four Routines are still to be rebuilt, and "five scheduled jobs at $14 each" reads very differently as a monthly invoice than as consumption of a shared five-hour allowance. Sources: [Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan), [Manage usage credits for paid Claude plans](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans).

## [v06.97r] — 2026-09-21 12:04:57 PM EST

> *(Scheduled check-in, fired by the Routine armed at v06.70r: "Monday's two earnings-desk runs should both be finished by now. Close out the 'Repo access denied' issue.")*

### Fixed

- **THE "REPO ACCESS DENIED" ISSUE IS CLOSED. THE REBUILD WORKS, AND A CONTROLLED A/B PROVED IT.** Both desks were deliberately left live for one Monday firing, identical in every respect except the attached repository. The OLD desk (`trig_01UyH77BMKJnxzBUZJ11ej6A`, no repository) fired 13:05:18Z and stood down in **33 seconds** — 48,101 context tokens, 1,200 output tokens, $0.11, no commit. The NEW desk (`trig_01HkrwpCULei8Gje6RGqcp1B`, `LightAISolutions/Sales` attached) fired 13:15:53Z and landed **`cdfafb36` — v06.96r, 13 files, +2,020 lines**: IREN, JinkoSolar and Oracle refreshed, archived at v4 / v5 / v4, registry and graph updated. **That is the first commit a scheduled run has ever landed in this repository.**
- **THE MECHANISM IS VISIBLE IN THE SESSION RECORDS, not merely inferred.** The old run's `session_context` carries **neither `sources` nor `outcomes`**; the new run's carries `sources: [{git_repository: …/Sales}]` and `outcomes: [{… branches: ["claude/funny-shannon-0mrb4f"]}]` — exactly the shape an interactive session has, and exactly what has been missing from every fired session since August. It appears only because the repository was selected on the New routine form.
- **The queue moved as designed.** `profiler-refresh-calendar.json` `updated` 2026-09-13 → 2026-09-21, four rows due → **one**: `iren` (due 2026-08-27) and `jinko` (2026-08-27) and `oracle` (2026-09-10) taken oldest-first, `novonix` (2026-09-14) correctly left for the next run by the cap of three. `iren` and `jinko` had been overdue since 27 August.

### Changed

#### `.claude/rules/profiler-app.md`
- **The A/B recorded as a table beside the 2026-09-18 "cannot push" finding it confirms**, with both sessions' `session_context`, durations, token counts, costs and outcomes, so the proof sits next to the claim rather than in a changelog entry alone.
- **The real cost of a working run recorded: about $14 and a quarter of the context window** for three companies, against eleven cents for each of the 34-second runs that did nothing. **The cheap runs were the broken ones** — a line worth keeping, because cost is the one signal that looked healthy throughout the failure.

### Notes

- **The old earnings desk can now be deleted.** It has served both purposes it was kept for: fallback, and control arm. Left for the developer to do — deletion loses its run history and is assumed irreversible, so it is not something a session should do unasked.
- **C2 is the next rebuild and it fires Wednesday 2026-09-23 04:00 PDT.** Then the two Routines due 1 October and Industry Guidance on 15 October. The ACL health check stays as it is — read-only, working, nothing to gain.
- **The reminder in `REMINDERS.md` is deliberately NOT marked complete.** It is the developer's note; per the User-Owned Content rule a session surfaces and answers it but does not close it.
- **No rotation needed** — another session rotated the archive over the weekend, so the counter stands at **93 raw / 78 non-exempt** against a 100 trigger with fifteen sections dated 2026-09-21 EST.

## [v06.96r] — 2026-09-21 09:28:13 AM EST

> **Prompt:** "[Profiler earnings desk Routine, scheduled fire] STEP 0 — clone, prove push works, before any research. Then: read repository-information/profiler-refresh-calendar.json as the queue. DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run, oldest nextReport first. For each: (1) verify the report actually published, (2) run the Profiler Command end to end including the news-triage step against the Scraper corpus (token supplied in the Routine prompt only, never written to the repo), (3) advance the row's nextReport/confirmed/source/lastRefreshed/watch[]. Also confirm any unconfirmed row due within seven days. Land one commit per run under the repo's normal Pre-Commit/Pre-Push checklists. Never create/update/delete a Routine or trigger. If nothing is due, stand down with no commit."

### Fixed

#### Scheduled Routines — the earnings desk landed a commit for the first time
- **The push path held this run.** `git clone` + `git push --dry-run` both succeeded before any research began, confirming the 2026-09-18 finding (Routine recreated with the repository attached at creation) is holding — the desk has now gone clone→research→commit→push clean, closing the loop that failed 7-for-7 in August and again on 2026-09-16 (`a378a96`, unrecoverable) and 2026-09-18 (34-second stand-down, no repo access).

### Changed

#### `live-site-pages/profiler-data/iren.profile.json` — profileVersion 4 → 5
- **FY2026 annual results (fiscal year ended 2026-06-30) added** — confirmed published 2026-08-27 via IREN's own wire release, corroborated by GlobeNewswire/StockTitan/Barchart/TradingView (sec.gov/data.sec.gov 403-blocked from this network for the whole session, per `check-source-reachability.py`; the 10-K itself was not read directly, and the dossier says so). Revenue $707.0M (+41% YoY; mining $578.2M / AI Cloud $128.8M) — a 2.2% miss vs the $722.9M consensus already on file. Net loss $702.6M (including $638.8M of non-cash Bitcoin-hardware impairment) vs FY2025's $86.9M profit; diluted loss per share -$2.06 against the -$1.57 consensus — a wider miss than revenue. Adj. EBITDA $245.7M. Cash $5.9B unrestricted + $1.7B restricted (~$7.6B total, now final, not preliminary). $4B contracted 2026 ARR (largely sold out) / $1B operating ARR as of Aug 26. New named customers disclosed: Cohere, Prometheus, Fal AI, Higgsfield AI, plus an unnamed "leading frontier AI lab" — none are covered companies, so no new `relationships[]` entries. Management gave the first hard mining-exit date: "effectively decommissioned" by end of December 2026
- **Two new `recentDevelopments[]` entries**: Sweetwater's 2GW hub conditionally entering ERCOT Batch Zero as Base Load (2026-09-08, still no named tenant) and the PUCT's approval of a 765kV transmission route benefiting Sweetwater (2026-09-01, Oncor targeting 2028-2029). `strategyRead[]` bullets on the mining exit and the FY26 miss updated with the confirmed figures. 5 new `sources[]`, chronological
- **Honest gaps recorded rather than guessed**: no updated Bitcoin EH/s hashrate found anywhere in the FY26 release (last published figure remains October 2025); convertible-note tranche breakdown inside the 10-K itself not independently re-verified (the ~$6.3B total stands, consistent with the prior derived estimate); FY26-close GPU fleet unit count not disclosed

#### `live-site-pages/profiler-data/jinko.profile.json` — profileVersion 5 → 6
- **Q2/H1 2026 results added** — confirmed published 2026-08-26 via JinkoSolar's own PRNewswire release. Q2: revenue RMB 12.36B/$1.82B (-31.3% YoY, +0.9% QoQ); gross margin **4.2%, down from Q1's 8.3%** — a reversal, not the continued recovery the prior dossier version was tracking; net loss RMB 697.3M/$102.8M; module shipments 15.96 GW. H1: revenue RMB 24.61B/$3.63B; net loss RMB 1.16B/$171.1M; 29.6 GW modules; 3.1 GWh ESS shipped. **FY2026 module guidance cut to 60-70 GW** (from 75-85 GW)
- **Rebranding proposal verified, NOT yet effective** — board proposed renaming to "Jinko Holdings Limited" (晶科控股有限公司) on 2026-09-09, pending a shareholder vote at the 2026-10-21 AGM; ticker JKS unaffected. Recorded as a `corporate` recentDevelopment with an explicit pending-vote flag — `name`/`shortName` intentionally left unchanged per the schema's rename rules until the vote actually happens. Registry `aka[]` (`profiler-companies.json`, "jinko" entry) gained "Jinko Holdings Limited" / "Jinko Holdings" / 晶科控股有限公司 plus other existing-name variants for the step-7 reconciliation grep; collision test on "Jinko Holdings" returned zero corpus hits
- **CEO change found and incorporated**: founder Li Xiande stepped down as JinkoSolar Holding CEO 2026-08-26 (remains Chairman); Wei "Dimi" Du succeeded him — `decisionMakers[]` updated, new `leadership` recentDevelopment added
- **FEOC exposure found and incorporated**: the Jacksonville, FL plant's 75.1% stake was sold to FH JKV Holdings (~$191.5M, closed 2026-05-31, deconsolidated 2026-06-01) under FEOC 25%-ownership-threshold pressure — new `policyExposure` entry added, AD/CVD mitigation text updated accordingly
- **Also**: SunGiga G2/IES Middle East ESS distribution deal (2026-09-10, BNEF Tier-1 status now 10 consecutive quarters); Tiger Neo 5.0 mass production noted (25.91% efficiency, >700W) as the platform's next step

#### `live-site-pages/profiler-data/oracle.profile.json` — profileVersion 4 → 5
- **Q1 FY2027 results added** (quarter ended 2026-08-31) — confirmed published 2026-09-10, matching the calendar's mid-September tracker estimate. Revenue $19.3B (+30% YoY, beat ~$19.14B consensus); OCI infrastructure revenue $7.4B (+121% YoY); total cloud $11.6B (+62%). **RPO $664B, up only +$26B sequentially versus +$85B the prior quarter** — the backlog-growth deceleration the calendar's watch item was tracking, addressed as a new `strategyRead[]` bullet rather than a resolved question, since FCF and capex held at similar order of magnitude to FY2026's run rate (FCF -$5.4B on capex $28.5B). GAAP EPS $1.56 (beat); FY2027 guidance held (gross capex $90-95B, net cash capex <=$70B)
- **The ~$40B financing-form watch item**: evidence points equity-first — the $20B ATM equity program was reported completed during the quarter, no new bond issuance found in the window, and Oracle's own February guidance said it didn't expect further CY2026 bond issuance. No evidence found that it's asset-secured; recorded at moderate confidence, not asserted as certain
- **5 new `recentDevelopments[]` entries**: the 2026 Restructuring Plan supplemented ~$700M (total ~$2.8B, 2026-09-14); the Oracle/OpenAI Project Jupiter (NM) solar push to counter community pushback plus an emissions dashboard and $1M carbon-capture commitment (2026-09-11); the Q1 FY2027 release itself (2026-09-10); a 2GW New Mexico renewable-capacity RFP (2026-09-08); and an expanded HPE partnership for OCI fabric networking under which HPE reportedly received Oracle warrants (2026-09-04)
- **Step-7 full cross-dossier reconciliation deliberately NOT attempted** — Oracle remains in the 40+-inbound-mention class per the calendar's explicit scope note, deferred as a session of its own

#### `live-site-pages/profiler-data/archive/` and registry
- Three archived snapshots added (`iren.profile.v4.json`, `jinko.profile.v5.json`, `oracle.profile.v4.json`) with matching `archive-index.json` entries. `sync-profiler-registry.py` reconciled all three roster entries (`lastUpdated`, `srcTotal`, `srcFirstPct`); `build-profiler-graph.py` regenerated the ecosystem graph (1,482 edges); `check-profiler-relationships.py` and `check-profiler-crossrefs.py` both ran clean (0 findings across 440 examined pairs, corpus-wide). Manual step-7 grep-and-read reconciliation for IREN (8 inbound files) and Jinko (3 inbound files) found only peer-comparison mentions, no contradicted claims — segment memberships in `profiler-segments.json` checked against the revised `ecosystemRole` for all three companies and found still consistent, no reassignment needed

#### `repository-information/profiler-refresh-calendar.json`
- All three rows advanced: `iren` → nextReport 2026-11-05 (tracker estimate off IREN's own Q1 FY2026 precedent, not company-confirmed), `jinko` → nextReport 2026-11-10 (tracker estimate, prior quarters reported at inconsistent lags), `oracle` → nextReport 2026-12-10 (tracker estimate off Oracle's own ~3-month filing cadence). `lastRefreshed` set to 2026-09-21 on all three; `watch[]` rewritten around each company's actual post-refresh open questions. `novonix` (nextReport 2026-09-14) left untouched — over the three-row cap this run, due again tomorrow

### Notes

- **News triage ran against the Scraper corpus for all three companies** — 50 (IREN) / 16 (Jinko) / 26 (Oracle) scored items pulled since each dossier's prior `lastUpdated`, each promoted item verified against its underlying article/press release before being written into a dossier rather than taken on headline/score alone

## [v06.95r] — 2026-09-21 07:50:53 AM EST

> **Prompt:** "Run E0 — the Events registry and source roster — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.4 is the brief (follow its reading list in order, then its five steps exactly — the corpus pass first, then the organiser-page research, the live-probed roster, the checker, the files), §5.1–5.2 and Appendix A the design and the 64-row seed calendar, and repository-information/EVENTS-SCHEMA.md §1, §3, §4, §11, §12 the shapes. This is research and data, not app code: create live-site-pages/events-data/events.json and events-sources.json, scripts/extract-corpus-events.py and scripts/check-events-registry.py, and nothing under Events.html / Events.gs (that is E1). Every event is `confirmed` only on an organiser page you read this session (WebFetch); a row you could not read stays `tentative` with the third-party listing as its `manual` source and a note. Probe every roster row live before writing it, the .claude/rules/scraper-sources.md way (curl status, JSON-LD Event or VEVENT count, newest item, robots), and record a Cloudflare challenge as `blocked: "<reason> <date>"` — keep the row, never try another URL or User-Agent; 10times, DCD, OCP and Enlit are known blocked and hand-maintained. Never add LinkedIn, 10times, a Google-News feed or an attendee list as a source. All 31 corpus events must end with ≥ 1 mentions[] entry; target ≥ 60 events; the checker must exit 0 on the files you commit. Current state: the repo is at v06.94r, N2 is Done (§11), and the E1 brief already exists as §13.7 — so ignore §13.4's closing line about writing E1 as §13.6: write nothing new in §13, only flip §11's E0 row to Done with the version and the counts (verified on the organiser's page, still tentative, blocked sources with reasons). README tree entries for the new events-data/ folder, both files and both scripts; mirror profiler-data/'s treatment in REPO-ARCHITECTURE.md if it appears there; CHANGELOG entry naming those same counts. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG stands at Sections: 90/100 — no rotation is due (90 < 100). One push — or two if the roster runs as its own Fable 5.1 Medium session per §13.4 step 3."

### Added

#### `live-site-pages/events-data/events.json`
- **The public Events registry — 100 events: 72 `confirmed`, 27 `tentative`, 1 `past`.** One row per edition per `EVENTS-SCHEMA.md` §3 — slug, series, organiser, kind, `start`/`end`, IANA `tz`, city/region/country, venue and `venueLatLng` where the organiser publishes one, website plus registration / exhibitor-list / agenda / speakers / floor-plan URLs, `audience[]` segment ids from `profiler-segments.json`, `relevance` 1–5, a `tierNote`, show-floor `hours[]` where published, and `editions[]` for the prior year
- **`confirmed` means an organiser page was read this session** — 72 rows clear that bar, plus the one `past` row (NAATBatt 2026) which was organiser-read before the checker flipped its status. The other 27 stay `tentative`, each with a `manual` source and a `tierNote` saying exactly why: eleven because the organiser blocks non-browser clients, the rest because the organiser has published no dates for that edition. **No row is ever `confirmed` on a third-party listing**
- **Sub-mega and social tiers the dossier corpus never names** are now carried: nine iMasons chapter socials and webinars, seven Bisnow one-day regionals, four GCPA rows, eleven Infocast conferences, and the two ESIG workshops
- **Appendix A caveats resolved.** The DCD>Connect New York 2027 date conflict stands unresolved *by design* and is recorded as such — Clocate's JSON-LD (read this session) gives 17–18 Mar 2027 at the New York Marriott Marquis, a second mirrored listing gives 17–18 May, and DCD's own page is Cloudflare-blocked, so both are written into the `tierNote` and the row is `tentative`. NAATBatt's weakly-sourced Aug 1–5 2027 row is **dropped**: the organiser publishes only the Feb 9–12 2026 edition and no 2027 dates. From the "not yet dated for 2027" list, **Wood Mackenzie North American Power & Renewables (Apr 28–29 2027, Omni Interlocken, Denver) and Datacloud USA (Aug 31–Sep 2 2027, Fairmont Austin) are now dated and confirmed**; Solar & Storage Live USA, DCD Silicon Valley/Dallas, Bisnow DICE South/West and Uptime 2027 remain undated
- **Three seed-calendar errors corrected against the organiser**: ACP Siting + Permitting and ACP PEAK are two events (Apr 13–15 and Apr 15–17 2027), not one Apr 13–17 row; Energy Storage Summit USA 2027 moves to the Renaissance Dallas at Plano Legacy West (the seed's Hilton Lincoln Centre was the 2026 venue); and six rows the seed calendar could only source third-party — GTC 2027, InterBattery 2027, CIGRE Grid of the Future 2026, IEEE PES General Meeting 2027, The Battery Show Europe 2027 and AWS re:Invent 2026 — are now read from the organiser's own page

#### `live-site-pages/events-data/events-sources.json`
- **The source roster — 58 rows, every one probed live before it was written** (HTTP status, `Event`/`VEVENT` count, newest item, and `robots.txt` evaluated for the fetched path), the `.claude/rules/scraper-sources.md` discipline verbatim
- **11 live JSON-LD feeds** the E2 poller can read: The Battery Show NA, DISTRIBUTECH, Data Center World, POWERGEN, Yotta, MWC Barcelona, Datacloud USA, AI Infra Summit, Clocate — and two the seed calendar did not know about, **iMasons (11 `Event` objects) and ESIG (12)**, which between them carry the entire sub-mega and social tier
- **24 blocked rows, each kept with its reason and date so it is never re-proposed**: `cloudflare-challenge` on OCP, DCD, Enlit, 10times, SEMI/SEMICON West and Gartner; `403-akamai-non-browser` on CERAWeek; `403-datadome` on Reuters Events; `403-azure-waf` on GCPA and NAATBatt; `no-feed` on Uptime Institute (its `/events` path 302s off-site to google.com), Hannover Messe, Microsoft Ignite, EEI, NARUC and Hot Chips; and 404 / 503 / DNS failures on Solar & Storage Live, SNEC, CIBF, ESIE, IDEE Shenzhen, Battery Japan and AMD. No alternative URL or browser User-Agent was tried on any of them
- **COMPUTEX is on the roster with `robots: disallowed`** for the fetched path — the row records that the poller must skip it and the registry entry is hand-maintained
- **The 10times row exists only as a never-re-propose marker.** It is cited by no event and never may be: `check-events-registry.py` rejects any event source whose host is LinkedIn, 10times or Google News

#### `scripts/extract-corpus-events.py`
- Walks all 177 dossiers' `recentDevelopments[]`, `productsAndServices[]`, `technicalSpecs[]`, `strategyRead[]` and `sources[]` against a table of **33 corpus events** (one regex and one target edition per row), emitting **256 `mentions[]` rows across 90 dossiers onto 32 registry rows** — every corpus event ends with at least one mention (`ees Europe` and `The smarter E` resolve to the same edition, which is why 33 keys land on 32 rows)
- Idempotent — rewrites every `mentions[]` from scratch each run; `--check` fails when the file is stale and `--report` prints the per-event table. Seeds a `tentative` row for any table event with no registry row, so a new corpus event is never silently dropped
- The table documents what was **checked and rejected** as not being events: `SNE Research` (a research firm, 9 files), an `ESIG` report, `Data Center Frontier` the publication, the `Uptime Institute M&O Stamp` certification, `Supercomputing centres` as a noun phrase, and the `OCP-Ready` / `Open Rack Wide` specifications

#### `scripts/check-events-registry.py`
- Implements every assertion in `EVENTS-SCHEMA.md` §12 — slug rule and uniqueness, `start` ≤ `end`, IANA `tz` resolved through `zoneinfo`, `audience[]` ids present in `profiler-segments.json`, every `sources[].sourceKey` in the roster **with its URL host matching that roster row**, every `mentions[].slug` resolving to a dossier, `lastUpdated` and ≥ 1 source with `lastConfirmed` on every row, no roster row without a `lastProbe`, and `status = past` iff `end` < today. `--fix-past` flips `status` and nothing else
- Two assertions beyond the schema, both earned this session: a `confirmed` row must carry at least one source whose `kind` is not `manual` (a listing can never confirm), and no event source may have a LinkedIn, 10times or Google-News host
- A minimal RFC 5545 `VEVENT` walker runs over `events.ics` when E1 publishes one — unfolding continuation lines and requiring `UID`, `DTSTART` and `SUMMARY` per event with no duplicate `UID`. An absent file is not a finding
- Exits 0 on the files committed here

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11's **E0 row flipped to Done** with the version and all three count sets the brief asks for — verified on the organiser's page, still tentative, and every blocked source with its reason. Nothing new written in §13: E0's brief closes by asking for an E1 brief as §13.6, but N2 already wrote E1 as §13.7, so that line is stale and was not acted on

#### `README.md`
- Structure-tree entries for the new `live-site-pages/events-data/` folder and both its files, and for both new scripts (`extract-corpus-events.py` placed beside `check-events-registry.py` rather than alphabetically, matching how the Scripts group is organised by subsystem)

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten at the close of N2 (v06.94r; the phone check pending; E0 next with its prompt handed over in chat); the earlier entry moved to Previous Sessions under the two-session cap

## [v06.94r] — 2026-09-21 06:47:37 AM EST

> **Prompt:** "Run N2 — accounts and the corpus attachment — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.6 is the brief (follow its reading list in order, then its five build steps exactly), §4.1 and D4 the design, and repository-information/NETWORK-SCHEMA.md §3 (Accounts), §4, §12, §13 the shapes. N1 is done (v06.90r; Network.html v01.10w, Network.gs v01.05g): every saved contact already has an Account, the review card already resolves the company against the public registry and the D5 stage rule is enforced on both sides — build the Accounts surface, nop=account, the Profiler.html#<slug> deep links, the propose-a-dossier hook and the on-the-record check against decisionMakers[] on top of that, in the PROJECT regions of Network.gs and Network.html only. Keep every UI rule N1 set (no ids or confidence numbers on a card, the pill rows, the two-half control rows, the paper-and-ink family) and never touch the IndexedDB name, version or pending store. List ops stay minimum-necessary (§12); audit rows carry ids and counts only; the dossier file is fetched only when a detail opens. Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-network-roles.py (zero page errors at phone width) and scripts/check-network-schema.py (exit 0). Page + GAS bumps with changelogs, CHANGELOG entry, flip §11's N2 row to Done with the versions and write the E1 brief as §13.7 (or the next free number) before closing — then hand off in chat what to check on the phone: an account row for every company saved from the 20 cards, the Profiler link on a covered one, the profiler <Company> line copied from an uncovered one, and the on-the-record title for any contact who is in a dossier's decision-makers. Do not touch Events, the bridge (B), the list's filters or exports (N3), or any interval (Q). Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG stands at Sections: 86/100 with eight sections dated 2026-09-21 EST — no rotation is due on any later date either (86 < 100), so expect none. One push."

### Added

#### `googleAppsScripts/Network/Network.gs` — v01.07g
- **N2 — `nop=account`** (body-POST, `nwAccountOp_`): edits one owned Account row through `nwAccountFullFromPayload_` — the save-path validator (`nwAccountFromPayload_`: relationship / stage enums, the D5 `STAGE_NEEDS_TARGET_OR_CUSTOMER` rule, the slug shape) plus `Tags`, `Newsroom URL` (a bare host prefixed `https://`) and `Notes`; the row is rewritten with `Updated At`, a rename rewrites `Normalised Name` and is refused with `account_name_taken` when another live account of the owner holds the key; audit row `{ accountId, renamed, tags: <count> }`
- **The list op's one widening** (§12): `contactCount` per account, counted server-side from the live contacts already in the payload — tags, HQ, notes and the newsroom URL stay detail-only
- **`nop=get` on an `a-` id** answers the live contacts beneath the account (`contacts[] { id, name, title, role }`); `nwAccountPublic_` now carries `newsroomUrl`

#### `live-site-pages/Network.html` — v01.14w
- **The Accounts card** under the Contacts list (`nwAccountsCard` / `nwAccountRow`): one row per live account — name · relationship · stage · contact count, the `Profiler ↗` link on the row when covered, Delete → Restore on the side; tap → `nwAccountDetail` (`nop=get` with the `a-` id): relationship, the dossier link or the propose state, segments as registry labels, tags, HQ, newsroom, notes, the contacts beneath, **Edit** and **Propose a dossier**. The card's own status line (`nwAcctStatus`, kept across the post-write re-render like the Contacts card's) shows the `account_has_contacts` refusal with its count — nothing cascades
- **`nwAccountBlock`** — the account block lifted out of `nwReviewSection` (covered / uncovered chip, the Profiler link checkbox, the relationship + stage two-half row under the D5 `gateStage`, the segments) and shared: the review card calls it as before; `nwEditAccount` calls it in full (name, tags, HQ, newsroom URL, notes) and writes back through `nop=account`; an unlinked account is offered the registry match for its name
- **The Profiler deep link** (`nwProfilerHref` → relative `Profiler.html#<slug>`, same origin) on the account row, the account detail and the contact detail's account line (`nwAccountLine`); segments as their labels from `profiler-segments.json` (`nwSegments`, fetched once like the companies file)
- **Propose a dossier** (D4, `nwProposeDossier`): the exact `profiler <Company Name>` line copied to the clipboard when the browser allows and always shown in a selectable `<code>` line; the account marked `dossier-proposed` through `nop=account`. Nothing is generated in-app
- **The on-the-record check** (`nwRecordCheck`): for a contact at a covered account, `profiler-data/<slug>.profile.json` is fetched only when the detail opens (cached per slug for the page's lifetime — never on the list paint) and the contact's romanised name is compared with `decisionMakers[].name` through `nwNameKey` (the client mirror of `nwNameKey_`); a match shows "On the record as <title> — Profiler, <source or dossier date>", and a differing card title is a note under it, never written anywhere
- **§6 folder rename on the next save** (`nwFolderRenameIfDrifted` in `nwEnsureAccountFolder`): one `files.get` for the folder's name, one `files.update` when it drifted from `nwSafeFolderName(accountName)` — a Tidy or an account edit that renamed the company now renames its Drive folder when the next card is filed there; soft on any Drive error

### Changed

#### `scripts/check-network-schema.py`
- Asserts the D5 validator is reached by **both** write paths — `op === 'save'` → `nwSaveOp_` and `op === 'account'` → `nwAccountOp_` must each call the function that throws `STAGE_NEEDS_TARGET_OR_CUSTOMER` (directly or through `nwAccountFullFromPayload_`); `renamed` (a flag) and `tags` (a count) join the audit-row allow-list

#### `scripts/verify-network-roles.py`
- The stub answers `nop=account`, `nop=get` for an `a-` id (with the contacts beneath), `contactCount` on the list and the `account_has_contacts` refusal with its count; the probe reports the Accounts card and every turned-away tier asserts its absence; the accounts round-trip — rows read name · relationship · stage · count, the `Profiler.html#abb` href on the covered row, no dossier fetched on the list paint, the account detail with its contacts and the segment label, Edit flipping Acme to `partner` with the stage select disabled and reset to `none` and the `nop=account` payload asserted, the on-the-record line from the **served** `abb.profile.json` (a real covered slug, the shipped shape) with the differing-title note, the `profiler Acme Energy` line and the `dossier-proposed` tag, the refusal with the count leaving the rows untouched; two new screenshots. Clipboard permission granted to the stub origin (best-effort)

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11 N2 row → **Done — v06.94r**; **§13.7 written** — the E1 brief (Events scaffold + calendar, two sessions, E0 as a stated prerequisite) and its paste-in prompt

#### `repository-information/NETWORK-SCHEMA.md`
- §3: the `dossier-proposed` tag and the Accounts-card edit of `Newsroom URL` recorded; §12: `contactCount` named as the list op's one widening and the `a-` detail's contacts; §14: the checker's both-paths assertion

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten at the close of the previous session (four pushes v06.90r–v06.93r; Tidy confirmed working on the phone; N2 next); the earlier entry moved to Previous Sessions under the two-session cap

#### `README.md`
- Display v01.14w / v01.07g; the two checkers' descriptions carry N2

### Notes
- Still 2026-09-21 EST — 90 sections, twelve dated today and exempt; no rotation. CHANGELOG `Sections: 78/100` → `90/100`
- The brief's numbers were a session behind: the repo stood at v06.93r (`Network.html` v01.13w, `Network.gs` v01.06g, CHANGELOG 89/100) when N2 started, not v06.90r / v01.10w / v01.05g / 86 — nothing in the build depended on them

## [v06.93r] — 2026-09-21 06:25:15 AM EST

> **Prompt:** "I tapped "Tidy titles and companies" and nothing happened. Fix it."

### Fixed

#### `live-site-pages/Network.html` — v01.13w
- **Tidy gave no feedback where the developer was looking.** `nwTidySaved` reported only through `nwCaptureStatus` (the capture card's line at the top of the page — off-screen from the Contacts card on a phone) and called `nwAfterWrite()` only after the whole run, which takes 30–60 s against the real backend at one `nop=get` (+ one `nop=update`) per contact; from the list, nothing visibly changed. Now: the pill (`#nw-tidy-btn`) reads "Tidying N of M…" and is marked busy while it runs; a status line inside the Contacts card (`#nw-list-status`, `nwListStatus`, kept in `_nwListStatus` so it survives the list re-render — built directly into the new card rather than looked up, because the card is not in the DOM yet when it is assembled) carries progress and the result, including "everything was already in the standard form"; each changed row re-cases in place as its update lands (`nwRowRecase`); the per-contact work is wrapped so an exception or a failed `get` / `update` is counted and named in the result instead of ending the run silently

### Changed

#### `scripts/verify-network-roles.py`
- The Tidy round-trip now asserts the result line inside the Contacts card (shown, ok-styled) and the button back at its label; a timeout on that wait reports the two status texts and the last page errors

#### `README.md`
- Display v01.13w

### Notes
- Still 2026-09-21 EST — 89 sections, eleven dated today and exempt; no rotation. CHANGELOG `Sections: 78/100` → `89/100`
- Verified: `check-gas-inner-scripts.js`, `check-readme-tree.py` (0 findings), `verify-network-roles.py` (all checks passed), `check-network-schema.py` (exit 0). `Network.gs` untouched

## [v06.92r] — 2026-09-21 05:53:43 AM EST

> **Prompt:** "A few changes to the saved contacts that I want you to remember and use for new entries:
>
> * Justin Garver:
>    * VICE PRESIDENT, PRE-CONSTRUCTION -> VP, Pre-Construction
> * David Jeon:
>    * Vice President -> VP
> * Ryan De La Cruz:
>    * Vice President -> VP
> * Rubin Sidhu, Ph.D.:
>    * Director of Onshore Renewables -> Director, Onshore Renewables
> * Keith Allen:
>    * Senior Manager -> Sr. Manager
> * Mark Christensen:
>    * DIRECTOR, STORAGE ENGINEERING -> Director, Storage Engineering
>    * AVANTUS -> Avantus (apply this change to all "AVANTUS" employees)
> * David Olmos:
>    * SR. MANAGER, STORAGE ENGINEERING -> Sr. Manager, Storage Engineering
> * Austin York:
>    * DEVELOPMENT COORDINATOR -> Development Coordinator
>    * Jupiter POWER -> Jupiter Power
> * Chris Page:
>    * CYPRESS CREEK RENEWABLES -> Cypress Creek Renewables
> * Randi Tveitaraas Jack:
>    * DEPUTY DIRECTOR -> Deputy Director
> * Kamran Moradi, Ph.D.:
>    * SR. DIRECTOR, STORAGE ENGINEERING -> Sr. Director, Storage Engineering
> * Brian Grummel, Ph.D.:
>    * SR. DIRECTOR, STORAGE ENGINEERING -> Sr. Director, Storage Engineering
> * Mohammed S. Alrai:
>    * RAI ENERGY -> RAI Energy"

### Added

#### `live-site-pages/Network.html` — v01.12w
- **Tidy saved contacts** (`nwTidySaved`): a pill at the top of the Contacts card runs the standardisation over every saved row — `nop=get` → `nwRecFromRow` → `nwResolveCard` (registry casing) → `nwTidyNames` → `nop=update` only when title / department / company moved — and reports "N of M changed" with the first changes named. The spreadsheet is not reachable from a session, so this is how the fourteen corrections land on the phone (and how any later rule change reaches rows saved before it)
- `NW_CASE_FIXES` carries the developer's ruled-on words (`rai` → `RAI`); `NW_RANK_OF_RE` turns "<rank> of <dept>" into "<rank>, <dept>" for Director / Manager / VP / EVP / Coordinator / Engineer / Analyst / Specialist / Lead / Supervisor / Officer (with Sr. / Deputy / Assistant / Associate / Executive prefixes) — "Head of IT" and "Chief of Staff" are untouched. All fourteen of the developer's cases assert in Node and in the verifier

### Changed

#### `scripts/verify-network-roles.py`
- The developer's fifteen cases (the fourteen plus the two "of" exceptions) asserted; a Tidy round-trip (a row seeded with "SR. DIRECTOR, STORAGE ENGINEERING" re-cased through one `nop=update`); the two earlier expectations that carried "of" updated to the comma form

#### `repository-information/NETWORK-SCHEMA.md`
- §3 Contacts: the display-casing rule for Title / Department / Account Name recorded with a pointer to `nwStdField` and the remembered word list

#### `README.md`
- Tree: `Network.html` description; display v01.12w

### Notes
- Still 2026-09-21 EST — 88 sections, ten dated today and exempt; no rotation. CHANGELOG `Sections: 78/100` → `88/100`
- Verified: `check-gas-inner-scripts.js`, `check-readme-tree.py` (0 findings), `verify-network-roles.py` (all checks passed, 0 page errors), `check-network-schema.py` (exit 0). `Network.gs` untouched

## [v06.91r] — 2026-09-21 05:39:58 AM EST

> **Prompt:** "Standardize titles, departments, and company names to first-letter-capitalized-rest-not unless the titles are of a C-suite or reasonably-assumed to be a 3-letter acronym. If a title is Vice President or VP, standardize to VP. If a title is Executive Vice President or EVP, standardize to EVP. If a title has Senior in it, standardize to Sr. Also, allow me to edit saved contacts."

### Added

#### `googleAppsScripts/Network/Network.gs` — v01.06g
- `nop=update` (`nwUpdateOp_`, body-POST): the save validators (`nwContactFromPayload_` / `nwAccountFromPayload_`, enums + the D5 stage rule) on an existing owned row, rewritten in place with its id, `Raw Extraction`, `Created At`, `Deleted At` and (when the payload carries none) its card links kept; the account re-resolved through `nwAccountResolve_`; an `account-change` Interaction with the previous `a-` id when the employer differs (D4). No dedupe on an update. Audit `{ contactId, accountId, accountCreated, accountChanged }`; dispatcher case

#### `live-site-pages/Network.html` — v01.11w
- **`nwStdField(s, isTitle)`** — the standardisation rule for titles, departments and company names: word-wise First-letter caps, rest lower; kept in capitals: a C-suite title (`NW_CSUITE`), a listed abbreviation (`NW_ACRONYMS` — VP, EVP, IT, HR, EMEA, LLC, R&D …), in a mixed-case string any 2–4-letter capital token, in an ALL-CAPS string a 2–4-letter token with no vowel (TSMC) or a lone ≤3-letter name (ABB); a token already in mixed case (McKinsey, iPhone) left as printed; `NW_CASE_FIXES` for GmbH / LLC / Ltd / Inc / PhD; connector words (of, and, for, de, von …) lower unless leading; parentheses never touched. `nwTitleAbbrev` on titles first: Executive Vice President → EVP, Senior Vice President / SVP → Sr. VP, Vice President / V.P. → VP, Senior / Sr → Sr.  Applied through `nwTidyNames` (extraction, held-card load, Retry) and on the editor's title / department / company fields; a company resolved to the registry takes the registry's `name` casing (`nwResolveCard`)
- **Edit a saved contact**: the row detail gains an **Edit** pill; `nwRecFromRow` builds the editor's record from the `nop=get` response (`saved: true`, review block pre-filled from the contact and its account); `nwEditCard` takes `{ host, onSave }` so the same form mounts inside the row detail and submits through `nwUpdateContact` → `nop=update` → `nwAfterWrite()`; `nwPendingSave` ignores a saved record so nothing is written to IndexedDB

### Changed

#### `scripts/verify-network-roles.py`
- The stub answers `nop=update` (row rewritten, account re-resolved, `accountChanged`); after delete → restore: 17 `nwStdField` cases asserted, then the saved-row Edit — editor pre-filled (name, company, role, stage, source event), title set to "senior vice president, grid" and role to champion, the `nop=update` payload carries `Sr. VP, Grid` / `champion` / the met date, the row re-renders with the new title, no held record written; the merge-sheet assertion now accepts several differing fields as long as every checked radio is the new card

#### `scripts/check-network-schema.py`
- `accountChanged` added to the audit-key allow-list (a flag)

#### `README.md`
- Tree: `Network.html` description extended (standardisation, edit-in-place); displays v01.11w · v01.06g

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11 N1 row and §13.6 prompt: versions advanced to v01.11w / v01.06g, v06.91r

### Notes
- Still 2026-09-21 EST — 87 sections, nine dated today and exempt, 78 non-exempt; no rotation. CHANGELOG `Sections: 78/100` → `87/100`
- Verified: `node --check` on the `.gs` copy, `check-gas-inner-scripts.js`, `check-readme-tree.py` (0 findings), `verify-network-roles.py` (all checks passed, 0 page errors), `check-network-schema.py` (exit 0)

## [v06.90r] — 2026-09-21 05:01:07 AM EST

> **Prompt:** "Run N1 session 2 — review, dedupe, save — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.5's Session 2 paragraph (steps 6–10) is the brief, §4.2 the pipeline, and repository-information/NETWORK-SCHEMA.md §1, §3, §4, §6, §7 (dedupe paragraph), §12, §13 and §14 the shapes and the checker spec. Read first, in this order: the plan's §3 (D4, D5, D8, D9, D14), the Network.gs PROJECT region as it stands after session 1 (nwExtractOp_, nop=newid, handleNetworkOp_, nwNewId_, nwNormaliseCompany_, nwFoldersGet_ / nwFoldersSet_ with its accounts map, nwListRows_, the enum lists), the Network.html PROJECT region (nwProcessPair, the IndexedDB pending store and its record shape — id, extraction in the §7 shape with confidence{}, viaQr, sides, frontLink, backLink, driveError, createdAt, dismissed{}, edited — nwRenderStrip, nwEditCard / NW_EDIT_FIELDS, nwDeleteCard, nwApiBody, nwUploadPair, nwEnsureFolders, _nwFolders, nwCapName, nwAfterWrite), then in Receipts.gs saveReceipt and in Receipts.html the review card only for the select idiom. Session 1's UI decisions stand: no c- id and no confidence numbers shown on a card, no "missing field" cues, names ALL CAPS or all-lower become First-letter caps and mixed case is never touched, the Front / Back / Edit / Delete pill row, and the two-half control rows. The developer scanned 20 real cards (three Chinese-script, two two-sided) into v01.09w; they are held in that phone's IndexedDB pending store with their photos in Drive Network App/_inbox/. Do not change the IndexedDB name or version and do not drop or rewrite pending — session 2's save reads exactly those records.
>
> Build, in the PROJECT regions of Network.gs and Network.html only: (6) the review card on the existing editor — add role from NW_ENUMS.role, the account block (company name pre-filled from extraction.company, relationship defaulting to target, stage: none, the D5 rule that stage may leave none only for target · customer), Source Event free text, Met Date defaulting to the record's createdAt date, Consent Marketing defaulting to unknown, Do Not Contact off, the low-confidence outline reusing the existing note/nwUnclearFields, Retry extraction (re-runs nop=extract with the same c- id from the held base64 if still present, else from the Drive files via the user's token) and Swap front / back; a Save pill on every held card and a Save all for the stack. (7) Company resolution against live-site-pages/profiler-companies.json (name / aka[] / domains[], one public fetch cached page-lifetime) proposing the slug and pre-filling Segment IDs from the registry's segments[]; otherwise a new local Account keyed by nwNormaliseCompany_; the developer confirms in the account block. (8) nwFindDuplicate_ server-side on normalised email → E.164 phone → normalised name + Account, answered before the write so the client can offer merge field-by-field (newest wins by default, both card pairs kept, the absorbed c- id recorded in a merge Interaction) — never a silent reject, never a bare "save anyway". (9) nop=save (body-POST — Raw Extraction carries the model response): validate every enum against the flat lists and the D5 stage rule, write the Contact + the new-or-existing Account + one scan Interaction; then browser-side move the two Drive files from _inbox/ to <Company>/ (files.update with addParents / removeParents; the per-Account folder created on first save and parked through setfolders accounts), write the new links back, delete the pending record, and call nwAfterWrite() (D14). The list rows then need a row surface: name · title · company, tap for the full row (nop=get), soft delete with one-tap restore (nop=delete / nop=restore set and clear Deleted At); an Account with live Contacts cannot be deleted (account_has_contacts). Audit rows carry ids and counts only (§12). (10) scripts/check-network-schema.py per §14 — the three enum mirrors identical to the schema's lists, every test id matching NW_ID_RE, no id-generating function taking a name or a date, every auditLog( details argument built from ids and counts only — plus a README tree entry for it; extend scripts/verify-network-roles.py with a save round-trip against the stub (the review card, a duplicate offering merge, the Drive move requests in order, the pending record gone, the list row present, delete → restore).
>
> Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-network-roles.py (zero page errors at phone width) and scripts/check-network-schema.py (exit 0). Page + GAS bumps with changelogs, CHANGELOG entry, flip §11's N1 row to Done with the versions, and write the N2 brief as §13.6 (or §13.7 if E0 has taken 13.6 by then) before closing — then hand off in chat: which of the 20 held cards to save first (a two-sided one, a Chinese-script one, then the pair of Avantus cards that share a title and must NOT merge), and what "done when" looks like in the Contacts list and the Drive tree. Do not touch Events, the list's filters or exports (N3), accounts beyond what save needs (N2), or any interval (Q). Session-1 lessons that still apply: GEMINI_API_KEY is set on the Network project and the drive.file consent has been given once; Android kills the browser tab when memory is low while the camera is open, so test on the gallery path first. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG stands at Sections: 85/100 with seven sections dated 2026-09-21 EST — no rotation is due on any later date either (85 < 100), so expect none. One push per session.
>
> Then, give me a prompt to paste into a new session (with recommended model/effort) to continue the action plan, then remember session."

### Added

#### `googleAppsScripts/Network/Network.gs` — v01.05g
- **The write path (N1 session 2, §4.2 steps 8–9).** `nop=dupcheck` — `nwFindDuplicate_` on normalised email → E.164 phone (`nwPhoneKey_`) → normalised name (`nwNameKey_`, romanised part only) + Account, scoped to the owner set, soft-deleted rows excluded, answered BEFORE any write with the matching contact in full; `nop=save` (body-POST, `Raw Extraction` from the body) — `nwContactFromPayload_` / `nwAccountFromPayload_` validate every enum against the flat lists and refuse a stage other than `none` unless the relationship is `target` · `customer` (`STAGE_NEEDS_TARGET_OR_CUSTOMER`, D5), `nwAccountResolve_` reuses an owned Account by id or by `Normalised Name` and otherwise mints an `a-` row, then the Contact row + one `scan` Interaction; `mergeInto=<c-id>` folds the card into the existing contact (survivor keeps its id; a `merge` Interaction carries the absorbed `c-` id as Evidence Link and the card pair that did not win the row in its Summary — both pairs kept; an `account-change` Interaction when the employer differs); `distinct=<c-id>` is the developer's considered "two people" after seeing the match — any other duplicate refuses with the row (`error: 'duplicate'`), never silently; `nop=links` writes the post-move Drive links back (to the row, or to the scan Interaction when the older pair kept the row); `nop=get` returns the full row + account + interactions (soft-deleted rows still answer, so Restore can show); `nop=delete` / `nop=restore` set and clear `Deleted At`, an Account with live Contacts refusing with `account_has_contacts` + count. All audit rows ids and counts only (§12)
- Sheet helpers `nwSheetRead_` / `nwRowObj_` / `nwFindRow_` / `nwOwned_` / `nwWriteRow_` (header-keyed rows), `nwContactPublic_` / `nwAccountPublic_` (the §3 JSON columns parsed), `nwEmailKey_` / `nwPhoneKey_` / `nwNameKey_` / `nwDomainOf_`; dispatcher cases for the six ops

#### `live-site-pages/Network.html` — v01.10w
- **Review card on the existing editor (step 6):** `nwReviewSection` appends role (`NW_ENUMS.role`), the account block (company from the extraction, the "In the Profiler record as …" / "Not in the Profiler record" chip, the link-to-record checkbox, relationship defaulting to `target`, stage `none` with `gateStage` disabling the select outside `target` · `customer`, segment ids), source event, met date (from the record's `createdAt`), consent (`unknown`), do-not-contact, notes; choices persist as `rec.review` on the held record (`nwReviewOf` supplies the defaults) and show in the strip detail. Low-confidence inputs carry `.nw-low` from the same `nwUnclearFields` reading as the note. **Retry** (`nwRetryExtraction` — `nop=extract` with the same `c-` id from `_nwHeldB64` when this tab scanned the card, else the two files read back from Drive with the user's token) and **Swap** (`nwSwapSides` — links and held base64 swapped, files renamed best-effort) join the pill row with **Save**; a **Save all** bar over the stack (`nwSaveAll`, in `createdAt` order, a card needing a merge decision is left open and the run goes on)
- **Company resolution (step 7):** `nwRegistry` fetches `profiler-data/profiler-companies.json` once per page (relative URL — never a GitHub API endpoint) into name/aka and domain indexes; `nwResolveCompany` matches the normalised name (`nwNormaliseCompany`, the client mirror of `nwNormaliseCompany_`) then the card's domain and its parents; `nwExistingAccount` reuses an owned Account from the list payload (its relationship / stage / slug win); `nwResolveCard` caches per company+domain key
- **Save (steps 8–9):** `nwSaveCard` → `nop=dupcheck` → the merge sheet (`nwMergeSheet`: one row per differing field, radios with the new card checked by default, unchanged fields listed once, **Merge into …** / **Keep as a separate contact** / Cancel; emails and phones unioned on merge) or `nop=save` → `nwFileCard` moves both files browser-side (`nwEnsureAccountFolder` creates `<Company>/` under `Network App/` on first save and parks it through `nop=setfolders` `accounts`; `nwDriveMove` = `files.update` with `addParents` / `removeParents`) → `nop=links` → the pending record deleted → `nwAfterWrite()`. A Drive failure after the rows are written is soft (the contact is saved, the status says the photos stayed in `_inbox/`)
- **List rows:** `nwContactRow` — name · title · company (accounts joined from the list payload into `_nwAccountsById`), tap → `nwRowDetail` fetches `nop=get` and shows every field, the account line with slug, photo links and the history; **Delete** → `nop=delete` marks the row struck through with **Restore** → `nop=restore`; rows sorted newest-updated first
- CSS for the review selects and date input, the covered chip, the low-confidence outline, the second pill row, the Save-all bar, the merge sheet and the list-row detail

#### `scripts/check-network-schema.py` (new)
- The §14 checker: the six §4 enums (relationship, stage, role, interaction kind, signal kind, consent — plus draft status and signal source) byte-identical across `NETWORK-SCHEMA.md`, the `Network.gs` flat lists and the `Network.html` `NW_ENUMS` map with the schema's labels; the D5 stage rule mirrored on both sides (`NW_STAGE_RELATIONSHIPS`, `gateStage`, the server's refusal); every id literal in `verify-network-roles.py` and in itself matching `NW_ID_RE`; `nwNewId_` / `nwRandomBase36_` taking no name / email / company / date and every `nwNewId_(` call passing a one-letter prefix literal; every `auditLog(` in the PROJECT region with a `details` argument built from ids and counts only — a lexical check with an allow-list of keys, a forbidden-identifier list, id/count shapes (`.id`, `.length`, `nwFieldCount_(…)`, `? 1 : 0`) stripped first, and a bare identifier traced to its assignments in the same function. Exit 1 on any finding; negative-tested against `name: c.fullName`, `raw` and a traced `details[...] = name`

### Changed

#### `scripts/verify-network-roles.py`
- The GAS stub keeps state (contacts, accounts, folders, the body-POST log) and answers `nop=dupcheck` (a match on email), `nop=save` (the D5 refusal, account reuse, merge), `nop=links`, `nop=get`, `nop=delete` / `nop=restore`; the Drive stub answers the `PATCH … addParents=` move and the `<Company>` folder creation. After the session-1 checks: registry resolution (`ABB Ltd` and `new.global.abb` → `abb`, `Advanced Micro Devices, Inc.` → `amd`, `Acme Energy` → none), the review block's defaults (role other, target, stage none and enabled, consent unknown, DNC off, met date today, the actions row last), the D5 gate on `partner`, the choices persisted and shown, Retry issuing a fresh extract, Save with the request order asserted (`dupcheck`, `save`, then folder → setfolders → move → links → list), the payload (role, source event, consent, met date, account name / relationship / stage, empty slug, `raw` carrying `confidence`), the pending store empty, the account folder parked, the list row name · title · company, tap → `nop=get` detail, delete → restore, the merge sheet on a same-email card (`network-save-merge.png`) with Merge sending `mergeInto=` and the second card's two sides moved, Keep-separate sending `distinct=`, Save all filing two seeded cards, and the held-card delete on a seeded record

#### `README.md`
- Tree: `check-network-schema.py` entry; `verify-network-roles.py` and `Network.html` descriptions extended for session 2; Network displays v01.10w · v01.05g

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11: the N1 row flipped to **Done — v06.90r** with the versions and the done-when as it stands (the 20-card round-trip runs on the phone after this push); §13.6 written — the paste-in brief and prompt for N2 (accounts and the corpus attachment)

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for this run; the prior entry moved to Previous Sessions under the two-session cap

### Notes
- Still 2026-09-21 EST — 86 sections, eight dated today and exempt, 78 non-exempt; no rotation. CHANGELOG `Sections: 78/100` → `86/100`. On any later EST date all 86 are non-exempt and still under the trigger
- Verified: `node --check` on the `.gs` copy, `check-gas-inner-scripts.js` (96 blocks clean), `check-readme-tree.py` (0 findings), `verify-network-roles.py` (all checks passed, 0 page errors at 390 × 844), `check-network-schema.py` (exit 0)

## [v06.89r] — 2026-09-21 04:38:22 AM EST

> **Prompt:** "I scanned 20 cards into Network. Give me a prompt to paste into a new session (recommend model/effort) to run N1 session 2, then remember session."

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **The paste-in prompt for N1 session 2** (Fable 5.1 High, with the rationale that session 1 over-delivered an editor, notes, delete, rescan, the batch toggle and the name rule, so the review card builds on that editor), verbatim, as a block under §13.5 after session 1's: the reading list against the code as it now stands, the IndexedDB `pending` record shape and the instruction never to drop it (the developer's 20 cards are in it), steps 6–10 restated with the session-1 UI decisions that stand, Save / Save all, `nop=get`, the verification train including `check-network-schema.py` and the verifier's save round-trip, the §11 flip and the N2 brief as §13.6 / §13.7, the hand-off to write, the session-1 lessons, and the CHANGELOG state (85 sections, no rotation due on any later date)

### Changed

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for the N1 session-1 run (seven pushes v06.82r–v06.88r, the first rotation, the live card run, the UX rules the developer set); recommendation: paste the N1 session-2 prompt. The prior entry moved to Previous Sessions under the two-session cap

### Notes
- Still 2026-09-21 EST — 85 sections, seven exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `85/100`. On any later EST date all 85 are non-exempt and still under the trigger

## [v06.88r] — 2026-09-21 04:12:37 AM EST

> **Prompt:** "A few more changes:

* change "one-sided" and "two-sided" from a side-by-side format to a stacked format with "one-" and "two-" on top of "sided"; Format the "Front", "Back", "One-sided", and "Two-sided" buttons to take up the the left half of the row with the "Scan" and "Choose Photos" buttons also being the same size taking up the right half of the row. 
* move the "Extract" and "Clear" buttons above the "One-sided", "Two-sided", and "Choose Photos" buttons."

### Changed

#### `live-site-pages/Network.html` — v01.09w
- Capture-card control rows are two-column grids (`1fr 1fr`, `align-items: stretch`): Front / Back and Scan on the first row, Extract / Clear on the second, One- / Two-sided and Choose photos on the third — each toggle fills the left half as a two-cell grid, each button the right half at the same size (selectors scoped under `#nw-capture` to outrank the base `.nw-seg` inline-flex rule)
- The sides toggle renders stacked: "One-" / "Two-" over a small "sided" (`aria-label` keeps the full word for screen readers)
- Extract / Clear now sit above the sides + Choose photos row

#### `scripts/verify-network-roles.py`
- Asserts the row order (scan, extract, sides), that the two halves of the top row measure the same width and height, and that the sides buttons are stacked

### Notes
- Still 2026-09-21 EST — 84 sections, six exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `84/100`

## [v06.87r] — 2026-09-21 04:03:50 AM EST

> **Prompt:** "If a scanned card shows fully capitalized names like MOHAMMED S. ALRAI, then change that to a standard first-letter-capitalized-rest-not standard. However, do not automatically change anything other than these two use cases (fully capitalized and fully uncapitalized)."

### Changed

#### `live-site-pages/Network.html` — v01.08w
- `nwCapName` now handles exactly two cases: a name whose letters are ALL upper-case or all lower-case (judged on the romanised part, parentheses excluded) becomes First-letter-capitalised, the rest lower-cased, with a capital after each space, hyphen, apostrophe or period ("MOHAMMED S. ALRAI" → "Mohammed S. Alrai", "austin york" → "Austin York", "MARY-ANNE LEE" → "Mary-Anne Lee"); any mixed-case name is returned untouched ("Kamran Moradi, PhD", "Ronald McDonald"); a parenthesised native script is never changed. Applied on receipt, on edit and once to held cards, as before

#### `scripts/verify-network-roles.py`
- Seven `nwCapName` cases asserted in the page context: both conversions, mixed-case pass-through, hyphen and apostrophe handling, and the native-script parenthesis

### Notes
- Still 2026-09-21 EST — 83 sections, five exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `83/100`

## [v06.86r] — 2026-09-21 03:59:29 AM EST

> **Prompt:** "For all contact entries, make sure the first letter of both first and last names are capitalized even if the card isn't. Also, dont show any reminders for missing information anymore because there is too much variance in business cards. However, if a scanned picture is unclear somewhere, pop up a notification for me to either rescan or manually input the missing information. Also, for mass uploading contacts, make sure to give me a toggle between one- or two-sided cards, similar to the one  between front and back of a photograph. Rename "photograph" with "scan" and move the button to the right of the "front/back" toggle. In its original spot, that's where I want the "one/two" sided toggle. Also, give me the option to delete saved contacts."

### Added

#### `live-site-pages/Network.html` — v01.07w
- **Name capitalisation** (`nwCapName` / `nwTidyNames`): the first letter of every word in `fullName`, `firstName`, `lastName` (and after a hyphen or apostrophe) is upper-cased on receipt from the extraction, on an edit, and once for held cards at mount; nothing else in the name is touched, so "McDonald", "PhD" and a native script in parentheses survive
- **"Unclear in the scan" notification** on a held card, one per field read below `NW_CONFIDENCE_FLOOR`: **Rescan** (confirm → `nwDeleteCard(rec, true)` removes the held record and its Drive photos, resets the pair to Front and opens the camera), **Enter manually** (the editor on that field) and **Looks right**; the filed status says which fields looked unclear instead of the plain green signal
- **One-sided / Two-sided toggle for batches** (`_nwBatchSides`, `nwSetBatchSides`) in the slot Photograph used to occupy: a two-sided batch pairs consecutive photos (front, back, …) into one card each, an odd last photo is a front alone; `NW_MAX_BATCH` now counts cards
- **Delete on every held card** (`nwDeleteCard`): confirm, remove the strip and the IndexedDB record, and best-effort `DELETE /drive/v3/files/<id>` for each photo with the user's own `drive.file` token (`nwDriveIdFromLink` parses the id from the stored link; `nwDriveFetch` accepts a 204)

### Changed

#### `live-site-pages/Network.html` — v01.07w
- Photograph renamed **📷 Scan** and moved beside the Front / Back toggle (`.nw-toprow`); the batch button is now "🖼 Choose photos" (the 15-card cap is in its tooltip and the status line)
- The "Missing: …" cue and `nwMissingFields` are removed — cards vary too much for an absent field to mean anything

#### `scripts/verify-network-roles.py`
- The stub returns a lower-case, punctuated name and the assertions check it is capitalised ("Jane O’Doe-Smith"), no Missing cue, the sides toggle and Scan beside the side toggle, the unclear note with its Rescan button, Enter manually opening the editor, and the delete round-trip (dialog accepted, strip and record gone, a Drive DELETE issued; the Drive stub answers 204)

### Notes
- Still 2026-09-21 EST — 82 sections, four exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `82/100`
- Delete and Rescan act on held cards (nothing is in the spreadsheet yet); session 2's `nop=delete` soft-deletes saved rows per NETWORK-SCHEMA.md §13

## [v06.85r] — 2026-09-21 03:36:02 AM EST

> **Prompt:** "Rename "front photo" and "back photo" to "front" and "back", respectively and resize the buttons as needed so that they are all on the same row. Also, hide "one side" and "two sides". The existence of the front and back pictures will tell me how many sides the card has."

### Changed

#### `live-site-pages/Network.html` — v01.06w
- Held-card pills relabelled **Front** / **Back**; `.nw-strip-photos` is now a no-wrap row with each pill `flex: 1 1 0`, so Front, Back and ✎ Edit share one row at phone width (the Edit pill takes the same rule with an ink colour instead of its own)
- The meta line drops "one side / two sides" — the pills say it; "from QR" and "edited" remain

#### `scripts/verify-network-roles.py`
- Strip assertion follows the relabel and checks the side count is gone

### Notes
- Still 2026-09-21 EST — 81 sections, three exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `81/100`

## [v06.84r] — 2026-09-21 03:30:03 AM EST

> **Prompt:** "Hide each contact's identifier and the low-confidence list either. Instead, give me a removeable note that asks me to check a low-confidence source and an option to edit the contacts after they are saved. That way, I can manually add the low-confidence information and remove the reminder. If one card didn't successfully extract a field (ie: website) that other cards did, I want to see that this contact is missing that information field, so I can try to make it up."

### Added

#### `live-site-pages/Network.html` — v01.05w
- **Removable "check" notes** on a held card: one per field the model read with confidence below `NW_CONFIDENCE_FLOOR` ("Check the website against the card — it was read with low confidence"), each with **Fix** (opens the editor on that field) and **Looks right** (dismisses it — `rec.dismissed[field]`, confidence set to 1, persisted to the IndexedDB `pending` record so it stays gone after a reload)
- **"Missing: …" line** (`nwMissingFields`): fields empty on this card that at least one other held card carries, with **Add** opening the editor on the first of them; repainted for every held card after any edit, since an added field changes what counts as usual for the stack
- **Inline editor** (`nwEditCard`, `NW_EDIT_FIELDS`): name, title, company, department, emails, phones, address, website, LinkedIn on every held card (✎ Edit, or from a note); emails and phones as comma-separated text keeping the kinds already read; an edited field becomes confidence 1 and its note clears; the record is written back to IndexedDB (`nwPendingSave`) and flagged `edited`. Nothing leaves the phone — the same form becomes session 2's review card ahead of `nop=save`

### Changed

#### `live-site-pages/Network.html` — v01.05w
- The strip no longer shows the `c-` id or the raw `check:` list (both stay in the record); the meta line reads sides · from QR · edited · held on this phone; `nwRenderStrip` replaces an existing strip in place, keeping its open state

#### `scripts/verify-network-roles.py`
- The stub now returns a low-confidence website; the drain scenario asserts no id and no `check:` on the strip, exactly one check note, Fix focusing the website input, and after a save no note, no editor, the "edited" flag, the new phone on the strip and the updated record in IndexedDB (`network-capture-edited.png`)

### Notes
- Prompted after the first live card showed `c-09zfk101vmaah · check: website` under the name. Still 2026-09-21 EST — 80 sections, two exempt, 78 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `80/100`
- Editing a held card is session 2's step 6 pulled forward at the developer's request; dedupe, company resolution and `nop=save` (steps 7–9) remain session 2's

## [v06.83r] — 2026-09-21 03:17:50 AM EST

> **Prompt:** "Ok, closing the other open apps resolved that issue. I want to be able to clearly see the progress so create a visible, easy to understand progress bat and status. When a card is successfully filled away, give a clear signal to continue scanning. Also, I want to be able to easily choose to view the original picture for all filed cards. Currently, I have no way to interact with the saved contacts."

### Added

#### `live-site-pages/Network.html` — v01.04w
- **A four-step progress bar** (Id → Upload → Read → Filed) under the capture buttons, driven by the pipeline: `nwProcessPair` now reports a step with every status (`onStatus(text, level, step)`), `nwCaptureStatus` forwards it to `nwProgressSet`, and the batch and the queue drain title the bar with "card *i* of *n*"; a failure turns the bar red at the step it stopped, Clear hides it
- **The "go on" signal** (`nwCaptureDone`): a green bold "✓ Filed — ready for the next card. Tap Photograph." line, a short vibration where the phone allows it, and a two-beat green pulse on the Photograph button; the batch summary and the drain end the same way
- **Photo links on every held card**: `nwRenderStrip` adds "🖼 Front photo" / "🖼 Back photo" pills opening the Drive links the upload returned (new tab, `noopener`), or a "photos not filed — retried on save" note when Drive was skipped
- **Tap a name for the fields read**: the strip head toggles a definition list of every extracted field (name, title, company, department, emails, phones, address, website, LinkedIn, other, languages, capture time), with fields below `NW_CONFIDENCE_FLOOR` in the low-confidence colour — view only; editing and saving are session 2's review card

### Changed

#### `scripts/verify-network-roles.py`
- Asserts the idle progress bar for admin, and after the drain the green Filed signal on both bar and status, one photo link and at least four detail rows on the strip; taps the strip and checks it opens (`network-capture-detail.png`)

### Notes
- Prompted by the first live card (v01.03w / v01.04g on the phone, one side, filed in Drive, `check: website`): the pipeline worked but showed its progress as one line of text
- **"No way to interact with the saved contacts" — nothing is saved yet.** A strip is a card held on the phone after extraction; the Contacts list stays at 0 until session 2's `nop=save`. This pass makes held cards viewable (photos, fields), not editable
- **First rotation on the new EST day**: 104 sections, none exempt (today's is the new one), 104 non-exempt ≥ 100 → the 2026-09-15 date group (26 sections, v05.79r–v06.04r) moved to `CHANGELOG-archive.md` with SHA enrichment on every header (26 of 26 resolved on the deep clone; v05.90r's push commit carries no version prefix and was matched by its 04:43 timestamp). 79 sections remain, 78 non-exempt. CHANGELOG `Sections: 78/100` → `79/100`

## [v06.82r] — 2026-09-20 09:55:33 PM EST

> **Prompt:** "Run N1 session 1 — capture and extraction — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.5 is the brief (follow its reading list in order, then steps 1–5 of Session 1 exactly; do not start session 2's steps 6–10 — the review card, dedupe, save and the schema checker are the next session's), §4.2 is the pipeline it implements, and repository-information/NETWORK-SCHEMA.md §1, §3, §6, §7, §12, §13 are the shapes you build against. D6 is Gemini only (the Receipts geminiExtractFromBase64_ idiom with the §7 responseSchema, GEMINI_API_KEY from this project's Script Properties, no second vendor), D8 opaque ids (nop=newid mints the c- id before upload so the filename is opaque from the first byte), D9 the privacy posture (audit rows carry the c- id and a field count only — never a card field), D14 no data poll (fetch on load, on visibilitychange, after writes; nwAfterWrite() is the refresh). Build in the PROJECT regions of Network.gs and Network.html only — never edit a TEMPLATE region. Verify with node --check on a .js copy of Network.gs (Node refuses the .gs extension), scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-network-roles.py (the capture card present for admin, absent for the other three tiers, at phone width, zero page errors) and served Playwright screenshots of the capture card with a queued count. Page + GAS bumps with changelogs, CHANGELOG entry, no §11 flip (N1 closes at session 2) — then write my hand-off in chat: the GEMINI_API_KEY Script Property to set, the drive.file consent the first upload will ask for, and what to photograph for the session-2 done-when (20 real cards, three Chinese-script, two two-sided). Do not touch Events, the list's filters or exports (N3), accounts beyond what capture needs (N2), or any interval (Q). Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG stands at Sections: 103/100 with seven sections dated 2026-09-20 EST exempt (96 non-exempt): if your push lands on 2026-09-21 EST or later, the exemption lifts and 103 non-exempt is over the 100 trigger, so the oldest date group (2026-09-15) rotates into the archive with SHA enrichment on every header — read the counter and CHANGELOG-archive.md §"Rotation Logic" before assuming otherwise. One push."

### Added

#### `googleAppsScripts/Network/Network.gs` — v01.04g
- **N1 session 1 — extraction (D6 Gemini only, NETWORK-SCHEMA.md §7).** `GEMINI_MODEL` / `GEMINI_FALLBACK_MODEL` pinned as in Receipts; `nwExtractionSchema_()` is the §7 `responseSchema` verbatim (`fullName … languages[], rawText, confidence{}` with the seven confidence keys required); `NW_EXTRACTION_PROMPT` carries the §7 rules (romanise CJK and keep the native script in parentheses, a second image is the back of the same card, never invent a field, honest per-field confidence); `nwExtractFromBase64_(frontB64, backB64, mime)` is `geminiExtractFromBase64_` with both images as `inline_data` parts in one call, the key from this project's `GEMINI_API_KEY` Script Property, the three-leg retry plan (primary, primary after 2 s, fallback after 1 s) and an error that is a code only (`gemini_http_<n>`, `gemini_parse_failed`, `gemini_key_missing`) so it can be audited
- `nwNormaliseExtraction_(raw, qr)` coerces the answer into the §7 shape (kinds validated against `NW_EMAIL_KINDS` / `NW_PHONE_KINDS`, confidence clamped 0–1, absent → 0) and merges QR-decoded fields over the model's with confidence 1; `nwFieldCount_()` is the only per-extraction number an audit row may carry
- `nop=newid` (D8: mints the `c-` id through `nwNewId_` before the upload so the Drive filename is opaque from the first byte; `c` prefix only) and `nop=extract` (`nwExtractOp_`: body-POST only, `contactId` validated against `NW_ID_RE`, both images ≤ 7,000,000 chars, MD5-digest cache of the pair for 600 s, audit rows `network_extract` / `network_extract_failed` carrying `{ contactId, fields, sides }` / `{ contactId, error }` — never a card field, §12) on `handleNetworkOp_`

#### `live-site-pages/Network.html` — v01.03w
- **The capture card** (`nwCaptureMount`, admin only — the inputs never enter the DOM for a turned-away tier): the Receipts inputs (`capture="environment"` single, `multiple` batch of `NW_MAX_BATCH` = 15) behind two buttons, a Front / Back segmented toggle that stages a pair (`_nwPair`) with thumbnails and flips to Back after the front is captured, Extract / Clear, a status line and the queued count with a "send now" link; `nwCompressImage` unchanged at 2,000 px / 0.82
- **IndexedDB offline queue** (`nw-capture` db, stores `queue` + `pending`, no Worker): when `navigator.onLine` is false the compressed pair is queued and the count shows on the card; `nwQueueDrain()` runs on `online` (and once on mount) through the same `nwProcessPair` pipeline, oldest first, deleting each record only after success and stopping at the first failure; `pending` holds extracted-but-unsaved cards across a reload for session 2's review card
- **Own-Drive upload** with the user's `drive.file` token from a separate token client (`NW_DRIVE_SCOPE`; the sign-in scope is untouched, so the first upload asks the consent once): `nwEnsureFolders` creates `Network App/` and `_inbox/` browser-side on first use and parks the ids through `nop=setfolders` (read back from the list payload on load, `nop=folders` on demand), `nwUploadPair` files `<c-id>-front.jpg` / `-back.jpg` by multipart upload; a Drive failure is soft — the extraction still runs and the pending record remembers `driveError`
- **QR decode** with `BarcodeDetector` where present (`nwQrDecode` → `nwParseQr`: vCard FN/N/ORG/TITLE/EMAIL/TEL/ADR/URL, or a bare URL), merged before the model call; a vCard naming the person with an email or phone (`nwQrSufficient`) fills the card without a model round-trip (`nwQrExtraction`, confidence 1 on carried fields, 0 elsewhere)
- `nwApiBody()` — the `_gasPostBody` idiom (form-urlencoded body, three attempts, no GET fallback) for `nop=extract`; `nwProcessPair` orders newid → upload → QR-or-extract → pending → strip, spacing model calls ≥ 6.5 s in a batch or drain; `nwRenderStrip` shows the name / title · company / id · sides · Drive filed / "check:" fields below `NW_CONFIDENCE_FLOOR`
- `nwLoadList` keeps the capture card and re-renders only `#nw-listwrap`, and reads `folders` from the list payload into `_nwFolders`; `nwEnsureFolders` calls `nwAfterWrite()` after `setfolders` (D14)

### Changed

#### `scripts/verify-network-roles.py`
- Asserts the capture card (card, both inputs, the toggle, a queued count of 0) for admin and its absence for contributor / analyst / viewer; a new scenario takes the context offline, stages a canvas-generated card photo, taps Extract and checks the queue reads 1 with no request issued (`network-capture-queued.png`), then reconnects and checks the drain mints the id before the Drive upload, the strip renders and the count returns to 0 (`network-capture-extracted.png`); the GAS stub answers `nop=newid` / `folders` / `setfolders` and a body-POST `nop=extract`, and a Drive stub answers folder creation and the multipart upload

### Notes
- Still 2026-09-20 EST at the push (09:55 PM) — 104 sections, eight exempt, 96 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `104/100`. The first push dated 2026-09-21 EST or later rotates the 2026-09-15 date group (unshallow first)
- §11's N1 row is unchanged (Proposed) — it flips at the close of session 2, which also writes the N2 brief as §13.6

## [v06.81r] — 2026-09-20 09:14:47 PM EST

> **Prompt:** "give me a prompt to paste into the next session (with recommended AI model/effort level) in the action plan, then remember session."

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **The paste-in prompt for N1 session 1** (Fable 5.1 High, with the model/effort rationale and the note that E0 can run beside it), verbatim, as a block under §13.5: steps 1–5 of the brief only, the D6/D8/D9/D14 constraints restated, the verification train, the hand-off to write in chat, and the rotation state the push will meet

### Changed

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for the Q0 session (v06.79r rollout, v06.80r probe table, this push); recommendation: paste the N1 session-1 prompt. The prior entry moved to Previous Sessions under the two-session cap

#### `README.md`
- `Last updated` and `Repo version` refreshed

### Notes

- Still 2026-09-20 EST — 103 sections, seven exempt, 96 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `103/100`.

## [v06.80r] — 2026-09-20 09:11:43 PM EST

> **Prompt:** *(same Q0 prompt as v06.79r — the post-merge step: "after the merge, run `bash scripts/check-quota.sh` and paste its table into the CHANGELOG entry's Notes")*

### Changed

#### `repository-information/CHANGELOG.md`
- The v06.79r section's Notes now carry the first `check-quota.sh` table: six deployed projects answered on their new GAS versions, three placeholder-id projects skipped, 27 executions today (Network 26, Profiler 1) against 20,000/day

#### `README.md`
- `Last updated` and `Repo version` refreshed

### Notes

- Q0 is complete end to end: op rolled out, script verified live, §11 row Done. Still 2026-09-20 EST — 102 sections, six exempt, 96 non-exempt, no rotation. CHANGELOG `Sections: 78/100` → `102/100`.

## [v06.79r] — 2026-09-20 09:06:03 PM EST

> **Prompt:** "Run Q0 — the quota-counter rollout — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §3 row D14 and the §8 Q0 row are the whole spec. Read first `nwQuotaProbe_()` and the two `op=quota` dispatch lines beside `op=aclhealth` in `googleAppsScripts/Network/Network.gs` `doGet` (the source of truth — copy it, do not redesign it), the `op=aclhealth` dispatch in `Receipts.gs` `doGet` as the precedent for where a PROJECT-marked unauthenticated probe sits inside the AUTH `doGet`, `scripts/check-acl-health.sh` (the probe-script shape to follow, including how it discovers projects from the `.gs` files and skips `YOUR_DEPLOYMENT_ID` projects), and `.claude/rules/gas-scripts.md` §"Template vs Project Code Separation". Then, in **one commit**: (1) copy the function into the eight existing projects — Classroom, Globalacl, MasterACL, Profiler, Receipts, Scraper, Testauthgas1, Testauthhtml1 (`Claspdeploytest` has no config and is not a project) — as `quotaProbe_()` with the same body and comment, and rename Network's `nwQuotaProbe_` to `quotaProbe_` so all nine read identically for Q's grep; it depends only on template globals (`SPREADSHEET_ID`, `AUTH_CONFIG`, `ACL_PAGE_NAME`, `VERSION`, `getEpochCache`) that every auth project has, and every one of the eight already runs with `ENABLE_AUDIT_LOG` on (the two `standard`-preset projects, Classroom and Profiler, override it on), so no preset changes; (2) add the `if (action === 'api' && op === 'quota')` dispatch beside `op=deploy` in each `doGet`, marked `// PROJECT:` exactly as Network's is; (3) write `scripts/check-quota.sh` on the `check-acl-health.sh` shape — one row per deployed project (`page`, `gasVersion`, `date`, `executions`, the top three `byEvent` keys), a total across the fleet against the 20,000/day account quota, `audit_log_disabled` / `spreadsheet_not_configured` surfaced as warnings not failures, exit 0 healthy / 1 any probe unreachable / 2 nothing probed; (4) nine GAS bumps with nine GAS changelog entries (user-facing: "a daily execution counter the operator can read"), no page bumps (no HTML changes), README tree entry for the script, CHANGELOG entry, flip §11's Q0 row to Done with the version. Verify with `node --check` on every `.gs` copy and `scripts/check-gas-inner-scripts.js`; after the merge, run `bash scripts/check-quota.sh` and paste its table into the CHANGELOG entry's Notes (the three placeholder-id projects — Globalacl, Testauthgas1, Testauthhtml1 — never deploy, so their copies are repo-only bookkeeping and the script skips them; the deployed six plus Network answer). Do not touch `Events` (E1 inherits the op from the shared template region when it is scaffolded), do not change any interval (that is Q), do not add auth to the probe (counts only, never a user or a details cell — the trust model is `aclhealth`'s). Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first. The repo CHANGELOG stands at `Sections: 78/100` with four sections dated 2026-09-20 EST exempt: **if your push lands on 2026-09-21 EST or later, 100 non-exempt reaches the 100 trigger and the oldest date group rotates** into the archive with SHA enrichment on every header — read the counter and `CHANGELOG-archive.md` §"Rotation Logic" before assuming otherwise."

### Added

#### `scripts/check-quota.sh`
- **Fleet execution-quota probe** on the `check-acl-health.sh` shape: discovers every project whose `doGet` dispatches `op=quota`, skips the placeholder-id projects, prints one row per deployed project (page, GAS version, date, executions, top three `byEvent` keys) and a fleet total against the 20,000/day account quota. `audit_log_disabled` / `spreadsheet_not_configured` are warnings; an empty or non-JSON body (or `audit_log_unreadable`) is a failure. Exit 0 healthy / 1 any probe unreachable / 2 nothing probed. README tree entry added

#### `googleAppsScripts/*` — Classroom, Globalacl, MasterACL, Profiler, Receipts, Scraper, Testauthgas1, Testauthhtml1
- **`quotaProbe_()` + the `op=quota` dispatch** copied verbatim from `Network.gs` into all eight (same body, same comment; the dispatch sits beside `op=deploy` — after `op=aclhealth` in Profiler and Receipts — marked `// PROJECT:` exactly as Network's). The function lives in each file's first PROJECT region (after `aclHealthProbe_` where one exists). It depends only on template globals every auth project has; no preset changes (all eight already run `ENABLE_AUDIT_LOG` on). GAS bumps: Classroom v01.86g, Globalacl v01.09g, MasterACL v01.15g, Profiler v01.40g, Receipts v01.30g, Scraper v02.21g, Testauthgas1 v01.08g, Testauthhtml1 v01.08g — one page/GAS changelog entry each

### Changed

#### `googleAppsScripts/Network/Network.gs`
- `nwQuotaProbe_` renamed to `quotaProbe_` so all nine copies read identically for Q's grep (v01.03g)

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11 Q0 row flipped to **Done — v06.79r**

#### `README.md`
- `check-quota.sh` tree entry; nine GAS version displays; `Last updated` and `Repo version` refreshed

### Notes

- **No page bumps** — no HTML changed. Events is untouched (E1 inherits the op from the shared template region); no interval changed (that is Q); the probe carries no auth (counts only, never a user or a details cell — aclhealth's trust model).
- **Verified** with `node --check` on all nine `.gs` copies (copied to `.js` in the scratchpad, since Node refuses the `.gs` extension), `scripts/check-gas-inner-scripts.js` (10 files, 96 inner blocks clean) and `scripts/check-readme-tree.py` (0 findings).
- **The three placeholder-id projects** — Globalacl, Testauthgas1, Testauthhtml1 — never deploy, so their copies are repo-only bookkeeping and the script skips them; the deployed six plus Network answer. The first `bash scripts/check-quota.sh` table lands in the follow-up push once this merge has deployed the nine scripts.
- **First `bash scripts/check-quota.sh` run, after the merge deployed the nine scripts** (2026-09-20 09:10:55 PM EDT, exit 0) — every deployed project answers on its new GAS version, which is the deploy confirmation:

  ```
          page          gas      date       executions  top events
    OK    Classroom     v01.86g  2026-09-20          0  -
    SKIP  globalacl     not deployed (no deployment id)
    OK    MasterACL     v01.15g  2026-09-20          0  -
    OK    Network       v01.03g  2026-09-20         26  security_alert 12, data_read 8, login_success 3
    OK    Profiler      v01.40g  2026-09-20          1  security_alert 1
    OK    Receipts      v01.30g  2026-09-20          0  -
    OK    Scraper       v02.21g  2026-09-20          0  -
    SKIP  testauthgas1  not deployed (no deployment id)
    SKIP  testauthhtml1 not deployed (no deployment id)

  TOTAL — 27 execution(s) today across 6 probed project(s) = 0% of the 20000/day account quota.
  ```
- **No rotation fired.** The push lands on 2026-09-20 EST: 101 sections total, five dated today exempt, 96 non-exempt → below the 100 trigger. The first push dated 2026-09-21 EST or later rotates the oldest date group (2026-09-15). CHANGELOG `Sections: 78/100` → `101/100`.

## [v06.78r] — 2026-09-20 08:53:15 PM EST

> **Prompt:** "ive signed into Network.html once more - see screenshot. Give me a prompt to paste into a new Fable 5.1 Medium session to start Q0, then remember session." — and, mid-turn: "Upon checking the overall Network and Events plan, I noticed Q0 is supposed to be the last phase of the plan. Evaluate the plan again and give me a prompt to paste that is confirmed to be the next step."

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **The paste-in prompt for the Q0 session** (Fable 5.1 Medium), verbatim, as a block under §13.3 beside the N0 prompt: copy `nwQuotaProbe_()` + the `op=quota` dispatch into the eight existing projects as `quotaProbe_()` (Network renamed to match — nine GAS bumps), `scripts/check-quota.sh` on the `check-acl-health.sh` shape, the placeholder-id projects skipped by the script, the CHANGELOG rotation the push will trigger on 2026-09-21 EST or later, and the do-nots (no Events, no interval change, no auth on the probe)

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11 N0 row: the live done-when closed 2026-09-20 — deployed `AKfycbxu…c0_U8`, admin signed in, `op=deploy` → `Already up to date (v01.02g)`, `op=aclhealth` → `acl_ok`, `op=quota` answering, `check-acl-health.sh` lists Network; the bootstrap lesson for E1 recorded (Manage deployments → Edit → New version once, by hand)

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for the N0 session (v06.76r scaffold, v06.77r deployment id, the live verification, this push); recommendation: paste the Q0 prompt. The prior entry moved to Previous Sessions under the two-session cap

#### `README.md`
- `Last updated` and `Repo version` refreshed

### Notes
- **Order confirmed against the plan (the developer asked whether Q0 is the last phase):** it is not — there are two quota phases. **Q0** (the counter rollout) follows N0 in D16's decided sequence (§3 line "Gate → N0 → **Q0** → N1 …"), in §8's Q0 row, in §9 and in §11 ("after N0"); **Q** (the quota *review*) is the final phase, "after E5" in §8 and §11. No reordering was made; the Q0 prompt is the confirmed next step
- **Live probe results this session (no push):** `op=quota` reported 23 executions on 2026-09-20 including 12 `security_alert` rows — most plausibly `data_access_expired_session` retries during the redeploy window; the developer may confirm in the `SessionAuditLog` Details column. `grace: NOT armed` on Network arms on the next sign-in against v01.02g (the developer has since signed in once more)
- **§13 numbering collision for the next brief-writer:** the N1 brief reserves §13.6 for N2 and the E0 brief reserves §13.6 for E1 — first writer takes 13.6, the other 13.7
- **No rotation — but at capacity.** 100 sections, four dated 2026-09-20 EST exempt → 96 non-exempt against the 100 trigger; counter `Sections: 78/100`. The first push dated 2026-09-21 EST or later finds 100 non-exempt and rotates the oldest date group

## [v06.77r] — 2026-09-20 08:38:53 PM EST

> **Prompt:** "set Network DEPLOYMENT_ID to AKfycbxuayBnl0pM0upSFEoqUkaW4bbXbVCKGKeGVdcgKiBM5FBj_ykQn30BINHyJMvc0_U8"

### Changed

#### `googleAppsScripts/Network/Network.config.json`
- `DEPLOYMENT_ID` set to the developer's first Web-app deployment (`AKfycbxu…c0_U8`) — the workflow's `Deploy Network` step now fires the self-update webhook on every `Network.gs` merge

#### `googleAppsScripts/Network/Network.gs` — v01.02g
- `DEPLOYMENT_ID` synced from the config per [PC-GAS-CONFIG] #14

#### `live-site-pages/Network.html` — v01.02w
- `var _e` set to the base64 of the reversed `/exec` URL (decoded and round-trip-checked), so the page now creates its GAS iframe and the fetch transport has a base URL; sign-in reaches the live backend

#### `README.md`
- Network version displays v01.02w · v01.02g; `Last updated` and `Repo version` refreshed

### Notes
- **Deploy hand-off status**: Part A (project, manifest, GCP link, `GITHUB_TOKEN`, grant — `diagnoseAuthorization` reported all seven declared scopes granted, nothing outstanding) and Part B (deployment + this sync) are done. **Next for the developer — Part C**: once this merges, load `Network.html` once so `registerSelfProject()` creates the `Network` column in the Master ACL Access tab, tick TRUE on your row (role `admin`), run `clearAllAccessCache` from the editor, then sign in; the first admin list call creates the eight tabs. Then Part D: `?action=api&op=deploy` → `Already up to date (v01.02g)`, `op=aclhealth` → `acl_ok`, `op=quota`, `bash scripts/check-acl-health.sh`
- **The webhook's first real run is this merge**: `Network.gs` changed, so the `Deploy Network` step calls `doPost(action=deploy)` against the new id and the live script pulls v01.02g from `main` — the GET probe above confirms it
- **No rotation.** 99 sections, four dated today (exempt) → 95 non-exempt against the 100 trigger

## [v06.76r] — 2026-09-20 12:56:34 AM EST

> **Prompt:** "Run N0 — the Network scaffold — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md. Read the plan's §3 (every decision row is decided — D7 admin-only, D14 no data poll, D1 the Profiler "Ecosystem" relabel), §8 (the N0 and Q0 rows) and §13.3 (the N0 brief — follow its eight steps exactly, in order), then repository-information/NETWORK-SCHEMA.md in full, and the reading list §13.3 opens with. Do not build capture, extraction or the list (that is N1); do not scaffold Events (E1); do not touch Scraper. Before running scripts/setup-gas-project.sh, ask me for the values only I hold — SPREADSHEET_ID, CLIENT_ID, and whether the Global ACL default for MASTER_ACL_SPREADSHEET_ID is right — then run it once; every other key in the JSON is fixed by §13.3 step 1. Build the PWA files with the manifest-src 'self' override on both CSP tags, the admin-only door on both sides and scripts/verify-network-roles.py, ensureNetworkTabs_() with exactly the NETWORK-SCHEMA.md §3 columns and the §4 enum mirrors, NW_ID_RE / nwNewId_, the folder ops, the D14 intervals (600 s heartbeat, no data poll — both .gs and .html per [PC-SESSION-SYNC] #20) and the op=quota API, and the Profiler "Ecosystem" relabel with its Profiler page bump, page changelog and a clean scripts/verify-profiler-roles.py run. Verify with node --check on the .gs copy, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, and served Playwright screenshots (scripts/playwright-harness.py) of admin's empty list and the three turned-away cards at phone width with zero page errors. End by writing my deploy hand-off steps in chat (§13.3 step 7), flipping §11's N0 row to Done with the version, and writing the N1 brief as §13.5 of the plan — then one push. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. The repo CHANGELOG rotated at v06.75r — read its Sections: counter before assuming anything about rotation."

### Added

#### `live-site-pages/Network.html` — v01.01w
- **N0 scaffold of the Network app** (design plan §13.3, all eight steps). Generated by `scripts/setup-gas-project.sh` from the auth template (`hipaa` preset, `ACL_PAGE_NAME: Network`, `PORTAL_ICON: 📇`, the developer's `SPREADSHEET_ID` `1YjY3…ptBiQ`, the fleet `CLIENT_ID`, the fleet Master ACL `1kG2K…UvE` passed explicitly because the Global ACL config the script would default from still carries its placeholder); ten files created, GAS Projects table row, README tree entries, REPO-ARCHITECTURE nodes and the `Deploy Network` workflow step registered by the script
- **PWA**: `network.webmanifest` on the `receipts.webmanifest` shape (`id` / `start_url` / `scope` = `./Network.html`, `display: standalone`), `images/network-icon-192.png` + `-512.png` (Pillow-drawn card glyph on the app's navy, `any maskable` on the 512), `<link rel="manifest">`, `theme-color`, `apple-touch-icon` and the standalone metas; the **`manifest-src 'self'` PROJECT OVERRIDE on both CSP tags** (template ships `'none'`); `worker-src 'none'` stays — no service worker (D2)
- **The door, client half (D7 — admin-only)**: `NW_ROLE_CAPS` with all four tier keys (admin holds `contacts` · `accounts` · `profiler` · `signals` · `drafts` · `export` · `purge`, the other three empty), `nwRole()` / `nwPreviewRole()` / `nwEffectiveRole()` / `nwCan()` / `nwAdmitted()` with only-subtracting `?as=` preview semantics; `nwRenderDenied()` paints the turned-away card for non-admin tiers **before any request is issued** (`nwLoadList` is never reached); the grouped `NW_ENUMS` map with display labels mirroring NETWORK-SCHEMA.md §4
- **Surface**: masthead (`#nw-header`, the Classroom/Profiler editorial family, 62 px top margin to clear the template's fixed user pill on a phone), `#nw-backdrop` above the template's GAS iframe, `nwApi()` over `_gasPost` (`action=network` with the `op=network` GET mirror), `nwLoadList()` rendering contact/account counts and the empty list, `nwAfterWrite()` and a `visibilitychange` refetch (D14 — no data poll), the `showApp` wrapper mounting `nwAppMount()`
- **D14 intervals** in `HTML_CONFIG`: `HEARTBEAT_INTERVAL: 600000`, `DATA_POLL_INTERVAL: 0` with a PROJECT OVERRIDE note (the template declares the poll interval but never arms a timer from it; nothing may) — paired with the `.gs` per [PC-SESSION-SYNC] #20

#### `googleAppsScripts/Network/Network.gs` — v01.01g
- **The door, server half**: `NW_ROLE_CAPS`, `nwRoleOf_` / `nwAdmitted_` (`role === 'admin'`) / `nwCan_` / `nwRequire_` on the Classroom pattern — every turned-away tier writes a `security_alert` audit row carrying op name and tier only
- **Enums (D5)**: the flat lists `NW_RELATIONSHIPS`, `NW_STAGES`, `NW_ROLES`, `NW_INTERACTION_KINDS`, `NW_SIGNAL_KINDS` (+ consent, draft status, signal source, and `NW_STAGE_RELATIONSHIPS` for the D5 validator rule), byte-identical to NETWORK-SCHEMA.md §4
- **Ids (D8)**: `NW_ID_RE` (`^[acisdm]-[0-9a-z]{13}$`), `nwRandomBase36_()` (SHA-256 over `Utilities.getUuid()`, first 8 bytes → 13 base36 digits by 64-bit long division), `nwNewId_(prefix, takenIds)` collision-checked against the tab — never a name, never a date
- **Tabs**: `ensureNetworkTabs_()` creating `Accounts` · `Contacts` · `Interactions` · `Signals` · `Mailings` · `Drafts` · `Shares` · `Profiles` with exactly the §3 columns in order (`NW_TABS`), frozen row 1, in-place header upgrade; `nwNormaliseCompany_()` (the §3 dedupe key)
- **Folder registry**: `PROP_NW_FOLDERS` with `nwFoldersGet_` / `nwFoldersSet_` (`root`, `inbox`, `accounts{}` map, id-shape checked) — the Profiler `recfolders` precedent, exposed as `nop=folders` / `nop=setfolders`
- **Ownership**: `getShareScope_`, `resolveOwnerScope_`, `resolveOwnerSet_` and the not-found-not-forbidden convention copied verbatim from `Receipts.gs` (the D7 widening path; `Shares` has no UI in v1)
- **Ops**: `handleNetworkOp_()` (`action=network`, `nop=list|folders|setfolders`) wired into `doPost` and the `doGet` `action=api` fallback; `nop=list` returns the minimum-necessary subset via `nwListRows_()` with soft-deleted rows filtered and an audit row of counts only
- **`?action=api&op=quota` (D14)**: `nwQuotaProbe_()` — today's `SessionAuditLog` rows (EST) grouped by event, `{ success, date, tz, executions, byEvent }`, counts only, 60 s cache, bounded 5,000-row read; **this is the op Q0 copies into the other eight projects**. `op=aclhealth` ported beside it so `scripts/check-acl-health.sh` enrols the project automatically
- **D14 intervals**: `PROJECT_OVERRIDES.HEARTBEAT_INTERVAL: 600` (paired with the `.html`)

#### `scripts/verify-network-roles.py`
- The four-tier door check on the `verify-profiler-roles.py` shape: serves `live-site-pages/`, seeds the page-scoped session the way `saveSession()` writes it, gives the page a stub base URL and answers the fetch transport's load-time heartbeat, then asserts per tier — admin: the empty list and exactly one `nop=list` request; contributor / analyst / viewer: the turned-away card and **zero** data requests; `?as=viewer` on admin turns away, `?as=admin` on viewer gains nothing; zero page errors. Phone-width (390 × 844) screenshots per tier. **Passes.**

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **§13.5 — the N1 brief** (capture → extraction → review → save, two Fable 5.1 High sessions), written at the close of N0 per the Classroom rule

### Changed

#### `live-site-pages/Profiler.html` — v01.91w
- **D1 relabel**: the `#network` explorer heading `'Ecosystem Network'` → `'Ecosystem'` and the denied-view sentence to match; the `network` capability key, the `#network` hash and the masthead button are untouched. `scripts/verify-profiler-roles.py`'s deep-link label `'ecosystem network'` → `'ecosystem'`; the 13 × 4 matrix is unchanged and every tier's deep-link assertion passes

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11: **N0 → Done — v06.76r** (what landed; the live-page checks — sign-in, `DEPLOYMENT_ID`, the webhook GET probe — wait on the developer's deploy); Q0's row now names `nwQuotaProbe_()` as the source to copy

#### `repository-information/REPO-ARCHITECTURE.md`
- Flowchart: `NETWORK_PAGE` and `GAS_NETWORK` nodes and their five edges (added by the setup script); the Flowchart's mermaid.live URL regenerated and decompression-verified (9,178 chars). The file carries no `<details>` copy blocks, so none was mirrored

#### `README.md`
- Tree: `network.webmanifest`, `scripts/verify-network-roles.py`, the Network page entry's description; version displays Profiler v01.91w, Network v01.01w · v01.01g (`check-readme-tree.py`: 0 findings); `Last updated` and `Repo version` refreshed

### Notes
- **Setup script input** (§13.3 step 1): the developer supplied `SPREADSHEET_ID` = `1YjY3XMXDGwhW4U-lf3aKxGTJz5JvMyQcdCyVWdptBiQ`, chose the fleet `CLIENT_ID`, and confirmed the fleet Master ACL id after the session found that `globalacl.config.json`'s own `MASTER_ACL_SPREADSHEET_ID` is still `YOUR_MASTER_ACL_SPREADSHEET_ID` — the script's Global ACL auto-default therefore resolves to nothing and the id had to be passed explicitly. Both generated files carry the real id (Setup GAS Project Command step 3 verified)
- **Deploy hand-off** (§13.3 step 7), for the developer: (1) create the Apps Script project and paste `Network.gs`; (2) Project Settings → show `appsscript.json` and set it from `.claude/rules/gas-scripts-reference.md` §"Setup Steps" (includes `script.scriptapp`); (3) link the GCP project and enable the Apps Script API and the Google Drive API on it; (4) Deploy → New deployment → Web app → execute as me, access Anyone; (5) paste the deployment id into `googleAppsScripts/Network/Network.config.json` `DEPLOYMENT_ID` and sync per [PC-GAS-CONFIG] #14 (the `.gs` `DEPLOYMENT_ID` and the page's `var _e` = base64 of the reversed `/exec` URL); (6) set `GITHUB_TOKEN` in Script Properties; (7) run any function from the editor, open the consent screen as the script account and **tick every checkbox** (a partial grant reproduces the Receipts v02.59r outage); (8) load `Network.html` once so `registerSelfProject()` creates the `Network` column in the Master ACL's Access tab, tick TRUE for your row, then run `clearAllAccessCache` from the editor; (9) verify: sign in on the live page, `curl -sL "https://script.google.com/macros/s/<ID>/exec?action=api&op=deploy" --max-time 90` answers `Already up to date (v01.01g)`, `?action=api&op=quota` answers today's counts, `?action=api&op=aclhealth` answers `acl_ok`, and `bash scripts/check-acl-health.sh` now lists Network
- **Verification this push**: `node --check` on the `.gs` copy clean; `scripts/check-gas-inner-scripts.js` — 10 files, all inner scripts parse; both inline `<script>` blocks of `Network.html` parse; `scripts/check-readme-tree.py` 0 findings; `scripts/playwright-harness.py Network Profiler` 2/2 pass (file://); `scripts/verify-network-roles.py` all checks pass with zero page errors (served over localhost at 390 × 844); `scripts/verify-profiler-roles.py` — matrix unchanged, deep-link denials pass; its two **guidance-progress isolation** failures (`admin tick did not persist`) reproduce identically on an untouched `origin/main` worktree, so they are pre-existing (the guidance hub moved to Classroom in C3 and `gdSetProgress` no longer persists on Profiler) and outside N0
- **Pre-existing template oddity noticed, not touched** (Chesterton's fence): `doPost`'s `action=getData` route calls `processDataPoll()`, which no project defines — the route is dead in every project and no page calls it; N0 sets `DATA_POLL_INTERVAL: 0` and arms nothing
- **No rotation.** 98 sections, three dated today (exempt) → 95 non-exempt against the 100 trigger. Profiler's page changelog reached `Sections: 50/50` with today's section exempt (49 non-exempt against a 50 trigger) — no rotation there either

## [v06.75r] — 2026-09-20 12:26:53 AM EST

> **Prompt:** "give me a prompt to paste into a Fable 5.1 High session to run N0, then remember session."

### Added

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- **The paste-in prompt for the N0 session** (Fable 5.1 High), verbatim, as a block under the §13.3 brief — the §13.2 precedent: it points the session at §3, §8, §13.3 and `NETWORK-SCHEMA.md`, names the three values only the developer holds (`SPREADSHEET_ID`, `CLIENT_ID`, the Master ACL default) to ask for before the setup script runs, forbids N1/E1/Scraper work, lists the verification set (`node --check`, `check-gas-inner-scripts.js`, `check-readme-tree.py`, served Playwright screenshots of the four tier states), and ends with the deploy hand-off, the §11 flip and the N1 brief as §13.5

### Changed

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten for the two-push gate session (v06.74r the gate, v06.75r this push): decisions, the D15 → N4 consequence, the schemas, the rotation, the values N0 will ask for; recommendation: paste the §13.3 N0 prompt. The prior entry moved to Previous Sessions under the two-session cap

#### `README.md`
- `Last updated` and `Repo version` refreshed

### Notes

- **Archive rotation fired.** This push lands on **2026-09-20 EST**, so the eighteen sections dated 2026-09-19 stopped being exempt: 116 non-exempt against the 100 trigger → the **2026-09-14 date group (v05.59r–v05.78r, 20 sections)** moved to `CHANGELOG-archive.md` with a commit SHA appended to every header (20 of 20 resolved on the unshallowed clone; post-rotation grep clean) → 96 non-exempt, below the trigger. Counter `Sections: 78/100`.
- **No page, GAS script, diagram or rule changed.**

Developed by: LightAISolutions
