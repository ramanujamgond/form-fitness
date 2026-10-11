import { test } from 'node:test';
import assert from 'node:assert/strict';
import { journalHandler } from '../server/journal.js';

const origin = 'https://form.example.com';
const row = (updatedAt = '2026-10-10T10:00:00.000Z', extra = {}) => ({ id:'record-1', type:'set', date:'2026-10-10', data:{reps:8}, updatedAt, deleted:false, dirty:true, ...extra });
function setup(session = { user:{id:'owner', email:'owner@example.com',emailVerified:true} }) {
  const data = new Map(); const calls = [];
  const query = async (sql, args) => {
    calls.push([sql,args]);
    if (sql.startsWith('INSERT')) {
      const key = `${args[0]}:${args[1]}`, old = data.get(key);
      if (!old || Date.parse(args[3]) > Date.parse(old.updatedAt)) data.set(key,args[2]);
    }
    if (sql.startsWith('SELECT payload')) return {rows:[{payload:data.get(`${args[0]}:${args[1]}`)}]};
    if (sql.startsWith('SELECT id')) return {rows:[...data].filter(([key,r])=>key.startsWith(args[0]+':')&&r.id>args[1]).map(([,r])=>({id:r.id,payload:r}))};
    return { rows:[] };
  };
  const pool = {query, connect:async()=>({query,release(){}})};
  const handler = journalHandler(()=>({pool,origin,allowedEmail:'owner@example.com',auth:{api:{getSession:async()=>session}}}));
  const request = async (method='POST', body=[row()], headers={origin}) => {
    const req = { method,body,headers,url:'/api/journal' };
    const res = {headers:{},setHeader(k,v){this.headers[k]=v;},end(v){this.body=JSON.parse(v);}};
    await handler(req,res);return res;
  };
  return {data,calls,request};
}
test('anonymous and unverified users cannot access journal',async()=>{
  for(const session of [null,{user:{id:'other',email:'other@example.com',emailVerified:false}}]){
    const s=setup(session);assert.equal((await s.request('GET')).statusCode,401);assert.equal(s.calls.length,0);
  }
});
test('cross-origin writes are rejected before touching the database',async()=>{
  const s=setup();assert.equal((await s.request('POST',[row()],{origin:'https://evil.example'})).statusCode,403);assert.equal(s.calls.length,0);
});
test('client cannot spoof ownership and responses cannot be cached',async()=>{
  const s=setup();const res=await s.request('POST',[row(undefined,{user_id:'victim'})]);
  assert.equal(res.statusCode,200);assert.equal(res.headers['Cache-Control'],'private, no-store');
  assert.equal(s.data.has('owner:record-1'),true);assert.equal(s.data.has('victim:record-1'),false);
  assert.equal(res.body.records[0].user_id,undefined);assert.equal(res.body.records[0].dirty,false);
});
test('stale uploads return newer server tombstones and reads stay owner scoped',async()=>{
  const s=setup();await s.request('POST',[row('2026-10-10T11:00:00.000Z',{deleted:true})]);
  s.data.set('victim:private',row(undefined,{id:'private'}));
  const res=await s.request();assert.equal(res.body.records[0].deleted,true);
  const get=await s.request('GET');assert.equal(get.body.records.length,1);assert.equal(get.body.records[0].id,'record-1');
});
test('malformed, oversized and noncanonical timestamps are rejected',async()=>{
  const s=setup();
  for(const body of [[row(undefined,{id:'bad/id'})],[row(undefined,{data:{note:'x'.repeat(33000)}})],[row('2026-10-10T10:00:00Z')],[],Array.from({length:101},()=>row()),'bad json']) {
    assert.equal((await s.request('POST',body)).statusCode,400);
  }
  assert.equal(s.calls.length,0);
});

test('a second verified account can use its own journal without the original email',async()=>{
 const s=setup({user:{id:'sister',email:'sister@example.com',emailVerified:true}});
 assert.equal((await s.request()).statusCode,200);
 assert.ok(s.data.has('sister:record-1'));assert.ok(!s.data.has('owner:record-1'));
});
test('a stale account tab cannot upload through another account session',async()=>{
 const s=setup();assert.equal((await s.request('POST',[row()],{origin,'x-form-account':'sister'})).statusCode,409);
 assert.equal(s.calls.length,0);
});

test('planned breaks sync within the verified account and reject invalid ranges',async()=>{
 const s=setup();const pause=row(undefined,{id:'break-1',type:'break',date:'2026-10-12',data:{endDate:'2026-10-16',reason:'Travel'}});
 assert.equal((await s.request('POST',[pause])).statusCode,200);const result=await s.request('GET');assert.equal(result.body.records[0].data.endDate,'2026-10-16');
 assert.equal((await s.request('POST',[{...pause,data:{endDate:'2026-10-11',reason:'Travel'}}])).statusCode,400);
});
