import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '../lib/blog'
import styles from '../styles/legal.module.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'Blog | PROXe',
  description: 'How businesses miss conversations, lose leads, and what to do about it.',
  alternates: {
    canonical: 'https://goproxe.com/blog',
  },
}

export default function BlogIndexPage() {
  const sortedPosts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>PROXe Blog</h1>
          <p className={styles.lede}>
            How businesses miss conversations, lose leads, and what to do about it.
          </p>

          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sortedPosts.map((post) => {
              const dateObj = new Date(post.date)
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: 'block',
                    background: 'linear-gradient(180deg, rgba(20, 13, 48, 0.55) 0%, rgba(11, 7, 30, 0.62) 100%)',
                    border: '1px solid rgba(196, 181, 253, 0.14)',
                    borderRadius: '16px',
                    padding: '24px',
                    backdropFilter: 'blur(16px) saturate(150%)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(196, 181, 253, 0.35)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(196, 181, 253, 0.14)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      style={{
                        width: '160px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <h2
                        style={{
                          fontFamily: 'var(--font-proxe-heading)',
                          fontSize: '24px',
                          fontWeight: 400,
                          lineHeight: 1.2,
                          margin: '0 0 8px',
                          color: '#f1edff',
                        }}
                      >
                        {post.title}
                      </h2>
                      <p
                        style={{
                          fontSize: '15px',
                          lineHeight: 1.65,
                          color: 'rgba(220, 215, 245, 0.82)',
                          margin: '0 0 12px',
                        }}
                      >
                        {post.dek}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-proxe-mono)',
                          fontSize: '12px',
                          letterSpacing: '0.04em',
                          color: 'rgba(196, 181, 253, 0.6)',
                          margin: 0,
                        }}
                      >
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '13.5px',
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'rgba(196, 181, 253, 1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
              }}
            >
              ← Back to home
            </Link>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center', opacity: 0.7 }}>
            <img src="/proxe/brand/proxe-logo-white.webp" alt="PROXe" style={{ height: '18px', width: 'auto' }} />
          </div>
        </div>
      </main>
    </div>
  )
}
