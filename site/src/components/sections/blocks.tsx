import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowLink, FactTable, Label, Live, ServiceIcon, Tags, Val } from '@/components/ui/primitives';
import type { CaseStudy, Service } from '@/lib/content';
import { findings, models, steps, trust } from '@/lib/content';
import { CaseCover } from './CaseCover';
import { StackList } from './StackList';

/* ------------------------------------------------ Service cards (brand ServiceCard: icon tile, title, one sentence, link) */
/** Home services. 4 columns on desktop; the 8th tile carries the "also" line and the link to every service.
 *  Phones: compact rows (icon beside the text), the whole card is the link. */
export function ServiceCards({ items, also }: { items: Service[]; also?: string[] }) {
  return (
    <ul className="svc-cards">
      {items.map((s, i) => (
        <li key={s.slug} data-reveal style={{ '--i': i % 4 } as CSSProperties}>
          <Link href={`/services/${s.slug}`} className="svc-card">
            <ServiceIcon slug={s.slug} />
            <span className="svc-card-title">{s.title}</span>
            <span className="svc-card-text">{s.promise}</span>
            <span className="svc-card-link arrow-link" aria-hidden><span>Learn more</span><ArrowRight className="icon" strokeWidth={1.9} /></span>
          </Link>
        </li>
      ))}
      {also && (
        <li className="svc-card svc-card--also" data-reveal style={{ '--i': 3 } as CSSProperties}>
          <span className="t-label muted">Also</span>
          <span className="svc-card-text">{also.join(' · ')}</span>
          <span className="svc-card-link"><ArrowLink href="/services">All services</ArrowLink></span>
        </li>
      )}
    </ul>
  );
}

/* ------------------------------------------------ What we found (home): problem → fix → result, one row per case */
export function Findings() {
  return (
    <ol className="found-list">
      {findings.map((f, i) => (
        <li key={f.slug} className="found-row" data-reveal style={{ '--i': i } as CSSProperties}>
          <div className="found-case">
            <p className="t-label muted">Case {f.n}</p>
            <p className="mt-2 t-small">{f.sector}</p>
          </div>
          <div className="found-main">
            <p className="t-label muted found-tag"><span className="found-mark" aria-hidden />We found</p>
            <p className="found-text mt-4">{f.found}</p>
          </div>
          <div className="found-side">
            <p className="t-label muted">We built</p>
            <p className="mt-3">{f.built}</p>
            <p className="t-label muted mt-8">Result</p>
            <p className="mt-3"><Val v={f.result} /></p>
            <div className="mt-6"><ArrowLink href={`/work/${f.slug}`}>Read the case</ArrowLink></div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------ Numbered service rows (H7 stacking on desktop) */
export function ServiceRows({ items, stacking = false }: { items: Service[]; stacking?: boolean }) {
  const rows = items.map((s, i) => (
    <li key={s.slug} className="stack-row border-t border-line" style={{ '--i': i } as React.CSSProperties}>
      <Link href={`/services/${s.slug}`} className="svc-row group grid grid-cols-[3.75rem_1fr] gap-x-3 md:grid-cols-12 md:gap-x-[var(--gutter)] md:gap-y-3" data-reveal style={{ '--i': 0 } as React.CSSProperties}>
        {/* the big foil number, same as /services; it and the title fill the pinned strip exactly */}
        <span className="svc-num foil-text md:col-span-3" aria-hidden>{s.n}</span>
        <span className="md:col-span-8">
          <span className="svc-title t-h3 block">{s.title}</span>
          <span className="mt-2 block max-w-[52ch] muted">{s.promise}</span>
          <span className="mt-4 block"><Tags items={s.tags} /></span>
        </span>
        <span className="hidden md:col-span-1 md:flex md:justify-end" aria-hidden>
          <span className="arrow-link"><span>Explore</span></span>
        </span>
      </Link>
    </li>
  ));
  return stacking ? <StackList count={items.length}>{rows}</StackList> : <ol>{rows}</ol>;
}

/* ------------------------------------------------ Case card (fact row + live dot + media hover H9) */
export function CaseCard({ c, size = 'lg', headingAs: H = 'h3' }: { c: CaseStudy; size?: 'lg' | 'md'; headingAs?: 'h2' | 'h3' }) {
  return (
    <article className={`case-card group grid rounded-[var(--r-card)] bg-card p-[var(--r-card-pad)] ${size === 'lg' ? 'lg:grid-cols-[1.15fr_1fr]' : ''}`} data-reveal>
      <Link href={`/work/${c.slug}`} className="media-hover block" tabIndex={-1} aria-hidden data-unveil>
        <CaseCover c={c} ratio="16 / 10" />
      </Link>
      <div className="flex flex-col p-6 md:p-10">
        <Label>Case {c.n} · {c.sector}{c.region ? ` · ${c.region}` : ''}</Label>
        <H className="t-h3 mt-4" style={{ fontSize: size === 'lg' ? 'clamp(1.625rem, 1.3rem + 1.1vw, 2.5rem)' : undefined, lineHeight: 1.05 }}>
          <Link href={`/work/${c.slug}`} className="no-underline"><span className="bullet" aria-hidden>•</span>{c.headline}</Link>
        </H>
        <p className="mt-4 max-w-[46ch] muted">{c.summary}</p>
        <div className="mt-8">
          <FactTable facts={[
            { k: 'Client', v: <Val v={c.client} /> },
            { k: 'Platforms', v: c.platforms },
            { k: 'Engagement', v: c.engagement },
            { k: 'Status', v: <Live>{c.status}</Live> },
          ]} />
        </div>
        <div className="mt-8 md:mt-auto md:pt-8"><ArrowLink href={`/work/${c.slug}`}>Read the case</ArrowLink></div>
      </div>
    </article>
  );
}

/* ------------------------------------------------ Trust strip */
export function TrustStrip({ items = trust }: { items?: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-6" aria-label="Why teams trust epox">
      {items.map((t, i) => <li key={t} className="t-label muted">{i === 1 ? <Live>{t}</Live> : t}</li>)}
    </ul>
  );
}

/* ------------------------------------------------ Engagement models (no prices) */
export function EngagementModels() {
  return (
    <ol className="grid gap-[var(--gutter)] md:grid-cols-3">
      {models.map((m, i) => (
        <li key={m.n} className="card-o flex flex-col rounded-[var(--r-card)] p-6 sm:p-8" data-reveal style={{ '--i': i } as React.CSSProperties}>
          <h3 className="t-h3">{m.title}</h3>
          <p className="mt-3 muted">Best for: {m.best}</p>
          {/* phones: the points are hidden (the full comparison is on /how-we-work), so the page stays short */}
          <ul className="mt-8 hidden gap-3 border-t border-line pt-6 sm:grid">
            {m.points.map(p => <li key={p} className="t-small flex gap-3"><span aria-hidden className="mt-[0.6em] h-px w-3 flex-none bg-current opacity-50" />{p}</li>)}
          </ul>
          <div className="mt-auto pt-6 sm:pt-10"><ArrowLink href="/contact">Let&apos;s talk</ArrowLink></div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------ Process steps */
export function ProcessSteps() {
  return (
    <ol className="grid gap-x-[var(--gutter)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.n} className="border-t border-line pt-6" data-reveal style={{ '--i': i } as React.CSSProperties}>
          <span className="t-label muted">{s.n}</span>
          <h3 className="t-h3 mt-4">{s.title}</h3>
          <p className="mt-3 muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------ FAQ accordion (L6) */
export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div>
      {items.map(i => (
        <details key={i.q} className="acc">
          <summary>{i.q}<Plus className="icon" strokeWidth={1.9} aria-hidden /></summary>
          <div className="acc-body">{i.a}</div>
        </details>
      ))}
    </div>
  );
}
