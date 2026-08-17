# Changelog Archive

Older version sections rotated from [CHANGELOG.md](CHANGELOG.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 100 version sections.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with per-entry EST timestamps and project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository).

## Rotation Logic

When Claude runs Pre-Commit #7 on the push commit, after creating the new version section in CHANGELOG.md, this rotation procedure runs:

### Quick rule (memorize this)

> **100 triggers, date groups move.** When sections exceed 100, rotate the oldest date group. A date group is ALL sections sharing the same date — could be 1 section or 500. Never move part of a date group. Today's sections (EST) are always exempt. Repeat until ≤100 non-exempt sections remain.

### Step-by-step

1. **Count** — count all `## [vXX.XX*]` version sections in CHANGELOG.md (exclude `## [Unreleased]`)
2. **Threshold check** — if the count is **100 or fewer**, stop — no rotation needed
3. **Current-day exemption** — get today's date (EST via `TZ=America/New_York date '+%Y-%m-%d'`). Any version section whose date (`YYYY-MM-DD` in the header) matches today is **exempt from rotation**, even if the total exceeds 100. This means the main changelog can temporarily exceed the 100-section limit on busy days — it self-corrects on the next push after midnight
4. **Mandatory first rotation** — if the threshold check triggered (step 2), you MUST rotate at least one date group before checking the non-exempt count. Do NOT skip straight to the re-check in step 7 — the trigger means "rotate now", not "check if rotation is needed". Proceed to steps 5–6 with the oldest non-exempt date group
5. **Identify the oldest date group** — among the non-exempt sections (dates before today), find the **oldest date** that appears in any section header. **ALL sections sharing that date form a single date group** — this could be 1 section or 100+ sections. The entire group moves together, no matter how many sections it contains
6. **Rotate the group** — move the entire date group from CHANGELOG.md to CHANGELOG-archive.md:
   - **SHA enrichment** — as each version section is moved, look up its push commit SHA and append ` — [SHORT_SHA](https://github.com/ORG/REPO/commit/FULL_SHA)` to the header. Resolve ORG/REPO from `git remote -v`. If the header already contains a SHA link, skip it. If the lookup fails (commit not found — common when git history is shallow), move the section as-is without a SHA link. **Lookup by changelog type:**
     - **Repo CHANGELOG** — headers contain the repo version directly. For `## [v01.05r] — 2026-02-28 ...`, run `git log --oneline --all --grep="^v01.05r " | head -1`
     - **Page/GAS changelogs** — headers contain the page/GAS version AND a repo version cross-reference at the end (e.g. `## [v01.44w] — 2026-03-13 ... — v03.09r`). **Use the repo version cross-reference** for the lookup — it's the same version that appears in commit messages. Run `git log --oneline --all --grep="^v03.09r " | head -1`. This is more efficient than trying to match page versions to commits, since commit messages use repo version prefixes, not page version prefixes
     - **Batch optimization** — when rotating multiple sections, build a lookup table first: run `git log --oneline --all` once, then match each section's repo version against the output in-memory (or via grep). This avoids N separate `git log` calls for N sections
   - Remove them from CHANGELOG.md
   - Insert them into CHANGELOG-archive.md **above** any previously archived sections but below the archive header, in their original order (reverse-chronological, same as in CHANGELOG.md)
   - On the first rotation, remove the `` placeholder
7. **Re-check** — after moving one date group, re-count the non-exempt sections remaining. If still above 100, repeat steps 5–6 with the next oldest date group. Continue until ≤100 non-exempt sections remain (or only today's sections are left)

### Key rules

- **Group by date, not individually** — never split a date group across the two files. All sections from the same day move together. A date group can contain any number of sections — the count of sections in the group is irrelevant; the group always moves as a unit
- **Never rotate today** — today's sections (EST) always stay in CHANGELOG.md regardless of count. The limit is enforced against older dates only
- **Common scenario: all non-exempt sections share one date** — this happens after a busy day followed by a new day. Example: 103 sections total, 3 from today, 100 from yesterday. All 100 from yesterday form one date group → rotate all 100 at once, leaving only today's 3. Do NOT move just enough to reach 100 — the date group is indivisible
- **Preserve content verbatim** — sections are moved exactly as-is (categories, entries, timestamps). No reformatting. The only modification during rotation is SHA enrichment (step 5) — adding a commit SHA link to headers that don't already have one
- **Order in archive** — newest archived sections appear at the top of the archive (just like CHANGELOG.md uses reverse-chronological order). When appending a newly rotated date group, insert it **above** any previously archived sections but below the archive header
- **Threshold is configurable** — the limit of 100 sections is defined in Pre-Commit #7 in CLAUDE.md. To change it, update the number there
- **SHA enrichment is MANDATORY — never skip it** — this is the most commonly skipped step during rotation. The "distraction tunnel" pattern causes it: moving large blocks of text is complex, and the per-section SHA lookup gets lost in the complexity. **Before writing any rotated section to the archive, verify it has a SHA link appended.** If you catch yourself about to insert sections without SHA links, STOP and go back to step 5. The SHA enrichment step applies to BOTH the repo CHANGELOG archive AND all page/GAS changelog archives — every `## [v...]` header in every archive file must have a commit SHA link. For page/GAS changelogs, look up the SHA using the repo version cross-reference at the end of the header (e.g. `— v02.90r` → search for `v02.90r` in git log)

### Post-rotation verification (MANDATORY)

After completing all rotation steps, run this verification before proceeding:

```
grep '^## \[v' CHANGELOG-archive.md | grep -v '— \[' | head -5
```

If ANY lines appear (sections without SHA links), the rotation is incomplete — go back and enrich those sections. **Do not commit until this check passes.** Run the same check on any page/GAS changelog archives that were rotated.

### Examples

**Scenario A: 103 sections, 3 from today, 100 from yesterday (single previous date)**
- 3 sections from today (exempt), 100 from yesterday (non-exempt)
- 100 ≤ 100 → no rotation needed (the threshold counts non-exempt only)

**Scenario B: 104 sections, 3 from today, 101 from yesterday (single previous date)**
- 3 exempt, 101 non-exempt — all 101 share one date
- Rotate ALL 101 at once → 3 sections remain → done
- Result: CHANGELOG has only today's 3 sections

**Scenario C: 102 sections, all from different dates**
- Sections span dates 2026-01-01 through 2026-02-21, today is 2026-02-21
- Today's section (2026-02-21) is exempt → 101 non-exempt sections
- Oldest date group: 2026-01-01 (1 section) → rotate it → 100 non-exempt remain → done

**Scenario D: 102 sections, 5 from today**
- 5 sections from today (exempt), 97 from older dates
- 97 ≤ 100 → no rotation needed despite 102 total

**Scenario E: 105 sections, 3 from today, oldest date has 4 sections**
- 102 non-exempt sections, oldest date has 4 → rotate those 4 → 98 non-exempt remain → done

**Scenario F: 105 sections, 3 from today, oldest two dates have 2 each**
- 102 non-exempt → rotate oldest date (2 sections) → 100 non-exempt → done

---

## [v01.61r] — 2026-08-03 11:57:41 PM EST — [1f497f8](https://github.com/LightAISolutions/Sales/commit/1f497f8b8a954079dbb757bb192e0037d1e3695f)

> **Prompt:** "For a few article ratings, it took a long time before it captured and saved me ratings. When I am rating articles (thumbs up/down), create a status window to the right that shows the steps that it is going through, so that it is easier to debug in the future."

### Added

#### `Scraper.html` — v01.15w

##### Added
- Rating status panel `#sc-vlog`: fixed dark monospace log docked right of the articles card (z-index 51, responsive at ≤1240px/≤760px breakpoints). Each 👍/👎 tap opens a numbered `scVlogSession` with its own clock; every step logs with `+Xms` elapsed — tap registered, per-attempt send/reply (with per-request round-trip ms), transport-retry wait, `unknown_op` mid-update wait, saved ✓ / NOT saved, buttons unlocked. Sessions from concurrent taps interleave safely (per-session numbering + per-session t0); log capped at 60 lines; × hides it (reappears on next rating); hidden when the articles overlay closes
- `scSendVerdict` restructured with sequential per-attempt instrumentation (inlining the former `scRetryOnce` wrapping so each attempt is individually visible); behavior unchanged — one transport retry + one `unknown_op` retry, 2.5s waits
- Harness-verified: healthy tap (attempt 1 → saved), flapping server (unknown_op → wait → attempt 2 → saved), close button, and screenshot visual check

## [v01.60r] — 2026-08-03 11:33:05 PM EST — [3ef1ffb](https://github.com/LightAISolutions/Sales/commit/3ef1ffbe02df26d21cef67586e5de9331465a5c4)

> **Prompt:** "build the distillation step while I continue to rate articles."

### Added

#### `Scraper.gs` — v01.13g

##### Added
- Feedback distillation: `scDistillFeedback_` sends ALL of a project's 👍/👎-rated titles (up to `SCRAPER_DISTILL_TITLES_MAX` = 40/side) to the AI and stores the result — a ≤150-word learned-preferences note plus up to 8 suggested search phrases — in a new user-visible `Preferences` sheet tab (`Project ID`, `Owner`, `Learned Preferences`, `Suggested Keywords`, `Verdicts Used`, `Distilled At`); auto-created by `ensureScraperTabs_`, upserted one row per project
- Distillation runs automatically inside `analyzeArticles` when total verdicts ≥ `SCRAPER_DISTILL_MIN_VERDICTS` (3) AND the count changed since the last distillation — at most one extra AI call per Analyze cycle (the stored `Verdicts Used` count makes follow-up chunk invocations skip it); failures are non-fatal and retried on the next Analyze
- Scoring prompts now include the learned note via `scPrefsPrompt_` (between PROJECT SCOPE and the raw exemplars); `previewBrief` includes it too so briefs reflect learned preferences
- Learned keywords widen fetching: `scBuildFetchQueue_` adds up to 2 `learned`-labeled Google News queries (6 keywords, OR'd in 3s) and `scGdeltQueries_` adds one learned query group to Backfill (cap raised 4 → 5 groups)
- `analyzeArticles` returns `distilled: N` (verdict count) when a distillation ran, and counts the distillation call in `UsageLog`

#### `Scraper.html` — v01.14w

##### Added
- The Analyze loop watches for `data.distilled` and appends "🧠 Preferences updated from your N ratings." to the completion toast (both the "articles scored" and "already scored" paths)

## [v01.59r] — 2026-08-03 11:21:17 PM EST — [b3941f4](https://github.com/LightAISolutions/Sales/commit/b3941f4755f44da0f0664ba6f47cd2445a3b7ef6)

> **Prompt:** "I opened Articles and started to rate them, but only the 1st article's thumbs-up rating went through. When I tried to thumbs-up the 2nd and 3rd articles, it would get grayed-out for a few seconds before resetting to default. Did I actually do anything by rating the 2nd and 3rd articles? Also, fix this issue."

### Fixed

#### `Scraper.html` — v01.13w

##### Fixed
- Verdict saves now go through `scSendVerdict`: retries once on transport failure (matching `scRetryOnce`) and once more with a 2.5s delay when the server answers `unknown_op` — the signature of Google's `/exec` serving briefly flapping to a stale deployment version after a GAS redeploy, which made taps land on code that didn't know `setArticleVerdict` yet. Server writes are absolute values, so retries are idempotent. Root cause confirmed by a full-fidelity Playwright harness (real page + handlers, stubbed GAS routes): the client path was correct in isolation; flap, healthy, and persistent-failure scenarios all verified post-fix
- New `unknown_op` entry in `SC_ERROR_MESSAGES` ("The server is finishing an update — wait a few seconds and try again") replaces the generic fallback toast for all actions during deploy flaps

## [v01.58r] — 2026-08-03 10:06:55 PM EST — [2ec7564](https://github.com/LightAISolutions/Sales/commit/2ec7564081c7665ecb67cdc6287f952f6f7ed4bf)

> **Prompt:** "fix articles and build the feedback loop. It is imperative that Scraper can learn about my preferences and can improve its article fetching and scoring capabilities to be realistically useful."

### Added

#### `Scraper.gs` — v01.12g

##### Added
- `setArticleVerdict` action records 👍/👎/clear into the existing User Verdict column (ownership-checked by project + owner, audit-logged)
- Verdict exemplars feed the scoring prompt: `analyzeArticles` collects up to 8 newest 👍 and 8 newest 👎 titles per project and `scScoreBatch_` injects them as a USER FEEDBACK section between the project scope and the article list, so every future scoring batch calibrates to the user's confirmed preferences

##### Fixed
- `listArticles` now sorts the project's full corpus by score (unscored last, newest-first within ties) **before** applying the 100-row cap — the previous newest-fetched-first cap let a large low-relevance backfill crowd every relevant article out of the overlay

#### `Scraper.html` — v01.12w

##### Added
- 👍/👎 verdict buttons on each article card (delegated click handler, active-state highlight, tap-again-to-clear, disabled while the save round-trips); verified via Playwright visual test

#### `Scraper-diagram.md`

##### Changed
- Sequence diagram updated: top-scored `listArticles` selection, exemplar titles in the scoring step, and the new `setArticleVerdict` flow; mermaid.live pako URL regenerated and decompression-verified

## [v01.57r] — 2026-08-03 08:17:43 PM EST — [be1fdaa](https://github.com/LightAISolutions/Sales/commit/be1fdaa1c8ef9dc02f91a8a2f6ed899a0af33064)

> **Prompt:** "16 minutes later, the backfill progress looks like this. Therefore, I don't think there's a need to "fix" the backfill. However, I do want you to show failures in the progress UI."

### Changed

#### `Scraper.html` — v01.11w

##### Changed
- Backfill progress button now appends the silent-error count from `backfillNow` responses (`, N failed`) when nonzero — failed GDELT slices (e.g. rate-limit rejections, which GDELT returns as HTTP-200 plain text) were previously invisible until the completion toast

## [v01.56r] — 2026-08-03 06:43:09 AM EST — [4e80170](https://github.com/LightAISolutions/Sales/commit/4e801704c3ed1c8000c38dc52c2f4fc06989d18b)

> **Prompt:** "Key added as "Scraper-GAS" with an expiry date of "never". Continue the build."

### Added

#### `Scraper.gs` — v01.11g

##### Added
- GDELT DOC 2.0 historical backfill engine: new `backfillNow`/`getBackfillStatus` actions slice the past 24 months per month × per query and pull date-ranged English article lists (≤250 per slice) into the Articles tab — deduped against existing URLs, batch-appended via `setValues` (not per-row `appendRow`), time-budgeted (40s / 6 fetches per call), with compact resumable state in Script Properties (slices are derived from `startedAt` + stored queries rather than stored, keeping state well under the 9KB property limit)

#### `Scraper.html` — v01.10w

##### Added
- Backfill button on each project card runs the chunked backfill loop with live progress ("Backfilling… n/total (X found)") and a completion toast; transport failures auto-retry once and an interrupted run resumes where it left off

## [v01.55r] — 2026-08-03 06:20:57 AM EST — [748bcab](https://github.com/LightAISolutions/Sales/commit/748bcabc2d66a31a1f06016937ff333bfe29f9bf)

> **Prompt:** "Repo created per your instructions and I made sure Claude Github App has access to the bess-aidc-library repo. Also, I have created an Anthropic Console account under jonyang92@gmail.com and funded it with $200."

### Added

#### `Scraper.gs` — v01.10g

##### Added
- Claude (Anthropic) AI provider wired into the swappable `aiComplete_()` layer: new `scClaudeComplete_()` calls the Messages API with Sonnet 5 (`claude-sonnet-5` default, `ANTHROPIC_MODEL` Script Property overrides) using an `ANTHROPIC_API_KEY` Script Property, mapping responses/errors to the same `ai_*` taxonomy as Gemini (`ai_key_missing`, `ai_rate_limited`, `ai_http_<code>` with trimmed API message, `ai_bad_json`, `ai_empty_response`)
- `AI_PROVIDER` Script Property now switches providers (`claude` | `gemini`) without a code change; Gemini remains the default and free-tier fallback

##### External
- Companion library repo `LightAISolutions/bess-aidc-library` seeded and pushed: 76-file skeleton inherited from this repo's template conventions (CLAUDE.md, rules, hooks, skills, trimmed auto-merge workflow), plus `library/news/<segment>/<year>/` archive structure, `library/specsheets/` placeholder, and the 55-company `WATCHLIST.md`

## [v01.54r] — 2026-08-03 02:51:07 AM EST — [9682a32](https://github.com/LightAISolutions/Sales/commit/9682a326285bf894a37fa69d105c38b71610fa34)

> **Prompt:** "Another error message. Resolve it."

### Fixed

#### `Scraper.gs` — v01.09g

##### Fixed
- Transport-level `http_404` on Analyze: live probes confirmed the deployment healthy (fast requests return 200 in 4–9s), isolating the failure to long-running exec requests dying at Google's HTTP front-end. `analyzeArticles` now makes exactly 1 AI call per invocation (was up to 3 + 2s sleeps), keeping each request compile-chunk-sized; the client loop provides continuation and free-tier RPM spacing. Removed the now-unused `SCRAPER_AI_CALL_SPACING_MS` intra-request sleep

#### `Scraper.html` — v01.09w

##### Fixed
- Compile and Analyze loops now automatically retry a failed chunk once (2.5s pause) before surfacing a transport error — safe because server-side state is chunked/resumable

## [v01.53r] — 2026-08-03 02:38:35 AM EST — [5609e93](https://github.com/LightAISolutions/Sales/commit/5609e936061e29c1d8af48a92d97d3b9092d6b6b)

> **Prompt:** "I created the GEMINI_API_KEY on my jonyang92@gmail.com account. Then, I added the GEMINI_API_KEY to the Scraper app's Script Properties on lightaisolution@gmail.com's account (owner of the app). However, when I pressed Analyze with or without Compile first, both times ended in the same error (attached). Resolve this."

### Fixed

#### `Scraper.gs` — v01.08g

##### Fixed
- `ai_http_404` on Analyze: the hardcoded `gemini-2.5-flash-lite` model was retired by Google on 2026-07-09 (months before its announced Oct 16 shutdown). Replaced the hardcoded model with live discovery: `scGeminiDiscoverModel_()` queries the ListModels endpoint (paginated), filters to stable `generateContent`-capable Gemini models (excludes preview/exp/image/tts/live/audio/embed/thinking variants), prefers flash-lite → flash → any Gemini with newest version + shortest name, and caches the pick in the `GEMINI_MODEL_AUTO` Script Property. A 404 on a cached model triggers one automatic rediscover-and-retry, so future model retirements self-heal. Manual `GEMINI_MODEL` Script Property still overrides everything
- Gemini API error bodies are now surfaced: non-200 responses throw `ai_http_<code> — <API error message>` instead of an opaque status code
- `analyzeArticles` now reports `hasArticles` so the client can distinguish "no articles compiled yet" from "everything already scored"

#### `Scraper.html` — v01.08w

##### Fixed
- Clicking Analyze on a project with no compiled articles now shows "No articles to analyze yet — run Compile first to gather news." instead of the misleading "All articles were already scored."
- Added a user-facing message for the no-compatible-model case

## [v01.52r] — 2026-08-03 02:15:55 AM EST — [3f99df9](https://github.com/LightAISolutions/Sales/commit/3f99df95559316fed98a81d8c231543141be7dd4)

> **Prompt:** "Deploy works and does give me a bunch of Google News that are questionably related to my topic. Continue with Phase 3."

### Added

#### `Scraper.gs` — v01.07g

##### Added
- Phase 3 AI layer: provider-agnostic `aiComplete_()` abstraction — Gemini free tier today (`scGeminiComplete_` via `generateContent` v1beta, default model `gemini-2.5-flash-lite` overridable with a `GEMINI_MODEL` Script Property; key from `GEMINI_API_KEY`), Claude slot ready as a future branch
- `analyzeArticles` route: chunked AI relevance scoring — up to 3 AI calls per invocation × 10 articles per call, 2s spacing for free-tier RPM headroom; scores (0–100) and 1–2 sentence summaries (for scores ≥50) written back to the Articles tab; unscored articles are the natural resume state
- `previewBrief` route: executive brief synthesized from the top 30 relevant articles (score ≥50), plain-text overview + bullets
- `listArticles` now returns `summary` and `score`; `scLogUsage_` extended to track AI calls alongside fetch calls in UsageLog

#### `Scraper.html` — v01.07w

##### Added
- Analyze button per project card driving the chunked scoring loop with progress ("Scoring… N left")
- Articles panel: color-coded relevance score chips (green ≥70, amber ≥50, red <50), AI summaries shown in place of raw snippets, scored-first sort order
- Brief button in the articles panel rendering the AI executive brief in a styled box
- User-facing error messages for AI failure modes (missing key, rate limit, empty/unreadable response, no relevant articles)

## [v01.51r] — 2026-08-03 01:23:34 AM EST — [1c38ef1](https://github.com/LightAISolutions/Sales/commit/1c38ef13ebbce16787c36d57b096debdf02bf907)

> **Prompt:** "I signed into the live Scraper page and created a real project. Continue with Phase 2."

### Added

#### `Scraper.gs` — v01.06g

##### Added
- Phase 2 compilation engine: `scBuildFetchQueue_()` builds Google News RSS search queries from topic terms (stopword-filtered via `scTopicTerms_`), keyword OR-chunks, industry combinations, and exclusion negations, plus the project's user-specified feed URLs
- `scParseFeed_()` parses both RSS 2.0 and Atom feeds via XmlService with HTML-stripped, length-bounded fields
- `compileNow` route: chunked, resumable compilation — each call fetches ≤6 URLs within a 40s budget, persists progress in Script Properties (`scCompile_<projectId>`), dedupes against existing article URLs per project, caps runs at 200 new articles, appends rows to the Articles tab, and logs fetch counts to UsageLog; the client loops until `done`
- `getCompileStatus` and `listArticles` routes (owner-scoped, newest-first, capped at 100)
- Dispatcher/action-list extended with the three new ops (doPost + doGet api mirror route automatically)

#### `Scraper.html` — v01.06w

##### Added
- Compile button per project card with live progress label ("Compiling… N/M") driving the chunked `compileNow` loop, finishing with a result toast and auto-opening the articles panel
- Articles panel overlay listing fetched articles (linked title opening in a new tab, source · date meta line, snippet)

##### Fixed
- Articles panel close button now shares the wizard close-button styling

## [v01.50r] — 2026-08-02 09:42:54 PM EST — [b71d24e](https://github.com/LightAISolutions/Sales/commit/b71d24e87e61efca66ed241d5be799f73c567271)

> **Prompt:** "Stick with Gmail sign-in as planned and kick off Phase 1 (data model + project intake wizard)."

### Added

#### `Scraper.gs` — v01.05g

##### Added
- News Scraper Phase 1 data model: `ensureScraperTabs_()` creates 6 spreadsheet tabs (Projects, Schedules, Articles, Reports, Profiles, UsageLog) with frozen header rows, idempotently
- Session-gated project management routes `createProject`, `listProjects`, `getProject`, `updateProject`, `setProjectStatus` (active/paused/archived), all owner-scoped by email via `validateSessionForData` and reached through the iframe-free fetch transport (doPost actions + doGet `api` mirror via shared `handleProjectAction_` dispatcher)
- Payload normalization/validation (`scNormalizeProjectPayload_`) with bounded strings/lists, frequency whitelist (daily/weekly/monthly/quarterly/biannual/annual/custom), delivery whitelist (inapp/email/both), URL-validated custom sources, and a 10-active-projects-per-user cap
- Per-project schedule rows (one per frequency) written to the Schedules tab; audit entries via `dataAuditLog`

#### `Scraper.html` — v01.05w

##### Added
- News Scraper app layer (`#scraper-app`): project dashboard with cards (status/frequency/delivery chips), Refresh, Edit, Pause/Resume, and two-step inline Archive confirm; activated from `showApp()` via `window._scraperInit` (inline `// PROJECT:` hook)
- 5-step project intake wizard (basics → scope → sources → schedule → review) with per-step validation, custom-frequency reveal, review summary, and create/update submission through `_gasPost`
- `scraper-app` registered in `_htmlLayerEls` (PROJECT OVERRIDE) so the HTML layer toggle hides/shows the dashboard

### Fixed
- README `Repo version:` display corrected (was showing v01.48r while the repo version file was at v01.49r)

## [v01.49r] — 2026-08-02 08:37:29 PM EST — [0327874](https://github.com/LightAISolutions/Sales/commit/032787455cbe00851bd2d4ae6948d9dbf7c27be6)

> **Prompt:** "Delete everything related to this "spain-argentina" page. It was just a test."

### Removed
- Deleted the spain-argentina test page and all its tracking files: `live-site-pages/spain-argentina.html`, `html-versions/spain-argentinahtml.version.txt`, `html-changelogs/spain-argentinahtml.changelog.md`, `html-changelogs/spain-argentinahtml.changelog-archive.md` (all added in v01.15r)
- Removed its README tree entries (Standalone Utilities page entry + html-versions and html-changelogs subtree lines) and its REPO-ARCHITECTURE.md flowchart node `SPAINARG_PAGE` with its serves / version-polling / template-copy edges (flowchart pako URL regenerated and decompression-verified)
- Historical mentions in CHANGELOG.md (v01.15r section) and SESSION-CONTEXT.md are records of past sessions and were intentionally left intact

## [v01.48r] — 2026-08-02 08:31:18 PM EST — [ca4dd1c](https://github.com/LightAISolutions/Sales/commit/ca4dd1c754302ca5a8f07416763262f16c92ffc9)

> **Prompt:** "Also translate the review screen's category and subcategory dropdowns."

### Changed

- `Receipts.html` (v01.28w) — the review screen's category select (`fillCategories`) and per-item subcategory selects (`fillSubcatSelect`, incl. the blank "Subcategory —"/"子类别 —" option and preserved off-list values) now label via `tCat()`; `applyAppLanguage`'s value-keyed option pass extended to `#rr-category` and `.rr-cat` so a language toggle relabels an open review card too. Stored values remain English

## [v01.47r] — 2026-08-02 08:10:52 PM EST — [caa2275](https://github.com/LightAISolutions/Sales/commit/caa2275224c718b7afae411dae486ea81010674f)

> **Prompt:** "I want the Simplified Chinese translation option to translate everything, including:
>
> * "0 receipts * August 2026" and "No receipts saved yet this month" at the top of the dashboard.
> * All categories (Groceries, Dining, etc) in both History and Reports.
> * All subcategories for all categories in Reports.
> * In Daily Reports, change Mon-Sun to their Simplified Chinese equivalents while keeping the ", MM/DD/YY" latter half.
> * In Monthly Reports, change the months to their Simplified Chinese equivalents.
> * In Bi-annual Reports, change the "first/second half of 2026" into their Simplified Chinese equivalents."

### Added

- `Receipts.html` (v01.27w) — `I18N_CAT_ZH` (~90 entries) + `tCat()` for category/subcategory display names: History and Reports dropdown labels relabel via `option.value` (stored English values untouched — lossless both directions), report By-category / By-subcategory rows, the Line Items section title and note, and the month card's top-category rows all display 中文 in Chinese mode
- `Receipts.html` (v01.27w) — localized period labels in `bucketLabel()`: daily `周三, 7/29/26` (RP_DAYS_ZH; date half unchanged), monthly `2026年7月`, bi-annual `2026年上半年/下半年`; weekly and annual stay numeric
- `Receipts.html` (v01.27w) — month card fully localized: `N 张收据 · 2026年8月` (`zh-CN` locale month name), `本月还没有保存的收据` empty state, `其他项目` for the "Everything else" row; the language toggle now also calls `refreshMonthCard()` so the card flips immediately

## [v01.46r] — 2026-08-02 05:44:59 AM EST — [ca13e7b](https://github.com/LightAISolutions/Sales/commit/ca13e7b49352d550e4fb2f8975ba5bb075275944)

> **Prompt:** "In the Settings cog menu, include an option to change the app language from English to Simplified Chinese."

### Added

- `Receipts.html` (v01.26w) — app language toggle (English / 简体中文) in the Settings ⚙️ panel (`#rsp-lang`, persisted as `Receipts_lang` in localStorage). Chrome-level i18n layer: `I18N_ZH` dictionary + `t()` for dynamic strings; `applyAppLanguage()` swaps static elements via a config list (`L10N_ELS`) plus dataset-keyed walkers for field labels, checkbox tails, stamp labels, period tabs, and select options (original English remembered in `data-i18n-en` so toggling is lossless). Translated surfaces: landing buttons + stamp labels + month card + date locale, History card, Reports card (period tabs, chips, section titles, Line Items controls, hints, empty states), Sharing card, review-card labels/buttons, Settings panel, affirmations (13 zh equivalents), and a map of common status messages (`I18N_STATUS_ZH`). Receipt data (merchants, item descriptions, category values) intentionally stays as stored — categories are server-matched data values
- `t()`/`setStatus` guarded with `typeof` checks — `fillReportCategories` runs at script-eval time before the dictionary vars are assigned, and an unguarded lookup killed the whole script when Chinese was active at page load (caught by the bilingual Playwright pass)

## [v01.45r] — 2026-08-02 05:10:46 AM EST — [06ae13a](https://github.com/LightAISolutions/Sales/commit/06ae13aed12e666eff4712c69ca8fc58524c52f5)

> **Prompt:** "In the Reports section -> Line Items (Subcategory) with "Group by item" checked, if an item has been purchased more than once, show the total amount across all purchases instead of individual prices. We can see the individual prices once we click the line item anyways."

### Changed

- `Receipts.html` (v01.25w) — grouped Line Items rows now show the group's summed spend (`gTot`) as the row amount instead of the latest purchase price; the ×count and low–high range stats are unchanged and per-purchase prices remain in the tap-to-expand history

## [v01.44r] — 2026-08-02 05:05:19 AM EST — [40aec01](https://github.com/LightAISolutions/Sales/commit/40aec01f7c4f8d6d6315627d5e09ed570cd49c78)

> **Prompt:** "The combined viewing works as intended. However, I realized that I cannot view a receipt photo that she uploaded without getting access to her Google Drive Receipt App folder. Make it so that when a user shares view and edit permissions with another user, it automatically gives the other user permission to view the original user's folder."

### Added

- `Receipts.html` (v01.24w) — Drive folder sharing rides along with app grants: `driveShareFolder()` (POST a `reader` permission on the owner's "Receipts App" folder via the owner's `drive.file` token, `sendNotificationEmail=false`) fires on successful `addShare`; `driveUnshareFolder()` (permissions.list → DELETE the grantee's permission, raw fetch since DELETE returns an empty 204) fires on successful `removeShare`
- `Receipts.html` (v01.24w) — reconciliation in `loadShares()`: when the granted set differs from the `Receipts_folder_perms_synced` localStorage key, every granted email gets `driveShareFolder()` and the key advances only when all succeed — this retrofits folder access for grants made before this feature and self-heals failed Drive calls on the next app open. Must run client-side: the `drive.file` token can only manage permissions on folders the app created for that signed-in user; the server has no access to user Drives

## [v01.43r] — 2026-08-02 04:46:01 AM EST — [cf725a4](https://github.com/LightAISolutions/Sales/commit/cf725a488e697defb840a2c59d5a06c8533625ba)

> **Prompt:** "Approved, but also allow mutual delete."

### Added

#### `Receipts.gs` — v01.16g

##### Added
- `resolveOwnerSet_()` — combined-view owner resolution: `forOwner '*'` returns the session user plus every owner who granted them access as an ownerEmail → scope map; any other value defers to `resolveOwnerScope_` (single-entry map). Combining never widens access — every entry is backed by an existing Shares-tab grant
- `listReceipts` / `reportReceipts` now filter rows against the resolved owner set and tag each returned row with `owner` (and `canEdit` in listReceipts); `exportReceipts` accepts `'*'` and the Receipts sheet gains an Owner column (backfill loop indexes shifted accordingly)

##### Changed
- `deleteReceipt` ownership gate extended for mutual delete: the owner can always delete; any other user needs an edit-scope grant from the row's owner (`getShareScope_ === 'edit'`); everything else still responds `receipt_not_found` (no existence leak)

#### `Receipts.html` — v01.23w

##### Added
- "Combined (mine + shared)" option (`value '*'`) in the History and Reports "Viewing" pickers when received grants exist; `rhRowOwner()` normalizes each row's owner for detail/edit/photo routing (own rows → `''`); owner chip (`.rh-owner-tag`, name part of the email) on History rows in combined view
- Delete visibility in combined view follows per-row `canEdit` (edit-grant rows deletable, view-only rows not); single shared views keep delete hidden as before; the client-side own-Drive photo trash now keys off `rhRowOwner` so only the row's owner attempts it

## [v01.42r] — 2026-08-02 04:34:42 AM EST — [944d392](https://github.com/LightAISolutions/Sales/commit/944d392480661436ab3767fca7defd8967ce9896)

> **Prompt:** "Approved - Implement your plan. 
>
> Also, I want it to be possible for me and another user to combine our receipts and look at everything together. The real scenario is: my girlfriend and I live together, so everything we buy is shared. Thus, I want all the receipts both of us scan to be visible and editable by both Gmail accounts. Recommend a plan of action to implement this for me to approve." *(Line Items drill-down implemented this version; the combined-receipts plan was presented for approval, not yet implemented)*

### Added

- `Receipts.html` (v01.22w) — "🧾 Line items" collapsible group in Reports, rendered when a category is chosen (title carries the subcategory when one is picked). Flat mode lists each matching line item `date · merchant · description · price` (newest first, 300-row display cap, count + total header); "Group by item" mode collapses normalized item names into rows showing ×count, low–high price range, and latest price, expanding on tap to the full dated per-merchant history. Item search box (`#rp-item-q`) filters descriptions live — keystrokes rebuild only `#rp-item-list` via `_rpItemCtx`, so the input keeps focus; search/group state persists across `renderReport()` rebuilds (search resets on each Reports open). All existing filters (owner, dates, merchant, min/max, subcategory) apply since the rows derive from the already-filtered receipt map; client-only feature over the existing `reportReceipts` payload — no GAS changes

## [v01.41r] — 2026-08-02 12:31:41 AM EST — [e04d857](https://github.com/LightAISolutions/Sales/commit/e04d857dd1eaa42edacc85fde251d1f6fa5e292d)

> **Prompt:** "Everything looks good. However, I can no longer see the "Admin" drop down menu in my HTML/GAS layers, which I need to approve new user sessions. Fix it."

### Changed

- `Receipts.gs` (v01.15g) — Admin badge restyled from a dim status-pill look (dark `rgba(0,0,0,0.55)` background, 60% opacity, 10px font — visually identical to the adjacent Live/presence pills, so after the v01.14g move into the `#user-email` row it read as "gone") to a solid accent button: `#90caf9` background, dark text, bold 11px, full opacity, hover lighten; `#admin-wrap` gets `flex: 0 0 auto` so the row can never shrink it. Diagnosis confirmed the menu was functionally present: run 44's deploy log shows "Updated to v01.14g (deployment 21)", and a full-stack Playwright reproduction (real host page + real rendered `doGet` HTML in the iframe, R-hotspot → HTML-layer-toggle flow) showed the badge visible and its dropdown opening — the regression was prominence, not function

## [v01.40r] — 2026-08-02 12:11:48 AM EST — [7811523](https://github.com/LightAISolutions/Sales/commit/78115239120e5a7833214a7eb161e005e17195aa)

> **Prompt:** "A few changes:
>
> * In the History section, move the "sort by receipt date" checkbox outside of the collapsible filter. 
> * Add a "Clear" button in both the History and Reports sections' filters that clears all chosen filters back to default. 
> * In the History section, remove the green checkbox that shows each receipt as saved. If it shows up in the History section, it must already be saved. 
> * While logging in, there is an "icon placeholder" block. Replace this block with a relevant Icon that accurately represents what this app does.
> * In the dashboard, create a "Settings" cog icon at the bottom right corner of the screen that contains the signed in email account (jonyang92@gmail.com), and the "Sign out" and "Sign out everywhere" options. 
> * Slow down the speed at which the positive affirmations cycle by half."

### Added

- `Receipts.html` (v01.21w) — `#rh-clear` / `#rp-clear` buttons at the bottom of each filter drawer: History clears search/dates/category then `rhFilterHint()` + `loadHistory()`; Reports clears merchant/dates/min/max/subcat and dispatches `change` on `rp-cat` so the subcategory dropdown hides/resets through its normal listener
- `Receipts.html` (v01.21w) — Settings cog (`#rsp-settings`, fixed bottom-right, z-index 9) opening `#rsp-settings-panel` with the signed-in email, "Sign out", and "Sign out everywhere"; replaces the inline account row under the status line (same `rsp-account`/`rsp-signout`/`rsp-signout-all` ids so the 2s session-sync interval and sign-out handlers are unchanged); closes on outside click
- `live-site-pages/images/receipts-logo.svg` (created) — Paper Ledger-themed receipt icon (torn zigzag bottom, ink outline, accent `$`) shown on the auth wall and sign-out screen instead of the "LOGO" placeholder (`auth-wall-logo`/`signout-logo` src, PROJECT OVERRIDE)

### Changed

- `Receipts.html` (v01.21w) — "Sort by receipt date" moved out of the History filter drawer onto a pinned row under the Filters toggle; affirmation rotation slowed from 7s to 14s per message

### Removed

- `Receipts.html` (v01.21w) — the `rh-status` ✅/📤 emoji per History row (history only lists saved receipts) and its CSS rule

## [v01.39r] — 2026-08-01 11:52:43 PM EST — [a6732a4](https://github.com/LightAISolutions/Sales/commit/a6732a4a1022f09d68ee3cef4e6ce62ada5637c0)

> **Prompt:** "implement the same filter related changes to the Receipt History section. Also, in the Reports section, move the circle graph checkbox out of the collapsible filter area. I want to be able to easily switch between the bar and circle graphs."

### Changed

- `Receipts.html` (v01.20w) — History filters moved into a collapsible `#rh-filter-body` drawer (collapsed by default), mirroring the Reports pattern: sticky `.rh-head` now holds only the title, the "Viewing" shared-view row, and the `#rh-filter-head` toggle row (~89px vs ~250px pinned). The `⬇️ Export .xlsx` button stays on the pinned toggle row (action, not a filter) with a click guard so it doesn't toggle the drawer; new `rhFilterHint()` shows "n active" for search/dates/category (sort order not counted — it reorders, doesn't narrow)
- `Receipts.html` (v01.20w) — Reports' Circle graphs checkbox moved out of the filter drawer onto the always-pinned `#rp-filter-head` row (new `#rp-circle-wrap` with a click guard in the drawer-toggle handler), so bar ↔ circle switching is one tap without opening filters

## [v01.38r] — 2026-08-01 11:44:33 PM EST — [04bbb0f](https://github.com/LightAISolutions/Sales/commit/04bbb0fe9514eeac922ebd1e886ac4736298856e)

> **Prompt:** "in the Reports section, over half of the screen is freeze-paned, so it is not visually comfortable to use. Make the filters collapsible and start collapsed by default. Re-size as needed with focus on user comfort."

### Changed

- `Receipts.html` (v01.19w) — Reports filters moved out of the sticky `.rp-head` into a new collapsible `#rp-filter-body` drawer (collapsed by default): only the title, period tabs, shared-view "Viewing" row, and a slim `#rp-filter-head` toggle row stay pinned, shrinking the freeze-pane from ~380px to ~132px at 390px width. The toggle row reuses the report groups' `.rp-sec-toggle` +/− circle; when open, the drawer scrolls with the report content
- `Receipts.html` (v01.19w) — New `rpFilterHint()` shows an "n active" accent hint on the collapsed Filters row (merchant/category/subcategory/dates/min/max counted), called at the top of `renderReport()` before the `rpData` guard so it stays accurate even before data loads
- `Receipts.html` (v01.19w) — Report card max-height increased from `calc(100dvh - 170px)` to `calc(100dvh - 120px)` for ~50px more visible report content

## [v01.37r] — 2026-08-01 11:34:35 PM EST — [fa9e4cf](https://github.com/LightAISolutions/Sales/commit/fa9e4cfad1ccddf9335eae1fc87e16f02c1b0ae3)

> **Prompt:** "In order for me to approve new users via the admin panel, I need to be able to click it. Currently, it's being blocked by whichever layer my email (jonyang92@gmail.com) is on. Reformat things so that I can access the admin panel." *(with a desktop screenshot showing the GAS layer's ADMIN badge hidden behind the signed-in email display)*

### Fixed

- `Receipts.gs` (v01.14g) — Admin badge was unclickable: the GAS-served page pinned both `#user-email` (z-index 9999) and `#admin-badge` (z-index 100) to the same fixed top-left corner, so the email row painted over the badge and swallowed its clicks. The badge (with its `#admin-dropdown-gas`) now lives inside the `#user-email` flex row after the live-status pills, wrapped in a new `#admin-wrap` (position: relative) that anchors the dropdown directly beneath the badge — inline flow makes overlap structurally impossible
- Dropdown first-click no-op: the toggle compared `dd.style.display === 'none'`, but the initial inline style is `''` (CSS supplies the `none`), so the first click set `none` and did nothing visible. Toggle now checks `=== 'block'`, opening on the first click
- Mobile safety: `#user-email` capped at `calc(100vw - 16px)` with ellipsis truncation on `#user-email-text`, so the email + Live/presence pills + ADMIN badge stay on one row inside the 30px top band at 390px widths

## [v01.36r] — 2026-08-01 09:57:44 PM EST — [c28adf3](https://github.com/LightAISolutions/Sales/commit/c28adf3e32a00f80e387186a97eb0a70891a6343)

> **Prompt:** "I successfully added the ".../auth/drive.file" scope to the scopes list and made sure each family member's Gmail is in the test-users list. I also successfully completed your recommended next step - everything worked. 
>
> After scanning a receipt, the progress bar gets replaced by the positive affirmations. Do not do that. Also, there is an unloaded icon next to the progress status. I want this progress status and bar to look cute, artsy, and match the existing theme. Give me several mockups to choose between. 
>
> Also, now that all receipt pictures get saved to the user's Drive's "Receipt App" folder, migrate the existing 29 receipt pictures from LightAISolution@gmail.com's Drive to jonyang92@gmail.com's Drive. 
>
> Also, create a sign in/out mechanism, so that other users don't need to use the hidden R button to sign out. Make sure it matches the existing theme and still looks professional.
>
> Also, just like how the Groceries category has 16 departments, refer to apps like ReceiptCamp, Expensify, and Smart Receipts, and populate the other categories (Dinings, Transport, ... , Travel) with relevant subcategories that are also hidden until their linked category is chosen. 
>
> If the above are executed without any problems, then continue with Phase 4." *(Progress design choice via AskUserQuestion: "A, but also add a progress bar above the stage stamps.")*

### Added

#### `Receipts.html` — v01.18w

##### Added
- "Stamp Card" progress UI (developer-chosen mockup A + bar): the existing progress bar sits above four coffee-card stage stamps (📷 Snap → ☁️ Save → ✨ Read → 🧾 Done) that ink to ✓ as the pipeline advances, with a pulsing accent ring on the active stage; `setProgress(pct, stage)` drives both (explicit stage passed by the batch path whose bar spans the whole batch), all hidden together on completion
- Visible account row at the panel foot (`#rsp-account`): signed-in email + link-style "Sign out" / "Sign out everywhere" wired to the template's `performSignOut` flows — no hidden hotspot needed
- One-time background legacy-photo migration (`migrateLegacyPhotos`): lists the user's org-Drive photos, streams each via `getLegacyPhotoBase64`, re-uploads into the user's own "Receipts App" folder, re-links the row via `completePhotoMigration`; per-account localStorage completion flag, quiet status updates, retries next session on failure; `uploadToOwnDrive` gained a mime parameter
- Per-category `SUBCATS` map (Groceries departments unchanged; Dining/Transport/Health/Shopping/Entertainment/Utilities/Travel/Other lists modeled on Expensify/Smart Receipts): review-card item selectors repopulate on category change (off-list values preserved as extra options), Reports' subcategory dropdown + drill-down section now work for every category ("By department" label kept for Groceries, "By subcategory" otherwise)

##### Fixed
- Affirmations no longer talk over a running pipeline (suspended while the scan/batch is active) and now retire the finished progress bar + stamps when they resume; the broken thumbnail `<img>` next to the status ("unloaded icon") was removed along with its wiring

#### `Receipts.gs` — v01.13g

##### Added
- Migration ops on both transports: `listLegacyPhotos` (owner-scoped; a photo is "legacy" iff the script can open it), `getLegacyPhotoBase64` (8MB cap), `completePhotoMigration` (validated Drive URL, row re-link, org copy trashed)
- `ITEM_CATEGORIES` expanded to the union of all per-category subcategory lists (the Gemini extraction enum); extraction prompt updated to pick subcategories matching the receipt's category

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — migration flow section added, extraction subcategory note updated (mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright: account row appears with the session email, Dining subcats populate and survive a Travel switch with value preserved, Reports shows the per-category dropdown + "By subcategory" section, the mocked 2-photo migration ran end-to-end (list → bytes → own-Drive upload → re-link) and set its completion flag, and the Stamp Card was driven through active → all-done → auto-hide by the real pipeline; zero page errors

## [v01.35r] — 2026-08-01 08:11:26 PM EST — [038a514](https://github.com/LightAISolutions/Sales/commit/038a5145e5249046e07e930d04f09db397630fd9)

> **Prompt:** "I verified that the access granting functionality works both ways (giving and receiving permission). Continue with Phase 3."

### Added

#### `Receipts.html` — v01.17w

##### Added
- Own-Drive photo storage: `AUTH_SCOPES` constant adds the non-sensitive `drive.file` scope to all six GIS token clients (each marked `PROJECT OVERRIDE`); new Drive client module — `_getDriveToken` (reuses `_ssoAccessToken`, silent GIS re-request otherwise), `ensureDriveFolder` (Profiles-tab lookup → auto-create "Receipts App" folder → `setProfileFolder` registration), `driveMultipartUpload` via `uploadToOwnDrive`, and best-effort `driveRenameFile` / `driveTrashFile`
- Pipeline rework (single-scan `handleFile` + batch `step`): compress → browser uploads the photo to the user's own Drive → `uploadReceipt` link-registration → `extractReceiptData` from the bytes (throttling preserved via the generalized `extractFor`); **automatic fallback** to the legacy base64 → org-Drive path whenever the Drive token/consent/upload fails, so no photo is ever lost; Retry re-extracts from held bytes (`currentB64`; batch entries keep bytes only for failed extractions to limit memory)
- Save renames the own-Drive photo to the final receipt ID; delete moves it to the user's Drive trash — both via the user's own token, both best-effort (`_drivePhotoByReceipt` map; server-side rename/trash still covers legacy org-Drive rows)

#### `Receipts.gs` — v01.12g

##### Added
- `Profiles` tab (Email, Drive Folder ID, Display Name, Created At) + `getProfile` / `setProfileFolder` ops (folder-ID format validated) on both transports
- `extractReceiptData(sessionToken, imageBase64, mimeType)` — Gemini extraction straight from bytes with an MD5-digest cache (no Drive read); shared `geminiExtractFromBase64_()` core refactored out of `extractReceipt`, which keeps its file-ID path for legacy rows
- `uploadReceipt` dual mode: `imageUrl` link-registration (validated `drive.google.com` prefix, no bytes, GET-fallback-capable) alongside the unchanged legacy base64 path

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — pipeline diagram reworked for own-Drive storage (browser→Drive upload, link registration, bytes-based extraction, per-side rename/trash notes; mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright end-to-end with mocked Drive + GAS endpoints driving the real pipeline — own-Drive path (getProfile → folder create → setProfileFolder → multipart upload → link-mode uploadReceipt with no image bytes → extractReceiptData → review card → save → rename PATCH) and the fallback path (Drive failing → legacy base64 uploadReceipt → extractReceipt by file ID) both confirmed; zero page errors

## [v01.34r] — 2026-08-01 07:51:32 PM EST — [f6241f6](https://github.com/LightAISolutions/Sales/commit/f6241f6017d4aa626fc5e6e16ef9beffd78ac8cc)

> **Prompt:** "I verified on my phone that History, Reports, and the month card still show all my receipts. Continue with Phase 2."

### Added

#### `Receipts.gs` — v01.11g

##### Added
- `Shares` tab (Owner → Grantee, scope `view`/`edit`, timestamp) with `listShares` / `addShare` (upsert, email-format check, self-share block, 20-grant cap) / `removeShare` ops on both transports
- `resolveOwnerScope_()` + `getShareScope_()` — every read op (`listReceipts`, `getReceiptDetail`, `reportReceipts`, `exportReceipts`) accepts an `owner` param resolved through the grant table; `saveReceipt` accepts it too but demands an `edit` grant; `deleteReceipt` deliberately takes no owner param (owner-only); `getReceiptDetail` responses carry `canEdit` + `owner` for the UI

#### `Receipts.html` — v01.16w

##### Added
- "🤝 Sharing" landing button (side-by-side with History) + sharing card (z-index 9): grant-by-email form with view / view+edit scope, revoke buttons, "shared with me" list, mapped error messages (`bad_email`, `cannot_share_with_self`, `share_limit`)
- "Viewing" selector rows in History (`#rh-owner`) and Reports (`#rp-owner`) — hidden until `listShares` returns received grants; selections thread `owner` into list/detail/report/export calls
- Shared-view guardrails: delete buttons hidden on shared views, the History-detail Edit button suppressed when `canEdit` is false, `editingOwner` threaded into the edit-in-place save, and the month-card refresh no longer clobbers the reports dataset while a shared view is open

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — sharing flow added to the pipeline diagram (mermaid.live URL regenerated + decompression-verified); share card added to the HTML layer-toggle element list

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright interaction test at 390px with mocked share data through the real code paths — grant/revoke round-trip, "Viewing" selectors appear only with received grants, shared list hides delete, view-only shared detail suppresses Edit, and the wire calls carry `owner` exactly when a shared view is active; zero page errors

## [v01.33r] — 2026-08-01 07:38:37 PM EST — [04a3cc6](https://github.com/LightAISolutions/Sales/commit/04a3cc67239c790222bcafb46e008b8339fa4a04)

> **Prompt:** "continue with your recommendation" *(executes Phase 1 — data isolation — of the approved multi-user action plan from the preceding research response)*

### Added
- `googleAppsScripts/Receipts/Receipts.gs` (v01.10g) — multi-user data isolation. The existing "Uploaded By" column is now the receipt's owner: `listReceipts`, `getReceiptDetail`, `reportReceipts`, `deleteReceipt`, `saveReceipt`, and `exportReceipts` are all scoped to the signed-in user's own rows (ownership misses respond `receipt_not_found` so existence never leaks across accounts); `saveReceipt`'s duplicate detection is per-owner
- `backfillReceiptOwners_()` — one-time flag-guarded (`RECEIPT_OWNER_BACKFILL`) lazy migration stamping `RECEIPTS_LEGACY_OWNER` into blank Uploaded By cells, triggered from `listReceipts`/`reportReceipts`
- Monthly Summary tab rebuilt per-owner (new leading `Owner` column, rows sorted owner → month desc); the .xlsx export copies only the requesting user's summary rows and drops the Owner column to keep the familiar layout

### Removed
- `syncDriveFolderAccess_()` and its `listReceipts` call — the ACL → photo-folder viewer sync granted every ACL member viewer access to the shared photos folder, which becomes a cross-user privacy leak under multi-user isolation (removal pre-approved in the action plan). Previously granted folder viewers are NOT auto-revoked — manual Drive cleanup recommended

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — pipeline diagram updated: owner-scoped reads, owner backfill in the lazy-migration step, folder-sync interaction removed (mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs`; no remaining references to the removed sync function; server-side-only change (no UI modification, visual test not applicable per the trigger list)

## [v01.32r] — 2026-08-01 07:04:39 PM EST — [1737e9e](https://github.com/LightAISolutions/Sales/commit/1737e9e2775150ea8eacec2cd7c60a443a9d3572)

> **Prompt:** "[screenshot attached] The hidden R button only hides the HTML and GAS buttons at the bottom. I want the hidden R button to also hide the sections I circled in red in the attached picture."

### Changed
- `live-site-pages/Receipts.html` (v01.15w) — the "R" hotspot now toggles a body-level `rcpt-clean` class (on by default) whose `!important` CSS rule hides all six developer/technical pills: `#user-pill` (email + Sign Out / Sign Out All), `#auth-timers` (session countdown), `#gas-pill` (GAS version), `#version-indicator` (HTML version), and the two layer-toggle pills. The class approach replaces the previous per-element inline-style wrappers (`_showGasToggle`/`_hideGasToggle` gating removed) — it outranks the template's inline `display` changes after sign-in and automatically covers the dynamically-created version pill, which inline juggling could not

### Verified
- `node --check` on both inline scripts; Playwright at 390px with the signed-in pill states simulated — all pills hidden by default, all revealed on "R" tap (user pill flex, timers/GAS pill block, both toggles block), all re-hidden on second tap; zero page errors. The HTML version pill is created only after a successful version fetch (impossible under `file://`) but is governed by the same ID-based CSS rule in production

## [v01.31r] — 2026-08-01 06:53:29 PM EST — [00a532a](https://github.com/LightAISolutions/Sales/commit/00a532a9e7d75a0b3b6f5b4846148f5e95bd8958)

> **Prompt:** "One more change:
>
> * Change front-end display to include a hidden button on the letter "R" in the word "Receipts" on the home screen that I can press to toggle on/off the HTML and GAS layer. I want the app to look clean to other users and still allow me to toggle these layers on for myself."

### Added
- `live-site-pages/Receipts.html` (v01.14w) — hidden developer hotspot: the "R" of the brand heading is wrapped in `#rsp-r-secret` (no visual affordance, tap-highlight suppressed); tapping it shows/hides the `#html-layer-toggle` and `#gas-layer-toggle` pills, which now start hidden for everyone. The template's post-sign-in `_showGasToggle()` / sign-out `_hideGasToggle()` are wrapped so GAS-pill eligibility is tracked but the pill only surfaces while the hotspot state is on

### Fixed
- `.rsp-brand span` date styling narrowed to `#rsp-date` — the generic selector was also hitting the new "R" span, rendering it small/italic (caught by the Playwright screenshot before commit)

### Verified
- `node --check` on both inline scripts; Playwright at 390px — pills hidden on load, still hidden after the template's simulated post-sign-in `_showGasToggle()`, both revealed on "R" tap (HTML pill toggles the receipts layer correctly), both hidden again on second tap; heading renders with a uniform "Receipts" wordmark; zero page errors

## [v01.30r] — 2026-08-01 06:08:39 PM EST — [7481bec](https://github.com/LightAISolutions/Sales/commit/7481beced14f9cea20800f50139cbbd68f30ff85)

> **Prompt:** "A few more changes: 
>
> * In the Reports section:
>    * Hide the "All departments" drop-down menu until "Groceries" are chosen in the "All categories" drop-down menu. 
>    * Change "Circle graphs (percentage comparison)" to "Circle graphs".
>    * After checking the "Circle graphs" option, I notice that only 8 data groups are included before the rest are grouped under "Other". Reformat the circle graphs such that the circle graph itself is larger and located above the index breakdown of different data groups. Then, allow each circle graph to include up to 20 data groups that keep extending downwards. I like the current data group format of "Group name, Percentage, USD Amount", so keep this structure."

### Changed
- `live-site-pages/Receipts.html` (v01.13w) — `#rp-subcat` (departments dropdown) starts `display:none` and is toggled by a dedicated `#rp-cat` change listener: visible only when the selection is `Groceries`; on any other selection it hides and clears its value (with a re-render) so no invisible line-item filter lingers
- Circle-graphs checkbox label shortened to "Circle graphs"
- Donut layout restructured: `.rp-donut-wrap` is now a column (large `min(210px, 62vw)` donut centered on top, full-width legend below extending downward); slice cap raised 8 → 20 before the "Other" fold; legend row format unchanged (swatch · name · percent · amount)

### Verified
- `node --check` on both inline scripts; Playwright at 390px with intercepted `reportReceipts` demo data (12 categories) — departments dropdown hidden on load, visible for Groceries, hidden + cleared on switch to Dining; 12 legend rows render without an "Other" fold; large donut renders above the legend

## [v01.29r] — 2026-08-01 05:53:12 PM EST — [3457be2](https://github.com/LightAISolutions/Sales/commit/3457be259474c3ef4f008ba7e643ce6763e3466d)

> **Prompt:** "A few more changes:
>
> * In the Reports section:
>    * Change the Daily Totals format to the equivalent of "Wed, 7/29/26".
>    * Change the Weekly Totals format to the equivalent of "7/26/26 - 8/1/26".
>    * Change the Monthly Totals format to the equivalent of "July 2026".
>    * Change the Bi-annual Totals format to the equivalent of "First Half of 2026" and "Second Half of 2026".
>    * Add a "By Department" section under the "By Category" section in the report that only shows up when the user chooses "Groceries" in the "By Category" drop-down menu. 
>    * Minimize each of the reporting groups ("Daily Totals", "By Category", "By Department", "Top Merchants" until the user clicks a little "+" icon on the right side of the reporting group. 
>    * Add a checkbox option to show the reporting groups as circle graphs instead of bar graphs to see percentage comparisons. Make sure they also start off minimized until the user expands the reporting group."

### Added
- `live-site-pages/Receipts.html` (v01.12w) — "By department" report group (line-item department totals over the filtered receipts), rendered only when the `#rp-cat` category filter is `Groceries`; collapsible report groups (`rpSection()` header + right-side circled `+`/`−` toggle, `_rpOpen` state map — all groups start minimized on every card open, toggle state survives filter re-renders via a delegated `#rp-body` click handler that flips display in place); "Circle graphs (percentage comparison)" checkbox — sections render as stroke-dasharray SVG donuts (8-slice cap + "Other" fold, `RP_COLORS` palette) with a swatch/label/percent/amount legend instead of bars
- Period-label formatter `bucketLabel()`: daily "Wed, 7/29/26", weekly "7/26/26 - 8/1/26", monthly "July 2026", bi-annual "First Half of 2026" / "Second Half of 2026"

### Changed
- Weekly bucketing switched from ISO-8601 Monday-start keys (`isoWeekKey`, removed) to Sunday-start week-start-date keys (`weekStartKey`) so the displayed ranges match the requested Sunday–Saturday spans; `.rp-section` groups restyled as bordered sub-cards to carry the collapsible headers

### Verified
- `node --check` on both inline scripts; Playwright interaction test at 390×844 with intercepted `reportReceipts` demo data through the real renderer — verified all four label formats, department group appears only for Groceries (present with, absent without), groups start collapsed, `+`/`−` toggling, and 3 donut SVGs with percentage legends in circle mode; only expected `file://` console errors

## [v01.28r] — 2026-08-01 05:18:59 PM EST — [c850f48](https://github.com/LightAISolutions/Sales/commit/c850f48e3efa0045a510bf34d2526b5fc4c628bb)

> **Prompt:** "In my Receipts app, I want to make the following changes:
>
> * Add an Upload receipts button to allow for mass processing for up to X number of receipts at a time. Recommend a max number of receipts to be uploaded and explain to me why.
> * Add a Reports button that allows for the generation and real-time display of daily, weekly, monthly, bi-annual, and annual reports, and real-time filtering by merchant name, major categories (ie: Grocery) tied with minor categories (ie: Produce), date ranges, and total cost ranges.
> * Allow me to edit the line items in Receipt History, so I don't have to delete/re-upload everytime I want to delete a line that I should have deleted in the Review step. 
> * Improve the landing UI. I want this app to look professionally made with popular mobile UX/UI designs. Show me a couple designs and let me choose before you implement." *(Design choice via AskUserQuestion: "A, but remove the "Photograph or choose a receipt to upload sentence". Instead, cycle through "Love yourself", "You're the best!", "Today's gonna be a good day", and 10 more sentences like these.")*

### Added
- Batch "Upload receipts" flow (gallery multi-select, cap 15/batch), Reports card with real-time client-side filtering, and edit-in-place for saved receipts in History
- `reportReceipts` GAS op — compact receipts + line-items dataset powering the Reports card and the landing month summary

### Changed
- Receipts landing redesigned to the developer-chosen "Paper Ledger" theme (cream/ink serif design with printed-receipt month summary); idle status line now cycles 13 affirmations
- `repository-information/diagrams/Receipts-diagram.md` — pipeline sequence diagram extended with the batch upload, edit-in-place, and reports flows (mermaid.live URL regenerated + decompression-verified)

#### `Receipts.html` — v01.11w

##### Added
- `#receipt-upload-input` (`multiple`, no `capture`) + sequential batch engine: per-photo compress → `uploadReceipt` → `extractReceipt` with ≥6.5s spacing between extraction calls (Gemini free-tier ~10 RPM), `MAX_BATCH = 15`, queue-stepped review cards with a "· n of N" position chip; Save/Discard advance the queue
- `#receipt-report-card` (z-index 8): Daily/Weekly/Monthly/Bi-annual/Annual segmented control, merchant/category/department/date-range/cost-range filters (all client-side over one `reportReceipts` fetch → instant re-render), summary chips, per-period bars, category breakdown, top merchants; minor-category mode switches totals to matching line-item amounts
- "✏️ Edit receipt / line items" button in each History detail — reopens the review card pre-filled from `getReceiptDetail` and re-saves via the idempotent `saveReceipt`, returning to a refreshed History list
- `#rcpt-month` landing hero (perforated-edge month summary fed by `reportReceipts`, refreshed after saves/deletes) and `#receipt-backdrop` full-screen cream layer wired into the template's HTML layer toggle via a project-side wrapper

##### Changed
- Full "Paper Ledger" restyle of the PROJECT CSS (theme variables `--rc-*`, serif type, monospace numerals, ink buttons); PWA `theme-color` → `#e9e3d6`; review/history/report cards raised to `top: 76px` with `calc(100dvh - 170px)` height; history date column widened to fix wrapping
- Idle status text replaced by a 13-sentence affirmation rotation (7s cycle; real status messages linger 12s before rotation resumes); status colors moved to theme palette

#### `Receipts.gs` — v01.09g

##### Added
- `reportReceipts(sessionToken, dateFrom, dateTo)` — all saved receipts (id, date, merchant, currency, total, category; cap 2000) plus their LineItems rows (receiptId, description, amount, category); routed in `doPost` and the `doGet` `action=api` fallback chain

### Verified
- `node --check` on the `.gs` and both inline page scripts; Playwright at 390×844 — landing, Reports, batch-position review card, and History detail with Edit button all render correctly in the new theme; only expected `file://` console errors

## [v01.27r] — 2026-08-01 06:51:35 AM EST — [b90dd37](https://github.com/LightAISolutions/Sales/commit/b90dd37187facddbbd3ef58fa809244979b1abf4)

> **Prompt:** "In Receipt History, label the "Start Date" and "End Date" boxes in the same way as the "Search merchant" box is labeled. Also, keep the "Start Date" and "End Date" boxes side-by-side, but move them below the "Search merchant" box. Also, add a drop-down menu that filters between the major categories: Groceries, Dining, Transport, Health, Shopping, Entertainment, Utilities, Travel, and Other."

### Added
- Category filter for receipt history and export

#### `Receipts.html` — v01.10w

##### Added
- Full-width `#rh-cat` dropdown row in the history card, populated from the existing `CATEGORIES` array with a blank "All categories" option; sends `cat` on both `listReceipts` and `exportReceipts` calls and reloads on change

##### Changed
- History filter rows restructured: row 1 = merchant search + Search button; row 2 = "Start Date"/"End Date" boxes side-by-side, each with a small `.rh-field` label above (date inputs can't show placeholder text like the search box, so field labels are the matching treatment); row 3 = category dropdown

#### `Receipts.gs` — v01.08g

##### Added
- `category` parameter on `listReceipts` (exact match on the Category column, applied server-side before the row cap) and threaded through `exportReceipts` → internal `listReceipts` call; `cat` parameter wired into all four transport routes (POST + GET fallback for both ops)

### Verified
- `node --check` on the `.gs` and all inline scripts; Playwright at 390px — labels "Start Date"/"End Date" render above the side-by-side boxes, dropdown lists all 9 categories + "All categories", no horizontal scroll, zero page errors

## [v01.26r] — 2026-08-01 06:36:33 AM EST — [658cce8](https://github.com/LightAISolutions/Sales/commit/658cce8c1313516baaf5c159415a01f2146a6d40)

> **Prompt:** "Everything works. Also, remove the checkbox for "Show unsaved uploads". I think it's redundant now that I will never upload a receipt without saving."

### Removed
- "Show unsaved uploads" checkbox from the history card (`live-site-pages/Receipts.html` v01.09w): markup, its change listener, and the `uploaded` parameter from the history-load and export calls — the UI is saved-only. The server-side `uploaded` parameter on `listReceipts`/`exportReceipts` is intentionally retained (harmless capability; the client simply no longer sends it), so unsaved rows remain reachable via the spreadsheet if ever needed

### Verified
- Zero `rh-show-uploaded` references remain; `node --check` on all inline scripts; Playwright render — sort checkbox and export button intact, zero page errors

## [v01.25r] — 2026-08-01 06:25:29 AM EST — [526aa58](https://github.com/LightAISolutions/Sales/commit/526aa5850995b78c5259761c2f07e030f8297a3a)

> **Prompt:** "I tested the 2 actions and both work as intended. 1. In the Receipt History, standardize merchant names to be: capitalize the first letter of each word with the rest lower-case (ie: Trader Joe's instead of TRADER JOE'S). 2. In the Receipt History, when I try to "view photo", it says that "jonyang92@gmail.com" doesnt have access to the file. I assume it's because the folder is on "LightAISolution@gmail.com"'s Drive. I would like for this folder's permissions to be synced to my MasterACL file's permissions. For example, if I give a new email Admin access to my Receipts app via the MasterACL spreadsheet, I want that email to automatically get access to this Receipt Pictures folder. Make the changes necessary so that this can happen." *(screenshots: history with mixed-case merchants; Drive "you need access" page for jonyang92@gmail.com)*

### Added
- **Drive folder ↔ Master ACL permission sync** (`googleAppsScripts/Receipts/Receipts.gs` v01.07g): `syncDriveFolderAccess_()` reads the Access tab (col A emails, Receipts column TRUE, metadata rows skipped via the @-check), grants VIEWER on the photos folder to every authorized user, and revokes viewers whose grant was removed — the folder owner and manually-added editors are never touched. Runs from `listReceipts` (first thing opened before viewing photos), throttled via CacheService to once per 10 minutes; best-effort with the app's session auth as the real gate

### Changed
- **Merchant standardization**: `titleCase_()` (capitalize each word start incl. after hyphen/slash, rest lower-case, apostrophes preserved — "TRADER JOE'S" → "Trader Joe's") applied to `data.merchant` at save time; migration upgraded to **v3** (flag `RECEIPT_ID_FORMAT=v3`): title-cases all saved merchants in place and regenerates `Store_Name-YYYYMMDD` IDs + LineItems references + Drive photo names where the standardized name changes them (collision-suffix-only differences keep the existing ID)
- Pipeline diagram history flow updated (v3 migration + folder ACL sync; pako URL regenerated, decompression-verified)

### Verified
- `node --check` on the `.gs`; `titleCase_` behavior checked against real merchant strings (TRADER JOE'S → Trader Joe's, MEGA MART → Mega Mart, cvs/pharmacy #123 → Cvs/Pharmacy #123, seven-eleven → Seven-Eleven)

## [v01.24r] — 2026-08-01 06:06:54 AM EST — [5c15b04](https://github.com/LightAISolutions/Sales/commit/5c15b048d44b37016ad536a3848641f3e4e968fc)

> **Prompt:** "I tested all 6 actions and they all worked as intended. Go with your suggested supermarket department taxonomy (16 departments). I want per-item editing in the review screen."

### Added
- Per-item department editing in the review screen (`live-site-pages/Receipts.html` v01.08w): each line item is now a two-line block — inputs row + a compact department `<select>` (`.rr-cat`, client `ITEM_CATS` mirrors the GAS `ITEM_CATEGORIES` 16-department enum) pre-selected from Gemini's auto-assignment; `collectReview()` includes `category` per item

### Fixed
- Extracted per-item categories were being dropped on save — the review UI didn't carry them, so `collectReview()` sent items without `category` and `saveReceipt` stored empty strings. The dropdowns now carry the extraction values (edited or not) through to the LineItems tab and the export

### Verified
- `node --check` on all inline scripts; Playwright at 390×844 — three item blocks with departments Produce/Pantry/Beverages set via the real Add-item path, selects render under each row, no horizontal scroll, zero page errors. GAS untouched (v01.06g unchanged — `saveReceipt` already persisted `it.category`)

## [v01.23r] — 2026-08-01 05:28:51 AM EST — [3bcdf30](https://github.com/LightAISolutions/Sales/commit/3bcdf306b4d047f260dab9a14c095e76bc1a0a71)

> **Prompt:** "I tested all three actions and everything works as intended. Currently, the receipt history shows the receipts based on upload order; Create a checkbox option to show the receipts chronologically based on the receipt dates instead of upload order. Also, reformat the default "Receipt ID"s to "Store_Name-YYYYMMDD"; Update the existing receipts' IDs to match. Also, currently, the status (uploading, extracting, saved, etc) window is to the right of the "History" button; Move the status window below the "Scan Receipt" and "History" buttons and add a progress bar that makes sense for this application. Also, when extracting, record the store address as well. Also, in the exported excel spreadsheet tab "LineItems", make it easy to distinguish and switch between the different receipts. After executing the above, continue with Phase 5: automatic spending categories (assigned during extraction), a monthly-summary tab, duplicate-receipt detection. Regarding the automatic spending categories, refer to existing apps like ReceiptCamp, Expensify, and Smart Receipts to figure out the best categories to use to cover the entirety of grocery store items."

### Added
- **Readable receipt IDs** (`googleAppsScripts/Receipts/Receipts.gs` v01.06g): `makeReceiptId_()` builds `Store_Name-YYYYMMDD` (sanitized merchant, collision suffix `-2`/`-3`), assigned at save time since merchant/date are unknown at upload; the Drive photo is renamed to match; one-time lazy migration (`migrateReceiptIds_()`, Script-Properties-flag + LockService guarded, triggered from `listReceipts`) renames all existing saved receipts, their LineItems rows, and photos
- **Store address**: added to the Gemini schema, new "Store Address" column (in-place header upgrade for existing sheets), editable field in the review card (`live-site-pages/Receipts.html` v01.07w), shown in history detail (📍) and the export
- **Progress bar + status relocation**: status line moved below the Scan/History buttons; stepped bar tracks Compressing (15) → Uploading (40) → Extracting (70) → Done (100, green) and Saving (85) → Saved (100); cards shifted down (top 128px) to clear the taller panel
- **"Sort by receipt date" checkbox** — server-side sort in `listReceipts` (`sort=date`, newest printed date first, undated rows last)
- **Phase 5a — automatic per-item categories**: `ITEM_CATEGORIES` (16 supermarket departments: Produce, Meat & Seafood, Dairy & Eggs, Bakery, Deli & Prepared, Frozen, Pantry, Snacks & Candy, Beverages, Alcohol, Household, Personal Care, Baby, Pet, Non-Grocery, Other) assigned by Gemini per line item via schema enum; stored in a new LineItems "Category" column, shown in history detail and the export. Reference apps (Expensify/Smart Receipts style) verified via web search to use merchant-level buckets only, so item level uses standard supermarket department taxonomy
- **Phase 5b — Monthly Summary tab**: `rebuildMonthlySummary_()` aggregates saved receipts per month (count, total, per-receipt-category totals), rebuilt on every save/delete and mirrored as a third sheet in the export
- **Phase 5c — duplicate detection**: `saveReceipt` rejects a save matching another saved receipt's merchant+date+total with `{error: 'duplicate', duplicateOf}`; the review card warns and the next Save press sends `force=1` ("save anyway")

### Changed
- **Export LineItems readability**: items grouped per receipt under bold banded header rows (store · date · total) with alternating block colors and blank separators; Receipt ID column retained for filtering; Receipts sheet gains the Store Address column; export response count fixed to actual item rows
- Receipt Pipeline diagram updated with ID assignment, duplicate check, address, summary rebuild, sort and migration steps (pako URL regenerated, decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright at 390×844 and 390×700 — status+progress render below the buttons, review card (with address) no longer overlaps the taller panel, sticky Save still visible; zero page errors

## [v01.22r] — 2026-08-01 04:38:48 AM EST — [af6ca3e](https://github.com/LightAISolutions/Sales/commit/af6ca3ef0589340f9f07b1a65fc589b9391ae6a0)

> **Prompt:** "History works, but I want you to only show "saved" receipts by default. Add a checkbox option to show uploaded but unsaved receipts. Also, give me an option to delete records as well. Meanwhile, continue with Phase 4."

### Added
- **Record deletion** (`googleAppsScripts/Receipts/Receipts.gs` v01.05g, `live-site-pages/Receipts.html` v01.06w): GAS `deleteReceipt` route removes the receipt row + its LineItems rows and trashes the Drive photo (fileId parsed from the stored URL; recoverable ~30 days). Enforces the RBAC `delete` permission when the ACL's roles are configured (empty permission set falls back to session-only gating, matching other write routes). Client-side: per-row 🗑 with a two-tap inline confirmation (arm → "Delete?" → 4s auto-disarm) — no browser `confirm()` per the repo's UI Dialogs rule
- **Receipts Phase 4 — .xlsx export**: GAS `exportReceipts` builds a temp two-sheet spreadsheet (Receipts incl. subtotal/tax/total pulled per-ID, LineItems for the matching IDs), exports it via the Drive endpoint with `ScriptApp.getOAuthToken()`, trashes the temp file (in a `finally`), and returns `{fileName, base64}`; "⬇️ Export .xlsx" button downloads it as a Blob using the current history filters
- "Show unsaved uploads" checkbox in the history filter header

### Changed
- History now defaults to **saved receipts only** — `listReceipts` gained a status filter (`uploaded=1` includes unsaved rows), wired to the checkbox
- Delete + export flows appended to the Receipt Pipeline diagram (pako URL regenerated, decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render at 390×700 — checkbox, export button, idle 🗑 and armed "Delete?" states all visible, no horizontal scroll, zero page errors

## [v01.21r] — 2026-08-01 04:12:06 AM EST — [01c10e1](https://github.com/LightAISolutions/Sales/commit/01c10e1486534aefa5f65b4181ea1119726031d4)

> **Prompt:** "I re-scanned the Trader Joe's receipt and it successfully saved. I then tried a long MegaMart receipt and it also succeeded, but the extraction took close to 10 minutes. Is there any way to speed up this process? Meanwhile, continue with Phase 3."

### Fixed
- **~10-minute extractions** (`googleAppsScripts/Receipts/Receipts.gs` v01.04g): root cause was the fetch transport double-running the work — the POST leg ran the full extraction, Google returned an unparseable error page, and the GET fallback re-ran everything. Three changes: (1) extraction results now cached server-side by fileId (`CacheService`, 10-min TTL) so a second transport leg returns instantly; (2) `gemini-3.6-flash` promoted to primary (faster generation; the observed 503 congestion was on 3.5-flash, now the fallback); (3) retry plan trimmed 4 → 3 attempts to bound worst-case wall time

### Added
- **Receipts Phase 3 — history browser** (`Receipts.gs` v01.04g, `live-site-pages/Receipts.html` v01.05w): GAS `listReceipts` route (merchant substring + date-range filters, newest first, cap 500) and `getReceiptDetail` route (full fields + LineItems rows), both with POST + GET api fallbacks; HTML "🧾 History" button + history card (z-index 7, dvh-sized, sticky filter header) with search/date inputs, receipt list (status ✅/📤, totals), tap-to-expand cached details, and photo links; HTML-escaping helper for all rendered spreadsheet data
- History flows appended to the Receipt Pipeline sequence diagram in `repository-information/diagrams/Receipts-diagram.md` (pako URL regenerated and decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render of the history card with simulated rows + expanded detail at 390×700 (no horizontal scroll, zero page errors)

## [v01.20r] — 2026-08-01 03:51:49 AM EST — [a81c722](https://github.com/LightAISolutions/Sales/commit/a81c7221edc18a9bfd069ac763eee21eaff9a185)

> **Prompt:** "it successfully extracted the information, but after scrolling to the bottom, I cannot see nor click "Save Receipt". Resize this UI to make it more user friendly and possible to save receipts." *(screenshot: 12-item extracted receipt, card scrolled to "+ Add item" with the action row cut off below the visible screen)*

### Fixed
- Unreachable Save button on mobile (`live-site-pages/Receipts.html` v01.04w): the review card's `max-height` used `100vh`, which on mobile includes the area behind the browser URL bar — with long item lists the card's bottom edge (action row) landed below the visible screen. Now sized with `100dvh` (dynamic viewport height; `100vh` kept as older-browser fallback) plus extra bottom clearance above the version pills

### Changed
- Save/Discard/Retry row is now a **sticky action bar** pinned to the card's bottom edge (`position: sticky` with background + top border) — always visible and clickable regardless of scroll position; the fields and item list scroll underneath it

### Verified
- Playwright at 390×700 (short viewport simulating browser chrome) with a 12-item receipt: Save button inside the viewport and clickable via `document.elementFromPoint` both before and after scrolling the card's content; zero page errors

## [v01.19r] — 2026-08-01 03:17:05 AM EST — [faa2fe3](https://github.com/LightAISolutions/Sales/commit/faa2fe39fcd2049cd09660ec21b1bb2a7064eceb)

> **Prompt:** "I got the attached error message" *(screenshot: review card open in manual-entry fallback with `Extraction failed (gemini_http_503: This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.)`)*

### Fixed
- Transient Gemini 503 "high demand" failures (`googleAppsScripts/Receipts/Receipts.gs` v01.03g): `extractReceipt` now runs a 4-step retry plan — primary model twice (0s/2s waits), then `GEMINI_FALLBACK_MODEL = "gemini-3.6-flash"` twice (1s/3s waits) — retrying only transient statuses (503/429/500); non-transient errors (bad key, bad request) still fail fast to avoid burning quota

### Added
- "Retry extraction" button in the review card (`live-site-pages/Receipts.html` v01.03w): shown only when extraction fails; re-runs extraction against the already-uploaded Drive file (tracked via new `currentFileId`) and re-populates the card on success — no re-photographing needed

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render of the failed-extraction state at 390×844 (retry button visible, no horizontal scroll, zero page errors)

## [v01.18r] — 2026-08-01 03:07:59 AM EST — [4d2b91c](https://github.com/LightAISolutions/Sales/commit/4d2b91cb6596e5b661721265fd1f2c89be8048d5)

> **Prompt:** "The receipt picture was successfully taken and uploaded. Start phase 2."

### Added
- **Receipts Phase 2 — AI extraction + review-before-save** (`googleAppsScripts/Receipts/Receipts.gs` v01.02g, `live-site-pages/Receipts.html` v01.02w):
- GAS `extractReceipt` route (POST + GET api fallback; session-validated): reads the uploaded photo back from Drive by fileId and calls Gemini `generateContent` (`GEMINI_MODEL = "gemini-3.5-flash"`, key from Script Properties `GEMINI_API_KEY`) with a strict `responseSchema` returning merchant, date, currency, subtotal, tax, total, category (9-option enum), and lineItems[]; temperature 0; robust error mapping (`gemini_key_missing`, `gemini_http_*`, `gemini_parse_failed`)
- GAS `saveReceipt` route (body-POST only — reviewed JSON can exceed GET URL limits): fills the receipt's row by Receipt ID (date/merchant/currency/subtotal/tax/total/category), sets status `saved`, stores the raw extraction JSON for audit, and replaces the receipt's LineItems rows idempotently
- HTML review card (`#receipt-review-card`, z-index 6 — under the overlay walls like the scan panel): auto-opens pre-filled after extraction with editable fields + category dropdown + line-items grid (add/remove rows), Save/Discard actions; opens empty for manual entry when extraction fails; `uploadReceipt` now returns `fileId` to feed extraction
- New "Receipt Pipeline" sequence diagram section in `repository-information/diagrams/Receipts-diagram.md` (upload → extract → review → save; pako URL generated and decompression-verified)

### Verified
- Gemini model names verified against current documentation via web search (gemini-3.5-flash / gemini-3.6-flash, free tier); `node --check` on the `.gs` and all inline scripts; Playwright render of the populated review card at 390×844 and 1280×800 (no horizontal scroll, zero page errors)

## [v01.17r] — 2026-08-01 02:26:53 AM EST — [9f936c5](https://github.com/LightAISolutions/Sales/commit/9f936c5db38547c35bed3ee9eb3f2dbdd7709204)

> **Prompt:** "I approve the plan to PWA-ify the web app. I have also granted Receipts ACL permission to "jonyang92@gmail.com" and confirmed that the live page loads. LightAISolution's Drive folder ID is "1DHfXwzo0qXI_2H0Q2dDLKGn7EOtguI0A"."

### Added
- **Receipts Phase 1 upload pipeline** (`live-site-pages/Receipts.html` v01.01w, `googleAppsScripts/Receipts/Receipts.gs` v01.01g): "📷 Scan receipt" panel in the page PROJECT blocks — camera-direct capture on phones (`capture="environment"`), file picker on desktop, client-side canvas compression (max 1600px JPEG q0.82, EXIF-orientation-aware via `createImageBitmap`), thumbnail + status feedback. New `_gasPostBody()` transport variant sends the base64 image in a form-encoded POST body with 3-attempt retry (the template's `_gasPost` carries params in the URL — impossible at image sizes; no GET fallback exists for the same reason)
- GAS side: `uploadReceipt` route (`doPost action=uploadReceipt`, session-validated via `validateSessionForData`) decodes and saves the photo to the configured Drive folder and appends an "uploaded" row to the `Receipts` tab; idempotent `ensureReceiptTabs_()` bootstraps the `Receipts` + `LineItems` tabs (frozen headers) on first write — Phase 2's extraction will fill the remaining columns
- **PWA install support**: new `live-site-pages/receipts.webmanifest` + generated app icons (`images/receipts-icon-192.png`, `receipts-icon-512.png`, maskable) + manifest/theme-color/apple-touch head tags in `Receipts.html`; CSP `manifest-src` relaxed `'none'` → `'self'` in both CSP tags, marked with a `PROJECT OVERRIDE` comment
- `DRIVE_FOLDER_ID` added to `Receipts.config.json` and mirrored in `Receipts.gs` (config sync per [PC-GAS-CONFIG] #14)

### Verified
- `node --check` passes on the full `.gs` and every inline HTML script block; Playwright render checks at 390×844 and 1280×800 — panel centered with no horizontal scroll, zero page errors

## [v01.16r] — 2026-08-01 01:40:25 AM EST — [d00c587](https://github.com/LightAISolutions/Sales/commit/d00c58788b9ece6a630558c97f13b0a93db2c3ac)

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push. `bash scripts/setup-gas-project.sh <<'CONFIG' { "PROJECT_ENVIRONMENT_NAME": "Receipts", "TITLE": "Receipts", "DEPLOYMENT_ID": "AKfycbwASoUFzqdy3Bb-NbsbG6Hh3-9fPz1aGJGi8AbUsBV0YBu85ockXXdWkLKB8kEtivrb", "SPREADSHEET_ID": "1SfVRsHm6pUn1bq633BSKiQ8c3IsQeVAs7H0265ckdDM", "SHEET_NAME": "Live_Sheet", "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "INCLUDE_AUTH": true, "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com", "AUTH_PRESET": "hipaa", "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE", "ACL_SHEET_NAME": "Access" } CONFIG`"

### Added
- New auth GAS project **Receipts** (HIPAA preset) created via `scripts/setup-gas-project.sh` — 10 files: `live-site-pages/Receipts.html` (v01.00w), `googleAppsScripts/Receipts/Receipts.gs` (v01.00g), `Receipts.config.json`, html/gs version files, page + GAS changelogs with archives, and per-environment diagram `repository-information/diagrams/Receipts-diagram.md`
- Registered across the repo: GAS Projects table (`.claude/rules/gas-scripts.md`), README structure tree (page entry with version links + all subtree entries), REPO-ARCHITECTURE.md (RECEIPTS_PAGE + GAS_RECEIPTS nodes and template-source/iframe/serves/deploy/polling edges), and a `Deploy Receipts` webhook step in `.github/workflows/auto-merge-claude.yml`
- Live config wired in at creation: real deployment ID (obfuscated `_e` URL in the page verified against expected encoding), data spreadsheet (`Live_Sheet`), and real Master ACL spreadsheet ID in both `.gs` and `.config.json` — Global ACL Access-tab self-registration active on first page load

### Changed
- Regenerated the Flowchart and Class Diagram mermaid.live pako URLs in `repository-information/REPO-ARCHITECTURE.md` (both went stale when the setup script added the Receipts nodes) — decompression-verified, including the new `Receipts-diagram.md` link

## [v01.15r] — 2026-07-18 03:15:05 AM EST — [bd28564](https://github.com/LightAISolutions/Sales/commit/bd28564e0ba76ac0e3f3dc4002e1c17a57f14ac9)

> **Prompt:** "Create a 5 second animation of Spain vs Argentina in the 2026 world cup and show it on repeat."

### Added
- New standalone page `live-site-pages/spain-argentina.html` (v01.00w), created from `HtmlAndGasTemplateAutoUpdate-noauth.html.txt`: a pure-CSS 5-second Spain vs Argentina World Cup 2026 match animation that loops infinitely (`animation: … 5s … infinite`). PROJECT blocks contain a scoreboard (🇪🇸 ESP 0–0 ARG 🇦🇷), a striped pitch with halfway line/centre circle/boxes/goals, three Spain players (red/yellow), three Argentina players (albiceleste stripes incl. a diving keeper), a ⚽ ball that passes through midfield and finishes in Argentina's net, and a "GOAL!" flash at ~80% of the loop. No JavaScript added — the JS PROJECT block stays empty (animation is CSS-only); no GAS project
- New tracking files: `html-versions/spain-argentinahtml.version.txt` (`|v01.00w|`), `html-changelogs/spain-argentinahtml.changelog.md` + `spain-argentinahtml.changelog-archive.md`
- Registered the page in the README tree (Standalone Utilities group + html-versions/html-changelogs subtrees) and in REPO-ARCHITECTURE.md's flowchart (SPAINARG_PAGE node + serves/version-polling/template-copy edges; pako URL regenerated and decompression-verified)
- Verified via Playwright at two loop timestamps (~1.8s mid-play, ~4.2s GOAL flash); fixed an invalid `font:` shorthand (`inherit` family) found during the check by switching to explicit font-size/weight properties

## [v01.14r] — 2026-07-18 02:39:24 AM EST — [cc86b54](https://github.com/LightAISolutions/Sales/commit/cc86b54bfa3e65e51730eddecb14fe439587fbfd)

> **Prompt:** "In my Scraper project, remove the text box + submit button."

### Removed
- Scraper text-submission UI (`live-site-pages/Scraper.html` v01.04w): removed the text box + Submit button panel — the PROJECT-block CSS (`#text-submit-panel` and related rules), the panel markup, and the submit wiring JS (fetch `submitText` call, Enter-to-submit, inline status feedback). PROJECT START/END markers left in place (empty) for future page content. The GAS-side `submitText` route in `googleAppsScripts/Scraper/Scraper.gs` is intentionally retained unchanged (now unused) — removal not requested
- Verified via Playwright render check: page renders cleanly with no leftover panel or layout artifacts (the 5 pre-existing `file://` CSP logo-image refusals reproduce identically on the unmodified page)

## [v01.13r] — 2026-07-18 12:05:25 AM EST — [50449c4](https://github.com/LightAISolutions/Sales/commit/50449c4ba2dbaf36d2029a1aa8464bcfdbdf1670)

> **Prompt:** "In the Scraper project, create a text box with a submit button. When the user clicks submit, copy whatever they wrote in the text box into the spreadsheet."

### Added
- Scraper text submission feature (`live-site-pages/Scraper.html` v01.03w, `googleAppsScripts/Scraper/Scraper.gs` v01.04g): a top-center panel with a text box + Submit button in the page's PROJECT blocks (hidden behind the auth wall until sign-in; z-index 5 — above the GAS iframe, below all overlay walls). Submission goes over the iframe-free fetch transport to a new `PROJECT:`-marked `doPost action=submitText` route (with GET `api op=submitText` fallback) → `submitText()` in the PROJECT block, which validates the session via `validateSessionForData`, trims/caps input at 5000 chars, and appends `[timestamp, user email, text]` to `Live_Sheet` in the configured spreadsheet. Inline status feedback (Saving… / Saved ✓ / error), Enter-to-submit, button disabled while in flight
- Verified: GAS + HTML JS syntax parse, Playwright render check with simulated signed-in state (panel positioned correctly, no overlap with pills/overlays)

Developed by: ShadowAISolutions
## [v01.12r] — 2026-07-17 11:45:41 PM EST — [1d60d9f](https://github.com/LightAISolutions/Sales/commit/1d60d9f750f4b21a5e00240992bc65c5aafe15a6)

> **Prompt:** "I was able to pass the "Connect to server" issue from earlier, but i still cannot sign in. See attached screenshot."

### Fixed
- Embedded app screen blocked after successful fetch sign-in (Google Drive "Sorry, unable to open the file" inside the iframe + `action=securityEvent` 404 spam — the multi-account `/u/N` routing 404 hitting the remaining iframe loads): the `#gas-app` iframe and the hidden securityEvent frames are now created **credentialless** in `live-site-pages/MasterACL.html`, `Scraper.html`, `globalacl.html` (all v01.02w) and the auth HTML template — cookie-less iframes get Google's anonymous serving path (the same path verified working via server probes), while the session continues to travel in the `?session=` URL. Browsers without `credentialless` support ignore the attribute (prior behavior preserved). Flagged as a documented inference: anonymous serving, cookie removal, and anonymous GAS usage are each verified, but the combination inside a credentialless iframe is untested until the owner confirms in-browser

## [v01.11r] — 2026-07-17 10:05:56 PM EST — [c4d1bd3](https://github.com/LightAISolutions/Sales/commit/c4d1bd39eb9b7fa2846592e901e2bb46034234fa)

> **Prompt:** "Do the fetch conversion (your recommendation) AND address this: "The root-cause template defect (setup script generates `standard`-preset GAS against a hipaa-built HTML template) still awaits a permanent fix so future projects are born working" (your heads-up)."

### Added
- **Iframe-free `fetch` sign-in transport** ported from the `testauthgas1` scaffold into `live-site-pages/MasterACL.html` (v01.01w), `Scraper.html` (v01.01w), and `globalacl.html` (v01.01w): new `_gasPost()` (POST with GET `action=api` fallback), `exchangeViaFetch()`, `_mapExchangeError()`, `_completeSignInFetch()` (transport-verified direct show — no `gas-auth-ok` gate), plus fetch branches in `sendHeartbeat()`, the sign-out flow, and the page-load session restore (heartbeat-validated). `HTML_CONFIG.TOKEN_EXCHANGE_METHOD` → `'fetch'`. Cookie-less fetch always reaches Google's anonymous serving path, making the auth machinery immune to the blocked framed `/exec` responses (multi-account `/u/N` 404s, X-Frame-Options) that killed iframe sign-in in the owner's normal browser
- GAS routes for the transport in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.07g), `Scraper.gs` (v01.03g), `globalacl.gs` (v01.01g): `doPost action=exchangeToken` (with `ensureScriptProperties_()` bootstrap) and `action=signOut`, plus a general `doGet action=api` GET fallback (`exchangeToken`/`signOut`/`heartbeat` ops)

### Changed
- **Permanent template fix**: the same conversion applied to `live-site-pages/templates/HtmlAndGasTemplateAutoUpdate-auth.html.txt` and `gas-minimal-auth-template-code.js.txt` — future auth projects are born with the fetch transport, which no longer depends on the GAS preset's `TOKEN_EXCHANGE_METHOD`, dissolving the standard-vs-hipaa exchange mismatch permanently
- Template propagation note: `testauthgas1` (already the fetch reference) and `testauthhtml1` (intentionally the postMessage test scaffold) were left unchanged; the latent `processDataPoll` dead-route in the GAS template generation was left as-is (not referenced by the new routes)

### Verified
- Full-file JS syntax parse on all 4 GAS files and all inline script blocks of the 4 HTML files; Playwright `file://` smoke test on the 3 converted pages (only known file-protocol restrictions logged, zero code errors)

## [v01.10r] — 2026-07-17 09:22:12 PM EST — [489a824](https://github.com/LightAISolutions/Sales/commit/489a8249b496f5081e861611fda3c9b47f6687b1)

> **Prompt:** "@"/root/.claude/uploads/07152af2-7240-5bfb-8986-2eaa697523c9/af91e797-globalacl_working_sample_v01.89g.txt" See attached .txt file for a successful example. Compare this with my GAS code and update mine as needed to resolve my sign-in problem for "jonyang92@gmail.com". This example is being used for a different company, so scrub out anything specific and give me a working skeleton that can be applied to my GAS code."

### Changed
- Compared the uploaded working sample (globalacl v01.89g, other org) against our GAS code after scrubbing org-specific values: function inventories and the entire sign-in path are identical — the only functional configuration difference is that the working org runs `ACTIVE_PRESET: 'hipaa'`. Aligned `googleAppsScripts/MasterACL/MasterACL.gs` (v01.06g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.02g) to that proven skeleton: `ACTIVE_PRESET` → `'hipaa'`, `PROJECT_OVERRIDES` made byte-identical to the sample (`ENABLE_DOMAIN_RESTRICTION: false`, `ALLOWED_DOMAINS: []`, `SESSION_EXPIRATION: 7200`), removing the now-redundant `TOKEN_EXCHANGE_METHOD` override (hipaa's default is `postMessage`). The embedding HTML's own comments ("must match GAS PRESETS.hipaa...") confirm the auth HTML template was written for the hipaa preset — the setup script generating `standard`-preset GAS against it is the template defect. Session durations verified in sync both sides (7200/28800). The sample's `PROJECT:` doPost signOut wrapper was not ported (workspace-specific, unrelated to sign-in). Note: the browser-side multi-account `/exec` 404 (Google issue) remains — single-account session still required

## [v01.09r] — 2026-07-17 08:36:54 PM EST — [d726490](https://github.com/LightAISolutions/Sales/commit/d7264904ba3a82ef4d24ec76436f7710639ee986)

> **Prompt:** "I still cannot sign in as "jonyang92@gmail.com". Fix the problem."

### Fixed
- Sign-in timeout ("The sign-in service isn't responding") on MasterACL and Scraper: the auth HTML template hardcodes `TOKEN_EXCHANGE_METHOD: 'postMessage'`, but the GAS `standard` preset resolves it to `'url'` — the served shell had no postMessage token listener, so the OAuth token exchange never completed and the 25s reachability watchdog fired. Confirmed by probing the live `/exec` deployment (healthy, serving current code, correct `gas-needs-auth` handshake — ruling out deployment/OAuth-access causes). Fix: `TOKEN_EXCHANGE_METHOD: 'postMessage'` added to `PROJECT_OVERRIDES` in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.05g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.01g) — the combination the working hipaa-preset projects (Globalacl, test pages) already use. Latent template defect noted: every future `standard`-preset auth project inherits this mismatch until the GAS template or setup script aligns the two sides

## [v01.08r] — 2026-07-17 08:10:18 PM EST — [f54c4cc](https://github.com/LightAISolutions/Sales/commit/f54c4cc33d0f6aeb9ed6a2101bbb0195bb3a0304)

> **Prompt:** "The first screenshot is the error message I get when I try to sign in with "jonyang92@gmail.com" and the second screenshot is an example of a successful Master ACL sheet. Modify the "grantUserAccess" function to resolve the first problem and modify my Master ACL sheet to look like the second screenshot."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.04g): `grantUserAccess()` reworked into a three-phase utility. Phase 1 (STRUCTURE) verifies/repairs the Master ACL spreadsheet to match the reference layout — creates the Access tab if missing, writes `Email`/`Role` headers, adds the `#NAME`/`#URL`/`#AUTH`/`#ICON`/`#DESC` metadata rows via `ensureMetadataRows`, creates a `Roles` tab with the default permission matrix (new `ensureRolesTab_` helper, checkboxes included), and registers this project's page column. Phase 2 (GRANT) unchanged — default admin grants for the two owner emails. Phase 3 (WEB APP PROBE) initializes required Script Properties then fetches the project's own `/exec` URL and logs a precise verdict — the page's "sign-in service isn't responding" watchdog fires when the deployment doesn't serve the app, so the probe distinguishes healthy / access-not-Anyone / stale-or-empty-deployment (with click-by-click fix instructions)

## [v01.07r] — 2026-07-17 07:47:16 PM EST — [21a2c40](https://github.com/LightAISolutions/Sales/commit/21a2c407b143e02dc422b0a3c95f75878dfe5761)

> **Prompt:** "GAS is telling me: "No emails specified. Set Script Properties key "GRANT_ACCESS_EMAILS" (single email or comma-separated list), optionally "GRANT_ACCESS_ROLE", then Run again." Make it so I don't have to do this. Add "jonyang92@gmail.com" and "lightaisolution@gmail.com"."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.03g): `grantUserAccess()` no longer requires Script Properties — when `GRANT_ACCESS_EMAILS` is unset it falls back to built-in defaults `DEFAULT_GRANT_EMAILS` (`jonyang92@gmail.com`, `lightaisolution@gmail.com`) with `DEFAULT_GRANT_ROLE` (`admin`). Script Properties still override the defaults when set, for granting other users/roles

## [v01.06r] — 2026-07-17 07:42:23 PM EST — [f5e213d](https://github.com/LightAISolutions/Sales/commit/f5e213dcfe99813f70e42afdef0e5660780a0c0b)

> **Prompt:** "No one has permissions to access these projects right now. Make a function that I can run that allows new users to get permission."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.02g): new `grantUserAccess()` admin utility in the PROJECT block — run from the Apps Script editor with Script Properties `GRANT_ACCESS_EMAILS` (single or comma-separated) and optional `GRANT_ACCESS_ROLE` (default `viewer`). Appends Access-tab rows for new users (role + TRUE for every page column, with checkboxes), re-enables all page columns for existing rows (role updated only when explicitly set), validates the role against the known role list with a warning, and bumps the access-cache epoch so grants take effect immediately. One run grants access to every registered project since all auth projects share the central Master ACL spreadsheet

## [v01.05r] — 2026-07-17 07:37:12 PM EST — [d45e3de](https://github.com/LightAISolutions/Sales/commit/d45e3de1ca94fc50717cc17572338d3a05ec9c8f)

> **Prompt:** "I can't sign into my MasterACL project with my personal email (jonyang92@gmail.com) because permissions are not set by my work email (lightaisolution@gmail.com). Autocreate the admin permissions for my personal email."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.01g): new `PROJECT OVERRIDE` block with `SEED_ADMIN_EMAILS` (`jonyang92@gmail.com`) and an idempotent `ensureSeedAdmins()` called from `doGet` — appends an `admin`-role row with all page columns TRUE to the Access tab when the email is missing, bumps the access-cache epoch so cached denials clear immediately, and never touches existing rows (manual spreadsheet edits always win). Runs server-side as the deployment owner, so it works even though the visiting user has no spreadsheet access

## [v01.04r] — 2026-07-17 07:18:01 PM EST — [500a4fe](https://github.com/LightAISolutions/Sales/commit/500a4fe7d1346adb8e747edf0a0879fd8e7277bc)

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "Scraper",
>   "TITLE": "News Scraper",
>   "DEPLOYMENT_ID": "AKfycby8nOR0AqLsDlZPcrTX9dWIInY48R9Jrl8oBDtN5t0emC06j7iwidEMdXttrD1zXnjUIg",
>   "SPREADSHEET_ID": "19U0Wu25eUXEHPVz4VWjKQIpnRozgFycNSjFCTB-umkk",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **Scraper** (News Scraper — auth-enabled, `standard` preset) created via `scripts/setup-gas-project.sh`: `live-site-pages/Scraper.html` (v01.00w), `googleAppsScripts/Scraper/Scraper.gs` (v01.00g), `Scraper.config.json` with real deployment/spreadsheet IDs and Master ACL registration, version files, page/GAS changelogs + archives, and `repository-information/diagrams/Scraper-diagram.md` (with verified mermaid.live link)
- `Deploy Scraper` webhook step added to `.github/workflows/auto-merge-claude.yml`; Scraper registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges — all script-generated with no manual repair needed (v01.03r script fixes verified in production)

### Changed
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to include the new Scraper nodes (verified by decompression)

## [v01.03r] — 2026-07-17 07:11:12 PM EST — [5a48862](https://github.com/LightAISolutions/Sales/commit/5a48862bc3638618103768d8c206e3c338f71b7a)

> **Prompt:** "fix the setup script defects"

### Fixed
- `scripts/setup-gas-project.sh` Phase 6: the GAS Projects registration row was appended after the last `|`-prefixed line in the whole file (landing in the coding-guidelines pointer table) — now anchors on the `| Project | Code File |` header and inserts after the last contiguous row of that table
- `scripts/setup-gas-project.sh` Phase 9: the workflow deploy step anchored on a `# ── AHK VERSION FILE UPDATE ──` banner comment that no longer exists, silently skipping the insert — now anchors on the stable `- name: Update AHK version files` step name
- `scripts/setup-gas-project.sh` Phase 5b: generated per-environment diagrams lacked the mandatory "Open in mermaid.live" link — the script now generates the pako URL via `python3` (zlib is pako-compatible) with round-trip verification and a warning fallback when Python is unavailable
- All three fixes verified end-to-end against a throwaway repo copy (row placement, workflow step position, link decompression)

## [v01.02r] — 2026-07-17 06:55:07 PM EST — [63a7038](https://github.com/LightAISolutions/Sales/commit/63a70386a6a3a99c405d7ddc2aa284a185a270e2)

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "MasterACL",
>   "TITLE": "MasterACL",
>   "DEPLOYMENT_ID": "AKfycbxgxErSg_DfV7WjVvDQ4_LVkFAkON-86iJaNhQ3k50Hs-WbQ2KLskfRtnzSVlZNIHhc8Q",
>   "SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "IS_MASTER_ACL": true,
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **MasterACL** (auth-enabled, `standard` preset, flagged as the Master ACL project) created via `scripts/setup-gas-project.sh`: `live-site-pages/MasterACL.html` (v01.00w), `googleAppsScripts/MasterACL/MasterACL.gs` (v01.00g), `MasterACL.config.json` with real deployment/spreadsheet IDs, version files, page/GAS changelogs + archives, and `repository-information/diagrams/MasterACL-diagram.md`
- `Deploy MasterACL` webhook step added to `.github/workflows/auto-merge-claude.yml` (the setup script announced this step but never wrote it — added manually, mirroring the Globalacl step)
- MasterACL registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges

### Fixed
- Setup script defect: the GAS Projects table row was inserted into the coding-guidelines pointer table in `.claude/rules/gas-scripts.md` — moved to the actual GAS Projects table
- Added the missing "Open in mermaid.live" link to `MasterACL-diagram.md` and regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (both verified by decompression)

## [v01.01r] — 2026-07-13 08:28:42 PM EST — [0c1f7bf](https://github.com/LightAISolutions/Sales/commit/0c1f7bfb27564bdc4913fecdf9cd3626c423d01c)

> **Prompt:** "continue with your recommendation"

### Changed
- Initialized repository identity: internal links, branding URLs, and live-site references updated from the template's `lightaisolutions` repo name to `Sales` across README.md, CITATION.cff, issue template config, REPO-ARCHITECTURE.md, index.html, sitemap.xml, and robots.txt (`bash scripts/init-repo.sh LightAISolutions Sales ShadowAISolutions` + manual follow-ups; developer branding `ShadowAISolutions` preserved)
- GAS Project Creator page defaults now point to this repository — GitHub Repo field prefills `Sales` and the three logo URL fields prefill `https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg` (v01.01w)
- Regenerated `repository-information/readme-qr-code.png` to encode this repository's URL (`https://github.com/LightAISolutions/Sales`)
- Updated CLAUDE.md Template Variables table: `YOUR_REPO_NAME` → `Sales`

### Fixed
- Corrected GitHub Pages hostnames mangled by the init script's global replace — the template's org and repo share the same lowercase string, so `lightaisolutions.github.io` became `Sales.github.io` in CITATION.cff, README.md, and REPO-ARCHITECTURE.md; restored to `lightaisolutions.github.io` (paths correctly remain `/Sales/`)
- Removed the duplicate `main` push-trigger entry the init script inserted into `.github/workflows/auto-merge-claude.yml` (this copy already had `main` in the trigger)
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (verified decompression)

Developed by: ShadowAISolutions
