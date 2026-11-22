// v4 Estante e menu do livro (Bia, 20/11; etapas 4 e 5 do alinhamento com o protótipo v3 https://claude.ai/artifact/FZDpofzVvP8EJjSrugBoJc).
// Regra: o que foi revisado no protótipo fica igual no app dev. Esta parte usa o mesmo CSS do protótipo que o v4 Ler (V4CSS),
// numa raiz própria dentro da aba Estante (em fluxo, rola com a página). Folhas e o cometa do sorteio abrem na camada V4.
// - Livros: chips de situação numa linha, filtro (painel existente), dica no topo, "+ Adicionar livro" primeiro, grade de 3 com nota.
// - Estantes: ordenar, Sortear, + Nova estante, bibliotecas (s.grp), arquivadas (s.arch), menu da estante, modo Organizar (↑↓),
//   Quem vê (s.priv: some do perfil publicado) e o sorteio com cometa.
// - Trechos: categorias (q.c), sentimentos da lista única (q.f), agrupar por livro/sentimento/recentes, segurar = menu, seleção.
// - Menu do livro (em todo o app): por situação, + Emprestar, Estantes, Trocar edição (com formato e duração de audiolivro),
//   Compartilhar, Remover (fica 30 dias em Ajustes › Removidos recentemente). Parar de ler, Não terminei, Ler de novo.
// Tocar numa capa abre a página do livro; segurar (ou clique direito) abre o menu.
const V5CSS = `.v5hd{display:flex;align-items:center;gap:6px}.v5hd .sh-go{flex:1;min-width:0}.v5share{flex:none;width:44px;height:44px;display:grid;place-items:center;border:1px solid var(--line);border-radius:14px;background:none;color:var(--ink);cursor:pointer}.v5more .r{transition:transform .15s}.v5est{position:static!important;inset:auto!important;z-index:auto!important;padding:0 0 24px}
.v5est .bk,.v5est .tq,.v5est .shelf{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}
.v5est .selbar{position:sticky;bottom:calc(84px + env(safe-area-inset-bottom,0px))}
.v5est .sub{display:flex;align-items:center;gap:8px;margin:6px 0 10px}.v5est .sub h2{font-family:var(--f-disp);font-size:20px;margin:0;flex:1}
.v5est .empty{padding:22px 16px;border:1.5px dashed var(--line);border-radius:16px;text-align:center;color:var(--ink2);margin-top:12px}
.v5est .act0{display:inline-flex;align-items:center;gap:6px;margin:10px auto 0;color:var(--acc);font-weight:900}
.v5est .shelf .ud{display:flex;gap:4px;margin-left:auto}.v5est .shelf .ud button{width:30px;height:30px;border-radius:10px;background:var(--soft);display:grid;place-items:center}
.v5est .shelf .lk{display:inline-flex;color:var(--ink3);margin-left:4px}
.v4ler .sh-go{width:100%;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;padding:0 0 12px;align-items:center}
.v4ler .sh-go .sh-lk{display:block!important;margin-top:3px;font-size:11.5px;font-weight:800;color:var(--acc)}
.v4ler .sh-go .r{opacity:.7;display:flex}
.v4ler .sh-due{display:flex;gap:9px;align-items:flex-start;margin:0 0 10px;padding:10px 12px;border-radius:14px;background:color-mix(in srgb,var(--acc) 13%,transparent);font-size:12.5px;line-height:1.4}
.v4ler .sh-due .i{flex:none;color:var(--acc)}
.v4ler .sh-due button{border:0;background:none;padding:0;font:inherit;font-weight:900;color:var(--acc);text-decoration:underline;cursor:pointer}
.v4ler .v5f{display:grid;gap:8px;margin-top:6px}.v4ler .v5f label{display:grid;gap:4px;font-size:12px;font-weight:800;color:var(--ink2)}
.v4ler .v5f2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.v4ler .v5rm{display:flex;align-items:center;gap:10px}.v4ler .v5rm .t{flex:1;min-width:0}
`;
const V5PROP = [['reler', 'Favorito', 'para reler sempre'], ['citar', 'Citação', 'para mandar ou postar'], ['lembrar', 'Lembrete', 'pista ou detalhe da história; fica escondido como spoiler'], ['pensar', 'Reflexão', 'para pensar depois']];
const V5COR = ['#e2766b', '#8f7be0', '#e0ad3a', '#4fa3c7', '#5fb88a', '#d0544a', '#c77bd1', '#d98b4a'];
const v5S = () => (S.v5 = S.v5 || { tab: 'livros', tqG: 'livro', tqF: '', sel: null, show: [], shEd: false, sub: null });
const v5P = () => (db.prefs = db.prefs || {});
const v5Save = () => { try { save(); } catch {} };
const v5Redraw = () => { try { if (S.tab === 'estante') drawEstante($('#lista')); } catch (err) { console.warn('estante v4', err); } };
const v5Paws = (e) => (e && e.status === 'LIDO' ? Number((reviewOfLib(e) || {}).paws) || 0 : 0); // nota só em livro lido (Bia, 21/11: Battle Royale em Quero ler aparecia com ★★★★)
const v5Stars = (n) => { const r = Math.round(n); return `<span class="stars" aria-label="nota ${String(n).replace('.', ',')}">${'★'.repeat(r)}<i>${'★'.repeat(5 - r)}</i></span>`; };
const V5ST = { LENDO: 'lendo', QUERO: 'quero ler', LIDO: 'lido', HIBERNANDO: 'pausado', ABANDONEI: 'abandonado' };
const v5Pct = (e) => { const t = Number(e.totalPages) || 0; return t ? Math.min(100, Math.round(libProgress(e) / t * 100)) : 0; };
const v5Shelves = () => (db.shelves = db.shelves || []);
const v5ShBooks = (s) => (s.bookIds || []).map((id) => lib().find((e) => e.id === id)).filter(Boolean);
const v5Book = (id) => lib().find((x) => String(x.id) === String(id));

// ---------- raiz própria dentro da aba ----------
function v5Root(box) {
  let h = box.querySelector(':scope > .v5host');
  if (!h || !h.shadowRoot) {
    box.innerHTML = ''; h = document.createElement('div'); h.className = 'v5host'; box.append(h);
    const sr = h.attachShadow({ mode: 'open' }), st = document.createElement('style'); st.textContent = V4CSS + V4EXTRA + V5CSS; sr.append(st);
    const r = document.createElement('div'); r.className = 'v4ler v5est'; sr.append(r);
    r.addEventListener('click', v5Click, true); v5Gestures(r);
  }
  return h.shadowRoot.querySelector('.v5est');
}
// tocar / segurar (meio segundo) / clique direito, sem selecionar texto e sem abrir nada ao rolar
function v5Gestures(r) {
  let t = 0, x0 = 0, y0 = 0, el = null;
  const clear = () => { clearTimeout(t); t = 0; el = null; };
  r.addEventListener('pointerdown', (ev) => { const n = ev.target.closest('[data-long]'); if (!n) return; el = n; x0 = ev.clientX; y0 = ev.clientY; clearTimeout(t);
    t = setTimeout(() => { if (!el) return; r.dataset.longAt = Date.now(); try { navigator.vibrate && navigator.vibrate(12); } catch {} v5Long(el); clear(); }, 450); });
  r.addEventListener('pointermove', (ev) => { if (el && (Math.abs(ev.clientX - x0) > 10 || Math.abs(ev.clientY - y0) > 10)) clear(); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((k) => r.addEventListener(k, clear));
  r.addEventListener('contextmenu', (ev) => { const n = ev.target.closest('[data-long]'); if (!n) return; ev.preventDefault(); clear(); r.dataset.longAt = Date.now(); v5Long(n); });
}
function v5Long(n) {
  const k = n.dataset.long;
  if (k === 'bm') return v5Menu(v5Book(n.dataset.id));
  if (k === 'shm') return v5Sheet('v5shm', { sh: n.dataset.id });
  if (k === 'grp') return v5Sheet('v5grpm', { grp: n.dataset.g });
  if (k === 'tqm') { const S5 = v5S(); if (S5.sel) return v5TqTog(n.dataset.q); return v5Sheet('v5tqm', { q: n.dataset.q }); }
}

// ---------- aba Estante ----------
drawEstante = function (box) {
  const R = v5Root(box), S5 = v5S(), tq = v4On('trechos');
  if (S5.tab === 'trechos' && !tq) S5.tab = 'livros';
  const seg = `<div class="seg" role="tablist">${[['livros', 'Livros'], ['estantes', 'Estantes'], ['trechos', 'Trechos']].filter(([k]) => k !== 'trechos' || tq).map(([k, l]) => `<button class="${S5.tab === k ? 'on' : ''}" data-a="v5tab" data-k="${k}" role="tab" aria-selected="${S5.tab === k}">${l}</button>`).join('')}</div>`;
  let body = '';
  if (S5.sub && S5.sub.k === 'grp') body = v5GrpHTML(S5.sub.g);
  else if (S5.sub && S5.sub.k === 'arq') body = v5ArqHTML();
  else body = seg + (S5.tab === 'estantes' ? v5EstantesHTML() : S5.tab === 'trechos' ? v5TrechosHTML() : v5LivrosHTML());
  R.innerHTML = body;
};
function v5LivrosHTML() {
  const P = ESN(), all = lib(), cnt = (k) => (k === 'ALL' ? all.length : all.filter((e) => e.status === k).length);
  if (P.own === 'quero') P.own = '';
  let base; try { base = shelfBooks('ALL'); } catch { base = null; } if (!Array.isArray(base) || (!base.length && all.length)) base = all.slice();
  const list = esnFilter(esnSort(base, P.sort), P, '');
  const F = ESN_ST.filter(([k]) => k === 'ALL' || cnt(k));
  const act = [P.own && ['own', { tenho: 'Tenho', emp: 'Emprestados', peg: 'Peguei emprestado' }[P.own]], P.nota && ['nota', { 5: '★ 5', 4: '★ 4 ou mais', 3: '★ 3 ou mais', none: 'Sem nota' }[P.nota]], P.fmt && ['fmt', { PAPER: 'Físico', EBOOK: 'E-book', AUDIO: 'Audiolivro' }[P.fmt]], P.gen && ['gen', P.gen]].filter(Boolean);
  const falt = all.filter((e) => e.status === 'LIDO' && (!e.finishedAt || !e.totalPages || !v5Paws(e))).length;
  const card = (e) => { const p = v5Pct(e), n = v5Paws(e);
    return `<button class="bk" data-a="v5book" data-id="${esc(e.id)}" data-long="bm" aria-label="${esc(e.title)}"><span style="position:relative;display:block">${v4cv(e)}${e.status === 'LENDO' ? `<span class="pb"><i style="width:${p}%"></i></span>` : ''}</span><b>${esc(e.title)}</b><small>${e.status === 'LENDO' ? p + '% lido' : n ? v5Stars(n) : V5ST[e.status] || ''}</small></button>`; };
  return `<div class="row" style="gap:8px"><div class="chips" style="flex:1;margin-right:0;padding-right:18px;-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 26px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 26px),transparent)">${F.map(([k, l]) => `<button class="chip ${(P.st || 'ALL') === k ? 'on' : ''}" data-a="v5st" data-k="${k}">${l} <small>${cnt(k)}</small></button>`).join('')}</div><button class="tool" data-a="v5filt" aria-label="Ordenar e filtrar">${v4ic('sort', 20)}</button></div>
  ${act.length ? `<div class="chips" style="margin-top:6px">${act.map(([k, n]) => `<button class="chip on" data-a="v5clr" data-k="${k}">${esc(n)} ×</button>`).join('')}</div>` : ''}
  ${v5P().tipEst5 ? '' : `<div class="tip"><span><b>Dica:</b> toque na capa para abrir o livro; segure para atualizar, terminar ou mudar o status sem abrir.</span><button data-a="v5tip" data-k="tipEst5" aria-label="Entendi">${v4ic('x', 16)}</button></div>`}
  ${P.st === 'LIDO' && falt ? `<div class="tip"><span><b>${falt} ${falt === 1 ? 'lido está' : 'lidos estão'}</b> sem data, páginas ou nota.</span><button class="lnk" style="text-decoration:none" data-a="v5fix">Completar</button></div>` : ''}
  <div class="grid"><button class="add" data-a="sheet" data-s="v5add">${v4ic('plus')}Adicionar livro</button>${list.map(card).join('')}</div>
  ${!list.length && all.length ? `<div class="empty">Nenhum livro com esse filtro.<br><button class="act0" data-a="v5clrall">Limpar filtros</button></div>` : ''}`;
}
// ---------- Estantes ----------
const V5ORD = [['mine', 'Minha ordem', 'você arruma no modo Organizar'], ['recent', 'Usadas por último', 'onde você colocou livro mais recente'], ['name', 'Nome', 'A a Z'], ['count', 'Mais livros', 'das maiores para as menores']];
function v5Ordered(L) {
  const k = v5P().shOrd || 'mine';
  if (k === 'name') return L.slice().sort((a, b) => String(a.name).localeCompare(String(b.name), 'pt-BR'));
  if (k === 'count') return L.slice().sort((a, b) => (b.bookIds || []).length - (a.bookIds || []).length);
  if (k === 'recent') return L.slice().sort((a, b) => String(b.touchedAt || '').localeCompare(String(a.touchedAt || '')));
  return L;
}
function v5ShCard(s, ed) {
  const B = v5ShBooks(s), lid = B.filter((e) => e.status === 'LIDO').length;
  const sub = s.goal && s.goal.by ? `meta: ${(s.bookIds || []).length} até ${String(s.goal.by).split('-').reverse().slice(0, 2).join('/')}` : `${plural(B.length, 'livro', 'livros')}${lid ? ' · ' + plural(lid, 'lido', 'lidos') : ''}`;
  return `<button class="card shelf" data-a="${ed ? 'noop' : 'v5shopen'}" data-id="${esc(s.id)}" data-long="${ed ? '' : 'shm'}"><div class="hd">${ed ? `<span class="hdl" aria-hidden="true">${v4ic('sort', 16)}</span>` : ''}<b>${esc(s.name)}</b>${s.priv ? `<span class="lk" title="Só você vê">${v4ic('lock', 14)}</span>` : ''}<span class="mut">${sub}</span>${ed ? `<span class="ud"><span role="button" data-a="v5up" data-id="${esc(s.id)}" aria-label="Subir">↑</span><span role="button" data-a="v5dn" data-id="${esc(s.id)}" aria-label="Descer">↓</span></span>` : ''}</div><div class="covers">${B.slice(0, 5).map((e) => v4cv(e)).join('')}</div></button>`;
}
function v5EstantesHTML() {
  const S5 = v5S(), ed = S5.shEd, L = v5Ordered(v5Shelves().filter((s) => !s.arch)), arq = v5Shelves().filter((s) => s.arch);
  const seen = new Set(); let cards = '';
  L.forEach((s) => {
    if (s.grp && !ed) { if (seen.has(s.grp)) return; seen.add(s.grp); const G = L.filter((x) => x.grp === s.grp), nb = G.reduce((a, x) => a + (x.bookIds || []).length, 0), cov = G.flatMap(v5ShBooks).slice(0, 5);
      cards += `<button class="card shelf grp" data-a="v5grp" data-g="${esc(s.grp)}" data-long="grp"><span class="gt">Biblioteca</span><div class="hd"><b>${esc(s.grp)}</b><span class="mut">${plural(G.length, 'estante', 'estantes')} · ${plural(nb, 'livro', 'livros')}</span>${v4ic('chev', 16)}</div><div class="covers">${cov.map((e) => v4cv(e)).join('')}</div></button>`; return; }
    cards += v5ShCard(s, ed);
  });
  const ord = (V5ORD.find((x) => x[0] === (v5P().shOrd || 'mine')) || V5ORD[0])[1];
  return `<div class="shh"><button class="so" data-a="sheet" data-s="v5shsort">${v4ic('sort', 16)}${ord}</button><button class="lot" data-a="sheet" data-s="v5sorteio">${v4ic('orb', 16)}Sortear</button><button data-a="v5newsh">${v4ic('plus', 16)}Nova estante</button></div>
  ${v5P().tipSh5 || ed ? '' : `<div class="tip"><span><b>Dica:</b> segure uma estante para pôr livros, editar, juntar num grupo ou arquivar.</span><button data-a="v5tip" data-k="tipSh5" aria-label="Entendi">${v4ic('x', 16)}</button></div>`}
  ${ed ? `<div class="tip"><span>Use ↑ e ↓ para mudar a ordem.</span><button class="lnk" style="text-decoration:none" data-a="v5shed">Pronto</button></div>` : ''}
  ${cards || `<div class="empty">Estantes são listas suas: "Clássicos", "Para dar de presente", "Clube do livro". Um livro pode estar em várias.<br><button class="act0" data-a="v5newsh">${v4ic('plus', 16)}Nova estante</button></div>`}
  ${arq.length && !ed ? `<button class="arq" data-a="v5arq">${v4ic('save', 18)}<span>Arquivadas<small>${plural(arq.length, 'estante', 'estantes')} · os livros e os números continuam</small></span>${v4ic('chev', 16)}</button>` : ''}`;
}
function v5GrpHTML(g) {
  const L = v5Shelves().filter((s) => s.grp === g && !s.arch);
  return `<div class="sub"><button class="tool" data-a="v5back" aria-label="Voltar">${v4ic('back', 20)}</button><h2>${esc(g)}</h2><button class="tool" data-a="sheet" data-s="v5grpm" data-g="${esc(g)}" aria-label="Opções do grupo">${v4ic('dots', 20)}</button></div>
  <div class="shh"><span class="mut" style="font-size:12.5px">${plural(L.length, 'estante', 'estantes')}</span><button data-a="v5newsh" data-g="${esc(g)}">${v4ic('plus', 16)}Nova estante neste grupo</button></div>
  ${L.map((s) => v5ShCard(s, false)).join('') || '<div class="empty">Nenhuma estante aqui.</div>'}`;
}
function v5ArqHTML() {
  const L = v5Shelves().filter((s) => s.arch);
  return `<div class="sub"><button class="tool" data-a="v5back" aria-label="Voltar">${v4ic('back', 20)}</button><h2>Arquivadas</h2></div>
  <p class="mut" style="margin:0 0 10px;font-size:12.5px">Não aparecem na lista nem em "adicionar à estante", mas os livros e as estatísticas continuam. Segure uma para desarquivar ou excluir.</p>
  ${L.map((s) => v5ShCard(s, false)).join('') || '<div class="empty">Nada arquivado.</div>'}`;
}
// ---------- Trechos ----------
const v5Quotes = () => { const out = []; lib().forEach((e) => (e.quotes || []).forEach((q, i) => { if (q && q.t) out.push({ e, q, i, k: e.id + '|' + i }); })); return out; };
const v5Q = (k) => { const [id, i] = String(k || '').split('|'); const e = v5Book(id); const q = e && (e.quotes || [])[Number(i)]; return q ? { e, q, i: Number(i), k } : null; };
const v5Fe = (q) => [...new Set((q.f || []).map((k) => emoKey(k)).filter(Boolean))];
const v5FeName = (k) => (QT_PICK.find((y) => y[0] === k) || [, k])[1];
const v5FeCor = (k) => V5COR[Math.max(0, QT_PICK.findIndex((y) => y[0] === k)) % V5COR.length];
function v5TrechosHTML() {
  const S5 = v5S(), G = S5.tqG || 'livro', fl = S5.tqF || '', sel = S5.sel, all = v5Quotes(), list = all.filter((x) => !fl || x.q.c === fl);
  const tag = (k) => `<span class="stag" style="--c:${v5FeCor(k)}">${esc(v5FeName(k))}</span>`;
  const ptag = (c) => { const x = V5PROP.find((y) => y[0] === c); return x ? `<span class="ptag">${x[1]}</span>` : ''; };
  const card = (x) => { const hide = x.q.c === 'lembrar' && !S5.show.includes(x.k) && !sel, fe = v5Fe(x.q);
    const txt = `<p>"${esc(x.q.t)}"</p>`;
    return `<button class="card quote tq${sel && sel.includes(x.k) ? ' on' : ''}" data-a="${sel ? 'v5tqtog' : hide ? 'v5tqshow' : 'v5tqopen'}" data-q="${esc(x.k)}" data-long="tqm">${sel ? `<span class="ck">${sel.includes(x.k) ? v4ic('ok', 22) : ''}</span>` : ''}${hide ? `<span class="spz"><span class="spzt">${txt}</span><span class="spveil on"><em>${v4ic('eye', 15)}Cuidado, spoiler</em><small>Eu quero ver mesmo assim</small></span></span>` : txt}${x.q.n && !hide ? `<span class="nt2">${v4ic('pen', 13)}${esc(x.q.n)}</span>` : ''}<span class="ft">${G === 'livro' ? (x.q.p ? `pág. ${x.q.p}` : '') : `${esc(x.e.title)}${x.q.p ? ' · pág. ' + x.q.p : ''}`}<span class="tags">${fl ? '' : ptag(x.q.c)}${fe.map(tag).join('')}</span></span></button>`; };
  let body = '';
  if (!all.length) body = `<div class="empty">Guarde aqui as frases que te marcaram. Dá para fotografar a página e o app lê o texto.<br><button class="act0" data-a="sheet" data-s="v5tqnew">${v4ic('plus', 16)}Trecho</button></div>`;
  else if (G === 'livro') { const ids = [...new Set(list.map((x) => x.e.id))]; body = ids.map((id) => { const its = list.filter((x) => x.e.id === id), e = its[0].e, open = S5.tqOpen === id || its.length <= 2;
    return `<div class="tqh">${v4cv(e, '', 'width:26px;height:39px;font-size:5px;')}<b>${esc(e.title)}</b><span class="mut">${its.length} trecho${its.length > 1 ? 's' : ''}</span></div>${(open ? its : its.slice(0, 2)).map(card).join('')}${open ? '' : `<button class="tqmore" data-a="v5tqmore" data-id="${esc(id)}">Ver os ${its.length} trechos de ${esc(e.title)}</button>`}`; }).join(''); }
  else if (G === 'sent') { body = QT_PICK.map(([k, n]) => { const its = list.filter((x) => v5Fe(x.q).includes(k)); return its.length ? `<div class="tqh"><i class="dot" style="background:${v5FeCor(k)}"></i><b>${esc(n)}</b><span class="mut">${its.length}</span></div>${its.map(card).join('')}` : ''; }).join('');
    const no = list.filter((x) => !v5Fe(x.q).length); if (no.length) body += `<div class="tqh"><i class="dot" style="background:var(--soft)"></i><b>Sem sentimento</b><span class="mut">${no.length}</span></div>${no.map(card).join('')}`; }
  else body = list.slice().sort((a, b) => String(b.q.at || '').localeCompare(String(a.q.at || ''))).map(card).join('');
  if (all.length && !list.length) body = '<div class="empty">Nenhum trecho nesta categoria.</div>';
  return `<div class="shh"><button class="so" data-a="sheet" data-s="v5tqsort">${v4ic('sort', 16)}${{ livro: 'Por livro', sent: 'Por sentimento', rec: 'Mais recentes' }[G]}</button><button data-a="sheet" data-s="v5tqnew">${v4ic('plus', 16)}Trecho</button></div>
  ${all.length ? `<div class="chips"><button class="chip ${fl ? '' : 'on'}" data-a="v5tqf" data-k="">Todos <small>${all.length}</small></button>${V5PROP.map(([k, n]) => `<button class="chip ${fl === k ? 'on' : ''}" data-a="v5tqf" data-k="${k}">${n} <small>${all.filter((x) => x.q.c === k).length}</small></button>`).join('')}</div>` : ''}
  ${v5P().tipTq5 || sel || !all.length ? '' : `<div class="tip"><span><b>Dica:</b> segure um trecho para editar, excluir ou selecionar vários.</span><button data-a="v5tip" data-k="tipTq5" aria-label="Entendi">${v4ic('x', 16)}</button></div>`}
  ${body}
  ${sel ? `<div class="selbar"><button data-a="v5sel0" aria-label="Sair da seleção">${v4ic('x', 18)}</button><b>${sel.length} selecionado${sel.length === 1 ? '' : 's'}</b><button data-a="sheet" data-s="v5tqcat"${sel.length ? '' : ' disabled'}>${v4ic('quote', 18)}<small>Organizar</small></button><button data-a="v5selcopy"${sel.length ? '' : ' disabled'}>${v4ic('send', 18)}<small>Copiar</small></button><button class="dng" data-a="v5seldel"${sel.length ? '' : ' disabled'}>${v4ic('trash', 18)}<small>Excluir</small></button></div>` : ''}`;
}
function v5TqTog(k) { const S5 = v5S(); if (!S5.sel) return; S5.sel = S5.sel.includes(k) ? S5.sel.filter((x) => x !== k) : [...S5.sel, k]; v5Redraw(); }

// ---------- folhas (camada V4) ----------
function v5Sheet(k, ctx) {  const st = v4State(); st.v5 = ctx || {}; if (ctx && ctx.e) st.sheetE = ctx.e.id; st.sheet = k; v5Arm(v4Root()); v4Draw(); }
function v5SheetClose() { const st = v4State(); st.sheet = null; if (!st.view) v4Close(); else v4Draw(); }
function v5Menu(e) { if (!e) return; v4State().v5more = false; v5Sheet('v5bm', { e }); }
const v5li = (a, ic, t, sm, more, cls) => `<button class="li${cls ? ' ' + cls : ''}" data-a="${a}"${more || ''}>${v4ic(ic, 20)}<span class="t">${t}${sm ? `<small>${sm}</small>` : ''}</span>${/^v5go|sheet/.test(a) ? `<span class="r">${v4ic('chev', 16)}</span>` : ''}</button>`;
const v5hd = (e, h, sub) => `<div class="sh-bk">${v4cv(e)}<div><h3>${h}</h3><span class="mut">${sub}</span></div></div>`;
function v5BmHTML(e) {
  const st = e.status, pg = libProgress(e), tot = Number(e.totalPages) || 0, due = (() => { try { return v4Due(e); } catch { return null; } })(), soc = v4On('comunidade');
  const shN = v5Shelves().filter((s) => (s.bookIds || []).includes(e.id)).map((s) => s.name);
  // Menu do livro aprovado (Bia, 20/11; protótipo v161): no topo as ações do status, sempre na mesma ordem; "Mais" abre no lugar,
  // em ordem fixa (o que não se aplica some, nada troca de lugar); Compartilhar é botão fixo no cabeçalho; Remover da Biblioteca separado no fim.
  const top = st === 'LENDO' ? [v5li('v5upd', 'pag', 'Atualizar página'), v5li('v5fim', 'ok', 'Terminei', 'nota, datas e o que sentiu'), vFn('prazos') && v5li('v5prazo', 'cal', e.dueAt ? 'Prazo' : 'Definir prazo', e.dueAt ? (due && !due.done ? `hoje, até a pág. ${due.target}` : 'mudar a data ou tirar') : 'quando quer terminar?'), v5li('sheet', 'stop', 'Parar de ler', 'pausar, desistir ou marquei por engano', ' data-s="v5stop"')]
    : st === 'QUERO' ? [v5li('v5start', 'ler', 'Começar a ler', 'vira o livro do Hoje'), v5li('v5fim', 'ok', 'Já li', 'leitura antiga: nota e quando leu'), v5li('v5prio', 'sort', 'Prioridade', { 1: 'alta', 2: 'normal', 3: 'baixa' }[e.prio || 2]), v5FilaLivre(e) ? v5li('v5tirafila', 'x', 'Tirar da fila', 'sai na hora; dá para desfazer') : '']
    : st === 'LIDO' ? [v5li('v5fim', 'quote', 'Minha avaliação', 'nota, emoções e níveis do enredo'), v5li('sheet', 'swap', 'Ler de novo', 'a leitura anterior fica no histórico', ' data-s="v5reler"'), v5li('sheet', 'undo', 'Não terminei', 'marquei como lido por engano', ' data-s="v5unlido"'), v5li('v5retro', 'cal', 'Retrospectiva')]
    : st === 'HIBERNANDO' ? [v5li('v5start', 'ler', 'Voltar a ler', pg ? 'volta para o Hoje na pág. ' + pg : 'volta para o Hoje onde você parou'), v5li('v5fila', 'plus', 'Voltar para a fila', 'Quero ler'), v5li('v5aband', 'stop', 'Desistir', 'vai para Abandonados')]
    : [v5li('v5start', 'ler', 'Voltar a ler', pg ? 'volta para o Hoje na pág. ' + pg : 'volta para o Hoje onde você parou'), v5li('v5fila', 'plus', 'Voltar para a fila', 'Quero ler')];
  const tem = (e.ex || {}).own === 'tenho';
  const mais = [
    v5li('v5shelves', 'estante', 'Estantes', shN.length ? esc(shN.slice(0, 2).join(', ')) + (shN.length > 2 ? ' e mais ' + (shN.length - 2) : '') : 'em nenhuma estante'),
    (st === 'QUERO' || st === 'LENDO') && vFn('junto') ? v5li('v5junto', 'friends', 'Ler junto', 'convidar ou pedir para entrar') : '',
    st !== 'LENDO' && tem && v4On('emprest') ? v5li('v5lend', 'swap', 'Emprestar', 'seu exemplar, para uma amizade ou alguém de fora') : '',
    st === 'QUERO' ? v5li('v5buy', 'cart', 'Onde comprar', 'comparar preços nas lojas') : '',
    st !== 'ABANDONEI' ? v5li('sheet', 'pag', 'Trocar edição', 'capa, páginas, formato e idioma', ' data-s="v5edicao"') : '',
    typeof COVM !== 'undefined' && COVM.admin ? v5li('v5covmod', 'pen', 'Trocar capa para todos', 'moderação') : ''].filter(Boolean);
  const maisN = { v5shelves: 'Estantes', v5junto: 'Ler junto', v5lend: 'Emprestar', v5buy: 'Onde comprar', sheet: 'Trocar edição', v5covmod: 'Trocar capa' };
  const maisTxt = mais.map((h) => { const m = h.match(/data-a="([^"]+)"/); return m ? maisN[m[1]] : ''; }).filter(Boolean).join(' · ');
  const open = !!v4State().v5more;
  return `<div class="v5hd"><button class="sh-bk sh-go" data-a="v5open" aria-label="Abrir página do livro">${v4cv(e)}<div style="flex:1;min-width:0;text-align:left"><h3>${esc(e.title)}</h3><span class="mut">${esc(e.author || '')}${e.author ? ' · ' : ''}${V5ST[st] || ''}${st === 'LENDO' && pg ? ' · pág. ' + pg + (tot ? ' de ' + tot : '') : ''}</span><small class="sh-lk">Ver página do livro</small></div></button><button type="button" class="v5share" data-a="sheet" data-s="v5share" aria-label="Compartilhar" title="${soc ? 'Indicar a alguém ou postar' : 'Indicar a alguém'}">${v4ic('send', 20)}</button></div>
  <div class="list">${top.filter(Boolean).join('')}
  ${mais.length ? `<button class="li v5more${open ? ' on' : ''}" data-a="v5more" aria-expanded="${open}">${v4ic('dots', 20)}<span class="t">Mais<small>${maisTxt}</small></span><span class="r" style="transform:rotate(${open ? -90 : 90}deg)">${v4ic('chev', 16)}</span></button>` : ''}
  ${open ? mais.join('') : ''}
  ${v5li('sheet', 'trash', 'Remover da Biblioteca', 'some de tudo; fica 30 dias em Removidos recentemente', ' data-s="v5rm"', 'dng')}</div>`;
}
const v4SheetHTML_v5 = v4SheetHTML;
v4SheetHTML = function (k) {
  if (!String(k).startsWith('v5')) return v4SheetHTML_v5(k);
  const st = v4State(), c = st.v5 || {}, e = lib().find((x) => x.id === st.sheetE) || c.e || null;
  try {
    if (k === 'v5bm') return e ? v5BmHTML(e) : '';
    if (k === 'v5stop') { const pg = libProgress(e), dueAt = e.dueAt;
      return `${v5hd(e, 'Parar de ler', `${esc(e.title)} · pág. ${pg}${e.totalPages ? ' de ' + e.totalPages : ''}`)}
      ${dueAt ? `<div class="sh-due">${v4ic('cal', 18)}<span>Este livro tem prazo. Se for só um atraso, dá para <button data-a="v5prazo">mudar a data</button> em vez de parar.</span></div>` : ''}
      <div class="list">${v5li('v5pause', 'pause', 'Pausar', `sai do Hoje e guarda a pág. ${pg}. Fica em Biblioteca › Pausados até você retomar.${dueAt ? ' O prazo fica suspenso.' : ''}`)}
      ${v5li('v5aband', 'stop', 'Desistir', `vai para Abandonados com a página onde parou. Não conta na meta.${dueAt ? ' O prazo é cancelado.' : ''}`)}
      ${v5li('v5engano', 'undo', 'Marquei por engano', `volta para Quero ler e apaga o progresso, como se nunca tivesse começado.${dueAt ? ' O prazo é cancelado.' : ''}`)}</div>
      <button class="btn s w" data-a="sheet" data-s="v5bm" style="margin-top:10px">Voltar</button>`; }
    if (k === 'v5unlido') return `${v5hd(e, 'Não terminei', esc(e.title))}
      <div class="sh-due">${v4ic('quote', 18)}<span>Sai da meta do ano e das estatísticas. Sua nota e avaliação ficam guardadas e voltam se você terminar.</span></div>
      <div class="list">${v5li('v5ul_lendo', 'ler', 'Ainda estou lendo', 'volta para Lendo e para o Hoje, na página em que você estava.')}
      ${v5li('v5ul_meio', 'pause', 'Parei no meio', 'vai para Pausados, com a página onde parou.')}
      ${v5li('v5ul_nada', 'undo', 'Nem comecei', 'volta para Quero ler, sem página.')}</div>
      <button class="btn s w" data-a="sheet" data-s="v5bm" style="margin-top:10px">Voltar</button>`;
    if (k === 'v5rm') { const msg = { QUERO: 'O livro sai do Quero ler, da Biblioteca e das suas estantes.', LENDO: 'O livro sai do Hoje e da Biblioteca, junto com páginas, trechos e anotações. Se só quer parar, use Parar de ler: pausar ou desistir guarda o histórico.', LIDO: 'O livro sai da Biblioteca, da meta do ano e das estatísticas, junto com nota, avaliação e trechos. Se marcou como lido por engano, use Não terminei.', HIBERNANDO: 'O livro sai da Biblioteca e das estatísticas, junto com páginas e trechos. Se só quer parar de ver em Pausados, use Desistir: o histórico fica.' }[e.status] || 'O livro sai da Biblioteca e das suas estantes.';
      return `${v5hd(e, 'Remover da Biblioteca?', esc(e.title))}<p class="mut" style="margin:0 0 12px">${msg}</p>
      <div class="sh-due">${v4ic('undo', 18)}<span>Nada se perde na hora: o livro fica <b>30 dias</b> em Você › Ajustes › Removidos recentemente, com tudo o que tinha, e volta com um toque.</span></div>
      <div class="row" style="gap:8px"><button class="btn s" style="flex:1" data-a="sheet" data-s="v5bm">Voltar</button><button class="btn p" style="flex:1" data-a="v5rmok">Remover</button></div>`; }
    if (k === 'v5reler') { const n = v5Paws(e), y = String(e.finishedAt || '').slice(0, 4), yr = todayISO().slice(0, 4);
      return `${v5hd(e, 'Ler de novo', `${esc(e.title)}${y ? ' · lido em ' + y : ''}${n ? ' · nota ' + String(n).replace('.', ',') : ''}`)}
      <p class="mut" style="margin:10px 0 0">A leitura anterior fica guardada no histórico, com nota, datas e trechos. Esta começa da página 1 e aparece como <b>${(e.rereading || 0) + 2}ª leitura</b>.</p>
      <div class="lbl">Edição</div>
      <div class="list"><div class="li rp on"><span class="rd2"></span><span class="t">A mesma<small>${e.totalPages ? e.totalPages + ' páginas' : 'páginas da edição atual'}</small></span></div>${v5li('sheet', 'pag', 'Outra edição', 'capa e páginas da que você vai ler agora', ' data-s="v5edicao"')}</div>
      <label class="tog" style="margin-top:12px"><input type="checkbox" id="v5rlmeta" checked><span></span>Contar na meta de ${yr}<small>vale como mais um livro lido quando terminar</small></label>
      <button class="btn p w" data-a="v5relerok" style="margin-top:14px">Começar releitura</button>`; }
    if (k === 'v5edicao') { const f = e.format || 'FISICO', am = Number(e.audioMin) || 0;
      return `<h3>Trocar edição</h3><p class="mut" style="margin:0 0 6px">Muda capa, páginas e formato só para você. Nota, trechos e ecos continuam; a página em que você está é recalculada.</p>
      <div class="list">${v5li('v5edbusca', 'busca', 'Procurar outra edição', 'capa, páginas e idioma de outra edição')}</div>
      <div class="v5f"><label>Total de páginas<input class="fld" id="v5edpg" type="number" inputmode="numeric" min="1" value="${e.totalPages || ''}"></label></div>
      <div class="lbl">Formato</div><div class="chips" style="flex-wrap:wrap;margin:0">${[['FISICO', 'Livro físico'], ['EBOOK', 'E-book'], ['AUDIO', 'Audiolivro']].map(([k2, n]) => `<button class="chip ${f === k2 ? 'on' : ''}" data-a="v5edfmt" data-k="${k2}">${n}</button>`).join('')}</div>
      <div id="v5edaud" ${f === 'AUDIO' ? '' : 'hidden'}><div class="lbl">Duração do audiolivro</div><div class="v5f2"><label class="v5f">horas<input class="fld" id="v5edh" type="number" inputmode="numeric" min="0" value="${am ? Math.floor(am / 60) : ''}"></label><label class="v5f">minutos<input class="fld" id="v5edm" type="number" inputmode="numeric" min="0" max="59" value="${am ? am % 60 : ''}"></label></div><small class="mut" style="display:block;margin-top:4px">Com a duração, o Atualizar aceita o tempo ouvido.</small></div>
      <button class="btn p w" data-a="v5edok" style="margin-top:14px">Salvar</button>`; }
    if (k === 'v5share') return `${v5hd(e, 'Compartilhar', esc(e.title))}<div class="list">${v5li('v5indicar', 'send', 'Indicar a uma amizade', 'vai como recado para a pessoa')}${v4On('comunidade') ? v5li('v5postar', 'reply', 'Postar na Comunidade', 'comentário, trecho ou pergunta sobre o livro') : ''}${v5li('v5copiar', 'quote', 'Copiar título e autor', '')}</div>`;
    if (k === 'v5add') return `<h3>Adicionar livro</h3><div class="list">${v5li('v5busca', 'busca', 'Buscar livro', 'título, autor ou ISBN')}${v5li('v5scan', 'scan', 'Ler código de barras', '')}${v5li('v5manual', 'pen', 'Cadastrar à mão', 'quando não acha')}${v5li('v5hist', 'up', 'Trazer meu histórico', 'de outro app de leitura ou montar à mão')}</div>`;
    if (k === 'v5shsort') return `<h3>Ordenar estantes</h3><div class="list">${V5ORD.map(([o, t, sm]) => `<button class="li" data-a="v5shord" data-k="${o}"><span class="t">${t}<small>${sm}</small></span>${(v5P().shOrd || 'mine') === o ? v4ic('ok', 20) : ''}</button>`).join('')}</div>
      <button class="btn s w" data-a="v5shed" style="margin-top:10px">${v4ic('sort', 16)}Organizar (mudar a ordem)</button>`;
    if (k === 'v5shm') { const s = v5Shelves().find((x) => x.id === c.sh); if (!s) return '';
      if (s.arch) return `<h3>${esc(s.name)}</h3><div class="list">${v5li('v5unarch', 'save', 'Desarquivar', 'volta para a lista')}${v5li('v5shdel', 'trash', 'Excluir estante', 'os livros continuam em Livros', '', 'dng')}</div>`;
      return `<h3>${esc(s.name)}</h3><div class="list">${v5li('v5shlot', 'orb', 'Sortear desta estante', 'um cometa escolhe o próximo')}${v5li('v5shadd', 'plus', 'Adicionar livros', 'escolha vários dos seus livros de uma vez')}${v5li('v5shedit', 'pen', 'Editar estante', 'nome, cor, descrição e meta')}
      <div class="lbl" style="margin:10px 4px 4px">Quem vê</div><div class="seg" style="margin:0 0 6px"><button class="${s.priv ? '' : 'on'}" data-a="v5priv" data-k="0">Pública no perfil</button><button class="${s.priv ? 'on' : ''}" data-a="v5priv" data-k="1">Só você</button></div>
      ${v5li('sheet', 'estante', s.grp ? 'Trocar de grupo' : 'Colocar num grupo', s.grp ? 'agora em ' + esc(s.grp) : 'ex.: 2026 mês a mês, Clube do livro', ' data-s="v5shgrp"')}${s.grp ? v5li('v5ungrp', 'x', 'Tirar do grupo', 'volta solta para a lista') : ''}
      ${v5li('v5arch', 'save', 'Arquivar', 'some da lista e de "adicionar à estante"; livros e números ficam')}${v5li('v5shdel', 'trash', 'Excluir estante', 'os livros continuam em Livros', '', 'dng')}</div>`; }
    if (k === 'v5shgrp') { const s = v5Shelves().find((x) => x.id === c.sh); const G = [...new Set(v5Shelves().map((x) => x.grp).filter(Boolean))];
      return `<h3>Colocar num grupo</h3><p class="mut" style="margin:0 0 8px">Biblioteca junta várias estantes, como "2026 mês a mês".</p><div class="list">${G.map((g) => `<button class="li rp${s && s.grp === g ? ' on' : ''}" data-a="v5setgrp" data-g="${esc(g)}"><span class="rd2"></span><span class="t">${esc(g)}</span></button>`).join('')}</div>
      <div class="v5f"><label>Novo grupo<input class="fld" id="v5grpnm" maxlength="40" placeholder="Ex.: Clube do livro"></label></div><button class="btn p w" data-a="v5setgrp" data-g="" style="margin-top:10px">Criar e colocar</button>`; }
    if (k === 'v5grpm') { const g = c.grp; return `<h3>${esc(g)}</h3><div class="list">${v5li('v5grpren', 'pen', 'Renomear grupo', '')}${v5li('v5newsh', 'plus', 'Nova estante neste grupo', 'ex.: Dezembro', ` data-g="${esc(g)}"`)}${v5li('v5grparch', 'save', 'Arquivar o grupo inteiro', 'some da lista; livros e números ficam')}${v5li('v5grpundo', 'x', 'Desfazer grupo', 'as estantes voltam soltas para a lista')}</div>
      <div class="v5f" id="v5grprenw" hidden><label>Novo nome<input class="fld" id="v5grpren" maxlength="40" value="${esc(g)}"></label><button class="btn p w" data-a="v5grprenok">Salvar nome</button></div>`; }
    if (k === 'v5sorteio') { const src = c.src || 'QUERO', O = [['QUERO', 'Quero ler', plural(lib().filter((x) => x.status === 'QUERO').length, 'livro', 'livros')], ...v5Shelves().filter((s) => !s.arch && (s.bookIds || []).length).map((s) => [s.id, s.name, plural((s.bookIds || []).length, 'livro', 'livros')])];
      return `<h3>Sortear o próximo</h3><p class="mut" style="margin:0 0 6px">Um cometa cai e mostra o livro. Se não gostar, sorteia de novo.</p>
      <div class="list">${O.map(([k2, l, sm]) => `<button class="li rp${src === k2 ? ' on' : ''}" data-a="v5lotsrc" data-k="${esc(k2)}"><span class="rd2"></span><span class="t">${esc(l)}<small>${sm}</small></span></button>`).join('')}</div>
      <button class="btn p w" data-a="v5cmt" style="margin-top:12px">${v4ic('orb', 18)}Lançar o cometa</button>`; }
    if (k === 'v5tqsort') return `<h3>Organizar trechos</h3><div class="list">${[['livro', 'Por livro', 'cada livro com os seus trechos'], ['sent', 'Por sentimento', 'Me prendeu, Chorei, Reviravolta…'], ['rec', 'Mais recentes', 'uma lista só, do último salvo']].map(([g, n, sm]) => `<button class="li" data-a="v5tqg" data-k="${g}"><span class="t">${n}<small>${sm}</small></span>${(v5S().tqG || 'livro') === g ? v4ic('ok', 20) : ''}</button>`).join('')}</div>
      <p class="mut" style="margin:10px 0 0">Os filtros de cima são as categorias. Categorias e sentimentos são uma lista fixa, para dar para comparar entre leitores.</p>`;
    if (k === 'v5tqm') { const x = v5Q(c.q); if (!x) return '';
      return `<div class="sh-bk"><div><h3 style="font-size:16px">"${esc(x.q.t.slice(0, 140))}${x.q.t.length > 140 ? '…' : ''}"</h3><span class="mut">${esc(x.e.title)}${x.q.p ? ' · pág. ' + x.q.p : ''}</span></div></div><div class="list">
      ${v5li('v5tqsel', 'ok', 'Selecionar vários', 'para mudar categoria, copiar ou excluir de uma vez')}${v5li('v5tqedit', 'pen', 'Editar', 'texto, página, categoria, sentimentos e nota')}${v5li('v5tqcopy', 'quote', 'Copiar texto', '')}${v5li('v5tqbook', 'estante', 'Ir para o livro', esc(x.e.title))}${v5li('v5tqdel', 'trash', 'Excluir trecho', '', '', 'dng')}</div>`; }
    if (k === 'v5tqcat') { const n = (v5S().sel || []).length; return `<h3>Organizar ${plural(n, 'trecho', 'trechos')}</h3><div class="lbl">Categoria</div><div class="list">${V5PROP.map(([k2, t, sm]) => `<button class="li" data-a="v5tqsetcat" data-k="${k2}"><span class="t">${t}<small>${sm}</small></span></button>`).join('')}<button class="li" data-a="v5tqsetcat" data-k=""><span class="t">Sem categoria</span></button></div>`; }
    if (k === 'v5tqnew') return v5TqFormHTML();
    if (k === 'v5tqpick') { const L = lib().slice().sort((a, b) => (a.status === 'LENDO' ? 0 : 1) - (b.status === 'LENDO' ? 0 : 1)).slice(0, 40);
      return `<h3>De qual livro?</h3><div class="list">${L.map((x) => `<button class="li" data-a="v5tqsetbk" data-id="${esc(x.id)}">${v4cv(x, '', 'width:30px;height:45px;font-size:6px;')}<span class="t">${esc(x.title)}<small>${V5ST[x.status] || ''}</small></span></button>`).join('')}</div>`; }
    if (k === 'v5removed') { v5Purge(); const L = (db.removed || []).slice().reverse();
      return `<h3>Removidos recentemente</h3><p class="mut" style="margin:0 0 8px">Ficam aqui por 30 dias, com tudo o que tinham. Depois somem de vez.</p>
      <div class="list">${L.length ? L.map((r) => { const left = Math.max(1, 30 - Math.floor((Date.now() - new Date(r.at).getTime()) / 864e5)); return `<div class="li v5rm">${v4cv(r.e, '', 'width:30px;height:45px;font-size:6px;')}<span class="t">${esc(r.e.title)}<small>${V5ST[r.e.status] || ''} · some em ${plural(left, 'dia', 'dias')}</small></span><button class="btn s" data-a="v5restore" data-id="${esc(r.e.id)}">Restaurar</button></div>`; }).join('') : '<p class="mut">Nada por aqui.</p>'}</div>`; }
  } catch (err) { console.warn('folha v5', k, err); }
  return '';
};
function v5TqFormHTML() {
  const st = v4State(), F = st.v5tq || (st.v5tq = v5TqInit()), e = v5Book(F.eid), L = F.more ? QT_PICK : QT_GROUPS[0][1].concat(QT_PICK.filter((y) => F.f.includes(y[0]) && !QT_GROUPS[0][1].some((z) => z[0] === y[0])));
  return `<h3>${F.i >= 0 ? 'Editar trecho' : 'Novo trecho'}</h3>
  ${e ? `<button class="li" data-a="sheet" data-s="v5tqpick" style="padding-top:0">${v4cv(e, '', 'width:30px;height:45px;font-size:6px;')}<span class="t">${esc(e.title)}<small>${F.i >= 0 ? 'trocar o livro' : 'trocar'}</small></span></button>` : `<button class="li" data-a="sheet" data-s="v5tqpick">${v4ic('estante', 20)}<span class="t">Escolher o livro</span></button>`}
  <textarea class="fld" id="v5tqt" rows="3" maxlength="600" placeholder="Digite o trecho ou cole aqui">${esc(F.t)}</textarea>
  <div class="row" style="gap:8px;align-items:center;margin-top:6px"><button class="lnk" style="text-decoration:none" data-a="v5tqfoto">${v4ic('scan', 16)} Fotografar a página</button><label style="margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;color:var(--ink2)">pág.<input class="fld" id="v5tqp" type="number" inputmode="numeric" min="1" style="width:84px;padding:7px 9px" value="${F.p || ''}"></label></div>
  <div id="v5tqocr" class="ocrw"></div>
  <div class="lbl">Categoria</div><div class="chips" style="flex-wrap:wrap;margin:0;padding:2px 0">${V5PROP.map(([k, n]) => `<button class="chip ${F.c === k ? 'on' : ''}" data-a="v5tqc" data-k="${k}">${n}</button>`).join('')}</div>
  ${F.c ? `<p class="mut" style="margin:6px 0 0;font-size:12px">${V5PROP.find((x) => x[0] === F.c)[2]}</p>` : ''}
  <div class="lbl lblrow"><span>Sentimento <small>(opcional, até 3)</small></span><button data-a="v5tqmais">${F.more ? 'ver menos' : 'ver todas'}</button></div><div class="chips" style="flex-wrap:wrap;margin:0;padding:2px 0">${L.map(([k, n]) => `<button class="chip ${F.f.includes(k) ? 'on' : ''}" data-a="v5tqfe" data-k="${k}">${esc(n)}</button>`).join('')}</div>
  <div class="lbl">Nota <small>(opcional, só você vê)</small></div><textarea class="fld" id="v5tqn" rows="2" maxlength="300" placeholder="O que você pensou">${esc(F.n)}</textarea>
  ${F.i < 0 && v4On('comunidade') ? `<button class="li" data-a="v5tqpub" style="margin-top:6px">${v4ic('send', 20)}<span class="t">Publicar na Comunidade<small>${F.pub ? (F.vis === 'friends' ? 'só amizades veem' : 'todo mundo vê') : 'fica só com você'}</small></span><span class="tg ${F.pub ? 'on' : ''}"></span></button>${F.pub ? `<div class="seg" style="margin-top:6px"><button class="${F.vis !== 'friends' ? 'on' : ''}" data-a="v5tqvis" data-k="public">Todos</button><button class="${F.vis === 'friends' ? 'on' : ''}" data-a="v5tqvis" data-k="friends">Só amizades</button></div>` : ''}` : ''}
  <button class="btn p w" data-a="v5tqsave" style="margin-top:14px">Salvar</button>`;
}
function v5TqInit(x) {
  if (x) return { eid: x.e.id, i: x.i, t: x.q.t || '', p: x.q.p || '', c: x.q.c || '', f: v5Fe(x.q), n: x.q.n || '', more: false };
  let cur = null; try { const R = reading(); cur = R && R.e; } catch {} cur = cur || lib().find((e) => e.status === 'LENDO') || lib()[0];
  return { eid: cur ? cur.id : null, i: -1, t: '', p: cur && cur.status === 'LENDO' ? libProgress(cur) || '' : '', c: '', f: [], n: '', more: false };
}
// ---------- removidos recentemente (30 dias) ----------
function v5Purge() { const lim = Date.now() - 30 * 864e5; const L = (db.removed || []).filter((r) => new Date(r.at).getTime() > lim); if (L.length !== (db.removed || []).length) { db.removed = L; v5Save(); } }
// "Tirar da fila" (Bia, 20/11): livro só na fila, sem trechos, anotações, diário nem exemplar, sai na hora, sem a folha do Remover.
// Usa o mesmo caminho do Remover (fica em Removidos recentemente); o toast "Desfazer" devolve o livro com a mesma prioridade e as mesmas estantes.
function v5FilaLivre(e) { const ex = e.ex || {}; return e.status === 'QUERO' && !(e.quotes || []).length && !(e.diary || []).length && !String(e.note || '').trim() && !(e.notes || []).length && (!ex.own || ex.own === 'quero') && !e.link; } // "Quero ter" (desejos) não conta como dado: volta junto no Desfazer
function v5TirarFila(e) { const t = e.title, id = e.id, i = db.library.indexOf(e); v5Remove(e);
  toast(`“${t}” saiu da fila`, { label: 'Desfazer', fn: () => { v5Restore(id); const k = db.library.findIndex((x) => x.id === id); if (k >= 0 && i >= 0 && k !== i) { const [x] = db.library.splice(k, 1); db.library.splice(Math.min(i, db.library.length), 0, x); v5Save(); try { refresh(); } catch {} v5Redraw(); } } }); }
function v5Remove(e) {
  if (e.link) return toast(`“${e.title}” faz parte de uma meta com prazo. Tire o livro da meta para remover.`);
  const sh = v5Shelves().filter((s) => (s.bookIds || []).includes(e.id)).map((s) => s.id);
  db.removed = [...(db.removed || []), { e: JSON.parse(JSON.stringify(e)), at: new Date().toISOString(), sh }].slice(-200);
  db.library = db.library.filter((x) => x !== e); v5Shelves().forEach((s) => { s.bookIds = (s.bookIds || []).filter((i) => i !== e.id); });
  if (T().nextId === e.id) T().nextId = null; if (T().currentId === e.id) T().currentId = null;
  v5Save(); try { refresh(); } catch {} v5Redraw();
  toast(`“${e.title}” saiu da Biblioteca`, { label: 'Desfazer', fn: () => v5Restore(e.id) });
}
function v5Restore(id) {
  const r = (db.removed || []).find((x) => String(x.e.id) === String(id)); if (!r) return;
  if (!lib().some((x) => x.id === r.e.id)) db.library.push(r.e);
  (r.sh || []).forEach((sid) => { const s = v5Shelves().find((x) => x.id === sid); if (s && !(s.bookIds || []).includes(r.e.id)) s.bookIds = [...(s.bookIds || []), r.e.id]; });
  db.removed = (db.removed || []).filter((x) => x !== r); v5Save(); try { refresh(); } catch {} v5Redraw(); toast(`“${r.e.title}” voltou para a Biblioteca`);
}
// ---------- sorteio com cometa ----------
function v5Comet(src) {
  const st = v4State(); st.sheet = null; st.v5lot = src;
  const pool = (src === 'QUERO' ? lib().filter((x) => x.status === 'QUERO') : v5ShBooks(v5Shelves().find((s) => s.id === src) || {}).filter((x) => x.status !== 'LIDO')).filter((x) => x.id !== st.v5last);
  const all = pool.length ? pool : (src === 'QUERO' ? lib().filter((x) => x.status === 'QUERO') : v5ShBooks(v5Shelves().find((s) => s.id === src) || {}));
  if (!all.length) { v5SheetClose(); return toast('Nada para sortear aqui ainda'); }
  const e = all[Math.floor(Math.random() * all.length)]; st.v5last = e.id;
  const R = v5Arm(v4Root()); R.innerHTML = '';
  const sky = Array.from({ length: 34 }, (_, i) => `<i style="left:${(i * 37) % 100}%;top:${(i * 53) % 100}%;animation-delay:${(i % 7) * 0.4}s"></i>`).join('');
  const nm = src === 'QUERO' ? 'Do seu Quero ler' : 'Da estante ' + esc((v5Shelves().find((s) => s.id === src) || {}).name || '');
  R.innerHTML = `<div class="cmt" role="dialog" aria-label="Sorteio"><div class="sky2">${sky}</div><button class="ib cx" data-a="x" aria-label="Fechar">${v4ic('x', 20)}</button><span class="co"></span><span class="fl"></span>
  <div class="rv"><span class="eb acc">${nm}</span>${v4cv(e)}<h2>${esc(e.title)}</h2><span class="mut">${esc(e.author || '')}</span>
  <div class="acts2"><button class="btn p" data-a="v5lotstart" data-id="${esc(e.id)}">${v4ic('ler', 18)}Começar a ler</button><button class="btn s" data-a="v5cmt" data-k="${esc(src)}">Sortear de novo</button>${v4On('comunidade') ? `<button class="btn s" data-a="v5lotjunto" data-id="${esc(e.id)}">Convidar alguém para ler junto</button>` : ''}</div></div></div>`;
}
// ---------- toques da aba ----------
function v5Click(ev) { 
  const r = ev.currentTarget; if (r.dataset.longAt && Date.now() - Number(r.dataset.longAt) < 700) { ev.preventDefault(); ev.stopPropagation(); return; }
  const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a, d = b.dataset, S5 = v5S(), P = ESN();
  const go = () => v5Redraw();
  if (a === 'sheet') { const ctx = {}; if (d.g) ctx.grp = d.g; if (d.s === 'v5tqnew') v4State().v5tq = v5TqInit(); return v5Sheet(d.s, ctx); }
  if (a === 'v5tab') { S5.tab = d.k; S5.sel = null; S5.sub = null; return go(); }
  if (a === 'v5st') { P.st = d.k; P.tab = 'bib'; v5Save(); return go(); }
  if (a === 'v5filt') return esnFilterSheet(go);
  if (a === 'v5clr') { P[d.k] = ''; v5Save(); return go(); }
  if (a === 'v5clrall') { Object.assign(P, { st: 'ALL', nota: '', fmt: '', gen: '', own: '' }); v5Save(); return go(); }
  if (a === 'v5tip') { v5P()[d.k] = 1; v5Save(); return go(); }
  if (a === 'v5fix') { try { openFixReads(); } catch {} return; }
  if (a === 'v5book') { const e = v5Book(d.id); if (e) openBookPage(e); return; }
  if (a === 'v5newsh') { const g = d.g; const n0 = v5Shelves().length; try { shelfEditForm(); } catch { newEstante(); } if (g) { const t = setInterval(() => { if (v5Shelves().length > n0) { clearInterval(t); v5Shelves()[v5Shelves().length - 1].grp = g; v5Save(); go(); } }, 400); setTimeout(() => clearInterval(t), 60000); } return; }
  if (a === 'v5shopen') { try { openShelfV3('sh:' + d.id); } catch {} return; }
  if (a === 'v5grp') { S5.sub = { k: 'grp', g: d.g }; return go(); }
  if (a === 'v5arq') { S5.sub = { k: 'arq' }; return go(); }
  if (a === 'v5back') { S5.sub = null; return go(); }
  if (a === 'v5shed') { S5.shEd = !S5.shEd; return go(); }
  if (a === 'v5up' || a === 'v5dn') { ev.stopPropagation(); const L = v5Shelves(), i = L.findIndex((s) => s.id === d.id), j = a === 'v5up' ? i - 1 : i + 1; if (i < 0 || j < 0 || j >= L.length) return; [L[i], L[j]] = [L[j], L[i]]; v5P().shOrd = 'mine'; v5Save(); return go(); }
  if (a === 'v5tqf') { S5.tqF = d.k; return go(); }
  if (a === 'v5tqmore') { S5.tqOpen = d.id; return go(); }
  if (a === 'v5tqshow') { S5.show = [...S5.show, d.q]; return go(); }
  if (a === 'v5tqtog') return v5TqTog(d.q);
  if (a === 'v5tqopen') { const x = v5Q(d.q); if (!x) return; v4State().v5tq = v5TqInit(x); return v5Sheet('v5tqnew', {}); }
  if (a === 'v5sel0') { S5.sel = null; return go(); }
  if (a === 'v5selcopy') { const t = (S5.sel || []).map(v5Q).filter(Boolean).map((x) => `"${x.q.t}" (${x.e.title}${x.q.p ? ', pág. ' + x.q.p : ''})`).join('\n\n'); try { navigator.clipboard.writeText(t); toast('Trechos copiados'); } catch { toast('Não consegui copiar'); } return; }
  if (a === 'v5seldel') { const ks = (S5.sel || []).map(v5Q).filter(Boolean); if (!ks.length) return; withUndo(`${plural(ks.length, 'trecho excluído', 'trechos excluídos')}`, () => { const by = new Map(); ks.forEach((x) => { by.set(x.e, [...(by.get(x.e) || []), x.i]); }); by.forEach((idx, e) => { e.quotes = (e.quotes || []).filter((_, i) => !idx.includes(i)); }); v5Save(); }); S5.sel = null; return go(); }
}
// ---------- toques da camada V4 (folhas e cometa) ----------
// a camada V4 pode já existir com o ouvinte antigo; o nosso entra em captura e só age nas ações v5
function v5Arm(R) { if (!R) return R; try { const sr = R.getRootNode(); if (sr && sr.querySelector && !sr.querySelector('style[data-v5]')) { const st = document.createElement('style'); st.dataset.v5 = 1; st.textContent = V5CSS; sr.append(st); } } catch {} if (R.dataset.v5) return R; R.dataset.v5 = 1; R.addEventListener('click', v5V4Click, true); R.addEventListener('input', v5V4Input, true); return R; }
function v5V4Click(ev) {
  const b = ev.target.closest('[data-a]'); const a = b && b.dataset.a;
  if (!a || !(a.startsWith('v5') || (a === 'sheet' && String(b.dataset.s).startsWith('v5')))) return;
  ev.stopPropagation();
  const st = v4State(), d = b.dataset, c = st.v5 || {}, e = lib().find((x) => x.id === st.sheetE) || c.e || null, S5 = v5S();
  const done = (msg) => { v5SheetClose(); try { refresh(); } catch {} v5Redraw(); if (msg) toast(msg); };
  const ext = (fn) => { v5SheetClose(); setTimeout(() => { try { fn(); } catch (err) { console.warn('menu do livro', err); } }, 30); };
  if (a === 'sheet') { if (d.s === 'v5tqnew' && !st.v5tq) st.v5tq = v5TqInit(); if (d.g) st.v5 = { ...c, grp: d.g }; st.sheet = d.s; return v4Draw(); }
  // menu do livro
  if (a === 'v5more') { st.v5more = !st.v5more; return v4Draw(); }
  if (a === 'v5open') return ext(() => openBookPage(e));
  if (a === 'v5upd') { st.sheet = 'upd'; st.sheetE = e.id; st.e = st.e || e.id; v4UpdInit(); return v4Draw(); }
  if (a === 'v5fim') return ext(() => v4FimOpen(e));
  if (a === 'v5junto') return ext(() => inviteBuddy(e));
  if (a === 'v5prazo') return ext(() => dueSheet(e));
  // Começar/Retomar: fecha a camada inteira antes (a pergunta "Ler os dois / Trocar" abre por baixo dela e parecia que nada acontecia; reteste M3)
  if (a === 'v5start') { st.sheet = null; st.view = null; try { v4Close(); } catch {} setTimeout(() => { try { startReading(e); } catch (err) { console.warn('menu do livro', err); } }, 30); return; }
  if (a === 'v5prio') return ext(() => prioSheet(e));
  if (a === 'v5retro') return ext(() => openRetro(e));
  if (a === 'v5lend') return ext(() => exSheet(e, 'loan'));
  if (a === 'v5buy') return ext(() => whereToBuy(e));
  if (a === 'v5covmod') return ext(() => modCoverSheet(e));
  if (a === 'v5shelves') return ext(() => moveToShelf(e));
  if (a === 'v5fila') { withUndo(`“${e.title}” voltou para Quero ler`, () => { setLibStatus(e, 'QUERO'); v5Save(); }); return done(); }
  if (a === 'v5pause') { withUndo(`Pausado na pág. ${libProgress(e)}`, () => { if (e.dueAt) { e.dueOff = e.dueAt; delete e.dueAt; } setLibStatus(e, 'HIBERNANDO'); v5Save(); }); return done(); }
  if (a === 'v5aband') { withUndo(`“${e.title}” foi para Abandonados`, () => { delete e.dueAt; setLibStatus(e, 'ABANDONEI'); if (e.status === 'ABANDONEI') e.abandonedAt = e.abandonedAt || todayISO(); v5Save(); }); return done(); }
  if (a === 'v5engano') { withUndo(`“${e.title}” voltou para Quero ler`, () => { setLibStatus(e, 'QUERO'); if (e.status === 'QUERO') { e.currentPage = 0; delete e.startedAt; delete e.dueAt; } v5Save(); }); return done(); }
  if (a === 'v5ul_lendo') { withUndo(`“${e.title}” voltou para Lendo`, () => { setLibStatus(e, 'LENDO'); v5Save(); }); return done(); }
  if (a === 'v5ul_meio') { withUndo(`“${e.title}” foi para Pausados`, () => { setLibStatus(e, 'HIBERNANDO'); v5Save(); }); return done(); }
  if (a === 'v5ul_nada') { withUndo(`“${e.title}” voltou para Quero ler`, () => { setLibStatus(e, 'QUERO'); if (e.status === 'QUERO') { e.currentPage = 0; delete e.startedAt; } v5Save(); }); return done(); }
  if (a === 'v5rmok') { v5SheetClose(); return v5Remove(e); }
  if (a === 'v5tirafila') { v5SheetClose(); return v5TirarFila(e); }
  if (a === 'v5restore') { v5Restore(d.id); return v4Draw(); }
  if (a === 'v5relerok') { const meta = !!(V4 && V4.querySelector('#v5rlmeta') && V4.querySelector('#v5rlmeta').checked);
    e.reads = [...(e.reads || []), { startedAt: e.startedAt || null, finishedAt: e.finishedAt || null, pages: e.totalPages || null }];
    e.status = 'LENDO'; e.startedAt = todayISO(); delete e.finishedAt; e.currentPage = 0; e.rereading = (e.rereading || 0) + 1; if (!meta) e.rereadNoGoal = 1; else delete e.rereadNoGoal;
    v5Save(); try { setCurrent(e.id); } catch {} return done(`Releitura começou: ${e.rereading + 1}ª leitura de “${e.title}”`); }
  if (a === 'v5edbusca') return ext(() => changeEdition(e));
  if (a === 'v5edfmt') { V4.querySelectorAll('[data-a=v5edfmt]').forEach((x) => x.classList.toggle('on', x === b)); const w = V4.querySelector('#v5edaud'); if (w) w.hidden = d.k !== 'AUDIO'; st.v5fmt = d.k; return; }
  if (a === 'v5edok') { const n = Math.round(Number((V4.querySelector('#v5edpg') || {}).value)); const f = st.v5fmt || e.format || 'FISICO';
    if (n > 0) { if (libProgress(e) > n) return toast(`Essa edição tem ${n} páginas e você já está na ${libProgress(e)}`); e.totalPages = n; }
    e.format = f; if (f === 'AUDIO') { const h = Number((V4.querySelector('#v5edh') || {}).value) || 0, m = Number((V4.querySelector('#v5edm') || {}).value) || 0; const t = h * 60 + m; if (t > 0) e.audioMin = t; } st.v5fmt = null;
    v5Save(); return done('Edição salva'); }
  if (a === 'v5indicar') return ext(() => recommendToFriend(e));
  if (a === 'v5postar') return ext(() => openRdComposer({ book: { title: e.title, author: e.author || null, cover: e.cover || null } }));
  if (a === 'v5copiar') { try { navigator.clipboard.writeText(e.title + (e.author ? ' — ' + e.author : '')); toast('Copiado'); } catch { toast('Não consegui copiar'); } return v5SheetClose(); }
  // adicionar
  if (a === 'v5busca') return ext(() => openCatalog());
  if (a === 'v5scan') return ext(() => scanIsbn());
  if (a === 'v5manual') return ext(() => manualBookSheet((it) => { try { addToLibrary(it, null, 'QUERO'); } catch {} v5Redraw(); }));
  if (a === 'v5hist') return ext(() => openHistLeituras());
  // estantes
  const sh = v5Shelves().find((x) => x.id === c.sh);
  if (a === 'v5shord') { v5P().shOrd = d.k; v5Save(); return done(); }
  if (a === 'v5shed') { S5.shEd = true; S5.tab = 'estantes'; return done(); }
  if (a === 'v5shlot') return v5Comet(sh.id);
  if (a === 'v5shadd') return ext(() => pickBooksFor(sh, () => v5Redraw()));
  if (a === 'v5shedit') return ext(() => shelfEditForm(sh));
  if (a === 'v5priv') { sh.priv = d.k === '1' ? 1 : undefined; if (!sh.priv) delete sh.priv; v5Save(); try { publishSnapshotSoon(); } catch { try { publishSnapshot(); } catch {} } v5Redraw(); toast(sh.priv ? 'Só você vê esta estante' : 'Estante pública no seu perfil'); return v4Draw(); }
  if (a === 'v5arch') { sh.arch = 1; v5Save(); try { publishSnapshotSoon(); } catch {} return done(`“${sh.name}” foi para Arquivadas`); }
  if (a === 'v5unarch') { delete sh.arch; v5Save(); return done(`“${sh.name}” voltou para a lista`); }
  if (a === 'v5shdel') { const nm = sh.name; withUndo(`Estante “${nm}” excluída`, () => { db.shelves = v5Shelves().filter((x) => x !== sh); v5Save(); }); return done(); }
  if (a === 'v5ungrp') { delete sh.grp; v5Save(); return done(); }
  if (a === 'v5setgrp') { const g = d.g || String((V4.querySelector('#v5grpnm') || {}).value || '').trim().slice(0, 40); if (!g) return toast('Dê um nome ao grupo'); sh.grp = g; v5Save(); return done(`“${sh.name}” está em ${g}`); }
  if (a === 'v5grpren') { const w = V4.querySelector('#v5grprenw'); if (w) w.hidden = false; return; }
  if (a === 'v5grprenok') { const g = c.grp, n = String((V4.querySelector('#v5grpren') || {}).value || '').trim().slice(0, 40); if (!n) return; v5Shelves().forEach((s) => { if (s.grp === g) s.grp = n; }); if (S5.sub && S5.sub.g === g) S5.sub.g = n; v5Save(); return done(); }
  if (a === 'v5grparch') { v5Shelves().forEach((s) => { if (s.grp === c.grp) s.arch = 1; }); S5.sub = null; v5Save(); return done(`Biblioteca ${c.grp} arquivada`); }
  if (a === 'v5grpundo') { v5Shelves().forEach((s) => { if (s.grp === c.grp) delete s.grp; }); S5.sub = null; v5Save(); return done(); }
  if (a === 'v5newsh') { const g = d.g; v5SheetClose(); const n0 = v5Shelves().length; try { shelfEditForm(); } catch { newEstante(); } if (g) { const t = setInterval(() => { if (v5Shelves().length > n0) { clearInterval(t); v5Shelves()[v5Shelves().length - 1].grp = g; v5Save(); v5Redraw(); } }, 400); setTimeout(() => clearInterval(t), 60000); } return; }
  if (a === 'v5lotsrc') { st.v5 = { ...c, src: d.k }; V4.querySelectorAll('[data-a=v5lotsrc]').forEach((x) => x.classList.toggle('on', x === b)); return; }
  if (a === 'v5cmt') return v5Comet(d.k || c.src || 'QUERO');
  if (a === 'v5lotstart') { const x = v5Book(d.id); v4Close(); if (x) try { startReading(x); } catch {} return; }
  if (a === 'v5lotjunto') { const x = v5Book(d.id); v4Close(); if (x) try { inviteBuddy(x); } catch {} return; }
  // trechos
  const x = v5Q(c.q);
  if (a === 'v5tqg') { S5.tqG = d.k; return done(); }
  if (a === 'v5tqsel') { S5.sel = x ? [x.k] : []; S5.tab = 'trechos'; return done(); }
  if (a === 'v5tqedit') { st.v5tq = v5TqInit(x); st.sheet = 'v5tqnew'; return v4Draw(); }
  if (a === 'v5tqcopy') { try { navigator.clipboard.writeText(`"${x.q.t}" (${x.e.title}${x.q.p ? ', pág. ' + x.q.p : ''})`); toast('Trecho copiado'); } catch { toast('Não consegui copiar'); } return v5SheetClose(); }
  if (a === 'v5tqbook') return ext(() => openBookPage(x.e));
  if (a === 'v5tqdel') { withUndo('Trecho excluído', () => { x.e.quotes = (x.e.quotes || []).filter((_, i) => i !== x.i); v5Save(); }); return done(); }
  if (a === 'v5tqsetcat') { (S5.sel || []).map(v5Q).filter(Boolean).forEach((y) => { if (d.k) y.q.c = d.k; else delete y.q.c; }); S5.sel = null; v5Save(); return done('Trechos organizados'); }
  const F = st.v5tq || (st.v5tq = v5TqInit());
  if (a === 'v5tqsetbk') { F.eid = d.id; if (F.i < 0) { const bk = v5Book(d.id); F.p = bk && bk.status === 'LENDO' ? libProgress(bk) || '' : ''; } st.sheet = 'v5tqnew'; return v4Draw(); }
  if (a === 'v5tqc') { F.c = F.c === d.k ? '' : d.k; return v4Draw(); }
  if (a === 'v5tqmais') { F.more = !F.more; return v4Draw(); }
  if (a === 'v5tqpub') { F.pub = !F.pub; return v4Draw(); }
  if (a === 'v5tqvis') { F.vis = d.k; return v4Draw(); }
  if (a === 'v5tqfe') { const k = d.k; if (F.f.includes(k)) F.f = F.f.filter((y) => y !== k); else if (F.f.length < 3) F.f = [...F.f, k]; else return toast('Escolha até 3'); return v4Draw(); }
  if (a === 'v5tqfoto') { const w = (m) => { const o = V4 && V4.querySelector('#v5tqocr'); if (o) o.textContent = m || ''; };
    return v4PickPhoto(async (f) => { w('Lendo a foto…'); const t = await v4Ocr(f, w); w(t ? 'Pronto: o texto da foto entrou no trecho.' : 'Não consegui ler a foto.'); if (t) { F.t = (F.t ? F.t + ' ' : '') + t; const ta = V4 && V4.querySelector('#v5tqt'); if (ta) ta.value = F.t; } }); }
  if (a === 'v5tqsave') { const bk = v5Book(F.eid); if (!bk) return toast('Escolha o livro'); const t = String(F.t || '').trim(); if (!t) return toast('Digite o trecho');
    const q = { t: t.slice(0, 600), p: Number(F.p) || null, ...(F.c ? { c: F.c } : {}), ...(F.f.length ? { f: F.f.slice(0, 3) } : {}), ...(String(F.n || '').trim() ? { n: String(F.n).trim().slice(0, 300) } : {}) };
    if (F.i >= 0) { const src = v5Book(F.src || F.eid); const arr = (src && src.quotes) || []; const keep = arr[F.i]; q.at = (keep && keep.at) || new Date().toISOString(); if (src === bk) { bk.quotes[F.i] = q; } else { if (src) src.quotes = arr.filter((_, i) => i !== F.i); bk.quotes = [...(bk.quotes || []), q].slice(-200); } }
    else { q.at = new Date().toISOString(); bk.quotes = [...(bk.quotes || []), q].slice(-200);
      // publicar o trecho (só se a pessoa ligou; Bia, 20/11)
      if (F.pub && v4On('comunidade') && connected() && socialProfile) { let tot = 0, pg = Number(F.p) || 0; try { tot = v4Info(bk).total || 0; } catch {}
        sapi('POST', '/v1/posts', { kind: 'quote', text: '', quote: q.t.slice(0, 600), page: pg || null, visibility: F.vis === 'friends' ? 'friends' : 'public', ...(tot && pg ? { readerPct: Math.min(100, Math.round(pg / tot * 100)) } : {}), book: { title: String(bk.title).slice(0, 200), author: bk.author ? String(bk.author).slice(0, 120) : null, cover: /^https:\/\//.test(bk.cover || '') ? bk.cover : null } })
          .then((x) => { if (x.status === 201) toast(F.vis === 'friends' ? 'Trecho postado para suas amizades' : 'Trecho postado na Comunidade'); else if (x.status >= 400) toast('Trecho guardado (não deu para postar agora)'); }).catch(() => {}); } }
    st.v5tq = null; v5Save(); return done(F.i >= 0 ? 'Trecho salvo' : 'Trecho guardado'); }
}
function v5V4Input(ev) {
  const t = ev.target, st = v4State();
  if (t.id === 'v5tqt' || t.id === 'v5tqp' || t.id === 'v5tqn') { ev.stopPropagation(); const F = st.v5tq || (st.v5tq = v5TqInit()); if (t.id === 'v5tqt') F.t = t.value; else if (t.id === 'v5tqp') F.p = t.value; else F.n = t.value; }
}
// a edição de trecho guarda de qual livro veio (para mover entre livros sem duplicar)
{ const _ti = v5TqInit; v5TqInit = function (x) { const F = _ti(x); if (x) F.src = x.e.id; return F; }; }

// ---------- o menu do livro do app todo vira o do protótipo ----------
{ const _bq = bookQuickMenu; bookQuickMenu = function (anchor, b) { const e = (b && b.e) || (b && lib().find((x) => normT(x.title) === normT(b.title))); if (e && lib().includes(e)) return v5Menu(e); return _bq.apply(this, arguments); }; }
{ const _bo = bookMenuOpen; bookMenuOpen = function (anchor, b) { const e = (b && b.e) || (b && b.title && lib().find((x) => normT(x.title) === normT(b.title))); if (e && lib().includes(e)) return v5Menu(e); return _bo.apply(this, arguments); }; }
bookMenu = function (e) { if (e && lib().includes(e)) return v5Menu(e); };

// ---------- estante privada: some do perfil publicado ----------
{ const _ps = profShelvesSnap; profShelvesSnap = function (snapshot) { _ps.apply(this, arguments);
  try { const hide = new Set(v5Shelves().filter((s) => s.priv || s.arch).map((s) => 'sh:' + s.id)); if (snapshot && snapshot.shelf) { if (Array.isArray(snapshot.shelf.show)) snapshot.shelf.show = snapshot.shelf.show.filter((k) => !hide.has(k)); if (Array.isArray(snapshot.shelf.extra)) snapshot.shelf.extra = snapshot.shelf.extra.filter((x) => !hide.has(x.key)); } } catch {} }; }

// ---------- Ajustes › Removidos recentemente ----------
{ const _da = drawAjustes; drawAjustes = function (box) { const r = _da.apply(this, arguments);
  try { v5Purge(); const n = (db.removed || []).length, host = box || $('#lista'); if (S.ajMode === 'perfil') return r; // Editar perfil não mostra Removidos recentemente (fica só em Ajustes; Bia, 20/11)
    if (host && !host.querySelector('#aj-v5rm')) { const ref = host.querySelector('#aj-hl, #aj-tq, #aj-cv'); const card = ref ? ref.closest('.aj-card') : host.querySelector('.aj-card');
      if (card) { card.insertAdjacentHTML('beforeend', `<button type="button" class="aj-row" id="aj-v5rm"><span><b>Removidos recentemente</b><small>${n ? plural(n, 'livro', 'livros') + ' · voltam com tudo por 30 dias' : 'livros removidos voltam com tudo por 30 dias'}</small></span>›</button>`); host.querySelector('#aj-v5rm').addEventListener('click', () => v5Sheet('v5removed', {})); } } } catch (err) { console.warn('removidos', err); }
  return r; }; }

// ---------- topo: só regrava o título quando ele muda (o intervalo antigo regravava o mesmo texto a cada 1,5 s) ----------
{ const desc = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  const guard = () => { const t = $('#g-t'); if (!t || t.dataset.v5g) return; t.dataset.v5g = 1; Object.defineProperty(t, 'textContent', { configurable: true, get() { return desc.get.call(this); }, set(v) { if (desc.get.call(this) !== String(v)) desc.set.call(this, v); } }); };
  guard(); try { const _pg = paintGtop; paintGtop = function () { const r = _pg.apply(this, arguments); guard(); return r; }; } catch {} setTimeout(guard, 1500); }

// ---------- página do livro: ação principal + "•••" logo abaixo do topo; abas Sobre / Minha leitura / Comunidade ----------
// (Enredo fica dentro de Sobre, que já mostra os níveis; Meu exemplar e Onde comprar aparecem em Minha leitura)
{ const st = document.createElement('style'); st.textContent = `#shelflist .v5bpacts{display:flex;gap:8px;margin:0 0 12px}
#shelflist .v5bpacts .pri{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:16px;padding:12px 14px;font:inherit;font-weight:900;font-size:.95rem;background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 65%,#fff),var(--acc));color:var(--on-acc,#fff);box-shadow:0 6px 16px color-mix(in srgb,var(--acc) 30%,transparent);cursor:pointer}
#shelflist .v5bpacts .pri svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#shelflist .v5bpacts.solo{display:none}
#shelflist .bp-hero .v5hdots{position:absolute;top:.55rem;right:.55rem;z-index:2;width:38px;height:38px;border:1px solid var(--line);border-radius:12px;background:color-mix(in srgb,var(--panel) 85%,transparent);color:var(--ink);font:inherit;font-weight:900;font-size:1rem;line-height:1;cursor:pointer}
#shelflist .v5bpacts .dots{width:52px;border:1px solid var(--line);border-radius:16px;background:var(--panel);color:var(--ink);font:inherit;font-weight:900;font-size:1.1rem;cursor:pointer}
#shelflist.v5bp .bp-tabs [data-t=enredo],#shelflist.v5bp .sl-top .es-dots[data-a=menu]{display:none!important}
#shelflist.v5bp:not(.v5bp-minha) .bp-ex,#shelflist.v5bp:not(.v5bp-minha) .bp-buy{display:none!important}`; TR.append(st); }
{ let cur = null, tm = 0;
  const prim = (e) => e.status === 'LENDO' ? ['pag', 'Atualizar página'] : e.status === 'QUERO' ? ['ler', 'Começar a ler'] : e.status === 'LIDO' ? ['quote', 'Minha avaliação'] : e.status === 'HIBERNANDO' ? ['ler', 'Voltar a ler'] : ['ler', 'Voltar a ler']; // vocabulário (Bia, 20/11): um nome só
  const fix = () => { const v = $('#shelflist'); if (!v) return; const hero = v.querySelector('.bp-hero'), e = !cur ? null : lib().includes(cur) ? cur : (lib().find((x) => x.id === cur.id) || null); // a estante pode ser recarregada (sincronização, capa achada): acha o mesmo livro pelo id
    if (v.hidden || !hero || !e) { v.classList.remove('v5bp', 'v5bp-minha'); return; }
    v.classList.add('v5bp'); const on = v.querySelector('.bp-tabs [data-t].on, .bp-tabs [data-t][aria-selected="true"]'); const t = on ? on.dataset.t : 'sobre';
    if (t === 'enredo') { const s = v.querySelector('.bp-tabs [data-t=sobre]'); if (s) return s.click(); }
    v.classList.toggle('v5bp-minha', t === 'minha');
    // Minha leitura: a ordem dos cartões (inclusive Meu exemplar e Onde comprar) é do wm_v2_minha_leitura.js (Bia, 21/11)
    // lendo: sem "Atualizar página" na página do livro (Bia, 20/11); atualizar fica no Hoje e no Ler. Fica só o •••
    // lendo: o ••• vai para o canto do card do livro (a linha de ações fica vazia sem o Atualizar)
    let hd = hero.querySelector(':scope > .v5hdots');
    if (e.status === 'LENDO') { if (!hd || hd.dataset.k !== e.id) { if (hd) hd.remove(); hero.insertAdjacentHTML('beforeend', '<button type="button" class="v5hdots" aria-label="Mais opções do livro">•••</button>'); hd = hero.querySelector(':scope > .v5hdots'); hd.dataset.k = e.id; hd.addEventListener('click', () => v5Menu(e)); } }
    else if (hd) hd.remove();
    const [ic, lb] = prim(e); let row = v.querySelector('.v5bpacts');
    if (!row || row.dataset.k !== e.id + e.status) { if (row) row.remove(); const nc = hero.nextElementSibling && hero.nextElementSibling.classList.contains('v8nc') ? hero.nextElementSibling : hero; nc.insertAdjacentHTML('afterend', `<div class="v5bpacts${e.status === 'LENDO' ? ' solo' : ''}" data-k="${esc(e.id + e.status)}"><button type="button" class="pri" data-a="pri"><svg viewBox="0 0 24 24" aria-hidden="true">${V4ICON[ic] || ''}</svg>${lb}</button><button type="button" class="dots" data-a="more" aria-label="Mais opções do livro">•••</button></div>`); row = v.querySelector('.v5bpacts');
      row.querySelector('[data-a=more]').addEventListener('click', () => v5Menu(e));
      row.querySelector('[data-a=pri]').addEventListener('click', () => { try {
        if (e.status === 'LENDO') { const s4 = v4State(); s4.sheet = 'upd'; s4.sheetE = e.id; s4.e = s4.e || e.id; v4UpdInit(); v4Root(); v4Draw(); }
        else if (e.status === 'LIDO') v4FimOpen(e); else startReading(e); } catch (err) { console.warn('ação do livro', err); } }); } };
  const _ob = openBookPage; openBookPage = function (e) { cur = e; const r = _ob.apply(this, arguments); setTimeout(fix, 0); setTimeout(fix, 200); return r; };
  const v = $('#shelflist'); if (v) new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(fix, 60); }).observe(v, { childList: true, subtree: true, attributeFilter: ['hidden'] }); }
