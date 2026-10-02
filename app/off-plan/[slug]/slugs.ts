import { projects } from '@/data/offPlan';

/** Known demo slugs, prerendered at build time — one per off-plan project. */
export const staticSlugs = projects.map((p) => p.slug);
