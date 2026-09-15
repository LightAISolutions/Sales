# Changelog Archive — News Scraper (Google Apps Script)

Older version sections rotated from [Scrapergs.changelog.md](Scrapergs.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

## [v01.79g] — 2026-08-28 11:43:43 PM EST — v03.47r — [4647ef5](https://github.com/LightAISolutions/Sales/commit/4647ef5)

### Fixed
- **"Why thin?" no longer hangs.** The report was reading every story from every edition ever built — including the long summaries and analyses — when all it needed were a few details from the one edition being asked about. On a spreadsheet with a lot of history that took long enough to look frozen. It now reads only that edition's rows, and only the handful of details it uses

## [v01.78g] — 2026-08-28 11:19:00 PM EST — v03.45r — [a702e4b](https://github.com/LightAISolutions/Sales/commit/a702e4b)

### Fixed
- **Rebuilding an edition now searches the same companies as the build it replaces.** Alongside the news sources, each build runs a rotating set of twelve company-name searches, and that rotation was moving forward on every build — so a rebuild searched a *different* twelve companies and could come back with noticeably fewer stories than the build it replaced, with nothing about the rebuild to explain why. The rotation still advances each day; it no longer moves under a rebuild of the same day
- **Building one edition no longer uses up another edition's turn in that rotation.** The rotation was shared, so building the morning digest advanced it and the BESS edition built afterwards searched a different set of companies. Each edition now keeps its own place in the rotation

### Added
- **A report explaining why an edition came out thin.** It shows how many stories came in, where their scores landed, how many just missed the relevance bar and by how much, how many were down-weighted for being outside the US market, and how much came from company searches rather than the news sources — so a quiet edition can be read rather than guessed at

## [v01.77g] — 2026-08-28 11:06:15 PM EST — v03.44r — [be4dd94](https://github.com/LightAISolutions/Sales/commit/be4dd94)

### Fixed
- **"View More" no longer says nothing was held back when stories were.** The count in the footer and the list the link opens were worked out two different ways, so they could disagree — and when the list could not be read, you were told the edition held nothing back rather than that something had gone wrong. The footer now counts the same list the link opens, so the two can no longer contradict each other, and a genuine failure explains itself
- **A large edition can no longer be stored in a state it cannot be read back from.** Editions were saved by cutting them at a fixed length, which on a busy day cut mid-sentence and left the whole record unreadable. A long edition is now shortened deliberately — trimming the held-back stories first, keeping as many as will fit — so it always reads back, and says so when it had to give something up

### Changed
- **The emailed digest sits between the last two sizes.** The previous version was too large on a phone and the one after it a little small; this is the middle. The desktop version is unchanged
- **Figures in a summary are now green rather than white.** Amber already means analysis, and white bold said nothing in particular — green gives the numbers a meaning of their own. Figures inside an analysis stay amber, so the footer key stays true

## [v01.76g] — 2026-08-28 09:48:51 PM EST — v03.43r — [0346350](https://github.com/LightAISolutions/Sales/commit/0346350)

### Changed
- **The emailed digest is noticeably smaller on a phone.** Every size came down about two steps — the masthead now fits on one line, headlines wrap far less, and the body sits at a comfortable reading size instead of filling the screen. Spacing between stories was tightened to match, so a whole edition takes much less scrolling. The desktop version is unchanged
- **Rebuilding a digest replaces the earlier one from the same day again**, as it did before. Building a second edition on a day you have already built one leaves you with a single, current issue rather than two
- You still receive only one email per edition per day. That safeguard is kept regardless, so a digest can never be sent to you twice

## [v01.75g] — 2026-08-28 09:39:29 PM EST — v03.42r — [58891ed](https://github.com/LightAISolutions/Sales/commit/58891ed)

### Changed
- **Rebuilding a digest no longer erases the earlier one from the same day.** Both are kept, so you can build a second edition in the afternoon and still open the morning's. Two builds of a day share that day's issue number — they are two takes of one issue, not two issues
- **You still receive only one email per edition per day, however many times you rebuild.** The newest build is the one that goes out; earlier ones are marked as superseded and never mail. If the day's edition has already been sent, rebuilding it afterwards sends nothing at all
- Protection against duplicate copies is unchanged. It now recognises a repeated build of the *same run* — which is what produced the nine copies — instead of treating every rebuild of the day as a duplicate

## [v01.74g] — 2026-08-28 09:04:47 PM EST — v03.41r — [30cff4c](https://github.com/LightAISolutions/Sales/commit/30cff4c)

### Fixed
- **The emailed edition is now sized for a phone first.** The type sizes that make it readable are written directly onto each element, and the larger desktop sizes are applied on top only when the screen is wide enough. Previously it was the other way round, and Gmail was discarding the block of styling that shrank everything for small screens — leaving a headline built for a laptop wrapping across three lines on a phone. On a 390-pixel screen the masthead now fits on one line and the body runs at a comfortable reading width with no sideways scrolling
- The footer no longer depends on that styling either. It stacks on its own, so the publisher line, the amber key and the View More link stay in order at any width

### Changed
- **Held-back stories now arrive with their summary and analysis.** Opening View More used to show only a headline and a source for work the desk had already read; each story now carries the same summary, and the same amber analysis, that it would have had if it had fit inside a section
- **Every relevant story is summarized, not just the first thirty.** On a heavy news day, stories ranked past thirty cleared the relevance bar, were held back by a section cap, and reached View More with nothing but the raw feed snippet. The summarizing pass now follows the relevance bar rather than a fixed count, up to a ceiling of seventy. On a quiet day it is also cheaper, since it no longer summarizes stories that scored too low to be printed anywhere

## [v01.73g] — 2026-08-28 08:42:20 PM EST — v03.40r — [dad570a](https://github.com/LightAISolutions/Sales/commit/dad570a)

### Changed
- **Each story takes up less room.** The separate "What it means" heading and the rule above it are gone; the analysis now runs on from the summary in the same paragraph, marked in amber. Measured on a phone, an edition is about 11 per cent shorter for the same content — roughly 46 pixels back per story
- A short **Amber = analysis** key now sits in the footer, in amber, and only appears when the edition actually contains analysis
- **Figures are no longer amber.** They are still bold, now in the brighter headline ink. Amber was doing two jobs at once — marking figures and marking analysis — which would have made the new key untrue. In the body it now means one thing

## [v01.72g] — 2026-08-28 08:33:28 PM EST — v03.39r — [02ffe26](https://github.com/LightAISolutions/Sales/commit/02ffe26)

### Changed
- **The reporting and the interpretation are now visibly separate.** Each story gives you what the article says, then a short **What it means** passage underneath — set off by a rule and a label, so it is always clear which sentences come from the source and which are the desk's read
- **The interpretation is written at the confidence it deserves.** Where the desk is extrapolating it now says so, favouring conditional language over flat assertion. Facts the article reports directly are still stated plainly — the aim is that you can tell how much weight a claim carries, not that everything is hedged
- The lead story is split the same way, so the edition reads consistently from the top
- Editions published before this release are unaffected and display exactly as they did, and a story whose summary fell back to raw source text is shown without an interpretation rather than with a manufactured one

## [v01.71g] — 2026-08-28 08:02:19 PM EST — v03.38r — [449ed2c](https://github.com/LightAISolutions/Sales/commit/449ed2c)

### Fixed
- **Stories about the UK are now recognised as foreign.** The country list knew "United Kingdom" and "Britain" but not the abbreviation headlines actually use, so a UK datacenter story was treated as having no country at all and kept its full score. The EU and a few other common abbreviations were missing the same way
- **The lead story must now clear the relevance bar.** Sections already required it, but the lead was chosen from the highest-scoring items regardless — so on a day with few qualifying stories, the most prominent item in the edition could be one that never qualified
- **Corroboration can no longer push a weak story over the bar.** Being covered by several outlets adds to an article's score, but that was being added on top of a score whose supporting signals had already been capped. It is now bounded by the same limit, and reduced for foreign stories like every other part of the score

### Changed
- **Each edition now summarises from its own point of view.** Every summary used to close from a BESS seller's perspective because that viewpoint was fixed in one place. The AIDC edition now identifies which part of the data-center power chain a story touches — generation, interconnection, transformers, cooling and water, siting, tariffs — and closes on what it means for people working in that part. The BESS edition is unchanged in intent
- Closing lines are deliberately not templated. Each edition specifies what its closing thought must accomplish, not how to word it, and the summariser is asked to vary its phrasing rather than end every item the same way
- The rubric tester now scores against the edition selected in the Digest panel, and states the bar it judged against and whether the article cleared it. It was scoring against a general profile no edition actually uses, so it could disagree with the digest it was being used to explain

## [v01.70g] — 2026-08-28 07:42:36 PM EST — v03.37r — [610d568](https://github.com/LightAISolutions/Sales/commit/610d568)

### Changed
- **An article now has to be about something you cover, not merely well written.** Length, a figure, a quotation and an action verb are marks of good writing, not of relevance, and an article that had all four could reach the relevance bar on those alone. Those supporting marks are now limited in proportion to how strongly the article actually matches your companies, topics and segments
- **Matching one of your segments now counts in an article's favour**, rather than only ever being used to rule articles out. A market or policy story that names no covered company can still earn its place; a story that matches only a loose topic no longer can
- The relevance bar was raised slightly. A story naming one of your covered companies clears it comfortably, so this only affects borderline items
- The rubric tester now says when an article was held back for thin evidence, and what its evidence and supporting scores were

## [v01.69g] — 2026-08-28 07:28:57 PM EST — v03.36r — [d212517](https://github.com/LightAISolutions/Sales/commit/d212517)

### Fixed
- **Building an edition no longer produces multiple copies of it.** A build could finish without the app being told, so the app kept asking it to continue and a new copy of the edition was filed on every attempt. Introduced in the previous release and fixed here
- Rebuilding an edition now **replaces** that day's copy instead of adding another, so the same fault can never leave more than one copy again — and the duplicates already on your shelf are cleared the next time that edition is built
- A rebuild keeps the record of an edition having already been emailed, so rebuilding something that already went out will not send it twice

## [v01.68g] — 2026-08-28 06:57:56 PM EST — v03.35r — [5d8a1f0](https://github.com/LightAISolutions/Sales/commit/5d8a1f0)

### Fixed
- **Your editions now actually arrive at 7:00 on weekday mornings.** The scheduler advanced the build by one small step per hour, so the first edition could not finish before mid-afternoon and the second and third were pushed to later days. The build now starts at 6:00 and runs continuously until it is done, and everything ready is emailed at 7:00
- All three editions are built the same morning instead of one per day
- Running a build by hand no longer wipes the progress of a build the scheduler already had underway — each edition keeps its own place in the queue

### Changed
- **Building an edition no longer emails it.** Pressing "Run intake now" builds silently, so you can rebuild as often as you like without anything reaching your subscribers. To send by hand, use **Go-live → Email me latest**
- Sending is now a separate step from building, so an edition finished early waits for 7:00 rather than going out at 6:20
- Each edition records when it was delivered. If nobody is subscribed to an edition, that is recorded on the edition instead of being skipped in silence — the previous behaviour gave no indication at all

## [v01.67g] — 2026-08-28 05:58:49 PM EST — v03.34r — [76bdd29](https://github.com/LightAISolutions/Sales/commit/76bdd29)

### Changed
- **Scoring now treats the US market as the clear priority.** Stories about other countries are heavily devalued, so they no longer crowd out US coverage or take the lead slot
- China, Mexico, Chile and Canada are treated as a closer second tier — devalued, but far less sharply than the rest of the world
- A story about any other country that also touches the US market — a shipment, a tariff, a US buyer — keeps most of its score. The devaluation is aimed at coverage with no bearing on your market, not at anything foreign
- Stories that name no country at all are completely unaffected. Most US trade coverage never says "United States", so nothing is penalised for simply failing to say where it is
- The rubric tester now shows when geography lowered a score, which countries it found, and whether a US connection softened it

## [v01.66g] — 2026-08-28 05:46:45 PM EST — v03.33r — [fb27634](https://github.com/LightAISolutions/Sales/commit/fb27634)

### Fixed
- **An edition no longer loses every summary because one batch of them failed.** A single unusable reply from the AI used to abandon the rest of the edition, so all thirty stories dropped to raw source text at once. Now only the handful in that batch fall back, and the rest are summarized normally
- Summaries that arrive cut off part-way are salvaged instead of discarded — the complete ones are kept and only the unfinished one is dropped
- Unusable replies are retried before anything is given up on. Most succeed on the second attempt
- The summarizer is given a much larger writing budget, so long summaries are far less likely to be cut off in the first place
- When something does fall back, the edition footer now says a few summaries used source text rather than claiming the whole edition did
- The status message now names what actually went wrong — cut off, unreadable, or blocked — instead of one catch-all

## [v01.65g] — 2026-08-28 05:34:27 PM EST — v03.32r — [61ef1fa](https://github.com/LightAISolutions/Sales/commit/61ef1fa)

### Fixed
- **Issue numbers now match the editions you actually have.** The number was counting rows in the archive rather than issues of the edition it belonged to, so it climbed past the number of editions on the shelf and never came back down when you deleted old ones
- Each edition now counts its own issues from No. 001 — the BESS and AIDC editions no longer inherit the count of your main morning edition
- Rebuilding a day's edition keeps that day's issue number instead of taking the next one
- Deleting an edition immediately renumbers the ones that remain, so the sequence stays unbroken — in the app, in share links, and in the stored copy itself
- The numbering is refreshed once more just before an edition is emailed. The copy in your inbox is the one that can never be corrected later, so it is the one that most needs to be right when it is sent
- **Past editions are now always listed in date order.** They were listed in the order they were built, so rebuilding an older day pushed it to the top of the News Stand ahead of newer editions
- Each edition in the News Stand now carries its issue number

## [v01.64g] — 2026-08-28 05:22:01 PM EST — v03.31r — [24178db](https://github.com/LightAISolutions/Sales/commit/24178db)

### Changed
- When an edition holds nothing back, the footer's right-hand slot is now left empty rather than offering a link into the app. An edition that showed you everything relevant has nothing more to offer

## [v01.63g] — 2026-08-28 05:16:12 PM EST — v03.30r — [8e42dec](https://github.com/LightAISolutions/Sales/commit/8e42dec)

### Changed
- Emailed editions are now built for reading on a phone: the page fits the screen with no sideways scrolling, and the masthead, headlines, and body text scale down to stay readable. On a desktop or in the app the edition looks exactly as it did
- "The Morning Edition" is now "Your Morning Digest", and its BESS and AIDC versions are "Your Morning Digest (BESS)" and "Your Morning Digest (AIDC)". Editions already published show the new name too
- The footer's "Tune tomorrow's edition" link is now **View More**, which opens the stories that were held back by a section's cap. When nothing was held back it offers a way into the app instead

### Added
- Every edition now keeps its own list of held-back stories, so View More works on any edition you open — not only the most recent one
- Shared edition links now get the same corrections applied when they are opened: current masthead, and article links that open reliably no matter which Google account the reader is signed into

## [v01.62g] — 2026-08-28 06:28:13 AM EST — v03.29r — [2c273c4](https://github.com/LightAISolutions/Sales/commit/2c273c4)

### Fixed
- **Article links no longer depend on which Google account you happen to be signed into.** They are built to point at the app's own page rather than straight at the script, which is what was causing an account chooser to appear instead of the article for anyone signed into more than one account. Readers with no Google account at all are unaffected either way
- Editions built before this fix are corrected when they are opened, so older editions work too

### Changed
- The destination lookup can now answer in a form the page can read directly, which is what lets the page forward you without an extra visible step. The older form still works, so links in editions already delivered by email keep resolving

## [v01.61g] — 2026-08-28 06:02:57 AM EST — v03.28r — [eaa3714](https://github.com/LightAISolutions/Sales/commit/eaa3714)

### Fixed
- **Article links in older editions worked again.** Building an edition used to clear the record of where every previously stored article actually pointed, so from the moment the next edition was built, every article link in every earlier edition — on the page and in editions already delivered by email — stopped opening the article and dropped you on the app's home screen instead. That record is now kept for as long as the edition it belongs to
- **Searching the archive, the company timeline, and source statistics now cover every stored edition** rather than only the most recently built one. They read the same record and had been quietly reduced to a single edition's worth of stories by the same cause
- Opening an article link no longer gets slower as the archive grows

### Changed
- Leftovers from a build that was interrupted are still cleared away, and stories older than roughly sixteen weeks of daily editions are retired. A link older than that opens the app rather than the article — the behaviour every link had before this fix

## [v01.60g] — 2026-08-28 05:44:48 AM EST — v03.27r — [b0ef21c](https://github.com/LightAISolutions/Sales/commit/b0ef21c)

### Added
- **Read-only share links.** An edition can be given a link that anyone can open without signing in. Each link points at one edition only — editing the address cannot reach a different one — and revoking a link stops it working straight away
- Pressing Share twice on the same edition reuses the existing link rather than creating a second one to keep track of
- A share link records how many times it has been opened

### Changed
- Editions delete cleanly: a link created for an edition that has since been removed says so plainly instead of showing an empty page

## [v01.59g] — 2026-08-28 04:35:51 AM EST — v03.26r — [7faf9f0](https://github.com/LightAISolutions/Sales/commit/7faf9f0)

### Changed
- **Far more of your past editions are kept.** Retention rises from roughly four working days to about six months of daily editions, now that loading the list no longer has to move every stored edition to draw it
- **Opening the app is much lighter.** Listing past editions, opening one, deleting one and emailing yourself the latest all now read just the parts they need rather than the whole archive

### Added
- Past editions can be filtered by edition, date range and text, and are delivered a page at a time with a count per edition
- An edition can be marked as a variant of another, so a parent and its variants group together and filtering by the parent includes them

### Fixed
- Clearing every edition from a subscriber is refused with an explanation rather than quietly signing them up to everything

## [v01.58g] — 2026-08-28 02:27:57 AM EST — v03.25r — [e482172](https://github.com/LightAISolutions/Sales/commit/e482172)

### Added
- Delivery details now report the people on your subscriber list, so the home screen and the Digest panel agree with who actually receives an edition
- Stored editions now report which edition built them

### Changed
- Removing the last edition from a subscriber is now refused with an explanation instead of quietly signing them up to everything
- Pausing a subscriber is kept separate from their edition choices, so resuming restores exactly what they had

## [v01.57g] — 2026-08-28 01:38:29 AM EST — v03.24r — [21a984a](https://github.com/LightAISolutions/Sales/commit/21a984a)

### Fixed
- **Turning a narrow segment off now actually keeps that news out.** A story about a switched-off segment could still get in — and even lead the edition — because a broader, still-on segment covering the same ground vouched for it. A broad category no longer speaks for a narrower one you have switched off
- **A switched-off segment now excludes a story even when no company you follow is involved.** Previously switching a segment off only removed the boost a story got from mentioning one of your companies, so a story from an unfamiliar vendor could still ride in on loosely matched topics. A story about a segment you turned off can no longer reach the relevance bar at all
- **A busy AI service no longer costs you the whole edition.** When the summariser replies "too busy, try again", that is now waited out and retried over about a minute instead of being treated as a hard failure that dropped every summary to the basic non-AI fallback. Genuine problems, like a bad key, still fail immediately rather than wasting your daily allowance
- A few filter words were too broad to carry a match on their own — "warranty", "supply chain", and the generic phrase for grid-scale batteries appearing in the utility-scale list. They were letting unrelated stories score as if they were on-topic

## [v01.56g] — 2026-08-28 12:53:40 AM EST — v03.23r — [7a9c704](https://github.com/LightAISolutions/Sales/commit/7a9c704)

### Fixed
- **Switching a segment or topic ON for a single edition did not stick.** The change was saved as OFF, so a second later the switch snapped back to where it started. Turning something off worked, which is why the problem looked intermittent. Your choices now save exactly as made
- Older entries moved to the archive

## [v01.55g] — 2026-08-28 12:36:36 AM EST — v03.22r — [c9cd23b](https://github.com/LightAISolutions/Sales/commit/c9cd23b)

### Changed
- **A new edition no longer starts out following your main edition's settings.** When you create one you pick the starting point you want, and every segment and topic is written into that edition immediately — so it is its own publication from the moment it exists, and changing your main edition never quietly changes it
- Your two focused editions were rebuilt on the same footing, so every switch in them is now theirs rather than borrowed
- Choices you have not yet made are no longer left undecided: if a new segment or topic is added later, each edition is given its own answer for it straight away instead of falling back to the shared setting

### Added
- **Starting points to choose from** when creating an edition — everything on, a utility-scale storage focus, a data-center power-chain focus, or follow the shared settings
- **Reset to recommended** — put an edition back to its starting point, or move it onto a different one, without deleting and rebuilding it

## [v01.54g] — 2026-08-28 12:02:02 AM EST — v03.21r — [3861d8e](https://github.com/LightAISolutions/Sales/commit/3861d8e)

### Added
- **Editions can now differ from one another.** Each edition keeps its own answers for which business segments and topics it follows, layered on top of your shared settings. An edition only stores what it actually changes, so anything you have not adjusted follows the shared setting and keeps following it when you change your mind later
- **Two new editions** alongside the original: one focused on utility-scale storage, and one focused on the data-center power chain. The original is untouched and reads exactly as it did
- **Many more filters to choose from.** Storage is now separated by scale — utility-scale, data-center, residential, commercial, and long-duration — and the data-center power chain is separated into medium-voltage conversion, inverters, transformers, backup generators, turbines and engines, skid-mounted power, rack power, server power supplies, accelerator chips, and cooling. New topics cover storage contracting, warranties and degradation, interconnection queues, and power density. All start switched on, so nothing changes until you decide otherwise

### Changed
- The edition's own name now appears on the emailed edition, so the three read as distinct publications rather than three copies of one
- Older entries moved to the archive

## [v01.53g] — 2026-08-27 11:51:21 PM EST — v03.20r — [886efa3](https://github.com/LightAISolutions/Sales/commit/886efa3fb3db9a3069c57e7be4bbaeee47d66508)

### Changed
- **An outlet whose site is gone is no longer listed at all.** It cannot be turned on or off, so showing it was only clutter. Its history is kept behind the scenes, and putting the outlet back on the roster still brings it back
- An outlet that is still publishing but refuses automated readers stays listed, so it is clear the beat is uncovered on purpose

## [v01.52g] — 2026-08-27 11:21:39 PM EST — v03.19r — [0dc2474](https://github.com/LightAISolutions/Sales/commit/0dc2474d5dab83a58ee3b3d588a417102f7d59dd)

### Fixed
- **A retired news outlet no longer says "coverage ended".** That wording belongs to a company you have stopped following; used for an outlet it claimed the publication had shut down, which was untrue for two of the three outlets dropped during the source review. Outlets now carry their own wording, and each one records the actual reason it was dropped — whether it is still publishing but refuses automated readers, or its site is genuinely gone — along with the date that was last checked
- Outlets dropped before this change are relabelled automatically on the next sync

## [v01.51g] — 2026-08-27 11:05:42 PM EST — v03.18r — [4d7f22b](https://github.com/LightAISolutions/Sales/commit/4d7f22bcf33d6d4d84560f45a327afe75b50a526)

### Fixed
- **The real reason company briefings stopped being read.** Just over half of the covered companies describe who a product is sold to as one written-out phrase rather than a list, and the reader only accepted the list form — it stopped on the first company written the other way and moved on without reading it, every time. Both forms are now understood, so every covered company can be read
- **Flagship product names were never picked up.** The reader was looking for those names in the wrong place, so it always found nothing. They now feed into the terms used to spot a company in the news, which should surface stories that mention a product without naming the company
- A written-out phrase is split sensibly rather than chopped at every comma, so a grouping like "labs (A, B)" stays whole, and long prose is left out of the segment list instead of being treated as a segment

### Changed
- **"Read all dossiers" now re-reads every covered company**, not only the ones never read before — so companies read under the old, partly-broken reader are brought up to date too. It still works through them automatically and stops when finished

### Removed
- Older entries moved to the archive

## [v01.50g] — 2026-08-27 10:55:12 PM EST — v03.17r — [e87c5b7](https://github.com/LightAISolutions/Sales/commit/e87c5b7dc884d4811db125023b8b986a46895fd0)

### Added
- **Read all dossiers.** A single action now works through every covered company's briefing in one go instead of a few per sync, continuing automatically until the whole list is done. It reports how many were read, how many have no briefing published yet, and how many could not be read

### Fixed
- Reading briefings no longer saves each company one at a time. The whole batch is saved in a single write at the end, which is dramatically faster and means progress is kept even if a pass runs out of time partway through
- A company that cannot be read is now reported with the reason instead of being skipped in silence, so a stalled list explains itself
- Starting a sync while one is already running now says so plainly rather than appearing to do nothing

## [v01.49g] — 2026-08-27 10:30:53 PM EST — v03.16r — [3dd6c9d](https://github.com/LightAISolutions/Sales/commit/3dd6c9da5379d09cabfe0a7be5f7b3281ea11779)

### Changed
- **"Sync now" now finishes promptly and tells you what it did.** It reads a smaller batch of company dossiers per press so it returns in a few seconds instead of running for a minute, and reports the result directly — for example "Read 27 dossiers — 61 still queued, press again to continue." Press it a few times to finish a large backlog, or simply leave it: the overnight refresh still works through more per night

## [v01.48g] — 2026-08-27 10:18:03 PM EST — v03.15r — [424509e](https://github.com/LightAISolutions/Sales/commit/424509eb333cdfac891f9a9728f069fbfc51428d)

### Added
- **Every edition now records which AI service wrote its summaries**, and says so in its own footer — so you can tell at a glance whether an edition was produced on the free service or the paid one. Previously the two were indistinguishable once an edition was saved

### Fixed
- **A temporary "too many requests" response no longer ruins an entire edition.** Requests are now spaced out and retried a couple of times with a growing wait, instead of one busy moment silently dropping every remaining story to a plain feed blurb and skipping the lead write-up. Errors that cannot fix themselves — a bad or missing key — still stop immediately rather than retrying and consuming more of your free allowance

## [v01.47g] — 2026-08-27 10:06:57 PM EST — v03.14r — [d0f1ab5](https://github.com/LightAISolutions/Sales/commit/d0f1ab58b96941f3db55ec7d2c536df1977b62c8)

### Fixed
- **Company research results were being erased moments after they were saved.** The daily refresh saved its own copy of your interests list *after* the research pass had already written to it, overwriting every newly found product name, ticker and market — so the "Dossiers read" count stayed at zero no matter how many times the refresh was run. Research results now save last and stick

### Changed
- **Each edition now carries far more stories.** Written summaries per edition go from 14 to 30, and the per-section limits rise from 6 covered-company / 6 market / 4 incident items to 12 / 10 / 8 — so noticeably fewer qualifying stories are held back
- **The emailed edition is wider and easier to read again** — the article column widens further with slimmer margins, and the summary text, headlines, lead story and masthead all step up a size

## [v01.46g] — 2026-08-27 09:53:19 PM EST — v03.13r — [35b7068](https://github.com/LightAISolutions/Sales/commit/35b70682d2979ae1ac277cdb7b74ce498c36115d)

### Fixed
- Company research with multi-word market names (for example "data centers") was being recorded incorrectly — everything after the first such name was dropped, which weakened the market-based filtering for those companies. All of it is now stored and read back correctly
- A company whose dossier could not be read was retried on every single refresh forever; it is now marked and the queue moves on

### Changed
- The daily company-research pass now prioritises what changed: companies newly added to your coverage are read first, then companies whose dossier was refreshed since it was last read, and only then a slow background re-read of everything else. Previously it worked through the list in fixed order, so a brand-new company could wait a week and a half before its product names were recognised
- The pass reads more companies per day while there is a backlog and settles to a light trickle once everything is current, so the first full read of your whole coverage list completes on its own within a few days — no manual refreshing needed
- Every read is now recorded even when it finds nothing new, so coverage progress can be reported accurately

### Added
- Research coverage is now reported to the app, so you can see how many of your covered companies have been read and how many are still queued

## [v01.45g] — 2026-08-27 09:42:55 PM EST — v03.12r — [e5732df](https://github.com/LightAISolutions/Sales/commit/e5732dfc70604bda74bddc2c1136c0fbb6f7b508)

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

## [v01.44g] — 2026-08-27 09:13:55 PM EST — v03.11r — [51554e8](https://github.com/LightAISolutions/Sales/commit/51554e80adf0203c09c188b495e14305c633e422)

### Changed
- The emailed edition is easier to read: the article column is wider, so there is far less empty space on either side, and the summary text, headlines and lead story are all set at a larger, roomier size
- The edition footer now says how many stories are shown out of how many met your relevance bar — and, when some were left out, exactly how many were held back by the per-section limits

## [v01.43g] — 2026-08-27 08:56:08 PM EST — v03.10r — [6664c97](https://github.com/LightAISolutions/Sales/commit/6664c97d86b6706745491497771e4317db31c3a7)

### Added
- Switch the AI service between the free Gemini tier and Claude Sonnet from inside the app — one tap, no configuration needed
- Manage the daily edition's recipient list from inside the app: add or remove any number of email addresses, and every finished edition is sent to all of them
- Recipient and provider controls are built to lock to admin-level users once the app opens to multiple sign-ins; today, while it's single-user, they're fully available

## [v01.42g] — 2026-08-27 08:12:11 PM EST — v03.09r — [3851180](https://github.com/LightAISolutions/Sales/commit/3851180f60e9c4e9d680a3c255c72610e6197692)

### Added
- Weekday editions now build on their own: every weekday from 7:00 AM Eastern, the morning edition is assembled automatically (Monday's covers the whole weekend). Editions can still be built on demand at any time
- Email delivery of each finished edition, which starts as soon as a delivery address is configured
- A go-live readiness view showing which AI service is in use, whether scheduled runs and delivery are on, and when the schedule last checked in — plus a one-tap AI check and a "send me the latest edition" button for testing how it looks in your mail app

### Fixed
- Five news sources were fetching nothing: two had moved their feeds, one had changed section addresses, and two now block automated readers. The moved and renamed feeds are corrected, and the blocked ones (plus one whose website shut down) are replaced with three working publications covering the same beats — so the roster is a full 30 live sources again
- A source that leaves the roster is now clearly marked as retired in your source list instead of sitting there looking active

### Changed
- The emailed edition is rebuilt to survive email apps: it keeps its dark newspaper look in clients that force their own colors, and it stays centered and correctly laid out in Outlook

## [v01.41g] — 2026-08-27 06:49:49 PM EST — v03.08r — [f18d048](https://github.com/LightAISolutions/Sales/commit/f18d0482890d2b020a8f9a00750f55218f2f054a)

### Added
- Past editions can now be deleted: removing one permanently clears the edition and its stored articles, and the removal is recorded for audit

### Fixed
- Article links from the general-news safety net no longer lead to an error page — very long links were being cut short before saving, which broke them; full links are now kept intact
- Cleaner safety-net headlines and blurbs: stray symbol codes are now shown as real characters, duplicated publisher names are trimmed from headline ends, and blurbs that merely repeat the headline are dropped

### Changed
- Segment filtering now catches far more off-target stories: the vehicle and charging segment vocabularies recognize many more terms (driver-assistance features, model names, recall phrasing, safety-regulator references, and more), and existing setups pick up these improvements automatically on the next daily refresh — unless you've customized a segment's terms, in which case your edits are left untouched

## [v01.40g] — 2026-08-27 06:20:46 PM EST — v03.07r — [9d0415d](https://github.com/LightAISolutions/Sales/commit/9d0415de8d497275363cb8fdb5d2abc80e0a334f)

### Added
- Business-segment filtering: the companies you follow work in many markets (batteries, EVs, chargers, transformers, and more), and you can now switch entire segments on or off. News from a followed company that only touches a switched-off segment — say an automaker's vehicle recall — no longer makes the digest

### Changed
- Article summaries are now substantially longer and more informative: each one covers what happened, who is involved, the key figures, how the deal or event works, and why it matters — instead of a one-line blurb

## [v01.39g] — 2026-08-27 05:48:26 PM EST — v03.06r — [2173eb0](https://github.com/LightAISolutions/Sales/commit/2173eb05ba3f60f35474bcce4d315f04ae665f44)

### Added
- The weekday morning digest engine: every weekday edition gathers the last 24 hours of industry news (Monday covers the whole weekend) from 30 hand-picked free trade publications, with an extra safety net that checks general news for each covered company by name
- Stories are ranked by how well they match your interests, the top items get short AI-written summaries that keep the key figures, and everything is assembled into a newspaper-style edition grouped by covered companies, market & policy, and incidents & community
- Your source list is now visible and adjustable: each of the 30 publications can be switched on or off, and your choices are respected on the very next run
- Recent editions are kept so you can revisit past days
- Scheduled delivery remains paused — editions can be built on demand from inside the app, and nothing is emailed until the launch step

## [v01.38g] — 2026-08-27 04:39:36 PM EST — v03.04r — [2918ab6](https://github.com/LightAISolutions/Sales/commit/2918ab66a7061d8a1ee76ad8e520ffa102985bc3)

### Added
- Your news interests now build themselves: the companies you research in the company-profile app flow into a new interest list automatically, refreshed daily. Newly covered companies join enabled and flagged as new coverage; companies no longer covered are kept but marked — nothing is ever deleted
- A starter set of industry topic interests (policy, grid, safety incidents, market buildout, and more), each of which can be switched on or off
- Groundwork for smarter article relevance that learns from your research focus instead of requiring thumbs-up/down feedback

## [v01.37g] — 2026-08-27 04:09:00 PM EST — v03.03r — [9d8b671](https://github.com/LightAISolutions/Sales/commit/9d8b671a397fa5ce856794d4c056a3793b022477)

### Changed
- Minor internal improvements

## [v01.36g] — 2026-08-27 02:20:49 AM EST — v03.02r — [f1ef994](https://github.com/LightAISolutions/Sales/commit/f1ef9941fb9d43719de98f4fad78fb7a48ea772b)

### Changed
- Scheduled news runs are now fully paused — nothing is compiled, analyzed, or emailed automatically, and no AI cost is incurred, until the redesigned daily digest launches. Manual actions inside the app still work normally

## [v01.35g] — 2026-08-27 01:54:03 AM EST — v03.01r — [a75d27e](https://github.com/LightAISolutions/Sales/commit/a75d27e74be59c932823b0886d791a47233d4428)

### Changed
- Scheduled news brief emails are paused for now, ahead of a digest redesign. Scheduled runs still happen and briefs still appear inside the app — email delivery will return with the redesigned daily digest

Developed by: LightAISolutions

## [v01.34g] — 2026-08-17 03:36:35 AM EST — v02.62r — [9cf3289](https://github.com/LightAISolutions/Sales/commit/9cf3289d2f283834fc1ddba030f2013e6fcef83a)

### Changed
- Clearer wording when the permission check finds nothing wrong with what the app asked for: it now points you at the list of what was actually granted, printed just above, instead of telling you to run a check you are already inside

## [v01.33g] — 2026-08-17 03:23:38 AM EST — v02.61r — [1821b32](https://github.com/LightAISolutions/Sales/commit/1821b3228300d8c9f3fcdcc4b045a6c3a8a7ded9)

### Changed
- The permission check now shows what the app **asked for** alongside what it was **actually given**, in one run. A capability can be missing for two opposite reasons — it was never requested, or it was requested and never approved — and the fix differs, so seeing only one of the two lists could point at the wrong repair
- The guidance that follows now reads those two lists against each other and names the specific repair, rather than listing general things to check

## [v01.32g] — 2026-08-17 03:15:36 AM EST — v02.60r — [0518cbf](https://github.com/LightAISolutions/Sales/commit/0518cbf7d9f84a98169c4adcb7345d6dc5dadcf0)

### Added
- The app can now report, on demand, whether its permission to use Google services is actually in force — as opposed to merely having been requested. The two are separate, and only the first one determines whether anything works
- When permission is incomplete, it produces a direct link to re-approve it, and names which capability each missing permission takes down

## [v01.31g] — 2026-08-17 02:34:37 AM EST — v02.56r — [6762fd6](https://github.com/LightAISolutions/Sales/commit/6762fd62fc42f36d33dbf3061edfb74653d4d8de)

### Fixed
- The specific reason the access list could not be read is now sent back to the page. It was already being worked out, but never delivered, so all four possible causes looked identical from the sign-in screen and could not be told apart

## [v01.30g] — 2026-08-17 02:10:00 AM EST — v02.54r — [4832a48](https://github.com/LightAISolutions/Sales/commit/4832a488b385fc40ff070724181c18fab99582f2)

### Fixed
- Sign-in now tells apart "this account is not on the access list" from "the access list could not be reached right now". The second is reported as a temporary service problem, and is retried automatically before sign-in gives up
- A momentary failure to reach the access list is no longer remembered as a denial, so access is restored the moment the service recovers instead of several minutes later
- These interruptions no longer count toward the failed-attempt lockout

### Changed
- The app now refreshes its entry in the shared access directory only when its version changes, instead of on every single page load. Less simultaneous writing to the shared directory means far fewer of the interruptions above

## [v01.29g] — 2026-08-05 05:26:52 AM EST — v01.80r — [5b3e2d4](https://github.com/LightAISolutions/Sales/commit/5b3e2d4b89397195195f0308296808f474493bea)

### Added
- Article ratings can now be saved in batches: many ratings are stored in a single request instead of one request each — far more resilient to the intermittent connection failures that were causing "Could not save feedback" errors, and faster

## [v01.28g] — 2026-08-05 03:13:25 AM EST — v01.78r — [d4550ef](https://github.com/LightAISolutions/Sales/commit/d4550efe2de4ca034ac49a7bf8a45dd078ee40d1)

### Fixed
- The scheduler health check now recognizes manually installed timers: each hourly run leaves a proof-of-life marker, and a recent marker verifies the schedule is alive even when the service lacks permission to inspect timers directly — previously a hand-added timer was wrongly reported as missing

## [v01.27g] — 2026-08-05 02:57:13 AM EST — v01.77r — [cd475f1](https://github.com/LightAISolutions/Sales/commit/cd475f10dccf7a518651823ebc9c1ecf9b6c9afb)

### Changed
- Rebuilding the search plan now keeps the keywords you added by hand — they stay at the top of the list while the automatically generated groups are refreshed behind them
- The saved plan now remembers which groups you added yourself, so they survive every rebuild

### Added
- New scheduler health check: the app can now verify that the hourly timer powering scheduled briefs actually exists, and report the exact reason when it can't be installed — this state was previously invisible

## [v01.26g] — 2026-08-05 02:34:08 AM EST — v01.76r — [83fe573](https://github.com/LightAISolutions/Sales/commit/83fe5733bd839dc89d36f5ea84f584823c9da865)

### Fixed
- Keywords added to the search plan can no longer be silently lost when two additions overlap — plan updates are now processed one at a time, and a busy update reports itself instead of overwriting
- Scheduled briefs can no longer fail silently: if a morning run keeps failing, it now stops after several attempts, moves to the next cycle, and **emails you a failure notice with the reason** — you will always receive either your brief or an explanation
- The hourly schedule timer is now re-verified every day and reinstalled automatically if it has gone missing, so schedules cannot silently stop running
- When a brief email fails to send, the reason is now recorded so it can be diagnosed

## [v01.25g] — 2026-08-04 08:11:10 PM EST — v01.74r — [bcac8c4](https://github.com/LightAISolutions/Sales/commit/bcac8c4e07d8617a65b824ba41b4a7675794de51)

### Changed
- Button actions respond much faster: the service no longer performs its full startup routine (directory registration and scheduling checks) before answering each request — that work now happens only when the page itself loads
- Repeated actions skip redundant storage checks for several hours at a time, shaving additional time off every press

## [v01.24g] — 2026-08-04 06:41:08 PM EST — v01.73r — [d28a97f](https://github.com/LightAISolutions/Sales/commit/d28a97f7db36612c1ab2e56c09a6f035095789e9)

### Added
- You can now grow your search plan one company or term at a time: submit a name and the service instantly evaluates it, shapes it into a full search query group with relevant context added, and saves it to your plan — duplicates are detected and reported instead of added
- Newly added terms are placed at the top of the plan, so they are always included in the very next gathering run

### Changed
- Opening the search plan now shows your saved plan instantly instead of rebuilding it, so manual additions are never lost — rebuilding is a separate, deliberate action
- Gathering runs now use more of your search plan than before, widening coverage across both news sources

## [v01.23g] — 2026-08-04 06:01:06 PM EST — v01.72r — [9eee790](https://github.com/LightAISolutions/Sales/commit/9eee79081c9a111fe340a0d5abf5e68edafb2548)

### Added
- AI search planning: the full project description, keywords, and learned preferences can now be turned into a stored set of precise search queries — naming every company and topic you care about — that all news gathering uses from then on
- Junk filtering at the door: newly fetched headlines are now screened for relevance before entering your collection, so gathering runs no longer pile up unrelated articles (if the screening service is unavailable, everything is kept — no articles are ever lost to a hiccup)
- Deep backfill: a new premium gathering mode uses AI-powered web search to find historical articles quarter by quarter — results arrive with summaries already attached, ready for scoring, and runs resume automatically if interrupted

### Changed
- Historical backfill now uses the stored search plan when one exists, covering up to twice as many search angles as before

## [v01.22g] — 2026-08-04 04:53:53 PM EST — v01.71r — [308513a](https://github.com/LightAISolutions/Sales/commit/308513a236483dba7a41f0e940081aa35f61e0af)

### Added
- Score statistics now break down each score band by preview availability (with preview vs title-only), report how many articles qualify for archiving, and show how many are already archived
- New archive action: unrated articles scoring under 10 can be moved out of your active collection in one pass — they no longer slow down or add cost to enrichment, re-scoring, analysis, or any other collection-wide operation, and archived articles are never re-imported by future news gathering

## [v01.21g] — 2026-08-04 04:01:42 PM EST — v01.70r — [2f604a6](https://github.com/LightAISolutions/Sales/commit/2f604a6fa4633518a76a675e2f5e8c3174bb3764)

### Added
- Score statistics: the app can now report your full score distribution and collection health (scored counts, preview coverage, rating totals) in a single quick request

## [v01.20g] — 2026-08-04 06:02:52 AM EST — v01.69r — [53ced63](https://github.com/LightAISolutions/Sales/commit/53ced6344330a63942afdf063adaf6e9a18f20ec)

### Fixed
- Enrich could stall permanently when a website hung and never responded — the run would restart the same batch and hit the same site forever. Progress is now saved before every fetch, so a hanging site is automatically counted as unavailable and skipped, and the run continues past it

## [v01.19g] — 2026-08-04 03:33:53 AM EST — v01.68r — [9543a7b](https://github.com/LightAISolutions/Sales/commit/9543a7bf68107dee49465df0ae8df1b6332d6d9d)

### Added
- Articles gathered without preview text (common for historical articles) can now be enriched: the publisher's own summary is fetched and saved for each one, so relevance scoring and your rating cards work from real article content instead of just headlines
- Enrichment runs in resumable batches, retries previously unavailable articles on a later run, and uses no AI credit

## [v01.18g] — 2026-08-04 03:28:10 AM EST — v01.67r — [b7c7de6](https://github.com/LightAISolutions/Sales/commit/b7c7de6d611a6c1fd0dac1febe8874b711888a71)

### Fixed
- Relevance scoring was far too harsh — most articles scored near zero. Scoring now uses a detailed scale that recognizes adjacent coverage (corporate moves, financing, policy, supply-chain news about relevant players) as moderately relevant instead of dismissing it
- Articles with only a headline (no preview text) are no longer penalized for the missing text — they're scored on what the headline covers
- A rating history with mostly 👎s no longer drags all scores down — your ratings are presented to the scorer in a balanced way, and your preference profile now leads with what you value

## [v01.17g] — 2026-08-04 01:46:24 AM EST — v01.65r — [b048b61](https://github.com/LightAISolutions/Sales/commit/b048b61dfbe56da493f50e8c9185684287c6c8b0)

### Changed
- Saving project changes is faster when the report schedule wasn't modified

### Fixed
- Editing a project's topic, keywords, or sources no longer resets its report schedule's next-run timing

## [v01.16g] — 2026-08-04 01:33:25 AM EST — v01.64r — [a596f46](https://github.com/LightAISolutions/Sales/commit/a596f461dd971172e1054f23596dcc20a8dd58b4)

### Changed
- Calibration no longer shows very low-scoring articles (under 10) — rating obvious junk teaches the scorer almost nothing
- When the worthwhile articles run out, the calibration queue now ends instead of filling up with low-scoring leftovers — low scorers only ever appear as a small share of the mix

## [v01.15g] — 2026-08-04 01:17:17 AM EST — v01.63r — [5d9b8b5](https://github.com/LightAISolutions/Sales/commit/5d9b8b53b374c877c709611744c3ca5f0b7e88a9)

### Added
- Automatic scheduled runs: your project's report schedule now runs by itself — news is gathered, scored against your learned preferences, and turned into an executive brief on your chosen frequency (daily, weekly, monthly, quarterly, biannual, annual, or custom), with runs anchored at 7:00 AM Eastern
- Finished briefs are saved to the Reports tab of your spreadsheet and emailed to you when your delivery setting includes email
- Long runs continue automatically across hourly passes until finished, and paused projects are skipped until you resume them
- The scheduler starts itself the first time the page is opened after this update — no setup needed

## [v01.14g] — 2026-08-04 01:08:07 AM EST — v01.62r — [ff07339](https://github.com/LightAISolutions/Sales/commit/ff07339adbc47e357ea209933ea888256b0ac378)

### Added
- Calibration article feed: serves a varied mix of your unrated articles weighted toward the uncertain middle scores, where your ratings improve accuracy the most
- Article filters: the article list can now be narrowed by time window, minimum score, and keyword
- On-demand preference learning: your ratings can now be distilled into an updated profile during a rating session, not just during analysis
- Re-score support: all articles in a project can be re-scored with your latest learned preferences
- News gathering now also searches the outlets behind your thumbs-up ratings, and learned suggestions now include adjacent topics — both widen what gets found beyond your typed keywords

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
