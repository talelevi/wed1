// Luminara service worker — minimal app-shell + runtime caching.
// Strategies:
//   - Navigation requests (HTML): network-first, fall back to cached shell.
//   - Static build assets (/assets/*): cache-first, stale-while-revalidate.
//   - Google Fonts: stale-while-revalidate.
//   - Everything else: passthrough.

const VERSION = 'luminara-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const FONT_CACHE = `${VERSION}-fonts`;

const SHELL_URLS = ['./', './index.html', './manifest.webmanifest', './favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Navigation: network-first
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Build assets
  if (url.origin === self.location.origin && url.pathname.includes('/assets/')) {
    event.respondWith(staleWhileRevalidate(req, ASSET_CACHE));
    return;
  }

  // Google Fonts
  if (/(fonts\.googleapis|fonts\.gstatic)\.com/.test(url.hostname)) {
    event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    return;
  }

  // Same-origin static (favicon, manifest)
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req, ASSET_CACHE));
  }
});

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetching = fetch(req)
    .then((res) => {
      if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
        cache.put(req, res.clone());
      }
      return res;
    })
    .catch(() => cached);
  return cached || fetching;
}
