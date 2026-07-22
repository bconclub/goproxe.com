import type { MetadataRoute } from 'next'

// Serves /robots.txt (was a 404 HTML page before — crawlers treat a missing
// robots.txt as allow-all, but serving a real one is proper hygiene and lets
// us point at the sitemap).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Conversion page — no reason for it to appear in search results.
      disallow: '/thank-you',
    },
    sitemap: 'https://goproxe.com/sitemap.xml',
  }
}
