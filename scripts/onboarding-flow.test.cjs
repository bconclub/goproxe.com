const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    for (const width of [320, 768, 1024, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const leads = [];
      let fail = false;
      let checkout = 0;
      await page.route('**/api/lead', async route => {
        leads.push(route.request().postDataJSON());
        await route.fulfill({ status: fail ? 500 : 200, json: { ok: !fail } });
      });
      await page.route('**/api/checkout', async route => { checkout++; await route.abort(); });
      await page.goto('http://localhost:3019');
      assert.equal(await page.locator('head meta[name="directree-verify"]').getAttribute('content'), 'directree-verify=8be0bdf11f071f28cc2cf7cea1e547f0');
      await page.waitForFunction(() => document.querySelector('.proxe-hero-phone-input')?.placeholder !== 'Your phone number');
      await page.locator('.proxe-float-cta').click();
      await page.locator('#name').fill('Test Name');
      await page.locator('#phoneNumber').fill('9999999999');
      await page.getByRole('button', { name: 'Continue →', exact: true }).click();
      await page.waitForURL('**/onboarding');
      assert.equal(await page.locator('input').count(), 2);
      await page.getByRole('button', { name: 'Submit details' }).click();
      assert.equal(leads.length, 1);
      await page.getByLabel('Brand name', { exact: true }).fill('Test Brand');
      await page.getByLabel('Website', { exact: true }).fill('invalid');
      await page.getByRole('button', { name: 'Submit details' }).click();
      await page.getByText('Enter a valid website, such as yourbrand.com.').waitFor();
      assert.equal(leads.length, 1);
      await page.getByLabel('Website', { exact: true }).fill('example.com');
      fail = true;
      await page.getByRole('button', { name: 'Submit details' }).click();
      await page.getByText('Could not save your details. Please try again.').waitFor();
      await page.reload();
      await page.waitForFunction(() => document.querySelector('#onboarding-brand')?.value === 'Test Brand');
      assert.equal(await page.getByLabel('Website', { exact: true }).inputValue(), 'https://example.com/');
      fail = false;
      await page.getByRole('button', { name: 'Submit details' }).focus();
      await page.keyboard.press('Enter');
      await page.getByRole('heading', { name: 'Your details are saved.' }).waitFor();
      assert.equal(leads.at(-1).phone, '9999999999');
      assert.equal(leads.at(-1).brandName, 'Test Brand');
      assert.equal(checkout, 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      console.log(`${width}px: metadata, onboarding redirect, validation, retry, persistence, keyboard submission passed; no checkout`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
