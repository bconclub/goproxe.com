'use client'

import { OperatorLogin } from '../../components/shared/OperatorLogin'

export default function BdrLoginPage() {
  return <OperatorLogin next="/bdr" kicker="PROXe dialer" title="Sign in to dial" blurb="Use your existing PROXe admin password. Dial and review call history here." />
}
