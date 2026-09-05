# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 85/100`

## [Unreleased]

*(No changes yet)*

## [v04.68r] — 2026-09-05 03:28:38 PM EST

> add the sourcing rule to step 7

### Added

- **A sourcing-verification rule in Profiler Command step 7** (`.claude/rules/profiler-app.md`). Any statement about **where** a claim is documented — "documented from X's side", "only trade press carries it", "neither party has confirmed it" — is a claim about the **`sources[]` arrays**, and must be resolved by opening the cited entries on both dossiers and checking host and document type. The rule states the distinction it turns on: a company's own IR page or SEC/HKEX filing is first-party, a wire release the company issued is first-party distributed, and trade press or aggregators are not — however faithfully they report the company. It also states the trap directly: **a dossier's summary of its own provenance is the text under review and cannot be evidence for it.**
- The rule carries the developer directive that motivated it (2026-09-05): **high verity of information is the priority — when the citations do not settle something, state the gap clearly and honestly.** An explicit "no source reconciles these" beats a confident sentence the citations do not support.
- Provenance note records the failure that produced it: the v04.66r reconciliation wrote that three layers of the Hithium/Jupiter Power relationship were "documented from Hithium's side" when only one was, having inferred it from the two dossiers' prose — the cross-reference rule's own failure mode, committed while applying the cross-reference rule.

### Verified

- Spot-checked **all 16** scopes the checker reports as not examined (rather than sampling): **none hides a cross-dossier answer.** Six are mutual hedges where both dossiers say the same "we don't know" (`amazon`↔`flex` on the warrant, `anthropic`↔`nscale` on the $45B Monarch contract, `eaton`↔`flex` on the JetCool collaboration); seven are a company's own internal status or a regulatory question no dossier can settle; two were adjudicated at v04.67r. The three that looked answerable were checked against their counterparts and all came back negative — Google's dossier carries only the $4.75B acquisition and not the $250M tranche, Hithium's does not resolve Woolooga ownership, and Tesla's 4680 discussion is its own line, not Panasonic's.
- Re-examined `enchanted-rock technicalSpecs[0].specs[0]` against both dossiers' citations: every claim holds. The 470 MW order traces to ERock's Q2 2026 results (BusinessWire wire release; **8-K Exhibit 99.1** in Anthropic's dossier), Anthropic's dossier states it has not announced the order and names no sites, and `anthropic strategyRead[8]` carries any site disclosure as an indicator to watch. **No developer adjudication required** — the only unresolved element is the destination sites, which neither company has disclosed, and that is a stated gap rather than an open question.
- No rule conflicts: the existing `sources[]` citation-order guidance (step 2) and the report-citation guidance are complementary, not contradicted.

### Worth noting

- **One partial signal was found and deliberately not written in.** Hithium's HKEX prospectus customer roster names **Lightsource bp, not Aula**, which is consistent with Lightsource being the counterparty as of filing but does not resolve the post-sale Woolooga ownership question `lightsource-bp` flags. Recording it as a resolution would repeat the exact overstatement this rule now forbids, so it was reported to the developer instead.
- **The 900-character scope cap cost nothing on this corpus** — but that was unknowable until the checker began reporting what it skips, and the same cap did hide a real record once the `hithium` write-up grew past it.

## [v04.67r] — 2026-09-05 03:16:27 PM EST

> The passage says that "the three layers are documented from Hithium's side". Is that true? I have not personally looked into either side, so make sure your language is objective and clear. If you have evidence that "the three layers are documented from Hithium's side", then I think this passage is good and can pass.

### Fixed

- **`hithium` v9 → v10 — the sourcing claim written at v04.66r was wrong and is corrected.** v9 said the three layers of the Jupiter Power relationship were "documented from Hithium's side — its own disclosures and the HKEX prospectus partner roster". Checking the `sources[]` arrays rather than the prose shows **one** of the three is Hithium-sourced: the partner roster, in Hithium's own **HKEX prospectus filed 27 October 2025** (`www1.hkexnews.hk`). The **June 2024 3 GWh supply agreement** rests on trade press — **Solarbe Global, corroborated by SMM** — and the **Trimount design win** on **Energy-Storage.News**. No first-party release from either company is cited for either. Corrected in `strategyRead[6]` and `technicalSpecs[9].specs[3]`.
- **The same passages omitted a material qualifier and now carry it:** **Jupiter's CTO Michael Geier is quoted in the 3 GWh announcement.** Jupiter Power's own dossier names him as "the executive quoted in both the Hithium 3 GWh and Energy Vault supply announcements". This does not overturn "Jupiter's own channels have never named Hithium" — a quote given for a supplier's release is not Jupiter's channel — but a passage asserting the confirmation runs "one way only" without it overstated the asymmetry.
- **`PROFILER-CROSSREF-CALIBRATION.md` adjudication log corrected** to match, and now records the generalisable failure: *"which side is this documented from?" is a question about the `sources[]` array, and v9 answered it from the prose of the two dossiers instead.* Adjudicating a cross-reference means reading the citations, not the summaries — the prose is what is under review.

### Changed

- **`check-profiler-crossrefs.py` now reports the scopes it declines to examine.** The `OQ_SCOPE_MAX` cap silently dropped a real candidate: documenting the `hithium` reconciliation thoroughly pushed both records past 900 characters, and the checker reported a clean pass on a pair it had simply stopped reading. **The defect was the silence, not the threshold.** Raising the cap to 1500 admits eight more candidates at once with no ground-truth gain, so the cap stays and every skipped scope is now listed under "NOT examined" with its size — 16 on the current corpus. The docstring states plainly that a clean run is not a clean corpus.
- **The stale `bf7153a031f9` accept entry was removed** (6 entries). Its candidate no longer exists: the pair is now covered by the not-examined report, and the adjudication itself lives in the dossier text and the calibration log.

### Verified

- Checked each layer against the citation, not the prose: 3 GWh → Solarbe Global + SMM (trade press); partner roster → Hithium's HKEX prospectus (first-party filing, directly cited); Trimount → Energy-Storage.News (trade press). Hithium's dossier carries 32 first-party `hithium.com` sources of 51 overall, but **none of them covers the Jupiter relationship**.
- `sync-profiler-registry.py` clean (0 of 127 out of sync); graph rebuilt to 903 edges (678 curated); `check-profiler-study.py` clean (101 guides, 811 concepts); `check-profiler-crossrefs.py` exit 0 with 6 suppressed and 16 scopes reported as not examined.
- `hithium.profile.v9.json` archived, `archive-index.json` at 240 entries across 95 slugs, README tree updated.

### Worth noting

- **The developer's question was the right one to ask, and the answer was no.** The v04.66r passage read as authoritative and was written from the two dossiers' summaries rather than their citations — the same failure mode the cross-reference rule exists to catch, committed while applying that rule.
- **A cap that silently drops a record penalises thoroughness.** The fuller the reconciliation write-up, the more likely it crosses the threshold and the blinder the checker becomes. Reporting the skip costs nothing and removes a class of false green that no amount of threshold tuning would have.
- **Neither correction changes the underlying judgment**: the relationship is real, Jupiter has published nothing naming Hithium on its own channels, and no source confirms the 3 GWh delivery completed. What changed is the accuracy of the claim about *where the documentation comes from*.

## [v04.66r] — 2026-09-05 02:56:19 PM EST

> For enchanted-rock x anthropic, mention that Anthropic's 470MW equipment purchase could be with RockBlock, but unconfirmed. For hithium x jupiter-power, honestly and clearly state that hithium did not confirm the relationship, but Jupiter did.
>
> Which flagged dossier do I need to revise or add to the accept list?

### Fixed

- **`enchanted-rock` v3 → v4 — the RockBlock order's host, cross-checked and dated.** The dossier flagged the 470 MW RockBlock equipment purchase order's destination as "sites undisclosed (Anthropic's Fluidstack TX/NY buildout is the inferred host — unconfirmed)". The Anthropic dossier corroborates the order and the RockBlock attribution, but **both trace to ERock's own release**, not to Anthropic, which has not announced the order and names no sites — it carries any site disclosure as an indicator to watch. The cross-check is now recorded and dated in the spec; the host inference stays explicitly unconfirmed on both sides rather than being upgraded to an answer.
- **`hithium` v8 → v9 — the confirmation asymmetry stated plainly, in the direction the corpus supports.** Both the `strategyRead` judgement and the Jupiter Power technical-spec band now record that the relationship is documented **from Hithium's side** — its own disclosures and the HKEX prospectus partner roster — plus third-party coverage of the Trimount design win, while **Jupiter's own channels have never once named Hithium** and it publicly messages domestic content instead. Neither party has confirmed completion of the 3 GWh delivery. `jupiter-power` already recorded this asymmetry correctly and was left alone.

### Changed

- **Open-question fingerprints now include both claim texts** (`scripts/check-profiler-crossrefs.py`). They previously hashed only the slug pair, scope, marker and anchor, so rewriting a claim left the id — and any accept entry — valid against text that no longer existed. The docstring already promised that editing a claim reopens the candidate; the code now matches. The change re-derived the four open-question accept entries written earlier the same day.
- **`repository-information/profiler-crossref-accepted.json`** carries all seven reviewed candidates under the corrected fingerprints, each with the reason it needs no further change. `check-profiler-crossrefs.py` now exits **0** on the live corpus.
- **`repository-information/PROFILER-CROSSREF-CALIBRATION.md`** gains an adjudication log recording both dispositions, the fingerprint correction, and the property that matters most for future passes.

### Verified

- `sync-profiler-registry.py` reconciled both `lastUpdated` fields (2 of 127 updated); `build-profiler-graph.py` rebuilt to 903 edges (678 curated, 2,788 evidence items); `check-profiler-study.py` clean (101 guides, 811 concepts); `check-profiler-crossrefs.py` **exit 0, 7 suppressed**.
- Both outgoing versions archived (`enchanted-rock.profile.v3.json`, `hithium.profile.v8.json`) with `archive-index.json` updated to 239 entries across 95 slugs, and both added to the README tree.

### Worth noting

- **One instruction was inverted against the corpus and was not written as given.** The request was to state that "hithium did not confirm the relationship, but Jupiter did." The corpus says the reverse: `jupiter-power`'s own dossier records that **Jupiter has never publicly named Hithium**, and that the "verified three layers" are verified from *Hithium-side* disclosures, the HKEX prospectus roster and third-party coverage. The checker's pairing invites the misreading, because it prints Hithium's hedge next to Jupiter's word "verified". The revision states the asymmetry in the direction the sources support.
- **Closing an open question does not silence it, and that is correct.** The honest close keeps the hedging word — the uncertainty becomes *documented* rather than *open*. Both revised candidates therefore still surfaced and were then accepted. **Revise-and-accept is the normal disposition for the open-question class**; only the figure class routinely goes quiet on its own.
- **The `hithium` `strategyRead[6]` candidate disappeared for a threshold reason, not a substantive one** — the added sentence pushed the scope past the 900-character `OQ_SCOPE_MAX` bound. The same reconciliation is carried in the technical-spec band, which is still flagged and was accepted, so nothing was lost; noting it because a scope cap silently dropping a record is a behaviour worth remembering.
- **A pre-existing archive gap is left untouched**: `hithium.profile.v5.json` is absent from `archive/` while v1–v4 and v6–v8 are present. It predates this session and is not this change's to fix silently.

## [v04.65r] — 2026-09-05 02:35:04 PM EST

> Build scripts/check-profiler-crossrefs.py — a checker that detects when two
> Profiler dossiers assert contradictory facts about the same thing.
>
> Develop on branch claude/profiler-crossref-checker (create it). Read
> CLAUDE.md, .claude/rules/profiler-app.md (especially the new step 7,
> "Reconcile the corpus against the new dossier") and
> repository-information/PROFILER-SCHEMA.md before writing any code.
>
> WHY THIS EXISTS
> sync-profiler-registry.py, build-profiler-graph.py and check-profiler-study.py
> each validate a dossier against itself or against the registry. None asks
> whether two dossiers contradict each other. Repo version v04.64r added a rule
> (step 7) requiring that reconciliation by hand on every new dossier, and fixed
> four real cases it surfaced. This script makes that rule verifiable instead of
> self-reported, and is the only way to reach the ~870-1,130 cross-dossier pairs
> already in the corpus from the 127 dossiers written before the rule existed.
>
> FOUR GROUND-TRUTH CASES — calibrate against these
> Each was fixed at v04.64r. The pre-fix text is in
> live-site-pages/profiler-data/archive/. Diff each archived revision against its
> current file to see exactly what changed:
>   archive/invenergy.profile.v1.json      vs invenergy.profile.json
>   archive/meta.profile.v6.json           vs meta.profile.json
>   archive/terawulf.profile.v4.json       vs terawulf.profile.json
>   archive/burns-mcdonnell.profile.v4.json vs burns-mcdonnell.profile.json
>
> They are four DIFFERENT conflict types and the checker should be measured on
> all four:
>   1. invenergy - a categorical mischaracterisation. It grouped NRG with Vistra
>      and Talen as "contracting existing fleets to data centres"; NRG's model is
>      customer-funded new build. No number is wrong. This is the hardest class
>      and it is acceptable to conclude it is out of scope for a static checker —
>      but say so explicitly rather than silently missing it.
>   2. meta - THE CRITICAL CALIBRATION CASE. It read "Vistra (2.1 GW + 433 MW
>      uprates)" where Vistra discloses 2,176 MW operating plus 433 MW of
>      uprates, 2,609 MW total. Note that 2,176 MW and 2.1 GW are NUMERICALLY
>      EQUAL. A unit-normalizing comparator reports no conflict and misses this
>      entirely. The drift was an omitted component, not a wrong magnitude. If
>      your design only compares normalized magnitudes it scores 3 of 4 and you
>      will not notice. Solve this or state plainly that you could not.
>   3. terawulf - a genuine figure conflict: "~$92M / 3.4x MOIC" for the Nautilus
>      exit against Talen's own "$85M in cash plus selected physical assets" for
>      the same transaction. This is the class the checker should nail.
>   4. burns-mcdonnell - an open question, not a contradiction: the dossier said
>      the Moss Landing adjacency was unresolved; other dossiers already carried
>      the answer. Detecting "one dossier says unknown, another states it" is a
>      valuable and cheap class.
>
> MEASURED FACTS ABOUT THE CORPUS (from the v04.64r session — re-verify, do not
> trust these numbers blindly)
> - 127 dossiers, ~1.79M tokens, 5,719 cross-dossier mention occurrences across
>   870-1,130 distinct pairs (the count is matcher-dependent).
> - Concentration: top 10 mention targets carry 39% of pairs, top 25 carry 65%.
>   NVIDIA 56 inbound dossiers, Tesla 51, Microsoft 46, Siemens Energy 39,
>   GE Vernova 29, Vertiv 26, OpenAI 25, Eaton 24, Oracle 23, Fluence 23.
> - Field distribution of mentions (1,378-mention sample): relationships 297,
>   sources 295, productsAndServices 225, recentDevelopments 207,
>   technicalSpecs 84, strategyRead 80, decisionMakers 58, ecosystemRole 39,
>   summary 32, policyExposure 31, financials 18.
> - sources and decisionMakers are 26% of the surface and are NOISE — source
>   titles and exec career history. Step 7 already says to skip exec-career
>   mentions.
> - 78% of mentions contain a digit. This is why an unscoped numeric comparator
>   will drown in false positives.
> - Match with word boundaries and case sensitivity. grep -il "talen" matches
>   "talent" and returns 17 dossiers; grep -lE '\bTalen\b' returns 4.
>
> DESIGN CONSTRAINTS
> - FALSE POSITIVES ARE THE FAILURE MODE, not false negatives. A checker nobody
>   runs twice is worth nothing. Set an explicit precision target, design for it,
>   and report the measured rate. If you must trade, prefer missing a real
>   conflict over flagging an accurate claim.
> - Output must be adjudicable without opening both files: for each candidate,
>   print both dossiers, both verbatim claims with their JSON paths, the specific
>   values that differ, and a proposed classification under step 7's four-way
>   disposition (contradicted / differing figures / open question / accurate).
> - Do NOT auto-edit any dossier. The script reports; a human or a later session
>   adjudicates. Rewriting an accurate dossier is worse than the drift.
> - --json for machine output and a readable default. Non-zero exit on findings,
>   with a documented way to accept a reviewed pair so reruns stay quiet.
> - Match the conventions of the existing checkers in scripts/ — read
>   check-profiler-study.py and sync-profiler-registry.py first.
>
> DELIVERABLES — the session is not done without all four
> 1. scripts/check-profiler-crossrefs.py, ending with
>    "# Developed by: LightAISolutions".
> 2. A scored run against all four ground-truth cases using the archived pre-fix
>    revisions. State plainly how many of the four it catches. Three of four with
>    an honest explanation beats a claimed four with a stretched definition.
> 3. A MEASURED false-positive rate: run against the live corpus, hand-check a
>    random sample of at least 30 flagged candidates, and report the rate. This
>    number gates whether the retroactive sweep can start, so do not estimate it.
> 4. A short section in the script's docstring or a companion note on which
>    conflict classes it detects and which it structurally cannot.
>
> DO NOT run the retroactive sweep in this session — that is a separate job on a
> different model. Build and tune the checker only.
>
> Standard repo treatment: Pre-Commit and Pre-Push checklists, CHANGELOG entry,
> repo version bump on the push commit, README timestamp, README tree entry for
> the new script, one push commit on the claude/* branch.

### Added

- **`scripts/check-profiler-crossrefs.py` — the first checker that reads two dossiers against each other.** Every existing validator checks a dossier against itself or against an index; none asks whether two dossiers assert contradictory facts. Three detectors: **differing figures** (two magnitudes for what looks like one fact, in a shared dimension — power, energy, currency, percent), **open questions** (one dossier flags something unresolved inside a bounded record and another carries an unhedged passage on the same rare-anchored topic), and an opt-in **grouped attribution** class (`--include-grouped`) that surfaces one characterisation applied to several companies at once. Readable output by default, `--json` for machines, `--pair` and `--only` to scope, exit 1 while candidates remain. **It never edits a dossier** — it reports, and a human adjudicates under step 7's four-way disposition. 1.4 seconds over 127 dossiers.
- **`repository-information/profiler-crossref-accepted.json` — the accept list.** Each candidate carries a 12-character id, stable across reruns while the two claims are unchanged. Reviewed candidates needing no dossier change go here with a reason and a date; editing either claim changes the id, so the candidate returns for review. Seeded with the five candidates adjudicated in this session, leaving two genuinely open items for the developer.
- **`repository-information/PROFILER-CROSSREF-CALIBRATION.md` — the evidence behind every threshold.** The four ground-truth cases and how each is scored, the reproduction recipe for the pre-fix corpus, the full tuning sweep row by row, the measured false-positive rate with its adjudication standard, the residual false-positive patterns, and the coverage limit to read before planning a retroactive sweep.

### Changed

- **Profiler Command step 7 now names the checker** (`.claude/rules/profiler-app.md`). The reconciliation stays a grep-and-read obligation — the rule is explicit that the checker is a **floor, not a substitute**, and that the categorical-mischaracterisation class it cannot see is exactly the `invenergy` case that motivated the rule.

### Verified

- **Scored 3 of 4 against the known drift cases**, using the archived pre-fix revisions as a reconstructed corpus. Caught: `meta` (2.1 GW against Vistra's 2,609 MW, Δ 19.5 %), `terawulf` (~$92M against Talen's $85M, Δ 7.6 %, anchored on `Nautilus`), `burns-mcdonnell` (marker `no source ties`, anchor `Moss Landing`, answered by `vistra relationships[4].context`). **Missed: `invenergy`** — a categorical mischaracterisation in which every number is correct. `--include-grouped` surfaces the sentence, but as 1 of 80 candidates and indistinguishable from the accurate peer groupings around it, so it is scored a miss and the docstring says why rather than claiming it.
- **All three caught cases disappear on the live corpus with no accept-list entry.** The checker measures the drift, not the pairing.
- **The `meta` case — the one a magnitude comparator cannot see — is solved.** 2,176 MW and 2.1 GW are equal to two significant figures; the drift was an omitted component. Two mechanisms find it: strict equality with a banded difference (2,100 ≠ 2,176, so the rounded restatement lands in the band), and arithmetic reconciliation (after the fix 2,176 + 433 = 2,609 reconciles and the pair is dropped; before it, 2,100 + 433 = 2,533 reconciles with nothing).
- **Measured false-positive rate: 71 %, precision 29 %, on a seven-item load** — a full census of the live corpus, not a sample, with all seven adjudicated. **66 distinct candidates were hand-checked** across the tuning stages. Two candidates are genuinely actionable (`enchanted-rock` × `anthropic`, `hithium` × `jupiter-power`); five were accepted with reasons.

### Worth noting

- **The volume, not the rate, is the design decision.** 148 candidates at ~10 % precision was a checker nobody would run twice. Seven precision filters took it to seven candidates: nearest-figure-per-dimension attribution, a directional 40-character attribution window, agreed-value credits at passage and dossier scope, arithmetic component/total reconciliation, a 25 % difference-band ceiling, and suppression of passages that already disclose the disagreement. The trade is explicit — a ten-minute review of the whole corpus that surfaces two real items.
- **Coverage is narrower than the corpus and the note says so plainly.** Requiring mutual mention reduces the ~870–1,130 cross-dossier pairs to **260 compared pairs**. A pair where only one side names the other is never compared. A clean run means those 260 pairs trip none of the three detectors — not that the corpus is consistent.
- **Two approaches were tried and rejected**, recorded so they are not re-tried: requiring a shared rare *topic* anchor on the figure class (Meta and Vistra share no non-company anchor, so it drops the entire omitted-component class), and figure-local lexical overlap (neither figure case shares a unit phrase — "existing-plant PPAs" against "from the PJM fleet").
- **A 350-alternative company-matching regex took 201 seconds; a first-token index does the same work in 0.6.** Kept because a checker that takes three minutes gets run once.
- **The retroactive sweep was not run**, as instructed. The measured rate above is the number that gates it, and the coverage limit is the caveat that goes with it.

## [v04.64r] — 2026-09-05 05:50:38 AM EST

> fix the C4 cross-dossier drift and add the reconciliation rule

### Fixed

- **`invenergy` v1 → v2 — the one clear error C4 surfaced.** Its positioning line read "the opposite of Vistra, NRG and Talen, which are contracting existing fleets to data centres." That is wrong for NRG, whose data-centre model is customer-funded **new build** under a Project Development Agreement with GE Vernova and Kiewit's TIC for up to 5.4 GW, not the sale of existing output — its signed 445 MW are retail supply agreements on NRG-owned land and its flagship 1.2 GW project is new construction. The sentence now separates NRG from the other two and says why, with the GE Vernova release added to `sources[]`.
- **`meta` v6 → v7 — megawatt drift on the January 2026 nuclear package.** Two places read "Vistra (2.1 GW … + 433 MW uprates)". Vistra's own disclosure is **2,176 MW** of operating capacity (Perry 1,268 MW + Davis-Besse 908 MW) plus 433 MW of uprates, **2,609 MW in total**. Both corrected.
- **`terawulf` v4 → v5 — the Nautilus exit figure reconciled rather than picked.** TeraWulf's dossier carried "~$92M / 3.4x MOIC" for the October 2024 exit; Talen's own release states **$85M in cash plus selected physical assets**. Both figures now appear with an explicit note that no source reconciles them, and Talen's release is added to `sources[]`.
- **`burns-mcdonnell` v4 → v5 — an open question closed, not a contradiction corrected.** Its dossier flagged "no source ties Burns & McDonnell's phase to the burned building — an unresolved adjacency, not an allegation." The C4 research resolves it: the array that burned in January 2025 was **Phase I, 300 MW inside the retired plant's turbine building, engineered by Fluence with construction by Vistra's Luminant**. Burns & McDonnell's engagements are the separate 100 MW Phase II building and the 350 MW Phase III expansion — neither is the burned building. The note is rewritten as resolved and dated, a `vistra` relationship is added recording both phases, and the project record is added to `sources[]`.

### Added

- **A mandatory corpus-reconciliation step in the Profiler Command** (`.claude/rules/profiler-app.md`, new step 7; Batch requests, Standard treatment and Commit/push renumbered to 8, 9 and 10). After writing each profile a session must word-boundary grep every other dossier for the new company, classify each hit, and act: contradicted claims are revised in the *other* dossier with archive and `profileVersion` +1; differing figures are stated together with a note that nothing reconciles them; open questions the new research answers are closed and dated; accurate claims are left alone. The count reviewed and the count changed must be reported so a clean pass is distinguishable from a skipped one.
- The rule names the gap it closes: `build-profiler-graph.py` resolves slugs, `check-profiler-study.py` validates terms, `sync-profiler-registry.py` reconciles counts and the authoring URL index validates citations — **none of them asks whether two dossiers assert contradictory facts.** It also carries the word-boundary caveat (`grep -lE '\bTalen\b'` returns four dossiers; `grep -il talen` returns seventeen, because it matches "talent") and a scope note that NVIDIA, Tesla, Microsoft, Google and Meta each carry 40+ inbound mentions and are a session of their own.

### Verified

- Four dossiers archived to `archive/` with `archive-index.json` updated (237 entries across 95 slugs, no missing files).
- `sync-profiler-registry.py --check` clean (0 of 127 out of sync); `check-profiler-study.py` clean (101 guides, 811 concepts); graph rebuilt to 903 edges (678 curated) from 902.
- Playwright render of all four revised dossiers plus `vistra`: **zero page errors, zero console errors**, source counts matching the files (135 / 20 / 28 / 29 / 81), no literal `{{}}`, every term span resolving.
- URL-index gate re-run on the four: 0 unmatched among newly written citations. One pre-existing TeraWulf IR URL sits outside this session's research index; `git diff` confirms it was untouched.

### Worth noting

- **Calibration.** The pattern reported at v04.63r was one clear error, two unreconciled figures and one open question in twelve substantive inbound claims — not four contradictions. On close reading, `vistra` had already recorded both Burns & McDonnell engagements correctly, so no change was needed there; the C4 dossiers were not the source of any drift.

## [v04.63r] — 2026-09-05 05:30:09 AM EST

> Fresh session on Opus 5 xhigh. Run Phase C session C4 of repository-information/PROFILER-COVERAGE-PLAN.md:
> Talen Energy, Vistra, NRG Energy — the §8 rows `talen-energy`, `vistra`, `nrg-energy` (all `ipp`),
> listed under C-P / C4 in §5/§8. C4 is the first Phase C session since C11 landed at v04.52r; C1 landed
> at v04.47r, C2 at v04.48r (v2 at v04.50r), C3 at v04.50r, C11 at v04.52r. Phase B ran F1–F5 in the
> interim (v04.58r–v04.62r) and added nine buyer-side study guides — read them before choosing angles.
> When you flip the three §8 rows, fill Dossier and Guide as `v1 · v04.63r` / `✓ · v04.63r` and leave the
> Model column at `Opus 5 xhigh` (no substitution to record).
> READ FIRST: repository-information/SESSION-CONTEXT.md (the Latest entry has the F5 findings, the
> registry append-order rule and the word-boundary caveat); PROFILER-COVERAGE-PLAN.md §2 (the model rule
> and the v04.57r head-to-head note — C4 is the case that rule was written for), §5 row C-P / C4, §7, and
> the three §8 rows; .claude/rules/profiler-app.md (Profiler Command, Profiler Prep Command);
> repository-information/PROFILER-SCHEMA.md — in particular the schema v4 normalized-KPI overlay and the
> "Expectations honesty" authoring rule, both of which bite here in a way they did not for the private
> F-series; PROFILER-STYLES.md (active style: intel-briefing).
> CLASSROOM-CURRICULUM-PLAN.md §6 is NOT in scope — C4 closes no register row (§8 "Closes" reads "power
> partners"); do not edit it. .claude/rules/classroom-app.md is NOT needed.
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories `ipp` per the §8 row, intel-briefing prose with confidence-tagged key
> judgments and an indicators-to-watch bullet) and study guide (schema v2, a where-it-fails section,
> {{term}} tooltips against profiler-concepts.json, new shared concepts registered there rather than in
> local glossaries, flashcards and quiz on how the business model and the buying process work, never
> company trivia).
> THESE THREE ARE PUBLIC — this is the whole reason they are Opus work, and it changes the research shape:
> NASDAQ: TLN, NYSE: VST, NYSE: NRG. `expected` must carry REAL published analyst consensus or company
> guidance for the trailing two fiscal years plus the latest interim, with `result`/`commentary` stating
> which of the two it is; leave it empty only where none exists and say so. Fill the schema v4 overlay on
> whole-company actuals only — `kpi: "revenue"` etc. with `usdMillions` and `fxBasis: "as reported"` (all
> three report in USD, so no conversion and no researched FX rate). The v04.57r head-to-head found Opus's
> 10-K extraction materially deeper than Fable's — risk factors, credit-transfer cash, insurance
> repricing, capex actuals. Spend the depth there: read the 10-K, the latest 10-Q, the most recent
> earnings call and the investor deck for each, not just the press releases.
> PREMISES TO RE-VERIFY FIRST (the §5 C4 row, written 2026-09-03 — F3, F4 and F5 each found their brief
> wrong on every company, so treat each clause as a dated claim): Talen Energy — "the Amazon nuclear-PPA
> precedent (six dossiers)". Verify the Susquehanna arrangement as it stands today, not as first
> announced: what FERC actually did to the co-location interconnection service agreement, whether the
> deal was restructured into a front-of-the-meter PPA and on what terms, the MW, the tenor, and Talen's
> own post-bankruptcy ownership and share count. Note the "six dossiers" figure is unverified; a
> word-boundary count says four (amazon, constellation-energy, invenergy, terawulf). Vistra — "the
> largest merchant BESS owner in the country with a growing data-center gas book". Verify the storage
> fleet MW/MWh against the 10-K (Moss Landing is the name to check, including the January 2025 fire and
> what it did to the reported fleet), verify the "largest" ranking against a citable source or drop it,
> and separate the Energy Harbor nuclear acquisition from the gas book. Cited in five dossiers
> (burns-mcdonnell, invenergy, meta, oklo, oncor). NRG Energy — "the third merchant with gas-for-AIDC
> deals". Verify the GE Vernova and TIC/Kiewit joint venture terms, the LS Power acquisition, the retail
> book size, and which data-center agreements are signed versus announced. Cited in eight dossiers
> (aypa-power, esvolta, flexgen, gridstor, invenergy, kiewit, oncor, sargent-lundy) — the highest of the
> three. Record every correction in the dossier's summary and judgments.
> RESEARCH PRIORITIES, for every company: the generation fleet by plant, fuel, MW, and market (PJM,
> ERCOT, ISO-NE, NYISO) as the 10-K states it; the retail electricity business (customer counts, states,
> brands) for Vistra and NRG; data-center and large-load agreements with counterparty, MW, tenor and
> signed-versus-announced status; capacity-market results and hedging disclosure; the storage and
> nuclear fleets separately from gas; financing (term loans, notes, revolvers, buybacks) as filed;
> regulatory and litigation exposure from the risk factors; leadership with company-published headshots
> from the IR site or proxy. Two research agents per company (first-party exhaustive — IR, filings,
> earnings calls, decks, plant pages — then third-party: FERC dockets and orders, ISO records, state
> PUCs, trade press, analyst rankings with the ranking cited). A URL for every relationship claim;
> relationships[] resolving only to covered slugs with a source that states the link — the covered
> counterparties to look for are `amazon`, `constellation-energy`, `oklo`, `meta`, `microsoft`,
> `ge-vernova`, `kiewit`, `oncor`, `terawulf`, `burns-mcdonnell`, `invenergy`, `sargent-lundy`,
> `flexgen`, and the nine new buyer-side slugs (`aypa-power`, `spearmint-energy`, `intersect-power`,
> `gridstor`, `available-power`, `esvolta`, `strata-clean-energy`, `hunt-energy-network`).
> Put every must-find item in the agent prompts — nothing can be searched after they return. Have every
> agent end its report in a `## ALL URLS` list of every URL it fetched successfully.
> STUDY GUIDES: one guide each, do not duplicate. The corpus now holds nine buyer-side guides and six
> utility dossiers, so read the start-here callouts of aypa-power, spearmint-energy, intersect-power,
> invenergy, gridstor, available-power, esvolta, strata-clean-energy and hunt-energy-network before
> choosing, and do not repeat them. Every one of those teaches a DEVELOPER — someone who builds a
> pipeline. C4's companies own operating plants, which is the model the corpus does not hold. Candidate
> angles: the merchant generator whose asset is an existing fleet rather than a pipeline, and how that
> changes what a data centre can buy from it; co-location at a nuclear plant and what FERC decided about
> using an existing interconnection for new load (the Talen case, read against the Intersect guide's
> surplus-interconnection material so the two do not collide); owning both generation and a retail book,
> and why the natural hedge changes the risk a merchant carries. Check whether the Classroom already owns
> capacity markets before building a guide around PJM capacity; the Classroom owns tolling, ancillary
> stacking and duration-and-degradation. If two of the three turn out to be the same model, teach one as
> the case study and give the other the structural chapter.
> BOOKKEEPING, same commit: `python3 scripts/sync-profiler-registry.py`, `build-profiler-graph.py`,
> `check-profiler-study.py`; three calendar rows — these are PUBLIC companies, so the rows carry a
> researched `nextReport` / `confirmed` / `source` / `watch[]`, not `cadence: "quarterly"`; README tree
> entries for every profile, study file and study-prep folder plus the execs count (recount by registry
> slug; currently 490 across 77 companies — turner-* files belong to turner-construction); flip the three
> §8 rows; CHANGELOG entry (counter at 79/100 — no rotation). One push commit with repo version bump
> (v04.62r → v04.63r).
> ENVIRONMENT (confirmed by F1–F5): pip install playwright pymupdf pillow pillow-avif-plugin; never run
> playwright install — use the /opt/pw-browsers/chromium-*/chrome-linux/chrome executable; the HTTP
> server for the render harness must be threaded (ThreadingMixIn, daemon threads, swallow
> BrokenPipeError); route script.google.com to the roles stub in scripts/verify-profiler-roles.py and
> fulfill accounts.google.com with an empty script; per-slug tabs are `#ov-tab-<key>`, the sources list
> is `.ov-sources ol li` (not `#ov-main ol li` — the numbered judgments leak in), the study button is
> `#ov-study-btn`, term spans are `.gd-term` with `data-term`; `page.goto('about:blank')` before every
> dossier and wrap the localStorage init script in try/catch; dry-run the harness on a known-good slug
> first. Timeline sections use lane keys `gen` / `deploy` / `eco`. Tool output above ~30 KB is persisted
> to a file — read agent reports in chunks of <=40 lines. Foreground sleep is blocked — use the Monitor
> tool or a backgrounded until-loop to wait for agent report files. The shell cwd resets to the repo root
> after every Bash call — use absolute paths. A stop hook fires on uncommitted edits while agents run —
> make no repo edits until the agents return. Business Wire and archive.org are 403/blocked — read
> Business Wire releases through Yahoo Finance, Stocktitan, Nasdaq, SFNet, IREI, Energy Global or
> Batteries News mirrors and cite the mirror; SEC EDGAR and company IR sites answer directly.
> SEVEN LESSONS FROM F1–F5, ALL MANDATORY: (1) build a URL index from the reports programmatically with a
> regex that keeps parentheses inside URLs (`https?://[^\s<>\[\]"'`]+`, strip trailing punctuation), add
> other covered dossiers' sources[] as a corpus tier, and make the assembler refuse any sources[],
> relationships[], policyExposure[] or recentDevelopments[] URL not in the index — 0 unmatched per
> dossier before writing; write all three profiles before relying on cross-citation. (2) Treat every
> ownership, transaction, ranking and pipeline premise in this brief as a dated fact to re-verify first —
> F3, F4 and F5 were wrong on all nine companies. (3) Keep press-reported values, analyst supplier
> attributions and permit design bases as `announced` with the reporter named, never `active`;
> interconnection and wire-company adjacencies are `other`; exec-background links, JV attributions and
> analyst comparables are prose or `competitor` with the ranking cited, not supplier/customer
> relationships. (4) A company-hosted headshot whose filename marks a LinkedIn origin is skipped; a
> CDN-refused headshot is skipped rather than sourced elsewhere; company-published portrait renders count
> as company photos. (5) A photo caption is not a supplier attribution — read the sentence, not the
> image. (6) `profiler-companies.json` is appended in SESSION ORDER, not sorted — append your three
> entries at the end and do not sort the file; `profiler-concepts.json` IS alphabetical by slug and the
> schema requires it. (7) Measure corpus demand with word boundaries and case sensitivity — `grep -il
> "Talen"` returns 17 dossiers because it matches "talent"; `grep -lE '\bTalen\b'` returns 4.
> Do not read other dossiers' prose as a template for judgments. Estimate ~90 minutes; the F-sessions ran
> 50–75 minutes net of stalls, and the filings work here will run longer.
> VERIFY BEFORE COMMIT: sync-profiler-registry.py --check clean, check-profiler-study.py clean, every
> dossier and guide renders with zero page errors and zero console errors (Playwright, per-slug tabs
> including Relationships, sources count matches the file, no literal {{}} and no unresolved term spans),
> every relationships[] slug and every {{term}} resolving. Normal Pre-Commit and Pre-Push checklists;
> push on a claude/* branch.
> If a capacity, a contract value, a transaction value or a customer cannot be sourced from a filing, a
> regulator, a court record or the party's own release, leave it out and say so.

### Added

- **Three `ipp` dossiers at schema v7, profileVersion 1, in the intel-briefing style** — `talen-energy.profile.json` (81 sources, 51 percent first-party, 7 relationships, 21 developments, 5 policy regimes, 13 decision makers), `vistra.profile.json` (81 sources, 37 percent first-party, 13 relationships, 20 developments, 5 policy regimes, 11 decision makers) and `nrg-energy.profile.json` (72 sources, 33 percent first-party, 7 relationships, 20 developments, 5 policy regimes, 12 decision makers). All three carry the schema v4 normalized-KPI overlay on whole-company actuals only (`revenue`, `net-income`, `eps`, `capex`, `mw-contracted`), every currency figure `fxBasis: "as reported"` since all three report in USD.
- **Three schema v2 study guides, each teaching a different half of the operating-generator model the corpus did not hold** — `talen-energy.study.json` (13 sections: co-location at a nuclear plant, the interconnection service agreement and capacity interconnection rights, what FERC decided and what it left open, the workaround, additionality, reliability-must-run), `vistra.study.json` (11 sections: merit order and uniform clearing, what a capacity auction buys and why accreditation not nameplate, two market designs inside one company, the five things a data centre can buy from an existing plant, and what twenty years of asset ownership costs) and `nrg-energy.study.json` (10 sections: the retail book as a short position, collateral as the real failure mode, the four numbers that decide whether a retail customer earns its keep, customers as a dispatchable resource, and the vocabulary separating signed from reserved). Each has a `where-it-fails` callout, flashcards and a self-test.
- **Three full-depth lesson plans** under `repository-information/study-prep/{talen-energy,vistra,nrg-energy}/`, five modules each with per-module self-checks and a whole-plan self-test.
- **25 shared concepts registered in `profiler-concepts.json`** (786 → 811, alphabetical): additionality, bad debt, baseload, basis risk, capacity interconnection rights, churn, co-location, customer acquisition cost, deactivation, dispatch, forced outage rate, forward hedging, retail gross margin, interconnection service agreement, load-following, mark-to-market, merit order, natural hedge, net position, offer cap, reliability must-run, spark spread, station power, unforced capacity, virtual power plant.
- **19 company-published executive headshots** (Talen 10, Vistra 8, NRG 1), all verified against a contact sheet before use; execs count recounted by registry slug to 509 images across 80 companies.
- **Three researched calendar rows** with `nextReport` / `confirmed: false` / `source` / `watch[]` — none of the three companies had announced a Q3 2026 date as of 5 September 2026, and each row records the tracker disagreement and the historical release pattern behind its estimate.

### Changed

- **`PROFILER-COVERAGE-PLAN.md` §8** — the three C4 rows flipped to `v1 · v04.63r` / `✓ · v04.63r`; Model column unchanged at `Opus 5 xhigh` (no substitution).
- **Registry, graph and README** — three entries appended to `profiler-companies.json` in session order (127 companies); `sync-profiler-registry.py` reconciled `srcTotal`, `srcFirstPct` and `kpiNorm`; `build-profiler-graph.py` rebuilt to 902 edges (678 curated) from 865; README tree gained six `profiler-data` rows and three `study-prep` blocks.

### Fixed

- **All three §5 premises were wrong and are corrected in the summaries, judgments and README descriptions.**
  - **Talen Energy — "the Amazon nuclear-PPA precedent" is backwards on the part that matters.** FERC *rejected* the behind-the-meter arrangement on 1 November 2024 (docket ER24-2172, 189 FERC ¶ 61,078, 2–1, Christie and See in the majority, Chairman Phillips dissenting), on burden of proof and **expressly without prejudice**. What exists today is a *different, later* front-of-the-meter retail supply agreement signed 11 June 2025 — 1,920 MW through 2042, transitioned in April 2026 — deliberately structured so that no FERC approval is needed, running through Talen Energy Marketing's pre-existing unconditioned Pennsylvania supplier licence. The appeal was voluntarily dismissed in January 2026 ("this matter is now closed"). Talen has **no second hyperscaler**; the "4 GW" is land and contracting options. The "six dossiers" figure was also wrong: a word-boundary count returns four (amazon, constellation-energy, invenergy, terawulf). The 10-K calls Susquehanna the *seventh*-largest US nuclear plant while the website says sixth; Certrec's NERC-based list says seventh.
  - **Vistra — both halves of the premise fail.** No citable independent ranking of storage owners by fleet size exists (Wood Mackenzie/ACP and the EIA both decline to publish one); the closest, Enverus's 2023 flow ranking, places Vistra **second behind NextEra**, and Vistra's own historical language was "second-largest". The fleet fell from **1,024 MW to 624 MW** between the FY2024 and FY2025 10-Ks after the 16 January 2025 Moss Landing fire ($400M written off to depreciation in Q1 2025, $155M impaired in Q4 2025, both permanently in Asset Closure). And there is **no data-center gas book at all** — every signed large-load agreement is nuclear (Amazon 1,200 MW at Comanche Peak; Meta 2,609 MW across Perry, Davis-Besse and 433 MW of uprates).
  - **NRG Energy — three corrections.** The GE Vernova and TIC arrangement is **not a joint venture**: it is a Project Development Agreement signed 13 February 2025 under which "the generation facilities will be owned and operated by NRG", with turbine **slot reservations** that grew 1.2 GW → 3.6 GW against an unchanged 5.4 GW ceiling and no firm order, FID or named site. The LS Power acquisition is **closed**, not pending (30 January 2026, $10,583M plus ~$3.2bn assumed debt, CPower included). And the flagship 1.2 GW Texas project is **not signed** — "aligned on principal commercial terms … subject to final documentation and approvals". NRG is the only one of the four large merchants with **no named hyperscaler counterparty**; "largest IPP" is unverifiable and probably false on capacity.
- **Expectations honesty applied throughout, and it bit hard.** No published full-year analyst consensus could be located for FY2024 or FY2025 for Talen or Vistra on any reachable host, so those periods are benchmarked against company guidance and labelled as such; NRG's FY2025 has only a nine-month-stale $7.47 figure, so it too is guidance-benchmarked. Only the latest interim carries genuine outlet-named consensus for all three, and NRG's Q2 2026 consensus differs by 10 percent across three compilers, all named.
- **Every URL asserted programmatically before writing** — a report index of 485 URLs from the six agents' `## ALL URLS` sections plus a corpus tier of 5,799 URLs from other dossiers; **0 unmatched across 337 checked URLs** (114 / 119 / 104). One NRC URL was corrected by the check.

### Verified

- `sync-profiler-registry.py --check` clean (0 of 127 out of sync); `check-profiler-study.py` clean (101 guides, 811 concepts, 0 errors, 0 warnings); `check-profiler-reports.py` 0 errors.
- Playwright render of all three dossiers and all three guides: **zero page errors, zero console errors**, all nine per-slug tabs clickable including Relationships, sources counts matching the files exactly (81 / 81 / 72), no literal `{{}}` anywhere, and every `.gd-term` span resolving against the concepts registry.
- All 27 relationship slugs resolve to registry entries; all 19 photo paths exist on disk.

## [v04.62r] — 2026-09-05 03:52:41 AM EST

> Fresh session on Fable 5.1 Medium. Run Phase B session F5 of repository-information/PROFILER-COVERAGE-PLAN.md:
> esVolta, Strata Clean Energy, Hunt Energy Network — the §8 rows `esvolta`, `strata-clean-energy`,
> `hunt-energy-network` (all `developer · ipp`), listed under B5 in §4/§8. F5 is the fifth of the F1–F8
> regrouping recorded in §4 (dated paragraph, 2026-09-04, v04.58r); F1 landed at v04.58r, F2 at v04.59r,
> F3 at v04.60r, F4 (Invenergy, GridStor, Available Power) at v04.61r. When you flip the three §8 rows,
> record `B5 → F5` in the Group column exactly as F4 recorded `B4 → F4`, and record the effort level this
> session actually ran at in the Model column (`Fable 5.1 High → Medium` if Medium) per the §2 substitution
> rule — F5 is the measured test of Medium; report in the summary whether the tripwires fired (a third-party
> agent under 50 fetched URLs, snippet-reliant reports, judgments that read as summaries).
> READ FIRST: repository-information/SESSION-CONTEXT.md (both entries — the Latest has the F4 lessons, the
> harness fixes and the model decision); PROFILER-COVERAGE-PLAN.md §2, §4 row B-D / B5 and the regrouping
> paragraph, §7, and the three §8 rows; .claude/rules/profiler-app.md (Profiler Command, Profiler Prep
> Command); repository-information/PROFILER-SCHEMA.md; PROFILER-STYLES.md (active style: intel-briefing).
> CLASSROOM-CURRICULUM-PLAN.md §6 is NOT in scope — F5 closes no register row; do not edit it.
> .claude/rules/classroom-app.md is NOT needed.
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories per the §8 row, intel-briefing prose with confidence-tagged key judgments
> and an indicators-to-watch bullet) and study guide (schema v2, a where-it-fails section, {{term}} tooltips
> against profiler-concepts.json, new shared concepts registered there rather than in local glossaries,
> flashcards and quiz on how the business model and the buying process work, never company trivia).
> All three are private: disclose revenue, headcount, pipeline GW/GWh, backlog or funding only where a
> source states it (a sponsor's release or filing, a lender's release, a regulator — ERCOT, CAISO, PJM,
> MISO, FERC, a state PUC — a court record, a county permit, the company's own release); leave `expected`
> empty and say so; calendar rows carry `cadence: "quarterly"`.
> PREMISES TO RE-VERIFY FIRST (the §4 B5 row, written 2026-09-03: "Contracted and merchant mid-size BESS
> owners across CAISO, PJM and ERCOT" — F3's and F4's briefs were wrong on every company, so treat each
> clause as a dated claim): esVolta — who owns it today (sponsor or fund, stated stake and value), what is
> operating by MW/MWh and COD as released, contracted or merchant per project, and the esVolta–Captona
> Texas transaction Energy-Storage.news reported in January 2025 (cited in the GridStor dossier's sources).
> Strata Clean Energy — ownership and sponsor, what it owns versus what it develops and sells (it sold the
> 100 MW / 400 MWh White Tank project with its 20-year APS toll to GridStor on 18 September 2025 and stayed
> on 'in a consultative role' — the GridStor dossier's sources carry the releases), operating fleet by ISO,
> supplier and EPC names as released. Hunt Energy Network — ownership (the Hunt family relationship as a
> source states it), the ERCOT fleet by MW/MWh and COD, whether its batteries are distribution-connected
> sub-10 MW units (if so, the Available Power guide already owns the segment explanation — cite it, do not
> re-teach it), merchant or contracted, lenders and tax-equity or credit-transfer counterparties as
> released. Record every correction in the dossier's summary and judgments.
> RESEARCH PRIORITIES, for every company: the project list with status, ISO, MW/MWh, COD and offtake as
> released; financing (construction and term loans, tax equity, credit transfers, revenue puts, swaps or
> hedges — as released, lender named); sponsor commitments as released; supplier, integrator and EPC names
> as released among covered slugs; permit and county records; interconnection queue records; leadership
> with company-published headshots. Two research agents per company (first-party exhaustive, then
> third-party — sponsors' releases and filings, lenders, ISO and PUC records, county permits, court records,
> trade press), a URL for every relationship claim, relationships[] resolving only to covered slugs with a
> source that states the link — GridStor (`gridstor`) is now covered and is Strata's buyer; Available Power
> (`available-power`) and Invenergy (`invenergy`) are covered. Put every must-find item in the agent
> prompts — nothing can be searched after they return. Have every agent end its report in a `## ALL URLS`
> list of every URL it fetched successfully.
> STUDY GUIDES: one guide each, do not duplicate. Read the start-here callouts of the six F3/F4 guides
> and do not repeat their material: aypa-power (the contracted platform as a financed asset base, the
> conversion ladder, the financing stack, two ways to sell a tax credit, how a sponsor exits);
> spearmint-energy (the merchant developer, the development-stage price list, financing a battery with no
> PPA, the pre-COD market); intersect-power (the energy park, surplus interconnection, the captive
> developer); invenergy (the diversified developer, economic ownership vs control, build-and-transfer to
> utilities, merchant transmission); gridstor (the sponsor-created specialist, buying late-stage projects,
> RA vs toll vs revenue swap, what a sponsor's name lets a young company borrow); available-power (the
> sub-10 MW distributed play, siting on leased land, selling at NTP with a turnkey EPC, reading a silent
> company). The IPP dossiers (plus-power, jupiter-power, key-capture-energy, eolian, arevon, terra-gen,
> nextera-energy-resources) have no guides — do not look for them. The Classroom owns tolling, ancillary
> stacking and duration-and-degradation. Choose each F5 guide's angle from the record; candidate angles the
> corpus does not yet hold: the mixed contracted-and-merchant portfolio across three markets (how an owner
> allocates between RA and toll markets and energy-only ERCOT, and what a lender does with the mix); the
> originator that sells late-stage projects with the contract attached (Strata as GridStor's seller — the
> seller's side of the table the GridStor guide reads from the buyer's chair); the family- or
> strategic-owned developer and how it is financed without an infrastructure fund (verify the ownership
> first). If two companies turn out to be the same model, teach one as the case study and give the other
> the structural chapter.
> BOOKKEEPING, same commit: `python3 scripts/sync-profiler-registry.py`, `build-profiler-graph.py`,
> `check-profiler-study.py`; three calendar rows; README tree entries for every profile, study file and
> study-prep folder plus the execs count (recount the files by registry slug; currently 468 across 74
> companies — turner-* files belong to turner-construction); flip the three §8 rows; CHANGELOG entry
> (counter at 78/100 — no rotation). One push commit with repo version bump (v04.61r → v04.62r).
> ENVIRONMENT (confirmed by F1–F4): pip install playwright pymupdf pillow pillow-avif-plugin; never run
> playwright install — use the /opt/pw-browsers/chromium-*/chrome-linux/chrome executable; the HTTP server
> for the harness must be threaded (ThreadingMixIn, daemon threads, swallow BrokenPipeError); route
> script.google.com to the roles stub in scripts/verify-profiler-roles.py and fulfill accounts.google.com
> with an empty script; per-slug tabs are `#ov-tab-<key>`, the sources list is `.ov-sources ol li` (not
> `#ov-main ol li` — the numbered judgments leak in), the study button is `#ov-study-btn`, term spans are
> `.gd-term` with `data-term`; `page.goto('about:blank')` before every dossier (the study overlay otherwise
> intercepts the next dossier's tab clicks) and wrap the localStorage init script in try/catch; dry-run the
> harness on a known-good slug first. Timeline sections use lane keys `gen` / `deploy` / `eco`. Tool output
> above ~30 KB is persisted to a file — read agent reports in chunks of ≤40 lines. Foreground sleep is
> blocked — use the Monitor tool to wait for agent report files. The shell cwd resets to the repo root
> after every Bash call — use absolute paths. A stop hook fires on uncommitted edits while agents run —
> make no repo edits until the agents return. If agents die on an HTTP 429 usage limit, resume them by
> SendMessage after the reset rather than respawning (F2 and F4 both did this successfully). Business
> Wire and archive.org are 403/blocked — read Business Wire releases through Yahoo Finance, Stocktitan,
> Nasdaq, SFNet, 01net, Pulse 2.0, IREI, Energy Global or Batteries News mirrors and cite the mirror;
> a company that hosts its releases in full (GridStor did) needs no mirror.
> FIVE LESSONS FROM F1–F4, ALL MANDATORY: (1) build a URL index from the reports programmatically with a
> regex that keeps parentheses inside URLs (`https?://[^\s<>\[\]"'`]+`, strip trailing punctuation), add
> other covered dossiers' sources[] as a corpus tier, and make the assembler refuse any sources[],
> relationships[], policyExposure[] or recentDevelopments[] URL not in the index — 0 unmatched per dossier
> before writing; write all three profiles before relying on cross-citation; (2) treat every ownership,
> transaction, sponsor and pipeline premise in this brief as a dated fact to re-verify first — F3 and F4
> were wrong on all six companies; (3) keep press-reported values, analyst supplier attributions and
> permit design bases as `announced` with the reporter named, never `active`; interconnection adjacencies
> to a covered utility are `other`; exec-background links, JV attributions and analyst comparables are
> prose or `competitor` with the ranking cited, not supplier/customer relationships; (4) a company-hosted
> headshot whose filename marks a LinkedIn origin is skipped; company-published portrait renders count as
> company photos; (5) a photo caption is not a supplier attribution — read the sentence, not the image.
> Do not read other dossiers' prose as a template for judgments. Estimate ~90 minutes; F4 ran ~73 minutes
> net of a usage-limit stall.
> VERIFY BEFORE COMMIT: sync-profiler-registry.py --check clean, check-profiler-study.py clean, every
> dossier and guide renders with zero page errors and zero console errors (Playwright, per-slug tabs
> including Relationships, sources count matches the file, no literal {{}} and no unresolved term spans),
> every relationships[] slug and every {{term}} resolving. Normal Pre-Commit and Pre-Push checklists;
> push on a claude/* branch.
> If a capacity, a contract value, a transaction value or a customer cannot be sourced from a filing, a
> regulator, a court record or the party's own release, leave it out and say so.

### Added
- **esVolta dossier (`esvolta.profile.json`, schema v7, profileVersion 1, `developer · ipp`, intel-briefing)** — 108 sources (31% first-party), 4 relationships (Sungrow supplier, Quanta partner, GridStor and Intersect Power as Modo-grouped competitors), 3 policy regimes, 11 decision makers with 7 company-hosted headshots, a 15-band project ledger. The record: a Generate Capital portfolio company whose sponsor has mandated Barclays and Truist for its sale (Infralogic, 5 June 2026); 490 MW / 980 MWh operating in ERCOT behind "a hedge in place with a confidential commodity market participant"; PG&E and community-choice resource adequacy in CAISO; Boxcar and City Breeze under construction; Cactus Wren (800 MW / 3,200 MWh) permitted in Pinal County with no offtake.
- **Strata Clean Energy dossier (`strata-clean-energy.profile.json`, schema v7, profileVersion 1, `developer · ipp`)** — 103 sources (50% first-party), 11 relationships (GridStor as customer-buyer, Tesla and LS Energy Solutions active suppliers, Canadian Solar `announced`, Mortenson partner, Dominion customer, Arevon historical, four Solar Power World ranking competitors), 3 policy regimes, 12 decision makers with 10 headshots. The record: a founder-owned developer-EPC-owner that wins 20-year Arizona Public Service tolls and sells the battery with the contract attached — Scatter Wash to Copenhagen Infrastructure Partners (September 2024), White Tank to GridStor (September 2025), Ventura to Capital Dynamics and then Arevon — keeping Justice, Inland Empire, 20 MWh in Vermont and about 1 GW of owned solar.
- **Hunt Energy Network dossier (`hunt-energy-network.profile.json`, schema v7, profileVersion 1, `developer · ipp`)** — 87 sources (32% first-party, ten of them PUCT Interchange filings), 7 relationships (Canadian Solar supplier via the Fort Duncan purchase, Burns & McDonnell historical, Caterpillar at parent level as `other`, Jupiter Power and Plus Power as Modo revenue-ranking competitors, AEP and Oncor as wire-company adjacencies), 4 policy regimes, 6 decision makers with 5 headshots. The record: a Hunt-family-owned, Manulife-funded, 100 percent merchant owner-trader of 32 distribution-connected 9.9 MW batteries plus the 100 MW / 200 MWh Fort Duncan battery, dispatched by its own Level 4 qualified scheduling entity, now adding oil-fired peakers.
- **Three schema v2 study guides + three lesson plans** — `strata-clean-energy.study.json` (the seller at the table: what an originator makes, why a founder-owned developer sells a 20-year contract, the three sales read side by side, what the seller keeps in fees, how a lender reads a sold project); `esvolta.study.json` (the mixed book: three ways a battery is paid, the book by market, what a lender does with the mix, the disclosed stack by layer, when the sponsor sells); `hunt-energy-network.study.json` (the owner who trades: what a qualified scheduling entity is and why an owner would be one, five minutes at a time under RTC+B, a family and an insurer, why an owner-trader adds peakers, scale change). Each carries a where-it-fails callout, a slots-in table, ten flashcards and an eight-item quiz on the business model and the buying process.
- **18 shared concepts registered in `profiler-concepts.json`** (786 total) — the owner-and-trader vocabulary: RA contract, qualified scheduling entity, load zone, settlement point, joint venture, general account, wholesale distribution service, pre-NTP facility, green loan, real-time co-optimization, sale process, DSCR, family office, originator, unit classes, construction-management agreement, capital recycling, development margin.
- **Three quarterly calendar rows** in `profiler-refresh-calendar.json` (85 rows) with the re-verified premises written in as Chesterton checks; **22 headshots** in `images/execs/` (Strata 10, esVolta 7, Hunt 5), execs recount 490 images across 77 companies.

### Changed
- `PROFILER-COVERAGE-PLAN.md` §8 — the three rows flipped to `B5 → F5 … v1 · v04.62r | ✓ · v04.62r`, with the Model column recording the §2 substitution honestly: Fable 5.1 High → **Medium** for all research, dossiers, guides and lesson plans, then **Opus 5 xhigh** after the developer switched models for the bookkeeping tail. Registry synced (124 companies), graph rebuilt (865 edges, 653 curated), study checker clean (98 guides, 786 concepts), Playwright render of all nine dossier tabs and all three guides clean for each slug (sources counts 108 / 103 / 87 matching the files, no unresolved `{{term}}` spans, zero page and console errors).

### Fixed
- **All three §4 B5 premises were wrong and are corrected in the dossiers' summaries and judgments.** "Contracted and merchant mid-size BESS owners across CAISO, PJM and ERCOT" holds for none of them: esVolta is CAISO, ERCOT and WECC with SPP and MISO expansion and has never named a PJM project; Strata owns no battery in ERCOT or PJM, its one owned CAISO battery is Inland Empire under a PG&E resource-adequacy agreement, and its Arizona assets sit in APS territory outside any ISO; Hunt Energy Network is ERCOT-only, fully merchant and sub-10 MW rather than mid-size. Two further brief premises corrected: the esVolta–Captona transaction of January 2025 was a USD 243 million preferred-equity investment including ITC-transfer proceeds, not a sale, and Generate Capital acquired esVolta in July 2022, not 2023.
- Session lessons applied: every `sources[]`, `relationships[]`, `policyExposure[]` and `recentDevelopments[]` URL asserted against a programmatic index built from the six `## ALL URLS` lists plus a corpus tier — 0 unmatched per dossier before writing (139 / 140 / 119 URLs checked). Press-reported and inherited attributions kept as `announced` or `other` with the reporter named (Canadian Solar at White Tank recorded `announced` because Strata sold the project six months after signing the supply agreement; Burns & McDonnell recorded `historical` as the seller's EPC at Fort Duncan; AEP and Oncor recorded `other` as wire-company adjacencies, not commercial links). The one CDN-refused headshot (esVolta's chief commercial officer) was skipped rather than sourced elsewhere.

## [v04.61r] — 2026-09-05 02:45:13 AM EST

> Fresh session on Fable 5.1 High. Run Phase B session F4 of repository-information/PROFILER-COVERAGE-PLAN.md:
> Invenergy, Gridstor, Available Power — the §8 rows `invenergy`, `gridstor`, `available-power` (all
> `developer · ipp`), listed under B4 in §4/§8. F4 is the fourth of the F1–F8 regrouping recorded in §4
> (dated paragraph, 2026-09-04, v04.58r); F1 landed at v04.58r, F2 at v04.59r, F3 (Aypa Power, Spearmint
> Energy, Intersect) at v04.60r. When you flip the three §8 rows, record `B4 → F4` in the Group column
> exactly as F3 recorded `B3 → F3`.
> READ FIRST: repository-information/SESSION-CONTEXT.md (both entries — the Latest has the F3 lessons and
> environment notes); PROFILER-COVERAGE-PLAN.md §2 (the model rule — no substitution to record, F4 is
> natively Fable High), §4 row B-D / B4 and the regrouping paragraph, §7, and the three §8 rows;
> .claude/rules/profiler-app.md (Profiler Command, Profiler Prep Command); repository-information/
> PROFILER-SCHEMA.md; PROFILER-STYLES.md (active style: intel-briefing). CLASSROOM-CURRICULUM-PLAN.md §6
> is NOT in scope — F4 closes no register row (the §8 "Closes" column reads "buyer side"); do not edit it.
> .claude/rules/classroom-app.md is NOT needed.
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories per the §8 row, intel-briefing prose with confidence-tagged key judgments
> and an indicators-to-watch bullet) and study guide (schema v2, a where-it-fails section, {{term}} tooltips
> against profiler-concepts.json, new shared concepts registered there rather than in local glossaries,
> flashcards and quiz on how the business model and the buying process work, never company trivia).
> All three are private: disclose revenue, headcount, pipeline GW/GWh, backlog or funding only where a
> source states it (a sponsor's release or filing, a lender's release, a regulator — ERCOT, CAISO, PJM,
> MISO, FERC, a state PUC — a court record, a county permit, the company's own release); leave `expected`
> empty and say so; calendar rows carry `cadence: "quarterly"`.
> PREMISES TO RE-VERIFY FIRST (dated facts from the §4 row, written 2026-09-03): Invenergy — "largest
> private US developer": whose ranking and on what measure; the ownership stack today (Blackstone
> Infrastructure's stake and its stated value, CDPQ, Invenergy Renewables vs Invenergy Transmission vs
> Invenergy Storage as separate entities); what the four covered dossiers that name Invenergy actually
> say about it. Gridstor — "CAISO/ERCOT merchant storage specialist": the sponsor (Goldman Sachs Asset
> Management's Infrastructure business or whoever a release names), operating MW/MWh and CODs as released,
> and whether its projects are merchant or contracted. Available Power — the same: sponsor, what is
> operating, merchant or contracted. Record every correction in the dossier's summary and judgments.
> RESEARCH PRIORITIES. Invenergy: the storage fleet and pipeline by ISO with MW/MWh and CODs only as
> released (the developer's own project list is large — cover storage and the AIDC-relevant projects,
> not every wind farm); the ownership history and any Blackstone/CDPQ transaction values as filed; the
> Grain Belt Express and Clean Path NY transmission story only as it bears on storage and large-load
> siting; named offtakers among covered slugs (hyperscalers, utilities); equipment suppliers and
> integrators named in releases among covered slugs; leadership. Gridstor and Available Power: the
> project list with status and financing (construction loans, tax equity, credit transfer, revenue puts
> or hedges — as released), sponsor commitments as released, supplier and EPC names as released, permit
> and county records, leadership. For every company: two research agents (first-party exhaustive, then
> third-party — sponsors' releases and filings, lenders, ISO and PUC records, county permits, court
> records, trade press), a URL for every relationship claim, relationships[] resolving only to covered
> slugs with a source that states the link. Put every must-find item in the agent prompts — nothing can
> be searched after they return.
> STUDY GUIDES: one guide each, do not duplicate. The aypa-power, spearmint-energy and intersect-power
> guides (F3) own: the contracted platform as a financed asset base and the conversion ladder; the
> merchant developer, the development-stage price list, financing a battery with no PPA and the pre-COD
> market; the co-located energy park, surplus interconnection, SB 6 net metering and the captive
> developer. Read their start-here callouts and do not repeat that material. The IPP dossiers
> (plus-power, jupiter-power, key-capture-energy, eolian, arevon, terra-gen, nextera-energy-resources)
> have NO study guides — do not look for them. The Classroom owns tolling, ancillary stacking and
> duration-and-degradation. Invenergy: the diversified private developer — how a multi-technology
> developer allocates capital across wind, solar, storage, gas and transmission, why transmission
> ownership changes what a developer can site, how a private developer of that scale is owned and
> financed (sponsor stakes, infrastructure funds, portfolio-level debt), where it fails. Gridstor: the
> merchant storage specialist inside a bank's infrastructure platform — how sponsor equity from an asset
> manager is deployed into standalone storage, what a sponsor-backed specialist can finance that a
> founder-led one cannot, where it fails. Available Power: choose the guide's angle from the record
> (the third merchant specialist must not repeat Gridstor's — if the two are the same model, teach
> Available Power as the case study and give Gridstor the structural chapter).
> BOOKKEEPING, same commit: `python3 scripts/sync-profiler-registry.py`, `build-profiler-graph.py`,
> `check-profiler-study.py`; three calendar rows; README tree entries for every profile, study file and
> study-prep folder plus the execs count (recount the files by registry slug; currently 433 across 71
> companies — remember turner-* files belong to turner-construction); flip the three §8 rows; CHANGELOG
> entry (counter at 77/100 — no rotation). One push commit with repo version bump (v04.60r → v04.61r).
> ENVIRONMENT (confirmed by F1–F3, 2026-09-04): pip install playwright pymupdf pillow pillow-avif-plugin
> (AVIF headshots need the plugin); never run playwright install — use the
> /opt/pw-browsers/chromium-*/chrome-linux/chrome executable; the HTTP server for the harness must be
> threaded (ThreadingMixIn, daemon threads, swallow BrokenPipeError); route script.google.com to the
> roles stub in scripts/verify-profiler-roles.py and fulfill accounts.google.com with an empty script;
> per-slug tabs are `#ov-tab-<key>`, the study button is `#ov-study-btn`, term spans are `.gd-term`
> with `data-term`; reload between dossiers; dry-run the harness on a known-good slug first. Tool output
> above ~30 KB is persisted to a file — read agent reports in chunks of ≤40 lines. Foreground sleep is
> blocked — use the Monitor tool to wait for agent report files. The shell cwd resets to the repo root
> after every Bash call — use absolute paths. A stop hook fires on uncommitted edits while agents run —
> `git stash` plan edits and pop them before the commit. If agents die on an HTTP 429 usage limit,
> resume them by SendMessage after the reset rather than respawning. Business Wire and archive.org are
> 403/blocked from this environment — read Business Wire releases through Yahoo Finance, SFNet, 01net,
> Pulse 2.0, IREI, Energy Global or Batteries News mirrors and cite the mirror; the company's news page
> gives the titles.
> FOUR LESSONS FROM F1–F3, ALL MANDATORY: (1) have each agent report end in a `## ALL URLS` list, build
> a URL index from the reports programmatically with a regex that keeps parentheses inside URLs
> (`https?://[^\s<>\[\]"'`]+`, strip trailing punctuation), and make the assembler refuse any sources[],
> relationships[], policyExposure[] or recentDevelopments[] URL not in the index — 0 unmatched per
> dossier before writing; cite another covered dossier's source (corpus tier) rather than memory when a
> release times out; (2) treat every ownership, transaction, sponsor and pipeline premise in this brief
> as a dated fact to re-verify first — F3's brief was wrong on all three companies (a sale not yet
> closed, a sponsor that does not exist, a campus that does not exist); (3) keep press-reported values
> and permit design bases as `announced` with the reporter named, never `active`; exec-background links,
> JV attributions and analyst comparables are prose or `competitor` with the ranking cited, not
> supplier/customer relationships; (4) a company-hosted headshot whose filename marks a LinkedIn origin
> is skipped. Do not read other dossiers' prose as a template for judgments. Estimate ~90 minutes; F3
> ran 53 minutes with no usage-limit stall.
> VERIFY BEFORE COMMIT: sync-profiler-registry.py --check clean, check-profiler-study.py clean, every
> dossier and guide renders with zero page errors and zero console errors (Playwright, per-slug tabs
> including Relationships, sources count matches the file, no literal {{}} and no unresolved term spans),
> every relationships[] slug and every {{term}} resolving. Normal Pre-Commit and Pre-Push checklists;
> push on a claude/* branch.
> If a capacity, a contract value, a transaction value or a customer cannot be sourced from a filing, a
> regulator, a court record or the party's own release, leave it out and say so.

### Added
- **Invenergy dossier (`invenergy.profile.json`, schema v7, profileVersion 1, `developer · ipp`, intel-briefing)** — 134 sources (55% first-party), 14 relationships (Meta, AEP, Microsoft, Kiewit, Quanta, Siemens Energy, GE Vernova, Blattner, NVIDIA, Tesla, Dominion, Equinix, NextEra and Apex as ranked competitors), 6 policy regimes, 18 decision makers with 16 company-published headshots, a three-table Technical Annex (storage ledger, Grain Belt Express, gas plants for utilities), 39 developments, 7 key judgments. Premises corrected: 'largest privately held' is company/Blackstone language — Cleanview's live rankings place Invenergy #2 by development pipeline (41,328 MW behind NextEra's 68,229 MW) and largest among non-utility developers on that measure; the ownership stack is CDPQ (52.4% economic ownership of Invenergy Renewables LLC since 2018), Blackstone Infrastructure Partners (about USD 4bn into Invenergy Renewables Holdings LLC, 2022–2023) and management as managing member, with the gas fleet in Invenergy Clean Power LLC 50/50 with InfraBridge — no 2024–2026 stake change found; the four corpus dossiers naming Invenergy (AEP, Kiewit, Meta, Apex) are consistent with the record. New material: the April 2026 Invenergy Power unit for gas and data centres, Sycamore Riverside (918 MW) to I&M, about 3.3 GW of Wisconsin gas for We Energies, the USD 765m Interior offshore-lease buyout redirected to gas and geothermal (45 BLM leases), the DOE's July 2025 termination of the USD 4.9bn Grain Belt guarantee and the January 2026 Illinois Supreme Court win, Clean Path NY's November 2024 termination. Storage: no supplier is named anywhere — recorded as the dossier's largest collection gap
- **GridStor dossier (`gridstor.profile.json`, schema v7, profileVersion 1, `developer · ipp`)** — 97 sources (44% first-party), 6 relationships (Tesla active; Canadian Solar `announced` on Enerdatics' SolBank 3.0 report; Xcel Energy and AEP as interconnection adjacencies; Intersect and Plus Power as Modo/ESN-ranked competitors), 5 policy regimes, 18 decision makers (14 headshots plus 4 board members), a project ledger, 27 developments, 7 judgments. Premise corrected: the company is contracted (SCE 17-year RA at Goleta, 20-year APS toll at White Tank, a Fortune 500 toll at Gunnar, a 100 MW Axpo revenue swap on Hidden Lakes), multi-market (CA, TX, AZ, OK/SPP, CO), Portland-based, and owned by 'a fund managed by Goldman Sachs Asset Management' (trade press: Horizon Energy Storage) that created the company in 2021 per Latitude Media — 'GSAM Infrastructure' and 'merchant' were both wrong. 280 MW / 600 MWh operating, 250 MW / 700 MWh under construction, five late-stage acquisitions in eighteen months; financings from NORD/LB (four transactions), First Citizens, Siemens Financial Services, J.P. Morgan and Foss & Company as released
- **Available Power dossier (`available-power.profile.json`, schema v7, profileVersion 1, `developer · ipp`)** — 42 sources (26% first-party), 2 competitor relationships (Plus Power, ON.energy in the ERCOT sub-10 MW segment per Energy-Storage.news), 5 policy regimes, 6 decision makers with 5 company-published portrait renders, a project ledger, 18 developments, 6 judgments. Premise corrected on every count: Texas-only (no CAISO), develop-and-sell at notice-to-proceed of 9.9 MW / 20 MWh distribution-connected batteries with Linxon as turnkey EPC (not owner-operator), no sponsor named by any source, nothing operating under its ownership on any tracker, and a parent — Available Infrastructure, Tysons Corner — that rebranded to edge-AI and cybersecurity in July 2025 with Available Power as a business unit; the storage record has been silent since March 2024 (Greenport 'at NTP' in a LevelTen auction; three 9.9 MW sales to unnamed buyers). Sungrow is a photo caption about another company's project, not a supplier
- **Three schema v2 study guides + three lesson plans** — `invenergy.study.json` (the diversified private developer: one capital budget and five products; who owns a 38 GW private company; why a pension fund and a bank fund own a developer; build-and-transfer gas to utilities; what owning transmission changes; the 2022–2026 policy timeline; disclosed capital by size; diversified vs pure-play; where it fails), `gridstor.study.json` (the storage specialist a bank built: how an asset manager's fund owns a developer; buying late; why buy instead of originate; the three contracting structures; what a sponsor can finance that a founder cannot; disclosed facilities; sponsor-created vs founder-led; where it fails), `available-power.study.json` (the distributed play: why 9.9 MW and the ERCOT distributed-generation path; siting on leased land; selling at notice to proceed; the buyer side of a small battery; where it fails and how to read a silent company) — each with a where-it-fails callout, a slots-in table, flashcards and a self-test on the business model, never company trivia; `repository-information/study-prep/{invenergy,gridstor,available-power}/*-lesson-plan.md`
- **38 shared concepts registered in `profiler-concepts.json`** (768 total) — managing member, economic ownership, infrastructure fund, fund life, limited/general partner, asset manager, pension fund, sponsor-created platform, merchant transmission, converter station, open access transmission tariff, loan guarantee, conditional commitment, eminent domain, easement, offshore wind lease, farmdown, virtual PPA, environmental attribute purchase agreement, development pipeline, independent power producer, change of control, begin-construction deadline, revenue swap, distributed generation resource, distribution service provider, site lease, turnkey EPC, project marketplace, IRR, balance of plant, large load, responsive reserve service, fast frequency response, CEQA, community choice aggregator, Chapter 381 agreement
- **Three quarterly calendar rows** in `profiler-refresh-calendar.json` (82) with re-verified premises as Chesterton checks; **35 headshots** in `images/execs/` (Invenergy 16 from its Contentstack leadership page, GridStor 14 from its team pages, Available Power 5 company-published low-poly portrait renders); README tree entries for every new profile, study file and study-prep folder; execs count recounted by registry slug to **468 images across 74 companies**

### Changed
- `PROFILER-COVERAGE-PLAN.md` §8 — the three rows flipped to `B4 → F4 … v1 · v04.61r | ✓ · v04.61r`; registry synced (121 companies), graph rebuilt (837 edges), study checker clean (95 guides), Playwright render of every tab and guide clean (sources counts match, no literal braces, 0 unresolved terms, 0 page errors)

### Fixed
- Session lessons applied: every sources[], relationships[], policyExposure[] and recentDevelopments[] URL asserted against a programmatic index of the six `## ALL URLS` lists (parentheses kept inside URLs) — 0 unmatched per dossier; the harness now reloads to `about:blank` between dossiers (the study-guide overlay otherwise intercepts the next dossier's tab clicks) and its init script tolerates `about:blank`'s denied localStorage

## [v04.60r] — 2026-09-04 11:08:01 PM EST

> Fresh session on Fable 5.1 High. Run Phase B session F3 of repository-information/PROFILER-COVERAGE-PLAN.md:
> Aypa Power, Spearmint Energy, Intersect Power — the §8 rows `aypa-power`, `spearmint-energy`,
> `intersect-power` (all `developer · ipp`), listed under B3 in §4/§8. F3 is the third of the F1–F8
> regrouping recorded in §4 (dated paragraph, 2026-09-04, v04.58r); F1 landed DNV, Sargent & Lundy and
> CoolIT at v04.58r, F2 landed Fluidstack, Nscale and Anthropic at v04.59r. When you flip the three §8
> rows, record `B3 → F3` in the Group column exactly as F1 recorded `B10 → F1` and F2 recorded `B9 → F2`.
> READ FIRST: repository-information/SESSION-CONTEXT.md (both entries — the Latest has the F2 lessons and
> environment notes); PROFILER-COVERAGE-PLAN.md §2 (the model rule — no substitution to record, F3 is
> natively Fable High), §4 row B-D / B3 and the regrouping paragraph, §7, and the three §8 rows;
> .claude/rules/profiler-app.md (Profiler Command, Profiler Prep Command); repository-information/
> PROFILER-SCHEMA.md; PROFILER-STYLES.md (active style: intel-briefing). CLASSROOM-CURRICULUM-PLAN.md §6
> is NOT in scope — F3 closes no register row (the §8 "Closes" column reads "buyer side"); do not edit it.
> .claude/rules/classroom-app.md is NOT needed.
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories per the §8 row, intel-briefing prose with confidence-tagged key judgments
> and an indicators-to-watch bullet) and study guide (schema v2, a where-it-fails section, {{term}} tooltips
> against profiler-concepts.json, new shared concepts registered there rather than in local glossaries,
> flashcards and quiz on how the business model and the buying process work, never company trivia).
> All three are private or subsidiaries: disclose revenue, headcount, pipeline GW/GWh, backlog or funding
> only where a source states it (a sponsor's or acquirer's release or filing, a lender's release, a
> regulator — ERCOT, CAISO, PUCT, CPUC, FERC — a court record, a county permit, the company's own release);
> leave `expected` empty and say so; calendar rows carry `cadence: "quarterly"`.
> PREMISES TO RE-VERIFY FIRST (all three are dated facts from the §4 row and the §5 C10 row, written
> 2026-09-03): Aypa Power — "Blackstone → Brookfield" and "Brookfield is buying Aypa": has the sale
> signed, closed, or neither, at what stated value, and who owns it today; the "~6.5 GW" platform figure —
> whose number, operating vs under construction vs pipeline. Intersect Power — "Google-owned since 2026":
> the acquisition's announcement date, close date and stated value from Google's or Intersect's own
> release, what Google actually bought (the development platform, named projects, the TPG/CAI investors'
> exits), and whether Intersect still develops for third parties. Spearmint Energy — "ERCOT merchant with
> 15 GWh in development": whose figure, what is operating (Revolution and any others by MW/MWh and COD),
> funding and lenders as released. Record every correction in the dossier's summary and judgments.
> RESEARCH PRIORITIES. Aypa: the operating fleet and the pipeline by ISO with MW/MWh and CODs only as
> released; the financing stack (portfolio revolvers, project loans, tax-credit transfers — amounts and
> lenders as released); named offtakers and tolling/RA contracts with covered counterparties; the
> Blackstone Energy Transition Partners history and the Brookfield transaction; equipment suppliers named
> in releases (integrators and cell makers among covered slugs); leadership. Spearmint: the ERCOT and
> other-ISO project list with status; how a merchant developer finances without a PPA (revenue puts,
> hedges, tax-credit transfer, construction loans — as released); asset sales to IPPs; the Blackstone/
> other sponsor relationships; supplier names as released; leadership. Intersect: the co-located energy
> park model — named projects (Texas and Wyoming campuses and any others) with generation, storage and
> data-centre MW as released; the Google acquisition and the pre-acquisition TPG Rise Climate / CAI /
> Google investment rounds; the surplus-interconnection and behind-the-meter structures it uses and any
> FERC or ERCOT filings; supplier and EPC relationships among covered slugs (Tesla, Fluence, Sungrow,
> Mortenson, Blattner, SOLV, Quanta, Primoris — only where a source states the link); leadership and who
> stayed after the deal. For every company: two research agents (first-party exhaustive, then third-party
> — sponsors' and acquirers' releases and filings, lenders, ISO and PUC records, county permits, court
> records, trade press), a URL for every relationship claim, relationships[] resolving only to covered
> slugs with a source that states the link. Put every must-find item in the agent prompts — nothing can
> be searched after they return.
> STUDY GUIDES: one guide each, do not duplicate. Check the existing plus-power, jupiter-power,
> key-capture-energy, eolian, arevon, terra-gen and nextera-energy-resources guides first and do not
> repeat their IPP material (tolling franchises, ERCOT ancillary revenue stacking, dual-sourcing,
> safe-harboured fleets, the market-maker IPP); check the crusoe, xai and google guides and do not repeat
> their energy-first siting, islanded-campus or TPU material; the Classroom's duration-and-degradation
> material (revenue shapes) is also owned elsewhere. Aypa: the standalone storage platform as a financed
> asset base — what a buyer of a multi-GW platform is paying for (queue positions, land, contracted
> revenue, the team), pipeline-to-operating conversion, portfolio financing and tax-credit transfer, how a
> sponsor exits, where it fails. Spearmint: the merchant developer — develop-to-sell against
> develop-to-hold, the development-stage ladder and what each stage is worth, financing a merchant project
> without a PPA, the pre-COD project M&A market, where it fails. Intersect: the co-located energy park —
> generation, storage and load behind one interconnection, what surplus interconnection service and
> behind-the-meter structures buy and what they forbid, why a hyperscaler bought a developer instead of
> signing PPAs, how the park is contracted and financed, where it fails.
> BOOKKEEPING, same commit: `python3 scripts/sync-profiler-registry.py`, `build-profiler-graph.py`,
> `check-profiler-study.py`; three calendar rows; README tree entries for every profile, study file and
> study-prep folder plus the execs count (recount the files by registry slug; currently 407 across 69
> companies — the F2 recount found the earlier 68 baseline one high); flip the three §8 rows; CHANGELOG
> entry (counter at 76/100 — no rotation). One push commit with repo version bump (v04.59r → v04.60r).
> ENVIRONMENT (confirmed by F1 and F2, 2026-09-04): pip install playwright and pip install pymupdf are
> both needed; never run playwright install — use the /opt/pw-browsers/chromium-*/chrome-linux/chrome
> executable; the HTTP server for the harness must be threaded (ThreadingMixIn, daemon threads, swallow
> BrokenPipeError); route script.google.com to the roles stub in scripts/verify-profiler-roles.py and
> fulfill accounts.google.com with an empty script; reload between dossiers; dry-run the harness on a
> known-good slug first. Tool output above ~30 KB is persisted to a file — read agent reports in chunks
> of ≤40 lines. Foreground sleep is blocked — use the Monitor tool to wait for agent report files. The
> shell cwd resets to the repo root after every Bash call — use absolute paths. A stop hook fires on
> uncommitted edits while agents run — `git stash` plan edits and pop them before the commit. If agents
> die on an HTTP 429 usage limit, resume them by SendMessage after the reset rather than respawning.
> THREE LESSONS FROM F1 AND F2, ALL MANDATORY: (1) have each agent report end in a `## ALL URLS` list,
> build a URL index from the reports programmatically, and make the assembler refuse any sources[],
> relationships[], policyExposure[] or recentDevelopments[] URL not in the index — 0 unmatched per
> dossier before writing; cite another covered dossier's source (corpus tier) rather than memory when a
> release times out; (2) treat every ownership, transaction and funding premise in this brief as a dated
> fact to re-verify first — see PREMISES above; (3) keep press-reported contract or transaction values
> as `announced` with the reporter named, never `active`. Do not read other dossiers' prose as a template
> for judgments. Estimate ~90 minutes; F2 ran ~72 minutes net of a usage-limit stall.
> VERIFY BEFORE COMMIT: sync-profiler-registry.py --check clean, check-profiler-study.py clean, every
> dossier and guide renders with zero page errors and zero console errors (Playwright, per-slug tabs
> including Relationships, sources count matches the file, no literal {{}} and no unresolved term spans),
> every relationships[] slug and every {{term}} resolving. Normal Pre-Commit and Pre-Push checklists;
> push on a claude/* branch.
> If a capacity, a contract value, a transaction value or a customer cannot be sourced from a filing, a
> regulator, a court record or the party's own release, leave it out and say so.

### Added

- **`live-site-pages/profiler-data/aypa-power.profile.json`** — Aypa Power, `developer · ipp`, schema v7, profileVersion 1, intel-briefing style: 91 sources (71 dated; 44% first-party), 5 products, two spec groups (a 22-row project ledger by market and status; a financing ledger from the USD 320m 2023 corporate facility to the USD 1.55bn March 2026 facility, the USD 1.5bn warehouse and seven project packages), 30 developments, 4 relationships (canadian-solar, sungrow, eolian, key-capture-energy), 7 policy regimes, 12 decision makers from Aypa's own SC PSC testimony exhibit (no company-published headshots exist — aypa.com has no leadership page), private financials with a `mw-contracted` KPI of 6,500 MW; 6 confidence-tagged judgments, a collection-gaps paragraph and an indicators-to-watch bullet. **Premises re-verified as dated facts:** the Brookfield sale is **signed, not closed** (22 July 2026; about USD 7bn EV / USD 3bn equity per the joint release and Brookfield Asset Management's 8-K; 'subject to customary regulatory approvals'; no closing by 5 September 2026; aypa.com still reads 'A Blackstone Portfolio Company'); the '~6.5 GW' is Brookfield's figure, split by Brookfield Renewable as about 3,000 MW operating and under construction plus about 3,500 MW contracted — Aypa has never published the split. The Yadkins PPA counterparty, the Bypass offtaker and the tax-credit-transfer buyers are undisclosed and left out.
- **`live-site-pages/profiler-data/spearmint-energy.profile.json`** — Spearmint Energy, `developer · ipp`, profileVersion 1: 114 sources (77 dated; 23% first-party — Business Wire returns 403 from this environment, so every release was read through Yahoo Finance, SFNet, 01net, Pulse 2.0, IREI and Energy Global mirrors), 4 products, two spec groups (an 11-row project ledger across ERCOT, MISO and SPP; a financing ledger from the USD 200m Aiga term loan to the USD 325m June 2026 facility and the about USD 450m Red Egret package), 23 developments, 5 relationships (sungrow, mortenson, tesla `announced` as a permit design basis, jupiter-power and intersect-power as Modo-ranked competitors), 7 policy regimes, 20 decision makers with 19 company-published headshots (the board included; one board photo omitted because its filename indicates a LinkedIn origin), private financials with a `mw-energized` KPI of 350 MW; 6 judgments. **Premises re-verified:** no Blackstone or any other sponsor relationship exists in any source — lender Elda River states the company is 'controlled by Roscommon Analytics'; the '15 GWh' is the company's own boilerplate (January and May 2026), dropped from 21 May 2026 onward; the operating fleet is 350 MW / 700 MWh (Revolution COD January 2024; Tierra Seca and Seven Flags late December 2025) with Red Egret 300 MW / 600 MWh under construction; the model is develop-to-own, not develop-to-sell. No offtaker, hedge or revenue put is named for any project; FERC MBR/QSE records were unreadable (403) and are recorded as unverified, not absent.
- **`live-site-pages/profiler-data/intersect-power.profile.json`** — Intersect (formerly Intersect Power), `developer · ipp`, `ownership.type: subsidiary`, profileVersion 1: 116 sources (92 dated; 51% first-party — Google/Alphabet channels count as the parent's), 5 products, two spec groups (the three named Texas energy parks — Quantum, Meitner, Roman — and the transaction-and-fleet ledger), 27 developments, 6 relationships (google investor/owner, tesla, microsoft and constellation-energy `historical` via Oberon, equinix, crusoe), 6 policy regimes, 9 decision makers with 7 company-published headshots; financials from Alphabet's 10-Qs. **Premises re-verified:** the Google acquisition was **announced 22 December 2025 and closed 10 March 2026** (USD 4.75bn cash plus debt per Alphabet; USD 5,868m final purchase price with USD 1,214m of debt assumed and USD 2,174m of goodwill per Alphabet's Q2 2026 10-Q); Google bought the development platform, team and Texas parks only — the grid-tied fleet (about 4.4 GW solar / 8.8 GWh storage) was carved out to IPX Power under TPG Rise Climate, CAI and Greenbelt with the former CFO, COO and CCO; no source says Intersect develops for third parties; **there is no Wyoming campus** in any source. Data-centre MW, gas capacity and every FERC/ERCOT/PUCT filing are recorded as collection gaps.
- **`aypa-power.study.json`, `spearmint-energy.study.json`, `intersect-power.study.json`** (schema v2 — 13 / 12 / 12 sections, each with a start-here callout naming what it does not repeat, a where-it-fails callout, a where-X-slots-in table, ten flashcards and an eight-item self-test on the business model and the buying process, never company trivia). Aypa teaches the standalone storage platform as a financed asset base: four things inside the price, the pipeline-to-operating conversion ladder (Pediment as the worked example), who holds the dispatch rights across five contract forms, the financing stack layer by layer, two ways to sell a tax credit, how a sponsor exits, contracted against merchant from the buyer's chair. Spearmint teaches the merchant developer: sell the project or keep it, the development ladder as a price list, financing a battery with no PPA, the pre-COD project market, the desk as the collateral, what the fleet earned when the market turned. Intersect teaches the co-located energy park: three assets behind one interconnection, what surplus interconnection service, behind-the-meter load and SB 6 net metering buy and forbid, why a hyperscaler bought the developer, how the park is contracted and financed across three eras, what Google bought and left. The brief's list of existing IPP guides to avoid (plus-power, jupiter-power, key-capture-energy, eolian, arevon, terra-gen, nextera-energy-resources) does not exist — none of those dossiers has a study guide (the Phase C backfills) — so the guides instead name the Classroom's tolling / ancillary-stacking / duration-and-degradation material and the crusoe / xai / google guides as what they do not repeat.
- **`repository-information/study-prep/{aypa-power,spearmint-energy,intersect-power}/*-lesson-plan.md`** — three five-module lesson plans from the Profiler Prep Command.
- **`live-site-pages/images/execs/`** — 26 new company-published headshots (intersect-power-* 7, spearmint-energy-* 19).
- **`profiler-concepts.json`** — 46 new shared concepts registered (684 → 730): ancillary-services, energy-arbitrage, merchant, develop-to-own, develop-to-sell, development-stage-ladder, site-control, queue-position, ntp, cod, ready-to-build, pre-cod-ma, platform-sale, enterprise-value, moic, financial-sponsor, carve-out, purchase-price-allocation, goodwill, variable-interest-entity, captive-developer, tax-equity, partnership-flip, tax-equity-bridge-loan, construction-to-term-loan, back-leverage, warehouse-facility, letter-of-credit-facility, preferred-equity, revenue-put, hedge, in-house-optimisation, energy-storage-service-agreement, dispatch-rights, average-remaining-contract-life, percent-contracted, solar-plus-storage, surplus-interconnection-service, energy-park, firming, powered-land, co-location-net-metering, conditional-use-permit, energy-community-bonus, chapter-312-abatement, interconnection-agreement. Two aliases dropped for collisions with existing entries (`build-own-operate`, `letter of credit`). No local glossaries.

### Changed

- **`profiler-companies.json`** — three registry entries under `developer · ipp`, 115 → 118 companies; `sync-profiler-registry.py` wrote `srcTotal`/`srcFirstPct`/`kpiNorm`. **`profiler-graph.json`** rebuilt: 810 edges (609 curated), built 2026-09-05. **`repository-information/profiler-refresh-calendar.json`** — three private rows with `cadence: "quarterly"`, a source note naming each company's real disclosure channels (counterparty and regulator records for Aypa; release mirrors, lender and counsel releases and MPUC dockets for Spearmint; Alphabet filings, sellers' releases and county minutes for Intersect), and watch lists ending in a Chesterton check (76 → 79 rows); `updated` 2026-09-05.
- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — the three §8 rows flipped to `B3 → F3 … v1 · v04.60r | ✓ · v04.60r`, exactly as F1 recorded `B10 → F1` and F2 recorded `B9 → F2`. No model substitution to record. `CLASSROOM-CURRICULUM-PLAN.md` §6 not touched (F3 closes no register row).
- README tree: entries for the three profiles, three study guides, three study-prep folders and lesson plans; execs line recounted from the files by registry slug — 407 → **433 images across 71 companies** (two companies gained headshots; Aypa publishes none); `Last updated:` and `Repo version:`; repo version v04.59r → **v04.60r**.

### Verified

- Every URL in `sources[]`, `relationships[]`, `policyExposure[]` and `recentDevelopments[]` of all three dossiers was asserted programmatically against a URL index extracted from the six research-agent reports (each ending in `## ALL URLS`) with other covered dossiers' sources as a second tier: 0 unmatched per dossier before writing (two label typos and one parenthesised URL caught by the check and corrected; no corpus-tier citation was needed). Every relationship carries a source that states the link; press-reported values and design-basis links are `announced`, never `active`.
- `sync-profiler-registry.py --check`: 0 of 118 out of sync. `check-profiler-study.py`: 92 guides + 730 concepts, 0 errors, 0 warnings. `build-profiler-graph.py`: no unresolved slugs.
- Playwright (threaded server, GAS stubbed as admin, accounts.google.com fulfilled empty, dry-run on `fluidstack` first): each of the three dossiers renders all nine tabs including Relationships (4 / 6 / 11 rendered links), every `sources[]` entry renders (91 / 114 / 116), no literal `{{`, each study guide opens from `#ov-study-btn` with every `.gd-term` resolving against the concepts registry (40 / 30 / 27 term spans), zero page errors, zero console errors.

## [v04.59r] — 2026-09-04 10:05:27 PM EST

> Fresh session on Fable 5.1 High. Run Phase B session F2 of repository-information/PROFILER-COVERAGE-PLAN.md:
> Fluidstack, Nscale, Anthropic — the §8 rows `fluidstack` (neocloud), `nscale` (neocloud), `anthropic`
> (hyperscaler), listed under B9 in §4/§8. F2 is the second of the F1–F8 regrouping recorded in §4 (dated
> paragraph, 2026-09-04, v04.58r); F1 landed DNV, Sargent & Lundy and CoolIT at v04.58r. When you flip the
> three §8 rows, record `B9 → F2` in the Group column exactly as F1 recorded `B10 → F1`.
> READ FIRST: repository-information/SESSION-CONTEXT.md (both entries — the Latest has the F1 lessons and
> environment notes); PROFILER-COVERAGE-PLAN.md §2 (the model rule — no substitution to record, F2 is
> natively Fable High), §4 row B-A / B9 and the regrouping paragraph, §7, and the three §8 rows;
> .claude/rules/profiler-app.md (Profiler Command, Profiler Prep Command); repository-information/
> PROFILER-SCHEMA.md; PROFILER-STYLES.md (active style: intel-briefing). CLASSROOM-CURRICULUM-PLAN.md §6
> is NOT in scope — F2 closes no register row (the §8 "Closes" column reads "AIDC developers"); do not
> edit it. .claude/rules/classroom-app.md is NOT needed.
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories per the §8 row, intel-briefing prose with confidence-tagged key judgments
> and an indicators-to-watch bullet) and study guide (schema v2, a where-it-fails section, {{term}} tooltips
> against profiler-concepts.json, new shared concepts registered there rather than in local glossaries,
> flashcards and quiz on how the business model and the buying process work, never company trivia).
> All three are private: disclose revenue, headcount, backlog or funding only where a source states it
> (a funding release, a lender's or landlord's filing, a regulator, a court record, the company's own
> release); leave `expected` empty and say so; calendar rows carry `cadence: "quarterly"`.
> RESEARCH PRIORITIES. Fluidstack: tenant-of-record position in the TeraWulf, Hut 8 and Cipher leases
> (capacity in MW, term, the Google backstop/guarantee mechanics and warrants, dates from the landlords'
> 8-Ks and releases), the Anthropic–Fluidstack River Bend and other named sites, the French/European
> sovereign-compute announcements, what Fluidstack actually owns versus leases (no GPUs on balance sheet?),
> ownership and funding rounds with amounts only where stated, leadership. Nscale: the Microsoft-anchored
> contracts (Narvik/Norway, Texas, UK — GW and GPU counts as stated by Microsoft or Nscale), the Aker JV,
> the Stargate UK / OpenAI announcements, funding rounds (Series B amount and investors as released),
> sites and power sources, leadership, and what is contracted versus announced. Anthropic: treat it as the
> compute buyer — the Google TPU and Amazon Trainium commitments (Project Rainier, the 1 GW / multi-GW
> TPU announcements, the Microsoft/NVIDIA deal — numbers only as the parties released them), the
> Fluidstack $50bn data-centre programme and the Texas/New York sites, the Enchanted Rock 470 MW order and
> the TeraWulf 401 MW lease already named in ten covered dossiers (resolve every one as a relationships[]
> entry with the source that states the link), ownership (Amazon and Google stakes as disclosed),
> governance (LTBT, PBC status), revenue run-rate only where a named executive or filing states it, and
> its policy exposure (export controls, the RAISE-style state bills, EU AI Act). For every company: two
> research agents (first-party exhaustive, then third-party — landlords' SEC filings, lenders, regulators,
> court records, trade press), a URL for every relationship claim, relationships[] resolving only to
> covered slugs with a source that states the link. Put every must-find item in the agent prompts —
> nothing can be searched after they return.
> STUDY GUIDES: one guide each, do not duplicate. Check the existing coreweave, nebius, lambda, crusoe and
> iren guides first and do not repeat their neocloud material (GPU-as-a-service unit economics, the
> GPU-backed debt structure, the hyperscaler-anchor tenant model). Fluidstack: the tenant-of-record
> structure — who signs the lease, who guarantees it, who owns the GPUs, what the landlord's lender sees,
> how a backstop/warrant package prices a credit gap, the counterparty chain from landlord to end user.
> Nscale: sovereign and anchored compute — how a single-anchor neocloud is financed and built (Microsoft's
> commitments as the collateral), power-first siting in the Nordics, what "contracted" means in a
> gigawatt announcement versus a signed capacity agreement. Anthropic: the AI lab as a compute buyer —
> how a frontier lab contracts capacity across three silicon suppliers, take-or-pay and prepayment
> structures, the make-versus-lease decision, why a lab signs a 401 MW lease and a 470 MW generation order
> itself, and where the buyer fails (concentration, delivery-date risk, power before chips). Check the
> openai and xai guides first and do not repeat their compute-buyer material.
> BOOKKEEPING, same commit: `python3 scripts/sync-profiler-registry.py`, `build-profiler-graph.py`,
> `check-profiler-study.py`; three calendar rows; README tree entries for every profile, study file and
> study-prep folder plus the execs count (recount the files; currently 376 across 68 companies); flip the
> three §8 rows; CHANGELOG entry (counter at 75/100 — no rotation). One push commit with repo version bump.
> ENVIRONMENT (confirmed by F1, 2026-09-04): pip install playwright and pip install pymupdf are both
> needed; never run playwright install — use the /opt/pw-browsers/chromium-*/chrome-linux/chrome
> executable; the HTTP server for the harness must be threaded (ThreadingMixIn, daemon threads, swallow
> BrokenPipeError); route script.google.com to the roles stub in scripts/verify-profiler-roles.py and
> fulfill accounts.google.com with an empty script; reload between dossiers. Tool output above ~30 KB is
> persisted to a file — read agent reports in chunks of ≤40 lines. Foreground sleep is blocked — use the
> Monitor tool to wait for agent report files. A stop hook fires on uncommitted edits while agents run —
> `git stash` plan edits and pop them before the commit. TWO LESSONS FROM F1, BOTH MANDATORY: (1) build
> the sources[] list from a URL index extracted programmatically from the agent reports and assert every
> URL against it before writing the profile — F1 fabricated one URL from a remembered quote and caught it
> only by grepping; (2) treat every ownership, litigation and funding premise in this brief as a dated
> fact to re-verify first — F1's brief was stale on CoolIT's owner and on a court outcome. Do not read
> other dossiers' prose as a template for judgments. Estimate ~90 minutes; F1 took 1h 34m.
> VERIFY BEFORE COMMIT: sync-profiler-registry.py --check clean, check-profiler-study.py clean, every
> dossier and guide renders with zero page errors and zero console errors (Playwright, per-slug tabs
> including Relationships, sources count matches the file, no literal {{}} and no unresolved term spans),
> every relationships[] slug and every {{term}} resolving. Normal Pre-Commit and Pre-Push checklists;
> push on a claude/* branch.
> If a capacity, a contract value or a customer cannot be sourced from a filing, a regulator, a court
> record or the party's own release, leave it out and say so.

### Added

**Profiler dossiers + study guides — Phase B session F2 (data-only; no page or GAS change)**

- **`live-site-pages/profiler-data/fluidstack.profile.json`** — Fluidstack, `neocloud`, schema v7, profileVersion 1, intel-briefing style: 136 sources (110 dated; 47% first-party), 5 products, two spec groups (the lease ledger per campus — Lake Mariner 378 MW, Abernathy 168, Barber Lake 207, River Bend 245, New Lebanon 430, about 1.4 GW contracted critical IT — and the platform), 35 developments, 9 relationships to covered companies (anthropic, google, terawulf, entergy, aep, nvidia, nscale, nebius, iren), 6 policy regimes, 10 decision makers (no company-published headshots found), private financials with a `mw-contracted` KPI of 1,428 MW; 6 confidence-tagged judgments, a collection-gaps paragraph and an indicators-to-watch bullet. **Premises re-verified as dated facts:** the reported USD 1.5bn round at USD 18bn (September 2026) is unannounced by the company and is marked reported; the 1 GW France campus memorandum was withdrawn in March 2026; every Google backstop term is sourced from the landlords' filings and law-firm alerts because Google has published nothing naming Fluidstack.
- **`live-site-pages/profiler-data/nscale.profile.json`** — Nscale, `neocloud`, profileVersion 1: 126 sources (98 dated; 51% first-party), 6 products, 39 developments, 9 relationships (microsoft active; anthropic `announced` — the reported USD 45bn / 460 MW Monarch contract, unconfirmed by either party; openai `announced`; nvidia, caterpillar, schneider-electric, fluidstack, nebius; google `historical`), 5 policy regimes, 20 decision makers with 16 headshots; revenue (about USD 33m 2025, about USD 100m Q2 2026) and the USD 51bn backlog carried as press-reported. **Premises re-verified:** OpenAI's Stargate Norway LOI was replaced by Microsoft (Aker, April 2026) and Stargate UK is paused; Microsoft walked from the 1.35 GW Monarch LOI (Semafor) before Anthropic took 460 MW.
- **`live-site-pages/profiler-data/anthropic.profile.json`** — Anthropic, `hyperscaler`, profileVersion 1: 149 sources (140 dated; 56% first-party), 5 products (the compute book, sites/leases/power, Claude models, Claude Code, verticals and government), two spec groups (the commitments ledger; funding and run-rate), 45 developments, 13 relationships (amazon, google, microsoft, nvidia, terawulf, enchanted-rock, fluidstack, xai, openai active; coreweave, nscale, lambda, entergy `announced`), 7 policy regimes, 19 decision makers with 15 headshots; 7 judgments. Run-rate revenue (USD 9bn end-2025 → USD 47bn May 2026) and the Series H (USD 65bn at USD 965bn post-money) are the company's own statements; the confidential draft S-1 (1 June 2026) has nothing public. **Premise re-verified:** the 401 MW, 20-year lease is at Justified (Hawesville, KY), direct with TeraWulf, with no Fluidstack entity in it.
- **`fluidstack.study.json`, `nscale.study.json`, `anthropic.study.json`** (schema v2 — 14 / 13 / 12 sections, each with a start-here callout, a where-it-fails section, a where-X-slots-in table, flashcards and a self-test on the structure and the buying process, never company trivia). Fluidstack teaches the tenant-of-record structure: the six-seat counterparty chain, the recognition agreement step by step, what the landlord's lender sees, backstops and penny warrants, modified gross against triple net, critical IT against gross against utility megawatts, who eats a delay. Nscale teaches the anchored neocloud as a financing structure: the vocabulary of not-yet, anatomy of an anchor contract, signature-to-collateral sequence, why the loan is investment grade and the company is not, power-first Nordic siting, sovereign compute, the Monarch anchor-change case. Anthropic teaches the lab as compute buyer: three silicons and three kinds of contract, take-or-pay / prepayment / milestone money from the buyer's chair, the six-rung counterparty ladder, why sign the 401 MW lease yourself, why buy 470 MW of generation, the lessor chip vehicle and residual-value support, the delivery window. None repeats the coreweave / nebius / lambda / crusoe / iren neocloud material or the openai / xai compute-buyer material — each guide names what those guides own and references it.
- **`repository-information/study-prep/{fluidstack,nscale,anthropic}/*-lesson-plan.md`** — three five-module lesson plans from the Profiler Prep Command.
- **`live-site-pages/images/execs/`** — 31 new company-published headshots (anthropic-* 15, nscale-* 16).
- **`profiler-concepts.json`** — 46 new shared concepts registered (638 → 684): tenant-of-record, recognition-agreement, credit-backstop, penny-warrant, bankruptcy-remote-spv, modified-gross-lease, triple-net-lease, critical-it-load, gross-capacity, rent-escalator, pass-through-costs, lockbox-account, completion-guarantee, construction-period-risk, delivery-milestone, chip-leasing-vehicle, residual-value-support, counterparty-chain, letter-of-intent, memorandum-of-understanding, capacity-agreement, expansion-option, grid-capacity-reservation, anchor-tenant, delayed-draw-term-loan, revolving-credit-facility, investment-grade-rating, project-financing, sovereign-compute, ai-growth-zone, power-first-siting, heat-reuse, multi-silicon-strategy, compute-commitment, milestone-funding, prepayment, monthly-capacity-fee, direct-lease, equipment-purchase-order, power-before-chips, delivery-date-risk, supplier-concentration, run-rate-revenue, tpu, trainium, islanded-microgrid. No local glossaries.

### Changed

- **`profiler-companies.json`** — three registry entries (`fluidstack` and `nscale` under `neocloud`, `anthropic` under `hyperscaler`), 112 → 115 companies; `sync-profiler-registry.py` wrote `srcTotal`/`srcFirstPct`/`kpiNorm`. **`profiler-graph.json`** rebuilt: 785 edges (594 curated), built 2026-09-05. **`repository-information/profiler-refresh-calendar.json`** — three private rows with `cadence: "quarterly"`, a source note naming the counterparty filings that are each company's real disclosure channel, and watch lists ending in a Chesterton check (73 → 76 rows); `updated` 2026-09-05.
- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — the three §8 rows flipped to `B9 → F2 … v1 · v04.59r | ✓ · v04.59r`, exactly as F1 recorded `B10 → F1`. `CLASSROOM-CURRICULUM-PLAN.md` §6 not touched (out of scope for F2).
- README tree: entries for the three profiles, three study guides, three study-prep folders and lesson plans; execs line recounted from the files — 376 → **407 images across 69 companies** (the recount by registry slug gives 69, not the 70 the prior 68 baseline would imply; the prior figure was one high); `Last updated:` and `Repo version:`; repo version v04.58r → **v04.59r**.

### Verified

- Every URL in `sources[]`, `relationships[]`, `policyExposure[]` and `recentDevelopments[]` of all three dossiers was asserted programmatically against a URL index extracted from the six research-agent reports (plus pages fetched in-session and other covered dossiers' sources): 0 unmatched per dossier — the F1 lesson applied.
- `sync-profiler-registry.py --check`: 0 of 115 out of sync. `check-profiler-study.py`: 89 guides + 684 concepts, 0 errors, 0 warnings. `build-profiler-graph.py`: no unresolved slugs.
- Playwright (threaded server, GAS stubbed as admin): each of the three dossiers renders all nine tabs including Relationships (9 / 9 / 13 curated links, 0 unresolved), every `sources[]` entry renders (136 / 126 / 149), each study guide opens with 0 literal `{{}}` markers and 0 unresolved term spans (16 / 22 / 22 spans), zero page errors and zero console errors — ALL CLEAN. Dry-run of the same harness on `coolit` was clean before the new slugs were checked.

## [v04.58r] — 2026-09-04 07:21:00 PM EST

> Fresh session on Fable 5.1 High. Run Phase B session F1 of repository-information/PROFILER-COVERAGE-PLAN.md:
> DNV, Sargent & Lundy, CoolIT Systems — the §8 rows `dnv` (advisor), `sargent-lundy` (advisor), `coolit`
> (supplier), listed under B10 in §4/§8. F1 is the first of the F1–F8 regrouping recommended in chat on
> 2026-09-04 (SESSION-CONTEXT.md, Previous Sessions): B10 was split, MGX + Excelsior + X-energy moved to F6.
> When you flip the three §8 rows, add one dated line to §4 recording that regrouping so the plan matches.
> READ FIRST: repository-information/SESSION-CONTEXT.md (both entries — the Latest has the environment notes
> and the head-to-head lessons); PROFILER-COVERAGE-PLAN.md §2 (the model rule, now with a dated head-to-head
> paragraph — no substitution to record, F1 is natively Fable High), §7 and the three §8 rows;
> CLASSROOM-CURRICULUM-PLAN.md §6 rows G7 and G10 — F1 closes both; .claude/rules/profiler-app.md (Profiler
> Command, Profiler Prep Command); repository-information/PROFILER-SCHEMA.md; PROFILER-STYLES.md (active
> style: intel-briefing); .claude/rules/classroom-app.md is NOT needed — no lesson is being written.
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories per the §8 row, intel-briefing prose with confidence-tagged key judgments and
> an indicators-to-watch bullet) and study guide (schema v2, a where-it-fails section, {{term}} tooltips
> against profiler-concepts.json, new shared concepts registered there rather than in local glossaries,
> flashcards and quiz on how the technology and the buying process work, never company trivia). All three
> are private: DNV is foundation-owned, Sargent & Lundy is employee-owned, CoolIT is KKR-owned since 2023.
> Disclose revenue, headcount or backlog only where a source states it; leave `expected` empty and say so;
> calendar rows carry `cadence: "quarterly"`.
> RESEARCH PRIORITIES. DNV: what the independent engineer actually delivers in a BESS or AIDC financing —
> IE report scope, technical due-diligence stages, the Energy Storage recommended practices and product
> certifications it publishes (name them and their revision dates), the annual battery-performance
> scorecard, the grid-code and interconnection studies, the data-center power and cooling advisory line;
> named BESS/AIDC engagements with covered companies. Sargent & Lundy: owner's-engineer and IE roles on
> generation, transmission, BESS and data-center campus power; nuclear (SMR, restart) work; named
> utility and hyperscaler engagements; how it is paid (fee-for-service, no equity). CoolIT: every CDU and
> cold-plate line by capacity (kW) and form factor (in-rack, row, facility), the NVIDIA GB200 NVL72 /
> Vera Rubin reference-design position, coolant chemistry and filtration, the Calgary and any new
> manufacturing capacity, the KKR ownership and the Asetek patent litigation outcome, hyperscaler and OEM
> channel (Dell, HPE, Supermicro, Lenovo). For each firm the two research agents must be told explicitly:
> first-party exhaustive (recommended practices, certification scopes, project sheets, datasheets,
> leadership pages with headshot URLs) then third-party (trade press, court records, ratings where any
> exist, partner announcements), with a URL for every relationship claim and the schema's rule that
> relationships[] resolve only to covered slugs with a source that states the link. Put every must-find
> item in the agent prompts — nothing can be searched after they return.
> STUDY GUIDES. G10 (DNV + S&L, one guide each, do not duplicate): what "bankable" means and who decides
> it; the IE's place between lender, owner, EPC and OEM; the technical due-diligence sequence from
> feasibility to construction monitoring; what a certification does and does not prove; where the IE
> fails (scope gaps, reliance letters, augmentation assumptions). G7 (CoolIT): the CDU as a machine —
> heat exchanger, pumps, filtration, secondary loop, the TCS/FWS interface and ASHRAE W-classes, approach
> temperature and why it decides the chiller plant, flow balancing across a row, leak detection and the
> failure modes that take a rack down. Check the existing trane-technologies guide first and do not
> repeat its chiller material.
> REGISTER + CHIPS. This is the first `advisor` category with data: after the registry sync, run a
> Playwright pass on the roster with the advisor chip selected and on each dossier's Relationships tab,
> and screenshot it — include the check in the report. Append a dated re-check parenthetical to the G7
> and G10 rows in CLASSROOM-CURRICULUM-PLAN.md §6 naming the slugs that landed and flip their status
> (G7 → Closed if the CDU half now exists; G10 → Closed or Partial per your judgment on whether two IE
> dossiers satisfy "insurance and independent engineers" — brokers are still absent; say so).
> BOOKKEEPING, same commit: python3 scripts/sync-profiler-registry.py, build-profiler-graph.py,
> check-profiler-study.py; three calendar rows; README tree entries for every profile, study file and
> study-prep folder plus the execs count; flip the three §8 rows; the §4 line above; CHANGELOG entry
> (counter is at 74/100 — no rotation this session). One push commit with the repo version bump.
> ENVIRONMENT (confirmed this session): pip install playwright and pip install pymupdf are both needed;
> never run playwright install — use the /opt/pw-browsers/chromium-*/chrome-linux/chrome executable; the
> HTTP server for the harness must be threaded (ThreadingMixIn, daemon threads, swallow BrokenPipeError)
> or Profiler.html's ~100 parallel JSON fetches deadlock it; route script.google.com to the roles stub in
> scripts/verify-profiler-roles.py and fulfill accounts.google.com with an empty script; reload between
> dossiers. The refresh-calendar and registry taglines summarize existing dossiers — irrelevant here since
> all three are new, but do not read other dossiers' prose as a template for judgments.
> VERIFY BEFORE COMMIT: sync-profiler-registry.py --check clean, check-profiler-study.py clean, every
> dossier and guide renders with zero page errors and zero console errors, every relationships[] slug and
> every {{term}} resolving. Normal Pre-Commit and Pre-Push checklists; push on a claude/* branch.
> If a rating, a spec or an engagement cannot be sourced from a datasheet, a recommended practice, a court
> record, a regulator or the company's own release, leave it out and say so.

### Added

**Profiler dossiers + study guides — Phase B session F1 (data-only; no page or GAS change)**

- **`live-site-pages/profiler-data/dnv.profile.json`** — DNV, `advisor`, schema v7, profileVersion 1, intel-briefing style: 101 sources (76 dated; 32% first-party — dnv.com is unreadable from this environment behind Cloudflare, so the 2025 annual report was read from a mirror host with `party: "company"` and 14 dnv.com pages are cited by title only, stated as a collection gap in the dossier); 7 products, 36 spec rows (Energy Storage recommended practices with revision dates, Battery Scorecard, grid-code and interconnection studies, data-centre advisory), 24 developments, 10 relationships to covered companies, 4 policy regimes, 9 decision makers with 4 headshots extracted from the annual report; NOK financials with `expected` empty and no USD normalisation (no sourced FX rate); 7 confidence-tagged judgments, a collection-gaps paragraph and an indicators-to-watch bullet.
- **`live-site-pages/profiler-data/sargent-lundy.profile.json`** — Sargent & Lundy, `advisor`, profileVersion 1: 158 sources (71% first-party), 8 products, 30 developments, 16 relationships (entergy, xcel-energy, southern-company, constellation-energy, dominion-energy, nextera-energy-resources, bechtel, ge-vernova, mitsubishi-power, kiewit, wartsila, rosendin, black-veatch, burns-mcdonnell, dnv…), 6 policy regimes, 18 decision makers with 12 headshots; private — no revenue disclosed and none invented; premise correction recorded: the firm describes itself as "privately owned and led by engineers" and is absent from the NCEO Employee Ownership 100 — it is not an ESOP.
- **`live-site-pages/profiler-data/coolit.profile.json`** — CoolIT Systems, `supplier`, profileVersion 1: 151 sources (65% first-party), every CDU line by kW and form factor (CHx2000/1500/500, AHx240/180, CHx200/80, legacy CHx750) with 56 spec rows, the NVIDIA Recommended Vendor List rack-count table, coolant chemistry and filtration, 29 developments, 3 relationships (nvidia partner; vertiv and schneider-electric competitors), 5 policy regimes, 14 decision makers with 12 headshots. **Two premise corrections in the commissioning brief, recorded in the dossier rather than smoothed:** CoolIT is an Ecolab subsidiary (agreement 2026-03-20, closed 2026-07-02, about USD 4.75bn, roughly 29x NTM adjusted EBITDA on about USD 550m NTM sales), owned by KKR and Mubadala only from May 2023 to July 2026; and Asetek v. CoolIT never reached a jury — the 2022-09-11 summary-judgment order (Asetek's patent valid but not infringed), a confidential settlement and dismissal on 2022-10-06, with the Federal Circuit reviving CoolIT's own '567 patent on 2024-03-07 (court records cited).
- **`dnv.study.json`, `sargent-lundy.study.json`, `coolit.study.json`** (schema v2, each with a where-it-fails section, flashcards and a self-test on how the technology and the buying process work — never company trivia). DNV and Sargent & Lundy are one lesson in two halves (G10): what "bankable" means and who decides it, the IE between lender, owner, EPC and OEM, inside the IE report, degradation and test data, certification against recommended practice, the financing sequence, reliance and liability, where the IE fails — then owner's engineer against independent engineer against engineer of record, the 30/60/90 design review, how engineering firms are paid, campus power as an owner's-engineer problem. CoolIT (G7) teaches the CDU as a machine — heat exchanger, pumps, filtration, reservoir and ride-through power; the TCS/FWS boundary; approach temperature as the number that sizes the chiller plant; ASHRAE W-classes; flow, pressure and balancing across a row; PG25 chemistry; the three CDU positions; leak detection and the rack-down failure modes; how liquid cooling is bought through two channels — and does not repeat the Trane guide's chiller material or the Vertiv guide's thermal-chain material.
- **`repository-information/study-prep/{dnv,sargent-lundy,coolit}/*-lesson-plan.md`** — three five-module lesson plans from the Profiler Prep Command.
- **`live-site-pages/images/execs/`** — 28 new company-published headshots (dnv-* 4, sargent-lundy-* 12, coolit-* 12).
- **`profiler-concepts.json`** — 28 new shared concepts registered (610 → 638): financial-close, conditions-precedent, drawdown, reliance-letter, liquidated-damages, iec-62933, owners-engineer, engineer-of-record from the IE guides; approach-temperature, ashrae-w-class, facility-water-system, direct-liquid-cooling, pg25, corrosion-inhibitor, galvanic-corrosion, dew-point, flow-balancing, pressure-drop, rack-manifold, quick-disconnect, leak-detection, in-rack-cdu, in-row-cdu, liquid-to-air-cdu, rear-door-heat-exchanger, plate-heat-exchanger, thermal-design-power, wetted-materials from the CDU guide. The existing `approach` (tower/chiller sense) is left alone; `approach-temperature` carries only the "approach temperature differential" alias to avoid the collision.

### Changed

- **`profiler-companies.json`** — three registry entries (`dnv` and `sargent-lundy` are the first two `advisor`-category entries with data; `coolit` under `supplier`), 109 → 112 companies; `sync-profiler-registry.py` wrote `srcTotal`/`srcFirstPct`/`kpiNorm`. **`profiler-graph.json`** rebuilt: 745 edges (566 curated), 2,196 evidence items. **`repository-information/profiler-refresh-calendar.json`** — three private rows with `cadence: "quarterly"`, a source note and watch lists (73 rows); `updated` 2026-09-04.
- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — the three §8 rows flipped to `B10 → F1 … v1 · v04.58r | ✓ · v04.58r`; a dated §4 paragraph records the F1–F8 regrouping (B10 split; MGX, Excelsior and X-energy moved to F6).
- **`repository-information/CLASSROOM-CURRICULUM-PLAN.md` §6** — G7 → **Closed** v04.58r (the CDU-specialist half landed; Trane holds the chiller half); G10 → **Partial** v04.58r (two independent-engineer dossiers landed and `what-bankable-means` now has public corroboration, but the row also names insurance and brokers, and no broker or insurer dossier exists — said so on the row).
- README tree: entries for the three profiles, three study guides, three study-prep folders and lesson plans; execs count 348 → 376 images across 68 companies; `Last updated:` and `Repo version:`; repo version v04.57r → **v04.58r**.

### Verified

- `sync-profiler-registry.py --check`: 0 of 112 out of sync. `check-profiler-study.py`: 86 guides + 638 concepts, 0 errors, 0 warnings. `build-profiler-graph.py`: no unresolved slugs.
- Playwright (threaded server, GAS stubbed): roster renders with the **Advisor chip showing 2** and filtering to DNV and Sargent & Lundy; each of the three dossiers renders all nine tabs including Relationships (10 / 16 / 3 curated links, 0 unresolved), every `sources[]` entry renders (101 / 158 / 151), each study guide renders with 0 literal `{{}}` markers and 0 unresolved term spans; zero page errors and zero console errors. Screenshots kept in the session scratchpad.

## [v04.57r] — 2026-09-04 05:11:11 PM EST

> Fresh session on Fable 5.1 High. Resolve the one active reminder in repository-information/REMINDERS.md: a head-to-head model comparison, Fable 5.1 High against Opus 5 xhigh, on the Xcel Energy dossier.
> READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/REMINDERS.md (the active reminder is the spec); repository-information/PROFILER-COVERAGE-PLAN.md §2 (the model rule and its confidence note) and the §8 `xcel-energy` row; .claude/rules/profiler-app.md (Profiler Command, Archival Procedure); repository-information/PROFILER-SCHEMA.md; repository-information/PROFILER-STYLES.md (active style: intel-briefing).
> BASELINE: live-site-pages/profiler-data/xcel-energy.profile.json is the Opus 5 xhigh version — profileVersion 1, written at v04.46r in commit 2652d30 and unchanged since (confirm with `git diff 2652d30 -- live-site-pages/profiler-data/xcel-energy.profile.json`, which must be empty). Before anything else, copy it to the scratchpad as the diff anchor. Do NOT touch xcel-energy.study.json — this is dossier-only.
> WRITE BLIND: do not read the Opus dossier while researching or writing. Note only its slug and categories, run the research and author profileVersion 2 from your own research, and open the baseline only after v2 is written. Otherwise the comparison measures editing, not authoring.
> THE TASK: run `profiler Xcel Energy` as a normal revision — archive v1 to profiler-data/archive/xcel-energy.profile.v1.json with its archive-index entry, write profileVersion 2 with the two parallel research subagents and the Source Priority Protocol, then sync-profiler-registry.py and build-profiler-graph.py.
> THE REPORT — in chat, section by section, never as a raw patch: sources (count, first-party share, which sources each model found that the other did not); productsAndServices; technicalSpecs; financials and the KPI overlay; recentDevelopments; relationships (which links each model was willing to assert, and on what source); policyExposure; decisionMakers; strategyRead judgment by judgment. Classify EVERY difference as either (a) SAME FACT, DIFFERENT TREATMENT — both versions had the fact and one hedged where the other asserted, declined a relationship for want of a source, kept a figure separate where the other blended it, or stated a gap the other filled — or (b) SEARCH LUCK — a source one pass found and the other did not. Weight (a); discount (b). Two research passes never see the same web, so a large diff is not by itself evidence of a model gap. End with one verdict on the §2 claim that Fable is better at the judgments and the relationship discipline — confirmed, not confirmed, or inconclusive — citing the (a)-class evidence that decides it.
> BOOKKEEPING, same commit: flip the §8 `xcel-energy` row to record the re-run (keep the Opus v1 substitution note and append `→ v2 · vXX.XXr` on Fable 5.1 High, head-to-head); write the verdict as a dated paragraph in §2's confidence note so the model rule keeps its evidence trail; move the reminder to Completed Reminders in REMINDERS.md with a completion timestamp (the developer authorised this when commissioning the session on 2026-09-04); repo CHANGELOG entry mentions the archived v1 and the verdict. One push commit.
> VERIFY: sync-profiler-registry.py --check clean, the dossier renders (Playwright), zero page errors. Normal Pre-Commit and Pre-Push checklists; push on a claude/* branch.

### Changed

**Profiler dossier — Xcel Energy head-to-head (data-only)**

- **`live-site-pages/profiler-data/xcel-energy.profile.json` refreshed to profileVersion 2 on Fable 5.1 High; v1 (the Opus 5 xhigh version, v04.46r) archived to `archive/xcel-energy.profile.v1.json` with its archive-index entry.** Written blind to v1 from two parallel research subagents (156 first-party and 139 third-party source entries evaluated) under the Source Priority Protocol: 140 sources at 54 percent first-party (v1: 101 at 46 percent), 9 product lines, 6 spec groups with 79 banded rows, 4 financial periods with Zacks-attributed consensus and GAAP/ongoing kept separate, 50 developments, 10 relationships, 6 policy regimes, 15 decision makers (existing company-published headshots reused for 11), 7 confidence-tagged judgments plus a dated indicator list. New in v2 against v1: the Siemens Energy 2,088 MW turbine order, the Fermi America 200 MW ESA, the Mortenson EPC on High Plains Solar + BESS, the Texas AG injunction terms and April 2027 trial date, the interim SPS presidency recorded as a stated collection gap, the Meta link dated to its 2023 MPUC approval from Xcel's own newsroom, and the Google ESA carried as `announced` pending approval. Withheld: a Moody's negative-outlook claim found only on an aggregator and asserted in v1 without a resolvable source; the `aligned` link v1 drew from the EEI project list, which this pass did not retrieve.
- **Head-to-head verdict on the §2 model rule: inconclusive.** Narrow Fable edge on relationship and sourcing discipline (status and date precision, the withheld rating claim, the stated SPS gap); no gap on the judgments in either direction — v1 read the pipeline slide more closely and found the PSCo-not-in-an-RTO structural point, v2 added the ownership-ratio judgment and indicators; v1's 10-K extraction was materially deeper on the same document. No Fable make-good warranted for Oncor or AEP. Recorded as a dated paragraph in `PROFILER-COVERAGE-PLAN.md` §2's confidence note; the §8 `xcel-energy` row now reads `v1 · v04.46r → v2 · v04.57r` with the re-run noted beside the Opus substitution.
- `profiler-companies.json`: tagline rewritten for v2; `sync-profiler-registry.py` reconciled `lastUpdated`, `srcTotal` 101 → 140 and `srcFirstPct` 46 → 54. `profiler-graph.json` rebuilt (710 edges, 538 curated). `profiler-refresh-calendar.json`: `lastRefreshed` advanced to 2026-09-04 and the SPS-leadership watch item rewritten to what v2 established.
- `repository-information/REMINDERS.md`: the Xcel head-to-head reminder moved to Completed Reminders (developer-authorised on commissioning the session).
- README tree: archived `xcel-energy.profile.v1.json` entry added; `Last updated:` and `Repo version:`; repo version v04.56r → **v04.57r**.

## [v04.56r] — 2026-09-04 04:09:00 PM EST

> Give me the prompt to paste into a new Opus 5 xhigh session to commission the G6 guidance module, then remember session.

### Fixed

- **`repository-information/CLASSROOM-CURRICULUM-PLAN.md` §6 — the v04.55r Standings text about G6 was wrong and is corrected in two places.** It said G6's subjects "exist in the corpus only as fragments inside Burns & McDonnell's guide, Dominion's guide and the procurement module" and advised that a G6 session "should expect to do more of its own research than the G4 session did." Both claims were inherited from the G6 row's own v04.44r text rather than checked against the corpus — **which is precisely the failure the Standings block exists to prevent, reproduced one commit after the trail paragraph describing it.** Grounding the G6 commissioning prompt surfaced it: a scan of every `*.study.json` section title for interconnection, tariff, queue, cost-causation and co-location content returns **at least a dozen guides**, not fragments — the six `utility` guides (`dominion-energy`, `aep`, `oncor`, `southern-company`, `xcel-energy`, `entergy`), `burns-mcdonnell`, and the requester-side guides `stack-infrastructure`, `aligned`, `switch`, `amazon`, `meta` and `core-scientific`. Five of the six utility guides landed at v04.53r, *after* the row's last substantive re-check, which is why its text is stale.
- **The genuine G6 gap is narrower and sharper than the row states, and both the Standings block and a new dated re-check parenthetical on the row now say so.** The **state and utility half is well covered publicly** — large-load tariff anatomy, the load-interconnection study sequence, cost-causation against socialization, SB 6 clause by clause, Georgia's January 2025 large-load rule, one tariff in three state drafts, the 80 percent minimum-demand arithmetic, and queue-gaming and power-banking from the requester's side. **What is absent is the federal layer**: the string `"Order 2023"` appears **nowhere** in the corpus, and study-fee and deposit regimes are no one's subject. A session commissioned against the row's own words would over-research the state side and under-research the federal one. **G6 stays Open** — `guidanceDocs_()` still has no interconnection module — but its premise is now accurate.

### Changed

- **`repository-information/SESSION-CONTEXT.md`** — Remember Session. Latest Session rotated into Previous Sessions under the 2-session cap; the new entry records the G4 module, the §6 bookkeeping, the self-correction above, the `reviewBy` gate rationale, the nine items that went into *what the record does NOT say* rather than into the module, the re-confirmed Playwright harness notes (plus that `pip install playwright` and `pip install pymupdf` are both needed in a fresh container), and a G6 recommendation briefed on the corrected split rather than on the row's words.
- README `Last updated:` and `Repo version:`; repo version v04.55r → **v04.56r**.

### Notes

- **No code, page or GAS changes** — this commit touches three markdown files only, so no page or GAS version was bumped and no page or GAS changelog gained an entry.
- **The mechanical rule that would have prevented this**, recorded in the session context for the next session: before writing anything about a register row's premise, scan the corpus for it. The `glob` over `*.study.json` section titles that found the dozen guides took about ten seconds.

## [v04.55r] — 2026-09-04 04:01:12 PM EST

> Commission the G4 guidance module on Opus 5 xhigh as a fresh session: "The grid-equipment
> shortage: GOES, bushings, test bays, lead times". This is an INDUSTRY GUIDANCE session, not a
> Profiler session. It closes the last remaining ask on CLASSROOM-CURRICULUM-PLAN.md §6 row G4.
>
> There is NO model rule to record. §2 of PROFILER-COVERAGE-PLAN.md assigns models for Profiler
> sessions; §8 contains no guidance-module row at all — which is precisely why G4 is "structural"
> and why no scheduled session can close it. Do not add a §8 row for this work.
>
> READ FIRST, before writing anything:
>
> 1. `.claude/rules/industry-guidance.md` — all ten steps. It is short and it is the whole
>    procedure. Steps 4, 5, 9 and 10 are the ones with traps in them.
> 2. CLASSROOM-CURRICULUM-PLAN.md §6 — the G4 row in full, including its three dated re-check
>    parentheticals, AND the "Standings — read this before the trail below" block above the table.
>    §5's failure map, rows 1, 2, 3 and 4, is the map this module has to line up with.
> 3. The two existing modules this one sits beside: `guidanceDocUtilityAidc_()` (the demand side of
>    the same story) and `guidanceDocEo14420_()` (the newest module, and the closest precedent for
>    a supply-restriction topic) in the PROJECT block of `googleAppsScripts/Profiler/Profiler.gs`.
>    Read their meta blocks, their section kinds and their `sales` notes before authoring.
> 4. `repository-information/industry-guidance/power-infrastructure-aidc-analysis.md` — read its
>    first fifteen lines specifically. Its `**Provenance:**` line is the convention you will need.
>
> CORRECTING AN ASSUMPTION YOU MAY INHERIT: an earlier session's note said this module "needs a
> source document from the developer." It does not. Only TWO of the seven existing modules have an
> ingested source under `industry-guidance/sources/` — the NVIDIA 800 VDC white paper and the
> EO 14420 order text. The other five are teaching syntheses that declare what they are in a
> `**Provenance:**` line. Step 1 of the Industry Guidance Command (ingest the source) does not apply
> here; skip it and declare provenance honestly instead. This module is neither a document ingest
> nor a pure internal synthesis — it is research-based synthesis over public sources plus
> already-verified internal material, and the Provenance line should say exactly that.
>
> THE TASK, in the order the rules give it:
>
> - **Research the shortage as a supply system, not as a news story.** The four nouns in the row's
>   own title are the spine: grain-oriented electrical steel (who makes it, how much, why the
>   capacity is what it is), bushings (why they are the transformer's most common failure point AND
>   a separate supply bottleneck), test bays (the constraint nobody sees — a transformer that cannot
>   be tested cannot ship), and lead times (with the ranges dated and sourced, never a single
>   remembered number). Add the two that the failure map demands: the queue/slot mechanics that turn
>   a lead time into a schedule risk, and what a buyer can actually do about it.
> - **Write the analysis markdown** at `repository-information/industry-guidance/
>   grid-equipment-shortage-analysis.md` — never deployed, and the source of truth. Follow the shape
>   in step 3 of the rules: what this is → executive read → known-vs-new against the current
>   curriculum → per-topic deep dives with advantages and disadvantages made explicit → what it means
>   for the active engagement → a claims ledger with every quantitative claim carrying its source →
>   what the record does NOT say.
> - **Author the in-app module** as a new `guidanceDocGridEquipment_()` in the PROJECT block of
>   `Profiler.gs`, registered in `guidanceDocs_()` in lane order. Recommended `group`: **"The AI
>   Data-Center Wave"** — it is the supply-side counterpart to `utility-aidc-procurement-2026-08`
>   and belongs next to it. Override that if the content argues otherwise, but say why in the
>   CHANGELOG. Suggested id: `grid-equipment-shortage-2026-09`.
> - **Add the Scraper interest seed** (step 9) to `SCRAPER_INTEREST_TOPIC_SEEDS` in
>   `googleAppsScripts/Scraper/Scraper.gs`: `key: 'topic-grid-equipment-shortage'`,
>   `source: 'guidance:<module-id>'`. Read the EO 14420 seed's comment first — its terms are the
>   order's OWN vocabulary rather than paraphrase, and that is deliberate. Pick discriminating terms
>   the trade press actually uses ("grain-oriented electrical steel", "GOES", "bushing", "test bay",
>   "transformer lead time"), not generic ones like "supply chain".
>
> THE TRAPS THIS TOPIC CARRIES:
>
> - **Content scope (developer directive, 2026-08-29): modules give guidance to supplier and buyer
>   GROUPS, never to a single named company.** This is the trap this module is most likely to fall
>   into, because a shortage story pulls hard toward "buy from X, avoid Y". Statutory facts that
>   name companies are fine as objective information; recommendations are not. Company-specific
>   analysis reaches admins through a report's `guidanceOverlays[]`, not through module content.
> - **Do not invent a number.** Lead times, GOES tonnage and test-bay counts are exactly the figures
>   that drift in trade press and get repeated without a primary source. Every quantitative claim in
>   the module needs a source in the analysis's claims ledger, and anything you could not verify
>   goes in the "what the record does NOT say" section rather than into the module hedged.
> - **`reviewBy` comes from this module's OWN nearest dated gate** (step 10) — a stated capacity
>   expansion coming online, a published lead-time survey's next edition, a dated regulatory action —
>   NOT a fixed six months. Say in the CHANGELOG which gate you picked and why.
> - **Public sources are already in the corpus and should be used rather than re-researched.** The
>   Grid Technologies spine in `siemens-energy.study.json` (transformer lead times as the buyer's
>   problem, the six instruments against a three-year transformer), `powell-industries.profile.json`,
>   and the grid-equipment content in `hitachi-energy`, `ge-vernova`, `abb` and `mitsubishi-electric`.
>   This module is the one place the *supply* side of that material becomes teachable.
> - **New modules need no page changes.** `Profiler.html`'s guidance renderer already handles every
>   section kind, `{{term}}` tooltips, `sales` notes, company chips, search and the unified glossary.
>   Do not bump the page version unless you actually change the renderer.
>
> VERIFY BEFORE COMMITTING (step 7): `node --check` on a `.js` copy of `Profiler.gs`;
> `scripts/check-gas-inner-scripts.js`; and a Playwright render of the module through a direct
> `gdRenderDoc()` invocation with the new JSON, auth bypassed with `bypass_csp` plus the localStorage
> role. The Playwright harness notes in SESSION-CONTEXT.md still apply: threaded HTTP server,
> `executable_path='/opt/pw-browsers/chromium'` (`playwright install` is NOT the fix), and an
> injected style hiding `#ov-authwall`.
>
> THE BOOKKEEPING THIS SESSION OWES, IN THE SAME COMMIT AS THE MODULE:
>
> - **Flip §6's G4 row to `**Closed** v<this repo version>`** with a dated re-check parenthetical in
>   the form the other rows use. The register's own rule is that a row is not closed until someone
>   re-runs its check and dates it there — so actually re-check all three of G4's asks, do not just
>   assert the third one is done.
> - **Update the "Standings — read this before the trail below" block.** It currently names G4 and
>   G6 as the two structural rows and recommends "G4 then G6, and nothing else". The moment this
>   module lands that block is wrong, and it must become "G6, and nothing else". THIS IS THE POINT
>   THE PREVIOUS SESSION SPENT AN ENTIRE COMMIT REPAIRING: two rows (G2 and G5) sat at Partial for
>   four and five repo versions because the work that closed them landed and nobody re-ran the check.
>   Do not recreate that failure on the row you are closing.
> - **Append a dated "Targeted re-run of G4" paragraph** below the standings, in the form the v04.51r
>   and v04.52r paragraphs use. Do NOT rewrite any existing paragraph — that trail is append-only,
>   and each entry is true as of its own date.
> - Versioning: content lives in `Profiler.gs`, so bump the **Profiler GAS** version
>   ([PC-GS-VERSION] #1) and, because of the seed, the **Scraper GAS** version too. Public GAS
>   changelog entries stay generic per changelog-security — do not name the topic publicly. README
>   tree entry for the new analysis markdown. Normal Pre-Commit and Pre-Push checklists; bump the
>   repo version on the push commit; one push commit; push on a `claude/*` branch.
>
> AT THE END, TELL ME PLAINLY: whether G4 closes on the re-check of all three of its asks, and what
> the register's commissioning backlog is once it does.

### Added

- **`repository-information/industry-guidance/grid-equipment-shortage-analysis.md`** — the analysis file and source of truth for the new guidance module (never deployed). Its `**Provenance:**` line states exactly what it is: **research-based synthesis over public sources plus already-verified internal material — neither a document ingest nor a pure internal synthesis.** Primary public sources are DOE's July 2024 *Large Power Transformer Resilience: Report to Congress*, EPRI's August 2023 *Transformer Bushing Failure Investigation* white paper, IEC 60076-2:2011 and IEC 60076-3:2013, the Cleveland-Cliffs / DOE OCED Butler Works project disclosures and Siemens Energy's own US manufacturing disclosures; dated analyst and trade reporting comes from Wood Mackenzie (relayed by POWER Magazine, with the relay stated), PTR Inc. and Fastmarkets; internal material is the Grid Technologies spine in `siemens-energy.study.json` plus the `hitachi-energy`, `ge-vernova`, `mitsubishi-electric` and `powell-industries` guides. **Nothing was added under `industry-guidance/sources/`** — step 1 of the Industry Guidance Command does not apply, and the assumption that it did is corrected in §6's trail. Twelve sections: what this is → executive read → known-vs-new against the current curriculum → per-topic deep dives (GOES, bushings, test bays, lead times) each with advantages and disadvantages made explicit → slot mechanics → buyer instruments → what it means for the active engagement → a claims ledger of ~60 sourced quantitative claims grouped by topic → a nine-item *what the record does NOT say* → the freshness-gate rationale.
- **`guidanceDocGridEquipment_()` in `googleAppsScripts/Profiler/Profiler.gs`** — module `grid-equipment-shortage-2026-09`, *The Grid-Equipment Shortage: GOES, Bushings, Test Bays, Lead Times*, registered in `guidanceDocs_()` immediately after `guidanceDocUtilityAidc_()`. **Sixteen sections**: the four constraints in causal order (`prose`); GOES as the material that will not answer a price signal (`prose`); bushings as the failure point that is also a queue (`prose`); test bays as the gate at the exit (`prose`); the dated lead-time series (`table`, 10 rows); slot mechanics (`prose`); what the announced capacity actually adds (`bars`, 6 items); the dated gates (`timeline`, 12 items across three lanes); each constraint with what helps and what does not (`table`); the buyer's instruments honestly priced (`callout`); the sparing-and-sharing layer (`table`); what it means by group (`proscons`, 5 cards); what the record does NOT say (`callout`, 8 items); 12 flashcards; a 6-question self-test; and a 37-row claims ledger. Fourteen `{{term}}` glossary entries (GOES, PDR, NOES, CTC, LPT, GSU, bushing, test tap, OLTC, test bay, impulse test, heat run, build slot, Schnabel car), all used and all resolving. Four `sales` notes.
- **`topic-grid-equipment-shortage` in `SCRAPER_INTEREST_TOPIC_SEEDS`** (`googleAppsScripts/Scraper/Scraper.gs`) — step 9 of the guidance rules, `source: 'guidance:grid-equipment-shortage-2026-09'`. Terms are the trade's own supply-side nouns: `grain-oriented electrical steel`, `GOES`, `bushing`, `test bay`, `transformer lead time`, `on-load tap changer`, `large power transformer`. Its comment records why `supply chain` and `shortage` are deliberately absent (both match everything and pad the topic band, the trap the neighbouring `supply chain`/`warranty` comments already record) and why the acronym is kept alongside the spelled-out form (steel and utility trades use `GOES` in headlines where the full phrase never appears). Deliberately discriminated against the existing `topic-grid-infrastructure` seed, which already carries `transformer shortage` from the demand side.

### Changed

- **`repository-information/CLASSROOM-CURRICULUM-PLAN.md` §6 — G4 flipped to `**Closed** v04.55r`, and all three of its asks were re-checked against the corpus rather than asserted.** Ask 1: `siemens-energy.study.json` holds 9 Grid Technologies sections inside an 18-section guide (landed v04.51r, re-confirmed). Ask 2: `powell-industries.profile.json` at profileVersion 2 under `supplier`, with `powell-industries.study.json` beside it (landed v04.48r, re-confirmed). Ask 3: `guidanceDocs_()` returns **eight** modules where it returned seven.
- **The Standings block was rewritten in the same commit**, which is the point of the exercise. It named G4 and G6 as the two structural rows and recommended "G4 then G6, and nothing else"; it now reads **seven closed** (G1, G2, G3, G4, G5, G8, G9), one Partial (G7), two Open (G6, G10), two standing judgments (G11, G12), and **"G6, and nothing else."** It also records that G6 is the *harder* of the two structural rows — G4 went first because half of it was already done and its public sources were in the corpus, and G6 has neither advantage. This is the failure the v04.54r session spent a whole commit repairing (G2 and G5 sat at Partial for four and five repo versions after the work closing them had landed); not recreating it on the row being closed was an explicit requirement of this session.
- **A fifth dated trail paragraph, "Targeted re-run of G4 (2026-09-04, v04.55r)", was appended** below the standings. No existing paragraph was rewritten — the trail is append-only and each entry is true as of its own date; the intro line was updated from "four paragraphs" to "five" and now states the append-only rule explicitly. The paragraph records two corrections: that the v04.51r entry's implication of a needed source document was wrong (only two of the eight modules have an ingested source; the other six declare provenance in a line), and that the v04.52r entry's scheduled-versus-structural distinction was right and is why this session existed.
- **No `PROFILER-COVERAGE-PLAN.md` §8 row was added, and none should be.** The commissioning prompt said so and the register agrees: adding one would convert the last remaining structural ask into a scheduled one on paper without making it so in fact. §2's model rule is untouched for the same reason — it assigns models for Profiler sessions and this was not one.
- `Profiler.gs` v01.34g → **v01.35g**; `Scraper.gs` v01.99g → **v02.00g**; both `gs-versions` files synced. **`Profiler.html` was NOT bumped** — the guidance renderer already handles every section kind, `{{term}}` tooltips, `sales` notes, company chips, search and the unified glossary, so a new module needs no page change, and the render test confirmed it.
- README tree gains the new analysis markdown under `industry-guidance/`.

### Notes

- **The `group` choice, as the prompt asked to have justified.** **"The AI Data-Center Wave"**, as recommended, and the content argued for it rather than against: the module's purpose in the curriculum is to be the *supply* side of the story `utility-aidc-procurement-2026-08` tells from the demand side, its buyer countermeasures are AIDC procurement moves, and the lane grouping is what physically places it beside its counterpart in the library view. The alternative — "Technology Foundations", on the grounds that GOES metallurgy and factory testing would be true without AI — was rejected because the module is framed throughout around why the equipment a project needs is late, which is an AIDC-wave concern.
- **The `reviewBy` gate, and why.** **`2027-03-31`** — the module's own nearest dated gate is Siemens Energy's Charlotte plant beginning large power transformer production, reported as "by early 2027". It is the first of the ~$1.8bn of announced North American capacity additions scheduled to actually produce a unit, and it carries the module's central arithmetic: 24 units initially rising to 57/year at full capacity, against ~900 units/year of expected US demand — about 6%. Whether it starts on time and at what rate is the first real evidence of whether the announced fix behaves as announced. Rejected alternatives, recorded in the analysis: Hitachi Energy's South Boston plant (2028) and Eaton's South Carolina facility (2027, no month) are later or less precisely dated; the Butler Works GOES project (2029) is furthest out and its date is disputed across sources; Wood Mackenzie's lead-time survey is a continuous quarterly series rather than a gate. A fixed six months would have been a cadence, which step 10 forbids.
- **Content scope held.** The module gives guidance to **groups** only — transformer and switchgear OEMs, data-center developers and large-load buyers, utilities and transmission owners, BESS/inverter/on-site power suppliers, and component suppliers. Companies appear only where the record names them (who announced which plant, at what value, for what output), and the module says so in its own text and in its revision note. There is no recommendation anywhere to buy from or avoid any company — which was the trap flagged as most likely for a shortage topic. The five auto-rendered company chips are Siemens Energy, Hitachi Energy and Eaton, all inside capacity-announcement facts.
- **"Do not invent a number" — what that cost.** Nine items went into *what the record does NOT say* instead of into the module: there is **no public register of high-voltage test-bay capacity, utilisation or queue time** anywhere, and no expansion announcement discloses bays added, so the bay is taught as a mechanism sourced to the standards (the lightning impulse test is a **routine** test above 72.5 kV under IEC 60076-3, so every large unit passes through one; the heat run is a **type** test under IEC 60076-2) with no number attached to the queue; the widely-circulated "bushings run up to 130 weeks" figure appears only on vendor pages with no attribution and is omitted; the "single US on-load tap changer producer" claim could not be verified and is omitted; the bushing failure share is stated as a band (~18%, ~17–20% globally, 30% for GSUs) because published figures span 15–50% depending on population; no current national GOES tonnage could be verified, so DOE's *share of demand met* framing (12–20%) is used instead; the Wood Mackenzie 2025 figures are flagged as relayed through a trade journal rather than read directly; the Butler Works completion date is inconsistent across sources and the primary page's 2029 is used; no source quantifies the winder/tester labour gap; and no crossover year is forecast.
- **A corroboration worth recording.** DOE's account of the private spares programme reports that **impedance** is among the hardest parameters to standardise "because of their impacts on the rest of the system (e.g., downstream system protection)" — independently reaching the same conclusion `mitsubishi-electric.study.json` teaches from the buyer's side, that a transformer substitution is never only a transformer substitution. Two unrelated sources, one conclusion.
- **Verification (step 7).** `node --check` on `.js` copies of both `Profiler.gs` and `Scraper.gs` — clean. `scripts/check-gas-inner-scripts.js` — 9 files, 86 inner `<script>` blocks, all parse. JSON validation of the module object plus a tooltip audit: 14 glossary terms, 14 markers used, **0 unresolved and 0 unused**. Playwright render through a direct `gdRenderDoc()` invocation with the JSON extracted from `Profiler.gs` itself (threaded HTTP server, `bypass_csp`, `localStorage ov_note_role='admin'`, injected style hiding `#ov-authwall`, `executable_path` into `/opt/pw-browsers`): **46 785 characters of rendered text, 4 tables / 59 rows, 12 timeline dots in the three CVD-validated hues (gold #b18f35, rose #cc5f75, blue #4f83e6), 6 bars, 24 tooltips, 5 pros/cons cards, 12 flashcards, 5 company chips, 4 "Sales angle" notes, the review-by chip rendering, 0 unresolved `{{term}}` markers and zero page errors.** Standard harness: Profiler **PASS**.
- **One pre-existing failure, not caused by this change.** `scripts/playwright-harness.py Scraper` reports a CSP image-load refusal for a `lightaisolutions.github.io` logo URL when the page is served from `127.0.0.1` rather than the Pages origin. `Scraper.html` was not touched in this commit — only `Scraper.gs`, which the harness never loads — so the result is independent of this change and environmental to serving the page off-origin.

## [v04.54r] — 2026-09-04 03:07:23 PM EST

> continue with your recommendation

### Changed

- **`CLASSROOM-CURRICULUM-PLAN.md` §6 — the full re-run the register said was owed at the close of Phase B, run one phase late.** The task began as "rewrite the stale commission-first paragraph", but writing an honest standings note meant re-checking every row against the corpus first, and that check found the paragraph was not the only stale thing in §6: **two rows had been sitting at Partial after the work that closes them had already landed.**
  - **G2 (backup-generation OEM) — `Partial v04.41r` → `Closed` v04.53r.** The row asks for dossiers and study guides for **two of** Caterpillar, Cummins, Kohler and Rolls-Royce Power Systems; the corpus holds **all four** — `caterpillar` (16-section guide), `cummins` (14), `rolls-royce-power-systems` (13) and `rehlko` (13), Rehlko being the Kohler Energy business carved out to Platinum Equity in 2024 and renamed, so the row's fourth name is covered under its current one. It stayed Partial because its v04.44r text named session C1 as what would close it and nobody re-ran the check after C1 landed.
  - **G5 (utility dossiers) — `Partial v04.43r` → `Closed` v04.53r.** The row asks for **four** utility dossiers with study guides; the corpus holds **six** under the `utility` category — `dominion-energy`, `xcel-energy`, `southern-company`, `entergy`, `oncor` and `aep`. Same cause: the v04.44r text named B1–B2 as the closers and the check was never re-run. `how-a-utility-buys` can now be authored as a **public** lesson against six sources rather than one.
  - **G4, G6 and G10 re-checked and dated `v04.53r` as unchanged.** `guidanceDocs_()` still returns the same seven modules, so G4's grid-equipment-shortage module and G6's interconnection module are both still absent; `dnv` and `sargent-lundy` are both still absent from the 109-company registry.
- **A "Standings — read this before the trail below" block inserted directly under the register table**, ahead of the four dated re-check paragraphs. It gives the current counts (six closed, two Partial, two Open, two standing judgments) and then sorts what is left by **whether anything is scheduled to do it**: G7 and G10 are *scheduled* (both are coverage-plan §8 row B10), while **G4 and G6 are *structural*** — `PROFILER-COVERAGE-PLAN.md` §8 carries no guidance-module row at all, so no Profiler session will ever move them. The commission-first recommendation is restated accordingly: **G4 then G6, and nothing else.**
- **The four historical paragraphs were left exactly as written** and are now labelled as the dated re-check trail that produced the standings. The recommendation this session acted on was to *rewrite* the v04.39r commission-first paragraph; it is instead superseded in place by a paragraph above it, because that paragraph is a dated historical record in an append-only trail and rewriting it would have made the file lie about its own history. The problem was ordering, not content.
- **Six curly apostrophes normalised to straight** in the G7, G8 and targeted-re-run text written earlier today — the file runs 84 straight to zero curly otherwise.

### Verified

- All twelve rows re-parse at **8 cells each** after the edit, so the table is structurally intact, and zero curly apostrophes remain in the file.
- Every status claim was taken from the filesystem, not from the rows: `caterpillar`, `cummins`, `rehlko`, `rolls-royce-power-systems` all carry dossier **and** guide; the six `utility` dossiers all carry guides; `powell-industries` exists (an earlier probe on the slug `powell` returned a false negative and was corrected); `kohler`, `georgia-power`, `dnv`, `sargent-lundy` and `mgx` are absent; and `guidanceDocs_()` returns exactly seven modules — BessTech, PowerInfra, Nvidia800, UtilityAidc, ChinaPolicy, Bankability, Eo14420.
- Rehlko's identity as the carved-out Kohler Energy business was read out of `rehlko.profile.json` rather than assumed, since G2 closing turns on it.

### Worth noting

- **G10 was deliberately not closed on a judgment call.** `black-veatch` is covered but as an EPC, and the row names it among the independent engineers. Whether an EPC dossier can stand in for the IE seat is the developer's call, not a re-check's — the row says so and stays Open.

## [v04.53r] — 2026-09-04 01:30:23 PM EST

> continue with your recommendation.

### Changed

- **`CLASSROOM-CURRICULUM-PLAN.md` §6 gap register — G8 closed, G7 moved to Partial.** Both rows were re-checked against the corpus rather than against memory, per the register's own rule that *a row is not closed until someone re-runs its check and dates it here*. Both carry `v04.52r` — the version of the corpus that was checked, not the version that records the check.
  - **G8 (Nuclear and SMRs) — `Open` → `Closed` v04.52r.** The row asked for a dossier for one SMR vendor **and** a study guide on what is actually new about SMRs; `oklo.profile.json` and the nineteen-section `oklo.study.json` landed together at v04.52r and satisfy both. The re-check text records what the dossier keeps apart (first-ever revenue of $1.210M in Q2 2026 from engineering, consulting and fabrication — no power and no isotopes; the 2020 combined licence application denied without prejudice in January 2022 and the first Aurora proceeding under a DOE authorization pathway rather than an NRC licence) and what the guide teaches as engineering rather than as a company story. `clean-firm-power` in `aidc-campus` can now pin `study:oklo`.
  - **G7 (Cooling equipment vendors) — `Open` → `Partial` v04.52r, at one of two.** Trane Technologies is the chiller OEM half; `the-cooling-plant-and-water` can now pin `study:trane-technologies` for the equipment side. **The CDU-specialist ask is explicitly not treated as satisfied** — Trane sells CDUs (GigaModular, CDU-1MW) and has owned LiquidStack since March 2026, so the technology is no longer absent from the corpus, but the row asks for a *specialist* dossier and a chiller OEM with a liquid-cooling line is a different subject. CoolIT, Motivair and Boyd remain absent from the registry.
- **A "Targeted re-run of G7 and G8 (2026-09-04, v04.52r)" paragraph** appended to §6's trailing notes, in the form the v04.51r targeted re-run established. It draws the distinction that matters now that G4 and G7 both read as "one ask left": **G7's remainder is scheduled** (CoolIT is §8 row B10 with a model assigned), **G4's is structural** (its guidance module appears nowhere in the coverage ledger). It also records that `mccarthy` moved no row and was not expected to — §6 carries no general-contractor gap — and that G2, G5, G6, G10, G11, G12 and G4 keep their prior dates, the full re-run still being owed at the close of Phase B.

### Verified

- All twelve register rows re-parsed after the edit: **8 cells per row on all twelve**, so the table is structurally intact; statuses read G1 Closed · G2 Partial · G3 Closed · G4 Partial · G5 Partial · G6 Open · **G7 Partial v04.52r** · **G8 Closed v04.52r** · G9 Closed · G10 Open · G11 Deferred · G12 By design.
- Every factual claim added to the two rows was checked against a file rather than recalled: the six C11 data files exist; `trane-technologies` and `oklo` are registered under `supplier` and `mccarthy` under `gc`; **`coolit`, `motivair`, `boyd`, `carrier`, `johnson-controls`, `nuscale`, `x-energy` and `kairos` are all absent from the 109-company registry**; CoolIT is `PROFILER-COVERAGE-PLAN.md` §8 row B10 assigned to Fable 5.1 High against G7; and the guide section content quoted in each re-check (the compressor table, IPLV, the refrigerant calendar, low delta-T syndrome, HALEU, the temperature coefficient, both `where-it-fails` sections) was read back out of the two `.study.json` files.

### Worth noting

- **One ledger consequence is recorded but not acted on.** `PROFILER-COVERAGE-PLAN.md` §8 row B10 lists `x-energy` with G8 as its motivating gap. G8 is now closed by Oklo, so that entry is no longer gap-driven — its motivation is ecosystem coverage. The register says so; **the coverage plan was deliberately left unedited**, because whether to keep, re-motivate or drop a scheduled session is the developer's scheduling call, not a bookkeeping correction.

## [v04.52r] — 2026-09-04 06:32:28 AM EST

> Run Phase C11 of repository-information/PROFILER-COVERAGE-PLAN.md on Opus 5 xhigh as a fresh session: Oklo (`oklo`, supplier), Trane Technologies (`trane-technologies`, supplier) and McCarthy Building Companies (`mccarthy`, gc). The §8 guide-revision session landed as v04.51r and is on main. §2 assigns Phase C to Opus 5 xhigh natively, so there is NO model substitution to record. READ FIRST, before writing anything: 1. repository-information/SESSION-CONTEXT.md — the v04.51r entry, and its environment notes in particular. The Playwright harness needs ALL of: a threaded HTTP server (socketserver.ThreadingMixIn + http.server.HTTPServer, daemon_threads, BrokenPipeError/ConnectionResetError swallowed in handle_one_request, no-op handle_error, flushing print shim) or page.reload() deadlocks; an add_init_script setting localStorage 'ov_note_role' to 'admin' (the Relationships tab and the Study-guide button are gated by OV_ROLE_CAPS and a signed-out session is `viewer`); an injected style hiding #ov-authwall (it intercepts every pointer event); accounts.google.com fulfilled with an empty script. TWO CORRECTIONS FOUND AT v04.51r: the Profiler route is `#<slug>`, NOT `#/company/<slug>` — the wrong form times out waiting for #ov-study-btn; and the image's Playwright browser build (1194) is older than the pip package expects (1234), so launch with executable_path='/opt/pw-browsers/chromium' — `playwright install` is NOT the fix. Tabs carry id="ov-tab-<key>", not data-tab. Assert .ov-rel-src against the count of relationships that CARRY a source field, not len(relationships[]) — 77 of the corpus's 662 curated links have none. Use ensure_ascii=False when comparing markers to rendered text. Console 404s map exactly to companies with no study guide and are NOT a defect — control-test an untouched slug first to set the baseline. 2. PROFILER-COVERAGE-PLAN.md §2, §5, §7 and the three C11 rows in §8. 3. .claude/rules/profiler-app.md (Profiler Command, Profiler Prep Command, Scheduled Refreshes), PROFILER-SCHEMA.md (schema v7 profiles, study schema v2, concepts registry) and PROFILER-STYLES.md (active style: intel-briefing). 4. CLASSROOM-CURRICULUM-PLAN.md §5 (the failure map — every guide owes a `where-it-fails` section drawn from it) and §6 rows G7 and G8. G8 wants an SMR-vendor dossier AND a study guide on what is actually new about SMRs — Oklo closes it if the guide does that job. G7 wants a chiller OEM AND a CDU specialist; Trane is the chiller half, CoolIT is Fable session B10, so G7 CANNOT close this session — say so at the end rather than claiming it. 5. The EXISTING guides these must not duplicate. Read their section titles first. For `oklo`: constellation-energy (the operating nuclear fleet and the PPA), dominion-energy (the SMR as a regulated buyer's programme item), ge-vernova / siemens-energy / mitsubishi-power (turbines), and caterpillar / cummins / rehlko / rolls-royce-power-systems (the gen-set answer to the same question). For `trane-technologies`: vertiv (the deepest thermal-chain treatment in the app — CRAC/CRAH/chiller, the CDU, the temperature budget, warm water) and schneider-electric (Motivair). For `mccarthy`: hitt, holder-construction, mortenson, rosendin, turner-construction, dpr, kiewit, primoris and quanta-services. TEACH AGAINST WHAT IS THERE, NOT OVER IT — each guide opens with an explicit list of what it deliberately does not repeat, as the C1/C2/C3 and v04.51r guides do. THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7, profileVersion 1, categories per the §8 row) and study guide (schema v2, with a `where-it-fails` section, {{term}} tooltips, NEW SHARED CONCEPTS in profiler-concepts.json rather than local glossaries, and flashcards and quiz on how the technology works rather than company trivia). Then the registry sync, the graph build, the study validator, a calendar row each, README tree entries, lesson plans under repository-information/study-prep/<slug>/, and flip the three §8 rows with the repo version. One push commit. ENTITY AND SCOPE DISCIPLINE — the three traps this group carries: Oklo is pre-revenue. No Aurora reactor is operating. Keep announcements, LOIs, NRC application milestones and site selections strictly apart from anything delivered, and label each as what it is. The financial record should say plainly that there is no product revenue rather than dress a pipeline as one. The guide's job is "what is actually new about an SMR" as ENGINEERING — factory fabrication versus site construction, the fuel (HALEU) and where it comes from, the licensing path and why it is the schedule, load-following, and the build-own-operate model — not a company story. Trane Technologies is not just Trane. Separate the listed company from the Trane brand and from Thermo King, and separate the data-centre chiller and thermal-management line from commercial HVAC, which is most of the revenue. Do not derive a data-centre figure that is not disclosed. McCarthy is private and employee-owned. There is no filing record. Expect to state a collection gap on revenue and mix rather than reconstruct it from trade press. RELATIONSHIPS: resolve only to covered slugs, with a source that explicitly states the link — a co-membership roster states each party's relationship to the roster's owner, not to each other. Backfill existing dossiers in the same commit where a new slug makes a link curatable, archiving prior versions per the Archival Procedure. Record deliberate non-curations in the dossier text. SERIALIZATION TRAP: *.profile.json and *.study.json are indent=1 with NO trailing newline; archive-index.json is indent=1 WITH one; profiler-concepts.json and profiler-companies.json are indent=2 with one. Verify against the live files before any scripted write. MARKER TRAP (new at v04.51r): a {{term}} must carry the concept's TERM, not its slug — {{mobile-substation}} does not resolve where the registry holds `mobile substation`. It is silent while authoring and produced 48 errors in one session. check-profiler-study.py catches every one. VERIFY BEFORE COMMITTING: sync-profiler-registry.py --check clean, check-profiler-study.py clean, build-profiler-graph.py run, and all three dossiers AND all three guides rendering in Profiler.html via Playwright with zero page errors, zero console errors, every relationships[] slug resolving and every {{term}} resolving. Normal Pre-Commit and Pre-Push checklists; bump the repo version on the push commit; push on a claude/* branch. AT THE END, TELL ME PLAINLY whether G8 closes on a re-check, and confirm that G7 still needs CoolIT from Fable session B10.

### Added

- **`oklo.profile.json`** (schema v7, profileVersion 1) — 98 sources at 58% first-party, 4 product lines, 3 spec groups, 33 developments, 8 relationships, 7 policy regimes, 13 decision makers, 4 financial periods. **Four premise corrections the research forced, all recorded in the file rather than smoothed over**: Oklo is no longer strictly pre-revenue (its first-ever revenue, $1.210M, landed in Q2 2026 and is engineering, consulting and fabrication services from two 2026 acquisitions — not power and not isotopes); an Oklo-built reactor *is* operating (the Groves isotope test reactor reached first criticality on 2026-08-05, a light-water pool-type machine that is **not** an Aurora and not a power reactor); Prometheus Hyperscale and Wyoming Hyperscale are one counterparty, not two; and **the first Aurora is proceeding under a DOE authorization pathway, not an NRC licence** — the 2020 combined licence application was denied without prejudice in 2022 and no updated application had been submitted as of the Q2 2026 filing, while the company's own website still describes the 2020 application in the present tense. Also carried: the live PJM interconnection withdrawal and FERC emergency complaint on the Meta-backed Ohio campus, and the 2023-vintage FOAK/NOAK unit economics reproduced with their age and non-reaffirmation stated.
- **`oklo.study.json`** (schema v2, 19 sections) — the **G8 closer**, and the deepest technology treatment of advanced fission in the corpus. It opens by naming what it does not repeat from Constellation, Dominion, Kiewit and the three turbine OEMs, then teaches the reactor as engineering: {{delayed neutrons}} as the reason a chain reaction is controllable at all; {{decay heat}} as the problem every accident reduces to; **the {{moderator}} as the fork in the road**, with an eight-row table showing how removing it forces the enrichment, the coolant, the core size and the industrial base; why a coolant boiling near 880 °C removes the pressure vessel and the large-break accident with it; passive safety as the *sign of a coefficient* rather than a system, with the EBR-II 1986 tests given their proper weight and their proper limits; {{HALEU}} as the binding constraint; **two regulators running two clocks**, with the six regulatory nouns that are not synonyms; {{xenon poisoning}} as the physical reason a thermal reactor follows load badly and why a fast spectrum is largely free of it; and the build-own-operate model with a six-step ladder for reading announcements. A `where-it-fails` section draws on §5 rows 1, 4 and 12.
- **`trane-technologies.profile.json`** (schema v7, profileVersion 1) — 77 sources at 51% first-party, 6 product lines, 3 spec groups, 24 developments, 4 relationships, 8 policy regimes, 14 decision makers with 13 headshots, 4 financial periods. Entity discipline held throughout: the listed plc, the Trane brand, American Standard Heating & Air Conditioning (unrelated to the LIXIL-owned plumbing business) and Thermo King are separated in every section, and **no data-centre revenue figure is derived** — the file states plainly that "data center" appears four times in the FY2025 10-K, all inside an alphabetical product list. Records the **GAAP-above-adjusted EPS inversion** in FY2025 and Q1 2026 and the outlets that headlined a GAAP figure against an adjusted consensus.
- **`trane-technologies.study.json`** (schema v2, 17 sections) — the **chiller half of G7**, teaching the machine Vertiv's guide gives one sentence to. Temperature lift as the only number that costs money; the compressor type as the choice everything else follows from; why IPLV weights the rated point at about one percent of the hours; the refrigerant as a regulated component whose A2L class is a *building* change; air against water and the five numbers that read a cooling tower; low delta-T syndrome and the decoupler as the plant's most useful diagnostic; the chiller-restart gap the UPS does not cover; and a two-businesses table that makes the entity discipline a reading skill.
- **`mccarthy.profile.json`** (schema v7, profileVersion 1) — 99 sources at 57% first-party, 5 product lines, 2 spec groups, 23 developments, 10 relationships, 7 policy regimes, 8 decision makers with 7 headshots, 3 financial periods. **The collection gap is the file's spine**: McCarthy has published exactly one total revenue figure in its history (2020, "exceeding $4.8 billion"), so the financials section reports the gap and labels every third-party number as a self-reported survey response. The most informative independent series is the ENR Top 400 rank — 19, 20, 20, **22** — falling two places in the edition where the data-centre category grew 86.4%. Three false attributions encountered in research are recorded so they cannot propagate.
- **`mccarthy.study.json`** (schema v2, 17 sections) — written **against** nine existing contractor guides rather than over them, teaching the ground and the concrete: the geotechnical investigation as a sampling programme, the foundation as a division problem, concrete as a chemical reaction on a clock, the data-hall floor as eight separate specifications, three genuinely different ways to close a shell, the ICRA pressure discipline healthcare invented, the water-reuse plant a campus commits to building, the delivery-method risk ladder, and the statutory gates that can leave a fully commissioned building illegal to occupy.
- **Lesson plans** under `repository-information/study-prep/oklo/`, `.../trane-technologies/` and `.../mccarthy/` — three new folders. Each names what it deliberately does not repeat from the adjacent plans.
- **145 shared concepts** in `profiler-concepts.json` (465 → **610**) — 39 nuclear, 51 thermal and chiller, 51 construction, plus MEP, VDC, CRAC and CRAH added on validator feedback. **Three candidates were dropped as alias collisions rather than added** (`COP` already resolves to *continuous rating* in this corpus, `magnetic bearing` is already registered from the flywheel guides, `turndown` already resolves through *part load*), and **four more were removed after authoring because no guide ended up using them** — the registry is a vocabulary in use, not an encyclopedia.
- **20 executive headshots** (328 → **348** images across 65 companies), all company-published and verified as 20 distinct files.
- **Three refresh-calendar rows** (67 → 70). Both public rows carry `confirmed: false` with the reasoning: Oklo's date is cadence-inferred from prints on a Friday and a Wednesday with no consistent weekday, and Trane's tracker date of 2026-11-04 is recorded together with the **discrepancy** that the company's last four prints were all Thursdays.

### Changed

- **Eighteen dossiers backfilled** with archival and `profileVersion` +1 as the three new slugs made links curatable: `equinix`, `kiewit`, `meta`, `switch`, `vertiv`, `nvidia`, `abb` and `siemens-energy` for Oklo; `eaton`, `nvidia`, `vertiv` and `schneider-electric` for Trane; and `vantage`, `turner-construction`, `hitt`, `mortenson`, `black-veatch` and `lightsource-bp` for McCarthy. NVIDIA and Vertiv were each backfilled twice and went up two versions.
- **Deliberate non-curations, recorded rather than left silent**: McCarthy↔Meta was declined because the only link is two steps removed (a Silicon Ranch solar project supplying a utility that supplies a Meta data centre); no Trane relationship was curated to any hyperscaler, colocation operator or contractor because no source states one, which is itself the most conspicuous gap in that file; and the `oracle` and `openai` links on McCarthy are curated as `other` with the indirection stated — the contract is with Vantage.
- **`profiler-graph.json`** rebuilt: 678 → **706 edges** (534 curated), 2,081 evidence items.
- **`profiler-companies.json`** 106 → **109 companies**, synced.
- **§8 of `PROFILER-COVERAGE-PLAN.md`** — the three C11 rows flipped to `v1 · v04.52r` / `✓ · v04.52r`.

### Verified

- `sync-profiler-registry.py --check`: **0 of 109 out of sync**. `check-profiler-study.py`: **0 errors, 0 warnings, 83 guides / 610 concepts**. `build-profiler-graph.py` run.
- **Playwright across all three new companies plus an untouched control slug (`rehlko`)**: zero page errors throughout; all nine tabs render; every `relationships[]` slug resolves (8/8, 4/4 and 10/10 sourced links rendered); every source renders (98, 77, 99); all 19, 17 and 17 guide sections render with **zero literal `{{markers}}`** and **zero unresolved `{{term}}` tooltips** against `gdGlossMap`.
- **Three `ERR_CONNECTION_RESET` console errors were investigated rather than accepted**: a targeted re-run confirmed all 20 executive images return HTTP 200, decode with non-zero natural width, and record no request failures — the resets were a transient artefact of the local threaded test server under a burst of parallel image requests, not a data defect.

## [v04.51r] — 2026-09-04 04:21:10 AM EST

> Run the three §8 guide revisions of repository-information/PROFILER-COVERAGE-PLAN.md on Opus 5 xhigh as a fresh session — vertiv, schneider-electric and siemens-energy — plus the `narada` backfill. Phase C3 is on main (v04.50r). This is a GUIDE session, not a dossier session: no new dossiers, no new companies. §2 assigns all study-guide work on existing dossiers to Opus 5 xhigh natively, so there is NO model substitution to record. READ FIRST, before writing anything: SESSION-CONTEXT.md — the C3 entry, environment notes in particular (the Playwright harness needs an add_init_script setting localStorage 'ov_note_role' to 'admin' and an injected style hiding #ov-authwall; tabs carry id="ov-tab-<key>"; the HTTP server must be threaded; assert .ov-rel-src against the count of relationships that CARRY a source field; use ensure_ascii=False; fulfill accounts.google.com with an empty script; console 404s map to companies with no study guide and are NOT a defect — control-test an untouched slug first); PROFILER-COVERAGE-PLAN §2, §5, §7 and the four §8 rows; .claude/rules/profiler-app.md (Profiler Prep Command in particular — prep OVERWRITES in place, git history keeps the prior guide, and there is no archival step for study files); PROFILER-SCHEMA.md (study schema v2, concepts registry) and PROFILER-STYLES.md (active style: intel-briefing); CLASSROOM-CURRICULUM-PLAN.md §6 rows G3, G4 and G9 — this session is their closer, so each guide must carry what its row actually asks for, not merely a section with the right title; and the EXISTING guides these must not duplicate — for the UPS work, rehlko, piller, mitsubishi-electric and eaton; for siemens-energy, hitachi-energy, ge-vernova, abb and powell-industries; for narada, samsung-sdi, vicor, hithium and catl. TEACH AGAINST WHAT IS THERE, NOT OVER IT — each revised guide opens with an explicit list of what it deliberately does not repeat, as the C1/C2/C3 guides do. THE TASK — `profiler prep <Company>` four times, one push commit: `vertiv` — the guide is cooling-only today; it must gain a UPS section. G3 asks for UPS AS A PRODUCT from the vendor's side, so teach what Rehlko's does not: the large modular/scalable UPS, what a UPS module actually is as a purchasable unit, and how a UPS is specified and bought. `schneider-electric` — no UPS content today; same requirement, different angle so the two revisions do not duplicate each other. Decide the split explicitly and say so in both guides. `siemens-energy` — the guide covers turnarounds and hydrogen; it must gain a GRID TECHNOLOGIES section (transmission, HVDC, grid stability, the equipment that connects generation to load), not more turbine material. `narada` — a NEW guide (the dossier exists, the guide does not). This is the battery side of the DC bus that G9 asks for: lead-carbon and lithium backup as a product line, the UPS battery and the BBU cell, what a backup battery is specified on. Vicor's guide already teaches the BBU shelf from the CONVERTER's side — teach it from the CELL's side. All four at schema v2 with a `where-it-fails` section drawn from CLASSROOM-CURRICULUM-PLAN §5, {{term}} tooltips against the 401-entry registry, NEW SHARED CONCEPTS in profiler-concepts.json rather than local glossaries, and flashcards and quiz on how the technology works rather than company trivia. Lesson plans under repository-information/study-prep/<slug>/ for narada (new) and refreshed for the three revisions. BOOKKEEPING, same commit: check-profiler-study.py; README tree entries for narada.study.json and any new study-prep folder; flip the four §8 guide rows with the repo version. No dossier changes means NO registry sync or graph rebuild is needed unless you touch a profile — if you don't, say so rather than running them for form. No calendar rows (no new companies). VERIFY BEFORE COMMITTING: check-profiler-study.py clean, and all four guides rendering in Profiler.html via Playwright with zero page errors, zero console errors, and every {{term}} resolving. Data-only: no page or GAS file changes and no Profiler version bump unless something actually requires one. Normal Pre-Commit and Pre-Push checklists; bump the repo version on the push commit; push on a claude/* branch. AT THE END, TELL ME PLAINLY whether G3 and G9 now close on a re-check and what G4 still needs — I know G4 wants a guidance module on the grid-equipment shortage that is not in §8 anywhere, so confirm whether that is genuinely the only thing left on that row.

### Added

- **`narada.study.json`** (schema v2, 13 sections) — the G9 backfill, and the first guide in the corpus to teach a **backup battery from the cell's side**. It opens by naming what it does not repeat from Hithium, CATL, Samsung SDI, Mitsubishi Electric, Rehlko and Vicor, then teaches: the sprinter against the distance runner and why {{electrode thickness}} produces almost every other difference; the fortyfold {{C-rate}} ladder inside a single catalogue (0.25C container to a 10C rack cabinet); the two cells side by side across eight dimensions; how a standby battery is really specified — watts per cell, for a stated time, to a stated end voltage, at a stated temperature — and why amp-hour sizing comes up short in exactly the event it was bought for; what {{AGM}} construction and {{lead-carbon}} actually changed, and where lead still wins on the merits; the string and its worst cell, with {{conductance testing}} distinguished from a real {{capacity test}}; and the rack cell asked for 200,000 half-second {{pulse cycle}}s, which is a buffer duty rather than a backup one. A `where-it-fails` section draws on §5 rows 6 and 9–11, and the drill and self-test are entirely mechanism questions.
- **Lesson plans** under `repository-information/study-prep/narada/`, `.../vertiv/`, `.../schneider-electric/` and `.../siemens-energy/` — four new folders; none of these four companies had a study-prep plan before. Each header names what the plan deliberately does not repeat from the adjacent plans.
- **63 shared concepts** in `profiler-concepts.json` (401 → **464**) — 21 for the UPS-as-a-product and UPS-as-a-system material, 25 for grid technologies, and 17 for backup-battery specification. **Three candidates were dropped as alias collisions rather than added**: `maintenance bypass` and `wrap-around bypass` already resolve through `static bypass`, `switchyard` through `substation`, and `reactive power` through `power factor`. Two more were added on validator feedback (`sequence of operations`, `DCIM`), which were being used in existing guides without ever having been registered.

### Changed

- **`vertiv.study.json` revised (6 → 18 sections)** — the guide was cooling-only. Ten new sections in front of the six retained cooling sections (unchanged, ids preserved) teach the UPS as **the machine and the transaction**: what a {{power module}} physically is and the three things that have to be engineered into the *slot* for a live exchange; module against frame against unit against system against path, as five different purchases; pay-now-or-pay-later capacity-on-demand, which defers about a third of the cost rather than most of it; the published ratings ladder from a 33 kW rack shelf to a 50 MW prefabricated block; a twelve-row datasheet reading covering the lines nobody reads ({{overload rating}}, short-circuit contribution, {{THDi}}, the battery charge-current limit, {{floor loading}}, {{IEC 62443}}); the eleven-step sequence from {{basis of design}} to the mid-life battery, with submittal approval identified as the schedule killer; and what moving the store into the rack distributes. The twelve legacy top-level flashcards were folded into an inline drill section beside twelve new ones, and a six-item self-test added.
- **`schneider-electric.study.json` revised (6 → 17 sections)** — the guide had no UPS content at all. Nine new sections teach the deliberately non-overlapping half, **the system and the ladder**: the five redundancy arrangements above the machine with their usable-capacity share; the same arithmetic as installed MW per protected MW (N = 1.0 · block-redundant and N+1 at 4+1 = 1.25 · distributed redundant = 1.5 · 2N = 2.0); the maintenance day as the real design case; the distribution between the UPS output and the server's two cords, read as a redundancy problem rather than an electrical one; one UPS idea across four orders of magnitude and why the small end is a channel business and the large end a project business; and what a battery must become — bidirectional front end, revenue-grade metering, an enforced reserve floor — before it is allowed to earn. **The split with the Vertiv revision is stated explicitly in both guides' opening callouts.**
- **`siemens-energy.study.json` revised (6 → 18 sections)** — the guide covered turnarounds and hydrogen with no grid technology. Ten new sections teach Grid Technologies as **the network as a system**, written against Hitachi Energy, GE Vernova, ABB and Powell rather than over them: why the wire rather than the plant is the constraint, the three limits that can bind and the {{N-1}} rule that subtracts one of everything; terminals to {{switchyard}} as a sequence of separately procured objects, read twice — once for a plant and once for a campus; {{air-insulated switchgear}} against GIS against {{SF6-free switchgear}}, and why the replacement is a portfolio rather than a substitution; the four reasons to build a DC link, with the {{cable charging current}} limit as a hard boundary and the DC fault as the same physics as an 800-volt rack; {{inertia}} and {{system strength}} with the {{synchronous condenser}} against the {{STATCOM}}; and the buyer's six instruments against a 36-month transformer, with standardisation identified as the largest lever.
- **§8 of `PROFILER-COVERAGE-PLAN.md`** — all four guide rows flipped to `✓ · v04.51r` with each guide's angle recorded. **No model substitution to record** — §2 assigns all study-guide work on existing dossiers to Opus 5 xhigh natively.
- **§6 of `CLASSROOM-CURRICULUM-PLAN.md`** — G3, G4 and G9 re-checked against the corpus and dated. **G3 closes** (both revisions landed; the dossier half was satisfied twice over by Piller and Mitsubishi Electric). **G9 closes** (the Narada guide is the battery half; Vicor was the silicon half). **G4 moves to two of three and cannot close from Profiler work at all** — see Notes.
- **README tree** — `narada.study.json` and the four new `study-prep/` folders, alphabetically placed.

### Notes

- **G4's last ask is structurally out of reach of this programme.** Its three asks are a Siemens Energy grid revision (done here), a Powell Industries dossier (done at v04.48r), and a guidance module *"The grid-equipment shortage: GOES, bushings, test bays, lead times"*. `guidanceDocs_()` still returns the same seven modules it did at the Phase A close, and **`PROFILER-COVERAGE-PLAN.md` §8 contains no guidance-module row anywhere** — so no scheduled Profiler session can move this row. It needs a guidance session, commissioned the way G6's is. §5 of the coverage plan expects G4 to close at the phase re-run; that expectation is wrong for this reason. The revised guide states the gap in its own text rather than pretending to fill it.
- **Deliberate non-duplication, verified section by section rather than assumed.** The four existing UPS guides were read in full before authoring: Rehlko already owns the four blocks, the four clocks, monolithic-against-modular, the three sizing numbers and the single-source-against-best-of-breed procurement argument; Mitsubishi Electric owns the efficiency curve, the redundancy tax and the VRLA-against-lithium table; Piller owns the {{IEC 62040-3}} grades, rotary and {{DRUPS}} and the {{isolated parallel bus}}; Eaton owns {{selective coordination}} and the outage choreography. The two revisions were then written to interlock with each other rather than merely to avoid the four. The same discipline was applied to the grid guides (Hitachi Energy owns the transformer factory and the converter internals; GE Vernova the OEM model and generator physics; ABB arc interruption; Powell the lineup) and to the battery guides (Vicor owns the BBU shelf from the converter's side, so this teaches the cell inside it).
- **Company-claimed figures are labelled as such** throughout the Narada guide, per the active `intel-briefing` style's fact-and-assessment separation — the 1,900 W/kg, the 200,000 pulse cycles and the footprint reductions all carry their basis. The guide also carries an explicit caution that large-format cells marketed as "solid-state" are frequently {{semi-solid}} hybrid electrolytes, which is what this vendor's own product descriptions state.
- **No registry sync and no graph rebuild were run, deliberately.** Neither is needed: this session touched no `*.profile.json`, so the registry's denormalized coverage fields and the relationship graph are both unchanged. Running them for form would have produced a no-op diff. Likewise **no calendar rows** (no new companies) and **no Profiler page or GAS version bump** — the change is data-only, and the page is an indirect affect.
- **Verification, all green:** study checker `0 errors, 80 guides / 465 concepts` · Playwright across all four guides plus an untouched control slug (`rehlko`, to establish the console baseline first): **zero page errors, zero new console errors, zero literal `{{markers}}` rendered, every `{{term}}` reference resolving in the rendered DOM (145 distinct concepts across the four guides; 204 counted per guide — 64 · 54 · 41 · 45), and every section title present** — 18/18, 17/17, 18/18 and 13/13 sections rendered.
- **Two harness corrections beyond the inherited C3 notes.** The Profiler route is `#<slug>`, **not** `#/company/<slug>` — the C3 notes did not record the hash format and the first run timed out waiting for `#ov-study-btn`. And the image's Playwright browser build (1194) is older than the pip package's expectation (1234), so the browser must be launched with `executable_path='/opt/pw-browsers/chromium'`; `playwright install` is not the fix.
- **An authoring trap worth recording: `{{term}}` markers must carry the concept's *term*, not its slug.** Writing `{{mobile-substation}}` where the registry holds `mobile substation` produced 48 unresolved-marker errors across 25 distinct terms in two guides (10 in the Siemens Energy revision, 15 in the Narada guide). The validator catches every one, and a slug-to-term repair pass fixed them mechanically — but the failure is silent while authoring, because a slug reads like a plausible marker.

## [v04.50r] — 2026-09-04 02:55:32 AM EST

> Picking up from my last session, run Phase C3 of repository-information/PROFILER-COVERAGE-PLAN.md on Opus 5 xhigh as a fresh session: Infineon · Flex, both `supplier`. Phase C1 is on main (v04.47r) and Phase C2 landed as v04.48r plus a v04.49r page fix. This session covers THIS GROUP ONLY — but unlike C1 and C2, this one ALSO owes me the closing Phase-B-vs-Phase-C recommendation at the end. [Full brief: read SESSION-CONTEXT.md's C2 entry and its environment notes; PROFILER-COVERAGE-PLAN §2/§5/§7/§8; profiler-app.md; PROFILER-SCHEMA.md and PROFILER-STYLES.md; CLASSROOM-CURRICULUM-PLAN §6 row G9 and the existing vicor/megmeet/sinexcel/liteon/delta guides. Entity and scope discipline: Infineon's centre of gravity is power semiconductors for AI data centres, not automotive MCUs; Flex must keep what it OWNS separate from what it BUILDS FOR OTHERS in every figure. Guides teach the rack and board power chain and the pieces the library has not covered. Relationships resolve only to covered slugs with a source that explicitly states the link; backfill existing dossiers in the same commit. Serialization trap: profile and study files are indent=1, not indent=2.]

### Added

- **`infineon.profile.json`** (schema v7, profileVersion 1, `supplier`) — 77 sources at 53% first-party, 9 product lines, 6 spec groups, 29 developments, 6 relationships, 5 policy regimes, 10 decision makers (9 headshots), 5 financial periods. The centre of gravity is data-centre power silicon: the grid-to-core portfolio, the published vertical-power-delivery resistance figures (90–140 µΩ lateral against 7–15 µΩ vertical), the PSU and VRM roadmaps with dates, and the CoolSiC JFET hot-swap work with NVIDIA. **Every "expected" value is drawn from the Vara Research consensus Infineon itself commissions**, which prints IFRS and adjusted EPS side by side — the instrument that defuses a live trap: Investing.com recorded a 35.01% EPS miss on the 2025-08-05 print by comparing an IFRS actual (€0.22) against an adjusted consensus (€0.339), while TipRanks recorded a beat on the same print by staying on one basis. The print was a beat on the adjusted basis and roughly in line on the IFRS basis; the 35% miss exists on neither.
- **`flex.profile.json`** (schema v7, profileVersion 1, `supplier`) — 91 sources at 68% first-party, 7 product lines, 6 spec groups, 28 developments, 13 relationships, 6 policy regimes, 16 decision makers (15 headshots), 4 financial periods. **The owned-versus-built-for-others line is held in every figure**, with a labelling key stated in the financial commentary. The governing fact: Flex's board approved separating the entire Cloud and Power Infrastructure segment on 2026-05-05 for Q1 calendar 2027, and agreed a $4.4bn acquisition of EPC Power into that segment on 2026-09-03.
- **`infineon.study.json`** and **`flex.study.json`** (schema v2), each opening with an explicit list of what it does *not* repeat. Infineon teaches **the switch**, not the chain — the blocking-versus-conducting compromise, the two losses and why anyone switches faster, four device technologies as a consequence of three numbers, what 800 V does to device selection and protection, the room-to-chip loss budget, and vertical power delivery from the *packaging and thermal* side (Vicor's guide already owns the geometry argument). Flex teaches **the last hundred metres and the contract** — switchboard to whip, busway against panels as a decision about change, the integrated power train as a procurement trade, the four manufacturing arrangements and the three clauses that decide how hard it is to leave, and reading a third-party power shelf against the vendors already covered. Both carry a `where-it-fails` section drawn from the §5 failure map (rows 9–11 for Infineon, rows 7, 8 and 14 for Flex).
- **Lesson plans** under `repository-information/study-prep/infineon/` and `.../flex/`, each naming in its header what it deliberately does not repeat from the adjacent guides.
- **49 shared concepts** in `profiler-concepts.json` (352 → **401**) — 26 device-physics terms for Infineon and 23 procurement and distribution terms for Flex. Four candidates were **dropped as alias collisions** rather than added: `conduction loss` already resolves through `I²R loss`, `hard switching` through `soft switching`, `junction temperature` through `thermal resistance`, and the `FOM` alias collided with `front-of-meter`.
- **Calendar rows** for both companies. Infineon's `nextReport` is company-published (2026-11-10) but the company marks it preliminary and AlphaQuery says 2026-11-11; the weekday tell is recorded — 2026-11-10 is a Tuesday, the last four prints were all Wednesdays, so MarketBeat's own stated method points at the date it does not print. Flex is `confirmed: false`: it has published nothing, MarketBeat and Investing.com estimate 2026-11-04 and Market Chameleon gives a 2026-10-28 to 2026-11-02 window, and **the two do not overlap**.
- **25 headshots** (304 → **328** images across 60 → **62** companies).

### Changed

- **Thirteen existing dossiers gained a relationship the new slugs made curatable**, each with a source that explicitly states the link, prior versions archived and indexed: `nvidia` v4→v5 (+infineon, +flex), `delta-electronics` v4→v5 (+infineon, +flex), `mitsubishi-electric` v1→v2 (+infineon, +flex), `vicor` v1→v2 (+infineon), `liteon` v4→v5, `megmeet` v5→v6, `vertiv` v5→v6, `eaton` v5→v6, `schneider-electric` v5→v6, `abb` v5→v6, `powell-industries` v1→v2, `amazon` v5→v6 and `google` v4→v5 (each +flex).
- **§8 of `PROFILER-COVERAGE-PLAN.md`** — the two C3 rows flipped to `v1 · v04.50r` / `✓ · v04.50r`; `vicor`, `mitsubishi-electric` and `powell-industries` annotated with their revisions. **No model substitution to record** — Phase C on Opus 5 xhigh is the plan's own assignment.

### Notes

- **Deliberate non-curations, recorded in the dossiers rather than reached for.** NVIDIA's 800 VDC roster co-names Infineon (silicon tier) with ABB, Eaton, GE Vernova, Hitachi Energy, LITEON, Megmeet, Schneider Electric, Vertiv and Flex in *other* tiers. That roster states each party's relationship to NVIDIA, not to Infineon, and both research passes independently found no bilateral source — so **no Infineon↔Flex link is curated at all**, and the only sourced tie between them is an automotive zone-controller kit. The Siemens circuit-breaker partnership is **Siemens AG, not Siemens Energy AG**, so it does not attach to the `siemens-energy` slug.
- **The premise corrections the research produced.** Infineon's Dresden Smart Power Fab **opened 2026-07-02, about three months ahead of schedule** — not under construction; it **divested its Austin, Texas fab** to SkyWater in FY2025, so it holds less US front-end capacity than assumed; and the Marvell transaction was **automotive Ethernet**, not custom HBM. Infineon **re-segmented on 2026-07-01** (four segments to three), so every ATV/GIP/PSS/CSS series terminates at Q3 FY2026. Flex **re-segmented in Q4 FY2026** and then announced it would spin the new segment out; JetCool cost **$53m**, against the $9.5bn Eaton paid for Boyd Thermal and $4.75bn Ecolab agreed for CoolIT in the same quarter.
- **A pre-existing corpus gap found while verifying, reported rather than fixed:** **77 of the corpus's 662 curated relationships carry no `source` field at all**, so their cards render without a source line — `catl` 6 of 7, `arevon`, `black-veatch` and `blattner` 5 of 5, `abb` and `eaton` 4 of 9–11, `delta-electronics` 4 of 9. These predate the source requirement and belong to other sessions' rows. The Playwright harness now asserts against the count of *sourced* links rather than of all links, and prints a note when a file carries unsourced ones.
- **Verification, all green:** registry sync `0 of 106 out of sync` · study checker `0 errors, 79 guides / 401 concepts` · a local schema-v7 validator clean on both new profiles and **0 new errors** on the thirteen backfilled ones when compared against their archived pre-edit copies · graph 643 → **678 edges (512 curated), 2,008 evidence items** · Playwright across all fifteen touched dossiers: zero page errors, zero console errors, every `{{term}}` resolving and every sourced relationship rendering its link.
- **The serialization trap held.** `*.profile.json` and `*.study.json` were written at `indent=1` with no trailing newline, `archive-index.json` at `indent=1` with one, and `profiler-concepts.json` / `profiler-companies.json` at `indent=2` — verified against the live files before writing. The thirteen backfills produced **823 insertions and 38 deletions**, against the 9,375-insertion reformatting the same operation caused in C2.

## [v04.49r] — 2026-09-04 01:18:37 AM EST

> Figure out a way to resolve the literal-brace defect if it is a visible reader-facing bug. Then, continue with your recommendation and give me the prompt to paste into a new Opus 5 session to run C3 and remember session.

### Fixed

- **Study Guide glossary tooltips were rendering as raw `{{markers}}` in two places.** The guide renderer sets comparison-card headings and subtitles (`gdProsCons`) and bar-chart labels and sub-labels (`gdBars`) with `textContent` rather than through `gdFmt`, the formatter every sibling field uses. A term marker in any of those four fields reached the reader as literal braces. A DOM probe confirmed it visibly on **10 guides / 18 markers** — `aep`, `cummins`, `dominion-energy`, `entergy`, `oncor`, `piller`, `rehlko`, `rolls-royce-power-systems`, `southern-company` and `mitsubishi-electric`.
- Fixed **at the page layer rather than in the data**: four edits in `Profiler.html` (v01.81w → v01.82w) route those fields through `gdFmt`, plus a new `gdPlain()` helper that strips authoring markers for attribute contexts (`title=`) which cannot hold the markup `gdFmt` emits. One change repaired all ten guides without editing nine other sessions' data files.
- The v04.48r data workaround is reverted — the `{{term}}` markers removed from three C2 card headings are **restored**, because the data was never wrong. Verified after the fix: `piller` renders 71 terms (was 69, with `LFP` and `magnetic bearings` previously unrendered), `powell-industries` 25 (was 23), `mitsubishi-power` 23 (was 22), and the DOM probe reports **0 guides showing literal braces**.

### Added

- **`scripts/check-profiler-study.py` now rejects `{{term}}` in the fields that remain plain text by design** — a section's `title` and `read`, and a timeline's `lanes` legend labels — with an error naming the field and pointing the author at `intro`/`ps`/`note` instead. Negative-tested: injecting a marker produces exactly one error and removing it returns the checker to clean, so the rule cannot silently stop working.

### Changed

- `repository-information/SESSION-CONTEXT.md` — session context written for the next session, including the Phase C2 outcome, the G3/G4 half-closed assessment, the re-confirmed Playwright environment notes, and the `indent=1` JSON serialization trap that cost a diff review this session.

### Notes

- One pre-existing issue is reported rather than fixed: `xcel-energy.study.json`'s `what-a-minimum-demand-charge-buys` section carries section-level `pros`/`cons` arrays the renderer never reads, so that content is invisible to the reader. Different bug class from the brace defect — missing content rather than wrong markup — and it belongs to another session's ledger row.

## [v04.48r] — 2026-09-04 12:17:58 AM EST

> Picking up from my last session, run Phase C2 of repository-information/PROFILER-COVERAGE-PLAN.md on Opus 5 xhigh as a fresh session: Mitsubishi Electric · Powell Industries · Mitsubishi Power, all `supplier`. Phase C1 is on main (v04.47r). This session covers THIS GROUP ONLY — C3 (Infineon, Flex) is a separate session afterwards, and the closing Phase-B-vs-Phase-C recommendation is owed at the end of C3, not here.
>
> READ FIRST, before writing anything: 1. repository-information/SESSION-CONTEXT.md — the C1 entry. Read the environment notes in particular. The Playwright harness's HTTP server MUST be threaded (socketserver.ThreadingMixIn + http.server.HTTPServer, daemon_threads, BrokenPipeError/ConnectionResetError swallowed in handle_one_request, no-op handle_error, flushing print shim) or page.reload() deadlocks while Profiler.html fetches ~100 JSON files. Three harness corrections found in C1 that you will need: the Relationships tab id is `rels` not `relationships`; #ov-guide-overlay is position:fixed so offsetParent is ALWAYS null — test visibility with getComputedStyle(ov).display !== 'none'; and the study overlay loads concepts asynchronously, so wait_for_selector('#ov-guide-overlay .gd-title') after clicking #ov-study-btn. Relationship cards are `.ov-rel` and derived "Detected" cards render ALONGSIDE curated ones, so do NOT assert "every card has a source link" — assert that the number of cards carrying `.ov-rel-src` is at least the count of relationships[] in the file. Avoid JS regex literals inside page.evaluate strings; Python eats the escapes and you get a bare SyntaxError. Also read the refreshed blocked-host list, the headshot pipeline, and the profile-shape traps (productsAndServices needs name/category/description/highlights[]; technicalSpecs is {product, specs:[{band,label,value}]}; study timeline items need numeric x + lane + label + sub with a lanes map; proscons needs cards[] of {t, meta, adv[], dis[]}; sections render intro and note but NOT outro; profile financials renders commentary, not note; relationships[].project must already exist in profiler-projects.json; no two metrics in one period may share a kpi; and sources[].date must be YYYY-MM or YYYY-MM-DD — a bare "2024" fails). 2. PROFILER-COVERAGE-PLAN.md §2 (Phase C is Opus 5 xhigh natively — there is NO substitution to record), §5 (the C2 row), §7 (what every session owes), and the three §8 rows. 3. .claude/rules/profiler-app.md — Profiler Command (two parallel research subagents per company, first-party exhaustive then third-party, ~50–70 sources each, products & services as the priority section), Profiler Prep Command (technology curriculum, high-school-STEM baseline, never company trivia), Archival Procedure, Scheduled Refreshes. 4. repository-information/PROFILER-SCHEMA.md (profile schema v7, study schema v2, concepts registry, calendar schema) and PROFILER-STYLES.md (active style: intel-briefing). 5. CLASSROOM-CURRICULUM-PLAN.md §6 rows G3 and G4 — this session is their closer, so each guide must carry what its row actually asks for. 6. The four gen-set guides already on main — caterpillar, cummins, rolls-royce-power-systems and rehlko. C2's guides must NOT repeat them. Rehlko's guide in particular already teaches single-line-diagram literacy, static UPS internals (rectifier / DC link / inverter / static bypass, double conversion, eco-mode, IEC 62040-3 VFI-VI-VFD), the four clocks (hold-up, ride-through, autonomy, transfer time), monolithic vs modular, UPS sizing, paralleling switchgear as a product, and single-source vs best-of-breed. Teach against that, not over it.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7, profileVersion 1, category `supplier`, intel-briefing prose with BLUF, numbered confidence-tagged key judgments and explicit collection gaps) and study guide (schema v2, a where-it-fails section drawn from CLASSROOM-CURRICULUM-PLAN §5, {{term}} tooltips against the 311-entry registry, NEW SHARED CONCEPTS in profiler-concepts.json rather than local glossaries, flashcards and quiz on how the technology and the buying process work rather than company trivia). One push commit.
>
> Slugs and entities: `mitsubishi-electric` (Mitsubishi Electric Corporation, TSE: 6503 — the UPS, transformer and switchgear businesses are the relevant ones; do not let the factory-automation and semiconductor segments dominate the file); `powell-industries` (NASDAQ: POWL); `mitsubishi-power` (Mitsubishi Power, a unit of Mitsubishi Heavy Industries, TSE: 7011 — keep the unit and the listed parent strictly apart in every figure, exactly as the Rolls-Royce Power Systems dossier does).
>
> Research priorities. Mitsubishi Electric: the large static UPS line by kVA and topology, efficiency and eco-mode figures, transformer and switchgear ranges by voltage class, any data-center-specific product or reference, capacity expansions, FY2024/FY2025/interims vs consensus with the outlet named, decision makers. Powell Industries: MV switchgear product families by voltage and bus rating, arc-resistant construction and its standard, the >$400M single data-center order and the backlog exactly as the company states it, book-to-bill, the Houston and Canadian footprint, quarterly results vs consensus with the outlet named, decision makers. Mitsubishi Power: the gas-turbine frames by output and efficiency (M501/M701 class, J and JAC series), simple vs combined cycle ratings, hydrogen co-firing capability, the data-center bridge-power position, the former ownership of Prevalon and what it is now, order backlog, decision makers.
>
> The guides teach the medium-voltage room: what switchgear actually does, arc flash and why arc-resistant construction exists, selective coordination and how a protection study is built, why a campus buys at medium voltage and steps down, transformer lead times as the binding constraint, and the third gas-turbine OEM read against GE Vernova and Siemens Energy — both already covered, so teach the comparison rather than the category.
>
> relationships[] resolve only to covered slugs and only with a source that explicitly states the link. In C1 all three companies anonymised every gigawatt-scale data-center commitment, so the sets came out competitor-heavy; if that repeats, say so in the dossier rather than reaching. A competitor link IS curatable when a source explicitly ranks the parties in one market. Where a newly covered slug makes an existing dossier's link curatable, do it in the same commit (archive per the Archival Procedure, profileVersion +1) — ge-vernova and siemens-energy are the obvious candidates for mitsubishi-power, and eaton, abb, schneider-electric, vertiv and piller for the others.
>
> Put every must-find item in the agent prompts because nothing can be searched after they return: the next earnings date and reporting cadence, a company-published headshot URL for each decision maker, a URL for every relationship claim, and consensus figures with the outlet named and never blended. Give each agent the full covered-slug list so it can flag links.
>
> BOOKKEEPING, same commit: python3 scripts/sync-profiler-registry.py, python3 scripts/build-profiler-graph.py, python3 scripts/check-profiler-study.py; a calendar row per company — verify the public/private status yourself rather than assuming (in C1 the brief said all three were public and Rehlko was not), research the date, mark `confirmed` honestly and write the conflict into `source` if trackers disagree with the company's own IR calendar; README tree entries for every profile and study file, every study-prep folder, any new archive file, and the execs count; flip the §8 rows (Dossier → v1, Guide → ✓, with the repo version). NO model substitution to record — Phase C on Opus is the plan's own assignment.
>
> CHANGELOG IS AT 100/100 — ARCHIVE ROTATION WILL FIRE ON THIS PUSH at 101 sections. Budget ~10 minutes and follow CHANGELOG-archive.md's rotation logic: rotate whole date groups, never split one, today's sections are exempt, and SHA enrichment on every moved header is mandatory (run `git fetch --unshallow origin main` first, build one `git log --oneline --all` lookup table, then verify with `grep '^## \[v' CHANGELOG-archive.md | grep -v '— \['` returning nothing).
>
> Do NOT re-run the CLASSROOM-CURRICULUM-PLAN.md §6 register checks — those are owed at the phase close, and both phases are mid-flight.
>
> VERIFY BEFORE COMMITTING: sync-profiler-registry.py --check clean, check-profiler-study.py clean, a local schema-v7 validator clean, and every dossier and every study guide rendering in Profiler.html via Playwright with zero page errors and zero console errors — mirror scripts/verify-profiler-roles.py's GAS stub exactly, fulfill accounts.google.com with an empty script rather than aborting, reload between dossiers, and confirm every relationships[] slug and every {{term}} resolves. Data-only: no page or GAS file changes and no Profiler version bump unless something actually requires one. Normal Pre-Commit and Pre-Push checklists; bump the repo version on the push commit; push on a claude/* branch.
>
> If a rating, a spec, a backlog figure or an order value cannot be sourced from a datasheet, a filing, a regulator or the company's own release, leave it out and say so — a thinner dossier beats a fabricated line. And tell me at the end whether the UPS and MV-switchgear material in these guides genuinely closes G3 and G4 or only half-closes them, so I know what the phase-close register re-check will find.

### Added

**Profiler — Phase C2 dossiers (three `supplier` companies, schema v7, profileVersion 1)**

- `mitsubishi-electric.profile.json` — Mitsubishi Electric (TSE: 6503). 76 sources (62% first-party), 7 product lines, 6 specification groups, 19 developments, 17 relationships, 5 policy regimes, 11 decision makers (9 with company-published headshots), 3 financial periods, 8 confidence-tagged key judgments. The file is deliberately weighted to the power and energy-systems business rather than factory automation or semiconductors. Its headline collection gap is recorded openly: the company attributed Energy Systems growth to North American transformer expansion, but it sold its only US transformer plant (Memphis) to Hyosung in 2019 — the current capacity location is not in the public record.
- `powell-industries.profile.json` — Powell Industries (NASDAQ: POWL). 67 sources (75% first-party), 6 product lines, 6 specification groups, 15 developments, 7 relationships, 5 policy regimes, 10 decision makers (9 with headshots), 3 financial periods, 9 key judgments.
- `mitsubishi-power.profile.json` — Mitsubishi Power, a business of Mitsubishi Heavy Industries (TSE: 7011). 77 sources (68% first-party), 5 product lines, 5 specification groups, 19 developments, 11 relationships, 5 policy regimes, 11 decision makers (5 with headshots), 3 financial periods, 10 key judgments. Every financial line is labelled as MHI consolidated, MHI Energy Systems segment, or the GTCC business line, with an explicit statement that no unit-level figure exists or can be derived — the unit and the listed parent are kept apart in every number.

**Profiler — Phase C2 study guides (schema v2, each with a `where-it-fails` section)**

- `mitsubishi-electric.study.json` — 11 sections on the static UPS as a machine: inside the three-level inverter and where its losses go, why an efficiency figure is quoted at one load point, transformer-based against transformerless topology and how the neutral is derived, the UPS as the generator set's hardest customer, sizing the battery by C-rate rather than kWh, and the medium-voltage transformer as the schedule-binding item.
- `powell-industries.study.json` — 10 sections on the medium-voltage room: what a switchgear lineup actually is and what the one-line above it says, arc flash against arc interruption and why arc-resistant construction exists, how a protection study is built from short-circuit through coordination to incident energy, buying the room as an e-house with a factory acceptance test, and where a custom builder wins against a catalogue.
- `mitsubishi-power.study.json` — 13 sections on the gas turbine: why half the machine's work never leaves it, firing temperature as the number that sets efficiency, why 50 Hz frames are physically bigger, reading a rating plate in simple against combined cycle, why hydrogen volume percent is not energy percent, the follower problem when turbines back up renewables, and the third OEM read against GE Vernova and Siemens Energy rather than taught as a new category.
- Each guide opens against the four existing gen-set guides and the UPS, switchgear and turbine material already in the library, and teaches past them rather than over them.

**Supporting data**

- 41 new shared concepts in `profiler-concepts.json` (311 → 352), including arc-resistant construction, incident energy, selective coordination, metal-clad switchgear, firing temperature, thermal barrier coating, turbine cooling air, time-current curve and CHP. No local glossaries.
- Three technology lesson plans under `repository-information/study-prep/`, each opening with an explicit list of what it deliberately does not repeat from the adjacent guides.
- 23 company-published executive headshots (`live-site-pages/images/execs/` 281 → 304 images across 60 companies).
- Three rows in `profiler-refresh-calendar.json` (62 → 65). All three are public companies; each is marked `confirmed: false` with the tracker disagreement written into `source` — Mitsubishi Electric publishes only a cadence image and no dated calendar; MHI's trackers split five days between an announcement date and a filing date; Powell had no upcoming entry on its own events page and only one tracker estimate.

### Changed

- Eight existing dossiers gained relationship links that became curatable once the C2 slugs were covered, each with a source that states the link explicitly: `ge-vernova` and `siemens-energy` (v4 → v5) to `mitsubishi-power`; `eaton`, `abb`, `schneider-electric` and `vertiv` (v4 → v5) and `piller` (v1 → v2) to the C2 suppliers; `prevalon` (v3 → v4). Prior versions archived per the Archival Procedure and indexed in `archive/archive-index.json`.
- `profiler-graph.json` rebuilt: 604 → 643 edges (460 → 493 curated), 1,824 → 1,921 evidence items.
- `profiler-companies.json` registry synced (101 → 104 entries).
- `PROFILER-COVERAGE-PLAN.md` §8 — the three C2 rows flipped to `v1 · v04.48r` / `✓ · v04.48r`, and `piller`'s dossier cell records its `v1 · v04.42r → v2 · v04.48r` bump. No model substitution: Phase C on Opus 5 is the plan's own assignment.
- `README.md` — tree entries for the six new data files, the eight new archive files and the three study-prep folders; executive headshot count updated.

### Fixed

- Three C2 study guides carried `{{term}}` markers inside `proscons` card titles and subtitles. Those two fields are rendered with `textContent` rather than the formatter that resolves tooltips, so the braces would have been visible to the reader. The markers were removed from the affected titles and the two tooltips that mattered were relocated into adjacent text that does resolve them. The same pattern exists in nine older guides written by earlier sessions and is left untouched here; it is reported rather than silently edited.

### Notes

- Relationship discipline: several links were deliberately not curated and the reasoning is recorded in the dossiers — `powell-industries` to `siemens-energy` (Powell's 10-K names Siemens Industries, Inc., which is Siemens AG rather than Siemens Energy AG), the 2006 GE Consumer & Industrial transaction as a route to `ge-vernova` (that unit became GE Industrial Solutions and went to ABB; the `ge-vernova` link is instead carried on an explicit market ranking), and `mitsubishi-power` to `nvidia` (a parent-level cooling and power partnership, not a turbine relationship).
- No FX conversion was published for either Japanese company. No defensible fiscal-year average JPY/USD rate could be sourced for the full period, so `usdMillions` is omitted and the reason is stated in `financials.commentary`; `kpiNorm` is false for both. Powell is reported as filed.
- One headshot was dropped rather than published. Two independent readings of Mitsubishi Electric's leadership page disagreed on which image belonged to one executive; the file was deleted and the omission is recorded in that person's entry.
- Data-only change: no page or Google Apps Script file was modified and no Profiler version was bumped.
- CHANGELOG `Sections: 100/100` → rotation fired on this push; the oldest whole date group moved to `CHANGELOG-archive.md` with SHA enrichment on every moved header.

## [v04.47r] — 2026-09-03 09:58:27 PM EST

> Picking up from my last session, run Phase C1, C2 and C3 of repository-information/PROFILER-COVERAGE-PLAN.md on Opus 5 xhigh as a fresh session. Phase B is PAUSED after B2 by my decision — the weekly Fable cap is out, so I am running the Phase C sessions that are natively Opus under §2 instead of substituting Opus into Phase B. Phase B2 is on main (v04.46r). These are three separate sessions, one per group, each landing its own push commit — do NOT try to do all nine companies in one session.
>
> READ FIRST, before writing anything: 1. repository-information/SESSION-CONTEXT.md — the B2 entry. Read the environment notes in particular: the Playwright harness's HTTP server MUST be threaded (a single-threaded socketserver.TCPServer deadlocks on page.reload() because Profiler.html fetches ~100 JSON files at once — use socketserver.ThreadingMixIn + http.server.HTTPServer with daemon_threads, swallow BrokenPipeError in handle_one_request, no-op handle_error, and add a flushing print shim); page.reload() between dossiers because the Study Guide overlay persists across hash navigation; the tooltip probe reads #gd-tip and needs a 3-attempt retry with page.mouse.move(0,0) between tries; research subagents exhaust the session's WebSearch budget, so every must-find item goes in the agent prompts; and the profile-shape traps list. 2. PROFILER-COVERAGE-PLAN.md §2 (the model rule — Phase C is Opus 5 xhigh natively, so there is NO substitution to record here), §5 (the C1, C2 and C3 rows and why they run first), §7 (what every session owes), and the nine companies' §8 rows. 3. .claude/rules/profiler-app.md — Profiler Command, Profiler Prep Command, Scheduled Refreshes. 4. repository-information/PROFILER-SCHEMA.md and PROFILER-STYLES.md (active style: intel-briefing). 5. CLASSROOM-CURRICULUM-PLAN.md §6 rows G2, G3, G4 and G9 — these three sessions are the register closers.
>
> THE SESSIONS: C1 — Cummins · Rolls-Royce Power Systems (mtu) · Rehlko (Kohler Energy), all `supplier`. Closes G2. Research priorities: gen-set product lines by power node and fuel, data-center ratings and standby/prime/continuous definitions, paralleling and switchgear scope, the hyperscale AI-hall wins each names, BESS lines where they exist (Rolls-Royce has one), plant and capacity expansions, FY2024/FY2025/interims vs consensus with the outlet named, decision makers. The guide teaches the gen-set as a machine and as a procurement: what standby vs prime vs continuous actually mean, why a data center sizes N+1 on standby ratings, the start-and-accept-load sequence against the UPS ride-through, emissions tiers and permitting as the real constraint on siting, and where a gen-set stops and a bridge-power plant begins. C2 — Mitsubishi Electric · Powell Industries · Mitsubishi Power. C3 — Infineon · Flex.
>
> FOR EACH SESSION: `profiler <Company>` then `profiler prep <Company>` per company — dossier (schema v7, profileVersion 1, categories per the §8 row, intel-briefing prose with confidence-tagged key judgments) and study guide (schema v2, a where-it-fails section, {{term}} tooltips against the 293-entry registry, NEW SHARED CONCEPTS IN profiler-concepts.json rather than local glossaries, flashcards and quiz on how the technology and the buying process work rather than company trivia). relationships[] resolve only to covered slugs and only with a source that explicitly states the link. Put every must-find item in the agent prompts because nothing can be searched after they return: the next earnings date and cadence, a company-published headshot URL for each decision maker, a URL for every relationship claim, and consensus figures with the outlet named.
>
> BOOKKEEPING, same commit as the session it belongs to: python3 scripts/sync-profiler-registry.py, python3 scripts/build-profiler-graph.py, python3 scripts/check-profiler-study.py; a calendar row per company (all nine are public — research the date, mark `confirmed` honestly, write the source and watch[]); README tree entries for every profile and study file and every study-prep folder, plus the execs count; flip the §8 rows (Dossier → v1, Guide → ✓, with the repo version). NO model substitution to record — Phase C on Opus is the plan's own assignment.
>
> CHANGELOG IS AT 99/100 — ARCHIVE ROTATION IS MANDATORY ABOVE 100 AND WILL FIRE ON THE C1 PUSH. Budget ~10 minutes and follow CHANGELOG-archive.md's rotation logic with SHA enrichment. Do NOT re-run the CLASSROOM-CURRICULUM-PLAN.md §6 register checks — those are owed at the phase close, and Phase B is paused mid-phase so neither phase is closed.
>
> VERIFY BEFORE EACH COMMIT: sync-profiler-registry.py --check clean, check-profiler-study.py clean, every dossier and every study guide renders in Profiler.html via Playwright with zero page errors and zero console errors (mirror scripts/verify-profiler-roles.py's stub exactly, fulfill accounts.google.com with an empty script, reload between dossiers), every relationships[] slug and every {{term}} resolving. Normal Pre-Commit and Pre-Push checklists; bump the repo version on each push commit; push on a claude/* branch.
>
> If a rating, a spec or an order value cannot be sourced from a datasheet, a filing, a regulator or the company's own release, leave it out and say so — a thinner dossier beats a fabricated line.
>
> AT THE END OF C3, GIVE ME A RECOMMENDATION: should I continue with the remaining Phase C builds (C4–C12 plus the 30-guide backfill), or stop and finish the paused Phase B builds (B3–B10) first? Reason it from the actual state of the ledger, not from the plan's default ordering — specifically: which CLASSROOM-CURRICULUM-PLAN.md §6 register rows each remaining group would close, which later Phase C sessions have relationship dependencies on uncovered Phase B slugs (C9 needs Anthropic and Fluidstack from B9; C10 needs Aypa from B3 and Compass from B7), whether the §6 register re-check being owed at each phase close argues for finishing one phase before starting more of the other, and my Fable weekly cap having reset by then.

### Added

**Profiler dossiers (Phase C1 — three gen-set OEMs, data-only)**

- **`cummins` — Cummins Inc.** (`live-site-pages/profiler-data/cummins.profile.json`, schema v7, profileVersion 1): 96 sources at 60 percent first-party, 10 product lines, 5 spec groups with 53 banded rows, 29 developments, 4 relationships, 6 policy-exposure regimes, 15 decision makers with 12 company-published headshots, 4 financial periods. Power Systems rebuilt around data-center demand — 16 percent of company sales at 18.4 percent segment EBITDA in FY2024, 18 percent at 22.7 percent in FY2025, a record 29.5 percent in Q1 2026 — against a $450M programme adding 20 GW of high-horsepower capacity for 55 GW by 2030 and a book sold out into the second half of 2028. Carries the Data Center Continuous (DCC) rating verbatim from Cummins' own bulletin, including the company's statement that ISO's own 2018 Data Centre Power rating "is not appropriate for Uptime Institute Tier III or Tier IV certification". Every consensus figure is reported twice where outlets disagree, because Investing.com and StockStory quote GAAP diluted EPS while Zacks and Barchart quote adjusted — a difference that flipped Q1 2026 from a 16 percent miss to a 10 percent beat on the identical print, and the two bases are never blended.
- **`rolls-royce-power-systems` — Rolls-Royce Power Systems AG (mtu)** (`live-site-pages/profiler-data/rolls-royce-power-systems.profile.json`, schema v7, profileVersion 1): 103 sources at 71 percent first-party, 10 product lines, 6 spec groups with 61 banded rows, 32 developments, 6 relationships, 9 policy regimes, 15 decision makers with 6 headshots, 3 financial periods. The widest single-vendor span in on-site data-center power in the corpus — diesel and gas gen-sets, a diesel-rotary UPS, a grid-scale battery, a microgrid controller and prefabricated 10/20/30 MW plant modules. Divisional margin 13.1 → 17.4 → 20.3 percent in eighteen months on a 1.8x book-to-bill, with Citigroup's August 2026 sum-of-the-parts making Power Systems the parent's largest single contributor ahead of Civil Aerospace. Benchmarked against Rolls-Royce's own company-compiled analyst consensus rather than consumer trackers, whose half-year-shaped splits do not reconcile to reported figures.
- **`rehlko` — Discovery Energy, LLC (trading as Rehlko)** (`live-site-pages/profiler-data/rehlko.profile.json`, schema v7, profileVersion 1): 91 sources at 66 percent first-party, 10 product lines, 5 spec groups with 47 banded rows, 24 developments, 5 relationships, 9 policy regimes, 16 decision makers with 14 headshots, 2 financial periods. The former Kohler Energy, majority-owned by Platinum Equity since May 2024 — and the only gen-set OEM in the corpus that also manufactures a three-phase static UPS and medium-voltage metal-clad paralleling switchgear. Revenue, EBITDA, backlog and headcount are not disclosed in any first-party source and the dossier says so; the only figures available are S&P Global Ratings' 'B' rating, mid-4x leverage and roughly 10 percent EBITDA margin, reaching the file through trade press because spglobal.com returns an access error to every retrieval method.

**Study guides and lesson plans**

- **`cummins.study.json`** (14 sections) and **`repository-information/study-prep/cummins/cummins-lesson-plan.md`** — the gen-set as a purchase: datasheet literacy, the four multiplications that size a plant, derating, why a turbocharged diesel cannot take everything at once, isochronous against droop, the emissions class as a legal rather than technical decision, fuel as logistics, and where the order stops being an engine.
- **`rolls-royce-power-systems.study.json`** (13 sections) and its lesson plan — the gen-set beside a battery, in two regulatory worlds: where frequency actually comes from, what a megawatt-scale battery changes about the ten-second start, grid-forming against grid-following and why it decides protection settings, power and energy as two purchases, HVO as a procurement answer to a carbon question, and the controller as the product.
- **`rehlko.study.json`** (13 sections) and its lesson plan — the whole power room from one vendor: reading a single-line diagram, the four blocks of a static UPS with an honest account of eco-mode, four time constants that get confused in one conversation, monolithic against modular, paralleling switchgear as a software product, gas for continuous duty, and single-source against best-of-breed as a question about the buyer rather than the equipment.
- Each guide carries a `where-it-fails` section drawn from the §5 failure map (rows 4 and 5 for the two engine guides, rows 5 and 6 for the UPS-heavy Rehlko guide), 14 to 16 flashcards and a 10-item self-test, all written on how the technology and the buying process work rather than on company facts. None of the three repeats the Caterpillar guide's ten-second race, block load, paralleling or air-permit material.

**Registry and supporting data**

- **18 shared concepts** added to `profiler-concepts.json` (293 → 311): `alternator`, `anti-islanding`, `AVR`, `day tank`, `DEF`, `diesel particulate filter`, `diversity factor`, `EPA Tier 2`, `EU Stage V`, `fuel polishing`, `HVO`, `isochronous`, `modular UPS`, `peak shaving`, `prime mover`, `RICE NESHAP`, `single-line diagram`, `turbo lag`. Four candidates were dropped as alias collisions rather than added — 2N resolves through `N+1`, Title V and PSD through `air permit`, and load acceptance through `block load`.
- **32 executive headshots** downloaded and converted (249 → 281 images across 57 companies): 12 for Cummins from the investor leadership CDN, 6 for Rolls-Royce across the group executive team and the mtu press-asset gallery, and 14 for Rehlko covering the seven-person executive team and seven members of its Strategic Advisory Council.
- **Three calendar rows** in `repository-information/profiler-refresh-calendar.json` (59 → 62). Cummins and Rolls-Royce carry researched `nextReport` dates marked `confirmed: false`, because neither company's own IR calendar listed a forward date on 2026-09-04 — Cummins' read verbatim "no upcoming events scheduled at this time" while two trackers disagree by a week, and Rolls-Royce's listed only September investor conferences. Rehlko carries `cadence: "quarterly"`: it is private, has no earnings calendar and no SEC registrant, which is a correction to the session brief's assumption that all three were public.

### Changed

- **`caterpillar.profile.json` revised to profileVersion 2** — the three new slugs make the competitive links curatable from Caterpillar's side, so the dossier gains symmetric `competitor` relationships to `cummins`, `rolls-royce-power-systems` and `rehlko` (9 → 12 relationships, 124 → 128 sources). The v1 file is archived to `profiler-data/archive/caterpillar.profile.v1.json` with an `archive-index.json` entry per the Archival Procedure.
- **`profiler-companies.json`** — three registry entries added with `domains` arrays (98 → 101 companies; the supplier chip counts 45). `scripts/sync-profiler-registry.py` reconciled 5 entries and reports 0 of 101 out of sync; this also corrected pre-existing drift on `aep`, whose `srcTotal` had been left at 142 against a profile carrying 143 sources.
- **`profiler-graph.json`** rebuilt: 581 → 604 edges, 448 → 460 curated, 1,768 → 1,824 evidence items.
- **`README.md`** — tree entries for six new data files, one new archive file and three new study-prep folders; executive headshot count 249 → 281 across 54 → 57 companies.
- **`PROFILER-COVERAGE-PLAN.md` §8** — the three C1 rows flipped to `v1 · v04.47r` / `✓ · v04.47r` with no model substitution recorded, Phase C on Opus 5 xhigh being the plan's own assignment. Caterpillar's A1 row now reads `v1 · v04.41r → v2 · v04.47r` so the revision is visible without losing the A1 provenance.

### Fixed

- Nothing was fixed in shipped code; this is a data-only change with no page or GAS file touched and no Profiler version bump.

### Notes

- **CHANGELOG archive rotation did not fire, and the session brief's prediction that it would was off by one.** The counter moves 99 → 100 with this section, and `CHANGELOG-archive.md`'s own step 2 stops the procedure at "100 or fewer". Rotation triggers on the next push, at 101.
- **Relationship discipline.** Six research agents across the three companies found no source naming any hyperscaler, colocation landlord or neocloud as a gen-set customer of any of them. Cummins' multi-gigawatt hyperscaler framework, its record battery order and Rehlko's 1.7 GW of awards are all deliberately anonymised by their own releases, and Rolls-Royce's H1 2026 results refer only to unnamed "framework agreements with data centre customers". The relationships that were written are therefore four competitor links for Cummins, six for Rolls-Royce (including a `partner` link to `microsoft` for a jointly authored HVO position paper, which is advocacy and not an order, and a `supplier` link to `catl` for cells named in the Voltaria project) and five for Rehlko (including a `partner` link to `schneider-electric` for an Infrastructure Masons working group and an `other` link to `vertiv` on shared sponsor and board lineage). Every one carries a source that states the link.
- **The 18 percent / 16 percent market-share figures are attributed, not asserted.** Two of the three third-party agents could not substantiate them at all and one located them on Fortune Business Insights' 2026 data. The dossiers cite that attribution explicitly and note that vendor market-size estimates for nominally the same market range from $433M to $10.34B across firms.
- **Verification**: `sync-profiler-registry.py --check` 0 of 101 out of sync; `check-profiler-study.py` 0 errors across 74 guides and 311 concepts; a local schema-v7 validator clean on all four profiles; and Playwright against `Profiler.html` with the `verify-profiler-roles.py` stub — nine tabs each across Cummins, Rolls-Royce, Rehlko and the revised Caterpillar, every curated relationship card rendering with its context and a resolving source link, all 36, 42, 54 and 43 unique `{{term}}` spans resolving on hover, zero page errors and zero console errors.

## [v04.46r] — 2026-09-03 07:33:43 PM EST

> Picking up from my last session, run Phase B2 of repository-information/PROFILER-COVERAGE-PLAN.md on Fable 5.1 High as a fresh session: Oncor, AEP and Xcel Energy. Phase B1 is on main (v04.45r); this is the second Phase B session, it is data-only (no page change), and it lands three utility dossiers and three study guides in one push commit.
>
> READ FIRST, before writing anything: 1. repository-information/SESSION-CONTEXT.md (the B1 entry — the sequencing-during-agent-waits pattern with the Python dossier builders, the environment notes: the four subagents exhausted the session's 200-call WebSearch budget so nothing can be searched after they return, the Playwright harness must page.reload() between dossiers because the Study Guide overlay persists across hash navigation, the tooltip probe reads #gd-tip, the harness-created remote branch is swept before the first push, and the blocked-host list); 2. PROFILER-COVERAGE-PLAN.md §2 (model rule — Phase B is Fable 5.1 High; Opus 5 xhigh only if the weekly cap binds, recorded in §8), §4 (the B2 row — why Oncor, AEP and Xcel share a session), §7 (what every session owes) and the `oncor`, `aep` and `xcel-energy` rows in §8; 3. .claude/rules/profiler-app.md — Profiler Command (two parallel research subagents per company, first-party exhaustive then third-party, ~50–70 sources each, products & services as the priority section), Profiler Prep Command (technology curriculum, high-school-STEM baseline, never company trivia), Scheduled Refreshes (all three are public — researched nextReport rows); 4. repository-information/PROFILER-SCHEMA.md (profile schema v7, study schema v2, the `utility` category row, concepts registry, calendar schema); 5. repository-information/PROFILER-STYLES.md — active style is intel-briefing; 6. CLASSROOM-CURRICULUM-PLAN.md §3.5 and §6 row G5, so the guides carry what `how-a-utility-buys` will pin as its fourth, fifth and sixth public sources; 7. the three utility guides already on main — dominion-energy.study.json (the chain itself: revenue requirement, IRP → CPCN → RFP, the rate case, the large-load tariff, PJM), southern-company.study.json (the elected commission, the no-RTO balancing authority, certifying a decade in one cycle, the pipeline in tranches, Vogtle as risk memory) and entergy.study.json (the holding company, formula rate plans, MISO South, the single-customer certificate and the order that names the customer). The B2 guides must teach each utility's own story against those three and not duplicate them: Oncor — the ERCOT wires-only utility that certifies no generation, SB 6 and the large-load queue, the transmission-and-distribution rate case, CenterPoint/AEP Texas as peers; AEP — the multi-state RTO holding company (PJM, SPP, ERCOT through AEP Texas), the 765 kV backbone, the Ohio data-center tariff, the Indiana/Ohio/Virginia large-load rules; Xcel — the Midwest/Mountain IRP state, Colorado's and Minnesota's commissions, the resource plans and the large-load tariffs there.
>
> THE TASK: `profiler Oncor`, `profiler prep Oncor`, `profiler AEP`, `profiler prep AEP`, `profiler Xcel Energy`, `profiler prep Xcel Energy`, one push commit. Dossiers: slugs `oncor` (Oncor Electric Delivery — Sempra-owned, treat Sempra as the parent where sourced; no ticker of its own, so the ownership object is `subsidiary`), `aep` (NASDAQ: AEP; American Electric Power, with AEP Ohio, AEP Texas, Indiana Michigan Power, Appalachian Power, PSO and SWEPCO in scope where sourced) and `xcel-energy` (NASDAQ: XEL; Public Service Company of Colorado, Northern States Power Minnesota, Southwestern Public Service, NSP Wisconsin), category `utility`, profileVersion 1, all prose in intel-briefing style with confidence-tagged key judgments. Research priorities, Oncor: the large-load interconnection queue as Oncor and ERCOT state it (requests vs signed agreements vs energized — keep them apart), SB 6 and the PUCT's large-load rules (16 TAC §25.194, fees, security, curtailment), the 2025–2026 rate case and the capital plan, the 765 kV Permian Basin plan and ERCOT's regional transmission plans, the Sempra ownership and any sale/stake process, FY2024, FY2025 and the latest interims (Oncor reports its own results — find them; use Sempra's segment reporting for consensus context), decision makers. AEP: the data-center load figures by operating company (contracted vs pipeline, the 24 GW-plus of signed agreements the company cites), the AEP Ohio data-center tariff order and the Indiana, Virginia and Texas large-load rules, the 765 kV transmission program and PJM's RTEP awards, the generation plan (gas self-builds, storage RFPs, the SMR work with Bechtel and others only if sourced), FY2024, FY2025 and interims vs consensus, decision makers. Xcel: the Colorado and Minnesota resource plans and what was approved, the large-load tariffs in Colorado, Minnesota and Texas/New Mexico (SPS), the data-center pipeline as stated, storage and gas procurements and who won them, wildfire liability and its rate effect, FY2024, FY2025 and interims vs consensus, decision makers. relationships[] resolve only to covered slugs and only with a source that explicitly states the link. Put every must-find item in the agent prompts, because nothing can be searched after they return: the Q3 2026 earnings date and cadence, a company-published headshot URL for each decision maker, a URL for every relationship claim, consensus figures with the outlet named. Study guides: Oncor — how a wires-only utility in a market with no capacity obligation connects a gigawatt; AEP — how a holding company in three RTOs allocates one transmission backbone and reads three commissions' large-load rules; Xcel — how an IRP-state commission approves a resource plan and what a large-load tariff looks like in a state with a wildfire liability overhang. Each with a where-it-fails section aligned to §5 row 1, {{term}} tooltips against the 251-entry registry, new shared concepts in profiler-concepts.json rather than local glossaries, and flashcards/quiz on how the process works, not company trivia.
>
> BOOKKEEPING, same commit: python3 scripts/sync-profiler-registry.py, python3 scripts/build-profiler-graph.py, python3 scripts/check-profiler-study.py; three calendar rows (public — research each next earnings date, mark confirmed honestly, write the source and watch[]; Oncor's row should name where Oncor's own results post); README tree entries for all three profile and study files and all three study-prep folders, and the execs count; flip the three §8 rows (Dossier → v1, Guide → ✓, with the repo version; record a model substitution only if one happened). CHANGELOG is at 98/100 — rotation is mandatory above 100 and may fire on this push. Do NOT re-run the §6 register checks — those are owed at the Phase B close. VERIFY BEFORE COMMITTING: sync-profiler-registry.py --check clean, check-profiler-study.py clean, all three dossiers and all three Study Guides render in Profiler.html via Playwright with zero page errors, every relationships[] slug and every {{term}} resolving, the Utility chip counting 6. Data-only: no page or GAS file changes, no Profiler version bump — the Profiler page is an indirect affect. Normal Pre-Commit and Pre-Push checklists; bump the repo version on the push commit; push on a claude/* branch. If a tariff term, a queue figure or a plant cannot be sourced from a commission order, a filing, an ERCOT or RTO report or the utility's own release, leave it out and say so — a thinner dossier beats a fabricated line. And tell me at the end what, if anything, read visibly thinner than B1 and the four xhigh anchors, so the model rule stays under review for the rest of Phase B.
>
> [Mid-session] I hit my usage limit while you were working, but it has reset now. Please continue from where you left off.
>
> [Mid-session] I ran out of Fable usage during this session. Is it acceptable to finish Phase B2 with Opus 5 xhigh or should I wait until Saturday 4am for my Fable usage to reset?

### Added

**Profiler dossiers (Phase B2 — three utilities, data-only)**

- **`oncor` — Oncor Electric Delivery** (`live-site-pages/profiler-data/oncor.profile.json`, schema v7, profileVersion 1): 113 sources, 8 product lines, 8 spec bands, 28 developments, 2 relationships, 8 policy-exposure regimes, 13 decision makers, 4 financial periods. The wires-only ERCOT utility, with the large-load funnel kept in three strictly separated tiers as Oncor itself reports them — 737 requests and 298 GW at June 30 2026, 44 GW eligible in ERCOT's Batch Zero (27 GW base plus 17 GW studied), and approximately 8 GW energized and ramping. Oncor publishes no signed-interconnection-agreement figure anywhere, which is recorded as the file's headline collection gap rather than papered over. Also carries the four 765 kV certificate dockets (59029, 59182, 59315, 59475) with lengths, counties, decision dates and energization targets; the April 2026 rate order ($6.97B revenue requirement, 9.75 percent return on equity, 43.5 percent equity layer, $200M self-insurance accrual); the Unified Tracker Mechanism under Texas House Bill 5247; the $47.5B capital plan and its $24.2B → $36B → $47.5B history; and the Sempra ring-fencing provisions as constraints on the owner.
- **`aep` — American Electric Power** (`live-site-pages/profiler-data/aep.profile.json`, schema v7, profileVersion 1): 143 sources, 6 product lines, 6 spec bands, 62 developments, 14 relationships, 6 policy-exposure regimes, 15 decision makers, 4 financial periods. 69 GW of incremental load by 2030 under fully executed service agreements across three regional markets, eight commission-approved large-load tariffs, and the 765 kV programme.
- **`xcel-energy` — Xcel Energy** (`live-site-pages/profiler-data/xcel-energy.profile.json`, schema v7, profileVersion 1): 101 sources, 6 product lines, 6 spec bands, 27 developments, 6 relationships, 7 policy-exposure regimes, 13 decision makers, 4 financial periods. Wildfire as the organizing balance-sheet fact (Marshall Fire settled at ~$640M; Smokehouse Creek unbounded, with the company stating it "remains unable to reasonably estimate ... the upper end of the range"); the GE Vernova and NextEra agreements signed upstream of any approved tariff; the 1,900 MW Google package recovered through a proposed Clean Energy Accelerator Charge; and the three-tier pipeline slide (~2 GW contracted, ~4 GW by end-2027, >20 GW pipeline) reported with the contracted block flat across two consecutive quarters.

**Study guides and lesson plans**

- **`oncor.study.json`** (15 sections) and **`repository-information/study-prep/oncor/oncor-lesson-plan.md`** — how a wires-only utility in a market with no capacity obligation connects a gigawatt.
- **`aep.study.json`** (15 sections) and **`repository-information/study-prep/aep/aep-lesson-plan.md`** — how a holding company in three regional markets allocates one transmission backbone and reads three commissions' large-load rules.
- **`xcel-energy.study.json`** (16 sections) and **`repository-information/study-prep/xcel-energy/xcel-energy-lesson-plan.md`** — how a resource-plan state's commission approves a plan, what a large-load tariff looks like in three drafts, and how an uncapped wildfire liability becomes a financing input. Each guide carries a `where-it-fails` section, `{{term}}` tooltips resolved entirely against the shared registry, and flashcards and a self-test written on process rather than company trivia.

**Registry and supporting data**

- Three registry entries in `live-site-pages/profiler-data/profiler-companies.json` (98 companies; the `utility` category now counts 6) with taglines, domains and source-provenance figures.
- Ten shared concepts in `live-site-pages/profiler-data/profiler-concepts.json` (283 → 293): `test-year`, `equity-ratio`, `settlement`, `intervenor`, `build-own-transfer`, `tax-credit-transferability`, `ptc`, `strict-liability`, `regulatory-asset`, `nameplate-capacity`.
- Twelve Oncor executive headshots in `live-site-pages/images/execs/` (237 → 249 images across 54 companies), all downloaded from Oncor's corporate-governance page and normalized.
- Three refresh-calendar rows in `repository-information/profiler-refresh-calendar.json` (56 → 59), each marked `confirmed: false` with the reason stated. Oncor's row names the three first-party channels where its own results post — the investor page's Financial News table and its DAM feed, the newsroom wire, and an SEC Form 8-K under Item 2.02 — because Oncor reports separately from Sempra.

### Changed

- **`aep.profile.json`** gains a curated `oncor` relationship (and the ERCOT Regional Planning Group source behind it), making the 765 kV eastern-backbone co-sponsorship symmetric across both dossiers now that `oncor` is a covered slug.
- **`live-site-pages/profiler-data/profiler-graph.json`** rebuilt: 581 edges (448 curated), 1,768 evidence items.
- **`README.md`** — six profiler-data entries, three study-prep folders with their lesson plans, and the executive-headshot count.
- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — the three §8 B2 rows flipped to `v1` and `✓` at v04.46r, with the model substitution recorded: the session began on Fable 5.1 High and finished on Opus 5 xhigh after the weekly Fable cap bound mid-session, which §2 permits for any Phase B company.

### Verified

- `scripts/sync-profiler-registry.py --check` — 0 of 98 entries out of sync.
- `scripts/check-profiler-study.py` — 71 study guides and 293 concepts, 0 errors, 0 warnings.
- Playwright against a local server with the role stub mirrored from `scripts/verify-profiler-roles.py`: all three dossiers and all three study guides render with **zero page errors and zero console errors**; every relationship card carries a resolving source link; all 126 unique `{{term}}` spans across the three guides resolve to a tooltip; the Utility roster chip counts 6.
- A local schema-v7 validator confirmed source ordering and dedup, development ordering and category enums, relationship slug coverage, KPI-overlay rules and headshot existence on disk for all three dossiers.

## [v04.45r] — 2026-09-03 03:38:59 PM EST

> **Prompt:** "Picking up from my last session, run Phase B1 of repository-information/PROFILER-COVERAGE-PLAN.md on
> Fable 5.1 High as a fresh session: Southern Company (Georgia Power) and Entergy. Phase A is closed; this is
> the first Phase B session, it is data-only (no page change), and it lands two utility dossiers and two study
> guides in one push commit.
>
> READ FIRST, before writing anything: 1. repository-information/SESSION-CONTEXT.md (the A4 entry — the
> sequencing-during-agent-waits pattern, the environment notes including the exact Playwright stub shape and
> the blocked hosts, and the xhigh verdict); 2. PROFILER-COVERAGE-PLAN.md §2 (model rule — Phase B is Fable
> 5.1 High; Opus 5 xhigh only if the weekly cap binds, recorded in §8), §4 (Phase B — why the utilities run
> here), §7 (what every session owes) and the `southern-company` and `entergy` rows in §8; 3.
> .claude/rules/profiler-app.md — Profiler Command (two parallel research subagents per company, first-party
> exhaustive then third-party, ~50–70 sources each, products & services as the priority section), Profiler
> Prep Command (technology curriculum, high-school-STEM baseline, never company trivia), Scheduled Refreshes
> (both are public — researched nextReport rows); 4. repository-information/PROFILER-SCHEMA.md (profile
> schema v7, study schema v2, the `utility` category row, concepts registry, calendar schema); 5.
> repository-information/PROFILER-STYLES.md — active style is intel-briefing; 6. CLASSROOM-CURRICULUM-PLAN.md
> §3.5 (`how-a-utility-buys`) and §6 row G5, so the guides carry what that lesson will pin as its second and
> third public sources; 7. dominion-energy.profile.json and dominion-energy.study.json — the utility exemplar
> and the guide that already teaches the revenue-requirement equation, the IRP → CPCN → RFP chain, the rate
> case, the large-load tariff and PJM; the B1 guides must teach each utility's own regulatory story against
> that chain and not duplicate it.
>
> THE TASK: `profiler Southern Company` then `profiler prep Southern Company`, then `profiler Entergy` then
> `profiler prep Entergy`, one push commit. Dossiers: slugs `southern-company` (NYSE: SO; treat Georgia Power
> as the operating subsidiary the AI story runs through, with Alabama Power and Mississippi Power in scope
> where sourced) and `entergy` (NYSE: ETR; Entergy Louisiana, Arkansas, Mississippi, Texas and New Orleans),
> category `utility`, profileVersion 1, all prose in intel-briefing style with confidence-tagged key
> judgments. Research priorities, Southern: Georgia Power's most recent IRP and the capacity it was certified
> to build or buy (gas, storage, nuclear uprates, PPAs), the Georgia PSC's large-load rules and the
> large-customer tariff terms (minimum bills, contract length, cost allocation), the data-center load
> pipeline as the company states it (committed vs. contracted vs. pipeline — keep them apart), the storage
> procurements and who won them, Vogtle's operating status, the PSC's composition and election politics as
> they bear on rates, FY2024, FY2025 and the latest interims vs consensus, decision makers with verified
> sources. Entergy: the four-jurisdiction footprint and which commission decides what, the Louisiana PSC
> approvals for the data-center campuses in its territory and the generation built for them (verify the
> plants, sizes, costs and who pays from the orders themselves, not press coverage), the large-load tariffs
> and the ratepayer-protection terms, storage and gas RFPs, the Arkansas and Mississippi large-load rules,
> FY2024, FY2025 and the latest interims vs consensus, decision makers. relationships[] resolve only to
> covered slugs (the hyperscalers a source names — Meta, Google, Microsoft, Amazon — plus Dominion,
> NextEra Energy Resources and any covered developer or EPC a source names — verify each from a source
> before writing it). Study guides: Southern — how a vertically integrated utility in an elected-commission
> state certifies a decade of load, and what Vogtle's history does to its risk appetite; Entergy — how a
> multi-jurisdiction holding company buys for one campus at a time, and what an order that names the
> customer looks like. Both with a where-it-fails section aligned to §5 row 1, {{term}} tooltips against
> the 224-entry registry (check terms AND aliases; the regulatory vocabulary — rate base, revenue
> requirement, rate case, docket, CPCN, IRP, RFP, large-load tariff, minimum demand charge, rider, prudence
> review, cost allocation, cross-subsidy, ELCC, RTO — already exists from A3), new shared concepts in
> profiler-concepts.json rather than local glossaries, and flashcards/quiz on how the process works, not
> company trivia.
>
> BOOKKEEPING, same commit: python3 scripts/sync-profiler-registry.py, python3
> scripts/build-profiler-graph.py, python3 scripts/check-profiler-study.py; two calendar rows (public —
> research each next earnings date, mark confirmed honestly, write the source and watch[]); README tree
> entries for both profile and study files and both study-prep folders; flip both §8 rows (Dossier → v1,
> Guide → ✓, with the repo version; record a model substitution only if one happened). CHANGELOG is at
> 97/100 — rotation is mandatory above 100 and may fire on this or the next push; budget for it. Do NOT
> re-run the §6 register checks — those are owed at the Phase B close.
>
> VERIFY BEFORE COMMITTING: sync-profiler-registry.py --check clean, check-profiler-study.py clean, both
> dossiers and both Study Guides render in Profiler.html via Playwright with zero page errors (mirror
> scripts/verify-profiler-roles.py's stub exactly, per the A4 notes), every relationships[] slug and every
> {{term}} resolving, the Utility chip counting 3. Data-only: no page or GAS file changes, no Profiler
> version bump — the Profiler page is an indirect affect. Normal Pre-Commit and Pre-Push checklists; bump
> the repo version on the push commit; push on a claude/* branch. If a tariff term, a plant or a figure
> cannot be sourced from a commission order, a filing or the utility's own IRP or release, leave it out and
> say so — a thinner dossier beats a fabricated line. And tell me at the end what, if anything, read
> visibly thinner than the four xhigh anchors, so I can judge the model rule for the rest of Phase B."

### Added
- **`live-site-pages/profiler-data/southern-company.profile.json`** — Southern Company (Georgia Power) dossier, schema v7, profileVersion 1, `utility`, intel-briefing: BLUF, seven confidence-tagged key judgments, a collection-gap statement and dated INDICATORS TO WATCH. Eight product lines (regulated service and the large-load contracting framework; the December 2025 all-source certification; the utility-owned BESS program and the 500 MW storage RFP; the nuclear fleet and Vogtle; transmission and the DOE loan guarantees; Alabama Power and Mississippi Power; Southern Power; Southern Company Gas), seven banded spec groups verbatim from the PSC releases, the Rules and Regulations for Electric Service, the 8-Ks and the earnings decks, FY2024–Q2 2026 vs tracker consensus with the contracted-load ladder as a physical KPI, 51 developments, eight relationships (OpenAI, Tesla, Burns & McDonnell, Wärtsilä, Microsoft, Meta, NextEra Energy Resources, Dominion), five policy exposures, twelve decision makers with twelve company headshots, **118 sources at 64% first-party**
- **`live-site-pages/profiler-data/entergy.profile.json`** — Entergy dossier, schema v7, profileVersion 1, `utility`, intel-briefing: seven key judgments and a collection-gap statement. Seven product lines (five operating companies and three formula rate plans; generation built for named customers in Louisiana, Arkansas and Mississippi; Texas generation and SETEX; the solar/storage RFP program; the nuclear fleet; the turbine exclusivity agreement and the MHI partnership; transmission, resilience and storm recovery), seven spec groups (the 10-K capability table, the retail-regulation table, the U-37425 and U-37882 terms, the Google contract as the Arkansas Democrat-Gazette read it, the Mississippi pre-certified plants, the exclusivity agreement), FY2024–Q2 2026 vs three trackers' divergent consensus, 47 developments, four relationships (Meta, Google, Amazon, Dominion), five policy exposures, eleven decision makers with eleven headshots, **94 sources at 56% first-party**
- **`live-site-pages/profiler-data/southern-company.study.json`** — schema v2, 15 sections: the elected commission; who decides in Georgia (no RTO row); its own grid; the pipeline in tranches (`callout`); certifying a decade; the large-load rule vs GS-5 (`table`); the freeze and the fuel line; Vogtle and the risk appetite (`timeline`); four channels (`table`); who picks the battery (`proscons`); gigawatts on the Georgia clock (`bars`); where Southern slots in; `where-it-fails` aligned to §5 row 1; 14 flashcards; 10-item quiz. 109 `{term}` spans, no local glossary
- **`live-site-pages/profiler-data/entergy.study.json`** — schema v2, 15 sections: one parent, five utilities; four commissions and a council (`table`); the formula rate plan worked once (`callout`); MISO South; buying for one campus; anatomy of an order that names the customer (`table`, U-37425 vs U-37882 clause by clause); who pays when the customer pays (`proscons`); storms and securitization; three states, three campuses (`table`); the turbine slot; megawatts on the Entergy clock (`bars`); where Entergy slots in; `where-it-fails`; 14 flashcards; 10-item quiz. 111 `{term}` spans
- **`repository-information/study-prep/southern-company/southern-company-lesson-plan.md`** and **`repository-information/study-prep/entergy/entergy-lesson-plan.md`** — five modules each plus a ten-question self-test, both assuming the Dominion plan as prerequisite
- **27 shared concepts** in `profiler-concepts.json` (224 → 251): `AFUDC`, `balancing authority`, `capacity factor`, `CECPN`, `construction monitoring`, `cost cap`, `CWIP`, `demand charge`, `elected commission`, `ESA`, `energy charge`, `formula rate plan`, `fuel clause`, `holding company`, `interruptible`, `load factor`, `MISO`, `MTEP`, `nuclear uprate`, `planning reserve margin`, `PRA`, `rate freeze`, `regulatory lag`, `retail choice`, `securitization`, `SEEM`, `self-build`; `simple cycle` gains the `peaker` aliases
- **23 company-published headshots** in `live-site-pages/images/execs/` (12 Southern, 11 Entergy)
- **Two calendar rows** in `profiler-refresh-calendar.json` (54 → 56): `southern-company` nextReport 2026-10-29 and `entergy` 2026-11-04, both `confirmed: false` (tracker dates; neither company had announced), with sources and watch[]

### Changed
- `profiler-companies.json` — two `utility` entries after Dominion (93 → 95 companies; the Utility chip counts 3) with domains for the registry's provenance tiers; synced (`--check` clean)
- `profiler-graph.json` rebuilt: 540 → 555 edges, 12 curated on the two new slugs
- `README.md` — tree entries for both profile and study files and both study-prep folders; execs count 188/49 → 211/51
- `PROFILER-COVERAGE-PLAN.md` §8 — both B1 rows flipped to `v1 · v04.45r` / `✓ · v04.45r`; model as planned (Fable 5.1 High), no substitution

### Notes
- Data-only: no page or GAS change, no Profiler version bump; the Profiler page is an indirect affect
- Verified: registry `--check` clean, graph rebuilt, study checker clean (68 guides, 251 concepts), a local schema-v7 validator clean on both files, and Playwright on localhost with the `verify-profiler-roles.py` stub (accounts.google.com fulfilled with an empty script) — nine tabs on each dossier, 8 + 4 curated relationship cards with resolved sources, both guides with 15 sections and every tooltip resolving on hover, zero page errors, zero console errors
- Left out for want of a source, and said so in each dossier: Georgia's minimum-bill percentages and the rule's formal citation; the eleven PPA counterparties in the December 2025 certificate; the combined-cycle turbine OEM at Bowen, Wansley and McIntosh; Vogtle 3–4 capacity factors; the contracted megawatts in every Entergy ESA (redacted); the LPSC U-37425 order text (terms rest on the company's filings and the intervenors' quotations); the Entergy turbine OEM/EPC for all but two units; any battery supplier on an Entergy-owned project; a Georgia Power–Google relationship (no explicit source); the Entergy–NextEra Energy Resources joint development agreement and a FERC show-cause alert (no verifiable URL)
- Blocked hosts this session: selc.org, georgiarecorder.com, datacenterdynamics.com, insideclimatenews.org, wabe.org, alabamareflector.com, lailluminator.com, arkansasonline.com, cnbc.com, mississippitoday.org, businesswire.com, spglobal.com, moodys.com, linkedin.com (999), zacks.com, nasdaq.com (503), interchange.puc.texas.gov (503), tdworld.com (404 on the given path); the four subagents exhausted the session's 200-call web-search budget, so the last gap-fills were curl-only
- CHANGELOG `Sections: 97/100` → `98/100`; rotation not yet due

## [v04.44r] — 2026-09-03 02:05:31 PM EST

> **Prompt:** "Picking up from my last session, run Phase A4 of repository-information/PROFILER-COVERAGE-PLAN.md on
> Fable 5.1 xhigh as a fresh session: Vicor. This is the last of the four anchor sessions, it is data-only
> (no page change), and because it ends Phase A it also owes the phase-end register re-check.
>
> READ FIRST, before writing anything: 1. repository-information/SESSION-CONTEXT.md (the A3 entry — the
> sequencing-during-agent-waits pattern, the in-rack concept chain to pre-draft, and the environment notes:
> pip install playwright, git fetch origin main before the rebase check, ignore the stop hook's first prompt
> while the agents run); 2. PROFILER-COVERAGE-PLAN.md §2 (model rule), §3 (Phase A — the Vicor row and why it
> anchors `inside-the-rack` and the battery side of `the-800-vdc-shift`), §7 (what every session owes,
> including the phase-end register checks) and the `vicor` row in §8; 3. .claude/rules/profiler-app.md —
> Profiler Command (two parallel research subagents, first-party exhaustive then third-party, ~50–70 sources,
> products & services as the priority section), Profiler Prep Command (technology curriculum, high-school-STEM
> baseline, never company trivia), Scheduled Refreshes (the calendar row — Vicor is public, so a researched
> nextReport); 4. repository-information/PROFILER-SCHEMA.md (profile schema v7, study schema v2, concepts
> registry, calendar schema); 5. repository-information/PROFILER-STYLES.md — active style is intel-briefing;
> 6. CLASSROOM-CURRICULUM-PLAN.md §3.3 (`inside-the-rack` and `the-800-vdc-shift` lesson specs), §5 rows 9–11
> (server PSU, the 48 V bus and the last centimetre, 800 VDC distribution) and §6 row G9, so the study guide
> carries what those lessons will need to pin; 7. delta-electronics.study.json, megmeet.study.json and
> liteon.study.json — the three guides that teach the rack chain today, so the Vicor guide is the
> point-of-load silicon's view of the same chain and does not duplicate them.
>
> THE TASK: `profiler Vicor` then `profiler prep Vicor`, one push commit. Dossier: slug `vicor`, category
> supplier, NASDAQ: VICR, profileVersion 1, all prose in intel-briefing style with confidence-tagged key
> judgments. Research priorities: the product lines for the AI rack — factorized power (PRM regulators and
> VTM/MCM current multipliers), the 800 V / 48 V bus converter modules (BCM, NBM, the ChiP packaging), the
> lateral and vertical power-delivery (LPD/VPD) parts for the last centimetre, the DCM and PFM front ends, and
> the licensing program — with concrete specs (voltage ranges, current density, efficiency, package sizes)
> from Vicor's own datasheets; then the Delta Electronics patent litigation (the ITC investigation and the
> district-court cases, their status and any licensing outcome), the trailing 18 months of hyperscaler and
> AI-rack design-win and licensing news, the Andover fab and capacity, FY2024, FY2025 and the latest interims
> vs consensus, decision makers with verified sources, and a relationships[] set that resolves only to covered
> slugs (Delta Electronics, NVIDIA, Megmeet, LITEON, Infineon-adjacent names in the corpus, and any hyperscaler
> a source names — verify each from a source before writing it). Study guide: the in-rack conversion chain —
> why loss is I²R and voltage climbs, the 48 V bus and the 60 V safety line, why regulation and transformation
> are separated (factorized power), current multiplication and the sine-amplitude converter idea, the last
> centimetre at about one volt and why the converter moves onto the substrate, vertical versus lateral power
> delivery, 800 VDC → 48 V → point-of-load, the BBU shelf on the DC bus, hold-up and ORing — with a
> where-it-fails section aligned to §5 rows 9–11, {{term}} tooltips for everything the 193-entry concepts
> registry holds (check terms AND aliases; 800 VDC, DC-DC converter, power shelf, VRM, BBU, hold-up time,
> CRPS, GaN, SiC already exist), new shared concepts registered in profiler-concepts.json rather than the
> guide's local glossary, and flashcards/quiz on how the technology works, not company trivia.
>
> BOOKKEEPING, same commit: python3 scripts/sync-profiler-registry.py, python3 scripts/build-profiler-graph.py,
> python3 scripts/check-profiler-study.py; a calendar row (public — research the next earnings date, mark
> confirmed honestly, write the source and watch[]); README tree entries for vicor.profile.json,
> vicor.study.json and study-prep/vicor/; flip the vicor row in PROFILER-COVERAGE-PLAN.md §8 (Dossier → v1,
> Guide → ✓, with the repo version). THEN, because A4 ends Phase A: re-run every §6 register check in
> CLASSROOM-CURRICULUM-PLAN.md against the corpus and date the results — G2 (Caterpillar), G3 (Piller), G5
> (Dominion) and G9 (Vicor) should move; leave G6, G11 and G12 as the register judges them, and do not touch
> Phase B or C rows.
>
> VERIFY BEFORE COMMITTING: sync-profiler-registry.py --check clean, check-profiler-study.py clean, the
> dossier and the Study Guide render in Profiler.html via Playwright with zero page errors, every
> relationships[] slug and every {{term}} resolving. Data-only: no page or GAS file changes, no Profiler
> version bump — the Profiler page is an indirect affect. Normal Pre-Commit and Pre-Push checklists; bump the
> repo version on the push commit; push on a claude/* branch. If a product or spec cannot be sourced from
> Vicor's own datasheets, a filing or a court or ITC document, leave it out and say so — I would rather a
> thinner dossier than a fabricated line. And tell me at the end what xhigh visibly bought across all four
> anchors, so I can decide whether to demote Phase B to High."

**Phase A4 of the Profiler coverage plan — the fourth and last anchor company, run on Fable 5.1 xhigh as a dossier + study-guide pair in one commit, and the Phase A close.** Gives Classroom gap register row G9 its 800 VDC silicon half: `inside-the-rack` and `the-800-vdc-shift` can now pin `study:vicor` for I²R and the climbing voltage, the 48 V bus and the 60 V line, factorized power, current multiplication and the sine-amplitude converter, the last centimetre and vertical versus lateral delivery, the 800 VDC → 48 V → point-of-load chain, and the BBU and supercapacitor shelves on the DC bus — the point-of-load silicon's view of the chain that the Delta, LITEON and Megmeet guides teach from the shelf's side. Every §6 register check was re-run and dated at the phase end.

### Added

- **`live-site-pages/profiler-data/vicor.profile.json`** — Vicor Corporation (Andover, MA; NASDAQ: VICR), `supplier`, schema v7, profileVersion 1, intel-briefing prose (BLUF summary, seven confidence-tagged key judgments, a collection-gap statement and a dated INDICATORS TO WATCH bullet). **Ten product lines** with all four depth fields — the Factorized Power Architecture (PRM regulators + VTM current multipliers, the Sine Amplitude Converter), Power-on-Package and vertical power delivery (MCM/MCD ChiP-sets, GCM/GTM, the 2nd-generation VPD that exists on first-party channels only as CEO sentences), BCM isolated bus converters (800 V and 400 V to 48 V), NBM bidirectional 48 V ↔ 12 V converters, DCM regulated converters, PFM AC-DC front ends and ZVS bucks, the IP licensing practice, automotive 48 V, aerospace/defense and Brick Products, and the ChiP packaging platform with the Andover fab; **seven banded spec groups** quoted verbatim from Vicor datasheets and family overviews (VTM48EF012, MCM4609 ChiP-set and VPD examples, BCM4414 800 V, BCM6135 384 V and automotive 800 V, NBM2317, DCM3717/3735, ChiP/fab); financials FY2024–Q2 2026 vs tracker consensus with `kpi: revenue` on both annual periods; **34 developments** (the two ITC investigations, the $45M settlement, the May 2026 all-inclusive OEM licence, the SynQor payment, the July 2026 trade-secret counter-suits, three NVIDIA 800 VDC partner lists without Vicor); four relationships (Delta Electronics as competitor via the ITC record; NVIDIA, Google and Tesla as historical customers on SemiAnalysis's account); two policy exposures (Section 337 as complainant; CHIPS Act §48D credits); twelve decision makers from the officers page and 2026 proxy; **136 sources at 57% first-party** (70 first-party URLs incl. 11 datasheets/PDFs and the 10-K/10-Q/proxy/8-K exhibits; 78 third-party incl. the ITC's own Federal Register notices via govinfo, CourtListener and PacerMonitor dockets, the First Circuit opinion, NVIDIA's partner blogs, call transcripts and consensus trackers)
- **`live-site-pages/profiler-data/vicor.study.json`** — schema v2, **17 sections**: the last centimetre (prose); amps per kilowatt at each voltage (`bars`); the sixteen-to-one arithmetic (`callout`); the 48 V bus and the 60 V line; two jobs in one box — two-stage vs direct vs factorized (`table`); current multiplication and the sine-amplitude idea; the PDN at one volt; lateral vs vertical (`proscons`); the 800 V → 48 V → chip chain (`table`); the battery on the DC bus; living on a shared bus — ORing, precharge, sharing, hold-up (`callout`); where Vicor's products slot in (`table`); amps per package (`bars`); who buys, who competes and the licence; `where-it-fails` aligned to §5 rows 9–11; 14 flashcards; 11-item quiz. 91 `{{term}}` spans over the registry, no local glossary
- **`repository-information/study-prep/vicor/vicor-lesson-plan.md`** — five modules (current squared; factorized power and the multiplier; the last centimetre and vertical delivery; 800 V to the chip and the battery on the bus; Vicor against the chain — catalogue, fab, licence, who buys, who competes) plus a ten-question self-test
- **30 shared concepts in `live-site-pages/profiler-data/profiler-concepts.json`** (193 → 224, alphabetical, no term/alias collisions): `buck converter`, `bus converter`, `conversion efficiency`, `current density`, `current multiplier`, `current sharing`, `design win`, `factorized power`, `galvanic isolation`, `hot-swap`, `I²R loss`, `inrush`, `intermediate bus`, `IP licensing`, `lateral power delivery`, `load transient`, `ORing`, `PDN`, `point of load`, `power density`, `precharge`, `PWM`, `Section 337`, `SELV`, `sine amplitude converter`, `soft switching`, `substrate`, `switching frequency`, `thermal resistance`, `vertical power delivery`, `voltage regulation`
- **Eleven company-published headshots** in `live-site-pages/images/execs/vicor-*.jpg` (Vicor corporate-officers page; resized; no photoCredit needed) — D'Amico has no headshot on the officers page and renders as an initials avatar

### Changed

- **`live-site-pages/profiler-data/profiler-companies.json`** — Vicor registry entry (tagline, HQ Andover, ticker NASDAQ: VICR, domains `vicorpower.com` · `vicorcorporation.gcs-web.com`), inserted after Vertiv; denormalized fields synced (`srcTotal` 136, `srcFirstPct` 57, `kpiNorm` true)
- **`live-site-pages/profiler-data/profiler-graph.json`** — rebuilt: 528 → 540 edges (415 curated); 12 edges touch `vicor` — the four curated plus derived-only mentions of ABB, Eaton, GE Vernova, Hitachi Energy, LITEON, Megmeet, Schneider Electric and Vertiv arising from the dossier's own NVIDIA-partner-list prose
- **`repository-information/profiler-refresh-calendar.json`** — Vicor row appended: `nextReport` 2026-10-20 / `confirmed: false` (no company announcement as of 2026-09-03; trackers split Oct 20 vs Oct 27; Oct 20 matches the 8-K cadence) with a nine-item `watch[]`; `updated` → 2026-09-03
- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — §8 row A4 flipped: Dossier `v1 · v04.44r`, Guide `✓ · v04.44r`
- **`repository-information/CLASSROOM-CURRICULUM-PLAN.md`** — §6 gap register re-run in full at the Phase A close and dated: G2, G3, G5 and G9 moved Open → **Partial** (each anchor closes one half of its row and names the scheduled second half — C1, the Vertiv/Schneider revisions, B1–B2, the Narada backfill); G4, G6, G7, G8 and G10 re-checked and unchanged; G11 and G12 dated as the register judges them; a "where the register stands after Phase A" paragraph added and the intro's verification sentence extended
- **`README.md`** — tree entries for `vicor.profile.json`, `vicor.study.json` and `study-prep/vicor/`; execs count 177/48 → 188/49; `Last updated:` and repo version
- **`repository-information/repository.version.txt`** — `v04.43r` → `v04.44r`

### Notes

- **Research vehicle** — two parallel `general-purpose` subagents on the two-stage Source Priority Protocol: Agent A (first-party) read 70 Vicor URLs in ~24 minutes — Vicor's IR host (`vicorcorporation.gcs-web.com`) returned 403/503 throughout, so every results release was read from Vicor's own SEC 8-K Exhibit 99.1 copy and one from the company's GlobeNewswire wire copy; Agent B (third-party) evaluated 78 sources in ~21 minutes — usitc.gov, federalregister.gov HTML, Justia and Nasdaq were blocked, so the ITC record came from govinfo's Federal Register text and the Federal Register API, the dockets from CourtListener via curl and PacerMonitor
- **Left out for want of a source, as the plan requires:** no datasheet, part number, package size or A/cm² figure for the 2nd-generation VPD (first-party references are CEO sentences only — carried as such); no 800 V-input regulated DCM (none exists); no datasheet weight for the automotive BCM6135 (Vicor's own pages say 58 g and 65 g); no licensee, settlement counterparty or lead VPD customer name (none in any primary source — the Cerebras inference is labeled as trade-press inference); no Vicor account of the 337-TA-1484 respondents (its filings never describe the ITC cases); no LinkedIn URLs; no `mw`/`gwh` KPIs. Megmeet and LITEON were **declined as relationships** — no source states a Vicor–Megmeet or Vicor–LITEON link beyond their presence on partner lists Vicor is absent from; Infineon, MPS, AMD, Cerebras, Quanta, Wistron, Wiwynn and Foxconn are not covered slugs
- **Verification** — `sync-profiler-registry.py --check` and `build-profiler-graph.py --check` clean; `check-profiler-study.py` 0 errors / 0 warnings over 66 guides and 224 concepts; a local schema-v7 validator (canonical development categories, relationship slugs and types, policy statuses, spec bands, KPI overlay rules, source ordering) 0 errors / 0 warnings; Playwright (localhost, GAS whoami stubbed as admin, Google sign-in loader stubbed) — nine dossier tabs, four relationship chips with resolved sources, the Study Guide with 17 sections and 91 resolving tooltips, **zero page errors and zero console errors**; the 11 headshots checked on a contact sheet
- **Data-only** — no page or GAS file changed; no Profiler version bump; the Profiler page is an indirect affect. Phase A is closed; the next §6 register re-run is owed at the close of Phase B

## [v04.43r] — 2026-09-03 05:23:31 AM EST

> **Prompt:** "Picking up from my last session, run Phase A3 of repository-information/PROFILER-COVERAGE-PLAN.md on
> Fable 5.1 xhigh as a fresh session: Dominion Energy. This is the third of four anchor sessions and the
> only one in the program that changes a page, so do the pair properly and add the category cleanly.
>
> READ FIRST, before writing anything: 1. repository-information/SESSION-CONTEXT.md (the A2 entry — the
> sequencing-during-agent-waits pattern and the utility concept chain to pre-draft); 2. PROFILER-COVERAGE-PLAN.md
> §2 (model rule), §3 (Phase A — the Dominion row and why it anchors `how-a-utility-buys`), §7 (what every
> session owes, including the `utility` category paragraph) and the `dominion-energy` row in §8;
> 3. .claude/rules/profiler-app.md — Profiler Command (two parallel research subagents, first-party exhaustive
> then third-party, ~50–70 sources, products & services as the priority section), Profiler Prep Command
> (technology curriculum, high-school-STEM baseline, never company trivia), Scheduled Refreshes (the calendar
> row — Dominion is public, so a researched nextReport); 4. repository-information/PROFILER-SCHEMA.md (profile
> schema v7, study schema v2, concepts registry, calendar schema, and the registry `categories` row you will
> extend); 5. repository-information/PROFILER-STYLES.md — active style is intel-briefing; 6. .claude/rules/html-pages.md
> (the Profiler.html version bump, meta tag, page changelog) and .claude/rules/changelog-security.md (the page
> changelog is public); 7. CLASSROOM-CURRICULUM-PLAN.md §5 row 1 (Interconnection) and §6 row G5, so the study
> guide carries what `how-a-utility-buys` will need to pin; 8. the guidance modules' 30 Dominion mentions
> (grep Profiler.gs) so the public guide teaches what is today only visible to contributor and above.
>
> THE CATEGORY, same commit: add `utility` to profiler-companies.json's `categories` array (after `ipp`), to
> PROFILER-SCHEMA.md's registry table and intro list, and to Profiler.html — chip label, `.ov-tag` colour,
> `known` list, compare peer groups, OV_REL_CAT_COLORS — with a Profiler page bump v01.80w → v01.81w, the
> build-version meta tag, a public-safe entry in live-site-pages/html-changelogs/Profilerhtml.changelog.md, the
> README tree version display, and scripts/verify-profiler-roles.py still passing. Do NOT file Dominion under
> `ipp` or `other` to avoid the change.
>
> THE TASK: `profiler Dominion Energy` then `profiler prep Dominion Energy`, one push commit. Dossier: slug
> `dominion-energy`, categories `utility`, NYSE: D, profileVersion 1, all prose in intel-briefing style with
> confidence-tagged key judgments. Research priorities: how Dominion Energy Virginia serves data-center load —
> the contracted and pipeline data-center capacity (the GW figures and their dates), the GS-5 large-load rate
> class and its minimum-demand and contract terms from the 2024–2025 SCC biennial review, the 2025 IRP and its
> gas, storage, nuclear and offshore-wind build plan (Chesterfield Energy Reliability Center, CVOW, the North
> Anna SMR work with Amazon), the interconnection and transmission constraints in Loudoun and the PJM capacity
> and transmission-planning exposure, then FY2024, FY2025 and the latest interims vs consensus, the trailing 18
> months of data-center-related orders, filings and dockets, decision makers with verified sources, and a
> relationships[] set that resolves only to covered slugs (Amazon, Microsoft, Google, Meta, Equinix, QTS,
> Vantage, Aligned, STACK Infrastructure and GE Vernova are the likely ones — verify each from a source
> before writing it). Study guide: the regulated-procurement concept chain — rate base and cost of service,
> IRP → CPCN → RFP, the rate case and the docket, large-load tariffs and minimum-demand contracts, interconnection
> studies and cost allocation, PJM capacity and transmission planning, why a utility's clock is measured in
> years — with a where-it-fails section aligned to §5 row 1, {{term}} tooltips for everything the 162-entry
> concepts registry holds (check terms AND aliases; IRP, large-load tariff, interconnection queue, PJM already
> exist), new shared concepts registered in profiler-concepts.json rather than the guide's local glossary, and
> flashcards/quiz on how the system works, not company trivia.
>
> BOOKKEEPING, same commit: python3 scripts/sync-profiler-registry.py, python3 scripts/build-profiler-graph.py,
> python3 scripts/check-profiler-study.py, python3 scripts/verify-profiler-roles.py; a calendar row (public —
> research the Q3 2026 results date, mark confirmed honestly, write the source and watch[]); README tree entries
> for dominion-energy.profile.json and dominion-energy.study.json; flip the dominion-energy row in
> PROFILER-COVERAGE-PLAN.md §8 (Dossier → v1, Guide → ✓, with the repo version). Do NOT re-run the §6 register
> checks — that happens at the end of Phase A, after A4.
>
> VERIFY BEFORE COMMITTING: sync-profiler-registry.py --check clean, check-profiler-study.py clean,
> verify-profiler-roles.py passing, the `utility` chip filtering the roster and the dossier and Study Guide
> rendering in Profiler.html via Playwright with zero page errors, every relationships[] slug and every {{term}}
> resolving. Normal Pre-Commit and Pre-Push checklists; bump the repo version on the push commit; push on a
> claude/* branch. If a figure cannot be sourced from Dominion's own pages, a filing or an SCC docket, leave it
> out and say so — I would rather a thinner dossier than a fabricated line."

**Phase A3 of the Profiler coverage plan — the third anchor company, run on Fable 5.1 xhigh as a dossier + study-guide pair in one commit, and the program's only page change: a `utility` category.** Gives Classroom gap register row G5 its first public source: the `how-a-utility-buys` lesson can now pin `study:dominion-energy` for the regulated-procurement chain — rate base and cost of service, IRP → CPCN → RFP, the rate case and the docket, the large-load tariff and its minimum-demand arithmetic, the load-interconnection study, PJM's capacity auction and regional plan — which until now existed only inside the contributor-gated utility-procurement guidance module.

### Added

- **`live-site-pages/profiler-data/dominion-energy.profile.json`** — Dominion Energy, Inc. (NYSE: D; Richmond, VA), `utility`, schema v7, profileVersion 1, intel-briefing prose (BLUF summary, seven confidence-tagged key judgments plus a dated INDICATORS TO WATCH bullet, collection gap stated). **Eight product lines** with all four depth fields — regulated retail service and the GS-5 large-load class (25 MW / 75 % load factor; 85 % T&D and 60 % generation minimums; 14-year term as a four-year ramp plus ten; exit fees; enhanced collateral up to 60 % of minimum charges; effective January 1, 2027); the large-load interconnection ladder (SELOA → CLOA → ESA) with the contracted-capacity series July 2023 → July 2026 (16.5 → 21.4 → 40.2 → 47.1 → 48.5 → 51.0 → 53.8 GW, with the firm ESA tranche at 12.0 GW) and connections per year; the gas program (Chesterfield Energy Reliability Center 944 MW / ~$1.5B / 2029, certified, suspended, reinstated and appealed to the Supreme Court of Virginia; 6.5 GW with turbines secured; the 2026 Dispatchable Generation RFP); solar, storage and renewable procurement (the annual PPA and Acquisition RFPs, the October 2025 petition and April 2026 approvals, $2.0B of storage capital, the April 2026 statute's 4.0 GW by 2030 / 16.0 GW by 2045); transmission (the Loudoun Reliability Loop's three dated lines, Morrisville–Wishing Star, Line 514, the 765 kV backbone, the Heritage–Mosby ±525 kV HVDC award); Coastal Virginia Offshore Wind (2.6 GW, 176 Siemens Gamesa turbines, $11.65B, 81 % complete, final turbine year-end 2027); the nuclear fleet and North Anna SMR work (Rider SMR, the Amazon MOU, the July 2026 ESP renewal); Dominion Energy South Carolina and Contracted Energy — and **seven banded spec groups** quoted verbatim (GS-5 terms, the contracted-capacity ladder, CVOW, CERC, the transmission program, the 2025 IRP Update's preferred plan, the system and plan snapshot). Financials FY2024, FY2025, Q1 2026 and Q2 2026 each with the consensus and verdict (Investing.com, Zacks, LSEG via Reuters), the contracted-capacity reading per period, `kpi: revenue` on both annual periods ($14,459M; $16,506M). **38 developments** (February 2025 – September 3, 2026, today's merger vote first), **nine curated relationships** (Amazon's SMR MOU; Microsoft, Google and Meta as GS-5-class customers and Rider T-1 intervenors; Equinix, STACK Infrastructure and Vantage as Dominion-served campuses; Siemens Energy as CVOW's turbine supplier through Siemens Gamesa; NextEra Energy Resources as the subsidiary of the acquirer), **six policy exposures** (the PJM capacity market at its cap two years running; Virginia's GS-5 / Rider T-1 direct-assignment / HB 1393 / consumption-tax regime; federal offshore-wind policy and tariffs on CVOW; the VCEA and the April 2026 storage statute; FERC's PJM co-location order; the merger approvals), six decision makers with company-published headshots (no LinkedIn URLs), **123 sources at 48 % first-party**, newest first, undated pages last
- **The headline neither brief anticipated** — Dominion agreed on May 15, 2026 to an all-stock combination with NextEra Energy (0.8138 NEE shares plus a pro rata share of $360M cash per share; NEE 74.5 % / D 25.5 %; close expected 2H 2027; SCC hearing November 17, 2026), with the Dominion shareholder vote on the session date. It is the BLUF's second clause, a key judgment ("changes the buyer more than the docket"), a relationship, a policy exposure and the calendar row's caveat
- **`live-site-pages/profiler-data/dominion-energy.study.json`** — schema v2, **17 sections** on the guidance engine: the utility as gatekeeper; the monopoly bargain with the revenue-requirement equation and the $47M-on-$1B arithmetic; who decides what (`table`: commission, RTO, FERC, legislature, utility); from plan to plant (`timeline`, nine steps on three lanes); IRP / CPCN / RFP as three documents, three questions (`table`); the rate case and the docket; anatomy of a large-load tariff (`table`, seven terms with what each protects against); the minimum-demand arithmetic worked once (`callout`); interconnecting a load and why the date moves; who pays for the wires (`proscons`: cost-causation vs socialization); PJM's capacity auction, ELCC accreditation and the regional plan; why the clock is years (`bars`, nine durations); where Dominion's programs slot in (`table`, nine links with dated instances); gigawatts on the clock (`bars`, eleven company figures from 0.16 GW of owned storage to 70 GW of requests); a `where-it-fails` warn `callout` aligned to `CLASSROOM-CURRICULUM-PLAN.md` §5 row 1 (the date moves; the tariff nobody modelled; the certificate denied, delayed or conditioned; the rate case reprices the deal; the capacity price nobody in the state controls; the wires arrive after the load; sold to the wrong desk); 14 flashcards and a 10-item quiz on how the system works. 145 `{term}` spans over 50 distinct registry terms, checked against terms and aliases; no local glossary
- **`repository-information/study-prep/dominion-energy/dominion-energy-lesson-plan.md`** — the full-depth five-module lesson plan (the monopoly bargain and the equation; from plan to plant — the three documents; the rate case, the docket and the large-load tariff with the arithmetic by hand; interconnecting a load and the layer above the utility; Dominion against the chain — programs, ladder, who buys, who competes, and the change of owner), with pacing, per-module self-checks and a ten-question whole-plan self-test
- **31 shared concepts in `live-site-pages/profiler-data/profiler-concepts.json`** (162 → 193, alphabetical, no term/alias collisions): `allowed return`, `capacity market`, `coincident peak`, `cost allocation`, `cost of service`, `CPCN`, `cross-subsidy`, `dispatchable`, `docket`, `ELCC`, `FERC`, `high voltage`, `load forecast`, `minimum demand charge`, `prudence review`, `public utility commission`, `rate base`, `rate case`, `rate class`, `revenue requirement`, `RFP`, `rider`, `RTEP`, `RTO`, `SCC`, `SMR`, `stranded cost`, `substation`, `system impact study`, `VCEA`, `vertically integrated utility`
- **Six executive headshots** in `live-site-pages/images/execs/` (`dominion-energy-blue.jpg`, `-ridge`, `-baine`, `-arnett`, `-carr`, `-woomer`) — company-published photos from Dominion's executive-leadership page; no `photoCredit` needed
- **The `utility` category** — `profiler-companies.json`'s `categories` array (after `ipp`); `PROFILER-SCHEMA.md`'s intro list and registry row (with the category's definition and the rule that utilities are never filed under `ipp` or `other`); `live-site-pages/Profiler.html` v01.80w → **v01.81w**: `--ov-utl: #7fcfa0` and `.ov-tag.utility`, the `known` list in `ovSafeCat`, `ovCatLabel` → "Utility", a `Utilities` compare peer family in `OV_PEER_FAMILIES` (its own family, so it never widens a hardware or colocation comparison), and `utility` in `OV_REL_CAT_COLORS`; `<meta name="build-version">` synced; `Profilerhtml.version.txt` bumped; `Profilerhtml.changelog.md` gains a public-safe v01.81w section (`Sections: 48/50` → `49/50`); README tree version display updated

### Changed

- **`live-site-pages/profiler-data/profiler-companies.json`** — Dominion Energy registry entry (tagline, HQ Richmond, ticker NYSE: D, domains `dominionenergy.com` · `coastalvawind.com` · `s2.q4cdn.com` · `s205.q4cdn.com` · `cdn-dominionenergy-prd-001.azureedge.net`), inserted before DPR; denormalized fields synced (`srcTotal` 123, `srcFirstPct` 48, `kpiNorm` true)
- **`live-site-pages/profiler-data/profiler-graph.json`** — rebuilt: 519 → 528 edges (411 curated); nine edges touch `dominion-energy`, all curated
- **`repository-information/profiler-refresh-calendar.json`** — Dominion row appended as a public row: `nextReport` 2026-10-30 (a Friday, matching the October 31, 2025 cadence and both trackers), `confirmed: false` because Dominion had posted no Q3 2026 scheduling release as of the session date, the merger caveat in `source`, an eleven-item `watch[]`; `updated` → 2026-09-03
- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — §8 row A3 flipped: Dossier `v1 · v04.43r`, Guide `✓ · v04.43r`
- **`README.md`** — tree entries for `dominion-energy.profile.json`, `dominion-energy.study.json` and `study-prep/dominion-energy/`; the `images/execs/` count (177 images across 48 companies); Profiler version display v01.81w; `Last updated:` and repo version
- **`repository-information/repository.version.txt`** — `v04.42r` → `v04.43r`

### Notes

- **Research vehicle** — two parallel `general-purpose` subagents on the two-stage Source Priority Protocol: Agent A (first-party) evaluated 63 Dominion pages and documents in 20 minutes — the IR site's list pages are JS-rendered and its `/news` pagination is dead, so releases were located by search; the Q4 2024, Q3 2025, Q4 2025, Q1 2026 and Q2 2026 earnings decks (74–83 pages each) and the 255-page 2025 IRP Update were text-extracted and are the source of every contracted-capacity, connection, tariff-slide and plan figure; Agent B (third-party) evaluated ~75 URLs in 19 minutes — the SCC's releases and fact sheets, PJM's auction report, load forecast and board whitepaper, JLARC, SEC EDGAR (10-K, 10-Q, proxy, three VEPCO term sheets), consensus trackers, Utility Dive, Loudoun Now, ReisingerGooch, offshorewind.biz and others. Virginia Mercury, Inside Climate News, PEC, Data Center Dynamics, DEQ and FERC's own release all returned 403 and are not cited; Nasdaq and Zacks were bot-blocked
- **Left out for want of a source, as the developer asked:** the standalone Schedule GS-5 rate sheet (dollars per kW, collateral per MW, the ramp and notice mechanics — not among the published tariff PDFs; the 4-year/20 % ramp and three-year notice are attributed to secondary summaries and flagged as such); the SCC's final-order text for the biennial review and how it altered Dominion's proposed large-load terms; the 2024 RPS order's MW and any final order on the 2025 clean-energy petition beyond the April 2026 approvals; JLARC's peak-MW tables and PJM's DOM-zone MW rows; CERC's turbine OEM (a GE 7FA.05 attribution seen only in a search snippet was not used); an installed utility-owned storage fleet total; a founding year; **QTS, Aligned, GE Vernova, Hitachi Energy, Fluence, Tesla and Constellation are not in `relationships[]`** — no source names them with Dominion; Google's link rests only on its intervention in the Rider T-1 case and says so; a Federal Register NRC notice that neither agent read was dropped from the sources
- **Verification** — `sync-profiler-registry.py --check` and `build-profiler-graph.py` clean; `check-profiler-study.py` 0 errors / 0 warnings over 65 guides and 193 concepts; a local schema-v7 validator (scratchpad, not committed: canonical development categories, relationship slugs and sources, policy statuses, spec bands, KPI overlay rules, source ordering, photo paths) 0 errors; Playwright (localhost, stubbed backend, admin tier) showed the roster's `Utility` chip with a count of 1 filtering to the Dominion card, the `.ov-tag.utility` colour rendered, all nine dossier tabs and nine relationship chips, and the Study Guide with 17 sections, 4 tables, 2 pros/cons cards, 20 bars, a 9-item timeline and 142 resolving tooltip spans — zero page errors and no console error beyond the Google sign-in script the stub environment blocks; `verify-profiler-roles.py` passes the access matrix for all four tiers and the Technical Annex audit over all 92 dossiers, while its two guidance-progress-isolation assertions fail **identically on an unchanged checkout of `main`** (a pre-existing stub/page drift unrelated to this change — see the developer note)
- **Model note for the plan's xhigh test** — where the extra reasoning showed on A3: catching and re-verifying the NextEra acquisition from three sources before letting it reshape the BLUF; keeping the 53.8 GW headline and the 12.0 GW firm tranche apart everywhere they appear; treating the 2025 IRP Update's 2,000 MW of storage and the April 2026 law's 4.0 GW as a contradiction to teach rather than a figure to smooth; the guide's design (the equation before the documents, the tariff read as a list of the ways commissions have been burned, Dominion's numbers arriving only after the chain is taught); and source discipline (the unread Federal Register notice dropped, four relationships declined, the GS-5 ramp attributed to secondary sources). Research yield and schema compliance again looked no different from High
- **Register checks** in `CLASSROOM-CURRICULUM-PLAN.md` §6 deliberately not re-run (phase-end, after A4, per the plan)

## [v04.42r] — 2026-09-03 04:27:26 AM EST

> **Prompt:** "run Phase A2 of PROFILER-COVERAGE-PLAN.md — Piller — on Fable 5.1 xhigh"

**Phase A2 of the Profiler coverage plan — the second anchor company, run on Fable 5.1 xhigh as a dossier + study-guide pair in one commit.** Gives Classroom gap register row G3 its rotary/flywheel home: the `the-ups-room` lesson can now pin `study:piller` for static-versus-rotary-versus-diesel-rotary UPS, the battery-versus-flywheel store, and the isolated-parallel bus — none of which any guide in the corpus carried.

### Added

- **`live-site-pages/profiler-data/piller.profile.json`** — Piller Group GmbH (Piller Power Systems; Osterode am Harz; wholly owned by Langley Holdings plc), `supplier`, schema v7, profileVersion 1, intel-briefing prose (BLUF summary, six confidence-tagged key judgments plus a dated INDICATORS TO WATCH bullet, collection gap stated). **Ten product lines** with all four depth fields — SHIELDX Dynamic Power Stabilization; UB-V Series rotary UPS (1.0–3.24 MW per module, to 100 MW paralleled); UNIBLOCK UBT+ / UBTD+ DRUPS / DeRUPS; the Isolated Parallel bus; POWERBRIDGE kinetic storage (3.6–60 MJ+); Active Power CleanSource flywheel UPS (PLUS SMS/MMS, XT, HD, POWERHOUSE, GenSTART); CPM with flywheel; the M+ Series and APOSTAR static UPS with the APOTRANS static switch; frequency converters, 400 Hz ground power, naval power and the Grid series; service, lifecycle and rental — and **ten banded spec groups** with values quoted verbatim from Piller and Active Power product pages, brochures and datasheets (four Piller-authored datasheets read from distributor mirrors are flagged as such and carry an explicit `party: company`). Financials for a private, unit-level subsidiary: Langley Holdings FY2023, FY2024, FY2025 and H1 2026 with the Power Solutions division line and Langley's own guidance as the only expectations on record (no consensus exists — stated), plus the one Piller-level figure in the public record (2025 revenue €332M, +28%, per the Northeim chamber of commerce) carried as the normalized `kpi: revenue` at the researched 2025 EUR/USD average (1.1296, cited). **23 developments** (February 2025 – August 2026, with the June 2024 M+500 launch kept as the strategic pivot), **nine curated relationships** (Crusoe and Nebius as SHIELD-X / CleanSource customers, Tesla as a CleanSource customer and Megapack rival, Caterpillar's historical Cat UPS distribution of Active Power flywheels, Bloom Energy's reported displacement of the engine plan at Vineland, and Vertiv, Schneider Electric, Eaton and ABB as static-UPS competitors), **three policy exposures** (US tariffs on German-built equipment under the Section 232 derivatives regime and the EU–US 15% ceiling; US stationary-engine and local air-permit rules including the Vineland NJDEP finding; the EU Medium Combustion Plant Directive), five decision makers from company releases and Companies House (no LinkedIn URLs, no photos), **185 sources at 64% first-party** — the high share is a stated caution, not a credential — newest first, undated product literature last
- **`live-site-pages/profiler-data/piller.study.json`** — schema v2, **15 sections** on the guidance engine: who owns the seconds; the IEC 62040-3 grades as a `table`; battery versus flywheel as `proscons` with the energy-versus-power arithmetic; the anatomy of a static UPS and of a rotary UPS; the diesel on the shaft (DRUPS); static versus rotary as a nine-row `table`; the stiff source and fault current; redundancy topologies from 2N to the isolated-parallel ring as a `table`; the swinging load and the island; a product-mapping `table` and a single-unit-then-system `bars` ladder from the dossier; a `where-it-fails` warn `callout` aligned to `CLASSROOM-CURRICULUM-PLAN.md` §5 row 6 (load on bypass, eco-mode detection, modules below their sweet spot) extended with the rotary family's own failures (the engine that does not start inside the flywheel's seconds, the shared ring, bearings); 14 flashcards and a 10-item quiz — all on how the technology works, no company trivia. 131 `{term}` spans over 58 distinct registry terms, checked against terms and aliases; no local glossary
- **`repository-information/study-prep/piller/piller-lesson-plan.md`** — the full-depth five-module lesson plan (the seconds and the classification; chemistry versus spinning steel with the 15 MJ ≈ 4.2 kWh arithmetic; static, rotary and DRUPS anatomy with a comparison table; topologies, the isolated-parallel ring and the stiff source; the catalogue against the chain, the ladder, who buys and who competes, why the transition matters), with pacing, per-module self-checks and a whole-plan self-test
- **24 shared concepts in `live-site-pages/profiler-data/profiler-concepts.json`** (138 → 162, alphabetical, no term/alias collisions): `autonomy`, `concurrent maintainability`, `coupling choke`, `DC link`, `distributed redundant`, `double conversion`, `DRUPS`, `eco-mode`, `excitation`, `fault current`, `flywheel`, `frequency converter`, `IEC 62040-3`, `IGBT`, `isolated parallel bus`, `low voltage`, `magnetic bearing`, `MTBF`, `power conditioning`, `rotary UPS`, `static bypass`, `static UPS`, `synchronous machine`, `VRLA`

### Changed

- **`live-site-pages/profiler-data/profiler-concepts.json`** — the `UPS` definition now reads "a power stage backed by stored energy — a battery string or a spinning flywheel" instead of "a battery-backed power stage", so the shared tooltip agrees with the guide that teaches both stores
- **`live-site-pages/profiler-data/profiler-companies.json`** — Piller registry entry (tagline, HQ Osterode am Harz, no ticker, domains `piller.com` · `activepower.com` · `langleyholdings.com`), inserted after Panasonic; denormalized fields synced (`srcTotal` 185, `srcFirstPct` 64, `kpiNorm` true)
- **`live-site-pages/profiler-data/profiler-graph.json`** — rebuilt: 506 → 519 edges (402 curated); 13 edges touch `piller` — the nine curated plus derived-only mentions of ON.energy, VoltaGrid, Wärtsilä and xAI arising from the dossier's own prose
- **`repository-information/profiler-refresh-calendar.json`** — Piller row appended as a `cadence: "quarterly"` row (unit-level subsidiary of a private group) whose `source` records Langley's own disclosure cadence (annual report early February, interim early August) and a seven-item `watch[]`; `updated` → 2026-09-03
- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — §8 row A2 flipped: Dossier `v1 · v04.42r`, Guide `✓ · v04.42r`
- **`README.md`** — tree entries for `piller.profile.json`, `piller.study.json` and `study-prep/piller/`; `Last updated:` and repo version
- **`repository-information/repository.version.txt`** — `v04.41r` → `v04.42r`

### Notes

- **Research vehicle** — two parallel `general-purpose` subagents on the two-stage Source Priority Protocol: Agent A (first-party) evaluated 116 Piller, Active Power and Langley sources in 23 minutes — langleyholdings.com's HTML pages returned 503 throughout, so it read the group's annual-report and interim PDFs directly, piller.com's republished copies of every Langley release, and Piller-authored datasheets from distributor mirrors where piller.com hides the PDF behind a form; Agent B (third-party) evaluated 129 URLs in 20 minutes — Companies House, Handelsregister, SEC EDGAR (Active Power's 2016 sale), SGX, Uptime Institute, SemiAnalysis, trade and regional German press, competitor and counterparty releases. Sources are cited at canonical first-party URLs; blocked or snippet-only pages were dropped rather than cited
- **Left out for want of a source, as the plan requires:** no SHIELDX or POWERBRIDGE per-module MW/MJ/rpm (none published); no Piller stand-alone profit, order book or H1 2026 figures; no independent market share for Piller or the rotary niche (the five aggregator estimates for the DRUPS market span $270M–$2.8B and were not used); no LinkedIn URLs; no photos; Microsoft, VoltaGrid, Wärtsilä, GE Vernova and ProEnergy are not in `relationships[]` — the first two appear only as a third party's Vineland linkage and a symposium guest, the others are Bergen's rivals, not Piller's. The Vineland, NJ site is identified as the 400 MW SHIELDX plant only by Sierra Club NJ and SJ Climate News; Langley has never named it, and the dossier says so wherever it appears. Liberty Energy's release misnames Piller's CEO "Dean Miller"; the dossier records Dean Richards per Companies House and every other source
- **Verification** — `sync-profiler-registry.py --check` and `build-profiler-graph.py --check` clean; `check-profiler-study.py` 0 errors / 0 warnings over 64 guides and 162 concepts; a local schema-v7 validator (canonical development categories, relationship slugs and types, policy statuses, spec bands, KPI overlay rules, source ordering) 0 errors / 0 warnings; Playwright (localhost, stubbed backend, admin tier) rendered the dossier with all nine tabs and the Study Guide with 15 sections, 4 tables, 2 pros/cons cards, the callout, 11 ladder bars, 14 cards, the 10-item quiz and 127 resolving tooltip spans, zero page or console errors
- **Data-only** — no page or GAS file changed; no Profiler version bump; the Profiler page is an indirect affect. Register checks in `CLASSROOM-CURRICULUM-PLAN.md` §6 deliberately not re-run (phase-end, per the plan)

## [v04.41r] — 2026-09-03 03:34:27 AM EST

> **Prompt:** "Picking up from my last session, run Phase A1 of repository-information/PROFILER-COVERAGE-PLAN.md — Caterpillar — on Fable 5.1 xhigh as a fresh session. This is the first of four anchor sessions and doubles as the test of whether xhigh earns its cost over High on a dossier + study-guide pair, so do the pair properly and tell me at the end what xhigh visibly bought.

READ FIRST, before writing anything: 1. repository-information/SESSION-CONTEXT.md; 2. repository-information/PROFILER-COVERAGE-PLAN.md §2 (model rule), §3 (Phase A — the Caterpillar row and why it anchors `backup-generation`), §7 (what every session owes, including the paste-in template this prompt follows), and the `caterpillar` row in §8; 3. .claude/rules/profiler-app.md — the Profiler Command (two parallel research subagents, first-party exhaustive then third-party, ~50–70 sources, products & services as the priority section), the Profiler Prep Command (technology curriculum, high-school-STEM baseline, never company trivia), and Scheduled Refreshes (the calendar row); 4. repository-information/PROFILER-SCHEMA.md (profile schema v7, study-guide schema v2, concepts registry, calendar schema); 5. repository-information/PROFILER-STYLES.md — active style is intel-briefing; 6. CLASSROOM-CURRICULUM-PLAN.md §5 rows 4 and 5 and §6 row G2, so the study guide carries what the `backup-generation` lesson will need to pin; 7. eaton.study.json's "Backup orchestration" section, which is the only place gen-sets are taught today — the Caterpillar guide is the OEM's view of the same choreography and must not duplicate it.

THE TASK: `profiler Caterpillar` then `profiler prep Caterpillar`, one push commit. Dossier: slug `caterpillar`, category supplier, NYSE: CAT, profileVersion 1, all prose in intel-briefing style with confidence-tagged key judgments. Research priorities: the data-center gen-set line (diesel and gas, the 3516/C175/G3520-class units, prime vs standby ratings, Tier 4 / emissions paths, the Cat Microgrid and switchgear/ATS/paralleling offer), Cat Energy Storage, and Solar Turbines as the bridge-power prime mover the corpus already names — then Electric Power segment financials for the trailing two fiscal years plus the latest interim vs expectations, the trailing 18 months of data-center order and capacity news, decision makers with verified sources, and a relationships[] set that resolves only to covered slugs (Kiewit, Crusoe, VoltaGrid, xAI, Vantage and Eaton are the likely ones — verify each from a source before writing it). Study guide: the concept chain from "the grid drops" to "the load is back" — hold-up and transfer time, open vs closed transition, generator paralleling and load-shed priority, black start, prime vs standby vs continuous, why gas is displacing diesel for AIDC and what the air permit constrains, where a gen-set ends and a bridge-power plant begins — with a where-it-fails section aligned to §5 rows 4 and 5, {{term}} tooltips for everything the 112-entry concepts registry holds (check terms AND aliases), new shared concepts registered in profiler-concepts.json rather than the guide's local glossary, and flashcards/quiz on how the technology works.

BOOKKEEPING, same commit: python3 scripts/sync-profiler-registry.py, python3 scripts/build-profiler-graph.py, python3 scripts/check-profiler-study.py; a calendar row in repository-information/profiler-refresh-calendar.json (public — research the next earnings date, mark confirmed honestly, write the source and watch[]); README tree entries for caterpillar.profile.json and caterpillar.study.json; flip the caterpillar row in PROFILER-COVERAGE-PLAN.md §8 (Dossier → v1, Guide → ✓, with the repo version). Do NOT re-run the §6 register checks — that happens at the end of Phase A, not per session.

VERIFY BEFORE COMMITTING: sync-profiler-registry.py --check clean, check-profiler-study.py clean, the dossier and the Study Guide button render in Profiler.html via Playwright with zero page errors, every relationships[] slug and every {{term}} resolves. No page or GAS file changes — this is data-only, so no Profiler version bump. Normal Pre-Commit and Pre-Push checklists; bump the repo version on the push commit; push on a claude/* branch. If a product line or spec cannot be sourced from Caterpillar's own pages or a filing, leave it out and say so — I would rather a thinner dossier than a fabricated line."

**Phase A1 of the Profiler coverage plan — the first anchor company, run on Fable 5.1 xhigh as a dossier + study-guide pair in one commit.** Closes the first half of Classroom gap register row G2 (no gen-set OEM dossier); the `backup-generation` lesson can now pin `study:caterpillar`.

### Added

- **`live-site-pages/profiler-data/caterpillar.profile.json`** — Caterpillar Inc. (NYSE: CAT), `supplier`, schema v7, profileVersion 1, intel-briefing prose (BLUF summary, five confidence-tagged key judgments plus a dated INDICATORS TO WATCH bullet, collection gap stated). **Six product lines** with all four depth fields — standby/mission-critical diesel (C175-20/-16, 3516E, D1500), natural-gas prime and bridge (G3520 Fast Response, G3500K/H, CG260, the 10 MW medium-speed restart), Solar Turbines (Titan 130/250/350, PGM 130, SMT130), Cat Energy Storage and microgrid controls, ATS/switchgear/EMCP paralleling, services and channel — and **seven banded spec groups** with values quoted verbatim from Cat and Solar spec sheets and product pages. Financials FY2024, FY2025, Q1 2026 and Q2 2026 each with the fourth-quarter or quarterly consensus and verdict, the Power Generation application line per period (+22% / +38% / +41% / +29%), backlog ($30B → $51B → $63B → $72.1B), `kpi: revenue` on both annual periods. **24 developments** (March 2025 – August 2026; the December 2024 G3500K launch kept as the platform under the Joule award), **nine curated relationships** (xAI via Colossus, Crusoe via Stargate/Abilene, Microsoft, Meta, GE Vernova, Siemens Energy, Wärtsilä, Bloom Energy, FlexGen's 2015 Series A), **three policy exposures** (IEEPA/Section 232 tariffs with the $392M Q2 2026 recovery; the EPA stationary-engine rules that define the emergency vs non-emergency product split; state siting review and the Memphis/Southaven turbine cases), five decision makers from the officers page and SEC filings (no LinkedIn URLs — none could be verified), **127 sources at 46% first-party**, newest first, undated product literature last
- **`live-site-pages/profiler-data/caterpillar.study.json`** — schema v2, **16 sections** on the guidance engine, the first study guide in the corpus to use the rich section kinds: the concept chain from the grid dropping to the load being back (hold-up time and the ten-second race as a `table`; open vs closed transition as `proscons`; standby/prime/continuous as a `table`; block load and the swinging hall; paralleling, droop and spinning reserve; load-shed priority and the return trip; black start and the island; gas vs diesel as `proscons`; the air permit from the engine's side; where a gen-set ends and a bridge plant begins as a `table`), a product-mapping `table` and a megawatts-per-machine `bars` ladder from the dossier, a `where-it-fails` warn `callout` aligned to `CLASSROOM-CURRICULUM-PLAN.md` §5 rows 4 and 5, 12 flashcards and a 9-item quiz with explanations — all on how the technology works, no company trivia. 114 `{term}` spans over 43 distinct registry terms, checked against terms and aliases; no local glossary
- **`repository-information/study-prep/caterpillar/caterpillar-lesson-plan.md`** — the full-depth five-module lesson plan (three nested clocks; ratings and block load with a worked fleet-sizing example; paralleling, load shed and black start; diesel vs gas and the permit; the catalogue against the chain, the ladder, who buys and who competes), with pacing and a whole-plan self-test
- **26 shared concepts in `live-site-pages/profiler-data/profiler-concepts.json`** (112 → 138, alphabetical, no term/alias collisions): `air permit`, `block load`, `bridge power`, `closed transition`, `continuous rating`, `demand response`, `droop`, `emergency generator`, `gen-set`, `ISO 8528`, `lean-burn`, `load shedding`, `major source`, `minor source`, `NFPA 110`, `non-attainment area`, `NOx`, `open transition`, `paralleling switchgear`, `part load`, `selective catalytic reduction`, `spinning reserve`, `standby rating`, `synchronization`, `Tier 4`, `transfer time` — registered per the developer's instruction rather than defined locally; five of them (`bridge power`, `spinning reserve`, `minor source`, `selective catalytic reduction`, `non-attainment area`) are also lesson-local terms in Classroom's `bridge-power` lesson, written here consistently with those definitions

### Changed

- **`live-site-pages/profiler-data/profiler-companies.json`** — Caterpillar registry entry (tagline, HQ Irving TX, ticker, domains `caterpillar.com` · `cat.com` · `solarturbines.com`), denormalized fields synced (`srcTotal` 127, `srcFirstPct` 46, `kpiNorm` true)
- **`live-site-pages/profiler-data/profiler-graph.json`** — rebuilt: 490 → 506 edges (393 curated); 16 edges touch `caterpillar` — the nine curated plus derived-only mentions of ABB, Eaton, Fluence, ProEnergy, Schneider Electric, Tesla and VoltaGrid arising from the dossier's own prose
- **`repository-information/profiler-refresh-calendar.json`** — Caterpillar row inserted after the last public row: `nextReport` 2026-10-29, `confirmed: false` (no Q3 2026 advisory published as of 2026-09-03; trackers disagree between Oct 28, Oct 29 and Nov 4 — Oct 29 matches the Q3 2025 cadence), source and a ten-item `watch[]`; `updated` → 2026-09-03
- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — §8 row A1 flipped: Dossier `v1 · v04.41r`, Guide `✓ · v04.41r`
- **`README.md`** — tree entries for `caterpillar.profile.json`, `caterpillar.study.json` and `study-prep/caterpillar/`; `Last updated:` and repo version
- **`repository-information/repository.version.txt`** — `v04.40r` → `v04.41r`

### Notes

- **Research vehicle** — two parallel `general-purpose` subagents on the two-stage Source Priority Protocol: Agent A (first-party) evaluated ~55 Caterpillar, Solar Turbines, IR and SEC sources in 38 minutes (cat.com, caterpillar.com and solarturbines.com refused direct fetches, so it read Caterpillar's own product-catalog and CDN hosts, IR document store, SEC-hosted filings and archived captures of the marketing pages); Agent B (third-party) evaluated ~88 filings, transcripts, consensus reports, trade-press and regulatory sources in 23 minutes. Sources are cited at their canonical first-party URLs
- **Left out for want of a source, as instructed:** Kiewit, VoltaGrid, Vantage and Eaton are not in `relationships[]` — no source states a Caterpillar or Solar Turbines relationship with any of them (VoltaGrid's stated engine supplier is INNIO). No C175/3516E fuel-consumption tables, no company-stated MW-delivered-to-data-centers figure, no Caterpillar Ventures investment in the window, no LinkedIn URLs, and no company-confirmed Q3 2026 date. The "$28B services by 2026" target is described as not restated after the November 2025 investor day rather than as retired
- **Verification** — `sync-profiler-registry.py --check` and `build-profiler-graph.py --check` clean; `check-profiler-study.py` 0 errors / 0 warnings over 63 guides and 138 concepts; Playwright (localhost, stubbed backend, admin tier) rendered the dossier with all nine tabs and the Study Guide with 16 sections, 4 tables, the callout, 12 cards, the 9-item quiz and 114 resolving tooltip spans, zero page or console errors
- **Data-only** — no page or GAS file changed; no Profiler version bump; the Profiler page is an indirect affect. Register checks in `CLASSROOM-CURRICULUM-PLAN.md` §6 deliberately not re-run (phase-end, per the plan)

## [v04.40r] — 2026-09-03 02:29:23 AM EST

> **Prompt:** "I approve all tiers of additions and plan to create dossiers + study guides for all new additions as well as study guides for existing dossiers that are missing them. I plan to start with all companies that are advised to be built with Fable 5.1 xhigh, then the ones with Fable 5.1 high, then the ones with Opus 5 xhigh last. In the grand scheme of things, once all new dossiers and study guides have been added, I will go back to the Classroom build and backfill the gaps before continuing the overall build. Thus, reorganize the action plan accordingly and clearly mention which phases (and companies) should be built with which AI model. Then, remember session and give me the prompt to paste into a new Fable 5.1 xhigh session to begin updating Profiler."

*(The research response this approves — "Analyze Profiler's current coverage and the gaps and recommend me a list of companies that I should add to Profiler in order to make Classroom's industry coverage comprehensive … recommend whether I should use Opus 5, Fable 5.1 High, or Fable 5.1 xhigh to create each dossier … recommend me an action plan to approve" — made no commit; its findings are recorded in the new plan file's §1 and §2.)*

### Added

- **`repository-information/PROFILER-COVERAGE-PLAN.md`** — the approved Profiler coverage expansion, ordered by model the way the developer will run it. **§1** the coverage shape at approval (89 dossiers / 62 guides; the `ipp` category's nine BESS buyers have **zero** study guides; `investor` and `advisor` have never held a company; no utility of any kind) and the corpus mention count that surfaced gaps the register never named — Digital Realty (13 docs), Blackstone (12), AEP (11 + 25 guidance hits), Anthropic (10 docs, 97 hits), MGX, Fluidstack, Intersect Power, Mitsubishi Power — and why Powin (13 docs, the most-mentioned uncovered name) is deliberately left out. **§2** the model rule: Fable 5.1 xhigh only for the four anchors a Classroom lesson will pin, as dossier + guide in one session; Fable 5.1 High for private/opaque subjects and the regulatory-dense utilities; Opus 5 xhigh for public companies with deep first-party records and all guide work — with the confidence note that this is judgment, the repo has never compared dossier quality by model, and Phase A doubles as the test. **§3 Phase A** — Caterpillar, Piller, Dominion, Vicor. **§4 Phase B** — 29 companies in ten sessions: five utilities, ten BESS developers, nine AIDC developers/neoclouds/Anthropic, MGX, DNV, Sargent & Lundy, CoolIT, X-energy. **§5 Phase C** — 32 companies in twelve sessions (Cummins, mtu, Rehlko; Mitsubishi Electric, Powell, Mitsubishi Power; Infineon, Flex; Talen, Vistra, NRG; ENGIE NA, AES, RWE; Clearway, Recurrent, Form Energy; Power Electronics; Digital Realty, CyrusOne; Cipher, Hut 8, Galaxy; Blackstone, Brookfield, Macquarie; Oklo, Trane, McCarthy; Whiting-Turner, Gotion, REPT) plus three guide revisions (Vertiv and Schneider gain UPS sections, Siemens Energy gains grid technology) and 27 guide backfills, IPPs first. **§6 Phase D** — back to Classroom: re-run and date every §6 register check, author the lessons the closures unlock, then resume the cut line. **§7** what every session owes (dossier then guide in one commit; registry sync, graph build, study validator; a calendar row; README tree entries; flip the ledger; phase-end register checks; the `utility` category that session A3 must add to the registry, the schema and `Profiler.html`; the first-ever `investor`/`advisor` render check; CHANGELOG rotation ~eight pushes out) and the paste-in prompt template. **§8** the status ledger — 65 new-company rows and 30 guide rows, each flipped in the commit that lands it

### Changed

- **`repository-information/SESSION-CONTEXT.md`** — "remember session": Latest Session rewritten for this planning session (what was analyzed, what was decided, the model order, the Caterpillar prompt), the `bridge-power`/§2.2 entry rotated out under the 2-session cap
- **`README.md`** — tree entry for `PROFILER-COVERAGE-PLAN.md`; `Last updated:` and repo version
- **`repository-information/repository.version.txt`** — `v04.39r` → `v04.40r`

### Notes

- **Planning ran on Fable 5.1; nothing in Profiler or Classroom changed.** No page, GAS or data file moved — no page/GAS changelog entry, no AFFECTED URL. The first dossier session is the developer's next action, on Fable 5.1 xhigh, with the prompt recorded in SESSION-CONTEXT.md
- **The two research findings that most changed the list:** Classroom pins study guides, not dossiers, for every equipment lesson (the §5 failure map is built from guides only), so a dossier without a `profiler prep` pass adds nothing to Classroom and every row is a pair; and the BESS buyer side — nine `ipp` dossiers — carries no guide at all, which is why the backfill starts there rather than with the suppliers
- **Web-verified at approval:** Caterpillar ~18% and Cummins ~16% of the data-center generator market; Powell's >$400M single data-center order and $1.8B backlog; Aypa at ~6.5 GW moving from Blackstone to Brookfield; ENGIE's 5.6 GW and the CBRE IM stake; Google's Intersect acquisition; EdgeCore's 1.8 GW; CyrusOne Fairfield 760 MW; Hut 8's Anthropic/Fluidstack and Texas leases, Cipher's AWS lease, Galaxy's CoreWeave lease; Anthropic's published guidance to start Fable 5.1 at high effort and step up only on measured headroom

## [v04.39r] — 2026-09-03 01:58:03 AM EST

> **Prompt:** "continue with your recommendation"

**The structural fix for the failure the previous commit ran into.** §6's gap register had no way to record that a gap was closed, so G1 sat closed-since-v04.31r while still reading as open work with a *do this first* note attached — and produced a wrong recommendation two commits later. This commit gives the register a `Status` column and backfills all twelve rows **from checks run against the corpus, not from memory**.

### Changed

- **`repository-information/CLASSROOM-CURRICULUM-PLAN.md`** — §6 gains a **`Status` column** in second position, where a reader meets it before the gap text. Twelve rows backfilled: **G1 Closed** (v04.31r, extended v04.38r) · **G4 Partial** · **G2, G3, G5, G6, G7, G8, G9, G10 Open** · **G11 Deferred** · **G12 By design**. The last two are the register's own judgments that a row should not be commissioned, not work waiting to happen — a distinction the old table could not express at all
- **Every status was verified, and the verification is stated above the table** so the next reader knows what was checked and when: dossier and study-guide files by slug, section titles and keyword coverage inside the guides a row names, and the module ids in `guidanceDocs_()`. The note also fixes the rule that was missing — **a row is not closed until someone re-runs its check and dates it here**
- **G1's row was restored to its original wording.** v04.38r had marked the closure with a long inline `[CLOSED — …]` prefix inside the Gap cell, which was the only place available at the time; with a column to carry it, the prefix is gone and the row reads as it originally did
- **Four rows carry a dated verification clause** where the check changed the reading or the evidence is unusually strong: G3, G4, G5 and G9
- **The "commission first" paragraph was rewritten** rather than patched. It now opens on G2 and G3 as the top of the list with their verification stated, and promotes **G9 to the row this curriculum has hit in practice rather than in theory** — `the-800-vdc-shift` and `where-bess-plugs-in` both had to state its thinness in their own lesson text rather than teach around it, which is stronger evidence than anything else in the register carries
- **`repository-information/repository.version.txt`**, **`README.md`** — `v04.38r` → `v04.39r` and the `Last updated:` line

### Notes

- **What the checks actually returned**, since the column is only worth what the verification behind it is worth. **G2** — no gen-set OEM dossier of any kind: Caterpillar, Cummins, Kohler, Rolls-Royce/mtu, INNIO and Generac are all absent, so the row is open exactly as written. **G3** — exact: `vertiv.study.json` contains **zero** UPS content, `schneider-electric.study.json` **zero**, `eaton.study.json` is the only substantial source, and no guide in the corpus mentions rotary or flywheel UPS; Piller and Mitsubishi Electric are both absent. **G5** — no utility dossier exists at all. **G6** — seven guidance modules exist and none is a large-load interconnection module. **G7** — no chiller OEM, no CDU specialist. **G8** — no SMR vendor; Constellation, Bechtel and Kiewit exist and support a section, exactly as the row says. **G9** — Narada has a dossier and no study guide, Vicor and Infineon are absent. **G10** — Black & Veatch's guide has an *owner's engineer* section but **zero** occurrences of *independent engineer*, which are different roles, so the bankability material is still single-sourced to the guidance module. **G11** — Aligned, QTS, Holder and Black & Veatch all present, which is precisely the "no public source beyond sections of" state the row describes and defers
- **G4 is the row whose premise had moved, which is why it is `Partial` rather than `Open` or `Closed`.** "Beyond ABB" no longer describes the corpus: ABB's own guide already covers arc interruption and protection relays, and Hitachi Energy and GE Vernova both carry study guides with grid-equipment content that §5's failure map already cites. But all three of the row's *stated asks* are untouched — `siemens-energy.study.json` is still turnarounds and hydrogen with no grid-technology section, there is no Powell dossier, and no grid-equipment-shortage module exists. A binary column would have had to lie in one direction or the other
- **This is a documentation-only commit.** No lesson, track, registry, page or script changed, so [PC-GS-VERSION] #1, [PC-HTML-VERSION] #2, [PC-PAGE-CHANGELOG] #16 and the README tree do not fire, and neither `node --check` nor the classroom checkers have anything new to judge — the corpus they read is byte-identical to v04.38r
- The branch was **restarted from `origin/main`** before committing, as on the previous three commits; the working edit was carried across with `git stash`
- Register now reads: **1 closed, 1 partial, 8 open, 1 deferred, 1 by design**

## [v04.38r] — 2026-09-03 01:39:08 AM EST

> **Prompt:** "continue with your recommendation"

**The recommendation this commit set out to execute was based on a false premise, and the correction is the more useful half of the work.** The recommendation was to "run the G1 concepts-registry session" — add §6 gap G1's ~30 electrical and data-hall terms, and re-pin the five lessons carrying a stale `concepts:profiler-concepts` date. **G1 had already been done**, in `5c66534` ("v04.31r Add the 31 G1 concepts to the Profiler concepts registry"), and the plan's §6 row was never marked closed — which is exactly what produced the wrong recommendation. Checking G1's list against the registry's **terms and aliases** (rather than its terms alone, the mistake in the first pass) shows **all 34 of its terms already resolve.** So this commit closes the plan's stale rows and adds the genuinely-missing next increment instead. **The re-pin was dropped on reflection and is not in this commit** — see Notes.

### Added

- **`live-site-pages/profiler-data/profiler-concepts.json`** — **37 new concepts, 75 → 112 entries**, each with `slug`, `term`, `def` and `aliases`, written in the registry's existing voice and merged in slug order (334 insertions, **0 deletions** — no existing entry was reformatted). The set: aeroderivative · availability guarantee · black start · brownfield · busbar · combined cycle · conversion stage · CRPS · curtailment · cycle life · DC-DC converter · derating · digital twin · energization · energy battery · front-of-meter · grid-following · heat rate · IBR · inverter · islanded · NOGRR 245 · power battery · power shelf · PRC-029-1 · prime power · ride-through · safe harbor · SCADA · sidecar · simple cycle · solid-oxide fuel cell · state of charge · state of health · supercapacitor · virtual synchronous generator · zero crossing
- **The selection rule was made explicit and checkable rather than intuited**: a term is promoted when it is defined locally in **two or more lessons**, or appears **at least five times** across the public corpus (62 study guides + dossiers + the projects registry) or in the guidance modules. Two documented exception classes: a term that is one half of a pair whose other half qualifies (`energy battery` ↔ `power battery`, `simple cycle` ↔ `combined cycle`), and a regulatory identifier whose sibling is already in the registry (`NOGRR 245`, whose absence beside `NOGRR 282` is precisely the asymmetry that causes the confusion both the registry and the curriculum warn about). **Twelve candidates were excluded** by the same rule and stay lesson-local: grid code, setpoint, control loop, universal input, I²R loss, cell balancing, cycle budget, point of interconnection, spinning reserve, minor source, revenue stacking, balance of system

### Changed

- **`repository-information/CLASSROOM-CURRICULUM-PLAN.md`** — four stale references corrected, with the original reasoning kept rather than deleted. §6's **G1 row is marked `[CLOSED — v04.31r, extended v04.38r]`**; the "what to commission first" paragraph no longer opens on G1; **§8 note 4 is rewritten from "do G1 before track 2" into the standing practice that keeps it done** — define locally, check against terms *and aliases*, and promote on the two-lessons-or-five-corpus-hits rule; and §8 note 11's open developer call about sequencing the first five against G1 is marked moot, since G1 landed first and all five are now built
- **`repository-information/repository.version.txt`**, **`README.md`** — `v04.37r` → `v04.38r` and the `Last updated:` line

### Notes

- **The re-pin half of the recommendation was dropped, and the reasoning generalises.** Advancing the five stale lessons' `concepts:profiler-concepts` pin from `2026-08-31` to the current date would assert those lessons were authored against a document they were not. The contract's own rule is the right one here even though it binds pipeline runs rather than developer sessions: *a source that moved without contradicting anything leaves the lesson untouched — pin included* (G3). Adding definitions to a registry contradicts nothing any lesson teaches, and because `{{term}}` resolves lesson-first, it cannot even change what a reader sees. Executing it would also have required either five fabricated `revisions[]` entries that revised nothing, or five `updated` bumps with no content change — both worse than the drift they would fix
- **No lesson was touched, which is what §8 note 4 predicted.** The five terms proven duplicated across lessons (cycle life ×3; black start, ride-through, state of charge, state of health ×2) are now in the registry, and every lesson keeps its local definition, which simply shadows the registry entry. `check-classroom-content.py` reports **0 errors / 0 warnings** — unchanged, since adding registry entries can only reduce unresolved-term warnings, and there were none
- **The first pass of this analysis was wrong twice and both errors are worth recording.** It compared candidates against the registry's `term` values only, missing that `automatic transfer switch`, `THD`, `total harmonic distortion`, `scale-out`, `minimum take` and `synthetic inertia` all already resolve **through aliases** — which is why G1 reads as 31/34 closed on a naive check and 34/34 on a correct one. And the previous response's claim of "38 lesson-local entries, many defined twice" was an overstatement: the corpus holds **94 local entries across 88 distinct terms, with exactly 5 terms duplicated.** The alias lesson is now written into §8 note 4 so the next session does not repeat it
- **Verification** — `check-profiler-study.py`: 62 study guides + the concepts registry (112 concepts), **0 errors / 0 warnings**. `check-classroom-content.py`: 10 lessons, 3 tracks, 134 gate cases, **0 errors / 0 warnings**. `check-classroom-pipeline.py --base origin/main`: **2 findings, both P1**, naming `profiler-concepts.json` and `CLASSROOM-CURRICULUM-PLAN.md` as outside the committer's write set — the expected and correct noise for a developer commit touching files a pipeline run may not. **No P3**, so the gate digest is untouched and the next pipeline run will not block; no P5, P7 or P8, because no lesson literal was opened. `--selftest`: 13 fixtures, **0 failures**
- **No version moved except the repo version**, following the convention `5c66534` established for a registry-only change: the registry is deployed data rather than a page, and no HTML page or `.gs` file was modified, so [PC-HTML-VERSION] #2, [PC-GS-VERSION] #1 and [PC-PAGE-CHANGELOG] #16 do not fire. `node --check` and `check-gas-inner-scripts.js` were not run, as no JavaScript changed
- The branch was **restarted from `origin/main`** before any edit, as on the previous two commits
- Registry now at **112 concepts**; curriculum unchanged at **10 lessons / 3 tracks**

## [v04.37r] — 2026-09-03 01:27:59 AM EST

> **Prompt:** "continue with your recommendation"

**Cut-line item 5 — the last of §7's first five, and the first `guidance`-gated lesson in this sequence.** `where-bess-plugs-in` is appended at position 2 of `aidc-campus`, so the registries and the track's `lessons[]` are appended to and never reordered: `check-classroom-pipeline.py --base origin/main` returned **0 findings** for the third commit running. This is the commit that exercises the strict half of the provenance fold — a lesson analysts must **not** be able to read. The branch was restarted from `origin/main` first, since the previous commit had already merged. The gate surface is untouched, so `classroom-pipeline-ledger.json` — `gateDigest` included — is not written.

### Added

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clLessonWhereBessPlugsIn_()`, the lesson **`where-bess-plugs-in`** ("Where BESS Plugs In: The Three Sockets"), gate **`guidance`** (contributor and up), `updated` 2026-09-03, `reviewBy` **2026-12-10**. **Eight sections across seven kinds** — `sell-to-the-grid` (prose) · `three-sockets` (proscons, three cards) · `the-honest-no` (callout) · `the-rules-that-made-a-socket` (timeline, two lanes) · `power-battery-versus-energy-battery` (table) · `where-it-fails` (callout, `tone: "warn"`) · `drill` (7 flashcards) · `check-yourself` (5 quiz items). No two sections of a kind are adjacent; `sales` on three of the six teaching sections. **Eleven lesson-local glossary entries**, each for a meaning the 75-entry concepts registry lacks: FOM · minimum take · IBR · ride-through · curtailment · power battery · energy battery · float service · NOGRR 245 · PRC-029-1 · safe harbor. All 16 `{{term}}` tokens resolve, none shadows a registry entry, and none of the eleven is defined without being used
- **Inputs — six, one `guidance` and five `public`, every pin read off the document fetched this session** (G2), every ref resolved before it was written (G7): `guidance:power-infra-aidc-2026-08@2026-08-24` (the module's own `updated`, read from `guidanceDocPowerInfra_()` in `Profiler.gs`), `study:samsung-sdi@2026-08-21`, `profile:on-energy@2026-08-30`, `project:colossus@2026-09-02` (the projects file's last commit date), `graph:profiler-graph@2026-09-02` (the graph's own `built` field), `concepts:profiler-concepts@2026-09-03`. The study guide and dossier were parsed and their `slug` fields matched; `colossus` was confirmed present in `profiler-projects.json`
- **`reviewBy` is a real dated gate twice over.** It is the guidance module's own `reviewBy` (§8 note 3 predicted 2026-12-10 and the module confirms it), **and** it is the Batch Zero queue-repricing date the lesson's own timeline teaches — so the review date and the material's nearest gate are the same event rather than two facts that happen to agree. This is the strongest `reviewBy` justification in the sequence, and the first that is not the ~6-month default

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTrackAidcCampus_()`: `lessons[]` appended with `where-bess-plugs-in` (now two, in teaching order), `updated` → 2026-09-03, `short` extended; `prereqs[]` untouched. `clLessons_()` appended with `clLessonWhereBessPlugsIn_()`; `clTracks_()` untouched
- **`googleAppsScripts/Classroom/Classroom.gs`** — `VERSION` `"v01.15g"` → `"v01.16g"`, with `live-site-pages/gs-versions/Classroomgs.version.txt` → `|v01.16g|` in the same commit
- **`live-site-pages/gs-changelogs/Classroomgs.changelog.md`** — one versioned section, and the first that had to withhold a **title**: this lesson's gate is `guidance`, so P11 forbids naming it publicly. The entry says a contributor-tier lesson was added to the campus track and that lower tiers will see it as a withheld count, and names no title, no `ref`, no company and no content. `Sections: 15/50` → `16/50`
- **`README.md`** — `Last updated:`, `Repo version:` → `v04.37r`, and the Classroom entry's GAS version display → `v01.16g`

### Notes

- **Three deviations, and one of them resolves a contradiction inside the plan itself.** (1) **A `where-it-fails` section was added that §3.4's outline does not list.** §7 states that every one of the first five lessons carries one, and §3.4's outline for this lesson does not — a plan-internal contradiction. It is resolved in §7's favour **because the material carries it**: the sources state a specific, dated set of *commercial* failure modes (quoting a queue as a pipeline; confusing the two adjacent ride-through rules; spending a quarter on a campus screened out before the first meeting; letting a compliance requirement be written by someone else; a forecast carried past a scheduled repricing). The section opens by saying plainly that it is a different kind of failure from the equipment rows every other lesson in the walk ends on, since this lesson has no stage of the chain to break. (2) **`the-honest-no` moved from last to third**, directly after the `three-sockets` card that motivates it. The plan put it last for rhetorical close, but adding `where-it-fails` would have placed two callouts back to back, which §8 note 6 forbids; moving it also puts it against the socket-3 card it elaborates, which reads better. (3) **The timeline carries six of the module's eleven dated gates, not all of them.** The utility-procurement lane (certification orders, storage RFP cycles, a large-load tariff taking effect) is dated and real but belongs to the market-access material, and fire-code adoption is a certification question the storage-technology track owns. The `note` says both exclusions out loud rather than leaving the timeline looking complete
- **Nothing was re-taught from the four lessons this one pays off.** `the-fence-line` owns the five different numbers called megawatts, so the megawatt-against-megawatt-hour discipline is presented as its storage-side sibling rather than as a repeat; `duration-and-degradation` owns the revenue shapes, so `sell-to-the-grid` teaches the front-of-meter/behind-the-meter split and the queue-versus-committed filter instead; `bridge-power` owns the campus battery layer as a bridge-power fact, so this lesson uses it as socket-2 evidence with the certification dimension; and `the-800-vdc-shift`'s "a battery sale happening in a room most storage sellers have never been in" is **explicitly cross-referenced** in the `three-sockets` note as the same observation from the commercial side
- **The gate derivation was run against the real registries and this is the check the previous four commits could not make.** `where-bess-plugs-in` folds to **`guidance`** — one guidance input outranking five public ones — and `clLessonVisible_` is true for admin, admin-by-permission and contributor and **false for analyst**, viewer and unknown-role. `aidc-campus` shows contributor and admin both lessons with `withheld: 0` and shows **analyst one lesson with `withheld: 1`**; the analyst's lesson index is 8 of 10 and contains **neither** `where-bess-plugs-in` **nor** `spec-sheet-decoded`, while contributor and admin see all 10 and viewer sees none
- **Verification** — `check-classroom-content.py`: 10 lessons, 3 tracks, 134 gate cases, **0 errors / 0 warnings**. `check-classroom-pipeline.py --base origin/main`: **0 findings**. `--selftest`: 13 fixtures, **0 failures**. `node --check` on a `.js` copy of `Classroom.gs`: clean. `check-gas-inner-scripts.js`: 9 files, 86 inner blocks, clean
- The branch was **restarted from `origin/main`** before any edit, as on the previous commit
- `REPO-ARCHITECTURE.md` and the README tree are unchanged apart from the version display: no file was added, moved or deleted, and no behaviour any diagram depicts changed
- Curriculum now stands at **10 lessons / 3 tracks** (`bess-foundations` 4, `aidc-grid-to-chip` 4, `aidc-campus` 2) against the plan's 30 / 5. **§7's first five are complete.** What remains on the cut line is the second wave, which opens with `redundancy-by-the-numbers` and `inside-the-rack` — the two `aidc-grid-to-chip` positions this sequence deliberately skipped, and the ones `the-800-vdc-shift` now refers forward to

## [v04.36r] — 2026-09-03 01:16:17 AM EST

> **Prompt:** "continue with your recommendation"

**Cut-line item 4, and the first lesson written into `bess-foundations` since the track was authored.** `the-control-stack` is appended at position 4, so `clLessons_()`, `clTracks_()` and the track's `lessons[]` are again appended to and never reordered — `check-classroom-pipeline.py --base origin/main` returned **0 findings** for the second commit running. The branch was restarted from `origin/main` first, since the previous commit had already merged. The gate surface is untouched, so `classroom-pipeline-ledger.json` — `gateDigest` included — is not written.

### Added

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clLessonControlStack_()`, the lesson **`the-control-stack`** ("The Control Stack: BMS, PCS, EMS — Who Decides What"), gate **`tracks`** (analyst and up), `updated` 2026-09-03, `reviewBy` 2027-03-03. **Eight sections across seven kinds** — `the-layers` (prose) · `a-day-in-dispatch` (timeline, three lanes) · `who-owns-which-number` (table) · `the-warranty-envelope` (callout) · `following-or-forming` (proscons) · `where-it-fails` (callout, `tone: "warn"`) · `drill` (7 flashcards) · `check-yourself` (5 quiz items). No two sections of a kind are adjacent; `sales` on three of the six teaching sections. **Fifteen lesson-local glossary entries**, each for a meaning the 75-entry concepts registry lacks: control loop · setpoint · state of charge · state of health · cell balancing · cycle budget · point of interconnection · SCADA · grid-following · virtual synchronous generator · ride-through · grid code · black start · availability guarantee · digital twin. All 21 `{{term}}` tokens resolve, none shadows a registry entry, and none of the fifteen is defined without being used
- **Inputs — five, all public, every pin read off the document fetched this session** (G2), every ref resolved before it was written (G7): `study:flexgen@2026-08-08`, `study:sinexcel@2026-08-08`, `study:wartsila@2026-08-08`, `study:fluence@2026-08-08`, `concepts:profiler-concepts@2026-09-03` (the file's own last commit date, per `git log -1 --format=%cs`). The four study guides were parsed and their `slug` fields matched. **The stale `2026-08-31` concepts pin carried by the three existing `bess-foundations` lessons was not copied**, and `study:wartsila`'s and `study:fluence`'s pins were re-read rather than carried from `bridge-power` and `duration-and-degradation` (they happen to agree, because neither source has moved)

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTrackBessFoundations_()`: `lessons[]` appended with `the-control-stack` (now four, in teaching order), `updated` → 2026-09-03, and `short` extended to name what the fourth lesson adds. `clLessons_()` appended with `clLessonControlStack_()`; `clTracks_()` untouched
- **`googleAppsScripts/Classroom/Classroom.gs`** — `VERSION` `"v01.14g"` → `"v01.15g"`, with `live-site-pages/gs-versions/Classroomgs.version.txt` → `|v01.15g|` in the same commit
- **`live-site-pages/gs-changelogs/Classroomgs.changelog.md`** — one versioned section, generic throughout: no lesson title, no `ref`, no company name. `Sections: 14/50` → `15/50`
- **`README.md`** — `Last updated:`, `Repo version:` → `v04.36r`, and the Classroom entry's GAS version display → `v01.15g`

### Notes

- **Eight deviations from the §3.1 outline, all surfaced before writing.** (1) **`three-layers` became `the-layers`, a count-free id teaching five levels** — `study:flexgen` names the stack as BMS · PCS · EMS/site controller · SCADA · fleet/market layer, so teaching exactly three while pinning that guide would have made the pin ornamental. The three that decide are taught in depth; SCADA and the fleet layer are named as what only watches. This is the same correction `bridge-power`'s `ways-to-eat-the-same-gas` made. (2) **A section the outline does not have — `following-or-forming` (proscons)** — added for two reasons: the outline as written places `the-warranty-envelope` (callout) directly before `where-it-fails` (callout), which §8 note 6 forbids; and grid-following versus grid-forming is stated at length by `study:sinexcel`, corroborated by `study:flexgen`, owned by no existing lesson, and is exactly the "tender control requirement" the plan's own `why` says the reader must learn to recognise. (3) **`where-it-fails`' "BMS communication loss = a string offline" was reframed** — no pinned source states that failure. What they state is that an unbalanced string is capped by its worst cell and a site by its weakest rack, and that a string-arranged conversion path derates a block where a shared one trips it; so the bullet teaches **blast radius as an architecture decision**, which is the supported version of the same lesson. (4) **"PCS anti-islanding trips during grid faults" was reframed** — **anti-islanding is named by none of the four pinned sources.** The bullet teaches the stated failure: a converter that disconnects where its grid code required {{ride-through}}, and certification being per country rather than universal. (5) **Two failure bullets were added from the sources** — the orphaned control layer (a live site whose EMS vendor is gone, and the retrofit that repairs it) and availability (a plant available 98 % of the year that missed the hours that mattered). (6) **`study:sinexcel`'s harmonics and power-factor material is deliberately not taught here** — `the-aidc-power-chain` owns it, per §8 note 8's convention of citing a source for a different aspect; this lesson cites Sinexcel for the conversion layer, the following/forming split and its datasheet numbers, and gives power quality one clause noting it is the same hardware. (7) **`a-day-in-dispatch` is ordinal, not clock-based** — the sources state the day's shape (midday solar charge, evening peak discharge, roughly five-minute re-bidding) but no clock times and no canonical megawatt figures, so the timeline carries no invented hours and its `intro` says so. (8) **`reviewBy` is `2027-03-03`, the ~6-month default** — none of the four sources carries a forward dated gate of any kind, which is a cleaner case for the default than the previous lesson's; it also matches `cell-to-container` and `duration-and-degradation` at 2027-03-01
- **Nothing from the three existing `bess-foundations` lessons was re-taught.** `duration-and-degradation` already carries the warranty floor, the degradation curve, augmentation, DC-block versus AC-block, and the three income shapes with five-minute bidding — so `the-warranty-envelope` teaches the *enforcement mechanism* (caps on cycles, throughput and temperature; the compliance log; ageing cost priced into each bid) rather than restating the trade-off, and `a-day-in-dispatch` opens by naming the income shapes as already known and showing the day underneath them
- **The gate derivation was run against the real registries**, and this commit exercises the mixed-gate case §8 note 10 calls the acceptance check that matters: `the-control-stack` folds to `tracks`; `bess-foundations` shows admin and contributor all four lessons with `withheld: 0`, and shows **analyst three lessons with `withheld: 1`** — `spec-sheet-decoded` is correctly withheld because it pins a `guidance:` input — while viewer sees no track at all and an empty lesson index
- **Verification** — `check-classroom-content.py`: 9 lessons, 3 tracks, 134 gate cases, **0 errors / 0 warnings**. `check-classroom-pipeline.py --base origin/main`: **0 findings**. `--selftest`: 13 fixtures, **0 failures**. `node --check` on a `.js` copy of `Classroom.gs`: clean. `check-gas-inner-scripts.js`: 9 files, 86 inner blocks, clean
- The branch was **restarted from `origin/main`** before any edit, since the previous commit (`34edfe9`) had already merged and the auto-merge workflow had swept the branch — no intermediate commit was created to get a clean tree
- `REPO-ARCHITECTURE.md` and the README tree are unchanged apart from the version display: no file was added, moved or deleted, and no behaviour any diagram depicts changed
- Curriculum now stands at **9 lessons / 3 tracks** (`bess-foundations` 4, `aidc-grid-to-chip` 4, `aidc-campus` 1) against the plan's 30 / 5. **Four of §7's first five are built**; only `where-bess-plugs-in` (`aidc-campus` · 4, gate `guidance`) remains

## [v04.35r] — 2026-09-03 12:59:55 AM EST

> **Prompt:** "Picking up from my last session, author `the-800-vdc-shift` — cut-line item 3 from CLASSROOM-CURRICULUM-PLAN.md, appended to the end of the aidc-grid-to-chip track. Read the session context first; it explains what bridge-power established, why aidc-power-primer was retired, and what this lesson must not duplicate.
> READ BEFORE WRITING ANYTHING: 1. repository-information/CLASSROOM-SCHEMA.md — the lesson/track schema, above all "The provenance stamp" and "Drill items and history" 2. .claude/rules/classroom-app.md — the content fence, the checkers, the gateDigest obligation, and the "Authoring a pipeline lesson" decision procedure (C2c) 3. repository-information/CLASSROOM-CURRICULUM-PLAN.md §3.3 (the lesson spec and the three lessons around it), §5 rows 10 and 11 (the failure-map rows this lesson owns), §6 gap G9, §7, §8 (notes 2, 3, 5, 6, 7 and especially 8) 4. googleAppsScripts/Classroom/Classroom.gs — read `bridge-power` in full first; it is the current house bar and the newest section-kind precedent. Then `the-fence-line` and `the-aidc-power-chain`, which this lesson sits between and after.
> THE TASK: one lesson, `the-800-vdc-shift` — "Convert Once, Early, High" — appended to the END of aidc-grid-to-chip's lessons[]. Positions 4 and 5 (redundancy-by-the-numbers, inside-the-rack) are second-wave and deliberately skipped, so this is a pure append: do NOT reorder clLessons_() or clTracks_(), and expect ZERO P5 findings. If P5 fires, something was inserted that should have been appended. Update the track's `short` and `updated` so they describe what it now teaches.
> WHAT THE LAST SESSIONS ESTABLISHED THAT YOU MUST HONOUR: `the-aidc-power-chain` already teaches the service-entrance-to-rack hierarchy, busway, selective coordination, the UPS dial, outage choreography and dirty loads. Do NOT re-teach any of it — this lesson is the thesis for replacing that AC chain. `inside-the-rack` (position 5, NOT YET WRITTEN) owns the PSU→die walk, the 48 V busbar, the last centimetre and the periodic load swing. Do not write that lesson's material here; refer forward to it the way bridge-power refers forward to the transfer switch. `dc-fault-engineering` is a SEPARATE third-wave lesson at gate `guidance`. Grounding schemes, protection zones, the interlock and SSCB clearing times belong to it, not here. `where-it-fails` sections carry `tone: "warn"`. Keep it. Glossaries do not inherit. bridge-power holds 15 lesson-local terms and the-fence-line 7 — redefine locally anything you need, but add an entry ONLY for a meaning the 75-entry concepts registry lacks. Write {{term}} for what the registry holds — it already has 800 VDC, SST, SiC, GaN, rectifier, HVDC, PDU, BBU, VRM, PUE, hold-up time, UPS, harmonics, IEEE 519, power factor, arc flash, SSCB, scale-up.
> PINS: re-fetch every input and pin the date off the fetched document — lastUpdated in each study/profile JSON, `git log -1 --format=%cs` for profiler-concepts.json. Do NOT carry bridge-power's pins and do NOT copy the older lessons' stale 2026-08-31 concepts pin. Resolve every ref before you write it (G7): study:zhonhen, study:megmeet, study:nvidia, study:delta-electronics must actually parse with a matching slug field.
> CONSTRAINTS: Gate is `tracks`. Pin PUBLIC inputs only — one guidance: ref makes it contributor-only and breaks the track's analyst visibility. Field notes can never be a source. reviewBy is this lesson's own nearest dated gate. §8 note 3 pins the nvidia-800vdc guidance module at 2026-11-30, but that module is NOT an input here — so look for a ship date or a standards milestone in the public material and choose deliberately. the-fence-line defaulted to ~6 months; bridge-power took 2026-12-31 from two campus milestones. Say which you chose and why. Section-kind variety is a check, not a taste (§8 note 6): at least four kinds, never two prose sections back to back, never two callouts back to back. bars ONLY where a source states real numbers — never invented proportions; where the source gives a relationship without figures, use `table`. No `ledger`. The `the-new-boxes` outline item is a table, not bars, unless a source states ship dates or ratings. Carry a `where-it-fails` section (§5 rows 10 and 11: a stage deleted without a plan for its fault duty; a stock PSU never rated for DC; a sustained series arc; a sidecar retrofit that outruns the hall's upstream capacity). A `sales` line on roughly half the sections, not all of them. The honest sales read here is gap G9: a BBU or supercapacitor shelf on a DC bus is a battery sale happening in a room the seller has not been in. Flashcards and quiz feed the drill; item ids are positional (lc:<lessonId>:<sectionId>:<n>), so any later revision must APPEND, never insert.
> VERIFY BEFORE COMMITTING — a write without a clean pass is incomplete: python3 scripts/check-classroom-content.py (zero errors, zero warnings); python3 scripts/check-classroom-pipeline.py --base origin/main (expect ZERO findings — this is an append, not an insertion; no P1, no P3, no P5); python3 scripts/check-classroom-pipeline.py --selftest (zero failures); node --check on a .js copy of the .gs, and node scripts/check-gas-inner-scripts.js. Then run the gate derivation against the real content and confirm the-800-vdc-shift folds to `tracks`, viewer is not admitted, and aidc-grid-to-chip lists all four lessons in walk order with withheld=0.
> VERSIONING: bump the Classroom GAS VERSION and Classroomgs.version.txt together by one step ([PC-GS-VERSION] #1), add a Classroomgs.changelog.md entry that names nothing gated, and bump the repo version on the push commit. Normal Pre-Commit and Pre-Push checklists apply. Push on a claude/* branch.
> If anything in the plan's §3.3 outline turns out not to be supported by what the sources actually say, tell me before you write around it — I would rather cut a section than have one stamped on material that does not carry it. The last two sessions cut two §5 claims, a timeline phase, a table column and half a failure row on exactly this basis; do the same."

**Cut-line item 3, and the first Classroom commit in this sequence to be a pure append.** `the-800-vdc-shift` is added at position 4 of `aidc-grid-to-chip` — the end of the current list — so `clLessons_()`, `clTracks_()` and the track's `lessons[]` are all appended to and never reordered. `check-classroom-pipeline.py --base origin/main` returned **0 findings**, the first time in this sequence: no P1, no P3, no P5. The gate surface is untouched, so `classroom-pipeline-ledger.json` — `gateDigest` included — is not written.

### Added

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clLessonEightHundredVdcShift_()`, the lesson **`the-800-vdc-shift`** ("The 800 VDC Shift: Convert Once, Early, High"), gate **`tracks`** (analyst and up), `updated` 2026-09-03, `reviewBy` 2027-03-03. **Eight sections across five kinds** — `three-chains` (table) · `why-800` (prose) · `the-new-boxes` (table) · `same-thesis-twice` (callout) · `dc-safety-in-plain-terms` (prose) · `where-it-fails` (callout, `tone: "warn"`) · `drill` (7 flashcards) · `check-yourself` (5 quiz items). No two sections of a kind are adjacent; `sales` on three of the six teaching sections. **Twelve lesson-local glossary entries**, each for a meaning the 75-entry concepts registry lacks: conversion stage · inverter · double-conversion UPS · DC-DC converter · universal input · busbar · I²R loss · sidecar · power shelf · supercapacitor · CRPS · zero crossing. All 24 `{{term}}` tokens resolve, none shadows a registry entry, and none of the twelve is defined without being used
- **Inputs — five, all public, every pin read off the document fetched this session** (G2), every ref resolved before it was written (G7): `study:zhonhen@2026-08-19`, `study:megmeet@2026-08-07`, `study:nvidia@2026-08-21`, `study:delta-electronics@2026-08-21`, `concepts:profiler-concepts@2026-09-03` (the file's own last commit date, per `git log -1 --format=%cs`). The four study guides were parsed and their `slug` fields matched. **None of `bridge-power`'s nineteen pins was carried across, and the five older lessons' stale `2026-08-31` concepts pin was not copied**

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTrackAidcGridToChip_()`: `lessons[]` appended with `the-800-vdc-shift` (now four, in walk order), `updated` → 2026-09-03, and `short` extended to describe the walk as it now reads end to end. `clLessons_()` appended with `clLessonEightHundredVdcShift_()`; `clTracks_()` untouched
- **`googleAppsScripts/Classroom/Classroom.gs`** — `VERSION` `"v01.13g"` → `"v01.14g"`, with `live-site-pages/gs-versions/Classroomgs.version.txt` → `|v01.14g|` in the same commit
- **`live-site-pages/gs-changelogs/Classroomgs.changelog.md`** — one versioned section, generic throughout: no lesson title, no `ref`, no company name. `Sections: 13/50` → `14/50`
- **`README.md`** — `Last updated:`, `Repo version:` → `v04.35r`, and the Classroom entry's GAS version display → `v01.14g`

### Notes

- **Eight deviations from the §3.3 outline were surfaced before writing, all forced by what the sources state rather than by taste.** (1) **No `bars` section**, and none was added opportunistically the way `bridge-power`'s efficiency ladder was: the current figures come from two sources on two different bases — a single-phase `P = V·I` illustration (2,500 A at 400 V / 1,250 A at 800 V) against a real three-phase figure (~1,400 A for 1 MW at 415 V) — so charting them together would manufacture a comparability neither source claims, and the stage counts are stated for two of the three chains and not the third. The physics went into `why-800` prose where each number carries its own basis. (2) **`three-chains`' efficiency column is three different kinds of number and the table says so** — an end-to-end measurement, a stage rating, and a relative gain — with the `note` forbidding a ladder reading; dropping the column would have lost the lesson's most useful comparison, tidying it would have invented one. (3) **The 800 VDC stage count is written as a path, not a number**, because the source lists that chain without counting it. (4) **`the-new-boxes` gained a sixth row the outline omits** — the standardised server supply — because the `where-it-fails` row "a stock PSU never rated for DC" has nowhere to land otherwise; its "when it ships" column carries the source's class-level statement (shelves and sidecars now, full facilities from ~2027), not per-box dates, and the `note` says the ratings are one supplier's published figures for its own products in each class. (5) **`dc-safety-in-plain-terms` is thinner than its three outline items**: the sources name "grounding design" as a decision but no grounding *scheme*, so the section teaches the missing zero crossing, DC-rated devices as a class, and grounding-as-a-decision, then refers the schemes, zones, interlock and clearing times forward to `dc-fault-engineering` at the stricter gate. (6) **§5 row 11's "sustained series arc" is taught without the series/parallel taxonomy** — that row is carried by `study:zhonhen` *and* `study:abb`, and only the first is pinned here; Zhonhen carries the arc's persistence, not the taxonomy. (7) **§5 row 10 contributes its principle, not its specifics** — the stated trade that every stage removed makes the survivor's job harder — while the bus-as-heater and the thousand-amp regulator are referred forward to the rack-internals lesson that owns them. (8) **`reviewBy` is `2027-03-03`, the ~6-month default, chosen over the only dated gate in the material.** That gate is 2H 2027 (roughly 600 kW racks; full 800 VDC facilities projected from ~2027) — sixteen months out, too far to serve as a review trigger on the fastest-moving topic in this corpus — while the claims most likely to go stale ("shipping now", the ~2027 projection, the named-supplier facts) carry no date at all. `bridge-power` took a real gate because two campus milestones closed on one date; here the nearer honest date is the default, and the 2027 gate is taught in the text instead
- **Nothing from the three neighbouring lessons was re-taught.** `the-aidc-power-chain`'s hierarchy, busway, selective coordination, UPS dial, outage choreography and dirty-loads material is referenced only as the chain this lesson argues for replacing; the PSU-to-die walk, the 48 V busbar and the last centimetre are named as the rack-internals lesson's material in two places and taught in neither
- **The gate derivation was run against the real registries**, not the checker's fixtures: `the-800-vdc-shift` folds to `tracks`; `clLessonVisible_` is true for admin, admin-by-permission, contributor and analyst and **false for viewer and unknown-role**; `clTrackIndexFor_` shows `aidc-grid-to-chip` to analyst and up with all four lessons in walk order and **`withheld: 0`**, and does not list the track at all for viewer, whose lesson index is empty
- **Verification** — `check-classroom-content.py`: 8 lessons, 3 tracks, 134 gate cases, **0 errors / 0 warnings**. `check-classroom-pipeline.py --base origin/main`: 2 paths changed, **0 findings** (the predicted result for a pure append). `--selftest`: 13 fixtures, **0 failures**. `node --check` on a `.js` copy of `Classroom.gs`: clean. `check-gas-inner-scripts.js`: 9 files, 86 inner blocks, clean
- `REPO-ARCHITECTURE.md` and the README tree are unchanged apart from the version display: no file was added, moved or deleted, and no behaviour any diagram depicts changed
- Curriculum now stands at **8 lessons / 3 tracks** (`bess-foundations` 3, `aidc-grid-to-chip` 4, `aidc-campus` 1) against the plan's 30 / 5. `aidc-grid-to-chip` holds 4 of its 8 planned lessons; positions 4 and 5 of the plan's order (`redundancy-by-the-numbers`, `inside-the-rack`) remain second-wave and unwritten, which is why this lesson sits at position 4 rather than 6

## [v04.34r] — 2026-09-02 11:38:08 PM EST

> **Prompt:** "continue with your recommendation"

**The curriculum plan's §2.2 track cut, executed.** `the-aidc-power-chain` moves to position 3 of `aidc-grid-to-chip`, `aidc-power-primer` is retired rather than renamed, and `aidc-campus` is created to hold `heat-is-the-constraint` at position 1. Both lessons keep their ids, their sections and their progress keys; only track membership changes. The gate surface is untouched, so `classroom-pipeline-ledger.json` — `gateDigest` included — is not written.

### Added

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTrackAidcCampus_()`, the track `aidc-campus` (The AI Campus: Heat, Water, Power Projects, and the BESS Socket), opening with `heat-is-the-constraint` alone. Its `short` describes what it teaches today rather than the four-lesson outcome in `CLASSROOM-CURRICULUM-PLAN.md` §3.4 — the same convention `aidc-grid-to-chip` was created under. It is the **first track in the curriculum to carry `prereqs[]`**: `["aidc-grid-to-chip"]`, which the plan specifies and which now resolves because that track exists. The field is advisory — the renderer suggests, it never blocks — and the checker confirms no prerequisite cycle
- **`googleAppsScripts/Classroom/Classroom.gs`** — a comment above the new literal recording *why* the retired id was retired rather than renamed, so the reasoning survives without a reader having to find §2.2

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTrackAidcGridToChip_()` now lists `the-fence-line` → `bridge-power` → `the-aidc-power-chain`, the first three positions of the plan's eight, and its `short` is rewritten to describe the walk as it now reads end to end: the property line and its queue, the plant a campus builds when that queue is too slow, then the chain from the service entrance to the rack
- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTracks_()` registers `clTrackAidcCampus_()` in the retired track's position. **`clLessons_()` is unchanged**, and deliberately so: with `the-aidc-power-chain` at position 3 of one track and `heat-is-the-constraint` at position 1 of the next, the existing registry order *already equals* the new teaching order, so `clStudyNext_` walks correctly with no lesson-registry edit at all
- **`googleAppsScripts/Classroom/Classroom.gs`** — the content-region header comment corrected from "Five public-stamped modules" to "Six". It should have moved when `bridge-power` landed in `v04.33r` and did not; this is that correction. `VERSION` `v01.12g` → `v01.13g`
- **`live-site-pages/gs-versions/Classroomgs.version.txt`** — `|v01.12g|` → `|v01.13g|`
- **`live-site-pages/gs-changelogs/Classroomgs.changelog.md`** — a `v01.13g` section, generic entries only; capacity `12/50` → `13/50`

### Removed

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTrackAidcPowerPrimer_()` and the track id `aidc-power-primer`. **The removal was surfaced before it was made**, per the Chesterton's Fence gate, and the origin trace is the plan's own §2.2: *"A track id is permanent once progress keys on it; today nobody's progress rolls up to `aidc-power-primer` except the developer's, and the rollup is per-lesson underneath, so retiring the track id now — before analysts exist — costs nothing and avoids carrying a title that stops describing its contents."* Nothing outside the planning documents referenced the id — no `prereqs[]`, no page code, no checker fixture. Per §4 item 2 the id is **not reused**, and asking for it now answers `UNKNOWN_TRACK`, which was verified against the real registries rather than assumed

### Notes

- **Retire rather than retitle — the decision, and what would have made it go the other way.** Keeping the id under a new title was the conservative option and the plan explicitly allows it (*"it is a naming choice, not a design one"*). It was rejected because the only thing a permanent id protects is progress keyed on it, and Classroom keys progress on **lesson id + section id**, never on the track — so the rollup the id exists to protect is reconstructed from the lessons wherever they sit. Had track-level progress been stored, or had any analyst account existed to hold it, the retitle would have been correct instead
- **`heat-is-the-constraint` was never homeless.** Retiring the old track and creating `aidc-campus` happen in the same commit precisely so no registered lesson is ever in no track. A lesson outside every track still appears in the lesson index — `clLessonIndexFor_` walks the lesson registry, not the tracks — so the failure would have been quiet rather than visible, which is the kind that survives a commit
- **`aidc-campus` is created three lessons early, and that is the plan's shape, not an accident.** §7 lists `where-bess-plugs-in` as cut-line item 5 and says building it *"creates track 4 with `heat-is-the-constraint` plus this lesson"*. Creating the track now, one lesson deep, is the same trade `aidc-grid-to-chip` was created under last session: a track that describes what it teaches today and grows as each lesson is written
- **Verification** — `check-classroom-content.py`: 7 lessons, 3 tracks, 134 gate cases, **0 errors / 0 warnings**, including the first `prereqs[]` resolution and cycle check in the curriculum. `check-classroom-pipeline.py --base origin/main`: **two findings, both P5** — `track 'aidc-power-primer' disappeared` and `clTracks_(): registration is not append-only` — which are precisely the two assertions a track retirement is expected to trip (plan §8 item 9). P1 did not fire, and as required **no P3**: no gate symbol moved, so `gateDigest` was not refreshed. `--selftest`: 13 fixtures, **0 failures**. `node --check` and `node scripts/check-gas-inner-scripts.js`: clean
- **The gate derivation was run against the real registries again, not the checker's fixtures.** `aidc-power-primer` resolves to nothing; the lesson walk order is unchanged and still equals teaching order; the track walk order is `bess-foundations` → `aidc-grid-to-chip` → `aidc-campus`; analyst, contributor and admin each see `aidc-grid-to-chip` with all three lessons in walk order at `withheld=0` and `aidc-campus` with its one lesson at `withheld=0` and its prereq attached; **viewer sees no tracks and no lessons at all**. Analyst reads 6 of the 7 lessons — `spec-sheet-decoded` stays withheld on its `guidance` stamp, unchanged by any of this
- **What this leaves for the next session.** `aidc-grid-to-chip` now holds 3 of its 8 planned lessons and `aidc-campus` 1 of 4. The next cut-line item is `the-800-vdc-shift` (§7 item 3), which lands at position 6 of `aidc-grid-to-chip` — so it can be authored and appended without another track edit

## [v04.33r] — 2026-09-02 11:04:43 PM EST

> **Prompt:** "Picking up from my last session, author `bridge-power` — cut-line item 2 from CLASSROOM-CURRICULUM-PLAN.md, position 2 of the aidc-grid-to-chip track the last session opened. Read the session context first; it explains what the-fence-line established and what it deliberately left alone. READ BEFORE WRITING ANYTHING: 1. repository-information/CLASSROOM-SCHEMA.md — the lesson/track schema, above all "The provenance stamp" and "Drill items and history"; 2. .claude/rules/classroom-app.md — the content fence, the checkers, the gateDigest obligation, and the "Authoring a pipeline lesson" decision procedure (C2c); 3. repository-information/CLASSROOM-CURRICULUM-PLAN.md §3.3 (the lesson spec), §5 rows 4 and 5 (the failure-point map rows this lesson owns), §7, §8 (notes 2, 3, 5, 6, 7 and especially 8); 4. googleAppsScripts/Classroom/Classroom.gs — read `the-fence-line` in full first; it is the lesson this one continues and the current house bar. Then read the other five. THE TASK: one lesson, `bridge-power` — "Power Before the Grid Arrives" — inserted at position 2 of `aidc-grid-to-chip`, between `the-fence-line` and `the-aidc-power-chain`. Author the lesson JSON inside the content fence and re-sequence clLessons_()/clTracks_() only as far as this lesson requires. Update the track's `short` and `updated` so they describe what it now teaches. WHAT THE LAST SESSION ESTABLISHED THAT YOU MUST HONOUR: `the-fence-line` already teaches the interconnection study, the three studies, the queue, large-load rules (large-load tariff / SB 6 / NOGRR 282), the substation at the property line, and the five megawatt numbers. Do NOT re-teach any of it — refer to it and build on it. `bridge-power` starts from "the queue is too slow, so build your own plant". §8 note 8 is binding: the engine table lives in `where-batteries-stop` (track 1). Teach turbine vs engine vs fuel cell as a `proscons` on prime-mover *choice*, not as the engine spec table. `where-it-fails` sections carry `tone: "warn"` — the convention the last session set. Keep it. Seven glossary terms are already lesson-local to `the-fence-line` (interconnection study, network upgrades, energization, front-of-meter, brownfield, power banking, entitlement). If `bridge-power` needs any of them, define them again locally — glossaries do not inherit — but add a glossary entry ONLY for a meaning the 75-entry concepts registry lacks. Write {{term}} for everything the registry holds (behind-the-meter, microgrid, N+1, PPA, offtake, take-or-pay, LTSA, commissioning, IRP, ERCOT, tolling agreement, and the rest). PINS: re-fetch every input and pin the date off the fetched document — lastUpdated in each profile/study JSON, `git log -1 --format=%cs` for profiler-projects.json and profiler-concepts.json. Do NOT carry the-fence-line's pins and do NOT copy the older lessons' stale 2026-08-31 concepts pin. Resolve every ref before you write it (G7): the four bridge-power supplier dossiers (voltagrid, proenergy, enchanted-rock, mainspring-energy) and the four projects (frontier, jupiter-nm, colossus, homer-city) must actually parse and match. CONSTRAINTS: Gate is `tracks`. Pin PUBLIC inputs only — one guidance: ref makes it contributor-only and breaks the track's sequencing. Field notes can never be a source. reviewBy is this lesson's own nearest dated gate. §8 note 3 says bridge-power should take a dated gate from its own material (a turbine slot date, a commissioning target) if it teaches one; the-fence-line found none and defaulted to ~6 months. Look, choose deliberately, and say which you chose and why. Section-kind variety is a check, not a taste (§8 note 6): at least four kinds, never two prose sections back to back, never two callouts back to back. `bars` ONLY where a source states real numbers — never invented proportions; use `table` where the source gives a relationship without figures. No `ledger`. Carry a `where-it-fails` section (§5 rows 4 and 5: air permits, turbines at part load and in hot thin air, fuel supply, a slot that slips; open transition with no stored energy, generators that do not synchronise, load not shed in priority). A `sales` line on roughly half the sections, not all of them. Flashcards and quiz feed the drill; item ids are positional (lc:<lessonId>:<sectionId>:<n>), so any later revision must APPEND, never insert. VERIFY BEFORE COMMITTING — a write without a clean pass is incomplete: python3 scripts/check-classroom-content.py (zero errors, zero warnings); python3 scripts/check-classroom-pipeline.py --base origin/main (expect P5 findings on the registry insertion; expect NO P3 — no gate symbol should move, so gateDigest stays untouched); python3 scripts/check-classroom-pipeline.py --selftest (zero failures); node --check on a .js copy of the .gs, and node scripts/check-gas-inner-scripts.js. Then run the gate derivation against the real content and confirm bridge-power folds to `tracks`, viewer is not admitted, and aidc-grid-to-chip lists both lessons in walk order with withheld=0. VERSIONING: bump the Classroom GAS VERSION and Classroomgs.version.txt together by one step ([PC-GS-VERSION] #1), add a Classroomgs.changelog.md entry that names nothing gated, and bump the repo version on the push commit. Normal Pre-Commit and Pre-Push checklists apply. Push on a claude/* branch. If anything in the plan's §3.3 outline turns out not to be supported by what the sources actually say, tell me before you write around it — I would rather cut a section than have one stamped on material that does not carry it. The last session cut two §5 claims and one timeline phase on exactly this basis; do the same."

**Cut-line item 2, and the lesson that turns `aidc-grid-to-chip` from a stub into a walk.** `bridge-power` is authored inside the content fence at position 2 of the track, between `the-fence-line` and `the-aidc-power-chain`, and the lesson registry is re-sequenced to keep registry order equal to teaching order. The gate surface is untouched, so `classroom-pipeline-ledger.json` — `gateDigest` included — is not written.

### Added

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clLessonBridgePower_()`, the lesson `bridge-power` (gate `tracks`, analyst and up), inside `// CONTENT START` … `// CONTENT END` at its position in the walk. Nine sections across **seven** kinds — `why-a-campus-builds-a-power-plant` (prose) · `ways-to-eat-the-same-gas` (proscons, four cards) · `fuel-in-electricity-out` (bars) · `the-turbine-queue` (prose) · `prime-backup-n-plus-one` (callout) · `four-campuses` (table) · `where-it-fails` (callout, `tone: warn`) · `drill` (6 flashcards) · `check-yourself` (5 quiz items) — with no two sections of the same kind adjacent and a `sales` line on four of the seven teaching sections
- **Nineteen public inputs, every pin read off the document fetched this session** (G2): `study:kiewit@2026-08-21`, `study:wartsila@2026-08-08`, `study:bloom-energy@2026-08-21`, `study:vantage@2026-08-21`, `study:crusoe@2026-08-21`, `study:xai@2026-08-21`, `study:primoris@2026-08-21`, `profile:voltagrid@2026-08-30`, `profile:proenergy@2026-08-30`, `profile:enchanted-rock@2026-08-30`, `profile:mainspring-energy@2026-08-30`, `profile:kiewit@2026-08-30`, `profile:bloom-energy@2026-08-30`, `profile:stack-infrastructure@2026-08-30`, `project:frontier@2026-09-02`, `project:jupiter-nm@2026-09-02`, `project:colossus@2026-09-02`, `project:homer-city@2026-09-02`, `concepts:profiler-concepts@2026-09-03`. Study and profile pins are each file's own `lastUpdated`; the two registries are `git log -1 --format=%cs` on the base revision. Every ref was resolved before it was written (G7) — each `<slug>.study.json` / `<slug>.profile.json` parsed with its `slug` field matching the id, and all four project slugs found as entries in `profiler-projects.json`. None carries `the-fence-line`'s pins or the older lessons' stale `2026-08-31` concepts pin
- **Three inputs the plan's §3.3 list does not name** were added because the lesson genuinely draws on them: `profile:kiewit` (Homer City's turbine count, rating and first-power target), `profile:bloom-energy` and `profile:stack-infrastructure` (Project Jupiter's scale, its developer, and the initial-operations target that sets this lesson's `reviewBy`). The plan's own list would have left two of the four campus rows unsourced
- **Fifteen lesson-local glossary entries** for meanings the 75-entry concepts registry does not carry — `prime power`, `bridge power`, `simple cycle`, `combined cycle`, `heat rate`, `aeroderivative`, `selective catalytic reduction`, `minor source`, `non-attainment area`, `islanded`, `black start`, `spinning reserve`, `linear generator`, `solid-oxide fuel cell`, `power delivery agreement`. The other ten terms the lesson marks up resolve from the registry (`behind-the-meter`, `microgrid`, `N+1`, `interconnection queue`, `inertia`, `synchronous condenser`, `transformer`, `offtake`, `EPC`, `UPS`), so nothing already public is duplicated locally. This is a bigger local glossary than `the-fence-line`'s seven because the lesson covers four machine families and a permitting regime; gap **G1**'s second wave would absorb most of it

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTrackAidcGridToChip_()` now lists `the-fence-line` then `bridge-power`, and its `short` is rewritten to describe what the track teaches today rather than the eight-lesson outcome in §3.3. `updated` stays `2026-09-02` because the list changed on the same day it was created
- **`googleAppsScripts/Classroom/Classroom.gs`** — `clLessons_()` re-sequenced by **insertion** rather than append, so registry order stays teaching order for `clStudyNext_`: the lesson lands between `the-fence-line` and `the-aidc-power-chain`. This is the documented cost of a curriculum reorder (`CLASSROOM-CURRICULUM-PLAN.md` §4, "Insertion versus append") and is what the single expected P5 finding below reports. `clTracks_()` is unchanged — the track was already registered. `VERSION` `v01.11g` → `v01.12g`
- **`live-site-pages/gs-versions/Classroomgs.version.txt`** — `|v01.11g|` → `|v01.12g|`
- **`live-site-pages/gs-changelogs/Classroomgs.changelog.md`** — a `v01.12g` section, generic entries only (no lesson title, no ref, no company name); capacity `11/50` → `12/50`

### Notes

- **Three deviations from the §3.3 outline, all reported before writing rather than written around.** (a) `three-ways-to-eat-the-same-gas` became **four** ways and the id lost the count. Bloom's guide has a section by that exact name covering turbine, engine and fuel cell, but the Mainspring dossier — a pinned input — positions the linear generator as *"a fourth category of onsite power distinct from engines, turbines, and fuel cells"*; teaching three while pinning that dossier would have made the pin ornamental. The id is `ways-to-eat-the-same-gas`, count-free, on the same reasoning that renamed `megawatts-that-differ` last session. (b) `four-campuses` **lost its "grid posture" column**: it is stated for only two of the four rows — Frontier runs fully off-grid, Colossus bridged on mobile generation until the grid and its batteries arrived — and nothing in the corpus states Jupiter's or Homer City's. The column became "who builds and supplies it", which all four rows carry, and the two stated postures moved into the `note`, which says plainly that the other two are not stated. (c) `where-it-fails` carries **§5 row 4 in full and only the paralleling half of row 5**
- **The transfer-switch half of §5 row 5 was cut for want of a source in this lesson's scope.** "Open transition with no stored energy" and "load that is not shed in priority" are carried by `study:eaton` and `study:rosendin`, which belong to `the-aidc-power-chain` at position 3 and to `redundancy-by-the-numbers`; pinning them here would have duplicated the next lesson's outage choreography. What the pinned sources *do* carry is taught as the fifth failure — the island that cannot hold itself together: second-by-second balancing, spinning reserve and black start from `study:crusoe`, load swings faster than any engine can answer from `study:wartsila` and `study:xai`, and holding transients with rotating mass instead of storage from `profile:voltagrid`. The section closes by naming the transfer switch as the next lesson's material rather than pretending it is absent
- **One section was added that the outline omits** — `fuel-in-electricity-out`, a `bars` on the efficiency ladder. §8 note 6 permits `bars` only where a source states real numbers, and four are stated: simple-cycle ~35–40 % and combined-cycle >60 % (`study:kiewit`), reciprocating engine ~50 % with one unit quoted to 52.1 % (`study:wartsila`), and the linear generator's 46 % (`profile:mainspring-energy`). Where a source gives a range the bar takes one end and the caption says which end, and the `intro` tells the reader to read the ladder rather than the decimal. **The fuel cell is deliberately absent from the chart**: its guide describes efficiency as nearly scale-free — a relationship, not a class figure — and §8 note 6 forbids inventing the proportion, so the `note` says so and explains what the gap at the top of the chart actually teaches
- **`reviewBy` is `2026-12-31` — a real dated gate, not the ~6-month default.** §8 note 3 asked this lesson to take the nearest dated gate in its own material if it teaches one, and unlike `the-fence-line` it does. Two of the four campuses in its table have first-operations milestones inside 2026 — Frontier's first building due in the second half of 2026 (`profile:voltagrid`) and Project Jupiter's initial operations targeted for Q4 2026 (`profile:stack-infrastructure`) — and both windows close on 2026-12-31. When they land, two flagship rows of `four-campuses` change state, which is exactly what a review date is for. The date is ~4 months out rather than ~6, which is correct: this lesson's material is order books and campus milestones, not the slow fundamentals of the fence line
- **§8 note 8 honoured — no engine table.** Prime-mover choice is taught as a `proscons` on the four machine families and their tradeoffs; the engine specification table stays reserved for `where-batteries-stop` in track 1, and nothing here re-teaches `the-fence-line`'s studies, queue, large-load rules, substation or five megawatt numbers. The lesson opens by referring back to them and starting from "so build the power yourself"
- **The sales lines are written to what the sources actually say, which is uncomfortable.** Every one of the four pinned supplier dossiers describes a platform with no storage in its product line, and one advertises prime power with *"zero reliance on battery storage"*, holding transients with engine inertia, synchronous condensers and flywheels instead. So the lesson teaches that this cohort is where storage is being designed out, and that the openings are specific and narrow — the bring-up, the transient and ride-through duty, and the conversion at the end of a bridge. Teaching it as "a battery rides along" would have been the comfortable read and the wrong one
- **Verification** — `check-classroom-content.py`: 7 lessons, 3 tracks, 134 gate cases, **0 errors / 0 warnings** (all 25 `{{term}}` markups resolve, and no glossary entry is left unused). `check-classroom-pipeline.py --base origin/main`: six paths changed, **one finding — P5** on the registry insertion, the expected cost of a curriculum reorder. P1 did not fire: all six paths sit inside the contract's write set. And, as required, **no P3** — no gate symbol moved, so `gateDigest` was not refreshed. `--selftest`: 13 fixtures, **0 failures**. `node --check` on a `.js` copy of `Classroom.gs` and `node scripts/check-gas-inner-scripts.js`: clean. The gate derivation was additionally run against the **real** registries rather than the checker's fixtures — `bridge-power` folds to `tracks` from nineteen `public` kinds, viewer is not admitted and does not see the track at all, analyst/contributor/admin each read it, and `aidc-grid-to-chip` returns both lessons in walk order with `withheld=0`
- **Left deliberately untouched.** The five pre-existing lessons still pin `concepts:profiler-concepts` at `2026-08-31` — re-pinning them is not required by this lesson, and a pin that moves with no contradiction behind it is the write G3 tells a pipeline run not to make. `the-aidc-power-chain` still sits in `aidc-power-primer` rather than moving into the new track; with `bridge-power` now in place at position 2, that move is the next natural developer call, and it is still a call rather than a consequence

## [v04.32r] — 2026-09-02 10:36:47 PM EST

> **Prompt:** "Picking up from my last session, author `the-fence-line` — the first lesson from CLASSROOM-CURRICULUM-PLAN.md's cut line. Read the session context first; it explains where G1 left things. READ BEFORE WRITING ANYTHING: (1) CLASSROOM-SCHEMA.md — the lesson/track schema, and above all "The provenance stamp" and "Drill items and history"; (2) .claude/rules/classroom-app.md — the content fence, the checkers, the gateDigest obligation, and the "Authoring a pipeline lesson" decision procedure (C2c); (3) CLASSROOM-CURRICULUM-PLAN.md §3.3 (the lesson spec), §5 (the failure-point map), §7 (why this one is first), §8 (all eleven notes — especially 2, 3, 5, 6, 7 and 8); (4) Classroom.gs — read all five existing lessons in full. They are the quality bar and the house voice. Match them. THE TASK: one lesson, `the-fence-line`, at position 1 of a new `aidc-grid-to-chip` track. It is the missing front half of the grid-to-chip chain — everything from the utility's side of the property line up to the service entrance — and every later AIDC lesson assumes it. Author the lesson JSON inside the content fence, create the track, and re-sequence clLessons_()/clTracks_() only as far as this lesson requires. WHAT THE LAST SESSION CHANGED THAT YOU MUST ACCOUNT FOR: profiler-concepts.json went 44 → 75 entries (repo v04.31r) — write {{term}} for everything the registry holds and carry NO lesson-local glossary for it; the concepts layer's file date moved twice in two days, so do NOT copy the existing lessons' stale 2026-08-31 pin — per §8 note 2, re-fetch every input and pin the date off the fetched document. CONSTRAINTS THAT DECIDE WHETHER THE LESSON CAN EXIST: the provenance stamp folds to the STRICTEST gate of its inputs, so pin PUBLIC inputs only (one guidance: ref silently makes it contributor-only); field notes can never be a source. reviewBy is this lesson's own nearest dated gate — choose deliberately and say which you chose and why. Section-kind variety is a check, not a taste (§8 note 6): at least four kinds, never two prose sections back to back; `bars` only where the source states real numbers; no `ledger`. Carry a `where-it-fails` section. A `sales` line on roughly half the sections. §8 note 8: this lesson ends where `bridge-power` begins — do not teach the engine table. Item ids are positional, so any later revision must APPEND, never insert. VERIFY BEFORE COMMITTING: check-classroom-content.py (zero errors, zero warnings); check-classroom-pipeline.py --base origin/main (expect P1/P5 findings, expect NO P3); --selftest (zero failures); node --check and check-gas-inner-scripts.js. Refresh gateDigest if and only if the gate surface actually moved. VERSIONING: bump the Classroom GAS VERSION and Classroomgs.version.txt together by one step, add a Classroomgs.changelog.md entry that names nothing gated, and bump the repo version on the push commit. Push on a claude/* branch. If anything in the plan's §3.3 outline turns out not to be supported by what the sources actually say, tell me before you write around it — I would rather cut a section than have one stamped on material that does not carry it."

**The first lesson off the curriculum plan's cut line.** `the-fence-line` is authored inside the content fence, a new `aidc-grid-to-chip` track is created around it, and both registries are re-sequenced to the position the plan fixes. The gate surface is untouched, so `classroom-pipeline-ledger.json` — `gateDigest` included — is not written.

### Added

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clLessonTheFenceLine_()`, the lesson `the-fence-line` (gate `tracks`, analyst and up), inside `// CONTENT START` … `// CONTENT END` at its position in the walk. Eight sections across six kinds — `nothing-connects-unstudied` (prose) · `the-three-studies` (timeline) · `load-is-not-generation` (callout) · `what-arrives-at-the-fence` (prose) · `megawatts-that-differ` (table) · `where-it-fails` (callout, `tone: warn`) · `drill` (6 flashcards) · `check-yourself` (5 quiz items) — with no two sections of the same kind adjacent and a `sales` line on three of the six teaching sections. Inputs: `study:burns-mcdonnell@2026-08-21`, `study:mortenson@2026-08-21`, `study:stack-infrastructure@2026-08-22`, `study:nebius@2026-08-21`, `study:terawulf@2026-08-21`, `concepts:profiler-concepts@2026-09-03`. Every pin was read off the document fetched this session — the five study guides' own `lastUpdated`, and `git log -1 --format=%cs` for the registry — so none carries the five existing lessons' stale `2026-08-31` concepts pin
- **`googleAppsScripts/Classroom/Classroom.gs`** — `clTrackAidcGridToChip_()`, the track `aidc-grid-to-chip` (The AI Data-Center Wave), opening with `the-fence-line` alone. `prereqs[]` is omitted rather than pointing at the plan's `electrical-foundations`, which is not yet registered
- Seven lesson-local glossary entries for meanings the concepts registry does not carry — `interconnection study`, `network upgrades`, `energization`, `front-of-meter`, `brownfield`, `power banking`, `entitlement`. Everything else the lesson marks up resolves from the registry's 75 entries, so nothing already public is duplicated locally

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs`** — `clLessons_()` and `clTracks_()` re-sequenced by **insertion** rather than append, so registry order stays teaching order for `clStudyNext_`: the lesson lands between `spec-sheet-decoded` and `the-aidc-power-chain`, the track between `bess-foundations` and `aidc-power-primer`. This is the documented cost of a curriculum reorder (`CLASSROOM-CURRICULUM-PLAN.md` §4, "Insertion versus append") and is what the two expected P5 findings below report
- **`googleAppsScripts/Classroom/Classroom.gs`** — the content region's C1 header comment corrected from "Four public-stamped modules" to "Five", and a short header added above the new literal recording why the track is deliberately authored short. `VERSION` `v01.10g` → `v01.11g`
- **`live-site-pages/gs-versions/Classroomgs.version.txt`** — `|v01.10g|` → `|v01.11g|`
- **`live-site-pages/gs-changelogs/Classroomgs.changelog.md`** — a `v01.11g` section; capacity `10/50` → `11/50`

### Notes

- **Three deviations from the §3.3 outline, all reported rather than written around.** (a) The outline's `four-megawatts-that-differ` lists five quantities in its own description, so the section id is `megawatts-that-differ` — ids are permanent and one that miscounts its own rows would be permanent too. (b) A section the outline omits but the lesson's `short` promises — the substation — is added as `what-arrives-at-the-fence`, scoped to what arrives at the property line and what set its date; the voltage ladder, the inside of the tank and the 40-month lead time are left to `the-transformer-and-the-substation` in track 2. (c) `load-is-not-generation` is moved ahead of the megawatt table so the lesson's two callouts are not adjacent
- **Two claims from the §5 failure map were cut for want of a source.** "Queue re-pricing" and "an audit that pauses a batch" are not stated by any of the five guides, so `where-it-fails` teaches only what they carry: the queue position that is not a delivery date, the requester funding upgrades on equipment it does not schedule, the transformer manufacturing slot, energization as a witnessed test on the critical path, and entitlement or environmental review reopening. An "interconnection agreement" phase was likewise dropped from the timeline — the guides name the three studies, not a contract stage
- **The `timeline` axis is the phase order, not a calendar.** The renderer prints `Math.floor(x)` in a year gutter, and no source gives a duration per phase, so `x` is 1–6 and both the `intro` and the `note` say so in the reader's own words. The durations that *are* carried — years in busy regions, five or more for a new large-load request, about a year for a gigawatt substation — are stated where they belong instead
- **`reviewBy` is `2027-03-02`, the ~6-month default, chosen after looking for a dated gate and not finding one.** §8 note 3 asks this lesson to take the nearest dated gate in its own material if it teaches one. It does not: the only dated instrument in the material is Texas SB 6 (2025), which is already in force and therefore a past gate, and the guides carry no queue-audit date, energization milestone or Batch Zero target. If gap G6 (a large-load interconnection guidance module) is ever commissioned, a revision drawing on it should inherit that module's `reviewBy` instead
- **Verification** — `check-classroom-content.py`: 6 lessons, 3 tracks, 134 gate cases, **0 errors / 0 warnings** (every `{{term}}` resolves). `check-classroom-pipeline.py --base origin/main`: six paths changed, **two findings — P5 ×2** on the two registry insertions, the expected cost of a curriculum reorder. P1 did not fire: all six paths sit inside the contract's write set. And, as required, **no P3** — no gate symbol moved, so `gateDigest` was not refreshed. `--selftest`: 13 fixtures, **0 failures**. `node --check` on a `.js` copy of `Classroom.gs` and `node scripts/check-gas-inner-scripts.js`: clean. The gate derivation was additionally run against the real content — `the-fence-line` folds to `tracks`, analyst reads it, viewer is not admitted, and `aidc-grid-to-chip` lists it with `withheld=0`
- **Left deliberately untouched.** The five existing lessons still pin `concepts:profiler-concepts` at `2026-08-31`. Re-pinning them is not required by this lesson, and a pin that moves without a contradiction is the write G3 tells a pipeline run not to make; `the-aidc-power-chain` also keeps its membership in `aidc-power-primer` rather than being moved into the new track before `bridge-power` exists to sit between them

## [v04.31r] — 2026-09-02 09:46:09 PM EST

> **Prompt:** "Picking up from my last session, run gap G1 on Opus 5 Extra: add the ~30 concepts listed in CLASSROOM-CURRICULUM-PLAN.md §6 G1 to profiler-concepts.json in the registry's existing voice, run check-classroom-content.py to confirm no {{term}} warnings, bump only the repo version, and push. The first authored lesson (the-fence-line) follows in its own Opus 5 session."

**Gap G1 from the curriculum plan — data-only.** `Classroom.gs` and both embedding pages untouched; no GAS or page version bump, per the data-only rule that governs every `profiler-data/` write.

### Added

- **`live-site-pages/profiler-data/profiler-concepts.json`** — the 31 electrical, data-hall, and market-access terms named in `CLASSROOM-CURRICULUM-PLAN.md` §6 G1, taking the registry from 44 concepts to 75. Written in the registry's existing voice (one to three sentences, expansion → mechanism → why it matters to a seller, high-school-STEM baseline, no figures needing their own citation) and grounded in what the corpus already teaches rather than authored from scratch — the Eaton, Sinexcel, Vertiv, Black & Veatch, Bechtel and NVIDIA-architecture study guides and the guidance modules' own glossaries supplied the mechanics for hold-up time, selective coordination, the harmonics/power-factor pair, IEEE 519 at the point of common coupling, the CDU/cold-plate split, synchronous condensers and inertia, GOES as the transformer chokepoint, SSCB, BBU, busway, VRM, IRP, LTSA, the independent engineer, NOGRR 282 and SB 6. Entries merged alphabetically by slug as a pure insertion, so no existing entry moved or changed
  - Equipment and protection: `transformer`, `switchgear`, `busway`, `ats`, `selective-coordination`, `arc-flash`, `sscb`, `bbu`, `vrm`
  - Power quality and the physics referee: `hold-up-time`, `harmonics` (THD), `power-factor` (reactive power), `ieee-519`
  - Facility efficiency and cooling: `pue`, `wue`, `cdu`, `cold-plate`
  - Grid stability and the DC shift: `hvdc`, `synchronous-condenser`, `inertia`, `goes`
  - Compute and availability: `scale-up-scale-out`, `uptime-tier`
  - Contracts, diligence, and regulation: `commissioning`, `take-or-pay`, `ltsa`, `independent-engineer`, `irp`, `nogrr-282`, `sb-6`, `large-load-tariff`
- Aliases so the forms a lesson will actually write resolve to the same definition — `THD`, `scale-out`, `Tier III`/`Tier IV`, `IE`, `minimum take`, `reactive power`, `point of common coupling`, `automatic transfer switch`, and every acronym expansion. Checked against all 44 existing terms and aliases: zero collisions

### Changed

- Tracks 2–5 of the curriculum plan no longer need lesson-local glossaries for this vocabulary. `{{term}}` resolves lesson-glossary-first then the registry, so the first authored lesson (`the-fence-line`) can write `{{transformer}}`, `{{switchgear}}`, `{{GOES}}` and the rest with nothing local to carry; the same tooltips now reach study guides and dossiers, which share the registry

### Verified

- `python3 scripts/check-classroom-content.py` — 5 lessons, 2 tracks, 134 gate cases, **0 errors, 0 warnings**; no `{{term}}` resolves to nothing
- `python3 scripts/check-profiler-study.py` — 62 study guides + registry (75 concepts), **0 errors, 0 warnings**; registry shape, slug pattern, term/alias collisions and alphabetical order all clean
- File formatting is byte-identical in style to the pre-existing file (`json.dumps(indent=1, ensure_ascii=False)`), and the diff is 266 insertions with zero deletions — confirming no existing entry was disturbed

## [v04.30r] — 2026-09-02 08:41:24 PM EST

> **Prompt:** "Picking up from my last session, I confirm the drill card renders.
>
> Design the Classroom curriculum. This is a PLANNING session — produce a design document, not code. Do not edit Classroom.gs, do not author lesson JSON, do not commit anything except the plan file itself.
>
> READ FIRST: 1. repository-information/CLASSROOM-SCHEMA.md — the lesson/track schema and, most importantly, "The provenance stamp" and "Drill items and history" 2. .claude/rules/classroom-app.md — how a session authors a lesson, the content fence, the checkers 3. repository-information/PHASE6-CLASSROOM-DESIGN.md — the phase plan and the access matrix 4. googleAppsScripts/Classroom/Classroom.gs — read the five existing lessons in full. They are the quality bar and the house voice; match them.
>
> THE CONSTRAINT THAT SHAPES EVERYTHING: A lesson is not "what a model knows about transformers." Every lesson carries a provenance stamp — provenance.inputs[] — pinning the corpus material it was built from, and it inherits the STRICTEST gate of those inputs: profile:<slug> · study:<slug> · project:<slug> · graph:profiler-graph · concepts:profiler-concepts → gate "tracks" (analyst and up); guidance:<module-id> → gate "guidance" (contributor+); report:<report-id> → gate "reports" (admin only). Field notes can never be a source. A lesson you cannot stamp is a lesson that cannot exist here. So the real question is not "what would be nice to teach" but "what does this corpus support teaching, and where are the gaps worth filling."
>
> WHAT THE CORPUS HOLDS (verify these numbers yourself, don't trust the prompt): 89 company dossiers, 62 study guides (802 flashcards), 8 named projects (colossus, frontier, homer-city, hyperion, jupiter-nm, lighthouse, stargate, trimount), a 490-edge relationship graph; 44 concepts in profiler-concepts.json. They split along the two existing tracks: BESS — LFP, NMC, C-rate, BMS, PCS, EMS, thermal runaway, degradation, augmentation, duration, round-trip efficiency, sodium-ion, NFPA 855, UL 9540A, bankability; AIDC power — 800 VDC, SST, UPS, PDU, rectifier, GaN, SiC, medium voltage, N+1, microgrid, behind-the-meter, colocation, interconnection queue, grid-forming inverter, ERCOT, PJM, PPA, tolling agreement. 7 Industry Guidance modules (contributor+): power-infra-aidc-2026-08, bess-tech-fundamentals-2026-08, bess-bankability-2026-08, nvidia-800vdc-2026-08, utility-aidc-procurement-2026-08, china-policy-stack-2026-08, eo14420-bulk-power-2026-08
>
> WHAT EXISTS TODAY — five lessons, two tracks: bess-foundations: cell-to-container · duration-and-degradation · spec-sheet-decoded (guidance-gated); aidc-power-primer: the-aidc-power-chain · heat-is-the-constraint
>
> WHAT I WANT: I am one person learning this market well enough to sell into it. I have no strong view on which focus areas matter — that judgment is what I want from you. (a) TECHNOLOGY FOUNDATIONS is currently only BESS. It could span other technologies. Tell me which ones earn a place and which do not. (b) THE AI DATA CENTER WAVE — I want to understand every important piece of equipment along the grid-to-chip power flow: what each one does, how they interoperate, where the common failure points are and why they fail there, and anything else you think belongs that I haven't thought to ask for.
>
> DELIVERABLE — write repository-information/CLASSROOM-CURRICULUM-PLAN.md: 1. A recommended track structure. Argue for it. If you think the two existing tracks are the wrong cut of the material, say so and propose better — the two I have were a first guess, not a decision. 2. Per proposed lesson: id (kebab-case, permanent), title, one-line `short`, `group`, the provenance.inputs[] it would pin, the resulting gate, a section-by-section outline, and 2-3 sentences on why this lesson exists — what a reader can do afterward that they could not before. 3. Teaching order within each track. Registry order IS teaching order here; the study-next pointer walks it literally. 4. A gap register: things worth teaching that the corpus CANNOT currently stamp, and what would have to be added to Profiler first (a dossier, a study guide, a guidance module, concepts entries). This section is as valuable as the lesson list — it tells me what research to commission. 5. Your honest cut line: which lessons are the first five to build, and which are "later, if the first five get used."
>
> TWO THINGS TO KEEP IN MIND WHILE DESIGNING: Every lesson's flashcards and quiz items feed the spaced-repetition drill automatically (Classroom v01.09g). A lesson without drillable items teaches once and is forgotten; assume every lesson carries both. Section kinds available: prose, callout, table, proscons, timeline, bars, flashcards, quiz, ledger. Vary them — five prose sections in a row is a wall.
>
> Push the plan file on a claude/* branch under the repo's normal Pre-Commit and Pre-Push checklists. No app code, no version bumps beyond what those checklists require for a docs-only change."

**Planning session — design document only.** `Classroom.gs` untouched, no lesson JSON authored, no GAS or page version bump.

### Added

- **`repository-information/CLASSROOM-CURRICULUM-PLAN.md`** — the Classroom curriculum design. Corpus inventory re-verified from the files (89 dossiers, 62 study guides / 802 flashcards, 8 projects, 490 graph edges, 44 concepts, 7 guidance modules, 4 reports) and mapped to fourteen topic clusters with a public / guidance / thin verdict each. Argues the two existing tracks are the right *lanes* and the wrong *cut* (BESS stops at the product; the AIDC primer starts at the service entrance; the third lane has no track; both markets share an untaught electrical floor) and proposes **five tracks in three lanes**: `bess-foundations` (extended to 6), new `electrical-foundations` (5), `aidc-grid-to-chip` replacing `aidc-power-primer` (8, the equipment walk in physical order), new `aidc-campus` (4), new `market-access` (7) — 25 new lessons, 23 public and 7 guidance-gated, zero report-derived. Every lesson specified with a permanent id, title, `short`, `group`, the `provenance.inputs[]` it would pin and what it takes from each, the folded gate, a section-by-section outline with varied kinds, and why it exists. Teaching order fixed per track against how `clStudyNext_` actually walks. A 14-row grid-to-chip failure-point map (stage · failure · why there · who owns it · source guide) as the spec for the `where-the-chain-breaks` capstone. A 12-entry gap register naming what Profiler needs first (30 concepts entries; gen-set, UPS, switchgear and utility dossiers; two guidance modules) and what each unlocks. The cut line: first five (`the-fence-line`, `bridge-power`, `the-800-vdc-shift`, `the-control-stack`, `where-bess-plugs-in`), second and third waves, and a reasoned recommendation *against* report-derived modules. Eleven notes for the authoring sessions (Opus 5 per the standing decision, pin-on-read, `reviewBy` inheritance from guidance modules — `bess-bankability` is due 2026-10-01 — drill item arithmetic, section-kind variety, the analyst view as the acceptance test)
- README structure tree entry for the new file

## [v04.29r] — 2026-09-02 06:23:38 PM EST

> **Prompt:** "Where is the drill? Also, go over Classroom's current workflow and logic. \n\nAlso, I want to increase Classroom's actual curriculum. Right now, there are only five lessons across two focus areas and I want more lessons, but I have no idea how to populate them or which focus areas matter to me. Should I switch you to Fable 5.1 and have you help me think through which other lessons to add to fill out both Technology Foundations (currently only BESS, but could span other technologies as well) and The AI Data Center Wave (I would like to understand all other important pieces of equipment across the AIDC grid to chip power flow, how they work together, what are some common points of failure & why, and anything else you can think of)?"

**The drill shipped broken in v04.28r, and this fixes it.** The developer's screenshot showed no drill card. The
immediate cause was that the page had not deployed yet — but the deployed version would not have worked either.

### Fixed

**`cop=drill` could never succeed with the real corpus.** Session C had the client send its study-card
inventory to the server as an `inv` parameter. The shared GAS transport (`_gasPost`) carries every parameter
in the **query string** — there is no request body — and the real corpus is 802 study cards, which URL-encodes
to **~39,000 characters**, roughly five times what Apps Script accepts. The op failed, `clDrillStats` stayed
null, and `clRenderDrillCard` returned early every time. Silent by construction: a failed sync is
indistinguishable from "nothing due" at the UI.

The transport is shared by every app in the fleet and was not the thing to change. **The server now builds the
study half of the pool itself** (`clDrillStudyItems_`, Classroom v01.10g) — registry, then every
`<slug>.study.json` through `UrlFetchApp.fetchAll`, cached six hours as ids and hashes only (~23 KB, inside
the 100 KB CacheService value cap; card text is never cached). The page (v01.07w) sends nothing and fetches
text only for the guides the returned queue actually references — roughly ten fetches instead of sixty-three.

Three things improved rather than merely moved:

- **The gate surface shrank.** There is no client-supplied list to validate, cap, or trust — `clDrillAllowed_`
  now takes only the session
- **The hash comparison happens at queue time**, so a card whose text changed is re-introduced into the queue
  rather than only resetting when it happens to be graded
- **The client is lighter**, not heavier: one op plus a handful of guide fetches, versus 63 fetches at mount

`CLASSROOM-SCHEMA.md` and the `Classroom.gs` header comment are corrected to describe what the code does. The
checker's four study-containment cases are replaced by two that match the new shape (an unreachable registry
yields no study items rather than throwing; the build cap holds) — 134 gate cases, 0 errors. `gateDigest`
refreshed in the same commit.

### Worth recording

The bug is a good argument for the repo's own render-check discipline: every checker passed, `node --check`
passed, Playwright reported no page errors, and the feature still could not work — because none of those
exercise a signed-in session against the real deployment. The failure needed either arithmetic on the payload
size or a human looking at the page.

## [v04.28r] — 2026-09-02 05:45:44 PM EST

> **Prompt:** "implement Session C of IMPROVEMENT-PLAN.md"

**Session C: the drill (P1/C4).** The feature the whole plan is pointed at — the corpus already held ~855
flashcards and quiz items whose only retention mechanism was a card that flips when tapped. They are now a
scheduled queue with per-item history. `PHASE6-CLASSROOM-DESIGN.md` C4 is marked built, with the order note:
C4 was pulled ahead of C3 because the C3 → C4 sequence was a build order, not a dependency.

### Added

**`repository-information/CLASSROOM-SCHEMA.md` → "Drill items and history" — written first, as the plan
specified.** Item identity (`lc:` lesson flashcard, `lq:` lesson quiz, `sf:` study-guide flashcard, all
positional), the content hash and why it is a change detector rather than a checksum, the SM-2 grade table
collapsed to four buttons, both sheet layouts, and the four caps.

**`googleAppsScripts/Classroom/Classroom.gs` (v01.09g) — the drill backend.**

- **Two sheet tabs**, as the design doc predicted at C4: `ClassroomDrill` (one state row per account+item — the
  queue) and `ClassroomDrillLog` (append-only, one row per grade). The log is unread today and written from the
  first commit anyway, because it is the one thing that cannot be reconstructed later
- **`clDrillSchedule_` is pure** — previous state plus a grade in, next state out, no spreadsheet — which is
  what let it be unit-tested directly. 17 assertions: the 1 → 6 → ×ease progression, `Again` resetting to one
  day and incrementing lapses, `Hard` growing slower and `Easy` faster than `Good`, the 1.3 ease floor holding
  under repeated failure, and month-crossing date arithmetic
- **The gate rule is the progress store's, unchanged.** Lesson items are enumerated through `clLessonVisible_`;
  study-guide items are public Pages data the server does not hold, so the client sends the inventory it can
  see and the server validates by containment (slug in the registry, id shape, capped at 1200) — the same rule
  `Profiler.gs` applies to `study-<slug>` progress ids. `cop=grade` re-authorises against the *same* derivation
  `cop=drill` served from, so the two ops cannot drift on what counts as readable
- **A hash mismatch resets the schedule** rather than crediting it. This also absorbs the one failure mode of
  positional ids: a card inserted mid-array shifts its successors onto different text, the hashes stop
  matching, and those cards are re-introduced instead of inheriting a stranger's schedule

**`live-site-pages/Classroom.html` (v01.06w) — the drill surface.** A landing card above the study-next
pointer (what you are about to forget outranks what you have not yet read), the `#drill` route, and a
reveal-then-grade card — the two-step is the point, since rating recall *before* seeing the answer is what
makes the interval mean anything. Every card names its source; lesson cards link back to their section. The
study inventory is fetched with `cache: 'no-store'` throughout: a drill scheduled against a stale card is
worse than a slow drill, and these files change on every dossier refresh.

### Changed

**`scripts/check-classroom-content.py` — 12 new gate cases (124 → 136), no existing assertion weakened.** The
drill's pool is a new way to reach gated material, so it gets the same treatment reading did: per tier, every
drillable id must belong to a lesson that tier may open. Plus a positive control (admin's pool must be
non-empty, so the test cannot pass by the pool being empty), quiz-item enumeration, and four study-containment
cases (a registry slug validates, an unknown slug and a malformed id are refused, the inventory is capped).
The harness restores the stand-in registry after the drill block so the study-next assertions still run
against theirs.

### Verified

- **The gate assertion was mutation-tested.** Disabling the `clLessonVisible_` check in `clDrillLessonItems_`
  made the checker report exactly the leaks it is designed to catch — analyst reaching the guidance and report
  lessons, viewer reaching all five items. Restored, green. A gate test that has never failed is a test of
  nothing
- **Client and server hash implementations agree** on all five probe cases including unicode and a 5,000-char
  string, and the browser's value for `'abc'` (`3772q3`) matches the server's. They must: a disagreement would
  make every card look permanently changed and reset its schedule on every grade
- Playwright on the real page, plain and `?as=analyst`: **no page errors on either**, every drill function
  present, the preview role resolving correctly, `#drill` in the router, and `cache: 'no-store'` confirmed in
  the inventory builder. `?as=` is client-side preview only, which is why the substantive gate test is the
  server-side one above
- `gateDigest` refreshed in the same commit — `handleClassroomOp_` is a `GATE_SYMBOL` and gained two ops.
  Both checkers green; `node --check` on the `.gs` and both page scripts; `check-gas-inner-scripts` clean

## [v04.27r] — 2026-09-02 05:16:32 PM EST

> **Prompt:** "I don't want to use Sonnet for anything; Only Opus 5 or Fable 5.1. Since the rest of this build is recommended to be built with Opus and Sonnet, just go with Opus 5 for everything. Implement Session B of IMPROVEMENT-PLAN.md."

**Session B of the improvement plan: completion dates + computed deltas (P1 prerequisite + P2a/b).** Both
progress stores change from booleans to completion dates, and both apps grow the "what changed since you read
it" surface the dates make computable. `CLASSROOM-SCHEMA.md` has promised this since its first draft; the code
now matches the document rather than the document being aspirational.

### Changed

**`googleAppsScripts/Classroom/Classroom.gs` (v01.08g) — `cl_progress` values are completion dates.**
`clProgressWrite_` stamps `YYYY-MM-DD` instead of `true`; `clProgressVisible_` passes a valid date through and
normalises anything else to `true`. An existing value is never overwritten — re-ticking a completed section
must not move its date, or the delta resets on every repaint. **Legacy `true` is accepted forever and never
rewritten**: it means "completed, date unknown" and yields no delta. Stamping old ticks with today would
fabricate history *and* mark every pre-existing tick stale against every past revision, which is backwards.
That is the whole migration — the type widens, old values stand, the store dates itself forward.

- **`clStudyNext_` needed no change** — it was already truthiness-based, and a date is truthy
- **The date comes from `Intl` (`toLocaleDateString('en-CA', …)`), not `Utilities.formatDate`.** The progress
  store's only Apps Script dependencies are `PropertiesService` and `LockService`, which is precisely what lets
  `scripts/check-classroom-content.py` execute the whole region in Node against real fixtures. A third service
  would have bought a tidier call and cost the test. Falls back to UTC if the runtime lacks full ICU

**`googleAppsScripts/Profiler/Profiler.gs` (v01.34g) — same value change for `gd_progress`, plus
`dossier-<slug>` doc ids.** The `study-<slug>` containment branch is generalised to cover both prefixes: slug
must exist in the registry, section ids must match the kebab-case anchor pattern, per-doc tick set still capped.
Guidance modules keep the stricter enumerated validation. Same `Intl` stamp, same never-overwrite rule.

**`live-site-pages/Classroom.html` (v01.05w) — the delta renders.** `clSectionDelta` implements the schema's
rule exactly: the newest revision dated strictly after the completion date whose `changed[]` names the section.
Painted by `clApplyProgressUI` like every other progress-dependent state, so a sync landing after the render
fills it in. An amber strip on the section, an amber marker in the section nav, and the completion date on the
button's tooltip. Reworded sections never appear — only `changed[]` entries do.

**`live-site-pages/Profiler.html` (v01.80w) — read state and a computed changed-strip.** Read marks are one
progress doc per dossier (`dossier-<slug>`), with the **dossier's own `lastUpdated` as the section id**, so
"have I read the current one" is a key lookup and the roster needs nothing beyond the registry it already
fetches — the single-fetch roster design is preserved. The roster badge shows `✓ read` or `↻ revised`. The
changed-strip diffs the live dossier against the newest archived version and names the tabs that moved, with
`+N` counts on arrays; each is a button that jumps to that tab. It is **derived, and labelled as derived** —
Profiler dossiers carry no authored `revisions[]`, and this does not add one.

### Fixed

**`repository-information/CLASSROOM-SCHEMA.md` Freshness now describes the code.** The "(next slice)" hedges
are gone from both places they appeared, the stored value is documented as a date, the client-side computation
is named, and the legacy-`true` semantics are stated. R4's remaining page-comment drift is also cleared: three
`Classroom.html` comments still said progress ticks were "deliberately absent" and that the nav tick box was
"never filled". They shipped; the page is being bumped anyway, so they are corrected here.

### Obligations discharged

- **`gateDigest` refreshed** in `repository-information/classroom-pipeline-ledger.json`, in this commit, as
  `.claude/rules/classroom-app.md` requires of any developer session that changes the gate surface —
  `clProgressVisible_` and `clProgressWrite_` are both `GATE_SYMBOLS`. It was refreshed **twice**: the first
  refresh went stale when the `Utilities` → `Intl` change edited `Classroom.gs` again. A stale digest here is
  silent until next Wednesday, when the pipeline run would block on "the ground moved". `coveredThrough` and
  `lastRun` were left alone — they are the pipeline's own fields
- **`scripts/check-classroom-content.py` — two assertions updated, and one added.** Two progress checks
  asserted `is True` on the stored value, pinning the boolean contract this session deliberately replaces;
  their own failure messages say the intent is "a permitted tick did not read back" and "the stored tick was
  destroyed by the demotion rather than filtered" — presence and survival, not the value's type. They now
  accept a date **or** legacy `true` via a shared `_done()` helper. A **new** assertion requires that a tick
  written by this version reads back as a *string*, so the dating contract is now tested rather than assumed —
  the suite is stricter than before, not looser. Editing the checker is closed to the pipeline committer
  (contract §2/§4.5) and open to a developer session (`classroom-app.md`), which is what this is
- **Both checkers green**: `check-classroom-content` 5 lessons, 2 tracks, **124 gate cases, 0 errors, 0
  warnings** (123 before — the extra case is the new assertion). `check-classroom-pipeline --base origin/main`
  reports P3 only against `origin/main`, which is the pre-change base by definition; the head ledger matches
- **`node --check`** on both `.gs` files and on every inline page script; `check-gas-inner-scripts` clean
  across all 9 projects

### Verified

Playwright against both real pages: **no page errors on either**, and the new functions exercised in-page —
`clSectionDelta` returns the newest qualifying revision (`2026-09-01`, correctly preferring it over an older
`2026-08-01` match and ignoring a same-day revision that named a different section), returns null for a
revision dated *equal* to the completion (strictly after, as specified), null for legacy `true`, null for
unread, and null when `changed[]` does not name the section. `ovDiffSections` returned `overview, devs+1` for a
summary edit plus one added development. Remaining console messages are `file://` CORS artifacts (audio,
version polling, registry fetch), not defects.

The new UI was rendered against each page's real stylesheet, since the pages themselves are behind an auth
wall. That check earned its keep: the Classroom stale marker first shipped as `#9a6a12` against the existing
`--cl-accent` `#8a6d1f` — two colours close enough to read as a rendering glitch rather than a distinction.
Retoned to `#a1560b`, which is visibly warmer than the accent and measures 4.72:1 on the strip background.

### Housekeeping

- **`Profilerhtml.changelog.md` rotated** — it stood at 50/50, so the oldest date group (2026-08-18: v01.30w,
  v01.31w, v01.32w) moved to `Profilerhtml.changelog-archive.md` with commit-SHA enrichment on all three
  headers. Active file now at `Sections: 48/50`. SHA enrichment required `git fetch --unshallow` first: the
  session clone had 53 commits of history and the archive's own existing SHAs did not resolve against it

## [v04.26r] — 2026-09-02 04:48:45 PM EST

> **Prompt:** "CORPUS_TOKEN: [redacted — the developer supplied the value; it lives in the earnings-desk Routine prompt only, never in a repo file]. I confirmed this is the same value across Scraper and Profiler.\n\nThen, summarize where we are in the overall build plan, and recommend me the remaining build phases with recommended AI model."

**Session A of the improvement plan is complete.** The corpus token arrived, so the three steps v04.25r
deferred all landed: the desk Routine exists, it was hand-fired as a report-only dry run and reached the
repository, and the 22 per-company one-shots are deleted.

### Added

**The "Profiler earnings desk" Routine (`trig_01UyH77BMKJnxzBUZJ11ej6A`)** — weekdays 13:00 UTC (`0 13 * * 1-5`),
fresh session per fire, push + email notifications. Its prompt is the short one recorded in
`.claude/rules/profiler-app.md`: identity, the calendar path, a pointer to the rules file, the cap of three with
carry-over, the verify-published step, the calendar advance, the silent stand-down, and the report shape. It
carries `CORPUS_TOKEN` — the first scheduled Profiler session ever to do so, which is what switches the
Scraper→Profiler news-triage bridge on. Two prohibitions are explicit in the prompt: never write the token into a
file or commit, and never create, update or delete a trigger.

### Changed

**`.claude/rules/profiler-app.md`** — the "Status: the desk Routine is not created yet" block added in v04.25r is
removed, and the Routine id is recorded in the section's opening line. The section now describes what is actually
running.

### Removed

**The 22 armed per-company one-shot refresh Routines**, after the dry run confirmed the desk works: Applied
Digital, ABB, Tesla, Hitachi Energy, Core Scientific, Wärtsilä, Samsung SDI, Google, Microsoft, Meta, Equinix,
Amazon, LG Energy Solution, Quanta Services, Panasonic, CATL, Primoris, Constellation Energy, TeraWulf, Nebius,
Siemens Energy and Fluence. Their dates, confirmation status, cited sources and per-company watch items were
transferred to `profiler-refresh-calendar.json` in v04.25r before any deletion.

**The active Routine inventory is now six**, verified against the API: the earnings desk, the weekly Classroom
pipeline, the daily ACL health check, the monthly opportunity-report drift check, the quarterly Industry Guidance
review, and the quarterly private-company sweep. Zero per-company one-shots.

### Verified

**The dry-run fire** (`fire_trigger`, session `cse_01K7fDhNt5aaddkRjxm4T9La`, 20:29:57 → 20:35:33 UTC = 5m36s,
`SUCCEEDED`) ran with an appended report-only instruction: read the calendar, say what you would do, change no
files, make no commit. It read 10.8M tokens of context and left `main` at `73253cf` with no branch pushed — the
instruction was respected. The contrast with the convention it replaces is the point: the seven August refresh
runs lasted 2–4 minutes, spent ~5k output tokens, and never reached the repository at all.

**Cost note for the operator:** that read-only dry run cost **$6.24**. A real run refreshing up to three dossiers
will cost more. The cap of three per run is now a budget control as much as a scope control.

## [v04.25r] — 2026-09-02 04:23:00 PM EST

> **Prompt:** "Implement Session A of repository-information/IMPROVEMENT-PLAN.md — the earnings desk. [Full instruction: read §0, §2 P3, §4 R1/R4, §6, §7 Session A and §9 of the plan, plus profiler-app.md's "Scheduled Refreshes" and "News Triage" and SESSION-CONTEXT.md. Verify §9 items 1–3 and report before changing anything: today's first Classroom pipeline run's §5.4 report (refresh the ledger's gateDigest only if it says BLOCKED on P3, otherwise do not touch Classroom); why none of the seven August "Profiler refresh —" one-shots re-armed a successor and why IREN's run is ABANDONED; and whether those seven dossiers' financials.periods[] carry the H1/Q2 2026 period. Then build as one push train: (1) create repository-information/profiler-refresh-calendar.json per §2 P3, seeded from the armed one-shot prompts plus researched next dates for the seven that fired, with quarterly rows for the 21 private companies, and add its schema to PROFILER-SCHEMA.md; (2) create ONE recurring Routine, "Profiler earnings desk", weekdays 13:00 UTC, fresh session per fire, push + email — short prompt carrying the corpus token and nothing else, the cap of three with carry-over, the verify-published step, the calendar advance, the silent stand-down, the report shape; the fired session may update the calendar but never creates triggers. CORPUS_TOKEN: [not supplied — placeholder left blank; ask before creating the Routine]; (3) fire the desk by hand on today's calendar and confirm a silent stand-down; (4) only then delete the armed one-shots; (5) rewrite "Scheduled Refreshes" around the calendar and delete the "Currently armed" list; (6) fix the R4 drift — the Scraper brochure's rating/Calibrate advice (correct the brochure, do not flip SCRAPER_FEEDBACK_UI_ENABLED) — rebuild the brochure PDF and re-check the 1006 px page limit; (7) fold in the CHANGELOG entry and README tree row the plan commit skipped. Constraints: no app code, no schema field on a profile, no Classroom change beyond the gateDigest refresh if and only if §9 item 1 demands it; do not start Sessions B–E; if anything contradicts the plan's evidence, say so and stop.]"

**Session A of the improvement plan, partially complete.** The calendar, its schema, the rules rewrite and the
documentation drift all landed. **The desk Routine was not created** — its prompt must carry `CORPUS_TOKEN` and the
developer did not have the value to hand, so steps 2–4 (create the Routine, dry-run fire it, delete the 22
per-company one-shots) are deferred. The 22 one-shots therefore remain armed and are still the only thing scheduling
refreshes; `.claude/rules/profiler-app.md` carries a status block saying so, and the order to finish in.

### Added

**`repository-information/profiler-refresh-calendar.json`** — the report calendar that replaces 22 hand-armed
one-shot Routines. 50 rows: 29 public companies carrying `nextReport` / `confirmed` / `source` / `lastRefreshed` /
`watch[]`, and 21 private or unit-level companies carrying `cadence: "quarterly"` to mirror the existing sweep.
Seeded by reading all 22 armed trigger prompts in full — their dates, confirmation status, cited sources and
per-company watch items are now repo-resident and diffable rather than sealed inside trigger records. Names and
tickers are deliberately not duplicated; they resolve against `profiler-companies.json` by slug.

- **Seven rows are seeded overdue on purpose** — Sinexcel, EVE Energy, NVIDIA, Jinko, IREN, Sungrow and BYD carry
  the August report date that already published and was never folded in, so the desk picks them up on its first run
  (see the verification below). Each of their `watch[]` lists opens with the missing period, named explicitly
- **`repository-information/PROFILER-SCHEMA.md`** — new "Refresh calendar" section documenting the file: every
  field, the public-vs-quarterly row shapes, why names and tickers are absent, who writes it, and how a company is
  added or converted from a quarterly row when it lists

### Changed

**`.claude/rules/profiler-app.md` — "Scheduled Refreshes" rewritten around the calendar and the desk.** The
"Currently armed" list is deleted; it had been wrong since August. The section now specifies the desk's contract —
weekdays 13:00 UTC, fresh session, verify-published before writing, news triage inside every refresh, three
companies per run with carry-over, advance the row, and a silent no-commit stand-down whose report must still name
what it read. Two rules are stated that the old convention lacked: **the desk never creates triggers** (the
self-re-arming step is deleted, not moved), and **a stand-down must be distinguishable from a session that never
reached the repo**. The desk's prompt is recorded verbatim in the section so it can be recreated, with
`CORPUS_TOKEN` as a paste-at-creation placeholder. "News Triage — Scraper Corpus Bridge" is unchanged.

**Why the convention was reconsidered (§6 collision register, "P3 — one desk Routine").** The rules file now
carries the measured argument rather than a pointer to it: the self-re-arming one-shot chain failed 7 for 7 in
August, and the failure was invisible by construction because a one-shot that fires and does not re-arm leaves no
artefact the repo can see. Three properties are named and fixed — unreadable state, procedure copied into 22 places
and drifted several schema generations behind, and a corpus token that reached none of them. What the convention
protected — refreshes firing on the market's clock, not the operator's memory — is kept.

**Documentation drift (§4 R4).**

- **`repository-information/brochures/scraper.body.html`** — four corrections where the brochure taught a workflow
  the app no longer offers. `SCRAPER_FEEDBACK_UI_ENABLED = false` retired per-item 👍/👎 rating and the guided
  Calibrate pass on 2026-08-27 (D3), but pages 6–7 still instructed the reader to "rate the misses", listed
  Calibrate as a Tune control, coached that "thumbs-down is worth more than thumbs-up", and told them to
  thumbs-down a duplicate. The flag was **not** flipped — that is the developer's call and R2 may moot it; the
  brochure was corrected to describe the rubric as the relevance model and click-throughs, segment toggles and
  topic weights as the steering signals. The Calibrate row is replaced by "Why thin?", which exists
- **`repository-information/brochures/profiler.body.html`** — page 5 ("Staying current without being asked") was
  describing the per-company one-shot convention this commit retires, including the claim that "the chain does not
  quietly end". Rewritten around the desk and the calendar, and it now says plainly that the chain it replaced did
  end silently in August 2026. Not part of R4's list — this drift is created by the change itself
- **PDFs rebuilt** for both, and every page re-measured against the 1006 px limit `brochures/README.md` records.
  The first rewrite pushed Profiler page 5 to **1007 px**, one pixel over; two bullets were tightened and it now
  measures 989 px. All three brochures remain 8 pages

### Fixed

**`README.md` — the tree row for `repository-information/IMPROVEMENT-PLAN.md`**, skipped when the plan was
committed docs-only at `25b279c`, alongside a row for the new calendar. This entry also supplies the CHANGELOG
record that commit deliberately omitted: the plan itself (296 lines, §0–§9) is the three-app architecture review
for Profiler · Scraper · Classroom — measured ground truth, diagnosis, three flagship proposals, a second tier,
stop/remove/freeze items, the C3→C6 sequencing verdict, a rule-and-decision collision register, a session-by-session
build order, and the facts a build session must verify first.

### Verified before building (plan §9, items 1–3)

- **The first Classroom pipeline run** (fired 2026-09-02 11:17 UTC, `SUCCEEDED`, 3m39s) **landed no commit, pushed
  no branch, and left the ledger untouched** — `lastRun` still `null`, `coveredThrough` still `2026-09-01`, which
  is what the contract prescribes for a `STAND-DOWN`. The §5.4 report text itself was not readable from this
  session (no transcript tool), so the P3 question was settled directly instead: the gate digest recomputed from
  `Classroom.gs` matches the ledger's `gateDigest` byte for byte with all 32 symbols present, so the run **cannot**
  have blocked on P3. Per §9 item 1 that means no `gateDigest` refresh is owed and **Classroom was not touched**
- **Why none of the seven August one-shots re-armed.** Not a missing step: all seven prompts carried the re-arm
  instruction *and* the `REMINDERS.md` fallback. The runs did no work at all. None landed a commit, none created an
  archive version, and all seven dossiers still describe their reported period as pending. The six `SUCCEEDED` runs
  lasted 2m10s–6m37s; one measured session spent 5,071 output tokens and $0.36, which is one turn, not a refresh.
  The re-arm is the *last* step of a chain that never reached step 2 — which is also why no fallback reminder was
  written. **IREN is `ABANDONED`** because its session is still parked in `REQUIRES_ACTION`, holding an unanswered
  permission prompt for `find /home /root -iname "*profiler*"` — it was hunting for the repository checkout with
  nobody there to approve it. The desk's stand-down report requirement (name what you read) exists because of this:
  under the old design a no-op run and a correct quiet run were indistinguishable
- **None of the seven dossiers carries its post-earnings period.** All seven need re-doing, and all seven are
  seeded overdue so the desk's first run handles them: Sinexcel (H1 2026), EVE Energy (H1 2026), NVIDIA
  (Q2 FY2027), Jinko (Q2/H1 2026), IREN (FY2026), Sungrow (H1 2026), BYD (H1 2026). The 2026-08-30 mass pass moved
  `lastUpdated` on all 89 dossiers but added no figures — NVIDIA's dossier still reads "Q2 FY2027 not yet reported
  as of 2026-08-09", Sungrow's and BYD's "H1 2026 due late August", IREN's "FY report due Aug 27, 2026"

### Corrections to the plan's own evidence

- **There are 22 armed one-shots, not 21.** §0 says 21 and §2 P3 says "retire the 21"; the Routine API returns 22
  and `profiler-app.md`'s deleted "Currently armed" list held 22 (27 active Routines − 5 recurring). §0's own
  arithmetic is what gives it away. The calendar is seeded from all 22
- **Session A's exit criteria are not met.** One desk Routine and zero per-company one-shots both wait on the
  corpus token. The calendar is committed and the rules point at it

## [v04.24r] — 2026-09-02 03:52:35 AM EST

> **Prompt:** "I want you to review my Profiler, Scraper, and Classroom apps and come up with informational brochures on their functions, methodologies, and workflow are (output in downloadable PDF) with the intent to inform new users on what the apps can do, how they do it, and how the user can use them effectively.\n\nAlso, if I wanted you to come up with ways to improve them individually and synergistically, should I run that prompt on Opus 5 or Fable 5.1?"

### Added

**`repository-information/brochures/` — informational brochures for the three apps (PDF).** Three 8-page
brochures written for a new user: what each app does, the methodology behind it, the day-to-day workflow, and
how to use it effectively. Authored from the apps' own code and rules rather than from the design documents, so
the described behaviour is the shipped behaviour.

- **`profiler-brochure.pdf`** — the ten standard dossier sections and the surfaces beyond them; the two-stage
  research protocol (first-party exhaustive, then third-party to fill and check) and the four standing rules
  (labeled analysis, notes-are-not-sources, expectations honesty, standard treatment); field notes — the three
  capture channels, the 0–100 confidence bands and the promote/log triage; scheduled earnings refreshes,
  quarterly sweeps, the Scraper news bridge and archive-before-edit; the workflow and the six commands; the
  four-tier access matrix; and the current coverage across the eight categories
- **`scraper-brochure.pdf`** — the two daily editions and their three sections; the 35-outlet roster with the
  probe-before-adopt discipline and the blocked-vs-offline distinction; the scoring rubric (company 40 / topic 25
  / substance 20 / emphasis 15), the hierarchical segment gate, and the geographic multiplier with its
  load-bearing unmarked default; the seven-phase morning build, the held-back accounting and the ordered trim;
  the daily and weekly loops, the tuning controls and the seed-version trap; a symptom → diagnosis table; and the
  token-gated corpus bridge
- **`classroom-brochure.pdf`** — tracks, modules, briefings and study-next; the live curriculum (2 tracks,
  5 modules) and the nine source types with their gate consequences; the provenance stamp, the strictest-input
  fold and the four rules that hold it up; freshness pins, the weekly pipeline and the ≥3-items/≥2-sources
  briefing bar; the contradiction test and why wording is never a revision; how to study; and the C3–C6 roadmap
- **Build tooling** — `build-brochures.py` renders each `<slug>.body.html` fragment through the shared
  `brochure.css` (Letter pages, per-app accent colour) with headless Chromium. `README.md` records the rebuild
  command and the layout constraint that matters: pages are fixed-height with `overflow: hidden`, so content
  past ~1006px of the 1056px box is silently clipped — every page in all three brochures was measured against
  that limit and sits between 73% and 95% full

### Changed

- **`README.md`** — tree entry for `repository-information/brochures/` and its thirteen files

### Notes

- **Not deployed.** The brochures live under `repository-information/`, not `live-site-pages/`, because they
  describe gated internal surfaces (the access matrices, the corpus route, private note handling) that should
  not be published to GitHub Pages
- **`REPO-ARCHITECTURE.md` not changed** — the diagram carries no node for `study-prep/` or
  `industry-guidance/` either; content directories under `repository-information/` are outside its repo-wide
  architecture scope, and the brochures introduce no behaviour any diagram depicts
- No app code changed: Profiler stays v01.79w / v01.33g, Scraper v01.71w / v01.99g, Classroom v01.04w / v01.07g

## [v04.23r] — 2026-09-02 03:13:23 AM EST

> **Prompt:** "Picking up from my last session, run C2c — the authoring prompt on Fable 5.1 High as a fresh session: add an "Authoring a pipeline lesson" section to .claude/rules/classroom-app.md, written against CLASSROOM-COMMITTER-CONTRACT.md and the twelve assertions that now mechanically enforce it — in particular what makes newer material a contradiction under G3 rather than novelty, how to name revisions[].changed[] so P8's "differing sections == changed[]" equality holds, the G11 minimum-material bar for a briefing (≥3 qualifying items across ≥2 sources), and the three guarantees no checker can see (G2 read-before-re-pin, G7 ref resolution, §5.2 read-phase honesty). Read the contract and scripts/check-classroom-pipeline.py's assertion list first — the prompt is written to the checkers, not alongside them. Finish by deleting the "PRE-FLIGHT GATE — C2c" paragraph from Routine trig_017pcCGpj1fkNYcUyCXPY3Wd so the next Wednesday run is a real one."

### Added

**`.claude/rules/classroom-app.md` — new section "Authoring a pipeline lesson" (C2c).** The decision procedure a Classroom pipeline run follows, written to the twelve assertions of `scripts/check-classroom-pipeline.py` rather than alongside them — each rule names the assertion that judges it. Eight sub-sections:

- **The shape of a run** — a decision followed by at most one write: build the pin table from every lesson's `provenance.inputs[]` (the ledger never duplicates pins), fetch every distinct ref once and record the date read off the fetched document (unchanged / moved / unknown — the report's `Sources seen:` line), decide each moved source's lessons, decide the briefing, apply the P10 caps ranked by size of contradiction, then write
- **What makes newer material a contradiction (G3) rather than novelty** — a revision exists only when the run can write, per section id, *"section `<id>` teaches X; `<ref>` now says Y"* with X actually in that section's text and Y on the fetched document. Contradiction is a taught claim stated differently (number, date, direction, ranking, mechanism, who-does-what); supersession is the G8 report swap; novelty is briefing material, never a silent addition. **A source that moved without contradicting anything leaves the lesson untouched, pin included** — the pin is part of the lesson under G3, the re-examination next week is the intended idempotence, and the G8 swap is the only pin movement without a section change. Wording is never a revision: P8 compares each section's parsed JSON, so the safe practice is to copy unrevised sections byte for byte or not open the literal
- **Naming `revisions[].changed[]` so P8's equality holds** — `changed[]` is exactly the set of section ids present at both base and head whose parsed content differs: existing ids only (P7), newly appended sections never listed (P8 computes *differs* over the intersection, so naming one fails as "identical"), one entry appended per run (P7, P10), `updated` = run date, `reviewBy` from the new material's nearest dated gate and never before `updated` (G13), pins forward-only and only on inputs the revision drew on. **The fields outside `sections[]` that no assertion watches — `title`, `short`, `group`, `type`, `edition`, `tiles[]`, `glossary[]`, `schemaVersion` — are frozen for the run** (contract §3.1 item 2's closed list); a contradicted tile or glossary entry is reported under `Needs the developer`, not edited
- **The briefing — G9 and G11** — `edition` = the run date (the window is `(coveredThrough, runDate]`, so the run date closes it and makes `briefing-<edition>` deterministic under G10). A *qualifying item* is one dated, stated development carried by a document fetched this run with a date inside the window; a *source* is one distinct `ref`; undated registries are windowed by commit date and itemised by `git diff` against the file at `coveredThrough`. The bar — ≥ 3 items across ≥ 2 sources — is counted **after** the gate is chosen (an item left out because its source would raise the gate does not count); the run decides the edition's tier first and admits only inputs at or below it, corroborating gated items from public layers where they carry them. The ledger moves only with a briefing; no briefing from memory
- **A new module — the exception** — fundamentals that hold for months, one coherent gate, an existing lane, an explanatory section plus a check, no duplicate; appended to a track only when the track's stated outcome covers it. New tracks are reported rather than made
- **The three guarantees no checker can see** — G2 (every written date was read off the fetched document body — the dossier's own `lastUpdated`, never the registry row's; the §8 `ref@date` record makes it auditable), G7 (a per-prefix resolution rule: the parsed document's identity must match the id, a `corpus:` key must have come back on the route this run, a `guidance:` id must be in `guidanceDocs_()` at base), and §5.2 (fetch failure, parse failure, unrecognised shape, or a date older than the pin → unknown, lesson frozen and listed; a layer not read is *not read*, never "unchanged"; nothing filled from memory; retrying once is reading, retrying until it agrees is not)
- **The write, in the order the checkers read it** — the eight-step write from the literal inside the fence through `VERSION` (+0.01, P12), the version file, the generic-only GAS changelog (P11), the §8 CHANGELOG record, the two README lines, the ledger, the verification set run twice, and the commit
- **Assertion → the authoring rule that satisfies it** — a P1–P12 table pairing each assertion with the run's behaviour, closing with the note that G2, G7 and §5.2 are the run's word

### Changed

- **`.claude/rules/classroom-app.md`** — the "Unattended (pipeline) sessions" bullet now points at the new section as the run's decision procedure instead of at C2c as future work
- **`repository-information/CLASSROOM-COMMITTER-CONTRACT.md`** — §10 gains "Settled in C2c (2026-09-02)": where the authoring prompt lives, the readings it fixes (the G3 sentence test, `changed[]` as P8's differs set, `edition` = run date, the G11 item/source definitions counted after the gate, the frozen non-section fields, G2/G7/§5.2 as stated obligations), and that no number in G11 or §5.3 moved
- **`repository-information/PHASE6-CLASSROOM-DESIGN.md`** — C2 status: C2a, C2b and C2c done; the pipeline is live and the next Wednesday run is a real one
- **`CLAUDE.md`** Reference Files row and **`README.md`** tree entry for `classroom-app.md` — describe the new section

### Notes

- **Routine `trig_017pcCGpj1fkNYcUyCXPY3Wd` (Classroom curriculum pipeline, weekly)** — the "PRE-FLIGHT GATE — C2c" paragraph was deleted from its prompt after this push, so the run at Wednesday 11:00 UTC proceeds to the contract's own §5.1 pre-flight instead of standing itself down. The prompt is otherwise unchanged: no corpus token, 45-minute / 120-turn budget, the three READ FIRST documents in the same order
- No Classroom code changed — Classroom stays v01.04w / v01.07g, the gate digest is untouched, and the ledger (`coveredThrough` 2026-09-01, `lastRun` null) is left for the first committing run to write

## [v04.22r] — 2026-09-02 02:41:00 AM EST

> **Prompt:** "Picking up from my last session, run C2b — the pipeline machinery — on Opus 5 Extra, working the contract's §10 in order: expose a stable item key on the Scraper timeline route, decide the undated-layer signal for projects and concepts, add the content fence to Classroom.gs, write check-classroom-pipeline.py with its twelve assertions and a failing fixture for each, create the ledger, and only then arm the weekly Routine. Read CLASSROOM-COMMITTER-CONTRACT.md first."

### Added

**`scripts/check-classroom-pipeline.py` (new) — the diff-aware judge of `CLASSROOM-COMMITTER-CONTRACT.md` §7 (item 10.4).** Run as `--base origin/main` against the working tree; `check-classroom-content.py` validates a *state*, this validates a *change*.

- **P1** changed paths ⊆ the write set (§3) · **P2** the `Classroom.gs` diff lies inside `// CONTENT START` … `// CONTENT END` plus exactly the `VERSION` line (§3.1) · **P3** the gate surface digests identically base → head and matches the ledger's `gateDigest` (§4.2, §5.1) · **P4** `CL_PROVENANCE_REF_KINDS` / `CL_PROVENANCE_STRICTNESS` / `CL_PROVENANCE_CAPS` byte-identical, and no `note` (§4.3)
- **P5** every lesson, track and section id survives; registries and track `lessons[]` are prefix-preserving (§4.4, G12) · **P6** every surviving lesson's derived gate is unchanged, computed by running the snapshot's own PROJECT region in Node rather than re-implementing the fold (G6) · **P7** pins monotone, `updated` advances when content moved, exactly one `revisions[]` entry appended whose `changed[]` are real section ids, `reviewBy` ≥ `updated` (G1, G4, G5, G13) · **P8** `changed[]` equals the set of sections that actually differ, and a whitespace-only edit is an error (G3, G4)
- **P9** a new briefing's id names its `edition`, the edition sits in `(coveredThrough, today]`, and the ledger's watermark follows it (G9, G10) · **P10** blast-radius caps — ≤ 1 briefing, ≤ 1 module, ≤ 3 revisions, ≤ 1 track, no lesson revised twice (§5.3 step 6) · **P11** the deployed GAS changelog names no gated lesson title and no corpus ref (§3.2, changelog-security) · **P12** `VERSION` and `Classroomgs.version.txt` move together by exactly one step ([PC-GS-VERSION] #1)
- **`--selftest` runs thirteen fixtures**: one **positive** — a well-formed pipeline commit, which must report nothing — and one negative per assertion, each being the positive with a single forbidden mutation applied (a path outside the write set, an edit outside the fence, the gate derivation altered, a `note` prefix, a removed section id, an input that raises the gate, a backwards pin, an unnamed rewrite, a briefing behind the watermark, a fourth revision, a gated title in the public changelog, a double version step). The suite refuses to run if any of P1–P12 lacks a fixture. All 13 pass
- Parsing scans a *masked* copy of the `.gs` — comment bodies and string contents blanked, length preserved — so an apostrophe in a comment or a brace in a string cannot throw off brace matching, while byte-identical comparisons still read the original text

**`repository-information/classroom-pipeline-ledger.json` (new) — the pipeline's run record (item 10.5).** `coveredThrough` `2026-09-01` (the newest lesson `updated` at creation), `gateDigest` computed by the new checker over the 32 §4.2 symbols, `lastRun` `null` — no committing run has happened yet. Not deployed, so it may name gated identities.

**`repository-information/PROFILER-SCHEMA.md` — new section "Registry revision signals — the undated layers" (item 10.2).** The decision: `profiler-projects.json` and `profiler-concepts.json` are dated by **file commit date** (`git log -1 --format=%cs`), not a per-entry `updated`. A per-entry date cannot serve `concepts:profiler-concepts` at all — it is a whole-file identity like the graph — and a field a human must remember to set fails in the unsafe direction, where a forgotten date makes a changed source look unchanged. The file date over-triggers candidacy instead, which G3 ("contradiction, not novelty") and the blast-radius caps already bound. An undeterminable date (shallow clone) makes the layer **unknown** for that run, never "today" and never "unchanged".

### Changed

**`googleAppsScripts/Scraper/Scraper.gs` v01.98g → v01.99g — a stable corpus item key on the timeline route (item 10.1).**

- `scTimelineScan_` now emits `key` on every item: `scArticleKey_`'s base36 digest of the normalised URL, which is also the route's dedupe identity. Without it no `corpus:<item-key>` provenance ref could ever be written — the route identified items by `url`, and a URL can satisfy neither `CL_REF_RE`'s id charset nor a stable identity (http vs https, trailing slash and tracking query strings all name one story)
- The dedupe fallback for legacy rows whose signals blob predates `ak` changed from the raw URL to `scArticleKey_(url)` — the same fallback `scDigestEdgeCandidates_` already uses two thousand lines earlier. Consequence beyond consistency: two records of one story filed under different URL spellings now collapse to one row, and the emitted `key` is unique within a response

**`googleAppsScripts/Classroom/Classroom.gs` v01.06g → v01.07g — the content fence (item 10.3).** `// CONTENT START` / `// CONTENT END` now bracket the `clLesson<Name>_()` / `clTrack<Name>_()` literals and both registries, making the committer's in-file write set mechanical rather than a line range. No behaviour changed: the gate-surface digest is identical before and after.

**`scripts/check-classroom-content.py` — `check_fence()`.** Errors on any lesson or track literal, or either registry, defined outside the fence. Checked on every *state*, not only on a diff: a literal below `// CONTENT END` could never be revised by a run without tripping P2, and a new one written there would sit in the frozen gate region.

**`.claude/rules/classroom-app.md` — the `gateDigest` obligation is now actionable.** It names the gate surface (the 32 `GATE_SYMBOLS`, comments included), gives the command that recomputes and writes the digest, and tells a developer session to run the pipeline checker before pushing and refresh on a P3 mismatch. Adds the fence to "Where content lives" and both new checker invocations to the verification set.

**`repository-information/CLASSROOM-COMMITTER-CONTRACT.md` — §10 "Settled in C2b".** One row per handed item recording where each decision now lives, including **10.7 deferred**: the admin-only in-app "curriculum current through …" surface waits for C3 and the ledger is **not** mirrored into a Script Property — that would add a write target the checkers cannot judge, since a Script Property leaves no diff.

### Notes

- **The Routine is armed for Wednesday 11:00 UTC (07:00 ET), weekly**, fresh session per fire, `notifications: { push: true, email: true }`, prompt carrying the contract by path and a budget, no corpus token. **Its pre-flight stands the run down until C2c lands**: the prompt requires an "Authoring a pipeline lesson" section in `.claude/rules/classroom-app.md` and reports `STAND-DOWN` when it is absent, so the first fires are safe no-ops rather than curriculum authored without the C2c bar. Delete that one pre-flight line from the Routine prompt to lift it
- This developer commit **fails P1 by design** — it writes seven paths outside the committer's write set. No assertion was softened to make the repo pass
- Verification: `check-classroom-content.py` clean (5 lessons, 2 tracks, 123 gate cases, 0 errors, 0 warnings) · `check-classroom-pipeline.py --selftest` 13 fixtures, 0 failures · `node --check` on both `.gs` files · `check-gas-inner-scripts.js` 9 files, 86 blocks
- `Classroom.gs VERSION v01.06g → v01.07g` · `Scraper.gs VERSION v01.98g → v01.99g`

## [v04.21r] — 2026-09-02 02:01:40 AM EST

> **Prompt:** "Picking up from last session, run C2a — the unattended-committer contract — on Fable 5.1 Extra, as a fresh session, producing a written spec that pins down what the scheduled pipeline may write, what it must never touch (the provenance stamp vocabulary, the gate derivation, the AUTH region), how it fails closed, and what the corpus-delta computation must guarantee before a lesson is allowed to change."

### Added

**`repository-information/CLASSROOM-COMMITTER-CONTRACT.md` (new) — C2a, the contract an unattended Classroom pipeline run is held to. Design only; no pipeline code, no Routine, no version moved on any page or GAS project.**

- **§3 The write set (closed):** the *content region* of `Classroom.gs` only — the `clLesson*_()` / `clTrack*_()` literals and the two registries, which C2b fences with `// CONTENT START` / `// CONTENT END` — plus the `VERSION` line, the GAS version/changelog files, the repo CHANGELOG (+ archive), `repository.version.txt`, two lines of `README.md`, and a new pipeline ledger. Explicitly excluded even though sessions normally write them: `SESSION-CONTEXT.md` (weekly auto-reconstruction would flush the developer's handoff within two weeks under the 2-session cap), `REMINDERS.md`/`TODO.md`, `Classroom.html`, and the whole corpus under `profiler-data/`
- **§4 Frozen surfaces, each with its reason:** the AUTH region and template (shared across five projects, Chesterton's Fence), the gate derivation (every `CL_*` constant and `cl*` gating/progress/ops function — the derivation is frozen precisely so the stamp stays *checked* rather than *trusted*), the stamp vocabulary (no new prefix/kind/rung, no `note:`, no kind the prefix does not carry, no input the run did not read, no unresolved ref, no URL), permanent ids (section ids never removed — `clProgressVisible_` would erase the tick for every account), append-only tracks and registries (a reorder moves every study-next pointer), and **the gate of an existing lesson never changes in either direction** — new material at a different gate becomes a new lesson
- **§5 Fail-closed:** three outcomes — `COMMIT`, `STAND-DOWN` (repo untouched, silent, the Profiler drift-check precedent), `BLOCKED` (repo untouched, reported out of band via the run's final message, the Routine completion notification, and a `BLOCKED —` session title). Pre-flight blocks: identity/branch, a red baseline checker, gate-surface drift against the ledger's `gateDigest`, a schema bump without a contract update, a corpus token anywhere near a file. One attempt per run; the committer never edits its judge; blast-radius caps (≤1 briefing, ≤1 module, ≤3 revisions, ≤1 track per run); a budget overrun commits nothing
- **§6 Thirteen corpus-delta guarantees** (pinned baseline, read-before-re-pin, contradiction-not-novelty, meaning-not-wording, monotone pins, gate invariance, ref resolution, superseded-report swap, watermark discipline, determinism/no double-authoring, minimum material for a briefing, progress safety, `reviewBy` from the lesson's own gate) with a per-layer revision-signal table and a minimal ledger (`coveredThrough`, `gateDigest`, `lastRun` — pins stay in the lessons, the single source of truth)
- **§7 The diff-aware checker C2b must add** (`check-classroom-pipeline.py`, twelve assertions each with a failing fixture) and the three obligations no checker can assert; **§8** the CHANGELOG run record; **§9** interactions with the checklists and the other Routines (recommended cadence Wednesday 11:00 UTC, clear of Scraper, the Profiler drift check and the guidance quarterly); **§10** seven items handed to C2b/C2c

### Changed

- **`.claude/rules/classroom-app.md`** — path scope extended to the contract; new "Unattended (pipeline) sessions" section pointing pipeline sessions at it and giving developer sessions the one obligation that flows back (refresh `gateDigest` when the gate surface changes, once C2b creates the ledger)
- **`repository-information/PHASE6-CLASSROOM-DESIGN.md`** — C2 status note: C2a done, C2b/C2c not started
- **`repository-information/CLASSROOM-SCHEMA.md`** — Freshness section points at the contract for what an unattended run may do with the three dates
- **`CLAUDE.md`** — Reference Files row for `classroom-app.md` lists the new trigger path
- **`README.md`** — tree entry for the contract; `classroom-app.md` entry description updated

### Notes

- **Two findings for C2b surfaced while pinning the delta table:** (1) the Scraper timeline route returns `url` as an item's identity, which cannot fit `CL_REF_RE`'s id charset — a stable, charset-safe item key must be exposed before any `corpus:` ref can be written; (2) `profiler-projects.json` and `profiler-concepts.json` carry no per-entry revision date, so those layers cannot drive a refresh until `PROFILER-SCHEMA.md` decides between file-commit-date and a per-entry `updated`
- **Why a separate document rather than a section of `CLASSROOM-SCHEMA.md`:** the schema says what a lesson *is*; the contract says what an actor nobody is watching may *do to the repository* — different audiences (C2b/C2c build sessions and the weekly runs vs. any authoring session), and the contract cites the schema rather than restating it
- **`CHANGELOG.md` rotated** — the 2026-08-28 date group (27 sections, v03.21r → v03.47r) moved to `CHANGELOG-archive.md` with SHA enrichment for every header; counter 100 → 74
- Design pass on Fable 5.1 Extra per the model plan; no page, GAS, or data file changed, so no page/GAS changelog entry and no AFFECTED URL

## [v04.20r] — 2026-09-02 01:30:36 AM EST

> **Prompt:** "See attached screenshot - The Sign In button is messed up. Fix it. After clicking it though, the overlay did honestly report nothing logged yet. Then, recommend me to build C2's pipeline machinery — the scheduled Routine, the corpus-delta computation, and the commit-and-deploy path for authored lessons. Are you sure I should not upgrade to Fable 5.1 for this? I thought C2 was more complicated and important."

### Fixed

**`live-site-pages/Profiler.html` (v01.78w → v01.79w) — the Sign-ins button rendered on top of Reports.** Self-inflicted in v01.78w: the masthead buttons are absolutely positioned in a 40px slot stack, and folding `#ov-signins-btn` into `#ov-reports-btn`'s rule gave it that rule's `top: 124px` as well as its appearance, so both admin-only buttons landed at identical coordinates. The rule's own comment described the slot system; reusing it wholesale without reading it is what caused this.

- Appearance stays shared; the slot does not. `#ov-reports-btn { top: 124px }` and `#ov-signins-btn { top: 164px }` are now separate one-line rules, and the block carries a comment recording that **the stack order is the access matrix** — least restrictive innermost, most restrictive outermost, so a tier missing a capability sees a contiguous stack rather than a gap
- `#ov-header` gains `min-height: 194px`. The fifth slot's bottom (164 + 30) exceeded the masthead's natural content height, so the button overhung the double rule. The value is the slot arithmetic, commented as such, with a note that a sixth surface means raising it by another 40

### Verified

- A measuring pass in the browser rather than a look at a screenshot: all five buttons' bounding boxes read back, asserted pairwise non-overlapping, and asserted inside the masthead. Before the fix the assertion caught the overhang (button bottom 236 vs header bottom 222) that the eye would have missed; after it, five slots 40px apart with the rule clear below
- `scripts/verify-profiler-roles.py` re-run clean across all four tiers

### Worth noting

- **`Profilerhtml.changelog.md` is now at 50/50** — the next Profiler page change triggers archive rotation
- **`CHANGELOG.md` is now at 100/100** — at capacity, not over it. The next push crosses the line and rotation becomes mandatory

## [v04.19r] — 2026-09-02 01:21:25 AM EST

> **Prompt:** "build the Profiler sign-in log - I have renamed the Audit Log from \"Classroom\" to \"BESS/AIDC\"."

### Added

**Profiler sign-in log — the audit trail gets a destination and a window.** The writer already existed in the AUTH region; what it lacked was somewhere to write and a way to read it back. Both halves land here, as one slice, so the log is answerable in the app rather than by opening a spreadsheet.

**`googleAppsScripts/Profiler/Profiler.gs` (v01.32g → v01.33g)**

- **`ENABLE_AUDIT_LOG: true`** and **`AUDIT_LOG_SHEET_NAME: 'ProfilerSessionAuditLog'`** in `PROJECT_OVERRIDES`. The tab is renamed away from the template default deliberately: the workbook is shared with Classroom and the row schema carries no project column, so two apps appending to one tab would interleave with no way to separate them afterwards
- **`SPREADSHEET_ID`** set to the shared "BESS/AIDC - Audit Log" workbook, with the same in-place note Classroom carries: this does not make it an authorization source, because `checkSpreadsheetAccess` consults a project sheet's sharing list only when no Master ACL is configured, and `MASTER_ACL_SPREADSHEET_ID` is set
- **`handleSigninsOp_`** — session-validated, then **`roleAllowed_(sess, SIGNIN_ROLES)` with `SIGNIN_ROLES = []`**, so no role *name* qualifies and only the `admin` permission passes. The rows name every account that has touched the app, which is precisely what a contributor should not be able to enumerate; a denial is itself audited. Reads the tail only (`SIGNIN_MAX_ROWS = 300`) because the log grows without bound, and treats a missing tab as an empty log rather than a fault — the writer creates it on its first row
- Routed on `doPost action=signins` with the usual GET `api`/`op=signins` mirror

**`live-site-pages/Profiler.html` (v01.77w → v01.78w)**

- **`signins` capability**, admin-only, added to `OV_ROLE_CAPS`. A real capability rather than a hidden button, so the role verifier asserts it per tier alongside the other nine surfaces
- **`◷ Sign-ins` masthead button** and overlay, reusing the existing `#ov-guide-overlay` shell and `gdTable` primitive so the surface looks like Reports and Guidance rather than like a new app. Newest-first, exact local time plus a relative hint ("20m ago"), a summary line counting total entries and refusals, and a one-click refusals-only filter
- Refusal detection tests the **event** rather than enumerating results, because the writer's result vocabulary is open (`login_failed` alone carries several)

### Changed

- **`scripts/verify-profiler-roles.py`** — `signins` added to the matrix, the probe, the `CAPS` tuple and the printed table; the docstring records that unlike the static-JSON surfaces this one is a real data boundary. Run clean: `signins` shown for admin, hidden for contributor, analyst and viewer, with the per-account progress isolation and Technical Annex audits still passing
- **`googleAppsScripts/Classroom/Classroom.gs` (v01.05g → v01.06g)** — the `SPREADSHEET_ID` comment named the workbook by its old title. Corrected to "BESS/AIDC - Audit Log" with a note that it is now shared, one tab per app. Comment only; no behaviour change

### Verified

- Headless pass over the real page with a stubbed op: 11 checks green — the button appears for an admin, the overlay opens with all four fixture rows newest-first, the summary line reports "of 412 entries · 2 refused", relative times render, and the refusals filter narrows to 2 and restores to 4
- `verify-profiler-roles.py` full run: matrix correct across all four tiers, 89 dossiers audited, progress isolation intact

## [v04.18r] — 2026-09-02 01:10:32 AM EST

> **Prompt:** "build C1 — study-next pointer. Also, I created a Google Sheet called \"Classroom - Audit Log\" and its ID is \"16tt7n_1sEcOzLYOEOWZbkw81dva7i9zT6-1e5CTzXDk\". I would also like a way to keep track of which users are logging into Profiler; What is the best way to let me check? If there is a way to check in-app as an Admin, that would be preferable than making a new Google Sheet. If you think that's a bad idea, speak up."

### Added

**C1 is complete — the study-next pointer lands, and the audit trail is live.**

**`googleAppsScripts/Classroom/Classroom.gs` (v01.04g → v01.05g)**

- **`clStudyNext_()`** — the first unticked section, in the first unfinished lesson, in the first unfinished track. Registry order *is* teaching order, so walking it in order is the whole algorithm: no scoring, no recency, nothing to tune. An unreadable lesson is **skipped rather than ending the walk**, so a tier that cannot read lesson 3 is still pointed at lesson 4
- Computed server-side because the client holds lesson *cards*, which carry a section count and deliberately not the section ids — `clLessonCard_`'s shape is asserted by the checker precisely so section content can never ride along in an index. The server has the lessons, so it names the exact section
- Returned from **`cop=index`, `cop=progress` and `cop=setprogress`**, so the pointer is exact again the instant a tick lands without the page spending a round trip on it. The index answer now also carries the account's progress map, so a cold load paints ticks and pointer without waiting on the separate sync
- **`SPREADSHEET_ID` set** to the developer-created "Classroom - Audit Log". This activates the two loggers enabled in v04.17r: `SessionAuditLog` (sign-ins, failures, denials) and `DataAuditLog` (gated-lesson reads, progress writes), both tabs auto-created on first write. Commented in place: it is deliberately **not** the Master ACL spreadsheet, which is read on every sign-in by every project and already carries a contention retry loop — an append-heavy log does not belong in it. It also does not become an authorization source, because `checkSpreadsheetAccess` consults a project sheet's sharing list only when no Master ACL is configured

**`live-site-pages/Classroom.html` (v01.03w → v01.04w)**

- The **"Pick up where you left off"** card at the top of the index — "Start here" on a first visit, the lesson title as the link, and a subtitle naming the track, the next section, and progress through the lesson. Rebuilt on every repaint rather than patched, because a single tick can move the pointer to a different lesson
- **Section-level deep links**: `#lesson/<id>/<sectionId>` opens the lesson and scrolls to that section; a plain `#lesson/<id>` still starts at the top
- A null pointer only renders "Curriculum complete" **after** a sync has succeeded — before that, null means "not known yet", not "nothing left to read"

### Changed

- **`scripts/check-classroom-content.py`** — 11 new study-next assertions, 112 → 123 gate cases. Per tier: the pointer never names a lesson that tier cannot read, and a tier that can read nothing gets no pointer at all. Plus: a fresh account starts at the first section of the first lesson and is not marked resumed; an analyst that has finished its only readable lesson gets `null` rather than being pointed at the guidance-gated lesson behind it; a contributor in the same state advances to the next readable lesson; and a part-finished lesson resumes at its first unticked section. Verified by probe — removing the visibility skip from `clStudyNext_` fails three assertions immediately

### Verified

- Headless pass, 13 checks green: the card renders above the lanes, says "Start here" cold, deep-links to `#lesson/cell-to-container/what-a-cell-is`, scrolls past the top of the lesson on arrival, and after one tick advances to section 2 with "1 of 7 sections done"

## [v04.17r] — 2026-09-02 12:58:13 AM EST

> **Prompt:** "build C1 — per-account progress. Also, follow Profiler in folding an account digest into the shared cache key to avoid the trap Profiler experienced. I also want an audit trail before the C2 pipeline starts committing content on a schedule."

### Added

**Classroom C1, progress slice — per-account section ticks, and the audit trail switched on ahead of C2.** The `gd_progress` pattern ported from Profiler, with one Classroom-specific rule the original does not need: **progress is never a weaker gate than reading.**

**`googleAppsScripts/Classroom/Classroom.gs` (v01.03g → v01.04g)**

- **`cop=progress` / `cop=setprogress`** on the existing `action=classroom` transport, behind the same app door. Storage is one Script Property per account (`cl_progress:<email>` → `{lessonId:{secId:true}}`) — tiny blobs, no cross-project consumers, no spreadsheet round-trip per tick. C4's drill history will not fit this pattern, which is exactly why the design doc calls for a sheet-backed store there
- **Validation is built from what the session may READ**, not from the whole registry: `clProgressValid_` filters through `clLessonVisible_`, so a tier that cannot open a lesson can neither tick it nor discover its section ids by probing. Ticks for lessons an account can no longer read are **filtered out of reads but never deleted** — access can be restored, and progress is the developer's own history rather than resettable state
- A single tick (`id` + `sec` + `done`) and a batch `merge` (the page's first-sync migration) share one validated write path, under a script lock

**`live-site-pages/Classroom.html` (v01.02w → v01.03w)**

- Mark-as-understood per section, nav ticks with strike-through, per-row completion and a per-track rollup chip on the index. State is painted by `clApplyProgressUI` rather than by the renderers, so a server map arriving after either view has painted repaints it correctly
- **The account digest is in the storage key from the first commit.** `clProgressKey()` is `cl_progress_<digest>_<lessonId>` using Profiler's DJB2 of the session email. Profiler shipped a shared key and had to fix it in v01.40w after a second account signing into the same browser inherited the first account's ticks; Classroom never shipped the shared form, so there is **no legacy-key purge to port** — only the namespacing itself
- The server is authoritative once a sync succeeds; localStorage is the offline fallback, and a reply without a real progress object is treated as "sync unavailable" rather than an empty server map (adopting it would wipe the fallback)

**Audit trail (`PROJECT_OVERRIDES`)**

- `ENABLE_AUDIT_LOG` and `ENABLE_DATA_AUDIT_LOG` set to `true`. The `standard` preset ships both off; these are the supported per-project overrides and both writers no-op while `SPREADSHEET_ID` is a placeholder, so they are **inert until a spreadsheet is attached** — one ID away from live, nothing to undo if it never happens
- **Successful reads of gated lessons are now logged** (`dataAuditLog`, resource `classroom_lesson`, with the gate and tier). Denials were already audited by `clRequire_` / `clRequireLesson_`; who *opened* guidance-, corpus- or report-derived material was the missing half. Public-stamped lessons are deliberately not logged — every admitted tier may read them, so the row would carry no signal and only add volume
- Progress writes are logged too, and only when something actually changed (`wr.changed`)

### Changed

- **`scripts/check-classroom-content.py`** — the Node harness now stubs `PropertiesService` and `LockService` so the whole PROJECT region still runs, the stand-in lessons carry real sections, and 15 new assertions cover the progress ops. The headline invariant is asserted per tier: **the set of lessons a tier may tick equals the set it may read.** Also asserted: a denied tick changes nothing and does not appear in the returned map, a non-existent section id is not storable, a demotion hides ticks without destroying the stored value, un-ticking removes the section, and a session without a usable email cannot write at all. 97 → 112 gate cases. Verified by probe — removing the visibility filter from `clProgressValid_` fails six assertions immediately

### Verified

- Headless pass over the real registries with a stand-in server: 13 checks, all green. The two that matter — the storage key came back as `cl_progress_uvkee5i_heat-is-the-constraint` (digest present, shared form absent), and **a second account in the same browser saw "not started" with zero completed rows while the first account's progress was intact on return.** That is Profiler's trap, tested rather than asserted

## [v04.16r] — 2026-09-02 12:46:51 AM EST

> **Prompt:** "After clearAllAccessCache, I was able to sign in and the attached screenshot is what I see. If everything looks good, then recommend me to keep building the Classroom v1 app in phases + recommended AI model."

### Changed

**Classroom is live and verified, so the Phase 6 spec's status notes are no longer accurate — refreshed.** The developer's admin session was checked field-for-field against what the registries say the ops should return: 2 tracks, 5 lessons readable, section counts 7/7/6 and 7/7, the guidance badge on `spec-sheet-decoded` only, and no withheld line (admin withholds nothing). Every value matches, so the whole path — auth → ACL → `action=classroom` → stamp fold → renderer — is confirmed working against the live backend rather than fixtures.

- **`repository-information/PHASE6-CLASSROOM-DESIGN.md`** — two stale notes corrected. The Profiler-retune note still said "the rest of C0 … is still to build" when C0 shipped as v04.11r. The C1 note still said the registries were empty with four slices remaining; it now records both built slices (schema + stamp; first tracks + renderer) with their versions, states that the backend is deployed and verified end to end, notes that the provenance gate is now exercised by real content rather than only fixtures, and narrows the remaining C1 work to per-account progress + rollup and the study-next pointer

### Worth noting

- **No page or GAS version bump** — nothing that deploys was touched, so the auto-deploy webhook correctly stays quiet and Classroom holds at v01.02w / v01.03g

## [v04.15r] — 2026-09-02 12:41:49 AM EST

> **Prompt:** "I have set myself to TRUE in the MasterACL and confirmed that jonyang92@gmail.com is an Admin. Why then does my Classroom app not allow me to sign in? Fix it."

### Fixed

**The sign-in denial was a stale ACL cache, not a code fault — and the bootstrap sequence guarantees it happens on every new project.** `checkSpreadsheetAccess` reads its cache before it opens the spreadsheet (`if (cached !== null) { … return denied; }`) and caches denials under `access_<email>` for 600 seconds. `registerSelfProject()` creates a new project's ACL column on the very first page load and seeds every non-`developer` user to FALSE, so that same load denies the developer and writes `"0"`. Granting TRUE afterwards changes nothing until the entry expires, because the read never happens. The operational fix is `clearAllAccessCache()` from the editor; no code was wrong, so none was changed.

- **`.claude/rules/gas-scripts-reference.md`** — Setup Steps gains step 14: run `clearAllAccessCache` after granting yourself ACL access on a newly registered project, with the mechanism, the exact symptom (`code: not_authorized` while the sheet plainly says TRUE), and two sub-notes: how to tell a cached denial from `rate_limited` and `acl_unavailable` by the error code alone (and that `auditLog` no-ops while `SPREADSHEET_ID` is a placeholder, so the Executions tab is the only trail), and that a Role with no matching row in the `Roles` tab downgrades to viewer rather than denying — which on Classroom presents as a successful sign-in with no curriculum, looking like a rendering bug rather than an access one

### Worth noting (no change made)

- **The 10-minute denial TTL and the FALSE-seeding in `registerSelfProject()` were left alone.** Both live in the shared AUTH region propagated across five GAS projects, and the TTL is deliberate per its own comment. Making the first sign-in to a new project not self-deny is a real improvement, but it is template surgery affecting every project and belongs to its own decision, not to a "fix my login" request

## [v04.14r] — 2026-09-02 12:20:16 AM EST

> **Prompt:** "I literally copy-pasted the same GITHUB_TOKEN value from my Scraper GAS to my Classroom GAS. Check to make sure it is correct. Then, my Deployment ID is: AKfycbzgrjTjU_lRoMsBzH2CIjZsqXmoN9PJMqSYawhARg9FkvjmxbyX0k85X0Q6Ud9mL3gy Then, give me step-by-step instructions to close out deploying the Classroom GAS project. Then, recommend me to continue building out Classroom in phases with recommended Claude model."

### Added

**Classroom's deployment ID recorded — the bootstrap gap closed.** The GAS project has been created and deployed manually; recording its id is the second of the two touches that flow requires, and it is what turns every future push into a self-deploying one.

- **`googleAppsScripts/Classroom/Classroom.config.json`** — `DEPLOYMENT_ID` set (was the `YOUR_DEPLOYMENT_ID` placeholder). This is the single source of truth; the workflow's `Deploy Classroom` step reads it with `jq` at merge time and stops no-opping from this push forward
- **`googleAppsScripts/Classroom/Classroom.gs` (v01.02g → v01.03g)** — `var DEPLOYMENT_ID` synced to match, per [PC-GAS-CONFIG] #14
- **`live-site-pages/Classroom.html` (v01.01w → v01.02w)** — `var _e` set to the reversed + base64 `/exec` URL, so `_gasPost` finally resolves a base URL and `clApi` can reach the `action=classroom` ops

### Verified

- **The `_e` decode was checked end to end in a headless browser**, not just written: the iframe is created, `dataset.baseUrl` decodes to exactly the expected `/exec` URL, and the deployment id round-trips through `rev | base64` intact
- **The iframe layering seam, flagged last push as untested, now runs with a real deployment id.** With `_e` non-empty the template injects its fixed full-viewport iframe at `z-index: 1`; the curriculum still renders both tracks above it, and an `elementFromPoint` hit-test at a track title returns the page's own `H3` rather than the iframe — the `z-index: 2` decision holds and the template block still needs no modification
- **The deployment id's 72-character length was checked against the four already-deployed projects** rather than assumed: Receipts is also 72, MasterACL / Profiler / Scraper are 74, so the length is in range and the paste was not truncated

### Worth noting (no change made)

- **`repository-information/ENTERPRISE-SETUP.md`'s "Current GAS Auto-Deploy Token" record is stale and internally inconsistent** — its header says "5 GAS projects", its list names three, and its **Repository access** row reads `LightAISolutions/lightaisolutions` (the template repo) even though every `.gs` in this repo pulls from `LightAISolutions/Sales`. Profiler and Scraper, both deployed and self-updating, are absent from the list. Left unedited on purpose: correcting it means knowing which token each project actually holds, which is a Script-Property fact only the developer can read

## [v04.13r] — 2026-09-01 11:14:26 PM EST

> **Prompt:** "Picking up from my last session, assemble the first tracks from the existing corpus on Opus 5 Extra: author public-stamped modules from the study guides and concepts registry plus one guidance-stamped module that deep-links pre-C3, register them in clLessons_() / clTracks_(), pass check-classroom-content.py, then port the guidance renderer into Classroom.html so the index and lesson views render through the new action=classroom ops."

### Added

**Classroom C1, content + renderer slice — the first tracks, and the guidance engine ported onto them.** The schema slice shipped empty registries on purpose; this fills them from the corpus that already exists and gives the page something to render. Every `provenance.inputs[]` entry names a source that was actually read while authoring — the stamp is a record, not a citation of convenience — and one lesson is deliberately guidance-derived so the fold is exercised by real content rather than only by fixtures.

**`googleAppsScripts/Classroom/Classroom.gs` (v01.01g → v01.02g)**

- **Five lesson literals, four public-stamped and one guidance-stamped.** `cell-to-container` and `duration-and-degradation` (from `study:catl`, `study:sungrow`, `study:fluence`, `study:tesla`), `the-aidc-power-chain` and `heat-is-the-constraint` (from `study:eaton`, `study:vertiv`, `study:nvidia`), each with `concepts:profiler-concepts`; and `spec-sheet-decoded`, built on `guidance:bess-tech-fundamentals-2026-08` plus public inputs, which folds to `guidance` and so is contributor+ only. The schema doc's worked example is now a real lesson
- **Two track literals** — `bess-foundations` (3 lessons, Technology Foundations) and `aidc-power-primer` (2 lessons, The AI Data-Center Wave) — registered with the lessons in `clLessons_()` / `clTracks_()`, ordered by lane as `guidanceDocs_()` is in `Profiler.gs`
- **The gate now runs on real content, not only fixtures:** analyst sees `bess-foundations` with two lessons and `withheld: 1`, and `spec-sheet-decoded` never appears in their lesson index at all; contributor and admin see all five

**`live-site-pages/Classroom.html` (v01.00w → v01.01w)**

- **The guidance renderer, ported.** `clRenderSection` and the per-kind primitives (`clTable`, `clProsCons`, `clTimeline`, `clBars`, `clFlashcards`, `clQuiz`, `clBindTermTips`, `clFmt`, `clReviewChip`) are Profiler's `gd*` engine on a light palette, so one section vocabulary now serves study guides, guidance modules, reports and lessons. Progress ticks are deliberately absent — that is the next slice, and the nav marker is a bullet rather than an empty checkbox so the page does not promise an interaction it lacks
- **Index and lesson views over the `action=classroom` ops** — `clApi` rides the existing `_gasPost` transport (POST `action=classroom`, GET `api`/`op=classroom` fallback), so no new transport was introduced. The index groups tracks by lane, badges guidance/corpus/report-derived lessons, and shows a track's withheld count; `#lesson/<id>` hash routing makes a lesson bookmarkable and the browser's back button return to the index
- **A provenance strip** renders a lesson's stamp as typed identities rather than URLs; a `guidance:` input deep-links to `Profiler.html#guidance`, matching the masthead's own pre-C3 link, so no data depends on another app's routes
- **`--cl-measure`** unifies the masthead and curriculum column widths (C0 set the masthead to 900px when it was alone on the page); `#cl-app` paints above the template's fixed GAS iframe, which is left exactly as the template injects it because it carries the auth plumbing

### Fixed

- **Tooltip handlers were bound once per render onto a reused shell**, so a second lesson view stacked a click handler that re-hid the tip the instant the first showed it. Bound once per shell now — Profiler builds a fresh shell per document, which is why the original never hit this
- **The tooltip hid on any nested scroll.** The scroll-to-hide listener was capture-phase on `window`, so scrolling a table's horizontal wrapper — which happens when hovering a term inside a wide table — dismissed the tip immediately. Non-capture on `window` catches document scroll only, which is the intent (the tip is positioned from viewport coordinates and must not float away)
- **`{{Cycle life}}` in `spec-sheet-decoded` resolved to no definition**, rendering as a dotted term with nothing behind it. Added to that lesson's glossary, and `{{CRAC}}` / `{{CRAH}}` wired into the drill that names them

### Changed

- **`scripts/check-classroom-content.py`** now reads `profiler-data/profiler-concepts.json` and warns on any `{{term}}` that resolves in neither the lesson's glossary nor the public registry — the exact defect above, invisible in review and easy for C2's pipeline to reintroduce. Verified by probe: the warning fires and the run stays clean once the term resolves
- **`repository-information/diagrams/Classroom-diagram.md`** gains the curriculum sequence (index → gated lesson fetch → stamp enforcement → concepts fallback) and a Key Design Note for the ops, matching how `profiler-diagram.md` and `Scraper-diagram.md` document their data ops. The mermaid.live pako URL was regenerated and verified by decompression

## [v04.12r] — 2026-09-01 10:31:20 PM EST

> **Prompt:** "Picking up from my last session, build C1's track/lesson schema and its provenance stamp first, on Fable 5.1 High, before any renderer or progress work — it is the one irreversible decision in v1 (Phase 5 showed study.json v1 stays renderable forever behind an adapter), it must slot into clGateForProvenance_()'s existing vocabulary, and every lesson C2 later auto-authors inherits it."

### Added

**Classroom C1, schema slice — the track/lesson schema and its provenance stamp.** The one irreversible decision in v1, made before any renderer or progress code exists to lean on it. The stamp is designed to be *checked*, not trusted: a lesson declares its corpus inputs as typed refs whose prefix fixes the provenance kind, so the fold `clGateForProvenance_()` already performs runs on a vocabulary the data cannot misstate. Registries ship empty by design — the first tracks, the renderer, progress, and study-next are the remaining C1 slices, and every lesson C2 later auto-authors inherits this shape.

- `repository-information/CLASSROOM-SCHEMA.md` (new) — single source of truth: id rules, the provenance stamp (`provenance.inputs[]{kind, ref, date}`, the ref-prefix → kind table, fold semantics, no `note:` prefix by design), lesson schema v1 (`module` / `briefing`, guidance section-kind vocabulary, `reviewBy`, `revisions[].changed[]`), track schema v1 (gate is its lessons'; withheld counts; unreadable tracks are not enumerable), the freshness hooks C2 relies on, the `action=classroom` op contract, a worked example, verification and extension rules
- `scripts/check-classroom-content.py` (new) — parses every `clLesson<Name>_()` / `clTrack<Name>_()` strict-JSON literal out of `Classroom.gs`, validates both schemas and every stamp against the prefix table read from the `.gs` itself, checks registry membership and prerequisite cycles, then loads the PROJECT region into Node and asserts a 97-case truth table: stamp → gate fold, per-tier visibility, per-tier index filtering, card metadata never carrying sections, and every denial path throwing and audit-logging
- `.claude/rules/classroom-app.md` (new, path-scoped) + a CLAUDE.md Reference Files row — the authoring contract C2's pipeline sessions inherit: where content lives, never fabricate an input, never invent a parallel gate, freshness pins, verification before push

#### `Classroom.gs` — v01.01g

- `CL_PROVENANCE_REF_KINDS` — the ref-prefix table (`profile` / `study` / `project` / `graph` / `concepts` → public; `guidance` → guidance; `corpus` / `briefing` → briefing; `report` → report) and `clStampKinds_()`, which reads a lesson's stamp into the list the C0 gate folds and returns `[]` (→ deny) on a missing or empty stamp, a malformed ref, an unknown prefix, or a kind/prefix mismatch — a stamp is fully well-formed or it does not exist
- `clLessons_()` / `clTracks_()` registries (empty), `clLessonCard_()` metadata cards, and per-tier filtering (`clLessonIndexFor_`, `clTrackFor_`, `clTrackIndexFor_`) — a track is served with the lessons the tier may read plus a withheld count, and a track with nothing readable is not listed
- `handleClassroomOp_()` — read-only `action=classroom` ops (`cop=index|track|lesson`, mirrored on the GET `api` route) in the guidance-ops transport: session → `clRequire_(sess, 'tracks')` at the app door → `clRequireLesson_()` on the lesson's own stamp before any section text leaves the server

### Changed

- `PHASE6-CLASSROOM-DESIGN.md` — C1 carries a status note for the schema slice; `README.md` tree lists the three new files and Classroom's GAS version

## [v04.11r] — 2026-09-01 10:08:49 PM EST

> **Prompt:** "Start building Classroom v1 C0. When you are ready to start C1, then remember session, so I can build C1 on Fable 5.1 High in a new session."

### Added

**Classroom scaffolded as its own federated app — Phase 6, C0.** The design gate's first build phase: `setup-gas-project.sh` spawned the app from the auth template (own sign-in wall, Master ACL, deploy webhook, version and changelog files), then the v1 access matrix and the cross-links to Profiler were built on top. C0's other slice, the Profiler access retune, shipped ahead of schedule on 2026-08-31 as v01.75w / v01.30g and needed nothing here.

#### `Classroom.gs` — v01.00g (new)

- `CL_ROLE_CAPS` — the server half of the v1 matrix: admin holds `tracks`/`guidance`/`briefing`/`reports`/`pipeline`, contributor drops `reports` and `pipeline`, analyst keeps `tracks` alone, and viewer is not admitted to the app at all (decision 2). An unrecognised role collapses to viewer, so an unknown tier fails closed rather than inheriting the reading surface
- `CL_PROVENANCE_CAPS` + `clGateForProvenance_()` encode the provenance-gating rule before any content exists to gate: a lesson inherits the strictest gate of its inputs, folding a list of provenances down to the one capability its strictest input demands. An empty list, an unknown provenance, or a field-note provenance (deliberately absent from the map, per notes-are-not-sources) returns `''`, which callers must treat as deny
- `clRequire_()` / `clRequireLesson_()` — the gates C1's data ops call after `validateSessionForData`. Both throw rather than returning false, so a forgotten return value cannot serve gated content, and both write an audit-log entry naming the tier and capability

#### `Classroom.html` — v01.00w (new)

- Client half of the matrix mirroring `CL_ROLE_CAPS`, with `?as=<tier>` preview that only ever intersects with the real capabilities — it can subtract a tier's surface but never grant one
- A masthead (`#cl-header`) that renders only after a validated session and stays hidden entirely for viewer. It carries a link back to Profiler for every admitted tier, and, for guidance-capable tiers, a deep link into Profiler's guidance hub — the pre-C3 arrangement decision 6 called for, with no interim guidance route built
- The masthead is wired by wrapping the auth layer's `showApp()` from the project region rather than editing the AUTH region, so template propagation stays conflict-free, and the only call sits inside a `try`/`catch` so a cosmetic masthead can never break sign-in

#### `Profiler.html` — v01.77w

- A `🎓 Classroom` cross-link in the masthead, gated on the existing `study` capability rather than a new one: the three tiers holding `study` are exactly the three Classroom admits, so the two apps' matrices cannot drift apart at this seam
- The masthead stack was re-slotted so the least restrictive button sits innermost — Classroom at 4px, guidance at 44px, network at 84px, reports at 124px — preserving the existing invariant that a tier missing the outer buttons sees a contiguous stack rather than a gap

#### `scripts/verify-profiler-roles.py`

- Extended with a `classroom` surface across all four tiers, as the design document's verification expectations require of any C0 access-matrix change

### Verified

- `scripts/verify-profiler-roles.py` — all checks pass across the four tiers including the new Classroom column: shown for admin, contributor and analyst, hidden for viewer. Per-account isolation and the Technical Annex audit (89 of 89 dossiers) still pass
- `node --check` on `Classroom.gs` and `Profiler.gs`; `scripts/check-gas-inner-scripts.js` — 86 inner script blocks across 9 files parse cleanly
- Headless Chromium against `Classroom.html`: the capability matrix resolves correctly for all four tiers plus an unrecognised role, which fails closed; the masthead renders for admin, contributor and analyst and stays hidden for viewer; the guidance deep link appears only for guidance-capable tiers; an analyst requesting an admin capability is refused. No page errors on load
- Screenshot reads of both mastheads. The first Classroom render was near-illegible — the masthead had been styled for a dark shell after the version modal's colours were mistaken for the page's, on a page whose body is white — and was restyled dark-on-paper before commit. Profiler's re-slotted stack measures a clean 40px pitch with no overlap

### Notes

- `DEPLOYMENT_ID` remains a placeholder, which is the expected bootstrap gap: the ID does not exist until the GAS project is created and deployed once. The workflow's deploy step reads it at merge time and no-ops silently until it is filled in
- The scaffold labelled Classroom's README and architecture entries `[template]`. That matches Scraper but not Profiler, which carries no label — the repo holds both conventions today, so the script's output was left alone rather than settled unilaterally mid-phase

## [v04.10r] — 2026-09-01 09:22:14 PM EST

> **Prompt:** "continue with your recommendation"

### Fixed

**Twenty dossiers reported "its profile has not been generated" when the profile had loaded and the renderer had crashed.** The developer's screenshot showed Arevon's header — tag, as-of date, sourcing bar, 19 cited — above that message, which is the tell: everything above it is painted from the loaded JSON. A headless render of all 89 profiles through the page's own paint function reproduced it exactly: 69 rendered, 20 threw `x.background.forEach is not a function`.

- **Root cause, data side.** The schema has always specified `decisionMakers[].background` as `string[]`, but one authoring batch (the 20 dossiers revised 2026-08-30 — all eight pre-existing IPPs, four EPCs, four on-site-power suppliers, four supplier/integrators) stored it as a single prose string, and their archived snapshots have carried that shape since v2. Apex Clean Energy, written 2026-09-01 in the array form, was the only IPP that rendered — the pattern the developer noticed
- **Root cause, page side.** The dossier loader re-enters the render inside the fetch promise's `.then()`, so a render exception rejected the promise and landed in the `.catch` written for a missing JSON file — the message was true for a 404 and false for a crash

#### `Profiler.html` — v01.76w

- `ovBackgroundList(b)` — one reader for both shapes, used by the dossier card loop and the Word/PDF export loop. An array passes through (blank entries dropped); a string splits on line breaks, or, failing that, on sentence and clause boundaries (`. ` / `; ` followed by a capital, only after a lowercase letter, digit or closing bracket so `U.S. Army` and `Inc. and` stay whole), with trailing semicolons stripped. Fixed in the renderer rather than the 20 files because the Versions view renders archived snapshots, which keep the string form forever
- The cached-profile render path now runs inside `try`/`catch`; a render exception paints "loaded but failed to render — <error>" and logs the error to the console, so the next bad field cannot masquerade as an ungenerated profile. A genuinely missing file still gets the original message

### Verified

- Headless Chromium (the pre-installed `/opt/pw-browsers` build) rendering every profile through `ovPaintCompany`: **89 of 89** after the change, 69 of 89 before; the 20 previously-crashing dossiers now render their executive cards with the prose split into 1–3 bullets per executive; a deliberately malformed profile produces the new "loaded but failed to render — <error>" message on the cached path. No page errors on load; both inline script blocks parse

## [v04.09r] — 2026-09-01 08:40:12 PM EST

> **Prompt:** "Profiler Apex Clean Energy"

### Added

**Apex Clean Energy dossier (profileVersion 1)** — `live-site-pages/profiler-data/apex-clean-energy.profile.json`, schema v7, written in the active `intel-briefing` style from a two-agent research pass (Stage 1 first-party: ~80 company URLs including the newsroom back to 2016, the 2025 Impact Report PDF and the leadership page; Stage 2 third-party: 71 pages across trade press, ACP, Cleanview, law-firm and lender releases, county and PUC records, Ohio Supreme Court and bankruptcy-docket coverage). 77 cited sources, 47% first-party by the registry's provenance tiering.

- **What the dossier establishes.** A wind-heritage developer converted into a farmdown IPP under Ares Management: 12 GW commercialized, 3+ GW operating or under construction, 2 GW under management, $4.08B of project financing in 2025 plus $2.79B in January 2026 and a $1.05B corporate refinancing (October 2025) — all on traditional tax equity from J.P. Morgan, Wells Fargo, Goldman Sachs and Bank of America. The storage finding is the one that matters for this repo's lens: every operating Apex battery (Great Kiskadee 100 MW/200 MWh, Angelo Storage 100 MW/200 MWh, Cameron 16.4 MW) is a Powin system, Powin entered Chapter 11 in June 2025, and the first post-Powin award (Coldwater Storage, 75 MW/381 MWh, June 2026) went to Canadian Solar e-STORAGE — with Raven Storage (100 MW, financed January 2026) still unnamed. No incumbent integrator, a demonstrated willingness to buy Chinese-manufactured LFP, and a FEOC due-diligence framework stated in the 2025 Impact Report
- Seven product lines (wind, solar, storage, distributed energy, Powered Land, build/operate/trade services, dormant green fuels) with the v2 depth fields; three banded spec groups (battery fleet, 2024–2028 wind fleet with turbine OEMs, finance stack); 21 developments (September 2024 → August 2026); five confidence-tagged key judgments; 12 curated relationships (Meta, Google, Microsoft, Canadian Solar, FlexGen, GE Vernova, MasTec, Siemens Energy, NextEra Energy Resources, Arevon, Jupiter Power, Hithium — the last three as explicit non-links or conflation warnings); five policy regimes including a new `EO 14420 bulk-power system` entry and a state-siting entry, because county and state siting — not federal policy — is the demonstrated loss mechanism (Discovery Wind, Goose Creek, Emerson Creek)
- **Seven company-published leadership portraits** downloaded to `live-site-pages/images/execs/apex-clean-energy-<lastname>.jpg` (Young, Chernauskas, Perrel, Friesen, Case, O'Shaughnessy, Tetrault), each verified as an individual headshot before wiring. Three further decision makers (Hahn, Haug, Koziar) render as initials avatars
- Registered in `profiler-companies.json` (category `ipp`, domains `apexcleanenergy.com` + `apexcleanenergyproject.com`); `sync-profiler-registry.py` populated `srcTotal 77 / srcFirstPct 47 / kpiNorm false`; `build-profiler-graph.py` rebuilt `profiler-graph.json` (490 edges, 18 touching the new dossier, including derived edges to CATL, Tesla, Terra-Gen, Lightsource bp, VoltaGrid and ProEnergy from the dossier's own prose)
- `README.md` — new profile registered in the structure tree

### Note

- **Honesty flags carried in the dossier rather than resolved:** the Powin docket motion to reject Apex affiliates' supply and service agreements (17 June 2025) is known only from a search summary; the Plug Power PPA reportedly passing to NextEra is a single local-press item; the Ares minority-stake sale process is a single Infralogic report; the April 2025 Chief Development Officer no longer appears on the company leadership page with no announcement. Each is stated as unverified where it appears
- **Session start:** `SESSION-CONTEXT.md` was stale (v04.03r vs v04.08r) and was auto-reconstructed from this changelog in a separate `Session start: reconstruct stale session context` commit, bundled into this push per the Session Start Checklist

## [v04.08r] — 2026-09-01 05:38:51 PM EST

> **Prompt:** "I build a fresh manual build and clicked \"Why Thin?\" and got the attached screenshot. For what it's worth, I have never once successfully ran \"Why Thin?\" since it was created. It always gave me some excuse as to why it cannot deliver anything. Analyze what's going on and fix it."

### Fixed

**"Never once" was literally true, and the reason is on one line.** The report's 25-second client deadline set `settled = true`, and the success handler's first line was `if (settled) return;`. A reply landing at second 26 was **thrown away unread**. The comment on that very deadline promised the opposite — *"the request is left to finish; only the message stops pretending progress is being made"* — and the code did the reverse. Intent and implementation contradicted each other; the implementation won.

The history explains why nobody caught it. The first version read the entire intake tab and hung into the transport's 90 s + 90 s abort. The fix narrowed the read and added the deadline. So the report went from *hangs forever* to *gives up at 25 s and discards the answer* — never once through to a render, across two fixes. Each fix moved the wall; neither removed the discard.

**Why 25 s was too short is an inference, stated as one.** `Scraper.gs` is ~820 KB, and a cold Apps Script container compiles all of it before `doPost` runs — 10–20 s is plausible, and the transport's POST-then-GET fallback can pay it twice. The developer tests immediately after a deploy, which is precisely when every container is cold. Every other call in the app tolerates this because none of them has a deadline; "Why thin?" was the only one honest enough to give up, and the only one that punished the honesty by discarding the result.

#### `Scraper.html` — v01.71w

- The timer no longer settles anything. It rewrites the note with a **live elapsed count** from 8 s on ("Still reading — 14s. The desk may be waking up after a deploy…"), so a wait is visibly a wait and not a hang. The only things that end the request are its own resolution or the transport's rejection after its retries
- A transport abort (`no reply after 90s`) is now explained as the transport, with a retry hint — a second call after a deploy usually lands on a warm container
- The subtitle shows **desk time and round-trip time** side by side (`16 relevant of 112 scanned · desk 1.8s · round trip 10s`), so the next slow case is diagnosable from the panel: a large desk number is the sheet read, a large gap between the two is the transport

#### `Scraper.gs` — v01.98g

- `scDigestScoreRows_` **bounded to the newest `SCRAPER_ARCHIVE_SCAN_ROWS` (8 000) intake rows.** That constant's own comment lists "Why thin?" among the paths it already fixed — but this reader still read column 1 from row 2 to the end. With `SCRAPER_INTAKE_KEEP_EDITIONS = 240` and three editions a day, that column heads toward ~30 000 cells for a report that needs the newest hundred. Builds append, so a recent edition is in the tail by construction; one older than the window reports `no_intake` exactly as the other archive paths do
- `ms` — server-side wall time in the payload, feeding the subtitle above

### Verified

- **Late-result path, headless:** a mocked 10-second reply shows the live count at 9 s (no give-up wording), then **renders** with the source table, FERC row and silent-source list; a 1.5-second reply renders directly; a mocked `no reply after 90s` rejection shows the transport explanation. No page errors
- **Bounded reader, mock sheet:** a 30 000-row tab with the edition in the tail — all 51 rows found, id read capped at 8 000 cells starting at sheet row 22 002, span reads at the edition's true row; an edition older than the window returns nothing; today's ~1 500-row tab reads the whole column as before
- `node --check` on the `.gs`; both page inline blocks parse; `check-gas-inner-scripts.js` clean

## [v04.07r] — 2026-09-01 04:30:02 PM EST

> **Prompt:** "Unrelated to what you are asking me to do:
>
> * See attached screenshot. I am starting to accumulate more and more Editions on Scraper. I want a more organized, easier way to see, filter, and choose which type of Edition on which day I want to see on the main screen.
>
> Back to what you asked me to do:
>
> * I confirmed the five new sources and two new topics landed and are toggled on. Then, I ran a manual Morning Digest build and did not see any Federal Register notices amongst the relevant articles. That may not be a mistake though if there simply weren't valuable articles in the last 24 hours. How can you tell if it's working correctly?"

### Added

**"Is that feed working?" was unanswerable, and that is what the developer actually hit.** A source that fetched nothing and a source that fetched plenty of sub-threshold material both show up as *absent from the edition* — and they need opposite fixes. The score report already read `source` on every scored row and then aggregated it away, so the only questions it could answer were "how many came in" and "how many cleared the bar".

#### `Scraper.gs` — v01.97g

- `bySource` — per-source tally on the existing pass (no second read): items in, best score reached, how many cleared, and how many were backstop. **`best` is the discriminator**: a source with items and a best of 30 is being read and judged, not ignored
- `silentSources` — roster sources that produced no row at all this run, named from the roster rather than the tally, because an empty tally is invisible by construction: a loop can only count rows that exist. Retired sources are excluded
- Sorted by contribution then by how close the source came, which is the order a reader debugs in

#### `Scraper.html` — v01.70w

- **Source contribution table** in "Why thin?", with the silent-source list underneath and an explicit note that silence is normal for one window and a concern only across several builds
- **Edition picker rebuilt.** With one edition the flat `<date> · N relevant` list was legible; with three it produced rows of chips reading `2026-09-01 · 16 relevant` three times over, identical apart from a number that says nothing about which paper it is. Thirteen issues, unidentifiable. Now: grouped under an edition heading, **issue number first** (the thing that actually identifies an issue), weekday shown, and an edition filter with counts that re-renders from the cached list rather than re-fetching
- Weekend builds display **"unnumbered"** in the picker, matching the v04.01r numbering change
- `wdDigestMarkChip_` extracted from `wdDigestShow_` — the filter re-renders the list and throws the `on` class away, so the highlight has to be reapplied from a remembered id
- `wdDgDate_` parses the date key through `Date.UTC`, never the local timezone: `new Date('2026-09-01')` is UTC midnight, which west of Greenwich renders as Aug 31 and would label every chip a day early — the same trap as the delivery-gate helper in v04.00r

### Verified

- `node --check` on the `.gs`; both `Scraper.html` inline blocks parse; `check-gas-inner-scripts.js` clean
- Picker rendered headless against the page's real stylesheet using a 13-issue / 3-edition fixture matching the developer's screenshot: 4 filter chips with correct counts (All 13 · Morning 5 · BESS 4 · AIDC 4), 3 edition groups, 13 chips, 4 correctly marked unnumbered, 1 marked as open. Clicking the BESS filter narrowed to 4 chips and one group, with the filter chip active. No page errors

### Note

**No live-data conclusion is claimed here.** Whether the Federal Register feeds are contributing is a question this release makes *answerable in the app*; it does not answer it. Probed at authoring time, the FERC feed did carry items dated the same day, while the White House and DOE feeds' newest items were several days old — so those two legitimately had nothing inside a 24-hour window.

## [v04.06r] — 2026-09-01 03:41:19 AM EST

> **Prompt:** "The GAS shows v01.95g and nothing appeared, so everything's fine now.
>
> I know that Scraper only started building digests on 8/28/26, but on 8/26/26, the White House \"declared a national emergency\"(https://www.whitehouse.gov/presidential-actions/2026/08/declaring-a-national-emergency-to-secure-the-united-states-bulk-power-system/) that directly impacts the US BESS/AIDC industry. I want Scraper to be able to scan press releases from the White House, IRS, and other relevant government agencies as well, so as to not miss these kinds of TOP-PRIORITY news when they come out.
>
> I also want Profiler to build an Industry Guidance module based on this article as well."

### Added

**The roster was entirely secondary — thirty outlets reporting *on* government action, none reading it.** EO 14420 of 2026-08-26 names battery energy storage systems, grid-connected inverters and critical-infrastructure UPS as in-scope bulk-power-system equipment, and it reached the desk through trade coverage days later and only partially. A federal action is the one class of story where the primary text is both freely available and more useful than the coverage, because the operative detail lives in the definitions section trade pieces summarise away.

#### `Scraper.gs` — v01.96g

Five primary federal feeds, **every URL probed live on 2026-09-01** per `.claude/rules/scraper-sources.md` — status, XML body, item recency — never adopted from memory:

| Feed | Probe result |
|---|---|
| White House — Presidential Actions | `200`, XML, 30 items, newest 2026-08-28 |
| Federal Register — FERC | `200`, XML, 148 items, newest 2026-08-31 |
| Federal Register — IRS | `200`, XML, 33 items, newest 2026-08-31 |
| US DOE — Newsroom | `200`, XML, 10 items, newest 2026-08-24 |
| EIA — Today in Energy | `200`, XML, 21 items, newest 2026-08-28 |

**Validation that the gap is closed:** the White House feed was confirmed to contain the exact article the developer cited, at the exact URL. That feed would have caught it on 2026-08-26.

- Two topic seeds: `topic-bps-security` (the guidance-module seed required by `industry-guidance.md` step 9, using the order's **own** defined terms — "bulk-power system", "Covered Foreign Entity" — because implementing rules and trade write-ups quote them verbatim, making them far better discriminators than "grid security") and `topic-federal-action`, a standing seed kept **separate on purpose**: the guidance seed ages with its module, this one has to keep scoring the next executive order, which nobody has written yet

**Three federal sources retired rather than added**, with `SCRAPER_RETIRED_SOURCES` entries and rows in the rules-file table:

- `ferc.gov` — `403` with `cf-mitigated: challenge` and `server: cloudflare`, the exact blocked signature. **Not uncovered**: FERC orders are carried by the Federal Register feed, which is where they take legal effect anyway
- IRS newsroom — every documented address returns `404`; no feed is published. Covered via the Federal Register IRS feed
- EPA news releases — answers automated clients with an empty `202`, repeatably. Covered via the Federal Register

Per the rules file, no workaround was attempted for the Cloudflare-blocked feed.

#### `Profiler.gs` — v01.32g

New guidance module **`eo14420-bulk-power-2026-08`** (lane: Market Access & Bankability), authored from the primary text — nine sections (`prose`, `table`, `timeline`, `prose`, `proscons`, `callout`, `flashcards`, `quiz`, `ledger`), 4 tiles, 6 glossary terms, 7 flashcards, 5 quiz items, and a 14-row claims ledger where every row cites a section of the order rather than a secondary report.

- `reviewBy: 2026-12-24` — set from the module's **own nearest dated gate** (the §3(b) 120-day implementing-rules deadline), per the freshness rule, not a fixed cadence
- Timeline lane keys are `gen`/`deploy` so they resolve against `GD_LANE_COLORS`; verified in the browser as gold `#b18f35` and blue `#4f83e6` with **zero grey dots**
- Content-scope rule observed: guidance is to supplier and buyer **groups** (BESS suppliers and integrators, inverter/PCS suppliers, data-center developers and hyperscalers, developers and EPCs) — no single-company analysis. The order names no companies, so no statutory-list exception was needed

#### `repository-information/industry-guidance/`

- `eo14420-bulk-power-system-analysis.md` — the source of truth, with a claims ledger and an explicit "what the order does NOT say" section
- `sources/eo14420-bulk-power-system-2026-08.html` + `.txt` — the archived page and the extracted text the analysis was written against

### Verified

- `node --check` on both `.gs` files; `check-gas-inner-scripts.js` clean (8 files, 76 blocks)
- Statutory deadlines computed with `date -d`, not inferred: 120 days → **2026-12-24**, 180 days → **2027-02-22**, +90 → **2027-05-23**
- Playwright render via direct `gdRenderDoc(doc, host)`: 24 327 chars of markup, 25 table rows, 4 timeline dots in the two CVD-validated hues, glossary tooltips resolving, review chip rendering, **no page errors**

## [v04.05r] — 2026-09-01 03:24:56 AM EST

> **Prompt:** "I opened Scraper after GAS updated and I don't see a tile called \"5 errors logged\". Does that mean I have no errors now and everything's ok?"

### Fixed

**No — and the missing tile was a bug shipped in v01.94g, not a clean bill of health.** The developer opened the app expecting to read the five faults from the previous session and found no tile at all, which reads as "resolved". It was not.

`v01.94g` split the fault trail into two stores — `scDigestErrLog` (detail, capped at 20) and `scDigestErrTally` (hourly counts, exact) — and pointed `recentErrorCount` at the tally alone, because the tally is the accurate one. **The tally property did not exist before that release.** So on the first load after deploy it read empty, the count came back `0`, and the tile — which renders only on a non-zero count — hid. The five entries were still in `scDigestErrLog`, still filtered to the 24h window, still serialized into the `goLiveStatus` payload and sent to the browser. They were simply unreachable: the tile is the only thing that opens the panel that displays them.

Shipped the diagnostic surface and hid the diagnosis in the same release.

#### `Scraper.gs` — v01.95g

- `recentErrorCount` is now `Math.max(scDigestErrCount_(24), errInWindow.length)` — the greater of the hourly tally and the in-window length of the detail log
- The in-window filter is hoisted so the count sees **all** matching entries while `recentErrors` keeps its `slice(-SCRAPER_ERRLOG_SERVE)` cap for the payload. Counting the sliced array is what made the *original* `5 err/24h` a ceiling, so the fix must not reintroduce it at the other end
- **Right beyond the migration**, which is why it is `max()` rather than a one-off backfill: the tally is more accurate (it survives detail eviction) but more losable — cleared, corrupted, or newer than the log — and *every* failure mode of reading it alone points the same way, at silence where there are faults. The log's in-window length can only ever understate (it evicts at `SCRAPER_ERRLOG_KEEP`), so the larger of the two is never an overstatement and is never zero while any entry remains visible

### Verified

- `node --check` clean; `check-gas-inner-scripts.js` clean (8 files, 76 blocks)
- **11 cases**, opening with a reproduction of the developer's exact post-deploy state — a populated `scDigestErrLog` with no tally property at all: tally-only reports `0` (the shipped bug), the fix reports `5`, the 5 entries are still served, and the tile therefore renders. Then: 50 faults still counted exactly while only 20 details are kept and 8 served; a wiped tally cannot zero the tile while the log holds entries; an evicted log cannot zero it while the tally holds counts; and a genuinely clean install still reports `0` so no tile is drawn

### Note

The **`tick 20m ago`** in the developer's screenshot is real and is good news, independent of the above: the run tile is green and no longer `overdue`, so the hourly tick is completing again after having last reported eight hours earlier.

## [v04.04r] — 2026-09-01 03:16:00 AM EST

> **Prompt:** "Improve the syntax from \"5+ err/24h\" to something that actually explains what it is. Then, continue with your recommendation. I would prefer to be able to resolve any issues in-app rather than here in Claude."

### Changed

**One tile was answering two questions, and so answered neither.** `tick 8h ago · 5 err/24h` packed run freshness and a fault count into a single value line, sharing one amber — so a punctual tick with one logged hiccup rendered identically to a tick that had stopped running eight hours earlier. They are separate signals and are now separate tiles.

The developer asked for wording that explains itself, and for faults to be resolvable **in the app rather than here**. That second requirement is what shaped the rest of this change: a diagnosis that requires opening the Apps Script console is not resolvable in-app, so the trail had to become readable, copyable and clearable from the page.

#### `Scraper.html` — v01.69w

- **`err/24h` retired.** The window moved into the tile *label* (`BACKGROUND FAULTS · LAST 24H`), which frees the value line to be a plain count and a plain noun — `5 errors logged`, correctly singular at one. The two surviving occurrences of the old string in the file are inside the comment explaining why it was replaced
- **Run tile now says `overdue`** when the last scheduled run is older than the server's `tickOverdueMin`. The threshold is served, not re-derived in the browser, so the two cannot drift. The `Scheduler: Healthy` tile beside it only ever proved *the trigger is installed* — a different claim from "it completed", which is how a tick throwing every hour left both tiles green while nothing ran
- **The fault tile opens a panel** (`role="button"`, `tabindex="0"`, answering Enter and Space) listing each entry's time, originating step and message. `goLiveStatus` had always shipped `w` and `m`; the strip used nothing but `.length`, so the diagnosis was already crossing the wire with nowhere to be shown
- **Copy all** and, for digest managers, **Mark resolved & clear** — the action that lets a fixed problem return the tile to green. A health signal nobody can reset stops being read
- The panel reuses the held-back overlay's shell (`wd-hb-*`) rather than growing a second copy of the same rules; Escape closes it first, being the topmost layer

### Added

#### `Scraper.gs` — v01.94g

- **`scDigestErrCount_(hours)` — the count is no longer a ceiling.** `goLiveStatus` served `recentErrors.slice(-5)` and the tile printed its `.length`, so "5 err/24h" was a cap wearing the costume of a measurement: five and fifty rendered the same. Detail and count are now separate stores — the ring buffer keeps 20 entries because a Script Property value caps near 9 KB, while an hourly tally (48 buckets, pruned) gives an exact 24h total however many details had to be dropped
- **`clearDigestErrLog`** — manager-gated via `scCanManageDigest_`, audit-logged, registered in the allowed-ops list and the router
- New payload fields: `recentErrorCount` (exact), `tickOverdueMin`, `canClearErrors`; the served detail slice widened to 8

### Fixed

- **The silent-throw path in `scSchedulerTick`, closed — but not swallowed.** `scraperSs_()`, `ensureScraperTabs_()` and `scDigestScheduledTick_()` ran bare inside a `try`/**`finally`** with no `catch`. A throw from any of them skipped `scDigestNoteRun_('tick', 'ok')`, so the run stamp stopped advancing — and with nothing catching it, nothing reached the error trail either. The app then showed a stale run age with no error to explain it: precisely the "did it just not run?" question the Phase 2 trail exists to answer. Now logged as `tick.fatal` **and rethrown** — catching it outright would trade a visible failure for a hidden one, since a throwing execution is what triggers Google's own failure notification. `var` being function-scoped, the later `scDigestDeliverPending_(ss)` still resolves

### Verified

- `node --check` clean; `check-gas-inner-scripts.js` clean (8 files, 76 blocks); both `Scraper.html` inline script blocks parse
- **14 cases**: 50 errors in one hour counted exactly (the old path would have said 5) while the detail buffer stays bounded at 20; buckets outside the window excluded and included at 48h; tally pruning; both property values well inside the 9 KB cap; and the tile branch re-run against the screenshot's own numbers — `tick 8h ago · overdue` + `5 errors logged`, correct singular, no error tile when clean, and a punctual tick with faults no longer marking the run tile amber
- Panel rendered headless in Chromium against the page's real stylesheet — 5 rows, correct tile text, styling consistent with the existing overlays

## [v04.03r] — 2026-09-01 02:20:46 AM EST

> **Prompt:** "set up acl health monitoring"

### Added

**The sign-in outage is monitored now.** All three incidents were discovered the same way — the developer hitting a wall — and the v04.02r probe that would have caught each of them a morning earlier had nothing watching it.

#### `scripts/check-acl-health.sh`

- Probes `?action=api&op=aclhealth` on every deployed project that serves it and answers "can sign-in read the Master ACL right now?" in about two seconds. Exit **0** healthy, **1** unhealthy, **2** nothing-probed.
- **Exit 2 is a failure, not a pass.** A monitor that reports success when it checked nothing is worse than no monitor, because it is trusted. Nothing probed means either the probe reached no deployed project or the config files lost their deployment ids — both worth investigating.
- **The probed set is discovered, not hardcoded** — any `.gs` dispatching `op=aclhealth` is picked up, so adding the probe to another project enrolls it with no edit here. Projects whose `DEPLOYMENT_ID` is still the placeholder are skipped as not-deployed rather than counted as failures.
- **A non-JSON or empty body counts as a failure.** The probe is unauthenticated and always answers when the deployment is alive, so no answer means the deployment is unreachable — which blocks sign-in just as thoroughly as an unreadable ACL, and would otherwise have been swallowed as a parse error.
- Reports each project's **grace snapshot state** (users covered, age, armed or not) and exits **3** internally for armed-but-empty, surfaced as a non-fatal warning. Sign-in can be perfectly healthy while the safety net is not, and that specific combination is what turns the next lapse back into a hard lockout — it deserves to be visible before the lapse, not after.
- Optional project-name filter (`bash scripts/check-acl-health.sh receipts`, case-insensitive) for checking one app by hand.
- On failure it prints the repair inline — `diagnoseAuthorization()`, private window as the script account, approve every checkbox — and states plainly that an `acl_unreachable` permissions message is account-level, so the spreadsheet, its tabs and its rows are not worth checking. Past incidents lost hours to exactly that.

#### Routine — `ACL health check (daily)`

- `trig_01GeTqB8xp5nG8FCC139Bgr9`, cron `0 10 * * *` (06:00 ET), fresh session per fire, push + email notifications. Runs the script and is instructed to stay **silent** on a healthy run: noise on the ~364 quiet days is what trains someone to ignore the one alert that matters.
- **Deliberately outside Google.** A GAS-side time-driven check was considered and rejected: it would sit in the same account whose grant keeps lapsing — the one failure domain a monitor must not share with what it monitors — and `script.scriptapp` is systemically missing on pre-v01.82r projects, so such a trigger could silently never install and the absence would look exactly like health.

### Changed

- `.claude/rules/gas-scripts-reference.md` — the "Partial OAuth Grants" section now points at the monitor, so the next person diagnosing this checks it before re-deriving the mechanism.
- `README.md` — new script registered in the structure tree. `REPO-ARCHITECTURE.md` deliberately **not** changed: its diagram depicts the three *template* scripts only, and six existing utility scripts are already absent by that same convention.

### Verified

- `bash -n` clean; run live against both deployments — `Profiler v01.31g acl_ok`, `Receipts v01.29g acl_ok [grace: 16 users, 333s old, armed]`, exit 0.
- Every branch exercised against synthetic payloads rather than assumed: unhealthy (exit 1, renders stage/reason/detail), empty response (exit 1, `<empty response>`), healthy-but-unarmed-snapshot (exit 3), and the case-insensitive project filter.

## [v04.02r] — 2026-09-01 01:51:37 AM EST

> **Prompt:** "see attached screenshot. this is the third time this has happened to me with the Receipts app. fix it." *(with a screenshot of the Receipts sign-in screen showing "The sign-in service could not reach the access list, so it could not confirm your account. This is usually temporary — please try again in a moment. (code: acl_unavailable/acl_unreachable)")*

### Fixed

**An unreadable Master ACL no longer locks every user out.** Third incident of this shape; the first two were each diagnosed and closed environment-side, and nothing in the repo changed to stop the next one turning into a total outage.

**Live diagnosis, taken before any code was touched.** The Profiler deployment's `aclhealth` probe — a *different* Apps Script project reading the *same* ACL spreadsheet — answered `stage: "open"`, `reason: "acl_unreachable"`, `detail: "You do not have permission to call SpreadsheetApp.openById. Required permissions: .../auth/spreadsheets"`. Three things follow, and only the last one is repo-actionable:
- The spreadsheet is **not** the problem. The call never reaches it — it is refused before dispatch, so file sharing, tab names, the page column and row contents are all irrelevant here.
- It is **not Receipts-specific**. A second project on the same owning account fails identically, so the missing grant is account-level and every auth app in the fleet was denying every user simultaneously.
- It is **not fixable from this repo**. No commit can grant an OAuth scope; that is a one-time re-consent in Google (`diagnoseAuthorization()` → open the printed URL → approve **every** checkbox). This matches the partial-grant mechanism already documented in `.claude/rules/gas-scripts-reference.md`.

So the defect this push fixes is not the grant — it is that a grant gap produces a **total, silent, undiagnosable lockout**.

#### Shared AUTH block — `checkSpreadsheetAccess` (auth template + all 7 auth projects)

- **Last-known-good ACL snapshot.** Every successful read now stores the page's allow-list (`email → role`) in Script Properties; a read that fails on **both** attempts consults it before reporting an outage. `hasAccess: true` with `aclDegraded: true` where it vouches, the previous `acl_unavailable` denial where it does not.
- **Script Properties, not CacheService** — a cache entry can evaporate at any moment, and the snapshot is only ever worth having at the exact moment the ACL is unreachable.
- **Boundaries chosen so this can only ever reproduce a "yes" the real ACL already gave:**
  - An email **absent** from the snapshot is still denied. A user added during an outage waits — the safe direction to fail.
  - It **never denies** from the snapshot, so a removal is honoured the moment the list is readable again (within the existing 10-minute access cache).
  - A revoked user can therefore retain access for at most `ACL_GRACE_MAX_AGE_SEC` (24h) past the last good read. `ACL_GRACE_ENABLED = false` restores strict denial for compliance, accepting total lockouts. **This is a deliberate availability-for-security trade and is the one part of this push worth a second opinion** — Receipts runs the `hipaa` preset.
  - Every grace grant writes a `security_alert` / `acl_grace_grant` audit row carrying the reason, role and snapshot age, so a degraded period is reconstructable rather than silent.
- **The grace verdict is deliberately not cached.** A cached grant would outlive the outage by the full 10-minute access-cache TTL; leaving it uncached means the real ACL wins back the moment it can be read.
- **Snapshot writes are throttled** to roughly one per ten minutes by a cache marker — without it this would write a Script Property on every sign-in. The allow-list is built by a separate pass over the sheet data already in memory, because the existing lookup loop `break`s on the matched user and so never sees the whole column.
- Applied to `gas-minimal-auth-template-code.js.txt` and propagated to all seven auth projects per [PC-TEMPLATE-PROP] #19. The function was byte-identical across all eight files before the change (verified by hash) and is byte-identical after it.

### Added

#### `Receipts.gs` — v01.29g

- **`aclHealthProbe_()` + `GET ?action=api&op=aclhealth`**, ported from Profiler, which has had it since the last Profiler incident. Receipts did not — which is precisely why all three Receipts incidents cost an Apps Script editor round-trip to diagnose. It runs the same read sequence sign-in performs (`openById` → tab → data → page column) and names the failing stage. Unauthenticated on the same trust model as the deploy fallback: it returns only reason codes the sign-in screen already shows any visitor, plus the exception message with the spreadsheet ID redacted and capped at 200 chars — never emails, rows, or ACL contents. 60-second result cache so anonymous callers cannot burn Sheets quota.
- The probe also reports `grace` — whether a snapshot exists, how many users it covers, its age, and whether it is currently usable. Counts and ages only, never the emails. This puts "is anyone actually locked out right now?" in the same response as the failure reason.

### Changed

- `Profiler.gs` v01.31g, `Scraper.gs` v01.93g, `MasterACL.gs` v01.14g, `globalacl.gs` v01.08g, `testauthgas1.gs` v01.07g, `testauthhtml1.gs` v01.07g — shared AUTH block only; no project logic touched.

### Verified

- `node --check` (via stdin, since Node 22 refuses the `.gs` extension — it fails identically on an untouched file, so the extension error is not a syntax signal) clean on all seven `.gs` files.
- `scripts/check-gas-inner-scripts.js` clean — 8 files, 76 inner `<script>` blocks.
- The patched `checkSpreadsheetAccess` hashes identically across the template and all seven projects (`ef876136e831`, 11360 bytes), as it did before the change — so no project drifted.

### Notes

- **`CHANGELOG.md` rotated** — the file stood at 101/100, so the oldest date group (2026-08-27, 20 sections: v03.01r–v03.20r) moved to `CHANGELOG-archive.md` with commit-SHA enrichment on all 20 headers. Active file now at `Sections: 82/100`; archive at 220 sections.
- Session start reconstructed the stale `SESSION-CONTEXT.md` (recorded v03.99r vs actual v04.01r), bundled into this push.

## [v04.01r] — 2026-09-01 12:26:40 AM EST

> **Prompt:** "Don't count weekend builds as real archived issues. Then continue with your recommendation."

### Changed

**Weekend builds are stored editions, not issues of the paper.** `scIssueNumbers_` now ranks run-day dates only; an off-day date resolves to `0` (unnumbered) rather than being rounded up into the sequence.

#### `Scraper.gs` — v01.92g (numbering)

- `scIssueNumbers_` filters its date order through `scDigestDeliverableDate_`, and the `|| 1` fallback on the per-row lookup is gone — it would have turned every unnumbered edition into No. 001
- `scNextIssueNo_` returns `0` for an off-day build before touching the sheet, and off-day dates no longer advance the sequence for anyone else
- `scRenumberIssues_` treats `0` as a **real target** via `hasOwnProperty` rather than truthiness. This is what makes the fix retroactive: the pass already runs before every delivery, so the stored 2026-08-29 and 2026-08-30 builds lose their numbers and **Monday 2026-08-31 moves from No. 004 to No. 002** without anything being edited by hand
- `scRewriteIssueNo_` strips the `· No. XXX` segment when the number is `0` instead of returning the html untouched — the old early-return was right while `0` only meant "unknown", but `0` is now a decision, and it would have left a stale number printed on the stored weekend rows
- Masthead omits the issue segment when unnumbered; the delivery subject drops its `(No. XXX)` on the same condition (unreachable for a weekend build, which the off-day gate stops long before, but the subject must not lie if any other route reaches it)
- **Numbers stay dense.** Dropping Saturday does not leave a hole in the sequence — it closes one. A reader uses the number to tell whether they missed an issue, and 001 → 004 said "you missed two" when nothing was missed

### Added

**Same-story clustering** — the answer to the developer's third question from the v04.00r session. Their Monday edition carried the Microsoft DataOne turbine story and Vertiv's Q1 results several times over, each from a different outlet, each printed in full.

Two collapse passes already existed and neither could catch it: corroboration groups on a *loose* 8-word title signature but only to award a score boost — and it made the problem **worse**, because it promotes every copy, so the more outlets carry a story the more section slots it eats; the exact-normalized-title dedupe collapses only byte-identical headlines, which is the syndication case, not the same-story case.

#### `Scraper.gs` — v01.92g (clustering)

- `scStoryKey_` — the bucket: `section | anchor | publication day`, where anchor is a matched company slug, else a company name, else a topic. **No anchor means no clustering**, so an entity-less market story is never collapsed — the safe direction to fail
- `scStorySameEvent_` — event category (`sig.evt`) is a **separator, never a requirement**: two items with different non-empty categories can never merge, while two items with no category fall back to a stricter token test. Making it a required key component would have silently disabled the entire pass in `$0` fallback mode, where nothing is classified
- The lexical test counts **shared distinctive tokens**, not a similarity ratio. The real pair — *"Microsoft-backed AI data center faces backlash over alleged unpermitted turbines"* and *"DataOne AI campus ran unpermitted turbines, regulators say"* — shares three content words out of fourteen, a Jaccard of ~0.2. Any ratio threshold high enough to be safe would have missed the exact case this was built for
- `scSourceRankOf_` / `scRankBetter_` — representative picked on a lexicographic tuple, not a blended score: non-backstop first, then roster tier, then the outlet's hit rate (only once it has ≥20 intake rows, so one lucky article cannot outrank a tier-1 desk), then item score. **Click counts deliberately excluded** — too sparse, and the winning outlet would jitter between editions for no reason a reader could see
- `scClusterStories_` re-elects the representative on rank rather than keeping the top scorer, and carries the highest score in the cluster forward so collapsing can never demote a story out of its section
- Hit rates are tallied from the intake rows `scDigestItems_` **has already read** — `sourceStats()` computes the same figure with its own bounded read, and doing it again here would be a second pass over a tab just loaded in full
- Ordering is load-bearing: the pass runs *after* corroboration (before it, the boost would starve of group members — the trap the dedupe comment already warns about) and *after* the exact-title dedupe (before it, cluster slots would go to syndication copies that are not additional coverage)
- **Nothing is destroyed.** `alsoIn` renders each collapsed outlet as a link; `merged` carries the full items so `scDigestRenderStep_` puts them back into the held-back list and the weekly rollup — the one place a bad merge can be *noticed* rather than silently swallowed. `intake` and `relevant` counts stay **pre-cluster** so they remain comparable with earlier editions and with the Scraper UI, and a new `clustered` count states the difference in the footer

#### `repository-information/diagrams/Scraper-diagram.md`

- The Morning Edition pipeline arrow depicts the render step sequence this change inserts into, so the clustering stage was added between the AI-summary step and `sections`. The `pako` URL was regenerated per the mandatory procedure and verified by decompression — the decoded code matches the file's block byte for byte

### Verified

- `node --check` clean; `scripts/check-gas-inner-scripts.js` clean (8 files, 76 blocks)
- **15 clustering cases**: the three-outlet turbine story collapses to the tier-1 desk; same company + different event categories never merge; same company + same event + unrelated subject stays separate; entity-less stories never cluster; incidents never merge across sections; `$0` fallback mode still clusters on the stricter floor; a 5-article source cannot outrank a tier-1 desk; a backstop republication never wins; cluster size capped; different days never merge; a lone story is returned untouched
- **12 numbering cases** against the developer's actual August rows: Friday 001, Saturday and Sunday unnumbered, Monday **002 not 004**; a second week stays dense with no holes; editions number independently; `scNextIssueNo_` returns 0 for a weekend build and reuses the number on a same-day weekday rebuild; the masthead rewrite strips a stale number, renumbers 004 → 002, and leaves an already-unnumbered masthead alone
- The v04.00r off-day harness re-run clean, including both 2026 DST boundaries and the 365-day weekday sweep

## [v04.00r] — 2026-08-31 08:53:46 PM EST

> **Prompt:** "Picking up from my \"Morning Digests footer phase 1\" session, check how Monday's scheduled Scraper run went:
>
> * Jonyang92@gmail.com (admin) received three different emails (see first attached screenshot): one for Saturday, Sunday, and Monday. Regardless of whether or not I generated Editions over the weekend, the Monday routine should not email out the weekend Editions.
> * jymiasole01@gmail.com (analyst) received four different emails (see second attached screenshot): A BESS Edition from Saturday and Monday and an AIDC Edition from Saturday and Monday. This makes me feel like it only sent out the Saturday Edition because I generated one over the weekend. However, these weekend Editions should not be sent out on Monday.
> * All three Monday Editions had over 30 relevant articles over the weekend. Several of them were from different news sources covering the same topic (Microsoft's DataOne AI data center caught using unpermitted turbines, Vertiv's Q1'26 Fiscal Results, etc). Do you have any good ideas on how we can group articles from different sources covering the same topic together and just show the most reliable source (based on source stats)? I think it's possible that it's normal for Monday digests to have 30+ relevant articles, while normal weekday digests have about 12-15 relevant articles, so there may be no real issues with Scraper."

### Fixed

The **Monday 2026-08-31 06:00 ET run — the first unattended one — worked**; the delivery gate around it did not. Verified against the admin's mailbox: the Saturday (No. 002), Sunday (No. 003) and Monday (No. 004) editions were all sent between 07:01:56 and 07:01:59 AM EDT, i.e. by a single delivery pass, not by three.

Root cause: `SCRAPER_DIGEST_DELIVER_WINDOW_DAYS` (Phase 2, v03.9xr) widened the candidate set from "dated today" to "dated within three days and undelivered" to end a silent midnight give-up. That widening **split the weekday rule in two without anyone noticing**, because before it the two halves could not disagree — the only candidate was today's row, so a weekday `now` implied a weekday edition. `scDigestDeliverPending_` asks "is today a run day?" and always did; nothing asks "is the EDITION for a run day?". The weekend's manual builds were undelivered (the pass returns early on Sat/Sun), still inside the window on Monday, and mailed alongside Monday's own.

#### `Scraper.gs` — v01.91g

- `scIsoDayOfDateKey_(key)` — ISO day-of-week for a `yyyy-MM-dd` issue key. Deliberately **not** `new Date(key)` reformatted through `SCRAPER_DIGEST_TZ`: that string parses as UTC midnight, which in a western timezone is the previous calendar day, so a Saturday row would have read as Friday and passed the new gate. The y/m/d go through `Date.UTC` and the weekday is taken in the same frame — pure, node-testable, DST-proof. Returns `0` for an unparseable key
- `scDigestDeliverableDate_(dateKey)` — the edition's own day against `SCRAPER_DIGEST_RUN_DAYS`; an unparseable key returns `true` so unreadable rows behave exactly as before
- **Off-day gate in `scDigestDeliverPending_`**, applied in both the grouping loop (an off-day row can never become the `chosen` row) and the send loop. Honours `opts.force` the same way the existing hour and weekday gates do
- Off-day rows are **stamped `'off-day'`** in the Delivered column rather than skipped, matching the `'superseded'` / `'no-recipients'` pattern — an unstamped row is reconsidered by every hourly tick for the rest of the window, and the cell should say why it never went out

**The three-day window is kept, deliberately.** It is what carries a missed *Friday* edition to Monday's pass, which is the longest gap the weekday schedule can open and the exact silent-give-up it was added to prevent. Friday is a run day, so that rescue is untouched. The rule the window actually needed was narrower than it: an edition mails when **both** the day it is for and the day we are on are run days — only the second half was ever checked.

**Weekend builds are not stranded.** They are stored, numbered, archived and visible in the UI, and `emailLatestDigest` (the developer's "email me the latest") reads the newest row directly without consulting the Delivered column — so a weekend edition can still be sent by hand on demand. Only the scheduled weekday mailing excludes them.

### Changed

- The stale rationale at `SCRAPER_DIGEST_DELIVER_WINDOW_DAYS` ("a weekend manual build" listed as a case the window exists to rescue — the behavior now removed) and the `scDigestDeliverPending_` header comment both rewritten to record the two-day-questions split, so the next reader does not re-derive the same bug

### Verified

- `node --check` clean; `scripts/check-gas-inner-scripts.js` clean (8 files, 76 blocks)
- Ad-hoc node harness over the two extracted helpers: the four dates in evidence (Fri 08-28 deliverable, Sat 08-29 and Sun 08-30 not, Mon 08-31 deliverable), both 2026 US DST boundaries, unparseable keys, and a 365-day sweep of 2026 cross-checked against the platform's own weekday — all pass

## [v03.99r] — 2026-08-31 05:18:48 AM EST

> **Prompt:** "Picking up from my recent \"BESS/AIDC Phase 5 learning-layer unification\" session, before building Classroom V1, see the attached screenshot and fix the analyst-level users being able to access Network and Relationships in dossiers. I thought we changed that to Admins + Contributors only."

### Changed

Phase 6 **C0's first slice built ahead of the Classroom scaffold** — the Profiler access retune approved in the v03.98r design gate (`PHASE6-CLASSROOM-DESIGN.md`) but not yet coded. The developer's screenshot was correct behavior, not a regression: `OV_ROLE_CAPS` carried no `network` capability at all, so the Relationships tab and `#network` explorer were ungated for every signed-in tier.

#### `Profiler.html` — v01.75w

- `OV_ROLE_CAPS` gained four capabilities — `network`, `coverage`, `study`, `compare`. New matrix: admin all; contributor loses `fieldNote`/`versions`/`reports`/`style`; analyst additionally loses `guidance`/`network`/`coverage`/`export` (keeps `study` + `compare`); viewer empty
- **One capability, two doors** — `network` gates both `ovNetworkBtnShow()` and the per-dossier Relationships tab (`paneFor('rels')` is now inside the `ovCan('network')` branch, so an ungated tier gets no tab rather than an empty one). They cannot drift apart
- `ovDeniedView(main, what)` added: `ovRenderNetwork()` and `ovRenderCompare()` re-check their capability, so a bookmarked `#network` / `#compare/…` is turned away instead of trusting the hidden entry point
- Coverage 📰 button wrapped in `ovCan('coverage')`; Study guide fetch wrapped in `ovCan('study')`; roster compare chip wrapped in `ovCan('compare')` and given `id="ov-cmp-chip"` so the verifier can probe it
- Coverage overlay now renders `ROLE_DENIED` as "available to contributors and administrators" rather than falling through to the generic unavailable text
- Three stale "ungated / every signed-in tier" comments corrected — they were the standing record of the old policy

#### `Profiler.gs` — v01.30g

- `COVERAGE_ROLES` + `coverageAllowed_()` added; `guidanceAllowed_`/`coverageAllowed_` now share a `roleAllowed_(sess, roles)` helper
- `handleNewsOp_` captures the validated session and returns `ROLE_DENIED` for tiers outside `COVERAGE_ROLES`. **This is the one real boundary in the retune** — the corpus reaches the browser only through this proxy. The graph, study guides and compare read public Pages JSON, so their gates stay app-experience gates (the M3 data-relocation note in the Role + Access matrix comment)

#### `scripts/verify-profiler-roles.py`

- `EXPECT` extended from five surfaces to ten (adds `network`, `relTab`, `coverage`, `study`, `compare`); `CAPS` tuple drives the assertion loop so a future surface is one edit
- Probe reads `ov-network-btn`, `ov-tab-rels`, `ov-cov-btn`, `ov-study-btn` on the dossier and `ov-cmp-chip` on the roster load (the compare chip is roster-only — probing it on the dossier would have been a silent no-op assertion)
- **Deep-link assertions added** — walks `#network` and `#compare/zhonhen,abb` per tier and fails in both directions: a denied tier that renders, and an allowed tier that gets denied
- GAS stub now mirrors `handleNewsOp_`'s tier check; docstring notes why zhonhen is the probe company (has a study guide *and* 9 graph edges, so every column is a live assertion)
- Run clean: all four tiers, progress isolation, and the 88-dossier specs audit

#### Documentation

- `.claude/rules/profiler-app.md` — Role + Access matrix rewritten for the retune, including the one-capability-two-doors rule, the deep-link re-check, and which gates are real boundaries vs app-experience gates
- `repository-information/PHASE6-CLASSROOM-DESIGN.md` — retune section marked **BUILT**, with a status note recording what shipped and that the rest of C0 (Classroom scaffold, cross-links) remains
- `live-site-pages/html-changelogs/Profilerhtml.changelog.md` hit its 50-section cap, so the oldest date group (2 sections dated 2026-08-13) rotated to the archive with commit-SHA enrichment. Active file now at `Sections: 49/50`

## [v03.98r] — 2026-08-31 03:51:22 AM EST

> **Prompt:** "start the phase 6 design conversation"

The Phase 6 Classroom design gate, held and closed: four decision points put to the developer with recommendations, their answers reasoned through (including a reversed form-factor recommendation under new ecosystem context), and the approved design written as the executable spec for the build sessions.

### Added
- **`repository-information/PHASE6-CLASSROOM-DESIGN.md`** — the approved Phase 6 spec: Classroom as its **own app** (`Classroom.html` + `Classroom.gs`, federated via Pages data + token-gated routes — recommendation reversed from "Profiler mode" once the developer stated the growing-ecosystem/quality-over-economy context); audience admin/contributor/analyst (viewer excluded); "Everything" content under the **provenance-gating rule** (a lesson inherits the strictest gate of its inputs; field notes never become content); the approved **Profiler analyst-tier retune** (loses Relationships/Network, Coverage with a real server-side check, and Export; viewer strict dossier-only) executing as C0's first slice; phase plan C0–C6 with **v1 = C0–C2** (scaffold + learning core + scheduled curriculum pipeline with weekly briefing lessons and freshness deltas); **C3 — Guidance homecoming** (developer-proposed migration of Industry Guidance from Profiler.gs to Classroom, with the full migration checklist: ops, Admin lens re-hosting, mentions route, progress-tick export/import, Routine + rules re-pointing); C4 drills, C5 sales simulations, C6 team layer gated on a team existing; in-app runtime Q&A stays deliberately deferred
- **README tree** — entry for the new spec doc

## [v03.97r] — 2026-08-30 11:13:05 PM EST

> **Prompt:** "Picking up from my recent "BESS/AIDC market research system phase 4", build Phase 5 (learning-layer unification) per repository-information/PHASE5-LEARNING-LAYER-PLAN.md — study.json v2 on the guidance engine, the concepts registry, the v1 adapter (+ confirm the one-shot lift of all 62 guides), and the approved Layer 3 Scraper-seed rider in the same train."

Phase 5 — learning-layer unification: study guides now share the guidance engine's renderer and vocabulary (never its content channels or gates), the shared concepts registry is live, all 62 guides are lifted to v2 in one shot, and the approved Layer 3 Scraper-seed rider rode the same train.

### Added
- **Study Guide schema v2** (`repository-information/PROFILER-SCHEMA.md`) — sections use the guidance section-kind vocabulary (`prose`/`callout`/`table`/`proscons`/`timeline`/`bars`/`ledger` + study-only `flashcards`/`quiz`) with stable kebab-case ids; optional per-guide `glossary[]`; legacy top-level `flashcards[]` valid at v2; v1 stays renderable forever via the in-page adapter
- **`live-site-pages/profiler-data/profiler-concepts.json`** — the shared public concepts glossary (schema v1: slug/term/def/aliases), seeded with 44 core BESS/AIDC concepts (LFP, PCS, ITC, 45X, FEOC, NDAA §154, N+1, 800 VDC, SST, ERCOT/PJM, tolling, bankability, …). Study `{{term}}` tooltips resolve doc-glossary-first, then this registry; guidance modules keep their internal glossaries (role-gated content stays in `Profiler.gs`)
- **`scripts/lift-study-guides.py`** — the one-shot mechanical v1→v2 lift (heading/bullets → prose/ps, generated section ids mirroring the in-page adapter, flashcards and `lastUpdated` preserved, per-file losslessness assertions, `--check` mode). Run once: **all 62 guides lifted (384 sections, 802 flashcards), zero already-v2, zero skipped**
- **`scripts/check-profiler-study.py`** — the study-layer validator (v1/v2 shapes, per-kind section fields, unique ids matching the server progress pattern, slug↔filename↔registry↔profile agreement, concepts-registry shape + case-insensitive term/alias collision detection, `{{term}}` resolution): clean pass on the lifted corpus, wired into PROFILER-SCHEMA.md and the Prep Command as the mandatory post-write check
- **Named-project seed convention** (PROFILER-SCHEMA.md → Named-projects registry) — registering a project now adds a matching Scraper interest seed in the same commit

### Changed
- **`.claude/rules/profiler-app.md`** — Prep Command step 4 rewritten for v2 authoring: guidance vocabulary, concepts-registry registration instead of per-guide redefinition, `{{term}}` markup, mandatory checker run
- **All 62 `<slug>.study.json` files** — lifted v1→v2 (lossless; content and `lastUpdated` unchanged)

#### `Profiler.html` — v01.74w
##### Changed
- `ovShowStudy` renders through `gdRenderDoc` with a study shell: "Study Guide" kicker, as-of line replacing the source line when a doc carries no source meta, concepts-registry tooltip fallback (`ovConceptsLoad`, one cached fetch), covered-company chips, and per-account section/quiz progress under doc id `study-<slug>` (server-synced where the guidance ops allow, localStorage otherwise). New `ovStudyV2` adapter keeps schema v1 renderable
##### Removed
- The v1 study overlay renderer and its dedicated skin (`#ov-study-overlay`/`#ov-study-panel` halves, `.ov-flash`) — the Coverage overlay keeps the formerly shared skeleton

#### `Profiler.gs` — v01.29g
##### Changed
- `gdProgressWrite_` accepts `study-<slug>` doc ids alongside module ids: slug validated against the public registry (new `gdStudySlugs_`, 6h cache), section ids pattern-checked (`GD_STUDY_SEC_RE`), per-doc tick cap (`GD_STUDY_SEC_CAP` = 80) — study ticks sync cross-device without loosening the junk-params containment or the guidance role gate

#### `Scraper.gs` — v01.90g
##### Added
- Layer 3 rider: 8 named-project interest topic seeds (`source: 'project:<slug>'`) for colossus, frontier, homer-city, hyperion, jupiter-nm, lighthouse, stargate, trimount — insert-only sheet upserts, distinctive multi-word terms to avoid topic-band padding

## [v03.96r] — 2026-08-30 10:53:59 PM EST

> **Prompt:** "Continue with your recommendation, then remember session."

The Phase 5 handoff (the greenlit recommendation, executed as a fresh-session spec rather than an in-session build, per the recommendation's own framing) plus the session-context save.

### Added
- **`repository-information/PHASE5-LEARNING-LAYER-PLAN.md`** — the detailed Phase 5 spec, re-derived from the current codebase since only the one-line scope survived the gap-analysis transcript: current-state inventory (62 study.json v1 files / 384 sections / 802 flashcards vs the fetch-decoupled `gdRenderDoc` guidance engine), the build order (study.json v2 on the guidance section-kind vocabulary → renderer swap with a study shell → `profiler-concepts.json` registry → v1 adapter + optional one-shot lift → the approved Layer 3 Scraper-seed rider → docs/verification), open questions, and the Phase 6 Classroom design-gate boundary

### Changed
- **`repository-information/SESSION-CONTEXT.md`** — Remember Session: the strategic/Phases-0–3 entry rotated to Previous Sessions (2-session cap dropped the Scraper-reliability entry), new Latest Session covering v03.91r–v03.96r (Phase 4 build, fleet backfill, pin layer, report automation, this handoff) with the next-session recommendation `build phase 5`
- **README tree** — entry for the new plan doc

## [v03.95r] — 2026-08-30 10:42:56 PM EST

> **Prompt:** "I approve of your alternative: a drift-gated monthly Routine + library filters. Go ahead. Continue with your recommendation."

The report-automation build, all three approved halves: the baseline opportunity report, the library's search/filter surface, and the drift-gated monthly Routine.

### Added
- **Inaugural opportunity report** — `live-site-pages/profiler-data/reports/named-project-bess-attach--opportunity--2026-08-30.report.json` (intel-briefing style): BESS attach across the eight registered named projects. 15 scoped companies pinned at today's versions, 18 citations copied verbatim from dossier `sources[]` with derived party tiers, 5 confidence-tagged key judgments, a project-by-project pipeline table, the two proven attach lanes (owner-led Jupiter/Hithium Trimount; vendor-led Tesla at Colossus), a labeled-analysis whitespace callout, and 5 `indicators[]` that double as the drift gate's tripwires. Registered in `reports-index.json`; `check-profiler-reports.py` passed with 0 errors on the first run
- **Report library search + filters** (`Profiler.html` v01.72w → v01.73w) — title/topic/scope search box, type filter chips, and a Superseded toggle in the `#reports` view (superseded editions now sit behind the toggle instead of always trailing the list); new `.rp-lib-bar`/`.rp-lib-q` styles
- **Drift-gated monthly Routine** — `Profiler opportunity report — monthly drift check` (`trig_01TvnXREVHsQ4QCrtveYjvZM`, cron `0 17 1 * *` ≈ 1st of the month 9am PST, fresh session per fire; first fire 2026-09-01): counts scoped dossiers revised past the current edition's coverage pins and checks `indicators[]` via the Scraper corpus when a token is supplied; under 10 revised dossiers with no fired indicator it stands down silently, otherwise it authors a superseding edition opening with "What changed since the last edition". Documented as step 8 of the Profiler Report Command in `.claude/rules/profiler-app.md`

### Fixed
- **README tree report entries** — the reports block listed only one of the three 2026-08-29 report files; all four report JSONs (including today's) now have tree entries

### Notes
- Verified: Playwright renders of the filtered library (search narrowing to the new card, chips + Superseded toggle styled) and the report view's coverage table (15 pins, all at 2026-08-30); inline-script `node --check` clean; zero page errors
- The Routine's first firing lands tomorrow (2026-09-01 17:00 UTC) — expected outcome is a silent stand-down at near-zero drift, which doubles as the gate's live test

## [v03.94r] — 2026-08-30 10:31:34 PM EST

> **Prompt:** "Regarding Lancium Clean Campus / Abilene, mention it in stargate's registry note. Regarding the opportunity analysis report, my first instinct is to ask you to automatically generate one weekly every Monday 9am PST and create an organized way for me to easily search and filter through past versions. Do you think that's a good idea? If not, propose an alternative with reasoning. Once we are done, continue with your recommendation."

Pin-coverage Layers 1+2 per the approved recommendation, after a corroboration-verified read of every candidate relationship context. (The weekly-report question was answered as analysis — a drift-gated monthly Routine proposed instead of weekly wall-clock; nothing armed pending the developer's decision.)

### Added
- **Named-projects registry v2** (`live-site-pages/profiler-data/profiler-projects.json`; schema section updated in PROFILER-SCHEMA.md) — optional `parent` field for sub-campus rollup, plus five registrations: `hyperion` (Meta Richland Parish), `frontier` and `lighthouse` (Vantage, parent `stargate`), `jupiter-nm` (STACK Doña Ana, parent `stargate`), `trimount` (Jupiter Power/Hithium, Everett MA). Stargate's note now names the Abilene flagship as the Lancium Clean Campus (developer instruction). Denton deliberately NOT registered — all three CoreWeave-side engagements span multiple sites, so no relationship is ready to pin it (the registry's own rule held)
- **14 new project pins** across 9 dossiers (each archived + profileVersion +1): the Meta Richland Parish co-prime web (meta↔turner-construction/dpr/mortenson + GC↔GC partner links → `hyperion`), vantage→voltagrid → `frontier`, bloom-energy→oracle → `jupiter-nm`, hithium↔jupiter-power → `trimount`. Skips were deliberate: turner-construction→meta spans two campuses (stays unpinned), lightsource-bp↔meta is trade-press framing not stated service, amazon↔openai's "Frontier" is OpenAI's product, holder-construction's Hyperion mentions are absence-of-role observations
- **`scripts/scan-project-candidates.py`** — Layer 2: the standing corroboration scanner (20-name watchlist, distinct-dossier counts, flags unregistered names at ≥3 dossiers). First run: new-albany 8 (multi-operator OH cluster — needs a human split), denton 5, polaris-forge 4, lebanon-in/horizon-childress/fort-wayne/cwl1/clinton 3

### Changed
- **3 program pins refined to their specific campus** (pin-precision rule now in PROFILER-SCHEMA.md): stack-infrastructure→oracle and →openai `stargate` → `jupiter-nm` (the engagement is Project Jupiter itself), vantage→turner-construction `stargate` → `lighthouse` (the Turner-McCarthy JV builds Lighthouse phase 1). turner-construction→vantage and voltagrid→vantage keep `stargate` (multi-site engagements)
- **`Profiler.html` v01.71w → v01.72w** — ⚑ chip tooltips on sub-campus pins now name the umbrella program ("part of Stargate")

### Notes
- Post-write passes clean: registry sync (0 drift), graph rebuilt (curated edges carry the new pins), global v7 validation 42 pins / 0 errors
- Fleet pin count 28 → 42; every pin was verified against the relationship's own note/context before writing — 8 scanner hits were rejected as false positives or peer-comparison mentions

## [v03.93r] — 2026-08-30 10:07:41 PM EST

> **Prompt:** "Tesla's policy & regulatory exposure and xAI's "via Megapacks" and "Colossus" all showed up as intended. Backfill all the other dossiers with the new schema v7."

Fleet-wide schema-v7 backfill — nine parallel agents worked the 86 remaining dossiers, each strictly limited to what its dossier's own sourced prose supports.

### Changed
- **83 dossiers revised to schema v7** (`live-site-pages/profiler-data/*.profile.json`, each profileVersion +1, lastUpdated 2026-08-30) carrying, fleet-wide: **116 `policyExposure[]` entries** (FEOC restrictions and ITC/45X most common; DoD 1260H / NDAA §154 blocks on the Chinese suppliers — CATL, EVE, Hithium, CRRC, Huawei DP, Narada; coined regimes where the dossier supports them, e.g. FERC co-location precedent, Texas data-center standards, US offshore wind stop-work), **180 relationship `via` fields**, **28 `project` pins** (Stargate 26 — OpenAI 6, Oracle 5, STACK/Vantage/Turner/DPR/Crusoe/Samsung C&T/GE Vernova et al.; Colossus 2 — voltagrid→xai plus the existing xai→tesla; Homer City 1 — kiewit→ge-vernova), and **10 physical KPI overlays** (`gwh-shipped`: BYD 60, Sungrow 43, Sunwoda 25.6, Hithium 35.1 + 30.0; `backlog-gwh`: LG Energy Solution 140; `mw-contracted`: Applied Digital 1400, TeraWulf 522 + 839; `mw-energized`: QTS 2000)
- **3 dossiers legitimately untouched** — `core-scientific`, `hitt`, `holder-construction`: their prose names campuses and litigation but no policy regime, product line, or clean physical KPI; per the schema's absent-beats-forced rule they stay at their prior schema versions
- **83 outgoing versions archived** (`profiler-data/archive/`, index entries appended, README tree entries added) — archival driven from git history so every pre-backfill state is preserved
- **Post-write passes** — `sync-profiler-registry.py` (83 entries), `build-profiler-graph.py` (472 edges, curated edges now carry `via`/`project`, zero unregistered-project warnings)
- **CHANGELOG archive rotation** — this section pushed the counter to 101, so the oldest date group (2026-08-24: v02.93r–v03.00r, 8 sections) rotated to `CHANGELOG-archive.md` verbatim with commit-SHA enrichment on every header; active file 93 sections, archive 200

### Notes
- Global v7 validation: 0 errors, 1 benign warning (EVE Energy's DoD 1260H source is the dossier's own recentDevelopments source URL — dossier-internal, carried with the dossier's original verify-caveat). Statuses all in-enum, every pin registered, no metric carries both `usdMillions` and `qty`
- Agents also catalogued ~30 recurring unregistered project names (Meta Hyperion/Richland Parish, Vantage Frontier/Lighthouse, Project Jupiter/Stargate NM, TeraWulf Lake Mariner, Hithium Trimount…) — reported for a future registry decision, deliberately not pinned
- Verified: Playwright renders of CATL's policy tab and OpenAI's relationships with the real data (zero page errors); all 83 files parse; regime labels have minor cross-dossier drift ("DoD 1260H list" vs "listing", "US import tariffs" vs "US–China battery tariffs") — normalizable opportunistically later

## [v03.92r] — 2026-08-30 09:44:57 PM EST

> **Prompt:** "continue with your recommendation"

First real schema-v7 data — the Tesla and xAI dossiers backfilled so every Phase 4 surface renders live.

### Changed
- **Tesla dossier → schema v7, profileVersion 6** (`live-site-pages/profiler-data/tesla.profile.json`; outgoing v5 archived as `archive/tesla.profile.v5.json` with an index entry) — added `policyExposure[]` with two regimes built strictly from the dossier's existing sourced prose: `US–China battery tariffs` (in-effect; China-sourced CATL cell dependence and multi-sourcing exposure, with the stated onshoring sequence — Sparks NV, EVE Malaysia, LG Lansing, Megafactory Shanghai — as mitigation, TeslaNorth source) and `FEOC restrictions` (in-effect; CATL-anchored cell chain with the $4.3B LG Lansing contract as mitigation, LG disclosure source); added `via` deal metadata to the CATL (`"Megapack"`) and LG Energy Solution (`"Megapack 3"`) relationships
- **xAI dossier → schema v7, profileVersion 4** (`xai.profile.json`; outgoing v3 archived as `archive/xai.profile.v3.json`) — the Tesla relationship now carries `via: "Megapack"` and `project: "colossus"`, the first named-project pin against the new `profiler-projects.json` registry
- **Post-write passes** — `sync-profiler-registry.py` (2 entries updated) and `build-profiler-graph.py` rebuilt `profiler-graph.json` (472 edges; the tesla–xai curated edge now carries `via`/`project`, zero unregistered-project warnings)
- **README tree** — archive entries added for `tesla.profile.v5.json` and `xai.profile.v3.json`

### Notes
- Pre-existing archive-trail gap flagged, deliberately NOT repaired piecemeal: `tesla.profile.v4.json` was never archived when the 88-dossier relationships-curation pass (v03.67r) bumped Tesla v4→v5 (the index still ends at v3 `supersededBy: 4`), while the same pass did archive xAI's outgoing v2 — surfaced to the developer for a decision on recovering it from git history
- Verified: Playwright renders of the live Tesla Policy & Regulatory Exposure tab and the xAI Relationships tab using the real revised data (zero page errors); both profile JSONs and the archive index parse cleanly

## [v03.91r] — 2026-08-30 09:31:43 PM EST

> **Prompt:** "Picking up from my recent "BESS/AIDC market research system" session, build phase 4."

Phase 4 of the approved strategic plan — schema v7 depth: policy-exposure tracking, BESS/AIDC-native physical KPIs, named-project relationship pins, and the full Compare peer-family map.

### Added
- **`policyExposure[]` profile section (schema v7)** — `repository-information/PROFILER-SCHEMA.md` defines `{regime, status, effectiveDate, exposure, mitigation, source}` (status enum `in-effect` / `announced` / `proposed` / `expired`; mitigation is the company's own stated response, never inference); `Profiler.html` (v01.70w → v01.71w) renders it as a new dossier tab — per-style labels added to `OV_SEC_LABELS` (Bloomberg chapters renumbered 4→9), status chips, gold Mitigation/Source labels, source links resolved against `sources[]` via `ovRelSource`, and a matching Word/PDF export chapter
- **BESS/AIDC-native KPI keys (schema v7)** — the normalized-KPI vocabulary gains physical keys `gwh-shipped`, `backlog-gwh`, `mw-energized`, `mw-contracted` with a new `qty` overlay field (the figure in the unit the key names; currency KPIs keep `usdMillions`+`fxBasis`, never both on one metric); `scripts/check-profiler-reports.py` bars verification now accepts `qty` overlay values alongside `usdMillions`
- **Named-projects registry** — new `live-site-pages/profiler-data/profiler-projects.json` (schemaVersion 1) carrying Colossus, Homer City, and Stargate as first-class entities, with its schema section in PROFILER-SCHEMA.md (deliberately lightweight: identity + one orientation line; participants stay derivable from published relationships); `Profiler.html` loads it memoized (`ovProjectsLoad`, graph-fetch pattern) and renders relationship `project` pins as gold ⚑ chips with kind/location tooltips and a raw-slug fallback for unregistered pins
- **Relationship `via`/`project` fields (schema v7)** — optional deal metadata: `via` (the product line the engagement runs through, teal chip) and `project` (named-project pin); carried through `ovRelData`, the relationship one-pager export, and `scripts/build-profiler-graph.py` curated edges (`CURATED_FIELDS` + a WARN on unregistered project slugs)

### Changed
- **Compare peer families** — `OV_PEER_FAMILIES` in `Profiler.html` expanded beyond the single `hardware` family: `colocation` (developer + neocloud — the AIDC capacity providers; IREN and Crusoe carry both tags), `construction` (epc + gc — they build the same campuses), `developer-ipp` (the BESS project-developer/owner-operator set under its market name); hyperscalers deliberately stay their own family (they are the buyers, not competing sellers)
- **CHANGELOG archive rotation** — this section pushed the counter to 101, so the oldest date group (2026-08-23: v02.91r–v02.92r, 2 sections) rotated to `CHANGELOG-archive.md` verbatim with commit-SHA enrichment on both headers; active file 99 sections, archive 192

### Notes
- No data migration — existing dossiers stay valid at their schema versions; v7 backfill rides each dossier's next revision per the proven v3/v4 pattern (raw policy material already exists across dossier prose, the bankability guidance module, and the §154 risk report)
- Verified: Playwright render of the policy tab + v7 relationship chips on a synthetic dossier (zero page errors), `node --check` on the page script, `build-profiler-graph.py --check` byte-stable (472 edges), `sync-profiler-registry.py --check` (88/88 in sync), `check-profiler-reports.py` (0 errors)

## [v03.90r] — 2026-08-30 09:09:00 PM EST

> **Prompt:** "Coverage seems to work (see first three screenshots from Tesla, CATL, and NVIDIA). Then see the last screenshot: The current searchbar seems to be matching my inputs to both dossier names + summary. Change it so the searchbar only matches my inputs to dossier names."

Bridge verified live by the developer (Tesla/CATL/NVIDIA Coverage panels all rendering, including event capture and desk reads on pre-launch rows), then the requested roster-search narrowing.

### Changed

#### `live-site-pages/Profiler.html` — v01.70w

##### Changed
- Roster search now matches company **names only** (`c.name` + `c.slug`) — the tagline was dropped from the haystack, so a query like "nvidia" no longer surfaces every card whose blurb mentions NVIDIA. The slug rides along as the hyphenated name form and cannot reintroduce tagline noise

## [v03.89r] — 2026-08-30 08:43:06 PM EST

> **Prompt:** "approve phases 0-3"

Phases 0–3 of the approved Profiler/Scraper strategic plan (gap analysis authored in the prior research response): hygiene sweep, the Scraper↔Profiler bridge, corpus preservation, and the diamond pipeline — one commit.

### Added
- News-triage procedure for refresh sessions: new "News Triage — Scraper Corpus Bridge" section in `.claude/rules/profiler-app.md` (corpus endpoint shape, CORPUS_TOKEN handling rules — the token lives only in both projects' Script Properties and Routine prompts, never in repo files — triage/promotion procedure, single-source weighting), wired into the Scheduled Refreshes convention

### Changed
- `repository-information/PROFILER-SCHEMA.md`: registry categories now document `ipp`; the `legalName`+`hq` identity variant is documented beside the canonical `name`/`shortName`+`headquarters` shape (consumers must tolerate both; normalize opportunistically); `recentDevelopments.category` canonical enum expanded from 8 to 17 values with a case-insensitive consumption rule (the live corpus had drifted to 33 free-text spellings)
- Diagrams synced for the new behavior: Scraper sequence diagram (corpus route, corpus-only archive rows, event/figure capture, EdgeCandidates mining + reconcile, Drive cold storage), Profiler sequence diagram (Coverage panel proxy flow), REPO-ARCHITECTURE flowchart (Profiler.gs → Scraper.gs "Coverage proxy" edge) — all three pako URLs regenerated and decompression-verified
- Rotated the six 2026-08-10 sections of the Profiler page changelog to its archive with SHA enrichment (file was at its 50-section cap)

#### `googleAppsScripts/Scraper/Scraper.gs` — v01.89g

##### Added
- Token-gated corpus read route (`?action=corpus`, `scHandleCorpus_`): `cop=timeline` (per-slug news, since-filter, cross-edition dedupe on the article key) and `cop=candidates` (pending relationship candidates); flat refusal while `CORPUS_TOKEN` is unset
- EdgeCandidates tab + `scMineEdgeCandidates_` (post-render, one row per covered-company pair per article, deduped, ≤25/run) + `scReconcileEdgeCandidates_` (daily: pending → `covered` when the published profiler-graph.json curates the pair, `expired` after 60 days)
- Drive cold storage (`scColdStoreRows_` → "Scraper Archive" folder): Digests-tab and DigestIntake retention trims serialize rows to JSON files before deletion; a failed Drive write skips the trim rather than lose rows
- Summarize call now also returns per-item `event` (closed 10-value vocabulary, validated on parse) and up to 6 verbatim `figs`, merged into the row's Signals JSON (`scSignalsMerge_`)
- Corpus-only intake rows: sub-floor items naming a covered company are stored with Section `archive` — excluded from the digest flow (`scDigestItems_` drops them) but searchable, timelineable, and mineable

##### Changed
- Rubric returns matched-company slugs (`matchedCompanySlugs` from the Interests Key) alongside labels; intake Signals JSON now carries `mcs` + a normalized-URL article key `ak`, serialized field-drop-first via `scSignalsJson_` (replaces the raw 1200-char slice that could cut mid-structure)
- `companyTimeline` refactored onto the shared `scTimelineScan_` (slug match with label fallback, bounded, deduped); `searchArchive` haystack extended to summary + analysis text and slug filtering; `searchArchive`/`sourceStats`/mining read bounded newest-8000-row (and column-scoped) ranges instead of full-tab `getDataRange()` scans
- ClickLog retention cap (`scTrimClickLog_`, 20k rows) added to the hourly tick's quiet branch

#### `googleAppsScripts/Profiler/Profiler.gs` — v01.28g

##### Added
- Coverage proxy op (`action=news`, `handleNewsOp_`): session-validated, then server-to-server `UrlFetchApp` call to Scraper's corpus route with the shared `CORPUS_TOKEN` Script Property; reports `not_configured` while the token is unset; GET api mirror + doPost route registered

#### `live-site-pages/Profiler.html` — v01.69w

##### Added
- "Coverage 📰" dossier button + overlay (`ovShowCoverage`/`ovNewsApi`): stored trade-press items split at the dossier's `lastUpdated` ("since this dossier was written" vs earlier), with event chips, verbatim figures, desk-read analysis, corpus-only markers, and a "possible relationships spotted in the news" candidates list; graceful states for unconfigured token, expired session, and missing backend

##### Fixed
- Removed the stale duplicate `profiler report <topic>` commands-reference entry that was still marked "Planned" for a shipped feature

## [v03.88r] — 2026-08-30 07:14:52 PM EST

> **Prompt:** "Where do I input the "op=deploy" probe? If it's through you, then execute the probe. Then, start building Phase 2."

Probe executed first: the live deployment answered `Already up to date (v01.87g)`, confirming Phase 1 deployed via the webhook. Then the four approved Phase 2 items, as one commit.

#### `googleAppsScripts/Scraper/Scraper.gs` — v01.88g

##### Fixed
- **Item 5 (server half): `scAiWithRetry_` accepts a `deadlineMs`** and rethrows instead of sleeping past it — the backoff ladder sleeps up to 53s inside one call while the 40s step budget is only tested between batches, so a batch entering at t=39s could return at t≈95s: the actual mechanism behind the browser's "no reply after 90s". Both digest callsites (summarize batch, lead) pass `t0 + SCRAPER_DIGEST_TIME_BUDGET_MS`. With the Phase 1 re-queue, giving up early costs nothing — the batch keeps its attempts
- **Item 6: delivery candidates widen from "dated today" to the last `SCRAPER_DIGEST_DELIVER_WINDOW_DAYS` (3) days** — the old check was a silent, permanent midnight give-up for any edition that missed its day. The one-email guard now groups per edition per DAY, the in-flight hold and the completeness hold key on the ROW's date (an older row's repair day is over — it ships as it stands), and a late-delivered edition's subject carries its own date

##### Added
- **Item 6 (quota):** `MailApp.getRemainingDailyQuota()` read once per delivery pass and decremented per send; an edition the remaining allowance cannot cover is HELD (retried when quota refreshes) with a once-per-day alert, instead of throwing into the formerly-silent send catch
- **Item 7: the scheduled path leaves traces** — `scDigestLogErr_` (Script Property ring buffer, capped 20) wired into every meaningful swallowed catch: tick interests/milestone/deliver/step/start/repair, morning-run step (via the ladder), repair, deliver, per-row send failures, and the continuation-trigger create (the scriptapp-scope failure that silently kills the ladder). `scDigestNoteRun_` stamps the last scheduled run (`build` / `tick` / `delivery` + outcome) in `DIGEST_LAST_RUN`
- **Item 8: `scRecordDeploy_`** logs completion time, route (`webhook` / `get`) and result of every deploy call (capped 10) — called after `pullAndDeployFromGitHub()` in both the `doPost(action=deploy)` handler and the GET fallback with inline `// PROJECT:` markers, never gating the pull (Deploy Handler Protection intact)
- **`goLiveStatus` serves the diagnostics**: `lastRun`, `recentErrors` (24-hour tail, last 5) and `recentDeploys` (last 5) — what makes the transport `http_404`-vs-deploy-swap theory finally testable

#### `live-site-pages/Scraper.html` — v01.68w

##### Fixed
- **Item 5 (client half): `stepLoop` resumes instead of declaring failure on a transport error** ("no reply after 90s", `http_404`/`429`/`5xx`, failed fetch) — the build is resumable server-side, so re-calling `runDigestNow` continues from saved state. Bounded at 3 consecutive misses with growing pauses (5s/10s/15s) so an overrunning server call can finish before the resume lands; any successful reply resets the allowance

##### Added
- **"Last scheduled run" health tile** in the go-live status strip: kind + age of the last scheduled run, flagged `warn` with an error count when the 24-hour trail is non-empty

## [v03.87r] — 2026-08-30 06:58:35 PM EST

> **Prompt:** "Picking up from my recent "Morning Digests footer updates" session, build approved phase 1."

### Fixed

**`googleAppsScripts/Scraper/Scraper.gs` (v01.87g)**
- **Soft-failed AI batches now re-queue instead of being written off** — the confirmed root cause of the 2-of-3-unsummarized edition. `scDigestSummarizeStep_` tracks per-item attempts in run state (`state.aiAttempts`, ceiling `SCRAPER_DIGEST_ITEM_AI_ATTEMPTS` = 3 per pass); a batch that soft-fails (`ai_bad_json` / `ai_truncated` / `ai_empty_response` / `ai_blocked_*`), or an item skipped in an otherwise-parsed reply, goes back to pending with its summary cell left EMPTY. The old path wrote the raw feed snippet as the summary, which permanently excluded those items from every later batch, step and continuation ("pending" is recomputed as items with no summary, and a snippet is a summary to that test). Snippets are now written in exactly one place: the hard-stop finalizer
- **The scheduled build's swallowed-throw hole** — `scDigestMorningRun`'s `catch (stepErr) { break; }` scheduled no continuation (`more` only reflects the budget) and left no trace, while the hourly tick refused to look before 07:00 against a 06:00 build. The tick gate (`scDigestScheduledTick_`) and `scEditionDue_` now use `SCRAPER_DIGEST_BUILD_HOUR` (6); the retired `SCRAPER_DIGEST_RUN_HOUR` (7) is removed (approved Phase 1 item 5)

### Added

**`googleAppsScripts/Scraper/Scraper.gs` (v01.87g)**
- **Completeness verdict + delivery gate** — the render step computes `complete` (every summarize-set item carries a real AI summary; the lead has text + analysis) into a new `Complete` column (17: `yes` / `no` / `best-available`; blank on pre-existing rows = ship as before). `scDigestDeliverPending_` HOLDS a `no` row — left pending, never stamped — until the 12:00 ET hard stop (`SCRAPER_DIGEST_HARD_STOP_HOUR`, = 09:00 PT per the developer's deadline model)
- **Repair pass** (`scDigestRepairPass_`, weekday- and build-hour-gated) — reopens today's rendered-but-incomplete undelivered editions (attempts reset, phase back to summarize; only empty-summary items re-attempted; the lead redone only when it lacks text or analysis), advances them within the caller's budget, and the delivery pass that follows mails each edition the moment it is whole. At the hard stop `scDigestFinalizeBestAvailable_` writes the display snippets, re-renders with the honest footer note ("a few summaries fell back to source text") and ships; a due edition with no Digests row at all triggers a once-per-day failure alert email instead of an unexplained empty inbox
- **Escalating-backoff retry ladder** — Tier 1: 3 immediate same-execution attempts (`scDigestStepWithRetry_`, 2s/5s pauses); Tier 2: one-off continuations at +5/+10/+20/+30/+60/+60/+60 min (`SCRAPER_DIGEST_RETRY_LADDER_MIN`, monotonic per-day index in one self-resetting Script Property — at most 7 rungs/day, ~21 step attempts across six hours where a fixed 5-minute interval would burn ~72 executions against the consumer 90 min/day trigger budget); Tier 3: the hourly tick to the hard stop. Terminal AI faults (`scAiTerminal_`: missing key, unconfigured provider, rejected request) skip the rungs — one alert per day (`scDigestAlertOnce_`) and recovery stays with the tick. `scDigestScheduleContinuation_` now accepts a delay
- **Hidden subscriber-milestone alert** (`scSubsMilestoneCheck_`, called from `scSchedulerTick` right after the Interests sync, before the pause gate) — when active subscribers reach `SCRAPER_SUBS_MILESTONE` (15) and the `SUBS_MILESTONE_15_SENT` Script Property is unset, one email to the developer covers the consumer 100-recipients/day ceiling, the ×3 editions multiplier and the transactional-provider option, then sets the property so it can never fire twice. No UI surface; threshold and address deliberately kept out of the public GAS changelog per the approved plan

### Changed

**`googleAppsScripts/Scraper/Scraper.gs` (v01.87g)**
- `SCRAPER_DIGEST_ITEMS_PER_AI_CALL` 5 → 3 — smaller batches truncate less, and a soft-fail now costs 3 items, not 5 (approved Phase 1 item 6)
- **Delivery recipients split** — the developer's two addresses ride in `to:` (`SCRAPER_DIGEST_TO_ADDRS`), every other subscriber in `bcc:` (first subscriber promoted to `to:` if neither developer address subscribes — MailApp requires one); the old comma-joined `to:` exposed every subscriber's address to every recipient. Zero quota cost — Apps Script counts recipients, not fields
- `listDigests` tail read widened to columns 9–17 and rows carry the `complete` verdict; the render step's return and saved state carry the verdict for the ladder/repair callers; `SCRAPER_DIGEST_MAX_SOFT_AI_FAILS` re-commented for its new semantics (caps per-pass churn; items stay pending for repair)

**`repository-information/diagrams/Scraper-diagram.md`**
- Sequence diagram synced to the new behavior: hourly tick assists ≥6 ET, Complete verdict + hold/repair/hard-stop and the `to:`/`bcc:` split in the delivery note, `listDigests` columns 1-6 + 9-17. mermaid.live URL regenerated via pako and decompression-verified

## [v03.86r] — 2026-08-30 05:32:47 PM EST

> **Prompt:** "I want the footer to be formatted like so:
>
> * Left-aligned: "Amber = Analysis by X * Y relevant of Z scanned" where X can be Gemini or Claude depending on AI model used, Y is number of relevant articles, and Z is number of scanned articles"
> * Right-aligned: "Developed by Jon Yang""

### Changed

**`googleAppsScripts/Scraper/Scraper.gs` (v01.86g)**
- Night Ink footer is now a two-cell table row instead of one stacked run: left cell (`align="left"`) carries `Amber = Analysis by <Brand> · <relevant> relevant of <intake> scanned` plus any AI fallback note, right cell (`align="right"`, `white-space:nowrap`, 14px left gutter) carries `Developed by Jon Yang`. The `View More (N)` link keeps its own full-width row below
- The left run is built as a `footLeft` array joined with `' · '` rather than concatenated with leading separators. Two of its three parts are conditional, and the concatenated form emitted a dangling leading `·` on an edition containing no analysis — a join cannot express that
- Layout deliberately uses an email `<table>` with HTML `align` attributes rather than CSS columns. The previous two-column footer was replaced by a stacked block because it depended on a media query to stack on phones and Gmail drops the whole `<style>` element when it dislikes any part of it; a table needs no query at any width — the left cell wraps inside itself and the byline stays pinned right — and `align` attributes cannot be stripped
- Verified with Playwright at 640px and 390px across four states (Gemini + analysis, Claude + soft fallback note, hard fallback with no analysis, analysis with no model label): two columns hold, no overlap, no horizontal scroll, no stray separators

## [v03.85r] — 2026-08-30 04:34:20 PM EST

> **Prompt:** "The changes successfully went through. One adjustment: I would actually like the right side of the footer say "X revelant of Y scanned" where X is the total number of relevant articles (including the ones in View More) and Y is the total number of articles scanned, just like before."
>
> **Follow-up (same turn):** "Also, change "Published by Jon Yang" to "Developed by Jon Yang""

### Changed

**`googleAppsScripts/Scraper/Scraper.gs` (v01.85g)**
- Night Ink footer restores the coverage pair on the right: `<relevant> relevant of <intake> scanned`, from `d.counts.relevant` (the whole relevant set, held-back items included) and `d.counts.intake`. The desk-side half removed in v01.84g stays removed — no `shown` count, no `N more held back by the per-section caps` clause — and the News Stand remains the home for those
- Footer byline changed from `Published by Jon Yang` to `Developed by Jon Yang`
- The footer comment now distinguishes the two claims explicitly: shown/held-back is pipeline telemetry (moved to the News Stand), relevant-of-scanned is the edition telling the reader how wide a net it cast, and `relevant` being the full set is what keeps it consistent with the `View More (N)` link rather than in tension with it

### Housekeeping
- `live-site-pages/gs-changelogs/Scrapergs.changelog.md` exceeded its 50-section cap (51 after this entry), so the oldest date group — all 19 sections dated 2026-08-27 — rotated to `Scrapergs.changelog-archive.md` with commit-SHA enrichment on every moved header. Active file now at `Sections: 32/50`

## [v03.84r] — 2026-08-30 04:17:50 PM EST

> **Prompt:** "Picking up from my "Scraper subscriber/edition matching" session, I want the following changes to the Morning Digests' footers:
>
> * Replace "Published by your Scraper desk" with "Published by Jon Yang"
> * Replace "Amber = analysis" with "Amber = Analysis by X" where X is the AI model used. If it is Gemini 3.5 flash lite, just say "Gemini" and don't mention the exact model
> * Since we reference the AI model above, remove the "summarized by X" line at the end
> * Remove the "14 of 15 relevant * 104 scanned * 1 more held back by the per-section caps" - My readers don't need to know all that. Just make it clear in the News Stand for me to see."

### Changed

**`googleAppsScripts/Scraper/Scraper.gs` (v01.84g)**
- Night Ink footer (`scRenderDigestNightInk_`) rewritten: byline is now `Published by Jon Yang`; the amber key reads `Amber = Analysis by <Brand>`; the coverage run (`shown of relevant · intake scanned · N more held back by the per-section caps`) and the trailing `summarized by <provider/model>` credit are both removed. The `aiNote` / `aiSoftNote` fallback notices are deliberately kept — they are claims about the content in front of the reader, not attributions
- `Digests` tab header gained `Shown` and `Held Back` (columns 15–16), denormalised out of the Sections JSON for the same reason `Lead` and `No` are: the News Stand read path must not pull the heavy column to print two integers. `ensureScraperTabs_`'s cache key is column-count-derived, so the widening lands on the next call
- `listDigests` tail read widened from 6 to 8 columns and now returns `shown` / `heldBack`. Both are `null` (not `0`) on rows written before the columns existed, so the app can omit the figure rather than claim an edition showed nothing

**`live-site-pages/Scraper.html` (v01.67w)**
- News Stand subtitle (`wdLandingShowEdition_`) now prints the full coverage line for the open issue — `N shown of M relevant · K scanned · J held back by the section caps` — plus the exact `provider/model` label and any AI note. This is the desk-side home of what the footer used to broadcast to every subscriber
- News Stand card tooltips carry the same per-issue breakdown

### Added

**`googleAppsScripts/Scraper/Scraper.gs`**
- `scAiBrand_(label)` maps the stored `provider/model` label to a reader-facing brand (`gemini/gemini-3.5-flash-lite` → `Gemini`, `claude/...` → `Claude`, unknown providers title-cased, fallback runs → `''`). The model version is intentionally dropped: it is unactionable for a reader and dates an archived edition the moment the model is swapped

