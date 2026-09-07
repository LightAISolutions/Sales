# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-06 09:54 PM EST
**Repo version:** v04.96r — **one** push commit this session (`6873833`), merged to `main` as `68c423b`, plus this housekeeping commit
**Branch:** `claude/guide-backfill-session-2-iu6wxb` (restarted from `origin/main` after the merge — the remote branch was already deleted by the workflow)
**Model:** Opus 5 xhigh — **guide-backfill session 2 of 6**, the six bridge-power suppliers. Guides only.

### What was done

**v04.96r — six schema-v2 study guides plus lesson plans, no dossier touched.** `voltagrid` (11 sections), `proenergy` (9), `mainspring-energy` (10), `enchanted-rock` (9), `on-energy` (9), `prevalon` (10) — 58 sections. No `profileVersion` moved, nothing archived, `archive-index.json` untouched, `profiler-companies.json` never opened — and `profiler-graph.json` came back **byte-identical** after the rebuild (sha256 `563ae281…` before and after).

**The six were designed as one non-overlapping course, decided before any authoring.** The teaching frame is that bridge power exists because the interconnection queue, not the equipment, is what a buyer cannot wait for — so each guide owns one part of the machinery of getting power to a site before the grid can serve it:
- `voltagrid` — *the machine and the fuel*: the course entry point (why bridge power exists, and a six-technology map), the gas reciprocating engine, the four ISO 8528 ratings one engine carries, availability arithmetic and staging, inertia/RoCoF against a sub-second load swing, **the fuel chain as a second queue** with five separable failure points, Wobbe index and methane number, mobility as the residual-value argument
- `proenergy` — *the turbine and the heat rate*: Brayton cycle, aeroderivative against frame, **reading a heat rate through four incompatible conventions** with the LHV/HHV conversion worked, the hot-day derate and its two recoveries, equivalent operating hours and module exchange, build-prove-sell-retain-the-O&M
- `mainspring-energy` — *what comes out of the stack*: the Zeldovich exponential and why uniformity beats coolness, three ways to cool a flame and the fourth that removes it, what SCR demands in return, **why three "clean" claims are incomparable** (concentration/rate/annual mass + oxygen correction), attainment against non-attainment and an offset market that can be empty, the two mechanisms behind a flat part-load curve, the ammonia trap, the Carnot limit
- `enchanted-rock` — *how many hours, and whose asset*: duty as a **legal** class, the emergency class and the hours that cost you it, potential-to-emit arithmetic and where threshold engineering becomes paper fragmentation, aggregation and its three constraints, private against utility-owned bridge under an approved rate, **the utility tariff** (demand charges, standby service rates, flexible load interconnection)
- `on-energy` — *the campus as a grid citizen*: the voltage ladder, the transient travelling both ways, ride-through as a depth-against-duration curve, double conversion at medium voltage, grid-forming against grid-following, buying an earlier connection with curtailment, the five protection questions
- `prevalon` — *the block, the mixture, and the ending*: DC against AC blocks, the six layers in an enclosure, the five datasheet numbers and the cooling-against-efficiency trade, thermal runaway against deflagration tested at full scale, the plant controller's division of labour, hardware-in-the-loop, **what remains when the wires arrive** — the course's closing argument

**Every guide points at session 1's work rather than rebuilding it** — chemistry to `rept`/`gotion`, revenue to `eolian`, dispatch to `jupiter-power`, the queue to `apex-clean-energy`, the regulated buyer to `key-capture-energy`. That cross-reference convention now holds across both backfill sessions.

**39 concepts registered** (1,073 → 1,112): the machines (`reciprocating-engine`, `linear-generator`, `free-piston`, `spark-ignition`, `turbocharging`, `engine-core`, `ac-block`, `string-pcs`, `mobile-generation`); thermodynamics and measurement (`lhv`, `hhv`, `carnot-limit`, `oxygen-correction`, `water-injection`); emissions (`thermal-nox`, `ammonia-slip`, `oxidation-catalyst`, `particulate-matter`, `criteria-pollutant`, `bact`, `emission-offsets`, `potential-to-emit`); the fuel chain (`cng`, `lng`, `rng`, `hydrogen`, `ammonia`, `wobbe-index`, `methane-number`, `gas-lateral`, `firm-transportation`, `virtual-pipeline`); the interface and commercial layer (`low-voltage-ride-through`, `voltage-sag`, `flexible-load-interconnection`, `standby-service-rate`, `deflagration`, `hardware-in-the-loop`, `o-and-m`).

**README tree audit found no orphans** — the only gaps in `study-prep/` and `profiler-data/` were this session's own six additions. Session 1 had already cleaned up C12's three. Listings now exact at 91 study-prep directories and 298 profiler-data files.

### Where we left off

Push merged (`68c423b`). The branch was restarted from `origin/main` for this housekeeping commit. All six checkers exit 0; roster/calendar bijection clean at 154; 139 guides and 1,112 concepts validate with zero errors and zero warnings. The developer asked for a paste-in prompt for backfill session 3 and this context write.

### Key decisions and findings

- **The unhyphenated-term collision is now a repeat offence, and it deserves a fix.** Of 292 strings tested across three passes against 3,151 registry keys, three collisions were invisible to a phrase search: `speed-to-power` is registered as term **"speed to power"** (no hyphens), `stranded asset` resolves to `stranded-cost`, and `residual value` to `residual-value-support`. A fourth, `Title V permit`, is an alias of `air-permit`. Session 1 hit the same *class* of miss on an alias. **The durable fix is to normalise hyphens, spaces and case when building the collision map — not just lowercase it.** A future session should do that before proposing terms; it closes the whole class.
- **The registry was far deeper on bridge power than expected**, which changed the authoring rather than just the registration. `prime-power`, `standby-rating`, `continuous-rating`, `iso-8528`, `bridge-power`, `minor-source`, `major-source`, `air-permit`, `emergency-generator`, `rice-neshap`, `droop`, `inertia`, `rocof`, `synchronous-condenser`, `dln-combustor`, `lean-burn`, `heat-rate`, `part-load`, `non-attainment-area`, `ride-through`, `large-load-interconnection` and `dc-block` all already existed. **97 of 173 first-pass candidates were already registered.** The guides were written on that vocabulary rather than around it — always read the existing defs, because the guide text has to agree with them.
- **The checker is the marker-inventory tool, and using it that way is the efficient order.** Write the guides first, run `check-profiler-study.py`, and its `unresolved {{…}}` errors *are* the exact registration ledger. That pruned the proposed set from ~45 to 39 — `power turbine`, `hot section`, `city gate`, `MMBtu`, `protective relay`, `pad-mount transformer`, `run-hour limit` and `hybrid plant` had definitions drafted and were never used, so they were dropped. Same lesson as session 1's `greenfield`.
- **Zero structural errors on the first checker run for all six guides.** Markers were confined to `ps`/`intro`/`note`/`cards`/`rows` from the start; `title`, `read` and `timeline.lanes.*` were kept clean, and quiz items carry no markers at all (matching session 1).
- **Diff proportionality held exactly**: concepts 344/0 (pure insertion, 39 alphabetical entries, no existing entry moved — asserted programmatically), README 19/1, CHANGELOG 37/1, plan 6/6, version 1/1, plus 12 new files. Nothing else.
- **Serialisation re-confirmed by round-trip** before *and* after every write: `<slug>.study.json` indent=1 / `ensure_ascii=False` / trailing newline; `profiler-concepts.json` indent=2 / same. A shared writer helper asserted byte-equality on each file.
- **Pre-existing alphabetical ordering breaks in the README tree were left alone** — 8 in the `profiler-data` listing, 5 in `study-prep`. None involves this session's entries; fixing them would have inflated the diff for no benefit.
- **The graph byte-identity check is cheap and worth keeping as the standard guides-only proof.** Copy `profiler-graph.json`, rebuild, `cmp`. It takes seconds and is the only evidence that no dossier was touched that does not depend on remembering not to touch one.

### Active context

- **Branch:** `claude/guide-backfill-session-2-iu6wxb` · **repo version:** v04.96r · **Profiler page:** v01.83w (unchanged since v04.85r — every push since has been data-only)
- **Corpus:** 154 companies · 154 profiles · **139 study guides (15 backfills outstanding)** · 374 archived dossier versions · **1,112 concepts** · 91 study-prep directories
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 99/100**, counter verified against the real section count (`grep -c '^## \[v[0-9]'` returned 98 before this push). **Rotation fires on the NEXT push — it is now unavoidable, not merely likely.** The oldest whole date group is **three sections dated 2026-08-31**, then thirteen dated 2026-09-01. The working clone is **shallow at 50 commits**, so deepen it (`git fetch --deepen=500` or `--unshallow`) *before* rotating or SHA enrichment on the oldest headers fails silently. Budget ~10 minutes.
- **The 15 remaining backfills, grouped as §8 has them:** integrator (7) `canadian-solar` `crrc-zhuzhou` `envision-energy` `hyperstrong` `ls-energy-solutions` `sunwoda` `trina-storage`; EPC (4) `blattner` `mastec` `solv-energy` `samsung-ct`; IPP buyer-side (4) `lightsource-bp` `nextera-energy-resources` `plus-power` `terra-gen`
- **No dossier errors were found to hand forward.** The six profiles were read for `productsAndServices` and `technicalSpecs` only; nothing read contradicted itself or the corpus.
- **Standing, unassigned:** the README *archive* listing is still well behind (the non-archive listing is exact); `archive/nvidia.profile.v2.json` is missing and cannot be reconstructed; OSHA IMIS and SEC EDGAR are both network-blocked from this environment.

### Recommendation for next session

- Run **guide-backfill session 3** on the seven integrators — `canadian-solar`, `crrc-zhuzhou`, `envision-energy`, `hyperstrong`, `ls-energy-solutions`, `sunwoda`, `trina-storage` — on Opus 5 xhigh, guides only, deepening the clone first because that session carries the CHANGELOG rotation. It is the largest remaining cluster and now has both flanks taught: session 1 gave it the buyer's economics and session 2 the equipment layer, so the integrator guides can teach what an integrator actually adds between a cell and a project without re-deriving either end.

**To continue:** type `run guide backfill session 3`

## Previous Sessions

### Session — Guide-backfill session 1, the five IPP buyer-side guides (Opus 5 xhigh)

**Date:** 2026-09-06 08:58 PM EST
**Repo version:** v04.95r — **one** push commit this session (`680f389`), merged to `main` as `850285c`, plus this housekeeping commit
**Branch:** `claude/guide-backfill-buyer-storage-rwwnu2` (restarted from `origin/main` after the merge — see below)
**Model:** Opus 5 xhigh — **guide-backfill session 1 of 6**, the five IPP buyer-side companies. Guides only.

#### What was done

**v04.95r — five schema-v2 study guides plus lesson plans, no dossier touched.** `apex-clean-energy` (10 sections), `arevon` (11), `eolian` (10), `jupiter-power` (9), `key-capture-energy` (9). No `profileVersion` moved, nothing archived, `archive-index.json` untouched — and `profiler-graph.json` came back **byte-identical** after the rebuild, which is independent proof the guides-only constraint held.

**The five were designed as one non-overlapping course, not five variations.** That decision was taken up front and is the reason they are worth reading in order:
- `apex-clean-energy` — *the project lifecycle*: the development funnel and its attrition, the interconnection queue as the scarce asset, setback geometry and fire code as engineering inputs, the four-layer capital stack and why the tax-credit buyer's diligence (not a procurement policy) picks the supplier, attached against standalone, integrator insolvency as a warranty problem
- `arevon` — *the offtake contract*: the resource-adequacy obligation as the source of demand, five contract forms and their risk allocation, ELCC against net qualifying capacity, the saturation mechanism by which storage erodes its own accreditation, DC- against AC-coupling, tax equity against credit transfer, single-supplier concentration read as a deliberate trade, safety as a specification
- `eolian` — *the revenue stack*: four layers and their sharply different saturation behaviour, why reserves stop paying in every maturing market, the same battery as five businesses in ERCOT/CAISO/PJM/MISO/NYISO, duration as an asymmetric bet, forward capacity as a financing instrument, the connection as currency
- `jupiter-power` — *dispatch*: inventory with an option attached, day-ahead as a hedge, four interacting inputs to an offer curve, warranty as a throughput budget, co-optimisation as a capital-allocation input, keeping or selling the dispatch right
- `key-capture-energy` — *the regulated purchase*: resource plan to solicitation to commission approval, prudence review as the discipline behind every regulated preference, five structures, locational value, non-wires alternatives, three shapes of state incentive, being a market's first battery

**Every guide opens by pointing chemistry back at `rept` and `gotion`** rather than re-teaching cells, containers or thermal design. That cross-reference is now the corpus convention for buyer-side guides.

**24 concepts registered** (1,049 → 1,073): the market names the corpus lacked (`nyiso`, `iso-ne`, `icap`, `reliability-pricing-model`), the revenue anatomy (`revenue-stack`, `frequency-regulation`, `non-spinning-reserve`, `day-ahead-market`, `real-time-market`, `locational-marginal-price`, `offer-curve`, `degradation-cost`, `must-offer-obligation`), accreditation and siting (`net-qualifying-capacity`, `duck-curve`, `setback`, `network-upgrades`, `energy-only-interconnection`), procurement (`system-integrator`, `capacity-maintenance-agreement`, `non-wires-alternative`, `solar-peaker`, `energy-plus-load`, `speed-to-power`).

**Also fixed three README tree entries C12 never added** — `study-prep/gotion/`, `study-prep/rept/`, `study-prep/whiting-turner/`. Found by the [PC-README-TREE] completeness audit, not reported by anyone. The study-prep listing is now exact at 85 directories.

#### Where we left off

Push merged (`850285c`). The branch was **restarted from `origin/main`** for this housekeeping commit, because the prior push had already merged and its history is now on `main`. All six checkers exit 0; roster/calendar bijection clean at 154; 133 guides and 1,073 concepts validate with zero errors and zero warnings. The developer asked for a paste-in prompt for backfill session 2 and this context write.

#### Key decisions and findings

- **The programmatic collision check earned its keep on the first run.** Of 25 proposed concepts, one alias — `frequency-regulation`'s *regulation service* — was already registered under `ancillary-services`. A phrase search for the display term would not have found it. Method that worked: load the registry, build a lowercase map of **every term and every alias** (3,109 keys), test every proposed term and alias against it, report all hits at once. Also worth knowing: **83 of an initial 108 candidate terms were already registered**, several under differently-named slugs (`resource adequacy` → `planning-reserve-margin`, `capacity accreditation` → `elcc`, `cluster study` → `batch-study`, `letter of credit` → `credit-support`, `peaker` → `simple-cycle`). The registry is far deeper than a term-by-term intuition suggests — always check before writing a definition.
- **Extract the marker inventory from the finished guides, then intersect with the proposed concept set.** That step caught a 26th concept, `greenfield`, drafted as the obvious pair to the registered `brownfield` and used by nothing. Dropped before the merge. Intention is not usage; only the finished text is evidence.
- **Diff proportionality held everywhere.** `profiler-companies.json` was never opened. Concepts 168/0 (pure insertion, 24 alphabetically placed entries, no reordering), plan 5/5, README 22/1, CHANGELOG 42/1, version 1/1.
- **Serialisation conventions re-confirmed by round-trip**: `<slug>.study.json` is indent=1 / `ensure_ascii=False` / trailing newline; `profiler-concepts.json` is indent=2 / `ensure_ascii=False` / trailing newline. Each was asserted byte-exact before and after writing.
- **The designated branch already existed at merged history when the session opened** — checked out at exactly `origin/main`'s tip with a stale remote-tracking ref, while `git ls-remote` showed no `claude/*` branches at all. Fetch, prune, start fresh. The same thing happened again for this housekeeping commit after the v04.95r merge.
- **The checker's `{{term}}` trap is real and silent while authoring**: markers in `title`, `read` and `timeline.lanes.*` render as literal braces. All five guides were written with markers confined to `ps`/`intro`/`note`/`cards`/`rows`, and verified programmatically before the first checker run.

#### Active context

- **Branch:** `claude/guide-backfill-buyer-storage-rwwnu2` · **repo version:** v04.95r · **Profiler page:** v01.83w (unchanged since v04.85r — every push since has been data-only)
- **Corpus:** 154 companies · 154 profiles · **133 study guides (21 backfills outstanding)** · 374 archived dossier versions · **1,073 concepts** · 85 study-prep directories
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 98/100**, counter verified against the real section count (`grep -c '^## \[v[0-9]'`). **Rotation fires on backfill session 3, or session 4 at the latest** — and the clone must be deepened *before* rotating, because SHA enrichment on the oldest groups fails silently on a shallow clone.
- **The 21 remaining backfills, grouped as §8 has them:** IPP buyer-side (4) `lightsource-bp` `nextera-energy-resources` `plus-power` `terra-gen`; bridge-power supplier (6) `voltagrid` `proenergy` `enchanted-rock` `mainspring-energy` `on-energy` `prevalon`; integrator (7) `canadian-solar` `crrc-zhuzhou` `envision-energy` `hyperstrong` `ls-energy-solutions` `sunwoda` `trina-storage`; EPC (4) `blattner` `mastec` `solv-energy` `samsung-ct`
- **No dossier errors were found to hand forward.** The five profiles were read for `productsAndServices`, `technicalSpecs` and `policyExposure` only; nothing read contradicted itself or the corpus.
- **Standing, unassigned:** the README *archive* listing is still well behind (the non-archive listing is exact); `archive/nvidia.profile.v2.json` is missing and cannot be reconstructed; OSHA IMIS and SEC EDGAR are both network-blocked from this environment.

#### Recommendation for next session

- Run **guide-backfill session 2** on the six bridge-power suppliers — `voltagrid`, `proenergy`, `enchanted-rock`, `mainspring-energy`, `on-energy`, `prevalon` — on Opus 5 xhigh, guides only. They are the next coherent cluster, and the five buyer-side guides just shipped give them their teaching contrast: bridge power is what a buyer procures when the interconnection queue, not the equipment, is the thing it cannot wait for. Six guides is one more than this session carried, so budget the extra reading rather than the extra authoring.

**To continue:** type `run guide backfill session 2`
