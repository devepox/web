'use client';
// Lazy motion stack: GSAP + ScrollTrigger + Lenis are loaded only when needed, after first paint.
import type Lenis from 'lenis';

type GsapBundle = { gsap: typeof import('gsap').gsap; ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger };
let gsapPromise: Promise<GsapBundle> | null = null;
let lenis: Lenis | null = null;
let lenisPromise: Promise<Lenis> | null = null;
let linked = false;

/** Feeds Lenis scroll events to ScrollTrigger, once, whichever of the two finishes loading last. */
const linkScrollTrigger = (st: GsapBundle['ScrollTrigger']) => {
  if (linked || !lenis) return;
  linked = true;
  lenis.on('scroll', st.update);
};

export const prefersReducedMotion = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.motion === 'reduced';

/** Smooth scroll is for fine pointers (mouse/trackpad) only; touch keeps native scroll. */
export const canSmoothScroll = () =>
  typeof window !== 'undefined' && !prefersReducedMotion() && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function loadGsap(): Promise<GsapBundle> {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      linkScrollTrigger(st.ScrollTrigger);
      return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
    });
  }
  return gsapPromise;
}

export async function startLenis() {
  if (lenis || !canSmoothScroll()) return lenis;
  // one startup promise, so overlapping calls (dev StrictMode) share one instance and one rAF loop
  lenisPromise ??= import('lenis').then(({ default: LenisCtor }) => {
    const l = new LenisCtor({ lerp: 0.1, smoothWheel: true, anchors: true });
    lenis = l;
    const raf = (t: number) => { l.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    if (gsapPromise) gsapPromise.then(({ ScrollTrigger }) => linkScrollTrigger(ScrollTrigger));
    return l;
  });
  return lenisPromise;
}

export const getLenis = () => lenis;

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0);
}

export const whenIdle = (fn: () => void): number => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  return w.requestIdleCallback ? w.requestIdleCallback(fn, { timeout: 1500 }) : w.setTimeout(fn, 200);
};
