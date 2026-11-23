#!/usr/bin/env node
/*
 * render-card.js: export the business card in docs/card/card.html.
 *
 * Usage: node scripts/render-card.js
 * Writes to docs/card/:
 *   card-front.png, card-back.png  300 dpi, 57 × 95 mm (51 × 89 mm trim + 3 mm bleed) → for the printer
 *   card-preview.png               both sides, trimmed, side by side → to look at
 *   card.pdf                       2 pages, 57 × 95 mm, vector text → for the printer
 */
const path = require('path');
const { chromium } = require('playwright');

const dir = path.resolve(__dirname, '..', 'docs', 'card');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 1000 }, deviceScaleFactor: 300 / 96 });
  await page.goto('file://' + path.join(dir, 'card.html'));
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });

  for (const side of ['front', 'back']) {
    await (await page.$('#' + side)).screenshot({ path: path.join(dir, `card-${side}.png`) });
  }
  await (await page.$('#preview')).screenshot({ path: path.join(dir, 'card-preview.png') });

  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: path.join(dir, 'card.pdf'), printBackground: true, preferCSSPageSize: true });

  await browser.close();
  console.log('done →', dir);
})().catch((e) => { console.error(e); process.exit(1); });
