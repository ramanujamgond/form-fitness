# Photographic teaching media

Training basics and term popups use existing generated exercise images plus two new Nano Banana photographs for rest and selector-pin load selection. Every term includes text explaining the exact concept and a linked exercise demonstration. Generated images are labelled; the demonstration is the technique reference.

Equipment uses eleven local Wikimedia Commons photographs resized to 480px and compressed to WebP. Author, source page, original licence, and resizing/compression notice remain in `tools[id].photo` and appear in the equipment detail. Assisted pull-up, chest-supported row, and calf-raise equipment reuse the corresponding generated exercise image and original publisher video preview. No Everkinetic diagrams remain visible.

Five meal images were generated with Nano Banana, resized to 640px, compressed to WebP, and labelled as illustrative portions. Daily banners reuse generated exercise/rest photographs. Raw generation files remain local in `resources/generated/`; only compact WebP assets are deployed.

The service worker caches all local replacements. External original previews and videos need connectivity; video embeds load only on a tap. Old equipment, exercise, meal, and scene JPG artwork was removed.

Verification: `node tests/training-media-browser.cjs` checks all 13 terms, the Rep popup, equipment and meal images, mobile layout, and offline training images. `npm test` and `npm run build` cover existing behavior and the journal startup regression.
