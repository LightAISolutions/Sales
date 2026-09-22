# Megmeet SST onboarding briefing — the paste-in prompt

*Written 2026-09-22 and deliberately deferred: the developer starts at Megmeet as
**Senior Sales Manager — SST Solutions on Wednesday 2026-10-07**, and wants this run
**after** the Network and Events build plan, closer to the start date, so the research is
fresh and the tokens go to the higher-priority build first.*

**Run it in a NEW session — Opus 5, effort `xhigh`.** The corpus is already in the repo, so
this is long-context synthesis plus targeted verification, which Opus 5 does well at half
Fable's price and without drawing the Fable half of the weekly limit. Budget ~35–50 minutes
and ~$25–40 of plan allowance.

**Read this first, before running anything:** an existing report already covers part of the
ground — `live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-08.report.json`,
*"AIDC Power Conversion — The 800 VDC Race"*, scoped to 15 companies including Megmeet,
Delta, Lite-On, Sungrow, Vicor and Infineon, with a "TRU now, SST later" layer. Two of its
findings change what to ask for:

- **There is no NVIDIA share table to be had.** Its `gaps[]` states that no company in the
  set discloses an audited AI-data-centre power-conversion revenue line, and that Delta and
  LITEON share figures are trade and brokerage estimates (WAWT, fiisual, CommonWealth, KGI),
  not company disclosures. Knowing that before the first internal meeting is worth more than
  the number.
- **Its key judgments already retire "the SST roster is still forming"** — Sungrow is
  described as the only one with a filing-level SST supply claim.

What it does **not** cover, and what the briefing should: the four SST startups
(`amperesand`, `dg-matrix`, `heron-power`, `novos-power` — all outside its scope), Megmeet's
own SST roadmap, and which AIDC buyers are specifying SST.

---

## The prompt

```text
profiler report competitive: solid-state transformers and the medium-voltage
hall-edge block — Megmeet's competitive position

Then, as a second deliverable, write me a personal onboarding briefing.

CONTEXT: I am joining Megmeet as "Senior Sales Manager — SST Solutions". I need
to be credible in my first weeks. Write for me, not for the app.

READ FIRST:
- live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-08.report.json
  Do NOT duplicate it. Build on it, and say explicitly where you are superseding
  or contradicting it. Its scope was the 800 VDC rack race; mine is the SST layer.
- megmeet.profile.json and megmeet.study.json (the study guide is from 2026-08-07
  — flag anything in it the dossier now contradicts)
- The power-conversion-and-rack-power-silicon and in-hall-power segments in
  profiler-segments.json, and every member dossier you need from them.

DELIVERABLE 1 — the report. Follow the Profiler Report Command in
.claude/rules/profiler-app.md exactly: dossiers-only, citations copied verbatim
from dossier sources[] with data-driven party tiers, analysis labelled, the
mandatory coverage block with per-company pins and gaps[], active style
(intel-briefing), supersedes set if it supersedes, index entry registered, and
python3 scripts/check-profiler-reports.py clean before committing.

Scope it to the SST contest: megmeet, amperesand, dg-matrix, heron-power,
novos-power, sungrow, delta-electronics, liteon, hitachi-energy, abb,
siemens-energy, ge-vernova, eaton, schneider-electric — adjust with a stated
rationale if the dossiers argue otherwise.

DELIVERABLE 2 — repository-information/MEGMEET-SST-ONBOARDING-BRIEF.md.
This one MAY use web research, but every web-sourced claim must be marked
[WEB, verified <date>] and every dossier-sourced claim [DOSSIER <slug> v<n>].
Never blend them in one sentence. Follow the AIDC-MARKET-REPORT.md precedent for
form. Cover:

  1. Where Megmeet actually sits against Delta and Lite-On on NVIDIA power share
     — and lead with WHY no reliable share number exists, naming each estimate's
     source and its incentive. Do not launder an estimate into a fact.
  2. The four SST startups — amperesand, dg-matrix, heron-power, novos-power —
     what each is really building: topology, voltage class, power rating, claimed
     availability date, funding, and whether any has a disclosed order. Then
     Megmeet's SST roadmap beside them, and state honestly where Megmeet is behind.
  3. Which AIDC buyers are specifying SST, and at what point in the design cycle.
     If the dossiers cannot support this, say so and treat it as an open question
     for my first weeks rather than inventing an answer.
  4. The incumbent threat: Sungrow, Hitachi Energy, ABB, Siemens Energy — the
     medium-voltage franchises that can absorb SST as a product-line extension.
  5. Policy and supply chain: anything that changes who may sell into US AIDC
     — the FCC inverter action, §154 listings, tariffs, the EU 2027 phase-out.
  6. THE SALES ANGLE, which matters most to me and is not in any dossier: the
     three or four objections a US data-centre buyer will raise about a
     China-headquartered SST vendor, and the strongest honest answer to each.
     Label this section as analysis.
  7. What I should NOT say in my first month — claims in circulation that the
     evidence does not actually support.

END WITH: the ten questions I should ask inside Megmeet in week one, ranked by
how much they would change my picture. And a list of everything you could not
determine — I want the gaps named, not smoothed over.

Normal Pre-Commit / Pre-Push checklists; one commit.
```

---

**Before running it, re-check two things** — both will have moved by October:

1. **Dossier freshness.** `python3 scripts/profiler-queue.py --quarterly --tier core` and the
   `lastRefreshed` dates on the scoped slugs. Megmeet's own segment was entirely inside 22 days
   on 2026-09-21; if the SST four have drifted, refresh them first — they are the heart of the brief.
2. **Whether a newer AIDC power-conversion report exists.** Check `reports-index.json` for a
   `current` edition newer than `2026-09-08`; if the monthly drift check superseded it, read that
   one instead and adjust the "do not duplicate" instruction to name it.

Developed by: LightAISolutions
