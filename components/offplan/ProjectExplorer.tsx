'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { byPriceDesc, facets, facetsFor, getCollection, latestLaunches, projects, type Project } from '@/data/offPlan';
import { priceSelection, type Facet, type Selection } from '@/lib/filters';
import { toSlug } from '@/lib/slug';
import FilterExplorer, { type SortOption } from '../filters/FilterExplorer';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from './ProjectCard';

/* Projects priced on request go last either way */
const price = (p: Project) => p.fromPrice ?? Infinity;

const sorts: Record<'newest' | 'price-asc' | 'price-desc' | 'handover', SortOption<Project>> = {
  newest: { id: 'newest', label: 'Newest launches', compare: (a, b) => b.launchedAt.localeCompare(a.launchedAt) },
  'price-asc': { id: 'price-asc', label: 'Price: low to high', compare: (a, b) => price(a) - price(b) },
  'price-desc': { id: 'price-desc', label: 'Price: high to low', compare: byPriceDesc },
  handover: {
    id: 'handover',
    label: 'Earliest handover',
    /* Projects without a confirmed year go last */
    compare: (a, b) => (a.handoverYear ?? 9999) - (b.handoverYear ?? 9999),
  },
};

export type DefaultSort = keyof typeof sorts;

/** The chosen sort first: FilterExplorer starts on the first option. */
const sortOptionsFrom = (first: DefaultSort) => [sorts[first], ...Object.values(sorts).filter((o) => o !== sorts[first])];

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

  return {
    area: optionIdsMatching('area', q),
    developer: optionIdsMatching('developer', q),
    type: optionIdsMatching('type', params.get('type')),
    beds: optionIdsMatching('beds', params.get('beds')),
    price: priceSelection(min, max),
    handover:
      handover === '2029-plus'
        ? handoverYears.filter((y) => Number(y) >= 2029)
        : handoverYears.filter((y) => y === handover),
  };
}

/** The projects a page lists: the latest launches or one collection (by slug). */
const listFor = (source: string) => (source === 'latest-launches' ? latestLaunches : (getCollection(source)?.projects ?? []));

type Props = {
  /** "latest-launches" or a collection slug. Without it: every project, with the search query string applied. */
  source?: string;
  defaultSort?: DefaultSort;
  /** Tags every card NEW LAUNCH */
  isNew?: boolean;
  eyebrow: string;
  heading: string;
  intro?: string;
};

type ExplorerProps = Required<Pick<Props, 'defaultSort'>> &
  Pick<Props, 'isNew'> & { items: Project[]; itemFacets: Facet<Project>[]; initialSelection?: Selection };

function Explorer({ items, itemFacets, defaultSort, isNew, initialSelection }: ExplorerProps) {
  return (
    <FilterExplorer
      items={items}
      facets={itemFacets}
      getKey={(p) => p.slug}
      renderItem={(p) => <ProjectCard project={p} isNew={isNew} />}
      noun={['project', 'projects']}
      initialSelection={initialSelection}
      sortOptions={sortOptionsFrom(defaultSort)}
      emptyHint="Try removing a filter, or speak to a specialist about upcoming launches."
    />
  );
}

function ExplorerFromUrl(props: ExplorerProps) {
  const params = useSearchParams();
  /* Read once: later filter changes are the visitor's, not the URL's */
  const initial = useMemo(() => selectionFromParams(new URLSearchParams(params.toString())), []);
  return <Explorer {...props} initialSelection={initial} />;
}

/** Filterable off-plan project grid. Without `items` it lists every project and reads the search URL. */
export default function ProjectExplorer({ source, defaultSort = 'newest', isNew, eyebrow, heading, intro }: Props) {
  const items = source ? listFor(source) : projects;
  const explorer = { items, itemFacets: source ? facetsFor(items) : facets, defaultSort, isNew };
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-16 bg-cream pb-[var(--section-y)]">
      <div className="container-drp pb-10 pt-[var(--section-y)] sm:pb-12">
        <SectionHeading eyebrow={eyebrow} heading={heading} headingId="projects-heading" intro={intro} />
      </div>
      {source ? (
        <Explorer {...explorer} />
      ) : (
        /* The static build renders the unfiltered grid; the URL's filters apply on load */
        <Suspense fallback={<Explorer {...explorer} />}>
          <ExplorerFromUrl {...explorer} />
        </Suspense>
      )}
    </section>
  );
}
