# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-09 07:18:49 AM EST
**Repo version:** v05.29r
**Branch:** `claude/*` (P6 session)
**Model:** Opus 5 xhigh — **S3 P6 · group `E6a` (CALB · Great Power)**
**Reconstructed:** Auto-recovered from CHANGELOG (the P6 session did not save context; reconstructed 2026-09-09 06:11 PM EST during the v05.30r budget-review session)

### What was done

1. **P6 shipped (v05.29r) and the public lane is finished, six of six.** `calb` (60 sources, 57% first-party) and `great-power` (57 sources, 61%), each with a 13-section schema-v2 study guide and a full lesson plan. Sixteen concepts registered (1,388 → 1,404), inserted alphabetically per the P5 correction
2. **The role was genuinely undecided and the evidence decided it: both `challenger`.** SNE Research H1-2026 puts CALB 5th (31.5 GWh / 6.8%) and Great Power 10th (20.5 GWh / 4.4%) of a 461.3 GWh market. Incumbency was not arguable — the bar is top-three plus leader language and `eve-energy` is a challenger at 2nd. `cells-and-chemistry` went 18 members / 4 inc / 8 cha / 6 adj → **20 / 4 / 10 / 6**; both also took `storage-integrators-and-containers` · adjacent
3. **The row's own claim was wrong: P6 does NOT complete the SNE top twelve.** Coverage went nine of twelve → **eleven**. The twelfth is **`cornex` at 7th on 30.2 GWh — ranked above both companies P6 landed — and it is V4's**
4. **A new reusable primary source.** Great Power's HK application is **definitively `Lapsed`** on HKEX's own daily-regenerated consolidated listing-application index (`sehkconsolidatedindex.xlsx`), not on the 404 that suggested it — a control test showed Deye's proof 404s identically. Prefer the index over probing document URLs

### Where we left off

All P6 work committed, pushed and merged. **A separate v05.30r session then reviewed S3 against the developer's token budget** and added **§10.5** to `PROFILER-COVERAGE-PLAN.md` — see below.

### Key decisions and findings

- **S3 is seven of ten. The public lane is complete; V2, V3 and V4 remain and all three are Fable 5.1 High**
- **The v05.25r reorder's budget premise has inverted.** It ran the public lane first because Fable was 96% consumed against **13%** of all-models. Sixteen hours later all-models is **95%** and Fable still 96%, so there is no cheap lane left. §10.5 measures a Phase E session at **~20 points of the weekly all-models allowance** (82 points across P3–P6) and concludes **no Phase E session fits in the ~5% remaining** — and that splitting V2 rescues neither the arithmetic nor the landscape gate
- **`software-and-optimization` remains the only held landscape, and V2 is the sole gate on it.** V3 and V4 are pure deepening
- **Four cheap non-session items are queued in §10.5**, in order: (A) rotate the CHANGELOG pre-emptively — it buys Fable budget by moving rotation out of a Fable session; (B) the literal-asterisk render bug, now measured at **60 affected profile files** rather than the 14 P5 recorded, fixable at `Profiler.html:3848`/`:5992`; (C) the `eve-energy` / `hithium` typing tension, registry-only; (D) `aka[]` in the roster haystack at `Profiler.html:2202` — **needs developer approval**, narrowed to names-only by directive on 2026-08-30
- **CHANGELOG at 96/100 after v05.30r** — rotation due about four pushes out
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run the **cheap consolidation pass — §10.5 items A, B and C** in one session: rotate the CHANGELOG pre-emptively, fix the literal-asterisk render in `Profiler.html` (60 dossiers affected), and resolve the `eve-energy` / `hithium` typing tension in `profiler-segments.json`. It costs a fraction of a Phase E session, fits the remaining allowance, and item A directly buys back Fable budget for V2. Do **not** start V2 until the weekly allowance resets.

**To continue:** type `run the S3 cheap consolidation pass`

## Previous Sessions

### Session — 2026-09-09 06:00:20 AM EST (v05.28r)

**Date:** 2026-09-09 06:00:20 AM EST
**Repo version:** v05.28r — **one push commit** on `claude/jolly-dijkstra-ybdikq` (plus this session-context commit, the sanctioned second because the first push had already merged)
**Branch:** `claude/jolly-dijkstra-ybdikq`
**Model:** Opus 5 xhigh — **S3 P5 · group `E4a` (Albemarle · NOVONIX)**, then the P6 paste-in prompt

### What was done

1. **P5 shipped (v05.28r).** `albemarle` (75 sources, 52% first-party) and `novonix` (69 sources, 71%), each with a 13-section schema-v2 study guide and a full-depth lesson plan. `cells-and-chemistry` went 16 members / 4 incumbents / 8 challengers / 4 adjacent → **18 / 4 / 8 / 6**. Thirty concepts registered (1,358 → 1,388) and eighteen company-published executive photographs downloaded
2. **The adjacency hypothesis held, and was tested rather than assumed.** Both typed **adjacent**. `compute-and-the-rack` and `storage-integrators-and-containers` were read against Albemarle's bromine line and **rejected** — a flame-retardant additive is not a rack, a system integrator or a factory-assembled block. NOVONIX **could not** have been typed challenger: continuing-operations revenue is **US$0** and no commercial anode volume has shipped, against a 2024 market of 2.11 Mt whose ten largest producers are all Chinese
3. **The Nasdaq question resolved harder than "unannounced" — it is arithmetically unresolvable on 2026-09-09.** The ten-consecutive-business-day cure test began at the 2026-08-27 ADS ratio change; excluding Labor Day (2026-09-07), the tenth session cannot fall before **2026-09-10**, one day after authoring, against a **2026-09-14** deadline. Eight qualifying closes had completed. No announcement exists on EDGAR (newest filing 2026-09-02) or the ASX list (newest 2026-09-04)
4. **Four findings no §8 row carried.** NOVONIX is being **removed from the S&P/ASX 300** on 2026-09-21; the **AD/CVD case it petitioned for FAILED** on a 2-1 ITC vote, after which it cut its own assumed selling price from US$10–12/kg to US$7–11/kg; **Riverside full capacity slipped to September 2031** against a Section 48C deadline of 2028-04-07; and the **Harper furnace licence lapsed unpaid** on 2026-01-01. On the other side, **Albemarle announced a CEO succession on 2026-09-02** — six days before the batch identity sweep that missed it

### Where we left off

All work committed, pushed and merged. The **P6 paste-in prompt was handed to the developer in chat** — the next session is a fresh Opus 5 xhigh session, not a continuation of this one.

### Key decisions and findings

- **`check-source-reachability.py` was wrong about the SEC for the THIRD consecutive session, and the cause is now identified.** It is **not a network block — it is a User-Agent format failure.** SEC hosts return 403 to a UA without a contact email and **200** to one containing it; `LightAISolutions Research jonyang92@gmail.com` returned 200 on three consecutive attempts against both `sec.gov` and `data.sec.gov`, and the entire first-party financial record for both companies came from them. **This retires two sessions of "SEC is blocked" folklore.** Separately, `ir.novonixgroup.com` served 200 here while **both** research agents recorded it 403 — probe hosts yourself rather than inheriting a verdict
- **I used a primary source over an agent's verdict once, and was right to.** The third-party agent explicitly discarded the "five of seven consecutive trading days" Amortization Event trigger as belonging to an unrelated issuer. It is in NOVONIX's own HY-2026 Note 8, which I had already read. The two agents also disagreed on the $245.6m impairment (Kemerton vs the Refining Solutions held-for-sale write-down); the 10-K settles it as Refining Solutions, Q4-2025
- **The P4 indent trap cost nothing, because a helper replaced memory.** A read-detect-write helper was proved **byte-identical on a round-trip of all five shared JSON files before any write**. Diffs were 60 lines on the roster and 34 on the calendar against P4's reverted 2,350. **One correction to the standing instruction: `profiler-concepts.json` is SORTED ALPHABETICALLY BY SLUG, not append-at-end** — the append-at-end convention applies to `profiler-companies.json` and the refresh calendar only
- **The intel-briefing style's bold markers render as literal asterisks, corpus-wide.** `Profiler.html` passes `summary` and `ecosystemRole` through as plain text, so `**BOTTOM LINE UP FRONT:**` displays its asterisks — in the shipped `intertek` dossier as much as in this session's. Fourteen dossiers carry it. This session brought its own prose within corpus norms rather than touching the page; **the fix, if the developer wants one, is a `Profiler.html` change and therefore not a dossier session's to make**
- **The pacing rule held.** Nothing was staged until both first-party agents returned, and it mattered: the NOVONIX first-party report overturned the premise that the company still has a battery-testing business, and the Albemarle one corrected the divestiture structure and the segment count

### Active context

- **Repo version** `v05.28r`; CHANGELOG at **94/100** sections — rotation due at 100, so roughly **six pushes of headroom**
- **S3 progress: 6 of 10 sessions** (P1, P2, V1, P3, P4, P5 done). Remaining order: **P6 → V2 → V3 → V4**. The public lane is **five of six done**
- **`software-and-optimization` remains the only held landscape**, and only V2 clears it. P6, V3 and V4 are pure deepening
- **Two dated triggers now live in calendar rows:** `novonix` on **2026-09-14** (Nasdaq cure deadline — the row FLIPS rather than drifts, and should convert to the quarterly cadence, ~2026-10-29, once the outcome lands; the S&P/ASX 300 removal on **2026-09-21** is a second item in the same window), and `albemarle` on **2026-11-04** (cadence-inferred Q3, unconfirmed) with a **live Chilean strike** unresolved at authoring — 97.49% strike authorisation on 2026-08-31, mediation requested 2026-09-01
- **`cells-and-chemistry` is the corpus's largest segment at 18 members**, and its `notes` field now records the upstream-materials adjacent role as **partly filled** — still open for the private cathode and cell names of E4b/E6b (`mitra-chem`, `cornex`)
- **Offered and not taken** (needs developer approval, carried from four sessions): adding `aka[]` to the `Profiler.html` roster search haystack (~line 2202, currently `(c.name + ' ' + c.slug)`), narrowed to names-only by explicit developer directive 2026-08-30. Would require a page version bump. P5 strengthens it again — Albemarle's fifteen aliases include Ketjen, Talison, Greenbushes, Wodgina and SAYTEX, and NOVONIX's eleven include GX-23, Avrion Battery Labs and Dryve Battery Materials, none of which the roster can currently find
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **S3 P6 — group `E6a` (CALB · Great Power) on Opus 5 xhigh**, as a fresh session using the paste-in prompt handed over in chat. It is the **last public-lane session**, and finishing it leaves **V2 as the sole remaining gate** on the one held landscape. Two things make it different from P5 and should shape the research plan: **the role is genuinely undecided** — the §8 cell says the session decides incumbent or challenger *on the rank it finds*, so the third-party ranking work is the deliverable rather than a check — and **neither company files with the SEC**, so this session's User-Agent finding is irrelevant and the hosts that matter are `cninfo.com.cn` and `hkexnews.hk` (both 200 at C12) plus `szse.cn`, which is **intermittent rather than blocked** and must be probed at least three times. Both §8 identity cells carry grep traps: CALB must never be searched as "China Aviation Lithium Battery", and Great Power's A+H application appears to have **lapsed unfiled** around 2026-07-30 without ever listing

**To continue:** type `continue with your recommendation`

Developed by: LightAISolutions
