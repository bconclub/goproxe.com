import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// Internal admin for the PROXe team. Never indexed, never linked from the site.
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
}

// Inter, as on /what-is-proxe (the moodboard's one family).
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-admin' })

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>
}
