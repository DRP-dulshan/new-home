import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';

export type Step = { title: string; text: string };

type Props = {
  eyebrow: string;
  heading: string;
  intro?: string;
  steps: Step[];
  tone?: 'white' | 'cream' | 'dark';
  id?: string;
};

/** Numbered steps across a hairline, four up on desktop. */
export default function ProcessSteps({ eyebrow, heading, intro, steps, tone = 'cream', id }: Props) {
  const dark = tone === 'dark';
  const headingId = `${id ?? 'process'}-heading`;
  const cols = steps.length % 3 === 0 && steps.length !== 6 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section-y ${dark ? 'bg-ink text-white' : tone === 'cream' ? 'bg-cream' : 'bg-white'}`}
    >
      <div className="container-drp">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          headingId={headingId}
          intro={intro}
          tone={dark ? 'light' : 'dark'}
        />
        <ol className={`mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-16 sm:grid-cols-2 ${cols}`}>
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={(i % 4) * 0.08}
              className={`border-t pt-6 ${dark ? 'border-white/15' : 'border-line'}`}
            >
              <span className="text-[11px] font-medium tracking-eyebrow text-orange">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3
                className={`mt-4 font-serif text-[1.55rem] font-light leading-snug ${
                  dark ? 'text-white' : 'text-charcoal'
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`mt-3 text-sm font-light leading-relaxed ${
                  dark ? 'text-white/60' : 'text-charcoal-muted'
                }`}
              >
                {step.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
