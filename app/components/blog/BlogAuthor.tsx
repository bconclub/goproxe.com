import styles from './BlogAuthor.module.css'

export function BlogAuthor() {
  return (
    <div className={styles.authorRow}>
      <img 
        src="/proxe/thanzeel-ashruf-144.webp"
        alt="Thanzeel Ashruf"
        width={48}
        height={48}
        decoding="async"
        className={styles.authorPortrait}
      />
      <div className={styles.authorInfo}>
        <div className={styles.authorName}>Thanzeel Ashruf</div>
        <div className={styles.authorTitle}>Founder/CEO PROXe</div>
      </div>
    </div>
  )
}
