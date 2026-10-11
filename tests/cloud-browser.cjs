// Only run against tests/cloud-server.mjs and its isolated localhost database.
const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const {Pool}=require('pg');
(async()=>{
 const origin='http://localhost:3002',pin='012345',newPin='987654';
 const pool=new Pool({connectionString:'postgresql://string1301@127.0.0.1:55432/postgres'});
 // Reset only this hard-coded disposable database, then seed a legacy password account.
 await pool.query('TRUNCATE form_journal, form_pin_attempts, "rateLimit", session, account, verification, "user" CASCADE');
 const {hashPassword}=await import('better-auth/crypto');const legacyHash=await hashPassword('Local-test-password-123!');
 await pool.query('INSERT INTO "user" (id,name,email,"emailVerified","createdAt","updatedAt") VALUES ($1,$2,$3,false,now(),now())',['test-owner','Original owner','owner@example.com']);
 await pool.query('INSERT INTO account (id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,now(),now())',['test-owner-account','test-owner','credential','test-owner',legacyHash]);
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const request=context.request;
  let mailFloor=(await(await request.get(origin+'/_test/mail')).json()).length;
  const mail=async(email,subject)=>{for(let i=0;i<100;i++){const rows=await(await request.get(origin+'/_test/mail')).json(),found=rows.slice(mailFloor).filter(x=>x.to[0]===email&&x.subject.includes(subject)).at(-1);if(found){mailFloor=rows.length;return found.text.match(/http[^\s]+/)[0];}await new Promise(resolve=>setTimeout(resolve,100));}throw Error('Expected simulated email was not received');};
  const post=async(path,data,extra={})=>request.post(origin+path,{headers:{Origin:origin,...extra},data});
  const signIn=async(email,value)=>{await page.locator('[data-action="authmode:signin"]').first().click();await page.locator('[data-form="account"] [name="email"]').fill(email);await page.locator('[data-form="account"] [name="pin"]').fill(value);await page.locator('[data-form="account"] button').click();await page.waitForSelector('[data-action="signout"]',{timeout:10000}).catch(async()=>{throw Error('Sign-in screen: '+await page.locator('body').innerText());});};
  await page.goto(origin+'/#settings');await page.waitForSelector('[data-form="account"]');
  await page.evaluate(async()=>{const store=await import('./store.js');await store.openDB('legacy');await store.putMany([{id:'legacy-private',type:'food',date:'2026-10-10',data:{name:'Original private meal',protein:20,kcal:200},updatedAt:'2026-10-10T10:00:00Z',deleted:false,dirty:false}]);await store.openDB('guest');localStorage.setItem('form-profile',JSON.stringify({weight:75,height:173,protein:120,stage:'Foundation'}));});
  await page.locator('[data-action="authmode:signup"]').click();
  const form=page.locator('[data-form="account"]');await form.locator('[name="name"]').fill('Sister');await form.locator('[name="email"]').fill('sister@example.com');await form.locator('[name="pin"]').fill(pin);await form.locator('[name="confirm"]').fill(pin);await form.locator('button').click();await page.waitForSelector('[data-form="resendverification"]');
  assert.equal((await request.get(origin+'/api/journal')).status(),401);
  assert.equal((await post('/api/auth/send-verification-email',{email:'sister@example.com',callbackURL:origin+'/?verified=1#settings'})).status(),429);
  const unverified=await post('/api/auth/sign-in/email',{email:'sister@example.com',password:pin,callbackURL:origin+'/?verified=1#settings'});assert.equal(unverified.status(),403);
  await page.goto(await mail('sister@example.com','Verify'));await page.waitForSelector('[data-form="account"]');assert.equal(new URL(page.url()).search,'');
  await signIn('sister@example.com',pin);await page.waitForSelector('#onboarding');assert.equal(await page.locator('#onboarding [name="weight"]').inputValue(),'');assert.equal(await page.locator('#onboarding [name="experience"]').inputValue(),'New to the gym');
  await page.locator('[data-action="skiponboarding"]').click();await page.waitForFunction(()=>document.querySelector('#cloud-status')?.textContent.startsWith('Synced'));
  let records=(await(await request.get(origin+'/api/journal')).json()).records;assert.ok(!records.some(r=>r.id==='legacy-private'));
  const account=(await(await request.get(origin+'/api/account')).json()).user;
  const food={id:'sister-only',type:'food',date:'2026-10-11',data:{name:'Sister meal'},updatedAt:new Date().toISOString(),deleted:false,user_id:'spoof-owner'};
  assert.equal((await post('/api/journal',[food])).status(),200);
  assert.equal((await post('/api/journal',[food],{'X-Form-Account':'wrong-account'})).status(),409);
  const device2=await browser.newContext({viewport:{width:412,height:915}});const second=await device2.newPage();await second.goto(origin+'/#settings');await second.waitForSelector('[data-form="account"]');await second.locator('[name="email"]').fill('sister@example.com');await second.locator('[name="pin"]').fill(pin);await second.locator('[data-form="account"] button').click();await second.waitForSelector('[data-action="signout"]');await second.waitForFunction(()=>document.querySelector('#cloud-status')?.textContent.startsWith('Synced'));assert.equal(await second.locator('#onboarding').count(),0);
  const hashes=await pool.query('SELECT password FROM account WHERE "userId"=$1',[account.id]);assert.notEqual(hashes.rows[0].password,pin);assert.ok(hashes.rows[0].password.length>64);
  await page.locator('[data-action="signout"]').click();await page.waitForSelector('[data-form="account"]');assert.equal((await request.get(origin+'/api/journal')).status(),401);assert.equal(await page.evaluate(()=>localStorage.getItem('form-local-scope')),'guest');
  // The original password account moves to PIN using the normal recovery email.
  await post('/api/auth/request-password-reset',{email:'owner@example.com',redirectTo:origin+'/?flow=reset#settings'});await page.goto(await mail('owner@example.com','Reset'));await page.waitForSelector('[data-form="resetpin"]');await page.locator('[data-form="resetpin"] [name="pin"]').fill('123456');await page.locator('[data-form="resetpin"] [name="confirm"]').fill('123456');await page.locator('[data-form="resetpin"] button').click();await page.waitForSelector('[data-form="account"]');
  await post('/api/auth/send-verification-email',{email:'owner@example.com',callbackURL:origin+'/?verified=1#settings'});await page.goto(await mail('owner@example.com','Verify'));await page.waitForSelector('[data-form="account"]');await signIn('owner@example.com','123456');await page.waitForSelector('#onboarding');assert.equal(await page.locator('#onboarding [name="weight"]').inputValue(),'75');await page.locator('[data-action="skiponboarding"]').click();await page.waitForFunction(()=>document.querySelector('#cloud-status')?.textContent.startsWith('Synced'));
  records=(await(await request.get(origin+'/api/journal')).json()).records;assert.ok(records.some(r=>r.id==='legacy-private'));assert.ok(!records.some(r=>r.id==='sister-only'));
  const reset=await post('/api/auth/request-password-reset',{email:'sister@example.com',redirectTo:origin+'/?flow=reset#settings'});assert.equal(reset.status(),200);const resetLink=await mail('sister@example.com','Reset');const token=new URL(resetLink).pathname.split('/').at(-1);
  // Process the link in a fresh browser, without disturbing the owner's session.
  const resetContext=await browser.newContext(),resetPage=await resetContext.newPage();await resetPage.goto(resetLink);await resetPage.waitForSelector('[data-form="resetpin"]');assert.equal(new URL(resetPage.url()).search,'');await resetPage.locator('[name="pin"]').fill(newPin);await resetPage.locator('[name="confirm"]').fill(newPin);await resetPage.locator('[data-form="resetpin"] button').click();await resetPage.waitForSelector('[data-form="account"]');
  assert.equal((await device2.request.get(origin+'/api/journal')).status(),401);assert.equal((await request.get(origin+'/api/journal')).status(),200);
  assert.equal((await resetContext.request.post(origin+'/api/auth/reset-password',{headers:{Origin:origin},data:{newPassword:'654321',token}})).status(),400);
  assert.equal((await post('/api/auth/request-password-reset',{email:'sister@example.com',redirectTo:origin+'/?flow=reset#settings'})).status(),429);await pool.query("UPDATE form_pin_attempts SET started_at=now()-interval '61 seconds' WHERE key LIKE 'mail:%'");
  await post('/api/auth/request-password-reset',{email:'sister@example.com',redirectTo:origin+'/?flow=reset#settings'});const expiredToken=new URL(await mail('sister@example.com','Reset')).pathname.split('/').at(-1);await pool.query(`UPDATE verification SET "expiresAt"=now()-interval '1 minute' WHERE identifier=$1`,['reset-password:'+expiredToken]);assert.equal((await resetContext.request.post(origin+'/api/auth/reset-password',{headers:{Origin:origin},data:{newPassword:'654321',token:expiredToken}})).status(),400);
  for(let i=0;i<5;i++){const r=await resetContext.request.post(origin+'/api/auth/sign-in/email',{headers:{Origin:origin},data:{email:'sister@example.com',password:'111111'}});assert.equal(r.status(),401);}
  const locked=await resetContext.request.post(origin+'/api/auth/sign-in/email',{headers:{Origin:origin},data:{email:'sister@example.com',password:newPin}});assert.equal(locked.status(),429);
  await navigatorReady(page);await context.setOffline(true);await page.reload();await page.waitForSelector('[data-form="profile"]');assert.equal(await page.locator('[data-action="signout"]').count(),1);await page.locator('[data-action="signout"]').click();await page.waitForFunction(()=>localStorage.getItem('form-local-scope')==='guest');assert.equal(await page.locator('[data-form="profile"] [name="weight"]').inputValue(),'');
  assert.deepEqual(errors,[]);console.log('PASS: two accounts, email verification, PIN hashing, beginner onboarding, original-journal isolation, cross-device preferences, account switching, reset-token reuse/expiry, email cooldowns, session revocation, account lockout, and offline sign-out.');
 }finally{await browser.close();await pool.end();}
})().catch(err=>{console.error(err);process.exitCode=1;});
async function navigatorReady(page){await page.evaluate(()=>navigator.serviceWorker.ready);}
