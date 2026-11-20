// Números do livro (Bia, 20/11; API 035): a estante vai para o servidor (PUT /v1/me/books, só quando muda) e a aba Sobre
// da página do livro mostra os números logo abaixo do topo (duas fileiras como a faixa do perfil): lendo, leram, querem ler, abandonaram, avaliações (★ média),
// comentários e ressaca (deu / curou). Só totais, nunca quem; números zerados não aparecem.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .v8nc{margin:.1rem 0 .85rem;border:1px solid var(--line);background:var(--panel);border-radius:16px;overflow:hidden}
#shelflist .v8nc .r1{display:grid;grid-template-columns:1fr 1fr 1fr 1.25fr}
#shelflist .v8nc .r1 + .r1{border-top:1px solid var(--line)}
#shelflist .v8nc .r1 > span{border-right:1px solid var(--line);padding:.55rem .3rem;text-align:center;min-width:0}
#shelflist .v8nc .r1 > span:last-child{border-right:0}
#shelflist .v8nc .r1 b{display:block;font-size:1.05rem;font-weight:900;color:var(--ink);white-space:nowrap}
#shelflist .bp-chips[data-v8] .bp-chip:not(.gold){background:color-mix(in srgb,var(--ink) 7%,transparent)!important;color:var(--ink)!important;border-color:transparent!important}
#shelflist .v8nc .r1 b i{font-style:normal;color:var(--acc)}
#shelflist .v8nc .r1 small{display:block;font-size:.66rem;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`; TR.append(st); }
// ---------- sincronização da estante ----------
{ const OK = new Set(['LENDO', 'LIDO', 'QUERO', 'ABANDONEI', 'HIBERNANDO']);
  let busy = false;
  const hashOf = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h); };
  const push = async () => {
    if (busy || document.visibilityState === 'hidden') return; try { if (!connected()) return; } catch { return; }
    let L = []; try { L = lib().filter((e) => e && e.title && OK.has(e.status)).map((e) => ({ title: String(e.title).slice(0, 300), author: e.author ? String(e.author).slice(0, 300) : null, status: e.status })); } catch { return; }
    const who = (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.handle) || 'eu', k = 'v8bk:' + who;
    const h = hashOf(JSON.stringify(L)); let last = null; try { last = localStorage.getItem(k); } catch {}
    if (last === h) return;
    busy = true;
    try { const r = await sapi('PUT', '/v1/me/books', { books: L.slice(0, 5000) }); if (r && r.status === 200) { try { localStorage.setItem(k, h); } catch {} } } catch {} finally { busy = false; }
  };
  setTimeout(push, 6000); setInterval(push, 20000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') push(); }); }
// ---------- números do livro, abaixo do topo (perfil do livro; Bia, 20/11) ----------
{ const cache = new Map(), asked = new Map();
  const fmt = (n) => Number(n).toLocaleString('pt-BR');
  const html = (s) => {
    const n = (x) => Number(x) || 0, av = n(s.avaliacoes), r = s.ressaca || {};
    if (!(n(s.leram) + n(s.lendo) + n(s.querem) + av + n(s.abandonaram) + n(s.comentarios) + n(r.deu) + n(r.curou))) return '';
    const cell = (b, l) => '<span><b>' + b + '</b><small>' + l + '</small></span>';
    const nota = av && s.media != null ? cell('<i>★</i> ' + String(s.media).replace('.', ','), fmt(av) + (av === 1 ? ' avaliação' : ' avaliações')) : cell('–', 'sem avaliações');
    const r2 = [n(s.abandonaram), n(s.comentarios), n(r.deu), n(r.curou)].some(Boolean)
      ? '<div class="r1">' + cell(fmt(n(s.abandonaram)), 'abandonaram') + cell(fmt(n(s.comentarios)), 'comentários') + cell(fmt(n(r.deu)), 'deu ressaca') + cell(fmt(n(r.curou)), 'curou ressaca') + '</div>' : '';
    return '<section class="v8nc"><div class="r1">' + cell(fmt(n(s.leram)), 'leram') + cell(fmt(n(s.lendo)), 'lendo') + cell(fmt(n(s.querem)), 'querem ler') + nota + '</div>' + r2 + '</section>';
  };
  // topo do livro (Bia, 20/11): no lugar de status e formato, a ficha desta edição: editora, páginas, idioma e gênero (a sua nota fica)
  const chips = (hero, title) => {
    const box = hero.querySelector('.bp-chips'); if (!box) return; let e = null; try { e = lib().find((x) => normT(x.title) === normT(title)); } catch {} if (!e) return;
    const m = e.meta || {}; let pg = 0; try { pg = readingInfo(e).total || e.totalPages || 0; } catch { pg = e.totalPages || 0; }
    const lang = m.lang ? ((typeof LANGS !== 'undefined' && LANGS[m.lang]) || m.lang) : '', gen = e.genre || m.cat || '';
    const gold = box.querySelector('.bp-chip.gold');
    const L = [m.pub, pg ? pg + ' pág.' : '', lang, gen].filter(Boolean).map((x) => String(x).split(/[,/]/)[0].trim()).filter(Boolean);
    const sig = L.join('|') + '|' + (gold ? gold.textContent : ''); if (box.dataset.v8 === sig) return;
    box.innerHTML = L.map((x) => '<span class="bp-chip">' + esc(x) + '</span>').join('') + (gold ? gold.outerHTML : ''); box.dataset.v8 = sig; };
  const put = () => {
    const v = $('#shelflist'); if (!v || v.hidden) return;
    const body = v.querySelector('.sl-body'), hero = body && body.querySelector(':scope > .bp-hero'); if (!hero) return;
    const title = ((v.querySelector('.bp-ht h2') || {}).textContent || '').trim(); if (!title) return;
    try { chips(hero, title); } catch {}
    const k = normT(title), s = cache.get(k), cur = body.querySelector(':scope > .v8nc');
    if (!s) { if (cur) cur.remove(); const t = asked.get(k) || 0; if (Date.now() - t < 60000) return; asked.set(k, Date.now());
      sapi('GET', '/v1/books/stats?title=' + encodeURIComponent(title)).then((r) => { if (r && r.status === 200 && r.data) { cache.set(k, r.data); setTimeout(() => cache.delete(k), 5 * 60000); put(); } }).catch(() => {}); return; }
    const h = html(s); if (!h) { if (cur) cur.remove(); return; }
    if (cur && cur.dataset.k === k) { if (hero.nextElementSibling !== cur) hero.after(cur); return; }
    const w = document.createElement('div'); w.innerHTML = h; const el = w.firstElementChild; el.dataset.k = k;
    if (cur) cur.replaceWith(el); else hero.after(el);
  };
  let tm = 0; const v = $('#shelflist');
  if (v) new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { put(); } catch {} }, 80); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'data-bt'] }); }
