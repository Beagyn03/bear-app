// Prioridade na fila (Quero ler): Alta / Normal / Baixa (e.prio = 1 / 2 / 3). A próxima leitura marcada à mão continua acima de tudo;
// sem ela, o Início sugere a de prioridade mais alta. Ordenação "Prioridade" nas estantes.
function prioSheet(e) {
  const cur = e.prio || 2, set = (p) => { if (p === 2) delete e.prio; else e.prio = p; save(); refresh(); if (S.listRedraw && !$('#shelflist').hidden) S.listRedraw(); toast(`Prioridade ${({ 1: 'alta', 2: 'normal', 3: 'baixa' })[p]}`); };
  sheetList(`Prioridade de “${esc(e.title)}”`, [
    { label: 'Alta', sub: 'vai para a frente da fila', on: cur === 1, fn: () => set(1) },
    { label: 'Normal', on: cur === 2, fn: () => set(2) },
    { label: 'Baixa', sub: 'fica no fim da fila', on: cur === 3, fn: () => set(3) },
  ]);
}
if (!ES_SORTS.some((x) => x[0] === 'prioridade')) ES_SORTS.splice(1, 0, ['prioridade', 'Prioridade']);
{ const _sl = sortList; sortList = function (list, mode) {
  if (mode !== 'prioridade') return _sl.apply(this, arguments);
  const rank = (e) => (e.status === 'LENDO' ? 0 : e.status === 'QUERO' ? 1 : 2);
  return [...list].sort((a, b) => rank(a) - rank(b) || (a.status === 'QUERO' && b.status === 'QUERO' ? ((a.id === T().nextId ? 0 : a.prio || 2) - (b.id === T().nextId ? 0 : b.prio || 2)) : 0) || String(b.addedAt || '').localeCompare(String(a.addedAt || '')));
}; }
