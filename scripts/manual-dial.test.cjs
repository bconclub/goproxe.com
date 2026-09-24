const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

async function run(key, dry = false) {
  const calls = []
  const exports = {}
  const source = ts.transpileModule(fs.readFileSync('app/api/outreach-dial/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  vm.runInNewContext(source, {
    exports, Request, Response, AbortSignal, Date, console,
    process: { env: {
      ELEVENLABS_API_KEY: 'provider', DIAL_API_KEY: 'bot-key', BDR_DIAL_KEY: 'manual-key',
      ARC_INGEST_SECRET: 'arc', DIAL_ALLOWLIST: '8888888888',
    } },
    require: (name) => name === 'next/server' ? { NextResponse: Response }
      : name.includes('quietHours') ? { isQuiet: () => true, nextOpenTime: () => new Date() }
      : { spokenBusinessName: (value) => value },
    fetch: async (url, options) => {
      calls.push({ url, options })
      return Response.json(url.includes('/reserve')
        ? { target_id: 'target-1' } : { conversation_id: 'conv_test' })
    },
  })
  const response = await exports.POST(new Request('https://dial.test/api/outreach-dial', {
    method: 'POST', headers: { authorization: `Bearer ${key}` },
    body: JSON.stringify({ phone: '9999999999', agent: 'dm', vars: { business_name: 'Clinic', first_name: 'Rakesh' }, dry_run: dry }),
  }))
  return { response, calls }
}

(async () => {
  const manual = await run('manual-key')
  assert.equal(manual.response.status, 200)
  assert.equal(manual.calls.length, 2)
  assert.equal(JSON.parse(manual.calls[0].options.body).manual_override, true)
  assert.equal(manual.calls[0].options.headers['X-Agent-Name'], 'bdr-bdr')

  const preview = await run('manual-key', true)
  assert.equal(preview.response.status, 200)
  assert.equal(preview.calls.length, 1)

  const bot = await run('bot-key')
  assert.equal(bot.response.status, 403)
  assert.equal(bot.calls.length, 0)
  console.log('3 BDR manual dial checks passed')
})().catch((error) => { console.error(error); process.exitCode = 1 })
