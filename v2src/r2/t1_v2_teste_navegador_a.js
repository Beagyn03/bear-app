// Correções do teste no navegador (Bia, 20/11), parte A.
// 19) Busca: tocar num resultado abre a página do livro (antes abria o menu rápido). O código antigo intercepta o toque
//     no próprio shadow root; aqui o toque é tratado antes, na janela, e só para resultados de busca (.ct-it).
addEventListener('click', (ev) => {
  const p = ev.composedPath ? ev.composedPath() : []; const it = p.find((n) => n.classList && n.classList.contains('ct-it')); if (!it) return; if (Date.now() - (window.lvLongAt || 0) < 700) return; // soltou o "segurar": o menu já abriu (u3)
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
      const L = [o['Publicação'], pgs ? String(pgs).replace(/\D/g, '') + ' pág.' : '', (window.v2LangName ? window.v2LangName(o['Idioma']) : o['Idioma']), o['Gênero']].filter(Boolean).map((x) => String(x).split(/[,/]/)[0].trim()).filter(Boolean);
      const sig = L.join('|'); if (L.length && box.dataset.v9 !== sig) { box.innerHTML = L.map((x) => '<span class="bp-chip">' + esc(x) + '</span>').join(''); box.dataset.v9 = sig; } }
    body.classList.toggle('v9prev', !mine);
    let row = body.querySelector(':scope > .v9acts');
    if (mine || !add) { if (row) row.remove(); return; }
    const anchor = hero.nextElementSibling && hero.nextElementSibling.classList.contains('v8nc') ? hero.nextElementSibling : hero;
    if (!row) { anchor.insertAdjacentHTML('afterend', '<div class="v9acts"><button type="button" class="pri" data-v9="add"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Adicionar à Biblioteca</button><button type="button" class="dots" data-v9="more" aria-label="Mais opções do livro">•••</button></div>');
      row = body.querySelector(':scope > .v9acts');
      row.querySelector('[data-v9=add]').addEventListener('click', () => { const a = body.querySelector(':scope > .bp-btn[data-a=add]'); if (a) a.click(); });
      row.querySelector('[data-v9=more]').addEventListener('click', (ev) => { const cv = hero.querySelector('.bp-cv'), m = cv && String(cv.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/); try { bookMenuOpen(ev.currentTarget, { title, author: ((hero.querySelector('.bp-ht small') || {}).textContent || '').trim() || null, cover: m ? m[1] : null }); } catch (err) { console.warn('menu do livro', err); } }); }
    else if (row.previousElementSibling !== anchor) anchor.after(row);
  };
  let tm = 0; const v = $('#shelflist'); if (v) new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { fix(); } catch (err) { console.warn('livro do catálogo', err); } }, 40); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// 22) Busca › Leitores: o campo fica igual ao da aba Livros (pílula com lupa) e na mesma altura; antes encolhia e a aba subia.
{ const st = document.createElement('style'); st.textContent = `
#shelflist #ps-q{display:block;width:100%;box-sizing:border-box;height:48px!important;border-radius:999px!important;padding:0 1.1rem 0 2.6rem!important;margin:0 0 27px!important;background:var(--panel) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23998877' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='10.5' cy='10.5' r='6.5'/%3E%3Cpath d='M15.5 15.5l5 5'/%3E%3C/svg%3E") no-repeat .9rem 50%/18px!important;box-shadow:var(--v2-sh)!important;font-weight:700}`; TR.append(st); }
// 21) Busca › Leitores: a etiqueta de quem já é amizade dizia "amigos"; vira "amizade", como no resto do app.
{ const v = $('#shelflist'); if (v) new MutationObserver(() => { v.querySelectorAll('.ps-it em').forEach((x) => { if (x.textContent === 'amigos') x.textContent = 'amizade'; }); }).observe(v, { childList: true, subtree: true }); }
// 1) Órbita: o ícone do topo era o planeta colorido (imagem); vira ícone de traço, na cor do tema.
// 6) Hoje: "A seguir" no mesmo tamanho dos outros títulos de seção ("Para você").
{ const st = document.createElement('style'); st.textContent = `
.orb-pg .orb-big .orb-ic{display:grid!important;place-items:center;background:none!important;border:1.5px solid var(--line);color:var(--acc);padding:0!important}
.orb-pg .orb-big .orb-ic img{display:none!important}
.orb-pg .orb-big .orb-ic::before{content:"";width:62%;height:62%;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cellipse cx='12' cy='12' rx='10' ry='3.6' transform='rotate(-18 12 12)'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cellipse cx='12' cy='12' rx='10' ry='3.6' transform='rotate(-18 12 12)'/%3E%3C/svg%3E") center/contain no-repeat}
.orb-pg .orb-big .orb-ic.off{color:var(--ink-2)}
#lista .v3sh > b{font-size:1.08rem!important}`; TR.append(st); }
// 3) Prazo: livro que já tem prazo abre a folha com o título "Seu prazo" (sem prazo continua "Quando quer terminar?").
{ const _d = dueSheet; dueSheet = function (e) { const r = _d.apply(this, arguments);
  if (e && e.dueAt) setTimeout(() => { [...document.querySelectorAll('h3'), ...TR.querySelectorAll('h3')].forEach((h) => { if (h.textContent.trim() === 'Quando quer terminar?') h.textContent = 'Seu prazo'; }); }, 0);
  return r; }; }
// 4) Página de gostos: título curto "Seus gostos" (o longo era cortado no topo).
{ const v = $('#shelflist'); if (v) new MutationObserver(() => { const b = v.querySelector('.sl-body > .sl-top > b'); if (b && b.textContent === 'O que você gosta de ler?') b.textContent = 'Seus gostos'; }).observe(v, { childList: true, subtree: true }); }
// 5) Hoje: ao voltar de uma página interna, volta para onde estava rolado (antes voltava para o topo).
{ const L = () => TR.querySelector('#lista:not(.lista-snap)'); let saved = 0, open = false;
  const v = $('#shelflist');
  if (v) new MutationObserver(() => {
    const now = !v.hidden; if (now === open) return; open = now; const l = L(); if (!l || S.tab !== 'inicio') return;
    if (now) { saved = l.scrollTop; return; }
    if (!saved) return; const want = saved;
    [0, 80, 250, 600].forEach((ms) => setTimeout(() => { const x = L(); if (x && S.tab === 'inicio' && v.hidden && x.scrollTop < want - 4) x.scrollTop = want; }, ms));
  }).observe(v, { attributes: true, attributeFilter: ['hidden'] }); }
// 49) Recarregar em Completar histórico: volta para a mesma página (antes caía no Você).
{ const _o = openFixReads; openFixReads = function (filter) { const r = _o.apply(this, arguments); try { S.navView = { t: 'fixreads', a: [filter || null] }; } catch {} return r; };
  const _rn = restoreNav; restoreNav = function () { let n = null; try { n = JSON.parse(sessionStorage.getItem('bear.nav') || 'null'); } catch {}
    if (n && n.view && n.view.t === 'fixreads' && Date.now() - (n.at || 0) < 30 * 60000) { setTimeout(() => { try { openFixReads(n.view.a && n.view.a[0] || undefined); } catch {} }, 400); return; }
    return _rn.apply(this, arguments); }; }
