'use client';
import { useEffect, useRef, useState } from 'react';
import { loadGsap, prefersReducedMotion } from '@/lib/motion';

/* ------------------------------------------------ Count-up number (L7), tabular, once */
export function CountUp({ to, raw = false, duration = 1200 }: { to: number; raw?: boolean; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current; if (!el || prefersReducedMotion()) return;
    const from = raw ? Math.max(0, to - 12) : 0;
    setV(from); // hidden by CSS (.count-up) until the count starts, so the final number never flashes first
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)); // ease-out-expo
      const tick = (t: number) => { el.dataset.ready = ''; const p = Math.min(1, (t - t0) / duration); setV(Math.round(from + (to - from) * ease(p))); if (p < 1) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el); return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, raw, duration]);
  return <span ref={ref} className="t-num count-up">{v}</span>;
}

export function StatsScoreboard({ stats }: { stats: { value: number; label: string; raw?: boolean }[] }) {
  return (
    <dl className={`grid grid-cols-2 gap-x-[var(--gutter)] gap-y-12 ${stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {stats.map(s => (
        <div key={s.label} className="flex flex-col-reverse justify-end border-t border-line pt-6">
          <dt className="t-label muted mt-5">{s.label}</dt>
          <dd className="t-num" style={{ font: '500 clamp(3.5rem, 2.4rem + 4.5vw, 8rem)/0.95 var(--font-display)', letterSpacing: 'var(--tr-h1)' }}>
            <CountUp to={s.value} raw={s.raw} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------ Roll-call (H8): names light up at screen centre */
export function RollCall({ items }: { items: { name: string; meta: string; line: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const list = ref.current; if (!list) return;
    const els = Array.from(list.querySelectorAll<HTMLElement>('[data-roll]'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.roll)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    els.forEach(e => io.observe(e)); return () => io.disconnect();
  }, []);
  return (
    <ol ref={ref} className="grid gap-6 md:gap-10">
      {items.map((it, i) => {
        return (
          <li key={it.name + i} data-roll={i} className="roll-item grid items-end gap-x-[var(--gutter)] gap-y-3 md:grid-cols-12" data-active={active === i}>
            <span className="roll-meta t-label md:col-span-2 md:pb-4" style={{ color: 'var(--muted)' }}>• {it.meta}</span>
            <span className="t-rollcall md:col-span-6">{it.name}</span>
            <span className="roll-meta md:col-span-4 md:pb-4" style={{ color: 'var(--muted)' }}>{it.line}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------ Statement reveal (H6): words go muted → ink, scrubbed (GSAP) */
export function StatementReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || prefersReducedMotion()) return;
    let kill = () => {};
    let cancelled = false;
    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return; // unmounted before GSAP finished loading
      const words = Array.from(el.querySelectorAll<HTMLElement>('.w'));
      const st = ScrollTrigger.create({
        trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true,
        onUpdate: (self) => { const n = Math.round(self.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); },
      });
      kill = () => st.kill();
    });
    return () => { cancelled = true; kill(); };
  }, []);
  const words = text.split(' ');
  return (
    <p ref={ref} className="statement t-h2" style={{ maxWidth: '24ch' }}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => <span key={i} aria-hidden className="w">{w}{i < words.length - 1 ? ' ' : ''}</span>)}
    </p>
  );
}
