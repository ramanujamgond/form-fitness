# Neon + Vercel setup

This app uses an official Neon PostgreSQL project and Vercel for its static PWA and private Node.js API. Vercel's former Postgres product has been replaced by provider integrations, including Neon ([Vercel documentation](https://vercel.com/docs/postgres)). Creating Neon directly keeps database ownership independent of hosting. You may connect that same project through Vercel's Neon integration; do not create a second database.

Current local setup: Neon project `form-fitness` (`little-dream-41330857`), Singapore region, database `form_fitness`. Its connection and generated authentication secret are in the ignored `.env`, with owner email `ramanujamgond@gmail.com`. Authentication/journal tables have been created. Owner password creation and Vercel deployment remain to be completed; do not create another Neon project for this app.

Authentication runs on Vercel using [Better Auth with PostgreSQL](https://better-auth.com/docs/adapters/postgresql). You do not need a separate authentication account or Neon API key. This integration stores journal and authentication records, not exercise videos or images. Existing compressed images stay in the static deployment and videos stay on their publishers' sites.

## 1. Create Neon and fill local .env

In the [Neon console](https://console.neon.tech), create a project, choose a nearby region, and use its **Connect** dialog to copy the PostgreSQL connection string with connection pooling enabled. The pooled hostname contains `-pooler`. Use the complete connection string, including SSL settings. Keep it private.

Use the existing ignored `.env`, or copy `.env.example` if no `.env` exists. It contains:

| Variable | Local value | Vercel Production value | Private? |
| --- | --- | --- | --- |
| `DATABASE_URL` | Neon pooled PostgreSQL URL | Same database URL | Yes |
| `BETTER_AUTH_SECRET` | Generated random secret, at least 32 characters | Same secret | Yes |
| `BETTER_AUTH_URL` | `http://localhost:3000` | Your stable HTTPS app URL, e.g. `https://form-fitness.vercel.app` | No |
| `AUTH_ALLOWED_EMAIL` | Your sign-in email | Same email | Account configuration |

A secret has already been generated in the local `.env` during this implementation. If creating another environment, generate one with `openssl rand -base64 48`. Do not overwrite a configured `.env` or commit it. Keep these values out of `web/`. Environment values have no `VITE_`, `NEXT_PUBLIC_`, or other client-exposure prefix.

## 2. Initialize the database and create the owner

From the repository root with Node.js 22:

```sh
npm ci
npm run db:migrate
npm run dev
```

Migration adds Better Auth tables and `form_journal`, and is safe to rerun. It does not drop existing tables or journal rows. It connects to whatever `DATABASE_URL` specifies; check the target before running. Migrations are deliberately separate from builds.

Open `http://localhost:3000`, go to **Settings → Cloud connection**, enter your configured email and a password of at least 12 characters, select **Create my account (first time)**, then **Connect & sync**. Save the password securely. Public account creation is disabled in production, so create this owner locally before deployment. No email verification/reset service is configured; this is a private, single-owner app.

Once created, use **Sign in** on every other device. Database-backed rate limits apply to authentication. Changing `AUTH_ALLOWED_EMAIL` does not migrate an existing account: restore the configured owner email unless deliberately setting up a new owner/database.

## 3. Connect GitHub to Vercel

In your existing [Vercel account](https://vercel.com/new), import `ramanujamgond/form-fitness`. The Neon changes must first be pushed to the branch you intend to deploy.

Use these project settings:

| Setting | Value |
| --- | --- |
| Root directory | Repository root, not `web` |
| Framework | Other |
| Install | `npm ci` |
| Build | `npm run build` |
| Output directory | `web` |
| Node.js | 22.x |

`vercel.json` sets the build/output and routes `/api/auth/*` to the authentication function. Vercel deploys `api/` functions separately from static `web/`. Private source notes, reference photos, archived generated originals, tests, and local `.env` are excluded from upload through `.vercelignore`.

In the project's **Settings → Environment Variables**, add the four values from the table for **Production** ([Vercel instructions](https://vercel.com/docs/environment-variables)). Set `BETTER_AUTH_URL` to the stable production domain shown by Vercel, then redeploy. If the URL is not known yet, make the first deployment without cloud variables, copy its stable domain, add the variables, and redeploy. Logging works during the initial unconfigured deployment.

Set the desired Production Branch under Vercel's Git settings. For the current work, use `feature/visual-data-videos-equipment`, or merge it into `main` before choosing `main`.

Leave cloud variables unset in Preview deployments until a separate Neon branch/database and matching preview URL are configured. Preview deployments should not write production health records. The GitHub build/test workflow needs **no GitHub secrets**. Vercel's native Git integration handles deployments; the secrets belong in Vercel, not in the downloaded web artifact.

## 4. Move your data and install on mobile

Browser storage is isolated by origin. Before leaving the old localhost/Pages URL, open its Settings and **Export backup**. On the new Vercel URL, **Import backup** before signing in and syncing. Never clear the old site's data until the imported records and cloud sync are verified. Preferences are included in exported JSON but the current importer merges records only; set preferences and equipment again on each device.

On your phone, open the Vercel HTTPS URL in Chrome, sign in, tap **Sync now**, then menu → **Add to home screen / Install app**. On a second device, sign in to the same account and confirm records appear. Test logging in airplane mode and syncing after reconnecting. After deployment, the first PostgreSQL connection may take time while Neon wakes up.

The app always saves locally first. Session credentials use an HttpOnly cookie, API responses are never cached by the service worker, and database secrets never enter browser storage. Sign-out stops cloud access but preserves your local journal and owner binding. Keep private JSON backups; timestamp conflict resolution is not recovery history.

## Verification

```sh
npm test
npm run build
```

`tests/workout-browser.cjs` checks the mobile workout/offline flow using Playwright and Chrome. `FORM_TEST_URL=http://localhost:3000 node tests/workout-browser.cjs` uses the Node dev server.

`tests/cloud-browser.cjs` is a developer integration test: run only against an isolated PostgreSQL database with `AUTH_ALLOWED_EMAIL=owner@example.com`, migrated schema, and no existing owner account. It creates a test account and test records. Never run it against your actual Neon journal.

To diagnose setup, open `/api/config`: `configured: true` means required variables are present, not that a database connection or migration has succeeded. A 503 on sign-in/sync means to check Vercel environment scope, stable URL, Neon connection, and migrations. Server SQL/connection errors are not exposed to the browser.
