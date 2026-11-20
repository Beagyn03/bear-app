// Mudou status, nota ou data de um livro: o perfil, a página aberta (livro, estante…) e as Estatísticas se redesenham sozinhos (Bia, 16/11).
// Antes era preciso recarregar o app para ver a mudança nas Leituras por mês e nos números do perfil.
// (save é const, não dá para envolver; a conferência roda só com o perfil ou as Estatísticas na tela e nada aberto por cima.)
{ const sig = () => { try { return lib().map((e) => e.id + ':' + e.status + ':' + ((reviewOfLib(e) || {}).paws || 0) + ':' + (e.finishedAt || '')).join('|'); } catch { return ''; } };
  let last = sig(), busy = false;
  setInterval(async () => {
    if (busy || document.hidden) return;
    const v = $('#shelflist'), onMe = v && !v.hidden && v.classList.contains('mine-page') && !v.querySelector('.bp-card') && !!v.querySelector('.yo-top'), onStats = (!v || v.hidden) && S.tab === 'progresso', onPage = v && !v.hidden && !onMe && !!v.querySelector('.bp-card') && typeof S.bpDraw === 'function';
    if (!onMe && !onStats && !onPage) { last = sig(); return; }
    if (TR.querySelector('.bkm') || document.querySelector('.sheet')) return; // menu ou folha aberta: espera fechar
    const s = sig(); if (s === last) return; last = s;
    busy = true;
    try {
      if (onMe) { const y = v.scrollTop; S.nav.restoring = true; try { await openMyProfile(); } finally { S.nav.restoring = false; } v.scrollTop = y; }
      else if (onPage) { const y = v.scrollTop; S.bpDraw(); v.scrollTop = y; }
      else { const y = window.scrollY; drawTab(); window.scrollTo(0, y); }
    } catch (err) { console.warn('atualizar tela', err); } finally { busy = false; }
  }, 700);
}
// página do livro: guarda o desenho dela (S.listRedraw pode ser trocado por outra tela enquanto a avaliação está aberta)
{ const _ob = openBookPage; openBookPage = function () { const r = _ob.apply(this, arguments); S.bpDraw = S.listRedraw; return r; }; }
