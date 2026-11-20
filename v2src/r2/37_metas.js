// Metas (15/11): Meta do ano e Metas com prazo numa tela só. Meta com prazo pode usar uma estante: os livros da estante
// viram os livros da meta e a meta acompanha a estante (entrou na estante, entra na meta; saiu, sai). A meta do ano pode
// contar só os livros de uma estante (db.yearGoalShelf[ano]); sem estante, conta todo livro terminado no ano.
const libStatusToGoal = (s) => s === 'LIDO' ? 'CONCLUIDO' : s === 'LENDO' ? 'LENDO' : 'NAO_INICIADO';
function syncGoalShelf(g) { // devolve true se mudou algo
  if (!g || !g.shelfId) return false;
  const sh = (db.shelves || []).find((s) => s.id === g.shelfId); if (!sh) return false;
  const ids = new Set(sh.bookIds || []), L = lib(); let changed = false;
  const before = g.books.length; g.books = g.books.filter((b) => !b.fromShelf || ids.has(b.libId)); if (g.books.length !== before) changed = true;
  for (const id of sh.bookIds || []) {
    const e = L.find((x) => x.id === id); if (!e) continue;
    const has = g.books.find((b) => b.libId === id || normT(b.title) === normT(e.title));
    if (has) { if (!has.libId) { has.libId = id; changed = true; } if (has.fromShelf && !has.totalPages && e.totalPages) { has.totalPages = e.totalPages; changed = true; } continue; }
    g.books.push({ id: uid(), libId: id, fromShelf: true, title: e.title, author: e.author || null, totalPages: Number(e.totalPages) || 0, initialPage: e.status === 'LIDO' ? Number(e.totalPages) || 0 : e.status === 'LENDO' ? Math.min(Number(e.totalPages) || 0, Number(libProgress(e)) || 0) : 0, order: g.books.length + 1, status: libStatusToGoal(e.status), ...(e.cover ? { cover: e.cover } : {}) });
    changed = true;
  }
  return changed;
}
function syncAllGoalShelves() { let ch = false; for (const g of db.goals || []) if (syncGoalShelf(g)) ch = true; if (ch) save(); }
// meta do ano por estante
{ const _yi = yearInfo; yearInfo = function () {
  const r = _yi.apply(this, arguments); const sid = (db.yearGoalShelf || {})[r.y]; if (!sid || !r.target) return r;
  const sh = (db.shelves || []).find((s) => s.id === sid); if (!sh) return r;
  const ids = new Set(sh.bookIds || []), done = lib().filter((e) => ids.has(e.id) && e.status === 'LIDO' && (e.finishedAt || '').startsWith(r.y)).length;
  return { ...r, done, shelf: sh.name };
}; }
{ const st = document.createElement('style'); st.textContent = `
.mt-y{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.8rem .9rem;display:grid;gap:.5rem;margin:.2rem 0 1rem}
.mt-y h3{margin:0;font-size:1rem;display:flex;justify-content:space-between;align-items:baseline}.mt-y h3 small{font-size:.8rem;color:var(--ink-2);font-weight:700}
.mt-y .mt-big{font-size:1.6rem;font-weight:900}.mt-y .mt-big small{font-size:.9rem;font-weight:700;color:var(--ink-2)}
.mt-y i.mt-bar{display:block;height:8px;border-radius:4px;background:var(--line);overflow:hidden}.mt-y i.mt-bar i{display:block;height:100%;background:var(--acc);border-radius:4px}
.mt-y p{margin:0;font-size:.82rem;color:var(--ink-2)}
.mt-btns{display:flex;gap:.4rem;flex-wrap:wrap}
.mt-btns button{border:1px solid var(--line);background:none;border-radius:999px;min-height:36px;padding:0 .8rem;font:inherit;font-weight:800;font-size:.8rem;color:var(--ink)}
.mt-btns button.pri{background:var(--acc);border-color:var(--acc);color:#fff}
.mt-h{font-weight:900;font-size:1rem;margin:.4rem 0 .5rem}
.gl-it .gl-sh{font-size:.72rem;font-weight:800;color:var(--acc)}
.nm-sh{display:grid;gap:.45rem;border:1px solid var(--line);border-radius:12px;padding:.65rem;background:var(--panel)}
.nm-sh label{display:flex!important;align-items:center;gap:.5rem!important;font-size:.86rem}
.nm-sh input[type=radio]{width:18px;height:18px;flex:none;margin:0}
.nm-sh select{font:inherit;height:42px;border:1px solid var(--line);border-radius:10px;background:var(--bg,#fff);color:var(--ink);padding:0 .5rem;width:100%}
.nm-sh small{font-size:.76rem;color:var(--ink-2);font-weight:600}
`; TR.append(st); }
function yearShelfSheet(y) {
  const shs = (db.shelves || []).filter((s) => (s.bookIds || []).length || true), cur = (db.yearGoalShelf || {})[y];
  const set = (id) => { db.yearGoalShelf = { ...(db.yearGoalShelf || {}) }; if (id) db.yearGoalShelf[y] = id; else delete db.yearGoalShelf[y]; save(); try { renderHome(todayISO()); } catch {} if (S.listRedraw) S.listRedraw(); };
  sheet(`O que conta na meta de ${y}`, [[`${cur ? '' : '✓ '}Todo livro terminado no ano`, () => set(null)], ...shs.map((s) => [`${cur === s.id ? '✓ ' : ''}Só a estante “${s.name}”`, () => set(s.id)])]);
}
openGoalsV4 = function () { // a tela "Metas"
  const v = $('#shelflist');
  const draw = () => {
    syncAllGoalShelves();
    const gs = db.goals || [], today = todayISO(), Y = yearInfo(), pct = Y.target ? Math.min(100, Math.round((Y.done / Y.target) * 100)) : 0;
    const left = Y.target ? Math.max(0, Y.target - Y.done) : 0;
    v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Metas</b><span></span></div>
      <section class="mt-y">
        <h3>Meta do ano ${Y.y}${Y.shelf ? `<small>estante “${esc(Y.shelf)}”</small>` : ''}</h3>
        ${Y.target ? `<div class="mt-big">${Y.done} <small>de ${Y.target} livros</small></div><i class="mt-bar"><i style="width:${pct}%"></i></i>
          <p>${left ? `Faltam ${plural(left, 'livro', 'livros')}${Y.expected != null ? Y.done >= Y.expected ? ' · você está em dia' : ` · o esperado até hoje era ${Y.expected}` : ''}` : 'Meta batida!'}</p>`
          : `<p>Quantos livros você quer ler em ${Y.y}? Contam os livros que você terminar.</p>`}
        <div class="mt-btns">${Y.target ? '<button type="button" id="mt-ver">Ver detalhes</button><button type="button" id="mt-adj">Ajustar</button>' : '<button type="button" class="pri" id="mt-adj">Definir meta do ano</button>'}${Y.target && (db.shelves || []).length ? '<button type="button" id="mt-sh">O que conta</button>' : ''}</div>
      </section>
      <div class="mt-h">Metas com prazo</div>
      <button type="button" class="mt-new" id="gl-new"><i class=v3e data-i=plus></i>Nova meta com prazo</button>
      ${gs.length ? gs.map((g) => { const tot = g.books.reduce((a, b) => a + (b.totalPages || 0), 0), dn = g.books.reduce((a, b) => a + pagesOf(g, b), 0), p = tot ? Math.round((dn / tot) * 100) : 0;
          const lf = g.targetDate ? Math.ceil((new Date(g.targetDate) - new Date(today)) / 86400000) : null, perDay = lf > 0 ? Math.ceil(Math.max(0, tot - dn) / lf) : null;
          const sh = g.shelfId && (db.shelves || []).find((s) => s.id === g.shelfId);
          return `<button type="button" class="gl-it" data-g="${esc(g.id)}"><span class="gl-row"><b>${esc(g.name)}</b><small>${p}%</small></span><i><i style="width:${p}%"></i></i>
            <span class="gl-row"><small>${plural(g.books.length, 'livro', 'livros')} · ${dn} de ${tot} pág.</small><small>${lf == null ? '' : lf > 0 ? `${lf} dias · ${perDay} pág./dia` : lf === 0 ? 'termina hoje' : 'prazo passou'}</small></span>${sh ? `<span class="gl-sh">Estante “${esc(sh.name)}”</span>` : ''}</button>`; }).join('')
        : '<p class="mt-hint">Uma lista de livros com data para terminar (pode ser uma estante inteira). O app calcula quantas páginas por dia.</p>'}`;
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
    $('#mt-adj', v).addEventListener('click', () => setYearGoal(Y.y));
    $('#mt-ver', v)?.addEventListener('click', () => openGoalPage());
    $('#mt-sh', v)?.addEventListener('click', () => yearShelfSheet(Y.y));
    $$('.gl-it', v).forEach((b) => b.addEventListener('click', () => { const g = (db.goals || []).find((x) => x.id === b.dataset.g); v.hidden = true; screen('desafios'); if (g) setTimeout(() => open(g), 60); }));
    paintCv(v);
  };
  S.listRedraw = draw; S.navView = { t: 'goals', a: [] }; closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page'); draw(); v.hidden = false; v.scrollTop = 0; syncTopTitle();
};
{ const _o = openGoalsV4; openGoalsV4 = function () { navEnter(() => openGoalsV4()); S.nav.depth++; try { return _o.apply(this, arguments); } finally { S.nav.depth--; } }; }
// meta do ano salva: a tela de Metas aberta se atualiza
{ const _sy = setYearGoal; setYearGoal = function () { const r = _sy.apply(this, arguments); const obs = new MutationObserver(() => { if (!document.querySelector('.yg-sheet')) { obs.disconnect(); const v = $('#shelflist'); if (S.navView && S.navView.t === 'goals' && !v.hidden && S.listRedraw) S.listRedraw(); } }); obs.observe(document.body, { childList: true }); return r; }; }
// abrir uma meta ligada à estante já traz os livros novos
{ const _op = open; open = function (g) { try { if (syncGoalShelf(g)) save(); } catch {} return _op.apply(this, arguments); }; }
