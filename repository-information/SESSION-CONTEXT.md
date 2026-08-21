# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-21 05:02:40 PM EST
**Repo version:** v02.70r
**Branch:** `claude/aidc-market-report-clarify-sruhbn`

**What we worked on (v02.49r–v02.53r and v02.63r–v02.70r — AIDC research platform + Zhonhen campaign):**

- **Two-document restructure of the AIDC market report:** `AIDC-MARKET-REPORT.md` is now an 11-chapter / 109pp report; former chapters 10–12 became the standalone `AIDC-COVERAGE-UNIVERSE.md` (3 chapters, 40 companies, 51pp — every per-company "recommended strategy" passage kept per the developer's instruction). Both rebranded **"Jon Yang Equity Research"**, TOCs fully expanded, certification stack (§7.5) added, 21 acronym gaps closed, chapter 2 at +1 teaching patience. `scripts/build-aidc-report-pdf.mjs` has a DOCS registry (`--doc report|coverage`, `--style <slug>`)
- **Zhonhen Electric dossier** (`zhonhen.profile.json`, 41 sources) — Profiler registry now at **41 companies**. Load-bearing corrections vs the recruiter's framing: the chairman is **Bao Xiaoru** (the mother), not the founder; **31%** is overall China HVDC share (Kezhi 2025) while "70%+" is per-account share within named customers; CATL is taking 49% of the **holding company**, not the listco (definitive agreement 2026-08-14)
- **Zhonhen interview campaign — the developer PASSED round 1** (AIDC Sales Director; interviewer "Jacky Zhu" = **Zhu Yikun**, son of founder Zhu Guoding and chairman Bao Xiaoru). Prep set in `repository-information/study-prep/zhonhen/`: interview brief (11pp), power-architecture lesson plan (6pp — US AC chain vs China 240/336/800Vdc), and an absorption summary of the company's confidential intro deck (4pp) — all with PDFs via `scripts/build-study-prep-pdf.mjs`
- **Approved the Profiler roster-expansion plan** with the study-guide amendment — full plan in the Recommendation below

**Where we left off:**
- Everything committed, merged, and verified at **v02.70r**; working tree clean. No in-flight work — this save exists specifically so the roster expansion runs on a clean session

**Key decisions made:**
- **Model usage for the expansion:** Fable 5 within included weekly limits, fall back to Opus 5 when exhausted. **No "Fable 5 Extra"** (usage-credit billing) and **no ultracode** — the Profiler protocol already supplies the orchestration, and the 4-CPU container caps useful concurrency at ~2 agents
- **Study-guide effort stays at default High** — guides are derivative of already-deep dossier research; raising effort would spend budget on the cheapest step of the pipeline
- **Confidentiality (standing, non-negotiable):** the Zhonhen intro deck is marked CONFIDENTIAL — never committed to the repo, never cited into the public dossier; its summary lives only in non-deployed `study-prep/`. Recruiting-channel information (the English name "Jacky Zhu", meeting logistics, recruiter claims) never enters public profiles — public sources only per PROFILER-SCHEMA.md. Never raise Zhu Guoding's Dec 2025 conviction with the interviewer. `study.json` files are public-safe: concept/technology flashcards only — no company trivia, no personal or interview context
- One deck inconsistency to sidestep in conversation: say "the 100-kilowatt power shelf" (slide 6 says 108kW, slide 15 says 100kW)

**Active context:**
- CHANGELOG counter **95/100** — the next few pushes will trip archive rotation (rotate whole date-groups, SHA-enrich every moved header, run the post-rotation grep verification)
- MULTI_SESSION_MODE is Off but parallel sessions have been landing on main all week — rebase before every push cycle and bump from whatever version main is actually at
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**
- Execute the approved Profiler roster expansion: **Batch A — neoclouds** (Nebius, Lambda, Applied Digital, IREN, TeraWulf, Core Scientific — two-agent Profiler runs each), then **Batch B — general contractors** (Turner, Holder, DPR, HITT, Mortenson — single-agent), then **Batch C — EPCs** (Bechtel, Kiewit, Burns & McDonnell, Black & Veatch, Primoris — single-agent). Every new dossier ships with its `<slug>.study.json` in the same batch commit; one commit per batch. After the batches, run the **retroactive study-guide backfill**: compute the gap list by diffing `ls live-site-pages/profiler-data/*.study.json` against the registry (only hithium, sinexcel, sungrow, tesla, wartsila, and zhonhen have guides as of this save) and create the missing ones at default High effort. New listed companies get post-earnings refresh triggers; private ones join the quarterly sweep. Optional future Batch D (colos): Vantage, Aligned, QTS, Switch, STACK
- **To continue:** type `approved — run batch A`

## Previous Sessions

### Session — 2026-08-17 (v02.62r)

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

