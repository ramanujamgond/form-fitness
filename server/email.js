import nodemailer from 'nodemailer';
export function emailConfigured(env = process.env) {
  return Boolean(env.SMTP_HOST?.trim() && ['465','587'].includes(String(env.SMTP_PORT)) && env.SMTP_USER?.trim() && env.SMTP_PASS?.trim() && env.EMAIL_FROM?.trim());
}
export function emailTransport(env = process.env, createTransport = nodemailer.createTransport) {
  if (!emailConfigured(env)) throw Error('Account email delivery is not configured.');
  const port = Number(env.SMTP_PORT);
  return createTransport({
    host: env.SMTP_HOST.trim(), port, secure: port === 465, requireTLS: true,
    auth: { user: env.SMTP_USER.trim(), pass: env.SMTP_PASS },
    connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true,
  });
}
export async function sendAccountEmail({ to, url, kind }, { env = process.env, createTransport = nodemailer.createTransport } = {}) {
  const transport = emailTransport(env, createTransport);
  const reset = kind === 'reset';
  const subject = reset ? 'Reset your FORM PIN' : 'Verify your FORM email';
  const text = `${reset ? 'Choose a new PIN' : 'Verify your email to sign in'} using this link:\n\n${url}\n\nThis link expires in ${reset ? '15 minutes' : '1 hour'}. If you did not request it, ignore this email.`;
  try {
    const result = await transport.sendMail({ from: env.EMAIL_FROM, to: [to], subject, text });
    if (!result.accepted?.length || result.rejected?.length) throw Error('Recipient rejected');
  } catch {
    throw Error('Account email delivery failed. Check the SMTP account and App Password.');
  } finally { transport.close(); }
}
