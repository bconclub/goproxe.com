import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * demo.goproxe.com → /demo/* — one Next app, two hosts.
 *
 * The demo dashboard is served by this same deployment; a separate Vercel
 * project would duplicate fonts, CSS, analytics and the industry registry for
 * the sake of ~15 lines here. The host check runs first so goproxe.com
 * traffic pays near-zero cost.
 *
 * The demo must never index: X-Robots-Tag here, `robots: noindex` metadata in
 * app/demo/layout.tsx, and a disallow-all robots.txt on the demo host — belt,
 * braces, and a second belt. `goproxe.com/demo/*` stays reachable directly
 * (local dev, preview deploys, pre-DNS production) and is covered by the
 * metadata noindex.
 */
export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0] // strip :3003

  // Host preference: www.goproxe.com → https://goproxe.com (apex) for SEO
  // canonicalization. Localhost and demo hosts are not redirected.
  if (host === 'www.goproxe.com') {
    const url = new URL(req.url)
    url.host = 'goproxe.com'
    return NextResponse.redirect(url, 301)
  }

  // The unshipped replica also stays unreachable by direct path on the main
  // host — /demo/* goes home too.
  if (!host.startsWith('demo.')) {
    if (req.nextUrl.pathname.startsWith('/demo')) {
      return NextResponse.redirect(new URL('/', req.url), 301)
    }
    return NextResponse.next()
  }

  const { pathname } = req.nextUrl

  // The demo host's robots.txt is a hard disallow-all.
  if (pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex, nofollow' },
    })
  }

  // INTERIM (2026-08-09): the replica demo is unshipped — the demo must be the
  // REAL PROXe dashboard, pixel-identical, and until that deployment exists
  // this host sends visitors to the landing page instead of a lookalike. When
  // the real demo goes live, demo.goproxe.com's DNS moves off this app and
  // this branch never fires again.
  return NextResponse.redirect('https://goproxe.com/', 302)
}

export const config = {
  // Never touch _next assets, API routes, or static files with extensions —
  // rewriting a chunk URL to /demo/_next/... would 404 every asset on the
  // demo host.
  matcher: ['/((?!_next/|api/|.*\\..*).*)', '/robots.txt'],
}
