// Enredo dentro de Sobre (Bia, 20/11; protótipo): a aba Enredo saiu, mas o termômetro de ressaca e os níveis do enredo
// continuam, no fim de Sobre, depois da sinopse e da ficha. Antes, com a aba escondida, eles ficavam inacessíveis.
{ const st = document.createElement('style'); st.textContent = `
#shelflist[data-bt=sobre] .sl-body > .rs-term,#shelflist[data-bt=sobre] .sl-body > .nv-term{display:block!important}
`; TR.append(st); }
{ let tm = 0; const v = $('#shelflist');
  const fix = () => { tm = 0; if (!v || v.hidden || v.dataset.bt !== 'sobre') return; const body = v.querySelector('.sl-body'); if (!body) return;
    const rs = body.querySelector(':scope > .rs-term'), nv = body.querySelector(':scope > .nv-term'); if (!rs && !nv) return;
    const anchor = body.querySelector(':scope > .bp-src') || body.querySelector(':scope > .bp-dl') || body.querySelector(':scope > .bp-sec'); if (!anchor) return;
    let at = anchor; for (const x of [rs, nv]) { if (!x) continue; if (at.nextElementSibling !== x) at.after(x); at = x; } };
  if (v) new MutationObserver(() => { if (!tm) tm = setTimeout(fix, 80); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-bt', 'hidden'] }); }
