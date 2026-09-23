# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-23 07:35 AM EST (the session ran ~07:15 → 07:35 AM EST)
**Repo version:** v07.28r — one push on `claude/busy-hawking-cfdvqk` (the v2 briefing plan), plus a second push for this session-context write
**Branch:** `claude/busy-hawking-cfdvqk`
**Model:** Fable 5.1 (a **planning** session — nothing was built or researched beyond the plan itself)

### What was done

- **The Megmeet SST briefing plan was rewritten as v2** (v07.28r) at `repository-information/megmeet-briefing-prompt.md` (110 → 383 lines). The developer widened the deferred v1 scope to: the SST in its entirety (term system, lineage and adjacent technologies), the 800 V DC value case from every player's perspective, limitations and who is working them, **who is testing at which service voltage (34.5 kV vs 12.47/13.8 kV)**, the adoption obstacles including **operation and maintenance**, Megmeet against its competitors on SST **and** in its six adjacent business units, what NVIDIA's and Oracle's engineering programmes will ask (the developer's "Megmeet is talking to their engineers" is **unverified hearsay** — the plan rules it may steer emphasis and is never stated or cited), figures/tables/timelines throughout, interactive widgets, and one downloadable PDF — all as an **overnight unattended run** in one new session
- **The corpus finding that shaped everything:** a 20,000-word, 14-figure SST primer already exists (`SOLID-STATE-TRANSFORMERS-PRIMER.pdf` / `sst-primer-print.html`, v05.36r–v05.38r, 2026-09-12) with its own matplotlib figure script and Chromium-CDP PDF script. The plan **extends it and cites its figure numbers** rather than rebuilding it. Its thin spot is O&M (one mention of maintenance); its watch-list of 12 September is the first thing the run updates
- **Pre-flight run today, results in §0:** `profiler-queue.py --quarterly --tier core` → `dueCount: 0`; the SST four at v1/v2 dated 2026-09-12 → 09-19; Megmeet v7 (2026-09-08); Oracle v5 (2026-09-21) and NVIDIA v10 carry **no SST content** (that material is in the NVIDIA guidance module and the primer); `aidc-power-conversion--competitive--2026-09-08` still `current`; **Megmeet's own SST discloses no voltage class anywhere**; matplotlib and Playwright absent from a fresh container; CHANGELOG counter one push from rotation
- **§2 the ask-by-ask delta** (ten rows: covered where / missing what / corpus or web) · **§3 deliverables** — D1 a Profiler competitive report on the SST hall-edge contest (dossiers-only, builds on and does not supersede the 2026-09-08 edition); D2 `study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf` from print HTML on the primer's skin (`mmsst-fig-` figures, copies of the primer's two build scripts); D3 `megmeet-sst-briefing-companion.html` with seven prioritised widgets (ship ≥5), Playwright-tested from `file://`; a shared `megmeet-sst-briefing-data.json` as the single source for every plotted number; the brief's five-part table of contents and minimum figure set
- **§4 the model recommendation — Opus 5 `xhigh`, one session, subagents on the same model.** Reasons: the repo's Xcel head-to-head (Opus deeper on long first-party documents; judgments inconclusive; Fable narrowly ahead only on sourcing discipline — which the citation-tier rule and the rubric enforce model-independently); half Fable's price and none of the Fable weekly sub-allocation; `xhigh` is the level the repo's Opus evidence was built at; `max` buys nothing the checkers do not; overnight makes latency free. Set aside with reasons: Fable 5.1, Sonnet 5 (offered only as the Phase B subagent cost lever), Opus 5.5, `max`, a two-session split. Estimate stated as judgment: 3–5 hours, ~4–6× v1's spend (~$120–250 API-equivalent)
- **§5 the run:** phases 0 (pre-flight) · A (corpus read into two scratchpad ledgers) · B (five bounded web subagents: pilots by kV class; obstacles/O&M/standards/policy; NVIDIA + Oracle programmes; adjacent-BU competitors; Megmeet's own SST) · C (D1, **push 1**) · D (data → figures → brief chapter by chapter → PDF with proof PNGs, **push 2**) · E (companion) · F (a fresh subagent audits the PDF against a **twelve-line rubric**, fixes, README tree, CHANGELOG, remember session, **push 3**); failure handling decided in advance
- **§6 the paste-in prompt** (also handed over in chat at 07:30), **§7 a resume prompt** for a dead container, **§8 the developer's night-of checklist**
- Housekeeping: v07.28r CHANGELOG section (counter **99/100**), README timestamp and tree description; **`REMINDERS.md` untouched** (developer-owned — its v1 budget line "~35–50 minutes and ~$25–40" is now superseded by §4)

### Where we left off

**The plan is on `main`; the briefing itself has NOT been run.** The developer has the prompt (chat, and §6 of the plan file) and the model/effort recommendation. The next action is theirs: a **new session on Claude Opus 5 at `xhigh`**, paste §6, walk away for 3–5 hours. Nothing from this session is pending.

### Key decisions made

- **Extend the primer, do not rebuild it** — the brief summarises each primer chapter in a page and cites its figures; new figures only where the primer has none
- **HTML-first PDF** on the primer's skin, not the Markdown study-prep renderer (`build-study-prep-pdf.mjs` has no image support) — and **not Classroom** (personal job context is not public-safe, and the C2 gate surface is the wrong cost for a one-off study document)
- **Everything personal stays under `repository-information/study-prep/megmeet/`**; only D1 is public Pages data and it is dossiers-only by construction. The existing interview brief, lesson plan and study guide are **not edited** — the brief lists what dossier v7 now contradicts in them
- **One data file feeds both the figures and the widgets**, byte-identical, so they cannot drift
- **Three checkpoint pushes** so a container dying at 3 AM loses at most one phase (allowed: each push after the prior one has merged)
- **Opus 5 over Fable 5.1** for an unattended run; **`xhigh` over `max` and `high`**; Sonnet 5 only as an optional subagent lever
- **The hearsay rule** for the NVIDIA/Oracle chapter mirrors the Report Command's field-notes rule: steers emphasis, never stated, never cited

### Active context

- **Repo version v07.28r.** `CHANGELOG.md` **`Sections: 99/100`** — **archive rotation falls due on the next push that takes the counter to 100** (changelogs.md: "reaches 100"), i.e. the overnight run's first push unless another push comes first; unshallow first, SHA enrichment mandatory
- **Live versions unchanged:** `Classroom.gs` v01.87g · `Classroom.html` v01.16w · `Events.html` v01.11w · `Events.gs` v01.09g · `Network.html` v01.24w · `Network.gs` v01.17g · `Scraper.gs` v02.22g · `Profiler.html` v01.91w. **No `.gs` changed — no redeploy needed**
- **The Routine fleet is six, all enabled** (verified 2026-09-23 06:06); the rebuilt C2 Classroom weekly fired today at 11:07Z — **its first report has not been read**
- **One reminder remains active** — the Megmeet SST briefing before Wednesday 2026-10-07. Sequencing condition met (X closed D16 at v07.27r); pre-flight done today; the plan is v2
- **Toolchain in a fresh container:** Node 22 and Chromium (`/opt/pw-browsers`) present; **`pip install matplotlib playwright` needed** — never `playwright install`
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Start a **new session on Claude Opus 5 at effort `xhigh`** and paste §6 of `repository-information/megmeet-briefing-prompt.md` — the plan is complete, the corpus is fresh as of today, and the 2026-10-07 start date leaves two weeks for a second pass if the Phase F audit turns up gaps. Check the usage meter first; if the run happens after 2026-10-01, glance at `reports/reports-index.json` for a newer AIDC power-conversion edition.
- **To continue:** type `run the Megmeet briefing from §6 of megmeet-briefing-prompt.md`


## Previous Sessions

### Session — 2026-09-23 06:50 AM EST (X decided no — D16 complete, v07.27r)

**Date:** 2026-09-23 06:50 AM EST (the session ran ~06:34 → 06:50 AM EST)
**Repo version:** v07.27r — one push on `claude/classroom-event-provenance-1gehnk` (the X decision), plus a second push for this session-context write
**Branch:** `claude/classroom-event-provenance-1gehnk`
**Model:** Fable 5.1 xhigh (X — the Classroom hook: **decided no**; **D16's build order is complete**)

### What was done

- **X decided — no** (v07.27r). Nothing built, no gate surface touched, no GAS bump, no file added. The decision is written into `NETWORK-EVENTS-DESIGN-PLAN.md` §3's D13 row and §11's X row (flipped from *Proposed — deferred behind E0 stability* to **Decided — no, v07.27r, 2026-09-23**), with the three reasons, the four reopen conditions, and what remains outside the plan
- **Why no, in three lines:** the pre-event briefing already exists as E5's `events plan <event>` narrative (private half included; `repository-information/plans/re-plus-2026-narrative-plan.md`) and its public half is dossier material Classroom already stamps as `profile:` / `study:`; the fact with teaching value — who exhibits — is a Network `Signals` row that never crosses, `mentions[]` is not attendance, and what a registry row adds on its own is calendar, not mechanism, expiring with the edition, which a permanent `tracks` lesson (P5) cannot; the true cost of a tenth prefix is the map + mirror + `gateDigest` **plus** a G7 resolution rule (else every weekly run freezes the lesson as unknown), the committer contract's "exactly the nine prefixes", and the P11 guard in `check-classroom-pipeline.py` whose prefix tuple is hard-coded to the nine and which X may not edit — P4 would fire on the adding commit itself
- **What would change the answer** (any one reopens X): a *series-level* evergreen lesson once E0's next verification pass fills `hours[]` (2 of 96 upcoming rows), `editions[]` and the agenda structure; a G7 resolution rule for `event:` written into `classroom-app.md` first; one applied `events sync` cycle; or the developer asking for it. `contact:` stays never
- **The deferral condition, verified on the live file:** all 58 roster rows carry `lastProbe.at = 2026-09-21`, **but those are E0's own build-time probes** — `git log` shows `events-sources.json` written once (v06.95r) and never since, `events.json` touched only by E4 s2's manual agenda rows (v07.20r), and **no `events sync` has ever applied a diff**. The registry has stood under one poller cycle, not survived a change from one. Recorded in the X row and the CHANGELOG; it did not decide X
- `CLASSROOM-SCHEMA.md` gained one paragraph beside the *no `note:` prefix* rule recording that there is no `event:` prefix either (declined, dated, with the pointer); `EVENTS-SCHEMA.md` §11's D13 sentence updated. The prefix table still mirrors `CL_PROVENANCE_REF_KINDS` byte for byte
- **All six checkers passed on the untouched code** before and after: content 71 / 8 / 220 with 0 / 0, curriculum no structural findings, pipeline `--selftest` 15 / 0 (and 3 × P1 on the diff — the expected developer-commit noise, no P3 / P4), events-plan 151 / 0, registry OK, README tree 22 / 0

### Where we left off

**X is closed and D16's order is complete** — Gate → N0 → Q0 → N1 → N2 → E0–E1 → B → N3 → E2–E3 → E4 → N4 → E5 → X, every row Done or decided. Nothing from X is pending. **The Megmeet briefing's sequencing condition (the Network / Events build) is now met.**

### What remains — outside D16's order

- **Inside the ledger:** **R**, the discovery Routine — not started; its stated blocker (a scheduled Routine landing a commit) has evidence since the earnings desk's 2026-09-22 fire committed v07.16r, and the rebuilt C2 Routine's first fire today at 11:07Z is the next proof to read. The developer flips the row. **Q**, the quota review — one Fable 5.1 Medium session with a month of counter data
- **Outside the plan:** the E0 verification pass that fills `hours[]` / `venueLatLng` / `agendaUrl` (the biggest lever left on the Plan tab — coverage 2 / 26 / 16 of 96 upcoming rows per v07.26r); a hash router in `Network.html` for the post-event `#drafts?sourceEvent=` deep link; `scripts/check-guidance-migration.js` failing on clean `origin/main` ("expected 9 modules, got 28"); the standing E4 / E5 papercuts (no booth numbers on the day plan, RE+ 2026's Swapcard roster, the ROI line written once, `pullAndDeployFromGitHub` never logging its outcome)

### Key decisions made

- **A reasoned no is the deliverable.** The brief said so, the developer said not to force it, and the analysis found the teaching value already delivered elsewhere at the right gate (E5's narrative, admin-only) with the only novel input (attendance) forbidden by D9 / D13
- **The cost was measured, not taken from the brief** — three items became six (G7 rule, contract count, P11 guard), and the P11 point is decisive on its own: the one prefix the deployed-changelog leak guard cannot see would be the one X added, and X may not edit the checker
- **The brief's evidence was checked and corrected in writing** — the `lastProbe` stamps are E0's, not the poller's. That did not change the answer but is on the record so the next reader does not inherit it
- **Housekeeping commits take no version bump** (the reminders / session-context precedent) — only the X push bumped `repository.version.txt`, to v07.27r

### Active context

- **Repo version v07.27r.** `CHANGELOG.md` **`Sections: 98/100`** — **rotation becomes mandatory above 100**, two pushes away; read the live counter rather than this line
- **Live versions unchanged:** `Classroom.gs` v01.87g · `Classroom.html` v01.16w · `Events.html` v01.11w · `Events.gs` v01.09g · `Network.html` v01.24w · `Network.gs` v01.17g · `Scraper.gs` v02.22g. **No `.gs` changed this session — no redeploy needed**
- **The Routine fleet is six, all enabled** (verified last session): the C2 Classroom weekly `0 11 * * 3` **fired today at 11:07Z — its report is the first of the rebuilt Routine and worth reading**; Profiler earnings desk weekdays; Profiler quarterly and monthly drift (next 2026-10-01); Industry Guidance quarterly (next 2026-10-15); ACL health daily
- **One reminder remains active** — the **Megmeet SST briefing** before the 2026-10-07 start; its sequencing condition is now met, so it is the next thing to run, in a **new Opus 5 xhigh session** per the reminder
- **Playwright is not preinstalled in a fresh container** — `pip install playwright` only; the Chromium is already there, never run `playwright install`
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run the **Megmeet SST briefing** from the active reminder in a **new Opus 5 xhigh session** — X closing D16's order was its sequencing condition, the 2026-10-07 start date is two weeks out, and it is the one deliverable with an external deadline; run its two pre-flight checks (dossier freshness on the scoped slugs, whether the monthly drift check superseded `aidc-power-conversion--competitive--2026-09-08`) before the research.
- **To continue:** type `run the Megmeet briefing`

Developed by: LightAISolutions
