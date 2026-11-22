// Adicionar nunca só no fim da lista (Bia, 22/11: "a lista pode ser enorme e a pessoa tem que rolar muito para adicionar").
// Padrão: a ação fica no cabeçalho da seção, à direita ("+ Novo", "+ Livro", "+ Emprestar"); lista vazia pode ter o botão grande.
// Metas (Prazos dos livros) e Empréstimos já montam o cabeçalho no próprio bloco; aqui: a lista de livros de uma meta com prazo
// (página da meta, aba Livros), que tinha "+ Adicionar livro à meta" embaixo da lista.
{ const st = document.createElement('style'); st.textContent = `
.v5addh{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin:0 0 .5rem}
.v5addh > h2{margin:0!important}
/* título do topo em 360px: "Empréstimos" cortava (22/11) */
@media (max-width:380px){#g-t:not(.g-brand){font-size:1.08rem!important;letter-spacing:-.01em}}
.v5addh > #go-add-book{flex:none;min-height:44px;margin:0!important;padding:0 1rem!important;border-radius:999px!important;border:1.5px solid color-mix(in srgb,var(--acc,var(--caramel-deep)) 55%,var(--line))!important;background:none!important;color:var(--acc,var(--caramel-deep))!important;font:inherit;font-size:.86rem!important;font-weight:900!important;text-decoration:none!important;cursor:pointer}
`; TR.append(st); document.head.append(st.cloneNode(true)); }
// a página da meta mora no documento (fora do TR); procura nos dois
{ const b = TR.querySelector('#go-add-book') || document.querySelector('#go-add-book'), panel = b && b.closest('.panel'), h = panel && panel.querySelector(':scope > h2');
  if (b && h) { const row = document.createElement('div'); row.className = 'v5addh'; h.before(row); row.append(h, b); b.textContent = '+ Livro'; b.setAttribute('aria-label', 'Adicionar livro à meta'); } }
