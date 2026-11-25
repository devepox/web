'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToTop } from '@/lib/motion';

// Runs on every navigation (keyed on the pathname: the root template only re-mounts when the top-level segment
// changes, so /work → /work/<case> or one service → another would otherwise never wire up the new page):
//  · page enter transition (H2), skipped on the very first load so the hero (LCP) paints immediately;
//  · scroll reset (unless the URL has a #section);
//  · reveal observer: L4 section entrance [data-reveal], H13 title rise [data-rise], H15 media unveil [data-unveil]. It lives here because this effect runs only after the page inside has hydrated,
//    so setting data-in never races React's hydration.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => !firstLoad);
  const pathname = usePathname();

  useEffect(() => {
    firstLoad = false;
    if (!window.location.hash) scrollToTop();
    if (document.documentElement.dataset.motion === 'reduced') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('main [data-reveal], main [data-rise], main [data-unveil]'));
    const css = getComputedStyle(document.documentElement);
    const dur = parseFloat(css.getPropertyValue('--dur-enter')) || 800;
    const stagger = parseFloat(css.getPropertyValue('--stagger')) || 60;
    const rise = css.getPropertyValue('--rise').trim() || '16px';
    const ease = css.getPropertyValue('--ease-out-quint').trim() || 'ease-out';
    // Reveal with the Web Animations API: no attribute/class changes, so it can't clash with hydration.
    const reveal = (el: HTMLElement) => {
      if (el.hasAttribute('data-rise')) {
        // words rise out of their masks, one after another
        el.querySelectorAll<HTMLElement>('.rw > span').forEach((w, i) =>
          w.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: dur * 1.25, delay: 80 + i * stagger, easing: ease, fill: 'forwards' }));
        return;
      }
      if (el.hasAttribute('data-unveil')) {
        // the reveal edge is slanted at the foil E's angle and travels left to right
        el.animate([{ clipPath: 'polygon(0 0, 0% 0, -17% 100%, 0 100%)' }, { clipPath: 'polygon(0 0, 117% 0, 100% 100%, 0 100%)' }], { duration: dur * 1.5, delay: 120, easing: ease, fill: 'forwards' });
        (el.firstElementChild as HTMLElement | null)?.animate([{ scale: '1.18' }, { scale: '1' }], { duration: dur * 1.8, delay: 120, easing: ease });
        return;
      }
      const i = Number(el.style.getPropertyValue('--i')) || 0;
      el.animate([{ opacity: 0, transform: `translateY(${rise})` }, { opacity: 1, transform: 'none' }],
        { duration: dur, delay: i * stagger, easing: ease, fill: 'forwards' });
    };
    if (!('IntersectionObserver' in window)) { els.forEach(reveal); return; }
    // Chrome's IntersectionObserver honours the target's own clip-path, so a fully clipped [data-unveil] element is never
    // "visible": observe its (unclipped) parent instead and reveal the element itself.
    // one watched element can stand for several (a [data-reveal] card and its own [data-unveil] child): keep them all
    const targetsOf = new Map<Element, HTMLElement[]>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { (targetsOf.get(e.target) ?? [e.target as HTMLElement]).forEach(reveal); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach(e => {
      const watch = e.hasAttribute('data-unveil') && e.parentElement ? e.parentElement : e;
      const list = targetsOf.get(watch);
      if (list) list.push(e); else { targetsOf.set(watch, [e]); io.observe(watch); }
    });
    return () => io.disconnect();
  }, [pathname]);

  return <div className={animate ? 'page-enter' : undefined}>{children}</div>;
}
