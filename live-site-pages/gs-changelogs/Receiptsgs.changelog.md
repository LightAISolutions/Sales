# Changelog — Receipts (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Receiptsgs.changelog-archive.md](Receiptsgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 3/50`

## [Unreleased]

*(No changes yet)*

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
