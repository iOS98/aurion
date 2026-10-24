// يحفظ واجهة التطبيق ليفتح بسرعة وحتى بدون إنترنت؛ البيانات دائمًا من الخادم
const CACHE = 'aurion-v1';
const SHELL = ['/', '/index.html', '/styles.css', '/app.js', '/img/car.png', '/manifest.webmanifest', '/icons/icon-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  // الشبكة أولًا ثم النسخة المحفوظة
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('/'))));
});
