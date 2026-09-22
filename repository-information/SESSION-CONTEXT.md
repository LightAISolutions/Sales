# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-22 06:26:28 AM EST (the session ran ~04:12 → 06:30 AM EST)
**Repo version:** v07.12r — five pushes on `claude/epic-bardeen-e965tn` (each restarted from `origin/main`, each auto-merged): v07.09r (the Events ids recorded), v07.10r (B — the bridge), v07.11r and v07.12r (two fixes to the Source Event default from the developer's live check), then this session-context write.
**Branch:** `claude/epic-bardeen-e965tn`
**Model:** Fable 5.1 High

### What was done

- **Events is deployed and live (v07.09r).** `SPREADSHEET_ID` / `DEPLOYMENT_ID` recorded the N0 way ([PC-GAS-CONFIG] #14: `Events.gs` v01.02g, `Events.html` v01.03w `_e`). The developer's sign-in failed with `not_authorized` until the Events checkbox column in the Master ACL Access tab was ticked TRUE (Role alone grants nothing) and `clearAllAccessCache` was run (the 600 s cached denial — `gas-scripts-reference.md` item 14). The first signed-in load created the seven tabs; the developer confirmed them
- **B — the bridge (v07.10r; §11's B row → Done).** `Network.gs` v01.08g / `Events.gs` v01.03g / `Network.html` v01.15w / `Events.html` v01.04w. Far sides `nwHandlePeer_` (`?action=peer&t=<NETWORK_PEER_TOKEN>&nop=accounts|signals`) and `evHandlePeer_` (`?action=peer&t=<EVENTS_PEER_TOKEN>&eop=today|starred|signals`) in both `doGet` / `doPost` before session validation — every token-boundary case a flat `denied` with zero reads (`not_configured` is the calling side's word, per Classroom's `clHandleGuidancePeer_`); `nop=signals` has a JSON-POST upsert leg and a GET read leg; `eop=today` decides today in each event's `tz` over the registry fetched server-side from the Pages URL; near sides `nwEventsProxy_` / `evNetworkProxy_` (`guidanceMentionsProxy_` verbatim, `upstream_not_json` snippet) behind `nop=eventstoday` and `eop=netaccounts`. `scripts/check-peer-bridge.js`: 61 checks, exit 0. `check-network-schema.py` allow-list gained five count keys; the Network verifier stub answers `nop=eventstoday` as `not_configured`. §13.9 = the N3 brief (two sessions) with its paste-in prompt
- **Live proof (developer, 06:00 AM):** both tokens set in both projects, both deployments republished by hand (GAS pills v01.08g / v01.03g), a star on ACP RECHARGE 2026 — the "Starred today — tap to use" pill appeared on a saved contact's editor. B's done-when is met
- **Two follow-up fixes to `Network.html`:** v01.16w (v07.11r) — a saved contact's editor is *offered* the pills, never prefilled (only a fresh scan is prefilled; `form.dataset.saved` from `nwEditCard`'s `opts.host`); v01.17w (v07.12r) — the row is inserted after the Where-and-when grid instead of appended below Save / Cancel

### Where we left off

**B is Done and proven live. N3 session 1 is next (D16: … B → N3 → E2–E3 …).** The brief is §13.9 of `NETWORK-EVENTS-DESIGN-PLAN.md` (session 1: the list, the eight filters, the four sorts with server-side `lastTouch`, multi-select with a sticky action bar, `nop=bulk`; session 2: exports, drafts, the QR card). The paste-in prompt was given in chat at the close of this session. Nothing is pending on the developer's side for B.

### Key decisions made

- **Far-side refusals are uniform.** The brief listed a sub-16 property both as `not_configured` and as a flat `denied`; Classroom's precedent won (a probe must not learn whether a project is configured), and `not_configured` is reported only by the near side about its own property. The harness asserts both halves
- **Network's `nop=signals` gained a GET read leg** the schema had not spelled out, because Events' `eop=signals` read-through has nothing else to read from
- **The Source Event default is a fill only on a fresh scan.** On a saved contact the same answer is an offer (pills), because the contact was met when it was met
- **REPO-ARCHITECTURE.md unchanged** — it draws no GAS-to-GAS edge for the existing Profiler → Classroom route either

### Active context

- **Repo version v07.12r.** `CHANGELOG.md` `Sections: 83/100` — no rotation due
- **Peer tokens are set** in both projects' Script Properties (never in the repo). Both deployments are on the merged code; the N0 bootstrap lesson still applies to the next `.gs` merge only if a deployment was never repointed — these two now have been
- **Reminders still open:** close out the "Repo access denied" issue after Monday's two earnings-desk runs (C2 must be rebuilt before Wednesday 2026-09-23 04:00 PDT); the Megmeet briefing prompt runs after the Network/Events build, before 2026-10-07
- **Playwright** is `pip install playwright` + the pre-installed Chromium at `/opt/pw-browsers`. Per-container
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run N3 session 1 from §13.9 — the Contacts list generalised from the Receipts History card with search, the eight filters, the four sorts (`lastTouch` computed server-side once per list), per-row expand, multi-select with a sticky action bar and `nop=bulk`; leave §11's N3 row **In progress — session 1**. Fable 5.1 High, one push.
- **To continue:** type `run N3 session 1 from §13.9`

Developed by: LightAISolutions
