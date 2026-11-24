import { ContactForm } from './ContactForm';
import { company } from '@/lib/content';
import { RiseText } from '@/components/motion/RiseText';

export const nextSteps = [
  { n: '01', t: 'A person reads it', d: 'Not a sales queue. Someone who builds software reads every message.' },
  { n: '02', t: 'You get a first view', d: 'How we would approach your problem, and a time to talk.' },
  { n: '03', t: 'Scope, timeline, cost', d: 'After a short call, under NDA if you need it.' },
];

/** Contact block (Webisoft pattern): headline + what happens next + form + book a call + trust strip. */
export function ContactBlock() {
  return (
    <section className="section dark" aria-labelledby="contact-title">
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-[var(--gutter)]">
          <div className="lg:col-span-5">
            <p className="t-label muted">/ Contact</p>
            <RiseText as="h2" id="contact-title" className="t-h1 mt-6" style={{ maxWidth: '12ch' }} parts={['Have a problem worth solving?', { t: "Let's talk.", emph: true }]} />
            <ol className="mt-12 grid gap-6">
              {nextSteps.map(s => (
                <li key={s.n} className="grid grid-cols-[3rem_1fr] border-t border-line pt-5">
                  <span className="t-label muted">{s.n}</span>
                  <span><span className="block font-medium">{s.t}</span><span className="mt-1 block t-small muted">{s.d}</span></span>
                </li>
              ))}
            </ol>
            {company.phone
              ? <p className="mt-10 t-small muted">
                  Prefer a call? <a className="link t-num text-text" href={company.phoneHref}>{company.phone}</a>, also on <a className="link text-text" href={company.whatsappHref}>WhatsApp</a>.
                  {company.bookingUrl && <> Or <a className="link text-text" href={company.bookingUrl}>book 20 minutes</a>.</>}
                </p>
              : company.bookingUrl && <p className="mt-10 t-small muted">Prefer a call? <a className="link" href={company.bookingUrl}>Book 20 minutes</a></p>}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {/* not the accent button: the page's hero already has the one main action */}
            <ContactForm accent={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
