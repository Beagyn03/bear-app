// v4 folhas que ainda abriam no estilo antigo (Bia, 20/11; etapa 7 do alinhamento com o protótipo v3).
// No visual do protótipo (camada V4): Prioridade, Estantes do livro, Indicar a alguém, Ler junto (convidar) e Adicionar livros a uma estante.
// Prazo, Emprestar e Editar/Nova estante continuam com a lógica antiga (lembretes, empréstimo na API, metas da estante), mas ganham
// a pele das folhas do protótipo (cantos, alça, títulos em serifa, linhas e botões iguais).
// Também: "Contar na meta" do Ler de novo (e.rereadNoGoal) passa a valer na meta do ano, e usar uma estante preenche s.touchedAt.
const V7CSS = `.v4ler .v7l .li{width:100%}.v4ler .v7chk{width:22px;height:22px;border-radius:7px;border:2px solid var(--line);display:grid;place-items:center;flex:none;color:transparent}
.v4ler .v7chk.on{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}.v4ler .v7chk svg{width:14px;height:14px}
.v4ler .v7av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:900;flex:none;background-size:cover;background-position:center}
.v4ler .v7q{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:14px;border:1.5px solid var(--line);background:var(--soft);color:var(--ink);font:inherit;margin:4px 0 8px}
.v4ler .v7scr{max-height:46vh;overflow:auto;margin:0 -4px;padding:0 4px}
.v4ler .v7l .cv{width:34px;height:51px;border-radius:3px 5px 5px 3px;font-size:0;flex:none;background-size:cover;background-position:center}
.v4ler .v7foot{display:flex;gap:8px;margin-top:12px}.v4ler .v7foot .btn{flex:1}
.v4ler .v7empty{padding:14px;border:1.5px dashed var(--line);border-radius:14px;text-align:center;color:var(--ink2);font-size:13px;line-height:1.45}`;
const v7Ctx = () => v4State().v7 || {};
function v7Sheet(k, ctx) { const st = v4State(); st.v7 = ctx || {}; if (ctx && ctx.e) st.sheetE = ctx.e.id; st.sheet = k; v7Arm(v4Root()); v4Draw(); }
function v7Close() { const st = v4State(); st.sheet = null; if (!st.view) v4Close(); else v4Draw(); }
function v7Arm(R) { if (!R) return R; try { const sr = R.getRootNode(); if (sr && sr.querySelector && !sr.querySelector('style[data-v7]')) { const st = document.createElement('style'); st.dataset.v7 = 1; st.textContent = V7CSS; sr.append(st); } } catch {} if (R.dataset.v7) return R; R.dataset.v7 = 1; R.addEventListener('click', v7Click, true); R.addEventListener('input', v7Input, true); return R; }
const v7Fr = () => (SOC.fr && SOC.fr.friends) || [];
const v7Head = (e, t) => `<div class="sh-bk">${v4cv(e)}<div><h3>${t}</h3><span class="mut">${esc(e.title)}</span></div></div>`;
const v7Chk = (on) => `<span class="v7chk${on ? ' on' : ''}">${v4ic('ok', 14)}</span>`;
const v7Av = (f) => { let ph = null; try { ph = avatarOf(f.handle); } catch {} return `<span class="v7av" style="background-color:${friendColor(f.handle)};${ph ? `background-image:url('${ph}')` : ''}">${ph ? '' : esc(initial(f.displayName || f.handle))}</span>`; };
const v4SheetHTML_v7 = v4SheetHTML;
v4SheetHTML = function (k) {
  if (!String(k).startsWith('v7')) return v4SheetHTML_v7(k);
  const c = v7Ctx(), e = c.e || {};
  if (k === 'v7prio') { const cur = e.prio || 2;
    return v7Head(e, 'Prioridade') + `<div class="list v7l">${[[1, 'Alta', 'vai para a frente da fila'], [2, 'Normal', ''], [3, 'Baixa', 'fica no fim da fila']].map(([p, n, sm]) => `<button class="li rp${cur === p ? ' on' : ''}" data-a="v7prio" data-p="${p}"><span class="rd2"></span><span class="t">${n}${sm ? `<small>${sm}</small>` : ''}</span></button>`).join('')}</div>`; }
  if (k === 'v7est') { const L = (db.shelves || []).filter((s) => !s.arch);
    return v7Head(e, 'Estantes') + `<p class="mut" style="margin:0 0 8px">Marque uma ou várias. Tirar de uma estante não apaga nota, avaliação nem progresso.</p>
    <button class="btn s w" data-a="v7new" style="margin-bottom:8px">${v4ic('plus', 16)}Nova estante</button>
    ${L.length ? `<div class="list v7l v7scr">${L.map((s) => { const on = (s.bookIds || []).includes(e.id); return `<button class="li" data-a="v7tog" data-id="${esc(s.id)}">${v7Chk(on)}<span class="t">${esc(s.name)}<small>${plural((s.bookIds || []).length, 'livro', 'livros')}${s.priv ? ' · só você' : ''}</small></span></button>`; }).join('')}</div>` : '<div class="v7empty">Você ainda não tem estantes. Crie a primeira.</div>'}`; }
  if (k === 'v7rec') { const F = v7Fr();
    return v7Head(e, 'Indicar a alguém') + (F.length ? `<div class="list v7l v7scr">${F.map((f, i) => `<button class="li" data-a="v7send" data-i="${i}">${v7Av(f)}<span class="t">${esc(f.displayName || f.handle)}<small>@${esc(f.handle)}</small></span><span class="r">${v4ic('send', 16)}</span></button>`).join('')}</div>`
      : `<div class="v7empty">Adicione amizades para indicar livros.</div><div class="v7foot"><button class="btn p" data-a="v7find">Encontrar leitores</button></div>`); }
  if (k === 'v7bud') { const F = v7Fr(), P = c.pick || (c.pick = []);
    return v7Head(e, 'Ler junto') + `<p class="mut" style="margin:0 0 8px">Escolha até 4 amizades. Quem aceitar aparece no seu cartão de leitura, com o progresso de cada uma.</p>` + (F.length ? `<div class="list v7l v7scr">${F.map((f, i) => `<button class="li" data-a="v7pick" data-i="${i}">${v7Av(f)}<span class="t">${esc(f.displayName || f.handle)}<small>@${esc(f.handle)}</small></span>${v7Chk(P.includes(f.handle))}</button>`).join('')}</div>
      <div class="v7foot"><button class="btn s" data-a="close">Cancelar</button><button class="btn p" data-a="v7budok" ${P.length ? '' : 'disabled style="opacity:.5"'}>Enviar convite${P.length ? ' · ' + P.length : ''}</button></div>`
      : `<div class="v7empty">Adicione amizades para ler junto.</div><div class="v7foot"><button class="btn p" data-a="v7find">Encontrar leitores</button></div>`); }
  if (k === 'v7add') { const s = (db.shelves || []).find((x) => x.id === c.sid) || {}, P = c.pick || (c.pick = [...(s.bookIds || [])]), q = normT(c.q || '');
    const L = (() => { try { return sortList(lib(), 'titulo'); } catch { return lib(); } })().filter((x) => !q || normT(x.title + ' ' + (x.author || '')).includes(q)).slice(0, 300);
    return `<h3>Adicionar livros</h3><span class="mut">${esc(s.name || '')} · ${plural(P.length, 'livro escolhido', 'livros escolhidos')}</span>
    <input class="v7q" id="v7q" type="search" placeholder="Filtrar seus livros" value="${esc(c.q || '')}">
    <div class="list v7l v7scr">${L.map((x) => `<button class="li" data-a="v7bk" data-id="${esc(x.id)}">${v4cv(x)}<span class="t">${esc(x.title)}<small>${esc(x.author || '')}</small></span>${v7Chk(P.includes(x.id))}</button>`).join('') || '<div class="v7empty">Nada com esse nome.</div>'}</div>
    <div class="v7foot"><button class="btn s" data-a="close">Cancelar</button><button class="btn p" data-a="v7addok">Salvar</button></div>`; }
  return '';
};
function v7Click(ev) {
  const b = ev.target.closest('[data-a]'); const a = b && b.dataset.a; if (!a || !a.startsWith('v7')) return;
  ev.stopPropagation();
  const st = v4State(), c = st.v7 || {}, e = c.e;
  if (a === 'v7prio') { const p = +b.dataset.p; if (p === 2) delete e.prio; else e.prio = p; try { save(); refresh(); } catch {} toast(`Prioridade ${({ 1: 'alta', 2: 'normal', 3: 'baixa' })[p]}`); v7Close(); try { v5Redraw(); } catch {} return; }
  if (a === 'v7tog') { const s = (db.shelves || []).find((x) => String(x.id) === b.dataset.id); if (!s) return; const on = (s.bookIds || []).includes(e.id);
    s.bookIds = on ? s.bookIds.filter((x) => x !== e.id) : [...(s.bookIds || []), e.id]; s.touchedAt = new Date().toISOString(); try { save(); publishSnapshotSoon(); } catch {} toast(on ? `Tirado de ${s.name}` : `Em ${s.name}`); v4Draw(); try { v5Redraw(); } catch {} return; }
  if (a === 'v7new') { v7Close(); try { return shelfEditForm(); } catch { return newEstante(); } }
  if (a === 'v7find') { v7Close(); try { return addFriendSheet(); } catch { return goTab('buscar'); } }
  if (a === 'v7send') { const f = v7Fr()[+b.dataset.i]; if (!f) return; v7Close(); try { sendRecommendation(e, f); } catch { toast('Não consegui indicar agora'); } return; }
  if (a === 'v7pick') { const f = v7Fr()[+b.dataset.i]; if (!f) return; const P = c.pick || (c.pick = []); const i = P.indexOf(f.handle); if (i >= 0) P.splice(i, 1); else if (P.length < 4) P.push(f.handle); else toast('Até 4 amizades por leitura'); return v4Draw(); }
  if (a === 'v7budok') { const P = c.pick || []; if (!P.length) return; const names = v7Fr().filter((f) => P.includes(f.handle)).map((f) => String(f.displayName || f.handle).split(' ')[0]);
    T().buddy = { ...(T().buddy || {}), [e.id]: { status: 'PENDENTE', handles: [...P], names: names.join(', '), at: new Date().toISOString() } };
    try { save(); refresh(); } catch {} try { const p = flushLocalInvites(); if (p && p.catch) p.catch(() => {}); } catch {} v7Close(); toast(`Convite enviado para ${names.join(', ')}`); return; }
  if (a === 'v7bk') { const P = c.pick || (c.pick = []), id = b.dataset.id, i = P.indexOf(id); if (i >= 0) P.splice(i, 1); else P.push(id);
    b.querySelector('.v7chk')?.classList.toggle('on', P.includes(id)); const m = b.getRootNode().querySelector('.sheet .mut'); if (m) { const s = (db.shelves || []).find((x) => x.id === c.sid) || {}; m.textContent = `${s.name || ''} · ${plural(P.length, 'livro escolhido', 'livros escolhidos')}`; } return; }
  if (a === 'v7addok') { const s = (db.shelves || []).find((x) => x.id === c.sid); if (!s) return v7Close(); s.bookIds = [...(c.pick || [])]; s.touchedAt = new Date().toISOString(); try { save(); publishSnapshotSoon(); } catch {} v7Close(); toast(`${s.name}: ${plural(s.bookIds.length, 'livro', 'livros')}`); try { c.after && c.after(); } catch {} try { v5Redraw(); } catch {} return; }
}
function v7Input(ev) { const t = ev.target; if (t && t.id === 'v7q') { const c = v7Ctx(); c.q = t.value; const pos = t.selectionStart; v4Draw(); const n = v4Root().querySelector('#v7q'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch {} } } }
// as funções antigas passam a abrir as folhas novas
prioSheet = function (e) { if (e) v7Sheet('v7prio', { e }); };
moveToShelf = function (e) { if (e) v7Sheet('v7est', { e }); };
recommendToFriend = function (book) { if (needAccount()) return; const e = book && book.id ? book : (lib().find((x) => book && normT(x.title) === normT(book.title)) || book); v7Sheet('v7rec', { e }); };
inviteBuddy = function (e) { if (needAccount() || !e) return; v7Sheet('v7bud', { e, pick: [] }); };
pickBooksFor = function (s, after) { if (!s) return; v7Sheet('v7add', { sid: s.id, after, q: '' }); };
// meta do ano: releitura marcada para não contar fica de fora
{ const _yi = yearInfo; yearInfo = function () {
    const r = _yi.apply(this, arguments); if (!r || !r.target) return r;
    const n = lib().filter((e) => e.status === 'LIDO' && e.rereading && e.rereadNoGoal && (e.finishedAt || '').startsWith(r.y)).length; if (!n) return r;
    const done = Math.max(0, r.done - n), left = Math.max(0, r.target - done);
    return { ...r, done, left, diff: (r.diff || 0) - n, pctY: Math.min(100, Math.round(done / r.target * 100)) };
  }; }
// pele do protótipo nas folhas que mantêm a lógica antiga (Prazo, Emprestar, Editar/Nova estante, listas simples)
{ const st = document.createElement('style'); st.textContent = `
#editor.compact .ed-body,.esn-sheet > .box,.esn-sheet .esn-box,.ex-sh > div{border-radius:24px 24px 0 0!important;padding-top:22px!important;position:relative}
#editor.compact .ed-body::before,.esn-sheet > .box::before{content:"";position:absolute;left:50%;top:8px;width:40px;height:4px;border-radius:9px;background:var(--line);transform:translateX(-50%)}
#editor.compact .ed-body h3,.esn-sheet h3{font-family:var(--v2-disp,Georgia,serif)!important;font-size:1.2rem!important;font-weight:700!important;margin:0 0 .6rem!important}
#editor.compact .bm-it{border-radius:14px!important;padding:.75rem .6rem!important;min-height:52px}
#editor.compact .bm-it.on{background:color-mix(in srgb,var(--acc) 12%,transparent)!important;color:var(--ink)!important}
#editor.compact input:not([type=checkbox]):not([type=radio]),#editor.compact textarea,#editor.compact select,.esn-sheet input:not([type=checkbox]):not([type=radio]),.esn-sheet textarea{border-radius:14px!important;border:1.5px solid var(--line)!important;background:color-mix(in srgb,var(--ink) 5%,var(--panel))!important;padding:.7rem .8rem!important;font:inherit!important;color:var(--ink)!important}
#editor.compact .row.end button,#editor.compact button.pri,.esn-sheet button.p,.esn-sheet .acts button{border-radius:14px!important;font-weight:900!important;padding:.75rem 1rem!important}
#editor.compact button.pri,.esn-sheet button.p{background:linear-gradient(135deg,#e9a35c,#c46f2e)!important;color:#fff!important;border:0!important}
`; TR.append(st); }
{ const st = document.createElement('style'); st.textContent = `
.sheet.due-sh .box{border-radius:24px 24px 0 0!important;padding-top:22px!important;position:relative;background:var(--panel,#fffaf2)!important;color:var(--ink,#2a2018)!important}
.sheet.due-sh .box::before{content:"";position:absolute;left:50%;top:8px;width:40px;height:4px;border-radius:9px;background:var(--line,#e8d9c6);transform:translateX(-50%)}
.sheet.due-sh h3{font-family:'Fraunces',Georgia,serif!important;font-size:1.25rem!important;font-weight:700!important}
.sheet.due-sh input[type=date]{border-radius:14px!important;border:1.5px solid var(--line,#e8d9c6)!important;padding:.7rem .8rem!important;font:inherit!important}
.sheet.due-sh .primary{border-radius:14px!important;background:linear-gradient(135deg,#e9a35c,#c46f2e)!important;color:#fff!important;border:0!important;font-weight:900!important;padding:.8rem!important}
.sheet.due-sh .cancel,.sheet.due-sh .dx{border-radius:14px!important;font-weight:800!important}
`; document.head.append(st); }
