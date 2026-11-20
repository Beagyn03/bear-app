// Reações com os GIFs da Bia: ficam paradas e animam por ~2 s quando a pessoa toca (antes da ação, na captura do clique).
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('[data-rx]'); if (!b) return;
  const key = b.dataset.rx; S.rxAnim = key;
  const img = b.querySelector('img'); if (img) img.src = img.src.replace('_p.webp', '.webp');
  clearTimeout(S.rxAnimT);
  S.rxAnimT = setTimeout(() => { S.rxAnim = null; TR.querySelectorAll('[data-rx] img').forEach((i) => { if (!/_p\.webp$/.test(i.src)) i.src = i.src.replace(/\.webp$/, '_p.webp'); }); }, 2200);
}, true);
