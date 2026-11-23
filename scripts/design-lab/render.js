#!/usr/bin/env node
/*
 * design-lab/render.js: screenshot the direction mockups (desktop 1440 + phone 390) into docs/design-directions/.
 * Usage: node scripts/design-lab/render.js [a-editorial b-stage c-casefile]
 */
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const { serve } = require('../logo-3d/serve');
const OUT = path.resolve(__dirname, '..', '..', 'docs', 'design-directions');
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['a-editorial', 'b-stage', 'c-casefile'];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { server, url } = await serve();
  const b = await chromium.launch();
  for (const n of names) for (const [tag, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: tag === 'phone' ? 2 : 1 });
    p.on('pageerror', e => console.log('PAGEERROR', n, e.message));
    await p.goto(`${url}/scripts/design-lab/${n}.html`);
    await p.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
    await p.screenshot({ path: path.join(OUT, `${n}-${tag}.png`), fullPage: true });
    console.log(n, tag); await p.close();
  }
  await b.close(); server.close();
})();
