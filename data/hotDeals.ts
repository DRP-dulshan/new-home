/**
 * ============================================================================
 *  HOT DEALS — listings DRP pins to the top of /properties
 * ============================================================================
 *  Each one shows a "Hot Deal" badge and comes first whatever the sort. A deal
 *  with its own landing page links there; the rest open /properties/[slug].
 *  Give a deal the slug of its Property Finder listing: it then takes that
 *  listing's place (and keeps its page address) instead of showing twice.
 *  Photos live in /public/media/<deal>/.
 * ============================================================================
 */

import type { Listing } from './properties';

/** The Wave Crest landing page (palm-jebel-ali-villa-1 repo) */
export const WAVE_CREST_URL = 'https://palm.nakheel.villas/';

const waveCrestPhotos: [string, string][] = [
  ['hero-beachfront', 'Wave Crest villa seen from the beach, with the pool terrace, palm-shaded garden and the Arabian Gulf'],
  ['exterior-arrival', 'The arrival elevation of the Wave Crest villa, in pale stone with a timber-clad upper storey'],
  ['living-room', 'Open-plan living room with floor-to-ceiling glazing and views through to the garden'],
  ['dining-kitchen', 'Dining table and kitchen island in pale oak, opening onto the sea-facing terrace'],
  ['master-bedroom', 'Master bedroom at dusk, opening onto a private terrace above the water'],
  ['master-bathroom', 'Master bathroom with a freestanding bath and stone vanity'],
  ['family-room', 'Family room arranged as a lounge and private gym, facing the water'],
  ['guest-bathroom', 'Guest bathroom in travertine, with a walk-in rain shower'],
];

export const hotDeals: Listing[] = [
  {
    /* The same villa's Property Finder listing, which this deal replaces */
    slug: 'exclusive-5-bedroom-luxurious-frond-villa-2',
    ref: 'W976PKP7JZCZ3RT6694JZ1Q5WM',
    permit: '915740',
    title: 'Wave Crest · 5 Bedroom Beach Villa',
    offering: 'buy',
    price: 24_500_000,
    type: 'Villa',
    area: 'Palm Jebel Ali',
    building: 'Frond A',
    map: { query: 'Frond A, Palm Jebel Ali, Dubai', exact: false },
    beds: 5,
    baths: 7,
    size: 8368,
    completion: 'Off-Plan',
    furnishing: null,
    listedAt: '2026-10-01',
    agent: 'Tara Topic',
    images: waveCrestPhotos.map(([file, alt]) => ({ src: `/media/wave-crest/${file}.webp`, alt })),
    description: [
      "A rare opportunity to own a signature beachfront residence on Frond A of Palm Jebel Ali. This Wave Crest villa is part of Nakheel's exclusive Beach Collection, designed by LW Design Group.",
      'Approximately 8,368 sq.ft. of property area on a 7,640 sq.ft. plot, with direct beach access, sea-facing terraces and a roof lounge. It sits at a high villa number on the frond, away from the entrance, for greater privacy and a quieter stretch of beach.',
      '50% of the developer payment plan is already paid; the remaining balance continues on the original Nakheel schedule through to November 2028.',
    ],
    features: [
      'Direct beachfront',
      'Frond A, high villa number',
      '7,640 sq.ft. plot',
      'Roof lounge and terrace',
      'Sea-facing terraces',
      'Family room',
      'Nakheel Beach Collection',
      '50% of payment plan paid',
    ],
    sourceUrl: WAVE_CREST_URL,
    hotDeal: true,
    href: WAVE_CREST_URL,
  },
];
