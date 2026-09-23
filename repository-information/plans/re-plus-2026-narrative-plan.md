# RE+ 2026 — narrative plan

**Las Vegas Convention Center · Monday 16 – Thursday 19 November 2026 · America/Los_Angeles**
SEIA / SEPA (RE+ Events) · relevance 5/5 · [re-plus.com](https://www.re-plus.com/) · [register](https://www.re-plus.com/register/) · [schedule](https://www.re-plus.com/schedule/) · [floor plan](https://re26.mapyourshow.com/8_0/floorplan/index.cfm)

> **What this is, and what it is not.** This is the first worked example of the `events plan <event>` command (`.claude/rules/events-app.md`). It was written on **2026-09-23** with **no plan JSON pasted**, so it is the **public half only**: the registry row in `live-site-pages/events-data/events.json` and nine served dossiers under `live-site-pages/profiler-data/`. It has **no ranked booth list, no contact names, no booked meetings and no stage data** — all of that lives in Network and reaches a session only through the Plan tab's **Copy plan as JSON** pill. Every quoted line below is **verbatim** from a dossier. Nothing here was invented; each gap is named as a gap.

## Where your two seats stand in this hall

The registry gives RE+ seven audience segments. Your two seats cover four of them, and the three they do not cover are the three that matter most to the first:

| The show's audience | Storage seller | AIDC power seller |
|---|---|---|
| Storage developers and IPPs | ✔ | |
| Utilities | ✔ | ✔ |
| Capital | ✔ | |
| EPC and construction | | ✔ |
| Storage integrators and containers | — | — |
| Cells and chemistry | — | — |
| Power conversion and rack-power silicon | — | — |

Read that table the right way round. The three uncovered rows are not a weakness in the plan — they are **the supply side of what the storage seat sells**. Integrators, cell makers and PCS houses are who you buy from, benchmark against and get specified alongside; they are also, per the registry's own note, why this show exists:

> "North America's largest clean-energy show; the storage hall is where integrators, cell makers and IPPs all appear in one week. Conference education Nov 16-18, exhibits Nov 17-19 — the organiser prints the two ranges separately."

That last sentence is the single most important operational fact on this page, and it shapes every day below: **the conference runs Monday to Wednesday, the exhibits run Tuesday to Thursday.** Monday has no hall. Thursday has no sessions. Only Tuesday and Wednesday have both, which makes them the two days worth spending carefully and the two days everyone else is also spending carefully.

The registry row carries **no `hours[]`**, so the app will frame all four days at the default 09:00–17:00 and say so on each day card. Fix that in the registry once the organiser publishes hall hours — the day plan is only as good as its frame, and a 09:00 start on a day the hall opens at 10:00 wastes the first ranked visit.



## Who the repo says is in the conversation

**Read this caveat before the list.** These nine companies are the ones whose dossiers *name RE+*, taken from the registry row's `mentions[]`. Per `EVENTS-SCHEMA.md` §11, **`mentions[]` is a derived index of where a name appears — it is not evidence that a company attends.** Attendance is only ever a `Signals` row with an evidence URL, and those live in Network. Treat this as "nine companies the corpus already connects to this show", not as a booth list.

Ranked by how directly each one bears on a seat you sell from, with the dossier's own read quoted verbatim.

### The three that sell into your storage seat's supply chain

**Hithium** — *Xiamen Hithium Energy Storage Technology* · dossier updated 2026-09-07

> "(High confidence) We assess Hithium has secured top-tier scale as a stationary-only specialist — Top 2 in 2025 ESS cell shipments behind CATL per InfoLink/SMM/ICC, with cumulative shipments past 100 GWh in August 2025."

Stationary-only is the thing to press on. Everyone else on this list hedges across EV, consumer or grid; Hithium does not, which means its roadmap questions have answers rather than tradeoffs. Newest development on file: **Fraser Coast, Queensland — 421 MWh, 84 grid-forming liquid-cooled units for Global Power Generation (Naturgy), 2026-08-12**, and a Heze LDES park claiming a first 15 GWh single line (2026-08-07). *Grid-forming at 421 MWh in a Naturgy fleet* is the opening question: ask what the Australian grid-forming commissioning taught them that a US ISO would care about.

**Sunwoda** — *Sunwoda Electronic / Sunwoda Energy* · dossier updated 2026-09-05

> "(High confidence) We assess Sunwoda's two-hat model — top-10 merchant cell supplier AND ~#9 system integrator — as both its edge and its structural conflict: it sells cells to integrators it competes with downstream (Sungrow gave it a strategic-partner award while fielding rival containers), which c…"

The structural conflict *is* the opening. If you are buying cells, ask which hat is on when they quote you; if you are competing with their containers, ask the same question and watch which way they flinch. Recent file: an **RMB 500M energy-storage equity fund** (2026-07-24, ≥70% into standalone storage projects) and a European channel build-out through IBC SOLAR and BayWa r.e. (2026-06-29). A supplier that is also funding standalone projects is a supplier whose incentives you should know before the RFP.

**Cornex** — *楚能新能源 / CORNEX NEW ENERGY* · dossier updated 2026-09-13 (the freshest of the nine)

> "1. **(High confidence)** We assess that Cornex is a challenger and not an incumbent in energy-storage cells, and that its rank is a property of the counting house rather than of the company. Basis: SNE places it seventh for H1 2026 at 30.2 GWh and 6.5% — a quarter of CATL's share, 1.3 GWh behind CAL…"

A challenger whose rank moves with the counting house is a challenger with pricing to give. **Xiangyang's 70 GWh park started production two months early (2026-08-30)** with 100Ah, 588Ah and 648Ah storage cells. If the 588Ah line is real and early, that is a supply conversation worth having before the integrators lock next year's bill of materials.

### The two power-conversion houses — the segment your AIDC seat trips over

**Power Electronics España** · dossier updated 2026-09-06 — *the one to see first if you only see one*

> "**(High confidence)** We assess that this is a United States business that happens to manufacture in Spain, and that the FCC's Covered List order is therefore an existential regulatory event for it rather than a trade irritant. Basis: the company's own FY2025 release puts the United States at approx…"

This is the only dossier on the list whose *strategy read* names a live regulatory threat as existential, and the two newest developments both land on it: **Flex agreeing to acquire EPC Power for $4.4bn (2026-09-04)** and **Executive Order 14420 declaring a national emergency over the bulk-power system, naming grid-connected inverters and storage at 69 kV and above (2026-08-26)**. Whatever you are selling, the inverter-provenance question is now a procurement question for every buyer in the hall, and this booth is where you find out how the supply side is actually answering it. Go with a specific question, not a general one.

**Sinexcel** — *深圳市盛弘电气* · dossier updated 2026-09-08

> "(High confidence) We assess overseas utility PCS is Sinexcel's margin engine — 61.3% FY2025 gross margin on the storage export line versus commoditized domestic pricing, with StellaON grid certifications (Poland, Nordics, Japan) functioning as queue-jumps into tender shortlists. Basis: filings as re…"

Certifications as queue-jumps is a transferable idea — ask which North American certification they are queuing for next, because the answer tells you where they intend to bid. H1 2026: revenue +29.16%, gross margin up 1.7 points to 40.7% (2026-08-11).

### The two that bear on the AIDC seat directly

**Samsung SDI** · dossier updated 2026-09-05

> "(High confidence) We assess AI data-center power is the company's chosen recovery vector, not incidental demand: UPS+BBU guided to +70% in 2026, the InterBattery booth literally rebuilt a data center, and the Q2 2026 turnaround was company-attributed to those lines. Basis: earnings releases and prod…"

This is the clearest AIDC-power story on the list and the one your second seat should spend time on. **First operating profit in seven quarters (KRW 203.8B, 2026-07-30) attributed to AI data-centre UPS/BBU**, and a **world-first pass of UL's Indoor Large-Scale Fire Test for UPS batteries (2026-07-14)**. That UL pass is the door-opener: indoor large-scale fire is the objection every data-centre buyer raises, and they now have a certificate for it. Ask what it unlocked commercially, not whether they have it.

**Sargent & Lundy** · dossier updated 2026-09-05 — *the EPC seat's row*

> "1. **(High confidence)** We assess Sargent & Lundy's commercial model is fee-for-judgment — architect-engineer, owner's engineer, independent engineer — and that it takes EPC exposure only with a constructor carrying the construction risk. Basis: every EPC credit in the record is a consortium or joi…"

Fee-for-judgment means they are a specifier, not a buyer — which makes them worth more than a buyer. **TVA's 2026 Valley Supplier Award (2026-09-04), on a relationship that "began in February 1994" with "no gap in service."** If your product needs to survive an independent engineer's review, this is the conversation that tells you what that review will ask.

### The one to place on the board, not to visit

**HyperStrong** · dossier updated 2026-09-05 · **Canadian Solar (e-STORAGE)** · dossier updated 2026-09-06

HyperStrong's read is about ranking methodology — "top-3 (S&P, 2024 installs) and #5 (InfoLink shipments) coexist with complete absence from Wood Mackenzie's and Benchmark's 2025 global top-10s" — useful context, thin reason to spend a slot. Canadian Solar's e-STORAGE, by contrast, has the most complete FEOC-adaptation playbook on file ("Western listing, the CS PowerTech 75.1% restructuring, a US cell plant, and a domestic developer arm") plus **426 MWh contracted with a Florida utility (2026-06-25)** and **75 MW/381 MWh for Apex Clean Energy (2026-06-24)** — a genuinely strong row that only falls to the bottom here because its mentions are in *developments* and *sources* rather than *strategy*. **If the app's ranked booth list puts Canadian Solar high, believe the app over this ordering** — it can see the signals and the stages, and this page cannot.



---

## Monday 16 November — conference only, no hall

**Frame: 09:00–17:00 (the default — the registry carries no `hours[]` for this show).** Conference education runs today; the exhibit hall does **not** open until tomorrow. Nobody is at a booth. Anyone trying to work the floor today is wasting a day.

**What today is for.** Sessions and the people in them. The app's session list comes from [the schedule page](https://www.re-plus.com/schedule/) and keeps a session for one of three reasons — its title names a segment one of your seats serves, a speaker is already a contact in Network, or a speaker is a decision maker in a booth account's dossier. Today is the day that filter earns its cost, because a speaker you meet at 10:00 on Monday is a booth you are expected at on Tuesday.

**How to spend it.**
- **Morning — the segment sessions.** Take the ones whose titles land on *storage developers and IPPs*, *utilities* or *capital*. Those are the three the storage seat is sold into, and a session room is the only place at this show where a developer will sit still for fifty minutes.
- **Midday — the decision-maker sessions.** The dossiers name people who speak. Worth watching for on the roster: **Colin Parkin, CEO of Canadian Solar** (since 2026-05-14), **Joo Sun Choi, President & CEO of Samsung SDI**, **David Salvo Lillo, CEO of Power Electronics**, **Vic Suchodolski, Chairman/President/CEO of Sargent & Lundy**, and **Jeff Wu (Wu Zuyu), Founder & Chairman of Hithium**. If any of them is on a panel, that panel outranks whatever else is in the slot — a named executive on stage is a warm introduction you do not have to arrange.
- **Afternoon — the open block.** The app will offer the afternoon as open slots because the ranked visits are placed in the morning and the hall is shut. **Spend it booking tomorrow.** Every slot you book today through the Plan tab writes the meeting on the contact in Network and hands you the `.ics`; every slot you leave is one you will try to fill on a hall floor at 30-second notice.

**Evening.** The venues list is one Overpass call around the convention centre — cafés, restaurants, bars and hotels within 600 m, cached for 30 days. Monday night is the night to use it, because on Tuesday and Wednesday every restaurant within walking distance of the LVCC is booked by someone with a bigger budget.



---

## Tuesday 17 November — hall opens, and this is the day

**Frame: 09:00–17:00 (default).** Conference education continues and the exhibit hall opens. **This is the only day in the week that is both, with a full hall and rested staff.** Wednesday is the same on paper and worse in practice: by Wednesday afternoon the booths are tired, the good literature is gone and half the senior people have flown home.

**The morning belongs to the booths.** The app places six ranked visits of 30 minutes each into the earliest free time, which fills roughly 09:00–12:00, and leaves the afternoon open on purpose — so that meetings, not walk-ups, get the hours when people will actually sit down. Do not fight that shape. Walk the list in rank order and resist re-sorting it by hall geography: **there are no booth numbers in this plan**, because the exhibitor parsers store company names only (an E4 follow-up — Map Your Show's JSON carries the booth, the parser does not keep it). Until that lands, use [the floor plan](https://re26.mapyourshow.com/8_0/floorplan/index.cfm) on your phone and accept the walking.

**What to open with, per the three you are most likely to have ranked highly.** Each of these is a question, not a pitch — a booth conversation you win is one where they talk:

- **Power Electronics** — *"EO 14420 names grid-connected inverters at 69 kV and above. What has that actually changed in your North American pipeline since August?"* The dossier calls the FCC Covered List order existential for them. They will have an answer rehearsed; the value is in how specific it is.
- **Samsung SDI** — *"You passed UL's indoor large-scale fire test in July. Which conversations opened that were closed before?"* The certificate is public; the commercial consequence is not, and it tells you how fast AIDC buyers are actually moving.
- **Hithium** — *"Fraser Coast is 84 grid-forming units. What did commissioning grid-forming at that scale teach you that would transfer to a US ISO?"* Stationary-only specialists answer roadmap questions cleanly. Use that.

**The afternoon belongs to the meetings you booked.** Anything already on the `Meetings` tab is fixed on the timeline with its place and its one line of note, and the open slots are whatever is left between them — never shorter than 30 minutes, because a 20-minute gap in a convention centre is a walk, not a meeting.

**Filling the open slots.** Take them from the booths that did *not* make the morning's six. The ranked list runs to sixty rows; the day plan places six. Rows 7 through 12 are exactly the people worth a booked half-hour rather than a walk-up — senior enough to be scheduled, not senior enough to be surrounded. Book them from the Plan tab: pick the account, pick the contact from the account's own pick list, set the time inside the slot, and the app writes the `meeting` interaction on that contact in Network **first**, then the row, then hands you the invite. If Network is not connected the booking still works — it just will not be recorded, and the meetings list will say so.



---

## Wednesday 18 November — the last day with sessions

**Frame: 09:00–17:00 (default).** The final day of conference education and the middle day of the hall. The shape of the day is Tuesday's, and the content should not be.

**Do not repeat Tuesday.** Tuesday's ranked visits are done; today's six are rows 7–12, and the app will place them the same way. But Wednesday has a different job: **Tuesday is for the accounts you already have a reason to see, Wednesday is for the ones you do not yet.** Two specific uses:

- **The supply-side booths your seats do not cover.** Integrators, cell makers and PCS houses do not appear on your segment-fit table, which means the score under-ranks them by construction — `segmentFit` scores zero for a company whose segments the seats do not include. That is right for a recommendation and wrong for a walk. **Cornex** is the case in point: the freshest dossier of the nine, a challenger with pricing to give, a 70 GWh park two months ahead of schedule, and nothing in the segment table that will push it up your list. Go anyway.
- **Sargent & Lundy, if they are here.** A specifier is worth more than a buyer and is never ranked like one. Fee-for-judgment firms do not sign at shows; they remember who asked the intelligent question in November when the independent-engineer review lands in March.

**Book nothing after 15:00 today.** By mid-afternoon on the last conference day the hall thins, people start travelling, and a 16:00 meeting is a 40% no-show. Use that block instead for the thing nobody ever does and everyone regrets: **write the cards up while you still remember the conversations.** Network's scan card defaults its Source Event from Events' `eop=today`, so a card scanned during the show is already tagged `re-plus-2026` — which is what makes Thursday's follow-up and the post-event checklist work at all. A card scanned and never reviewed is a card that will not be in the count.



---

## Thursday 19 November — hall only, and a short one

**Frame: 09:00–17:00 (default), and treat the back half as fiction.** The exhibits run today; the conference does not. Closing day at a mega-show is the shortest real day of the week — expect senior staff gone by lunch and the aisles half-struck by mid-afternoon.

**What closing day is actually good for**, in this order:

1. **The booths you could not get near on Tuesday.** The biggest names are three-deep in visitors on opening day and empty on closing day. A ten-minute conversation with a Samsung SDI or Canadian Solar person on Thursday morning beats a ninety-second one on Tuesday. If the ranked list put someone in the top three and you never got a real conversation, today is the retry.
2. **The second conversation.** Anywhere Tuesday or Wednesday ended with "send me something" — go back, in person, and pin what "something" means and who else has to see it. That is the difference between a card and a pipeline row.
3. **Leave by mid-afternoon.** There is no third thing.

**Before you leave the building.** Two minutes each, and both of them decide whether this show produced anything measurable:

- **Every card scanned, every card reviewed.** Not photographed for later — reviewed, with the account resolved and the Source Event set to `re-plus-2026`. The post-event checklist counts contacts whose Source Event is this slug; a card sitting unreviewed in a pocket counts as zero, and so does the meeting it should have been attached to.
- **Every meeting marked.** The close-out infers a meeting was held when a later `note` or `email-out` touch lands on that contact within fourteen days, but inference is a fallback. Mark the ones you know from the Plan tab's **Mark held / not held** the moment you are back — an explicit mark always beats the inference, and it is the number that ends up in the ROI line.

**Then, the day after the show ends**, the Plan tab opens with the close-out: the cards, the meetings booked and held, the follow-up mailing pre-counted over the consent rule, and the ROI line — *cards · booked · held · stage moves*. That line is **written once** into this event's `Plans` row and refreshed when you mark a meeting, and it is read back by the score as a small prior (`priorRoi`, weight 0.05) for **RE+ 2027** — never for this year's list. Which is the whole point: RE+ 2026 is where the series starts paying for its own ranking.



---

## Before you go

**In the app, in this order:**

1. **Star RE+ 2026 and set Attending to `registered`** — the plan is only built for a starred event, and the `conflict` term only counts a star you are registered for or attended.
2. **Check the sweep has run.** The weekly signal sweep (Tuesday 06:00 America/New_York) is what puts booth accounts on the ranked list at all. If the Signals card's last-swept line is stale, press **Signals now** and read the `feeds[]` answer before you trust the booth list. Carried from E4: **RE+ 2026's speaker roster is a Swapcard widget**, so the roster parser reads `no_roster_found` for this show and the speaker signals will be thin — the exhibitor gallery (Map Your Show) is the one that works here.
3. **Open the Plan tab once and read it.** The first build costs the full score plus the agenda, the dossiers and one Overpass call — ten to thirty seconds. It is fetched once and never polled; **Rebuild** is the only refetch.
4. **Book what you can before you fly.** Every meeting booked in advance is an afternoon slot that is not a gamble.

**On paper or on the phone, not in the app:**

- The **floor plan**, because this plan has no booth numbers.
- The four opening questions from the day pages — not a deck, four questions.
- The **two ranges**, written somewhere you will see them: conference 16–18, exhibits 17–19.

**Fix in the registry before the show if you can:** the `hours[]` array. Every day below is framed 09:00–17:00 by default and says so; real hall hours would make the ranked visits and the open slots land on the actual day rather than a nominal one.



---

## What this plan does not have, and why

Named plainly, because a plan that hides its gaps is worse than a short one.

| Missing | Why | How to get it |
|---|---|---|
| **The ranked booth list** | It is computed from Network accounts × live signals × stages, all of which are private to Network and reach a session only through the Plan tab | Open the Plan tab, press **Copy plan as JSON**, paste it into a session and say `events plan re-plus-2026` — you get this page again with the real ranking, the real contacts and the real meetings |
| **Contact names and the pick lists** | Same reason. Nothing in this repo holds a Network contact | As above |
| **Booth numbers** | The E4 exhibitor parsers keep company names only; Map Your Show's JSON carries the booth but the parser does not store it | An E4 follow-up — small, and worth doing before November |
| **The session list** | Read live from the schedule page at plan-build time and cached six hours; this page was written offline and never called the app | Open the Plan tab |
| **Hall hours** | The registry row carries no `hours[]` | Verify against the organiser and add them (E0's job, `events sync` applies it) |
| **A speaker roster** | RE+ 2026's roster is served by a Swapcard widget; the parser answers `no_roster_found`. Calling Swapcard's API is new third-party scope and is **a decision for the developer, not a session** | Either accept exhibitor-only signals for this show, or decide on Swapcard deliberately |

**Provenance.** Written 2026-09-23 by an Opus 5 session (E5 session 2) from `live-site-pages/events-data/events.json` (row `re-plus-2026`, `lastUpdated` 2026-09-21) and nine served dossiers under `live-site-pages/profiler-data/` — `canadian-solar`, `cornex`, `hithium`, `hyperstrong`, `power-electronics`, `samsung-sdi`, `sargent-lundy`, `sinexcel`, `sunwoda` (updated 2026-09-05 to 2026-09-13). **No plan JSON was pasted, no app was called, no spreadsheet was read, and no token was used.** Every indented quotation is verbatim from a dossier's `strategyRead[0]`; every dated development is from that dossier's `recentDevelopments[]`. Nothing else here is a fact about a company — it is judgment about how to spend four days, and it should be argued with.



Developed by: LightAISolutions
