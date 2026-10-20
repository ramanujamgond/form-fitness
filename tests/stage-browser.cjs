const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:412,height:915},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));await page.clock.install({time:new Date('2026-10-12T07:00:00Z')});
 await page.goto(process.env.FORM_TEST_URL||'http://localhost:3000');await page.locator('[data-action="begin"]').click();
 await page.evaluate(async()=>{
  const store=await import('./store.js?v=41'),rows=[];
  for(let i=1;i<=6;i++){
   const date='2026-09-0'+i,make=(type,data)=>({...store.makeRecord(type,date,data),dirty:false});
   rows.push(make('session',{status:'complete',stage:'Foundation',exerciseIds:['press']}),make('checkin',{sleep:8,energy:'Good'}),...Array.from({length:2},()=>make('set',{exercise:'press',reps:12,weight:10,form:'good',rir:3})));
  }
  await store.putMany(rows);
 });
 await page.reload();await page.waitForSelector('.next-action');assert.equal(await page.locator('#easy-session').isChecked(),true);
 await page.locator('#easy-session').uncheck();await page.locator('[data-action="startsession"]').click();await page.waitForSelector('[data-coach-phase="warmup"]');
 await page.getByRole('button',{name:'Progress',exact:true}).click();await page.locator('[data-action="reviewstage"]').click();await page.waitForSelector('[data-form="stageconfirm"]');
 await page.locator('[data-form="stageconfirm"] [name="ready"]').check();await page.locator('[data-form="stageconfirm"] [name="reviewed"]').check();await page.locator('[data-form="stageconfirm"] button').click();await page.waitForSelector('dialog[open]',{state:'detached'});assert.equal(await page.locator('.stage-overview h2').innerText(),'Building');
 await page.reload();await page.waitForSelector('.stage-overview');assert.equal(await page.locator('.stage-overview h2').innerText(),'Building');
 const snapshot=await page.evaluate(async()=>{const {allRecords}=await import('./store.js?v=41');const rows=await allRecords();return {preferences:rows.find(r=>r.type==='preferences').data.profile,session:rows.find(r=>r.type==='session'&&r.date==='2026-10-12').data};});
 assert.equal(snapshot.preferences.stageHistory[0].stage,'Building');assert.equal(snapshot.session.stage,'Foundation');assert.equal(snapshot.session.setTargets.press,2);assert.equal(snapshot.session.easy,false);
 await page.getByRole('button',{name:'Train',exact:true}).click();await page.locator('[data-action="warmnext"]').click();await page.waitForSelector('.coach-log');assert.equal(await page.locator('[name="sets"]').inputValue(),'2');
 assert.deepEqual(errors,[]);console.log('PASS: break-aware easy option, explicit stage review/confirmation, saved preferences and preservation of an already-started workout.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
