'use client'

import type { CSSProperties } from 'react'
import { coverSources, COVER_WIDTH, COVER_HEIGHT } from '../../lib/blog'

type BlogCoverProps = {
  thumbnail: string
  alt: string
  sizes: string
  /** Hero only: eager + high fetch priority. Everything else lazy-loads. */
  priority?: boolean
  fallback?: string
  className?: string
  style?: CSSProperties
}

export function BlogCover({ thumbnail, alt, sizes, priority = false, fallback, className, style }: BlogCoverProps) {
  const { src, srcSet } = coverSources(thumbnail)

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={COVER_WIDTH}
      height={COVER_HEIGHT}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      style={style}
      onError={(e) => {
        // Missing WebP (cover added without running the script): fall back to
        // the source PNG, then to the caller's fallback.
        const img = e.currentTarget
        const next = img.src.endsWith('.webp') ? thumbnail : fallback
        if (next && !img.src.endsWith(next)) {
          img.removeAttribute('srcset')
          img.src = next
        }
      }}
    />
  )
}
