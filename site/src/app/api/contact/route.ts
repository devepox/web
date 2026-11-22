// Contact endpoint → Resend (owner decision) → owner's inbox.
// Settings (Vercel → Project → Settings → Environment Variables, or site/.env.local for local runs):
//   RESEND_API_KEY   required. From resend.com → API Keys.
//   CONTACT_TO       required. Inbox that receives messages (comma-separate several).
//   CONTACT_FROM     required. Sender on a domain verified in Resend, e.g. "epox website <noreply@epox.systems>".
//                    Resend's test sender (onboarding@resend.dev) only delivers to the Resend account's own email, so there is no fallback.
// Spam: honeypot field + minimum fill time. Bots get a fake success so they don't retry.

const TOPICS = ['New project', 'Existing product', 'Dedicated developers', 'Other'];
const MIN_FILL_MS = 2500;

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  const data = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!data || typeof data !== 'object') return Response.json({ error: 'Invalid request.' }, { status: 400 });

  // bots: honeypot filled → fake success so they don't retry
  if (clean(data.website, 200)) return Response.json({ ok: true });
  // submitted faster than a person can type (or no usable timing): tell the sender so a real person can simply resend
  const elapsed = Number(data.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return Response.json({ error: 'That was very quick. Please check your message and send it again.' }, { status: 429 });
  }

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const company = clean(data.company, 200);
  const message = clean(data.message, 5000);
  const topic = TOPICS.includes(clean(data.topic, 40)) ? clean(data.topic, 40) : 'Other';
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return Response.json({ error: 'Please fill in your name, a valid email and a short message.' }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO?.split(',').map(s => s.trim()).filter(Boolean);
  const from = process.env.CONTACT_FROM;
  if (!key || !to?.length || !from) {
    console.error('[contact] RESEND_API_KEY, CONTACT_TO or CONTACT_FROM is not set; message not sent.');
    return Response.json({ error: 'Our form isn\'t connected yet, so this message wasn\'t sent. Please try again soon.' }, { status: 503 });
  }

  const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');
  const subject = `Website: ${topic} · ${oneLine(name)}${company ? ` (${oneLine(company)})` : ''}`;
  const rows: [string, string][] = [['Topic', topic], ['Name', name], ['Email', email], ['Company', company || '—']];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`;
  const html = `<table cellpadding="4">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>`
    + `<p style="white-space:pre-wrap">${esc(message)}</p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: email, subject, text, html }),
    });
    if (!r.ok) {
      console.error('[contact] Resend error', r.status, await r.text().catch(() => ''));
      return Response.json({ error: 'We couldn\'t send your message just now. Please try again in a minute.' }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error('[contact] network error', e);
    return Response.json({ error: 'We couldn\'t send your message just now. Please try again in a minute.' }, { status: 502 });
  }
}
