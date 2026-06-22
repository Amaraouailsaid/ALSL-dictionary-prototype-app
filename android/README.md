# ALSL Dictionary — Android app (WebView wrapper)

A thin native Android app that hosts the deployed ALSL Dictionary website in a
full-screen WebView. The website does everything (dictionary, signing avatar,
quiz, languages, themes); this wrapper exists so you can ship it on the
**Google Play Store** with its own icon.

> For the thesis demo you don't even need this: the site is an installable
> **PWA**. Show the QR at **`/qr`** on your deployed site — scanning it opens the
> app, and the browser's “Add to Home screen / Install app” installs it offline.
> Use this Android project when you specifically want a Play Store listing.

## One thing to set
Edit **`app/src/main/res/values/strings.xml`** and set `app_url` to your
deployed site (keep the trailing slash):

```xml
<string name="app_url">https://your-app.up.railway.app/</string>
```

## Build it (Android Studio — easiest)
1. Install **Android Studio** (it bundles the SDK + the right Gradle).
2. **Open** this `android/` folder as a project. Let it sync (it downloads the
   Gradle wrapper and dependencies automatically).
3. Run on a device/emulator: **Run ▶**. To get a shareable file:
   **Build → Build Bundle(s) / APK(s) → Build APK(s)** → `app/build/outputs/apk/…`.

## Build from the command line
This folder ships without the Gradle wrapper binary. Generate it once (needs a
local Gradle, or just open the project in Android Studio which creates it):

```bash
cd android
gradle wrapper            # creates ./gradlew  (one-time)
./gradlew assembleRelease # APK  → app/build/outputs/apk/release/
./gradlew bundleRelease   # AAB  → app/build/outputs/bundle/release/  (Play Store)
```

## Sign it for the Play Store
Play requires a signed **AAB**. Create a keystore once and let Android Studio
sign for you (**Build → Generate Signed Bundle / APK**), or:

```bash
keytool -genkey -v -keystore alsl.keystore -alias alsl -keyalg RSA -keysize 2048 -validity 10000
```

Then in Play Console: create the app, upload the AAB, fill in the listing, and
submit for review. (A Google Play developer account has a one-time $25 fee.)

## Notes
- `minSdk 23` (Android 6.0+), `targetSdk 34`. WebGL — the signing avatar — works
  in the system WebView on modern Android.
- `INTERNET` is the only permission. The app loads your live URL, so the avatar
  engine streams from the server (the PWA service worker still caches it in the
  WebView after first load).
- **Fully offline APK (optional):** copy the site’s files into
  `app/src/main/assets/` and change `app_url` handling to
  `web.loadUrl("file:///android_asset/index.html")` with
  `setAllowFileAccess(true)`. Loading the deployed URL is simpler and is the
  recommended path for the demo + Play Store.
