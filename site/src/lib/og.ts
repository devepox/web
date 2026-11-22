import type { Metadata } from 'next';

/**
 * Link-preview metadata (Open Graph + X card) for one page: the card people see when a link to it is pasted into
 * email, LinkedIn, WhatsApp or X. Images are rendered from the live headlines by scripts/og/render.js into public/og
 * (re-run it after changing a hero headline). name = the image file, e.g. "services-mobile-apps".
 */
export function share(name: string, title: string, description: string, path: string): Pick<Metadata, 'openGraph' | 'twitter'> {
  const image = { url: `/og/${name}.jpg`, width: 1200, height: 630, alt: title };
  return {
    openGraph: { type: 'website', siteName: 'epox', locale: 'en', url: path, title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
