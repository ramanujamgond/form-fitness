import {validDate,validBreak} from './dates.js?v=36';
export {validDate,validBreak} from './dates.js?v=36';
import {week} from './content.js?v=36';
const rest=()=>({...week[0],ids:[]});
const fullA={name:'Full body A + core',kind:'Strength',ids:['press','row','legpress','bridge','deadbug']};
const fullB={name:'Full body B + core',kind:'Strength',ids:['press','pulldown','squat','curl','deadbug']};
export function weeklyPlan(days=5){
 const n=Number(days);const result=Array.from({length:7},rest);
 if(n<=3){result[1]=fullA;if(n>=2)result[4]=fullB;if(n===3){result[3]=fullB;result[4]=rest();result[5]=fullA;}}
 else{for(const d of [1,2,4,5])result[d]=week[d];if(n>=5)result[3]=week[3];if(n>=6)result[6]={...week[3],name:'Easy cardio & mobility'};if(n===7)result[0]={name:'Active recovery',kind:'Light day',ids:[],guidance:'Optional relaxed walking and gentle mobility. Keep the effort easy enough to talk comfortably. Take complete rest whenever you need it.'};}
 return result;
}
export function frequencyOn(profile,date){const rows=(profile.planHistory||[]).filter(r=>r.effectiveFrom<=date).sort((a,b)=>a.effectiveFrom.localeCompare(b.effectiveFrom));return rows.at(-1)?.days||(profile.planHistory?.length?5:profile.workoutDays||5);}
export function setFrequency(profile,days,date){const n=Number(days);if(!Number.isInteger(n)||n<1||n>7)throw Error('Choose between 1 and 7 activity days.');if(n===profile.workoutDays)return profile;const history=(profile.planHistory||[]).filter(r=>r.effectiveFrom!==date);history.push({effectiveFrom:date,days:n});if(history.length>365)throw Error('Too many plan changes. Export a backup before adjusting the schedule further.');return {...profile,workoutDays:n,planHistory:history.sort((a,b)=>a.effectiveFrom.localeCompare(b.effectiveFrom))};}
export function dayPlan(profile,records,date){
 const rows=records.filter(r=>!r.deleted),day=rows.filter(r=>r.date===date),weekday=new Date(date+'T12:00:00').getDay();
 const override=day.filter(r=>r.type==='schedule').sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
 const base=override?week[override.data.day]||weeklyPlan(frequencyOn(profile,date))[weekday]:weeklyPlan(frequencyOn(profile,date))[weekday];
 const completed=day.some(r=>r.type==='session'&&r.data.status==='complete');
 const pause=rows.filter(r=>r.type==='break'&&r.date<=date&&r.data.endDate>=date).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
 const skip=day.find(r=>r.type==='session'&&r.data.status==='skipped');
 return !completed&&(pause||skip)?{...base,name:'Break · '+base.name,ids:[],skipped:true,reason:pause?.data.reason||skip?.data.reason||'Taking a break'}:base;
}
export function planSummary(days){const plans=weeklyPlan(days),strength=plans.filter(p=>p.kind==='Strength').length,light=plans.filter(p=>p.kind==='Light day').length;return `${strength} strength ${strength===1?'day':'days'}, ${light} light ${light===1?'day':'days'}, ${7-Number(days)} rest ${7-Number(days)===1?'day':'days'}.` ;}
export function frequencyField(profile){return `<label>Activity days per week</label><select name="workoutDays">${Array.from({length:7},(_,i)=>i+1).map(n=>`<option value="${n}" ${profile.workoutDays===n?'selected':''}>${n} ${n===1?'day':'days'}${n===5?' (current default)':''}</option>`).join('')}</select><small data-frequency-summary>${planSummary(profile.workoutDays)} Six and seven days include easy activity. Recovery stays part of the plan; missed sessions are not added later.</small>`;}
