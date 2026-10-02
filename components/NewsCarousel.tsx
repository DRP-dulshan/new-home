'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { news } from '@/data/homepage';
import ArrowLink from './ui/ArrowLink';
import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import SmartLink from './ui/SmartLink';

export default function NewsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    containScroll: 'trimSnaps',
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="news" aria-labelledby="news-heading" className="section-y bg-cream">
      <div className="container-drp">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <SectionHeading
            eyebrow={news.eyebrow}
            heading={news.heading}
            headingId="news-heading"
          />

          <Reveal delay={0.12}>
            <div className="flex items-center gap-6 md:pb-3">
              <div className="hidden sm:block">
                <ArrowLink
                  href={news.viewAll.href}
                  label={news.viewAll.label}
                  tone="dark"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={scrollPrev}
                  disabled={!canPrev}
                  aria-label="Previous articles"
                  aria-controls="news-carousel"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-all duration-300 hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-charcoal/20 disabled:hover:text-charcoal"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  disabled={!canNext}
                  aria-label="Next articles"
                  aria-controls="news-carousel"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-all duration-300 hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-charcoal/20 disabled:hover:text-charcoal"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Carousel viewport bleeds to the container edge, then indents like the grid */}
      <Reveal delay={0.16}>
        <div
          id="news-carousel"
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="News and insights"
          className="mt-12 w-full overflow-hidden sm:mt-16"
        >
          <div className="mx-auto flex max-w-container gap-5 px-5 sm:gap-6 sm:px-8 lg:px-12">
            {news.articles.map((article, i) => (
              <article
                key={article.id}
                aria-label={`${i + 1} of ${news.articles.length}`}
                className="group w-[78%] min-w-0 shrink-0 sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
              >
                <SmartLink href={article.href} className="block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
                    <Image
                      src={article.image}
                      alt={article.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 24vw"
                      className="object-cover transition-transform duration-[700ms] ease-premium group-hover:scale-[1.06]"
                    />
                  </div>

                  <p className="mt-5 text-[10px] font-medium uppercase tracking-eyebrow text-orange">
                    {article.category}
                  </p>

                  {/* em-based min-heights reserve exactly two lines at any
                      breakpoint, so the date/Read row stays aligned across cards */}
                  <h3 className="mt-3 line-clamp-2 min-h-[2.75em] font-serif text-xl font-normal leading-snug text-charcoal transition-colors duration-300 group-hover:text-orange sm:text-[1.4rem]">
                    {article.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-[3.25em] text-[13px] font-light leading-relaxed text-charcoal-muted">
                    {article.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <time className="text-[11px] font-light uppercase tracking-wide text-charcoal-muted">
                      {article.date}
                    </time>
                    <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-eyebrow text-charcoal">
                      Read
                      <span
                        aria-hidden="true"
                        className="transition-[transform,color] duration-500 ease-premium group-hover:translate-x-1.5 group-hover:text-orange"
                      >
                        &rarr;
                      </span>
                    </span>
                  </div>
                </SmartLink>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      {/* View-all falls below the rail on small screens */}
      <div className="container-drp mt-10 sm:hidden">
        <ArrowLink href={news.viewAll.href} label={news.viewAll.label} tone="dark" />
      </div>
    </section>
  );
}
