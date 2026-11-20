// Estatísticas sem "Ajustar leituras" e sem "Leituras por mês" (Bia, 18/11): o ajuste mora no Histórico de leituras
// e as Leituras por mês ficam no perfil.
{ const st = document.createElement('style'); st.textContent = '#lista.st-limpa > .fx-card,#lista.st-limpa .fx-card,#lista.st-limpa .ys{display:none!important}'; TR.append(st);
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; const l = TR.querySelector('#lista'); if (l) l.classList.toggle('st-limpa', S.tab === 'progresso'); }, 30); }).observe(TR, { childList: true, subtree: true }); }
