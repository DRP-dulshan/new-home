'use client';

import { useState } from 'react';
import { Pause, Play, Star } from 'lucide-react';
import { reviews, trust } from '@/data/homepage';

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className="h-3.5 w-3.5 fill-orange text-orange"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

/**
 * Auto-scrolling review rail. The list is duplicated so the -50% translation
 * loops seamlessly; hovering or the pause control freezes it.
 */
export default function ReviewsCarousel() {
  const [paused, setPaused] = useState(false);
  const items = [...reviews, ...reviews];

  return (
    <div className="mt-16 sm:mt-20">
      <div className="container-drp flex flex-wrap items-center justify-between gap-4">
        {/* DEMO PLACEHOLDER — confirm the real Google rating before launch */}
        <p className="text-[11px] font-light uppercase tracking-eyebrow text-white/50">
          {trust.ratingLine}
        </p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[10px] font-medium uppercase tracking-eyebrow text-white/60 transition-colors duration-300 hover:border-white/50 hover:text-white"
        >
          {paused ? (
            <Play className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Pause className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
          )}
          {paused ? 'Play reviews' : 'Pause reviews'}
        </button>
      </div>

      <div
        className="marquee-mask group mt-8 overflow-hidden"
        role="region"
        aria-label="Client reviews"
      >
        <div
          className={`flex w-max animate-marquee-slow group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
            paused ? '[animation-play-state:paused]' : ''
          }`}
        >
          {items.map((review, i) => (
            <figure
              key={`${review.id}-${i}`}
              aria-hidden={i >= reviews.length ? 'true' : undefined}
              className="mx-3 flex w-[78vw] shrink-0 flex-col justify-between border border-white/10 bg-white/[0.03] p-7 sm:mx-4 sm:w-[24rem] sm:p-8"
            >
              <Stars count={review.stars} />
              <blockquote className="mt-5 font-serif text-lg font-light italic leading-relaxed text-white/85 sm:text-xl">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-4">
                <p className="text-sm font-light text-white">{review.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-eyebrow text-white/40">
                  {review.source}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
