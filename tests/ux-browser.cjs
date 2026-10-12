const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));
 const origin=process.env.FORM_TEST_URL||'http://localhost:3000';
 await page.clock.install({time:new Date('2026-10-12T07:00:00Z')});
 await page.goto(origin+'/#today?date=2026-10-12');await page.waitForSelector('#onboarding');
 assert.equal(await page.locator('#onboarding input,#onboarding select').count(),0);
 await page.locator('[data-action="begin"]').click();await page.waitForSelector('.next-action');await page.locator('.next-action button').click();
 await page.waitForSelector('[data-coach-phase="warmup"]');
 assert.match(await page.locator('h1').innerText(),/March gently/);assert.match(await page.locator('.coach-image').getAttribute('src'),/march.webp$/);assert.equal(await page.locator('a[href="https://www.youtube.com/watch?v=j1wFGag9zMo"]').count(),1);
 assert.equal(await page.locator('[data-form="set"]').count(),0);
 await page.locator('.coach-image').evaluate(img=>img.decode());
 await page.screenshot({path:'resources/previews/coach-warmup-mobile.png',fullPage:true});
 await page.locator('[data-action="warmnext"]').click();await page.waitForFunction(()=>document.querySelector('h1')?.textContent.includes('heel'));
 await page.reload();await page.waitForSelector('[data-coach-phase="warmup"]');assert.match(await page.locator('h1').innerText(),/heel/);
 for(let i=1;i<5;i++){await page.locator('.coach-image').evaluate(img=>img.decode());await page.locator('[data-action="warmnext"]').click();await page.waitForFunction(n=>document.querySelector('.coach-step .eyebrow')?.textContent.includes(`movement ${n+1}`)||!!document.querySelector('[data-coach-phase="setup"]'),i+1);}
 await page.waitForSelector('[data-coach-phase="setup"]');assert.match(await page.locator('h1').innerText(),/Machine chest press/);
 assert.equal(await page.locator('[data-form="set"]').count(),0);
 assert.equal(await page.locator('.coach-equipment img').count(),1);assert.equal(await page.locator('a[href="https://www.youtube.com/watch?v=_DaWuqOL8S8"]').count(),1);
 await page.locator('.coach-image').evaluate(img=>img.decode());await page.screenshot({path:'resources/previews/coach-setup-mobile.png',fullPage:true});
 await page.locator('[data-action^="setupready:"]').click();await page.waitForSelector('[data-coach-phase="set"]');
 const first=await page.locator('[data-form="set"]').getAttribute('data-exercise');


 let f=page.locator('[data-form="set"]');
 assert.ok(await f.locator('[name="reps"] option').count()<=5);
 assert.ok(await f.locator('[name="weight"] option').count()<=6);
 assert.match(await page.locator('.coach-image').getAttribute('src'),/press-steps.webp/);await page.locator('.skip-link').focus();await page.locator('.skip-link').press('Enter');assert.ok(page.url().includes('#train'));assert.equal(await page.evaluate(()=>document.activeElement.id),'main-content');
 const saveBox=await f.locator('button[type="submit"]').boundingBox(),navBox=await page.locator('nav').boundingBox();
 assert.ok(saveBox.y>0&&saveBox.y+saveBox.height<navBox.y,'Save action stays above navigation');
 await page.screenshot({path:'resources/previews/ux-workout-mobile.png'});
 await f.locator('[name="sets"]').selectOption('3');await f.locator('[name="reps"]').selectOption('8');await f.locator('[name="weight"]').selectOption('more');await f.locator('[name="weight"]').selectOption('2.5');
 await f.getByText('Add a note (optional)',{exact:true}).click();await f.locator('[name="note"]').fill('Seat 3');await f.locator('[name="feeling"][value="controlled"]').check();
 await page.locator('nav [data-action="today"]').click();
 assert.equal(await page.locator('main [data-action="train"]').count(),1);
 assert.match(await page.locator('.next-action button').innerText(),/Continue Machine chest press/);
 await page.locator('.hero-img').evaluate(img=>img.decode());await page.screenshot({path:'resources/previews/ux-today-mobile.png'});
 await page.locator('nav [data-action="progress"]').click();
 assert.equal(await page.locator('.empty-chart').count(),0);assert.match(await page.locator('main').innerText(),/Your first milestone/);
 await page.screenshot({path:'resources/previews/ux-progress-mobile.png'});
 await page.locator('nav [data-action="train"]').click();await page.waitForSelector('.coach-log');
 await page.reload();await page.waitForSelector('.coach-log');f=page.locator('.coach-log');
 assert.equal(await f.locator('[name="sets"]').inputValue(),'3');assert.equal(await f.locator('[name="reps"]').inputValue(),'8');assert.equal(await f.locator('[name="weight"]').inputValue(),'2.5');assert.equal(await f.locator('[name="note"]').inputValue(),'Seat 3');assert.equal(await f.locator('[name="form"]').inputValue(),'good');assert.equal(await f.locator('[name="rir"]').inputValue(),'3');
 await f.locator('[name="weight"]').selectOption('more');assert.equal(await f.locator('[name="weight"]').inputValue(),'2.5');
 await f.locator('button[type="submit"]').click();await page.waitForSelector('[data-coach-phase="rest"]');assert.match(await page.locator('.coach-step').innerText(),/8 reps · 2.5 kg saved. 1 of 3 sets recorded/);
 await page.clock.fastForward(91000);await page.waitForFunction(()=>!document.querySelector('[data-action="restnext"]')?.disabled);await page.locator('[data-action="restnext"]').click();await page.waitForSelector('.coach-log');
 assert.equal(await page.locator('[name="note"]').inputValue(),'');assert.equal(await page.locator('[name="form"]').inputValue(),'uncertain');
 await page.locator('nav [data-action="food"]').click();await page.waitForSelector('.meal-timeline');assert.equal(await page.locator('[data-form="dietary"]').count(),0);assert.match(await page.locator('main').innerText(),/vegetarian examples/);
 await page.locator('[data-meal-diet][value="any"]').check();await page.waitForFunction(()=>document.querySelector('.meal-timeline').textContent.includes('machha jhola'));
 await page.screenshot({path:'resources/previews/ux-food-mobile.png'});
 await page.locator('[data-action="dietary"]').click();await page.locator('[data-form="dietary"] [name="avoid"]').fill('eggs, fish');await page.locator('[data-form="dietary"] button').click();await page.waitForSelector('dialog[open]',{state:'detached'});
 assert.doesNotMatch(await page.locator('.meal-timeline').innerText(),/machha jhola|2 boiled eggs/);
 await page.locator('nav [data-action="settings"]').click();await page.screenshot({path:'resources/previews/ux-more-mobile.png'});
 assert.equal(await page.locator('[data-form="profile"]').isVisible(),false);
 await page.locator('nav [data-action="train"]').click();await page.waitForSelector('.coach-log');
 await page.setViewportSize({width:320,height:740});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.setViewportSize({width:1280,height:850});await page.screenshot({path:'resources/previews/ux-workout-desktop.png'});
 assert.deepEqual(errors,[]);await context.close();
 console.log('PASS: compact choices, reachable save, draft navigation/reload, feedback, home hierarchy, beginner progress, immediate local food and dietary filters, grouped settings, mobile and desktop.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
