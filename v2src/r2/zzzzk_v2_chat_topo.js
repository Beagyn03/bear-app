// ---------- v2: conversa com "‹ Nome" no topo, sem o botão redondo (Bia, 26/11: "por que dessa seta?") ----------
// A conversa tinha um botão redondo "‹" solto abaixo do topo, além do nome no topo. Agora o Voltar fica no topo, ao lado do
// nome (como nas outras telas internas), e o botão redondo some. A hora da mensagem não quebra mais em duas linhas.
{ const st = document.createElement('style'); st.textContent = `
/* (Bia 26/11) só o botão redondo some; o .sl-top fica, porque é dele que o topo tira o nome da pessoa */
#shelflist .sl-body:has(.cht) .sl-top .sl-back{position:absolute!important;width:1px!important;height:1px!important;min-height:0!important;padding:0!important;border:0!important;opacity:0!important;pointer-events:none!important;overflow:hidden!important} /* invisível mas "na tela": o syncTopTitle só põe o nome se o Voltar tiver offsetParent */#shelflist .sl-body:has(.cht) .sl-top{min-height:0;margin:0;padding:0}
.bub small{white-space:nowrap;flex:none}
.gtop .chtback{display:inline-grid;place-items:center;width:36px;height:36px;border:0;background:none;color:var(--ink);margin-right:.15rem;cursor:pointer}
.gtop .chtback svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
`; TR.append(st); }
{ let tm = 0;
  const sync = () => { const top = TR.querySelector('.gtop'); if (!top) return; const v = TR.querySelector('#shelflist');
    // só entra se o topo ainda não tem um Voltar visível (senão ficavam dois)
    const other = top.querySelector('.v4back:not([hidden]), .v4back2:not([hidden])');
    const on = !!(v && !v.hidden && v.querySelector('.cht')) && !other; let b = top.querySelector('.chtback');
    if (on && !b) { b = document.createElement('button'); b.type = 'button'; b.className = 'chtback'; b.setAttribute('aria-label', 'Voltar');
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
      b.addEventListener('click', () => { const sb = TR.querySelector('#shelflist .sl-back'); if (sb) sb.click(); else { try { history.back(); } catch {} } });
      (top.querySelector('#g-t') || top.firstElementChild).before(b); }
    if (b && b.hidden === on) b.hidden = !on; };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; sync(); }, 80); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
}
