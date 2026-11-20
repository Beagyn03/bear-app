// v2 Desejos e Presentes (Bia, 19/11/2026, branch livroverso-2; desenho aprovado no protótipo v3).
//  Perfil (o seu e o da amizade) ganha as abas Perfil · Desejos. Desejos = a lista "Quero ter" em grade de capas.
//   - Seu: dica no topo, "+ Adicionar" como primeiro item (busca e marca Quero ter), esconder/mostrar para as amizades.
//   - Da amizade: "Vou dar" abre a folha com prazo (Em 15 dias, Em 30 dias, Natal, Escolher data); depois aparece
//     "Você vai dar · até dd/mm"; reservado por outra pessoa aparece "Alguém já vai dar". A dona não vê nada até a entrega.
//  Presentes (menu lateral) vira página com abas Vou dar · Já dei · Ganhei, lida da API (/v1/gifts, migração 029).
//   Vou dar: Já dei, Mudar data, Onde comprar, Desistir; "vence em N dias: ainda está de pé?"; reserva vencida mostra
//   "a reserva caiu" com Reservar de novo. O "vou dar" do servidor é espelhado em db.gifts (contador do menu e aviso do Hoje).
//  Desligado em Funções do app (Empréstimos e presentes), as abas somem e o perfil volta a ser uma tela só.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .ex-wish{display:none!important}
.v2ptabs{display:flex;margin:.2rem 0 .9rem;border-bottom:1px solid var(--line)}
.v2ptabs button{flex:1;border:0;background:none;padding:.65rem 0 .55rem;font:inherit;font-size:.86rem;font-weight:800;color:var(--ink-2);border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;white-space:nowrap}
.v2ptabs button.on{color:var(--ink);border-bottom-color:var(--acc)}
#shelflist.v2des .sl-body > :not(.sl-top):not(.v2pv):not(.yo-top):not(.yo-nums):not(.v2ptabs):not(.v2wish){display:none!important}
#shelflist:not(.v2des) .v2wish{display:none!important}
.v2tip{display:flex;gap:.5rem;align-items:flex-start;border:1px solid var(--line);background:color-mix(in srgb,var(--acc) 7%,var(--panel));border-radius:14px;padding:.6rem .7rem;font-size:.8rem;line-height:1.4;color:var(--ink-2);margin-bottom:.8rem}
.v2tip span{flex:1}.v2tip b{color:var(--ink)}
.v2tip button{flex:none;border:0;background:none;color:var(--ink-2);font:inherit;font-size:1rem;line-height:1;padding:.1rem .2rem;cursor:pointer}
.v2wgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem .6rem}
.v2wi{display:grid;justify-items:center;align-content:start;gap:.2rem;text-align:center;min-width:0}
.v2wi > button.cvb{border:0;background:none;padding:0;cursor:pointer}
.v2wi .cv{width:84px!important;height:126px!important;border-radius:3px 7px 7px 3px!important;font-size:.55rem!important;box-shadow:0 6px 14px rgba(0,0,0,.18)}
.v2wi b{font-size:.78rem;line-height:1.2;margin-top:.2rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:100%}
.v2wi small{font-size:.68rem;color:var(--ink-2);font-weight:700;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v2wg{display:inline-flex;align-items:center;gap:.25rem;margin-top:.2rem;border:1.5px solid var(--line);background:var(--panel);border-radius:99px;padding:.25rem .6rem;font:inherit;font-size:.72rem;font-weight:900;color:var(--ink);cursor:pointer;white-space:nowrap}
.v2wg.on{background:color-mix(in srgb,#c2569a 14%,var(--panel));border-color:transparent;color:#a53d80}
.v2wg.taken{border-style:dashed;color:var(--ink-2);cursor:default;background:none}
.v2wdt{font-size:.66rem!important;color:#a53d80!important;font-weight:800}
.v2wadd{display:grid;place-items:center;align-content:center;gap:.25rem;width:84px;height:126px;border:2px dashed var(--line);border-radius:8px;background:none;color:var(--acc);font:inherit;font-size:.78rem;font-weight:900;cursor:pointer}
.v2wadd i{font-style:normal;font-size:1.5rem;line-height:1}
.v2wfoot{display:flex;justify-content:space-between;align-items:center;gap:.6rem;margin-top:1rem;font-size:.76rem;color:var(--ink-2)}
.v2wfoot button{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;cursor:pointer;padding:0}
.v2wempty{border:1px dashed var(--line);border-radius:14px;padding:1rem;font-size:.84rem;color:var(--ink-2);text-align:center;line-height:1.45}
.gfd-ch{display:flex;flex-wrap:wrap;gap:.4rem;margin:.3rem 0 .2rem}
.gfd-ch button{border:1.5px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:.4rem .75rem;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}
.gfd-ch button.on{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.gfd-in{display:block;margin:.5rem 0 0;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font:inherit;padding:.45rem .6rem}
.gfd-tx{font-size:.76rem;color:var(--ink-2);line-height:1.45;margin:.7rem 0 .2rem}
.gfm-l{display:grid;margin-top:.4rem}
.gfm-l button{display:grid;grid-template-columns:28px minmax(0,1fr);gap:.55rem;align-items:center;width:100%;border:0;border-bottom:1px solid var(--line);background:none;padding:.7rem .1rem;font:inherit;color:var(--ink);text-align:left;cursor:pointer}
.gfm-l button i{font-style:normal;font-size:1.05rem;text-align:center}
.gfm-l button b{display:block;font-size:.9rem}.gfm-l button small{display:block;font-size:.74rem;color:var(--ink-2)}
.gfm-l button.dng b{color:#c0392b}
.v2pr-tabs{display:flex;margin:0 0 .9rem;border-bottom:1px solid var(--line)}
.v2pr-tabs button{flex:1;border:0;background:none;padding:.65rem 0 .55rem;font:inherit;font-size:.84rem;font-weight:800;color:var(--ink-2);border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;white-space:nowrap}
.v2pr-tabs button.on{color:var(--ink);border-bottom-color:var(--acc)}
.v2pr-note{font-size:.76rem;color:var(--ink-2);margin:0 .1rem .7rem}
.v2gc{display:grid;grid-template-columns:48px minmax(0,1fr);gap:.75rem;border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.7rem .75rem;margin-bottom:.6rem}
.v2gc .cv{width:48px!important;height:72px!important;border-radius:3px 6px 6px 3px!important;font-size:.42rem!important}
.v2gc > div{min-width:0;display:grid;gap:.15rem;align-content:start}
.v2gc b{font-size:.92rem}.v2gc small{font-size:.76rem;color:var(--ink-2)}
.v2gc.done{opacity:.8}.v2gc.off{opacity:.7}
.v2gc .soon{font-size:.76rem;font-weight:900;color:var(--acc)}.v2gc .late{font-size:.76rem;font-weight:900;color:#c0392b}
.v2gc .act{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.45rem}
.v2gc .act button{border:1.5px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:.3rem .7rem;font:inherit;font-size:.74rem;font-weight:800;cursor:pointer;white-space:nowrap}
.v2gc .act button.p{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.v2gc .act button.dng{color:#c0392b}
:host(.v2off-emprest) .v2ptabs,:host(.v2off-emprest) .v2wish{display:none!important}
`; TR.append(st); }
// ---------- dados ----------
const gfSrv = { at: 0, giving: null, given: [], received: [] };
const gfAddDays = (n) => { const d = new Date(todayISO() + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const gfDaysTo = (iso) => Math.round((Date.parse(iso + 'T12:00:00') - Date.parse(todayISO() + 'T12:00:00')) / 864e5);
const gfFirst = (n) => String(n || '').split(' ')[0];
const gfDY = (iso) => (iso ? String(iso).slice(8, 10) + '/' + String(iso).slice(5, 7) + '/' + String(iso).slice(0, 4) : '');
const gfCover = (c) => (c && !/^data:/.test(c) && String(c).length < 600 ? c : null);
const gfPath = (h) => '/v1/users/' + encodeURIComponent(String(h || '').replace(/^@/, '')) + '/gifts';
async function gfPull(force) {
  if (!connected()) return gfSrv;
  if (!force && gfSrv.giving && Date.now() - gfSrv.at < 60e3) return gfSrv;
  try { const r = await sapi('GET', '/v1/gifts');
    if (r && r.status === 200 && r.data && Array.isArray(r.data.giving)) {
      Object.assign(gfSrv, r.data, { at: Date.now() });
      // espelho no aparelho: contador do menu lateral e aviso de entrega no Hoje
      const old = gfList();
      db.gifts = r.data.giving.filter((g) => !g.expired && g.person && g.person.handle).map((g) => { const o = old.find((x) => x.h === g.person.handle && normT(x.title) === normT(g.title)) || {};
        return { h: g.person.handle, name: g.person.displayName || g.person.handle, title: g.title, author: g.author || null, cover: g.cover || null, at: String(g.at || '').slice(0, 10), ...(g.due ? { due: g.due } : {}), ...(o.bought ? { bought: true } : {}) }; });
      save();
    } } catch {}
  return gfSrv; }
setTimeout(() => gfPull(true), 5000);
// ---------- folhas ----------
function gfSheetBox(cls, html) {
  TR.querySelector('.esn-sheet.' + cls)?.remove();
  const sh = document.createElement('div'); sh.className = 'esn-sheet ' + cls; sh.innerHTML = '<div class="box">' + html + '</div>';
  try { paintCv(sh); } catch {} TR.append(sh); return sh; }
// escolher a data da reserva; devolve a data (AAAA-MM-DD) ou null
function gfDueSheet(o) { return new Promise((res) => {
  const y = +todayISO().slice(0, 4), xmas = (y + '-12-25') >= todayISO() ? y + '-12-25' : (y + 1) + '-12-25';
  const OPT = [['Em 15 dias', gfAddDays(15)], ['Em 30 dias', gfAddDays(30)], ['Natal · 25/12', xmas]];
  let pick = o.cur && o.cur >= todayISO() ? o.cur : OPT[1][1], done = false;
  const sh = gfSheetBox('gfd-sh', '<div class="ex-hd">' + cvh(o.title, o.cover, '') + '<div><b>' + esc(o.head) + '</b><small>' + esc(o.sub) + '</small></div></div>'
    + '<h4>Até quando?</h4><div class="gfd-ch">' + OPT.map(([n, d]) => '<button type="button" data-d="' + d + '">' + n + '</button>').join('') + '<button type="button" data-d="">Escolher data</button></div>'
    + '<input type="date" class="gfd-in" min="' + todayISO() + '" max="' + gfAddDays(400) + '" value="' + pick + '" hidden>'
    + (o.note ? '<p class="gfd-tx">' + o.note + '</p>' : '')
    + '<div class="acts"><button type="button" data-a="x">Cancelar</button><button type="button" class="p" data-a="ok"></button></div>');
  const inp = sh.querySelector('.gfd-in'), bt = [...sh.querySelectorAll('.gfd-ch button')];
  const mark = (manual) => { let hit = false; bt.forEach((b) => { const on = !manual && !!b.dataset.d && b.dataset.d === pick; b.classList.toggle('on', on); hit = hit || on; });
    if (!hit) { bt[bt.length - 1].classList.add('on'); inp.hidden = false; } else inp.hidden = true;
    sh.querySelector('[data-a=ok]').textContent = o.cta + ' · até ' + exD(pick); };
  const end = (v) => { if (done) return; done = true; sh.remove(); res(v); };
  bt.forEach((b) => b.addEventListener('click', () => { if (b.dataset.d) { pick = b.dataset.d; inp.value = pick; mark(false); } else { mark(true); try { inp.showPicker && inp.showPicker(); } catch {} } }));
  inp.addEventListener('change', () => { if (inp.value) { pick = inp.value; mark(true); } });
  sh.querySelector('[data-a=ok]').addEventListener('click', () => { if (!pick || pick < todayISO()) return toast('Escolha uma data a partir de hoje'); end(pick); });
  sh.querySelector('[data-a=x]').addEventListener('click', () => end(null));
  sh.addEventListener('click', (ev) => { if (ev.target === sh) end(null); });
  mark(false);
}); }
const GF_NOTE = 'O livro fica reservado só até essa data. Uma semana antes a gente pergunta se ainda está de pé. Se passar da data, a reserva cai e o livro volta a ficar livre para outras pessoas.';
// reservar um livro do Desejos de uma amizade
async function gfReserve(h, name, b, after) {
  if (!connected()) return toast('Entre na sua conta para reservar presentes');
  const due = await gfDueSheet({ title: b.title, cover: b.cover, head: 'Vou dar ' + b.title, sub: 'para ' + gfFirst(name || '@' + h), cta: 'Reservar', note: GF_NOTE, cur: b.due });
  if (!due) return;
  const r = await sapi('POST', gfPath(h), { title: String(b.title).slice(0, 300), due, author: b.author || null, cover: gfCover(b.cover) }).catch(() => null);
  if (r && r.status === 409) toast('Outra amizade já vai dar este livro');
  else if (!r || r.status >= 300) toast('Não consegui reservar agora');
  else toast('Reservado até ' + exD(due) + '. Fica em Presentes');
  await gfPull(true); after && after();
}
// o que fazer com um presente que você vai dar
function gfManage(g, after) {
  const who = gfFirst(g.name || '@' + g.h);
  const sh = gfSheetBox('gfm-sh', '<div class="ex-hd">' + cvh(g.title, g.cover, '') + '<div><b>Presente para ' + esc(who) + '</b><small>' + esc(g.title) + (g.due ? ' · reservado até ' + exD(g.due) : '') + '</small></div></div>'
    + '<div class="gfm-l">'
    + '<button type="button" data-a="given"><i>✓</i><span><b>Já dei</b><small>sai de Vou dar; ' + esc(who) + ' passa a ver em Ganhei</small></span></button>'
    + '<button type="button" data-a="date"><i>📅</i><span><b>Mudar a data</b><small>adiar ou antecipar a reserva</small></span></button>'
    + '<button type="button" data-a="buy"><i>🛒</i><span><b>Onde comprar</b><small>lojas com o livro já buscado</small></span></button>'
    + '<button type="button" class="dng" data-a="quit"><i>✕</i><span><b>Não vou mais dar</b><small>o livro volta a ficar livre para outras pessoas</small></span></button>'
    + '</div><div class="acts" style="grid-template-columns:1fr"><button type="button" data-a="x">Fechar</button></div>');
  const close = () => sh.remove();
  sh.querySelector('[data-a=x]').addEventListener('click', close); sh.addEventListener('click', (ev) => { if (ev.target === sh) close(); });
  sh.querySelector('[data-a=buy]').addEventListener('click', () => { close(); whereToBuy(g); });
  sh.querySelector('[data-a=given]').addEventListener('click', async () => { close(); await gfAct(g, 'given'); after && after(); });
  sh.querySelector('[data-a=date]').addEventListener('click', async () => { close(); await gfAct(g, 'date'); after && after(); });
  sh.querySelector('[data-a=quit]').addEventListener('click', async () => { close(); await gfAct(g, 'quit'); after && after(); });
}
async function gfAct(g, a) {
  const who = gfFirst(g.name || '@' + g.h);
  if (a === 'given') { const r = await sapi('POST', gfPath(g.h) + '/given', { title: g.title }).catch(() => null);
    if (r && r.status < 300) toast('Presente entregue. Está em Já dei'); else toast('Não consegui agora'); }
  if (a === 'date' || a === 'again') {
    const due = await gfDueSheet({ title: g.title, cover: g.cover, head: a === 'again' ? 'Reservar de novo' : 'Nova data', sub: g.title + ' · para ' + who, cta: a === 'again' ? 'Reservar' : 'Salvar data', note: a === 'again' ? GF_NOTE : '', cur: g.due });
    if (!due) return;
    const r = a === 'again' ? await sapi('POST', gfPath(g.h), { title: g.title, due, author: g.author || null, cover: gfCover(g.cover) }).catch(() => null)
      : await sapi('PATCH', gfPath(g.h), { title: g.title, due }).catch(() => null);
    if (r && r.status === 409) toast('Outra amizade reservou este livro depois que a sua reserva caiu');
    else if (r && r.status < 300) toast('Reservado até ' + exD(due)); else toast('Não consegui agora'); }
  if (a === 'quit') { const r = await sapi('DELETE', gfPath(g.h) + '?title=' + encodeURIComponent(g.title)).catch(() => null);
    if (r && r.status < 300) toast('Presente liberado para outra amizade'); else toast('Não consegui agora'); }
  await gfPull(true);
}
// ---------- página Presentes: Vou dar · Já dei · Ganhei ----------
openGifts = function () {
  const v = $('#shelflist'); try { closeEd(); } catch {} v.classList.remove('feedview', 'tabroot', 'mine-page', 'v2des');
  const tab = () => S.v2prTab || 'dar';
  const card = (g, kind) => { const who = gfFirst(g.person && (g.person.displayName || g.person.handle)) || 'alguém', d = g.due ? gfDaysTo(g.due) : null;
    if (kind === 'dei') return '<div class="v2gc done">' + cvh(g.title, g.cover, '') + '<div><b>' + esc(g.title) + '</b><small>para ' + esc(who) + ' · entregue em ' + gfDY(String(g.givenAt).slice(0, 10)) + '</small></div></div>';
    if (kind === 'ganhei') return '<div class="v2gc done">' + cvh(g.title, g.cover, '') + '<div><b>' + esc(g.title) + '</b><small>de ' + esc(who) + ' · ' + gfDY(String(g.givenAt).slice(0, 10)) + '</small></div></div>';
    if (g.expired) return '<div class="v2gc off">' + cvh(g.title, g.cover, '') + '<div><b>' + esc(g.title) + '</b><small>para ' + esc(who) + '</small><span class="late">A reserva caiu' + (g.due ? ' em ' + exD(gfAddDaysFrom(g.due, 1)) : '') + '</span>'
      + '<div class="act"><button type="button" class="p" data-a="again" data-k="' + esc(g.bookKey) + '">Reservar de novo</button></div></div></div>';
    return '<div class="v2gc">' + cvh(g.title, g.cover, '') + '<div><b>' + esc(g.title) + '</b><small>para ' + esc(who) + (g.due ? ' · até ' + exD(g.due) : ' · sem data') + '</small>'
      + (d != null && d <= 7 ? '<span class="soon">' + (d <= 0 ? 'vence hoje' : 'vence em ' + d + (d === 1 ? ' dia' : ' dias')) + ': ainda está de pé?</span>' : '')
      + '<div class="act"><button type="button" class="p" data-a="given" data-k="' + esc(g.bookKey) + '">✓ Já dei</button><button type="button" data-a="date" data-k="' + esc(g.bookKey) + '">Mudar data</button><button type="button" data-a="buy" data-k="' + esc(g.bookKey) + '">Onde comprar</button><button type="button" class="dng" data-a="quit" data-k="' + esc(g.bookKey) + '">Desistir</button></div></div></div>'; };
  const draw = () => {
    const off = !gfSrv.giving, t = tab();
    const giving = gfSrv.giving || gfList().map((g) => ({ bookKey: exKey(g.title), title: g.title, author: g.author, cover: g.cover, due: g.due || null, expired: false, person: { handle: g.h, displayName: g.name } }));
    const L = { dar: giving, dei: gfSrv.given || [], ganhei: gfSrv.received || [] };
    const tabs = '<div class="v2pr-tabs" role="tablist">' + [['dar', 'Vou dar · ' + giving.filter((g) => !g.expired).length], ['dei', 'Já dei · ' + L.dei.length], ['ganhei', 'Ganhei · ' + L.ganhei.length]]
      .map(([k, n]) => '<button type="button" role="tab" aria-selected="' + (t === k) + '" class="' + (t === k ? 'on' : '') + '" data-t="' + k + '">' + n + '</button>').join('') + '</div>';
    const EMPTY = { dar: 'Nenhum presente reservado. No perfil de uma amizade, abra Desejos e toque em “Vou dar”.', dei: 'Os presentes que você entregar aparecem aqui.', ganhei: 'Quando uma amizade marcar que te deu um livro, ele aparece aqui.' };
    v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Presentes</b><span></span></div>' + tabs
      + (t === 'dar' ? '<p class="v2pr-note">Só você vê esta lista.' + (off && connected() ? ' Carregando…' : '') + '</p>' : '')
      + (L[t].length ? L[t].map((g) => card(g, t)).join('') : '<p class="v2wempty">' + EMPTY[t] + '</p>');
    try { paintCv(v); } catch {}
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; try { syncTopTitle(); } catch {} });
    v.querySelectorAll('.v2pr-tabs [data-t]').forEach((b) => b.addEventListener('click', () => { S.v2prTab = b.dataset.t; draw(); }));
    v.querySelectorAll('.v2gc [data-a]').forEach((b) => b.addEventListener('click', async () => {
      const x = giving.find((g) => g.bookKey === b.dataset.k); if (!x) return;
      const g = { h: x.person.handle, name: x.person.displayName || x.person.handle, title: x.title, author: x.author, cover: x.cover, due: x.due };
      if (b.dataset.a === 'buy') return whereToBuy(g);
      await gfAct(g, b.dataset.a); draw(); }));
  };
  S.listRedraw = draw; draw(); v.hidden = false; v.scrollTop = 0; try { syncTopTitle(); } catch {}
  gfPull(true).then(() => { if (!v.hidden && S.listRedraw === draw) draw(); });
};
const gfAddDaysFrom = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
// ---------- perfil: abas Perfil · Desejos ----------
const v2WishMine = () => lib().filter((e) => exOf(e).own === 'quero');
async function v2WishPaint(v, d) {
  let p = v.querySelector('.v2wish'); if (!p) { p = document.createElement('section'); p.className = 'v2wish'; v.querySelector('.sl-body').append(p); }
  const P = db.prefs || {}, mine = !!d.self, who = gfFirst(d.displayName || '@' + d.handle);
  const tip = (k, txt) => (P[k] ? '' : '<div class="v2tip"><span><b>Dica:</b> ' + txt + '</span><button type="button" data-tip="' + k + '" aria-label="Entendi">✕</button></div>');
  if (mine) {
    const L = v2WishMine(), hide = !!P.wishHide;
    p.innerHTML = tip('tipWm', 'suas amizades podem marcar “Vou dar” nesta lista. Você não fica sabendo quem, para não estragar a surpresa.')
      + '<div class="v2wgrid"><div class="v2wi"><button type="button" class="v2wadd" data-a="add"><i>+</i><span>Adicionar</span></button></div>'
      + L.map((e) => '<div class="v2wi"><button type="button" class="cvb" data-id="' + esc(String(e.id)) + '">' + cvh(e.title, e.cover, '') + '</button><b>' + esc(e.title) + '</b><small>' + esc(String(e.author || '').split(',')[0]) + '</small></div>').join('') + '</div>'
      + (L.length ? '' : '<p class="v2wempty" style="margin-top:.9rem">Marque “Quero ter” nos livros que você gostaria de ganhar. Eles aparecem aqui e no seu perfil.</p>')
      + '<div class="v2wfoot"><span>' + (hide ? 'Escondido: só você vê.' : 'Suas amizades veem esta lista.') + '</span><button type="button" data-a="hide">' + (hide ? 'Mostrar para as amizades' : 'Esconder das amizades') + '</button></div>';
  } else {
    const L = (d.shelf && d.shelf.wish) || [];
    let claims = new Map();
    if (L.length && connected()) { try { const g = await sapi('GET', gfPath(d.handle)); if (g && g.status === 200 && g.data) claims = new Map((g.data.claims || []).map((c) => [String(c.bookKey).replace(/[^a-z0-9]/g, ''), c])); } catch {} }
    if (S.fpData !== d) return;
    p.innerHTML = (L.length ? tip('tipWf', 'ao tocar em “Vou dar”, o livro fica reservado para você até a data que escolher. As outras amizades veem só “Alguém já vai dar”, e ' + esc(who) + ' não vê nada.') : '')
      + (L.length ? '<div class="v2wgrid">' + L.map((b, i) => { const c = claims.get(exKey(b.title));
          const st = c && c.mine ? '<button type="button" class="v2wg on" data-g="' + i + '">🎁 Você vai dar</button>' + (c.due ? '<small class="v2wdt">até ' + exD(c.due) + '</small>' : '')
            : c ? '<span class="v2wg taken">🎁 Alguém já vai dar</span>' : '<button type="button" class="v2wg" data-g="' + i + '">🎁 Vou dar</button>';
          return '<div class="v2wi"><button type="button" class="cvb" data-i="' + i + '">' + cvh(b.title, b.cover, '') + '</button><b>' + esc(b.title) + '</b><small>' + esc(String(b.author || '').split(',')[0]) + '</small>' + st + '</div>'; }).join('') + '</div>'
        : '<p class="v2wempty">' + esc(who) + ' ainda não marcou livros em “Quero ter”.</p>');
    p.querySelectorAll('[data-g]').forEach((bt) => bt.addEventListener('click', () => { const b = L[+bt.dataset.g], c = claims.get(exKey(b.title)), redo = () => { if (S.fpData === d) v2WishPaint(v, d); };
      if (c && c.mine) gfManage({ h: d.handle, name: d.displayName || d.handle, title: b.title, author: b.author, cover: b.cover, due: c.due || null }, redo);
      else gfReserve(d.handle, d.displayName, b, redo); }));
    p.querySelectorAll('.cvb[data-i]').forEach((bt) => bt.addEventListener('click', () => { const b = L[+bt.dataset.i]; try { openAnyBook(b.title, b.author, b.cover); } catch {} }));
  }
  try { paintCv(p); } catch {}
  p.querySelectorAll('[data-tip]').forEach((b) => b.addEventListener('click', () => { db.prefs = { ...(db.prefs || {}), [b.dataset.tip]: 1 }; save(); b.closest('.v2tip').remove(); }));
  p.querySelectorAll('.cvb[data-id]').forEach((b) => b.addEventListener('click', () => { const e = byId(b.dataset.id); if (e) try { openBookPage(e); } catch {} }));
  p.querySelector('[data-a=hide]')?.addEventListener('click', () => { db.prefs = { ...(db.prefs || {}), wishHide: !(db.prefs || {}).wishHide }; save(); try { publishSnapshot(); } catch {} v2WishPaint(v, d); });
  p.querySelector('[data-a=add]')?.addEventListener('click', () => searchSheet({ title: 'Adicionar a Desejos', onPick: (it) => {
    let e = lib().find((x) => normT(x.title) === normT(it.title)); if (!e) e = addToLibrary(it, null, 'QUERO', { quiet: true });
    if (!e) return; e.ex = { ...exOf(e), own: 'quero' }; save(); try { publishSnapshot(); } catch {} toast('“' + e.title + '” está nos seus Desejos'); v2WishPaint(v, d); } }));
}
{ let tm = 0; const put = () => {
    const v = $('#shelflist'), d = S.fpData; if (!v || v.hidden || !d || !d.handle) { v && v.classList.remove('v2des'); return; }
    const body = v.querySelector('.sl-body'); if (!body) return;
    const isProf = !!(body.querySelector(':scope > .yo-top') || body.querySelector(':scope > .v2pv'));
    if (!isProf || !v2Mods().emprest) { v.classList.remove('v2des'); body.querySelector(':scope > .v2ptabs')?.remove(); return; }
    if (S.v2ptabH !== d.handle) { S.v2ptabH = d.handle; S.v2ptab = 'perfil'; }
    const anchor = body.querySelector(':scope > .v2pv') || body.querySelector(':scope > .yo-nums') || body.querySelector(':scope > .yo-top');
    let tb = body.querySelector(':scope > .v2ptabs');
    if (!tb) { tb = document.createElement('div'); tb.className = 'v2ptabs'; tb.setAttribute('role', 'tablist');
      tb.innerHTML = [['perfil', 'Perfil'], ['des', 'Desejos']].map(([k, n]) => '<button type="button" role="tab" data-pt="' + k + '">' + n + '</button>').join('');
      tb.querySelectorAll('[data-pt]').forEach((b) => b.addEventListener('click', () => { S.v2ptab = b.dataset.pt; put(); v.scrollTop = Math.min(v.scrollTop, Math.max(0, tb.offsetTop - 60)); })); }
    if (anchor && anchor.nextElementSibling !== tb) anchor.after(tb);
    tb.querySelectorAll('[data-pt]').forEach((b) => { const on = b.dataset.pt === S.v2ptab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    const w = body.querySelector(':scope > .v2wish'); if (w && w.dataset.h !== d.handle) w.remove();
    v.classList.toggle('v2des', S.v2ptab === 'des');
    if (S.v2ptab === 'des' && !body.querySelector(':scope > .v2wish')) { const s = document.createElement('section'); s.className = 'v2wish'; s.dataset.h = d.handle; body.append(s); v2WishPaint(v, d); }
  };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 120); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
