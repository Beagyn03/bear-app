// Página do autor: toque no nome do autor na página do livro (ou "Ver tudo" em "Mais de …").
// Mostra o que a pessoa já tem dele (com status e nota) e outros livros do catálogo.
{ const st = document.createElement('style'); st.textContent = `
.bp-ht small{cursor:pointer;text-decoration:underline;text-decoration-color:color-mix(in srgb,currentColor 35%,transparent);text-underline-offset:3px}
.au-h{display:flex;align-items:center;gap:.8rem;margin:.3rem 0 .9rem}.au-av{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-weight:900;font-size:1.3rem;color:#fff;flex:none}
.au-h b{display:block;font-size:1.15rem;color:var(--ink)}.au-h small{font-size:.8rem;color:var(--ink-2)}
.au-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem .5rem}.au-grid .es4-bk small{font-size:.66rem;line-height:1.2}
.au-grid .es-bk{display:block;width:100%}.au-grid .es-bk .cv{display:block;width:100%!important;aspect-ratio:2/3;height:auto!important;min-height:0!important;background-size:cover;background-position:center}
.au-fora{margin-top:1rem}.au-fora summary{cursor:pointer;font-weight:800;font-size:.85rem;color:var(--ink-2);padding:.4rem 0;list-style:none}.au-fora summary::-webkit-details-marker{display:none}.au-fora summary::after{content:" ›"}.au-fora[open] summary::after{content:" ⌄"}.au-fora .au-grid{margin-top:.5rem}
.au-more{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.8rem;margin-left:auto}
`; TR.append(st); }
function openAuthorPage(name) {
  const au = String(name || '').split(',')[0].trim(); if (!au) return;
  const v = $('#shelflist'), prev = S.listRedraw, prevNav = S.navView, k = normT(au), sur = k.split(' ').pop();
  const mineOf = () => lib().filter((e) => { const a = normT(String(e.author || '').split(',')[0]); return a === k || (sur && a.split(' ').pop() === sur && a.split(' ')[0] === k.split(' ')[0]); });
  const draw = () => {
    const mine = mineOf(), lidos = mine.filter((e) => e.status === 'LIDO'), pw = lidos.map((e) => (reviewOfLib(e) || {}).paws).filter(Boolean);
    const avg = pw.length ? Math.round((pw.reduce((a, b) => a + b, 0) / pw.length) * 2) / 2 : 0;
    const c = S.byAuthor && S.byAuthor[k]; const have = new Set(mine.map((e) => normT(e.title)));
    // (Bia 28/11: "por que não aparece Uma janela sombria?") a busca pelo nome trazia só as edições em inglês e francês.
    // Agora: busca também as edições em português; havendo alguma, elas ficam em "Outros livros" e as estrangeiras
    // (traduções que o catálogo não liga à edição brasileira) vão para "Em outros idiomas", fechado. Box, guia e brinde saem.
    // (Bia 28/11, Colleen Hoover) fora também kit, resumo, caderno, "edição de colecionador" repetida e título com o nome da autora
    const lixo = /\b(box(ed)?( set)?|kit|study guide|supersummary|summary|resumo|notebook|conversation starters|discussion|brindes?)\b/i;
    const base = (t) => normT(String(t || '').split(/\s[(\[]|:|\s[–—-]\s/)[0]);
    const haveB = new Set(mine.map((e) => base(e.title))), auN = normT(au);
    const all = c && c.items ? c.items.filter((it) => !have.has(normT(it.title)) && !haveB.has(base(it.title)) && !lixo.test(it.title || '') && !normT(it.title || '').includes(auN)).filter((it, i, a) => a.findIndex((x) => base(x.title) === base(it.title)) === i) : null;
    const pt = all && all.filter((it) => langOf(it) === "pt"), fora = all && pt.length ? all.filter((it) => langOf(it) !== "pt") : [];
    const others = all ? (pt.length ? pt : all).slice(0, 24) : null;
    const mineHTML = mine.map((e) => { const m = es4Mark(e); return `<div class="es4-bk${m.dim ? ' es4-dim' : ''}"><button type="button" class="es-bk" data-id="${esc(e.id)}" aria-label="${esc(e.title)}">${cvh(e.title, e.cover, 'es-cv')}${m.over}</button><small>${esc(m.label)}</small></div>`; }).join('');
    const cell = (it) => `<div class="es4-bk"><button type="button" class="es-bk" data-book="${esc(it.title)}" data-author="${esc(it.author || '')}" aria-label="${esc(it.title)}">${cvh(it.title, it.coverUrl, 'es-cv')}</button><small>${esc(it.title)}</small></div>`;
    const othHTML = (others || []).map(cell).join(''), foraHTML = fora.slice(0, 24).map(cell).join('');
    v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>${esc(au)}</b><span></span></div>
      <div class="au-h"><span class="au-av" style="background:${friendColor(au)}">${esc(initial(au))}</span><div><b>${esc(au)}</b><small>${mine.length ? `${plural(mine.length, 'livro', 'livros')} na sua biblioteca${lidos.length ? ` · ${plural(lidos.length, 'lido', 'lidos')}` : ''}${avg ? ` · média ${pawTxt(avg)}` : ''}` : 'Nenhum livro na sua biblioteca ainda'}</small></div></div>
      ${mine.length ? `<div class="v3-sh"><b>Na sua biblioteca</b></div><div class="au-grid">${mineHTML}</div>` : ''}
      <div class="v3-sh" style="margin-top:1rem"><b>${mine.length ? 'Outros livros' : 'Livros'}</b></div>
      ${others === null ? '<p class="sl-empty">Buscando no catálogo…</p>' : others.length ? `<div class="au-grid">${othHTML}</div>` : `<p class="sl-empty">${S.searchLimited ? 'Busca limitada no momento. Tente de novo em alguns minutos.' : 'Não achei outros livros no catálogo.'}</p>`}
      ${foraHTML ? `<details class="au-fora"><summary>Em outros idiomas · ${fora.length > 24 ? 24 : fora.length}</summary><div class="au-grid">${foraHTML}</div></details>` : ''}`;
    paintCv(v);
    v.querySelector('.sl-back').addEventListener('click', () => { if (prev) { S.listRedraw = prev; S.navView = prevNav; prev(); } else { v.hidden = true; S.listRedraw = null; } });
    $$('.es-bk[data-id]', v).forEach((b) => b.addEventListener('click', (ev) => { ev.stopImmediatePropagation(); bookMenuOpen(b, byId(b.dataset.id)); }, true));
    syncTopTitle();
  };
  S.byAuthor = S.byAuthor || {};
  // (Bia 28/11) a busca pelo nome traz poucas edições em português (o catálogo devolve no máximo ~25 e prefere as em inglês).
  // 1ª rodada: nome, "nome livro" e "nome edição"; 2ª rodada: nome + as 2 editoras brasileiras mais frequentes (ex.: Galera).
  if (!S.byAuthor[k] || (!S.byAuthor[k].items && !S.byAuthor[k].loading)) { S.byAuthor[k] = { loading: true };
    const sb = (q) => searchBooks(q).catch(() => []), ok = (l) => (l || []).filter((it) => normT(it.author || '').includes(sur));
    const put = (lists) => { const fl = lists.flat(); S.byAuthor[k] = { items: ok([...fl.filter((it) => langOf(it) === 'pt'), ...fl]) }; if (S.listRedraw === draw && !v.hidden) draw(); };
    Promise.all([sb(au), sb(au + ' livro'), sb(au + ' edição')]).then((r1) => { put(r1);
      const n = {}; ok(r1.flat()).filter((it) => langOf(it) === 'pt').forEach((it) => { const p = String((it._meta && it._meta.pub) || '').trim(); if (p) n[p] = (n[p] || 0) + 1; });
      const pubs = Object.entries(n).sort((a, b) => b[1] - a[1]).slice(0, 2).map((x) => x[0]);
      if (pubs.length) Promise.all(pubs.map((p) => sb(au + ' ' + p))).then((r2) => put([...r1, ...r2]));
    }).catch(() => { S.byAuthor[k] = { items: [] }; if (S.listRedraw === draw) draw(); }); }
  S.listRedraw = draw; S.navView = { t: 'author', a: [au] }; closeEd(); v.classList.remove('feedview', 'tabroot'); draw(); v.hidden = false; v.scrollTop = 0;
}
TR.addEventListener('click', (ev) => {
  const a = ev.target.closest && ev.target.closest('.bp-ht small'); if (!a) return;
  const name = a.textContent.trim(); if (!name) return; ev.stopPropagation(); openAuthorPage(name);
}, true);
{ // "Mais de X" ganha "Ver tudo ›"
  new MutationObserver(() => { TR.querySelectorAll('.v3-sh').forEach((h) => { const b = h.querySelector('b'); if (!b || h.querySelector('.au-more') || !/^Mais de /.test(b.textContent)) return; const nm = b.textContent.replace(/^Mais de /, ''); h.insertAdjacentHTML('beforeend', '<button type="button" class="au-more">Ver tudo ›</button>'); h.querySelector('.au-more').addEventListener('click', () => openAuthorPage(nm)); }); }).observe(TR, { childList: true, subtree: true });
}
