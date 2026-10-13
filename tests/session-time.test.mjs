import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hasSessionStart,sessionSeconds,startSessionTime,finishSessionTime,durationText} from '../web/session-time.js';
const start=Date.parse('2026-10-13T23:50:00Z');
test('session timestamps survive serialization and crossing midnight without resetting on resume',()=>{
 const data=startSessionTime({warmupIndex:1},start),reload=JSON.parse(JSON.stringify(data));
 assert.equal(reload.startedAt,'2026-10-13T23:50:00.000Z');
 assert.equal(startSessionTime(reload,start+60000).startedAt,data.startedAt);
 assert.equal(sessionSeconds(reload,start+5400000),5400);
 assert.equal(durationText(sessionSeconds(reload,start+5400000)),'01:30:00');
});
test('finish freezes elapsed time and repeated finish or history edits preserve original timestamps',()=>{
 const done=finishSessionTime(startSessionTime({},start),start+5400000);
 assert.equal(done.durationSeconds,5400);assert.equal(done.endedAt,'2026-10-14T01:20:00.000Z');
 assert.equal(sessionSeconds(done,start+9000000),5400);
 assert.deepEqual(finishSessionTime(done,start+9000000),done);
});
test('older sessions have no guessed duration and backward clock changes never create negative time',()=>{
 assert.equal(hasSessionStart({}),false);assert.equal(sessionSeconds({}),null);assert.equal(durationText(null),'Not timed');
 assert.deepEqual(finishSessionTime({status:'complete'},start),{status:'complete'});
 assert.equal(sessionSeconds({startedAt:'invalid'},start),null);
 const data=startSessionTime({},start);assert.equal(sessionSeconds(data,start-10000),0);
 assert.equal(finishSessionTime(data,start-10000).durationSeconds,0);
});
