import Image from 'next/image';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PageHero from '@/components/PageHero';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import CtaBand from '@/components/sections/CtaBand';
import { carFleet as page } from '@/data/carFleet';
import { site } from '@/data/homepage';

export const metadata = { title: page.metaTitle };

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...page.hero} size="tall">
          {/* Brand lockup: reads as a DRP service, not a separate rental business */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-white/15 pt-6 sm:mt-16">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.logos.white}
                alt={`${site.name} logo`}
                className="h-8 w-[60px] object-contain object-left"
              />
              <span aria-hidden="true" className="h-6 w-px bg-white/25" />
              <span className="text-[10px] uppercase tracking-eyebrow text-white/60">
                Part of the DRP Ecosystem
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-eyebrow text-white/45">
              Property · Holiday Homes · Mobility
            </p>
          </div>
        </PageHero>

        {/* ---------- Intro ---------- */}
        <section aria-label="About the DRP car fleet" className="section-y bg-white">
          <div className="container-drp">
            <Reveal>
              <p className="max-w-4xl font-serif text-[clamp(1.4rem,2.6vw,2.1rem)] font-light leading-[1.35] text-charcoal">
                {page.intro}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- Vehicles ---------- */}
        <section aria-labelledby="fleet-heading" className="bg-white pb-[var(--section-y)]">
          <div className="container-drp">
            <SectionHeading
              eyebrow={page.fleet.eyebrow}
              heading={page.fleet.heading}
              headingId="fleet-heading"
            />

            <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:mt-16 md:grid-cols-2 lg:gap-x-10 lg:gap-y-20">
              {page.vehicles.map((v, i) => (
                <Reveal as="li" key={v.id} delay={(i % 2) * 0.08} className="group">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
                    <Image
                      src={v.image}
                      alt={v.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-6 font-serif text-[clamp(1.6rem,2.6vw,2.1rem)] font-light leading-tight text-charcoal">
                    {v.model}
                  </h3>
                  <dl className="mt-5 grid grid-cols-3 divide-x divide-line border-t border-line pt-4">
                    {[
                      ['Seats', String(v.seats)],
                      ['Transmission', v.transmission],
                      ['Type', v.type],
                    ].map(([label, value], j) => (
                      <div key={label} className={j === 0 ? 'pr-4' : 'px-4'}>
                        <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal-muted">
                          {label}
                        </dt>
                        <dd className="mt-1.5 text-[14px] font-light text-charcoal">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <CtaBand
          eyebrow={page.cta.eyebrow}
          heading={page.cta.heading}
          button={{ label: page.cta.label, href: page.cta.href }}
          whatsappText={page.cta.whatsappText}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
