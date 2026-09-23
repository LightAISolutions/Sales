# Megmeet SST briefing — rewrite-and-renumber prompt

Paste everything below the line into a fresh session. It is written to run without pausing.

---

Rewrite the Megmeet SST onboarding briefing for clarity and learning, and convert its citation tags to numbered, colour-coded superscripts. This is an editing pass on a finished document: **no new research, no new facts, no lost facts.**

## What you are editing

- **Source:** `repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html` (about 1,030 lines, 72 printed pages, five parts plus appendices A–D).
- **Output:** the same file, rebuilt to `repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf` with `node scripts/build-megmeet-sst-briefing-pdf.mjs` (and `--png` for proof pages).
- **Context, read before you start:** `repository-information/megmeet-briefing-prompt.md` (why the document exists and who it is for), chapter 9.4 in full, Appendix C, and Appendix D (the colophon, which records the design decisions you must not undo by accident).
- **Pre-flight check:** chapter 9.4 must contain a second table headed "What dossier v8 records". If it does not, the evening-of-23-September amendment has not reached `main`. Stop and say so.

## Who reads it, and what "better" means

The reader is the developer: a new Senior Sales Manager for SST solutions at Megmeet, starting 2026-10-07. The goal is to **learn the technology and the market well enough to hold an engineering conversation**, not to skim.

- **Explaining a concept thoroughly beats being concise.** Cut words that carry nothing: throat-clearing, repeated caveats, stacked qualifiers, sentences that restate the previous one. Never cut a step in an explanation. If a paragraph assumes something the reader has not been taught yet, add the missing step. Define every term the first time it appears, even when the glossary also has it.
- **Write like a careful human expert explaining to a colleague.** Vary sentence length. Use concrete nouns and active verbs. Use a plain-language analogy where it genuinely helps, then give the precise statement. Avoid stock phrasing, chains of em-dashes, bold on every other clause, and rhetorical triplets. Keep technical precision: units, voltage classes, standards numbers and dates stay exact.
- **Keep the structure.** Keep the parts, the chapter numbers, the figure numbers and the table columns. A table may be split or a paragraph turned into a list if that is clearer, but no chapter moves and no figure is dropped.
- **Scripted language stays scripted.** "The sentence to say it in" (chapter 1) and "the one sentence" (chapter 10) are sales lines. Tighten them, but they must stay sayable aloud.

## The citation change — from tags to numbered superscripts

Today every factual sentence ends in a bracketed tag such as `<span class="t w">[WEB, verified 2026-09-23]</span>` or `<span class="t d">[DOSSIER megmeet v7]</span>`. There are about 590 tags but only about 89 distinct strings; 245 of the 590 are the identical WEB tag. Replace them as follows.

1. **One number per distinct source string.** Every distinct tag string becomes one numbered reference: `[DOSSIER megmeet v7]` is one number, `[PRIMER ch.6.1]` another, `[GUIDANCE nvidia-800vdc p17–21]` another, `[WEB, verified 2026-09-23]` another. Number them in **order of first appearance** in the document, starting at 1. Do not split the WEB tag into per-URL numbers unless the sentence-to-URL mapping is already certain from the text: Appendix C lists the URLs, but which sentence used which URL was not recorded, and a guessed mapping is worse than a shared number.
2. **The in-text marker is a superscript number coloured by tier**, placed after the sentence's final punctuation, for example `<sup class="c d">7</sup>`. Keep today's five tier colours exactly (`.t.p`, `.t.d`, `.t.g`, `.t.r`, `.t.w` map to `--s1`…`--s5`). Define `sup.c` rules that reuse those variables, so the colour still tells the reader the tier at a glance.
3. **Analysis is not a source, so it gets no number.** An inline `[ANALYSIS]` becomes a gold superscript `A` (`<sup class="c a">A</sup>`). The labelled analysis boxes (`.an`) stay exactly as they are.
4. **The rule stays one source per sentence.** Every factual sentence still carries exactly one superscript. The one relaxation: a table cell or list item drawn wholly from one source carries one superscript at its end, which is already the document's convention for its wide tables.
5. **Replace the citation-contract table** on the "Read this first" page with a short legend: what a superscript number means, the five tier colours each with a one-line description of the tier, the gold `A`, and a pointer to the numbered list.
6. **Add the numbered reference list** as a new first section of Appendix C, "C.0 Numbered references". Give one row per number with the number (in its tier colour), the tier, and the full pointer: slug and version, chapter or figure, page range, or "web research of 23 September — see the URL list below". Keep the existing tier-grouped URL list under it.
7. **Out of scope for renumbering:** `megmeet-sst-briefing-data.json` and `megmeet-sst-briefing-companion.html` keep their tag strings, because the companion inlines the data file byte for byte. Figure captions that say "Composed from `megmeet-sst-briefing-data.json`" stay as they are.

## One content change, and only one

Chapter 9.4's second table lists seven places where Megmeet dossier **v8** contradicts the body: week-one question 6, chapter 16.3, the consensus figure, chapter 13's footprint line, chapter 9.3's US-entity paragraph, chapter 14 and question 10 on the LITEON story, and Appendix D.2's 10 kV / 35 kV note.

**Correct the body at each of those places** so it reads true, and cite dossier v8 there. Keep both 9.4 tables as the record of what changed and when. Update the sentence above the second table that says the body "has not been changed to match", because after this pass that is no longer true. Apart from those corrections, **every fact, number, date, name and source stays as it is.** If you find something else that looks wrong, list it in your summary. Do not fix it.

## How to work

- **Go chapter by chapter**, reading each one whole before editing it. Use targeted edits, never a whole-file rewrite, and follow the repository's Incremental Writing rule.
- **Before the first edit,** copy the original HTML to your scratchpad. Write a small checker there, not in the repository, that compares the original with the edited file:
  - every number token (digits with their units and signs) that exists in the original still exists in the edited file, except where the 9.4 corrections deliberately change one;
  - every distinct original tag string maps to exactly one reference number;
  - every superscript number resolves to a row in C.0, and every row in C.0 is used;
  - no sentence ends a factual claim without a superscript or an analysis marker.

  Run it after every chapter and fix what it reports before moving on.
- **Proof the PDF by looking at it.** Build with `--png` and read every proof page. Then build the PDF and read the pages for the legend, the first chapter, chapter 9, and C.0. Report the page count before and after.
- **Get a fresh audit.** When the rewrite is complete, give a fresh subagent no drafting context. Have it compare the original and the rewritten HTML chapter by chapter for three things: a fact that changed, a caveat or limitation that was dropped, and a concept explanation that got harder to follow. Work every finding.
- **Update Appendix D.** Add a short note that the document was rewritten for clarity and its citations renumbered on the date of the run. Say what changed in the citation system and what did not. **Do not name any AI model** anywhere in the document; the colophon records effort and run window only, as it does now.
- **Commit and push** under the repository's normal Pre-Commit and Pre-Push checklists. That means a repo CHANGELOG entry and a repo version bump. The study-prep files are not deployed, so there are no page or GAS version bumps.

## Do not touch

- Any Profiler dossier, report, registry or segment file.
- The data file, the companion, the figure script and the figures.
- The older prep documents: the interview brief, the lesson plan and the study guide.

## Report at the end

- Page count before and after, and the number of references in C.0.
- The chapters where an explanation was expanded rather than cut, with one line each on why.
- Anything you found that looks wrong but left alone.
- The audit's findings and what you did with each.

Developed by: LightAISolutions
