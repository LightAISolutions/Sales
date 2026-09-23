# Changelog — News Scraper (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Scrapergs.changelog-archive.md](Scrapergs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 43/50`

## [Unreleased]

*(No changes yet)*

## [v02.22g] — 2026-09-22 11:02:50 PM EST — v07.21r

### Added
- **The people an article names are now kept with it.** When an article is summarised, the people it quotes, bylines or mentions — with their title, company and a phrase on what they said — are stored alongside the summary, in the same pass and at no extra model cost. Articles summarised before this version are not re-read
- A partner application can now read those people for one covered company over its own private channel, secured by a separate key that never opens the existing corpus feeds

### Changed
- Minor internal improvements

## [v02.21g] — 2026-09-20 09:06:03 PM EST — v06.79r

### Added
- **A daily execution counter the operator can read.** A status address now reports how many requests the backend handled today, grouped by type — counts only, never who made them or what they contained

## [v02.20g] — 2026-09-17 05:55:44 PM EST — v06.45r

### Added

- A new interest topic has been added so the daily digest scores articles about the review, testing and approval side of the industry — the reports lenders rely on, the laboratory recognitions behind a product mark, and the ownership changes among the firms that issue them. It is on by default and flagged as new, and can be switched off in the interests list

### Changed

- Minor internal improvements

## [v02.19g] — 2026-09-17 07:19:17 AM EST — v06.43r

### Added

- The news digest now recognises one more subject area when it scores an article, so stories about that part of the market are grouped under their own heading instead of being spread across neighbouring topics. The new grouping is on by default and can be turned off like any other

### Changed

- Minor internal improvements

## [v02.18g] — 2026-09-17 05:18:32 AM EST — v06.40r

### Added

- A new interest topic has been added to the news digest, covering the software and optimisation layer of the storage market — the control systems that run a plant, the reporting layer that watches a fleet, and the trading desks that bid batteries into wholesale markets. Articles matching these subjects will now be picked up and scored like any other tracked interest

### Changed

- Minor internal improvements

## [v02.17g] — 2026-09-17 03:05:03 AM EST — v06.36r

### Added

- One new news-interest topic, default-on and flagged as new in Tune, so the daily digest scores articles against another part of the value chain. Its search terms were chosen after checking every term the existing topics and segment lenses already hold, and they deliberately balance an area where the roster had been following one side of a market much more closely than the other

## [v02.16g] — 2026-09-17 12:50:41 AM EST — v06.32r

### Added

- One new news-interest topic, default-on and flagged as new in Tune, so the daily digest scores articles against another part of the value chain

## [v02.15g] — 2026-09-16 10:28:01 PM EST — v06.28r

### Added

- One new news-interest topic, default-on and flagged as new in Tune, so the daily digest scores articles against another part of the value chain

## [v02.14g] — 2026-09-16 08:22:31 PM EST — v06.24r

### Added

- A new news-interest topic for the funds, sovereign vehicles and lenders that sit above the developers, so stories about that part of the market are picked up and scored in the daily digest

## [v02.13g] — 2026-09-16 06:38:00 AM EST — v06.15r

### Added

- A new news-interest topic for the contracted GPU-cloud operators, so stories about that part of the market are picked up and scored in the daily digest

## [v02.12g] — 2026-09-16 04:04:07 AM EST — v06.11r

### Added

- A new topic added to the news interest list, so the daily digest scores stories on it

## [v02.11g] — 2026-09-16 01:24:09 AM EST — v06.07r

### Added
- New topic added to the interest list

### Changed
- Digest relevance scoring updated

## [v02.10g] — 2026-09-15 11:26:20 PM EST — v06.03r

### Added
- New topic added to the interests list

## [v02.09g] — 2026-09-15 09:08:13 PM EST — v05.97r

### Added
- One new interest topic available in the Interests tab, on by default

## [v02.08g] — 2026-09-15 06:47:49 PM EST — v05.93r

### Added

- A new topic added to the interests list, so news about uninterruptible power equipment, rotating-machine backup and the batteries underneath them is scored and surfaced in the digest. It arrives switched on and flagged as new, and can be turned off or edited in the sheet like any other interest

## [v02.07g] — 2026-09-15 04:21:39 AM EST — v05.88r

### Added

- A new topic added to the interests list, so news about data-centre land, build-to-suit development and how these campuses are financed is scored and surfaced in the digest. It arrives switched on and flagged as new, and can be turned off or edited in the sheet like any other interest

## [v02.06g] — 2026-09-15 02:37:11 AM EST — v05.83r

### Added

- A new topic added to the interests list, so news about power semiconductors and the conversion stages closest to the processor is scored and surfaced in the digest. It arrives switched on and flagged as new, and can be turned off or edited in the sheet like any other interest

## [v02.05g] — 2026-09-14 11:10:40 PM EST — v05.78r

### Added

- A new interest topic in the news digest, on by default, so stories on that subject are picked up and scored

## [v02.04g] — 2026-09-14 08:22:55 PM EST — v05.74r

### Added

- A new interest topic in the news digest, on by default, so stories on that subject are picked up and scored

## [v02.03g] — 2026-09-14 06:39:45 AM EST — v05.64r

### Added
- A new interest topic in the news digest, on by default, so stories on that subject are picked up and scored

## [v02.02g] — 2026-09-12 11:35:59 PM EST — v05.43r

### Added
- A new interest topic in the news digest, on by default, so stories on that subject are picked up and scored

## [v02.01g] — 2026-09-06 07:53:35 AM EST — v04.83r

### Added
- One more named-project topic is available to switch on, covering a large Louisiana AI data-centre campus and the companies building and leasing it

### Changed
- Its search terms are deliberately narrow, because a nuclear power station in the same parish shares the project's name — the topic scores articles about the campus rather than everything nearby

## [v02.00g] — 2026-09-04 04:01:12 PM EST — v04.55r

### Added
- One more interest topic is available to switch on, seeded from the study library and arriving flagged as new

### Changed
- Its search terms were chosen to be distinctive rather than broad, so it scores the articles it is actually about instead of padding every equipment story

## [v01.99g] — 2026-09-02 02:41:00 AM EST — v04.22r

### Added
- Stored articles now carry a short, stable identifier alongside their link, so other tools in the suite can refer to the same story reliably over time.

### Fixed
- Two copies of the same story filed under slightly different links are now recognised as one.

## [v01.98g] — 2026-09-01 05:38:51 PM EST — v04.08r

### Fixed
- The edition explainer now reads only the most recent stored stories rather than the entire history, so it stays fast as the archive grows. An edition older than that window reports that it can no longer be explained, as the other archive views already do
- The explainer reports how long it took to assemble, so slowness can be attributed correctly in the app

## [v01.97g] — 2026-09-01 04:30:02 PM EST — v04.07r

### Added
- The edition explainer now reports the contribution of each source individually — stories in, best score reached, and how many cleared the bar — and names any source that returned nothing at all in the window
## [v01.96g] — 2026-09-01 03:41:19 AM EST — v04.06r

### Added
- The scan now reads primary federal sources directly, not only trade coverage of them: White House presidential actions, the Federal Register (energy regulator and tax filings), the Department of Energy newsroom, and EIA's Today in Energy. A federal action is the one kind of story where the original text is both freely available and more useful than the write-up, because the detail that decides scope sits in the definitions a summary leaves out
- Two new tracked topics so federal material scores properly rather than arriving unrecognised: one for bulk-power-system security and equipment restrictions, and a standing one for orders, rules and agency guidance generally

### Changed
- Two agency sites and one newsroom were checked and cannot be read by any automated reader — their feeds either refuse automated clients or do not exist. They are listed as unavailable with the reason, and their output is covered through the Federal Register instead, which is where those actions take legal effect anyway
## [v01.95g] — 2026-09-01 03:24:56 AM EST — v04.05r

### Fixed
- Recorded faults that happened **before** the previous update went out were not being counted, so the health tile stayed hidden and there was no way to open the panel and read them — an empty tile looked like a clean bill of health when it was not. The count now also considers the stored fault detail, so anything already recorded shows up immediately
- More generally, the tile can no longer be silenced by one of its two stores being empty, cleared or out of date — whichever holds more is the one reported, so a fault that has been recorded anywhere is always visible
## [v01.94g] — 2026-09-01 03:16:00 AM EST — v04.04r

### Added
- The app can now show you exactly what went wrong in the background: every recorded fault is served with its time, the step it came from, and its message, so a problem can be read and dealt with in the app instead of the Apps Script console
- Digest managers can mark recorded faults as resolved and clear them, returning the health tile to green once the cause is fixed
- The error count is now exact. It was previously capped at five before it ever reached the app, so five and fifty looked identical; the count is now kept separately from the stored detail and is accurate however many faults occurred

### Fixed
- A failure early in the hourly scheduled run used to leave no trace at all — the run simply stopped reporting, with nothing to explain why. Those failures are now recorded, while still being raised so the existing failure notification is unaffected
## [v01.93g] — 2026-09-01 01:51:37 AM EST — v04.02r

### Fixed
- Signing in no longer fails when the access list is briefly unreachable. If your access was confirmed recently, you are let straight in and the app keeps working while the problem clears
- Access changes still take effect as soon as the list can be read again, and anyone not already on it is asked to wait rather than being let in

## [v01.92g] — 2026-09-01 12:26:40 AM EST — v04.01r

### Added
- When several outlets cover the same story, the edition now prints it once — the most reliable outlet's write-up — with an "Also covered by" line linking every other outlet that ran it. Nothing is lost: each collapsed article keeps its own link, and all of them remain available under "View More" and in the weekly held-back rollup
- The outlet chosen is the one with the strongest track record for your interests: hand-ranked core trade press first, then the outlet's own hit rate across everything scanned so far, and a syndicated republication never outranks the desk that reported the story
- The footer now says how many articles were merged as duplicate coverage, so a genuinely quiet day is distinguishable from a day whose duplicates were folded together

### Changed
- Weekend builds are no longer counted as issues of the paper. Building over the weekend still works and the edition is still stored, searchable and sendable by hand — it simply takes no issue number, so the printed sequence counts only the weekdays the paper publishes on
- Existing editions correct themselves automatically: the weekend builds already stored lose their numbers and the following Monday edition moves down to the number it should always have had
- Stories are only ever grouped when they share a company or topic, a publication day and a section, and a safety or incident story is never folded into a company story

## [v01.91g] — 2026-08-31 08:53:46 PM EST — v04.00r

### Fixed
- Editions dated to a Saturday or Sunday are no longer emailed out with Monday's digest. Building an edition over the weekend is still fine — it is stored, numbered and browsable in the archive, and can still be sent by hand — but the weekday mailing now only carries editions that are themselves dated to a weekday
- A weekday edition that misses its own send still catches up on the next weekday exactly as before, so a Friday edition delayed past midnight is still delivered on Monday
- The delivery record now says why an edition was not mailed on a given morning rather than leaving the entry blank

## [v01.90g] — 2026-08-30 11:13:05 PM EST — v03.97r

### Added
- News tracking now follows the industry's major named data-center and storage projects, so stories about them are scored and surfaced alongside company and topic coverage

## [v01.89g] — 2026-08-30 08:43:06 PM EST — v03.89r

### Added
- Stored articles now carry an event category and the key figures they state, enriching archive views
- Stories that mention two covered companies together are collected as possible-relationship leads
- Older stored items are preserved in long-term storage instead of being deleted as the rolling archive window advances

### Changed
- Archive search now also looks inside article summaries and analysis text
- Lower-scoring stories that mention covered companies are retained for the archive (they never appear in digests)

## [v01.88g] — 2026-08-30 07:14:52 PM EST — v03.88r

### Fixed
- **Long retry waits no longer overrun a build step's time budget.** When there isn't room left to wait, the story simply rejoins the retry queue for a later pass — this is also what caused the "no reply after 90 seconds" errors during manual builds
- **An edition that misses its day is now delivered late instead of never.** Delivery looks back a few days for anything built but unsent, and a late-delivered edition is dated by its own day

### Added
- **The day's remaining email allowance is checked before every send.** If it can't cover the edition, the send is held until the allowance refreshes — and the desk is alerted — rather than failing partway through
- **Background failures now leave a visible trace.** Scheduled-run errors are recorded and shown in the app's status area alongside when the schedule last ran, and update times are logged so intermittent connection errors can be traced

## [v01.87g] — 2026-08-30 06:58:35 PM EST — v03.87r

### Fixed
- **A story whose AI summary fails is now retried instead of being quietly written off.** One bad AI reply used to leave part of an edition carrying plain source excerpts with no analysis — and those stories were never looked at again. Failed stories now go back in the queue and keep being re-attempted through the morning
- **A morning build that fails early now recovers in minutes, not hours.** Retries begin almost immediately and step back gradually across the morning; previously a failure right at build time had no recovery path for a full hour

### Changed
- **Your Morning Digest is only emailed once it is whole.** If any summaries are still missing, the send waits while they are repaired. By a late-morning cutoff the best available edition goes out regardless — its footer says when some summaries fell back to source text — and if nothing could be built at all, the desk is alerted rather than nobody noticing
- **Subscriber privacy:** digest emails no longer reveal the subscriber list to every recipient — each subscriber now receives their copy as a blind copy
- Summaries are requested in smaller batches, so one failed reply affects fewer stories and long replies are less likely to be cut off

## [v01.86g] — 2026-08-30 05:32:47 PM EST — v03.86r

### Changed
- **The line at the bottom of your Morning Digest now reads across two sides.** On the left, what the edition is and how wide a net it cast — *Amber = Analysis by Gemini · 15 relevant of 104 scanned*. On the right, the byline: *Developed by Jon Yang*. The **View More** link keeps its own line underneath
- On a narrow phone the left-hand run wraps onto a second line while the byline stays pinned to the right, so the footer reads correctly at every width

## [v01.85g] — 2026-08-30 04:34:20 PM EST — v03.85r

### Changed
- **Your Morning Digest's footer now says how wide a net the edition cast.** The right-hand side reads *15 relevant of 104 scanned* — the whole relevant set, including anything waiting behind **View More** — so the figure never reads as though stories were withheld. The desk-side numbers taken out in the last version (how many ran, how many were held back by the section caps) stay in the News Stand
- The byline now reads **Developed by Jon Yang** rather than *Published by Jon Yang*

## [v01.84g] — 2026-08-30 04:17:50 PM EST — v03.84r

### Changed
- **The line at the bottom of your Morning Digest is shorter and says who published it.** It now reads *Published by Jon Yang*, and the amber key credits the model behind the analysis by name — *Amber = Analysis by Gemini* — rather than simply marking the colour
- **The coverage tally has been taken out of the edition.** Subscribers no longer see how many stories ran out of how many were relevant, how many were scanned, or how many were held back by the section caps — those are desk numbers, not reader numbers. The **View More** link still tells a reader how many extra stories are waiting
- The separate *summarized by* credit at the end of the footer is gone, because the amber key now names the model in the same breath as it explains the colour

### Added
- Every issue records how many stories it ran and how many it held back, so the desk can read the full coverage tally from the News Stand instead of the edition. Issues built before this change simply show what they always showed

### Notes
- Editions that fall back to raw source text still say so — that is a statement about the content in front of the reader, not an attribution, so it stays

## [v01.83g] — 2026-08-29 01:30:10 AM EST — v03.51r

### Fixed
- **The 6:00 AM build now runs even if you already built that edition by hand.** It previously skipped any edition that had been built at all that day — so an edition you made while testing at 2am was left in place and emailed at 7am instead of being replaced by a fresh one. The scheduled run is now tracked separately from your manual builds: it always produces a new edition, replacing the day's existing one, and still runs only once a day
- **An edition can no longer be emailed while its replacement is still being built.** The 6:00 build runs in stages and can occasionally still be working at 7:00; the send now waits for it rather than mailing the copy it is about to discard

### Notes
- The daily schedule was already correct and is unchanged: build 6:00 AM ET, send 7:00 AM ET, Monday–Friday, with Monday covering 72 hours and Tuesday–Friday covering 24

## [v01.82g] — 2026-08-29 01:19:10 AM EST — v03.50r

### Fixed
- **Editions can no longer be emailed at the weekend.** The weekday rule was applied by the two scheduled runs but not by the part that actually sends, and the hourly catch-up pass calls that part directly — it asked what time it was and never what day. An edition built late on a Friday night, or by hand on a Saturday morning, would have gone out to subscribers at 7:00 that Saturday. The rule now sits with the send itself, so nothing can route around it. A weekend edition stays unsent and is still there to go out on Monday
- The desk's timezone is now set in one place rather than repeated throughout, so the daily schedule can be moved to another zone reliably

## [v01.81g] — 2026-08-29 12:37:08 AM EST — v03.49r

### Fixed
- **The consumer-electronics filtering from the last version now actually reaches your digest.** The words that identify consumer gear were updated, but the category settings they belong to are stored in your Interests sheet and are only refreshed when the update is marked as a newer version — which it was not. So nothing changed and the same article appeared again. Both categories are now marked as updated, and pressing **Sync now** before your next build will pull the new wording in

## [v01.80g] — 2026-08-29 12:17:16 AM EST — v03.48r

### Fixed
- **Consumer gear is now caught by Tune.** A portable power station on an Amazon sale was reaching the digest because none of the switched-off categories recognised that kind of product — "Residential storage" knew about home batteries and Powerwalls but not portable power stations, solar generators or e-bikes, so there was nothing for the filter to act on. Those categories now cover the vocabulary this coverage actually uses, and an article like it is excluded outright rather than merely down-weighted
- Retail-sale language (Prime Day, Black Friday, promotional pricing, coupon codes) also now reads as consumer coverage. Only multi-word phrases are used, so a utility offering a bill discount or a story about a real power station is unaffected
- **The same story can no longer appear twice in one edition.** Google News gives a separate link to each republication of a syndicated story, so an identical headline could arrive twice and both would print. An edition now shows one copy — the higher-scoring one — while both are still counted when working out whether a story was covered by more than one source

### Changed
- **Google News results are worth less than the sources listed in Tune** (developer directive): a story found by company search now needs a considerably stronger match to earn a place. A story genuinely about one of your covered companies still qualifies — that is what the company search is for — but a borderline one no longer rides in alongside the trade press
