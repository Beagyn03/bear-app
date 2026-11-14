// B.E.A.R — service worker (4.4, decidido em 14/11/2026).
// Guarda o app (index.html), os ícones e as imagens de img/ no celular: abre na hora e funciona sem internet.
// A cada abertura confere em segundo plano se há versão nova do app; se houver, guarda a nova e avisa a página,
// que mostra "Nova versão disponível · Atualizar" (um toque recarrega já com a versão nova).
// API, capas de outros sites e o resto seguem direto para a rede, sem cache.
const CACHE = 'bear-app';
const SHELL = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const APP_KEY = () => new URL('./', self.registration.scope).href; // toda navegação usa a mesma chave (sem ?query nem #)

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try { const c = await caches.open(CACHE); await c.addAll(SHELL.map((p) => new Request(p, { cache: 'reload' }))); } catch (e) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try { const keys = await caches.keys(); await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))); } catch (e) {}
    await self.clients.claim();
  })());
});

async function notifyUpdate() {
  const list = await self.clients.matchAll({ type: 'window' });
  list.forEach((c) => c.postMessage({ type: 'bear-update' }));
}

// Busca a versão da rede, guarda, e avisa se mudou em relação à que estava guardada.
async function refreshApp(cached) {
  try {
    const fresh = await fetch(APP_KEY(), { cache: 'no-cache' });
    if (!fresh.ok) return null;
    const c = await caches.open(CACHE);
    if (cached) {
      const [a, b] = await Promise.all([cached.clone().text(), fresh.clone().text()]);
      if (a === b) return fresh;
      await c.put(APP_KEY(), fresh.clone());
      // versão nova pode trazer imagem trocada com o mesmo nome: as de img/ são buscadas de novo
      try { for (const k of await c.keys()) if (/\/img\//.test(k.url)) await c.delete(k); } catch (e) {}
      await notifyUpdate();
    } else {
      await c.put(APP_KEY(), fresh.clone());
    }
    return fresh;
  } catch (e) { return null; }
}

function offlinePage() {
  return new Response(
    '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B.E.A.R</title>' +
    '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#1f140d;color:#f3e4cc;font-family:system-ui,sans-serif;text-align:center;padding:1.5rem">' +
    '<div><h1 style="font-size:1.3rem">Sem conexão</h1><p>O B.E.A.R precisa de internet para abrir pela primeira vez. Tente de novo em instantes.</p>' +
    '<button onclick="location.reload()" style="font:inherit;font-weight:700;padding:.6rem 1.2rem;border-radius:999px;border:0;background:#d9a86c;color:#2a1709">Tentar de novo</button></div></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // API, Google, Open Library, capas: rede direta

  const root = new URL('./', self.registration.scope).pathname;
  if (req.mode === 'navigate' && (url.pathname === root || url.pathname === root + 'index.html')) {
    // abre o que está guardado na hora; confere a versão nova em segundo plano
    event.respondWith((async () => {
      const c = await caches.open(CACHE);
      const cached = await c.match(APP_KEY());
      if (cached) { event.waitUntil(refreshApp(cached.clone())); return cached; } // clona antes: o corpo entregue à página não pode ser lido de novo
      return (await refreshApp(null)) || offlinePage();
    })());
    return;
  }

  const path = url.pathname;
  const isAsset = /\/img\//.test(path) || /\.(png|webp|jpg|jpeg|svg|webmanifest)$/.test(path);
  if (!isAsset) return; // sync.html, sw.js e o resto: rede direta

  // imagens: do celular se já tiver; senão busca e guarda
  event.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) c.put(req, res.clone()).catch(() => {});
    return res;
  })());
});
