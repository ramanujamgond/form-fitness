import {validDate} from './dates.js?v=39';

export const trainingStages=[
 {id:'Foundation',name:'Beginner',focus:'Learn the machines. Finish with 2–3 good reps left.',change:'Two working sets. Repeat comfortable loads while learning.'},
 {id:'Building',name:'Building',focus:'Build clean reps before adding weight.',change:'A third set on the main lifts; two sets on smaller movements.'},
 {id:'Intermediate',name:'Intermediate',focus:'Track each exercise and review stalls.',change:'Three sets on strength movements; core stays at two. Review the last three workouts before changing the plan.'},
 {id:'Advanced',name:'Advanced',focus:'Adjust training to performance and recovery.',change:'Keep a manageable base plan. Choose 1–3 sets per movement, use lighter sessions when fatigued, and review plateaus with a trainer.'}
];
export const stageInfo=id=>trainingStages.find(s=>s.id===id)||trainingStages[0];
export function stageHistory(value){
 let index=0;
 return (Array.isArray(value)?value:[]).filter(r=>r&&validDate(r.date)&&trainingStages.some(s=>s.id===r.stage)).sort((a,b)=>a.date.localeCompare(b.date)).filter(r=>{
  const next=trainingStages.findIndex(s=>s.id===r.stage);
  if(next!==index+1)return false;index=next;return true;
 }).map(({date,stage})=>({date,stage}));
}
export function stageOn(profile,date){return stageHistory(profile.stageHistory).filter(r=>r.date<=date).at(-1)?.stage||'Foundation';}
export function recommendedSets(id,stage='Foundation',easy=false){
 if(id==='walk')return 1;
 if(easy||id==='deadbug')return 2;
 if(stage==='Foundation')return 2;
 return stage==='Building'&&['raise','biceps','triceps','curl','bridge','calf'].includes(id)?2:3;
}
export function returnToTraining(rows,date){
 const prior=rows.filter(r=>!r.deleted&&r.type==='session'&&r.data.status==='complete'&&r.date<date&&r.data.exerciseIds?.some(id=>id!=='walk')).sort((a,b)=>b.date.localeCompare(a.date))[0];
 return !!prior&&(Date.parse(date)-Date.parse(prior.date))/86400000>=7;
}
export function exerciseAdvice(rows,date,id,maxReps,goal){
 const work=rows.filter(r=>!r.deleted&&r.type==='set'&&r.date<=date&&r.data.exercise===id),dates=[...new Set(work.map(r=>r.date))].sort().slice(-3);
 if(!dates.length)return 'Start light. Learn the movement before adding weight.';
 const last=work.filter(r=>r.date===dates.at(-1));
 if(last.some(r=>r.data.symptom))return 'Symptoms recorded: stop this movement and get appropriate advice before resuming.';
 if(last.some(r=>r.data.form!=='good'||r.data.rir===null||r.data.rir===undefined||r.data.rir<2))return 'Keep the load comfortable. Record controlled technique and reps left before considering an increase.';
 if(last.length>=goal&&last.every(r=>r.data.reps>=maxReps))return id==='deadbug'?'Both sets controlled? Try a slightly longer reach, keeping your back steady.':id==='assisted'?'At the top of the range: consider the smallest reduction in assistance on the same machine.':'At the top of the range: consider the smallest available load increase on the same equipment.';
 if(dates.length===3){
  const best=dates.map(d=>Math.max(...work.filter(r=>r.date===d).map(r=>Number(r.data.reps)||0)));
  if(best.every(n=>n===best[0]))return 'Reps have stayed level for three workouts. Check sleep, rest and machine settings; repeat or use a lighter session before adding work.';
 }
 return 'Keep the same comfortable load and aim for one more controlled rep within your range.';
}
// Review gates are product prompts, not fitness assessments. Every change needs confirmation.
export function stageReview(rows,date,profile,qualifies){
 const stage=stageOn(profile,date),index=trainingStages.findIndex(s=>s.id===stage),since=stageHistory(profile.stageHistory).filter(r=>r.date<=date).at(-1)?.date||'';
 const sessions=rows.filter(r=>!r.deleted&&r.type==='session'&&r.date>=since&&r.date<=date&&r.data.status==='complete'&&r.data.stage===stage&&r.data.exerciseIds?.some(id=>id!=='walk'));
 const unique=[...new Map(sessions.sort((a,b)=>a.updatedAt.localeCompare(b.updatedAt)).map(r=>[r.date,r])).values()];
 const count=unique.filter(r=>!r.data.easy&&qualifies(rows,r)).length,needed=[6,12,18,Infinity][index];
 const recent=unique.slice(-3),steady=recent.length===3&&recent.every(r=>!r.data.easy&&qualifies(rows,r));
 return {stage,next:trainingStages[index+1]?.id||null,count,needed,ready:count>=needed&&steady};
}
