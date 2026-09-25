# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-25, 07:14 PM → 07:52 PM EST (attended; four turns)
**Repo version:** v07.55r (two pushes: v07.54r, v07.55r; this save is unversioned)
**Branch:** `claude/wizardly-mendel-6o4h2e`

### What was done

- **#12R closed — the Events discovery Routine (phase R) is live:**
  - **v07.54r:** the repo-side queue `repository-information/events-discovery-queue.json`, starting empty, with its schema in `EVENTS-SCHEMA.md` §7.1. `check-events-registry.py` → `check_queue()` validates it. `.claude/rules/events-app.md` gained "The discovery run (R) and `events sync discovery`", covering the five source classes, the bar, the cap of 5, the stand-down and promotion. The Routine prompt is in `ROUTINES-OPERATIONS.md` → "Events discovery — quarterly", with STEP 0 byte-identical to the desk's.
  - **Developer, in the UI:** created "Events discovery - quarterly" (`trig_01LdSJyaBJAmrEYr4Eq5Fq8c`). Runs with "Claude HQ · Sales", Sonnet 5, no connectors, push and email on. The cron `CRON_TZ=America/New_York 50 8 8 3,6,9,12 *` was set with `/schedule update` in a local terminal; the next fire is Tue 2026-12-08 08:50 ET.
  - **First run (Run now):** a STAND-DOWN with a full report, no commit and the queue untouched, which §8 accepts.
  - **v07.55r:** the plan's §11 R row is Done. `ROUTINES-OPERATIONS.md` now has the schedule step corrected and a new settled finding.
- **Phase A is complete** (#8 at v07.52r/v07.53r, #12R at v07.54r/v07.55r).

### Where we left off

- **Everything is merged; the tree is clean.** Next is Phase B (9/28–10/6): #9a, the registry pass, then the booth-number build.
- **Dated reminders stand:**
  - The cooling recheck, from 9/28.
  - The 9/30 Classroom run.
  - The neoclouds pass and Habitat Energy, from 10/1.
  - The Dominion reframe, 10/2–10/6.
  - The AIDC re-run, after 10/31.
  - The Megmeet start is Wed 10/7.

### Key decisions made

- **Where the queue lives:** in the repo under `repository-information/`, not the `Proposed` tab, which a fired session cannot reach. It stays out of `live-site-pages/`, so unverified candidates never deploy. Rejected candidates stay in the file as dedup memory.
- **Promotion is a session command, `events sync discovery`.** No app or GAS change is involved. It re-reads the organiser page, and it re-probes any new roster row before writing it.
- **Candidate bar:**
  - relevance of at least 3, not a webinar, starting 21 days to 18 months out;
  - US or Canada, or a mega show at relevance 4 or higher anywhere;
  - grounded: a dossier names it, the organiser is on the roster, or at least 2 covered companies appear on the organiser's page;
  - the organiser's page must be read in the run.
- **Schedule:** the 8th of Mar/Jun/Sep/Dec, which avoids a 10/8 fire twelve days after the Run now.
- **Model:** Sonnet 5. Every candidate gets a human decision and a re-read before anything lands.
- **Settled finding:** `update_trigger` refuses on UI-created Routines ("Agents can only update routines they created"). A custom cron on a committing Routine needs `/schedule update` from a local CLI.

### Known issues

- The first run could not read several organiser pages: AFCOM, SEIA and MISO returned 403, the DCC page is behind a login wall, and CAISO and SPP returned 404. The trade-body and grid-operator classes are therefore mostly dead from the sandbox. If December also stands down for this reason, add those organisers as hand-maintained roster rows. Do not loosen the read-the-page rule.
- **Carried over:**
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition. Its own row says to re-check the index after 10/1.
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2, stale fixture dates).
  - The two aged 9/8 reports still warn.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **CHANGELOG:** `Sections: 107/100` — 9 dated 9/25 are exempt. **The first push dated 9/26 or later must rotate** the oldest date groups (SHA-enriched, after `git fetch --unshallow`).
- **Routines:** 7 in total. The busiest day is the 1st of a quarter month, with 4 runs.

### Recommendation for next session

- Start Phase B with **#9a, the registry pass**, in a fresh Opus 5.5 High session on or after Mon 9/28. It fills `hours[]`, `venueLatLng` and `agendaUrl` for RE+ 2026 and the 35 events through 11/30, verified against organiser pages. The booth-number build and `events plan re-plus-2026` both depend on those fields. Expect the CHANGELOG archive rotation on that push.

**To continue:** type `write the #9a registry-pass prompt`

## Previous Sessions

### Session — 2026-09-25 06:47 PM → 07:20 PM EST (#8 closed — AIDC power-conversion report refresh and rev2, v07.53r)

**Date:** 2026-09-25, 06:47 PM → 07:20 PM EST (attended; three turns)
**Repo version:** v07.53r (two pushes: v07.52r, v07.53r; this save is unversioned)
**Branch:** `claude/quirky-faraday-avb5pv`

### What was done

- **#8 closed — the AIDC power-conversion report was refreshed twice on 9/25:**
  - **v07.52r:** `aidc-power-conversion--competitive--2026-09-25` superseded the 9/8 edition. It re-pins Megmeet v8, Delta v6 and LITEON v7, and the rack order is now sourced: Delta, LITEON, Megmeet third. It dates Megmeet's SST as pre-research with no class, corrects the 9/8 reading of Sungrow ("supplying" by filing; batch orders from 2027), and adds a Megmeet first-week section and a cross-reference to the SST rev2 report.
  - **v07.53r (developer decision):** `aidc-power-conversion-rev2--competitive--2026-09-25` added `power-electronics` to Layer 3 (AIPCS, medium voltage to 800 VDC, TRU-class). That makes 16 vendors and 66 citations. The FCC paragraph now says the inverter rule reaches Power Electronics' Spanish-built storage inverters. **rev2 is current.**
  - `check-profiler-reports.py` reports 0 errors and no warning on rev2.
- **New reminder:** re-run the report once Megmeet's Q3 is filed (due by Sat 10/31), refreshing the Megmeet dossier first. Zhonhen and Sinexcel report by the same deadline.
- **The #12R prompt was drafted** (below). It hands the discovery Routine's prompt and the UI steps to a Medium session.

### Where we left off

- **Everything is merged; the tree is clean.** Next is #12R, then Phase B (#9a registry pass and the booth-number build, 9/28–10/6).
- **Dated reminders stand:**
  - The cooling recheck, from 9/28.
  - The 9/30 Classroom run.
  - The neoclouds pass and Habitat Energy, from 10/1.
  - The Dominion reframe, 10/2–10/6.
  - The AIDC re-run, after 10/31.
  - The Megmeet start is Wed 10/7.

### Key decisions made

- **Power Electronics went in now rather than at the Q3 re-run.** It is a fresh dossier and a clear Layer 3 product, and it is the US-footprint comparison for the first week. The only cost was a same-day third edition, named with `-rev2` per the SST precedent.
- **Mitsubishi Electric** stays a named candidate for the next edition.
- **Archive rotation is not due on 9/25:** 105 sections, 7 exempt, 98 non-exempt. **The first push dated 9/26 or later rotates the 2026-09-18 group (8 sections), SHA-enriched after `git fetch --unshallow`.**

### Known issues

- The two older aged 9/8 reports still warn (grid-scale-bess: Jinko; named-project-bess-attach: Oracle). Nothing in this refresh touched what they depend on; they are optional Phase B work.
- `repository-information/megmeet-briefing-prompt.md` still names the 9/8 edition as current. Its own row says to re-check the index after 10/1, which will find rev2.
- From before this session: `verify-profiler-roles.py` (2) and `check-events-plan.js` (2, stale fixture dates).

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **CHANGELOG:** `Sections: 105/100`.
- **Pages:** Profiler v01.92w (unchanged — reports are data-only).
- **Working files:** the report builder scripts were scratchpad-only, not committed.

### Recommendation for next session

- Run #12R in a fresh Opus 5.5 Medium session by pasting this prompt:

> Run action #12R — draft the discovery Routine's prompt and give me step-by-step instructions to create it in the claude.ai UI (**R** in `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`).
>
> Read first, in this order:
> 1. `repository-information/SESSION-CONTEXT.md` → Latest Session.
> 2. `NETWORK-EVENTS-DESIGN-PLAN.md`: §5.3's **Discovery Routine** bullet, the **R** rows in §8 and §11, and the note headed "**R — the developer.**" Its blocker, Monday's earnings-desk proof, is cleared: the desk landed the first Routine commit on 9/22 (v07.16r).
> 3. `repository-information/ROUTINES-OPERATIONS.md`:
>    - the current **STEP 0** text — copy it verbatim, not from memory;
>    - the settled findings that a fired session can push only when the repository is attached on the "New routine" form, and that a Routine's repository cannot be edited afterwards;
>    - the 2026-09-21 model evaluation;
>    - the prompts under "The rebuild prompts", as the shape to follow.
> 4. `.claude/rules/events-app.md` (the Events Sync command and its never-list); `repository-information/EVENTS-SCHEMA.md` (the registry, the roster and the `Proposed` shape); and `live-site-pages/events-data/events.json` and `events-sources.json`.
>
> Settle these before drafting, and give me each answer with its reason:
> - **Where proposals go.** A fired session cannot write the Events spreadsheet's `Proposed` tab, and it must never call the deployed app or widen a peer token. Decide the repo-side queue a run writes candidates to (§8's "calendar-file-as-queue"), and how `events sync` or I promote a candidate out of it. If that file or its schema doesn't exist, create it in this session and make `scripts/check-events-registry.py` (or a sibling checker) validate it.
> - **What counts as a candidate:** the source classes; the relevance bar against the segments and the dossier corpus; dedup against `events.json`; a per-run cap; and the stand-down rule (a quiet run commits nothing and reports why).
> - **Cadence and model:** quarterly, with the cron written in `CRON_TZ=America/New_York` and a jittered minute. Give me the first fire date and recommend a model with the reason.
> - **Budget:** list my existing Routines and say whether one more fits before the #12Q quota review (~10/21).
>
> Deliverables:
> 1. The complete Routine prompt in one copyable block: STEP 0 verbatim, then identity, the queue, the cap, the stand-down rule and the report shape.
> 2. That prompt saved as a new subsection under "The rebuild prompts" in `ROUTINES-OPERATIONS.md`, so it can be recreated. Mark the plan's R row "prompt written — awaiting UI creation", add a CHANGELOG entry, and commit and push under the normal checklists.
> 3. Numbered, click-by-click steps for claude.ai's "New routine" form: name, prompt, repository picker (confirm the **Runs with** card shows `LightAISolutions/Sales` before saving), environment, model, schedule, connectors (none unless the prompt needs one), notifications, then one **Run now**. Check the live docs with `read_documentation` rather than memory.
> 4. What a good first run looks like (§8: it proposes at least one event and commits, or stands down with a report), and how I verify it: the session report, a commit on `main`, and the queue file.
>
> Do not create the Routine yourself. `create_trigger` cannot attach a repository, and a Routine without one cannot push.
>
> Done when: the prompt is committed in `ROUTINES-OPERATIONS.md`, the push has merged, and I have the UI steps.

**To continue:** paste the #12R prompt above into a new Opus 5.5 Medium session
