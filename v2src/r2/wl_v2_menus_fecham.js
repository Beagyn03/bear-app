// Menus flutuantes nunca ficam presos na tela (Bia, 21/11: abriu o menu de uma capa na leitura conjunta, saiu da tela e o menu
// ficou por cima do Hoje). Uma função central fecha o menu (.pop) e os menus de livro/estante (.bkm) quando: troca de aba,
// abre/fecha página ou folha, volta (botão, gesto, histórico), rola a página, Esc, ou o elemento que abriu o menu some/esconde.
{ let anchor = null, openedAt = 0, sheetsAt = 0;
  const sheets = () => document.querySelectorAll('.sheet').length + TR.querySelectorAll('.sheet').length;
  const has = () => !!TR.querySelector('.pop, .bkm');
  window.lvCloseMenus = function () { try { closePop(); } catch {} try { bqClose(); } catch {} anchor = null; };
  const close = () => { if (has()) lvCloseMenus(); };
  // guarda quem abriu o menu
  const _pm = popMenu; popMenu = function (a, items) { const r = _pm.apply(this, arguments); anchor = a || null; openedAt = Date.now(); sheetsAt = sheets(); return r; };
  // navegação: aba, página do livro, tela de leitura, estante, histórico
  const wrapNav = (name) => { try { const f = window[name] || eval(name); if (typeof f !== 'function') return; const w = function () { close(); return f.apply(this, arguments); };
    try { eval(name + ' = w'); } catch { window[name] = w; } } catch {} };
  ['goTab', 'openBookPage', 'v4Open', 'openShelfV3', 'openAnyBook', 'openBuddyPage', 'openProfile', 'openGoalPage'].forEach(wrapNav);
  window.addEventListener('popstate', close, true);
  window.addEventListener('hashchange', close, true);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); }, true);
  // rolar a página fecha (rolar dentro do próprio menu não)
  const onScroll = (ev) => { if (!has() || Date.now() - openedAt < 250) return; const p = ev.composedPath ? ev.composedPath() : [ev.target];
    if (p.some((n) => n && n.classList && (n.classList.contains('pop') || n.classList.contains('bkm')))) return; close(); };
  window.addEventListener('scroll', onScroll, true); TR.addEventListener('scroll', onScroll, true);
  // tocar fora também fecha os menus .bkm (o .pop já fecha sozinho)
  const outside = (ev) => { if (!TR.querySelector('.bkm') || Date.now() - openedAt < 250) return; const p = ev.composedPath ? ev.composedPath() : [ev.target];
    if (p.some((n) => n && n.classList && (n.classList.contains('bkm') || n.classList.contains('pop')))) return; close(); };
  TR.addEventListener('pointerdown', outside, true);
  // folhas e páginas abrindo/fechando, e âncora sumindo ou escondida
  let raf = 0; const check = () => { raf = 0; if (!has()) return;
    if (anchor && (!anchor.isConnected || !anchor.getClientRects().length)) return lvCloseMenus();
    if (TR.querySelector('.pop') && Date.now() - openedAt > 250 && sheets() !== sheetsAt) return lvCloseMenus(); };
  const mo = new MutationObserver(() => { if (!raf && has()) raf = requestAnimationFrame(check); });
  mo.observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
  mo.observe(document.body, { childList: true }); }
