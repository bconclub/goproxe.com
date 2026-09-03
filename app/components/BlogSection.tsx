import Link from 'next/link'
import { getRecentPosts, formatBlogDate } from '../lib/blog'
import type { BlogPost } from '../lib/blog'

export function BlogSection() {
  const recentPosts = getRecentPosts(null, 3)

  return (
    <section className="proxe-section">
      <div className="proxe-container">
        <div className="proxe-section-label" style={{ textAlign: 'center' }}>
          From the desk
        </div>
        <div className="proxe-blog-grid">
          {recentPosts.map((post: BlogPost) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="proxe-blog-card"
            >
              <div className="proxe-blog-card-thumb">
                <img 
                  src={post.thumbnail} 
                  alt={post.title}
                  className="proxe-blog-card-img"
                />
              </div>
              <div className="proxe-blog-card-content">
                <div className="proxe-blog-card-date">
                  {formatBlogDate(post.date)}
                </div>
                <h3 className="proxe-blog-card-title">{post.title}</h3>
                <p className="proxe-blog-card-dek">{post.dek}</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/blog" className="proxe-blog-link">
            View all posts
          </Link>
        </div>
      </div>
    </section>
  )
}
