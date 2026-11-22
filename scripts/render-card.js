#!/usr/bin/env node
/*
 * render-card.js: export the business card (Ice Mint brand system, Business card group) from the SVGs in docs/card/.
 *
 * Usage: node scripts/render-card.js
 * Reads docs/card/epox-card-{front,back}.svg (trim, 3.5 × 2 in) and epox-card-{front,back}-print-bleed.svg (3.75 × 2.25 in).
 * Writes to docs/card/:
 *   epox-card-front.png, epox-card-back.png                          300 dpi at trim size (1050 × 600) → proofs
 *   epox-card-front-print-bleed.png, epox-card-back-print-bleed.png  300 dpi with 3 mm bleed (1125 × 675) → for the printer
 *   card-preview.png                                                 both sides at trim, side by side → to look at
 *   card.pdf                                                         2 pages with bleed, vector, fonts embedded → for the printer
 * The contact lines are live Inter text in the SVGs; the fonts come from site/src/app/fonts so the export matches the site.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'docs', 'card');
const fonts = path.join(root, 'site', 'src', 'app', 'fonts');
const face = (w) => `@font-face { font-family: Inter; font-weight: ${w}; src: url(data:font/woff2;base64,${fs.readFileSync(path.join(fonts, `inter-latin-${w}-normal.woff2`)).toString('base64')}) format('woff2'); }`;
const css = [400, 500, 600, 700].map(face).join('\n');
const svg = (name) => fs.readFileSync(path.join(dir, `${name}.svg`), 'utf8');

const page = (body, extra = '') => `<!doctype html><html><head><meta charset="utf-8"><style>${css}
html, body { margin: 0; background: #1c1f25; } svg { display: block; } ${extra}</style></head><body>${body}</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 300 / 96 });

  // PNGs: each SVG at its own inch size (96 css px per inch × 300/96 device scale = 300 dpi)
  for (const name of ['epox-card-front', 'epox-card-back', 'epox-card-front-print-bleed', 'epox-card-back-print-bleed']) {
    await p.setContent(page(`<div id="c">${svg(name)}</div>`, '#c { display: inline-block; }'));
    await p.evaluate(() => document.fonts.ready);
    await (await p.$('#c svg')).screenshot({ path: path.join(dir, `${name}.png`) });
  }

  // preview: both sides at trim, side by side, on the raised surface
  await p.setContent(page(`<div id="pv" style="display:inline-flex;gap:48px;padding:48px">${svg('epox-card-front')}${svg('epox-card-back')}</div>`,
    '#pv svg { width: 336px; height: 192px; border-radius: 6px; }'));
  await p.evaluate(() => document.fonts.ready);
  await (await p.$('#pv')).screenshot({ path: path.join(dir, 'card-preview.png') });

  // PDF: two pages at bleed size, vector artwork with the fonts embedded
  await p.setContent(page(`${svg('epox-card-front-print-bleed')}<div style="break-before:page"></div>${svg('epox-card-back-print-bleed')}`,
    '@page { size: 3.75in 2.25in; margin: 0; } html, body { background: #0B0C0F; } svg { width: 3.75in; height: 2.25in; }'));
  await p.evaluate(() => document.fonts.ready);
  await p.emulateMedia({ media: 'print' });
  await p.pdf({ path: path.join(dir, 'card.pdf'), printBackground: true, preferCSSPageSize: true });

  await browser.close();
  console.log('Wrote PNGs, card-preview.png and card.pdf to', path.relative(root, dir));
})();
