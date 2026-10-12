import test from 'node:test';
import assert from 'node:assert/strict';
import {draftKey,readDraft,writeDraft,clearDraft} from '../web/drafts.js';
import {sessionReadiness,qualifies} from '../web/journey.js';
test('drafts are isolated by account, date, movement and set, and clearing one keeps the others',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const key=draftKey('account-a','2026-10-12','press',1);
 writeDraft(storage,key,{reps:'8',weight:'2.5',note:'Seat 3'});
 assert.equal(readDraft(storage,key).note,'Seat 3');
 for(const other of [draftKey('account-b','2026-10-12','press',1),draftKey('account-a','2026-10-13','press',1),draftKey('account-a','2026-10-12','row',1),draftKey('account-a','2026-10-12','press',2)])assert.equal(readDraft(storage,other),null);
 writeDraft(storage,'another',{reps:'10'});clearDraft(storage,key);
 assert.equal(readDraft(storage,key),null);assert.equal(readDraft(storage,'another').reps,'10');
});
test('unavailable or malformed draft storage does not prevent recording',()=>{
 assert.equal(readDraft({getItem:()=>'{broken'},'key'),null);
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
 assert.doesNotThrow(()=>writeDraft(blocked,'key',{}));assert.doesNotThrow(()=>clearDraft(blocked,'key'));
});
test('readiness explains missing feedback and recovery rather than silently qualifying a session',()=>{
 const date='2026-10-12',session={type:'session',date,data:{status:'complete',stage:'Foundation',exerciseIds:['press']}};
 const sets=Array.from({length:2},()=>({type:'set',date,data:{exercise:'press',reps:10,form:'uncertain',rir:null}}));
 const checks=sessionReadiness([session,...sets],session);
 assert.equal(checks[0].met,true);assert.equal(checks[1].met,true);assert.equal(checks[2].met,false);assert.equal(checks[3].met,false);assert.equal(qualifies([session,...sets],session),false);
 sets.forEach(r=>Object.assign(r.data,{form:'good',rir:3}));
 assert.equal(qualifies([session,...sets,{type:'checkin',date,data:{energy:'Good',sleep:8}}],session),true);
 assert.equal(qualifies([session,...sets,{type:'checkin',date,data:{energy:'Good'}}],session),false);
});
