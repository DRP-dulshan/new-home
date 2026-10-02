import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';

export type Feature = { title: string; text: string };

type Props = {
  eyebrow: string;
  heading: string;
  intro?: string;
  items: Feature[];
  columns?: 2 | 3;
  tone?: 'white' | 'cream';
  id?: string;
};

const colClass = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 lg:grid-cols-3' } as const;

/** Title + short text in a grid of hairline-topped cells. No icons, no boxes. */
export default function FeatureGrid({
  eyebrow,
  heading,
  intro,
  items,
  columns = 3,
  tone = 'white',
  id,
}: Props) {
  const headingId = `${id ?? 'features'}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section-y ${tone === 'cream' ? 'bg-cream' : 'bg-white'}`}
    >
      <div className="container-drp">
        <SectionHeading eyebrow={eyebrow} heading={heading} headingId={headingId} intro={intro} />
        <ul className={`mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:mt-16 ${colClass[columns]}`}>
          {items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={(i % 3) * 0.08} className="border-t border-line pt-6">
              <h3 className="font-serif text-[1.5rem] font-light leading-snug text-charcoal">
                {item.title}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-charcoal-muted sm:text-[15px]">
                {item.text}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
