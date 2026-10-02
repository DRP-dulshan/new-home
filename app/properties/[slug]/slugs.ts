import { listings } from '@/data/properties';

/** Known slugs, prerendered at build time — one per listing. */
export const staticSlugs = listings.map((l) => l.slug);
