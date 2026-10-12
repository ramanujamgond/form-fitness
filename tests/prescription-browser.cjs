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

 const f=page.locator('[data-form="set"]');
 assert.equal(await f.locator('input[type="number"]').count(),0);
 assert.equal(await f.locator('[name="reps"]').inputValue(),'10');
 assert.equal(await f.locator('[name="weight"]').inputValue(),'5');
 assert.equal(await f.locator('[name="sets"]').inputValue(),'2');
 await f.locator('[name="sets"]').selectOption('3');
 await f.locator('[name="reps"]').selectOption('8');
 await f.locator('[name="weight"]').selectOption('more');await f.locator('[name="weight"]').selectOption('2.5');
 assert.match(await page.locator('[data-set-plan]').innerText(),/3 sets × 8 reps/);await page.screenshot({path:'resources/previews/coach-suggested-plan-mobile.png',fullPage:true});
 await f.locator('button[type="submit"]').click();
 await page.waitForSelector('[data-coach-phase="rest"]');
 assert.match(await page.locator('.coach-step').innerText(),/8 reps · 2.5 kg saved. 1 of 3 sets recorded/);
 await page.reload();await page.waitForSelector('[data-coach-phase="rest"]');
 await page.clock.fastForward(91000);await page.waitForFunction(()=>!document.querySelector('[data-action="restnext"]')?.disabled);await page.locator('[data-action="restnext"]').click();
 await page.waitForSelector('[data-form="set"]');
 assert.match(await page.locator('.coach-step .eyebrow').innerText(),/Set 2 of 3/i);
 assert.equal(await page.locator('[name="reps"]').inputValue(),'8');
 assert.equal(await page.locator('[name="weight"]').inputValue(),'2.5');
 assert.equal(await page.locator('[name="rir"]').inputValue(),'');
 assert.equal(await page.locator('[name="form"]').inputValue(),'uncertain');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);
 console.log('Suggested choices, save without typing or feedback, chosen three-set plan and reload verified.');
 await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
