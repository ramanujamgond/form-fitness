import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exercises,tools} from '../web/content.js';
import {warmupVideo,cooldown} from '../web/coach.js';
test('all active exercise and equipment videos use the selected Indian fitness channels',()=>{
 const channels=['Himalayan Stallion Academy','Jeet Selal Aesthetics','Yatinder Singh','Cult Fit','cultstore','Nirbhay Pandey','Jerai Fitness'];
 for(const item of [...Object.values(exercises),...Object.values(tools)]){
  assert.match(item.youtube,/^[A-Za-z0-9_-]{11}$/);
  assert.ok(channels.some(c=>item.videoLabel.endsWith(' · '+c)),item.videoLabel);
 }
 assert.match(warmupVideo,/youtube-nocookie.com\/embed\/j1wFGag9zMo/);
 assert.match(cooldown[1].video,/youtube.com\/watch\?v=08F12TvgTd4/);
});
test('warm-up teaching media are raster WebP files and no line-art coach asset is referenced',()=>{
 for(const id of ['march','heel','knee','shoulder','bend','calf']){
  const bytes=readFileSync(new URL(`../web/img/coach/${id}.webp`,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 }
 const view=readFileSync(new URL('../web/coach-view.js',import.meta.url),'utf8');
 const worker=readFileSync(new URL('../web/sw.js',import.meta.url),'utf8');
 assert.doesNotMatch(view,/img\/coach\/[^'"`\n]*\.svg/);assert.doesNotMatch(worker,/img\/coach\/[^'"`\n]*\.svg/);
});

test('seated curl and assisted-machine illustrations have matching machine references plus trainer alternatives',()=>{
 assert.equal(exercises.curl.youtube,'-FcgBTLmb-w');
 assert.equal(exercises.assisted.youtube,'66v4VI4osYU');
 assert.equal(exercises.curl.additionalVideos[0].youtube,'RmGoSqUda5I');
 assert.equal(exercises.assisted.additionalVideos[0].youtube,'rWCY5k5rt_c');
 assert.match(exercises.squat.videoNote,/without a bench/);
});

test('all strength movements use offline raster start/end photos',()=>{
 for(const [id,e] of Object.entries(exercises)){
  if(id==='walk')continue;
  assert.equal(e.img,`./img/coach/${id}-steps.webp`);
  const bytes=readFileSync(new URL(`../web/img/coach/${id}-steps.webp`,import.meta.url));
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
 }
});
