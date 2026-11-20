// Estante › Filtrar (Bia, 20/11; protótipo v132, folha 'sort'): a folha é SÓ de filtro. Sai a Situação (já está nos chips de
// fora), saem Ordenar (fica no "Data de conclusão ▾") e Ver como (fica no ícone grade/lista) e sai o chip "Qualquer" de cada
// grupo: nada marcado = mostra tudo; tocar de novo desmarca. Rodapé "Limpar" + "Ver N livros" com N ao vivo.
// O botão de filtro ganha um ponto quando há filtro ativo.
{ const G = () => [...new Set(lib().map((e) => e.genre).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt'));
  const GROUPS = () => [['nota', 'Nota', [['5', '★ 5'], ['4', '★ 4 ou mais'], ['3', '★ 3 ou mais'], ['none', 'Sem nota']]], ['own', 'Meu exemplar', [['tenho', 'Tenho'], ['emp', 'Emprestados'], ['peg', 'Peguei emprestado']]],
    ['fmt', 'Formato', [['PAPER', 'Físico'], ['EBOOK', 'E-book'], ['AUDIO', 'Audiolivro']]], ...(G().length ? [['gen', 'Gênero', G().map((g) => [g, g])]] : [])];
  const KEYS = ['nota', 'own', 'fmt', 'gen'];
  const count = (W) => { try { const P = ESN(); return esnFilter(shelfBooks('ALL'), { ...P, ...W, st: P.st || 'ALL' }, '').length; } catch { return null; } };
  const active = () => { const P = ESN(); return KEYS.some((k) => P[k]); };
  esnFilterSheet = function (redraw) {
    const P = ESN(), st = v4State(); st.v6W = Object.fromEntries(KEYS.map((k) => [k, P[k] || ''])); st.v6redraw = redraw;
    v5Sheet('v6filt', {});
  };
  const _sh = v4SheetHTML; v4SheetHTML = function (k) {
    if (k !== 'v6filt') return _sh.apply(this, arguments);
    const W = v4State().v6W || {}, n = count(W);
    return `<h3>Filtrar</h3><p class="mut" style="margin:0 0 6px">Nada marcado mostra tudo. A ordem fica na barra acima dos livros.</p>`
      + GROUPS().map(([g, t, opts]) => `<div class="lbl">${t}</div><div class="chips" style="flex-wrap:wrap;margin:0;padding:4px 0">${opts.map(([v, l]) => `<button class="chip${W[g] === v ? ' on' : ''}" data-a="v6fchip" data-g="${g}" data-v="${esc(v)}">${esc(l)}</button>`).join('')}</div>`).join('')
      + `<div class="row" style="gap:8px;margin-top:14px"><button class="btn s" style="flex:1" data-a="v6fclr">Limpar</button><button class="btn p" style="flex:2" data-a="v6fok">${n == null ? 'Ver livros' : n === 1 ? 'Ver 1 livro' : `Ver ${n} livros`}</button></div>`;
  };
  const arm = () => { const R = v4Root(); if (!R || R.dataset.v6f) return; R.dataset.v6f = 1;
    R.addEventListener('click', (ev) => { const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a, st = v4State(); if (!/^v6f/.test(a)) return; ev.stopPropagation();
      const W = st.v6W || (st.v6W = {});
      if (a === 'v6fchip') { const g = b.dataset.g; W[g] = W[g] === b.dataset.v ? '' : b.dataset.v; return v4Draw(); }
      if (a === 'v6fclr') { KEYS.forEach((k) => { W[k] = ''; }); return v4Draw(); }
      if (a === 'v6fok') { Object.assign(ESN(), W, { tab: 'bib' }); save(); v5SheetClose(); try { st.v6redraw && st.v6redraw(); } catch {} dot(); }
    }, true); };
  const _vs = v5Sheet; v5Sheet = function () { const r = _vs.apply(this, arguments); try { arm(); } catch {} return r; };
  // ponto no botão de filtro (a Estante v4 vive numa raiz própria)
  const dot = () => { const host = [...TR.querySelectorAll('*')].find((e) => e.shadowRoot && e.shadowRoot.querySelector('.v5est')); const sr = host && host.shadowRoot; if (!sr) return;
    if (!sr.querySelector('style[data-v6f]')) { const s = document.createElement('style'); s.dataset.v6f = 1; s.textContent = '[data-a=v5filt]{position:relative}[data-a=v5filt].v6on::after{content:"";position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:var(--acc);box-shadow:0 0 0 2px var(--bg)}'; sr.append(s); }
    const on = active(); sr.querySelectorAll('[data-a=v5filt]').forEach((b) => b.classList.toggle('v6on', on)); };
  const _de = drawEstante; drawEstante = function () { const r = _de.apply(this, arguments); try { dot(); } catch {} return r; };
}
// Ordem fica numa barra própria acima da grade ("N livros · Data de conclusão ▾"), fora da folha de filtro;
// o botão da barra de chips vira só "Filtrar" (ícone de funil).
{ const FUN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16l-6 7.5V19l-4-2v-4.5z"/></svg>';
  const _lh = v5LivrosHTML; v5LivrosHTML = function () {
    let h = _lh.apply(this, arguments); const P = ESN();
    h = h.replace(/<button class="tool" data-a="v5filt" aria-label="Ordenar e filtrar">[\s\S]*?<\/button>/, `<button class="tool" data-a="v5filt" aria-label="Filtrar">${FUN}</button>`);
    let n = 0; try { n = esnFilter(shelfBooks('ALL'), P, '').length; } catch {}
    const cur = (ESN_SORT.find((x) => x[0] === (P.sort || 'conclusao')) || ESN_SORT[0]);
    const bar = `<div class="v6sbar"><span>${n === 1 ? '1 livro' : n + ' livros'}</span><label class="v6sel"><span>${esc(cur[1])} ▾</span><select data-v6s aria-label="Ordenar">${ESN_SORT.map(([k, l]) => `<option value="${k}"${k === cur[0] ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></label></div>`;
    return h.replace('<div class="grid">', bar + '<div class="grid">');
  };
  const arm = () => { const host = [...TR.querySelectorAll('*')].find((e) => e.shadowRoot && e.shadowRoot.querySelector('.v5est')); const sr = host && host.shadowRoot; if (!sr || sr.v6s) return; sr.v6s = 1;
    const s = document.createElement('style'); s.textContent = '.v6sbar{display:flex;align-items:center;justify-content:space-between;margin:10px 2px 8px;font-size:13px;font-weight:800;color:var(--ink2)}.v6sel{position:relative;color:var(--ink);cursor:pointer}.v6sel select{position:absolute;inset:0;opacity:0;width:100%;cursor:pointer;font-size:16px}'; sr.append(s);
    sr.addEventListener('change', (ev) => { const sel = ev.target.closest && ev.target.closest('[data-v6s]'); if (!sel) return; ESN().sort = sel.value; save(); v5Redraw(); }, true); };
  const _de = drawEstante; drawEstante = function () { const r = _de.apply(this, arguments); try { arm(); } catch {} return r; };
}
