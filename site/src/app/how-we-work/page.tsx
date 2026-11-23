import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { share } from '@/lib/og';
import { ArrowLink, Label, Ph, SectionHeader } from '@/components/ui/primitives';
import { Faq, ProcessSteps } from '@/components/sections/blocks';
import { LocalClock } from '@/components/sections/LocalClock';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { RiseText } from '@/components/motion/RiseText';
import { communication, modelCompare, models } from '@/lib/content';
import { FoilBars } from '@/components/brand/FoilBars';

const DESCRIPTION = 'Three ways to work with epox (fixed project, dedicated developers, monthly retainer), the four steps every project goes through, and how we keep you updated from Faisalabad, UTC+5.';
export const metadata: Metadata = {
  title: 'How we work',
  description: DESCRIPTION,
  ...share('how-we-work', 'How we work · epox', DESCRIPTION, '/how-we-work'),
};

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

function cell(i: number, row: (typeof modelCompare.rows)[number]) {
  const m = models[i]; const c = modelCompare.cells[i];
  if (row === 'Best for') return m.best;
  if (row === 'Team') return c.team;
  if (row === 'Timeline') return c.timeline;
  return <ul className="grid gap-2">{m.points.map(p => <li key={p} className="flex gap-3"><span aria-hidden className="mt-[0.7em] h-px w-3 flex-none bg-current opacity-50" />{p}</li>)}</ul>;
}

/** /how-we-work (design brief §6): hero → ways to work (comparison) → process (live demo + steps) → communication → FAQ → contact. */
export default function HowWeWorkPage() {
  return (
    <>
      <section className="hero" aria-labelledby="hww-hero">
        <FoilBars className="hero-bars hero-bars--page" />
        <div className="container-x pt-[calc(72px+var(--space-10))] pb-[var(--space-9)]">
          <p className="t-label muted hero-after" style={d(0)}>How we work</p>
          <RiseText as="h1" on="load" id="hww-hero" className="t-h1 mt-8" style={{ maxWidth: '15ch' }}
            parts={['Pick how we work together. Then see', { t: 'every week', hl: true }, 'of it.']} />
          <p className="t-lead muted mt-10 hero-after" style={{ maxWidth: '46ch', ...d(600) }}>
            Three ways to hire us, four steps every project goes through, and the updates you get along the way.
          </p>
        </div>
      </section>

      {/* ways to work: comparison (table on desktop, cards on mobile) */}
      <section className="section soft" aria-labelledby="models-title">
        <div className="container-x">
          <SectionHeader id="models-title" label="Ways to work" title="Three ways to work with us" />

          <div className="hidden lg:block" data-reveal>
            <table className="table-fixed border-separate border-spacing-x-[var(--gutter)] -mx-[var(--gutter)] w-[calc(100%+2*var(--gutter))]">
              <caption className="sr-only">Engagement models compared (no prices; agreed on a call)</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[18%]"><span className="sr-only">Compare</span></th>
                  {models.map(m => (
                    <th key={m.n} scope="col" className="rounded-t-[var(--r-card)] bg-card px-8 pt-8 pb-6 text-left align-top font-normal">
                                            <span className="t-h3 block">{m.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modelCompare.rows.map(row => (
                  <tr key={row}>
                    <th scope="row" className="border-t border-line py-5 text-left align-top t-label muted font-medium">{row}</th>
                    {models.map((m, i) => (
                      <td key={m.n} className="bg-card px-8 pb-5 align-top"><div className="border-t border-line pt-5 t-small">{cell(i, row)}</div></td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td />
                  {models.map(m => <td key={m.n} className="rounded-b-[var(--r-card)] bg-card px-8 pt-4 pb-8"><ArrowLink href="#contact">Let&apos;s talk</ArrowLink></td>)}
                </tr>
              </tbody>
            </table>
          </div>

          <ol className="grid gap-[var(--gutter)] md:grid-cols-2 lg:hidden">
            {models.map((m, i) => (
              <li key={m.n} className="card-o rounded-[var(--r-card)] p-8" data-reveal style={{ '--i': i } as CSSProperties}>
                                <h3 className="t-h3">{m.title}</h3>
                <dl className="mt-6 grid gap-5">
                  {modelCompare.rows.map(row => (
                    <div key={row} className="border-t border-line pt-4"><dt className="t-label muted">{row}</dt><dd className="mt-2 t-small">{cell(i, row)}</dd></div>
                  ))}
                </dl>
                <div className="mt-8"><ArrowLink href="#contact">Let&apos;s talk</ArrowLink></div>
              </li>
            ))}
          </ol>
          <p className="mt-8 t-small muted">No price list: we agree the model and the number on a short call.</p>
        </div>
      </section>

      {/* process */}
      <section className="section" aria-labelledby="process-title">
        <div className="container-x">
          <SectionHeader id="process-title" label="Process" title="Four steps, every project" />
          <ProcessSteps />
        </div>
      </section>

      {/* communication */}
      <section className="section dark" aria-labelledby="comms-title">
        <div className="container-x">
          <SectionHeader id="comms-title" label="Communication" title="A different time zone, never out of reach" />
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-[var(--gutter)]">
            <div className="lg:col-span-5" data-reveal>
              <LocalClock />
              <p className="mt-8 muted" style={{ maxWidth: '40ch' }}>
                Our working hours overlap with yours: <Ph>[PLACEHOLDER: overlap hours, e.g. UK and EU mornings, US East early]</Ph>
              </p>
            </div>
            <ol className="grid gap-8 lg:col-span-6 lg:col-start-7">
              {communication.map((c, i) => (
                <li key={c.title} className="border-t border-line pt-6" data-reveal style={{ '--i': i } as CSSProperties}>
                  <Label>{String(i + 1).padStart(2, '0')}</Label>
                  <h3 className="t-h3 mt-3">{c.title}</h3>
                  <p className="mt-2 muted" style={{ maxWidth: '44ch' }}>{c.text}</p>
                  {c.confirm && <p className="mt-3"><Ph>{c.confirm}</Ph></p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" aria-labelledby="faq-title">
        <div className="container-x">
          <SectionHeader id="faq-title" label="FAQ" title="Questions we hear first" />
          <Faq items={[
            { q: 'Do you work under NDA?', a: 'Yes. We can sign yours or send ours before you share anything.' },
            { q: 'Who owns the code?', a: <>You do. <Ph>[PLACEHOLDER: confirm ownership and handover terms]</Ph></> },
            { q: 'How do payments work?', a: <Ph>[PLACEHOLDER: payment terms, e.g. milestones for fixed projects, monthly for developers and retainers]</Ph> },
            { q: 'Do you work with clients outside Pakistan?', a: 'Yes. We work with anyone who needs it. One of the two apps in our work runs for tenants and landlords across Europe.' },
          ]} />
        </div>
      </section>

      <div id="contact"><ContactBlock /></div>
    </>
  );
}
