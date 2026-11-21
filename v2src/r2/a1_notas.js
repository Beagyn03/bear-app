// Notas: o caderno particular de cada livro (Bia, 18/11). A antiga "anotação" (uma só, até 200 letras) vira várias notas,
// cada uma com página e data, em e.notes = [{ id, t, p, at }]. e.note continua com a nota mais recente (para as telas antigas).
// Escreve-se no diário (botão Nota); cada nota entra no Histórico com 🔒; "Meus trechos" vira "Trechos e anotações", com a aba Notas.
function notesOf(e) { return (e && e.notes) || []; }
// migração: a anotação que já existia vira a primeira nota do livro
{ let ch = false; try { lib().forEach((e) => { if (e.note && !Array.isArray(e.notes)) { e.notes = [{ id: uid(), t: String(e.note), p: null, at: String(e.statusAt || e.startedAt || e.addedAt || todayISO()).slice(0, 10) }]; ch = true; } }); } catch {} if (ch) save(); }
function addNote(e, t, p) {
  t = String(t || '').trim(); if (!t) return false;
  e.notes = [...notesOf(e), { id: uid(), t: t.slice(0, 2000), p: Number(p) > 0 ? Math.round(Number(p)) : null, at: new Date().toISOString() }].slice(-300);
  e.note = e.notes[e.notes.length - 1].t; save(); return true;
}
// diário: o botão Anotação vira Nota, com página e "Salvar nota" (e também salva junto ao tocar em Salvar)
{ const ed = $('#editor'); let tm = 0;
  const fix = () => {
    const acts = ed.querySelector('.lz-acts'); if (ed.hidden || !acts) return;
    const b = acts.querySelector('[data-p=nota]'); if (!b || b.dataset.nt) return; b.dataset.nt = '1';
    const e = S.tlE || ((() => { try { return reading().e; } catch { return null; } })()); if (!e) return;
    const n = notesOf(e).length; b.innerHTML = '<span><i class=v3e data-i=lock></i></span>Anotação<small>' + (n ? n + (n > 1 ? ' anotações' : ' anotação') : 'só você vê') + '</small>';
    const pane = [...ed.querySelectorAll('.lz-pane')].find((p) => p.querySelector('textarea[placeholder*="anotação"], textarea[placeholder*="nota"]')); if (!pane) return;
    const rng = ed.querySelector('#up-r'), pg = (rng && rng.value) || '';
    pane.innerHTML = '<textarea maxlength="2000" placeholder="Uma anotação só sua sobre esta parte do livro"></textarea><div class="lz-row"><label>pág. <input type="number" min="1" class="lz-pg" value="' + esc(String(pg)) + '"></label><button type="button" class="lz-ok">Salvar anotação</button></div>';
    const ta = pane.querySelector('textarea'), pgi = pane.querySelector('.lz-pg');
    const doSave = () => { if (!addNote(e, ta.value, pgi.value)) return false; ta.value = ''; const k = notesOf(e).length; b.querySelector('small').textContent = k + (k > 1 ? ' anotações' : ' anotação'); toast('Anotação salva'); try { ed.querySelector('.tl')?.remove(); TL_PAINT(); } catch {} return true; };
    pane.querySelector('.lz-ok').addEventListener('click', () => { if (!doSave()) toast('Escreva a anotação'); });
    // tocar em Salvar/Terminei com a nota escrita também guarda a nota
    ed.querySelectorAll('#up-save, #up-fin').forEach((x) => x.addEventListener('click', () => { if (ta.value.trim()) doSave(); }, true));
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(fix, 30); }).observe(ed, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// "Trechos e anotações": abas Trechos | Notas na tela que era "Meus trechos"
{ const st = document.createElement('style'); st.textContent = `
.qn-seg{display:grid;grid-template-columns:1fr 1fr;gap:.25rem;background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:.2rem;margin:.1rem 0 .7rem}
.qn-seg button{border:0;background:none;border-radius:999px;height:36px;font:inherit;font-weight:800;font-size:.88rem;color:var(--ink-2)}
.qn-seg button.on{background:var(--acc);color:var(--on-acc,#fff)}
#shelflist.qn-notas .sl-body > :not(.sl-top):not(.qn-seg):not(.qn-notes){display:none!important}
.qn-notes{display:grid;gap:.6rem}
.qn-it{display:grid;grid-template-columns:42px minmax(0,1fr);gap:.65rem;align-items:start;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.6rem .7rem;text-align:left;font:inherit;color:var(--ink);cursor:pointer}
.qn-it .cv{width:42px!important;height:63px!important;border-radius:4px!important;background-size:cover!important;font-size:.36rem!important}
.qt-it.qt-cv{display:grid!important;grid-template-columns:42px minmax(0,1fr);gap:.65rem;align-items:start;text-align:left}.qt-it.qt-cv > .cv{width:42px!important;height:63px!important;border-radius:4px!important;background-size:cover!important;background-position:center!important;font-size:.36rem!important}.qt-it.qt-cv > span{min-width:0;display:block}.qt-it.qt-cv q{display:block;font-style:italic;font-size:.9rem;line-height:1.4}.qt-it.qt-cv small{display:block;margin-top:.3rem;font-size:.72rem;font-weight:800;color:var(--ink-2)}
.qn-it p{margin:0;font-size:.9rem;line-height:1.4;white-space:pre-line}.qn-it small{display:block;margin-top:.3rem;font-size:.72rem;font-weight:800;color:var(--ink-2)}
`; TR.append(st); }
{ const _oq = openAllQuotes; openAllQuotes = function (tab) {
    const r = _oq.apply(this, arguments); S.qnTab = tab === 'notas' ? 'notas' : (S.qnTab || 'trechos'); qnPaint(); return r; }; }
function qnPaint() {
  const v = $('#shelflist'); if (!v || v.hidden) return; const body = v.querySelector('.sl-body'), top = body && body.querySelector('.sl-top'); if (!top) return;
  const tb = top.querySelector('b'); if (!tb || !/trechos/i.test(tb.textContent)) return;
  tb.textContent = 'Trechos e anotações'; try { syncTopTitle(); } catch {}
  let seg = body.querySelector('.qn-seg'); if (!seg) { seg = document.createElement('div'); seg.className = 'qn-seg'; top.after(seg); }
  const nT = lib().reduce((a, e) => a + (e.quotes || []).length, 0), nN = lib().reduce((a, e) => a + notesOf(e).length, 0);
  seg.innerHTML = '<button type="button" data-t="trechos" class="' + (S.qnTab !== 'notas' ? 'on' : '') + '">Trechos' + (nT ? ' · ' + nT : '') + '</button><button type="button" data-t="notas" class="' + (S.qnTab === 'notas' ? 'on' : '') + '">Anotações' + (nN ? ' · ' + nN : '') + '</button>';
  seg.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { S.qnTab = b.dataset.t; qnPaint(); }));
  v.classList.toggle('qn-notas', S.qnTab === 'notas');
  body.querySelector('.qn-notes')?.remove();
  if (S.qnTab !== 'notas') return;
  const all = lib().flatMap((e) => notesOf(e).map((x) => ({ e, x }))).sort((a, b) => String(b.x.at || '').localeCompare(String(a.x.at || '')));
  const box = document.createElement('div'); box.className = 'qn-notes';
  const grp = []; all.forEach((r) => { let g = grp.find((y) => y.e === r.e); if (!g) { g = { e: r.e, its: [] }; grp.push(g); } g.its.push(r.x); });
  box.innerHTML = all.length ? grp.map((g) => '<div class="qt-g"><button type="button" class="qt-gh qn-gh" data-book="' + esc(g.e.id) + '">' + cvh(g.e.title, g.e.cover, '') + '<span><b>' + esc(g.e.title) + '</b><small>' + esc(g.e.author || '') + (g.e.author ? ' · ' : '') + g.its.length + (g.its.length > 1 ? ' anotações' : ' anotação') + '</small></span></button>' + g.its.map((x) => '<button type="button" class="qn-it qn-in" data-id="' + esc(g.e.id) + '" data-nid="' + esc(x.id || '') + '"><p>' + esc(x.t) + '</p><small><i class=v3e data-i=lock></i>' + (x.p ? 'pág. ' + x.p : 'sem página') + (x.at ? ' · ' + String(x.at).slice(8, 10) + '/' + String(x.at).slice(5, 7) : '') + '</small></button>').join('') + '</div>').join('')
    : '<p class="sl-empty">Suas anotações aparecem aqui. Escreva no Diário de leitura, no botão Anotação: só você vê.</p>';
  seg.after(box); try { paintCv(box); } catch {}
  box.querySelectorAll('.qn-gh').forEach((b) => b.addEventListener('click', () => { const e = byId(b.dataset.book); if (e) openBookPage(e); }));
}
// menu lateral e atalho da Biblioteca com o nome novo
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => {
    TR.querySelectorAll('.drw [data-go="quotes"], .drw [data-go2="quotes"]').forEach((b) => { if (b.dataset.qn) return; b.dataset.qn = '1'; [...b.childNodes].forEach((c) => { if (c.nodeType === 3 && /trechos/i.test(c.textContent)) c.textContent = 'Trechos e anotações'; }); });
    TR.querySelectorAll('.es-sc [data-a=q] b').forEach((b) => { if (b.textContent !== 'Trechos e anotações') { b.textContent = 'Trechos e anotações'; const n = lib().reduce((a, e) => a + (e.quotes || []).length + notesOf(e).length, 0), s = b.nextElementSibling; if (s) s.textContent = n ? n + ' guardados' : 'frases e notas dos livros'; } });
    const v = $('#shelflist'); if (v && !v.hidden && v.querySelector('.qt-list') && !v.querySelector('.qn-seg')) qnPaint();
    if (v && (v.hidden || !v.querySelector('.qt-list, .qn-notes'))) v.classList.remove('qn-notas');
  }, 60); }).observe(TR, { childList: true, subtree: true }); }
// ••• visível em cada trecho e em cada nota (Bia, 18/11): o trecho já abria Editar/Apagar ao tocar; a nota ganha o mesmo
{ const st = document.createElement('style'); st.textContent = '.qt-it,.qn-it{position:relative;padding-right:2.4rem!important}.qt-it::after,.qn-it::after{content:"•••";position:absolute;top:.5rem;right:.7rem;font-weight:900;letter-spacing:1px;color:var(--ink-2);font-size:.85rem;font-style:normal}'
    + '.nt-sh textarea{width:100%;box-sizing:border-box;min-height:7rem;border-radius:12px;border:1px solid var(--line,#e8d9c6);padding:.6rem .7rem;font:inherit;font-size:.95rem;resize:vertical}.nt-sh label{display:flex;align-items:center;gap:.5rem;margin:.5rem 0;font-size:.85rem;font-weight:700}.nt-sh label input{width:6rem;border-radius:10px;border:1px solid var(--line,#e8d9c6);padding:.35rem .5rem;font:inherit}';
  document.head.append(st); TR.append(st.cloneNode(true)); }
function editNoteSheet(e, x, after) {
  const w = document.createElement('div'); w.className = 'sheet nt-sh';
  w.innerHTML = '<div class="box"><form class="form"><h3>Editar anotação</h3><textarea maxlength="2000"></textarea><label>Página <input type="number" min="1" inputmode="numeric"></label><button type="submit" class="primary">Salvar</button><button type="button" class="cancel">Cancelar</button></form></div>';
  const f = w.querySelector('form'), ta = f.querySelector('textarea'), pg = f.querySelector('input'); ta.value = x.t || ''; pg.value = x.p || '';
  const close = () => w.remove(); w.addEventListener('click', (ev) => { if (ev.target === w) close(); }); f.querySelector('.cancel').addEventListener('click', close);
  f.addEventListener('submit', (ev) => { ev.preventDefault(); const t = ta.value.trim(); if (!t) return toast('Escreva a anotação'); x.t = t; const p = Number(pg.value) || 0; if (p > 0) x.p = Math.round(p); else delete x.p;
    const L = notesOf(e); if (L.length) e.note = L[L.length - 1].t; save(); close(); toast('Anotação salva'); after && after(); });
  document.body.append(w); setTimeout(() => ta.focus(), 50);
}
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('.qn-it'); if (!b || S.qnSelOn) return; ev.stopImmediatePropagation(); ev.preventDefault();
  const e = byId(b.dataset.id); if (!e) return; const k = [...b.parentElement.querySelectorAll('.qn-it')].filter((y) => y.dataset.id === b.dataset.id).indexOf(b);
  const mine = lib().flatMap((ee) => notesOf(ee).map((x) => ({ e: ee, x }))).sort((a, c) => String(c.x.at || '').localeCompare(String(a.x.at || ''))).filter((y) => y.e.id === e.id)[k]; if (!mine) return;
  const x = mine.x, redo = () => qnPaint();
  popMenu(b, [
    { label: 'Editar', fn: () => editNoteSheet(e, x, redo) },
    { label: 'Copiar', fn: () => { try { navigator.clipboard.writeText(x.t); toast('Anotação copiada'); } catch { toast('Não consegui copiar'); } } },
    { label: 'Ver o livro', fn: () => openBookPage(e) },
    0,
    { label: 'Apagar anotação', danger: true, fn: () => sheetList('Apagar esta anotação?', [{ label: 'Apagar', danger: true, fn: () => { e.notes = notesOf(e).filter((y) => y !== x); const L = e.notes; if (L.length) e.note = L[L.length - 1].t; else delete e.note; save(); toast('Anotação apagada'); redo(); } }]) },
  ]);
}, true);

{ const st = document.createElement('style'); st.textContent = '.qt-list,.qn-notes{display:grid;gap:.7rem}'
  + '.qt-g{border:1px solid var(--line);background:var(--panel);border-radius:16px;overflow:hidden}'
  + '.qt-gh{display:grid;grid-template-columns:42px minmax(0,1fr);gap:.65rem;align-items:center;width:100%;border:0;background:color-mix(in srgb,var(--acc) 6%,transparent);padding:.6rem .7rem;text-align:left;font:inherit;color:var(--ink);cursor:pointer}'
  + '.qt-gh .cv{width:42px!important;height:63px!important;border-radius:4px!important;background-size:cover!important;background-position:center!important;font-size:.36rem!important}'
  + '.qt-gh b{display:block;font-size:.92rem;line-height:1.25}.qt-gh small{display:block;margin-top:.15rem;font-size:.74rem;font-weight:700;color:var(--ink-2)}'
  + '.qt-g .qt-in,.qt-g .qn-in{display:block!important;width:100%;border:0!important;border-top:1px solid var(--line)!important;border-radius:0!important;background:none!important;padding:.6rem 2.4rem .6rem .8rem!important;text-align:left;margin:0!important;box-shadow:none!important}'
  + '.qt-g .qt-in q{display:block;font-style:italic;font-size:.9rem;line-height:1.4}.qt-g .qn-in p{margin:0;font-size:.9rem;line-height:1.4;white-space:pre-line}'
  + '.qt-g .qt-in small,.qt-g .qn-in small{display:block;margin-top:.25rem;font-size:.72rem;font-weight:800;color:var(--ink-2)}'
  + '.qt-g .qt-in::after,.qt-g .qn-in::after{top:.55rem!important}';
  TR.append(st); }

// seleção em massa (trechos e notas): "Selecionar" ao lado das abas; marca os itens e apaga de uma vez
{ const st = document.createElement('style'); st.textContent = '#shelflist.qn-notas.qn-notas .sl-body.sl-body > .qn-selb.qn-selb{display:flex!important}.qn-selb{display:flex;justify-content:flex-end;margin:.1rem 0 .5rem}.qn-selb button{border:0;outline:0;background:none;font:inherit;font-weight:800;font-size:.82rem;color:var(--acc);cursor:pointer;padding:.2rem 0}'
  + '#shelflist.qn-sel .qt-in,#shelflist.qn-sel .qn-in{padding-left:2.5rem!important;position:relative}#shelflist.qn-sel .qt-in::after,#shelflist.qn-sel .qn-in::after{content:""!important}'
  + '#shelflist.qn-sel .qt-in::before,#shelflist.qn-sel .qn-in::before{content:"";position:absolute;left:.8rem;top:50%;width:20px;height:20px;margin-top:-10px;border-radius:50%;border:2px solid var(--line);background:var(--panel);box-sizing:border-box}'
  + '#shelflist.qn-sel .qt-in.sel::before,#shelflist.qn-sel .qn-in.sel::before{border-color:var(--acc);background:var(--acc);box-shadow:inset 0 0 0 3px var(--panel)}'
  + '.qn-bar{position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:50;display:flex;align-items:center;gap:.6rem;max-width:620px;margin:0 auto;padding:.6rem .7rem .6rem 1rem;border-radius:16px;background:var(--ink);color:var(--bg);box-shadow:0 8px 24px rgba(0,0,0,.3);font-weight:800;font-size:.88rem}'
  + '.qn-bar span{flex:1}.qn-bar button{border:0;border-radius:99px;font:inherit;font-weight:900;font-size:.84rem;padding:.5rem .9rem;cursor:pointer}.qn-bar .qn-x{background:none;color:var(--bg);opacity:.8}.qn-bar .qn-del{background:#c0392b;color:#fff}.qn-bar .qn-del:disabled{opacity:.45}';
  TR.append(st); }
S.qnSelOn = false; S.qnSel = new Set();
function qnSelKey(b) { return b.classList.contains('qt-in') ? 'q:' + b.dataset.bid + ':' + b.dataset.qi : 'n:' + b.dataset.id + ':' + b.dataset.nid; }
function qnSelPaint() {
  const v = $('#shelflist'); if (!v) return; const body = v.querySelector('.sl-body'); if (!body || !body.querySelector('.qn-seg')) { S.qnSelOn = false; v.classList.remove('qn-sel'); TR.querySelector('.qn-bar')?.remove(); return; }
  let sb = body.querySelector('.qn-selb'); if (!sb) { sb = document.createElement('div'); sb.className = 'qn-selb'; sb.innerHTML = '<button type="button">Selecionar</button>'; 
    sb.querySelector('button').addEventListener('click', () => { S.qnSelOn = !S.qnSelOn; S.qnSel.clear(); qnSelPaint(); }); }
  // depois da busca (Trechos) ou logo acima da lista (Notas)
  { const notas = v.classList.contains('qn-notas'), nl = body.querySelector(':scope > .qn-notes'), qb = body.querySelector('.qt-bar');
    if (notas && nl) { if (sb.nextElementSibling !== nl) nl.before(sb); } else if (qb) { if (qb.nextElementSibling !== sb) qb.after(sb); } else if (sb.parentElement !== body) body.querySelector('.qn-seg').after(sb); }
  { const t = S.qnSelOn ? 'Cancelar seleção' : 'Selecionar', bt = sb.querySelector('button'); if (bt.textContent !== t) bt.textContent = t; }
  v.classList.toggle('qn-sel', S.qnSelOn);
  body.querySelectorAll('.qt-in, .qn-in').forEach((b) => b.classList.toggle('sel', S.qnSel.has(qnSelKey(b))));
  let bar = TR.querySelector('.qn-bar');
  if (!S.qnSelOn) { bar?.remove(); return; }
  if (!bar) { bar = document.createElement('div'); bar.className = 'qn-bar'; bar.innerHTML = '<span></span><button type="button" class="qn-x">Cancelar</button><button type="button" class="qn-del">Apagar</button>'; TR.append(bar);
    bar.querySelector('.qn-x').addEventListener('click', () => { S.qnSelOn = false; S.qnSel.clear(); qnSelPaint(); });
    bar.querySelector('.qn-del').addEventListener('click', () => { const N = S.qnSel.size; if (!N) return;
      sheetList('Apagar ' + N + (N > 1 ? ' itens?' : ' item?'), [{ label: 'Apagar', danger: true, fn: () => {
        const qs = new Map(), ns = new Map();
        S.qnSel.forEach((k) => { const [t, bid, x] = k.split(':'); const M = t === 'q' ? qs : ns; if (!M.has(bid)) M.set(bid, []); M.get(bid).push(x); });
        qs.forEach((idx, bid) => { const e = byId(bid); if (!e || !e.quotes) return; idx.map(Number).sort((a, b) => b - a).forEach((i) => e.quotes.splice(i, 1)); });
        ns.forEach((ids, bid) => { const e = byId(bid); if (!e) return; e.notes = notesOf(e).filter((y) => !ids.includes(String(y.id || ''))); const L = e.notes; if (L.length) e.note = L[L.length - 1].t; else delete e.note; });
        save(); toast(N + (N > 1 ? ' itens apagados' : ' item apagado')); S.qnSelOn = false; S.qnSel.clear();
        const tab = S.qnTab; try { openAllQuotes(tab === 'notas' ? 'notas' : undefined); } catch {} } }]); }); }
  const N = S.qnSel.size; { const t = N ? N + (N > 1 ? ' selecionados' : ' selecionado') : 'Toque nos itens para escolher', sp = bar.querySelector('span'); if (sp.textContent !== t) sp.textContent = t; } bar.querySelector('.qn-del').disabled = !N;
}
TR.addEventListener('click', (ev) => { if (!S.qnSelOn) return; const b = ev.target.closest && ev.target.closest('.qt-in, .qn-in'); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  const k = qnSelKey(b); if (S.qnSel.has(k)) S.qnSel.delete(k); else S.qnSel.add(k); qnSelPaint(); }, true);
{ let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; qnSelPaint(); }, 60); }).observe(TR, { childList: true, subtree: true }); }
// Voltar na mesma linha das abas (Bia, 18/11): Trechos e anotações e Histórico de leituras
{ const st = document.createElement('style'); st.textContent = '#shelflist .sl-body:has(> .qn-seg) > .sl-top,#shelflist .sl-body:has(> .hl-seg) > .sl-top{display:block!important;width:44px!important;height:44px!important;margin:0 0 -44px 0!important;padding:0!important;min-height:0!important;position:relative;z-index:2}'
  + '#shelflist .sl-body:has(> .qn-seg) > .sl-top > :not(.sl-back),#shelflist .sl-body:has(> .hl-seg) > .sl-top > :not(.sl-back){display:none!important}'
  + '#shelflist .sl-body > .qn-seg,#shelflist .sl-body > .hl-seg{margin-left:54px!important;margin-top:0!important;min-height:44px;box-sizing:border-box;align-items:center}';
  TR.append(st); }
