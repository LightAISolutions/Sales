# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-05 04:06 PM EST
**Repo version:** v04.70r — one push commit this session
**Branch:** `claude/profiler-update-plan-review-kzebob` (pushed at `a25b804`, merged to `main` as `0ee65ce`, rebased after)
**Model:** Opus 5 xhigh — a plan-review session, no dossier work. The developer asked where the Profiler program actually stands, asked to fold a cross-reference accuracy pass into it, and asked for a Fable-first action plan with Medium substitutions where they hold.

### What was done

- **All seven cross-reference surfaces enumerated and counted against the live corpus — nothing estimated.** Five came back clean: dossier↔dossier (`check-profiler-crossrefs.py`, exit 0), study guides and concepts (101 / 811, 0 errors), Classroom provenance (10 lessons, 134 gate cases, 0 errors), registry sync (0 of 127 out of sync), and **repo documentation pointers — 406 backticked repo-path references across CLAUDE.md and every rules file, zero real dangling pointers** (every miss is a deliberate placeholder like `NEW.html` / `PAGENAME`, or a `CHANGELOG-archive.md` entry naming a since-deleted file).
- **`relationships[]` is the one unguarded surface, and is now measured.** 853 entries across 678 distinct pairs; **0 dangling slugs**; 503 one-sided (421 silent both ways, 165 of those `competitor`); **15** genuinely inconsistent reciprocal type pairs after filtering correct inverses; source disposition **517** exact `sources[]` URL match / **119** URL absent from `sources[]` / **140** label (allowed) / **77** absent (allowed).
- **Reports carry 31 aged version pins**, warning-only by design — `hithium` (2 reports, 50 mentions), `catl` (3, 52), `byd` (2, 38). Checked whether any corrected-away figure is live in a report: **none is**; the `meta` 2.1 GW → 2,609 MW correction never propagated into report text.
- **§9 · Phase X — cross-reference integrity added to `PROFILER-COVERAGE-PLAN.md`** with the surface inventory (§9.1), the explicit decline of the retroactive sweep and its three reasons (§9.2), three model-assigned work items (§9.3), a status ledger (§9.4) and the whole remaining run order (§9.5).
- **A `Fable 5.1 Medium` row added to the §2 model table**, written up from the F5 evidence.
- **Three stale §7 claims corrected** — the `utility` category *does* exist (6 companies, stale since v04.43r), `advisor` *is* populated (DNV + Sargent & Lundy at v04.58r, so the first `investor` session is **F6**, not B10), and the CHANGELOG-capacity bullet no longer says "92/100 … around the eighth push" (rotation already fired; 87/100 now).
- **A paste-in X1 prompt was written in chat** carrying the measured ground-truth counts, so the X1 session has a hard success criterion instead of a discovery task. It is not in the repo — regenerate it from §9.3 plus the numbers above if it is lost.

### Where we left off

Nothing is in flight. Working tree clean, branch rebased onto `origin/main` at `0ee65ce`. **Program state is unchanged by this session — 38 of 65 new companies, 4 of 30 guide passes.** No dossier was written; this was planning only.

- **Next action is X1** — build `scripts/check-profiler-relationships.py` on **Fable 5.1 High**. The prompt is in this session's chat.
- **Fable remaining:** X1 (High) · X2 (Medium) · F6 (MGX · Excelsior Energy Capital · X-energy — first `investor` chips) · F7 (Compass · EdgeCore · PowerHouse) · F8 (Fermi America · Tract · Prime Data Centers).
- **Opus remaining:** C5 · C6 · C7 · C8 · C9 · C10 · C12 — 18 companies over 7 sessions — plus **26 guide backfills**, then **X3** the integrity close-out.
- **Classroom register:** G6 open (blocked on a developer-supplied document, not on a model); G10 Partial; G11 deferred; G12 by design.

### Key decisions and findings

- **The retroactive 870–1,130-pair sweep proposed at v04.64r is declined, and §9.2 records why** rather than leaving it silently undone. It is perishable while 27 companies remain (C4 landed into ~30 inbound mentions and four were wrong, so every new dossier manufactures new cross-references); one-sidedness is a weak signal (421 of 503 silent both ways, 165 `competitor`, where silence is correct); and the class that would justify the spend — categorical mischaracterisation, the `invenergy` case — cannot be detected statically at all.
- **`relationships[].source` not matching `sources[]` is NOT a schema violation.** The schema says "a URL or a label … so **prefer** an exact `sources[]` URL". A first pass counted 259 mismatches; refining against the schema gives **119** that are URLs (the rest are labels, which are allowed). The unrefined number would have manufactured 140 false defects — this is the over-calling failure mode the v04.64r session warned about, caught before it was written down.
- **A naive reciprocal-type comparison reports 82 conflicts; 67 of them are correct `customer`↔`supplier` inverses.** The real number is 15, and several of those (`microsoft`/`openai`, `google`/`terawulf` — both genuinely partner *and* investor) belong on an accept list, not in a rewrite. The X1 prompt carries both numbers so the checker is not built against the wrong target.
- **X1 is assigned Fable 5.1 High, departing from the v04.64r precedent that checkers are built on Opus.** That precedent was earned by an adversarial false-positive problem over free text with four ground-truth cases to calibrate. X1's four invariants are structural and its defect set is already enumerated — nothing to tune. Said so explicitly rather than following the precedent silently.
- **The model rule that fell out of F5 + the §2 head-to-head: effort buys depth of reading, not care.** Opus's one clear edge was 10-K extraction depth; premise-checking was prompt-driven in both directions. So Medium is safe for bounded adjudication (X2) and unsafe for private subjects where inference from a thin record is the product (F6–F8). If the Fable budget runs short, **demote X1 to Medium before touching F6–F8**.
- **§9 was numbered 9, not inserted as a new §6.** `§2`, `§5`, `§7` and `§8` are referenced from the paste-in prompt template, `.claude/rules/profiler-app.md` and this file — renumbering them would have created the exact defect class Phase X exists to remove.
- **One checker result was a false alarm and was not recorded as a finding.** `check-classroom-pipeline.py` reported 250 findings because `origin/main` had not been fetched; after `git fetch origin main` it reports "nothing changed against origin/main — nothing to judge". Diff-aware checkers need a fresh remote ref before their output means anything.
- **`verify-profiler-roles.py` could not be run** — Playwright is not installed in this container. It is the only checker left unexecuted; treat its status as unknown, not green.

### Active context

- Branch `claude/profiler-update-plan-review-kzebob`; repo version **v04.70r**; CHANGELOG **87/100** — 13 pushes of headroom, and the remaining program is ~18 pushes, so **rotation falls inside the guide-backfill block**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders. `TODO.md`: no items.
- Registry **127** companies; concepts **811**; study guides **101**; graph **903 edges**; categories in use — supplier 53, developer 21, ipp 21, epc 12, integrator 10, hyperscaler 8, neocloud 7, utility 6, gc 6, advisor 2, **investor 0**.
- Checker state at v04.70r: registry sync clean · study clean · classroom content clean · classroom pipeline clean · crossrefs exit 0 (6 accepted, 16 not examined) · reports 0 errors / **31 aged pins** · roles **not run** (no Playwright).
- The measurement one-liners that produced §9.1 are not saved anywhere — they were ad-hoc `python3 - <<'PY'` blocks over `live-site-pages/profiler-data/*.profile.json`. X1 makes invariants (a)–(d) permanent; the one-sidedness and mention-silence counts would need re-deriving.

### Recommendation for next session

- **Run X1 on Fable 5.1 High — build `scripts/check-profiler-relationships.py` to §9.3's four invariants, confirm it reproduces the 15 type conflicts and 119 unregistered URLs on the current corpus, and stop there.** It is the only unguarded cross-reference surface left, the defect set is already measured so the session has a hard pass/fail criterion instead of an open-ended hunt, and nothing in X2 can start until the checker exists. Do not let the session drift into fixing what it finds — that is X2, on Medium, and merging the two blows the budget.
**To continue:** type `run X1 on Fable 5.1 High`

## Previous Sessions

### Session — cross-reference checker build + four corrective passes (Opus 5 xhigh)

**Date:** 2026-09-05 03:37 PM EST
**Repo version:** v04.69r — five push commits this session (v04.65r → v04.69r)
**Branch:** `claude/profiler-crossref-checker-3x3r4n` (rebased onto `origin/main` before each of the five pushes; each merged and was swept before the next)
**Model:** Opus 5 xhigh — the cross-reference checker build, then four corrective passes the build itself surfaced.

### What was done

- **v04.65r — `scripts/check-profiler-crossrefs.py` built, the first checker that reads two dossiers against each other.** Three detectors: **differing figures** (two magnitudes for one apparent fact in a shared dimension), **open questions** (one dossier flags something unresolved that another answers), and an opt-in **grouped attribution** class. Never edits a dossier. 1.4 s over 127 dossiers / 25,152 passages. Companion `PROFILER-CROSSREF-CALIBRATION.md` and the `profiler-crossref-accepted.json` accept list.
- **Scored 3 of 4 against the v04.64r drift cases** using the archived pre-fix revisions as a reconstructed corpus. Caught `meta` (2.1 GW vs Vistra's 2,609 MW, Δ 19.5 %), `terawulf` (~$92M vs Talen's $85M, Δ 7.6 %, anchor `Nautilus`), `burns-mcdonnell` (marker `no source ties`, anchor `Moss Landing`). **Missed `invenergy`** — a categorical mischaracterisation in which every number is right; out of scope for a static checker and the docstring says so rather than stretching a definition. All three caught cases vanish on the fixed corpus **with no accept-list entry**, which is the evidence it measures drift rather than coincidence.
- **False-positive rate measured, not estimated: 71 % (precision 29 %) on a seven-item load** — a full census of the live corpus, all seven adjudicated, with **66 distinct candidates hand-checked** across the tuning stages. Volume, not rate, was the design target: 148 candidates at ~10 % precision became 7.
- **v04.66r — the two open candidates adjudicated.** `enchanted-rock` v3 → v4 and `hithium` v8 → v9, both closed by revising the **asking** dossier; `anthropic` and `jupiter-power` were accurate and left alone. Open-question fingerprints changed to include both claim texts so an edited claim reopens a candidate, as the docstring already promised.
- **v04.67r — the hithium sourcing claim corrected (v9 → v10) after the developer challenged it.** v9 said the three layers were "documented from Hithium's side". Reading the **citations** rather than the prose shows **one** is: the partner roster, in Hithium's own HKEX prospectus (27 Oct 2025). The June 2024 3 GWh agreement rests on trade press (Solarbe Global, corroborated by SMM) and Trimount on Energy-Storage.News. v9 also omitted that **Jupiter's CTO Michael Geier is quoted in the 3 GWh announcement**.
- **v04.67r also fixed a false green in the checker.** `OQ_SCOPE_MAX` had silently dropped that very candidate — documenting the reconciliation thoroughly pushed both records past 900 characters and the checker reported a clean pass on a pair it had stopped reading. The cap stays (raising it to 1500 admits eight more candidates with no ground-truth gain); every scope it declines to examine is now **reported** — 16 on the current corpus.
- **v04.68r — the sourcing rule added to Profiler Command step 7.** Any statement about *where* a claim is documented is a claim about the `sources[]` arrays and must be resolved by opening the cited entries on both dossiers. Carries the developer directive: **high verity is the priority; when the citations do not settle something, state the gap clearly and honestly.**
- **v04.69r — §5's `Why` column demoted from fact to hypothesis** in `PROFILER-COVERAGE-PLAN.md`, with a banner marking it unverified prompt material, a new `Checked` column recording each session's real status, and a §7 obligation (plus a prompt-template line) requiring each session to rewrite its own row with what was found.
- **All 16 not-examined scopes were read, not sampled** — none hides a cross-dossier answer. Six are mutual hedges, seven are a company's own internal status or a regulatory question, two were the adjudicated hithium pair. The three that looked answerable were checked against their counterparts and came back negative.

### Where we left off

Nothing is in flight. Working tree clean; `3bd24d7` pushed and merging. `check-profiler-crossrefs.py` **exits 0** with 6 accepted candidates and 16 scopes reported as not examined. Program state is **unchanged from the C4 session — 38 of 65 new companies done, 4 of 30 guide passes done**; this session added no dossiers.

- **Opus 5 xhigh remaining:** C5 (ENGIE North America · AES Clean Energy · RWE Clean Energy), C6, C7, C8, C9, C10, C12 — 18 companies over 7 sessions — plus **26 guide backfills**.
- **Fable 5.1 remaining:** F6 (MGX · Excelsior Energy Capital · X-energy), F7 (Compass · EdgeCore · PowerHouse), F8 (Fermi America · Tract · Prime Data Centers).
- **Classroom register:** G6 open; G10 Partial; G11 deferred; G12 by design.
### Key decisions and findings

- **The `meta` case — the one a magnitude comparator cannot see — is solved, by two mechanisms.** 2,176 MW and 2.1 GW are equal to two significant figures, so a comparator that normalises *and* applies a tolerance calls them the same. **Strict equality with a banded difference** catches the rounded restatement (2,100 ≠ 2,176), and **arithmetic component/total reconciliation** stops the corrected text being flagged forever (2,176 + 433 = 2,609 reconciles; the pre-fix 2,100 + 433 = 2,533 reconciles with nothing). Do not re-introduce a tolerance on equality.
- **Coverage is narrower than the backlog and this changes sweep planning.** Mutual mention reduces the ~870–1,130 cross-dossier pairs to **260 compared pairs**. The checker is a **floor** under step 7, not the sweep tool the earlier plan imagined. A clean run is not a clean corpus — and now says so.
- **Two rejected approaches, recorded so they are not re-tried:** requiring a shared rare *topic* anchor on the figure class (Meta and Vistra share no non-company anchor, so it drops the whole omitted-component class), and figure-local lexical overlap (neither figure case shares a unit phrase).
- **`ATTR_WINDOW = 40` with directional attribution is the load-bearing setting.** A sweep at 40/60/80/120/160 kept both figure cases at every setting; **every** candidate the wider windows added was a false positive. The `DIFF_MAX = 0.25` band ceiling is the most sensitive knob — the `meta` case sits at 19.5 %, so do not go below 22 %.
- **Closing an open question does not silence it, and that is correct.** The honest close keeps the hedging word, so the uncertainty becomes *documented* rather than *open*. **Revise-and-accept is the normal disposition for the open-question class**; only the figure class routinely goes quiet on its own.
- **I made the exact error the cross-reference rule exists to catch, while applying that rule.** "Documented from Hithium's side" was inferred from the two dossiers' **prose** instead of their **citations**. The developer caught it by asking for the evidence. The generalisable lesson is now a rule: *a dossier's summary of its own provenance is the text under review and cannot be evidence for it.*
- **A silent threshold is worse than a wrong one.** The scope cap produced a false green precisely because the reconciliation was written thoroughly — the fuller the write-up, the blinder the tool. Fixing the *silence* rather than the threshold cost nothing and removed a class of failure no amount of tuning would have.
- **The developer's §5 tally was checked and corrected before it was written in.** The instruction said "twelve for twelve wrong"; the repo documents premise verdicts for **two** sessions — C4 (§5, all three wrong, v04.63r) and B5 (§4, all three wrong, v04.62r). Phase C has shipped **14 companies across five sessions**; C1, C2, C3 and C11 recorded **no verdict either way** and are marked **unknown, not correct**. The banner says "wrong in every Phase C session where it was checked — one of five".
- **Provenance of the action plan could be confirmed only in substance.** It is the v04.57r-era screenshot, not in the repo; the quoted phase appears nowhere in it. Said so plainly rather than implying a match.
- **One partial signal was deliberately not written in.** Hithium's HKEX prospectus customer roster names **Lightsource bp, not Aula**, which bears on the open Woolooga post-sale ownership question in `lightsource-bp` — but recording it as a resolution would repeat the overstatement the new rule forbids. Reported to the developer instead; **still open, developer's call**.

### Active context

- Branch `claude/profiler-crossref-checker-3x3r4n`; repo version **v04.69r**; CHANGELOG **86/100**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry **127** companies; concepts **811**; study guides **101**; graph **903 edges (678 curated, 2,788 evidence items)**; archive index **240 entries across 95 slugs**.
- Checker state: `python3 scripts/check-profiler-crossrefs.py` → **exit 0**, 6 accepted, 16 not examined. Useful flags: `--json`, `--pair A B`, `--only`, `--include-grouped`, `--require-anchor`, `--max-delta`, `--data DIR` (the last one is how the ground-truth corpus is scored).
- **Ground-truth reproduction recipe** is in `PROFILER-CROSSREF-CALIBRATION.md` — copy the corpus to a temp dir, swap in the four archived pre-fix revisions, run with `--data`.
- Pre-existing gap left untouched: `hithium.profile.v5.json` is absent from `archive/` while v1–v4 and v6–v9 are present.

### Recommendation for next session

- **Run Phase C session C5 (ENGIE North America · AES Clean Energy · RWE Clean Energy) on Opus 5 xhigh** — the checker work is finished and the corpus is green, so the highest-value next action is production coverage, and C5 is the **first session to exercise both new rules**: the step 7 sourcing rule (verify provenance against `sources[]`, never from another dossier's prose) and the §5 obligation to rewrite its own `Why` cell and fill in `Checked`. Running it next is how we find out whether the rules hold under a real research pass rather than in review.
**To continue:** type `run Phase C session C5 on Opus 5 xhigh`

