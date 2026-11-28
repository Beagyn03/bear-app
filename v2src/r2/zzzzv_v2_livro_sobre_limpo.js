// ---------- v2: página do livro, aba Sobre enxuta (Bia, 27/11) ----------
// "Agora precisamos arrumar a página do livro... tá muito bagunçado, muito poluído."
//  - A ficha não repete o que as etiquetas do topo já dizem (páginas, editora, idioma); o que sobra (ano, ISBN) vira uma
//    linha discreta, sem cartão.
//  - Sai "Fonte: Livroverso". Sem sinopse (ou buscando), uma linha discreta em vez do cartão grande.
//  - Ressaca literária e Níveis do enredo só aparecem quando alguém já votou (vazios eram só convite).
//  - Onde comprar: as lojas viram etiquetas lado a lado, em vez de sete linhas grandes.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .sl-body > .bp-src{display:none!important}
#shelflist .sl-body > .bp-sec:has(> .bp-load:only-child){border:0!important;background:none!important;box-shadow:none!important;padding:0!important;min-height:0!important;margin:.2rem 0 .5rem!important}
#shelflist .sl-body > .bp-sec > .bp-load:only-child{font-size:.8rem;color:var(--ink-2);text-align:center;margin:0;padding:0}
#shelflist[data-bt=sobre] .sl-body > .rs-term:has(.rs-empty),#shelflist[data-bt=sobre] .sl-body > .nv-term:has(.nv-empty){display:none!important}
#shelflist .sl-body > .bp-dl.lv-dl{display:flex!important;flex-wrap:wrap;justify-content:center;gap:.15rem .35rem!important;border:0!important;background:none!important;box-shadow:none!important;padding:0!important;margin:.1rem 0 .9rem!important;font-size:.78rem;color:var(--ink-2)}
#shelflist .sl-body > .bp-dl.lv-dl dt,#shelflist .sl-body > .bp-dl.lv-dl dd{font-size:.78rem!important;font-weight:700!important;letter-spacing:0!important;text-transform:none!important;color:var(--ink-2)!important;margin:0!important}
#shelflist .sl-body > .bp-dl.lv-dl dd:not(.lv-last)::after{content:" ·";margin-left:.1rem}
#shelflist .sl-body > .bp-dl.lv-dl .lv-dup{display:none!important}
#shelflist .sl-body > .bp-dl.lv-dl.lv-vazia{display:none!important}
#shelflist .oc-sec h3{font-size:1.05rem}
#shelflist .oc-sec .oc-l{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.5rem}
#shelflist .oc-sec .oc-it{display:inline-flex;width:auto;align-items:baseline;gap:.35rem;border:1px solid var(--line);border-radius:999px;padding:.45rem .85rem;background:var(--panel);min-height:38px}
#shelflist .oc-sec .oc-it > i,#shelflist .oc-sec .oc-it > em:not(.oc-pr){display:none}
#shelflist .oc-sec .oc-it > span{display:inline-flex;align-items:baseline;gap:.3rem}
#shelflist .oc-sec .oc-it b{font-size:.85rem}#shelflist .oc-sec .oc-it small{font-size:.7rem}
#shelflist .oc-sec .oc-it > em.oc-pr{font-size:.78rem}#shelflist .oc-sec .oc-it > em.oc-pr small{display:none}
#shelflist .oc-sec .oc-it:active{background:var(--soft)}
#shelflist .oc-sec .oc-note{font-size:.72rem;margin-top:.5rem}
`; TR.append(st); }
{ let tm = 0; const v = $('#shelflist');
  const fix = () => { tm = 0; try { if (!v || v.hidden) return; const body = v.querySelector('.sl-body'); const dl = body && body.querySelector(':scope > .bp-dl'); if (!dl) return;
    const chips = [...v.querySelectorAll('.bp-hero .bp-chip')].map((c) => normT(c.textContent || '').replace(/[^a-z0-9]/g, ''));
    let vis = 0, last = null;
    dl.querySelectorAll('dt').forEach((dt) => { const dd = dt.nextElementSibling; if (!dd || dd.tagName !== 'DD') return; const k = normT(dd.textContent || '').replace(/[^a-z0-9]/g, '');
      const dup = !k || chips.some((c) => c === k || c.startsWith(k + 'pag') || c === k + 'pag'); dt.classList.toggle('lv-dup', dup); dd.classList.toggle('lv-dup', dup); dd.classList.remove('lv-last'); if (!dup) { vis++; last = dd; } });
    if (last) last.classList.add('lv-last'); dl.classList.add('lv-dl'); dl.classList.toggle('lv-vazia', !vis);
    // (Bia 28/11) ano e ISBN viraram etiquetas no topo (q0/t1): a linha embaixo da sinopse sai de vez
    dl.classList.toggle('lv-vazia', true);
  } catch (err) { console.warn('sobre enxuto', err); } };
  if (v) new MutationObserver(() => { if (!tm) tm = setTimeout(fix, 40); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-bt', 'hidden'] }); }
