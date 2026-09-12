# Heron Power — Technology Lesson Plan

**Subject:** Heron Power (private; developer of Heron Link, a 34.5 kV AC to 800 V DC solid-state transformer for AI data centres) · **Written:** 2026-09-12 · **Baseline assumed:** high-school STEM physics, no electrical-engineering background.

**What this teaches.** The solid-state transformer as a machine: why one equation (V ≈ 4.44 · f · N · B · A) lets a kilohertz transformer fit in a suitcase, why every serious medium-voltage SST is built as a series stack of identical converter cells, what the three stages do and where each is hard, what iron still does better than silicon, and where a hall-edge SST slots into the 800 V DC data hall NVIDIA has specified — including the transformer-rectifier unit it must displace first.

**Why this gap.** The corpus teaches the rack shelf and the sidecar (Delta, LITEON, Megmeet, Vicor guides), the silicon (Infineon), the transformer factory (Hitachi Energy) and the grid boundary (ON.energy), but no guide walks through the conversion inside a solid-state transformer or explains the SST-versus-TRU choice that decides the 2027 and 2029 hall-edge blocks. Heron Link is the most completely specified SST in the public record, which makes it the right vehicle.

**Its place in the power-conversion set.** The hall-edge layer between the Hitachi Energy guide (the 60 Hz transformer and its supply chain) and the Megmeet and Vicor guides (the rack and the last centimetre). It owns the medium-frequency transformer, the cascaded cell architecture, DC fault behaviour and the SST-versus-TRU staging. The rack shelf, the sidecar and the silicon are held for their own guides.

## Module 1 — Why the rack outgrew alternating current
Power as voltage times current; wire loss rising with the square of current; why a megawatt rack cannot be fed at 54 V. NVIDIA's single-ended 800 V bus and what it rejected. The legacy chain of four conversions and the single conversion that replaces it — and the two candidate machines for that conversion.

## Module 2 — Frequency is the lever
The transformer equation and what each term means physically. Why 60 Hz needs tonnes of steel and 10 kHz needs a suitcase. Making voltage alternate at kilohertz as the job of power electronics, and therefore why an SST is a converter system rather than a component.

## Module 3 — The three stages
The input-series / output-parallel architecture. Stage 1, the cascaded H-bridge active front end and why the cell count is set by the silicon. Stage 2, the dual active bridge through a medium-frequency transformer, phase-shift power flow and bidirectionality, and why the MFT is the scarcest part. Stage 3, the paralleled 800 V bus and what its stiffness gives and costs. Cell arithmetic at 13.8 kV against 34.5 kV; redundancy as spares per phase with sub-cycle bypass.

## Module 4 — What iron still does better
Five limitations in the order an engineer raises them: the missing thermal reservoir (overload and inrush), fault handling and why DC has no current zero, insulation and partial discharge under fast edges, the reliability of hundreds of SiC modules and the fail-short problem, and the standards gap — DC arc-flash above all. For each, what a vendor design does about it.

## Module 5 — What the converter does better
Why the efficiency argument is a chain argument and not a component argument. Grid behaviour as the real leverage: unity power factor, reactive support, ride-through to a curve, grid-forming operation, current limiting. The native DC bus and the battery as the overload strategy. Footprint and lead time as the arguments that close sales.

## Module 6 — SST against the transformer-rectifier unit
The TRU as the proven-parts way to make the same bus. NVIDIA's staging: TRUs and sidecars for the 2027 halls, 34.5 kV-direct SSTs for the next generation. Why NVIDIA rating both at the same efficiency moves the contest to schedule, footprint and grid behaviour.

## Module 7 — Where Heron Link slots in
The hall-edge block mapped function by function onto the legacy chain: what it deletes (transformer, switchgear room, UPS, PDUs), what it keeps (the rack's DC-DC shelf), and how the 12 MW four-to-make-three block layers unit redundancy on cell redundancy. The unit-rating discrepancy in the company's own documents as a lesson in reading vendor specifications. Vendor cost and loss models as claims with vendor-chosen boundaries.

## Module 8 — The industry map
Who buys (the campus owner through its EPC, against a schedule), the four layers of the transition and who owns each, the hedged incumbents against the startups at the hall edge, the hyperscaler's conditional thousand-unit commitment as the tier's key commercial datapoint, and why arriving in 2027 versus 2029 changes which wave a vendor sells into.

## Pacing
Eight modules of roughly 30 minutes. Modules 2 and 3 are the technical core and should be taken together with the study guide's stage table open. Module 4 is the one to re-read before any conversation with a customer's engineer. Modules 6–8 are one argument about timing and can be read in a single sitting.

## Sources for the technology and industry content
Grounded in the company's dossier and the sources registered there, and in the repo's solid-state transformer primer (`repository-information/SOLID-STATE-TRANSFORMERS-PRIMER.pdf`), whose chapters 3–5 supply the stage-by-stage physics and the limitations ledger. No new technology research was carried out for this guide. No company's cost model, loss model or test result is used as teaching material except as an illustration of how to read a vendor specification. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
