// Correções do teste no navegador (Bia, 20/11), parte A.
// 19) Busca: tocar num resultado abre a página do livro (antes abria o menu rápido). O código antigo intercepta o toque
//     no próprio shadow root; aqui o toque é tratado antes, na janela, e só para resultados de busca (.ct-it).
addEventListener('click', (ev) => {
  const p = ev.composedPath ? ev.composedPath() : []; const it = p.find((n) => n.classList && n.classList.contains('ct-it')); if (!it) return;
  if (p.some((n) => n.tagName === 'BUTTON' && it.contains(n))) return; // botões do cartão (edições etc.) seguem com a ação deles
  const t = it.querySelector('.ct-tx b'), a = it.querySelector('.ct-tx small'); if (!t) return;
  ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
  const title = t.textContent.trim(), author = a ? a.textContent.trim() : null, cvEl = it.querySelector('.cv, .ct-cv');
  const m = cvEl && String(cvEl.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/), cover = m ? m[1] : null;
  const mine = lib().find((x) => normT(x.title) === normT(title));
  try { if (mine) openBookPage(mine); else openAnyBook(title, author, cover); } catch (err) { console.warn('busca: abrir livro', err); }
}, true);
// 13) Página do livro: a capa ficava um retângulo liso por 2–3 s. Mostra na hora a capa que já está em cache (a da lista,
//     tamanho médio) e põe a grande por cima quando ela chega (duas camadas no mesmo fundo).
{ const lo = (u) => /covers\.openlibrary\.org/.test(u) ? u.replace(/-L\.jpg/, '-M.jpg') : /books\.google/.test(u) ? u.replace(/zoom=\d/, 'zoom=1') : u;
  const fix = (c) => {
    const bg = c.style.backgroundImage || '', urls = [...bg.matchAll(/url\(["']?(.*?)["']?\)/g)].map((m) => m[1]);
    if (urls.length > 1) return;
    if (!urls.length) { const h = c.closest('.bp-hero'), t = h && h.querySelector('.bp-ht h2'), e = t && lib().find((x) => normT(x.title) === normT(t.textContent)); if (e && /^https?:/.test(e.cover || '')) { c.style.backgroundImage = 'url("' + e.cover + '")'; c.classList.add('img'); } return; }
    const u = urls[0], l = lo(u); if (l !== u) c.style.backgroundImage = 'url("' + u + '"), url("' + l + '")'; };
  const v = $('#shelflist'); if (v) new MutationObserver(() => { v.querySelectorAll('.bp-hero .bp-cv').forEach((c) => { try { fix(c); } catch {} }); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] }); }
// 14/15/16) Livro que não está na sua estante (página do catálogo): igual ao livro da estante.
//  - botão principal "Adicionar à estante" e o "•••" logo abaixo dos números (antes só havia o botão no fim de Sobre);
//  - sem a aba Enredo (como no protótipo: Sobre / Comunidade);
//  - etiquetas do topo com editora, páginas, idioma e gênero da ficha (antes: "Catálogo").
{ const st = document.createElement('style'); st.textContent = `
#shelflist .bp-tabs [data-t=enredo]{display:none!important}
#shelflist .bp-chips[data-v9] .bp-chip{background:color-mix(in srgb,var(--ink) 7%,transparent)!important;color:var(--ink)!important;border-color:transparent!important}
#shelflist .sl-body.v9prev > .bp-btn[data-a=add]{display:none!important}
#shelflist .v9acts{display:flex;gap:8px;margin:0 0 12px}
#shelflist .v9acts .pri{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:16px;padding:12px 14px;font:inherit;font-weight:900;font-size:.95rem;background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 82%,#fff),var(--acc));color:var(--on-acc,#fff);cursor:pointer}
#shelflist .v9acts .pri svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#shelflist .v9acts .dots{width:52px;border:1px solid var(--line);border-radius:16px;background:var(--panel);color:var(--ink);font:inherit;font-weight:900;font-size:1.1rem;cursor:pointer}`; TR.append(st); }
{ const ficha = new Map();
  const fix = () => {
    const v = $('#shelflist'); if (!v || v.hidden) return; const body = v.querySelector('.sl-body'), hero = body && body.querySelector(':scope > .bp-hero'); if (!hero) return;
    const on = v.querySelector('.bp-tabs [data-t=enredo].on, .bp-tabs [data-t=enredo][aria-selected="true"]'); if (on) { const s = v.querySelector('.bp-tabs [data-t=sobre]'); if (s) { s.click(); return; } }
    const title = ((hero.querySelector('.bp-ht h2') || {}).textContent || '').trim(); if (!title) return;
    const mine = lib().some((x) => normT(x.title) === normT(title)), add = body.querySelector(':scope > .bp-btn[data-a=add]');
    // ficha da edição: guarda o que a aba Sobre mostra, para o topo ter as etiquetas em qualquer aba
    const dl = body.querySelector('.bp-dl'); if (dl) { const o = {}; dl.querySelectorAll('dt').forEach((dt) => { const dd = dt.nextElementSibling; if (dd) o[dt.textContent.trim()] = dd.textContent.trim(); }); if (Object.keys(o).length) ficha.set(normT(title), o); }
    const box = hero.querySelector('.bp-chips');
    if (box && !box.dataset.v8 && !mine) { const o = ficha.get(normT(title)) || {}, pgs = o['Páginas'] || ((box.textContent.match(/(\d+)\s*pág/) || [])[1]);
      const L = [o['Publicação'], pgs ? String(pgs).replace(/\D/g, '') + ' pág.' : '', o['Idioma'], o['Gênero']].filter(Boolean).map((x) => String(x).split(/[,/]/)[0].trim()).filter(Boolean);
      const sig = L.join('|'); if (L.length && box.dataset.v9 !== sig) { box.innerHTML = L.map((x) => '<span class="bp-chip">' + esc(x) + '</span>').join(''); box.dataset.v9 = sig; } }
    body.classList.toggle('v9prev', !mine);
    let row = body.querySelector(':scope > .v9acts');
    if (mine || !add) { if (row) row.remove(); return; }
    const anchor = hero.nextElementSibling && hero.nextElementSibling.classList.contains('v8nc') ? hero.nextElementSibling : hero;
    if (!row) { anchor.insertAdjacentHTML('afterend', '<div class="v9acts"><button type="button" class="pri" data-v9="add"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Adicionar à estante</button><button type="button" class="dots" data-v9="more" aria-label="Mais opções do livro">•••</button></div>');
      row = body.querySelector(':scope > .v9acts');
      row.querySelector('[data-v9=add]').addEventListener('click', () => { const a = body.querySelector(':scope > .bp-btn[data-a=add]'); if (a) a.click(); });
      row.querySelector('[data-v9=more]').addEventListener('click', (ev) => { const cv = hero.querySelector('.bp-cv'), m = cv && String(cv.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/); try { bookMenuOpen(ev.currentTarget, { title, author: ((hero.querySelector('.bp-ht small') || {}).textContent || '').trim() || null, cover: m ? m[1] : null }); } catch (err) { console.warn('menu do livro', err); } }); }
    else if (row.previousElementSibling !== anchor) anchor.after(row);
  };
  let tm = 0; const v = $('#shelflist'); if (v) new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { fix(); } catch (err) { console.warn('livro do catálogo', err); } }, 40); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
