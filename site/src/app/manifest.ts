import type { MetadataRoute } from 'next';

/** Web app manifest: brand app icons (Ice Mint brand system, App icons group) on the brand-black ground. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'epox: software house',
    short_name: 'epox',
    description: 'epox builds web, mobile and AI software, and finds the problem before you do.',
    start_url: '/',
    display: 'browser',
    background_color: '#0B0C0F',
    theme_color: '#0B0C0F',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
