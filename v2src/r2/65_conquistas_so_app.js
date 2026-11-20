// Conquistas só valem pelo que foi feito no app (Bia, 17/11): o que veio de importação (CSV, histórico) não conta.
// - Da lista para a mão: só livros que saíram do Quero ler para Lendo dentro do app (e.fromQuero).
// - Explorador: só livros adicionados pelo Catálogo do app (e.viaCat).
// - Resenhista: só resenhas de livros lidos pelo app (mesmo critério de "lido com registro").
// - Mudança de estante: a única que vale com importação (é trazer o histórico).
// - Acervo crescendo: vira organizar 30 livros LIDOS PELO APP nas suas estantes.
{ const _m2 = achMetrics;
  achMetrics = function () {
    const M = _m2(); const { lidos: V } = verifiedReading(); const vset = new Set(V.map((e) => e.id)), L = lib();
    M.fromQuero = L.filter((e) => e.fromQuero).length;
    M.catAdds = L.filter((e) => e.viaCat).length;
    M.textReviews = V.filter((e) => { const r = reviewOfLib(e); return r && String(r.texto || '').trim().length >= 20; }).length;
    const shelved = new Set(); for (const s of (db.shelves || [])) for (const id of (s.bookIds || [])) if (vset.has(id)) shelved.add(id);
    M.shelvedApp = shelved.size; // Mudança de estante continua contando a importação (é a conquista de trazer o histórico)
    return M;
  };
  for (const a of ACHIEVEMENTS) {
    if (a.id === 'mud10') a.desc = 'Trazer 10 livros lidos para o app (vale importação)';
    if (a.id === 'mud50') { a.m = 'shelvedApp'; a.goal = 30; a.desc = 'Organizar 30 livros lidos pelo app nas suas estantes'; }
    if (a.id === 'quero5') a.desc = 'Começar no app 5 livros que estavam no Quero ler';
    if (a.id === 'cat5') a.desc = 'Adicionar 5 livros pelo Catálogo do app';
    if (a.id === 'resenha3') a.desc = 'Escrever 3 resenhas de livros lidos pelo app';
  } }
