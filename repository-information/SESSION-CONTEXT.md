# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-23 07:13 PM EST (Megmeet dossier v8 and follow-through)

**Date:** 2026-09-23, 02:58 → 07:13 PM EST (attended)
**Repo version:** v07.33r — two pushes on `claude/confident-ride-rrxpw3` (v07.32r, v07.33r), plus this session-context write
**Branch:** `claude/confident-ride-rrxpw3`

### What was done

**v07.32r — Megmeet dossier cut to v8** (`profiler megmeet`, run from the hand-off prompt the previous session wrote).
- **Identity verified off filings.** SZSE: 002851; 深圳麦格米特电气股份有限公司 / "Shenzhen Megmeet Electrical Co.,Ltd."; former name "…Electrical Technology Co., Ltd." Still independent.
- **Registry.** `aka[]` populated with 12 names; `megmeet-welding.com` added to `domains`.
- **Sources: 38 → 81**, each with an explicit `party`: 29 company, 20 disclosure, 32 independent — 60% first-party.
- **The nine open questions:**
  1. The SST class is still undisclosed but now bounded. Every filing and IR record from September 2024 to August 2026 was searched. One press lead (ifeng, 10 kV / 35 kV) is contradicted by the filed IR record of the call it cites.
  2. North America: batch delivery is dated H1 2026; the Q1 2026 date covers AIDC delivery generally.
  3. The company's own site places a 35,000 sq ft US manufacturing base in Richardson, Texas, and a TDLR record matches it. The filings don't list it.
  4. No AI data-centre revenue line is disclosed.
  5. FY2025 segment margins found; FY2025 R&D was RMB 1.122B.
  6. No US-entity customer is disclosed.
  7. OCP: exhibitor only.
  8. UL: marks and lab programmes, no listing number.
  9. The "#2 behind LITEON" claim traces to 2025 rumour; Soochow expects Megmeet as the **third** source.
- **New facts:** the 22 September welding minority buy-out (RMB 663.64M). The H-share A1 has had no hearing. Consensus is RMB 787M.
- **v7 errors fixed:** the "only expanding margin" claim, the "¥8.66B" consensus figure, `periodType: interim`, and Germany listed as manufacturing.
- **Reconciliation:** 13 inbound dossiers reviewed; **Delta v5→v6 and LITEON v6→v7** corrected where they carried the #2 claim as corroborated. Registry, graph, refresh calendar and refresh notes all updated.

**v07.33r — follow-through, at the developer's instruction.**
- **Briefing chapter 9.4:** a second table with seven rows — the six v8 contradictions plus the bounded 10 kV / 35 kV lead. The PDF was rebuilt (72 pages) and the colophon has an amendment note. The body is otherwise unchanged.
- **Report superseded:** the new edition is `sst-hall-edge-block-rev2--competitive--2026-09-23`. It re-pins Megmeet v8, Delta v6 and LITEON v7, corrects the margin error and closes the #2 claim. The morning edition is flipped to `superseded`.
- **Classroom:** Megmeet added to `in-hall-power` as `adjacent`, and `segment-in-hall-power` regenerated in `Classroom.gs` (v01.88g).
- **Reminder closed:** "Paste the Megmeet SST briefing prompt" moved to Completed; Active Reminders now reads `*(none)*`.
- **Rewrite prompt:** `repository-information/megmeet-briefing-rewrite-prompt.md` written for a separate rewrite session.

### Where we left off

All pushes are merged and nothing is uncommitted. Two things are open:
- **The briefing rewrite has not run yet.** The developer runs it in a fresh session from the prompt file. That session:
  - rewrites the brief for clarity and learning;
  - converts the ~590 citation tags to numbered, tier-coloured superscripts (one number per distinct source, about 89) with a new C.0 reference list;
  - applies the seven 9.4 corrections to the body.
- **`segment-power-conversion-and-rack-power-silicon` is still due.** v8 changed Megmeet's basis line, and the lesson has not been regenerated.

### Key decisions made

- **`legalName` was not added.** `name` is the schema's canonical legal-name field, and `legalName` is a variant shape the schema says to phase out.
- **v7's source labels were kept verbatim in v8.** Published reports copy citations verbatim, and relabelling broke the 23 September report's matches.
- **The superseding report changes the topic slug (`-rev2`), not the date.** Report ids are `<topic>--<type>--<date>`, and today's date was taken.
- **In-hall-power:** first withdrawn in v07.32r because it would force a Classroom regeneration, then restored in v07.33r when the developer asked for it.
- **Citation numbering is per distinct source, not per tier**, so each superscript keeps its pointer (slug and version, primer chapter, guidance pages). The developer was told how to switch to tier-only numbers.
- **The rewrite prompt corrects the body at the seven 9.4 points.** A learner shouldn't meet a wrong statement that is only corrected pages later.
- **Model names are kept out of repository files**, including the CHANGELOG prompt blockquote, where the model name is shown as `[model name withheld]`.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Repo CHANGELOG rotation is due on the next push.** The counter reads `Sections: 104/100`, and 12 of those sections are dated 2026-09-23. From 24 September all 104 are non-exempt, so the first push that day must rotate the oldest date groups until fewer than 100 remain. Deepen the clone first and SHA-enrich.
- **The Classroom GAS changelog is at `50/50`.** The next Classroom GAS bump takes it past 50 and triggers its rotation.
- **Report checker:** 5 aged-pin warnings, all on current 8 September editions (`aidc-power-conversion` ×3, `grid-scale-bess`, `named-project-bess-attach`). The drift-gated monthly Routine owns them.
- **Megmeet dates:** Q3 2026 report due by 31 October; the calendar's `nextReport` is 2026-10-30, unconfirmed. The developer starts at Megmeet on 2026-10-07.

### Recommendation for next session

- Run the Megmeet briefing rewrite. Open a fresh session at `xhigh` effort and paste everything below the line in `repository-information/megmeet-briefing-rewrite-prompt.md`. It edits only the print HTML and the PDF, runs its own fact-preservation checker and a fresh-subagent audit, and must land before the 2026-10-07 start date.

**To continue:** type `run the Megmeet briefing rewrite from repository-information/megmeet-briefing-rewrite-prompt.md`
