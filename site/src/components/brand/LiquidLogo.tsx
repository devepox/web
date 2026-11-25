'use client';
import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState } from 'react';
import { whenIdle } from '@/lib/motion';
import { getStory, hasWebGL2, onStory, story2D, storyOn } from '@/lib/story';

/**
 * Home hero logo.
 * · Capable desktops (fine pointer, ≥768px wide, WebGL2, 4+ cores): the live 3D holographic-glass wordmark (GlassLogo,
 *   react-three-fiber), built only after the page has loaded, the visitor has moved / scrolled, and the browser is idle;
 *   animates only while on screen.
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

/** desktop-class device that can run the glass scene comfortably; or any device the home scroll story runs on
 *  (the story already checked cores, memory, motion and Data Saver: lib/story storyMode) */
function mayRun3D() {
  if (story2D()) return false; // the flat story (phones, tablets) uses the video loop
  if (!storyOn() && !window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return false;
  return (navigator.hardwareConcurrency || 4) >= 4;
}

/** If the 3D scene throws (WebGL context refused, lost GPU), drop it and keep the still instead of failing the page. */
class GlassBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
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
    // the WebGL2 test itself waits for the idle moment below (a test context costs main-thread time during start-up)
    let use3D = mayRun3D();
    const videos = Array.from(root.querySelectorAll('video'));
    const visible = () => videos.find(v => getComputedStyle(v).display !== 'none');
    videos.forEach(v => v.addEventListener('playing', () => v.setAttribute('data-on', ''), { once: true }));
    let seen = false; let ready = false; let cancelled = false;
    // the flat phone story shows the loop only from the dark after the colour opening to the dive: it is loaded and
    // played from just before then (a full-screen video playing, invisible, from page load cost ~1.3 s of main thread)
    const storyWants = (q: number) => !story2D() || (q > 0.3 && q < 0.997);
    let wanted = storyWants(getStory());
    const offStory = onStory(q => { const w = storyWants(q); if (w !== wanted) { wanted = w; sync(); } });
    const sync = () => {
      if (use3D) return;
      const v = visible();
      videos.forEach(x => { if (x !== v || !seen || !wanted) x.pause(); });
      if (!v || !seen || !ready || !wanted) return;
      if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
      v.play().catch(() => {});
    };
    // wait for the page to finish loading, then for an idle moment, so neither the 3D nor the video competes with the first paint.
    // The 3D scene (≈0.5 s of main-thread setup) waits for the visitor's first move, scroll or key press as well:
    // on a desktop that is almost immediate, and the page is fully interactive before any of it runs.
    const kinds = ['pointermove', 'scroll', 'wheel', 'keydown', 'pointerdown', 'touchstart'] as const;
    // an interaction made while the page was still starting up was recorded by the boot script (lib/story), so it counts
    let acted = !!(window as Window & { __epoxActed?: boolean }).__epoxActed; let loaded = false;
    // the glass letters are built ahead in idle slices (prepareGlass), so mounting the scene is not one long block
    const go = () => {
      if (cancelled || !loaded || (use3D && !acted)) return;
      whenIdle(() => {
        if (cancelled) return; ready = true;
        if (use3D && !hasWebGL2()) use3D = false;
        if (!use3D) { sync(); return; }
        import('./GlassLogo').then(m => m.prepareGlass()).then(() => { if (!cancelled) setGlass(true); })
          .catch(() => {}); // chunk failed to load (offline, or an old chunk gone after a deploy): keep the still
      });
    };
    const onAct = () => { if (acted) return; acted = true; kinds.forEach(k => window.removeEventListener(k, onAct)); go(); };
    const start = () => { loaded = true; go(); };
    if (use3D) kinds.forEach(k => window.addEventListener(k, onAct, { passive: true }));
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; setOnScreen(seen); sync(); }, { threshold: 0.05 });
    io.observe(root);
    const mq = window.matchMedia('(min-width: 768px)'); mq.addEventListener('change', sync);
    return () => { cancelled = true; offStory(); io.disconnect(); mq.removeEventListener('change', sync); window.removeEventListener('load', start); kinds.forEach(k => window.removeEventListener(k, onAct)); videos.forEach(v => v.pause()); };
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
        <GlassBoundary>
          <div className="liquid-3d" data-on={glassOn || undefined}>
            <GlassLogo active={onScreen} onReady={() => setGlassOn(true)} />
          </div>
        </GlassBoundary>
      )}
    </div>
  );
}
