import { configured, isProduction } from '../server/runtime.js';
import { json } from '../server/http.js';
export default function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed' });
  return json(res, 200, { configured: configured(), provider: 'neon', signupAllowed: !isProduction() });
}
