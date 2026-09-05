'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { submitLead } from '../../lib/leads'
import { track, trackLead, newEventId } from '../../lib/analytics'
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage'

/**
 * Name + number BEFORE the WhatsApp chat opens.
 *
 * The button used to be a bare wa.me link. Whoever tapped it arrived as an
 * unknown number in the inbox, and everything the page knew about them - the
 * ad they came from, the UTMs, the referrer, the page they were reading -
 * died at that click, because a WhatsApp deep link carries none of it
 * (Z, 31 Aug: "otherwise it's directly coming from WhatsApp, it's not working
 * out").
 *
 * Two fields is the whole gate. On submit the lead is captured with full
 * attribution through the SAME path every other form uses (submitLead →
 * /api/lead → upsertProxeLead + Meta CAPI), and only then does WhatsApp open,
 * with their name already in the first message so the agent greets a person
 * instead of a phone number.
 *
 * Deliberate choices:
 * - The chat opens even if the capture call fails. A dead Supabase must never
 *   stand between a buyer and the conversation.
 * - Anyone who filled this before is remembered (chatLocalStorage), so the
 *   gate shows once per browser, not once per visit.
 * - window.open is called from the SUBMIT HANDLER, synchronously on the click
 *   that follows a real user gesture. Opening it after an await is what gets
 *   a tab eaten by the popup blocker on iOS Safari.
 * - Rendered through a PORTAL to <body>. The floating header carries a
 *   backdrop-filter, and a filtered ancestor becomes the containing block for
 *   position:fixed descendants - inline, the dialog anchored to the header and
 *   rendered clipped at the top of the page instead of centred.
 */

const PHONE = '918123808817' // +91 81238 08817, E.164 without the + (PROXe WABA)

function waLink(name?: string): string {
  const who = (name || '').trim().split(/\s+/)[0]
  const text = who
    ? `Hi, I'm ${who}. I want to know more about PROXe.`
    : 'Hi, I want to know more about PROXe.'
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
}

export default function WhatsAppGate({
  open,
  onClose,
  location = 'header',
}: {
  open: boolean
  onClose: () => void
  location?: string
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  // Prefill from a previous capture - asking a returning visitor to retype
  // their own number is friction for nothing.
  useEffect(() => {
    if (!open) return
    const u = getStoredUser?.()
    if (u?.name) setName(u.name)
    if (u?.phone) setPhone(u.phone)
    setErr(null)
    const t = setTimeout(() => nameRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!open || !mounted) return null

  const digits = phone.replace(/\D/g, '')

  const start = () => {
    const cleanName = name.trim()
    if (!cleanName) { setErr('Your name, so we know who we are talking to.'); return }
    if (digits.length < 10) { setErr('A 10-digit mobile number, please.'); return }
    setBusy(true)

    // Opened FIRST, on the gesture, so no popup blocker eats it. The capture
    // below still runs - fetch does not need the tab.
    const win = window.open(waLink(cleanName), '_blank', 'noopener')

    // trackLead fires the pixel and RETURNS the id; the same id then rides
    // into submitLead so Meta merges the browser event with the server one
    // instead of counting the lead twice.
    let eventId = newEventId()
    try {
      eventId = trackLead({ source: 'whatsapp_gate' }) || eventId
      track('whatsapp_click', { location })
      storeUserProfile({ name: cleanName, phone: digits })
    } catch { /* analytics must never block the chat */ }

    // Attribution rides along inside submitLead (UTMs, referrer, landing page).
    void submitLead({ type: 'lead', name: cleanName, phone: digits, source: 'whatsapp_gate', eventId })
      .finally(() => {
        setBusy(false)
        onClose()
        // Popup blocked despite the gesture: fall back to a same-tab navigation
        // rather than leaving them staring at a closed dialog.
        if (!win) window.location.href = waLink(cleanName)
      })
  }

  // Portal INTO .proxe-root, not <body>: the brand font variables
  // (--font-proxe-sans etc.) live on that element, and a card rendered
  // outside it fell back to the browser serif (Z, 5 Sep).
  const host = typeof document !== 'undefined'
    ? (document.querySelector('.proxe-root') as HTMLElement | null) ?? document.body
    : null
  if (!host) return null
  const digitsTyped = phone.replace(/\D/g, '').length
  return createPortal(
    <div className="wag-backdrop" role="dialog" aria-modal="true" aria-label="Start a WhatsApp chat" onClick={onClose}>
      <div className="wag-card" onClick={(e) => e.stopPropagation()}>
        <div className="wag-head">
          <div>
            <h3 className="wag-title">Let&apos;s talk on WhatsApp</h3>
            <p className="wag-sub">Two quick steps and PROXe replies in seconds.</p>
          </div>
          <button className="wag-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="wag-steps" aria-hidden="true">
          <span className="on" />
          <span className={digitsTyped >= 10 ? 'on' : ''} />
        </div>

        <label className="wag-label" htmlFor="wag-name">Your name</label>
        <input
          id="wag-name"
          ref={nameRef}
          className="wag-input"
          value={name}
          onChange={(e) => { setName(e.target.value); setErr(null) }}
          onKeyDown={(e) => { if (e.key === 'Enter') start() }}
          placeholder="Your name"
          autoComplete="name"
        />

        <label className="wag-label" htmlFor="wag-phone">Mobile number</label>
        <div className="wag-phone">
          <span className="wag-cc">+91</span>
          <input
            id="wag-phone"
            className="wag-input"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErr(null) }}
            onKeyDown={(e) => { if (e.key === 'Enter') start() }}
            placeholder="Mobile number"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        {err && <p className="wag-err" role="alert">{err}</p>}

        <button className="wag-go" onClick={start} disabled={busy}>
          {busy ? 'Opening WhatsApp…' : 'Open WhatsApp'}
          {!busy && <span aria-hidden="true" className="wag-arrow">↗</span>}
        </button>
        <p className="wag-fine">We only use this to reply to you.</p>
      </div>
    </div>,
    host,
  )
}
