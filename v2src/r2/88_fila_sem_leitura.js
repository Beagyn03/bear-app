// Início (Bia, 17/11): a lista "Na fila" só aparece quando não há nenhum livro sendo lido.
{ let tm = 0; const paint = () => {
    let lendo = false; try { lendo = lib().some((e) => e.status === 'LENDO'); } catch {}
    TR.querySelectorAll('#lista .yo-fsh').forEach((sh) => { [sh, sh.nextElementSibling].forEach((n) => { if (n) n.style.display = lendo ? 'none' : ''; }); });
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 60); }).observe(TR, { childList: true, subtree: true }); }
// Leituras por mês sai do Hoje (Bia, 17/11): já aparece no perfil.
{ const st = document.createElement('style'); st.textContent = '#lista .ini-ano{display:none!important}'; TR.append(st); }
{ const i = HOME_SECS.findIndex((x) => x[0] === 'ano'); if (i >= 0) HOME_SECS.splice(i, 1); }
// "Sua semana" sai do Hoje (Bia, 17/11): com prazo, os dias já aparecem no cartão da leitura; sem prazo, está em Estatísticas.
inSemana = function () { return ''; };
// "Na Rede" sai do Hoje (Bia, 17/11): já está em Comunidade. Some também da lista de personalizar o Início, junto com "Sua semana".
['rede', 'semana'].forEach((k) => { const i = HOME_SECS.findIndex((x) => x[0] === k); if (i >= 0) HOME_SECS.splice(i, 1); });
{ const st = document.createElement('style'); st.textContent = '#lista [data-in=rede],#lista [data-in=semana]{display:none!important}'; TR.append(st); }
// A anotação do livro (só você vê) fica no Diário de leitura e não aparece mais no cartão do Hoje (Bia, 17/11).
{ const st = document.createElement('style'); st.textContent = '#lista .v3-now .v3-note{display:none!important}'; TR.append(st); }
// "Em alta" sai do Hoje (Bia, 17/11): volta quando houver um cálculo melhor, com mais leitores no app.
{ const i = HOME_SECS.findIndex((x) => x[0] === 'alta'); if (i >= 0) HOME_SECS.splice(i, 1); }
{ const st = document.createElement('style'); st.textContent = '#lista [data-in=alta]{display:none!important}'; TR.append(st); }
