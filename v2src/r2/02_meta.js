// Página da meta (rodada 2): ano numa lista (só anos com leitura), "•••" com as ações, sem botão grande,
// toque num livro lido abre as opções dele, e o ano não se repete nos cartões.
{ const st = document.createElement('style'); st.textContent = `
.gp-yb{display:inline-flex;align-items:center;gap:.25rem;min-height:36px;padding:0 .7rem;border:1px solid var(--line);border-radius:99px;background:var(--panel);color:var(--ink);font:inherit;font-weight:800;font-size:.9rem}
.gp-yb svg{width:14px;height:14px}
.gp-acts{display:flex;align-items:center;gap:.4rem;margin-left:auto}
.gp-more{width:40px;height:36px;border:1px solid var(--line);border-radius:99px;background:var(--panel);color:var(--ink);font:inherit;font-weight:900;letter-spacing:.05em}
.gp-page{min-width:0;max-width:100%}.gp-page .ys{width:100%;min-width:0;overflow:hidden}
.gp-page .ys .ys-y{display:none}
.gp-page .gp-h{margin-top:1rem}
`; TR.append(st); }
openGoalPage = function (year) {
  const v = $('#shelflist');
  const draw = () => {
    const today = todayISO(), cy = Number(today.slice(0, 4)), y = year || cy;
    const lidos = lib().filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(String(y))).sort((a, b) => String(b.finishedAt).localeCompare(String(a.finishedAt)));
    const target = Number((db.yearGoals || {})[y]) || 0, done = lidos.length, pct = target ? Math.min(100, Math.round((done / target) * 100)) : 0;
    const years = [...new Set([cy, ...lib().filter((e) => e.status === 'LIDO' && e.finishedAt).map((e) => Number(String(e.finishedAt).slice(0, 4)))])].filter(Boolean).sort((a, b) => b - a);
    let lines = '';
    if (!target) lines = y === cy ? '<p>Você ainda não definiu a meta deste ano. Toque em ••• para definir.</p>' : '<p>Sem meta registrada neste ano.</p>';
    else if (y < cy) lines = `<p>${done >= target ? 'Meta batida.' : `Faltaram ${plural(target - done, 'livro', 'livros')}.`}</p>`;
    else {
      const end = `${y}-12-31`, daysLeft = Math.max(1, between(today, end) + 1), daysGone = between(`${y}-01-01`, today) + 1, left = Math.max(0, target - done);
      const proj = Math.floor((done / daysGone) * (daysGone + daysLeft - 1));
      lines = done >= target ? '<p>Meta batida. Tudo o que vier agora é bônus.</p>'
        : `<p>Faltam ${plural(left, 'livro', 'livros')} em ${plural(daysLeft, 'dia', 'dias')}.</p><p>No seu ritmo, você chega a ${proj}${proj >= target ? ' e bate a meta' : ''}. Para bater: 1 livro a cada ${Math.max(1, Math.floor(daysLeft / left))} dias.</p>`;
    }
    v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Meta</b><span class="gp-acts">${years.length > 1 ? `<button type="button" class="gp-yb" id="gp-y" aria-label="Escolher ano">${y}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg></button>` : ''}<button type="button" class="gp-more" id="gp-more" aria-label="Mais opções da meta">•••</button></span></div><div class="gp-page">
      <div class="gp-top"><div class="gp-ring" style="--p:${pct}"><div><b>${done}</b><small>${target ? `de ${target}` : 'lidos'}</small></div></div><div class="gp-txt"><b>${target ? `${pct}% da meta` : `${plural(done, 'livro lido', 'livros lidos')}`}</b>${lines}</div></div>
      <div id="gp-ys"></div>
      <div class="gp-h"><b>Lidos · ${done}</b></div>
      <div class="sl-list">${lidos.map((e) => slItem(e).replace('<i>›</i>', `<i>${esc(fmt(e.finishedAt))} ›</i>`)).join('') || '<p class="sl-empty">Nenhum livro terminado neste ano ainda.</p>'}</div></div>`;
    paintCv(v);
    S.ysYear = y; const a = $('#gp-ys', v); mountYearShelf(v, a, ysItems(), true); a.remove();
    const ysH = v.querySelector('.ys .ys-h > b'); if (ysH) ysH.textContent = 'Por mês';
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; S.listRedraw = null; refresh(); });
    $('#gp-y', v)?.addEventListener('click', (ev) => popMenu(ev.currentTarget, years.map((n) => ({ label: String(n), on: n === y, fn: () => { year = n; draw(); } }))));
    $('#gp-more', v).addEventListener('click', (ev) => {
      const items = [];
      if (y === cy) items.push({ label: target ? 'Alterar meta' : 'Definir meta', sub: target ? `hoje: ${plural(target, 'livro', 'livros')}` : 'quantos livros neste ano', fn: () => { editMetas(); const ed = $('#editor'), wait = () => { if (!ed.hidden) return setTimeout(wait, 250); if (!v.hidden) draw(); }; setTimeout(wait, 250); } });
      if (y === cy && done) items.push({ label: 'Gerar “Meu ano em livros”', sub: 'imagem para compartilhar', fn: () => shareYear() });
      items.push({ label: 'Ver estatísticas', sub: 'páginas, ritmo e dias seguidos', fn: () => { v.hidden = true; S.listRedraw = null; goTab('progresso'); } });
      if (y === cy && target) items.push(0, { label: 'Tirar a meta deste ano', danger: true, fn: () => { delete (db.yearGoals || {})[y]; save(); draw(); toast('Meta tirada'); } });
      popMenu(ev.currentTarget, items);
    });
    $$('.sl-item', v).forEach((b) => b.addEventListener('click', (ev) => {
      ev.stopImmediatePropagation(); const e = byId(b.dataset.id); if (!e) return;
      const rv = reviewOfLib(e);
      popMenu(b, [
        { label: rv && rv.paws ? 'Ver minha avaliação' : 'Avaliar', sub: rv && rv.paws ? pawTxt(rv.paws) : '', fn: () => rateForm(e, { logs: [] }, () => draw()) },
        { label: 'Abrir o livro', sub: 'progresso, trechos e anotação', fn: () => openBook(e.id) },
        { label: 'Ver no catálogo', sub: 'sinopse e ficha', fn: () => openBookPage(e) },
        { label: 'Indicar a alguém', fn: () => recommendToFriend(e) },
        { label: 'Ler de novo', fn: () => startReread(e) },
      ]);
    }, true));
    syncTopTitle();
  };
  S.listRedraw = draw; S.navView = { t: 'goal', a: [] }; closeEd(); v.classList.remove('feedview', 'tabroot'); draw(); v.hidden = false; v.scrollTop = 0;
};
