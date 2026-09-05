# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-05 03:37 PM EST
**Repo version:** v04.69r — five push commits this session (v04.65r → v04.69r)
**Branch:** `claude/profiler-crossref-checker-3x3r4n` (rebased onto `origin/main` before each of the five pushes; each merged and was swept before the next)
**Model:** Opus 5 xhigh — the cross-reference checker build, then four corrective passes the build itself surfaced.

### What was done

- **v04.65r — `scripts/check-profiler-crossrefs.py` built, the first checker that reads two dossiers against each other.** Three detectors: **differing figures** (two magnitudes for one apparent fact in a shared dimension), **open questions** (one dossier flags something unresolved that another answers), and an opt-in **grouped attribution** class. Never edits a dossier. 1.4 s over 127 dossiers / 25,152 passages. Companion `PROFILER-CROSSREF-CALIBRATION.md` and the `profiler-crossref-accepted.json` accept list.
- **Scored 3 of 4 against the v04.64r drift cases** using the archived pre-fix revisions as a reconstructed corpus. Caught `meta` (2.1 GW vs Vistra's 2,609 MW, Δ 19.5 %), `terawulf` (~$92M vs Talen's $85M, Δ 7.6 %, anchor `Nautilus`), `burns-mcdonnell` (marker `no source ties`, anchor `Moss Landing`). **Missed `invenergy`** — a categorical mischaracterisation in which every number is right; out of scope for a static checker and the docstring says so rather than stretching a definition. All three caught cases vanish on the fixed corpus **with no accept-list entry**, which is the evidence it measures drift rather than coincidence.
- **False-positive rate measured, not estimated: 71 % (precision 29 %) on a seven-item load** — a full census of the live corpus, all seven adjudicated, with **66 distinct candidates hand-checked** across the tuning stages. Volume, not rate, was the design target: 148 candidates at ~10 % precision became 7.
- **v04.66r — the two open candidates adjudicated.** `enchanted-rock` v3 → v4 and `hithium` v8 → v9, both closed by revising the **asking** dossier; `anthropic` and `jupiter-power` were accurate and left alone. Open-question fingerprints changed to include both claim texts so an edited claim reopens a candidate, as the docstring already promised.
- **v04.67r — the hithium sourcing claim corrected (v9 → v10) after the developer challenged it.** v9 said the three layers were "documented from Hithium's side". Reading the **citations** rather than the prose shows **one** is: the partner roster, in Hithium's own HKEX prospectus (27 Oct 2025). The June 2024 3 GWh agreement rests on trade press (Solarbe Global, corroborated by SMM) and Trimount on Energy-Storage.News. v9 also omitted that **Jupiter's CTO Michael Geier is quoted in the 3 GWh announcement**.
- **v04.67r also fixed a false green in the checker.** `OQ_SCOPE_MAX` had silently dropped that very candidate — documenting the reconciliation thoroughly pushed both records past 900 characters and the checker reported a clean pass on a pair it had stopped reading. The cap stays (raising it to 1500 admits eight more candidates with no ground-truth gain); every scope it declines to examine is now **reported** — 16 on the current corpus.
- **v04.68r — the sourcing rule added to Profiler Command step 7.** Any statement about *where* a claim is documented is a claim about the `sources[]` arrays and must be resolved by opening the cited entries on both dossiers. Carries the developer directive: **high verity is the priority; when the citations do not settle something, state the gap clearly and honestly.**
- **v04.69r — §5's `Why` column demoted from fact to hypothesis** in `PROFILER-COVERAGE-PLAN.md`, with a banner marking it unverified prompt material, a new `Checked` column recording each session's real status, and a §7 obligation (plus a prompt-template line) requiring each session to rewrite its own row with what was found.
- **All 16 not-examined scopes were read, not sampled** — none hides a cross-dossier answer. Six are mutual hedges, seven are a company's own internal status or a regulatory question, two were the adjudicated hithium pair. The three that looked answerable were checked against their counterparts and came back negative.

### Where we left off

Nothing is in flight. Working tree clean; `3bd24d7` pushed and merging. `check-profiler-crossrefs.py` **exits 0** with 6 accepted candidates and 16 scopes reported as not examined. Program state is **unchanged from the C4 session — 38 of 65 new companies done, 4 of 30 guide passes done**; this session added no dossiers.

- **Opus 5 xhigh remaining:** C5 (ENGIE North America · AES Clean Energy · RWE Clean Energy), C6, C7, C8, C9, C10, C12 — 18 companies over 7 sessions — plus **26 guide backfills**.
- **Fable 5.1 remaining:** F6 (MGX · Excelsior Energy Capital · X-energy), F7 (Compass · EdgeCore · PowerHouse), F8 (Fermi America · Tract · Prime Data Centers).
- **Classroom register:** G6 open; G10 Partial; G11 deferred; G12 by design.
### Key decisions and findings

- **The `meta` case — the one a magnitude comparator cannot see — is solved, by two mechanisms.** 2,176 MW and 2.1 GW are equal to two significant figures, so a comparator that normalises *and* applies a tolerance calls them the same. **Strict equality with a banded difference** catches the rounded restatement (2,100 ≠ 2,176), and **arithmetic component/total reconciliation** stops the corrected text being flagged forever (2,176 + 433 = 2,609 reconciles; the pre-fix 2,100 + 433 = 2,533 reconciles with nothing). Do not re-introduce a tolerance on equality.
- **Coverage is narrower than the backlog and this changes sweep planning.** Mutual mention reduces the ~870–1,130 cross-dossier pairs to **260 compared pairs**. The checker is a **floor** under step 7, not the sweep tool the earlier plan imagined. A clean run is not a clean corpus — and now says so.
- **Two rejected approaches, recorded so they are not re-tried:** requiring a shared rare *topic* anchor on the figure class (Meta and Vistra share no non-company anchor, so it drops the whole omitted-component class), and figure-local lexical overlap (neither figure case shares a unit phrase).
- **`ATTR_WINDOW = 40` with directional attribution is the load-bearing setting.** A sweep at 40/60/80/120/160 kept both figure cases at every setting; **every** candidate the wider windows added was a false positive. The `DIFF_MAX = 0.25` band ceiling is the most sensitive knob — the `meta` case sits at 19.5 %, so do not go below 22 %.
- **Closing an open question does not silence it, and that is correct.** The honest close keeps the hedging word, so the uncertainty becomes *documented* rather than *open*. **Revise-and-accept is the normal disposition for the open-question class**; only the figure class routinely goes quiet on its own.
- **I made the exact error the cross-reference rule exists to catch, while applying that rule.** "Documented from Hithium's side" was inferred from the two dossiers' **prose** instead of their **citations**. The developer caught it by asking for the evidence. The generalisable lesson is now a rule: *a dossier's summary of its own provenance is the text under review and cannot be evidence for it.*
- **A silent threshold is worse than a wrong one.** The scope cap produced a false green precisely because the reconciliation was written thoroughly — the fuller the write-up, the blinder the tool. Fixing the *silence* rather than the threshold cost nothing and removed a class of failure no amount of tuning would have.
- **The developer's §5 tally was checked and corrected before it was written in.** The instruction said "twelve for twelve wrong"; the repo documents premise verdicts for **two** sessions — C4 (§5, all three wrong, v04.63r) and B5 (§4, all three wrong, v04.62r). Phase C has shipped **14 companies across five sessions**; C1, C2, C3 and C11 recorded **no verdict either way** and are marked **unknown, not correct**. The banner says "wrong in every Phase C session where it was checked — one of five".
- **Provenance of the action plan could be confirmed only in substance.** It is the v04.57r-era screenshot, not in the repo; the quoted phase appears nowhere in it. Said so plainly rather than implying a match.
- **One partial signal was deliberately not written in.** Hithium's HKEX prospectus customer roster names **Lightsource bp, not Aula**, which bears on the open Woolooga post-sale ownership question in `lightsource-bp` — but recording it as a resolution would repeat the overstatement the new rule forbids. Reported to the developer instead; **still open, developer's call**.

### Active context

- Branch `claude/profiler-crossref-checker-3x3r4n`; repo version **v04.69r**; CHANGELOG **86/100**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry **127** companies; concepts **811**; study guides **101**; graph **903 edges (678 curated, 2,788 evidence items)**; archive index **240 entries across 95 slugs**.
- Checker state: `python3 scripts/check-profiler-crossrefs.py` → **exit 0**, 6 accepted, 16 not examined. Useful flags: `--json`, `--pair A B`, `--only`, `--include-grouped`, `--require-anchor`, `--max-delta`, `--data DIR` (the last one is how the ground-truth corpus is scored).
- **Ground-truth reproduction recipe** is in `PROFILER-CROSSREF-CALIBRATION.md` — copy the corpus to a temp dir, swap in the four archived pre-fix revisions, run with `--data`.
- Pre-existing gap left untouched: `hithium.profile.v5.json` is absent from `archive/` while v1–v4 and v6–v9 are present.

### Recommendation for next session

- **Run Phase C session C5 (ENGIE North America · AES Clean Energy · RWE Clean Energy) on Opus 5 xhigh** — the checker work is finished and the corpus is green, so the highest-value next action is production coverage, and C5 is the **first session to exercise both new rules**: the step 7 sourcing rule (verify provenance against `sources[]`, never from another dossier's prose) and the §5 obligation to rewrite its own `Why` cell and fill in `Checked`. Running it next is how we find out whether the rules hold under a real research pass rather than in review.
**To continue:** type `run Phase C session C5 on Opus 5 xhigh`

## Previous Sessions

### Session — Phase C C4 + cross-dossier reconciliation (Opus 5 xhigh)

**Date:** 2026-09-05 01:50 PM EST
**Repo version:** v04.64r (bumped on the push commit `8b91c94`; C4 itself shipped at v04.63r in commit `710034c`, which merged mid-session)
**Branch:** `claude/phase-c4-profiler-session-rwzxo5` (rebased onto `origin/main` at `b44d0f9` after the v04.63r merge, before the v04.64r edits)
**Model:** Opus 5 xhigh — Phase C session C4 (Talen Energy · Vistra · NRG Energy), then an unplanned cross-dossier reconciliation pass the C4 research forced.

### What was done

- **C4 shipped at v04.63r** — three `ipp` dossiers (schema v7, profileVersion 1, intel-briefing) + three schema v2 study guides + three lesson plans. Sources 81 / 81 / 72 (first-party 51 / 37 / 33 percent); relationships 7 / 13 / 7; developments 21 / 20 / 20; decision makers 13 / 11 / 12; 19 headshots. 25 shared concepts registered (811 total). Registry sync (127), graph rebuild (903 edges, 678 curated), study checker (101 guides) and the Playwright render all clean. Three **researched** calendar rows, not `cadence: "quarterly"`. §8 rows flipped to `v1 · v04.63r` / `✓ · v04.63r`. CHANGELOG 80/100.
- **All three C4 premises were wrong and are corrected** in the summaries, judgments and README descriptions, same as B5/F5 before it.
- **Expectations honesty was applied literally.** No full-year analyst consensus exists for FY2024/FY2025 for Talen or Vistra on any reachable host, so those periods are **guidance-benchmarked and say so** in `result`/`commentary`. NRG's only FY2025 consensus is nine months stale and is labelled as such. `ir.talenenergy.com` and `investors.nrg.com` are WAF-blocked (503/403); press releases were recovered from SEC 8-K exhibits and the block recorded as a collection gap.
- **v04.64r reconciled the existing corpus against the three new dossiers.** C4 landed into a corpus that already carried ~30 inbound mentions of Talen, Vistra and NRG. Nothing had ever checked whether those mentions still held. Four did not:
  - `invenergy` v1 → v2 — grouped NRG with Vistra and Talen as "contracting existing fleets to data centres". NRG's model is customer-funded **new build** under a Project Development Agreement with GE Vernova and Kiewit's TIC for up to 5.4 GW. Separated, GE Vernova release sourced.
  - `meta` v6 → v7 — "Vistra (2.1 GW + 433 MW uprates)" in two places. Vistra discloses **2,176 MW** operating (Perry 1,268 + Davis-Besse 908) plus 433 MW of uprates, **2,609 MW total**. Both corrected.
  - `terawulf` v4 → v5 — the Nautilus exit carried "~$92M / 3.4x MOIC"; Talen's own release states **$85M cash plus selected physical assets**. Both figures now stated with an explicit note that no source reconciles them.
  - `burns-mcdonnell` v4 → v5 — the open Moss Landing adjacency question closed and dated. Phase I (300 MW, engineered by Fluence, built by Luminant) is the unit that burned; B&McD's engagements are Phase II (100 MW) and Phase III (350 MW). A `vistra` relationship and the NS Energy project record added.
- **Added mandatory step 7 to the Profiler Command** in `.claude/rules/profiler-app.md` — "Reconcile the corpus against the new dossier". Word-boundary grep every other dossier for the new company, skip exec-career mentions, then the four-way disposition: contradicted → revise the **other** dossier with archive + `profileVersion` bump; differing figures → state both and say nothing reconciles them; open question the new research answers → close and date it; accurate → leave alone. Report counts reviewed and changed. Batch requests / Standard treatment / Commit-push renumbered 8 / 9 / 10.

### Where we left off

Nothing is in flight. Working tree clean; `8b91c94` pushed and merging. Program state: **38 of 65 new companies done, 4 of 30 guide passes done.**

- **Opus 5 xhigh remaining:** C5 (ENGIE North America · AES Clean Energy · RWE Clean Energy), C6, C7, C8, C9, C10, C12 — 18 companies over 7 sessions — plus **26 guide backfills**.
- **Fable 5.1 remaining:** F6 (MGX · Excelsior Energy Capital · X-energy — first `investor` chips with data), F7 (Compass · EdgeCore · PowerHouse), F8 (Fermi America · Tract · Prime Data Centers).
- **Classroom register:** G6 open (wants a guidance module via `industry guidance:` plus a developer-supplied document); G10 Partial; G11 deferred; G12 by design.
- **Not started, and now the developer's stated priority:** `scripts/check-profiler-crossrefs.py` and the retroactive sweep of the pre-existing cross-dossier pairs. See the recommendation below.

### Key decisions and findings

- **The corpus has a structural blind spot no checker covered.** `sync-profiler-registry.py`, `build-profiler-graph.py` and `check-profiler-study.py` all validate a dossier against *itself* or against the registry. None asks whether **two dossiers assert contradictory facts about the same thing**. Step 7 closes this going forward by rule; it does not touch the backlog.
- **The backlog was measured this session.** 127 dossiers, **1.79M tokens** of corpus, **870–1,130 distinct cross-dossier pairs** (the count is matcher-dependent — a suffix-stripping tokenizer gives 870, the looser earlier matcher gave 1,126). **5,719 mention occurrences.** Distribution is sharply concentrated: **top 10 targets = 39% of pairs, top 25 = 65%**; 11 of 79 targets have only 1–2 inbound. NVIDIA 56, Tesla 51, Microsoft 46, Siemens Energy 39, GE Vernova 29, Vertiv 26, OpenAI 25, Eaton 24, Oracle 23, Fluence 23.
- **Field distribution decides the checker's scope.** On a 1,378-mention sample: `relationships` 297, `sources` 295, `productsAndServices` 225, `recentDevelopments` 207, `technicalSpecs` 84, `strategyRead` 80, `decisionMakers` 58, `ecosystemRole` 39, `summary` 32, `policyExposure` 31, `financials` 18. **`sources` and `decisionMakers` are 26% of the surface and are pure noise** — source titles and exec career history. **78% of mentions contain a digit**, so a naive numeric-conflict detector has enormous surface and will drown in false positives unless scoped.
- **The `meta` case is the checker's hardest calibration target.** 2,176 MW and 2.1 GW are numerically **equal**; a unit-normalizing comparator says "no conflict" and misses the drift, because the drift was the **omitted 433 MW of uprates**, not a wrong number. Any checker that only compares normalized magnitudes would have scored 3 of 4 known cases, not 4.
- **A model upgrade is not the fix for accuracy, and this session is the second data point.** C4's premises were caught because the prompt told the agents to check them — the same reason F5's were. What was missing in both cases was a **rule**, not reasoning depth. The one thing that went wrong this session that a better model would not have fixed was the absence of a cross-dossier gate.
- **I over-called one of the four items and corrected it mid-session.** I first described the Burns & McDonnell / Vistra Moss Landing item as two dossiers contradicting each other. They did not — B&McD plausibly worked both Phase II and the Phase III expansion, and `vistra.profile.json` had already recorded both correctly. It was an **open question**, not a contradiction. This is the exact failure mode the retroactive sweep must be protected against: over-calling rewrites accurate dossiers.
- **I also mis-stated a diagnosis earlier in the session and corrected it publicly.** I claimed §5's Phase C descriptions "were written from corpus mentions rather than from filings." Selection was corpus-driven, but the descriptive claims mostly appear nowhere in the corpus — the accurate diagnosis is **unattributed market knowledge written from memory at plan-approval time**.

### Active context

- Branch `claude/phase-c4-profiler-session-rwzxo5`; repo version **v04.64r**; CHANGELOG **81/100**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry **127** companies; concepts **811**; study guides **101**; graph **903 edges (678 curated)**; archive index **237 entries across 95 slugs**; calendar 88 rows.
- Scratchpad tooling that survives as a recipe: `urlcheck.py` (URL-index gate), `c4-render-check.py` (Playwright harness — threaded HTTP server, `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, GAS stub for `script.google.com`, `.ov-sources ol li` for source counts, `.gd-term` resolved against `gdGlossMap` **not** `e.title`).
- **Model recommendation recorded for the developer's next two jobs:** build `scripts/check-profiler-crossrefs.py` on **Opus 5 xhigh** (one-time durable artifact, adversarial false-positive design problem, four ground-truth cases to calibrate against); run the retroactive sweep on **Fable 5.1 High** (high-volume shallow adjudication where §2 already records Fable as better at hedging and relationship discipline — the anti-over-calling property the sweep needs most). Not Medium for either.

### Recommendation for next session

- **Build `scripts/check-profiler-crossrefs.py` as a fresh Opus 5 xhigh session, using the paste-ready prompt written in chat on 2026-09-05 at ~01:50 PM EST** — it is the only one of the four proposed follow-ups that both makes step 7 verifiable instead of self-reported and reaches the 870–1,130-pair pre-existing backlog, and it must exist and be tuned to a measured false-positive rate **before** any retroactive sweep starts, or the sweep burns its budget adjudicating noise. The session must end with the checker's FP rate measured on a sample and with all four known-drift cases scored against their pre-fix revisions in `archive/`.
**To continue:** type `build the cross-reference checker on Opus 5 xhigh`
