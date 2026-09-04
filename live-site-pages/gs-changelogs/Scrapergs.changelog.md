# Changelog — News Scraper (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Scrapergs.changelog-archive.md](Scrapergs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 47/50`

## [Unreleased]

*(No changes yet)*

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

## [v01.79g] — 2026-08-28 11:43:43 PM EST — v03.47r

### Fixed
- **"Why thin?" no longer hangs.** The report was reading every story from every edition ever built — including the long summaries and analyses — when all it needed were a few details from the one edition being asked about. On a spreadsheet with a lot of history that took long enough to look frozen. It now reads only that edition's rows, and only the handful of details it uses

## [v01.78g] — 2026-08-28 11:19:00 PM EST — v03.45r

### Fixed
- **Rebuilding an edition now searches the same companies as the build it replaces.** Alongside the news sources, each build runs a rotating set of twelve company-name searches, and that rotation was moving forward on every build — so a rebuild searched a *different* twelve companies and could come back with noticeably fewer stories than the build it replaced, with nothing about the rebuild to explain why. The rotation still advances each day; it no longer moves under a rebuild of the same day
- **Building one edition no longer uses up another edition's turn in that rotation.** The rotation was shared, so building the morning digest advanced it and the BESS edition built afterwards searched a different set of companies. Each edition now keeps its own place in the rotation

### Added
- **A report explaining why an edition came out thin.** It shows how many stories came in, where their scores landed, how many just missed the relevance bar and by how much, how many were down-weighted for being outside the US market, and how much came from company searches rather than the news sources — so a quiet edition can be read rather than guessed at

## [v01.77g] — 2026-08-28 11:06:15 PM EST — v03.44r

### Fixed
- **"View More" no longer says nothing was held back when stories were.** The count in the footer and the list the link opens were worked out two different ways, so they could disagree — and when the list could not be read, you were told the edition held nothing back rather than that something had gone wrong. The footer now counts the same list the link opens, so the two can no longer contradict each other, and a genuine failure explains itself
- **A large edition can no longer be stored in a state it cannot be read back from.** Editions were saved by cutting them at a fixed length, which on a busy day cut mid-sentence and left the whole record unreadable. A long edition is now shortened deliberately — trimming the held-back stories first, keeping as many as will fit — so it always reads back, and says so when it had to give something up

### Changed
- **The emailed digest sits between the last two sizes.** The previous version was too large on a phone and the one after it a little small; this is the middle. The desktop version is unchanged
- **Figures in a summary are now green rather than white.** Amber already means analysis, and white bold said nothing in particular — green gives the numbers a meaning of their own. Figures inside an analysis stay amber, so the footer key stays true

## [v01.76g] — 2026-08-28 09:48:51 PM EST — v03.43r

### Changed
- **The emailed digest is noticeably smaller on a phone.** Every size came down about two steps — the masthead now fits on one line, headlines wrap far less, and the body sits at a comfortable reading size instead of filling the screen. Spacing between stories was tightened to match, so a whole edition takes much less scrolling. The desktop version is unchanged
- **Rebuilding a digest replaces the earlier one from the same day again**, as it did before. Building a second edition on a day you have already built one leaves you with a single, current issue rather than two
- You still receive only one email per edition per day. That safeguard is kept regardless, so a digest can never be sent to you twice

## [v01.75g] — 2026-08-28 09:39:29 PM EST — v03.42r

### Changed
- **Rebuilding a digest no longer erases the earlier one from the same day.** Both are kept, so you can build a second edition in the afternoon and still open the morning's. Two builds of a day share that day's issue number — they are two takes of one issue, not two issues
- **You still receive only one email per edition per day, however many times you rebuild.** The newest build is the one that goes out; earlier ones are marked as superseded and never mail. If the day's edition has already been sent, rebuilding it afterwards sends nothing at all
- Protection against duplicate copies is unchanged. It now recognises a repeated build of the *same run* — which is what produced the nine copies — instead of treating every rebuild of the day as a duplicate

## [v01.74g] — 2026-08-28 09:04:47 PM EST — v03.41r

### Fixed
- **The emailed edition is now sized for a phone first.** The type sizes that make it readable are written directly onto each element, and the larger desktop sizes are applied on top only when the screen is wide enough. Previously it was the other way round, and Gmail was discarding the block of styling that shrank everything for small screens — leaving a headline built for a laptop wrapping across three lines on a phone. On a 390-pixel screen the masthead now fits on one line and the body runs at a comfortable reading width with no sideways scrolling
- The footer no longer depends on that styling either. It stacks on its own, so the publisher line, the amber key and the View More link stay in order at any width

### Changed
- **Held-back stories now arrive with their summary and analysis.** Opening View More used to show only a headline and a source for work the desk had already read; each story now carries the same summary, and the same amber analysis, that it would have had if it had fit inside a section
- **Every relevant story is summarized, not just the first thirty.** On a heavy news day, stories ranked past thirty cleared the relevance bar, were held back by a section cap, and reached View More with nothing but the raw feed snippet. The summarizing pass now follows the relevance bar rather than a fixed count, up to a ceiling of seventy. On a quiet day it is also cheaper, since it no longer summarizes stories that scored too low to be printed anywhere

## [v01.73g] — 2026-08-28 08:42:20 PM EST — v03.40r

### Changed
- **Each story takes up less room.** The separate "What it means" heading and the rule above it are gone; the analysis now runs on from the summary in the same paragraph, marked in amber. Measured on a phone, an edition is about 11 per cent shorter for the same content — roughly 46 pixels back per story
- A short **Amber = analysis** key now sits in the footer, in amber, and only appears when the edition actually contains analysis
- **Figures are no longer amber.** They are still bold, now in the brighter headline ink. Amber was doing two jobs at once — marking figures and marking analysis — which would have made the new key untrue. In the body it now means one thing

## [v01.72g] — 2026-08-28 08:33:28 PM EST — v03.39r

### Changed
- **The reporting and the interpretation are now visibly separate.** Each story gives you what the article says, then a short **What it means** passage underneath — set off by a rule and a label, so it is always clear which sentences come from the source and which are the desk's read
- **The interpretation is written at the confidence it deserves.** Where the desk is extrapolating it now says so, favouring conditional language over flat assertion. Facts the article reports directly are still stated plainly — the aim is that you can tell how much weight a claim carries, not that everything is hedged
- The lead story is split the same way, so the edition reads consistently from the top
- Editions published before this release are unaffected and display exactly as they did, and a story whose summary fell back to raw source text is shown without an interpretation rather than with a manufactured one

## [v01.71g] — 2026-08-28 08:02:19 PM EST — v03.38r

### Fixed
- **Stories about the UK are now recognised as foreign.** The country list knew "United Kingdom" and "Britain" but not the abbreviation headlines actually use, so a UK datacenter story was treated as having no country at all and kept its full score. The EU and a few other common abbreviations were missing the same way
- **The lead story must now clear the relevance bar.** Sections already required it, but the lead was chosen from the highest-scoring items regardless — so on a day with few qualifying stories, the most prominent item in the edition could be one that never qualified
- **Corroboration can no longer push a weak story over the bar.** Being covered by several outlets adds to an article's score, but that was being added on top of a score whose supporting signals had already been capped. It is now bounded by the same limit, and reduced for foreign stories like every other part of the score

### Changed
- **Each edition now summarises from its own point of view.** Every summary used to close from a BESS seller's perspective because that viewpoint was fixed in one place. The AIDC edition now identifies which part of the data-center power chain a story touches — generation, interconnection, transformers, cooling and water, siting, tariffs — and closes on what it means for people working in that part. The BESS edition is unchanged in intent
- Closing lines are deliberately not templated. Each edition specifies what its closing thought must accomplish, not how to word it, and the summariser is asked to vary its phrasing rather than end every item the same way
- The rubric tester now scores against the edition selected in the Digest panel, and states the bar it judged against and whether the article cleared it. It was scoring against a general profile no edition actually uses, so it could disagree with the digest it was being used to explain

## [v01.70g] — 2026-08-28 07:42:36 PM EST — v03.37r

### Changed
- **An article now has to be about something you cover, not merely well written.** Length, a figure, a quotation and an action verb are marks of good writing, not of relevance, and an article that had all four could reach the relevance bar on those alone. Those supporting marks are now limited in proportion to how strongly the article actually matches your companies, topics and segments
- **Matching one of your segments now counts in an article's favour**, rather than only ever being used to rule articles out. A market or policy story that names no covered company can still earn its place; a story that matches only a loose topic no longer can
- The relevance bar was raised slightly. A story naming one of your covered companies clears it comfortably, so this only affects borderline items
- The rubric tester now says when an article was held back for thin evidence, and what its evidence and supporting scores were

## [v01.69g] — 2026-08-28 07:28:57 PM EST — v03.36r

### Fixed
- **Building an edition no longer produces multiple copies of it.** A build could finish without the app being told, so the app kept asking it to continue and a new copy of the edition was filed on every attempt. Introduced in the previous release and fixed here
- Rebuilding an edition now **replaces** that day's copy instead of adding another, so the same fault can never leave more than one copy again — and the duplicates already on your shelf are cleared the next time that edition is built
- A rebuild keeps the record of an edition having already been emailed, so rebuilding something that already went out will not send it twice

## [v01.68g] — 2026-08-28 06:57:56 PM EST — v03.35r

### Fixed
- **Your editions now actually arrive at 7:00 on weekday mornings.** The scheduler advanced the build by one small step per hour, so the first edition could not finish before mid-afternoon and the second and third were pushed to later days. The build now starts at 6:00 and runs continuously until it is done, and everything ready is emailed at 7:00
- All three editions are built the same morning instead of one per day
- Running a build by hand no longer wipes the progress of a build the scheduler already had underway — each edition keeps its own place in the queue

### Changed
- **Building an edition no longer emails it.** Pressing "Run intake now" builds silently, so you can rebuild as often as you like without anything reaching your subscribers. To send by hand, use **Go-live → Email me latest**
- Sending is now a separate step from building, so an edition finished early waits for 7:00 rather than going out at 6:20
- Each edition records when it was delivered. If nobody is subscribed to an edition, that is recorded on the edition instead of being skipped in silence — the previous behaviour gave no indication at all

## [v01.67g] — 2026-08-28 05:58:49 PM EST — v03.34r

### Changed
- **Scoring now treats the US market as the clear priority.** Stories about other countries are heavily devalued, so they no longer crowd out US coverage or take the lead slot
- China, Mexico, Chile and Canada are treated as a closer second tier — devalued, but far less sharply than the rest of the world
- A story about any other country that also touches the US market — a shipment, a tariff, a US buyer — keeps most of its score. The devaluation is aimed at coverage with no bearing on your market, not at anything foreign
- Stories that name no country at all are completely unaffected. Most US trade coverage never says "United States", so nothing is penalised for simply failing to say where it is
- The rubric tester now shows when geography lowered a score, which countries it found, and whether a US connection softened it

## [v01.66g] — 2026-08-28 05:46:45 PM EST — v03.33r

### Fixed
- **An edition no longer loses every summary because one batch of them failed.** A single unusable reply from the AI used to abandon the rest of the edition, so all thirty stories dropped to raw source text at once. Now only the handful in that batch fall back, and the rest are summarized normally
- Summaries that arrive cut off part-way are salvaged instead of discarded — the complete ones are kept and only the unfinished one is dropped
- Unusable replies are retried before anything is given up on. Most succeed on the second attempt
- The summarizer is given a much larger writing budget, so long summaries are far less likely to be cut off in the first place
- When something does fall back, the edition footer now says a few summaries used source text rather than claiming the whole edition did
- The status message now names what actually went wrong — cut off, unreadable, or blocked — instead of one catch-all

## [v01.65g] — 2026-08-28 05:34:27 PM EST — v03.32r

### Fixed
- **Issue numbers now match the editions you actually have.** The number was counting rows in the archive rather than issues of the edition it belonged to, so it climbed past the number of editions on the shelf and never came back down when you deleted old ones
- Each edition now counts its own issues from No. 001 — the BESS and AIDC editions no longer inherit the count of your main morning edition
- Rebuilding a day's edition keeps that day's issue number instead of taking the next one
- Deleting an edition immediately renumbers the ones that remain, so the sequence stays unbroken — in the app, in share links, and in the stored copy itself
- The numbering is refreshed once more just before an edition is emailed. The copy in your inbox is the one that can never be corrected later, so it is the one that most needs to be right when it is sent
- **Past editions are now always listed in date order.** They were listed in the order they were built, so rebuilding an older day pushed it to the top of the News Stand ahead of newer editions
- Each edition in the News Stand now carries its issue number

## [v01.64g] — 2026-08-28 05:22:01 PM EST — v03.31r

### Changed
- When an edition holds nothing back, the footer's right-hand slot is now left empty rather than offering a link into the app. An edition that showed you everything relevant has nothing more to offer

## [v01.63g] — 2026-08-28 05:16:12 PM EST — v03.30r

### Changed
- Emailed editions are now built for reading on a phone: the page fits the screen with no sideways scrolling, and the masthead, headlines, and body text scale down to stay readable. On a desktop or in the app the edition looks exactly as it did
- "The Morning Edition" is now "Your Morning Digest", and its BESS and AIDC versions are "Your Morning Digest (BESS)" and "Your Morning Digest (AIDC)". Editions already published show the new name too
- The footer's "Tune tomorrow's edition" link is now **View More**, which opens the stories that were held back by a section's cap. When nothing was held back it offers a way into the app instead

### Added
- Every edition now keeps its own list of held-back stories, so View More works on any edition you open — not only the most recent one
- Shared edition links now get the same corrections applied when they are opened: current masthead, and article links that open reliably no matter which Google account the reader is signed into

## [v01.62g] — 2026-08-28 06:28:13 AM EST — v03.29r

### Fixed
- **Article links no longer depend on which Google account you happen to be signed into.** They are built to point at the app's own page rather than straight at the script, which is what was causing an account chooser to appear instead of the article for anyone signed into more than one account. Readers with no Google account at all are unaffected either way
- Editions built before this fix are corrected when they are opened, so older editions work too

### Changed
- The destination lookup can now answer in a form the page can read directly, which is what lets the page forward you without an extra visible step. The older form still works, so links in editions already delivered by email keep resolving

## [v01.61g] — 2026-08-28 06:02:57 AM EST — v03.28r

### Fixed
- **Article links in older editions worked again.** Building an edition used to clear the record of where every previously stored article actually pointed, so from the moment the next edition was built, every article link in every earlier edition — on the page and in editions already delivered by email — stopped opening the article and dropped you on the app's home screen instead. That record is now kept for as long as the edition it belongs to
- **Searching the archive, the company timeline, and source statistics now cover every stored edition** rather than only the most recently built one. They read the same record and had been quietly reduced to a single edition's worth of stories by the same cause
- Opening an article link no longer gets slower as the archive grows

### Changed
- Leftovers from a build that was interrupted are still cleared away, and stories older than roughly sixteen weeks of daily editions are retired. A link older than that opens the app rather than the article — the behaviour every link had before this fix

## [v01.60g] — 2026-08-28 05:44:48 AM EST — v03.27r

### Added
- **Read-only share links.** An edition can be given a link that anyone can open without signing in. Each link points at one edition only — editing the address cannot reach a different one — and revoking a link stops it working straight away
- Pressing Share twice on the same edition reuses the existing link rather than creating a second one to keep track of
- A share link records how many times it has been opened

### Changed
- Editions delete cleanly: a link created for an edition that has since been removed says so plainly instead of showing an empty page

## [v01.59g] — 2026-08-28 04:35:51 AM EST — v03.26r

### Changed
- **Far more of your past editions are kept.** Retention rises from roughly four working days to about six months of daily editions, now that loading the list no longer has to move every stored edition to draw it
- **Opening the app is much lighter.** Listing past editions, opening one, deleting one and emailing yourself the latest all now read just the parts they need rather than the whole archive

### Added
- Past editions can be filtered by edition, date range and text, and are delivered a page at a time with a count per edition
- An edition can be marked as a variant of another, so a parent and its variants group together and filtering by the parent includes them

### Fixed
- Clearing every edition from a subscriber is refused with an explanation rather than quietly signing them up to everything

## [v01.58g] — 2026-08-28 02:27:57 AM EST — v03.25r

### Added
- Delivery details now report the people on your subscriber list, so the home screen and the Digest panel agree with who actually receives an edition
- Stored editions now report which edition built them

### Changed
- Removing the last edition from a subscriber is now refused with an explanation instead of quietly signing them up to everything
- Pausing a subscriber is kept separate from their edition choices, so resuming restores exactly what they had

## [v01.57g] — 2026-08-28 01:38:29 AM EST — v03.24r

### Fixed
- **Turning a narrow segment off now actually keeps that news out.** A story about a switched-off segment could still get in — and even lead the edition — because a broader, still-on segment covering the same ground vouched for it. A broad category no longer speaks for a narrower one you have switched off
- **A switched-off segment now excludes a story even when no company you follow is involved.** Previously switching a segment off only removed the boost a story got from mentioning one of your companies, so a story from an unfamiliar vendor could still ride in on loosely matched topics. A story about a segment you turned off can no longer reach the relevance bar at all
- **A busy AI service no longer costs you the whole edition.** When the summariser replies "too busy, try again", that is now waited out and retried over about a minute instead of being treated as a hard failure that dropped every summary to the basic non-AI fallback. Genuine problems, like a bad key, still fail immediately rather than wasting your daily allowance
- A few filter words were too broad to carry a match on their own — "warranty", "supply chain", and the generic phrase for grid-scale batteries appearing in the utility-scale list. They were letting unrelated stories score as if they were on-topic

## [v01.56g] — 2026-08-28 12:53:40 AM EST — v03.23r

### Fixed
- **Switching a segment or topic ON for a single edition did not stick.** The change was saved as OFF, so a second later the switch snapped back to where it started. Turning something off worked, which is why the problem looked intermittent. Your choices now save exactly as made
- Older entries moved to the archive

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

