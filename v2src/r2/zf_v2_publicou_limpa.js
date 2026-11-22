// Publicou, limpou (Bia, 22/11). (1) Rascunho só volta se a pessoa saiu SEM publicar: texto enviado com sucesso (post,
// avaliação, eco, resposta, mensagem) não vira rascunho do z4 e o composer não reaproveita o texto que ficou no DOM
// escondido; erro de envio mantém o texto. (2) Tocar no próprio nome na Comunidade abre a aba Você: o voltar e o Esc
// levam de volta para a Comunidade (antes o voltar ia para o Hoje e o perfil parecia "preso").
{
  // ----- 1. textos enviados -----
  const SENT = []; // { v, at } (normalizado)
  const nrm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  const PUB = /^\/v1\/(posts(\/[^/]+\/replies)?|reviews(\/[^/]+(\/comments)?)?|echoes|me\/echoes|messages|buddies\/[^/]+\/posts)$/;
  const strs = (o, out = [], d = 0) => { if (d > 3 || o == null) return out; if (typeof o === 'string') { if (o.trim().length >= 2) out.push(nrm(o)); } else if (typeof o === 'object') Object.values(o).forEach((x) => strs(x, out, d + 1)); return out; };
  window.lvSentText = (v) => { const n = nrm(v); if (!n) return false; const t = Date.now(); for (let i = SENT.length - 1; i >= 0; i--) { if (t - SENT[i].at > 6e5) { SENT.splice(i, 1); continue; } if (SENT[i].v === n || (n.length > 12 && SENT[i].v.endsWith(n))) return true; } return false; };
  const forget = () => { try { const o = JSON.parse(sessionStorage.getItem('lv.rascunhos') || '{}') || {}; let ch = 0; Object.keys(o).forEach((k) => { if (o[k] && window.lvSentText(o[k].v)) { delete o[k]; ch++; } }); if (ch) sessionStorage.setItem('lv.rascunhos', JSON.stringify(o)); } catch {} };
  const _s = sapi;
  sapi = async function (method, path, body) {
    const r = await _s.apply(this, arguments);
    try {
      const p = String(path || '').split('?')[0];
      if (/^(POST|PUT|PATCH)$/.test(method) && PUB.test(p) && r && r.status >= 200 && r.status < 300 && body && typeof body === 'object') {
        const at = Date.now(); strs(body).forEach((v) => SENT.push({ v, at })); forget();
        // composer de post: o texto enviado fica no DOM escondido e voltaria na próxima abertura
        if (p === '/v1/posts') { const v = $('#shelflist'); if (v) v.querySelectorAll('.rdc2 textarea, .rdc2 input[type=text], .rdc2 #rdc-pg').forEach((x) => { if (x.value && window.lvSentText(x.value) || x.id === 'rdc-pg') { x.value = ''; x.defaultValue = ''; } }); }
      }
    } catch {}
    return r;
  };
  // composer aberto com conteúdo pronto (trecho compartilhado, desafio): não mistura com o texto antigo escondido
  const _open = openRdComposer;
  openRdComposer = function (pre) {
    try { const v = $('#shelflist'); if (v && pre && (pre.text || pre.quote)) v.querySelectorAll('.rdc2 #rdc-t, .rdc2 #rdc-q').forEach((x) => { x.value = ''; }); } catch {}
    return _open.apply(this, arguments);
  };

  // ----- 2. próprio perfil pela Comunidade: voltar/Esc voltam para a Comunidade -----
  let pend = null, backTo = null, barAt = 0, cur = null; // cur: aba pedida por último (S.tab nem sempre muda para a aba Você)
  const onDown = (ev) => { const p = ev.composedPath ? ev.composedPath() : [ev.target];
    if (p.some((n) => n && n.id === 'tabbar')) barAt = Date.now();
    const w = p.find((n) => n && n.matches && n.matches('[data-a=v6who], [data-a=rdwho], .whob')); if (w) pend = { from: cur || S.tab, at: Date.now() }; };
  document.addEventListener('pointerdown', onDown, true); TR.addEventListener('pointerdown', onDown, true); TR.addEventListener('click', onDown, true);
  TR.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') onDown(ev); }, true);
  const _go = goTab;
  goTab = function (t) {
    const now = Date.now();
    if (t === 'eu' && pend && now - pend.at < 2000 && pend.from && pend.from !== 'eu') { backTo = pend.from; pend = null; cur = t; return _go.apply(this, arguments); }
    if (cur === 'eu' && backTo && t === 'inicio' && now - barAt > 800) { const to = backTo; backTo = null; cur = to; return _go.call(this, to); }
    if (t !== 'eu') backTo = null; cur = t;
    return _go.apply(this, arguments);
  };
  window.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape' || ev.defaultPrevented || cur !== 'eu' || !backTo) return;
    if (TR.querySelector('.pop, .v10dlg, .bkm, .drw') || document.querySelector('body > .sheet')) return;
    const ed = $('#editor'); if (ed && !ed.hidden) return;
    const v = $('#shelflist'); if (v && !v.hidden && !v.classList.contains('tabroot') && !v.classList.contains('mine-page')) return; // página por cima do perfil: o Esc dela vem antes
    ev.preventDefault(); const to = backTo; backTo = null; cur = to; _go(to);
  });
}
