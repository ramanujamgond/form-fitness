# FORM — personal training journal

A dependency-free, mobile-first PWA. Five activity days: four foundation strength sessions, one light cardio day, two recovery days. Local IndexedDB saves workouts, food, measurements and optional pelvic-floor practice. No personal source documents are deployed.

## Run locally

From this folder:

```sh
python3 -m http.server 8080 --directory web
```

Open http://localhost:8080. Offline service workers need HTTPS or localhost. A plain HTTP LAN address on your phone will not enable offline installation; use the HTTPS deployed site for S24 testing.

## GitHub Pages

Create a public repository containing `web/`, `.github/`, this README and the SQL setup. Do **not** upload `docs/`: it contains personal training notes and photographs. No repository has been created or uploaded by this implementation.

Use `main` as the branch. In GitHub Settings → Pages, select **GitHub Actions** as the source. The supplied workflow deploys **only `web/`**, works at a repository subpath, and needs no npm build. This app uses browser-native JavaScript modules; GitHub assembles/publishes the already deployable files.

On S24 Chrome, open the HTTPS site, let the initial resources load, then choose menu → Add to home screen / Install. Test airplane mode only after that initial load. 192/512 PNG manifest icons are included.

## Free Supabase cloud connection

1. Create your own free Supabase project.
2. Run `supabase-setup.sql` in its SQL Editor.
3. Create a user under Authentication → Users; use a strong password and confirm the account as appropriate.
4. In app Settings, enter the project HTTPS URL and public anon/publishable key. Never use a secret/service-role key.
5. Sign in, log a record, tap Sync now. Verify a row appears in `journal`.
6. Test with a second account: it must not be able to read the first user's rows. Client account binding also prevents accidentally syncing this device's journal to another account.

Records sync on sign-in, online saves, reconnect, resume, and every three minutes while the visible app has queued changes. App-closed timing is not guaranteed. Sign-in credentials are stored in sessionStorage; sign in again when the browser session ends. Public project configuration remains in localStorage. Profile preferences are local and are included in exports but are not cloud synced.

Each record has a UUID and timestamp. Deletions are tombstones. Import merges records rather than replacing history. Server-side updates preserve newer timestamps, avoiding a stale-device overwrite. Conflicting edits to the same record use latest timestamp, not field-level reconciliation; accurate device clocks matter. Records can be added independently on multiple devices. Do not share the browser profile with others.

Cloud sync is not a historical recovery backup. Free Supabase projects may pause; regularly export a JSON backup and store it privately. Limits and free-service availability can change. No paid service or automatic upgrade is configured.

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
- Optional authenticated cloud sync with database row-level security

## Deliberate limitations

Scheduled push reminders require an additional server scheduler and are not implemented. Use calendar reminders or phone Clock alarms. No automatic camera counts, wearable import, meal recognition, offline videos, progress photos or statistical recovery model. Generated illustrations supplement the real demonstrations; machine models and settings vary. Meal estimates are illustrative; oil, recipes and portions vary. Raw weight/waist points are shown rather than smoothed trends. Equipment must be confirmed; generic machine cards do not imply it exists in your gym. The default routine is conservative foundation programming. A manual stage setting changes working sets from two to three; it does not assess readiness or generate advanced periodization. Calendar day overrides let you move sessions around travel.

Recurring elbow/wrist tingling needs assessment. Do not progress through symptoms. Pelvic-floor training is optional and suitability should be checked with a health professional. Source links are in app Settings.

## Updates and checks

After changing app files, bump the cache version in `web/sw.js`. An update waits until existing tabs close, avoiding abrupt replacement during a workout. Check JavaScript syntax with `node --check web/app.js` (and other JS files). Run meaningful record merge/validation tests with `node --test tests/store.test.mjs`.

Before real use, verify on the S24: installation, offline reload/logging, reconnect sync, sound/vibration, export/import, and account isolation. Cloud end-to-end checks require your project credentials and SQL setup.

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
