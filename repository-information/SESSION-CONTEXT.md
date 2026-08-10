# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-09 11:47:52 PM EST
**Repo version:** v02.24r

**What we worked on (v02.20r → v02.24r — the Profiler coverage-expansion session):**
- **20 new Intel Briefing dossiers** in two batches of 10 (each researched by 20 parallel subagents, two per company, Source Priority Protocol): v02.20r — LG Energy Solution, Panasonic, Samsung SDI, Jinko, NVIDIA, Meta, Google, Amazon, Microsoft, Rosendin; v02.22r — Vertiv, Delta Electronics, Eaton, Schneider Electric, GE Vernova, LITEON, Oracle, OpenAI, CoreWeave, Bloom Energy; v02.23r — xAI, Crusoe, Equinix, Constellation Energy, Siemens Energy, Hitachi Energy, ABB, Huawei Digital Power, EVE Energy, Quanta Services. **Roster now 40 companies** — the full coverage set recommended for the AIDC market report (a Workflow-driven segment analysis answered "what companies should Profiler research for a sales-strategy market report?")
- **Post-earnings Routine grid completed** (v02.21r + v02.24r): all 27 public tickers on the roster now have one-shot verify-then-refresh-then-re-arm triggers (nearest: Sinexcel 08-12, EVE 08-21, NVIDIA 08-27); the private-company quarterly sweep expanded to 6 (Hithium, FlexGen, Rosendin + Crusoe, Huawei Digital Power, xAI — xAI converts to a post-earnings trigger if the SpaceX IPO brings quarterly reporting)
- **Source format migrated across all 40 dossiers** (v02.24r): `sources[].accessed` → publication `date` (omitted for undated evergreen pages), every `sources[]` re-sorted newest-first with undated entries last; `PROFILER-SCHEMA.md` updated (chronological ordering replaces first-party-first citation order); `Profiler.html` v01.18w renders publication dates in app + Word/PDF export with a legacy `accessed` fallback for archived profiles. Executed by 8 parallel agents; all 40 files validated programmatically (JSON, date format, ordering)

**Where we left off:**
- Everything pushed and auto-merging (v02.24r); working tree clean; render checks passed (40 home cards, zero page errors). Note: sessions v02.07r–v02.19r were other parallel sessions' work (see CHANGELOG) — this file skipped from v02.06r
- Some migrated publication dates are month-level estimates (agents flagged their low-confidence choices); they self-correct as future refreshes re-research sources under the new format. The `profiler-data/archive/` copies were intentionally NOT migrated (historical snapshots)

**Key decisions made:**
- Source citations use **publication dates, newest first, undated evergreen pages last** — developer directive 2026-08-09, now in PROFILER-SCHEMA.md; all refresh-trigger prompts carry the new format instructions
- The source-format migration was treated as a format change, not a content revision — no profileVersion bumps, no archival, `lastUpdated` untouched on all 40 profiles
- Batch-2 category calls: xAI + Equinix = hyperscaler, Crusoe + Constellation = developer, Quanta = integrator, the five equipment/cell vendors = supplier

**Active context:**
- Branch `claude/profiler-notes-interview-prep-s38384` (deleted from remote after each auto-merge; recreate by pushing)
- Repo v02.24r · Profiler v01.18w·v01.05g · 9 tracked pages all 🟢 · CHANGELOG counter 112/100 (95 non-exempt — rotation will fire on the next push dated after 2026-08-09)
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders

**Recommendation for next session:**
- **Generate the AIDC market report** — the stated goal this 40-company expansion was built for. All dossiers are fresh (researched 2026-08-07/09), so the report can synthesize directly from the profiles and cite their sources without new research: turbine/transformer scarcity economics, behind-the-meter power (xAI/Crusoe as templates), the 800 VDC transition, BESS competitive dynamics, and the craft-labor bottleneck — shaped as the sales-strategy deliverable for Jon's AIDC power/storage pipeline
- **To continue:** type `generate the AIDC market report`

## Previous Sessions

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

Developed by: ShadowAISolutions
