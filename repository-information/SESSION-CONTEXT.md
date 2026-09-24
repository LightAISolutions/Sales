# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-23 10:33 PM → 2026-09-24 12:45 AM EST (attended)
**Repo version:** v07.37r — one push on `claude/quirky-fermat-21bvyi` (v07.37r), plus this session-context write
**Branch:** `claude/quirky-fermat-21bvyi`

### What was done

**v07.37r — the Classroom segment regeneration left open at v07.36r, plus both changelog rotations.**
- **Five segments regenerated** with `build-classroom-segments.py --segment <id>` (generation date 2026-09-23). `Classroom.gs` went from v01.88g to v01.89g. Each lesson got one appended revision whose `changed[]` exactly matches the differing sections:
  - `power-conversion-and-rack-power-silicon`: the-players, what-moved, who-is-connected. This carries Megmeet v8, Delta v6 and LITEON v7.
  - `cells-and-chemistry` and `hyperscalers-and-ai-labs`: what-moved.
  - `storage-integrators-and-containers` and `grid-equipment`: who-is-connected.
- **The 13 pin-only segments were left alone**, as the developer asked and G3 requires. `--check` now reads 13 due, all pin-only, with 0 section changes.
- **Repo CHANGELOG rotated:** the 2026-09-17 date group (19 sections, v06.30r–v06.48r) moved to `CHANGELOG-archive.md`. Counter `107/100` → `89/100`.
- **Classroom GAS changelog rotated:** the 2026-09-15 date group (10 sections, v01.39g–v01.48g) moved to its archive. Counter `50/50` → `41/50`.
- **SHA enrichment:** 29 of 29 resolved on the deepened clone.
- **Checks:** content 0 errors / 0 warnings, selftest 15/15, `node --check`, the inner-scripts check, the curriculum check and the README tree check all pass. The pipeline check shows only P10 (5 revisions against a cap of 3), which binds unattended runs only. There was no P3 finding, so `gateDigest` is unchanged.

### Where we left off

The v07.37r push is merged into main and the branch is deleted. Nothing is pending: TODO is empty, there are no active reminders, and no section-changing segment is due.

### Key decisions made

- **Both rotations ran at the developer's instruction before the rules required them.** At 2026-09-23 EST, today's sections were exempt, leaving 92 non-exempt in the repo CHANGELOG (trigger 100) and 49 in the GAS changelog (cap 50). One whole date group was moved from each, the oldest, which leaves both files under their caps even after midnight.
- **Each archive keeps its existing SHA link style:** 8-character short SHAs in the repo archive, 7 in the Classroom GAS archive.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **The 13 pin-only segments will keep showing as due in `--check`.** That's the intended G3 behaviour, not work. They become real work only when a section differs.
- **`check-classroom-pipeline.py --selftest` takes several minutes of CPU time** in this container. Run it in the background.
- **Dates:** the developer starts at Megmeet on 2026-10-07. The Megmeet Q3 2026 report is due by 31 October.

### Recommendation for next session

- Session fully complete — no deferred work; future sessions can pick any new task.

## Previous Sessions

### Session — 2026-09-23 10:35 PM EST (Megmeet SST briefing rewrite)

**Date:** 2026-09-23, 08:16 → 10:35 PM EST (attended)
**Repo version:** v07.36r — three pushes on `claude/magical-volta-6wttez` (v07.34r, v07.35r, v07.36r), plus this session-context write
**Branch:** `claude/magical-volta-6wttez`

### What was done

**v07.34r — the Megmeet SST briefing rewrite**, run from `repository-information/megmeet-briefing-rewrite-prompt.md`.
- **What was rewritten:** `megmeet-sst-briefing-print.html`, for clarity and learning. Every term is now defined at first use.
- **Expanded explanations:**
  - a four-step walk through one SST in chapter 1;
  - the transformer equation and the I = P ÷ V arithmetic in I.2;
  - a worked cell count in 6.2.
- **Citations:** 588 tags became **84 numbered, tier-coloured superscripts**, and inline analysis became a gold A.
  - The citation-contract table is now a legend.
  - A new **Appendix C.0** lists the numbered references, generated from the same mapping as the superscripts.
- **Dossier v8 corrections:** applied at the seven places 9.4 lists, plus four places that repeat them. Both 9.4 tables are kept as the record.
- **Other:** Appendices A and B were regenerated from chapter 1, and Appendix D has a rewrite note that names no AI model. The PDF went from 72 to 76 pages.

**v07.35r — the fresh-subagent audit's 15 findings, all worked:**
- 14 fixed and 1 verified correct;
- most were in the v8 corrections (FCC citation, the 9.3/16.2 record links, the Goldman attribution in question 6, the chapter 14 verdict, and the chapter 10 Heron row).

**v07.36r — the six looks-wrong items**, each researched independently and fixed; none needed the developer's call.
- Chapter 7 now names both unsolved obstacles that have an owner (FERC and NFPA FPRF).
- The 16.2 NC State feeder-voltage bullet is gone: POWER Magazine reports 13.2 kV.
- The 16.4 box no longer claims low-confidence markings that never existed.
- The Novos Power "fifth"/"sixth" ordinal is gone: primer 7.3 names eight developers.
- The Appendix D page counts now say which build each describes.
- The data file's footprint answer matches v8: the companion copy was re-inlined and Figure M1 regenerated.

**Closing:** the finished PDF was sent to the developer as a download.

### Where we left off

All three pushes are merged, and the briefing is finished at 76 pages with 84 references. Nothing in it is known to be wrong.

**Open item:** Classroom segment regeneration. `build-classroom-segments.py --check` on a deep clone reads **18 of 19 due: 5 with real section changes, 13 pin-only.** The five with section changes:
- `power-conversion-and-rack-power-silicon`: the-players, what-moved and who-is-connected, from Megmeet v8, Delta v6 and LITEON v7;
- `cells-and-chemistry`: what-moved;
- `storage-integrators-and-containers`: who-is-connected;
- `grid-equipment`: who-is-connected;
- `hyperscalers-and-ai-labs`: what-moved.

### Key decisions made

- **One citation number per distinct source string.** All web research shares one number, because which sentence used which URL was never recorded.
- **Data file edits (item 6).** The rewrite prompt put the data file, companion and figures off limits. Item 6 of the looks-wrong list was a data-file error, so its fix was taken to cover them. Only Figure M1 changed: the other 13 SVGs differed only in their embedded date and IDs and were restored.
- **The 16.2 bullet was removed, not rewritten.** Its claim was false, and the fact it pointed at already lives in the primer.
- **The page-count records were kept, not collapsed.** Both were true at their moment, so each now names that moment.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Repo CHANGELOG rotation is due on the first push dated 24 September or later.** The counter reads `Sections: 107/100`, and 15 of those sections are dated 2026-09-23, so all 107 stop being exempt at midnight. Deepen the clone first, rotate the oldest date groups until fewer than 100 remain, and SHA-enrich.
- **The Classroom GAS changelog is at `50/50`.** Any segment regeneration bumps `Classroom.gs`, which triggers its rotation in the same push.
- **The scratchpad checker and converter were session-only.** They are not in the repo; the briefing needs no further tooling.
- **Dates:** the developer starts at Megmeet on 2026-10-07. The Megmeet Q3 2026 report is due by 31 October.

### Recommendation for next session

- Regenerate the five Classroom segments with real section changes: `power-conversion-and-rack-power-silicon`, `cells-and-chemistry`, `storage-integrators-and-containers`, `grid-equipment` and `hyperscalers-and-ai-labs`.
  - Run `build-classroom-segments.py --segment <name>` on a deep clone.
  - Leave the 13 pin-only segments alone, per G3.
  - In the same push, rotate the repo CHANGELOG and the Classroom GAS changelog.

**To continue:** type `regenerate the five due Classroom segments`
