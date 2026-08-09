# Changelog — Receipts (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Receiptsgs.changelog-archive.md](Receiptsgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 20/50`

## [Unreleased]

*(No changes yet)*

## [v01.20g] — 2026-08-08 09:31:15 PM EST — v02.01r

### Added
- Every saved receipt now records whether it's a Personal or Reimbursement expense — history, reports, and spreadsheet exports can all filter by it, and older receipts count as Personal automatically

## [v01.19g] — 2026-08-08 08:11:03 PM EST — v01.99r

### Added
- A diagnostic tool the administrator can run to pinpoint exactly why a sign-in is being denied, so access problems can be found and fixed quickly

## [v01.18g] — 2026-08-05 10:26:18 PM EST — v01.82r

### Added
- Export previews — the app can now show you your export's Summary table before the file is built, and what you preview is exactly what gets exported

### Changed
- Smarter document reading — commercial invoices (supplier and wholesaler bills) are now recognized alongside regular receipts: the vendor, invoice date, and grand total are picked up correctly, case quantities and per-case prices are understood, and deposits, freight, and discounts are captured as their own line items
- Invoice purchases are automatically filed under a new "Business" category with fitting subcategories

## [v01.17g] — 2026-08-05 10:12:22 PM EST — v01.81r

### Added
- Spreadsheet exports can now include a customizable Summary table — its rows, columns, and numbers follow your choices in the new Export designer, and only the detail sheets you keep selected are included

### Fixed
- Fixed an issue where exports could fail whenever monthly summary data was present

## [v01.16g] — 2026-08-02 04:46:01 AM EST — v01.43r

### Added
- Combined view support — your receipts and those shared with you can now be listed, reported, and exported together, with each receipt labeled by its owner

### Changed
- When someone has given you full editing access to their receipts, you can now also delete those receipts — households can fully manage each other's scans

## [v01.15g] — 2026-08-02 12:31:41 AM EST — v01.41r

### Changed
- The admin menu button is now a bright blue ADMIN button that stands out clearly next to the status pills — it was easy to mistake for another status indicator after its recent move

## [v01.14g] — 2026-08-01 11:34:35 PM EST — v01.37r

### Fixed
- The admin menu button is now fully clickable — it sits next to the status pills instead of hidden behind the signed-in email, and its menu opens on the first tap

## [v01.13g] — 2026-08-01 09:57:44 PM EST — v01.36r

### Added
- Support for moving your older receipt photos into your own Google Drive, and smarter receipt reading that now picks subcategories matched to each receipt's category

## [v01.12g] — 2026-08-01 08:11:26 PM EST — v01.35r

### Changed
- Receipt reading no longer needs the photo to pass through shared storage — the app reads it directly, and your photo goes straight to your own Google Drive

## [v01.11g] — 2026-08-01 07:51:32 PM EST — v01.34r

### Added
- Receipt sharing between users — grants are checked on every request, so shared access works exactly as the owner set it (view only, or view & edit); deleting always stays with the owner

## [v01.10g] — 2026-08-01 07:38:37 PM EST — v01.33r

### Changed
- Your receipts are now private to your account — each signed-in user sees and manages only their own receipts, history, reports, and exports

## [v01.09g] — 2026-08-01 05:18:59 PM EST — v01.28r

### Added
- New reporting data feed that powers the Reports view and the home-screen month summary

## [v01.08g] — 2026-08-01 06:51:35 AM EST — v01.27r

### Added
- The receipt history and spreadsheet exports can now be filtered by spending category

## [v01.07g] — 2026-08-01 06:25:29 AM EST — v01.25r

### Added
- Access to the receipt photos folder now stays in sync with the app's access list — anyone granted access to the Receipts app can automatically view the photos, and removed users lose photo access too

### Changed
- Store names are now standardized automatically (Trader Joe's instead of TRADER JOE'S) — existing receipts, their IDs, and photo names were updated to match

## [v01.06g] — 2026-08-01 05:28:51 AM EST — v01.23r

### Added
- Receipt IDs are now readable — Store_Name-YYYYMMDD — and existing receipts (and their photos) were renamed automatically to match
- The store address is read from each receipt and saved alongside the other details
- Every purchased item is automatically assigned a department category (Produce, Meat & Seafood, Dairy & Eggs, Bakery, Frozen, Pantry, Snacks & Candy, Beverages, Household, Personal Care, and more)
- New "Monthly Summary" tab in the spreadsheet — per-month totals, receipt counts, and spending by category, kept up to date automatically and included in exports
- Saving a receipt that matches an already-saved one (same store, date, total) is flagged as a possible duplicate before anything is written

### Changed
- In the exported spreadsheet, items are now grouped under a highlighted header row per receipt with alternating colors, making it easy to tell receipts apart
- History can be sorted by the receipt's printed date instead of scan order

## [v01.05g] — 2026-08-01 04:38:48 AM EST — v01.22r

### Added
- Receipts can now be exported as a downloadable spreadsheet file with separate sheets for receipts and their individual items
- Receipt records can now be deleted — the record, its items, and its photo (moved to trash, recoverable) are all cleaned up together, with permission checks applied

### Changed
- The history list now returns only saved receipts unless unsaved uploads are explicitly requested

## [v01.04g] — 2026-08-01 04:12:06 AM EST — v01.21r

### Added
- Receipt history: past receipts can now be listed with search and date filters, and each receipt's full details and items can be retrieved

### Changed
- Automatic receipt reading is significantly faster: results are remembered briefly so retries never redo the work, the quicker reader is now used first, and fewer attempts are made before reporting a problem

## [v01.03g] — 2026-08-01 03:17:05 AM EST — v01.19r

### Changed
- Automatic receipt reading now retries on its own when the reading service is briefly busy, and switches to a backup reader if needed — temporary "high demand" errors should mostly resolve themselves

## [v01.02g] — 2026-08-01 03:07:59 AM EST — v01.18r

### Added
- Receipt photos are now read automatically using AI to pull out the merchant, date, totals, tax, and each purchased item
- Confirmed receipt details are saved into organized spreadsheet columns, with individual items stored separately for easy analysis
- Saving the same receipt again cleanly replaces its earlier details instead of duplicating them

## [v01.01g] — 2026-08-01 02:26:53 AM EST — v01.17r

### Added
- Uploaded receipt photos are now saved securely to a Google Drive folder
- Every upload is recorded in the receipts spreadsheet, ready for future browsing and analysis

Developed by: ShadowAISolutions
