const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));
 const origin=process.env.FORM_TEST_URL||'http://localhost:3000';
 await page.goto(origin+'/#learn?section=basics');
 await page.waitForSelector('.basic-media');
 assert.equal(await page.locator('.basic-media').count(),13);
 assert.equal(await page.locator('svg.basic-visual').count(),0);
 for(const image of await page.locator('.basic-media img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());}
 await page.locator('nav [data-action="train"]').click();
 await page.locator('#extra-exercise').selectOption('squat');
 await page.locator('#extra-runner [data-action="term:rep"]').click();
 await page.waitForSelector('dialog[open] .basic-media img');
 assert.equal(await page.locator('dialog[open] svg').count(),0);
 await page.locator('dialog[open] img').evaluate(img=>img.decode());
 assert.equal(await page.locator('dialog[open] [data-action^="play:ex."]').count(),1);
 await page.screenshot({path:'/private/tmp/form-rep-photo-mobile.png'});
 await page.locator('dialog[open] [method="dialog"] button').click();
 await page.locator('nav [data-action="learn"]').click();
 await page.locator('[data-action="learn:equipment"]').click();
 for(const img of await page.locator('.tool-img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(img=>img.decode());assert.ok(!(await img.getAttribute('src')).includes('/img/equipment/'));}
 await page.locator('nav [data-action="food"]').click();
 for(const img of await page.locator('.meal-img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(img=>img.decode());assert.ok((await img.getAttribute('src')).endsWith('.webp'));}
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.goto(origin+'/#learn?section=basics');await page.waitForSelector('.basic-media');
 for(const image of await page.locator('.basic-media img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);
 console.log('PASS: all 13 training terms, Rep popup, equipment photos, meal photos, and offline teaching images on mobile.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
