# Stride — flat minimal design guide

Reference direction: `designImg/image copy 2.png`, `image copy 3.png`, and `image copy 4.png`. Copies 2–3 inform the white surfaces, purple interaction color, quiet borders, simple lists and selected calendar dates. Copy 4 informs the compact training hierarchy, seven-day strip, set tables and concise progress summaries. These references guide visual language; their marketplace, chat, payment and business features are not added to this personal training app.

## Principles

- Use flat white surfaces on a very light neutral canvas. No gradients, shadows, glass effects or oversized decorative text.
- Reserve purple for primary actions, selected dates, progress and active navigation. Use pale purple for secondary emphasis.
- Keep the daily workout and its next action visible quickly on a phone. Use small section labels, short headings and restrained card spacing.
- Show actual data and clear empty states. Never use sample results to decorate analytics.
- Exercise guide disclosures start open during workouts; session and previous/next controls connect the cards.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| Canvas | `#F7F7FA` | App background |
| Surface | `#FFFFFF` | Cards, bottom navigation |
| Text | `#19191F` | Titles and main content |
| Secondary text | `#6C6C79` | Supporting labels |
| Border | `#E7E7EE` | Dividers and card outlines |
| Accent | `#7041D8` | Actions and selected states |
| Accent wash | `#F0EAFA` | Active navigation and quiet emphasis |
| Caution surface | `#FFF7ED` | Symptom and safety messages |
| Caution text | `#875726` | Caution content |

System sans-serif; no remote font dependency. Page heading 27–30 px, workout heading 26 px, section heading 19 px, card heading 15 px, body 14 px, secondary 12 px, small labels 10–11 px. Use weight 600–750 for hierarchy rather than extra colors.

Spacing follows a 4 px base with practical 14 px card gaps. Mobile page padding is 16 px; card padding is 18 px. Cards use 14 px corners, controls 8–9 px, chips 6 px. Buttons/inputs have at least 44 px height, with the bottom navigation providing 48 px targets.

## Components

- Header: small wordmark and plain save/sync state; no oversized banner.
- Weekly strip: seven equally sized date buttons, purple for today and a labelled completion indicator.
- Today workout: white outlined card, short title, compact metadata, one full-width purple start button.
- Metrics: concise number, unit and honest context, using purple progress bars.
- Workout logging: compact forms and divided result rows; preserve effort, technique and symptom details.
- Calendar: neutral date cells, solid-purple selection, pale-purple logged dates with a border. Labels explain state without relying on color alone.
- Navigation: consistent outline SVG icons, always accompanied by text. Active tab uses pale purple and purple ink.
- Illustrations: compressed full-color Nano Banana assets, clearly labelled as generated. Show credited original demonstration previews separately; remove stick-figure exercise art.
- Charts: purple data series, quiet axes, clear units and missing-data descriptions.

## Responsive and accessible behavior

Design around 390 px wide phones; fit narrow screens without horizontal page scrolling. Tables can scroll within their own container. Keep text zoom and keyboard focus usable. Honor reduced-motion preferences. Do not introduce autoplay video, flashing alerts or hover-only instructions. All essential UI assets remain available offline.

Implementation: `web/style.css` contains the tokens and components; `web/app.js` supplies the week strip and navigation icons. The service-worker cache version must change after visual updates.

## Stride identity

The app identity is an abstract flowing loop formed by two broad curved ribbons, one warm white and one pale lavender, on a flat violet square. The loop represents daily rhythm, movement and consistency without a letter or equipment motif. Large shapes and open negative space retain legibility at favicon sizes. Nano Banana 2 generated the master in `resources/brand/form-logo-flow-master.png`; `build-icons.py` exports the same artwork without redrawing it. The app header pairs a decorative 32 px symbol with the readable Stride wordmark.

The manifest supplies ordinary 192/512 px icons and a dedicated full-bleed 512 px maskable icon. The symbol remains within Android’s central safe circle, allowing Samsung launchers to apply their own icon shape. Safari uses a 180 px Apple touch icon; browser tabs use 32 px PNG and multi-size ICO exports. All deployed brand assets are local and cached offline. The full-resolution master and provenance stay outside the deployable directory.

The name Stride reflects steady progress through training, recovery and daily habits. The abstract loop remains the visual identity; the app name appears as STRIDE in the header and Stride in browser and installation metadata.

## Planning and learning

The calendar puts the selected day’s exercises before summaries and schedule-editing controls. Exercise rows show a name, dose and equipment links. Tutorial dialogs never start or save a workout. Learn → Workout days uses the same date-specific plan, including overrides, breaks and saved session settings. Keep schedule controls in expandable sections, and put account/logout controls near the top of More.

Use short sentences, familiar verbs and one clear next action. Explain gym terms in plain language; keep detailed technique, safety notes, sources and videos available behind named disclosures. Preserve the meaning of safety guidance when shortening wording.
