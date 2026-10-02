import Image from 'next/image';
import Reveal from './ui/Reveal';

type Props = {
  eyebrow: string;
  heading: string;
  intro: string;
  subline?: string;
  image: string;
  imageAlt: string;
};

/**
 * Short (~60vh) photographic hero for the lead-generation pages. One image,
 * a dark overlay and the eyebrow + serif heading pattern used site-wide.
 */
export default function LeadHero({ eyebrow, heading, intro, subline, image, imageAlt }: Props) {
  return (
    <section
      aria-labelledby="page-heading"
      className="relative flex min-h-[60svh] items-end overflow-hidden bg-ink"
    >
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
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
            className="heading-display mt-5 max-w-[16ch] text-[clamp(2.4rem,6vw,4.75rem)] text-white"
          >
            {heading}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-[15px] font-light leading-relaxed text-white/75 sm:text-base">
            {intro}
          </p>
        </Reveal>
        {subline ? (
          <Reveal delay={0.24}>
            <p className="mt-5 max-w-2xl border-l border-orange pl-4 text-sm font-light leading-relaxed text-white/60">
              {subline}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
