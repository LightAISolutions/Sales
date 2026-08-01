# Changelog — Receipts (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Receiptsgs.changelog-archive.md](Receiptsgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 10/50`

## [Unreleased]

*(No changes yet)*

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
