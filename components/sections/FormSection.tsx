import type { LeadFormConfig } from '@/data/leadPages';
import { contact } from '@/data/homepage';
import LeadForm from '../LeadForm';
import Reveal from '../ui/Reveal';

type Props = {
  id?: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  points?: string[];
  config: LeadFormConfig;
  /** Extra fields sent with the submission, e.g. the listing reference. */
  context?: Record<string, string>;
  tone?: 'white' | 'cream';
};

/** Copy and direct contact details on the left, the multi-step form on the right. */
export default function FormSection({
  id = 'enquire',
  eyebrow,
  heading,
  intro,
  points,
  config,
  context,
  tone = 'cream',
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`section-y scroll-mt-20 ${tone === 'cream' ? 'bg-cream' : 'bg-white'}`}
    >
      <div className="container-drp grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-orange">{eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              id={`${id}-heading`}
              className="heading-display mt-5 max-w-[16ch] text-[clamp(2rem,4vw,3.25rem)] text-charcoal"
            >
              {heading}
            </h2>
          </Reveal>
          {intro ? (
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-charcoal-muted">
                {intro}
              </p>
            </Reveal>
          ) : null}
          {points?.length ? (
            <ol className="mt-8 border-t border-line">
              {points.map((point, i) => (
                <li key={point} className="flex items-baseline gap-6 border-b border-line py-4">
                  <span className="w-6 shrink-0 text-[11px] font-medium tracking-eyebrow text-orange">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] font-light text-charcoal">{point}</span>
                </li>
              ))}
            </ol>
          ) : null}
          <dl className="mt-10 grid grid-cols-2 gap-6 text-sm font-light">
            <div>
              <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal-muted">Call</dt>
              <dd className="mt-1.5">
                <a href={contact.phoneHref} className="text-charcoal hover:text-orange">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal-muted">WhatsApp</dt>
              <dd className="mt-1.5">
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal hover:text-orange"
                >
                  {contact.whatsapp}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          <LeadForm config={config} context={context} density="medium" />
        </Reveal>
      </div>
    </section>
  );
}
