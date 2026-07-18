# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-07-18 12:16:58 AM EST
**Repo version:** v01.13r

**What we worked on:**
- Created the **Scraper** (News Scraper) auth GAS project via `setup-gas-project.sh` (v01.04r) — script ran clean, all v01.03r script fixes verified in production
- Admin permissions: seeded `jonyang92@gmail.com` as admin via `ensureSeedAdmins()` in MasterACL.gs (v01.05r); added zero-setup `grantUserAccess()` editor utility with built-in defaults for both owner emails (v01.06r–v01.07r); it also repairs/builds the Master ACL sheet structure (Access/Roles tabs, metadata rows) and probes the web app (v01.08r)
- **Sign-in overhaul (the big arc)** — root causes found and fixed in layers: (1) `TOKEN_EXCHANGE_METHOD` mismatch — auth HTML template hardcodes `postMessage` but `standard` GAS preset uses `url` → aligned MasterACL/Scraper to the proven `hipaa` preset (v01.09r–v01.10r); (2) Google's multi-account `/u/N` iframe 404s → ported the **iframe-free `fetch` transport** (exchange/heartbeat/sign-out/restore) from the testauthgas1 scaffold into MasterACL/Scraper/globalacl pages + GAS routes + **both auth templates** (permanent fix — future projects born working, v01.11r); (3) the app-UI iframe itself → **`credentialless` iframes** force Google's anonymous serving path (v01.12r)
- Added Scraper **text-submission feature**: text box + Submit on the page (PROJECT blocks), session-validated `submitText` fetch route appends [timestamp, email, text] to `Live_Sheet` (v01.13r)

**Where we left off:**
- Owner confirmed everything works in the normal multi-account browser: sign-in, MasterACL app screen, and Scraper submissions. All committed, merged to main, deployed. Working tree clean

**Key decisions made:**
- The **fetch transport is now the standard** sign-in architecture (in both auth templates); preset choice no longer affects sign-in
- GAS iframes load **credentialless** (cookie-less → anonymous serving; unsupported browsers ignore the attribute)
- `testauthhtml1` intentionally left on postMessage (it's the postMessage test scaffold); `testauthgas1` is the fetch reference
- Known latent template bug left as-is: doPost `getData` route calls undefined `processDataPoll` (dead route, nothing calls it)
- Public GAS/page changelog entries kept generic per changelog-security rules; full detail in repo CHANGELOG

**Active context:**
- Branch: `claude/news-scraper-gas-setup-2kxvc3` (auto-deleted from remote after each merge; recreate by pushing)
- Repo v01.13r · 7 tracked pages, all 🟢 — MasterACL v01.02w·v01.07g, Scraper v01.03w·v01.04g, globalacl v01.02w·v01.01g, gas-project-creator v01.01w, test pages v01.00w
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No reminders, no TODO items

**Recommendation for next session:**
- Configure the **Globalacl** project (it still has placeholder deployment/spreadsheet IDs from initialization) so the central ACL manager UI becomes usable — it already carries the fetch transport and credentialless fixes, it just needs a real Apps Script deployment wired into `globalacl.config.json`.
- **To continue:** type `set up the globalacl project`

## Previous Sessions

**Date:** 2026-07-17 07:15 PM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v01.03r

**What was done:**
- Fixed `scripts/setup-gas-project.sh` Phase 6 GAS Projects table row placement — now anchors on the `| Project | Code File |` header instead of the last pipe-line in the file (v01.03r)
- Fixed `scripts/setup-gas-project.sh` Phase 9 workflow deploy step insertion — now anchors on the stable `- name: Update AHK version files` step name (v01.03r)
- Fixed `scripts/setup-gas-project.sh` Phase 5b — generated diagrams now include the "Open in mermaid.live" pako link with round-trip verification (v01.03r)

**Where we left off:**
- All changes committed and merged to main

**Active context:**
- Repo version: v01.03r · 6 tracked pages (all 🟢)
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off

Developed by: ShadowAISolutions
