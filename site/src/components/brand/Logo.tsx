import { LOCKUP_VIEWBOX, TAGLINE_PATH, WORDMARK_PATH, WORDMARK_VIEWBOX } from './wordmark-path';

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
