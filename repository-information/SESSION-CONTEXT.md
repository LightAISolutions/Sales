# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-05 04:23 PM EST
**Repo version:** v04.71r — one push commit this session
**Branch:** `claude/profiler-relationships-checker-xchehb` (pushed at `20f6bbf`, merged to `main`, rebased after)
**Model:** Fable 5.1 High — Phase X item **X1**: built `scripts/check-profiler-relationships.py`, the sixth checker. No dossier was touched, by instruction.

### What was done

- **`scripts/check-profiler-relationships.py` built and calibrated.** Four mechanical invariants over every dossier's `relationships[]`: `dangling-slug` (slug resolves in the registry), `reciprocal-type` (both-ways pairs carry coherent inverse types), `unregistered-source` (a `source` that is a URL is an exact string in that dossier's own `sources[]`; labels and absent sources are allowed and never flagged), `unregistered-project` (pin resolves in `profiler-projects.json`). Same CLI shape and exit contract as the crossref checker: `--json`, `--only`, `--pair`, `--kinds`, `--accept`; exit 0 clean / 1 findings / 2 broken input. Runtime 0.16 s.
- **Reproduces the §9.1 ground truth to the entry on the v04.70r corpus:** 853 entries, 678 distinct pairs, 175 reciprocal pairs, 0 dangling slugs, 82 naive → **15** reciprocal-type findings, **119** unregistered-source findings (517 exact match · 119 missing · 140 label · 77 absent). Invariant (d), unmeasured until now: 51 pins across 8 registered projects, 0 unregistered. **Exit 1, 134 findings, all left for X2.**
- **`repository-information/profiler-relationships-accepted.json` seeded empty.**
- **"Relationships checker" section added to `PROFILER-CROSSREF-CALIBRATION.md`** — the invariants, the 82-vs-15 filtering rule, why one-sidedness is not an invariant (§9.2 reason 2), the source-disposition table, verification at build.
- **§7 of `PROFILER-COVERAGE-PLAN.md`** names four after-every-profile-write scripts; **§9.4** X1 row flipped to `Done — v04.71r`. **`profiler-app.md` step 5** requires the checker beside the registry sync and graph build. README tree entries for both new files.

### Where we left off

Nothing is in flight. Working tree clean, branch rebased onto `origin/main` at `688f19d`. **Program state unchanged — 38 of 65 new companies, 4 of 30 guide passes.** The X2 paste-in prompt was handed to the developer in this session's chat (regenerate it from §9.3's X2 row plus the checker's own `--json` output if lost).

- **Next action is X2** on Fable 5.1 Medium — clear the 134 findings until the checker exits 0.
- **Fable remaining:** X2 (Medium) · F6 · F7 · F8 (High). **Opus remaining:** C5–C10, C12, 26 guide backfills, X3.

### Key decisions and findings

- **`other` is untyped, not self-symmetric.** A pure inverse table yields 13 reciprocal findings; the ground truth of 15 includes `eolian`/`jupiter-power` and `mitsubishi-power`/`prevalon` as `other`/`other`. The checker reports any pair with `other` on either side because two dossiers agreeing to say nothing is not agreement — those two go on the accept list in X2 with a reason. Do not "fix" the rule back to 13.
- **`investor`↔`portfolio` is in the inverse table; `portfolio` is not in the schema enum.** Every `investor` reciprocal reports until the enum grows or the pair is accepted. No such pair exists today. `parent`/`subsidiary` were not added — neither exists in schema or corpus.
- **No tuning block, by design.** These are structural invariants: a finding is a finding; an exception goes on the accept list with a written reason, never into a loosened rule.
- **The prompt said "step 8" of the Profiler Command; the checker went into step 5**, where the registry sync and graph build live. Recorded in the CHANGELOG entry.
- **Shape of the 119:** 49 dossiers; `nvidia` 11, `eolian` / `turner-construction` / `vertiv` 6 each, `jinko` / `vantage` 5. Only 1 of 119 is a scheme/slash variant (`hithium`, trailing slash); the other 118 need real `sources[]` registration with a party tier. Registering URLs changes `srcTotal` / `srcFirstPct`, so X2 must run `sync-profiler-registry.py` and `build-profiler-graph.py` after.
- **Shape of the 15:** 2 clear both-true accepts (`microsoft`/`openai`, `google`/`terawulf` — partner AND investor), 2 `other`/`other` accepts, 5 vendor-says-`partner` / NVIDIA-says-`supplier` (`flex`, `infineon`, `liteon`, `megmeet`, and `delta-electronics`/`infineon` in the same shape), 6 genuinely mixed (`amazon`/`mainspring-energy`, `bechtel`/`kiewit`, `blattner`/`quanta-services`, `byd`/`sinexcel`, `byd`/`tesla`, `dpr`/`openai`).

### Active context

- Branch `claude/profiler-relationships-checker-xchehb`; repo version **v04.71r**; CHANGELOG **88/100** — 12 pushes of headroom.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders. `TODO.md`: no items.
- Checker state at v04.71r: registry sync clean · study clean · reports 0 errors / 31 aged pins · crossrefs exit 0 · **relationships exit 1 (134 findings, accept list empty)** · roles not run (no Playwright in the container).

### Recommendation for next session

- **Run X2 on Fable 5.1 Medium — adjudicate the 15 reciprocal-type findings (accept the four both-true / `other`-`other` pairs with written reasons, correct the rest), register the 119 URLs into their dossiers' `sources[]` with the right party tier, then run the registry sync and graph build, and stop when `check-profiler-relationships.py` exits 0.** The defect set is enumerated, the rules are written, and F6 cannot sensibly start until S2 is closed.
**To continue:** type `run X2 on Fable 5.1 Medium`

## Previous Sessions

### Session — Profiler plan review + Phase X design (Opus 5 xhigh)

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

Developed by: LightAISolutions
