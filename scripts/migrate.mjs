import { getMigrations } from 'better-auth/db/migration';
import { getRuntime } from '../server/runtime.js';
const { pool, auth } = getRuntime({ validateSchema: false });
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
  console.log('Authentication and journal tables are ready.');
} catch { console.error('Migration failed. Check DATABASE_URL and database permissions.'); process.exitCode = 1; }
finally { await pool.end(); }
