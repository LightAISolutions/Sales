# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-22 07:15:53 AM EST (the session ran ~06:53 → 07:25 AM EST)
**Repo version:** v07.14r — one push (this commit) on `claude/amazing-hypatia-06t8r5` restarted from `origin/main` at `47d83190`; the session-context write rides in the same commit.
**Branch:** `claude/amazing-hypatia-06t8r5`
**Model:** Fable 5.1 High (N3 brief, §13.9, session 2 of two)

### What was done

**N3 session 2 — the exports, the drafts and the QR card (§13.9 steps 5–8); §11's N3 row now reads Done.** `Network.gs` v01.10g / `Network.html` v01.19w.

- **`Network.gs`**: `nwExportOp_` gathers once (`nwExportRows_`) and answers `csv` · `xlsx` (`nwExportXlsx_`, the Receipts temp-spreadsheet path, Contacts / Accounts / Interactions) · `vcard` (`nwVcard_`, hand-rolled 3.0, `cards[]` + `vcf`); `nop=mailings` / `nop=drafts` / `nop=draftstatus` (D15 — the app never sends; sent = an `email-out` Interaction with the d- id as evidence); `nop=mycard` on the Profiles row (Title · Phone columns added)
- **`Network.html`**: the Export menu with the "include card image" tick (the PHOTO spliced client-side from the user's own Drive, folded at 75 octets), `nwZip` (store-only zip) for the per-contact vCards and the `.eml` bundle, the follow-up drafts panel (recipients → template → review list edited in place → `.eml` / CSV / `.txt` / Copy / `mailto:` → Mark sent / Discard), the Drafts and My card masthead pills, the My card panel and the full-screen QR from `nwQrMatrix` (byte mode, v1–10, level M, no library)
- **`scripts/verify-network-roles.py`**: the session-2 stub ops and tests — ALL CHECKS PASSED, zero page errors; the page's QR matrix equals python-qrcode's at the same version and mask; the D15 grep over the served page and the `.gs` PROJECT region
- **Docs**: `NETWORK-SCHEMA.md` §3 / §10 / §11 / §12 / §14; the design plan's §11 N3 row Done and §13.10 (the E2 brief + paste-in prompt); `check-network-schema.py` allow-list; README; changelogs

### Where we left off

**E2 is next — §13.10**: the weekly no-AI poller in `Events.gs`, the admin `Proposed` panel on `Events.html`, the `events sync` session command in a new `.claude/rules/events-app.md`, `eop=installpoller`, and `scripts/check-events-poller.js`. The paste-in prompt for E2 was given in chat at the close of this session. **Reported, not asserted**: the vCard bundle importing on iOS / Android Contacts and the QR resolving on a second phone — the developer's live check after redeploying Network.gs (v01.10g) and opening My card.

### Key decisions made

- **The vCard PHOTO is spliced by the page, not the server** — the card front lives in the user's own Drive under `drive.file`, which `DriveApp` cannot read, so the page fetches it with its own token and folds the base64 at 75 octets; the server's vCard is complete without it
- **The template's `sendHipaaEmail` (MailApp) stays** — it is the auth template's security-alert helper outside the PROJECT region (Chesterton's fence, [PC-TEMPLATE-PROP] #19); the D15 assertion is scoped to the served page and the `.gs` PROJECT region, and the schema says so
- **A named template is saved on render, an unnamed one is still a Mailings row** — every render writes the Mailings row (template + list filter) so drafts group by mailing; only named rows appear as saved templates
- **Audit expressions must read as counts to the checker** — `saved: (!tplRow && name) ? 1 : 0` was flagged for the identifier `name`; the count is computed into `savedCount` first
- **The QR encoder is proven, not eyeballed** — the verifier compares the page's matrix against python-qrcode at the same version and mask (skipped gracefully when the library is absent)

### Active context

- **Repo version v07.14r.** `CHANGELOG.md` `Sections: 85/100` — no rotation due
- **Playwright** is `pip install playwright` + the pre-installed Chromium at `/opt/pw-browsers`; `pip install qrcode` enables the QR cross-check. Per-container
- **Reminders still open:** close out the "Repo access denied" issue after Monday's two earnings-desk runs (C2 must be rebuilt before Wednesday 2026-09-23 04:00 PDT); the Megmeet briefing prompt runs after the Network/Events build, before 2026-10-07
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run E2 from §13.10: the poller, the `Proposed` panel, `events sync` and the Node harness; flip §11's E2 row to Done and write the E3 brief as §13.11. Fable 5.1 High, one push. Before it, check `Events.config.json` carries a real `DEPLOYMENT_ID` / `SPREADSHEET_ID`.
- **To continue:** type `run E2 from §13.10`

## Previous Sessions

**Date:** 2026-09-22 06:46:16 AM EST (the session ran ~06:29 → 07:00 AM EST)
**Repo version:** v07.13r — one push (this commit) on `claude/hopeful-bardeen-8gaw0o` restarted from `origin/main` at `836a5856`; the session-context write rides in the same commit (one push, as asked).
**Branch:** `claude/hopeful-bardeen-8gaw0o`
**Model:** Fable 5.1 High (N3 brief, §13.9, session 1 of two)

### What was done

**N3 session 1 — the list, the filters and the bulk actions (§13.9 steps 1–4); §11's N3 row reads In progress — session 1.** `Network.gs` v01.09g / `Network.html` v01.18w.

- **`Network.gs`**: `nwListOp_` replaces the inline list branch — search (`q`) over name / title / account name / every email, the eight filters (`relationship`, `stage`, `role`, `segment`, `event`, `tag`, `from` / `to`, `consent`) applied server-side (the columns they read are picked under `_`-keys and dropped before the answer), `lastTouch` from one read of the Interactions tab (`nwLastTouch_`) — the one §12 widening; `bad_filter` on an off-list enum or a malformed date; `total` / `filtered` on the response. `nop=bulk` (`nwBulkOp_`): `op=tag` and `op=account`, every id judged on its own with `rejected[]` reasons (B's signals-upsert shape), the D5 rule reached through `nwAccountFromPayload_` per account and memoised across its contacts, a relationship moved off Target / Customer resetting the stage to None. `nop=export` (`nwExportOp_`, `format=csv` only — `.xlsx` / vCard are session 2): RFC 4180, CRLF, 24 columns, do-not-contact rows left out, a disclosure row through `recordDisclosure` (op, count, ids), audit counts only
- **`Network.html`**: `nwListTools` (search box, the Filters drawer collapsed until opened with the "N on: …" hint, segment options from `profiler-segments.json`, a source-event `datalist`, Apply / Clear), the sort strip (Last touch · Name · Company · Warmth-disabled + flip; page-side, no request), select-all; `nwContactRow` gains the checkbox and the `last touch` line; the action bar `nwBar` fixed to the bottom (Tag, Relationship with the D5 gate mirrored, CSV → a Blob download with the BOM, Mailing disabled, Delete after a count confirm one `nop=delete` per row); `nwSelectSync` keeps an open detail open while the selection changes; the bar's content keeps clear of the template's fixed pills (`padding: 0 132px 30px 0`, dropped ≥ 1120px)
- **`scripts/verify-network-roles.py`**: the stub applies the filters and answers `nop=bulk` / `nop=export`; tests for the search, the drawer, the sort flip, the two-row tag, the per-row refusal then Target · Discovery, a real CSV download, a bulk delete — ALL CHECKS PASSED, zero page errors. `check-network-schema.py` allow-list + five count keys. `check-readme-tree.py` 0 findings

### Where we left off

**N3 session 2 is next — §13.9 steps 5–8**: `.xlsx` through the Receipts temp-spreadsheet path, vCard 3.0 per contact and as a bundle (PHOTO only when ticked), the follow-up drafts flow (`nop=drafts` / `nop=draftstatus`, the `.eml` bundle, CSV / `.txt`, clipboard, `mailto:`, the `email-out` Interaction on "sent"), the "My card" QR panel (check the repo for an inline QR generator first), the verifier's session-2 checks, the MailApp / GmailApp grep, then flip §11's N3 row to Done and write the E2 brief as §13.10. The paste-in prompt for session 2 was given in chat at the close of this session. `nop=export` already exists with `format=csv` — session 2 adds `xlsx` and `vcard` to the same op and the bar's CSV button becomes an Export menu.

### Key decisions made

- **Filters are server-side, sorts are page-side.** The eight filters read Emails / Tags / Consent, which §12 keeps off the list payload, so `nop=list` carries the filter params and answers only the subset; the four sorts need nothing beyond the row (name, title, account, `lastTouch`), so a sort issues no request (D14)
- **A bad filter value is refused (`bad_filter`), never silently ignored** — an ignored filter would show a wider list than the developer asked for
- **`nop=bulk op=account` memoises the verdict per account** and mirrors the editor's reset (relationship off Target / Customer with no stage asked → None), so a bulk change and an editor change agree
- **The bar is `position: fixed`** (the phone-app pattern) rather than `sticky` inside the list card, so it stays visible while the developer scrolls to the Accounts card; its content is padded clear of the template's fixed bottom-right pills, which Playwright proved would intercept the clicks
- **The version pair lesson re-confirmed**: bumping `<meta build-version>` before `Networkhtml.version.txt` makes the page reload once on first load — the verifier's "exactly one list request" caught it

### Active context

- **Repo version v07.13r.** `CHANGELOG.md` `Sections: 84/100` — no rotation due
- **Playwright** is `pip install playwright` + the pre-installed Chromium at `/opt/pw-browsers`. Per-container
- **Reminders still open:** close out the "Repo access denied" issue after Monday's two earnings-desk runs (C2 must be rebuilt before Wednesday 2026-09-23 04:00 PDT); the Megmeet briefing prompt runs after the Network/Events build, before 2026-10-07
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run N3 session 2 from §13.9 (steps 5–8): the `.xlsx` and vCard exports on the existing `nop=export`, the drafts flow with the `.eml` bundle, the QR card; flip §11's N3 row to Done and write the E2 brief as §13.10. Fable 5.1 High, one push.
- **To continue:** type `run N3 session 2 from §13.9`

Developed by: LightAISolutions
