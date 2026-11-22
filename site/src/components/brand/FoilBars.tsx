'use client';
import { useEffect, useId, useRef } from 'react';
import { onLight } from '@/lib/light';

/**
 * The brand device (Ice Mint, assets/Brand device/epox-foil-bars.svg): three foil bars with slanted left ends that run
 * off an edge. Black grounds only. Decorative (aria-hidden).
 *
 *  · Light: the ice-blue → mint colours slide across the bars and a soft sheen follows the site's one light source
 *    (lib/light: cursor, phone tilt, or scroll), the same light every other foil surface follows.
 *  · Depth (mode "split", heroes): the E is three layers; as the hero scrolls away they slide apart at different speeds.
 *  · Assemble (mode "assemble", footer): the layers arrive apart and snap back into the E as the footer comes into view,
 *    so the page opens and closes on the whole mark.
 *  · Enter (mode "enter", form sent): the layers fly in from the right and lock into the E once, on mount.
 *  · Scatter (mode "scatter", 404): the layers lie scattered; the closer the light (cursor) gets, the more they pull
 *    back together into the E.
 * Runs only while on screen and moving. Reduced motion: static and whole.
 * Bars' right ends are extended past the viewBox (x 336 → 1336) so they run to the screen edge on any width; the section clips them.
 *
 * Two forms (brand book, Business card): variant "e" = the full E from the card front (home hero, footer, 404, form sent);
 * variant "short" = the three short bars from the card back (inner-page heroes, case covers), so the full mark keeps
 * its weight by appearing only where the page opens and closes.
 */

// three slices of the E (bar + its part of the slanted spine), cut in the middle of each gap, overlapping 0.3 units
const SLICES = [
  '169.2,39 1336,39 1336,59.8 189.5,59.8 185.76,73.1 159.89,73.1',
  '159.98,72.8 185.85,72.8 182.2,85.8 1336,85.8 1336,106.6 177,106.6 173.27,119.9 147.14,119.9',
  '147.22,119.6 173.35,119.6 169.7,132.6 1336,132.6 1336,153.4 138,153.4',
];
const DEPTH = [10, 24, 40]; // user units each layer travels right (top layer least)
// card back: three short bars (9 units tall, 18 apart), the middle one set in; same slant as the E (2.5 over 9)
const SHORT_SLICES = [
  '234.5,22 1336,22 1336,31 232,31',
  '252.5,40 1336,40 1336,49 250,49',
  '234.5,58 1336,58 1336,67 232,67',
];
type Geo = { slices: string[]; vb: [number, number, number, number]; grad: [number, number, number, number]; k: number };
const GEO: Record<'e' | 'short', Geo> = {
  e: { slices: SLICES, vb: [138, 39, 198, 114.4], grad: [138, 9.3, 336, 193], k: 1 },
  // k scales every travel distance (light, depth) to the smaller drawing
  short: { slices: SHORT_SLICES, vb: [232, 22, 104, 45], grad: [228, -1.55, 345, 97.4], k: 104 / 198 },
};
// 404 scatter: offset (user units) and tilt (deg) of each layer when fully scattered; pivot near its visible left end
const SCATTER = [{ x: -26, y: -16, r: -7, cy: 56 }, { x: 22, y: 8, r: 5, cy: 96 }, { x: -12, y: 24, r: -4, cy: 136 }];
type Mode = 'split' | 'assemble' | 'enter' | 'scatter';
export const FOIL_STOPS: [string, string][] = [['0', '#BFE3FF'], ['0.2', '#E2FFF4'], ['0.4', '#8FC9FF'], ['0.58', '#7FF5D0'], ['0.78', '#E4FBFF'], ['1', '#A8F0E0']];

export function FoilBars({ className = '', mode = 'split', variant = 'e' }: { className?: string; mode?: Mode; variant?: 'e' | 'short' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const geo = GEO[variant];
  const [vx, vy, vw, vh] = geo.vb;
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current; if (!el) return;
    if (document.documentElement.dataset.motion === 'reduced') return;
    const foil = el.querySelector<SVGLinearGradientElement>(`#f${id}`);
    const sheen = el.querySelector<SVGRadialGradientElement>(`#s${id}`);
    if (!foil || !sheen) return;
    const layers = Array.from(el.querySelectorAll<SVGGElement>('[data-layer]'));
    const host = el.closest('section, footer') ?? el.parentElement!;
    const spread = mode === 'assemble' || mode === 'enter' ? 3 : 1;
    const light = { x: 0.5, y: 0.35 };
    const p = { t: 0, c: 0 }; // separation: target / current (0 = whole E)
    let raf = 0; let visible = true;

    const progress = () => {
      const r = host.getBoundingClientRect(); const vh = window.innerHeight;
      if (mode === 'enter') return 0;
      if (mode === 'scatter') {
        // distance from the light (cursor) to the visible part of the bars, in viewport widths
        const b = el.getBoundingClientRect(); const cx = b.left + b.width * 0.45; const cy = b.top + b.height / 2;
        const d = Math.hypot(light.x * window.innerWidth - cx, light.y * vh - cy) / window.innerWidth;
        return Math.min(1, Math.max(0, (d - 0.06) / 0.4));
      }
      if (mode === 'split') return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      // assemble: apart while the footer is entering, whole once its top is in the upper part of the screen
      return Math.min(1, Math.max(0, (r.top - vh * 0.35) / (vh * 0.6)));
    };
    const draw = () => {
      raf = 0;
      p.c += (p.t - p.c) * (mode === 'enter' ? 0.075 : 0.16);
      const sc = geo.k;
      foil.setAttribute('gradientTransform', `translate(${(((light.x - 0.5) * 160 + p.c * 120) * sc).toFixed(2)} ${((light.y - 0.5) * 50 * sc).toFixed(2)})`);
      const r = el.getBoundingClientRect(); const k = vw / Math.max(1, r.width);
      const sx = vx + (light.x * window.innerWidth - r.left) * k; const sy = vy + (light.y * window.innerHeight - r.top) * k;
      sheen.setAttribute('cx', Math.max(vx - 28 * sc, Math.min(vx + vw + 44 * sc, sx)).toFixed(1)); sheen.setAttribute('cy', Math.max(vy - 19 * sc, Math.min(vy + vh + 22 * sc, sy)).toFixed(1));
      layers.forEach((g, i) => {
        if (mode === 'scatter') {
          const s = SCATTER[i]; const k = p.c;
          g.setAttribute('transform', `translate(${(s.x * k).toFixed(2)} ${(s.y * k).toFixed(2)}) rotate(${(s.r * k).toFixed(2)} 190 ${s.cy})`);
        } else g.setAttribute('transform', `translate(${(p.c * DEPTH[i] * spread * geo.k).toFixed(2)} 0)`);
      });
      if (Math.abs(p.t - p.c) > 0.0008 && visible) raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(draw); };
    const onScroll = () => { p.t = progress(); kick(); };
    const off = onLight(l => { light.x = l.x; light.y = l.y; if (mode === 'scatter') p.t = progress(); kick(); });
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); });
    io.observe(el);
    p.t = progress(); p.c = mode === 'enter' || mode === 'scatter' ? 1 : p.t; kick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); off(); window.removeEventListener('scroll', onScroll); };
  }, [id, mode, geo, vx, vy, vw, vh]);

  return (
    <svg ref={svg} viewBox={geo.vb.join(' ')} className={`foil-bars foil-bars--${variant} ${className}`} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`f${id}`} gradientUnits="userSpaceOnUse" x1={geo.grad[0]} y1={geo.grad[1]} x2={geo.grad[2]} y2={geo.grad[3]} spreadMethod="reflect">
          {FOIL_STOPS.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </linearGradient>
        <radialGradient id={`s${id}`} gradientUnits="userSpaceOnUse" cx={vx + vw * 0.52} cy={vy + vh * 0.18} r={78 * geo.k}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {geo.slices.map((pts, i) => (
        <g key={i} data-layer={i}>
          <polygon points={pts} fill={`url(#f${id})`} />
          <polygon points={pts} fill={`url(#s${id})`} />
          <polygon points={pts} fill="url(#ep-grain-bars)" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Shared SVG definitions for the foil (6 Ice Mint stops) and its fine diagonal grain, rendered once in the layout.
 * The logo and icon gradients follow the shared light too, so the header wordmark and service icons shimmer with the bars.
 * Kept out of display:none so every <Logo foil>, <FoilBars> and service icon can reference them.
 */
export function BrandDefs() {
  const word = useRef<SVGLinearGradientElement>(null);
  const icon = useRef<SVGLinearGradientElement>(null);
  useEffect(() => onLight(l => {
    word.current?.setAttribute('gradientTransform', `translate(${((l.x - 0.5) * 0.9).toFixed(3)} ${((l.y - 0.5) * 0.5).toFixed(3)})`);
    icon.current?.setAttribute('gradientTransform', `translate(${((l.x - 0.5) * 22).toFixed(2)} ${((l.y - 0.5) * 12).toFixed(2)})`);
  }), []);
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <linearGradient ref={word} id="ep-foil" x1="0" y1="0" x2="1" y2="1" spreadMethod="reflect">
          {FOIL_STOPS.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </linearGradient>
        {/* service icons: 24×24 line icons stroked with the foil (user space, so straight lines still get the gradient) */}
        <linearGradient ref={icon} id="ep-foil-icon" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22" spreadMethod="reflect">
          {FOIL_STOPS.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </linearGradient>
        <pattern id="ep-grain-word" patternUnits="userSpaceOnUse" width="9.19" height="9.19" patternTransform="rotate(-35)">
          <rect width="2.48" height="9.19" fill="#FFFFFF" fillOpacity="0.22" />
        </pattern>
        <pattern id="ep-grain-bars" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(-35)">
          <rect width="0.81" height="3" fill="#FFFFFF" fillOpacity="0.22" />
        </pattern>
      </defs>
    </svg>
  );
}
