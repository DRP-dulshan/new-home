import Image from 'next/image';
import ArrowLink from '../ui/ArrowLink';
import Reveal from '../ui/Reveal';

type Props = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  link?: { label: string; href: string };
  /** Image on the right instead of the left. */
  reverse?: boolean;
  tone?: 'white' | 'cream';
  bullets?: string[];
};

/** One photograph beside a short block of copy. */
export default function ImageText({
  eyebrow,
  heading,
  paragraphs,
  image,
  imageAlt,
  link,
  reverse,
  tone = 'white',
  bullets,
}: Props) {
  return (
    <section className={`section-y ${tone === 'cream' ? 'bg-cream' : 'bg-white'}`}>
      <div className="container-drp grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal className={reverse ? 'lg:order-2' : ''}>
          <div className="relative aspect-[4/3] overflow-hidden bg-line lg:aspect-[5/6]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow text-orange">{eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="heading-display mt-5 text-[clamp(2rem,4vw,3.25rem)] text-charcoal">
              {heading}
            </h2>
          </Reveal>
          <div className="mt-6 space-y-5">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.12 + i * 0.05}>
                <p className="text-[15px] font-light leading-relaxed text-charcoal-light sm:text-base">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          {bullets?.length ? (
            <ul className="mt-8 border-t border-line">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-baseline gap-4 border-b border-line py-4 text-[15px] font-light text-charcoal"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-orange" />
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
          {link ? (
            <div className="mt-10">
              <ArrowLink href={link.href} label={link.label} tone="dark" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
