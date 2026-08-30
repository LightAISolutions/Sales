# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-30 06:35:39 PM EST
**Repo version:** v03.86r
**Branch:** `claude/morning-digests-footer-38e7we`

**What we worked on (v03.84r–v03.86r — Morning Digest footer, then a full reliability investigation):**

- **v03.84r (GAS v01.84g, page v01.67w):** digest footer reworked — byline, `Amber = Analysis by <Brand>` via the new `scAiBrand_()` (maps `gemini/…` → `Gemini`, `claude/…` → `Claude`, unknown providers title-cased, fallback runs → `''`; the model *version* is deliberately dropped). The `summarized by <provider/model>` credit removed. Coverage telemetry (shown / held-back) taken out of the reader-facing footer and moved to the News Stand: `Digests` tab gained denormalised `Shown` + `Held Back` columns (15–16), `listDigests` widened its tail read 6→8 and returns them as `null` (not `0`) for pre-existing rows, `wdLandingShowEdition_` prints the full line for the open issue plus the exact `provider/model` label, card tooltips carry the same
- **v03.85r (GAS v01.85g):** restored `<relevant> relevant of <intake> scanned` to the footer using `d.counts.relevant` — the **whole** relevant set including held-back items, which is what keeps it consistent with the `View More (N)` link rather than in tension with it. Byline → `Developed by Jon Yang`. Triggered the GAS changelog's archive rotation (19 sections dated 2026-08-27 moved with SHA enrichment; active file 50/50 → 32/50)
- **v03.86r (GAS v01.86g):** footer split into a two-cell email `<table>` — left `Amber = Analysis by Gemini · 15 relevant of 104 scanned` (+ any AI fallback note), right `Developed by Jon Yang` (`white-space:nowrap`, 14px gutter), `View More (N)` on its own full-width row. Built with HTML `align` attributes, **not** CSS columns: the previous two-column footer had been replaced by a stacked block because it needed a media query and Gmail drops the whole `<style>` element when it dislikes any part of it — a table needs no query at any width. Left run is a joined array (`footLeft`), fixing a latent dangling-`·` bug on a no-analysis edition. Verified with Playwright at 640px and 390px across four content states
- **Then: a full root-cause investigation** of the developer's testing failures (multiple "Digest build failed", and a built edition with 2 of 3 articles unsummarized). **No code was written for the fixes — the session ended at an approved plan.**

**Where we left off:**

- Everything through v03.86r is committed, merged to `main`, and live. Working tree clean, nothing pending
- **The approved Phase 1 reliability build has NOT been started.** That is the entire job for the next session — the full spec is below

**Diagnosis behind the plan (do not re-derive — this was traced through the code):**

1. **2-of-3 unsummarized — confirmed root cause.** `scDigestSummarizeStep_` (~`Scraper.gs:4119`): when a batch's AI reply won't parse (`ai_bad_json` / `ai_truncated` / `ai_empty_response` / `ai_blocked_*`), the soft-fail path writes each item's **raw feed snippet** into the summary column. `pending` is then recomputed as "items with no summary", so those items now *have* one and are **permanently excluded** from every later batch, step and continuation. No re-queue exists. The observed edition (lead had full summary + amber analysis, two section items were verbatim RSS boilerplate) matches exactly: the one summarize batch soft-failed, and the *separate* lead call succeeded afterward
2. **"no reply after 90s"** is the browser's own watchdog (`Scraper.html:2974`), not a server failure. `SCRAPER_AI_RETRY_BACKOFF_MS = [2000,6000,15000,30000]` sleeps up to **53s inside one `scAiWithRetry_` call**, and the 40s step budget is only tested at the *top* of the while loop — so a batch entering at t=39s can return at t≈95s. Affects manual "Run intake now" only; scheduled runs have no browser
3. **"http_404"** — transport-level, `if (!r.ok) throw new Error('http_' + r.status)`. Likeliest cause is the self-update webhook swapping the deployment version mid-request. **This is an inference, not proven** — nothing logs deploy timestamps against failures (Phase 2 item 8 fixes that)
4. **The scheduled path's real bug** — in `scDigestMorningRun`, `try { info = scDigestStep_(...) } catch (stepErr) { break; }` breaks the inner loop with `finished=false`; `more` is only set when the *budget* is exhausted, so a **throw creates no continuation trigger at all**, and the error is swallowed with no log. Recovery falls to the hourly tick — but `scDigestScheduledTick_` returns early when `clock.hour < SCRAPER_DIGEST_RUN_HOUR` (**7**) while the build hour is **6**, so a 06:00 failure has *no* recovery path until 07:00
5. **Delivery has no completeness gate** — `scDigestDeliverPending_` mails any row dated today with an empty Delivered cell, including a full `ai_unavailable` fallback edition
6. **Delivery gives up at midnight** — every candidate check is `if (scIssueDateKey_(meta[i][1]) !== clock.date) continue;`
7. **All subscribers are in `to:`** — `scEditionRecipients_(ss, edId).join(',')` exposes every subscriber's address to every other subscriber

**Verified platform facts (do not re-research):**

- Apps Script: **6 min / execution**; **triggers total runtime 90 min/day (consumer)**, 6 h (Workspace); **20 triggers / user / script**; **email recipients/day 100 (consumer)**, 1,500 (Workspace)
- Email quota counts **recipients, not messages** — one email to 150 addresses costs 150. Bcc addresses count too
- The recipient quota is **per user across all scripts** — all 7 GAS projects in this repo share one bucket (evidence: the quota table writes triggers as "20 / user / script" but email as plain "100/day")
- `ClockTriggerBuilder.after()` is a **minimum** duration; ~1 min is the practical floor for a fresh execution
- Workspace is **not free** (~$7–8.40/user/mo Business Starter, no free tier, needs a domain), and trial accounts get *reduced* limits that rise only after **$100 cumulative spend + up to 75 days**
- Resend free tier: **3,000 emails/month** (~45 subscribers × 3 editions × 22 weekdays)

**Developer's timezone + deadline model (drives the retry ladder):**

| Mark | Eastern | Pacific | Runway from 06:00 ET build |
|---|---|---|---|
| Courtesy send | 07:00 ET | 04:00 PT | 60 min |
| Real soft deadline | 09:00 ET | 06:00 PT | 180 min |
| **Hard limit** | **12:00 ET** | **09:00 PT** | **360 min** |

Developer is in San Jose (Pacific). 07:00 ET is a *courtesy* target for future East Coast subscribers, not the deadline. **A missed delivery time is acceptable; a permanently-missing or degraded edition is not.**

**APPROVED PHASE 1 — build this, as one commit:**

1. **Re-queue soft-failed batches.** Track per-item AI attempts in state; a soft-failed batch returns to `pending` for the next step instead of being written off. Write the snippet only after a per-item attempt ceiling **and** the edition is out of repair time
2. **Completeness verdict + delivery gate.** Render computes `complete` (every summarize-set item has a real AI summary; lead has text + analysis) into a new `Complete` column. `scDigestDeliverPending_` **holds** an incomplete edition instead of mailing it. Ship only with item 3 — the ceiling is what makes the gate safe
3. **Repair pass.** A rendered-but-incomplete edition re-enters summarize on the hourly tick, re-attempts only the snippet-only items, re-renders, mails as soon as it is whole. At the hard stop, ship best-available with an honest footer note, or email a failure alert if nothing rendered — late is fine, silent is not
4. **Escalating-backoff retry ladder** (replaces the fixed-interval idea; a fixed interval is the wrong shape for a 6-hour window, and 5-min-for-6h would be 72 executions against the 90 min/day budget):
   - **Tier 1** — immediate, same execution: 3 attempts, ~2s/5s pauses (free, no new trigger)
   - **Tier 2** — continuations at **+5, +10, +20, +30, +60, +60, +60 min** → from a 06:00 ET failure: 06:05, 06:15, 06:35 (all before the courtesy send), 07:05, 08:05 (before the soft deadline), 09:05, 10:05. **7 continuations, ~21 step attempts across 6 hours**
   - **Tier 3** — hourly tick carries it to the hard stop
   - **Hard stop 12:00 ET / 09:00 PT** → best-available + alert
   - Classify errors first: terminal faults (missing key, revoked auth, daily quota gone) skip to back-off + alert rather than burning retries. Precedent already in this file — the legacy Schedules pipeline has a consecutive-failure counter for exactly this reason
5. **`SCRAPER_DIGEST_RUN_HOUR` → `SCRAPER_DIGEST_BUILD_HOUR`** so the hourly tick can assist during the 06:00 hour
6. **`SCRAPER_DIGEST_ITEMS_PER_AI_CALL` 5 → 3** — smaller batches truncate less, and a soft-fail costs fewer items
7. **`to:` `jonyang92@gmail.com` + `lightaisolution@gmail.com`, `bcc:` everyone else** in `scDigestDeliverPending_`. Fixes the privacy leak at zero quota cost
8. **Hidden 15-subscriber alert.** In the hourly `scSchedulerTick` after the Interests sync: when active subscribers reach `SCRAPER_SUBS_MILESTONE` (15) and Script Property `SUBS_MILESTONE_15_SENT` is unset, email `jonyang92@gmail.com` about the 100/day ceiling, the ×3 editions multiplier and the transactional-provider option, then set the property so it can never fire twice. **No UI surface.** Keep the threshold and the address **out of the public GAS/page changelogs** (they deploy to the live site) — repo CHANGELOG only

**Phase 2 (approved in principle, not scheduled):** (5) cap `scAiWithRetry_` sleep against the step's remaining budget + client resumes `stepLoop` instead of declaring failure; (6) delivery candidates widen from "dated today" to "dated within N days and undelivered" + a `getRemainingDailyQuota()` pre-check (currently **zero** occurrences in the project); (7) log every swallowed `catch` in the scheduled path + a "last scheduled run" health line; (8) record deploy-webhook timestamps to make the 404 diagnosable.

**Key decisions made:**

- **Completeness beats punctuality** — an edition must never be mailed degraded before the repair ceiling, but must always eventually be mailed
- **Escalating backoff over fixed interval** — the developer proposed 5×5 then 10×5; both were built on the assumption that the deadline was 07:00. Once the real hard limit (09:00 PT) was established, escalating backoff gives more coverage at ~1/10th the trigger-runtime cost
- **Everything stays functionally free — standing developer preference.** No Google Workspace for the foreseeable future. Transactional provider (Resend free tier) is the scaling path when subscribers make it worthwhile; the item-8 alert is the trigger for that conversation
- **Subscriber cap ~20** while subscribers can take all three editions (60/day of the 100, leaving headroom for retries, manual tests, the held-back rollup and the other six GAS projects)
- Footer coverage figures use the **whole** relevant set, not the shown set — reach, never withholding
- Keep `SCRAPER_DIGEST_BUILD_HOUR` at 6 — building earlier trades overnight news coverage for runway the backoff ladder already provides

**Active context:**

- **Branch:** `claude/morning-digests-footer-38e7we` · **Repo:** v03.86r · **Scraper:** page v01.67w / GAS v01.86g
- Capacity: repo CHANGELOG **96/100** (rotation due soon), Scraper GAS changelog 33/50, Scraper page changelog 40/50
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On
- Inherited watch item: **Monday 2026-08-31's 06:00 ET scheduled run** is the first real end-to-end execution of the build/send schedule. Phase 1 should land before it if possible
- Open question for the developer, does not block the build: none — the Workspace question is settled (no), the cap is settled (~20), the ladder is settled

**Recommendation for next session:**

- **Build approved Phase 1 as one commit** — the eight items above, in that order, bumping GAS version + `Scrapergs.version.txt`, adding GAS + repo changelog entries (keep item 8's threshold and email address out of the public GAS changelog), then push to a fresh `claude/*` branch. Everything needed is specified above; no re-investigation is required.

**To continue:** type `build approved Phase 1`


## Previous Sessions

### Session — 2026-08-29 (Industry Guidance revision notes + reading-progress sync, v03.83r)


**Date:** 2026-08-29 10:54:00 PM EST
**Repo version:** v03.83r
**Branch:** `claude/industry-guidance-cleanup-9jsnzi`

**What we worked on (v03.83r — the two remaining guidance improvements, one pass):**

- **#5 Per-module revision notes (page v01.68w):** all six guidance modules in `Profiler.gs` carry a `revisions: [{date, note}]` meta field, seeded with the 2026-08-29 scrub/generalization as each module's first entry; `guidanceIndex_()` emits a `revised` date (latest entry); the page renders a "Revision notes" block under the module header (newest first) and a `↻ revised` chip on library cards
- **#4 Server-side reading-progress sync (GAS v01.27g):** new role-gated `gop=progress` / `gop=setprogress` ops in `handleGuidanceOp_` store each account's section ticks in one Script Property (`gd_progress:<email>`), doc/section ids validated against registered modules, writes under a script lock; the page prefers the server map once a sync succeeds, keeps localStorage as the offline fallback, migrates local-only ticks up in one batch on first sync, and repaints the open module when a sync lands (done buttons now carry `data-sec` for the repaint)
- **Data-loss guard (found via `verify-profiler-roles.py`'s isolation test):** a sync response without a real `progress` object counts as "sync unavailable" — never as an empty server map — and a failed migration aborts adoption, so a legacy backend or network failure can never wipe local ticks
- **Deploy verified end-to-end:** commit merged to main, `op=deploy` probe returned "Already up to date (v01.27g)" (webhook had already fired), Pages serving `|v01.68w|` / `|v01.27g|`
- Profiler diagram's guidance bullet updated to the real op set + role gate; README tree/timestamp synced

**Where we left off:**

- **All six module-audit improvements are now delivered** (#1 lens, #2 freshness, #3 cross-links, #4 progress sync, #5 revision notes, #6 search/glossary) — the Industry Guidance improvement thread is closed
- Everything committed, merged, and live; working tree clean
- One manual check remains (needs two real signed-in accounts, no probe can do it): tick a section on one device, confirm it appears on another device on the same account — existing local ticks migrate up on each account's first sign-in after the deploy

**Key decisions made:**

- **Progress storage medium (decided before coding, per prior session's instruction):** Script Properties, one property per account — tiny per-user blobs, no cross-project consumers, no spreadsheet round-trip per tick; the Master ACL spreadsheet pattern stays reserved for cross-app access control
- **Sync trust rule:** the server map is authoritative only after a response carrying a real `progress` object; localStorage is mirrored down post-sync (including removals) and stays the offline source until then
- Revision notes are meta, not content — adding them bumped versions but did not add a new `revisions` entry to the modules themselves

**Active context:**

- **Branch:** `claude/industry-guidance-cleanup-9jsnzi` · **Repo:** v03.83r · **Profiler:** v01.68w / GAS v01.27g
- **Profiler page changelog is FULL at 50/50 — the next page version bump exceeds capacity and triggers its archive rotation (SHA enrichment mandatory)**; repo CHANGELOG 93/100; GAS changelog 27/50
- Inherited watch item (automated, verify after it fires): Monday 2026-08-31's scheduled Scraper digest run is the first real end-to-end execution of the 06:00 ET build / 07:00 ET send schedule
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**

- **Check how Monday 2026-08-31's scheduled Scraper digest run went** — the first real end-to-end execution of the 06:00 ET build / 07:00 ET send schedule: verify it built from the 72-hour window, replaced the day's edition, and actually mailed. (The guidance thread is fully delivered — nothing is deferred there; the only guidance follow-up is the manual two-device tick check noted above, which needs the developer's own accounts.)

**To continue:** type `check how Monday's scheduled Scraper run went`

Developed by: LightAISolutions
