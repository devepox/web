import type { CSSProperties, ReactNode } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLink, AssetPlaceholder, Button, Label, Ph, SectionHeader, Tags } from '@/components/ui/primitives';
import { CaseCard, Faq } from '@/components/sections/blocks';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { RiseText } from '@/components/motion/RiseText';
import { cases, services } from '@/lib/content';
import { serviceDetails } from '@/lib/serviceDetails';
import { FoilBars } from '@/components/brand/FoilBars';

// Only areas with written content are prebuilt; any other slug hits notFound() below until its copy is added to serviceDetails.
// Content pages: known slugs are prerendered at build; a blocking render is fine for anything else (it 404s).
export const instant = false;
export function generateStaticParams() {
  return Object.keys(serviceDetails).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find(x => x.slug === slug); const d = serviceDetails[slug];
  if (!s || !d) return {};
  return { title: s.title, description: d.lead, ...share(`services-${slug}`, `${s.title} · epox`, d.lead, `/services/${slug}`) };
}

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Renders copy with an inline [PLACEHOLDER: …] marked, so gaps are impossible to miss. */
function WithPh({ text }: { text: string }): ReactNode {
  const i = text.indexOf('[PLACEHOLDER');
  if (i < 0) return text;
  return <>{text.slice(0, i)}<Ph>{text.slice(i)}</Ph></>;
}

/** Service detail (design brief §6): hero → what we build → feature chapters → related work → tech → FAQ → contact. */
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find(x => x.slug === slug);
  const detail = serviceDetails[slug];
  if (!s || !detail) notFound();
  const related = detail.caseSlugs.map(c => cases.find(x => x.slug === c)).filter(x => !!x);

  return (
    <>
      {/* hero */}
      <section className="hero" aria-labelledby="service-title">
        <FoilBars className="hero-bars hero-bars--page" />
        <div className="container-x pt-[calc(72px+var(--space-10))] pb-[var(--space-9)]">
          <p className="t-label muted hero-after" style={d(0)}>
            <Link href="/services" className="link-quiet">Services</Link> · {s.title}
          </p>
          <RiseText as="h1" on="load" id="service-title" className="t-h1 mt-8" style={{ maxWidth: '16ch' }} parts={[detail.headline]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <p className="t-lead muted hero-after lg:col-span-6" style={{ maxWidth: '46ch', ...d(600) }}>{detail.lead}</p>
            <div className="hero-after lg:col-span-6 lg:flex lg:justify-end" style={d(750)}>
              <Button href="#contact" size="lg" variant="accent" arrow>{detail.cta}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* what we build */}
      <section className="section soft" aria-labelledby="build-title">
        <div className="container-x">
          <SectionHeader id="build-title" label="What we build" title={detail.buildTitle} />
          <ol className="grid gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {detail.capabilities.map((c, i) => (
              <li key={c.title} className="border-t border-line pt-6" data-reveal style={{ '--i': i % 3 } as CSSProperties}>
                <span className="t-label muted">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3 mt-4">{c.title}</h3>
                <p className="mt-3 muted" style={{ maxWidth: '38ch' }}>{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* feature chapters: title left, copy right, visual full width (H15 unveil) */}
      {detail.features.map((f, i) => (
        <section key={f.title} className="section" aria-labelledby={`feature-${i}`}>
          <div className="container-x">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-[var(--gutter)]">
              <div className="lg:col-span-5">
                <Label as="p">{f.label}</Label>
                <RiseText as="h2" id={`feature-${i}`} className="t-h2 mt-6" style={{ maxWidth: '14ch' }} parts={[f.title]} />
              </div>
              <p className="t-lead muted lg:col-span-6 lg:col-start-7 lg:self-end" style={{ maxWidth: '46ch' }} data-reveal>{f.text}</p>
            </div>
            {f.asset && (
              <div className="mt-[var(--space-8)] overflow-hidden rounded-[var(--r-card)]" data-unveil>
                <AssetPlaceholder name={f.asset} ratio="16 / 9" />
              </div>
            )}
          </div>
        </section>
      ))}

      {/* related work */}
      {related.length > 0 && (
        <section className="section soft" aria-labelledby="work-title">
          <div className="container-x">
            <SectionHeader id="work-title" label="Work" title={related.length > 1 ? 'Both apps are still live' : 'Still live, still run by us'} action={<ArrowLink href="/work">All work</ArrowLink>} />
            <div className="grid gap-[var(--gutter)]">{related.map(c => <CaseCard key={c.slug} c={c} />)}</div>
          </div>
        </section>
      )}

      {/* tech (only when there's a list or a note to confirm) */}
      {(detail.tech.length > 0 || detail.techNote) && <section className="section-tight" aria-labelledby="tech-title">
        <div className="container-x grid gap-6 lg:grid-cols-12 lg:gap-[var(--gutter)]">
          <h2 id="tech-title" className="t-label muted lg:col-span-3 lg:pt-1.5">Tech we use</h2>
          <div className="grid gap-4 lg:col-span-9">
            {detail.tech.length > 0 && <Tags items={detail.tech} />}
            {detail.techNote && <p><Ph>{detail.techNote}</Ph></p>}
          </div>
        </div>
      </section>}

      {/* FAQ (L6) */}
      <section className="section" aria-labelledby="faq-title">
        <div className="container-x">
          <SectionHeader id="faq-title" label="FAQ" title="Questions we hear first" />
          <Faq items={detail.faq.map(f => ({ q: f.q, a: <WithPh text={f.a} /> }))} />
        </div>
      </section>

      <div id="contact"><ContactBlock /></div>
    </>
  );
}
