/**
 * ============================================================================
 *  COMPANY — /about, /about/team, /careers, /contact
 * ============================================================================
 *  Facts used as-is: established 2007, office on Golden Mile 9, Palm Jumeirah,
 *  clients from 40+ countries, full property ecosystem.
 *
 *  DEMO PLACEHOLDERS – the timeline milestones after 2007, every team member,
 *  every open role and the office hours are illustrative. Replace before launch.
 * ============================================================================
 */

import { drpPhoto } from '@/lib/media';

export const about = {
  hero: {
    eyebrow: 'About DRP',
    heading: 'A Palm Jumeirah Agency Since 2007',
    intro:
      'Dubai Rapid Properties connects clients from around the world with property, investment and opportunity across the UAE — from our office on the Golden Mile.',
    image: drpPhoto(2),
    imageAlt: 'The DRP office on Golden Mile, Palm Jumeirah',
  },
  story: [
    'DRP opened on Palm Jumeirah in 2007, when the island was still welcoming its first residents. From the start we chose depth over breadth: knowing a small number of communities building by building, and the people who live in them.',
    'Three market cycles later, that local knowledge is still the foundation. What has grown is everything around it. Clients asked us to furnish the homes they bought, then to let them, manage them and look after their guests. Today DRP is a full property ecosystem under one roof.',
    'Our clients come from more than forty countries. Many buy remotely, so we work the way they need us to: honest advice, clear communication and a team that handles every step on the ground in Dubai.',
  ],
  // DEMO PLACEHOLDER – confirm milestones and years with DRP
  timeline: [
    { year: '2007', text: 'DRP opens on Palm Jumeirah as one of the island’s first agencies.' },
    { year: '2012', text: 'Leasing and property management added for owners living abroad.' },
    { year: '2016', text: 'DRP Holiday Homes launches, licensed for short-stay rentals.' },
    { year: '2019', text: 'Furnishing and interior design join the group.' },
    { year: '2023', text: 'Off-plan advisory expands with the city’s new launches.' },
    { year: '2026', text: 'The DRP ecosystem: sales, leasing, holiday homes, interiors, management and mobility.' },
  ],
  values: [
    { title: 'Honest advice', text: 'We tell clients what a property is really worth, and when not to buy.' },
    { title: 'Local depth', text: 'Building-by-building knowledge of the communities we work in.' },
    { title: 'One team', text: 'Sales, leasing, interiors and management that talk to each other.' },
    { title: 'Global perspective', text: 'A multilingual team working with clients in over forty countries.' },
    { title: 'Accountability', text: 'Clear reporting, so owners always know where they stand.' },
    { title: 'Long relationships', text: 'Most new business comes from returning clients and referrals.' },
  ],
  office: {
    image: drpPhoto(12),
    imageAlt: 'Inside the DRP office on Palm Jumeirah',
  },
};

export type TeamMember = {
  id: string;
  /** Names and photos are added when DRP supplies them. */
  role: string;
  department: 'Leadership' | 'Sales' | 'Leasing' | 'Off-Plan' | 'Holiday Homes' | 'Client Services';
  languages: string[];
  focus: string;
};

// DEMO PLACEHOLDERS – roles only; add each person's name and photo from DRP
export const team: TeamMember[] = [
  { id: 't1', role: 'Managing Director', department: 'Leadership', languages: ['English', 'Arabic'], focus: 'Strategy, key client relationships' },
  { id: 't2', role: 'Director of Sales', department: 'Leadership', languages: ['English', 'French'], focus: 'Palm Jumeirah prime sales' },
  { id: 't3', role: 'Palm Jumeirah Specialist', department: 'Sales', languages: ['English', 'Russian'], focus: 'Frond villas and Golden Mile' },
  { id: 't4', role: 'Dubai Marina & JBR', department: 'Sales', languages: ['English', 'Hindi', 'Urdu'], focus: 'Waterfront apartments' },
  { id: 't5', role: 'Downtown & Business Bay', department: 'Sales', languages: ['English', 'German'], focus: 'City apartments and penthouses' },
  { id: 't6', role: 'Head of Off-Plan', department: 'Off-Plan', languages: ['English', 'Arabic'], focus: 'New launches and developer relations' },
  { id: 't7', role: 'Investment Advisor', department: 'Off-Plan', languages: ['English', 'Mandarin'], focus: 'Payment plans and portfolios' },
  { id: 't8', role: 'Head of Leasing', department: 'Leasing', languages: ['English', 'Tagalog'], focus: 'Annual lets and renewals' },
  { id: 't9', role: 'Villa Communities', department: 'Leasing', languages: ['English', 'Spanish'], focus: 'Dubai Hills and Arabian Ranches' },
  { id: 't10', role: 'Head of Holiday Homes', department: 'Holiday Homes', languages: ['English', 'Italian'], focus: 'Revenue and guest experience' },
  { id: 't11', role: 'Guest Experience Lead', department: 'Holiday Homes', languages: ['English', 'Arabic', 'French'], focus: 'Check-in, concierge and car fleet' },
  { id: 't12', role: 'Conveyancing & Golden Visa', department: 'Client Services', languages: ['English', 'Arabic'], focus: 'Transfers, visas and paperwork' },
];

export type Role = {
  id: string;
  title: string;
  department: string;
  type: string;
  summary: string;
  responsibilities: string[];
};

// DEMO PLACEHOLDERS – replace with live vacancies
export const careers = {
  hero: {
    eyebrow: 'Careers',
    heading: 'Build Your Career With DRP',
    intro:
      'Join a Palm Jumeirah team that has grown through three market cycles — across sales, leasing, holiday homes, interiors and operations.',
    image: drpPhoto(5),
    imageAlt: 'The DRP team at work in the office',
  },
  why: [
    { title: 'A real pipeline', text: 'Returning clients and referrals mean you start with relationships, not cold calls.' },
    { title: 'One ecosystem', text: 'Cross-refer clients to leasing, holiday homes and interiors — and share in it.' },
    { title: 'Training', text: 'RERA certification support, market training and mentoring from senior advisors.' },
    { title: 'Prime address', text: 'Work from the Golden Mile on Palm Jumeirah, in the communities you sell.' },
  ],
  roles: [
    {
      id: 'senior-sales-advisor',
      title: 'Senior Sales Advisor — Palm Jumeirah',
      department: 'Sales',
      type: 'Full time · Palm Jumeirah',
      summary: 'Advise buyers and sellers of prime villas and apartments on the island.',
      responsibilities: [
        'Manage a portfolio of sale listings from valuation to transfer',
        'Advise international buyers, often remotely',
        'Work with leasing and holiday homes on investor clients',
        'At least three years of Dubai sales experience and a RERA card',
      ],
    },
    {
      id: 'off-plan-advisor',
      title: 'Off-Plan Investment Advisor',
      department: 'Off-Plan',
      type: 'Full time · Palm Jumeirah',
      summary: 'Guide investors through new launches, payment plans and developer relationships.',
      responsibilities: [
        'Assess new launches against DRP’s criteria',
        'Build investment cases and payment schedules for clients',
        'Attend launches and maintain developer relationships',
        'Off-plan experience with major Dubai developers',
      ],
    },
    {
      id: 'leasing-consultant',
      title: 'Leasing Consultant',
      department: 'Leasing',
      type: 'Full time · Palm Jumeirah',
      summary: 'Let and renew homes for owners, many of whom live outside the UAE.',
      responsibilities: [
        'Market and let annual-rental properties',
        'Manage tenancy contracts, Ejari and renewals',
        'Coordinate move-ins with the property management team',
        'Leasing experience in Dubai preferred',
      ],
    },
    {
      id: 'guest-experience-coordinator',
      title: 'Guest Experience Coordinator',
      department: 'Holiday Homes',
      type: 'Full time · Shift based',
      summary: 'Look after holiday-home guests from booking to check-out.',
      responsibilities: [
        'Handle guest communication and check-ins',
        'Coordinate housekeeping, maintenance and the car fleet',
        'Keep review scores and response times high',
        'Hospitality background and excellent English',
      ],
    },
    {
      id: 'marketing-executive',
      title: 'Marketing Executive',
      department: 'Marketing',
      type: 'Full time · Palm Jumeirah',
      summary: 'Bring DRP listings, launches and insights to the right audiences.',
      responsibilities: [
        'Run listing campaigns across portals and social channels',
        'Produce the monthly market insights newsletter',
        'Coordinate photography, video and launch events',
        'Real estate or luxury marketing experience',
      ],
    },
  ] satisfies Role[],
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
