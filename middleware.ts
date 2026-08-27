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
    const { pathname, search } = req.nextUrl
    return NextResponse.redirect(`https://goproxe.com${pathname}${search}`, 301)
  }

  // The demo stays unreachable by direct path on the MAIN host - distribution
  // is warm-leads-only through demo.goproxe.com links. localhost is exempt so
  // the gate can be developed and verified without spoofing the Host header.
  const isLocal = host === 'localhost' || host.startsWith('127.') || host.endsWith('.localhost')
  if (!host.startsWith('demo.') && !isLocal) {
    if (req.nextUrl.pathname.startsWith('/demo')) {
      return NextResponse.redirect('https://goproxe.com/', 301)
    }
    return NextResponse.next()
  }
  if (isLocal && !req.nextUrl.pathname.startsWith('/demo') && req.nextUrl.pathname !== '/robots.txt') {
    // Local dev serves the whole site normally; only demo.* hosts get the
    // root-to-hub rewrite below.
    return NextResponse.next()
  }

  const { pathname } = req.nextUrl

  // The demo host's robots.txt is a hard disallow-all.
  if (pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex, nofollow' },
    })
  }

  // LIVE (2026-08-27): the hub ships. The Aug-09 condition is met - the
  // interactive part is the REAL dashboard (the try.goproxe.com deployment,
  // BRAND_ID=demo, mock data); this host serves the chooser + video gate that
  // leads into it. Distribution stays warm-leads-only: nothing on the main
  // host links here and the noindex layers all hold.
  const url = req.nextUrl.clone()
  // Idempotent prefix: demo.goproxe.com/clinics → /demo/clinics, while a path
  // already under /demo (localhost dev, or a pasted full path) passes as-is.
  url.pathname = pathname === '/' ? '/demo'
    : pathname.startsWith('/demo') ? pathname
    : `/demo${pathname}`
  const res = NextResponse.rewrite(url)
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export const config = {
  // Never touch _next assets, API routes, or static files with extensions —
  // rewriting a chunk URL to /demo/_next/... would 404 every asset on the
  // demo host.
  matcher: ['/((?!_next/|api/|.*\\..*).*)', '/robots.txt'],
}
