# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-05 04:43 PM EST
**Repo version:** v04.72r — one push commit this session, plus this housekeeping commit
**Branch:** `claude/profiler-relationships-x2-r0d1pm` (pushed at `d24e339`, merged to `main`, rebased after)
**Model:** Fable 5.1 Medium — Phase X item **X2**: cleared all 134 findings of `scripts/check-profiler-relationships.py`. It now **exits 0**. No research; bookkeeping and bounded adjudication only, by instruction.

### What was done

- **15 reciprocal-type findings adjudicated:** 10 accepted with written reasons in `repository-information/profiler-relationships-accepted.json` (`microsoft`/`openai`, `google`/`terawulf`, `byd`/`tesla`, `byd`/`sinexcel`, `delta-electronics`/`infineon`, `dpr`/`openai`, `amazon`/`mainspring-energy`, `blattner`/`quanta-services`, `eolian`/`jupiter-power`, `mitsubishi-power`/`prevalon`); 5 `type`s corrected — `kiewit`→`bechtel` `other`→`competitor`, `nvidia`→`flex`/`infineon`/`liteon`/`megmeet` `supplier`→`partner` (the cited source is NVIDIA's own 800 VDC *partner* list; the vendor side was right).
- **119 unregistered-source findings cleared:** **104** were truncated prefixes of a URL the dossier had already registered (clipped mid-slug at ~100 chars, or missing `.html` / `/`) — string substitution; **15** genuinely absent URLs registered into `sources[]` with label and date, all inbound edges written by step-7 reconciliation when `oklo` / `mccarthy` / `trane-technologies` / `hitt` / `talen-energy` landed. 0 URL findings accepted.
- **49 dossiers revised and archived** (profileVersion +1, lastUpdated 2026-09-05); registry synced (47 rows), graph rebuilt (903 edges), archive-index and README tree updated (also fixed 3 missing + 3 duplicate archive lines).
- **§9.4 X2 row flipped to `Done — v04.72r`.** Adjudication log added to `PROFILER-CROSSREF-CALIBRATION.md` → Relationships checker.

### Where we left off

Nothing is in flight. Working tree clean, branch rebased onto `origin/main`. **Program state unchanged — 38 of 65 new companies, 4 of 30 guide passes.** S2 is closed; every future profile write is guarded by the checker. The F6 paste-in prompt was handed to the developer in this session's chat.

- **Next action is F6** on Fable 5.1 High — MGX · Excelsior Energy Capital · X-energy, the first dossiers behind the `investor` chip.
- **Fable remaining:** F6 · F7 · F8 (High). **Opus remaining:** C5–C10, C12, 26 guide backfills, X3.

### Key decisions and findings

- **Two writer patterns explain all 119 URL findings**, recorded in the calibration log as candidate step-7 wording: never clip a relationship `source` string (substitute the registered URL), and when reconciliation adds an edge to an *older* dossier, register the cited URL in that dossier's `sources[]` in the same edit. Not adopted as a rule this session — bookkeeping only.
- **Enum gap recorded, not fixed:** `portfolio` (inverse of `investor`) and parent/subsidiary are absent from the `type` enum; `amazon`/`mainspring-energy` and `blattner`/`quanta-services` sit on the accept list with the gap written out. **F6 will write the first `investor` edges** — expect their reciprocals to report until the enum grows or the pairs are accepted.
- **Counterparty newsrooms tier `independent` under the domain rule, and that is correct** — no `party` override was set on any of the 15 registrations.
- **Report pins aged 31 → 34** (warning-only; X3 re-pins). `check-profiler-crossrefs.py` surfaced no new candidate.
- **One prose touch beyond `type` and `sources[]`:** the `kiewit`→`bechtel` note got a three-word prefix so it supports the corrected type.

### Active context

- Branch `claude/profiler-relationships-x2-r0d1pm`; repo version **v04.72r**; CHANGELOG **89/100** — 11 pushes of headroom.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders. `TODO.md`: no items.
- Checker state at v04.72r: registry sync clean · study clean · reports 0 errors / 34 aged pins · crossrefs exit 0 · **relationships exit 0 (10 accept-list entries)** · roles not run (no Playwright in the container).

### Recommendation for next session

- **Run F6 on Fable 5.1 High — `profiler` + `profiler prep` for MGX, Excelsior Energy Capital and X-energy, the first dossiers behind the `investor` chip, with a visual check of the chip label, `.ov-tag` colour and the compare peer group, then the four after-write scripts and the §8 row flips.** S2 is closed, the checker guards every new `relationships[]` edge, and the remaining Fable work is all dossier research.
**To continue:** type `run F6 on Fable 5.1 High`

## Previous Sessions

### Session — Phase X item X1, relationships checker built (Fable 5.1 High)

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

Developed by: LightAISolutions
