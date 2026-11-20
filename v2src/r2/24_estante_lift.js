// Prateleiras da Estante: barra de progresso (lendo) e barra de lido no topo da capa, e o livro sai para a frente ao passar o dedo/mouse,
// igual às Leituras por mês.
{ const st = document.createElement('style'); st.textContent = `
.es4 .es-row{padding-top:14px!important;margin-top:-8px}
.es4 .es-bk .es4-bar,.es4 .es-bk .es4-done{top:6px!important;bottom:auto!important}
.es4 .es4-bk > .es-bk{position:relative;transition:transform .18s cubic-bezier(.2,1.3,.4,1),filter .18s;transform-origin:50% 100%;will-change:transform}
.es4 .es4-bk > .es-bk:hover,.es4 .es4-bk > .es-bk:focus-visible,.es4 .es4-bk > .es-bk.ys-up{transform:translateY(-10px) scale(1.08);z-index:3;filter:drop-shadow(0 8px 10px rgba(0,0,0,.35))}
.es4 .es4-bk{position:relative}.es4 .es4-bk:has(.ys-up){z-index:3}
`; TR.append(st); }
{ // no celular: arrastar o dedo pela prateleira levanta o livro embaixo do dedo (só deslize vertical curto; rolar a prateleira continua normal)
  let last = null; const sel = '.es4 .es4-bk > .es-bk';
  const up = (b) => { if (last === b) return; last && last.classList.remove('ys-up'); last = b; b && b.classList.add('ys-up'); };
  TR.addEventListener('touchstart', (ev) => { const b = ev.target.closest && ev.target.closest(sel); if (b) up(b); }, { passive: true });
  TR.addEventListener('touchmove', (ev) => { if (!last) return; const t = ev.touches[0]; const n = t && TR.elementFromPoint(t.clientX, t.clientY); const b = n && n.closest && n.closest(sel); up(b || null); }, { passive: true });
  TR.addEventListener('touchend', () => setTimeout(() => up(null), 250), { passive: true });
}
