// ---------- Atividades que não se perdem (Bia, 26/11: atualizações do Foco sumiam das atividades e da Comunidade) ----------
// Antes: publishActivity mandava um POST só e engolia qualquer falha. No Foco a API fica parada a sessão inteira, o Render
// gratuito dorme (~15 min) e o POST do fim da sessão cai no despertar (30–60 s); se a pessoa sai do app ou bloqueia a tela
// nesse meio tempo, o celular corta a requisição e a atividade some. Agora: fila guardada no aparelho (lv.actq), envio com
// keepalive (sobrevive à saída da tela) e novas tentativas ao voltar ao app, ao ficar online e a cada minuto. O servidor já
// guarda uma atividade por livro, tipo e dia (o reenvio só atualiza a mesma linha), então repetir é seguro.
// 26/11 (API, migração 045): cada atividade leva `at`, o momento em que aconteceu, gravado aqui e mandado igual no envio e
// em todo reenvio. O servidor tira o dia de São Paulo desse `at` (aceita até 48 h atrás), então um reenvio atrasado
// cai no dia certo e não passa por cima de uma atualização mais nova.
const AQ_K = 'lv.actq', AQ_MAX_AGE = 36 * 3600e3;
const aqLoad = () => { try { const q = JSON.parse(localStorage.getItem(AQ_K) || '[]'); return Array.isArray(q) ? q : []; } catch { return []; } };
const aqSave = (q) => { try { localStorage.setItem(AQ_K, JSON.stringify(q.slice(-40))); } catch {} };
let AQ_BUSY = false;
async function aqFlush() {
  if (AQ_BUSY) return; let q = aqLoad().filter((x) => Date.now() - x.at < AQ_MAX_AGE); if (!q.length) { aqSave(q); return; }
  try { if (!connected()) return; } catch { return; }
  AQ_BUSY = true;
  try {
    if (typeof socialProfile !== 'undefined' && socialProfile === undefined) { try { await loadProfile(); } catch {} }
    if (typeof socialProfile !== 'undefined' && !socialProfile) return; // sem perfil público: o servidor não aceita; fica guardado até ter
    for (const it of q.slice()) {
      let ok = false, drop = false;
      try { const ctl = 'AbortController' in window ? new AbortController() : null, t = ctl ? setTimeout(() => ctl.abort(), 75000) : 0;
        const r = await fetch(apiCfg.api + '/v1/activities', { method: 'POST', keepalive: JSON.stringify(it.b).length < 60000, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiCfg.token }, body: JSON.stringify(it.b), signal: ctl ? ctl.signal : undefined });
        clearTimeout(t); ok = r.ok; drop = !r.ok && r.status >= 400 && r.status < 500 && ![401, 408, 429].includes(r.status); // 4xx de dado inválido não adianta repetir
      } catch { ok = false; }
      if (ok || drop) { q = aqLoad().filter((x) => x.id !== it.id); aqSave(q); } else { const all = aqLoad(); const x = all.find((y) => y.id === it.id); if (x) { x.n = (x.n || 0) + 1; aqSave(all); } break; } // sem rede/API dormindo: tenta depois
    }
  } finally { AQ_BUSY = false; }
}
publishActivity = async function (e, kind) {
  try { if (!e) return; if (!connected()) return; const info = readingInfo(e) || {};
    const now = Date.now();
    const b = { kind, libId: e.id, title: e.title, author: e.author || null, cover: smallCover(e.cover), pct: info.total ? Math.min(100, info.pct) : null, pages: info.now || null, at: new Date(now).toISOString() };
    const day = todayISO(); const q = aqLoad().filter((x) => !(x.b.libId === b.libId && x.b.kind === b.kind && x.day === day)); // a mais nova do dia substitui a anterior
    q.push({ id: uid(), b, day, at: now, n: 0 }); aqSave(q); await aqFlush();
  } catch (err) { console.warn('atividade', err); } };
setInterval(() => { if (aqLoad().length) aqFlush(); }, 60000);
window.addEventListener('online', () => aqFlush());
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') setTimeout(aqFlush, 800); });
setTimeout(aqFlush, 4000);
