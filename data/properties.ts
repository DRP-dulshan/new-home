/**
 * ============================================================================
 *  READY PROPERTIES — SALE + RENTAL LISTINGS
 * ============================================================================
 *  Drives /properties (Buy / Rent explorer), /properties/[slug] and the
 *  homepage "Selected Properties" tabs.
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
import { unsplash } from '@/lib/media';
import type { ReadyProperty, RentalProperty } from './homepage';

export type Offering = 'buy' | 'rent';
export type ListingType = 'Apartment' | 'Penthouse' | 'Townhouse' | 'Villa';
export type Furnishing = 'Furnished' | 'Unfurnished' | 'Partly furnished';

export type Listing = {
  slug: string;
  ref: string;
  title: string;
  offering: Offering;
  /** AED. Rentals are per year. */
  price: number;
  type: ListingType;
  /** Must match an area name in /data/areas.ts so the area guide can list it. */
  area: string;
  building?: string;
  /** 0 = studio */
  beds: number;
  baths: number;
  /** sq ft */
  size: number;
  furnishing: Furnishing;
  listedAt: string;
  images: { src: string; alt: string }[];
  description: string[];
  features: string[];
};

const img = (id: string, alt: string) => ({ src: unsplash(id, 1800), alt });

/* The four sale listings marked REAL are DRP's own; their titles, prices and
   specs come from the live site. Descriptions, features, references and every
   rental below are DEMO PLACEHOLDERS – confirm or replace before launch. */
export const listings: Listing[] = [
  /* ------------------------------ FOR SALE ------------------------------ */
  {
    // REAL
    slug: 'exquisite-garden-home-villa-palm-jumeirah',
    ref: 'DRP-S-1041',
    title: 'Exquisite Garden Home Villa on Palm Jumeirah',
    offering: 'buy',
    price: 30_000_000,
    type: 'Villa',
    area: 'Palm Jumeirah',
    building: 'Garden Homes, Frond',
    beds: 4,
    baths: 5,
    size: 5_200,
    furnishing: 'Unfurnished',
    listedAt: '2026-09-04',
    images: [
      img('1600585154340-be6161a56a0c', 'The villa with its private beach frontage'),
      img('1580587771525-78b9dba3b914', 'The pool terrace lit at twilight'),
      img('1616486338812-3dadae4b4ace', 'A bright double-height living room'),
    ],
    description: [
      'A fully upgraded Garden Home on one of the most sought-after fronds of Palm Jumeirah, with direct beach access and open views across the water to the Dubai Marina skyline.',
      'The ground floor opens entirely onto the garden and pool, with a formal living room, family kitchen and a guest suite. Upstairs, the principal suite has its own terrace and a dressing room.',
    ],
    features: [
      'Private beach access',
      'Private pool and landscaped garden',
      'Fully upgraded throughout',
      "Maid's room and laundry",
      'Covered parking for two cars',
      'Vacant on transfer',
    ],
  },
  {
    // REAL
    slug: 'beach-access-prime-location-furnished',
    ref: 'DRP-S-1038',
    title: 'Beach Access | Prime Location | Furnished',
    offering: 'buy',
    price: 3_800_000,
    type: 'Apartment',
    area: 'Jumeirah Beach Residence',
    building: 'Sadaf',
    beds: 2,
    baths: 3,
    size: 1_480,
    furnishing: 'Furnished',
    listedAt: '2026-08-22',
    images: [
      img('1493809842364-78817add7ffb', 'A furnished living area with floor-to-ceiling windows'),
      img('1564013799919-ab600027ffc6', 'The sea-view terrace'),
      img('1600607687939-ce8a6c25118c', 'The principal bedroom'),
    ],
    description: [
      'A furnished two-bedroom apartment on The Walk at JBR, a short walk from the beach, with a balcony facing the sea.',
      'Both bedrooms are en suite, with a guest cloakroom, a separate kitchen and residents’ pools and gym in the building. Popular with holiday-home owners for its location.',
    ],
    features: [
      'Steps from the beach',
      'Balcony with sea views',
      'Sold furnished',
      'Residents’ pool and gym',
      'One parking space',
    ],
  },
  {
    // REAL
    slug: 'luxurious-prime-location-best-deal',
    ref: 'DRP-S-1035',
    title: 'Luxurious | Prime Location | Best Deal',
    offering: 'buy',
    price: 2_100_000,
    type: 'Apartment',
    area: 'Business Bay',
    building: 'Canal-front tower',
    beds: 1,
    baths: 1,
    size: 860,
    furnishing: 'Partly furnished',
    listedAt: '2026-08-10',
    images: [
      img('1600607687939-ce8a6c25118c', 'A contemporary one bedroom apartment interior'),
      img('1524758631624-e2822e304c36', 'The living area by the window'),
      img('1586023492125-27b2c045efd7', 'A styled living space'),
    ],
    description: [
      'A one-bedroom apartment in a canal-front tower in Business Bay, minutes from Downtown Dubai and DIFC.',
      'Open-plan living and kitchen, a generous bedroom with built-in wardrobes and a balcony over the Dubai Water Canal. A strong rental performer.',
    ],
    features: [
      'Dubai Water Canal views',
      'Balcony',
      'Infinity pool and gym',
      'Close to Downtown and DIFC',
      'One parking space',
    ],
  },
  {
    // REAL
    slug: 'luxury-2br-apartment-private-pool',
    ref: 'DRP-S-1032',
    title: 'Luxury 2BR Apartment with Private Pool',
    offering: 'buy',
    price: 1_900_000,
    type: 'Apartment',
    area: 'Dubai Hills Estate',
    beds: 2,
    baths: 2,
    size: 1_240,
    furnishing: 'Unfurnished',
    listedAt: '2026-07-28',
    images: [
      img('1600566753086-00f18fb6b3ea', 'The terrace with its private plunge pool'),
      img('1512917774080-9991f1c4c750', 'The living space opening onto the terrace'),
      img('1600607687920-4e2a09cf159d', 'The kitchen and dining area'),
    ],
    description: [
      'A rare two-bedroom apartment in Dubai Hills Estate with its own private pool on a wide terrace overlooking the park.',
      'Bright open-plan living, two en-suite bedrooms and direct access to the community’s parks, schools and Dubai Hills Mall.',
    ],
    features: [
      'Private plunge pool',
      'Park-facing terrace',
      'Close to Dubai Hills Mall',
      'Schools within walking distance',
      'One parking space',
    ],
  },
  {
    slug: 'palm-jumeirah-sky-penthouse',
    ref: 'DRP-S-1044',
    title: 'Full-Floor Sky Penthouse | Palm Jumeirah',
    offering: 'buy',
    price: 14_500_000,
    type: 'Penthouse',
    area: 'Palm Jumeirah',
    building: 'Golden Mile',
    beds: 4,
    baths: 5,
    size: 4_100,
    furnishing: 'Furnished',
    listedAt: '2026-09-18',
    images: [
      img('1522708323590-d24dbb6b0267', 'A sea-view living room'),
      img('1564013799919-ab600027ffc6', 'The wraparound terrace'),
      img('1616486338812-3dadae4b4ace', 'The principal suite'),
    ],
    description: [
      'A full-floor penthouse on the trunk of Palm Jumeirah with uninterrupted views to the Arabian Gulf on one side and the Dubai skyline on the other.',
      'Four en-suite bedrooms, a wraparound terrace and a private lift lobby. Offered fully furnished by DRP Interiors.',
    ],
    features: [
      'Full floor with private lift',
      'Wraparound terrace',
      'Sea and skyline views',
      'Furnished by DRP Interiors',
      'Three parking spaces',
    ],
  },
  {
    slug: 'marina-gate-3br-high-floor',
    ref: 'DRP-S-1043',
    title: 'High-Floor 3BR | Full Marina View',
    offering: 'buy',
    price: 4_250_000,
    type: 'Apartment',
    area: 'Dubai Marina',
    building: 'Marina Gate',
    beds: 3,
    baths: 4,
    size: 1_850,
    furnishing: 'Unfurnished',
    listedAt: '2026-09-11',
    images: [
      img('1524758631624-e2822e304c36', 'The living area overlooking Dubai Marina'),
      img('1600607687920-4e2a09cf159d', 'The open kitchen'),
      img('1600607687939-ce8a6c25118c', 'A bedroom'),
    ],
    description: [
      'A high-floor three-bedroom apartment with full views over the marina and out to the sea.',
      'Floor-to-ceiling glass, a separate family room and a maid’s room, in a building with direct access to the Marina Walk and the tram.',
    ],
    features: ['Full marina view', "Maid's room", 'Direct Marina Walk access', 'Two parking spaces'],
  },
  {
    slug: 'downtown-boulevard-studio',
    ref: 'DRP-S-1040',
    title: 'Boulevard Studio | Burj Khalifa View',
    offering: 'buy',
    price: 1_150_000,
    type: 'Apartment',
    area: 'Downtown Dubai',
    building: 'Boulevard tower',
    beds: 0,
    baths: 1,
    size: 520,
    furnishing: 'Furnished',
    listedAt: '2026-08-30',
    images: [
      img('1600607687920-4e2a09cf159d', 'A high-floor Downtown Dubai apartment interior'),
      img('1586023492125-27b2c045efd7', 'The furnished living space'),
    ],
    description: [
      'A furnished studio on Mohammed Bin Rashid Boulevard with a direct view of the Burj Khalifa.',
      'Ideal as a first investment or a holiday home, with strong year-round short-stay demand in Downtown Dubai.',
    ],
    features: ['Burj Khalifa view', 'Sold furnished', 'Holiday-home ready', 'Pool and gym'],
  },
  {
    slug: 'arabian-ranches-3br-townhouse',
    ref: 'DRP-S-1036',
    title: 'Family Townhouse | Close to Pool and Park',
    offering: 'buy',
    price: 2_950_000,
    type: 'Townhouse',
    area: 'Arabian Ranches',
    beds: 3,
    baths: 4,
    size: 2_400,
    furnishing: 'Unfurnished',
    listedAt: '2026-08-14',
    images: [
      img('1613977257363-707ba9348227', 'A family home with a private garden'),
      img('1512917774080-9991f1c4c750', 'The living space opening onto the garden'),
    ],
    description: [
      'A three-bedroom townhouse on a quiet street in Arabian Ranches, a short walk from the community pool and park.',
      'Private garden, a family room upstairs and covered parking. Close to schools and the Ranches Souk.',
    ],
    features: ['Private garden', 'Walk to pool and park', 'Close to schools', 'Covered parking'],
  },

  /* ------------------------------ FOR RENT ------------------------------ */
  {
    slug: 'sea-view-2br-shoreline-apartments',
    ref: 'DRP-R-2051',
    title: 'Sea View 2BR | Shoreline Apartments | Furnished',
    offering: 'rent',
    price: 240_000,
    type: 'Apartment',
    area: 'Palm Jumeirah',
    building: 'Shoreline Apartments',
    beds: 2,
    baths: 3,
    size: 1_650,
    furnishing: 'Furnished',
    listedAt: '2026-09-15',
    images: [
      img('1522708323590-d24dbb6b0267', 'A furnished sea-view living room'),
      img('1564013799919-ab600027ffc6', 'The sea-view balcony'),
      img('1600607687939-ce8a6c25118c', 'A bedroom'),
    ],
    description: [
      'A furnished two-bedroom apartment in Shoreline with direct beach access and sea views from the living room.',
      'Residents enjoy private beach clubs, pools and a gym, with the Golden Mile shops and restaurants on the doorstep.',
    ],
    features: ['Private beach access', 'Sea view', 'Furnished', 'Up to 4 cheques', 'One parking space'],
  },
  {
    slug: 'upgraded-1br-marina-view',
    ref: 'DRP-R-2048',
    title: 'Upgraded 1BR | Marina View | Chiller Free',
    offering: 'rent',
    price: 125_000,
    type: 'Apartment',
    area: 'Dubai Marina',
    beds: 1,
    baths: 2,
    size: 850,
    furnishing: 'Unfurnished',
    listedAt: '2026-09-08',
    images: [
      img('1524758631624-e2822e304c36', 'An upgraded one bedroom apartment overlooking Dubai Marina'),
      img('1600607687920-4e2a09cf159d', 'The kitchen'),
    ],
    description: [
      'An upgraded one-bedroom apartment with a marina view and chiller included in the rent.',
      'New kitchen and flooring, a guest cloakroom and a balcony. Walking distance to the metro and tram.',
    ],
    features: ['Chiller free', 'Marina view', 'Fully upgraded', 'Near metro and tram'],
  },
  {
    slug: 'burj-khalifa-view-3br-high-floor',
    ref: 'DRP-R-2045',
    title: 'Burj Khalifa View 3BR | High Floor',
    offering: 'rent',
    price: 330_000,
    type: 'Apartment',
    area: 'Downtown Dubai',
    beds: 3,
    baths: 4,
    size: 1_950,
    furnishing: 'Partly furnished',
    listedAt: '2026-08-27',
    images: [
      img('1600607687920-4e2a09cf159d', 'A high-floor Downtown Dubai apartment interior'),
      img('1616486338812-3dadae4b4ace', 'The living room'),
    ],
    description: [
      'A high-floor three-bedroom apartment facing the Burj Khalifa and the Dubai Fountain.',
      'Large reception, separate kitchen and a maid’s room, with direct access to Dubai Mall through the Boulevard.',
    ],
    features: ['Burj Khalifa and Fountain view', "Maid's room", 'Close to Dubai Mall', 'Two parking spaces'],
  },
  {
    slug: 'family-villa-private-garden-arabian-ranches',
    ref: 'DRP-R-2042',
    title: 'Family Villa | Private Garden | Vacant',
    offering: 'rent',
    price: 290_000,
    type: 'Villa',
    area: 'Arabian Ranches',
    beds: 4,
    baths: 5,
    size: 3_800,
    furnishing: 'Unfurnished',
    listedAt: '2026-08-19',
    images: [
      img('1613977257363-707ba9348227', 'A family villa with a private garden'),
      img('1512917774080-9991f1c4c750', 'The living space opening onto the garden'),
    ],
    description: [
      'A vacant four-bedroom family villa with a large private garden in Arabian Ranches.',
      'Ground-floor guest bedroom, family room, maid’s room and a double garage. Close to the community schools.',
    ],
    features: ['Large private garden', 'Vacant now', "Maid's room", 'Double garage'],
  },
  {
    slug: 'business-bay-canal-view-1br',
    ref: 'DRP-R-2053',
    title: 'Canal View 1BR | Business Bay',
    offering: 'rent',
    price: 105_000,
    type: 'Apartment',
    area: 'Business Bay',
    beds: 1,
    baths: 1,
    size: 780,
    furnishing: 'Furnished',
    listedAt: '2026-09-20',
    images: [
      img('1586023492125-27b2c045efd7', 'A furnished living space'),
      img('1600607687939-ce8a6c25118c', 'The bedroom'),
    ],
    description: [
      'A furnished one-bedroom apartment overlooking the Dubai Water Canal, ten minutes from Downtown and DIFC.',
      'Move-in ready with linen and kitchenware, and a pool and gym in the building.',
    ],
    features: ['Canal view', 'Move-in ready', 'Pool and gym', 'One parking space'],
  },
  {
    slug: 'dubai-hills-5br-villa',
    ref: 'DRP-R-2050',
    title: 'Golf-Facing 5BR Villa | Dubai Hills Estate',
    offering: 'rent',
    price: 520_000,
    type: 'Villa',
    area: 'Dubai Hills Estate',
    beds: 5,
    baths: 6,
    size: 5_600,
    furnishing: 'Unfurnished',
    listedAt: '2026-09-12',
    images: [
      img('1600596542815-ffad4c1539a9', 'A villa with a private pool at dusk'),
      img('1616486338812-3dadae4b4ace', 'The living room'),
    ],
    description: [
      'A five-bedroom villa facing the Dubai Hills golf course, with a private pool and a landscaped garden.',
      'Five en-suite bedrooms, a cinema room and a maid’s room, minutes from Dubai Hills Mall and leading schools.',
    ],
    features: ['Golf course view', 'Private pool', 'Cinema room', 'Double garage'],
  },
  {
    slug: 'jbr-sea-view-2br',
    ref: 'DRP-R-2047',
    title: 'Sea View 2BR | Steps to the Beach',
    offering: 'rent',
    price: 185_000,
    type: 'Apartment',
    area: 'Jumeirah Beach Residence',
    beds: 2,
    baths: 3,
    size: 1_350,
    furnishing: 'Furnished',
    listedAt: '2026-09-02',
    images: [
      img('1493809842364-78817add7ffb', 'A furnished living area with sea light'),
      img('1564013799919-ab600027ffc6', 'The balcony'),
    ],
    description: [
      'A furnished two-bedroom apartment on The Walk at JBR with sea views and the beach across the road.',
      'Both bedrooms are en suite, with a balcony off the living room and residents’ pools.',
    ],
    features: ['Sea view', 'Furnished', 'Beach across the road', 'One parking space'],
  },
  {
    slug: 'palm-jumeirah-3br-townhouse',
    ref: 'DRP-R-2044',
    title: 'Beachside 3BR Townhouse | Palm Jumeirah',
    offering: 'rent',
    price: 380_000,
    type: 'Townhouse',
    area: 'Palm Jumeirah',
    beds: 3,
    baths: 4,
    size: 3_100,
    furnishing: 'Partly furnished',
    listedAt: '2026-08-24',
    images: [
      img('1600047509807-ba8f99d2cdde', 'A beachfront residence on Palm Jumeirah'),
      img('1512917774080-9991f1c4c750', 'The living space'),
    ],
    description: [
      'A three-bedroom townhouse on Palm Jumeirah with a private garden and access to a residents’ beach.',
      'Split over three floors with a roof terrace, maid’s room and two covered parking spaces.',
    ],
    features: ['Beach access', 'Roof terrace', 'Private garden', "Maid's room"],
  },
];

/* -------------------------------------------------------------------------- */
/*  HELPERS                                                                   */
/* -------------------------------------------------------------------------- */

export const listingHref = (slug: string) => `/properties/${slug}`;
export const getListing = (slug: string) => listings.find((l) => l.slug === slug);

export const saleListings = listings.filter((l) => l.offering === 'buy');
export const rentListings = listings.filter((l) => l.offering === 'rent');

export const formatPrice = (l: Listing) => `AED ${l.price.toLocaleString('en-US')}`;
export const bedsLabel = (beds: number) => (beds === 0 ? 'Studio' : `${beds} BR`);
export const bedsLong = (beds: number) =>
  beds === 0 ? 'Studio' : `${beds} Bedroom${beds === 1 ? '' : 's'}`;

/** Similar listings: same offering, same area first, then same type. */
export function similarListings(l: Listing, count = 3) {
  const pool = listings.filter((x) => x.offering === l.offering && x.slug !== l.slug);
  const score = (x: Listing) => (x.area === l.area ? 2 : 0) + (x.type === l.type ? 1 : 0);
  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, count);
}

/* -------------------------------------------------------------------------- */
/*  FILTERS                                                                   */
/* -------------------------------------------------------------------------- */

export const saleBands: PriceBand[] = [
  { id: 'under-2m', label: 'Under AED 2M', max: 2_000_000 },
  { id: '2m-5m', label: 'AED 2M – 5M', min: 2_000_000, max: 5_000_000 },
  { id: '5m-10m', label: 'AED 5M – 10M', min: 5_000_000, max: 10_000_000 },
  { id: '10m-up', label: 'AED 10M+', min: 10_000_000 },
];

export const rentBands: PriceBand[] = [
  { id: 'under-100k', label: 'Under AED 100K / yr', max: 100_000 },
  { id: '100k-200k', label: 'AED 100K – 200K / yr', min: 100_000, max: 200_000 },
  { id: '200k-350k', label: 'AED 200K – 350K / yr', min: 200_000, max: 350_000 },
  { id: '350k-up', label: 'AED 350K+ / yr', min: 350_000 },
];

function buildFacets(items: Listing[], bands: PriceBand[]): Facet<Listing>[] {
  return [
    {
      key: 'area',
      label: 'Area',
      options: asOptions(uniqueSorted(items.map((l) => l.area))),
      test: (l, sel) => sel.includes(l.area),
    },
    {
      key: 'type',
      label: 'Property Type',
      options: asOptions(uniqueSorted(items.map((l) => l.type))),
      test: (l, sel) => sel.includes(l.type),
    },
    {
      key: 'beds',
      label: 'Bedrooms',
      options: bedroomOptions.map(({ id, label }) => ({ id, label })),
      test: (l, sel) => bedroomOptions.some((o) => sel.includes(o.id) && o.test(l.beds)),
    },
    {
      key: 'price',
      label: 'Price Range',
      options: bands.map(({ id, label }) => ({ id, label })),
      test: (l, sel) => bands.some((b) => sel.includes(b.id) && inBand(l.price, b)),
    },
    {
      key: 'furnishing',
      label: 'Furnishing',
      options: asOptions(uniqueSorted(items.map((l) => l.furnishing))),
      test: (l, sel) => sel.includes(l.furnishing),
    },
  ];
}

/** Module constants, so the explorer sees stable facets per tab. */
export const listingFacets: Record<Offering, Facet<Listing>[]> = {
  buy: buildFacets(saleListings, saleBands),
  rent: buildFacets(rentListings, rentBands),
};

export const priceBandsFor: Record<Offering, PriceBand[]> = { buy: saleBands, rent: rentBands };

/* -------------------------------------------------------------------------- */
/*  CARD SHAPE                                                                */
/* -------------------------------------------------------------------------- */


/** Maps a listing onto the shared PropertyCard props (homepage + /properties). */
export function toPropertyCard(
  l: Listing,
): { kind: 'ready'; item: ReadyProperty } | { kind: 'rent'; item: RentalProperty } {
  const base = {
    id: l.slug,
    title: l.title,
    price: formatPrice(l),
    type: l.type,
    location: l.area,
    beds: bedsLabel(l.beds),
    baths: `${l.baths} BA`,
    area: `${l.size.toLocaleString('en-US')} sq ft`,
    image: l.images[0].src,
    alt: l.images[0].alt,
    href: listingHref(l.slug),
  };
  return l.offering === 'rent'
    ? { kind: 'rent', item: { ...base, period: '/ year', status: 'For Rent' } }
    : { kind: 'ready', item: { ...base, status: 'For Sale' } };
}

/** The four listings each homepage tab shows. */
export const homepageSale = [
  'exquisite-garden-home-villa-palm-jumeirah',
  'beach-access-prime-location-furnished',
  'luxurious-prime-location-best-deal',
  'luxury-2br-apartment-private-pool',
].map((s) => getListing(s)!);

export const homepageRent = [
  'sea-view-2br-shoreline-apartments',
  'upgraded-1br-marina-view',
  'burj-khalifa-view-3br-high-floor',
  'family-villa-private-garden-arabian-ranches',
].map((s) => getListing(s)!);
