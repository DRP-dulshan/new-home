import { notFound } from 'next/navigation';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import { humanize } from '@/lib/humanize';
import { staticSlugs } from './slugs';

/** Next 16: route params arrive as a Promise and must be awaited. */
type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return staticSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${humanize(slug)} | Dubai Rapid Properties` };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!staticSlugs.includes(slug)) notFound();

  return (
    <PlaceholderPage
      eyebrow="News & Insights"
      title={humanize(slug)}
      copy="The full article will appear here once the DRP Magazine feed is connected."
    />
  );
}
