import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import { ArrowLink, Button, Label, Live, SectionHeader } from '@/components/ui/primitives';
import { CaseCard, EngagementModels, ServiceRows } from '@/components/sections/blocks';
import { RollCall, StatementReveal } from '@/components/sections/interactive';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { RiseText } from '@/components/motion/RiseText';
import { ExpandOnScroll } from '@/components/motion/ExpandOnScroll';
import { FoilBars } from '@/components/brand/FoilBars';
import { LiquidLogo } from '@/components/brand/LiquidLogo';
import { alsoServices, cases, company, industries, services } from '@/lib/content';

const DESCRIPTION = 'epox is a software house in Faisalabad building web, mobile and AI products since 2019. We find what is holding your product back, fix it, and stay to keep it running.';
export const metadata: Metadata = {
  title: { absolute: 'epox: we find the problem before you do' },
  description: DESCRIPTION,
  ...share('home', 'epox: we find the problem before you do', DESCRIPTION, '/'),
};

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Home (design brief §6): hero → proof → services → work → process → built for → numbers → models → statement → contact. */
export default function Home() {
  return (
    <>
      {/* 1 · Hero (H3 intro, H14 media expand, L10 CTAs) */}
      {/* Black hero band with the brand device: foil bars running off the right edge. Saffron = this layout's one main action, azure = its one highlight. */}
      <section className="hero" aria-labelledby="hero-title">
        <FoilBars className="hero-bars hero-bars--home" />
        <div className="container-x pt-[calc(72px+var(--space-10))] pb-[var(--space-9)]">
          <p className="t-label muted hero-after" style={d(0)}>Software house · {company.city}</p>
          <RiseText as="h1" on="load" id="hero-title" className="t-display mt-8" style={{ maxWidth: '12.5ch' }}
            parts={['We find the problem', { t: 'before', hl: true }, 'you do.']} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <p className="t-lead muted hero-after lg:col-span-6" style={{ maxWidth: '44ch', ...d(650) }}>
              We build web, mobile and AI software, then stay to keep it running. If we reached out to you, we&apos;ve already found something worth fixing.
            </p>
            <div className="flex flex-wrap gap-3 hero-after lg:col-span-6 lg:justify-end" style={d(800)}>
              <Button href="/contact" size="lg" variant="accent" arrow>Let&apos;s talk</Button>
              <Button href="/work" size="lg" variant="secondary">See our work</Button>
            </div>
          </div>
          <ExpandOnScroll className="mt-[var(--space-9)]">
            <LiquidLogo variant="hero" />
          </ExpandOnScroll>

          {/* 2 · Proof strip */}
          <ul className="mt-[var(--space-8)] grid gap-6 border-t border-line pt-6 sm:grid-cols-3" aria-label="epox in short">
            <li data-reveal style={{ '--i': 0 } as CSSProperties}><Label as="p">Since</Label><p className="mt-2 t-h3 t-num">{company.founded}</p></li>
            <li data-reveal style={{ '--i': 1 } as CSSProperties}><Label as="p"><Live>Live, run by us</Live></Label><p className="mt-2 t-h3">2 products</p></li>
            <li data-reveal style={{ '--i': 2 } as CSSProperties}><Label as="p">We build</Label><p className="mt-2 t-h3">Web · Mobile · AI</p></li>
          </ul>
        </div>
      </section>

      {/* 3 · Services (H7 stacking rows) */}
      <section className="section" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeader id="services-title" label="Services" title="Seven ways we can help" action={<ArrowLink href="/services">All services</ArrowLink>} />
          <ServiceRows items={services} stacking />
          <p className="mt-8 t-small muted">Also: {alsoServices.join(' · ')}</p>
        </div>
      </section>

      {/* 4 · Selected work (H15 unveil, H9 hover) */}
      <section className="section soft" aria-labelledby="work-title">
        <div className="container-x">
          <SectionHeader id="work-title" label="Work" title="Two products, both still live" action={<ArrowLink href="/work">All work</ArrowLink>} />
          <div className="grid gap-[var(--gutter)]">{cases.map(c => <CaseCard key={c.slug} c={c} />)}</div>
        </div>
      </section>

      {/* 6 · Built for (H8 roll-call) */}
      <section className="section dark" aria-labelledby="industries-title">
        <div className="container-x">
          <SectionHeader id="industries-title" label="Built for" title="Industries we've shipped in" />
          <RollCall items={industries} />
        </div>
      </section>

      {/* Numbers live on /about only: the hero proof strip already says since 2019 · 2 products live */}
      {/* 8 · Ways to work with us (no prices) */}
      <section className="section soft" aria-labelledby="models-title">
        <div className="container-x">
          <SectionHeader id="models-title" label="Ways to work" title="Three ways to work with us" />
          <EngagementModels />
          <p className="mt-8 t-small muted">No price list: we agree the model and the number on a short call.</p>
        </div>
      </section>

      {/* 9 · Statement (H6) */}
      <section className="section" aria-label="Why us">
        <div className="container-x">
          <Label>Why us</Label>
          <div className="mt-10">
            <StatementReveal text="Most of our clients didn't come looking for us. We found a problem in their product, showed them the fix, and stayed to keep it working." />
          </div>
        </div>
      </section>

      {/* 10 · Contact block (+ footer from layout) */}
      <div id="contact"><ContactBlock /></div>
    </>
  );
}
