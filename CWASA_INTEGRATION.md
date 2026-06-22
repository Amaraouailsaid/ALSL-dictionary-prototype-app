# Plugging the real CWASA / JASigning avatar into the site

The website talks to the avatar through **one iframe** (`avatar/index.html`) and
calls exactly three JavaScript functions on it. Make those drive CWASA and the
whole site lights up — search, translate and quiz all already call them.

## The contract (defined on `window.AVATAR` inside the iframe)

```js
window.AVATAR = {
  play(o)                 // o = { label, fr, url, n, speed, loop }
  playSequence(items, o)  // items = [{label, fr, url, n}], o = { speed }
  stop()
}
```

- `url` is an **absolute URL** to the sign's `.sigml` (the site builds it for
  you), so you can `fetch(url)` from inside the iframe directly.
- `speed` is `1` (normal) or `0.5` (the "Slow" / turtle button).
- `loop` is a boolean (the Loop button).
- `n` is the notation-symbol count (handy if you want longer playback for
  complex signs).

## Done: the real avatar is wired in
This is **already implemented and rendering**. The JASigning / CWASA engine and
the **Anna** avatar are bundled under **`avatar/cwasa/`** and self-hosted, so the
human signer renders offline in the browser.

- `avatar/cwasa/player.html` boots the engine against **local** resources by
  passing `CWASA.init({ jasBase: <this folder> })` — this is the key step that
  stops CWASA from falling back to its built-in `vhg.cmp.uea.ac.uk` URL, so
  config, the avatar JAR, the shaders and `h2s.xsl` all load from disk.
- `avatar/index.html` is the bridge the site talks to. It implements
  `window.AVATAR` (play / playSequence / stop), drives the engine in
  `player.html`, and reports readiness via the engine's real **`avatarloaded`**
  event (and advances sequences on **`animidle`**). It calls `signerReady()`
  once the avatar is built, and falls back to a labelled placeholder only if
  WebGL/the engine can't start.
- Playback uses the documented call: `fetch(o.url) → CWASA.playSiGMLText(text)`;
  stop uses `CWASA.stopSiGML()`.

See `avatar/cwasa/README.md` for the file layout and how to add more avatars,
and `avatar/cwasa/NOTICE.md` for attribution. The reference contract below
documents the same API the bridge implements.

## Steps (reference)
1. Put your CWASA player files in `avatar/cwasa/` and set `playerSrc` so
   `avatar/index.html` loads them. Initialise CWASA exactly as in your working
   `play-one-sign.html`.
2. When the iframe is ready, tell the parent so queued calls flush:
   ```js
   if (window.parent && window.parent.signerReady) window.parent.signerReady();
   ```
3. Implement `play` using your real call (reuse the one from `play-one-sign.html`):
   ```js
   window.AVATAR = {
     play(o){
       fetch(o.url).then(r=>r.text()).then(sigml=>{
         CWASA.playSiGMLText(sigml);     // <-- your real CWASA call
         // apply o.speed / o.loop if your build supports it
       });
     },
     playSequence(items, o){
       let i=0;
       const next=()=>{ if(i>=items.length) return;
         this.play(Object.assign({}, items[i++], {speed:o&&o.speed||1}));
         setTimeout(next, 1700/((o&&o.speed)||1)); }; // or chain on CWASA's "done" event
       next();
     },
     stop(){ /* CWASA stop if available */ }
   };
   ```

## Already handled for you
- The site computes absolute SiGML URLs, so no path juggling.
- Same-origin iframe: the parent calls `iframe.contentWindow.AVATAR.*` directly.
- Speed, loop, sequencing and the quiz "hidden label" mode all just pass options
  to `play` — you don't need to change the site.

## Tip
Get one hard-coded sign rendering first (call your CWASA play function with one
`signs/s0001.sigml`). Once the avatar moves, wire the three functions above and
you're done.
