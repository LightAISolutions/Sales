# Changelog — Receipts

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Receiptshtml.changelog-archive.md](Receiptshtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 12/50`

## [Unreleased]

*(No changes yet)*

## [v01.12w] — 2026-08-01 05:53:12 PM EST — v01.29r

### Added
- "By department" breakdown in Reports — appears when the category filter is set to Groceries, showing where the grocery money went (Produce, Dairy, Meat, …)
- Circle graphs option in Reports — a checkbox switches every group to a donut chart with percentage comparisons
- Report groups are now collapsible — everything starts minimized; tap the "+" on the right of a group to expand it

### Changed
- Friendlier report period labels — days show as "Wed, 7/29/26", weeks as "7/26/26 - 8/1/26" (Sunday through Saturday), months as "July 2026", and half-years as "First Half of 2026" / "Second Half of 2026"

## [v01.11w] — 2026-08-01 05:18:59 PM EST — v01.28r

### Added
- Upload receipts — pick up to 15 photos from your gallery at once; they're read one after another and then reviewed one at a time, with a "n of N" counter
- Reports — daily, weekly, monthly, bi-annual, and annual spending totals with instant filtering by store, category, department, date range, and cost range, plus category and top-merchant breakdowns
- Edit saved receipts from History — fix any detail or remove line items without deleting and re-uploading
- Month-at-a-glance summary on the home screen showing this month's spend, receipt count, and top categories

### Changed
- Fresh new look — warm paper-and-ink design with a printed-receipt style summary card
- The idle status line now cycles through encouraging messages

## [v01.10w] — 2026-08-01 06:51:35 AM EST — v01.27r

### Added
- Category dropdown in History — narrow the list (and spreadsheet exports) to Groceries, Dining, Transport, Health, Shopping, Entertainment, Utilities, Travel, or Other

### Changed
- History filters reorganized: the merchant search sits on its own row, with labeled "Start Date" and "End Date" boxes side-by-side beneath it

## [v01.09w] — 2026-08-01 06:36:33 AM EST — v01.26r

### Removed
- The "Show unsaved uploads" checkbox in History — the history list and exports now always show saved receipts only

## [v01.08w] — 2026-08-01 06:06:54 AM EST — v01.24r

### Added
- Each item in the review screen now has its own department dropdown (Produce, Dairy & Eggs, Snacks & Candy, and 13 more) — pre-filled automatically from the photo and adjustable before saving

### Fixed
- Department assignments read from the photo are now correctly kept when saving — previously they could be lost during review

## [v01.07w] — 2026-08-01 05:28:51 AM EST — v01.23r

### Added
- Progress bar under the buttons showing each step of the scan (compressing → uploading → reading → done, and saving)
- "Sort by receipt date" checkbox in History — orders receipts by the date printed on them instead of when they were scanned
- Store address field in the review screen (read automatically from the photo, editable before saving) and shown in receipt details
- Duplicate protection: saving a receipt that matches an already-saved one (same store, date, and total) asks for confirmation before saving again
- Each item now shows its department category (Produce, Dairy & Eggs, Snacks, and more) in receipt details

### Changed
- Status messages moved below the Scan and History buttons for a cleaner layout

## [v01.06w] — 2026-08-01 04:38:48 AM EST — v01.22r

### Added
- New "⬇️ Export .xlsx" button in History — downloads a spreadsheet file with two organized sheets (receipts + individual items), respecting your current search and date filters
- Receipts can now be deleted from History — tap 🗑, then tap "Delete?" to confirm (the photo moves to the Drive trash, recoverable for about 30 days)
- New "Show unsaved uploads" checkbox in History

### Changed
- History now shows only saved receipts by default — unsaved uploads appear only when the checkbox is ticked

## [v01.05w] — 2026-08-01 04:12:06 AM EST — v01.21r

### Added
- New "🧾 History" button — browse all past receipts with search by store name and date-range filters
- Tap any receipt in the list to see its full details: amounts, category, every line item, and a link to the original photo

## [v01.04w] — 2026-08-01 03:51:49 AM EST — v01.20r

### Fixed
- "Save receipt" and "Discard" are now always visible at the bottom of the review screen — on phones with long receipts they could previously be cut off below the screen and unreachable

### Changed
- The review screen now sizes itself to the phone's actual visible screen area, and the item list scrolls behind the always-visible button bar

## [v01.03w] — 2026-08-01 03:17:05 AM EST — v01.19r

### Added
- New "Retry extraction" button appears when automatic reading fails — retries on the photo already uploaded, no need to re-take it

### Changed
- Clearer guidance when automatic reading fails, including when the service is briefly busy

## [v01.02w] — 2026-08-01 03:07:59 AM EST — v01.18r

### Added
- After scanning, receipt details are now read automatically from the photo — merchant, date, amounts, and individual items appear in a review screen
- New review screen lets you check and correct every detail (including adding or removing line items) before anything is saved
- A category can be picked for each receipt (Groceries, Dining, Transport, and more) to make spending analysis easier
- If automatic reading fails, the review screen opens blank so details can be entered by hand

## [v01.01w] — 2026-08-01 02:26:53 AM EST — v01.17r

### Added
- New "📷 Scan receipt" button — photograph a receipt with your phone camera (or pick an image file on a computer) and it uploads automatically after you sign in
- Photos are compressed on your device before uploading, so saving is fast even on mobile data
- The app can now be installed to your phone's home screen and launched full-screen like a regular app (use your browser's "Add to Home Screen")

Developed by: ShadowAISolutions
