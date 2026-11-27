// Leituras por mês com três vistas (Bia, 17/11): Faixa (1 ou 2 linhas), Calendário e Estante arrumável.
// A escolha da vista e das linhas fica em db.prefs; a arrumação da estante fica em db.estante[ano] e vai no resumo do perfil
// (snapshot.shelf.estante), para quem visita ver a estante do jeito que a pessoa arrumou.
{ const st = document.createElement('style'); st.textContent = `
.yv-tb{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:.1rem 0 .5rem}
.yv-tb .es5-c{margin:0!important}
.yv-ln{display:flex;flex:none;background:color-mix(in srgb,var(--ink) 7%,transparent);border-radius:9px;padding:2px}
.yv-ln button{border:0;background:none;font:inherit;font-size:.68rem;font-weight:900;padding:.22rem .5rem;border-radius:7px;color:var(--ink-2)}
.yv-ln button.on{background:var(--acc);color:var(--on-acc,#fff)}
.yv-seg{display:flex;background:color-mix(in srgb,var(--ink) 7%,transparent);border-radius:12px;padding:3px;margin:0 0 .55rem}
.yv-seg button{flex:1;border:0;background:none;font:inherit;font-size:.78rem;font-weight:800;padding:.4rem 0;border-radius:9px;color:var(--ink-2)}
.yv-seg button.on{background:var(--acc);color:var(--on-acc,#fff)}
.ys.yv-2 .yv-two{overflow-x:auto;scrollbar-width:none}.ys.yv-2 .yv-two::-webkit-scrollbar{display:none}
.ys.yv-2 .yv-two .ys-row{overflow:visible!important;width:max-content;min-width:100%;gap:3px!important;margin-bottom:.7rem;box-sizing:border-box}
.ys.yv-2 .ys-bk{width:var(--yw)!important}
.ys.yv-2 .ys-bk .cv{width:var(--yw)!important;height:calc(var(--yw) * 1.68)!important}
.ys.yv-2 .ys-bk + .ys-bk{margin-left:1px!important}
.ys.yv-2 .ys-m{font-size:.58rem;padding:.1rem .42rem}
.ys.yv-2.yv-sm .ys-mk{left:50%;transform:translateX(-50%) scale(.8);transform-origin:50% 0}
.yv-cal{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.45rem}
.yv-cm{border:1px solid var(--line);border-radius:14px;padding:.45rem .5rem;min-height:104px;background:color-mix(in srgb,var(--ink) 3%,transparent);text-align:left;font:inherit;color:var(--ink);position:relative;overflow:hidden}
.yv-cm.now{border-color:var(--acc)}.yv-cm.fut{opacity:.4}
.yv-cm b{font-size:.74rem}.yv-cm small{float:right;font-size:.62rem;color:var(--ink-2);font-weight:800;margin-top:.1rem}
.yv-fan{position:relative;height:72px;margin-top:.45rem}
.yv-fan .yv-fc{position:absolute;top:8px;width:36px;height:54px}
#shelflist .yv-fan .yv-fc .mk-bear,.yv-fan .yv-fc .mk-bear{position:absolute!important;top:-9px!important;left:3px!important;transform:scale(.66);transform-origin:0 0;z-index:3;pointer-events:none}
.yv-fan .yv-fc .mk-bear b{font-size:13px!important}
.yv-fan .cv{position:relative!important;display:block;width:36px!important;height:54px!important;border-radius:3px!important;background-size:cover!important;background-position:center!important;box-shadow:0 2px 5px rgba(0,0,0,.35)!important;font-size:.36rem!important}
.yv-fan i{position:absolute;right:0;bottom:2px;font-style:normal;font-size:.62rem;font-weight:900;color:var(--ink-2)}
.yv-est{position:relative}
.yv-eh{display:flex;justify-content:flex-end;margin:-.2rem 0 .45rem}
.yv-eh button{border:1.5px solid var(--acc);background:none;color:var(--acc);font:inherit;font-size:.74rem;font-weight:900;border-radius:99px;padding:.2rem .7rem}
.yv-eh button.on{background:var(--acc);color:var(--on-acc,#fff)}
.yv-sh{--w1:#6e4a33;--w2:#57392a;--bk:#2b1f18;position:relative;border-radius:10px;padding:16px 7px 6px;background:var(--bk);border:7px solid var(--w2);box-shadow:inset 0 0 30px rgba(0,0,0,.6)}
.yv-sh.w-branca{--w1:#e9e2d6;--w2:#d4cabb;--bk:#3a3530}.yv-sh.w-rosa{--w1:#d99aa8;--w2:#c07f8e;--bk:#3c2630}.yv-sh.w-preta{--w1:#2f2f34;--w2:#1d1d21;--bk:#121215}
.yv-sh.w-verde{--w1:#7a9a7a;--w2:#5f7d5f;--bk:#1d2a1f}.yv-sh.w-azul{--w1:#5a6fa0;--w2:#465a86;--bk:#161c2c}
.yv-lt{position:absolute;left:4px;right:4px;top:2px;height:12px;display:flex;justify-content:space-around;pointer-events:none}
.yv-lt i{width:6px;height:6px;border-radius:50%;background:#ffd98a;box-shadow:0 0 9px 3px rgba(255,207,106,.55)}
.yv-lt::before{content:"";position:absolute;left:0;right:0;top:-3px;height:10px;border-bottom:1px solid rgba(160,130,90,.7);border-radius:0 0 50% 50%}
.yv-lt.fita{top:0;height:4px;background:linear-gradient(90deg,#ff7ad9,#8f7bff,#5ad1ff,#ff7ad9);background-size:200% 100%;animation:yvFita 6s linear infinite;box-shadow:0 4px 18px 4px rgba(143,123,255,.4);border-radius:2px}
.yv-lt.fita i,.yv-lt.fita::before{display:none}
@keyframes yvFita{to{background-position:200% 0}}
.yv-row{display:flex;margin-bottom:9px}.yv-row.on .yv-cell{background:color-mix(in srgb,var(--acc) 12%,transparent)}
.yv-cell{flex:1;min-width:0;display:flex;align-items:flex-end;gap:1px;height:96px;padding:0 4px;border-bottom:9px solid var(--w1);overflow-x:auto;overflow-y:hidden;scrollbar-width:none}
.yv-cell::-webkit-scrollbar{display:none}.yv-cell + .yv-cell{border-left:6px solid var(--w1)}
.yv-sp{position:relative;flex:none;width:17px;border:0;padding:0;border-radius:2px 2px 0 0;overflow:hidden;background:var(--c);box-shadow:inset -2px 0 0 rgba(0,0,0,.25),inset 2px 0 0 rgba(255,255,255,.12);display:flex;justify-content:center;cursor:pointer}
.yv-sp .cv{position:absolute!important;inset:0!important;width:auto!important;height:auto!important;border-radius:0!important;background-size:cover!important;background-position:center!important;font-size:0!important}
.yv-sp::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(0,0,0,.05) 40%,rgba(0,0,0,.35))}
.yv-sp em{position:relative;z-index:1;writing-mode:vertical-rl;transform:rotate(180deg);font-style:normal;font-size:.48rem;font-weight:900;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.9);margin:5px 0;white-space:nowrap;overflow:hidden;max-height:calc(100% - 10px)}
.yv-sp.o-in{transform:rotate(-9deg);transform-origin:0 100%;margin:0 5px 0 3px}
.yv-pile{display:flex;flex-direction:column-reverse;gap:1px;flex:none;margin:0 2px}
.yv-pile .yv-sp{width:var(--pw,52px);height:12px!important;border-radius:2px;justify-content:flex-start}
.yv-pile .yv-sp em{writing-mode:horizontal-tb;transform:none;margin:0 0 0 4px;font-size:.42rem;line-height:12px;max-height:none;max-width:calc(100% - 6px);text-overflow:ellipsis}
.yv-sp.sel{outline:2px solid #fff;outline-offset:1px;box-shadow:0 0 0 4px var(--acc)}
.yv-ed{margin-top:.6rem;border:1px dashed var(--acc);border-radius:14px;padding:.55rem .65rem}
.yv-ed h4{margin:.35rem 0 .3rem;font-size:.64rem;color:var(--acc);text-transform:uppercase;letter-spacing:.05em}
.yv-ed p{margin:0;font-size:.72rem;color:var(--ink-2)}
.yv-bar{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}.yv-bar b{flex:1;font-size:.78rem;min-width:6rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.yv-op{display:flex;gap:.3rem;flex-wrap:wrap}
.yv-op button{border:0;font:inherit;font-size:.7rem;font-weight:800;padding:.3rem .55rem;border-radius:9px;background:color-mix(in srgb,var(--ink) 9%,transparent);color:var(--ink-2)}
.yv-op button.on{background:var(--acc);color:var(--on-acc,#fff)}
.yv-op button.sw{width:28px;height:28px;border-radius:50%;padding:0;border:2px solid transparent}.yv-op button.sw.on{border-color:var(--ink)}
`; TR.append(st); }
const YV_AB = { Janeiro: 'Jan', Fevereiro: 'Fev', 'Março': 'Mar', Abril: 'Abr', Maio: 'Mai', Junho: 'Jun', Julho: 'Jul', Agosto: 'Ago', Setembro: 'Set', Outubro: 'Out', Novembro: 'Nov', Dezembro: 'Dez' };
const YV_WOOD = [['natural', '#6e4a33'], ['branca', '#e9e2d6'], ['rosa', '#d99aa8'], ['preta', '#2f2f34'], ['verde', '#7a9a7a'], ['azul', '#5a6fa0']];
const yvPref = (k, v) => { db.prefs = { ...(db.prefs || {}), [k]: v }; save(); };
const yvKey = (t) => normT(t);
const yvSig = () => { const P = db.prefs || {}; return (P.ysView || 'faixa') + (P.ysLines === 2 ? 2 : 1); };
const YV_CTX = new WeakMap(); let YV_LAST = null, YV_ED = {};
// arrumação da estante: completa com os livros novos do ano e tira os que saíram
function yvLayout(stored, list) {
  const keys = new Set(list.map((x) => yvKey(x.t))), seen = new Set();
  let L = stored && Array.isArray(stored.rows) ? JSON.parse(JSON.stringify(stored)) : null;
  if (!L) {
    const per = 7, n = list.length, rows = Math.max(2, Math.ceil(n / (per * 2)));
    L = { wood: 'natural', lights: 'varal', rows: Array.from({ length: rows }, () => [[], []]) };
    list.forEach((x, i) => { const r = Math.min(rows - 1, Math.floor(i / (per * 2))); L.rows[r][Math.floor(i / per) % 2].push([yvKey(x.t), 'pe']); });
    return L;
  }
  L.rows = L.rows.map((r) => r.map((c) => c.filter(([k]) => { if (!keys.has(k) || seen.has(k)) return false; seen.add(k); return true; })));
  if (!L.rows.length) L.rows = [[[]]];
  const last = L.rows[L.rows.length - 1]; const cell = last[last.length - 1];
  list.forEach((x) => { const k = yvKey(x.t); if (!seen.has(k)) { seen.add(k); cell.push([k, 'pe']); } });
  return L;
}
function yvViews(sec, root, items, own) {
  if (!sec || sec.dataset.yv) return; sec.dataset.yv = own ? yvSig() : 'v'; YV_CTX.set(sec, { root, items, own });
  // quem visita vê a vista que a pessoa escolheu (vai no resumo do perfil), sem opção de trocar
  const fsh = !own && S.fpData && S.fpData.shelf, P = own ? db.prefs || {} : { ysView: fsh && fsh.ysView, ysLines: fsh && fsh.ysLines };
  const view = ['faixa', 'cal', 'estante'].includes(P.ysView) ? P.ysView : 'faixa', lines = P.ysLines === 2 ? 2 : 1;
  const y = Number(sec.querySelector('.ys-y > b')?.textContent) || S.ysYear || Number(todayISO().slice(0, 4));
  const list = items.filter((x) => Number(String(x.d).slice(0, 4)) === y).sort((a, b) => String(a.d).localeCompare(String(b.d)));
  YV_LAST = { root, items, own };
  const cnt = sec.querySelector('.es5-c'); const tb = document.createElement('div'); tb.className = 'yv-tb';
  if (cnt) { cnt.before(tb); tb.append(cnt); } else sec.querySelector('.ys-h').after(tb);
  if (view === 'faixa' && own) {
    const ln = document.createElement('div'); ln.className = 'yv-ln';
    ln.innerHTML = '<button type="button" data-l="1" class="' + (lines === 1 ? 'on' : '') + '">1 linha</button><button type="button" data-l="2" class="' + (lines === 2 ? 'on' : '') + '">2 linhas</button>';
    tb.append(ln);
  }
  const seg = document.createElement('div'); seg.className = 'yv-seg';
  seg.innerHTML = [['faixa', 'Faixa'], ['cal', 'Calendário'], ['estante', 'Estante']].map(([k, n]) => '<button type="button" data-v="' + k + '" class="' + (view === k ? 'on' : '') + '">' + n + '</button>').join('');
  if (own) tb.after(seg);
  const row = sec.querySelector('.ys-row'), leg = sec.querySelector('.ys-leg'); if (!row) return;
  if (view === 'faixa') { if (lines === 2) yvTwoLines(sec, row); return; }
  row.style.display = 'none'; if (leg) leg.style.display = 'none';
  if (view === 'cal') yvCalendar(sec, row, list, y, own);
  else yvShelf(sec, row, list, y, own);
}
function yvTwoLines(sec, row) {
  const books = []; row.querySelectorAll('.ys-g').forEach((g) => { const n = (g.querySelector('.ys-m') || {}).textContent || ''; g.querySelectorAll('.ys-bk').forEach((b) => books.push([n, b])); });
  if (books.length < 4) return;
  const W = row.clientWidth || 320, half = Math.ceil(books.length / 2), parts = [books.slice(0, half), books.slice(half)];
  const groupsOf = (arr) => { const out = []; arr.forEach(([n, b]) => { const g = out[out.length - 1]; if (g && g[0] === n) g[1].push(b); else out.push([n, [b]]); }); return out; };
  let w = 64; parts.forEach((p) => { const g = groupsOf(p).length, avail = W - 2 - (g - 1) * 3 - (p.length - g) * 1; w = Math.min(w, Math.floor(avail / p.length)); });
  w = Math.max(26, w); sec.style.setProperty('--yw', w + 'px'); sec.classList.add('yv-2'); if (w < 44) sec.classList.add('yv-sm');
  const wrap = document.createElement('div'); wrap.className = 'yv-two';
  parts.forEach((p) => { const r = document.createElement('div'); r.className = 'ys-row';
    groupsOf(p).forEach(([n, bs]) => { const g = document.createElement('div'); g.className = 'ys-g'; g.innerHTML = '<span class="ys-m">' + esc(YV_AB[n] || n) + '</span><div class="ys-bks"></div>'; bs.forEach((b) => g.lastChild.append(b)); r.append(g); });
    wrap.append(r); });
  row.replaceWith(wrap);
}
function yvCalendar(sec, row, list, y, own) {
  const t = todayISO(), cy = Number(t.slice(0, 4)), cm = Number(t.slice(5, 7));
  const box = document.createElement('div'); box.className = 'yv-cal';
  box.innerHTML = YS_MESES.map((nome, i) => {
    const m = i + 1, g = list.filter((x) => !x.ap && Number(String(x.d).slice(5, 7)) === m), show = g.slice(0, 4), gap = show.length > 1 ? Math.min(21, 58 / (show.length - 1)) : 0;
    const cls = y === cy && m === cm ? ' now' : (y > cy || (y === cy && m > cm)) ? ' fut' : '';
    const tier = (p) => (p >= 5 ? '5' : p >= 4 ? 'ouro' : p >= 3 ? 'prata' : 'bronze');
    const fan = show.map((x, j) => '<span class="yv-fc es-bk"' + (own && x.id ? ' data-id="' + esc(x.id) + '"' : ' data-book="' + esc(x.t) + '" data-author="' + esc(x.a || '') + '"') + ' style="left:' + Math.round(4 + j * gap) + 'px;transform:rotate(' + ((j - (show.length - 1) / 2) * 7).toFixed(1) + 'deg);z-index:' + j + '">' + cvh(x.t, x.c, '') + (x.p ? '<span class="mk-bear t-' + tier(x.p) + '"><b>' + String(x.p).replace('.', ',') + '</b></span>' : '') + '</span>').join('');
    return '<button type="button" class="yv-cm' + cls + '" data-m="' + m + '"><b>' + YV_AB[nome] + '</b><small>' + (g.length ? plural(g.length, 'livro', 'livros') : '—') + '</small><div class="yv-fan">' + fan + (g.length > 4 ? '<i>+' + (g.length - 4) + '</i>' : '') + '</div></button>';
  }).join('');
  box.querySelectorAll('.yv-cm').forEach((b) => b.addEventListener('click', (ev) => { if (ev.target.closest('.yv-fc')) return; const x = sec.querySelector('.ys-x'); if (x) x.click(); }));
  row.after(box); try { paintCv(box); } catch {}
}
function yvShelf(sec, row, list, y, own) {
  const by = new Map(list.map((x) => [yvKey(x.t), x]));
  const fp = !own && S.fpData && S.fpData.shelf && S.fpData.shelf.estante; const stored = own ? (db.estante || {})[y] : (fp && Number(fp.y) === y ? shSafeC(fp) : null); // de outra pessoa: filtrado (auditoria 26/11)
  const E = own && YV_ED.y === y ? YV_ED : { y, edit: false, sel: null, selRow: -1 }; if (own) YV_ED = E;
  let L = yvLayout(stored, list);
  const box = document.createElement('div'); box.className = 'yv-est'; row.after(box);
  const persist = () => { if (!own) return; db.estante = { ...(db.estante || {}), [y]: { wood: L.wood, lights: L.lights, rows: L.rows } }; save(); };
  const where = (k) => { for (let r = 0; r < L.rows.length; r++) for (let c = 0; c < L.rows[r].length; c++) { const i = L.rows[r][c].findIndex(([x]) => x === k); if (i >= 0) return [r, c, i]; } return null; };
  const spine = (k, o) => { const x = by.get(k); if (!x) return '';
    const h = x.pg ? 58 + Math.min(30, Math.round(x.pg / 22)) : 62 + (k.length * 7) % 24;
    const attrs = E.edit ? '' : (own && x.id ? ' data-id="' + esc(x.id) + '"' : ' data-book="' + esc(x.t) + '" data-author="' + esc(x.a || '') + '"');
    return '<button type="button" class="' + (E.edit ? '' : 'es-bk ') + 'yv-sp o-' + o + (E.sel === k ? ' sel' : '') + '" data-k="' + esc(k) + '"' + attrs + ' title="' + esc(x.t) + '" style="height:' + h + 'px;--c:' + colorOf(x.t) + ';--pw:' + (46 + (k.length % 3) * 5) + 'px">' + cvh(x.t, x.c, '') + '<em>' + esc(x.t) + '</em></button>'; };
  const cellHTML = (c) => { let h = '', pile = ''; c.forEach(([k, o]) => { if (o === 'de') pile = spine(k, o) + pile; else { if (pile) { h += '<span class="yv-pile">' + pile + '</span>'; pile = ''; } h += spine(k, o); } });
    return h + (pile ? '<span class="yv-pile">' + pile + '</span>' : ''); };
  const draw = () => {
    const lt = L.lights === 'nada' ? '' : '<div class="yv-lt' + (L.lights === 'fita' ? ' fita' : '') + '">' + '<i></i>'.repeat(9) + '</div>';
    const cur = E.sel && where(E.sel), sx = E.sel && by.get(E.sel), o = cur ? L.rows[cur[0]][cur[1]][cur[2]][1] : '';
    const nr = E.selRow >= 0 && L.rows[E.selRow] ? L.rows[E.selRow].length : 0;
    box.innerHTML = (own ? '<div class="yv-eh"><button type="button" class="' + (E.edit ? 'on' : '') + '">' + (E.edit ? 'Pronto' : 'Arrumar') + '</button></div>' : '')
      + '<div class="yv-sh w-' + esc(L.wood || 'natural') + '">' + lt + L.rows.map((r, ri) => '<div class="yv-row' + (E.edit && ri === E.selRow ? ' on' : '') + '">' + r.map((c, ci) => '<div class="yv-cell" data-r="' + ri + '" data-c="' + ci + '">' + cellHTML(c) + '</div>').join('') + '</div>').join('') + '</div>'
      + (E.edit ? '<div class="yv-ed">'
        + (sx ? '<div class="yv-bar"><b>' + esc(sx.t) + '</b><div class="yv-op">' + [['pe', 'Em pé'], ['in', 'Inclinado'], ['de', 'Deitado']].map(([k, n]) => '<button type="button" data-o="' + k + '" class="' + (o === k ? 'on' : '') + '">' + n + '</button>').join('') + '</div></div><p>Agora toque em outro livro para pôr este antes dele, ou num espaço vazio da prateleira.</p>'
          : '<p>Toque num livro para escolher; depois toque onde ele vai ficar. Toque numa prateleira vazia para escolher a prateleira.</p>')
        + '<h4>Madeira</h4><div class="yv-op">' + YV_WOOD.map(([k, c]) => '<button type="button" class="sw' + ((L.wood || 'natural') === k ? ' on' : '') + '" data-w="' + k + '" style="background:' + c + '" aria-label="' + k + '"></button>').join('') + '</div>'
        + '<h4>Luzes em cima</h4><div class="yv-op">' + [['nada', 'Sem luz'], ['varal', 'Varal amarelo'], ['fita', 'Fita colorida']].map(([k, n]) => '<button type="button" data-lt="' + k + '" class="' + ((L.lights || 'varal') === k ? 'on' : '') + '">' + n + '</button>').join('') + '</div>'
        + '<h4>Prateleira ' + (E.selRow >= 0 ? E.selRow + 1 : '') + '</h4><div class="yv-op">' + (E.selRow >= 0 ? [1, 2, 3].map((n) => '<button type="button" data-n="' + n + '" class="' + (nr === n ? 'on' : '') + '">' + (n === 1 ? '1 nicho' : n + ' nichos') + '</button>').join('') + (L.rows.length > 1 ? '<button type="button" data-rm="1">Tirar prateleira</button>' : '') : '') + '<button type="button" data-add="1">+ Prateleira</button></div>'
        + '</div>' : '');
    try { paintCv(box); } catch {}
  };
  box.addEventListener('click', (ev) => {
    const t = ev.target;
    if (t.closest('.yv-eh button')) { E.edit = !E.edit; E.sel = null; E.selRow = E.edit ? L.rows.length - 1 : -1; draw(); return; }
    if (!E.edit) return;
    const b = t.closest('button');
    if (b && b.dataset.o && E.sel) { const p = where(E.sel); if (p) L.rows[p[0]][p[1]][p[2]][1] = b.dataset.o; persist(); draw(); return; }
    if (b && b.dataset.w) { L.wood = b.dataset.w; persist(); draw(); return; }
    if (b && b.dataset.lt) { L.lights = b.dataset.lt; persist(); draw(); return; }
    if (b && b.dataset.n && E.selRow >= 0) { const r = L.rows[E.selRow], n = Number(b.dataset.n);
      while (r.length < n) r.push([]); while (r.length > n) { const x = r.pop(); r[r.length - 1].push(...x); } persist(); draw(); return; }
    if (b && b.dataset.add) { L.rows.push([[]]); E.selRow = L.rows.length - 1; persist(); draw(); return; }
    if (b && b.dataset.rm && E.selRow >= 0 && L.rows.length > 1) { const gone = L.rows.splice(E.selRow, 1)[0].flat(); const to = L.rows[Math.max(0, E.selRow - 1)]; to[to.length - 1].push(...gone); E.selRow = Math.max(0, E.selRow - 1); persist(); draw(); return; }
    const sp = t.closest('.yv-sp'), cell = t.closest('.yv-cell');
    if (sp) { const k = sp.dataset.k;
      if (!E.sel) { E.sel = k; E.selRow = where(k)[0]; draw(); return; }
      if (E.sel === k) { E.sel = null; draw(); return; }
      const a = where(E.sel), it = L.rows[a[0]][a[1]].splice(a[2], 1)[0], d = where(k); L.rows[d[0]][d[1]].splice(d[2], 0, it); E.selRow = d[0]; E.sel = null; persist(); draw(); return; }
    if (cell) { const r = Number(cell.dataset.r), c = Number(cell.dataset.c); E.selRow = r;
      if (E.sel) { const a = where(E.sel), it = L.rows[a[0]][a[1]].splice(a[2], 1)[0]; L.rows[r][c].push(it); E.sel = null; persist(); }
      draw(); }
  });
  draw();
}
const YV_MOUNT = { f: null };
{ const _mys = mountYearShelf; YV_MOUNT.f = mountYearShelf = function (root, at, items, own) {
    _mys.apply(this, arguments);
    try { const sec = root && root.querySelector('.ys'); if (sec) yvViews(sec, root, items, own); } catch (err) { console.warn('vistas das leituras', err); }
  }; }
{ const _ps3 = profShelvesSnap; profShelvesSnap = function (snapshot) { _ps3.apply(this, arguments);
    try { const y = Number(todayISO().slice(0, 4)), L = (db.estante || {})[y]; if (L && snapshot.shelf) snapshot.shelf.estante = { y, wood: L.wood, lights: L.lights, rows: L.rows };
      const P = db.prefs || {}; if (snapshot.shelf) { snapshot.shelf.ysView = P.ysView || 'faixa'; snapshot.shelf.ysLines = P.ysLines === 2 ? 2 : 1; } } catch {} }; }

// botões das vistas por delegação, e refaz a seção quando o perfil volta com uma cópia antiga dela
const yvRemount = (sec) => { const c = YV_CTX.get(sec) || YV_LAST; if (!c) return; const tmp = document.createElement('div'); sec.before(tmp); sec.remove(); try { YV_MOUNT.f(tmp.parentElement, tmp, c.items, c.own); } finally { tmp.remove(); } };
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('.yv-ln button, .yv-seg button'); if (!b) return; const sec = b.closest('.ys'); if (!sec) return;
  if (b.dataset.l) yvPref('ysLines', Number(b.dataset.l)); else if (b.dataset.v) yvPref('ysView', b.dataset.v); yvRemount(sec); });
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => TR.querySelectorAll('.ys[data-yv]').forEach((sec) => { if (!YV_CTX.has(sec) || (sec.dataset.yv !== 'v' && sec.dataset.yv !== yvSig())) yvRemount(sec); }), 60); }).observe(TR, { childList: true, subtree: true }); }
// passar o dedo/mouse: no calendário a capa sai do leque (endireita e cresce); na estante a lombada sobe e abre mostrando a capa
{ const st = document.createElement('style'); st.textContent = `
.yv-cm{overflow:visible!important}
.yv-fan .yv-fc{transition:transform .18s cubic-bezier(.2,1.3,.4,1),filter .18s;transform-origin:50% 100%}
.yv-fan .yv-fc:hover,.yv-fan .yv-fc.yv-up{transform:translateY(-8px) scale(1.3)!important;z-index:9!important;filter:drop-shadow(0 8px 10px rgba(0,0,0,.35))}
.yv-sp.es-bk{transition:transform .18s cubic-bezier(.2,1.3,.4,1),filter .18s}
.yv-sp.es-bk:not(.o-de):hover,.yv-sp.es-bk:not(.o-de).yv-up{transform:translateY(-6px);z-index:5;overflow:visible;filter:drop-shadow(0 6px 8px rgba(0,0,0,.45))}
.yv-sp.es-bk:not(.o-de):hover .cv,.yv-sp.es-bk:not(.o-de).yv-up .cv{font-size:.42rem!important;left:50%!important;right:auto!important;width:48px!important;transform:translateX(-50%) scale(1.08);transform-origin:50% 100%;border-radius:3px!important;box-shadow:0 4px 10px rgba(0,0,0,.4)}
.yv-cell:has(.yv-up),.yv-cell:has(.yv-sp:hover){overflow:visible}
.yv-sp.es-bk:not(.o-de):hover em,.yv-sp.es-bk:not(.o-de).yv-up em,.yv-sp.es-bk:not(.o-de):hover::after,.yv-sp.es-bk:not(.o-de).yv-up::after{opacity:0}
.yv-sp.o-in.es-bk:hover,.yv-sp.o-in.es-bk.yv-up{transform:rotate(0) translateY(-6px)}
.yv-sp.o-de.es-bk:hover,.yv-sp.o-de.es-bk.yv-up{transform:translateY(-3px) scale(1.06);filter:drop-shadow(0 4px 6px rgba(0,0,0,.4))}
.yv-sp em,.yv-sp::after{transition:opacity .15s}
`; TR.append(st);
  let last = null; const sel = '.yv-fc, .yv-sp.es-bk';
  const up = (b) => { if (last === b) return; last && last.classList.remove('yv-up'); last = b; b && b.classList.add('yv-up'); };
  TR.addEventListener('touchmove', (ev) => { const t = ev.touches[0]; if (!t) return; const n = TR.elementFromPoint(t.clientX, t.clientY); const b = n && n.closest && n.closest(sel); if (b || last) up(b || null); }, { passive: true });
  TR.addEventListener('touchstart', (ev) => { const b = ev.target.closest && ev.target.closest(sel); up(b || null); }, { passive: true });
  TR.addEventListener('touchend', () => setTimeout(() => up(null), 700), { passive: true }); }
