// Leituras do ano por mês: ao passar o dedo/mouse, o livro sai da prateleira para a frente (sobe, cresce e fica por cima).
{ const st = document.createElement('style'); st.textContent = `
.ys-bk{position:relative;transition:transform .18s cubic-bezier(.2,1.3,.4,1),filter .18s;transform-origin:50% 100%;will-change:transform}
.ys-bk:hover,.ys-bk:focus-visible,.ys-bk.ys-up{transform:translateY(-10px) scale(1.12);z-index:3;filter:drop-shadow(0 8px 10px rgba(0,0,0,.35))}
.ys-bks{position:relative}
`; TR.append(st); }
{ // no celular: arrastar o dedo pela prateleira levanta o livro que está embaixo do dedo
  let last = null;
  const up = (b) => { if (last === b) return; last && last.classList.remove('ys-up'); last = b; b && b.classList.add('ys-up'); };
  TR.addEventListener('touchmove', (ev) => { const t = ev.touches[0]; if (!t) return; const n = TR.elementFromPoint(t.clientX, t.clientY); const b = n && n.closest && n.closest('.ys-bk'); if (b || last) up(b || null); }, { passive: true });
  TR.addEventListener('touchstart', (ev) => { const b = ev.target.closest && ev.target.closest('.ys-bk'); if (b) up(b); }, { passive: true });
  TR.addEventListener('touchend', () => setTimeout(() => up(null), 250), { passive: true });
}
// capas inteiras (proporção de livro, 2:3) e seletor de ano menor
{ const st = document.createElement('style'); st.textContent = `
.ys{width:100%!important;min-width:0!important;max-width:100%!important;overflow:hidden;box-sizing:border-box}
.ys-row{max-width:100%}
.ys-bk{width:64px!important}
.ys-bk .cv{width:64px!important;height:96px!important;border-radius:2px 4px 0 0!important}
.ys-bk .cv *{font-size:.5rem!important}
.ys-y button{width:28px!important;height:28px!important;border-radius:99px!important;font-size:.8rem!important;padding:0!important;line-height:1}
.ys-y b{font-size:.9rem}
.ys-h > b{font-size:1rem}
`; TR.append(st); }
// livros do mesmo mês um pouco sobrepostos (cabe mais na prateleira); o de cima ganha sombra na borda esquerda
{ const st = document.createElement('style'); st.textContent = `
.ys-bks{gap:0!important}
.ys-bk + .ys-bk{margin-left:-20px}
.ys-bk + .ys-bk .cv{box-shadow:-4px 0 6px -2px rgba(0,0,0,.45),inset -2px 0 3px rgba(0,0,0,.25)!important}
.ys-row{gap:.55rem!important}
`; TR.append(st); }
