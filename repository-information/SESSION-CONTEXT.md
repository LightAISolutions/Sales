# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-29 01:34:01 AM EST
**Repo version:** v03.51r
**Branch:** `claude/scraper-subscriber-edition-match-6dwyjt`

**What we worked on (v03.25r–v03.51r — Scraper polish, then a run of scoring and scheduler fixes):**

- **Emailed digest, mobile.** Rebuilt the layout phone-first: the `@media (max-width:600px)` block was being stripped wholesale by Gmail (it drops the whole `<style>` element when it contains unsupported code, and the shell carries MSO conditional comments), so the email fell back to inline *desktop* sizes. Inverted it — inline styles now carry the phone sizes and a `min-width:601px` block enlarges for desktop, so a stripped block leaves a phone-shaped email. Settled on 27/22/18/15 after two rounds (24/20/16/14 was a step too small)
- **Summary/analysis presentation.** Analysis runs inline in amber with an "Amber = analysis" footer key; figures in reported text are green (`#4ade80`), figures inside an analysis stay amber via `inherit`
- **Held-back stories** now carry their summary and analysis into View More, and `scDigestSummarizeSet_` summarizes the *relevant* set rather than an unfiltered top-30 (section caps summed to exactly 30, so on a heavy day everything held back was unsummarized)
- **Same-day editions**: tried keeping both builds (v03.42r), developer preferred replacement, reverted (v03.43r). The per-edition delivery grouping from that experiment was deliberately kept as defence in depth
- **Scoring fixes**: backstop rotation was advancing on every run so a rebuild queried a *different* 12 companies (and editions ate each other's rotation); consumer gear reaching the digest; duplicate Google News stories; Google News weighted down 0.85 → 0.70
- **Scheduler**: the weekday guard was missing from the sender itself, so Saturday-built editions would have mailed at 07:00; and the 06:00 build skipped any edition already built that day, including by hand — so a manual test build would have been the thing that shipped
- **Diagnostics added**: `digestScoreReport` + a "Why thin?" button, and the Calendar now separates emailed from merely built

**Where we left off:**

- All work committed and pushed; branch merged to `main` by the auto-merge workflow each time. Working tree clean at v03.51r
- **Nothing is broken and nothing is half-finished.** The last push (v03.51r) closed the scheduler request completely
- **The open item is empirical, not code**: Monday 2026-08-31 is the first real run of the full schedule — 06:00 build with the 72-hour window, 07:00 send, replacing whatever the day already holds. Nobody has watched that path execute end to end
- The developer has weekend test editions sitting in the sheet. They are harmless (delivery only considers rows dated today, and the weekend guard refuses the day outright) and the Calendar now draws them hollow

**Key decisions made:**

- **7:00 AM ET, not PT.** The developer wrote "7am PST"; the app has always been ET. Asked rather than guessed — they confirmed ET. `SCRAPER_DIGEST_TZ` + `SCRAPER_DIGEST_TZ_LABEL` were centralised so the switch is two lines if that ever changes
- **One edition per day, replacement not accumulation.** Tried the alternative for one version and reverted at the developer's request
- **Guards belong where the action happens, not in the callers.** The weekday rule now lives in `scDigestDeliverPending_` — the only code that can put an edition in an inbox — because three callers each remembering the same rule is how one of them forgot
- **Verify against the developer's real input, not a synthetic one.** The Jackery fix was measured on their actual headline (81 → 0); the mobile sizes were measured in a browser at 390px with and without the `<style>` block
- **A changed seed's `tv` must be bumped or the change never ships.** Learned the hard way — v03.48r shipped new segment vocabulary that could not reach the app. Now guarded by `t22.js` *and* a blocking section in `.claude/rules/scraper-sources.md`, because the test corpus is not committed and cannot protect a future session
- **`scEditionWindowH_` still honours an explicit per-edition `windowH` ahead of the Monday-72h rule.** That is a setting, not a bug — pinned by test and flagged to the developer rather than quietly overridden

**Active context:**

- **Branch:** `claude/scraper-subscriber-edition-match-6dwyjt` · **Repo:** v03.51r · **Scraper:** `v01.83g` / `v01.66w`
- **Schedule as it now stands:** build 06:00 ET, send 07:00 ET, Mon–Fri. Monday scans 72h, Tue–Fri 24h. The 06:00 build replaces the day's existing edition; delivery holds an edition whose build is still in flight
- **Test corpus lives in `/tmp/sc/` and is NOT committed** — 24 suites, 639 assertions (`t.js`, `t2.js`…`t24.js`). It will be gone in a fresh session. Anything that must survive belongs in `.claude/rules/`, which is why the seed-`tv` rule was written there
- **Changelog capacity is tight**: repo `98/100`, `Scrapergs` `49/50`, `Scraperhtml` `39/50`. **The next push must rotate the repo CHANGELOG, and the GAS one is one push behind it.** Both rotations need SHA enrichment; the GAS/page ones resolve their SHA through the repo version each header carries as a cross-reference, since a `g`/`w` version never appears alone in a commit subject
- **Three editions**: `morning` (to jonyang92@gmail.com), `bess` and `aidc` (to jymiasole01@gmail.com). 88 companies, ~14 topics, 12–17 segments filtered depending on edition
- Relevance bar is 55. Recent BESS builds land 13–16 relevant of 84–99 scanned, which the developer called close to the sweet spot

**Recommendation for next session:**

- Ask the developer how Monday 2026-08-31's 06:00 scheduled run went — whether it replaced the day's edition, whether the 72-hour window produced a comparable article count to a weekday, and whether all three editions arrived at 07:00. That is the first unattended execution of the whole schedule and the only thing in the system that has never been observed working; if it did run clean, the Scraper is feature-complete for now and the next session is free for new work.

**To continue:** type `check how Monday's scheduled run went`

## Previous Sessions

### Session — 2026-08-28 (v03.04r–v03.24r)

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
