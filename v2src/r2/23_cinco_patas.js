// Leituras por mês: sem destaque por nota (Bia, 22/11 — tirar o contorno brilhante por nota do app todo).
// O yearShelfHTML original marca cada livro com "paw" e ys-5/ys-ouro/ys-prata/ys-bronze/ys-ferro (faixa, contorno e brilho)
// e põe a legenda "Nota · …". Aqui as classes e a legenda saem na fonte; o espaçamento da faixa continua o de antes.
{ const st = document.createElement('style'); st.textContent = `
.ys-row{padding-top:14px!important}.ys-g{gap:.85rem!important}
`; TR.append(st); }
{ const _ys = yearShelfHTML; yearShelfHTML = function () {
  const h = _ys.apply(this, arguments); if (!h) return h;
  return h.replace(/(class="es-bk ys-bk)((?: paw| ys-5| ys-ouro| ys-45| ys-prata| ys-bronze| ys-ferro)+)/g, '$1')
    .replace(/<div class="ys-leg">[\s\S]*?<\/div>/, '');
}; }
