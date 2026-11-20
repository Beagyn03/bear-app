// Números do livro (Bia, 20/11; API 035): a estante vai para o servidor (PUT /v1/me/books, só quando muda) e a aba Sobre
// da página do livro mostra o bloco "Na comunidade": lendo, leram, querem ler, abandonaram, avaliações (★ média),
// comentários e ressaca (deu / curou). Só totais, nunca quem; números zerados não aparecem.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .v8nc{margin:0 0 .85rem;padding:.8rem .85rem .85rem;border:1px solid var(--line);border-radius:18px;background:var(--panel)}
#shelflist .v8nc > b{display:block;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2);margin:0 0 .55rem;font-weight:900}
#shelflist .v8nc .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:.45rem}
#shelflist .v8nc .g > span{display:flex;flex-direction:column;gap:.1rem;padding:.5rem .6rem;border-radius:12px;background:color-mix(in srgb,var(--ink) 5%,transparent);min-width:0}
#shelflist .v8nc .g em{font-style:normal;font-weight:900;font-size:1.05rem;color:var(--ink);line-height:1.15}
#shelflist .v8nc .g small{font-size:.72rem;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#shelflist .v8nc .g em i{font-style:normal;color:var(--acc);font-size:.85rem;margin-left:.15rem}
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
// ---------- bloco "Na comunidade" na aba Sobre ----------
{ const cache = new Map(), asked = new Map();
  const fmt = (n) => Number(n).toLocaleString('pt-BR');
  const html = (s) => {
    const T = [[s.lendo, 'lendo'], [s.leram, 'leram'], [s.querem, 'querem ler'], [s.abandonaram, 'abandonaram'],
      [s.avaliacoes, s.avaliacoes === 1 ? 'avaliação' : 'avaliações', s.media], [s.comentarios, s.comentarios === 1 ? 'comentário' : 'comentários'],
      [s.ressaca && s.ressaca.deu, 'deu ressaca'], [s.ressaca && s.ressaca.curou, 'curou ressaca']].filter((x) => Number(x[0]) > 0);
    if (!T.length) return '';
    return '<section class="v8nc"><b>Na comunidade</b><div class="g">' + T.map(([n, l, m]) => '<span><em>' + fmt(n) + (m ? '<i>★ ' + String(m).replace('.', ',') + '</i>' : '') + '</em><small>' + l + '</small></span>').join('') + '</div></section>';
  };
  const put = () => {
    const v = $('#shelflist'); if (!v || v.hidden || v.dataset.bt !== 'sobre') return;
    const body = v.querySelector('.sl-body'), tabs = body && body.querySelector(':scope > .bp-tabs'); if (!tabs) return;
    const title = ((v.querySelector('.bp-ht h2') || {}).textContent || '').trim(); if (!title) return;
    const k = normT(title), s = cache.get(k), cur = body.querySelector(':scope > .v8nc');
    if (!s) { if (cur) cur.remove(); const t = asked.get(k) || 0; if (Date.now() - t < 60000) return; asked.set(k, Date.now());
      sapi('GET', '/v1/books/stats?title=' + encodeURIComponent(title)).then((r) => { if (r && r.status === 200 && r.data) { cache.set(k, r.data); setTimeout(() => cache.delete(k), 5 * 60000); put(); } }).catch(() => {}); return; }
    const h = html(s); if (!h) { if (cur) cur.remove(); return; }
    if (cur && cur.dataset.k === k) return;
    const w = document.createElement('div'); w.innerHTML = h; const n = w.firstElementChild; n.dataset.k = k;
    // logo depois da sinopse (primeiro cartão depois das abas); sem sinopse, logo depois das abas
    const first = tabs.nextElementSibling && tabs.nextElementSibling.matches('section, .bp-card') ? tabs.nextElementSibling : null;
    if (cur) cur.replaceWith(n); else (first || tabs).after(n);
  };
  let tm = 0; const v = $('#shelflist');
  if (v) new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { put(); } catch {} }, 80); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'data-bt'] }); }
