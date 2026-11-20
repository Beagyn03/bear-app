// Página do livro (Bia, 16/11): "Ajustes do livro" compacto em duas colunas (rótulo pequeno em cima, valor embaixo), para ocupar menos tela.
{ const st = document.createElement('style'); st.textContent = `
.bp-card:has(> .bp-adj){display:grid;grid-template-columns:1fr 1fr;gap:.4rem}
.bp-card:has(> .bp-adj) > .bp-row{grid-column:1/-1;margin-bottom:.1rem}
.bp-card > .bp-adj{display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;align-items:center;gap:0 .3rem;min-height:0;padding:.45rem .6rem;border:1px solid var(--line);border-radius:10px;background:var(--bg);font-size:.72rem;font-weight:800;color:var(--ink-2)}
.bp-card > .bp-adj span{grid-column:1;grid-row:1}.bp-card > .bp-adj b{grid-column:1;grid-row:2;margin:0;font-size:.84rem;font-weight:800;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bp-card > .bp-adj i{grid-column:2;grid-row:1 / span 2}
.bp-card > .bp-adj[data-a="rmlib"] b{color:inherit;opacity:.8;font-weight:700}
`; TR.append(st); }
