import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import FaqList from '@/components/sections/FaqList';
import FeatureGrid from '@/components/sections/FeatureGrid';
import FormSection from '@/components/sections/FormSection';
import IntroSplit from '@/components/sections/IntroSplit';
import PackageCards from '@/components/sections/PackageCards';
import ProcessSteps from '@/components/sections/ProcessSteps';
import { propertyManagement as page } from '@/data/services';

export const metadata = { title: 'Property Management | Dubai Rapid Properties' };

export default function Page() {
  return (
    <SiteShell>
      <PageHero {...page.hero} />
      <IntroSplit eyebrow="Property Management" heading="Your property, looked after" paragraphs={page.intro} />
      <ProcessSteps eyebrow="How It Works" heading="Four Steps, One Team" steps={page.steps} />
      <FeatureGrid eyebrow="Services" heading="What We Take Care Of" items={page.services} />
      <PackageCards
        eyebrow="Plans"
        heading="Choose Your Level of Service"
        packages={page.packages}
        tone="cream"
        ctaLabel="Request an appraisal"
        note="Fees are DEMO PLACEHOLDERS — confirm the current fee structure."
      />
      <FaqList items={page.faqs} />
      <FormSection
        eyebrow="Get Started"
        heading="Request a free appraisal"
        intro="We will visit the property, advise on rent and recommend the right plan."
        config={page.form}
      />
    </SiteShell>
  );
}
