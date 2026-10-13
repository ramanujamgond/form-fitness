const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));
 await page.clock.install({time:new Date('2026-10-12T06:59:00Z')});await page.clock.pauseAt(new Date('2026-10-12T07:00:00Z'));
 const origin=process.env.FORM_TEST_URL||'http://localhost:3000';
 await page.goto(origin+'/#today?date=2026-10-12');await page.locator('[data-action="begin"]').click();
 await page.getByRole('button',{name:'Train',exact:true}).click();
 assert.equal(await page.locator('.session-clock').count(),0,'Browsing Train must not start the clock');
 await page.locator('[data-action="startsession"]').click();await page.waitForSelector('[data-coach-phase="warmup"]');
 assert.equal(await page.locator('[data-session-clock]').innerText(),'00:00:00');
 await page.clock.runFor(65500);assert.equal(await page.locator('[data-session-clock]').innerText(),'00:01:05');
 if(process.env.FORM_SESSION_SCREENSHOT)await page.screenshot({path:process.env.FORM_SESSION_SCREENSHOT,fullPage:false});
 await page.getByRole('button',{name:'Food',exact:true}).click();assert.equal(await page.locator('[data-session-clock]').innerText(),'00:01:05');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await page.waitForSelector('[data-session-clock]');assert.equal(await page.locator('[data-session-clock]').innerText(),'00:01:05');
 await page.locator('[data-action^="resumesession:"]').click();
 for(let i=0;i<5;i++){await page.locator('[data-action="warmnext"]').click();}
 await page.waitForSelector('[data-coach-phase="setup"]');
 // Log one real set and verify rest has its own clock while session time keeps running.
 const firstId=await page.locator('[data-action^="setupready:"]').getAttribute('data-action');
 await page.locator('[data-action="'+firstId+'"]').click();
 await page.locator('#coach-sets').selectOption('1');await page.locator('[data-form="set"] button[type="submit"]').click();
 await page.waitForSelector('[data-coach-phase="rest"]');assert.match(await page.locator('#timer').innerText(),/1:30/);
 await page.clock.runFor(90000);assert.equal(await page.locator('[data-session-clock]').innerText(),'00:02:35');await page.locator('[data-action="restnext"]').click();await page.waitForSelector('[data-coach-phase="setup"]');
 // Explicitly skip the remaining exercises using the supported workout flow.
 while(await page.locator('[data-coach-phase="setup"]').count()){
  const previous=await page.locator('[data-coach-phase="setup"]').getAttribute('id');
  await page.getByText('I can’t do this exercise',{exact:true}).click();
  await page.locator('[data-form="skipexercise"] select').selectOption({label:'Equipment unavailable'});
  await page.locator('[data-form="skipexercise"] button').click();
  await page.waitForFunction(id=>document.querySelector('[data-coach-phase="setup"]')?.id!==id,previous);
 }
 await page.waitForSelector('[data-coach-phase="cooldown"]');for(let i=0;i<2;i++)await page.locator('[data-action="coolnext"]').click();
 await page.waitForSelector('[data-coach-phase="review"]');await page.clock.runFor(5000);
 await page.locator('[data-action="complete"]').click();await page.waitForSelector('[data-coach-phase="complete"]');
 const duration=await page.locator('.session-clock strong').innerText();assert.equal(duration,'00:02:40');
 assert.equal(await page.locator('[data-session-clock]').count(),0);
 await page.clock.runFor(60000);assert.equal(await page.locator('.session-clock strong').innerText(),duration);
 await page.getByRole('button',{name:'Progress',exact:true}).click();assert.match(await page.locator('.session-history').innerText(),/00:02:40/);
 await page.reload();await page.waitForSelector('.session-history');assert.match(await page.locator('.session-history').innerText(),/00:02:40/);
 const records=await page.evaluate(async()=>{const {allRecords}=await import('./store.js?v=36');return allRecords();});
 const session=records.find(r=>r.type==='session'&&r.date==='2026-10-12').data;
 assert.equal(session.startedAt,'2026-10-12T07:00:00.000Z');assert.equal(session.endedAt,'2026-10-12T07:02:40.500Z');assert.equal(session.durationSeconds,160);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 // A separate guest journal verifies early stop saves timing instead of losing it.
 await context.setOffline(false);const stopped=await browser.newContext(),stopPage=await stopped.newPage();
 await stopPage.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));await stopPage.clock.install({time:new Date('2026-10-12T06:59:00Z')});await stopPage.clock.pauseAt(new Date('2026-10-12T07:00:00Z'));
 await stopPage.goto(origin);await stopPage.locator('[data-action="begin"]').click();await stopPage.locator('[data-action="startsession"]').click();
 await stopPage.clock.runFor(10000);await stopPage.locator('[data-action="skip"]').click();await stopPage.locator('[data-session-clock]').waitFor({state:'detached'});
 assert.equal(await stopPage.locator('.session-clock strong').innerText(),'00:00:10');assert.equal(await stopPage.locator('[data-session-clock]').count(),0);
 console.log('PASS: explicit start, navigation, offline reload, independent rest clock, completion/history, frozen duration and early stop.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
