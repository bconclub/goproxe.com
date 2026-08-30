import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import styles from '../../styles/legal.module.css'
import { getBlogPost, getRelatedPosts, getRecentPosts, getPrevNextPosts, formatBlogDate, calculateReadingTime, getTradeLabel } from '../../lib/blog'
import { BlogShareRail } from './BlogShareRail'
import { BlogToc } from './BlogToc'
import { BlogHero } from './BlogHero'
import { BlogMeta } from './BlogMeta'
import { BlogListen } from './BlogListen'
import { BlogRelatedRecent } from './BlogRelatedRecent'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

type TocItem = {
  id: string
  text: string
}

type BlogPostWrapperProps = {
  slug: string
  title: string
  pageUrl: string
  tocItems: TocItem[]
  articleContent: string
  children: React.ReactNode
  jsonLdSchemas: Record<string, unknown>[]
}

export function BlogPostWrapper({
  slug,
  title,
  pageUrl,
  tocItems,
  articleContent,
  children,
  jsonLdSchemas,
}: BlogPostWrapperProps) {
  const post = getBlogPost(slug)
  const relatedPosts = getRelatedPosts(slug, 3)
  const recentPosts = getRecentPosts(slug, 3)
  const { prev, next } = getPrevNextPosts(slug)

  const readTime = post?.wordCount ? calculateReadingTime(post.wordCount) : 3
  const tradeLabel = post ? getTradeLabel(post.trade) : 'Product'

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: post?.date,
    dateModified: post?.date,
    author: {
      '@type': 'Organization',
      name: 'PROXe',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PROXe',
    },
    image: `https://goproxe.com${post?.thumbnail}`,
    wordCount: post?.wordCount,
    timeRequired: `PT${readTime}M`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://goproxe.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://goproxe.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  }

  const allSchemas = [blogPostingSchema, breadcrumbSchema, ...jsonLdSchemas]

  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      {allSchemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <BlogShareRail url={pageUrl} title={title} />
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>{title}</h1>

          <BlogHero
            src={post?.thumbnail || '/home/Leads.webp'}
            alt={title}
          />

          <BlogMeta
            date={post ? formatBlogDate(post.date) : ''}
            readTime={readTime}
            tradeLabel={tradeLabel}
          />

          <BlogListen content={articleContent} duration={readTime} />

          <article className={styles.body} style={{ marginTop: '24px' }}>
            <BlogToc items={tocItems} />
            
            {children}

            {/* Related Posts */}
            <BlogRelatedRecent posts={relatedPosts} title="Related" cardClassName={styles.relatedCard} />

            {/* Recent Posts */}
            <BlogRelatedRecent posts={recentPosts} title="Recent" cardClassName={styles.recentCard} />


            {/* Prev/Next Navigation */}
            {(prev || next) && (
              <div
                style={{
                  marginTop: '48px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className={styles.prevNextLink}
                  >
                    <FiArrowLeft size={16} />
                    <span>{prev.title}</span>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    href={`/blog/${next.slug}`}
                    className={styles.prevNextLink}
                  >
                    <span>{next.title}</span>
                    <FiArrowRight size={16} />
                  </Link>
                )}
              </div>
            )}

            <div className={styles.footer}>
              <a href="/blog" className={styles.backLink}>
                <FiArrowLeft size={14} /> Back to blog
              </a>
              <span className={styles.brand}>
                <img src="/proxe/brand/proxe-logo-white.webp" alt="PROXe" />
              </span>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
