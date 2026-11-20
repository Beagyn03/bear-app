// Página de uma estante (Bia, 20/11; print "leituras 2026"): sem a faixa vazia e sem a linha antiga "‹ … •••". Voltar e
// título ficam no topo do app (k0); logo abaixo, "N livros" com o "•••" à direita. O "•••" abre o MESMO menu de estante da
// aba Estantes (v5shm, protótipo) + "Ordenar livros"; nunca "Abrir estante" com ela aberta. Listas que não são estante da
// pessoa (Lidos, Quero ler...) ganham só "Ordenar livros".
{ const st = document.createElement('style'); st.textContent = `
#shelflist.v6shp .sl-body > .sl-top{height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;border:0!important}
#shelflist.v6shp .esv-bar{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:.2rem 0 .7rem;min-height:40px}
#shelflist.v6shp .esv-bar > span{font-weight:800;color:var(--ink-2);font-size:.86rem}
#shelflist.v6shp .esv-bar .v6dots{margin-left:auto;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:900 1rem/1 inherit;letter-spacing:1px;display:grid;place-items:center}
#shelflist.v6shp .esv-bar [data-lot]{display:none!important}
`; TR.append(st); }
{ const ORD = () => (typeof ES_SORTS !== 'undefined' ? ES_SORTS : [['recentes', 'Adicionados recentemente'], ['conclusao', 'Data de conclusão'], ['nota', 'Maior nota'], ['titulo', 'Título (A–Z)']]);
  const fix = (key) => {
    const v = $('#shelflist'); if (!v || v.hidden) return; const bar = v.querySelector('.sl-body > .esv-bar'); if (!bar) return;
    v.classList.add('v6shp');
    if (bar.querySelector('.v6dots')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v6dots'; b.setAttribute('aria-label', 'Opções da estante'); b.textContent = '•••';
    b.addEventListener('click', (ev) => { ev.stopPropagation(); const id = String(key).startsWith('sh:') ? String(key).slice(3) : null;
      if (id && (db.shelves || []).some((s) => s.id === id)) v5Sheet('v5shm', { sh: id, page: key }); else v5Sheet('v6ord', { page: key }); });
    bar.append(b);
  };
  const _os = openShelfV3; openShelfV3 = function (key) { const r = _os.apply(this, arguments); fix(key); setTimeout(() => fix(key), 0); setTimeout(() => fix(key), 250); return r; };
  // sair da página tira a marca
  new MutationObserver(() => { const v = $('#shelflist'); if (v && v.classList.contains('v6shp') && (v.hidden || !v.querySelector('.sl-body > .esv-bar'))) v.classList.remove('v6shp'); })
    .observe($('#shelflist') || TR, { attributes: true, attributeFilter: ['hidden'], childList: true });
  // folhas: v5shm aberto de dentro da página ganha "Ordenar livros"; v6ord = só a ordem
  const _sh = v4SheetHTML; v4SheetHTML = function (k) {
    const st = v4State(), c = st.v5 || {};
    if (k === 'v6ord') { const cur = (T().shelfSort || {})[c.page] || sortKey(c.page);
      return `<h3>Ordenar livros</h3><div class="list">${ORD().map(([kk, n]) => `<button class="li rp${kk === cur ? ' on' : ''}" data-a="v6sort" data-k="${kk}"><span class="rd2"></span><span class="t">${esc(n)}</span></button>`).join('')}</div>`; }
    let h = _sh.apply(this, arguments);
    if (k === 'v5shm' && c.page && typeof h === 'string' && h) { const cur = (ORD().find((x) => x[0] === ((T().shelfSort || {})[c.page] || sortKey(c.page))) || [])[1] || '';
      h = h.replace('<div class="list">', `<div class="list"><button class="li" data-a="sheet" data-s="v6ord">${v4ic('sort', 20)}<span class="t">Ordenar livros<small>${esc(cur)}</small></span><span class="r">${v4ic('chev', 16)}</span></button>`); }
    return h;
  };
  // cliques das folhas novas (o v5V4Click só trata "v5…")
  const arm = () => { const R = v4Root(); if (!R || R.dataset.v6) return; R.dataset.v6 = 1;
    R.addEventListener('click', (ev) => { const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a, st = v4State(), c = st.v5 || {};
      if (a === 'v6sort') { ev.stopPropagation(); T().shelfSort = T().shelfSort || {}; T().shelfSort[c.page] = b.dataset.k; save(); try { refresh(); } catch {} v5SheetClose(); try { S.listRedraw && S.listRedraw(); } catch {} setTimeout(() => fix(c.page), 30); const n = (ORD().find((x) => x[0] === b.dataset.k) || [])[1]; if (n) toast('Ordenado por ' + n.toLowerCase()); return; }
      // ações da estante feitas de dentro da página: a página acompanha (excluída/arquivada fecha; resto redesenha)
      if (c.page && /^v5(shdel|arch|shedit|priv|shgrp|ungrp|unarch|shadd)/.test(a)) setTimeout(() => { const id = String(c.page).slice(3), s = (db.shelves || []).find((x) => x.id === id), v = $('#shelflist');
        if (!s || s.arch) { if (v && !v.hidden && v.classList.contains('v6shp')) { v.hidden = true; try { goTab('estante'); } catch {} } } else { try { S.listRedraw && S.listRedraw(); } catch {} setTimeout(() => fix(c.page), 30); } }, 400);
    }, true); };
  const _vs = v5Sheet; v5Sheet = function () { const r = _vs.apply(this, arguments); try { arm(); } catch {} return r; };
}
