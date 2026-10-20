import {test} from 'node:test';
import assert from 'node:assert/strict';
import {workoutPreview,weekPreviews,previewMovements} from '../web/workout-preview.js';
const profile={workoutDays:5,stageHistory:[]};
const row=(type,date,data)=>({id:type+date,type,date,data,updatedAt:date+'T08:00:00Z',deleted:false});
test('calendar preview lists the real exercises, equipment and dose without changing records',()=>{
 const records=[],before=JSON.stringify({profile,records});
 const p=workoutPreview(profile,records,'2026-10-20');
 assert.equal(p.focus,'Legs & core');assert.equal(p.stage,'Beginner');
 assert.deepEqual(p.movements.map(e=>e.id),['legpress','curl','bridge','calf','deadbug']);
 assert.ok(p.tools.includes('legpress'));assert.ok(p.tools.includes('mat'));
 assert.match(p.movements.find(e=>e.id==='deadbug').dose,/2 sets · 6 reps per side/);
 assert.match(previewMovements(p),/previewexercise:legpress@2026-10-20/);
 assert.equal(JSON.stringify({profile,records}),before);
});
test('previews follow schedule overrides, breaks, deletions and confirmed stages',()=>{
 const rows=[row('schedule','2026-10-20',{day:1})];
 const p={...profile,stageHistory:[{date:'2026-10-19',stage:'Building'}]};
 const upper=workoutPreview(p,rows,'2026-10-20');
 assert.equal(upper.focus,'Chest, back & arms');assert.match(upper.movements[0].dose,/3 sets/);
 assert.equal(workoutPreview(p,rows,'2026-10-13').stage,'Beginner');
 rows.push(row('break','2026-10-20',{endDate:'2026-10-23',reason:'Travel'}));
 const pause=workoutPreview(p,rows,'2026-10-20');assert.equal(pause.skipped,true);assert.deepEqual(pause.movements,[]);assert.match(previewMovements(pause),/Travel/);
 rows[1].deleted=true;assert.ok(workoutPreview(p,rows,'2026-10-20').movements.length>0);
});
test('saved workouts keep substitutions, stage, sets and prescriptions',()=>{
 const rows=[row('session','2026-10-20',{exerciseIds:['biceps','unknown'],stage:'Foundation',setTargets:{biceps:1},prescriptions:{biceps:{reps:8}}})];
 const p=workoutPreview({...profile,stageHistory:[{date:'2026-10-19',stage:'Building'}]},rows,'2026-10-20');
 assert.equal(p.stage,'Beginner');assert.deepEqual(p.movements.map(e=>e.id),['biceps']);assert.equal(p.movements[0].dose,'1 set · 8 reps per side');
});
test('workout-day learning uses the selected week and actual activity frequency',()=>{
 const days=weekPreviews({...profile,workoutDays:2},[],'2026-10-20');
 assert.equal(days[0].date,'2026-10-19');assert.equal(days[6].date,'2026-10-25');
 assert.equal(days.filter(d=>d.movements.length).length,2);assert.equal(days[0].focus,'Full body & core');
 assert.equal(days[1].focus,'Rest & recovery');assert.equal(days[1].tools.length,0);
 const recovery=workoutPreview({...profile,workoutDays:7},[],'2026-10-25');assert.match(recovery.guidance,/Optional relaxed walking/);
});
