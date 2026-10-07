/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      /* The team is now a section of /about */
      { source: '/about/team', destination: '/about#team', permanent: true },
      /* Furnishing packages and why furnishing matters are sections of DRP Furnishing */
      { source: '/furnishings', destination: '/drp-furnishing#packages', permanent: true },
      { source: '/furnishings/why-it-matters', destination: '/drp-furnishing#why-it-matters', permanent: true },
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
      /* Listing photos uploaded in the D|R|P admin portal (Supabase Storage, public bucket) */
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      /* Listing photos, served by Property Finder (the API may use any of its image hosts) */
      {
        protocol: 'https',
        hostname: '**.propertyfinder.ae',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.propertyfinder.com',
        pathname: '/**',
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
