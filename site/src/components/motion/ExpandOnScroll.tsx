'use client';
import { useEffect, useRef } from 'react';
import { loadGsap, prefersReducedMotion } from '@/lib/motion';

/**
 * H14 media expand: large media starts inset with bigger corners and opens to full width as it scrolls
 * to the centre of the screen (GSAP ScrollTrigger scrub, clip-path only: no layout shift).
 * Desktop/tablet (≥768px) only; mobile and reduced motion show it full width.
 */
export function ExpandOnScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(min-width: 768px)').matches) return;
    let kill = () => {};
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return; // unmounted before GSAP finished loading
      const tw = gsap.fromTo(el,
        { clipPath: 'inset(0% 9% 0% 9% round 40px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 16px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } });
      kill = () => { tw.scrollTrigger?.kill(); tw.kill(); el.style.clipPath = ''; };
    });
    return () => { cancelled = true; kill(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
