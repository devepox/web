import { LOCKUP_VIEWBOX, MONOGRAM_PATH, MONOGRAM_VIEWBOX, TAGLINE_PATH, WORDMARK_PATH, WORDMARK_VIEWBOX } from './wordmark-path';

/**
 * epox wordmark (Ice Mint): Space Grotesk Bold, outlined from the brand files. Always lower case.
 * · foil: the holographic foil fill. Brand rule: foil only on Black grounds; on Paper use the plain (currentColor) mark.
 * · lockup: adds the "SOFTWARE HOUSE" line under the wordmark (line grey #D8DDE5 when foil).
 * Foil gradient + grain come from <BrandDefs /> (app/layout.tsx).
 */
export function Logo({ className = '', title = 'epox', foil = false, lockup = false }:
  { className?: string; title?: string; foil?: boolean; lockup?: boolean }) {
  return (
    <svg viewBox={lockup ? LOCKUP_VIEWBOX : WORDMARK_VIEWBOX} className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path d={WORDMARK_PATH} fill={foil ? 'url(#ep-foil)' : 'currentColor'} />
      {foil && <path d={WORDMARK_PATH} fill="url(#ep-grain-word)" />}
      {lockup && <path d={TAGLINE_PATH} fill={foil ? '#D8DDE5' : 'currentColor'} />}
    </svg>
  );
}

/**
 * The lower-case "e" monogram on its own (brand: app icon, favicon, avatar, watermark, stamp).
 * foil on Black only; otherwise currentColor. Decorative by default (aria-hidden) since it sits next to the name.
 */
export function Monogram({ className = '', foil = false }: { className?: string; foil?: boolean }) {
  return (
    <svg viewBox={MONOGRAM_VIEWBOX} className={className} aria-hidden focusable="false">
      <path d={MONOGRAM_PATH} fill={foil ? 'url(#ep-foil)' : 'currentColor'} />
      {foil && <path d={MONOGRAM_PATH} fill="url(#ep-grain-word)" />}
    </svg>
  );
}
