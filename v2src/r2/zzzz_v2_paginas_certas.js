// Páginas certas (Bia, 24/11: "A Ordem dos Mantos Prateados" com 100 pág., edição real 571).
// Causa: a busca junta o Google feito do aparelho (langRestrict=pt) na frente do catálogo da API; a edição do Google
// (e-book/pré-venda, outro ISBN) virava a linha principal e o pageCount dela ia para e.totalPages. Depois nada corrigia.
// (a) Para de gravar: do Google vale printedPageCount; pageCount de e-book fica "fraco". Na busca, quando o grupo do
//     mesmo livro tem a edição do catálogo (API) com páginas, as páginas dela valem para a linha principal.
//     Livro novo guarda de onde veio o número (pagesSrc/pagesAuto); total digitado pela pessoa marca pagesOwn.
// (b) Corrige o que já foi gravado: total suspeito (redondo ou até 120), sem pagesOwn, sem progresso, e a API traz edição
//     brasileira (ISBN 97865/97885) com pelo menos 1,5x as páginas. Uma varredura por dia, poucos livros; ao abrir a página
//     do livro, confere só aquele (uma vez por dia) e mostra um toast discreto com Desfazer. Meta ligada muda junto.
//     Lido sem progresso registrado também entra (melhora as estatísticas).
// "Trocar edição" é escolha da pessoa: marca pagesOwn e pagesSrc 'edicao'.
const PG_BR = (isbn) => /^(97865|97885)/.test(String(isbn || '').replace(/\D/g, ''));
// livro com total digitado pela pessoa (marcado, ou mudado depois do número automático)
const pgOwn = (e) => !!(e && (e.pagesOwn || (e.pagesAuto != null && Number(e.totalPages) !== Number(e.pagesAuto))));
// ---------- (a) Google: printedPageCount vale; pageCount de e-book é fraco ----------
{ const _fg = fromGoogle; fromGoogle = function (d) {
  const out = _fg(d), items = (d && d.items) || [];
  try { out.forEach((it, i) => { const v = items[i] || {}, vi = v.volumeInfo || {}, pr = Number(vi.printedPageCount) || 0, eb = !!(v.saleInfo && v.saleInfo.isEbook);
    if (pr > 0) { it.pages = pr; it.pagesSrc = 'Google Livros (impresso)'; } else if (it.pages && eb) { it.pagesWeak = true; it.pagesSrc = 'Google Livros (e-book)'; } }); } catch {}
  return out; }; }
// ---------- (a) busca: páginas da edição do catálogo valem para a linha principal do mesmo livro ----------
const pgFixGroup = (m) => {
  if (!m || typeof m !== 'object') return m;
  const all = [m, ...(m.editions || [])], lg = (x) => { try { return langOf(x); } catch { return ''; } };
  const same = (x) => !lg(m) || !lg(x) || lg(x) === lg(m);
  const cat = all.find((x) => x.src === 'Catálogo B.E.A.R' && Number(x.pages) > 0 && same(x));
  const strong = all.find((x) => Number(x.pages) > 0 && !x.pagesWeak && same(x));
  const best = cat || (m.pagesWeak || !m.pages ? strong : null);
  if (best && best !== m && Number(best.pages) !== Number(m.pages)) { m.pagesWas = m.pages || null; m.pages = Number(best.pages); m.pagesWeak = false; m.pagesSrc = best.src || 'outra edição'; }
  else if (m.pages && !m.pagesSrc) m.pagesSrc = m.src || null;
  return m;
};
{ const _sb = searchBooks; searchBooks = async function () {
  const list = await _sb.apply(this, arguments); if (!Array.isArray(list)) return list;
  try { list.forEach(pgFixGroup); } catch {} return list; }; }
// ---------- (a) livro novo: de onde veio o número; digitado = da pessoa ----------
// cadastro à mão: o número de páginas foi digitado
{ const _mb = manualBookSheet; manualBookSheet = function (onPick) { return _mb.call(this, (it) => { if (it && typeof it === 'object' && Number(it.totalPages) > 0) it.pagesTyped = 1; return onPick(it); }); }; }
{ const _add = addToLibrary; addToLibrary = function (item, intoCase, direct, opt) {
  const before = new Set(lib().map((x) => x.id)), it = item && typeof item === 'object' ? item : null, r = _add.apply(this, arguments);
  if (!it) return r;
  const auto = !it.pagesTyped && !(opt && opt.quiet); // busca/catálogo/prévia = automático; cadastro à mão e importação (CSV) = da pessoa
  let n = 0; const tag = () => { const e = lib().find((x) => !before.has(x.id) && normT(x.title) === normT(it.title)); if (!e) { if (++n < 40) setTimeout(tag, 500); return; }
    if (!(Number(e.totalPages) > 0) || e.pagesAuto != null || e.pagesOwn) return;
    if (auto) { e.pagesAuto = Number(e.totalPages); e.pagesSrc = it.pagesSrc || it.src || null; } else e.pagesOwn = 1;
    save(); };
  tag(); return r; }; }
// livro sem páginas que o app completa sozinho (capa/páginas do catálogo): número automático
{ const _ff = fillFromCatalog; fillFromCatalog = async function (e) {
  const had = e && Number(e.totalPages) > 0, r = await _ff.apply(this, arguments);
  try { if (e && !had && Number(e.totalPages) > 0 && !e.pagesOwn && e.pagesAuto == null) { e.pagesAuto = Number(e.totalPages); e.pagesSrc = 'catálogo'; save(); } } catch {}
  return r; }; }
// ---------- (a) total digitado pela pessoa: pagesOwn ----------
const pgMarkOwn = (e, n) => { if (e && Number(n) > 0) { e.pagesOwn = 1; delete e.pagesAuto; } };
{ const _ap = askPages; askPages = function (e, done) { return _ap.call(this, e, (n) => { pgMarkOwn(e, n); return done(n); }); }; }
// folhas da parte base (Total de páginas / Editar livro): depois do Salvar, se o total mudou, é da pessoa
{ const after = (e, was) => setTimeout(() => { if (e && Number(e.totalPages) > 0 && Number(e.totalPages) !== Number(was)) { pgMarkOwn(e, e.totalPages); save(); } }, 0);
  const _fp = fixPages; fixPages = function (e) { const r = _fp.apply(this, arguments); const b = $('#fp-s', $('#editor')); if (b) b.addEventListener('click', () => after(e, e.totalPages), { capture: true }); return r; };
  const _el = editLibSheet; editLibSheet = function (e) { const r = _el.apply(this, arguments); const f = [...document.querySelectorAll('.sheet form')].pop(); if (f) f.addEventListener('submit', () => after(e, e.totalPages), { capture: true }); return r; }; }
// "Trocar edição": a edição escolhida pela pessoa vale (pagesOwn, pagesSrc 'edicao')
{ const _ce = changeEdition; changeEdition = function (e) {
  const ed = $('#editor');
  if (e && ed) { const on = (ev) => { const b = ev.target && ev.target.closest && ev.target.closest('.pk-it[data-i]'); if (!b) return; ed.removeEventListener('click', on, true);
      const was = [e.totalPages, e.isbn, e.cover]; setTimeout(() => { if (e.totalPages !== was[0] || e.isbn !== was[1] || e.cover !== was[2]) { if (Number(e.totalPages) > 0) { e.pagesOwn = 1; delete e.pagesAuto; } e.pagesSrc = 'edicao'; save(); } }, 0); };
    ed.addEventListener('click', on, true); setTimeout(() => ed.removeEventListener('click', on, true), 10 * 60000); }
  return _ce.apply(this, arguments); }; }
// ---------- (b) correção dos livros já gravados ----------
{ const DAYK = 'lv.pgscan', CHK = 'lv.pgchk', LOG = [];
  const today = () => { try { return todayISO(); } catch { return new Date().toISOString().slice(0, 10); } };
  const chk = () => { try { return JSON.parse(localStorage.getItem(CHK) || '{}') || {}; } catch { return {}; } };
  const setChk = (id) => { try { const m = chk(), t = today(); m[id] = t; for (const k of Object.keys(m)) if (m[k] !== t && Object.keys(m).length > 400) delete m[k]; localStorage.setItem(CHK, JSON.stringify(m)); } catch {} };
  const goalOf = (e) => { try { const g = e.link && (db.goals || []).find((x) => x.id === e.link.goalId), gb = g && g.books.find((b) => b.id === e.link.bookId); return g && gb ? { g, gb } : null; } catch { return null; } };
  const shelfGbs = (e) => { const out = []; try { for (const g of db.goals || []) for (const b of g.books || []) if (b.fromShelf && b.libId === e.id) out.push({ g, gb: b }); } catch {} return out; };
  const progress = (e) => { let p = 0; try { p = Number(libProgress(e)) || 0; } catch {} const L = goalOf(e); if (L) { try { p = Math.max(p, Number(pagesOf(L.g, L.gb)) || 0); } catch {} } return p; };
  const suspect = (e) => { const t = Number(e && e.totalPages) || 0; return t > 0 && (t <= 120 || t % 50 === 0); };
  const eligible = (e) => {
    if (!e || !e.title || !suspect(e) || pgOwn(e)) return false;
    const t = Number(e.totalPages), p = progress(e), lidoCheio = e.status === 'LIDO' && Number(e.currentPage) === t && !goalOf(e); // lido: "pág. = total" não é progresso registrado
    if ((p > 0 && !lidoCheio) || (e.readLog && e.readLog.length)) return false; // com progresso não mexe (pág. 200 de 100 inclusive); lido sem registro entra
    const L = goalOf(e); if (L && Number(L.gb.totalPages) !== t) return false; // meta com outro total: a pessoa ajustou lá
    return true;
  };
  // edição brasileira do catálogo da API (ISBN 97865/97885, português) com páginas
  const lookup = async (e) => {
    const base = (x) => normT(String(x || '').split(/[:(–]| - /)[0]), sur = (x) => normT(String(x || '').split(',')[0]).split(' ').pop() || '';
    const ok = (b) => b && Number(b.page_count) > 0 && PG_BR(b.isbn) && (!b.language || /^pt|^por/i.test(b.language)) && base(b.title) === base(e.title) && (!sur(e.author) || normT((b.authors || []).join(' ')).includes(sur(e.author)));
    const isbn = String(e.isbn || '').replace(/[^0-9Xx]/g, '');
    if (PG_BR(isbn)) { const b = await getJSON(`${catBase()}/v1/books/isbn/${isbn}`, 12000); if (ok(b)) return b; }
    const d = await getJSON(`${catBase()}/v1/books/search?limit=10&q=${encodeURIComponent(`${e.title} ${String(e.author || '').split(',')[0]}`.trim().slice(0, 120))}`, 12000);
    const L = (d && Array.isArray(d.items) ? d.items : []).filter(ok); if (!L.length) return null;
    L.sort((x, y) => (y.page_count || 0) - (x.page_count || 0)); return L[0];
  };
  const apply = (e, b) => {
    const old = Number(e.totalPages), nw = Number(b.page_count);
    if (!(nw >= old * 1.5) || progress(e) > nw) return false;
    const L = goalOf(e), S2 = shelfGbs(e).filter((x) => Number(x.gb.totalPages) === old), cp = e.currentPage;
    if (e.status === 'LIDO' && Number(cp) === old) e.currentPage = nw;
    e.totalPages = nw; e.pagesAuto = nw; e.pagesSrc = 'catálogo (corrigido)'; e.pagesFixed = { from: old, at: today() };
    if (L) L.gb.totalPages = nw; S2.forEach((x) => { x.gb.totalPages = nw; });
    save(); LOG.push({ id: e.id, old, nw });
    const undo = () => { e.totalPages = old; if (cp === undefined) delete e.currentPage; else e.currentPage = cp; e.pagesOwn = 1; delete e.pagesAuto; delete e.pagesFixed; if (L) L.gb.totalPages = old; S2.forEach((x) => { x.gb.totalPages = old; }); save(); try { refresh(); } catch {} redraw(); toast('Desfeito'); };
    return undo;
  };
  const redraw = () => { try { const v = $('#shelflist'); if (v && !v.hidden && S.listRedraw) S.listRedraw(); } catch {} };
  const pageOpenFor = (e) => { try { const v = $('#shelflist'), h = v && !v.hidden && v.querySelector('.sl-body > .bp-hero .bp-ht h2'); return !!h && normT(h.textContent) === normT(e.title); } catch { return false; } };
  const checkOne = async (e, onPage) => {
    if (!eligible(e)) return false; if (chk()[e.id] === today()) return false; setChk(e.id);
    let b = null; try { b = await lookup(e); } catch {} if (!b || !eligible(e)) return false;
    const undo = apply(e, b); if (!undo) return false;
    try { refresh(); } catch {} redraw();
    if (onPage && pageOpenFor(e)) toast(`Total de páginas atualizado: ${e.totalPages}`, { label: 'Desfazer', fn: undo });
    return true;
  };
  // ao abrir a página do livro: só aquele livro
  { const _obp = openBookPage; openBookPage = function (e) { const r = _obp.apply(this, arguments);
    try { const x = e && (lib().includes(e) ? e : lib().find((y) => normT(y.title) === normT(e.title))); if (x) setTimeout(() => { checkOne(x, true).catch(() => {}); }, 1200); } catch {}
    return r; }; }
  // varredura leve: uma vez por dia, até 4 livros, um de cada vez
  const sweep = async () => {
    try { if (document.visibilityState === 'hidden' || localStorage.getItem(DAYK) === today()) return; localStorage.setItem(DAYK, today()); } catch { return; }
    const L = lib().filter(eligible).slice(0, 4);
    for (const e of L) { try { await checkOne(e, false); } catch {} await new Promise((ok) => setTimeout(ok, 1500)); }
  };
  setTimeout(() => { sweep().catch(() => {}); }, 20000);
  try { window.__lvPg = { log: LOG, checkOne: (id, onPage) => checkOne(byId(id), onPage), sweep, eligible: (id) => eligible(byId(id)), own: (id) => pgOwn(byId(id)) }; } catch {}
}
