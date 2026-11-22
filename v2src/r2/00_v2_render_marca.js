// Tela parada (22/11), parte 1 de 2 (a outra é zz_v2_render_estavel.js): guarda como cada tela por cima (#shelflist) ficou logo
// depois de desenhada, ANTES dos enfeites que outros blocos aplicam em seguida. Este observador é criado primeiro, então roda antes
// deles. O redesenho de fundo compara com isto para saber se algo mudou de verdade.
const RR_LSIG = new WeakMap(); let RR_SKIP = 0;
const rrShadowAll = (root) => { let s = ''; root.querySelectorAll('*').forEach((e) => { if (e.shadowRoot) s += '#sr{' + e.shadowRoot.innerHTML + rrShadowAll(e.shadowRoot) + '}'; }); return s; };
const rrSig = (v) => v.innerHTML + rrShadowAll(v);
{ const v = TR.querySelector('#shelflist');
  if (v) new MutationObserver((ms) => { if (RR_SKIP) { RR_SKIP = 0; return; } if (v.hidden) return;
    if (ms.some((m) => m.type === 'childList' && m.target.classList && m.target.classList.contains('sl-body') && m.addedNodes.length + m.removedNodes.length > 2)) RR_LSIG.set(v, rrSig(v)); }).observe(v, { childList: true, subtree: true }); }
// redesenho da tela por cima enquanto a cópia congelada a cobre: as esperas encadeadas a partir dele rodam já (ver zz_v2_render_estavel.js)
const RR_TX = { fast: 0, build: 0 };
const rrTx = (fn) => (typeof fn !== 'function' ? fn : function () { RR_TX.build++; try { return fn.apply(this, arguments); } finally { RR_TX.build--; } });
// desfaz mudanças do DOM a partir dos registros de um MutationObserver (do mais novo para o mais antigo)
const rrUndo = (recs) => { for (let i = recs.length - 1; i >= 0; i--) { const m = recs[i];
      if (m.type === 'attributes') { if (m.oldValue === null) m.target.removeAttribute(m.attributeName); else m.target.setAttribute(m.attributeName, m.oldValue); }
      else if (m.type === 'characterData') m.target.data = m.oldValue;
      else { for (const n of m.addedNodes) if (n.parentNode === m.target) n.remove(); const ref = m.nextSibling && m.nextSibling.parentNode === m.target ? m.nextSibling : (m.previousSibling && m.previousSibling.parentNode === m.target ? m.previousSibling.nextSibling : (m.nextSibling ? null : null));
        const frag = document.createDocumentFragment(); for (const n of m.removedNodes) frag.append(n);
        if (m.nextSibling && m.nextSibling.parentNode === m.target) m.target.insertBefore(frag, m.nextSibling); else if (m.previousSibling && m.previousSibling.parentNode === m.target) m.previousSibling.after(frag); else if (!m.previousSibling) m.target.prepend(frag); else m.target.append(frag); void ref; } } };
