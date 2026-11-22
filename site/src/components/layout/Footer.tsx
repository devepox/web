import Link from 'next/link';
import { FoilBars } from '@/components/brand/FoilBars';
import { Logo } from '@/components/brand/Logo';
import { Val } from '@/components/ui/primitives';
import { company, services } from '@/lib/content';

/** Footer: brand-black ground. Opens with a sign-off band (foil lockup + the bars locking back into the E), then links. */
export function Footer() {
  const year = 2026;
  return (
    <footer className="dark relative overflow-hidden" data-theme="dark">
      <FoilBars mode="assemble" className="footer-bars" />
      <div className="container-x relative z-[1] border-t border-line pt-[var(--space-9)]">
        <div className="flex min-h-[clamp(150px,24vw,360px)] items-end">
          <Link href="/" aria-label="epox home" className="block"><Logo lockup foil className="h-[64px] w-auto md:h-[104px]" /></Link>
        </div>
      </div>
      <div className="container-x relative z-[1] pt-[var(--space-9)] pb-8">
        <div className="grid gap-12 md:grid-cols-12">
          <nav aria-label="Services" className="md:col-span-5">
            <p className="t-label muted">Services</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {services.map(s => <li key={s.slug}><Link className="link-quiet" href={`/services/${s.slug}`}>{s.title}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Company" className="md:col-span-3">
            <p className="t-label muted">Company</p>
            <ul className="mt-5 grid gap-2">
              {[['/work', 'Work'], ['/how-we-work', 'How we work'], ['/about', 'About'], ['/contact', 'Contact']].map(([h, t]) =>
                <li key={h}><Link className="link-quiet" href={h}>{t}</Link></li>)}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="t-label muted">Contact</p>
            <ul className="mt-5 grid gap-2">
              <li>{company.email.startsWith('[PLACEHOLDER') ? <Val v={company.email} /> : <a className="link-quiet" href={`mailto:${company.email}`}>{company.email}</a>}</li>
              <li><a className="link-quiet t-num" href={company.phoneHref}>{company.phone}</a> <span className="muted">· </span><a className="link-quiet" href={company.whatsappHref}>WhatsApp</a></li>
              <li className="muted">{company.street},<br />{company.city}, {company.country} · {company.timezone}</li>
            </ul>
          </div>
        </div>

        <div className="mt-[var(--space-9)] flex border-t border-line pt-8">
          {/* the name is never set in capitals, so the copyright line is plain small text, not a label */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 t-small muted">
            <Link href="/privacy" className="link-quiet">Privacy</Link>
            <span>© {year} epox</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
