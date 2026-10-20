const CACHE='form-v38';
const EQUIPMENT_PHOTOS=['press','pulldown','cablerow','legpress','curl','dumbbells','cable','bench','mat','treadmill','bike'].map(n=>`./img/equipment-photos/${n}.webp`);
const IMAGES=['assisted','press','row','pulldown','raise','pushup','legpress','squat','curl','bridge','calf','deadbug','walk','cablerow'].map(n=>`./img/generated/${n}.webp`).concat([0,1,2,3,4].map(n=>`./img/meals/${n}.webp`));
const ASSETS=['./img/coach/biceps-steps.webp','./img/coach/triceps-steps.webp','./img/coach/row-standing-steps-v1.webp','./training.js?v=38','./session-time.js?v=38',...['assisted','press','row','pulldown','raise','pushup','legpress','squat','curl','bridge','calf','deadbug','cablerow'].map(id=>`./img/coach/${id}-steps.webp`),'./drafts.js?v=38','./prescription.js?v=38','./indian-videos.js?v=38','./local-food.js?v=38','./coach.js?v=38','./coach-view.js?v=38',...['march','heel','knee','shoulder','bend','calf'].map(n=>`./img/coach/${n}.webp`),'./journey.js?v=38','./','./index.html','./style.css?v=38','./app.js?v=38','./content.js?v=38','./charts.js?v=38','./diagrams.js?v=38','./store.js','./store.js?v=38','./dates.js','./dates.js?v=38','./scheduling.js','./scheduling.js?v=38','./accounts.js?v=38','./manifest.webmanifest','./form-brand-64.png','./form-favicon-32.png','./form-favicon.ico','./form-icon-192.png','./form-icon-512.png','./form-maskable-512.png','./form-apple-touch-180.png','./img/basics/rest.webp','./img/basics/load.webp',...EQUIPMENT_PHOTOS,...IMAGES];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS).then(()=>{if(['localhost','127.0.0.1','[::1]'].includes(self.location.hostname))return self.skipWaiting();})));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('form-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.hostname==='i.ytimg.com'&&event.request.destination==='image'){
  event.respondWith(caches.open(CACHE+'-references').then(async cache=>{
   const hit=await cache.match(event.request);if(hit)return hit;
   const response=await fetch(event.request);
   if(response.ok||response.type==='opaque'){
    await cache.put(event.request,response.clone());
    const keys=await cache.keys();while(keys.length>32)await cache.delete(keys.shift());
   }
   return response;
  }));return;
 }
 if(url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});

self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
