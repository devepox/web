'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { BtnLabel } from '@/components/ui/primitives';
import { services } from '@/lib/content';
import { getLenis } from '@/lib/motion';

type Panel = 'services' | 'company' | null;

const company = [
  { href: '/how-we-work', title: 'How we work', text: 'Fixed project, dedicated developers or a monthly retainer.' },
  { href: '/about', title: 'About', text: 'A software house from Faisalabad, building since 2019.' },
  { href: '/contact', title: 'Contact', text: 'Tell us the problem. We\'ll tell you how we\'d fix it.' },
];

/**
 * Header (L2 + L3): morphing mega-menu on desktop (one panel resizes between Services and Company),
 * full-screen sheet on mobile, hide-on-scroll-down, frosted when stuck. Theme follows the section below:
 * Black by default, light over Paper bands (.soft / .paper). The header carries data-theme, so tokens do the rest.
 */
export function Header() {
  const pathname = usePathname();
  const [panel, setPanel] = useState<Panel>(null);
  const [svc, setSvc] = useState(0); // service previewed in the mega-menu
  const [sheet, setSheet] = useState(false);
  const [sheetTone, setSheetTone] = useState(false); // lags the close by half the 900 ms sweep so the logo flips as the panel leaves
  if (sheet && !sheetTone) setSheetTone(true);
  useEffect(() => { if (sheet) return; const t = window.setTimeout(() => setSheetTone(false), 450); return () => window.clearTimeout(t); }, [sheet]);
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tone, setTone] = useState<'light' | 'dark'>('dark');
  const megaRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const readRef = useRef<HTMLDivElement>(null);
  const reading = pathname !== '/' && pathname !== '/contact'; // long pages only
  const workRef = useRef<HTMLAnchorElement>(null);
  const servicesPanelRef = useRef<HTMLDivElement>(null);
  const companyPanelRef = useRef<HTMLDivElement>(null);
  const panelRefs = { services: servicesPanelRef, company: companyPanelRef };
  const triggerRefs = { services: useRef<HTMLButtonElement>(null), company: useRef<HTMLButtonElement>(null) };
  const closeTimer = useRef<number>(0);
  const lastY = useRef(0);

  // close menus on navigation (state reset while rendering, not in an effect)
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) { setSeenPath(pathname); setPanel(null); setSheet(false); }

  // stuck / hide on scroll / tone from the section under the header
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 8);
      setHidden(y > 240 && y > lastY.current && !panel && !sheet);
      lastY.current = y;
      // probe the page *under* the fixed header: Black is the default ground, Paper bands switch the header to light
      const probe = document.elementsFromPoint(window.innerWidth / 2, 40).find(el => !headerRef.current?.contains(el));
      setTone(probe?.closest('.soft, .paper, [data-theme="light"]') ? 'light' : 'dark');
      // reading progress (written straight to the DOM, no re-render per scroll frame)
      const max = document.documentElement.scrollHeight - window.innerHeight;
      readRef.current?.style.setProperty('--read', max > 0 ? (y / max).toFixed(4) : '0');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [panel, sheet, pathname]);

  // morph: size the shared panel to the active content + align under its trigger
  useLayoutEffect(() => {
    if (!panel || !megaRef.current) return;
    const content = panelRefs[panel].current; const trigger = triggerRefs[panel].current;
    if (!content || !trigger) return;
    const nav = megaRef.current.parentElement!;
    megaRef.current.style.setProperty('--mega-w', `${content.offsetWidth}px`);
    megaRef.current.style.setProperty('--mega-h', `${content.offsetHeight}px`);
    const left = Math.max(0, Math.min(trigger.offsetLeft - 12, nav.offsetWidth - content.offsetWidth));
    megaRef.current.style.left = `${left}px`;
  });

  // lock scroll when sheet is open
  useEffect(() => {
    const l = getLenis();
    if (sheet) {
      document.body.style.overflow = 'hidden'; l?.stop();
      window.setTimeout(() => document.querySelector<HTMLAnchorElement>('#sheet a')?.focus({ preventScroll: true }), 60);
    } else { document.body.style.overflow = ''; l?.start(); }
  }, [sheet]);

  // Esc closes everything
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (panel) { triggerRefs[panel].current?.focus(); setPanel(null); }
    setSheet(false);
  }, [panel]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onKey]);

  const open = (p: Panel) => { window.clearTimeout(closeTimer.current); setPanel(p); };
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setPanel(null), 140); };
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
    {reading && <div ref={readRef} className="read-bar" data-theme={sheetTone ? 'dark' : tone} aria-hidden />}
    <header ref={headerRef} className="site-header" data-stuck={stuck} data-hidden={hidden} data-sheet={sheetTone} data-theme={sheetTone ? 'dark' : tone}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 btn">Skip to content</a>
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        {/* foil on Black, plain ink on Paper (brand rule: foil never on a light ground) */}
        <Link href="/" aria-label="epox home" className="relative z-[61] -m-2 p-2"><Logo className="h-[26px] w-auto" foil={sheetTone || tone === 'dark'} /></Link>

        <nav aria-label="Main" className="relative hidden items-center gap-1 lg:flex" onMouseLeave={scheduleClose}>
          {(['services', 'company'] as const).map(p => (
            <button key={p} ref={triggerRefs[p]} type="button" className="nav-link" aria-expanded={panel === p} aria-controls="mega"
              onMouseEnter={() => open(p)} onFocus={() => open(p)}
              onClick={() => open(p)}
              onKeyDown={(e) => {
                // Tab / ArrowDown on an open trigger moves into its panel
                if ((e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) && panel === p) {
                  const first = panelRefs[p].current?.querySelector<HTMLAnchorElement>('a');
                  if (first) { e.preventDefault(); first.focus(); }
                }
              }}>
              {p === 'services' ? 'Services' : 'Company'}<ChevronDown className="icon" strokeWidth={1.9} aria-hidden />
            </button>
          ))}
          <Link ref={workRef} href="/work" className="nav-link" aria-current={isActive('/work') ? 'page' : undefined} onMouseEnter={scheduleClose}>Work</Link>

          <div id="mega" ref={megaRef} className="mega" data-open={panel !== null} onMouseEnter={() => open(panel)} onMouseLeave={scheduleClose}
            onKeyDown={(e) => {
              // keyboard inside the panel: Tab past the last link → next nav item; Shift+Tab on first → its trigger
              if (e.key !== 'Tab' || !panel) return;
              const links = Array.from(panelRefs[panel].current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
              const i = links.indexOf(document.activeElement as HTMLAnchorElement);
              if (e.shiftKey && i === 0) { e.preventDefault(); triggerRefs[panel].current?.focus(); }
              if (!e.shiftKey && i === links.length - 1) {
                e.preventDefault();
                const next = panel === 'services' ? triggerRefs.company.current : workRef.current;
                setPanel(null); next?.focus();
              }
            }}>
            {/* Services: a typographic index (foil bar marks the active area) + the area's big foil number and promise */}
            <div ref={servicesPanelRef} className="mega-panel w-[760px]" data-active={panel === 'services'} aria-hidden={panel !== 'services'}>
              <div className="grid grid-cols-[minmax(300px,1fr)_340px] gap-6">
                <div className="mega-index py-2" style={{ '--row': svc, '--row-h': '46px' } as CSSProperties}>
                  <span className="mega-marker" aria-hidden />
                  <ul>
                    {services.map((s, i) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="mega-row" data-on={svc === i} tabIndex={panel === 'services' ? 0 : -1}
                          onMouseEnter={() => setSvc(i)} onFocus={() => setSvc(i)}>{s.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mega-preview" data-theme="dark">
                  <div key={svc} className="mega-preview-in" aria-hidden>
                    <p className="mega-num foil-text">{services[svc].n}</p>
                    <p className="mt-6 t-lead" style={{ maxWidth: '24ch' }}>{services[svc].promise}</p>
                  </div>
                  <div className="mt-auto flex flex-col gap-1">
                    <Link href={`/services/${services[svc].slug}`} className="arrow-link" tabIndex={-1} aria-hidden><span>Explore {services[svc].title}</span><ArrowRight className="icon" strokeWidth={1.9} /></Link>
                    <Link href="/services" className="arrow-link muted" tabIndex={panel === 'services' ? 0 : -1}><span>All services</span><ArrowRight className="icon" strokeWidth={1.9} aria-hidden /></Link>
                  </div>
                </div>
              </div>
            </div>
            <div ref={companyPanelRef} className="mega-panel w-[420px]" data-active={panel === 'company'} aria-hidden={panel !== 'company'}>
              <ul className="grid gap-1">
                {company.map(c => (
                  <li key={c.href}>
                    <Link href={c.href} className="mega-item" tabIndex={panel === 'company' ? 0 : -1}>
                      <span className="font-medium">{c.title}</span>
                      <span className="t-small" style={{ color: 'var(--muted)' }}>{c.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn hidden sm:inline-flex"><BtnLabel>Let&apos;s talk</BtnLabel></Link>
          <button type="button" className="nav-link relative z-[61] lg:hidden" aria-expanded={sheet} aria-controls="sheet" aria-label={sheet ? 'Close menu' : 'Open menu'} onClick={() => setSheet(!sheet)}>
            {sheet ? <X className="h-6 w-6" strokeWidth={1.9} aria-hidden /> : <Menu className="h-6 w-6" strokeWidth={1.9} aria-hidden />}
          </button>
        </div>
      </div>

    </header>
      {/* mobile menu: sits outside <header> so the header's backdrop-filter can't clip it; header is z-50 above it */}
      <div id="sheet" className="sheet lg:hidden" data-theme="dark" data-open={sheet} aria-hidden={!sheet} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="container-x flex flex-1 flex-col pt-24 pb-8">
          <p className="t-label sheet-in" style={{ '--i': 0 } as CSSProperties}>Services</p>
          <ul className="mt-4 grid gap-1">
            {services.map((s, i) => (
              <li key={s.slug} className="sheet-in" style={{ '--i': i + 1 } as CSSProperties}><Link href={`/services/${s.slug}`} className="block py-1 text-[1.375rem] font-medium tracking-tight" tabIndex={sheet ? 0 : -1}>{s.title}</Link></li>
            ))}
          </ul>
          <ul className="sheet-rule mt-6 grid gap-0 border-t pt-4">
            {[{ href: '/work', t: 'Work' }, ...company.map(c => ({ href: c.href, t: c.title }))].map((l, i) => (
              <li key={l.href} className="sheet-in" style={{ '--i': services.length + 1 + i } as CSSProperties}><Link href={l.href} className="block py-1.5 text-[1.375rem] font-medium tracking-tight" tabIndex={sheet ? 0 : -1}>{l.t}</Link></li>
            ))}
          </ul>
          <Link href="/contact" className="btn btn-lg btn-accent sheet-in mt-auto self-start" style={{ '--i': services.length + 6 } as CSSProperties} tabIndex={sheet ? 0 : -1}><BtnLabel arrow>Let&apos;s talk</BtnLabel></Link>
        </div>
      </div>
    </>
  );
}
