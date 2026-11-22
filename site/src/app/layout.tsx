import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BrandDefs } from '@/components/brand/FoilBars';
import { MotionProvider, motionBootScript } from '@/components/motion/MotionProvider';
import { PageWipe } from '@/components/motion/PageWipe';
import { company } from '@/lib/content';

// Ice Mint brand fonts, self-hosted from the brand system's files (app/fonts). Both families are in the hero
// (headline, lead, labels, buttons), so the faces used there are preloaded to avoid layout shift on swap.
const spaceGrotesk = localFont({
  src: [
    { path: './fonts/space-grotesk-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './fonts/space-grotesk-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-space-grotesk', display: 'swap', preload: true, fallback: ['system-ui', 'sans-serif'],
});
const inter = localFont({
  src: [
    { path: './fonts/inter-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/inter-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/inter-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/inter-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter', display: 'swap', preload: true, fallback: ['system-ui', 'sans-serif'],
});

// Font switch: NEXT_PUBLIC_FONT_SET=licensed uses the local Helvetica Now files (public/fonts/licensed, git-ignored).
const FONT_SET = process.env.NEXT_PUBLIC_FONT_SET === 'licensed' ? 'licensed' : 'free';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')),
  title: { default: 'epox: software house in Faisalabad', template: '%s · epox' },
  description: 'epox builds web, mobile and AI software, and finds the problem before you do. Building since 2019.',
  // default link preview (pages without their own, e.g. privacy); every main page sets its own through lib/og.ts
  openGraph: { siteName: 'epox', type: 'website', locale: 'en', images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'epox: we find the problem before you do' }] },
  twitter: { card: 'summary_large_image', images: ['/og/home.jpg'] },
};

/** Structured data for search engines: who we are, where, and how to reach us. */
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'epox',
  description: 'Software house building web, mobile and AI software since 2019.',
  url: 'https://epox.systems',
  logo: 'https://epox.systems/icons/icon-512.png',
  email: company.email,
  telephone: company.phone,
  foundingDate: String(company.founded),
  address: { '@type': 'PostalAddress', streetAddress: company.street, addressLocality: company.city, addressCountry: 'PK' },
};

export const viewport: Viewport = { themeColor: '#0B0C0F', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-fonts={FONT_SET} className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <Script id="motion-boot" strategy="beforeInteractive">{motionBootScript}</Script>
        {FONT_SET === 'licensed' && <link rel="preload" href="/fonts/licensed/HelveticaNowDisplay-Medium.woff2" as="font" type="font/woff2" crossOrigin="" />}
      </head>
      <body>
        <BrandDefs />
        <MotionProvider />
        <PageWipe />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
