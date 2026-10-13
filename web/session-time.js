// Duration comes from saved wall-clock timestamps, not background interval ticks.
const timestamp=value=>typeof value==='string'?Date.parse(value):NaN;
export function hasSessionStart(session){return Number.isFinite(timestamp(session.startedAt));}
export function sessionSeconds(session,now=Date.now()){
 if(!hasSessionStart(session))return null;
 const end=Number.isFinite(timestamp(session.endedAt))?timestamp(session.endedAt):now;
 return Math.max(0,Math.floor((end-timestamp(session.startedAt))/1000));
}
export function startSessionTime(session,now=Date.now()){
 return hasSessionStart(session)?{...session}:{...session,startedAt:new Date(now).toISOString()};
}
export function finishSessionTime(session,now=Date.now()){
 if(!hasSessionStart(session))return {...session};
 const endedAt=Number.isFinite(timestamp(session.endedAt))?session.endedAt:new Date(Math.max(now,timestamp(session.startedAt))).toISOString();
 const result={...session,endedAt};return {...result,durationSeconds:sessionSeconds(result)};
}
export function durationText(seconds){
 if(seconds===null)return 'Not timed';
 const s=Math.max(0,Math.floor(seconds)),hours=Math.floor(s/3600),minutes=Math.floor(s%3600/60);
 return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}
