import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import ConstructionTracker from '@/components/offplan/ConstructionTracker';
import CtaBand from '@/components/sections/CtaBand';
import SectionHeading from '@/components/ui/SectionHeading';
import { constructionUpdates } from '@/data/offPlan';
import { unsplash } from '@/lib/media';

export const metadata = { title: 'Construction Tracker | Dubai Rapid Properties' };

export default function Page() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Off-Plan"
        heading="Construction Tracker"
        intro="Site progress for the off-plan projects DRP follows, updated as developers report each milestone."
        // DEMO PLACEHOLDER – swap for DRP site photography
        image={unsplash('1504307651254-35680f356dfd', 2000)}
        imageAlt="Construction under way on a new development"
      />
      <section aria-labelledby="tracker-heading" className="section-y bg-cream">
        <div className="container-drp">
          <SectionHeading
            eyebrow="Site Progress"
            heading="Every Project, One View"
            headingId="tracker-heading"
            intro={`${constructionUpdates.length} projects, most advanced first. Figures come from DRP's construction status reports.`}
          />
          <div className="mt-12">
            <ConstructionTracker />
          </div>
        </div>
      </section>
      <CtaBand
        eyebrow="Already Own Off-Plan?"
        heading="We will track it for you"
        text="DRP clients receive milestone updates, snagging support and handover management for their units."
        button={{ label: 'Speak to the Team', href: '/contact' }}
        whatsappText="Hello DRP, I would like an update on my off-plan purchase."
      />
    </SiteShell>
  );
}
