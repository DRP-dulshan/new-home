/**
 * ============================================================================
 *  OFF-PLAN — PROJECT DATA + FILTER DEFINITIONS
 * ============================================================================
 *  Drives /off-plan (Latest Launches carousel + filterable project grid), the
 *  off-plan tab on the homepage and the prerendered /off-plan/[slug] routes.
 *  Filter options are derived from the projects, so adding a project with a
 *  new area or developer adds it to the filter bar automatically.
 * ============================================================================
 */

import {
  asOptions,
  bedroomOptions,
  priceFacet,
  uniqueSorted,
  type Facet,
  type PriceBand,
} from '@/lib/filters';
import importedConstruction from './imported/construction.json';
import importedProjects from './imported/projects.json';

export type ProjectType = 'Apartment' | 'Penthouse' | 'Townhouse' | 'Villa';

export type Project = {
  slug: string;
  name: string;
  /** Null when the DRP project page does not name the developer. */
  developer: string | null;
  area: string;
  /** DRP's own collections, e.g. "Luxury", "Latest Launch". */
  collections: string[];
  propertyTypes: ProjectType[];
  /** Bedroom configurations on offer. 0 = studio. Empty when not stated. */
  bedrooms: number[];
  /** Starting price in AED. */
  fromPrice: number;
  /** Expected handover year; null until the developer confirms it. */
  handoverYear: number | null;
  /** During construction / on handover, e.g. "60/40". Null when not published. */
  paymentPlan: string | null;
  /** Date DRP published the project. The newest launches lead the carousel. */
  launchedAt: string;
  description: string[];
  highlights: { title: string; text: string }[];
  locationText: string[];
  image: string;
  alt: string;
  gallery: { src: string; alt: string }[];
  /** Google Maps search, checked at import; `exact` is false when it shows the community */
  map: { query: string; exact: boolean };
  sourceUrl: string;
};

/** WordPress collection names, tidied for the filter bar. */
const COLLECTION_LABELS: Record<string, string> = {
  'Investment Collection': 'Investment',
  'Luxury Collection': 'Luxury',
  'Best roi & Capital Growth Projects)': 'Best ROI & Capital Growth',
  'Best Projects Under AED 1.5M': 'Under AED 1.5M',
  'Best Affordable Townhouse & Villa Projects': 'Affordable Townhouses & Villas',
  'Latest Launch': 'Latest Launch',
};

/**
 * REAL – the off-plan projects on the current DRP website, imported by
 * `npm run import:drp` (see scripts/import-drp-content.mjs). Payment plans are
 * not published there, so cards show them only once the data includes one.
 */
export const projects: Project[] = importedProjects
  .filter((r) => r.startingPrice)
  .map((r) => ({
    slug: r.slug,
    name: r.name,
    developer: r.developer,
    area: r.area,
    collections: r.collections.map((c) => COLLECTION_LABELS[c] ?? c),
    propertyTypes: r.propertyTypes as ProjectType[],
    bedrooms: r.bedrooms,
    fromPrice: r.startingPrice!,
    handoverYear: r.handoverYear,
    paymentPlan: r.paymentPlan as string | null,
    launchedAt: r.launchedAt,
    description: r.about.length ? r.about : [r.summary],
    highlights: r.highlights,
    locationText: r.locationText,
    image: r.image!,
    alt: `${r.name}, ${r.area}`,
    gallery: r.gallery.map((src, i) => ({ src, alt: `${r.name}, image ${i + 1}` })),
    map: r.map,
    sourceUrl: r.sourceUrl,
  }))
  .sort((a, b) => b.launchedAt.localeCompare(a.launchedAt));

/* -------------------------------------------------------------------------- */
/*  CONSTRUCTION UPDATES                                                      */
/* -------------------------------------------------------------------------- */

export type ConstructionUpdate = {
  id: string;
  name: string;
  area: string;
  /** Site progress, 0–100, as reported by the developer */
  progress: number;
  image: string;
  updated: string;
  /** The project page, when DRP also sells the project */
  href: string | null;
};

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** REAL – DRP's construction updates, imported with the projects. */
export const constructionUpdates: ConstructionUpdate[] = importedConstruction
  .filter((c) => c.progress != null && c.updated)
  /* Reports repeat a project month to month; keep its latest figure */
  .sort((a, b) => b.updated.localeCompare(a.updated))
  .filter((c, i, all) => all.findIndex((x) => normalise(x.name) === normalise(c.name)) === i)
  .map((c) => {
    const match = projects.find((p) => normalise(p.name) === normalise(c.name));
    return {
      id: c.id,
      name: c.name,
      area: c.area,
      progress: c.progress,
      image: c.image,
      updated: c.updated,
      href: match ? `/off-plan/${match.slug}` : null,
    };
  })
  .sort((a, b) => b.progress - a.progress || a.name.localeCompare(b.name));

export const constructionFor = (p: Project) =>
  constructionUpdates.find((c) => c.href === `/off-plan/${p.slug}`);

/* -------------------------------------------------------------------------- */
/*  DERIVED LISTS + FORMATTING                                                */
/* -------------------------------------------------------------------------- */

export const projectHref = (slug: string) => `/off-plan/${slug}`;

/* Communities DRP sells in outside Dubai */
const EMIRATE: Record<string, string> = {
  'Al Marjan Island': 'Ras Al Khaimah',
  'Ghadeer Al Tayr': 'Abu Dhabi',
};

/** The map's heading and its Google search, as checked by the importer. */
export function projectLocation(p: Project) {
  const where = EMIRATE[p.area] ? `${p.area}, ${EMIRATE[p.area]}` : p.area;
  return { label: p.map.exact ? `${p.name}, ${where}` : where, ...p.map };
}

/** DRP's "Latest Launch" collection, newest first; the carousel shows six. */
export const latestLaunches = projects.filter((p) => p.collections.includes('Latest Launch')).slice(0, 6);

/** The homepage's off-plan tab: the four most exclusive Luxury projects, highest starting price first. */
export const featuredProjects = projects
  .filter((p) => p.collections.includes('Luxury'))
  .sort((a, b) => b.fromPrice - a.fromPrice)
  .slice(0, 4);

export const formatAed = (n: number) => `AED ${n.toLocaleString('en-US')}`;

export const handoverLabel = (p: Project) => (p.handoverYear ? String(p.handoverYear) : 'TBC');

/** "Developer · Area", or just the area when the developer is not named. */
export const projectEyebrow = (p: Project) => (p.developer ? `${p.developer} · ${p.area}` : p.area);

const bedLabel = (n: number) => (n === 0 ? 'Studio' : String(n));

/** "Studio – 2 Bed · Apartments" / "4 – 6 Bed · Villas" / "Apartments & Penthouses" */
export function unitTypesLabel(p: Project): string {
  const types = p.propertyTypes.map((t) => `${t}s`).join(' & ');
  if (!p.bedrooms.length) return types;
  const min = Math.min(...p.bedrooms);
  const max = Math.max(...p.bedrooms);
  const beds =
    min === max
      ? min === 0
        ? 'Studio'
        : `${min} Bed`
      : `${bedLabel(min)} – ${max} Bed`;
  return `${beds} · ${types}`;
}

/* -------------------------------------------------------------------------- */
/*  FILTERS                                                                   */
/* -------------------------------------------------------------------------- */

const bedroomFacet: Facet<Project> = {
  key: 'beds',
  label: 'Bedrooms',
  options: bedroomOptions.map(({ id, label }) => ({ id, label })),
  test: (p, sel) => bedroomOptions.some((o) => sel.includes(o.id) && p.bedrooms.some(o.test)),
};

export const priceBands: PriceBand[] = [
  { id: 'under-2m', label: 'Under AED 2M', max: 2_000_000 },
  { id: '2m-5m', label: 'AED 2M – 5M', min: 2_000_000, max: 5_000_000 },
  { id: '5m-10m', label: 'AED 5M – 10M', min: 5_000_000, max: 10_000_000 },
  { id: '10m-up', label: 'AED 10M+', min: 10_000_000 },
];

export const facets: Facet<Project>[] = [
  {
    key: 'area',
    label: 'Area',
    options: asOptions(uniqueSorted(projects.map((p) => p.area))),
    test: (p, sel) => sel.includes(p.area),
  },
  {
    key: 'collection',
    label: 'Collection',
    options: asOptions(uniqueSorted(projects.flatMap((p) => p.collections))),
    test: (p, sel) => p.collections.some((c) => sel.includes(c)),
  },
  {
    key: 'developer',
    label: 'Developer',
    options: asOptions(uniqueSorted(projects.flatMap((p) => (p.developer ? [p.developer] : [])))),
    test: (p, sel) => !!p.developer && sel.includes(p.developer),
  },
  {
    key: 'type',
    label: 'Property Type',
    options: asOptions(uniqueSorted(projects.flatMap((p) => p.propertyTypes))),
    test: (p, sel) => p.propertyTypes.some((t) => sel.includes(t)),
  },
  bedroomFacet,
  priceFacet<Project>('Price Range', priceBands, (p) => p.fromPrice),
  {
    key: 'handover',
    label: 'Handover',
    options: asOptions(uniqueSorted(projects.flatMap((p) => (p.handoverYear ? [String(p.handoverYear)] : [])))),
    test: (p, sel) => sel.includes(String(p.handoverYear)),
  },
];

/* -------------------------------------------------------------------------- */
/*  DETAIL HELPERS                                                            */
/* -------------------------------------------------------------------------- */

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Construction stage named from site progress. */
export function constructionStage(progress: number) {
  if (progress >= 95) return 'Handover preparation';
  if (progress >= 75) return 'Finishing works';
  if (progress >= 40) return 'Superstructure';
  if (progress >= 15) return 'Substructure';
  return 'Enabling works';
}

/** Same area or developer first. */
export function similarProjects(p: Project, count = 3) {
  const score = (x: Project) => (x.area === p.area ? 2 : 0) + (x.developer && x.developer === p.developer ? 1 : 0);
  return projects
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => score(b) - score(a) || b.launchedAt.localeCompare(a.launchedAt))
    .slice(0, count);
}
