// v2 etapa 2 (19/11): Estante no padrão novo (Biblioteca e Estantes).
//  - Cabeçalho como o do Hoje: rótulo pequeno + título em serifa + resumo ("13 livros · 7 lidos").
//  - Busca em pílula, filtro redondo, "+" no degradê do acento; abas em pílula (c6); filtros de status mais leves.
//  - Capas com cantos e sombra de livro; nota vira selo redondo no canto de baixo (mesmas cores: 5 furta-cor, ouro,
//    prata, bronze, ferro); livro em leitura ganha barra de progresso na própria capa; lido ganha ✓ discreto.
//  - Estantes em cartões com a "tábua" embaixo das capas; "+ Nova estante" tracejado.
// Só visual: as ações (abrir, menu, filtros, seleção, ordem) são as mesmas.
{ const st = document.createElement('style'); st.textContent = `
#lista .v2-eh{padding:.35rem .15rem .65rem}
#lista .v2-eh .eb{font-size:.68rem;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:var(--ink-2)}
#lista .v2-eh h1{margin:.12rem 0 0;font-family:var(--v2-disp);font-size:1.7rem;line-height:1.1;color:var(--ink)}
#lista .v2-eh small{display:block;margin-top:.2rem;font-size:.8rem;font-weight:800;color:var(--ink-2)}
#lista .esn-top{gap:.5rem!important;align-items:center}
#lista .esn-q{border-radius:999px!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;min-height:46px}
#lista .esn-q input#esn-q{border:0!important;background:none!important;box-shadow:none!important}
#lista .esn-ib{width:46px!important;height:46px!important;border-radius:50%!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;color:var(--ink)!important}
#lista .esn-ib.acc{background:var(--v2-pri)!important;border:0!important;color:var(--on-acc,#fff)!important;box-shadow:var(--v2-pri-sh)!important;font-size:1.35rem!important}
#lista .esn-tabs{margin:.85rem 0 .7rem!important}
#lista .esn-seg{gap:.4rem!important;padding:.1rem 0 .2rem!important}
#lista .esn-seg > button{border-radius:999px!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;font-weight:800!important;height:36px!important;padding:0 .85rem!important;box-shadow:none!important}
#lista .esn-seg > button small{opacity:.55;font-weight:800;margin-left:.25rem}
#lista .esn-seg > button.on{background:var(--ink)!important;border-color:var(--ink)!important;color:var(--bg)!important}
#lista .esn-seg > button.on small{opacity:.75}
#lista .esn-bar{margin:.35rem 0 .6rem!important;align-items:center}
#lista .esn-bar > b{font-family:var(--v2-disp);font-size:1.02rem;font-weight:700}
#lista .esn-bar > button{border-radius:999px!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;height:34px!important;padding:0 .8rem!important;font-weight:800!important;color:var(--ink)!important}
#lista .esn-bar > button[aria-label]{width:34px!important;padding:0!important;display:grid!important;place-items:center}
/* grade de capas */
:is(#lista,#shelflist) .esn-grid{gap:1.05rem .8rem!important}
:is(#lista,#shelflist) .es4-bk{position:relative}
:is(#lista,#shelflist) .es4-bk > b{font-size:.8rem!important;font-weight:900!important;line-height:1.2!important;margin-top:.45rem!important;color:var(--ink)}
:is(#lista,#shelflist) .es4-bk > small{font-size:.7rem!important;font-weight:800!important;color:var(--ink-2)!important;text-transform:none}
:is(#lista,#shelflist) .es-bk{position:relative;border-radius:5px 10px 10px 5px!important;overflow:visible}
:is(#lista,#shelflist) .es-bk .es-cv{border-radius:4px 9px 9px 4px!important}
:is(#lista,#shelflist) .es-bk .es-cv:not(.rt){box-shadow:0 1px 0 rgba(255,255,255,.25) inset,0 10px 20px rgba(40,20,5,.22),0 2px 5px rgba(40,20,5,.14)!important}
:is(#lista,#shelflist) .es-bk .es-cv::before{content:"";position:absolute;left:0;top:0;bottom:0;width:7px;border-radius:4px 0 0 4px;background:linear-gradient(90deg,rgba(0,0,0,.22),rgba(255,255,255,.08) 60%,transparent);pointer-events:none;z-index:1}
/* nota: selo redondo embaixo à direita (no lugar da estrela grande em cima) */
:is(#lista,#shelflist) .es-bk .mk-bear{left:auto!important;top:auto!important;right:-6px!important;bottom:-6px!important;width:30px!important;height:30px!important;border-radius:50%!important;display:grid!important;place-items:center;background:var(--v2-seal,#c9a14a)!important;border:2.5px solid var(--bg)!important;box-shadow:0 3px 8px rgba(0,0,0,.25)!important;z-index:9001!important;transform:none!important}
:is(#lista,#shelflist) .es-bk .mk-bear::before,:is(#lista,#shelflist) .es-bk .mk-bear::after{display:none!important}
:is(#lista,#shelflist) .es-bk .mk-bear > *:not(b){display:none!important}
:is(#lista,#shelflist) .es-bk .mk-bear b{position:static!important;font-size:.68rem!important;font-weight:900!important;color:#fff!important;text-shadow:0 1px 1px rgba(0,0,0,.35);letter-spacing:-.02em;transform:none!important}
:is(#lista,#shelflist) .es-bk .mk-bear.t-5{--v2-seal:conic-gradient(from 30deg,#f7d36b,#ff9fd0,#a78bfa,#7dd3fc,#f7d36b)}
:is(#lista,#shelflist) .es-bk .mk-bear.t-ouro{--v2-seal:linear-gradient(135deg,#f1c95a,#b8862b)}
:is(#lista,#shelflist) .es-bk .mk-bear.t-prata{--v2-seal:linear-gradient(135deg,#d9dde3,#8d96a3)}
:is(#lista,#shelflist) .es-bk .mk-bear.t-bronze{--v2-seal:linear-gradient(135deg,#d39a62,#8a5a2e)}
:is(#lista,#shelflist) .es-bk .mk-bear.t-ferro{--v2-seal:linear-gradient(135deg,#9aa0a6,#5a5f66)}
:is(#lista,#shelflist) .es-bk .mk-bear.t-5 b{color:#3a2a00!important;text-shadow:none}
/* progresso na capa e ✓ de lido */
:is(#lista,#shelflist) .es-bk .v2-pg{position:absolute;left:6px;right:6px;bottom:6px;height:5px;border-radius:9px;background:rgba(0,0,0,.35);z-index:3;overflow:hidden}
:is(#lista,#shelflist) .es-bk .v2-pg i{position:absolute;left:0;top:0;bottom:0;border-radius:9px;background:linear-gradient(90deg,#ffd6a3,var(--acc))}
:is(#lista,#shelflist) .es-bk .v2-ok{position:absolute;right:-6px;bottom:-6px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#2f8a52;color:#fff;border:2.5px solid var(--bg);font-size:.72rem;font-weight:900;z-index:9001;box-shadow:0 3px 8px rgba(0,0,0,.2)}
:is(#lista,#shelflist) .es4-dim .es-bk{opacity:.55;filter:saturate(.6)}
:is(#shelflist) .es4-bk{background:none!important;border:0!important;box-shadow:none!important;padding:0!important}
/* estante aberta (#shelflist .esv-grid): sem caixa em volta, capa com sombra de livro, selo no canto de cima */
#shelflist .esv-grid{gap:1.1rem .8rem!important}
#shelflist .esv-grid .es-bk{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;text-align:left}
#shelflist .esv-grid .esv-cv{border-radius:4px 9px 9px 4px!important}
#shelflist .esv-grid .esv-cv:not(.rt){box-shadow:0 10px 20px rgba(40,20,5,.22),0 2px 5px rgba(40,20,5,.14)!important}
#shelflist .esv-grid .es-bk .mk-bear{top:-6px!important;bottom:auto!important;right:-6px!important}
#shelflist .esv-grid .es-bk > small{font-size:.8rem!important;font-weight:900!important;color:var(--ink)!important;margin-top:.45rem}
#shelflist .esv-grid .es-bk > small.es4-st{font-size:.7rem!important;font-weight:800!important;color:var(--ink-2)!important;margin-top:.1rem}
/* lista */
:is(#lista,#shelflist) .esn-list{gap:.55rem!important}
:is(#lista,#shelflist) .esn-li{border-radius:18px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;padding:.6rem .7rem!important}
/* estantes em cartões com tábua */
#lista .esn-sh{border-radius:var(--v2-r)!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;padding:.85rem .9rem 1rem!important;margin-bottom:1rem!important}
#lista .esn-shh .nm b{font-family:var(--v2-disp)!important;font-size:1.08rem!important;font-weight:700!important}
#lista .esn-shh .nm small{font-weight:800!important;color:var(--ink-2)!important}
#lista .esn-mini{width:34px!important;height:34px!important;border-radius:50%!important;border:1.5px solid var(--line)!important;background:var(--bg)!important;color:var(--ink)!important}
#lista .esn-pr{height:6px!important;border-radius:9px!important;margin:.55rem 0 .8rem!important}
#lista .esn-row{position:relative;padding-bottom:12px!important;gap:.55rem!important}
#lista .esn-row::after{content:"";position:absolute;left:-.3rem;right:-.3rem;bottom:0;height:10px;border-radius:3px 3px 6px 6px;background:linear-gradient(#c9a37a,#a77b4f);box-shadow:0 4px 8px rgba(80,45,15,.22),inset 0 1px 0 rgba(255,255,255,.35)}
#lista .esn-row .es-bk{z-index:1}
#lista .esn-new{border-radius:var(--v2-r)!important;border:2px dashed color-mix(in srgb,var(--acc) 45%,var(--line))!important;background:none!important;color:var(--acc)!important;font-weight:900!important;min-height:56px}
#lista .esn-empty{border-radius:var(--v2-r);border:1px dashed var(--line);padding:1.2rem;text-align:center;color:var(--ink-2)}
/* barra de seleção */
.sel-dock,.esn-dock,.v2-dock,#seldock{border-radius:20px!important;box-shadow:0 14px 34px rgba(20,10,0,.28)!important}
`; TR.append(st); }
{ let tm = 0;
  const paint = () => {
    const L = TR.querySelector('#lista'); if (!L) return; const top = L.querySelector('.esn-top'); const SL = TR.querySelector('#shelflist');
    // cabeçalho
    if (top) {
      const tabOn = (L.querySelector('.esn-tabs .on') || {}).textContent || '';
      const lib0 = lib(), lidos = lib0.filter((e) => e.status === 'LIDO').length, nSh = (db.shelves || []).length;
      const est = /Estantes/.test(tabOn), title = est ? 'Suas estantes' : 'Biblioteca';
      const sub = est ? (nSh ? `${nSh} ${nSh === 1 ? 'estante' : 'estantes'}` : 'Monte listas do seu jeito') : `${lib0.length} ${lib0.length === 1 ? 'livro' : 'livros'} · ${lidos} ${lidos === 1 ? 'lido' : 'lidos'}`;
      let h = L.querySelector('.v2-eh');
      const html = `<div class="eb">Sua estante</div><h1>${esc(title)}</h1><small>${esc(sub)}</small>`;
      if (!h) { h = document.createElement('div'); h.className = 'v2-eh'; top.before(h); }
      if (h.innerHTML !== html) h.innerHTML = html;
    }
    // progresso na capa e ✓ de lido
    [...L.querySelectorAll('.es4-bk'), ...(SL && !SL.hidden ? SL.querySelectorAll('.es4-bk') : [])].forEach((w) => {
      const b = w.querySelector('.es-bk'); if (!b) return; const s = (w.querySelector(':scope > small') || {}).textContent || '';
      const m = s.match(/lendo\s*·\s*(\d+)%/i);
      let pg = b.querySelector('.v2-pg');
      if (m) { if (!pg) { pg = document.createElement('span'); pg.className = 'v2-pg'; pg.innerHTML = '<i></i>'; b.append(pg); } const wd = Math.max(4, Number(m[1])) + '%'; if (pg.firstChild.style.width !== wd) pg.firstChild.style.width = wd; }
      else if (pg) pg.remove();
      const lido = /^lido\b/i.test(s.trim()) || (!s.trim() && b.querySelector('.cv.rt'));
      let ok = b.querySelector('.v2-ok');
      if (lido && !b.querySelector('.mk-bear, .cv[data-rt]')) { if (!ok) { ok = document.createElement('span'); ok.className = 'v2-ok'; ok.textContent = '✓'; ok.setAttribute('aria-hidden', 'true'); b.append(ok); } }
      else if (ok) ok.remove();
    });
  };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { paint(); } catch (err) { console.warn('v2 estante', err); } }, 60); })
    .observe(TR, { childList: true, subtree: true });
  setTimeout(paint, 900);
}
