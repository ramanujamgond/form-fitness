import { fromNodeHeaders } from 'better-auth/node';
import { validateRecords } from '../web/store.js';
import { json, readBody } from './http.js';

export function journalHandler(getRuntime) {
  return async (req, res) => {
    try {
      if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return json(res, 405, { message: 'Method not allowed' }); }
      const { pool, auth, origin, allowedEmail } = getRuntime();
      if (req.method === 'POST' && req.headers.origin !== origin) return json(res, 403, { message: 'Origin rejected' });
      const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
      if (!session?.user || session.user.email.toLowerCase() !== allowedEmail) return json(res, 401, { message: 'Sign in to your configured account.' });
      const owner = session.user.id;
      if (req.method === 'GET') {
        const url = new URL(req.url, origin);
        const cursor = url.searchParams.get('after') || '';
        if (cursor.length > 128) return json(res, 400, { message: 'Invalid cursor' });
        // 100 * 32 KB stays below Vercel's response payload limit.
        const { rows } = await pool.query('SELECT id, payload FROM form_journal WHERE user_id = $1 AND id > $2 ORDER BY id LIMIT 100', [owner, cursor]);
        return json(res, 200, { records: rows.map(r => r.payload), next: rows.length === 100 ? rows.at(-1).id : null });
      }
      let batch;
      try { batch = await readBody(req); } catch { return json(res, 400, { message: 'Invalid or oversized JSON request' }); }
      if (!validateRecords(batch) || !batch.length || batch.length > 100 || !batch.every(r =>
        /^[a-zA-Z0-9-]{1,128}$/.test(r.id) && Buffer.byteLength(JSON.stringify(r)) <= 32000 &&
        typeof r.updatedAt === 'string' && r.updatedAt === new Date(r.updatedAt).toISOString()
      )) return json(res, 400, { message: 'Invalid records. Local data is retained.' });
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const canonical = [];
        // Sort lock acquisition consistently to avoid cross-device deadlocks.
        for (const row of [...batch].sort((a, b) => a.id.localeCompare(b.id))) {
          const payload = { id: row.id, type: row.type, date: row.date, data: row.data, updatedAt: row.updatedAt, deleted: row.deleted, dirty: false };
          await client.query(`INSERT INTO form_journal (user_id, id, payload, updated_at) VALUES ($1,$2,$3,$4)
            ON CONFLICT (user_id,id) DO UPDATE SET payload=EXCLUDED.payload, updated_at=EXCLUDED.updated_at
            WHERE EXCLUDED.updated_at > form_journal.updated_at`, [owner, row.id, payload, row.updatedAt]);
          const { rows } = await client.query('SELECT payload FROM form_journal WHERE user_id=$1 AND id=$2', [owner, row.id]);
          canonical.push(rows[0].payload);
        }
        await client.query('COMMIT');
        return json(res, 200, { records: canonical });
      } catch (err) { await client.query('ROLLBACK'); throw err; }
      finally { client.release(); }
    } catch {
      // Database errors can contain credentials and SQL; never send them to clients.
      return json(res, 503, { message: 'Cloud unavailable. Check server configuration and database migration; local records remain saved.' });
    }
  };
}
