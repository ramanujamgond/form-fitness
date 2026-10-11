# FORM — personal training journal

A mobile-first PWA with a dependency-free browser app. Choose 1–7 weekly activity days. The default is four foundation strength sessions, one light cardio day and two recovery days. Six- and seven-day choices add easy activity, with active recovery on the seventh day. Local IndexedDB saves workouts, food, measurements and optional pelvic-floor practice. No personal source documents are deployed.

## Run locally and deploy

Use Node.js 22. The browser app remains dependency-free; PostgreSQL and authentication dependencies run only on the server.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Offline logging works without database credentials. For cloud sync, follow [DEPLOYMENT.md](DEPLOYMENT.md): official Neon PostgreSQL, Vercel Functions, cookie-based Better Auth sign-in, and Vercel GitHub deployment. The ignored `.env` holds local server credentials; `.env.example` lists the required values. No secret is sent to the browser or included in GitHub build artifacts.

```sh
npm test
npm run build
npm run db:migrate # only after DATABASE_URL points at your intended database
```

Accounts use name, email and a 6–12 digit PIN. Verification is required before sign-in; recovery sends a one-time email link. PINs are salted hashes through Better Auth, never stored in plaintext. Set up Gmail SMTP with an App Password before enabling signup; see [DEPLOYMENT.md](DEPLOYMENT.md). Experience and equipment are optional: new users start with a beginner profile and unknown equipment, and can skip onboarding.

Each verified account has its own server journal and local IndexedDB database. Workouts, meals, measurements, profile preferences and equipment choices sync on sign-in, online saves, reconnect, resume, and every three minutes while the visible app has queued changes. App-closed timing is not guaranteed. Only the original email in `AUTH_ALLOWED_EMAIL` can claim the original local journal. It does not restrict signup for other users. Export a backup before changing app URLs: browser storage belongs to the URL and does not automatically move from localhost or GitHub Pages to Vercel.

Deletions are tombstones. Conflicts use the latest record timestamp, rather than field-level merging; accurate device clocks matter. The API derives ownership from the verified session and rejects uploads from a stale account tab. Sign-out switches to a separate guest journal and keeps the account's local records for later sign-in. Local storage is not encrypted; use separate device/browser profiles when sharing an unlocked device. Sync does not replace private recovery backups.

GitHub Actions runs tests/build on pushes and pull requests and publishes `form-offline-web` as a downloadable static artifact. Vercel deploys from GitHub using `vercel.json`. No GitHub secrets are required for this route; add server variables to the Vercel project. The Pages workflow is an optional offline-only deployment of `web/`; it cannot host signup, email recovery or the sync API. It skips deployment unless the repository Actions variable `ENABLE_GITHUB_PAGES` is set to `true`. See [DEPLOYMENT.md](DEPLOYMENT.md) for setup before enabling it.

On Android Chrome, open the HTTPS Vercel URL, let resources load, then choose menu → Add to home screen / Install. A plain HTTP LAN address will not enable offline installation. Videos remain online-only.

## What is included

- Today dashboard and recovery check-in
- Calendar with selectable past dates and next-week ICS export
- Workout sets, effort/form/symptom notes, cardio and optional exercises
- Rest timer with best-effort active-screen vibration/sound
- 14 compressed Nano Banana exercise illustrations, credited original demonstration previews and exercise instructions
- Verified demonstration video links for every exercise; embeds load after a tap
- Meal estimates, custom meals, protein totals
- Measurement charts, exercise history, conservative progression guidance
- Optional pelvic-floor education/logging toggle
- Offline asset cache, durable-storage request, JSON export/import
- Optional authenticated Neon cloud sync with server-enforced account isolation

## Deliberate limitations

Scheduled push reminders require an additional server scheduler and are not implemented. Use calendar reminders or phone Clock alarms. No automatic camera counts, wearable import, meal recognition, offline videos, progress photos or statistical recovery model. Generated illustrations supplement the real demonstrations; machine models and settings vary. Meal estimates are illustrative; oil, recipes and portions vary. Raw weight/waist points are shown rather than smoothed trends. Equipment must be confirmed; generic machine cards do not imply it exists in your gym. The default routine is conservative foundation programming. A manual stage setting changes working sets from two to three; it does not assess readiness or generate advanced periodization. Choose weekly activity frequency in onboarding or Settings. Frequency changes apply from today and preserve earlier plans. Calendar supports single skipped days and date-range breaks for travel, work or rest, with cancellation. Completed workouts remain saved. The normal weekly schedule resumes after a break; missed sessions are not queued. Calendar previews, reports and exports use the selected schedule. Day-plan overrides remain available for individual adjustments.

Recurring elbow/wrist tingling needs assessment. Do not progress through symptoms. Pelvic-floor training is optional and suitability should be checked with a health professional. Source links are in app Settings.

## Updates and checks

After changing app files, bump the cache version in `web/sw.js`. An update waits until existing tabs close, avoiding abrupt replacement during a workout. Check JavaScript syntax with `node --check web/app.js` (and other JS files). Run meaningful record merge/validation tests with `node --test tests/store.test.mjs`.

Before real use, verify on the S24: installation, offline reload/logging, reconnect sync, sound/vibration, export/import, and account isolation. Cloud end-to-end checks require a PostgreSQL database and migrated schema; see DEPLOYMENT.md.

## Work-in-progress resources

- `docs/`: original fitness notes and reference guides, preserved in full.
- `designImg/`: original design inspiration images.
- `resources/previews/`: screenshots of the app during development.
- `DESIGN.md`: current design system.
- `EXERCISE-GUIDE.md`: current exercise plan and reference sources.
- `web/`: deployable app; GitHub Pages publishes only this directory.
- `tests/`: storage and backup checks.

Original reference guides can contain earlier recommendations; the current app and exercise guide describe the active plan. The source docs include personal fitness information; repository visibility controls who can read them.

## Exercise media and navigation · 10 October 2026

Every exercise has a local WebP illustration (800 px maximum width), an original JPEG preview from its demonstration publisher, a video link and technique steps. All 14 illustrations total approximately 306 KiB; the deployable `web/` folder is approximately 1.2 MiB. Original generation files and prompts are archived under `resources/`, outside the deployed folder. Video previews remain credited to their publishers and are embedded remotely, not relicensed. Wikimedia photo endpoints returned 403 during the new audit, so matching video previews are used for exercise references instead.

Workout guides open by default. Session buttons and previous/next exercise controls jump to the appropriate card. Back, Today and Calendar controls complement the main navigation. URL routes retain the selected day and Learn section across reloads; browser back restores prior routes. Two dead-bug sets remain on both lower-body days, with progression through controlled reps, reach length and opposite-arm movement rather than a calendar deadline.

Generated illustrations and text work offline after installation. Original previews cache only after viewing, with at most 32 cached images. Videos require internet; provider embedding or regional restrictions may require opening YouTube directly. Metadata and JPEG endpoint availability were verified, but endpoint checks do not guarantee video playback on every device.

Verification: `node --test tests/store.test.mjs`, JavaScript syntax checks, and `node tests/workout-browser.cjs` (requires Playwright and installed Chrome). Browser checks cover day plans, visible guides, exercise jumps, set persistence, browser back, reload, mobile width and offline illustrations. `resources/media-audit.json` records the reference audit; `resources/generation-provenance.json` and `generation-corrections.json` retain prompts and models.

## Flexible weekly schedule

In onboarding or Settings, choose **Activity days per week** (1–7). One to three days use full-body sessions; four uses upper/lower strength sessions; five adds easy cardio; six adds a second easy day; seven adds active recovery. For the seventh day, relaxed walking/mobility is optional and full rest is always available. Lower-body and full-body sessions retain core work. These are conservative templates, not an automatic readiness assessment.

Use **Skip this day** from Today, Train or Calendar for a single missed session. In Calendar, **Plan time off** accepts an inclusive date range (up to one year) and a reason. Cancel a range or undo a single skip to restore the plan. Overlapping breaks continue to apply until removed, and already completed workouts remain completed. After a break, the normal weekly schedule resumes without moving missed sessions into a backlog.

Frequency history, skipped sessions and planned breaks are saved locally, included in backups and synced within the user's account. Changes in weekly frequency apply from today; prior dates keep their earlier frequency. New break ranges start today or later; Calendar's single-day skip can record a past missed session. Calendar export reflects day overrides and planned breaks. Re-export calendar events after schedule changes; existing imported phone-calendar events do not update automatically.

Verification: `npm test`, `npm run build`, and `node tests/schedule-browser.cjs` using Playwright/Chrome and the local dev server. Schedule browser checks use a separate browser profile and create no real accounts or emails.
