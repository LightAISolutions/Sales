#!/usr/bin/env python3
"""Build the three app brochures (Profiler / Scraper / Classroom) to PDF.

Each brochure is a `<name>.body.html` fragment of `.page` divs; this wraps it in
the shared stylesheet and prints it with headless Chromium. Re-runnable: the
PDFs are regenerated from the fragments every time.

    python3 repository-information/brochures/build-brochures.py
"""
import pathlib
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

BROCHURES = [
    ("profiler",  "Profiler — Company Intelligence",  "#d9a441", "#8a6410"),
    ("scraper",   "Scraper — The Industry News Desk", "#3fa66a", "#1d6a40"),
    ("classroom", "Classroom — The Curriculum",       "#5b86d6", "#2c4d8f"),
]

SHELL = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>{title}</title>
<style>:root {{ --accent: {accent}; --accentdk: {accentdk}; }}
{css}</style></head><body>
{body}
</body></html>
"""


def build(slug, title, accent, accentdk):
    css = (HERE / "brochure.css").read_text(encoding="utf-8")
    body = (HERE / f"{slug}.body.html").read_text(encoding="utf-8")
    html_path = HERE / f"{slug}-brochure.html"
    pdf_path = HERE / f"{slug}-brochure.pdf"
    html_path.write_text(
        SHELL.format(title=title, accent=accent, accentdk=accentdk, css=css, body=body),
        encoding="utf-8",
    )
    r = subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer",
         f"--print-to-pdf={pdf_path}", str(html_path)],
        capture_output=True, text=True,
    )
    if not pdf_path.exists():
        print(f"FAILED {slug}\n{r.stderr[-800:]}", file=sys.stderr)
        return False
    print(f"  {pdf_path.name}  ({pdf_path.stat().st_size // 1024} KB)")
    return True


if __name__ == "__main__":
    print("Building brochures:")
    ok = all([build(*b) for b in BROCHURES])
    sys.exit(0 if ok else 1)

# Developed by: LightAISolutions
