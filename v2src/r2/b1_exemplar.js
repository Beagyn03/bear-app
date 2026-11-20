// Emprestar não muda o exemplar (teste 26, 20/11): o formato vem do livro; "Voltou" devolve o exemplar como estava.
// Meu exemplar (Bia, 19/11): separado da situação de leitura. e.ex = { own: 'tenho'|'quero'|'pegou', fmt, tags, loan, borrow, log }.
// Tenho (com formato e detalhes) e emprestar (para quem, quando, até quando); Quero ter (aparece no perfil para presentes);
// Peguei emprestado (de quem, quando, até quando). Lembrete de devolução no Início. A amiga ainda não vê o empréstimo do lado
// dela (fase 2, precisa da API).
{ const st = document.createElement('style'); st.textContent = `
.ex-2col{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;align-items:end}.ex-2col .ex-f{margin:0;min-width:0}.ex-2col .ex-f label small{font-weight:600;color:var(--ink-2);font-size:.72rem}.ex-2col input{width:100%;box-sizing:border-box;min-height:44px}
.ex-opt{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem}
.ex-opt button{border:1.5px solid var(--line);border-radius:14px;padding:.6rem .3rem;background:var(--bg);color:var(--ink);font:inherit;font-size:.8rem;font-weight:800;cursor:pointer;display:grid;gap:.15rem;justify-items:center}
.ex-opt button i{font-style:normal;font-size:1.2rem}.ex-opt button.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 12%,var(--panel));color:var(--acc)}
.ex-hd{display:flex;gap:.6rem;align-items:center;margin:.2rem 0 .4rem}.ex-hd .cv{width:40px!important;height:60px!important;border-radius:3px 5px 5px 3px!important;font-size:.4rem!important;flex:none}.ex-hd b{display:block;font-size:.95rem}.ex-hd small{font-size:.76rem;color:var(--ink-2)}
.ex-loan{border:1px solid var(--line);border-radius:14px;padding:.65rem .75rem;background:var(--bg);display:grid;gap:.45rem}.ex-loan b{font-size:.9rem}.ex-loan small{font-size:.78rem;color:var(--ink-2)}.ex-loan .late{color:#b33;font-weight:900}
.ex-loan .r{display:flex;gap:.4rem}.ex-loan .r button,.ex-go{border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.45rem .8rem;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}
.ex-go{width:100%;text-align:left;display:flex;justify-content:space-between;align-items:center;border-radius:14px;padding:.65rem .8rem;font-size:.88rem}
.ex-f{display:grid;gap:.25rem;margin:.45rem 0}.ex-f label{font-size:.74rem;font-weight:800;color:var(--ink-2)}.ex-f input{border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit;font-size:.9rem;padding:.5rem .65rem}
.ex-who{display:flex;flex-wrap:wrap;gap:.35rem}.ex-who button{display:flex;align-items:center;gap:.35rem;border:1.5px solid var(--line);border-radius:99px;padding:.25rem .7rem .25rem .25rem;background:var(--bg);color:var(--ink);font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}
.ex-who button u{width:24px;height:24px;border-radius:50%;background:#c9a07a;color:#fff;text-decoration:none;display:grid;place-items:center;font-size:.7rem}.ex-who button.on{border-color:var(--acc);color:var(--acc)}
.ex-bdg{position:absolute;right:3px;bottom:3px;z-index:9002;width:24px;height:24px;border-radius:50%;background:var(--panel);display:grid;place-items:center;font-size:.8rem;box-shadow:0 1px 4px rgba(0,0,0,.3);pointer-events:none}
.ex-tag{display:inline-block;font-size:.66rem;font-weight:900;padding:.1rem .45rem;border-radius:99px;margin-left:.3rem;background:#fde3cf;color:#a2521d}.ex-tag.late{background:#f7d3d3;color:#b33}.ex-tag.peg{background:#e5dcf4;color:#7b5aa6}
.bp-ex{display:flex;align-items:center;gap:.5rem;width:100%;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.55rem .75rem;margin:.2rem 0 .7rem;font:inherit;font-size:.86rem;color:var(--ink);text-align:left;cursor:pointer}
.bp-ex b{font-weight:900}.bp-ex span{flex:1;min-width:0}.bp-ex small{display:block;font-size:.74rem;color:var(--ink-2)}.bp-ex em{font-style:normal;color:var(--ink-2)}
.ex-alert{display:grid;gap:.4rem;margin:0 0 .9rem}.ex-alert button{display:flex;gap:.6rem;align-items:center;width:100%;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.6rem .75rem;font:inherit;font-size:.84rem;color:var(--ink);text-align:left;cursor:pointer}
.ex-alert button.late{border-color:#e7b4b4;background:color-mix(in srgb,#f7d3d3 35%,var(--panel))}.ex-alert i{font-style:normal;font-size:1.1rem}.ex-alert small{display:block;font-size:.74rem;color:var(--ink-2)}
`; TR.append(st); }
const EX_FMT = [['PAPER', 'Livro físico'], ['EBOOK', 'E-book'], ['AUDIO', 'Audiolivro']];
const EX_TAGS = [['autografado', 'Autografado'], ['especial', 'Edição especial'], ['presente', 'Presente de alguém']];
const exOf = (e) => (e && e.ex) || {};
const exD = (d) => (d ? String(d).slice(8, 10) + '/' + String(d).slice(5, 7) : '');
const exLate = (due) => (due && due < todayISO() ? Math.round((Date.parse(todayISO()) - Date.parse(due)) / 864e5) : 0);
const exName = (p) => (p ? (p.n || (p.h ? '@' + p.h : '')) : '');
function exSum(e) { const x = exOf(e);
  if (x.own === 'tenho') return x.loan ? 'emprestado para ' + exName(x.loan.to) + (exLate(x.loan.due) ? ' · atrasado' : '') : 'tenho · ' + ((EX_FMT.find((f) => f[0] === (x.fmt || 'PAPER')) || [])[1] || '').toLowerCase();
  if (x.own === 'quero') return 'quero ter'; if (x.own === 'pegou') return 'peguei emprestado' + (x.borrow ? ' de ' + exName(x.borrow.from) : ''); return 'tenho, quero ter ou peguei emprestado'; }
function exLog(e, ev) { const x = e.ex = e.ex || {}; x.log = [...(x.log || []), { ...ev, ts: new Date().toISOString() }].slice(-30); }
function exSheet(e, view) {
  if (!e) return; TR.querySelector('.esn-sheet.ex-sh')?.remove();
  const sh = document.createElement('div'); sh.className = 'esn-sheet ex-sh'; let mode = view || 'main', who = null, other = '';
  const close = () => { sh.remove(); try { refresh(); } catch {} const v = $('#shelflist'); if (v && !v.hidden && S.listRedraw) try { S.listRedraw(); } catch {} };
  const set = (fn) => { e.ex = e.ex || {}; fn(e.ex); if (!e.ex.own && !e.ex.loan && !(e.ex.log || []).length) delete e.ex; save(); try { publishSnapshot(); } catch {} try { exApiLoan(e); } catch {} paint(); };
  const friends = () => (SOC.fr && SOC.fr.friends) || [];
  const whoPick = (cur) => '<div class="ex-who">' + friends().map((f) => '<button type="button" data-h="' + esc(f.handle) + '" class="' + (cur && cur.h === f.handle ? 'on' : '') + '"><u>' + esc(initial(f.displayName || f.handle)) + '</u>' + esc(String(f.displayName || f.handle).split(' ')[0]) + '</button>').join('') + '</div>'
    + '<div class="ex-f"><label>' + (friends().length ? 'Ou alguém de fora do app' : 'Nome') + '</label><input type="text" class="ex-other" maxlength="40" placeholder="Nome" value="' + esc(cur && !cur.h ? cur.n || '' : '') + '"></div>';
  const paint = () => {
    const x = exOf(e), today = todayISO();
    let h = '<div class="box"><div class="ex-hd">' + cvh(e.title, e.cover, '') + '<div><b>' + esc(e.title) + '</b><small>' + esc(e.author || '') + '</small></div></div>';
    if (mode === 'main') {
      h += '<h4>Meu exemplar</h4><div class="ex-opt">' + [['tenho', '<i class=v3e data-i=estante></i>', 'Tenho'], ['quero', '<i class=v3e data-i=heart></i>', 'Quero ter'], ['pegou', '<i class=v3e data-i=friends></i>', 'Peguei emprestado']].map(([k, i, n]) => '<button type="button" data-own="' + k + '" class="' + (x.own === k ? 'on' : '') + '"><i>' + i + '</i>' + n + '</button>').join('') + '</div>';
      if (x.own === 'tenho') {
        h += '<h4>Formato</h4><div class="ch">' + EX_FMT.map(([k, n]) => '<button type="button" data-fmt="' + k + '" class="' + ((x.fmt || 'PAPER') === k ? 'on' : '') + '">' + n + '</button>').join('') + '</div>';
        h += '<h4>Empréstimo</h4>' + (x.loan ? '<div class="ex-loan"><div><b>Com ' + esc(exName(x.loan.to)) + '</b><small> desde ' + exD(x.loan.at) + (x.loan.due ? ' · volta ' + exD(x.loan.due) : '') + '</small>' + (exLate(x.loan.due) ? '<div class="late">Atrasado ' + plural(exLate(x.loan.due), 'dia', 'dias') + '</div>' : '') + '</div><div class="r"><button type="button" data-a="back">Devolveram</button><button type="button" data-a="loan">Mudar</button></div></div>'
          : '<button type="button" class="ex-go" data-a="loan"><span><i class=v3e data-i=swap></i>Emprestar</span><em>›</em></button>');
        h += '<h4>Detalhes <span style="text-transform:none;letter-spacing:0;font-weight:700">(opcional)</span></h4><div class="ch">' + EX_TAGS.map(([k, n]) => '<button type="button" data-tag="' + k + '" class="' + ((x.tags || []).includes(k) ? 'on' : '') + '">' + n + '</button>').join('') + '</div>';
      } else if (x.own === 'pegou') {
        h += '<h4>Peguei emprestado</h4>' + (x.borrow ? '<div class="ex-loan"><div><b>De ' + esc(exName(x.borrow.from)) + '</b><small> desde ' + exD(x.borrow.at) + (x.borrow.due ? ' · devolver até ' + exD(x.borrow.due) : '') + '</small>' + (exLate(x.borrow.due) ? '<div class="late">Passou ' + plural(exLate(x.borrow.due), 'dia', 'dias') + ' da data</div>' : '') + '</div><div class="r"><button type="button" data-a="gaveback">Devolvi</button><button type="button" data-a="borrow">Mudar</button></div></div>'
          : '<button type="button" class="ex-go" data-a="borrow"><span><i class=v3e data-i=friends></i>De quem e até quando</span><em>›</em></button>');
      } else if (x.own === 'quero') h += '<p style="font-size:.82rem;color:var(--ink-2);margin:.6rem 0 0;line-height:1.4">Aparece em “Quero ter” no seu perfil, para as amizades verem (ideia de presente).</p>';
      h += '<div class="acts" style="grid-template-columns:1fr"><button type="button" class="p" data-a="ok">Pronto</button></div>';
    } else {
      const L = mode === 'loan' ? x.loan || {} : x.borrow || {}, cur = who || (mode === 'loan' ? L.to : L.from);
      h += '<h4>' + (mode === 'loan' ? 'Para quem' : 'De quem') + '</h4>' + whoPick(cur)
        // datas lado a lado (Bia, 20/11): rótulos curtos, devolver vazio mostra 'sem data'
        + '<div class="ex-2col"><div class="ex-f"><label>' + (mode === 'loan' ? 'Emprestei em' : 'Peguei em') + '</label><input type="date" class="ex-at" max="' + today + '" value="' + esc(L.at || today) + '"></div>'
        + '<div class="ex-f"><label>Devolver até <small>(opcional)</small></label><input type="' + (L.due ? 'date' : 'text') + '" class="ex-due" placeholder="sem data" onfocus="this.type=&quot;date&quot;" onblur="if(!this.value)this.type=&quot;text&quot;" value="' + esc(L.due || '') + '"></div></div>'
        + '<div class="acts"><button type="button" data-a="cancel">Voltar</button><button type="button" class="p" data-a="save">' + (mode === 'loan' ? 'Registrar empréstimo' : 'Salvar') + '</button></div>';
    }
    sh.innerHTML = h + '</div>'; try { paintCv(sh); } catch {}
    sh.querySelectorAll('[data-own]').forEach((b) => b.addEventListener('click', () => set((x) => { const k = b.dataset.own; if (x.own === k) { if (x.loan) return toast('Registre a devolução antes'); delete x.own; delete x.borrow; } else { if (x.loan && k !== 'tenho') return toast('Registre a devolução antes'); x.own = k; if (k !== 'pegou') delete x.borrow; } })));
    sh.querySelectorAll('[data-fmt]').forEach((b) => b.addEventListener('click', () => set((x) => { x.fmt = b.dataset.fmt; })));
    sh.querySelectorAll('[data-tag]').forEach((b) => b.addEventListener('click', () => set((x) => { const k = b.dataset.tag, T0 = x.tags || []; x.tags = T0.includes(k) ? T0.filter((y) => y !== k) : [...T0, k]; })));
    sh.querySelectorAll('.ex-who [data-h]').forEach((b) => b.addEventListener('click', () => { const f = friends().find((y) => y.handle === b.dataset.h); who = { h: f.handle, n: f.displayName || f.handle }; const o = sh.querySelector('.ex-other'); if (o) o.value = ''; sh.querySelectorAll('.ex-who button').forEach((y) => y.classList.toggle('on', y === b)); }));
    sh.querySelector('.ex-other')?.addEventListener('input', (ev) => { if (ev.target.value.trim()) { who = { n: ev.target.value.trim() }; sh.querySelectorAll('.ex-who button').forEach((y) => y.classList.remove('on')); } });
    const act = (a) => {
      if (a === 'ok') return close();
      if (a === 'loan' || a === 'borrow') { mode = a; who = null; return paint(); }
      if (a === 'cancel') { mode = 'main'; return paint(); }
      if (a === 'back') return set((x) => { exLog(e, { t: 'devolveram', to: x.loan.to, at: x.loan.at }); delete x.loan; if (x.loanPrev) { if (x.loanPrev.own) x.own = x.loanPrev.own; else delete x.own; if (x.loanPrev.fmt) x.fmt = x.loanPrev.fmt; else delete x.fmt; delete x.loanPrev; } toast('Devolução registrada'); });
      if (a === 'gaveback') return set((x) => { exLog(e, { t: 'devolvi', from: x.borrow && x.borrow.from }); delete x.borrow; delete x.own; toast('Devolução registrada'); });
      if (a === 'save') { const at = (sh.querySelector('.ex-at') || {}).value || todayISO(), due = (sh.querySelector('.ex-due') || {}).value || '';
        const L = mode === 'loan' ? exOf(e).loan : exOf(e).borrow, p = who || (L ? (mode === 'loan' ? L.to : L.from) : null);
        if (!p || !exName(p)) return toast(mode === 'loan' ? 'Escolha para quem' : 'Escolha de quem');
        if (due && due < at) return toast('A devolução precisa ser depois da data');
        const m0 = mode; mode = 'main';
        return set((x) => { if (m0 === 'loan') { if (!x.loanPrev) x.loanPrev = { own: x.own || null, fmt: x.fmt || null }; if (!x.own) x.own = 'tenho'; if (!x.fmt && e.format) x.fmt = e.format === 'FISICO' ? 'PAPER' : e.format; x.loan = { to: p, at, ...(due ? { due } : {}) }; exLog(e, { t: 'emprestei', to: p, at }); toast('Empréstimo registrado'); } else { x.own = 'pegou'; x.borrow = { from: p, at, ...(due ? { due } : {}) }; } }); }
    };
    sh.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => act(b.dataset.a)));
  };
  sh.addEventListener('click', (ev) => { if (ev.target === sh) close(); }); paint(); TR.append(sh);
}
// página do livro: linha "Meu exemplar" embaixo da capa
{ const _ob = openBookPage; openBookPage = function (e) { S.exBookId = e && !e._preview && lib().includes(e) ? e.id : null; return _ob.apply(this, arguments); };
  let tm = 0; const put = () => { const v = $('#shelflist'); if (!v || v.hidden || !S.exBookId) return; const hero = v.querySelector('.bp-hero'); if (!hero) return; const e = byId(S.exBookId); if (!e) return;
    const x = exOf(e), late = x.loan && exLate(x.loan.due), want = (x.own || '') + '|' + exSum(e) + '|' + late; let b = v.querySelector('.bp-ex');
    if (b && b.dataset.k === want) return; if (!b) { b = document.createElement('button'); b.type = 'button'; b.className = 'bp-ex'; b.addEventListener('click', () => exSheet(byId(S.exBookId))); }
    b.dataset.k = want; b.innerHTML = '<i style="font-style:normal">' + (x.loan ? '<i class=v3e data-i=swap></i>' : x.own === 'pegou' ? '<i class=v3e data-i=friends></i>' : x.own === 'quero' ? '<i class=v3e data-i=heart></i>' : '<i class=v3e data-i=estante></i>') + '</i><span><b>Meu exemplar</b><small>' + esc(exSum(e)) + '</small></span><em>›</em>';
    if (b.previousElementSibling !== hero) hero.after(b); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 60); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// Início: devoluções que chegaram (ou passaram) da data
{ let tm = 0; const put = () => {
    if (S.tab !== 'inicio') return; const box = TR.querySelector('#lista:not(.lista-snap)'); if (!box || box.querySelector('.ex-alert')) return; const anchor = box.querySelector('.v3-now'); if (!anchor) return;
    const soon = (d) => d && Math.round((Date.parse(d) - Date.parse(todayISO())) / 864e5) <= 3;
    const items = lib().flatMap((e) => { const x = exOf(e), r = []; if (x.loan && soon(x.loan.due)) r.push({ e, i: '<i class=v3e data-i=swap></i>', t: e.title + ' está com ' + exName(x.loan.to), d: x.loan.due }); if (x.own === 'pegou' && x.borrow && soon(x.borrow.due)) r.push({ e, i: '<i class=v3e data-i=friends></i>', t: 'Devolver ' + e.title + ' para ' + exName(x.borrow.from), d: x.borrow.due }); return r; });
    if (!items.length) return;
    const w = document.createElement('div'); w.className = 'ex-alert';
    w.innerHTML = items.slice(0, 3).map((it, k) => { const late = exLate(it.d); return '<button type="button" data-k="' + k + '" class="' + (late ? 'late' : '') + '"><i>' + it.i + '</i><span><b>' + esc(it.t) + '</b><small>' + (late ? 'atrasado ' + plural(late, 'dia', 'dias') : it.d === todayISO() ? 'devolução hoje' : 'devolução em ' + exD(it.d)) + '</small></span></button>'; }).join('');
    w.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => exSheet(items[+b.dataset.k].e)));
    anchor.after(w); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 120); }).observe(TR, { childList: true, subtree: true }); }
// perfil: "Quero ter" (o seu, dos dados do aparelho; o da amizade, do resumo publicado)
{ const _ps = profShelvesSnap; profShelvesSnap = function (snapshot) { _ps.apply(this, arguments);
    try { if (snapshot.shelf) { const P = db.prefs || {}; snapshot.shelf.wish = P.wishHide ? [] : lib().filter((e) => exOf(e).own === 'quero').slice(0, 24).map((e) => ({ title: e.title, author: e.author || null, cover: e.cover && !/^data:/.test(e.cover) && e.cover.length < 600 ? e.cover : null })); } } catch {} }; }
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments);
  try { const v = $('#shelflist'), d = S.fpData; if (v.hidden || !d || d.handle !== h || v.querySelector('.ex-wish')) return r;
    const mine = !!d.self, hide = mine && (db.prefs || {}).wishHide, books = mine ? lib().filter((e) => exOf(e).own === 'quero').map((e) => ({ title: e.title, author: e.author, cover: e.cover })) : ((d.shelf && d.shelf.wish) || []);
    if (!books.length) return r;
    const t = document.createElement('div'); t.className = 'ex-wish';
    t.innerHTML = '<div class="v3-sh"><b><i class=v3e data-i=heart></i>Quero ter</b>' + (mine ? '<button type="button" class="v3-link ex-wh">' + (hide ? 'Mostrar no perfil' : 'Esconder do perfil') + '</button>' : '') + '</div>'
      + (hide ? '<p style="font-size:.8rem;color:var(--ink-2);margin:0 0 .8rem">Escondido: só você vê.</p>' : '')
      + '<div class="t5-row">' + books.map((b) => '<button type="button" class="t5-bk es-bk" data-book="' + esc(b.title) + '" data-author="' + esc(b.author || '') + '">' + cvh(b.title, b.cover, 'es-cv') + '</button>').join('') + '</div>'
      + (!mine ? '<p style="font-size:.76rem;color:var(--ink-2);margin:.2rem 0 .9rem">Livros que ' + esc(String(d.displayName || '@' + d.handle).split(' ')[0]) + ' quer ter. Uma ideia de presente.</p>' : '');
    const at = [...v.querySelectorAll('.v3-sh')].find((x) => /^Lidos recentes/.test(x.textContent.trim())); if (at) at.before(t); else v.querySelector('.sl-body').append(t);
    t.querySelector('.ex-wh')?.addEventListener('click', () => { db.prefs = { ...(db.prefs || {}), wishHide: !hide }; save(); try { publishSnapshot(); } catch {} friendPage(h); });
    try { paintCv(t); } catch {}
  } catch (err) { console.warn('quero ter', err); }
  return r; }; }
