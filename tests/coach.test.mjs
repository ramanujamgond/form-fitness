import {test} from 'node:test';
import assert from 'node:assert/strict';
import {coachState} from '../web/coach.js';
const date='2026-10-12';
const row=(type,data,id=crypto.randomUUID(),time='2026-10-12T10:00:00.000Z')=>({id,type,date,data,deleted:false,updatedAt:time});
const session=data=>row('session',{coachVersion:23,warmupDone:true,...data},'session');
const set=(id,time)=>row('set',{exercise:'press',reps:10,rir:3,form:'good',guided:true,restUntil:10000},id,time);
const state=(rows,now=5000)=>coachState(rows,date,['press'],'Foundation',now);
test('a fresh session shows one warm-up checklist and preserves saved warm-up completion',()=>{
 assert.deepEqual(state([]),{phase:'warmup',index:0});
 assert.deepEqual(state([row('session',{warmupDone:true})]),{phase:'set',id:'press'});
 assert.deepEqual(state([session({warmupDone:false,warmupIndex:2})]),{phase:'warmup',index:2});
});
test('the first exercise opens directly with teaching and logging together',()=>{
 assert.equal(state([session({})]).phase,'set');
 assert.equal(state([session({readyExercises:['press']})]).phase,'set');
});
test('the final set stays on rest before unlocking cooldown and completion review',()=>{
 const rows=[session({readyExercises:['press']}),set('first','2026-10-12T10:00:00.000Z'),set('second','2026-10-12T10:01:00.000Z')];
 assert.equal(state(rows).phase,'rest');assert.equal(state(rows).remaining,5);
 assert.equal(state(rows,10000).phase,'rest');assert.equal(state(rows,10000).remaining,0);
 rows[0].data.restAcknowledged='second';assert.equal(state(rows).phase,'cooldown');
 rows[0].data.cooldownIndex=2;assert.equal(state(rows).phase,'review');
 rows[0].data.status='complete';assert.equal(state(rows).phase,'complete');
});
test('symptoms on the final set stop the exercise instead of opening the next step',()=>{
 const rows=[session({}),set('first','2026-10-12T10:00:00.000Z'),set('second','2026-10-12T10:01:00.000Z')];
 rows[2].data.symptom=true;assert.equal(state(rows).phase,'stop');
 rows[0].data.skippedExercises=[{id:'press',reason:'Pain or tingling'}];assert.equal(state(rows).phase,'cooldown');
});
