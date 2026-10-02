import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import FeatureGrid from '@/components/sections/FeatureGrid';
import FormSection from '@/components/sections/FormSection';
import IntroSplit from '@/components/sections/IntroSplit';
import ProcessSteps from '@/components/sections/ProcessSteps';
import { interiorDesign as page } from '@/data/services';

export const metadata = { title: 'Interior Design | Dubai Rapid Properties' };

export default function Page() {
  return (
    <SiteShell>
      <PageHero {...page.hero} />
      <IntroSplit eyebrow="DRP Interiors" heading="Designed for the outcome" paragraphs={page.intro} />
      <FeatureGrid eyebrow="Services" heading="What We Design" items={page.services} columns={2} tone="cream" />
      <ProcessSteps eyebrow="Our Process" heading="From Brief to Final Styling" steps={page.steps} tone="dark" />
      <FormSection
        eyebrow="Book a Consultation"
        heading="Start your project"
        intro="Tell us about the property and what it is for. A designer will be in touch."
        config={page.form}
      />
    </SiteShell>
  );
}
