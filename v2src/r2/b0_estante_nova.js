// Estante nova (Bia, 18/11): duas abas, "Minha biblioteca" (todos os livros, filtrados pela situação) e "Estantes" (as que a
// pessoa cria). No topo, busca na hora, ⚙ (filtrar e organizar) e ＋ (adicionar livro ou nova estante). Na biblioteca, grade ou
// lista. As estantes ficam compactas: nome, contagem, ＋ e •••, barra de quanto já foi lido e as capas.
// Atalhos (Trechos e anotações, Histórico de leituras) vão para o ••• da barra do topo.
{ const st = document.createElement('style'); st.textContent = `
.esn-grid .mk-bear,.esn-row .mk-bear,.esn-li .mk-bear{z-index:9001!important}.esn-li .mk-bear{transform:scale(.75);transform-origin:0 0}
.esn-top{display:flex;gap:.45rem;align-items:center;margin:0 0 .55rem}
.esn-q{flex:1;display:flex;align-items:center;gap:.45rem;height:42px;border:1px solid var(--line);border-radius:99px;background:var(--panel);padding:0 .9rem;min-width:0}
.esn-q svg{width:17px;height:17px;flex:none;color:var(--ink-2)}.esn-q input{flex:1;min-width:0;border:0;background:none;font:inherit;font-size:.92rem;color:var(--ink);outline:none}
.esn-q button{border:0;background:none;color:var(--ink-2);font-size:1.1rem;padding:0 .1rem;cursor:pointer}
.esn-ib{position:relative;width:42px;height:42px;flex:none;border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--ink);display:grid;place-items:center;cursor:pointer;padding:0}
.esn-ib svg{width:19px;height:19px}.esn-ib.acc{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff);font-size:1.5rem;font-weight:400;line-height:1}
.esn-ib u{position:absolute;top:-3px;right:-3px;min-width:17px;height:17px;border-radius:99px;background:var(--acc);color:#fff;font-size:.62rem;font-weight:900;text-decoration:none;display:grid;place-items:center;padding:0 .25rem}
.esn-tabs{display:flex;border-bottom:1.5px solid var(--line);margin:0 0 .7rem}.esn-tabs button{flex:1;border:0;background:none;font:inherit;font-weight:900;font-size:.9rem;color:var(--ink-2);padding:.55rem 0;border-bottom:2.5px solid transparent;margin-bottom:-1.5px;cursor:pointer}
.esn-tabs button.on{color:var(--acc);border-bottom-color:var(--acc)}
.esn-seg{display:flex;gap:.35rem;overflow-x:auto;scrollbar-width:none;margin:0 0 .55rem;padding-bottom:2px}.esn-seg::-webkit-scrollbar{display:none}
.esn-seg button{flex:none;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.35rem .75rem;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}
.esn-seg button small{font-weight:700;color:var(--ink-2);margin-left:.25rem}.esn-seg button.on{background:var(--ink);border-color:var(--ink);color:var(--bg)}.esn-seg button.on small{color:inherit;opacity:.75}
.esn-bar{display:flex;align-items:center;gap:.4rem;margin:0 0 .7rem;font-size:.8rem;color:var(--ink-2);font-weight:800}.esn-bar > b{color:var(--ink);margin-right:auto}
.esn-bar button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.3rem .7rem;font:inherit;font-size:.78rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:.3rem}
.esn-bar button svg{width:15px;height:15px}
.esn-chips{display:flex;flex-wrap:wrap;gap:.35rem;margin:-.2rem 0 .6rem}.esn-chips button{border:0;border-radius:99px;background:color-mix(in srgb,var(--acc) 14%,transparent);color:var(--acc);font:inherit;font-size:.74rem;font-weight:900;padding:.25rem .6rem;cursor:pointer}
.esn-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.1rem .6rem}
.esn-grid .es4-bk{min-width:0;display:block}.esn-grid .es-bk{width:100%;padding:0;border:0;background:none;display:block;position:relative}
.esn-grid .es-cv{width:100%!important;height:auto!important;aspect-ratio:2/3;display:block}
.esn-grid .es4-bk > small{display:block;font-size:.66rem;font-weight:800;color:var(--ink-2);margin-top:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.esn-grid .es4-bk > b{display:block;font-size:.72rem;line-height:1.2;margin-top:.3rem;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.esn-list{display:grid;gap:0}.esn-li{display:grid;grid-template-columns:44px minmax(0,1fr);gap:.7rem;align-items:center;padding:.55rem 0;border-bottom:1px solid var(--line)}
.esn-li .es-bk{padding:0;border:0;background:none;width:44px;position:relative}.esn-li .es-cv{width:44px!important;height:66px!important}
.esn-li .t{min-width:0;cursor:pointer}.esn-li b{display:block;font-size:.9rem;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.esn-li small{display:block;font-size:.75rem;color:var(--ink-2);margin-top:.1rem}
.esn-sh{border:1px solid var(--line);background:color-mix(in srgb,var(--sc,transparent) 5%,var(--panel));border-radius:16px;padding:.65rem .7rem .55rem;margin:0 0 .7rem}
.esn-shh{display:flex;align-items:center;gap:.5rem}.esn-shh i{width:10px;height:10px;border-radius:50%;background:var(--sc,var(--acc));flex:none}
.esn-shh .nm{flex:1;min-width:0;border:0;background:none;font:inherit;text-align:left;color:var(--ink);padding:0;cursor:pointer}.esn-shh .nm b{display:block;font-size:.95rem;line-height:1.2}.esn-shh .nm small{display:block;font-size:.72rem;color:var(--ink-2);font-weight:700;margin-top:.1rem}
.esn-mini{width:32px;height:32px;flex:none;border-radius:50%;border:1px solid var(--line);background:var(--bg);color:var(--ink);font:inherit;font-weight:900;font-size:.9rem;display:grid;place-items:center;cursor:pointer;padding:0}
.esn-pr{height:5px;border-radius:9px;background:color-mix(in srgb,var(--ink) 9%,transparent);margin:.5rem 0 .2rem;overflow:hidden}.esn-pr i{display:block;height:100%;background:#2e9b5a;border-radius:9px}
.esn-row{display:flex;gap:.5rem;overflow-x:auto;scrollbar-width:none;padding:.45rem 0 .15rem}.esn-row::-webkit-scrollbar{display:none}
.esn-row .es4-bk{flex:0 0 58px;min-width:0}.esn-row .es-bk{padding:0;border:0;background:none;width:58px;position:relative;display:block}.esn-row .es-cv{width:58px!important;height:87px!important}
.esn-row .es4-bk > small{display:none}
.esn-empty{font-size:.86rem;color:var(--ink-2);text-align:center;padding:1.2rem .5rem;line-height:1.45}
.esn-new{width:100%;border:1.5px dashed var(--line);background:none;color:var(--ink);border-radius:14px;padding:.75rem;font:inherit;font-weight:900;cursor:pointer;margin-top:.2rem}
.esn-sheet{position:fixed;inset:0;z-index:60;background:rgba(30,20,10,.35);display:flex;align-items:flex-end;justify-content:center}
.esn-sheet .box{width:100%;max-width:520px;max-height:82vh;overflow:auto;background:var(--panel);border-radius:22px 22px 0 0;padding:1rem 1rem calc(1rem + env(safe-area-inset-bottom));box-shadow:0 -10px 30px rgba(0,0,0,.2)}
.esn-sheet h3{margin:0 0 .3rem;font-size:1.05rem}.esn-sheet h4{margin:.8rem 0 .4rem;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2)}
.esn-sheet .ch{display:flex;flex-wrap:wrap;gap:.35rem}.esn-sheet .ch button{border:1.5px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:.35rem .75rem;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}
.esn-sheet .ch button.on{border-color:var(--acc);background:var(--acc);color:var(--on-acc,#fff)}
.esn-sheet .acts{display:grid;grid-template-columns:1fr 1.4fr;gap:.5rem;margin-top:1rem}.esn-sheet .acts button{border-radius:99px;padding:.7rem;font:inherit;font-weight:900;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);cursor:pointer}.esn-sheet .acts button.p{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
`; TR.append(st); }
const ESN_ST = [['ALL', 'Todos'], ['LENDO', 'Lendo'], ['QUERO', 'Quero ler'], ['LIDO', 'Lidos'], ['HIBERNANDO', 'Pausados'], ['ABANDONEI', 'Abandonados']];
const ESN_SORT = [['conclusao', 'Data de conclusão'], ['recentes', 'Adicionados recentemente'], ['titulo', 'Título (A–Z)'], ['autor', 'Autor (A–Z)'], ['nota', 'Maior nota'], ['paginas', 'Mais páginas']];
const ESN_ICO = { q: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  f: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>' };
const ESN = () => { const p = (db.prefs = db.prefs || {}); p.esn = p.esn || { tab: 'bib', view: 'grade', st: 'ALL', nota: '', fmt: '', gen: '', sort: '' }; return p.esn; };
function esnMatch(e, q) { if (!q) return true; const h = normT([e.title, e.author, e.genre, e.publisher].filter(Boolean).join(' ')); return normT(q).split(' ').filter(Boolean).every((w) => h.includes(w)); }
function esnFilter(list, P, q) {
  return list.filter((e) => {
    if (P.st !== 'ALL' && e.status !== P.st) return false;
    const p = Number((reviewOfLib(e) || {}).paws) || 0;
    if (P.nota === '5' && p < 5) return false; if (P.nota === '4' && p < 4) return false; if (P.nota === '3' && p < 3) return false; if (P.nota === 'none' && p) return false;
    if (P.fmt === 'EBOOK' && e.format !== 'EBOOK') return false; if (P.fmt === 'AUDIO' && e.format !== 'AUDIO') return false; if (P.fmt === 'PAPER' && (e.format === 'EBOOK' || e.format === 'AUDIO')) return false;
    if (P.gen && e.genre !== P.gen) return false;
    if (P.own) { const x = e.ex || {}; if (P.own === 'emp' ? !x.loan : P.own === 'tenho' ? x.own !== 'tenho' : P.own === 'quero' ? x.own !== 'quero' : x.own !== 'pegou') return false; }
    return esnMatch(e, q); });
}
function esnSort(list, k) {
  const L = list.slice(), by = (f) => L.sort((a, b) => String(f(a) || '').localeCompare(String(f(b) || ''), 'pt-BR', { sensitivity: 'base' }));
  if (k === 'titulo') return by((e) => e.title); if (k === 'autor') return by((e) => String(e.author || '').split(',')[0]);
  if (k === 'nota') return L.sort((a, b) => (Number((reviewOfLib(b) || {}).paws) || 0) - (Number((reviewOfLib(a) || {}).paws) || 0));
  if (k === 'paginas') return L.sort((a, b) => (Number(b.totalPages) || 0) - (Number(a.totalPages) || 0));
  if (k === 'recentes') return L.sort((a, b) => String(b.addedAt || '').localeCompare(String(a.addedAt || '')));
  return L; // conclusão: a ordem padrão da Minha biblioteca
}
function esnBook(e, mode) { const m = { ...es4Mark(e) }; const x = e.ex || {};
  if (x.loan) m.over += '<span class="ex-bdg" title="Emprestado"><i class=v3e data-i=swap></i></span>'; else if (x.own === 'pegou') m.over += '<span class="ex-bdg" title="Peguei emprestado"><i class=v3e data-i=friends></i></span>';
  if (mode === 'lista') { const rv = reviewOfLib(e) || {}; const exTxt = x.loan ? 'com ' + exName(x.loan.to) + ' desde ' + exD(x.loan.at) : x.own === 'pegou' && x.borrow ? 'de ' + exName(x.borrow.from) : ''; const extra = [e.author, m.label, exTxt, e.status === 'LIDO' && e.finishedAt ? 'em ' + String(e.finishedAt).slice(5, 7) + '/' + String(e.finishedAt).slice(0, 4) : ''].filter(Boolean).join(' · ');
    return `<div class="esn-li${m.dim ? ' es4-dim' : ''}"><button type="button" class="es-bk" data-id="${esc(e.id)}" aria-label="${esc(e.title)}">${cvh(e.title, e.cover, 'es-cv')}${m.over}</button><div class="t" data-id2="${esc(e.id)}"><b>${esc(e.title)}</b><small>${esc(extra)}${x.loan && exLate(x.loan.due) ? '<span class="ex-tag late">atrasado ' + exLate(x.loan.due) + 'd</span>' : x.loan && x.loan.due ? '<span class="ex-tag">volta ' + exD(x.loan.due) + '</span>' : x.own === 'pegou' && x.borrow && x.borrow.due ? '<span class="ex-tag peg">devolver ' + exD(x.borrow.due) + '</span>' : ''}</small></div></div>`; }
  return `<div class="es4-bk${m.dim ? ' es4-dim' : ''}"><button type="button" class="es-bk" data-id="${esc(e.id)}" aria-label="${esc(e.title)}">${cvh(e.title, e.cover, 'es-cv')}${m.over}</button>${mode === 'grade' ? `<b>${esc(e.title)}</b>` : ''}<small>${esc(m.label)}</small></div>`; }
drawEstante = function (box) {
  const P = ESN(), q = S.esnQ || '', all = lib(), mine = (db.shelves || []).slice().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const nAdv = (P.nota ? 1 : 0) + (P.fmt ? 1 : 0) + (P.gen ? 1 : 0) + (P.own ? 1 : 0);
  let body = '';
  if (P.tab === 'bib') {
    const cnt = (k) => (k === 'ALL' ? all.length : all.filter((e) => e.status === k).length);
    const base = esnSort(shelfBooks('ALL'), P.sort), list = esnFilter(base, P, q);
    const exC = { tenho: all.filter((e) => (e.ex || {}).own === 'tenho').length, quero: all.filter((e) => (e.ex || {}).own === 'quero').length, emp: all.filter((e) => (e.ex || {}).loan).length, peg: all.filter((e) => (e.ex || {}).own === 'pegou').length };
    if (P.own === 'quero') P.own = '';
    const chips = [P.own && ['own', { tenho: 'Tenho', emp: 'Emprestados', peg: 'Peguei emprestado' }[P.own]], P.nota && ['nota', { 5: '★ 5', 4: '★ 4 ou mais', 3: '★ 3 ou mais', none: 'Sem nota' }[P.nota]], P.fmt && ['fmt', { PAPER: 'Físico', EBOOK: 'E-book', AUDIO: 'Audiolivro' }[P.fmt]], P.gen && ['gen', P.gen]].filter(Boolean);
    body = `<div class="esn-seg">${ESN_ST.filter(([k]) => k === 'ALL' || cnt(k)).map(([k, n]) => `<button type="button" data-st="${k}" class="${P.st === k ? 'on' : ''}">${n}<small>${cnt(k)}</small></button>`).join('')}</div>`
      /* linha de exemplar saiu da Estante (Bia, 20/11): Tenho/Emprestados/Peguei ficam no filtro; Quero ter mora em Você > Desejos */
      + (chips.length ? `<div class="esn-chips">${chips.map(([k, n]) => `<button type="button" data-clr="${k}">${esc(n)} ×</button>`).join('')}</div>` : '')
      + `<div class="esn-bar"><b>${plural(list.length, 'livro', 'livros')}${q ? ` com “${esc(q)}”` : ''}</b><button type="button" data-a="sort">${esc((ESN_SORT.find((x) => x[0] === (P.sort || 'conclusao')) || ESN_SORT[0])[1])} ▾</button><button type="button" data-a="view" aria-label="${P.view === 'lista' ? 'Ver em grade' : 'Ver em lista'}">${P.view === 'lista' ? ESN_ICO.grid : ESN_ICO.list}</button></div>`
      + (list.length ? (P.view === 'lista' ? `<div class="esn-list">${list.map((e) => esnBook(e, 'lista')).join('')}</div>` : `<div class="esn-grid">${list.map((e) => esnBook(e, 'grade')).join('')}</div>`)
        : `<p class="esn-empty">${all.length ? 'Nenhum livro com esses filtros.' : 'Sua biblioteca está vazia. Toque em ＋ para adicionar o primeiro livro.'}</p>`);
  } else {
    const shown = mine.filter((s) => !q || esnMatch({ title: s.name }, q) || shelfBooks('sh:' + s.id).some((e) => esnMatch(e, q)));
    body = shown.map((s) => { const key = 'sh:' + s.id, list = shelfBooks(key), lidos = list.filter((e) => e.status === 'LIDO').length, pct = list.length ? Math.round(lidos / list.length * 100) : 0;
      const vis = q ? list.filter((e) => esnMatch(e, q)) : list;
      return `<section class="esn-sh" data-shelf="${esc(key)}" style="${s.color ? `--sc:${s.color}` : ''}"><div class="esn-shh"><i></i><button type="button" class="nm" data-open="${esc(key)}"><b>${esc(s.name)}</b><small>${plural(list.length, 'livro', 'livros')}${lidos ? ' · ' + plural(lidos, 'lido', 'lidos') : ''}${s.goal && s.goal.by ? ' · meta até ' + String(s.goal.by).slice(8, 10) + '/' + String(s.goal.by).slice(5, 7) : ''}</small></button>`
        + `<button type="button" class="esn-mini" data-add="${esc(key)}" aria-label="Adicionar a ${esc(s.name)}">＋</button><button type="button" class="esn-mini" data-more="${esc(key)}" aria-label="Opções de ${esc(s.name)}">•••</button></div>`
        + (list.length ? `<div class="esn-pr" title="${pct}% lidos"><i style="width:${pct}%"></i></div><div class="esn-row">${vis.slice(0, 14).map((e) => esnBook(e, 'row')).join('')}</div>` : '<p class="esn-empty" style="padding:.6rem 0 .2rem">Estante vazia. Toque em ＋ para adicionar livros.</p>') + '</section>'; }).join('')
      || (mine.length ? `<p class="esn-empty">Nenhuma estante com “${esc(q)}”.</p>` : '<p class="esn-empty"><b>Organize do seu jeito.</b><br>Crie estantes como “Clássicos”, “Clube do livro” ou “Favoritos de 2026”. Um livro pode estar em várias, e tirar de uma estante não apaga nada dele.</p>');
    body += '<button type="button" class="esn-new" data-a="newsh">+ Nova estante</button>';
  }
  box.innerHTML = `<div class="esn-top"><label class="esn-q">${ESN_ICO.q}<input type="search" id="esn-q" placeholder="${P.tab === 'bib' ? 'Buscar título, autor ou gênero' : 'Buscar estante ou livro'}" value="${esc(q)}" autocomplete="off">${q ? '<button type="button" data-a="clrq" aria-label="Limpar busca">×</button>' : ''}</label>`
    + `<button type="button" class="esn-ib" data-a="filt" aria-label="Filtrar e organizar">${ESN_ICO.f}${nAdv ? `<u>${nAdv}</u>` : ''}</button><button type="button" class="esn-ib acc" data-a="add" aria-label="Adicionar">＋</button></div>`
    + `<div class="esn-tabs"><button type="button" data-tab="bib" class="${P.tab === 'bib' ? 'on' : ''}">Minha biblioteca</button><button type="button" data-tab="est" class="${P.tab === 'est' ? 'on' : ''}">Estantes${mine.length ? ' · ' + mine.length : ''}</button></div>` + body;
  paintCv(box);
  const redraw = (keepFocus) => { const pos = box.scrollTop; drawEstante(box); box.scrollTop = pos; if (keepFocus) { const i = box.querySelector('#esn-q'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } } };
  { let tm = 0; box.querySelector('#esn-q').addEventListener('input', (ev) => { S.esnQ = ev.target.value; clearTimeout(tm); tm = setTimeout(() => redraw(true), 200); }); }
  box.querySelector('[data-a=clrq]')?.addEventListener('click', () => { S.esnQ = ''; redraw(); });
  $$('[data-tab]', box).forEach((b) => b.addEventListener('click', () => { P.tab = b.dataset.tab; save(); redraw(); }));
  $$('[data-st]', box).forEach((b) => b.addEventListener('click', () => { P.st = b.dataset.st; save(); redraw(); }));
  $$('.esn-seg [data-own]', box).forEach((b) => b.addEventListener('click', () => { P.own = P.own === b.dataset.own ? '' : b.dataset.own; save(); redraw(); }));
  $$('[data-clr]', box).forEach((b) => b.addEventListener('click', () => { P[b.dataset.clr] = ''; save(); redraw(); }));
  box.querySelector('[data-a=view]')?.addEventListener('click', () => { P.view = P.view === 'lista' ? 'grade' : 'lista'; save(); redraw(); });
  box.querySelector('[data-a=sort]')?.addEventListener('click', (ev) => popMenu(ev.currentTarget, ESN_SORT.map(([k, n]) => ({ label: n, on: (P.sort || 'conclusao') === k, fn: () => { P.sort = k; save(); redraw(); } }))));
  box.querySelector('[data-a=add]').addEventListener('click', (ev) => popMenu(ev.currentTarget, [{ label: 'Adicionar livro', fn: () => shelfAdd('ALL') }, { label: 'Nova estante', fn: () => shelfEditForm() }]));
  box.querySelector('[data-a=newsh]')?.addEventListener('click', () => shelfEditForm());
  box.querySelector('[data-a=filt]').addEventListener('click', () => esnFilterSheet(redraw));
  $$('[data-open]', box).forEach((b) => b.addEventListener('click', () => openShelfV3(b.dataset.open)));
  $$('[data-add]', box).forEach((b) => b.addEventListener('click', () => shelfAdd(b.dataset.add)));
  $$('[data-more]', box).forEach((b) => b.addEventListener('click', () => shelfMenu4(b.dataset.more, b)));
  $$('.esn-li .t', box).forEach((t) => t.addEventListener('click', () => t.parentElement.querySelector('.es-bk')?.click()));
};
function esnFilterSheet(redraw) {
  const P = ESN(), W = { ...P }, gens = [...new Set(lib().map((e) => e.genre).filter(Boolean))].sort();
  const sh = document.createElement('div'); sh.className = 'esn-sheet';
  const paint = () => {
    const ch = (k, opts) => `<div class="ch">${opts.map(([v, n]) => `<button type="button" data-k="${k}" data-v="${esc(v)}" class="${W[k] === v ? 'on' : ''}">${esc(n)}</button>`).join('')}</div>`;
    sh.innerHTML = `<div class="box"><h3>Filtrar e organizar</h3>`
      + `<h4>Situação</h4>${ch('st', ESN_ST)}`
      + `<h4>Nota</h4>${ch('nota', [['', 'Qualquer'], ['5', '★ 5'], ['4', '★ 4 ou mais'], ['3', '★ 3 ou mais'], ['none', 'Sem nota']])}`
      + `<h4>Meu exemplar</h4>${ch('own', [['', 'Qualquer'], ['tenho', 'Tenho'], ['emp', 'Emprestados'], ['peg', 'Peguei emprestado']])}`
      + `<h4>Formato</h4>${ch('fmt', [['', 'Qualquer'], ['PAPER', 'Físico'], ['EBOOK', 'E-book'], ['AUDIO', 'Audiolivro']])}`
      + (gens.length ? `<h4>Gênero</h4>${ch('gen', [['', 'Qualquer'], ...gens.map((g) => [g, g])])}` : '')
      + `<h4>Ordenar por</h4>${ch('sort', ESN_SORT.map(([k, n]) => [k === 'conclusao' ? '' : k, n]))}`
      + `<h4>Ver como</h4>${ch('view', [['grade', 'Grade'], ['lista', 'Lista']])}`
      + `<div class="acts"><button type="button" data-a="clr">Limpar filtros</button><button type="button" class="p" data-a="ok">Ver livros</button></div></div>`;
    sh.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => { W[b.dataset.k] = b.dataset.v; paint(); }));
    sh.querySelector('[data-a=clr]').addEventListener('click', () => { Object.assign(W, { st: 'ALL', nota: '', fmt: '', gen: '', own: '' }); paint(); });
    sh.querySelector('[data-a=ok]').addEventListener('click', () => { Object.assign(P, W, { tab: 'bib' }); save(); sh.remove(); redraw(); });
  };
  sh.addEventListener('click', (ev) => { if (ev.target === sh) sh.remove(); }); paint(); TR.append(sh);
}
