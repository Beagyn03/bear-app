// Estantes: capas maiores e linha cheia (Bia, 22/11: "as capas estão tão pequenas, tem 21 livros e espaço pra mais livros ali… ta vazio").
// Antes: 5 capas de 44px e o resto da linha vazio. Agora: grade que ocupa a largura do cartão, capas de ~74–82px (360–412),
// quantas couberem (3 a 10, por container query, sem medir em JS: nada muda depois de pintar). Se a estante tem mais livros
// do que vagas, a última vaga vira uma pilha "+N" (tocar abre a estante, como o cartão). Com poucos livros, as capas ficam
// do mesmo tamanho, alinhadas à esquerda, e o espaço que sobra mostra "N de M lidos" com barra. A leitura atual vem primeiro.
const VZK = [3, 4, 5, 6, 7, 8, 9, 10];
const VZMIN = { 3: 0, 4: 296, 5: 372, 6: 448, 7: 524, 8: 600, 9: 676, 10: 752 };
const VZCSS = `<style data-v9cv>
.shelf .covers.v9{display:block;margin-top:12px;container-type:inline-size}
.shelf .covers.v9 .v9g{display:grid;grid-template-columns:repeat(var(--k),minmax(0,1fr));gap:8px;--k:3}
.shelf .covers.v9 .v9g > *{grid-row:1}
.shelf .covers.v9 .cv{width:100%!important;height:auto!important;aspect-ratio:2/3;font-size:11px;padding:6px}
.shelf .covers.v9 .v9p{position:relative;aspect-ratio:2/3;display:block}
.shelf .covers.v9 .v9p .cv{position:absolute;inset:0;font-size:0;color:transparent!important;text-shadow:none!important}
.shelf .covers.v9 .v9p .cv *{display:none!important}
.shelf .covers.v9 .v9p .cv:nth-child(1){transform:translate(-6%,-3%) rotate(-5deg);filter:brightness(.7)}
.shelf .covers.v9 .v9p .cv:nth-child(2){transform:translate(-3%,-1.5%) rotate(-2.5deg);filter:brightness(.82)}
.shelf .covers.v9 .v9p b{position:absolute;inset:0;z-index:2;display:grid;place-content:center;justify-items:center;gap:3px;font:900 22px/1 var(--f-ui,inherit);color:#fff;background:rgba(15,10,25,.72);box-shadow:0 4px 10px rgba(0,0,0,.25);border-radius:4px 8px 8px 4px;flex:none;text-shadow:0 1px 3px rgba(0,0,0,.5)}
.shelf .covers.v9 .v9r{grid-column-end:-1;align-self:end;display:flex;flex-direction:column;gap:6px;padding:0 0 4px 6px;font-size:12.5px;font-weight:700;color:var(--ink2);min-width:0}
.shelf .covers.v9 .v9r i{display:block;height:6px;border-radius:99px;background:var(--soft);overflow:hidden}
.shelf .covers.v9 .v9r i::before{content:"";display:block;height:100%;width:var(--p);background:var(--acc);border-radius:inherit}
.shelf .covers.v9 .v9e{grid-column:1/-1;display:flex;align-items:center;gap:12px;font-size:13px;color:var(--ink2)}
.shelf .covers.v9 .v9e .cv{width:56px!important;flex:none;background:var(--soft)!important;border:1.5px dashed var(--line);box-shadow:none}
.shelf .covers.v9 .v9p{display:none}
${VZK.map((k) => `@container (min-width:${VZMIN[k]}px)${k === 10 ? '' : ` and (max-width:${VZMIN[k + 1] - 0.02}px)`}{.shelf .covers.v9 .v9g{--k:${k}}.shelf .covers.v9 .v9p${k}{display:block}.shelf .covers.v9 .v9h${k}{display:none!important}}`).join('')}
</style>`.replace(/\n/g, '');
// a container query vale para os filhos do container: a grade (.v9g) fica dentro de .covers
function vzCovers(B, s) {
  const n = B.length, lid = B.filter((e) => e.status === 'LIDO').length;
  if (!n) return `<div class="covers v9"><div class="v9g"><span class="v9e"><span class="cv"></span><span>Vazia por enquanto · segure para pôr livros</span></span></div></div>`;
  const L = B.slice().sort((a, b) => (b.status === 'LENDO') - (a.status === 'LENDO')).slice(0, 10);
  // capa i fica escondida na largura k quando não cabe (i >= k) ou quando a vaga dela virou a pilha (n > k e i >= k-1)
  const cov = L.map((e, i) => { const h = VZK.filter((k) => i >= k || (n > k && i >= k - 1)).map((k) => 'v9h' + k).join(' '); return v4cv(e, h); }).join('');
  const piles = VZK.filter((k) => n > k).map((k) => { const rest = L.slice(k - 1, k + 1); return `<span class="v9p v9p${k} pile" style="grid-column:${k}" aria-label="mais ${n - (k - 1)} livros">${rest.map((e) => v4cv(e)).join('')}<b>+${n - (k - 1)}<small style="font-size:11px;font-weight:800;opacity:.85">livros</small></b></span>`; }).join('');
  // o resto da linha (poucos livros): "N de M lidos" — some nas larguras em que os livros enchem a linha
  const hr = VZK.filter((k) => n >= k).map((k) => 'v9h' + k).join(' ');
  const rest = n < 10 ? `<span class="v9r ${hr}" style="grid-column-start:${n + 1}"><span>${lid} de ${n} lidos</span><i style="--p:${Math.round((lid / n) * 100)}%"></i></span>` : '';
  return `<div class="covers v9"><div class="v9g">${cov}${piles}${rest}</div></div>`;
}
{
  const _card = v5ShCard;
  v5ShCard = function (s, ed) {
    const html = _card(s, ed);
    try { return html.replace(/<div class="covers">[\s\S]*<\/div><\/button>$/, vzCovers(v5ShBooks(s), s) + '</button>'); } catch { return html; }
  };
  const pre = (f) => function () { const h = f.apply(this, arguments); return typeof h === 'string' && !h.includes('data-v9cv') ? VZCSS + h : h; };
  v5EstantesHTML = pre(v5EstantesHTML);
  v5GrpHTML = pre(v5GrpHTML);
  v5ArqHTML = pre(v5ArqHTML);
}
