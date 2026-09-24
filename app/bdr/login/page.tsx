'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BdrLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('proxe@goproxe.com')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/bdr/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        setError(body.error || 'Could not sign in. Try again.')
        return
      }
      setPassword('')
      router.replace('/bdr')
      router.refresh()
    } catch {
      setError('Connection failed. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="bdr-login">
    <style>{`html,body{margin:0;background:#0d0b12}.bdr-login{min-height:100vh;display:grid;place-items:center;padding:24px;color:#f3efff;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-sizing:border-box}.bdr-login *{box-sizing:border-box}.bdr-login form{width:min(100%,420px);padding:32px;border:1px solid rgba(196,181,253,.18);border-radius:20px;background:#15121d}.bdr-login .kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a78bfa;font-weight:700}.bdr-login h1{font-size:30px;line-height:1.12;margin:10px 0}.bdr-login p{color:#b9b0cf;margin:0 0 24px}.bdr-login label{display:block;margin:16px 0;font-size:13px;font-weight:700;color:#b9b0cf}.bdr-login input{display:block;width:100%;margin-top:6px;min-height:48px;padding:10px 12px;border-radius:10px;border:1px solid rgba(196,181,253,.25);background:#0d0b12;color:#f3efff;font:inherit}.bdr-login input:focus{outline:2px solid #a78bfa}.bdr-login button{width:100%;min-height:50px;margin-top:10px;border:0;border-radius:10px;background:#a78bfa;color:#1b0b3a;font:inherit;font-weight:800;cursor:pointer}.bdr-login button:disabled{opacity:.5;cursor:wait}.bdr-login .error{color:#ffd4dc;background:rgba(251,113,133,.12);border-radius:8px;padding:10px;margin:10px 0}`}</style>
    <form onSubmit={signIn}>
      <span className="kicker">PROXe dialer</span>
      <h1>Sign in to dial</h1>
      <p>Use your existing PROXe admin password. Dial and review call history here.</p>
      <label>Email<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {error && <div className="error" role="alert">{error}</div>}
      <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  </main>
}
