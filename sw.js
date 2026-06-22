const CACHE = 'alsl-v2';

const PRECACHE = [
  './', 'index.html', 'styles.css', 'app.js', 'i18n.js',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'data/signs.json', 'data/categories.json', 'data/translations.json',

  'avatar/index.html', 'avatar/cwasa/config.js', 'avatar/cwasa/player.html',
  'avatar/cwasa/cwaclientcfg.json',
  'avatar/cwasa/cwa/allcsa.js', 'avatar/cwasa/cwa/cwasa.css',
  'avatar/cwasa/cwa/cwacfg.json', 'avatar/cwasa/cwa/h2s.xsl',
  'avatar/cwasa/cwa/shaders/qskin.vert', 'avatar/cwasa/cwa/shaders/qskin.frag',
  'avatar/cwasa/avatars/anna.jar', 'avatar/cwasa/avatars/COMMON.jar'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);

    await Promise.allSettled(PRECACHE.map((u) => c.add(u)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/qr')) return;

  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.ok && res.type === 'basic') {
        const c = await caches.open(CACHE);
        c.put(req, res.clone());
      }
      return res;
    } catch (err) {
      if (req.mode === 'navigate') {
        const shell = await caches.match('index.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});
