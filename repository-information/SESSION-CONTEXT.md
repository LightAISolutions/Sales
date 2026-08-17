# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-17 03:59:21 AM EST
**Repo version:** v02.62r
**Branch:** `claude/receipts-signin-denials-f5893i`

**What we worked on — a four-stage diagnosis of a total Receipts sign-in outage (v02.54r → v02.62r):**

The developer and Mandy were both denied sign-in with `Access denied … (code: not_authorized)`. Two users failing *simultaneously* was the load-bearing clue: a per-user data problem cannot do that, so the fault had to be in something shared.

**The real root cause, confirmed only at v02.59r:** the Receipts script had a **partial OAuth grant**. `spreadsheets` and `script.scriptapp` were declared in `appsscript.json` but had **never been approved** — almost certainly a granular-consent screen (`enable_granular_consent=true`) where boxes were left unticked. Without `spreadsheets`, `SpreadsheetApp.openById` threw on the Master ACL, so the app could not read the access list at all and denied **every** user at once.

**Why it took four rounds to find:** three separate things each hid it.
1. `checkSpreadsheetAccess` wrapped the whole ACL read in a silent `try/catch`, and the sharing-list fallback below it is gated on `!hasAcl` — so any exception fell through to a *cached* denial, indistinguishable from "not on the list"
2. Apps Script prompts for consent only when the **declared scope set changes**, never on a failure — so opening the manifest, confirming it looked right, and re-running were both guaranteed no-ops
3. A separate Google **multi-account routing** problem blocked the Apps Script editor entirely for a while (the projects are owned by `lightaisolution@gmail.com`, not the personal Gmail)

**A second, unrelated fault surfaced along the way:** `Scraper` and `MasterACL` were missing `script.scriptapp` from their **declarations** — the mirror image of Receipts' problem, needing the opposite repair. Traced to **v01.82r**, which added that scope to the manifest *template* only; live manifests are not version-controlled and `pullAndDeployFromGitHub()` preserves them, so every project created before 2026-08-05 kept the gap. Confirmed by creation dates: Scraper and MasterACL (2026-07-17) lacked it, Profiler (2026-08-09) had it, Receipts (2026-08-01) had it from an earlier hand-fix.

**Final verified state — all four deployed apps at 7 declared / 7 granted:** Receipts, Profiler, Scraper, MasterACL.

**What was built (all propagated to 7 auth projects + the GAS auth template):**
- `checkSpreadsheetAccess` now distinguishes *unreadable* from *denied*, retries once, returns an **uncached** `aclUnavailable` verdict with a specific reason (`acl_unreachable` / `acl_tab_missing` / `acl_empty` / `acl_column_missing`), and no longer counts infrastructure failures toward the lockout tiers
- `registerSelfProject` throttled to once per version instead of writing 5 cells to the shared Access tab on **every** page load across 7 projects — the contention source
- `diagnoseAuthorization()` — prints effective user, granted scopes, declared scopes, and a binary verdict; a non-null authorization URL is positive proof of a partial grant
- `diagnoseOauthScopes_()` — reads the manifest back through the Apps Script API
- Client error mapping is reason-aware across 13 call sites; structural faults no longer say "try again in a moment"

**Where we left off:**
- Everything committed, merged and verified live. Working tree clean at **v02.62r**
- `Scraper`'s `scSchedulerTick` trigger is installed and running

**Key decisions made:**
- **The developer declined to install MasterACL's `enforceRetention` and `auditRetentionCompliance` triggers** — no HIPAA requirements currently apply. MasterACL therefore has **0 triggers by choice**, not by defect. `setupRetentionTrigger` / `setupComplianceAuditTrigger` are manual one-time functions with no callers; **do not re-recommend running them** unless the developer's compliance position changes
- **Manifests were deliberately NOT put under version control.** The obvious "fix" for scope regressions is to commit a canonical `appsscript.json` per project and have the self-deploy write it — rejected because `pullAndDeployFromGitHub()`'s manifest preservation is what stops a shared template from clobbering per-project webapp settings. Recorded in `gas-scripts-reference.md` as a decision to revisit only if this recurs
- MasterACL requires manual trigger setup while Scraper self-installs on `doGet`. **Left inconsistent on purpose** — the "run this ONCE" comments look deliberate and converting them was not requested

**Active context:**
- CHANGELOG counter **87/100** — archive rotation ran at v02.62r (2026-08-04 group, 14 sections, SHA-enriched). Clone was deepened 69 → 374 commits to make the lookups work
- **A green CI run is not proof a GAS deploy landed** — the workflow's deploy step exits 0 and only emits a `::warning`. Confirmed three times tonight. Verify with `curl -sL "<exec>?action=api&op=deploy"`, which returns the live version and is safe/idempotent
- **Open, unrelated:** `Scraper`'s `scSchedulerTick` shows a **19.74% error rate**. Traced far enough to rule out the OAuth work (no `ScriptApp` calls in the tick path) — it is a genuinely separate problem. Next step is Scraper's Executions panel filtered to Failed
- `userinfo.email` is ungranted on all four apps, so `diagnoseAuthorization` cannot print "Running as". Cosmetic; no app function depends on it
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off

**Recommendation for next session:**
- Investigate `Scraper`'s 19.74% `scSchedulerTick` error rate — open Scraper's Executions panel, filter to Failed, and diagnose from the actual error text. It is the only known-unhealthy thing left in the fleet and is unrelated to tonight's OAuth work.
- **To continue:** type `look into Scraper's scheduler error rate`

## Previous Sessions

### Session — 2026-08-17 (v02.54r, auto-reconstructed)

**Date:** 2026-08-17 02:10:00 AM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v02.54r

**What was done (v02.49r → v02.53r, all AIDC-report work):**
- Added §7.5 "Reading a certification claim" to the AIDC market report — UL 1973 / 9540 / 9540A, NFPA 855, IEC 62619/63056/62477 taught in dependency order (v02.49r)
- Closed 21 acronym gaps at first use, added a chapter-8 subsection naming the tax-equity investor and independent engineer as the real FEOC enforcers, and taught capacity factor / curtailment / ancillary services / book-and-burn (v02.50r)
- Raised chapter 2 one notch in teaching patience; **CHANGELOG archive rotation fired** — 2026-08-03 (11 sections, v01.51r–v01.61r) moved to the archive (v02.51r)
- **Split the coverage chapters into a standalone companion** — `AIDC-COVERAGE-UNIVERSE.md` + 5 PDF editions; the report dropped 14 chapters/158 pages → 11 chapters/109 pages with no argument removed. `scripts/build-aidc-report-pdf.mjs` gained a `DOCS` registry and a `--doc` flag (v02.52r)
- Rebranded both mastheads and running headers to "Jon Yang Equity Research"; fixed the companion carrying the report's title in its footer on all 51 pages (v02.53r)

**Where we left off:**
- All committed and merged; working tree clean at v02.53r before this session began

**Active context:**
- CHANGELOG counter at 92/100 after the v02.51r rotation
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
