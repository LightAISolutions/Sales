# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-04 01:20 AM EST
**Repo version:** v04.49r (started at v04.47r — two push commits: `97a42db` = v04.48r, the C2 data push; then v04.49r, the renderer fix + this context write)
**Branch:** `claude/phase-c2-profiler-coverage-hu3e60`
**Model:** **Opus 5 xhigh — the plan's own assignment for Phase C, so there is NO substitution to record.** §2 assigns Phase C to Opus natively; the §8 Model column reads plain `Opus 5 xhigh` on all three C2 rows

**What we worked on — Phase C2 of `PROFILER-COVERAGE-PLAN.md`, then a page-layer bug the verification surfaced:**

**Push 1 — v04.48r (`97a42db`), the C2 deliverable, data-only:**

- **Three `supplier` dossiers** (schema v7, profileVersion 1, intel-briefing prose): `mitsubishi-electric` (76 sources, 62% first-party, 17 relationships, 11 decision makers, 8 key judgments), `powell-industries` (67 sources, 75% first-party, 7 relationships, 10 people, 9 judgments), `mitsubishi-power` (77 sources, 68% first-party, 11 relationships, 11 people, 10 judgments)
- **Three study guides** with `where-it-fails` sections: the static UPS as a machine (ME), the medium-voltage room (POWL), the gas turbine read *against* GE Vernova and Siemens Energy rather than taught as a new category (MPower). Each opens with an explicit "what this deliberately does NOT repeat" list naming the adjacent guides
- **41 new shared concepts** in `profiler-concepts.json` (311 → 352). No local glossaries
- **Eight backfilled dossiers** whose links became curatable once the C2 slugs existed, each with a source that states the link explicitly: `ge-vernova`, `siemens-energy` (v4→v5) to mitsubishi-power; `eaton`, `abb`, `schneider-electric`, `vertiv` (v4→v5) and `piller` (v1→v2) to the C2 suppliers; `prevalon` (v3→v4). Prior versions archived and indexed
- **CHANGELOG rotation fired** at 101 sections — the whole 2026-08-29 group (36 sections) moved with SHA enrichment on every header; `Sections: 100/100` → `65/100`

**Push 2 — v04.49r, a real reader-facing bug the Playwright verification exposed:**

- `gdProsCons` set `card.t` / `card.meta` and `gdBars` set `it.label` / `it.sub` with **`textContent`**, not the `gdFmt` formatter every sibling field uses. A `{{term}}` in any of those four fields rendered to the reader as **literal braces**. A DOM probe confirmed it visibly on **10 guides / 18 markers** — `aep`, `cummins`, `dominion-energy`, `entergy`, `oncor`, `piller`, `rehlko`, `rolls-royce-power-systems`, `southern-company` and (before the fix) `mitsubishi-electric`
- **Fixed at the page layer, not in the data** — four edits in `Profiler.html` (v01.81w → **v01.82w**), plus a new `gdPlain()` helper for attribute contexts (`title=`) that cannot hold the markup `gdFmt` emits. One change repaired all ten guides; no other session's data was touched
- **Added a `check-profiler-study.py` rule** (`check_unformatted`) rejecting `{{` in the fields that remain plain by design — `sec.title`, `sec.read`, `timeline.lanes` — and negative-tested it: injecting a marker produces exactly one error, removing it returns to clean
- Reverted the data workaround from push 1: the C2 markers were **restored**, because the data was never wrong — the renderer was

**Where we left off:** both pushes merged; C2 is closed. C3 (Infineon, Flex) is the next session and is the one that owes the developer the **Phase-B-vs-Phase-C recommendation**.

**Key decisions and findings worth carrying forward:**

- **G3 and G4 are HALF-closed, not closed.** G3 wants two guide revisions (`vertiv`, `schneider-electric` — add a UPS section) plus a dossier for Piller *or* Mitsubishi Electric. The dossier half was already satisfied by Piller at v04.42r; ME over-satisfies it. **Both revisions remain untouched — verified, zero UPS content in either guide.** G4 wants a `siemens-energy` grid-technology revision, a Powell dossier, and a guidance module on the grid-equipment shortage (GOES, bushings, test bays, lead times). Powell closes exactly one of three. **The three guide revisions in §8's "Study guides on existing dossiers" table are the real blockers for both rows**
- **Entity discipline held for Mitsubishi Power**: every financial line is labelled MHI consolidated / MHI Energy Systems segment / GTCC business line, with an explicit statement that no unit-level figure exists or can be derived
- **No FX published for either Japanese company.** No defensible fiscal-year average JPY/USD rate could be sourced, so `usdMillions` is omitted and the reason is stated in `financials.commentary`; `kpiNorm` false for both. Powell is "as reported"
- **One headshot was deleted rather than published** — two readings of Mitsubishi Electric's leadership page disagreed on whose face `img_32`/`img_39` was; the omission is recorded in that person's `background[]`
- **Deliberate non-curations, all recorded in the dossiers**: `powell-industries ↔ siemens-energy` (Powell's 10-K names *Siemens Industries, Inc.* = Siemens AG, not Siemens Energy AG), the 2006 GE Consumer & Industrial route to `ge-vernova` (that unit became GE Industrial Solutions and went to ABB — the ge-vernova link is instead carried on an explicit market ranking), and `mitsubishi-power ↔ nvidia` (a parent-level cooling/power partnership, not a turbine relationship)
- **An agent premise of mine was wrong and the agent corrected it**: I told the ME agent the Memphis TN transformer plant was relevant; it established MELCO *sold* it to Hyosung in 2019 for $46.5M. That became the dossier's headline collection gap
- **JSON indentation trap**: the backfill script wrote `indent=2` where the repo convention for `*.profile.json` / `*.study.json` is **`indent=1`**. It reformatted every line of nine files — 9,375 insertions before normalisation, 2,863 after. Caught at the pre-stage `git diff --stat` review. **Any future backfill script must serialize at `indent=1`.** (`profiler-concepts.json` and `profiler-companies.json` are genuinely `indent=2`; archive snapshots match whatever the file they snapshot used)

**Environment notes (carried forward from C1, all re-confirmed this session):**

- **The Playwright HTTP server MUST be threaded.** `Profiler.html` fetches ~100 JSON files on load, so a single-threaded `socketserver.TCPServer` deadlocks on `page.reload()`. Use `socketserver.ThreadingMixIn` + `http.server.HTTPServer` with `daemon_threads`, swallow `BrokenPipeError`/`ConnectionResetError` in `handle_one_request`, add a no-op `handle_error`, and install a flushing `print` shim (output is otherwise lost when a run dies)
- `page.reload()` between dossiers — the Study Guide overlay persists across hash navigation
- The Relationships tab id is **`rels`**, not `relationships`
- `#ov-guide-overlay` is `position:fixed`, so `offsetParent` is always null — test visibility with `getComputedStyle(ov).display !== 'none'`
- Wait for `#ov-guide-overlay .gd-title` after clicking `#ov-study-btn` (concepts load asynchronously)
- **Fulfill** `accounts.google.com` with an empty script rather than aborting — an aborted GIS load logs a network failure the console-error assertion correctly counts
- Derived "Detected" relationship cards render alongside curated ones, so "every card has a source link" fails wrongly. Assert instead: cards carrying `.ov-rel-src` ≥ `len(relationships[])`
- No JS regex literals inside `page.evaluate` strings — Python eats the escapes
- **Console 404s map exactly to companies with no study guide** (27 of 104). Not a defect. Before blaming a change, control-test an untouched slug
- Research subagents exhaust the WebSearch budget — **every must-find item goes in the agent prompt**, because nothing can be searched after they return

**Verification gates, all green at close:** registry sync `0 of 104 out of sync` · study checker `0 errors, 77 guides / 352 concepts` (with the new rule active) · local schema-v7 validator `0 errors` on the three new profiles and `0 new` on the eight backfilled ones (compared against their archived pre-edit files) · graph `643 edges (493 curated), 1,921 evidence items` · Playwright: zero page errors and zero console errors, every `relationships[]` slug and every `{{term}}` resolving, and `0 guides showing literal braces`

**Active context:** `TEMPLATE_DEPLOY` Off · `MULTI_SESSION_MODE` Off · `CHAT_BOOKENDS` Off · `START_OF_RESPONSE_BLOCK` On · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · Profiler `v01.82w` / `v01.34g` · Classroom `v01.07w` / `v01.16g` · **104 dossiers · 77 study guides · concepts 352 · graph 643 edges · calendar 65 rows · execs 304 images / 60 companies · CHANGELOG 65/100 · Profiler page changelog 50/50** · 1 active reminder (the Xcel Fable-vs-Opus test) · TODO empty

**Known open item, not fixed here:** `xcel-energy.study.json` section `what-a-minimum-demand-charge-buys` carries section-level `pros`/`cons` arrays that the renderer never reads — that content is invisible to the reader. Different bug class from the brace defect (missing content, not wrong markup) and it belongs to another session's row, so it is reported rather than edited.

**Recommendation for next session:**

- **Run Phase C3 — Infineon and Flex — on Opus 5 xhigh** as a fresh session, using the paste-in prompt handed over at this session's close. It is the last group before the developer's Phase-B-vs-Phase-C decision is owed, neither company depends on an uncovered Phase B slug, and it closes G9 (rack/board power) plus the rack-power gap.
**To continue:** type `run Phase C3 of PROFILER-COVERAGE-PLAN.md — Infineon and Flex — on Opus 5 xhigh`
