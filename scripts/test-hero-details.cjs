const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL || "msedge"});
 for(const mode of ['success','save-failure','call-failure','mobile']){
  const context=await browser.newContext({viewport:mode==='mobile'?{width:390,height:844}:{width:1365,height:900}});
  const page=await context.newPage();const leads=[];const calls=[];
  await page.route('**/api/lead',async r=>{leads.push(r.request().postDataJSON());await r.fulfill({status:mode==='save-failure'?500:200,contentType:'application/json',body:'{"ok":true}'});});
  await page.route('**/api/callback',async r=>{calls.push(r.request().postDataJSON());await new Promise(x=>setTimeout(x,200));await r.fulfill({status:mode==='call-failure'?503:200,contentType:'application/json',body:JSON.stringify({ok:mode!=='call-failure',reason:'network_error'})});});
  await page.goto('http://localhost:4076',{waitUntil:'networkidle'}); await page.waitForTimeout(1000);
  const phone=page.locator('.proxe-hero-phone-input').first();await phone.fill('9876543210');
  await page.locator('.proxe-hero-phone').first().evaluate(f=>f.requestSubmit());
  const form=page.getByRole('form',{name:'Who should PROXe ask for'});await form.waitFor();
  await page.waitForTimeout(13000);
  assert.equal(leads.length,0);assert.equal(calls.length,0);assert.equal(await form.getByText('Skip',{exact:true}).count(),0);
  await form.getByRole('button',{name:'Call me now'}).click();assert.equal(calls.length,0);
  await form.getByLabel('Your name').fill('   ');await form.getByLabel('Your business').fill('Clinic');await form.getByRole('button',{name:'Call me now'}).click();await form.getByRole('alert').waitFor();assert.equal(leads.length,0);
  await form.getByLabel('Your name').fill('Test   Person');await form.getByLabel('Your business').fill('Test Dental');
  await form.evaluate(f=>{f.requestSubmit();f.requestSubmit();});
  
  if(mode==='save-failure'){await page.getByText(/couldn't save your details/).waitFor();assert.equal(calls.length,0);assert.equal(await form.getByLabel('Your name').inputValue(),'Test   Person');}
  else if(mode==='call-failure'){await page.getByText(/could not confirm your call/).waitFor();assert.equal(calls.length,1);}
  else{await page.getByText('PROXe is calling you, Test.').waitFor();assert.equal(calls.length,1);assert.equal(calls[0].name,'Test Person');assert.equal(calls[0].business,'Test Dental');}
  assert.equal(leads.length,1);assert.equal(leads[0].name,'Test Person');assert.equal(leads[0].brandName,'Test Dental');
  if(mode==='mobile')assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  console.log('PASS',mode,'no auto-call, validation, payload, duplicate guard and result');await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

