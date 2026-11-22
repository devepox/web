import Link from 'next/link';
import { ArrowRight, Bot, Cloud, Globe, LayoutDashboard, PenTool, Rocket, Smartphone, type LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { RiseText } from '@/components/motion/RiseText';

/* ------------------------------------------------------------------ Button */
/** Brand buttons: primary (inverted ground), secondary (outline), accent (foil: once per layout, for the one action you most want clicked; ink on Paper). */
type BtnProps = {
  href?: string; variant?: 'primary' | 'secondary' | 'accent'; size?: 'md' | 'lg'; arrow?: boolean; children: ReactNode; className?: string;
} & Omit<ComponentProps<'button'>, 'className' | 'children'>;

/** Button content: label + optional arrow (nudges on hover). */
export function BtnLabel({ children, arrow = false }: { children: ReactNode; arrow?: boolean }) {
  return <>{children}{arrow && <ArrowRight className="icon" strokeWidth={1.9} aria-hidden />}</>;
}

export function Button({ href, variant = 'primary', size = 'md', arrow = false, children, className = '', ...rest }: BtnProps) {
  const cls = `btn ${variant === 'secondary' ? 'btn-secondary' : variant === 'accent' ? 'btn-accent' : ''} ${size === 'lg' ? 'btn-lg' : ''} ${className}`;
  const inner = <BtnLabel arrow={arrow}>{children}</BtnLabel>;
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <button type="button" className={cls} {...rest}>{inner}</button>;
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="arrow-link"><span>{children}</span><ArrowRight className="icon" strokeWidth={1.9} aria-hidden /></Link>
  );
}

/* ------------------------------------------------------------------ Label / Tag / Live */
export const Label = ({ children, className = '', as: As = 'span' }: { children: ReactNode; className?: string; as?: 'span' | 'p' | 'dt' | 'div' }) =>
  <As className={`t-label muted ${className}`}>{children}</As>;

export const Tag = ({ children }: { children: ReactNode }) => <span className="tag">{children}</span>;

export const Tags = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-1.5" aria-label="Includes">{items.map(t => <li key={t}><Tag>{t}</Tag></li>)}</ul>
);

export const Live = ({ children = 'Live' }: { children?: ReactNode }) => <span className="live">{children}</span>;

/* ------------------------------------------------------------------ Placeholders */
/** Marked placeholder for a missing visual asset: [ASSET: name]. */
export function AssetPlaceholder({ name, ratio = '16 / 10', className = '' }: { name: string; ratio?: string; className?: string }) {
  return <div className={`ph ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={`Placeholder: ${name}`}>[ASSET: {name}]</div>;
}

/** Inline marked placeholder for missing copy. Renders the text in brackets so it's impossible to miss. */
export const Ph = ({ children }: { children: ReactNode }) => <span className="ph-text">{children}</span>;

/** Renders a value; if it is a [PLACEHOLDER: …] string, renders it as a marked placeholder. */
export const Val = ({ v }: { v: string }) => (v.startsWith('[PLACEHOLDER') ? <Ph>{v}</Ph> : <>{v}</>);

/**
 * Reserved slot for future character illustrations (owner decision: no characters at launch).
 * Without art it renders the fallback (e.g. a big number) or nothing, and takes no layout space of its own.
 */
export function CharacterSlot({ art, fallback = null, label }: { art?: ReactNode; fallback?: ReactNode; label: string }) {
  if (art) return <div data-character={label}>{art}</div>;
  return fallback ? <div data-character-slot={label}>{fallback}</div> : null;
}

/* ------------------------------------------------------------------ Service icon (brand ServiceCard tile) */
/** 44px brand-black tile with a 24px foil-mint line icon (1.9 stroke): the one place the foil colour appears in the UI. */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  'web-saas-development': Globe, 'mobile-apps': Smartphone, 'business-software': LayoutDashboard, 'ai-solutions': Bot,
  'ui-ux-branding': PenTool, 'cloud-devops': Cloud, 'launch-growth-support': Rocket,
};
export function ServiceIcon({ slug }: { slug: string }) {
  const Icon = SERVICE_ICONS[slug] ?? Globe;
  return <span className="svc-icon" aria-hidden><Icon strokeWidth={1.9} /></span>;
}

/* ------------------------------------------------------------------ Section header */
/**
 * Two layouts, so consecutive sections don't all read the same:
 *  · stack (default): label, then the title with the optional action on its right.
 *  · split: label + title on the left (7 cols), a one-line intro and the action on the right (5 cols), bottom-aligned.
 */
export function SectionHeader({ label, title, action, id, intro, layout = 'stack', as: As = 'h2' }:
  { label: string; title: ReactNode; action?: ReactNode; id?: string; intro?: ReactNode; layout?: 'stack' | 'split'; as?: 'h1' | 'h2' }) {
  const cls = As === 'h1' ? 't-h1' : 't-h2';
  const heading = typeof title === 'string'
    ? <RiseText parts={[title]} as={As} id={id} className={cls} style={{ maxWidth: '18ch' }} />
    : <As id={id} className={cls} style={{ maxWidth: '18ch' }}>{title}</As>;
  if (layout === 'split') return (
    <header className="sh sh--split">
      <div><Label className="kicker">{label}</Label><div className="mt-5">{heading}</div></div>
      {(intro || action) && (
        <div className="sh-aside">
          {intro && <p className="muted" style={{ maxWidth: '40ch' }}>{intro}</p>}
          {action && <div className={intro ? 'mt-5' : ''}>{action}</div>}
        </div>
      )}
    </header>
  );
  return (
    <header className="sh">
      <Label className="kicker">{label}</Label>
      <div className="sh-row">{heading}{action}</div>
      {intro && <p className="muted" style={{ maxWidth: '52ch' }}>{intro}</p>}
    </header>
  );
}

/* ------------------------------------------------------------------ Fact table */
export function FactTable({ facts, cols = 2 }: { facts: { k: string; v: ReactNode }[]; cols?: 2 | 3 | 4 }) {
  const grid = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[cols];
  return (
    <dl className={`grid grid-cols-2 ${grid} gap-x-6 gap-y-5`}>
      {facts.map(f => (
        <div key={f.k}><dt className="t-label muted">{f.k}</dt><dd className="t-small mt-1.5">{f.v}</dd></div>
      ))}
    </dl>
  );
}
