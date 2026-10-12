const CACHE='form-v30';
const EQUIPMENT_PHOTOS=['press','pulldown','cablerow','legpress','curl','dumbbells','cable','bench','mat','treadmill','bike'].map(n=>`./img/equipment-photos/${n}.webp`);
const IMAGES=['assisted','press','row','pulldown','raise','pushup','legpress','squat','curl','bridge','calf','deadbug','walk','cablerow'].map(n=>`./img/generated/${n}.webp`).concat([0,1,2,3,4].map(n=>`./img/meals/${n}.webp`));
const ASSETS=[...['assisted','press','row','pulldown','raise','pushup','legpress','squat','curl','bridge','calf','deadbug','cablerow'].map(id=>`./img/coach/${id}-steps.webp`),'./drafts.js?v=30','./prescription.js?v=30','./indian-videos.js?v=30','./local-food.js?v=30','./coach.js?v=30','./coach-view.js?v=30',...['march','heel','knee','shoulder','bend','calf'].map(n=>`./img/coach/${n}.webp`),'./journey.js?v=30','./','./index.html','./style.css?v=30','./app.js?v=30','./content.js?v=30','./charts.js?v=30','./diagrams.js?v=30','./store.js','./store.js?v=30','./dates.js','./dates.js?v=30','./scheduling.js','./scheduling.js?v=30','./accounts.js?v=30','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./img/basics/rest.webp','./img/basics/load.webp',...EQUIPMENT_PHOTOS,...IMAGES];
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
