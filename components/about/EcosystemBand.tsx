import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { about } from '@/data/company';
import { site } from '@/data/homepage';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import SmartLink from '../ui/SmartLink';

/**
 * The DRP mark with a single line dropping into a rail that branches into the
 * six services — one team, connected. Connectors show from `lg` up; below
 * that the tiles sit in a plain grid under the mark.
 */
export default function EcosystemBand() {
  const { eyebrow, heading, services } = about.ecosystem;
  const last = services.length - 1;

  return (
    <section aria-labelledby="ecosystem-heading" className="section-y bg-cream">
      <div className="container-drp">
        <SectionHeading eyebrow={eyebrow} heading={heading} headingId="ecosystem-heading" align="center" />

        {/* Hub */}
        <div className="mt-12 flex flex-col items-center sm:mt-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink shadow-[0_12px_40px_-12px_rgba(26,26,26,0.45)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logos.white} alt={`${site.name} logo`} className="h-7 w-12 object-contain" />
          </div>
          <span aria-hidden="true" className="h-8 w-px bg-orange lg:h-10" />
        </div>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {services.map((s, i) => {
            const external = /^https?:\/\//.test(s.href);
            /* Rail segment above each tile: from the first tile's centre to the last's */
            const rail =
              i === 0 ? 'lg:after:left-1/2 lg:after:-right-3' : i === last ? 'lg:after:left-0 lg:after:right-1/2' : 'lg:after:left-0 lg:after:-right-3';
            return (
              <Reveal
                as="li"
                key={s.name}
                delay={i * 0.06}
                className={`relative lg:pt-8 lg:before:absolute lg:before:left-1/2 lg:before:top-0 lg:before:h-8 lg:before:w-px lg:before:bg-orange lg:after:absolute lg:after:top-0 lg:after:h-px lg:after:bg-orange ${rail}`}
              >
                <SmartLink
                  href={s.href}
                  className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden bg-ink p-5"
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.08]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5 transition-opacity duration-500 group-hover:opacity-90" />
                  <span className="relative text-[11px] font-medium tracking-eyebrow text-orange">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative mt-2 flex items-end justify-between gap-3">
                    <span className="font-serif text-[1.3rem] leading-tight text-white sm:text-[1.45rem]">{s.name}</span>
                    {external ? (
                      <>
                        <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="mb-1 h-4 w-4 shrink-0 text-white/80" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </>
                    ) : (
                      <span aria-hidden="true" className="mb-0.5 text-white/80 transition-transform duration-500 ease-premium group-hover:translate-x-1">
                        &rarr;
                      </span>
                    )}
                  </span>
                </SmartLink>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
