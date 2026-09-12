#!/usr/bin/env node
/**
 * build-sst-primer-pdf.mjs — renders repository-information/sst-primer-print.html
 * to repository-information/SOLID-STATE-TRANSFORMERS-PRIMER.pdf.
 *
 * Same mechanism as build-aidc-report-pdf.mjs: the pre-installed Chromium
 * (PLAYWRIGHT_BROWSERS_PATH) driven over the DevTools Protocol so that
 * Page.printToPDF can carry a custom running header/footer with page numbers.
 * No npm dependencies — Node 22 ships a global WebSocket.
 *
 * The primer is a single-edition educational document (one skin), so this is a
 * deliberately smaller script than the five-style report renderer: one source,
 * one output, plus the --png proof mode for visual review.
 *
 * Usage: node scripts/build-sst-primer-pdf.mjs [--png]
 */
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 9334;
const SRC = resolve(ROOT, 'repository-information/sst-primer-print.html');
const OUT = resolve(ROOT, 'repository-information/SOLID-STATE-TRANSFORMERS-PRIMER.pdf');

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
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) return; } catch { /* not up yet */ }
    await sleep(150);
  }
  throw new Error('Chromium DevTools endpoint never came up');
}
function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map(); const waiters = new Map();
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve: res, reject } = pending.get(msg.id); pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : res(msg.result);
    } else if (msg.method && waiters.has(msg.method)) { waiters.get(msg.method)(); waiters.delete(msg.method); }
  });
  const open = new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', () => rej(new Error('CDP socket error'))); });
  return {
    open,
    send(method, params = {}) { return new Promise((res, rej) => { pending.set(++id, { resolve: res, reject: rej }); ws.send(JSON.stringify({ id, method, params })); }); },
    once(method) { return new Promise((res) => waiters.set(method, res)); },
    close() { ws.close(); },
  };
}

const FOOT = `
<div style="width:100%;font:7pt/1.2 Arial,Helvetica,sans-serif;color:#6d6758;padding:0 14mm;display:flex;justify-content:space-between;">
  <span>Solid-State Transformers for AI Data Centers — Educational Primer · Internal · Not investment advice</span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;
const HEAD = `
<div style="width:100%;font:6.5pt/1.2 Arial,Helvetica,sans-serif;color:#a8a294;padding:0 14mm;text-align:right;letter-spacing:.14em;text-transform:uppercase;">
  Jon Yang · Sales Research · 12 September 2026
</div>`;

const chrome = spawn(findChrome(), [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none',
  `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

try {
  await waitForDevTools();
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?file://${SRC}`, { method: 'PUT' })).json();
  const c = cdp(target.webSocketDebuggerUrl);
  await c.open;
  await c.send('Page.enable');
  const loaded = c.once('Page.loadEventFired');
  await c.send('Page.navigate', { url: `file://${SRC}` });
  await loaded;
  await c.send('Runtime.enable');
  await sleep(700);
  const { data } = await c.send('Page.printToPDF', {
    printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: HEAD, footerTemplate: FOOT,
    // margins come from the stylesheet's @page rule (preferCSSPageSize); passing them
    // here as well made Chromium draw repeated <thead> rows over the running header
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
  });
  const buf = Buffer.from(data, 'base64');
  writeFileSync(OUT, buf);
  const counts = [...buf.toString('latin1').matchAll(/\/Count\s+(\d+)/g)].map((m) => +m[1]);
  console.log(`-> ${OUT} ${(buf.length / 1024).toFixed(0)} KB, ${counts.length ? Math.max(...counts) : '?'} pages`);

  if (process.argv.includes('--png')) {
    const scratch = process.env.SCRATCH || '/tmp';
    await c.send('Runtime.evaluate', { expression: `document.head.insertAdjacentHTML('beforeend','<style>.brk{page-break-before:auto!important}body{width:740px;margin:0 auto}</style>')` });
    await c.send('Emulation.setDeviceMetricsOverride', { width: 816, height: 1056, deviceScaleFactor: 1.5, mobile: false });
    const { contentSize } = await c.send('Page.getLayoutMetrics');
    const shots = Math.min(Math.ceil(contentSize.height / 1056), 60);
    for (let p = 0; p < shots; p++) {
      const shot = await c.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: p * 1056, width: 816, height: 1056, scale: 1.5 } });
      writeFileSync(`${scratch}/sst-p${String(p + 1).padStart(2, '0')}.png`, Buffer.from(shot.data, 'base64'));
    }
    console.log(`wrote ${shots} preview PNGs to ${scratch}`);
  }
  c.close();
} finally {
  chrome.kill('SIGKILL');
}
// Developed by: LightAISolutions
