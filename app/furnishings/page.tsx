import PageHero from '@/components/PageHero';
import SiteShell from '@/components/layout/SiteShell';
import FormSection from '@/components/sections/FormSection';
import ImageText from '@/components/sections/ImageText';
import IntroSplit from '@/components/sections/IntroSplit';
import PackageCards from '@/components/sections/PackageCards';
import ProcessSteps from '@/components/sections/ProcessSteps';
import { furnishings as page } from '@/data/services';
import { unsplash } from '@/lib/media';

export const metadata = { title: 'Furnishing Packages | Dubai Rapid Properties' };

export default function Page() {
  return (
    <SiteShell>
      <PageHero {...page.hero} />
      <IntroSplit eyebrow="DRP Furnishings" heading="Furnished to perform" paragraphs={page.intro} />
      <PackageCards
        eyebrow="Packages"
        heading="Three Ways to Furnish"
        packages={page.packages}
        tone="cream"
        ctaLabel="Request a quote"
        note="Package prices are DEMO PLACEHOLDERS — confirm before launch."
      />
      <ProcessSteps eyebrow="How It Works" heading="Ready in as Little as Three Weeks" steps={page.steps} />
      <ImageText
        eyebrow="Returns"
        heading="Why furnishing matters"
        paragraphs={['Furnishing quality is one of the biggest levers on occupancy, nightly rates and how quickly a home lets. See how it moves the numbers.']}
        image={unsplash('1512917774080-9991f1c4c750', 1600)}
        imageAlt="A furnished living space opening onto a terrace"
        link={{ label: 'Why is it important for returns?', href: '/furnishings/why-it-matters' }}
        tone="cream"
        reverse
      />
      <FormSection
        eyebrow="Request a Quote"
        heading="Furnish your property"
        intro="Tell us about the property and the package you are considering."
        config={page.form}
        tone="white"
      />
    </SiteShell>
  );
}
