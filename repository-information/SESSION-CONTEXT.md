# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-01 07:00:24 AM EST
**Repo version:** v01.27r

**What we worked on:**
- Built the complete **Receipts tracking app** end-to-end (v01.16r → v01.27r, 12 pushes, all merged + deployed): scaffolded the auth/hipaa GAS project "Receipts" via `setup-gas-project.sh`, then implemented the approved 5-phase plan plus refinements
- **Pipeline**: phone photo → client-side compression → Drive upload → Gemini AI extraction (`gemini-3.6-flash` primary, `gemini-3.5-flash` fallback, 3-attempt retry plan, CacheService result cache keyed by fileId) → editable review-before-save screen → save to spreadsheet (`Receipts` cols A–N incl. Store Address, `LineItems` with per-item categories, auto-rebuilt `Monthly Summary` tab)
- **History browser**: merchant search, labeled Start/End Date boxes side-by-side below the search row, category dropdown filter (9 major categories, server-side, also applies to export), sort-by-receipt-date, tap-to-expand details, two-tap delete (RBAC-checked, photo → Drive trash), grouped `.xlsx` export with banded per-receipt LineItems and Monthly Summary sheet
- **Data quality**: readable receipt IDs `Store_Name-YYYYMMDD` with lazy flag-guarded migration (v3), merchant Title Case standardization, per-item 16-department taxonomy editable in review, duplicate detection (same merchant+date+total → confirm-to-force), store address extraction
- **Infra**: PWA install (manifest + icons + `manifest-src 'self'` CSP override), Drive photos folder viewer-sync from the Master ACL Receipts column (10-min throttle), removed the "Show unsaved uploads" checkbox (UI is saved-only)

**Where we left off:**
- User confirmed **everything works on the phone** after the final change (labeled date filters + category dropdown, v01.27r). All pushes merged; working tree clean. Receipts.html v01.10w · Receipts.gs v01.08g

**Key decisions made:**
- Gemini API key lives ONLY in GAS Script Properties (`GEMINI_API_KEY`) — never committed
- Receipt photos folder `1DHfXwzo0qXI_2H0Q2dDLKGn7EOtguI0A` (LightAISolution's Drive); viewer access auto-synced from Master ACL — granting/revoking app access grants/revokes folder access
- Server retains the `uploaded` capability on `listReceipts`/`exportReceipts` even though the UI is saved-only (harmless, re-exposable without backend change)
- Category filter is server-side (applied before the 100-row cap) and intentionally also filters the .xlsx export
- No browser `confirm()`/`alert()` — two-tap inline confirm pattern for deletes

**Active context:**
- Branch: `claude/receipts-gas-setup-o6rgh6` (auto-deleted from remote after each merge; recreate by pushing)
- Repo v01.27r · 9 tracked pages, all 🟢 — Receipts v01.10w·v01.08g, MasterACL v01.02w, Scraper v01.04w, globalacl v01.02w, gas-project-creator v01.01w, spain-argentina/testauthgas1/testauthhtml1/text-compare v01.00w
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No reminders, no TODO items

**Recommendation for next session:**
- The Receipts app is feature-complete and fully phone-tested — no deferred Receipts work. The strongest carried-over item: the **Globalacl** project still has placeholder deployment/spreadsheet IDs from initialization; wiring a real Apps Script deployment into `globalacl.config.json` would make the central ACL manager UI usable
- **To continue:** type `set up the globalacl project`

## Previous Sessions

**Date:** 2026-08-01 01:34:25 AM EST
**Repo version:** v01.15r

**What we worked on:**
- Diagnosed and resolved the News Scraper sign-in failure ("stuck at Sending credentials" for jonyang92@gmail.com). Root-caused through three layers: (1) the original hang was transient Google-side serving trouble that cleared on its own; (2) the "Sorry, unable to open the file" page on direct `/exec` visits was Google's multi-account cookie routing — a red herring, since the page's fetch transport is cookie-less; (3) the real blocker was `not_authorized` from `checkSpreadsheetAccess()` — the Master ACL grant for jonyang92@gmail.com had been flipped off sometime after 7/18
- Verified server health directly via curl probes from the session container: anonymous GET of Scraper `/exec` serves the app shell (HTTP 200); the `action=api&op=exchangeToken` GET route returns correct JSON; the POST route currently returns a Google HTML error page (known Google POST flakiness — the client's GET fallback absorbs it, ~1–2s penalty per sign-in)
- Verified the deployment ID in `Scraper.config.json` matches both the Active deployment in Manage Deployments and the `_e`-encoded URL in `Scraper.html` — no repo changes needed anywhere
- Owner ran `grantUserAccess()` in the MasterACL editor: structure verified, both owner emails re-granted admin with all page columns TRUE, cache epoch bumped 8→9, web app probe OK — sign-in confirmed restored
- Session start: auto-reconstructed stale session context (v01.13r → v01.15r) and pushed it (merged to main via auto-merge workflow)

**Where we left off:**
- Sign-in fully working again; no repo code changes were needed (diagnosis-only session). Working tree clean, all commits merged
- Open mystery: something edited the Master ACL between 7/18 and 7/31 to remove the grant (cache epoch was already at 8 pre-fix). Developer was advised to check the ACL spreadsheet's File → Version history to identify the edit — result not yet reported

**Key decisions made:**
- No repo changes warranted — deployment, config, page wiring, and GAS routes all verified correct
- Google POST flakiness on `/exec` left as-is; the existing POST→GET fallback architecture already handles it
- The 7-day Testing-mode OAuth expiry hypothesis was investigated and ruled out for this incident (backend served anonymously throughout the final tests)

**Active context:**
- Branch: `claude/login-sending-credentials-stuck-5nvs31` (auto-deleted from remote after each merge; recreate by pushing)
- Repo v01.15r · 8 tracked pages, all 🟢 — MasterACL v01.02w·v01.07g, Scraper v01.04w·v01.04g, globalacl v01.02w·v01.01g, gas-project-creator v01.01w, spain-argentina v01.00w, test pages v01.00w, text-compare v01.00w
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No reminders, no TODO items

**Recommendation for next session:**
- Configure the **Globalacl** project (carried over from 7/18 — it still has placeholder deployment/spreadsheet IDs from initialization) so the central ACL manager UI becomes usable; it already carries the fetch transport and credentialless fixes, it just needs a real Apps Script deployment wired into `globalacl.config.json`. (Separately, the developer may report the ACL version-history findings for the mystery edit at any time.)
- **To continue:** type `set up the globalacl project`

Developed by: ShadowAISolutions
