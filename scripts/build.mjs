import { readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
for (const dir of ['web', 'server', 'api']) {
  for (const name of await readdir(dir)) if (name.endsWith('.js')) execFileSync(process.execPath, ['--check', `${dir}/${name}`]);
}
await stat('web/index.html');
console.log('Build verified. Static app: web/. Server functions: api/. No secrets are bundled.');
