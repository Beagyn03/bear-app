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
const FLX = { pk: null, sel: null, posG: null, pos: null, open: false, filt: false, ns: null, swap: null, D: null, swallow: 0, dkx: false, md: null };
let FL_ARRW = null; // folha Arrumar por aberta (volta para a tela depois de cada redesenho da prévia)
let FL_PV = null; // prévia do Arrumar por: { free, plq } desenhada sem salvar
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
function flPx(F) { const BW = flBW(); FL_HBW = BW; (F.rows || []).forEach((row) => { row.it.forEach((o) => { if (o.f != null) o.x = Math.round(o.f * flNW(row, o.n || 0, BW)); else if (o.x == null) o.x = 0; }); flGlue(row, BW); }); }
// livros encostados andam juntos (Bia 23/11): na edição a prateleira é mais estreita e a fração sozinha abria espaço
// entre eles na largura cheia. o.g = encostado no anterior; o.ar = bloco encostado na parede direita (ancora à direita)
function flGlue(row, BW) { for (let n = 0; n < flNiches(row); n++) { const NW = flNW(row, n, BW), L = row.it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => (a.f != null && z.f != null ? a.f - z.f : a.x - z.x));
    let i = 0, pe = 0; while (i < L.length) { let j = i, tot = flW(L[i]); while (j + 1 < L.length && L[j + 1].g) { j++; tot += flW(L[j]); }
      let x0 = L[i].ar ? NW - tot : L[i].x; if (L[i].ar) x0 = Math.max(x0, pe); for (let k = i; k <= j; k++) { L[k].x = Math.round(x0); x0 += flW(L[k]); } pe = x0; i = j + 1; } } }
function flGlueMark(row, BW) { for (let n = 0; n < flNiches(row); n++) { const NW = flNW(row, n, BW), L = row.it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => a.x - z.x);
    L.forEach((o, i) => { const g = i > 0 && Math.abs(o.x - (L[i - 1].x + flW(L[i - 1]))) <= 2; if (g) o.g = 1; else delete o.g; delete o.ar; });
    // bloco que termina na parede direita fica ancorado nela (só se não começa na parede esquerda)
    let i = L.length - 1; if (i >= 0 && L[i].x + flW(L[i]) >= NW - 2) { while (i > 0 && L[i].g) i--; if (L[i].x > 2) L[i].ar = 1; } } }
function flFrac(F) { const BW = FL_HBW || flBW(); (F.rows || []).forEach((row) => { try { flGlueMark(row, BW); } catch {} row.it.forEach((o) => { const NW = flNW(row, o.n || 0, BW); o.f = NW > 0 ? Math.round(Math.max(0, o.x || 0) / NW * 10000) / 10000 : 0; }); }); }
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
  if (flFit(arr, NW)) return arr; let e = 0; arr.forEach((o) => { o.x = Math.max(o.x, e); e = o.x + o.w; }); arr.over = 1; return arr; }
function flItems(r, n) { return shc().free.rows[r].it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => a.x - z.x); }
function flFind(u) { const F = shc().free; if (!F) return null; for (let r = 0; r < F.rows.length; r++) { const o = F.rows[r].it.find((x) => x.u === u); if (o) return { r, o }; } return null; }
function flGroupOf(r, u) { const L = flItems(r, flFind(u).o.n || 0), i = L.findIndex((o) => o.u === u); let a = i, z = i;
  while (a > 0 && L[a].x - (L[a - 1].x + flW(L[a - 1])) <= 2) a--; while (z < L.length - 1 && L[z + 1].x - (L[z].x + flW(L[z])) <= 2) z++; return L.slice(a, z + 1); }
const flStructOf = (F) => ({ st: F.st, rows: F.rows.map((r) => ({ dv: (r.dv || []).slice(), nb: JSON.parse(JSON.stringify(r.nb || [])) })) });
function flNewRow(F, rowsDef) { const r = F.rows.length, d = rowsDef && rowsDef[r]; F.rows.push({ dv: d ? d.dv.slice() : flTplDv(F.st, r), nb: d ? JSON.parse(JSON.stringify(d.nb || [])) : [], it: [] }); return F.rows[r]; }
// reorganiza tudo, na ordem de leitura, numa estrutura nova (os espaços entre grupos se fecham)
function flUnpile(all, maxW) { for (let i = 0; i < all.length; i++) { const o = all[i]; if (o.t === 'p' && flW(o) > maxW) { all.splice(i, 1, ...o.ids.map((id) => ({ u: flUid(), t: 'b', id, n: o.n, x: o.x }))); i += o.ids.length - 1; } } return all; }
function flReflow(F, st, rowsDef) { const BW = flBW(), all = [], zs = []; F.rows.forEach((row, ri) => row.it.forEach((o) => { if (o.z) zs.push({ o, ri }); })); F.rows.forEach((row) => { for (let n = 0; n < flNiches(row); n++) row.it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => a.x - z.x).forEach((o) => all.push(o)); });
  let minNW = 1e9; for (let r = 0; r < 4; r++) { const rw = { dv: rowsDef && rowsDef[r] ? rowsDef[r].dv : flTplDv(st, r) }; for (let n = 0; n < flNiches(rw); n++) minNW = Math.min(minNW, flNW(rw, n, BW)); } flUnpile(all, minNW);
  const nR = Math.max(3, F.rows.length); F.st = st; F.rows = []; let row = flNewRow(F, rowsDef), n = 0, cur = 0, NW = flNW(row, 0, BW);
  all.forEach((o) => { const w = flW(o); let g = 0; while (cur + w > NW && !(cur === 0 && w > NW) && g++ < 60) { if (n < flNiches(row) - 1) { n++; cur = 0; NW = flNW(row, n, BW); } else { row = flNewRow(F, rowsDef); n = 0; cur = 0; NW = flNW(row, 0, BW); } }
    o.n = n; o.x = cur; cur += w; row.it.push(o); });
  while (F.rows.length < nR) flNewRow(F, rowsDef); zs.forEach(({ o, ri }) => { const row = F.rows[Math.min(ri, F.rows.length - 1)]; o.n = Math.min(o.n || 0, flNiches(row) - 1); row.it.push(o); }); }
// nada sobra fora do nicho: o que não cabe passa para o começo do próximo
function flNormalize(F) { const BW = flBW();
  for (let r = 0; r < F.rows.length; r++) { const row = F.rows[r]; for (let n = 0; n < flNiches(row); n++) { let g = 0;
    while (g++ < 200) { const its = row.it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => a.x - z.x).map((o) => ({ o, x: o.x, w: flW(o) }));
      if (flFit(its, flNW(row, n, BW))) { its.forEach((q) => { q.o.x = Math.round(q.x); }); break; }
      if (its.length === 1) { const o = its[0].o; if (o.t === 'p') { row.it.splice(row.it.indexOf(o), 1, ...o.ids.map((id, j) => ({ u: flUid(), t: 'b', id, n, x: j }))); continue; } o.x = 0; break; }
      const last = its[its.length - 1].o; row.it.splice(row.it.indexOf(last), 1);
      let tr = row, tn = n + 1; if (tn >= flNiches(row)) { tr = F.rows[r + 1] || flNewRow(F); tn = 0; } last.n = tn; last.x = -1; tr.it.push(last); } } } }
// livro novo: fim do grupo mais à direita que tiver espaço, ou o primeiro vão; senão, prateleira nova
function flAdd(F, o) { const BW = flBW(), w = flW(o);
  for (const row of F.rows) for (let n = 0; n < flNiches(row); n++) { const NW = flNW(row, n, BW), its = row.it.filter((q) => (q.n || 0) === n && !q.z).sort((a, z) => a.x - z.x);
    let prev = 0; const gaps = []; its.forEach((q) => { gaps.push([prev, q.x]); prev = q.x + flW(q); }); gaps.push([prev, NW]);
    const g = gaps.slice(1).concat(gaps.slice(0, 1)).find(([a, z]) => z - a >= w); if (g) { o.n = n; o.x = Math.round(g[0]); row.it.push(o); return; } }
  const row = flNewRow(F); o.n = 0; o.x = 0; row.it.push(o); }
// estante x Biblioteca: tira o que saiu, põe o que entrou (fora o que está na bandeja)
function flSync(list) { const C0 = shc(), F = FL_PV ? FL_PV.free : C0.free, ids = new Set(list.map((b) => b.id)), tray = new Set(C0.tray || []), have = new Set(); let ch = 0;
  F.rows.forEach((row) => { row.it = row.it.filter((o) => { if (o.t === 'b') { if (!ids.has(o.id) || tray.has(o.id) || have.has(o.id)) { ch = 1; return false; } have.add(o.id); }
    if (o.t === 'p') { const k = o.ids.filter((id) => ids.has(id) && !tray.has(id) && !have.has(id)); if (k.length !== o.ids.length) { ch = 1; o.ids = k; } k.forEach((id) => have.add(id)); return k.length > 0; } return true; }); });
  list.forEach((b) => { if (!have.has(b.id) && !tray.has(b.id)) { flAdd(F, { u: flUid(), t: 'b', id: b.id }); ch = 1; } });
  while (F.rows.length < 3) flNewRow(F); if (ch && !FL_PV) shSave(); }
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
function flPileHTML(ids, md, o) { return `<span class="pile">${ids.map((id, j) => { const on = o && flPbOn(o, id), num = o ? flSelNum(o, id) : 0; const x = shById(id); if (!x) return ''; const G = spnGeo(x, false), [c, k] = spnColors(x), ov = shEdOf(x), wv = Math.round(G.h * 0.86) - j * 3, ht = Math.max(13, Math.min(26, Math.round(G.w * 0.8)));
  const fe = ov.t === 'bp' || ov.t === 'ep', act = md ? '' : shAct(x, true);
  return `<span class="pb${(G.h0 >>> 4) % 2 ? ' sf' : ''}${fe ? ' fe' : ''}${on ? ' flpbsel' : ''}" role="button" tabindex="0" data-bid="${esc(x.id)}" aria-label="${esc(x.t)}, deitado"${act} style="width:${wv}px;height:${ht}px;--c:${c};--k:${k}${fe ? `;--eg:${ov.t === 'ep' ? '#d9b45a' : (ov.e || '#b3283f')}` : ''};margin-left:${(G.h0 % 9) - 2}px">${fe ? '' : `<span>${esc(x.t)}</span>`}${num ? `<i class="flnum">${num}</i>` : ''}</span>`; }).join('')}</span>`; }
// chave de seleção: 'u' (peça inteira) ou 'u|livro' (um livro de dentro da pilha)
const flKeyOf = (u, bid) => (bid ? u + '|' + bid : u);
function flPbOn(o, id) { const P = FLX.pk; if (P && P.u === o.u && (!P.pb || P.pb === id)) return true; const S0 = FLX.sel; return !!(S0 && S0.src === 'shelf' && (S0.ids.includes(o.u) || S0.ids.includes(o.u + '|' + id))); }
function flSelNum(o, id) { const S0 = FLX.sel; if (!S0 || S0.src !== 'shelf') return 0; let n = 0; for (const k of S0.ids) { const [u, b] = k.split('|'); const f = flFind(u); if (!f) continue;
    if (b) { n++; if (u === o.u && b === id) return n; } else if (f.o.t === 'p') { for (const x of f.o.ids) { n++; if (u === o.u && x === id) return n; } } else { n++; if (u === o.u && (o.t !== 'p')) return n; } } return 0; }
const flSelCount = () => { const S0 = FLX.sel; if (!S0) return 0; if (S0.src === 'tray') return S0.ids.length; return S0.ids.reduce((a, k) => { const [u, b] = k.split('|'); if (b) return a + 1; const f = flFind(u); return a + (f && f.o.t === 'p' ? f.o.ids.length : 1); }, 0); };
// tira um livro de dentro da pilha (os de cima descem; se sobrar 1, ele continua deitado) e devolve uma peça nova, deitada, ainda fora da estante
function flExtract(key) { const [u, bid] = String(key).split('|'), f = flFind(u); if (!f) return null; if (!bid) return f.o;
  const o = f.o; if (o.t !== 'p' || !o.ids.includes(bid)) return null; o.ids = o.ids.filter((x) => x !== bid); if (!o.ids.length) { const row = shc().free.rows[f.r]; row.it = row.it.filter((x) => x !== o); }
  return { u: flUid(), t: 'b', id: bid, n: o.n, x: o.x }; } // o livro tirado da pilha fica em pé (o painel de posição deixa deitar de novo)
// põe um livro dentro de uma pilha, antes de outro (ou no topo)
function flIntoPile(srcKey, tu, before) { const C0 = shc(), bk = shBk(), [su, sb] = String(srcKey).split('|'); let id = sb;
  if (!id) { const f = flFind(su); if (!f || f.o.t !== 'b') return toast('Só um livro por vez entra na pilha'); id = f.o.id; const row = C0.free.rows[f.r]; row.it = row.it.filter((x) => x !== f.o); if (C0.pos) delete C0.pos[id]; }
  else if (su !== tu) { const ex = flExtract(srcKey); if (!ex) return; }
  const t = flFind(tu); if (!t || t.o.t !== 'p') { shRestore(bk); return; } let ids = t.o.ids.filter((x) => x !== id); let i = before ? ids.indexOf(before) : ids.length; if (i < 0) i = ids.length;
  // mesma pilha: troca os dois de lugar (tocar no de cima e depois no de baixo põe um no lugar do outro)
  if (su === tu && sb && before && t.o.ids.includes(sb)) { const a0 = t.o.ids.slice(), ia = a0.indexOf(sb), ib = a0.indexOf(before); if (ia >= 0 && ib >= 0) { [a0[ia], a0[ib]] = [a0[ib], a0[ia]]; ids = a0.filter((x) => x !== id); i = a0.indexOf(id); } }
  if (ids.length >= 8) { shRestore(bk); return toast('Pilha cheia (8 livros)'); }
  ids.splice(i, 0, id); t.o.ids = ids; const row = C0.free.rows[t.r], its = row.it.filter((x) => (x.n || 0) === (t.o.n || 0) && !x.z).sort((a, z) => a.x - z.x).map((x) => ({ o: x, x: x.x, w: flW(x) }));
  if (!flFit(its, flNW(row, t.o.n || 0, flBW()))) { let e = 0; its.forEach((q) => { q.x = Math.max(q.x, e); e = q.x + q.w; }); its.forEach((q) => { q.o.x = Math.round(q.x); }); flNormalize(C0.free); } else its.forEach((q) => { q.o.x = Math.round(q.x); });
  C0.manual = 1; C0.arr = null; FLX.pk = null; FLX.sel = null; FLX.pos = null; shSave(); toast(su === tu && sb ? 'Pilha reordenada' : 'Livro deitado na pilha', shUndo(bk)); flRender(); }
function flItemHTML(o, x, md) { const P = shc().pos || {}; let inner = '';
  if (o.t === 'b') { const b = shById(o.id); if (!b) return '';
    inner = flFace(o.id) ? `<button type="button" class="face" data-bid="${esc(b.id)}"${md ? '' : shAct(b, true)} aria-label="${esc(b.t)}, de frente">${v4cv({ title: b.t, cover: b.img })}</button>` : spnHTML(P[o.id] === 'lean' ? { ...b, lean: 1 } : b, false); }
  else if (o.t === 'p') inner = flPileHTML(o.ids, md, o);
  else if (o.t === 'd') { if (!SH_DEC[o.k]) return ''; const d = { k: o.k, ...(o.o || {}) }, lb = !md && o.k === 'leitor' && typeof shLeitorBook === 'function' ? shLeitorBook(d) : null;
    inner = `<span class="dec${lb ? ' lk' : ''}"${lb ? `${shAct(lb, false)} role="button" tabindex="0" aria-label="Leitor digital: ${esc(lb.t)}"` : ''}>${SH_DEC[o.k](1, d)}</span>`; }
  const sel = o.t === 'p' ? (FLX.pos === o.u || (FLX.posG && FLX.posG.includes(o.u))) : (FLX.pos === o.u || (FLX.posG && FLX.posG.includes(o.u)) || (FLX.pk && FLX.pk.u === o.u) || (FLX.sel && FLX.sel.src === 'shelf' && FLX.sel.ids.includes(o.u)));
  const num = o.t === 'b' ? flSelNum(o, o.id) : 0;
  const lab = o.t === 'd' && md ? ` role="button" tabindex="${md === 'deco' ? 0 : -1}" aria-label="${esc(SH_DN[o.k] || 'Enfeite')}${md === 'deco' ? ': toque para trocar ou tirar, ou arraste' : ''}"` : '';
  return `<span class="fli fl-${o.t}${sel ? ' flsel' : ''}${o.t === 'p' && FLX.fan === o.u ? ' flfan' : ''}" data-u="${o.u}" style="left:${Math.round(x)}px"${lab}>${inner}${num ? `<i class="flnum">${num}</i>` : ''}</span>`; }
function flKeyW(k) { const [u, b] = String(k).split('|'); if (b) return flW({ t: 'b', id: b }); const f = flFind(u); return f ? flW(f.o) : 0; }
function flPkW() { if (FLX.sel && FLX.sel.ids.length) { const S0 = FLX.sel; return S0.src === 'tray' ? S0.ids.reduce((a, id) => a + flW({ t: 'b', id }), 0) : S0.ids.reduce((a, k) => a + flKeyW(k), 0); } const P = FLX.pk; if (!P) return 0; if (P.pb) return flW({ t: 'b', id: P.pb }); if (P.from === 'tray') return flW({ t: 'b', id: P.id }); const f = flFind(P.u); return f ? flW(f.o) : 20; }
function flTargets(r, n, its, NW, w) {
  if (!its.length) return NW >= w ? `<button type="button" class="flt wide" data-flt="${r}:${n}:${Math.max(0, Math.round((NW - w) / 2))}" aria-label="Guardar aqui: ${r + 1}ª prateleira${n ? ', parte ' + (n + 1) : ''}">+ guardar aqui</button>` : '';
  const groups = []; its.forEach((q, i) => { if (!i || q.x - (its[i - 1].x + its[i - 1].w) > 2) groups.push([q]); else groups[groups.length - 1].push(q); });
  const spots = [], used = its.reduce((s, q) => s + q.w, 0);
  groups.forEach((g, gi) => { const a = g[0].x, e = g[g.length - 1].x + g[g.length - 1].w, next = groups[gi + 1] ? groups[gi + 1][0].x : NW;
    if (gi === 0 && a >= w) spots.push([a - w, a]); if (next - e >= w) spots.push([e, e]); });
  if (!spots.length && NW - used >= w) { const L = its[its.length - 1]; spots.push([L.x + L.w, L.x + L.w]); }
  return spots.map(([x, at]) => `<button type="button" class="flt" data-flt="${r}:${n}:${Math.round(x)}" style="left:${Math.round(at)}px" aria-label="Colocar aqui, ${r + 1}ª prateleira">+</button>`).join(''); }
function flHTML(list0) { const C0 = shc(), F = FL_PV ? FL_PV.free : C0.free, md = shMode(), BW = flBW(); if (typeof SHX_LTN !== 'undefined') SHX_LTN = 0; flPx(F); flSync(list0);
  const PK = (FLX.pk || (FLX.sel && FLX.sel.ids.length)) && md === 'org', pkW = PK ? flPkW() : 0;
  const rowsH = F.rows.map((row, k) => { const bnd = flBounds(row); let nich = '', dvs = '';
    for (let n = 0; n < bnd.length - 1; n++) { const li = n > 0 ? FL_INS : 0, ri = n < bnd.length - 2 ? FL_INS : 0, NW = flNW(row, n, BW), nb = (row.nb && row.nb[n]) || {};
      const its = row.it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => a.x - z.x).map((o) => ({ o, x: o.x, w: flW(o) })); let sc = 1; if (!flFit(its, NW)) { const tot = its.reduce((a, q) => a + q.w, 0); sc = tot > NW && NW > 0 ? Math.max(0.6, NW / tot) : 1; its.reduce((e, q) => { q.x = e; return e + q.w * sc; }, 0); }
      // prateleira cheia (estante arrumada noutra largura): estreita as peças por igual em vez de transbordar
      let h = its.map((q) => { const t = flItemHTML(q.o, q.x, md); return sc < 1 ? t.replace(/style="left:([\d.-]+)px"/, `style="left:$1px;transform:scaleX(${sc.toFixed(3)});transform-origin:0 100%"`) : t; }).join(''); if (PK) h += flTargets(k, n, its, NW, pkW); h += row.it.filter((o) => o.z && (o.n || 0) === n).map((o) => flItemHTML(o, Math.max(0, Math.min(NW - flW(o), o.x || 0)), md).replace('class="fli ', 'class="fli flz ')).join('');
      const sel = md === 'deco' && FLX.ns === k + ':' + n;
      nich += `<div class="nich${nb.bg ? ' bg-' + esc(nb.bg) : ''}${nb.lt ? ' nlt nlt' + esc(String(nb.lt)) : ''}${sel ? ' sel' : ''}" data-r="${k}" data-n="${n}" style="left:calc(${(bnd[n] * 100).toFixed(3)}% + ${li}px);width:calc(${((bnd[n + 1] - bnd[n]) * 100).toFixed(3)}% - ${li + ri}px)">${nb.lt ? '<i class="npk" aria-hidden="true"></i>' : ''}${h}</div>`;
      if (n > 0) dvs += `<span class="ndv" data-r="${k}" data-i="${n - 1}" style="left:calc(${(bnd[n] * 100).toFixed(3)}% - ${FL_INS}px)"${md === 'deco' ? ` role="slider" tabindex="0" aria-label="Divisória da ${k + 1}ª prateleira: arraste ou use as setas" aria-valuenow="${Math.round(bnd[n] * 100)}" aria-valuemin="5" aria-valuemax="95"` : ' aria-hidden="true"'}></span>`; }
    const pq = ((FL_PV ? FL_PV.plq : C0.plq) || []).map((q, i) => ({ ...q, i })).filter((q) => q.r === k && q.t).map((q) => `<span class="plq s-${esc(q.s || 'mad')}${md === 'deco' ? ' u' : ''}" style="left:${Math.max(4, Math.min(96, (q.p == null ? 0.5 : q.p) * 100)).toFixed(1)}%"${md === 'deco' ? ` data-pq="${q.i}" role="button" tabindex="0"` : ''}>${esc(String(q.t).slice(0, 24))}</span>`).join('');
    return `<div class="bay fl" data-r="${k}">${shLtRow(k, false, 'b')}<div class="brow flr">${nich}${dvs}</div></div><div class="bpl"${pq ? '' : ' aria-hidden="true"'} data-r="${k}">${shLtRow(k, false, 'f')}${pq}</div>`; }).join('');
  const hint = md ? '' : `<div class="hint"><span><i class="k1"></i>lendo</span><span><i class="k2">✦</i>lido</span><span class="r">Minha arrumação · toque abre · segure para opções</span></div>`;
  const ltOff = C0.lt && C0.lt.on === 0;
  const cls = `bsh flx${md ? ' ' + md : ''}${shDark() ? ' dk' : ''}${/^c[23]$/.test(F.st) ? ' cubo' : ''}${PK ? ' flpk' : ''}${md === 'deco' && SHX_LBP ? ' lbp' : ''} w-${C0.wall || 'linho'} lt-${ltOff ? 'off' : (C0.lt && C0.lt.c) || 'quente'}`;
  return `<div class="${cls}" style="${shWoodVars(C0.wood)}">${hint}<div class="case">${shLtFrame(false)}<div class="crown"></div>${rowsH}</div></div>`; }
{ const _p = pratHTML; pratHTML = function (list0, sm, wBsh) { try { if (!sm && FL_MAIN && flActive()) { FL_WB = wBsh || FL_WB; return flHTML(list0); } } catch (err) { console.warn('estante livre', err); } return _p.apply(this, arguments); }; }

// ---------- bandeja compacta, pílula do livro na mão, painel de posição ----------
const FL_FILT = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>';
// capa pequena própria (sem a classe .cv: segurar na bandeja seleciona, não abre o menu do livro)
const flCv = (b) => { if (b.img) return '<span class="flcv img" style="background-image:' + cssUrl(b.img) + '"></span>'; let c = '#7e63c9'; try { c = colorOf(b.t || ''); } catch {} return '<span class="flcv" style="background:linear-gradient(160deg,' + c + ',#1b1426)">' + esc(b.t || '') + '</span>'; };
function flDock() { const C0 = shc(), tr = Array.isArray(C0.tray) && C0.tray.length ? C0.tray : null, L = tr ? shTrayList() : [], SL = FLX.sel, ns = flSelCount(), gone = !!(FLX.pk || FLX.pos) || (SL && SL.src === 'shelf' && ns > 0);
  const cvs = L.map((b) => { const si = SL && SL.src === 'tray' ? SL.ids.indexOf(b.id) : -1; return `<button type="button" class="flc${(FLX.pk && FLX.pk.id === b.id) || si >= 0 ? ' on' : ''}${SL ? ' sel' : ''}" data-fltr="${esc(b.id)}" data-id="${esc(b.id)}" aria-pressed="${si >= 0}" aria-label="${esc(b.t)}${SL ? (si >= 0 ? ': selecionado, toque para tirar' : ': toque para selecionar') : ': arraste até a estante, ou toque e escolha o lugar; segure para selecionar vários'}"><span class="tc">${flCv(b)}${si >= 0 ? `<i class="flnum">${si + 1}</i>` : ''}</span>${FLX.open ? `<span class="tl">${esc(b.t)}</span>` : ''}</button>`; }).join('');
  const pill = SL ? `<div class="flpill flsp" role="status"><b>${ns ? ns + ' selecionado' + (ns > 1 ? 's' : '') : 'Toque para selecionar'}</b><button type="button" data-fl="selx">Cancelar</button></div>` : FLX.pk ? (() => { const b = shById(FLX.pk.id) || { t: FLX.pk.id ? '' : 'Enfeite' }; return `<div class="flpill" role="status"><span class="pkc">${b.id ? flCv(b) : ''}</span><b>${esc(b.t || 'Item')}<small>Toque onde ele vai ficar, ou arraste até lá</small></b><button type="button" data-fl="pkx">Cancelar</button></div>`; })() : '';
  if (!tr || FLX.trayHide) return pill;
  return `<div class="fldock${gone ? ' gone' : ''}${FLX.open ? ' open' : ''}" role="region" aria-label="Organizar a estante"${gone ? ' aria-hidden="true"' : ''}>
    ${tr ? `<button type="button" class="flgrab" data-fl="dock" aria-label="${FLX.open ? 'Recolher' : 'Abrir'} a bandeja" aria-expanded="${FLX.open}"><i></i></button>` : ''}
    <div class="flbar"><b>Livros para guardar · ${tr.length}</b></div>
    ${tr ? `<div class="flrow"><button type="button" class="flic flf${FLX.filt ? ' on' : ''}" data-fl="filt" aria-label="Filtrar e ordenar a bandeja" aria-expanded="${FLX.filt}">${FL_FILT}</button><div class="fllist">${cvs || '<p class="mut" style="margin:6px 2px">Nenhum livro com esse filtro.</p>'}</div></div>
      ${FLX.filt ? `<div class="flfil">${shChips('shtrayf', SHX_TRF, [['todos', 'Todos'], ['lendo', 'Lendo'], ['quero', 'Quero ler'], ['lido', 'Lidos'], ['outros', 'Outros']])}${shChips('shtrays', SHX_TRS, [['ord', 'Ordem atual'], ['cor', 'Cor'], ['autor', 'Autor'], ['titulo', 'Título']])}</div>` : ''}` : ''}
  </div>${pill}`; }
{ const _b = shOrgBanner; shOrgBanner = function () { return flActive() ? '' : _b.apply(this, arguments); }; }
{ const _pn = shOrgPanel; shOrgPanel = function () { return flActive() ? flDock() : _pn.apply(this, arguments); }; }
function flPosPanel() { const sr = shBibRoot(); if (!sr) return; sr.querySelectorAll('.flpos').forEach((e) => e.remove()); if (!FLX.pos || (SHX_MODE !== 'org' && SHX_MODE !== 'deco') || !flActive()) return; const f = flFind(FLX.pos); if (!f) { FLX.pos = null; return; }
  const o = f.o, id = o.t === 'b' ? o.id : o.t === 'p' ? o.ids[0] : null; if (!id && o.t !== 'd') { FLX.pos = null; return; } const b = id ? shById(id) : { t: SH_DN[o.k] || 'Enfeite' }, P = shc().pos || {}; if (!b) return;
  const cur = o.t === 'p' ? 'dei' : P[id] === 'face' ? 'fre' : P[id] === 'lean' ? 'inc' : 'pe', el = sr.querySelector(`.bsh.flx .fli[data-u="${o.u}"]`), R = sr.querySelector('.v5est'); if (!el || !R) return;
  el.scrollIntoView({ block: 'nearest' }); const E = el.getBoundingClientRect(), p = document.createElement('div'); p.className = 'flpos'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Como o livro fica');
  const G = FLX.posG && FLX.posG.length > 1 ? FLX.posG.length : 0;
  p.innerHTML = o.t === 'd' ? `<div class="fph"><b>${esc(b.t)}</b><button type="button" class="ok" data-flp="ok">Pronto</button></div><div class="fpc">${[[o.z ? 'dtras' : 'dfrente', o.z ? 'Levar para trás' : 'Trazer para frente'], ['mv', 'Mover'], [o.k === 'leitor' ? 'dvisor' : 'dtroca', o.k === 'leitor' ? 'Trocar livro do visor' : 'Trocar'], ['drem', 'Remover']].map(([k, l]) => `<button type="button" data-flp="${k}">${l}</button>`).join('')}</div>`
    : `<div class="fph"><b>${G ? G + ' livros juntos' : esc(b.t)}</b><button type="button" class="ok" data-flp="ok">Pronto</button></div><div class="fpc" role="radiogroup" aria-label="Posição">${[['pe', 'Em pé'], ['dei', 'Deitado'], ['fre', 'De frente'], ['inc', 'Inclinado']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${cur === k}" class="${cur === k ? 'on' : ''}" data-flp="${k}">${l}</button>`).join('')}</div><div class="fpc fpc2"><button type="button" data-flp="mv">Mover</button>${G ? '<button type="button" data-flp="tirar">Tirar da estante</button>' : '<button type="button" data-flp="more">•••</button>'}</div>`;
  R.appendChild(p); const ph = p.offsetHeight, pw = p.offsetWidth, cSide = flColSide(), W = innerWidth - (cSide === 'R' ? 60 : 0), L0 = cSide === 'L' ? 68 : 8; let top = E.top - ph - 14, below = false; if (top < 64) { top = Math.min(E.bottom + 14, innerHeight - ph - 8); below = true; }
  const left = Math.max(L0, Math.min(W - pw - 8, E.left + E.width / 2 - pw / 2)); p.style.top = top + 'px'; p.style.left = left + 'px'; p.style.setProperty('--ax', Math.max(16, Math.min(pw - 16, E.left + E.width / 2 - left)) + 'px'); p.classList.toggle('below', below); }

// ---------- ações ----------
function flRender() { const sc = shScroller(), y = sc ? sc.scrollTop : 0; v5Redraw(); const s2 = shScroller(); if (s2 && Math.abs(s2.scrollTop - y) > 1) s2.scrollTop = y; }
function flPlace(r, n, x, mv) { const C0 = shc(), F = C0.free, BW = flBW(), row = F.rows[r]; if (!row) return null; const NW = flNW(row, n, BW), uS = new Set((mv.items || []).map((o) => o.u));
  const seq = !!(mv.ids || mv.seq); // vários selecionados: entram juntos, em sequência, na ordem da seleção
  const blk = mv.ids ? mv.ids.map((id) => ({ u: flUid(), t: 'b', id })) : mv.items ? mv.items : [{ u: flUid(), t: 'b', id: mv.id }];
  let offs; if (seq) { let e = 0; offs = blk.map((o) => { const v = e; e += flW(o); return v; }); } else { const base = mv.items ? Math.min(...blk.map((o) => o.x)) : 0; offs = blk.map((o) => (mv.items ? o.x - base : 0)); }
  const tw = Math.max(...blk.map((o, i) => offs[i] + flW(o)));
  const others = row.it.filter((o) => (o.n || 0) === n && !o.z && !uS.has(o.u)).map((o) => { const w = flW(o); return { u: o.u, x: Math.max(0, Math.min(o.x, NW - w)), w, o }; }), res = flResolve(others, { x, w: tw }, NW); if (!res) return null; // peça que passou da borda (estante desenhada noutra largura) volta para dentro
  const bk = shBk(); if (mv.items) F.rows.forEach((rw) => { rw.it = rw.it.filter((o) => !uS.has(o.u)); });
  res.forEach((q) => { if (q.u === '__m') blk.forEach((o, i) => { o.x = Math.round(q.x + offs[i]); o.n = n; row.it.push(o); }); else q.o.x = Math.round(q.x); });
  const gone = mv.ids ? new Set(mv.ids) : mv.id ? new Set([mv.id]) : null;
  if (gone) { C0.tray = (C0.tray || []).filter((t) => !gone.has(t)); if (!C0.tray.length) { delete C0.tray; delete C0.trayBk; } }
  if (res.over) flNormalize(F); C0.manual = 1; C0.arr = null; shSave(); return { bk, u: blk[0].u, us: blk.map((o) => o.u), n: blk.length, over: !!res.over }; }
// vários de uma vez: se não cabem todos, põe os que couberem (na ordem) e avisa quantos ficaram
function flPlaceMany(r, n, x, mv) { const all = mv.ids || mv.items; for (let k = all.length; k >= 1; k--) { const part = mv.ids ? { ids: all.slice(0, k) } : { items: all.slice(0, k), seq: 1 }; const res = flPlace(r, n, x, part); if (res) { res.left = all.length - k; res.part = part; return res; } } return null; }
function flAfterPlace(res, mv, r) { try { navigator.vibrate && navigator.vibrate(10); } catch {} if (res.part) mv = res.part;
  const many = !!(mv.ids || mv.seq), single = !!mv.id || (!many && mv.items.length === 1 && mv.items[0].t === 'b'); FLX.pk = null; FLX.sel = null; FLX.open = false;
  FLX.pos = single || many ? res.u : null; FLX.posG = many ? res.us : null;
  const fromTray = !!(mv.id || mv.ids), left = (shc().tray || []).length, t = mv.id ? shTitle(mv.id) : many ? res.n + ' livros' : mv.items.length > 1 ? 'Grupo de ' + mv.items.length : mv.items[0].t === 'd' ? (SH_DN[mv.items[0].k] || 'Enfeite') : 'Livro';
  const sobra = res.left ? ` · ${res.left} não couberam${mv.ids ? ', ficaram na bandeja' : ''}` : '';
  toast(`${t.length > 34 ? t.slice(0, 33) + '…' : t} na ${r + 1}ª prateleira${sobra}${fromTray && left && !res.left ? ' · faltam ' + left : ''}${fromTray && !left ? ' · todos guardados' : ''}`, shUndo(res.bk)); flRender(); }
function flSelMv() { const S0 = FLX.sel; if (!S0 || !S0.ids.length) return null; if (S0.src === 'tray') return { ids: S0.ids.slice() }; const its = S0.ids.map((u) => flFind(u)).filter(Boolean).map((f) => f.o); return its.length ? { items: its, seq: 1 } : null; }
function flTapPlace(r, n, x) { const S0 = FLX.sel;
  if (S0 && S0.ids.length && S0.src === 'shelf') { const bk0 = shBk(), its = S0.ids.map(flExtract).filter(Boolean); if (!its.length) return; const mvS = { items: its, seq: 1 }, res = flPlaceMany(r, n, x, mvS); if (!res) { shRestore(bk0); return toast('Não cabe aqui. Escolha outro lugar.'); } res.bk = bk0; return flAfterPlace(res, mvS, r); }
  const mvS = flSelMv(); if (mvS) { const res = flPlaceMany(r, n, x, mvS); if (!res) return toast('Não cabe aqui. Escolha outro lugar.'); return flAfterPlace(res, mvS, r); }
  const P = FLX.pk; if (!P) return; if (P.pb) { const bk0 = shBk(), it = flExtract(flKeyOf(P.u, P.pb)); if (!it) return; const mv1 = { items: [it] }, res = flPlace(r, n, x, mv1); if (!res) { shRestore(bk0); return toast('Não cabe aqui. Escolha outro lugar.'); } res.bk = bk0; return flAfterPlace(res, mv1, r); }
  let mv; if (P.from === 'tray') mv = { id: P.id }; else { const f = flFind(P.u); if (!f) return; mv = { items: [f.o] }; }
  const res = flPlace(r, n, x, mv); if (!res) return toast('Não cabe aqui. Escolha outro lugar.'); flAfterPlace(res, mv, r); }
function flPosAct(k, el) { const f = flFind(FLX.pos); if (!f) return; const o = f.o, C0 = shc(); C0.pos = C0.pos || {};
  if (k === 'ok') { FLX.pos = null; FLX.posG = null; return flRender(); }
  if (k === 'mv') { const G0 = FLX.posG && FLX.posG.length > 1 ? FLX.posG.slice() : null; FLX.pos = null; FLX.posG = null; if (G0) FLX.sel = { src: 'shelf', ids: G0 }; else FLX.pk = { from: 'shelf', u: o.u, id: o.t === 'b' ? o.id : o.t === 'p' ? o.ids[0] : '' }; toast('Toque onde vai ficar, ou arraste'); return flRender(); }
  if (k === 'tirar') { const bk = shBk(), us = new Set(FLX.posG && FLX.posG.length ? FLX.posG : [o.u]), ids = []; C0.free.rows.forEach((rw) => { rw.it = rw.it.filter((x) => { if (!us.has(x.u)) return true; if (x.t === 'b') ids.push(x.id); if (x.t === 'p') ids.push(...x.ids); return x.t === 'd' ? true : false; }); }); C0.tray = (C0.tray || []).concat(ids); FLX.pos = null; FLX.posG = null; shSave(); toast(ids.length + (ids.length > 1 ? ' livros foram' : ' livro foi') + ' para a bandeja', shUndo(bk)); return flRender(); }
  if (k === 'more') { const id0 = o.t === 'b' ? o.id : o.ids[0]; const at = el || flQ('.flpos'); FL_POPAT = at; return shX(shTitle(id0), [['Lombada e edição', () => flPosAct('lomb')], ['Tirar da estante', () => flPosAct('tirar')], ['Ver livro', () => { FLX.pos = null; flRender(); try { const e = v5Book(id0); if (e) openBookPage(e); } catch {} }]]); }
  if (o.t === 'd') { const bk = shBk(), u = o.u; if (k === 'dfrente') { o.z = 1; C0.manual = 1; shSave(); toast('Enfeite na frente dos livros', shUndo(bk)); return flRender(); }
    if (k === 'dtras') { delete o.z; const row = C0.free.rows[f.r]; row.it = row.it.filter((x) => x.u !== u); const res = flPlace(f.r, o.n || 0, o.x || 0, { items: [o] }); if (!res) { shRestore(bk); return; } FLX.pos = u; toast('Enfeite entre os livros', shUndo(bk)); return flRender(); }
    if (k === 'dvisor') { const cur = shLeitorBook({ k: o.k, ...(o.o || {}) }); return shPickBook('Escolher livro do visor', cur && cur.id, (id) => { o.o = { ...(o.o || {}), bk: id }; shSave(); flRender(); toast('“' + shTitle(id).slice(0, 40) + '” no visor'); }); }
    if (k === 'dtroca') { FLX.swap = u; FLX.pos = null; SHX_DKT = 'enf'; if (typeof FLX.car !== 'undefined') FLX.car = 'enf'; toast('Escolha o novo enfeite'); if (SHX_MODE !== 'deco') { const b = flQ('.v5est > .flcol [data-a=shmode][data-v=deco]'); if (b) { b.click(); return; } } return flRender(); }
    if (k === 'drem') { C0.free.rows[f.r].it = C0.free.rows[f.r].it.filter((x) => x.u !== u); FLX.pos = null; shSave(); toast('Enfeite tirado', shUndo(bk)); return flRender(); } return; }
  if (FLX.posG && FLX.posG.length > 1) return flPosGroup(k);
  const id = o.t === 'p' ? o.ids[0] : o.id;
  if (k === 'lomb') { FLX.pos = null; flRender(); const e = v5Book(id); return e && shOpen('shxlb', { e }); }
  const b = shById(id); if (k === 'fre' && !(b && b.img)) return toast('Livro sem capa não fica de frente');
  const bk = shBk(), row = C0.free.rows[f.r]; let swp = '';
  if (o.t === 'p') { o.t = 'b'; o.id = id; delete o.ids; } delete C0.pos[id]; if (C0.lay) delete C0.lay[id];
  if (k === 'dei') { o.t = 'p'; o.ids = [id]; delete o.id; }
  if (k === 'inc') C0.pos[id] = 'lean';
  if (k === 'fre') { row.it.forEach((x) => { if (x !== o && x.t === 'b' && C0.pos[x.id] === 'face') { delete C0.pos[x.id]; swp = shTitle(x.id); } }); C0.pos[id] = 'face'; }
  const its = row.it.filter((x) => (x.n || 0) === (o.n || 0) && !x.z).sort((a, z) => a.x - z.x).map((x) => ({ o: x, x: x.x, w: flW(x) }));
  if (!flFit(its, flNW(row, o.n || 0, flBW()))) { let e2 = 0; its.forEach((q) => { q.x = Math.max(q.x, e2); e2 = q.x + q.w; }); its.forEach((q) => { q.o.x = Math.round(q.x); }); flNormalize(C0.free); } else its.forEach((q) => { q.o.x = Math.round(q.x); }); shSave();
  toast(({ pe: 'Em pé', dei: 'Deitado', fre: 'De frente', inc: 'Inclinado' })[k] + (swp ? ' · ' + swp.slice(0, 24) + ' ficou em pé' : ''), shUndo(bk)); flRender(); }
// posição para vários de uma vez (depois de pôr uma seleção): em pé, deitados (pilhas de até 5), inclinados
function flPosGroup(k) { const C0 = shc(), F = C0.free, bk = shBk(); C0.pos = C0.pos || {}; if (k === 'fre') return toast('De frente vale para um livro por vez');
  const its = FLX.posG.map(flFind).filter(Boolean); if (!its.length) return; const r = its[0].r, row = F.rows[r], n = its[0].o.n || 0, x0 = Math.min(...its.map((f) => f.o.x));
  const ids = []; its.forEach((f) => { if (f.o.t === 'p') ids.push(...f.o.ids); else if (f.o.t === 'b') ids.push(f.o.id); });
  const gone = new Set(its.map((f) => f.o.u)); F.rows.forEach((rw) => { rw.it = rw.it.filter((o) => !gone.has(o.u)); });
  ids.forEach((id) => { delete C0.pos[id]; if (C0.lay) delete C0.lay[id]; if (k === 'inc') C0.pos[id] = 'lean'; });
  const nw = []; if (k === 'dei') { for (let i = 0; i < ids.length; i += 5) nw.push({ u: flUid(), t: 'p', ids: ids.slice(i, i + 5), n }); } else ids.forEach((id) => nw.push({ u: flUid(), t: 'b', id, n }));
  let e = x0; nw.forEach((o) => { o.x = e; e += flW(o); row.it.push(o); });
  const all = row.it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => a.x - z.x).map((o) => ({ o, x: o.x, w: flW(o) }));
  if (!flFit(all, flNW(row, n, flBW()))) { shRestore(bk); requestAnimationFrame(flPosPanel); return toast('Assim não cabe nesta prateleira'); }
  all.forEach((q) => { q.o.x = Math.round(q.x); }); FLX.pos = nw[0].u; FLX.posG = nw.length > 1 ? nw.map((o) => o.u) : null; shSave();
  toast(({ pe: 'Todos em pé', dei: 'Deitados em pilha', inc: 'Todos inclinados' })[k] || 'Pronto', shUndo(bk)); flRender(); }
function flEmpty() { const C0 = shc(), F = C0.free, bk = shBk(), ids = []; F.rows.forEach((row) => { for (let n = 0; n < flNiches(row); n++) row.it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => a.x - z.x).forEach((o) => { if (o.t === 'b') ids.push(o.id); if (o.t === 'p') ids.push(...o.ids); }); row.it = row.it.filter((o) => o.t === 'd'); });
  C0.trayBk = bk; C0.tray = ids; SHX_TRF = 'todos'; FLX.open = false; FLX.pk = null; shSave(); toast('Estante vazia: arraste os livros um a um', { label: 'Desfazer', fn: shTrayUndo }); flRender(); }
function flAuto() { const C0 = shc(), bk = shBk(); C0.freePend = flStructOf(C0.free); C0.ord = null; C0.lay = {}; C0.manual = 0; C0.arr = null; delete C0.free; delete C0.tray; delete C0.trayBk; shSave(); toast('A estante voltou a se arrumar sozinha', shUndo(bk)); flRender(); }
function flCloseGaps() { const C0 = shc(), bk = shBk(); C0.free.rows.forEach((row) => { for (let n = 0; n < flNiches(row); n++) { let e = 0; row.it.filter((o) => (o.n || 0) === n && !o.z).sort((a, z) => a.x - z.x).forEach((o) => { o.x = e; e += flW(o); }); } }); shSave(); toast('Espaços fechados', shUndo(bk)); flRender(); }
{ const _a = shArrange; shArrange = function (k) { const C0 = shc(); if (!C0.free || !flBase()) return _a.apply(this, arguments); const st = flStructOf(C0.free), r = _a.apply(this, arguments); delete C0.free; C0.freePend = st; shSave(); flRender(); return r; }; }
function flTpl(k) { const C0 = shc(), bk = shBk(); flReflow(C0.free, k, null); FLX.ns = null; shSave(); toast('Estrutura: ' + (FL_TPL.find((x) => x[0] === k) || ['', ''])[1], shUndo(bk)); flRender(); }
function flDecoAdd(k) { const C0 = shc(), F = C0.free, BW = flBW();
  if (FLX.swap) { const f = flFind(FLX.swap); FLX.swap = null; if (f) { const bk = shBk(); f.o.k = k; delete f.o.o; flNormalize(F); shSave(); toast((SH_DN[k] || k) + ' no lugar', shUndo(bk)); return flRender(); } }
  const o = { u: flUid(), t: 'd', k }, w = flW(o);
  let r0 = 0; try { const sr = flR(), bays = sr ? [...sr.querySelectorAll('.bsh.flx .bay.fl')] : [], i = bays.findIndex((b) => { const q = b.getBoundingClientRect(); return q.bottom > 120 && q.top < innerHeight * 0.6; }); if (i >= 0) r0 = +bays[i].dataset.r || 0; } catch {}
  const order = [r0, r0 + 1, r0 + 2].filter((i) => i < F.rows.length); // só nas prateleiras à vista; senão, fica na frente dos livros
  for (const r of order) { const row = F.rows[r]; for (let n = flNiches(row) - 1; n >= 0; n--) { const NW = flNW(row, n, BW), its = row.it.filter((q) => (q.n || 0) === n && !q.z).sort((a, z) => a.x - z.x), e = its.length ? its[its.length - 1].x + flW(its[its.length - 1]) : 0;
    if (NW - e >= w) { const bk = shBk(); o.n = n; o.x = NW - w; row.it.push(o); shSave(); toast((SH_DN[k] || k) + ' na ' + (r + 1) + 'ª prateleira · arraste para mudar de lugar', shUndo(bk)); return flRender(); } } }
  // sem vão livre: o enfeite fica na frente dos livros, na prateleira que está à vista
  const rv = r0;
  const row = F.rows[rv] || F.rows[0], NW = flNW(row, 0, BW), bk = shBk(); o.z = 1; o.n = 0; o.x = Math.max(0, Math.round(NW * 0.5 - w / 2)); row.it.push(o); shSave(); toast((SH_DN[k] || k) + ' na frente dos livros · arraste para mudar de lugar', shUndo(bk)); flRender(); }
function flDecoSheet(u) { const f = flFind(u); if (!f) return; const o = f.o, C0 = shc();
  const items = []; if (o.k === 'leitor') { const cur = shLeitorBook({ k: o.k, ...(o.o || {}) }); items.push(['Trocar livro do visor', () => shPickBook('Escolher livro do visor', cur && cur.id, (id) => { o.o = { ...(o.o || {}), bk: id }; shSave(); flRender(); toast('“' + shTitle(id).slice(0, 40) + '” no visor'); })]);
    items.push([o.o && o.o.gr ? 'Capa colorida no visor' : 'Visor em tons de cinza', () => { o.o = { ...(o.o || {}), gr: o.o && o.o.gr ? 0 : 1 }; shSave(); flRender(); }]);
    items.push(['Cor da capinha', () => shX('Cor da capinha', Object.entries(SH_ERD).map(([k, v]) => [(((o.o && o.o.cap) || 'verde') === k ? '✓ ' : '') + v[0], () => { o.o = { ...(o.o || {}), cap: k }; shSave(); flRender(); toast('Capinha ' + v[0].toLowerCase()); }]))]); }
  items.push([o.z ? 'Levar para trás (entre os livros)' : 'Trazer para frente dos livros', () => { const bk = shBk(); if (o.z) { delete o.z; const row = C0.free.rows[f.r]; row.it = row.it.filter((x) => x.u !== u); const res = flPlace(f.r, o.n || 0, o.x || 0, { items: [o] }); if (!res) { shRestore(bk); return; } toast('Enfeite entre os livros', shUndo(bk)); } else { o.z = 1; C0.manual = 1; shSave(); toast('Enfeite na frente dos livros', shUndo(bk)); } flRender(); }]);
  items.push(['Trocar por outro enfeite', () => { FLX.swap = u; SHX_DKT = 'enf'; flRender(); toast('Escolha o novo enfeite'); }]);
  items.push(['Tirar da estante', () => { const bk = shBk(); C0.free.rows[f.r].it = C0.free.rows[f.r].it.filter((x) => x.u !== u); shSave(); toast('Enfeite tirado', shUndo(bk)); flRender(); }]);
  shX(SH_DN[o.k] || 'Enfeite', items); }
function flDkReset() { const C0 = shc(), bk = shBk(); C0.free.rows.forEach((r) => { r.nb = []; }); shSave(); const R = flQ('.v5est'); if (!R) return; const b = document.createElement('button'); b.type = 'button'; b.dataset.a = 'dkreset'; b.hidden = true; R.appendChild(b); b.click(); b.remove(); }
function flAct(k, el) { const C0 = shc();
  if (k === 'dock') { FLX.open = !FLX.open; return flRender(); }
  if (k === 'filt') { FLX.filt = !FLX.filt; return flRender(); }
  if (k === 'pkx') { FLX.pk = null; return flRender(); }
  if (k === 'tray') { FLX.trayHide = !FLX.trayHide; return flRender(); }
  if (k === 'arr') return flArrSheet();
  if (k === 'grip') return;
  if (k === 'sel') { FLX.pk = null; FLX.pos = null; FLX.posG = null; FLX.sel = { src: Array.isArray(C0.tray) && C0.tray.length && !FLX.trayHide ? 'tray' : 'shelf', ids: [] }; return flRender(); }
  if (k === 'selx') { FLX.sel = null; return flRender(); }
  if (k === 'more') { const tr = Array.isArray(C0.tray) && C0.tray.length; return shX('Organizar', [tr ? ['Desfazer o esvaziar', () => { FLX.open = false; shTrayUndo(); }] : ['Esvaziar a estante', () => flEmpty()], ['Juntar os livros', () => flCloseGaps()], ['Arrumação automática', () => flAuto()]]); }
  if (k === 'st') return flTpl(el.dataset.k);
  if (k === 'nbg' || k === 'nlt') { const [r, n] = String(FLX.ns || '').split(':').map(Number), row = C0.free.rows[r]; if (!row) return; row.nb = row.nb || []; const nb = row.nb[n] = { ...(row.nb[n] || {}) };
    if (k === 'nbg') { if (el.dataset.k) nb.bg = el.dataset.k; else delete nb.bg; } else { if (+el.dataset.k) nb.lt = +el.dataset.k; else delete nb.lt; } shSave(); return flRender(); }
  if (k === 'nsx') { FLX.ns = null; return flRender(); }
  if (k === 'dkx') { FLX.dkx = !FLX.dkx; return flRender(); }
  if (k === 'dkmore') return shX('Decorar', [['Decoração padrão', () => flDkReset()], ['Estante sem nichos', () => flTpl('aberta')]]); }


// ---------- coluna flutuante (Bia, 22/11): Concluir, Bandeja, Selecionar, Arrumar por, Decorar, ••• — na lateral, sem barra embaixo ----------
const FL_IC = { ok: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  tray: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13l2.2-7h11.6L20 13v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 13h4.5l1.2 2h4.6l1.2-2H20"/></svg>',
  sel: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/><path d="M5.8 7.6l1.4 1.4 2.4-2.6"/><path d="M14.8 16.6l1.4 1.4 2.4-2.6"/></svg>',
  arr: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M4 12h7M4 17h4"/><path d="M17 5v14M14 16l3 3 3-3"/></svg>',
  org: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="4" height="16" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><path d="M16.5 7.5l3 12"/></svg>' };
const flColSide = () => { try { return v5P().flCol === 'L' ? 'L' : 'R'; } catch { return 'R'; } };
let FL_COLT = 0;
function flColHTML() { const md = SHX_MODE, C0 = shc(), tr = Array.isArray(C0.tray) && C0.tray.length, B = (fl, a, ic, lab, cls) => `<button type="button" class="flcb${cls ? ' ' + cls : ''}" ${fl ? 'data-fl="' + fl + '"' : a} aria-label="${lab}">${ic}<span class="flbl" aria-hidden="true">${lab}</span></button>`;
  const items = md === 'deco' ? [B('', 'data-a="shdone"', FL_IC.ok, 'Concluir', 'ok'), B('', 'data-a="shmode" data-v="org"', FL_IC.org, 'Organizar'), B('dkmore', '', v4ic('dots', 20), 'Mais opções')]
    : [B('', 'data-a="shdone"', FL_IC.ok, 'Concluir', 'ok'), tr ? B('tray', '', FL_IC.tray, FLX.trayHide ? 'Mostrar a bandeja' : 'Esconder a bandeja', FLX.trayHide ? '' : 'on') : '', B(FLX.sel ? 'selx' : 'sel', '', FL_IC.sel, FLX.sel ? 'Parar de selecionar' : 'Selecionar vários', FLX.sel ? 'on' : ''), B('arr', '', FL_IC.arr, 'Arrumar por'), B('', 'data-a="shmode" data-v="deco"', v4ic('lua', 20), 'Decorar'), B('more', '', v4ic('dots', 20), 'Mais opções')];
  return `<div class="flcol ${flColSide()}" role="toolbar" aria-orientation="vertical" aria-label="${md === 'deco' ? 'Decorar' : 'Organizar'}"><button type="button" class="flgrip" data-fl="grip" aria-label="Arraste para mudar a coluna de lado"><i></i></button>${items.join('')}</div>`; }
function flColMount(R) { R.querySelectorAll(':scope > .flcol').forEach((e) => e.remove()); if (!flActive() || (SHX_MODE !== 'org' && SHX_MODE !== 'deco')) { R.classList.remove('flcolL', 'flcolR'); return; }
  R.insertAdjacentHTML('beforeend', flColHTML()); const sd = flColSide(); R.classList.toggle('flcolL', sd === 'L'); R.classList.toggle('flcolR', sd === 'R');
  // rótulos abertos por ~3 s na primeira vez
  let seen = 1; try { seen = +localStorage.getItem('lv.flcolhint') || 0; if (!seen) { localStorage.setItem('lv.flcolhint', '1'); FL_COLT = Date.now() + 3200; setTimeout(() => { const c2 = flQ('.v5est > .flcol'); if (c2) c2.classList.remove('lbls'); }, 3300); } } catch {} if (Date.now() < FL_COLT) { const c = R.querySelector(':scope > .flcol'); if (c) c.classList.add('lbls'); } }
// segurar um botão da coluna mostra o rótulo; arrastar a alça muda a coluna de lado
{ let H = null; window.addEventListener('pointerdown', (ev) => { const T = flTgt(ev); const b = T && T.closest && T.closest('.v5est > .flcol .flcb, .v5est > .flcol .flgrip'); if (!b) return;
    H = { b, x: ev.clientX, y: ev.clientY, pid: ev.pointerId, grip: b.classList.contains('flgrip'), mv: false, t: setTimeout(() => { if (!H || H.b !== b || H.grip) return; b.classList.add('lb1'); H.long = 1; setTimeout(() => b.classList.remove('lb1'), 1600); }, 480) }; if (H.grip && ev.cancelable) ev.preventDefault(); }, true);
  window.addEventListener('pointermove', (ev) => { if (!H || ev.pointerId !== H.pid) return; if (Math.hypot(ev.clientX - H.x, ev.clientY - H.y) > 8) { H.mv = true; clearTimeout(H.t); }
    if (H.grip && H.mv) { ev.preventDefault(); const c = H.b.closest('.flcol'); if (c) { c.style.transition = 'none'; c.style.left = Math.max(4, Math.min(innerWidth - 56, ev.clientX - 26)) + 'px'; c.style.right = 'auto'; } } }, { capture: true, passive: false });
  const up = (ev) => { if (!H || ev.pointerId !== H.pid) return; const h = H; H = null; clearTimeout(h.t); if (h.long) { FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 400); }
    if (h.grip && h.mv) { FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 400); const P = v5P(), sd = ev.clientX < innerWidth / 2 ? 'L' : 'R'; P.flCol = sd; v5Save(); flRender(); toast(sd === 'L' ? 'Coluna na esquerda' : 'Coluna na direita'); } };
  window.addEventListener('pointerup', up, true); window.addEventListener('pointercancel', up, true); }

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
      .replace(/<div class="dkfoot">[\s\S]*?<\/div><\/div>$/, '</div>'); } catch (err) { console.warn('estante livre: decorar', err); }
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
    if (D.src === 'tray') { const ids = D.ids || [D.id], bs = ids.map(shById).filter(Boolean); if (!bs.length) { D.on = false; return; } D.items = null; let e = 0, h = 0; const m0 = SHX_MODE; SHX_MODE = 'org';
      try { gin.innerHTML = bs.slice(0, 10).map((b) => { const w = flW({ t: 'b', id: b.id }), hh = spnGeo(b, false).h; h = Math.max(h, hh); const x = e; e += w; return `<span class="fli" style="left:${x}px;bottom:0">${spnHTML(b, false)}</span>`; }).join('') + (bs.length > 1 ? `<i class="flcnt">${bs.length}</i>` : ''); } finally { SHX_MODE = m0; }
      D.w = ids.reduce((a, id) => a + flW({ t: 'b', id }), 0); D.h = h; gin.style.width = e + 'px'; gin.style.height = h + 'px'; D.offX = Math.min(e, flW({ t: 'b', id: ids[0] })) / 2; D.offY = h * 0.55; }
    else if (D.pb && !D.grp && !D.seqU) { const pe = sh.querySelector(`.fli[data-u="${D.u}"] .pb[data-bid="${D.pb}"]`); if (!pe) { D.on = false; return; } const R = pe.getBoundingClientRect(); D.items = []; D.w = flW({ t: 'p', ids: [D.pb] }); D.h = R.height;
      const c = pe.cloneNode(true); c.style.position = 'absolute'; c.style.left = '0'; c.style.bottom = '0'; c.style.margin = '0'; gin.appendChild(c); gin.style.width = R.width + 'px'; gin.style.height = R.height + 'px'; pe.style.visibility = 'hidden'; D.offX = D.x - R.left; D.offY = D.y - R.top; }
    else if (D.seqU) { D.items = D.seqU.map((k) => flFind(String(k).split('|')[0])).filter(Boolean).map((f) => f.o); if (!D.items.length) { D.on = false; return; } let e = 0, h = 0, L0 = null;
      D.items.forEach((o) => { const el = sh.querySelector(`.fli[data-u="${o.u}"]`); if (!el) return; const R = el.getBoundingClientRect(); if (o.u === D.u) L0 = R; h = Math.max(h, R.height); const c = el.cloneNode(true); c.removeAttribute('data-u'); c.classList.remove('flsel', 'flgrp'); c.style.left = e + 'px'; c.style.top = 'auto'; c.style.bottom = '0'; c.style.transition = 'none'; gin.appendChild(c); el.style.visibility = 'hidden'; e += flW(o); });
      if (D.items.length > 1) gin.insertAdjacentHTML('beforeend', `<i class="flcnt">${D.items.length}</i>`); D.w = e; D.h = h; gin.style.width = e + 'px'; gin.style.height = h + 'px'; D.offX = L0 ? Math.min(e, D.x - L0.left) : e / 2; D.offY = L0 ? D.y - (L0.bottom - h) : h * 0.55; D.seq = 1; }
    else { const f = flFind(D.u); if (!f) { D.on = false; return; } 
      D.items = D.grp ? D.gitems : [f.o]; const els = D.items.map((o) => sh.querySelector(`.fli[data-u="${o.u}"]`)).filter(Boolean), rs = els.map((e) => e.getBoundingClientRect()); if (!els.length) { D.on = false; return; }
      const L = Math.min(...rs.map((r) => r.left)), T = Math.min(...rs.map((r) => r.top)), B = Math.max(...rs.map((r) => r.bottom)); D.w = Math.max(...D.items.map((o) => o.x + flW(o))) - Math.min(...D.items.map((o) => o.x)); D.offX = D.x - L; D.offY = D.y - T; D.h = B - T;
      els.forEach((e, i) => { const c = e.cloneNode(true); c.removeAttribute('data-u'); c.classList.remove('flsel', 'flgrp'); c.style.left = (rs[i].left - L) + 'px'; c.style.top = (rs[i].top - T) + 'px'; c.style.bottom = 'auto'; c.style.transition = 'none'; gin.appendChild(c); e.style.visibility = 'hidden'; }); gin.style.height = D.h + 'px'; gin.style.width = D.w + 'px'; }
    R.appendChild(g); D.g = g; try { navigator.vibrate && navigator.vibrate(8); } catch {} raf = requestAnimationFrame(loop); }
  function move(D, x, y) { D.lx = x; D.ly = y; if (D.g) D.g.style.transform = `translate(${x - D.offX}px,${y - D.offY}px)`;
    const sc = shScroller(), docSc = sc === document.scrollingElement || sc === document.documentElement, SR = docSc ? { top: 0, bottom: innerHeight } : sc.getBoundingClientRect(), shR = flQ('.bsh.flx'), BR = shR ? shR.getBoundingClientRect() : null;
    // rolagem automática: só depois que o dedo entra na estante (vindo da bandeja, não rola à toa)
    if (!D.armed && BR && y > Math.max(SR.top + 70, BR.top) && y < Math.min(SR.bottom - 70, BR.bottom)) D.armed = true; D.vy = !D.armed ? 0 : y < SR.top + 70 ? -Math.ceil((SR.top + 70 - y) / 5) : y > SR.bottom - 90 ? Math.ceil((y - SR.bottom + 90) / 5) : 0;
    if (D.pb || (D.items && D.items.length === 1 && D.items[0].t === 'b' && !D.seq)) { const sr0 = flR(), el = sr0 && sr0.elementFromPoint(x, y), pl = el && el.closest && el.closest('.bsh.flx .fli.fl-p'), pbu = el && el.closest && el.closest('.pb[data-bid]');
      sr0 && sr0.querySelectorAll('.flpbto').forEach((e) => e.classList.remove('flpbto')); if (pl && pbu) { D.pile = { u: pl.dataset.u, before: pbu.dataset.bid }; pbu.classList.add('flpbto'); if (D.nn) { resetNiche(D.nn); D.nn = null; } D.tgt = null; tip(pl.dataset.u === D.u ? 'Solte para mudar a ordem da pilha' : 'Solte para deitar na pilha', x, y - D.offY - 14); return; } D.pile = null; }
    D.front = null; if (D.items && D.items.length === 1 && D.items[0].t === 'd' && !D.seq) { const nf0 = nicheAt(x, y), bk1 = nf0 && [...nf0.querySelectorAll('.fli')].find((e) => { if (e.style.visibility === 'hidden') return false; const q = e.getBoundingClientRect(); return x >= q.left && x <= q.right && y >= q.top - 6 && y <= q.bottom; });
      if (bk1 && bk1.dataset.u !== D.items[0].u) { const nf = bk1.closest('.nich'); if (nf) { if (D.nn) { resetNiche(D.nn); D.nn = null; } const NR = nf.getBoundingClientRect(); D.front = { r: +nf.dataset.r, n: +nf.dataset.n, x: Math.max(0, Math.min(nf.clientWidth - D.w, x - NR.left - D.offX)) }; D.tgt = null; tip('Solte: fica na frente dos livros', x, y - D.offY - 14); return; } } }
    const nn = nicheAt(x, y); if (D.nn && D.nn !== nn) { resetNiche(D.nn); D.nn = null; }
    if (!nn) { D.tgt = null; D.bad = false; tip(D.src === 'tray' ? 'Solte numa prateleira' : 'Solte numa prateleira (fora daqui cancela)', x, y - D.offY - 14); return; }
    D.nn = nn; const r = +nn.dataset.r, n = +nn.dataset.n, NW = nn.clientWidth, R = nn.getBoundingClientRect(), mv = new Set((D.items || []).map((o) => o.u));
    const others = flItems(r, n).filter((o) => !mv.has(o.u)).map((o) => ({ u: o.u, x: o.x, w: flW(o) })), res = flResolve(others, { x: x - R.left - D.offX, w: D.w }, NW);
    let slot = nn.querySelector('.flslot'); if (!slot) { slot = document.createElement('i'); slot.className = 'flslot'; nn.appendChild(slot); }
    slot.style.width = D.w + 'px'; slot.style.height = Math.min(150, D.h || 130) + 'px';
    if (!res && (D.ids || D.seq)) { const w1 = D.ids ? flW({ t: 'b', id: D.ids[0] }) : flW(D.items[0]); const r1 = flResolve(others, { x: x - R.left - D.offX, w: w1 }, NW); if (r1) { const pos = new Map(r1.map((q) => [q.u, q.x])); slot.classList.remove('bad'); slot.style.width = w1 + 'px'; slot.style.left = pos.get('__m') + 'px'; tip('Nem todos cabem aqui: vão os que couberem', x, y - D.offY - 14); D.bad = false; D.tgt = { r, n, x: pos.get('__m') }; return; } }
    D.bad = !res; if (!res) { slot.classList.add('bad'); slot.style.left = Math.max(0, Math.min(NW - D.w, x - R.left - D.offX)) + 'px'; D.tgt = null; tip('Não cabe aqui', x, y - D.offY - 14); return; }
    slot.classList.remove('bad'); tip('', 0, 0); const pos = new Map(res.map((q) => [q.u, q.x])); slot.style.left = pos.get('__m') + 'px';
    nn.querySelectorAll('.fli').forEach((e) => { if (pos.has(e.dataset.u)) e.style.left = pos.get(e.dataset.u) + 'px'; }); D.tgt = { r, n, x: pos.get('__m') }; }
  function loop() { const D = FLX.D; if (!D || !D.on) return; const sc = shScroller(); if (sc && D.vy) { sc.scrollTop += D.vy; move(D, D.lx, D.ly); } raf = requestAnimationFrame(loop); }
  // divisória (Decorar)
  function dvMove(D, x) { const C0 = shc(), row = C0.free.rows[D.r], b = flBounds(row), BW = D.BW, i = D.i, lo = b[i], hi = b[i + 2];
    const need = (n) => row.it.filter((o) => (o.n || 0) === n && !o.z).reduce((s, o) => s + flW(o), 0) + 2 * FL_INS + 6, minW = 48;
    const f = Math.max(lo + Math.max(need(i), minW) / BW, Math.min(hi - Math.max(need(i + 1), minW) / BW, (x - D.L) / BW)); D.f = f;
    const dv = row.dv.slice(); dv[i] = f; const nb = [0, ...dv, 1], bay = flQ(`.bsh.flx .bay.fl[data-r="${D.r}"]`); if (!bay) return;
    [i, i + 1].forEach((n) => { const e = bay.querySelector(`.nich[data-n="${n}"]`), li = n > 0 ? FL_INS : 0, ri = n < nb.length - 2 ? FL_INS : 0; if (e) { e.style.left = `calc(${(nb[n] * 100).toFixed(3)}% + ${li}px)`; e.style.width = `calc(${((nb[n + 1] - nb[n]) * 100).toFixed(3)}% - ${li + ri}px)`; } });
    const d = bay.querySelector(`.ndv[data-i="${i}"]`); if (d) d.style.left = `calc(${(f * 100).toFixed(3)}% - ${FL_INS}px)`; }
  function dvCommit(r, i, f) { const C0 = shc(), row = C0.free.rows[r], bk = shBk(); flPx(C0.free); row.dv[i] = Math.round(f * 1000) / 1000; flNormalize(C0.free); shSave(); toast('Divisória ajustada', shUndo(bk)); flRender(); }
  window.flCancelDrag = function () { const D = FLX.D; if (!D) return false; FLX.D = null; clearTimeout(D.holdT); cancelAnimationFrame(raf); try { D.g && D.g.remove(); } catch {} tip('', 0, 0); const R = R5(); if (R) R.classList.remove('fldrag'); if (D.nn) resetNiche(D.nn); flQA('.bsh.flx .fli').forEach((e) => { e.style.visibility = ''; }); return true; };
  window.addEventListener('pointerdown', (ev) => { if (!flActive() || ev.button > 0) return; const md = SHX_MODE; if (md !== 'org' && md !== 'deco') return; const T = flTgt(ev); if (!T || !T.closest) return;
    const dv = md === 'deco' && T.closest('.bsh.flx .ndv'); if (dv) { ev.stopImmediatePropagation(); if (ev.cancelable) ev.preventDefault(); flPx(shc().free); const br = dv.closest('.brow').getBoundingClientRect(); if (FLX.dkx) { FLX.dkx = false; const p = flQ('.dkpan.flbig'); if (p) p.classList.remove('flbig'); } FLX.D = { kind: 'dv', pid: ev.pointerId, r: +dv.dataset.r, i: +dv.dataset.i, L: br.left, BW: br.width, f: null }; dv.classList.add('on'); return; }
    const tr = md === 'org' && T.closest('.fldock [data-fltr]'), fli = flHitFli(T, ev.clientX, ev.clientY); if (!tr && !fli) return; if (fli && md === 'deco' && !fli.classList.contains('fl-d')) return; if (fli && md === 'org' && FLX.pk && FLX.pk.u !== fli.dataset.u) return;
    flPx(shc().free);
    if (fli) { ev.stopImmediatePropagation(); if (ev.cancelable && ev.pointerType !== 'mouse') ev.preventDefault(); }
    const pbE = fli && fli.classList.contains('fl-p') && md === 'org' ? T.closest('.pb[data-bid]') : null;
    const D = FLX.D = { pid: ev.pointerId, x: ev.clientX, y: ev.clientY, on: false, src: tr ? 'tray' : 'shelf', id: tr ? tr.dataset.fltr : null, u: fli ? fli.dataset.u : null, grp: false, pb: pbE ? pbE.dataset.bid : null };
    const SL = FLX.sel; if (tr && SL && SL.src === 'tray' && SL.ids.includes(D.id)) D.ids = SL.ids.slice(); if (fli && SL && SL.src === 'shelf' && (SL.ids.includes(D.u) || (D.pb && SL.ids.includes(flKeyOf(D.u, D.pb))))) D.seqU = SL.ids.slice();
    // bandeja: segurar entra na seleção de vários
    if (tr && !SL) D.holdT = setTimeout(() => { if (FLX.D !== D || D.on) return; FLX.D = null; FLX.pk = null; FLX.sel = { src: 'tray', ids: [D.id] }; FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 700); try { navigator.vibrate && navigator.vibrate(16); } catch {} flRender(); }, 480);
 }, true);
  window.addEventListener('pointermove', (ev) => { const D = FLX.D; if (!D || ev.pointerId !== D.pid) return;
    if (D.kind === 'dv') { ev.preventDefault(); return dvMove(D, ev.clientX); }
    const dx = ev.clientX - D.x, dy = ev.clientY - D.y;
    if (!D.on) { if (Math.hypot(dx, dy) < 6) return; if (D.src === 'tray' && Math.abs(dx) > Math.abs(dy)) { FLX.D = null; return; } start(D); if (!D.on) { FLX.D = null; return; } }
    ev.preventDefault(); move(D, ev.clientX, ev.clientY); }, { capture: true, passive: false });
  const end = (ev) => { const D = FLX.D; if (!D || ev.pointerId !== D.pid) return; FLX.D = null; clearTimeout(D.holdT); tip('', 0, 0);
    if (D.kind === 'dv') { const d = flQ('.bsh.flx .ndv.on'); if (d) d.classList.remove('on'); FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 400); if (D.f != null && ev.type === 'pointerup') dvCommit(D.r, D.i, D.f); else flRender(); return; }
    if (!D.on) { if (D.grp) { setTimeout(() => { FLX.swallow = 0; }, 400); flQA('.flgrp').forEach((e) => e.classList.remove('flgrp')); } return; }
    cancelAnimationFrame(raf); if (D.g) D.g.remove(); const R = R5(); if (R) R.classList.remove('fldrag'); FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 400); SHX_JD = 1; setTimeout(() => { SHX_JD = 0; }, 350);
    if (D.pile && ev.type === 'pointerup') { const pi = D.pile; flQA('.flpbto').forEach((e) => e.classList.remove('flpbto')); return flIntoPile(D.pb ? flKeyOf(D.u, D.pb) : D.u, pi.u, pi.before); }
    if (D.front && ev.type === 'pointerup') { const fr = D.front, o = D.items[0], C0 = shc(), bk = shBk(), f0 = flFind(o.u); if (f0) { C0.free.rows[f0.r].it = C0.free.rows[f0.r].it.filter((q) => q.u !== o.u); o.z = 1; o.n = fr.n; o.x = Math.round(fr.x); C0.free.rows[fr.r].it.push(o); C0.manual = 1; shSave(); try { navigator.vibrate && navigator.vibrate(10); } catch {} toast('Enfeite na frente dos livros', shUndo(bk)); } return flRender(); }
    if (D.items) D.items.forEach((o) => { delete o.z; });
    if (!D.tgt || ev.type === 'pointercancel') { if (D.nn) resetNiche(D.nn); flRender(); if (ev.type === 'pointercancel') return; return toast(D.bad ? 'Não coube aí' + (D.src === 'tray' ? ': o livro voltou para a bandeja' : '; nada mudou') : D.src === 'tray' ? 'O livro voltou para a bandeja' : 'Nada mudou de lugar'); }
    let bk0 = null; if (D.pb && !D.grp) { bk0 = shBk(); const it = flExtract(flKeyOf(D.u, D.pb)); D.items = it ? [it] : []; } else if (D.seq && D.seqU.some((k) => String(k).includes('|'))) { bk0 = shBk(); D.items = D.seqU.map(flExtract).filter(Boolean); }
    const many = !!(D.ids || D.seq), mv = D.src === 'tray' ? (D.ids ? { ids: D.ids } : { id: D.id }) : D.seq ? { items: D.items, seq: 1 } : { items: D.items }, res = D.items && !D.items.length && D.src !== 'tray' ? null : many ? flPlaceMany(D.tgt.r, D.tgt.n, D.tgt.x, mv) : flPlace(D.tgt.r, D.tgt.n, D.tgt.x, mv); if (!res) { if (bk0) shRestore(bk0); flRender(); return toast('Não cabe aqui'); } if (bk0) res.bk = bk0;
    if (D.src === 'shelf' && D.items.some((o) => o.t === 'd') && SHX_MODE === 'deco') { FLX.pos = null; toast('Enfeite no novo lugar', shUndo(res.bk)); return flRender(); }
    flAfterPlace(res, mv, D.tgt.r); };
  window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true);
  window.addEventListener('contextmenu', (ev) => { if (!flActive() || !SHX_MODE) return; const T = flTgt(ev); if (T && T.closest && T.closest('.bsh.flx, .fldock')) ev.preventDefault(); }, true);
  window.addEventListener('keydown', (ev) => { if (!flActive()) return;
    if (ev.key === 'Escape' && (FLX.pk || FLX.pos || FLX.sel || FLX.fan)) { FLX.pk = null; FLX.pos = null; FLX.posG = null; FLX.sel = null; FLX.fan = null; ev.stopImmediatePropagation(); return flRender(); }
    const T = flTgt(ev), dv = T && T.closest && T.closest('.bsh.flx.deco .ndv'); if (dv && (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight')) { ev.preventDefault(); ev.stopImmediatePropagation(); flPx(shc().free); const r = +dv.dataset.r, i = +dv.dataset.i, br = dv.closest('.brow').getBoundingClientRect(), row = shc().free.rows[r], D = { r, i, L: br.left, BW: br.width };
      dvMove(D, br.left + (row.dv[i] + (ev.key === 'ArrowLeft' ? -0.03 : 0.03)) * br.width); dvCommit(r, i, D.f); setTimeout(() => { const e = flQ(`.bsh.flx .ndv[data-r="${r}"][data-i="${i}"]`); if (e) e.focus(); }, 30); } }, true);
}

// ---------- toques ----------
// o nicho tocado: o próprio, ou (luzinhas e sombras por cima) o nicho da prateleira na altura do dedo
// toque por proximidade: livro fino, colado na moldura ou no meio de outros responde pelo centro mais próximo (área mínima de 28 px)
function flHitFli(T, x, y) { if (!T || !T.closest) return null; const dk = SHX_MODE === 'deco', own0 = T.closest('.bsh.flx .fli'), own = own0 && (!dk || own0.classList.contains('fl-d')) ? own0 : null; if (own && own.getBoundingClientRect().width >= 28 && !own.classList.contains('fl-p')) return own; if (own && own.classList.contains('fl-p')) return own;
  const bay = T.closest('.bsh.flx .bay.fl') || (own && own.closest('.bay.fl')); if (!bay) return own; let best = null, bd = 1e9; bay.querySelectorAll(dk ? '.fli.fl-d' : '.fli').forEach((e) => { const R = e.getBoundingClientRect(); if (y < R.top - 14 || y > R.bottom + 10) return; const cx = R.left + R.width / 2, half = Math.max(R.width / 2, 14), d = Math.abs(x - cx); if (d <= half + 2 && d < bd) { bd = d; best = e; } }); return best || own; }
function flNicheAt(T, x) { const n = T.closest('.bsh.flx .nich'); if (n) return n; const bay = T.closest('.bsh.flx .bay.fl'); if (!bay) return null; return [...bay.querySelectorAll('.nich')].find((e) => { const R = e.getBoundingClientRect(); return x >= R.left - 2 && x <= R.right + 2; }) || null; }
window.addEventListener('click', (ev) => { if (!flActive()) return; const md = SHX_MODE, T = flTgt(ev); if (!T || !T.closest) return; if (!T.closest('.v5est') || T.closest('.shx-sx,.shbp,.flarr')) return;
  const st = () => { ev.stopImmediatePropagation(); ev.preventDefault(); };
  if (FLX.swallow) { FLX.swallow = 0; if (T.closest('.bsh.flx, .fldock, .flpos, .flcol')) return st(); }
  const pp = T.closest('.flpos'); if (pp) { st(); const b = T.closest('[data-flp]'); if (b) flPosAct(b.dataset.flp, b); return; }
  if (FLX.pos && !T.closest('.bsh.flx .fli, .flcol, .flpop')) { FLX.pos = null; flQA('.flpos').forEach((e) => e.remove()); if (!T.closest('.fldock [data-fltr], .bsh.flx .nich')) { st(); return flRender(); } }
  if (FLX.fan && !T.closest('.bsh.flx .fli[data-u="' + FLX.fan + '"]')) { FLX.fan = null; if (!T.closest('.bsh.flx .fli, [data-fl], .fldock, .flcol, .flt')) { st(); return flRender(); } }
  const a = T.closest('[data-fl]'); if (a) { st(); return flAct(a.dataset.fl, a); }
  if (md === 'org') {
    if (T.closest('[data-a="shdone"]')) { FLX.pk = null; FLX.pos = null; FLX.open = false; return; }
    const multi = ev.shiftKey || ev.ctrlKey || ev.metaKey;
    const trb = T.closest('.fldock [data-fltr]'); if (trb) { st(); const id = trb.dataset.fltr;
      if (FLX.sel || multi) { if (!FLX.sel || FLX.sel.src !== 'tray') FLX.sel = { src: 'tray', ids: FLX.pk && FLX.pk.from === 'tray' && FLX.pk.id !== id ? [FLX.pk.id] : [] }; FLX.pk = null; const L = FLX.sel.ids, i = L.indexOf(id); if (i >= 0) L.splice(i, 1); else L.push(id); try { navigator.vibrate && navigator.vibrate(6); } catch {} return flRender(); }
      FLX.pk = FLX.pk && FLX.pk.id === id ? null : { from: 'tray', id }; try { navigator.vibrate && navigator.vibrate(8); } catch {} return flRender(); }
    const t = T.closest('.flt[data-flt]'); if (t && (FLX.pk || (FLX.sel && FLX.sel.ids.length))) { st(); const [r, n, x] = t.dataset.flt.split(':').map(Number); return flTapPlace(r, n, x); }
    const fli = flHitFli(T, ev.clientX, ev.clientY); if (fli) { st(); const u = fli.dataset.u, f = flFind(u); if (!f) return; const pbE = f.o.t === 'p' ? T.closest('.pb[data-bid]') : null, pb = pbE ? pbE.dataset.bid : null;
      if (FLX.sel && FLX.sel.src === 'tray' && FLX.sel.ids.length) return flTapPlace(f.r, f.o.n || 0, f.o.x - flPkW());
      if (FLX.pk && pb && !(FLX.pk.u === u && FLX.pk.pb === pb) && FLX.pk.from === 'shelf' && (FLX.pk.pb || (flFind(FLX.pk.u) || {}).o?.t === 'b')) return flIntoPile(flKeyOf(FLX.pk.u, FLX.pk.pb), u, pb);
      if ((FLX.sel || multi) && pb) { if (!FLX.sel || FLX.sel.src !== 'shelf') FLX.sel = { src: 'shelf', ids: [] }; FLX.pk = null; const k = flKeyOf(u, pb), L = FLX.sel.ids, i = L.indexOf(k), iw = L.indexOf(u); if (iw >= 0) { L.splice(iw, 1); f.o.ids.forEach((x) => { if (x !== pb) L.push(flKeyOf(u, x)); }); } else if (i >= 0) L.splice(i, 1); else L.push(k); try { navigator.vibrate && navigator.vibrate(6); } catch {} return flRender(); }
      if (f.o.t === 'p' && f.o.ids.length > 1 && !FLX.pk && !FLX.sel && FLX.fan !== u) { FLX.fan = u; try { navigator.vibrate && navigator.vibrate(6); } catch {} try { if (!localStorage.getItem('lv.flfantip')) { localStorage.setItem('lv.flfantip', '1'); toast('Toque no livro que quer mover'); } } catch {} return flRender(); }
      if (pb && !FLX.pk) { FLX.fan = null; FLX.pk = { from: 'shelf', u, id: pb, pb }; try { navigator.vibrate && navigator.vibrate(8); } catch {} return flRender(); }
      if (FLX.pk && FLX.pk.u === u && FLX.pk.pb && pb === FLX.pk.pb) { FLX.pk = null; return flRender(); }
      if ((FLX.sel || multi) && f.o.t !== 'd') { if (!FLX.sel || FLX.sel.src !== 'shelf') FLX.sel = { src: 'shelf', ids: FLX.pk && FLX.pk.u && FLX.pk.u !== u ? [FLX.pk.u] : [] }; FLX.pk = null; const L = FLX.sel.ids, i = L.indexOf(u); if (i >= 0) L.splice(i, 1); else L.push(u); try { navigator.vibrate && navigator.vibrate(6); } catch {} return flRender(); }
      if (FLX.pk && FLX.pk.u === u) { FLX.pk = null; return flRender(); }
      if (FLX.pk) return flTapPlace(f.r, f.o.n || 0, f.o.x - flPkW());
      FLX.pos = FLX.pos === u ? null : u; FLX.posG = null; try { navigator.vibrate && navigator.vibrate(8); } catch {} return flRender(); }
    const ni = flNicheAt(T, ev.clientX); if (ni && (FLX.pk || (FLX.sel && FLX.sel.ids.length))) { st(); const R = ni.getBoundingClientRect(); return flTapPlace(+ni.dataset.r, +ni.dataset.n, ev.clientX - R.left - flPkW() / 2); } }
  if (md === 'deco') {
    const add = T.closest('[data-a="dkadd"]'); if (add) { st(); return flDecoAdd(add.dataset.k); }
    if (SHX_LBP && T.closest('.bsh [data-bid]')) return;
    const dk = T.closest('.bsh.flx .fli.fl-d'); if (dk) { st(); FLX.pos = FLX.pos === dk.dataset.u ? null : dk.dataset.u; return flRender(); }
    if (T.closest('.bsh.flx .plq, .bsh.flx .bpl')) return;
    const ni = flNicheAt(T, ev.clientX); if (ni && !T.closest('[data-bid]')) { st(); FLX.ns = ni.dataset.r + ':' + ni.dataset.n; SHX_DKT = 'est'; FLX.dkx = false; return flRender(); } } }, true);

// ---------- depois de desenhar: congelar a 1ª vez, bandeja, painel ----------
{ const _sd = shDraw; shDraw = function (box) {
    const host = box && box.querySelector && box.querySelector(':scope > .v5host'), sr = host && host.shadowRoot, sr0 = FL_SR;
    if (SHX_MODE !== FLX.md) { flPvCancel(true); if (!SHX_MODE) FLX.hintFor = null; FLX.trayHide = false; FLX.pk = null; FLX.pos = null; FLX.open = false; FLX.filt = false; FLX.ns = null; FLX.swap = null; FLX.dkx = false; } FLX.md = SHX_MODE;
    if (sr) sr.querySelectorAll('.flpos,.flghost,.fltip').forEach((e) => e.remove());
    FL_SR = sr || sr0; FL_MAIN = 1; let r;
    try { r = _sd.apply(this, arguments);
      if (!FL_BUSY && flWanted() && !shc().free && flQ('.bsh:not(.sm) .bay')) { FL_BUSY = 1; try { const C0 = shc(); if (!C0.deco) { shDecoInit(); drawEstante(box); } if (flFreeze()) { shSave(); drawEstante(box); } } finally { FL_BUSY = 0; } }
      const R = flQ('.v5est'); if (R) { R.classList.toggle('flmode', flActive() && !!SHX_MODE); flColMount(R); if (FL_ARRW && !R.contains(FL_ARRW)) { if (flActive() && SHX_MODE === 'org') R.append(FL_ARRW); else FL_ARRW = null; }
        if (FLX.hintFor !== SHX_MODE) { FLX.hintFor = SHX_MODE; if (SHX_MODE === 'org' && flActive()) setTimeout(() => { try { toast('Arraste um livro ou enfeite para onde quiser'); } catch {} }, 350); }
        if (flActive() && SHX_MODE === 'org') { const sp = [...R.querySelectorAll('div[aria-hidden="true"]')].find((d) => /48vh/.test(d.getAttribute('style') || '')); if (sp) sp.style.height = (FLX.open ? 46 : 22) + 'vh'; }
        if (flActive() && SHX_MODE === 'deco') { const sp = [...R.querySelectorAll('div[aria-hidden="true"]')].find((d) => /44vh/.test(d.getAttribute('style') || '')); if (sp) sp.style.height = (FLX.dkx ? 70 : 36) + 'vh'; } }
      if (FLX.pos) requestAnimationFrame(flPosPanel);
    } catch (err) { console.warn('estante livre (desenho)', err); }
    finally { FL_MAIN = 0; FL_SR = sr0; }
    return r; }; }
// sair da tela no meio do arrasto: desfaz só o que estava pela metade (livro na mão, arrasto, painel de posição)
{ const _x = shExitEdit; shExitEdit = function () { const had = !!(FLX.D || FLX.pk || FLX.pos || FL_PV); flPvCancel(true); FL_ARRW = null; try { const sr = shBibRoot(); if (sr) sr.querySelectorAll('.flarr,.flcol').forEach((e) => e.remove()); } catch {} try { if (window.flCancelDrag) window.flCancelDrag(); } catch {} FLX.pk = null; FLX.pos = null; FLX.open = false; FLX.filt = false; FLX.ns = null; FLX.swap = null; FLX.dkx = false;
    try { const sr = shBibRoot(); if (sr) sr.querySelectorAll('.flpos,.flghost,.fltip,.fldock,.flpill').forEach((e) => e.remove()); } catch {}
    const r = _x.apply(this, arguments); return r || had; }; }
// o aviso (toast) sobe para o topo também com a bandeja da estante livre aberta
let FL_TLI = 0;
{ const _tl = shToastLift; shToastLift = function (R) { const r = _tl.apply(this, arguments); try { const set = () => { const T = shToasts(), d = R && R.isConnected && R.querySelector('.fldock:not(.gone), .flpill, .flarr'); if (!d) return false; T.forEach((t) => { t.style.setProperty('bottom', 'auto', 'important'); t.style.setProperty('top', 'calc(64px + env(safe-area-inset-top,0px))', 'important'); }); return true; }; if (set() && !FL_TLI) FL_TLI = setInterval(() => { if (!set()) { clearInterval(FL_TLI); FL_TLI = 0; shToasts().forEach((t) => { if (!(R && R.isConnected && R.querySelector('.shpk,.shtr,.dkpan'))) { t.style.removeProperty('top'); t.style.removeProperty('bottom'); } }); } }, 400); } catch {} return r; }; }
// redesenho de fundo não apaga o arrasto em curso: espera ele terminar
{ const _dt = drawTab; drawTab = function () { if (FLX.D && FLX.D.on) { clearTimeout(drawTab.__fl); drawTab.__fl = setTimeout(() => { try { drawTab(); } catch {} }, 700); return; } return _dt.apply(this, arguments); }; }

// ---------- folhas pequenas (Bia: a estante sempre à vista): lista compacta com × no topo, tocar fora fecha ----------
shX = function (title, items) { const sr = shBibRoot(), R = sr && sr.querySelector('.v5est'); if (!R) return; R.querySelectorAll('.shx-sx').forEach((x) => x.remove()); try { shToastOff(); } catch {}
  const w = document.createElement('div'); w.className = 'shx-sx sxc'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', title);
  w.innerHTML = `<div><div class="sxh"><b>${esc(title)}</b><button type="button" class="sxx" data-sx="x" aria-label="Fechar">×</button></div><div class="sxl">${items.map(([l], i) => `<button type="button" data-sx="${i}">${esc(l)}</button>`).join('')}</div></div>`;
  w.addEventListener('click', (ev) => { ev.stopPropagation(); const t = ev.target.closest('[data-sx]'); if (ev.target === w || (t && t.dataset.sx === 'x')) return w.remove(); if (!t) return; w.remove(); items[+t.dataset.sx][1](); });
  w.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); w.remove(); } });
  R.append(w); const f = w.querySelector('.sxl button'); if (f) f.focus(); };

// ---------- cor da capa: a cor que mais aparece (sem bordas e sem o texto), por família de matiz ----------
const FL_FAM = ['vermelho', 'laranja', 'amarelo', 'verde', 'azul', 'roxo', 'rosa', 'marrom', 'branco', 'cinza', 'preto'];
const FLCC = (() => { try { return JSON.parse(localStorage.getItem('lv.cvcol2') || '{}') || {}; } catch { return {}; } })(), FLCQ = {}; let FLCC_T = 0, FLCC_W = [];
const flCcSave = () => { clearTimeout(FLCC_T); FLCC_T = setTimeout(() => { try { const ks = Object.keys(FLCC); if (ks.length > 1500) ks.slice(0, ks.length - 1500).forEach((k) => delete FLCC[k]); localStorage.setItem('lv.cvcol2', JSON.stringify(FLCC)); } catch {} }, 1200); };
function flHex2rgb(c) { const m = String(c || '').match(/^#?([0-9a-f]{6})$/i); if (m) { const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; } const r = String(c || '').match(/rgb\((\d+),\s*(\d+),\s*(\d+)/); return r ? [+r[1], +r[2], +r[3]] : null; }
function flHslOf(rgb) { const [r, g, b] = rgb.map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s = 0; if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, s, l]; }
function flFamOf(rgb) { const [h, s, l] = flHslOf(rgb);
  if (l < 0.14) return 10; if (l > 0.86 && s < 0.35) return 8; if (s < 0.14 || (s < 0.22 && l < 0.5)) return l > 0.75 ? 8 : l < 0.22 ? 10 : 9;
  if (h >= 12 && h < 48 && (s < 0.55 || l < 0.42) && l < 0.8) return 7; // marrom e bege
  if (h < 12 || h >= 345) return l > 0.72 ? 6 : 0; if (h < 40) return 1; if (h < 66) return 2; if (h < 165) return 3; if (h < 255) return 4; if (h < 290) return 5; return 6; }
function flSampleCover(u, key) { const im = new Image(); if (!/^data:/.test(u)) im.crossOrigin = 'anonymous';
  const done = (v) => { FLCC[key] = v; flCcSave(); const W = FLCC_W; FLCC_W = []; W.forEach((f) => { try { f(); } catch {} }); };
  im.onerror = () => done(0);
  im.onload = () => { try { const v = shDomRgb(im); done(v || 0); } catch (e) { done(0); } }; // canvas bloqueado (CORS): 0
  im.src = coverCanvasUrl(u); }
// cor de um livro: capa (amostrada) > lombada já calculada > capa gerada (sem imagem); null = sem cor (vai para o fim)
function flBookRgb(b, ask) { if (!b) return null; if (!b.img) { try { return flHex2rgb(colorOf(b.t || '')); } catch { return null; } }
  const key = spnHash(b.img), v = FLCC[key]; if (Array.isArray(v)) return v;
  if (v === undefined && ask && !FLCQ[key]) { FLCQ[key] = 1; flSampleCover(b.img, key); }
  if (v === 0 || v === undefined) { const sc = SH_SC[key]; if (Array.isArray(sc)) return flHex2rgb(sc[0]); } return null; }
const flColKey = (b) => { const rgb = flBookRgb(b, true); if (!rgb) return [99, 0]; const l = flHslOf(rgb)[2]; return [flFamOf(rgb), -l]; };
function flByColor(B) { return B.map((b, i) => [b, flColKey(b), i]).sort((x, y) => x[1][0] - y[1][0] || x[1][1] - y[1][1] || x[2] - y[2]).map((x) => x[0]); }
// espera as capas que faltam (até 8 s)
function flColorsReady(B) { return new Promise((res) => { const need = () => B.filter((b) => b.img && FLCC[spnHash(b.img)] === undefined); B.forEach((b) => flBookRgb(b, true)); if (!need().length) return res();
  const t = setTimeout(res, 8000); const chk = () => { if (!need().length) { clearTimeout(t); res(); } else FLCC_W.push(chk); }; FLCC_W.push(chk); }); }
// bandeja por cor: mesma regra; quando chegam as cores, redesenha uma vez
{ const _tl = shTrayList; shTrayList = function () { const L = _tl.apply(this, arguments); if (SHX_TRS !== 'cor') return L; const miss = L.some((b) => b.img && FLCC[spnHash(b.img)] === undefined); const out = flByColor(L);
    if (miss && !shTrayList.__w) { shTrayList.__w = 1; flColorsReady(L).then(() => { shTrayList.__w = 0; if (SHX_TRS === 'cor') v5Redraw(); }); } return out; }; }

// ---------- Arrumar por: folha pequena, com "Com plaquinhas" ----------
SHX_BKK.push('plq');
const FL_ARR = [['autor', 'Autor'], ['titulo', 'Título'], ['sit', 'Situação'], ['data', 'Data de leitura'], ['cor', 'Cor (arco-íris)'], ['altura', 'Altura']];
let FL_ARK = null;
function flArrSheet() { const sr = shBibRoot(), R = sr && sr.querySelector('.v5est'); if (!R) return; R.querySelectorAll('.shx-sx').forEach((x) => x.remove()); try { shToastOff(); } catch {}
  const C0 = shc(), P = v5P(), free = flActive(), opts = flArrOpts().concat(C0.arr && C0.myOrd ? [['mine', 'Minha ordem']] : []);
  let K = null, pq = P.shArrPq !== 0, tok = 0; const w = document.createElement('div'); w.className = 'shx-sx sxc flarr'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Arrumar por');
  const can = () => free && K && !['cor', 'altura', 'mine'].includes(K);
  const paint = () => { w.innerHTML = `<div><div class="sxh"><b>Arrumar por</b><button type="button" class="sxx" data-k="x" aria-label="Fechar e desfazer a prévia">×</button></div>
      <div class="arg" role="radiogroup" aria-label="Critério">${opts.map(([k, l]) => `<button type="button" role="radio" aria-checked="${K === k}" class="${K === k ? 'on' : ''}" data-k="${k}">${C0.arr === k ? '✓ ' : ''}${l}${K === k ? (FL_REV ? ' ↑' : ' ↓') : ''}</button>`).join('')}</div>
      <div class="arft"><label class="arsw${can() ? '' : ' off'}"><input type="checkbox" role="switch" ${pq && can() ? 'checked' : ''} ${can() ? '' : 'disabled'} data-k="pq"><span>Com plaquinhas</span></label><button type="button" class="btn p argo" data-k="go" ${K ? '' : 'disabled'}>Arrumar</button></div></div>`; };
  const close = (keep) => { document.removeEventListener('pointerdown', outD, true); document.removeEventListener('pointerup', outU, true); FL_ARRW = null; w.remove(); if (!keep) flPvCancel(); };
  const preview = async () => { if (!free || !K || K === 'mine') { flPvCancel(); return; } const t = ++tok; if (K === 'cor') await flColorsReady(shAllIds().map(shById).filter(Boolean)); if (t !== tok || !w.isConnected) return;
    const t0 = performance.now(), pv = flArrBuild(K, pq && can()); pv.k = K; flPvShow(pv); window.__flPvMs = Math.round(performance.now() - t0); };
  // tocar fora (sem arrastar a estante) fecha e desfaz; rolar a estante por trás não fecha
  let O = null; const inW = (ev) => { const p = ev.composedPath ? ev.composedPath() : []; return p.includes(w); };
  const outD = (ev) => { O = inW(ev) ? null : { x: ev.clientX, y: ev.clientY }; }, outU = (ev) => { if (!O) return; const o = O; O = null; if (Math.hypot(ev.clientX - o.x, ev.clientY - o.y) < 10) close(false); };
  paint();
  w.addEventListener('change', (ev) => { if (ev.target.dataset.k === 'pq') { pq = ev.target.checked; preview(); } });
  w.addEventListener('click', (ev) => { ev.stopPropagation(); const t = ev.target.closest('[data-k]'); if (t && t.dataset.k === 'x') return close(false); if (!t || t.dataset.k === 'pq') return;
    if (t.dataset.k === 'go') { if (!K) return; P.shArrPq = pq ? 1 : 0; const pv = FL_PV && FL_PV.k === K ? FL_PV : null; close(true); return free ? flArrange(K, pq && !['cor', 'altura', 'mine'].includes(K), pv) : shArrange(K); }
    if (t.dataset.k === K && K !== 'mine') FL_REV = !FL_REV; else FL_REV = false; K = t.dataset.k; paint(); preview(); });
  w.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); close(false); } });
  setTimeout(() => { document.addEventListener('pointerdown', outD, true); document.addEventListener('pointerup', outU, true); }, 0);
  FL_ARRW = w; R.append(w); const keep = setInterval(() => { if (FL_ARRW !== w) return clearInterval(keep); if (!w.isConnected) { const R2 = flQ('.v5est'); if (R2 && flActive() && SHX_MODE === 'org') R2.append(w); else { clearInterval(keep); close(false); } } }, 250); const f = w.querySelector('.arg button'); if (f) f.focus(); }
shArrMenu = function () { return flArrSheet(); };
// critérios (os mesmos da arrumação antiga), com a cor nova; devolve a ordem e o rótulo de cada grupo
function flSortArr(k) { const ids = shAllIds(), B = ids.map((id, i) => ({ ...shById(id), i })).filter((b) => b.id), col = (x, y) => String(x).localeCompare(String(y), 'pt', { sensitivity: 'base' });
  const last = (a) => String(a || '').trim().split(/\s+/).slice(-1)[0] || '~', raw = (id) => { try { return v5Book(id) || {}; } catch { return {}; } };
  const dOf = (b) => { const e = raw(b.id); return String(e.finishedAt || e.startedAt || ''); }, art = (t) => String(t).replace(/^(o|a|os|as|um|uma|the)\s+/i, '');
  const SIT = { lendo: [0, 'Lendo'], lido: [1, 'Lidos'], quero: [2, 'Quero ler'], pausado: [3, 'Pausados'], abandonado: [4, 'Abandonados'] };
  let S = B, lab = () => '';
  if (k === 'cor') S = flByColor(B);
  if (k === 'autor') { S = B.slice().sort((x, y) => col(last(x.a), last(y.a)) || col(x.a, y.a) || col(x.t, y.t)); lab = (b) => { const a = String(b.a || '').trim(); if (!a) return 'Sem autor'; return a.length <= 14 ? a : last(a); }; }
  if (k === 'titulo') { S = B.slice().sort((x, y) => col(art(x.t), art(y.t))); lab = (b) => { const c = (art(b.t).normalize('NFD').replace(/[̀-ͯ]/g, '').trim()[0] || '#').toUpperCase(); return /[A-Z]/.test(c) ? c : '#'; }; }
  if (k === 'altura') S = B.slice().sort((x, y) => spnGeo(y, false).h - spnGeo(x, false).h || x.i - y.i);
  if (k === 'sit') { S = B.slice().sort((x, y) => ((SIT[x.st] || [5])[0]) - ((SIT[y.st] || [5])[0]) || x.i - y.i); lab = (b) => (SIT[b.st] || [0, 'Outros'])[1]; }
  if (k === 'data') { S = B.slice().sort((x, y) => (dOf(y) ? 1 : 0) - (dOf(x) ? 1 : 0) || dOf(y).localeCompare(dOf(x)) || x.i - y.i);
    const ys = new Set(S.map((b) => dOf(b).slice(0, 4)).filter(Boolean)), MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    lab = (b) => { const d = dOf(b); if (!d) return 'Sem data'; return ys.size > 1 ? d.slice(0, 4) : (MES[+d.slice(5, 7) - 1] || '') + ' ' + d.slice(0, 4); }; }
  return { S, lab }; }
// estante livre: arruma em grupos, com um respiro entre eles e, se pedido, uma plaquinha no começo de cada grupo de 2 ou mais
function flArrBuild(k, withPq) { const C0 = shc(), F0 = C0.free; flPx(F0); const srt = flSortArr(k), S = srt.S, lab = srt.lab, BW = flBW(), F = { st: F0.st, rows: flStructOf(F0).rows.map((r) => ({ ...r, it: [] })) }, decos = [];
  F0.rows.forEach((row, r) => row.it.forEach((o) => { if (o.t === 'd') decos.push({ r, o: { ...o } }); }));
  const groups = []; S.forEach((b) => { const L = lab(b), g = groups[groups.length - 1]; if (g && g.l === L) g.bs.push(b); else groups.push({ l: L, bs: [b] }); });
  const GAP = withPq ? 22 : (k === 'cor' || k === 'altura' ? 0 : 8), auto = [], sty = ((C0.plq || []).find((q) => !q.a) || {}).s || 'latao'; let r = 0, n = 0, cur = 0;
  const row = () => F.rows[r] || flNewRow(F), nw = () => flNW(row(), n, BW);
  const next = () => { if (n < flNiches(row()) - 1) n++; else { r++; n = 0; row(); } cur = 0; };
  // o mesmo livro fica com o mesmo id de peça (a prévia anima cada livro do lugar antigo ao novo)
  const uOf = {}; F0.rows.forEach((row) => row.it.forEach((o) => { if (o.t === 'b') uOf[o.id] = o.u; }));
  // enfeites ficam ancorados: mesma prateleira, nicho e lugar; os livros fluem em volta deles (Bia, 22/11)
  const dAt = {}; decos.forEach(({ r: rr, o }) => { while (F.rows.length <= rr) flNewRow(F); const rw = F.rows[rr]; o.n = Math.min(o.n || 0, flNiches(rw) - 1); const NW = flNW(rw, o.n, BW), w = flW(o); o.x = Math.max(0, Math.min(NW - w, o.x || 0)); if (!o.z) (dAt[rr + ':' + o.n] = dAt[rr + ':' + o.n] || []).push([o.x, o.x + w]); rw.it.push(o); });
  const skipD = (w) => { let g = 0; for (;;) { if (g++ > 80) return; const sp = (dAt[r + ':' + n] || []).slice().sort((a, z) => a[0] - z[0]); let moved = false; for (const [a, z] of sp) if (cur < z && cur + w > a) { cur = z; moved = true; } if (cur + w > nw() && (cur > 0 || sp.length)) { next(); continue; } if (!moved) return; } };
  groups.forEach((g) => { if (cur > 0 && GAP) { if (cur + GAP >= nw()) next(); else cur += GAP; } let first = true;
    g.bs.forEach((b) => { const o = { u: uOf[b.id] || flUid(), t: 'b', id: b.id }, w = flW(o); let guard = 0; while (cur + w > nw() && cur > 0 && guard++ < 50) next(); skipD(w);
      o.n = n; o.x = cur; row().it.push(o);
      if (first && withPq && g.l && g.bs.length >= 2) g.at = { r, n, x0: cur, x1: cur + w }; else if (g.at && g.at.r === r && g.at.n === n) g.at.x1 = cur + w;
      first = false; cur += w; }); });
  // plaquinha no meio do pedaço do grupo que ficou na prateleira dele; perto demais da anterior, não entra (não se sobrepõem)
  const lastP = {}; groups.forEach((g) => { if (!g.at) return; const rw = F.rows[g.at.r], bnd = flBounds(rw), li = g.at.n > 0 ? FL_INS : 0, cx = bnd[g.at.n] * BW + li + (g.at.x0 + g.at.x1) / 2, wq = Math.min(BW * 0.46, 22 + String(g.l).length * 7);
    if (lastP[g.at.r] != null && cx - wq / 2 < lastP[g.at.r] + 6) return; lastP[g.at.r] = cx + wq / 2; auto.push({ t: String(g.l).slice(0, 24), s: sty, r: g.at.r, p: Math.max(0.05, Math.min(0.95, cx / BW)), a: 1 }); });
  while (F.rows.length < 3) flNewRow(F);
  // enfeites: voltam para a prateleira em que estavam, no último espaço livre dela (se não couber, vão para outra)

  return { free: F, plq: (C0.plq || []).filter((q) => !q.a).concat(auto).slice(0, 24), ord: S.map((b) => b.id), auto: auto.length, sem: k === 'cor' ? S.filter((b) => flColKey(b)[0] === 99).length : 0 }; }
// FLIP: os livros visíveis deslizam do lugar antigo ao novo (~300 ms); sem animação com movimento reduzido
function flFlipRender(fn) { const sr = shBibRoot(), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, old = new Map();
  if (sr && !reduce) sr.querySelectorAll('.bsh.flx .fli').forEach((e) => { const R = e.getBoundingClientRect(); if (R.bottom > -40 && R.top < innerHeight + 40) old.set(e.dataset.u, R); });
  fn(); const s2 = shBibRoot(); if (!s2 || reduce || !old.size) return;
  s2.querySelectorAll('.bsh.flx .fli').forEach((e) => { const a = old.get(e.dataset.u); if (!a) return; const R = e.getBoundingClientRect(); if (R.bottom < -40 || R.top > innerHeight + 40) return; const dx = a.left - R.left, dy = a.top - R.top; if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    try { e.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }); } catch {} }); }
const flPvShow = (pv) => flFlipRender(() => { FL_PV = pv; flRender(); });
function flPvCancel(silent) { if (!FL_PV) return; FL_PV = null; if (!silent) flFlipRender(() => flRender()); }
async function flArrange(k, withPq, pv) { const C0 = shc(), F0 = C0.free; if (!F0) return shArrange(k);
  if (k === 'mine') { FL_PV = null; const m = C0.myOrd; if (!m) return; const bk = shBk(); if (m.free) C0.free = JSON.parse(JSON.stringify(m.free)); C0.plq = m.plq || C0.plq; C0.pos = m.pos || C0.pos; C0.arr = null; delete C0.myOrd; shSave(); toast('De volta à minha ordem', shUndo(bk)); return flRender(); }
  if (k === 'cor' && !pv) await flColorsReady(shAllIds().map(shById).filter(Boolean));
  const L = pv || flArrBuild(k, withPq); FL_PV = null; const bk = shBk();
  if (!C0.arr) C0.myOrd = { free: JSON.parse(JSON.stringify(F0)), plq: JSON.parse(JSON.stringify(C0.plq || [])), pos: JSON.parse(JSON.stringify(C0.pos || {})) };
  C0.free = L.free; C0.plq = L.plq; C0.ord = L.ord; C0.lay = {}; C0.manual = 1; C0.arr = k; FLX.pk = null; FLX.pos = null; FLX.sel = null; shSave();
  toast('Arrumada por ' + (FL_ARR.find((x) => x[0] === k) || ['', ''])[1].replace(' (arco-íris)', '').toLowerCase() + (L.auto ? ` · ${L.auto} plaquinha${L.auto > 1 ? 's' : ''}` : '') + (L.sem ? ` · ${L.sem} sem cor no fim` : ''), shUndo(bk)); flRender(); }
// fora da estante livre (com filtro de status), a cor usa a mesma regra nova
{ const _a2 = shArrange; shArrange = function (k) { const r = _a2.apply(this, arguments); try { const C0 = shc(); if (k === 'cor' && !C0.free) { const T = new Set(C0.tray || []), so = flByColor(shAllIds().map(shById).filter(Boolean)).map((b) => b.id); C0.ord = so.filter((x) => !T.has(x)).concat(so.filter((x) => T.has(x))); shSave(); v5Redraw(); } } catch (err) { console.warn('cor', err); } return r; }; }

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
.v4ler .bsh.flx.deco:not(.lbp) .fli.fl-b,.v4ler .bsh.flx.deco:not(.lbp) .fli.fl-p{pointer-events:none}
.v4ler .bsh.flx.org .fli{touch-action:none;cursor:grab}.v4ler .bsh.flx.deco .fli.fl-d{touch-action:none;cursor:grab}
.v4ler .bsh.flx.org .fli *,.v4ler .bsh.flx .fli .dec{pointer-events:none}.v4ler .bsh.flx.org .fli .pile,.v4ler .bsh.flx.org .fli .pb{pointer-events:auto}.v4ler .bsh.flx.org .fli .pb *{pointer-events:none}.v4ler .bsh.flx .fli .dec.lk{pointer-events:auto}.v4ler .bsh.flx:not(.org):not(.deco) .fli *{pointer-events:auto}.v4ler .bsh.flx:not(.org):not(.deco) .fli .dec:not(.lk){pointer-events:none}
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
.v4ler .flghost .flcnt,.v4ler .flc .flnum{position:absolute;top:-8px;right:-8px;min-width:24px;height:24px;border-radius:12px;background:var(--acc);color:var(--on-acc,#fff);font:800 13px/24px system-ui,sans-serif;text-align:center;font-style:normal;box-shadow:0 2px 6px rgba(0,0,0,.35)}
.v4ler .flc .flnum{top:3px;right:3px;min-width:20px;height:20px;font-size:11px;line-height:20px}
.v4ler .bsh.flx .pb.flpbsel{filter:drop-shadow(0 0 4px var(--acc)) drop-shadow(0 0 2px var(--acc));transform:translateX(-4px)}.v4ler .bsh.flx .pb{position:relative}.v4ler .bsh.flx .pb .flnum{top:50%;right:-10px;transform:translateY(-50%);min-width:18px;height:18px;font-size:10.5px;line-height:18px}
.v4ler .bsh.flx .pb.flpbto{box-shadow:0 -3px 0 var(--acc)}.v4ler .bsh.flx .fli>.flnum{position:absolute;top:-10px;left:50%;transform:translateX(-50%);min-width:20px;height:20px;border-radius:10px;background:var(--acc);color:var(--on-acc,#fff);font:800 11px/20px system-ui,sans-serif;text-align:center;font-style:normal;z-index:6}
.v4ler .flsb{min-height:44px;padding:0 12px;border:1px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);font:inherit;font-weight:800;font-size:13px;cursor:pointer;flex:none}.v4ler .flsb.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.v4ler .flc.sel:not(.on) .tc{opacity:.78}
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
.v4ler .flc .tc .flcv,.v4ler .flpill .pkc .flcv{color:#fff;font-weight:800;position:absolute;inset:0;width:100%!important;height:100%!important;margin:0!important;border-radius:0!important;font-size:7px!important;line-height:1.1;padding:3px!important;box-sizing:border-box;display:block;background-size:cover!important;background-position:center!important;overflow:hidden}
.v4ler .flc .tc .flcv.img{color:transparent!important}
.v4ler .flc.on .tc{outline:3px solid var(--acc);outline-offset:2px}
.v4ler .fldock.open .fllist{flex-wrap:wrap;max-height:36vh;overflow-y:auto;touch-action:pan-y}
.v4ler .fldock.open .flc{width:58px;touch-action:pan-y}.v4ler .fldock.open .flc .tc{width:58px;height:86px}.v4ler .fldock.open .flc .tc .flcv{font-size:9px!important}
.v4ler .flc .tl{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:4px;line-height:1.2}
.v4ler .flfil{display:grid;gap:6px;margin-top:8px}.v4ler .flfil .dchips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}
.v4ler .flpill{position:fixed;left:12px;right:12px;bottom:calc(var(--shx-tab,0px) + 12px + env(safe-area-inset-bottom,0px));z-index:9400;max-width:520px;margin:0 auto;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 10px;border-radius:16px;background:var(--ink);color:var(--bg);box-shadow:0 8px 22px rgba(0,0,0,.32)}
.v4ler .flpill .pkc{width:26px;height:38px;border-radius:2px;flex:none;position:relative;overflow:hidden;background:var(--soft)}.v4ler .flpill b{flex:1;min-width:0;font-size:13px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v4ler .flpill small{display:block;font-weight:600;opacity:.85;font-size:12px;white-space:normal}
.v4ler .flpill button{min-height:44px;padding:0 14px;border:0;border-radius:11px;background:var(--bg);color:var(--ink);font:inherit;font-weight:800;cursor:pointer;flex:none}
.v4ler .flpos{position:fixed;z-index:10002;width:min(330px,calc(100vw - 84px));box-sizing:border-box;padding:10px;border-radius:16px;background:var(--card);color:var(--ink);box-shadow:0 14px 34px rgba(0,0,0,.38);border:1px solid var(--line);animation:flpin .16s ease-out}
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
.v4ler .shx-sx.sxc>div{gap:6px;padding-top:10px;max-height:62vh;overflow-y:auto}
.v4ler .shx-sx.sxc .sxh{display:flex;align-items:center;gap:8px}.v4ler .shx-sx.sxc .sxh b{flex:1;font-size:16px}
.v4ler .shx-sx.sxc .sxx{width:44px;height:44px;border:0;border-radius:12px;background:var(--soft);color:var(--ink);font:700 24px/1 system-ui,sans-serif;cursor:pointer}
.v4ler .shx-sx.sxc .sxl{display:grid;border-radius:14px;overflow:hidden;border:1px solid var(--line)}
.v4ler .shx-sx.sxc .sxl button{min-height:46px;border:0;border-top:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-size:14px;font-weight:700;text-align:left;padding:0 14px;cursor:pointer}.v4ler .shx-sx.sxc .sxl button:first-child{border-top:0}
.v4ler .shx-sx.flarr{inset:auto 0 0 0;background:none;pointer-events:none;z-index:9600}.v4ler .shx-sx.flarr>div{pointer-events:auto;box-shadow:0 -10px 28px rgba(0,0,0,.28);max-height:26vh;gap:8px}
.v4ler .flarr .arg{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -4px;padding:0 4px}.v4ler .flarr .arg::-webkit-scrollbar{display:none}
.v4ler .flarr .arft{display:flex;align-items:center;gap:10px}.v4ler .flarr .arft .argo{flex:1}
.v4ler .flarr .arg button{flex:none;white-space:nowrap;min-height:44px;padding:0 14px!important;border:1px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);font:inherit;font-size:13.5px;font-weight:800;cursor:pointer;padding:0 8px}
.v4ler .flarr .arg button.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.v4ler .flarr .arsw{display:flex;align-items:center;gap:8px;min-height:48px;padding:0 2px;cursor:pointer;flex:none}.v4ler .flarr .arsw span{font-weight:800;font-size:13.5px}.v4ler .flarr .arsw small{display:block;font-weight:600;font-size:12px;color:var(--ink2);margin-top:2px}
.v4ler .flarr .arsw.off{opacity:.6;cursor:default}.v4ler .flarr .arsw input{appearance:none;-webkit-appearance:none;flex:none;width:48px;height:28px;border-radius:14px;background:var(--line);position:relative;cursor:pointer;transition:background .15s;margin:0}.v4ler .flarr .arsw input::before{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .15s}.v4ler .flarr .arsw input:checked{background:var(--acc)}.v4ler .flarr .arsw input:checked::before{transform:translateX(20px)}.v4ler .flarr .arsw input:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
.v4ler .flarr .argo{min-height:48px;justify-content:center}.v4ler .flarr .argo:disabled{opacity:.5}
.v4ler .flcol{position:fixed;top:50%;transform:translateY(-50%);z-index:9500;display:grid;gap:8px;padding:6px;border-radius:30px;background:color-mix(in srgb,var(--card) 72%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 6px 20px rgba(0,0,0,.22);transition:opacity .15s}
.v4ler .flcol.R{right:max(6px,env(safe-area-inset-right,0px))}.v4ler .flcol.L{left:max(6px,env(safe-area-inset-left,0px))}
.v4ler .flcb{position:relative;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--ink);display:grid;place-items:center;cursor:pointer;padding:0;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.v4ler .flcb.ok{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}.v4ler .flcb.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.v4ler .flcb:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
.v4ler .flgrip{width:44px;height:18px;border:0;background:none;padding:0;cursor:grab;touch-action:none;display:grid;place-items:center}.v4ler .flgrip i{display:block;width:20px;height:4px;border-radius:2px;background:var(--ink2);opacity:.55}
.v4ler .flbl{position:absolute;top:50%;transform:translateY(-50%);white-space:nowrap;padding:6px 10px;border-radius:999px;background:var(--ink);color:var(--bg);font-size:12.5px;font-weight:800;pointer-events:none;opacity:0;transition:opacity .15s;box-shadow:0 3px 10px rgba(0,0,0,.25)}
.v4ler .flcol.R .flbl{right:54px}.v4ler .flcol.L .flbl{left:54px}
.v4ler .flcol.lbls .flbl,.v4ler .flcb.lb1 .flbl{opacity:1}
.v4ler.fldrag .flcol,.v4ler .fldrag .flcol,.v5est.fldrag>.flcol{opacity:.25;pointer-events:none}
.v5est.flcolR .bsh.flx.org,.v5est.flcolR .bsh.flx.deco{padding-right:0}.v5est.flcolL .bsh.flx.org,.v5est.flcolL .bsh.flx.deco{padding-left:0}
.v5est.flcolR .fldock{right:60px;border-radius:18px 18px 0 18px}.v5est.flcolL .fldock{left:60px;border-radius:18px 18px 18px 0}
.v4ler .flpill{bottom:auto!important;top:calc(64px + env(safe-area-inset-top,0px))}
.v4ler .flpill.flsp{left:50%;right:auto;transform:translateX(-50%);width:auto;max-width:calc(100vw - 140px);padding:4px 4px 4px 14px;border-radius:999px;gap:8px}.v4ler .flpill.flsp b{font-size:13.5px}.v4ler .flpill.flsp button{min-height:40px;border-radius:999px}
.v4ler .flsw{display:inline-block;width:14px;height:14px;border-radius:4px;margin-right:6px;vertical-align:-2px;border:1px solid rgba(0,0,0,.2);background:var(--bk-back,#2a2a3a)}
.v4ler .flsw.sw-noite{background:#1d2650}.v4ler .flsw.sw-vinho{background:#5e1a2a}.v4ler .flsw.sw-musgo{background:#2f4636}.v4ler .flsw.sw-creme{background:#f0e8d8}.v4ler .flsw.sw-estrelas{background:radial-gradient(1.5px 1.5px at 30% 40%,#fff 60%,transparent),radial-gradient(1.5px 1.5px at 70% 65%,#ffe7a8 60%,transparent),#251c4a}.v4ler .flsw.sw-listras{background:repeating-linear-gradient(90deg,#cfa98a 0 3px,#c39878 3px 6px)}
`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-shxfl]')) { const st = document.createElement('style'); st.dataset.shxfl = 1; st.textContent = SHX_CSSFL; sr.append(st); } } catch {} }; }
try { SHX_ROOTS.forEach((sr) => { if (sr && !sr.querySelector('style[data-shxfl]')) { const st = document.createElement('style'); st.dataset.shxfl = 1; st.textContent = SHX_CSSFL; sr.append(st); } }); } catch {}
// ===================== fim Estante livre =====================
