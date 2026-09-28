'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { hero } from '@/data/homepage';
import HeroSearch from './HeroSearch';
import PartnerMarquee from './PartnerMarquee';
import SmartLink from './ui/SmartLink';

export default function Hero() {
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  /* Mount the iframe after first paint so the poster and copy render first. */
  const [mountVideo, setMountVideo] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => setMountVideo(true), 300);
    return () => window.clearTimeout(id);
  }, [reduce]);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-[100dvh] flex-col bg-ink lg:min-h-screen"
    >
      {/* ---------- Background: poster underneath, video fading in over it ---------- */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={hero.posterImage}
          alt={hero.posterAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {mountVideo ? (
          <iframe
            src={hero.videoSrc}
            title="Dubai Rapid Properties showreel"
            aria-hidden="true"
            tabIndex={-1}
            allow="autoplay; fullscreen"
            onLoad={() => setVideoReady(true)}
            /* 16:9 cover trick — always overflow the shorter axis */
            className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78dvh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}
      </div>

      {/* ---------- Overlays: heavier at the bottom and along the left edge ----------
           The bottom scrim is a separate layer so the copy, quick links and
           partner strip stay legible over bright frames of the video without
           flattening the top of the picture. */}
      <div aria-hidden="true" className="absolute inset-0 bg-ink/25" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-ink/95 via-ink/60 to-transparent"
      />

      {/* ---------- Content ---------- */}
      <div className="relative z-20 flex flex-1 items-end pb-6 pt-24 sm:pb-14 sm:pt-32 lg:pb-20">
        <div className="container-drp">
          <motion.p {...rise(0.15)} className="eyebrow text-white/70">
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...rise(0.28)}
            className="heading-display mt-4 max-w-[16ch] text-[clamp(2.35rem,7vw,5.6rem)] text-white sm:mt-6"
          >
            {hero.heading}
          </motion.h1>

          <motion.p
            {...rise(0.42)}
            className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/75 sm:mt-6 sm:text-base"
          >
            {hero.paragraph}
          </motion.p>

          {/* Search — offering tabs above a white bar with a separate CTA */}
          <motion.div {...rise(0.52)} className="mt-5 sm:mt-8">
            <HeroSearch />
          </motion.div>

          {/* Quick links — one arrow per link, always inside its own <a>,
              immediately after its own label. No separators of any kind. */}
          <motion.nav
            {...rise(0.66)}
            aria-label="Hero quick links"
            className="mt-10 mb-12"
          >
            <ul className="flex flex-wrap items-center gap-x-14 gap-y-5">
              {hero.quickLinks.map((link) => (
                <li key={link.href}>
                  <SmartLink
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-white"
                  >
                    <span className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full group-focus-visible:after:w-full">
                      {link.label}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={2}
                      className="h-[14px] w-[14px] shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange group-focus-visible:translate-x-1 group-focus-visible:text-orange"
                    />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>
      </div>

      {/* ---------- Partner strip, pinned to the bottom of the first screen ---------- */}
      <motion.div {...rise(0.88)} className="relative z-10 mt-auto">
        <PartnerMarquee />
      </motion.div>
    </section>
  );
}
