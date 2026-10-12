import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {nodeFileTrace} from '@vercel/nft';

test('journal function cold-starts from traced deployment files without browser UI dependencies',async()=>{
 const bundle=await mkdtemp(join(tmpdir(),'form-journal-bundle-'));
 try{
  const {fileList}=await nodeFileTrace(['api/journal.js'],{base:process.cwd()});
  // Copy only files the deploy tracer includes, rather than manually adding imports.
  for(const file of fileList){
   if(file.startsWith('node_modules/'))continue;
   const destination=join(bundle,file);
   await mkdir(dirname(destination),{recursive:true});
   await copyFile(resolve(file),destination);
  }
  await symlink(resolve('node_modules'),join(bundle,'node_modules'),'dir');
  const result=spawnSync(process.execPath,['--input-type=module','-e',`const {default:handler}=await import('./api/journal.js');const res={setHeader(){},end(body){if(this.statusCode!==503)throw Error('Expected configuration response');JSON.parse(body);}};await handler({method:'GET',headers:{},url:'/api/journal'},res);`],{cwd:bundle,encoding:'utf8',env:{PATH:process.env.PATH}});
  assert.equal(result.status,0,result.stderr);
  assert.ok(fileList.has('web/dates.js'),'shared date validation must be packaged');
  assert.ok(!fileList.has('web/content.js'),'server bundle must not load exercise content');
 }finally{await rm(bundle,{recursive:true,force:true});}
});
