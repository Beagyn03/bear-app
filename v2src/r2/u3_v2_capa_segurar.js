// Segurar qualquer capa abre opções (Bia, 20/11; regra do protótipo: tocar abre a página, segurar abre o menu).
// Antes só valia na Estante. Agora vale em toda capa do app (Hoje, perfis, Top 3, Comunidade, Busca, Metas, páginas):
// livro seu → o menu do livro; livro que não está com você → Ver o livro / Adicionar à estante.
// A Estante continua com o gesto dela ([data-long]); aqui só entram as capas sem esse gesto.
{ let t = 0, x0 = 0, y0 = 0, cv = null, longAt = 0;
  const clear = () => { clearTimeout(t); t = 0; cv = null; };
  const capa = (ev) => { const p = ev.composedPath ? ev.composedPath() : [ev.target];
    for (const n of p) { if (!n || !n.classList) continue; if (n.hasAttribute && n.hasAttribute('data-long')) return null; if (n.classList.contains('cv')) return n; if (n === TR.host) break; } return null; };
  const titulo = (n) => String(n.dataset.t || n.getAttribute('aria-label') || n.textContent || '').trim();
  const capaUrl = (n) => { const m = /url\(["']?([^"')]+)["']?\)/.exec(n.style.backgroundImage || ''); return m ? m[1] : null; };
  const abrir = (n) => {
    const t0 = titulo(n); if (!t0) return; let e = null; try { e = lib().find((x) => normT(x.title) === normT(t0)); } catch {}
    longAt = Date.now(); try { navigator.vibrate && navigator.vibrate(12); } catch {}
    if (e) { try { return v5Menu(e); } catch { try { return bookMenuOpen(n, { e, title: e.title }); } catch {} } return; }
    const item = { title: t0, cover: capaUrl(n) };
    try { popMenu(n, [{ label: 'Ver o livro', fn: () => openAnyBook(t0, '', item.cover) }, { label: 'Adicionar à estante', fn: () => addToLibrary(item) }]); } catch {}
  };
  TR.addEventListener('pointerdown', (ev) => { const n = capa(ev); if (!n) return; cv = n; x0 = ev.clientX; y0 = ev.clientY; clearTimeout(t); t = setTimeout(() => { const n2 = cv; clear(); if (n2) abrir(n2); }, 450); }, true);
  TR.addEventListener('pointermove', (ev) => { if (cv && (Math.abs(ev.clientX - x0) > 10 || Math.abs(ev.clientY - y0) > 10)) clear(); }, true);
  ['pointerup', 'pointercancel'].forEach((k) => TR.addEventListener(k, clear, true));
  TR.addEventListener('contextmenu', (ev) => { const n = capa(ev); if (!n) return; ev.preventDefault(); clear(); abrir(n); }, true);
  // o toque que termina o "segurar" não abre a página do livro por baixo do menu
  TR.addEventListener('click', (ev) => { if (Date.now() - longAt < 700 && capa(ev)) { ev.preventDefault(); ev.stopPropagation(); } }, true);
  // sem a lupa de seleção de texto/imagem do celular ao segurar a capa
  const st = document.createElement('style'); st.textContent = '.cv{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}'; TR.append(st); }
