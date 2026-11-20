// Página do livro, aba "Rede" (Bia, 16/11): comentários (posts da Rede) e avaliações de todo mundo sobre o livro, inclusive os seus (com borda destacada), em ordem de postagem,
// com curtir e responder. Filtros: tipo (tudo, avaliações, comentários), nota e "sem spoiler". Vale também para livro do catálogo.
const bookKeyRede = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 200); // igual ao bear_book_key da API
S.bkRede = S.bkRede || {}; S.bkF = S.bkF || { tipo: 'tudo', nota: '', semSp: false };
{ const st = document.createElement('style'); st.textContent = `
.bp-rede{display:grid;gap:.6rem}
.bp-rede .br-top{display:flex;justify-content:space-between;align-items:center;gap:.5rem}
.bp-rede .br-avg b{font-size:1.1rem}.bp-rede .br-avg small{display:block;font-size:.74rem;color:var(--ink-2);font-weight:700}
.bp-rede .rd-new2{border:0;background:var(--acc);color:var(--on-acc,#fff);border-radius:99px;padding:.45rem .9rem;font:inherit;font-weight:800;font-size:.84rem}
.br-f{display:flex;gap:.35rem;flex-wrap:wrap;align-items:center}
.br-f button,.br-f select{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.32rem .75rem;font:inherit;font-weight:800;font-size:.8rem}
.br-f button.on{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.bp-rede .bp-load{margin:0}
.bp-rede .rd-card.mine{border-color:var(--acc)}
`; TR.append(st); }
{ const v = $('#shelflist'); let tm = 0;
  const fill = async () => {
    const body = v.querySelector('.sl-body'); if (!body || v.hidden) return;
    const hero = body.querySelector('.bp-hero'), slot = body.querySelector('.bp-tc'); if (!hero || !slot || slot.querySelector('.bp-rede')) return;
    const title = (hero.querySelector('h2') || {}).textContent || '', author = (hero.querySelector('small') || {}).textContent || '', key = bookKeyRede(title);
    if (!key) return;
    const sec = document.createElement('section'); sec.className = 'bp-rede'; slot.append(sec);
    if (!connected() || !socialProfile) { sec.innerHTML = '<p class="bp-load">Entre na sua conta (com um @usuário) para ver o que estão dizendo sobre este livro.</p>'; return; }
    sec.innerHTML = '<p class="bp-load">Carregando…</p>';
    let data = S.bkRede[key];
    if (!data || Date.now() - data.at > 2 * 60000) {
      const [a, b] = await Promise.all([sapi('GET', '/v1/rede?book=' + encodeURIComponent(key)).catch(() => null), sapi('GET', '/v1/books/reviews?key=' + encodeURIComponent(normT(title).slice(0, 200))).catch(() => null)]);
      const posts = a && a.status === 200 && a.data ? (a.data.items || []).filter((x) => x.type !== 'review') : [];
      const net = b && b.status === 200 && b.data ? b.data : {};
      const seen = new Set(); const revs = [];
      const asRev = (x, mine) => ({ type: 'review', id: x.id, user: x.user, paws: x.paws, text: x.text, spoiler: !!x.spoiler, createdAt: x.updatedAt, mine: !!mine, readerPct: x.readerPct ?? null, bookStatus: x.bookStatus || null });
      if (net.mine) { revs.push(asRev(net.mine, true)); seen.add(net.mine.id); }
      for (const x of [...(net.friends || []), ...(net.public || [])]) if (!seen.has(x.id)) { seen.add(x.id); revs.push(asRev(x, false)); }
      data = { posts, revs, avg: net.avg ?? null, count: net.count || 0, at: Date.now() }; S.bkRede[key] = data;
    }
    if (!sec.isConnected) return;
    // a sua avaliação aparece mesmo se for privada (só você vê)
    const lr = lib().find((x) => normT(x.title) === normT(title)), my = lr && reviewOfLib(lr);
    const mineLocal = !data.revs.some((r) => r.mine) && my && (my.paws || my.texto) ? [{ type: 'review', id: 'me-local', user: { handle: socialProfile.handle, displayName: socialProfile.displayName || NAME }, paws: my.paws || null, text: my.texto || null, spoiler: !!my.spoiler, createdAt: lr.finishedAt || todayISO(), mine: true, local: true, readerPct: readerPctOf(title) }] : [];
    const draw = () => {
      const F = S.bkF;
      let list = [...mineLocal, ...data.revs, ...data.posts].map((x) => ({ ...x, mine: !!(x.mine || (x.user && socialProfile && x.user.handle === socialProfile.handle)) }));
      if (F.tipo === 'aval') list = list.filter((x) => x.type === 'review'); else if (F.tipo === 'com') list = list.filter((x) => x.type !== 'review');
      if (F.nota) list = list.filter((x) => { const p = Number(x.paws) || 0; return F.nota === '5' ? p >= 5 : F.nota === '4' ? p >= 4 && p < 5 : F.nota === '3' ? p >= 3 && p < 4 : p > 0 && p < 3; });
      if (F.semSp) list = list.filter((x) => x.mine || !(x.spoiler || x.spoilerKind));
      list.sort((a, z) => new Date(z.createdAt) - new Date(a.createdAt)); // por ordem de postagem (mais recente primeiro)
      const total = mineLocal.length + data.revs.length + data.posts.length;
      sec.innerHTML = '<div class="br-top"><div class="br-avg">' + (data.avg != null ? '<b>' + esc(pawTxt(data.avg)) + '</b><small>média de ' + plural(data.count, 'nota', 'notas') + '</small>' : '<small>Ainda sem avaliações</small>') + '</div><button type="button" class="rd-new2">+ Comentar</button></div>'
        + (total ? '<div class="br-f">' + [['tudo', 'Tudo'], ['aval', 'Avaliações'], ['com', 'Comentários']].map(([k, n]) => '<button type="button" data-t="' + k + '" class="' + (F.tipo === k ? 'on' : '') + '">' + n + '</button>').join('')
          + '<select data-n aria-label="Filtrar por nota"><option value="">Todas as notas</option><option value="5">Nota 5</option><option value="4">4 e 4,5</option><option value="3">3 e 3,5</option><option value="2">Abaixo de 3</option></select>'
          + '<button type="button" data-sp class="' + (F.semSp ? 'on' : '') + '">Sem spoiler</button></div>' : '')
        + (list.length ? list.map((it, i) => rdCardHTML({ ...it, book: null }, i, it.local ? { noFoot: true } : {})).join('')
          : '<p class="bp-load">' + (total ? 'Nada com esses filtros.' : 'Ninguém comentou nem avaliou este livro ainda. Que tal começar?') + '</p>');
      const sel = sec.querySelector('select[data-n]'); if (sel) sel.value = F.nota;
      sec.querySelectorAll('.rd-card').forEach((c) => { const it = list[+c.dataset.i]; if (it && it.mine) c.classList.add('mine'); });
      sec.querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', () => { F.tipo = b.dataset.t; draw(); }));
      sel?.addEventListener('change', () => { F.nota = sel.value; draw(); });
      sec.querySelector('[data-sp]')?.addEventListener('click', () => { F.semSp = !F.semSp; draw(); });
      sec.querySelector('.rd-new2').addEventListener('click', () => { try { openRdComposer({ book: { title, author: author || null, cover: lr ? lr.cover || null : null } }); } catch (err) { console.warn(err); } });
      rdBind(sec, list, draw);
    };
    draw();
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(fill, 80); }).observe(v, { childList: true, subtree: true });
}
