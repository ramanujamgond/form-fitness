import { toNodeHandler } from 'better-auth/node';
import { getRuntime } from '../server/runtime.js';
import { json } from '../server/http.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  try {
    // Vercel rewrites auth paths to this one function. Local dev uses the original URL.
    const url = new URL(req.url, 'http://localhost');
    const route = req.query?.route ?? url.searchParams.get('route');
    if (route != null) { url.searchParams.delete('route'); req.url = '/api/auth/' + route + (url.search ? url.search : ''); }
    return await toNodeHandler(getRuntime().auth)(req, res);
  } catch { if (!res.headersSent) json(res, 503, { message: 'Cloud authentication is unavailable. Complete server setup first.' }); }
}
