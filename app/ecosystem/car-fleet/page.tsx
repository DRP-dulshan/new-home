import Image from 'next/image';
import { MessageCircle, Phone } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PageHero from '@/components/PageHero';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import SmartLink from '@/components/ui/SmartLink';
import { carFleet as page } from '@/data/carFleet';
import { contact, site } from '@/data/homepage';

export const metadata = { title: page.metaTitle };

export default function Page() {
  const whatsappHref = `${contact.whatsappHref}?text=${encodeURIComponent(page.cta.whatsappText)}`;

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

        {/* ---------- Single CTA ---------- */}
        <section aria-labelledby="fleet-cta-heading" className="section-y bg-ink text-white">
          <div className="container-drp flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-orange">{page.cta.eyebrow}</p>
              <h2
                id="fleet-cta-heading"
                className="heading-display mt-5 text-[clamp(2rem,4.6vw,3.75rem)] text-white"
              >
                {page.cta.heading}
              </h2>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <SmartLink
                href={page.cta.href}
                className="group inline-flex h-14 items-center justify-center gap-3 bg-orange px-10 text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors duration-300 hover:bg-orange-600"
              >
                {page.cta.label}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5"
                >
                  &rarr;
                </span>
              </SmartLink>
              <ul className="flex flex-col gap-3 text-sm font-light sm:gap-2">
                <li>
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 hover:text-orange"
                  >
                    <Phone aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 hover:text-orange"
                  >
                    <MessageCircle aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
                    WhatsApp {contact.whatsapp}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
