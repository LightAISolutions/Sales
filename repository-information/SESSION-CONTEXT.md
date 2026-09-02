# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
**Date:** 2026-09-01 09:30:32 PM EST
**Repo version:** v04.10r
**Branch:** `claude/profiler-apex-clean-energy-wunvad`

**What we worked on (two pushes, v04.09r and v04.10r):**

- **v04.09r — Apex Clean Energy dossier (profileVersion 1).** Two-agent research pass (first-party ~80 company URLs; third-party 71 pages), written at schema v7 in the `intel-briefing` style: 7 product lines, 3 banded spec groups, 21 developments, 5 key judgments, 12 curated relationships, 5 policy regimes (including a new `EO 14420 bulk-power system` regime and a state-siting entry), 10 decision makers with 7 company-published portraits, 77 sources at 47% first-party. Registered as `ipp`; registry synced; graph rebuilt (490 edges, 18 touching Apex)
- **The Apex storage finding:** every operating Apex battery (Great Kiskadee, Angelo Storage, Cameron — all Powin, now in liquidation) and the first post-Powin award went to Canadian Solar e-STORAGE (Coldwater, 75 MW/381 MWh); Raven Storage (100 MW) still has no named supplier. An open account with no incumbent, constrained by traditional tax equity and a stated FEOC due-diligence framework
- **v04.10r — 20 dossiers showed "profile has not been generated".** The developer's Arevon screenshot showed the header painted above that message, which meant the JSON had loaded and the renderer had crashed. Headless render of all 89 profiles through `ovPaintCompany` reproduced it: 20 threw `x.background.forEach is not a function` — the 2026-08-30 batch (all 8 pre-existing IPPs, 4 EPCs, 4 on-site-power suppliers, 4 supplier/integrators) stores `decisionMakers[].background` as a string; the loader's re-entrant `.then()` sent the exception into the missing-file `.catch`. Fixed in the renderer (Profiler.html v01.76w): `ovBackgroundList()` tolerates both shapes in the dossier and export loops; the cached-path render is try/caught and reports "loaded but failed to render — <error>". 89/89 render after; the 20 data files were deliberately left as-is because archived snapshots keep the string form forever

**Where we left off:**

- All three commits merged to main (`044ee50` dossier, `7b84362` renderer fix, plus the session-context reconstruction); working tree clean; Profiler v01.76w deploying via the auto-merge workflow
- The developer has not yet confirmed on the live site that the previously broken dossiers read well — the bullet split for prose-form backgrounds is heuristic

**Key decisions made:**

- **Fix the renderer, not the 20 files** — the Versions view renders archived snapshots that will carry the string form forever, so tolerance in `Profiler.html` is the only fix that covers every copy; the files can be normalized opportunistically on their next revision per the schema's rule
- **A render exception must never masquerade as a missing profile** — the message was true for a 404 and false for a crash; the next bad field now names itself
- **Apex categorized `ipp`, not `developer`** — in this registry `developer` means data-center developer; renewable developer/IPPs (Arevon, Terra-Gen, NextEra Energy Resources) are `ipp`
- **Ownership stored as a string** (the IPP-cohort convention) rather than the schema's object form, because the string carries the Ares/co-investor detail the object cannot
- **Four claims carried as unverified inside the Apex dossier rather than dropped:** the Powin docket motion against Apex affiliates (search summary only), the Plug Power PPA passing to NextEra (one local paper), the Ares minority-stake sale (Infralogic alone), and the CDO's unexplained absence from the leadership page

**Active context:**

- Repo **v04.10r** · Profiler **v01.76w** / **v01.32g** · Scraper **v01.71w** / **v01.98g** · Receipts **v01.36w** / **v01.29g**
- Capacity: repo CHANGELOG **90/100**; **Profiler page changelog 50/50 — the next Profiler page bump triggers archive rotation with SHA enrichment**
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- 89 profiles in the registry; Apex Clean Energy is the ninth IPP
- **Headless render recipe that works here:** `pip install playwright` (package only), launch with `executable_path=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`, serve `live-site-pages/` over `python3 -m http.server`, then `page.evaluate` calling `ovPaintCompany(host, profile)` per slug — auth wall irrelevant because the functions are global. Stop the server with `fuser -k <port>/tcp` (a `pkill -f` matches the shell's own command line and kills the session)
- **Editing trap hit this session:** typing a JS `\u0000` escape inside an Edit produced a literal NUL byte in `Profiler.html`; `grep` reporting "binary file matches" is the tell. Fix by byte-replacing `\x00` with the six-character escape

**Recommendation for next session:**

- Open two or three of the previously broken dossiers on the live site (Arevon, Terra-Gen, MasTec) and confirm the executive cards read well after v01.76w deploys; if the sentence split produced an odd bullet, tune the boundary rule in `ovBackgroundList` (currently splits on `. ` / `; ` before a capital, only after a lowercase letter, digit or closing bracket)

**To continue:** type `check the fixed dossiers render`

## Previous Sessions

### Session — 2026-09-01 (Scraper diagnostics, federal feeds, EO 14420 guidance module — v04.04r–v04.08r, reconstructed)
**Date:** 2026-09-01 08:03:04 PM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v04.08r

**What was done (v04.04r–v04.08r, reconstructed from CHANGELOG — Scraper diagnostics, federal feeds, an EO 14420 guidance module; no session context was saved):**

- Scraper's status strip split `tick 8h ago · 5 err/24h` into two tiles: a run tile that says `overdue` past the served `tickOverdueMin`, and a `BACKGROUND FAULTS · LAST 24H` tile that opens a panel listing each fault with **Copy all** and a manager-gated **Mark resolved & clear**. The count became exact via an hourly tally (`scDigestErrCount_`) instead of a `.slice(-5).length` ceiling, and the silent-throw path in `scSchedulerTick` now logs `tick.fatal` and rethrows (Scraper.html v01.69w, Scraper.gs v01.94g) (v04.04r)
- Fixed the fault tile vanishing right after that deploy — the new tally property did not exist yet, so `recentErrorCount` read 0 while five entries sat unreachable in the detail log; now `max(tally, in-window log length)` (Scraper.gs v01.95g) (v04.05r)
- Five primary federal feeds added to Scraper after live probes (White House Presidential Actions, Federal Register FERC + IRS, DOE Newsroom, EIA Today in Energy); ferc.gov (Cloudflare 403), the IRS newsroom (404) and EPA (empty 202) retired with rules-file entries; `topic-bps-security` + `topic-federal-action` seeds; EO 14420 bulk-power-system guidance module `eo14420-bulk-power-2026-08` authored from the primary text, with analysis markdown + archived source under `repository-information/industry-guidance/` (Scraper.gs v01.96g, Profiler.gs v01.32g) (v04.06r)
- "Why thin?" gained a per-source contribution table (`bySource`, `silentSources`) so a silent feed and a sub-threshold feed are distinguishable; the edition picker was rebuilt (grouped by edition, issue number first, weekday shown, edition filter, weekend builds shown as unnumbered) with `wdDgDate_` parsing through `Date.UTC` (Scraper.gs v01.97g, Scraper.html v01.70w) (v04.07r)
- "Why thin?" had never rendered once: its 25 s client deadline set `settled`, and the success handler discarded any later reply. The timer now shows a live elapsed count instead of giving up, transport aborts are explained with a retry hint, the subtitle shows desk vs round-trip time, and `scDigestScoreRows_` is bounded to the newest 8,000 intake rows (Scraper.html v01.71w, Scraper.gs v01.98g) (v04.08r)

**Where we left off:** All changes committed and merged to main

**Active context:**

- Repo **v04.08r** · HTML: Scraper **v01.71w**, Profiler **v01.75w** · GAS: Scraper **v01.98g**, Profiler **v01.32g**, Receipts **v01.29g**, MasterACL **v01.14g**
- Repo CHANGELOG at **88/100**
- TODO.md empty; REMINDERS.md has no active reminders
- Toggles: `START_OF_RESPONSE_BLOCK` On, `CHAT_BOOKENDS` Off, `TIMING_ESTIMATES` On, `END_OF_RESPONSE_BLOCK` On
- Open items carried forward: the daily ACL health Routine (`trig_01GeTqB8xp5nG8FCC139Bgr9`) has not yet been observed staying silent on a healthy day (v04.03r recommendation); v04.07r made "are the Federal Register feeds contributing?" answerable in-app but did not answer it

