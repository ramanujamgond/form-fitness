import {sessionFor,currentExercise} from './journey.js?v=39';

export const warmupVideo='https://www.youtube-nocookie.com/embed/j1wFGag9zMo';
export const warmupVideoLabel='Full-body warm-up and stretching · Nirbhay Pandey';
export const warmupSource='https://www.nhs.uk/live-well/exercise/how-to-warm-up-before-exercising/';
export const warmups=[
 {id:'march',name:'March gently on the spot',amount:'3 minutes',seconds:180,steps:['Stand in a clear space, without weights.','Take small alternating steps, lifting each foot comfortably.','Let bent arms move naturally; keep your breathing easy.'],hint:'No machine needed. Start slowly.'},
 {id:'heel',name:'Alternate heel taps',amount:'About 60 taps over 1 minute',seconds:60,steps:['Stand with a soft bend in your knees.','Place one heel a little in front, with its toes pointing up.','Bring it back and change feet, using small controlled taps.'],hint:'Stay balanced; use a slower pace if needed.'},
 {id:'knee',name:'Gentle alternating knee lifts',amount:'About 30 lifts over 30 seconds',seconds:30,steps:['Stand tall in a clear space.','Lift one knee comfortably towards the opposite hand.','Lower gently, then change sides.'],hint:'Keep the supporting knee soft. Do not force the height.'},
 {id:'shoulder',name:'Relaxed shoulder rolls',amount:'2 rounds: 5 forward + 5 backward',seconds:60,steps:['Let your arms hang loosely.','Make small shoulder circles forward five times, then backward five times.','Repeat once, keeping the movement comfortable.'],hint:'Keep stepping gently if comfortable.'},
 {id:'bend',name:'Small knee bends',amount:'10 slow repetitions',seconds:30,steps:['Place feet around shoulder width, arms forward for balance.','Bend knees a little, lowering only a short distance.','Stand back up smoothly; repeat without bouncing.'],hint:'This is a shallow warm-up movement, not a deep squat.'}
];
export const cooldown=[
 {id:'walk',name:'Slow down with an easy walk',amount:'2–3 minutes',seconds:120,steps:['Walk slowly in a clear space.','Gradually ease your pace.','Let your breathing settle before leaving the gym.'],hint:'No more working sets. Keep it relaxed.',video:'https://www.youtube.com/watch?v=q1vVpCzGluk'},
 {id:'calf',name:'Gentle calf stretch',amount:'15–20 seconds on each side',seconds:40,steps:['Use a wall or stable chair for balance.','Step one foot back, keeping that heel down and leg straight.','Bend the front knee gently, then change sides.'],hint:'Hold comfortably; do not bounce or stretch into pain.',video:'https://www.youtube.com/watch?v=08F12TvgTd4',source:'https://www.nhs.uk/live-well/exercise/how-to-stretch-after-exercising/'}
];

export function coachState(rows,date,ids,stage,now=Date.now()) {
 const session=sessionFor(rows,date),active=rows.filter(r=>!r.deleted&&r.date===date);
 if(session.status==='complete')return {phase:'complete'};
 if(!session.warmupDone)return {phase:'warmup',index:Math.min(warmups.length-1,session.warmupIndex||0)};
 const id=currentExercise(ids,rows,date,stage);
 if(id&&active.some(r=>r.type==='set'&&r.data.exercise===id&&r.data.symptom))return {phase:'stop',id};
 const latest=active.filter(r=>r.type==='set'&&r.data.guided).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
 if(latest&&session.restAcknowledged!==latest.id&&!(session.skippedExercises||[]).some(s=>s.id===latest.data.exercise))return {phase:'rest',row:latest,remaining:Math.max(0,Math.ceil((latest.data.restUntil-now)/1000))};
 if(!id)return (session.cooldownIndex||0)<cooldown.length?{phase:'cooldown',index:session.cooldownIndex||0}:{phase:'review'};
 return {phase:'set',id};
}
