// ---------- v2: conversa com "‹ Nome" no topo, sem o botão redondo (Bia, 26/11: "por que dessa seta?") ----------
// A conversa tinha um botão redondo "‹" solto abaixo do topo, além do nome no topo. Agora o Voltar fica no topo, ao lado do
// nome (como nas outras telas internas), e o botão redondo some. A hora da mensagem não quebra mais em duas linhas.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .sl-body:has(> .cht) > .sl-top,#shelflist .sl-body:has(.cht) .sl-top{display:none!important}
.bub small{white-space:nowrap;flex:none}
.gtop .chtback{display:inline-grid;place-items:center;width:36px;height:36px;border:0;background:none;color:var(--ink);margin-right:.15rem;cursor:pointer}
.gtop .chtback svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
`; TR.append(st); }
{ let tm = 0;
  const sync = () => { const top = TR.querySelector('.gtop'); if (!top) return; const v = TR.querySelector('#shelflist');
    const on = !!(v && !v.hidden && v.querySelector('.cht')); let b = top.querySelector('.chtback');
    if (on && !b) { b = document.createElement('button'); b.type = 'button'; b.className = 'chtback'; b.setAttribute('aria-label', 'Voltar');
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
      b.addEventListener('click', () => { const sb = TR.querySelector('#shelflist .sl-back'); if (sb) sb.click(); else { try { history.back(); } catch {} } });
      (top.querySelector('#g-t') || top.firstElementChild).before(b); }
    if (b && b.hidden === on) b.hidden = !on; };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; sync(); }, 80); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
}
