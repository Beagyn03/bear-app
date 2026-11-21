// Ajustes de navegação (Bia, 18/11):
// - o menu de baixo volta sempre que a conversa não está mais na tela (algumas saídas da conversa não o devolviam);
// - Estatísticas e Leituras por mês: Voltar na mesma linha do ano; Amigos: "Encontrar leitores" vira uma lupa ao lado do Voltar;
// - Ajustes sem "Sair da conta" (fica no menu lateral), sem "Personalizar Hoje" (vai para o ••• do Hoje) e sem
//   "Novidades no feed" (vai para o ••• da Comunidade); "Excluir conta" passa para Editar perfil;
// - "Para você": tocar no livro sempre abre algo (menu do livro; se não abrir, a página do livro).
{ const st = document.createElement('style'); st.textContent = `
.sx-yr,.yx-yr{position:relative}
.sx-yr > .sx-back,.yx-yr > .sl-back{position:absolute!important;left:0;top:50%;transform:translateY(-50%);margin:0!important}
#shelflist .sl-body:has(> .yx-yr > .sl-back) > .sl-top{display:none!important}
#shelflist .sl-top:has(.fl-add){display:flex!important;align-items:center}
#shelflist .sl-top .fl-add{margin:0 0 0 auto!important;width:44px!important;height:44px!important;min-height:0!important;padding:0!important;border-radius:50%!important;border:1px solid var(--line)!important;background:var(--panel)!important;display:grid!important;place-items:center;color:var(--ink)!important;flex:none}
#shelflist .sl-top .fl-add svg{width:20px;height:20px}
.lista > .aj-g{margin-left:auto!important;margin-right:auto!important}
.g-imore{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:900;font-size:1rem;letter-spacing:1px;padding:0;cursor:pointer}
.g-imore[hidden]{display:none}
`; TR.append(st); }
// 1) menu de baixo de volta fora da conversa
{ let tm = 0; const fix = () => { const tb = $('#tabbar'), v = $('#shelflist'); if (!tb || tb.style.display !== 'none') return; const inChat = v && !v.hidden && v.querySelector('.sl-body > .cht'); if (!inChat) { try { chatMode(false); } catch { tb.style.display = ''; } } };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(fix, 120); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// 2) Voltar na linha do ano; lupa nos Amigos
{ const SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  let tm = 0; const paint = () => {
    const l = TR.querySelector('#lista:not(.lista-snap)'); if (l) { const b = l.querySelector(':scope > .sx-back'), yr = l.querySelector(':scope > .sx-yr'); if (b && yr) yr.prepend(b); }
    const v = $('#shelflist'); if (!v || v.hidden) return; const body = v.querySelector('.sl-body'); if (!body) return;
    const yx = body.querySelector(':scope > .yx-yr'), bk = body.querySelector(':scope > .sl-top .sl-back'); if (yx && bk && !yx.querySelector('.sl-back')) yx.prepend(bk);
    const add = body.querySelector(':scope > .fl-add'), top = body.querySelector(':scope > .sl-top'); if (add && top) { add.innerHTML = SEARCH; add.setAttribute('aria-label', 'Encontrar leitores'); add.title = 'Encontrar leitores'; top.append(add); } };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; paint(); }, 30); }).observe(TR, { childList: true, subtree: true }); }
// 3) Ajustes mais enxuto; Excluir conta em Editar perfil
{ const _da = drawAjustes; drawAjustes = function (box) { const r = _da.apply(this, arguments);
  try {
    ['#aj-feed'].forEach((s) => box.querySelector(s)?.remove()); // Personalizar Hoje e Sair voltam para Ajustes: o topo não tem mais menu lateral nem ••• (Bia, 20/11)
    const del = box.querySelector('#aj-del'); const delCard = del && del.closest('.aj-card');
    if (S.ajMode === 'perfil') { if (!del && connected()) { box.insertAdjacentHTML('beforeend', '<div class="aj-g">Conta</div><div class="aj-card"><button type="button" class="aj-row danger" id="aj-del"><span><b>Excluir conta</b><small>Apaga a conta e todos os dados dela, para sempre</small></span>›</button></div>'); box.querySelector('#aj-del').addEventListener('click', deleteAccountSheet); } }
    else if (delCard) delCard.remove();
    // cartões que ficaram vazios e títulos sem cartão
    if (S.ajMode !== 'perfil') box.querySelectorAll('.aj-card').forEach((c) => { if (!c.querySelector('button, input, label, a, .aj-row')) c.remove(); });
    if (S.ajMode !== 'perfil') box.querySelectorAll('.aj-g').forEach((g) => { const n = g.nextElementSibling; if (!n || !n.classList.contains('aj-card')) g.remove(); });
  } catch (err) { console.warn('ajustes', err); }
  return r; }; }
// 4) ••• do Hoje (na barra do topo, só no Hoje): Personalizar Hoje
{ let tm = 0; const sync = () => { const orb = TR.querySelector('#g-orb'); if (!orb) return; let b = TR.querySelector('#g-imore');
    if (!b) { b = document.createElement('button'); b.type = 'button'; b.id = 'g-imore'; b.className = 'g-imore'; b.textContent = '•••'; b.setAttribute('aria-label', 'Opções do Hoje'); orb.before(b);
      b.addEventListener('click', () => popMenu(b, S.tab === 'estante' ? [{ label: 'Trechos e anotações', fn: () => openAllQuotes() }, { label: 'Histórico de leituras', fn: () => openHistLeituras() }, ...(lib().some((e) => !e.cover) ? [{ label: 'Buscar capas que faltam', fn: () => fillMissingCovers(true) }] : [])] : [{ label: 'Personalizar Hoje', fn: () => homePrefsSheet() }])); }
    const v = $('#shelflist'); b.hidden = !((S.tab === 'inicio' || S.tab === 'estante') && (!v || v.hidden)); b.setAttribute('aria-label', S.tab === 'estante' ? 'Opções da Biblioteca' : 'Opções do Hoje'); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; sync(); }, 60); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// 5) ••• da Comunidade: Novidades no feed
{ const _rf = rdFiltersSheet; rdFiltersSheet = function () { const r = _rf.apply(this, arguments);
  try { const w = [...document.querySelectorAll('.rdf-sheet'), ...TR.querySelectorAll('.rdf-sheet')].pop(), ok = w && w.querySelector('#rdf-ok'); if (ok && !w.querySelector('#rdf-feed')) {
    const n = FEED_KINDS.length - feedOff().length;
    ok.insertAdjacentHTML('beforebegin', '<button type="button" class="rdf-row" id="rdf-feed"><span><b>Novidades no feed</b><small>' + (n === FEED_KINDS.length ? 'Tudo aparece nas Novidades dos amigos' : n + ' de ' + FEED_KINDS.length + ' tipos aparecem') + '</small></span><em>›</em></button>');
    w.querySelector('#rdf-feed').addEventListener('click', () => { w.remove(); feedPrefsSheet(); }); } } catch (err) { console.warn('feed', err); }
  return r; }; }
// 6) "Para você": tocar no livro abre o menu do livro; se o menu não abrir, abre a página do livro
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('.pv-bk'); if (!b) return; ev.stopPropagation(); ev.preventDefault();
  const title = (b.querySelector('b') || {}).textContent || '', author = (b.querySelector('small') || {}).textContent || '';
  const cvEl = b.querySelector('.cv'), m = cvEl && String(cvEl.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/), cover = m ? m[1] : null;
  try { bookMenuOpen(cvEl || b, { title, author: author || null, cover }); } catch (err) { console.warn('para você', err); }
  setTimeout(() => { if (!TR.querySelector('.bkm')) { try { openAnyBook(title, author || null, cover); } catch {} } }, 150); }, true);
