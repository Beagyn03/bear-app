// Início mais completo (15/11): "Comece por aqui" para quem ainda não tem livros, Sua semana, meta do ano (com convite
// quando não tem), Na Rede (3 posts) e Em alta. Tudo entra em Ajustes › Personalizar Hoje. Seções desligadas por padrão
// antes (Leituras do ano e Próxima conquista) passam a aparecer para quem nunca personalizou.
// Tour de boas-vindas para conta nova (db.prefs.tourDone); "Ver o tour de novo" em Ajustes.
{ const st = document.createElement('style'); st.textContent = `
.in-sec{margin:.2rem 0 1.1rem}
.in-h{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 .5rem}.in-h b{font-size:1rem;font-weight:900;color:var(--ink)}
.in-h button{border:0;background:none;font:inherit;font-size:.8rem;font-weight:800;color:var(--acc);padding:.3rem 0}
.in-card{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.75rem .85rem}
.in-wk{display:grid;grid-template-columns:repeat(7,1fr);gap:.35rem;align-items:end;height:64px;margin:.5rem 0 .25rem}
.in-wk span{display:grid;justify-items:center;gap:.2rem;font-size:.66rem;color:var(--ink-2);font-weight:800}
.in-wk i{display:block;width:100%;max-width:26px;border-radius:6px 6px 3px 3px;background:var(--acc);min-height:3px}.in-wk i.z{background:var(--line)}
.in-wk span.hj{color:var(--ink)}
.in-nums{display:flex;gap:1rem;flex-wrap:wrap;font-size:.8rem;color:var(--ink-2);font-weight:700}.in-nums b{color:var(--ink);font-size:1rem}
.in-go{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.in-go button{display:grid;gap:.15rem;text-align:left;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.7rem;font:inherit;color:var(--ink);min-height:74px}
.in-go button b{font-size:.88rem}.in-go button small{font-size:.74rem;color:var(--ink-2);font-weight:600;line-height:1.25}
.in-meta-cta{display:flex;justify-content:space-between;align-items:center;gap:.6rem}.in-meta-cta p{margin:0;font-size:.84rem;color:var(--ink-2);font-weight:600}
.in-meta-cta button{border:0;background:var(--acc);color:#fff;border-radius:999px;min-height:38px;padding:0 .9rem;font:inherit;font-weight:800;font-size:.82rem;flex:none}
.in-rd .rd-card{margin:0 0 .55rem;cursor:pointer}
.in-rd .rd-card .rd-more{display:none}
.in-rd .rd-body p{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.in-alta{display:flex;gap:.6rem;overflow-x:auto;padding-bottom:.3rem;scrollbar-width:none}.in-alta::-webkit-scrollbar{display:none}
.in-alta button{flex:0 0 84px;display:grid;gap:.25rem;border:0;background:none;padding:0;font:inherit;text-align:left;color:var(--ink)}
.in-alta button b{font-size:.72rem;line-height:1.2;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.in-alta button .cv{width:84px;height:126px;border-radius:3px 7px 7px 3px;box-shadow:2px 5px 12px rgba(40,20,5,.22)}
.in-alta button small{font-size:.66rem;color:var(--ink-2);font-weight:700}
.in-empty{font-size:.82rem;color:var(--ink-2);margin:0}
.tour{position:fixed;inset:0;z-index:9000}
.tour .hole{position:fixed;border-radius:14px;box-shadow:0 0 0 9999px rgba(20,12,6,.68);transition:all .25s ease;pointer-events:none}
.tour .hole.none{left:50%;top:40%;width:0;height:0}
.tour .tip{position:fixed;left:16px;right:16px;max-width:420px;margin:0 auto;background:var(--panel,#fffaf2);color:var(--ink);border-radius:18px;padding:1rem 1rem .8rem;box-shadow:0 12px 32px rgba(0,0,0,.35)}
.tour .tip h4{margin:0 0 .35rem;font-size:1.05rem}.tour .tip p{margin:0 0 .8rem;font-size:.9rem;line-height:1.4;color:var(--ink-2)}
.tour .tip .tb{display:flex;justify-content:space-between;align-items:center;gap:.5rem}
.tour .tip .tb small{font-size:.76rem;color:var(--ink-2);font-weight:800}
.tour .tip .tb button{border:0;border-radius:999px;min-height:40px;padding:0 1rem;font:inherit;font-weight:800}
.tour .tip .tb .sk{background:none;color:var(--ink-2)}.tour .tip .tb .nx{background:var(--acc);color:#fff}
`; TR.append(st); }
HOME_SECS.push(['comece', 'Comece por aqui'], ['semana', 'Sua semana'], ['rede', 'Na Comunidade'], ['alta', 'Em alta']);
if (!(db.prefs && db.prefs.home)) db.prefs = { ...(db.prefs || {}), home: { order: ['comece', 'semana', 'meta', 'recs', 'tambem', 'fila', 'rede', 'alta', 'ano', 'conq'], off: [] } };
const inAddDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
function inSemana() {
  const m = pagesByDay(), t = todayISO(), days = [...Array(7)].map((_, i) => inAddDays(t, i - 6)), vals = days.map((d) => m[d] || 0), mx = Math.max(...vals, 1);
  const tot = vals.reduce((a, b) => a + b, 0), nd = vals.filter(Boolean).length;
  let streak = 0; for (let d = (m[t] ? t : inAddDays(t, -1)); m[d]; d = inAddDays(d, -1)) streak++;
  const WD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  return `<section class="in-sec" data-in="semana"><div class="in-h"><b>Sua semana</b><button type="button" data-go="stats">Estatísticas</button></div><div class="in-card">
    <div class="in-wk">${days.map((d, i) => `<span class="${d === t ? 'hj' : ''}"><i class="${vals[i] ? '' : 'z'}" style="height:${vals[i] ? Math.max(8, Math.round((vals[i] / mx) * 46)) : 3}px"></i>${WD[new Date(d + 'T12:00:00').getDay()]}</span>`).join('')}</div>
    <div class="in-nums"><span><b>${tot}</b> páginas</span><span><b>${nd}</b> de 7 dias</span><span><b>${streak}</b> ${streak === 1 ? 'dia seguido' : 'dias seguidos'}</span></div>
    ${tot ? '' : '<p class="in-empty" style="margin-top:.4rem">Atualize a página em que parou e o app monta sua semana.</p>'}</div></section>`;
}
function inComece() {
  return `<section class="in-sec" data-in="comece"><div class="in-h"><b>Comece por aqui</b></div><div class="in-go">
    <button type="button" data-go="hist"><b>Trazer meu histórico</b><small>Goodreads, Skoob, StoryGraph ou planilha</small></button>
    <button type="button" data-go="meta"><b>Meta do ano</b><small>Quantos livros em ${todayISO().slice(0, 4)}?</small></button>
    <button type="button" data-go="amigos"><b>Encontrar amigos</b><small>Leia junto e troque indicações</small></button></div></section>`;
}
function inMetaCta() {
  const Y = yearInfo(); if (Y.target) return '';
  return `<section class="in-sec" data-in="metacta"><div class="in-card in-meta-cta"><p>Quantos livros você quer ler em ${Y.y}?</p><button type="button" data-go="meta">Definir meta</button></div></section>`;
}
function inRede() {
  if (!connected() || !socialProfile) return '';
  const list = (typeof rdVisible === 'function' ? rdVisible(S.rd.items || []) : []).slice(0, 3);
  return `<section class="in-sec in-rd" data-in="rede"><div class="in-h"><b>Na Comunidade</b><button type="button" data-go="rede">Ver tudo</button></div>
    ${list.length ? list.map((it, i) => rdCardHTML(it, i, { noFoot: true })).join('') : (S.rd.at ? '<button type="button" class="rd-new" data-go="post"><i>+</i><span><b>Ainda não tem posts</b><small>Toque para começar a conversa</small></span></button>' : '<div class="in-card"><p class="in-empty">Carregando…</p></div>')}</section>`;
}
function inAlta() {
  const d = S.trends; if (!connected() || !socialProfile) return '';
  const list = d ? [...(d.friends || []), ...(d.app || []), ...(d.topRated || [])].filter((x, i, a) => a.findIndex((y) => y.key === x.key) === i).slice(0, 10) : [];
  if (d && !list.length) return '';
  return `<section class="in-sec" data-in="alta"><div class="in-h"><b>Em alta</b><button type="button" data-go="rede">Comunidade</button></div>
    ${list.length ? `<div class="in-alta">${list.map((x, i) => `<button type="button" data-al="${i}">${cvh(x.title, x.cover, '')}<b>${esc(x.title)}</b><small>${esc(x.n ? plural(x.n, 'leitor', 'leitores') : '')}</small></button>`).join('')}</div>` : '<div class="in-card"><p class="in-empty">Carregando…</p></div>'}</section>`;
}
function paintInicioMais() {
  const box = $('#lista'); if (S.tab !== 'inicio' || !box) return;
  box.querySelectorAll('[data-in]').forEach((x) => x.remove());
  const { order, off } = homePrefs(), now = box.querySelector('.v3-now'), col = now ? now.parentElement : (box.querySelector('.v3-colA') || box);
  const noBooks = !(db.library || []).length;
  const html = { comece: noBooks ? inComece() : '', semana: noBooks ? '' : inSemana(), rede: inRede(), alta: inAlta() };
  const metaHtml = off.includes('meta') || noBooks ? '' : inMetaCta();
  // posição: cada seção nova entra depois da seção que vem antes dela na ordem (ou no topo, depois do Lendo agora)
  const anchorOf = (k) => { const m = { meta: '#ini-meta', recs: '#rc-host', fila: '.yo-fsh', ano: '.ini-ano', conq: '.ini-conq', pv: '#pv-host' }; return m[k] ? col.querySelector(m[k]) : null; };
  let at = now;
  for (const k of order) {
    if (off.includes(k)) continue;
    if (k === 'meta' && metaHtml && !col.querySelector('#ini-meta')) { (at || col.firstElementChild || col).insertAdjacentHTML(at ? 'afterend' : 'beforebegin', metaHtml); at = col.querySelector('[data-in=metacta]'); continue; }
    if (html[k]) { if (at) at.insertAdjacentHTML('afterend', html[k]); else col.insertAdjacentHTML('afterbegin', html[k]); at = col.querySelector(`[data-in=${k}]`); continue; }
    let a = anchorOf(k);
    if (k === 'tambem') { const sh = [...col.querySelectorAll('.v3-sh')].find((x) => /^Também lendo/.test(x.textContent.trim())); a = sh && (sh.nextElementSibling || sh); }
    if (k === 'fila' && a) a = a.nextElementSibling || a;
    if (a) at = a;
  }
  paintCv(box);
  box.querySelectorAll('[data-in] [data-go]').forEach((b) => b.addEventListener('click', (ev) => { ev.stopPropagation(); inGo(b.dataset.go); }));
  box.querySelectorAll('[data-in=rede] .rd-card').forEach((c) => c.addEventListener('click', (ev) => {
    const v = ev.target.closest('.rd-veil'); if (v) { ev.stopPropagation(); v.parentElement.classList.remove('spoil'); v.remove(); return; }
    inGo('rede');
  }));
  box.querySelectorAll('[data-al]').forEach((b) => b.addEventListener('click', () => { const d = S.trends || {}, list = [...(d.friends || []), ...(d.app || []), ...(d.topRated || [])].filter((x, i, a) => a.findIndex((y) => y.key === x.key) === i); const x = list[+b.dataset.al]; if (!x) return; const mine = lib().find((e) => normT(e.title) === x.key); if (mine) return openBookPage(mine, 'inicio'); openAnyBook(x.title, x.author || null, x.cover || null); }));
}
function inGo(k) {
  if (k === 'post') return openRdComposer();
  if (k === 'buscar') return goTab('buscar');
  if (k === 'hist') return openHistory();
  if (k === 'meta') return setYearGoal(todayISO().slice(0, 4));
  if (k === 'amigos') return openFriendsV3();
  if (k === 'stats') return goTab('progresso');
  if (k === 'rede') { S.comSeg = 'rede'; return goTab('comunidade'); }
}
// dados da Rede e do Em alta para o Início (5 min de cache)
function inLoad() {
  if (!connected() || !socialProfile) return;
  if (!S.rd.busy && Date.now() - (S.rd.at || 0) > 5 * 60000) { S.rd.busy = true; sapi('GET', '/v1/rede').then((r) => { if (r.status === 200 && r.data) { S.rd.items = r.data.items || []; S.rd.more = !!r.data.more; S.rd.admin = !!r.data.admin; S.rd.at = Date.now(); } }).catch(() => {}).finally(() => { S.rd.busy = false; if (S.tab === 'inicio') paintInicioMais(); }); }
  if (!S.trends || Date.now() - S.trends.at > 5 * 60000) { if (!S.trBusy) { S.trBusy = true; sapi('GET', '/v1/trends').then((r) => { if (r.status === 200 && r.data) S.trends = { ...r.data, at: Date.now() }; }).catch(() => {}).finally(() => { S.trBusy = false; if (S.tab === 'inicio') paintInicioMais(); }); } }
}
{ const _dt = drawTab; drawTab = function () { const r = _dt.apply(this, arguments); if (S.tab === 'inicio') { try { paintInicioMais(); inLoad(); } catch (err) { console.warn('início', err); } setTimeout(maybeTour, 900); } return r; }; }

// ---------- tour ----------
const TOUR = [
  [null, 'Boas-vindas ao Livroverso', 'Um tour rápido pelo app. Leva menos de um minuto.'],
  ['#tabbar [data-tab=inicio]', 'Início', 'O livro que você está lendo, sua semana, a meta do ano e o que a comunidade está comentando. Toque no livro para atualizar a página em que parou.'],
  ['#tabbar [data-tab=estante]', 'Estante', 'A Biblioteca tem todos os seus livros: lendo, lidos e na fila. Crie estantes suas, como "Clube do livro" ou "Para reler".'],
  ['#tabbar [data-tab=buscar]', 'Buscar', 'Ache um livro e coloque na estante. Começou a ler? Escolha "Estou lendo".'],
  ['#tabbar [data-tab=comunidade]', 'Comunidade', 'Na Comunidade, comentários, trechos e indicações sobre livros, com controle de spoiler. Em Amigos, quem você segue e as leituras conjuntas.'],
  ['#tabbar [data-tab=eu]', 'Perfil', 'Seu @usuário, conquistas e o que você já leu.'],
  ['#g-av', 'Menu', 'Metas, estatísticas, conquistas, trazer seu histórico de outro app e ajustes.'],
  [null, 'Pronto!', 'Comece buscando o livro que você está lendo agora. Boa leitura!'],
];
function startTour() {
  try { closeDrawer(); } catch {} const old = TR.querySelector('.tour'); if (old) old.remove();
  const ov = document.createElement('div'); ov.className = 'tour'; ov.innerHTML = '<div class="hole none"></div><div class="tip" role="dialog" aria-live="polite"></div>'; TR.append(ov);
  let i = 0; const hole = ov.querySelector('.hole'), tip = ov.querySelector('.tip');
  const end = () => { ov.remove(); db.prefs = { ...(db.prefs || {}), tourDone: todayISO() }; save(); };
  const show = () => {
    const [sel, h, p] = TOUR[i], el = sel ? TR.querySelector(sel) || document.querySelector(sel) : null, last = i === TOUR.length - 1;
    tip.innerHTML = `<h4>${h}</h4><p>${p}</p><div class="tb"><button type="button" class="sk">${last ? '' : 'Pular'}</button><small>${i + 1} de ${TOUR.length}</small><button type="button" class="nx">${last ? 'Começar' : i ? 'Próximo' : 'Vamos lá'}</button></div>`;
    if (el && el.getBoundingClientRect().width) { const r = el.getBoundingClientRect(), pad = 6; hole.className = 'hole'; Object.assign(hole.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
      const below = r.top < innerHeight / 2; tip.style.top = below ? Math.min(innerHeight - 230, r.bottom + 16) + 'px' : ''; tip.style.bottom = below ? '' : Math.max(16, innerHeight - r.top + 16) + 'px'; }
    else { hole.className = 'hole none'; hole.removeAttribute('style'); tip.style.top = '30%'; tip.style.bottom = ''; }
    tip.querySelector('.nx').addEventListener('click', () => { if (last) return end(); i++; show(); });
    tip.querySelector('.sk').addEventListener('click', () => { if (!last) end(); });
  };
  show();
}
function maybeTour() {
  const p = db.prefs || {};
  if (!p.newAcc || p.tourDone || !p.tasteAsked || S.tab !== 'inicio' || TR.querySelector('.tour')) return;
  const busy = !$('#shelflist').hidden || !$('#editor').hidden; if (busy) return;
  startTour();
}
{ const _ar = afterRegister; afterRegister = function () { db.prefs = { ...(db.prefs || {}), newAcc: todayISO() }; save(); return _ar.apply(this, arguments); }; }
window.bearTour = startTour;
{ const _da = drawAjustes; drawAjustes = function (box) { _da(box); if (S.ajMode === 'perfil' || box.querySelector('#aj-tour')) return; const out = box.querySelector('#aj-out'); if (!out) return;
  out.insertAdjacentHTML('beforebegin', '<div class="aj-card" style="margin-bottom:.8rem"><button type="button" class="aj-row" id="aj-tour"><span><b>Ver o tour do app</b><small>Um passeio rápido pelas telas</small></span>›</button></div>');
  $('#aj-tour', box).addEventListener('click', () => { goTab('inicio'); setTimeout(startTour, 300); }); }; }
