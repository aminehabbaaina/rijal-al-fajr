// رجال الفجر — يسمح بفتح الصفحة بسرعة حتى مع إنترنت ضعيف
const V = 'rf-v5';
const SHELL = ['./', 'index.html', 'jsqr.js', 'qrcode.js', 'logo.png', 'icon-192.png', 'icon-512.png', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.includes('script.google')) return; // البيانات لا تُخزَّن هنا
  if (u.origin === location.origin && (e.request.mode === 'navigate' || u.pathname.endsWith('.html'))) {
    // الصفحة: الأحدث من الإنترنت، وإلا النسخة المحفوظة
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(e.request, c)); return res; })));
});
