import type { Package } from '@/data/services';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';

type Props = {
  eyebrow: string;
  heading: string;
  intro?: string;
  packages: Package[];
  note?: string;
  /** Where each card's button scrolls to. */
  ctaHref?: string;
  ctaLabel?: string;
  tone?: 'white' | 'cream';
};

/** Two or three side-by-side packages; the featured one is inverted. */
export default function PackageCards({
  eyebrow,
  heading,
  intro,
  packages,
  note,
  ctaHref = '#enquire',
  ctaLabel = 'Enquire',
  tone = 'white',
}: Props) {
  return (
    <section aria-labelledby="packages-heading" className={`section-y ${tone === 'cream' ? 'bg-cream' : 'bg-white'}`}>
      <div className="container-drp">
        <SectionHeading eyebrow={eyebrow} heading={heading} headingId="packages-heading" intro={intro} />
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-3">
          {packages.map((p, i) => {
            const dark = p.featured;
            return (
              <Reveal
                as="li"
                key={p.name}
                delay={i * 0.08}
                className={`flex flex-col p-8 sm:p-10 ${dark ? 'bg-ink text-white' : 'border border-line bg-white'}`}
              >
                {dark ? (
                  <span className="mb-6 self-start bg-orange px-3 py-1.5 text-[10px] font-medium uppercase tracking-eyebrow text-white">
                    Most chosen
                  </span>
                ) : null}
                <h3 className={`font-serif text-[1.9rem] font-light ${dark ? 'text-white' : 'text-charcoal'}`}>{p.name}</h3>
                <p className={`mt-2 text-[13px] ${dark ? 'text-orange-400' : 'text-orange'}`}>{p.price}</p>
                <p className={`mt-5 text-[15px] font-light leading-relaxed ${dark ? 'text-white/70' : 'text-charcoal-muted'}`}>
                  {p.description}
                </p>
                <ul className={`mt-8 flex-1 border-t ${dark ? 'border-white/15' : 'border-line'}`}>
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-baseline gap-3 border-b py-3.5 text-[14px] font-light ${
                        dark ? 'border-white/10 text-white/85' : 'border-line text-charcoal'
                      }`}
                    >
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full bg-orange" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={ctaHref}
                  className={`mt-8 inline-flex h-12 items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-eyebrow transition-colors duration-300 ${
                    dark ? 'bg-orange text-white hover:bg-orange-600' : 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                  }`}
                >
                  {ctaLabel}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </Reveal>
            );
          })}
        </ul>
        {note ? <p className="mt-8 text-xs font-light text-charcoal-muted/80">{note}</p> : null}
      </div>
    </section>
  );
}
