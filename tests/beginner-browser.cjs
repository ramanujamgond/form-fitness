const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const origin=process.env.FORM_TEST_URL||'http://localhost:3000';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));
 await page.clock.install({time:new Date('2026-10-12T07:00:00Z')});
 await page.goto(origin);await page.locator('[data-action="begin"]').click();await page.waitForSelector('.workout-outline');
 assert.equal(await page.locator('.next-action button').count(),1);assert.match(await page.locator('.workout-outline').innerText(),/Single-arm dumbbell curl/);
 await page.screenshot({path:'/private/tmp/stride-today.png'});
 await page.locator('#easy-session').uncheck();await page.locator('[data-action="startsession"]').click();await page.waitForSelector('[data-coach-phase="warmup"]');
 assert.equal(await page.locator('.movement-item').count(),5);
 await page.locator('.movement-item summary').first().click();await page.locator('.movement-item img').first().evaluate(i=>i.decode());
 assert.equal(await page.locator('.movement-item a[href*="j1wFGag9zMo"]').count(),5);
 await page.locator('[data-action="warmnext"]').click();await page.waitForSelector('.coach-log');
 assert.equal(await page.locator('[data-coach-phase="setup"]').count(),0);
 assert.equal(await page.locator('.exercise-teaching>.coach-instructions li').count(),3);
 assert.equal(await page.locator('.detailed-guide').getAttribute('open'),null);
 await page.locator('.detailed-guide summary').click();assert.match(await page.locator('.detailed-guide').innerText(),/Breathing/);await page.locator('.detailed-guide summary').click();
 // Intercept the player only: verify the real selected reference URL without contacting YouTube.
 await page.route('https://www.youtube-nocookie.com/**',r=>r.fulfill({contentType:'text/html',body:'<p>Reference video player</p>'}));
 await page.locator('[data-action="play:ex.press"]').click();assert.match(await page.locator('.frame iframe').getAttribute('src'),/_DaWuqOL8S8/);
 await page.locator('.set-adjustments summary').click();await page.locator('#coach-sets').selectOption('1');await page.locator('#coach-reps').selectOption('8');await page.locator('#coach-weight').selectOption('more');await page.locator('#coach-weight').selectOption('2.5');await page.locator('[name="note"]').fill('Seat 3');await page.locator('[name="feeling"][value="controlled"]').check();
 await page.getByRole('button',{name:'Food',exact:true}).click();await page.getByRole('button',{name:'Train',exact:true}).click();await page.reload();await page.waitForSelector('.coach-log');
 assert.equal(await page.locator('#coach-reps').inputValue(),'8');assert.equal(await page.locator('#coach-weight').inputValue(),'2.5');assert.equal(await page.locator('[name="note"]').inputValue(),'Seat 3');assert.equal(await page.locator('[name="form"]').inputValue(),'good');
 const saveBox=await page.locator('.coach-primary button').boundingBox(),navBox=await page.locator('nav').boundingBox();assert.ok(saveBox.y+saveBox.height<navBox.y);
 await page.screenshot({path:'/private/tmp/stride-exercise.png'});
 await page.locator('.coach-log button[type="submit"]').click();await page.waitForSelector('[data-coach-phase="rest"]');assert.match(await page.locator('.inline-rest').innerText(),/8 reps · 2.5 kg saved/);assert.equal(await page.locator('.exercise-teaching').count(),1);assert.equal(await page.locator('[data-action="restnext"]').isDisabled(),true);
 await page.reload();await page.waitForSelector('.inline-rest');await page.clock.fastForward(91000);await page.locator('[data-action="restnext"]').click();await page.waitForSelector('#exercise-train-row');
 // Substitution stays in the current slot; no separate setup screen.
 await page.getByText('Station busy or need another movement?',{exact:true}).click();await page.locator('[data-action="substitute:cablerow"]').click();await page.waitForSelector('#exercise-train-cablerow');
 await page.locator('.set-adjustments summary').click();await page.locator('#coach-sets').selectOption('1');await page.locator('[name="symptom"]').check();await page.locator('.coach-log button[type="submit"]').click();await page.waitForSelector('[data-coach-phase="stop"]');assert.equal(await page.locator('.coach-log').count(),0);
 await page.locator('[data-action="symptomstop"]').click();await page.waitForSelector('.coach-log');
 // Skip remaining movements explicitly, then finish from the one cooldown checklist.
 while(await page.locator('.coach-log').count()){
  const id=await page.locator('.coach-log').getAttribute('data-exercise');
  await page.getByText('I can’t do this exercise',{exact:true}).click();await page.locator('[data-form="skipexercise"] select').selectOption({label:'Equipment unavailable'});await page.locator('[data-form="skipexercise"] button').click();
  await page.waitForFunction(id=>document.querySelector('.coach-log')?.dataset.exercise!==id,id);
 }
 await page.waitForSelector('[data-coach-phase="cooldown"]');assert.equal(await page.locator('.movement-item').count(),2);await page.locator('[data-action="finishworkout"]').click();await page.waitForSelector('[data-coach-phase="complete"]');assert.equal(await page.locator('[data-session-clock]').count(),0);
 await page.locator('[data-action="progress"]').first().click();await page.waitForSelector('.session-history');assert.match(await page.locator('.stage-overview h2').innerText(),/Beginner/);
 // Reload from the installed worker offline and verify durable records and every guide image.
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForSelector('.session-history');
 await page.goto(origin+'/#train?date=2026-10-12');await page.waitForSelector('[data-coach-phase="complete"]');await page.getByText('Review saved sets and skips',{exact:true}).click();await page.locator('[data-action^="undoexercise:"]').first().click();await page.waitForSelector('[data-coach-phase="stop"]');
 const records=await page.evaluate(async()=>{const store=await import('./store.js?v=41');return store.allRecords();});const session=records.find(r=>r.type==='session');assert.equal(session.data.status,'in_progress');assert.equal(session.data.setTargets.press,1);assert.ok(session.data.exerciseIds.includes('cablerow'));assert.ok(session.data.endedAt);
 await page.goto(origin+'/#learn?section=exercises');await page.waitForSelector('.exercise');assert.equal(await page.locator('.exercise').count(),16);
 for(const detail of await page.locator('.exercise>details').all())await detail.evaluate(d=>d.open=true);
 for(const img of await page.locator('.ex-hero').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}assert.equal(await page.locator('a[href="https://www.fittr.com/exercise-video/cable-pushdown-with-v-bar-123/"]').count()>0,true);
 await page.setViewportSize({width:320,height:740});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);await context.close();
 console.log('PASS: one warm-up checklist, combined teaching/logging, reference player URLs, drafts, inline rest, substitution, symptom stop, single cooldown/save, history/undo and offline tutorials.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
