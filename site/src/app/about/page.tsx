import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import { ArrowLink, Label, Ph, SectionHeader } from '@/components/ui/primitives';
import { StatementReveal, StatsScoreboard } from '@/components/sections/interactive';
import { LocalClock } from '@/components/sections/LocalClock';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { RiseText } from '@/components/motion/RiseText';
import { company, stats } from '@/lib/content';
import { FoilBars } from '@/components/brand/FoilBars';

const DESCRIPTION = 'epox is a software house in Faisalabad, Pakistan, building since 2019. We find what is holding a business back, reach out with the fix, build it and stay to keep it running.';
export const metadata: Metadata = {
  title: 'About',
  description: DESCRIPTION,
  ...share('about', 'About · epox', DESCRIPTION, '/about'),
};

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

const principles = [
  { title: 'We find it first', text: 'Most of our projects start with us spotting a problem before anyone asked. We would rather show you the fix than wait for a brief.' },
  { title: 'We stay after launch', text: 'Both products in our work are still live, and we still market and maintain them. Launch is the middle, not the end.' },
  { title: 'Plain, regular updates', text: 'One project lead and a short written update every week: what shipped, what is next, what we need from you.' },
  { title: 'Your code is yours', text: 'What we build for you belongs to you.', confirm: '[PLACEHOLDER: confirm ownership and handover terms]' },
];

/** /about (design brief §6): hero → statement → numbers → principles → where we are → contact. No team photos (owner decision). */
export default function AboutPage() {
  return (
    <>
      <section className="hero" aria-labelledby="about-hero">
        <FoilBars className="hero-bars hero-bars--page" />
        <div className="container-x pt-[calc(72px+var(--space-10))] pb-[var(--space-9)]">
          <p className="t-label muted hero-after" style={d(0)}>About</p>
          <RiseText as="h1" on="load" id="about-hero" className="t-h1 mt-8" style={{ maxWidth: '16ch' }}
            parts={[`A software house from ${company.city}, building`, { t: `since ${company.founded}.`, hl: true }]} />
          <p className="t-lead muted mt-10 hero-after" style={{ maxWidth: '46ch', ...d(600) }}>
            We don&apos;t wait for briefs. We look at a business, find what&apos;s holding it back and reach out with the fix. Then we build it, and stay to keep it running.
          </p>
        </div>
      </section>

      {/* statement (H6) */}
      <section className="section soft" aria-label="Why you're here">
        <div className="container-x">
          <Label>If we messaged you</Label>
          <div className="mt-10">
            <StatementReveal text="If you're reading this because we reached out, it's because we already looked at your product and found something worth fixing. This page is here so you can check who we are." />
          </div>
        </div>
      </section>

      {/* numbers (L7) */}
      <section className="section" aria-labelledby="numbers-title">
        <div className="container-x">
          <SectionHeader id="numbers-title" label="Numbers" title="The short version" />
          <StatsScoreboard stats={stats} />
        </div>
      </section>

      {/* principles */}
      <section className="section dark" aria-labelledby="principles-title">
        <div className="container-x">
          <SectionHeader id="principles-title" label="How we think" title="Four things we don't compromise on" />
          <ol className="grid gap-x-[var(--gutter)] gap-y-12 md:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title} className="border-t border-line pt-6" data-reveal style={{ '--i': i % 2 } as CSSProperties}>
                <span className="t-label muted">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h2 mt-4" style={{ maxWidth: '14ch' }}>{p.title}</h3>
                <p className="t-lead muted mt-5" style={{ maxWidth: '40ch' }}>{p.text}</p>
                {p.confirm && <p className="mt-4"><Ph>{p.confirm}</Ph></p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* where we are */}
      <section className="section" aria-labelledby="where-title">
        <div className="container-x">
          <SectionHeader id="where-title" label="Where we are" title={`${company.city}, ${company.country}`} />
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-[var(--gutter)]">
            <div className="lg:col-span-5" data-reveal><LocalClock /></div>
            <div className="lg:col-span-6 lg:col-start-7" data-reveal>
              <p className="t-lead" style={{ maxWidth: '40ch' }}>
                We work with clients wherever they are. One of the two apps in our work runs for tenants and landlords across Europe.
              </p>
              <address className="mt-8 not-italic muted">
                <a className="link text-text" href={company.mapsUrl} target="_blank" rel="noopener noreferrer">{company.street}, {company.city}</a>
                <span className="block mt-1">Call or WhatsApp <a className="link t-num text-text" href={company.phoneHref}>{company.phone}</a></span>
              </address>
              <div className="mt-8"><ArrowLink href="/how-we-work">How we work together</ArrowLink></div>
            </div>
          </div>
        </div>
      </section>

      <div id="contact"><ContactBlock /></div>
    </>
  );
}
