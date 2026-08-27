# Changelog — News Scraper

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Scraperhtml.changelog-archive.md](Scraperhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 38/50`

## [Unreleased]

*(No changes yet)*

## [v01.38w] — 2026-08-27 06:20:46 PM EST — v03.07r

### Added
- A Segments panel on the main screen: the business areas your followed companies work in, each with its own on/off switch — turn one off and news touching only that area stays out of your digests
- The relevance tester now explains when a headline was excluded by a switched-off segment, so you can see exactly why something didn't make the cut

## [v01.37w] — 2026-08-27 05:48:26 PM EST — v03.06r

### Added
- A Sources panel joins your interests: all 30 news publications are listed with on/off switches, so you control exactly where your digest reads from
- A new Digest view: browse recent editions, read them in the newspaper-style dark layout, and build today's edition on demand with a live progress readout

## [v01.36w] — 2026-08-27 05:08:03 PM EST — v03.05r

### Added
- A brand-new dark "news desk" look for the whole app — charcoal panels, amber highlights, and a newsroom typeface for faster scanning
- Your interests now live on the main screen: every covered company and industry topic appears with its own on/off switch, so you control exactly what counts toward your digests
- Newly covered companies are highlighted as new, and companies no longer covered are kept visible but marked — nothing disappears without you seeing it
- A "Sync now" control to refresh the company list on demand, with the last sync time always shown
- A relevance tester: paste any headline to see how it would score against your current interests, with a breakdown of why

### Changed
- Thumbs-up/down article rating is retired — relevance now follows the companies and topics you research, with no manual training needed. Past ratings are preserved

## [v01.35w] — 2026-08-27 04:09:00 PM EST — v03.03r

### Changed
- Minor internal improvements

## [v01.34w] — 2026-08-17 02:34:37 AM EST — v02.56r

### Changed
- When sign-in cannot reach the access list, the message now says **which** part is at fault instead of giving the same wording for every cause, and it includes a short code you can quote when reporting it
- A retry is only suggested when the problem is genuinely temporary. A structural problem with the list now says plainly that it will not clear on its own and needs an administrator, rather than inviting you to keep trying

## [v01.33w] — 2026-08-17 02:10:00 AM EST — v02.54r

### Fixed
- A brief interruption while the app was checking your access no longer appears as "Access denied". Sign-in now says it is a temporary service problem and asks you to try again, instead of turning you away with a message that suggests your access had been removed
- After one of these interruptions, sign-in works again as soon as the service recovers rather than staying blocked for the next several minutes
- Retrying during an interruption no longer counts toward the failed-attempt limit, so a service hiccup can no longer escalate into a temporary lockout

## [v01.32w] — 2026-08-05 05:26:52 AM EST — v01.80r

### Fixed
- Article ratings can no longer be lost: tapping 👍/👎 now registers instantly and the rating is kept safely on your device until the server confirms it — the "Could not save feedback" failures are gone
- Queued ratings save automatically in the background (retrying as long as needed) and even finish saving after a page reload; if the server is temporarily unreachable you get one heads-up, then a confirmation once everything lands
- Rating many articles in a row is now much faster — the buttons never lock while a save is in flight, and pending ratings are sent together in one request

## [v01.31w] — 2026-08-05 03:35:45 AM EST — v01.79r

### Added
- New notification history: a 🔔 button in the header opens a floating panel that saves every result message with its timestamp — start an operation, walk away, and come back to see definitively whether it finished, failed, or was interrupted
- Every long-running operation also logs a "started" entry, so a start with no matching finish tells you the run was cut short (retrying resumes where it left off)
- The history survives page reloads and shows an unread-count badge on the bell; opening the panel marks everything read, and a Clear button wipes the history

## [v01.30w] — 2026-08-05 03:13:25 AM EST — v01.78r

### Fixed
- The scheduler warning now has a gentler "can't verify yet" state: if you just added the hourly timer yourself, an amber notice explains it will clear automatically after the first hourly run — instead of wrongly alarming that briefs are not running

## [v01.29w] — 2026-08-05 02:57:13 AM EST — v01.77r

### Added
- If scheduled briefs can't run because the hourly timer isn't installed, a red warning banner now appears above your projects with the exact reason and step-by-step fix — this failure used to be completely invisible
- Keywords you added to the search plan are now labeled "added by you" in the plan panel, and the Rebuild confirmation tells you how many of your additions were kept

### Changed
- Rebuild's description now reflects that your manual additions are kept — only the automatically generated groups are replaced

## [v01.28w] — 2026-08-05 02:34:08 AM EST — v01.76r

### Changed
- Adding a keyword to the search plan now shows instantly: a pending row appears at the top of the list the moment you press Add, then is replaced by the saved entry (highlighted) as soon as the service confirms
- After every addition the panel re-displays the exact saved plan from the server, so the list on screen always matches what is actually stored
- If the confirmation is lost to a slow connection, the panel now re-checks the saved plan and tells you definitively whether your keyword was added — no more guessing

## [v01.27w] — 2026-08-04 08:27:47 PM EST — v01.75r

### Added
- Every completed action now tells you the recommended next step (e.g. after gathering news: "Next: run Analyze to score them"), and result messages stay on screen longer so they're harder to miss
- The search plan panel now always shows how many query groups are saved and when the plan was last saved — so you can verify a rebuild went through even if you looked away
- The Stats panel footer now recommends the single most valuable next action based on your numbers

### Fixed
- Requests that hang no longer leave a button stuck forever — after 90 seconds the call fails visibly with a clear message and the button becomes usable again

## [v01.26w] — 2026-08-04 08:11:10 PM EST — v01.74r

### Changed
- Faster button responses: when the connection has to use its backup route, the page now remembers that and uses the working route directly — cutting each press's wait roughly in half in that situation

## [v01.25w] — 2026-08-04 06:41:08 PM EST — v01.73r

### Added
- The search plan panel now has an add-a-term box: type a company or keyword (and press Enter or tap Add) and a fully-shaped query group appears at the top of the list in real time, highlighted so you can see exactly what was added — no need to leave the panel
- If a term is already covered by an existing query group, the panel tells you which one instead of adding a duplicate

### Changed
- The Plan button now opens your saved plan instantly (no waiting, no rebuild) — a separate Rebuild button inside the panel regenerates the plan from scratch, with a confirmation tap since it replaces the current list including your manual additions

## [v01.24w] — 2026-08-04 06:01:06 PM EST — v01.72r

### Added
- New Plan button on each project card: builds an AI search plan from your full topic, keywords, and learned preferences, and shows the resulting query groups in a panel — the plan then powers Compile, Backfill, and Deep backfill
- New Deep backfill button: a premium history search that asks for confirmation before running (it uses paid AI web searches), shows live progress with articles found and searches used, and resumes where it left off if interrupted
- Compile and Backfill progress now shows how many junk headlines were filtered out before entering your collection

## [v01.23w] — 2026-08-04 04:53:53 PM EST — v01.71r

### Added
- The Stats panel now shows, under each score band, how many articles had a preview versus title-only — so you can see whether missing previews explain low scores
- The Stats footer now shows how many articles qualify for archiving and how many are already archived
- New "Archive junk" button on each project card: shows the exact count first ("Archive 1781? Tap again"), then moves unrated articles scoring under 10 out of your collection with a progress panel and a result message

## [v01.22w] — 2026-08-04 04:01:42 PM EST — v01.70r

### Added
- New Stats button on each project card shows your score distribution at a glance: a big headline with the share of articles scoring 20+, color-coded bars for each score band, and corpus health (preview coverage, your rating counts, and how many articles are worth calibrating)

## [v01.21w] — 2026-08-04 03:33:53 AM EST — v01.68r

### Added
- New Enrich button on each project card fills in missing article previews by fetching them from the publishers — with live progress showing how many previews were found and how many were unavailable

## [v01.20w] — 2026-08-04 02:39:32 AM EST — v01.66r

### Added
- Added suggestions can now be undone — tap the × on an added keyword or source chip to remove it from your project (undo saves instantly and in the background, just like adding)
- New progress bars for Compile, Backfill, Analyze, and Re-score: a panel in the bottom-left shows the action name, a live fill bar, detailed counts (processed, found, failed, scored, remaining), and a running clock — it stays visible even while the articles or calibration view is open, and turns green when finished

## [v01.19w] — 2026-08-04 01:46:24 AM EST — v01.65r

### Changed
- Adding suggested keywords/sources to your project now responds instantly — taps register immediately and save together in the background, with a clear message if a save fails so you can retry

### Fixed
- Rapidly adding several suggestions could previously lose some of them — all additions now save reliably

## [v01.18w] — 2026-08-04 01:33:25 AM EST — v01.64r

### Changed
- Calibration now explains clearly when there's nothing worthwhile left to rate, and points to Compile + Analyze to bring in fresh articles

## [v01.17w] — 2026-08-04 01:17:17 AM EST — v01.63r

### Added
- Project cards now show a green ⏰ chip with the next scheduled run time (hover to see the last run), or "first run pending" for a newly scheduled project

## [v01.16w] — 2026-08-04 01:08:07 AM EST — v01.62r

### Added
- New Calibrate button on each project: a focused rating mode that feeds you a varied mix of articles — mostly borderline ones where your opinion teaches the most — and replaces each card as you rate it, with a running session counter
- While calibrating, your preferences automatically re-learn after every 10 ratings, with a confirmation message each time
- New "What I've learned" panel shows the current preference profile plus suggested search keywords and your most-liked news sources, each with a one-tap + to add it to your project permanently
- New "Re-score collection" button re-scores all your gathered articles with the latest learned preferences (asks for confirmation first)
- The Articles view now has filters: time window, minimum score, and keyword search

## [v01.15w] — 2026-08-03 11:57:41 PM EST — v01.61r

### Added
- New "Rating status" window appears beside the article list while you rate — it shows each step of saving a rating live (tap registered, send attempts, retries, waits, saved) with elapsed times, so you can see exactly where a slow save is spending its time. Close it anytime with ×; it reappears on your next rating

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

Developed by: LightAISolutions
