// Todas as leituras conjuntas (Bia, 21/11; protótipo v158 aprovado): atalho "Ler junto · N em andamento · N novas" em
// Você › Minha leitura, em largura cheia, e uma página com as abas "Em andamento | Encerradas".
// - Convites recebidos no topo de Em andamento (Aceitar / Agora não).
// - Cartão por leitura: capa, quem participa, progresso de cada pessoa em % (é social: sempre %), mensagens novas e a última mensagem.
//   Mensagem de página à frente da sua aparece coberta (não estraga a leitura). "Novas" = mensagens de outras pessoas desde a
//   última vez que você abriu aquela leitura (guardado no aparelho em lv.ljSeen).
// - Encerradas: as que fecharam no último ano (regra da API), com a data.
// - Tocar no cartão abre a página da leitura conjunta que já existe (openBuddyPage).
// - 21/11 (bug da Bia): o cartão sempre abre algo. A página é aberta pela leitura tocada (ljBind), então convite ainda sem
//   resposta e encerrada do mesmo livro abrem; livro fora da Biblioteca oferece pôr de volta; "•••" com Abrir, Cancelar convite,
//   Encerrar (quem criou), Sair e Remover da lista (encerradas); convite que ficou só no aparelho: Enviar de novo / Descartar.
const LJ2 = { items: null, last: {}, at: 0, busy: false };
{ const st = document.createElement('style'); st.textContent = `
.v3hub .v3hub-lj{grid-column:1/-1;display:grid;grid-template-columns:auto 1fr auto;justify-items:start;align-items:center;column-gap:.7rem;padding:.7rem .9rem;text-align:left}
.v3hub .v3hub-lj .v3pi{grid-row:span 2}.v3hub .v3hub-lj em{grid-row:span 2;font-style:normal;color:var(--ink-2);font-size:1.1rem}
.lj2-tabs{display:flex;gap:.4rem;margin:.2rem 0 .8rem;border-bottom:1px solid var(--line)}
.lj2-tabs button{min-height:44px;padding:0 .7rem;border:0;border-bottom:2px solid transparent;background:none;color:var(--ink-2);font:inherit;font-weight:800;font-size:.9rem;cursor:pointer}
.lj2-tabs button.on{color:var(--ink);border-bottom-color:var(--acc)}
.lj2-h{display:flex;align-items:baseline;gap:.4rem;margin:.4rem 0 .5rem;font-weight:900;font-size:.95rem}.lj2-h small{color:var(--ink-2);font-weight:700}
.lj2-list{display:grid;gap:.6rem}
.lj2-card{display:grid;gap:.6rem;padding:.75rem;border-radius:16px;border:1px solid var(--line);background:var(--panel);text-align:left;color:var(--ink);font:inherit;width:100%;cursor:pointer}
.lj2-top{display:flex;gap:.75rem;align-items:flex-start}.lj2-top .cv{width:44px;height:66px;flex:none;border-radius:3px 6px 6px 3px}
.lj2-tx{flex:1;min-width:0;display:grid;gap:.15rem}.lj2-tx b{font-size:.92rem}.lj2-tx small{color:var(--ink-2);font-size:.76rem;font-weight:700}
.lj2-new{flex:none;align-self:center;min-width:22px;height:22px;padding:0 .45rem;border-radius:99px;background:var(--acc);color:#fff;font-size:.72rem;font-weight:900;display:grid;place-items:center}
.lj2-ppl{display:grid;gap:.4rem}
.lj2-p{display:grid;grid-template-columns:22px 70px 1fr 44px;align-items:center;gap:.5rem;font-size:.76rem;font-weight:700}
.lj2-p .av{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:.66rem;font-weight:900;color:#fff}
.lj2-p .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lj2-bar{height:6px;border-radius:6px;background:color-mix(in srgb,var(--ink) 10%,transparent);overflow:hidden}.lj2-bar i{display:block;height:100%;border-radius:6px;background:var(--acc)}
.lj2-p.eu .lj2-bar i{background:var(--ink)}.lj2-p em{font-style:normal;text-align:right;color:var(--ink-2)}
.lj2-last{font-size:.8rem;color:var(--ink-2);border-top:1px solid var(--line);padding-top:.5rem;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.lj2-last b{color:var(--ink)}
.lj2-inv{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;padding:.65rem .75rem;border-radius:14px;border:1px dashed var(--line);background:var(--panel);margin-bottom:.6rem}
.lj2-inv .cv{width:34px;height:51px;flex:none;border-radius:2px 5px 5px 2px}.lj2-inv>span{flex:1 1 calc(100% - 50px);min-width:0;font-size:.84rem}
.lj2-inv small{display:block;color:var(--ink-2);font-weight:700;font-size:.74rem}
.lj2-inv button{flex:1;min-height:40px;padding:0 .8rem;border-radius:99px;border:1px solid var(--line);background:none;color:var(--ink);font:inherit;font-weight:800;font-size:.84rem;cursor:pointer}
.lj2-inv button.p{background:var(--acc);border-color:var(--acc);color:#fff}
.lj2-end{opacity:.88}.lj2-tip{margin:.9rem .1rem 0;font-size:.78rem;color:var(--ink-2)}
.lj2-empty{padding:1rem .8rem;border:1px dashed var(--line);border-radius:14px;color:var(--ink-2);font-size:.86rem;text-align:center}
.lj2-w{position:relative}.lj2-w .lj2-top{padding-right:36px}
.lj2-more{position:absolute;top:.3rem;right:.3rem;width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:12px;background:none;color:var(--ink-2);font:inherit;font-size:1.05rem;font-weight:900;letter-spacing:.05em;cursor:pointer}
.lj2-w .lj2-new{margin-right:6px}
.lj2-warn{color:#b3261e}
.lj2-add{margin-left:auto;min-height:40px;padding:0 .9rem;border-radius:99px;border:1px solid var(--acc);background:none;color:var(--acc);font:inherit;font-weight:900;font-size:.86rem;cursor:pointer;white-space:nowrap}
.lj2-empty-on{display:grid;gap:.5rem;justify-items:center;padding:1.3rem 1rem}.lj2-empty-on b{color:var(--ink);font-size:.95rem}
.lj2-big{width:100%;min-height:52px;border:0;border-radius:14px;background:var(--acc);color:#fff;font:inherit;font-weight:900;font-size:1rem;cursor:pointer;margin-top:.3rem}
.lj2-p .av.has-ph,.lj2-p .av.lj2-ph{background-size:cover;background-position:center;color:transparent!important}
.lj2-loc{border-style:solid;border-color:color-mix(in srgb,#b3261e 40%,var(--line))}
`; TR.append(st); }

const ljSeenGet = () => { try { return JSON.parse(localStorage.getItem('lv.ljSeen') || '{}') || {}; } catch { return {}; } };
const ljSeenSet = (id) => { const s = ljSeenGet(); s[id] = new Date().toISOString(); try { localStorage.setItem('lv.ljSeen', JSON.stringify(s)); } catch {} };
const ljItems = () => (LJ2.items || (SOC && SOC.buddies) || []);
const ljOn = (L) => L.filter((x) => !x.closedAt && x.myStatus === 'ACCEPTED');
const ljInv = (L) => L.filter((x) => !x.closedAt && x.myStatus === 'INVITED');
// encerradas que a pessoa tirou da lista (só neste aparelho; a conversa continua para quem participou)
const ljHideGet = () => { try { return JSON.parse(localStorage.getItem('lv.ljHide') || '[]') || []; } catch { return []; } };
const ljHideSet = (L) => { try { localStorage.setItem('lv.ljHide', JSON.stringify(L.slice(-200))); } catch {} };
const ljEnd = (L) => { const h = new Set(ljHideGet()); return L.filter((x) => !!x.closedAt && !h.has(x.id)); };
const ljNew = (x) => { const c = LJ2.last[x.id]; return c ? c.unread || 0 : 0; };
const ljPctOf = (m) => Math.max(0, Math.min(100, Math.round(m.finished ? 100 : (m.pct || 0))));
const ljDate = (d) => { try { return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); } catch { return ''; } };
const ljFirst = (n) => String(n || '').split(' ')[0];
// há quanto tempo (a API manda createdAt da leitura quando tiver; sem ele, não inventa)
const ljAgo = (d) => { const t = Date.parse(d || ''); if (!t) return ''; const h = (Date.now() - t) / 36e5; return h < 1 ? 'há pouco' : h < 24 ? 'há ' + Math.round(h) + ' h' : h < 48 ? 'ontem' : 'há ' + Math.round(h / 24) + ' dias'; };
const ljInvited = (x) => (x.members || []).filter((m) => !m.me && m.status === 'INVITED');
const ljAccOthers = (x) => (x.members || []).filter((m) => !m.me && m.status === 'ACCEPTED');
const ljRemoved = (x) => { try { return (db.removed || []).find((r) => r && r.e && bookKey(r.e) === x.bookKey) || null; } catch { return null; } };
// convites feitos no aparelho que ainda não chegaram ao servidor (T().buddy, status PENDENTE com handles)
// capa: a do livro na Biblioteca; senão a de Removidos recentemente, a troca da moderação ou a que veio num post do feed
const ljCover = (t, a, e) => { try { if (e && e.cover) return e.cover; const k = normT(t || '');
  const r = (db.removed || []).find((y) => y && y.e && normT(y.e.title || '') === k && y.e.cover); if (r) return r.e.cover;
  const ov = typeof covOv === 'function' ? covOv(t, a || null) : null; if (ov) return ov;
  const p = (SOC.feed || []).find((y) => y && y.cover && normT(y.title || (y.book && y.book.title) || '') === k); return p ? p.cover : null; } catch { return null; } };
const ljMyPh = () => { try { return myPhoto() || (socialProfile && avatarOf(socialProfile.handle)) || null; } catch { return null; } };
const ljCv = (x) => cvh(x.title, ljCover(x.title, x.author, bjEntry(x)), '');
const ljLocal = () => { try { return Object.entries(T().buddy || {}).filter(([, b]) => b && b.status === 'PENDENTE' && Array.isArray(b.handles)).map(([eid, b]) => ({ eid, b, e: byId(eid) })); } catch { return []; } };

// "N em andamento · N novas" do atalho
const ljSummary = () => {
  const L = ljItems(), on = ljOn(L).length, inv = ljInv(L).length, nw = ljOn(L).reduce((a, x) => a + ljNew(x), 0);
  if (!on && !inv) return ljEnd(L).length ? 'nenhuma em andamento' : 'nenhuma ainda';
  return [on ? on + ' em andamento' : '', inv ? inv + (inv === 1 ? ' convite' : ' convites') : '', nw ? nw + (nw === 1 ? ' nova' : ' novas') : ''].filter(Boolean).join(' · ');
};

// atalho em largura cheia em Você › Minha leitura (o hub monta pelo v3Hub; o clique passa pelo v3Go)
if (typeof v3Hub === 'function') { const _h = v3Hub; v3Hub = function () {
  const html = _h.apply(this, arguments);
  let on = true; try { on = typeof vFn === 'function' ? vFn('junto') !== false : true; } catch {}
  if (!on) return html;
  const btn = '<button type="button" class="v3hub-lj" data-hub="juntos">' + v3pi('friends', 22) + '<b>Ler junto</b><small class="lj2-sum">' + esc(ljSummary()) + '</small><em aria-hidden="true">›</em></button>';
  return html.replace(/<\/div>$/, btn + '</div>');
}; }
if (typeof v3Go === 'function') { const _g = v3Go; v3Go = function (v, d, k) { if (k === 'juntos') return openJuntos(); return _g.apply(this, arguments); }; }
// o resumo do atalho se atualiza quando os dados chegam (o hub só se redesenha quando muda o sinal dele)
const ljPaintSummary = () => { TR.querySelectorAll('.v3hub-lj .lj2-sum').forEach((s) => { const t = ljSummary(); if (s.textContent !== t) s.textContent = t; }); };

// abrir a leitura: marca como vista e usa a página que já existe
// O mapa SOC.buddyMap é por livro e só guarda uma leitura, e só quando já há alguém que aceitou. Por isso uma leitura
// só com convite pendente, ou uma encerrada do mesmo livro de outra em andamento, dava "ainda não sincronizou".
// ljBind aponta o livro para ESTA leitura antes de abrir a página (a página guarda o id na hora de abrir).
function ljBind(x, e) {
  const me = (x.members || []).find((m) => m.me) || {}, acc = ljAccOthers(x), inv = ljInvited(x);
  SOC.buddyMap = SOC.buddyMap || {};
  SOC.buddyMap[e.id] = { status: acc.length ? 'ACEITO' : 'PENDENTE', id: x.id, people: acc.map((m) => ({ displayName: m.displayName, handle: m.handle, pct: m.pct, finished: !!m.finished })),
    pending: inv.length, names: inv.map((m) => ljFirst(m.displayName || m.handle)).join(', '), own: !!x.own, closed: !!x.closedAt, meFinished: !!me.finished };
}
// leitura do servidor para um livro: a em andamento primeiro, depois a encerrada mais recente
const ljForEntry = (e) => { try { const k = bookKey(e); return ljItems().filter((x) => x.bookKey === k && x.myStatus === 'ACCEPTED').sort((a, b) => (!!a.closedAt - !!b.closedAt) || String(b.closedAt || '').localeCompare(String(a.closedAt || '')))[0] || null; } catch { return null; } };
const ljHasPage = (e) => { const bm = (SOC.buddyMap || {})[e && e.id], b = bm && Array.isArray(bm.people) ? bm : (T().buddy || {})[e && e.id]; return !!(b && Array.isArray(b.people)); };
if (typeof openBuddyPage === 'function') { const _o = openBuddyPage; openBuddyPage = function (e) {
  if (!LJ2.opening) LJ2.pin = null;
  if (e && !ljHasPage(e)) { const x = ljForEntry(e); if (x) ljBind(x, e); else return toast('Esta leitura conjunta ainda não chegou ao servidor', { label: 'Ver leituras', fn: openJuntos }); }
  try { const bm = (SOC.buddyMap || {})[e && e.id]; if (bm && bm.id) { ljSeenSet(bm.id); if (LJ2.last[bm.id]) LJ2.last[bm.id].unread = 0; } } catch {}
  return _o.apply(this, arguments);
}; }
if (typeof buddySheet === 'function') { const _bs = buddySheet; buddySheet = function (e) {
  if (e && !ljHasPage(e)) { const x = ljForEntry(e); if (x) ljBind(x, e); else return toast('Esta leitura conjunta ainda não chegou ao servidor', { label: 'Ver leituras', fn: openJuntos }); }
  return _bs.apply(this, arguments);
}; }
// enquanto a página aberta pela lista estiver na tela, a sincronização não troca a leitura por outra do mesmo livro
if (typeof mapBuddies === 'function') { const _mb = mapBuddies; mapBuddies = function () {
  const r = _mb.apply(this, arguments);
  try { const p = LJ2.pin; if (p && TR.querySelector('#shelflist:not([hidden]) .bj-head')) { const e = byId(p.eid); const x = ljItems().find((y) => y.id === p.x.id) || p.x; if (e) ljBind(x, e); } else LJ2.pin = null; } catch {}
  return r;
}; }

// abrir uma leitura da lista: sempre faz algo
function lj2Open(x) {
  const e = bjEntry(x); if (!e) return ljGone(x);
  ljSeenSet(x.id); if (LJ2.last[x.id]) LJ2.last[x.id].unread = 0;
  ljBind(x, e); LJ2.pin = { eid: e.id, x }; LJ2.opening = true;
  try { openBuddyPage(e); } finally { LJ2.opening = false; }
}
function ljEdOpen(html) { const ed = $('#editor'); ed.classList.add('compact'); ed.querySelector('.ed-body').innerHTML = '<div class="dd">' + html + '</div>'; ed.hidden = false; return ed; }
// o livro saiu da Biblioteca: explica e oferece pôr de volta (do Removidos recentemente, com tudo o que tinha)
function ljGone(x) {
  const r = ljRemoved(x);
  const ed = ljEdOpen('<h3>' + esc(x.title) + '</h3><p>Este livro saiu da sua Biblioteca' + (r ? ' e está em Removidos recentemente' : '') + '. A leitura conjunta continua: coloque o livro de volta para abrir a conversa.</p>'
    + '<button type="button" class="op main" id="lj-back"><b>Adicionar de volta à Biblioteca</b></button><button type="button" class="op" id="lj-acts"><b>Outras opções</b></button><button type="button" class="cn" id="lj-x">Fechar</button>');
  $('#lj-x', ed).addEventListener('click', closeEd);
  $('#lj-acts', ed).addEventListener('click', () => { closeEd(); ljMenu(x); });
  $('#lj-back', ed).addEventListener('click', () => {
    closeEd();
    try { if (r && typeof v5Restore === 'function') v5Restore(r.e.id); else addToLibrary({ title: x.title, author: x.author || null }, null, x.closedAt ? 'LIDO' : 'QUERO', {}); } catch {}
    try { mapBuddies(); } catch {}
    if (bjEntry(x)) { if (S.listRedraw === ljDraw) ljDraw(); lj2Open(x); } else toast('Não consegui pôr o livro de volta', { label: 'Repetir', fn: () => ljGone(x) });
  });
}
// confirmação dentro do app (nunca confirm do navegador), dizendo o que se perde
function ljAsk(title, text, okLabel, fn, back) {
  const ed = ljEdOpen('<h3>' + esc(title) + '</h3><p>' + esc(text) + '</p><button type="button" class="op" id="lj-ok" style="color:#b3261e"><b>' + esc(okLabel) + '</b></button><button type="button" class="cn" id="lj-no">Voltar</button>');
  $('#lj-no', ed).addEventListener('click', () => { closeEd(); if (back) back(); });
  $('#lj-ok', ed).addEventListener('click', () => { closeEd(); fn(); });
}
// pedido à API com retorno: ok vira toast; falha vira toast com "Repetir"
async function lj2Do(method, path, okMsg, failMsg, again) {
  try { const r = await sapi(method, path); if (!r || r.status < 200 || r.status >= 300) throw 0; toast(okMsg); }
  catch { toast(failMsg, { label: 'Repetir', fn: again }); return false; }
  await bjSync(); await ljLoad(true); return true;
}
// ••• do cartão: o que dá para fazer com esta leitura
function ljMenu(x) {
  const e = bjEntry(x), end = !!x.closedAt, inv = ljInvited(x), acc = ljAccOthers(x), items = [];
  items.push({ label: end ? 'Abrir conversa' : 'Abrir leitura conjunta', fn: () => lj2Open(x) });
  if (e) items.push({ label: 'Abrir livro', fn: () => openBookPage(e) });
  else items.push({ label: 'Adicionar de volta à Biblioteca', sub: 'o livro saiu da Biblioteca', fn: () => ljGone(x) });
  if (end) {
    items.push(0, { label: 'Remover da lista', sub: 'só some daqui', fn: () => {
      ljHideSet([...ljHideGet(), x.id]); ljDraw(); ljPaintSummary();
      toast('“' + x.title + '” saiu da lista', { label: 'Desfazer', fn: () => { ljHideSet(ljHideGet().filter((i) => i !== x.id)); ljDraw(); ljPaintSummary(); } });
    }, danger: true });
    return sheetList(esc(x.title), items);
  }
  if (x.myStatus === 'ACCEPTED') {
    if (inv.length) items.push(0);
    inv.forEach((m) => { const nm = ljFirst(m.displayName || m.handle), last = !acc.length && inv.length === 1;
      const go = () => lj2Do('DELETE', `/v1/buddies/${x.id}/invites/${encodeURIComponent(m.handle)}`, last ? 'Convite cancelado. A leitura foi para Encerradas.' : 'Convite para ' + nm + ' cancelado', 'Não consegui cancelar o convite agora', go);
      items.push({ label: 'Cancelar convite para ' + esc(nm), sub: esc('@' + m.handle), danger: true, fn: () => last
        ? ljAsk('Cancelar o convite para ' + nm + '?', 'Ninguém mais está nesta leitura, então ela será encerrada. O livro e o seu progresso continuam na Biblioteca.', 'Cancelar convite', go, () => ljMenu(x))
        : go() }); });
    items.push(0);
    if (x.own) { const go = () => lj2Do('POST', `/v1/buddies/${x.id}/close`, 'Leitura conjunta encerrada. A conversa continua aberta.', 'Não consegui encerrar agora', go);
      items.push({ label: 'Encerrar leitura conjunta', sub: 'para todo mundo', danger: true, fn: () => ljAsk('Encerrar a leitura conjunta de “' + x.title + '”?', (inv.length ? 'Os convites pendentes deixam de valer. ' : '') + 'Ela vai para Encerradas, a conversa continua aberta e sem trava de spoiler. O livro e o seu progresso não mudam.', 'Encerrar', go, () => ljMenu(x)) }); }
    const goL = () => lj2Do('POST', `/v1/buddies/${x.id}/leave`, 'Você saiu da leitura conjunta', 'Não consegui sair agora', goL);
    items.push({ label: 'Sair da leitura conjunta', danger: true, fn: () => ljAsk('Sair da leitura conjunta de “' + x.title + '”?', 'Você deixa de ver a conversa e o andamento das outras pessoas. O livro e o seu progresso continuam na Biblioteca.', 'Sair da leitura conjunta', goL, () => ljMenu(x)) });
  }
  sheetList(esc(x.title), items);
}

async function ljLoad(force) {
  if (LJ2.busy || (!force && LJ2.items && Date.now() - LJ2.at < 30000)) return;
  if (!connected()) return; LJ2.busy = true;
  try {
    const r = await sapi('GET', '/v1/buddies');
    if (r.status === 200 && r.data) { LJ2.items = r.data.items || []; LJ2.at = Date.now(); }
    // última mensagem e novas: só das em andamento (até 8, em paralelo)
    const seen = ljSeenGet(), on = ljOn(LJ2.items || []).slice(0, 8);
    await Promise.all(on.map(async (x) => {
      try {
        const p = await sapi('GET', `/v1/buddies/${x.id}/posts`); if (p.status !== 200 || !p.data) return;
        const items = p.data.items || [], last = items[items.length - 1] || null, since = seen[x.id] || '';
        LJ2.last[x.id] = { last, unread: items.filter((c) => !c.mine && (!since || String(c.createdAt) > since)).length, lock: !!p.data.spoilerLock };
      } catch {}
    }));
  } catch {} finally { LJ2.busy = false; }
  ljPaintSummary(); if (S.listRedraw === ljDraw) ljDraw();
}

// minha página atual no livro (para cobrir mensagem de página à frente)
const ljMyPage = (x) => { const e = bjEntry(x); if (!e) return 0; if (e.status === 'LIDO') return 1e9; try { return readingInfo(e).now || 0; } catch { return e.currentPage || 0; } };

function ljCard(x) {
  const end = !!x.closedAt, M = (x.members || []).slice().sort((a, b) => ljPctOf(b) - ljPctOf(a));
  const others = M.filter((m) => !m.me && m.status === 'ACCEPTED').map((m) => ljFirst(m.displayName || m.handle));
  const fin = M.filter((m) => m.finished).length, nw = end ? 0 : ljNew(x);
  // quem foi convidado e ainda não respondeu aparece pelo nome (e há quanto tempo, quando a API mandar a data)
  const inv = ljInvited(x).map((m) => ljFirst(m.displayName || m.handle)), ago = ljAgo(x.createdAt);
  const invTx = inv.length ? 'convite para ' + inv.join(', ') + (ago ? ' ' + ago : '') + ', sem resposta' : '';
  const sub = end ? [others.join(', ') || 'Só você', 'encerrada em ' + ljDate(x.closedAt), x.avgPaws ? 'média ★' + String(x.avgPaws).replace('.', ',') : ''].filter(Boolean).join(' · ')
    : [others.join(', '), others.length ? invTx : invTx.replace(/^c/, 'C'), !others.length && !inv.length ? 'Só você por enquanto' : '', fin ? fin + (fin === 1 ? ' terminou' : ' terminaram') : ''].filter(Boolean).join(' · ');
  const gone = !bjEntry(x);
  let html = '<div class="lj2-w"><button type="button" class="lj2-card' + (end ? ' lj2-end' : '') + '" data-lj="' + esc(x.id) + '"><span class="lj2-top">' + ljCv(x) + '<span class="lj2-tx"><b>' + esc(x.title) + '</b><small>' + esc(sub) + '</small>'
    + (gone ? '<small class="lj2-warn">O livro saiu da sua Biblioteca · toque para pôr de volta</small>' : '') + '</span>'
    + (nw ? '<span class="lj2-new" aria-label="' + nw + ' mensagens novas">' + nw + '</span>' : '') + '</span>';
  if (!end) {
    html += '<span class="lj2-ppl">' + M.filter((m) => m.status === 'ACCEPTED').map((m) => { const nm = m.me ? 'Você' : ljFirst(m.displayName || m.handle), p = ljPctOf(m);
      return '<span class="lj2-p' + (m.me ? ' eu' : '') + '"><span class="av' + (m.me && ljMyPh() ? ' lj2-ph' : '') + '"' + (m.handle && !(m.me && ljMyPh()) ? ' data-avh="' + esc(m.handle) + '"' : '') + ' style="background-color:' + (m.me ? 'var(--ink)' : friendColor(m.handle || nm)) + ';' + (m.me ? 'color:var(--bg,#fff);' : '') + (m.me && ljMyPh() ? 'background-image:url(&quot;' + esc(ljMyPh()) + '&quot;)' : '') + '">' + esc(initial(nm)) + '</span><span class="nm">' + esc(nm) + (m.finished ? ' ✓' : '') + '</span><span class="lj2-bar"><i style="width:' + p + '%"></i></span><em>' + p + '%</em></span>'; }).join('') + '</span>';
    const c = LJ2.last[x.id], l = c && c.last;
    if (l) { const who = l.mine ? 'Você' : ljFirst((l.user && l.user.displayName) || 'Alguém'), lock = c.lock && !l.mine && l.page && ljMyPage(x) < l.page;
      const when = (() => { try { const d = (Date.now() - Date.parse(l.createdAt)) / 36e5; return d < 1 ? 'agora' : d < 24 ? 'há ' + Math.round(d) + ' h' : d < 48 ? 'ontem' : ljDate(l.createdAt); } catch { return ''; } })();
      html += '<span class="lj2-last"><b>' + esc(who) + ':</b> ' + (lock ? '<i>mensagem de uma parte que você ainda não leu</i>' : esc(l.text || (l.poll ? 'fez uma enquete' : ''))) + ' <span>· ' + esc(when) + '</span></span>'; }
  }
  return html + '</button><button type="button" class="lj2-more" data-ljm="' + esc(x.id) + '" aria-label="Mais opções de ' + esc(x.title) + '">•••</button></div>';
}
// convite feito no aparelho que não chegou ao servidor: enviar de novo ou descartar
function ljLocalCard(l) {
  const t = (l.e && l.e.title) || 'livro', who = l.b.handles.map((h) => '@' + h).join(', ');
  return '<div class="lj2-inv lj2-loc">' + cvh(t, ljCover(t, l.e && l.e.author, l.e), '') + '<span><b>' + esc(t) + '</b>: o convite para ' + esc(who) + ' não foi enviado<small>Ficou só neste aparelho</small></span>'
    + '<button type="button" data-ljld="' + esc(l.eid) + '">Descartar</button><button type="button" class="p" data-ljls="' + esc(l.eid) + '">Enviar de novo</button></div>';
}

function ljDraw() {
  const v = $('#shelflist'), L = ljItems(), t = S.ljTab || 'on', on = ljOn(L), inv = ljInv(L), end = ljEnd(L).sort((a, b) => String(b.closedAt).localeCompare(String(a.closedAt))), loc = ljLocal();
  const tabs = '<div class="lj2-tabs" role="tablist">' + [['on', 'Em andamento · ' + (on.length + loc.length)],['fim', 'Encerradas · ' + end.length]].map(([k, n]) => '<button type="button" role="tab" aria-selected="' + (t === k) + '" class="' + (t === k ? 'on' : '') + '" data-ljt="' + k + '">' + n + '</button>').join('') + '</div>';
  let body = '';
  if (!LJ2.items && !L.length) body = '<div class="lj2-empty">Carregando…</div>';
  else if (t === 'fim') body = end.length ? '<div class="lj2-list">' + end.map(ljCard).join('') + '</div>' : '<div class="lj2-empty">Nenhuma leitura conjunta encerrada no último ano.</div>';
  else {
    if (inv.length) body += '<div class="lj2-h">Convites <small>' + inv.length + '</small></div>' + inv.map((x) => { const from = (x.members || []).find((m) => !m.me && m.status === 'ACCEPTED');
      return '<div class="lj2-inv">' + ljCv(x) + '<span><b>' + esc(ljFirst(from ? from.displayName || from.handle : 'Alguém')) + '</b> chamou para ler <b>' + esc(x.title) + '</b><small>começa quando você aceitar</small></span><button type="button" data-ljno="' + esc(x.id) + '">Agora não</button><button type="button" class="p" data-ljok="' + esc(x.id) + '">Aceitar</button></div>'; }).join('');
    body += loc.map(ljLocalCard).join('');
    body += on.length ? '<div class="lj2-list">' + on.map(ljCard).join('') + '</div>' : (inv.length || loc.length ? '' : '<div class="lj2-empty lj2-empty-on"><b>Nenhuma leitura conjunta em andamento</b><span>Escolha um livro que você está lendo ou quer ler e convide amizades.</span><button type="button" class="lj2-big" data-ljadd>+ Ler junto</button></div>');
  }
  // topo com "+ Ler junto": nunca fica vazio, então não é recolhido (sem pulo entre desenhos)
  const tc = 'sl-top';
  v.querySelector('.sl-body').innerHTML = '<div class="' + tc + '"><button type="button" class="sl-back">‹ Voltar</button><b>Ler junto</b><button type="button" class="lj2-add" data-ljadd>+ Ler junto</button></div>' + tabs + body;
  try { paintCv(v); } catch {}
  v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
  v.querySelectorAll('[data-ljadd]').forEach((b) => b.addEventListener('click', ljPick));
  v.querySelectorAll('[data-ljt]').forEach((b) => b.addEventListener('click', () => { S.ljTab = b.dataset.ljt; ljDraw(); }));
  v.querySelectorAll('[data-lj]').forEach((b) => b.addEventListener('click', () => { const x = L.find((y) => y.id === b.dataset.lj); if (x) lj2Open(x); else ljLoad(true); }));
  v.querySelectorAll('[data-ljm]').forEach((b) => b.addEventListener('click', (ev) => { ev.stopPropagation(); const x = L.find((y) => y.id === b.dataset.ljm); if (x) ljMenu(x); }));
  v.querySelectorAll('[data-ljok]').forEach((b) => b.addEventListener('click', async () => {
    const x = L.find((y) => y.id === b.dataset.ljok); if (!x) return; b.disabled = true;
    try { const r = await sapi('POST', `/v1/buddies/${x.id}/accept`); if (r.status !== 200) throw 0; bjAddLendo({ title: x.title, author: x.author }); toast('Leitura conjunta de “' + x.title + '” começou'); await bjSync(); await ljLoad(true); }
    catch { b.disabled = false; toast('Não consegui aceitar agora', { label: 'Repetir', fn: () => b.click() }); }
  }));
  v.querySelectorAll('[data-ljno]').forEach((b) => b.addEventListener('click', async () => {
    const x = L.find((y) => y.id === b.dataset.ljno); if (!x) return; b.disabled = true;
    try { const r = await sapi('POST', `/v1/buddies/${x.id}/decline`); if (r.status !== 200) throw 0; toast('Convite recusado'); await bjSync(); await ljLoad(true); }
    catch { b.disabled = false; toast('Não consegui recusar agora', { label: 'Repetir', fn: () => b.click() }); }
  }));
  v.querySelectorAll('[data-ljls]').forEach((b) => b.addEventListener('click', async () => {
    const id = b.dataset.ljls; b.disabled = true; await ljFlush();
    if (ljLocal().some((l) => l.eid === id)) { b.disabled = false; toast('Ainda não deu para enviar', { label: 'Repetir', fn: () => b.click() }); } else toast('Convite enviado');
  }));
  v.querySelectorAll('[data-ljld]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.ljld, B = T().buddy || {}, keep = B[id]; if (!keep) return ljDraw();
    delete B[id]; T().buddy = B; save(); ljDraw();
    toast('Convite descartado', { label: 'Desfazer', fn: () => { const C = T().buddy || {}; C[id] = keep; T().buddy = C; save(); ljDraw(); } });
  }));
}
// "+ Ler junto": escolhe um livro de Lendo ou Quero ler e abre o convite que já existe (inviteBuddy)
function ljPick() {
  const busy = new Set(ljOn(ljItems()).map((x) => x.bookKey)), st = (e) => (e.status === 'LENDO' ? 0 : 1);
  const L = lib().filter((e) => e.status === 'LENDO' || e.status === 'QUERO').sort((a, b) => st(a) - st(b) || (a.prio || 2) - (b.prio || 2)).slice(0, 40);
  if (!L.length) return toast('Coloque um livro em Lendo ou Quero ler para chamar alguém', { label: 'Buscar livro', fn: () => { try { goTab('buscar', true); } catch {} } });
  sheetList('Ler junto qual livro?', L.map((e) => ({ label: esc(e.title), sub: (e.status === 'LENDO' ? 'Lendo' : 'Quero ler') + (busy.has(bookKey(e)) ? ' · já tem leitura conjunta' : ''), fn: () => { try { inviteBuddy(e); } catch { toast('Não consegui abrir o convite', { label: 'Repetir', fn: ljPick }); } } })));
}
function openJuntos() {
  const v = $('#shelflist'); try { closeEd(); } catch {} v.classList.remove('feedview', 'tabroot', 'mine-page'); v.classList.add('v4inner');
  S.listRedraw = ljDraw; ljDraw(); v.hidden = false; v.scrollTop = 0; try { syncTopTitle(); } catch {}
  if (ljLocal().length) ljFlush(); else ljLoad(true);
}
// reenvia os convites que ficaram só no aparelho (ao abrir a tela e no "Enviar de novo")
async function ljFlush() {
  try { if (connected() && typeof flushLocalInvites === 'function') await flushLocalInvites(); } catch {}
  await bjSync(); await ljLoad(true); if (S.listRedraw === ljDraw) ljDraw();
}
// carrega em segundo plano quando o perfil próprio aparece, para o resumo do atalho
{ let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; if (TR.querySelector('.v3hub-lj')) { ljPaintSummary(); if (!LJ2.items || Date.now() - LJ2.at > 60000) ljLoad(); } }, 400); }).observe(TR, { childList: true, subtree: true }); }
