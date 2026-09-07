# Integrated Remediation Plan — Profiler and Classroom, Phase 0 through Phase 6

**Agreed 2026-09-07 in the X3 close-out session (Opus 5 xhigh, v05.01r) and persisted at Phase 0 (Fable 5.1 High, v05.02r).** Until this file existed the plan lived only in a chat transcript and in the *Latest Session* of `SESSION-CONTEXT.md`; Phase 3's curriculum-skeleton review had nothing to edit against. This is now the **live run order for the remaining program**. `PROFILER-COVERAGE-PLAN.md` §9.5 rows 5–6 and §6 (Phase D), and `CLASSROOM-CURRICULUM-PLAN.md` §7 (the cut line), map onto Phases 0–4 below and are kept as their own records, not as competing schedules.

**The model rule is unchanged** — `PROFILER-COVERAGE-PLAN.md` §2: Medium buys comparison of records the repo already holds; High buys reading depth; Opus 5 xhigh buys research and authoring; Fable 5.1 xhigh buys design and evaluation against a corpus. Every phase below names its model and effort for that reason, and the reason is written down.

**Two rules that shaped the order, both learned the hard way at X3:**

1. **Cheap-and-certain before slow-and-uncertain.** The first recommendation out of X3 named only a `sungrow` refresh, when five findings needed no research at all. The single-recommendation rule picked the highest-value item instead of the cheapest. Phase 1 (zero-research fixes) therefore precedes Phase 2a (research).
2. **The session that writes a criterion does not close against it.** X3 was marked Done against an exit criterion the same session wrote in the same commit. Phase 0 exists to reverse that, and every "done when" below is closed by the developer or by a later session, never by the one that authored it.

## 1 · The finding set this plan remediates

All of these were produced by X3 (v05.01r) reading the 21 over-cap cross-reference scopes and the 38 aged report pins. **None was fixed there, deliberately** — step 7 of the Profiler Command requires two figures that may describe the same thing to be *stated*, not silently reconciled, and X3 was a read-and-report item. Each finding is assigned to exactly one phase.

| # | Finding | Where it lives | Needs research? | Phase |
|---|---------|----------------|-----------------|-------|
| F1 | **X3's exit criterion overstated.** The "0 warnings" clause of X3's "done when" was not met and was permanently unreachable as written; the v05.01r session flipped the ledger to Done against a criterion it wrote itself | `PROFILER-COVERAGE-PLAN.md` §9.3–9.5, `scripts/check-profiler-reports.py` | No | **0** |
| F2 | **Missing `hithium` → `lightsource-bp` customer edge.** `lightsource-bp` carries the supplier edge and a 222 MW / 640 MWh, 128-container project; `hithium`'s own prospectus roster names Lightsource bp but its `relationships[]` does not | `hithium.profile.json` | No | **1** |
| F3 | **`google` behind `intersect-power` on the same acquisition** — ~$4.75B against the USD 5,868m final purchase-price allocation already read from Alphabet's Q2 10-Q into `intersect-power` (goodwill USD 2,174m, PP&E USD 5,129m) | `google.profile.json` | No — the figure is already in the corpus | **1** |
| F4 | **Stale figure in `compass-datacenters`** — the Brookfield × Bloom framework at USD 5bn, since expanded fivefold to USD 25bn (on record in `brookfield` and `bloom-energy`) | `compass-datacenters.profile.json` | No | **1** |
| F5 | **Internal inconsistency in `arevon`** — "five operating utility-scale California BESS by mid-2025" against its own list of three | `arevon.profile.json` | No | **1** |
| F6 | **Sungrow portfolio gap, huawei side.** `huawei-digital-power` attributes to Sungrow a ~CNY 100B market-value loss after the FCC Covered List action and a public argument that its products fall outside the rule's connectivity prong (wired links); `sungrow` v8 carries neither. The Phase 0 brief names `huawei-digital-power` among the five Phase 1 dossiers; the Phase 1 brief scopes the edit, and whatever needs Sungrow's own record moves to F7 | `huawei-digital-power.profile.json` | No for the attribution wording; yes for anything that asserts Sungrow's record | **1** (residue → 2a) |
| F7 | **Sungrow portfolio gap, subject side.** `hithium` and `huawei-digital-power` credit Sungrow with an SST product, "the most architecturally complete grid-to-chip offer (PCS + storage + SST)", the CNY 100B loss and the FCC wired-prong argument; `sungrow` v8 contains none of `SST`, "solid-state transformer", "grid-to-chip", "wired" or that figure | `sungrow.profile.json` | **Yes** | **2a** |
| F8 | **`catl` omits its own RMB 4.1B purchase of 49% of Zhonhen's controlling holdco**, which `zhonhen` headlines and the AIDC report makes a key judgment | `catl.profile.json` | **Yes** | **2a** |
| F9 | **`tract` ↔ `prime-data-centers` figure disagreement.** `tract` asserts a "USD 4 billion" Prime Lockhart campus four times; Prime's own dossier gives USD 400m for Austin phase 1 (down from USD 1.3bn in 2024). The USD 4bn may be a total-campus figure against a phase-1 figure — deleting it would be the exact failure step 7 prevents, so this is a **citation read**, not a rewrite | `tract.profile.json` | Source reading, not new research | **2b** |
| F10 | **Three report pins record that the corpus moved under a report.** `vantage` v9 puts battery storage on the record at Lighthouse and `stack-infrastructure` v7 at Project Jupiter — two of the three campuses the opportunity report calls storage whitespace; `meta` v9 adds the Enbridge Cowboy 200 MW / 1,600 MWh tolled-BESS lane the report predates | `named-project-bess-attach--opportunity--2026-08-30` | No — reports are immutable; this is a regeneration question | **5 → 6** |
| F11 | **The four reports are under-scoped, not wrong.** Built at ~85–89 covered companies against today's 154: `aidc-power-conversion` covers 8 where ~15 covered companies now map to NVIDIA's 800 VDC ecosystem; `named-project` was built on 8 projects and there are now 9 (`river-bend-campus` missing) | all four reports | No | **5 → 6** |
| F12 | **`CLASSROOM-CURRICULUM-PLAN.md` §1 is badly stale.** Verified 2026-09-02 against 89 dossiers / 62 guides / 44 concepts / 490 edges / 7 modules / 8 projects; today 154 / 154 / 1,210 / 1,257 / 8 / 9. At least three of §2.2's exclusions are now contradicted by the §6 closures (nuclear/SMR — `x-energy` and `oklo` have dossier and guide; cooling — `coolit` exists; `utility-procurement-meets-ai-load` is guidance-gated although six `utility` dossiers now exist) | `CLASSROOM-CURRICULUM-PLAN.md` | No | **3** |

**Recorded, not scheduled** (see §5): the `microsoft` omission of the 1.35 GW Monarch LOI (defensible — never confirmed, both counterparties mark it press-sourced) and the `check-profiler-crossrefs.py` detector recommendation (an `A-on-B versus B-on-B` figure comparison behind a flag; `--no-cap` as an audit switch; leave `OQ_SCOPE_MAX` at 900).

## 2 · The nine phases

| Phase | Model · effort | Sessions | What | Done when |
|-------|----------------|----------|------|-----------|
| **0** | **Fable 5.1 High** | 1 | **Record and criterion.** Split §9.4's X3 row into X3a (done) / X3b (open); amend §9.3's defective "0 warnings" clause visibly; seed `report-pins-verified.json` with the 38 pins X3a read; change `check-profiler-reports.py` so the warning count is actionable (skip superseded reports for drift; consult the verified list; re-warn when a dossier moves past its verification); persist this plan | The ledger no longer claims X3 is finished; the checker reads 0 errors / 0 warnings with every aged pin explained line-by-line; this file exists. **Corrects a record that overstated progress and unblocks nothing else — done first because every later phase reads this record** |
| **1** | **Fable 5.1 Medium** | 1 | **Five zero-research dossier fixes** — F2 `hithium`, F3 `google`, F4 `compass-datacenters`, F5 `arevon`, F6 `huawei-digital-power` (the attribution side only). Every correcting figure is already in the corpus, so the work is comparison of records the repo holds — §2's definition of Medium | The five dossiers revised and archived per the Profiler Command; all six checkers exit 0; `check-profiler-reports.py` shows exactly the `hithium` pins re-warning (three current reports) and nothing else new |
| **2a** | **Opus 5 xhigh** | 1–2 | **`sungrow` and `catl` research refreshes** — F7 (SST / grid-to-chip / CNY 100B / FCC wired-prong, sourced from Sungrow's own record or stated as unconfirmed) and F8 (the RMB 4.1B / 49% Zhonhen holdco purchase). Research, so Opus | Both dossiers revised with first-party or disclosure sources for every new claim; the `hithium`/`huawei` attributions either corroborated in `sungrow` or explicitly marked one-sided; checkers exit 0 |
| **2b** | **Fable 5.1 High** | 1 | **`tract` citation read** — F9. Read the sources behind tract's USD 4bn and Prime's USD 400m; if both are real figures for different scopes, *state both with their scopes*; if one is wrong, correct that one. Reading depth, not research — High | The two dossiers agree or disagree on the record with the reason written in the dossier text; `check-profiler-crossrefs.py --pair tract prime-data-centers` still 0 candidates |
| **3** | **Fable 5.1 xhigh** | 1 | **Curriculum re-plan and skeleton review** — F12. Re-verify `CLASSROOM-CURRICULUM-PLAN.md` §1 against the 154-company corpus; re-test every §2.2 exclusion against the §6 closures; review the skeleton in §4 below and revise the second-wave order. Design against a grown corpus, so Fable at xhigh | §1 re-dated; each exclusion kept or reversed with a written reason; the 20-lesson remaining list re-ordered and recorded in the curriculum plan's §7 |
| **4** | **Opus 5 xhigh** | 20 (one lesson per session) | **Author the 20 remaining lessons** in the order Phase 3 sets, under the standing one-lesson-per-session decision and the unattended-committer contract (`CLASSROOM-COMMITTER-CONTRACT.md`) | 30 of 30 lessons built; `check-classroom-content.py` and `check-classroom-pipeline.py` clean after each |
| **5** | **Fable 5.1 xhigh** | 1 | **Report-strategy evaluation** — F10, F11. Decide per report: regenerate as-is, re-scope, or retire; decide whether the drift-gated monthly Routine's gate is right for a 154-company corpus. Evaluation, so Fable at xhigh. **Runs before Phase 6 so the reports are not authored twice** | A written decision per report with scope and the reason; the interim caveat in §5 lifted or restated |
| **6** | **Opus 5 xhigh** | 1–2 | **Regenerate the reports** Phase 5 chose, as new files carrying `supersedes` (the old files stay — the library is its own archive). Report-Command authoring, so Opus | New reports pass `check-profiler-reports.py` with fresh pins; superseded editions marked in the index; the old editions' pins no longer counted |
| **G6** | Developer-blocked; any model once the input exists | in parallel | The one open row of `CLASSROOM-CURRICULUM-PLAN.md` §6: a large-load-interconnection guidance module, which needs a developer-supplied industry document run through the `industry guidance:` command. Unlocks an *additional* contributor-gated lesson behind `the-fence-line`; blocks none of the 20 | The module exists and §6's G6 row closes |

**~31 sessions in total, 20 of them lesson authoring.** Phases 0, 1, 2b, 3 and 5 are one session each; 2a and 6 are one to two; Phase 4 is twenty; G6 is outside the count.

## 3 · Per-phase detail and the reason for each model

**Phase 0 — Fable 5.1 High.** The work is reading a checker and a schema carefully enough to state *why* a clause is unreachable, then changing the checker without breaking its other jobs. That is reading depth (High), not research (Opus) and not design (xhigh). Done at v05.02r; the evidence is in `PROFILER-COVERAGE-PLAN.md` §9.3 "Phase 0 evaluation" and §9.4.

**Phase 1 — Fable 5.1 Medium.** Every correcting fact is already in another dossier: Intersect's 10-Q allocation, Brookfield/Bloom's USD 25bn, Arevon's own project list, Lightsource's supplier edge. §2 of the coverage plan defines Medium as comparison of records the repo already holds, and this is that. It goes before 2a because it is cheap and certain; the X3 session's first recommendation got this order wrong. **Side-effect to expect and leave alone:** revising `hithium` moves it past v11, so its three verified pins (`grid-scale-bess`, `named-project-bess-attach`, `s154-listed-bess-suppliers`) re-warn. That is the Phase 0 mechanism working; the pins are read again at Phase 6 (or by whichever session next reads them), not silenced.

**Phase 2a — Opus 5 xhigh.** Two dossiers need facts the corpus does not hold: Sungrow's own SST / grid-to-chip product record and its FCC-rule position, and CATL's Zhonhen holdco purchase from CATL's side. New sourcing is research, and the model rule puts research on Opus. It follows Phase 1 so the cheap fixes are not held hostage to the slow ones.

**Phase 2b — Fable 5.1 High.** The tract/Prime disagreement is the one finding where the wrong fix is worse than no fix: a USD 4bn campus total and a USD 400m phase-1 figure can both be true. The task is to read the cited sources and state the scopes, which is reading depth. It is split from 2a because it needs no new sources and a different model.

**Phase 3 — Fable 5.1 xhigh.** The curriculum was cut on an 89-dossier corpus and the corpus is now 154 with three of the plan's own exclusions contradicted. Re-planning a curriculum against a corpus is design and evaluation, which is what xhigh on Fable buys. Phase 3 edits against §4 below; without this file it had no skeleton to edit.

**Phase 4 — Opus 5 xhigh, one lesson per session.** The standing decision from the Classroom build: lesson authoring is corpus synthesis with provenance stamps and a contract to satisfy, and it has never been done more than one per session without a pipeline. Twenty sessions.

**Phase 5 — Fable 5.1 xhigh.** Whether to regenerate, re-scope or retire a report is a strategy question, and the reports' defect is scope rather than fact (F11). Evaluating four reports against a corpus that nearly doubled is design work. It runs before Phase 6 so the four reports are authored once, not twice — the X3 session's explicit reason for *not* regenerating at v05.01r.

**Phase 6 — Opus 5 xhigh.** Report-Command authoring: synthesis from dossiers with verbatim citations and a coverage block, on the writing style in `PROFILER-STYLES.md`. Opus per the model rule. The superseded editions stay on disk and, since Phase 0, are no longer drift-checked, so the checker's count after Phase 6 reflects only the new editions.

**G6 — blocked on the developer.** Eight guidance analyses exist and none is a large-load-interconnection subject; the `industry guidance:` command needs a document to ingest. No model choice is pending.

## 4 · The curriculum skeleton as it stands (Phase 3 edits against this)

Recorded at the X3 close (2026-09-07, v05.01r) from `CLASSROOM-CURRICULUM-PLAN.md` §2.2, §3 and §7 and the live `Classroom.gs` content (`check-classroom-content.py`: 10 lessons, 3 tracks, 134 gate cases). **This is the input Phase 3 reviews; Phase 3 writes its revisions into the curriculum plan itself, not here.**

**3 lanes · 5 tracks · 30 lessons · 10 built · 20 remaining.**

| Track | Lane | Lessons | Built | Remaining | Notes |
|-------|------|---------|-------|-----------|-------|
| `bess-foundations` | Technology Foundations | 6 | 4 | 2 | Existing track, extended; 5 public · 1 guidance |
| `electrical-foundations` | Technology Foundations | 5 | **0** | 5 | New track; all public |
| `aidc-grid-to-chip` | The AI Data-Center Wave | 8 | 4 | 4 | Replaces `aidc-power-primer`; 7 public · 1 guidance |
| `aidc-campus` | The AI Data-Center Wave | 4 | 2 | 2 | New track; 3 public · 1 guidance |
| `market-access` | Market Access & Bankability | 7 | **0** | 7 | New track; 3 public · 4 guidance |

- **The "first five" cut line (`CLASSROOM-CURRICULUM-PLAN.md` §7) is complete**: `the-fence-line`, `bridge-power`, `the-800-vdc-shift`, `the-control-stack`, `where-bess-plugs-in`. The second wave is next.
- **The corpus now stamps lessons it could not stamp at planning time.** `PROFILER-COVERAGE-PLAN.md` §6 step 2 lists the closures' unlocks: `backup-generation`, `the-ups-room`, `how-a-utility-buys` (the first public utility lesson), the battery side of `inside-the-rack` / `the-800-vdc-shift`, `the-transformer-and-the-substation`, and the rest of `electrical-foundations`.
- **Three of §2.2's exclusions are contradicted by the §6 closures** (F12): nuclear/SMR was excluded pending a vendor dossier and `x-energy` + `oklo` now carry dossier and guide; cooling was capped partly for want of a CDU specialist and `coolit` exists; `utility-procurement-meets-ai-load` is specified guidance-gated because utility machinery was guidance-only, and six `utility` dossiers now exist, so it could be public.
- **G6 staying open blocks none of the 20** — it unlocks one *additional* contributor-gated lesson behind `the-fence-line`.
- **Track edits are a developer-session write** (curriculum plan §8 item 9): creating the three new tracks, retiring `aidc-power-primer` and re-sequencing `clLessons_()` happen inside the content fence in one commit with `gateDigest` unchanged.

## 5 · Dependencies, standing caveats, and what is recorded but not scheduled

**Dependencies.**
- Phase 0 first; nothing depends on it, but every later phase reads the record it corrects.
- Phase 1 before 2a (cheap-and-certain first). 2a and 2b are independent of each other and of Phase 3.
- Phase 3 before Phase 4; Phase 4's twenty sessions can interleave with 2a/2b/5/6 — they touch different files.
- Phase 5 before Phase 6, always. Regenerating before the evaluation authors the reports twice.
- G6 runs whenever the developer supplies the document; it never blocks a phase.

**Standing caveats while the plan runs.**
- **Do not act on the `named-project` report's whitespace call.** Two of its three "storage whitespace" campuses now have storage on the record (F10). The caveat lifts at Phase 6 or when Phase 5 restates it.
- **Reports are immutable.** No phase edits a published report; the only route to a fresh pin is a new edition carrying `supersedes`. A pin that re-warns after a dossier bump is read again and recorded in `report-pins-verified.json`, never re-pinned.
- **X3b closed at v05.03r** — the developer accepted the amended criterion in `PROFILER-COVERAGE-PLAN.md` §9.3 on 2026-09-07, and Phase X is closed. The pins that re-warn after Phase 1 are read again and recorded, never re-pinned.
- **CHANGELOG rotation** is decided by the non-exempt count on the day a push lands (`CHANGELOG-archive.md` step 1, fixed at v05.01r). When it fires, `git fetch --unshallow` runs before any SHA lookup.

**Recorded, not scheduled.**
- `microsoft` v4 omits the 1.35 GW Monarch LOI that `anthropic` and `nscale` attribute to it. Defensible: never confirmed, both counterparties mark it press-sourced. Revisit only if Microsoft confirms.
- The `check-profiler-crossrefs.py` detector recommendation from X3 (§9.3 of the coverage plan): an `A-on-B versus B-on-B` figure comparison behind a flag with calibration first; `--no-cap` as an audit switch; `OQ_SCOPE_MAX` stays at 900. Needs its own calibration session; not on this plan's critical path.
- Standing, unassigned housekeeping carried in `SESSION-CONTEXT.md`: the README archive listing lags; `archive/nvidia.profile.v2.json` is missing and unreconstructable; OSHA IMIS and SEC EDGAR are network-blocked from the remote environment.

## 6 · Status ledger

| Phase | Model · effort | Status |
|-------|----------------|--------|
| 0 · record and criterion | Fable 5.1 High | **Done — v05.02r (2026-09-07).** §9.4 split into X3a Done / X3b Open; §9.3 criterion amended with the defect noted; `report-pins-verified.json` seeded with 38 pins after re-confirming the triples against a live checker run; `check-profiler-reports.py` skips superseded reports for drift and consults the verified list — 0 errors / 0 warnings / 38 quiet at v05.02r; this file persisted. **X3b accepted by the developer and closed at v05.03r** |
| 1 · five zero-research dossier fixes | Fable 5.1 Medium | **Done — v05.04r (2026-09-07).** `hithium` v12 (F2: `lightsource-bp` customer edge), `google` v9 (F3: USD 5,868m 10-Q allocation, announced ~$4.75B kept as the announcement), `compass-datacenters` v5 (F4: Bloom framework USD 5bn → 25bn), `arevon` v4 (F5: both BESS counts stated with their definitions), `huawei-digital-power` v7 (F6: Sungrow attributions marked one-sided and traced to the registered tier; the CNY 100B and wired-links claims carried unconfirmed to 2a); all five archived. Six checkers exit 0; `check-profiler-reports.py` 0 errors / exactly the three `hithium` pins re-warning, left loud; two new crossref candidates (lightsource-bp × hithium, both Lightsource-side open questions Hithium's record cannot answer) adjudicated and accepted with reasons |
| 2a · `sungrow` + `catl` research | Opus 5 xhigh | **Done — v05.05r (2026-09-07).** `sungrow` v9 (F7): the SST is real and first-party (EnerNeo, launched 9 July 2026, described in the H1 2026 SZSE interim report as supplying the market — 10–13.8 kV MVAC to 800 V DC, 1.5–4.5 MW, 98.5%, 312 kW/m²), "grid-to-chip" is Sungrow's own English-market framing from 19 January 2026, and the two remaining attributions are **refuted**: the ~CNY 100B loss belongs to the 30 June–late July window that preceded the FCC action (aggregator-sourced; the month after 28 July was about RMB 29.8B) and the wired-links argument was never Sungrow's — Sungrow declined it when a retail investor proposed it and stated the opposite on 4 September. New `policyExposure[]` (FCC, EO 14420, EU), H1 2026 financials, the AIDC product line and EnerNeo specs. `catl` v7 (F8): the RMB 4,099,858,823.53 / 49.00% Zhonhen holdco **capital increase** added with the CATL-side null documented — CATL has published nothing naming Zhonhen anywhere. Step 7: `huawei-digital-power` v8 and `hithium` v13 corrected, `zhonhen` v7's unsourced "~43.5% premium" replaced with what the filings say |
| 2b · `tract` citation read | Fable 5.1 High | Open — next |
| 3 · curriculum re-plan + skeleton review | Fable 5.1 xhigh | Open |
| 4 · author 20 lessons | Opus 5 xhigh, one per session | Open — 0 of 20 |
| 5 · report-strategy evaluation | Fable 5.1 xhigh | Open |
| 6 · regenerate reports | Opus 5 xhigh | Open — blocked on 5 |
| G6 · guidance module | Developer-blocked | Open — needs a developer-supplied document |

Sessions flip a row here **and** in the record that owns the work (`PROFILER-COVERAGE-PLAN.md` §9.4 for X3b, `CLASSROOM-CURRICULUM-PLAN.md` §6/§7 for Phases 3–4 and G6, the reports index for Phase 6). A row is closed by the developer or a later session against the "done when" in §2, never by the session that wrote the criterion.

Developed by: LightAISolutions
