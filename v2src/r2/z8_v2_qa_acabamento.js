// Acabamento do portão de QA (22/11): contraste, fonte e sobreposição que o portão achou.
// Contraste vira token: as cores de texto das pílulas (Atividade, cartão de leitura), do vermelho de "Remover da Biblioteca" e do
// dourado das notas eram tons claros pensados para o tema escuro e ficavam ilegíveis no Papel (1,6 a 2,9:1). No Papel elas ganham
// versões escuras (todas ≥ 4,5:1 sobre o fundo creme); nos temas escuros nada muda. Botão com fundo laranja usa --on-acc
// (texto escuro sobre o laranja claro dos temas escuros: o "Aceitar" do Ler junto estava em 1,8:1).
{ const hs = document.createElement('style'); hs.id = 'z8tok'; hs.textContent = `
html[data-pal="papel"]{--tx-eco:#7d5200;--tx-le:#5a40a8;--tx-te:#24704a;--tx-co:#1f6482;--tx-in:#93376f;--tx-ab:#a8352a;--tx-pa:#45607f;--tx-dng:#a8352a;--tx-gold:#7d5200}
html[data-theme="dark"]{--on-acc:#1d140b}
@media (prefers-color-scheme:dark){html[data-theme="auto"]:not([data-pal="papel"]){--on-acc:#1d140b}}`; document.head.append(hs); }
// nota em dourado nas listas antigas (Metas, estantes): mesmo token do Papel
{ const st = document.createElement('style'); st.textContent = '.sl-info em{color:var(--tx-gold,#e0a526)}'; TR.append(st); }
