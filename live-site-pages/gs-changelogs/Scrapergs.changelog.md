# Changelog — News Scraper (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Scrapergs.changelog-archive.md](Scrapergs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 18/50`

## [Unreleased]

*(No changes yet)*

## [v01.18g] — 2026-08-04 03:28:10 AM EST — v01.67r

### Fixed
- Relevance scoring was far too harsh — most articles scored near zero. Scoring now uses a detailed scale that recognizes adjacent coverage (corporate moves, financing, policy, supply-chain news about relevant players) as moderately relevant instead of dismissing it
- Articles with only a headline (no preview text) are no longer penalized for the missing text — they're scored on what the headline covers
- A rating history with mostly 👎s no longer drags all scores down — your ratings are presented to the scorer in a balanced way, and your preference profile now leads with what you value

## [v01.17g] — 2026-08-04 01:46:24 AM EST — v01.65r

### Changed
- Saving project changes is faster when the report schedule wasn't modified

### Fixed
- Editing a project's topic, keywords, or sources no longer resets its report schedule's next-run timing

## [v01.16g] — 2026-08-04 01:33:25 AM EST — v01.64r

### Changed
- Calibration no longer shows very low-scoring articles (under 10) — rating obvious junk teaches the scorer almost nothing
- When the worthwhile articles run out, the calibration queue now ends instead of filling up with low-scoring leftovers — low scorers only ever appear as a small share of the mix

## [v01.15g] — 2026-08-04 01:17:17 AM EST — v01.63r

### Added
- Automatic scheduled runs: your project's report schedule now runs by itself — news is gathered, scored against your learned preferences, and turned into an executive brief on your chosen frequency (daily, weekly, monthly, quarterly, biannual, annual, or custom), with runs anchored at 7:00 AM Eastern
- Finished briefs are saved to the Reports tab of your spreadsheet and emailed to you when your delivery setting includes email
- Long runs continue automatically across hourly passes until finished, and paused projects are skipped until you resume them
- The scheduler starts itself the first time the page is opened after this update — no setup needed

## [v01.14g] — 2026-08-04 01:08:07 AM EST — v01.62r

### Added
- Calibration article feed: serves a varied mix of your unrated articles weighted toward the uncertain middle scores, where your ratings improve accuracy the most
- Article filters: the article list can now be narrowed by time window, minimum score, and keyword
- On-demand preference learning: your ratings can now be distilled into an updated profile during a rating session, not just during analysis
- Re-score support: all articles in a project can be re-scored with your latest learned preferences
- News gathering now also searches the outlets behind your thumbs-up ratings, and learned suggestions now include adjacent topics — both widen what gets found beyond your typed keywords

## [v01.13g] — 2026-08-03 11:33:05 PM EST — v01.60r

### Added
- Your article ratings are now periodically distilled into a learned preference profile — a summary of what you value plus suggested search phrases, visible in the Preferences tab of your spreadsheet
- News gathering (both regular and historical) now also searches using phrases learned from your ratings, so it finds more of what you actually care about
- Relevance scoring and executive briefs now consider your learned preference profile alongside your recent ratings

## [v01.12g] — 2026-08-03 10:06:55 PM EST — v01.58r

### Added
- Article ratings (👍/👎) are now saved with each article and used as examples in future relevance scoring, so results improve as you rate more articles

### Changed
- The article list is now selected by relevance score across your whole collection instead of by most recently gathered

## [v01.11g] — 2026-08-03 06:43:09 AM EST — v01.56r

### Added
- New historical backfill gathers up to 2 years of past news coverage for each project from a free global news archive, working in resumable stages that continue where they left off

## [v01.10g] — 2026-08-03 06:20:57 AM EST — v01.55r

### Added
- Article scoring and summaries can now run on Claude (Anthropic) for higher accuracy, selectable by the site operator — the previous free AI service remains available as a fallback

## [v01.09g] — 2026-08-03 02:51:07 AM EST — v01.54r

### Fixed
- Fixed article analysis stopping with a "could not reach the server" error — analysis now runs in smaller steps that reliably complete

## [v01.08g] — 2026-08-03 02:38:35 AM EST — v01.53r

### Fixed
- Fixed article analysis failing with a "something went wrong" error — the AI service now automatically selects a current, supported model and keeps working when models are retired

## [v01.07g] — 2026-08-03 02:15:55 AM EST — v01.52r

### Added
- AI-powered relevance scoring: each gathered article is rated against your project's scope, with summaries written for relevant stories
- Executive briefs: the most relevant articles are synthesized into a short overview with key bullet points
- Long scoring runs process in stages and resume automatically if interrupted

## [v01.06g] — 2026-08-03 01:23:34 AM EST — v01.51r

### Added
- News gathering is now live: each project searches Google News plus any feeds you added, guided by your topic, keywords, industries, and excluded terms
- Duplicate stories are automatically skipped, and long searches resume where they left off if interrupted

## [v01.05g] — 2026-08-02 09:42:54 PM EST — v01.50r

### Added
- Research projects can now be created, edited, paused, resumed, and archived — each saved privately to your own account
- Report schedules (daily through annual, plus custom dates) are stored with each project
- Up to 10 active projects per account

## [v01.04g] — 2026-07-18 12:05:25 AM EST — v01.13r

### Added
- Submitted text entries are now saved to the spreadsheet with a timestamp

## [v01.03g] — 2026-07-17 10:05:56 PM EST — v01.11r

### Fixed
- Sign-in now works reliably in any browser, including when multiple Google accounts are signed in

## [v01.02g] — 2026-07-17 09:22:12 PM EST — v01.10r

### Changed
- Security and session settings aligned with the proven production configuration, including session activity logging

## [v01.01g] — 2026-07-17 08:36:54 PM EST — v01.09r

### Fixed
- Sign-in no longer times out with a "service isn't responding" message

Developed by: ShadowAISolutions
