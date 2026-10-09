import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mergeRecords,validateRecords} from '../web/store.js';
const row=(id,time,extra={})=>({id,type:'set',date:'2026-10-09',data:{reps:10},updatedAt:time,deleted:false,dirty:true,...extra});
test('newer offline edit survives cloud snapshot',()=>{const local=row('a','2026-10-09T12:00:00Z');assert.deepEqual(mergeRecords([local],[row('a','2026-10-09T11:00:00Z')]),[local]);});
test('newer cloud deletion prevents resurrecting old record',()=>{const result=mergeRecords([row('a','2026-10-09T11:00:00Z')],[row('a','2026-10-09T12:00:00Z',{deleted:true})]);assert.equal(result[0].deleted,true);assert.equal(result[0].dirty,false);});
test('independent records merge without duplicating ids',()=>{const a=row('a','2026-10-09T11:00:00Z');assert.equal(mergeRecords([a],[a,row('b','2026-10-09T12:00:00Z')]).length,2);});
test('backup rejects malformed records and accepts tombstones',()=>{assert.equal(validateRecords([row('a','2026-10-09T12:00:00Z',{deleted:true})]),true);assert.equal(validateRecords([{id:'a',type:'script'}]),false);assert.equal(validateRecords([row('a','not-a-date')]),false);});
