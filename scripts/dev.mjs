import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import auth from '../api/auth.js';
import journal from '../api/journal.js';
import config from '../api/config.js';
import account from '../api/account.js';
const root = resolve('web');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp' };
export async function appHandler(req, res) {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname.startsWith('/api/auth/')) return auth(req, res);
  if (pathname === '/api/journal') return journal(req, res);
  if (pathname === '/api/config') return config(req, res);
  if (pathname === '/api/account') return account(req, res);
  try {
    const path = resolve(root, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(root + '/')) throw Error('Forbidden');
    const body = await readFile(path);
    res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(body);
  } catch { res.statusCode = 404; res.end('Not found'); }
}
if(process.argv[1]&&resolve(process.argv[1])===resolve('scripts/dev.mjs'))createServer(appHandler).listen(3000,'127.0.0.1',()=>console.log('FORM: http://localhost:3000 (offline app works before cloud setup)'));
