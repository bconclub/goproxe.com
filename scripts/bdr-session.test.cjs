const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

const source = ts.transpileModule(fs.readFileSync('app/lib/bdrSession.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const session = {}
vm.runInNewContext(source, {
  exports: session, Buffer, Date, JSON,
  process: { env: { BDR_DIAL_KEY: 'test-secret', DIAL_API_KEY: 'bot-key' } },
  require: (name) => require(name),
})

const token = session.issueBdrSession('admin-id')
assert.equal(session.verifyBdrSession(token), true)
assert.equal(session.verifyBdrSession(token + 'x'), false)
assert.equal(session.verifyBdrSession(null), false)
assert.equal(session.hasBdrSession(new Request('https://dial.test', { headers: { cookie: `${session.BDR_COOKIE}=${token}` } })), true)
assert.equal(session.isBdrOperator(new Request('https://dial.test', { headers: { authorization: 'Bearer bot-key' } })), true)
assert.equal(session.isBdrOperator(new Request('https://dial.test', { headers: { authorization: 'Bearer test-secret' } })), false)
console.log('6 BDR session checks passed')
