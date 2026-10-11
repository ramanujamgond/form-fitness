const CACHE='form-v20';
const IMAGES=['assisted','bench','bike','cable','cablerow','calfstep','curl','dumbbells','legpress','mat','press','pulldown','row','treadmill'].map(n=>`./img/equipment/${n}.jpg`).concat(['upper','lower','cardio','recovery'].map(n=>`./img/scenes/${n}.jpg`),['assisted','press','row','pulldown','raise','pushup','legpress','squat','curl','bridge','calf','deadbug','walk','cablerow'].map(n=>`./img/generated/${n}.webp`),[0,1,2,3,4].map(n=>`./img/meals/${n}.jpg`));
const ASSETS=['./','./index.html','./style.css?v=20','./app.js?v=20','./content.js?v=20','./charts.js?v=20','./diagrams.js?v=20','./store.js','./dates.js','./scheduling.js','./scheduling.js?v=20','./accounts.js?v=20','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',...IMAGES];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
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
