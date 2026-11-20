// Leituras por mês → "Expandir": página com cada mês em grade (capas maiores, nota em patas embaixo, mesmo destaque por nota).
// Voltar retorna para onde estava (perfil, perfil do amigo ou a tela de baixo).
{ const st = document.createElement('style'); st.textContent = `
.ys-h .ys-x{display:inline-grid;flex:none;margin-left:auto!important;place-items:center;width:28px;height:28px;border-radius:99px;border:1px solid var(--line);background:var(--panel);color:var(--ink);padding:0;margin-left:.15rem}
.ys-h .ys-x svg{width:14px;height:14px}
.ys-h:has(.ys-x) .ys-y{margin-left:auto}.ys-h:has(.ys-x) > b{margin-right:auto}
.yx-yr{display:flex;align-items:center;justify-content:center;gap:.6rem;margin:.2rem 0 .7rem}.yx-yr b{font-size:1.05rem;min-width:3rem;text-align:center}
.yx-yr button{width:32px;height:32px;border-radius:99px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:900;padding:0}.yx-yr button:disabled{opacity:.3}
.yx-sum{display:flex;justify-content:center;gap:.4rem;margin-bottom:.8rem}
.yx-m{margin:0 0 1.1rem}.yx-mh{display:flex;align-items:baseline;gap:.45rem;margin:0 0 .55rem}.yx-mh b{font-size:.95rem;color:var(--ink)}.yx-mh small{font-size:.74rem;color:var(--ink-2);font-weight:700}
.yx-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.8rem .55rem}
.yx-b{display:grid;gap:.3rem;border:0;background:none;padding:0;font:inherit;color:var(--ink);text-align:left;min-width:0}
.yx-b .cv{width:100%!important;height:auto!important;aspect-ratio:2/3;border-radius:3px 6px 6px 3px!important;font-size:.55rem!important;line-height:1.1}
.yx-b{position:relative}.yx-b .yx-mk{position:absolute!important;z-index:9001!important;top:-10px!important;left:6px!important}
.yx-b small{font-size:.66rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.yx-b .pw5 i,.yx-b .pw5 svg{width:10px;height:10px}
`; TR.append(st); }
{
  const EXP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
  const tier = (p) => (p >= 5 ? '5' : p >= 4.5 ? 'ouro rt-45' : p >= 4 ? 'ouro' : p >= 3 ? 'prata' : p ? 'bronze' : '');
  const _m = mountYearShelf;
  mountYearShelf = function (root, at, items, own) {
    const r = _m.apply(this, arguments); const sec = root && root.querySelector('.ys'); if (!sec) return r;
    const yy = sec.querySelector('.ys-h');
    if (yy && !sec.querySelector('.ys-x')) {
      yy.insertAdjacentHTML('beforeend', `<button type="button" class="ys-x" aria-label="Expandir leituras por mês" title="Expandir">${EXP}</button>`);
      sec.querySelector('.ys-x').addEventListener('click', () => openYearPage(items, own, Number(sec.querySelector('.ys-y > b')?.textContent) || S.ysYear || Number(todayISO().slice(0, 4))));
    }
    return r;
  };
  function openYearPage(items, own, year) {
    navEnter(() => openYearPage(items, own, year));
    const v = $('#shelflist');
    const fromMe = !v.hidden && v.classList.contains('mine-page'), fromFriend = !fromMe && !v.hidden && S.fpData && S.fpData.handle ? S.fpData.handle : null;
    const years = [...new Set(items.map((x) => Number(String(x.d).slice(0, 4))).filter(Boolean))].sort((a, b) => b - a);
    let y = years.includes(year) ? year : years[0];
    const back = () => { if (fromMe) { v.hidden = true; goTab('eu'); } else if (fromFriend) friendPage(fromFriend); else v.hidden = true; };
    const draw = () => {
      const list = items.filter((x) => Number(String(x.d).slice(0, 4)) === y).sort((a, b) => String(a.d).localeCompare(String(b.d)));
      const groups = []; for (let m = 1; m <= 12; m++) { const g = list.filter((x) => !x.ap && Number(String(x.d).slice(5, 7)) === m); if (g.length) groups.push([YS_MESES[m - 1], g]); }
      const sem = list.filter((x) => x.ap || !String(x.d).slice(5, 7)); if (sem.length) groups.push(['Sem mês', sem]);
      const pages = list.reduce((s, x) => s + (x.pg || 0), 0), yi = years.indexOf(y);
      const card = (x, i) => { let h = cvh(x.t, x.c, 'yx-cv'); const t = tier(x.p); if (t && !/\bcv rt\b/.test(h)) h = h.replace('<span class="cv ', `<span class="cv rt rt-${t} `).replace(/<\/span>$/, (t === '5' ? '<span class="rt-sp a">✦</span><span class="rt-sp b">✦</span><span class="rt-sp c">✦</span>' : '') + '</span>');
        const p = Number(x.p) || 0, mk = p ? `<span class="ys-mk yx-mk" style="--nimg:url(img/nota_${p >= 5 ? "5" : p >= 4 ? "ouro" : p >= 3 ? "prata" : "bronze"}.webp)"><b>${String(p).replace(".", ",")}</b></span>` : "";
        return `<button type="button" class="yx-b" data-i="${i}" title="${esc(x.t)}">${mk}${h}<small>${esc(x.t)}</small></button>`; };
      let k = 0; const flat = [];
      v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Leituras por mês</b><span></span></div>
        <div class="yx-yr"><button type="button" data-yy="${years[yi + 1] || ''}" ${years[yi + 1] ? '' : 'disabled'} aria-label="Ano anterior">‹</button><b>${y}</b><button type="button" data-yy="${years[yi - 1] || ''}" ${years[yi - 1] ? '' : 'disabled'} aria-label="Ano seguinte">›</button></div>
        <div class="es5-c yx-sum"><span>${plural(list.length, 'livro', 'livros')}</span>${pages ? `<span>${pages.toLocaleString('pt-BR')} páginas</span>` : ''}</div>
        ${groups.map(([n, g]) => `<section class="yx-m"><div class="yx-mh"><b>${n}</b><small>${plural(g.length, 'livro', 'livros')}</small></div><div class="yx-g">${g.map((x) => { flat.push(x); return card(x, k++); }).join('')}</div></section>`).join('') || '<p class="sl-empty">Nenhuma leitura neste ano.</p>'}`;
      v.querySelector('.sl-back').addEventListener('click', back);
      $$('[data-yy]', v).forEach((b) => b.addEventListener('click', () => { if (!b.dataset.yy) return; y = Number(b.dataset.yy); draw(); v.scrollTop = 0; }));
      $$('.yx-b', v).forEach((b) => b.addEventListener('click', () => { const x = flat[Number(b.dataset.i)]; if (!x) return; if (own && x.id && lib().some((e) => e.id === x.id)) openBook(x.id); else openAnyBook(x.t, x.a || null, x.c || null); }));
      paintCv(v); syncTopTitle();
    };
    S.listRedraw = draw; S.navView = null; closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page'); draw(); v.hidden = false; v.scrollTop = 0;
  }
}
