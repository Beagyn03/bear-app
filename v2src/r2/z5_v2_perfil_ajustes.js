// Perfil (Bia, 21/11): no atalho "Ler junto" de Minha leitura o "›" caía para a linha de baixo. O cartão é uma grade de 3 colunas
// e o resumo ("2 em andamento") ocupava a 3ª coluna da 1ª linha, empurrando o "›" para a 2ª. Agora cada parte tem lugar fixo:
// (o cartão também perdia a largura toda quando a grade tinha 5 itens: .v3hub.n5 button:nth-child(n+4) era mais forte)
// ícone | título em cima e resumo embaixo | "›" à direita, centralizado nas duas linhas.
{ const st = document.createElement('style'); st.textContent = `
.v3hub.v3hub button.v3hub-lj{grid-column:1 / -1;display:grid;justify-items:start;text-align:left;column-gap:.7rem;align-items:center;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto}
.v3hub.v3hub button.v3hub-lj > .v3pi{grid-column:1;grid-row:1 / span 2}
.v3hub.v3hub button.v3hub-lj > b{grid-column:2;grid-row:1;min-width:0}
.v3hub.v3hub button.v3hub-lj > small{grid-column:2;grid-row:2;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v3hub.v3hub button.v3hub-lj > em{grid-column:3;grid-row:1 / span 2;align-self:center}
`; TR.append(st); }
