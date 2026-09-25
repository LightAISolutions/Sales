# Network App — Data Schema

**Single source of truth** for the Network app's data shapes: the spreadsheet tabs, the enums, the id formats, the Drive layout, the card-extraction schema, the peer ops and the export mappings. The design these shapes implement is `NETWORK-EVENTS-DESIGN-PLAN.md` (gate NE0 held 2026-09-19 → 20, every D row decided); the Events counterpart is `EVENTS-SCHEMA.md`; the Profiler and Classroom counterparts are `PROFILER-SCHEMA.md` and `CLASSROOM-SCHEMA.md`. Build sessions (N0–N4) edit **this file first, then the code** — `Network.gs` mirrors the enums server-side and `Network.html` mirrors them client-side, the Receipts `RECEIPT_CATEGORIES` / `SUBCATS` idiom.

**The public/private line, stated once.** Everything about people is private. Contacts, card images, interactions, drafts, signals about named people and account tags live in the app's own spreadsheet (behind the Master ACL, served only by `Network.gs`) and in the signed-in user's own Drive (uploaded browser-side with `drive.file`, the Receipts own-Drive pattern). **Nothing under `live-site-pages/` carries Network data** — only `Network.html`, `network.webmanifest` and its icons deploy there. The only things that leave the app are the two peer ops in §"Peer ops" (minimum-necessary payloads, token-gated, server-to-server) and the exports the developer triggers by hand.

## Contents

1. Id rules
2. Access model (D7)
3. Tabs
4. Enums — flat server lists and the grouped client map (D5)
5. Warmth and cadence (computed, never stored)
6. Drive layout and card files
7. Card extraction schema (D6)
8. Peer ops — `nop=accounts`, `nop=signals` (the bridge, §6 of the plan)
9. The Scraper people route — `cop=people` (D17)
10. Drafts and hand-off formats (D15)
11. Exports — CSV, `.xlsx`, vCard 3.0
12. Audit-row rule and disclosure rows (D9)
13. Soft delete, restore, purge (D8)
14. Checkers

## 1 · Id rules

- Every id is **opaque and random** — a prefix, a hyphen, and **13 base36 characters** derived from 8 random bytes (`Utilities.getUuid()` hashed or `Math.random`-free: use `Utilities.computeDigest` over `Utilities.getUuid()` and take the first 8 bytes), checked against the tab for collision at creation. Never derived from a name, an email, a company or a date — §164.514(c) of `HIPAA-CODING-REQUIREMENTS.md`; the Receipts `Store_Name-YYYYMMDD` pattern is **not** transferable to people
- Prefixes: `a-` Account · `c-` Contact · `i-` Interaction · `s-` Signal · `d-` Draft · `m-` Mailing (a batch of drafts). Regex: `^[acisdm]-[0-9a-z]{13}$` (`NW_ID_RE`)
- **Ids are permanent.** Drive filenames, `Signals` rows written by Events, and `Interactions` all key on them; a merge keeps the surviving contact's id and records the absorbed id in the merge Interaction
- A Profiler `slug` on an Account is a foreign key into `profiler-companies.json`, never invented here; an uncovered company has an empty slug and a local Account only

## 2 · Access model (D7 — decided admin-only 2026-09-20)

`NW_ROLE_CAPS` carries all four tier keys so that widening later is a map edit, but **only `admin` is admitted**; `nwAdmitted_(sess)` is `role === 'admin'` and every other tier is turned away at the door with an audit entry (the Classroom `clAdmitted_` idiom). `scripts/verify-network-roles.py` asserts the four tiers against the live page: admin sees the list, contributor / analyst / viewer see the turned-away card and issue zero data requests.

| Capability | admin | contributor | analyst | viewer |
|---|---|---|---|---|
| `contacts` — list, detail, scan, save, edit, soft-delete, restore | ✓ | — (not admitted) | — | — |
| `accounts` — accounts, relationship/stage, propose-a-dossier | ✓ | — | — | — |
| `profiler` — registry resolution, deep links, on-the-record check (public data; app-experience gate) | ✓ | — | — | — |
| `signals` — read Signals, the Scraper `people` proxy, manual LinkedIn capture | ✓ | — | — | — |
| `drafts` — the follow-up drafts flow and its exports | ✓ | — | — | — |
| `export` — CSV / `.xlsx` / vCard | ✓ | — | — | — |
| `purge` — hard-delete after the 30-day window | ✓ | — | — | — |

The `Owner` column, `resolveOwnerScope_` / `resolveOwnerSet_` and *not-found-not-forbidden* are copied verbatim from `Receipts.gs` and stay active — they are the widening path. The `Shares` tab is created by `ensureNetworkTabs_()` and has **no UI in v1**.

## 3 · Tabs (`Network.gs` — `ensureNetworkTabs_()`, the Receipts in-place header-upgrade idiom)

All timestamps are ISO-8601 UTC strings written by the server; dates the developer enters (`Met Date`) are `YYYY-MM-DD`. JSON columns hold a JSON array in one cell. Every tab's row 1 is the header and is frozen.

### `Accounts`

| Column | Type | Meaning |
|---|---|---|
| Account ID | `a-` id | Primary key |
| Owner | email (lowercase) | Ownership scope |
| Name | string | Display name as the developer wants it |
| Normalised Name | string | `nwNormaliseCompany_()`: lowercase, legal suffixes stripped (`inc`, `llc`, `ltd`, `gmbh`, `co`, `corp`, …), punctuation removed, whitespace collapsed — the dedupe key |
| Domain | string | Bare hostname from the card's website or email domain, no scheme, no `www.` |
| Profiler Slug | string | Registry slug when covered, else empty (resolved through `name` / `aka[]` / `domains[]` at review time; the developer confirms) |
| Relationship | enum | §4 — single-valued |
| Stage | enum | §4 — `none` unless Relationship ∈ `target` · `customer` (checker rule) |
| Segment IDs | JSON string[] | Segment ids from `profiler-segments.json`, pre-filled from the registry's `segments[]` mirror when covered, editable |
| Tags | JSON string[] | Freeform lowercase tags; the place a secondary relationship facet goes (D5). `dossier-proposed` is set by the Accounts card's **Propose a dossier** hook (N2, D4) when the `profiler <Name>` line is handed to the developer — an ordinary tag, cleared by hand once the dossier exists and the account is linked |
| HQ | string | City, Country |
| Newsroom URL | string | Optional — the company's "events / meet us at" page (§5.5.1 row 4), fetched monthly by Events since E4 s2 (carried on `nop=accounts` as `newsroomUrl` when set — §8). Edited from the Accounts card (`nop=account`, N2); a bare host is prefixed `https://` |
| Notes | string | Developer's own notes |
| Created At · Updated At · Deleted At | ISO / ISO / ISO-or-empty | Soft delete per §13 |

### `Contacts`

| Column | Type | Meaning |
|---|---|---|
| Contact ID | `c-` id | Primary key |
| Owner | email | Ownership scope |
| Account ID | `a-` id | Current employer — exactly one; a change is an `account-change` Interaction |
| Full Name · First · Last | string | As the card prints it, romanised; native script kept in parentheses after Full Name (the `decisionMakers[].name` convention) |
| Title | string | As printed |
| Department | string | As printed, optional |
| Role | enum | §4 |
| Emails | JSON `[{ value, kind ∈ work\|personal\|other }]` | Several per card |
| Phones | JSON `[{ number, kind ∈ mobile\|office\|fax\|other }]` | Stored as printed; E.164 normalisation is the dedupe key only |
| Address | string | Postal address as printed |
| LinkedIn | URL | Pasted by hand or from the card's QR; never fetched |
| Website | URL | |
| Socials | JSON string[] | Other handles printed on the card |
| Languages | JSON string[] | ISO 639-1 codes the extraction saw (`zh`, `ja`, `ko`, `en` …) |
| Source Event | slug | The Events registry slug the card was scanned at — defaults from Events' `eop=today` over the bridge, editable |
| Met Date | `YYYY-MM-DD` | Defaults to the scan date |
| Consent Marketing | enum `yes` · `no` · `unknown` | Default `unknown` (D9) |
| Do Not Contact | boolean | Excludes from every draft and export |
| Tags | JSON string[] | Freeform lowercase |
| Notes | string | |
| Card Front Link · Card Back Link | Drive URL | Own-Drive files, §6 |
| Raw Extraction | JSON | The model's full response including `confidence{}`, kept for re-review; never exported |
| Created At · Updated At · Deleted At | ISO | Soft delete per §13 |

**Display casing of Title · Department · Account Name (developer's rule, 2026-09-21; `nwStdField` in `Network.html`)** — every word First-letter-capitalised, the rest lower; C-suite titles and acronyms stay in capitals (a listed abbreviation always; in a mixed-case string any 2–4-letter capital token; in an ALL-CAPS string a vowel-less 2–4-letter token or a lone name of ≤3 letters); mixed-case words (McKinsey, PhD) as printed; parentheses never touched; a covered company takes the registry's `name`. Titles: Vice President → VP, Executive Vice President → EVP, Senior → Sr., and a rank followed by "of" takes the comma form ("Director, Storage Engineering"; Head / Chief keep "of"). Words the developer has ruled on live in `NW_CASE_FIXES` (`rai` → RAI) — add there, never special-case a row. Applied at extraction, on load, on edit, and to saved rows by the Tidy pill (`nop=get` → `nop=update`).

### `Interactions`

| Column | Type | Meaning |
|---|---|---|
| Interaction ID | `i-` id | Primary key |
| Owner | email | |
| Contact ID | `c-` id | |
| Account ID | `a-` id | Denormalised for account timelines |
| Kind | enum | §4 |
| Date | `YYYY-MM-DD` | |
| Summary | string | One line; for `email-out` the draft's subject |
| Evidence Link | URL or id | A Drive link, a `d-` id, an `.ics` UID, the absorbed `c-` id for `merge`, the previous `a-` id for `account-change` |
| Event Slug | slug | Optional |
| Created At | ISO | |

### `Signals` — the row shape shared with Events (written by Events over `nop=signals`, by the Scraper proxy, and by hand)

| Column | Type | Meaning |
|---|---|---|
| Signal ID | `s-` id | Primary key |
| Owner | email | |
| Account ID | `a-` id | Required |
| Contact ID | `c-` id | Optional — set when the signal names a known contact |
| Event Slug | slug | The event the signal is about; empty for a press quote with no event and for a `docket` row (E4 s2 — a regulatory filing names no event; the peer write leg accepts the empty slug for `docket` only) |
| Kind | enum | §4 |
| Person Name · Person Title | string | For roster / press-quote / manual signals that name someone not yet a Contact |
| Evidence URL | URL or `corpus:<key>` | Never a LinkedIn fetch; the article `key` for press quotes |
| First Seen · Last Seen | ISO | |
| Confidence | 0–1 | exhibitor 0.9 · speaker 0.9 · press-release 0.8 · press-quote 0.7 · newsroom 0.7 · luma 0.6 · manual as rated |
| Note | string | One line, the developer's or the source's |
| Source | enum `events` · `scraper` · `manual` | Which writer produced the row |

### `Drafts` and `Mailings` (D15)

`Mailings`: Mailing ID (`m-`) · Owner · Template Name · Subject Template · Body Template · Filter (JSON — the list filter that picked the recipients) · Created At. `Drafts`: Draft ID (`d-`) · Owner · Mailing ID · Contact ID · To (the chosen email) · Subject · Body (merge fields already rendered, then developer-edited) · Status ∈ `draft` · `sent` · `discarded` · Created At · Updated At · Sent At. Marking a draft `sent` writes an `email-out` Interaction whose Evidence Link is the `d-` id.

### `Shares` · `Profiles`

Verbatim from Receipts: `Shares` = Owner · Grantee · Scope (`view` \| `edit`) · Created At (20 per owner; dormant in v1); `Profiles` = Email · Drive Folder ID · Display Name · Created At · Company Name · **Title · Phone** (the two added in N3 s2 — the developer's own "My card" panel reads and writes Display Name, Company Name, Title and Phone through `nop=mycard`; the vCard its QR encodes is built from them plus the sign-in email).

## 4 · Enums (D5 — decided 2026-09-20)

The enums live here and are mirrored twice: a **flat server list** in `Network.gs` (the extraction `responseSchema` enum and the save-time validator read it) and a **grouped client map with display labels** in `Network.html` (the selects read it) — the Receipts `RECEIPT_CATEGORIES` / `SUBCATS` idiom. A change to a value belongs in all three places in one commit.

**Account `relationship`** (`NW_RELATIONSHIPS`, single-valued) — `customer` · `partner` · `supplier` · `target` · `competitor` · `channel` · `other`. Labels: Customer · Partner · Supplier · Target · Competitor · Channel · Other. A company that is genuinely two things keeps one primary value and carries the second as an Account tag.

**Account `stage`** (`NW_STAGES`) — `none` · `prospecting` · `discovery` · `rfp` · `shortlist` · `negotiation` · `post-award` · `won` · `lost`. The six middle values are the C5 scenario enum, byte-identical, so a scenario lesson and a live account speak the same word for the same moment in a sale; `none` is the pre-pipeline state and `won` / `lost` are terminal. Labels: None · Prospecting · Discovery · RFP · Shortlist · Negotiation · Post-award · Won · Lost. **Rule:** `stage` may be anything other than `none` only when `relationship` ∈ `target` · `customer` — the validator rejects the row otherwise.

**Contact `role`** (`NW_ROLES`) — `decision-maker` · `economic-buyer` · `technical-evaluator` · `point-of-contact` · `champion` · `influencer` · `gatekeeper` · `procurement` · `peer` · `other`. Labels: Decision maker · Economic buyer · Technical evaluator · Point of contact · Champion · Influencer · Gatekeeper · Procurement · Peer · Other.

**Interaction `kind`** (`NW_INTERACTION_KINDS`) — `scan` · `meeting` · `call` · `email-out` · `email-in` · `calendar` · `note` · `linkedin` · `account-change` · `merge`. `email-in` and `calendar` are **import-only** in v1 (D15 consequence: the apps hold no mail or calendar scope, and `GmailApp` / `CalendarApp` would read the script account's mailbox, not the developer's work account) — an `.ics` export or a sent-mail CSV pasted into the import panel, each row rated by the developer.

**Signal `kind`** (`NW_SIGNAL_KINDS`) — `exhibitor` · `speaker` · `press-release` · `press-quote` · `newsroom` · `agenda` · `docket` · `luma` · `linkedin-manual` · `registrant-mail` · `directory` · `other`. Maps one-to-one onto the §5.5.1 catalogue rows that produce person- or company-level signals.

**Contact `consentMarketing`** — `yes` · `no` · `unknown` (default). **Draft `status`** — `draft` · `sent` · `discarded`. **Signal `source`** — `events` · `scraper` · `manual`.

Client map shape (`NW_ENUMS` in `Network.html`):

```
{ relationship: [['customer','Customer'], …], stage: [['none','None'], …],
  role: [['decision-maker','Decision maker'], …], interactionKind: [...], signalKind: [...] }
```

## 5 · Warmth and cadence (computed, never stored)

**Built in N4 s1 (`Network.gs` v01.14g · `Network.html` v01.23w, 2026-09-23).** Nothing in this section is a column: warmth, the band, the cadence and the lapse are computed on every read from the Interactions tab and answered on the list row, the detail and the reconnect list. The constants are the only tuning surface and live in `Network.gs` — `NW_WARMTH_WEIGHTS`, `NW_WARMTH_HALF_LIFE_DAYS`, `NW_WARMTH_BANDS`, `NW_CADENCE_DAYS` — with the first three mirrored byte for byte in `Network.html` for the chip's legend only (the page never computes a score; `scripts/check-network-warmth.js` asserts the mirror).

- **`warmth(contact)`** = Σ over the contact's Interactions of `weight(kind) × 0.5^(ageDays / 90)`, rounded to two places; `ageDays` is whole days from the Interaction's `Date` to now, clamped at 0 (a future-dated touch counts at full weight). Weights: meeting 2.0 · call 1.5 · email-out 1.0 · email-in 1.2 · calendar 1.5 · scan 1.0 · note 0.3 · linkedin 0.5 · account-change 0 · merge 0 (an off-list kind weighs 0). Bands, each edge inclusive: **hot** ≥ 2.0 · **warm** ≥ 0.75 · **cool** ≥ 0.2 · **cold** below (a contact with no Interaction is 0 / cold). Answered as `warmth` (the number) and `warmthBand` on every `nop=list` row beside `lastTouch` — both come from the one read of the Interactions tab the list already made (`nwTouchPass_`) — and as the detail's `warmth` block on `nop=get`: `{ score, band, lastTouch, cadenceDays, sinceDays, overdueDays }` (`lastTouch` is the newest Interaction day, or the met date when there is none; `overdueDays` = `sinceDays − cadenceDays`, negative while inside the cadence).
- **`cadence(role, relationship)`** in days, `NW_CADENCE_DAYS`: the account's relationship picks the row, the contact's role the column — `target` / `customer`: champion 30 · decision-maker 30 · any other role 60; `partner` / `channel`: 90; `supplier` / `competitor` / `other`: 180. No or an unknown relationship reads as `other`.
- **The reconnect list** (`nop=reconnect`, session GET, behind `contacts`) — every contact in scope whose last touch is older than its cadence, most overdue first, at most `NW_RECONNECT_MAX` (200) rows, each the minimum row plus the lapse: `id · accountId · name · title · role · accountName · relationship · stage · lastTouch · sinceDays · cadenceDays · overdueDays · warmth · warmthBand`; `count`, `lapsed` (before the cap), `total` (live contacts in scope) and `today`. **Do-not-contact rows are left out** — a reconnect nudge is a draft, and D9 excludes them from every draft. A contact with no Interaction is measured from its met date; one with neither is skipped. Read-only for a `view` share.
- **The import panel** (D15 — the apps hold no mail or calendar scope; `email-in` and `calendar` are import-only kinds): `nop=import` (body-POST; `text` ≤ 400,000 characters, `format` ∈ auto · ics · csv, `kind` for a CSV with no direction column) parses the paste **server-side** and answers a proposal list, writing nothing. `.ics`: lines unfolded, VEVENT blocks walked for `UID` · `SUMMARY` (unescaped, ≤ 120) · `DTSTART` (DATE or DATE-TIME with any TZID — the day part) · every `ATTENDEE` / `ORGANIZER` `mailto:`; `DESCRIPTION` is never read. CSV (RFC 4180; tab-separated when the header has tabs and no commas): a header matched by name — Date (`date` · `sent` · `received` · …), To, From, Subject, a direction column (`direction` · `folder` · `kind` · `type` · `mailbox`), a Message-ID column; To's addresses for an outgoing row and From's for an incoming one; days read as ISO, M/D/YYYY or YYYY/MM/DD; no body column is ever mapped. Each address is matched to the live contacts in scope by email key; a proposal is `{ matched: true, contactId, contactName, accountId, email, kind, date, line, ref, duplicate }` or `{ matched: false, reason ∈ no_contact · no_date · no_email, email, kind, date, line, ref }`; the session user's own address is never proposed; `duplicate` marks a contact · kind · day · line the tab already holds. Refusals by name: `text_required` · `text_too_long` · `bad_format` · `ics_no_events` · `csv_empty` · `csv_no_rows` · `csv_columns`. `nop=importconfirm` (body-POST; `reference` ≤ 200 required — the developer's own, and `rows[]` = `{ contactId, kind, date, line, ref }` as ticked, ≤ 500) judges each row on its own — `bad_contact_id` · `bad_kind` (only `email-in` · `email-out` · `calendar`) · `bad_date` · `not_found` · `deleted` · `duplicate` — answers them in `rejected[]` and writes the rest as Interactions through the same helper the drafts flow uses: `Kind` the row's, `Date` the day, `Summary` the one line (≤ 120; `Imported <kind> touch` when empty), `Evidence Link` = the reference (` · ` the row's own ref — the `.ics` UID or the Message-ID — when it has one), `Event Slug` empty. Needs a write scope (`own` or `edit`); a `view` share answers `view_only`. Answers `written`, `rejected[]`, `interactionIds[]`.

## 6 · Drive layout and card files

Signed-in user's own Drive, created browser-side with `drive.file` (the same tree Receipts and Profiler use; `DriveApp` inside the script acts as the deploying account and must not be used for these files):

```
Network App/
├── _inbox/                    photos land here at capture — the company is unknown until extraction
└── <Company>/                 created on first save; the file MOVES here (files.update addParents/removeParents)
    ├── c-<id>-front.jpg
    └── c-<id>-back.jpg
```

`<Company>` is the Account's `Name` with filesystem-unsafe characters replaced by `-`; a rename of the Account renames the folder browser-side on the next save. Filenames are opaque per D8. The three root folder ids (`Network App`, `_inbox`, and a per-Account map) are parked on the backend the way Profiler parks its recording folders (`nwfolders` / `setnwfolders`, admin-gated, Script Properties), because `drive.file` cannot search for a folder it created in an earlier session.

## 7 · Card extraction schema (D6 — Gemini only, decided 2026-09-20)

`nwExtractFromBase64_(frontB64, backB64, mime)` is `geminiExtractFromBase64_` from Receipts with a new `responseSchema`, the same pinned `GEMINI_MODEL` / `GEMINI_FALLBACK_MODEL` constants and the same three-leg retry plan (primary, primary after 2 s, fallback model after 1 s), the key in **this project's** Script Properties as `GEMINI_API_KEY`, one call per card carrying both images as `inline_data` parts. No second vendor; a low-confidence field is outlined on the review card with "Retry extraction", never sent elsewhere automatically. §12.1 is answered: Gemini may process card PII.

```
{ fullName, firstName, lastName, title, company, department,
  emails[]  { value, kind ∈ work|personal|other },
  phones[]  { number, kind ∈ mobile|office|fax|other },
  address, website, linkedin, socials[], languages[],
  rawText,                                  // every printed string, both sides, for the dedupe fallback
  confidence { fullName, title, company, emails, phones, address, website: 0–1 }
}
```

Prompt rules the schema carries: romanise CJK names and keep the native script in parentheses; treat a second image as the back of the same card; never invent a field — empty string when absent; `confidence` is per field, 0–1, honest. QR codes printed on the card are decoded **client-side** with `BarcodeDetector` where the browser has it (no Worker needed) and merged before the model call, so a vCard QR fills the fields without a model round-trip.

**Dedupe at review time** (`nwFindDuplicate_`): normalised email → E.164 phone → normalised name + Account. A hit offers **merge** (field-by-field, newest wins by default, both card pairs kept, the absorbed id recorded in a `merge` Interaction), never a silent reject and never a bare "save anyway".

## 8 · Peer ops — the bridge (`?action=peer&t=<NETWORK_PEER_TOKEN>&nop=…`)

Every peer op is a copy of `guidanceMentionsProxy_()`'s far side: the token is read with `.trim()`, a property shorter than 16 characters answers `not_configured`, any of the six token-boundary cases (property unset, wrong token, absent token, empty token, sub-16-char property, unknown `nop`) answers a flat `{ success:false, error:'denied' }` with **zero** spreadsheet reads, and the handler runs **before** session validation because the caller is a server, not a browser. `NETWORK_PEER_TOKEN` is set to the same random 16+ character value in Network's and Events' Script Properties, never committed, never quoted back. Events calls only for a session that already passed `evCan('recommend')`.

**`nop=accounts` (GET)** — the recommendation score's input. Minimum necessary: no contacts, no emails, no notes.

```
→ ?action=peer&t=<token>&nop=accounts&owner=<email>
← { success:true, built:"<ISO>", accounts:[ { id:"a-…", name, slug, relationship, stage, segments:[…], tags:[…], newsroomUrl? } ] }
```

**E4 s2 (`Network.gs` v01.12g):** `newsroomUrl` rides the row **only when set** to an `https?://` value — the public "events / meet us at" page the developer typed on the Accounts card, which Events reads monthly (`EVENTS-SCHEMA.md` §8); still no contacts, no emails, no notes.

Only Accounts with `Deleted At` empty and `relationship` ∈ `target` · `customer` · `partner` · `channel` are returned (the score ignores the rest). `owner` scopes the rows exactly as `resolveOwnerScope_` would for a signed-in user.

**`nop=signals` (POST, JSON body)** — Events writes attendance signals into Network's `Signals` tab.

```
→ { owner:"<email>", signals:[ { accountId:"a-…", contactId?:"c-…", eventSlug, kind, personName?, personTitle?,
                                evidenceUrl, confidence, note?, firstSeen:"<ISO>" } ] }
← { success:true, written:N, updated:M, rejected:[ { index, reason } ] }
```

Upsert key: (`accountId`, `eventSlug`, `kind`, `evidenceUrl`) — a re-run of the weekly diff refreshes `Last Seen` (and `Confidence` / `Note` when carried) instead of duplicating the row. `kind` must be in `NW_SIGNAL_KINDS`, `accountId` must exist and be live, `evidenceUrl` must not be a LinkedIn host (rejected with `reason:'linkedin_not_fetched'` — the manual path is the only LinkedIn entry). `eventSlug` must match `NW_PEER_SLUG_RE` — **or be empty when `kind = docket`** (E4 s2, `Network.gs` v01.12g: a filing names no event; an empty slug on any other kind, or a malformed slug on `docket`, is `bad_slug`). Rows are written with `Source = events`.

**E4 s1 (`Network.gs` v01.11g):** a LinkedIn host is **accepted when `kind = linkedin-manual`** — Events' manual form is that entry, pasted by the developer and never fetched by either app; every other kind is still rejected. The GET read leg carries `personName` / `personTitle` when the row names a person (a speaker from a roster, a manual row) and omits the keys otherwise, so a company-level row stays ids and evidence. A **session** read exists beside the peer one: `nop=signals` (GET, after `validateSessionForData` + `nwRequire_(sess, 'signals')`) with `accountId`, or `contactId` resolved to its account → `{ success, accountId, contactId, signals:[ { id, accountId, contactId, eventSlug, kind, evidenceUrl, confidence, firstSeen, lastSeen, source, note, personName?, personTitle? } ] }`, newest `Last Seen` first — the account and contact details' one "Will be at" line (`Network.html` v01.21w); the chips with event names over Events' `eop=signals` are N4's. Audit: ids and counts only.

**E4 s3 (`Network.gs` v01.13g):** the write leg gains the **`corpus:` branch** — `evidenceUrl` may be `corpus:<key>` (`NW_CORPUS_KEY_RE`, the Scraper's article key in the CL_REF_RE charset) **when `kind = press-quote` only**; any other kind still needs `https?://` (`evidence_required`). The empty `eventSlug` is accepted for `press-quote` as well as `docket` (§3 — a press quote with no event). A `press-quote` row must name a person (`person_required`). The **upsert key adds the person's name key for `press-quote`** (`nwSignalKey_`) — one article can quote several people at one account and each is its own row; on every other kind the key is unchanged. The leg takes a `source` argument the caller sets — `events` over the bridge (the default), `scraper` from this app's own accept step — never from the body. Two **session** ops sit beside the read: **`nop=people`** (GET, behind `signals`) — `accountId` [, `since=YYYY-MM-DD`, default the last `NW_PEOPLE_DEFAULT_DAYS` = 90 days] → `{ success, accountId, slug, covered, since?, items:[ { key, publishedAt, source, title, url, people:[ { name, title, company, role, context, accepted, signalId } ] } ] }`; an account with no Profiler slug answers `covered:false` and an empty list **with no fetch**; `accepted` is true where the Signals tab already holds a `press-quote` row with that `corpus:<key>` and that name key. **`nop=peopleaccept`** (behind `signals`) — `accountId`, `key`, `name` [, `title`, `company`, `context`, `publishedAt`] → one row through the write leg with `Source = scraper`: `kind = press-quote`, `Confidence = 0.7`, `Evidence URL = corpus:<key>`, the person's name and title, `Event Slug` empty, `First Seen` the item's date, the context as the `Note` (the outlet in parentheses when it is not this account), `Contact ID` set when a live Contact at that account has the same name key; `bad_key` · `name_required` · `read_only_scope` (a view-only share). Answer `{ success, accountId, contactId, written, updated }`. Audit: the account id, a covered flag and counts — never a slug, a key or a name.

**N4 s2 (`Network.gs` v01.15g):** the **session** read `nop=signals` gains the event names — every row naming an event carries `eventName` and, when the registry has it, `eventStart`, and the answer adds `events:{ <slug>:{ name, start } }` (the named slugs only) and `eventsConfigured` — from **one** call to Events' `eop=signals` per read (`nwSignalEvents_` over `nwEventsProxy_`; Events joins each slug to its registry, `EVENTS-SCHEMA.md` §8), made only when a row names an event; `not_configured` answers `eventsConfigured:false` and an `upstream_*` fault leaves the rows on their slugs — never a failure. The row read is shared with the brief (`nwSignalRows_`). Audit: the ids, `signals` and `events` counts. Two session ops sit beside it, both behind `contacts`:

- **`nop=brief`** (GET) — `contactId` → `{ success, built, contact, account, interactions:[…], signals:[…], events:{…}, eventsConfigured, warmth:{ score, band, lastTouch, cadenceDays, sinceDays, overdueDays }, stage }`: the contact's own rows and nothing beyond its account — the contact (the §3 row minus `Raw Extraction`, the card links, `Owner` and `Deleted At`), the account (`id · name · slug · relationship · stage · segmentIds · tags · hq · newsroomUrl · notes`), every Interaction newest first, the account's live Signals (at most `NW_BRIEF_SIGNALS_MAX` = 50) named as above, the §5 warmth block, the stage. The dossier pieces are the **page's** read of Profiler's served JSON (as the on-the-record check) — never through a proxy, never written (D4). An export: writes the §12 disclosure row and a `data_export` audit. `bad_contact_id` · `not_found` (another owner's row) · `deleted`; a view share reads.
- **`nop=promote`** (body-POST) — `interactionId` (`i-`), `confidence` (a whole number 0–100, typed as one — the empty string is refused), `learned` (**since v01.18g / v07.49r** — what the developer learned, required, whitespace collapsed to single spaces, ≤ 3,000 `NW_PROMOTE_LEARNED_MAX`; the page's **What did you learn?** box), `profilerSession` (the developer's own Profiler session, ≥ 32 characters, read by the page from this origin's `localStorage` under Profiler.html's `ov_note_session` key) → one note into Profiler's intake **through Profiler's existing note op** (`PROFILER_INTAKE_EXEC` = Profiler's `/exec` from `Profiler.config.json`; `action=note` · `nop=submit` · `session` · `slug` · `sourceType=contact` · `note` · `confidence`, D16 — never a new Profiler op) → `{ success, interactionId, contactId, intakeId, slug, confidence, noteInteractionId }`. The note text is one paragraph that opens with the learned text followed by ` — Context: `. Before v07.49r the History row's machine-written summary ("Card scanned", "Meeting at …") was all a promotion carried, and Network has no free-text touch. The context then gives the kind, the person and their account, the day, the summary (≤ 2,000), then `[Network interaction <i- id> · evidence <the row's Evidence Link, ≤ 300> · event <slug>]` — the i- id is the note's evidence; ≤ 4,000 (Profiler's ceiling). `slug` is the account's Profiler slug when it matches `NW_PEER_SLUG_RE`, else `general`. One-way: the dossier is never edited, the private layer unchanged. **The promotion is recorded as a `note` Interaction on the contact** — Summary `Promoted to a Profiler field note (confidence N/100): <the learned text, ≤ 300 NW_PROMOTE_EXCERPT_MAX, cut with …>` (the 500-character Summary cap still applies), Evidence Link `promoted:<i- id>:<intake id>`, the source row's Event Slug, dated today — and the source Interaction is **not** touched (§3: its Evidence Link holds its own evidence); that marker is the duplicate guard. Refused by name **before any call**: `bad_interaction_id` · `bad_confidence` · `learned_required` · `learned_too_long` (with `max`) · `profiler_session_required` · `not_found` (another owner's row, an unknown id) · `deleted` (the contact) · `duplicate` (with the earlier `intakeId`) · `view_only`; Profiler's own answers are relayed as `profiler_session_expired` (SESSION_EXPIRED) · `profiler_admin_only` (ADMIN_ONLY) · `profiler_rejected` (anything else, the word in `detail`) · `upstream_http_<code>` · `upstream_unreachable` · `upstream_not_json`, with nothing written. The Profiler session is relayed once and never stored, logged or audited. Audit: `interactionId` · `contactId` · `ok` (and the error name on a relayed refusal).

**E5 s1 (`Network.gs` v01.16g) — `nop=interaction`, two legs on one op** (the session's one bridge widening; design plan §5.6 item 4, D15): behind `NETWORK_PEER_TOKEN` with the same six flat-`denied` boundary cases and zero reads, handled before session validation.

```
→ ?action=peer&t=<token>&nop=interaction&owner=<email>&accountId=<a-…>          // GET — the pick list a meeting is booked against
← { success:true, built, accountId, contacts:[ { id:"c-…", name, title, role } ] }   // the live contacts under one of the owner's accounts, minimum necessary — no emails, no phones, no notes
→ POST { owner, interactions:[ { contactId, accountId?, kind ∈ meeting · calendar, date:"YYYY-MM-DD", summary, evidence, eventSlug? } ] }
← { success:true, written:N, rejected:[ { index, reason } ], ids:[ "i-…" | "" ] }      // the i- ids in row order, so Events stores the record's id on its Meetings row
```

**E5 s2 (`Network.gs` v01.17g) — the read leg widened with `eventSlug`** (the session's one bridge change; design plan §13.18 step 1, §5.6 item 5, D9). A GET carrying `eventSlug` and no `accountId` answers what Events' post-event checklist counts, so the close-out needs **no second op**:

```
→ ?action=peer&t=<token>&nop=interaction&owner=<email>&eventSlug=<slug>
← { success:true, built, eventSlug,
    contacts:[ { id, name, title, role, accountId, accountName, stage, mailable } ],   // the LIVE cards whose `Source Event` is the slug, by name
    meetings:[ { id:"i-…", contactId, date, evidence:"mt-…", mark ∈ ''·yes·no, held:bool } ] }   // the `meeting` Interactions on the slug
```

Minimum necessary holds and tightens: no emails, no phones, no notes, and **consent is one boolean** — `mailable` is `Consent Marketing` ≠ `no` AND not `Do Not Contact` (D9's own rule) — rather than the two columns, because the checklist only ever needs the count. The account's `name` and `stage` ride the contact row because the ROI line's stage term is read at close-out time; nothing else about the account crosses. A soft-deleted contact never appears; a malformed slug is `bad_slug`.

Two derived fields are computed **here** rather than shipped as rows, because a boolean and a three-value word are strictly less data than what they are derived from. `held` is the **inference** — a later `note` or `email-out` Interaction on the same contact within `NW_MEETING_HELD_DAYS` = 14 days of the meeting. `mark` is the developer's **explicit verdict**, read from a `note` Interaction whose Evidence Link is that meeting's `mt-` id and whose Summary is exactly `NW_MEETING_MARK_HELD` (`Meeting held`) or `NW_MEETING_MARK_NOT` (`Meeting not held`) — the two phrases are **mirrored byte for byte in `Events.gs`** (`EV_MEETING_MARK_*`, asserted by `scripts/check-events-plan.js`), and the newest mark on a meeting wins. Mark rows are **excluded from the touches that feed the inference**: without that, a "not held" mark would itself read as a later touch and invert its own verdict. Events resolves the two as `mark || (held ? 'yes' : 'unconfirmed')`. `NW_PEER_INTERACTION_KINDS` gains **`note`** for that mark write; nothing else about the write leg changes. Audit: `peer_interaction_event_read` — the slug and three counts, never a card field or an account name.

The write leg records through the **same `nwInteractionAdd_` every session op uses** (§3 `Interactions`): the contact must exist, be live and be the owner's (`contact_not_found`), an `accountId` named must be the contact's (`account_mismatch`), the kind on the short list (`bad_kind`), the day a day (`bad_date`), the summary one line — collapsed and capped at 500, **never a body** (`summary_required`), the evidence an Events `mt-` / `pl-` id or an `https?://` URL (`bad_evidence` — Events' booking writes the `mt-` id, the way `promoted:` rides the column for a promotion), the slug the peer shape or empty (`bad_slug`); one bad row never fails the batch; `bumpDataRev()` once when anything was written. `interactions_required` · `too_many_interactions` (> 100) · `bad_json` · `owner_mismatch` · `owner_required`. A form-encoded caller may carry the rows in an `interactions` field (`nwPeerJsonBody_` takes the field name). Audit: `peer_interaction_read` (the account id, a count) · `peer_interaction_write` (counts). Unbooking in Events leaves the row — the Interaction is the record (D15); the developer deletes it in this app if a meeting never happened.

**`nop=today` is not a Network op** — the scan card's Source Event default is read from Events (`eop=today`, `EVENTS-SCHEMA.md` §8) through Network's own proxy after `validateSessionForData`.

## 9 · The Scraper people route (D17 — decided 2026-09-20)

Network reads quoted and bylined people from the trade press Scraper already ingests, through its own proxy `nwPeopleProxy_(slug, since)` — `guidanceMentionsProxy_()` verbatim with a different URL and token — behind `nwCan('signals')`:

```
→ <SCRAPER_EXEC>?action=corpus&t=<NETWORK_CORPUS_TOKEN>&cop=people&slug=<registry slug>&since=<YYYY-MM-DD>
← { success:true, items:[ { key, publishedAt, source, title, url,
                            people:[ { name, title, company, role ∈ quoted|author|named, context } ] } ] }
```

`NETWORK_CORPUS_TOKEN` is a **third token namespace** — set in Scraper's and Network's Script Properties, never `CORPUS_TOKEN` (Profiler ↔ Scraper) and never `GUIDANCE_PEER_TOKEN` (Profiler ↔ Classroom). Each hit the developer accepts becomes a `Signals` row with `kind = press-quote`, `Evidence URL = corpus:<key>`, `Source = scraper`, `Confidence = 0.7`, `Person Name` / `Person Title` filled, and `Contact ID` set when the name matches a live Contact at that Account. `people[]` accrues per Scraper summarisation pass. **Built in E4 s3 (`Scraper.gs` v02.22g · `Network.gs` v01.13g · `Network.html` v01.22w) — no back-fill**: the brief decided against D17's "one-time admin job", so only items summarised from v02.22g onward carry people (`ppl` in the item's Signals blob — at most 5 per item, role from the closed list, name / title / company 80 characters, context 120) and older items are never re-read and never answered. The far side (`scHandlePeople_` → `scPeopleScan_`) is routed **before** the `CORPUS_TOKEN` gate and reads `NETWORK_CORPUS_TOKEN` alone (trimmed; under 16 characters refuses even a matching `t`; every boundary case a flat `denied` with zero sheet reads and nothing audited) — Profiler's token never opens it and the Network token never reaches `timeline` or `candidates`. It answers only rows whose blob carries `ppl`, the slug's rows (`mcs` / `mc`), `since` honoured (a bad date reads as none), one row per article key with the last-stored edition's row, corpus-only (archive) rows counted, `limit` ≤ 200 (default 60); the answer adds `since` and `count`; the audit row carries the slug, the window and the item and person counts. The near side is `nwPeopleProxy_(slug, since)` and the two session ops are in §8. On the page the list is read **on a tap** ("Read the press"), never on the detail open and never polled; Accept is per person and the "Will be at" line re-reads in place. Harness: `scripts/check-scraper-people.js` (§14).

## 10 · Drafts and hand-off formats (D15 — the apps never send)

A mailing picks recipients from the filtered list (`Do Not Contact` rows are excluded always; `Consent Marketing = no` rows are excluded from any mailing; `unknown` is allowed — D9), applies a template, and renders **one editable draft per recipient** in a review list. Merge fields: `{{first}}` · `{{last}}` · `{{company}}` · `{{title}}` · `{{metAt}}` (the Source Event's display name) · `{{metDate}}` · `{{lastTopic}}` (the newest Interaction's Summary) · `{{myName}}` · `{{myCompany}}` (from `Profiles`). Every default template ends with an unsubscribe line and the developer's postal address (from `Profiles` → Company Name and a `NW_POSTAL_ADDRESS` Script Property); the developer may delete them per draft. Hand-off, all client-side:

| Format | Shape |
|---|---|
| `.eml` bundle | One RFC 5322 file per draft (`From` — typed once, kept in `localStorage` — `To`, `Subject` (RFC 2047 when non-ASCII), `Date`, `MIME-Version`, `Content-Type: text/plain; charset=utf-8`, `X-Unsent: 1`, body), zipped client-side with the page's hand-rolled store-only zip (`nwZip`, also the per-contact vCards' container); drag into any mail client |
| CSV / `.txt` | One row per recipient: `to, subject, body` (CSV) or `--- <to> ---` blocks (`.txt`) |
| Copy | Per draft: subject + blank line + body to the clipboard |
| `mailto:` | `mailto:<to>?subject=<enc>&body=<enc>` — opens the default client; bodies over ~1,800 characters fall back to Copy (URL length) |

No `gmail.*` scope, no `MailApp`, no Gmail API anywhere in either app. Sent-ness is recorded by the developer marking the draft sent.

**The ops (N3 s2, all behind the `drafts` capability):** `nop=mailings` (GET — the named templates, newest per name; the open drafts with the contact's name, at most 200; the `me` fields) · `nop=drafts` (POST — `ids` + either `mailingId` or `subject` + `body`, with `name` to save the template; one Mailings row per render carrying the template and the list `filter`; answers `mailingId`, `drafts[]` and `skipped[]` with `do_not_contact` · `no_consent` · `no_email` · `not_found` · `deleted` · `duplicate` · `bad_id`) · `nop=draftstatus` (POST — `id`, `status` ∈ `draft` (an edit: `subject` / `body`) · `sent` (the `email-out` Interaction, `Sent At`) · `discarded`; a sent draft answers `already_sent` to any further change). The `To` is the first `work` email, else the first email. `{{myAddress}}` reads the `NW_POSTAL_ADDRESS` Script Property; the page's default template ends with the unsubscribe line and `{{myAddress}}`.

The template's own `sendHipaaEmail` (MailApp, the HIPAA security-alert helper every auth project carries) lives outside the PROJECT region and is never reached from it; the verifier's D15 grep covers the served page and the PROJECT region.

## 11 · Exports — CSV, `.xlsx`, vCard 3.0

- **CSV / `.xlsx`** — the Receipts temp-spreadsheet path; sheets `Contacts`, `Accounts`, `Interactions`, `Signals`. Column set = the tab columns **minus** `Raw Extraction`, `Owner`, `Deleted At`, and the Drive links; JSON columns are flattened (`Emails` → `email1, email2, …`). Every export writes a disclosure row (§12)
- **vCard 3.0** (hand-rolled text, no library; one `.vcf` per contact or one bundle) — the mapping is the one Android and iOS both import:

| vCard | Network |
|---|---|
| `N:Last;First;;;` · `FN:Full Name` | Last · First · Full Name |
| `ORG:Account Name;Department` · `TITLE:` | Account → Name · Department · Title |
| `EMAIL;TYPE=WORK:` (one per entry; `HOME` for `personal`) | Emails |
| `TEL;TYPE=CELL:` / `WORK` / `FAX` | Phones by kind |
| `ADR;TYPE=WORK:;;<Address>;;;;` | Address (unstructured, in the street slot) |
| `URL:` · `X-SOCIALPROFILE;TYPE=linkedin:` | Website · LinkedIn |
| `NOTE:` | `Met at <Source Event> on <Met Date>` + Notes |
| `CATEGORIES:` | Tags + `relationship:<value>` + `role:<value>` |
| `PHOTO;ENCODING=b;TYPE=JPEG:` | Card front, **only when the developer ticks "include card image"** (re-fetched from Drive client-side, then redrawn at 720 px / JPEG q 0.8 before it is encoded — the stored front is the 2,000 px capture, which is far more than a contact avatar needs and more than iOS reliably imports) |
| `REV:` · `UID:` | Updated At · `c-` id |

Line folding at 75 octets and `\,` / `\;` / `\n` escaping per RFC 2426. The developer's **own card** QR encodes the same vCard built from `Profiles`.

**N3 s2:** `nop=export&format=csv|xlsx|vcard` — one gather (`nwExportRows_`), then the CSV text, the `.xlsx` base64 (Contacts / Accounts / Interactions sheets; Signals stay out until N4 gives them a surface), or `cards[]` (`id`, `filename`, `vcard`, `frontLink`) plus the `vcf` bundle. The per-contact download is a client-side zip of the `cards[]`; the PHOTO splice is client-side too (`nwCardFrontPhoto` — fetch, downscale to 720 px, base64 straight out of the canvas → `nwVcardWithPhoto`, folded at 75 octets by `nwVcardFold`, which indexes the source string and joins once; **the full-size front is never turned into a string**, and the fold is never written as a loop that re-slices a shrinking line — that form is quadratic on a PHOTO line and crashed the mobile renderer in v01.19w). The QR (`nwQrMatrix`) is a hand-rolled byte-mode encoder, versions 1–10 at level M, cross-checked module for module against python-qrcode by the verifier.

**N4 s2 — the pre-meeting brief (`.docx`)** — `nop=brief` gathers the contact's own rows (§8) and the page builds a **real `.docx`** client-side — three parts over the same store-only zip the vCard bundle uses (`[Content_Types].xml`, `_rels/.rels`, `word/document.xml`; no library, no styles part — headings are bold runs): the heading `<name> — pre-meeting brief`, a generated line, the **warmth** line (band and score, last touch, cadence, the lapse), then CONTACT (title · department, role, emails, phones, LinkedIn, met at, consent with DO NOT CONTACT when set, tags, notes), ACCOUNT (company · HQ, relationship, stage, segments, tags, notes, `covered — <slug>` / `not covered`), TIMELINE (every Interaction, newest first, as bullets), WILL BE AT (the chips as bullets — the event's name, start, kinds and confidences, the person), STRATEGY READ and RECENT DEVELOPMENTS (the served dossier's `strategyRead[]` and its **last five** `recentDevelopments[]` by date, with the dossier's version and update date; `Not covered by Profiler — no dossier to read.` when the account has no slug, or a note when the served file could not be read), PIPELINE STAGE, and a footer naming the contact id and the disclosure. Filename `<name-slug>-brief-<YYYY-MM-DD>.docx`. Every brief writes the §12 disclosure row (`network_brief rows=1 ids=<c- id>`); the dossier is read, never written; `verify-network-roles.py` unzips the download and reads its paragraphs back.

## 12 · Audit-row rule and disclosure rows (D9)

`auditLog(event, user, result, details)` is the template's function and is called on every data op. **`details` may carry ids (`a-`, `c-`, `i-`, `s-`, `d-`), counts, and the op name — never a card field**: no name, email, phone, company, address, note, or draft body, ever. The reviewer's test is `grep -n 'auditLog(' Network.gs` and reading each `details` argument. Every export and every share grant writes a **disclosure row** through the template's §164.528 machinery (`logDisclosure` or its equivalent in the auth template) naming the op, the row count and the ids exported — again never the contents. List ops return the minimum-necessary subset (`id`, name, company, title, role, relationship, stage, warmth, last touch, source event — and, since N2, the live `contactCount` per account); detail ops return the full row (`nop=get` on an `a-` id also answers the live contacts beneath as id · name · title · role). **Since N3 s1** the list row also carries `lastTouch` (the newest Interaction date, computed server-side once per list) — the columns the search and the eight filters read (Emails, Tags, Consent Marketing) are read by the list op and dropped before the answer; `nop=bulk` audits the op name and the id / applied / unchanged / accounts / rejected counts; `nop=export` writes the disclosure row through `recordDisclosure` with the op, the row count and the ids, and audits rows / excluded / ids. **Since N3 s2** every export format writes the same disclosure row and audit; `nop=drafts` audits the m- id and the drafts / skipped / ids / saved counts; `nop=draftstatus` the d- id, the i- id and sent / discarded / edited flags; `nop=mailings` the template and draft counts; `nop=mycard` a saved flag — a draft's subject, body and address never reach an audit row, and `check-network-schema.py`'s allow-list carries exactly these keys. **Since N4 s1** `nop=reconnect` audits `contacts` / `total` / `excluded` (the do-not-contact rows left out), `nop=import` `rows` / `matched` / `unmatched` and `nop=importconfirm` `rows` / `written` / `rejected` — never an address, a name, a line or the reference; `matched` and `unmatched` join the allow-list. **Since N4 s2** `nop=brief` is a `data_export` audit of `contactId` / `interactions` / `signals` / `events` beside its disclosure row; `nop=promote` audits `interactionId` / `contactId` / `ok` (plus `error` on a relayed refusal) — never the note text, the confidence or the Profiler session; `nop=signals` adds the `events` count. No new allow-list key.

## 13 · Soft delete, restore, purge (D8)

- Soft delete sets `Deleted At`; every list op filters `Deleted At` empty; restore clears it — one tap, no confirmation dance
- An Account with live Contacts **cannot** be deleted (`error:'account_has_contacts'`); reassign or delete them first — nothing cascades silently
- **Purge** (admin-only, `nwCan('purge')`) lists rows with `Deleted At` older than 30 days; the browser trashes the card files with the user's own `drive.file` token (the files live in the user's Drive, so `DriveApp` cannot reach them), then the server deletes the rows and their Interactions, Signals and Drafts. The purge writes one audit row per id
- The **36-month review list** (D9) is a filter, not a state: contacts whose newest Interaction is older than 36 months, surfaced under "Review", never auto-deleted

## 14 · Checkers

- `scripts/verify-network-roles.py` (N0) — the four-tier door check against the live page, the `verify-profiler-roles.py` shape; extended each phase through N3 s2 — the exports (the vCard walker, the PHOTO splice, the zip, the `.xlsx` bytes), the drafts flow end to end, the QR encoder against python-qrcode, and the D15 grep (no `MailApp` / `GmailApp` / Gmail scope in the served page or the PROJECT region); N4 s1 the warmth · reconnect · import passes; N4 s2 the chips · brief (the `.docx` unzipped and its paragraphs read back) · promote · map passes and the D17 grep
- `scripts/check-network-schema.py` (N1; N2) — reads `Network.gs` and `Network.html`, asserts the three enum mirrors are identical to this file's lists, that the D5 stage validator (`STAGE_NEEDS_TARGET_OR_CUSTOMER`) is reached by **both** write paths — `nop=save` and `nop=account` — that every id literal in tests matches `NW_ID_RE`, that no id-generating function takes a name or a date as input, and that every `auditLog(` call's `details` argument is built from ids and counts only (a lexical check on the argument expression). Exit 1 on any finding
- `scripts/check-scraper-people.js` (E4 s3) — the people route on the two-VM idiom: Scraper's real far side (the summarise pass's `scPeopleParse_` / `scSignalsMerge_`, `scHandleCorpus_` → `scHandlePeople_` → `scPeopleScan_`) in one context, Network's real `nwPeopleProxy_` / `nwPeopleOp_` / `nwPeopleAcceptOp_` / `nwPeerSignalsWrite_` in another with the Network fetch routed into the Scraper context — every token-boundary case flat `denied` with zero reads, `CORPUS_TOKEN`'s value never opens the route, the §9 shape, no back-fill, the near side's four error names, the uncovered account, the accept row and its contact match, the `corpus:` branch for `press-quote` only; 62 checks, zero live calls
- `scripts/check-network-warmth.js` (N4 s1) — the real warmth and cadence helpers, the list op's single touch pass, `nwListOp_` / `nwGetOp_`, `nwReconnectOp_`, the `.ics` and CSV parsers and `nwImportOp_` / `nwImportConfirmOp_` with the real `nwInteractionAdd_` in one sandboxed VM context: the §5 constants and the page's mirror, warmth against hand-computed values and every band edge, every cadence cell, warmth on the row and the detail from one read and stored nowhere, the reconnect order and its exclusions (do-not-contact, another owner, deleted, inside the cadence), the parsers on fixtures (folding, TZID, all-day, escaped commas, quoted CSV fields, a direction column, a Message-ID column, a tab-separated From-only file), a proposal that writes nothing with the unmatched address never written, a confirm that writes only the ticked rows with the reference · ref as evidence and refuses the rest per row, the duplicate on a re-confirm, no mail or calendar scope in the PROJECT region or the page; 66 checks, zero live calls
- `scripts/check-network-brief.js` (N4 s2) — the real `nwBriefOp_`, `nwPromoteOp_` with `nwProfilerIntake_` and `nwInteractionAdd_`, `nwSignalsOp_` with `nwSignalRows_` / `nwSignalEvents_` / `nwEventsProxy_` in one sandboxed VM context, `UrlFetchApp` routed to an in-memory Events `eop=signals` stub and a Profiler `action=note` stub with any other call counted as escaped: the signals read named by one Events call, degrading to slugs on not_configured or an HTML answer, zero calls when no row names an event; the brief's every section from the contact's own rows (another account's signals, another owner's rows and the raw extraction never), the disclosure row with the op · count · id, the `data_export` audit; the promote payload to Profiler's existing note op (`sourceType: contact`, the confidence bounded with the empty string refused, the i- id and the row's evidence in the text, the slug or `general`), the `note` Interaction recording it with the source row untouched, the learned text required and bounded and leading the note, with its excerpt in the recording Interaction's Summary; the duplicate and every refusal by name with zero calls, Profiler's three refusals relayed with nothing written; the D15 / D17 greps; 60 checks, zero live calls
- `scripts/check-events-plan.js` (E5 s1) — the plan on the two-VM idiom, this app's side: the real `nwPeerInteraction_` / `nwPeerContactsRead_` / `nwPeerInteractionWrite_` with `nwInteractionAdd_` in the Network context — the six token-boundary cases flat `denied` with zero reads, the pick list ids · names · titles · roles only with a deleted contact never answered, the write leg's seven rejections by index (`bad_kind` · `bad_date` · `summary_required` · `bad_evidence` · `bad_slug` · `contact_not_found` · `account_mismatch`), a body collapsed to one line, the `ids[]` in row order, the audit rows counts only; see `EVENTS-SCHEMA.md` §12 for the Events side
- `node --check` on the `.gs` copy and `scripts/check-gas-inner-scripts.js`, as for every project

Developed by: LightAISolutions
