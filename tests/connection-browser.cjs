const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const page=await browser.newPage({serviceWorkers:'block'}),origin=process.env.FORM_TEST_URL||'http://localhost:3000';
  await page.addInitScript(()=>{Object.defineProperty(navigator,'onLine',{get:()=>false,configurable:true});localStorage.setItem('form-cloud-accounts','true');});
  let available=false,session=null,configCalls=0;
  await page.route('**/api/config',r=>{configCalls++;return available?r.fulfill({json:{configured:true,emailReady:true,googleReady:true}}):r.abort('internetdisconnected');});
  await page.route('**/api/account',r=>r.fulfill({json:session}));
  await page.route('**/api/journal',r=>r.fulfill({json:{records:[]}}));
  await page.route('**/api/auth/sign-out',r=>{session=null;return r.fulfill({json:{success:true}});});
  await page.goto(origin+'/');await page.waitForSelector('[data-action="checkcloud"]');
  available=true;
  await page.locator('[data-action="checkcloud"]').click();
  await page.waitForSelector('[data-action="googlelogin"]',{timeout:5000});
  assert.ok(configCalls>=2,'Check connection must retry the server even when the browser reports offline');
  assert.ok(!(await page.locator('#cloud-status').innerText()).includes('Offline'));
  session={user:{id:'retry-user',name:'Retry user',email:'retry@example.com'},canClaimLegacy:false};
  await page.reload();await page.waitForSelector('[data-action="begin"]');await page.locator('[data-action="begin"]').click();
  await page.getByRole('button',{name:'More',exact:true}).click();await page.waitForSelector('[data-action="signout"]');
  await page.locator('[data-action="signout"]').click();await page.waitForSelector('[data-action="googlelogin"]');
  assert.equal(await page.locator('[data-form="account"]').count(),1,'Logout must return to a usable login form');
  console.log('PASS: server retry overrides stale browser offline flag; logout restores Google and PIN login');
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
