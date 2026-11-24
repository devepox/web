'use client';
import { useEffect, useState } from 'react';
import { Live } from '@/components/ui/primitives';

const TZ = 'Asia/Karachi'; // Faisalabad, UTC+5 (no daylight saving)

/**
 * Live time in Faisalabad + the gap to the visitor's own time zone (timezone proof for offshore buyers).
 * Server render shows a dash placeholder of the same width (no layout shift); the client fills it in.
 */
export function LocalClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const first = window.setTimeout(() => setNow(new Date()), 0);
    const t = window.setInterval(() => setNow(new Date()), 20_000);
    return () => { window.clearTimeout(first); window.clearInterval(t); };
  }, []);

  const time = now ? new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(now) : '--:--';
  let gap = '';
  if (now) {
    const theirs = -now.getTimezoneOffset() / 60; // visitor offset in hours
    const diff = 5 - theirs;
    gap = diff === 0 ? 'Same time as you' : `${Math.abs(diff)} hour${Math.abs(diff) === 1 ? '' : 's'} ${diff > 0 ? 'ahead of' : 'behind'} you`;
  }

  return (
    <div className="grid gap-3">
      <Live>Faisalabad now</Live>
      <p className="t-num" style={{ font: '500 clamp(4rem, 2.6rem + 5vw, 8rem)/0.95 var(--font-display)', letterSpacing: 'var(--tr-h1)' }}>
        <time dateTime={now?.toISOString()}>{time}</time>
      </p>
      <p className="t-label muted min-h-[1.3em]" aria-live="off">{gap ? `UTC+5 · ${gap}` : 'UTC+5'}</p>
    </div>
  );
}
