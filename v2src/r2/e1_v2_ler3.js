// v3 Ler (Bia, 19/11): o botão do meio abre direto o livro do Hoje (antes perguntava "Ler qual livro agora?" a quem lia
// mais de um). A tela de antes da sessão tem Começar a ler, Trocar livro (lendo + fila) e Atualizar página.
// Sessão em andamento continua abrindo direto, e sem nenhum livro em leitura segue oferecendo a fila.
{ const st = document.createElement('style'); st.textContent = `
.v3pre .mid{gap:.35rem}
.v3pre .sub{font-size:.84rem;color:#cfc4ff;font-weight:800}
.v3pre .go{display:grid;gap:.55rem;padding:0 1.2rem 1.4rem;position:relative;z-index:2}
.v3pre .go .flip{margin:0;width:100%;justify-content:center}
.v3pre .go .two{border:1.5px solid rgba(255,255,255,.22);background:transparent;color:#fff;border-radius:18px;padding:.85rem;font:inherit;font-weight:900;font-size:.92rem}
`; TR.append(st); }
function v3LerPre(e) {
  $('.v2ses')?.remove();
  const w = document.createElement('div'); w.className = 'v2ses v3pre'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Ler');
  const stars = Array.from({ length: 40 }, () => `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;animation-delay:${(Math.random() * 3).toFixed(1)}s"></i>`).join('');
  const draw = () => {
    const { now, total } = readingInfo(e), p = total ? Math.min(1, now / total) : 0, a = p * 2 * Math.PI - Math.PI / 2, mx = 95 + 84 * Math.cos(a), my = 95 + 84 * Math.sin(a);
    const can = lib().filter((x) => (x.status === 'LENDO' || x.status === 'QUERO') && x.id !== e.id).length;
    w.innerHTML = `<div class="sky">${stars}</div>
      <div class="top"><button type="button" data-a="x" aria-label="Fechar">${(() => { try { return v4ic('x', 18); } catch { return '✕'; } })()}</button>${can ? '<button type="button" data-a="sw">Trocar livro</button>' : '<span></span>'}</div>
      <div class="mid"><div class="orb"><svg viewBox="0 0 190 190"><circle cx="95" cy="95" r="84" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="5"/><circle cx="95" cy="95" r="84" fill="none" stroke="#e0ad3a" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(p * 527.8).toFixed(1)} 528" transform="rotate(-90 95 95)"/></svg>
        ${e.cover ? `<img class="cv" src="${esc(e.cover)}" alt="">` : `<span class="cv">${esc(String(e.title || '?').charAt(0))}</span>`}<span class="moon" style="left:${mx.toFixed(1)}px;top:${my.toFixed(1)}px"></span></div>
        <div class="bt">${esc(e.title)}</div><div class="sub">${total ? `você está na pág. ${now} de ${total}` : `você está na pág. ${now}`}</div>
        <p class="calm">Um toque e o tempo começa a contar. Quando parar, é só dizer em que página ficou.</p></div>
      <div class="go"><button type="button" class="flip" data-a="go">${V2SVG('ler', 20)}Começar a ler</button><button type="button" class="two" data-a="pg">Atualizar página</button></div>`;
  };
  w.addEventListener('click', (ev) => { const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'x') return w.remove();
    if (a === 'go') { w.remove(); return v2SesStart(e); }
    if (a === 'pg') { w.remove(); return ssOpenUpdate(e); }
    if (a === 'sw') { w.remove(); const L = lib().filter((x) => (x.status === 'LENDO' || x.status === 'QUERO') && x.id !== e.id).sort((x, y) => (x.status === 'LENDO' ? 0 : 1) - (y.status === 'LENDO' ? 0 : 1));
      return sheetList('Ler qual livro?', L.slice(0, 12).map((x) => { const i = readingInfo(x); return { label: esc(x.title), sub: x.status === 'LENDO' ? (i.total ? `pág. ${i.now} de ${i.total}` : 'lendo') : 'da fila: começa agora',
        fn: () => { if (x.status === 'QUERO') { setLibStatus(x, 'LENDO'); if (x.status !== 'LENDO') return; } setCurrent(x.id); try { refresh(); } catch {} v3LerPre(x); } }; })); }
  });
  TR.append(w); draw();
}
v2Ler = function () {
  const s = v2SesGet(); if (s) { const e = lib().find((x) => x.id === s.libId); if (e) return v2SesOpen(e, s); v2SesPut(null); }
  const R = reading(); if (R && R.e) return v3LerPre(R.e);
  const fila = lib().filter((e) => e.status === 'QUERO').slice(0, 8);
  if (!fila.length) return toast('Adicione um livro na Biblioteca para começar a ler');
  sheetList('Você não está lendo nenhum livro. Qual começa agora?', fila.map((e) => ({ label: esc(e.title), sub: e.author ? esc(e.author) : '', fn: () => { setLibStatus(e, 'LENDO'); if (e.status === 'LENDO') v3LerPre(e); } })));
};
