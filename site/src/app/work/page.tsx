import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import { CaseCard } from '@/components/sections/blocks';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { RiseText } from '@/components/motion/RiseText';
import { cases } from '@/lib/content';
import { FoilBars } from '@/components/brand/FoilBars';

const DESCRIPTION = 'Products epox built and still runs: a rental inspection app for European tenants and landlords, and a nutrition app with a real nutritionist inside.';
export const metadata: Metadata = {
  title: 'Work',
  description: DESCRIPTION,
  ...share('work', 'Work · epox', DESCRIPTION, '/work'),
};

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/**
 * /work (design brief §6): hero → case grid → contact.
 * Filter chips by area are left out until there are enough projects to filter (both current cases cover the same areas).
 */
export default function WorkPage() {
  return (
    <>
      <section className="hero" aria-labelledby="work-hero">
        <FoilBars className="hero-bars hero-bars--page" />
        <div className="container-x pt-[calc(72px+var(--space-10))] pb-[var(--space-9)]">
          <p className="t-label muted hero-after" style={d(0)}>Work</p>
          <RiseText as="h1" on="load" id="work-hero" className="t-h1 mt-8" style={{ maxWidth: '15ch' }}
            parts={['Products we built and', { t: 'still run.', hl: true }]} />
          <p className="t-lead muted mt-10 hero-after" style={{ maxWidth: '46ch', ...d(600) }}>
            Both are live today, and we still market and maintain them. Client names stay private.
          </p>
        </div>
      </section>

      <section className="py-[var(--section-y)]" aria-label="Case studies">
        <div className="container-x grid gap-[var(--gutter)]">
          {cases.map(c => <CaseCard key={c.slug} c={c} headingAs="h2" />)}
        </div>
      </section>

      <ContactBlock />
    </>
  );
}
