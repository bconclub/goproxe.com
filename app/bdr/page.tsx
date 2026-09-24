import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BDR_COOKIE, verifyBdrSession } from '../lib/bdrSession'
import Dialer from './Dialer'

export const dynamic = 'force-dynamic'

export default async function BdrPage() {
  const cookieStore = await cookies()
  if (!verifyBdrSession(cookieStore.get(BDR_COOKIE)?.value)) redirect('/bdr/login')
  return <Dialer />
}
