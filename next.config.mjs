/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      /* Latest Launches is now a section of /off-plan, not its own page */
      { source: '/off-plan/latest-launches', destination: '/off-plan#latest-launches', permanent: true },
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
