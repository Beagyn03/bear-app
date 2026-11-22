// Leitura conjunta e próxima leitura (Bia, 21/11; API 041 e d3f985b):
// 1. Quem termina continua no grupo, com "terminou ✓" ao lado do nome; sai só pelo "Sair".
// 2. Encerra quando todo mundo terminou ou saiu, quando quem criou encerra ("Encerrar leitura conjunta") ou depois de 60 dias
//    sem atividade (a API calcula). Encerrada, a conversa continua aberta e SEM trava de spoiler, e o app sugere votar o próximo livro.
// 3. Enquete de livros encerrada: quem criou vê "Começar este livro juntos" (grupo novo por convite; entra só quem aceitar);
//    na enquete aparece "Próxima leitura: <livro> · Entrar" para quem foi convidado.
// 4. Avisos "enquete encerrou" e "próxima leitura" (user_notices poll_closed / next_read) viram itens em Avisos › Notificações.
const BJ = { info: {}, closed: {}, cur: null, notes: [] };
{ const st = document.createElement('style'); st.textContent = `
.bj-ended{margin:.55rem 0 .2rem;padding:.7rem .8rem;border:1px solid var(--line);border-radius:14px;background:color-mix(in srgb,var(--acc) 8%,var(--panel));display:grid;gap:.45rem}
.bj-ended b{font-size:.95rem}.bj-ended small{color:var(--ink-2);font-weight:600;font-size:.8rem;line-height:1.35}
.bj-ended button,.bj-sug button{justify-self:start;min-height:40px;padding:0 .9rem;border:1px solid var(--acc);border-radius:99px;background:none;color:var(--acc);font:inherit;font-weight:800;cursor:pointer}
.bj-people{display:flex;flex-wrap:wrap;gap:.35rem .5rem;margin:.35rem 0 .1rem}
.bj-people span{display:inline-flex;align-items:center;gap:.3rem;min-height:28px;padding:0 .6rem;border:1px solid var(--line);border-radius:99px;font-size:.78rem;font-weight:700;color:var(--ink-2)}
.bj-people span.fin{border-color:color-mix(in srgb,var(--acc) 55%,var(--line));color:var(--ink)}
.bj-sug{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .6rem;margin:.3rem 0 .4rem;font-size:.82rem;font-weight:700;color:var(--ink-2)}
.lvpl-nx{display:flex;flex-wrap:wrap;align-items:center;gap:.3rem .6rem;font-size:.84rem;font-weight:800}
.lvpl-nx button{min-height:40px;padding:0 .9rem;border:0;border-radius:99px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;cursor:pointer}
.lvpl-nx button.sec{background:none;border:1px solid var(--acc);color:var(--acc)}
.bjnt{display:flex;gap:.7rem;align-items:flex-start;width:100%;text-align:left;padding:.75rem .8rem;margin:0 0 .5rem;border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);font:inherit;cursor:pointer}
.bjnt .ic{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:color-mix(in srgb,var(--acc) 15%,transparent);color:var(--acc)}
.bjnt b{display:block;font-size:.9rem}.bjnt small{display:block;color:var(--ink-2);font-weight:600;font-size:.78rem;margin-top:.15rem}
`; TR.append(st); }

const bjEntry = (r) => { try { return lib().find((x) => bookKey(x) === r.bookKey) || null; } catch { return null; } };
const bjSync = async () => { try { if (typeof syncSocial3 === 'function') await syncSocial3(true); } catch {} };
const bjAddLendo = (bk) => {
  if (!bk || !bk.title) return;
  try { const has = lib().find((x) => normT(x.title) === normT(bk.title)); if (has) return; addToLibrary({ title: bk.title, author: bk.author || null, cover: bk.cover || null }, null, 'LENDO', {}); } catch {}
};

// o que a API diz sobre cada leitura conjunta (dona, encerrada, quem terminou) e sobre a conversa (encerrada = sem trava)
{ const _s = sapi; sapi = async function (method, path, body) {
  const r = await _s.call(this, method, path, body);
  try {
    const M = String(method).toUpperCase(), P = String(path || '');
    if (M === 'GET' && P === '/v1/buddies' && r && r.status === 200 && r.data) (r.data.items || []).forEach((x) => { BJ.info[x.id] = x; });
    const m = M === 'GET' && /^\/v1\/buddies\/([^/?]+)\/posts$/.exec(P);
    if (m && r && r.status === 200 && r.data) {
      BJ.closed[m[1]] = !!r.data.closed;
      // encerrada: todo mundo chegou ao fim ou saiu, então nada fica coberto (a página continua como informação)
      if (r.data.closed) (r.data.items || []).forEach((c) => { if (c.page) { c.pageWas = c.page; c.page = null; } });
    }
    if (M === 'GET' && /^\/v1\/me\/moderation(\?|$)/.test(P) && r && r.status === 200 && r.data && Array.isArray(r.data.notices)) {
      const mine = r.data.notices.filter((n) => n && (n.kind === 'poll_closed' || n.kind === 'next_read'));
      if (mine.length) { BJ.notes = mine; r.data.notices = r.data.notices.filter((n) => !n || (n.kind !== 'poll_closed' && n.kind !== 'next_read')); }
    }
  } catch {}
  return r;
}; }

// encerradas continuam abrindo (conversa aberta); quem terminou fica marcado
if (typeof mapBuddies === 'function') { const _mb = mapBuddies; mapBuddies = function () {
  _mb.apply(this, arguments);
  try {
    for (const r of SOC.buddies || []) {
      const e = bjEntry(r); if (!e || r.myStatus !== 'ACCEPTED') continue;
      if (r.closedAt && !SOC.buddyMap[e.id]) {
        const acc = r.members.filter((x) => !x.me && x.status === 'ACCEPTED');
        SOC.buddyMap[e.id] = { status: 'ACEITO', id: r.id, closed: true, people: acc.map((x) => ({ displayName: x.displayName, handle: x.handle, pct: x.pct })) };
      }
      const mp = SOC.buddyMap[e.id]; if (!mp || mp.id !== r.id) continue;
      mp.own = !!r.own; mp.closed = !!r.closedAt;
      (mp.people || []).forEach((p) => { const x = r.members.find((y) => y.handle === p.handle); if (x) p.finished = !!x.finished; });
      mp.meFinished = !!((r.members.find((x) => x.me) || {}).finished);
    }
  } catch {}
}; }

if (typeof openBuddyPage === 'function') { const _ob = openBuddyPage; openBuddyPage = function (e) { BJ.cur = e; return _ob.apply(this, arguments); }; }
const bjCurMap = () => { const e = BJ.cur; return e && SOC.buddyMap ? SOC.buddyMap[e.id] || null : null; };

// página da leitura conjunta: encerrada, quem terminou e sugestão de votar o próximo livro
new MutationObserver(() => {
  const v = TR.querySelector('#shelflist:not([hidden])'); if (!v) return;
  const head = v.querySelector('.bj-head'); if (!head) return;
  const mp = bjCurMap(); if (!mp) return;
  const closed = !!(mp.closed || BJ.closed[mp.id]);
  const meFin = !!mp.meFinished || (BJ.cur && BJ.cur.status === 'LIDO');
  const sig = [mp.id, closed, meFin, (mp.people || []).map((p) => p.handle + (p.finished ? 1 : 0)).join(',')].join('|');
  if (head.dataset.bjr === sig && v.querySelector('.bj-people')) return;
  head.dataset.bjr = sig;
  v.querySelectorAll('.bj-ended,.bj-people,.bj-sug').forEach((n) => n.remove());
  const ppl = [{ name: 'Você', fin: meFin }, ...(mp.people || []).map((p) => ({ name: String(p.displayName || p.handle || '').split(' ')[0], fin: !!p.finished, pct: p.pct }))];
  const pe = document.createElement('div'); pe.className = 'bj-people';
  pe.innerHTML = ppl.map((p) => `<span class="${p.fin ? 'fin' : ''}">${esc(p.name)}${p.fin ? ' · terminou ✓' : p.pct != null ? ` · ${p.pct}%` : ''}</span>`).join('');
  (v.querySelector('.bj-track') || head).after(pe);
  if (closed) {
    const en = document.createElement('div'); en.className = 'bj-ended'; en.setAttribute('role', 'status');
    en.innerHTML = '<b>Leitura conjunta encerrada</b><small>A conversa continua aberta e sem trava de spoiler: todo mundo chegou ao fim ou saiu.</small><button type="button" data-bjvote>Votar o próximo livro</button>';
    head.after(en);
  } else if (ppl.some((p) => p.fin)) {
    const cp = v.querySelector('.bj-compose');
    if (cp) { const sg = document.createElement('div'); sg.className = 'bj-sug'; sg.innerHTML = `<span>${meFin ? 'Você terminou.' : 'Alguém já terminou.'} Que tal votar o próximo livro?</span>`; cp.before(sg); }
  }
}).observe(TR, { childList: true, subtree: true });
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('[data-bjvote]'); if (!b) return;
  const v = TR.querySelector('#shelflist:not([hidden])'); const pb = v && v.querySelector('.bj-poll');
  if (pb) pb.click(); else if (typeof plBuddyEditor === 'function' && v) plBuddyEditor(v);
}, true);

// ••• da leitura conjunta: "Encerrar leitura conjunta" para quem criou
{ const _pm = popMenu; popMenu = function (anchor, items) {
  try {
    if (anchor && anchor.id === 'bj-more') {
      const mp = bjCurMap();
      if (mp && mp.own && !(mp.closed || BJ.closed[mp.id]) && Array.isArray(items) && !items.some((x) => x && x.label === 'Encerrar leitura conjunta')) {
        const i = items.findIndex((x) => x === 0);
        const it = { label: 'Encerrar leitura conjunta', fn: () => sheet('Encerrar a leitura conjunta?', [['Encerrar', async () => {
          try { const r = await sapi('POST', `/v1/buddies/${mp.id}/close`); if (r.status !== 200) throw 0; mp.closed = true; BJ.closed[mp.id] = true; toast('Leitura conjunta encerrada. A conversa continua aberta.'); await bjSync(); if (BJ.cur) openBuddyPage(BJ.cur); } catch { toast('Não consegui encerrar agora'); }
        }], ['Cancelar', () => {}]]) };
        items = i >= 0 ? [...items.slice(0, i), it, ...items.slice(i)] : [...items, it];
      }
    }
  } catch {}
  return _pm.call(this, anchor, items);
}; }

// enquete: "Começar este livro juntos" e "Próxima leitura · Entrar"
if (typeof plHTML === 'function') { const _ph = plHTML; plHTML = function (p) {
  let h = _ph.apply(this, arguments); if (!p || !p.options) return h;
  const w = p.closed && p.options.find((o) => o.winner);
  let extra = '';
  if (p.next) {
    extra = `<div class="lvpl-nx">Próxima leitura: ${esc(p.next.title)}${p.next.myStatus === 'INVITED' ? ` <button type="button" data-pljoin="${esc(p.next.id)}" data-plt="${esc(p.next.title)}">Entrar</button>` : p.next.myStatus === 'ACCEPTED' ? ' · você está nela' : ''}</div>`;
  } else if (p.canStartNext && w && w.book) {
    extra = `<div class="lvpl-nx"><button type="button" data-plnext="${esc(p.id)}">Começar este livro juntos</button></div>`;
  }
  if (!extra) return h;
  const i = h.lastIndexOf('</div>'); return i > 0 ? h.slice(0, i) + extra + h.slice(i) : h + extra;
}; }
TR.addEventListener('click', (ev) => {
  const b = ev.composedPath().find((n) => n instanceof Element && n.matches('[data-plnext],[data-pljoin]')); if (!b) return;
  ev.stopPropagation(); ev.preventDefault();
  if (b.dataset.plnext) {
    const p = PL_CACHE[b.dataset.plnext]; const w = p && p.options.find((o) => o.winner); if (!w || !w.book) return;
    return sheet(`Começar “${w.book.title}” juntos?`, [[ 'Começar', async () => {
      try {
        const r = await sapi('POST', `/v1/polls/${p.id}/next`);
        if (r.status !== 201 && r.status !== 200) throw 0;
        bjAddLendo(w.book);
        toast(r.data && r.data.invited ? 'Convite enviado para o grupo. Entra quem aceitar.' : 'Próxima leitura criada');
        const g = await sapi('GET', `/v1/polls/${p.id}`); if (g.status === 200 && g.data) plRefresh(g.data);
        await bjSync();
      } catch { toast('Não consegui começar agora'); }
    }], ['Cancelar', () => {}]]);
  }
  if (b.dataset.pljoin) {
    const id = b.dataset.pljoin, t = b.dataset.plt || '';
    return sheet(`Entrar na próxima leitura${t ? ` de “${t}”` : ''}?`, [['Entrar', async () => {
      try {
        const r = await sapi('POST', `/v1/buddies/${id}/accept`); if (r.status !== 200) throw 0;
        const src = Object.values(PL_CACHE).find((x) => x && x.next && x.next.id === id); const w = src && src.options.find((o) => o.winner);
        bjAddLendo(w && w.book ? w.book : { title: t });
        toast('Você entrou na próxima leitura');
        if (src) { const g = await sapi('GET', `/v1/polls/${src.id}`); if (g.status === 200 && g.data) plRefresh(g.data); }
        await bjSync();
      } catch { toast('Não consegui entrar agora'); }
    }], ['Agora não', () => {}]]);
  }
}, true);

// Avisos › Notificações: enquete encerrou e próxima leitura (só sobre a pessoa)
new MutationObserver(() => {
  if (!BJ.notes.length) return; const L = TR.querySelector('#editor.ntpage .nt-list'); if (!L || L.querySelector('.bjnt')) return;
  BJ.notes.slice().reverse().forEach((n) => {
    const w = document.createElement('button'); w.type = 'button'; w.className = 'bjnt';
    w.innerHTML = `<span class="ic" aria-hidden="true">${v4ic(n.kind === 'next_read' ? 'friends' : 'stats', 18)}</span><span><b>${esc(n.title || '')}</b>${n.body ? `<small>${esc(n.body)}</small>` : ''}</span>`;
    w.addEventListener('click', async () => {
      try { await sapi('POST', '/v1/me/notices/seen', { ids: [n.id] }); } catch {}
      BJ.notes = BJ.notes.filter((x) => x.id !== n.id); w.remove();
      const ref = n.ref || {};
      try {
        if (n.kind === 'next_read' && ref.buddyId) {
          const info = BJ.info[ref.buddyId] || (SOC.buddies || []).find((x) => x.id === ref.buddyId);
          return sheet(`Entrar na próxima leitura${info ? ` de “${info.title}”` : ''}?`, [['Entrar', async () => {
            const r = await sapi('POST', `/v1/buddies/${ref.buddyId}/accept`); if (r.status !== 200) return toast('Não consegui entrar agora');
            if (info) bjAddLendo({ title: info.title, author: info.author }); toast('Você entrou na próxima leitura'); await bjSync();
          }], ['Agora não', () => {}]]);
        }
        if (ref.buddyId) { const r = (SOC.buddies || []).find((x) => x.id === ref.buddyId); const e = r && bjEntry(r); if (e) return openBuddyPage(e); }
        goTab('comunidade');
      } catch { try { goTab('comunidade'); } catch {} }
    });
    L.prepend(w);
  });
}).observe(TR, { childList: true, subtree: true });
