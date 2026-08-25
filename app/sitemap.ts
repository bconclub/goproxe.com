import type { MetadataRoute } from 'next'
import { INDUSTRY_SLUGS } from './lib/industries'
import { COMPARISON_SLUGS } from './lib/comparisons'

// Serves /sitemap.xml. The landing page is the product; industry pages are the
// ad landing pages; comparison pages are SEO landing pages; legal pages are
// listed so crawlers can verify them.
// /thank-you is deliberately absent (conversion page, disallowed in robots.ts)
// and the demo lives on a noindexed host, never here.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://goproxe.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // From the registry, never hand-listed — a new industry ships with its URL.
    ...INDUSTRY_SLUGS.map((slug) => ({
      url: `https://goproxe.com/industries/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Comparison pages from the registry
    ...COMPARISON_SLUGS.map((slug) => ({
      url: `https://goproxe.com/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    {
      url: 'https://goproxe.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://goproxe.com/data-deletion',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://goproxe.com/blog/people-miss-conversations',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
