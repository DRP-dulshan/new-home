import { articles } from '@/data/news';

/** Known slugs, prerendered at build time — one per article. */
export const staticSlugs = articles.map((a) => a.slug);
