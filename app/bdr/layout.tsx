import type { Metadata } from 'next'

// Internal tool for the BDR team. Never indexed, never linked from the site.
export const metadata: Metadata = {
  title: 'PROXe dialer',
  robots: { index: false, follow: false, nocache: true },
}

export default function BdrLayout({ children }: { children: React.ReactNode }) {
  return children
}
