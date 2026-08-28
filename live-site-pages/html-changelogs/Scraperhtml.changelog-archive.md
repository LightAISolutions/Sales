# Changelog Archive — News Scraper

Older version sections rotated from [Scraperhtml.changelog.md](Scraperhtml.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

## [v01.15w] — 2026-08-03 11:57:41 PM EST — v01.61r — [1f497f8](https://github.com/LightAISolutions/Sales/commit/1f497f8b8a954079dbb757bb192e0037d1e3695f)

### Added
- New "Rating status" window appears beside the article list while you rate — it shows each step of saving a rating live (tap registered, send attempts, retries, waits, saved) with elapsed times, so you can see exactly where a slow save is spending its time. Close it anytime with ×; it reappears on your next rating

## [v01.14w] — 2026-08-03 11:33:05 PM EST — v01.60r — [3ef1ffb](https://github.com/LightAISolutions/Sales/commit/3ef1ffbe02df26d21cef67586e5de9331465a5c4)

### Added
- After analysis, a message now confirms when your ratings have been distilled into updated preferences (e.g. "🧠 Preferences updated from your 12 ratings")

## [v01.13w] — 2026-08-03 11:21:17 PM EST — v01.59r — [b3941f4](https://github.com/LightAISolutions/Sales/commit/b3941f4755f44da0f0664ba6f47cd2445a3b7ef6)

### Fixed
- Rating an article right after a server update could silently fail (the button reset to default) — ratings now retry automatically and show a clear "server is finishing an update" message if the server still isn't ready

## [v01.12w] — 2026-08-03 10:06:55 PM EST — v01.58r — [2ec7564](https://github.com/LightAISolutions/Sales/commit/2ec7564081c7665ecb67cdc6287f952f6f7ed4bf)

### Added
- 👍/👎 buttons on every article let you rate relevance — your ratings teach the scoring to match your preferences on future analysis runs (tap again to clear a rating)

### Fixed
- The articles panel now shows your highest-scoring articles from the whole collection — previously it only showed the 100 most recently gathered, which a large backfill could fill with low-relevance items

## [v01.11w] — 2026-08-03 08:17:43 PM EST — v01.57r — [be1fdaa](https://github.com/LightAISolutions/Sales/commit/be1fdaa1c8ef9dc02f91a8a2f6ed899a0af33064)

### Changed
- Backfill progress now also shows how many history batches failed (e.g. "10/96 (0 found, 8 failed)"), so a struggling run is visible right away instead of only in the final message

## [v01.10w] — 2026-08-03 06:43:09 AM EST — v01.56r — [4e80170](https://github.com/LightAISolutions/Sales/commit/4e801704c3ed1c8000c38dc52c2f4fc06989d18b)

### Added
- New Backfill button on each project card gathers up to 2 years of historical news for your project, with live progress shown while it runs

## [v01.09w] — 2026-08-03 02:51:07 AM EST — v01.54r — [9682a32](https://github.com/LightAISolutions/Sales/commit/9682a326285bf894a37fa69d105c38b71610fa34)

### Fixed
- Compile and Analyze now automatically retry briefly if a step fails, instead of stopping with an error right away

## [v01.08w] — 2026-08-03 02:38:35 AM EST — v01.53r — [5609e93](https://github.com/LightAISolutions/Sales/commit/5609e936061e29c1d8af48a92d97d3b9092d6b6b)

### Fixed
- Clicking Analyze before gathering any articles now clearly says to run Compile first
- Clearer messages when the AI service reports a problem

## [v01.07w] — 2026-08-03 02:15:55 AM EST — v01.52r — [3f99df9](https://github.com/LightAISolutions/Sales/commit/3f99df95559316fed98a81d8c231543141be7dd4)

### Added
- New Analyze button scores each gathered article for relevance to your project, with live progress while it runs
- Articles now show a color-coded relevance score and a short summary, with the most relevant stories sorted to the top
- New Brief button writes an executive brief summarizing the most important developments across your relevant articles

## [v01.06w] — 2026-08-03 01:23:34 AM EST — v01.51r — [1c38ef1](https://github.com/LightAISolutions/Sales/commit/1c38ef13ebbce16787c36d57b096debdf02bf907)

### Added
- New Compile button on each project card gathers news for that project, with live progress shown while it runs
- New Articles view lists everything gathered so far — headlines link to the original story, with source, date, and a short preview

## [v01.05w] — 2026-08-02 09:42:54 PM EST — v01.50r — [b71d24e](https://github.com/LightAISolutions/Sales/commit/b71d24e87e61efca66ed241d5be799f73c567271)

### Added
- New project dashboard: see all your research projects at a glance with status, report schedule, and delivery labels
- "New Project" guided setup: a 5-step wizard asks about your topic, industries, keywords, sources, and report schedule, with a review screen before creating
- Edit, pause/resume, and archive controls on each project card
- Status messages confirm when a project is created, updated, paused, or archived

## [v01.04w] — 2026-07-18 02:39:24 AM EST — v01.14r — [cc86b54](https://github.com/LightAISolutions/Sales/commit/cc86b54bfa3e65e51730eddecb14fe439587fbfd)

### Removed
- The text box and Submit button have been removed from the page

## [v01.03w] — 2026-07-18 12:05:25 AM EST — v01.13r — [50449c4](https://github.com/LightAISolutions/Sales/commit/50449c4ba2dbaf36d2029a1aa8464bcfdbdf1670)

### Added
- New text box with a Submit button that saves your entry to the spreadsheet

## [v01.02w] — 2026-07-17 11:45:41 PM EST — v01.12r — [1d60d9f](https://github.com/LightAISolutions/Sales/commit/1d60d9f750f4b21a5e00240992bc65c5aafe15a6)

### Fixed
- The application screen now loads reliably in any browser, including when multiple Google accounts are signed in

## [v01.01w] — 2026-07-17 10:05:56 PM EST — v01.11r — [c4d1bd3](https://github.com/LightAISolutions/Sales/commit/c4d1bd39eb9b7fa2846592e901e2bb46034234fa)

### Fixed
- Sign-in now works reliably in any browser, including when multiple Google accounts are signed in

Developed by: LightAISolutions
