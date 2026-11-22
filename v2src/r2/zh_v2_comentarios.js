// Quem pode comentar (Bia, 22/11: "tem que ter alguma configuração de não permitir comentários nas minhas postagens… igual
// no Instagram"). API migração 043: posts.comments e reviews.comments ('all' | 'friends' | 'none') e profiles.comments_default.
// - Novo post: linha "Comentários: Todos ›" abaixo do Quem vê (padrão = o da pessoa). Resposta do Debate semanal sempre aberta.
// - ••• do próprio post/avaliação (folha "Seu post"): Todos · Só amizades · Ninguém. "Ninguém" esconde as respostas que já
//   existem (não apaga) e some o Responder para as outras pessoas; a dona vê "Comentários desativados".
// - Ajustes › "Comentários nas minhas postagens": padrão para o que a pessoa publicar (avaliações e posts).
// - Conversa do Ler junto fica fora (é grupo fechado).
const CM_LBL = { all: 'Todos', friends: 'Só amizades', none: 'Ninguém' };
const cmDef = () => { try { return (db.prefs && db.prefs.cmDefault) || 'all'; } catch { return 'all'; } };
const cmOf = (it) => (it && (typeof it.comments === 'string' ? it.comments : it.commentsMode)) || (it && it.type === 'review' ? 'friends' : 'all');
let cmNext = null; // escolha do Novo post aberto

// 1) cartão do feed: com comentários desativados, o Responder some para os outros; a dona vê o aviso (abre o •••)
{ const _ph = v6PostHTML; v6PostHTML = function (it, i) {
    const h = _ph.apply(this, arguments);
    if (!it || cmOf(it) !== 'none') return h;
    const u = it.user || {}, mine = it.mine || (u.handle && u.handle === v6Me());
    const off = mine ? `<button data-a="v6more" data-i="${i}" class="cmoff" aria-label="Comentários desativados. Mudar">${v4ic('reply', 18)}<span>Comentários desativados</span></button>` : '';
    return h.replace(/<button data-a="v6rp"[\s\S]*?<\/button>/, off);
  }; }

// 2) folha "Seu post" / "Sua avaliação": quem pode comentar
{ const _sh = v4SheetHTML; v4SheetHTML = function (k) {
    const h = _sh.apply(this, arguments);
    if (k !== 'v6my') return h;
    const it = (v4State().v6 || {}).it || {}, m = cmOf(it);
    const seg = `<div class="lbl">Quem pode comentar</div><div class="seg">${['all', 'friends', 'none'].map((x) => `<button class="${m === x ? 'on' : ''}" data-a="v6cm" data-k="${x}">${CM_LBL[x]}</button>`).join('')}</div>
      <p class="mut" style="margin:6px 0 10px;font-size:12.5px">${m === 'none' ? 'As respostas que já existem ficam escondidas e voltam se você ativar de novo.' : 'Ninguém: some o Responder e as respostas ficam escondidas.'}</p>`;
    const at = h.indexOf('<button class="li dng"');
    return at < 0 ? h + seg : h.slice(0, h.lastIndexOf('<div class="list"', at)) + seg + h.slice(h.lastIndexOf('<div class="list"', at));
  }; }
window.addEventListener('click', (ev) => {
  const p = ev.composedPath ? ev.composedPath() : [ev.target];
  const b = p.find((n) => n && n.nodeType === 1 && n.matches && n.matches('[data-a="v6cm"]')); if (!b) return;
  ev.stopImmediatePropagation(); ev.preventDefault();
  const st = v4State(), it = (st.v6 || {}).it; const k = b.dataset.k; if (!it || cmOf(it) === k) return;
  (async () => {
    const r = await sapi('PATCH', it.type === 'review' ? `/v1/reviews/${it.id}/comments` : `/v1/posts/${it.id}/comments`, { mode: k });
    if (!r || r.status !== 200) return toast('Não deu para mudar agora. Tente de novo.');
    try { v6All(it).forEach((x) => { x.comments = k; }); } catch { it.comments = k; }
    try { if (IRP.key && irpKey(it) === IRP.key) irpClose(); } catch {}
    toast(k === 'none' ? 'Comentários desativados' : k === 'friends' ? 'Agora só suas amizades comentam' : 'Comentários ativados');
    v4Draw(); try { v6Paint(); } catch {}
  })();
}, true);

// 3) Novo post: "Comentários: Todos ›" abaixo do Quem vê
function cmComposerRow() {
  const v = $('#shelflist'); const vis = v && v.querySelector('#rdc-vis'); if (!vis || v.querySelector('#rdc-cm')) return;
  if (cmNext == null) cmNext = cmDef();
  const foot = vis.closest('.rdc2-foot') || vis.parentElement;
  foot.insertAdjacentHTML('afterend', `<button type="button" id="rdc-cm" class="rdc-cm" aria-label="Quem pode comentar: ${CM_LBL[cmNext]}">Comentários: <b>${CM_LBL[cmNext]}</b> ›</button>`);
  v.querySelector('#rdc-cm').addEventListener('click', (ev) => popMenu(ev.currentTarget, ['all', 'friends', 'none'].map((x) => ({ label: CM_LBL[x], fn: () => { cmNext = x; const b = v.querySelector('#rdc-cm'); if (b) { b.innerHTML = `Comentários: <b>${CM_LBL[x]}</b> ›`; b.setAttribute('aria-label', 'Quem pode comentar: ' + CM_LBL[x]); } } }))));
}
new MutationObserver(() => { try { const v = $('#shelflist'); if (v && !v.hidden && v.querySelector('#rdc-vis')) cmComposerRow(); else if (!v || v.hidden || !v.querySelector('.rdc2')) cmNext = null; } catch {} }).observe(TR, { childList: true, subtree: true });

// 4) envio: o Novo post leva a escolha; resposta do Debate semanal fica sempre aberta; resposta recusada explica o motivo
{ const _sa = sapi; sapi = async function (method, path, body) {
    if (method === 'POST' && path === '/v1/posts' && body && body.comments == null) {
      const deb = /^(Debate semanal|Desafio da semana|Pergunta do dia):/i.test(String(body.text || ''));
      body = { ...body, comments: deb ? 'all' : (cmNext || cmDef()) };
    }
    const r = await _sa.call(this, method, path, body);
    if (r && r.status === 201 && path === '/v1/posts') cmNext = null;
    if (r && r.status === 403 && method === 'POST' && /\/(replies|comments)$/.test(path) && r.data && /^(COMMENTS_|NOT_FRIENDS)/.test(r.data.error || '')) toast(r.data.message || 'Os comentários estão fechados aqui');
    return r;
  }; }

// 5) Ajustes: padrão para o que a pessoa publicar
function cmDefaultSheet() {
  sheet('Quem pode comentar nas suas postagens?', ['all', 'friends', 'none'].map((x) => [(cmDef() === x ? '✓ ' : '') + CM_LBL[x], async () => {
    const r = await sapi('PUT', '/v1/me/comments-default', { mode: x });
    if (!r || r.status !== 200) return toast('Não deu para salvar agora. Tente de novo.');
    db.prefs = db.prefs || {}; db.prefs.cmDefault = x; save(); toast('Padrão: ' + CM_LBL[x] + '. Dá para trocar em cada post.');
    const row = $('#aj-cm small'); if (row) row.textContent = 'padrão: ' + CM_LBL[x] + ' · dá para trocar em cada post';
  }]));
}
{ const _da = drawAjustes; drawAjustes = function (box) { _da(box); if (S.ajMode === 'perfil' || box.querySelector('#aj-cm')) return;
    const at = box.querySelector('#aj-mu') || box.querySelector('#aj-fn'); if (!at) return;
    at.insertAdjacentHTML('afterend', `<button type="button" class="aj-row" id="aj-cm"><span><b>Comentários nas minhas postagens</b><small>padrão: ${CM_LBL[cmDef()]} · dá para trocar em cada post</small></span><em>›</em></button>`);
    $('#aj-cm', box).addEventListener('click', cmDefaultSheet);
    // confere o padrão salvo no servidor (outro aparelho)
    sapi('GET', '/v1/me/comments-default').then((r) => { if (r && r.status === 200 && r.data && r.data.mode && r.data.mode !== cmDef()) { db.prefs = db.prefs || {}; db.prefs.cmDefault = r.data.mode; save(); const s = $('#aj-cm small'); if (s) s.textContent = 'padrão: ' + CM_LBL[r.data.mode] + ' · dá para trocar em cada post'; } }).catch(() => {});
  }; }

// estilos: aviso da dona e linha do Novo post
{ const css = `.acts .cmoff{display:inline-flex;align-items:center;gap:6px;color:var(--ink-2);font-size:13px;font-weight:800;background:none;border:0;min-height:40px;padding:0 6px}
.acts .cmoff svg{opacity:.5}
.rdc-cm{display:block;margin:8px auto 0;min-height:40px;padding:0 10px;border:0;background:none;color:var(--ink-2);font:inherit;font-size:13.5px;font-weight:700;cursor:pointer}
.rdc-cm b{color:var(--ink)}`;
  try { const st = document.createElement('style'); st.textContent = css; TR.append(st); } catch {}
  try { const _arm = v6Arm; v6Arm = function (R) { const r = _arm.apply(this, arguments); try { const sr = R && R.getRootNode(); if (sr && sr.querySelector && !sr.querySelector('style[data-cm]')) { const s = document.createElement('style'); s.dataset.cm = 1; s.textContent = css; sr.append(s); } } catch {} return r; }; } catch {}
}
