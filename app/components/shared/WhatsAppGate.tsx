'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { track } from '../../lib/analytics'
import { getAttribution } from '../../lib/attribution'
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage'

/**
 * One field before the WhatsApp chat opens: their name (Z, 7 Oct 2026: "bring
 * back the gate, just take the name and start the conversation; the moment
 * they message, we know who they are").
 *
 * The number comes from WhatsApp itself, so the name is all the page needs to
 * ask. The first message reads "Hi, I'm Ravi. ... PX-7K2QF": PROXe greets a
 * person, and the short code carries the campaign (stored at /api/wa-ref, with
 * the name) which PROXe core attaches to the lead when the message arrives.
 *
 * - window.open runs in the submit handler, on the gesture, so iOS Safari's
 *   popup blocker does not eat it.
 * - A returning visitor's name is prefilled.
 * - Rendered through a portal into .proxe-root (the floating header's
 *   backdrop-filter would otherwise trap position:fixed, and the brand fonts
 *   live on .proxe-root).
 */

const PHONE = '918123808817' // +91 81238 08817, E.164 without the + (PROXe WABA)

/** 5 characters, no look-alikes (0/O, 1/I). */
function refCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rnd = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(5)) : null
  let out = ''
  for (let i = 0; i < 5; i++) out += alphabet[(rnd ? rnd[i] : Math.floor(Math.random() * 256)) % alphabet.length]
  return out
}

function waLink(name: string, location: string): string {
  const code = refCode()
  try {
    const a: any = getAttribution()
    const attribution = {
      channel: a.channel, utm_source: a.utmSource, utm_medium: a.utmMedium, utm_campaign: a.utmCampaign,
      referrer: a.referrer, landing_page: a.landingPage,
    }
    const payload = JSON.stringify({ code, location, name, attribution })
    if (!(navigator.sendBeacon && navigator.sendBeacon('/api/wa-ref', payload))) {
      void fetch('/api/wa-ref', { method: 'POST', body: payload, keepalive: true }).catch(() => {})
    }
  } catch { /* attribution unavailable: the chat still opens */ }
  const first = name.trim().split(/\s+/)[0]
  const text = `Hi, I'm ${first}. I want to know more about PROXe. PX-${code}`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
}

export default function WhatsAppGate({ open, onClose, location = 'header' }: { open: boolean; onClose: () => void; location?: string }) {
  const [name, setName] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    const u = getStoredUser?.('proxe')
    if (u?.name) setName(u.name)
    setErr(null)
    // Not whatsapp_click: that is Meta's Contact, and it fires once, when the chat actually opens.
    track('button_click', { label: 'whatsapp_gate_open', location })
    const t = setTimeout(() => nameRef.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [open, onClose, location])

  if (!open || !mounted) return null

  const start = (e?: React.FormEvent) => {
    e?.preventDefault()
    // Read the field itself: some Android keyboards leave text React never saw.
    const cleanName = (nameRef.current?.value ?? name).replace(/\s+/g, ' ').trim()
    if (!cleanName) { setErr('Your name, so PROXe knows who it is talking to.'); nameRef.current?.focus(); return }
    const href = waLink(cleanName, location)
    // Opened on the gesture, before anything async.
    const win = window.open(href, '_blank', 'noopener')
    try {
      storeUserProfile({ ...(getStoredUser('proxe') ?? {}), name: cleanName }, 'proxe')
      track('whatsapp_click', { location, stage: 'named' })
    } catch { /* analytics never blocks the chat */ }
    onClose()
    if (!win) window.location.href = href
  }

  const host = typeof document !== 'undefined' ? (document.querySelector('.proxe-root') as HTMLElement | null) ?? document.body : null
  if (!host) return null
  return createPortal(
    <div className="wag-backdrop" role="dialog" aria-modal="true" aria-label="Start a WhatsApp chat" onClick={onClose}>
      <form className="wag-card" onClick={(e) => e.stopPropagation()} onSubmit={start} noValidate>
        <div className="wag-head">
          <h3 className="wag-title">Chat with PROXe on WhatsApp</h3>
          <button type="button" className="wag-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <label className="wag-label" htmlFor="wag-name">Your name</label>
        <input id="wag-name" ref={nameRef} className="wag-input" value={name}
          onChange={(e) => { setName(e.target.value); setErr(null) }}
          placeholder="Your name" autoComplete="given-name" maxLength={60} />
        {err && <p className="wag-err" role="alert">{err}</p>}
        <button type="submit" className="wag-go">
          Open WhatsApp <span aria-hidden="true" className="wag-arrow">↗</span>
        </button>
      </form>
    </div>,
    host,
  )
}
