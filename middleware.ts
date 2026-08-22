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
 *
 * TTFB optimization: Cache-Control headers enable edge/CDN caching for static
 * pages. For sub-200ms TTFB, serve pre-rendered HTML directly from nginx:
 * 1. Build: `npm run build` creates `.next/server/app/*.html`
 * 2. nginx: `try_files $uri.html $uri/ @nextjs` serves HTML if exists, proxies otherwise
 * 3. This bypasses pm2/Node for static pages, reducing TTFB from ~550ms to <200ms
 */
export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0] // strip :3003
  const { pathname } = req.nextUrl

  // Host preference: www.goproxe.com → https://goproxe.com (apex) for SEO
  // canonicalization. Localhost and demo hosts are not redirected.
  if (host === 'www.goproxe.com') {
    const { pathname, search } = req.nextUrl
    return NextResponse.redirect(`https://goproxe.com${pathname}${search}`, 301)
  }

  // The unshipped replica also stays unreachable by direct path on the main
  // host — /demo/* goes home too.
  if (!host.startsWith('demo.')) {
    if (pathname.startsWith('/demo')) {
      return NextResponse.redirect('https://goproxe.com/', 301)
    }
    // Add cache headers for static pages to improve TTFB
    const response = NextResponse.next()
    if (pathname === '/' || !pathname.includes('.')) {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    }
    return response
  }

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
