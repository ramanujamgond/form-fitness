import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

test('journal function starts without browser exercise content in its bundle',async()=>{
 const bundle=await mkdtemp(join(tmpdir(),'form-journal-bundle-'));
 try{
  for(const dir of ['api','server','web'])await mkdir(join(bundle,dir));
  for(const file of ['package.json','api/journal.js','server/runtime.js','server/journal.js','server/http.js','server/email.js','server/pin.js','web/store.js','web/scheduling.js'])await copyFile(resolve(file),join(bundle,file));
  // Shared validation is included when present; UI content deliberately is not.
  try{await copyFile(resolve('web/dates.js'),join(bundle,'web/dates.js'));}catch(err){if(err.code!=='ENOENT')throw err;}
  await symlink(resolve('node_modules'),join(bundle,'node_modules'),'dir');
  const result=spawnSync(process.execPath,['--input-type=module','-e',`const {default:handler}=await import('./api/journal.js');const res={setHeader(){},end(body){if(this.statusCode!==503)throw Error('Expected configuration response');JSON.parse(body);}};await handler({method:'GET',headers:{},url:'/api/journal'},res);`],{cwd:bundle,encoding:'utf8',env:{PATH:process.env.PATH}});
  assert.equal(result.status,0,result.stderr);
 }finally{await rm(bundle,{recursive:true,force:true});}
});
