# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-19 09:53:18 PM EST
**Repo version:** v06.73r — three pushes this session (`1cd05e9` v06.71r, `ff64c9b` v06.72r, this one), all on `claude/brave-ride-nfjh9j`, rebased onto `origin/main` before each
**Branch:** `claude/brave-ride-nfjh9j`
**Model:** Fable 5.1 High

### What was done

The **Network + Events strategic design session** — the founding brief for two new federated apps became `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`, a design-gate proposal in the shape `PHASE6-CLASSROOM-DESIGN.md` had before its gate.

- **v06.71r — the proposal.** Four research passes (Receipts mechanics; Profiler/Scraper/Classroom surfaces and plumbing; the card-scanner/personal-CRM market; the event-platform market with live probes of organiser sites) → ground truth measured at v06.70r, market-parity inventories, sixteen gate decisions with recommendations, both app designs, the peer-token bridge, the model rule applied, a phase plan with per-phase model/effort, an all-Proposed ledger, eight open questions, the NE0 brief, and Appendix A — the 64-row seed event calendar for 2026-Q4 → 2027.
- **v06.72r — the developer's first decisions recorded.** D1: the `#network` collision is resolved by renaming Profiler's explorer to **"Ecosystem"** (executed in N0 with the `verify-profiler-roles.py` label). D3, D10, D13 approved. §13.1 written: the gate session step by step.
- **v06.73r — this push.** D15 decided: the apps **never send mail and hold no mail scope** — v1 renders one editable draft per recipient in-app and hands off by `.eml`/CSV export, copy-to-clipboard or `mailto:` (the developer mails from a work account that changes with the employer). D11 approved and widened to the **§5.5.1 signal-source catalogue** (13 rows, every one in scope), with the quoted-people extraction over Scraper's articles as **D17** (Scraper extracts `people[]` at summarisation time; `cop=people`; Network reads over a new `NETWORK_CORPUS_TOKEN`). E4 grew to three sessions; ≈ 23 sessions total. **§13.2 holds the paste-in prompt for the gate session.**

### Where we left off

**The proposal is complete and six of seventeen decisions are settled.** The next session is the **NE0 gate on Fable 5.1 xhigh**: paste §13.2, walk D4 · D5 · D7 · D8 · D9 · D6 · D2 · D14 · D17 · D12 · D16 one at a time, write `NETWORK-SCHEMA.md` and `EVENTS-SCHEMA.md`, write the N0 and E0 briefs, one push. Nothing has been scaffolded; no page, GAS script, diagram or rule changed in this session.

### Key decisions made

- **People are private, the event registry is public** (D3) — the M3 field-notes architecture for contacts, cards, interactions, plans and signals; `live-site-pages/events-data/` for the registry.
- **Account-centric model** (D4, still to be confirmed at the gate but explained and accepted in conversation): Account → Contact → Card → Interaction, the dossier attached at the Account.
- **No LinkedIn automation ever**; the signal stack is exhibitor/speaker diffs, newswire RSS, newsrooms, agendas, FERC dockets, the corpus's own decision makers, and the Scraper quoted-people extraction; LinkedIn/X/attendee lists enter by hand with a confidence score.
- **The apps never send email** (D15) — drafts only, exported to whatever client the developer uses.
- **Model rule**: Fable 5.1 xhigh exactly twice (NE0, X), Opus 5 xhigh for the E0 registry research and the `events plan` narrative, Fable 5.1 High for every code session, Fable 5.1 Medium for roster bookkeeping and the quota review. This session ran on High deliberately — a proposal is synthesis; the gate is where xhigh pays.

### Active context

- **Repo version v06.73r.** `CHANGELOG.md` at **115 raw / 98 non-exempt** against the 100 trigger with seventeen sections dated 2026-09-19 EST — **the first push dated 2026-09-20 EST or later rotates the 2026-09-14 date group (20 sections)**; deepen the clone first.
- **Monday 2026-09-21's earnings-desk A/B** (see `REMINDERS.md`) is unchanged by this session and still gates every scheduled job in the Network/Events plan (phase R).
- **Two answers to bring to the gate:** does a Google Cloud project with billing exist (Places, E5)? May Gemini/Claude process card PII (D6)?
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open a Fable 5.1 xhigh session and paste §13.2 of `NETWORK-EVENTS-DESIGN-PLAN.md`** — it starts the NE0 gate, walks the eleven open decisions one at a time, and ends with both schema skeletons and the N0/E0 briefs in one push. (Monday's earnings-desk check-out in `REMINDERS.md` is a separate, earlier item and fires on its own wake-up.)

**To continue:** type `start the NE0 gate`

Developed by: LightAISolutions
