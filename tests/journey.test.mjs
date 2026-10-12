import {test} from 'node:test';
import assert from 'node:assert/strict';
import {progression,currentExercise,suggestedMeal,mealSlots} from '../web/journey.js';
const row=(type,date,data)=>({id:crypto.randomUUID(),type,date,data,deleted:false,updatedAt:date+'T12:00:00.000Z'});
function history(n){return Array.from({length:n},(_,i)=>{
 const date=`2026-09-${String(i+1).padStart(2,'0')}`;
 return [row('session',date,{status:'complete',stage:'Foundation',exerciseIds:['press']}),row('checkin',date,{sleep:8,energy:'Good',symptom:false}),...Array.from({length:2},()=>row('set',date,{exercise:'press',reps:10,rir:3,form:'good',symptom:false}))];
}).flat();}
test('stage grows from recorded readiness, excludes future dates and holds after symptoms',()=>{
 const rows=history(6);
 assert.equal(progression(rows,'2026-10-12').stage,'Building');
 assert.equal(progression(rows,'2026-09-06').stage,'Foundation');
 rows.at(-1).data.symptom=true;
 assert.equal(progression(rows,'2026-10-12').stage,'Foundation');
});
test('missing recovery, skipped exercise and deleted set never qualify for progression',()=>{
 for(const edit of [rows=>rows.at(-3).deleted=true,rows=>rows.at(-4).data.skippedExercises=[{id:'press',reason:'Equipment unavailable'}],rows=>rows.at(-1).deleted=true]){
  const rows=history(6);edit(rows);assert.equal(progression(rows,'2026-10-12').stage,'Foundation');
 }
});
test('a nonqualifying later session holds the earned stage and resets its streak',()=>{
 const rows=history(7);rows.at(-1).data.rir=0;
 const result=progression(rows,'2026-10-12');
 assert.equal(result.stage,'Building');assert.equal(result.clean,0);
});
test('current exercise waits for all sets, and symptoms require an explicit stop even on the last set',()=>{
 const rows=history(1),date='2026-09-01';
 assert.equal(currentExercise(['press','row'],rows,date,'Foundation'),'row');
 rows.at(-1).data.symptom=true;
 assert.equal(currentExercise(['press','row'],rows,date,'Foundation'),'press');
 rows[0].data.skippedExercises=[{id:'press',reason:'Pain or tingling'}];
 assert.equal(currentExercise(['press','row'],rows,date,'Foundation'),'row');
});
test('local dietary timeline finds suitable alternatives to eggs, dairy and wheat',()=>{
 assert.doesNotMatch(suggestedMeal(mealSlots[0],{diet:'any',avoid:'eggs'},[]).description,/egg/);
 assert.match(suggestedMeal(mealSlots[0],{diet:'vegan'},[]).name,/Moong ghugni/);
 assert.match(suggestedMeal(mealSlots[3],{diet:'vegan',avoid:'wheat'},[]).name,/Rice/);
 assert.equal(suggestedMeal(mealSlots[0],{diet:'any',avoid:'eggs, milk, moong'},[]),null);
});
