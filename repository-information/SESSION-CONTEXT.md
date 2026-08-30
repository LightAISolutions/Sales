# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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


## Previous Sessions

### Session — 2026-08-30 (Morning Digest footer rework + reliability investigation, v03.84r–v03.86r)

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


Developed by: LightAISolutions
