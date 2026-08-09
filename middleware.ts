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
  if (!host.startsWith('demo.')) return NextResponse.next()

  const { pathname } = req.nextUrl

  // The demo host's robots.txt is a hard disallow-all.
  if (pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex, nofollow' },
    })
  }

  // Already-internal paths (assets excluded by the matcher) pass through.
  const url = req.nextUrl.clone()
  url.pathname = pathname.startsWith('/demo') ? pathname : `/demo${pathname === '/' ? '' : pathname}`
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
