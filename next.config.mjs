/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      /* Latest Launches is now a section of /off-plan, not its own page */
      { source: '/off-plan/latest-launches', destination: '/off-plan#latest-launches', permanent: true },
      /* The team is now a section of /about */
      { source: '/about/team', destination: '/about#team', permanent: true },
      /* Interior Design is now DRP Furnishing */
      { source: '/interior-design', destination: '/drp-furnishing', permanent: true },
      /* One car fleet page, under the DRP Ecosystem */
      { source: '/car-fleet', destination: '/ecosystem/car-fleet', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dubairapidproperties.com',
        pathname: '/**',
      },
      /* Listing photos, served by Property Finder */
      {
        protocol: 'https',
        hostname: 'static.shared.propertyfinder.ae',
        pathname: '/media/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
