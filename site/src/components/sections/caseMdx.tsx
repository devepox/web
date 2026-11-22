import type { ReactNode } from 'react';
import { AssetPlaceholder, Ph } from '@/components/ui/primitives';
import { RiseText } from '@/components/motion/RiseText';

/**
 * Building blocks available inside case study MDX files (content/work/*.mdx).
 *  <Chapter n="01" title="What we found"> markdown </Chapter>  numbered chapter: title left, story right
 *  <Media asset="…" />                                          full-width visual placeholder / image, wipes in (H15)
 *  <Ph>[PLACEHOLDER: …]</Ph>                                    marked content gap
 */
export function Chapter({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="section grid gap-8 border-t border-line lg:grid-cols-12 lg:gap-[var(--gutter)]" aria-label={title}>
      <div className="lg:col-span-4">
        <p className="t-label muted t-num">{n}</p>
        <RiseText as="h2" className="t-h2 mt-4" style={{ maxWidth: '12ch' }} parts={[title]} />
      </div>
      <div className="case-body t-lead lg:col-span-7 lg:col-start-6" data-reveal>{children}</div>
    </section>
  );
}

export function Media({ asset, ratio = '16 / 9' }: { asset: string; ratio?: string }) {
  return (
    <div className="mb-[var(--section-y)] overflow-hidden rounded-[var(--r-card)]" data-unveil>
      <AssetPlaceholder name={asset} ratio={ratio} />
    </div>
  );
}

export const caseMdxComponents = { Chapter, Media, Ph };
