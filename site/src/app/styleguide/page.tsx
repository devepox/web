import type { Metadata } from 'next';
import { Logo } from '@/components/brand/Logo';
import { ArrowLink, AssetPlaceholder, Button, CharacterSlot, FactTable, Label, Live, Ph, SectionHeader, ServiceIcon, Tag } from '@/components/ui/primitives';
import { FoilBars } from '@/components/brand/FoilBars';
import { CaseCard, EngagementModels, Faq, ProcessSteps, ServiceRows, TrustStrip } from '@/components/sections/blocks';
import { RollCall, StatementReveal, StatsScoreboard } from '@/components/sections/interactive';
import { ContactBlock } from '@/components/sections/ContactBlock';
import { ContactForm } from '@/components/sections/ContactForm';
import { alsoServices, cases, industries, services, stats } from '@/lib/content';
import { contrast } from '@/lib/contrast';
import { RiseText } from '@/components/motion/RiseText';
import { ExpandOnScroll } from '@/components/motion/ExpandOnScroll';

export const metadata: Metadata = { title: 'Styleguide', robots: { index: false, follow: false } };

// Ice Mint (assets/epox — Ice Mint brand system): Black ground by default, Paper for card bands, reading and forms.
const SCALE: [string, string][] = [
  ['brand-black', '#0B0C0F'], ['surface', '#16181D'], ['raised', '#1C1F25'], ['line', '#2A2F37'], ['line-strong', '#6B7380'], ['text-muted', '#A9B0BC'], ['text', '#F2F5F9'],
  ['paper', '#F3F5F8'], ['line (paper)', '#D8DDE5'], ['muted (paper)', '#535B68'], ['foil-flat', '#B9EDEA'], ['foil-mint', '#7FF5D0'], ['azure', '#1E8CFF'],
];
const PAIRS: [string, string, string][] = [
  ['Text on Black', '#F2F5F9', '#0B0C0F'], ['Text on surface', '#F2F5F9', '#16181D'], ['Muted text on Black', '#A9B0BC', '#0B0C0F'], ['Muted text on surface', '#A9B0BC', '#16181D'],
  ['Dimmed large text on Black (line-strong)', '#6B7380', '#0B0C0F'], ['Text on Paper', '#0B0C0F', '#F3F5F8'], ['Muted text on Paper', '#535B68', '#F3F5F8'],
  ['Muted text on white card', '#535B68', '#FFFFFF'], ['Dimmed large text on Paper (line-strong)', '#7A8391', '#F3F5F8'],
  ['Text on foil (accent button, darkest stop)', '#0B0C0F', '#8FC9FF'], ['Text on azure (highlight)', '#0B0C0F', '#1E8CFF'], ['Primary button on Black', '#0B0C0F', '#F2F5F9'],
  ['Foil-flat mark on Black', '#B9EDEA', '#0B0C0F'], ['Error on Black', '#FF7A6E', '#0B0C0F'], ['Error on Paper', '#B42318', '#F3F5F8'],
];
const TYPE = [
  ['display', 't-display', 'Found it.'], ['h1', 't-h1', 'A nutrition app with a real nutritionist inside'], ['h2', 't-h2', 'You\'ll always know what\'s happening'],
  ['h3', 't-h3', 'Business software'], ['rollcall', 't-rollcall', 'PropTech'], ['lead', 't-lead', 'We design, build and launch software, then stay on to keep it running and growing.'],
  ['body', 't-body', 'Tenants photograph the property at move-in into a tamper-proof record, then both sides compare it side by side at move-out. No more arguments over the deposit.'],
  ['small', 't-small', 'NDA available on request.'], ['label', 't-label', 'Services · Case 002 · Since 2019'], ['tagline', 't-tagline', 'software house'],
];
const SPACE = [4, 8, 12, 16, 24, 32, 48, 56, 64, 96, 128, 192];
const MOTION = [
  ['L1', 'Button / link hover', '100ms ease-out-quad', 'Buttons, links below', 'Linear'],
  ['L2', 'Mega-menu open + morph', '180ms / 240ms ease-out-quint', 'Header: hover Services, then Company', 'Linear'],
  ['L3', 'Header hide on scroll / frosted', '240ms ease-out-quint', 'Scroll this page', 'Linear'],
  ['L4', 'Section entrance (fade + rise 16px, stagger 60ms)', '800ms ease-out-quint', 'Every section here', 'Linear'],
  ['L6', 'Accordion', '240ms ease-out-quint', '§ FAQ', 'Linear'],
  ['L7', 'Count-up numbers', '1200ms ease-out-expo', '§ Scoreboard', 'Linear'],
  ['L8', 'Form states', '100–240ms', '§ Contact', 'Linear'],
  ['L10', 'Button hover: soft colour change, arrow nudge 3px, small press', '180ms ease-out-quad', 'Any button', 'Ice Mint pass'],
  ['H1', 'Lenis smooth scroll', 'lerp 0.1, mouse/trackpad only', 'Whole page (desktop)', 'Hello Monday'],
  ['H2', 'Page transition (enter)', '600ms ease-out-quint', 'Navigate via header', 'Hello Monday'],
  ['H3', 'Hero intro: headline words rise out of masks, then lead + buttons', '1000ms ease-out-quint, 70ms per word', 'Reload this page', 'Hello Monday'],
  ['H13', 'Section titles: words rise one by one', '1000ms, 60ms per word, once', 'Every section title', 'Bolder pass'],
  ['H14', 'Hero media opens to full width while scrolling', 'scrubbed (clip-path)', 'Hero logo placeholder (≥768px)', 'Bolder pass'],
  ['H15', 'Media wipes up + settles from zoom', '1100ms / 1400ms ease-out-quint', '§ Case cards', 'Bolder pass'],
  ['H6', 'Statement reveal (GSAP ScrollTrigger scrub)', 'scrubbed', '§ Statement', 'Hello Monday'],
  ['H7', 'Stacking service rows (sticky)', 'CSS sticky', '§ Service rows (tablet and up)', 'Webisoft'],
  ['H8', 'Roll-call lights at screen centre', '400ms', '§ Roll-call', 'Hello Monday'],
  ['H9', 'Case media hover + bullet slide-in', '600ms / 240ms', '§ Case cards', 'Hello Monday'],
] as const;

function Block({ id, label, title, children, tone }: { id: string; label: string; title: string; children: React.ReactNode; tone?: 'dark' | 'soft' }) {
  return (
    <section id={id} className={`section ${tone === 'dark' ? 'dark' : tone === 'soft' ? 'soft' : ''}`}>
      <div className="container-x" data-reveal>
        <SectionHeader label={label} title={title} />
        {children}
      </div>
    </section>
  );
}

export default function Styleguide() {
  return (
    <>
      {/* hero: Black band + foil bars, as on the home page */}
      <section className="hero">
        <FoilBars className="hero-bars hero-bars--home" />
        <div className="container-x pt-[calc(72px+var(--space-10))] pb-[var(--space-10)]">
          <p className="t-label muted hero-after" style={{ '--d': '0ms' } as React.CSSProperties}>Styleguide · Ice Mint</p>
          <RiseText as="h1" on="load" className="t-display mt-8" style={{ maxWidth: '11ch' }} parts={['We find the problem', { t: 'before', hl: true }, 'you do.']} />
          <p className="t-lead muted mt-10 hero-after" style={{ maxWidth: '44ch', '--d': '650ms' } as React.CSSProperties}>Every token, component and motion effect in one place, themed with the Ice Mint brand system (<code className="t-small">assets/epox — Ice Mint brand system</code>).</p>
          <div className="mt-12 flex flex-wrap gap-3 hero-after" style={{ '--d': '800ms' } as React.CSSProperties}><Button href="#contact" variant="accent" arrow size="lg">Let&apos;s talk</Button><Button href="#cases" variant="secondary" size="lg">See our work</Button></div>
          <ExpandOnScroll className="mt-[var(--space-9)]"><AssetPlaceholder name="liquid-metal logo loop · 16:9 · WebM + MP4 + poster" ratio="16 / 9" /></ExpandOnScroll>
        </div>
      </section>

      <Block id="colour" label="Colour" title="Black, foil and two off-guard colours">
        <div className="mb-8 h-16 rounded-[var(--r-card)]" style={{ background: 'var(--foil)' }} role="img" aria-label="Ice Mint foil gradient: logo, foil bars and service icons only" />
        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-7">
          {SCALE.map(([k, v]) => (
            <li key={k} className="flex aspect-[1/1.2] flex-col justify-between rounded-[var(--r-inner)] p-3 t-small" style={{ background: v, color: contrast(v, '#F2F5F9') > 4.5 ? '#F2F5F9' : '#0B0C0F', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
              <span className="font-semibold">{k}</span><span className="t-num">{v}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 t-small muted">Saffron: the one action you most want clicked, once per layout. Azure: one highlighted word or badge, once per layout. Foil: logo, foil bars and service icons only, never text or backgrounds.</p>
        <div className="mt-12 overflow-x-auto"><table className="w-full min-w-[520px] t-small">
          <caption className="sr-only">Contrast ratios</caption>
          <thead><tr className="text-left"><th className="t-label muted pb-3 font-medium">Pair</th><th className="t-label muted pb-3 font-medium">Sample</th><th className="t-label muted pb-3 text-right font-medium">Ratio</th></tr></thead>
          <tbody>
            {PAIRS.map(([n, f, b]) => { const r = contrast(f, b); return (
              <tr key={n} className="border-t border-line"><td className="py-3">{n}</td>
                <td className="py-3"><span className="rounded-[var(--r-tag)] px-3 py-1.5" style={{ background: b, color: f, boxShadow: 'inset 0 0 0 1px var(--line)' }}>Aa 123</span></td>
                <td className="py-3 text-right t-num">{r.toFixed(2)}:1 · {r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'fail'}</td></tr>); })}
          </tbody>
        </table></div>
      </Block>

      <Block id="type" label="Type" title="Type scale">
        <dl>
          {TYPE.map(([k, cls, sample]) => (
            <div key={k} className="grid gap-3 border-t border-line py-8 md:grid-cols-12 md:items-baseline">
              <dt className="t-label muted md:col-span-3">{k} · .{cls}</dt>
              <dd className={`${cls} md:col-span-9`} style={{ maxWidth: cls === 't-body' ? '64ch' : undefined }}>{sample}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 t-small muted">Space Grotesk (headlines, Bold) and Inter (everything else), self-hosted from the brand files. Optional local Helvetica Now via <code className="t-small">NEXT_PUBLIC_FONT_SET=licensed</code>.</p>
      </Block>

      <Block id="space" label="Space" title="Spacing, grid and radius" tone="soft">
        <ol className="grid gap-3">
          {SPACE.map(s => (
            <li key={s} className="grid grid-cols-[5rem_1fr] items-center gap-4"><span className="t-label muted t-num">{s}px</span><span className="h-3 rounded-full bg-text" style={{ width: s }} /></li>
          ))}
        </ol>
        <div className="mt-16 grid grid-cols-4 gap-[var(--gutter)] md:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className={`h-24 rounded-[var(--r-sm)] bg-card ${i > 3 ? 'hidden md:block' : ''}`} />)}
        </div>
        <p className="mt-4 t-small muted">12 columns · max 1440px · gutter 24px (16px mobile) · margin clamp(20px, 4vw, 56px)</p>
        <div className="mt-16 flex flex-wrap gap-6">
          <div className="card-o rounded-[var(--r-card)] p-[var(--r-card-pad)]"><div className="grid h-32 w-48 place-items-center rounded-[var(--r-inner)] bg-bg t-label">card 14 / inner 6</div></div>
          <span className="tag self-center">chip (pill)</span><span className="btn self-center">pill</span><span className="hl self-center t-small">highlight 8</span>
          <div className="w-56 self-center"><input className="input" placeholder="input" aria-label="Input example" /></div>
        </div>
      </Block>

      <Block id="logo" label="Logo" title="The epox wordmark">
        <div className="grid gap-[var(--gutter)] md:grid-cols-2">
          <div className="dark grid aspect-[16/9] place-items-center rounded-[var(--r-card)]" style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }}><Logo foil lockup className="h-20 w-auto md:h-28" /></div>
          <div className="paper grid aspect-[16/9] place-items-center rounded-[var(--r-card)]"><Logo className="h-14 w-auto md:h-20" /></div>
        </div>
        <p className="mt-4 t-small muted">Space Grotesk Bold, outlined from the brand files; always lower case. Foil only on Black, plain ink on Paper. Minimum 24px tall on screen.</p>
      </Block>

      <Block id="buttons" label="Actions" title="Buttons and links">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-wrap items-center gap-3"><Button variant="accent" arrow>Let&apos;s talk</Button><Button>Start a project</Button><Button variant="secondary">See our work</Button><Button disabled>Disabled</Button></div>
          <div className="paper flex flex-wrap items-center gap-3 rounded-[var(--r-card)] p-8"><Button>Start a project</Button><Button variant="secondary">See our work</Button></div>
          <div className="flex flex-wrap items-center gap-8"><ArrowLink href="#buttons">Read the case</ArrowLink><a href="#buttons" className="link">Inline text link</a></div>
        </div>
      </Block>

      <Block id="atoms" label="Atoms" title="Labels, tags, status and placeholders" tone="soft">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="grid content-start gap-6">
            <Label>Services</Label>
            <div className="flex flex-wrap gap-2"><Tag>iOS</Tag><Tag>Android</Tag><Tag>Cross-platform</Tag></div>
            <div className="flex items-center gap-3">{services.slice(0, 4).map(s => <ServiceIcon key={s.slug} slug={s.slug} />)}</div>
            <Live>Live · run by epox</Live>
            <p>Copy gap inline: <Ph>[PLACEHOLDER: result metric]</Ph></p>
          </div>
          <div className="grid gap-4">
            <AssetPlaceholder name="case 001 hero · 16:10" />
            <p className="t-small muted">CharacterSlot (no art yet) renders its fallback:</p>
            <CharacterSlot label="service-02" fallback={<span className="t-rollcall muted">02</span>} />
          </div>
        </div>
      </Block>

      <Block id="facts" label="Facts" title="Fact table">
        <FactTable cols={4} facts={[{ k: 'Client', v: <Ph>[PLACEHOLDER: client descriptor]</Ph> }, { k: 'Sector', v: 'PropTech · Europe' }, { k: 'Platforms', v: 'iOS · Android · Web' }, { k: 'Status', v: <Live>Live</Live> }]} />
      </Block>

      <section id="services" className="section">
        <div className="container-x">
          <SectionHeader label="Services" title="Seven ways we can help" action={<ArrowLink href="/services">All services</ArrowLink>} />
          <ServiceRows items={services} stacking />
          <p className="mt-8 t-small muted">Also: {alsoServices.join(' · ')}</p>
        </div>
      </section>

      <Block id="cases" label="Work" title="Two products, both still live" tone="soft">
        <div className="grid gap-[var(--gutter)]">{cases.map(c => <CaseCard key={c.slug} c={c} />)}</div>
      </Block>

      <Block id="demo" label="Process" title="Four steps, every project">
        <ProcessSteps />
      </Block>

      <section id="rollcall" className="section">
        <div className="container-x">
          <SectionHeader label="Built for" title="Industries we've shipped in" />
          <RollCall items={industries} />
        </div>
      </section>

      <Block id="stats" label="Numbers" title="The short version">
        <StatsScoreboard stats={stats} />
      </Block>

      <Block id="models" label="Ways to work" title="Three ways to work with us" tone="soft">
        <EngagementModels />
      </Block>

      <section id="statement" className="section">
        <div className="container-x"><Label>Statement</Label><div className="mt-10"><StatementReveal text="Most of our clients didn't come looking for us. We found a problem in their product, showed them the fix, and stayed to keep it working." /></div></div>
      </section>

      <Block id="faq" label="FAQ" title="Questions we hear first">
        <Faq items={[
          { q: 'Do you work under NDA?', a: 'Yes. We can sign yours or send ours before you share anything.' },
          { q: 'Who owns the code?', a: <>You do. <Ph>[PLACEHOLDER: confirm ownership & handover terms]</Ph></> },
          { q: 'How do you price?', a: 'Fixed project, dedicated developers or a monthly retainer. We agree on the model and the number on a short call.' },
        ]} />
      </Block>

      <Block id="trust" label="Trust" title="Trust strip" tone="soft">
        <TrustStrip />
      </Block>

      <ContactBlock />

      <Block id="form-states" label="Form states" title="Success and error states" tone="soft">
        <div className="grid gap-16 md:grid-cols-2"><ContactForm forceState="success" /><ContactForm forceState="error" /></div>
      </Block>

      <Block id="motion" label="Motion" title="Motion spec, live on this page">
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] t-small">
          <caption className="sr-only">Motion effects</caption>
          <thead><tr className="text-left">{['#', 'Effect', 'Timing', 'See it', 'Style'].map(h => <th key={h} className="t-label muted pb-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>{MOTION.map(m => <tr key={m[0]} className="border-t border-line align-top">{m.map((c, i) => <td key={i} className={`py-3 pr-4 ${i === 0 ? 't-label' : ''}`}>{c}</td>)}</tr>)}</tbody>
        </table></div>
        <p className="mt-6 t-small muted">All effects switch off with prefers-reduced-motion. Lenis runs only for mouse/trackpad; touch keeps native scroll.</p>
      </Block>
    </>
  );
}
