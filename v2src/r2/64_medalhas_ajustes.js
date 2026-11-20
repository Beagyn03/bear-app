// Ajustes das medalhas (Bia, 17/11): as conquistas que entraram no lugar de outras ganham medalha e prêmio próprios;
// Leitura completa ganha medalha; Primeira crítica passa a pedir 1 avaliação (bate com o nome).
{ const FIX = {
    formatos: ['Trio de formatos', 'd01'], dupla1: ['Livro a quatro mãos', 'd02'], cat5: ['Lupa do catálogo', 'd03'], volta1: ['Livro retomado', 'd04'],
    quero5: ['Livro na mão', null], resenha3: ['Diário de resenhas', null],
  };
  for (const a of ACHIEVEMENTS) {
    if (a.legacy) continue; const f = FIX[a.id];
    if (f) { a.rn = f[0]; if (f[1]) DECO_IMG[a.reward] = 'img/cq/' + f[1] + '.webp'; }
    if (a.id === 'rev5') { a.goal = 1; a.desc = 'Avaliar 1 livro lido pelo app'; }
  } }
