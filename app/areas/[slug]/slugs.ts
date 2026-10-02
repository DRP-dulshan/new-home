import { areas } from '@/data/areas';

/** Known slugs, prerendered at build time — one per area guide. */
export const staticSlugs = areas.map((a) => a.slug);
