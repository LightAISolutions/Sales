# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-28 01:50:04 AM EST
**Repo version:** v03.24r
**Branch:** `claude/scraper-rebuild-phase-1-hl8uw0`

**What we worked on (v03.04r–v03.24r — the whole Scraper rebuild, go-live, and per-edition editions):**

- **Phases 1–4 shipped**: Interests tab + Profiler registry sync + four-signal rubric; Interests panel UI; weekday digest engine (chunked, resumable fetch → backstop → summarize → render) with the Night Ink email; then go-live — roster shakeout, email client-proofing, pause flags flipped on
- **Phase 5**: Projects retired; Editions + Subscribers + Archive + Source stats replace it; new Wire Desk landing page
- **Six relevance signals** implemented (click engagement, per-company mined segments, corroboration, plus the original four)
- **Dossier mining** from Profiler — 88 dossiers, now fully read (88/88)
- **Per-edition tuning**: three editions — `morning` (global preset, unchanged), `bess`, `aidc` — each materialised from a **preset** into a full explicit segment/topic map
- **Source roster honesty**: retired outlets carry their own flag + recorded reason; `.claude/rules/scraper-sources.md` blocks re-proposing a proven-unfetchable outlet

**Where we left off:**
- Everything committed, pushed and merged through **v03.24r**; working tree clean
- **The developer has "a couple more issues to fix" and deliberately deferred them to a fresh session.** They have not been described yet — ask first, do not guess
- Last push fixed three reported faults (segment gate, AI 503 retry, edition picker). **The developer has not yet verified them on the live app**

**Key decisions made:**
- **Editions materialise, never inherit.** A sparse override map was tried (v03.21r) and rejected by the developer: it made every edition track the Morning Edition. Presets now expand into a full explicit map at creation; `global` is the only non-materialising preset and is what `morning` uses
- The amber dot means **"changed from the recommendation"**, not "differs from global"
- Companies and sources stay **global**; only segments and topics are per-edition
- **Gemini free tier is the default AI provider**; Claude is opt-in via the in-app switch
- Article caps favour completeness over less scanning — `TOP_N = 30`, section caps `{companies:12, market:10, incidents:8}` summing exactly to TOP_N
- Night Ink email is 860px wide (widened twice at the developer's request)
- Two outlets (Data Centre Magazine, Battery Technology) are **live but unfetchable** — Cloudflare-walled; one (Solar Industry) is genuinely offline. Do not re-propose any of them
- `doPost(action=deploy)` stays unauthenticated; never hardcode the developer's email

**Active context:**
- Versions: repo **v03.24r** · Scraper **v01.50w / v01.57g** · Profiler v01.43w · Receipts v01.36w
- Counters: repo CHANGELOG **91/100** (first rotation done this session) · `Scrapergs.changelog.md` **44/50** · `Scraperhtml.changelog.md` **50/50** (rotation due on its next entry)
- **A `Sync now` is still owed** — the 15 new segments and 4 new topics added in v03.21r only appear in Tune after a sync, and presets can only materialise interests that exist
- No TODO items; no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On
- Recurring lesson this session: **four separate bugs came from my own prior pushes** (mining clobber, tile never repainting, `'1'` parsed as false, the segment-split breaking the gate). When a rebuild adds vocabulary or state, re-check the consumers of that state in the same push

**Recommendation for next session:**
- **Ask the developer what the two deferred issues are, then rebuild The Morning Edition and confirm last night's three fixes held** — the footer should read `summarized by gemini/…` rather than the fallback note, no residential-storage story should appear, and the Digest overlay should let them pick the edition
- **To continue:** type `pick up where we left off`

## Previous Sessions

### Session — 2026-08-27 (v03.01r–v03.03r)

**Date:** 2026-08-27 04:19:08 PM EST
**Repo version:** v03.03r
**Branch:** `claude/scraper-profiler-integration-2z8ghm`

**What we worked on (v03.01r-v03.03r — Scraper pause + Scraper↔Profiler rebuild planning + developer rebrand):**

- **v03.01r (GAS v01.35g):** `SCRAPER_SCHED_EMAIL_ENABLED` kill switch — all scheduled digest emails (every cadence) stopped
- **v03.02r (GAS v01.36g):** full scheduled-pipeline pause — scheduled runs skip compile/analyze/brief entirely, so no Anthropic/Gemini token spend and no email while paused; manual in-app actions still work. Re-enable = flip both flags in Phase 4
- **Scraper rebuild planned and fully decided:** 4-phase plan approved (Phase 1 Interests tab + Profiler registry sync + rubric scaffolding; Phase 2 Interests panel UI; Phase 3 digest engine; Phase 4 go-live re-enabling delivery). Design locked via the "Scraper Redesign Mockups" canvas (https://claude.ai/code/artifact/4fb0367c-a82f-4e5e-b6c3-0d117c0f7b2f): **App = Wire Desk** (dark, IBM Plex Sans/Mono, #15171c charcoal + #f2a33c amber), **Digest = Morning Edition in the Night Ink dark variant** (Newsreader serif masthead on the app palette)
- **D1–D3 recorded (full detail in the v03.03r CHANGELOG section):** D1 = 30-source free trade-press roster (no paywalled sources; RTO Insider et al. excluded — known partial gap on ERCOT/PJM market-rule minutiae); D2 = Google News kept only as a covered-company-name backstop (down-weighted, labeled); D3 = four-signal Profiler-derived scoring rubric (company / topic / Profiler-emphasis / substance) replaces 👍/👎 — feedback UI turned off and hidden but code + historical votes preserved
- **v03.03r:** `DEVELOPER_NAME` rebrand ShadowAISolutions → LightAISolutions across 242 files; every page (w), GAS (g), and AHK (a) version bumped with changelog entries; all 23 tracked PDFs regenerated; the 13 study-prep PDFs re-delivered as chat downloads

**Where we left off:**
- Everything committed and merged through v03.03r; working tree clean. Scraper is fully paused (no emails, no scheduled AI spend). **The rebuild has NOT started** — the developer wants the buildout in a fresh session, beginning with Phase 1

**Key decisions made:**
- Scraper = 3rd-party trade news only; Profiler = 1st-party sources. Company-owned domains (IR/newsrooms) excluded from Scraper's sources
- Weekday digest Mon–Fri 7:00 AM ET; Monday edition covers 72h (the weekend)
- Interest model: an Interests tab in Scraper's spreadsheet synced daily from the public `profiler-data/profiler-companies.json`; new Profiler companies default-ON flagged "New coverage"; removed ones marked stale, never deleted
- Guidance topic sync happens at authoring time (extend the Industry Guidance Command rule), not via a runtime Profiler API probe
- Night Ink production email needs dark-mode client-proofing (Outlook/Gmail recoloring) + a real-inbox test before Phase 4 go-live
- Rebrand preserved 4 occurrences intentionally: the Provenance Markers rule, the init-history archive entry, and two archived incident docs where the literal old string is load-bearing; hidden provenance markers untouched

**Active context:**
- CHANGELOG counter 96/100; Profiler v01.43w/v01.22g; Scraper v01.35w/v01.37g; registry 88 companies; no TODO items or active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On
- Developer-side: replace the stale Google Drive PDF copies with the regenerated ones delivered in chat
- Standing sensitivities unchanged from prior sessions (Zhonhen/Schneider disclosure scoping, Zhu Guoding conviction, NVIDIA quote paraphrasing, field notes never cited, Hithium executive arrest do-not-quote)

**Recommendation for next session:**
- **Execute Phase 1 of the approved Scraper rebuild** — the Interests tab + daily Profiler registry sync + four-signal rubric scaffolding in `Scraper.gs`, per the approved 4-phase plan and the D1–D3 decisions recorded in the v03.03r CHANGELOG section (30-source roster, company-name Google News backstop, feedback-off rubric)
- **To continue:** type `start Phase 1`
