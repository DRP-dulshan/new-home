'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { latestLaunches } from '@/data/offPlan';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from './ProjectCard';

const arrowClass =
  'flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-all duration-300 hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-charcoal/20 disabled:hover:text-charcoal';

/** Horizontal rail of the newest off-plan launches. Anchored from the nav. */
export default function LatestLaunches() {
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

  return (
    <section
      id="latest-launches"
      aria-labelledby="launches-heading"
      className="section-y overflow-hidden bg-white"
    >
      <div className="container-drp">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <SectionHeading
            eyebrow="Latest Launches"
            heading="New to the Market"
            headingId="launches-heading"
          />
          <Reveal delay={0.12}>
            <div className="flex items-center gap-3 md:pb-3">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Previous launches"
                aria-controls="launches-carousel"
                className={arrowClass}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                aria-label="Next launches"
                aria-controls="launches-carousel"
                className={arrowClass}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.16}>
        <div
          id="launches-carousel"
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Latest off-plan launches"
          className="mt-12 w-full overflow-hidden sm:mt-16"
        >
          <div className="mx-auto flex max-w-container gap-5 px-5 sm:gap-6 sm:px-8 lg:px-12">
            {latestLaunches.map((project, i) => (
              <div
                key={project.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${latestLaunches.length}`}
                className="w-[82%] min-w-0 shrink-0 sm:w-[46%] lg:w-[31.5%]"
              >
                <ProjectCard
                  project={project}
                  isNew
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 32vw"
                />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
