// Ler junto pelo perfil de uma amizade (Bia, 20/11; protótipo v135, folha "ljunto").
// Antes: lista crua dos seus livros. Agora, na ordem e só o que existir:
//  1) O que você está lendo → Convidar (se a pessoa também lê, aparece "também lê · N%" e o livro não se repete abaixo);
//  2) O que a pessoa está lendo → Pedir para entrar: o livro entra no seu Lendo (se ainda não estiver) e ela recebe o convite
//     no mesmo livro; quando aceitar, a leitura conjunta começa (a API não tem "pedido para entrar": é um convite comum);
//  3) Outro livro → busca nos seus livros e no catálogo; livro novo entra no seu Quero ler e o convite vai junto.
// 20/11 (API 036, "grupo de leitura coletiva do mesmo livro"): se a pessoa já lê aquele livro em grupo (d.groups do perfil),
//  "Pedir para entrar · N pessoas lendo" manda um PEDIDO ao grupo (POST /v1/buddies/:id/join-requests); qualquer pessoa do
//  grupo aceita em Avisos, no Hoje ou na página Lendo junto. Sem grupo, continua o convite comum para a pessoa.
const ljCtx = () => v4State().v7 || {};
function ljOpen(d) {
  if (needAccount()) return;
  const first = String(d.displayName || d.handle || '').split(' ')[0] || '@' + d.handle;
  v7Sheet('v7lj', { lj: { h: d.handle, n: first, reading: (d.reading || []).slice(0, 6), groups: (d.groups || []).map((g) => ({ ...g })) }, q: '', res: null });
  ljArm();
}
function ljArm() { const R = v4Root(); if (!R || R.dataset.lj) return; R.dataset.lj = 1; R.addEventListener('click', ljClick, true); R.addEventListener('input', ljInput, true);
  try { const sr = R.getRootNode(); if (sr && !sr.querySelector('style[data-lj]')) { const st = document.createElement('style'); st.dataset.lj = 1; st.textContent = LJCSS; sr.append(st); } } catch {} }
const LJCSS = `.v4ler .ljact{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:900;color:var(--acc);background:color-mix(in srgb,var(--acc) 14%,transparent);border-radius:99px;padding:6px 11px;white-space:nowrap;flex:none}
.v4ler .ljact svg{width:15px;height:15px;flex:none}.v4ler .v7l .li .t small{white-space:normal}
.v4ler .ljsrch{display:flex;align-items:center;gap:10px;border:1.5px solid var(--line);background:var(--soft);border-radius:99px;padding:9px 14px;margin:6px 0 4px}
.v4ler .ljsrch svg{width:18px;height:18px;flex:none;color:var(--ink-2)}.v4ler .ljsrch input{flex:1;min-width:0;font:inherit;font-weight:700;border:0;background:transparent;color:var(--ink)}.v4ler .ljsrch input:focus{outline:none}
.v4ler .ljmut{font-size:12.5px;color:var(--ink-2);padding:8px 4px}`;
const ljMine = (t) => lib().find((x) => normT(x.title) === normT(t || ''));
{ const _sh = v4SheetHTML; v4SheetHTML = function (k) {
    if (k !== 'v7lj') return _sh.apply(this, arguments);
    const c = ljCtx(), P = c.lj || {}, n = esc(P.n || '');
    const meus = lib().filter((x) => x.status === 'LENDO');
    const dela = (P.reading || []).filter((b) => !meus.some((m) => normT(m.title) === normT(b.title)));
    const tb = (x) => (P.reading || []).find((b) => normT(b.title) === normT(x.title));
    const row = (x, sm, act, a, extra) => `<button class="li" data-a="${a}" ${extra || ''}>${v4cv(x)}<span class="t">${esc(x.title || '')}<small>${sm}</small></span><span class="ljact">${act}</span></button>`;
    const pg = (x) => { try { const i = readingInfo(x); return i.total ? 'você na pág. ' + i.now : 'você em ' + Math.round(i.pct || 0) + '%'; } catch { return 'você está lendo'; } };
    const q = String(c.q || '').trim(), nq = normT(q);
    const locais = nq ? lib().filter((x) => normT(x.title + ' ' + (x.author || '')).includes(nq)).slice(0, 4) : [];
    const cat = nq && Array.isArray(c.res) ? c.res.filter((it) => !ljMine(it.title)).slice(0, 5) : [];
    // livro que a pessoa lê em grupo: pedido ao grupo (ou o estado do seu pedido)
    const grp = (t) => (P.groups || []).find((g) => normT(g.title || '') === normT(t || ''));
    const gRow = (x, sm, g) => { const gi = (P.groups || []).indexOf(g), ppl = g.members + (g.members === 1 ? ' pessoa lendo' : ' pessoas lendo');
      if (g.me === 'member') return row(x, sm, v4ic('friends', 15) + 'Vocês já leem juntas', 'ljopen', `data-g="${gi}"`);
      if (g.me === 'invited') return row(x, sm, v4ic('ok', 15) + 'Você tem convite', 'ljinv', `data-g="${gi}"`);
      if (g.me === 'asked') return row(x, sm + ' · ' + ppl, v4ic('ok', 15) + 'Pedido enviado', 'ljcancel', `data-g="${gi}"`);
      if (g.full) return row(x, sm + ' · grupo cheio', 'Grupo cheio', 'ljfull', `data-g="${gi}"`);
      return row(x, sm + ' · grupo com ' + g.members + (g.members === 1 ? ' pessoa' : ' pessoas'), v4ic('plus', 15) + 'Pedir para entrar', 'ljjoin', `data-g="${gi}" data-i="${(P.reading || []).findIndex((b) => normT(b.title) === normT(x.title))}"`); };
    return `<h3>Ler junto com ${n}</h3><p class="mut" style="margin:0 0 4px">Vocês veem a página uma da outra e conversam sem spoiler.</p>
    ${meus.length ? `<div class="lbl">O que você está lendo</div><div class="list v7l">${meus.map((x) => { const o = tb(x), g = grp(x.title), sm = pg(x) + (o ? ' · ' + n + ' também lê, ' + Math.round(Number(o.pct) || 0) + '%' : ''); return g ? gRow(x, sm, g) : row(x, sm, v4ic('send', 15) + 'Convidar', 'ljme', `data-id="${esc(x.id)}"`); }).join('')}</div>` : ''}
    ${dela.length ? `<div class="lbl">O que ${n} está lendo</div><div class="list v7l">${dela.map((b, i) => { const g = grp(b.title), sm = n + ' em ' + Math.round(Number(b.pct) || 0) + '%'; return g ? gRow(b, sm, g) : row(b, sm, v4ic('plus', 15) + 'Pedir para entrar', 'ljher', `data-i="${(P.reading || []).indexOf(b)}"`); }).join('')}</div>` : ''}
    <div class="lbl">Outro livro</div><label class="ljsrch">${v4ic('busca', 18)}<input id="ljq" type="search" placeholder="Título ou autor" value="${esc(q)}" autocomplete="off"></label>
    ${nq ? `<div class="list v7l">${locais.map((x) => row(x, esc(x.author || ''), v4ic('send', 15) + 'Convidar', 'ljme', `data-id="${esc(x.id)}"`)).join('')}${cat.map((it, i) => row({ title: it.title, cover: it.coverUrl }, esc(it.author || '') + ' · entra no seu Quero ler', v4ic('send', 15) + 'Convidar', 'ljcat', `data-i="${c.res.indexOf(it)}"`)).join('')}
      ${c.res === null ? '<div class="ljmut">Buscando no catálogo…</div>' : !locais.length && !cat.length ? '<div class="ljmut">Nada com esse nome.</div>' : ''}</div>` : ''}`;
  }; }
function ljSend(e, okMsg) {
  const P = ljCtx().lj || {}; if (!e || !P.h) return;
  T().buddy = { ...(T().buddy || {}), [e.id]: { status: 'PENDENTE', handles: [P.h], names: P.n, at: new Date().toISOString() } };
  try { save(); refresh(); } catch {} try { const p = flushLocalInvites(); if (p && p.catch) p.catch(() => {}); } catch {}
  v7Close(); toast(okMsg || 'Convite enviado para ' + P.n);
}
function ljAdd(item, status) { // põe o livro na estante e devolve a entrada
  let e = ljMine(item.title); if (e) return e;
  try { addToLibrary({ title: item.title, author: item.author || null, totalPages: item.pages || item.totalPages || null, cover: item.coverUrl || item.cover || null, isbn: item.isbn || null }, null, status); } catch {}
  return ljMine(item.title);
}
function ljClick(ev) {
  const b = ev.target.closest('[data-a]'); const a = b && b.dataset.a; if (!a || !a.startsWith('lj')) return;
  ev.stopPropagation(); const c = ljCtx(), P = c.lj || {};
  if (a === 'ljme') return ljSend(lib().find((x) => x.id === b.dataset.id));
  if (a === 'ljher') { const r = (P.reading || [])[+b.dataset.i]; if (!r) return; const had = ljMine(r.title); const e = ljAdd(r, 'LENDO');
    if (!e) return toast('Não consegui colocar o livro na sua estante'); return ljSend(e, (had ? '' : 'O livro entrou no seu Lendo. ') + 'Quando ' + P.n + ' aceitar, a leitura conjunta começa'); }
  const g = b.dataset.g != null ? (P.groups || [])[+b.dataset.g] : null;
  if (a === 'ljjoin' && g) { if (b.dataset.busy) return; b.dataset.busy = 1;
    (async () => {
      let r = null; try { r = await sapi('POST', `/v1/buddies/${g.id}/join-requests`); } catch {}
      delete b.dataset.busy;
      if (!r) return toast('Não consegui enviar agora. Tente de novo em instantes.');
      if (r.status === 200 || r.status === 201) {
        const src = (P.reading || [])[+b.dataset.i] || { title: g.title }; const had = ljMine(g.title); ljAdd(src, 'LENDO');
        g.me = 'asked'; v4Draw(); try { syncSocial3(true); } catch {}
        return toast((had ? '' : 'O livro entrou no seu Lendo. ') + 'Pedido enviado. Quando alguém do grupo aceitar, você entra.'); }
      const er = r.data && r.data.error;
      if (er === 'FULL') { g.full = true; v4Draw(); return toast('Este grupo já está cheio'); }
      if (er === 'ALREADY_MEMBER') { g.me = 'member'; v4Draw(); return toast('Você já está nesta leitura'); }
      if (er === 'ALREADY_INVITED') { g.me = 'invited'; v4Draw(); return toast('Você já tem um convite: aceite em Avisos'); }
      if (r.status === 404) { const src = (P.reading || [])[+b.dataset.i] || { title: g.title }; const e = ljAdd(src, 'LENDO'); return ljSend(e, 'Quando ' + P.n + ' aceitar, a leitura conjunta começa'); }
      toast('Não consegui enviar agora. Tente de novo em instantes.');
    })(); return; }
  if (a === 'ljcancel' && g) { (async () => { let r = null; try { r = await sapi('DELETE', `/v1/buddies/${g.id}/join-requests`); } catch {}
    if (!r || r.status >= 300) return toast('Não consegui cancelar agora'); g.me = null; v4Draw(); toast('Pedido cancelado'); })(); return; }
  if (a === 'ljfull') return toast('Este grupo já está com 12 pessoas');
  if (a === 'ljinv') { v7Close(); try { closeEd(); } catch {} return toast('O convite está no Hoje e em Avisos: toque em Aceitar'); }
  if (a === 'ljopen' && g) { const e = ljMine(g.title); v7Close(); if (e) { try { return openBuddyPage(e); } catch {} } return toast('Abra o livro no Hoje para ver a leitura conjunta'); }
  if (a === 'ljcat') { const it = (c.res || [])[+b.dataset.i]; if (!it) return; const e = ljAdd(it, 'QUERO'); if (!e) return toast('Não consegui colocar o livro na sua estante'); return ljSend(e, 'Convite enviado para ' + P.n + ' · o livro está no seu Quero ler'); }
}
let ljT = 0;
function ljInput(ev) { const t = ev.target; if (!t || t.id !== 'ljq') return; const c = ljCtx(); c.q = t.value; c.res = null; const pos = t.selectionStart;
  const redraw = () => { v4Draw(); const n = v4Root().querySelector('#ljq'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch {} } };
  redraw(); clearTimeout(ljT); const q = c.q.trim(); if (q.length < 2) { c.res = []; return; }
  ljT = setTimeout(async () => { let L = []; try { L = await searchBooks(q); } catch {} const c2 = ljCtx(); if (c2.q.trim() !== q || v4State().sheet !== 'v7lj') return; c2.res = (L || []).filter((x) => x && x.title); const n = v4Root().querySelector('#ljq'), p2 = n ? n.selectionStart : q.length; v4Draw(); const m = v4Root().querySelector('#ljq'); if (m) { m.focus(); try { m.setSelectionRange(p2, p2); } catch {} } }, 450);
}
