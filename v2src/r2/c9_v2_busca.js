// v2 etapa 2 (19/11): Busca e catálogo no padrão novo.
//  - Cabeçalho como o das outras telas ("Buscar" + linha de ajuda); campo em pílula com a lupa, leitor de ISBN redondo
//    e "Buscar" no degradê; abas Livros/Leitores em pílula (c6).
//  - Resultados em cartões com capa de livro, título em serifa, autor e selos (páginas, ano, idioma) em pílula.
//  - Leitores, autor e cadastro manual herdam cartões, campos e botões do padrão (c0/c6).
// Só visual: tocar no resultado, no ISBN, em "Buscar" e nas abas faz o mesmo de antes.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .v2-bh{padding:.3rem .15rem .75rem}
#shelflist .v2-bh .eb{font-size:.68rem;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:var(--ink-2)}
#shelflist .v2-bh h1{margin:.12rem 0 0;font-family:var(--v2-disp);font-size:1.7rem;line-height:1.1;color:var(--ink)}
#shelflist .ct-form{display:grid!important;grid-template-columns:1fr auto auto!important;gap:.45rem!important;align-items:center;margin-bottom:.8rem!important}
#shelflist .ct-form .fs-input,#shelflist #ct-q{height:48px!important;border-radius:999px!important;padding:0 1.1rem 0 2.6rem!important;background:var(--panel) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23998877' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='10.5' cy='10.5' r='6.5'/%3E%3Cpath d='M15.5 15.5l5 5'/%3E%3C/svg%3E") no-repeat .9rem 50%/18px!important;box-shadow:var(--v2-sh)!important;font-weight:700}
#shelflist .ct-scan{width:48px!important;height:48px!important;border-radius:50%!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;display:grid!important;place-items:center;color:var(--ink)!important}
#shelflist .ct-go{height:48px!important;padding:0 1.1rem!important;font-size:.92rem!important}
#shelflist .ct-mode{margin:0 0 .9rem!important}
#shelflist .ct-list{display:grid;gap:.7rem}
#shelflist .ct-it{display:grid!important;grid-template-columns:auto 1fr!important;gap:.85rem!important;align-items:start;border-radius:var(--v2-r)!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;padding:.8rem .85rem!important;margin:0!important}
#shelflist .ct-it .ct-cv{width:68px!important;height:102px!important;border-radius:4px 8px 8px 4px!important;box-shadow:0 8px 16px rgba(40,20,5,.22)!important}
#shelflist .ct-tx b{display:block;font-family:var(--v2-disp)!important;font-size:1.02rem!important;font-weight:700!important;line-height:1.22!important;color:var(--ink)!important}
#shelflist .ct-tx > small{display:block;margin-top:.2rem;font-size:.8rem!important;font-weight:800!important;color:var(--acc)!important}
#shelflist .ct-chips{display:flex;flex-wrap:wrap;gap:.3rem!important;margin-top:.5rem!important}
#shelflist .ct-chips span{border-radius:999px!important;border:0!important;background:color-mix(in srgb,var(--ink) 6%,var(--panel))!important;color:var(--ink)!important;font-size:.7rem!important;font-weight:900!important;padding:.22rem .6rem!important}
#shelflist .ct-chips span:last-child{background:color-mix(in srgb,var(--acc) 13%,var(--panel))!important;color:var(--acc)!important}
#shelflist .ct-acts{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.55rem}
#shelflist .ct-acts button{border-radius:999px!important;height:34px!important;padding:0 .85rem!important;font-weight:900!important;font-size:.78rem!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important}
#shelflist .ct-acts .ct-add,#shelflist .ct-acts .ct-now{background:var(--v2-pri)!important;border:0!important;color:var(--on-acc,#fff)!important}
#shelflist .sl-empty{border-radius:var(--v2-r);border:1px dashed var(--line);padding:1.2rem 1rem;text-align:center;color:var(--ink-2);font-weight:700;line-height:1.45}
/* leitores e amizades */
#shelflist .pp-it,#shelflist .fr-it,#shelflist .us-it,#shelflist .ppl-it{border-radius:18px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;padding:.7rem .8rem!important}
`; TR.append(st); }
{ let tm = 0;
  const paint = () => {
    const v = TR.querySelector('#shelflist'); if (!v || v.hidden) return; const f = v.querySelector('.ct-form'); if (!f) return;
    const tp = v.querySelector('.sl-top'); if (tp && tp.offsetParent) return; // catálogo/autor: a página já tem topo próprio
    let h = v.querySelector('.v2-bh'); const html = '<div class="eb">Catálogo e leitores</div><h1>Buscar</h1>';
    if (!h) { h = document.createElement('div'); h.className = 'v2-bh'; f.before(h); }
    if (h.innerHTML !== html) h.innerHTML = html;
  };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { paint(); } catch (err) { console.warn('v2 busca', err); } }, 50); })
    .observe(TR, { childList: true, subtree: true });
}
