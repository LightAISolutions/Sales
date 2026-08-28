# Changelog Archive — News Scraper (Google Apps Script)

Older version sections rotated from [Scrapergs.changelog.md](Scrapergs.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

## [v01.13g] — 2026-08-03 11:33:05 PM EST — v01.60r — [3ef1ffb](https://github.com/LightAISolutions/Sales/commit/3ef1ffb)

### Added
- Your article ratings are now periodically distilled into a learned preference profile — a summary of what you value plus suggested search phrases, visible in the Preferences tab of your spreadsheet
- News gathering (both regular and historical) now also searches using phrases learned from your ratings, so it finds more of what you actually care about
- Relevance scoring and executive briefs now consider your learned preference profile alongside your recent ratings

## [v01.12g] — 2026-08-03 10:06:55 PM EST — v01.58r — [2ec7564](https://github.com/LightAISolutions/Sales/commit/2ec7564)

### Added
- Article ratings (👍/👎) are now saved with each article and used as examples in future relevance scoring, so results improve as you rate more articles

### Changed
- The article list is now selected by relevance score across your whole collection instead of by most recently gathered

## [v01.11g] — 2026-08-03 06:43:09 AM EST — v01.56r — [4e80170](https://github.com/LightAISolutions/Sales/commit/4e80170)

### Added
- New historical backfill gathers up to 2 years of past news coverage for each project from a free global news archive, working in resumable stages that continue where they left off

## [v01.10g] — 2026-08-03 06:20:57 AM EST — v01.55r — [748bcab](https://github.com/LightAISolutions/Sales/commit/748bcab)

### Added
- Article scoring and summaries can now run on Claude (Anthropic) for higher accuracy, selectable by the site operator — the previous free AI service remains available as a fallback

## [v01.09g] — 2026-08-03 02:51:07 AM EST — v01.54r — [9682a32](https://github.com/LightAISolutions/Sales/commit/9682a32)

### Fixed
- Fixed article analysis stopping with a "could not reach the server" error — analysis now runs in smaller steps that reliably complete

## [v01.08g] — 2026-08-03 02:38:35 AM EST — v01.53r — [5609e93](https://github.com/LightAISolutions/Sales/commit/5609e93)

### Fixed
- Fixed article analysis failing with a "something went wrong" error — the AI service now automatically selects a current, supported model and keeps working when models are retired

## [v01.07g] — 2026-08-03 02:15:55 AM EST — v01.52r — [3f99df9](https://github.com/LightAISolutions/Sales/commit/3f99df9)

### Added
- AI-powered relevance scoring: each gathered article is rated against your project's scope, with summaries written for relevant stories
- Executive briefs: the most relevant articles are synthesized into a short overview with key bullet points
- Long scoring runs process in stages and resume automatically if interrupted

## [v01.06g] — 2026-08-03 01:23:34 AM EST — v01.51r — [1c38ef1](https://github.com/LightAISolutions/Sales/commit/1c38ef1)

### Added
- News gathering is now live: each project searches Google News plus any feeds you added, guided by your topic, keywords, industries, and excluded terms
- Duplicate stories are automatically skipped, and long searches resume where they left off if interrupted

## [v01.05g] — 2026-08-02 09:42:54 PM EST — v01.50r — [b71d24e](https://github.com/LightAISolutions/Sales/commit/b71d24e)

### Added
- Research projects can now be created, edited, paused, resumed, and archived — each saved privately to your own account
- Report schedules (daily through annual, plus custom dates) are stored with each project
- Up to 10 active projects per account

## [v01.04g] — 2026-07-18 12:05:25 AM EST — v01.13r — [50449c4](https://github.com/LightAISolutions/Sales/commit/50449c4)

### Added
- Submitted text entries are now saved to the spreadsheet with a timestamp

## [v01.03g] — 2026-07-17 10:05:56 PM EST — v01.11r — [c4d1bd3](https://github.com/LightAISolutions/Sales/commit/c4d1bd3)

### Fixed
- Sign-in now works reliably in any browser, including when multiple Google accounts are signed in

## [v01.02g] — 2026-07-17 09:22:12 PM EST — v01.10r — [489a824](https://github.com/LightAISolutions/Sales/commit/489a824)

### Changed
- Security and session settings aligned with the proven production configuration, including session activity logging

## [v01.01g] — 2026-07-17 08:36:54 PM EST — v01.09r — [d726490](https://github.com/LightAISolutions/Sales/commit/d726490)

### Fixed
- Sign-in no longer times out with a "service isn't responding" message

Developed by: LightAISolutions
