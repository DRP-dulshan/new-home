import listings from '@/data/imported/listings.json';

/**
 * The Property Finder listings this site shows, as JSON. The admin portal
 * (Website → Listings → Property Finder listings) reads it so staff can take a
 * listing over to edit it or hide it. Public by design: it is what the site
 * shows anyway.
 */
export const dynamic = 'force-static';

export function GET() {
  return Response.json(listings, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
