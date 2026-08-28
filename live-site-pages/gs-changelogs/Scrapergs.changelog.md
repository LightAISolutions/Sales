# Changelog — News Scraper (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Scrapergs.changelog-archive.md](Scrapergs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 50/50`

## [Unreleased]

*(No changes yet)*

## [v01.55g] — 2026-08-28 12:36:36 AM EST — v03.22r

### Changed
- **A new edition no longer starts out following your main edition's settings.** When you create one you pick the starting point you want, and every segment and topic is written into that edition immediately — so it is its own publication from the moment it exists, and changing your main edition never quietly changes it
- Your two focused editions were rebuilt on the same footing, so every switch in them is now theirs rather than borrowed
- Choices you have not yet made are no longer left undecided: if a new segment or topic is added later, each edition is given its own answer for it straight away instead of falling back to the shared setting

### Added
- **Starting points to choose from** when creating an edition — everything on, a utility-scale storage focus, a data-center power-chain focus, or follow the shared settings
- **Reset to recommended** — put an edition back to its starting point, or move it onto a different one, without deleting and rebuilding it

## [v01.54g] — 2026-08-28 12:02:02 AM EST — v03.21r

### Added
- **Editions can now differ from one another.** Each edition keeps its own answers for which business segments and topics it follows, layered on top of your shared settings. An edition only stores what it actually changes, so anything you have not adjusted follows the shared setting and keeps following it when you change your mind later
- **Two new editions** alongside the original: one focused on utility-scale storage, and one focused on the data-center power chain. The original is untouched and reads exactly as it did
- **Many more filters to choose from.** Storage is now separated by scale — utility-scale, data-center, residential, commercial, and long-duration — and the data-center power chain is separated into medium-voltage conversion, inverters, transformers, backup generators, turbines and engines, skid-mounted power, rack power, server power supplies, accelerator chips, and cooling. New topics cover storage contracting, warranties and degradation, interconnection queues, and power density. All start switched on, so nothing changes until you decide otherwise

### Changed
- The edition's own name now appears on the emailed edition, so the three read as distinct publications rather than three copies of one
- Older entries moved to the archive

## [v01.53g] — 2026-08-27 11:51:21 PM EST — v03.20r

### Changed
- **An outlet whose site is gone is no longer listed at all.** It cannot be turned on or off, so showing it was only clutter. Its history is kept behind the scenes, and putting the outlet back on the roster still brings it back
- An outlet that is still publishing but refuses automated readers stays listed, so it is clear the beat is uncovered on purpose

## [v01.52g] — 2026-08-27 11:21:39 PM EST — v03.19r

### Fixed
- **A retired news outlet no longer says "coverage ended".** That wording belongs to a company you have stopped following; used for an outlet it claimed the publication had shut down, which was untrue for two of the three outlets dropped during the source review. Outlets now carry their own wording, and each one records the actual reason it was dropped — whether it is still publishing but refuses automated readers, or its site is genuinely gone — along with the date that was last checked
- Outlets dropped before this change are relabelled automatically on the next sync

## [v01.51g] — 2026-08-27 11:05:42 PM EST — v03.18r

### Fixed
- **The real reason company briefings stopped being read.** Just over half of the covered companies describe who a product is sold to as one written-out phrase rather than a list, and the reader only accepted the list form — it stopped on the first company written the other way and moved on without reading it, every time. Both forms are now understood, so every covered company can be read
- **Flagship product names were never picked up.** The reader was looking for those names in the wrong place, so it always found nothing. They now feed into the terms used to spot a company in the news, which should surface stories that mention a product without naming the company
- A written-out phrase is split sensibly rather than chopped at every comma, so a grouping like "labs (A, B)" stays whole, and long prose is left out of the segment list instead of being treated as a segment

### Changed
- **"Read all dossiers" now re-reads every covered company**, not only the ones never read before — so companies read under the old, partly-broken reader are brought up to date too. It still works through them automatically and stops when finished

### Removed
- Older entries moved to the archive

## [v01.50g] — 2026-08-27 10:55:12 PM EST — v03.17r

### Added
- **Read all dossiers.** A single action now works through every covered company's briefing in one go instead of a few per sync, continuing automatically until the whole list is done. It reports how many were read, how many have no briefing published yet, and how many could not be read

### Fixed
- Reading briefings no longer saves each company one at a time. The whole batch is saved in a single write at the end, which is dramatically faster and means progress is kept even if a pass runs out of time partway through
- A company that cannot be read is now reported with the reason instead of being skipped in silence, so a stalled list explains itself
- Starting a sync while one is already running now says so plainly rather than appearing to do nothing

## [v01.49g] — 2026-08-27 10:30:53 PM EST — v03.16r

### Changed
- **"Sync now" now finishes promptly and tells you what it did.** It reads a smaller batch of company dossiers per press so it returns in a few seconds instead of running for a minute, and reports the result directly — for example "Read 27 dossiers — 61 still queued, press again to continue." Press it a few times to finish a large backlog, or simply leave it: the overnight refresh still works through more per night

## [v01.48g] — 2026-08-27 10:18:03 PM EST — v03.15r

### Added
- **Every edition now records which AI service wrote its summaries**, and says so in its own footer — so you can tell at a glance whether an edition was produced on the free service or the paid one. Previously the two were indistinguishable once an edition was saved

### Fixed
- **A temporary "too many requests" response no longer ruins an entire edition.** Requests are now spaced out and retried a couple of times with a growing wait, instead of one busy moment silently dropping every remaining story to a plain feed blurb and skipping the lead write-up. Errors that cannot fix themselves — a bad or missing key — still stop immediately rather than retrying and consuming more of your free allowance

## [v01.47g] — 2026-08-27 10:06:57 PM EST — v03.14r

### Fixed
- **Company research results were being erased moments after they were saved.** The daily refresh saved its own copy of your interests list *after* the research pass had already written to it, overwriting every newly found product name, ticker and market — so the "Dossiers read" count stayed at zero no matter how many times the refresh was run. Research results now save last and stick

### Changed
- **Each edition now carries far more stories.** Written summaries per edition go from 14 to 30, and the per-section limits rise from 6 covered-company / 6 market / 4 incident items to 12 / 10 / 8 — so noticeably fewer qualifying stories are held back
- **The emailed edition is wider and easier to read again** — the article column widens further with slimmer margins, and the summary text, headlines, lead story and masthead all step up a size

## [v01.46g] — 2026-08-27 09:53:19 PM EST — v03.13r

### Fixed
- Company research with multi-word market names (for example "data centers") was being recorded incorrectly — everything after the first such name was dropped, which weakened the market-based filtering for those companies. All of it is now stored and read back correctly
- A company whose dossier could not be read was retried on every single refresh forever; it is now marked and the queue moves on

### Changed
- The daily company-research pass now prioritises what changed: companies newly added to your coverage are read first, then companies whose dossier was refreshed since it was last read, and only then a slow background re-read of everything else. Previously it worked through the list in fixed order, so a brand-new company could wait a week and a half before its product names were recognised
- The pass reads more companies per day while there is a backlog and settles to a light trickle once everything is current, so the first full read of your whole coverage list completes on its own within a few days — no manual refreshing needed
- Every read is now recorded even when it finds nothing new, so coverage progress can be reported accurately

### Added
- Research coverage is now reported to the app, so you can see how many of your covered companies have been read and how many are still queued

## [v01.45g] — 2026-08-27 09:42:55 PM EST — v03.12r

### Added
- **Editions**: the digest is now a named product you can have more than one of. Each edition has its own schedule — daily on weekdays, weekly on a day you pick, or monthly on a date — its own reading window, and its own subscriber list. The Morning Edition is built in and unchanged
- **Subscribers**: a real list with names, per-edition sign-up, an admin flag, and pause/remove. Every finished edition goes to the people signed up for it. Your previous single delivery address is carried over automatically
- **Learning from what you open**: article links in the emailed edition now record which stories you actually click, and the companies and topics you engage with score higher in later editions. The boost is capped and fades after a month, so it nudges rather than takes over
- **Learning from your research**: each day the app reads a few of your company dossiers and folds their product names, ticker symbols and alternate names into that company's matching terms — so a story about a named product is recognised even when the company itself is never mentioned. Your own edits are never overwritten
- **Smarter segment filtering**: it also learns which markets each company actually operates in, so a company that works only in markets you've switched off is filtered out even when the story never names the market
- **Corroboration**: a story covered by several of your sources within the window is ranked higher than a single-outlet item
- **Archive search** across every story ever stored, and a **per-company timeline** of all coverage since a dossier was written
- **Source performance**: see how many items each publication contributed, how many cleared your relevance bar, and how many clicks each earned — so a noisy source can be switched off with evidence
- **Edition preview** without storing or sending, and a **held-back rollup** that emails admins the relevant stories which didn't fit the edition's section limits

### Changed
- The Projects feature is retired. Defining scope, building an article database and scoring by hand were all replaced by your auto-synced interests, the fixed source roster and the relevance rubric. Existing project data is left untouched

## [v01.44g] — 2026-08-27 09:13:55 PM EST — v03.11r

### Changed
- The emailed edition is easier to read: the article column is wider, so there is far less empty space on either side, and the summary text, headlines and lead story are all set at a larger, roomier size
- The edition footer now says how many stories are shown out of how many met your relevance bar — and, when some were left out, exactly how many were held back by the per-section limits

## [v01.43g] — 2026-08-27 08:56:08 PM EST — v03.10r

### Added
- Switch the AI service between the free Gemini tier and Claude Sonnet from inside the app — one tap, no configuration needed
- Manage the daily edition's recipient list from inside the app: add or remove any number of email addresses, and every finished edition is sent to all of them
- Recipient and provider controls are built to lock to admin-level users once the app opens to multiple sign-ins; today, while it's single-user, they're fully available

## [v01.42g] — 2026-08-27 08:12:11 PM EST — v03.09r

### Added
- Weekday editions now build on their own: every weekday from 7:00 AM Eastern, the morning edition is assembled automatically (Monday's covers the whole weekend). Editions can still be built on demand at any time
- Email delivery of each finished edition, which starts as soon as a delivery address is configured
- A go-live readiness view showing which AI service is in use, whether scheduled runs and delivery are on, and when the schedule last checked in — plus a one-tap AI check and a "send me the latest edition" button for testing how it looks in your mail app

### Fixed
- Five news sources were fetching nothing: two had moved their feeds, one had changed section addresses, and two now block automated readers. The moved and renamed feeds are corrected, and the blocked ones (plus one whose website shut down) are replaced with three working publications covering the same beats — so the roster is a full 30 live sources again
- A source that leaves the roster is now clearly marked as retired in your source list instead of sitting there looking active

### Changed
- The emailed edition is rebuilt to survive email apps: it keeps its dark newspaper look in clients that force their own colors, and it stays centered and correctly laid out in Outlook

## [v01.41g] — 2026-08-27 06:49:49 PM EST — v03.08r

### Added
- Past editions can now be deleted: removing one permanently clears the edition and its stored articles, and the removal is recorded for audit

### Fixed
- Article links from the general-news safety net no longer lead to an error page — very long links were being cut short before saving, which broke them; full links are now kept intact
- Cleaner safety-net headlines and blurbs: stray symbol codes are now shown as real characters, duplicated publisher names are trimmed from headline ends, and blurbs that merely repeat the headline are dropped

### Changed
- Segment filtering now catches far more off-target stories: the vehicle and charging segment vocabularies recognize many more terms (driver-assistance features, model names, recall phrasing, safety-regulator references, and more), and existing setups pick up these improvements automatically on the next daily refresh — unless you've customized a segment's terms, in which case your edits are left untouched

## [v01.40g] — 2026-08-27 06:20:46 PM EST — v03.07r

### Added
- Business-segment filtering: the companies you follow work in many markets (batteries, EVs, chargers, transformers, and more), and you can now switch entire segments on or off. News from a followed company that only touches a switched-off segment — say an automaker's vehicle recall — no longer makes the digest

### Changed
- Article summaries are now substantially longer and more informative: each one covers what happened, who is involved, the key figures, how the deal or event works, and why it matters — instead of a one-line blurb

## [v01.39g] — 2026-08-27 05:48:26 PM EST — v03.06r

### Added
- The weekday morning digest engine: every weekday edition gathers the last 24 hours of industry news (Monday covers the whole weekend) from 30 hand-picked free trade publications, with an extra safety net that checks general news for each covered company by name
- Stories are ranked by how well they match your interests, the top items get short AI-written summaries that keep the key figures, and everything is assembled into a newspaper-style edition grouped by covered companies, market & policy, and incidents & community
- Your source list is now visible and adjustable: each of the 30 publications can be switched on or off, and your choices are respected on the very next run
- Recent editions are kept so you can revisit past days
- Scheduled delivery remains paused — editions can be built on demand from inside the app, and nothing is emailed until the launch step

## [v01.38g] — 2026-08-27 04:39:36 PM EST — v03.04r

### Added
- Your news interests now build themselves: the companies you research in the company-profile app flow into a new interest list automatically, refreshed daily. Newly covered companies join enabled and flagged as new coverage; companies no longer covered are kept but marked — nothing is ever deleted
- A starter set of industry topic interests (policy, grid, safety incidents, market buildout, and more), each of which can be switched on or off
- Groundwork for smarter article relevance that learns from your research focus instead of requiring thumbs-up/down feedback

## [v01.37g] — 2026-08-27 04:09:00 PM EST — v03.03r

### Changed
- Minor internal improvements

## [v01.36g] — 2026-08-27 02:20:49 AM EST — v03.02r

### Changed
- Scheduled news runs are now fully paused — nothing is compiled, analyzed, or emailed automatically, and no AI cost is incurred, until the redesigned daily digest launches. Manual actions inside the app still work normally

## [v01.35g] — 2026-08-27 01:54:03 AM EST — v03.01r

### Changed
- Scheduled news brief emails are paused for now, ahead of a digest redesign. Scheduled runs still happen and briefs still appear inside the app — email delivery will return with the redesigned daily digest

## [v01.34g] — 2026-08-17 03:36:35 AM EST — v02.62r

### Changed
- Clearer wording when the permission check finds nothing wrong with what the app asked for: it now points you at the list of what was actually granted, printed just above, instead of telling you to run a check you are already inside

## [v01.33g] — 2026-08-17 03:23:38 AM EST — v02.61r

### Changed
- The permission check now shows what the app **asked for** alongside what it was **actually given**, in one run. A capability can be missing for two opposite reasons — it was never requested, or it was requested and never approved — and the fix differs, so seeing only one of the two lists could point at the wrong repair
- The guidance that follows now reads those two lists against each other and names the specific repair, rather than listing general things to check

## [v01.32g] — 2026-08-17 03:15:36 AM EST — v02.60r

### Added
- The app can now report, on demand, whether its permission to use Google services is actually in force — as opposed to merely having been requested. The two are separate, and only the first one determines whether anything works
- When permission is incomplete, it produces a direct link to re-approve it, and names which capability each missing permission takes down

## [v01.31g] — 2026-08-17 02:34:37 AM EST — v02.56r

### Fixed
- The specific reason the access list could not be read is now sent back to the page. It was already being worked out, but never delivered, so all four possible causes looked identical from the sign-in screen and could not be told apart

## [v01.30g] — 2026-08-17 02:10:00 AM EST — v02.54r

### Fixed
- Sign-in now tells apart "this account is not on the access list" from "the access list could not be reached right now". The second is reported as a temporary service problem, and is retried automatically before sign-in gives up
- A momentary failure to reach the access list is no longer remembered as a denial, so access is restored the moment the service recovers instead of several minutes later
- These interruptions no longer count toward the failed-attempt lockout

### Changed
- The app now refreshes its entry in the shared access directory only when its version changes, instead of on every single page load. Less simultaneous writing to the shared directory means far fewer of the interruptions above

## [v01.29g] — 2026-08-05 05:26:52 AM EST — v01.80r

### Added
- Article ratings can now be saved in batches: many ratings are stored in a single request instead of one request each — far more resilient to the intermittent connection failures that were causing "Could not save feedback" errors, and faster

## [v01.28g] — 2026-08-05 03:13:25 AM EST — v01.78r

### Fixed
- The scheduler health check now recognizes manually installed timers: each hourly run leaves a proof-of-life marker, and a recent marker verifies the schedule is alive even when the service lacks permission to inspect timers directly — previously a hand-added timer was wrongly reported as missing

## [v01.27g] — 2026-08-05 02:57:13 AM EST — v01.77r

### Changed
- Rebuilding the search plan now keeps the keywords you added by hand — they stay at the top of the list while the automatically generated groups are refreshed behind them
- The saved plan now remembers which groups you added yourself, so they survive every rebuild

### Added
- New scheduler health check: the app can now verify that the hourly timer powering scheduled briefs actually exists, and report the exact reason when it can't be installed — this state was previously invisible

## [v01.26g] — 2026-08-05 02:34:08 AM EST — v01.76r

### Fixed
- Keywords added to the search plan can no longer be silently lost when two additions overlap — plan updates are now processed one at a time, and a busy update reports itself instead of overwriting
- Scheduled briefs can no longer fail silently: if a morning run keeps failing, it now stops after several attempts, moves to the next cycle, and **emails you a failure notice with the reason** — you will always receive either your brief or an explanation
- The hourly schedule timer is now re-verified every day and reinstalled automatically if it has gone missing, so schedules cannot silently stop running
- When a brief email fails to send, the reason is now recorded so it can be diagnosed

## [v01.25g] — 2026-08-04 08:11:10 PM EST — v01.74r

### Changed
- Button actions respond much faster: the service no longer performs its full startup routine (directory registration and scheduling checks) before answering each request — that work now happens only when the page itself loads
- Repeated actions skip redundant storage checks for several hours at a time, shaving additional time off every press

## [v01.24g] — 2026-08-04 06:41:08 PM EST — v01.73r

### Added
- You can now grow your search plan one company or term at a time: submit a name and the service instantly evaluates it, shapes it into a full search query group with relevant context added, and saves it to your plan — duplicates are detected and reported instead of added
- Newly added terms are placed at the top of the plan, so they are always included in the very next gathering run

### Changed
- Opening the search plan now shows your saved plan instantly instead of rebuilding it, so manual additions are never lost — rebuilding is a separate, deliberate action
- Gathering runs now use more of your search plan than before, widening coverage across both news sources

## [v01.23g] — 2026-08-04 06:01:06 PM EST — v01.72r

### Added
- AI search planning: the full project description, keywords, and learned preferences can now be turned into a stored set of precise search queries — naming every company and topic you care about — that all news gathering uses from then on
- Junk filtering at the door: newly fetched headlines are now screened for relevance before entering your collection, so gathering runs no longer pile up unrelated articles (if the screening service is unavailable, everything is kept — no articles are ever lost to a hiccup)
- Deep backfill: a new premium gathering mode uses AI-powered web search to find historical articles quarter by quarter — results arrive with summaries already attached, ready for scoring, and runs resume automatically if interrupted

### Changed
- Historical backfill now uses the stored search plan when one exists, covering up to twice as many search angles as before

## [v01.22g] — 2026-08-04 04:53:53 PM EST — v01.71r

### Added
- Score statistics now break down each score band by preview availability (with preview vs title-only), report how many articles qualify for archiving, and show how many are already archived
- New archive action: unrated articles scoring under 10 can be moved out of your active collection in one pass — they no longer slow down or add cost to enrichment, re-scoring, analysis, or any other collection-wide operation, and archived articles are never re-imported by future news gathering

## [v01.21g] — 2026-08-04 04:01:42 PM EST — v01.70r

### Added
- Score statistics: the app can now report your full score distribution and collection health (scored counts, preview coverage, rating totals) in a single quick request

## [v01.20g] — 2026-08-04 06:02:52 AM EST — v01.69r

### Fixed
- Enrich could stall permanently when a website hung and never responded — the run would restart the same batch and hit the same site forever. Progress is now saved before every fetch, so a hanging site is automatically counted as unavailable and skipped, and the run continues past it

## [v01.19g] — 2026-08-04 03:33:53 AM EST — v01.68r

### Added
- Articles gathered without preview text (common for historical articles) can now be enriched: the publisher's own summary is fetched and saved for each one, so relevance scoring and your rating cards work from real article content instead of just headlines
- Enrichment runs in resumable batches, retries previously unavailable articles on a later run, and uses no AI credit

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

Developed by: LightAISolutions
