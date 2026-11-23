'use client';
import { useEffect, useRef } from 'react';
import { onLight } from '@/lib/light';
import { createGlassScene } from './glass-scene';
import { WORDMARK_PATH } from './wordmark-path';

/**
 * Hero logo, live 3D (owner chose "C · holographic glass" from four rendered options, 2026-11-21).
 * The scene itself is plain three.js in ./glass-scene.js (shared with the fallback loop renderer, scripts/logo-3d/loop.js);
 * this component only mounts it, feeds it the site's one light (lib/light: the cursor) and the hero's scroll, and runs it
 * while it is on screen. Loaded only on capable desktops after the page is idle (see LiquidLogo).
 */
export default function GlassLogo({ onReady, active }: { onReady: () => void; active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof createGlassScene> | null>(null);
  const ready = useRef(onReady);
  useEffect(() => { ready.current = onReady; }, [onReady]);

  useEffect(() => {
    const el = canvas.current; if (!el) return;
    const s = createGlassScene(el, { path: WORDMARK_PATH, quality: 'live', dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
    scene.current = s;
    const box = el.parentElement ?? el;
    const fit = () => { const r = box.getBoundingClientRect(); s.resize(r.width, r.height); };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(box);
    const off = onLight(l => s.setLight(l.x, l.y));
    // tilt back a little as the hero scrolls away
    const hero = el.closest('section') ?? box;
    const onScroll = () => { const r = hero.getBoundingClientRect(); s.setScroll(-r.top / Math.max(1, r.height)); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    s.onFirstFrame(() => ready.current());
    return () => { ro.disconnect(); off(); window.removeEventListener('scroll', onScroll); s.dispose(); scene.current = null; };
  }, []);

  useEffect(() => { scene.current?.setActive(active); }, [active]);

  return <canvas ref={canvas} className="glass-logo" aria-hidden />;
}
