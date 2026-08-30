import styles from './BlogToc.module.css'

type TocItem = {
  id: string
  text: string
}

type BlogTocProps = {
  items: TocItem[]
}

export function BlogToc({ items }: BlogTocProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <nav className={styles.toc} aria-label="Table of Contents">
      <h2 className={styles.tocTitle}>Contents</h2>
      <ul className={styles.tocList}>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.tocLink}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
