'use client';
import Link from 'next/link';
import { BtnLabel } from '@/components/ui/primitives';
import { FoilBars } from '@/components/brand/FoilBars';
import { useEffect, useId, useRef, useState } from 'react';

type State = 'idle' | 'sending' | 'success' | 'error';
const TOPICS = ['New project', 'Existing product', 'Dedicated developers', 'Other'];

/** Contact form (L8): inline validation, sending / success / error states. Posts to /api/contact → Resend → owner's inbox. */
/** accent: the submit button is the layout's main action (contact page); off where another accent button leads. On Paper it renders as ink. */
export function ContactForm({ forceState, accent = true }: { forceState?: State; accent?: boolean }) {
  const id = useId();
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const s = forceState ?? state;
  const mountedAt = useRef(0); // spam check: time spent on the form
  useEffect(() => { mountedAt.current = Date.now(); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    data.elapsed = String(Date.now() - mountedAt.current);
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = 'Please add your name.';
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? '')) errs.email = 'Please add a valid email.';
    if ((data.message ?? '').trim().length < 10) errs.message = 'A sentence or two about the problem helps.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState('sending');
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error ?? 'Something went wrong.');
      setState('success');
    } catch (err) {
      // a network failure (offline, blocked) throws a TypeError with browser wording ("Failed to fetch"): show our own message instead
      setMsg(err instanceof TypeError ? '' : (err as Error).message); setState('error');
    }
  }

  if (s === 'success') {
    return (
      <div className="grid content-start gap-5" role="status">
        {/* the reward: the three foil bars fly in and lock into the E (black tile, so the foil stays on Black on a Paper panel) */}
        <div className="sent-tile" data-theme="dark"><FoilBars mode="enter" className="sent-bars" /></div>
        <p className="t-h3">Got it. We&apos;ll take it from here.</p>
        <p className="muted">A person who builds software reads every message. You&apos;ll hear back within one working day, with a first view on how we&apos;d approach it.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8" aria-describedby={`${id}-status`}>
      <fieldset className="field">
        <legend>What&apos;s this about?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TOPICS.map((t, i) => (
            <span key={t}>
              <input className="chip-input" type="radio" name="topic" id={`${id}-t${i}`} value={t} defaultChecked={i === 0} />
              <label htmlFor={`${id}-t${i}`} className="chip">{t}</label>
            </span>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id={`${id}-name`} name="name" label="Name" autoComplete="name" error={errors.name} />
        <Field id={`${id}-email`} name="email" label="Work email" type="email" autoComplete="email" error={errors.email} />
      </div>
      <Field id={`${id}-company`} name="company" label="Company (optional)" autoComplete="organization" />
      <Field id={`${id}-msg`} name="message" label="What do you want to improve?" textarea error={errors.message} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden /> {/* honeypot */}
      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className={`btn btn-lg ${accent ? 'btn-accent' : ''}`} disabled={s === 'sending'} aria-busy={s === 'sending'}>
          {s === 'sending' ? <><span className="spinner" aria-hidden />Sending…</> : <BtnLabel arrow>Send</BtnLabel>}
        </button>
              </div>
      <p className="t-small muted -mt-2">We only use your details to reply to you. <Link href="/privacy" className="link">Privacy</Link></p>
      <p id={`${id}-status`} role="alert" className={s === 'error' ? 'field-error' : 'sr-only'}>
        {s === 'error' ? (msg || 'Something went wrong. Please email us instead.') : ''}
      </p>
    </form>
  );
}

function Field({ id, name, label, type = 'text', textarea, error, autoComplete }:
  { id: string; name: string; label: string; type?: string; textarea?: boolean; error?: string; autoComplete?: string }) {
  const props = { id, name, className: 'input', 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-err` : undefined, autoComplete };
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {textarea ? <textarea {...props} rows={4} /> : <input {...props} type={type} />}
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
    </div>
  );
}
