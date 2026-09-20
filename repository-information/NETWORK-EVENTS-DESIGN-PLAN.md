# Network + Events — Design Proposal and Long-Term Action Plan

**Provenance.** Written 2026-09-19 (v06.70r → v06.71r) in a strategic design session on **Fable 5.1 High**, from the developer's founding brief for two new federated apps — **Network** (business-card capture + a personal, account-centric contact layer) and **Events** (an industry-wide event tracker and planner). Inputs: a full read of the Receipts app (`Receipts.html` / `Receipts.gs`, the scan → Drive → Sheets pattern Network inherits), the Profiler data model and app surfaces, the Scraper roster and corpus route, the Classroom gate surface, the ecosystem plumbing (setup script, Master ACL, peer-token routes, Routines), plus two web research passes — the business-card-scanner / personal-CRM market and the event-platform / event-data market, with a live probe of the organiser sites that matter to a BESS/AIDC seller. Every count in §1 was measured from the working tree, not recalled. **Nothing in the repo was changed by this session except this file and the housekeeping train.** This is a **proposal for a design gate**, the role `PHASE6-CLASSROOM-DESIGN.md`'s conversation played for Classroom — it becomes an executable spec only after the developer decides §3.

**Big picture.** Profiler is the first-party skeleton, Scraper is the fresh third-party blood, Classroom is the institution — and the two apps designed here are **the people layer and the calendar**: Network holds *who the developer actually knows* at the companies the corpus describes, and Events holds *where those people will be next*. The sales motion they serve is the one the corpus is built around: carrying a challenger power product into US AIDC and storage buyers with no installed base, where the whole job is building a reference book and a named-decision-maker network from zero. Ecosystem stance unchanged (developer directive 2026-08-31): federated apps, each with its own page + GAS project, synergising through public Pages data and token-gated server-to-server routes, never a monolith. Quality over build economy.

**How to use this file.** §1 is the ground truth the design stands on. §2 is what the market already builds, so the base app ships with parity before it exceeds anything. §3 is the decision list for the gate — every one carries a recommendation and the reason. §4–§5 are the two designs; §6 is how they join the other three apps; §7 applies the repo's model rule; §8–§9 are the phase plan; §10 the sequencing and preconditions; §11 the (empty) status ledger; §12 the open questions; §13 the paste-in brief for the gate session.

---

## 1 · Ground truth at v06.70r (measured 2026-09-19)

| Layer | Fact |
|---|---|
| Apps | 8 GAS projects on one consumer account (Testauthgas1, Testauthhtml1, Globalacl, MasterACL, Scraper, Receipts, Profiler, Classroom). Network + Events make **10** — the threshold at which `FUTURE-CONSIDERATIONS.md` says quota tracking must start. All ten share **20,000 script executions/day** |
| Receipts (the pattern Network inherits) | UI lives entirely in `Receipts.html` over a JSON-API `.gs`; `<input capture="environment">` → `compressImage()` (≤2000 px JPEG 0.82) → **own-Drive upload with the user's `drive.file` token** → link-only registration; extraction = **Gemini `responseSchema`** (`gemini-3.6-flash`, fallback `3.5-flash`, 3-step retry, 600 s digest cache); review card before save; record-level dedupe with "save anyway"; **hard delete, no soft delete**; `Shares` tab with owner scoping that answers *not-found* rather than *forbidden*; `.xlsx` export via a temp spreadsheet; PWA manifest behind a `manifest-src 'self'` PROJECT OVERRIDE; **no service worker by rule** (`worker-src 'none'`); effectively **no role gating** — ownership + Shares is the access model |
| Profiler | **177** dossiers, 19 segments / 319 memberships, 1,481 graph edges, 9 projects, 1,477 concepts, 8 reports. `decisionMakers[]` = **1,479 people** (name, title, background; 59 verified LinkedIn URLs; **no email, phone, or "met at" field**). `relationships[].type` ∈ competitor · customer · supplier · partner · other · investor · portfolio — **between covered companies only; there is no first-person axis anywhere** (no "my account", no target, no stage, no owner). `#network` is a **reserved Profiler route** and `network` a key in `OV_ROLE_CAPS` |
| Profiler private layer | Field notes live in the script owner's Drive (`Profiler/profiler-notes.json`, M3 2026-08-10), `sourceType` ∈ **contact · event** · call · news · other, developer-rated `confidence` 0–100. "Notes are not sources" — never cited, never lesson content, no `note:` prefix in Classroom |
| Scraper | 35 RSS outlets (12 tier-1 trade, 18 tier-2, 5 federal primary). **Zero events/calendar sources.** 45 topic seeds (`source:` ∈ `guidance:` 27 · `market` 9 · `project:` 9) + 29 segment seeds; a registered project adds a seed in the same commit. Corpus route `?action=corpus&t=<CORPUS_TOKEN>&cop=timeline|candidates`; item identity is the base36 `key`, never a URL. Scheduled AI runs still gated off (`SCRAPER_SCHED_RUNS_ENABLED = false`) |
| Classroom | `CL_ROLE_CAPS` admin/contributor/analyst (viewer not admitted). `CL_PROVENANCE_REF_KINDS` is a closed set of nine prefixes, **byte-frozen for the pipeline (P4)** and one of 32 `GATE_SYMBOLS` behind `gateDigest` (P3). C5 scenarios carry the only pipeline vocabulary in the repo: `stage` ∈ prospecting · discovery · rfp · shortlist · negotiation · post-award |
| Events already in the corpus | **31 distinct events** named in free text (DCD 49 files, GTC 33, Bisnow 14, OCP 12, RE+ 12, SNEC 11, Intersolar 11, ees 10, Computex 9, Data Center World 8, CERAWeek 8, iMasons 7 …) — every one a bare string in a headline, roadmap, spec note or source label. **No event field, slug, date, venue or registry exists.** `recentDevelopments[].category` has no event value |
| Peer routes | Two token namespaces exist and must not be reused: `CORPUS_TOKEN` (Profiler ↔ Scraper) and `GUIDANCE_PEER_TOKEN` (Profiler ↔ Classroom). `guidanceMentionsProxy_()` is the canonical template (`.trim()` the property, `upstream_not_json` vs transport failure, `not_configured` while unset) |
| Masthead convention | Since Profiler v01.90w apps do **not** carry permanent buttons to each other; what survives is content-level deep links (`Classroom.html#guidance/<id>`, `Profiler.html#<slug>`) rendered once the server has answered |
| Routines | A Routine can commit **only if created in the claude.ai UI with the repository attached** (settled 2026-09-18; `create_trigger` stores `sources: []`, and `add_repo` does not exist in a fired session). The earnings desk is rebuilt that way and awaits Monday's proof; four more rebuilds are queued. Any scheduled Events/Network job inherits this |
| Email | `MailApp` only across the repo; the Scraper digest is the mailer precedent (`getRemainingDailyQuota()` check before every send). Consumer cap **100 recipients/day**, Workspace 1,500. No `GmailApp`, no Gmail API, no `CalendarApp`, no Maps/Places anywhere |
| PII rules | The auth template runs the `hipaa` preset. Business cards carry Safe Harbor identifier categories A, B, D, E, F, N, Q. `HIPAA-CODING-REQUIREMENTS.md` §164.514(c): an identifier must **not be derived from the individual** — Receipts' `Store_Name-YYYYMMDD` id pattern is *not* transferable to people |
| Mentions of these apps | **None.** "Network app", "Events app", "business card", "CRM", "trade show" return only unrelated corpus prose. Both apps are greenfield |

---

## 2 · What the market builds — parity first, then the gap

The developer asked for the base app to have everything comparable apps have, then to build past them. Two research passes (2026-09-20, sources in the session chat) produced the two inventories below. ✅ = confirmed from a vendor page or review; ◐ = vendor claim; "inference" = this session's reasoning.

### 2.1 Business-card scanners and personal CRMs (15 apps surveyed: CamCard, ABBYY BCR, HiHello, Blinq, Popl, Covve, Sansan/Eight, Zoho Card Scanner, HubSpot, Pipedrive, Haystack, Mobilo, Linq, Contacts+, Habsy)

**Table stakes — in ten or more of the fifteen; Network v1 ships all thirteen:**

1. Photo → parsed name / title / company / phones / emails / website
2. Review-before-save with the low-confidence fields flagged
3. The card image attached to the record (front and back)
4. Save to the phone's contacts (vCard)
5. CSV / vCard export
6. At least one CRM push (we substitute: Sheets is the CRM; export covers the rest)
7. Tags / groups + free-text notes
8. Search by name and company
9. Some enrichment (company website, LinkedIn URL when known)
10. A shareable digital card of your own via QR
11. Capture that works offline and syncs later
12. Multi-language OCR (Chinese-script cards matter for this corpus)
13. A free tier with a monthly scan cap — irrelevant here, we own the stack

**Differentiators (four apps or fewer) — Network picks these up in N4:** cadence-based "who should I reconnect with" (Covve, Dex, Cloze, Mesh); auto-logged touches from Gmail/Calendar (Cloze, Affinity, folk); AI voice note → next steps (CamCard, Blinq); AI follow-up email in a chosen tone (Popl, Contacts+); relationship-strength score (Affinity — *no scanner app has it*); pre-meeting brief (Dex, Mesh); network map (Dex); "met at event" as a first-class object (only the $199+/month event-lead-capture add-ons).

**The gap nobody fills** — and the reason to build rather than buy: an **account relationship × contact role** taxonomy tied to a corpus of dossiers, Drive auto-sort by company, and an Events linkage that says *which of my target contacts will be in the hall*. None of the fifteen does any of the three (inference from the matrix; Vendelux in §2.2 is the only product near the third, at enterprise pricing).

**Extraction stack, costed per 1,000 cards:** Gemini Flash-Lite with `responseSchema` ≈ $0.7–1.1 (computed from published token rules; the free tier covers solo volume) · Claude Haiku 4.5 ≈ $2.9 · Cloud Vision `TEXT_DETECTION` $1.50 but *no field parsing* · Drive OCR $0 but slow and it creates a Doc per card · browser `TextDetector` not on Safari · Tesseract.js needs a Web Worker, which `worker-src 'none'` forbids. **Recommendation: Gemini primary (the house pattern), Claude Haiku as the fallback on 429/5xx or low confidence.** Both are third-party processors of name + email + phone — see D9.

### 2.2 Event discovery and attendee planning (Bizzabo, Cvent, Swapcard, Grip, Brella, Whova, 10times, TSNN, Eventbrite, Luma, Meetup, LinkedIn Events, ExhibitDay, Map Your Show / a2z, Expo Logic, Vendelux, ZoomInfo, Apollo)

| Feature | Organiser attendee apps | Directories | Exhibitor planners | Sales-intel (Vendelux) |
|---|---|---|---|---|
| Cross-event discovery / recommendation | ✗ (one event each) | ✓ (10times 200k, TSNN 19.5k) | ✗ | ✓ priority-scored by your account list |
| Personal agenda builder | ✓ | ✗ | per show (MYS "My Show Planner") | ✗ |
| Floor plan + booth targeting | ✓ Swapcard, Grip | ✗ | ✓ starred exhibitors pinned + printable | ✗ |
| Matchmaking / meeting booking | ✓ Grip, Brella | ✗ | ✗ | ✓ pre-booked meetings, CRM-synced |
| Attendee lists | inside the app, contact hidden | RSVP counts only | ✗ | ✓ confirmed / historic / **predicted** |
| Calendar sync / ICS | ✓ | Luma ICS | ✓ | ✗ |
| Budgets / ROI per event | ✗ | ✗ | ✓ ExhibitDay | ✓ CRM attribution |
| Post-event follow-up workflow | partial | ✗ | ✓ tasks | ✓ |

**Table stakes for Events v1:** starred-event calendar with ICS and Add-to-Google-Calendar links, a detail page (venue, dates, times, organiser, website), session / speaker lists where published, reminders, the floor-plan link and exhibitor list, notes. **Differentiators nobody bundles** (inference): discovery + attendance-signal fusion below the mega-convention tier; an auto-generated day plan whose booth list is *reasoned from the dossiers and the developer's own account tags*; open meeting slots with nearby venues; and **source transparency** — every event shows which feed produced it and when it was last confirmed.

**Vendelux is the closest analogue** to what the developer described (its Event Graph fuses registration pages, agendas, speaker bios and public "attending" posts into confirmed / historic / predicted attendees, then matches an uploaded account list to upcoming shows). It is enterprise-priced and organiser-agnostic; Events reproduces the legally clean two-thirds of it (§5.5) for this one industry.

**Event data, probed live on 2026-09-20 from organiser sites:** JSON-LD `Event` markup is present on The Battery Show NA, DISTRIBUTECH, Data Center World, POWERGEN, Yotta and Intersolar/IESNA; absent on RE+, CLEANPOWER, Energy Storage Summit USA, PTC, DCF Trends, GCPA, NARUC (HTML only). ICS feeds: 7x24 Exchange (`?ical=1`), the International Battery Seminar, Luma calendars. **Bot walls that `UrlFetchApp` cannot pass:** 10times (Cloudflare, and its ToS reserves data for licensed partners), DCD, OCP, Enlit — these become hand-maintained registry rows, never fetches. Eventbrite's public search API is gone (2020); Meetup's needs Pro; LinkedIn's Events API returns only your own organisation's events. **A 64-row verified calendar for 2026-Q4 → 2027 came out of the pass** and seeds E0 (§5.2).

**Attendance signals, ranked by reliability and legality:** exhibitor directories (high for *companies*; Map Your Show pages render server-side) · speaker rosters (high for named people) · "visit us at booth #" press releases via PR Newswire / Business Wire / GlobeNewswire RSS (high, biased to vendors) · organiser attendee lists (gated to paying sponsors; Bisnow's robots.txt blocks `/events/attendee-list/*`; Uptime bars vendors outright) · **LinkedIn posts — the highest-value signal for target *contacts* and the one that cannot be automated**: the User Agreement (§8.2.2, §8.2.4, §8.2.13) forbids it, *hiQ v. LinkedIn* ended in a $500k consent judgment and permanent injunction against the scraper, and no LinkedIn API is open to an individual. **Design consequence (D11): LinkedIn intel enters Network by hand — a "paste the post URL" field — exactly as field notes enter Profiler.**

---

## 3 · Decisions proposed for the gate

Each row is a decision the developer takes at the gate session (§13). The recommendation is this session's single best judgment; alternatives appear only where the trade-off is real.

| # | Decision | Recommendation | Why |
|---|---|---|---|
| **D1** | **Names.** `Network` collides with Profiler's reserved `#network` route, its `network` capability key and the `ovNx*` prefix | **Keep "Network" and "Events."** The collision is confined to `Profiler.html`'s own namespace — `Network.html` owns its own hash routes, its capabilities are `NW_ROLE_CAPS`, its functions `nw*`. In N0, relabel Profiler's explorer button from "Ecosystem Network" to **"Ecosystem Graph"** (a label, not a key — `verify-profiler-roles.py` is untouched). Alternative if the developer prefers zero overlap: "Rolodex" | The developer chose the names; a label change costs one line and removes the only user-facing confusion |
| **D2** | **Form factor** | Two own apps via `setup-gas-project.sh` from the **auth** template (`hipaa` preset, Master ACL, deploy webhook), each with a **PWA manifest** (`network.webmanifest`, `events.webmanifest` + icons, added by hand — the script does not generate them) and the `manifest-src 'self'` PROJECT OVERRIDE. **No service worker**, per the repo's `worker-src 'none'` rule; installability without offline caching, exactly as Receipts | Both are used on a phone in an exhibition hall; both hold data the sign-in wall must protect |
| **D3** | **Where the data lives — the decisive fork** | **Everything about people is private; the event registry is public.** Contacts, card images, interactions, plans, attendance signals about *named people*, and account tags live in **Drive + the app's own spreadsheet behind the Master ACL**, served only by `Network.gs` / `Events.gs` — the field-notes architecture (M3). The **event registry** (`live-site-pages/events-data/events.json` + `events-sources.json`) is public-safe and lives on Pages like `profiler-projects.json` | `live-site-pages/` is public even on a private repo; M3 moved exactly this class of data out for that reason. Two registries on Pages cost nothing and let Profiler, Classroom and Scraper read events with one `fetch` |
| **D4** | **Account-centric, not card-centric** | The primary object is the **Account** (a company), which owns **Contacts** (people), which own **Cards** (images) and **Interactions** (touches). An Account links to a Profiler `slug` when the company is covered (resolved through the registry's `aka[]` + `domains[]`); uncovered companies are local Accounts carrying a one-tap **"propose a dossier"** hook that emits the `profiler <Company>` command text | Every feature the developer asked for — filter by company type, chase targets, event recommendations — hangs off the account, and the dossier corpus attaches at that level, not the person |
| **D5** | **Taxonomy** | Account `relationship` ∈ **customer · partner · supplier · target · competitor · channel · other**; Account `stage` ∈ **none · prospecting · discovery · rfp · shortlist · negotiation · post-award · won · lost** (the C5 enum plus the three terminal states); Contact `role` ∈ **decision-maker · economic-buyer · technical-evaluator · point-of-contact · champion · influencer · gatekeeper · procurement · peer · other**; Contact `warmth` is **computed** from interactions, never stored. Both enums live in `NETWORK-SCHEMA.md` and are mirrored server-side (flat enum for Gemini) and client-side (grouped map), the Receipts `RECEIPT_CATEGORIES` / `SUBCATS` idiom | Aligning `stage` with C5 means a scenario lesson and a live account speak the same word for the same moment in a sale |
| **D6** | **Extraction** | **Gemini `responseSchema` primary** (the Receipts pattern, model pinned by constant, key in Script Properties), **Claude Haiku 4.5 fallback** on 429/5xx or when any required field's `confidence < 0.7` (a new per-field confidence array the card schema carries, which Receipts lacks). Front and back captured as a **pair** in one review. No Tesseract (needs a Worker) | One `UrlFetch` per card, ≈ $1 per 1,000, and the review card already exists in Receipts |
| **D7** | **Access tiers** | **Network:** admin + contributor admitted; analyst and viewer turned away at the door (a personal address book has no read-only audience). Ownership + a `Shares` tab decide what a contributor sees (the Receipts model, verbatim). **Mass email and any AI-backed action are admin-only** — they are budget surfaces. **Events:** admin + contributor + analyst; viewer excluded; starring and plans are per-account; the source roster and poller controls admin-only | Mirrors Classroom's "viewer not admitted" decision and Profiler's "budget triggers stay admin-only" rule |
| **D8** | **Identity and deletion** | Contact and Account ids are **opaque random** (`c-<base36>`, `a-<base36>`), never derived from a name — §164.514(c). **Soft delete** (`Deleted At` column, purge admin-only after 30 days), because Receipts' hard delete is wrong for a relationship record | A person's record is the one thing here that gets un-deleted |
| **D9** | **Privacy posture** | Columns `Source Event`, `Consent Marketing` (yes / no / unknown, default unknown), `Do Not Contact`; every mass email carries an unsubscribe line and a postal address; list ops return the **minimum-necessary** subset and detail ops the full row; audit rows log event + user, **never card contents**; a share or export writes a disclosure row (the template's §164.528 machinery). Retention: a **review list** of contacts with no touch in 36 months — surfaced, never auto-purged (user-owned data) | GDPR legitimate-interest and CAN-SPAM cost nothing when built in; CCPA's thresholds almost certainly do not apply to a sole seller but deletion requests are honoured anyway. **Gemini/Claude as processors of third-party PII is a judgment the developer should make consciously**: Receipts already sends merchant addresses to Gemini, and neither vendor trains on API data by default, but a card is a *person* |
| **D10** | **Events source strategy** | **Hybrid, in three layers.** (1) A **corpus extraction pass** structures the 31 events already named in dossiers (cheap, deterministic). (2) **One Opus 5 xhigh research session** builds the verified registry (~60 events with organiser URL, JSON-LD/ICS availability, tier, audience, exhibitor/speaker-list URLs) from the 64-row calendar this session produced. (3) A **weekly no-AI GAS poller** refreshes dates/venues from JSON-LD and ICS and queues diffs for admin approval; a **quarterly discovery Routine** (UI-created, repo attached) proposes new events. The developer asked Medium / High / xhigh: research is Opus's job under the model rule; the extraction and poller code are Fable High; the roster bookkeeping is Fable Medium | Independent research finds the sub-mega tier (Infocast, GCPA, Bisnow regionals, iMasons socials) the corpus never names; the corpus supplies the relevance judgment research cannot |
| **D11** | **Attendance-signal stack** | Exhibitor-directory diff (weekly) + speaker-roster diff + press-release RSS keyword watch (`<company> AND booth`) + Luma ICS for socials + **manual LinkedIn capture** (paste URL + one line + confidence). **No scraping** of LinkedIn, 10times, or organiser attendee lists. Every signal stores `evidenceUrl`, `firstSeen`, `kind`, `confidence` so the app can always say *why it thinks they are going* | The only stack that survives a ToS read; it is also two-thirds of Vendelux |
| **D12** | **Plans** | **v1 is deterministic**: booths ranked from account relationship × stage × segment membership × live signals, each with a "why" line lifted verbatim from the dossier (`strategyRead[]`, `recentDevelopments[]`, `relationships[].note`); sessions ranked by segment keywords; a day plan with the show's hours, the ranked visits, **open slots**, and nearby venues from Places Nearby Search (Pro tier, free at this volume). **The narrative plan is session-authored**: an `events plan <event>` command (Opus 5 xhigh) writes a private plan file to the developer's Drive. **In-app runtime AI stays deferred**, the ecosystem's standing decision since 2026-08-22 | A deterministic plan is explainable and free; the narrative one is where model quality shows and is worth a session |
| **D13** | **Classroom hook** | **An `event:` prefix over the public registry is defensible; a `contact:` prefix is not and is never proposed.** Defer the prefix until E0's registry has survived one poller cycle. It is a gate-surface change: `CL_PROVENANCE_REF_KINDS` + `CLASSROOM-SCHEMA.md` mirror + `gateDigest` refresh in the same commit. The teaching value is real but narrow — a **pre-event briefing lesson** ("who from your segments exhibits at RE+ and what the record says") — and the developer said not to force it | The absence of `note:` is the precedent: private first-person intel never becomes lesson content |
| **D14** | **Quota discipline** | Network `HEARTBEAT_INTERVAL` 600 s, `DATA_POLL_INTERVAL` 60 s; Events **no data poll** (the registry is static and starred state is fetched on demand), heartbeat 600 s; start the audit-row quota counter `FUTURE-CONSIDERATIONS.md` describes, on all ten projects, in N0 | Ten projects on one 20,000-execution/day account; a 15 s poll on two more apps is 11,520 executions/day for one open tab each |
| **D15** | **Mass email — who sends** | **The browser sends, as the developer, through the Gmail API with the user's own `gmail.send` token** — the own-Drive upload pattern applied to mail. Per-recipient raw-MIME sends with `List-Unsubscribe`, merge fields from the contact row, a review-every-recipient step, throttled to the account's own Gmail limit (500/day consumer). `Network.gs` never sends mail and never sees the token | `MailApp` would send *from the script account*; the Apps Script cap is 100 recipients/day; and mail must leave the developer's own mailbox to land in the reply thread |
| **D16** | **Order of build** | Gate → Network N0–N2 → Events E0–E1 → **the bridge B** → Network N3 → Events E2–E3 → Events E4 → Network N4 → Events E5 → X. Network first because the bridge and the recommendation engine both read account tags that only Network holds; the bridge comes before the recommendation engine because the score reads those tags over it; Events' registry (E0) is research and can run in parallel with N1–N2 on a different model | The critical path is Network's account model, not either app's UI |

---

## 4 · Network — the design

**One sentence.** Network is Receipts' scan → Drive → Sheets → PWA pattern with a person instead of a purchase in the record, an account layer over the people, the dossier corpus attached at the account, and a privacy posture that treats every row as a third party's data.

### 4.1 Objects and tabs (`Network.gs`, one spreadsheet; `ensureNetworkTabs_()` with the Receipts in-place header-upgrade idiom)

| Tab | Columns (first cut — `NETWORK-SCHEMA.md` is the single source of truth once N0 writes it) |
|---|---|
| `Accounts` | Account ID · Owner · Name · Normalised Name · Domain · Profiler Slug · Relationship · Stage · Segment IDs · HQ · Notes · Created At · Updated At · Deleted At |
| `Contacts` | Contact ID · Owner · Account ID · Full Name · First · Last · Title · Role · Emails (JSON) · Phones (JSON) · Address · LinkedIn · Website · Source Event · Met Date · Consent Marketing · Do Not Contact · Tags (JSON) · Notes · Card Front Link · Card Back Link · Raw Extraction · Created At · Updated At · Deleted At |
| `Interactions` | Interaction ID · Owner · Contact ID · Account ID · Kind (scan · meeting · call · email-out · email-in · calendar · note · linkedin) · Date · Summary · Evidence Link · Event Slug · Created At |
| `Signals` | Signal ID · Owner · Account ID · Contact ID (optional) · Event Slug · Kind (exhibitor · speaker · press-release · linkedin-manual · luma · other) · Evidence URL · First Seen · Last Seen · Confidence · Note — **written by Events over the bridge (§6), read by both** |
| `Shares` · `Profiles` | Verbatim from Receipts (grant by email, `view`/`edit`, 20 per owner; Drive folder id + display name) |

Owner scoping, `resolveOwnerScope_` / `resolveOwnerSet_`, and *not-found-not-forbidden* are copied verbatim from `Receipts.gs`. Emails and phones are JSON arrays in one cell because a card carries several and the review card already has repeatable rows.

### 4.2 Capture → extraction → review → save (N1)

- **Capture**: the Receipts inputs (`capture="environment"` single, `multiple` batch of 15) plus a **front/back toggle** so one review card holds a pair; `compressImage()` unchanged at 2,000 px (cards are small but Chinese-script cards are dense).
- **Offline**: when `navigator.onLine` is false, the compressed base64 pair is queued in **IndexedDB** (no Worker needed) and drained on reconnect with the same pipeline — the one table-stakes feature Receipts lacks.
- **Upload**: own-Drive with the user's `drive.file` token into **`Network App/<Company>/`** — the auto-sort the developer asked for; the folder is created on first save (the company name is known only after extraction, so the file uploads to `Network App/_inbox/` and **moves** on save via a Drive `files.update` with `addParents`/`removeParents`). Filenames `<ContactID>-front.jpg` / `-back.jpg` — opaque, per D8.
- **Extraction** (`nwExtractFromBase64_`): the Receipts function with a new schema — `fullName`, `firstName`, `lastName`, `title`, `company`, `department`, `emails[]`, `phones[]{kind,number}`, `address`, `website`, `linkedin`, `socials[]`, `languages[]`, `rawText`, and **`confidence{field: 0–1}`**; prompt rules for Chinese/Japanese/Korean cards (romanise, keep native script in parentheses — the `decisionMakers[].name` convention), two-sided cards, QR codes present on the card (decode client-side with the browser `BarcodeDetector` where available; it needs no Worker).
- **Company resolution** at review time: normalise the company string, match against `profiler-companies.json` `name` / `aka[]` / `domains[]` (one public fetch, cached page-lifetime) → propose the Profiler slug and pre-fill `segments` from the registry; otherwise propose a new local Account.
- **Dedupe**: on normalised email, else phone, else name + account → **offer merge** (field-by-field, newest wins by default, both card images kept), never a silent reject.
- **Review card**: the Receipts card with the role/relationship selects, the low-confidence fields outlined, "Retry extraction" and "Swap front/back".
- **Save**: writes Contact + (new or existing) Account + one `scan` Interaction stamped with **`Source Event`** — which defaults to whatever Events says the developer is attending today (§6, the bridge's first use).

### 4.3 The list, the filters, the exports, the mail (N3)

- **List** = the Receipts History card generalised: search (name, company, title, email), filters on relationship, stage, role, segment, source event, tag, met-date range, "has consent"; sort by name / company / last touch / warmth; per-row expand → the contact detail with both card images, the account's relationship badge, and a **`Profiler.html#<slug>` deep link when the account is covered** (rendered after the registry answers, per the masthead convention).
- **Bulk actions** (Receipts has none): multi-select → tag, set relationship/stage, export selection, start a mailing, soft-delete.
- **Exports**: `.xlsx` via the Receipts temp-spreadsheet path (Contacts / Accounts / Interactions sheets); **CSV**; **vCard 3.0** per contact and as a bundle (hand-rolled text, no library — the house style, cf. `_buildJpegPdf`); the vCard carries the card image as `PHOTO` when the user opts in.
- **Mass email** per D15: pick recipients → choose or write a template with merge fields (`{{first}}`, `{{company}}`, `{{metAt}}`) → preview every recipient → send from the browser through `gmail.send`, one message each, with `List-Unsubscribe`; each send writes an `email-out` Interaction; **admin-only**.
- **Your own card**: a QR code (client-rendered, no library or the small inline generator already used elsewhere in the repo if one exists — check before adding) that encodes a vCard of the developer, on a "My card" panel; tap to show full-screen in the hall.

### 4.4 Relationship intelligence (N4 — the differentiators)

- **Warmth** (computed): a decayed sum of Interactions weighted by kind, shown as a chip; **"reconnect" list** = contacts whose `cadence` (per role × relationship, e.g. champion at a target = 30 days, supplier = 180) has lapsed.
- **Auto-logged touches**: an admin-only, opt-in sweep — `GmailApp.search('from:<email> OR to:<email> newer_than:7d')` and `CalendarApp` attendee matches per contact — writes `email-in` / `email-out` / `calendar` Interactions with the thread link as evidence. Runs as a time-driven trigger under the 600 s heartbeat budget, counted against the quota tracker. Needs the `gmail.readonly` and `calendar.readonly` scopes added to the manifest — **which is what finally triggers the consent prompt** (the partial-grant trap in `gas-scripts-reference.md`).
- **Pre-meeting brief**: one tap on a contact → a compact Word export (the `ovRelWordExport` precedent) that stitches the contact timeline, the account's tags and notes, the dossier's `strategyRead[]` and last five `recentDevelopments[]`, open Signals, and the pipeline stage.
- **"On the record" check**: if a contact's name + company match a `decisionMakers[]` entry in the dossier, show it (title as the record has it, background bullets) — the corpus verifying the card, not the other way round; the card never edits the dossier.
- **Promote to field note**: an Interaction can be copied into the Profiler intake as a `sourceType: contact` note with the developer's confidence score — one-way, developer-triggered, the existing private layer unchanged.
- **Network map**: a company → contacts → shared-events graph in the page (vanilla SVG; the ecosystem graph explorer is the precedent for the interaction model).

### 4.5 What Network deliberately does not do

No two-way CRM sync (Sheets *is* the CRM; exports cover HubSpot/Salesforce imports). No in-app AI email writing in v1 (a budget surface; revisit after D12's narrative-plan command proves the session-authored route). No LinkedIn automation of any kind. No editing of dossiers. No public data — nothing under `live-site-pages/` except the page, its manifest and icons.

---

## 5 · Events — the design

**One sentence.** Events is a public event registry with its own probed source roster, a private per-account layer of stars, plans and signals, a calendar-first phone UI, and a recommendation engine that reasons from Profiler segments and Network accounts rather than from popularity.

### 5.1 The public registry (`live-site-pages/events-data/`, E0)

`events.json` — `{ schemaVersion: 1, built, events[] }`, each event modelled on `profiler-projects.json`:

```
{ slug, name, organiser, series, kind ∈ mega|conference|regional|social|corporate-summit|webinar,
  start, end, tz, city, region, country, venue, website, registrationUrl,
  exhibitorListUrl?, agendaUrl?, speakersUrl?, floorPlanUrl?,
  audience[] (segment ids from profiler-segments.json), relevance 1–5, tierNote,
  editions[] { year, start, end, city, venue },
  sources[] { sourceKey, kind ∈ jsonld|ics|html|manual, url, lastConfirmed },
  mentions[] { slug, where } (dossiers that name it — derived by the build script, never hand-kept),
  status ∈ confirmed|tentative|cancelled|past, lastUpdated }
```

`events-sources.json` — the **source roster**, one row per organiser/feed: `{ key, name, url, feedKind, robots: allowed|disallowed|unknown, lastProbe { at, status, itemCount, newestItem }, cadence, notes, blocked?: reason }`. The `scraper-sources.md` discipline applies verbatim: **probe live before adding** (HTTP status, body shape, item recency), record every unavailable outlet with a reason so it is never re-proposed (10times: Cloudflare + partner-only ToS; DCD, OCP, Enlit: 403 to non-browser clients — hand-maintained rows), and never substitute a Google-News feed for a dead source.

**Bootstrap:** `scripts/extract-corpus-events.py` walks every dossier's `recentDevelopments[]`, `productsAndServices[]`, `technicalSpecs[]` and `sources[]` for the 31 known event strings, emitting `mentions[]` and a seed row per event; the Opus research session (E0) then verifies each against the organiser site and adds the sub-mega tier the corpus never names. `scripts/check-events-registry.py` asserts slugs, dates, segment ids, that every `mentions[].slug` resolves, and that a `sources[].url` host appears in the roster. The registry's counts are never taught (the corpus-wide-count corollary).

### 5.2 The seed calendar this session verified

Of the 64 rows the research pass produced for 2026-Q4 → 2027, the ones a BESS/AIDC seller cannot miss (relevance 5, dates read from the organiser's own site unless marked U): Data Center World Power (Dallas, Sep 21–23 2026) · ACP RECHARGE (Aurora CO, Sep 22–24) · Yotta (Las Vegas, Sep 28–30) · The Battery Show NA (Detroit, Oct 12–15) · OCP Global Summit (San Jose, Oct 12–15, U) · 7x24 Exchange Fall (San Antonio, Oct 25–28) · DCD>Connect Virginia (Leesburg, Nov 3–4, U) · **RE+ 2026 (Las Vegas, Nov 16–19)** · NVIDIA GTC DC (Nov 30–Dec 3) · POWERGEN (Salt Lake City, Jan 18–21 2027) · Intersolar & ESNA (San Diego, Feb 9–11) · **DISTRIBUTECH (Atlanta, Mar 1–4)** · GTC 2027 (San Jose, Mar 15–18, U) · International Battery Seminar (Orlando, Mar 15–18) · Energy Storage Summit USA (Dallas, Apr 20–21) · DCF Trends + Microgrid Knowledge (Glendale AZ, May 5–7) · **Data Center World 2027 (Nashville, May 24–27)** · **CLEANPOWER 2027 (Anaheim, May 24–27)** · 7x24 Spring (Orlando, Jun 6–9). The regional and social tier the corpus never mentions and the developer's brief explicitly wants: Infocast PowerUp Data Centers / ERCOT Power NEXT / Southeast Power NEXT, GCPA Fall, Bisnow's DICE and regional data-center days, iMasons chapter socials (Luma-hosted). The full 64-row table with tiers, exhibitor/speaker-list availability and JSON-LD/ICS flags is **Appendix A** — E0's input.

### 5.3 The app (`Events.html` / `Events.gs`, E1–E2)

- **Calendar UI**: a **vanilla agenda scroller** — sticky month header, an infinite day-grouped list driven by `IntersectionObserver`, tap → detail sheet; a second "day plan" tab renders a timeline. Not FullCalendar (v6 injects `<style>` at runtime and needs a per-response nonce a static page cannot mint). Filters: relevance, kind, region, segment, starred, "signals only". **Add to Google Calendar** links (`calendar.google.com/calendar/render?action=TEMPLATE…&ctz=`) and **ICS download** per event (RFC 5545 text, hand-rolled); a published `events.ics` next to the page for `webcal://` subscription.
- **Stars, notes, plans, attendance** are per-account rows in Events' own spreadsheet (`Stars`, `Plans`, `Meetings`), owner-scoped like Receipts.
- **The poller** (E2): a weekly time-driven trigger walks `events-sources.json`, fetches JSON-LD / ICS with `UrlFetchApp`, normalises, and writes **diffs** (new edition, moved dates, changed venue) to a `Proposed` tab for admin approval; approved diffs are applied to the registry **by a session, not by GAS** — the registry is a repo file and a fired session cannot push (the Routines lesson), so the queue lives in Sheets (the Scraper pattern) and the write happens on the developer's next `events sync` command. No AI in the poller.
- **Discovery Routine** (quarterly, UI-created with the repo attached, later): reads the roster and the Proposed tab, researches new candidates, opens them as proposals. It follows STEP 0 of every committing Routine.

### 5.4 Recommendation (E3)

A score per event, explainable line by line in the UI: **segment fit** (audience ∩ the developer's seats' segments) + **account presence** (Network accounts with `target`/`customer`/`partner` relationship that have a live Signal for the event, weighted by stage) + **corpus salience** (`mentions[]` count, decayed) + **proximity/cost** (region preference, optional) − **conflict** (overlaps a starred event). The weights live in a `Tuning` tab the admin can edit; defaults are written down in `EVENTS-SCHEMA.md`. The "why" panel lists the contributing rows — including the Network contacts by name, which is why this surface is contributor-gated and the score is computed **in Events.gs from data fetched over the bridge**, never in the page from a public file.

### 5.5 Attendance signals (E4 — the bridge's payload)

Weekly, per **starred or top-scored** event: diff the exhibitor directory (Map Your Show / a2z pages parse server-side; store company names only), diff the speaker roster (names + companies), and search the three newswire RSS feeds for `<account name> AND (booth OR exhibit OR "will present")` for every Network account tagged target/customer/partner. Each hit becomes a `Signals` row **in Network's spreadsheet** via the bridge route — with `evidenceUrl`, `firstSeen`, `kind`, `confidence` (exhibitor 0.9, speaker 0.9, press release 0.8, Luma 0.6, manual as rated). The developer's own LinkedIn reads enter through Network's manual capture. Signals expire with the event.

### 5.6 Plans (E5)

For a starred event: (1) **booth list** — every exhibitor that matches a Network account or a covered dossier, ranked per §5.4's account and segment terms, each with a *why* line lifted from the dossier and the account's stage; (2) **sessions** — the agenda filtered by segment keywords and by speakers who are Network contacts or dossier decision makers; (3) **day plan** — show hours from the registry, ranked visits placed by hall/booth proximity where a floor plan gives it, **open slots** for meetings, and **nearby venues** from Places Nearby Search (`cafe`, `hotel_lounge`, radius 600 m, Pro field mask only) around the venue's coordinates, cached per event; (4) **meetings** — the developer books a slot against a contact; the row writes a `meeting` Interaction to Network and an ICS invite; (5) **post-event** — the day after `end`, a checklist: cards scanned at the event, meetings held, follow-up mailing (opens Network's mass-email flow pre-filtered on `Source Event`), and an ROI line (cards, meetings, stage moves) that feeds the next year's recommendation. The narrative plan is the `events plan <event>` command (D12).

---

## 6 · The bridge — how the five apps connect

The rule is the ecosystem's: **public Pages data is read directly by any page; anything private crosses only server-to-server, behind a peer token, after the user's own app has already decided the user may ask.** Every route below is a copy of `guidanceMentionsProxy_()` with its own token.

| From → To | Channel | Payload | Token / gate |
|---|---|---|---|
| Network → Profiler | public `fetch` of `profiler-companies.json`, `profiler-segments.json`, `<slug>.profile.json` | company resolution, segments, `decisionMakers[]` for the on-the-record check, `strategyRead[]` / `recentDevelopments[]` for the brief | none (public); rendered behind `nwCan('profiler')` as an app-experience gate |
| Network → Profiler | deep links `Profiler.html#<slug>` from an account; `profiler <Company>` command text for uncovered accounts | — | link rendered after the registry answers |
| Network → Profiler (private) | developer-triggered "promote to field note" → the Profiler intake (`sourceType: contact`, confidence rated) | one note | the existing intake path, unchanged |
| Events → Profiler / Scraper | public `fetch` of the registries; `mentions[]` built from dossiers by script at build time | salience, segment audience | none |
| Profiler → Events | deep link from a dossier's developments to `Events.html#event/<slug>` when an event slug is named (rendered from the public registry's `mentions[]`, no new Profiler code path until Events v1 is live) | — | public |
| **Events → Network** (private) | `Network.gs ?action=peer&t=<NETWORK_PEER_TOKEN>&nop=accounts` → `{ accounts[] { id, name, slug, relationship, stage, segments[] } }` (no contacts, no emails — minimum necessary) and `nop=signals` (POST) to write `Signals` rows | account tags for the recommendation score; signal rows | `NETWORK_PEER_TOKEN`; `Events.gs` asks only for a session that already passed `evCan('recommend')` |
| **Network → Events** (private) | `Events.gs ?action=peer&t=<EVENTS_PEER_TOKEN>&eop=today\|starred\|signals&owner=<email>` → the developer's starred events, today's event for the scan default, and open signals per account | Source Event default, "will be at" chips on a contact | `EVENTS_PEER_TOKEN`; `Network.gs` asks only after `validateSessionForData` |
| Scraper ↔ Events | Events registers each event as a Scraper seed **`key: 'event-<slug>', source: 'event:<slug>'`** (the project pattern; `tv` bump on every terms edit; multi-word terms only); Scraper's corpus route (`cop=timeline`) is read by Events **through Profiler's existing proxy pattern** — a third `CORPUS_TOKEN` consumer is a policy change, so v1 Events does *not* hold the corpus token and reads corpus salience only from `profiler-graph.json` | event-tagged news in the digest; timeline items on an event page (later) | existing `CORPUS_TOKEN` policy — do not widen it without a decision |
| Classroom ← Events | deferred (D13): `event:<slug>` provenance prefix over the public registry; a `briefing`-typed **pre-event lesson** authored by a session; gate-surface change with `gateDigest` refresh | — | `guidance` fold at most |
| Classroom ← Network | **never** — no `contact:` prefix, no private first-person data in lessons | — | — |

Two token namespaces are added (`NETWORK_PEER_TOKEN`, `EVENTS_PEER_TOKEN`), each set to the same 16+ character random value in both peers' Script Properties, `.trim()`-ed on read, never committed, never quoted back. While unset, every dependent surface reports **not configured** rather than erroring — the scan card simply has no default event, the recommendation panel says "connect Network to score by account".

---

## 7 · The model rule, applied

`PROFILER-COVERAGE-PLAN.md` §2, unchanged: **Medium buys comparison of records the repo already holds; High buys reading depth; Opus 5 xhigh buys research and authoring; Fable 5.1 xhigh buys design and evaluation against a corpus.** Two additions this program makes explicit:

- **App code on the templates is reading-depth work, so it is Fable 5.1 High.** Every build session starts by reading a 7,900-line page and a 9,600-line `.gs` (Receipts) or their Network/Events descendants, and the failure mode is missing a constraint that is already written down (the postMessage rules, the partial-grant trap, the `tv` rule, the ContentService-HTML-at-200 trap). That is depth, not research. The S1 code half and K1 ran this way and shipped clean.
- **Research and narrative authoring stay on Opus 5 xhigh** — the event registry (E0) and the `events plan` command are the two places the plan needs new sourcing and prose against sources, and Opus is half the rate against the weekly limit with no cap. **Fable 5.1 High is the substitute** for E0 if the developer wants a single model family, at the cost of the weekly cap; record the substitution in §11 either way.
- **Fable 5.1 xhigh is spent exactly twice**: the gate (NE0) and the Classroom decision (X). The developer asked whether this session should have been xhigh: **no — a proposal is reading and synthesis, and High produced it**; the *gate* is where evaluation quality compounds across the twenty sessions that follow, and that is the session to run at xhigh.
- **Fable 5.1 Medium** takes the bookkeeping: source-roster probes and rows, checker runs, ledger flips, the Scraper seed registrations, the quota review.

---

## 8 · The phase plan

| Phase | Model · effort | Sessions | What | Done when |
|---|---|---|---|---|
| **NE0** | **Fable 5.1 xhigh** | 1 | **The design gate.** Decide D1–D16; amend this file in place (decisions → "approved", reasons recorded); write the `NETWORK-SCHEMA.md` and `EVENTS-SCHEMA.md` skeletons (objects, enums, id formats, the public/private line) as the single sources of truth the builds edit against | Every D row carries a decision; both schema files exist with the enums of D5 and the registry shape of §5.1; §11 rows flipped from *proposed* to *open* |
| **N0** | Fable 5.1 High | 1 | **Network scaffold.** `setup-gas-project.sh` (auth, hipaa) → `Network.html`/`Network.gs`; manifest + icons + the `manifest-src` override; `NW_ROLE_CAPS` on both sides with admitted tiers per D7 and a `scripts/verify-network-roles.py`; `ensureNetworkTabs_()` for the §4.1 tabs; Drive root folder; Master ACL column; `HEARTBEAT_INTERVAL` 600 s / poll 60 s; the audit-row quota counter started on all projects; Profiler's explorer relabel (D1) | Sign-in works on the live page, `DEPLOYMENT_ID` recorded, deploy webhook confirmed by a GET probe, admin sees the empty list, contributor sees it, analyst is turned away; Playwright screenshots of all three |
| **N1** | Fable 5.1 High | 2 | **Capture → extraction → review → save** per §4.2: the card schema + prompt with per-field confidence, front/back pair, IndexedDB offline queue, own-Drive `_inbox` → `<Company>/` move on save, company resolution against the registry, dedupe-and-merge, the review card | 20 real cards including three Chinese-script and two two-sided round-trip with at most one manual correction each; an airplane-mode capture drains on reconnect; the Drive tree shows `Network App/<Company>/<id>-front.jpg`; no name-derived id anywhere (checker) |
| **N2** | Fable 5.1 High | 1 | **Accounts and the corpus attachment**: Accounts tab, relationship/stage/role selects, `Profiler.html#<slug>` deep links, the propose-a-dossier hook, the on-the-record check against `decisionMakers[]` | Every contact belongs to an account; a covered account shows its slug, segments and the record's title for a matching name; an uncovered one emits a valid `profiler <Company>` line |
| **E0** | **Opus 5 xhigh** (research) · Fable 5.1 Medium (roster) | 1–2 | **The registry and the roster** per §5.1–5.2: `scripts/extract-corpus-events.py`, `events.json` ≥ 60 events verified against organiser sites, `events-sources.json` with a live probe per row and every blocked source recorded with its reason, `scripts/check-events-registry.py` | Checker exits 0; every event carries `lastConfirmed` and a `sources[]` row whose host is in the roster; the 31 corpus events all have `mentions[]`; the roster has no un-probed row |
| **E1** | Fable 5.1 High | 2 | **Events scaffold + calendar** per §5.3: setup script (auth, admitted tiers per D7), `EV_ROLE_CAPS` + verifier, the agenda scroller and detail sheet, stars/notes tabs, Add-to-Google-Calendar + ICS, `events.ics` published beside the page | Live; a starred event opens correctly in Google Calendar from the link and imports from the `.ics`; Playwright screenshots of month, agenda, detail at phone width; zero page errors |
| **B** | Fable 5.1 High | 1 | **The bridge** per §6: `NETWORK_PEER_TOKEN` and `EVENTS_PEER_TOKEN`, the four peer ops, proxies copied from `guidanceMentionsProxy_` with the six token-boundary cases and the `upstream_not_json` distinction | Node harness proves every unauthorised case returns flat `denied` with zero upstream calls; with tokens set, the scan card's Source Event defaults from a starred event dated today; with tokens unset both surfaces say *not configured* |
| **N3** | Fable 5.1 High | 2 | **List, filters, bulk actions, exports, mail, my card** per §4.3 | A filtered selection exports to `.xlsx`, CSV and a vCard bundle that imports on iOS and Android; a three-recipient mailing leaves the developer's own Sent folder with `List-Unsubscribe` and writes three `email-out` interactions; the QR resolves to a vCard on a second phone |
| **E2** | Fable 5.1 High | 1 | **The poller + `events sync`**: weekly trigger over the roster (JSON-LD, ICS), `Proposed` tab, the session-side apply command in `.claude/rules/events-app.md` | One cycle proposes at least the JSON-LD sites' current editions; an approved diff lands in `events.json` through the command and the checker stays at 0 |
| **E3** | Fable 5.1 High | 1 | **Recommendation** per §5.4: the score, the *why* panel, the `Tuning` tab, computed server-side from bridge data | For the developer's real account tags the top five recommended events are defensible line by line; changing a weight in `Tuning` reorders them without a deploy |
| **E4** | Fable 5.1 High | 2 | **Attendance signals** per §5.5: exhibitor and speaker diffs, newswire RSS watch, manual LinkedIn capture on the Network side, `Signals` rows over the bridge, expiry | For RE+ 2026 the exhibitor diff yields at least one signal for a tagged account with an evidence URL and `firstSeen`; a manual signal shows on both the contact and the event; nothing fetches LinkedIn, 10times or an attendee list (grep-checked) |
| **N4** | Fable 5.1 High | 2 | **Relationship intelligence** per §4.4: warmth, reconnect list, opt-in Gmail/Calendar sweep (new scopes — expect the consent prompt), pre-meeting brief export, promote-to-note, network map | The reconnect list is correct against a hand-computed sample; the sweep writes only interactions with evidence links and never a message body; the brief exports for a covered and an uncovered contact |
| **E5** | Fable 5.1 High (code) · **Opus 5 xhigh** (the `events plan` command rule + first plan) | 2 | **Plans** per §5.6: booth list with dossier *why* lines, sessions, day plan with open slots and Places venues, meetings → Network interactions + ICS, the post-event checklist and ROI line; the `events plan <event>` command | For one starred mega-show and one regional: a day plan renders with ≥ 5 ranked booths each carrying a verbatim dossier line, open slots, and three venues within 600 m; a booked meeting appears on the contact's timeline; the narrative plan file lands in Drive |
| **X** | **Fable 5.1 xhigh** (decide) · Fable 5.1 High (build if yes) | 1 | **Classroom hook** per D13: decide; if yes, `event:` prefix + schema mirror + `gateDigest` refresh in one commit and the first pre-event briefing lesson | A written decision either way; if built, `check-classroom-pipeline.py` and `check-classroom-content.py` clean and the lesson's fold is `tracks` or `guidance`, never `briefing` from a private input |
| **R** | Developer (UI) · Fable 5.1 Medium (prompt) | in parallel, after Monday's proof | **The discovery Routine** (quarterly, repo attached, STEP 0, calendar-file-as-queue) | Created in the UI with the **Runs with** card showing the repo; first run proposes ≥ 1 event and commits or stands down with a report |
| **Q** | Fable 5.1 Medium | 1, after E5 | **Quota and ops review**: read the audit-row counter across all ten projects, retune intervals, confirm the ten-project account is inside 20,000/day with headroom | A dated table of executions/day per project in `FUTURE-CONSIDERATIONS.md` and any interval change committed |

**≈ 22 sessions**: NE0 1 · N0–N4 8 · E0–E5 9–10 · B 1 · X 1 · Q 1; R is outside the count. Twenty of them are Fable 5.1 High; two are Fable 5.1 xhigh; two carry an Opus 5 xhigh half.

---

## 9 · Per-phase detail and the reason for each model

**NE0 — Fable 5.1 xhigh.** Sixteen decisions against a five-app ecosystem with three years of recorded rules; the cost of a wrong call here is paid twenty times. Design and evaluation against a corpus is what xhigh is for.

**N0 — Fable 5.1 High.** The setup script does most of the work; the session's job is reading `gas-scripts-reference.md`'s fourteen setup steps, the partial-grant trap, and the Receipts config header carefully enough to produce a live sign-in on the first deploy. Reading depth. It also starts the quota counter because ten projects on one account is the program's standing risk.

**N1 — Fable 5.1 High, two sessions.** The Receipts capture pipeline is 1,200 lines the session must understand before changing the schema, the prompt and the Drive flow; the offline queue and the folder move are new. Two sessions because twenty real cards is a real test and the second session absorbs what the first learned about Chinese-script and two-sided cards.

**N2 — Fable 5.1 High.** Account modelling is mostly schema and UI on the pattern N1 built, plus one careful read of the registry's `aka[]`/`domains[]` resolution rules so company matching neither over- nor under-links.

**E0 — Opus 5 xhigh + Fable 5.1 Medium.** Building sixty verified event rows with organiser URLs, exhibitor-list URLs and audience segments is research; probing sixty sources and writing the roster rows is bookkeeping with a rule already written (`scraper-sources.md`). Two models, possibly two sessions. It can run in parallel with N1–N2 because nothing in it touches Network.

**E1 — Fable 5.1 High, two sessions.** The calendar scroller is the one genuinely new UI component in the program and phone-width layout work is where the estimate heuristics say to budget iterations; the second session is the Playwright pass and the ICS/Calendar-link verification on real devices.

**B — Fable 5.1 High.** One session, one pattern, copied faithfully: the `guidanceMentionsProxy_` invariants are written down, and the failure modes (a trailing newline in a property, an exception page at HTTP 200) are exactly the kind a careful read prevents.

**N3 — Fable 5.1 High, two sessions.** The exports are house-style hand-rolled formats (vCard joins JPEG-in-PDF and xlsx-via-temp-sheet); the browser-side Gmail send is the own-Drive pattern applied to a new API with a raw-MIME body — new scope, new consent prompt, and CAN-SPAM hygiene that must be right the first time it is used on real contacts.

**E2 — Fable 5.1 High.** The poller is a Scraper-shaped state machine without the AI; the design point that matters is that it *proposes* and a session *applies*, because a fired session cannot push and a GAS trigger cannot commit.

**E3 — Fable 5.1 High.** A scoring function with a tuning table and an explanation panel. Its correctness is judged by the developer against their own account list, so the session's deliverable is the *why* panel as much as the score.

**E4 — Fable 5.1 High, two sessions.** Server-side HTML parsing of exhibitor pages is brittle and each organiser differs; the first session lands the newswire RSS and the manual path (certain), the second the directory diffs (per-site).

**N4 — Fable 5.1 High, two sessions.** The Gmail/Calendar sweep adds scopes, runs on a trigger, and must never write a message body — a privacy-sensitive read of the template's audit rules. The brief export and the map are UI on existing data.

**E5 — Fable 5.1 High + Opus 5 xhigh, two sessions.** The deterministic plan is code; the narrative plan is authoring against dossiers and a registry, with the same "paraphrase, never fabricate about a person" discipline C5 wrote down (D4 there: the counterparty is a role, never a person — a plan may say *visit Sungrow's booth because the record says X*, never *ask Jane for Y*).

**X — Fable 5.1 xhigh to decide, High to build.** Whether a pre-event briefing lesson is worth a gate-surface change is an evaluation question; if yes, the change itself is a careful three-file commit with a digest refresh.

**R — the developer.** A committing Routine can only be made in the UI; the session writes the prompt (STEP 0 included) and the developer pastes it. Not before Monday's earnings-desk proof.

**Q — Fable 5.1 Medium.** Reading a counter and adjusting four constants.

---

## 10 · Sequencing, the critical path, and what must be true first

**Critical path:** NE0 → N0 → N1 → N2 → B → E3 → E4 → E5. Everything on it reads Network's account tags; nothing on it can start before the gate. **Parallel lane:** E0 (Opus) beside N1–N2 (Fable), then E1 beside N3. The two lanes join at B.

**Preconditions, in the order they bite:**

1. **The gate.** No build session starts until §3's rows carry decisions — the Classroom precedent (`PHASE6-CLASSROOM-DESIGN.md`) held its gate before C0 and every later session cited it.
2. **Monday 2026-09-21's earnings-desk A/B** decides whether *any* scheduled job in this program can commit. Until a UI-created Routine has landed a commit, R does not exist and E2's poller must propose into Sheets, which it does by design. Nothing in N0–E5 depends on a Routine.
3. **Keys and scopes.** `GEMINI_API_KEY` exists for Receipts; Network needs its own project's copy plus (D6) an `ANTHROPIC_API_KEY` for the fallback. N3's `gmail.send`, N4's `gmail.readonly` + `calendar.readonly`, and E5's Places key each add a scope or a billing question — the partial-grant trap means each addition triggers a consent prompt, which is the good case; a Places key needs a GCP project with billing enabled, which an AI Studio key does not prove exists (§12).
4. **Two new peer tokens** set in four Script Properties before B is verified.
5. **The ten-project quota** — the counter from N0 runs from the first day so Q has a month of data.
6. **The weekly Fable cap.** Twenty Fable High sessions at roughly one to two a day is the same load the Classroom program carried; if the cap binds, E0 and E5's Opus halves are already off-Fable, and any code session can drop to Opus 5 xhigh with the substitution recorded in §11.

**What the program does not depend on:** Classroom (X is optional and last), Scraper changes (seed registration is one commit per event batch, Fable Medium), any change to Profiler beyond a one-word label.

---

## 11 · Status ledger

A row is flipped by the developer or by a later session against the "done when" in §8, never by the session that wrote the criterion.

| Phase | Model · effort | Status |
|---|---|---|
| NE0 · design gate | Fable 5.1 xhigh | **Proposed — awaiting the gate session.** This file is the input |
| N0 · Network scaffold | Fable 5.1 High | Proposed |
| N1 · capture → save | Fable 5.1 High | Proposed |
| N2 · accounts + corpus attachment | Fable 5.1 High | Proposed |
| E0 · registry + roster | Opus 5 xhigh · Fable 5.1 Medium | Proposed |
| E1 · Events scaffold + calendar | Fable 5.1 High | Proposed |
| B · the bridge | Fable 5.1 High | Proposed |
| N3 · list, exports, mail | Fable 5.1 High | Proposed |
| E2 · poller + `events sync` | Fable 5.1 High | Proposed |
| E3 · recommendation | Fable 5.1 High | Proposed |
| E4 · attendance signals | Fable 5.1 High | Proposed |
| N4 · relationship intelligence | Fable 5.1 High | Proposed |
| E5 · plans + `events plan` | Fable 5.1 High · Opus 5 xhigh | Proposed |
| X · Classroom hook | Fable 5.1 xhigh · Fable 5.1 High | Proposed — deferred behind E0 stability by design |
| R · discovery Routine | Developer · Fable 5.1 Medium | Blocked on Monday's earnings-desk proof |
| Q · quota review | Fable 5.1 Medium | Proposed — after E5 |

---

## 12 · Open questions for the developer

1. **Third-party processors of card PII (D6, D9).** Gemini and Claude both receive name + email + phone per card. Neither trains on API traffic by default and Receipts already sends merchant addresses to Gemini, but a card is a person. Accept as-is, or restrict extraction to Drive OCR (free, slower, weaker) for cards whose owner asks?
2. **Consumer account vs Workspace.** Every cap in this plan — 20,000 executions/day across ten projects, 100 recipients/day for `MailApp` (avoided by D15), 500/day Gmail — is the consumer figure. A Workspace seat raises them five- to ten-fold and is the single cheapest de-risk if the program grows past one user.
3. **The Profiler relabel (D1).** "Ecosystem Network" → "Ecosystem Graph" is cosmetic; confirm or keep.
4. **Team scope.** D7 admits contributors with owner-scoped sharing, the Receipts model. If a team will use Network, the C6 "team layer" question (instructor dashboard's analogue: a shared account list with per-owner contacts) should be decided at the gate, not discovered later.
5. **Places API billing.** E5's venue recommendation needs a Google Cloud project with billing enabled (Pro tier is free at this volume, but the key requires it). Does one exist, or is the Gemini key an AI Studio key with no billing project behind it? If none, E5 ships with the free OpenStreetMap Overpass fallback and adds Places later.
6. **Seats.** Recommendation defaults (E3) assume both seats — `storage-seller` and `aidc-power-seller` — so the default segment set is the union. If one seat dominates today, say which and E3 weights it.
7. **Event registry public exposure.** `events.json` on Pages reveals which shows the corpus tracks but nothing about attendance or the developer's stars (private). Confirm the public/private line at D3 is acceptable — it is the same line `profiler-projects.json` already sits on.
8. **This session's effort.** High produced this proposal; the recommendation stands to run the gate at xhigh (§7). If the developer prefers to stay at High for the gate, the cost is judgment quality on D3, D7 and D13 — the three decisions with the longest tail.

---

## 13 · Paste-in brief for NE0 (Fable 5.1 xhigh)

> Read `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md` in full — it is the proposal for the Network + Events design gate, written 2026-09-19 at v06.71r on Fable 5.1 High. Then read, in this order: `PHASE6-CLASSROOM-DESIGN.md` (the shape of an approved gate output), `PROFILER-COVERAGE-PLAN.md` §2 (the model rule), `PROFILER-SCHEMA.md` §"Field notes" and §"Named-projects registry" (the private layer and the registry pattern), `.claude/rules/profiler-app.md` §"Scheduled Refreshes" (why a Routine cannot push), `KNOWN-CONSTRAINTS-AND-FIXES.md`, and the `Receipts.gs` config header and `saveReceipt`/`uploadReceipt`/`geminiExtractFromBase64_` (the pattern Network inherits).
>
> Hold the gate as a conversation with the developer over §3's sixteen decisions, one at a time, recommendation first. Stress-test D3 (the public/private line), D7 (admitted tiers), D13 (the Classroom prefix) and D15 (browser-side Gmail send) hardest — they are the ones with the longest consequences. Where the developer overrides a recommendation, record the override and its reason in the row; do not re-argue.
>
> Then, in one push: amend §3 so every row reads as a decision (header line "approved YYYY-MM-DD"); flip §11's NE0 row; write `repository-information/NETWORK-SCHEMA.md` (objects, tabs, enums of D5, id formats, the public/private line, the peer ops' request and response shapes) and `repository-information/EVENTS-SCHEMA.md` (the §5.1 registry shape, the roster row shape, the score terms of §5.4, the `Signals` row shape) as skeletons the build sessions edit against; write §7.x-style paste-in briefs for N0 and E0 only — later briefs are written at the close of the session before them, as the Classroom program did. Do not scaffold either app in the gate session. Standard Pre-Commit train; CHANGELOG entry; README tree entries for the two schema files.
>
> **Done when:** every D row carries a decision; both schema files exist and are cited by name in §8's N0 and E0 rows; the N0 and E0 briefs exist; the developer has said which of §12's eight questions are settled and which stay open.

---

## Appendix A · The 64-row seed calendar (researched 2026-09-20; E0 verifies every row against the organiser)

Tier: **M** mega-convention · **C** industry conference · **R** regional summit · **S** social. **Rel** = relevance to a BESS/AIDC seller, 1–5. **Ex/Sp** = public exhibitor list / speaker roster. **Feed** = JSON-LD `Event` (LD), ICS, HTML only (✗), bot wall (403), not probed (n/p). **(V)** read from the organiser's site; **(U)** third-party listing only.

| # | Event | Organiser | City | Dates | Tier | Rel | Ex/Sp | Feed |
|---|---|---|---|---|---|---|---|---|
| 1 | Data Center World Power | AFCOM/Informa | Dallas | Sep 21–23 2026 (V) | C | 5 | Ex Sp | LD |
| 2 | Uptime Network Americas Fall | Uptime Institute | Chicago | Sep 22–23 2026 (V) | C | 2 — vendors excluded | Sp | ✗ |
| 3 | ACP RECHARGE | ACP | Aurora, CO | Sep 22–24 2026 (V) | C | 5 | Sp | ✗ |
| 4 | Yotta 2026 | Yotta | Las Vegas | Sep 28–30 2026 (V) | M | 5 | Ex Sp | LD |
| 5 | GCPA Fall Conference | Gulf Coast Power Assn | Austin | Sep 28–30 2026 (V) | R | 4 | Sp | ✗ |
| 6 | Bisnow Central DC Construction/Design | Bisnow | DFW | Oct 6 2026 (V) | R | 3 | Sp | ✗ |
| 7 | The Battery Show North America | Informa | Detroit | Oct 12–15 2026 (V) | M | 5 | Ex (1,300) Sp | LD |
| 8 | OCP Global Summit | OCP Foundation | San Jose | Oct 12–15 2026 (U) | M | 5 | Ex Sp | 403 |
| 9 | SEMICON West | SEMI | San Francisco | Oct 13–15 2026 (V) | M | 3 | Ex | n/p |
| 10 | Bisnow National DC Connectivity & AI Infra | Bisnow | national | Oct 20 2026 (V) | R | 3 | Sp | ✗ |
| 11 | Bisnow West Coast DC Ops & Cooling | Bisnow | West | Oct 21 2026 (V) | R | 3 | Sp | ✗ |
| 12 | 7x24 Exchange Fall | 7x24 Exchange | San Antonio | Oct 25–28 2026 (V) | C | 5 | Sp | ICS |
| 13 | ESIG Fall Technical Workshop | ESIG | Reston, VA | Oct 26–29 2026 (V) | C | 3 | Sp | ✗ |
| 14 | CIGRE Grid of the Future | CIGRE USNC | Richmond, VA | Oct 26–29 2026 (U) | C | 3 | Sp | n/p |
| 15 | Infocast PowerUp Data Centers – Investment | Infocast/Clarion | McLean, VA | Oct 27–29 2026 (V) | C | 4 | Sp | ✗ |
| 16 | iMasons Data Center Energy Industry Update | iMasons | Texas | Nov 2 2026 (V) | S | 4 | — | ✗ |
| 17 | DCD>Connect Virginia | DCD/Informa | Leesburg, VA | Nov 3–4 2026 (U) | C | 5 | Ex Sp | 403 |
| 18 | Southeast Power NEXT | Infocast | Charlotte | Nov 4–6 2026 (V) | R | 3 | Sp | ✗ |
| 19 | NARUC Annual Meeting | NARUC | San Juan, PR | Nov 8–11 2026 (V) | C | 2 | Sp | ✗ |
| 20 | Enlit Europe | Clarion | Vienna | Nov 10–12 2026 (U) | M (intl) | 3 | Ex (750) Sp | 403 |
| 21 | Bisnow Carolinas DC Conference | Bisnow | Charlotte | Nov 12 2026 (V) | R | 3 | Sp | ✗ |
| 22 | SC26 | ACM/IEEE | Chicago | Nov 15–20 2026 (V) | M | 3 | Ex | n/p |
| 23 | **RE+ 2026** | SEIA/SEPA | Las Vegas LVCC | Nov 16–19 2026 (V) | M | 5 | Ex (MYS, 1,300+) Sp | ld+json, no Event |
| 24 | Microsoft Ignite | Microsoft | San Francisco | Nov 17–20 2026 (U) | M | 2 | Sp | n/p |
| 25 | NVIDIA GTC Washington DC | NVIDIA | Washington DC | Nov 30–Dec 3 2026 (V) | M | 4 | Sp, Ex partial | n/p |
| 26 | AWS re:Invent | AWS | Las Vegas | Nov 30–Dec 4 2026 (U) | M | 2 | Ex | n/p |
| 27 | Gartner IT Infra, Ops & Cloud | Gartner | Las Vegas | Dec 8–10 2026 (V) | C | 2 | Ex | n/p |
| 28 | Reuters Events Energy LIVE | Reuters | Houston | Dec 8–9 2026 (V) | C | 3 | Sp | n/p |
| 29 | CES 2027 | CTA | Las Vegas | Jan 6–9 2027 (V) | M | 2 | Ex (MYS) | n/p |
| 30 | PTC'27 | Pacific Telecom Council | Honolulu | Jan 17–20 2027 (V) | C | 3 | Sp | ✗ |
| 31 | POWERGEN International | Clarion | Salt Lake City | Jan 18–21 2027 (V) | M | 4 | Ex Sp | LD |
| 32 | Infocast ERCOT Power NEXT | Infocast | Austin | Jan 25–27 2027 (V) | R | 4 | Sp | ✗ |
| 33 | RE+ Northeast | RE+ Events | Boston | Feb 2–4 2027 (U) | R | 3 | Ex | n/p |
| 34 | Intersolar & Energy Storage NA | Solar Promotion/Diversified | San Diego | Feb 9–11 2027 (V) | M | 4 | Ex Sp | LD (BusinessEvent) |
| 35 | ACP OMS Conference | ACP | Long Beach | Feb 23–25 2027 (V) | C | 3 | Ex | ✗ |
| 36 | **DTECH (DISTRIBUTECH)** | Clarion | Atlanta | Mar 1–4 2027 (V) | M | 5 | Ex Sp | LD |
| 37 | InterBattery | KBIA/COEX | Seoul | Mar 10–12 2027 (U) | M (intl) | 3 | Ex | n/p |
| 38 | Solar + Wind Finance & Investment | Infocast | Phoenix | Mar 14–17 2027 (V) | C | 3 | Sp | ✗ |
| 39 | **NVIDIA GTC 2027** | NVIDIA | San Jose | Mar 15–18 2027 (U) | M | 5 | Sp Ex | n/p |
| 40 | International Battery Seminar | Cambridge EnerTech | Orlando | Mar 15–18 2027 (V) | C | 4 | Ex Sp | ICS |
| 41 | DCD>Connect New York | DCD | New York | Mar 17–18 **or** May 17–18 2027 (U — conflicting listings) | C | 5 | Ex Sp | 403 |
| 42 | RE+ Texas | RE+ Events | Houston | Mar 24–25 2027 (U) | R | 4 | Ex | n/p |
| 43 | Battery Japan | RX Japan | Tokyo | Mar 24–26 2027 (U) | M (intl) | 2 | Ex | n/p |
| 44 | SEMICON West (new spring slot) | SEMI | Phoenix | Mar 30–Apr 1 2027 (V) | M | 3 | Ex | n/p |
| 45 | Hannover Messe | Deutsche Messe | Hannover | Apr 5–8 2027 (U) | M (intl) | 2 | Ex | n/p |
| 46 | ACP Siting+Permitting / PEAK | ACP | New Orleans | Apr 13–17 2027 (V) | C | 2 | Sp | ✗ |
| 47 | Energy Storage Summit USA | Solar Media | Dallas | Apr 20–21 2027 (V) | C | 5 | Sp, Ex (sponsors) | ✗ |
| 48 | Bisnow DICE National | Bisnow | national | May 4–6 2027 (V) | C | 4 | Sp | ✗ |
| 49 | Data Center Frontier Trends + Microgrid Knowledge | Endeavor | Glendale, AZ | May 5–7 2027 (V) | C | 5 | Sp Ex | ✗ |
| 50 | CIBF | CIAPS | Shenzhen | May 12–14 2027 (U) | M (intl) | 3 | Ex | n/p |
| 51 | **Data Center World 2027** | AFCOM/Informa | Nashville | May 24–27 2027 (V) | M | 5 | Ex Sp | LD |
| 52 | **CLEANPOWER 2027** | ACP | Anaheim | May 24–27 2027 (V) | M | 5 | Ex Sp | ✗ |
| 53 | Datacloud Global Congress | BroadGroup | Cannes | Jun 1–4 2027 (U) | C (intl) | 3 | Sp | n/p |
| 54 | SNEC PV+ES | SNEC | Shanghai | Jun 2–4 2027 (U) | M (intl) | 3 | Ex | n/p |
| 55 | 7x24 Exchange Spring | 7x24 | Orlando | Jun 6–9 2027 (V) | C | 5 | Sp | ICS |
| 56 | The smarter E / ees Europe | Solar Promotion | Munich | Jun 8–10 2027 (V) | M (intl) | 3 | Ex | n/p |
| 57 | EEI 2027 | EEI | Orlando | Jun 14–16 2027 (U) | C | 3 | Sp | n/p |
| 58 | The Battery Show Europe | Informa | Stuttgart | Jun 22–24 2027 (U) | M (intl) | 3 | Ex | n/p |
| 59 | Infocast PowerUp Data Centers | Infocast | TBA | Jul 20–22 2027 (V) | C | 4 | Sp | ✗ |
| 60 | IEEE PES General Meeting | IEEE PES | San Francisco | Jul 25–29 2027 (U) | C | 3 | Sp | n/p |
| 61 | NAATBatt Annual | NAATBatt | TBA | Aug 1–5 2027 (U, weak) | C | 3 | Sp | ✗ |
| 62 | Energy Storage Finance & Investment | Infocast | San Diego | Sep 8–9 2027 (V) | C | 4 | Sp | ✗ |
| 63 | 7x24 Exchange Fall | 7x24 | Phoenix | Oct 3–6 2027 (V) | C | 5 | Sp | ICS |
| 64 | RE+ 2027 | RE+ Events | Las Vegas | Nov 15–18 2027 (V) | M | 5 | Ex | — |

**Not yet dated for 2027** (E0 re-checks): Wood Mackenzie North American Power & Renewables Forum (2026: Apr 29–30, Denver), Datacloud USA (2026: Sep 2–3, Austin), Solar & Storage Live USA (2026: Aug 12–13, Philadelphia), DCD Silicon Valley / Dallas, Bisnow DICE South / West (2026: Aug 12–13 Arlington TX; Jun 25 Bay Area), Uptime 2027. **Socials** follow the iMasons chapter pattern — Luma- or LinkedIn-hosted, city-specific — and enter through the Luma ICS layer and manual capture.

**Caveats carried from the research pass:** the DCD New York 2027 date conflict is unresolved because DCD blocks non-browser fetches; NAATBatt 2027 is weakly sourced; every (U) row is a third-party listing until E0 reads the organiser's page.

Developed by: LightAISolutions
