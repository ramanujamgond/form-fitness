import { createHmac } from 'node:crypto';
import { APIError, createAuthMiddleware } from 'better-auth/api';
export const validPin = value => typeof value === 'string' && /^\d{6,12}$/.test(value);
const keyFor = (email, secret) => createHmac('sha256', secret).update(email.trim().toLowerCase()).digest('hex');
export const clearPinAttempts = (pool,email,secret) => pool.query('DELETE FROM form_pin_attempts WHERE key=$1', [keyFor(email,secret)]);
export function pinHooks(pool, secret, mailReady) {
  return {
    before: createAuthMiddleware(async ctx => {
      if (['/sign-up/email','/request-password-reset','/send-verification-email'].includes(ctx.path) && !mailReady()) {
        throw new APIError('SERVICE_UNAVAILABLE', { message: 'Verification and PIN recovery are not ready yet. Email delivery needs setup.' });
      }
      const pin = ['/sign-up/email','/sign-in/email'].includes(ctx.path) ? ctx.body?.password :
        ['/reset-password','/change-password','/set-password'].includes(ctx.path) ? ctx.body?.newPassword : undefined;
      if (pin !== undefined && !validPin(pin)) throw new APIError('BAD_REQUEST', { message: 'Use a PIN with 6–12 digits.' });
      if (['/sign-up/email','/send-verification-email','/request-password-reset'].includes(ctx.path) && typeof ctx.body?.email === 'string') {
        const kind = ctx.path === '/request-password-reset' ? 'reset' : 'verify';
        const key = 'mail:' + kind + ':' + keyFor(ctx.body.email, secret);
        const { rows } = await pool.query(`INSERT INTO form_pin_attempts (key, attempts, started_at) VALUES ($1,1,now())
          ON CONFLICT (key) DO UPDATE SET attempts=1, started_at=now()
          WHERE form_pin_attempts.started_at < now()-interval '60 seconds'
          RETURNING key`, [key]);
        if (!rows.length) throw new APIError('TOO_MANY_REQUESTS', { message: 'Wait 60 seconds before requesting another email link.' });
      }
      if (ctx.path !== '/sign-in/email' || typeof ctx.body?.email !== 'string') return;
      const key = keyFor(ctx.body.email, secret);
      // Atomic per-account throttle applies across IPs and function instances.
      const { rows } = await pool.query(`INSERT INTO form_pin_attempts (key, attempts, started_at) VALUES ($1,1,now())
        ON CONFLICT (key) DO UPDATE SET
          attempts=CASE WHEN form_pin_attempts.started_at < now()-interval '15 minutes' THEN 1 ELSE form_pin_attempts.attempts+1 END,
          started_at=CASE WHEN form_pin_attempts.started_at < now()-interval '15 minutes' THEN now() ELSE form_pin_attempts.started_at END
        RETURNING attempts`, [key]);
      if (rows[0].attempts > 5) throw new APIError('TOO_MANY_REQUESTS', { message: 'Too many PIN attempts. Wait 15 minutes or reset your PIN by email.' });
    }),
    after: createAuthMiddleware(async ctx => {
      if (ctx.path === '/sign-in/email' && ctx.context.newSession && ctx.body?.email) {
        await pool.query('DELETE FROM form_pin_attempts WHERE key=$1', [keyFor(ctx.body.email, secret)]);
      }
    }),
  };
}
