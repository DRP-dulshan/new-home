'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { facets, priceBands, projects, type Project } from '@/data/offPlan';
import { bandsForRange, type Selection } from '@/lib/filters';
import { toSlug } from '@/lib/slug';
import FilterExplorer, { type SortOption } from '../filters/FilterExplorer';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from './ProjectCard';

const sortOptions: SortOption<Project>[] = [
  { id: 'newest', label: 'Newest launches', compare: (a, b) => b.launchedAt.localeCompare(a.launchedAt) },
  { id: 'price-asc', label: 'Price: low to high', compare: (a, b) => a.fromPrice - b.fromPrice },
  { id: 'price-desc', label: 'Price: high to low', compare: (a, b) => b.fromPrice - a.fromPrice },
  {
    id: 'handover',
    label: 'Earliest handover',
    compare: (a, b) =>
      a.handover.year - b.handover.year || a.handover.quarter - b.handover.quarter,
  },
];

const optionIdsMatching = (key: string, slugValue: string | null) => {
  if (!slugValue) return [];
  const facet = facets.find((f) => f.key === key)!;
  return facet.options.filter((o) => toSlug(o.label) === slugValue || o.id === slugValue).map((o) => o.id);
};

/**
 * Turns the hero / Section 02 search query string into a starting selection:
 * ?q=dubai-marina&beds=2&min=2000000&max=5000000&handover=2028&type=villa
 */
function selectionFromParams(params: URLSearchParams): Selection {
  const q = params.get('q');
  const handover = params.get('handover');
  const min = Number(params.get('min')) || undefined;
  const max = Number(params.get('max')) || undefined;

  const handoverYears = facets.find((f) => f.key === 'handover')!.options.map((o) => o.id);
  const price = min || max ? bandsForRange(priceBands, min, max) : [];

  return {
    area: optionIdsMatching('area', q),
    developer: optionIdsMatching('developer', q),
    type: optionIdsMatching('type', params.get('type')),
    beds: optionIdsMatching('beds', params.get('beds')),
    price: price.map((b) => b.id),
    handover:
      handover === '2029-plus'
        ? handoverYears.filter((y) => Number(y) >= 2029)
        : handoverYears.filter((y) => y === handover),
  };
}

function Explorer({ initialSelection }: { initialSelection?: Selection }) {
  return (
    <FilterExplorer
      items={projects}
      facets={facets}
      getKey={(p) => p.slug}
      renderItem={(p) => <ProjectCard project={p} />}
      noun={['project', 'projects']}
      initialSelection={initialSelection}
      sortOptions={sortOptions}
      emptyHint="Try removing a filter, or speak to a specialist about upcoming launches."
    />
  );
}

function ExplorerFromUrl() {
  const params = useSearchParams();
  /* Read once: later filter changes are the visitor's, not the URL's */
  const initial = useMemo(() => selectionFromParams(new URLSearchParams(params.toString())), []);
  return <Explorer initialSelection={initial} />;
}

/** Filterable off-plan project grid for /off-plan. */
export default function ProjectExplorer() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="bg-cream pb-[var(--section-y)]">
      <div className="container-drp pb-10 pt-[var(--section-y)] sm:pb-12">
        <SectionHeading
          eyebrow="All Projects"
          heading="Explore Off-Plan Projects"
          headingId="projects-heading"
        />
      </div>
      {/* The static build renders the unfiltered grid; the URL's filters apply on load */}
      <Suspense fallback={<Explorer />}>
        <ExplorerFromUrl />
      </Suspense>
    </section>
  );
}
