// Livro que já está na Biblioteca, mesmo com o título escrito de outro jeito (Bia, 21/11: em leitura conjunta o menu oferecia
// "Adicionar à Biblioteca" para um livro dela). Compara título normalizado, sem subtítulo, e o autor quando houver.
function lvOwnBook(title, author) {
  const L = (typeof lib === 'function' ? lib() : []) || []; const k = normT(title || ''); if (!k) return null;
  const base = (t) => normT(String(t || '').split(/\s[-–—:]\s|:|\(/)[0]);
  const ka = normT(author || ''), kb = base(title);
  let e = L.find((x) => normT(x.title) === k); if (e) return e;
  const c = L.filter((x) => { const xt = normT(x.title), xb = base(x.title); return (kb && xb && (xb === kb)) || (xt.length > 3 && k.length > 3 && (xt.startsWith(k) || k.startsWith(xt))); });
  if (c.length === 1) return c[0];
  if (c.length > 1 && ka) return c.find((x) => { const xa = normT(x.author || ''); return xa && (xa.includes(ka) || ka.includes(xa)); }) || c[0];
  return c[0] || null;
}
// Segurar qualquer capa abre opções (Bia, 20/11; regra do protótipo: tocar abre a página, segurar abre o menu).
// Antes só valia na Biblioteca. Agora vale em toda capa do app (Hoje, perfis, Top 3, Comunidade, Busca, Metas, páginas):
// livro seu → o menu do livro; livro que não está com você → Ver o livro / Adicionar à estante.
// A Estante continua com o gesto dela ([data-long]); aqui só entram as capas sem esse gesto.
{ let t = 0, x0 = 0, y0 = 0, cv = null, longAt = 0;
  const clear = () => { clearTimeout(t); t = 0; cv = null; };
  const capa = (ev) => { const p = ev.composedPath ? ev.composedPath() : [ev.target];
    for (const n of p) { if (!n || !n.classList) continue; if (n.hasAttribute && n.hasAttribute('data-long')) return null; if (n.classList.contains('cv')) return n; if (n === TR.host) break; } return null; };
  const titulo = (n) => String(n.dataset.t || n.getAttribute('aria-label') || n.textContent || '').trim();
  const capaUrl = (n) => { const m = /url\(["']?([^"')]+)["']?\)/.exec(n.style.backgroundImage || ''); return m ? m[1] : null; };
  // perfil de outra pessoa (Bia, 20/11; protótipo v154): o menu é sobre a pessoa e o livro, não o da sua estante
  const perfilDeOutra = (n) => { const v = TR.querySelector('#shelflist'), d = S.fpData; if (!v || v.hidden || !d || d.self || !v.contains(n)) return null;
    if (!v.querySelector('.sl-body > .v3pf')) return null; return d; };
  const ST = { LENDO: 'lendo', LIDO: 'lido', QUERO: 'quero ler', HIBERNANDO: 'pausado', ABANDONEI: 'abandonado' };
  const menuPerfil = async (n, d, t0, e) => {
    const nome = String(d.displayName || '@' + d.handle).split(' ')[0], k = normT(t0);
    const lendo = (d.reading || (d.shelf && d.shelf.reading) || []).find((b) => normT(b.title) === k);
    const wish = ((d.shelf && d.shelf.wish) || []).find((b) => normT(b.title) === k);
    const amz = !!(d.isFriend || ((SOC.fr && SOC.fr.friends) || []).some((f) => f.handle === d.handle));
    const book = { title: (wish && wish.title) || (lendo && lendo.title) || t0, author: (wish && wish.author) || (lendo && lendo.author) || (e && e.author) || '', cover: (wish && wish.cover) || (lendo && lendo.cover) || capaUrl(n) || (e && e.cover) || null };
    let claim = null;
    if (wish && connected()) { try { const g = await Promise.race([sapi('GET', gfPath(d.handle)), new Promise((r) => setTimeout(() => r(null), 1500))]);
      if (g && g.status === 200 && g.data) claim = (g.data.claims || []).find((c) => String(c.bookKey).replace(/[^a-z0-9]/g, '') === exKey(book.title)) || null; } catch {} }
    const redo = () => { try { const v = TR.querySelector('#shelflist'); if (S.fpData === d) v3Build(v, d); } catch {} };
    const it = [{ label: 'Ver o livro', fn: () => { if (e) openBookPage(e); else openAnyBook(book.title, book.author, book.cover); } }];
    it.push(e ? { label: '<i class=v3e data-i=estante></i>' + 'Na sua estante', sub: (ST[e.status] || '') + ' · suas opções do livro', fn: () => v5Menu(e) } : { label: '<i class=v3e data-i=plus></i>' + 'Adicionar à Biblioteca', sub: 'Quero ler, Lendo ou Já li', fn: () => addToLibrary(book) });
    if (lendo && amz && vFnSafe('junto')) it.push({ label: '<i class=v3e data-i=friends></i>' + 'Ler junto com ' + esc(nome), sub: esc(nome) + ' está em ' + Math.round(Number(lendo.pct) || 0) + '%', fn: () => { try { ljOpen(d); } catch {} } });
    if (wish) {
      if (claim && claim.mine) it.push({ label: '<i class=v3e data-i=gift></i>' + 'Você vai dar', sub: claim.due ? 'até ' + exD(claim.due) : 'reservado por você', fn: () => gfManage({ h: d.handle, name: d.displayName || d.handle, title: book.title, author: book.author, cover: book.cover, due: claim.due || null }, redo) });
      else if (claim) it.push({ label: '<i class=v3e data-i=gift></i>' + 'Alguém já vai dar', sub: 'está nos desejos de ' + esc(nome), fn: () => toast('Outra amizade já reservou este presente') });
      else it.push({ label: '<i class=v3e data-i=gift></i>' + 'Vou dar', sub: 'está nos desejos de ' + esc(nome), fn: () => gfReserve(d.handle, d.displayName, wish, redo) });
      it.push({ label: '<i class=v3e data-i=cart></i>' + 'Onde comprar', sub: 'comparar preços nas lojas', fn: () => whereToBuy(book) });
    }
    it.push({ label: '<i class=v3e data-i=send></i>' + 'Indicar a alguém', fn: () => recommendToFriend(book) });
    try { popMenu(n, it); } catch (err) { console.warn('menu da capa', err); }
  };
  try { Object.assign(V3EMO, { send: '<path d="M20.5 3.5 3.5 10.5l7 2.5 2.5 7z"/><path d="M20.5 3.5 10.5 13"/>' }); } catch {}
  const vFnSafe = (k) => { try { return typeof vFn === 'function' ? vFn(k) : true; } catch { return true; } };
  const abrir = (n) => {
    const t0 = titulo(n); if (!t0) return; let e = null; try { e = lvOwnBook(t0, n.dataset.a || n.dataset.author || ''); } catch {}
    longAt = window.lvLongAt = Date.now(); try { navigator.vibrate && navigator.vibrate(12); } catch {}
    const d = perfilDeOutra(n); if (d) return menuPerfil(n, d, t0, e);
    if (e) { try { return v5Menu(e); } catch { try { return bookMenuOpen(n, { e, title: e.title }); } catch {} } return; }
    const item = { title: t0, cover: capaUrl(n) };
    try { popMenu(n, [{ label: 'Ver o livro', fn: () => openAnyBook(t0, '', item.cover) }, { label: '<i class=v3e data-i=plus></i>' + 'Adicionar à Biblioteca', sub: 'Quero ler, Lendo ou Já li', fn: () => addToLibrary(item) }]); } catch {}
  };
  TR.addEventListener('pointerdown', (ev) => { const n = capa(ev); if (!n) return; cv = n; x0 = ev.clientX; y0 = ev.clientY; clearTimeout(t); t = setTimeout(() => { const n2 = cv; clear(); if (n2) abrir(n2); }, 450); }, true);
  TR.addEventListener('pointermove', (ev) => { if (cv && (Math.abs(ev.clientX - x0) > 10 || Math.abs(ev.clientY - y0) > 10)) clear(); }, true);
  ['pointerup', 'pointercancel'].forEach((k) => TR.addEventListener(k, clear, true));
  TR.addEventListener('contextmenu', (ev) => { const n = capa(ev); if (!n) return; ev.preventDefault(); clear(); abrir(n); }, true);
  // o toque que termina o "segurar" não abre a página do livro por baixo do menu
  TR.addEventListener('click', (ev) => { if (Date.now() - longAt < 700 && capa(ev)) { ev.preventDefault(); ev.stopPropagation(); } }, true);
  // na Busca o cartão inteiro abre o livro por outro ouvinte que roda antes; o toque que solta o "segurar" é barrado já na janela (Bia, 21/11)
  window.addEventListener('click', (ev) => { if (Date.now() - longAt < 700 && ev.composedPath && ev.composedPath().some((n) => n && n.classList && (n.classList.contains('cv') || n.classList.contains('ct-it')))) { ev.preventDefault(); ev.stopImmediatePropagation(); } }, true);
  // sem a lupa de seleção de texto/imagem do celular ao segurar a capa
  const st = document.createElement('style'); st.textContent = '.cv{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}'; TR.append(st); }
