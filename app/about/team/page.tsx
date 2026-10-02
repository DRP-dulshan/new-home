import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import TeamGrid from '@/components/company/TeamGrid';
import CtaBand from '@/components/sections/CtaBand';
import SectionHeading from '@/components/ui/SectionHeading';
import { drpPhoto } from '@/lib/media';

export const metadata = { title: 'Meet the Team | Dubai Rapid Properties' };

export default function Page() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About DRP"
        heading="Meet the Team"
        intro="The advisors, leasing specialists and property managers behind every DRP transaction — a multilingual team based on Palm Jumeirah."
        image={drpPhoto(7)}
        imageAlt="The DRP team in the office"
      />
      <section aria-labelledby="team-heading" className="section-y bg-white">
        <div className="container-drp">
          <SectionHeading
            eyebrow="Our People"
            heading="Specialists for Every Step"
            headingId="team-heading"
            intro="Choose a department to find the right person. Profiles and photographs are being added."
          />
          <div className="mt-12">
            <TeamGrid />
          </div>
        </div>
      </section>
      <CtaBand
        eyebrow="Join Us"
        heading="Want to work with this team?"
        button={{ label: 'View Open Roles', href: '/careers' }}
      />
    </SiteShell>
  );
}
