'use client'

import styles from './BlogHero.module.css'

type BlogHeroProps = {
  src: string
  alt: string
}

export function BlogHero({ src, alt }: BlogHeroProps) {
  const fallbackImage = src.includes('Conversations') 
    ? '/home/Conversations.webp' 
    : '/home/Leads.webp'
  
  return (
    <div className={styles.hero}>
      <img
        src={src}
        alt={alt}
        className={styles.heroImage}
        onError={(e) => {
          const target = e.target as HTMLImageElement
          if (target.src !== fallbackImage && !target.src.includes(fallbackImage)) {
            target.src = fallbackImage
          }
        }}
      />
    </div>
  )
}
