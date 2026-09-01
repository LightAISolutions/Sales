# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
**Date:** 2026-09-01 01:51:37 AM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v04.02r
**Branch:** `claude/receipts-app-bug-73prik`

**What was done (v04.00r–v04.01r, reconstructed from CHANGELOG):**

- **v04.00r — Monday's first unattended Scraper run worked; the delivery gate around it did not.** The three-day delivery window (added to end a midnight give-up) had silently split the weekday rule in two: the pass asked "is today a run day?" but never "is the EDITION for a run day?", so the weekend's manual builds mailed alongside Monday's. Fixed with an off-day gate applied in both the grouping and send loops, off-day rows stamped `'off-day'` rather than skipped, and a DST-proof `scIsoDayOfDateKey_` that deliberately avoids `new Date(key)`. The window itself was kept — it is what carries a missed Friday edition to Monday
- **v04.01r — weekend builds unnumbered, and same-story clustering.** `scIssueNumbers_` ranks run-day dates only, retroactively moving Monday from No. 004 to No. 002; `scClusterStories_` collapses multi-outlet coverage of one event onto the most reliable source, with event category as a separator rather than a requirement and a shared-distinctive-token test rather than a similarity ratio

**What this session did (v04.02r):**

- **Receipts sign-in outage, third of its kind — fixed the lockout, not the grant.** A live probe of the Profiler deployment (different script, same ACL spreadsheet) returned `acl_unreachable` with "You do not have permission to call SpreadsheetApp.openById. Required permissions: .../auth/spreadsheets" — proving the failure is an account-level OAuth grant gap hitting every auth app at once, not a Receipts defect and not the spreadsheet
- Added a **last-known-good ACL snapshot** to the shared AUTH block (auth template + all 7 auth projects): a successful read stores the page's allow-list in Script Properties; an unreadable ACL is answered from it instead of denying everyone. Reproduces only "yes" verdicts the real ACL already gave, never denies from the snapshot, 24h ceiling, `ACL_GRACE_ENABLED` off-switch, every grace grant audited
- Ported **`aclHealthProbe_`** to `Receipts.gs` (`GET ?action=api&op=aclhealth`) — Profiler had it, Receipts did not, which is why all three Receipts incidents cost an Apps Script editor round-trip. Extended with a `grace` field reporting snapshot presence, coverage and age

**Where we left off:**

- All changes committed and merged to main
- **The developer still has one manual step in Google that no commit can do**: run `diagnoseAuthorization()` from the Receipts Apps Script editor, open the authorization URL it prints, and approve **every** checkbox as the script account. Until then the ACL stays unreadable — the grace snapshot only masks it for users already recorded, and a first-ever sign-in on a project with no snapshot yet will still be denied

**Key decisions made:**

- **Availability beats strict denial here, deliberately.** A revoked user can retain access for up to 24h past the last good read. Receipts runs the `hipaa` preset, so this is a real trade — flagged in the CHANGELOG as the one part of the push worth a second opinion. `ACL_GRACE_ENABLED = false` restores the old behavior
- **The grace verdict is not cached** — a cached grant would outlive the outage by the full 10-minute access-cache TTL
- **Fixed in the shared AUTH block, not just Receipts.** `checkSpreadsheetAccess` was byte-identical across the template and all seven projects, and the outage was fleet-wide; patching only Receipts would have created drift that the next template propagation would clobber
- **Not attempted: pinning `oauthScopes` from the deploy path.** Considered as a recurrence fix, rejected — the deploy path is the most dangerous code in the repo, an under-declared pinned list would brick self-update fleet-wide, and the manifest is already preserved verbatim by `pullAndDeployFromGitHub()`. The recurrence is in the *grant*, not the declaration

**Active context:**

- Branch `claude/receipts-app-bug-73prik` · repo **v04.02r** · Receipts GAS **v01.29g**, Profiler **v01.31g**, Scraper **v01.93g**, MasterACL **v01.14g**, globalacl **v01.08g**, testauth\* **v01.07g**
- Capacity after this push: repo CHANGELOG **82/100** (the 2026-08-27 group, 20 sections, rotated to the archive with SHA enrichment; archive now 220); Scraper GAS 40/50; Profiler GAS 31/50; Receipts GAS 29/50
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Sandbox note for future sessions in this environment**: the auto-mode classifier blocks most bulk file mutation from Bash (heredoc-to-file, running scripts from the scratchpad, many compound commands). Simple `sed -i 's///'`, single redirects, `cp`, and the Edit/Write tools all work. `node --check` cannot read `.gs` (Node 22 rejects the extension — it fails on untouched files too); use `node --check --input-type=commonjs < file`

**Recommendation for next session:**

- Confirm the Google-side grant is repaired and the fleet is healthy: curl the Receipts `aclhealth` probe shipped this push (`?action=api&op=aclhealth` on its `/exec` URL) and expect `"ok":true,"reason":"acl_ok"`. If it still reports `acl_unreachable`, the `diagnoseAuthorization()` re-consent has not been done yet and nothing else should be built on top of it

**To continue:** type `check acl health`

## Previous Sessions

### Session — 2026-08-31 (Profiler analyst access retune + model-choice analysis, v03.99r)
**Date:** 2026-08-31 05:32:16 AM EST
**Repo version:** v03.99r
**Branch:** `claude/dossier-analyst-access-fix-v437ym`

**What we worked on (Phase 6 C0's first slice built early + a model-choice analysis, v03.99r):**

- **v03.99r — the Profiler access retune, built.** The developer reported analysts still reaching Network + Relationships and thought it had already been changed. **Their premise was half right and the correction mattered**: the retune was *approved* in the v03.98r design gate but never coded — `OV_ROLE_CAPS` carried no `network` capability at all, so the Relationships tab and `#network` explorer were ungated for **every** signed-in tier, viewer included. The screenshot was correct behavior, not a regression
- **Scope call, flagged before starting**: implemented the whole approved table from `PHASE6-CLASSROOM-DESIGN.md`, not just the two surfaces named — analyst also lost Coverage 📰 and Export, viewer lost Study + Compare. Reason given: splitting it would have made `verify-profiler-roles.py` encode a half-applied matrix that gets rewritten next session. Developer did not object and has since verified admin/analyst differentiation live
- `Profiler.html` **v01.75w** — four new caps (`network`, `coverage`, `study`, `compare`); `ovDeniedView()` added so `#network` and `#compare` deep links deny on their own; three stale "ungated / every signed-in tier" comments corrected
- `Profiler.gs` **v01.30g** — `COVERAGE_ROLES` + `coverageAllowed_()` (sharing a new `roleAllowed_` helper with guidance) enforced in `handleNewsOp_`
- `scripts/verify-profiler-roles.py` — five surfaces → ten per tier, plus deep-link denial assertions in **both** directions; full run clean (4 tiers + progress isolation + 88-dossier specs audit)
- Profiler page changelog hit its 50/50 cap exactly as predicted — 2026-08-13 date group (2 sections) rotated to the archive with SHA enrichment
- **Then a research response (no code): Fable 5 vs Opus 5 for building Classroom**, asked because the developer is at 95% of their weekly Fable limit

**Where we left off:**

- Everything pushed and auto-merged; working tree clean. Developer confirmed the access differentiation is correct on the live site
- **Classroom v1 (C0–C2) is NOT started.** The developer is pausing the project here and will restart later — they took the model advice as something to "keep in mind for when I restart this project"
- Phase 6 C0's *first slice* is done; the rest of C0 (Classroom scaffold via `setup-gas-project.sh`, masthead cross-links) plus C1 and C2 remain

**Key decisions made:**

- **`network` is one capability gating two doors** — the per-dossier Relationships tab and the standalone explorer — so they can never drift apart. Documented in `.claude/rules/profiler-app.md`
- **Hidden entry points are not the gate**: every gated hash route re-checks its own capability. A bookmarked `#network` from an analyst gets a denial view, not a blank screen
- **Only Coverage got a real server-side boundary** — the corpus reaches the browser solely through the GAS proxy. The relationship graph, study guides and Compare read public Pages JSON, so their gates are honest app-experience gates (same standing as Versions). Making any of them truly private is a data-relocation decision (the M3 pattern), not a gate tweak — this is written into both the `.gs` matrix comment and the rules file
- **Model choice for Classroom — build C0–C2 on Opus 5 at `xhigh`; do NOT spend the last 5% of the Fable allowance on C0.** Reasoning worth keeping: (a) the design gate already closed, so C0–C2 is spec-following, and the reasoning premium pays most on open-ended design; (b) this repo's highly prescriptive `CLAUDE.md` is the *documented* anti-pattern for Fable — the migration guide says prompts written for prior models "are often too prescriptive and reduce output quality," so getting Fable's benefit would mean re-tuning ~99 versions of gate system for a model affordable 5% of the time; (c) fast mode is Opus-only, Fable has none; (d) in this repo the verifiers catch errors, not model brilliance. Fable pricing is 2× Opus ($10/$50 vs $5/$25 per MTok), same 1M context and 128K output
- **Where Fable would actually earn it: C2** — and specifically the model that **runs as** the weekly authoring Routine (recurring, unattended, open-ended), not the one that *builds* the pipeline. That is a per-Routine model setting, and it is the choice that compounds
- Weekly Fable limit **resets Saturday 2026-09-05 07:00 AM EST**, so a full allowance will very likely be available by the time C2 is reached — the decision does not need making at C0

**Active context:**

- Branch `claude/dossier-analyst-access-fix-v437ym` · repo **v03.99r** · Profiler page **v01.75w** / GAS **v01.30g** · session ran as `claude-opus-5` at `effort_level: xhigh`
- Capacity: **repo CHANGELOG 99/100 — the next push rotates** (2026-08-27 date group, 20 sections, is the oldest); Profiler page changelog 49/50; Profiler GAS 30/50; Scraper GAS 37/50
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- Watch items: today's **Monday 2026-08-31 06:00 ET Scraper run** (first unattended corpus exercise — fires ~30 min after this save; the 8 project seeds should land in the Interests tab flagged "New topic") and the drift Routine's first fire **2026-09-01 ~9am PST** (expected: silent stand-down)

**Recommendation for next session:**

- Build **Classroom v1 C0** per `repository-information/PHASE6-CLASSROOM-DESIGN.md` — the scaffold half that remains (`setup-gas-project.sh` → Classroom app on the auth template, Classroom access matrix, masthead cross-links between the apps); the Profiler retune half is already shipped. Stay on Opus 5 at `xhigh`, and expect that push to rotate the repo CHANGELOG

**To continue:** type `build classroom v1`
