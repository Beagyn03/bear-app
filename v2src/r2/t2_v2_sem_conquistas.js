// Conquistas saíram da v2 (Bia, 19/11): as últimas menções somem (teste 20/11 itens 28 e 42):
// Comunidade › Novidades no feed e Ajustes › O que aparece no meu perfil.
{ const i = FEED_KINDS.findIndex(([k]) => k === 'achievement'); if (i >= 0) FEED_KINDS.splice(i, 1);
  const clean = () => { TR.querySelectorAll('label.ck-row, .dd label, .dd .ck-row').forEach((l) => { if ((l.textContent || '').trim() === 'Conquistas') l.remove(); }); };
  new MutationObserver(clean).observe(TR, { childList: true, subtree: true }); }
// Tour com os rótulos da v2 (teste 20/11 item 45): Hoje, Estante (Livros/Estantes/Trechos), Ler, Comunidade, Você; sem conquistas,
// sem "Minha biblioteca", "Amigos" ou o menu antigo. A busca é a lupa do topo.
TOUR.splice(0, TOUR.length,
  [null, 'Boas-vindas ao Livroverso', 'Um passeio rápido pelo app. Leva menos de um minuto.'],
  ['#tabbar [data-tab=inicio]', 'Hoje', 'O livro que você está lendo, seu prazo, a órbita, a meta e a Pergunta do dia. Use Atualizar no cartão do livro para marcar a página.'],
  ['#tabbar [data-tab=estante]', 'Estante', 'Todos os seus livros em Livros, suas estantes em Estantes e o que você guardou em Trechos. Toque na capa para abrir; segure para o menu.'],
  ['#tabbar [data-tab=ler]', 'Ler', 'Comece uma sessão de leitura com cronômetro, luz e ecos de quem leu a mesma página.'],
  ['#tabbar [data-tab=comunidade]', 'Comunidade', 'Comentários, trechos e avaliações de quem lê, com controle de spoiler, e as leituras conjuntas.'],
  ['#tabbar [data-tab=eu]', 'Você', 'Seu perfil, metas, estatísticas, resumo do mês e ajustes.'],
  ['#g-find', 'Buscar', 'Ache um livro ou um leitor pela lupa.'],
  [null, 'Pronto!', 'Boa leitura!']);
