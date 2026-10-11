import { fromNodeHeaders } from 'better-auth/node';
import { getRuntime } from '../server/runtime.js';
import { json } from '../server/http.js';
export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message:'Method not allowed' });
  try {
    const { auth, legacyEmail } = getRuntime();
    const session = await auth.api.getSession({ headers:fromNodeHeaders(req.headers) });
    if (!session?.user?.emailVerified) return json(res, 200, null);
    const {id,name,email} = session.user;
    return json(res, 200, { user:{id,name,email}, canClaimLegacy:email.toLowerCase()===legacyEmail });
  } catch { return json(res, 503, { message:'Account connection unavailable. Your local records are retained.' }); }
}
