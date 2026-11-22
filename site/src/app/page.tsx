import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import { ArrowLink, Button, Label, Live, SectionHeader } from '@/components/ui/primitives';
import { CaseCard, EngagementModels, Findings, ServiceCards } from '@/components/sections/blocks';
import { StatementReveal } from '@/components/sections/interactive';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { RiseText } from '@/components/motion/RiseText';
import { LiquidLogo } from '@/components/brand/LiquidLogo';
import { alsoServices, cases, company, services } from '@/lib/content';

const DESCRIPTION = 'epox is a software house in Faisalabad building web, mobile and AI products since 2019. We find what is holding your product back, fix it, and stay to keep it running.';
export const metadata: Metadata = {
  title: { absolute: 'epox: we find the problem before you do' },
  description: DESCRIPTION,
  ...share('home', 'epox: we find the problem before you do', DESCRIPTION, '/'),
};

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/**
 * Home. Order for a visitor arriving from a cold message: the claim, then proof, then how we think, then what we do.
 * hero (card front: headline + the glass wordmark over the foil bars) → work → what we found → services → ways to work → statement → contact.
 */
export default function Home() {
  return (
    <>
      {/* 1 · Hero: one screen laid out like the business card front. Headline + actions on the left; the live glass
          wordmark over the foil bars on the right, running off the edge (phones: below the actions, edge to edge). */}
      <section className="hero hero-home" aria-labelledby="hero-title">
        <div className="container-x hero-home-grid">
          <div className="hero-home-copy">
            <p className="t-label muted hero-after" style={d(0)}>Software house · {company.city}</p>
            <RiseText as="h1" on="load" id="hero-title" className="t-display mt-8" style={{ maxWidth: '12.5ch' }}
              parts={['We find the problem', { t: 'before', hl: true }, 'you do.']} />
            <p className="t-lead muted mt-8 hero-after" style={{ maxWidth: '42ch', ...d(650) }}>
              We build web, mobile and AI software, then stay to keep it running. If we reached out to you, we&apos;ve already found something worth fixing.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 hero-after" style={d(800)}>
              <Button href="/contact" size="lg" variant="accent" arrow>Let&apos;s talk</Button>
              <Button href="/work" size="lg" variant="secondary">See our work</Button>
            </div>
          </div>
          <div className="hero-home-glass"><LiquidLogo /></div>
        </div>

        {/* 2 · Proof strip */}
        <div className="container-x pb-[var(--space-7)]">
          <ul className="proof-strip grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-3" aria-label="epox in short">
            <li data-reveal style={{ '--i': 0 } as CSSProperties}><Label as="p">Since</Label><p className="mt-2 t-h3 t-num">{company.founded}</p></li>
            <li data-reveal style={{ '--i': 1 } as CSSProperties}><Label as="p"><Live>Live, run by us</Live></Label><p className="mt-2 t-h3">2 products</p></li>
            <li className="col-span-2 sm:col-span-1" data-reveal style={{ '--i': 2 } as CSSProperties}><Label as="p">We build</Label><p className="mt-2 t-h3">Web · Mobile · AI</p></li>
          </ul>
        </div>
      </section>

      {/* 3 · Work, straight after the claim: the proof a cold prospect is looking for */}
      <section className="section" aria-labelledby="work-title">
        <div className="container-x">
          <SectionHeader id="work-title" label="Work" title="Two products, both still live" action={<ArrowLink href="/work">All work</ArrowLink>} />
          <div className="grid gap-[var(--gutter)]">{cases.map(c => <CaseCard key={c.slug} c={c} />)}</div>
        </div>
      </section>

      {/* 4 · What we found: the brand idea made concrete (problem → fix → result) */}
      <section className="section" aria-labelledby="found-title">
        <div className="container-x">
          <SectionHeader id="found-title" layout="split" label="What we found" title="We name the problem before anyone writes code"
            intro="Every project starts the same way: find the one thing that is really in the way, then build the fix around it." />
          <Findings />
        </div>
      </section>

      {/* 5 · Services: brand service cards (icon tile + title + one sentence) */}
      <section className="section" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeader id="services-title" layout="split" label="Services" title="Seven ways we can help"
            intro="Whatever you need built probably fits one of these. If it doesn't, ask." />
          <ServiceCards items={services} also={alsoServices} />
        </div>
      </section>

      {/* 6 · Ways to work with us (no prices) */}
      <section className="section" aria-labelledby="models-title">
        <div className="container-x">
          <SectionHeader id="models-title" label="Ways to work" title="Three ways to work with us" />
          <EngagementModels />
          <p className="mt-8 t-small muted">No price list: we agree the model and the number on a short call.</p>
        </div>
      </section>

      {/* 7 · Statement (H6) */}
      <section className="section" aria-label="Why us">
        <div className="container-x">
          <Label>Why us</Label>
          <div className="mt-10">
            <StatementReveal text="Most of our clients didn't come looking for us. We found a problem in their product, showed them the fix, and stayed to keep it working." />
          </div>
        </div>
      </section>

      {/* 8 · Contact block (+ footer from layout) */}
      <div id="contact"><ContactBlock /></div>
    </>
  );
}
