// Conquistas no perfil: carrossel com o nome embaixo, ordenar (Padrão, Raras primeiro, A–Z) e sem imagem repetida
// (a conquista antiga e a nova que a substituiu têm a mesma imagem: aparece uma vez só).
{ const st = document.createElement('style'); st.textContent = `
.ach-car{display:flex;gap:.6rem;overflow-x:auto;scrollbar-width:none;padding:.1rem .1rem .3rem;scroll-snap-type:x proximity}
.ach-car::-webkit-scrollbar{display:none}
.ach-it{flex:none;width:76px;display:flex;flex-direction:column;align-items:center;gap:.25rem;scroll-snap-align:start;text-align:center}
.ach-it span{width:64px;height:64px;border-radius:14px;border:1px solid var(--line);background:var(--bg);display:grid;place-items:center}
.ach-it.rare span{border-color:#e0a526;box-shadow:0 0 0 2px color-mix(in srgb,#e0a526 30%,transparent)}
.ach-it img{width:52px;height:52px;object-fit:contain}
.ach-it small{font-size:.66rem;line-height:1.2;color:var(--ink-2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ach-sort{margin-left:auto;border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.78rem;min-height:32px}
`; TR.append(st); }
{
  const _fp = friendPage;
  friendPage = async function (h) {
    const r = await _fp.apply(this, arguments); const v = $('#shelflist'), d = S.fpData; if (v.hidden || !d || d.handle !== h || !d.achievements) return r;
    const shelf = v.querySelector('.v3-shelf'); if (!shelf || shelf.dataset.car) return r;
    const sec = shelf.closest('section'), head = sec && sec.querySelector('.v3-sh');
    const seen = new Set(); const won = [...(d.achievements.won || [])].sort((x, y) => (/edição antiga/.test(x.n) ? 1 : 0) - (/edição antiga/.test(y.n) ? 1 : 0)).filter((a) => DECO_IMG[a.k] && !seen.has(a.k) && seen.add(a.k)).map((a, i) => ({ ...a, i, n: String(a.n || '').replace(/ \(edição antiga\)$/, '') }));
    let mode = 'padrao';
    const paint = () => {
      const list = mode === 'raras' ? [...won].sort((a, b) => (b.rare ? 1 : 0) - (a.rare ? 1 : 0) || a.i - b.i) : mode === 'az' ? [...won].sort((a, b) => a.n.localeCompare(b.n, 'pt-BR')) : won;
      shelf.innerHTML = list.map((a) => `<div class="ach-it${a.rare ? ' rare' : ''}" title="${esc(a.n)}"><span><img src="${DECO_IMG[a.k]}" alt=""></span><small>${esc(a.n)}</small></div>`).join('');
    };
    shelf.dataset.car = 1; shelf.className = 'ach-car'; paint();
    const b = head && head.querySelector('b'); if (b) b.textContent = `Conquistas · ${won.length} de ${d.achievements.total || 0}`;
    if (head && !head.querySelector('.ach-more')) {
      head.style.display = 'flex'; head.style.alignItems = 'center';
      head.insertAdjacentHTML('beforeend', '<button type="button" class="ach-more" aria-label="Opções das conquistas">•••</button>');
      const verTodas = () => {
        if (d.self) return openAchList();
        const got = new Set((d.achievements.won || []).map((a) => a.k));
        const all = ACHIEVEMENTS.map((a) => ({ a, ok: got.has(a.reward) })).sort((x, y) => (y.ok ? 1 : 0) - (x.ok ? 1 : 0));
        const wrap = document.createElement('div'); wrap.className = 'sheet ach-all-sh';
        wrap.innerHTML = '<div class="box"><h3>Conquistas de ' + esc(String(d.displayName || d.handle).split(' ')[0]) + '</h3><p class="hint">' + won.length + ' de ' + (d.achievements.total || all.length) + ' conquistadas</p><div class="ach-all">'
          + all.map(({ a, ok }) => '<div class="ach-all-it' + (ok ? '' : ' off') + '"><img src="' + (DECO_IMG[a.reward] || '') + '" alt=""><b>' + esc(a.name) + '</b><small>' + esc(ok ? 'conquistada' : a.desc) + '</small></div>').join('')
          + '</div><button type="button" class="cancel">Fechar</button></div>';
        const close = () => wrap.remove(); wrap.addEventListener('click', (ev) => { if (ev.target === wrap) close(); }); wrap.querySelector('.cancel').addEventListener('click', close);
        document.body.append(wrap);
      };
      head.querySelector('.ach-more').addEventListener('click', (ev) => {
        const anchor = ev.currentTarget;
        const items = [{ label: 'Ver todas as conquistas', fn: verTodas }];
        if (d.self && won.length > 1) items.push({ label: 'Ordenar', sub: { padrao: 'Padrão', raras: 'Raras primeiro', az: 'A–Z' }[mode], fn: () => setTimeout(() => popMenu(anchor, [['padrao', 'Padrão'], ['raras', 'Raras primeiro'], ['az', 'A–Z']].map(([k, t]) => ({ label: t, on: mode === k, fn: () => { mode = k; paint(); } }))), 30) });
        popMenu(anchor, items);
      });
    }
    return r;
  };
}

{ const st = document.createElement('style'); st.textContent = `.ach-more{margin-left:auto;border:0;background:none;color:var(--ink-2);font:inherit;font-weight:900;font-size:1rem;letter-spacing:.08em;padding:.2rem .4rem;cursor:pointer}`; TR.append(st);
  const st2 = document.createElement('style'); st2.textContent = `.ach-all{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;max-height:60vh;overflow:auto;margin:.4rem 0 .6rem}
.ach-all-it{display:grid;justify-items:center;text-align:center;gap:.15rem}.ach-all-it img{width:56px;height:56px}.ach-all-it b{font-size:.74rem;line-height:1.15}.ach-all-it small{font-size:.64rem;color:var(--ink-2);line-height:1.2}
.ach-all-it.off img{filter:grayscale(1);opacity:.45}`; document.head.append(st2); }
