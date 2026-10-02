/**
 * ============================================================================
 *  HEADER NAVIGATION — SINGLE SOURCE
 * ============================================================================
 *  The Header renders entirely from this file. Add, remove or reorder items
 *  here; no component changes are needed.
 *
 *  - `label`      full section title — the mobile accordion heading.
 *  - `shortLabel` condensed label for the desktop top row.
 *  - `href`       present on simple links; omitted on sections with a panel.
 *  - `columns`    turns the item into a mega-menu panel / mobile accordion.
 *                 Each column carries its own eyebrow title and links.
 *  - `promo`      optional right-hand feature card that fills the panel.
 *  - `hideOnHome` the Home link only appears once you have left "/".
 * ============================================================================
 */

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  /** Renders permanently highlighted: orange, underlined, arrow always shown. */
  accent?: boolean;
};

export type NavColumn = {
  title: string;
  links: NavLink[];
};

export type NavPromo = {
  title: string;
  linkLabel: string;
  href: string;
  image: string;
  alt: string;
};

export type NavNode = {
  id: string;
  label: string;
  shortLabel?: string;
  href?: string;
  hideOnHome?: boolean;
  columns?: NavColumn[];
  promo?: NavPromo;
};

import { HOLIDAY_HOMES_URL } from './external';

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const areaLinks: NavLink[] = [
  { label: 'Explore All Areas', href: '/areas' },
  { label: 'Palm Jumeirah', href: '/areas/palm-jumeirah' },
  { label: 'Dubai Marina', href: '/areas/dubai-marina' },
  { label: 'Downtown Dubai', href: '/areas/downtown-dubai' },
  { label: 'Dubai Islands', href: '/areas/dubai-islands' },
  { label: 'Palm Jebel Ali', href: '/areas/palm-jebel-ali' },
];

const ecosystemLinks: NavLink[] = [
  { label: 'Partner Network', href: '/ecosystem/partner-network' },
  { label: 'Mortgage Assistance', href: '/ecosystem/mortgage' },
  { label: 'Company Formation', href: '/ecosystem/company-formation' },
  { label: 'Car Fleet', href: '/ecosystem/car-fleet' },
];

export const navigation: NavNode[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    hideOnHome: true,
  },
  {
    id: 'ready',
    label: 'Buy & Rent',
    columns: [
      {
        title: 'Ready Properties',
        links: [
          { label: 'Buy Property', href: '/properties?offering=buy' },
          { label: 'Rent Property', href: '/properties?offering=rent' },
        ],
      },
      { title: 'Dubai Areas', links: areaLinks },
    ],
    promo: {
      title: 'Palm Jebel Ali Villas',
      linkLabel: 'Explore the collection',
      href: '/areas/palm-jebel-ali',
      image: unsplash('1600596542815-ffad4c1539a9'),
      alt: 'A waterfront villa with a private pool at dusk',
    },
  },
  {
    id: 'sell',
    label: 'Sell',
    columns: [
      {
        title: 'Sell Your Property',
        links: [
          { label: 'List With DRP', href: '/list-your-property' },
          { label: 'Request a Property Valuation', href: '/property-valuation' },
        ],
      },
      {
        title: 'Mortgage & Setup',
        links: [
          { label: 'Mortgage Assistance', href: '/ecosystem/mortgage' },
          { label: 'Company Formation', href: '/ecosystem/company-formation' },
        ],
      },
      {
        title: 'Owner Services',
        links: [
          { label: 'Property Management', href: '/property-management' },
          { label: 'Furnishing Packages', href: '/furnishings' },
          { label: 'Why Furnishing Matters', href: '/furnishings/why-it-matters' },
        ],
      },
    ],
    promo: {
      title: 'Free property valuation',
      linkLabel: 'Request yours',
      href: '/property-valuation',
      image: unsplash('1497366754035-f200968a6e72'),
      alt: 'A meeting room in the DRP office',
    },
  },
  {
    id: 'offplan',
    label: 'Off-Plan',
    columns: [
      {
        title: 'Off-Plan Collections',
        links: [
          { label: 'Explore Investment Collections', href: '/off-plan' },
          { label: 'Latest Launches', href: '/off-plan#latest-launches' },
          { label: 'Construction Tracker', href: '/off-plan/construction-tracker' },
        ],
      },
      {
        title: 'Partners',
        links: [{ label: 'Partner Network', href: '/ecosystem/partner-network' }],
      },
    ],
    promo: {
      title: 'H1 2026 Market Report',
      linkLabel: 'Download',
      href: '/market-report',
      image: unsplash('1487958449943-2429e8be8625'),
      alt: 'A contemporary Dubai building against a clear sky',
    },
  },
  /* Holiday Homes is a separate DRP website — opens in a new tab */
  { id: 'holiday', label: 'Holiday Homes', href: HOLIDAY_HOMES_URL },
  {
    id: 'about',
    label: 'About',
    columns: [
      {
        title: 'About DRP',
        links: [
          { label: 'Our Story', href: '/about' },
          { label: 'Meet the Team', href: '/about#team' },
          { label: 'Careers', href: '/careers' },
        ],
      },
      {
        title: 'News & Insights',
        links: [
          { label: 'All News & Insights', href: '/news' },
          { label: 'Market Reports', href: '/news?category=market-reports' },
          { label: 'Investment Insights', href: '/news?category=investment-insights' },
        ],
      },
      { title: 'DRP Ecosystem', links: ecosystemLinks },
    ],
  },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

/**
 * Flat list shown in the full-screen overlay menu (desktop and mobile).
 * Separate from `navigation` so the overlay can list every page while the
 * desktop top row stays short.
 */
export const fullMenu: NavLink[] = [
  { label: 'Buy', href: '/properties?offering=buy' },
  { label: 'Rent', href: '/properties?offering=rent' },
  { label: 'Off-Plan', href: '/off-plan' },
  { label: 'Holiday Homes', href: HOLIDAY_HOMES_URL, external: true },
  { label: 'Property Management', href: '/property-management' },
  { label: 'Interior Design', href: '/interior-design' },
  { label: 'Car Fleet', href: '/ecosystem/car-fleet' },
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Closing call to action. On the homepage it scrolls to the contact section;
 * everywhere else it goes to the contact page.
 */
export const navCta = {
  label: 'Speak With a Specialist',
  href: '/contact',
  homeHref: '#contact',
};
