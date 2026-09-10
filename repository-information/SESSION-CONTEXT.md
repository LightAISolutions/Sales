# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-10 07:12:18 AM EST
**Repo version:** v05.35r — **six push commits** on `claude/adoring-euler-3a855i` (v05.30r → v05.35r), each merged before the next
**Branch:** `claude/adoring-euler-3a855i`
**Model:** Opus 5 — S3 budget review, then a chain of fixes that grew out of verifying the first one

### What was done

1. **v05.30r — the S3 action plan was evaluated against the developer's token budget, and `PROFILER-COVERAGE-PLAN.md` §10.5 was added.** S3 stands at **7 of 10**: the public lane is finished (P1–P6), the private lane is 1 of 4 (V1), and **V2, V3 and V4 are all Fable 5.1 High**
2. **v05.31r — dossier `**bold**` markers rendered as literal asterisks; fixed at the chokepoint.** `ovEl` now routes through `ovSetText` (real `<strong>` runs) and `ovPlain` strips markers from prose mined for relationship evidence
3. **v05.32r — the bold fix appeared not to work, and the cause was a deeper bug.** The page was cached; the version pill fetches `no-store` while the HTML document does not. Added a **first-load staleness check** to `Profiler.html`
4. **v05.33r — promoted to both templates and all ten pages.** The templates never had the cache-busting reload *either*, so this promoted **two dependent fixes**. Also rotated `Profilerhtml.changelog.md`
5. **v05.34r — audited the README tree's version displays.** Five of eight GAS displays were stale, each by exactly one bump. Added `scripts/check-readme-tree.py` and turned [PC-README-TREE] #7's instruction into a verification step
6. **v05.35r — wired the checker into `auto-merge-claude.yml`** as a post-merge auto-fix, and verified it on run #537

### Where we left off

All six pushes merged. The workflow step was **verified on real infrastructure** (run #537, success, step 17 of 19, ~0.23 s, `Delete branch` and `Sweep` ran after it). Nothing is in flight.

### Key decisions and findings

- **S3's blocker is budget, not arithmetic, and §10.5 records the measurement.** A Phase E session costs **~20 points of the weekly all-models allowance** (82 points across P3–P6 in sixteen hours). At **95% all-models / 96% Fable** the remainder was about a quarter of one session, and Phase E is **single-push-commit**, so a session that runs dry leaves nothing committed. **Do not start V2, V3 or V4 on a near-exhausted allowance.** Splitting V2 rescues neither the arithmetic nor the landscape gate — §10.3 holds the software landscape for the pure-play optimizers *plural*
- **All three §10.5 consolidation items were misdescribed when written, and each failed differently against the primary source.** **A** (pre-emptive CHANGELOG rotation) was **withdrawn** — it compared the raw section count against a threshold the spec tests on a **non-exempt** basis, the exact reading reconciled out at v05.01r for firing rotations early. **B** was real but **~120× understated** — recorded against `ecosystemRole` (4 occurrences, last of fourteen fields) when the true surface was **483 across 60 dossiers**, led by `strategyRead[]` at 379. **C** was **not a defect** — the EVE/HiThium inversion is an artifact of one house's half-year table against another's full-year one across a 4% gap; neither role changed. **The common cause: each had been written from a summary of the evidence rather than the evidence**
- **The `<meta build-version>` tag is now load-bearing on every page.** It was documented in three places as informational and never read; all three were amended. A page reads its own stamp on the first poll and reloads once when the version file is ahead. **Bumping `html.version.txt` without the meta tag now costs every visitor one wasted reload.** Two guards are mandatory and present: a single-attempt `sessionStorage` loop guard (the two values are bumped by hand and *can* drift) and a null-safe read
- **The workflow step is deliberately a post-merge auto-fix, not a pre-merge gate.** A blocking gate would strand a real page fix behind a wrong number in a README table. More concretely, **it must never fail**: `Delete branch` and `Sweep` are gated on `success()`, so a red step would leave the `claude/*` branch on the remote and collide with push-once enforcement on the next push. Structural findings emit `::error::` and the step still exits 0 — verified under `bash -e` across three cases
- **A rule missed five times out of eight was not unclear — it was unread.** [PC-README-TREE] #7 named both trigger rules by ID. The structural cause is that the obligation and its trigger lived in **different rules**: a session bumping a `.gs` reads [PC-GS-VERSION] #1, updates two files, and never opens #7. The fix restates the obligation **at both triggers** as well as adding the checker
- **Untested path, stated plainly:** run #537 took the "already in sync" branch, so the step's `git add` / `commit [skip ci]` / four-attempt retry-and-rebase code **has not executed on a runner**. It is copied line-for-line from the AHK step, which runs regularly, so risk is low — but low is not verified. It will exercise itself the first time a session leaves drift

### Active context

- **Repo version** `v05.35r`; **CHANGELOG at 101/100 — 98 non-exempt**, so rotation is **not** due but fires on the next push landing on a later EST day. The clone is **already unshallowed** (1,096 commits, deepened at v05.33r), so SHA enrichment will resolve
- **S3: 7 of 10.** Remaining: **V2 · `E1b` (Habitat Energy · Gridmatic)**, **V3 · `E5` (Grid United · Pattern Energy)**, **V4 · `E4b+E6b` (Mitra Chem · Cornex)** — all Fable 5.1 High. **V2 is the sole remaining gate**; V3 and V4 are pure deepening. **V4, not P6, completes the SNE H1-2026 storage-cell top twelve** — `cornex` sits 7th at 30.2 GWh
- **Page versions after this session:** Profiler `v01.86w`, Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Still awaiting developer approval (§10.5 item D, offered six sessions running):** adding `aka[]` to the `Profiler.html` roster search haystack (~line 2202, currently `(c.name + ' ' + c.slug)`), narrowed to names-only by explicit directive 2026-08-30. P5 and P6 added **79 aliases across four companies** the roster cannot find
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **S3 V2 · group `E1b` (Habitat Energy · Gridmatic) on Fable 5.1 High** as a fresh session — **but only once the weekly Fable allowance has actually reset.** It is the sole remaining gate on `software-and-optimization`, the one held landscape, and clearing it unblocks S2 on all nineteen segments. Two things shape the research: **both subjects are private optimizers whose value is inference from a thin public record** — the §2 model rule's reason for putting them on Fable — and **§10.3 holds the landscape for the pure-play optimizers plural**, so a half-session on one company may not release it. P3 sharpened why they matter: both of the segment's incumbents reach it from an adjacent business (FlexGen from integration, Stem from solar asset-performance management), so the pure-play merchant optimizers are still entirely on the private side. Check the allowance before starting — §10.5 measures a Phase E session at ~20 points and the format is all-or-nothing.

**To continue:** type `run S3 V2`

## Previous Sessions

### Session — 2026-09-09 07:18:49 AM EST (v05.29r)

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

Developed by: LightAISolutions
