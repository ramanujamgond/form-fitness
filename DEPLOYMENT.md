# Neon + Vercel setup

This app uses an official Neon PostgreSQL project and Vercel for its static PWA and private Node.js API. Vercel's former Postgres product has been replaced by provider integrations, including Neon ([Vercel documentation](https://vercel.com/docs/postgres)). Creating Neon directly keeps database ownership independent of hosting. You may connect that same project through Vercel's Neon integration; do not create a second database.

Current local setup: Neon project `form-fitness` (`little-dream-41330857`), Singapore region, database `form_fitness`. Its connection and generated authentication secret are in the ignored `.env`, with owner email `ramanujamgond@gmail.com`. Authentication/journal tables have been created. Local Gmail SMTP authentication has been verified; Vercel deployment and real inbox delivery remain to be completed; do not create another Neon project for this app.

Authentication runs on Vercel using [Better Auth with PostgreSQL](https://better-auth.com/docs/adapters/postgresql). You do not need a separate authentication account or Neon API key. This integration stores journal and authentication records, not exercise videos or images. Existing compressed images stay in the static deployment and videos stay on their publishers' sites.

## 1. Create Neon and fill local .env

In the [Neon console](https://console.neon.tech), create a project, choose a nearby region, and use its **Connect** dialog to copy the PostgreSQL connection string with connection pooling enabled. The pooled hostname contains `-pooler`. Use the complete connection string, including SSL settings. Keep it private.

Use the existing ignored `.env`, or copy `.env.example` if no `.env` exists. It contains:

| Variable | Local value | Vercel Production value | Private? |
| --- | --- | --- | --- |
| `DATABASE_URL` | Neon pooled PostgreSQL URL | Same database URL | Yes |
| `BETTER_AUTH_SECRET` | Generated random secret, at least 32 characters | Same secret | Yes |
| `BETTER_AUTH_URL` | `http://localhost:3000` | Your stable HTTPS app URL, e.g. `https://form-fitness.vercel.app` | No |
| `AUTH_ALLOWED_EMAIL` | Original owner email, for claiming the old local journal | Same email | Account configuration |
| `SMTP_HOST` | `smtp.gmail.com` | Same host | No |
| `SMTP_PORT` | `587` (STARTTLS), or `465` (TLS) | Same port | No |
| `SMTP_USER` | Gmail address used for sending | Same address | Account configuration |
| `SMTP_PASS` | Gmail App Password | Same App Password | Yes |
| `EMAIL_FROM` | `FORM Fitness <your-app-email@gmail.com>` | Same sender | No |

A secret has already been generated in the local `.env` during this implementation. If creating another environment, generate one with `openssl rand -base64 48`. Do not overwrite a configured `.env` or commit it. Keep these values out of `web/`. Environment values have no `VITE_`, `NEXT_PUBLIC_`, or other client-exposure prefix.

## 2. Set up Gmail SMTP and initialize accounts

Better Auth handles accounts, sessions, verification and PIN recovery. Nodemailer delivers the links over Gmail SMTP. A purchased domain is not needed for this personal setup. Signup and recovery remain unavailable until all SMTP variables are configured.

1. Use a dedicated Gmail account for the app. Enable [2-Step Verification](https://myaccount.google.com/security), then generate an [App Password](https://myaccount.google.com/apppasswords) named FORM Fitness. App Passwords are unavailable for some protected or managed accounts; see [Google's instructions](https://support.google.com/accounts/answer/185833).
2. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER` to that Gmail address, and `SMTP_PASS` to the generated App Password without spaces in the ignored local `.env`. Set `EMAIL_FROM="FORM Fitness <that-same-address@gmail.com>"`. Do not paste the password in chat or commit it. Use the App Password rather than your normal Google password.
3. Restart the local dev server after changing `.env`. Add those five variables to Vercel Production environment variables and redeploy when production is ready. Gmail's App Password is a server secret; no GitHub secret is needed for Vercel's Git deployment.

Port 587 requires STARTTLS; port 465 uses immediate TLS. Certificate validation stays enabled. Email requests have bounded connection/socket timeouts. Gmail can block a new server login, and has [sending limits](https://support.google.com/mail/answer/22839). The app's configuration flag checks variables, not successful authentication or inbox delivery. Test real delivery from Vercel after deployment. Account links run through Better Auth's background-task handler, using Vercel `waitUntil`.

Verification and reset requests have a server-enforced 60-second cooldown per recipient and email type, shared across function instances. Verification is sent at signup; an unverified sign-in does not automatically send another email. Use **Verify email** to request another link. Per-IP request limits also apply. Delivery failures are logged without SMTP credentials or token URLs; users can retry after the cooldown. Successful SMTP submission does not guarantee inbox delivery.

From the repository root with Node.js 22:

```sh
npm ci
npm run db:migrate
npm run dev
```

Migration adds Better Auth tables, `form_journal` and `form_pin_attempts`. It is safe to rerun and does not drop existing journal rows. It uses `DATABASE_URL_UNPOOLED` if supplied, otherwise derives the direct Neon hostname from `DATABASE_URL`. Check the database target first. Migrations are deliberately separate from builds.

Open `http://localhost:3000`, go to **Settings → Create account**, enter name, email and a 6–12 digit PIN, and verify the email link. Then sign in. Experience, goals and measurements are optional; equipment begins as unknown and can be identified later with the picture guide. Your sister registers with her own email/PIN and receives a separate journal. Numeric PINs preserve leading zeroes.

PINs use Better Auth's salted hash. Account throttling allows five attempts per fifteen-minute window, with additional database-backed request limits. Verification links expire after one hour; reset links expire after fifteen minutes and can only be used once. Resetting a PIN revokes that account's existing sessions. An existing password account can switch to a numeric PIN using **Forgot PIN**; there is no need to delete its journal. Changing `AUTH_ALLOWED_EMAIL` changes who may claim the original local data, so retain the original email.

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

In the project's **Settings → Environment Variables**, add the values from the table for **Production** ([Vercel instructions](https://vercel.com/docs/environment-variables)). Set `BETTER_AUTH_URL` to the stable production domain shown by Vercel, then redeploy. If the URL is not known yet, make the first deployment without cloud variables, copy its stable domain, add the variables, and redeploy. Logging works during the initial unconfigured deployment.

Set the desired Production Branch under Vercel's Git settings. For the current work, use `feature/visual-data-videos-equipment`, or merge it into `main` before choosing `main`.

Leave cloud variables unset in Preview deployments until a separate Neon branch/database and matching preview URL are configured. Preview deployments should not write production health records. The GitHub build/test workflow needs **no GitHub secrets**. Vercel's native Git integration handles deployments; the secrets belong in Vercel, not in the downloaded web artifact.

## 4. Move your data and install on mobile

Browser storage is isolated by origin. Before leaving the old localhost/Pages URL, open its Settings and **Export backup**. On the new Vercel URL, register/verify/sign in as the original owner and **Import backup**, then sync. Version 2 backups include the account email and preferences; imports reject another account's backup. Version 1 backups are accepted by the configured original owner. Never clear the old site's data until the imported records and cloud sync are verified.

On your phone, open the Vercel HTTPS URL in Chrome, sign in, tap **Sync now**, then menu → **Add to home screen / Install app**. On a second device, sign in to the same account and confirm records and preferences appear. Test logging in airplane mode and syncing after reconnecting. After deployment, the first PostgreSQL connection may take time while Neon wakes up.

The app saves locally first. Session credentials use an HttpOnly cookie, API responses are never cached by the service worker, and database secrets never enter browser storage. Sign-out switches to a separate guest journal and preserves each account's local data. Offline sign-out is completed on the server on reconnect. Local journals and exported backups are not encrypted; a person with access to the same unlocked browser profile can inspect browser storage. Keep private JSON backups; timestamp conflict resolution is not recovery history.

## Optional GitHub Pages deployment

The full app uses Vercel: GitHub Pages only serves the static offline journal and cannot run the authentication, SMTP or Neon sync API. Keep Pages disabled when using Vercel alone. The Pages deployment job is skipped by default, including manual runs, so an unconfigured Pages site does not fail every merge to `main`. The build/test workflow still runs and uploads the static artifact.

If you want an additional offline-only Pages site:

1. In the repository's **Settings → Pages**, enable Pages with **Source: GitHub Actions**. Verify that your repository visibility and GitHub plan support Pages.
2. In **Settings → Secrets and variables → Actions → Variables**, create the repository variable `ENABLE_GITHUB_PAGES` with the value `true`. This is a non-secret repository variable, not an environment variable or secret.
3. Run **Deploy optional offline app to GitHub Pages** manually from Actions, or push a change to `main`.

If `actions/configure-pages` reports **Get Pages site failed / Not Found**, check the Pages setting and repository eligibility before retrying. Leave `ENABLE_GITHUB_PAGES` unset or set it to `false` to skip the optional deployment. Enabling the variable does not provision a Pages site or configure Vercel.

## Verification

```sh
npm test
npm run build
```

`tests/workout-browser.cjs` checks the mobile workout/offline flow using Playwright and Chrome. `FORM_TEST_URL=http://localhost:3000 node tests/workout-browser.cjs` uses the Node dev server.

`tests/cloud-server.mjs` and `tests/cloud-browser.cjs` are developer integration tests using a disposable PostgreSQL instance at `127.0.0.1:55432`, test owner `owner@example.com` and simulated SMTP transport. The harness refuses remote database connections and never sends real email. The test creates two accounts and exercises verification, PIN hashing, journal isolation, cross-device preferences, reset/session revocation, throttling and offline sign-out. Never point these tests at the real Neon journal.

To diagnose setup, open `/api/config`: `configured: true` means required variables are present, not that a database connection or migration has succeeded. `emailReady: true` only indicates email variables are present; it does not prove the SMTP credentials work or that emails reach an inbox. A 503 on sign-in/sync means to check Vercel environment scope, stable URL, Neon connection, and migrations. Server SQL/connection errors are not exposed to the browser.
