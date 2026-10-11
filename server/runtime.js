import { Pool } from 'pg';
import { betterAuth } from 'better-auth';
import { waitUntil, attachDatabasePool } from '@vercel/functions';
import { emailConfigured, sendAccountEmail } from './email.js';
import { pinHooks, clearPinAttempts } from './pin.js';

let runtime;
export const isProduction = () => process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
export function configured(env = process.env) {
  return Boolean(env.DATABASE_URL && env.BETTER_AUTH_SECRET?.length >= 32 && env.BETTER_AUTH_URL);
}
export function getRuntime({ validateSchema = true, databaseURL = process.env.DATABASE_URL } = {}) {
  if (runtime) return runtime;
  if (!configured()) throw Error('Cloud setup is incomplete. Set the server environment variables.');
  const origin = new URL(process.env.BETTER_AUTH_URL).origin;
  if (isProduction() && !origin.startsWith('https://')) throw Error('Production requires an HTTPS app URL.');
  // Used only to claim the original local journal, never to restrict new accounts.
  const legacyEmail = (process.env.AUTH_ALLOWED_EMAIL || '').trim().toLowerCase();
  const pool = new Pool({ connectionString: databaseURL, max: 2, idleTimeoutMillis: 10000, connectionTimeoutMillis: 15000 });
  pool.on('error', () => console.error('Database connection interrupted'));
  if (process.env.VERCEL === '1') attachDatabasePool(pool);
  const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: origin,
    basePath: '/api/auth',
    trustedOrigins: [origin],
    emailAndPassword: {
      enabled: true, minPasswordLength: 6, maxPasswordLength: 128,
      requireEmailVerification: true, autoSignIn: false,
      resetPasswordTokenExpiresIn: 900, revokeSessionsOnPasswordReset: true,
      sendResetPassword: ({ user, url }) => sendAccountEmail({ to:user.email, url, kind:'reset' }),
      onPasswordReset: ({ user }) => clearPinAttempts(pool,user.email,process.env.BETTER_AUTH_SECRET),
    },
    emailVerification: {
      sendOnSignUp: true, sendOnSignIn: false, autoSignInAfterVerification: false, expiresIn: 3600,
      sendVerificationEmail: ({ user, url }) => sendAccountEmail({ to:user.email, url, kind:'verify' }),
    },
    advanced: {
      database: { validateSchema },
      backgroundTasks: { handler: promise => process.env.VERCEL === '1' ? waitUntil(promise) : void promise.catch(() => console.error('Account email delivery failed')) },
    },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 30, customRules: {
      '/sign-in/email': {window:60,max:30},
      '/send-verification-email': {window:60,max:5},
      '/request-password-reset': {window:60,max:5},
    } },
    hooks: pinHooks(pool, process.env.BETTER_AUTH_SECRET, emailConfigured),
  });
  runtime = { pool, auth, origin, legacyEmail };
  return runtime;
}
