import PlaceholderPage from '@/components/ui/PlaceholderPage';
import { humanize } from '@/lib/humanize';
import { staticSlugs } from './slugs';

export const dynamicParams = true;

export function generateStaticParams() {
  return staticSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${humanize(params.slug)} | Dubai Rapid Properties` };
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <PlaceholderPage
      eyebrow="Explore Real Estate"
      title={humanize(params.slug)}
      copy="Full listing details, gallery and floor plans will appear here."
    />
  );
}
