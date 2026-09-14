# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-14 04:40:41 AM EST
**Repo version:** v05.61r — one push
**Branch:** `claude/adoring-pasteur-o9y63h` (restarted from `origin/main` before the push)

### What was done

- **Phase 4 row 5 — `the-transformer-and-the-substation` ("Why Electricity Changes Clothes"), the 35th lesson** (v05.61r). Seven sections at the ids `CLASSROOM-CURRICULUM-PLAN.md` §3.2 fixes, in its order, on **nine public stamps** each dated off the document fetched that run against a freshly-fetched `origin/main`; all nine contributed. **The first Phase 4 row that appends rather than inserts** — `electrical-foundations` holds only `four-machines`, so §4 position 3 is an append — so the run reported **P1 + P8 only, no P5 and no P3**, breaking the P1+P5 signature rows 3 and 4 set. Registry **35 lessons, 8 tracks**
- **The nine shipped plain-field markup occurrences fixed, then the mirror check added** — in that order, because the check errors on them and the content checker's error count must stay byte-identical to a pristine `HEAD` (24 errors / 0 warnings, before and after). The check went in **wider than the brief specified**, at every `textContent` call site verified by hand in `Classroom.html` (`revisions[].note` and a track's `title`/`short` too); a corpus-wide scan at the wider scope found exactly the same nine and no more. Twelve positive and four negative probes were run against it before it was kept
- **`INTEGRATED-REMEDIATION-PLAN.md` §6's Phase 4 ledger row was four rows stale** — it read "0 of 26, next row 1" from v05.53r to v05.60r. §6's own rule asks a session to flip a row there *and* in the owning record; rows 1–4 flipped only the curriculum plan's. Corrected to 5 of 26
- **The v05.59r deploy poll was armed for the first time and was not needed.** `Deploy Classroom` logged `confirmed (GET): Updated to v01.30g (deployment 39)` — first leg, **no `POLL <n>` line** — and run #573 finished green. GAS live at v01.30g, Pages serving `|v01.30g|`
- **Then, at the developer's question, the S2-versus-Phase-4 ordering was checked against the plan's own text and the segment backlog was measured** — see Key decisions

### Where we left off

Everything is merged and live. **Phase 4 stands at 5 of 26; S2 at 0 of 19.** §7.16 (row 6, `who-buys-storage`) is written and valid for whenever that row runs. **The recommended next session is neither** — it is a one-off **segment regeneration run**, for the reasons measured below.

### Key decisions made

- **The plan never sequenced S2 before Phase 4 rows 2–24, and the run-table's order numbers are a priority ranking, not a sequence.** §7.4 item 6 reads "**S2** interleaved with **Phase 4** rows — the two long lanes"; the §7.3 table's own note on order 6 reads "Interleaves with S2 — different files"; and the table's footer reads "after them the two long lanes interleave freely". So rows 1–5 landing before any S2 session is consistent with the plan
- **But the interleave has drifted 5:0 in Phase 4's favour, and that has a measured cost the plan last sized on 2026-09-09, before S3 closed.** §10.4 recorded "5 substantive, 14 bookkeeping" of the 19-due backlog. Re-measured today it is **12 substantive, 7 bookkeeping**: twelve `segment-*` lessons fail the content checker's membership assertion (2 errors each = the standing 24), and **20 distinct companies are absent from the segment lesson that should list them**, plus 3 dossiers revised since their pins
- **The worst-drifted segments are the ones S2 reaches last.** `insurance-and-risk-transfer` has **3 members and is missing all 3**; `compute-and-the-rack` 4 members missing 2; `assurance` 7 missing 3 (UL Solutions, Intertek, CSA Group). In the §7.3 sales-value order insurance is **18th** and assurance **19th** of 19, so the plan's "regenerate inside that segment's S2 session" rule leaves the worst cases wrong the longest
- **§10.4 already permits the fix and names it**: the substantive ones "can be cleared in a single developer run (`--segment` is repeatable) whenever convenient, or left to their S2 sessions". Running it now also clears the **24-error content-checker baseline**, which is worth more than the lessons themselves — every Classroom commit currently proves itself by diffing against 24 errors, and that is exactly how a 25th hides
- **Regenerating now does not waste the S2 run.** §10.6 requires the segment lesson's `read-next` to deep-link to its landscape module, so each S2 session must regenerate its own segment again anyway — that is one `--segment` invocation, not a session
- **A defect found in another row's lesson is still not fixed on a lesson-authoring commit** (carried forward); **a wording change owes no `revisions[].changed[]` entry** (G4); **`clStudyNext_` against the real serving functions is the acceptance test**, proved three ways every row since 3; **read every screenshot**

### Active context

- **Repo version** v05.61r · **CHANGELOG** 101 raw / 98 non-exempt (`Sections: 101/100`); the three 2026-09-14 sections are exempt only while EST is still on that date, so **the next push that lands on 2026-09-15 or later rotates**, and the oldest whole group is eighteen sections dated 2026-09-05
- **GAS versions:** Classroom v01.30g, Profiler v01.39g, Scraper v02.02g. **Page versions:** Profiler v01.90w, Classroom v01.13w, Scraper v01.72w
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off
- **Harness notes for any Classroom render:** the page reads its session from `sessionStorage`, not `localStorage`; and **hide** the auth-wall and GAS-iframe overlays with CSS rather than `remove()`ing them — removing makes unrelated page code dereference a null element and raises a `pageerror` that has nothing to do with the content
- **Deployment counter** for Classroom is at **40/200**. An independent `?op=deploy` curl issued *while* the workflow's Deploy step is still in flight races it and burns a version; wait for the step to finish, then probe
- `claude/adoring-brown-mvddj2` is still on the remote and is genuinely unmerged — not this session's, and not swept

### Recommendation for next session

- Run a **one-off segment regeneration** — `python3 scripts/build-classroom-segments.py` over all nineteen segments in a single developer session, under `CLASSROOM-CURRICULUM-PLAN.md` §10.4's "cleared in a single developer run whenever convenient" — restoring **20 missing companies across 12 lessons** and taking `check-classroom-content.py` from **24 errors to 0**, so every Classroom commit after it proves itself against a clean baseline instead of a 24-error one. Then resume the interleave with **S2 session 1 (`storage-integrators-and-containers`)** rather than another Phase 4 row, so the lane balance stops drifting 5:0.

**To continue:** type `regenerate the segment lessons`

## Previous Sessions

### Session — 2026-09-14 03:40:18 AM EST (v05.60r)

**Date:** 2026-09-14 03:40:18 AM EST
**Repo version:** v05.60r — the window v05.53r → v05.60r, eight pushes in one session
**Branch:** `claude/optimistic-gauss-zqootb` (restarted from `origin/main` before each push)

#### What was done

- **Phase 4 rows 1–4 of `CLASSROOM-CURRICULUM-PLAN.md` §7 — four mechanism lessons, one per push.** `four-machines` created the `electrical-foundations` track and wrote the `prereqs[]` §2.2 had promised since v05.07r (v05.53r); `how-a-utility-buys` created `market-access`, the last track the plan specifies, so rows 3–24 are now pure lesson authoring (v05.54r); `backup-generation` (v05.55r) and `the-ups-room` (v05.57r) were the first two pure rows, both inserted mid-track at their §4 positions. Registry went **30 → 34 lessons, 6 → 8 tracks**
- **Two rendering defects found in screenshots that no checker could see, and only one of them fixed.** v05.55r shipped nested emphasis (`**a *b* c**`), which `clFmt`'s bold regex cannot match, so literal asterisks reached the reader; v05.56r turned that into a checker error across lessons, tracks and the nine guidance modules — implemented **narrower** than the recommendation that prompted it, because `tiles`, `glossary`, `short` and `title` reach the DOM through `textContent` and would have produced false positives. Then v05.57r found the mirror defect: a `proscons` card's `t` and `meta` are *also* `textContent`, so a `{{term}}` in either prints its braces. Fixed in that lesson; **nine occurrences are still shipped in four other lessons** and were deliberately left for row 5
- **The GAS deploy gate stopped going red on deploys that worked.** Run #568 went red and the deploy had landed. v05.58r corrected the briefs that said otherwise; v05.59r fixed the mechanism — `.github/scripts/gas-deploy.sh` now polls the GET route five more times behind 5/15/30/60/90s of backoff after both legs fail
- **First archive rotation in seven pushes** (v05.59r): EST rolled to 2026-09-14, the non-exempt count jumped 96 → 111, and thirteen sections dated 2026-09-04 (`v04.48r`–`v04.60r`) moved to `CHANGELOG-archive.md` with SHA enrichment
- **v05.60r** corrected §7.15's two now-stale facts and saved this context

#### Where we left off

Everything is merged and live. **Phase 4 stands at 4 of 26**; the next row is **5, `the-transformer-and-the-substation`** (`electrical-foundations` position 3), and its brief is **§7.15**, rewritten at v05.60r so its deploy and CHANGELOG paragraphs match reality. Row 5 also carries two things rows 1–4 could not do: the **nine shipped plain-field markup fixes plus the mirror checker** (blocked until now because the check errors on them and would have broken the pristine-HEAD baseline), and the **first real exercise of the deploy poll**, since every `Deploy` step exits early unless that project's `.gs` is in the merge diff and v05.59r touched none.

#### Key decisions made

- **A defect found in another row's lesson is not fixed on a lesson-authoring commit.** Editing another row's literal adds a `check-classroom-pipeline.py` **P8** finding to a run whose signature (P1 + P5) is what the next run reads to verify its own write went in cleanly. The fix and the checker that guards it belong in one run, checker second
- **A wording change owes no `revisions[].changed[]` entry** — G4, the meaning does not move — which is why the markup fixes can be batched without touching any account's progress deltas
- **`clStudyNext_` against the real serving functions is the acceptance test**, not the registry. Every row since 3 has been proven on the walk three ways: fresh, with every *other* lesson completed, and with the new lesson completed
- **Read every screenshot.** Both rendering defects this session found were invisible to every checker and visible in the first screenshot of the section carrying them

#### Active context

- **Repo version** v05.60r · **CHANGELOG** 100 raw / 98 non-exempt after this push (`Sections: 100/100`); next oldest whole date group is eighteen sections dated 2026-09-05
- **GAS versions:** Classroom v01.29g, Profiler v01.39g, Scraper v02.02g. **Page versions:** Profiler v01.90w, Classroom v01.13w, Scraper v01.72w
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off
- `claude/adoring-brown-mvddj2` is still on the remote and is genuinely unmerged — not this session's, and not swept

#### Recommendation for next session

- Run **Phase 4 row 5, `the-transformer-and-the-substation`**, following `INTEGRATED-REMEDIATION-PLAN.md` §7.15 — one lesson appended to `electrical-foundations` (so expect **P1, no P5**), plus the nine plain-field markup fixes and the mirror checker, in that order (**P8** comes from those). Watch the `Deploy Classroom` step for a `POLL <n>` line; it is the first run that can exercise the poll added at v05.59r.

**To continue:** type `continue with your recommendation`

Developed by: LightAISolutions
