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
      eyebrow="Dubai Areas"
      title={humanize(params.slug)}
      copy="Community guide, price benchmarks and available properties will appear here."
    />
  );
}
