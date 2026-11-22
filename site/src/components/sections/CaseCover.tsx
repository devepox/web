import { FoilBars } from '@/components/brand/FoilBars';
import { Monogram } from '@/components/brand/Logo';
import type { CaseStudy } from '@/lib/content';

/**
 * Case cover in the brand style, standing in until the real screenshots arrive: a brand-black tile with the card-back
 * foil bars running off the right edge, the foil "e" monogram as a stamp (the case number is already beside or above the cover), and a browser + phone frame rising from the
 * bottom edge (both products run on the web and on phones).
 * The frames are line-drawn (hairlines, no shadows). Their screens show a marked [ASSET: …] until `shots` are given:
 * shots[0] = web screen (16:10), shots[1] = phone screen (9:19.5), paths under /public.
 */
export function CaseCover({ c, ratio = '16 / 10', shots = [], className = '' }:
  { c: CaseStudy; ratio?: string; shots?: string[]; className?: string }) {
  const [web, phone] = shots;
  return (
    <div className={`case-cover ${className}`} style={{ aspectRatio: ratio }} role="img"
      aria-label={web || phone ? `Screens from case ${c.n}: ${c.headline}` : `Case ${c.n} cover. Placeholder until the ${c.sector} app screenshots arrive`}>
      <FoilBars variant="short" className="case-cover-bars" />
      <Monogram foil className="case-cover-mono" />
      <div className="case-cover-devices" aria-hidden>
        <div className="device device-browser">
          <span className="device-bar"><i /><i /><i /></span>
          <span className="device-screen">
            {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot inside a drawn frame */}
            {web ? <img src={web} alt="" loading="lazy" decoding="async" /> : <span className="device-ph">[ASSET: case {c.n} · web screen]</span>}
          </span>
        </div>
        <div className="device device-phone">
          <span className="device-screen">
            <span className="device-notch" />
            {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot inside a drawn frame */}
            {phone ? <img src={phone} alt="" loading="lazy" decoding="async" /> : <span className="device-ph">[ASSET: case {c.n} · app screen]</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
