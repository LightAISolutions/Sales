# Changelog — News Scraper

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Scraperhtml.changelog-archive.md](Scraperhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 14/50`

## [Unreleased]

*(No changes yet)*

## [v01.14w] — 2026-08-03 11:33:05 PM EST — v01.60r

### Added
- After analysis, a message now confirms when your ratings have been distilled into updated preferences (e.g. "🧠 Preferences updated from your 12 ratings")

## [v01.13w] — 2026-08-03 11:21:17 PM EST — v01.59r

### Fixed
- Rating an article right after a server update could silently fail (the button reset to default) — ratings now retry automatically and show a clear "server is finishing an update" message if the server still isn't ready

## [v01.12w] — 2026-08-03 10:06:55 PM EST — v01.58r

### Added
- 👍/👎 buttons on every article let you rate relevance — your ratings teach the scoring to match your preferences on future analysis runs (tap again to clear a rating)

### Fixed
- The articles panel now shows your highest-scoring articles from the whole collection — previously it only showed the 100 most recently gathered, which a large backfill could fill with low-relevance items

## [v01.11w] — 2026-08-03 08:17:43 PM EST — v01.57r

### Changed
- Backfill progress now also shows how many history batches failed (e.g. "10/96 (0 found, 8 failed)"), so a struggling run is visible right away instead of only in the final message

## [v01.10w] — 2026-08-03 06:43:09 AM EST — v01.56r

### Added
- New Backfill button on each project card gathers up to 2 years of historical news for your project, with live progress shown while it runs

## [v01.09w] — 2026-08-03 02:51:07 AM EST — v01.54r

### Fixed
- Compile and Analyze now automatically retry briefly if a step fails, instead of stopping with an error right away

## [v01.08w] — 2026-08-03 02:38:35 AM EST — v01.53r

### Fixed
- Clicking Analyze before gathering any articles now clearly says to run Compile first
- Clearer messages when the AI service reports a problem

## [v01.07w] — 2026-08-03 02:15:55 AM EST — v01.52r

### Added
- New Analyze button scores each gathered article for relevance to your project, with live progress while it runs
- Articles now show a color-coded relevance score and a short summary, with the most relevant stories sorted to the top
- New Brief button writes an executive brief summarizing the most important developments across your relevant articles

## [v01.06w] — 2026-08-03 01:23:34 AM EST — v01.51r

### Added
- New Compile button on each project card gathers news for that project, with live progress shown while it runs
- New Articles view lists everything gathered so far — headlines link to the original story, with source, date, and a short preview

## [v01.05w] — 2026-08-02 09:42:54 PM EST — v01.50r

### Added
- New project dashboard: see all your research projects at a glance with status, report schedule, and delivery labels
- "New Project" guided setup: a 5-step wizard asks about your topic, industries, keywords, sources, and report schedule, with a review screen before creating
- Edit, pause/resume, and archive controls on each project card
- Status messages confirm when a project is created, updated, paused, or archived

## [v01.04w] — 2026-07-18 02:39:24 AM EST — v01.14r

### Removed
- The text box and Submit button have been removed from the page

## [v01.03w] — 2026-07-18 12:05:25 AM EST — v01.13r

### Added
- New text box with a Submit button that saves your entry to the spreadsheet

## [v01.02w] — 2026-07-17 11:45:41 PM EST — v01.12r

### Fixed
- The application screen now loads reliably in any browser, including when multiple Google accounts are signed in

## [v01.01w] — 2026-07-17 10:05:56 PM EST — v01.11r

### Fixed
- Sign-in now works reliably in any browser, including when multiple Google accounts are signed in

Developed by: ShadowAISolutions
