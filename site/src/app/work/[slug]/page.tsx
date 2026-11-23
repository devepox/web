import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { MDXProps } from 'mdx/types';
import { AssetPlaceholder, FactTable, Live, Ph, Val } from '@/components/ui/primitives';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { caseMdxComponents } from '@/components/sections/caseMdx';
import { ExpandOnScroll } from '@/components/motion/ExpandOnScroll';
import { RiseText } from '@/components/motion/RiseText';
import { cases } from '@/lib/content';
import { FoilBars } from '@/components/brand/FoilBars';

// Case stories: one MDX file per project in src/content/work. Facts for cards + fact table stay in lib/content.ts.
// Adding a project = one entry in `cases` + one MDX file + one line here.
const stories: Record<string, () => Promise<{ default: (props: MDXProps) => React.JSX.Element }>> = {
  'rental-inspection-app': () => import('@/content/work/rental-inspection-app.mdx'),
  'nutrition-coaching-app': () => import('@/content/work/nutrition-coaching-app.mdx'),
};

// Known cases are prerendered at build; anything else renders not-found (see Next 16 cacheComponents note in CLAUDE.md).
export const instant = false;
export function generateStaticParams() {
  return cases.filter(c => stories[c.slug]).map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find(x => x.slug === slug);
  return c ? { title: `${c.headline} · Case ${c.n}`, description: c.summary, ...share(`work-${slug}`, `${c.headline} · epox`, c.summary, `/work/${slug}`) } : {};
}

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Case study (design brief §6): hero → fact table → 01 found / 02 built (+ media) / 03 changed → tech → next case → contact. */
export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = cases.findIndex(x => x.slug === slug);
  const c = cases[i];
  const load = stories[slug];
  if (!c || !load) notFound();
  const { default: Story } = await load();
  const next = cases[(i + 1) % cases.length];

  return (
    <>
      {/* hero */}
      <section className="hero" aria-labelledby="case-title">
        <FoilBars className="hero-bars hero-bars--page" />
        <div className="container-x pt-[calc(72px+var(--space-10))]">
          <p className="t-label muted hero-after flex flex-wrap items-center gap-x-3 gap-y-1" style={d(0)}>
            <Link href="/work" className="link-quiet">Work</Link>
            <span>Case {c.n}</span>{/* sector, region and status are in the fact table right below */}
          </p>
          <RiseText as="h1" on="load" id="case-title" className="t-h1 mt-8" style={{ maxWidth: '16ch' }} parts={[c.headline]} />
          <p className="t-lead muted mt-10 hero-after" style={{ maxWidth: '48ch', ...d(600) }}>{c.summary}</p>
          <ExpandOnScroll className="mt-[var(--space-9)]">
            <AssetPlaceholder name={`${c.asset.split(' · ')[0]} · 16:9`} ratio="16 / 9" />
          </ExpandOnScroll>
        </div>
      </section>

      {/* facts + story + tech: long reading, so it sits on Paper (brand) */}
      <div className="paper">
      {/* fact table */}
      <section className="section-tight" aria-label="Project facts">
        <div className="container-x">
          <FactTable cols={4} facts={[
            { k: 'Client', v: <Val v={c.client} /> },
            { k: 'Sector', v: c.region ? `${c.sector} · ${c.region}` : c.sector },
            { k: 'Platforms', v: c.platforms },
            { k: 'Engagement', v: c.engagement },
            { k: 'Status', v: <Live>{c.status}, run by epox</Live> },
            { k: 'Duration', v: <Val v={c.duration} /> },
          ]} />
        </div>
      </section>

      {/* story (MDX) */}
      <div className="container-x">
        <Story components={caseMdxComponents} />
      </div>

      {/* tech */}
      <section className="section-tight border-t border-line" aria-labelledby="tech-title">
        <div className="container-x grid gap-6 lg:grid-cols-12 lg:gap-[var(--gutter)]">
          <h2 id="tech-title" className="t-label muted lg:col-span-4">Tech</h2>
          <p className="lg:col-span-7 lg:col-start-6"><Ph>[PLACEHOLDER: tech stack for this project]</Ph></p>
        </div>
      </section>
      </div>

      {/* next case */}
      {next.slug !== c.slug && (
        <section className="section-tight !py-0" aria-label="Next case">
          <Link href={`/work/${next.slug}`} className="next-case container-x grid gap-4 py-[var(--section-y-tight)]">
            <span className="t-label muted">Next case · {next.n} · {next.sector}</span>
            <span className="t-h1" style={{ maxWidth: '16ch' }}>{next.headline}</span>
            <span className="arrow-link"><span>Read the case</span></span>
          </Link>
        </section>
      )}

      <ContactBlock />
    </>
  );
}
