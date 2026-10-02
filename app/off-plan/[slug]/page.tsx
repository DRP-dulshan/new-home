import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import ProjectCard from '@/components/offplan/ProjectCard';
import FormSection from '@/components/sections/FormSection';
import ArrowLink from '@/components/ui/ArrowLink';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import SmartLink from '@/components/ui/SmartLink';
import { contactStep, type LeadFormConfig } from '@/data/leadPages';
import {
  constructionStage,
  formatAed,
  getProject,
  handoverLabel,
  paymentSchedule,
  similarProjects,
  unitTypesLabel,
} from '@/data/offPlan';
import { toSlug } from '@/lib/slug';
import { staticSlugs } from './slugs';

/** Next 16: route params arrive as a Promise and must be awaited. */
type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return staticSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const project = getProject((await params).slug);
  return {
    title: project ? `${project.name} by ${project.developer} | Dubai Rapid Properties` : 'Off-Plan | Dubai Rapid Properties',
  };
}

const bedLabel = (n: number) => (n === 0 ? 'Studio' : `${n} Bedroom${n === 1 ? '' : 's'}`);

export default async function Page({ params }: PageProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const schedule = paymentSchedule(project.paymentPlan);
  const { progress, updated } = project.construction;
  const facts = [
    ['Starting price', formatAed(project.fromPrice)],
    ['Handover', handoverLabel(project)],
    ['Payment plan', `${project.paymentPlan}`],
    ['Units', unitTypesLabel(project)],
    ['Developer', project.developer],
  ];

  const interestForm: LeadFormConfig = {
    formId: 'off-plan-interest',
    submitLabel: 'Register Interest',
    successTitle: 'Thank you.',
    successBody: `A DRP off-plan specialist will send you the ${project.name} brochure, floor plans and current availability.`,
    steps: [
      {
        id: 'unitType',
        label: 'Unit Type',
        question: 'Which unit type interests you?',
        kind: 'choice',
        columns: project.bedrooms.length > 2 ? 3 : 2,
        options: project.bedrooms.map((b) => ({ value: bedLabel(b), label: bedLabel(b) })),
      },
      {
        id: 'purpose',
        label: 'Purpose',
        question: 'Are you buying to live in or to invest?',
        kind: 'choice',
        columns: 2,
        options: [
          { value: 'Live in', label: 'To live in' },
          { value: 'Invest', label: 'To invest' },
        ],
      },
      contactStep({ id: 'brochure', label: 'Send me the brochure and floor plans' }),
    ],
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow={`${project.developer} · ${project.area}`}
        heading={project.name}
        intro={project.description[0]}
        image={project.image}
        imageAlt={project.alt}
      />

      {/* ---------- Key facts ---------- */}
      <section aria-label="Key facts" className="border-b border-line bg-white">
        <div className="container-drp">
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map(([label, value], i) => (
              <div
                key={label}
                className={`border-line py-6 sm:py-8 ${i > 0 ? 'lg:border-l lg:pl-8' : ''} ${
                  i % 2 === 1 ? 'border-l pl-5 sm:border-l-0 sm:pl-0' : ''
                } ${i >= 2 ? 'border-t sm:border-t-0' : ''}`}
              >
                <dt className="text-[10px] uppercase tracking-eyebrow text-charcoal-muted">{label}</dt>
                <dd className="mt-2 font-serif text-[1.35rem] leading-snug text-charcoal">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section aria-labelledby="about-heading" className="section-y bg-white">
        <div className="container-drp grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="The Project" heading={`About ${project.name}`} headingId="about-heading" />
            <div className="mt-8 space-y-5">
              {project.description.map((p, i) => (
                <p key={i} className="text-[15px] font-light leading-relaxed text-charcoal-light sm:text-base">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <ArrowLink href={`/areas/${toSlug(project.area)}`} label={`${project.area} area guide`} />
              <ArrowLink href="/ecosystem/mortgage" label="Mortgage assistance" />
            </div>
          </div>
          <div className="lg:col-span-5 lg:pt-16">
            <p className="eyebrow text-charcoal-muted">Amenities</p>
            <ul className="mt-5 border-t border-line">
              {project.amenities.map((a) => (
                <li key={a} className="flex items-baseline gap-4 border-b border-line py-4 text-[15px] font-light text-charcoal">
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full bg-orange" />
                  {a}
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-10 text-charcoal-muted">Configurations</p>
            <p className="mt-3 text-[15px] font-light text-charcoal">
              {project.bedrooms.map(bedLabel).join(' · ')} — {project.propertyTypes.join(', ')}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Payment plan + construction ---------- */}
      <section aria-labelledby="plan-heading" className="section-y bg-ink text-white">
        <div className="container-drp grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Payment Plan"
              heading={`${project.paymentPlan} Payment Plan`}
              headingId="plan-heading"
              tone="light"
            />
            <div aria-hidden="true" className="mt-10 flex h-1.5 w-full overflow-hidden bg-white/10">
              {schedule.map((s, i) => (
                <div
                  key={s.label}
                  style={{ width: `${s.percent}%` }}
                  className={i === 0 ? 'bg-orange' : i === 1 ? 'bg-orange/60' : 'bg-white/70'}
                />
              ))}
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-6">
              {schedule.map((s) => (
                <div key={s.label}>
                  <dd className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-none">{s.percent}%</dd>
                  <dt className="mt-3 text-[10px] uppercase tracking-eyebrow text-white/50">{s.label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-xs font-light text-white/40">
              Indicative schedule. The developer&rsquo;s sales and purchase agreement sets the final instalment dates.
            </p>
          </div>

          <div>
            <SectionHeading eyebrow="Construction" heading={constructionStage(progress)} tone="light" />
            <div
              role="progressbar"
              aria-label="Construction progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="mt-10 h-1.5 w-full bg-white/10"
            >
              <div className="h-full bg-orange" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-8 flex items-end justify-between gap-6">
              <p className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-none">{progress}%</p>
              <p className="text-right text-[11px] uppercase tracking-eyebrow text-white/50">
                Expected handover {handoverLabel(project)}
                <br />
                Updated{' '}
                {new Date(updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="mt-10">
              <ArrowLink href="/off-plan/construction-tracker" label="Construction tracker" tone="light" />
            </div>
          </div>
        </div>
      </section>

      <FormSection
        eyebrow="Register Interest"
        heading={`Receive the ${project.name} brochure`}
        intro="Floor plans, current availability and the full payment schedule, sent by a DRP off-plan specialist."
        config={interestForm}
        context={{ project: project.slug }}
      />

      <section aria-labelledby="similar-heading" className="section-y bg-white">
        <div className="container-drp">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Explore More" heading="Similar Projects" headingId="similar-heading" />
            <SmartLink href="/off-plan#projects" className="link-underline text-[11px] font-medium text-charcoal">
              All off-plan projects <span aria-hidden="true">&rarr;</span>
            </SmartLink>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {similarProjects(project).map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
