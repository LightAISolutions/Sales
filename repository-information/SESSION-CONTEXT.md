# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-08 10:30:31 PM EST
**Repo version:** v02.06r

**What we worked on:**
- **Resolved the Receipts sign-in outage** (research + v01.99r diagnostic): `not_authorized` for all users wasn't ACL data — the script's Google authorization had lost the Sheets scope (`SpreadsheetApp.openById` → "Required permissions"). Added permanent owner-run `diagnoseAclAccess()` to `Receipts.gs` (logs the actual spreadsheet URL the code reads, duplicate-column detection, charCode dumps, cached + fresh verdicts, clears the access cache). Fix playbook: restore `oauthScopes` in appsscript.json → remove the app connection at myaccount.google.com/connections → re-run + approve ALL granular-consent checkboxes → GRANTED
- **Built the full reimbursement plan (R1–R3, approved: one company · lazy folders · CSV · English names):**
  - R1 (v02.01r, v01.31w·v01.20g): Personal/Business expense type at scan + review, Expense Type col 15, History 💼 badge, History/Reports/export filters (`etype` through all routes), 中文 translations
  - R2 (v02.03r, v01.32w·v01.21g): renamed Reimbursement→Business everywhere (stored value too, legacy-read compat); toggle redesigned as bold segmented switch ("EXPENSE TYPE" caption, active side solid ink); Business saves convert the photo to a one-page PDF **in the browser** (hand-built JPEG-in-PDF, MuPDF-verified) and file it under `<Company>/<Year>/<Month>` in the user's own Drive via their `drive.file` credential; first Business save prompts for company name (Profiles col 5, editable in ⚙️ Settings); PDF Link col 16; deletes/flips clean up
  - R3 (v02.06r, v01.33w): each month folder gets a self-maintaining `Line Items - <Month> <Year>.csv` (rows keyed by the receipt ID's YYYYMMDD suffix — edits move rows across months, deletes/flips remove them); PDF→ledger run sequentially to avoid folder-creation races
- Two CHANGELOG archive rotations with SHA enrichment (2026-07-13 group, then the 11-section 2026-07-17 group; archive now 12 sections)

**Where we left off:**
- All three phases pushed and auto-merged; working tree clean. **The Business pipeline is deliberately untested end-to-end** — the developer has no real Business receipts until a new job starts, and explicitly deferred all Business testing ("I will bring problems up as they arise")
- What IS verified: PDF builder rasterized by MuPDF from the page's exact code; CSV logic (escaping, row replacement, month filenames, ID-date parsing) run on real data in Node; all UI Playwright-checked; every Drive call reuses the app's proven own-Drive patterns

**Key decisions made:**
- Stored expense values are `Personal`/`Business` (blank legacy rows = Personal; brief `Reimbursement` era readable)
- All Business filing is client-side with the user's own Drive credential — the server only stores links; receipt saves never fail because of filing failures (best-effort + re-save retries)
- Company folder tree is created lazily at Drive root; folder/file names stay English even in 中文 mode
- Sign-in outages: run `diagnoseAclAccess()` in the Receipts GAS editor first — it pinpoints ACL-data vs file-access vs OAuth-scope causes in one run

**Active context:**
- Branch `claude/receipts-gas-setup-o6rgh6` (deleted from remote after each auto-merge; recreate by pushing)
- Repo v02.06r · Receipts v01.33w·v01.21g · 9 tracked pages all 🟢 (Profiler v01.08w — other sessions are actively developing Profiler/Scraper in parallel; expect rebases on every push)
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No reminders, no TODO items

**Recommendation for next session:**
- Nothing is buildable until the developer's first real **Business** receipt exercises the new pipeline live (company prompt → `<Company>/<Year>/<Month>` PDF + ledger CSV). When they report that first run, verify the Drive tree and files match the design and fix anything that surfaces — start by reading the v02.01r–v02.06r CHANGELOG sections and the PROJECT-block PDF/ledger modules in `Receipts.html`
- **To continue:** type `my first business receipt results`

## Previous Sessions

**Date:** 2026-08-07 10:21:51 PM EST
**Repo version:** v01.93r

**What we worked on:**
- Verified the Sinexcel scheduled refresh pre-fire (v01.91r research portion): trigger `trig_01KcsGWtyHTq5j4ySXZddg5b` enabled for 2026-08-12 13:00 UTC with the full upgraded prompt; `sinexcel.profile.json` (profileVersion 1) in sync with the registry; empty `archive-index.json` ready for the first archival — no changes needed
- Profiler logo (v01.91r, page v01.04w): created `images/profiler-logo.svg` (dossier-card emblem in the app's ink/paper/gold palette) and pointed `SPLASH_LOGO_URL` at it; Playwright-verified on all three splash screens
- Made Profiler an installable PWA (v01.92r, page v01.05w): `profiler.webmanifest`, 192/512 icons (512 = `any maskable`, emblem at 80% on full-bleed ink), manifest/theme/Apple tags + `manifest-src 'self'` PROJECT OVERRIDE in `Profiler.html`
- Fixed standalone install (v01.93r): the installed Receipts app claimed scope `./` (whole site), which per documented Chrome behavior blocks installing a second PWA in that scope — narrowed both manifests to per-app scopes (`./Profiler.html`, `./Receipts.html`) and added stable `id`s. Developer reinstalled both and confirmed they now run standalone

**Where we left off:**
- Everything committed, pushed, and auto-merged (v01.93r). Both PWAs verified working on the developer's phone. Nothing in flight

**Key decisions made:**
- Only `SPLASH_LOGO_URL` carries an app's logo — `DEVELOPER_LOGO_URL`/`YOUR_ORG_LOGO_URL` stay on the placeholder (they're developer/org branding, and the page doesn't consume them)
- Multi-PWA-on-one-origin pattern: each installable page's manifest scopes to exactly its own page with a stable `id` — apply this to any future installable page
- Maskable icon convention: composite the emblem at 80% on a full-bleed background so icon masks can't clip it

**Active context:**
- Branch `claude/profiler-sinexcel-logo-87ub0e` · Repo v01.93r · 9 tracked pages, all 🟢; Profiler at v01.05w
- Armed refresh triggers unchanged from last session (Sinexcel 08-12 · Sungrow 08-30 · BYD 08-30 · Tesla 10-22 · Wärtsilä 10-28 · CATL 11-01 · Fluence 11-25 · Hithium/FlexGen quarterly)
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders

**Recommendation for next session:**
- The Sinexcel refresh fires autonomously on 2026-08-12 13:00 UTC — after it runs, review it end-to-end: the refreshed dossier's quality, the archival flow (`sinexcel.profile.v1.json` in `profiler-data/archive/` + `archive-index.json` entry + `bess-aidc-library` mirror), and that it re-armed the next Sinexcel trigger
- **To continue:** type `review the Sinexcel refresh results`

Developed by: ShadowAISolutions
