# ALSL Dictionary — website

A polished, offline-capable website that showcases the validated Algerian Sign
Language dataset (HamNoSys → SiGML), rendered live by a 3D avatar.

**Contents**
- `index.html`, `styles.css`, `app.js`, `i18n.js` — the app (vanilla JS, no build step)
- `avatar/index.html` — the signing stage (drives the bundled JASigning avatar)
- `avatar/cwasa/` — the self-hosted JASigning/CWASA human avatar (Anna) + engine
- `data/signs.json` — 714 signs: `{id, ar, fr, source, n, two}`
- `data/categories.json` — Arabic thematic + grammatical tags (generated)
- `signs/sXXXX.sigml` — the SiGML for each sign
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA (installable, offline)
- `qr.html` + `/qr.png` route — live QR of the deploy URL (for demos)
- `android/` — native WebView wrapper project for the Google Play Store

## Run it
It must be opened through a web server (browsers block `fetch()` on `file://`):

```
cd alsl-site
python -m http.server 8000
```
Then open <http://localhost:8000>. To put it online (free), drag this folder
onto Netlify Drop, or push to GitHub Pages — it's all static.

## What's inside
- **Explore** — live stats, coverage bar, "sign of the day".
- **Dictionary** — instant search (Arabic diacritic-insensitive + French) plus an
  Arabic **category picker**: *By theme* (Family, Colors, Food, Nature, Places…)
  and *By part of speech* (Noun, Verb, Adjective, Adverb, Number…), tagged from
  the Arabic words in `data/categories.json` (regenerate with the tagging
  script). Tap a word to sign it.
- **Text → Sign** — type Arabic, each known word is signed in sequence; unknown
  words are flagged "not yet added".
- **Practice** — guess-the-sign quiz with score, streak and best (saved locally).
- **Saved** — your study list (saved locally).
- **Behind the sign** — reveals the HamNoSys/SiGML behind each sign. This is the
  panel that shows a jury the dataset is real, standards-based, machine-readable.
- **Avatar controls** — replay, slow ("turtle"), loop.
- **Languages** — Arabic (default, RTL), French, English — switch in the top bar.
- **Light / dark theme** — toggle in the top bar (remembered per device).
- **Install on a phone** — it's a PWA: open `/qr` on the deployed site and scan
  the QR to install it to the home screen. A native Android wrapper for the Play
  Store lives in `android/` (see `android/README.md`).

## The signing avatar
The real **JASigning / CWASA** human avatar (**Anna**) is bundled in
**`avatar/cwasa/`** and runs by default — it renders each sign's SiGML live in
the browser via WebGL, fully **self-hosted and offline** (no calls to UEA at
runtime). `avatar/index.html` is a thin bridge that implements the three
functions the site calls (`play` / `playSequence` / `stop`) and drives the
engine; if a device can't run WebGL it falls back to a clearly-labelled
placeholder so the rest of the site keeps working.

The avatar and engine are the work of the University of East Anglia, not of this
project — see **`avatar/cwasa/NOTICE.md`** for attribution/provenance,
**`avatar/cwasa/README.md`** for how it's wired (and adding more avatars), and
**CWASA_INTEGRATION.md** for the contract. Keep the on-site
"Signing powered by JASigning" credit intact.

## Notes
- The "~% of national dictionary" figure uses `NATIONAL_TOTAL = 1500` at the top
  of `app.js` — edit if needed.
- 296 signs are the newly validated set (each with a French translation); 418
  come from the prior 3DZSignDB work.
- The JASigning avatar is the existing rendering engine; the dataset, validation
  and platform are the thesis contribution. The footer credits it.
