// Credentials stay on the server. Google must verify the matching email before linking.
export function googleConfigured(env = process.env) {
  return Boolean(env.GOOGLE_CLIENT_ID?.trim() && env.GOOGLE_CLIENT_SECRET?.trim());
}
export function googleAuthOptions(env = process.env) {
  return {
    socialProviders: googleConfigured(env) ? {
      google: { clientId: env.GOOGLE_CLIENT_ID.trim(), clientSecret: env.GOOGLE_CLIENT_SECRET.trim(), prompt: 'select_account' },
    } : {},
    account: { accountLinking: {
      enabled: true, disableImplicitLinking: false, trustedProviders: [],
      requireLocalEmailVerified: true, allowDifferentEmails: false, updateUserInfoOnLink: false,
    } },
  };
}
