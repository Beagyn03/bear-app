// Pedidos para entrar no grupo de leitura conjunta (Bia, 20/11; API 036; protótipo: Avisos com Recusar / Aceitar no alto).
// Quem já está no grupo vê cada pedido com Recusar / Aceitar em três lugares: Avisos (no alto, junto com os convites de
// leitura conjunta, que antes só apareciam no Hoje), no Hoje (mesma faixa dos convites) e na página Lendo junto do livro.
// Dados: GET /v1/buddies (items[].requests), que a sincronização social já busca.
{ const st = document.createElement('style'); st.textContent = `
.v8ask{display:grid;gap:.45rem;margin:.2rem 0 .7rem}
.v8ask .v8it{display:grid;grid-template-columns:auto 1fr;gap:.2rem .6rem;align-items:center;border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);padding:.6rem .7rem;font-size:.86rem}
.v8ask .v8it p{margin:0;line-height:1.35;min-width:0}.v8ask .v8it small{display:block;color:var(--ink-2);font-size:.74rem;margin-top:.1rem}
.v8ask .v8bt{grid-column:1/-1;display:flex;gap:.5rem;justify-content:flex-end}
.v8ask .v8bt button{min-height:36px;border-radius:99px;border:1px solid var(--line);background:none;color:var(--ink);font:inherit;font-weight:800;font-size:.82rem;padding:0 .9rem}
.v8ask .v8bt button.ok{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.v8ask .v8sec{font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin:.2rem 0 0}
`; TR.append(st); }
const v8Buds = () => (Array.isArray(SOC.buddies) ? SOC.buddies : []);
const v8First = (s) => String(s || 'Alguém').split(' ')[0];
const v8Av = (h, n) => `<span class="av sm" ${h ? `data-avh="${esc(h)}"` : ''} style="background:${friendColor(h || n || '')}">${esc(initial(n))}</span>`;
function v8ReqItems(onlyRead) {
  const out = [];
  for (const r of v8Buds()) {
    if (r.myStatus !== 'ACCEPTED' || r.closedAt || (onlyRead && r.id !== onlyRead)) continue;
    const n = (r.members || []).filter((m) => m.status === 'ACCEPTED').length;
    for (const q of r.requests || []) out.push(`<div class="v8it" data-jr="${esc(q.id)}" data-r="${esc(r.id)}">${v8Av(q.handle, q.displayName)}<p><b>${esc(v8First(q.displayName))}</b> quer entrar na leitura de <b>${esc(r.title)}</b><small>${onlyRead ? '@' + esc(q.handle || '') + ' · ' : ''}grupo com ${n} ${n === 1 ? 'pessoa' : 'pessoas'} · ${esc(relTime(q.createdAt))}</small></p><div class="v8bt"><button type="button" data-v8="no">Recusar</button><button type="button" class="ok" data-v8="ok">Aceitar</button></div></div>`);
  }
  return out;
}
function v8InvItems() {
  return v8Buds().filter((r) => r.myStatus === 'INVITED').map((r) => { const o = (r.members || []).find((m) => m.status === 'ACCEPTED' && !m.me) || {};
    return `<div class="v8it" data-bi="${esc(r.id)}">${v8Av(o.handle, o.displayName)}<p><b>${esc(v8First(o.displayName))}</b> te convidou para ler junto<small>${esc(r.title)}</small></p><div class="v8bt"><button type="button" data-v8="no">Recusar</button><button type="button" class="ok" data-v8="ok">Aceitar</button></div></div>`; });
}
async function v8Act(btn) {
  const it = btn.closest('.v8it'); if (!it || it.dataset.busy) return; it.dataset.busy = 1; const ok = btn.dataset.v8 === 'ok';
  try {
    if (it.dataset.jr) {
      const r = await sapi('POST', `/v1/buddies/${it.dataset.r}/join-requests/${it.dataset.jr}/${ok ? 'accept' : 'decline'}`);
      if (r.status >= 300) { delete it.dataset.busy; return toast(r.data && r.data.error === 'FULL' ? 'O grupo já está cheio' : 'Não consegui agora'); }
      const g = v8Buds().find((x) => x.id === it.dataset.r); const q = g && (g.requests || []).find((x) => x.id === it.dataset.jr);
      if (g) g.requests = (g.requests || []).filter((x) => x.id !== it.dataset.jr);
      toast(ok ? `${v8First(q && q.displayName)} entrou no grupo` : 'Pedido recusado');
    } else if (it.dataset.bi) {
      const id = it.dataset.bi, r0 = v8Buds().find((x) => x.id === id);
      const r = await sapi('POST', `/v1/buddies/${id}/${ok ? 'accept' : 'decline'}`); if (r.status !== 200) { delete it.dataset.busy; return toast('Não consegui agora'); }
      if (ok && r0 && !lib().some((e) => bookKey(e) === r0.bookKey)) addToLibrary({ title: r0.title, author: r0.author || null, totalPages: r0.totalPages || null, cover: null }, null, 'LENDO');
      if (r0) r0.myStatus = ok ? 'ACCEPTED' : 'DECLINED';
      toast(ok ? `Leitura conjunta de “${r0 ? r0.title : ''}” aceita` : 'Convite recusado');
    }
    it.remove(); try { syncSocial3(true); } catch {}
  } catch { delete it.dataset.busy; toast('Não consegui agora'); }
}
// 1) Hoje: pedidos na mesma faixa dos convites
{ const _ih = invitesHTML; invitesHTML = function () {
    const h = _ih.apply(this, arguments), rq = v8ReqItems();
    return rq.length ? h + `<div class="v8ask v8hoje">${rq.join('')}</div>` : h; };
  const _bi = bindInvites; bindInvites = function (box) { const r = _bi.apply(this, arguments);
    $$('.v8hoje [data-v8]', box).forEach((b) => b.addEventListener('click', (ev) => { ev.stopPropagation(); v8Act(b); })); return r; }; }
// 2) Avisos: convites e pedidos no alto, com resposta
function v8AvPut() { const ed = $('#editor');
    if (ed.hidden || !ed.classList.contains('ntpage')) return; const body = ed.querySelector('.ed-body'), list = body && body.querySelector('.nt-list'); if (!list) return;
    const items = [...v8InvItems(), ...v8ReqItems()], sig = items.join('');
    let box = body.querySelector(':scope > .v8ask, .v8ask.v8av');
    if (!items.length) { if (box) box.remove(); return; }
    if (box && box.dataset.sig === sig) return;
    if (!box) { box = document.createElement('div'); box.className = 'v8ask v8av'; box.addEventListener('click', (ev) => { const b = ev.target.closest('[data-v8]'); if (b) { ev.stopPropagation(); v8Act(b); } }); }
    box.dataset.sig = sig; box.innerHTML = `<div class="v8sec">Leitura conjunta</div>${items.join('')}`;
    if (box.nextElementSibling !== list) list.before(box);
    const empty = list.querySelector('.nt-empty'); if (empty) empty.hidden = true;
}
{ const ed = $('#editor'); let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { v8AvPut(); } catch {} }, 40); }).observe(ed, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] }); }
// 3) Página Lendo junto: pedidos daquele grupo logo abaixo do cabeçalho
function v8BjPut() { const v = $('#shelflist');
    if (v.hidden) return; const head = v.querySelector('.bj-head'); if (!head) return;
    const t = (head.querySelector('b') || {}).textContent || ''; const r = v8Buds().find((x) => x.myStatus === 'ACCEPTED' && !x.closedAt && normT(x.title || '') === normT(t));
    const items = r ? v8ReqItems(r.id) : [], sig = items.join(''); let box = v.querySelector('.v8ask.v8bj');
    if (!items.length) { if (box) box.remove(); return; }
    if (box && box.dataset.sig === sig && box.previousElementSibling === head) return;
    if (!box) { box = document.createElement('div'); box.className = 'v8ask v8bj'; box.addEventListener('click', (ev) => { const b = ev.target.closest('[data-v8]'); if (b) { ev.stopPropagation(); v8Act(b); } }); }
    box.dataset.sig = sig; box.innerHTML = `<div class="v8sec">Pedidos para entrar</div>${items.join('')}`;
    if (box.previousElementSibling !== head) head.after(box);
}
{ const v = $('#shelflist'); let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { v8BjPut(); } catch {} }, 60); }).observe(v, { childList: true, subtree: true }); }
// a lista de leituras conjuntas muda (pedido novo, aceito): redesenha o que estiver aberto
{ const _mb = mapBuddies; mapBuddies = function () { const r = _mb.apply(this, arguments);
    const sig = JSON.stringify(v8Buds().map((x) => [x.id, x.myStatus, (x.requests || []).map((q) => q.id)]));
    if (sig !== S.v8sig) { S.v8sig = sig; try { v8AvPut(); } catch {} try { v8BjPut(); } catch {} }
    return r; }; }
