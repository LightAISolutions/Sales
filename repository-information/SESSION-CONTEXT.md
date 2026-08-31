# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-30 09:14:53 PM EST
**Repo version:** v03.90r
**Branch:** `claude/bess-aidc-market-research-f6jznm`

**What we worked on (strategic analysis → Phases 0–3 built and verified, v03.89r–v03.90r):**

- **Strategic gap analysis** of Profiler + Scraper against the developer's stated big-picture goal (mastering the US BESS/AIDC market for a sales/BD career; Profiler = reliable 1st-party skeleton, Scraper = "fresh blood" 3rd-party trade news finding the diamonds companies won't disclose; future **Classroom** app to teach the developer + team from the accumulated corpus). Two Explore agents read all ~45k lines; produced 7 strategic gaps and a **7-phase action plan (Phases 0–6)** — full analysis and both agents' findings are in this session's transcript; the plan summary: P0 hygiene · P1 wire the bridge · P2 stop corpus data loss · P3 diamond pipeline · P4 schema v7 depth · P5 unify the learning layer (study.json v2 on the guidance engine + concepts registry) · P6 Classroom design gate
- **v03.89r — approved Phases 0–3, one commit:** (P0) schema-doc drift fixed (`ipp` category, `legalName`+`hq` identity variant documented, `recentDevelopments.category` canonical enum expanded 8→17 with case-insensitive consumption + opportunistic normalization), stale "Planned" `profiler report` commands entry removed, `searchArchive`/`sourceStats` bounded to newest-8000-row column-scoped reads, ClickLog capped at 20k; (P1) rubric returns company **slugs** (`mcs`) + article key (`ak`) in intake Signals JSON (safe field-drop serializer `scSignalsJson_` replaces the raw 1200-char slice), slug-aware deduped `scTimelineScan_`/`companyTimeline`, **token-gated `?action=corpus` route** in Scraper (`cop=timeline|candidates`, `CORPUS_TOKEN` Script Property, flat refusal while unset), `handleNewsOp_` session-validated proxy in Profiler.gs (server→server with the shared token), **Coverage 📰 dossier overlay** in Profiler.html (split at dossier `lastUpdated`, event chips, figures, desk reads, candidates list); (P2) Drive cold-store (`scColdStoreRows_` → "Scraper Archive" folder) before Digests/DigestIntake retention trims — failed Drive write SKIPS the trim; sub-floor covered-company items kept as corpus-only `Section='archive'` rows excluded from digest flow via `scDigestItems_`; archive search haystack now includes summary + analysis; (P3) summarize call additionally returns `event` (closed 10-value enum `SCRAPER_EVENT_TYPES`) + up to 6 verbatim `figs` merged into Signals JSON, **EdgeCandidates tab** mined post-render (covered-company pairs per article, deduped, ≤25/run), daily `scReconcileEdgeCandidates_` marks pending → `covered` against published profiler-graph.json / `expired` after 60d, **"News Triage — Scraper Corpus Bridge"** section added to `.claude/rules/profiler-app.md` and wired into the scheduled-refresh convention. Versions: Scraper GAS v01.89g, Profiler GAS v01.28g, Profiler page v01.69w. All three affected diagrams synced with regenerated + verified pako URLs
- **Bridge verified live:** developer set `CORPUS_TOKEN` in both projects; session probes confirmed both deploys (v01.89g / v01.28g), token gating (wrong/missing token → flat `denied`), session gating (`SESSION_EXPIRED`); developer screenshots confirmed Tesla/CATL/NVIDIA Coverage panels rendering with stored items, splits, and desk reads
- **v03.90r (page v01.70w):** roster search narrowed to company **names only** (`name + slug`, tagline dropped from the haystack) — predicate verified against the live registry ("nvidia" → 1 card, was 7); developer confirmed working
- Housekeeping: Profiler page changelog hit its 50-cap → rotated the six 2026-08-10 sections to its archive with SHA enrichment (now 46/50)

**Where we left off:**

- Phases 0–3 fully built, deployed, probe- and screenshot-verified. Working tree clean, everything merged to `main`
- **The developer wants Phase 4 built in a fresh session** — that is the entire next job. Phase 4 spec (from the approved plan): **schema v7** — (a) `policyExposure[]` on profiles (`{regime, status, effectiveDate, exposure, mitigation, source}` — regimes like §154/FEOC/ITC-45X/301/AD-CVD; raw material already in 35 dossiers' prose, the bankability guidance module, and the §154 risk report); (b) BESS/AIDC-native KPI keys added to the normalized-KPI vocabulary (`gwh-shipped`, `backlog-gwh`, `mw-energized`, `mw-contracted`); (c) optional relationship `via` (product line) + `project` fields plus a lightweight named-projects registry (Stargate, Colossus, Homer City as first-class entities); (d) expand `OV_PEER_FAMILIES` in Profiler.html beyond the single `hardware` family (colocation, EPC/GC, developer/IPP). Order: PROFILER-SCHEMA.md first (single source of truth), then renderer + check scripts, then backfill rides post-earnings refreshes opportunistically — no mass migration (the proven v3/v4 pattern). Phases 5–6 remain unbuilt and unscheduled

**Key decisions made:**

- Diamond-loop closes **without any write-back channel**: refresh sessions promote candidates into dossier `relationships[]`, the graph rebuild publishes, Scraper's daily reconcile observes it and marks the candidate `covered`
- `CORPUS_TOKEN` lives ONLY in both projects' Script Properties and Routine prompts — never in repo files, never typed into chat (prompts land verbatim in the repo CHANGELOG)
- Cold-store failure skips the retention trim (preserving rows beats tidying the tab); sub-25 covered-company items are kept because the sub-floor band is where quiet single-source leaks live
- Enum/identity normalization is opportunistic-on-revision only — no 88-profile data pass (would force 88 archival snapshots for cosmetics)
- Roster search = names only; slug stays in the haystack as the hyphenated name form
- Retired Scraper pipeline code (~2,500 lines) and the unreachable suggest-note path stay in place per Chesterton's Fence — open decisions

**Active context:**

- **Branch:** `claude/bess-aidc-market-research-f6jznm` · **Repo:** v03.90r · **Profiler:** page v01.70w / GAS v01.28g · **Scraper:** page v01.68w / GAS v01.89g — all live
- Capacity: **repo CHANGELOG 100/100 — the NEXT push exceeds the cap: archive rotation with mandatory SHA enrichment MUST run in that push commit** (likely the Phase 4 session's push); Profiler page changelog 46/50; Scraper GAS 36/50; Profiler GAS 28/50
- Watch item: **Monday 2026-08-31 06:00 ET scheduled Scraper run** — now the first unattended exercise of BOTH the v03.87r–88r reliability machinery AND the new corpus path (event/figure capture, candidate mining, corpus-only rows, cold-store hooks). Fastest read: the "Last scheduled run" tile + `goLiveStatus` `recentErrors`, then the first EdgeCandidates rows and a Coverage panel for event chips
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**

- **Build Phase 4 (schema v7 depth)** per the spec in "Where we left off": `policyExposure[]`, BESS/AIDC-native KPI keys, relationship `via`/`project` + named-projects registry, expanded peer families — schema doc first, then renderer + check scripts, opportunistic backfill. Heads-up for that session: its push commit must also run the repo CHANGELOG archive rotation (file is at 100/100)
- **To continue:** type `build phase 4`

## Previous Sessions

### Session — 2026-08-30 (Scraper reliability Phases 1–2 delivered, v03.87r–v03.88r)

**Date:** 2026-08-30 07:26:24 PM EST
**Repo version:** v03.88r
**Branch:** `claude/morning-digests-footer-phase-1-ivjdg5`

**What we worked on (v03.87r–v03.88r — BOTH approved reliability phases built, deployed, and probe-confirmed live):**

- **v03.87r (GAS v01.87g) — Phase 1, all 8 items:** (1) soft-failed AI batches **re-queue** via per-item attempts in run state (`state.aiAttempts`, ceiling 3/pass) — no snippet is ever written as a summary before the hard stop, killing the write-off that permanently excluded items (root cause of the 2-of-3-unsummarized edition); an item skipped inside an otherwise-parsed reply re-queues too; (2) render writes a **`Complete` verdict** (Digests col 17: `yes`/`no`/`best-available`) and `scDigestDeliverPending_` HOLDS `no` rows; (3) **repair pass** (`scDigestRepairPass_`) reopens incomplete undelivered editions (re-attempts only empty-summary items; lead only if deficient), and at the **12:00 ET hard stop** (`SCRAPER_DIGEST_HARD_STOP_HOUR`) `scDigestFinalizeBestAvailable_` writes snippets, re-renders with the honest footer note and ships — plus a once-per-day alert if a due edition never rendered; (4) **retry ladder** — Tier 1: 3 in-execution attempts (`scDigestStepWithRetry_`), Tier 2: continuations at +5/+10/+20/+30/+60/+60/+60 min (monotonic per-day index, `scDigestLadderNext_`), Tier 3: hourly tick; terminal AI faults (`scAiTerminal_`) skip rungs → one alert/day; (5) tick + `scEditionDue_` gate on `SCRAPER_DIGEST_BUILD_HOUR` (6), `SCRAPER_DIGEST_RUN_HOUR` removed; (6) `SCRAPER_DIGEST_ITEMS_PER_AI_CALL` 5→3; (7) delivery `to:` = the two developer addresses (`SCRAPER_DIGEST_TO_ADDRS`), everyone else `bcc:`; (8) hidden 15-subscriber milestone alert (`scSubsMilestoneCheck_`, property `SUBS_MILESTONE_15_SENT`, no UI). Scraper sequence diagram synced + pako URL regenerated
- **v03.88r (GAS v01.88g, page v01.68w) — Phase 2, all 4 items:** (5) `scAiWithRetry_` takes `deadlineMs` and rethrows instead of sleeping past the 40s step budget (the real mechanism behind "no reply after 90s"), and the client `stepLoop` **resumes** on transport errors (90s watchdog, `http_404`/`429`/`5xx`, failed fetch — max 3 consecutive, 5s/10s/15s pauses) instead of declaring failure; (6) delivery window widened to `SCRAPER_DIGEST_DELIVER_WINDOW_DAYS` (3) days of built-but-unsent editions (grouped per edition per day, holds keyed to the row's own date, subject dated by the edition's day) + `MailApp.getRemainingDailyQuota()` pre-check that holds + alerts when the allowance can't cover an edition; (7) `scDigestLogErr_` ring buffer (cap 20) wired into every meaningful swallowed catch in the scheduled path (incl. per-row send failures and the continuation-trigger create), `scDigestNoteRun_` stamps `DIGEST_LAST_RUN`, and the app's status strip gained a **"Last scheduled run"** tile (kind + age + 24h error count); (8) `scRecordDeploy_` timestamps every deploy (webhook + GET routes, `// PROJECT:` marked, never gating the pull) and `goLiveStatus` serves `lastRun`/`recentErrors`/`recentDeploys`
- **Deploys verified by probe** (`?action=api&op=deploy` via curl): answered `Already up to date (v01.87g)` after Phase 1 and `Already up to date (v01.88g)` after Phase 2 — the webhook fired both times
- Playwright smoke on `Scraper.html`: zero page errors (only the documented expected `file://`/sandbox console noise)

**Where we left off:**

- **The entire reliability backlog from the investigation session is delivered** — Phase 1 items 1–8 and Phase 2 items 5–8. Nothing approved remains unbuilt
- Everything committed, merged to `main`, deployed, and probe-confirmed; working tree clean

**Key decisions made:**

- Snippets are written as summaries in exactly ONE place — the hard-stop finalizer; before that, an unsummarized item's cell stays empty so repair knows what to re-attempt and the sheet stays honest (the rendered HTML still shows the snippet as a display fallback)
- Hard stop = 12:00 ET / 09:00 PT; completeness beats punctuality until then, delivery beats completeness after
- Ladder index is monotonic per day (max 7 Tier-2 continuations/day) — interleaved failures can never multiply trigger spend
- Delivery looks back 3 days (spans a weekend); an older row's completeness hold is waived — its repair day is over
- Quota gate holds rather than half-sends, so the remaining allowance is never burned on a partial roster
- Item 8's threshold + alert address, and the `to:` addresses, stay out of the public GAS changelog (they are in code + repo CHANGELOG only)

**Active context:**

- **Branch:** `claude/morning-digests-footer-phase-1-ivjdg5` · **Repo:** v03.88r · **Scraper:** page v01.68w / GAS v01.88g (both live)
- Capacity: **repo CHANGELOG 98/100 — archive rotation (SHA enrichment mandatory) will trigger within ~2 pushes**; Scraper GAS changelog 35/50; Scraper page changelog 41/50
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On
- Watch item: **Monday 2026-08-31's 06:00 ET scheduled run** — first real end-to-end execution, now exercising both phases unattended (ladder, completeness gate, repair, bcc delivery, quota check). The new "Last scheduled run" tile and `goLiveStatus` diagnostics (`lastRun`, `recentErrors`, `recentDeploys`) are the fastest read on how it went

**Recommendation for next session:**

- **Check how Monday 2026-08-31's scheduled run went end-to-end**: edition built from the 72-hour window, `Complete` = `yes` in the Digests tab (or a visible repair trail in the error log if not), delivered at 07:00 ET with subscribers in `bcc:`, and the health tile green. If anything failed, the new diagnostics name where — start from `goLiveStatus`'s `recentErrors` and `DIGEST_LAST_RUN`

**To continue:** type `check how Monday's scheduled Scraper run went`

Developed by: LightAISolutions
