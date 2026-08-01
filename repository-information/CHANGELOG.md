# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 31/100`

## [Unreleased]

*(No changes yet)*

## [v01.31r] — 2026-08-01 06:53:29 PM EST

> **Prompt:** "One more change:
>
> * Change front-end display to include a hidden button on the letter "R" in the word "Receipts" on the home screen that I can press to toggle on/off the HTML and GAS layer. I want the app to look clean to other users and still allow me to toggle these layers on for myself."

### Added
- `live-site-pages/Receipts.html` (v01.14w) — hidden developer hotspot: the "R" of the brand heading is wrapped in `#rsp-r-secret` (no visual affordance, tap-highlight suppressed); tapping it shows/hides the `#html-layer-toggle` and `#gas-layer-toggle` pills, which now start hidden for everyone. The template's post-sign-in `_showGasToggle()` / sign-out `_hideGasToggle()` are wrapped so GAS-pill eligibility is tracked but the pill only surfaces while the hotspot state is on

### Fixed
- `.rsp-brand span` date styling narrowed to `#rsp-date` — the generic selector was also hitting the new "R" span, rendering it small/italic (caught by the Playwright screenshot before commit)

### Verified
- `node --check` on both inline scripts; Playwright at 390px — pills hidden on load, still hidden after the template's simulated post-sign-in `_showGasToggle()`, both revealed on "R" tap (HTML pill toggles the receipts layer correctly), both hidden again on second tap; heading renders with a uniform "Receipts" wordmark; zero page errors

## [v01.30r] — 2026-08-01 06:08:39 PM EST

> **Prompt:** "A few more changes: 
>
> * In the Reports section:
>    * Hide the "All departments" drop-down menu until "Groceries" are chosen in the "All categories" drop-down menu. 
>    * Change "Circle graphs (percentage comparison)" to "Circle graphs".
>    * After checking the "Circle graphs" option, I notice that only 8 data groups are included before the rest are grouped under "Other". Reformat the circle graphs such that the circle graph itself is larger and located above the index breakdown of different data groups. Then, allow each circle graph to include up to 20 data groups that keep extending downwards. I like the current data group format of "Group name, Percentage, USD Amount", so keep this structure."

### Changed
- `live-site-pages/Receipts.html` (v01.13w) — `#rp-subcat` (departments dropdown) starts `display:none` and is toggled by a dedicated `#rp-cat` change listener: visible only when the selection is `Groceries`; on any other selection it hides and clears its value (with a re-render) so no invisible line-item filter lingers
- Circle-graphs checkbox label shortened to "Circle graphs"
- Donut layout restructured: `.rp-donut-wrap` is now a column (large `min(210px, 62vw)` donut centered on top, full-width legend below extending downward); slice cap raised 8 → 20 before the "Other" fold; legend row format unchanged (swatch · name · percent · amount)

### Verified
- `node --check` on both inline scripts; Playwright at 390px with intercepted `reportReceipts` demo data (12 categories) — departments dropdown hidden on load, visible for Groceries, hidden + cleared on switch to Dining; 12 legend rows render without an "Other" fold; large donut renders above the legend

## [v01.29r] — 2026-08-01 05:53:12 PM EST

> **Prompt:** "A few more changes:
>
> * In the Reports section:
>    * Change the Daily Totals format to the equivalent of "Wed, 7/29/26".
>    * Change the Weekly Totals format to the equivalent of "7/26/26 - 8/1/26".
>    * Change the Monthly Totals format to the equivalent of "July 2026".
>    * Change the Bi-annual Totals format to the equivalent of "First Half of 2026" and "Second Half of 2026".
>    * Add a "By Department" section under the "By Category" section in the report that only shows up when the user chooses "Groceries" in the "By Category" drop-down menu. 
>    * Minimize each of the reporting groups ("Daily Totals", "By Category", "By Department", "Top Merchants" until the user clicks a little "+" icon on the right side of the reporting group. 
>    * Add a checkbox option to show the reporting groups as circle graphs instead of bar graphs to see percentage comparisons. Make sure they also start off minimized until the user expands the reporting group."

### Added
- `live-site-pages/Receipts.html` (v01.12w) — "By department" report group (line-item department totals over the filtered receipts), rendered only when the `#rp-cat` category filter is `Groceries`; collapsible report groups (`rpSection()` header + right-side circled `+`/`−` toggle, `_rpOpen` state map — all groups start minimized on every card open, toggle state survives filter re-renders via a delegated `#rp-body` click handler that flips display in place); "Circle graphs (percentage comparison)" checkbox — sections render as stroke-dasharray SVG donuts (8-slice cap + "Other" fold, `RP_COLORS` palette) with a swatch/label/percent/amount legend instead of bars
- Period-label formatter `bucketLabel()`: daily "Wed, 7/29/26", weekly "7/26/26 - 8/1/26", monthly "July 2026", bi-annual "First Half of 2026" / "Second Half of 2026"

### Changed
- Weekly bucketing switched from ISO-8601 Monday-start keys (`isoWeekKey`, removed) to Sunday-start week-start-date keys (`weekStartKey`) so the displayed ranges match the requested Sunday–Saturday spans; `.rp-section` groups restyled as bordered sub-cards to carry the collapsible headers

### Verified
- `node --check` on both inline scripts; Playwright interaction test at 390×844 with intercepted `reportReceipts` demo data through the real renderer — verified all four label formats, department group appears only for Groceries (present with, absent without), groups start collapsed, `+`/`−` toggling, and 3 donut SVGs with percentage legends in circle mode; only expected `file://` console errors

## [v01.28r] — 2026-08-01 05:18:59 PM EST

> **Prompt:** "In my Receipts app, I want to make the following changes:
>
> * Add an Upload receipts button to allow for mass processing for up to X number of receipts at a time. Recommend a max number of receipts to be uploaded and explain to me why.
> * Add a Reports button that allows for the generation and real-time display of daily, weekly, monthly, bi-annual, and annual reports, and real-time filtering by merchant name, major categories (ie: Grocery) tied with minor categories (ie: Produce), date ranges, and total cost ranges.
> * Allow me to edit the line items in Receipt History, so I don't have to delete/re-upload everytime I want to delete a line that I should have deleted in the Review step. 
> * Improve the landing UI. I want this app to look professionally made with popular mobile UX/UI designs. Show me a couple designs and let me choose before you implement." *(Design choice via AskUserQuestion: "A, but remove the "Photograph or choose a receipt to upload sentence". Instead, cycle through "Love yourself", "You're the best!", "Today's gonna be a good day", and 10 more sentences like these.")*

### Added
- Batch "Upload receipts" flow (gallery multi-select, cap 15/batch), Reports card with real-time client-side filtering, and edit-in-place for saved receipts in History
- `reportReceipts` GAS op — compact receipts + line-items dataset powering the Reports card and the landing month summary

### Changed
- Receipts landing redesigned to the developer-chosen "Paper Ledger" theme (cream/ink serif design with printed-receipt month summary); idle status line now cycles 13 affirmations
- `repository-information/diagrams/Receipts-diagram.md` — pipeline sequence diagram extended with the batch upload, edit-in-place, and reports flows (mermaid.live URL regenerated + decompression-verified)

#### `Receipts.html` — v01.11w

##### Added
- `#receipt-upload-input` (`multiple`, no `capture`) + sequential batch engine: per-photo compress → `uploadReceipt` → `extractReceipt` with ≥6.5s spacing between extraction calls (Gemini free-tier ~10 RPM), `MAX_BATCH = 15`, queue-stepped review cards with a "· n of N" position chip; Save/Discard advance the queue
- `#receipt-report-card` (z-index 8): Daily/Weekly/Monthly/Bi-annual/Annual segmented control, merchant/category/department/date-range/cost-range filters (all client-side over one `reportReceipts` fetch → instant re-render), summary chips, per-period bars, category breakdown, top merchants; minor-category mode switches totals to matching line-item amounts
- "✏️ Edit receipt / line items" button in each History detail — reopens the review card pre-filled from `getReceiptDetail` and re-saves via the idempotent `saveReceipt`, returning to a refreshed History list
- `#rcpt-month` landing hero (perforated-edge month summary fed by `reportReceipts`, refreshed after saves/deletes) and `#receipt-backdrop` full-screen cream layer wired into the template's HTML layer toggle via a project-side wrapper

##### Changed
- Full "Paper Ledger" restyle of the PROJECT CSS (theme variables `--rc-*`, serif type, monospace numerals, ink buttons); PWA `theme-color` → `#e9e3d6`; review/history/report cards raised to `top: 76px` with `calc(100dvh - 170px)` height; history date column widened to fix wrapping
- Idle status text replaced by a 13-sentence affirmation rotation (7s cycle; real status messages linger 12s before rotation resumes); status colors moved to theme palette

#### `Receipts.gs` — v01.09g

##### Added
- `reportReceipts(sessionToken, dateFrom, dateTo)` — all saved receipts (id, date, merchant, currency, total, category; cap 2000) plus their LineItems rows (receiptId, description, amount, category); routed in `doPost` and the `doGet` `action=api` fallback chain

### Verified
- `node --check` on the `.gs` and both inline page scripts; Playwright at 390×844 — landing, Reports, batch-position review card, and History detail with Edit button all render correctly in the new theme; only expected `file://` console errors

## [v01.27r] — 2026-08-01 06:51:35 AM EST

> **Prompt:** "In Receipt History, label the "Start Date" and "End Date" boxes in the same way as the "Search merchant" box is labeled. Also, keep the "Start Date" and "End Date" boxes side-by-side, but move them below the "Search merchant" box. Also, add a drop-down menu that filters between the major categories: Groceries, Dining, Transport, Health, Shopping, Entertainment, Utilities, Travel, and Other."

### Added
- Category filter for receipt history and export

#### `Receipts.html` — v01.10w

##### Added
- Full-width `#rh-cat` dropdown row in the history card, populated from the existing `CATEGORIES` array with a blank "All categories" option; sends `cat` on both `listReceipts` and `exportReceipts` calls and reloads on change

##### Changed
- History filter rows restructured: row 1 = merchant search + Search button; row 2 = "Start Date"/"End Date" boxes side-by-side, each with a small `.rh-field` label above (date inputs can't show placeholder text like the search box, so field labels are the matching treatment); row 3 = category dropdown

#### `Receipts.gs` — v01.08g

##### Added
- `category` parameter on `listReceipts` (exact match on the Category column, applied server-side before the row cap) and threaded through `exportReceipts` → internal `listReceipts` call; `cat` parameter wired into all four transport routes (POST + GET fallback for both ops)

### Verified
- `node --check` on the `.gs` and all inline scripts; Playwright at 390px — labels "Start Date"/"End Date" render above the side-by-side boxes, dropdown lists all 9 categories + "All categories", no horizontal scroll, zero page errors

## [v01.26r] — 2026-08-01 06:36:33 AM EST

> **Prompt:** "Everything works. Also, remove the checkbox for "Show unsaved uploads". I think it's redundant now that I will never upload a receipt without saving."

### Removed
- "Show unsaved uploads" checkbox from the history card (`live-site-pages/Receipts.html` v01.09w): markup, its change listener, and the `uploaded` parameter from the history-load and export calls — the UI is saved-only. The server-side `uploaded` parameter on `listReceipts`/`exportReceipts` is intentionally retained (harmless capability; the client simply no longer sends it), so unsaved rows remain reachable via the spreadsheet if ever needed

### Verified
- Zero `rh-show-uploaded` references remain; `node --check` on all inline scripts; Playwright render — sort checkbox and export button intact, zero page errors

## [v01.25r] — 2026-08-01 06:25:29 AM EST

> **Prompt:** "I tested the 2 actions and both work as intended. 1. In the Receipt History, standardize merchant names to be: capitalize the first letter of each word with the rest lower-case (ie: Trader Joe's instead of TRADER JOE'S). 2. In the Receipt History, when I try to "view photo", it says that "jonyang92@gmail.com" doesnt have access to the file. I assume it's because the folder is on "LightAISolution@gmail.com"'s Drive. I would like for this folder's permissions to be synced to my MasterACL file's permissions. For example, if I give a new email Admin access to my Receipts app via the MasterACL spreadsheet, I want that email to automatically get access to this Receipt Pictures folder. Make the changes necessary so that this can happen." *(screenshots: history with mixed-case merchants; Drive "you need access" page for jonyang92@gmail.com)*

### Added
- **Drive folder ↔ Master ACL permission sync** (`googleAppsScripts/Receipts/Receipts.gs` v01.07g): `syncDriveFolderAccess_()` reads the Access tab (col A emails, Receipts column TRUE, metadata rows skipped via the @-check), grants VIEWER on the photos folder to every authorized user, and revokes viewers whose grant was removed — the folder owner and manually-added editors are never touched. Runs from `listReceipts` (first thing opened before viewing photos), throttled via CacheService to once per 10 minutes; best-effort with the app's session auth as the real gate

### Changed
- **Merchant standardization**: `titleCase_()` (capitalize each word start incl. after hyphen/slash, rest lower-case, apostrophes preserved — "TRADER JOE'S" → "Trader Joe's") applied to `data.merchant` at save time; migration upgraded to **v3** (flag `RECEIPT_ID_FORMAT=v3`): title-cases all saved merchants in place and regenerates `Store_Name-YYYYMMDD` IDs + LineItems references + Drive photo names where the standardized name changes them (collision-suffix-only differences keep the existing ID)
- Pipeline diagram history flow updated (v3 migration + folder ACL sync; pako URL regenerated, decompression-verified)

### Verified
- `node --check` on the `.gs`; `titleCase_` behavior checked against real merchant strings (TRADER JOE'S → Trader Joe's, MEGA MART → Mega Mart, cvs/pharmacy #123 → Cvs/Pharmacy #123, seven-eleven → Seven-Eleven)

## [v01.24r] — 2026-08-01 06:06:54 AM EST

> **Prompt:** "I tested all 6 actions and they all worked as intended. Go with your suggested supermarket department taxonomy (16 departments). I want per-item editing in the review screen."

### Added
- Per-item department editing in the review screen (`live-site-pages/Receipts.html` v01.08w): each line item is now a two-line block — inputs row + a compact department `<select>` (`.rr-cat`, client `ITEM_CATS` mirrors the GAS `ITEM_CATEGORIES` 16-department enum) pre-selected from Gemini's auto-assignment; `collectReview()` includes `category` per item

### Fixed
- Extracted per-item categories were being dropped on save — the review UI didn't carry them, so `collectReview()` sent items without `category` and `saveReceipt` stored empty strings. The dropdowns now carry the extraction values (edited or not) through to the LineItems tab and the export

### Verified
- `node --check` on all inline scripts; Playwright at 390×844 — three item blocks with departments Produce/Pantry/Beverages set via the real Add-item path, selects render under each row, no horizontal scroll, zero page errors. GAS untouched (v01.06g unchanged — `saveReceipt` already persisted `it.category`)

## [v01.23r] — 2026-08-01 05:28:51 AM EST

> **Prompt:** "I tested all three actions and everything works as intended. Currently, the receipt history shows the receipts based on upload order; Create a checkbox option to show the receipts chronologically based on the receipt dates instead of upload order. Also, reformat the default "Receipt ID"s to "Store_Name-YYYYMMDD"; Update the existing receipts' IDs to match. Also, currently, the status (uploading, extracting, saved, etc) window is to the right of the "History" button; Move the status window below the "Scan Receipt" and "History" buttons and add a progress bar that makes sense for this application. Also, when extracting, record the store address as well. Also, in the exported excel spreadsheet tab "LineItems", make it easy to distinguish and switch between the different receipts. After executing the above, continue with Phase 5: automatic spending categories (assigned during extraction), a monthly-summary tab, duplicate-receipt detection. Regarding the automatic spending categories, refer to existing apps like ReceiptCamp, Expensify, and Smart Receipts to figure out the best categories to use to cover the entirety of grocery store items."

### Added
- **Readable receipt IDs** (`googleAppsScripts/Receipts/Receipts.gs` v01.06g): `makeReceiptId_()` builds `Store_Name-YYYYMMDD` (sanitized merchant, collision suffix `-2`/`-3`), assigned at save time since merchant/date are unknown at upload; the Drive photo is renamed to match; one-time lazy migration (`migrateReceiptIds_()`, Script-Properties-flag + LockService guarded, triggered from `listReceipts`) renames all existing saved receipts, their LineItems rows, and photos
- **Store address**: added to the Gemini schema, new "Store Address" column (in-place header upgrade for existing sheets), editable field in the review card (`live-site-pages/Receipts.html` v01.07w), shown in history detail (📍) and the export
- **Progress bar + status relocation**: status line moved below the Scan/History buttons; stepped bar tracks Compressing (15) → Uploading (40) → Extracting (70) → Done (100, green) and Saving (85) → Saved (100); cards shifted down (top 128px) to clear the taller panel
- **"Sort by receipt date" checkbox** — server-side sort in `listReceipts` (`sort=date`, newest printed date first, undated rows last)
- **Phase 5a — automatic per-item categories**: `ITEM_CATEGORIES` (16 supermarket departments: Produce, Meat & Seafood, Dairy & Eggs, Bakery, Deli & Prepared, Frozen, Pantry, Snacks & Candy, Beverages, Alcohol, Household, Personal Care, Baby, Pet, Non-Grocery, Other) assigned by Gemini per line item via schema enum; stored in a new LineItems "Category" column, shown in history detail and the export. Reference apps (Expensify/Smart Receipts style) verified via web search to use merchant-level buckets only, so item level uses standard supermarket department taxonomy
- **Phase 5b — Monthly Summary tab**: `rebuildMonthlySummary_()` aggregates saved receipts per month (count, total, per-receipt-category totals), rebuilt on every save/delete and mirrored as a third sheet in the export
- **Phase 5c — duplicate detection**: `saveReceipt` rejects a save matching another saved receipt's merchant+date+total with `{error: 'duplicate', duplicateOf}`; the review card warns and the next Save press sends `force=1` ("save anyway")

### Changed
- **Export LineItems readability**: items grouped per receipt under bold banded header rows (store · date · total) with alternating block colors and blank separators; Receipt ID column retained for filtering; Receipts sheet gains the Store Address column; export response count fixed to actual item rows
- Receipt Pipeline diagram updated with ID assignment, duplicate check, address, summary rebuild, sort and migration steps (pako URL regenerated, decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright at 390×844 and 390×700 — status+progress render below the buttons, review card (with address) no longer overlaps the taller panel, sticky Save still visible; zero page errors

## [v01.22r] — 2026-08-01 04:38:48 AM EST

> **Prompt:** "History works, but I want you to only show "saved" receipts by default. Add a checkbox option to show uploaded but unsaved receipts. Also, give me an option to delete records as well. Meanwhile, continue with Phase 4."

### Added
- **Record deletion** (`googleAppsScripts/Receipts/Receipts.gs` v01.05g, `live-site-pages/Receipts.html` v01.06w): GAS `deleteReceipt` route removes the receipt row + its LineItems rows and trashes the Drive photo (fileId parsed from the stored URL; recoverable ~30 days). Enforces the RBAC `delete` permission when the ACL's roles are configured (empty permission set falls back to session-only gating, matching other write routes). Client-side: per-row 🗑 with a two-tap inline confirmation (arm → "Delete?" → 4s auto-disarm) — no browser `confirm()` per the repo's UI Dialogs rule
- **Receipts Phase 4 — .xlsx export**: GAS `exportReceipts` builds a temp two-sheet spreadsheet (Receipts incl. subtotal/tax/total pulled per-ID, LineItems for the matching IDs), exports it via the Drive endpoint with `ScriptApp.getOAuthToken()`, trashes the temp file (in a `finally`), and returns `{fileName, base64}`; "⬇️ Export .xlsx" button downloads it as a Blob using the current history filters
- "Show unsaved uploads" checkbox in the history filter header

### Changed
- History now defaults to **saved receipts only** — `listReceipts` gained a status filter (`uploaded=1` includes unsaved rows), wired to the checkbox
- Delete + export flows appended to the Receipt Pipeline diagram (pako URL regenerated, decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render at 390×700 — checkbox, export button, idle 🗑 and armed "Delete?" states all visible, no horizontal scroll, zero page errors

## [v01.21r] — 2026-08-01 04:12:06 AM EST

> **Prompt:** "I re-scanned the Trader Joe's receipt and it successfully saved. I then tried a long MegaMart receipt and it also succeeded, but the extraction took close to 10 minutes. Is there any way to speed up this process? Meanwhile, continue with Phase 3."

### Fixed
- **~10-minute extractions** (`googleAppsScripts/Receipts/Receipts.gs` v01.04g): root cause was the fetch transport double-running the work — the POST leg ran the full extraction, Google returned an unparseable error page, and the GET fallback re-ran everything. Three changes: (1) extraction results now cached server-side by fileId (`CacheService`, 10-min TTL) so a second transport leg returns instantly; (2) `gemini-3.6-flash` promoted to primary (faster generation; the observed 503 congestion was on 3.5-flash, now the fallback); (3) retry plan trimmed 4 → 3 attempts to bound worst-case wall time

### Added
- **Receipts Phase 3 — history browser** (`Receipts.gs` v01.04g, `live-site-pages/Receipts.html` v01.05w): GAS `listReceipts` route (merchant substring + date-range filters, newest first, cap 500) and `getReceiptDetail` route (full fields + LineItems rows), both with POST + GET api fallbacks; HTML "🧾 History" button + history card (z-index 7, dvh-sized, sticky filter header) with search/date inputs, receipt list (status ✅/📤, totals), tap-to-expand cached details, and photo links; HTML-escaping helper for all rendered spreadsheet data
- History flows appended to the Receipt Pipeline sequence diagram in `repository-information/diagrams/Receipts-diagram.md` (pako URL regenerated and decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render of the history card with simulated rows + expanded detail at 390×700 (no horizontal scroll, zero page errors)

## [v01.20r] — 2026-08-01 03:51:49 AM EST

> **Prompt:** "it successfully extracted the information, but after scrolling to the bottom, I cannot see nor click "Save Receipt". Resize this UI to make it more user friendly and possible to save receipts." *(screenshot: 12-item extracted receipt, card scrolled to "+ Add item" with the action row cut off below the visible screen)*

### Fixed
- Unreachable Save button on mobile (`live-site-pages/Receipts.html` v01.04w): the review card's `max-height` used `100vh`, which on mobile includes the area behind the browser URL bar — with long item lists the card's bottom edge (action row) landed below the visible screen. Now sized with `100dvh` (dynamic viewport height; `100vh` kept as older-browser fallback) plus extra bottom clearance above the version pills

### Changed
- Save/Discard/Retry row is now a **sticky action bar** pinned to the card's bottom edge (`position: sticky` with background + top border) — always visible and clickable regardless of scroll position; the fields and item list scroll underneath it

### Verified
- Playwright at 390×700 (short viewport simulating browser chrome) with a 12-item receipt: Save button inside the viewport and clickable via `document.elementFromPoint` both before and after scrolling the card's content; zero page errors

## [v01.19r] — 2026-08-01 03:17:05 AM EST

> **Prompt:** "I got the attached error message" *(screenshot: review card open in manual-entry fallback with `Extraction failed (gemini_http_503: This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.)`)*

### Fixed
- Transient Gemini 503 "high demand" failures (`googleAppsScripts/Receipts/Receipts.gs` v01.03g): `extractReceipt` now runs a 4-step retry plan — primary model twice (0s/2s waits), then `GEMINI_FALLBACK_MODEL = "gemini-3.6-flash"` twice (1s/3s waits) — retrying only transient statuses (503/429/500); non-transient errors (bad key, bad request) still fail fast to avoid burning quota

### Added
- "Retry extraction" button in the review card (`live-site-pages/Receipts.html` v01.03w): shown only when extraction fails; re-runs extraction against the already-uploaded Drive file (tracked via new `currentFileId`) and re-populates the card on success — no re-photographing needed

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render of the failed-extraction state at 390×844 (retry button visible, no horizontal scroll, zero page errors)

## [v01.18r] — 2026-08-01 03:07:59 AM EST

> **Prompt:** "The receipt picture was successfully taken and uploaded. Start phase 2."

### Added
- **Receipts Phase 2 — AI extraction + review-before-save** (`googleAppsScripts/Receipts/Receipts.gs` v01.02g, `live-site-pages/Receipts.html` v01.02w):
- GAS `extractReceipt` route (POST + GET api fallback; session-validated): reads the uploaded photo back from Drive by fileId and calls Gemini `generateContent` (`GEMINI_MODEL = "gemini-3.5-flash"`, key from Script Properties `GEMINI_API_KEY`) with a strict `responseSchema` returning merchant, date, currency, subtotal, tax, total, category (9-option enum), and lineItems[]; temperature 0; robust error mapping (`gemini_key_missing`, `gemini_http_*`, `gemini_parse_failed`)
- GAS `saveReceipt` route (body-POST only — reviewed JSON can exceed GET URL limits): fills the receipt's row by Receipt ID (date/merchant/currency/subtotal/tax/total/category), sets status `saved`, stores the raw extraction JSON for audit, and replaces the receipt's LineItems rows idempotently
- HTML review card (`#receipt-review-card`, z-index 6 — under the overlay walls like the scan panel): auto-opens pre-filled after extraction with editable fields + category dropdown + line-items grid (add/remove rows), Save/Discard actions; opens empty for manual entry when extraction fails; `uploadReceipt` now returns `fileId` to feed extraction
- New "Receipt Pipeline" sequence diagram section in `repository-information/diagrams/Receipts-diagram.md` (upload → extract → review → save; pako URL generated and decompression-verified)

### Verified
- Gemini model names verified against current documentation via web search (gemini-3.5-flash / gemini-3.6-flash, free tier); `node --check` on the `.gs` and all inline scripts; Playwright render of the populated review card at 390×844 and 1280×800 (no horizontal scroll, zero page errors)

## [v01.17r] — 2026-08-01 02:26:53 AM EST

> **Prompt:** "I approve the plan to PWA-ify the web app. I have also granted Receipts ACL permission to "jonyang92@gmail.com" and confirmed that the live page loads. LightAISolution's Drive folder ID is "1DHfXwzo0qXI_2H0Q2dDLKGn7EOtguI0A"."

### Added
- **Receipts Phase 1 upload pipeline** (`live-site-pages/Receipts.html` v01.01w, `googleAppsScripts/Receipts/Receipts.gs` v01.01g): "📷 Scan receipt" panel in the page PROJECT blocks — camera-direct capture on phones (`capture="environment"`), file picker on desktop, client-side canvas compression (max 1600px JPEG q0.82, EXIF-orientation-aware via `createImageBitmap`), thumbnail + status feedback. New `_gasPostBody()` transport variant sends the base64 image in a form-encoded POST body with 3-attempt retry (the template's `_gasPost` carries params in the URL — impossible at image sizes; no GET fallback exists for the same reason)
- GAS side: `uploadReceipt` route (`doPost action=uploadReceipt`, session-validated via `validateSessionForData`) decodes and saves the photo to the configured Drive folder and appends an "uploaded" row to the `Receipts` tab; idempotent `ensureReceiptTabs_()` bootstraps the `Receipts` + `LineItems` tabs (frozen headers) on first write — Phase 2's extraction will fill the remaining columns
- **PWA install support**: new `live-site-pages/receipts.webmanifest` + generated app icons (`images/receipts-icon-192.png`, `receipts-icon-512.png`, maskable) + manifest/theme-color/apple-touch head tags in `Receipts.html`; CSP `manifest-src` relaxed `'none'` → `'self'` in both CSP tags, marked with a `PROJECT OVERRIDE` comment
- `DRIVE_FOLDER_ID` added to `Receipts.config.json` and mirrored in `Receipts.gs` (config sync per [PC-GAS-CONFIG] #14)

### Verified
- `node --check` passes on the full `.gs` and every inline HTML script block; Playwright render checks at 390×844 and 1280×800 — panel centered with no horizontal scroll, zero page errors

## [v01.16r] — 2026-08-01 01:40:25 AM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push. `bash scripts/setup-gas-project.sh <<'CONFIG' { "PROJECT_ENVIRONMENT_NAME": "Receipts", "TITLE": "Receipts", "DEPLOYMENT_ID": "AKfycbwASoUFzqdy3Bb-NbsbG6Hh3-9fPz1aGJGi8AbUsBV0YBu85ockXXdWkLKB8kEtivrb", "SPREADSHEET_ID": "1SfVRsHm6pUn1bq633BSKiQ8c3IsQeVAs7H0265ckdDM", "SHEET_NAME": "Live_Sheet", "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "INCLUDE_AUTH": true, "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com", "AUTH_PRESET": "hipaa", "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE", "ACL_SHEET_NAME": "Access" } CONFIG`"

### Added
- New auth GAS project **Receipts** (HIPAA preset) created via `scripts/setup-gas-project.sh` — 10 files: `live-site-pages/Receipts.html` (v01.00w), `googleAppsScripts/Receipts/Receipts.gs` (v01.00g), `Receipts.config.json`, html/gs version files, page + GAS changelogs with archives, and per-environment diagram `repository-information/diagrams/Receipts-diagram.md`
- Registered across the repo: GAS Projects table (`.claude/rules/gas-scripts.md`), README structure tree (page entry with version links + all subtree entries), REPO-ARCHITECTURE.md (RECEIPTS_PAGE + GAS_RECEIPTS nodes and template-source/iframe/serves/deploy/polling edges), and a `Deploy Receipts` webhook step in `.github/workflows/auto-merge-claude.yml`
- Live config wired in at creation: real deployment ID (obfuscated `_e` URL in the page verified against expected encoding), data spreadsheet (`Live_Sheet`), and real Master ACL spreadsheet ID in both `.gs` and `.config.json` — Global ACL Access-tab self-registration active on first page load

### Changed
- Regenerated the Flowchart and Class Diagram mermaid.live pako URLs in `repository-information/REPO-ARCHITECTURE.md` (both went stale when the setup script added the Receipts nodes) — decompression-verified, including the new `Receipts-diagram.md` link

## [v01.15r] — 2026-07-18 03:15:05 AM EST

> **Prompt:** "Create a 5 second animation of Spain vs Argentina in the 2026 world cup and show it on repeat."

### Added
- New standalone page `live-site-pages/spain-argentina.html` (v01.00w), created from `HtmlAndGasTemplateAutoUpdate-noauth.html.txt`: a pure-CSS 5-second Spain vs Argentina World Cup 2026 match animation that loops infinitely (`animation: … 5s … infinite`). PROJECT blocks contain a scoreboard (🇪🇸 ESP 0–0 ARG 🇦🇷), a striped pitch with halfway line/centre circle/boxes/goals, three Spain players (red/yellow), three Argentina players (albiceleste stripes incl. a diving keeper), a ⚽ ball that passes through midfield and finishes in Argentina's net, and a "GOAL!" flash at ~80% of the loop. No JavaScript added — the JS PROJECT block stays empty (animation is CSS-only); no GAS project
- New tracking files: `html-versions/spain-argentinahtml.version.txt` (`|v01.00w|`), `html-changelogs/spain-argentinahtml.changelog.md` + `spain-argentinahtml.changelog-archive.md`
- Registered the page in the README tree (Standalone Utilities group + html-versions/html-changelogs subtrees) and in REPO-ARCHITECTURE.md's flowchart (SPAINARG_PAGE node + serves/version-polling/template-copy edges; pako URL regenerated and decompression-verified)
- Verified via Playwright at two loop timestamps (~1.8s mid-play, ~4.2s GOAL flash); fixed an invalid `font:` shorthand (`inherit` family) found during the check by switching to explicit font-size/weight properties

## [v01.14r] — 2026-07-18 02:39:24 AM EST

> **Prompt:** "In my Scraper project, remove the text box + submit button."

### Removed
- Scraper text-submission UI (`live-site-pages/Scraper.html` v01.04w): removed the text box + Submit button panel — the PROJECT-block CSS (`#text-submit-panel` and related rules), the panel markup, and the submit wiring JS (fetch `submitText` call, Enter-to-submit, inline status feedback). PROJECT START/END markers left in place (empty) for future page content. The GAS-side `submitText` route in `googleAppsScripts/Scraper/Scraper.gs` is intentionally retained unchanged (now unused) — removal not requested
- Verified via Playwright render check: page renders cleanly with no leftover panel or layout artifacts (the 5 pre-existing `file://` CSP logo-image refusals reproduce identically on the unmodified page)

## [v01.13r] — 2026-07-18 12:05:25 AM EST

> **Prompt:** "In the Scraper project, create a text box with a submit button. When the user clicks submit, copy whatever they wrote in the text box into the spreadsheet."

### Added
- Scraper text submission feature (`live-site-pages/Scraper.html` v01.03w, `googleAppsScripts/Scraper/Scraper.gs` v01.04g): a top-center panel with a text box + Submit button in the page's PROJECT blocks (hidden behind the auth wall until sign-in; z-index 5 — above the GAS iframe, below all overlay walls). Submission goes over the iframe-free fetch transport to a new `PROJECT:`-marked `doPost action=submitText` route (with GET `api op=submitText` fallback) → `submitText()` in the PROJECT block, which validates the session via `validateSessionForData`, trims/caps input at 5000 chars, and appends `[timestamp, user email, text]` to `Live_Sheet` in the configured spreadsheet. Inline status feedback (Saving… / Saved ✓ / error), Enter-to-submit, button disabled while in flight
- Verified: GAS + HTML JS syntax parse, Playwright render check with simulated signed-in state (panel positioned correctly, no overlap with pills/overlays)

## [v01.12r] — 2026-07-17 11:45:41 PM EST

> **Prompt:** "I was able to pass the "Connect to server" issue from earlier, but i still cannot sign in. See attached screenshot."

### Fixed
- Embedded app screen blocked after successful fetch sign-in (Google Drive "Sorry, unable to open the file" inside the iframe + `action=securityEvent` 404 spam — the multi-account `/u/N` routing 404 hitting the remaining iframe loads): the `#gas-app` iframe and the hidden securityEvent frames are now created **credentialless** in `live-site-pages/MasterACL.html`, `Scraper.html`, `globalacl.html` (all v01.02w) and the auth HTML template — cookie-less iframes get Google's anonymous serving path (the same path verified working via server probes), while the session continues to travel in the `?session=` URL. Browsers without `credentialless` support ignore the attribute (prior behavior preserved). Flagged as a documented inference: anonymous serving, cookie removal, and anonymous GAS usage are each verified, but the combination inside a credentialless iframe is untested until the owner confirms in-browser

## [v01.11r] — 2026-07-17 10:05:56 PM EST

> **Prompt:** "Do the fetch conversion (your recommendation) AND address this: "The root-cause template defect (setup script generates `standard`-preset GAS against a hipaa-built HTML template) still awaits a permanent fix so future projects are born working" (your heads-up)."

### Added
- **Iframe-free `fetch` sign-in transport** ported from the `testauthgas1` scaffold into `live-site-pages/MasterACL.html` (v01.01w), `Scraper.html` (v01.01w), and `globalacl.html` (v01.01w): new `_gasPost()` (POST with GET `action=api` fallback), `exchangeViaFetch()`, `_mapExchangeError()`, `_completeSignInFetch()` (transport-verified direct show — no `gas-auth-ok` gate), plus fetch branches in `sendHeartbeat()`, the sign-out flow, and the page-load session restore (heartbeat-validated). `HTML_CONFIG.TOKEN_EXCHANGE_METHOD` → `'fetch'`. Cookie-less fetch always reaches Google's anonymous serving path, making the auth machinery immune to the blocked framed `/exec` responses (multi-account `/u/N` 404s, X-Frame-Options) that killed iframe sign-in in the owner's normal browser
- GAS routes for the transport in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.07g), `Scraper.gs` (v01.03g), `globalacl.gs` (v01.01g): `doPost action=exchangeToken` (with `ensureScriptProperties_()` bootstrap) and `action=signOut`, plus a general `doGet action=api` GET fallback (`exchangeToken`/`signOut`/`heartbeat` ops)

### Changed
- **Permanent template fix**: the same conversion applied to `live-site-pages/templates/HtmlAndGasTemplateAutoUpdate-auth.html.txt` and `gas-minimal-auth-template-code.js.txt` — future auth projects are born with the fetch transport, which no longer depends on the GAS preset's `TOKEN_EXCHANGE_METHOD`, dissolving the standard-vs-hipaa exchange mismatch permanently
- Template propagation note: `testauthgas1` (already the fetch reference) and `testauthhtml1` (intentionally the postMessage test scaffold) were left unchanged; the latent `processDataPoll` dead-route in the GAS template generation was left as-is (not referenced by the new routes)

### Verified
- Full-file JS syntax parse on all 4 GAS files and all inline script blocks of the 4 HTML files; Playwright `file://` smoke test on the 3 converted pages (only known file-protocol restrictions logged, zero code errors)

## [v01.10r] — 2026-07-17 09:22:12 PM EST

> **Prompt:** "@"/root/.claude/uploads/07152af2-7240-5bfb-8986-2eaa697523c9/af91e797-globalacl_working_sample_v01.89g.txt" See attached .txt file for a successful example. Compare this with my GAS code and update mine as needed to resolve my sign-in problem for "jonyang92@gmail.com". This example is being used for a different company, so scrub out anything specific and give me a working skeleton that can be applied to my GAS code."

### Changed
- Compared the uploaded working sample (globalacl v01.89g, other org) against our GAS code after scrubbing org-specific values: function inventories and the entire sign-in path are identical — the only functional configuration difference is that the working org runs `ACTIVE_PRESET: 'hipaa'`. Aligned `googleAppsScripts/MasterACL/MasterACL.gs` (v01.06g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.02g) to that proven skeleton: `ACTIVE_PRESET` → `'hipaa'`, `PROJECT_OVERRIDES` made byte-identical to the sample (`ENABLE_DOMAIN_RESTRICTION: false`, `ALLOWED_DOMAINS: []`, `SESSION_EXPIRATION: 7200`), removing the now-redundant `TOKEN_EXCHANGE_METHOD` override (hipaa's default is `postMessage`). The embedding HTML's own comments ("must match GAS PRESETS.hipaa...") confirm the auth HTML template was written for the hipaa preset — the setup script generating `standard`-preset GAS against it is the template defect. Session durations verified in sync both sides (7200/28800). The sample's `PROJECT:` doPost signOut wrapper was not ported (workspace-specific, unrelated to sign-in). Note: the browser-side multi-account `/exec` 404 (Google issue) remains — single-account session still required

## [v01.09r] — 2026-07-17 08:36:54 PM EST

> **Prompt:** "I still cannot sign in as "jonyang92@gmail.com". Fix the problem."

### Fixed
- Sign-in timeout ("The sign-in service isn't responding") on MasterACL and Scraper: the auth HTML template hardcodes `TOKEN_EXCHANGE_METHOD: 'postMessage'`, but the GAS `standard` preset resolves it to `'url'` — the served shell had no postMessage token listener, so the OAuth token exchange never completed and the 25s reachability watchdog fired. Confirmed by probing the live `/exec` deployment (healthy, serving current code, correct `gas-needs-auth` handshake — ruling out deployment/OAuth-access causes). Fix: `TOKEN_EXCHANGE_METHOD: 'postMessage'` added to `PROJECT_OVERRIDES` in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.05g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.01g) — the combination the working hipaa-preset projects (Globalacl, test pages) already use. Latent template defect noted: every future `standard`-preset auth project inherits this mismatch until the GAS template or setup script aligns the two sides

## [v01.08r] — 2026-07-17 08:10:18 PM EST

> **Prompt:** "The first screenshot is the error message I get when I try to sign in with "jonyang92@gmail.com" and the second screenshot is an example of a successful Master ACL sheet. Modify the "grantUserAccess" function to resolve the first problem and modify my Master ACL sheet to look like the second screenshot."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.04g): `grantUserAccess()` reworked into a three-phase utility. Phase 1 (STRUCTURE) verifies/repairs the Master ACL spreadsheet to match the reference layout — creates the Access tab if missing, writes `Email`/`Role` headers, adds the `#NAME`/`#URL`/`#AUTH`/`#ICON`/`#DESC` metadata rows via `ensureMetadataRows`, creates a `Roles` tab with the default permission matrix (new `ensureRolesTab_` helper, checkboxes included), and registers this project's page column. Phase 2 (GRANT) unchanged — default admin grants for the two owner emails. Phase 3 (WEB APP PROBE) initializes required Script Properties then fetches the project's own `/exec` URL and logs a precise verdict — the page's "sign-in service isn't responding" watchdog fires when the deployment doesn't serve the app, so the probe distinguishes healthy / access-not-Anyone / stale-or-empty-deployment (with click-by-click fix instructions)

## [v01.07r] — 2026-07-17 07:47:16 PM EST

> **Prompt:** "GAS is telling me: "No emails specified. Set Script Properties key "GRANT_ACCESS_EMAILS" (single email or comma-separated list), optionally "GRANT_ACCESS_ROLE", then Run again." Make it so I don't have to do this. Add "jonyang92@gmail.com" and "lightaisolution@gmail.com"."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.03g): `grantUserAccess()` no longer requires Script Properties — when `GRANT_ACCESS_EMAILS` is unset it falls back to built-in defaults `DEFAULT_GRANT_EMAILS` (`jonyang92@gmail.com`, `lightaisolution@gmail.com`) with `DEFAULT_GRANT_ROLE` (`admin`). Script Properties still override the defaults when set, for granting other users/roles

## [v01.06r] — 2026-07-17 07:42:23 PM EST

> **Prompt:** "No one has permissions to access these projects right now. Make a function that I can run that allows new users to get permission."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.02g): new `grantUserAccess()` admin utility in the PROJECT block — run from the Apps Script editor with Script Properties `GRANT_ACCESS_EMAILS` (single or comma-separated) and optional `GRANT_ACCESS_ROLE` (default `viewer`). Appends Access-tab rows for new users (role + TRUE for every page column, with checkboxes), re-enables all page columns for existing rows (role updated only when explicitly set), validates the role against the known role list with a warning, and bumps the access-cache epoch so grants take effect immediately. One run grants access to every registered project since all auth projects share the central Master ACL spreadsheet

## [v01.05r] — 2026-07-17 07:37:12 PM EST

> **Prompt:** "I can't sign into my MasterACL project with my personal email (jonyang92@gmail.com) because permissions are not set by my work email (lightaisolution@gmail.com). Autocreate the admin permissions for my personal email."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.01g): new `PROJECT OVERRIDE` block with `SEED_ADMIN_EMAILS` (`jonyang92@gmail.com`) and an idempotent `ensureSeedAdmins()` called from `doGet` — appends an `admin`-role row with all page columns TRUE to the Access tab when the email is missing, bumps the access-cache epoch so cached denials clear immediately, and never touches existing rows (manual spreadsheet edits always win). Runs server-side as the deployment owner, so it works even though the visiting user has no spreadsheet access

## [v01.04r] — 2026-07-17 07:18:01 PM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "Scraper",
>   "TITLE": "News Scraper",
>   "DEPLOYMENT_ID": "AKfycby8nOR0AqLsDlZPcrTX9dWIInY48R9Jrl8oBDtN5t0emC06j7iwidEMdXttrD1zXnjUIg",
>   "SPREADSHEET_ID": "19U0Wu25eUXEHPVz4VWjKQIpnRozgFycNSjFCTB-umkk",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **Scraper** (News Scraper — auth-enabled, `standard` preset) created via `scripts/setup-gas-project.sh`: `live-site-pages/Scraper.html` (v01.00w), `googleAppsScripts/Scraper/Scraper.gs` (v01.00g), `Scraper.config.json` with real deployment/spreadsheet IDs and Master ACL registration, version files, page/GAS changelogs + archives, and `repository-information/diagrams/Scraper-diagram.md` (with verified mermaid.live link)
- `Deploy Scraper` webhook step added to `.github/workflows/auto-merge-claude.yml`; Scraper registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges — all script-generated with no manual repair needed (v01.03r script fixes verified in production)

### Changed
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to include the new Scraper nodes (verified by decompression)

## [v01.03r] — 2026-07-17 07:11:12 PM EST

> **Prompt:** "fix the setup script defects"

### Fixed
- `scripts/setup-gas-project.sh` Phase 6: the GAS Projects registration row was appended after the last `|`-prefixed line in the whole file (landing in the coding-guidelines pointer table) — now anchors on the `| Project | Code File |` header and inserts after the last contiguous row of that table
- `scripts/setup-gas-project.sh` Phase 9: the workflow deploy step anchored on a `# ── AHK VERSION FILE UPDATE ──` banner comment that no longer exists, silently skipping the insert — now anchors on the stable `- name: Update AHK version files` step name
- `scripts/setup-gas-project.sh` Phase 5b: generated per-environment diagrams lacked the mandatory "Open in mermaid.live" link — the script now generates the pako URL via `python3` (zlib is pako-compatible) with round-trip verification and a warning fallback when Python is unavailable
- All three fixes verified end-to-end against a throwaway repo copy (row placement, workflow step position, link decompression)

## [v01.02r] — 2026-07-17 06:55:07 PM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "MasterACL",
>   "TITLE": "MasterACL",
>   "DEPLOYMENT_ID": "AKfycbxgxErSg_DfV7WjVvDQ4_LVkFAkON-86iJaNhQ3k50Hs-WbQ2KLskfRtnzSVlZNIHhc8Q",
>   "SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "IS_MASTER_ACL": true,
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **MasterACL** (auth-enabled, `standard` preset, flagged as the Master ACL project) created via `scripts/setup-gas-project.sh`: `live-site-pages/MasterACL.html` (v01.00w), `googleAppsScripts/MasterACL/MasterACL.gs` (v01.00g), `MasterACL.config.json` with real deployment/spreadsheet IDs, version files, page/GAS changelogs + archives, and `repository-information/diagrams/MasterACL-diagram.md`
- `Deploy MasterACL` webhook step added to `.github/workflows/auto-merge-claude.yml` (the setup script announced this step but never wrote it — added manually, mirroring the Globalacl step)
- MasterACL registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges

### Fixed
- Setup script defect: the GAS Projects table row was inserted into the coding-guidelines pointer table in `.claude/rules/gas-scripts.md` — moved to the actual GAS Projects table
- Added the missing "Open in mermaid.live" link to `MasterACL-diagram.md` and regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (both verified by decompression)

## [v01.01r] — 2026-07-13 08:28:42 PM EST

> **Prompt:** "continue with your recommendation"

### Changed
- Initialized repository identity: internal links, branding URLs, and live-site references updated from the template's `lightaisolutions` repo name to `Sales` across README.md, CITATION.cff, issue template config, REPO-ARCHITECTURE.md, index.html, sitemap.xml, and robots.txt (`bash scripts/init-repo.sh LightAISolutions Sales ShadowAISolutions` + manual follow-ups; developer branding `ShadowAISolutions` preserved)
- GAS Project Creator page defaults now point to this repository — GitHub Repo field prefills `Sales` and the three logo URL fields prefill `https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg` (v01.01w)
- Regenerated `repository-information/readme-qr-code.png` to encode this repository's URL (`https://github.com/LightAISolutions/Sales`)
- Updated CLAUDE.md Template Variables table: `YOUR_REPO_NAME` → `Sales`

### Fixed
- Corrected GitHub Pages hostnames mangled by the init script's global replace — the template's org and repo share the same lowercase string, so `lightaisolutions.github.io` became `Sales.github.io` in CITATION.cff, README.md, and REPO-ARCHITECTURE.md; restored to `lightaisolutions.github.io` (paths correctly remain `/Sales/`)
- Removed the duplicate `main` push-trigger entry the init script inserted into `.github/workflows/auto-merge-claude.yml` (this copy already had `main` in the trigger)
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (verified decompression)

Developed by: ShadowAISolutions
