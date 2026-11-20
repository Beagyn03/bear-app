// Voltar sempre para a tela de onde veio (auditoria de 15/11): pilha de páginas do #shelflist.
// Cada página interna aberta por cima de outra guarda a anterior; o "‹ Voltar" (e o voltar do celular, que clica nele)
// reabre a anterior em vez de só esconder a lista (que mostrava a aba de baixo ou um conteúdo velho).
// Tela de Ajustes/Editar perfil e Estatísticas (abertas pelo menu lateral ou pelo perfil) voltam para a origem.
S.nav = { st: [], cur: null, depth: 0, restoring: false, hidAt: 0, ntAt: 0, bar: 0, origin: null };
function navEnter(fn, tab) {
  const N = S.nav; if (N.depth > 0) return; N.flush && N.flush();
  const entry = { fn, tab: tab || S.tab };
  // a mesma página reaberta (ex.: a conversa se redesenha sozinha) não empilha de novo: senão o Voltar reabre ela mesma (19/11)
  if (!N.restoring && fn && fn.key && N.cur && N.cur.fn && N.cur.fn.key === fn.key && $('#shelflist') && !$('#shelflist').hidden) { N.cur = entry; return; }
  if (N.restoring) { N.cur = entry; return; }
  const v = $('#shelflist'), vis = !!(v && !v.hidden), recent = Date.now() - N.hidAt < 140;
  if (Date.now() - N.bar < 400) N.st = [];
  else if ((vis || recent) && N.cur) N.st.push(N.cur);
  else N.st = [];
  if (Date.now() - N.ntAt < 140 && typeof openNotif === 'function') N.st.push({ fn: () => openNotif(), tab: S.tab, nt: 1 });
  if (N.st.length > 30) N.st.splice(0, N.st.length - 30);
  N.cur = entry;
}
function navBack() { // volta uma página; false se não havia para onde
  const N = S.nav, e = N.st.pop(); if (!e) return false;
  N.restoring = true;
  try { if (e.nt) { const v = $('#shelflist'); if (v) v.hidden = true; e.fn(); N.cur = null; return true; } if (e.tab && e.tab !== S.tab && e.tab !== 'eu') goTab(e.tab); e.fn(); } catch (err) { console.warn('voltar', err); }
  finally { N.restoring = false; }
  return true;
}
function navToProfileEntry() { return { fn: () => goTab('eu'), tab: 'eu' }; }
{ // envolve quem abre página no #shelflist
  const navKey = (name, a) => { try { return name + '|' + JSON.stringify(a.map((x) => (x && typeof x === 'object' ? x.id || x.handle || x.title || '' : x))); } catch { return null; } };
  // skip: chamadas que só desenham dentro de outra tela (ex.: o feed embutido no Início) não contam como navegação (19/11)
  const wrap = (get, set, mk, skip) => { const o = get(); if (typeof o !== 'function') return; const name = o.name || String(Math.random()); set(function (...a) {
    if (skip && skip(a)) return o.apply(this, a);
    const fn = mk(a); fn.key = navKey(name, a); navEnter(fn); const N = S.nav; N.depth++;
    let r; try { r = o.apply(this, a); } catch (err) { N.depth--; throw err; }
    if (r && typeof r.then === 'function') r.then(() => { N.depth--; }, () => { N.depth--; }); else N.depth--;
    return r; }); };
  // cada linha: lê e reatribui a função pelo nome (são declarações do arquivo)
  wrap(() => friendPage, (f) => { friendPage = f; }, (a) => () => friendPage(...a));
  wrap(() => openMyProfile, (f) => { openMyProfile = f; }, () => () => goTab('eu'));
  wrap(() => openBookPage, (f) => { openBookPage = f; }, (a) => () => openBookPage(...a));
  wrap(() => openShelfV3, (f) => { openShelfV3 = f; }, (a) => () => openShelfV3(...a));
  wrap(() => openStatusList, (f) => { openStatusList = f; }, (a) => () => openStatusList(...a));
  wrap(() => openAchList, (f) => { openAchList = f; }, () => () => openAchList());
  wrap(() => openAllQuotes, (f) => { openAllQuotes = f; }, () => () => openAllQuotes());
  wrap(() => openHistory, (f) => { openHistory = f; }, () => () => openHistory());
  wrap(() => openPeopleSearch, (f) => { openPeopleSearch = f; }, () => () => openPeopleSearch());
  wrap(() => openFriendsV3, (f) => { openFriendsV3 = f; }, () => () => openFriendsV3());
  wrap(() => openThreads, (f) => { openThreads = f; }, () => () => openThreads());
  wrap(() => openChat, (f) => { openChat = f; }, (a) => () => openChat(...a));
  wrap(() => openNovidades, (f) => { openNovidades = f; }, (a) => () => openNovidades(...a), (a) => !!a[1]); // com host: feed embutido, não é página
  wrap(() => openGoalsV4, (f) => { openGoalsV4 = f; }, () => () => openGoalsV4());
  wrap(() => openGoalPage, (f) => { openGoalPage = f; }, (a) => () => openGoalPage(...a));
  wrap(() => openAuthorPage, (f) => { openAuthorPage = f; }, (a) => () => openAuthorPage(...a));
  wrap(() => openCatalog, (f) => { openCatalog = f; }, () => () => openCatalog());
}
{ // marca quando a lista some e quando as Notificações fecham (para quem fecha e abre outra no mesmo toque)
  const v = $('#shelflist'), ed = $('#editor');
  let was = v && !v.hidden; const chk = () => { const now = !v.hidden; if (was && !now) S.nav.hidAt = Date.now(); was = now; };
  const mo = new MutationObserver(chk); mo.observe(v, { attributes: true, attributeFilter: ['hidden'] });
  S.nav.flush = () => { if (mo.takeRecords().length) chk(); }; // a lista pode ter sumido neste mesmo toque
  let edNt = false; const chkEd = () => { if (!ed.hidden) { edNt = ed.classList.contains('ntpage'); return; } if (edNt) { S.nav.ntAt = Date.now(); edNt = false; } };
  const mo2 = new MutationObserver(chkEd); mo2.observe(ed, { attributes: true, attributeFilter: ['hidden', 'class'] });
  const f1 = S.nav.flush; S.nav.flush = () => { f1(); if (mo2.takeRecords().length) chkEd(); };
}
// menu de baixo: começa do zero
TR.addEventListener('click', (ev) => { if (ev.target.closest && ev.target.closest('#tabbar')) { S.nav.st = []; S.nav.cur = null; S.nav.origin = null; S.nav.bar = Date.now(); } }, true);
// "‹ Voltar" das páginas internas
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('#shelflist .sl-back'); if (!b || b.dataset.own) return;
  if (!S.nav.st.length) { S.nav.cur = null; return; } // nada guardado: comportamento de antes
  ev.stopImmediatePropagation(); ev.preventDefault(); navBack();
}, true);
// Ajustes/Editar perfil e Estatísticas: lembram de onde vieram
{ const _gt = goTab; goTab = function (tab, fromBar) {
  S.nav.flush && S.nav.flush();
  if ((tab === 'perfil' || tab === 'progresso') && !fromBar && !S.nav.restoring && S.tab !== tab) {
    const v = $('#shelflist'), open = (v && !v.hidden) || Date.now() - S.nav.hidAt < 400;
    const onMe = v && v.classList.contains('mine-page') && open;
    S.nav.origin = { tab: S.tab, page: onMe ? navToProfileEntry() : open ? S.nav.cur : null, st: open ? [...S.nav.st] : [] };
  }
  return _gt.apply(this, arguments);
}; }
function navBackOrigin() {
  const o = S.nav.origin; S.nav.origin = null; if (!o) return goTab('inicio');
  S.nav.restoring = true;
  try { if (o.tab && o.tab !== 'perfil' && o.tab !== 'progresso') goTab(o.tab); else goTab('inicio'); if (o.page) { S.nav.st = o.st || []; o.page.fn(); } }
  catch (err) { console.warn('voltar', err); } finally { S.nav.restoring = false; }
}
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('#aj-back'); if (!b || !S.nav.origin) return; ev.stopImmediatePropagation(); ev.preventDefault(); navBackOrigin(); }, true);
// Estatísticas aberta pelo menu lateral: ganha "‹ Voltar"
{ const st = document.createElement('style'); st.textContent = `.sx-back{display:block;width:auto!important;max-width:max-content;justify-self:start;align-self:flex-start;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:800;font-size:.82rem;border-radius:999px;padding:.4rem .8rem;margin:0 0 .5rem}`; TR.append(st); }
{ const _dp = drawProgresso; drawProgresso = function (box) {
  const r = _dp.apply(this, arguments);
  if (S.nav.origin && !box.querySelector('.sx-back')) { box.insertAdjacentHTML('afterbegin', '<button type="button" class="sx-back" id="sx-back">‹ Voltar</button>'); $('#sx-back', box).addEventListener('click', navBackOrigin); }
  return r;
}; }
