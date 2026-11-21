// Reteste no navegador (Bia, 20/11), página do livro:
// - M2: "Minha leitura › Biblioteca › Tirar daqui" abria a janela do navegador com outro aviso. Agora é a mesma ação do menu
//   ("Remover livro", folha do app, 30 dias em Removidos recentemente) e com o mesmo nome.
{ const bookHere = () => { const t = ((TR.querySelector('#shelflist .bp-hero h2') || {}).textContent || '').trim(); if (!t) return null; try { return lib().find((x) => normT(x.title) === normT(t)) || null; } catch { return null; } };
  TR.addEventListener('click', (ev) => {
    const p = ev.composedPath ? ev.composedPath() : []; const b = p.find((n) => n && n.dataset && n.dataset.a === 'rmlib'); if (!b) return;
    const e = bookHere(); if (!e) return; ev.stopPropagation(); ev.preventDefault();
    try { v5Sheet('v5rm', { e }); } catch (err) { console.warn('remover livro', err); } }, true);
  const v = $('#shelflist'); let tm = 0;
  const fix = () => { tm = 0; if (!v || v.hidden) return; v.querySelectorAll('.bp-adj[data-a=rmlib] b').forEach((x) => { if (x.textContent !== 'Remover livro') x.textContent = 'Remover livro'; }); };
  if (v) new MutationObserver(() => { if (!tm) tm = setTimeout(fix, 60); }).observe(v, { childList: true, subtree: true }); }
// - M7: estante aberta a partir do Você herdava a marca do perfil (mine-page): ficava sem seta de voltar e sem o "•••".
//   Excluir de dentro da página agora fecha a página na hora (antes ficava presa numa tela "Estante" vazia).
{ const _os = openShelfV3; openShelfV3 = function () { try { const v = $('#shelflist'); if (v) v.classList.remove('mine-page'); } catch {} S.v4fromMe = false; return _os.apply(this, arguments); };
  TR.addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : []; const b = p.find((n) => n && n.dataset && n.dataset.a === 'v5shdel'); if (!b) return;
    setTimeout(() => { const v = $('#shelflist'); if (!v || v.hidden || !v.classList.contains('v6shp')) return; const t = ((TR.querySelector('#g-t') || {}).textContent || '').trim();
      if (!(db.shelves || []).some((s) => s.name === t)) { v.hidden = true; try { goTab('estante'); } catch {} } }, 60); }, true); }
// o "•••" da página da estante sumia quando a lista era redesenhada depois de aberta (l2 só põe na abertura): recoloca sempre
{ const v = $('#shelflist'); let tm = 0;
  const fix = () => { tm = 0; if (!v || v.hidden) return; const bar = v.querySelector('.sl-body > .esv-bar'); if (!bar || bar.querySelector('.v6dots')) return;
    const nm = ((v.querySelector('.sl-body > .sl-top > b') || {}).textContent || '').trim(); const sh = (db.shelves || []).find((s) => s.name === nm); if (!sh) return;
    v.classList.add('v6shp'); const b = document.createElement('button'); b.type = 'button'; b.className = 'v6dots'; b.setAttribute('aria-label', 'Opções da estante'); b.textContent = '•••';
    b.addEventListener('click', (ev) => { ev.stopPropagation(); try { v5Sheet('v5shm', { sh: sh.id, page: 'sh:' + sh.id }); } catch (err) { console.warn('estante', err); } }); bar.append(b); };
  if (v) new MutationObserver(() => { if (!tm) tm = setTimeout(fix, 80); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// "Adicionar livros" de dentro da página da estante: ao salvar, a página mostra os livros novos (antes continuava "0 livros")
{ const _pb = pickBooksFor; pickBooksFor = function (s, after) { return _pb.call(this, s, function () { try { if (after) after.apply(this, arguments); } catch {}
    try { const v = $('#shelflist'); if (s && v && !v.hidden && v.classList.contains('v6shp')) openShelfV3('sh:' + s.id); } catch {} }); }; }
