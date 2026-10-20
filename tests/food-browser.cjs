const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage();
await page.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));
await page.goto(process.env.FORM_TEST_URL||'http://localhost:3000');await page.locator('[data-action="begin"]').click();
 await page.locator('nav [data-action="food"]').click();await page.locator('[data-action="dietary"]').click();await page.waitForSelector('[data-form="dietary"]');await page.locator('[data-form="dietary"] [name="diet"]').selectOption('any');await page.locator('[data-form="dietary"] button').click();await page.waitForSelector('dialog[open]',{state:'detached'});await page.waitForSelector('.meal-timeline');
 assert.match(await page.locator('main').innerText(),/Bhubaneswar/);assert.match(await page.locator('.meal-timeline').innerText(),/dalma and machha jhola/);assert.match(await page.locator('.meal-timeline').innerText(),/Protein comes from/);assert.match(await page.locator('.meal-timeline').innerText(),/Fibre comes from/);
 await page.locator('[data-meal-slot="lunch"]').selectOption('1');await page.waitForFunction(()=>document.querySelector('.meal-timeline').textContent.includes('Rice, dalma and saaga'));
 await page.locator('[data-action="plannedmeal:lunch"]').click();await page.waitForFunction(()=>document.querySelector('.meal-timeline').textContent.includes('Recorded for 13:00'));
 const dinner=page.locator('[data-form="plannedmeal"][data-slot="dinner"]');await dinner.locator('..').locator('summary').click();await dinner.locator('[name="time"]').fill('20:15');await dinner.locator('[name="name"]').fill('Rice and dalma');await dinner.locator('[name="portion"]').fill('1 bowl each');await dinner.locator('[name="protein"]').fill('20');await dinner.locator('[name="kcal"]').fill('600');await dinner.locator('button').click();await page.waitForFunction(()=>document.querySelector('.meal-timeline').textContent.includes('Recorded for 20:15'));
 await page.screenshot({path:'/private/tmp/stride-food.png',fullPage:true});
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForSelector('.meal-timeline');assert.match(await page.locator('.meal-timeline').innerText(),/Rice and dalma/);
console.log('PASS: local food choices, dietary filters, recorded meals/times and offline persistence.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
