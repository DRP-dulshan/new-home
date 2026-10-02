import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import CtaBand from '@/components/sections/CtaBand';
import FeatureGrid from '@/components/sections/FeatureGrid';
import IntroSplit from '@/components/sections/IntroSplit';
import StatStrip from '@/components/sections/StatStrip';
import { whyItMatters as page } from '@/data/services';

export const metadata = { title: 'Why Furnishing Matters for Returns | Dubai Rapid Properties' };

export default function Page() {
  return (
    <SiteShell>
      <PageHero {...page.hero} />
      <StatStrip
        items={page.stats}
        note="Compared with similar unfurnished or dated homes in the DRP portfolio. DEMO PLACEHOLDER figures — replace with DRP data."
      />
      <IntroSplit eyebrow="The First Impression" heading="Decided in a single photo" paragraphs={page.intro} tone="cream" />
      <FeatureGrid eyebrow="Where It Shows" heading="Six Ways Furnishing Pays" items={page.reasons} />
      <CtaBand
        eyebrow="DRP Furnishings"
        heading="See our furnishing packages"
        button={{ label: 'View Packages', href: '/furnishings' }}
        whatsappText="Hello DRP, I would like a furnishing quote."
      />
    </SiteShell>
  );
}
