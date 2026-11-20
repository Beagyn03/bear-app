// Capas (rodada 2): "lido" vira uma fitinha de marcador verde na borda de cima (não cobre o título da capa);
// títulos longos ficam em até 2 linhas com reticências nas listas e na busca.
{ const st = document.createElement('style'); st.textContent = `
.ct-tx small,.es4-bk > small,.es-bk > small,.sl-item b,.ys-bk + small,.car small,.v3-q small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}
.ct-tx b,.fs-res b,.fs-it b,.srch-it b,.res-it b,.bk-res b{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
`; TR.append(st); }
// busca (folha "Adicionar livro", fora do shadow root): título em até 3 linhas, autor em 1
{ const st = document.createElement('style'); st.textContent = `.sheet .result b{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.sheet .result span{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}`; document.head.append(st); }
