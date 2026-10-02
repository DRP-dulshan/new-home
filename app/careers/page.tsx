import { Plus } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import FeatureGrid from '@/components/sections/FeatureGrid';
import FormSection from '@/components/sections/FormSection';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { careers } from '@/data/company';
import { contactStep, type LeadFormConfig } from '@/data/leadPages';

export const metadata = { title: 'Careers | Dubai Rapid Properties' };

const applicationForm: LeadFormConfig = {
  formId: 'careers-application',
  submitLabel: 'Send Application',
  successTitle: 'Thank you for applying.',
  successBody: 'Our team reviews every application and will be in touch if there is a fit. Please email your CV to complete your application.',
  steps: [
    {
      id: 'role',
      label: 'Role',
      question: 'Which role are you applying for?',
      kind: 'choice',
      columns: 2,
      options: [
        ...careers.roles.map((r) => ({ value: r.title, label: r.title })),
        { value: 'General application', label: 'General application' },
      ],
    },
    {
      id: 'experience',
      label: 'Experience',
      question: 'How many years of relevant experience do you have?',
      kind: 'choice',
      columns: 2,
      options: ['Under 2 years', '2 – 5 years', '5 – 10 years', '10+ years'].map((v) => ({ value: v, label: v })),
    },
    contactStep(undefined, {
      question: 'Tell us about yourself',
      helper: 'Add a link to your LinkedIn profile or CV in the message.',
      message: { label: 'A few lines about you, plus your LinkedIn or CV link' },
    }),
  ],
};

export default function Page() {
  return (
    <SiteShell>
      <PageHero {...careers.hero} />
      <FeatureGrid eyebrow="Why DRP" heading="A Better Place to Build a Career" items={careers.why} columns={2} />

      <section aria-labelledby="roles-heading" className="section-y bg-cream">
        <div className="container-drp grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Open Roles"
              heading={`${careers.roles.length} Positions`}
              headingId="roles-heading"
              intro="All roles are based at our Palm Jumeirah office."
            />
          </div>
          <Reveal className="lg:col-span-8">
            <ul className="border-t border-line">
              {careers.roles.map((r) => (
                <li key={r.id} className="border-b border-line">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                      <span>
                        <span className="block text-[10px] uppercase tracking-eyebrow text-orange">{r.department}</span>
                        <span className="mt-2 block font-serif text-[1.4rem] leading-snug text-charcoal sm:text-[1.6rem]">
                          {r.title}
                        </span>
                        <span className="mt-1 block text-[12px] font-light text-charcoal-muted">{r.type}</span>
                      </span>
                      <Plus
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="mt-6 h-5 w-5 shrink-0 text-orange transition-transform duration-300 group-open:rotate-45"
                      />
                    </summary>
                    <div className="pb-8">
                      <p className="text-[15px] font-light leading-relaxed text-charcoal-light">{r.summary}</p>
                      <ul className="mt-5 space-y-2.5">
                        {r.responsibilities.map((x) => (
                          <li key={x} className="flex items-baseline gap-3 text-[15px] font-light text-charcoal">
                            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full bg-orange" />
                            {x}
                          </li>
                        ))}
                      </ul>
                      <a href="#apply" className="link-underline mt-6 text-[11px] font-medium text-charcoal">
                        Apply for this role <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <FormSection
        id="apply"
        eyebrow="Apply"
        heading="Start your application"
        intro="Three short steps. We read every application personally."
        config={applicationForm}
        tone="white"
      />
    </SiteShell>
  );
}
