// Todas as leituras conjuntas (Bia, 21/11; protótipo v158 aprovado): atalho "Ler junto · N em andamento · N novas" em
// Você › Minha leitura, em largura cheia, e uma página com as abas "Em andamento | Encerradas".
// - Convites recebidos no topo de Em andamento (Aceitar / Agora não).
// - Cartão por leitura: capa, quem participa, progresso de cada pessoa em % (é social: sempre %), mensagens novas e a última mensagem.
//   Mensagem de página à frente da sua aparece coberta (não estraga a leitura). "Novas" = mensagens de outras pessoas desde a
//   última vez que você abriu aquela leitura (guardado no aparelho em lv.ljSeen).
// - Encerradas: as que fecharam no último ano (regra da API), com a data.
// - Tocar no cartão abre a página da leitura conjunta que já existe (openBuddyPage).
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
`; TR.append(st); }

const ljSeenGet = () => { try { return JSON.parse(localStorage.getItem('lv.ljSeen') || '{}') || {}; } catch { return {}; } };
const ljSeenSet = (id) => { const s = ljSeenGet(); s[id] = new Date().toISOString(); try { localStorage.setItem('lv.ljSeen', JSON.stringify(s)); } catch {} };
const ljItems = () => (LJ2.items || (SOC && SOC.buddies) || []);
const ljOn = (L) => L.filter((x) => !x.closedAt && x.myStatus === 'ACCEPTED');
const ljInv = (L) => L.filter((x) => !x.closedAt && x.myStatus === 'INVITED');
const ljEnd = (L) => L.filter((x) => !!x.closedAt);
const ljNew = (x) => { const c = LJ2.last[x.id]; return c ? c.unread || 0 : 0; };
const ljPctOf = (m) => Math.max(0, Math.min(100, Math.round(m.finished ? 100 : (m.pct || 0))));
const ljDate = (d) => { try { return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); } catch { return ''; } };
const ljFirst = (n) => String(n || '').split(' ')[0];

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
if (typeof openBuddyPage === 'function') { const _o = openBuddyPage; openBuddyPage = function (e) {
  try { const bm = (SOC.buddyMap || {})[e && e.id]; if (bm && bm.id) { ljSeenSet(bm.id); if (LJ2.last[bm.id]) LJ2.last[bm.id].unread = 0; } } catch {}
  return _o.apply(this, arguments);
}; }

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
  const sub = end ? (others.join(', ') + ' · encerrada em ' + ljDate(x.closedAt) + (x.avgPaws ? ' · média ★' + String(x.avgPaws).replace('.', ',') : ''))
    : (others.join(', ') || 'esperando quem você convidou') + (fin ? ' · ' + fin + (fin === 1 ? ' terminou' : ' terminaram') : '');
  let html = '<button type="button" class="lj2-card' + (end ? ' lj2-end' : '') + '" data-lj="' + esc(x.id) + '"><span class="lj2-top">' + cvh(x.title, null, '') + '<span class="lj2-tx"><b>' + esc(x.title) + '</b><small>' + esc(sub) + '</small></span>'
    + (nw ? '<span class="lj2-new" aria-label="' + nw + ' mensagens novas">' + nw + '</span>' : '') + '</span>';
  if (!end) {
    html += '<span class="lj2-ppl">' + M.filter((m) => m.status === 'ACCEPTED').map((m) => { const nm = m.me ? 'Você' : ljFirst(m.displayName || m.handle), p = ljPctOf(m);
      return '<span class="lj2-p' + (m.me ? ' eu' : '') + '"><span class="av" style="background:' + (m.me ? 'var(--ink)' : friendColor(m.handle || nm)) + ';' + (m.me ? 'color:var(--bg,#fff)' : '') + '">' + esc(initial(nm)) + '</span><span class="nm">' + esc(nm) + (m.finished ? ' ✓' : '') + '</span><span class="lj2-bar"><i style="width:' + p + '%"></i></span><em>' + p + '%</em></span>'; }).join('') + '</span>';
    const c = LJ2.last[x.id], l = c && c.last;
    if (l) { const who = l.mine ? 'Você' : ljFirst((l.user && l.user.displayName) || 'Alguém'), lock = c.lock && !l.mine && l.page && ljMyPage(x) < l.page;
      const when = (() => { try { const d = (Date.now() - Date.parse(l.createdAt)) / 36e5; return d < 1 ? 'agora' : d < 24 ? 'há ' + Math.round(d) + ' h' : d < 48 ? 'ontem' : ljDate(l.createdAt); } catch { return ''; } })();
      html += '<span class="lj2-last"><b>' + esc(who) + ':</b> ' + (lock ? '<i>mensagem de uma parte que você ainda não leu</i>' : esc(l.text || (l.poll ? 'fez uma enquete' : ''))) + ' <span>· ' + esc(when) + '</span></span>'; }
  }
  return html + '</button>';
}

function ljDraw() {
  const v = $('#shelflist'), L = ljItems(), t = S.ljTab || 'on', on = ljOn(L), inv = ljInv(L), end = ljEnd(L).sort((a, b) => String(b.closedAt).localeCompare(String(a.closedAt)));
  const tabs = '<div class="lj2-tabs" role="tablist">' + [['on', 'Em andamento · ' + on.length], ['fim', 'Encerradas · ' + end.length]].map(([k, n]) => '<button type="button" role="tab" aria-selected="' + (t === k) + '" class="' + (t === k ? 'on' : '') + '" data-ljt="' + k + '">' + n + '</button>').join('') + '</div>';
  let body = '';
  if (!LJ2.items && !L.length) body = '<div class="lj2-empty">Carregando…</div>';
  else if (t === 'fim') body = end.length ? '<div class="lj2-list">' + end.map(ljCard).join('') + '</div>' : '<div class="lj2-empty">Nenhuma leitura conjunta encerrada no último ano.</div>';
  else {
    if (inv.length) body += '<div class="lj2-h">Convites <small>' + inv.length + '</small></div>' + inv.map((x) => { const from = (x.members || []).find((m) => !m.me && m.status === 'ACCEPTED');
      return '<div class="lj2-inv">' + cvh(x.title, null, '') + '<span><b>' + esc(ljFirst(from ? from.displayName || from.handle : 'Alguém')) + '</b> chamou para ler <b>' + esc(x.title) + '</b><small>começa quando você aceitar</small></span><button type="button" data-ljno="' + esc(x.id) + '">Agora não</button><button type="button" class="p" data-ljok="' + esc(x.id) + '">Aceitar</button></div>'; }).join('');
    body += on.length ? '<div class="lj2-list">' + on.map(ljCard).join('') + '</div>' : (inv.length ? '' : '<div class="lj2-empty">Nenhuma leitura conjunta em andamento.</div>');
    body += '<p class="lj2-tip">Para começar uma leitura junto, toque em Ler junto no livro ou no perfil de uma amizade.</p>';
  }
  v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Ler junto</b><span></span></div>' + tabs + body;
  try { paintCv(v); } catch {}
  v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
  v.querySelectorAll('[data-ljt]').forEach((b) => b.addEventListener('click', () => { S.ljTab = b.dataset.ljt; ljDraw(); }));
  v.querySelectorAll('[data-lj]').forEach((b) => b.addEventListener('click', () => {
    const x = L.find((y) => y.id === b.dataset.lj); if (!x) return; const e = bjEntry(x);
    if (!e) return toast('Este livro não está mais na sua Biblioteca');
    ljSeenSet(x.id); if (LJ2.last[x.id]) LJ2.last[x.id].unread = 0;
    if (!(SOC.buddyMap || {})[e.id]) { try { mapBuddies(); } catch {} }
    openBuddyPage(e);
  }));
  v.querySelectorAll('[data-ljok]').forEach((b) => b.addEventListener('click', async () => {
    const x = L.find((y) => y.id === b.dataset.ljok); if (!x) return; b.disabled = true;
    try { const r = await sapi('POST', `/v1/buddies/${x.id}/accept`); if (r.status !== 200) throw 0; bjAddLendo({ title: x.title, author: x.author }); toast('Leitura conjunta de “' + x.title + '” começou'); await bjSync(); await ljLoad(true); }
    catch { b.disabled = false; toast('Não consegui aceitar agora'); }
  }));
  v.querySelectorAll('[data-ljno]').forEach((b) => b.addEventListener('click', async () => {
    const x = L.find((y) => y.id === b.dataset.ljno); if (!x) return; b.disabled = true;
    try { const r = await sapi('POST', `/v1/buddies/${x.id}/decline`); if (r.status !== 200) throw 0; toast('Convite recusado'); await bjSync(); await ljLoad(true); }
    catch { b.disabled = false; toast('Não consegui recusar agora'); }
  }));
}
function openJuntos() {
  const v = $('#shelflist'); try { closeEd(); } catch {} v.classList.remove('feedview', 'tabroot', 'mine-page');
  S.listRedraw = ljDraw; ljDraw(); v.hidden = false; v.scrollTop = 0; try { syncTopTitle(); } catch {}
  ljLoad(true);
}
// carrega em segundo plano quando o perfil próprio aparece, para o resumo do atalho
{ let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; if (TR.querySelector('.v3hub-lj')) { ljPaintSummary(); if (!LJ2.items || Date.now() - LJ2.at > 60000) ljLoad(); } }, 400); }).observe(TR, { childList: true, subtree: true }); }
