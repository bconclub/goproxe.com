'use client'

import { OperatorLogin } from '../../components/shared/OperatorLogin'

export default function AdminLoginPage() {
  return <OperatorLogin next="/admin" kicker="PROXe admin" title="Sign in to admin" blurb="Use your existing PROXe admin password. Leads, deck views, calls and the dialer, in one place." />
}
