'use client'

import Link from 'next/link'
import type { BlogPost } from '../../lib/blog'
import { calculateReadingTime } from '../../lib/blog'
import styles from '../../styles/legal.module.css'

interface BlogRelatedRecentProps {
  posts: BlogPost[]
  title: 'Related' | 'Recent'
  cardClassName: string
}

export function BlogRelatedRecent({ posts, title, cardClassName }: BlogRelatedRecentProps) {
  if (posts.length === 0) return null

  return (
    <section className={styles.section} style={title === 'Related' ? { marginTop: '48px' } : undefined}>
      <h2>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.map((post) => {
          const dateObj = new Date(post.date)
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          const readTime = post.wordCount ? calculateReadingTime(post.wordCount) : 3
          
          // Determine fallback image based on thumbnail
          const fallbackImage = post.thumbnail.includes('Conversations') 
            ? '/home/Conversations.webp' 
            : '/home/Leads.webp'
          
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={cardClassName}
              style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
            >
              <img
                src={post.thumbnail}
                alt=""
                style={{
                  width: '160px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (target.src !== fallbackImage) {
                    target.src = fallbackImage
                  }
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-proxe-heading)',
                    fontSize: '18px',
                    fontWeight: 400,
                    margin: '0 0 6px',
                    color: '#ede9fe',
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(220, 215, 245, 0.75)',
                    margin: '0 0 8px',
                    lineHeight: 1.5,
                  }}
                >
                  {post.dek}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-proxe-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.04em',
                    color: 'rgba(196, 181, 253, 0.6)',
                    margin: 0,
                  }}
                >
                  {formattedDate} · {readTime} min read
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
