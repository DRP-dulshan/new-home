/**
 * ============================================================================
 *  DRP HOMEPAGE — SINGLE SOURCE OF CONTENT
 * ============================================================================
 *  Everything the client may want to change (copy, links, images, listings,
 *  articles, reviews, partners) lives in this file. No copy is hard-coded in
 *  components.
 *
 *  Items marked "DEMO PLACEHOLDER" must be replaced with real content before
 *  launch. Search this file for "DEMO PLACEHOLDER" to find them all.
 * ============================================================================
 */

import { featuredProjects, formatAed, handoverLabel, projectHref } from './offPlan';

/** Helper so Unsplash URLs stay readable and consistently sized. */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** DRP's own photography library (about-1.jpg … about-14.jpg on the live site). */
const drpPhoto = (n: number) =>
  `https://dubairapidproperties.com/wp-content/uploads/2023/02/about-${n}.jpg`;

/* -------------------------------------------------------------------------- */
/*  BRAND + CONTACT                                                           */
/* -------------------------------------------------------------------------- */

export const site = {
  name: 'Dubai Rapid Properties',
  shortName: 'DRP',
  established: 2007,
  tagline:
    'A Dubai real estate agency on Palm Jumeirah, connecting international clients with property, investment and opportunity across the UAE.',
  logos: {
    white: 'https://dubairapidproperties.com/wp-content/uploads/2023/11/drp-White1.svg',
    black: 'https://dubairapidproperties.com/wp-content/uploads/2023/11/drp-black1.svg',
    favicon:
      'https://dubairapidproperties.com/wp-content/uploads/2023/02/cropped-drp-fav-270x270.png',
  },
} as const;

export const contact = {
  addressLine: 'Golden Mile 9, Palm Jumeirah',
  addressFull: 'DRP, Golden Mile 9, Palm Jumeirah, Dubai, UAE',
  phone: '+971 4 529 4904',
  phoneHref: 'tel:+97145294904',
  whatsapp: '+971 56 777 0272',
  whatsappHref: 'https://wa.me/971567770272',
  email: 'Office@dubairapidproperties.com',
  emailHref: 'mailto:Office@dubairapidproperties.com',
} as const;

/* -------------------------------------------------------------------------- */
/*  NAVIGATION                                                                */
/* -------------------------------------------------------------------------- */

export type NavItem = { label: string; href: string; external?: boolean };

/* Header navigation now lives in /data/navigation.ts (mega-menu structure). */

/* -------------------------------------------------------------------------- */
/*  SECTION 01 — HERO                                                         */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: 'Dubai Rapid Properties',
  heading: 'Dubai Real Estate. Global Perspective.',
  paragraph:
    'Established in Dubai since 2007, connecting clients from around the world with property, investment and opportunities across the UAE.',
  /** Background video — muted, looping, no controls. */
  videoSrc:
    'https://player.vimeo.com/video/1082800158?background=1&autoplay=1&loop=1&muted=1',
  /** Shown until the video paints, and on reduced-motion / no-video devices. */
  posterImage: unsplash('1546412414-e1885259563a', 2000),
  posterAlt: 'The Dubai coastline at dusk',
  quickLinks: [
    { label: 'About DRP', href: '/about' },
    { label: 'Find a Ready Property', href: '/properties' },
    { label: 'Explore Off Plan Investments', href: '/off-plan' },
    { label: 'Sell With DRP', href: '/list-your-property' },
    { label: 'Manage Your Home With DRP', href: '/property-management' },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  SEARCH — shared by the hero search and Section 02                          */
/* -------------------------------------------------------------------------- */
/*  Both search bars read areas, bedroom counts and price scales from here, so
    the two stay in step. Change a value once and it updates in both places.   */

export type Offering = 'buy' | 'rent' | 'offplan';

export type PriceOption = {
  value: number;
  label: string;
  /** The top option is open-ended ("50M+"), so no max is sent in the query. */
  open?: boolean;
};

/** A selectable range in the Section 02 dropdown, derived from the scale below. */
export type PriceBand = { id: string; label: string; min?: number; max?: number };

const salePrices: PriceOption[] = [
  { value: 500_000, label: '500K' },
  { value: 1_000_000, label: '1M' },
  { value: 2_000_000, label: '2M' },
  { value: 3_000_000, label: '3M' },
  { value: 5_000_000, label: '5M' },
  { value: 10_000_000, label: '10M' },
  { value: 20_000_000, label: '20M' },
  { value: 50_000_000, label: '50M+', open: true },
];

/** Yearly rent. */
const rentPrices: PriceOption[] = [
  { value: 50_000, label: '50K' },
  { value: 100_000, label: '100K' },
  { value: 150_000, label: '150K' },
  { value: 250_000, label: '250K' },
  { value: 500_000, label: '500K' },
  { value: 1_000_000, label: '1M+', open: true },
];

/**
 * Turns a price scale into consecutive bands for a single-select dropdown:
 * 500K–1M, 1M–2M, … 20M–50M, then an open "50M+" at the top.
 */
function buildPriceBands(options: PriceOption[], anyLabel: string): PriceBand[] {
  const bands: PriceBand[] = [{ id: 'any', label: anyLabel }];
  const clean = (label: string) => label.replace(/\+$/, '');

  for (let i = 0; i < options.length - 1; i += 1) {
    const from = options[i];
    const to = options[i + 1];
    bands.push({
      id: `${from.value}-${to.value}`,
      label: `AED ${clean(from.label)} – ${clean(to.label)}`,
      min: from.value,
      max: to.value,
    });
  }

  const top = options[options.length - 1];
  bands.push({ id: `${top.value}-up`, label: `AED ${clean(top.label)}+`, min: top.value });
  return bands;
}

export const searchData = {
  /** Areas offered as hero typeahead suggestions and in the Section 02 select. */
  locations: [
    'Palm Jumeirah',
    'Dubai Marina',
    'Downtown Dubai',
    'Business Bay',
    'Dubai Hills Estate',
    'JBR',
    'JVC',
    'Arabian Ranches',
    'DAMAC Hills',
    'Dubai Harbour',
    'DIFC',
    'Mohammed Bin Rashid City',
    'Emaar Beachfront',
    'Bluewaters Island',
  ],

  propertyTypes: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Plot', 'Commercial'],

  beds: ['Studio', '1', '2', '3', '4', '5+'],

  handover: ['Ready', '2026', '2027', '2028', '2029+'],

  salePrices,
  rentPrices,
  saleBands: buildPriceBands(salePrices, 'Any Price'),
  rentBands: buildPriceBands(rentPrices, 'Any Rent'),

  /** Where each offering sends the visitor on submit. */
  destinations: {
    buy: '/properties',
    rent: '/properties',
    offplan: '/off-plan',
  } satisfies Record<Offering, string>,
};

/**
 * Section 02's search bar keeps four fields on every tab; only the third and
 * fourth change meaning with the offering.
 */
export const searchFields: Record<
  Offering,
  { thirdLabel: string; thirdOptions: string[]; thirdParam: string; priceLabel: string; bands: PriceBand[] }
> = {
  buy: {
    thirdLabel: 'Bedrooms',
    thirdOptions: searchData.beds,
    thirdParam: 'beds',
    priceLabel: 'Price Range',
    bands: searchData.saleBands,
  },
  rent: {
    thirdLabel: 'Bedrooms',
    thirdOptions: searchData.beds,
    thirdParam: 'beds',
    priceLabel: 'Rent (Yearly)',
    bands: searchData.rentBands,
  },
  offplan: {
    thirdLabel: 'Handover',
    thirdOptions: searchData.handover,
    thirdParam: 'handover',
    priceLabel: 'Starting Price',
    bands: searchData.saleBands,
  },
};

export const heroSearch = {
  tabs: [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'offplan', label: 'Off Plan' },
  ] satisfies { id: Offering; label: string }[],

  destinations: searchData.destinations,
  placeholder: 'Area, project or community',
  locations: searchData.locations,
  beds: searchData.beds,
  salePrices: searchData.salePrices,
  rentPrices: searchData.rentPrices,
};

/* -------------------------------------------------------------------------- */
/*  HERO MARQUEE — DEVELOPMENT PARTNERS                                       */
/* -------------------------------------------------------------------------- */

/**
 * DEMO PLACEHOLDER — partner logos.
 * These render as letter-spaced uppercase wordmarks for the demo.
 *
 * TO SWAP IN REAL LOGOS: drop monochrome white SVGs into /public/partners/
 * (e.g. /public/partners/emaar.svg) and set `logo` on the partner below.
 * PartnerMarquee renders `logo` as an <img> when present, otherwise the
 * `name` wordmark — no component changes needed.
 */
export type Partner = { name: string; logo?: string };

export const partners: Partner[] = [
  { name: 'Emaar' /* logo: '/partners/emaar.svg' */ },
  { name: 'Nakheel' },
  { name: 'Damac' },
  { name: 'Sobha' },
  { name: 'Ellington' },
  { name: 'Meraas' },
  { name: 'Omniyat' },
  { name: 'Binghatti' },
  { name: 'Select Group' },
  { name: 'Aldar' },
];

export const partnersLabel = 'Our Development Partners';

/* -------------------------------------------------------------------------- */
/*  SECTION 03 — SOLUTIONS (bento grid)                                       */
/* -------------------------------------------------------------------------- */

export type SolutionTile = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  external?: boolean;
  image?: string;
  alt?: string;
  /** Layout span on the 4-column desktop bento grid. */
  span: 'large' | 'tall' | 'wide' | 'standard';
  /** Renders the charcoal editorial card instead of a photo tile. */
  variant?: 'report';
  reportLabel?: string;
  reportKicker?: string;
};

export const solutions = {
  eyebrow: 'Solutions',
  heading: 'What Can We Help You With?',
  intro:
    'From a first conversation to handover, furnishing and management — every part of owning property in Dubai, handled under one roof.',
  tiles: [
    {
      id: 'specialist',
      title: 'Connect With a Specialist',
      subtitle: 'Speak directly with a DRP advisor',
      href: '#contact',
      image: drpPhoto(2),
      alt: 'The DRP office on Golden Mile, Palm Jumeirah',
      span: 'large',
    },
    {
      id: 'list',
      title: 'List Your Property',
      subtitle: 'Sell or lease with DRP',
      href: '/list-your-property',
      image: unsplash('1580587771525-78b9dba3b914'),
      alt: 'A contemporary villa with a lit pool at twilight',
      span: 'large',
    },
    {
      id: 'ready',
      title: 'Find a Ready Property',
      subtitle: 'Explore properties available now for sale or rent',
      href: '/properties',
      image: unsplash('1616486338812-3dadae4b4ace'),
      alt: 'A bright, furnished living room in a ready Dubai apartment',
      span: 'standard',
    },
    {
      id: 'offplan',
      title: 'Explore Off-Plan Collections',
      subtitle: 'Discover selected new developments',
      href: '/off-plan',
      image: unsplash('1504307651254-35680f356dfd'),
      alt: 'Construction crews at work on a new development',
      span: 'standard',
    },
    {
      id: 'report',
      title: 'Download H1 2026 Market Report',
      subtitle: 'Dubai property market intelligence',
      href: '/market-report',
      span: 'tall',
      variant: 'report',
      reportKicker: 'H1 2026',
      reportLabel: 'Download',
    },
    {
      id: 'areas',
      title: 'Explore Dubai Areas',
      subtitle: 'Discover communities across Dubai',
      href: '/areas',
      image: unsplash('1526495124232-a04e1849168c'),
      alt: 'The Downtown Dubai skyline at dusk',
      span: 'standard',
    },
    {
      id: 'holiday',
      title: 'Holiday Homes',
      subtitle: 'Stay with DRP or list your property',
      href: 'https://dubairapidproperties.com/holiday-home',
      external: true,
      image: unsplash('1564013799919-ab600027ffc6'),
      alt: 'A sunlit holiday home terrace with sea views',
      span: 'standard',
    },
    {
      id: 'furnishings',
      title: 'Furnishings',
      subtitle: 'Furnish and prepare your property',
      href: '/furnishings',
      image: unsplash('1586023492125-27b2c045efd7'),
      alt: 'A styled living room with designer furniture',
      span: 'standard',
    },
    {
      id: 'fleet',
      title: 'DRP Car Fleet',
      subtitle: 'Explore our vehicle services',
      href: '/ecosystem/car-fleet',
      image: unsplash('1503376780353-7e6692767b70'),
      alt: 'A luxury car parked outside a modern residence',
      span: 'standard',
    },
    {
      id: 'ecosystem',
      title: 'DRP Ecosystem',
      subtitle: 'Discover all DRP services and solutions',
      href: '/ecosystem',
      image: unsplash('1580674684081-7617fbf3d745', 2000),
      alt: 'The Dubai skyline seen across the city',
      span: 'wide',
    },
  ] satisfies SolutionTile[],
};

/* -------------------------------------------------------------------------- */
/*  SECTION 02 — EXPLORE PROPERTIES                                           */
/* -------------------------------------------------------------------------- */

export type ReadyProperty = {
  id: string;
  title: string;
  price: string;
  type: string;
  location: string;
  beds: string;
  baths?: string;
  area: string;
  status?: string;
  image: string;
  alt: string;
  href: string;
};

/** Real DRP listings. */
export const readyProperties: ReadyProperty[] = [
  {
    id: 'palm-garden-home',
    title: 'Exquisite Garden Home Villa on Palm Jumeirah',
    price: 'AED 30,000,000',
    type: 'Villa',
    location: 'Palm Jumeirah',
    beds: '4 BR',
    baths: '5 BA',
    area: '5,200 sq ft',
    status: 'For Sale',
    image: unsplash('1600585154340-be6161a56a0c'),
    alt: 'A garden home villa with private beach frontage on Palm Jumeirah',
    href: '/properties/exquisite-garden-home-villa-palm-jumeirah',
  },
  {
    id: 'beach-access-furnished',
    title: 'Beach Access | Prime Location | Furnished',
    price: 'AED 3,800,000',
    type: 'Apartment',
    location: 'Jumeirah Beach Residence',
    beds: '2 BR',
    baths: '3 BA',
    area: '1,480 sq ft',
    status: 'For Sale',
    image: unsplash('1493809842364-78817add7ffb'),
    alt: 'A furnished apartment living area with floor to ceiling windows',
    href: '/properties/beach-access-prime-location-furnished',
  },
  {
    id: 'luxurious-best-deal',
    title: 'Luxurious | Prime Location | Best Deal',
    price: 'AED 2,100,000',
    type: 'Apartment',
    location: 'Business Bay',
    beds: '1 BR',
    baths: '1 BA',
    area: '860 sq ft',
    status: 'For Sale',
    image: unsplash('1600607687939-ce8a6c25118c'),
    alt: 'A contemporary one bedroom apartment interior',
    href: '/properties/luxurious-prime-location-best-deal',
  },
  {
    id: 'private-pool-2br',
    title: 'Luxury 2BR Apartment with Private Pool',
    price: 'AED 1,900,000',
    type: 'Apartment',
    location: 'Dubai Hills Estate',
    beds: '2 BR',
    baths: '2 BA',
    area: '1,240 sq ft',
    status: 'For Sale',
    image: unsplash('1600566753086-00f18fb6b3ea'),
    alt: 'An apartment terrace with a private plunge pool',
    href: '/properties/luxury-2br-apartment-private-pool',
  },
];

export type RentalProperty = {
  id: string;
  title: string;
  /** Rendered in serif; `period` follows in smaller grey sans. */
  price: string;
  period: string;
  type: string;
  location: string;
  beds: string;
  baths: string;
  area: string;
  status: string;
  image: string;
  alt: string;
  href: string;
};

// DEMO PLACEHOLDERS – replace with real rental listings
export const rentalProperties: RentalProperty[] = [
  {
    id: 'palm-shoreline-2br',
    title: 'Sea View 2BR | Shoreline Apartments | Furnished',
    price: 'AED 240,000',
    period: '/ year',
    type: 'Apartment',
    location: 'Palm Jumeirah',
    beds: '2 BR',
    baths: '3 BA',
    area: '1,650 sq ft',
    status: 'For Rent',
    image: unsplash('1522708323590-d24dbb6b0267'),
    alt: 'A furnished sea-view living room on Palm Jumeirah',
    href: '/properties/sea-view-2br-shoreline-apartments',
  },
  {
    id: 'marina-upgraded-1br',
    title: 'Upgraded 1BR | Marina View | Chiller Free',
    price: 'AED 125,000',
    period: '/ year',
    type: 'Apartment',
    location: 'Dubai Marina',
    beds: '1 BR',
    baths: '2 BA',
    area: '850 sq ft',
    status: 'For Rent',
    image: unsplash('1524758631624-e2822e304c36'),
    alt: 'An upgraded one bedroom apartment overlooking Dubai Marina',
    href: '/properties/upgraded-1br-marina-view',
  },
  {
    id: 'downtown-burj-view-3br',
    title: 'Burj Khalifa View 3BR | High Floor',
    price: 'AED 330,000',
    period: '/ year',
    type: 'Apartment',
    location: 'Downtown Dubai',
    beds: '3 BR',
    baths: '4 BA',
    area: '1,950 sq ft',
    status: 'For Rent',
    image: unsplash('1600607687920-4e2a09cf159d'),
    alt: 'A high-floor Downtown Dubai apartment interior',
    href: '/properties/burj-khalifa-view-3br-high-floor',
  },
  {
    id: 'ranches-family-villa',
    title: 'Family Villa | Private Garden | Vacant',
    price: 'AED 290,000',
    period: '/ year',
    type: 'Villa',
    location: 'Arabian Ranches',
    beds: '4 BR',
    baths: '5 BA',
    area: '3,800 sq ft',
    status: 'For Rent',
    image: unsplash('1613977257363-707ba9348227'),
    alt: 'A family villa with a private garden in Arabian Ranches',
    href: '/properties/family-villa-private-garden-arabian-ranches',
  },
];

export type OffPlanProject = {
  id: string;
  title: string;
  developer: string;
  community: string;
  fromPrice: string;
  handover: string;
  paymentPlan: string;
  image: string;
  alt: string;
  href: string;
};

/** The homepage's off-plan tab shows four projects from /data/offPlan.ts. */
export const offPlanProjects: OffPlanProject[] = featuredProjects.map((p) => ({
  id: p.slug,
  title: p.name,
  developer: p.developer,
  community: p.area,
  fromPrice: `From ${formatAed(p.fromPrice)}`,
  handover: handoverLabel(p),
  paymentPlan: p.paymentPlan,
  image: p.image,
  alt: p.alt,
  href: projectHref(p.slug),
}));

export const exploreProperties = {
  eyebrow: 'Explore Real Estate',
  heading: 'Selected Properties',
  /** Tab ids match the shared `Offering` union so both search bars agree. */
  tabs: [
    {
      id: 'buy',
      label: 'Ready to Buy',
      viewAll: { label: 'View All Properties', href: '/properties?offering=buy' },
    },
    {
      id: 'rent',
      label: 'For Rent',
      viewAll: { label: 'View All Properties', href: '/properties?offering=rent' },
    },
    {
      id: 'offplan',
      label: 'Off-Plan',
      viewAll: { label: 'View All Off-Plan Projects', href: '/off-plan' },
    },
  ] satisfies {
    id: Offering;
    label: string;
    viewAll: { label: string; href: string };
  }[],
};

/* -------------------------------------------------------------------------- */
/*  SECTION 04 — NEWS & INSIGHTS                                              */
/* -------------------------------------------------------------------------- */

export type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  alt: string;
  href: string;
};

/**
 * DEMO PLACEHOLDERS — replace with real posts from the DRP Magazine feed.
 * Titles, excerpts and dates are illustrative but written in DRP's voice.
 */
export const news = {
  eyebrow: 'News & Insights',
  heading: 'Stay Ahead Of The Market.',
  viewAll: {
    label: 'View All News',
    href: 'https://dubairapidproperties.com/drp-magazine/',
  },
  articles: [
    {
      id: 'h1-2026-report',
      category: 'Market Reports',
      title: 'Dubai Residential Market: What H1 2026 Tells Us',
      excerpt:
        'Transaction volumes, prime price movement and where the next wave of demand is forming across the city.',
      date: '12 September 2026',
      image: unsplash('1512453979798-5ea266f8880c'),
      alt: 'An aerial view of the Dubai skyline at dusk',
      href: '/magazine/dubai-residential-market-h1-2026',
    },
    {
      id: 'palm-prime',
      category: 'Dubai Property News',
      title: 'Why Palm Jumeirah Still Sets the Benchmark for Prime',
      excerpt:
        'Limited supply, beachfront scarcity and a maturing resale market continue to underpin values on the island.',
      date: '28 August 2026',
      image: unsplash('1518684079-3c830dcef090'),
      alt: 'The Jumeirah beachfront and Burj Al Arab',
      href: '/magazine/palm-jumeirah-prime-benchmark',
    },
    {
      id: 'offplan-vs-ready',
      category: 'Investment Insights',
      title: 'Off-Plan or Ready? Structuring a Dubai Portfolio in 2026',
      excerpt:
        'Payment plans, yield timing and exit liquidity — how experienced investors are balancing the two.',
      date: '15 August 2026',
      image: unsplash('1454165804606-c3d57bc86b40'),
      alt: 'Investors reviewing documents around a meeting table',
      href: '/magazine/off-plan-or-ready-2026',
    },
    {
      id: 'new-launches',
      category: 'New Launches',
      title: 'Five Launches Worth Watching This Quarter',
      excerpt:
        'A shortlist of new releases from Emaar, Nakheel and Sobha, and what makes each one worth a second look.',
      date: '02 August 2026',
      image: unsplash('1541976590-713941681591'),
      alt: 'A newly launched residential tower in Dubai',
      href: '/magazine/launches-worth-watching',
    },
    {
      id: 'golden-visa',
      category: 'Investment Insights',
      title: 'Property and the Golden Visa: A Practical Guide',
      excerpt:
        'Thresholds, eligibility and the paperwork sequence — what property buyers actually need to prepare.',
      date: '19 July 2026',
      image: unsplash('1521791136064-7986c2920216'),
      alt: 'Two people shaking hands after completing a property transaction',
      href: '/magazine/property-and-the-golden-visa',
    },
    {
      id: 'arabian-business',
      category: 'Arabian Business',
      title: 'DRP in Arabian Business: Two Decades on the Island',
      excerpt:
        'Our founders on building a Palm Jumeirah agency through three market cycles since 2007.',
      date: '04 July 2026',
      image: unsplash('1556761175-5973dc0f32e7'),
      alt: 'A business interview taking place in a Dubai office',
      href: '/magazine/drp-arabian-business-feature',
    },
    {
      id: 'holiday-home-yields',
      category: 'Market Reports',
      title: 'Holiday Home Yields: Reading the 2026 Season',
      excerpt:
        'Occupancy, average daily rates and which communities outperformed over the winter season.',
      date: '21 June 2026',
      image: unsplash('1567767292278-a4f21aa2d36e'),
      alt: 'The living room of a furnished Dubai holiday home',
      href: '/magazine/holiday-home-yields-2026',
    },
  ] satisfies Article[],
};

/* -------------------------------------------------------------------------- */
/*  SECTION 05 — WHY CLIENTS TRUST DRP                                        */
/* -------------------------------------------------------------------------- */

export type TrustStat = {
  id: string;
  label: string;
  support: string;
  /** Renders as an animated count-up when present. */
  value?: number;
  countFrom?: number;
  /** Used instead of `value` for the wordmark-style facts. */
  title?: string;
};

export const trustStats: TrustStat[] = [
  {
    id: 'established',
    value: 2007,
    countFrom: 1990,
    label: 'Established',
    support: 'Nearly two decades advising buyers, sellers and investors in Dubai.',
  },
  {
    id: 'global',
    title: 'Dubai-Based, Internationally Connected',
    label: 'Global reach',
    support: 'Headquartered on Palm Jumeirah, working with clients across 40+ countries.',
  },
  {
    id: 'ecosystem',
    title: 'Full Property Ecosystem',
    label: 'One team',
    support: 'Sales, leasing, holiday homes, furnishing and management under one roof.',
  },
];

export const trust = {
  eyebrow: 'Why Our Clients Trust Us',
  stats: trustStats,
  /** DEMO PLACEHOLDER — confirm the live Google rating before launch. */
  ratingLine: 'Rated 4.9 on Google',
};

export type Review = {
  id: string;
  quote: string;
  name: string;
  source: string;
  stars: number;
};

// DEMO PLACEHOLDERS – replace with real Google reviews before launch
export const reviews: Review[] = [
  {
    id: 'r1',
    quote:
      'They understood exactly what we were looking for on the Palm and never wasted our time with the wrong properties.',
    name: 'Alexander M.',
    source: 'Google Review',
    stars: 5,
  },
  {
    id: 'r2',
    quote:
      'We bought off-plan from London and the team handled every step remotely. Completely straightforward.',
    name: 'Priya S.',
    source: 'Google Review',
    stars: 5,
  },
  {
    id: 'r3',
    quote:
      'Honest advice on what our villa was really worth, and it sold within six weeks of listing.',
    name: 'Daniel K.',
    source: 'Google Review',
    stars: 5,
  },
  {
    id: 'r4',
    quote:
      'They furnished and let our apartment while we were abroad. The reporting has been faultless.',
    name: 'Sofia R.',
    source: 'Google Review',
    stars: 5,
  },
  {
    id: 'r5',
    quote:
      'A genuinely knowledgeable team. Their read on the market saved us from a poor investment.',
    name: 'Omar A.',
    source: 'Google Review',
    stars: 5,
  },
  {
    id: 'r6',
    quote:
      'Professional from the first call to handover. We have since bought a second property through them.',
    name: 'Claire D.',
    source: 'Google Review',
    stars: 5,
  },
];

/* -------------------------------------------------------------------------- */
/*  SECTION 06 — CONTACT                                                      */
/* -------------------------------------------------------------------------- */

export const contactSection = {
  eyebrow: 'Get In Touch',
  heading: 'Speak With a Real Estate Specialist Today',
  paragraph:
    "Whether you're looking to buy, invest, sell or manage a property, our team is ready to assist.",
  image: drpPhoto(12),
  imageAlt: 'Inside the DRP office on Palm Jumeirah',
  interests: [
    'Buying',
    'Off-Plan Investment',
    'Selling',
    'Renting',
    'Property Management',
    'Holiday Homes',
    'Furnishings',
    'Other',
  ],
  submitLabel: 'Connect With DRP',
  successTitle: 'Thank you — your enquiry is with us.',
  successBody:
    'A DRP specialist will be in touch shortly. For anything urgent, call or WhatsApp us directly.',
};

/* -------------------------------------------------------------------------- */
/*  FOOTER                                                                    */
/* -------------------------------------------------------------------------- */

export const footer = {
  tagline:
    'A Palm Jumeirah real estate agency since 2007 — property, investment and management across Dubai.',
  columns: [
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Meet the Team', href: '/about/team' },
        { label: 'Careers', href: '/careers' },
        { label: 'DRP Ecosystem', href: '/ecosystem' },
        { label: 'News & Blogs', href: 'https://dubairapidproperties.com/drp-magazine/', external: true },
        { label: 'Contact Us', href: '#contact' },
      ],
    },
    {
      heading: 'Real Estate',
      links: [
        { label: 'Properties', href: '/properties' },
        { label: 'Off-Plan', href: '/off-plan' },
        { label: 'Explore Dubai Areas', href: '/areas' },
        { label: 'List Your Property', href: '/list-your-property' },
      ],
    },
    {
      heading: 'Services',
      links: [
        { label: 'Holiday Homes', href: 'https://dubairapidproperties.com/holiday-home', external: true },
        { label: 'Fit Out', href: '/fit-out' },
        { label: 'Interior Design', href: '/interior-design' },
        { label: 'Furnishings', href: '/furnishings' },
        { label: 'Car Fleet', href: '/ecosystem/car-fleet' },
        { label: 'Owner Portal', href: '/owner-portal' },
      ],
    },
  ] satisfies { heading: string; links: NavItem[] }[],
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' },
  ],
  /** Subtle closing line above the legal bar. */
  careersNote: {
    text: 'Interested in joining DRP?',
    linkLabel: 'View open positions',
    href: '/careers',
  },
  legal: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
  copyright: '© 2026 Dubai Rapid Properties. All rights reserved.',
};
