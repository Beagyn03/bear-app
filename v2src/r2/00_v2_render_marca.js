// Tela parada (22/11), parte 1 de 2 (a outra é zz_v2_render_estavel.js): guarda como cada tela por cima (#shelflist) ficou logo
// depois de desenhada, ANTES dos enfeites que outros blocos aplicam em seguida. Este observador é criado primeiro, então roda antes
// deles. O redesenho de fundo compara com isto para saber se algo mudou de verdade.
const RR_LSIG = new WeakMap(); let RR_SKIP = 0;
const rrShadowAll = (root) => { let s = ''; root.querySelectorAll('*').forEach((e) => { if (e.shadowRoot) s += '#sr{' + e.shadowRoot.innerHTML + rrShadowAll(e.shadowRoot) + '}'; }); return s; };
const rrSig = (v) => v.innerHTML + rrShadowAll(v);
{ const v = TR.querySelector('#shelflist');
  if (v) new MutationObserver((ms) => { if (RR_SKIP) { RR_SKIP = 0; return; } if (v.hidden) return;
    if (ms.some((m) => m.type === 'childList' && m.target.classList && m.target.classList.contains('sl-body') && m.addedNodes.length + m.removedNodes.length > 2)) RR_LSIG.set(v, rrSig(v)); }).observe(v, { childList: true, subtree: true }); }
