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
      eyebrow="Off-Plan Collections"
      title={humanize(params.slug)}
      copy="Payment plan, handover timeline and unit availability will appear here."
    />
  );
}
