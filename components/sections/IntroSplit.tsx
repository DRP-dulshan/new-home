import Reveal from '../ui/Reveal';

type Props = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  tone?: 'white' | 'cream';
  id?: string;
};

/** Eyebrow + serif heading on the left, body copy on the right. */
export default function IntroSplit({ eyebrow, heading, paragraphs, tone = 'white', id }: Props) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section-y ${tone === 'cream' ? 'bg-cream' : 'bg-white'}`}
    >
      <div className="container-drp grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-orange">{eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              id={headingId}
              className="heading-display mt-5 text-[clamp(2rem,4vw,3.25rem)] text-charcoal"
            >
              {heading}
            </h2>
          </Reveal>
        </div>
        <div className="space-y-5 lg:col-span-7 lg:pt-10">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <p className="text-[15px] font-light leading-relaxed text-charcoal-light sm:text-base">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
