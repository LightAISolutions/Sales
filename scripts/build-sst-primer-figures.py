#!/usr/bin/env python3
"""build-sst-primer-figures.py — renders the data charts for the Solid-State
Transformer primer (repository-information/sst-primer-print.html) as SVG files
in repository-information/sst-primer-figures/.

The block diagrams and schematics in the primer are hand-authored inline SVG in
the HTML; this script owns only the *data* charts, so that every number plotted
is visible in one place and can be re-plotted when a source updates.

Palette: the six categorical hues are the AIDC report's validated chart palette
(aidc-market-report-print.html --s1..--s6), validated once with the dataviz
skill's six checks against the white print surface. Do not re-tint.

Usage: python3 scripts/build-sst-primer-figures.py
Requires matplotlib (pip install matplotlib).
"""
import math
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import rcParams

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "repository-information", "sst-primer-figures")
os.makedirs(OUT, exist_ok=True)

S1, S2, S3, S4, S5, S6 = "#0b62a4", "#c2622a", "#1b8a6b", "#7a3f7d", "#8a8f2a", "#b03a34"
INK, MUTED, RULE, TRACK = "#23211c", "#6d6758", "#cfc8b4", "#e9e5da"

rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["Arial", "Liberation Sans", "DejaVu Sans"],
    "font.size": 9, "axes.edgecolor": RULE, "axes.labelcolor": MUTED,
    "xtick.color": MUTED, "ytick.color": MUTED, "axes.titlecolor": INK,
    "axes.titleweight": "bold", "axes.titlesize": 10, "axes.titlelocation": "left",
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "grid.color": TRACK, "grid.linewidth": 0.6, "axes.axisbelow": True,
    "svg.fonttype": "none", "figure.dpi": 100,
})


def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, format="svg", bbox_inches="tight", pad_inches=0.08)
    plt.close(fig)
    with open(path, "a", encoding="utf-8") as fh:  # repo branding rule: last line of every new file
        fh.write("<!-- Developed by: LightAISolutions -->\n")
    print("wrote", os.path.relpath(path, ROOT))


def rounded_bars(ax, xs, hs, color, width=0.6, labels=None, fmt="{:,.0f}"):
    """Thin bars with a light 2px surface gap and selective direct labels."""
    bars = ax.bar(xs, hs, width=width, color=color, edgecolor="white", linewidth=1.5)
    if labels is not None:
        for b, lab in zip(bars, labels):
            ax.annotate(lab, (b.get_x() + b.get_width() / 2, b.get_height()),
                        xytext=(0, 3), textcoords="offset points", ha="center",
                        va="bottom", fontsize=8, color=INK)
    return bars


# ---------------------------------------------------------------------------
# Figure A — current (and therefore conductor cross-section) at 1 MW for each
# bus voltage in the data-center chain. Pure physics: I = P / V (3-phase AC:
# I = P / (sqrt3 * V * pf), pf = 0.99).
# ---------------------------------------------------------------------------
def fig_current_vs_voltage():
    P = 1_000_000.0
    buses = [
        ("12 V DC\n(legacy board)", P / 12),
        ("48 V DC\n(legacy busbar)", P / 48),
        ("54 V DC\n(OCP ORv3)", P / 54),
        ("415 V AC 3ph\n(EU/US LV)", P / (math.sqrt(3) * 415 * 0.99)),
        ("480 V AC 3ph\n(US LV)", P / (math.sqrt(3) * 480 * 0.99)),
        ("800 V DC\n(±400 V)", P / 800),
    ]
    fig, ax = plt.subplots(figsize=(7.2, 3.3))
    xs = range(len(buses))
    hs = [b[1] for b in buses]
    colors = [S6, S6, S6, S2, S2, S1]
    rounded_bars(ax, list(xs), hs, colors, labels=[f"{h/1000:,.2f} kA" if h < 5000 else f"{h/1000:,.1f} kA" for h in hs])
    ax.set_xticks(list(xs)); ax.set_xticklabels([b[0] for b in buses], fontsize=7.5)
    ax.set_yscale("log"); ax.set_ylim(500, 200_000)
    ax.set_ylabel("Current to deliver 1 MW (A, log scale)")
    ax.set_title("Why 800 V: current for one megawatt at each bus voltage")
    save(fig, "fig-current-vs-voltage.svg")


# ---------------------------------------------------------------------------
# Figure B — how many series cells a cascaded-H-bridge SST front end needs per
# phase, by utility service voltage and SiC device class. Educational estimate:
# cell DC link = 0.55 x device rating (industry derating for cosmic-ray FIT and
# switching overshoot), phase peak = V_LL * sqrt2 / sqrt3, +10% grid overvoltage,
# one redundant cell per phase (N+1).
# ---------------------------------------------------------------------------
def cells_per_phase(v_ll, device_v, derate=0.55, ov=1.10, redundancy=1):
    v_cell = device_v * derate
    v_pk = v_ll * math.sqrt(2) / math.sqrt(3) * ov
    return math.ceil(v_pk / v_cell) + redundancy


def fig_cell_count():
    services = [4160, 12470, 13800, 24940, 34500]
    devices = [(1700, S2, "1.7 kV SiC"), (3300, S1, "3.3 kV SiC"), (6500, S3, "6.5 kV SiC"), (10000, S4, "10 kV SiC (R&D)")]
    fig, ax = plt.subplots(figsize=(7.2, 3.4))
    w = 0.19
    for i, (dv, col, lab) in enumerate(devices):
        ys = [cells_per_phase(s, dv) for s in services]
        xs = [j + (i - 1.5) * w for j in range(len(services))]
        bars = ax.bar(xs, ys, width=w, color=col, edgecolor="white", linewidth=1.2, label=lab)
        for b, y in zip(bars, ys):
            ax.annotate(str(y), (b.get_x() + b.get_width() / 2, y), xytext=(0, 2),
                        textcoords="offset points", ha="center", fontsize=6.5, color=INK)
    ax.set_xticks(range(len(services)))
    ax.set_xticklabels(["4.16 kV", "12.47 kV", "13.8 kV", "24.9 kV", "34.5 kV"])
    ax.set_xlabel("Utility service voltage (line-to-line)")
    ax.set_ylabel("Series H-bridge cells per phase (N+1)")
    ax.set_title("Cell count is the cost driver: cells per phase by service voltage and device class")
    ax.set_ylim(0, 42)
    ax.legend(frameon=False, fontsize=7.5, ncol=4, loc="upper center", bbox_to_anchor=(0.5, 1.0))
    save(fig, "fig-cell-count.svg")


# ---------------------------------------------------------------------------
# Figure C — NVIDIA's own conductor-utilisation table (800 VDC white paper,
# Table 1): power per cable cross-section for a fixed wire gauge at 48 A.
# ---------------------------------------------------------------------------
def fig_kw_per_mm2():
    rows = [("415 V AC\n(4 wires)", 0.6, S2, "0.6 (ref.)"), ("480 V AC\n(4 wires)", 0.8, S2, "0.8 (+16%)"), ("800 V DC\n(3 wires)", 1.7, S1, "1.7 (+157%)"), ("1500 V DC\n(3 wires)", 3.1, S4, "3.1 (+382%)")]
    fig, ax = plt.subplots(figsize=(7.2, 2.9))
    xs = list(range(len(rows)))
    rounded_bars(ax, xs, [r[1] for r in rows], [r[2] for r in rows], width=0.55,
                 labels=[r[3] for r in rows])  # NVIDIA's own stated deltas (its table rounds the kW/mm² values)
    ax.set_xticks(xs); ax.set_xticklabels([r[0] for r in rows])
    ax.set_ylim(0, 3.8); ax.set_ylabel("Power per cable cross-section (kW/mm²)")
    ax.set_title("NVIDIA's copper argument: power through the same conductor, by distribution voltage")
    save(fig, "fig-kw-per-mm2.svg")


# ---------------------------------------------------------------------------
# Figure D — grid-to-rack conversion loss, chain by chain. Each bar is a
# published figure for one complete path from the utility feed to the rack.
# ---------------------------------------------------------------------------
def fig_chain_losses():
    rows = [
        ("Legacy 415/480 V AC hall\n(NVIDIA: 'less than 90%' end-to-end)", 10.0, S6, "≥10% (NVIDIA)"),
        ("Legacy AC, UPS double-conversion\n(Wuhan/VNET RTDS study, load-dependent)", 10.0, S6, "7–13% (RTDS)"),
        ("Traditional 480 V AC path\n(Heron Power loss model)", 6.4, S2, "6.4% (Heron)"),
        ("Transformer + LV rectifier → 800 V DC\n(trade estimate, grid-to-rack)", 2.7, S4, "~2.7% (DCK)"),
        ("SST → 800 V DC, 10 kV in\n(Wuhan/VNET RTDS study, flat vs load)", 2.0, S1, "~2% (RTDS)"),
        ("Heron Link SST → 800 V DC\n(vendor loss model)", 3.0, S1, "3.0% (Heron)"),
    ]
    fig, ax = plt.subplots(figsize=(7.2, 3.6))
    ys = list(range(len(rows)))[::-1]
    for y, (lab, v, col, txt) in zip(ys, rows):
        ax.barh(y, v, color=col, height=0.55, edgecolor="white", linewidth=1.5)
        ax.annotate(txt, (v, y), xytext=(4, 0), textcoords="offset points", va="center", fontsize=8, color=INK)
    ax.set_yticks(ys); ax.set_yticklabels([r[0] for r in rows], fontsize=7.6)
    ax.set_xlim(0, 15); ax.set_xlabel("Loss from utility feed to rack bus (% of input power)")
    ax.set_title("Chain versus chain: published grid-to-rack losses (lower is better)")
    ax.grid(axis="y", visible=False)
    save(fig, "fig-chain-losses.svg")


# ---------------------------------------------------------------------------
# Figure E — the timeline: NVIDIA's rack generations and AC-to-DC options
# against vendor SST availability statements.
# ---------------------------------------------------------------------------
def fig_timeline():
    import matplotlib.dates as mdates
    from datetime import date
    items = [
        # (label, start, end, color, group)
        ("Option A · sidecar power racks, 145 kW rack (NVIDIA Gen 1)", date(2026, 7, 1), date(2027, 6, 30), S2, "NVIDIA staging"),
        ("Option B · row power centers, 800 V busway, 330 kW rack (Gen 2, Vera Rubin NVL72)", date(2027, 7, 1), date(2028, 12, 31), S4, "NVIDIA staging"),
        ("Option C · 4.8 MW DC power blocks, SST from MV, 570 kW → 1 MW rack (Gen 3)", date(2029, 1, 1), date(2030, 6, 30), S1, "NVIDIA staging"),
        ("ABB HiPerGuard 34.5 kV MV UPS orderable", date(2026, 6, 1), date(2026, 9, 30), S3, "Vendor"),
        ("Sungrow EnerNeo SST launched; HEC 30 MW (2026–27), ZDATA 100 MW (2027–28)", date(2026, 7, 10), date(2028, 6, 30), S3, "Vendor"),
        ("Vertiv full 800 VDC portfolio (H2 2026)", date(2026, 7, 1), date(2026, 12, 31), S3, "Vendor"),
        ("Heron Power · pilot early 2027, 40 GW/yr US factory H2 2027", date(2027, 1, 1), date(2027, 12, 31), S3, "Vendor"),
        ("SolarEdge + Infineon 2–5 MW SST delivery", date(2027, 1, 1), date(2027, 12, 31), S3, "Vendor"),
        ("DG Matrix 10 GW capacity target (Q2 2027)", date(2027, 4, 1), date(2027, 6, 30), S3, "Vendor"),
        ("Enphase IQ SST volume (2028)", date(2028, 1, 1), date(2028, 12, 31), S3, "Vendor"),
        ("NC State / NYPA / EPRI 1 MVA SST validated on live 13.2 kV feeder", date(2026, 6, 1), date(2026, 6, 30), S5, "Milestone"),
    ]
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    n = len(items)
    for i, (lab, a, b, col, grp) in enumerate(items):
        y = n - i
        ax.barh(y, (b - a).days, left=mdates.date2num(a), color=col, height=0.5, edgecolor="white", linewidth=1.2)
        ax.text(mdates.date2num(date(2026, 4, 15)), y, lab, va="center", ha="left", fontsize=6.9, color=INK)
    ax.set_yticks([]); ax.set_ylim(0.3, n + 0.9)
    ax.xaxis_date(); ax.xaxis.set_major_locator(mdates.YearLocator()); ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
    ax.set_xlim(mdates.date2num(date(2026, 4, 1)), mdates.date2num(date(2030, 9, 30)))
    for yr in range(2027, 2031):
        ax.axvline(mdates.date2num(date(yr, 1, 1)), color=RULE, linewidth=0.6)
    ax.axvline(mdates.date2num(date(2026, 9, 12)), color=S6, linewidth=1.0, linestyle="--")
    ax.text(mdates.date2num(date(2026, 9, 20)), n + 0.7, "today (12 Sep 2026)", fontsize=6.8, color=S6, va="center")
    ax.grid(axis="y", visible=False)
    ax.set_title("Timeline: NVIDIA's AC-to-DC staging versus vendor SST availability statements")
    save(fig, "fig-timeline.svg")


# ---------------------------------------------------------------------------
# Figure F — the grid side: US data-center electricity (LBNL) and the
# five-year peak-growth forecast revisions (Grid Strategies).
# ---------------------------------------------------------------------------
def fig_grid_side():
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.2, 3.0))
    yrs = ["2014", "2018", "2023", "2028\nlow", "2028\nhigh"]; twh = [58, 76, 176, 325, 580]
    cols = [S1, S1, S1, "#8fb3d4", "#8fb3d4"]
    rounded_bars(a1, list(range(5)), twh, cols, width=0.6, labels=[f"{v}" for v in twh])
    a1.set_xticks(range(5)); a1.set_xticklabels(yrs, fontsize=7.5); a1.set_ylim(0, 680)
    a1.set_ylabel("TWh per year"); a1.set_title("US data-center electricity use (LBNL)")
    a1.text(0.02, 0.95, "4.4% of US electricity in 2023\n6.7–12% by 2028", transform=a1.transAxes, fontsize=7, va="top", color=MUTED)
    fy = ["2022", "2023", "2024", "2025"]; gw = [24, 38, 64, 166]
    rounded_bars(a2, list(range(4)), gw, [S2] * 4, width=0.6, labels=[f"{v} GW" for v in gw])
    a2.set_xticks(range(4)); a2.set_xticklabels([f"{y}\nforecast" for y in fy], fontsize=7.5); a2.set_ylim(0, 200)
    a2.set_ylabel("Five-year summer peak growth (GW)"); a2.set_title("US five-year load-growth forecast, by vintage")
    a2.text(0.02, 0.95, "~55% (~90 GW) of the 2025\nfigure is data centers", transform=a2.transAxes, fontsize=7, va="top", color=MUTED)
    fig.tight_layout(w_pad=2.0)
    save(fig, "fig-grid-side.svg")


# ---------------------------------------------------------------------------
# Figure G — the two queues an SST cannot shorten: ERCOT's large-load
# interconnection queue and US power-transformer lead times.
# ---------------------------------------------------------------------------
def fig_queues():
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.2, 3.0))
    lab = ["Queue\nend-2024", "Queue\nNov 2025", "Queue\nMar 2026", "Approved to\nenergize", "Observed\npeak"]
    val = [63, 226, 410, 9.0, 3.9]; cols = [S1, S1, S1, S3, S3]
    rounded_bars(a1, list(range(5)), val, cols, width=0.6, labels=[f"{v:g} GW" for v in val])
    a1.set_xticks(range(5)); a1.set_xticklabels(lab, fontsize=7); a1.set_ylim(0, 470)
    a1.set_ylabel("GW"); a1.set_title("ERCOT large loads: queued vs energized (~87% data centers)")
    lab2 = ["2021\navg", "2024\navg", "2026\nstandard", "2026\nGSU", "2026\nworst"]
    wk = [50, 120, 128, 144, 208]
    rounded_bars(a2, list(range(5)), wk, [S2] * 5, width=0.6, labels=[f"{v} wk" for v in wk])
    a2.set_xticks(range(5)); a2.set_xticklabels(lab2, fontsize=7); a2.set_ylim(0, 240)
    a2.set_ylabel("Lead time (weeks)"); a2.set_title("US power-transformer lead times")
    fig.tight_layout(w_pad=2.0)
    save(fig, "fig-queues.svg")


# ---------------------------------------------------------------------------
# Figure H — the July 10, 2024 Virginia event, as NERC reported it: six
# successive faults in 82 s, ~1,500 MW of data-center load dropped by
# customer-side protection, ~1,260 MW not returning for hours.
# ---------------------------------------------------------------------------
def fig_nerc_event():
    fig, ax = plt.subplots(figsize=(7.2, 2.6))
    # approximate fault instants (staggered reclosing), durations in ms from the report
    t = [0, 14, 28, 45, 62, 82]; dur = [42, 66, 58, 50, 66, 59]
    ax.hlines(1.0, -5, 95, color=RULE, linewidth=1)
    for i, (ti, d) in enumerate(zip(t, dur)):
        ax.plot([ti, ti, ti + 0.6, ti + 0.6], [1.0, 0.33, 0.33, 1.0], color=S6, linewidth=1.6)
        ax.annotate(f"{d} ms", (ti + 0.3, 0.33), xytext=(0, -9), textcoords="offset points", ha="center", fontsize=6.5, color=MUTED)
    ax.axvspan(28, 95, color="#fbf3ea", zorder=0)
    ax.text(30, 1.12, "~1,260 MW dropped at the 3rd depression by a scheme that counts ~3 sags/min, then stays on backup until manually reconnected", fontsize=6.8, color="#8a4318", va="bottom")
    ax.set_xlim(-5, 95); ax.set_ylim(0.15, 1.3); ax.set_xlabel("Seconds after the first fault (staggered three-shot reclosing at both line ends)")
    ax.set_ylabel("Voltage (p.u.)"); ax.set_yticks([0.25, 0.5, 0.75, 1.0])
    ax.set_title("July 10, 2024: six faults in 82 s on a 230 kV line, ~1,500 MW of data-center load lost")
    ax.grid(axis="x", visible=False)
    save(fig, "fig-nerc-event.svg")


# ---------------------------------------------------------------------------
# Figure I — positioning map: layer of the stack (x) against SST status (y),
# one dot per company. Status ladder is ordinal, not a score.
# ---------------------------------------------------------------------------
def fig_positioning():
    layers = ["Silicon", "Rack shelf / sidecar", "Hall-edge SST / TRU", "Facility / grid"]
    status = ["None / not disclosed", "Roadmap / R&D", "Sampling / pilots", "Orderable / shipping"]
    pts = [
        # (name, layer idx, status idx, x-jitter, y-jitter, color)
        ("Infineon", 0, 3, -0.22, 0.10, S5), ("onsemi", 0, 3, 0.05, 0.22, S5), ("Wolfspeed", 0, 3, 0.22, -0.06, S5),
        ("Navitas / TI / ST", 0, 3, -0.05, -0.22, S5), ("Vicor (IP)", 0, 0, 0.0, 0.0, S5),
        ("Delta", 1, 2, -0.25, 0.18, S2), ("LITEON", 1, 0, -0.25, 0.12, S2), ("Megmeet", 1, 0, 0.0, -0.12, S2), ("Flex", 1, 0, 0.25, 0.14, S2),
        ("Vertiv", 1, 0, 0.22, -0.2, S2),
        ("Sungrow EnerNeo", 2, 3, -0.2, 0.0, S1), ("ABB HiPerGuard (MV UPS)", 2, 3, 0.2, 0.18, S1),
        ("Heron Power", 2, 2, -0.25, -0.1, S1), ("DG Matrix", 2, 2, 0.05, 0.16, S1), ("Amperesand", 2, 2, 0.25, -0.16, S1),
        ("Zhonhen Panama (TRU)", 2, 3, 0.0, -0.22, S4), ("Sinexcel", 2, 1, -0.2, -0.05, S1), ("Siemens + Reinhausen", 2, 1, 0.15, 0.1, S1),
        ("Eaton (Resilient IP)", 3, 1, -0.22, 0.14, S3), ("Schneider", 3, 0, -0.2, 0.0, S3), ("Hitachi Energy", 3, 1, 0.1, -0.12, S3),
        ("GE Vernova", 3, 1, 0.24, 0.1, S3), ("Mitsubishi Electric", 3, 0, 0.22, -0.18, S3),
    ]
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    for x in range(4):
        for y in range(4):
            ax.add_patch(plt.Rectangle((x - 0.5, y - 0.5), 1, 1, facecolor="#fbfaf6" if (x + y) % 2 else "#ffffff", edgecolor=TRACK, linewidth=0.6))
    for name, lx, sy, jx, jy, col in pts:
        ax.scatter(lx + jx, sy + jy, s=46, color=col, edgecolor="white", linewidth=1.2, zorder=3)
        ax.annotate(name, (lx + jx, sy + jy), xytext=(5, 0), textcoords="offset points", fontsize=6.6, va="center", color=INK, zorder=4)
    ax.set_xlim(-0.5, 3.5); ax.set_ylim(-0.5, 3.5)
    ax.set_xticks(range(4)); ax.set_xticklabels(layers, fontsize=8)
    ax.set_yticks(range(4)); ax.set_yticklabels(status, fontsize=8)
    ax.grid(False)
    for sp in ["top", "right"]: ax.spines[sp].set_visible(False)
    ax.set_title("Positioning map: layer of the stack versus solid-state transformer status (Sep 2026)")
    save(fig, "fig-positioning.svg")


# ---------------------------------------------------------------------------
# Figure J — the demand signal: latest reported data-center-relevant growth
# metrics, one bar per company, with the metric named on the bar.
# ---------------------------------------------------------------------------
def fig_financials():
    rows = [
        ("Vertiv — backlog, Q2 2026", 109, S3), ("Eaton — Electrical Global backlog, Q2 2026", 103, S3),
        ("ABB — Electrification orders (comparable), Q2 2026", 70, S3), ("GE Vernova — Electrification equipment backlog, Q2 2026", 69, S3),
        ("Megmeet — power-products revenue, H1 2026", 61, S2), ("Delta — group revenue, Q2 2026", 48, S2),
        ("LITEON — group revenue, Q2 2026 (cloud & AIoT +70%)", 30, S2), ("Schneider — organic revenue, H1 2026", 14, S3),
        ("Sungrow — group revenue, H1 2026 (PV drag)", -29, S1),
    ]
    fig, ax = plt.subplots(figsize=(7.2, 3.5))
    ys = list(range(len(rows)))[::-1]
    for y, (lab, v, col) in zip(ys, rows):
        ax.barh(y, v, color=col, height=0.58, edgecolor="white", linewidth=1.5)
        ax.annotate(f"{v:+d}%", (v, y), xytext=(4 if v >= 0 else -4, 0), textcoords="offset points", va="center", ha="left" if v >= 0 else "right", fontsize=8, color=INK)
    ax.set_yticks(ys); ax.set_yticklabels([r[0] for r in rows], fontsize=7.3)
    ax.axvline(0, color=RULE, linewidth=0.8); ax.set_xlim(-45, 130)
    ax.set_xlabel("Year-on-year change (%) — metric named per bar; not like-for-like")
    ax.set_title("The demand signal: latest reported growth in data-center-relevant metrics")
    ax.grid(axis="y", visible=False)
    save(fig, "fig-financials.svg")


if __name__ == "__main__":
    fig_current_vs_voltage()
    fig_cell_count()
    fig_kw_per_mm2()
    fig_chain_losses()
    fig_timeline()
    fig_grid_side()
    fig_queues()
    fig_nerc_event()
    fig_positioning()
    fig_financials()
# Developed by: LightAISolutions
