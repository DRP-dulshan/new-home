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
  inBand,
  uniqueSorted,
  type Facet,
  type PriceBand,
} from '@/lib/filters';
import { unsplash as unsplashAt } from '@/lib/media';

const unsplash = (id: string) => unsplashAt(id, 1400);

export type ProjectType = 'Apartment' | 'Penthouse' | 'Townhouse' | 'Villa';

export type Project = {
  slug: string;
  name: string;
  developer: string;
  area: string;
  propertyTypes: ProjectType[];
  /** Bedroom configurations on offer. 0 = studio. */
  bedrooms: number[];
  /** Starting price in AED. */
  fromPrice: number;
  handover: { quarter: 1 | 2 | 3 | 4; year: number };
  /** During construction / on handover, e.g. "60/40". */
  paymentPlan: string;
  /** Sales launch date (ISO). The newest launches lead the carousel. */
  launchedAt: string;
  description: string[];
  amenities: string[];
  /** Placeholder site progress (0–100) and the date of the last update. */
  construction: { progress: number; updated: string };
  image: string;
  alt: string;
};

// DEMO PLACEHOLDERS – replace with the real project database.
// Project names, prices, handover dates, payment plans and launch dates are
// invented; developers and areas are real so the filters read naturally.
export const projects: Project[] = [
  {
    slug: 'marina-horizon-residences',
    name: 'Marina Horizon Residences',
    developer: 'Emaar Properties',
    area: 'Dubai Marina',
    propertyTypes: ['Apartment'],
    bedrooms: [1, 2, 3],
    fromPrice: 2_400_000,
    handover: { quarter: 4, year: 2027 },
    paymentPlan: '60/40',
    launchedAt: '2026-03-12',
    description: [
      'A waterfront tower on the edge of Dubai Marina, with one- to three-bedroom residences framed by marina and sea views.',
      'Residents share a podium of pools, a gym and lounges, with the Marina Walk, tram and beach a few minutes away on foot.',
    ],
    amenities: ['Infinity pool', "Residents' gym", "Children's play area", 'Marina Walk access'],
    construction: { progress: 46, updated: '2026-09-20' },
    image: unsplash('1486406146926-c627a92ad1ab'),
    alt: 'A rendered residential tower overlooking Dubai Marina',
  },
  {
    slug: 'palm-shore-collection',
    name: 'Palm Shore Collection',
    developer: 'Nakheel',
    area: 'Palm Jumeirah',
    propertyTypes: ['Apartment', 'Penthouse'],
    bedrooms: [2, 3, 4],
    fromPrice: 8_900_000,
    handover: { quarter: 2, year: 2028 },
    paymentPlan: '50/50',
    launchedAt: '2026-05-20',
    description: [
      'A limited collection of beachfront apartments and penthouses on Palm Jumeirah, each with a private terrace facing the sea.',
      "A private beach, a residents' club and a spa make it one of the island's most complete new addresses.",
    ],
    amenities: ['Private beach', "Residents' club", 'Spa and wellness', 'Concierge'],
    construction: { progress: 18, updated: '2026-09-12' },
    image: unsplash('1600047509807-ba8f99d2cdde'),
    alt: 'A beachfront residence rendering on Palm Jumeirah',
  },
  {
    slug: 'the-hills-park-villas',
    name: 'The Hills Park Villas',
    developer: 'Sobha Realty',
    area: 'Dubai Hills Estate',
    propertyTypes: ['Villa'],
    bedrooms: [4, 5, 6],
    fromPrice: 5_750_000,
    handover: { quarter: 1, year: 2027 },
    paymentPlan: '70/30',
    launchedAt: '2025-11-04',
    description: [
      'Contemporary four- to six-bedroom villas set around a central park in Dubai Hills Estate.',
      'Each villa has a private garden and pool deck, with schools, the golf course and Dubai Hills Mall within a short drive.',
    ],
    amenities: ['Private gardens', 'Community park', 'Golf course nearby', 'Gated community'],
    construction: { progress: 84, updated: '2026-09-25' },
    image: unsplash('1613490493576-7fde63acd811'),
    alt: 'A contemporary villa rendering set within landscaped gardens',
  },
  {
    slug: 'downtown-quarter-tower',
    name: 'Downtown Quarter Tower',
    developer: 'Ellington Properties',
    area: 'Downtown Dubai',
    propertyTypes: ['Apartment'],
    bedrooms: [0, 1, 2],
    fromPrice: 1_850_000,
    handover: { quarter: 3, year: 2027 },
    paymentPlan: '80/20',
    launchedAt: '2025-09-18',
    description: [
      'Studios to two-bedroom apartments a short walk from the Burj Khalifa and Dubai Mall.',
      'Designed for owner-occupiers and holiday-home investors alike, with strong short-stay demand in the area all year.',
    ],
    amenities: ['Rooftop pool', 'Boulevard views', 'Co-working lounge', 'Valet parking'],
    construction: { progress: 71, updated: '2026-09-18' },
    image: unsplash('1582407947304-fd86f028f716'),
    alt: 'A tower rendering with Burj Khalifa views in Downtown Dubai',
  },
  {
    slug: 'creek-vista-heights',
    name: 'Creek Vista Heights',
    developer: 'Emaar Properties',
    area: 'Dubai Creek Harbour',
    propertyTypes: ['Apartment'],
    bedrooms: [1, 2, 3],
    fromPrice: 1_450_000,
    handover: { quarter: 2, year: 2028 },
    paymentPlan: '80/20',
    launchedAt: '2026-08-28',
    description: [
      "Apartments overlooking the Creek and the Dubai skyline, in one of the city's fastest-growing waterfront communities.",
      'Waterside promenades, parks and a future retail district are all part of the masterplan.',
    ],
    amenities: ['Creek promenade', 'Infinity pool', 'Retail podium', 'Parks and cycle tracks'],
    construction: { progress: 4, updated: '2026-09-28' },
    image: unsplash('1512453979798-5ea266f8880c'),
    alt: 'An aerial view of the Dubai skyline at dusk',
  },
  {
    slug: 'boulevard-line-residences',
    name: 'Boulevard Line Residences',
    developer: 'DAMAC Properties',
    area: 'Downtown Dubai',
    propertyTypes: ['Apartment', 'Penthouse'],
    bedrooms: [0, 1, 2, 4],
    fromPrice: 1_250_000,
    handover: { quarter: 4, year: 2026 },
    paymentPlan: '60/40',
    launchedAt: '2025-06-10',
    description: [
      'A boulevard-facing tower in Downtown Dubai with studios, apartments and four-bedroom penthouses.',
      'Nearing completion, it offers one of the shortest waits to handover in the area.',
    ],
    amenities: ['Pool deck', 'Gym and spa', 'Boulevard retail', 'Concierge'],
    construction: { progress: 93, updated: '2026-09-22' },
    image: unsplash('1541976590-713941681591'),
    alt: 'A newly launched residential tower in Dubai',
  },
  {
    slug: 'islands-beach-villas',
    name: 'Islands Beach Villas',
    developer: 'Nakheel',
    area: 'Dubai Islands',
    propertyTypes: ['Townhouse', 'Villa'],
    bedrooms: [3, 4, 5],
    fromPrice: 6_400_000,
    handover: { quarter: 4, year: 2028 },
    paymentPlan: '60/40',
    launchedAt: '2026-09-15',
    description: [
      'Beachfront townhouses and villas on Dubai Islands, the new island destination off Deira.',
      'Private beach frontage, marinas and a planned hotel district give the community a resort feel.',
    ],
    amenities: ['Beachfront', 'Marina', 'Clubhouse', 'Hotel district'],
    construction: { progress: 3, updated: '2026-09-26' },
    image: unsplash('1600596542815-ffad4c1539a9'),
    alt: 'A waterfront villa with a private pool at dusk',
  },
  {
    slug: 'frond-estate-palm-jebel-ali',
    name: 'Frond Estate',
    developer: 'Nakheel',
    area: 'Palm Jebel Ali',
    propertyTypes: ['Villa'],
    bedrooms: [5, 6],
    fromPrice: 18_500_000,
    handover: { quarter: 1, year: 2029 },
    paymentPlan: '70/30',
    launchedAt: '2026-07-02',
    description: [
      "Five- and six-bedroom villas on the fronds of Palm Jebel Ali, the city's newest island.",
      'Every villa has direct beach access and a private pool, on wide plots with open water views.',
    ],
    amenities: ['Direct beach access', 'Private pools', 'Large plots', 'Island clubhouse'],
    construction: { progress: 9, updated: '2026-09-10' },
    image: unsplash('1600585154340-be6161a56a0c'),
    alt: 'A garden villa with private beach frontage',
  },
  {
    slug: 'jvc-garden-lofts',
    name: 'Garden Lofts JVC',
    developer: 'Ellington Properties',
    area: 'JVC',
    propertyTypes: ['Apartment'],
    bedrooms: [0, 1, 2],
    fromPrice: 950_000,
    handover: { quarter: 3, year: 2026 },
    paymentPlan: '70/30',
    launchedAt: '2025-04-22',
    description: [
      "Studios to two-bedroom apartments in Jumeirah Village Circle, one of Dubai's most popular rental communities.",
      'Well priced for first-time investors, with dependable rental demand and handover within the year.',
    ],
    amenities: ['Pool', 'Gym', 'Landscaped courtyard', 'Retail units'],
    construction: { progress: 89, updated: '2026-09-24' },
    image: unsplash('1487958449943-2429e8be8625'),
    alt: 'A contemporary residential building against a clear sky',
  },
  {
    slug: 'ranches-row-townhouses',
    name: 'Ranches Row Townhouses',
    developer: 'Emaar Properties',
    area: 'Arabian Ranches',
    propertyTypes: ['Townhouse'],
    bedrooms: [3, 4],
    fromPrice: 2_950_000,
    handover: { quarter: 2, year: 2027 },
    paymentPlan: '80/20',
    launchedAt: '2025-12-09',
    description: [
      'Three- and four-bedroom family townhouses in the Arabian Ranches family of communities.',
      'Each home has a garden and covered parking, close to schools, pools and parks.',
    ],
    amenities: ['Community pools', 'Parks', 'Schools nearby', 'Retail centre'],
    construction: { progress: 62, updated: '2026-09-15' },
    image: unsplash('1613977257363-707ba9348227'),
    alt: 'A family home with a private garden in a gated community',
  },
  {
    slug: 'marina-crest-penthouses',
    name: 'Marina Crest',
    developer: 'DAMAC Properties',
    area: 'Dubai Marina',
    propertyTypes: ['Apartment', 'Penthouse'],
    bedrooms: [1, 2, 3, 4],
    fromPrice: 3_600_000,
    handover: { quarter: 3, year: 2028 },
    paymentPlan: '60/40',
    launchedAt: '2026-06-18',
    description: [
      'Apartments and penthouses on the Dubai Marina waterfront, with marina-facing balconies on every floor.',
      'Upper floors are reserved for four-bedroom penthouses with private terraces.',
    ],
    amenities: ['Marina-facing balconies', 'Sky lounge', 'Infinity pool', 'Valet parking'],
    construction: { progress: 22, updated: '2026-09-19' },
    image: unsplash('1580674684081-7617fbf3d745'),
    alt: 'The Dubai skyline seen across the city',
  },
  {
    slug: 'hartland-waterside',
    name: 'Hartland Waterside',
    developer: 'Sobha Realty',
    area: 'Mohammed Bin Rashid City',
    propertyTypes: ['Apartment', 'Villa'],
    bedrooms: [1, 2, 3, 4],
    fromPrice: 1_980_000,
    handover: { quarter: 4, year: 2027 },
    paymentPlan: '60/40',
    launchedAt: '2026-04-30',
    description: [
      'Apartments and villas set along the lagoons of Mohammed Bin Rashid City, ten minutes from Downtown.',
      'A green, low-rise community with lagoons, parks and international schools inside the masterplan.',
    ],
    amenities: ['Crystal lagoons', 'International schools', 'Parks', 'Cycling tracks'],
    construction: { progress: 38, updated: '2026-09-21' },
    image: unsplash('1504307651254-35680f356dfd'),
    alt: 'Construction under way on a new waterside development',
  },
];

/* -------------------------------------------------------------------------- */
/*  DERIVED LISTS + FORMATTING                                                */
/* -------------------------------------------------------------------------- */

export const projectHref = (slug: string) => `/off-plan/${slug}`;

/** Newest first; the carousel shows the latest six. */
export const latestLaunches = [...projects]
  .sort((a, b) => b.launchedAt.localeCompare(a.launchedAt))
  .slice(0, 6);

/** The four projects featured in the homepage's off-plan tab. */
export const featuredProjects = [
  'marina-horizon-residences',
  'palm-shore-collection',
  'the-hills-park-villas',
  'downtown-quarter-tower',
].map((slug) => projects.find((p) => p.slug === slug)!);

export const formatAed = (n: number) => `AED ${n.toLocaleString('en-US')}`;

export const handoverLabel = (p: Project) => `Q${p.handover.quarter} ${p.handover.year}`;

const bedLabel = (n: number) => (n === 0 ? 'Studio' : String(n));

/** "Studio – 2 Bed · Apartments" / "4 – 6 Bed · Villas" */
export function unitTypesLabel(p: Project): string {
  const min = Math.min(...p.bedrooms);
  const max = Math.max(...p.bedrooms);
  const beds =
    min === max
      ? min === 0
        ? 'Studio'
        : `${min} Bed`
      : `${bedLabel(min)} – ${max} Bed`;
  const types = p.propertyTypes.map((t) => `${t}s`).join(' & ');
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
    key: 'developer',
    label: 'Developer',
    options: asOptions(uniqueSorted(projects.map((p) => p.developer))),
    test: (p, sel) => sel.includes(p.developer),
  },
  {
    key: 'type',
    label: 'Property Type',
    options: asOptions(uniqueSorted(projects.flatMap((p) => p.propertyTypes))),
    test: (p, sel) => p.propertyTypes.some((t) => sel.includes(t)),
  },
  bedroomFacet,
  {
    key: 'price',
    label: 'Price Range',
    options: priceBands.map(({ id, label }) => ({ id, label })),
    test: (p, sel) => priceBands.some((b) => sel.includes(b.id) && inBand(p.fromPrice, b)),
  },
  {
    key: 'handover',
    label: 'Handover',
    options: asOptions(uniqueSorted(projects.map((p) => String(p.handover.year)))),
    test: (p, sel) => sel.includes(String(p.handover.year)),
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

/**
 * Indicative schedule from a "60/40" plan: a 10% booking deposit, the rest of
 * the first figure during construction, the second figure on handover.
 */
export function paymentSchedule(plan: string) {
  const [during, onHandover] = plan.split('/').map(Number);
  return [
    { label: 'On booking', percent: 10 },
    { label: 'During construction', percent: during - 10 },
    { label: 'On handover', percent: onHandover },
  ];
}

/** Same area or developer first. */
export function similarProjects(p: Project, count = 3) {
  const score = (x: Project) => (x.area === p.area ? 2 : 0) + (x.developer === p.developer ? 1 : 0);
  return projects
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => score(b) - score(a) || b.launchedAt.localeCompare(a.launchedAt))
    .slice(0, count);
}
