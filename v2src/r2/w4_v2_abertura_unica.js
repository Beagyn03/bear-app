// Uma abertura só (Bia, 20/11: "quando abro o app aparecem 2 logos, a logo do app e depois a logo da marca").
// No app instalado o sistema mostra a própria abertura (fundo #2e0b33 do manifest + ícone). Logo depois vinha a abertura do app,
// com outro fundo (bege) e a marca escrita: pareciam duas telas. Instalado, a abertura do app passa a começar IGUAL à do sistema
// (mesmo fundo, mesmo ícone no centro) e some assim que o app desenha, sem esperar os 900 ms. No navegador comum (não há abertura
// do sistema) continua a abertura com a marca.
{ const sa = (() => { try { return matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true; } catch { return false; } })();
  const sp = (typeof $ === 'function' && $('#splash')) || document.getElementById('splash');
  // o visual igual ao do sistema vem do script do topo do index.html (html[data-sa]), que roda antes do primeiro desenho;
  // aqui só se adianta a saída: some assim que o app desenhou, em vez de esperar 900 ms
  if (sa && sp) {
    // some assim que o app já desenhou , em vez de esperar 900 ms
    const go = () => requestAnimationFrame(() => requestAnimationFrame(() => sp.classList.add('out')));
    go(); // os blocos rodam antes do drawAll final; dois quadros depois o Hoje já está desenhado (ou com o esqueleto do bloco 93)
  }
}
