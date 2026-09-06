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

**F6 — 2026-09-05, v04.73r, Fable 5.1 High.** The first research pass to
write `investor`-typed edges (MGX, Excelsior Energy Capital, X-energy). The
checker exited 1 on exactly the four reciprocal pairs the session brief
anticipated, and 0 after adjudication; **0** unregistered sources, **0**
dangling slugs, **0** unregistered project pins.

| Disposition | Count | Detail |
|-------------|-------|--------|
| reciprocal-type · **accepted** | **4** | `mgx`/`openai`, `aligned`/`mgx`, `anthropic`/`mgx` — the counterparty correctly says `investor`, MGX says `other` because the coherent inverse `portfolio` is not in the enum; `amazon`/`x-energy` — X-energy says `investor` (23.4% holder), Amazon says `supplier` (anchor buyer of Xe-100 capacity), both true at once and again blocked from coherence by the missing `portfolio` value |
| reciprocal-type · **corrected** | **0** | Eleven other pairs written this session paired coherently by construction: `kiewit`/`x-energy` and `black-veatch`/`x-energy` `partner`/`partner`, `talen-energy`/`x-energy` `partner`/`partner`, `oklo`/`x-energy` `competitor`/`competitor`, `sargent-lundy`→`x-energy` `customer` vs `x-energy`→`sargent-lundy` `supplier`, `fluence`→`excelsior-energy-capital` and `lg-energy-solution`→`excelsior-energy-capital` `customer` vs Excelsior's `supplier` |
| unregistered-source · **replaced** | **0** | Every relationship `source` was written as the exact registered string (the builder asserted membership in `sources[]` before writing) |
| unregistered-source · **registered** | **0** | Step 7 added inbound edges to eleven older dossiers (kiewit, oklo, openai, aligned, anthropic, amazon, talen-energy, black-veatch, sargent-lundy, fluence, lg-energy-solution); where the cited URL was absent it was registered in the same edit (kiewit: Kiewit newsroom; oklo and black-veatch: Energy Northwest release; openai: SoftBank Stargate release and MGX board release; fluence: GlobeNewswire release) — so the checker had nothing to register |

**Enum evidence.** Four accepts in one session, all of them the `investor` ↔
`portfolio` gap, on top of X2's two (`amazon`/`mainspring-energy`,
`blattner`/`quanta-services`). Six accept-list entries now exist only because
`portfolio` is absent from the `type` enum. Adding it would let the reverse
side of an investor edge be typed honestly and would retire these six; the
decision remains a schema change for a later session, recorded here as
evidence rather than made.

**Cross-reference checker.** Two new candidates, both accepted as open
questions that stand: `mgx`/`openai` (MGX's Stargate contribution is
unconfirmed on both sides) and `mgx`/`stack-infrastructure` (the AIP-as-suitor
report is Bloomberg-sourced on both sides). Exit 0. One MGX `strategyRead`
entry exceeds the 900-character scope cap and is listed as not examined.

**Side effects.** 130 dossiers on the roster; graph rebuilt to 942 edges (704
curated); 45 shared concepts registered; report pins unchanged (X3's job).

**F7 — 2026-09-05, v04.74r, Fable 5.1 High.** Three `developer` dossiers
(Compass Datacenters, EdgeCore, PowerHouse Data Centers) and two step-7
revisions (`southern-company` v1→v2, `holder-construction` v4→v5). The checker
exited 0 on the first run with **0** findings of any kind: no reciprocal-type
findings (the session wrote no `investor` edges — the three landlords'
sponsors are not covered slugs), **0** unregistered sources, **0** dangling
slugs, **0** unregistered project pins (no campus was registered in
`profiler-projects.json`; Joliet, Mesa and Meridian stay in prose because no
second dossier is ready to pin them).

| Disposition | Count | Detail |
|-------------|-------|--------|
| reciprocal-type · **accepted** | **0** | — |
| reciprocal-type · **corrected** | **0** | The two step-7 inbound edges paired coherently by construction: `southern-company`→`compass-datacenters` `customer` against Compass's `supplier` (Mississippi Power's ~500 MW special contract); `holder-construction`→`edgecore` `customer` against EdgeCore's `supplier` (Mesa PH02/PH03 and Santa Clara SV01 GC) |
| unregistered-source · **replaced** | **0** | Every relationship `source` was written by the builders as the exact registered string (membership in `sources[]` asserted before the file was emitted, as in F6) |
| unregistered-source · **registered** | **0** | Both step-7 edges registered their cited URL in the older dossier in the same edit (southern: the Compass Meridian release; holder: AZ Big Media's PH02 topping-out coverage, plus Interglobix for SV01) — nothing for the checker to find |
| unregistered-source · **accepted** | **0** | — |

**Step 7 substance, for the record.** The `holder-construction` dossier had
carried "EdgeCore Mesa, AZ: $1.9B contract" in its summary, highlights, specs
and developments since v1. Both EdgeCore research agents read the cited
Construction Dive article and found that its "$1.9B ... job" headline styles
EdgeCore's January 2024 debt financing as a contract value; the body states
none. Corrected in v5 to "$1.9B-financed ... contract value undisclosed", with
SV01 (Santa Clara) added from two independent sources. The `mccarthy` and
`hitt` mentions of EdgeCore were accurate and were left alone; the `mccarthy`
dossier's date for the same Construction Dive URL (2023-08-01, against
2024-01-10) is a source-metadata slip, not a claim about EdgeCore, and was not
touched.

**Accept-list state.** 14 entries, unchanged — six of them still the
`investor` ↔ `portfolio` enum gap recorded at X2 and F6. F7 adds no evidence
either way.

**Cross-reference checker.** Exit 0, no new candidate; one Compass
`productsAndServices` scope (1,761 characters) joins the not-examined list.

**Side effects.** 133 dossiers on the roster; graph rebuilt to 974 edges
(727 curated); 40 shared concepts registered (895 total); report pins
unchanged (X3's job).

**F8 — 2026-09-05, v04.77r, Fable 5.1 High.** Three `developer` dossiers
(Fermi America, Tract, Prime Data Centers) — the last Fable session of Phase B
— and two step-7 revisions (`xcel-energy` v2→v3, `lambda` v4→v5). The checker
exited 0 on the first run with **0** findings of any kind: no reciprocal-type
findings (no `investor` edges — none of the three sponsors is a covered slug,
and Fermi's largest holders are its founders), **0** unregistered sources,
**0** dangling slugs once the registry was synced, **0** unregistered project
pins (Project Matador, the Tract parks and Avondale stayed in prose — no
second dossier was ready to pin any of them; `profiler-projects.json`,
`Scraper.gs` and `Profiler.html` untouched).

| Disposition | Count | Detail |
|-------------|-------|--------|
| reciprocal-type · **accepted** | **0** | — |
| reciprocal-type · **corrected** | **0** | The two step-7 inbound edges paired coherently by construction: `xcel-energy`→`fermi-america` `customer` against Fermi's `supplier` (the SPS electric service agreement, up to 200 MW); `lambda`→`prime-data-centers` `supplier` against Prime's `customer` (21 MW of LAX01). The new `tract`↔`prime-data-centers` pair is `competitor`/`competitor` (symmetric) |
| unregistered-source · **replaced** | **0** | Every relationship `source` was written by the builders as the exact registered string; a scratchpad validator asserted `sources[]` membership and URL-index membership before any file was emitted (as in F6 and F7) |
| unregistered-source · **registered** | **0** | The Xcel edge cited the PR Newswire ESA release Xcel's dossier already carried; the Lambda edge registered Prime's Lambda release in `lambda`'s `sources[]` in the same edit |
| unregistered-source · **accepted** | **0** | — |

**Step 7 substance, for the record.** Fermi America: the `xcel-energy` dossier's
December 2025 development ('86 MW from January 2026') was accurate as the
release's wording and was left; the new edge's context records Fermi's 10-K
restatement (second half of 2026) so the two dossiers no longer read as if the
power were flowing. The `\bFermi\b` hit in `excelsior-energy-capital`
('Fermi-class campuses') is a generic positioning reference and was left.
Tract: the `compass-datacenters` and `powerhouse-data-centers` peer-list
mentions were accurate; 'Weil Tract' in `hunt-energy-network` is a battery
site. Prime: `lambda`'s five mentions (21 of 33 MW at Vernon) were accurate and
gained a curated edge; `plus-power`'s 'marketed as grid support for the
adjacent Prime Data Centers campus' was **not** revised — SRP's own release
does not name Prime, the Prime research found the framing in broker and trade
coverage, and Plus Power's Sierra Estrella microsite is JavaScript-rendered and
could not be read to confirm or refute the quoted phrase; the Prime dossier
records the adjacency as `other` with that caveat. `coreweave`'s dossier does
not mention Elk Grove Village; the USD 2.2bn Prime lease surfaced only through
Prime's June 2026 bond marketing and is recorded on Prime's side (one-sided,
per the checker's design — a prompt for CoreWeave's next revision).

**A sourcing note for the calibration record.** tract.com, tractcapital.com,
fleetdatacenters.com and primedatacenters.com all block automated fetches
(SiteGround captcha; a 403 WAF). Both company-side agents read the pages from
dated Wayback captures of the exact URLs and recorded the capture timestamps;
the dossiers cite the canonical company URLs with a '(read via Wayback capture
of YYYY-MM-DD …)' note in the label, so the provenance tiering (`company` by
registry domain) reflects who published the page rather than who served it.
The first-party shares (33% and 30%) are therefore real, not an artefact of
the archive's host.

**Accept-list state.** 14 entries, unchanged. **Cross-reference checker.** Exit
0, no new candidate; one Tract `productsAndServices` scope (2,877 characters)
joins the not-examined list.

**Side effects.** 136 dossiers on the roster; graph rebuilt to 1,012 edges
(749 curated); 27 shared concepts registered (922 total; one alias collision
— 'bridging power' against the existing `bridge-power` — caught before
registration); report pins unchanged (X3's job).

**C5 — 2026-09-06, v04.79r, Opus 5 xhigh.** Three `developer · ipp` dossiers
(ENGIE North America, AES Clean Energy, RWE Clean Energy) — the first Phase C
dossier session after the Phase B close — and **nine** step-7 revisions, the
largest reconciliation tail any session has run. The checker exited 0 on the
first run with **0** findings of any kind: no reciprocal-type findings, **0**
unregistered sources, **0** dangling slugs once the registry was synced, **0**
unregistered project pins (`profiler-projects.json`, `Scraper.gs` and
`Profiler.html` untouched).

| Disposition | Count | Detail |
|-------------|-------|--------|
| reciprocal-type · **accepted** | **0** | — |
| reciprocal-type · **corrected** | **0** | Every new pair coheres by construction: `qts`→`engie-north-america` `supplier` against ENGIE's `customer`; `blattner`→ and `mccarthy`→`rwe-clean-energy` `customer` against RWE's `supplier`; `amazon`→ and `meta`→`aes-clean-energy` `supplier` against AES's `customer`; `meta`→`rwe-clean-energy` `supplier` against RWE's `customer`; `fluence`→`aes-clean-energy` `customer` against AES's `supplier`; and the symmetric `competitor`/`competitor` edges among the three new dossiers and with `nextera-energy-resources`, `jupiter-power`, `hunt-energy-network`, `plus-power`, `intersect-power`, `arevon` and `invenergy` |
| unregistered-source · **replaced** | **0** | Every relationship `source` was written as the exact registered string; a scratchpad validator asserted `sources[]` membership before any file was emitted (as in F6, F7 and F8) |
| unregistered-source · **registered** | **0** | Five of the nine step-7 edges cited a URL the older dossier already carried (`qts` the q.com Lubio release, `blattner` the PR Newswire Emily Solar release, `jupiter-power` and `hunt-energy-network` the two Modo reports, `amazon` the AES annual-report PDF); the other four registered theirs in the same edit — `plus-power` the Energy-Storage.News Broad Reach acquisition, `meta` the AES/Meta PPA PDF and the RWE Rabbit's Foot release, `fluence` the AES FY2025 10-K and the GIP/EQT merger release |
| unregistered-source · **accepted** | **0** | — |

**The `investor` edge that was considered and not written.** The session brief
anticipated an `investor`-typed AES ↔ Fluence edge with an accepted reciprocal.
It was written as `supplier`/`customer` instead, and the reason is a scope
distinction worth recording. `type` reads from the stating side's perspective —
"B is A's `<type>`" — and this dossier's subject is **AES Clean Energy, the US
renewables unit**, which buys from Fluence and does not hold the stake. The
28.19% economic interest (cut to 22% in May 2026) is held by **The AES
Corporation**, a different entity in a different SBU. Typing the unit's edge
`investor` to surface a capital flow the unit does not carry would have been a
mis-statement bought for a graph colour. The ownership is written out in full in
the `context` on both sides instead, and the pair coheres with no accept-list
entry. **Accept-list state: 14 entries, unchanged** — the six `investor` ↔
`portfolio` enum-gap entries from X2 and F6 gained no seventh, and C5 adds no
evidence either way, since it declined the typing rather than testing it.

**Step 7 substance, for the record.** Nine older dossiers were revised and
archived, and **two carried claims the new research contradicted**. `amazon`
stated that "AES owns roughly 28% of Fluence" as the basis for a low-confidence
inference about the Bellefield battery supplier; the correct figures are 28.19%
at 31 December 2025 and **22% after the May 2026 redemption and public sale**
(10,066,414 units, USD 207m net, USD 186m pre-tax gain), and the sentence now
carries both with the inference itself left standing and still flagged as
unsourced. `fluence` described AES as "reportedly being taken private by
GIP/BlackRock for ~$38B" in three places — the summary, a `strategyRead` bullet
and a financial-period commentary; the October 2025 report was real but was
superseded by a **signed** agreement on 1 March 2026 with **GIP and EQT** at
USD 15.00 a share (about USD 10.7bn of equity, USD 33.4bn of enterprise value),
stockholder-approved on 26 June 2026. All three were corrected, with the
October report kept as history in the commentary. The other seven mentions were
accurate and gained a curated edge without a prose change: `qts` (the ENGIE
Lubio PPA), `blattner` (RWE's Emily Solar), `mccarthy` (Bright Arrow for RWE
Renewables Americas — the dossier's own line that no relationship was found
"with ... RWE beyond Bright Arrow" is now two, with Lafitte), `jupiter-power`
and `hunt-energy-network` (both Modo comparisons naming ENGIE), `plus-power`
(Bat Cave and North Fork, sold to Broad Reach in 2020 and now ENGIE's) and
`meta`. Classified and **left alone**: `canadian-solar` lists "ENGIE" among
SolBank customers in a roster that also names Colbún and Axpo, and no source
establishes whether that ENGIE entity is North American — the edge was not
written and the gap is recorded here rather than guessed; `\bAES\b` in
`aypa-power` and `oracle` is executive career history; `plus-power`'s "replaces
AES coal" at Kapolei is The AES Corporation's legacy thermal fleet, not AES
Clean Energy; `invenergy`'s NVIDIA/Emerald AI programme names AES among six
participants and was left as accurate; `\bCBRE\b` in `equinix` and
`prime-data-centers` is CBRE the research publisher, not CBRE Investment
Management, and is unrelated to the ENGIE farmdown.

**A note on the peer family, from a third end.** F6, F7 and F8 each recorded
that `Colocation & Cloud Capacity` mixes data-centre developers with storage
developers. C5's three are the first `developer · ipp` companies that are also
**named PPA counterparties to the developers already in that family**, so for
them the family lights their own customers. That is a real commercial adjacency,
which means the family is not simply mis-sorted — it is behaving as a market map
rather than a peer set. Recorded in `PROFILER-COVERAGE-PLAN.md` §7 for X3; no
family-map change was made.

**Cross-reference checker.** Exit 0, no new candidate; 286 mutually-mentioning
pairs compared (from 260 at v04.69r). Twenty scopes remain over the
900-character cap and are listed as not examined.

**Side effects.** 139 dossiers on the roster; graph rebuilt to **1,050 edges
(784 curated)**; six shared concepts registered (**928 total** — renewable
energy certificate, hourly matching, repowering, single-axis tracker, PV module
and CAISO; `contracted backlog` and `peaker` were proposed and dropped as
already present); 14 company-published headshots added (AES 11, RWE 3), verified
on a contact sheet; report pins unchanged (X3's job).

**C6 — 2026-09-06, v04.80r, Opus 5 xhigh.** Three dossiers — Clearway
Energy (`developer · ipp`), Recurrent Energy (`developer · ipp`) and Form
Energy (`supplier`, the corpus's first iron-air company) — and **nine** step-7
revisions. The checker exited 0 on the first run with **0** findings of any
kind: no reciprocal-type findings, **0** unregistered sources, **0** dangling
slugs once the registry was synced, **0** unregistered project pins
(`profiler-projects.json`, `Scraper.gs` and `Profiler.html` untouched).

| Disposition | Count | Detail |
|-------------|-------|--------|
| reciprocal-type · **accepted** | **0** | — |
| reciprocal-type · **corrected** | **0** | Every new pair coheres by construction: `canadian-solar`→`recurrent-energy` `customer` against Recurrent's `supplier`; `hunt-energy-network`→ `supplier` against Recurrent's `customer`; `blattner`→ and `rosendin`→`recurrent-energy` `customer` against Recurrent's `supplier`; `blattner`→ and `rosendin`→`clearway-energy` `customer` against Clearway's `supplier`; `xcel-energy`→`clearway-energy` `supplier` against Clearway's `customer`; `xcel-energy`→, `crusoe`→ and `google`→`form-energy` `supplier` against Form's `customer`; `eolian`↔`form-energy` symmetric `partner`; and the symmetric `competitor` edges with `strata-clean-energy`, `vistra`, `engie-north-america`, `intersect-power`, `jupiter-power`, `nextera-energy-resources` and `aes-clean-energy` |
| unregistered-source · **replaced** | **1** | Caught **before emission**, not by the checker. A scratchpad validator asserting `sources[]` membership rejected the Form↔Eolian edge, whose `source` had been written as an Energy-Storage.News technology-comparison URL rather than the energystorage.org coalition release the claim rests on. Substituted the registered string and added the coalition source — the X2 defect class, caught one step earlier than X2 caught it |
| unregistered-source · **registered** | **0** | All nine step-7 edges registered their cited URL in the older dossier in the same edit where it was absent |
| unregistered-source · **accepted** | **0** | — |

**The `investor` edge that was written, and the reciprocal that was not.**
Unlike C5, this session did write an `investor` edge: `form-energy` →
`ge-vernova`, on the Series F and Series G participation plus the strategic
memorandum of understanding. **No reciprocal was written on GE Vernova's
side.** The coherent inverse is `portfolio`, which the enum does not carry, so
the only alternatives were an incoherent `other` needing a fifteenth accept-list
entry, or nothing. Nothing is correct here on its own merits rather than as
avoidance: `ge-vernova`'s dossier makes **no claim about Form Energy at all**,
so step 7 imposes no obligation on it, and one-sidedness is deliberately not an
invariant. **Accept-list state: 14 entries, unchanged** — the six `investor` ↔
`portfolio` enum-gap entries from X2 and F6 gained no seventh, but C6 is the
first session to hit the gap and route around it by leaving the counterparty
silent rather than by accepting an incoherent pair. That is a cheaper resolution
than an accept entry and it should be preferred wherever the counterparty
dossier is genuinely silent.

**Step 7 substance, for the record.** Nine older dossiers revised and archived,
and **two carried claims the new research contradicted**. `canadian-solar`
described Recurrent Energy as its "wholly-owned developer" in the summary and
again in `productsAndServices`, and as a "captive developer" in
`ecosystemRole` — wrong since May 2024, when BlackRock's Climate Infrastructure
business took Series A convertible preferred representing 20% of Recurrent
Energy B.V. on an as-converted basis. Canadian Solar's own final-closing release
says it "will continue to own the remaining **majority** shares", which is not
the same claim. The same dossier's "80.6 GWh" and "$3.8B Recurrent project debt"
were stale (84.1 GWh and $4.1bn at 30 June 2026) and its Dylan Marx line
predated his move to Recurrent's chief executive role. `rosendin` attributed
ownership of the Tranquility battery to Recurrent — EIA Form 860M attributes it
to Southern Power with AIP Management, and Recurrent provided a development
service; the same project's batteries came from **Powin**, which makes it the
clearest published counterexample to the captive-supply thesis and is now
recorded as such on both sides. The other seven were accurate and gained curated
edges without a prose change: `hunt-energy-network` (Fort Duncan),
`blattner` (Papago Solar and Cobalt, plus Clearway's Spindle), `strata-clean-energy`
(the APS solicitations), `vistra` (the Enverus completions table),
`xcel-energy` (Spindle, and all three Form projects), `crusoe` (the 12 GWh
reservation) and `eolian` (the storage coalition). Classified and **left
alone**: `\bRecurrent\b` in `intersect-power` and `tract` is executive career
history; in `rwe-clean-energy` it appears only inside a quotation of Blattner's
repeat-owner list; `trina-storage` uses it as a rhetorical comparison for its own
captive channel; `mccarthy` records a *stated absence* of any relationship with
Recurrent or Clearway, which the new research does not contradict;
`gridstor`'s two `\bClearway\b` hits are executive career history at Clearway
Energy **Group**; and `spearmint-energy`'s is a source label on a trade roundup.

**A scope deferral, stated rather than skimmed.** The Profiler Command's step-7
scope note warns that NVIDIA, Tesla, Microsoft, Google and Meta each carry 40+
inbound mentions and that reconciling one is a session of its own. `google` was
the only one of the five in this session's hit list. It received **one curated
edge** — the Pine Island supply relationship, with the customer-not-investor
distinction written out, because that is precisely the error the wider market is
making — and its existing Form Energy prose was checked and found accurate. **No
full reconciliation of the `google` dossier was attempted**, and none is claimed.

**A note on the peer family, from a fourth end.** C6 takes the `developer · ipp`
count to fourteen and adds a distinction the earlier three sessions could not
see. Clearway and Recurrent are the first members whose storage is *contracted*
rather than merchant — 20-year PacifiCorp and Arizona Public Service tolls, not
the ancillary stack that defines Aypa, Spearmint and Gridstor. And Clearway is
the first company in the family whose data-centre exposure sits at a **different
legal entity** from the dossier's subject: the Google, Microsoft and Royal Slope
agreements were originated at Clearway Energy **Group**, the private sponsor, not
at the listed Clearway Energy, Inc. A family keyed on category tags cannot
express that at all. Recorded in `PROFILER-COVERAGE-PLAN.md` §7 for X3; no
family-map change was made.

**A sourcing note for the calibration record.** `formenergy.com` sits behind a
JavaScript proof-of-work wall (Sucuri/GoDaddy `sgcaptcha`) returning HTTP 202
with an empty stub to WebFetch, curl and reader proxies alike. Every first-party
Form page was read from dated Wayback Machine captures of the canonical URLs, and
the dossier's source labels say so, exactly as F8 handled `tract.com` and
`primedatacenters.com`. Form's first-party share of 37% is therefore real rather
than an artefact of the archive host. Two other hosts blocked this session:
`investor.clearwayenergy.com` (Akamai, 503/403 — worked around via SEC EDGAR and
GlobeNewswire) and the whole of `investors.canadiansolar.com` (503 — worked
around via EDGAR, which is authoritative anyway).

**A formatting note worth inheriting.** C5 recorded that the corpus has mixed
JSON indentation. It is worse than that: **60 `.study.json` files are written
with `ensure_ascii=True`** (escaped `\u2014`) while the profiles are not, so a
writer that re-serialises with `ensure_ascii=False` produces a ~2,200-line diff
across files it never meant to touch. A round-trip harness over every corpus file
now detects indent width, trailing newline **and** ASCII-escaping per file and
reproduces all of them byte-identically, with one exception:
`apex-clean-energy.profile.json` is hand-formatted with compact single-line
objects inside arrays and must never be re-serialised — a targeted text edit only.

**Cross-reference checker.** Exit 0 after one accept; **301** mutually-mentioning
pairs compared (from 286 at v04.79r). The one new candidate, `form-energy` ×
`xcel-energy` (`35945358a20e`), is a marker false positive on a shared "Sherco"
anchor: the Form passage is a collection-gap sentence whose "Also unresolved"
clause concerns a possible New York Power Authority or Rochester project, and the
Xcel passage it matched states accurately that Form has a Sherco pilot approved
in 2023. Nothing to close. Accept list now **9 entries**. Twenty scopes remain
over the 900-character cap and are listed as not examined.

**Side effects.** 142 dossiers on the roster; graph rebuilt to **1,081 edges
(812 curated)**; eleven shared concepts registered (**939 total** — yieldco,
CAFD, drop-down, HLBV, P-50, hydrogen evolution reaction, passivation, coulombic
efficiency, paid-in-kind, liquidation preference and as-converted); eight
company-published headshots added for Clearway, verified on a contact sheet;
report pins unchanged (X3's job).


**C7 — 2026-09-06, v04.81r, Opus 5 xhigh.** One dossier — Power Electronics
España, S.L. (`supplier`), the corpus's first dedicated power-conversion
specialist — and **three** step-7 revisions, the smallest reconciliation tail
since F7. The checker exited 0 on the first run with **0** findings of any kind:
no reciprocal-type findings, **0** unregistered sources, **0** dangling slugs
once the registry was synced, **0** unregistered project pins
(`profiler-projects.json`, `Scraper.gs` and `Profiler.html` untouched).

| Disposition | Count | Detail |
|-------------|-------|--------|
| reciprocal-type · **accepted** | **0** | — |
| reciprocal-type · **corrected** | **0** | All three new pairs cohere by construction: `terra-gen`→`power-electronics` `supplier` against the new dossier's `customer`; and the symmetric `competitor`/`competitor` pairs with `sungrow` and `sinexcel`. The five one-sided edges written this session (`mortenson` `partner`, `flex`, `abb` and `hitachi-energy` `competitor`, `trina-storage` `partner`) have no reciprocal because none of those dossiers makes a claim about the subject — step 7 imposes no obligation on them and one-sidedness is not an invariant |
| unregistered-source · **replaced** | **0** | Every relationship `source` was written as the exact registered string. The scratchpad validator was rebuilt first, as C6 recommended, and asserted `sources[]` membership before the file was emitted; it reported 0 errors on the first run |
| unregistered-source · **registered** | **2** | Both step-7 edges needing a source registered it in the older dossier in the same edit — `sungrow` the Wood Mackenzie CY2023 shipment release, `sinexcel` the Wood Mackenzie 2026 BESS integrator ranking (needed to support the correction below). The `terra-gen` edge cited the Mortenson project page that dossier already carried |
| unregistered-source · **accepted** | **0** | — |

**A competitor edge with no citable source, and the corpus precedent for it.**
The `sinexcel` ↔ `power-electronics` pair is the one edge this session could not
cite a URL for: no published source names both companies together, because
**no ranking of conversion suppliers exists at all** (see below). It is written
with a **bare label** — `"Dossier competitive assessment — third-party storage
PCS"` — which the schema permits and disposition (c) explicitly does not flag,
and which is exactly the form `sinexcel`'s own `sungrow` edge already used. The
alternative, omitting `source` entirely, would have been equally legal and less
honest about where the judgment came from. Label count moves 143 → 145.

**Step 7 substance, for the record.** Three dossiers carried inbound claims and
they split three ways — one contradicted, one accurate, one under-evidenced.
**`sinexcel` was contradicted** and is the categorical class the checker cannot
see. It grouped the subject with Sungrow and SMA as "integrated-inverter giants"
whose model Sinexcel sells around "rather than competing with them on full BESS
supply". That is right about Sungrow and **wrong about Power Electronics**, which
manufactures no cells and sells no turnkey system — it is the same *kind* of
business as Sinexcel at a different scale, and the real contrast is modular
low-voltage against integrated medium-voltage architecture. The proof is Wood
Mackenzie's own published scope for its BESS integrator ranking (factory-assembled
AC-integrated systems), which excludes the subject **by definition rather than by
performance**; that release was registered in `sinexcel`'s `sources[]` to support
the correction, made in both the `productsAndServices` positioning and the
`relationships[6]` context. **`sungrow` was accurate and left alone** — its
description of the subject among conventional central-inverter competitors is
independently corroborated by Wood Mackenzie's CY2023 wording, and the dossier
gained a curated edge with no prose change. **`terra-gen` was under-evidenced
rather than wrong**, and is the more interesting case: it stated "Power
Electronics PCS" as fact in four places, and the sole source — Mortenson's
Canyon Country project page — writes **"PE power conversion systems (PCS)"** and
never expands the mark. "PE" is the company's own abbreviation and appears that
way on its datasheet filenames, so the reading is sound; but Terra-Gen's own
project page names no supplier and no independent source does either. The
provenance was written out in the development's `read` and again in the curated
edge's `context`, and the terse spec and headline mentions were left as shorthand
backed by those two — **qualified, not deleted**, per Chesterton's Fence.

**A false-positive class worth recording, because the brief predicted it and the
grep confirms it.** `\bPower Electronics\b` matches **eight** dossiers and
**five are not the company**: `delta-electronics` (Delta's own business segment
is named Power Electronics), `eve-energy` (its own "Power Electronics Lab"), and
`flex`, `infineon` and `vicor` (all citing the trade publication *Power
Electronics News*). `vicor` alone carries three distinct false-positive kinds —
the publication, the "IEEE William E. Newell Power Electronics Award", and a
master's degree in the discipline. A company whose name is also its industry's
name defeats word-boundary matching entirely; only reading each hit separates
them. This is the counterpart to the `\bAES\b` and `\bRecurrent\b` cases from
C5 and C6, and the most extreme instance so far.

**A negative finding that is the session's main result.** There is **no
independent ranking of US utility-scale PCS suppliers**, and the absence is
structural rather than a search failure: every analyst house ranks either global
PV inverters or AC-integrated storage systems, so a conversion-only vendor falls
between two published categories. The consequence for the corpus is that any
sentence of the form "the leading US PCS supplier" is **unfalsifiable rather than
true or false**, and the dossier says so in `strategyRead` and in the study
guide's "where this fails" section rather than repeating the claim.

**Provenance traps caught, both of which would have inflated the record.** First,
the company serves its own datasheets and brochures from an S3 bucket host, which
the domain rule would tier `independent` — nine such sources carry an explicit
`"party": "company"` so the first-party share reflects who published the document
rather than who served it. Second, and in the other direction, **power-electronics.co.nz
describes itself as a *locally owned* supplier, not a group subsidiary**, so it
was deliberately kept out of the registry's `domains` and tiers `independent`; its
statement that Sinexcel manufactures its power-quality range is the **distributor's**
supply relationship, not the manufacturer's, and no Sinexcel supplier edge was
written on that basis. A research agent had classified that site as first-party.
Final share: **61% of 85 sources**.

**Accept-list state.** 14 entries, unchanged. C7 wrote one `partner` edge and
five `competitor` edges and no `investor` edge — the family is founder-owned
through a holding company and no covered company holds any stake — so the
`investor` ↔ `portfolio` enum gap gained no seventh instance and no evidence
either way.

**Cross-reference checker.** Exit 0, **no new candidate**; **304**
mutually-mentioning pairs compared (from 301 at v04.80r). Accept list unchanged
at 9 entries. Twenty scopes remain over the 900-character cap and are listed as
not examined.

**Side effects.** 143 dossiers on the roster; graph rebuilt to **1,096 edges
(820 curated)**; twelve shared concepts registered (**951 total** — IEEE 1547,
IEEE 2800, UL 1741, UL 1741 SA, UL 1741 SB, NERC, FERC Order 901, momentary
cessation, capability curve, phase-locked loop, AC-coupled and DC-coupled, all
absent from the registry before this session); no executive photographs added,
because the company **publishes no leadership, management or board page in either
language** — a structural finding confirmed against its 143-URL sitemap rather
than assumed; report pins unchanged (X3's job).

**A formatting note, inherited and confirmed.** C6's round-trip harness was
rebuilt before anything was written and swept all 596 corpus JSON files: every
live profile, study guide, registry, concepts file and calendar reproduces
byte-identically under per-file detection of indent width, trailing newline and
ASCII escaping. The 68 that do not are archive snapshots and reports written with
compact single-line objects inside arrays — the `apex-clean-energy` class — none
of which this session touched. Confirming this **before** writing, rather than
discovering it in `git diff --stat` afterwards, is what kept the three step-7
revisions to 17-21 changed lines each instead of full re-serialisations.


**C8 — 2026-09-06, v04.82r, Opus 5 xhigh.** Two `developer` dossiers — Digital
Realty Trust (NYSE: DLR) and CyrusOne LLC, the corpus's first pair of **pure
data-centre landlords with no generation or storage business at all** — and
**fifteen** step-7 revisions from a twenty-dossier union, the largest
reconciliation tail any session has run. The checker exited 0 on the first run
with **0** findings of any kind: no reciprocal-type findings, **0** unregistered
sources, **0** dangling slugs once the registry was synced, **0** unregistered
project pins (`profiler-projects.json`, `Scraper.gs` and `Profiler.html`
untouched).

| Disposition | Count | Detail |
|-------------|-------|--------|
| reciprocal-type · **accepted** | **0** | — |
| reciprocal-type · **corrected** | **0** | Every new pair coheres by construction: `constellation-energy`→`cyrusone` `customer` against CyrusOne's `supplier`; `powerhouse-data-centers`→, `rosendin`→, `dpr`→ and `mitsubishi-electric`→`cyrusone` `customer` against CyrusOne's `supplier`; `eolian`↔`cyrusone` symmetric `partner`; `schneider-electric`→`digital-realty` `customer` against Digital Realty's `supplier`; `dpr`→`digital-realty` `customer` against Digital Realty's `supplier`; `nebius`→`digital-realty` `supplier` against Digital Realty's `customer`; `compass-datacenters`→, `qts`→ and `vantage`→`digital-realty` symmetric `partner`; and the symmetric `competitor` pairs `equinix`↔`digital-realty`, `digital-realty`↔`cyrusone`, `switch`→, `stack-infrastructure`→ and `aligned`→`digital-realty`, and `cyrusone`→`qts`/`aligned`/`compass-datacenters`/`prime-data-centers` |
| unregistered-source · **replaced** | **0** | Every relationship `source` was written as the exact registered string. The scratchpad validator was rebuilt first, as C6 and C7 both recommend, and asserted `sources[]` membership before either file was emitted; it reported 0 errors on the first run for both dossiers |
| unregistered-source · **registered** | **6** | Six step-7 edges needed a source the older dossier did not carry and registered it in the same edit — `constellation-energy` the Constellation Freestone release, `rosendin` the ENR Project Kincora award, `schneider-electric` the PR Newswire supply-capacity release, `equinix` and `stack-infrastructure` and `aligned` the Digital Realty FY2025 10-K, `qts` and `vantage` the Compass Infrastructure for America release, and `tract` the PR Newswire Teraco completion release. The `eolian`, `dpr`, `powerhouse-data-centers` and `mitsubishi-electric` edges cited URLs those dossiers already held |
| unregistered-source · **accepted** | **0** | — |

**A URL-fabrication near-miss, caught by the validator's design rather than by
the validator.** Three relationship `source` values in the first draft of the
Digital Realty dossier were URLs **constructed from plausible site structure**
rather than copied from a source — a Compass `/infrastructure-for-america/`
path, a DPR `/work/advanced-technology` path and a Nebius `/blog/posts/` path.
None existed. They were caught because the pre-emit validator requires every
relationship URL to be an exact member of `sources[]`, which forced the question
"where did this string come from?" before emission. The fix in each case was to
read the **registered** URL out of the counterparty dossier that already carried
the claim. This is a **different defect class from X2's clipped prefixes**: not a
copy error but an invention, and it is the one the no-fabrication rule exists
for. Worth recording because the guard that caught it was a membership assertion,
not a URL checker — a session that writes `source` as a bare label would not have
been protected.

**Step 7 substance, for the record — the largest tail in the program, and it did
not need a deferral.** Case-sensitive word-bounded greps returned **fifteen**
files for `\bDigital Realty\b` and **ten** for `\bCyrusOne\b`, a union of
**twenty**, of which **eighteen** carry something beyond executive career
history. All twenty were read; **fifteen were revised and archived** and five
were classified as needing no change. **Three carried claims the new research
contradicted.** `switch` grouped Digital Realty with Equinix as a "retail
incumbent" in both `productsAndServices` and a relationship `context` — a
category error, since Synergy measures Equinix as the retail leader at about 17%
while Digital Realty holds about **28% of the wholesale segment**, and Equinix's
own dossier describes competing for "the wholesale capacity Digital Realty
leads"; corrected in both places and a separate `digital-realty` edge added so
the two competitors are no longer conflated. `tract` recorded the Teraco
transaction as "the sale of **51%** to Digital Realty for about USD 3.5 billion"
— **both halves wrong**: the interest was **55%** and USD 3.5bn was Teraco's
**valuation**, not the consideration; the PR Newswire completion release says
"a majority interest ... in a transaction valuing Teraco at approximately $3.5
billion" and states no percentage or price, and Digital Realty raised the holding
to 77% in June 2026. `aligned` wrote "Ascenty (Digital Realty)", which implies a
subsidiary; the FY2025 10-K lists Ascenty among **unconsolidated entities at
49%**, and notes that percentage itself includes an approximate 2% interest held
by a non-controlling holder. Twelve more were accurate and gained curated edges
without a prose change: `constellation-energy`, `eolian`, `powerhouse-data-centers`,
`rosendin`, `dpr` (two edges, one per new slug), `mitsubishi-electric`,
`schneider-electric`, `equinix`, `compass-datacenters`, `qts`, `nebius` and
`stack-infrastructure`. Classified and **left alone**: `edgecore` and `nscale` are
pure executive career history; `mccarthy`'s **stated absence** — that no CyrusOne
project is named anywhere on its site or by any independent source — was
re-tested against a fresh third-party sweep and **remains accurate**;
`dominion-energy`'s single hit is a 2022 Data Center Frontier quotation about the
Loudoun constraint, accurate as history; and `prime-data-centers`'s mentions are
CBRE market-survey adjacencies (CyrusOne's Wood Dale in Chicago, both companies in
Madrid and Vernon) that the new research confirms.

**A false-positive class the brief predicted would not exist, and a real one it
missed.** The session brief stated plainly that "Digital Realty" and "CyrusOne"
are unambiguous proper nouns with no false-positive class, unlike C7's
`\bPower Electronics\b`. That held for the full names. It did **not** hold for
the abbreviation: the brief's watch item said a bare `DLR` in `aligned` and
`edgecore` is the ticker. In `aligned` it is — inside a career-history bullet. In
`edgecore` **all six hits are `DLR Group`, an architecture and engineering firm**,
which is not Digital Realty at all and is cited for a PUE figure and a building
capacity. A three-letter abbreviation that is also another firm's name is the
weaker cousin of the C7 case, and it argues for greping abbreviations separately
from names rather than trusting a brief's assurance that a name is unambiguous.

**A premise the brief refuted incorrectly, which is itself the finding.** The
brief stated that neither the Kansas City nor the Fairfield clause is
"corroborated anywhere in the current corpus", and noted that the "Fairfield"
hits in `esvolta` and `schneider-electric` are different places. Both statements
about those two files are right and the conclusion is wrong: the Fairfield claim
**was** already corroborated, in `constellation-energy`, under the **plant name**
rather than the town name — a 380 MW agreement plus an exclusive 380 MW Phase 2
adjacent to Calpine's **Freestone Energy Center**, which sits at 1366 FM488,
Fairfield, Texas. Searching the corpus for the place name missed it. **The
generalisable point for future sessions: a campus is named in dossiers by
whichever of town, county, plant or project code the source used, and a
single-term grep will miss the other three.** The same session also confirmed
that `constellation-energy`'s terse "~400 MW at Thad Hill" — which read like a
mis-transcribed executive name, Calpine's chief executive being Thad Hill — is in
fact **accurate**: the 2026-02-09 release names "the **Thad Hill Energy Center**
in Bosque County, Texas". Flagged as a candidate, tested, refuted, left alone.

**A negative finding that repeats C7's shape at a different layer.** There is
**no published ranking of AI-data-centre landlords**, and as with C7's PCS
suppliers the absence is structural rather than a search failure: analyst houses
rank colocation **revenue** share (Synergy), **markets** rather than operators
(Cushman & Wakefield, Structure Research), or **active IT load** across all
operator types (ABI Research). The one AI-specific index located — the AI Data
Center Index, current to July 2026 — ranks **facilities, not operators**, and
lists neither subject. Consequently the coverage plan's "largest missing AIDC
landlord" is **unfalsifiable rather than false**, and both dossiers say so in
`strategyRead` and in their study guides rather than repeating it. Two measurable
substitutes are recorded instead, and they disagree with each other by design:
USDataMap's tracked-capacity table puts CyrusOne at **3,026 MW** against Digital
Realty's **2,878 MW**, while ABI's active-IT-load measure puts Digital Realty at
**686 MW** against CyrusOne's **674 MW** — announced capacity against energised
capacity, a factor of roughly 4.5 apart for the same company.

**A provenance decision worth recording, in the conservative direction.** Digital
Realty's registry `domains` were limited to `digitalrealty.com` and its three
regional TLDs. **`digitalcorereit.com`, `teraco.co.za` and `ascenty.com` were
deliberately excluded** even though all three are group-adjacent: Digital Core
REIT is a separately listed Singapore vehicle that Digital Realty sponsors and
manages rather than a company channel, and Teraco and Ascenty are a 77%-held
subsidiary and a 49%-held unconsolidated joint venture respectively. Excluding
them tiers one cited source `independent` that could arguably have been
`company`, which **understates** the first-party share rather than inflating it —
the direction the schema says is safe. Final shares: **72% of 78 sources** for
Digital Realty and **38% of 69** for CyrusOne, the latter genuinely low because a
private company's record is mostly other people's reporting. On the CyrusOne side
`cyrusone.co.uk` was checked and **kept out**: it serves a "Launching Soon"
placeholder with no CyrusOne branding and is a parked third-party domain, the
same trap C7 recorded for `power-electronics.co.nz` in the opposite direction.

**Accept-list state.** 14 entries, unchanged. C8 wrote **no `investor` edge** —
KKR, Global Infrastructure Partners, BlackRock, Brookfield and Blackstone are all
uncovered slugs (Blackstone, Brookfield and Macquarie are C10 and not yet run), so
CyrusOne's sponsors and Digital Realty's largest joint-venture counterparty cannot
be linked at all. This is the **F7 shape** — a landlord whose owners sit outside
coverage — and it means the `investor` ↔ `portfolio` enum gap gained neither a
seventh instance nor any evidence either way. C10 will be the session that changes
this: once Blackstone and Brookfield are covered, Digital Realty's twenty
unconsolidated entities become linkable and the gap will be exercised hard.

**A note on the peer family, from a fifth end — and the first one that simplifies
the question.** F6, F7, F8, C5, C6 and C7 each observed `Colocation & Cloud
Capacity` mixing data-centre landlords with the F3-F5 storage developers, always
from the storage side or from a landlord that also develops power. Digital Realty
and CyrusOne are the corpus's **first pure landlords** — `developer` and nothing
else, no `ipp` tag, no generation, no storage, no PPA origination. For them the
family lights 28 cards of which the merchant battery owners are simply unrelated
businesses: no shared counterparty, no shared revenue model, no commercial
adjacency of any kind. That **undercuts C5's market-map defence**, which rested on
ENGIE, AES and RWE genuinely selling power to the landlords in the same family.
The defence does not generalise, and the case for a `renewables-developer` split is
stronger after C8 than before it. Recorded in `PROFILER-COVERAGE-PLAN.md` §7 for
X3; no family-map change was made.

**Cross-reference checker.** Exit 0, **no new candidate**; **324**
mutually-mentioning pairs compared (from 304 at v04.81r — the largest single-session
increase in the program, reflecting two landlords in a densely cross-referenced
part of the corpus). Accept list unchanged at 9 entries. Twenty scopes remain over
the 900-character cap and are listed as not examined.

**Side effects.** 145 dossiers on the roster; graph rebuilt to **1,128 edges (846
curated)**; eighteen shared concepts registered (**969 total** — REIT, AFFO, Core
FFO, cap rate, NOI, yield on cost, development spread, replacement cost, net lease,
same-store, UPREIT, take-private, hold period, continuation vehicle, promote income,
constant currency, CMBS and cross connect; two further proposals, 'development
margin' and 'promote', were **dropped as alias collisions caught before
registration**, the same guard that saved C5 and C7); **no executive photographs
added** — Digital Realty publishes eleven Cloudinary headshots and CyrusOne eight
HubSpot ones, and both sets were left for a later pass in favour of completing the
twenty-dossier step-7 tail, which is stated here rather than left as a silent
omission; report pins unchanged (X3's job).

**A README drift worth flagging, not fixed.** The README tree lists archived
dossier snapshots individually and is **32 files behind** — 313 entries against 345
on disk — with C5, C6 and C7's archives all missing. C8 added eighteen more and
**followed the precedent rather than adding them**, because unilaterally inserting
~350 lines into the README is beyond a dossier session's scope and the omission is
systematic rather than this session's. Either the tree should be regenerated
mechanically or archive snapshots should be excluded from it by rule; the developer
should decide which.

**A formatting note, inherited and confirmed a third time.** The round-trip harness
was rebuilt before anything was written and swept all 598 corpus JSON files: **529
reproduce byte-identically** under per-file detection of indent width, trailing
newline and ASCII escaping. The 69 that do not are `apex-clean-energy`, two reports
and 66 archive snapshots — the compact-single-line-object class — none of which this
session re-serialised. Two traps the harness caught in advance: the **refresh
calendar has no trailing newline** while every other file does, and
`profiler-concepts.json` is **indent=2** where the profiles are indent=1. The
seventeen step-7 revisions came to **8-20 changed lines each** rather than full
rewrites.


Developed by: LightAISolutions
