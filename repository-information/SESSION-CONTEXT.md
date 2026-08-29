# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-29 03:45:02 PM EST
**Repo version:** v03.62r
**Branch:** `claude/profiler-dossier-summary-8obbjo`

**What we worked on (v03.52r–v03.62r — the Profiler quality build-out, all six approved recommendations now shipped):**

- **Summary tab + relationships (v01.44w–v01.45w):** renamed each dossier's Background tab to Summary; replaced the rejected "at a glance" cards with a Relationships section — typed cross-links derived from dossier data plus a radial SVG relationship map with clickable nodes. Settings cog (bottom right) with a Commands overlay documenting all Profiler commands
- **Compare view (v01.46w–v01.48w):** roster Compare mode (up to 4 companies), tiered rows — dossier meta and financials always; product/spec rows only within a shared peer group. Peer families: `OV_PEER_FAMILIES` treats supplier + integrator as one "Hardware" family (developer directive — keep grouping flexible as the industry shifts). Cross-space selections fall back to financials-only
- **Normalized KPIs, schema v4 (v01.47w–v01.49w, roadmap #2):** `periodType`/`periodEnd`/`kpi`/`usdMillions`/`fxBasis` overlay; comparable-revenue coverage now **42 of 88**. FX rates researched, never recalled (CNY 7.1873, TWD 31.171, KRW 1421.48, EUR 1.1306 — all 2025 annual averages). Five deliberate exclusions render "Not normalized yet": Oracle (guidance), Switch (no annual total), Crusoe + Lambda (third-party estimates), OpenAI (press-reported)
- **Source provenance (v01.50w, roadmap #4):** every source classified company / disclosure / independent; first-party share shown on the dossier header, in the Source List with per-source tags, and as a Compare Tier 0 row. Registry schema v2 added `companies[].domains` (all 88 curated); per-source `party` field overrides any verdict
- **Roster coverage (v01.51w, roadmap #5):** freshness dot (fresh ≤45d / aging ≤120d / stale — post-earnings cadence) with visible age, source count, first-party share, `$ comparable` tag per card; aggregate strip above the grid. New `scripts/sync-profiler-registry.py` reconciles the denormalized registry fields (`--check` reports drift); its use is now REQUIRED after any profile write (rule added to `.claude/rules/profiler-app.md` step 5 this push)
- **Notable bugs found & fixed:** `ovCmpLatestRevenue` picked revenue by array position but 22/88 dossiers are newest-first (Amazon would have shown FY2024); a token-matching provenance classifier was **discarded before shipping** after an 88-dossier audit (Black & Veatch 6%, Google 0% — replaced with declared domains); `ovFreshness` boundary flip from `Math.round` on datetime deltas
- Six ticker-field ownership-prose fixes; registry `lastUpdated` drift sync (both task cards)

**Where we left off:**

- All work committed, pushed, and auto-merged through **v03.62r** (this push carries the sync-requirement rule + this session context). Working tree clean
- **All six approved recommendations from the session-opening review are done except #3 — the `profiler report <topic>` command — which the developer explicitly wants as its own session with fresh context**
- Profiler page changelog sits at **50/50 — the next page bump rotates again** (2026-08-07's five sections move as one date group, SHA enrichment mandatory). Repo CHANGELOG at 98/100

**Key decisions made:**

- Compare is financials-first; deep rows only within a peer family. Supplier + integrator are one family; the structure is declarative so new families are one-line additions
- Provenance classification is data-driven (registry `domains`), never name-token heuristics — a wrong sourcing claim is worse than none
- First-party share is a **balance signal, not a quality score** — near-total company sourcing reads as under-corroborated by design
- No near-identical archive snapshots for batch data passes; FY2025-only KPI normalization; dossier-stated USD beats external FX conversion
- The roster renders from the registry alone — anything it displays gets denormalized into the registry and reconciled by the sync script, never fetched per-card

**Active context:**

- **Branch:** `claude/profiler-dossier-summary-8obbjo` · **Repo:** v03.62r · **Profiler:** `v01.51w` / GAS `v01.22g`
- Coverage: 88 dossiers · 2,058 cited sources · 42 comparable revenue · median 52% first-party · all freshness dots green (oldest 7d — tints differentiate as October earnings approach)
- ~30 armed post-earnings refresh triggers start firing late October; each fired session now inherits the sync-script requirement via the updated Profiler Command
- Test suites live in the session scratchpad and are NOT committed — the durable contracts are in `.claude/rules/` and `PROFILER-SCHEMA.md`
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**

- Design and build **`profiler report <topic>`** (roadmap #3, the last approved item) — the industry-report engine that was the point of the whole quality build-out. Everything it needs now exists: normalized KPIs for cross-company figures, provenance for citation confidence, relationships for ecosystem structure, peer families for scoping, and coverage metadata for honesty about gaps. Start with a design pass (report types — macro, competitive, risk, opportunity; output format; how reports cite dossier sources per the "Reports" rule in profiler-app.md's Recall design) and get developer approval before building.

**To continue:** type `design profiler report`

## Previous Sessions

### Session — 2026-08-29 (Scraper scoring & scheduler fixes, v03.25r–v03.51r)

**Date:** 2026-08-29 01:34:01 AM EST
**Repo version:** v03.51r
**Branch:** `claude/scraper-subscriber-edition-match-6dwyjt`

**What we worked on (v03.25r–v03.51r — Scraper polish, then a run of scoring and scheduler fixes):**

- **Emailed digest, mobile.** Rebuilt the layout phone-first: the `@media (max-width:600px)` block was being stripped wholesale by Gmail (it drops the whole `<style>` element when it contains unsupported code, and the shell carries MSO conditional comments), so the email fell back to inline *desktop* sizes. Inverted it — inline styles now carry the phone sizes and a `min-width:601px` block enlarges for desktop, so a stripped block leaves a phone-shaped email. Settled on 27/22/18/15 after two rounds (24/20/16/14 was a step too small)
- **Summary/analysis presentation.** Analysis runs inline in amber with an "Amber = analysis" footer key; figures in reported text are green (`#4ade80`), figures inside an analysis stay amber via `inherit`
- **Held-back stories** now carry their summary and analysis into View More, and `scDigestSummarizeSet_` summarizes the *relevant* set rather than an unfiltered top-30 (section caps summed to exactly 30, so on a heavy day everything held back was unsummarized)
- **Same-day editions**: tried keeping both builds (v03.42r), developer preferred replacement, reverted (v03.43r). The per-edition delivery grouping from that experiment was deliberately kept as defence in depth
- **Scoring fixes**: backstop rotation was advancing on every run so a rebuild queried a *different* 12 companies (and editions ate each other's rotation); consumer gear reaching the digest; duplicate Google News stories; Google News weighted down 0.85 → 0.70
- **Scheduler**: the weekday guard was missing from the sender itself, so Saturday-built editions would have mailed at 07:00; and the 06:00 build skipped any edition already built that day, including by hand — so a manual test build would have been the thing that shipped
- **Diagnostics added**: `digestScoreReport` + a "Why thin?" button, and the Calendar now separates emailed from merely built

**Where we left off:**

- All work committed and pushed; branch merged to `main` by the auto-merge workflow each time. Working tree clean at v03.51r
- **Nothing is broken and nothing is half-finished.** The last push (v03.51r) closed the scheduler request completely
- **The open item is empirical, not code**: Monday 2026-08-31 is the first real run of the full schedule — 06:00 build with the 72-hour window, 07:00 send, replacing whatever the day already holds. Nobody has watched that path execute end to end
- The developer has weekend test editions sitting in the sheet. They are harmless (delivery only considers rows dated today, and the weekend guard refuses the day outright) and the Calendar now draws them hollow

**Key decisions made:**

- **7:00 AM ET, not PT.** The developer wrote "7am PST"; the app has always been ET. Asked rather than guessed — they confirmed ET. `SCRAPER_DIGEST_TZ` + `SCRAPER_DIGEST_TZ_LABEL` were centralised so the switch is two lines if that ever changes
- **One edition per day, replacement not accumulation.** Tried the alternative for one version and reverted at the developer's request
- **Guards belong where the action happens, not in the callers.** The weekday rule now lives in `scDigestDeliverPending_` — the only code that can put an edition in an inbox — because three callers each remembering the same rule is how one of them forgot
- **Verify against the developer's real input, not a synthetic one.** The Jackery fix was measured on their actual headline (81 → 0); the mobile sizes were measured in a browser at 390px with and without the `<style>` block
- **A changed seed's `tv` must be bumped or the change never ships.** Learned the hard way — v03.48r shipped new segment vocabulary that could not reach the app. Now guarded by `t22.js` *and* a blocking section in `.claude/rules/scraper-sources.md`, because the test corpus is not committed and cannot protect a future session
- **`scEditionWindowH_` still honours an explicit per-edition `windowH` ahead of the Monday-72h rule.** That is a setting, not a bug — pinned by test and flagged to the developer rather than quietly overridden

**Active context:**

- **Branch:** `claude/scraper-subscriber-edition-match-6dwyjt` · **Repo:** v03.51r · **Scraper:** `v01.83g` / `v01.66w`
- **Schedule as it now stands:** build 06:00 ET, send 07:00 ET, Mon–Fri. Monday scans 72h, Tue–Fri 24h. The 06:00 build replaces the day's existing edition; delivery holds an edition whose build is still in flight
- **Test corpus lives in `/tmp/sc/` and is NOT committed** — 24 suites, 639 assertions (`t.js`, `t2.js`…`t24.js`). It will be gone in a fresh session. Anything that must survive belongs in `.claude/rules/`, which is why the seed-`tv` rule was written there
- **Changelog capacity is tight**: repo `98/100`, `Scrapergs` `49/50`, `Scraperhtml` `39/50`. **The next push must rotate the repo CHANGELOG, and the GAS one is one push behind it.** Both rotations need SHA enrichment; the GAS/page ones resolve their SHA through the repo version each header carries as a cross-reference, since a `g`/`w` version never appears alone in a commit subject
- **Three editions**: `morning` (to jonyang92@gmail.com), `bess` and `aidc` (to jymiasole01@gmail.com). 88 companies, ~14 topics, 12–17 segments filtered depending on edition
- Relevance bar is 55. Recent BESS builds land 13–16 relevant of 84–99 scanned, which the developer called close to the sweet spot

**Recommendation for next session:**

- Ask the developer how Monday 2026-08-31's 06:00 scheduled run went — whether it replaced the day's edition, whether the 72-hour window produced a comparable article count to a weekday, and whether all three editions arrived at 07:00. That is the first unattended execution of the whole schedule and the only thing in the system that has never been observed working; if it did run clean, the Scraper is feature-complete for now and the next session is free for new work.

**To continue:** type `check how Monday's scheduled run went`

Developed by: LightAISolutions
