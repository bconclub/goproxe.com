'use client'

import { useState } from 'react'

/**
 * Make a tracked deck link for one person (Z, 7 Oct 2026): name + brand in,
 * goproxe.com/what-is-proxe?for=name-brand out, ready to copy or WhatsApp.
 * Their visits then show in the table below under that name.
 */
const slug = (v: string) => v.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 28)

export default function LinkBuilder() {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [page, setPage] = useState<'what-is-proxe' | 'pitch'>('what-is-proxe')
  const [copied, setCopied] = useState(false)

  const tag = [slug(name), slug(brand)].filter(Boolean).join('-')
  const link = tag ? `https://goproxe.com/${page}?for=${tag}` : ''
  const first = name.trim().split(/\s+/)[0] || ''
  // The WhatsApp copy carries its channel, so "Came from" reads whatsapp, not direct.
  const message = link
    ? `Hi ${first || 'there'}, here's a 3-minute look at what PROXe can do${brand.trim() ? ` for ${brand.trim()}` : ''}: ${link}&utm_source=whatsapp`
    : ''

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text) } catch { /* the field is selectable as a fallback */ }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section style={box}>
      <h2 style={{ fontSize: 17, margin: 0 }}>Make a link for someone</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Person's name" style={input} aria-label="Person's name" />
        <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name" style={input} aria-label="Brand name" />
        <select value={page} onChange={(e) => setPage(e.target.value as 'what-is-proxe' | 'pitch')} style={{ ...input, flex: '0 0 auto' }} aria-label="Which deck">
          <option value="what-is-proxe">What is PROXe (customers)</option>
          <option value="pitch">Pitch (investors)</option>
        </select>
      </div>
      {link && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} style={{ ...input, flex: '1 1 320px', fontFamily: 'ui-monospace, monospace', fontSize: 13 }} aria-label="Tracked link" />
            <button type="button" onClick={() => copy(link)} style={btn}>{copied ? 'Copied' : 'Copy link'}</button>
            <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" style={{ ...btn, background: '#22c55e', textDecoration: 'none' }}>Send on WhatsApp</a>
          </div>
          <p style={{ fontSize: 12.5, opacity: .6, margin: '8px 0 0' }}>Their visits show below as <b>{tag}</b>.</p>
        </div>
      )}
    </section>
  )
}

const box: React.CSSProperties = { background: 'rgba(124,58,237,.14)', border: '1px solid rgba(167,139,250,.3)', borderRadius: 18, padding: 18, marginTop: 18 }
const input: React.CSSProperties = { flex: '1 1 200px', height: 42, borderRadius: 12, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(0,0,0,.3)', color: '#fff', padding: '0 12px', fontSize: 14.5 }
const btn: React.CSSProperties = { height: 42, borderRadius: 12, border: 0, background: '#7c3aed', color: '#fff', padding: '0 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }
