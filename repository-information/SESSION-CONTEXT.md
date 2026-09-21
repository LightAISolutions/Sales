# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-20 08:53:15 PM EST
**Repo version:** v06.78r — four pushes this session (`e27d74c` v06.76r the scaffold, `bc50445` v06.77r the deployment id, this one), all on `claude/cool-wozniak-dpgz7a`, restarted from `origin/main` before each
**Branch:** `claude/cool-wozniak-dpgz7a`
**Model:** Fable 5.1 High

### What was done

**N0 — the Network scaffold — built, deployed and verified live.**

- **v06.76r — the scaffold** (§13.3, all eight steps). `setup-gas-project.sh` run once with the developer's `SPREADSHEET_ID` `1YjY3…ptBiQ`, the fleet `CLIENT_ID`, and the fleet Master ACL `1kG2K…UvE` passed explicitly (the Global ACL config's own value is still a placeholder, so the script's auto-default resolves to nothing). PWA manifest + icons with the `manifest-src 'self'` override on both CSP tags; the admin-only door on both sides (`NW_ROLE_CAPS`, `nwAdmitted_` / `nwAdmitted()`, `?as=` only subtracts) with `scripts/verify-network-roles.py` passing 4/4 tiers at phone width, zero page errors; `ensureNetworkTabs_()` with the eight `NETWORK-SCHEMA.md` §3 tabs; the §4 enum mirrors; `NW_ID_RE` / `nwNewId_`; the `nwfolders` registry; ownership helpers verbatim from Receipts; heartbeat 600 s and no data poll on both sides; `op=quota` + a ported `op=aclhealth`; Profiler's explorer relabelled "Ecosystem" (v01.91w, matrix unchanged); the N1 brief as §13.5.
- **v06.77r — `DEPLOYMENT_ID` recorded** (`AKfycbxu…c0_U8`) and synced three ways (config, `.gs`, the page's `_e`); v01.02w / v01.02g.
- **Live verification (in chat, no push):** sign-in works as admin; the first webhook run hit the one-time bootstrap gap (pasted code with the placeholder id cannot repoint its own deployment — fixed by Manage deployments → Edit → New version); then `op=deploy` → `Already up to date (v01.02g)`, `op=aclhealth` → `acl_ok`, `op=quota` answering, `check-acl-health.sh` lists Network. §11 N0 row closed.
- **v06.78r — this push.** The Q0 paste-in prompt added under §13.3 beside the N0 prompt; this session context.

### Where we left off

**N0 is fully done, including the live done-when.** Next is **Q0 on Fable 5.1 Medium** — paste the Q0 prompt block under §13.3. After Q0: N1 (§13.5, two Fable High sessions), with E0 (Opus 5 xhigh, §13.4) beside N1–N2. Dated target from D16: N1 and E1 live before RE+ 2026 opens on 2026-11-16.

### Key decisions made

- **Master ACL id is passed explicitly** to the setup script on this repo — the Global ACL config default is a placeholder.
- **D1 scope held exactly**: heading + denied sentence + verifier label; Profiler's masthead button still reads "⛓ Network" (flagged, not changed).
- **`op=aclhealth` ported into Network** alongside `op=quota`, so the daily ACL health Routine covers it.
- **E1 hand-off must include the Manage deployments → Edit → New version click** before the first webhook run (the bootstrap gap).

### Active context

- **Repo version v06.78r.** `CHANGELOG.md` at `Sections: 100/100` — four sections dated 2026-09-20 EST are exempt, so no rotation fired; **the first push dated 2026-09-21 EST or later rotates the oldest date group** (SHA enrichment; unshallow first).
- Profiler's page changelog is at `Sections: 50/50` (today's section exempt) — its next bump on a later date rotates the 2026-08-24 group.
- **Pre-existing, not N0's:** `verify-profiler-roles.py`'s guidance-progress isolation check fails identically on `origin/main` (the hub moved to Classroom in C3); the template's `action=getData` route calls an undefined `processDataPoll()` in every project (dead route, never called).
- **§13 numbering collision to resolve at the next brief:** the N1 brief reserves §13.6 for N2 and the E0 brief reserves §13.6 for E1 — whichever session writes first takes 13.6, the other takes 13.7.
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged and gates phase R only.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open a Fable 5.1 Medium session and paste the Q0 prompt block under §13.3 of `NETWORK-EVENTS-DESIGN-PLAN.md`** — it copies `quotaProbe_()` and the `op=quota` dispatch into the eight existing projects (renaming Network's to match), writes `scripts/check-quota.sh`, bumps nine GAS versions with changelogs, flips §11's Q0 row, and pushes once — with the CHANGELOG rotation that push will trigger if it lands on or after 2026-09-21 EST.

**To continue:** type `run Q0`

## Previous Sessions

**Date:** 2026-09-20 12:26:53 AM EST
**Repo version:** v06.75r — two pushes this session (`8df12be` v06.74r the gate, this one), both on `claude/optimistic-fermat-ru79p0`, restarted from `origin/main` before each
**Branch:** `claude/optimistic-fermat-ru79p0`
**Model:** Fable 5.1 xhigh

### What was done

The **NE0 design gate for Network + Events** — §13.1 of `NETWORK-EVENTS-DESIGN-PLAN.md` executed step by step.

- **v06.74r — the gate.** The eleven open rows walked one at a time in §13.1's order and recorded in §3: D4, D8, D16, D17 as recommended; **D7 overridden by the developer — both apps start admin-only** (tier keys kept in the caps maps as the widening path; §12.4: no team layer); **D6 Gemini-only** (no Claude leg, no `ANTHROPIC_API_KEY`; §12.1: Gemini may process card PII); **D12 Overpass venues** (§12.5: no billed Google Cloud project); **D14 no data poll in either app + a new Q0 Fable Medium session** rolling the `op=quota` counter to the eight existing projects (§12.2: consumer account until Q); D5 refined (single-valued `relationship` + Account `Tags`, the `stage` validator rule); D9 made precise (`unknown` consent allowed for the two D15 mail occasions); D2 with the no-service-worker offline limit; §12.6 both seats equal. **`NETWORK-SCHEMA.md`** (284 lines) and **`EVENTS-SCHEMA.md`** (179 lines) written as the two apps' single sources of truth; §13.3 (N0) and §13.4 (E0) briefs written; §11 NE0 → Done; all eight §12 questions settled. The reading surfaced that D15 collided with §4.4's Gmail/Calendar sweep (which would also have read the script account's mailbox) — resolved as **import-only touches** for N4 and scrubbed from §8, §9, §10.
- **v06.75r — this push.** The N0 paste-in prompt added under §13.3; this session context; the **2026-09-14 CHANGELOG date group (20 sections) rotated** into the archive with SHA enrichment.

### Where we left off

**The gate is closed; nothing is scaffolded.** Next is **N0 on Fable 5.1 High** — paste the §13.3 prompt block. After N0: Q0 (Fable Medium, the counter rollout), then N1, with E0 (Opus 5 xhigh research, §13.4) running beside N1–N2. Dated target from D16: N1 and E1 live before RE+ 2026 opens on 2026-11-16.

### Key decisions made

- **Admin-only tiers for both apps** (D7 override) — the developer will widen if they ever want to share.
- **Gemini is the only processor of card PII**; Drive OCR and Claude both declined.
- **No data poll anywhere new**; heartbeat 600 s; execution counting via `op=quota` across all ten projects.
- **Overpass, not Places**; no billed GCP project exists.
- **The apps hold no mail or calendar scope at all** — D15 applied to N4 (import-only touches).

### Active context

- **Repo version v06.75r.** `CHANGELOG.md` rotated this push: the 2026-09-14 group moved, counter `Sections: 97/100`, 96 non-exempt — the next rotation fires when a push dated after the last remaining date finds ≥ 100 non-exempt again.
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged and gates phase R only.
- **Values N0 will ask for:** `SPREADSHEET_ID`, `CLIENT_ID`, the Master ACL default; `DEPLOYMENT_ID` after the developer deploys.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open a Fable 5.1 High session and paste the N0 prompt block under §13.3 of `NETWORK-EVENTS-DESIGN-PLAN.md`** — it scaffolds Network from the auth template, builds the admin-only door, the schema's tabs, the `op=quota` counter and the Profiler "Ecosystem" relabel, writes the N1 brief as §13.5, and pushes once. (Monday's earnings-desk check-out in `REMINDERS.md` fires on its own wake-up first.)

**To continue:** type `run N0`

Developed by: LightAISolutions
