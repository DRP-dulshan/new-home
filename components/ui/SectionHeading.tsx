import Reveal from './Reveal';

type Props = {
  eyebrow: string;
  heading: string;
  /** Wire this to the section's aria-labelledby. */
  headingId?: string;
  intro?: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  heading,
  headingId,
  intro,
  tone = 'dark',
  align = 'left',
  className = '',
}: Props) {
  const isLight = tone === 'light';

  return (
    <div
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}
    >
      <Reveal>
        <p className={`eyebrow ${isLight ? 'text-orange' : 'text-orange'}`}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          id={headingId}
          className={`heading-display mt-5 text-[clamp(2rem,4.6vw,3.75rem)] ${
            isLight ? 'text-white' : 'text-charcoal'
          }`}
        >
          {heading}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.16}>
          <p
            className={`mt-5 max-w-xl text-sm leading-relaxed sm:text-base ${
              align === 'center' ? 'mx-auto' : ''
            } ${isLight ? 'text-white/65' : 'text-charcoal-muted'}`}
          >
            {intro}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
