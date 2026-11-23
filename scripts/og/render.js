#!/usr/bin/env node
/*
 * og/render.js: link-preview images (Open Graph / X cards) for every page, in the Ice Mint style.
 *
 * Usage: start the site (npm --prefix site run dev, or build + start), then
 *   node scripts/og/render.js [base URL, default http://localhost:3000]
 * Reads each page's hero label and headline from the running site, so the images follow the copy.
 * Writes site/public/og/<name>.jpg (1200 × 630): home.jpg, services.jpg, services-<slug>.jpg, work-<slug>.jpg …
 * Pages pick their image up through lib/og.ts. Re-run after changing a headline.
 *
 * Layout: brand-black ground, foil wordmark top left, the full foil E running off the right edge (as on every hero),
 * the page's hero label + headline bottom left (Space Grotesk Bold, white).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..', '..');
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const out = path.join(root, 'site', 'public', 'og');
const fonts = path.join(root, 'site', 'src', 'app', 'fonts');

const src = fs.readFileSync(path.join(root, 'site', 'src', 'components', 'brand', 'wordmark-path.ts'), 'utf8');
const WORD = src.match(/WORDMARK_PATH = '([^']+)'/)[1];
const WORD_VB = src.match(/WORDMARK_VIEWBOX = '([^']+)'/)[1];
const font = f => `data:font/woff2;base64,${fs.readFileSync(path.join(fonts, f)).toString('base64')}`;

const STOPS = [['0', '#BFE3FF'], ['0.2', '#E2FFF4'], ['0.4', '#8FC9FF'], ['0.58', '#7FF5D0'], ['0.78', '#E4FBFF'], ['1', '#A8F0E0']]
  .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
const grain = (id, size, w) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${size}" height="${size}" patternTransform="rotate(-35)"><rect width="${w}" height="${size}" fill="#fff" fill-opacity="0.22"/></pattern>`;

const wordmark = `<svg class="mark" viewBox="${WORD_VB}"><defs><linearGradient id="wf" x1="0" y1="0" x2="1" y2="1">${STOPS}</linearGradient>${grain('wg', 9.19, 2.48)}</defs>
  <path d="${WORD}" fill="url(#wf)"/><path d="${WORD}" fill="url(#wg)"/></svg>`;
// full E (brand device file) and the card back's short bars; right ends run past the image edge
const E = '169.2,39 1336,39 1336,59.8 189.5,59.8 182.2,85.8 1336,85.8 1336,106.6 177,106.6 169.7,132.6 1336,132.6 1336,153.4 138,153.4';
const bars = full => full
  ? `<svg class="bars bars--e" viewBox="138 39 198 114.4" overflow="visible"><defs><linearGradient id="bf" gradientUnits="userSpaceOnUse" x1="138" y1="9.3" x2="336" y2="193">${STOPS}</linearGradient>${grain('bg', 3, 0.81)}</defs>
      <polygon points="${E}" fill="url(#bf)"/><polygon points="${E}" fill="url(#bg)"/></svg>`
  : `<svg class="bars bars--short" viewBox="232 22 104 45" overflow="visible"><defs><linearGradient id="bf" gradientUnits="userSpaceOnUse" x1="228" y1="-1.55" x2="345" y2="97.4">${STOPS}</linearGradient>${grain('bg', 3, 0.81)}</defs>
      ${['234.5,22 1336,22 1336,31 232,31', '252.5,40 1336,40 1336,49 250,49', '234.5,58 1336,58 1336,67 232,67']
        .map(p => `<polygon points="${p}" fill="url(#bf)"/><polygon points="${p}" fill="url(#bg)"/>`).join('')}</svg>`;

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = ({ label, title, home }) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: SG; src: url(${font('space-grotesk-latin-700-normal.woff2')}) format('woff2'); font-weight: 700; }
@font-face { font-family: IN; src: url(${font('inter-latin-700-normal.woff2')}) format('woff2'); font-weight: 700; }
html, body { margin: 0; }
body { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #0B0C0F; color: #F2F5F9; }
.mark { position: absolute; left: 72px; top: 64px; width: 176px; height: auto; }
.bars { position: absolute; right: 0; }
.bars--e { top: 92px; width: 470px; }
.bars--short { top: 74px; width: 300px; }
.text { position: absolute; left: 72px; bottom: 68px; width: 620px; }
.label { font: 700 18px/1.3 IN; letter-spacing: 0.22em; text-transform: uppercase; color: #B9C0CB; margin: 0 0 22px; }
h1 { font: 700 var(--fs, 68px)/1.04 SG; letter-spacing: -0.02em; margin: 0; text-wrap: balance; }
</style></head><body>${wordmark}${bars(home)}
<div class="text">${label ? `<p class="label">${esc(label)}</p>` : ''}<h1>${esc(title)}</h1></div></body></html>`;

const nameFor = r => (r === '/' ? 'home' : r.slice(1).replace(/\//g, '-'));

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const site = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  const routes = ['/', '/services', '/work', '/how-we-work', '/about', '/contact'];
  for (const [index, prefix] of [['/services', '/services/'], ['/work', '/work/']]) {
    await site.goto(base + index, { waitUntil: 'domcontentloaded' });
    const found = await site.$$eval(`main a[href^="${prefix}"]`, (as, p) => [...new Set(as.map(a => a.getAttribute('href')).filter(h => h.split('/').length === 3 && h.startsWith(p)))], prefix);
    routes.push(...found);
  }

  for (const r of [...new Set(routes)]) {
    await site.goto(base + r, { waitUntil: 'domcontentloaded' });
    const { label, title } = await site.evaluate(() => {
      const h1 = document.querySelector('h1');
      const hero = h1.closest('section');
      const l = hero.querySelector('.t-label');
      const clean = s => (s || '').replace(/\s+/g, ' ').trim();
      // a label made of several parts (e.g. "Work" link + "Case 001") reads as "Work · Case 001"
      const label = l && l.children.length > 1 ? [...l.children].map(c => clean(c.innerText)).join(' · ') : clean(l?.innerText);
      return { label, title: clean(h1.innerText) };
    });
    await card.setContent(html({ label: r === '/' ? '' : label, title, home: true }));
    await card.evaluate(() => document.fonts.ready);
    // fit: shrink the headline until the text block stays clear of the wordmark / bars
    await card.evaluate(() => {
      const t = document.querySelector('.text'); let fs = 68;
      while (t.getBoundingClientRect().top < 170 && fs > 40) { fs -= 2; document.body.style.setProperty('--fs', fs + 'px'); }
    });
    const file = path.join(out, nameFor(r) + '.jpg');
    await card.screenshot({ path: file, type: 'jpeg', quality: 90 });
    console.log(path.relative(root, file), '·', title);
  }
  await browser.close();
})();
