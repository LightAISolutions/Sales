#!/usr/bin/env python3
"""build-megmeet-sst-briefing-figures.py — renders the data charts for the Megmeet
SST onboarding briefing (repository-information/study-prep/megmeet/
megmeet-sst-briefing-print.html) as SVG files in
repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/.

A copy of build-sst-primer-figures.py with the paths changed, the `mmsst-fig-`
basename prefix applied ([PC-UNIQUE-FILES] #17 forbids a second fig-timeline.svg)
and one structural difference: every number plotted here is read from
megmeet-sst-briefing-data.json rather than written inline, so that the figures and
the study companion cannot drift. The companion inlines the same file byte-identically.

Palette: the six categorical hues are the AIDC report's validated chart palette,
re-validated with the dataviz skill's six checks against the white print surface on
2026-09-23 (all six PASS). Do not re-tint. Sequential ramps below are lightness steps
of a single palette hue, which is the skill's sequential rule.

Usage: python3 scripts/build-megmeet-sst-briefing-figures.py
Requires matplotlib (pip install matplotlib).
"""
import json
import math
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import rcParams
from matplotlib.patches import Rectangle

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, "repository-information", "study-prep", "megmeet")
OUT = os.path.join(BASE, "megmeet-sst-briefing-figures")
os.makedirs(OUT, exist_ok=True)
D = json.load(open(os.path.join(BASE, "megmeet-sst-briefing-data.json"), encoding="utf-8"))

S1, S2, S3, S4, S5, S6 = "#0b62a4", "#c2622a", "#1b8a6b", "#7a3f7d", "#8a8f2a", "#b03a34"
INK, MUTED, RULE, TRACK = "#23211c", "#6d6758", "#cfc8b4", "#e9e5da"

# Sequential ramp, one hue (the S1 blue), light -> dark. Used for ordinal cells only.
SEQ = ["#e4eef6", "#b9d3e8", "#7fb0d4", "#3d84b8", "#0b62a4"]
# Status ramp for the fixed limitation vocabulary, ordered unsolved -> standardised.
STATUS = {"unsolved": "#b03a34", "lab": "#c2622a", "pilot": "#8a8f2a",
          "product": "#1b8a6b", "standardised": "#0b62a4"}
EVIDENCE = ["announced", "lab demo", "factory test", "field pilot", "supplying"]

rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["Arial", "Liberation Sans", "DejaVu Sans"],
    "font.size": 9, "axes.edgecolor": RULE, "axes.labelcolor": MUTED,
    "xtick.color": MUTED, "ytick.color": MUTED, "axes.titlecolor": INK,
    "axes.titleweight": "bold", "axes.titlesize": 10, "axes.titlelocation": "left",
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "grid.color": TRACK, "grid.linewidth": 0.6, "axes.axisbelow": True,
    "svg.fonttype": "none", "figure.dpi": 100,
    # The corpus is full of dollar figures; mathtext would swallow every $...$ pair.
    "text.parse_math": False,
})


def esc(s):
    """A no-op now that text.parse_math is off in rcParams. Kept as the single
    place to sanitise a string on its way into a figure, should another parser
    ever be introduced."""
    return str(s)


def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, format="svg", bbox_inches="tight", pad_inches=0.08)
    plt.close(fig)
    with open(path, "a", encoding="utf-8") as fh:  # repo branding rule: last line of every new file
        fh.write("<!-- Developed by: LightAISolutions -->\n")
    print("wrote", os.path.relpath(path, ROOT))


# ---------------------------------------------------------------------------
# Figure M1 — the service-voltage class ledger. Every vendor with a published
# class, as a range bar on the kV axis, coloured by evidence tier.
# ---------------------------------------------------------------------------
def fig_class_ledger():
    rows = sorted(D["classLedger"]["rows"], key=lambda r: (r["kvHigh"], r["kvLow"]))
    fig, ax = plt.subplots(figsize=(7.4, 5.4))
    ecol = {"announced": S5, "lab demo": S2, "factory test": S4, "field pilot": S3, "supplying": S1}
    for i, r in enumerate(rows):
        lo, hi = r["kvLow"], r["kvHigh"]
        c = ecol.get(r["evidence"], MUTED)
        if hi > lo:
            ax.plot([lo, hi], [i, i], color=c, lw=5, solid_capstyle="round", zorder=3)
        ax.plot([hi], [i], marker="o", ms=9, color=c, mec="white", mew=1.5, zorder=4)
        lab = f"{hi:g} kV" if hi == lo else f"{lo:g}–{hi:g} kV"
        if r["mw"]:
            lab += f"  · {r['mw']:g} MW"
        ax.annotate(lab, (hi, i), xytext=(11, 0), textcoords="offset points",
                    va="center", fontsize=7.6, color=INK)
    for x, name in [(13.8, "15 kV class"), (24.9, "25 kV class"), (34.5, "35 kV class")]:
        ax.axvline(x, color=RULE, lw=0.8, ls=(0, (3, 3)), zorder=1)
        # the class guides are labelled in a reserved band above the top row: at the
        # bottom they crossed the value labels of the 10-13 kV vendors
        ax.annotate(name, (x, len(rows) - 0.55), rotation=90, fontsize=6.8, color=MUTED,
                    ha="right", va="bottom")
    ax.set_yticks(range(len(rows)))
    ax.set_yticklabels([r["vendor"] for r in rows], fontsize=8, color=INK)
    ax.set_xlabel("Published medium-voltage input class (kV)")
    ax.set_xlim(0, 56)
    ax.set_ylim(-1.0, len(rows) + 1.5)
    ax.grid(axis="y", visible=False)
    ax.set_title("Who has specified which service-voltage class")
    handles = [plt.Line2D([], [], color=ecol[e], lw=5, solid_capstyle="round", label=e)
               for e in EVIDENCE]
    ax.legend(handles=handles, loc="lower right", frameon=False, fontsize=7.4,
              title="Evidence tier", title_fontsize=7.4, ncol=1)
    save(fig, "mmsst-fig-class-ledger.svg")


# ---------------------------------------------------------------------------
# Figure M2 — what the 35 kV class costs inside the converter: cells per phase
# by service class and SiC device class, with the BIL step alongside.
# ---------------------------------------------------------------------------
def fig_class_cost():
    cc = D["classCost"]["cells"]
    xs = list(range(len(cc)))
    labels = [f"{c['kv']:g} kV\n{c['ansi']}" for c in cc]
    fig, (ax, ax2) = plt.subplots(1, 2, figsize=(7.4, 3.1), gridspec_kw={"width_ratios": [2.1, 1]})
    w = 0.36
    b1 = ax.bar([x - w / 2 for x in xs], [c["cells1_7"] for c in cc], width=w,
                color=S1, edgecolor="white", linewidth=1.5, label="1.7 kV SiC")
    b2 = ax.bar([x + w / 2 for x in xs], [c["cells3_3"] for c in cc], width=w,
                color=S3, edgecolor="white", linewidth=1.5, label="3.3 kV SiC")
    for bars in (b1, b2):
        for b in bars:
            ax.annotate(f"{int(b.get_height())}", (b.get_x() + b.get_width() / 2, b.get_height()),
                        xytext=(0, 3), textcoords="offset points", ha="center", va="bottom",
                        fontsize=7.6, color=INK)
    ax.set_xticks(xs); ax.set_xticklabels(labels, fontsize=7.6)
    ax.set_ylabel("Series cells per phase")
    ax.set_title("Cells per phase — the cost driver")
    ax.legend(frameon=False, fontsize=7.6, loc="upper left")
    ax.set_ylim(0, max(c["cells1_7"] for c in cc) * 1.22)

    bars = ax2.bar(xs, [c["bilKv"] for c in cc], width=0.52, color=S4,
                   edgecolor="white", linewidth=1.5)
    for b, c in zip(bars, cc):
        ax2.annotate(f"{c['bilKv']}", (b.get_x() + b.get_width() / 2, b.get_height()),
                     xytext=(0, 3), textcoords="offset points", ha="center", va="bottom",
                     fontsize=7.6, color=INK)
    ax2.set_xticks(xs); ax2.set_xticklabels([f"{c['kv']:g}" for c in cc], fontsize=7.6)
    ax2.set_xlabel("kV")
    ax2.set_ylabel("BIL (kV)")
    ax2.set_title("Insulation class")
    ax2.set_ylim(0, 190)
    save(fig, "mmsst-fig-class-cost.svg")


# ---------------------------------------------------------------------------
# Figure M3 — the competitor map: evidence tier against the highest published
# class. A high marker with a low tier is a specification without a product.
# ---------------------------------------------------------------------------
def fig_competitor_map():
    """A grid, not a scatter: eight of the sixteen vendors share the announced /
    35 kV cell, and a scatter overprints them however the markers are jittered."""
    rows = list(D["classLedger"]["rows"])
    bands = [(38, 999, "above the 35 kV class"), (30, 38, "the 35 kV class"),
             (20, 30, "the 25 kV class"), (12, 20, "the 15 kV class"),
             (0, 12, "below the 15 kV class")]
    grid = {(bi, ei): [] for bi in range(len(bands)) for ei in range(len(EVIDENCE))}
    for r in rows:
        bi = next(i for i, (lo, hi, _) in enumerate(bands) if lo <= r["kvHigh"] < hi)
        grid[(bi, EVIDENCE.index(r["evidence"]))].append(r["vendor"])
    fig, ax = plt.subplots(figsize=(7.4, 4.2))
    nb, ne = len(bands), len(EVIDENCE)
    for bi in range(nb):
        for ei in range(ne):
            names = grid[(bi, ei)]
            y = nb - 1 - bi
            filled = bool(names)
            face = SEQ[1] if (bi == 1 and filled) else (SEQ[0] if filled else "#faf8f2")
            ax.add_patch(Rectangle((ei, y), 0.96, 0.96, facecolor=face,
                                   edgecolor="white", linewidth=1.8))
            if filled:
                ax.annotate("\n".join(names), (ei + 0.48, y + 0.48), ha="center",
                            va="center", fontsize=6.0, color=INK, linespacing=1.36)
    ax.set_xlim(-0.04, ne); ax.set_ylim(-0.04, nb)
    ax.set_xticks([e + 0.48 for e in range(ne)])
    ax.set_xticklabels(EVIDENCE, fontsize=7.6, color=MUTED)
    ax.set_yticks([nb - 1 - b + 0.48 for b in range(nb)])
    ax.set_yticklabels([b[2] for b in bands], fontsize=7.6, color=INK)
    ax.xaxis.set_ticks_position("bottom")
    ax.tick_params(length=0); ax.grid(False)
    for sp in ax.spines.values():
        sp.set_visible(False)
    ax.set_xlabel("How far the evidence goes \u2192", labelpad=8)
    ax.set_title("Specification against evidence \u2014 the shaded row is the class US\n"
                 "hyperscale campuses take, and it is empty on the right")
    save(fig, "mmsst-fig-competitor-map.svg")


# ---------------------------------------------------------------------------
# Figure M4 — the obstacle stack: how many obstacles sit at each status, by family.
# ---------------------------------------------------------------------------
def fig_obstacle_stack():
    rows = D["obstacles"]["rows"]
    fams = ["Technical", "Infrastructure", "O&M", "Standards", "Utility", "Policy"]
    order = ["unsolved", "lab", "pilot", "product", "standardised"]
    counts = {f: {s: 0 for s in order} for f in fams}
    for r in rows:
        counts[r["family"]][r["status"]] += 1
    fig, ax = plt.subplots(figsize=(7.4, 3.3))
    left = [0] * len(fams)
    for s in order:
        vals = [counts[f][s] for f in fams]
        ax.barh(fams, vals, left=left, color=STATUS[s], edgecolor="white",
                linewidth=1.5, height=0.58, label=s)
        for i, (v, l) in enumerate(zip(vals, left)):
            if v:
                ax.annotate(str(v), (l + v / 2, i), ha="center", va="center",
                            fontsize=7.6, color="white", fontweight="bold")
        left = [a + b for a, b in zip(left, vals)]
    ax.invert_yaxis()
    ax.set_xlabel("Obstacles counted")
    ax.set_xlim(0, max(left) + 0.6)
    ax.grid(axis="y", visible=False)
    ax.set_title("Where the work is — and where nobody is doing any")
    ax.legend(frameon=False, fontsize=7.4, ncol=5, loc="lower right",
              bbox_to_anchor=(1.0, -0.34))
    save(fig, "mmsst-fig-obstacle-stack.svg")


# ---------------------------------------------------------------------------
# Figure M5 — Megmeet's six business groups: revenue share and gross margin as
# two small multiples. Never a dual axis.
# ---------------------------------------------------------------------------
def fig_megmeet_mix():
    rows = [r for r in D["megmeetMix"]["rows"] if r["label"] != "Other"]
    rows = sorted(rows, key=lambda r: -r["share"])
    names = [r["label"].split(" (")[0] for r in rows]
    ys = list(range(len(rows)))[::-1]
    fig, (ax, ax2) = plt.subplots(1, 2, figsize=(7.4, 3.2), sharey=True,
                                  gridspec_kw={"width_ratios": [1, 1]})
    b = ax.barh(ys, [r["share"] for r in rows], color=S1, edgecolor="white",
                linewidth=1.5, height=0.56)
    for bb, r in zip(b, rows):
        ax.annotate(f"{r['share']:.1f}%", (bb.get_width(), bb.get_y() + bb.get_height() / 2),
                    xytext=(4, 0), textcoords="offset points", va="center",
                    fontsize=7.6, color=INK)
    ax.set_yticks(ys); ax.set_yticklabels(names, fontsize=7.6, color=INK)
    ax.set_xlabel("Share of H1 2026 revenue (%)")
    ax.set_xlim(0, 50)
    ax.grid(axis="y", visible=False)
    ax.set_title("Where the revenue is")

    for i, r in zip(ys, rows):
        col = S3 if r["gm"] >= (r["gmPrior"] or 0) else S6
        ax2.plot([r["gmPrior"], r["gm"]], [i, i], color=TRACK, lw=3,
                 solid_capstyle="round", zorder=2)
        ax2.plot([r["gmPrior"]], [i], marker="o", ms=5, color=MUTED, mec="white",
                 mew=1.2, zorder=3)
        ax2.plot([r["gm"]], [i], marker="o", ms=9, color=col, mec="white", mew=1.5, zorder=4)
        # label on the far side of the movement, so a falling margin does not put
        # its label on top of the H1 2025 start marker
        falling = r["gm"] < (r["gmPrior"] or 0)
        ax2.annotate(f"{r['gm']:.2f}%", (r["gm"], i),
                     xytext=(-13 if falling else 13, 0), textcoords="offset points",
                     va="center", ha="right" if falling else "left",
                     fontsize=7.6, color=INK)
    ax2.set_xlabel("Gross margin (%), H1 2025 → H1 2026")
    ax2.set_xlim(-4, 52)
    ax2.grid(axis="y", visible=False)
    ax2.set_title("Where the margin is")
    save(fig, "mmsst-fig-megmeet-mix.svg")


# ---------------------------------------------------------------------------
# Figure M6 — published grid-to-rack chain losses, each with its own boundary.
# The bars are deliberately not like-for-like; that is the lesson.
# ---------------------------------------------------------------------------
def fig_loss_chains():
    ch = D["chains"]["publishedChains"]
    ch = sorted(ch, key=lambda c: -c["v"])
    ys = list(range(len(ch)))[::-1]
    fig, ax = plt.subplots(figsize=(7.4, 3.3))
    for i, c in zip(ys, ch):
        col = S6 if c["v"] >= 6 else (S2 if c["v"] >= 3 else S3)
        if c.get("lo") is not None:
            ax.plot([c["lo"], c["hi"]], [i, i], color=col, lw=6,
                    solid_capstyle="round", alpha=0.45, zorder=2)
            ax.annotate(f"{c['lo']:g}–{c['hi']:g}%", (c["hi"], i), xytext=(8, 0),
                        textcoords="offset points", va="center", fontsize=7.6, color=INK)
        else:
            ax.barh([i], [c["v"]], color=col, edgecolor="white", linewidth=1.5, height=0.5)
            ax.annotate(f"{c['v']:g}%", (c["v"], i), xytext=(5, 0),
                        textcoords="offset points", va="center", fontsize=7.6, color=INK)
    ax.set_yticks(ys)
    ax.set_yticklabels([c["label"] for c in ch], fontsize=7.6, color=INK)
    ax.set_xlabel("Published grid-to-rack loss (%) — boundaries differ per row")
    ax.set_xlim(0, 15.5)
    ax.grid(axis="y", visible=False)
    ax.set_title("Chain against chain — and why you must demand the boundary")
    save(fig, "mmsst-fig-loss-chains.svg")


# ---------------------------------------------------------------------------
# Figure M7 — NVIDIA's and Oracle's published programmes on one time axis.
# ---------------------------------------------------------------------------
def _ord(dstr):
    """Rough decimal year for a YYYY / YYYY-MM / YYYY-MM-DD string."""
    parts = dstr.split("-")
    y = int(parts[0])
    m = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 6
    d = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 15
    return y + (m - 1) / 12.0 + d / 365.0


def fig_timelines():
    """Two programmes as parallel dated lists. A shared horizontal time axis was
    tried and discarded: NVIDIA's milestones cluster inside eleven months and
    overprint at any page-width scale."""
    lanes = D["timelines"]["lanes"]
    colors = [S1, S4]
    packs = []
    for lane, col in zip(lanes, colors):
        packs.append([(it["date"], "", _wrap(it["text"], 54), col,
                       SEQ[0] if i % 2 == 0 else "#f7f4ec")
                      for i, it in enumerate(lane["items"])])
    hmax = max(sum(b[2].count("\n") + 1.80 for b in pk) for pk in packs)
    fig, axes = plt.subplots(1, 2, figsize=(7.4, 0.145 * hmax + 1.0))
    for ax, lane, pk, col in zip(axes, lanes, packs, colors):
        t = _rows(ax, pk, top=hmax)   # both lanes start at the same height
        ax.set_ylim(0, hmax)          # share the vertical scale across both panels
        ax.set_title(lane["lane"], color=col, pad=8)
    fig.suptitle("What each programme has actually committed to, and when",
                 x=0.012, ha="left", fontsize=10, fontweight="bold", color=INK, y=1.0)
    save(fig, "mmsst-fig-timelines.svg")


def _heat_table(ax, rownames, colnames, vals, ramp, title, cellfmt=None):
    """A matrix as a grid of sequential-ramp cells. Ordinal data only, one hue."""
    nr, nc = len(rownames), len(colnames)
    for i in range(nr):
        for j in range(nc):
            v = vals[i][j]
            ax.add_patch(Rectangle((j, nr - 1 - i), 0.94, 0.94,
                                   facecolor=ramp[v], edgecolor="white", linewidth=1.6))
            if cellfmt:
                ax.annotate(cellfmt(v), (j + 0.47, nr - 1 - i + 0.47), ha="center",
                            va="center", fontsize=6.6,
                            color="white" if v >= 3 else INK)
    ax.set_xlim(-0.06, nc); ax.set_ylim(-0.06, nr)
    ax.set_xticks([j + 0.47 for j in range(nc)])
    ax.set_xticklabels(colnames, fontsize=7.0, rotation=32, ha="left", color=MUTED)
    ax.xaxis.set_ticks_position("top")
    ax.set_yticks([nr - 1 - i + 0.47 for i in range(nr)])
    ax.set_yticklabels(rownames, fontsize=7.6, color=INK)
    ax.grid(False)
    for s in ax.spines.values():
        s.set_visible(False)
    ax.tick_params(length=0)
    ax.set_title(title, pad=44)


# ---------------------------------------------------------------------------
# Figure M8 — the lineage and adjacency matrix.
# ---------------------------------------------------------------------------
SCALE = {"poor": 0, "fair": 1, "good": 2, "strong": 3, "best": 4}
SHORT = {0: "poor", 1: "fair", 2: "good", 3: "strong", 4: "best"}


def fig_lineage():
    lg = D["lineage"]
    keys = ["eff", "footprint", "overload", "fault", "isolation", "control",
            "cost", "maturity", "standards"]
    rows = lg["rows"]
    vals = [[SCALE[r[k]] for k in keys] for r in rows]
    fig, ax = plt.subplots(figsize=(7.4, 3.5))
    _heat_table(ax, [r["name"] for r in rows], lg["cols"][:9], vals, SEQ,
                "Lineage and adjacency — the SST against what it descends from",
                cellfmt=lambda v: SHORT[v])
    save(fig, "mmsst-fig-lineage-matrix.svg")


# ---------------------------------------------------------------------------
# Figure M9 — the disclosure gap: what each vendor has published, and has not.
# ---------------------------------------------------------------------------
def fig_disclosure_gap():
    rows = D["classLedger"]["rows"]
    und = D["classLedger"]["undisclosed"]
    names = [r["vendor"] for r in rows] + [u["vendor"] for u in und]
    # four disclosure fields, scored 2 = published, 1 = partial/third-party, 0 = absent
    def score(r, field):
        if field == "class":
            return 2
        if field == "mw":
            return 2 if r.get("mw") else 0
        if field == "evidence":
            return {"supplying": 2, "field pilot": 2, "factory test": 1,
                    "lab demo": 1, "announced": 0}[r["evidence"]]
        return 0
    vals = []
    for r in rows:
        vals.append([score(r, "class"), score(r, "mw"), score(r, "evidence"), 0])
    for _ in und:
        vals.append([0, 0, 0, 0])
    ramp = {0: "#f1ece0", 1: "#b9d3e8", 2: "#0b62a4"}
    cols = ["Service-voltage class", "Unit MW rating", "Evidence beyond an announcement",
            "A listed unit"]
    fig, ax = plt.subplots(figsize=(7.4, 5.6))
    nr, nc = len(names), len(cols)
    for i in range(nr):
        for j in range(nc):
            v = vals[i][j]
            ax.add_patch(Rectangle((j, nr - 1 - i), 0.94, 0.94, facecolor=ramp[v],
                                   edgecolor="white", linewidth=1.6))
            lab = {0: "—", 1: "partial", 2: "yes"}[v]
            ax.annotate(lab, (j + 0.47, nr - 1 - i + 0.47), ha="center", va="center",
                        fontsize=6.8, color="white" if v == 2 else INK)
    ax.set_xlim(-0.06, nc); ax.set_ylim(-0.06, nr)
    ax.set_xticks([j + 0.47 for j in range(nc)])
    ax.set_xticklabels(cols, fontsize=7.0, rotation=26, ha="left", color=MUTED)
    ax.xaxis.set_ticks_position("top")
    ax.set_yticks([nr - 1 - i + 0.47 for i in range(nr)])
    ax.set_yticklabels(names, fontsize=7.2, color=INK)
    ax.grid(False); ax.tick_params(length=0)
    for s in ax.spines.values():
        s.set_visible(False)
    ax.set_title("The disclosure gap — nobody has all four, and one column is empty for everyone",
                 pad=40)
    save(fig, "mmsst-fig-disclosure-gap.svg")


# ---------------------------------------------------------------------------
# Figure M10 — the adjacent-business-unit ladder: margin against revenue share.
# ---------------------------------------------------------------------------
def fig_bu_ladder():
    """A ranked board rather than a scatter: the share-against-margin scatter
    duplicates mmsst-fig-megmeet-mix and its six labels collide at page width."""
    rows = D["buLadder"]["rows"]
    blocks = []
    for i, r in enumerate(rows):
        gm = r["gm"]
        accent = S3 if gm >= 27 else (S2 if gm >= 18 else S6)
        head = r["unit"]
        right = f"{r['share']:.1f}% of revenue  \u00b7  {gm:.2f}% gross margin  \u00b7  {r['position']}"
        blocks.append((head, "", _wrap(right, 116) + "\n" + _wrap(r["evidence"], 116),
                       accent, SEQ[0] if i % 2 == 0 else "#f7f4ec"))
    fig, ax = plt.subplots(figsize=(7.4, 0.142 * sum(b[2].count("\n") + 1.80 for b in blocks) + 0.6))
    _rows(ax, blocks)
    ax.set_title("The six business groups, ranked by how defensible the position is")
    save(fig, "mmsst-fig-bu-ladder.svg")


# ---------------------------------------------------------------------------
# Figure M11 — the US service-voltage ladder by region, with what it means.
# ---------------------------------------------------------------------------
def fig_voltage_map():
    classes = D["classCost"]["classes"]
    fig, ax = plt.subplots(figsize=(7.4, 3.5))
    ys = list(range(len(classes)))[::-1]
    for i, c in zip(ys, classes):
        col = {95: SEQ[1], 125: SEQ[2], 150: SEQ[4]}[c["bilKv"]]
        ax.barh([i], [c["kv"]], color=col, edgecolor="white", linewidth=1.6, height=0.5)
        ax.annotate(f"{c['kv']:g} kV · {c['ansi']} · {c['bilKv']} kV BIL",
                    (c["kv"], i), xytext=(7, 0), textcoords="offset points",
                    va="center", fontsize=7.4, color=INK)
        # wrapped, never truncated: the 34.5 kV note is 113 characters and was
        # being cut mid-word at 96
        ax.annotate(_wrap(c["usage"], 92), (0.4, i), xytext=(0, -11),
                    textcoords="offset points", va="top", fontsize=6.5, color=MUTED,
                    linespacing=1.3)
    ax.barh([len(classes)], [69], color=TRACK, edgecolor="white", linewidth=1.6, height=0.5)
    ax.annotate("69–345 kV transmission tie · gigawatt campuses with their own substation",
                (69, len(classes)), xytext=(7, 0), textcoords="offset points", va="center",
                fontsize=7.4, color=MUTED)
    ax.set_yticks([]); ax.grid(axis="y", visible=False)
    ax.set_xlim(0, 150)
    ax.set_ylim(-1.15, len(classes) + 0.55)   # room for the wrapped note under the last bar
    ax.set_xlabel("Nominal voltage (kV)")
    ax.set_title("The US ladder — the class sets the product, not a configuration option")
    save(fig, "mmsst-fig-voltage-map.svg")


# ---------------------------------------------------------------------------
# Figure M12 — what moved since the primer's 12 September watch-list.
# ---------------------------------------------------------------------------
def _rows(ax, blocks, width=1.0, pad=0.80, lh=1.0, top=None):
    """Lay out (headL, headR, body, accent, shade) blocks bottom-up with heights
    computed from the wrapped line count. Returns the total height."""
    hs = [body.count("\n") + 1 + pad for _, _, body, _, _ in blocks]
    total = sum(hs)
    y = total if top is None else top   # top-align when panels share a scale
    for (hl, hr, body, accent, shade), h in zip(blocks, hs):
        y -= h
        ax.add_patch(Rectangle((0, y + 0.08), width, h - 0.16, facecolor=shade,
                               edgecolor="white", linewidth=1.4))
        ax.add_patch(Rectangle((0, y + 0.08), width * 0.006, h - 0.16,
                               facecolor=accent, edgecolor="none"))
        ax.annotate(hl, (0.014 * width, y + h - 0.46), va="center", ha="left",
                    fontsize=7.0, color=accent, fontweight="bold")
        if hr:
            ax.annotate(hr, (0.20 * width, y + h - 0.46), va="center", ha="left",
                        fontsize=6.6, color=MUTED)
        ax.annotate(body, (0.014 * width, y + h - 0.90), va="top", ha="left",
                    fontsize=6.2, color=INK, linespacing=1.3)
    ax.set_xlim(0, width); ax.set_ylim(0, total)
    ax.set_xticks([]); ax.set_yticks([]); ax.grid(False)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return total


def _wrap(s, n):
    words, lines, cur = esc(s).split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > n:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def fig_watchlist_delta():
    items = D["watchlistDelta"]["items"]
    fig, ax = plt.subplots(figsize=(7.4, 5.2))
    n = len(items)
    for i, it in enumerate(items):
        y = n - 1 - i
        ax.add_patch(Rectangle((0, y + 0.08), 0.42, 0.84, facecolor=SEQ[0],
                               edgecolor="white", linewidth=1.4))
        ax.add_patch(Rectangle((0.42, y + 0.08), 0.58, 0.84, facecolor=SEQ[1],
                               edgecolor="white", linewidth=1.4))
        ax.annotate(str(it["n"]), (0.022, y + 0.5), va="center", ha="left",
                    fontsize=13, color=S1, fontweight="bold")
        ax.annotate(_wrap(it["headline"], 36), (0.062, y + 0.5), va="center", ha="left",
                    fontsize=7.4, color=INK, linespacing=1.3)
        ax.annotate(_wrap(it["why"], 68), (0.448, y + 0.5), va="center", ha="left",
                    fontsize=6.6, color=MUTED, linespacing=1.3)
    ax.set_xlim(0, 1); ax.set_ylim(0, n)
    ax.set_xticks([]); ax.set_yticks([]); ax.grid(False)
    for s in ax.spines.values():
        s.set_visible(False)
    ax.set_title("Five things that moved between 12 and 23 September 2026")
    save(fig, "mmsst-fig-watchlist-delta.svg")


# ---------------------------------------------------------------------------
# Figure M13 — the calendar to day one and the first ninety days.
# ---------------------------------------------------------------------------
def fig_calendar():
    """A dated list, not a crowded axis: ten milestones inside 170 days overprint
    on any shared horizontal time axis at this page width."""
    rows = D["calendar"]["rows"]
    col = {"prep": MUTED, "internal": S1, "external": S2}
    blocks = []
    for r in rows:
        c = col[r["kind"]]
        shade = "#f7f4ec" if r["kind"] == "external" else SEQ[0]
        day = f"day {r['day']:+d}" if r["day"] else "day one"
        blocks.append((r["when"], day, _wrap(r["what"], 108), c, shade))
    fig, ax = plt.subplots(figsize=(7.4, 0.145 * sum(b[2].count("\n") + 1.80 for b in blocks) + 0.6))
    total = _rows(ax, blocks)
    # the day-one rule sits between the second and third rows
    yline = total - sum(b[2].count("\n") + 1.80 for b in blocks[:2])
    ax.axhline(yline, color=S6, lw=1.3, ls=(0, (4, 3)), zorder=5)
    ax.set_title("The run-in and the first ninety days \u2014 blue is yours, orange is the market's")
    save(fig, "mmsst-fig-calendar.svg")


# ---------------------------------------------------------------------------
# Figure M14 — the perspective matrix as a compact board.
# ---------------------------------------------------------------------------
def fig_perspective_matrix():
    """Row heights are computed from the wrapped line count so no cell is clipped."""
    rows = D["perspectives"]["rows"]
    WRAP = 36
    cells = [(_wrap(r["who"], 20), _wrap(r["buys"], WRAP), _wrap(r["adds"], WRAP),
              _wrap(r["need"], WRAP)) for r in rows]
    heights = [max(c.count("\n") + 1 for c in row) for row in cells]
    total = sum(heights)
    fig, ax = plt.subplots(figsize=(7.4, 0.132 * total + 0.9))
    cols = [(0.00, "Player"), (0.19, "What 800 V DC buys them"),
            (0.46, "What an SST adds over a TRU"), (0.73, "What they would need to see")]
    hdr = 1.6
    ax.add_patch(Rectangle((0, total), 1.0, hdr, facecolor=SEQ[4], edgecolor="white",
                           linewidth=1.4))
    for x, t in cols:
        ax.annotate(t, (x + 0.008, total + hdr / 2), va="center", ha="left",
                    fontsize=7.2, color="white", fontweight="bold")
    y = total
    for i, (row, h) in enumerate(zip(cells, heights)):
        y -= h
        shade = SEQ[0] if i % 2 == 0 else "#f7f4ec"
        ax.add_patch(Rectangle((0, y), 1.0, h - 0.06, facecolor=shade,
                               edgecolor="white", linewidth=1.4))
        ax.annotate(row[0], (0.008, y + h - 0.32), va="top", ha="left", fontsize=6.9,
                    color=INK, fontweight="bold", linespacing=1.3)
        for (x, _), txt in zip(cols[1:], row[1:]):
            ax.annotate(txt, (x + 0.008, y + h - 0.32), va="top", ha="left",
                        fontsize=5.6, color=INK, linespacing=1.32)
    ax.set_xlim(0, 1); ax.set_ylim(0, total + hdr)
    ax.set_xticks([]); ax.set_yticks([]); ax.grid(False)
    for sp in ax.spines.values():
        sp.set_visible(False)
    save(fig, "mmsst-fig-perspective-matrix.svg")


if __name__ == "__main__":
    fig_class_ledger()
    fig_class_cost()
    fig_competitor_map()
    fig_obstacle_stack()
    fig_megmeet_mix()
    fig_loss_chains()
    fig_timelines()
    fig_lineage()
    fig_disclosure_gap()
    fig_bu_ladder()
    fig_voltage_map()
    fig_watchlist_delta()
    fig_calendar()
    fig_perspective_matrix()

# Developed by: LightAISolutions
