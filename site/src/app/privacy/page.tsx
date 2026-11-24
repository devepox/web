import type { Metadata } from 'next';
import Link from 'next/link';
import { company } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What epox collects through this website (only what you send in the contact form), why, and how to have it deleted.',
};

// Plain-language policy based on what the site actually does today (no analytics, no cookies, fonts self-hosted,
// contact form → Resend → our inbox, hosted on Vercel). Owner / legal review before launch.
const sections: { h: string; body: React.ReactNode }[] = [
  { h: 'What we collect', body: <>Only what you type into the contact form: your name, email, company (if you add it), the topic you pick and your message. We don&apos;t use analytics, advertising trackers or cookies on this site.</> },
  { h: 'Why we collect it', body: <>To read your message and reply to you. We don&apos;t add you to a mailing list and we don&apos;t sell or share your details.</> },
  { h: 'Who handles it', body: <>The form is delivered to our inbox by Resend, an email service. The site is hosted on Vercel, which keeps short-lived technical logs (such as IP addresses) to run and protect the site. Both act on our behalf.</> },
  { h: 'How long we keep it', body: <>For as long as we&apos;re talking about a project with you, then for 24 months, unless you ask us to delete it sooner.</> },
  { h: 'Your choices', body: <>You can ask what we hold about you, ask us to correct it, or ask us to delete it. {company.email ? <>Write to <a className="link" href={`mailto:${company.email}`}>{company.email}</a></> : <>Send us a message through the <Link href="/contact" className="link">contact form</Link></>} and we&apos;ll answer within 30 days.</> },
  { h: 'Who we are', body: <>epox, a software house {company.street ? <>at {company.address}</> : <>in {company.city}, {company.country}</>}, working since {company.founded}.{company.phone && <> Phone and WhatsApp <a className="link t-num" href={company.phoneHref}>{company.phone}</a>.</>}</> },
];

/** /privacy (design brief §6): plain text page. Defaults (24 months, 30 days) written 2026-11-23; owner / legal review still advised. */
export default function PrivacyPage() {
  return (
    <section aria-labelledby="privacy-title" className="paper pb-[var(--section-y)]">
      <div className="container-x pt-[calc(72px+var(--space-10))]">
        <p className="t-label muted">/ Privacy</p>
        <h1 id="privacy-title" className="t-h1 mt-8" style={{ maxWidth: '14ch' }}>What happens to what you send us</h1>
        <p className="mt-8 t-small muted">Last updated 23 November 2026</p>

        <div className="mt-[var(--space-9)] grid gap-x-[var(--gutter)] lg:grid-cols-12">
          <dl className="grid gap-10 lg:col-span-8 lg:col-start-5">
            {sections.map((s, i) => (
              <div key={s.h} className="border-t border-line pt-6">
                <dt className="flex items-baseline gap-4"><span className="t-label muted">{String(i + 1).padStart(2, '0')}</span><span className="t-h3">{s.h}</span></dt>
                <dd className="mt-4" style={{ maxWidth: '64ch' }}>{s.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-[var(--space-9)] t-small muted lg:ml-[calc(4/12*100%)]">Questions about this page? <Link href="/contact" className="link">Contact us</Link>.</p>
      </div>
    </section>
  );
}
