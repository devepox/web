import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import { SectionHeader } from '@/components/ui/primitives';
import { EngagementModels } from '@/components/sections/blocks';
import { ServiceChapters } from '@/components/sections/ServiceChapters';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { RiseText } from '@/components/motion/RiseText';
import { alsoServices, services } from '@/lib/content';
import { FoilBars } from '@/components/brand/FoilBars';

const DESCRIPTION = 'Seven areas epox builds in: web & SaaS, mobile apps, business software, AI, UI/UX & branding, cloud & DevOps, and launch, growth & support.';
export const metadata: Metadata = {
  title: 'Services',
  description: DESCRIPTION,
  ...share('services', 'Services · epox', DESCRIPTION, '/services'),
};

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** /services (design brief §6): hero → 7 story chapters (sticky rail) → ways to work → contact. */
export default function ServicesPage() {
  return (
    <>
      <section className="hero" aria-labelledby="services-hero">
        <FoilBars className="hero-bars hero-bars--page" />
        <div className="container-x pt-[calc(72px+var(--space-10))] pb-[var(--space-9)]">
          <p className="t-label muted hero-after" style={d(0)}>Services</p>
          <RiseText as="h1" on="load" id="services-hero" className="t-h1 mt-8" style={{ maxWidth: '14ch' }}
            parts={['Seven areas, one team that', { t: 'stays', hl: true }, 'after launch.']} />
          <p className="t-lead muted mt-10 hero-after" style={{ maxWidth: '46ch', ...d(600) }}>
            Whatever you need built probably fits in one of these. If it doesn&apos;t, ask: we also build {alsoServices.map(a => a.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' and $1')}.
          </p>
        </div>
      </section>

      <section className="py-[var(--section-y)]" aria-label="Service areas">
        <div className="container-x"><ServiceChapters items={services} /></div>
      </section>

      <section className="section soft" aria-labelledby="models-title">
        <div className="container-x">
          <SectionHeader id="models-title" label="Ways to work" title="Three ways to work with us" />
          <EngagementModels />
          <p className="mt-8 t-small muted">No price list: we agree the model and the number on a short call.</p>
        </div>
      </section>

      <ContactBlock />
    </>
  );
}
