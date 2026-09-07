# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-06 08:58 PM EST
**Repo version:** v04.95r — **one** push commit this session (`680f389`), merged to `main` as `850285c`, plus this housekeeping commit
**Branch:** `claude/guide-backfill-buyer-storage-rwwnu2` (restarted from `origin/main` after the merge — see below)
**Model:** Opus 5 xhigh — **guide-backfill session 1 of 6**, the five IPP buyer-side companies. Guides only.

### What was done

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

### Where we left off

Push merged (`850285c`). The branch was **restarted from `origin/main`** for this housekeeping commit, because the prior push had already merged and its history is now on `main`. All six checkers exit 0; roster/calendar bijection clean at 154; 133 guides and 1,073 concepts validate with zero errors and zero warnings. The developer asked for a paste-in prompt for backfill session 2 and this context write.

### Key decisions and findings

- **The programmatic collision check earned its keep on the first run.** Of 25 proposed concepts, one alias — `frequency-regulation`'s *regulation service* — was already registered under `ancillary-services`. A phrase search for the display term would not have found it. Method that worked: load the registry, build a lowercase map of **every term and every alias** (3,109 keys), test every proposed term and alias against it, report all hits at once. Also worth knowing: **83 of an initial 108 candidate terms were already registered**, several under differently-named slugs (`resource adequacy` → `planning-reserve-margin`, `capacity accreditation` → `elcc`, `cluster study` → `batch-study`, `letter of credit` → `credit-support`, `peaker` → `simple-cycle`). The registry is far deeper than a term-by-term intuition suggests — always check before writing a definition.
- **Extract the marker inventory from the finished guides, then intersect with the proposed concept set.** That step caught a 26th concept, `greenfield`, drafted as the obvious pair to the registered `brownfield` and used by nothing. Dropped before the merge. Intention is not usage; only the finished text is evidence.
- **Diff proportionality held everywhere.** `profiler-companies.json` was never opened. Concepts 168/0 (pure insertion, 24 alphabetically placed entries, no reordering), plan 5/5, README 22/1, CHANGELOG 42/1, version 1/1.
- **Serialisation conventions re-confirmed by round-trip**: `<slug>.study.json` is indent=1 / `ensure_ascii=False` / trailing newline; `profiler-concepts.json` is indent=2 / `ensure_ascii=False` / trailing newline. Each was asserted byte-exact before and after writing.
- **The designated branch already existed at merged history when the session opened** — checked out at exactly `origin/main`'s tip with a stale remote-tracking ref, while `git ls-remote` showed no `claude/*` branches at all. Fetch, prune, start fresh. The same thing happened again for this housekeeping commit after the v04.95r merge.
- **The checker's `{{term}}` trap is real and silent while authoring**: markers in `title`, `read` and `timeline.lanes.*` render as literal braces. All five guides were written with markers confined to `ps`/`intro`/`note`/`cards`/`rows`, and verified programmatically before the first checker run.

### Active context

- **Branch:** `claude/guide-backfill-buyer-storage-rwwnu2` · **repo version:** v04.95r · **Profiler page:** v01.83w (unchanged since v04.85r — every push since has been data-only)
- **Corpus:** 154 companies · 154 profiles · **133 study guides (21 backfills outstanding)** · 374 archived dossier versions · **1,073 concepts** · 85 study-prep directories
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 98/100**, counter verified against the real section count (`grep -c '^## \[v[0-9]'`). **Rotation fires on backfill session 3, or session 4 at the latest** — and the clone must be deepened *before* rotating, because SHA enrichment on the oldest groups fails silently on a shallow clone.
- **The 21 remaining backfills, grouped as §8 has them:** IPP buyer-side (4) `lightsource-bp` `nextera-energy-resources` `plus-power` `terra-gen`; bridge-power supplier (6) `voltagrid` `proenergy` `enchanted-rock` `mainspring-energy` `on-energy` `prevalon`; integrator (7) `canadian-solar` `crrc-zhuzhou` `envision-energy` `hyperstrong` `ls-energy-solutions` `sunwoda` `trina-storage`; EPC (4) `blattner` `mastec` `solv-energy` `samsung-ct`
- **No dossier errors were found to hand forward.** The five profiles were read for `productsAndServices`, `technicalSpecs` and `policyExposure` only; nothing read contradicted itself or the corpus.
- **Standing, unassigned:** the README *archive* listing is still well behind (the non-archive listing is exact); `archive/nvidia.profile.v2.json` is missing and cannot be reconstructed; OSHA IMIS and SEC EDGAR are both network-blocked from this environment.

### Recommendation for next session

- Run **guide-backfill session 2** on the six bridge-power suppliers — `voltagrid`, `proenergy`, `enchanted-rock`, `mainspring-energy`, `on-energy`, `prevalon` — on Opus 5 xhigh, guides only. They are the next coherent cluster, and the five buyer-side guides just shipped give them their teaching contrast: bridge power is what a buyer procures when the interconnection queue, not the equipment, is the thing it cannot wait for. Six guides is one more than this session carried, so budget the extra reading rather than the extra authoring.

**To continue:** type `run guide backfill session 2`

## Previous Sessions

### Session — Phase C session C12, the last three new companies (Opus 5 xhigh)

**Date:** 2026-09-06 08:23 PM EST
**Repo version:** v04.94r — **one** push commit this session (`e1324c7`), pushed to `claude/c11-landing-timeline-jmos13`, plus this housekeeping commit
**Branch:** `claude/c11-landing-timeline-jmos13` (no rebase needed — `origin/main` had not advanced)
**Model:** Opus 5 xhigh — Phase C session **C12**, the last three new companies in the coverage programme.

#### What was done

**v04.94r — C12: `whiting-turner`, `gotion`, `rept`.** Three dossiers at schema v7 / pv1 with schema-v2 study guides and lesson plans. 62 / 61 / 52 sources; 11 / 12 / 10 relationships; 11 / 9 / 10 guide sections. Six research subagents (two per company, first-party then third-party) ran in parallel, 9–25 minutes each.

**The corpus is now at 154 companies / 154 profiles / 154 calendar rows** — the figure X3's close-out assumes. 128 study guides, 1,049 concepts.

**Both §5 premises held, the FEOC one more sharply than the brief expected.** Verified against statute rather than trade coverage:
- **Gotion is a specified foreign entity twice over** — named in NDAA FY2024 §154(b) (one of exactly six: CATL, BYD, Envision, EVE, Gotion, Hithium) **and** PRC-incorporated. So its operating Manteno, Illinois plant **cannot claim §45X**, because status follows ownership not site; Defense procurement ban dated **2027-10-01**; the USD 2.4bn Michigan plant is dead with incentives clawed back and litigation running both ways.
- **REPT is named nowhere**, captured only by the incorporation prong §7701(a)(51)(B)(v). No US plant, no stranded capital; exposure runs solely through customers' material-assistance cost-ratio arithmetic. FY2026 NDAA **§842** would capture it from 2028-01-01 — trade coverage has missed this.
- **Three widely repeated Gotion claims are false**: NOT on UFLPA (2026-07-31 update), NOT on DoD §1260H (2026-06-08 update, unlike CATL/BYD/CALB/EVE), and the **NO GOTION Act was never enacted** (H.R. 524 at "introduced"). The **§30D framing behind all 2023–24 coverage is moot** — §30D terminated for vehicles acquired after 2025-09-30.

**Step 7 — 11 inbound mentions read, 6 dossiers revised, 5 confirmed accurate.** `turner-construction` v8, `vantage` v9, `byd` v7, `prevalon` v5, `jupiter-power` v6, `lightsource-bp` v6, each archived before editing.

**Plan bookkeeping:** §5's C12 row rewritten from hypothesis to record; §8's three rows flipped; §9.4's X3 row records its first precondition met; **§7's after-every-write list corrected from four scripts to six** plus the reachability probe.

#### Where we left off

Push merged. Working tree clean apart from this housekeeping commit. All six checkers exit 0 plus the probe. `Sections: 97/100` in CHANGELOG.md — **three pushes of headroom**. The developer asked for a paste-in prompt for the first guide-backfill session and this context write.

#### Key decisions and findings

- **I recorded a wrong reachability finding and the correction is now a rule.** One probe of `www.szse.cn` returned `000`; I wrote it into §7 as unreachable. A subagent then used the host successfully and a three-attempt re-probe returned **200 / 000 / 200** — intermittent, not down. §7 now says: sample a failing host at least three times before recording it as blocked. The failure mode is asymmetric — a false "blocked" narrows the research plan and is never contradicted, because nobody retries a host they have written off.
- **Two agent-reported "corpus errors" were artefacts of my own prompt wording.** `jupiter-power` already treats St Gall and Fort Stockton as one project; `prevalon` was already at pv4 with the Nextpower acquisition recorded. Reading the files rather than trusting the reports avoided two needless revisions — the over-calling failure mode §9.2 warns about.
- **The brief's claim that §9.4's ledger was empty was stale** (populated at v04.77r and v04.85r). I updated the X3 row instead of manufacturing an edit.
- **Do NOT sort `profiler-companies.json`.** I did, and it moved two pre-existing entries, inflating the diff from ~36 lines to 176. Rebuilt preserving original order → 62/4.
- **Check concept collisions programmatically, not by phrase.** Of 22 proposed concepts, three already existed under different display terms (`cm-at-risk`, `ipd`, `vdc`) and a phrase search missed all three. 19 were registered.
- **The relationships checker caught a fabricated URL before it shipped** — a RenewEconomy link reconstructed from a report had a plausible but wrong slug.
- **Serialisation traps confirmed empirically**: `apex-clean-energy.profile.json` plus exactly two report files refuse round-trip; `archive-index.json` and the refresh calendar are indent=2 with **no** trailing newline; profiles and guides are indent=1 with one. A byte-exact write helper was proven against all seven families before use.
- **The `s154-listed-bess-suppliers` report scope was corrected by raw string replacement**, never re-serialised — its rationale said "Gotion is listed but not covered by a dossier", which C12 made false. One line changed.

#### Active context

- **Branch:** `claude/c11-landing-timeline-jmos13` · **repo version:** v04.94r · **Profiler page:** v01.83w (unchanged since v04.85r — every push since has been data-only)
- **Corpus:** 154 companies · 154 profiles · **128 study guides (26 backfills outstanding)** · 374 archived dossier versions · 1,049 concepts
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG:** 97/100, counter verified against the real section count. **Rotation will fire inside the six-session backfill block** — deepen the clone first.
- **The 26 backfills, grouped as §8 has them:** IPP buyer-side (9) `apex-clean-energy` `arevon` `eolian` `jupiter-power` `key-capture-energy` `lightsource-bp` `nextera-energy-resources` `plus-power` `terra-gen`; bridge-power supplier (6) `voltagrid` `proenergy` `enchanted-rock` `mainspring-energy` `on-energy` `prevalon`; integrator (7) `canadian-solar` `crrc-zhuzhou` `envision-energy` `hyperstrong` `ls-energy-solutions` `sunwoda` `trina-storage`; EPC (4) `blattner` `mastec` `solv-energy` `samsung-ct`. §8 carries 27 backfill rows — `narada` is the 27th and is already done (`✓ · v04.51r`).
- **Two dated triggers now in the calendar:** Volkswagen's Gotion voting waiver expires ~**2027-12-15**, on which date it mechanically becomes controlling shareholder unless extended; FY2026 NDAA **§842** captures REPT from **2028-01-01**.
- **Standing, unassigned:** the README archive listing is well behind (the non-archive listing is exact at 282, matching disk); `archive/nvidia.profile.v2.json` is missing and cannot be reconstructed; OSHA IMIS and SEC EDGAR are both network-blocked from this environment.

#### Recommendation for next session

- Start the **guide backfills** with the five IPP buyer-side companies — `apex-clean-energy`, `arevon`, `eolian`, `jupiter-power`, `key-capture-energy` — on **Opus 5 xhigh**, guides only, no dossier edits. They are the largest thematic cluster, §6's `who-buys-storage` and `how-a-storage-project-happens` lessons depend on them, and starting now puts the CHANGELOG rotation early in the six-session block rather than against the deadline.

**To continue:** type `start the guide backfills`
