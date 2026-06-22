/* ALSL avatar configuration.
 *
 * The real JASigning / CWASA human avatar (Anna) is bundled in this folder and
 * is used by default. The engine runs entirely in the browser (asm.js/WASM) and
 * is fully self-hosted, so it works offline once the page has loaded.
 *
 *   engine: 'cwasa'        -> render the real human avatar (default)
 *   engine: 'placeholder'  -> skip the heavy engine and use the lightweight
 *                             stick-figure placeholder instead
 *
 * `avatar` selects which JASigning avatar to load. Only 'anna' is bundled to
 * keep the download small; drop more *.jar files into avatar/cwasa/avatars/ and
 * add them to "avs" in cwa/cwacfg.json to offer others (marc, luna, …).
 */
window.ALSL_AVATAR_CONFIG = {
  engine: 'cwasa',
  avatar: 'anna'
};
