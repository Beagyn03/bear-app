// v2 (Bia, 18/11): um caminho só para cada coisa.
//  - Foco virou a sessão Ler: o botão Foco sai do card do Hoje e todo "Foco" que sobrou (menu do livro, atalhos) abre a sessão
//    do livro. Um foco antigo ainda em andamento continua abrindo o foco, para não perder o tempo contado.
//  - Menu lateral sem o que já tem lugar fixo: Ajustes (aba Você) e Personalizar Hoje (••• do Hoje).
{ const _sf = startFocus;
  startFocus = function () {
    try { if (focusRunning()) return _sf.apply(this, arguments); } catch {}
    closeAll();
    if (v2SesGet()) return v2Ler();
    const r = reading(); if (r && r.e && r.e.status === 'LENDO') return v2SesStart(r.e);
    return v2Ler();
  };
}
{ let tm = 0;
  const tidy = () => {
    TR.querySelectorAll('.v3-quick [data-q=foco]').forEach((b) => b.remove());
    const d = TR.querySelector('.drw'); if (d && d.dataset.v2 && !d.dataset.v2b) { d.dataset.v2b = '1';
      d.querySelectorAll('[data-go="cfg"],[data-go2="home"]').forEach((b) => b.remove()); }
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(tidy, 60); }).observe(TR, { childList: true, subtree: true }); setTimeout(tidy, 1600);
}
