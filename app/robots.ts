import type { MetadataRoute } from 'next';
import { indexable, siteUrl } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
