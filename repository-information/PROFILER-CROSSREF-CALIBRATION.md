# Cross-Reference Checker — Calibration Record

How `scripts/check-profiler-crossrefs.py` was tuned, what it was measured
against, and what it is known not to catch. Written when the script was built
(repo version v04.65r) against the 127-dossier corpus at v04.64r.

The script's docstring is the user-facing contract. This file is the evidence
behind it — read it before changing any threshold in the script's `tuning`
block, and update it when you do.

The last section covers the sibling `scripts/check-profiler-relationships.py`
(added v04.71r) — the mechanical guard over `relationships[]`, which has no
tuning block by design.

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

**Scope cap made visible (v04.67r).** `OQ_SCOPE_MAX` once dropped a real
candidate in silence: documenting the `hithium` reconciliation thoroughly pushed
both records past 900 characters and the checker went green on a pair it had
stopped reading. Raising the cap to 1500 admits eight more candidates at once
with no ground-truth gain, so the cap stays — but every scope it declines to
examine is now listed under "NOT examined" with its size. **A clean run is not a
clean corpus.**

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
- **`hithium` v8 → v9 → v10.** The checker's pairing invites the reading that
  Jupiter confirmed what Hithium hedged. Jupiter Power's own dossier records the
  opposite — **Jupiter's channels have never once named Hithium** — so v9 wrote
  that the "verified three layers" were documented from Hithium's side. **v10
  corrected that**, and the correction is the more useful lesson: checking the
  citations shows only one of the three layers is Hithium-sourced (the partner
  roster, in its 27 October 2025 HKEX prospectus). The June 2024 3 GWh agreement
  rests on trade press (Solarbe Global, corroborated by SMM) and Trimount on
  Energy-Storage.News. v9 also omitted that **Jupiter's CTO Michael Geier is
  quoted in the 3 GWh announcement** — which does not overturn the channels
  claim, but does qualify "one way only". `jupiter-power` was accurate
  throughout and was left alone.

  **The generalisable failure:** "which side is this documented from?" is a
  question about the `sources[]` array, and v9 answered it from the *prose* of
  the two dossiers instead. Adjudicating a cross-reference means reading the
  citations, not the summaries — the prose is what is under review.

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

## Relationships checker — `check-profiler-relationships.py` (X1, v04.71r)

The sixth checker, built 2026-09-05 as Phase X item X1 (`PROFILER-COVERAGE-PLAN.md`
§9.3) on Fable 5.1 High, against the 127-dossier corpus at v04.70r. It guards
S2 — the curated `relationships[]` arrays — which no script had ever read for
anything but slug resolution. It shares this file with the cross-reference
checker because it is the other half of the same question: `check-profiler-
crossrefs.py` asks whether two dossiers *contradict* each other; this one asks
whether the edges they *declare* between each other are well-formed.

### Four mechanical invariants, and nothing else

| # | Kind | Invariant | Live corpus (v04.70r) |
|---|------|-----------|------------------------|
| (a) | `dangling-slug` | Every `relationships[].slug` resolves in `profiler-companies.json` | **0** — regression guard |
| (b) | `reciprocal-type` | When A curates B *and* B curates A, the two `type`s are coherent inverses | **15** (82 naive) |
| (c) | `unregistered-source` | `relationships[].source`, **when it is a URL**, is an exact string in that dossier's own `sources[]` | **119** |
| (d) | `unregistered-project` | `relationships[].project`, when set, resolves in `profiler-projects.json` | **0** of 51 pins |

**There is no semantic detector and there will not be one.** The semantic
layer exists above; a fifth "smart" check here would re-import the
false-positive problem that layer was tuned for. Consequently there is no
`tuning` block: every finding is either true or an accepted exception with a
written reason in `profiler-relationships-accepted.json`. Loosening a rule to
make a finding go away is the one move this checker forbids by design.

### The 82-versus-15 filtering rule

`type` reads from the **stating** side's perspective — "B is A's `<type>`".
So when A says B is its `supplier`, the coherent reciprocal is B saying A is
its `customer`, and comparing the two strings naively calls every correct
customer/supplier pair a conflict. On the live corpus the naive comparison
reports **82** differing pairs across the 175 reciprocal pairs; **67** of them
are correct `customer`↔`supplier` inverses. The checker's inverse table is:

| A says B is… | …so B must say A is | Class |
|--------------|---------------------|-------|
| `customer` | `supplier` | inverse pair |
| `supplier` | `customer` | inverse pair |
| `investor` | `portfolio` | inverse pair (schema-level; the enum does not carry `portfolio` yet, so an `investor` edge's reciprocal is reported until it does or the pair is accepted) |
| `partner` | `partner` | symmetric |
| `competitor` | `competitor` | symmetric |
| `other` | *(none)* | reported — `other` makes no claim, so coherence cannot be shown |

The last row is what takes the count from 13 to **15**: `eolian`/`jupiter-power`
and `mitsubishi-power`/`prevalon` are `other`/`other` pairs. A symmetry rule
that let `other` match itself would pass them silently; the checker reports
them instead, because two dossiers agreeing to say nothing is not the same as
two dossiers agreeing. Both belong on the accept list with a reason, which is
X2's job — the ground-truth count was measured with them included, and the
checker reproduces it exactly.

Of the 15, `microsoft`/`openai` (`partner` · `investor`) and
`google`/`terawulf` (`partner` · `investor`) are the clearest legitimately-both
cases. Five are a vendor calling NVIDIA a `partner` while NVIDIA lists the
vendor as a `supplier` (`flex`, `infineon`, `liteon`, `megmeet`, plus
`delta-electronics`/`infineon` in the same shape) — those are real
adjudications, not accepts.

### Why one-sidedness is deliberately NOT an invariant

503 of the 853 entries at v04.69r have no reciprocal edge. Reporting them
would be the over-calling that §9.2 reason 2 declines, and the histogram says
why: **421** of the 503 are silent in both directions (neither dossier's prose
mentions the other either), and **165** of those are `competitor` edges, where
silence is correct — a large company has no reason to name a small rival, and
a dossier that lists one would be padding. The remainder are largely a small
vendor naming a large customer that will never list it back. Nothing is lost
by not flagging them: `build-profiler-graph.py` already merges one-sided edges
into bidirectional graph edges, so the Relationships tab shows the inbound
account regardless. One-sidedness is a prompt for the *next revision* of the
silent dossier, not a defect in the corpus.

### Source disposition, and what (c) does not flag

The schema (`PROFILER-SCHEMA.md` → `relationships[]`) says `source` is "a URL
or a label from this profile's `sources[]`", and that when the field is absent
the app derives a provisional link at render time. Three of the four
dispositions are therefore allowed, and the checker counts them without
reporting them:

| Disposition | v04.70r | Reported |
|-------------|---------|----------|
| exact `sources[]` URL match | **517** | no |
| URL not in `sources[]` | **119** | **yes** |
| bare label | **140** | no — allowed by schema |
| absent | **77** | no — derived-link fallback |

An earlier pass that flagged every non-matching string counted 259 and would
have manufactured 140 false defects out of the labels. The match is **exact**
because the app resolves the string exactly; when a `sources[]` url matches
after normalising scheme, `www.`, trailing slash and fragment, the report adds
a *near match* hint (1 of the 119 on the live corpus) but the finding stands.

### Verification at build

- Reproduces the §9.1 ground truth to the entry: 853 entries, 678 distinct
  pairs, 175 reciprocal pairs, 82 naive / **15** filtered type findings,
  517 / **119** / 140 / 77 source disposition, 0 dangling slugs.
- (d) was unmeasured in §9.1: **51** pins across 8 registered projects, 0
  unregistered.
- Exit 1 on the live corpus (134 findings); the four siblings
  (`sync-profiler-registry.py --check`, `check-profiler-study.py`,
  `check-profiler-reports.py`, `check-profiler-crossrefs.py`) unchanged and
  clean. Runtime 0.16 s.
- Accept-list ids hash the facts behind the finding (both types; slug +
  counterparty + url), so a dossier edit that changes the fact reopens it —
  the same contract as the cross-reference checker's fingerprints.

### Adjudication log

**X2 — 2026-09-05, v04.72r, Fable 5.1 Medium.** All 134 findings cleared; the
checker exits 0 with 10 accept-list entries.

| Disposition | Count | Detail |
|-------------|-------|--------|
| reciprocal-type · **accepted** | **10** | `microsoft`/`openai`, `google`/`terawulf` (partner AND investor); `byd`/`tesla` (cell customer AND rival), `byd`/`sinexcel` (equipment customer AND C&I rival), `delta-electronics`/`infineon` (silicon supplier AND co-development partner — each context states its own rationale); `dpr`/`openai` (DPR's `other` is a deliberate *indirect* — the contract runs through Crusoe); `amazon`/`mainspring-energy` and `blattner`/`quanta-services` (the coherent inverse is `portfolio` / `subsidiary`, which the enum lacks); `eolian`/`jupiter-power`, `mitsubishi-power`/`prevalon` (`other`/`other` corporate-structure links, reported by design) |
| reciprocal-type · **corrected** | **5** | `kiewit`→`bechtel` `other`→`competitor` (the note led with the US-Japan framework co-naming, but both dossiers record the ENR #2-vs-#4 rivalry); `nvidia`→`flex`/`infineon`/`liteon`/`megmeet` `supplier`→`partner` — the cited source is NVIDIA's own 800 VDC *partner* ecosystem list, NVIDIA is not the purchaser of the power shelves or the silicon (the ODMs and operators are), and each vendor's dossier reasons the `partner` typing; the vendor side was right, not NVIDIA's |
| unregistered-source · **replaced** | **104** | The `source` string was a **truncated prefix** of a URL the same dossier already registered — cut at roughly 100 characters mid-slug (`…close-463-million-fi`), or missing a trailing `.html` / `/` (the `hithium` near-match). Fixed by substituting the registered string; no new source, no tier change |
| unregistered-source · **registered** | **15** | Genuinely absent from the dossier's `sources[]`. Every one was an inbound edge written by a step-7 reconciliation when a newer dossier landed (`oklo` 6, `mccarthy` 3, `trane-technologies` 4, `hitt` 1, `talen-energy` 1) — the writer cited the new dossier's source without registering it in the older dossier. Registered with the label and publication date the newer dossier already carries; no `party` override needed (a counterparty's newsroom tiers `independent` under the domain rule, which is correct — it is not the dossier subject's own account) |
| unregistered-source · **accepted** | **0** | — |

**Pattern worth a rule.** 104 of the 119 were one defect: a relationship
`source` copied as a clipped prefix of the registered URL. That is a writer
habit, not a research gap, and it is now mechanically caught — the checker's
exact-match rule is the guard, and the disposition is always "substitute the
registered string", never "register the prefix". The other 15 are the step-7
shape: when reconciliation adds an edge to an *older* dossier, the cited URL
must be registered in that dossier's `sources[]` in the same edit. Both belong
in the Profiler Command's step-7 wording rather than in a new detector.

**Enum gap, recorded not fixed.** `investor`'s inverse `portfolio` and the
parent/subsidiary relation are not in the `type` enum, so `amazon`/`mainspring-energy`
and `blattner`/`quanta-services` sit on the accept list with the gap
written out. Growing the enum is a schema decision for a later session.

**Side effects.** Registering 15 URLs and revising 49 dossiers moved
`srcTotal` / `srcFirstPct` on 47 registry rows (sync run), rebuilt the graph
(903 edges), and aged 3 more report pins (31 → 34, warning-
only, X3's job). `check-profiler-crossrefs.py` surfaced no new candidate.


Developed by: LightAISolutions
