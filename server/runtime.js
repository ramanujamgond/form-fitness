import { Pool } from 'pg';
import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';

let runtime;
export const isProduction = () => process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
export function configured(env = process.env) {
  return Boolean(env.DATABASE_URL && env.BETTER_AUTH_SECRET?.length >= 32 && env.BETTER_AUTH_URL && env.AUTH_ALLOWED_EMAIL);
}
export function getRuntime({ validateSchema = true } = {}) {
  if (runtime) return runtime;
  if (!configured()) throw Error('Cloud setup is incomplete. Set the server environment variables.');
  const origin = new URL(process.env.BETTER_AUTH_URL).origin;
  if (isProduction() && !origin.startsWith('https://')) throw Error('Production requires an HTTPS app URL.');
  const allowedEmail = process.env.AUTH_ALLOWED_EMAIL.trim().toLowerCase();
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2, idleTimeoutMillis: 10000, connectionTimeoutMillis: 15000 });
  pool.on('error', () => console.error('Database connection interrupted'));
  const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: origin,
    basePath: '/api/auth',
    trustedOrigins: [origin],
    // Bootstrap the owner locally before deployment; public signup is disabled.
    emailAndPassword: { enabled: true, minPasswordLength: 12, disableSignUp: isProduction() },
    advanced: { database: { validateSchema } },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 30 },
    databaseHooks: { user: { create: { before: async user => {
      if (user.email.toLowerCase() !== allowedEmail) throw new APIError('FORBIDDEN', { message: 'Account creation is restricted to the configured owner.' });
    } } } },
  });
  runtime = { pool, auth, origin, allowedEmail };
  return runtime;
}
