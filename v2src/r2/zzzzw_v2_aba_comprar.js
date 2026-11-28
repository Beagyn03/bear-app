// ---------- v2: aba Comprar na página do livro (Bia, 27/11) ----------
// "Onde comprar não deveria ser uma aba?" A lista de lojas sai do fim de Sobre e ganha aba própria (Sobre · Minha leitura ·
// Comunidade · Comprar). Por baixo, a aba é a própria Sobre com só a seção de lojas visível: a montagem das lojas (b3) e o
// preço do Google continuam os mesmos. "Onde comprar" de outras telas (whereToBuy) abre o livro já nesta aba.
{ const st = document.createElement('style'); st.textContent = `
#shelflist:not(.lv-comprar) .sl-body > .oc-sec{display:none!important}
#shelflist.lv-comprar .sl-body > :not(.sl-top):not(.bp-hero):not(.bp-tabs):not(.v5bpacts):not(.oc-sec){display:none!important}
#shelflist.lv-comprar .sl-body > .oc-sec{margin-top:.2rem}
#shelflist.lv-comprar .sl-body > .oc-sec > h3{display:none}
#shelflist.lv-comprar .sl-body .bp-tabs > button.on{color:var(--ink-2)!important;border-bottom-color:transparent!important}
#shelflist.lv-comprar .sl-body .bp-tabs > button[data-lv=comprar]{color:var(--ink)!important;border-bottom-color:var(--acc)!important}
`; TR.append(st); }
{ let tm = 0; const v = $('#shelflist');
  const sai = () => { if (v) v.classList.remove('lv-comprar'); };
  const poe = () => { tm = 0; try {
    if (!v || v.hidden || !v.classList.contains('v5bp')) { sai(); return; }
    const nav = v.querySelector('.sl-body > .bp-tabs'); if (!nav) return;
    if (v.dataset.bt !== 'sobre') sai();
    if (S.lvComprar && v.dataset.bt === 'sobre') { S.lvComprar = 0; v.classList.add('lv-comprar'); try { (v.querySelector('.sl-body') || v).scrollTop = 0; } catch {} }
    if (!nav.querySelector('[data-lv=comprar]')) { const b = document.createElement('button'); b.type = 'button'; b.dataset.lv = 'comprar'; b.textContent = 'Comprar';
      b.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault();
        if (v.dataset.bt === 'sobre') { v.classList.add('lv-comprar'); return; }
        S.lvComprar = 1; const s = nav.querySelector('[data-t=sobre]'); if (s) s.click(); });
      nav.append(b); }
  } catch (err) { console.warn('aba comprar', err); } };
  // tocar em qualquer outra aba (inclusive Sobre) sai da aba Comprar
  if (v) v.addEventListener('click', (ev) => { const t = ev.target && ev.target.closest && ev.target.closest('.bp-tabs > button[data-t]'); if (t) sai(); }, true);
  if (v) new MutationObserver(() => { if (!tm) tm = setTimeout(poe, 30); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-bt', 'hidden'] });
  // livro novo abre em Sobre
  const _ob = openBookPage; openBookPage = function () { if (!S.lvComprar) sai(); return _ob.apply(this, arguments); };
  const _oa = openAnyBook; openAnyBook = function () { if (!S.lvComprar) sai(); return _oa.apply(this, arguments); };
  const _wb = whereToBuy; whereToBuy = function () { S.lvComprar = 1; sai(); const r = _wb.apply(this, arguments); S.ocScroll = 0; setTimeout(poe, 60); return r; };
}
