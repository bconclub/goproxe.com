'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BLOG_POSTS, type Trade, getTradeLabel, calculateReadingTime } from '../../lib/blog'
import styles from './BlogHub.module.css'

type FilterOption = Trade | 'all'

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'realestate', label: 'Real estate' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'home-services', label: 'Home services' },
  { value: 'professional', label: 'Professional' },
  { value: 'product', label: 'Product' },
]

export function BlogHub() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')

  const sortedPosts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))
  
  const filteredPosts = activeFilter === 'all'
    ? sortedPosts
    : sortedPosts.filter((post) => post.trade === activeFilter)

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr)
    const day = dateObj.getDate()
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
    return `${day} ${month}`
  }

  return (
    <div className={styles.hubContainer}>
      <div className={styles.filterChips}>
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`${styles.chip} ${activeFilter === option.value ? styles.chipActive : ''}`}
            onClick={() => setActiveFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredPosts.map((post) => {
          const readTime = post.wordCount ? calculateReadingTime(post.wordCount) : 5

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={styles.card}
            >
              <div className={styles.cardImage}>
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `data:image/svg+xml,%3Csvg width='1200' height='630' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1200' height='630' fill='%23140d30'/%3E%3C/svg%3E`
                  }}
                />
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.cardDek}>{post.dek}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardDate}>{formatDate(post.date)}</span>
                  <span className={styles.cardDot}>·</span>
                  <span className={styles.cardRead}>{readTime} min read</span>
                  <span className={styles.cardTradeChip}>{getTradeLabel(post.trade)}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
