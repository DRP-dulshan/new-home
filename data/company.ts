/**
 * ============================================================================
 *  COMPANY — /about (incl. #team), /careers, /contact
 * ============================================================================
 *  Facts used as-is: established 2007, office on Golden Mile 9, Palm Jumeirah,
 *  and the About / Careers copy supplied by DRP.
 *
 *  DEMO PLACEHOLDERS – every team member (name, role, line, portrait), the
 *  careers hero photo, the ecosystem photography and the office hours.
 * ============================================================================
 */

import { drpPhoto, unsplash } from '@/lib/media';
import { HOLIDAY_HOMES_URL } from './external';

export const about = {
  hero: {
    eyebrow: 'About DRP',
    heading: 'Dubai Real Estate. One Team. Since 2007.',
    image: drpPhoto(12),
    imageAlt: 'Inside the DRP office on Palm Jumeirah',
  },
  intro: [
    "Dubai Rapid Properties has been part of Dubai\u2019s real estate market since 2007. Over the years, we have grown from a real estate brokerage into a wider property ecosystem, supporting clients across property sales, rentals, off-plan investments, Holiday Homes and complementary services.",
    'Our approach remains personal: long-term relationships, local market knowledge and direct access to specialists who understand every stage of the property journey.',
  ],
  facts: [
    { id: 'year', value: '2007', label: 'Established in Dubai' },
    {
      id: 'home',
      value: 'Palm Jumeirah',
      label: 'Our home and headquarters',
      image: drpPhoto(2),
      imageAlt: 'The DRP office on the Golden Mile, Palm Jumeirah',
    },
    {
      id: 'ecosystem',
      value: ['Sales', 'Rentals', 'Off-Plan', 'Holiday Homes'],
      label: 'One property ecosystem',
    },
  ],
  ecosystem: {
    eyebrow: 'More Than a Brokerage',
    heading: 'One Team, Every Part of Property',
    // DEMO PLACEHOLDER – Unsplash photography; swap for DRP shoots
    services: [
      { name: 'Real Estate Brokerage', href: '/properties', image: unsplash('1600585154340-be6161a56a0c', 900), alt: 'A villa on Palm Jumeirah' },
      { name: 'Off-Plan Investments', href: '/off-plan', image: unsplash('1541976590-713941681591', 900), alt: 'A new residential tower in Dubai' },
      { name: 'Holiday Homes', href: HOLIDAY_HOMES_URL, image: unsplash('1567767292278-a4f21aa2d36e', 900), alt: 'A furnished holiday home living room' },
      { name: 'Car Fleet', href: '/ecosystem/car-fleet', image: unsplash('1503376780353-7e6692767b70', 900), alt: 'A car outside a modern residence' },
      { name: 'Furnishing & Property Support', href: '/furnishings', image: unsplash('1586023492125-27b2c045efd7', 900), alt: 'A styled living room' },
      { name: 'Partner Network', href: '/ecosystem/partner-network', image: unsplash('1521791136064-7986c2920216', 900), alt: 'Two people shaking hands' },
    ],
  },
  team: {
    eyebrow: 'Meet the People Behind DRP',
    heading: 'The Team',
  },
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  line: string;
  photo: string;
  /** Adds a WhatsApp shortcut to the main DRP number, addressed to this person. */
  whatsapp?: boolean;
  /** Adds an email shortcut to the DRP office inbox, addressed to this person. */
  email?: boolean;
};

// Replace with real DRP team photos from the IT team.
// DEMO PLACEHOLDERS – names, roles, lines and Unsplash portraits are invented.
export const team: TeamMember[] = [
  { id: 'p1', name: 'Daniel Harper', role: 'Managing Director', line: 'Leading DRP since its first year on the island.', photo: unsplash('1560250097-0b93528c311a', 900), email: true },
  { id: 'p2', name: 'Layla Haddad', role: 'Head of Sales', line: 'Twenty years of Palm Jumeirah villa sales.', photo: unsplash('1573496359142-b8d87734a5a2', 900), whatsapp: true, email: true },
  { id: 'p3', name: 'Marcus Webb', role: 'Senior Property Consultant', line: 'Frond villas and the Golden Mile, building by building.', photo: unsplash('1500648767791-00dcc994a43e', 900), whatsapp: true },
  { id: 'p4', name: 'Sofia Rossi', role: 'Property Consultant', line: 'Dubai Marina and JBR apartments for buyers abroad.', photo: unsplash('1494790108377-be9c29b29330', 900), whatsapp: true },
  { id: 'p5', name: 'Arjun Mehta', role: 'Off-Plan Investment Advisor', line: 'New launches, payment plans and portfolio planning.', photo: unsplash('1507003211169-0a1dd7228f2d', 900), whatsapp: true },
  { id: 'p6', name: 'Elena Volkova', role: 'Leasing Manager', line: 'Finding the right tenant, and keeping them.', photo: unsplash('1438761681033-6461ffad8d80', 900), whatsapp: true },
  { id: 'p7', name: 'Omar Farouk', role: 'Holiday Homes Manager', line: 'Guests, pricing and five-star reviews.', photo: unsplash('1472099645785-5658abf4ff4e', 900), whatsapp: true },
  { id: 'p8', name: 'Grace Okafor', role: 'Client Relations Manager', line: 'Transfers, Golden Visas and everything in between.', photo: unsplash('1580489944761-15a19d654956', 900), email: true },
];

export const careers = {
  hero: {
    eyebrow: 'Careers at DRP',
    heading: 'Build Your Real Estate Career with DRP',
    intro:
      'Dubai Rapid Properties has been operating in Dubai since 2007. We believe successful agents need more than a desk and a phone \u2014 they need market knowledge, guidance and the right environment to grow.',
    // Replace with the real DRP team group photos taken in front of the office
    image: unsplash('1522071820081-009f0129c71c', 2400),
    imageAlt: 'The DRP team together in the office',
  },
  starting: {
    eyebrow: 'Starting at DRP',
    heading: 'The DRP Academy',
    text: 'New agents receive hands-on support, particularly during their first months with the company. Through our internal DRP Academy, agents are introduced to the Dubai real estate market, communities, pricing, developers, sales processes and real situations they will encounter when working with buyers, sellers and investors.',
    pillars: [
      'Market & Area Training',
      'Pricing Knowledge',
      'Sales Guidance',
      'Developer & Project Knowledge',
      'Practical Case Training',
      'Ongoing Team Support',
    ],
  },
  join: {
    eyebrow: 'Want to Join DRP?',
    heading: 'Apply to the team',
    text: 'Whether you already have Dubai real estate experience or are looking to build your career in the market, we would like to hear from you.',
    submitLabel: 'Join the DRP Team',
    successTitle: 'Thank you for your interest.',
    successBody: 'Our team will review your application and get back to you.',
    experienceYears: ['Less than 1 year', '1 \u2013 3 years', '3 \u2013 5 years', '5 \u2013 10 years', '10+ years'],
    languages: [
      'English', 'Arabic', 'Russian', 'French', 'German', 'Italian', 'Spanish',
      'Hindi', 'Urdu', 'Persian', 'Mandarin', 'Tagalog', 'Other',
    ],
    cv: { maxBytes: 5 * 1024 * 1024, accept: '.pdf,.doc,.docx', extensions: ['pdf', 'doc', 'docx'] },
  },
};

export const contactPage = {
  hero: {
    eyebrow: 'Contact',
    heading: 'Get in Touch With DRP',
    intro: 'Call, WhatsApp, email or visit us on the Golden Mile. A DRP advisor will reply within one business day.',
    image: drpPhoto(12),
    imageAlt: 'Inside the DRP office on Palm Jumeirah',
  },
  // DEMO PLACEHOLDER – confirm office hours
  hours: [
    { days: 'Monday – Friday', time: '9:00 – 18:00' },
    { days: 'Saturday', time: '10:00 – 16:00' },
    { days: 'Sunday', time: 'By appointment' },
  ],
  mapEmbed:
    'https://www.google.com/maps?q=Golden+Mile+9,+Palm+Jumeirah,+Dubai&output=embed',
  mapLink: 'https://maps.google.com/?q=Golden+Mile+9,+Palm+Jumeirah,+Dubai',
};
