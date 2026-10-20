import {dayPlan} from './scheduling.js?v=41';
import {sessionFor,sessionSetGoal} from './journey.js?v=41';
import {stageOn,stageInfo} from './training.js?v=41';
import {prescription} from './prescription.js?v=41';
import {exercises,tools} from './content.js?v=41';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function workoutPreview(profile,records,date){
 const plan=dayPlan(profile,records,date),session=sessionFor(records,date);
 const ids=plan.skipped?[]:(Array.isArray(session.exerciseIds)?session.exerciseIds:plan.ids).filter(id=>exercises[id]);
 const stage=session.stage||stageOn(profile,date);
 const movements=ids.map(id=>{
  const e=exercises[id],dose=prescription(id,stage,records,date,session),sets=sessionSetGoal(id,stage,session);
  return {id,name:e.name,image:e.img,muscles:e.muscles,tools:[...e.tools],dose:id==='walk'?`${dose.minutes} minutes at an easy pace`:`${sets} ${sets===1?'set':'sets'} · ${dose.reps} reps${['biceps','deadbug'].includes(id)?' per side':''}`};
 });
 const patterns=new Set(ids.map(id=>exercises[id].pattern));
 const focus=plan.skipped?'Time off':!ids.length?'Rest & recovery':plan.kind!=='Strength'?'Easy cardio':patterns.has('legs')?(patterns.has('push')||patterns.has('pull')?'Full body & core':'Legs & core'):'Chest, back & arms';
 return {date,name:plan.name,kind:plan.kind,focus,skipped:!!plan.skipped,stage:stageInfo(stage).name,movements,tools:[...new Set(movements.flatMap(e=>e.tools))],guidance:plan.reason||plan.guidance||'Rest, or take an easy walk if you feel comfortable.'};
}
export function weekPreviews(profile,records,date){
 const start=new Date(date+'T12:00:00');start.setDate(start.getDate()-(start.getDay()+6)%7);
 return Array.from({length:7},(_,i)=>{const day=new Date(start);day.setDate(day.getDate()+i);const key=`${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;return {...workoutPreview(profile,records,key),weekday:day.toLocaleDateString('en-GB',{weekday:'long'})};});
}
export function previewMovements(preview){
 if(!preview.movements.length)return `<p class="preview-rest">${esc(preview.guidance)}</p><small>No exercises to complete on this day.</small>`;
 return `<ol class="preview-exercises">${preview.movements.map(e=>`<li><button class="preview-exercise" data-action="previewexercise:${e.id}@${preview.date}" aria-label="Learn ${esc(e.name)}"><img src="${e.image}" alt="" width="56" height="56" loading="lazy"><span><strong>${esc(e.name)}</strong><small>${esc(e.dose)}</small></span><span class="preview-arrow" aria-hidden="true">↗</span></button><div class="preview-tools" aria-label="Equipment for ${esc(e.name)}">${e.tools.map(id=>`<button data-action="tool:${id}">${esc(tools[id].name)}</button>`).join('')}</div></li>`).join('')}</ol>`;
}
