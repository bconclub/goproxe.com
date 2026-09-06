import type { MetadataRoute } from 'next'
import { INDUSTRY_SLUGS } from './lib/industries'
import { COMPARISON_SLUGS } from './lib/comparisons'
import { BLOG_SLUGS } from './lib/blog'

// Serves /sitemap.xml. The landing page is the product; industry pages are the
// ad landing pages; comparison pages are SEO landing pages; legal pages are
// listed so crawlers can verify them; blog posts from the registry.
// /thank-you is deliberately absent (conversion page, disallowed in robots.ts)
// and the demo lives on a noindexed host, never here.
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: 'https://goproxe.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // From the registry, never hand-listed — a new industry ships with its URL.
  // Gracefully skip if import fails or data is unavailable.
  try {
    if (Array.isArray(INDUSTRY_SLUGS)) {
      entries.push(
        ...INDUSTRY_SLUGS.map((slug) => ({
          url: `https://goproxe.com/industries/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      )
    }
  } catch (e) {
    console.error('Sitemap: Failed to load industry slugs', e)
  }

  // Comparison pages from the registry
  try {
    if (Array.isArray(COMPARISON_SLUGS)) {
      entries.push(
        ...COMPARISON_SLUGS.map((slug) => ({
          url: `https://goproxe.com/compare/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      )
    }
  } catch (e) {
    console.error('Sitemap: Failed to load comparison slugs', e)
  }

  // Blog index
  entries.push({
    url: 'https://goproxe.com/blog',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  })

  // Blog posts from the registry
  try {
    if (Array.isArray(BLOG_SLUGS)) {
      entries.push(
        ...BLOG_SLUGS.map((slug) => ({
          url: `https://goproxe.com/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        }))
      )
    }
  } catch (e) {
    console.error('Sitemap: Failed to load blog slugs', e)
  }

  // Legal pages
  entries.push(
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
    }
  )

  return entries
}
