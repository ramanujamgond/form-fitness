const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage();
 await page.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));await page.clock.install({time:new Date('2026-10-12T06:59:00Z')});await page.clock.pauseAt(new Date('2026-10-12T07:00:00Z'));
 const origin=process.env.FORM_TEST_URL||'http://localhost:3000';await page.goto(origin);await page.locator('[data-action="begin"]').click();await page.getByRole('button',{name:'Train',exact:true}).click();assert.equal(await page.locator('.session-clock').count(),0);
 await page.locator('[data-action="startsession"]').click();await page.waitForSelector('[data-coach-phase="warmup"]');await page.clock.runFor(65500);assert.equal(await page.locator('[data-session-clock]').innerText(),'00:01:05');
 await page.getByRole('button',{name:'Food',exact:true}).click();await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForSelector('[data-session-clock]');assert.equal(await page.locator('[data-session-clock]').innerText(),'00:01:05');await page.locator('[data-action^="resumesession:"]').click();await page.locator('[data-action="warmnext"]').click();await page.waitForSelector('.coach-log');
 while(await page.locator('.coach-log').count()){
  const id=await page.locator('.coach-log').getAttribute('data-exercise');await page.getByText('I can’t do this exercise',{exact:true}).click();await page.locator('[data-form="skipexercise"] select').selectOption({label:'Equipment unavailable'});await page.locator('[data-form="skipexercise"] button').click();await page.waitForFunction(id=>document.querySelector('.coach-log')?.dataset.exercise!==id,id);
 }
 await page.waitForSelector('[data-coach-phase="cooldown"]');await page.clock.runFor(5000);await page.locator('[data-action="finishworkout"]').click();await page.waitForSelector('[data-coach-phase="complete"]');assert.equal(await page.locator('.session-clock strong').innerText(),'00:01:10');await page.clock.runFor(60000);assert.equal(await page.locator('.session-clock strong').innerText(),'00:01:10');
 await page.getByRole('button',{name:'Progress',exact:true}).click();assert.match(await page.locator('.session-history').innerText(),/00:01:10/);await page.reload();await page.waitForSelector('.session-history');assert.match(await page.locator('.session-history').innerText(),/00:01:10/);
 console.log('PASS: explicit timer start, navigation/offline resume, cooldown/save and frozen duration in history.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
