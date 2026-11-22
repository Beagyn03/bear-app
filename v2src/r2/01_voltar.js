// Botão Voltar do celular: fecha a camada de cima (menu, folha, menu lateral, tela interna) e, nas abas, volta ao Hoje.
// Só sai do app quando já está no Hoje sem nada aberto. Cada camada aberta ganha uma entrada no histórico do navegador.
(() => {
  const vis = (n) => n && !n.hidden && n.offsetParent !== null;
  // a página cheia de Atualizar fica na sessão de leitura (outra raiz): conta como camada própria
  const v4Full = () => { try { const r = typeof V4 !== 'undefined' && V4 && V4.isConnected ? V4 : null; return r && r.querySelector('.sheet.upfullpg .upfh [data-a=upfull]'); } catch { return null; } };
  const layers = () => {
    let n = 0;
    if (S.tab && S.tab !== 'inicio') n++;
    const v = $('#shelflist'); if (v && !v.hidden && !v.classList.contains('tabroot')) n++;
    const ed = $('#editor'); if (ed && !ed.hidden) n++;
    if (TR.querySelector('.bkm')) n++;
    if (v && !v.hidden && v.classList.contains('mine-page') && v.classList.contains('tabroot')) n++;
    if (TR.querySelector('#sx-back') || ((S.tab === 'perfil') && TR.querySelector('#aj-back'))) n++;
    if (TR.querySelector('.drw')) n++;
    if (TR.querySelector('.pop')) n++;
    if ([...TR.children].find((n) => n.classList && n.classList.contains('rt'))) n++; // retrospectiva do livro (tela cheia por cima de tudo)
    if (v4Full()) n++;
    if (document.querySelector('body > .sheet')) n++;
    if (TR.querySelector('.bd-page:not([hidden]), .gp-page:not([hidden])')) n++;
    return n;
  };
  const closeTop = () => {
    if (TR.querySelector('.pop')) return closePop();
    { const rt = [...TR.children].find((n) => n.classList && n.classList.contains('rt')); if (rt) return rt.remove(); }
    { const f = v4Full(); if (f) return f.click(); } // página cheia de Atualizar/Histórico: a seta dela sabe para onde voltar
    const sh = [...document.querySelectorAll('body > .sheet')].pop(); if (sh) return sh.remove();
    if (TR.querySelector('.bkm')) return bqClose();
    const ed = $('#editor'); if (ed && !ed.hidden) { const nb = ed.querySelector('#nt-back'); return nb ? nb.click() : closeEd(); }
    if (TR.querySelector('.drw')) return closeDrawer();
    // v2: a seta de voltar da tela interna fica na barra do topo (.v4back/.v4back2); o "‹ Voltar" antigo fica escondido
    { const lv0 = $('#shelflist'), tb = [...TR.querySelectorAll('.v4back, .v4back2')].find(vis); if (lv0 && !lv0.hidden && tb) return tb.click(); }
    const lv = $('#shelflist'); const back = (lv && !lv.hidden && lv.querySelector('.sl-back')) || [...TR.querySelectorAll('.sl-back')].find(vis); if (back && vis(back)) return back.click();
    if (lv && !lv.hidden && lv.classList.contains('mine-page')) return goTab('inicio');
    const sx = TR.querySelector('#sx-back'); if (sx && vis(sx)) return sx.click();
    const aj = S.tab === 'perfil' && TR.querySelector('#aj-back'); if (aj) return aj.click();
    if (S.tab && S.tab !== 'inicio') return goTab('inicio');
  };
  let pushed = 0, skip = 0, t = 0;
  const sync = () => {
    t = 0; const n = layers();
    if (n > pushed) { while (pushed < n) { history.pushState({ bear: ++pushed }, ''); } }
    else if (n < pushed) { const d = pushed - n; pushed = n; skip += d; history.go(-d); }
  };
  const later = () => { if (!t) t = setTimeout(sync, 60); };
  window.bearVoltarSync = later; // camadas fora do TR (sessão de leitura) avisam quando abrem/fecham
  addEventListener('popstate', () => {
    if (skip > 0) { skip--; return; }
    pushed = Math.max(0, pushed - 1);
    try { closeTop(); } catch (err) { console.error('voltar', err); }
    later();
  });
  const mo = new MutationObserver(later);
  mo.observe(TR, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  mo.observe(document.body, { childList: true });
  later();
})();
