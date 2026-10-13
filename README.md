# Stride — personal training journal

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

Accounts use name, email and a 6–12 digit PIN. Verification is required before sign-in; recovery sends a one-time email link. PINs are salted hashes through Better Auth, never stored in plaintext. Set up Gmail SMTP with an App Password before enabling signup; see [DEPLOYMENT.md](DEPLOYMENT.md). The beginner guide is the first journal screen. There is no training preference questionnaire or manual stage picker. Existing users see the new guide once; optional scheduling and body details remain under More.

Each verified account has its own server journal and local IndexedDB database. Workouts, meals, measurements, profile preferences and equipment choices sync on sign-in, online saves, reconnect, resume, and every three minutes while the visible app has queued changes. App-closed timing is not guaranteed. Only the original email in `AUTH_ALLOWED_EMAIL` can claim the original local journal. It does not restrict signup for other users. Export a backup before changing app URLs: browser storage belongs to the URL and does not automatically move from localhost or GitHub Pages to Vercel.

Deletions are tombstones. Conflicts use the latest record timestamp, rather than field-level merging; accurate device clocks matter. The API derives ownership from the verified session and rejects uploads from a stale account tab. Sign-out switches to a separate guest journal and keeps the account's local records for later sign-in. Local storage is not encrypted; use separate device/browser profiles when sharing an unlocked device. Sync does not replace private recovery backups.

GitHub Actions runs tests/build on pushes and pull requests and publishes `form-offline-web` as a downloadable static artifact. Vercel deploys from GitHub using `vercel.json`. No GitHub secrets are required for this route; add server variables to the Vercel project. The Pages workflow is an optional offline-only deployment of `web/`; it cannot host signup, email recovery or the sync API. It skips deployment unless the repository Actions variable `ENABLE_GITHUB_PAGES` is set to `true`. See [DEPLOYMENT.md](DEPLOYMENT.md) for setup before enabling it.

Open the public HTTPS URL directly in Chrome on Android or Safari on iPhone, rather than inside another app’s browser. Under More, the home-screen card offers Install Stride when the browser provides an install prompt, or How to install with device-specific instructions. Android: Chrome menu → Add to home screen / Install app. iPhone: Safari → Share → Add to Home Screen → Open as Web App (if offered) → Add; use Edit Actions if Add to Home Screen is missing. A plain HTTP LAN address will not enable PWA installation or offline caching. Let the app finish loading before testing offline. Videos remain online-only.

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

Scheduled push reminders require an additional server scheduler and are not implemented. Use calendar reminders or phone Clock alarms. No automatic camera counts, wearable import, meal recognition, offline videos, progress photos or statistical recovery model. Generated illustrations supplement the real demonstrations; machine models and settings vary. Meal estimates are illustrative; oil, recipes and portions vary. Raw weight/waist points are shown rather than smoothed trends. Equipment must be confirmed; generic machine cards do not imply it exists in your gym. The default routine is conservative foundation programming. Learning stages are derived from recorded sessions. Building adds a third working set; later learning stages retain the same routine rather than generating advanced periodization. Choose weekly activity frequency under More. Frequency changes apply from today and preserve earlier plans. Calendar supports single skipped days and date-range breaks for travel, work or rest, with cancellation. Completed workouts remain saved. The normal weekly schedule resumes after a break; missed sessions are not queued. Calendar previews, reports and exports use the selected schedule. Day-plan overrides remain available for individual adjustments.

Recurring elbow/wrist tingling needs assessment. Do not progress through symptoms. Pelvic-floor training is optional and suitability should be checked with a health professional. Source links are in app Settings.

## Updates and checks

After changing app files, bump the cache version in `web/sw.js`. Production updates offer an explicit Update app action so users can save unfinished forms first. Localhost activates the new worker after its assets cache successfully. Every browser module dependency carries the same release version to prevent mixed old/new modules. Check JavaScript syntax with `node --check web/app.js` (and other JS files). Run meaningful record merge/validation tests with `node --test tests/store.test.mjs`.

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

The active exercise guide opens before its first working set and collapses after a set is recorded. Guided workouts show one movement at a time; later movements open after all required sets or an explicit skip reason. Back, Today and Calendar controls complement the main navigation. URL routes retain the selected day and Learn section across reloads; browser back restores prior routes. Two dead-bug sets remain on both lower-body days, with progression through controlled reps, reach length and opposite-arm movement rather than a calendar deadline.

Generated illustrations and text work offline after installation. Original previews cache only after viewing, with at most 32 cached images. Videos require internet; provider embedding or regional restrictions may require opening YouTube directly. Metadata and JPEG endpoint availability were verified, but endpoint checks do not guarantee video playback on every device.

Verification: `node --test tests/store.test.mjs`, JavaScript syntax checks, and `node tests/workout-browser.cjs` (requires Playwright and installed Chrome). Browser checks cover day plans, visible guides, exercise jumps, set persistence, browser back, reload, mobile width and offline illustrations. `resources/media-audit.json` records the reference audit; `resources/generation-provenance.json` and `generation-corrections.json` retain prompts and models.

## Flexible weekly schedule

Under More, you can adjust **Activity days per week** (1–7). One to three days use full-body sessions; four uses upper/lower strength sessions; five adds easy cardio; six adds a second easy day; seven adds active recovery. For the seventh day, relaxed walking/mobility is optional and full rest is always available. Lower-body and full-body sessions retain core work. These are conservative templates, not an automatic readiness assessment.

Use **Skip this day** from Today, Train or Calendar for a single missed session. In Calendar, **Plan time off** accepts an inclusive date range (up to one year) and a reason. Cancel a range or undo a single skip to restore the plan. Overlapping breaks continue to apply until removed, and already completed workouts remain completed. After a break, the normal weekly schedule resumes without moving missed sessions into a backlog.

Frequency history, skipped sessions and planned breaks are saved locally, included in backups and synced within the user's account. Changes in weekly frequency apply from today; prior dates keep their earlier frequency. New break ranges start today or later; Calendar's single-day skip can record a past missed session. Calendar export reflects day overrides and planned breaks. Re-export calendar events after schedule changes; existing imported phone-calendar events do not update automatically.

Verification: `npm test`, `npm run build`, and `node tests/schedule-browser.cjs` using Playwright/Chrome and the local dev server. Schedule browser checks use a separate browser profile and create no real accounts or emails.

## Beginner journey · 12 October 2026

The first journal screen explains reps, sets, rest, workout logging, meals and recovery, without asking users to choose an experience level or training goal. Today shows the next action. The bottom navigation is Today, Train, Food, Progress and More; Learn and Calendar remain available from More and contextual links.

Train uses separate screens for each of five warm-up movements → exercise equipment/setup → one working set → saved-set confirmation and timed rest → next set/exercise → two cooldown movements → review and finish. The first warm-up opens immediately from Start today’s session; the routine name is secondary context. Warm-up index, setup confirmations, rest acknowledgement, cooldown index, exercise order, stage, skips and substitutions are stored on the day’s session record. Each working set stores its rest deadline for reloads. The next step unlocks after the rest interval, and remains an explicit user action. Warm-up/cooldown Done buttons are self-reported completions; their optional timers do not infer that the user performed a movement. Partial sessions do not count as complete. Pain or tingling stops that movement’s logger, including when reported on its final set; recording a stop reason opens the next movement. Alternatives replace an unstarted slot and preserve the session plan. Undoing a set or skip reopens the session. Future days are previews; recovery days offer rest and meals.

Foundation → Building → Intermediate → Advanced are learning milestones based on 6, 18 and 36 consecutive qualifying recorded strength sessions. Qualification requires all planned sets, controlled technique, at least two reps in reserve, no symptoms or exercise skips, and a same-day good-energy check-in with at least seven hours’ sleep. Nonqualifying completed sessions reset the streak, while earned learning stages remain. These are product rules for recorded consistency, not a clinical assessment or automatic load prescription. Existing sessions without journey metadata remain in history but do not establish readiness. Session snapshots preserve the working-set goal during a workout.

Food asks dietary needs when first opened, then shows breakfast at 08:00, lunch at 13:00, a snack at 16:30 and dinner at 19:30. Times, foods, portions and nutrition estimates are editable for each logged meal. Bhubaneswar meal options include chuda/dahi, cooked moong ghugni, rice with dalma and saaga, machha jhola, plain chhena, roasted chana with seasonal fruit, and roti/rice with dal and santula. Each suggestion explains its protein and fibre sources, household portions, and swaps. Vegetarian/vegan choices and basic ingredient matching filter options. Choices are saved per day and meal slot; an empty matching list asks the user to record their own suitable meal. This does not validate every allergen or recipe. Suggestions are illustrative and are not a prescribed calorie target. Slot/time fields stay in existing food records and travel through the normal journal backup/sync paths.

Verification: `npm test`, `npm run build`, `node tests/workout-browser.cjs`, `node tests/schedule-browser.cjs`, `node tests/training-media-browser.cjs` and `node tests/auth-startup-browser.cjs`. Browser checks use isolated guest journals and mocked account configuration; they do not create real accounts or send email. The database-dependent cloud test was updated for the new guide but requires its disposable PostgreSQL test server.

Warm-up content follows the NHS six-minute warm-up guide: https://www.nhs.uk/live-well/exercise/how-to-warm-up-before-exercising/. An Indian trainer’s full-body warm-up reference (Nirbhay Pandey) is linked in each warm-up screen, clearly labelled as a routine with variations. Photorealistic Nano Banana teaching images replace all coach line-art SVGs and work offline. The cooldown offers easy walking and a supported calf stretch; the stretch reference is https://www.nhs.uk/live-well/exercise/how-to-stretch-after-exercising/. Working exercises retain their previously audited illustrations and publisher videos. Video playback requires internet and provider availability.

Local food-group guidance uses ICMR–NIN’s Dietary Guidelines for Indians (https://www.nin.res.in/dietaryguidelines2024.html); Odia dish context comes from Odisha Tourism (https://odishatourism.gov.in/en/cuisine-culinary-trails). Household portions and nutrition estimates are examples; they are not individualized prescriptions or a verified nutrient analysis of a particular recipe.

## Media correction · Indian creator references

All warm-up and calf-stretch teaching images are Nano Banana MCP outputs; six compressed WebP assets ship in `web/img/coach/`. Cooldown walking reuses the existing Nano Banana walking image. Generated originals and prompt provenance are in `resources/coach-media/`. They are AI-generated teaching references, not photographs of a real trainer or a substitute for the demonstration. No exercise line-art image is loaded by the coaching screens. UI icons and data charts remain vector graphics.

Exercise and equipment videos now use Indian fitness creators/channels including Jeet Selal (Himalayan Stallion Academy), Yatinder Singh, Cult Fit, Nirbhay Pandey and cultstore. The calf stretch links an Indian physiotherapy demonstration. `resources/indian-video-audit.json` stores primary YouTube title, author, description and playability metadata. Variations are labelled: the squat reference is an air squat, the seated-curl and assisted-pull-up references show Jerai machine examples, with separately labelled Jeet Selal lying-curl and Nirbhay Pandey pull-up-progression links. Combo-machine movements and settings are explained so users do not mistake leg extensions or dips for the planned exercise. Users follow their saved app plan, rather than adopting every exercise in a multi-exercise video. Video availability can vary by device and region.

Workout choices now offer a suggested plan rather than blank rep/load fields. Choose 1–3 working sets before the first save; that saved count controls the exercise sequence across reloads. Reps and loads are selected, carried to subsequent sets, and recorded only after confirming completion. Machine kg are explicitly starting trials, with lightest-setting and most-assistance options when no numeric load is known. Those settings remain nonnumeric in the journal. Optional technique/effort feedback defaults to unknown and cannot qualify a session for stage advancement; a shortened plan also does not lower the progression requirements. Starting-load suggestions can reuse prior controlled, symptom-free records, with a same-equipment reminder.

### Beginner UX refinement

Workout choices show a small relevant shortlist and reveal the full list through More options. A fixed primary action sits above the bottom navigation with content clearance for keyboard focus. All 13 strength movements use inspected Nano Banana start/end photo pairs; source PNGs and prompts are in resources/coach-media, while compressed WebP assets are cached for offline use. Optional controlled/hard/unsure feedback records only explicit self-reports. Progress explains missing technique and recovery checks and hides empty chart collections. Workout drafts are kept in per-tab session storage, isolated by account/date/exercise/set, and cleared after recording that set. They survive navigation and reload within that tab; closing the tab can discard an unfinished draft. Today offers one exact resume action. Food shows labelled vegetarian local examples immediately, with dietary switches and allergy settings available. More groups learning, schedule, account and backup; storage and sync messages use plain language.

## Total workout session time

Start warm-up starts the total session clock and saves the start date/time on that day’s workout. Browsing Train does not start it. The clock remains visible across app screens and includes warm-up, exercise, rest, cooldown and time away from the app. It calculates elapsed time from saved timestamps, so reloading, going offline or locking the phone does not reset it. Finish session & save workout saves the end timestamp and duration; Stop for today also closes the clock while retaining a stopped session’s timing. Progress shows the start/end times and total duration. No pause control is provided. Changing the device clock can affect the elapsed duration. Older workouts without timestamps show no inferred duration. Editing or undoing a finished session retains its original timing. Timing fields use the existing journal backup and account-sync paths.
