import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../lib/supabase'
import { BDR_ADMIN_EMAIL, BDR_COOKIE, hasBdrSession, issueBdrSession } from '../../../lib/bdrSession'

export const dynamic = 'force-dynamic'

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get('origin')
  return !origin || origin === req.nextUrl.origin
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: hasBdrSession(req) }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json().catch(() => null)
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')
  if (email !== BDR_ADMIN_EMAIL || !password) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  const client = getSupabaseClient()
  if (!client) return NextResponse.json({ error: 'Login unavailable' }, { status: 503 })
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error || !data.user || data.user.email?.toLowerCase() !== BDR_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
  const token = issueBdrSession(data.user.id)
  if (!token) return NextResponse.json({ error: 'Login unavailable' }, { status: 503 })
  const response = NextResponse.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } })
  response.cookies.set(BDR_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 8 * 60 * 60 })
  return response
}

export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const response = NextResponse.json({ authenticated: false }, { headers: { 'Cache-Control': 'no-store' } })
  response.cookies.set(BDR_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
