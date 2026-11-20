// Botões "Fechar" viram X e "Voltar" vira seta (Bia, 17/11). Só os botões pequenos de topo; botões largos de rodapé
// (ex.: "Fechar" que ocupa a linha toda embaixo de uma folha) continuam com texto.
{ const css = `.bt-ico{display:inline-grid!important;place-items:center;width:40px!important;height:40px!important;min-width:40px!important;padding:0!important;border-radius:50%!important;font-size:0!important;line-height:0!important}
.bt-ico svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}`;
  const a = document.createElement('style'); a.textContent = css; TR.append(a); const b = document.createElement('style'); b.textContent = css; document.head.append(b); }
{ const X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const isClose = (t) => /^(fechar|✕|×)$/i.test(t), isBack = (t) => /^(‹|<|←)?\s*voltar$/i.test(t);
  const fix = (root) => root.querySelectorAll('button:not([data-ico])').forEach((bt) => {
    const t = bt.textContent.replace(/\s+/g, ' ').trim(); if (!t || t.length > 12) return;
    const close = isClose(t), back = isBack(t); if (!close && !back) return;
    if (bt.offsetWidth > 170) return; // botão largo de rodapé: fica com texto
    bt.dataset.ico = 1; bt.setAttribute('aria-label', close ? 'Fechar' : 'Voltar'); bt.title = close ? 'Fechar' : 'Voltar';
    bt.innerHTML = close ? X : BACK; bt.classList.add('bt-ico');
  });
  let tm = 0; const run = () => { clearTimeout(tm); tm = setTimeout(() => { try { fix(TR); fix(document.body); } catch {} }, 40); };
  new MutationObserver(run).observe(TR, { childList: true, subtree: true, characterData: true });
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
  run(); }
