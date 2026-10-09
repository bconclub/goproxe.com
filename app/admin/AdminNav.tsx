const TABS = [
  { key: 'overview', href: '/admin', label: 'Overview' },
  { key: 'meta', href: '/admin/meta', label: 'Meta' },
] as const

export default function AdminNav({ current }: { current: (typeof TABS)[number]['key'] }) {
  return (
    <nav className="nav" aria-label="Admin sections">
      {TABS.map((t) => (
        <a key={t.key} href={t.href} aria-current={t.key === current ? 'page' : undefined}>{t.label}</a>
      ))}
    </nav>
  )
}
