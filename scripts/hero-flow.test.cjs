const assert = require('node:assert/strict')
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
  try {
    for (const width of [320, 768, 1024, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      const submissions = []
      let fail = true
      await page.route('**/api/lead', async (route) => {
        submissions.push(route.request().postDataJSON())
        await route.fulfill({ status: 200, json: { ok: true } })
      })
      await page.route('**/api/callback', async (route) => {
        submissions.push(route.request().postDataJSON())
        await route.fulfill({ status: 200, json: fail ? { ok: false, reason: 'network_error' } : { ok: true } })
      })
      await page.goto(process.env.HERO_TEST_URL || 'http://localhost:3019', { waitUntil: 'domcontentloaded' })
      const phone = page.getByRole('textbox', { name: 'Phone number', exact: true })
      await page.waitForFunction(() => document.querySelector('.proxe-hero-phone-input')?.placeholder !== 'Your phone number')
      await phone.fill('9999999999')
      assert(await page.getByRole('button', { name: 'Talk to PROXe now', exact: true }).isVisible())
      await phone.press('Enter')
      const form = page.getByRole('form', { name: 'Your callback details' })
      await form.waitFor()
      assert.equal(await form.locator('input').count(), 2)
      assert.equal(await form.getByText('A couple of details before we call').count(), 0)
      await form.getByRole('button', { name: 'Call me now', exact: true }).click()
      assert.equal(submissions.length, 0)
      await form.getByRole('button', { name: 'Back', exact: true }).click()
      assert.equal(await phone.inputValue(), '9999999999')
      await phone.press('Enter')
      await form.getByRole('textbox', { name: 'Name', exact: true }).fill('Test Name')
      await form.getByRole('textbox', { name: 'Business', exact: true }).fill('Test Business')
      await form.getByRole('button', { name: 'Call me now', exact: true }).click()
      await form.getByRole('alert').waitFor()
      assert.equal(await form.getByRole('textbox', { name: 'Name', exact: true }).inputValue(), 'Test Name')
      fail = false
      await form.getByRole('button', { name: 'Call me now', exact: true }).click()
      await page.getByText('PROXe is calling you, Test.').waitFor()
      assert.equal(submissions.length, 4)
      assert.equal(submissions[3].business, 'Test Business')
      const order = await page.evaluate(() => ['.proxe-hero-video', '#voice', '.ind-section', '.hiw-section', '#pricing'].map((selector) => Array.from(document.querySelectorAll('section, .proxe-hero-video')).indexOf(document.querySelector(selector))))
      assert(order.every((value, index) => value >= 0 && (!index || value > order[index - 1])), `Wrong section order: ${order}`)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      console.log(`${width}px: form, validation, Back, retry, success, section order passed`)
      await page.close()
    }
  } finally { await browser.close() }
})().catch((error) => { console.error(error); process.exitCode = 1 })
