import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BlogHub } from '../components/blog/BlogHub'
import styles from '../styles/legal.module.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'Blog',
  description: 'How businesses miss conversations, lose leads, and what to do about it.',
  alternates: {
    canonical: 'https://goproxe.com/blog',
  },
}

export default function BlogIndexPage() {
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>PROXe Blog</h1>
          <p className={styles.lede}>
            How businesses miss conversations, lose leads, and what to do about it.
          </p>

          <div style={{ marginTop: '48px' }}>
            <BlogHub />
          </div>

          <div style={{ marginTop: '64px', textAlign: 'center' }}>
            <Link href="/" className={styles.navLink}>
              ← Back to home
            </Link>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center', opacity: 0.7 }}>
            <img src="/proxe/brand/proxe-logo-white.webp" alt="PROXe" style={{ height: '18px', width: 'auto' }} />
          </div>
        </div>
      </main>
    </div>
  )
}
