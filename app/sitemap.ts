import type { MetadataRoute } from 'next'

// Serves /sitemap.xml. The landing page is the product; legal pages are listed
// so crawlers can verify them. /thank-you is deliberately absent (conversion
// page, disallowed in robots.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://goproxe.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
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
  ]
}
