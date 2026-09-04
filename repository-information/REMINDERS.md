# Reminders for Developer

Notes and reminders the developer wants surfaced at the start of the next session. These are the developer's own notes — Claude surfaces them but does not modify, complete, or remove them without explicit developer approval.

## Active Reminders

- `2026-09-03 08:40:26 PM EST` — **Fable 5.1 High vs Opus 5 xhigh, tested on the Xcel Energy dossier** — have a Fable 5.1 High session re-run `profiler Xcel Energy` and report every change it made to the Opus 5 xhigh version, as a head-to-head model comparison for the `PROFILER-COVERAGE-PLAN.md` §2 model rule.
  - **The Opus baseline is `xcel-energy.profile.json` at repo version `v04.46r`** (commit `2652d30`, Phase B2). `profiler <Company>` **overwrites in place**, so the comparison must be taken from git: `git show v04.46r:live-site-pages/profiler-data/xcel-energy.profile.json` (or the commit SHA) against the working tree, or `git diff` once the Fable version is written. Save a copy of the Opus file to the scratchpad before the Fable run starts so the diff survives even if the tag or branch moves.
  - **Report the diff by section, not as a raw patch** — sources (count, first-party share, which ones each model found that the other did not), products and services, technical specs, financials and the KPI overlay, developments, relationships (which links each model was willing to assert and on what source), policy exposure, decision makers, and the strategy read judgment by judgment. The judgments and the relationship discipline are where §2 claims Fable is better; those are the sections to compare hardest.
  - **Read the diff with this caveat in view:** two research passes never see the same web. Different searches return different sources, hosts that were blocked one day answer the next, and the two research subagents are the same subagents either way. A large diff is therefore not by itself evidence of a model gap — it is partly search luck. The comparison is only meaningful where the *same fact* was available to both and the models treated it differently: a judgment one hedged and the other asserted, a relationship one declined for want of a source, a figure one blended and the other kept separate, a gap one stated and the other filled. Weight those; discount the rest.
  - Whichever version is kept, flip the §8 `xcel-energy` row to record it, and note the verdict in the §2 confidence note so the model rule keeps its evidence trail.

## Completed Reminders

*(none)*

Developed by: LightAISolutions
