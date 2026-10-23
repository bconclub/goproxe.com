import { BlogCover } from './BlogCover'
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
      <BlogCover
        thumbnail={src}
        alt={alt}
        sizes="(max-width: 800px) 100vw, 760px"
        priority
        fallback={fallbackImage}
        className={styles.heroImage}
      />
    </div>
  )
}
