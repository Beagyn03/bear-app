// v2 (Bia, 19/11): Estante sem folhas subindo do rodapé. Os menus abrem flutuando junto do botão que os chamou.
//  - "Filtrar e organizar" (esnFilterSheet) vira um painel flutuante preso ao botão de filtro, com as mesmas opções;
//  - o "•••" de cada estante (shelfMenu4) nunca cai no modo folha: abre embaixo do botão ou, sem espaço, em cima,
//    com rolagem própria quando é alto;
//  - menus flutuantes (.pop, .bkm e o painel) ficam acima das capas avaliadas (z-index 9000);
//  - fecham ao tocar fora, no Esc e no Voltar do celular (o painel é marcado como .pop, que o Voltar já fecha).
{ const st = document.createElement('style'); st.textContent = `
.pop{z-index:9150!important}.bkm{z-index:9150!important}
.esn-sheet.esn-pop{position:fixed;inset:auto;max-width:none;min-width:0;z-index:9150!important;display:block;width:min(340px,calc(100vw - 16px));padding:0;background:none;border:0;box-shadow:none;animation:popIn .14s ease-out}
.esn-sheet.esn-pop .box{width:100%;max-width:none;max-height:var(--mh,70vh);overflow:auto;border-radius:16px;border:1px solid var(--line);padding:.85rem .9rem .9rem;box-shadow:0 14px 40px rgba(0,0,0,.28)}
.esn-sheet.esn-pop .box h3{font-size:1rem;margin:0 0 .3rem}.esn-sheet.esn-pop .box h4{margin:.65rem 0 .3rem}
.esn-sheet.esn-pop .acts{position:sticky;bottom:-.9rem;background:var(--panel);padding:.6rem 0 .1rem;margin-top:.6rem;display:grid;grid-template-columns:1fr 1.3fr;gap:.5rem}
.esn-sheet.esn-pop .acts button{height:42px!important;min-height:0!important;padding:0 .6rem!important;font-size:.86rem!important;white-space:nowrap;border-radius:12px!important}
`; TR.append(st); }
// posição presa ao botão: embaixo se couber; senão do lado com mais espaço, com altura máxima e rolagem
function v2Anchor(el, anchor, opt = {}) {
  // botão redesenhado (a tela por trás pode se refazer): usa a última posição conhecida
  if (anchor.isConnected && anchor.offsetParent) el._v2r = anchor.getBoundingClientRect();
  const r = el._v2r || anchor.getBoundingClientRect(), w = el.offsetWidth, foot = 78, gap = 6;
  const below = innerHeight - foot - r.bottom - gap - 8, above = r.top - gap - 8;
  el.style.left = Math.max(8, Math.min(r.right - w, innerWidth - w - 8)) + 'px';
  const natural = opt.natural || el.scrollHeight;
  if (natural <= below || below >= above) { el.style.top = (r.bottom + gap) + 'px'; el.style.bottom = 'auto'; el.style.setProperty('--mh', Math.max(160, below) + 'px'); if (opt.maxH) el.style.maxHeight = Math.max(160, below) + 'px'; el.style.transformOrigin = 'top right'; }
  else { const h = Math.min(natural, above); el.style.top = Math.max(8, r.top - gap - h) + 'px'; el.style.bottom = 'auto'; el.style.setProperty('--mh', above + 'px'); if (opt.maxH) el.style.maxHeight = above + 'px'; el.style.transformOrigin = 'bottom right'; }
}
// 1) Filtrar e organizar: painel flutuante
{ const _ef = esnFilterSheet;
  esnFilterSheet = function () {
    const r = _ef.apply(this, arguments);
    const sh = [...TR.querySelectorAll('.esn-sheet')].pop(), anchor = [...TR.querySelectorAll('[data-a=filt]')].find((b) => b.offsetParent);
    if (!sh || !anchor) return r;
    sh.classList.add('esn-pop', 'pop'); sh.setAttribute('role', 'dialog');
    const place = () => { if (!sh.isConnected) return; const box = sh.querySelector('.box'); v2Anchor(sh, anchor, { natural: box ? box.scrollHeight : 0 }); };
    place(); new MutationObserver(place).observe(sh, { childList: true }); // as opções se redesenham a cada toque
    // tocar fora fecha (o fundo escuro saiu)
    setTimeout(() => { const out = (ev) => { if (!sh.isConnected) return done(); const p = ev.composedPath ? ev.composedPath() : []; if (!p.includes(sh) && !p.includes(anchor)) { sh.remove(); done(); } };
      const done = () => { TR.removeEventListener('pointerdown', out, true); document.removeEventListener('pointerdown', out, true); };
      TR.addEventListener('pointerdown', out, true); document.addEventListener('pointerdown', out, true); }, 0);
    return r;
  };
}
// 2) "•••" das estantes: nunca folha; embaixo ou em cima do botão
{ const _sm = shelfMenu4;
  shelfMenu4 = function (key, anchor) {
    const r = _sm.apply(this, arguments);
    const m = [...TR.querySelectorAll('.bkm')].pop(); if (!m || !anchor || !anchor.isConnected) return r; m._v2r = anchor.getBoundingClientRect();
    let busy = false;
    const fix = () => { if (busy || !m.isConnected) return; busy = true;
      m.classList.remove('sheetlike'); m.style.right = 'auto'; m.style.maxHeight = 'none'; const natural = m.scrollHeight;
      v2Anchor(m, anchor, { natural, maxH: true }); setTimeout(() => { busy = false; }, 0); };
    fix(); new MutationObserver(fix).observe(m, { childList: true, attributes: true, attributeFilter: ['class'] });
    return r;
  };
}
// 3) Esc fecha o menu flutuante de cima
document.addEventListener('keydown', (ev) => { if (ev.key !== 'Escape') return;
  if (TR.querySelector('.pop')) { closePop(); return; } if (TR.querySelector('.bkm')) bqClose(); });
