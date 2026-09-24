const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

const source = ts.transpileModule(fs.readFileSync('app/lib/bdrSession.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const session = {}
const env = { BDR_DIAL_KEY: 'test-secret', DIAL_API_KEY: 'bot-key', NODE_ENV: 'production' }
vm.runInNewContext(source, {
  exports: session, Buffer, Date, JSON, URL,
  process: { env },
  require: (name) => require(name),
})

const token = session.issueBdrSession('admin-id')
assert.equal(session.verifyBdrSession(token), true)
assert.equal(session.verifyBdrSession(token + 'x'), false)
assert.equal(session.verifyBdrSession(null), false)
assert.equal(session.hasBdrSession(new Request('https://dial.test', { headers: { cookie: `${session.BDR_COOKIE}=${token}` } })), true)
assert.equal(session.isBdrOperator(new Request('https://dial.test', { headers: { authorization: 'Bearer bot-key' } })), true)
assert.equal(session.isBdrOperator(new Request('https://dial.test', { headers: { authorization: 'Bearer test-secret' } })), false)
assert.equal(session.isBdrSameOrigin(new Request('http://internal:3002', { headers: { origin: 'https://goproxe.com' } })), true)
assert.equal(session.isBdrSameOrigin(new Request('http://internal:3002', { headers: { origin: 'https://evil.example' } })), false)
console.log('8 BDR session checks passed')
