// ===================== Estante livre (Bia, 22/11: aprovada no protótipo) =====================
// Na Prateleira (Biblioteca › Livros, Todos os livros), ao entrar no Organizar ou no Decorar a estante vira "livre":
// 1) arrastar direto da bandeja e da estante (dedo ou mouse), com livro fantasma, vão tracejado e vizinhos se afastando;
// 2) lugar primeiro, posição depois (painel junto do livro); 3) posição livre: grupos com espaço entre eles, aparadores,
// enfeites ocupam lugar; 4) nichos (Decorar › Estrutura), com fundo e luz por nicho; 5) bandeja compacta.
// Dados (estado já sincronizado, sem migração): shc().free = { st, rows: [{ dv: [frações], nb: [{ bg, lt }],
//   it: [{ u, t: 'b'|'p'|'d', id|ids|k, n: nicho, f: fração da largura do nicho, x: px (cache) }] }] }
// A posição que vale é a fração (f): a mesma estante abre igual no celular e no PC. Com filtro de status a estante
// volta à arrumação automática, sem mexer no que está salvo.
SHX_BKK.push('free');
SH_DEC.aparador = (s) => `<svg width="${20 * s}" height="${76 * s}" viewBox="0 0 20 76" aria-hidden="true"><defs><linearGradient id="bkap1" x1="0" x2="1"><stop offset="0" stop-color="#7a5a22"/><stop offset=".5" stop-color="#ecc874"/><stop offset="1" stop-color="#8a6526"/></linearGradient></defs><path d="M2 6c0-2 1-3 3-3h3c2 0 3 1 3 3v64h7v3H2z" fill="url(#bkap1)"/><path d="M6.5 24l1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.4L4 31.6l.6-2.8-2.1-1.9 2.8-.3z" fill="#fff3c4" opacity=".9"/><circle cx="6.5" cy="44" r="1.4" fill="#fff3c4" opacity=".7"/><circle cx="6.5" cy="52" r="1" fill="#fff3c4" opacity=".55"/><path d="M2 73h16" stroke="rgba(0,0,0,.3)"/></svg>`;
SH_DEC.aparadorD = (s) => `<span style="display:block;transform:scaleX(-1)">${SH_DEC.aparador(s)}</span>`;
SH_CAT.unshift(['aparador', 'Aparador (esquerda)'], ['aparadorD', 'Aparador (direita)']); SH_DN.aparador = 'Aparador (esquerda)'; SH_DN.aparadorD = 'Aparador (direita)'; SH_DH.aparador = SH_DH.aparadorD = 76; SH_DW.aparador = SH_DW.aparadorD = 20;
const FLX = { pk: null, pos: null, open: false, filt: false, ns: null, swap: null, D: null, swallow: 0, dkx: false, md: null };
let FL_MAIN = 0, FL_SR = null, FL_WB = 0, FL_BUSY = 0;
const FL_INS = 5, FL_SN = 6;
const FL_TPL = [['aberta', 'Aberta'], ['n2', '2 nichos'], ['n3', '3 nichos'], ['na', 'Nicho + aberto'], ['c2', 'Cubos 2×2'], ['c3', 'Cubos 3×3'], ['esc', 'Escada']];
const FL_NBG = [['', 'Igual à estante'], ['noite', 'Noite'], ['vinho', 'Vinho'], ['musgo', 'Musgo'], ['creme', 'Creme'], ['estrelas', 'Estrelas'], ['listras', 'Listras']];
const FL_NLT = [['0', 'Sem luz'], ['1', 'Spot quente'], ['2', 'Spot frio']];
function flTplDv(st, r) { switch (st) { case 'n2': case 'c2': return [0.5]; case 'n3': case 'c3': return [1 / 3, 2 / 3]; case 'na': return [0.42]; case 'esc': return [[0.62], [0.38], [0.3, 0.7], [0.55]][r % 4]; default: return []; } }
const flR = () => FL_SR || shBibRoot();
const flQ = (s) => { const r = flR(); return r ? r.querySelector(s) : null; };
const flQA = (s) => { const r = flR(); return r ? [...r.querySelectorAll(s)] : []; };
const flTgt = (ev) => { try { const p = ev.composedPath && ev.composedPath(); const t = p && p[0]; if (t && t.nodeType === 1) return t; if (t && t.parentElement) return t.parentElement; } catch {} return ev.target; };
// a estante livre vale só na Prateleira principal da Biblioteca, com Todos os livros
const flBase = () => { try { const S5 = v5S(); return S.tab === 'estante' && S5.tab === 'livros' && !S5.sub && shView() === 'prat' && shF() === 'todos' && !SHX_CTX && !SHX_VIS; } catch { return false; } };
const flWanted = () => flBase() && (SHX_MODE === 'org' || SHX_MODE === 'deco');
const flActive = () => flBase() && !!shc().free;
const flUid = () => 'u' + Math.random().toString(36).slice(2, 8);
const FLW_DEC = {};
function flDecW(k) { if (FLW_DEC[k]) return FLW_DEC[k]; let w = SH_DW[k] || 40; try { const m = String(SH_DEC[k](1, {})).match(/width="([\d.]+)"/); if (m) w = Math.ceil(+m[1]); } catch {} return (FLW_DEC[k] = w + 6); }
const flFace = (id) => { const b = shById(id), P = shc().pos || {}; return !!(b && P[id] === 'face' && b.img); };
function flW(it) { const P = shc().pos || {};
  if (it.t === 'd') return flDecW(it.k);
  if (it.t === 'p') { let m = 0; (it.ids || []).forEach((id) => { const b = shById(id); if (b) m = Math.max(m, Math.round(spnGeo(b, false).h * 0.86)); }); return m + 10; }
  const b = shById(it.id); if (!b) return 20; if (flFace(it.id)) return 98;
  const G = spnGeo(b, false); return G.w + (P[it.id] === 'lean' ? Math.ceil(G.h * 0.125) + 4 : 0) + 1; }
function flBW() { const br = flQ('.bsh:not(.sm) .brow'); const w = br ? br.clientWidth : 0; return Math.max(200, w || ((FL_WB || Math.min(480, innerWidth)) - 30)); }
const flBounds = (row) => [0, ...(row.dv || []), 1];
function flNW(row, n, BW) { const b = flBounds(row), li = n > 0 ? FL_INS : 0, ri = n < b.length - 2 ? FL_INS : 0; return Math.floor((b[n + 1] - b[n]) * BW - li - ri); }
const flNiches = (row) => (row.dv || []).length + 1;
// fração <-> px: a fração é o que fica salvo; o px é recalculado com a largura desta tela
let FL_HBW = 0; // largura usada para transformar fração em px (a mesma volta a valer ao salvar)
function flPx(F) { const BW = flBW(); FL_HBW = BW; (F.rows || []).forEach((row) => { row.it.forEach((o) => { if (o.f != null) o.x = Math.round(o.f * flNW(row, o.n || 0, BW)); else if (o.x == null) o.x = 0; }); }); }
function flFrac(F) { const BW = FL_HBW || flBW(); (F.rows || []).forEach((row) => { row.it.forEach((o) => { const NW = flNW(row, o.n || 0, BW); o.f = NW > 0 ? Math.round(Math.max(0, o.x || 0) / NW * 10000) / 10000 : 0; }); }); }
{ const _s = shSave; shSave = function () { try { const C0 = shc(); if (C0.free && !SHX_CTX) flFrac(C0.free); } catch (err) { console.warn('estante livre (fração)', err); } return _s.apply(this, arguments); }; }
// encaixa sem sobrepor: empurra para a direita e depois volta da borda direita; falso se não cabe
function flFit(its, NW) { let e = 0; its.forEach((o) => { o.x = Math.max(o.x, e); e = o.x + o.w; });
  let s = NW; for (let i = its.length - 1; i >= 0; i--) { its[i].x = Math.min(its[i].x, s - its[i].w); s = its[i].x; } return !its.length || its[0].x >= -0.5; }
// onde o bloco que está sendo movido cai: grade de 6 px, ímã de 12 px no vizinho, os outros abrem espaço
function flResolve(others, M, NW) { let x = Math.round(M.x / FL_SN) * FL_SN; x = Math.max(0, Math.min(NW - M.w, x));
  others.forEach((o) => { const e = o.x + o.w; if (Math.abs(x - e) < 12) x = e; if (Math.abs(x + M.w - o.x) < 12) x = o.x - M.w; });
  const m = { u: '__m', x, w: M.w }; const arr = others.map((o) => ({ ...o })).concat([m]).sort((a, z) => (a.x + a.w / 2) - (z.x + z.w / 2)), i0 = arr.indexOf(m);
  for (let i = i0 + 1; i < arr.length; i++) arr[i].x = Math.max(arr[i].x, arr[i - 1].x + arr[i - 1].w);
  for (let i = i0 - 1; i >= 0; i--) arr[i].x = Math.min(arr[i].x, arr[i + 1].x - arr[i].w);
  return flFit(arr, NW) ? arr : null; }
function flItems(r, n) { return shc().free.rows[r].it.filter((o) => (o.n || 0) === n).sort((a, z) => a.x - z.x); }
function flFind(u) { const F = shc().free; if (!F) return null; for (let r = 0; r < F.rows.length; r++) { const o = F.rows[r].it.find((x) => x.u === u); if (o) return { r, o }; } return null; }
function flGroupOf(r, u) { const L = flItems(r, flFind(u).o.n || 0), i = L.findIndex((o) => o.u === u); let a = i, z = i;
  while (a > 0 && L[a].x - (L[a - 1].x + flW(L[a - 1])) <= 2) a--; while (z < L.length - 1 && L[z + 1].x - (L[z].x + flW(L[z])) <= 2) z++; return L.slice(a, z + 1); }
const flStructOf = (F) => ({ st: F.st, rows: F.rows.map((r) => ({ dv: (r.dv || []).slice(), nb: JSON.parse(JSON.stringify(r.nb || [])) })) });
function flNewRow(F, rowsDef) { const r = F.rows.length, d = rowsDef && rowsDef[r]; F.rows.push({ dv: d ? d.dv.slice() : flTplDv(F.st, r), nb: d ? JSON.parse(JSON.stringify(d.nb || [])) : [], it: [] }); return F.rows[r]; }
// reorganiza tudo, na ordem de leitura, numa estrutura nova (os espaços entre grupos se fecham)
function flUnpile(all, maxW) { for (let i = 0; i < all.length; i++) { const o = all[i]; if (o.t === 'p' && flW(o) > maxW) { all.splice(i, 1, ...o.ids.map((id) => ({ u: flUid(), t: 'b', id, n: o.n, x: o.x }))); i += o.ids.length - 1; } } return all; }
function flReflow(F, st, rowsDef) { const BW = flBW(), all = []; F.rows.forEach((row) => { for (let n = 0; n < flNiches(row); n++) row.it.filter((o) => (o.n || 0) === n).sort((a, z) => a.x - z.x).forEach((o) => all.push(o)); });
  let minNW = 1e9; for (let r = 0; r < 4; r++) { const rw = { dv: rowsDef && rowsDef[r] ? rowsDef[r].dv : flTplDv(st, r) }; for (let n = 0; n < flNiches(rw); n++) minNW = Math.min(minNW, flNW(rw, n, BW)); } flUnpile(all, minNW);
  const nR = Math.max(3, F.rows.length); F.st = st; F.rows = []; let row = flNewRow(F, rowsDef), n = 0, cur = 0, NW = flNW(row, 0, BW);
  all.forEach((o) => { const w = flW(o); let g = 0; while (cur + w > NW && !(cur === 0 && w > NW) && g++ < 60) { if (n < flNiches(row) - 1) { n++; cur = 0; NW = flNW(row, n, BW); } else { row = flNewRow(F, rowsDef); n = 0; cur = 0; NW = flNW(row, 0, BW); } }
    o.n = n; o.x = cur; cur += w; row.it.push(o); });
  while (F.rows.length < nR) flNewRow(F, rowsDef); }
// nada sobra fora do nicho: o que não cabe passa para o começo do próximo
function flNormalize(F) { const BW = flBW();
  for (let r = 0; r < F.rows.length; r++) { const row = F.rows[r]; for (let n = 0; n < flNiches(row); n++) { let g = 0;
    while (g++ < 200) { const its = row.it.filter((o) => (o.n || 0) === n).sort((a, z) => a.x - z.x).map((o) => ({ o, x: o.x, w: flW(o) }));
      if (flFit(its, flNW(row, n, BW))) { its.forEach((q) => { q.o.x = Math.round(q.x); }); break; }
      if (its.length === 1) { const o = its[0].o; if (o.t === 'p') { row.it.splice(row.it.indexOf(o), 1, ...o.ids.map((id, j) => ({ u: flUid(), t: 'b', id, n, x: j }))); continue; } o.x = 0; break; }
      const last = its[its.length - 1].o; row.it.splice(row.it.indexOf(last), 1);
      let tr = row, tn = n + 1; if (tn >= flNiches(row)) { tr = F.rows[r + 1] || flNewRow(F); tn = 0; } last.n = tn; last.x = -1; tr.it.push(last); } } } }
// livro novo: fim do grupo mais à direita que tiver espaço, ou o primeiro vão; senão, prateleira nova
function flAdd(F, o) { const BW = flBW(), w = flW(o);
  for (const row of F.rows) for (let n = 0; n < flNiches(row); n++) { const NW = flNW(row, n, BW), its = row.it.filter((q) => (q.n || 0) === n).sort((a, z) => a.x - z.x);
    let prev = 0; const gaps = []; its.forEach((q) => { gaps.push([prev, q.x]); prev = q.x + flW(q); }); gaps.push([prev, NW]);
    const g = gaps.slice(1).concat(gaps.slice(0, 1)).find(([a, z]) => z - a >= w); if (g) { o.n = n; o.x = Math.round(g[0]); row.it.push(o); return; } }
  const row = flNewRow(F); o.n = 0; o.x = 0; row.it.push(o); }
// estante x Biblioteca: tira o que saiu, põe o que entrou (fora o que está na bandeja)
function flSync(list) { const C0 = shc(), F = C0.free, ids = new Set(list.map((b) => b.id)), tray = new Set(C0.tray || []), have = new Set(); let ch = 0;
  F.rows.forEach((row) => { row.it = row.it.filter((o) => { if (o.t === 'b') { if (!ids.has(o.id) || tray.has(o.id) || have.has(o.id)) { ch = 1; return false; } have.add(o.id); }
    if (o.t === 'p') { const k = o.ids.filter((id) => ids.has(id) && !tray.has(id) && !have.has(id)); if (k.length !== o.ids.length) { ch = 1; o.ids = k; } k.forEach((id) => have.add(id)); return k.length > 0; } return true; }); });
  list.forEach((b) => { if (!have.has(b.id) && !tray.has(b.id)) { flAdd(F, { u: flUid(), t: 'b', id: b.id }); ch = 1; } });
  while (F.rows.length < 3) flNewRow(F); if (ch) shSave(); }
// 1ª vez: a estante automática (ou a ordem da pessoa) vira posições livres, sem nada pular de lugar
function flFreeze() { const C0 = shc(), sh = flQ('.bsh:not(.sm)'); if (!sh) return false; const F = { st: 'aberta', rows: [] }, UD = C0.deco || [];
  sh.querySelectorAll('.bay').forEach((bay, r) => { const br = bay.querySelector('.brow'); if (!br) return; const R = br.getBoundingClientRect(), row = { dv: [], nb: [], it: [] }, ud = UD.filter((d) => d.r === r && SH_DEC[d.k]).sort((a, z) => a.p - z.p); let di = 0;
    [...br.children].forEach((ch) => { const x = Math.max(0, Math.round(ch.getBoundingClientRect().left - R.left));
      if (ch.matches('[data-bid]')) row.it.push({ u: flUid(), t: 'b', id: ch.dataset.bid, n: 0, x });
      else if (ch.classList.contains('pile')) { const ids = [...ch.querySelectorAll('[data-bid]')].map((e) => e.dataset.bid); if (ids.length) row.it.push({ u: flUid(), t: 'p', ids, n: 0, x }); }
      else if (ch.classList.contains('dec')) { const d = ud[di++]; if (d) row.it.push({ u: flUid(), t: 'd', k: d.k, o: d.bk != null || d.cor != null ? { bk: d.bk, cor: d.cor } : undefined, n: 0, x }); } });
    F.rows.push(row); });
  if (!F.rows.length) return false;
  C0.free = F; if (C0.freePend) { const p = C0.freePend; delete C0.freePend; flReflow(F, p.st, p.rows); } else flNormalize(F); return true; }

// ---------- desenho ----------
function flPileHTML(ids, md) { return `<span class="pile">${ids.map((id, j) => { const x = shById(id); if (!x) return ''; const G = spnGeo(x, false), [c, k] = spnColors(x), ov = shEdOf(x), wv = Math.round(G.h * 0.86) - j * 3, ht = Math.max(13, Math.min(26, Math.round(G.w * 0.8)));
  const fe = ov.t === 'bp' || ov.t === 'ep', act = md ? '' : shAct(x, true);
  return `<span class="pb${(G.h0 >>> 4) % 2 ? ' sf' : ''}${fe ? ' fe' : ''}" role="button" tabindex="0" data-bid="${esc(x.id)}" aria-label="${esc(x.t)}, deitado"${act} style="width:${wv}px;height:${ht}px;--c:${c};--k:${k}${fe ? `;--eg:${ov.t === 'ep' ? '#d9b45a' : (ov.e || '#b3283f')}` : ''};margin-left:${(G.h0 % 9) - 2}px">${fe ? '' : `<span>${esc(x.t)}</span>`}</span>`; }).join('')}</span>`; }
function flItemHTML(o, x, md) { const P = shc().pos || {}; let inner = '';
  if (o.t === 'b') { const b = shById(o.id); if (!b) return '';
    inner = flFace(o.id) ? `<button type="button" class="face" data-bid="${esc(b.id)}"${md ? '' : shAct(b, true)} aria-label="${esc(b.t)}, de frente">${v4cv({ title: b.t, cover: b.img })}</button>` : spnHTML(P[o.id] === 'lean' ? { ...b, lean: 1 } : b, false); }
  else if (o.t === 'p') inner = flPileHTML(o.ids, md);
  else if (o.t === 'd') { if (!SH_DEC[o.k]) return ''; const d = { k: o.k, ...(o.o || {}) }, lb = !md && o.k === 'leitor' && typeof shLeitorBook === 'function' ? shLeitorBook(d) : null;
    inner = `<span class="dec${lb ? ' lk' : ''}"${lb ? `${shAct(lb, false)} role="button" tabindex="0" aria-label="Leitor digital: ${esc(lb.t)}"` : ''}>${SH_DEC[o.k](1, d)}</span>`; }
  const sel = FLX.pos === o.u || (FLX.pk && FLX.pk.u === o.u);
  const lab = o.t === 'd' && md ? ` role="button" tabindex="${md === 'deco' ? 0 : -1}" aria-label="${esc(SH_DN[o.k] || 'Enfeite')}${md === 'deco' ? ': toque para trocar ou tirar, ou arraste' : ''}"` : '';
  return `<span class="fli fl-${o.t}${sel ? ' flsel' : ''}" data-u="${o.u}" style="left:${Math.round(x)}px"${lab}>${inner}</span>`; }
function flPkW() { const P = FLX.pk; if (!P) return 0; if (P.from === 'tray') return flW({ t: 'b', id: P.id }); const f = flFind(P.u); return f ? flW(f.o) : 20; }
function flTargets(r, n, its, NW, w) {
  if (!its.length) return NW >= w ? `<button type="button" class="flt wide" data-flt="${r}:${n}:${Math.max(0, Math.round((NW - w) / 2))}" aria-label="Guardar aqui: ${r + 1}ª prateleira${n ? ', parte ' + (n + 1) : ''}">+ guardar aqui</button>` : '';
  const groups = []; its.forEach((q, i) => { if (!i || q.x - (its[i - 1].x + its[i - 1].w) > 2) groups.push([q]); else groups[groups.length - 1].push(q); });
  const spots = [], used = its.reduce((s, q) => s + q.w, 0);
  groups.forEach((g, gi) => { const a = g[0].x, e = g[g.length - 1].x + g[g.length - 1].w, next = groups[gi + 1] ? groups[gi + 1][0].x : NW;
    if (gi === 0 && a >= w) spots.push([a - w, a]); if (next - e >= w) spots.push([e, e]); });
  if (!spots.length && NW - used >= w) { const L = its[its.length - 1]; spots.push([L.x + L.w, L.x + L.w]); }
  return spots.map(([x, at]) => `<button type="button" class="flt" data-flt="${r}:${n}:${Math.round(x)}" style="left:${Math.round(at)}px" aria-label="Colocar aqui, ${r + 1}ª prateleira">+</button>`).join(''); }
function flHTML(list0) { const C0 = shc(), F = C0.free, md = shMode(), BW = flBW(); if (typeof SHX_LTN !== 'undefined') SHX_LTN = 0; flPx(F); flSync(list0);
  const PK = FLX.pk && md === 'org', pkW = PK ? flPkW() : 0;
  const rowsH = F.rows.map((row, k) => { const bnd = flBounds(row); let nich = '', dvs = '';
    for (let n = 0; n < bnd.length - 1; n++) { const li = n > 0 ? FL_INS : 0, ri = n < bnd.length - 2 ? FL_INS : 0, NW = flNW(row, n, BW), nb = (row.nb && row.nb[n]) || {};
      const its = row.it.filter((o) => (o.n || 0) === n).sort((a, z) => a.x - z.x).map((o) => ({ o, x: o.x, w: flW(o) })); if (!flFit(its, NW)) its.reduce((e, q) => { q.x = e; return e + q.w; }, 0);
      let h = its.map((q) => flItemHTML(q.o, q.x, md)).join(''); if (PK) h += flTargets(k, n, its, NW, pkW);
      const sel = md === 'deco' && FLX.ns === k + ':' + n;
      nich += `<div class="nich${nb.bg ? ' bg-' + esc(nb.bg) : ''}${nb.lt ? ' nlt nlt' + esc(String(nb.lt)) : ''}${sel ? ' sel' : ''}" data-r="${k}" data-n="${n}" style="left:calc(${(bnd[n] * 100).toFixed(3)}% + ${li}px);width:calc(${((bnd[n + 1] - bnd[n]) * 100).toFixed(3)}% - ${li + ri}px)">${nb.lt ? '<i class="npk" aria-hidden="true"></i>' : ''}${h}</div>`;
      if (n > 0) dvs += `<span class="ndv" data-r="${k}" data-i="${n - 1}" style="left:calc(${(bnd[n] * 100).toFixed(3)}% - ${FL_INS}px)"${md === 'deco' ? ` role="slider" tabindex="0" aria-label="Divisória da ${k + 1}ª prateleira: arraste ou use as setas" aria-valuenow="${Math.round(bnd[n] * 100)}" aria-valuemin="5" aria-valuemax="95"` : ' aria-hidden="true"'}></span>`; }
    const pq = (C0.plq || []).map((q, i) => ({ ...q, i })).filter((q) => q.r === k && q.t).map((q) => `<span class="plq s-${esc(q.s || 'mad')}${md === 'deco' ? ' u' : ''}" style="left:${Math.max(4, Math.min(96, (q.p == null ? 0.5 : q.p) * 100)).toFixed(1)}%"${md === 'deco' ? ` data-pq="${q.i}" role="button" tabindex="0"` : ''}>${esc(String(q.t).slice(0, 24))}</span>`).join('');
    return `<div class="bay fl" data-r="${k}">${shLtRow(k, false, 'b')}<div class="brow flr">${nich}${dvs}</div></div><div class="bpl"${pq ? '' : ' aria-hidden="true"'} data-r="${k}">${shLtRow(k, false, 'f')}${pq}</div>`; }).join('');
  const hint = md ? '' : `<div class="hint"><span><i class="k1"></i>lendo</span><span><i class="k2">✦</i>lido</span><span class="r">Minha arrumação · toque abre · segure para opções</span></div>`;
  const ltOff = C0.lt && C0.lt.on === 0;
  const cls = `bsh flx${md ? ' ' + md : ''}${shDark() ? ' dk' : ''}${/^c[23]$/.test(F.st) ? ' cubo' : ''}${PK ? ' flpk' : ''} w-${C0.wall || 'linho'} lt-${ltOff ? 'off' : (C0.lt && C0.lt.c) || 'quente'}`;
  return `<div class="${cls}" style="${shWoodVars(C0.wood)}">${hint}<div class="case">${shLtFrame(false)}<div class="crown"></div>${rowsH}</div></div>`; }
{ const _p = pratHTML; pratHTML = function (list0, sm, wBsh) { try { if (!sm && FL_MAIN && flActive()) { FL_WB = wBsh || FL_WB; return flHTML(list0); } } catch (err) { console.warn('estante livre', err); } return _p.apply(this, arguments); }; }

// ---------- bandeja compacta, pílula do livro na mão, painel de posição ----------
const FL_FILT = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>';
const flCv = (b) => v4cv({ title: b.t, cover: b.img }, 'flcv');
function flDock() { const C0 = shc(), tr = Array.isArray(C0.tray) && C0.tray.length ? C0.tray : null, L = tr ? shTrayList() : [], gone = !!(FLX.pk || FLX.pos);
  const cvs = L.map((b) => `<button type="button" class="flc${FLX.pk && FLX.pk.id === b.id ? ' on' : ''}" data-fltr="${esc(b.id)}" aria-label="${esc(b.t)}: arraste até a estante, ou toque e escolha o lugar"><span class="tc">${flCv(b)}</span>${FLX.open ? `<span class="tl">${esc(b.t)}</span>` : ''}</button>`).join('');
  const pill = FLX.pk ? (() => { const b = shById(FLX.pk.id) || { t: FLX.pk.id ? '' : 'Enfeite' }; return `<div class="flpill" role="status"><span class="pkc">${b.id ? flCv(b) : ''}</span><b>${esc(b.t || 'Item')}<small>Toque onde ele vai ficar, ou arraste até lá</small></b><button type="button" data-fl="pkx">Cancelar</button></div>`; })() : '';
  return `<div class="fldock${gone ? ' gone' : ''}${FLX.open ? ' open' : ''}" role="region" aria-label="Organizar a estante"${gone ? ' aria-hidden="true"' : ''}>
    ${tr ? `<button type="button" class="flgrab" data-fl="dock" aria-label="${FLX.open ? 'Recolher' : 'Abrir'} a bandeja" aria-expanded="${FLX.open}"><i></i></button>` : ''}
    <div class="flbar"><b>${tr ? `Livros para guardar · ${tr.length}` : 'Arrume do seu jeito'}<small>${tr ? 'Arraste uma capa até a estante' : 'Arraste um livro · segure para levar o grupo'}</small></b><button type="button" class="flic" data-fl="more" aria-label="Mais opções">${v4ic('dots', 20)}</button><button type="button" class="flok" data-a="shdone">Concluir</button></div>
    ${tr ? `<div class="flrow"><button type="button" class="flic flf${FLX.filt ? ' on' : ''}" data-fl="filt" aria-label="Filtrar e ordenar a bandeja" aria-expanded="${FLX.filt}">${FL_FILT}</button><div class="fllist">${cvs || '<p class="mut" style="margin:6px 2px">Nenhum livro com esse filtro.</p>'}</div></div>
      ${FLX.filt ? `<div class="flfil">${shChips('shtrayf', SHX_TRF, [['todos', 'Todos'], ['lendo', 'Lendo'], ['quero', 'Quero ler'], ['lido', 'Lidos'], ['outros', 'Outros']])}${shChips('shtrays', SHX_TRS, [['ord', 'Ordem atual'], ['cor', 'Cor'], ['autor', 'Autor'], ['titulo', 'Título']])}</div>` : ''}` : ''}
  </div>${pill}`; }
{ const _b = shOrgBanner; shOrgBanner = function () { return flActive() ? '' : _b.apply(this, arguments); }; }
{ const _pn = shOrgPanel; shOrgPanel = function () { return flActive() ? flDock() : _pn.apply(this, arguments); }; }
function flPosPanel() { const sr = shBibRoot(); if (!sr) return; sr.querySelectorAll('.flpos').forEach((e) => e.remove()); if (!FLX.pos || SHX_MODE !== 'org' || !flActive()) return; const f = flFind(FLX.pos); if (!f) { FLX.pos = null; return; }
  const o = f.o, id = o.t === 'b' ? o.id : o.t === 'p' ? o.ids[0] : null; if (!id) { FLX.pos = null; return; } const b = shById(id), P = shc().pos || {}; if (!b) return;
  const cur = o.t === 'p' ? 'dei' : P[id] === 'face' ? 'fre' : P[id] === 'lean' ? 'inc' : 'pe', el = sr.querySelector(`.bsh.flx .fli[data-u="${o.u}"]`), R = sr.querySelector('.v5est'); if (!el || !R) return;
  el.scrollIntoView({ block: 'nearest' }); const E = el.getBoundingClientRect(), p = document.createElement('div'); p.className = 'flpos'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Como o livro fica');
  p.innerHTML = `<div class="fph"><b>${esc(b.t)}</b><button type="button" class="ok" data-flp="ok">Pronto</button></div><div class="fpc" role="radiogroup" aria-label="Posição">${[['pe', 'Em pé'], ['dei', 'Deitado'], ['fre', 'De frente'], ['inc', 'Inclinado']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${cur === k}" class="${cur === k ? 'on' : ''}" data-flp="${k}">${l}</button>`).join('')}</div><button type="button" class="fplb" data-flp="lomb">Lombada e edição ›</button>`;
  R.appendChild(p); const ph = p.offsetHeight, pw = p.offsetWidth, W = innerWidth; let top = E.top - ph - 14, below = false; if (top < 64) { top = Math.min(E.bottom + 14, innerHeight - ph - 8); below = true; }
  const left = Math.max(8, Math.min(W - pw - 8, E.left + E.width / 2 - pw / 2)); p.style.top = top + 'px'; p.style.left = left + 'px'; p.style.setProperty('--ax', Math.max(16, Math.min(pw - 16, E.left + E.width / 2 - left)) + 'px'); p.classList.toggle('below', below); }

// ---------- ações ----------
function flRender() { const sc = shScroller(), y = sc ? sc.scrollTop : 0; v5Redraw(); const s2 = shScroller(); if (s2 && Math.abs(s2.scrollTop - y) > 1) s2.scrollTop = y; }
function flPlace(r, n, x, mv) { const C0 = shc(), F = C0.free, BW = flBW(), row = F.rows[r]; if (!row) return null; const NW = flNW(row, n, BW), uS = new Set((mv.items || []).map((o) => o.u));
  const blk = mv.items ? mv.items : [{ u: flUid(), t: 'b', id: mv.id }], base = mv.items ? Math.min(...blk.map((o) => o.x)) : 0, offs = blk.map((o) => (mv.items ? o.x - base : 0)), tw = Math.max(...blk.map((o, i) => offs[i] + flW(o)));
  const others = row.it.filter((o) => (o.n || 0) === n && !uS.has(o.u)).map((o) => ({ u: o.u, x: o.x, w: flW(o), o })), res = flResolve(others, { x, w: tw }, NW); if (!res) return null;
  const bk = shBk(); if (mv.items) F.rows.forEach((rw) => { rw.it = rw.it.filter((o) => !uS.has(o.u)); });
  res.forEach((q) => { if (q.u === '__m') blk.forEach((o, i) => { o.x = Math.round(q.x + offs[i]); o.n = n; row.it.push(o); }); else q.o.x = Math.round(q.x); });
  if (mv.id) { C0.tray = (C0.tray || []).filter((t) => t !== mv.id); if (!C0.tray.length) { delete C0.tray; delete C0.trayBk; } }
  C0.manual = 1; C0.arr = null; shSave(); return { bk, u: blk[0].u, n: blk.length }; }
function flAfterPlace(res, mv, r) { try { navigator.vibrate && navigator.vibrate(10); } catch {} const single = !!mv.id || (mv.items.length === 1 && mv.items[0].t === 'b'); FLX.pk = null; FLX.pos = single ? res.u : null; FLX.open = false;
  const left = (shc().tray || []).length, t = mv.id ? shTitle(mv.id) : mv.items.length > 1 ? 'Grupo de ' + mv.items.length : mv.items[0].t === 'd' ? (SH_DN[mv.items[0].k] || 'Enfeite') : 'Livro';
  toast(`${t.length > 34 ? t.slice(0, 33) + '…' : t} na ${r + 1}ª prateleira${mv.id && left ? ' · faltam ' + left : ''}${mv.id && !left ? ' · todos guardados' : ''}`, shUndo(res.bk)); flRender(); }
function flTapPlace(r, n, x) { const P = FLX.pk; if (!P) return; let mv; if (P.from === 'tray') mv = { id: P.id }; else { const f = flFind(P.u); if (!f) return; mv = { items: [f.o] }; }
  const res = flPlace(r, n, x, mv); if (!res) return toast('Não cabe aqui. Escolha outro lugar.'); flAfterPlace(res, mv, r); }
function flPosAct(k) { const f = flFind(FLX.pos); if (!f) return; const o = f.o, C0 = shc(); C0.pos = C0.pos || {};
  if (k === 'ok') { FLX.pos = null; return flRender(); }
  const id = o.t === 'p' ? o.ids[0] : o.id;
  if (k === 'lomb') { FLX.pos = null; flRender(); const e = v5Book(id); return e && shOpen('shxlb', { e }); }
  const b = shById(id); if (k === 'fre' && !(b && b.img)) return toast('Livro sem capa não fica de frente');
  const bk = shBk(), row = C0.free.rows[f.r]; let swp = '';
  if (o.t === 'p') { o.t = 'b'; o.id = id; delete o.ids; } delete C0.pos[id]; if (C0.lay) delete C0.lay[id];
  if (k === 'dei') { o.t = 'p'; o.ids = [id]; delete o.id; }
  if (k === 'inc') C0.pos[id] = 'lean';
  if (k === 'fre') { row.it.forEach((x) => { if (x !== o && x.t === 'b' && C0.pos[x.id] === 'face') { delete C0.pos[x.id]; swp = shTitle(x.id); } }); C0.pos[id] = 'face'; }
  const its = row.it.filter((x) => (x.n || 0) === (o.n || 0)).sort((a, z) => a.x - z.x).map((x) => ({ o: x, x: x.x, w: flW(x) }));
  if (!flFit(its, flNW(row, o.n || 0, flBW()))) { shRestore(bk); requestAnimationFrame(flPosPanel); return toast('Assim não cabe nesta prateleira'); }
  its.forEach((q) => { q.o.x = Math.round(q.x); }); shSave();
  toast(({ pe: 'Em pé', dei: 'Deitado', fre: 'De frente', inc: 'Inclinado' })[k] + (swp ? ' · ' + swp.slice(0, 24) + ' ficou em pé' : ''), shUndo(bk)); flRender(); }
function flEmpty() { const C0 = shc(), F = C0.free, bk = shBk(), ids = []; F.rows.forEach((row) => { for (let n = 0; n < flNiches(row); n++) row.it.filter((o) => (o.n || 0) === n).sort((a, z) => a.x - z.x).forEach((o) => { if (o.t === 'b') ids.push(o.id); if (o.t === 'p') ids.push(...o.ids); }); row.it = row.it.filter((o) => o.t === 'd'); });
  C0.trayBk = bk; C0.tray = ids; SHX_TRF = 'todos'; FLX.open = false; FLX.pk = null; shSave(); toast('Estante vazia: arraste os livros um a um', { label: 'Desfazer', fn: shTrayUndo }); flRender(); }
function flAuto() { const C0 = shc(), bk = shBk(); C0.freePend = flStructOf(C0.free); C0.ord = null; C0.lay = {}; C0.manual = 0; C0.arr = null; delete C0.free; delete C0.tray; delete C0.trayBk; shSave(); toast('A estante voltou a se arrumar sozinha', shUndo(bk)); flRender(); }
function flCloseGaps() { const C0 = shc(), bk = shBk(); C0.free.rows.forEach((row) => { for (let n = 0; n < flNiches(row); n++) { let e = 0; row.it.filter((o) => (o.n || 0) === n).sort((a, z) => a.x - z.x).forEach((o) => { o.x = e; e += flW(o); }); } }); shSave(); toast('Espaços fechados', shUndo(bk)); flRender(); }
{ const _a = shArrange; shArrange = function (k) { const C0 = shc(); if (!C0.free || !flBase()) return _a.apply(this, arguments); const st = flStructOf(C0.free), r = _a.apply(this, arguments); delete C0.free; C0.freePend = st; shSave(); flRender(); return r; }; }
function flTpl(k) { const C0 = shc(), bk = shBk(); flReflow(C0.free, k, null); FLX.ns = null; shSave(); toast('Estrutura: ' + (FL_TPL.find((x) => x[0] === k) || ['', ''])[1], shUndo(bk)); flRender(); }
function flDecoAdd(k) { const C0 = shc(), F = C0.free, BW = flBW();
  if (FLX.swap) { const f = flFind(FLX.swap); FLX.swap = null; if (f) { const bk = shBk(); f.o.k = k; delete f.o.o; flNormalize(F); shSave(); toast((SH_DN[k] || k) + ' no lugar', shUndo(bk)); return flRender(); } }
  const o = { u: flUid(), t: 'd', k }, w = flW(o);
  for (let r = 0; r < F.rows.length; r++) { const row = F.rows[r]; for (let n = flNiches(row) - 1; n >= 0; n--) { const NW = flNW(row, n, BW), its = row.it.filter((q) => (q.n || 0) === n).sort((a, z) => a.x - z.x), e = its.length ? its[its.length - 1].x + flW(its[its.length - 1]) : 0;
    if (NW - e >= w) { const bk = shBk(); o.n = n; o.x = NW - w; row.it.push(o); shSave(); toast((SH_DN[k] || k) + ' na ' + (r + 1) + 'ª prateleira · arraste para mudar de lugar', shUndo(bk)); return flRender(); } } }
  toast('Sem espaço livre: tire um livro ou um enfeite antes'); }
function flDecoSheet(u) { const f = flFind(u); if (!f) return; const o = f.o, C0 = shc();
  const items = []; if (o.k === 'leitor') { const cur = shLeitorBook({ k: o.k, ...(o.o || {}) }); items.push(['Escolher livro do visor', () => shPickBook('Escolher livro do visor', cur && cur.id, (id) => { o.o = { ...(o.o || {}), bk: id }; shSave(); flRender(); toast('“' + shTitle(id).slice(0, 40) + '” no visor'); })]);
    items.push([o.o && o.o.cor ? 'Visor em tons de cinza' : 'Mostrar a capa colorida', () => { o.o = { ...(o.o || {}), cor: o.o && o.o.cor ? 0 : 1 }; shSave(); flRender(); }]); }
  items.push(['Trocar por outro enfeite', () => { FLX.swap = u; SHX_DKT = 'enf'; flRender(); toast('Escolha o novo enfeite'); }]);
  items.push(['Tirar da estante', () => { const bk = shBk(); C0.free.rows[f.r].it = C0.free.rows[f.r].it.filter((x) => x.u !== u); shSave(); toast('Enfeite tirado', shUndo(bk)); flRender(); }]);
  shX(SH_DN[o.k] || 'Enfeite', items); }
function flDkReset() { const C0 = shc(), bk = shBk(); C0.free.rows.forEach((r) => { r.nb = []; }); shSave(); const R = flQ('.v5est'); if (!R) return; const b = document.createElement('button'); b.type = 'button'; b.dataset.a = 'dkreset'; b.hidden = true; R.appendChild(b); b.click(); b.remove(); }
function flAct(k, el) { const C0 = shc();
  if (k === 'dock') { FLX.open = !FLX.open; return flRender(); }
  if (k === 'filt') { FLX.filt = !FLX.filt; return flRender(); }
  if (k === 'pkx') { FLX.pk = null; return flRender(); }
  if (k === 'more') { const tr = Array.isArray(C0.tray) && C0.tray.length; return shX('Organizar', [['Arrumar por (cor, autor, título…)', () => shArrMenu()], tr ? ['Desfazer tudo: a estante volta como estava', () => { FLX.open = false; shTrayUndo(); }] : ['Esvaziar e arrumar um por um', () => flEmpty()], ['Fechar os espaços entre os livros', () => flCloseGaps()], ['Voltar à arrumação automática', () => flAuto()]]); }
  if (k === 'st') return flTpl(el.dataset.k);
  if (k === 'nbg' || k === 'nlt') { const [r, n] = String(FLX.ns || '').split(':').map(Number), row = C0.free.rows[r]; if (!row) return; row.nb = row.nb || []; const nb = row.nb[n] = { ...(row.nb[n] || {}) };
    if (k === 'nbg') { if (el.dataset.k) nb.bg = el.dataset.k; else delete nb.bg; } else { if (+el.dataset.k) nb.lt = +el.dataset.k; else delete nb.lt; } shSave(); return flRender(); }
  if (k === 'nsx') { FLX.ns = null; return flRender(); }
  if (k === 'dkx') { FLX.dkx = !FLX.dkx; return flRender(); }
  if (k === 'dkmore') return shX('Decorar', [['Restaurar a decoração padrão', () => flDkReset()], ['Voltar à estante aberta, sem nichos', () => flTpl('aberta')]]); }

// ---------- Decorar › Estrutura ----------
function flTplSvg(k) { let h = '<rect x="1" y="1" width="38" height="30" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>'; for (let r = 0; r < 3; r++) { const y = 1 + (r + 1) * 10; if (r < 2) h += `<path d="M1 ${y}h38" stroke="currentColor" stroke-width="1.4"/>`; flTplDv(k, r).forEach((f) => { h += `<path d="M${1 + f * 38} ${1 + r * 10}v10" stroke="currentColor" stroke-width="${/^c/.test(k) ? 2.4 : 1.4}"/>`; }); } return `<svg viewBox="0 0 40 32" aria-hidden="true">${h}</svg>`; }
function flEstBody() { const F = shc().free; if (!F) return '<p class="dkh">Abra a estante com Todos os livros para mudar a estrutura.</p>'; const [r, n] = String(FLX.ns || '').split(':').map(Number), row = FLX.ns != null && F.rows[r], nb = row ? ((row.nb || [])[n] || {}) : {};
  return `<p class="dkh">Escolha o modelo. Arraste as divisórias para ajustar.</p>
    <div class="flst" role="radiogroup" aria-label="Modelo">${FL_TPL.map(([k, l]) => `<button type="button" role="radio" aria-checked="${F.st === k}" class="${F.st === k ? 'on' : ''}" data-fl="st" data-k="${k}">${flTplSvg(k)}<span>${l}</span></button>`).join('')}</div>
    ${row ? `<div class="dsec">Nicho ${n + 1} da ${r + 1}ª prateleira · Fundo</div><div class="dchips">${FL_NBG.map(([k, l]) => `<button type="button" class="${(nb.bg || '') === k ? 'on' : ''}" aria-pressed="${(nb.bg || '') === k}" data-fl="nbg" data-k="${k}"><i class="flsw sw-${k || 'pad'}" aria-hidden="true"></i>${l}</button>`).join('')}</div>
      <div class="dsec">Luz</div><div class="dchips">${FL_NLT.map(([k, l]) => `<button type="button" class="${String(nb.lt || 0) === k ? 'on' : ''}" aria-pressed="${String(nb.lt || 0) === k}" data-fl="nlt" data-k="${k}">${l}</button>`).join('')}</div><div class="dkrow"><button type="button" class="btn s" data-fl="nsx">Pronto</button></div>`
    : '<p class="dkh on" style="margin-top:10px">Toque num nicho para dar fundo e luz.</p>'}`; }
{ const _dk = dkPanel; dkPanel = function () { let h = _dk.apply(this, arguments); try { if (!flActive()) return h; const t = SHX_DKT || 'enf';
    h = h.replace(/(<button[^>]*data-k="enf"[^>]*>Enfeites<\/button>)/, `$1<button type="button" role="tab" aria-selected="${t === 'est'}" class="${t === 'est' ? 'on' : ''}" data-a="dktab" data-k="est">Estrutura</button>`);
    if (t === 'est') h = h.replace(/<div class="dbody">[\s\S]*?<\/div><div class="dkfoot">/, `<div class="dbody">${flEstBody()}</div><div class="dkfoot">`);
    if (t === 'enf' && FLX.swap) h = h.replace('<div class="dbody">', '<div class="dbody"><p class="dkh on">Escolha o enfeite que vai entrar no lugar.</p>');
    h = h.replace('class="dkpan"', `class="dkpan flp${FLX.dkx ? ' flbig' : ''}"`).replace('<div class="grab"></div>', `<button type="button" class="grab flgrab2" data-fl="dkx" aria-label="${FLX.dkx ? 'Recolher' : 'Expandir'} a folha" aria-expanded="${!!FLX.dkx}"></button>`)
      .replace(/<button[^>]*data-a="dkreset"[^>]*>Restaurar padr.o<\/button>/, `<button type="button" class="flic" data-fl="dkmore" aria-label="Mais opções">${v4ic('dots', 20)}</button>`); } catch (err) { console.warn('estante livre: decorar', err); }
    return h; }; }

// ---------- arrastar: livros, grupos, enfeites, capas da bandeja, divisórias ----------
{ let raf = 0;
  const R5 = () => flQ('.v5est');
  const nicheAt = (x, y) => { const sr = flR(); const el = sr && sr.elementFromPoint(x, y); if (!el || !el.closest) return null; let bay = el.closest('.bsh.flx .bay.fl'); if (!bay) { const bp = el.closest('.bsh.flx .bpl'); if (bp) bay = bp.previousElementSibling; } if (!bay || !bay.classList.contains('fl')) return null;
    const ns = [...bay.querySelectorAll('.nich')]; let best = null, bd = 1e9; ns.forEach((nn) => { const R = nn.getBoundingClientRect(), d = x < R.left ? R.left - x : x > R.right ? x - R.right : 0; if (d < bd) { bd = d; best = nn; } }); return bd < 30 ? best : null; };
  const resetNiche = (nn) => { if (!nn) return; nn.querySelectorAll('.fli').forEach((e) => { if (e.dataset.x0 != null) e.style.left = e.dataset.x0; }); const s = nn.querySelector('.flslot'); if (s) s.remove(); };
  const tip = (txt, x, y) => { const R = R5(); let t = R && R.querySelector('.fltip'); if (!txt) { if (t) t.remove(); return; } if (!R) return; if (!t) { t = document.createElement('div'); t.className = 'fltip'; R.appendChild(t); } t.textContent = txt; t.style.left = x + 'px'; t.style.top = y + 'px'; };
  function start(D) { clearTimeout(D.holdT); const R = R5(), sh = flQ('.bsh.flx'); if (!R || !sh) { D.on = false; return; } D.on = true; R.classList.add('fldrag'); R.querySelectorAll('.flpos').forEach((e) => e.remove()); FLX.pos = null;
    const dock = R.querySelector('.fldock'); if (dock) dock.classList.add('gone'); const pl = R.querySelector('.flpill'); if (pl) pl.remove();
    sh.querySelectorAll('.fli').forEach((e) => { e.dataset.x0 = e.style.left; });
    const g = document.createElement('div'); g.className = sh.className.replace(/\b(org|deco|flpk)\b/g, '') + ' flghost'; g.setAttribute('style', sh.getAttribute('style') || ''); const gin = document.createElement('div'); gin.className = 'gin'; g.appendChild(gin);
    if (D.src === 'tray') { const b = shById(D.id); if (!b) { D.on = false; return; } D.items = null; D.w = flW({ t: 'b', id: D.id }); const m0 = SHX_MODE; SHX_MODE = 'org'; try { gin.innerHTML = `<span class="fli" style="left:0;position:relative;display:block">${spnHTML(b, false)}</span>`; } finally { SHX_MODE = m0; } D.offX = D.w / 2; D.offY = spnGeo(b, false).h * 0.55; D.h = spnGeo(b, false).h; }
    else { const f = flFind(D.u); if (!f) { D.on = false; return; } if (!D.grp && f.o.t === 'd' && /^aparador/.test(f.o.k)) { D.grp = true; D.gitems = flGroupOf(f.r, D.u); }
      D.items = D.grp ? D.gitems : [f.o]; const els = D.items.map((o) => sh.querySelector(`.fli[data-u="${o.u}"]`)).filter(Boolean), rs = els.map((e) => e.getBoundingClientRect()); if (!els.length) { D.on = false; return; }
      const L = Math.min(...rs.map((r) => r.left)), T = Math.min(...rs.map((r) => r.top)), B = Math.max(...rs.map((r) => r.bottom)); D.w = Math.max(...D.items.map((o) => o.x + flW(o))) - Math.min(...D.items.map((o) => o.x)); D.offX = D.x - L; D.offY = D.y - T; D.h = B - T;
      els.forEach((e, i) => { const c = e.cloneNode(true); c.removeAttribute('data-u'); c.classList.remove('flsel', 'flgrp'); c.style.left = (rs[i].left - L) + 'px'; c.style.top = (rs[i].top - T) + 'px'; c.style.bottom = 'auto'; c.style.transition = 'none'; gin.appendChild(c); e.style.visibility = 'hidden'; }); gin.style.height = D.h + 'px'; gin.style.width = D.w + 'px'; }
    R.appendChild(g); D.g = g; try { navigator.vibrate && navigator.vibrate(8); } catch {} raf = requestAnimationFrame(loop); }
  function move(D, x, y) { D.lx = x; D.ly = y; if (D.g) D.g.style.transform = `translate(${x - D.offX}px,${y - D.offY}px)`;
    const sc = shScroller(), docSc = sc === document.scrollingElement || sc === document.documentElement, SR = docSc ? { top: 0, bottom: innerHeight } : sc.getBoundingClientRect(), shR = flQ('.bsh.flx'), BR = shR ? shR.getBoundingClientRect() : null;
    // rolagem automática: só depois que o dedo entra na estante (vindo da bandeja, não rola à toa)
    if (!D.armed && BR && y > Math.max(SR.top + 70, BR.top) && y < Math.min(SR.bottom - 70, BR.bottom)) D.armed = true; D.vy = !D.armed ? 0 : y < SR.top + 70 ? -Math.ceil((SR.top + 70 - y) / 5) : y > SR.bottom - 90 ? Math.ceil((y - SR.bottom + 90) / 5) : 0;
    const nn = nicheAt(x, y); if (D.nn && D.nn !== nn) { resetNiche(D.nn); D.nn = null; }
    if (!nn) { D.tgt = null; D.bad = false; tip(D.src === 'tray' ? 'Solte numa prateleira' : 'Solte numa prateleira (fora daqui cancela)', x, y - D.offY - 14); return; }
    D.nn = nn; const r = +nn.dataset.r, n = +nn.dataset.n, NW = nn.clientWidth, R = nn.getBoundingClientRect(), mv = new Set((D.items || []).map((o) => o.u));
    const others = flItems(r, n).filter((o) => !mv.has(o.u)).map((o) => ({ u: o.u, x: o.x, w: flW(o) })), res = flResolve(others, { x: x - R.left - D.offX, w: D.w }, NW);
    let slot = nn.querySelector('.flslot'); if (!slot) { slot = document.createElement('i'); slot.className = 'flslot'; nn.appendChild(slot); }
    slot.style.width = D.w + 'px'; slot.style.height = Math.min(150, D.h || 130) + 'px';
    D.bad = !res; if (!res) { slot.classList.add('bad'); slot.style.left = Math.max(0, Math.min(NW - D.w, x - R.left - D.offX)) + 'px'; D.tgt = null; tip('Não cabe aqui', x, y - D.offY - 14); return; }
    slot.classList.remove('bad'); tip('', 0, 0); const pos = new Map(res.map((q) => [q.u, q.x])); slot.style.left = pos.get('__m') + 'px';
    nn.querySelectorAll('.fli').forEach((e) => { if (pos.has(e.dataset.u)) e.style.left = pos.get(e.dataset.u) + 'px'; }); D.tgt = { r, n, x: pos.get('__m') }; }
  function loop() { const D = FLX.D; if (!D || !D.on) return; const sc = shScroller(); if (sc && D.vy) { sc.scrollTop += D.vy; move(D, D.lx, D.ly); } raf = requestAnimationFrame(loop); }
  // divisória (Decorar)
  function dvMove(D, x) { const C0 = shc(), row = C0.free.rows[D.r], b = flBounds(row), BW = D.BW, i = D.i, lo = b[i], hi = b[i + 2];
    const need = (n) => row.it.filter((o) => (o.n || 0) === n).reduce((s, o) => s + flW(o), 0) + 2 * FL_INS + 6, minW = 48;
    const f = Math.max(lo + Math.max(need(i), minW) / BW, Math.min(hi - Math.max(need(i + 1), minW) / BW, (x - D.L) / BW)); D.f = f;
    const dv = row.dv.slice(); dv[i] = f; const nb = [0, ...dv, 1], bay = flQ(`.bsh.flx .bay.fl[data-r="${D.r}"]`); if (!bay) return;
    [i, i + 1].forEach((n) => { const e = bay.querySelector(`.nich[data-n="${n}"]`), li = n > 0 ? FL_INS : 0, ri = n < nb.length - 2 ? FL_INS : 0; if (e) { e.style.left = `calc(${(nb[n] * 100).toFixed(3)}% + ${li}px)`; e.style.width = `calc(${((nb[n + 1] - nb[n]) * 100).toFixed(3)}% - ${li + ri}px)`; } });
    const d = bay.querySelector(`.ndv[data-i="${i}"]`); if (d) d.style.left = `calc(${(f * 100).toFixed(3)}% - ${FL_INS}px)`; }
  function dvCommit(r, i, f) { const C0 = shc(), row = C0.free.rows[r], bk = shBk(); flPx(C0.free); row.dv[i] = Math.round(f * 1000) / 1000; flNormalize(C0.free); shSave(); toast('Divisória ajustada', shUndo(bk)); flRender(); }
  window.flCancelDrag = function () { const D = FLX.D; if (!D) return false; FLX.D = null; clearTimeout(D.holdT); cancelAnimationFrame(raf); try { D.g && D.g.remove(); } catch {} tip('', 0, 0); const R = R5(); if (R) R.classList.remove('fldrag'); if (D.nn) resetNiche(D.nn); flQA('.bsh.flx .fli').forEach((e) => { e.style.visibility = ''; }); return true; };
  window.addEventListener('pointerdown', (ev) => { if (!flActive() || ev.button > 0) return; const md = SHX_MODE; if (md !== 'org' && md !== 'deco') return; const T = flTgt(ev); if (!T || !T.closest) return;
    const dv = md === 'deco' && T.closest('.bsh.flx .ndv'); if (dv) { ev.stopImmediatePropagation(); if (ev.cancelable) ev.preventDefault(); flPx(shc().free); const br = dv.closest('.brow').getBoundingClientRect(); if (FLX.dkx) { FLX.dkx = false; const p = flQ('.dkpan.flbig'); if (p) p.classList.remove('flbig'); } FLX.D = { kind: 'dv', pid: ev.pointerId, r: +dv.dataset.r, i: +dv.dataset.i, L: br.left, BW: br.width, f: null }; dv.classList.add('on'); return; }
    const tr = md === 'org' && T.closest('.fldock [data-fltr]'), fli = T.closest('.bsh.flx .fli'); if (!tr && !fli) return; if (fli && md === 'deco' && !fli.classList.contains('fl-d')) return; if (fli && md === 'org' && FLX.pk && FLX.pk.u !== fli.dataset.u) return;
    flPx(shc().free);
    if (fli) { ev.stopImmediatePropagation(); if (ev.cancelable && ev.pointerType !== 'mouse') ev.preventDefault(); }
    const D = FLX.D = { pid: ev.pointerId, x: ev.clientX, y: ev.clientY, on: false, src: tr ? 'tray' : 'shelf', id: tr ? tr.dataset.fltr : null, u: fli ? fli.dataset.u : null, grp: false };
    if (fli) D.holdT = setTimeout(() => { if (FLX.D !== D || D.on) return; const f = flFind(D.u); if (!f) return; const g = flGroupOf(f.r, D.u); if (g.length < 2) return; D.grp = true; D.gitems = g; FLX.swallow = 1;
      g.forEach((o) => { const e = flQ(`.bsh.flx .fli[data-u="${o.u}"]`); if (e) e.classList.add('flgrp'); }); try { navigator.vibrate && navigator.vibrate(16); } catch {} tip('Grupo de ' + g.length + ': arraste', ev.clientX, ev.clientY - 40); }, 480); }, true);
  window.addEventListener('pointermove', (ev) => { const D = FLX.D; if (!D || ev.pointerId !== D.pid) return;
    if (D.kind === 'dv') { ev.preventDefault(); return dvMove(D, ev.clientX); }
    const dx = ev.clientX - D.x, dy = ev.clientY - D.y;
    if (!D.on) { if (Math.hypot(dx, dy) < 8) return; if (D.src === 'tray' && Math.abs(dx) > Math.abs(dy)) { FLX.D = null; return; } start(D); if (!D.on) { FLX.D = null; return; } }
    ev.preventDefault(); move(D, ev.clientX, ev.clientY); }, { capture: true, passive: false });
  const end = (ev) => { const D = FLX.D; if (!D || ev.pointerId !== D.pid) return; FLX.D = null; clearTimeout(D.holdT); tip('', 0, 0);
    if (D.kind === 'dv') { const d = flQ('.bsh.flx .ndv.on'); if (d) d.classList.remove('on'); FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 400); if (D.f != null && ev.type === 'pointerup') dvCommit(D.r, D.i, D.f); else flRender(); return; }
    if (!D.on) { if (D.grp) { setTimeout(() => { FLX.swallow = 0; }, 400); flQA('.flgrp').forEach((e) => e.classList.remove('flgrp')); } return; }
    cancelAnimationFrame(raf); if (D.g) D.g.remove(); const R = R5(); if (R) R.classList.remove('fldrag'); FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 400); SHX_JD = 1; setTimeout(() => { SHX_JD = 0; }, 350);
    if (!D.tgt || ev.type === 'pointercancel') { if (D.nn) resetNiche(D.nn); flRender(); if (ev.type === 'pointercancel') return; return toast(D.bad ? 'Não coube aí' + (D.src === 'tray' ? ': o livro voltou para a bandeja' : '; nada mudou') : D.src === 'tray' ? 'O livro voltou para a bandeja' : 'Nada mudou de lugar'); }
    const mv = D.src === 'tray' ? { id: D.id } : { items: D.items }, res = flPlace(D.tgt.r, D.tgt.n, D.tgt.x, mv); if (!res) { flRender(); return toast('Não cabe aqui'); }
    if (D.src === 'shelf' && D.items.some((o) => o.t === 'd') && SHX_MODE === 'deco') { FLX.pos = null; toast('Enfeite no novo lugar', shUndo(res.bk)); return flRender(); }
    flAfterPlace(res, mv, D.tgt.r); };
  window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true);
  window.addEventListener('contextmenu', (ev) => { if (!flActive() || !SHX_MODE) return; const T = flTgt(ev); if (T && T.closest && T.closest('.bsh.flx, .fldock')) ev.preventDefault(); }, true);
  window.addEventListener('keydown', (ev) => { if (!flActive()) return;
    if (ev.key === 'Escape' && (FLX.pk || FLX.pos)) { FLX.pk = null; FLX.pos = null; ev.stopImmediatePropagation(); return flRender(); }
    const T = flTgt(ev), dv = T && T.closest && T.closest('.bsh.flx.deco .ndv'); if (dv && (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight')) { ev.preventDefault(); ev.stopImmediatePropagation(); flPx(shc().free); const r = +dv.dataset.r, i = +dv.dataset.i, br = dv.closest('.brow').getBoundingClientRect(), row = shc().free.rows[r], D = { r, i, L: br.left, BW: br.width };
      dvMove(D, br.left + (row.dv[i] + (ev.key === 'ArrowLeft' ? -0.03 : 0.03)) * br.width); dvCommit(r, i, D.f); setTimeout(() => { const e = flQ(`.bsh.flx .ndv[data-r="${r}"][data-i="${i}"]`); if (e) e.focus(); }, 30); } }, true);
}

// ---------- toques ----------
// o nicho tocado: o próprio, ou (luzinhas e sombras por cima) o nicho da prateleira na altura do dedo
function flNicheAt(T, x) { const n = T.closest('.bsh.flx .nich'); if (n) return n; const bay = T.closest('.bsh.flx .bay.fl'); if (!bay) return null; return [...bay.querySelectorAll('.nich')].find((e) => { const R = e.getBoundingClientRect(); return x >= R.left - 2 && x <= R.right + 2; }) || null; }
window.addEventListener('click', (ev) => { if (!flActive()) return; const md = SHX_MODE, T = flTgt(ev); if (!T || !T.closest) return; if (!T.closest('.v5est') || T.closest('.shx-sx,.shbp,.flarr')) return;
  const st = () => { ev.stopImmediatePropagation(); ev.preventDefault(); };
  if (FLX.swallow) { FLX.swallow = 0; if (T.closest('.bsh.flx, .fldock, .flpos')) return st(); }
  const pp = T.closest('.flpos'); if (pp) { st(); const b = T.closest('[data-flp]'); if (b) flPosAct(b.dataset.flp); return; }
  if (FLX.pos) { FLX.pos = null; flQA('.flpos').forEach((e) => e.remove()); if (!T.closest('.bsh.flx .fli, .fldock [data-fltr]')) { st(); return flRender(); } }
  const a = T.closest('[data-fl]'); if (a) { st(); return flAct(a.dataset.fl, a); }
  if (md === 'org') {
    if (T.closest('[data-a="shdone"]')) { FLX.pk = null; FLX.pos = null; FLX.open = false; return; }
    const trb = T.closest('.fldock [data-fltr]'); if (trb) { st(); const id = trb.dataset.fltr; FLX.pk = FLX.pk && FLX.pk.id === id ? null : { from: 'tray', id }; try { navigator.vibrate && navigator.vibrate(8); } catch {} return flRender(); }
    const t = T.closest('.flt[data-flt]'); if (t && FLX.pk) { st(); const [r, n, x] = t.dataset.flt.split(':').map(Number); return flTapPlace(r, n, x); }
    const fli = T.closest('.bsh.flx .fli'); if (fli) { st(); const u = fli.dataset.u, f = flFind(u); if (!f) return;
      if (FLX.pk && FLX.pk.u === u) { FLX.pk = null; return flRender(); }
      if (FLX.pk) return flTapPlace(f.r, f.o.n || 0, f.o.x - flPkW());
      FLX.pk = { from: 'shelf', u, id: f.o.t === 'b' ? f.o.id : f.o.t === 'p' ? f.o.ids[0] : '' };
      try { navigator.vibrate && navigator.vibrate(8); } catch {} return flRender(); }
    const ni = flNicheAt(T, ev.clientX); if (ni && FLX.pk) { st(); const R = ni.getBoundingClientRect(); return flTapPlace(+ni.dataset.r, +ni.dataset.n, ev.clientX - R.left - flPkW() / 2); } }
  if (md === 'deco') {
    const add = T.closest('[data-a="dkadd"]'); if (add) { st(); return flDecoAdd(add.dataset.k); }
    if (SHX_LBP && T.closest('.bsh [data-bid]')) return;
    const dk = T.closest('.bsh.flx .fli.fl-d'); if (dk) { st(); return flDecoSheet(dk.dataset.u); }
    if (T.closest('.bsh.flx .plq, .bsh.flx .bpl')) return;
    const ni = flNicheAt(T, ev.clientX); if (ni && !T.closest('[data-bid]')) { st(); FLX.ns = ni.dataset.r + ':' + ni.dataset.n; SHX_DKT = 'est'; FLX.dkx = false; return flRender(); } } }, true);

// ---------- depois de desenhar: congelar a 1ª vez, bandeja, painel ----------
{ const _sd = shDraw; shDraw = function (box) {
    const host = box && box.querySelector && box.querySelector(':scope > .v5host'), sr = host && host.shadowRoot, sr0 = FL_SR;
    if (SHX_MODE !== FLX.md) { FLX.pk = null; FLX.pos = null; FLX.open = false; FLX.filt = false; FLX.ns = null; FLX.swap = null; FLX.dkx = false; } FLX.md = SHX_MODE;
    if (sr) sr.querySelectorAll('.flpos,.flghost,.fltip').forEach((e) => e.remove());
    FL_SR = sr || sr0; FL_MAIN = 1; let r;
    try { r = _sd.apply(this, arguments);
      if (!FL_BUSY && flWanted() && !shc().free && flQ('.bsh:not(.sm) .bay')) { FL_BUSY = 1; try { const C0 = shc(); if (!C0.deco) { shDecoInit(); drawEstante(box); } if (flFreeze()) { shSave(); drawEstante(box); } } finally { FL_BUSY = 0; } }
      const R = flQ('.v5est'); if (R) { R.classList.toggle('flmode', flActive() && !!SHX_MODE);
        if (flActive() && SHX_MODE === 'org') { const sp = [...R.querySelectorAll('div[aria-hidden="true"]')].find((d) => /48vh/.test(d.getAttribute('style') || '')); if (sp) sp.style.height = (FLX.open ? 46 : 22) + 'vh'; }
        if (flActive() && SHX_MODE === 'deco') { const sp = [...R.querySelectorAll('div[aria-hidden="true"]')].find((d) => /44vh/.test(d.getAttribute('style') || '')); if (sp) sp.style.height = (FLX.dkx ? 70 : 36) + 'vh'; } }
      if (FLX.pos) requestAnimationFrame(flPosPanel);
    } catch (err) { console.warn('estante livre (desenho)', err); }
    finally { FL_MAIN = 0; FL_SR = sr0; }
    return r; }; }
// sair da tela no meio do arrasto: desfaz só o que estava pela metade (livro na mão, arrasto, painel de posição)
{ const _x = shExitEdit; shExitEdit = function () { const had = !!(FLX.D || FLX.pk || FLX.pos); try { if (window.flCancelDrag) window.flCancelDrag(); } catch {} FLX.pk = null; FLX.pos = null; FLX.open = false; FLX.filt = false; FLX.ns = null; FLX.swap = null; FLX.dkx = false;
    try { const sr = shBibRoot(); if (sr) sr.querySelectorAll('.flpos,.flghost,.fltip,.fldock,.flpill').forEach((e) => e.remove()); } catch {}
    const r = _x.apply(this, arguments); return r || had; }; }
// o aviso (toast) sobe para o topo também com a bandeja da estante livre aberta
{ const _tl = shToastLift; shToastLift = function (R) { const r = _tl.apply(this, arguments); try { const T = shToasts(); const d = R && R.querySelector('.fldock:not(.gone)'); if (T.length && d) T.forEach((t) => { t.style.setProperty('bottom', 'auto', 'important'); t.style.setProperty('top', 'calc(64px + env(safe-area-inset-top,0px))', 'important'); }); } catch {} return r; }; }
// redesenho de fundo não apaga o arrasto em curso: espera ele terminar
{ const _dt = drawTab; drawTab = function () { if (FLX.D && FLX.D.on) { clearTimeout(drawTab.__fl); drawTab.__fl = setTimeout(() => { try { drawTab(); } catch {} }, 700); return; } return _dt.apply(this, arguments); }; }
const SHX_CSSFL = `
.v4ler .bsh.flx .brow.flr{display:block;padding:0}
.v4ler .bsh.flx .nich{position:absolute;top:0;bottom:0}
.v4ler .bsh.flx .fli{position:absolute;bottom:0;display:block;transition:left .2s cubic-bezier(.2,.8,.2,1)}
.v4ler .bsh.flx .fli>.face{margin:0;display:block}.v4ler .bsh.flx .fli>.pile{margin:0 0 0 2px}.v4ler .bsh.flx .fli>.dec{margin:0 3px;display:block}
.v4ler .bsh.flx .ndv{position:absolute;top:-1px;bottom:0;width:${FL_INS * 2}px;z-index:4;background:linear-gradient(90deg,var(--bk-w3,#2f1f15),var(--bk-w1,#8e5f36) 35%,var(--bk-w2,#6b4a32) 70%,var(--bk-w3,#2f1f15));box-shadow:2px 0 5px rgba(0,0,0,.35),-1px 0 2px rgba(0,0,0,.25)}
.v4ler .bsh.flx.cubo .nich{box-shadow:inset 0 12px 16px -10px rgba(0,0,0,.55),inset 6px 0 10px -8px rgba(0,0,0,.5),inset -6px 0 10px -8px rgba(0,0,0,.5)}
.v4ler .bsh.flx.deco .ndv{cursor:ew-resize;touch-action:none}
.v4ler .bsh.flx.deco .ndv::before{content:"";position:absolute;left:-17px;right:-17px;top:0;bottom:0}
.v4ler .bsh.flx.deco .ndv::after{content:"";position:absolute;left:50%;top:46%;width:18px;height:46px;transform:translate(-50%,-50%);border-radius:10px;background:var(--acc);border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.45)}
.v4ler .bsh.flx.deco .ndv.on::after,.v4ler .bsh.flx.deco .ndv:focus-visible::after{outline:3px solid #fff;outline-offset:2px}
.v4ler .bsh.flx.deco .nich{cursor:pointer}.v4ler .bsh.flx.deco .nich.sel{box-shadow:inset 0 0 0 3px var(--acc)}
.v4ler .bsh.flx .nich.bg-noite{background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 22px),linear-gradient(180deg,#0e1430,#1d2650)}
.v4ler .bsh.flx .nich.bg-vinho{background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 22px),linear-gradient(180deg,#3a0f1a,#5e1a2a)}
.v4ler .bsh.flx .nich.bg-musgo{background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 22px),linear-gradient(180deg,#1d2b22,#2f4636)}
.v4ler .bsh.flx .nich.bg-creme{background:linear-gradient(180deg,rgba(0,0,0,.22),transparent 22px),linear-gradient(180deg,#e9dfcc,#f5efe3)}
.v4ler .bsh.flx .nich.bg-estrelas{background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 22px),radial-gradient(1.2px 1.2px at 20% 30%,#fff 60%,transparent),radial-gradient(1px 1px at 70% 18%,#fff 60%,transparent),radial-gradient(1.4px 1.4px at 45% 62%,#ffe7a8 60%,transparent),radial-gradient(1px 1px at 85% 54%,#fff 60%,transparent),radial-gradient(1px 1px at 12% 78%,#fff 60%,transparent),linear-gradient(180deg,#120f2a,#251c4a);background-size:auto,64px 64px,52px 52px,78px 78px,60px 60px,70px 70px,auto}
.v4ler .bsh.flx .nich.bg-listras{background:linear-gradient(180deg,rgba(0,0,0,.3),transparent 22px),repeating-linear-gradient(90deg,#cfa98a 0 10px,#c39878 10px 20px)}
.v4ler .bsh.flx .nich.nlt::after{content:"";position:absolute;left:6%;right:6%;top:0;height:92%;background:radial-gradient(55% 75% at 50% 0,rgba(255,206,140,.42),transparent 72%);pointer-events:none;z-index:3;mix-blend-mode:screen}
.v4ler .bsh.flx .nich.nlt2::after{background:radial-gradient(55% 75% at 50% 0,rgba(176,214,255,.42),transparent 72%)}
.v4ler .bsh.flx .nich .npk{position:absolute;left:50%;top:1px;width:28px;height:5px;margin-left:-14px;border-radius:0 0 7px 7px;background:#f6e2b4;box-shadow:0 0 10px 3px rgba(255,206,140,.75);z-index:4}
.v4ler .bsh.flx .nich.nlt2 .npk{background:#e3f0ff;box-shadow:0 0 10px 3px rgba(176,214,255,.75)}
.v4ler .bsh.flx.org .fli{touch-action:none;cursor:grab}.v4ler .bsh.flx.deco .fli.fl-d{touch-action:none;cursor:grab}
.v4ler .bsh.flx.org .fli *,.v4ler .bsh.flx .fli .dec{pointer-events:none}.v4ler .bsh.flx .fli .dec.lk{pointer-events:auto}.v4ler .bsh.flx:not(.org):not(.deco) .fli *{pointer-events:auto}.v4ler .bsh.flx:not(.org):not(.deco) .fli .dec:not(.lk){pointer-events:none}
.v4ler .bsh.flx.org,.v4ler .bsh.flx.deco,.v4ler .fldock,.v4ler .flpill,.v4ler.fldrag,.v4ler .fldrag{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.v4ler .bsh.flx .fli.flsel{filter:drop-shadow(0 0 5px var(--acc)) drop-shadow(0 0 2px var(--acc))}
.v4ler .bsh.flx .fli.flgrp{filter:drop-shadow(0 -3px 0 var(--acc)) drop-shadow(0 0 4px var(--acc));transform:translateY(-3px)}
.v4ler .bsh.flx.flpk .nich{box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--acc) 50%,transparent);cursor:copy}
.v4ler .bsh.flx .flt{position:absolute;bottom:64px;width:32px;height:44px;margin-left:-16px;border-radius:11px;border:2px solid #fff;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-size:21px;font-weight:900;line-height:1;box-shadow:0 3px 10px rgba(0,0,0,.4);z-index:6;cursor:pointer;padding:0;animation:flpul 1.6s ease-in-out infinite}
.v4ler .bsh.flx .flt.wide{left:50%;margin:0;transform:translateX(-50%);width:auto;padding:0 16px;font-size:14px;bottom:58px;white-space:nowrap;animation:none}
@keyframes flpul{50%{box-shadow:0 3px 10px rgba(0,0,0,.4),0 0 0 6px color-mix(in srgb,var(--acc) 30%,transparent)}}
.v4ler .bsh.flx .flslot{position:absolute;bottom:0;display:block;border:2px dashed var(--acc);border-radius:4px;background:color-mix(in srgb,var(--acc) 18%,transparent);z-index:5;pointer-events:none;transition:left .12s ease-out;box-sizing:border-box}
.v4ler .bsh.flx .flslot.bad{border-color:#e0574f;background:rgba(224,87,79,.18)}
.v4ler .flghost{position:fixed!important;left:0!important;top:0!important;margin:0!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important;pointer-events:none;z-index:10000;will-change:transform;width:auto!important}
.v4ler .flghost .gin{position:relative;transform:translateY(-10px) rotate(-3deg) scale(1.06);transform-origin:50% 100%;filter:drop-shadow(0 16px 14px rgba(0,0,0,.5))}
.v4ler .flghost .gin>.fli{position:absolute}
.v4ler .flghost,.v4ler .flghost *{pointer-events:none!important}
.v4ler .fltip{position:fixed;z-index:10001;padding:6px 11px;border-radius:999px;background:var(--ink);color:var(--bg);font-size:12px;font-weight:800;pointer-events:none;white-space:nowrap;transform:translate(-50%,-100%)}
.v4ler.fldrag,.v4ler .fldrag{cursor:grabbing}
.v4ler .fldock{position:fixed;left:0;right:0;bottom:var(--shx-tab,0px);z-index:9400;max-width:560px;margin:0 auto;box-sizing:border-box;background:var(--card);color:var(--ink);border-radius:18px 18px 0 0;box-shadow:0 -10px 28px rgba(0,0,0,.26);padding:2px 12px calc(10px + env(safe-area-inset-bottom,0px));transition:transform .26s cubic-bezier(.2,.8,.2,1)}
.v4ler .fldock.gone{transform:translateY(calc(100% + 24px))}
@media (prefers-reduced-motion: reduce){.v4ler .fldock,.v4ler .bsh.flx .fli,.v4ler .bsh.flx .flslot{transition:none}.v4ler .bsh.flx .flt{animation:none}}
.v4ler .flgrab{display:block;width:100%;height:22px;border:0;background:none;padding:0;cursor:pointer}.v4ler .flgrab i{display:block;width:42px;height:5px;border-radius:3px;background:var(--line);margin:8px auto 0}
.v4ler .fldock>.flbar:first-child{margin-top:8px}
.v4ler .flbar{display:flex;align-items:center;gap:8px}.v4ler .flbar b{flex:1;min-width:0;font-size:14px;line-height:1.2}.v4ler .flbar small{display:block;font-weight:600;font-size:12px;color:var(--ink2);margin-top:2px}
.v4ler .flic{width:44px;height:44px;border:0;border-radius:12px;background:var(--soft);color:var(--ink);display:grid;place-items:center;cursor:pointer;flex:none;padding:0}.v4ler .flic.on{background:var(--ink);color:var(--bg)}
.v4ler .flok{min-height:44px;padding:0 15px;border:0;border-radius:12px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:800;cursor:pointer;flex:none}
.v4ler .flrow{display:flex;gap:8px;align-items:center;margin-top:8px}
.v4ler .fllist{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0;padding:4px 2px 2px;touch-action:pan-x}
.v4ler .fllist::-webkit-scrollbar{display:none}
.v4ler .flc{flex:none;border:0;background:none;padding:0;cursor:grab;touch-action:pan-x;font:inherit;color:var(--ink2);font-size:11px;font-weight:700;width:42px;text-align:center}
.v4ler .flc .tc{display:block;width:42px;height:62px;border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,.3);position:relative;overflow:hidden}
.v4ler .flc .tc .cv,.v4ler .flpill .pkc .cv{position:absolute;inset:0;width:100%!important;height:100%!important;margin:0!important;border-radius:0!important;font-size:7px!important;line-height:1.1;padding:3px!important;box-sizing:border-box;display:block;background-size:cover!important;background-position:center!important;overflow:hidden}
.v4ler .flc .tc .cv.img{color:transparent!important}
.v4ler .flc.on .tc{outline:3px solid var(--acc);outline-offset:2px}
.v4ler .fldock.open .fllist{flex-wrap:wrap;max-height:36vh;overflow-y:auto;touch-action:pan-y}
.v4ler .fldock.open .flc{width:58px;touch-action:pan-y}.v4ler .fldock.open .flc .tc{width:58px;height:86px}.v4ler .fldock.open .flc .tc .cv{font-size:9px!important}
.v4ler .flc .tl{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:4px;line-height:1.2}
.v4ler .flfil{display:grid;gap:6px;margin-top:8px}.v4ler .flfil .dchips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}
.v4ler .flpill{position:fixed;left:12px;right:12px;bottom:calc(var(--shx-tab,0px) + 12px + env(safe-area-inset-bottom,0px));z-index:9400;max-width:520px;margin:0 auto;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 10px;border-radius:16px;background:var(--ink);color:var(--bg);box-shadow:0 8px 22px rgba(0,0,0,.32)}
.v4ler .flpill .pkc{width:26px;height:38px;border-radius:2px;flex:none;position:relative;overflow:hidden;background:var(--soft)}.v4ler .flpill b{flex:1;min-width:0;font-size:13px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v4ler .flpill small{display:block;font-weight:600;opacity:.85;font-size:12px;white-space:normal}
.v4ler .flpill button{min-height:44px;padding:0 14px;border:0;border-radius:11px;background:var(--bg);color:var(--ink);font:inherit;font-weight:800;cursor:pointer;flex:none}
.v4ler .flpos{position:fixed;z-index:10002;width:min(330px,calc(100vw - 24px));box-sizing:border-box;padding:10px;border-radius:16px;background:var(--card);color:var(--ink);box-shadow:0 14px 34px rgba(0,0,0,.38);border:1px solid var(--line);animation:flpin .16s ease-out}
@keyframes flpin{from{opacity:0;transform:translateY(6px)}}
.v4ler .flpos::after{content:"";position:absolute;left:var(--ax,50%);bottom:-8px;width:14px;height:14px;margin-left:-7px;background:var(--card);border-right:1px solid var(--line);border-bottom:1px solid var(--line);transform:rotate(45deg)}
.v4ler .flpos.below::after{bottom:auto;top:-8px;transform:rotate(225deg)}
.v4ler .flpos .fph{display:flex;align-items:center;gap:8px;margin-bottom:8px}.v4ler .flpos .fph b{flex:1;min-width:0;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v4ler .flpos .ok{min-height:40px;padding:0 15px;border:0;border-radius:10px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:800;cursor:pointer}
.v4ler .flpos .fpc{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
.v4ler .flpos .fpc button{min-height:44px;border:1px solid var(--line);border-radius:10px;background:var(--soft);color:var(--ink);font:inherit;font-size:12px;font-weight:800;padding:0 2px;cursor:pointer}
.v4ler .flpos .fpc button.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.v4ler .flpos .fplb{margin-top:6px;width:100%;min-height:44px;border:0;border-radius:10px;background:none;color:var(--ink);font:inherit;font-weight:800;font-size:13px;text-align:left;padding:0 4px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.v4ler .flst{display:flex;overflow-x:auto;scrollbar-width:none;gap:6px;margin:4px -2px 0;padding:0 2px 2px}.v4ler .flst::-webkit-scrollbar{display:none}
.v4ler .flst button{flex:0 0 76px;display:grid;justify-items:center;gap:4px;padding:6px 2px;min-height:64px;border:1px solid var(--line);border-radius:12px;background:var(--soft);color:var(--ink);font:inherit;font-size:11.5px;font-weight:800;line-height:1.15;cursor:pointer}
.v4ler .flst button.on{outline:3px solid var(--acc);outline-offset:-1px}.v4ler .flst svg{width:40px;height:32px}
.v4ler .bsh.flx.org .sp,.v4ler .bsh.flx.org .pb,.v4ler .bsh.flx.org .face,.v4ler .bsh.flx .fli{outline:none}
.v4ler .bsh.flx .fli .sp,.v4ler .bsh.flx .fli .pb,.v4ler .bsh.flx .fli .face,.v4ler .bsh.org .sp,.v4ler .bsh.org .pb,.v4ler .bsh.org .face{outline:none!important}
.v4ler .dkpan.flp{max-height:38vh;transition:max-height .25s ease;padding-top:2px;display:flex;flex-direction:column}.v4ler .dkpan.flp.flbig{max-height:74vh}
.v4ler .dkpan.flp .flgrab2{display:block;width:100%;height:22px;margin:0;border:0;background:none;padding:0;cursor:pointer;position:relative;flex:none}
.v4ler .dkpan.flp .flgrab2::after{content:"";position:absolute;left:50%;top:9px;width:40px;height:5px;margin-left:-20px;border-radius:3px;background:var(--line)}
.v4ler .dkpan.flp .dtabs,.v4ler .dkpan.flp .dtabs.six{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;flex:none;margin-bottom:6px;grid-template-columns:none}
.v4ler .dkpan.flp .dtabs::-webkit-scrollbar{display:none}.v4ler .dkpan.flp .dtabs button{flex:none;padding:0 13px;min-height:40px;font-size:13px;white-space:nowrap}
.v4ler .dkpan.flp .dbody{flex:1;min-height:0;overflow-y:auto}.v4ler .dkpan.flp .dkfoot{flex:none;margin-top:6px}.v4ler .dkpan.flp .dkfoot .flic{width:44px;height:44px}
.v4ler .dkpan.flp .dchips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}
.v4ler .flsw{display:inline-block;width:14px;height:14px;border-radius:4px;margin-right:6px;vertical-align:-2px;border:1px solid rgba(0,0,0,.2);background:var(--bk-back,#2a2a3a)}
.v4ler .flsw.sw-noite{background:#1d2650}.v4ler .flsw.sw-vinho{background:#5e1a2a}.v4ler .flsw.sw-musgo{background:#2f4636}.v4ler .flsw.sw-creme{background:#f0e8d8}.v4ler .flsw.sw-estrelas{background:radial-gradient(1.5px 1.5px at 30% 40%,#fff 60%,transparent),radial-gradient(1.5px 1.5px at 70% 65%,#ffe7a8 60%,transparent),#251c4a}.v4ler .flsw.sw-listras{background:repeating-linear-gradient(90deg,#cfa98a 0 3px,#c39878 3px 6px)}
`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-shxfl]')) { const st = document.createElement('style'); st.dataset.shxfl = 1; st.textContent = SHX_CSSFL; sr.append(st); } } catch {} }; }
try { SHX_ROOTS.forEach((sr) => { if (sr && !sr.querySelector('style[data-shxfl]')) { const st = document.createElement('style'); st.dataset.shxfl = 1; st.textContent = SHX_CSSFL; sr.append(st); } }); } catch {}
// ===================== fim Estante livre =====================
