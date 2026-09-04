# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-04 04:40 AM EST
**Repo version:** v04.51r (started at v04.50r — one push commit, `4a371aa`, plus this context write)
**Branch:** `claude/section8-guide-revisions-opus5-7y6n3p`
**Model:** **Opus 5 xhigh — §2 assigns ALL study-guide work on existing dossiers to Opus natively, so there is NO substitution to record.** The §8 Guide column reads plain `✓ · v04.51r` on all four rows

**What we worked on — the three §8 guide revisions plus the `narada` backfill, landed as v04.51r in one data-only push. This was a GUIDE session: no new dossiers, no new companies, no profile writes.**

- **`vertiv.study.json` 6 → 18 sections.** The guide was cooling-only. Ten new sections teach the UPS as **the machine and the transaction**: what a `power module` physically is and the three things engineered into the *slot* (current sharing by droop, precharge/isolation decoupling, touch safety); module/frame/unit/system/path as five different purchases; capacity-on-demand, which defers about a third of the cost rather than most of it; the ratings ladder from a 33 kW rack shelf to a 50 MW prefab block; a twelve-row datasheet reading (overload rating, short-circuit contribution, THDi, battery charge-current limit, floor loading, IEC 62443); the eleven-step procurement sequence with **submittal approval named as the silent schedule killer**; and what moving the store into the rack distributes
- **`schneider-electric.study.json` 6 → 17 sections.** Nine new sections on the deliberately different axis — **the system and the ladder**: the five redundancy arrangements above the machine, the installed-MW-per-protected-MW arithmetic (N = 1.0 · block-redundant and N+1 at 4+1 = 1.25 · distributed redundant = 1.5 · 2N = 2.0), the maintenance day as the real design case, the distribution between the UPS output and the server's two cords read as a *redundancy* problem, one UPS idea across four orders of magnitude, and the battery that earns
- **`siemens-energy.study.json` 6 → 18 sections.** Ten new Grid Technologies sections teaching **the network as a system**: why the wire not the plant is the constraint and the three limits that bind under N-1; terminals → GCB → GSU → bay → switchyard → point of interconnection as a procurement sequence, read twice (once for a plant, once for a campus); AIS vs GIS vs SF6-free; the four reasons to build a DC link; inertia and system strength with the synchronous condenser against the STATCOM; and the buyer's six instruments against a 36-month transformer
- **`narada.study.json` new, 13 sections** — the backup battery from the **cell's** side: the sprinter and the distance runner, electrode thickness as the choice that splits them, the constant-power specification (watts per cell, to an end voltage, at a temperature) and why amp-hour sizing comes up short, AGM/lead-carbon and why lead survived partial-state-of-charge duty, the string and its worst cell (conductance screening vs a real capacity test), and the 500 ms pulse duty
- **Lesson plans** under `study-prep/vertiv/`, `.../schneider-electric/`, `.../siemens-energy/` and `.../narada/` — **four new folders; none of these four companies had one before**
- **Concepts 401 → 464** (+62, plus 2 added on validator feedback = 465 final)

**The register answer, verified against the corpus rather than remembered:**

- **G3 CLOSES** (v04.51r). Both revisions landed; the dossier half was already satisfied twice over by Piller (v04.42r) and Mitsubishi Electric (v04.48r)
- **G9 CLOSES** (v04.51r). The Narada guide is the battery half of the DC bus; Vicor (v04.44r) was the silicon/shelf half. `inside-the-rack` and `the-800-vdc-shift` can now pin `study:narada`
- **G4 is TWO OF THREE and cannot close from Profiler work at all.** Siemens Energy revision ✓, Powell dossier ✓ (v04.48r). The third ask is a guidance module *"The grid-equipment shortage: GOES, bushings, test bays, lead times"*. Verified: `guidanceDocs_()` still returns the same seven modules, and **§8 of the coverage plan contains no guidance-module row anywhere**. §5 of that plan predicts G4 will close at the phase re-run — that prediction is wrong, and the §6 register note now says so. **The Industry Guidance Command's step 1 requires an UPLOADED source document**, so this cannot be handed to an unattended session; the developer has to bring a document
- Only G3, G4 and G9 were re-run. G2, G5, G6, G7, G8, G10, G11, G12 keep their Phase-A dates; the full re-run is still owed at the close of Phase B

**Key decisions and positions taken:**

- **The vertiv/schneider split was decided explicitly and stated in both guides' opening callouts**, as the brief required: Vertiv = the machine and the transaction, Schneider = the system and the ladder. The split was chosen *after* reading Rehlko, Piller, Mitsubishi Electric and Eaton in full — Rehlko already owns monolithic-vs-modular, the four clocks and the three sizing numbers, and Mitsubishi Electric owns the efficiency curve and the VRLA/lithium table, so neither revision re-argues any of it
- **Nothing was deleted from the three revised guides.** All six pre-existing sections in each are byte-identical (verified with `git show HEAD:`), and all 36 legacy top-level `flashcards[]` cards were preserved by folding them into the new inline `drill` sections. Chesterton's Fence held: the temptation was to rewrite the mechanically-lifted v1 prose, and it was resisted because the brief asked for an addition, not a rewrite
- **Three concept candidates were dropped as alias collisions rather than added**: `maintenance bypass` and `wrap-around bypass` already resolve through `static bypass`, `switchyard` through `substation`, `reactive power` through `power factor`. The existing definitions were checked and found adequate; the distinctions that mattered (a manual wrap-around cabinet vs the automatic static switch) are taught in plain prose instead
- **No registry sync and no graph rebuild were run, deliberately** — no `*.profile.json` was touched, so both would have been no-ops. Reported as a decision rather than silently skipped, because the brief asked for exactly that. No calendar rows, no Profiler page or GAS bump

**Environment notes — TWO NEW CORRECTIONS beyond the inherited C3 set:**

- **The Profiler route is `#<slug>`, NOT `#/company/<slug>`.** The C3 notes never recorded the hash format and the first harness run timed out waiting for `#ov-study-btn`
- **The image's Playwright browser build is 1194; the pip package (1.62) expects 1234.** Launch with `executable_path='/opt/pw-browsers/chromium'` (plus `--no-sandbox`). **`playwright install` is not the fix** and should not be attempted
- Everything else from C3 held exactly and should be carried forward: threaded HTTP server or `page.reload()` deadlocks; `add_init_script` setting `localStorage ov_note_role='admin'`; an injected style hiding `#ov-authwall`; `accounts.google.com` fulfilled with an empty script; `ensure_ascii=False` for marker comparison; tabs are `id="ov-tab-<key>"`; assert `.ov-rel-src` against *sourced* relationships only; control-test an untouched slug first to set the console baseline
- **NEW AUTHORING TRAP: a `{{term}}` marker must carry the concept's TERM, not its slug.** `{{mobile-substation}}` does not resolve where the registry holds `mobile substation`. It is completely silent while authoring — a slug reads like a plausible marker — and it produced **48 errors across 25 distinct terms in two guides**. `check-profiler-study.py` catches every one, and a slug→term repair pass fixes them mechanically
- The indent trap did not repeat: `*.profile.json` / `*.study.json` at indent=1 with **no** trailing newline, `profiler-concepts.json` at indent=2 **with** one — verified against live files before writing. `repository.version.txt` **does** carry a trailing newline (caught at the pre-stage diff review)
- **Authoring the guides as one Python builder script each** (12–18 sections per tool call) rather than many small Edits is why the session ran 41m against a 75m estimate. The per-tool-call heuristics do not model this pattern

**Verification, all green at close:** study checker `0 errors, 80 guides / 465 concepts` · Playwright across all four guides plus an untouched control slug (`rehlko`) — zero page errors, zero new console errors, zero literal `{{markers}}` rendered, every `{{term}}` resolving in the DOM (145 distinct concepts; 204 counted per guide) and every section title present, 18/18 · 17/17 · 18/18 · 13/13 sections rendered

**Where we left off:** `4a371aa` is merged to `main` (v04.51r) and the branch was deleted by the auto-merge workflow. The developer then asked for the next paste-in prompt, which was delivered in chat for **C11** — Oklo · Trane Technologies · McCarthy — with its own entity-discipline notes (Oklo is pre-revenue and no Aurora is operating; Trane Technologies is not just Trane and the data-centre line is a minority of revenue; McCarthy is private and employee-owned, so expect a collection gap on revenue and mix).

**Active context:** `TEMPLATE_DEPLOY` Off · `MULTI_SESSION_MODE` Off · `CHAT_BOOKENDS` Off · `START_OF_RESPONSE_BLOCK` On · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · Profiler `v01.82w` / `v01.34g` (untouched — data-only session) · **106 dossiers · 80 study guides · concepts 465 · graph 678 edges (unchanged) · calendar 67 rows (unchanged) · execs 328 images / 62 companies · CHANGELOG 68/100** · 1 active reminder (the Xcel Fable-vs-Opus model test) · TODO empty

**Recommendation for next session:**

- **Run C11 — Oklo, Trane Technologies and McCarthy — as one Opus 5 xhigh dossier session.** It is the only remaining Opus session that closes a register row: Oklo closes **G8** outright if its guide teaches what is genuinely new about an SMR as engineering (factory fabrication vs site construction, HALEU, the licensing path as the schedule, load-following, build-own-operate) rather than telling a company story, and Trane delivers the chiller half of **G7** — whose CDU half is CoolIT in Fable session **B10**, so G7 cannot close this session and the report at the end should say so plainly. After C11, every register row Opus can close is closed, and the remaining blockers are Fable's B10 (G7, G10) and a **guidance session** for G4's grid-equipment-shortage module, which needs a source document from the developer.
**To continue:** type `run Phase C11 on Opus 5 xhigh`

## Previous Sessions

**Date:** 2026-09-04 03:30 AM EST
**Repo version:** v04.50r (started at v04.49r — one push commit, `5ff34d9`, plus this context write)
**Branch:** `claude/phase-c3-infineon-flex-wc40ov`
**Model:** **Opus 5 xhigh — the plan's own assignment for Phase C, so there is NO substitution to record.** The §8 Model column reads plain `Opus 5 xhigh` on both C3 rows

**What we worked on — Phase C3 of `PROFILER-COVERAGE-PLAN.md`, landed as v04.50r in one data-only push, then the deferred Phase-B-vs-Phase-C recommendation and a re-plan of everything that remains:**

- **`infineon.profile.json`** — 77 sources at 53% first-party, 9 product lines, 6 spec groups, 29 developments, 6 relationships, 5 policy regimes, 10 decision makers (9 headshots), 5 financial periods. Centre of gravity held on data-centre power silicon rather than automotive microcontrollers, as briefed
- **`flex.profile.json`** — 91 sources at 68% first-party, 7 product lines, 6 spec groups, 28 developments, 13 relationships, 6 policy regimes, 16 decision makers (15 headshots), 4 financial periods. The owned-versus-built-for-others line is held in every figure with a labelling key stated in `financials.commentary`
- **`infineon.study.json`** (14 sections) teaches **the switch, not the chain**; **`flex.study.json`** (11 sections) teaches **the last hundred metres and the contract**. Each opens with an explicit list of what it does not repeat from Vicor, Megmeet, Delta, LITEON and Zhonhen
- **49 shared concepts** (352 → **401**); four candidates dropped as alias collisions rather than added
- **Thirteen dossiers backfilled** with archival and `profileVersion` +1: nvidia, delta-electronics, mitsubishi-electric, vicor, liteon, megmeet, vertiv, eaton, schneider-electric, abb, powell-industries, amazon, google
- **25 headshots** (304 → **328** images across 62 companies)

**The three findings that would have made the dossiers wrong if missed:**

- **Infineon's Dresden fab OPENED 2026-07-02, about three months AHEAD of schedule** — not under construction. It also **divested its Austin, Texas fab** to SkyWater in FY2025, and the Marvell deal was **automotive Ethernet**, not custom HBM. Infineon **re-segmented on 2026-07-01** (four segments to three), so every ATV/GIP/PSS/CSS series terminates at Q3 FY2026
- **Flex's board approved spinning off the ENTIRE Cloud and Power Infrastructure segment on 2026-05-05**, targeted Q1 calendar 2027, with the CEO going to the new company — and then agreed a **$4.4bn acquisition of EPC Power on 2026-09-03**, into that segment, weeks before it separates. The dossier describes a structure with roughly two quarters left
- **The EPS blending trap is live and provable.** Investing.com recorded a 35.01% miss on Infineon's 2025-08-05 print by comparing an IFRS actual (€0.22) against an adjusted consensus (€0.339); TipRanks recorded a beat on the same print by staying on one basis. It was a beat on the adjusted basis and roughly in line on IFRS. **Every `expected` value in the file now comes from the Vara Research consensus Infineon itself commissions, which prints both bases side by side.** Flex has the same trap in GAAP-vs-adjusted form ($2.33 against $3.30 in FY2026)

**Key decisions and positions taken:**

- **No Infineon↔Flex relationship is curated at all.** NVIDIA's 800 VDC roster names them in *different* tiers, which states each party's relationship to NVIDIA and not to each other; both research passes independently searched for a bilateral data-centre link and found none. The only sourced tie is an automotive zone-controller kit. The non-curation is written into both dossiers rather than left silent — as are the ABB / Eaton / GE Vernova / Hitachi Energy / LITEON / Megmeet / Schneider / Vertiv co-membership links, on the same reasoning
- **`siemens-energy` was deliberately NOT linked from either file.** The switchgear and 800 VDC sources name *Siemens AG*, a separately listed company. Both agents flagged it independently
- **`tesla` is curated on Infineon as `historical`** with the reason stated — 2018-vintage trade press, and Tesla has since cut SiC content per vehicle by about three quarters
- **No Flex data-centre revenue figure was derived**, because none exists. The smallest disclosed unit is the CPI segment ($6,614m FY2026), which blends owned product with contract manufacturing; the Cloud and Cooling / Power sub-lines are disclosed only as growth rates
- **Revathi Advaithi has no headshot.** Flex's leadership page carries her name and bio but no image file and three predictable asset paths 404'd. Recorded in her `background[]` rather than filled from outside the photo policy. Same discipline as `peter-friedrichs` on Infineon, whose asset URL genuinely 403s while all nine siblings returned distinct images (control-tested)

**Environment notes — two corrections to the inherited harness, both needed:**

- **The Playwright harness needs `localStorage.setItem('ov_note_role','admin')` in an `add_init_script`** or the Relationships tab and the Study-guide button never render — they are gated by `OV_ROLE_CAPS` and a signed-out session is `viewer`. **And `#ov-authwall` must be hidden with an injected style**, because it is appended whenever a GAS backend URL is configured and it intercepts every pointer event (clicks time out with "div#ov-authwall intercepts pointer events"). Also: tabs carry `id="ov-tab-<key>"`, **not** `data-tab`
- **The `.ov-rel-src >= len(relationships[])` assertion inherited from C1 is wrong** and fails on other sessions' data. Assert against the count of relationships that actually **carry a `source` field**. The scan this prompted found **77 of the corpus's 662 curated relationships have no `source` field at all** — catl 6 of 7, arevon/black-veatch/blattner 5 of 5, abb and eaton 4 of 9–11, delta-electronics 4 of 9. Pre-existing, other sessions' rows, **reported not fixed**
- `json.dumps(sg)` must use `ensure_ascii=False` when comparing markers to rendered text, or `I²R loss` becomes `i²r loss` and reports a false failure
- **The `indent=1` trap did not repeat.** Verified against live files first: `*.profile.json` / `*.study.json` are indent=1 with **no trailing newline**; `archive-index.json` is indent=1 **with** one; `profiler-concepts.json` / `profiler-companies.json` are indent=2 with one. Thirteen backfills produced **823 insertions / 38 deletions**
- Research subagents again exhausted the WebSearch budget. What paid off: naming the must-find list explicitly, giving each agent the full covered-slug list, telling Agent B to **name the outlet per figure and never blend**, and telling each agent that a premise of mine might be wrong — which is how the Dresden and spin-off corrections surfaced

**Verification, all green at close:** registry sync `0 of 106 out of sync` · study checker `0 errors, 79 guides / 401 concepts` · local schema-v7 validator clean on both new profiles and **0 new errors** on the thirteen backfilled ones compared against their archived pre-edit copies · graph 643 → **678 edges (512 curated), 2,008 evidence items** · Playwright across all fifteen touched dossiers with zero page errors and zero console errors

**Where we left off:** C3 is pushed as `5ff34d9` (v04.50r). The developer asked for a re-plan of everything remaining, split by model, and for the paste-in prompt to run the three §8 guide revisions. Both were delivered in chat at this session's close.

**THE RE-PLAN — this is the part a future session most needs:**

- **§2's model rule assigns ALL 30 guide passes to Opus, not just the three revisions.** The §8 sub-table is literally headed "Study guides on existing dossiers (Opus 5 xhigh)". That is the finding that reshapes the queue: **~16 Opus sessions are available without touching Fable at all** — 7 guide sessions (30 passes at 4–5 each) plus 9 dossier sessions C4–C12
- **Register arithmetic, verified this session.** Of the 48 remaining companies, only **C11 (Oklo → G8, Trane → half of G7)** and **B10 (DNV or Sargent & Lundy → G10, CoolIT → the other half of G7, X-energy → G8)** close any §6 row. **B3–B9, C4–C10 and C12 — 40 companies — close nothing.** The guide passes close more per session than any dossier group: the three revisions close **G3 outright** and deliver G4's guide third, and the `narada` backfill closes **G9**
- **G4 cannot fully close from §8 work at all.** It wants three things and the third is a guidance module on the grid-equipment shortage that appears nowhere in §8. Even after the siemens-energy revision it stands at two of three. Flag this at the phase-close re-check rather than expecting a close
- **G7 is split across phases by design** — Trane is C11 (Opus), CoolIT is B10 (Fable). Neither phase can close it alone
- **Recommended Opus order:** (1) guide session one = the three revisions + `narada`, which moves three register rows; (2) **C11**; (3) the remaining 26 guide backfills, ~6 sessions; (4) C4, C5, C6+C7, C8, C12; (5) **hold C9 and C10** — C9's own §5 rationale names Anthropic and Fluidstack (B9) and C10's names Aypa (B3) and Compass (B7), so running them early means writing dossiers that need backfilling later
- **Recommended Fable order when the cap resets:** **B10 first** (it is the only Fable session that closes a register row), then B9, B3 and B7 to unblock C9 and C10, then B4, B5, B6, B8
- After guide session one and C11, **every register row Opus can close is closed**, and G7 and G10 need Fable's B10. That is the natural handover point

**Active context:** `TEMPLATE_DEPLOY` Off · `MULTI_SESSION_MODE` Off · `CHAT_BOOKENDS` Off · `START_OF_RESPONSE_BLOCK` On · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · Profiler `v01.82w` / `v01.34g` (untouched this session — C3 was data-only) · **106 dossiers · 79 study guides · concepts 401 · graph 678 edges · calendar 67 rows · execs 328 images / 62 companies · CHANGELOG 67/100** · 1 active reminder (the Xcel Fable-vs-Opus model test) · TODO empty

**Known open items, reported not fixed:** the 77 sourceless relationships above; and `xcel-energy.study.json`'s `what-a-minimum-demand-charge-buys` section still carries section-level `pros`/`cons` arrays the renderer never reads, carried forward unfixed from C2.

**Recommendation for next session:**

- **Run the three §8 guide revisions — `vertiv` and `schneider-electric` each gaining a UPS section, `siemens-energy` gaining a grid-technologies section — plus the `narada` backfill, as one Opus 5 xhigh session.** It is the highest-leverage session left in the whole program: it closes **G3** outright, closes **G9**, and delivers the only remaining guide third of **G4**, with no research budget beyond re-prep on dossiers that already exist. Then re-check G3, G4 and G9 and date them in `CLASSROOM-CURRICULUM-PLAN.md` §6.
**To continue:** type `run the three §8 guide revisions plus the narada backfill on Opus 5 xhigh`
