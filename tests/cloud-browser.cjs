// Run only with scripts/dev.mjs pointed at an isolated PostgreSQL test database.
const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage();
  const origin=process.env.FORM_TEST_URL||'http://localhost:3000';
  const password='Local-test-password-123!';
  const email=process.env.FORM_TEST_EMAIL||'owner@example.com';
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/#settings');
  await page.waitForSelector('[data-form="login"]');
  const anonymous=await context.request.get(origin+'/api/journal');assert.equal(anonymous.status(),401);
  const wrong=await context.request.post(origin+'/api/auth/sign-up/email',{headers:{Origin:origin},data:{email:'other@example.com',password,name:'Other'}});
  assert.equal(wrong.status(),403);
  // A row from the previous provider must upload even though dirty was false.
  await page.evaluate(async()=>{
   const store=await import('./store.js');await store.openDB();
   await store.putMany([{id:'legacy-record',type:'food',date:'2026-10-10',data:{name:'Test',protein:20,kcal:200},updatedAt:'2026-10-10T10:00:00Z',deleted:false,dirty:false}]);
  });
  await page.reload();await page.waitForSelector('[data-form="login"]');
  await page.locator('[name="email"]').fill(email);await page.locator('[name="password"]').fill(password);
  await page.locator('[name="mode"]').selectOption('signup');await page.locator('[data-form="login"] button').click();
  await page.waitForSelector('[data-action="signout"]');
  await page.waitForFunction(()=>document.querySelector('#cloud-status')?.textContent.startsWith('Synced'));
  const data=await context.request.get(origin+'/api/journal');assert.equal(data.status(),200);
  assert.equal((await data.json()).records.find(r=>r.id==='legacy-record').dirty,false);
  const cookies=await context.cookies();assert.ok(cookies.some(c=>c.httpOnly&&c.name.includes('session')));
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('form-auth')),null);
  await page.reload();await page.waitForSelector('[data-action="signout"]');
  // Vercel rewrite exercises the same auth adapter with a query route.
  const rewritten=await context.request.get(origin+'/api/auth/get-session?route=get-session');assert.equal(rewritten.status(),200);
  assert.equal((await rewritten.json()).user.email,email);
  const stale=await context.request.post(origin+'/api/journal',{headers:{Origin:origin},data:[{id:'legacy-record',type:'food',date:'2026-10-10',data:{name:'Older'},updatedAt:'2026-10-09T10:00:00.000Z',deleted:false}]});
  assert.equal(stale.status(),200);assert.equal((await stale.json()).records[0].data.name,'Test');
  await page.locator('[data-action="signout"]').click();await page.waitForSelector('[data-form="login"]');
  assert.equal((await context.request.get(origin+'/api/journal')).status(),401);
  await context.setOffline(true);await page.reload();await page.waitForSelector('[data-form="profile"]');
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('Cloud browser passed: owner restriction, signup, legacy migration, cookie session, reload, rewrite, stale conflict, signout and offline settings.');
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
