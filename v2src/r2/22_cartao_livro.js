// Grade de livros em cartões (referência da Bia, com a cara do app): cartão creme, capa saindo pela borda de cima,
// patinhas em coluna ao lado da capa (vazias quando não tem nota), título numa linha e status embaixo quando não é lido.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .esv-grid{grid-template-columns:repeat(3,1fr)!important;gap:1.5rem .6rem!important;padding-top:.9rem}
#shelflist .esv-grid > .es-bk{position:relative;display:grid!important;grid-template-columns:minmax(0,1fr) 15px;grid-template-rows:auto auto auto;column-gap:5px;row-gap:.15rem;align-items:start;
  background:var(--panel);border:1px solid color-mix(in srgb,var(--line) 70%,transparent);border-radius:16px;padding:0 .4rem .55rem .45rem;margin-top:16px;box-shadow:0 6px 14px -8px rgba(60,35,15,.35);text-align:left;width:100%;box-sizing:border-box}
#shelflist .esv-grid > .es-bk > .cv{grid-area:1/1/2/2;width:100%!important;height:auto!important;aspect-ratio:2/3;margin-top:-16px;border-radius:4px 8px 8px 4px!important;box-shadow:0 6px 12px -4px rgba(0,0,0,.35)}
#shelflist .esv-grid > .es-bk > small:not(.es4-st){grid-area:2/1/3/3;display:block!important;-webkit-line-clamp:unset!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:900;font-size:.78rem;color:var(--ink);margin-top:.35rem}
#shelflist .esv-grid > .es-bk > .es4-st{grid-area:3/1/4/3;font-size:.68rem}
#shelflist .esv-grid > .es-bk > .es4-st:has(.pw5){grid-area:1/2/2/3;align-self:center;margin:0}
#shelflist .esv-grid .es4-st .pw5{flex-direction:column;gap:3px}
#shelflist .esv-grid .es4-st .pw5 i,#shelflist .esv-grid .es4-st .pw5 svg{width:15px;height:15px}#shelflist .esv-grid .pw5 i.o svg,#shelflist .esv-grid .pw5 i.h svg:first-child{opacity:.18}
#shelflist .esv-grid .es4-st .pw5{color:#d79a2b}
`; TR.append(st); }
// "lido" sem nota também mostra as patinhas (vazias), como na referência
{ const fixEmpty = () => TR.querySelectorAll('#shelflist .esv-grid small.es4-st').forEach((s) => { if (s.dataset.pw || s.textContent.trim() !== 'lido') return; s.dataset.pw = 1; s.innerHTML = paws5(0); });
  new MutationObserver(fixEmpty).observe(TR, { childList: true, subtree: true }); }
