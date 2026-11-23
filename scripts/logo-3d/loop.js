#!/usr/bin/env node
/*
 * loop.js: render the hero logo (holographic glass) as the seamless fallback loops the site shows where the live 3D
 * does not run (phones, low-power devices). It renders the site's own scene module (site/src/components/brand/
 * glass-scene.js) through scripts/logo-3d/glass.html, served by serve.js, so the video matches the live logo.
 *   node scripts/logo-3d/loop.js --stills   framing check → scripts/logo-3d/out/
 *   node scripts/logo-3d/loop.js            → site/public/media/liquid-logo/hero-4x5.* and hero-16x9.* (webm, mp4, webp, jpg)
 * Needs ffmpeg. 30 fps, 7 s, seamless (the sway is a full sine period).
 */
const fs = require('fs'); const os = require('os'); const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'site', 'public', 'media', 'liquid-logo');
const STILLS = path.join(__dirname, 'out');
const VARIANTS = {
  'hero-4x5': { w: 1080, h: 1350, q: 'fit=0.82&bx=230&by=34&bs=0.7&sway=0.7', crf: [36, 27] },
  'hero-16x9': { w: 1920, h: 1080, q: 'fit=0.6&bx=340&by=60&bs=1.15&sway=0.7', crf: [36, 27] },
};
const FPS = 30, SEC = 7, N = FPS * SEC;
const stills = process.argv.includes('--stills');
const { serve } = require('./serve');
(async () => {
  const { server, url } = await serve();
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  for (const [name, v] of Object.entries(VARIANTS)) {
    const p = await b.newPage({ viewport: { width: v.w, height: v.h } });
    await p.goto(`${url}/scripts/logo-3d/glass.html?q=export&w=${v.w}&h=${v.h}&${v.q}`);
    await p.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
    const save = (u, f) => fs.writeFileSync(f, Buffer.from(u.split(',')[1], 'base64'));
    if (stills) { fs.mkdirSync(STILLS, { recursive: true }); save(await p.evaluate(() => window.renderAt(0.2)), path.join(STILLS, `${name}.png`)); await p.close(); console.log('still', name); continue; }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `epox-glass-${name}-`)); const t0 = Date.now();
    for (let i = 0; i < N; i++) save(await p.evaluate(t => window.renderAt(t), i / N), path.join(tmp, `f${String(i).padStart(4, '0')}.png`));
    await p.close();
    const inp = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png')];
    execFileSync('ffmpeg', [...inp, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(v.crf[0]), '-row-mt', '1', '-pix_fmt', 'yuv420p', '-an', path.join(OUT, `${name}.webm`)]);
    execFileSync('ffmpeg', [...inp, '-c:v', 'libx264', '-crf', String(v.crf[1]), '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(OUT, `${name}.mp4`)]);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'f0000.png'), '-q:v', '3', path.join(OUT, `${name}.jpg`)]);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(tmp, 'f0000.png'), '-c:v', 'libwebp', '-quality', '74', path.join(OUT, `${name}.webp`)]);
    fs.rmSync(tmp, { recursive: true, force: true });
    const kb = f => Math.round(fs.statSync(path.join(OUT, f)).size / 1024);
    console.log(`${name}: ${Math.round((Date.now() - t0) / 1000)}s · webm ${kb(name + '.webm')} KB · mp4 ${kb(name + '.mp4')} KB · webp ${kb(name + '.webp')} KB`);
  }
  await b.close(); server.close();
})().catch(e => { console.error(e); process.exit(1); });
