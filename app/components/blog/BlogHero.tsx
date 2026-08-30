import styles from './BlogHero.module.css'

type BlogHeroProps = {
  src: string
  alt: string
}

export function BlogHero({ src, alt }: BlogHeroProps) {
  return (
    <div className={styles.hero}>
      <img
        src={src}
        alt={alt}
        className={styles.heroImage}
      />
    </div>
  )
}
