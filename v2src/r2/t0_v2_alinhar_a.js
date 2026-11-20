// Alinhamento com o protótipo v3, parte A (Bia, 20/11: "revisa tudo que falta pra subir pra dev").
// 1) Trecho: todos os atalhos (Hoje, menu do livro, Ler) abrem a folha "Novo trecho" do protótipo (livro, foto, categoria,
//    sentimento, nota), não a folha antiga "Salvar trecho".
// 2) Busca como no protótipo: campo em pílula com o leitor de código dentro, sem botão "Buscar" (Enter busca; digitar já busca),
//    abas Livros/Leitores sublinhadas e, antes de digitar, "Na sua estante", "Em alta na comunidade" e as etiquetas
//    Curam ressaca · Dão ressaca · Não achei: cadastrar.
saveQuote = function (e) {
  try { const st = v4State(); st.v5tq = v5TqInit(); if (e && e.id && lib().includes(e)) { st.v5tq.eid = e.id; st.v5tq.p = e.status === 'LENDO' ? libProgress(e) || '' : ''; } v5Sheet('v5tqnew', {}); }
  catch (err) { console.warn('trecho', err); }
};
{ const st = document.createElement('style'); st.textContent = `
#shelflist .ct-form{position:relative;grid-template-columns:1fr!important}
#shelflist .ct-form .ct-go{display:none!important}
#shelflist .ct-form .ct-scan{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:40px!important;height:40px!important;border:0!important;background:none!important;box-shadow:none!important;color:var(--ink-2)!important}
#shelflist .ct-form #ct-q{padding-right:3rem!important}
#shelflist .sl-body .ct-mode{display:flex!important;gap:1.1rem!important;padding:0!important;border-radius:0!important;background:none!important;border-bottom:1px solid var(--line)!important;margin:.2rem 0 .9rem!important;justify-content:flex-start}
#shelflist .sl-body .ct-mode > button{flex:0 0 auto!important;height:auto!important;padding:.55rem 0!important;border-radius:0!important;background:none!important;box-shadow:none!important;color:var(--ink-2)!important;font-size:.9rem!important;font-weight:800!important;border-bottom:2.5px solid transparent!important;margin-bottom:-1px!important}
#shelflist .sl-body .ct-mode > button.on{color:var(--ink)!important;border-bottom-color:var(--acc)!important}
#shelflist .sl-body > .rs-chips{display:none!important}
#shelflist .v9bz .eb{display:block;margin:.3rem 0 .55rem;font-size:.68rem;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:var(--ink-2)}
#shelflist .v9bz .hs{display:flex;gap:.7rem;overflow-x:auto;scrollbar-width:none;margin:0 0 1rem;padding-bottom:2px}
#shelflist .v9bz .hs::-webkit-scrollbar{display:none}
#shelflist .v9bz .hs > button{flex:0 0 92px;border:0;background:none;padding:0;text-align:left;font:inherit;color:var(--ink);cursor:pointer;min-width:0}
#shelflist .v9bz .hs .cv{width:92px!important;height:138px!important;border-radius:4px 8px 8px 4px!important;margin-bottom:.4rem}
#shelflist .v9bz .hs b{display:block;font-size:.8rem;font-weight:800;line-height:1.2;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#shelflist .v9bz .hs small{display:block;font-size:.7rem;color:var(--ink-2);margin-top:.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#shelflist .v9bz .ch{display:flex;gap:.4rem;overflow-x:auto;scrollbar-width:none}
#shelflist .v9bz .ch button{flex:none;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.4rem .85rem;font:inherit;font-weight:800;font-size:.8rem}
`; TR.append(st); }
{ const ST = { LENDO: 'lendo', QUERO: 'quero ler', LIDO: 'lido', HIBERNANDO: 'pausado', ABANDONEI: 'abandonado' };
  const html = () => {
    const mine = lib().filter((e) => e.status === 'LENDO').concat(lib().filter((e) => e.status === 'QUERO')).slice(0, 6);
    const d = S.trends || {}, hot = (d.app && d.app.length ? d.app : d.topRated || []).slice(0, 8);
    const item = (t, c, sub, k) => `<button type="button" data-${k}>${cvh(t, c, '')}<b>${esc(t)}</b><small>${esc(sub || '')}</small></button>`;
    return (mine.length ? `<span class="eb">Na sua estante</span><div class="hs">${mine.map((e, i) => item(e.title, e.cover, ST[e.status], 'mi="' + i + '"')).join('')}</div>` : '')
      + (hot.length ? `<span class="eb">Em alta na comunidade</span><div class="hs">${hot.map((x, i) => item(x.title, x.cover, x.author, 'hi="' + i + '"')).join('')}</div>` : '')
      + `<div class="ch">${connected() ? '<button type="button" data-rsk="curou">Curam ressaca</button><button type="button" data-rsk="deu">Dão ressaca</button>' : ''}<button type="button" data-man>Não achei: cadastrar</button></div>`;
  };
  const put = () => {
    const v = $('#shelflist'); if (!v || v.hidden) return; const list = v.querySelector('.sl-body > .ct-list'); if (!list || !v.querySelector('.ct-form')) return;
    const empty = list.querySelector(':scope > p.sl-empty'); if (!empty || !/Procure qualquer livro/.test(empty.textContent)) return;
    if (!S.trends && !S.trBusy && connected()) { S.trBusy = true; sapi('GET', '/v1/trends').then((r) => { if (r.status === 200 && r.data) S.trends = { ...r.data, at: Date.now() }; }).catch(() => {}).finally(() => { S.trBusy = false; put2(); }); }
    const w = document.createElement('div'); w.className = 'v9bz'; w.innerHTML = html(); empty.replaceWith(w); try { paintCv(w); } catch {}
    const mine = lib().filter((e) => e.status === 'LENDO').concat(lib().filter((e) => e.status === 'QUERO')).slice(0, 6), d = S.trends || {}, hot = (d.app && d.app.length ? d.app : d.topRated || []).slice(0, 8);
    w.querySelectorAll('[data-mi]').forEach((b) => b.addEventListener('click', () => openBookPage(mine[+b.dataset.mi])));
    w.querySelectorAll('[data-hi]').forEach((b) => b.addEventListener('click', () => { const x = hot[+b.dataset.hi]; if (!x) return; const m = lib().find((e) => normT(e.title) === normT(x.title)); if (m) return openBookPage(m);
      openBookPage({ id: 'cat:' + (x.key || normT(x.title)), title: x.title, author: x.author || null, cover: x.cover || null, totalPages: null, isbn: null, status: null, _preview: true, _item: { title: x.title, author: x.author || null, coverUrl: x.cover || null } }); }));
    w.querySelectorAll('[data-rsk]').forEach((b) => b.addEventListener('click', () => openRessacaList(b.dataset.rsk)));
    w.querySelector('[data-man]')?.addEventListener('click', () => manualBookSheet((it) => { try { addToLibrary(it, null, 'QUERO'); } catch {} }));
  };
  // quando "Em alta" chega depois, troca só o bloco (uma vez)
  const put2 = () => { const w = TR.querySelector('#shelflist .v9bz'); if (!w) return; const p = document.createElement('p'); p.className = 'sl-empty'; p.textContent = 'Procure qualquer livro'; w.replaceWith(p); put(); };
  let tm = 0; const v = $('#shelflist');
  if (v) new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { put(); } catch (err) { console.warn('busca', err); } }, 40); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
}
// 3) Minha leitura termina com "Meus ecos" deste livro, como no protótipo (lista do GET /v1/me/echoes filtrada pelo título)
{ const st = document.createElement('style'); st.textContent = `
#shelflist .v9ecos{margin:.6rem 0 1rem}
#shelflist .v9ecos h3{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 .5rem;font-family:var(--v2-disp);font-size:1.15rem;color:var(--ink)}
#shelflist .v9ecos h3 small{font-family:inherit;font-size:.8rem;color:var(--acc);font-weight:900}
#shelflist .v9ecos .l{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:0 .8rem}
#shelflist .v9ecos .it{display:flex;gap:.6rem;align-items:flex-start;padding:.7rem 0;border-bottom:1px solid var(--line)}
#shelflist .v9ecos .it:last-child{border-bottom:0}
#shelflist .v9ecos .it i{flex:none;width:9px;height:9px;margin-top:.35rem;border-radius:50%;background:#f2c94c;box-shadow:0 0 8px rgba(242,201,76,.7)}
#shelflist .v9ecos .it q{display:block;font-weight:800;font-size:.9rem;color:var(--ink)}
#shelflist .v9ecos .it small{display:block;font-size:.74rem;color:var(--ink-2);margin-top:.15rem}
#shelflist .v9ecos p{margin:0;font-size:.85rem;color:var(--ink-2)}
`; TR.append(st); }
{ let asked = 0, tm = 0;
  const put = () => {
    const v = $('#shelflist'); if (!v || v.hidden || !v.classList.contains('v5bp-minha')) return; const body = v.querySelector('.sl-body'); if (!body) return;
    try { if (typeof vFn === 'function' && (!vFn('comunidade') || !vFn('ecos'))) return; } catch {}
    const title = ((v.querySelector('.bp-ht h2') || {}).textContent || '').trim(); if (!title || !connected()) return;
    if (S.v4myEcos === undefined || S.v4myEcos === null) { if (Date.now() - asked > 60000) { asked = Date.now(); sapi('GET', '/v1/me/echoes').then((r) => { S.v4myEcos = r.status === 200 && r.data ? r.data.items || [] : null; put(); }).catch(() => {}); } return; }
    const L = S.v4myEcos.filter((x) => normT(x.title || '') === normT(title)).sort((a, z) => (a.page || 0) - (z.page || 0));
    const html = `<h3>Meus ecos <small>${L.length || ''}</small></h3>` + (L.length ? '<div class="l">' + L.map((x) => `<div class="it"><i></i><span><q>${esc(x.text || '')}</q><small>pág. ${x.page || '?'}</small></span></div>`).join('') + '</div>' : '<p>Você ainda não deixou ecos neste livro. Na leitura, toque em Deixar um eco.</p>');
    let sec = body.querySelector(':scope > .v9ecos');
    if (sec && sec.dataset.h === html) { if (body.lastElementChild !== sec) body.append(sec); return; }
    if (!sec) { sec = document.createElement('section'); sec.className = 'v9ecos'; } sec.innerHTML = html; sec.dataset.h = html; body.append(sec);
  };
  const v = $('#shelflist');
  if (v) new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { put(); } catch (err) { console.warn('ecos do livro', err); } }, 120); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
}
