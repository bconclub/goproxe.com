'use client'

import { useRouter } from 'next/navigation'

export default function SignOut() {
  const router = useRouter()
  return (
    <button
      type="button"
      className="ghost"
      onClick={async () => {
        await fetch('/api/bdr/session', { method: 'DELETE' })
        router.replace('/admin/login')
        router.refresh()
      }}
    >
      Sign out
    </button>
  )
}
