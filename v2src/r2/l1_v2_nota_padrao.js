// Nota padronizada no app todo (Bia, 20/11; modelo do protótipo): estrelas embaixo da capa, ou "★ 3,5" pequeno onde a capa é
// pequena. Saem os contornos dourado/prata/bronze por nota, os brilhos, as moedas/marcadores com número (mk-bear, ys-mk) e o ✓.
// As estrelas só aparecem nas listas dos SEUS livros (páginas de estante, listas por situação, Leituras do ano, busca); no feed,
// no Hoje e no Top 3 o contorno sai e nada entra no lugar (lá a nota de cada post já vem no texto/etiqueta).
{ const st = document.createElement('style'); st.textContent = `
.cv.rt,.cv.rt-5,.cv.rt-ouro,.cv.rt-prata,.cv.rt-bronze,.cv.rt-ferro,.ys-cv{box-shadow:0 4px 10px rgba(0,0,0,.18)!important}
.cv.rt::before,.cv.rt-5::before,.cv.rt-ouro::before,.cv.rt-prata::before{display:none!important}
.rt-sp.rt-sp.rt-sp.rt-sp,#shelflist .rt-sp.rt-sp.rt-sp.rt-sp,#lista .rt-sp.rt-sp.rt-sp.rt-sp,#editor .rt-sp.rt-sp.rt-sp.rt-sp,.ys-sp.ys-sp.ys-sp.ys-sp,#shelflist .ys-sp.ys-sp.ys-sp.ys-sp,#lista .ys-sp.ys-sp.ys-sp.ys-sp,#editor .ys-sp.ys-sp.ys-sp.ys-sp,.mk-bear.mk-bear.mk-bear.mk-bear,#shelflist .mk-bear.mk-bear.mk-bear.mk-bear,#lista .mk-bear.mk-bear.mk-bear.mk-bear,#editor .mk-bear.mk-bear.mk-bear.mk-bear,.ys-mk.ys-mk.ys-mk.ys-mk,#shelflist .ys-mk.ys-mk.ys-mk.ys-mk,#lista .ys-mk.ys-mk.ys-mk.ys-mk,#editor .ys-mk.ys-mk.ys-mk.ys-mk,.es4-done.es4-done.es4-done.es4-done,#shelflist .es4-done.es4-done.es4-done.es4-done,#lista .es4-done.es4-done.es4-done.es4-done,#editor .es4-done.es4-done.es4-done.es4-done{display:none!important}
.v6st{display:block;color:var(--acc);letter-spacing:1px;font-size:12px;line-height:1.2;margin-top:2px;font-weight:400;white-space:nowrap}
.rd-tag.rd-nt.rd-nt{white-space:nowrap;background:color-mix(in srgb,var(--acc) 15%,transparent);color:var(--acc)}.rd-tag.rd-nt i{font-style:normal;letter-spacing:1px;margin-left:.15rem}.rd-tag.rd-nt u{text-decoration:none;opacity:.3}
.v6st i{font-style:normal;color:color-mix(in srgb,var(--ink) 18%,transparent)}
.v6st.t{display:inline;letter-spacing:0;font-size:.72rem;font-weight:800;color:var(--ink-2)}
.es4-st.v6host.v6host{display:block!important}.es4-st.v6host .v6st{margin-top:0}
`; TR.append(st); }
{
  let map = null, at = 0;
  const rates = () => { if (map && Date.now() - at < 1500) return map; map = new Map(); at = Date.now();
    try { for (const e of lib()) { if (e.status !== 'LIDO') continue; const p = Number((reviewOfLib(e) || {}).paws) || 0; if (p) map.set(normT(e.title), p); } } catch {} return map; };
  const _cvh = cvh;
  cvh = function (title) {
    let h = _cvh.apply(this, arguments);
    h = h.replace(/ rt rt-(5|ouro rt-45|ouro|prata|bronze|ferro)/, '').replace(/<span class="rt-sp [abc]">✦<\/span>/g, '');
    const p = rates().get(normT(title || '')); if (p) h = h.replace('<span class="cv ', `<span data-rt="${p}" class="cv `);
    return h;
  };
  const stars = (p) => { const n = Math.round(p); return '★'.repeat(n) + '<i>' + '★'.repeat(5 - n) + '</i>'; };
  const fmt = (p) => String(p).replace('.', ',');
  const SKIP = '.v4psh, .v4fx, .v2gc, .v3at, .rd-card, .bp-hero, .v3tp3, .v3tp, .rd-post, .fd-post, .v3x, .v3hero, .ys-g, .ys-row, .yv-tb';
  const place = (cv) => {
    cv.dataset.v6 = '1'; const p = Number(cv.dataset.rt) || 0; if (!p) return;
    if (!cv.closest('#shelflist') || cv.closest(SKIP)) return;
    const card = cv.closest('.es-bk, .es4-bk, button, a, li, article') || cv.parentElement; if (!card || card.querySelector('.v6st')) return;
    if (/★/.test(card.textContent || '')) return; // o cartão já mostra a nota (ex.: lista Lidos da Meta): não repete
    const host = card.querySelector('.es4-st'); if (host) { host.classList.add('v6host'); host.innerHTML = '<span class="v6st" aria-label="nota ' + fmt(p) + '">' + stars(p) + '</span>'; return; }
    const w = cv.getBoundingClientRect().width, cs = getComputedStyle(card), row = cs.display.includes('flex') && !cs.flexDirection.startsWith('column');
    if (!row && w >= 44) { const cap = [...card.children].find((x) => x !== cv && /^(SMALL|B|SPAN)$/.test(x.tagName) && !x.classList.contains('cv') && x.offsetParent !== null && (x.textContent || '').trim()); const s = document.createElement('span'); s.className = 'v6st'; s.setAttribute('aria-label', 'nota ' + fmt(p)); s.innerHTML = stars(p); (cap || cv).after(s); return; }
    const txt = cv.nextElementSibling; const s = document.createElement('small'); s.className = 'v6st t'; s.textContent = '★ ' + fmt(p);
    if (txt && txt !== cv) { const br = document.createElement('br'); txt.append(br, s); }
  };
  let tm = 0; const scan = () => { tm = 0; TR.querySelectorAll('.cv[data-rt]:not([data-v6])').forEach((cv) => { try { place(cv); } catch {} }); };
  new MutationObserver(() => { if (!tm) tm = setTimeout(scan, 60); }).observe(TR, { childList: true, subtree: true });
}
