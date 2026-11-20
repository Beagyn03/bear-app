// Capa de livro como no protótipo (Bia, 20/11): TOCAR abre a página do livro; SEGURAR (~450 ms) abre o menu rápido do livro
// (no computador, clique direito também). Vale para as capas da Estante, listas, Comunidade, perfil e "Para você".
// Antes, tocar abria o menu. Segurar não dispara o toque, não abre o menu do navegador nem seleciona texto, e rolar a tela
// (dedo andou mais de 10 px) não abre nada. O anel do livro no Hoje já tinha esse comportamento (e0) e fica de fora daqui.
{ const SEL = '.es-bk, .v3-hb, .cs-bk, .tr-bk, .fd-post .nv-cv, .rc-it .cv, .fr-read, .fl-bk, .pv-bk';
  const st = document.createElement('style'); st.textContent = (SEL.split(',').map((x) => x.trim()).join(',') + '{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}'); TR.append(st);
  const hit = (ev) => { const p = ev.composedPath ? ev.composedPath() : [ev.target]; const t = p.find((n) => n && n.nodeType === 1 && n.closest); if (!t || !TR.contains(t)) return null; if (t.closest('#editor, .bkm, .bp-tabs, .es-more, [data-h3=book]')) return null; return t.closest(SEL); };
  const bookOf = (n) => {
    if (n.dataset.id) { const e = byId(n.dataset.id); if (e) return { e, title: e.title, author: e.author, cover: e.cover }; }
    if (n.dataset.book) return { title: n.dataset.book, author: n.dataset.author || null };
    if (n.classList.contains('tr-bk')) { const x = ((S.trends || {})[S.trTab] || [])[+n.dataset.i]; if (x) return { title: x.title, author: x.author, cover: x.cover }; }
    if (n.classList.contains('nv-cv')) { const t = n.closest('.fd-post').querySelector('header p b'); if (t) return { title: t.textContent }; }
    if (n.closest('.rc-it')) { const x = (S.recs || []).find((y) => y.id === n.closest('.rc-it').dataset.rc); if (x) return { title: x.title, author: x.author, cover: x.cover }; }
    if (n.classList.contains('pv-bk')) { const title = (n.querySelector('b') || {}).textContent || '', author = (n.querySelector('small') || {}).textContent || ''; const c = n.querySelector('.cv'), m = c && String(c.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/); return title ? { title, author: author || null, cover: m ? m[1] : null } : null; }
    return null; };
  const openPage = (b) => { try { if (b.e && lib().includes(b.e)) return openBookPage(b.e); return openAnyBook(b.title, b.author || null, b.cover || null); } catch (err) { console.warn('capa', err); } };
  const openMenu = (n, b) => { try { navigator.vibrate && navigator.vibrate(12); } catch {} try { bookQuickMenu(n.querySelector('.cv, .es-cv') || n, b); } catch (err) { console.warn('menu da capa', err); } };
  let lp = 0, start = null, fired = 0;
  document.addEventListener('pointerdown', (ev) => { const n = hit(ev); clearTimeout(lp); start = null; if (!n || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
    start = { n, x: ev.clientX, y: ev.clientY }; lp = setTimeout(() => { if (!start) return; const b = bookOf(start.n); if (!b) return; fired = Date.now(); openMenu(start.n, b); start = null; }, 450); }, true);
  document.addEventListener('pointermove', (ev) => { if (start && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 10) { clearTimeout(lp); start = null; } }, true);
  ['pointerup', 'pointercancel'].forEach((t) => document.addEventListener(t, () => { clearTimeout(lp); }, true));
  document.addEventListener('contextmenu', (ev) => { const n = hit(ev); if (!n) return; ev.preventDefault(); ev.stopPropagation(); clearTimeout(lp); start = null;
    if (Date.now() - fired < 900) return; const b = bookOf(n); if (b) { fired = Date.now(); openMenu(n, b); } }, true);
  document.addEventListener('click', (ev) => { if (Date.now() - fired < 900) { fired = 0; ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation(); return; } // o clique que o celular solta ao levantar o dedo (cairia num item do menu que acabou de abrir)
    const n = hit(ev); if (!n) return; ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
    const b = bookOf(n); if (b) openPage(b); }, true); }
// Dica no topo da Estante (como no protótipo), some ao tocar no X e não volta
{ const st = document.createElement('style'); st.textContent = '.v3tip{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;margin:0 0 12px;padding:10px 12px;border-radius:14px;background:color-mix(in srgb,#7e63c9 14%,var(--panel));border:1px solid color-mix(in srgb,#7e63c9 30%,var(--line));font-size:12.5px;line-height:1.4;color:var(--ink-2)}.v3tip b{color:var(--ink)}.v3tip button{flex:none;border:0;background:none;color:var(--ink-2);font:inherit;font-size:16px;line-height:1;padding:0 2px;cursor:pointer}'; TR.append(st);
  let tm = 0; const put = () => { if (S.tab !== 'estante' || ((db.prefs || {}).tipCapa)) return; const seg = TR.querySelector('#lista .esn-seg'); if (!seg || seg.parentElement.querySelector('.v3tip')) return;
    seg.insertAdjacentHTML('afterend', '<div class="v3tip"><span><b>Dica:</b> toque na capa para abrir o livro; segure para atualizar, terminar ou mudar o status sem abrir.</span><button type="button" aria-label="Entendi">×</button></div>');
    seg.parentElement.querySelector('.v3tip button').addEventListener('click', (ev) => { ev.stopPropagation(); db.prefs = { ...(db.prefs || {}), tipCapa: 1 }; save(); ev.currentTarget.closest('.v3tip').remove(); }); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 60); }).observe(TR, { childList: true, subtree: true }); }
