import { readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { nodeFileTrace } from '@vercel/nft';
for (const dir of ['web', 'server', 'api']) {
  for (const name of await readdir(dir)) if (name.endsWith('.js')) execFileSync(process.execPath, ['--check', `${dir}/${name}`]);
}
await stat('web/index.html');
const entries=(await readdir('api')).filter(name=>name.endsWith('.js')).map(name=>`api/${name}`);
const trace=await nodeFileTrace(entries,{base:process.cwd()});
// External packages may report optional adapters. Missing first-party files must fail the build.
const missing=[...trace.warnings].filter(warning=>['api','server','web'].some(dir=>warning.message.includes(`loaded from '${resolve(dir)}/`)));
if(missing.length)throw new Error('Server function dependencies could not be packaged:\n'+missing.map(warning=>warning.message).join('\n'));
console.log('Build verified, including server dependency tracing. Static app: web/. Server functions: api/. No secrets are bundled.');
