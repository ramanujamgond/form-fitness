import {localMealOptions} from './local-food.js?v=30';
// Journey state is derived from journal records so it survives reloads and sync.
export const stages=['Foundation','Building','Intermediate','Advanced'];
export function setGoal(id,stage='Foundation') {
 return id==='walk'?1:id==='deadbug'?2:id==='pushup'?3:stage==='Foundation'?2:3;
}
export function sessionSetGoal(id,stage,session={}) {
 const chosen=session.setTargets?.[id];
 return Number.isInteger(chosen)&&chosen>=1&&chosen<=3?chosen:setGoal(id,stage);
}
export function sessionFor(rows,date) {
 return rows.filter(r=>!r.deleted&&r.type==='session'&&r.date===date).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0]?.data||{};
}
export function sessionReadiness(rows,session){
 const data=session?.data||{},ids=Array.isArray(data.exerciseIds)?data.exerciseIds:[],today=rows.filter(r=>!r.deleted&&r.date===session?.date),recovery=today.find(r=>r.type==='checkin')?.data;
 const work=ids.map(id=>({id,sets:today.filter(r=>r.type==='set'&&r.data.exercise===id)}));
 return [
  {label:'Completed strength session',met:data.status==='complete'&&ids.some(id=>id!=='walk')},
  {label:'All recommended sets, with no skipped movements',met:!!ids.length&&!data.skippedExercises?.length&&work.every(({id,sets})=>sets.length>=Math.max(setGoal(id,data.stage),sessionSetGoal(id,data.stage,data)))},
  {label:'Controlled sets with at least 2 clean reps left',met:!!work.length&&work.every(({id,sets})=>!!sets.length&&sets.every(r=>id==='walk'?r.data.minutes>0:r.data.reps>0&&r.data.form==='good'&&r.data.rir>=2))},
  {label:'Recovery check-in: good energy and 7+ hours of sleep',met:!!recovery&&recovery.energy==='Good'&&Number.isFinite(Number(recovery.sleep))&&Number(recovery.sleep)>=7},
  {label:'No pain or tingling recorded',met:!recovery?.symptom&&work.every(({sets})=>sets.every(r=>!r.data.symptom))}
 ];
}
export function qualifies(rows,session){return sessionReadiness(rows,session).every(check=>check.met);}
export function progression(rows,date) {
 const sessions=rows.filter(r=>!r.deleted&&r.type==='session'&&r.date<date).sort((a,b)=>a.date.localeCompare(b.date));
 let clean=0,index=0;
 for(const session of sessions){
  if(qualifies(rows,session))clean++;
  else if(session.data.status==='complete')clean=0;
  index=Math.max(index,clean>=36?3:clean>=18?2:clean>=6?1:0);
 }
 return {stage:stages[index],clean,next:[6,18,36,null][index]};
}
export function currentExercise(ids,rows,date,stage) {
 const session=sessionFor(rows,date),skips=session.skippedExercises||[];
 return ids.find(id=>{
  if(skips.some(s=>s.id===id))return false;
  const sets=rows.filter(r=>!r.deleted&&r.type==='set'&&r.date===date&&r.data.exercise===id);
  return sets.some(r=>r.data.symptom)||sets.length<sessionSetGoal(id,stage,session);
 });
}
export const mealSlots=[
 {id:'breakfast',time:'08:00',label:'Breakfast',meal:0},
 {id:'lunch',time:'13:00',label:'Lunch',meal:1},
 {id:'snack',time:'16:30',label:'Snack',meal:3},
 {id:'dinner',time:'19:30',label:'Dinner',meal:2}
];
export function suggestedMeal(slot,profile,_meals,date=''){
 const options=localMealOptions(slot,profile),choice=profile.mealChoices?.[date+':'+slot.id]||0;
 return options[choice]||options[0]||null;
}
