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

/** Smooth scroll for mouse / trackpad. Touch keeps native scroll, except inside the home scroll story (storyGovernor). */
export const canSmoothScroll = () =>
  typeof window !== 'undefined' && !prefersReducedMotion() && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const isTouchDevice = () => typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

/*
 * Speed limit for the home scroll story (owner, 2026-11-23: "if scrolled quickly it moves fast… make the scroll speed
 * fixed so all the scrolling animation can be seen"). While the story is pinned, every scroll step goes through here:
 * · wheel / trackpad: the scroll target may run at most WHEEL_LEAD px ahead of where the page is, so with lerp 0.1 the
 *   page moves at most ~0.1 × 130 px a frame (~780 px/s): a hard spin takes ~2.5 s through the desktop story;
 * · touch: Lenis takes over the gesture (syncTouch) only inside the story, each move is capped at TOUCH_STEP px and a
 *   flick coasts only a little (inertia = velocity^1.25, not ^1.7): ~290 px per fast swipe, ~5 swipes through the story. Outside the story, touch stays native.
 */
const WHEEL_LEAD = 130, TOUCH_STEP = 28, TOUCH_INERTIA = 1.25, EDGE = 24;
function inStory(y: number) {
  if (document.documentElement.dataset.story !== 'on') return false;
  const el = document.querySelector<HTMLElement>('.story'); if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY;
  return y >= top - EDGE && y <= top + el.offsetHeight - window.innerHeight + EDGE;
}
function storyGovernor(data: { deltaX: number; deltaY: number; event: WheelEvent | TouchEvent }) {
  const l = lenis; if (!l) return true;
  const touch = data.event.type.includes('touch');
  const y = touch && data.event.type === 'touchstart' ? l.animatedScroll : l.targetScroll;
  const on = inStory(y) || inStory(l.animatedScroll);
  if (touch) {
    // decide per gesture: a gesture that starts in the story is ours to the end, one that starts outside is native
    if (data.event.type === 'touchstart') { l.options.syncTouch = on; l.options.touchInertiaExponent = on ? TOUCH_INERTIA : 1.7; }
    if (l.options.syncTouch) data.deltaY = Math.max(-TOUCH_STEP, Math.min(TOUCH_STEP, data.deltaY));
    return true;
  }
  if (on) {
    const lead = l.targetScroll - l.animatedScroll;
    data.deltaY = Math.max(-WHEEL_LEAD - lead, Math.min(WHEEL_LEAD - lead, data.deltaY));
  }
  return true;
}

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
  // touch devices get Lenis only for the story's speed limit (syncTouch stays off outside it: native scroll)
  if (lenis || prefersReducedMotion() || !(canSmoothScroll() || (isTouchDevice() && document.documentElement.dataset.story === 'on'))) return lenis;
  // one startup promise, so overlapping calls (dev StrictMode) share one instance and one rAF loop
  lenisPromise ??= import('lenis').then(({ default: LenisCtor }) => {
    const l = new LenisCtor({ lerp: 0.1, smoothWheel: true, anchors: true, syncTouch: false, syncTouchLerp: 0.08, virtualScroll: storyGovernor });
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
export const cancelIdle = (id: number) => {
  const w = window as Window & { cancelIdleCallback?: (id: number) => void };
  if (w.cancelIdleCallback) w.cancelIdleCallback(id); else window.clearTimeout(id);
};
