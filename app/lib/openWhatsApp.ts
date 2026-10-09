/**
 * Open a WhatsApp chat with a prefilled message, from a click handler.
 *
 * In-app browsers (Instagram, Facebook, Messenger, LinkedIn) keep https links
 * inside their own webview, so wa.me loads WhatsApp's web page instead of the
 * app (seen on Android from Instagram, 9 Oct 2026). There we hand the OS a link
 * only the app can answer: an Android intent (falls back to wa.me when WhatsApp
 * is not installed) or the whatsapp:// scheme on iOS (falls back after a beat if
 * the page is still visible).
 *
 * Everywhere else wa.me opens in a new tab. 'noopener' is set on the window
 * after opening rather than passed as a feature: with the feature, window.open
 * always returns null, which read as "blocked" and sent this tab to wa.me too.
 */
export function openWhatsApp(phone: string, text: string): void {
  const msg = encodeURIComponent(text)
  const web = `https://wa.me/${phone}?text=${msg}`
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
  const inApp = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|LinkedInApp/i.test(ua)

  if (inApp && /Android/i.test(ua)) {
    // No package=, so WhatsApp Business also answers.
    window.location.href = `intent://send/?phone=${phone}&text=${msg}#Intent;scheme=whatsapp;S.browser_fallback_url=${encodeURIComponent(web)};end`
    return
  }
  if (inApp && /iPhone|iPad|iPod/i.test(ua)) {
    window.location.href = `whatsapp://send?phone=${phone}&text=${msg}`
    setTimeout(() => { if (document.visibilityState === 'visible') window.location.href = web }, 2500)
    return
  }

  const win = window.open(web, '_blank')
  if (win) { try { win.opener = null } catch { /* cross-origin: already detached */ } }
  else window.location.href = web
}
