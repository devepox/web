import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import { Label, Val } from '@/components/ui/primitives';
import { ContactForm } from '@/components/sections/ContactForm';
import { nextSteps } from '@/components/sections/ContactBlock';
import { TrustStrip } from '@/components/sections/blocks';
import { RiseText } from '@/components/motion/RiseText';
import { company } from '@/lib/content';
import { FoilBars } from '@/components/brand/FoilBars';

const DESCRIPTION = 'Tell epox the problem and we will tell you how we would fix it. A person reads every message and replies within one working day.';
export const metadata: Metadata = {
  title: 'Contact',
  description: DESCRIPTION,
  ...share('contact', 'Contact · epox', DESCRIPTION, '/contact'),
};

const isPh = (v: string) => v.startsWith('[PLACEHOLDER');
const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** /contact (design brief §6): hero → form (main feature) + what happens next + direct contacts → trust strip. */
export default function ContactPage() {
  return (
    <section aria-labelledby="contact-hero" className="hero pb-[var(--section-y)]">
      <FoilBars className="hero-bars hero-bars--page" />
      <div className="container-x pt-[calc(72px+var(--space-10))]">
        <p className="t-label muted hero-after" style={d(0)}>Contact</p>
        <RiseText as="h1" on="load" id="contact-hero" className="t-h1 mt-8" style={{ maxWidth: '15ch' }}
          parts={["Tell us the problem. We'll tell you how we'd", { t: 'fix it.', hl: true }]} />

        <div className="mt-[var(--space-9)] grid gap-16 lg:grid-cols-12 lg:gap-[var(--gutter)]">
          {/* form: the main feature */}
          <div className="paper order-1 rounded-[var(--r-card)] p-6 sm:p-10 lg:order-2 lg:col-span-7 lg:col-start-6 hero-after" style={d(700)}>
            <ContactForm />
          </div>

          {/* what happens next + direct contacts */}
          <div className="order-2 lg:order-1 lg:col-span-4">
            <Label as="p">What happens next</Label>
            <ol className="mt-6 grid gap-6">
              {nextSteps.map(s => (
                <li key={s.n} className="grid grid-cols-[3rem_1fr] border-t border-line pt-5">
                  <span className="t-label muted">{s.n}</span>
                  <span><span className="block font-medium">{s.t}</span><span className="mt-1 block t-small muted">{s.d}</span></span>
                </li>
              ))}
            </ol>

            <dl className="mt-12 grid gap-5">
              <div><dt className="t-label muted">Call or WhatsApp</dt>
                <dd className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1"><a className="link t-num" href={company.phoneHref}>{company.phone}</a><a className="link" href={company.whatsappHref}>Message on WhatsApp</a></dd></div>
              <div><dt className="t-label muted">Email</dt><dd className="mt-1.5">{isPh(company.email) ? <Val v={company.email} /> : <a className="link" href={`mailto:${company.email}`}>{company.email}</a>}</dd></div>
              <div><dt className="t-label muted">Book a call</dt>
                <dd className="mt-1.5">{company.bookingUrl ? <a className="link" href={company.bookingUrl}>Book 20 minutes</a> : <Val v="[PLACEHOLDER: booking link]" />}</dd></div>
              <div><dt className="t-label muted">Where</dt>
                <dd className="mt-1.5"><a className="link" href={company.mapsUrl} target="_blank" rel="noopener noreferrer">{company.street}, {company.city}</a><span className="muted"> · {company.country} · {company.timezone}</span></dd></div>
            </dl>
          </div>
        </div>

        <div className="mt-[var(--space-10)]"><TrustStrip /></div>
      </div>
    </section>
  );
}
