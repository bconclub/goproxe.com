import type { Metadata } from 'next'
import { blogOgImageUrl } from './blog'

/**
 * Share-card metadata for blog pages. og:image and twitter:image both point at
 * the page's own 1200x630 JPEG (public/blog/og/<slug>.jpg), so the root
 * app/twitter-image.jpg no longer leaks onto posts.
 */
export function withBlogSocial(slug: string, meta: Metadata & { title: string; description: string }): Metadata {
  const title = `${meta.title} · PROXe`
  const url = slug === 'blog' ? 'https://goproxe.com/blog' : `https://goproxe.com/blog/${slug}`
  const image = { url: blogOgImageUrl(slug), width: 1200, height: 630, alt: meta.title, type: 'image/jpeg' }

  return {
    ...meta,
    openGraph: {
      title,
      description: meta.description,
      url,
      siteName: 'PROXe',
      type: slug === 'blog' ? 'website' : 'article',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: meta.description,
      images: [image],
    },
  }
}
