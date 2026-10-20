import test from 'node:test';
import assert from 'node:assert/strict';
import {stageOn,stageHistory,stageReview,recommendedSets,returnToTraining,exerciseAdvice} from '../web/training.js';
import {sessionSetGoal,qualifies} from '../web/journey.js';
import {preferencesFrom} from '../web/accounts.js';
import {prescription} from '../web/prescription.js';
const row=(type,date,data)=>({id:crypto.randomUUID(),type,date,data,updatedAt:date+'T10:00:00.000Z',deleted:false});
const history=(n,stage='Foundation',easy=false)=>Array.from({length:n},(_,i)=>{
 const date=`2026-09-${String(i+1).padStart(2,'0')}`;
 return [row('session',date,{status:'complete',exerciseIds:['press'],stage,easy}),row('checkin',date,{energy:'Good',sleep:8}),...Array.from({length:recommendedSets('press',stage)},()=>row('set',date,{exercise:'press',reps:12,weight:10,form:'good',rir:3}))];
}).flat();
test('qualifying records open a review without automatically advancing a stage',()=>{
 const rows=history(6),profile={};
 assert.equal(stageReview(rows,'2026-10-20',profile,qualifies).ready,true);
 assert.equal(stageOn(profile,'2026-10-20'),'Foundation');
 profile.stageHistory=[{date:'2026-10-20',stage:'Building'}];
 assert.equal(stageOn(profile,'2026-10-19'),'Foundation');assert.equal(stageOn(profile,'2026-10-20'),'Building');
 assert.equal(stageReview(rows,'2026-10-20',profile,qualifies).count,0);
});
test('easy, symptomatic, missing-feedback and duplicate sessions cannot unlock a review',()=>{
 for(const kind of ['easy','symptom','feedback']){
  const rows=history(6,'Foundation',kind==='easy');
  if(kind==='symptom')rows.at(-1).data.symptom=true;
  if(kind==='feedback')rows.at(-1).data.form='uncertain';
  assert.equal(stageReview(rows,'2026-10-20',{},qualifies).ready,false);
 }
 const rows=history(1),session=rows[0];for(let i=0;i<10;i++)rows.push({...session,id:crypto.randomUUID()});
 assert.equal(stageReview(rows,'2026-10-20',{},qualifies).count,1);
});
test('stage confirmations sync with preferences, reject skipped stages, and preserve dates',()=>{
 assert.deepEqual(stageHistory([{date:'2026-01-01',stage:'Advanced'}]),[]);
 const stageHistoryValue=[{date:'2026-09-10',stage:'Building'},{date:'2026-10-01',stage:'Intermediate'}];
 const profile=preferencesFrom([row('preferences','2026-10-20',{profile:{stageHistory:stageHistoryValue,easyUntil:'2026-10-23'}})]).profile;
 assert.equal(stageOn(profile,'2026-09-01'),'Foundation');assert.equal(stageOn(profile,'2026-09-20'),'Building');assert.equal(stageOn(profile,'2026-10-20'),'Intermediate');assert.equal(profile.easyUntil,'2026-10-23');
});
test('stages change main/accessory volume while saved and legacy targets stay fixed',()=>{
 assert.equal(recommendedSets('press','Foundation'),2);assert.equal(recommendedSets('press','Building'),3);assert.equal(recommendedSets('biceps','Building'),2);assert.equal(recommendedSets('biceps','Intermediate'),3);assert.equal(recommendedSets('press','Advanced',true),2);assert.equal(recommendedSets('deadbug','Advanced'),2);
 assert.equal(sessionSetGoal('raise','Building',{coachVersion:23}),3);assert.equal(sessionSetGoal('press','Advanced',{setTargets:{press:1}}),1);
});
test('a week away offers easier training and does not reuse old load as an easy-session suggestion',()=>{
 const rows=history(1);assert.equal(returnToTraining(rows,'2026-09-07'),false);assert.equal(returnToTraining(rows,'2026-09-08'),true);
 assert.equal(prescription('press','Foundation',rows,'2026-09-08',{easy:true}).weight,5);
});
test('next-session advice respects symptoms, technique, assistance and plateaus',()=>{
 const rows=history(1);
 assert.match(exerciseAdvice(rows,'2026-10-20','press',12,2),/smallest/);
 rows.at(-1).data.symptom=true;assert.match(exerciseAdvice(rows,'2026-10-20','press',12,2),/stop/);
 rows.at(-1).data.symptom=false;rows.at(-1).data.form='uncertain';assert.doesNotMatch(exerciseAdvice(rows,'2026-10-20','press',12,2),/^At the top/);
 const plateau=history(3);plateau.filter(r=>r.type==='set').forEach(r=>r.data.reps=10);
 assert.match(exerciseAdvice(plateau,'2026-10-20','press',12,2),/three workouts/);
});
