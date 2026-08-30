import styles from './BlogMeta.module.css'

type BlogMetaProps = {
  date: string
  readTime: number
  tradeLabel: string
}

export function BlogMeta({ date, readTime, tradeLabel }: BlogMetaProps) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaDate}>Last updated {date}</span>
      <span className={styles.metaDot}>·</span>
      <span className={styles.metaRead}>{readTime} min read</span>
      <span className={styles.tradeChip}>{tradeLabel}</span>
    </div>
  )
}
