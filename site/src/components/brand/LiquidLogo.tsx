'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { whenIdle } from '@/lib/motion';

/**
 * Home hero logo.
 * · Capable desktops (fine pointer, ≥768px wide, WebGL2, 4+ cores): the live 3D holographic-glass wordmark (GlassLogo,
 *   plain three.js, scene in glass-scene.js), built only after the page has loaded, the visitor has moved / scrolled, and
 *   the browser is idle; draws only while on screen, at full rate only while something moves.
 * · Everyone else: the same glass scene rendered as a seamless loop (scripts/logo-3d/loop.js; files in public/media/liquid-logo), 16:9 or 4:5.
 * A light WebP still (only the one for this screen size downloads) always shows first, so the first paint stays fast;
 * the 3D or the video fades in over it. Reduced motion or Data Saver: the still only.
 * Decorative brand moment: the container carries the name for screen readers.
 */
const BASE = '/media/liquid-logo';
const GlassLogo = dynamic(() => import('./GlassLogo'), { ssr: false });

function Loop({ name, className }: { name: string; className: string }) {
  return (
    <video className={className} muted loop playsInline preload="none" aria-hidden tabIndex={-1}>
      <source src={`${BASE}/${name}.webm`} type="video/webm" />
      <source src={`${BASE}/${name}.mp4`} type="video/mp4" />
    </video>
  );
}

/** desktop-class device that can run the glass scene comfortably */
function canRun3D() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return false;
  if ((navigator.hardwareConcurrency || 4) < 4) return false;
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

export function LiquidLogo({ className = '' }: { variant?: 'hero'; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [glass, setGlass] = useState(false);     // mount the 3D scene
  const [glassOn, setGlassOn] = useState(false); // first frame drawn → fade in
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const root = ref.current; if (!root) return;
    const reduced = document.documentElement.dataset.motion === 'reduced';
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduced || saveData) return;
    const use3D = canRun3D();
    const videos = Array.from(root.querySelectorAll('video'));
    const visible = () => videos.find(v => getComputedStyle(v).display !== 'none');
    videos.forEach(v => v.addEventListener('playing', () => v.setAttribute('data-on', ''), { once: true }));
    let seen = false; let ready = false; let cancelled = false;
    const sync = () => {
      if (use3D) return;
      const v = visible();
      videos.forEach(x => { if (x !== v || !seen) x.pause(); });
      if (!v || !seen || !ready) return;
      if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
      v.play().catch(() => {});
    };
    // wait for the page to finish loading, then for an idle moment, so neither the 3D nor the video competes with the first paint.
    // The 3D scene (≈0.5 s of main-thread setup) waits for the visitor's first move, scroll or key press as well:
    // on a desktop that is almost immediate, and the page is fully interactive before any of it runs.
    const kinds = ['pointermove', 'scroll', 'keydown', 'pointerdown'] as const;
    let acted = false; let loaded = false;
    const go = () => { if (cancelled || !loaded || (use3D && !acted)) return; whenIdle(() => { if (cancelled) return; ready = true; if (use3D) setGlass(true); sync(); }); };
    const onAct = () => { if (acted) return; acted = true; kinds.forEach(k => window.removeEventListener(k, onAct)); go(); };
    const start = () => { loaded = true; go(); };
    if (use3D) kinds.forEach(k => window.addEventListener(k, onAct, { passive: true }));
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; setOnScreen(seen); sync(); }, { threshold: 0.05 });
    io.observe(root);
    const mq = window.matchMedia('(min-width: 768px)'); mq.addEventListener('change', sync);
    return () => { cancelled = true; io.disconnect(); mq.removeEventListener('change', sync); window.removeEventListener('load', start); kinds.forEach(k => window.removeEventListener(k, onAct)); videos.forEach(v => v.pause()); };
  }, []);

  return (
    <div ref={ref} className={`liquid liquid--hero ${className}`} role="img" aria-label="epox logo">
      <picture>
        <source media="(min-width: 768px)" srcSet={`${BASE}/hero-16x9.webp`} width={1920} height={1080} />
        <img className="liquid-still" src={`${BASE}/hero-4x5.webp`} alt="" width={1080} height={1350} decoding="async" fetchPriority="high" />
      </picture>
      <Loop name="hero-16x9" className="liquid-video liquid-wide" />
      <Loop name="hero-4x5" className="liquid-video liquid-tall" />
      {glass && (
        <div className="liquid-3d" data-on={glassOn || undefined}>
          <GlassLogo active={onScreen} onReady={() => setGlassOn(true)} />
        </div>
      )}
    </div>
  );
}
