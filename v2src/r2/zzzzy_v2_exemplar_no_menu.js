// ---------- v2: Meu exemplar, Formato e Total de páginas só no "•••" (Bia, 27/11) ----------
// "Meu exemplar... formato e páginas, faz sentido ficar aqui?" → "Deixar só no ..."
// Saem da aba Minha leitura (o cartão Meu exemplar e as linhas Formato / Total de páginas) e entram no menu do livro,
// quando aberto na página do livro ou na Biblioteca (onde já ficam Lombada e edição e Trocar edição). Cada item faz o mesmo
// que a linha fazia: folha do exemplar, escolha do formato e correção do total.
{ const st = document.createElement('style'); st.textContent = `
#shelflist.v5bp .sl-body > .bp-ex,#shelflist.v5bp-minha .sl-body > .bp-ex,#shelflist .sl-body > .v7exg{display:none!important}
`; TR.append(st); }
const lvExMenuAqui = () => { try { const v = TR.querySelector('#shelflist'); if (v && !v.hidden && v.classList.contains('v5bp')) return true; return lvMenuNaBiblioteca(); } catch { return false; } };
{ const _bm = v5BmHTML; v5BmHTML = function (e) { let h = _bm.apply(this, arguments);
    try { if (!e || !lvExMenuAqui()) return h;
      let ex = ''; try { ex = exSum(e) || ''; } catch {}
      const row = (a, ic, t, sub) => `<button type="button" class="li" data-a="${a}">${v4ic(ic, 20)}<span class="t">${t}${sub ? `<small>${esc(sub)}</small>` : ''}</span><span class="r">${v4ic('chev', 16)}</span></button>`;
      const rows = row('lvexm', 'estante', 'Meu exemplar', ex) + row('lvfmt', 'ler', 'Formato', (() => { try { return fmtTxt(e); } catch { return ''; } })()) + row('lvpag', 'pag', 'Total de páginas', e.totalPages ? e.totalPages + ' páginas' : 'não informado');
      // antes de "Remover da Biblioteca" quando houver; senão no fim da lista
      const k = h.search(/<button class="li[^"]*" data-a="sheet" data-s="v5rm"/);
      h = k >= 0 ? h.slice(0, k) + rows + h.slice(k) : h.replace(/(<\/div>\s*)$/, rows + '$1');
    } catch (err) { console.warn('exemplar no menu', err); }
    return h; }; }
{ const _vc = shV4Click; shV4Click = function (ev) { const t = ev.target.closest && ev.target.closest('[data-a]');
    if (t && ['lvexm', 'lvfmt', 'lvpag'].includes(t.dataset.a)) { ev.stopImmediatePropagation(); ev.preventDefault();
      const st = v4State(), e = lib().find((x) => x.id === (st.sheetE || st.e)); st.sheet = null; if (!st.view) v4Close(); else v4Draw(); if (!e) return;
      const reabre = () => { try { const v = TR.querySelector('#shelflist'); if (v && !v.hidden && v.classList.contains('v5bp')) openBookPage(e, v.dataset.bt || 'sobre'); } catch {} };
      if (t.dataset.a === 'lvexm') return exSheet(e);
      if (t.dataset.a === 'lvfmt') return askFormat((f) => { setFormat(e, f); save(); refresh(); reabre(); }, `Como você lê “${e.title}”?`);
      return fixPages(e); }
    return _vc.apply(this, arguments); }; }
