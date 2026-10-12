import test from 'node:test';
import assert from 'node:assert/strict';
import {prescription,weightText} from '../web/prescription.js';
import {currentExercise,qualifies,sessionSetGoal} from '../web/journey.js';
const date='2026-10-12';
const row=(type,data,day=date)=>({type,data,date:day,updatedAt:day+'T10:00:00Z'});
test('starting trials distinguish bodyweight, per-hand loads and machine assistance',()=>{
 assert.equal(prescription('press','Foundation',[],date).weight,5);
 assert.equal(prescription('raise','Foundation',[],date).weight,1);
 assert.equal(prescription('deadbug','Foundation',[],date).weight,0);
 assert.equal(prescription('legpress','Foundation',[],date).weight,'lightest');
 assert.equal(prescription('assisted','Foundation',[],date).weight,'most');
 assert.equal(weightText({weight:null,weightSetting:'most'}),'most assistance');
});
test('history ignores future, deleted, painful and uncontrolled sets',()=>{
 const good=row('set',{exercise:'press',weight:7.5,reps:10,form:'good',rir:3},'2026-10-10');
 const bad=[row('set',{...good.data,weight:100,symptom:true},'2026-10-11'),row('set',{...good.data,weight:200},'2026-10-13'),{...row('set',{...good.data,weight:80},'2026-10-11'),deleted:true}];
 assert.equal(prescription('press','Foundation',[good,...bad],date).weight,7.5);
});
test('chosen set count controls the next exercise after reload; a shorter plan cannot accelerate stages',()=>{
 const session=row('session',{exerciseIds:['press','row'],status:'complete',stage:'Foundation',setTargets:{press:1,row:3}});
 const set=id=>row('set',{exercise:id,reps:10,form:'good',rir:3});
 const rows=[session,set('press'),set('row'),set('row')];
 assert.equal(currentExercise(['press','row'],rows,date,'Foundation'),'row');
 rows.push(set('row'));assert.equal(currentExercise(['press','row'],rows,date,'Foundation'),undefined);
 rows.push(row('checkin',{energy:'Good',sleep:8}));assert.equal(qualifies(rows,session),false);
 assert.equal(sessionSetGoal('press','Foundation',{setTargets:{press:999}}),2);
});
test('saved choices carry forward without claiming technique or effort feedback',()=>{
 const saved=row('set',{exercise:'press',weight:5,reps:8,form:'uncertain',rir:null});
 const rec=prescription('press','Foundation',[saved],date,{setTargets:{press:3}});
 assert.equal(rec.sets,3);assert.equal(rec.reps,8);assert.equal(rec.weight,5);assert.equal(rec.history,false);
});
