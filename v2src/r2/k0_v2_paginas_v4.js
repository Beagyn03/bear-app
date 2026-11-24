// Etapa 8 do alinhamento com o protótipo (Bia, 20/11; protótipo v3 v131): páginas internas.
//  - Empréstimos vira página própria (abas Emprestei · Peguei), aberta pelo atalho de Minha leitura;
//  - Completar histórico no desenho do protótipo (abas Sem fim · Sem início · Sem pág. · Sem nota, um campo por livro);
//  - Funções do app como página, com a lista do protótipo (Empréstimos e Presentes separados, sem Conquistas);
//  - Ajustes nos grupos do protótipo (Seu perfil · Seu app · Conta e dados · Ajuda), Moderação para quem modera,
//    Sair e Excluir conta no fim; "Trechos e anotações" abre a aba Trechos da Biblioteca;
//  - páginas internas com o Voltar no topo, ao lado do título (como no protótipo), sem a linha de voltar repetida.
Object.assign(V3EMO, { x: '<path d="M6 6l12 12M18 6 6 18"/>', sino: '<path d="M6 10a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4S6 15 6 10zM10 20a2.2 2.2 0 0 0 4 0"/>', plus: '<path d="M12 5v14M5 12h14"/>' });
{ const st = document.createElement('style'); st.textContent = `
.v4pg-intro{font-size:.82rem;color:var(--ink-2);line-height:1.45;margin:.1rem 0 .8rem}
.v4pg-foot{font-size:.74rem;color:var(--ink-2);margin:.7rem .1rem 0;line-height:1.4}
.v4ln-h{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin:.2rem .1rem .6rem;font-size:.8rem;font-weight:800;color:var(--ink-2)}
.v4hadd{flex:none;min-height:44px;padding:0 1rem;border-radius:999px;border:1.5px solid color-mix(in srgb,var(--acc) 55%,var(--line));background:none;color:var(--acc);font:inherit;font-size:.86rem;font-weight:900;cursor:pointer}
.v4ln-empty{display:grid;gap:.6rem;justify-items:center;text-align:center;border:1px dashed var(--line);border-radius:16px;padding:1.1rem 1rem}
.v4ln-empty p{margin:0;font-size:.86rem;color:var(--ink-2)}.v4ln-empty small{font-size:.74rem;color:var(--ink-2)}.v4ln-empty .v4btn-w{margin:0;width:100%}
.v4lnpk .box{max-height:86vh;display:flex;flex-direction:column}
.v4lnpk .pk-q{margin:0 0 .5rem}.v4lnpk .pk-list{overflow-y:auto;min-height:0;flex:1;margin:0 -.2rem;padding:0 .2rem}
.v4lnpk h4{margin:.7rem 0 .3rem;font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2)}
.v4lnpk .pk-note{margin:0 0 .3rem;font-size:.74rem;color:var(--ink-2)}.v4lnpk .pk-empty{font-size:.86rem;color:var(--ink-2);text-align:center;margin:1rem 0}
.v4lnpk .pk{display:flex;align-items:center;gap:.7rem;width:100%;min-height:56px;padding:.4rem .3rem;border:0;border-bottom:1px solid var(--line);background:none;color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.v4lnpk .pk .cv{width:34px!important;height:50px!important;flex:none;border-radius:3px 5px 5px 3px!important;font-size:.36rem!important}
.v4lnpk .pk span{display:grid;min-width:0}.v4lnpk .pk b{font-size:.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v4lnpk .pk small{font-size:.76rem;color:var(--ink-2)}
.v4seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;padding:4px;border-radius:14px;background:var(--panel);border:1px solid var(--line);margin:.2rem 0 .8rem}
.v4seg button{border:0;background:none;border-radius:10px;padding:.5rem .2rem;font:inherit;font-size:.78rem;font-weight:800;color:var(--ink-2);line-height:1.15;cursor:pointer}
.v4seg button small{display:inline;margin-left:.15rem;font-size:.72rem;font-weight:800;opacity:.85}
.v4seg{grid-auto-columns:auto!important}.v4seg button{white-space:nowrap;padding-left:.35rem!important;padding-right:.35rem!important}
.v4seg button.on{background:var(--bg);color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.v4btn-w{display:flex;align-items:center;justify-content:center;gap:.4rem;width:100%;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:14px;padding:.75rem;font:inherit;font-weight:800;font-size:.86rem;cursor:pointer;margin-bottom:.8rem}
.v4fx{display:grid;grid-template-columns:40px minmax(0,1fr);gap:.7rem;align-items:start;padding:.65rem 0;border-top:1px solid var(--line)}
.v4fx:first-child{border-top:0}
.v4fx .cv{width:40px!important;height:60px!important;border-radius:3px 5px 5px 3px!important;font-size:0!important}
.v4fx b{display:block;font-size:.9rem;line-height:1.25}.v4fx small{display:block;font-size:.74rem;color:var(--ink-2);margin-top:.05rem}
.v4fx .fld{display:flex;gap:.4rem;align-items:center;margin-top:.45rem}
.v4fx input{flex:1;min-width:0;height:38px;border-radius:10px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);font:inherit;font-weight:700;font-size:.84rem;padding:0 .6rem;box-sizing:border-box}
.v4fx .chip{flex:none;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.4rem .7rem;font:inherit;font-size:.76rem;font-weight:800;cursor:pointer}
.v4fx .ok{font-size:.72rem;font-weight:900;color:var(--acc)}
.v4st{display:flex;gap:.15rem;margin-top:.35rem}.v4st button{border:0;background:none;padding:0 .1rem;font-size:1.55rem;line-height:1;color:var(--line);cursor:pointer}.v4st button.on{color:var(--acc)}
.v4card{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:0 .8rem}
.v4fn{display:grid;grid-template-columns:1fr auto;gap:.6rem;align-items:center;min-height:58px;border-top:1px solid var(--line);padding:.4rem 0}
.v4fn:first-child{border-top:0}.v4fn b{display:block;font-size:.92rem}.v4fn small{display:block;font-size:.74rem;color:var(--ink-2);margin-top:.1rem}
.gtop .v4back{display:grid;place-items:center;width:36px;height:36px;margin-right:.2rem;border:0;background:none;color:var(--ink);border-radius:50%;cursor:pointer;flex:none}
.gtop .v4back svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
#shelflist.v4inner .sl-body > .sl-top > .sl-back{visibility:hidden!important;width:0!important;min-width:0!important;padding:0!important;margin:0!important;border:0!important;overflow:hidden!important}
#lista.v4inner-l > .v3-top{display:none!important}
#shelflist.v4inner .sl-body > .sl-top.v4empty{height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}
`; TR.append(st); }
const v4Page = (title, html, reopen) => { const from = (() => { try { return v2OnTab(); } catch { return ''; } })(); if (reopen) { reopen.key = 'v4|' + title; try { navEnter(reopen); } catch {} } const v = $('#shelflist'); try { closeEd(); } catch {} v.classList.remove('feedview', 'tabroot', 'mine-page', 'v2des', 'v2pf');
  v.querySelector('.sl-body').innerHTML = '<div class="sl-top"' + (from ? ' data-v4from="' + esc(from) + '"' : '') + '><button type="button" class="sl-back">‹ Voltar</button><b>' + esc(title) + '</b><span></span></div>' + html;
  v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; try { syncTopTitle(); } catch {} });
  try { paintCv(v); } catch {} v.hidden = false; v.scrollTop = 0; try { syncTopTitle(); } catch {} try { drawTabbar(); } catch {} return v; };
// barra de baixo: a página aberta por cima continua marcando a aba de onde veio (Bia, 22/11: Empréstimos aberto pelo Você marcava Hoje,
// porque a página tira a classe mine-page do perfil e a barra caía na aba de baixo)
{ const _ot = v2OnTab; v2OnTab = function () { const v = $('#shelflist'), top = v && !v.hidden && v.querySelector('.sl-body > .sl-top[data-v4from]'); return top ? top.dataset.v4from : _ot.apply(this, arguments); }; }
const v4Mod = (k) => { const m = v2Mods(); if (k === 'presentes') return m.presentes === undefined ? m.emprest !== false : m.presentes !== false; return m[k] !== false; };

// ---------- Empréstimos: página com Emprestei · Peguei ----------
// "+ Emprestar": escolhe um livro da Biblioteca (regra do Emprestar do menu: fora de Lendo; quem tem o exemplar vem primeiro)
// e segue a folha de Emprestar que já existe (exSheet, modo loan)
function v4LoanPick() {
  TR.querySelector('.esn-sheet.v4lnpk')?.remove();
  const ok = (e) => e.status !== 'LENDO' && !exOf(e).loan && exOf(e).own !== 'pegou' && exOf(e).own !== 'quero';
  const all = (() => { try { return sortList(lib().filter(ok), 'titulo'); } catch { return lib().filter(ok); } })();
  const sh = document.createElement('div'); sh.className = 'esn-sheet v4lnpk'; let q = '';
  const close = () => sh.remove();
  const row = (e) => '<button type="button" class="pk" data-id="' + esc(String(e.id)) + '">' + cvh(e.title, e.cover, '') + '<span><b>' + esc(e.title) + '</b><small>' + esc(String(e.author || '').split(',')[0]) + '</small></span></button>';
  const list = () => { const nq = normT(q), L = all.filter((e) => !nq || normT(e.title + ' ' + (e.author || '')).includes(nq)), tem = L.filter((e) => exOf(e).own === 'tenho'), out = L.filter((e) => exOf(e).own !== 'tenho');
    if (!L.length) return '<p class="pk-empty">' + (all.length ? 'Nenhum livro seu com esse nome.' : 'Nenhum livro para emprestar agora. Livros em Lendo não entram.') + '</p>';
    return (tem.length ? '<h4>Seus exemplares</h4>' + tem.slice(0, 120).map(row).join('') : '') + (out.length ? '<h4>' + (tem.length ? 'Outros da Biblioteca' : 'Da sua Biblioteca') + '</h4><p class="pk-note">Ao emprestar, o livro fica marcado como seu exemplar.</p>' + out.slice(0, 120).map(row).join('') : ''); };
  const paint = () => { const box = sh.querySelector('.pk-list'); box.innerHTML = list(); try { paintCv(box); } catch {}
    box.querySelectorAll('.pk').forEach((b) => b.addEventListener('click', () => { const e = lib().find((x) => String(x.id) === b.dataset.id); close(); if (e) exSheet(e, 'loan'); })); };
  sh.innerHTML = '<div class="box"><h3>Emprestar qual livro?</h3><input type="search" class="pk-q" placeholder="Buscar na sua Biblioteca" aria-label="Buscar na sua Biblioteca" autocomplete="off" enterkeyhint="search"><div class="pk-list"></div><div class="acts" style="grid-template-columns:1fr"><button type="button" data-a="cancel">Cancelar</button></div></div>';
  sh.querySelector('.pk-q').addEventListener('input', (ev) => { q = ev.target.value; paint(); });
  sh.querySelector('[data-a=cancel]').addEventListener('click', close);
  sh.addEventListener('click', (ev) => { if (ev.target === sh) close(); });
  TR.append(sh); paint();
}
// "+ Peguei emprestado": busca no catálogo (o livro pode não estar na Biblioteca), depois a folha "De quem e até quando" (exSheet,
// modo borrow). Só entra na Biblioteca (Quero ler) se o empréstimo for salvo.
function v4BorrowPick() {
  searchSheet({ title: 'Peguei emprestado', onPick: (item) => {
    if (!item || !item.title) return;
    const k = normT(item.title), a = normT(String(item.author || '').split(',')[0]);
    let e = lib().find((x) => normT(x.title) === k && (!a || !x.author || normT(String(x.author).split(',')[0]) === a)), novo = false;
    if (e && exOf(e).own === 'pegou' && exOf(e).borrow) return toast('Esse livro já está em Peguei');
    if (!e) { try { e = addToLibrary(item, null, 'QUERO', { quiet: true }); } catch {} if (!e) e = lib().find((x) => normT(x.title) === k); novo = !!e; }
    if (!e) return toast('Não deu para adicionar esse livro. Tente de novo.');
    exSheet(e, 'borrow');
    const sh = TR.querySelector('.esn-sheet.ex-sh'); if (!sh) return;
    const mo = new MutationObserver(() => { if (sh.isConnected) return; mo.disconnect();
      const x = e.ex || {};
      if (novo && !x.own && !x.borrow) { const i = db.library.indexOf(e); if (i >= 0) db.library.splice(i, 1); try { save(); } catch {} }
      else if (novo) { try { save(); renderHome(todayISO()); } catch {} toast('“' + e.title + '” entrou em Quero ler e em Peguei'); }
      try { if (S.listRedraw) S.listRedraw(); } catch {} });
    mo.observe(TR, { childList: true });
  } });
}
function openLoans() {
  const tab = () => S.v4lnTab || 'out';
  const save2 = (e) => { if (e.ex && !e.ex.own && !e.ex.loan && !(e.ex.log || []).length) delete e.ex; save(); try { publishSnapshot(); } catch {} try { exApiLoan(e); } catch {} };
  const draw = () => {
    const OUT = lib().filter((e) => exOf(e).loan), IN = lib().filter((e) => exOf(e).own === 'pegou');
    const t = tab(), L = t === 'in' ? IN : OUT;
    const tabs = '<div class="v2pr-tabs" role="tablist">' + [['out', 'Emprestei · ' + OUT.length], ['in', 'Peguei · ' + IN.length]].map(([k, n]) => '<button type="button" role="tab" aria-selected="' + (t === k) + '" class="' + (t === k ? 'on' : '') + '" data-t="' + k + '">' + n + '</button>').join('') + '</div>';
    const card = (e) => { const x = exOf(e);
      if (t === 'out') { const p = x.loan || {}, late = exLate(p.due), friend = !!(p.to && p.to.h);
        return '<div class="v2gc" data-id="' + esc(String(e.id)) + '">' + cvh(e.title, e.cover, '') + '<div><b>' + esc(e.title) + '</b><small>com ' + esc(exName(p.to) || 'alguém') + (friend ? '' : ' (fora do app)') + (p.at ? ' · desde ' + exD(p.at) : '') + ' · ' + (p.due ? 'devolve até ' + exD(p.due) : 'sem data') + '</small>'
          + (late ? '<span class="late">atrasado ' + plural(late, 'dia', 'dias') + '</span>' : '')
          + '<div class="act"><button type="button" class="p" data-a="back"><i class=v3e data-i=ok></i>Voltou</button>' + (friend ? '<button type="button" data-a="remind"><i class=v3e data-i=sino></i>Lembrar</button>' : '') + '<button type="button" data-a="date"><i class=v3e data-i=cal></i>Data</button></div></div></div>'; }
      const p = x.borrow || {}, late = exLate(p.due), friend = !!(p.from && p.from.h);
      return '<div class="v2gc" data-id="' + esc(String(e.id)) + '">' + cvh(e.title, e.cover, '') + '<div><b>' + esc(e.title) + '</b><small>de ' + esc(exName(p.from) || 'alguém') + (p.at ? ' · desde ' + exD(p.at) : '') + ' · ' + (p.due ? 'devolver até ' + exD(p.due) : 'sem data') + '</small>'
        + (late ? '<span class="late">passou ' + plural(late, 'dia', 'dias') + '</span>' : '')
        + '<div class="act"><button type="button" class="p" data-a="gave"><i class=v3e data-i=ok></i>Já devolvi</button>' + (friend ? '<button type="button" data-a="more"><i class=v3e data-i=cal></i>Pedir mais prazo</button>' : '<button type="button" data-a="bdate"><i class=v3e data-i=cal></i>Data</button>') + '</div></div></div>'; };
    // registrar empréstimo pela própria página (Bia, 22/11): ação no cabeçalho da aba; lista vazia ganha o botão grande no lugar
    const addLbl = t === 'out' ? 'Emprestar' : 'Peguei emprestado';
    const empty = t === 'out' ? 'Nenhum livro emprestado agora.' : 'Você não está com livro de ninguém agora.';
    const body = L.length
      ? '<div class="v4ln-h"><span>' + plural(L.length, 'livro', 'livros') + '</span><button type="button" class="v4hadd" data-ln="add">+ ' + addLbl + '</button></div>' + L.map(card).join('')
      : '<div class="v4ln-empty"><p>' + empty + '</p><button type="button" class="v4btn-w" data-ln="add"><i class=v3e data-i=plus></i>' + addLbl + '</button><small>Perto da data, o lembrete aparece no Hoje.</small></div>';
    const v = v4Page('Empréstimos', tabs + body, () => openLoans());
    v.querySelectorAll('.v2pr-tabs [data-t]').forEach((b) => b.addEventListener('click', () => { S.v4lnTab = b.dataset.t; draw(); }));
    v.querySelectorAll('[data-ln=add]').forEach((b) => b.addEventListener('click', () => (t === 'out' ? v4LoanPick() : v4BorrowPick())));
    v.querySelectorAll('.v2gc [data-a]').forEach((b) => b.addEventListener('click', () => {
      const e = lib().find((y) => String(y.id) === b.closest('.v2gc').dataset.id); if (!e) return; const x = e.ex = e.ex || {}, a = b.dataset.a;
      if (a === 'back') { exLog(e, { t: 'devolveram', to: x.loan && x.loan.to, at: x.loan && x.loan.at }); delete x.loan; save2(e); toast('Voltou para a sua estante'); return draw(); }
      if (a === 'gave') { exLog(e, { t: 'devolvi', from: x.borrow && x.borrow.from }); delete x.borrow; delete x.own; save2(e); toast('Devolução registrada'); return draw(); }
      if (a === 'remind') { const h = x.loan && x.loan.to && x.loan.to.h; if (h) { try { openChat(h); } catch { toast('Abra a conversa para lembrar'); } } return; }
      if (a === 'more') { const h = x.borrow && x.borrow.from && x.borrow.from.h; if (h) { try { openChat(h); } catch { toast('Abra a conversa para pedir mais prazo'); } } return; }
      if (a === 'date' || a === 'bdate') { try { exSheet(e, a === 'date' ? 'loan' : 'borrow'); } catch { exSheet(e); } }
    }));
  };
  S.listRedraw = draw; draw();
}

// ---------- Completar histórico ----------
// (Bia, 21/11: "falta dados") cada livro mostra o que já se sabe (status, nota, páginas, datas, de onde veio) e pede só o que
// falta, com rótulo ("Quando terminou?"), "Só o ano", "Não lembro" (tira da lista sem apagar nada) e "salvo" por campo.
// No topo, "N de M completos"; abas sem livro somem; no fim, Concluir ou Fazer depois.
{ const st = document.createElement('style'); st.textContent = `
.v4fx .hk{display:flex;flex-wrap:wrap;gap:.15rem .6rem;font-size:.72rem;font-weight:700;color:var(--ink-2);margin-top:.15rem}.v4fx .hk .s5{color:var(--gold,#c9a227)}
.v4fx .hl{display:flex;align-items:center;gap:.45rem;margin-top:.55rem;font-size:.8rem;font-weight:900;color:var(--ink)}.v4fx .hl .ok{font-size:.72rem;font-weight:800;color:var(--ok,#2f8a52)}
.v4fx .fld input{flex:1;min-width:0;min-height:44px;box-sizing:border-box}.v4fx .acts{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.4rem}.v4fx .acts .chip{min-height:40px}
.v4fx .v4st button{min-width:40px;min-height:40px}
.v4fxtop{display:grid;gap:.35rem;margin:.2rem 0 .7rem}.v4fxtop b{font-size:.82rem}.v4fxtop .bar{height:6px;border-radius:99px;background:color-mix(in srgb,var(--ink) 10%,transparent);overflow:hidden}.v4fxtop .bar i{display:block;height:100%;background:var(--acc)}
.v4fxend{display:grid;margin-top:.9rem}`; TR.append(st); }
const fxNo = (e) => (e.fxNo = e.fxNo || {});
const fxOpen = (e, k) => fxMiss(e)[k] && !(e.fxNo && e.fxNo[k]);
openFixReads = function (filter) {
  const PER = 12, KS = ['fim', 'ini', 'pag', 'nota'], NM = { fim: 'Sem fim', ini: 'Sem início', pag: 'Sem pág.', nota: 'Sem nota' };
  const LAB = { fim: 'Quando terminou?', ini: 'Quando começou?', pag: 'Quantas páginas?', nota: 'Sua nota' };
  const ST = { LIDO: 'Lido', LENDO: 'Lendo', QUERO: 'Quero ler', HIBERNANDO: 'Pausado', ABANDONEI: 'Abandonado' };
  const lidos = () => lib().filter((e) => e.status === 'LIDO');
  // quem entra na conta "completos": os lidos que tinham algo faltando quando a página abriu
  // progresso conta cada dado que faltava (livro × campo): "Não lembro" e cada campo salvo avançam (teste real 21/11, item 13)
  const pend0 = new Set(); lidos().forEach((e) => KS.forEach((k) => { if (fxOpen(e, k)) pend0.add(String(e.id) + '|' + k); }));
  let f = filter && KS.includes(filter) ? filter : (S.v4fxF || null), page = 0;
  const counts = () => { const c = { fim: 0, ini: 0, pag: 0, nota: 0 }; lidos().forEach((e) => KS.forEach((k) => { if (fxOpen(e, k)) c[k]++; })); return c; };
  const dt = (d) => { if (!d) return ''; const m = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][+String(d).slice(5, 7) - 1]; return m ? m + '/' + String(d).slice(0, 4) : String(d).slice(0, 4); };
  const draw = () => {
    const c = counts(); if (!f || !c[f]) f = KS.find((k) => c[k]) || f || 'fim';
    const tot = pend0.size, feitos = [...pend0].filter((pk) => { const i = pk.lastIndexOf('|'), id = pk.slice(0, i), k = pk.slice(i + 1); const e = lib().find((y) => String(y.id) === id); return !e || !fxOpen(e, k); }).length;
    const all = lidos().filter((e) => fxOpen(e, f)).sort((a, z) => String(z.finishedAt || z.addedAt || '').localeCompare(String(a.finishedAt || a.addedAt || '')));
    const pages = Math.max(1, Math.ceil(all.length / PER)); if (page >= pages) page = pages - 1; const list = all.slice(page * PER, page * PER + PER);
    const known = (e) => { const rv = reviewOfLib(e) || {}, out = [ST[e.status] || 'Lido'];
      if (rv.paws && f !== 'nota') out.push('<span class="s5" aria-label="nota ' + String(rv.paws).replace('.', ',') + '">' + '★'.repeat(Math.round(rv.paws)) + ' ' + String(rv.paws).replace('.', ',') + '</span>');
      if (Number(e.totalPages) > 0 && f !== 'pag') out.push(e.totalPages + ' pág.');
      if (e.startedAt && f !== 'ini') out.push('começou ' + dt(e.startedAt)); if (e.finishedAt && f !== 'fim' && !e.noDate) out.push('terminou ' + dt(e.finishedAt));
      if (e.impSrc) out.push('veio ' + (e.impSrc === 'outro app' ? 'de outro app' : 'do ' + esc(e.impSrc)));
      return '<span class="hk">' + out.map((x) => '<span>' + x + '</span>').join('') + '</span>'; };
    const fid = (e) => 'fx-' + String(e.id).replace(/[^\w-]/g, '') + '-' + f;
    const fld = (e) => { const ok = '<span class="ok" hidden aria-live="polite">' + '<i class=v3e data-i=ok></i>salvo</span>';
      if (f === 'nota') return '<span class="hl" id="' + fid(e) + '">' + LAB.nota + ok + '</span><div class="v4st" role="group" aria-labelledby="' + fid(e) + '">' + [1, 2, 3, 4, 5].map((i) => '<button type="button" data-n="' + i + '" aria-label="' + i + (i > 1 ? ' estrelas' : ' estrela') + '">★</button>').join('') + '</div>';
      if (f === 'pag') return '<label class="hl" for="' + fid(e) + '">' + LAB.pag + ok + '</label><div class="fld"><input id="' + fid(e) + '" inputmode="numeric" data-k="pag" placeholder="ex.: 320"></div>';
      return '<label class="hl" for="' + fid(e) + '">' + LAB[f] + ok + '</label><div class="fld"><input id="' + fid(e) + '" type="date" data-k="' + f + '" max="' + todayISO() + '"></div>'; };
    const acts = '<div class="acts">' + (f === 'fim' || f === 'ini' ? '<button type="button" class="chip" data-a="ano">Só o ano</button>' : '') + '<button type="button" class="chip" data-a="nao">Não lembro</button></div>';
    const nav = all.length > PER ? '<div class="fx-pg"><button type="button" data-pg="-1"' + (page ? '' : ' disabled') + '>‹ Anterior</button><span>' + (page * PER + 1) + '–' + Math.min(all.length, page * PER + PER) + ' de ' + all.length + '</span><button type="button" data-pg="1"' + (page < pages - 1 ? '' : ' disabled') + '>Próxima ›</button></div>' : '';
    const tabs = KS.filter((k) => c[k]);
    const v = v4Page('Completar histórico', '<p class="v4pg-intro">Livros que vieram de outro app sem alguns dados. Completar deixa certas as estatísticas e a meta do ano.</p>'
      + '<button type="button" class="v4btn-w" data-a="addold"><i class=v3e data-i=plus></i>Adicionar livros que já li</button>'
      + (tot ? '<div class="v4fxtop"><b aria-live="polite">' + feitos + ' de ' + tot + ' completos</b><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + tot + '" aria-valuenow="' + feitos + '" aria-label="' + feitos + ' de ' + tot + ' completos"><i style="width:' + Math.round(feitos / tot * 100) + '%"></i></div></div>' : '')
      + (tabs.length ? '<div class="v4seg" role="tablist">' + tabs.map((k) => '<button type="button" role="tab" aria-selected="' + (f === k) + '" class="' + (f === k ? 'on' : '') + '" data-f="' + k + '">' + NM[k] + ' <small>' + c[k] + '</small></button>').join('') + '</div>' : '')
      + (list.length ? '<div class="v4card">' + list.map((e) => '<div class="v4fx" data-id="' + esc(String(e.id)) + '">' + cvh(e.title, e.cover, '') + '<div><b>' + esc(e.title) + '</b><small>' + esc(String(e.author || '').split(',')[0]) + '</small>' + known(e) + fld(e) + acts + '</div></div>').join('') + '</div>' + nav
        : '<p class="v2wempty">Tudo completo. Suas estatísticas e a meta do ano já contam certo.</p>')
      + '<p class="v4pg-foot">Salva sozinho a cada campo. "Não lembro" tira o livro desta lista sem apagar nada.</p>'
      + '<div class="v4fxend"><button type="button" class="' + (tot && feitos >= tot ? 'v4btn-w pri' : 'v4btn-w') + '" data-a="fim">' + (tot && feitos < tot ? 'Fazer depois' : 'Concluir') + '</button></div>', () => openFixReads(f));
    v.querySelector('[data-a=addold]').addEventListener('click', () => { try { openHistory(); } catch { try { openHistLeituras(); } catch {} } });
    v.querySelector('.v4fxend [data-a=fim]').addEventListener('click', () => { const b = v.querySelector('.v4back, .v4back2, .sl-back, [data-a=back]'); if (b) b.click(); else { v.hidden = true; try { refresh(); } catch {} } });
    v.querySelectorAll('.v4seg [data-f]').forEach((b) => b.addEventListener('click', () => { f = S.v4fxF = b.dataset.f; page = 0; draw(); }));
    v.querySelectorAll('.fx-pg button').forEach((b) => b.addEventListener('click', () => { page += Number(b.dataset.pg); draw(); }));
    v.querySelectorAll('.v4fx').forEach((row) => {
      const e = lib().find((y) => String(y.id) === row.dataset.id); if (!e) return; const ok = row.querySelector('.ok');
      const done = () => { save(); try { publishSnapshotSoon(); } catch {} if (ok) ok.hidden = false; toast('Salvo'); setTimeout(() => { try { draw(); } catch {} }, 1600); };
      row.querySelectorAll('.v4st button').forEach((b) => b.addEventListener('click', () => { const n = +b.dataset.n; let rv = reviewOfLib(e); if (!rv) { e.review = { paws: n, mel: [], frase: '' }; rv = e.review; } else rv.paws = n;
        row.querySelectorAll('.v4st button').forEach((x) => x.classList.toggle('on', +x.dataset.n <= n)); try { publishReview(e); } catch {} done(); }));
      row.querySelector('[data-a=nao]')?.addEventListener('click', () => { fxNo(e)[f] = 1; save(); toast('Tirado desta lista. Nada foi apagado'); draw(); });
      const inp = row.querySelector('input'); if (!inp) return;
      const setDate = (k, val, approx) => { if (k === 'ini') { e.startedAt = val; if (approx) e.startApprox = true; else delete e.startApprox; } else { e.finishedAt = val; delete e.noDate; if (approx) e.dateApprox = true; else delete e.dateApprox; } };
      inp.addEventListener('change', () => { const k = inp.dataset.k, val = inp.value.trim(); if (!val) return;
        if (k === 'pag') { const n = Math.round(Number(val)); if (!(n > 0 && n < 100000)) { inp.value = ''; inp.setAttribute('aria-invalid', 'true'); return toast('Use só números, ex.: 320'); } if (Number(e.totalPages) !== n) { e.pagesOwn = 1; delete e.pagesAuto; } e.totalPages = n; return done(); }
        if (inp.type === 'text' && !/^\d{4}$/.test(val)) { inp.setAttribute('aria-invalid', 'true'); return toast('Digite o ano com 4 números'); }
        let d = val; if (/^\d{4}$/.test(val)) d = k === 'ini' ? val + '-01-01' : val + '-06-30';
        if (d > todayISO()) { inp.value = ''; return toast('A data não pode ser no futuro'); }
        const ini = k === 'ini' ? d : e.startedAt, fim = k === 'fim' ? d : e.finishedAt; if (ini && fim && ini > fim) { inp.value = ''; return toast('O início precisa ser antes do fim'); }
        inp.removeAttribute('aria-invalid'); setDate(k, d, /^\d{4}$/.test(val)); done(); });
      row.querySelector('[data-a=ano]')?.addEventListener('click', (ev) => { inp.type = 'text'; inp.inputMode = 'numeric'; inp.maxLength = 4; inp.value = ''; inp.placeholder = 'ano, ex.: 2023'; inp.focus(); ev.currentTarget.remove(); });
    });
  };
  S.listRedraw = draw; draw();
};

// ---------- Funções do app: página, lista do protótipo ----------
V2MODS.splice(0, V2MODS.length,
  ['comunidade', 'Comunidade', 'feed, amizades, ecos, posts e perfil público'],
  ['metas', 'Metas', 'meta do ano e metas com prazo'],
  ['orbita', 'Órbita', 'dias seguidos de leitura'],
  ['emprest', 'Empréstimos', 'emprestei e peguei'],
  ['presentes', 'Presentes e desejos', 'lista de desejos e "Vou dar"'],
  ['trechos', 'Trechos', 'frases guardadas dos livros']);
v2ModsApply = function () { const m = v2Mods(), h = TR.host; if (!h) return; V2MODS.forEach(([k]) => h.classList.toggle('v2off-' + k, !v4Mod(k))); h.classList.remove('v2off-conq'); if (!m.comunidade && S.tab === 'comunidade') { try { goTab('inicio'); } catch {} } };
{ const st = document.createElement('style'); st.textContent = ':host(.v2off-presentes) .drw [data-go2="gifts"],:host(.v2off-presentes) .gf-alert{display:none!important}:host(.v2off-emprest) .ex-alert{display:none!important}'; TR.append(st); }
v2FuncoesSheet = function () {
  const draw = () => {
    const v = v4Page('Funções do app', '<p class="v4pg-intro">Desligue o que você não usa. O app se reorganiza e some com os botões, abas e números dessa função. Nada é apagado: ao religar, volta tudo.</p>'
      + '<div class="v4card">' + V2MODS.map(([k, n, d]) => '<div class="v4fn"><span><b>' + esc(n) + '</b><small>' + esc(d) + '</small></span><button type="button" class="v2fn-tg' + (v4Mod(k) ? ' on' : '') + '" data-k="' + k + '" role="switch" aria-checked="' + v4Mod(k) + '" aria-label="' + esc(n) + '"></button></div>').join('') + '</div>', () => v2FuncoesSheet());
    v.querySelectorAll('.v2fn-tg').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.k, mods = { ...((db.prefs || {}).mods || {}) };
      if (mods.presentes === undefined) mods.presentes = mods.emprest !== false;
      mods[k] = !v4Mod(k); db.prefs = { ...(db.prefs || {}), mods }; save(); v2ModsApply(); try { drawTabbar(); } catch {} draw(); }));
  };
  S.listRedraw = draw; draw();
};
[0, 450, 1500, 4000].forEach((ms) => setTimeout(() => { try { v2ModsApply(); } catch {} }, ms)); // o bloco antigo agenda a versão dele em 300 ms (referência guardada antes desta)

// ---------- Ajustes nos grupos do protótipo ----------
{ const _da = drawAjustes; drawAjustes = function (box) { const r = _da.apply(this, arguments);
  try {
    if (S.ajMode === 'perfil' || !box || box.querySelector('.v4aj')) return r;
    const get = (id) => box.querySelector('#' + id);
    const rowByText = (re) => [...box.querySelectorAll('.aj-row, .aj-card > *')].find((x) => re.test((x.textContent || '').trim()));
    const mk = (id, t, s, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'aj-row'; b.id = id; b.innerHTML = '<span><b>' + t + '</b>' + (s ? '<small>' + s + '</small>' : '') + '</span>›'; b.addEventListener('click', fn); return b; };
    const P = db.prefs || {};
    const spoiler = (() => { const b = document.createElement('div'); b.className = 'aj-row aj-static'; b.id = 'aj-v4sp';
      b.innerHTML = '<span><b>Aviso de spoiler</b><small>perguntar antes de publicar comentário sem marcação</small></span><button type="button" class="v2fn-tg' + (P.spNever ? '' : ' on') + '" role="switch" aria-checked="' + !P.spNever + '" aria-label="Aviso de spoiler"></button>';
      b.querySelector('button').addEventListener('click', (ev) => { db.prefs = db.prefs || {}; db.prefs.spNever = !db.prefs.spNever; save(); ev.currentTarget.classList.toggle('on', !db.prefs.spNever); ev.currentTarget.setAttribute('aria-checked', String(!db.prefs.spNever)); toast(db.prefs.spNever ? 'Não vamos mais perguntar' : 'Vamos perguntar antes de publicar'); });
      return b; })();
    const tq = get('aj-tq'); if (tq) { const nb = tq.cloneNode(true); nb.addEventListener('click', () => { const v = $('#shelflist'); if (v) v.hidden = true; try { v5S().tab = 'trechos'; } catch {} goTab('estante'); }); tq.replaceWith(nb); }
    const hl = get('aj-hl'); if (hl) { const b = hl.querySelector('b'), s = hl.querySelector('small'); if (b) b.textContent = 'Importar histórico'; if (s) s.textContent = 'de outro app de leitura (ex.: Goodreads)'; }
    const fix = mk('aj-v4fix', 'Completar histórico', (() => { try { const L = lib().filter((e) => e.status === 'LIDO' && ['fim', 'ini', 'pag', 'nota'].some((k) => fxOpen(e, k))).length; return L ? L + ' livros com dados faltando' : 'datas, páginas e notas dos lidos'; } catch { return ''; } })(), () => openFixReads());
    const del = connected() ? mk('aj-v4del', 'Excluir conta', 'apaga tudo, não tem volta', () => { try { deleteAccountSheet(); } catch {} }) : null; if (del) del.classList.add('danger');
    const tema = rowByText(/^Tema/), sons = get('aj-sound') ? get('aj-sound').closest('.aj-row, label, div') : rowByText(/^Sons/);
    const thn = () => { const n = tema && tema.querySelector('#aj-thn'); return n ? n.textContent : ''; };
    const apar = tema ? mk('aj-v4apar', 'Aparência', 'tema' + (thn() ? ' · ' + thn() : ''), () => { const open = tema.hidden; tema.hidden = !open; apar.classList.toggle('on', open); }) : null;
    if (tema) { tema.hidden = true; tema.classList.add('v4throw'); const b0 = tema.querySelector('b'); if (b0) b0.textContent = 'Escolha o tema'; tema.addEventListener('click', () => setTimeout(() => { const sm = apar && apar.querySelector('small'); if (sm) sm.textContent = 'tema' + (thn() ? ' · ' + thn() : ''); }, 50)); }
    const G = [
      ['Seu perfil', [get('aj-priv'), get('aj-mu')]],
      ['Seu app', [get('aj-home'), get('aj-fn'), apar, tema, spoiler, get('aj-v5rm')]], // Sons saiu dos Ajustes; Tema virou "Aparência", que abre a escolha (Bia, 20/11, item 41) // Trechos e anotações saiu (Bia, 20/11): é conteúdo, mora na Biblioteca › Trechos
      ['Conta e dados', [get('aj-sync'), get('aj-install'), hl, fix, get('aj-cv'), get('aj-exp'), get('aj-imp')]],
      ['Moderação', [get('aj-mod')]],
      ['Ajuda', [get('aj-tour')]],
    ];
    if (sons) sons.remove(); // Sons saiu dos Ajustes (Bia, 20/11); sons de ambiente da sessão continuam na tela Ler
    const fnS = get('aj-fn') && get('aj-fn').querySelector('small'); if (fnS) fnS.textContent = 'o que aparece no seu app · ' + V2MODS.filter(([k]) => v4Mod(k)).length + ' de ' + V2MODS.length + ' ligadas';
    const keep = [...box.children].filter((x) => x.matches && x.matches('header, .v3-top, .aj-me'));
    const out = get('aj-out'), login = get('aj-login');
    const wrap = document.createElement('div'); wrap.className = 'v4aj';
    G.forEach(([t, rows]) => { const L = rows.filter(Boolean); if (!L.length) return; wrap.insertAdjacentHTML('beforeend', '<div class="aj-g">' + t + '</div>'); const card = document.createElement('div'); card.className = 'aj-card'; L.forEach((x) => card.append(x)); wrap.append(card); });
    const end = document.createElement('div'); end.className = 'aj-card'; end.style.marginTop = '1.1rem'; [login, out, del].filter(Boolean).forEach((x) => end.append(x)); if (end.children.length) wrap.append(end);
    [...box.children].forEach((x) => { if (!keep.includes(x)) x.remove(); }); box.append(wrap);
    // Ajustes sempre abre no topo (teste 20/11 item 46: uma vez abriu rolado até o fim)
    requestAnimationFrame(() => { try { box.scrollTop = 0; const L = $('#lista'); if (L) L.scrollTop = 0; const w = TR.querySelector('.wrap'); if (w) w.scrollTop = 0; window.scrollTo(0, 0); } catch {} });
  } catch (err) { console.warn('ajustes v4', err); }
  return r; }; }

// ---------- Minha leitura › Empréstimos abre a página ----------
{ const _go = v3Go; v3Go = function (v, d, k) { if (k === 'emprest') return openLoans(); return _go.apply(this, arguments); }; }

// ---------- Voltar no topo das páginas internas (como no protótipo) ----------
{ const BK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  let tm = 0; const sync = () => { const top = TR.querySelector('.gtop'), v = $('#shelflist'); if (!top) return;
    const back = v && !v.hidden && v.querySelector('.sl-body > .sl-top > .sl-back'); let inner = !!(back && ((!v.classList.contains('tabroot') && !v.classList.contains('mine-page')) || v.querySelector('.sl-body > .bp-hero'))); // página do livro é sempre interna, mesmo aberta do perfil ou da Busca
    // o seu próprio perfil é a raiz do Você, mesmo quando abriu por cima de outra tela (perfil de outra pessoa › Você): sem seta (Bia, teste 20/11 item 34)
    if (inner && v.querySelector('.v3pb [data-v3=aj]') && !v.querySelector('.sl-body > .bp-hero')) { inner = false; v.classList.add('mine-page'); }
    v && v.classList.toggle('v4inner', inner);
    const meNow = !!(v && !v.hidden && !inner && v.querySelector('.v3pb [data-v3=aj]')); if (meNow) S.v4fromMe = true; else if (!inner) S.v4fromMe = false;
    if (inner) { const st = back.parentElement; st.classList.toggle('v4empty', ![...st.children].some((x) => x !== back && x.tagName !== 'B' && x.getClientRects().length && (x.children.length || (x.textContent || '').trim()))); }
    const lb = (!v || v.hidden) ? TR.querySelector('#lista > header.v3-top .sl-back, #lista > .v3-top .sl-back') : null; const L = TR.querySelector('#lista'); if (L) L.classList.toggle('v4inner-l', !!lb);
    // última aba principal: vale a aba acesa na barra de baixo (S.tab fica "buscar"/"perfil" quando o Você abre por cima de outra tela, e o Voltar de Estatísticas caía na Comunidade)
    { const onb = TR.querySelector('#tabbar button.on'), tb = onb && onb.dataset.tab; if (['inicio', 'estante', 'comunidade', 'eu'].includes(tb)) S.v4lastTab = tb; else if (['inicio', 'estante', 'comunidade', 'eu'].includes(S.tab)) S.v4lastTab = S.tab; }
    const ed = $('#editor'), nt = !!(ed && !ed.hidden && ed.classList.contains('ntpage'));
    let b = top.querySelector('.v4back'); const t = top.querySelector('#g-t');
    if (inner || lb || nt) { if (!b) { b = document.createElement('button'); b.type = 'button'; b.className = 'v4back'; b.setAttribute('aria-label', 'Voltar'); b.innerHTML = BK; b.addEventListener('click', () => { const e2 = $('#editor'); if (e2 && !e2.hidden && e2.classList.contains('ntpage')) { try { closeEd(); } catch {} return; } const wasBusca = S.tab === 'buscar';
      const me = !!S.v4fromMe, sv = $('#shelflist'), bb = (sv && !sv.hidden && sv.querySelector('.sl-body > .sl-top > .sl-back')) || TR.querySelector('#lista > header.v3-top .sl-back, #lista > .v3-top .sl-back'); if (bb) bb.click(); setTimeout(() => { const v = $('#shelflist'); if (v && v.hidden && (me || wasBusca)) { try { goTab(me ? 'eu' : (S.v4lastTab || 'inicio')); } catch {} } }, 30); }); (t || top.firstElementChild).before(b); } b.hidden = false; }
    else if (b) b.hidden = true; };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; sync(); }, 60); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] }); }

// ---------- Nova/Editar estante: Biblioteca e Quem vê no formulário (como no protótipo) ----------
{ const st = document.createElement('style'); st.textContent = '.shf-f .v4shx{display:grid;gap:.35rem;margin-top:.2rem}.shf-f .v4shx select{height:40px;border-radius:10px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);font:inherit;font-weight:700;padding:0 .5rem}.shf-f .v4seg2{display:grid;grid-template-columns:1fr 1fr;gap:.4rem}.shf-f .v4seg2 button{border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:12px;padding:.55rem .4rem;font:inherit;font-weight:800;font-size:.8rem;cursor:pointer;line-height:1.2}.shf-f .v4seg2 button small{display:block;font-weight:700;font-size:.7rem;color:var(--ink-2)}.shf-f .v4seg2 button.on{border-color:var(--acc);box-shadow:inset 0 0 0 1px var(--acc)}'; TR.append(st); }
{ const _f = shelfEditForm; shelfEditForm = function (s) {
    const ed = $('#editor'); let grp = (s && s.grp) || '', priv = !!(s && s.priv);
    const groups = () => [...new Set((db.shelves || []).map((x) => x.grp).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt'));
    const inject = () => { const f = ed.querySelector('.shf-f'), ok = f && f.querySelector('#shf-ok'); if (!f || !ok || f.querySelector('.v4shx')) return;
      const w = document.createElement('div'); w.className = 'v4shx';
      w.innerHTML = '<label for="v4shg">Biblioteca (opcional)</label><select id="v4shg"><option value="">Nenhuma</option>' + groups().map((g) => '<option' + (g === grp ? ' selected' : '') + '>' + esc(g) + '</option>').join('') + '<option value="__new">+ Nova biblioteca…</option></select>'
        + '<label>Quem vê</label><div class="v4seg2"><button type="button" data-p="0" class="' + (priv ? '' : 'on') + '">Pública<small>aparece no seu perfil</small></button><button type="button" data-p="1" class="' + (priv ? 'on' : '') + '">Só você<small>não aparece para ninguém</small></button></div>';
      ok.before(w);
      const sel = w.querySelector('#v4shg');
      sel.addEventListener('change', () => { if (sel.value !== '__new') { grp = sel.value; return; } sel.value = grp;
        const box = document.createElement('div'); box.innerHTML = '<input class="v4shgn" maxlength="40" placeholder="Nome da biblioteca, ex.: 2026 mês a mês" style="width:100%;margin-top:.35rem;height:40px;border-radius:10px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);font:inherit;font-weight:700;padding:0 .6rem;box-sizing:border-box">';
        sel.after(box); const inp = box.querySelector('input'); inp.focus(); inp.addEventListener('input', () => { grp = inp.value.trim(); }); });
      w.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => { priv = b.dataset.p === '1'; w.querySelectorAll('[data-p]').forEach((x) => x.classList.toggle('on', x === b)); }));
      ok.addEventListener('click', () => { const n0 = (db.shelves || []).length, name = (ed.querySelector('#shf-n') || {}).value || '';
        setTimeout(() => { const L = db.shelves || []; const x = s || (L.length > n0 ? L[L.length - 1] : L.find((y) => y.name === name.trim())); if (!x) return;
          if (grp) x.grp = grp.slice(0, 40); else delete x.grp; if (priv) x.priv = true; else delete x.priv; x.touchedAt = new Date().toISOString();
          save(); try { publishSnapshotSoon(); } catch {} try { refresh(); } catch {} }, 0); }, true);
    };
    const mo = new MutationObserver(inject); mo.observe(ed, { childList: true, subtree: true });
    const stop = new MutationObserver(() => { if (ed.hidden || !ed.querySelector('.shf-f')) { mo.disconnect(); stop.disconnect(); } }); stop.observe(ed, { attributes: true, attributeFilter: ['hidden'], childList: true, subtree: true });
    const r = _f.apply(this, arguments); inject(); return r; }; }

// ---------- Perfil de amizade › Estantes: cartões com contagem e situação de cada capa (como no protótipo) ----------
// O resumo publicado passa a levar, em cada estante mostrada, o total de livros (n) e a situação de cada livro (st, nota, %).
// O resumo é um JSON livre na API (snapshot), então nada muda no servidor. Estantes privadas e arquivadas já ficam de fora.
{ const ST = { LIDO: 'lido', LENDO: 'lendo', QUERO: 'quero', HIBERNANDO: 'pausado', ABANDONEI: 'abandonado' };
  const _ps = profShelvesSnap; profShelvesSnap = function (snapshot) { const r = _ps.apply(this, arguments);
    try { const L = lib(); (snapshot.shelf.extra || []).forEach((x) => { const all = profShelfBooks(x.key); x.n = all.length;
      x.books = (x.books || []).map((b) => { const e = all.find((y) => normT(y.title) === normT(b.title)) || L.find((y) => normT(y.title) === normT(b.title)); if (!e) return b;
        const rv = (e.status === 'LIDO' && reviewOfLib(e)) || {}, pct = e.status === 'LENDO' ? (() => { try { return Math.round(readingInfo(e).pct) || 0; } catch { return 0; } })() : null;
        return { ...b, st: ST[e.status] || null, ...(rv.paws ? { nota: rv.paws } : {}), ...(pct != null ? { pct } : {}) }; }); }); } catch (err) { console.warn('estantes no resumo', err); }
    return r; }; }
{ const st = document.createElement('style'); st.textContent = `
.v4psh{display:grid;gap:.6rem}
.v4psh .pshelf{display:block;width:100%;text-align:left;padding:12px 14px;font:inherit;color:var(--ink);border:1px solid var(--line);background:var(--panel);border-radius:16px;cursor:pointer}
.v4psh .pshelf .hd{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.v4psh .pshelf b{font-family:var(--v2-disp,Georgia,serif);font-size:15px}
.v4psh .pshelf small{font-size:11.5px;color:var(--ink-2)}
.v4psh .covers{display:flex;gap:6px;margin-top:8px;align-items:flex-start;overflow:hidden}
.v4psh .scv{display:grid;justify-items:center;gap:4px;flex:none;width:38px}
.v4psh .scv .cv{width:38px!important;height:57px!important;font-size:6px!important;border-radius:3px 5px 5px 3px!important}
.v4psh .sb{font-style:normal;font-size:10px;font-weight:900;line-height:1;white-space:nowrap}
.v4psh .sb.lido{color:var(--acc)}.v4psh .sb.quero{color:var(--ink-2);font-weight:800}
.v4psh .sb.lendo{display:block;width:100%;height:4px;border-radius:9px;background:color-mix(in srgb,var(--ink) 10%,var(--panel));overflow:hidden;margin-top:3px}
.v4psh .sb.lendo i{display:block;height:100%;background:var(--acc)}
.v4psh .scount{display:block;margin-top:8px;font-size:11.5px;font-weight:700;color:var(--ink-2)}
`; TR.append(st); }
const v4ShBadge = (b) => b.st === 'lido' ? '<em class="sb lido">' + (b.nota ? '★ ' + String(b.nota).replace('.', ',') : 'lido') + '</em>' : b.st === 'lendo' ? '<em class="sb lendo"><i style="width:' + (b.pct || 0) + '%"></i></em>' : b.st === 'quero' ? '<em class="sb quero">quer ler</em>' : b.st === 'pausado' ? '<em class="sb quero">pausado</em>' : '';
const v4ShCount = (L) => { const c = (s) => L.filter((b) => b.st === s).length; return [c('lido') && c('lido') + (c('lido') > 1 ? ' lidos' : ' lido'), c('lendo') && c('lendo') + ' lendo', c('quero') && c('quero') + ' quer ler'].filter(Boolean).join(' · '); };
{ const _vb = v3Build; v3Build = function (v, d) { const r = _vb.apply(this, arguments);
    try { if (!d || d.self) return r; const body = v.querySelector('.sl-body'), pE = body && body.querySelector(':scope > .v3pane[data-k=est]'); if (!pE) return r;
      const X = ((d.shelf && d.shelf.extra) || []).filter((x) => x && (x.books || []).length); if (!X.length) return r;
      const sig = JSON.stringify(X.map((x) => [x.key, x.n, (x.books || []).map((b) => [b.title, b.st, b.nota, b.pct])]));
      if (pE.dataset.v4sig === sig && pE.children.length === 1 && pE.firstElementChild.classList.contains('v4psh')) return r;
      pE.dataset.v4sig = sig;
      pE.innerHTML = '<div class="v4psh">' + X.map((x, i) => '<button type="button" class="pshelf" data-i="' + i + '"><div class="hd"><b>' + esc(x.name || 'Estante') + '</b><small>' + plural(x.n || x.books.length, 'livro', 'livros') + '</small></div><div class="covers">'
        + x.books.slice(0, 7).map((b) => '<span class="scv">' + cvh(b.title, b.cover, '') + v4ShBadge(b) + '</span>').join('') + '</div>' + (v4ShCount(x.books) ? '<small class="scount">' + v4ShCount(x.books) + '</small>' : '') + '</button>').join('') + '</div>';
      try { paintCv(pE); } catch {}
      pE.querySelectorAll('.pshelf').forEach((b) => b.addEventListener('click', () => { const x = X[+b.dataset.i]; if (!x) return;
        v4Page(x.name || 'Estante', '<p class="v4pg-intro">' + plural(x.n || x.books.length, 'livro', 'livros') + (x.n > x.books.length ? ' · mostrando ' + x.books.length : '') + '</p><div class="v4psh"><div class="pshelf" style="cursor:default"><div class="covers" style="flex-wrap:wrap;gap:10px">' + x.books.map((bk, j) => '<button type="button" class="scv" data-j="' + j + '" style="border:0;background:none;padding:0;width:56px">' + cvh(bk.title, bk.cover, '') + v4ShBadge(bk) + '</button>').join('') + '</div></div></div>', () => { const p = pE.querySelector('.pshelf[data-i="' + b.dataset.i + '"]'); if (p) p.click(); });
        const pv = $('#shelflist'); pv.querySelectorAll('[data-j]').forEach((q) => q.addEventListener('click', () => { const bk = x.books[+q.dataset.j]; if (bk) try { openAnyBook(bk.title, bk.author, bk.cover); } catch {} })); }));
    } catch (err) { console.warn('estantes da amizade', err); }
    return r; }; }
