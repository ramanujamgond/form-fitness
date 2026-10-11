import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weeklyPlan,dayPlan,setFrequency,frequencyOn,validBreak} from '../web/scheduling.js';
import {defaultProfile,preferencesFrom} from '../web/accounts.js';
import {validateRecords} from '../web/store.js';
const record=(type,date,data,extra={})=>({id:'record-1',type,date,data,updatedAt:'2026-10-11T10:00:00.000Z',deleted:false,...extra});
test('every frequency has the chosen number of activity days, capped at four strength days',()=>{
 for(let n=1;n<=7;n++){const plans=weeklyPlan(n);assert.equal(plans.filter(p=>p.kind!=='Recovery').length,n);assert.ok(plans.filter(p=>p.kind==='Strength').length<=4);for(let i=0;i<7;i++){const p=plans[i],next=plans[(i+1)%7];if(p.kind==='Strength'&&next.kind==='Strength'){assert.ok(!p.ids.includes('press')||!next.ids.includes('press'));assert.ok(!p.ids.includes('deadbug')||!next.ids.includes('deadbug'));}}}
 assert.equal(weeklyPlan(7)[0].name,'Active recovery');assert.equal(weeklyPlan(6)[0].kind,'Recovery');
});
test('frequency changes begin on their effective date and preserve previous plans',()=>{
 let p=setFrequency(defaultProfile(),3,'2026-10-11');p=setFrequency(p,7,'2026-11-01');assert.equal(frequencyOn(p,'2026-10-10'),5);assert.equal(frequencyOn(p,'2026-10-12'),3);assert.equal(frequencyOn(p,'2026-11-01'),7);assert.equal(dayPlan(p,[],'2026-10-13').kind,'Recovery');assert.equal(dayPlan(p,[],'2026-10-06').kind,'Strength');
 const synced=preferencesFrom([record('preferences','2026-10-11',{profile:p,equipment:{}})]).profile;assert.equal(synced.workoutDays,7);assert.deepEqual(synced.planHistory,p.planHistory);
});
test('date-range breaks include both endpoints and resume the regular schedule without backlog',()=>{
 const p=defaultProfile(),rows=[record('break','2026-10-12',{endDate:'2026-10-16',reason:'Travel'})];for(const date of ['2026-10-12','2026-10-13','2026-10-16']){const plan=dayPlan(p,rows,date);assert.ok(plan.skipped);assert.deepEqual(plan.ids,[]);assert.equal(plan.reason,'Travel');}assert.equal(dayPlan(p,rows,'2026-10-19').name,'Upper A');assert.equal(dayPlan(p,[{...rows[0],deleted:true}],'2026-10-12').name,'Upper A');
});
test('completed sessions and daily overrides survive breaks; cancelling a skip restores the plan',()=>{
 const p=defaultProfile(),pause=record('break','2026-10-12',{endDate:'2026-10-14',reason:'Meetings'});assert.equal(dayPlan(p,[pause,record('session','2026-10-12',{status:'complete'})],'2026-10-12').name,'Upper A');assert.ok(dayPlan(p,[record('session','2026-10-12',{status:'skipped'})],'2026-10-12').skipped);assert.equal(dayPlan(p,[record('session','2026-10-12',{status:'skipped'},{deleted:true}),record('schedule','2026-10-12',{day:2})],'2026-10-12').name,'Lower A + core');
});
test('malformed, reversed and oversized breaks fail backup/API validation',()=>{
 for(const [start,end] of [['2026-02-30','2026-03-01'],['2026-13-01','2026-13-02'],['2026-10-13','2026-10-12'],['2026-10-12','2028-10-12']])assert.equal(validBreak(start,end),false);assert.ok(validBreak('2026-10-12','2026-10-12'));assert.ok(validateRecords([record('break','2026-10-12',{endDate:'2026-10-12',reason:'Travel'})]));assert.equal(validateRecords([record('break','2026-10-12',{endDate:'2026-10-11',reason:'Travel'})]),false);
});
