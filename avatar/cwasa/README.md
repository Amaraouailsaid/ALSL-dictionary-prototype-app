# The signing avatar (JASigning / CWASA) — bundled & self-hosted

This folder contains the **real JASigning / CWASA human avatar** (Anna),
self-hosted so it runs **offline** in the browser. It is used by default — no
setup required. See **`NOTICE.md`** for attribution: the avatar and engine are
the work of the University of East Anglia, not of this project.

> Signing is powered by **JASigning** (UEA, https://vh.cmp.uea.ac.uk). Keep the
> on-site “Signing powered by JASigning” credit and `NOTICE.md` intact.

## How it fits together
```
avatar/
  index.html          ← bridge: implements window.AVATAR (play/playSequence/stop),
                          hosts the engine below, falls back to a labelled
                          placeholder only if WebGL/the engine can't start.
  cwasa/
    player.html       ← thin host page that boots CWASA and mounts the avatar
    config.js         ← engine: 'cwasa' (default) | 'placeholder'; avatar: 'anna'
    NOTICE.md         ← attribution & provenance (UEA)
    cwa/
      allcsa.js       ← CWASA WebGL engine (asm.js/WASM SiGML→animation)  (UEA)
      cwasa.css       ← engine styles                                      (UEA)
      cwacfg.json     ← installation config (trimmed to one avatar: Anna)
    cwaclientcfg.json ← client config (one avatar slot, SiGML-text enabled)
    shaders/          ← GLSL avatar-skinning shaders                       (UEA)
    avatars/
      anna.jar        ← Anna mesh + texture                                (UEA)
      COMMON.jar      ← shared avatar data                                 (UEA)
```

## How playback works
The site hands the bridge an **absolute, same-origin URL** to each sign's
`.sigml`. The bridge `fetch()`es the SiGML text and calls the documented engine
API in `player.html`'s frame:

```js
CWASA.playSiGMLText(sigml);   // render the sign
CWASA.stopSiGML();            // stop
```

Readiness and sequencing use the engine's own events, reported up from
`player.html`: **`avatarloaded`** (avatar built → tell the site we're ready) and
**`animidle`** (a sign finished → advance to the next sign in a sequence). No
fixed timers are needed for correct pacing; a generous fallback timer only
guards against a missed event.

## Adding more avatars
Only **Anna** is bundled to keep the download small. To offer others
(marc, luna, francoise, siggi, …):
1. Drop the avatar's `*.jar` into `avatars/`.
2. Add its name to `"avs"` in `cwa/cwacfg.json`.
The avatar JARs come from the UEA CWASA/JASigning distribution.

## Turning the heavy engine off
Set `engine: 'placeholder'` in `config.js` to skip the WebGL engine entirely and
use the lightweight stick-figure indicator instead (e.g. for very low-power
devices). The rest of the site is unaffected.
