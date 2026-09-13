# Changelog — Classroom — BESS/AIDC Curriculum

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Classroomhtml.changelog-archive.md](Classroomhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 11/50`

## [Unreleased]

*(No changes yet)*

## [v01.11w] — 2026-09-13 12:52:01 AM EST — v05.45r

### Added
- **The admin lens now works on guidance modules here.** For accounts that can read reports, a module shows the company-specific notes the current reports have written against it, each one sitting inside the section it was written about, with a button through to the report it came from. Twelve such notes exist today, across five of the nine modules; the others show none
- A note whose section has since been rewritten away is still shown — it moves to the end of the module with a line saying which section it was written for, rather than disappearing

### Changed
- A section can now carry notes from more than one report at once; both are shown, one after the other
- Accounts without report access see modules exactly as before — no notes, and nothing is fetched on their behalf
## [v01.10w] — 2026-09-13 12:13:40 AM EST — v05.44r

### Added
- **Industry Guidance now lives in Classroom.** The ✦ Industry Guidance link in the header opens the library here instead of sending you over to Profiler — nine modules grouped by their topic lane, each card showing its review date and whether it has been revised
- **Search across every module at once.** Type two or more characters into the library's search box and it looks through every section, table, drill card and glossary entry in all nine modules, showing where each match sits and highlighting it in context
- **A unified glossary.** One page listing every term defined anywhere in the library, alphabetically. A term several modules define shows each definition beside the module it came from, so you can see where they differ
- **A lesson's "Built from" strip now opens the guidance module it names** instead of linking out to the other app

### Changed
- Guidance modules are **read-only here for now** — a note on each module says so. Marking sections read still happens in Profiler until your reading history is moved across, which is the last step of this move; nothing you have already marked is affected

## [v01.09w] — 2026-09-10 03:31:19 AM EST — v05.33r

### Fixed
- Opening the page straight after an update no longer shows the previous version's content. The page now checks, on load, whether the copy it is running matches the version it is reporting, and refreshes itself once if it does not
- Refreshes triggered by an update now always fetch a fresh copy of the page rather than reusing the one already in the browser's cache

## [v01.08w] — 2026-09-07 07:44:48 PM EST — v05.10r

### Fixed
- **The drill now reaches every study-guide card.** Company study guides keep their flashcards in one of two places, and until now the drill only looked in one of them — so most of the newer guides' cards were never offered. The pool has grown from about 770 cards to about 1,920. Nothing you have already learned is affected: every card you had a history with keeps it

### Changed
- On a study-guide card, the answer's source line now links to the company in Profiler and, for cards from the newer guides, names the section the card came from

## [v01.07w] — 2026-09-02 06:23:38 PM EST — v04.29r

### Fixed
- **The drill card never appeared.** The page was sending its whole card inventory to the server on every check — far more than a request can carry — so the check failed and the card stayed hidden. The server now works out the card list itself, and the page only fetches the handful of cards it is actually given

## [v01.06w] — 2026-09-02 05:45:44 PM EST — v04.28r

### Added
- **The drill — spaced repetition across every card in the curriculum.** A new Drill card on the tracks page shows what is due today and takes you straight into it. Each card asks the question, waits for you to commit, then shows the answer and asks how it went: Again, Hard, Good or Easy. What you found hard comes back soon; what you found easy comes back much later, and keeps stretching out as long as you keep knowing it
- The drill covers **flashcards and quiz questions from every lesson you can read, plus every company study guide** — over 850 cards in total. Sessions are capped at 20 cards, with at most 10 brand-new ones a day, so it stays a few minutes rather than an evening
- Every card names where it came from, and lesson cards link straight back to the section they belong to, so "I don't actually remember this" turns into re-reading it in one click
- **A card whose wording has materially changed is treated as new again** rather than counting on what you knew about the old version

## [v01.05w] — 2026-09-02 05:16:32 PM EST — v04.27r

### Added
- **A lesson now tells you when it changed after you read it.** Mark a section understood and, if that section is later revised in a way that changes its meaning, an amber note appears on it naming the revision date and what the revision said. The section also stands out in the sidebar list, so you can see at a glance which parts of a lesson you have already read are no longer what you read
- Sections you marked understood now remember the date you did it, and the button says so when you hover it

### Changed
- Sections marked understood before this version are still marked understood, but they carry no date, so they will not show a "changed since you read it" note. Marking such a section again dates it from then on

## [v01.04w] — 2026-09-02 01:10:32 AM EST — v04.18r

### Added
- A "pick up where you left off" card at the top of the Classroom: it names the next lesson and the exact section you have not read yet, and opens straight to it
- On a first visit it says "Start here" instead, pointing at the opening section of the first track
- The card moves the moment you mark a section understood, and reports when everything you can read is finished
- A lesson can now be linked to at a specific section, so a shared link lands where it should

## [v01.03w] — 2026-09-02 12:58:13 AM EST — v04.17r

### Added
- Mark a section as understood as you read it — the section list ticks it off and strikes it through
- Each track now shows how far through it you are, and a finished lesson is marked complete on the index
- Your progress follows your account rather than the browser, so it is there on another device and a second person signing in on the same computer starts from a clean slate
- Ticks made while offline are kept and pushed up the next time the app can reach the server

## [v01.02w] — 2026-09-02 12:20:16 AM EST — v04.14r

### Added
- The Classroom is now connected to its backend, so tracks and lessons load for signed-in accounts instead of reporting that content is not connected yet

## [v01.01w] — 2026-09-01 11:14:26 PM EST — v04.13r

### Added
- The Classroom now has its first curriculum — tracks, each an ordered reading list of lessons, grouped by topic area
- Lessons open in a full reading view: headline figures, a jump-to-section list, tables, comparison cards, charts, flashcards and a self-test
- Hover any dotted term for its definition — the lesson's own glossary first, the shared industry glossary after
- Each lesson shows what it was built from and how current those sources were when it was written
- Where a lesson sits above your access level, its track says how many are held back rather than quietly leaving them out
- Every lesson has its own web address, so one can be bookmarked or sent to a colleague

Developed by: LightAISolutions
