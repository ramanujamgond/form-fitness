import {setGoal} from './journey.js?v=35';
// Suggestions are starting trials, not an assessment of a person's strength.
export function prescription(id,stage,rows=[],date='',session={}) {
 const bodyweight=['pushup','squat','bridge','calf','deadbug'].includes(id);
 const reps=id==='deadbug'?6:['raise','curl','bridge','calf'].includes(id)?12:10;
 const history=rows.filter(r=>!r.deleted&&r.type==='set'&&r.date<=date&&r.data.exercise===id&&!r.data.symptom&&r.data.form==='good'&&Number.isFinite(r.data.weight)&&r.data.rir>=2).sort((a,b)=>b.date.localeCompare(a.date)||b.updatedAt.localeCompare(a.updatedAt))[0];
 const latest=rows.filter(r=>!r.deleted&&r.type==='set'&&r.date===date&&r.data.exercise===id).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
 const saved=session.prescriptions?.[id];
 const weight=latest?(latest.data.weight??latest.data.weightSetting):saved?.weight??(history?history.data.weight:bodyweight?0:id==='raise'?1:id==='legpress'?'lightest':id==='assisted'?'most':5);
 return {sets:session.setTargets?.[id]||setGoal(id,stage),recommendedSets:setGoal(id,stage),reps:latest?.data.reps||saved?.reps||reps,minutes:latest?.data.minutes||saved?.minutes||20,weight,history:!!history,
  weightLabel:id==='assisted'?'Assistance on the machine (kg)':id==='raise'?'Weight per dumbbell (kg)':bodyweight?'Added weight (kg)':'Machine load (kg)',
  weightHint:id==='assisted'?'Start with the most assistance available; more assistance makes the movement easier. Select a number only when it matches the display.':id==='legpress'?'Start at the lightest setting. On a plate-loaded machine, this means no added plates; the empty sled still has weight. Ask staff to check it.':bodyweight?'Recommended: bodyweight only, with no added weight.':id==='raise'?'Trial starting suggestion: 1 kg in each hand, or no dumbbells while learning.':latest?'Your last saved load is selected for this next set. Keep it only if the previous set was comfortable; choose a lighter setting if needed.':history?'Suggested from a controlled, symptom-free saved set. Use it only on the same equipment and setting; otherwise start at the lightest setting.':'Trial starting suggestion: 5 kg only if available and easy to control. Otherwise choose the lightest machine setting. Machine loads vary.'};
}
export function weightText(data){return data.weightSetting==='most'?'most assistance':data.weightSetting==='lightest'?'lightest setting':`${data.weight} kg${data.assistance?' assistance':''}`;}
