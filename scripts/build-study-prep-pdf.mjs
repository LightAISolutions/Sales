#!/usr/bin/env node
/**
 * build-study-prep-pdf.mjs — typesets a study-prep Markdown brief to PDF.
 *
 * The Markdown file stays the single source of truth: this script parses it and
 * renders it, so the PDF cannot drift from the document you actually edit. That
 * is the difference from scripts/build-aidc-report-pdf.mjs, whose source was
 * authored as HTML in the first place.
 *
 * Presentation is the `bloomberg` export skin from PROFILER-STYLES.md — the same
 * look the canonical AIDC report PDF carries — reproduced here as a single fixed
 * skin rather than the five-way switch that report uses. A prep document is not
 * a customer deliverable, so it does not need to be issuable in every registered
 * writing style, and staying out of the registry keeps this script off the
 * "mirror every skin change" hook.
 *
 * Rendering drives the pre-installed Chromium (PLAYWRIGHT_BROWSERS_PATH) over the
 * DevTools Protocol, because only Page.printToPDF accepts a running header and
 * footer — the --print-to-pdf CLI flag cannot. No npm dependencies: Node 22 ships
 * a global WebSocket.
 *
 * Usage: node scripts/build-study-prep-pdf.mjs [<doc-key>] [--keep-html]
 *        no doc-key    builds every document in DOCS
 *        --keep-html   also writes the intermediate HTML next to the PDF
 *
 * Register a new prep document by adding an entry to DOCS below.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync, readdirSync, mkdtempSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 9334; // distinct from build-aidc-report-pdf.mjs so both can run at once

// ── Document registry ──────────────────────────────────────────────────────
// `src`/`out` are repo-relative. The masthead fields are what the Markdown
// cannot carry: the H1 becomes `title`, everything else is stated here so the
// document body does not have to open with metadata a reader would skim past.
const DOCS = {
  'megmeet-interview-brief': {
    src: 'repository-information/study-prep/megmeet/megmeet-interview-brief.md',
    out: 'repository-information/study-prep/megmeet/MEGMEET-INTERVIEW-BRIEF.pdf',
    kick: 'Profiler Study Prep · Interview Preparation',
    sub: 'What they make, where they stand, the objections you carry, and what to ask',
    meta: [
      '<b>Prepared</b> 14 August 2026 &nbsp;·&nbsp; <b>Source</b> megmeet.profile.json, profileVersion 2 '
        + '(updated 2026-08-09) &nbsp;·&nbsp; <b>Companion</b> megmeet-lesson-plan.md, which teaches the physics',
      '<b>Sourcing</b> Every claim traces to the dossier; analytical reads are labelled as reads '
        + '&nbsp;·&nbsp; <b>Classification</b> Internal — interview preparation',
    ],
    banner: '<b>Presentation style</b> — BloombergNEF Research Report, the canonical Profiler export skin. '
      + 'Facts lead, labelled analysis follows, and the two never blur.',
    runHead: 'Built from the Profiler dossier set · Prepared 14 August 2026',
    runFoot: 'Megmeet — Interview Brief (Sales Role) · Internal, interview preparation',
  },
  'megmeet-lesson-plan': {
    src: 'repository-information/study-prep/megmeet/megmeet-lesson-plan.md',
    out: 'repository-information/study-prep/megmeet/MEGMEET-LESSON-PLAN.pdf',
    kick: 'Profiler Study Prep · Technology Lesson Plan',
    sub: 'The underlying power electronics, taught from a high-school-STEM baseline',
    meta: [
      '<b>Prepared</b> 14 August 2026 &nbsp;·&nbsp; <b>Source</b> megmeet.profile.json '
        + '&nbsp;·&nbsp; <b>Companion</b> megmeet-interview-brief.md, which teaches the room',
      '<b>Classification</b> Internal — interview preparation',
    ],
    banner: '<b>Presentation style</b> — BloombergNEF Research Report, the canonical Profiler export skin.',
    runHead: 'Built from the Profiler dossier set · Prepared 14 August 2026',
    runFoot: 'Megmeet — Technology Lesson Plan · Internal, interview preparation',
  },
};

// ── Chromium discovery ─────────────────────────────────────────────────────
function findChrome() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (!existsSync(base)) throw new Error(`browser root not found: ${base}`);
  const dir = readdirSync(base).filter((d) => d.startsWith('chromium-')).sort().pop();
  if (!dir) throw new Error(`no chromium-* build under ${base}`);
  return resolve(base, dir, 'chrome-linux/chrome');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForDevTools() {
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return;
    } catch { /* not up yet */ }
    await sleep(150);
  }
  throw new Error('Chromium DevTools endpoint never came up');
}

/** Minimal CDP client over the page target's WebSocket. */
function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const waiters = new Map();
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve: res, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : res(msg.result);
    } else if (msg.method && waiters.has(msg.method)) {
      waiters.get(msg.method)();
      waiters.delete(msg.method);
    }
  });
  const open = new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', () => rej(new Error('CDP socket error')));
  });
  return {
    open,
    send(method, params = {}) {
      return new Promise((res, rej) => {
        pending.set(++id, { resolve: res, reject: rej });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    once(method) { return new Promise((res) => waiters.set(method, res)); },
    close() { ws.close(); },
  };
}
// ── Markdown → HTML ────────────────────────────────────────────────────────
// A deliberately small subset: headings, paragraphs, GFM pipe tables,
// blockquotes, lists, <details>, and inline emphasis/code/links. That is the
// whole vocabulary the study-prep documents use. Anything richer belongs in an
// HTML-authored document like the AIDC report, not here.

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Inline spans. Escapes first, so code/link content can never inject markup. */
function inline(s) {
  return esc(s)
    // code before emphasis: backtick content must not be re-scanned for * pairs
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Pipe table. Column widths are proportional to the text they carry, clamped so
 * a one-word label column never starves and a prose column never swallows the
 * table. Equal-thirds (the default under table-layout:fixed) reads badly when
 * one column holds a sentence and another holds a date.
 */
function renderTable(rows) {
  const cells = rows.map((r) => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));
  const head = cells[0];
  const align = cells[1].map((s) => (/^:-+:$/.test(s) ? 'center' : /-+:$/.test(s) ? 'right' : 'left'));
  const body = cells.slice(2);
  const n = head.length;
  const weight = Array.from({ length: n }, (_, c) => {
    const lens = body.map((r) => (r[c] || '').length);
    const avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 1;
    return Math.max(avg, head[c].length * 0.9, 6);
  });
  const total = weight.reduce((a, b) => a + b, 0);
  const pct = weight.map((w) => Math.min(58, Math.max(11, (w / total) * 100)));
  const norm = pct.reduce((a, b) => a + b, 0);
  const cols = pct.map((p) => `<col style="width:${((p / norm) * 100).toFixed(1)}%">`).join('');
  const th = head.map((h, c) => `<th style="text-align:${align[c]}">${inline(h)}</th>`).join('');
  const tb = body.map((r) => '<tr>' + Array.from({ length: n }, (_, c) =>
    `<td style="text-align:${align[c]}"${c === 0 ? ' class="k"' : ''}>${inline(r[c] || '')}</td>`).join('') + '</tr>').join('\n');
  return `<table><colgroup>${cols}</colgroup>\n<thead><tr>${th}</tr></thead>\n<tbody>\n${tb}\n</tbody></table>`;
}

/**
 * Blockquotes carry two different jobs in these documents, and they should not
 * look alike: a bolded lead-in is a caution the reader must not skim past, while
 * a quoted line is something to say out loud. Split them on that signal.
 */
function renderQuote(buf) {
  const body = buf.map((l) => l.replace(/^>\s?/, '')).join('\n').trim();
  const spoken = /^["“]/.test(body);
  const paras = body.split(/\n{2,}/).map((p) => `<p>${inline(p.replace(/\n/g, ' '))}</p>`).join('');
  return spoken
    ? `<div class="pull"><p class="lbl">Say it like this</p>${paras}</div>`
    : `<div class="note">${paras}</div>`;
}
/** Block-level pass. Returns { title, toc, html }. */
function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  const toc = [];
  let title = null;
  let i = 0;

  const isTableStart = (n) => lines[n]?.includes('|') && /^\s*\|?[\s:|-]*-[\s:|-]*\|/.test(lines[n + 1] || '');

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }
    if (/^Developed by:/.test(line)) { i++; continue; } // becomes the document footer

    // <details> — Chromium prints a collapsed <details> as just its summary, so
    // the answers to a self-test would silently vanish from the PDF. Force open.
    if (/^<details/i.test(line)) {
      const buf = [];
      const sum = (line.match(/<summary>(.*?)<\/summary>/i) || [, 'Answers'])[1];
      i++;
      while (i < lines.length && !/^<\/details>/i.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<div class="ans"><p class="lbl">${inline(sum)}</p>${mdToHtml(buf.join('\n')).html}</div>`);
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      if (level === 1 && title === null) { title = text; i++; continue; } // becomes the masthead
      if (level === 2) toc.push(text);
      const id = slug(text);
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++;
      continue;
    }

    if (line.startsWith('>')) {
      const buf = [];
      while (i < lines.length && (lines[i].startsWith('>') || (buf.length && lines[i].trim() && !lines[i].startsWith('#')))) {
        if (!lines[i].startsWith('>')) break;
        buf.push(lines[i++]);
      }
      out.push(renderQuote(buf));
      continue;
    }

    if (isTableStart(i)) {
      const buf = [];
      while (i < lines.length && lines[i].includes('|')) buf.push(lines[i++]);
      out.push(renderTable(buf));
      continue;
    }

    const listKind = /^\s*[-*]\s+/.test(line) ? 'ul' : /^\s*\d+\.\s+/.test(line) ? 'ol' : null;
    if (listKind) {
      const items = [];
      const marker = listKind === 'ul' ? /^\s*[-*]\s+/ : /^\s*\d+\.\s+/;
      while (i < lines.length && lines[i].trim()) {
        if (marker.test(lines[i])) items.push(lines[i].replace(marker, ''));
        else if (items.length) items[items.length - 1] += ' ' + lines[i].trim(); // wrapped continuation
        else break;
        i++;
      }
      out.push(`<${listKind}>` + items.map((t) => `<li>${inline(t)}</li>`).join('') + `</${listKind}>`);
      continue;
    }

    // paragraph — consume until a blank line or the start of another block
    const para = [];
    while (i < lines.length && lines[i].trim()
           && !/^(#{1,4}\s|>|<details|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]) && !isTableStart(i)) {
      para.push(lines[i++]);
    }
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    else i++; // never stall on an unrecognised line
  }

  return { title, toc, html: out.join('\n') };
}
// ── Stylesheet ─────────────────────────────────────────────────────────────
// The `bloomberg` export skin from PROFILER-STYLES.md, translated from the same
// print-calibrated CSS that scripts/build-aidc-report-pdf.mjs uses, minus the
// chart/figure/timeline machinery a prose brief has no use for.
const CSS = `
:root {
  --ink:#23211c; --paper:#ffffff; --blue:#0b62a4; --gold:#8a6d1f;
  --muted:#6d6758; --faint:#8b8577; --rule:#cfc8b4; --rule-soft:#d8d2c0;
  --link:#305a8a; --accent:var(--blue); --pull-bg:#f4f8fb;
  --sans:Arial,Helvetica,"Liberation Sans",sans-serif;
  --mono:"DejaVu Sans Mono",Consolas,"Liberation Mono",Menlo,monospace;
}
@page { size:Letter; margin:15mm 14mm 15mm; }
* { box-sizing:border-box; }
html { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
body {
  margin:0; background:var(--paper); color:var(--ink);
  font:10pt/1.5 var(--sans); text-rendering:optimizeLegibility;
}

/* ── Masthead ─────────────────────────────────────────────────────────── */
.mast { border-top:6pt solid var(--accent); padding-top:10pt; }
.mast .kick {
  font:8pt/1.4 var(--mono); letter-spacing:.22em; text-transform:uppercase;
  color:var(--accent); margin:0 0 14pt;
}
h1 { font:bold 30pt/1.08 var(--sans); letter-spacing:-.015em; margin:0 0 6pt; }
.mast .sub { font:15pt/1.3 var(--sans); color:var(--muted); margin:0 0 18pt; }
.mast .meta {
  font:8pt/1.75 var(--mono); color:var(--muted);
  border-top:1pt solid var(--rule); border-bottom:2pt solid var(--ink);
  padding:9pt 0; margin:0;
}
.mast .meta b { color:var(--ink); font-weight:bold; }
.sty-banner {
  font:7.5pt/1.6 var(--mono); letter-spacing:.08em; color:var(--muted);
  border:0.5pt solid var(--rule); border-radius:3pt; padding:5pt 9pt; margin:9pt 0 0;
}
.sty-banner b { color:var(--accent); letter-spacing:.14em; text-transform:uppercase; }

/* ── Contents ─────────────────────────────────────────────────────────── */
.lead { margin:12pt 0 0; }
.lead > p:first-child { margin-top:0; }
.toc-h {
  font:8pt/1.4 var(--mono); letter-spacing:.22em; text-transform:uppercase;
  color:var(--accent); margin:18pt 0 6pt;
  border-top:1pt solid var(--rule); padding-top:12pt;
}
.toc { column-count:2; column-gap:22pt; font-size:9pt; margin:0 0 4pt; }
.toc div { break-inside:avoid; margin:0 0 3.5pt; }
.toc .n { font:bold 8pt/1 var(--mono); color:var(--accent); margin-right:6pt; }
.toc a { color:var(--ink); }

/* ── Section hierarchy ────────────────────────────────────────────────── */
h2 {
  font:bold 13.5pt/1.25 var(--sans); color:var(--accent);
  border-bottom:2pt solid var(--accent); padding-bottom:4pt;
  margin:24pt 0 10pt; page-break-after:avoid;
}
h3 { font:bold 11pt/1.3 var(--sans); margin:15pt 0 4pt; page-break-after:avoid; }
h4 {
  font:8pt/1.4 var(--mono); letter-spacing:.13em; text-transform:uppercase;
  color:var(--gold); margin:13pt 0 4pt; page-break-after:avoid;
}
p { margin:6pt 0; orphans:2; widows:2; }
ul,ol { margin:5pt 0 9pt; padding-left:15pt; }
li { margin:3.5pt 0; }
b,strong { font-weight:bold; }
em,i { font-style:italic; }
a { color:var(--link); text-decoration:none; }
code {
  font:8.5pt var(--mono); background:#f2efe7; border-radius:2pt;
  padding:0.5pt 2.5pt; word-break:break-word;
}

/* ── Callouts ─────────────────────────────────────────────────────────── */
.pull {
  border-left:3pt solid var(--accent); background:var(--pull-bg);
  padding:8pt 12pt; margin:12pt 0; page-break-inside:avoid;
}
.pull .lbl, .ans .lbl {
  font:7.5pt/1.4 var(--mono); letter-spacing:.16em; text-transform:uppercase;
  color:var(--accent); margin:0 0 4pt;
}
.pull p { margin:0 0 4pt; font-size:9.5pt; font-style:italic; }
.pull p:last-child { margin-bottom:0; }
.note {
  border:0.5pt solid var(--rule); background:#faf8f3;
  padding:8pt 12pt; margin:12pt 0; font-size:9pt; page-break-inside:avoid;
}
.note p { margin:0 0 5pt; }
.note p:last-child { margin-bottom:0; }
.ans {
  border-top:1.5pt solid var(--ink); margin:14pt 0 0; padding:8pt 0 0;
  page-break-inside:avoid;
}
.ans .lbl { color:var(--gold); }
.ans ol { font-size:9pt; }

/* ── Tables ───────────────────────────────────────────────────────────── */
table {
  border-collapse:collapse; width:100%; margin:8pt 0 10pt; font-size:8.5pt;
  /* long tables span pages with a repeated header instead of jumping whole to
     the next page; fixed layout holds the computed column widths so one long
     unbreakable cell cannot push the table past the printable width */
  page-break-inside:auto; table-layout:fixed;
}
thead { display:table-header-group; }
th, td { overflow-wrap:break-word; }
th {
  vertical-align:bottom; font:7.5pt/1.35 var(--mono);
  letter-spacing:.09em; text-transform:uppercase; color:var(--muted);
  border-bottom:1.5pt solid var(--ink); padding:4pt 8pt 4pt 0;
}
tr { page-break-inside:avoid; }
td {
  border-bottom:0.5pt solid var(--rule-soft); padding:5.5pt 8pt 5.5pt 0;
  vertical-align:top; line-height:1.42;
}
td.k { font-weight:bold; }
td:last-child, th:last-child { padding-right:0; }

/* ── Footer block ─────────────────────────────────────────────────────── */
.foot {
  margin-top:22pt; border-top:1pt solid var(--rule); padding-top:7pt;
  font:7.5pt/1.6 var(--mono); color:var(--muted);
}
`;
// ── Page shell ─────────────────────────────────────────────────────────────
function buildHtml(doc, parsed) {
  const toc = parsed.toc.map((t, n) =>
    `<div><span class="n">${String(n + 1).padStart(2, '0')}</span><a href="#${slug(t)}">${inline(t)}</a></div>`).join('\n');
  // Whatever sits between the H1 and the first H2 is the document's own framing
  // — who it is for, what it was built from. It belongs above the contents, not
  // stranded after it, which is where a fixed masthead-then-TOC shell puts it.
  const cut = parsed.html.indexOf('<h2');
  const lead = cut === -1 ? parsed.html : parsed.html.slice(0, cut);
  const rest = cut === -1 ? '' : parsed.html.slice(cut);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(parsed.title || doc.sub)}</title>
<style>${CSS}</style>
</head>
<body>
<header class="mast">
  <p class="kick">${doc.kick}</p>
  <h1>${esc(parsed.title || '')}</h1>
  <p class="sub">${doc.sub}</p>
  <p class="meta">${doc.meta.join('<br>')}</p>
  <p class="sty-banner">${doc.banner}</p>
</header>
<div class="lead">
${lead}
</div>
<p class="toc-h">Contents</p>
<nav class="toc">
${toc}
</nav>
${rest}
<p class="foot">${doc.runFoot} &nbsp;·&nbsp; Rendered from ${basename(doc.src)}, which remains the source of truth &nbsp;·&nbsp; Developed by: ShadowAISolutions</p>
</body>
</html>`;
}

const runHeader = (doc) => `
<div style="width:100%;font:6.5pt/1.2 Arial,Helvetica,sans-serif;color:#a8a294;
            padding:0 14mm;text-align:right;letter-spacing:.14em;text-transform:uppercase;">
  ${esc(doc.runHead)}
</div>`;
const runFooter = (doc) => `
<div style="width:100%;font:7pt/1.2 Arial,Helvetica,sans-serif;color:#6d6758;
            padding:0 14mm;display:flex;justify-content:space-between;">
  <span>${esc(doc.runFoot)}</span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;

// ── Main ───────────────────────────────────────────────────────────────────
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const bad = wanted.filter((k) => !(k in DOCS));
if (bad.length) {
  console.error(`unknown doc key(s): ${bad.join(', ')} — expected one of: ${Object.keys(DOCS).join(', ')}`);
  process.exit(2);
}
const buildList = wanted.length ? wanted : Object.keys(DOCS);
const keepHtml = process.argv.includes('--keep-html');
const staging = mkdtempSync(resolve(tmpdir(), 'study-prep-'));

const chrome = spawn(findChrome(), [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none',
  `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

try {
  await waitForDevTools();
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const c = cdp(target.webSocketDebuggerUrl);
  await c.open;
  await c.send('Page.enable');

  for (const key of buildList) {
    const doc = DOCS[key];
    const src = resolve(ROOT, doc.src);
    if (!existsSync(src)) { console.log(`${key.padEnd(24)} -- skipped, no source at ${doc.src}`); continue; }

    const parsed = mdToHtml(readFileSync(src, 'utf8'));
    const html = buildHtml(doc, parsed);
    // staged outside the repo: the HTML is derived, and a committed copy would
    // be one more thing to drift from the Markdown
    const stage = resolve(staging, `${key}.html`);
    writeFileSync(stage, html);
    if (keepHtml) writeFileSync(resolve(ROOT, dirname(doc.out), `${key}-print.html`), html);

    const loaded = c.once('Page.loadEventFired');
    await c.send('Page.navigate', { url: `file://${stage}` });
    await loaded;
    await sleep(500); // let layout and font metrics settle before the paginator runs

    const { data } = await c.send('Page.printToPDF', {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: runHeader(doc),
      footerTemplate: runFooter(doc),
      marginTop: 0.62, marginBottom: 0.62, marginLeft: 0.55, marginRight: 0.55,
    });
    const buf = Buffer.from(data, 'base64');
    writeFileSync(resolve(ROOT, doc.out), buf);
    const counts = [...buf.toString('latin1').matchAll(/\/Count\s+(\d+)/g)].map((m) => +m[1]);
    const pages = counts.length ? Math.max(...counts) : '?';
    console.log(`${key.padEnd(24)} -> ${basename(doc.out).padEnd(30)} ${(buf.length / 1024).toFixed(0)} KB, ${pages} pages, ${parsed.toc.length} sections`);

    if (process.argv.includes('--png')) {
      // Proof mode: a continuous-scroll capture of the same DOM the paginator
      // just consumed. It verifies content and layout, not page breaks.
      const scratch = process.env.SCRATCH || '/tmp';
      await c.send('Emulation.setDeviceMetricsOverride', {
        width: 816, height: 1056, deviceScaleFactor: 1.5, mobile: false,
      });
      const { contentSize } = await c.send('Page.getLayoutMetrics');
      const shots = Math.min(Math.ceil(contentSize.height / 1056), 40);
      for (let p = 0; p < shots; p++) {
        const shot = await c.send('Page.captureScreenshot', {
          format: 'png', captureBeyondViewport: true,
          clip: { x: 0, y: p * 1056, width: 816, height: 1056, scale: 1.5 },
        });
        writeFileSync(`${scratch}/${key}-p${String(p + 1).padStart(2, '0')}.png`,
          Buffer.from(shot.data, 'base64'));
      }
      await c.send('Emulation.clearDeviceMetricsOverride');
      console.log(`  wrote ${shots} preview PNGs to ${scratch}`);
    }
  }
  c.close();
} finally {
  chrome.kill('SIGKILL');
}
// Developed by: ShadowAISolutions
