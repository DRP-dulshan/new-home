/**
 * ============================================================================
 *  DRP CAR FLEET — /ecosystem/car-fleet
 * ============================================================================
 *  An added service for DRP owners, Holiday Homes guests and clients — not a
 *  rental business. No prices, booking or dates; every route leads to the
 *  team.
 * ============================================================================
 */

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type Vehicle = {
  id: string;
  model: string;
  seats: number;
  transmission: string;
  type: string;
  image: string;
  alt: string;
};

export const carFleet = {
  metaTitle: 'Car Fleet | Dubai Rapid Properties',
  hero: {
    eyebrow: 'DRP Car Fleet',
    heading: 'Mobility, Part of\nthe DRP Experience',
    // DEMO PLACEHOLDER – swap for real DRP vehicle photography
    image: unsplash('1503376780353-7e6692767b70', 2400),
    imageAlt: 'A DRP fleet car parked outside a modern residence',
  },
  intro:
    'Our DRP car fleet is available as an additional service for our property owners, Holiday Homes guests and clients who require convenient mobility during their stay in Dubai. Speak to our team to learn more about available vehicles and arrangements.',
  fleet: {
    eyebrow: 'The Fleet',
    heading: 'Selected Vehicles',
  },
  // DEMO PLACEHOLDERS – every photo below is Unsplash stock and must be swapped
  // for real DRP vehicle photography; models and specs need confirming too.
  vehicles: [
    {
      id: 'ford-mustang',
      model: 'Ford Mustang',
      seats: 4,
      transmission: 'Automatic',
      type: 'Sports Coupé',
      image: unsplash('1655628266959-12ec3f839a46'),
      alt: 'Ford Mustang',
    },
    {
      id: 'mercedes-g63',
      model: 'Mercedes-Benz G 63',
      seats: 5,
      transmission: 'Automatic',
      type: 'Luxury SUV',
      image: unsplash('1669428800842-5f1d3645cef2'),
      alt: 'Mercedes-Benz G 63',
    },
    {
      id: 'mercedes-s-class',
      model: 'Mercedes-Benz S-Class',
      seats: 4,
      transmission: 'Automatic',
      type: 'Executive Saloon',
      image: unsplash('1555215695-3004980ad54e'),
      alt: 'Mercedes-Benz S-Class',
    },
    {
      id: 'Lamborghini-aventador-s',
      model: 'Lamborghini Aventador S',
      seats: 2,
      transmission: 'Automatic',
      type: 'Supercar',
      image: unsplash('1694725736570-e2343ab54550'),
      alt: 'Lamborghini Aventador S',
    },
    {
      id: 'rolls-royce-cullinan',
      model: 'Rolls-Royce Cullinan',
      seats: 5, 
      transmission: 'Automatic',
      type: 'Full-Size Ultra Luxury SUV',
      image: unsplash('1699323472812-9005bdfcb206'),
      alt: 'Rolls-Royce Cullinan',
    },
    {
      id: 'porsche-911-gt3-rs',
      model: 'Porsche 911 GT3 RS',
      seats: 2,
      transmission: 'Automatic',
      type: 'Sports Coupé',
      image: unsplash('1759001462231-cd26545a499e'),
      alt: 'Porsche 911 GT3 RS',
    },
  ] satisfies Vehicle[],
  cta: {
    eyebrow: 'Car Fleet Enquiries',
    heading: 'Speak to our team',
    label: 'Contact Us',
    href: '/contact',
    whatsappText: 'Hello DRP, I would like to ask about the DRP car fleet.',
  },
};
