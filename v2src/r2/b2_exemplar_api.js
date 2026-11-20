// Meu exemplar, fase 2 (Bia, 19/11): o empréstimo vai para o servidor (a amiga vê "peguei emprestado de @você" na estante dela e
// os dois recebem lembrete no celular no dia da devolução); "Vou dar de presente" na lista Quero ter da amizade, em segredo para a dona.
{ const st = document.createElement('style'); st.textContent = `
.ex-wish .t5-bk{position:relative}
.ex-gift{display:block;width:100%;margin-top:.25rem;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.2rem .3rem;font:inherit;font-size:.64rem;font-weight:900;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ex-gift.mine{border-color:#2e9b5a;color:#2e9b5a;background:color-mix(in srgb,#2e9b5a 10%,var(--panel))}.ex-gift.taken{opacity:.6;cursor:default}
.ex-wish .ex-gw{display:inline-grid;gap:0;vertical-align:top}
`; TR.append(st); }
const exKey = (t) => normT(t || '').replace(/[^a-z0-9]/g, '');
// empréstimo: manda ao servidor quando muda (registrar, mudar, devolveram)
function exApiLoan(e) {
  try { if (!e || !connected()) return; const x = e.ex || {}, L = x.loan;
    const k = L ? JSON.stringify([L.to && (L.to.h || L.to.n), L.at, L.due || '']) : '';
    if (k === (x.loanSync || '')) return;
    if (L) sapi('PUT', '/v1/loans', { libId: String(e.id), title: String(e.title).slice(0, 300), author: e.author || null, cover: e.cover && !/^data:/.test(e.cover) && String(e.cover).length < 600 ? e.cover : null, ...(L.to && L.to.h ? { toHandle: L.to.h } : { toName: String(exName(L.to)).slice(0, 40) }), at: L.at, due: L.due || null })
      .then((r) => { if (r && r.status < 300) { e.ex.loanSync = k; save(); } }).catch(() => {});
    else sapi('POST', '/v1/loans/' + encodeURIComponent(String(e.id)) + '/return', {}).then((r) => { if (r && r.status < 300) { if (e.ex) { delete e.ex.loanSync; save(); } } }).catch(() => {});
  } catch {} }
// sincroniza ao abrir o app (empréstimos registrados sem internet)
setTimeout(() => { try { lib().forEach((e) => { const x = e.ex; if (x && (x.loan || x.loanSync)) exApiLoan(e); }); } catch {} }, 6000);
// o que me emprestaram pelo app: entra na minha estante como "peguei emprestado"; quando a dona marca a devolução, sai
async function exPullBorrowed() {
  try { if (!connected()) return; const r = await sapi('GET', '/v1/loans/borrowed'); if (!r || r.status !== 200 || !Array.isArray(r.data)) return;
    const list = r.data, ids = new Set(list.map((x) => String(x.id))); let ch = false;
    for (const it of list) {
      let e = lib().find((x) => x.ex && x.ex.borrow && String(x.ex.borrow.srv) === String(it.id)) || lib().find((x) => normT(x.title) === normT(it.title));
      if (!e) { e = addToLibrary({ title: it.title, author: it.author || null, cover: it.cover || null }, null, 'QUERO', { quiet: true }); if (!e) continue; toast('@' + it.from.handle + ' te emprestou “' + it.title + '”'); }
      const b = { from: { h: it.from.handle, n: it.from.displayName || it.from.handle }, at: it.at, ...(it.due ? { due: it.due } : {}), srv: it.id };
      const x = e.ex || {}; if (x.own !== 'pegou' || JSON.stringify(x.borrow || {}) !== JSON.stringify(b)) { e.ex = { ...x, own: 'pegou', borrow: b }; ch = true; }
    }
    lib().forEach((e) => { const x = e.ex; if (x && x.borrow && x.borrow.srv && !ids.has(String(x.borrow.srv))) { exLog(e, { t: 'devolvi', from: x.borrow.from }); delete x.borrow; delete x.own; ch = true; } });
    if (ch) { save(); try { refresh(); } catch {} }
  } catch {} }
setTimeout(exPullBorrowed, 4000); setInterval(exPullBorrowed, 5 * 60 * 1000);
{ const _gt = goTab; goTab = function (tab) { const r = _gt.apply(this, arguments); if (tab === 'estante' || tab === 'inicio') exPullBorrowed(); return r; }; }
// Quero ter da amizade: "Vou dar de presente" (a dona da lista não vê)
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments);
  try { const v = $('#shelflist'), d = S.fpData; if (v.hidden || !d || d.self || d.handle !== h) return r; const w = v.querySelector('.ex-wish'); if (!w || w.dataset.g) return r; w.dataset.g = '1';
    const g = await sapi('GET', '/v1/users/' + encodeURIComponent(h) + '/gifts'); if (!g || g.status !== 200 || !g.data) return r;
    const claims = new Map((g.data.claims || []).map((c) => [String(c.bookKey).replace(/[^a-z0-9]/g, ''), c]));
    const paint = () => w.querySelectorAll('.t5-bk').forEach((b) => {
      const t = b.dataset.book, c = claims.get(exKey(t)); let wrap = b.parentElement.classList.contains('ex-gw') ? b.parentElement : null;
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'ex-gw'; b.before(wrap); wrap.append(b); }
      wrap.querySelector('.ex-gift')?.remove();
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ex-gift' + (c && c.mine ? ' mine' : c ? ' taken' : '');
      btn.textContent = c && c.mine ? '🎁 Você vai dar' : c ? '🎁 Alguém vai dar' : '🎁 Vou dar'; btn.title = c && !c.mine ? 'Outra amizade já vai dar este livro' : '';
      btn.addEventListener('click', (ev) => { ev.stopPropagation(); if (c && !c.mine) return toast('Outra amizade já vai dar este livro');
        // folha do presente: reservar, lembrete de entrega e onde comprar (Bia, 19/11)
        const cvEl = b.querySelector('.cv'), m = cvEl && String(cvEl.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/);
        giftSheet(d, { title: t, author: b.dataset.author || null, cover: m ? m[1] : null }, async () => {
          const g2 = await sapi('GET', '/v1/users/' + encodeURIComponent(h) + '/gifts').catch(() => null);
          if (g2 && g2.status === 200 && g2.data) { claims.clear(); (g2.data.claims || []).forEach((c2) => claims.set(String(c2.bookKey).replace(/[^a-z0-9]/g, ''), c2)); paint(); } }); });
      wrap.append(btn); });
    paint();
  } catch (err) { console.warn('presentes', err); }
  return r; }; }
