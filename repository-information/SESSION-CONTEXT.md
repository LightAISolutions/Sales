# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-02 08:36:01 PM EST
**Repo version:** v01.48r

**What we worked on:**
- 12 feature pushes on the **Receipts app** (v01.37r → v01.48r, all merged + deployed; Receipts.html v01.28w · Receipts.gs v01.16g)
- **Admin menu**: fixed the GAS admin dropdown (hidden behind the email row, then a first-tap no-op from the `=== 'none'` toggle) and restyled it as a solid blue ADMIN badge next to the status pills
- **UI comfort**: collapsible Filters drawers in Reports and History (collapsed by default, "n active" hint), sort/Export/circle-graphs controls pinned outside the drawers, Clear buttons in both filter sets, removed the redundant saved checkmark in History, Settings ⚙️ cog panel (signed-in email + Sign out / Sign out everywhere), themed hand-drawn receipt SVG on the sign-in wall (`images/receipts-logo.svg`), affirmation cycle slowed to 14s
- **Line Items drill-down**: Reports → category (+ optional subcategory) → searchable line-item list joined to receipts; "Group by item" collapses identical items with purchase count, price range, and total spend across purchases, with expandable per-purchase history
- **Household combined view**: "Combined (mine + shared)" owner option in History/Reports backed by `resolveOwnerSet_` over the Shares tab; owner name chips on rows, seamless cross-owner open/edit, mutual delete rides the edit grant, Owner column added to exports
- **Drive photo sharing**: granting view/edit auto-shares the owner's Drive "Receipts App" folder (reader permission) from the owner's browser; revoking unshares; a reconciliation pass on load covers pre-existing grants (localStorage `Receipts_folder_perms_synced`)
- **Simplified Chinese**: Settings-cog language toggle (localStorage `Receipts_lang`); full chrome translation including all categories/subcategories (History + Reports filters, report breakdowns, review-screen dropdowns), month card, 周X daily / 2026年X月 monthly / 上半年·下半年 biannual period labels, statuses, and affirmations — stored receipt data stays English
**Where we left off:**
- All 12 pushes merged via the auto-merge workflow; working tree clean. User confirmed the combined view and cross-user photo access work on real devices. Receipts.html v01.28w · Receipts.gs v01.16g

**Key decisions made:**
- Translation is **display-only** — stored category values and AI extraction always write English (data is shared across users/languages); `tCat()` relabels dropdowns by option *value* so nothing is lost switching languages
- Delete permission rides the edit grant (no separate delete scope); the month card stays personal in combined mode; a partner-deleted receipt leaves its photo in the owner's Drive (only the owner's browser can trash it)
- Drive folder sharing must run in the **owner's browser** (drive.file token) — the server cannot touch user Drives; missed grants self-heal via the on-load reconciliation
- `t()`/`tCat()` dictionary lookups are guarded with `typeof` checks because category builders run at script-eval before the dict assignments — an unguarded lookup killed the entire inline script (sign-in outage risk, caught by the zh-at-load Playwright test)

**Active context:**
- Branch: `claude/receipts-app-features-t0nbdq` (auto-deleted from remote after each merge; recreate by pushing)
- Repo v01.48r · 9 tracked pages, all 🟢 — Receipts v01.28w·v01.16g; all other pages unchanged this session
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No reminders, no TODO items

**Recommendation for next session:**
- Run a full end-to-end 中文 pass on the phone — switch language in the ⚙️ cog, then walk scan → review → save → History → Reports → Line Items → sharing — and report any untranslated or awkward strings; the translation layer touched nearly every screen and a native-eye review is the one remaining verification
- **To continue:** type `review the Chinese translations`

## Previous Sessions

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

Developed by: ShadowAISolutions
