import { getMigrations } from 'better-auth/db/migration';
import { getRuntime } from '../server/runtime.js';
// Schema work uses a direct connection; application traffic stays pooled.
const directURL = new URL(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);
directURL.hostname = directURL.hostname.replace(/-pooler(?=\.)/, '');
const { pool, auth } = getRuntime({ validateSchema: false, databaseURL: directURL.toString() });
try {
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
  await pool.query(`CREATE TABLE IF NOT EXISTS form_journal (
    user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    id text NOT NULL,
    payload jsonb NOT NULL,
    updated_at timestamptz NOT NULL,
    PRIMARY KEY (user_id, id)
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS form_pin_attempts (
    key text PRIMARY KEY, attempts integer NOT NULL, started_at timestamptz NOT NULL
  )`);
  console.log('Authentication and journal tables are ready.');
} catch { console.error('Migration failed. Check DATABASE_URL and database permissions.'); process.exitCode = 1; }
finally { await pool.end(); }
