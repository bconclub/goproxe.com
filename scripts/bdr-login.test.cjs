const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

const source = ts.transpileModule(fs.readFileSync('app/api/bdr/session/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const handlers = {}
const NextResponse = {
  json(body, options = {}) {
    const response = Response.json(body, options)
    response.cookies = { set(name, value, settings) { response.headers.set('set-cookie', `${name}=${value}; Max-Age=${settings.maxAge}`) } }
    return response
  },
}
vm.runInNewContext(source, {
  exports: handlers, Response, Request, process: { env: { NODE_ENV: 'production' } },
  require: (name) => name === 'next/server' ? { NextResponse }
    : name.includes('supabase') ? { getSupabaseClient: () => ({ auth: { signInWithPassword: async ({ password }) => password === 'correct' ? { data: { user: { id: 'admin-id', email: 'proxe@goproxe.com' } }, error: null } : { data: { user: null }, error: new Error('Invalid') } } }) }
      : { BDR_ADMIN_EMAIL: 'proxe@goproxe.com', BDR_COOKIE: 'proxe_bdr_session', hasBdrSession: () => false, isBdrSameOrigin: (req) => req.headers.get('origin') === 'https://dial.test', issueBdrSession: () => 'signed-token' },
})

function request(email, password, origin = 'https://dial.test') {
  const req = new Request('https://dial.test/api/bdr/session', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ email, password }),
  })
  req.nextUrl = new URL(req.url)
  return req
}

(async () => {
  const good = await handlers.POST(request('proxe@goproxe.com', 'correct'))
  assert.equal(good.status, 200)
  assert.match(good.headers.get('set-cookie'), /proxe_bdr_session=signed-token/)
  const badPassword = await handlers.POST(request('proxe@goproxe.com', 'wrong'))
  assert.equal(badPassword.status, 401)
  const wrongEmail = await handlers.POST(request('other@example.com', 'correct'))
  assert.equal(wrongEmail.status, 401)
  const wrongOrigin = await handlers.POST(request('proxe@goproxe.com', 'correct', 'https://other.test'))
  assert.equal(wrongOrigin.status, 403)
  const logout = new Request('https://dial.test/api/bdr/session', { method: 'DELETE', headers: { origin: 'https://dial.test' } })
  logout.nextUrl = new URL(logout.url)
  const loggedOut = await handlers.DELETE(logout)
  assert.match(loggedOut.headers.get('set-cookie'), /Max-Age=0/)
  console.log('5 BDR login checks passed')
})().catch((error) => { console.error(error); process.exitCode = 1 })
