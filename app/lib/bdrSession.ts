import { createHmac, timingSafeEqual } from 'node:crypto'

export const BDR_COOKIE = 'proxe_bdr_session'
export const BDR_ADMIN_EMAIL = 'proxe@goproxe.com'
const SESSION_SECONDS = 8 * 60 * 60

function secret() {
  // Never sign with the former browser passcode. It was stored in localStorage.
  return process.env.BDR_SESSION_SECRET || process.env.DIAL_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || null
}

export function issueBdrSession(userId: string) {
  const key = secret()
  if (!key) return null
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString('base64url')
  const signature = createHmac('sha256', key).update(`bdr-session:${payload}`).digest('base64url')
  return `${payload}.${signature}`
}

export function verifyBdrSession(token: string | undefined | null) {
  const key = secret()
  if (!key || !token) return false
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return false
  const expected = createHmac('sha256', key).update(`bdr-session:${payload}`).digest()
  let actual: Buffer
  try { actual = Buffer.from(signature, 'base64url') } catch { return false }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return typeof data.sub === 'string' && data.sub.length > 0 && Number.isSafeInteger(data.exp) && data.exp > Date.now() / 1000
  } catch { return false }
}

export function hasBdrSession(req: Request) {
  const cookie = req.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${BDR_COOKIE}=`))
  return verifyBdrSession(cookie?.slice(BDR_COOKIE.length + 1))
}

export function isBdrOperator(req: Request) {
  if (hasBdrSession(req)) return true
  const key = process.env.DIAL_API_KEY
  const bearer = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  return !!key && bearer === key
}
