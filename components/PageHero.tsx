import type { ReactNode } from 'react';
import Image from 'next/image';
import Reveal from './ui/Reveal';

type Props = {
  eyebrow: string;
  /** A "\n" forces a line break and lifts the default width cap. */
  heading: string;
  intro?: string;
  subline?: string;
  image: string;
  imageAlt: string;
  /** CSS object-position, e.g. "50% 20%" to keep a sign near the top in frame */
  imagePosition?: string;
  /** Starts the photo below the solid header, for photos whose subject sits at the very top */
  clearHeader?: boolean;
  /** `short` (~60vh) for most inner pages; `tall` for photo-led pages. */
  size?: 'short' | 'tall';
  /** Rendered under the copy, e.g. a brand lockup. */
  children?: ReactNode;
};

/**
 * Photographic hero for inner pages. One image, a dark overlay and the
 * eyebrow + serif heading pattern used site-wide.
 */
export default function PageHero({
  eyebrow,
  heading,
  intro,
  subline,
  image,
  imageAlt,
  imagePosition,
  clearHeader = false,
  size = 'short',
  children,
}: Props) {
  const lines = heading.split('\n');

  return (
    <section
      aria-labelledby="page-heading"
      className={`relative flex items-end overflow-hidden bg-ink ${
        size === 'tall' ? 'min-h-[85svh] lg:min-h-[92svh]' : 'min-h-[60svh]'
      }`}
    >
      <div className={`absolute inset-x-0 bottom-0 ${clearHeader ? 'top-16 lg:top-[72px]' : 'top-0'}`}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-ink/55" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent"
      />

      <div className="container-drp relative z-10 pb-14 pt-32 sm:pb-20 sm:pt-40 lg:pb-24">
        <Reveal>
          <p className="eyebrow text-orange">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="page-heading"
            className={`heading-display mt-5 text-[clamp(2.4rem,6vw,4.75rem)] text-white ${
              lines.length > 1 ? '' : 'max-w-[16ch]'
            }`}
          >
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
        </Reveal>
        {intro ? (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-[15px] font-light leading-relaxed text-white/75 sm:text-base">
              {intro}
            </p>
          </Reveal>
        ) : null}
        {subline ? (
          <Reveal delay={0.24}>
            <p className="mt-5 max-w-2xl border-l border-orange pl-4 text-sm font-light leading-relaxed text-white/60">
              {subline}
            </p>
          </Reveal>
        ) : null}
        {children ? <Reveal delay={0.3}>{children}</Reveal> : null}
      </div>
    </section>
  );
}
