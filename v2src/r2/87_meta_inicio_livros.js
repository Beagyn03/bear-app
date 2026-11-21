// Meta do ano no Hoje (Bia, 17/11; Editar meta no ••• do cartão): embaixo da barra de progresso, as capas dos livros lidos no ano que contam para a meta,
// do mais recente para o mais antigo, e depois as vagas tracejadas que faltam.
{ const st = document.createElement('style'); st.textContent = `
.ini-meta.im2{padding:.7rem .85rem .75rem}
.ini-meta.im2 > i{margin-top:.5rem}
.im2-row{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin-top:.55rem;padding-bottom:2px}.im2-row::-webkit-scrollbar{display:none}
.im2-row .cv{flex:none;width:42px!important;height:63px!important;border-radius:4px!important;background-size:cover!important;background-position:center!important;font-size:.38rem!important;box-shadow:0 2px 5px rgba(0,0,0,.18)}
.im2-row .im2-v{flex:none;width:42px;height:63px;border-radius:4px;border:1.5px dashed var(--line);box-sizing:border-box;display:grid;place-items:center;font-size:.62rem;font-weight:900;color:var(--ink-2)}
.ini-meta.im2 small b{color:var(--acc);font-size:inherit}
.ini-meta.im2{position:relative;padding-right:2.6rem!important}.im2-ed{position:absolute;top:.45rem;right:.5rem;width:32px;height:32px;display:grid;place-items:center;font-size:.95rem;font-weight:900;letter-spacing:1px;color:var(--ink-2);cursor:pointer;border-radius:50%}
`; TR.append(st); }
{ let tm = 0; const paint = () => {
    const m = TR.querySelector('#ini-meta'); if (!m || m.classList.contains('im2')) return;
    const y = String(new Date().getFullYear()), goal = Number((db.yearGoals || {})[y]) || 0;
    const read = lib().filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').slice(0, 4) === y).sort((a, b) => String(a.finishedAt).localeCompare(String(b.finishedAt))).reverse();
    if (!goal && !read.length) return;
    const left = Math.max(0, goal - read.length);
    m.classList.add('im2');
    const sm = m.querySelector('small'); if (sm) sm.innerHTML = read.length + ' de ' + goal + ' livros' + (left ? ' · faltam <b>' + left + '</b>' : ' · <b>meta batida</b>');
    const tt = m.querySelector('b'); if (tt && !m.querySelector('.im2-ed')) { m.insertAdjacentHTML('beforeend', '<span class="im2-ed" role="button" tabindex="0" aria-label="Opções da meta">•••</span>');
      m.querySelector('.im2-ed').addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault(); popMenu(ev.currentTarget, [{ label: 'Editar meta', fn: () => setYearGoal(Number(y)) }, { label: 'Ver a meta do ano', fn: () => openGoalPage() }]); }); }
    const row = document.createElement('div'); row.className = 'im2-row';
    row.innerHTML = read.map((e) => cvh(e.title, e.cover, '')).join('') + Array.from({ length: Math.min(left, 12) }, (_, i) => '<span class="im2-v">' + (read.length + i + 1) + '</span>').join('');
    m.append(row); try { paintCv(row); } catch {}
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 70); }).observe(TR, { childList: true, subtree: true }); }
