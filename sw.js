// B.E.A.R — service worker mínimo.
// Existe para o navegador oferecer “Instalar app” com um toque. Não guarda nada em cache:
// toda página e todo dado vêm sempre da rede, então uma versão nova do app aparece na hora.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // limpa caches deixados por versões antigas
    try { const keys = await caches.keys(); await Promise.all(keys.map((k) => caches.delete(k))); } catch (e) {}
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return; // imagens, API e o resto seguem direto para a rede
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B.E.A.R</title>' +
    '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#1f140d;color:#f3e4cc;font-family:system-ui,sans-serif;text-align:center;padding:1.5rem">' +
    '<div><h1 style="font-size:1.3rem">Sem conexão</h1><p>O B.E.A.R precisa de internet para abrir. Tente de novo em instantes.</p>' +
    '<button onclick="location.reload()" style="font:inherit;font-weight:700;padding:.6rem 1.2rem;border-radius:999px;border:0;background:#d9a86c;color:#2a1709">Tentar de novo</button></div></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
