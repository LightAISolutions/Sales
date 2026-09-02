# App Brochures

Informational brochures for the three apps in the BESS/AIDC ecosystem — written for a
**new user** who needs to know what each app does, how it does it, and how to use it well.

| Brochure | Pages | Covers |
|----------|-------|--------|
| [`profiler-brochure.pdf`](profiler-brochure.pdf) | 8 | Company dossiers, the two-stage research protocol, field notes and confidence weighting, scheduled refreshes, the access matrix, coverage |
| [`scraper-brochure.pdf`](scraper-brochure.pdf) | 8 | The daily digest, the source roster and its probe discipline, the scoring rubric, the morning build, tuning and the feedback loop, the corpus bridge |
| [`classroom-brochure.pdf`](classroom-brochure.pdf) | 8 | Tracks and lessons, the provenance stamp and gate fold, freshness and the weekly pipeline, the contradiction test, how to study, the roadmap |

## Rebuilding

```bash
python3 repository-information/brochures/build-brochures.py
```

Each brochure is authored as a `<slug>.body.html` fragment of `.page` divs. The build script
wraps it in `brochure.css` with a per-app accent colour and prints it to PDF with headless
Chromium. The `<slug>-brochure.html` files are build artifacts — edit the `.body.html`, never them.

## Layout constraint

Pages are fixed at 8.5in × 11in with `overflow: hidden`, so **content that exceeds the page is
silently clipped**. After editing a fragment, verify every page still fits: content must end
above ~1006px of the 1056px page box (the footer occupies the rest). Measure by setting
`.page { overflow: visible }` and comparing each page's last child's bottom edge against that
limit — a page-count increase in the resulting PDF also reveals an overflow.

## Not deployed

These live in `repository-information/`, not `live-site-pages/`, so they are **not** published to
GitHub Pages. They describe gated internal surfaces (access matrices, the corpus route, private
note handling) and should stay off the public site.

Developed by: LightAISolutions
