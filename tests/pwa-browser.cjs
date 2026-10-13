const {chromium}=require('/Users/string1301/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const context=await browser.newContext({viewport:{width:412,height:915}}),page=await context.newPage();
 await page.route('**/api/config',r=>r.fulfill({json:{configured:false,emailReady:false}}));
 const origin=process.env.FORM_TEST_URL||'http://localhost:3000';
 await page.goto(origin+'/#settings');
 await page.waitForSelector('[data-action="begin"]');await page.locator('[data-action="begin"]').click();
 await page.getByRole('button',{name:'More',exact:true}).click();
 assert.equal(await page.locator('[data-action="install"]').isVisible(),true,'Install must be visible without expanding backup settings');
 await page.locator('[data-action="install"]').click();
 assert.match(await page.locator('dialog').innerText(),/Safari/);
 assert.match(await page.locator('dialog').innerText(),/Edit Actions/);
 await page.evaluate(()=>document.querySelector('dialog').close());
 await page.evaluate(()=>{
  const event=new Event('beforeinstallprompt',{cancelable:true});
  event.prompt=async()=>{window.installCalls=(window.installCalls||0)+1;};
  event.userChoice=Promise.resolve({outcome:'dismissed'});window.dispatchEvent(event);
 });
 assert.equal(await page.locator('[data-action="install"]').innerText(),'Install Stride');
 await page.locator('[data-action="install"]').click();
 assert.equal(await page.evaluate(()=>window.installCalls),1);
 assert.equal(await page.locator('[data-action="install"]').innerText(),'How to install');
 const manifest=await (await context.request.get(origin+'/manifest.webmanifest')).json();
 assert.equal(manifest.display,'standalone');
 assert.equal(manifest.name,'Stride Training Journal');assert.equal(manifest.short_name,'Stride');
 assert.match(await page.title(),/Stride/);assert.match(await page.locator('.brand').innerText(),/STRIDE/);
 for(const icon of manifest.icons){const response=await context.request.get(origin+'/'+icon.src);assert.equal(response.ok(),true);assert.match(response.headers()['content-type'],/image\/png/);const bytes=await response.body();assert.equal(bytes.readUInt32BE(16),Number(icon.sizes.split('x')[0]));assert.equal(bytes.readUInt32BE(20),Number(icon.sizes.split('x')[1]));}
 assert.equal(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'),'./form-apple-touch-180.png');
 assert.equal(manifest.icons.some(icon=>icon.purpose==='maskable'),true);
 await page.locator('.brand img').evaluate(img=>img.decode());
 await page.setViewportSize({width:320,height:740});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Brand header must fit a narrow phone');
 await page.setViewportSize({width:412,height:915});
 if(process.env.FORM_PWA_SCREENSHOT)await page.screenshot({path:process.env.FORM_PWA_SCREENSHOT,fullPage:false});
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await page.waitForSelector('#app-install');
 assert.equal(await page.locator('[data-action="install"]').isVisible(),true);
 await page.evaluate(()=>window.dispatchEvent(new Event('appinstalled')));
 assert.match(await page.locator('#app-install').innerText(),/installed app/);
 assert.equal(await page.locator('[data-action="install"]').count(),0);
 console.log('PWA checks passed: visible install, device guidance, prompt consumption, installed state, manifest/icons and offline reload.');
 await browser.close();
 }catch(error){await browser.close();throw error;}
})().catch(error=>{console.error(error);process.exit(1);});
