import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import CtaBand from '@/components/sections/CtaBand';
import FeatureGrid from '@/components/sections/FeatureGrid';
import ImageText from '@/components/sections/ImageText';
import IntroSplit from '@/components/sections/IntroSplit';
import StatStrip from '@/components/sections/StatStrip';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { about } from '@/data/company';
import { contact } from '@/data/homepage';

export const metadata = { title: 'About DRP | Dubai Rapid Properties' };

export default function Page() {
  return (
    <SiteShell>
      <PageHero {...about.hero} />
      <StatStrip
        items={[
          { value: '2007', label: 'Established on Palm Jumeirah' },
          { value: '40+', label: 'Client nationalities' },
          { value: '3', label: 'Market cycles' },
          { value: '1', label: 'Team, every service' },
        ]}
      />
      <IntroSplit eyebrow="Our Story" heading="Built on the island, connected to the world" paragraphs={about.story} tone="cream" />

      <section aria-labelledby="timeline-heading" className="section-y bg-white">
        <div className="container-drp">
          <SectionHeading eyebrow="Milestones" heading="Nearly Two Decades in Dubai" headingId="timeline-heading" />
          <ol className="mt-12 border-t border-line sm:mt-16">
            {about.timeline.map((m, i) => (
              <Reveal
                as="li"
                key={m.year}
                delay={i * 0.05}
                className="grid grid-cols-[5rem_1fr] items-baseline gap-6 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:py-8"
              >
                <span className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-light text-orange">{m.year}</span>
                <span className="text-[15px] font-light leading-relaxed text-charcoal sm:text-base">{m.text}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <FeatureGrid eyebrow="How We Work" heading="What Clients Can Expect" items={about.values} tone="cream" />

      <ImageText
        eyebrow="Visit Us"
        heading="Golden Mile 9, Palm Jumeirah"
        paragraphs={[
          'Our office sits on the trunk of Palm Jumeirah, in the community where DRP began. Clients are welcome to visit for a coffee and a conversation about the market.',
          contact.addressFull,
        ]}
        image={about.office.image}
        imageAlt={about.office.imageAlt}
        link={{ label: 'Meet the team', href: '/about/team' }}
      />

      <CtaBand
        eyebrow="Work With DRP"
        heading="Buying, selling or investing in Dubai?"
        button={{ label: 'Speak With a Specialist', href: '/contact' }}
      />
    </SiteShell>
  );
}
