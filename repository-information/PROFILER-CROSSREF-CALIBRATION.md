# Cross-Reference Checker — Calibration Record

How `scripts/check-profiler-crossrefs.py` was tuned, what it was measured
against, and what it is known not to catch. Written when the script was built
(repo version v04.65r) against the 127-dossier corpus at v04.64r.

The script's docstring is the user-facing contract. This file is the evidence
behind it — read it before changing any threshold in the script's `tuning`
block, and update it when you do.

## Why the script exists

`sync-profiler-registry.py`, `build-profiler-graph.py`,
`check-profiler-study.py` and `check-profiler-reports.py` each validate a
dossier against itself or against an index. None asks whether **two dossiers
assert contradictory facts about the same thing**. Step 7 of the Profiler
Command (`.claude/rules/profiler-app.md`) closed that gap by rule on
2026-09-05; this script makes the rule verifiable, and is the only thing that
reaches the pairs written before the rule existed.

## The four ground-truth cases

All four were found and fixed by hand during the v04.64r reconciliation pass.
Their pre-fix text is in `live-site-pages/profiler-data/archive/`, so the
checker can be scored against the corpus exactly as it stood before the fix:

```bash
mkdir /tmp/gt && cp live-site-pages/profiler-data/*.profile.json /tmp/gt/
for s in invenergy.v1 meta.v6 terawulf.v4 burns-mcdonnell.v4; do
  n=${s%%.*}; v=${s##*.}
  cp live-site-pages/profiler-data/archive/$n.profile.$v.json /tmp/gt/$n.profile.json
done
python3 scripts/check-profiler-crossrefs.py --data /tmp/gt
```

| # | Case | Class | Caught | Evidence |
|---|------|-------|--------|----------|
| 1 | `invenergy` v1 — grouped NRG with Vistra and Talen as "contracting existing fleets to data centres"; NRG's model is customer-funded new build | categorical mischaracterisation | **No** | Surfaced only under `--include-grouped`, as 1 of 80 candidates (a 1.25 % base rate) and not distinguished from the accurate groupings around it. Scored as a miss. |
| 2 | `meta` v6 — "Vistra (2.1 GW + 433 MW uprates)" against Vistra's disclosed 2,176 MW + 433 MW = 2,609 MW | omitted component | **Yes** | Meta's 2.1 GW vs Vistra's 2,609 MW, Δ 19.5 %. |
| 3 | `terawulf` v4 — Nautilus exit at "~$92M / 3.4x MOIC" against Talen's "$85 million in cash plus selected physical assets" | differing figures | **Yes** | Δ 7.6 %, shared topic anchor `Nautilus`. |
| 4 | `burns-mcdonnell` v4 — Moss Landing adjacency flagged unresolved; Vistra's dossier already carried the phase-by-phase answer | open question | **Yes** | Marker `no source ties`, anchor `Moss Landing`, answered by `vistra relationships[4].context`. |

**Score: 3 of 4.** Case 1 is out of scope for a static checker and the script
says so in its docstring rather than claiming a stretched catch.

### The meta case is the calibration target, and why

2,176 MW and 2.1 GW are numerically equal to two significant figures. A
comparator that normalises units *and* applies a tolerance calls them the same
and misses the drift entirely — the drift was an omitted component, not a wrong
magnitude. Two mechanisms make the checker see it:

- **Strict equality, banded difference.** 2.1 GW is 2,100 MW, not 2,176 MW.
  Exactly equal values are dropped as agreement; a non-zero difference inside
  the band is a candidate. Rounded restatements land in the band.
- **Arithmetic reconciliation.** After the fix Meta says 2,176 + 433 and Vistra
  says 2,609. A magnitude comparator calls those 16.6 % apart *forever*. They
  reconcile as component and total, so the pair is dropped — and the corrected
  corpus goes quiet. Before the fix, 2,100 + 433 = 2,533 reconciles with
  nothing, which is exactly why the drift was real.

All three caught cases appear on the pre-fix corpus and **disappear on the live
corpus without any accept-list entry**. The checker measures the drift, not the
pairing.

## Tuning record

Every threshold below was chosen by measurement, not intuition. Each row is a
run against both corpora; the ground-truth cases had to survive every change.

| Change | Live volume | Effect |
|--------|-------------|--------|
| Mutual mention + nearest-company attribution + banded difference | 148 | Baseline. Hand-check of a 31-candidate sample: ~10 % precision. |
| Nearest figure per dimension (a paragraph attributes one quantity to a company, not five) | 33 | Killed "433 MW of uprates" vs "624 MW of storage" pairings. |
| Agreed-value and arithmetic credits | 31 | Corrected `meta` stopped being flagged. |
| Counterpart name must **precede** the figure, window 40 chars | 10 | Attribution in this corpus is appositive or possessive and short. A sweep at 40/60/80/120/160 kept both figure cases at every setting; every candidate the wider windows added was a false positive. |
| Passage-level, then dossier-level exact-agreement credit | 5 | Killed the "Vistra 13.9 GW and Talen 13.1 GW" family — the same sentence quoted in both dossiers, mis-paired across them. |
| Difference band ceiling 35 % → 25 % | 3 | The single most sensitive knob. The `meta` case sits at 19.5 %, so 25 % leaves 5.5 points of headroom; do not lower it below 22 %. |
| Already-hedged passages suppressed | 2 | "figures conflict across outlets — treat as unresolved" is a disclosed disagreement, not a drift. |

Open-question class, separately: whole-`strategyRead`-array scopes → per-element
scopes (134 → 36); answering passage must name the asking company and must not
itself be hedged (36 → 21); bounded record scopes, restatement suppression by
token overlap, and mirror de-duplication (21 → 6).

Two rejected approaches worth not re-trying: requiring a shared rare **topic**
anchor on the figure class (Meta and Vistra share no non-company anchor, so it
drops the whole omitted-component class), and figure-local lexical overlap
(neither figure case shares a unit phrase — "existing-plant PPAs" against "from
the PJM fleet").

## Measured false-positive rate

Adjudication standard: a candidate is a true positive if a reviewer reading the
printed output alone would find something worth acting on under step 7
(`contradicted`, `differing figures`, or an `open question` the other dossier
answers). "Accurate — different things" is a false positive.

- **66 distinct candidates hand-checked** across the tuning stages (31 + 15
  figure candidates, 35 + 21 open-question candidates at looser settings).
- **Final configuration is a full census, not a sample**: 7 candidates on the
  live corpus, all seven adjudicated. 2 true positives (`enchanted-rock` ×
  `anthropic`, `hithium` × `jupiter-power` — both open questions the other
  dossier plausibly answers), 5 false positives.
- **Measured precision 29 %; false-positive rate 71 %, on a seven-item load.**

The rate is high and the load is small, which is the trade the design chose
deliberately. Read it as: one sitting of about ten minutes clears the whole
corpus and surfaces two real items. It is **not** a rate that would survive a
1,000-candidate sweep, which is why coverage was cut rather than widened.

### Residual false-positive patterns

- **Competitor spec cross-quotes.** Each dossier quotes the other's product
  spec in a `positioning` field — BYD's "Tesla Megapack 3 (~5 MWh)" against
  Tesla's "Fluence Smartstack (7 MWh)". Different products, same dimension,
  both attributed to the counterpart. No structural signal separates these.
- **Different instruments, same counterparty.** Two companies with a dense
  financial relationship state several unrelated amounts about each other.
- **Generic answer passages.** An open question anchored to a rare topic can
  match a counterpart `summary` that mentions the topic without answering.

## Adjudication log

**2026-09-05 (v04.66r) — the first two candidates were worked.** Both were open
questions, and both were closed by revising the **asking** dossier, not the
answering one, per step 7:

- **`enchanted-rock` v3 → v4.** Anthropic's dossier corroborates the 470 MW
  equipment purchase order and the RockBlock attribution — but both trace to
  ERock's own release, Anthropic has not announced the order, and it names no
  sites. The Fluidstack TX/NY host inference is genuinely unconfirmed on both
  sides, so the cross-check was recorded and dated rather than the question
  being declared answered.
- **`hithium` v8 → v9.** The checker's pairing invites the reading that Jupiter
  confirmed what Hithium hedged. The corpus says the opposite: Jupiter Power's
  own dossier records that **Jupiter's channels have never once named Hithium**,
  and that the "verified three layers" are verified from *Hithium-side*
  disclosures, the HKEX prospectus roster and third-party coverage. Completion
  of the 3 GWh delivery is confirmed by no source. Recorded in both Hithium
  passages; `jupiter-power` was accurate and left alone.

**A property worth knowing before adjudicating.** Closing an open question does
not silence it, because the honest close usually keeps the hedging word — the
uncertainty is now *documented* rather than *open*, but the marker is still
there. Both revisions above therefore still surface, and both were then
accepted. Expect "revise **and** accept" to be the normal disposition for this
class; only the figure class routinely goes quiet on its own.

**Fingerprint contract fixed the same day.** Open-question ids originally hashed
only slug pair, scope, marker and anchor, so rewriting the claim left the id —
and any accept entry — valid against text that no longer existed. Ids now
include both claim texts, matching what the docstring always promised. The
change invalidated the four accept entries written earlier that day; they were
re-derived, which is the intended behaviour rather than a migration to avoid.

## Coverage limit — read this before planning a sweep

Mutual mention (A names B *and* B names A) reduces the ~870–1,130
cross-dossier pairs to **260 compared pairs**. A pair where only one side names
the other is never compared, and a claim about a company with no dossier is
never checked at all. Dropping the requirement (`--no-anchor` does not do this;
there is no flag, by design) would multiply both coverage and noise.

This script is a **floor** under step 7, not a substitute for it. A clean run
means nothing in the 260 mutually-mentioning pairs trips these three detectors;
it does not mean the corpus is consistent.

## Runtime

1.4 seconds over 127 dossiers / 25,152 passages. An earlier build used one
350-alternative regex for company matching and took 201 seconds; a first-token
index over the same text does it in 0.6. Keep it fast — a checker that takes
three minutes gets run once.

Developed by: LightAISolutions
