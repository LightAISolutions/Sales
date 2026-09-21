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
| Newsroom URL | string | Optional — the company's "events / meet us at" page (§5.5.1 row 4), fetched monthly by Events in E4 s2. Edited from the Accounts card (`nop=account`, N2); a bare host is prefixed `https://` |
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
| Event Slug | slug | The event the signal is about; empty for a press quote with no event |
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

Verbatim from Receipts: `Shares` = Owner · Grantee · Scope (`view` \| `edit`) · Created At (20 per owner; dormant in v1); `Profiles` = Email · Drive Folder ID · Display Name · Created At · Company Name (the developer's own "My card" panel reads Display Name and Company Name).

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

`warmth(contact)` = Σ over the contact's Interactions of `weight(kind) × 0.5^(ageDays / 90)`, shown as a chip: **hot** ≥ 2.0 · **warm** ≥ 0.75 · **cool** ≥ 0.2 · **cold** below. Weights: meeting 2.0 · call 1.5 · email-out 1.0 · email-in 1.2 · calendar 1.5 · scan 1.0 · note 0.3 · linkedin 0.5 · account-change 0 · merge 0. The **reconnect list** is every contact whose last touch is older than `cadence(role, relationship)` days: champion or decision-maker at a `target` / `customer` 30 · any role at `target` / `customer` 60 · `partner` / `channel` 90 · `supplier` / `competitor` / `other` 180. The weights and cadences are constants in `Network.gs` (`NW_WARMTH_WEIGHTS`, `NW_CADENCE_DAYS`) and are the only tuning surface; they are not a tab.

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
← { success:true, built:"<ISO>", accounts:[ { id:"a-…", name, slug, relationship, stage, segments:[…], tags:[…] } ] }
```

Only Accounts with `Deleted At` empty and `relationship` ∈ `target` · `customer` · `partner` · `channel` are returned (the score ignores the rest). `owner` scopes the rows exactly as `resolveOwnerScope_` would for a signed-in user.

**`nop=signals` (POST, JSON body)** — Events writes attendance signals into Network's `Signals` tab.

```
→ { owner:"<email>", signals:[ { accountId:"a-…", contactId?:"c-…", eventSlug, kind, personName?, personTitle?,
                                evidenceUrl, confidence, note?, firstSeen:"<ISO>" } ] }
← { success:true, written:N, updated:M, rejected:[ { index, reason } ] }
```

Upsert key: (`accountId`, `eventSlug`, `kind`, `evidenceUrl`) — a re-run of the weekly diff refreshes `Last Seen` instead of duplicating the row. `kind` must be in `NW_SIGNAL_KINDS`, `accountId` must exist and be live, `evidenceUrl` must not be a LinkedIn host (rejected with `reason:'linkedin_not_fetched'` — the manual path is the only LinkedIn entry). Rows are written with `Source = events`.

**`nop=today` is not a Network op** — the scan card's Source Event default is read from Events (`eop=today`, `EVENTS-SCHEMA.md` §8) through Network's own proxy after `validateSessionForData`.

## 9 · The Scraper people route (D17 — decided 2026-09-20)

Network reads quoted and bylined people from the trade press Scraper already ingests, through its own proxy `nwPeopleProxy_(slug, since)` — `guidanceMentionsProxy_()` verbatim with a different URL and token — behind `nwCan('signals')`:

```
→ <SCRAPER_EXEC>?action=corpus&t=<NETWORK_CORPUS_TOKEN>&cop=people&slug=<registry slug>&since=<YYYY-MM-DD>
← { success:true, items:[ { key, publishedAt, source, title, url,
                            people:[ { name, title, company, role ∈ quoted|author|named, context } ] } ] }
```

`NETWORK_CORPUS_TOKEN` is a **third token namespace** — set in Scraper's and Network's Script Properties, never `CORPUS_TOKEN` (Profiler ↔ Scraper) and never `GUIDANCE_PEER_TOKEN` (Profiler ↔ Classroom). Each hit the developer accepts becomes a `Signals` row with `kind = press-quote`, `Evidence URL = corpus:<key>`, `Source = scraper`, `Confidence = 0.7`, `Person Name` / `Person Title` filled, and `Contact ID` set when the name matches a live Contact at that Account. `people[]` accrues per Scraper summarisation pass; back-fill of older items is a one-time admin job in E4 s3, not automatic. The Scraper-side change (the `people[]` field in the summarisation schema and the `cop=people` branch of `scHandleCorpus_`) is specified in E4 s3's brief, not here.

## 10 · Drafts and hand-off formats (D15 — the apps never send)

A mailing picks recipients from the filtered list (`Do Not Contact` rows are excluded always; `Consent Marketing = no` rows are excluded from any mailing; `unknown` is allowed — D9), applies a template, and renders **one editable draft per recipient** in a review list. Merge fields: `{{first}}` · `{{last}}` · `{{company}}` · `{{title}}` · `{{metAt}}` (the Source Event's display name) · `{{metDate}}` · `{{lastTopic}}` (the newest Interaction's Summary) · `{{myName}}` · `{{myCompany}}` (from `Profiles`). Every default template ends with an unsubscribe line and the developer's postal address (from `Profiles` → Company Name and a `NW_POSTAL_ADDRESS` Script Property); the developer may delete them per draft. Hand-off, all client-side:

| Format | Shape |
|---|---|
| `.eml` bundle | One RFC 5322 file per draft (`To`, `Subject`, `Date`, `MIME-Version`, `Content-Type: text/plain; charset=utf-8`, body), zipped client-side with the same hand-rolled store-only zip the `.xlsx` export uses; drag into any mail client |
| CSV / `.txt` | One row per recipient: `to, subject, body` (CSV) or `--- <to> ---` blocks (`.txt`) |
| Copy | Per draft: subject + blank line + body to the clipboard |
| `mailto:` | `mailto:<to>?subject=<enc>&body=<enc>` — opens the default client; bodies over ~1,800 characters fall back to Copy (URL length) |

No `gmail.*` scope, no `MailApp`, no Gmail API anywhere in either app. Sent-ness is recorded by the developer marking the draft sent.

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
| `PHOTO;ENCODING=b;TYPE=JPEG:` | Card front, **only when the developer ticks "include card image"** (re-fetched from Drive client-side) |
| `REV:` · `UID:` | Updated At · `c-` id |

Line folding at 75 octets and `\,` / `\;` / `\n` escaping per RFC 2426. The developer's **own card** QR encodes the same vCard built from `Profiles`.

## 12 · Audit-row rule and disclosure rows (D9)

`auditLog(event, user, result, details)` is the template's function and is called on every data op. **`details` may carry ids (`a-`, `c-`, `i-`, `s-`, `d-`), counts, and the op name — never a card field**: no name, email, phone, company, address, note, or draft body, ever. The reviewer's test is `grep -n 'auditLog(' Network.gs` and reading each `details` argument. Every export and every share grant writes a **disclosure row** through the template's §164.528 machinery (`logDisclosure` or its equivalent in the auth template) naming the op, the row count and the ids exported — again never the contents. List ops return the minimum-necessary subset (`id`, name, company, title, role, relationship, stage, warmth, last touch, source event — and, since N2, the live `contactCount` per account); detail ops return the full row (`nop=get` on an `a-` id also answers the live contacts beneath as id · name · title · role).

## 13 · Soft delete, restore, purge (D8)

- Soft delete sets `Deleted At`; every list op filters `Deleted At` empty; restore clears it — one tap, no confirmation dance
- An Account with live Contacts **cannot** be deleted (`error:'account_has_contacts'`); reassign or delete them first — nothing cascades silently
- **Purge** (admin-only, `nwCan('purge')`) lists rows with `Deleted At` older than 30 days; the browser trashes the card files with the user's own `drive.file` token (the files live in the user's Drive, so `DriveApp` cannot reach them), then the server deletes the rows and their Interactions, Signals and Drafts. The purge writes one audit row per id
- The **36-month review list** (D9) is a filter, not a state: contacts whose newest Interaction is older than 36 months, surfaced under "Review", never auto-deleted

## 14 · Checkers

- `scripts/verify-network-roles.py` (N0) — the four-tier door check against the live page, the `verify-profiler-roles.py` shape
- `scripts/check-network-schema.py` (N1; N2) — reads `Network.gs` and `Network.html`, asserts the three enum mirrors are identical to this file's lists, that the D5 stage validator (`STAGE_NEEDS_TARGET_OR_CUSTOMER`) is reached by **both** write paths — `nop=save` and `nop=account` — that every id literal in tests matches `NW_ID_RE`, that no id-generating function takes a name or a date as input, and that every `auditLog(` call's `details` argument is built from ids and counts only (a lexical check on the argument expression). Exit 1 on any finding
- `node --check` on the `.gs` copy and `scripts/check-gas-inner-scripts.js`, as for every project

Developed by: LightAISolutions
