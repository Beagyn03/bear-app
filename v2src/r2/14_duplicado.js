// Livro que já está na biblioteca não entra duplicado sem perguntar: lido → "Ler de novo" (releitura no mesmo livro, nota e
// avaliação continuam); em andamento ou na fila → abrir o que já existe. "Adicionar outra edição" fica como saída consciente.
{
  const ST = { LENDO: 'você está lendo', QUERO: 'está na sua fila', LIDO: 'você já leu', HIBERNANDO: 'está pausado', ABANDONEI: 'você abandonou' };
  const _atl = addToLibrary;
  addToLibrary = function (item, intoCase, direct, opt) {
    const args = arguments, self = this;
    if (!item || !item.title || (opt && (opt.dupOk || opt.quiet))) return _atl.apply(self, args);
    const k = normT(item.title), a = normT(String(item.author || '').split(',')[0]);
    const e = lib().find((x) => normT(x.title) === k && (!a || !x.author || normT(String(x.author).split(',')[0]) === a));
    if (!e) return _atl.apply(self, args);
    const rv = reviewOfLib(e), items = [];
    if (e.status === 'LIDO') items.push({ label: 'Ler de novo', sub: 'releitura no mesmo livro; nota e avaliação ficam', fn: () => startReread(e) });
    items.push({ label: 'Abrir o livro', sub: rv && rv.paws ? pawTxt(rv.paws) : '', fn: () => openBook(e.id) });
    items.push(0, { label: 'Adicionar outra edição mesmo assim', fn: () => _atl.call(self, item, intoCase, direct, { ...(opt || {}), dupOk: true }) });
    sheetList(`“${esc(e.title)}” já está na sua biblioteca: ${ST[e.status] || 'já está aqui'}`, items);
  };
}
